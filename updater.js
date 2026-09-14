import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { assertUpdateLicense, getLicenseConfig } from "./lib/features/license/licenseManager.js";

const REPO = "koba-yashi666/Kobayashi-Bot";
const BRANCH = "main";
const ROOT = process.cwd();

const LOCAL_VERSION_FILE = path.join(ROOT, "version.json");
const STAGING_DIR = path.join(ROOT, ".koba-update-tmp");
const BACKUP_DIR = path.join(ROOT, ".koba-update-backup");
const ARCHIVE_FILE = path.join(os.tmpdir(), "kobayashi-update-package");

const PROTECTED_PATHS = [
  "settings/settings.json",
  "settings/LOGOS/menu.png",
  "settings.json",
  "files/database/",
  "files/license/",
  ".env",
  ".git/",
  "node_modules/",
  ".koba-update-tmp/",
  ".koba-update-backup/"
];

function cleanPath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

function isProtected(file) {
  const rel = cleanPath(file);
  return PROTECTED_PATHS.some((item) => {
    if (item.endsWith("/")) return rel === item.slice(0, -1) || rel.startsWith(item);
    return rel === item;
  });
}

function numericVersion(v) {
  const match = String(v || "").replace(/^v/i, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : [0, 0, 0];
}

export function compareVersions(a, b) {
  const av = numericVersion(a);
  const bv = numericVersion(b);
  for (let i = 0; i < 3; i++) {
    if (av[i] > bv[i]) return 1;
    if (av[i] < bv[i]) return -1;
  }
  return 0;
}

export function getLocalVersion() {
  try {
    const data = JSON.parse(fs.readFileSync(LOCAL_VERSION_FILE, "utf8"));
    return data?.version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function githubHeaders(extra = {}) {
  const token = process.env.KOBAYASHI_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
  return {
    "User-Agent": "Kobayashi-Bot-Updater/4.0.0",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
}

async function getManifest() {
  const cfg = getLicenseConfig();

  if (cfg.manifestUrl) {
    const res = await fetch(`${cfg.manifestUrl}${cfg.manifestUrl.includes("?") ? "&" : "?"}t=${Date.now()}`, {
      headers: { "user-agent": "Kobayashi-Bot-Updater/4.0.0", accept: "application/json" },
      cache: "no-store"
    });
    if (!res.ok) throw new Error(`Manifesto oficial respondeu HTTP ${res.status}`);
    const data = await res.json();

    if (!data?.version || !data?.downloadUrl) {
      throw new Error("Manifesto oficial inválido: version e downloadUrl são obrigatórios.");
    }

    if (data?.channel && cfg.channel && data.channel !== cfg.channel) {
      throw new Error(`Canal incompatível. Instalação: ${cfg.channel}; manifesto: ${data.channel}`);
    }

    return {
      source: "manifest",
      version: String(data.version),
      downloadUrl: String(data.downloadUrl),
      sha256: String(data.sha256 || "").toLowerCase(),
      channel: String(data.channel || cfg.channel || "stable"),
      minimumVersion: String(data.minimumVersion || ""),
      notes: data.notes || null
    };
  }

  // Fallback do criador/desenvolvimento enquanto o repositório de releases
  // separado ainda não foi configurado.
  const urls = [
    `https://raw.githubusercontent.com/${REPO}/${BRANCH}/version.json?t=${Date.now()}`,
    `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}/version.json?t=${Date.now()}`
  ];

  let lastError;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: githubHeaders({ Accept: "application/json" }),
        cache: "no-store"
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        source: "github-branch",
        version: String(data?.version || "0.0.0"),
        downloadUrl: `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}`,
        sha256: "",
        channel: "development",
        minimumVersion: "",
        notes: null
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Não consegui consultar a versão remota: ${lastError?.message || "erro desconhecido"}`);
}

export async function getRemoteVersion() {
  return (await getManifest()).version;
}

export async function checkUpdate({ requireLicense = false } = {}) {
  const local = getLocalVersion();
  if (requireLicense) await assertUpdateLicense(local);

  const manifest = await getManifest();
  return {
    local,
    remote: manifest.version,
    available: compareVersions(manifest.version, local) > 0,
    source: manifest.source,
    channel: manifest.channel,
    manifest
  };
}

async function downloadArchive(manifest) {
  const res = await fetch(manifest.downloadUrl, {
    headers: manifest.source === "github-branch"
      ? githubHeaders({ Accept: "application/octet-stream" })
      : { "user-agent": "Kobayashi-Bot-Updater/4.0.0", accept: "application/octet-stream" },
    redirect: "follow",
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`Falha ao baixar atualização: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  if (buffer.length < 1024) throw new Error("Pacote de atualização muito pequeno.");

  if (manifest.sha256) {
    const actual = crypto.createHash("sha256").update(buffer).digest("hex").toLowerCase();
    if (actual !== manifest.sha256) {
      throw new Error(`SHA-256 inválido. Esperado ${manifest.sha256}, recebido ${actual}.`);
    }
  }

  fs.writeFileSync(ARCHIVE_FILE, buffer);
}

function extractArchive(manifest) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const isZip = /\.zip(?:\?|$)/i.test(manifest.downloadUrl);
  let result;

  if (isZip) {
    result = spawnSync("unzip", ["-oq", ARCHIVE_FILE, "-d", STAGING_DIR], {
      stdio: "pipe",
      encoding: "utf8"
    });
  } else {
    result = spawnSync("tar", ["-xzf", ARCHIVE_FILE, "-C", STAGING_DIR, "--strip-components=1"], {
      stdio: "pipe",
      encoding: "utf8"
    });
  }

  if (result.status !== 0) {
    throw new Error(`Não consegui extrair atualização: ${result.stderr || result.stdout || "extração falhou"}`);
  }
}

function walkFiles(dir, base = dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, base, output);
    else if (entry.isFile()) output.push(cleanPath(path.relative(base, full)));
  }
  return output;
}

function resolvePackageRoot() {
  if (fs.existsSync(path.join(STAGING_DIR, "index.js"))) return STAGING_DIR;

  const dirs = fs.readdirSync(STAGING_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(STAGING_DIR, e.name));

  const candidate = dirs.find((dir) => fs.existsSync(path.join(dir, "index.js")));
  return candidate || STAGING_DIR;
}

function ensureSafeRepoStructure(root, treePaths) {
  const required = ["index.js", "version.json", "package.json"];
  const missing = required.filter((file) => !treePaths.has(file));
  if (missing.length) {
    throw new Error("Pacote de atualização incompleto. Faltam: " + missing.join(", "));
  }
}

function backupCurrent(files) {
  fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  for (const rel of files) {
    const current = path.join(ROOT, rel);
    if (!fs.existsSync(current) || !fs.statSync(current).isFile()) continue;

    const backup = path.join(BACKUP_DIR, rel);
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(current, backup);
  }
}

function restoreBackup() {
  if (!fs.existsSync(BACKUP_DIR)) return;

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const rel = path.relative(BACKUP_DIR, full);
        const target = path.join(ROOT, rel);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(full, target);
      }
    }
  };

  walk(BACKUP_DIR);
}

function installDependencies() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, ["install", "--no-audit", "--no-fund"], {
    cwd: ROOT,
    stdio: "inherit"
  });
  if (result.status !== 0) throw new Error("npm install terminou com erro.");
}

function readInstalledReleaseNotes() {
  try {
    const file = path.join(ROOT, "release-notes.json");
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export async function applyUpdate({ force = false } = {}) {
  const local = getLocalVersion();
  const license = await assertUpdateLicense(local);
  const status = await checkUpdate();

  if (!force && !status.available) {
    return { ...status, updated: false, files: 0, license };
  }

  const manifest = status.manifest;

  if (manifest.minimumVersion && compareVersions(local, manifest.minimumVersion) < 0) {
    throw new Error(`Esta atualização exige no mínimo a versão ${manifest.minimumVersion}.`);
  }

  try {
    await downloadArchive(manifest);
    extractArchive(manifest);

    const packageRoot = resolvePackageRoot();
    const tree = walkFiles(packageRoot);
    const treePaths = new Set(tree);
    ensureSafeRepoStructure(packageRoot, treePaths);

    const files = tree.filter((rel) => rel && !isProtected(rel));
    backupCurrent(files);

    for (const rel of files) {
      const staged = path.join(packageRoot, rel);
      const target = path.join(ROOT, rel);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(staged, target);
    }

    installDependencies();

    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
    try { fs.rmSync(ARCHIVE_FILE, { force: true }); } catch {}

    return {
      ...status,
      remote: getLocalVersion(),
      updated: true,
      files: files.length,
      license,
      releaseNotes: readInstalledReleaseNotes()
    };
  } catch (error) {
    try { restoreBackup(); } catch {}
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
    try { fs.rmSync(ARCHIVE_FILE, { force: true }); } catch {}
    throw error;
  }
}
