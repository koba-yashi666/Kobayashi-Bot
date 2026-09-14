import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const VERSION = "4.0.1";
const DIST_ROOT = path.join(ROOT, "dist");
const WORK = path.join(DIST_ROOT, `Kobayashi-Bot-v${VERSION}-Cliente-Protegido`);
const ZIP = path.join(DIST_ROOT, `Kobayashi-Bot-v${VERSION}-Cliente-Protegido.zip`);

const ROOT_FILES = new Set([
  "bootstrap.js",
  "connection.js",
  "index.js",
  "updater.js",
  "package.json",
  "package-lock.json",
  "version.json",
  "release-notes.json",
  "start.sh",
  ".gitignore",
  "KOBAYASHI-CREDITOS.txt"
]);

const KEEP_DIRS = [
  "assets",
  "commands",
  "lib",
  "media",
  "settings/FUN",
  "settings/LOGOS",
  "settings/imports",
  "files/functions",
  "files/sticker-packs",
  "tools"
];

const OMIT_EXACT = new Set([
  "settings/settings.json",
  "scripts/build-client.mjs",
  "tools/.DS_Store"
]);

const OMIT_PREFIXES = [
  "node_modules/",
  ".git/",
  ".npm/",
  ".koba-update-backup/",
  ".koba-update-tmp/",
  "files/database/",
  "files/license/",
  "dist/"
];

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

function isAllowed(relative) {
  if (ROOT_FILES.has(relative)) return true;
  if (relative === "settings/logos.json") return true;
  return KEEP_DIRS.some((dir) => relative === dir || relative.startsWith(`${dir}/`));
}

function shouldOmit(relative) {
  if (OMIT_EXACT.has(relative)) return true;
  if (OMIT_PREFIXES.some((prefix) => relative.startsWith(prefix))) return true;
  if (/\.zip$/i.test(relative) || /\.tar\.gz$/i.test(relative)) return true;
  if (/^README-v/i.test(relative)) return true;
  if (relative === "V3-MIGRATION-REPORT.json" || relative === "V3-API-DEFERIDOS.txt") return true;
  return false;
}

function listFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const relative = rel(full);

    if (relative.startsWith("dist/")) continue;
    if (OMIT_PREFIXES.some((prefix) => `${relative}/`.startsWith(prefix))) continue;

    if (entry.isDirectory()) {
      listFiles(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function encodeChar(ch) {
  const code = ch.charCodeAt(0);
  if (code <= 0xff) return `\\x${code.toString(16).padStart(2, "0")}`;
  return `\\u${code.toString(16).padStart(4, "0")}`;
}

// Safe ESM-compatible obfuscation:
// - only transforms ordinary single/double quoted literals with no pre-existing escape.
// - imports/exports remain syntactically valid.
// - template literals and regexes are untouched to avoid semantic changes.
function obfuscateJavaScript(source) {
  let out = "";
  let i = 0;

  const previousToken = () => {
    const before = source.slice(0, i).replace(/\s+$/g, "");
    const word = before.match(/([A-Za-z_$][\w$]*)$/)?.[1] || "";
    return { char: before.slice(-1), word };
  };

  const regexCanStart = () => {
    const { char, word } = previousToken();
    if (!char) return true;
    if ("([{:;,=!?&|+-*%^~<>".includes(char)) return true;
    return ["return", "throw", "case", "delete", "void", "typeof", "instanceof", "in", "of", "yield", "await"].includes(word);
  };

  while (i < source.length) {
    // Preserve comments exactly so quotes inside comments are never parsed as code strings.
    if (source[i] === "/" && source[i + 1] === "/") {
      const j = source.indexOf("\n", i + 2);
      if (j === -1) {
        out += source.slice(i);
        break;
      }
      out += source.slice(i, j + 1);
      i = j + 1;
      continue;
    }

    if (source[i] === "/" && source[i + 1] === "*") {
      const j = source.indexOf("*/", i + 2);
      if (j === -1) {
        out += source.slice(i);
        break;
      }
      out += source.slice(i, j + 2);
      i = j + 2;
      continue;
    }

    // Preserve regular-expression literals. This avoids interpreting quotes or
    // character classes inside /.../ as ordinary JavaScript string literals.
    if (source[i] === "/" && source[i + 1] !== "/" && source[i + 1] !== "*" && regexCanStart()) {
      let j = i + 1;
      let escaped = false;
      let charClass = false;
      while (j < source.length) {
        const ch = source[j];
        if (escaped) {
          escaped = false;
          j++;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          j++;
          continue;
        }
        if (ch === "[") charClass = true;
        else if (ch === "]") charClass = false;
        else if (ch === "/" && !charClass) {
          j++;
          while (j < source.length && /[A-Za-z]/.test(source[j])) j++;
          break;
        }
        if (ch === "\n" || ch === "\r") break;
        j++;
      }
      out += source.slice(i, j);
      i = j;
      continue;
    }

    const quote = source[i];

    if (quote !== "'" && quote !== '"') {
      out += source[i++];
      continue;
    }

    let j = i + 1;
    let raw = "";
    let escaped = false;
    let valid = true;

    while (j < source.length) {
      const ch = source[j];

      if (escaped) {
        valid = false;
        escaped = false;
        raw += ch;
        j++;
        continue;
      }

      if (ch === "\\") {
        valid = false;
        escaped = true;
        raw += ch;
        j++;
        continue;
      }

      if (ch === quote) break;

      if (ch === "\n" || ch === "\r") {
        valid = false;
        break;
      }

      raw += ch;
      j++;
    }

    if (j >= source.length || source[j] !== quote) {
      out += source[i++];
      continue;
    }

    const original = source.slice(i, j + 1);

    if (!valid || raw.length < 3) {
      out += original;
    } else {
      out += quote + [...raw].map(encodeChar).join("") + quote;
    }

    i = j + 1;
  }

  return `/* Kobayashi Protected Distribution v${VERSION} */\n${out}`;
}

function shouldObfuscate(relative) {
  return (
    relative.endsWith(".js") ||
    relative.endsWith(".mjs")
  ) && !relative.endsWith("check-local-imports.mjs");
}

function copyProject() {
  fs.rmSync(WORK, { recursive: true, force: true });
  fs.mkdirSync(WORK, { recursive: true });

  const copied = [];
  const protectedFiles = [];
  const omitted = [];

  for (const src of listFiles(ROOT)) {
    const relative = rel(src);

    if (shouldOmit(relative) || !isAllowed(relative)) {
      omitted.push(relative);
      continue;
    }

    const target = path.join(WORK, relative);
    ensureParent(target);

    if (shouldObfuscate(relative)) {
      const source = fs.readFileSync(src, "utf8");
      fs.writeFileSync(target, obfuscateJavaScript(source), "utf8");
      protectedFiles.push(relative);
    } else {
      fs.copyFileSync(src, target);
    }

    copied.push(relative);
  }

  // Sanitized buyer configuration: never export the creator's session,
  // API tokens, admin list or personal runtime configuration.
  const buyerSettings = {
    prefix: "/",
    NomeDoBot: "Kobayashi Bot",
    ownerName: "Dono",
    ownerNumber: "",
    channeldl: "",
    channel: "https://whatsapp.com/channel/0029Vb8j6MyGk1FzGOr4EP3M",
    newsletterName: "🐉🌸 Kobayashi Bot • Canal Oficial",
    version: VERSION,
    theme: "🐉🌸 Kobayashi Bot",
    creatorName: "Luiz G. / Kobayashi",
    leaders: ["", "", "", "", ""],
    yutaToken: "",
    antiPv: false,
    antiPvMode: "aluguel"
  };

  const settingsTarget = path.join(WORK, "settings/settings.json");
  ensureParent(settingsTarget);
  fs.writeFileSync(settingsTarget, JSON.stringify(buyerSettings, null, 2) + "\n");

  fs.mkdirSync(path.join(WORK, "files/database"), { recursive: true });
  fs.mkdirSync(path.join(WORK, "files/license"), { recursive: true });
  fs.writeFileSync(path.join(WORK, "files/database/.gitkeep"), "");
  fs.writeFileSync(path.join(WORK, "files/license/.gitkeep"), "");

  const buyerReadme = `KOBAYASHI BOT v${VERSION} — EDIÇÃO CLIENTE PROTEGIDA

Esta edição é destinada ao comprador/licenciado.

1. Configure settings/settings.json
2. Instale as dependências:
   npm install
3. Configure o servidor de licença e o manifesto oficial quando fornecidos pelo criador.
4. Ative a chave:
   npm run license:activate -- SUA-CHAVE
5. Confira:
   npm run license:status
6. Inicie:
   npm start

Termux:
   pkg update -y
   pkg install nodejs git unzip -y
   cd ~/Kobayashi-Bot
   npm install
   npm run license:activate -- SUA-CHAVE
   npm start

Arquivos locais como sessão, bancos de dados, licença ativada e logs são criados na própria instalação.
A venda ou redistribuição sem autorização do criador não é permitida.
`;
  fs.writeFileSync(path.join(WORK, "README-COMPRADOR.txt"), buyerReadme, "utf8");

  return { copied, protectedFiles, omitted };
}

function syntaxCheck() {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && /\.(?:js|mjs)$/i.test(full)) files.push(full);
    }
  };
  walk(WORK);
  for (const file of files) {
    const r = spawnSync(process.execPath, ["--check", file], {
      encoding: "utf8",
      stdio: "pipe"
    });
    if (r.status !== 0) {
      throw new Error(`Falha de sintaxe após proteção em ${path.relative(WORK, file)}:\n${r.stderr}`);
    }
  }
  return files.length;
}

function zipBuild() {
  fs.rmSync(ZIP, { force: true });
  const r = spawnSync("zip", ["-qr", ZIP, "."], {
    cwd: WORK,
    encoding: "utf8",
    stdio: "pipe"
  });
  if (r.status !== 0) throw new Error(r.stderr || "Falha ao gerar ZIP");
  return crypto.createHash("sha256").update(fs.readFileSync(ZIP)).digest("hex");
}

try {
  fs.mkdirSync(DIST_ROOT, { recursive: true });
  const report = copyProject();
  const checked = syntaxCheck();
  const sha256 = zipBuild();

  const reportData = {
    version: VERSION,
    generatedAt: new Date().toISOString(),
    copiedFiles: report.copied.length,
    protectedFiles: report.protectedFiles,
    protectedCount: report.protectedFiles.length,
    omittedCount: report.omitted.length,
    syntaxChecked: checked,
    sha256
  };

  fs.writeFileSync(
    path.join(DIST_ROOT, `Kobayashi-Bot-v${VERSION}-build-report.json`),
    JSON.stringify(reportData, null, 2)
  );

  console.log(`✅ Cliente protegido: ${ZIP}`);
  console.log(`🔐 JS protegidos: ${report.protectedFiles.length}`);
  console.log(`🧪 JS/MJS validados: ${checked}`);
  console.log(`🧹 Itens ignorados/removidos: ${report.omitted.length}`);
  console.log(`SHA-256: ${sha256}`);
} catch (error) {
  console.error(`❌ ${error?.message || error}`);
  process.exitCode = 1;
}
