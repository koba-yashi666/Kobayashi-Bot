import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = process.cwd();
const SKIP = new Set(["node_modules", ".git", "session", "sessions", "auth", "auth_info_baileys"]);
const importRegex = /(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}

function existsLocal(baseFile, spec) {
  const base = path.resolve(path.dirname(baseFile), spec);
  const candidates = [
    base,
    `${base}.js`,
    path.join(base, "index.js"),
    `${base}.mjs`,
    `${base}.cjs`
  ];
  return candidates.some(p => fs.existsSync(p));
}

const missing = [];
for (const file of walk(ROOT)) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(importRegex)) {
    const spec = match[1];
    if (!spec.startsWith(".")) continue;
    if (!existsLocal(file, spec)) {
      missing.push(`${path.relative(ROOT, file)} -> ${spec}`);
    }
  }
}

if (missing.length) {
  console.error("\n❌ Kobayashi Import Guard encontrou imports locais quebrados:\n");
  for (const item of missing) console.error(`- ${item}`);
  console.error("\nCorrija os caminhos antes de iniciar o bot.\n");
  process.exit(1);
}

console.log("✅ Kobayashi Import Guard: todos os imports locais estão válidos.");
