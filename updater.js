import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

const REPO = "koba-yashi666/Kobayashi-Bot";
const BRANCH = "main";
const ROOT = process.cwd();

const LOCAL_VERSION_FILE = path.join(ROOT, "version.json");
const STAGING_DIR = path.join(ROOT, ".koba-update-tmp");
const BACKUP_DIR = path.join(ROOT, ".koba-update-backup");
const ARCHIVE_FILE = path.join(os.tmpdir(), "kobayashi-update-main.tar.gz");

const PROTECTED_PATHS = [
  "settings/settings.json",
  "settings/LOGOS/menu.png",
  "settings.json",
  "files/database/",
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
    "User-Agent": "Kobayashi-Bot-Updater/1.0.15",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
}

export async function getRemoteVersion() {
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
      return data?.version || "0.0.0";
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Não consegui ler version.json remoto: ${lastError?.message || "erro desconhecido"}`);
}

export async function checkUpdate() {
  const local = getLocalVersion();
  const remote = await getRemoteVersion();
  return {
    local,
    remote,
    available: compareVersions(remote, local) > 0
  };
}

async function downloadArchive() {
  const urls = [
    `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}`,
    `https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz`
  ];

  let lastError;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: githubHeaders({ Accept: "application/octet-stream" }),
        redirect: "follow",
        cache: "no-store"
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());

      if (buffer.length < 1024) {
        throw new Error("arquivo de atualização muito pequeno");
      }

      fs.writeFileSync(ARCHIVE_FILE, buffer);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Falha ao baixar atualização do GitHub: ${lastError?.message || "erro desconhecido"}`);
}

function extractArchive() {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const result = spawnSync("tar", ["-xzf", ARCHIVE_FILE, "-C", STAGING_DIR, "--strip-components=1"], {
    stdio: "pipe",
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`Não consegui extrair atualização: ${result.stderr || result.stdout || "tar falhou"}`);
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

function ensureSafeRepoStructure(treePaths) {
  const required = [
    "index.js",
    "connection.js",
    "version.json",
    "settings/imports/consts.js",
    "settings/imports/menus.js",
    "settings/settings.json",
    "settings/LOGOS/menu.png",
    "lib/groupCache.js"
  ];

  const missing = required.filter((file) => !treePaths.has(file));
  if (missing.length) {
    throw new Error("A estrutura baixada está incompleta. Faltam: " + missing.join(", "));
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

  if (result.status !== 0) {
    throw new Error("npm install terminou com erro.");
  }
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
  const status = await checkUpdate();

  if (!force && !status.available) {
    return { ...status, updated: false, files: 0 };
  }

  try {
    await downloadArchive();
    extractArchive();

    const tree = walkFiles(STAGING_DIR);
    const treePaths = new Set(tree);
    ensureSafeRepoStructure(treePaths);

    const files = tree.filter((rel) => rel && !isProtected(rel));

    backupCurrent(files);

    for (const rel of files) {
      const staged = path.join(STAGING_DIR, rel);
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
      releaseNotes: readInstalledReleaseNotes()
    };
  } catch (error) {
    try { restoreBackup(); } catch {}
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
    try { fs.rmSync(ARCHIVE_FILE, { force: true }); } catch {}
    throw error;
  }
}
