import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

function readJson(file, fallback = {}) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}

const versionData = readJson(path.join(ROOT, "version.json"));
const VERSION = String(versionData?.version || "0.0.0");
const notes = readJson(path.join(ROOT, "release-notes.json"));
const release = notes?.[VERSION] || {};

const args = process.argv.slice(2);
function arg(name, fallback = "") {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? String(args[i + 1]) : fallback;
}

const baseUrl = arg("--base-url", process.env.KOBAYASHI_RELEASE_BASE_URL || "").replace(/\/+$/, "");
const channel = arg("--channel", process.env.KOBAYASHI_RELEASE_CHANNEL || "stable");
const minimumVersion = arg("--minimum-version", VERSION);
const dryRun = args.includes("--dry-run");

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+/.test(VERSION)) fail("version.json inválido.");
if (!baseUrl && !dryRun) {
  fail("Informe --base-url https://seu-dominio/releases ou use --dry-run.");
}

console.log(`🐉 Gerando edição protegida v${VERSION}...`);
const build = spawnSync(process.execPath, ["scripts/build-client.mjs"], {
  cwd: ROOT,
  stdio: "inherit"
});
if (build.status !== 0) fail("build:client falhou.");

const zipName = `Kobayashi-Bot-v${VERSION}-Cliente-Protegido.zip`;
const zipPath = path.join(DIST, zipName);
if (!fs.existsSync(zipPath)) fail(`ZIP não encontrado: ${zipPath}`);

const sha256 = crypto.createHash("sha256").update(fs.readFileSync(zipPath)).digest("hex");
const downloadUrl = baseUrl ? `${baseUrl}/${zipName}` : `UPLOAD/${zipName}`;

const latest = {
  version: VERSION,
  channel,
  downloadUrl,
  sha256,
  minimumVersion,
  publishedAt: new Date().toISOString(),
  notes: Array.isArray(release?.changes) ? release.changes : []
};

const latestPath = path.join(DIST, "latest.json");
fs.writeFileSync(latestPath, JSON.stringify(latest, null, 2) + "\n", "utf8");

const changelog = {
  version: VERSION,
  title: release?.title || versionData?.update || `Kobayashi Bot v${VERSION}`,
  date: release?.date || new Date().toISOString().slice(0,10),
  commands: Array.isArray(release?.commands) ? release.commands : [],
  changes: Array.isArray(release?.changes) ? release.changes : []
};
fs.writeFileSync(
  path.join(DIST, `changelog-v${VERSION}.json`),
  JSON.stringify(changelog, null, 2) + "\n",
  "utf8"
);

const publishInstructions = `KOBAYASHI RELEASE v${VERSION}

Arquivos para publicar no MESMO diretório público:
- ${zipName}
- latest.json
- changelog-v${VERSION}.json

Manifesto:
${JSON.stringify(latest, null, 2)}

Depois configure os clientes:
npm run license:configure -- --manifest ${baseUrl ? `${baseUrl}/latest.json` : "URL_PUBLICA/latest.json"}
npm run license:configure -- --channel ${channel}

Validação:
SHA-256 ${sha256}
`;

fs.writeFileSync(path.join(DIST, `PUBLICAR-v${VERSION}.txt`), publishInstructions, "utf8");

console.log("");
console.log("✅ Release oficial preparada.");
console.log(`📦 ${zipPath}`);
console.log(`📄 ${latestPath}`);
console.log(`🔐 SHA-256: ${sha256}`);
console.log(`📡 Canal: ${channel}`);
if (dryRun) console.log("🧪 Dry-run: nenhuma URL real foi exigida.");
