import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REPO = "koba-yashi666/Kobayashi-Bot";
const BRANCH = "main";
const ROOT = process.cwd();

const LOCAL_VERSION_FILE = path.join(ROOT, "version.json");
const STAGING_DIR = path.join(ROOT, ".koba-update-tmp");
const BACKUP_DIR = path.join(ROOT, ".koba-update-backup");

const PROTECTED_PATHS = [
  "settings/settings.json",
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

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Kobayashi-Bot-Updater",
      Accept: "application/vnd.github+json"
    },
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`GitHub respondeu HTTP ${res.status}`);
  return res.json();
}

export async function getRemoteVersion() {
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/version.json?t=${Date.now()}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Kobayashi-Bot-Updater" },
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`Não consegui ler version.json (HTTP ${res.status})`);
  const data = await res.json();
  return data?.version || "0.0.0";
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

async function getRepositoryTree() {
  const url = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const data = await fetchJson(url);

  if (data?.truncated) {
    throw new Error("A lista de arquivos do GitHub veio incompleta.");
  }

  return (data?.tree || []).filter((item) => item.type === "blob");
}

async function downloadFile(rel, destination) {
  const encoded = rel.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encoded}?t=${Date.now()}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Kobayashi-Bot-Updater" },
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`Falha ao baixar ${rel} (HTTP ${res.status})`);

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, buffer);
}

function ensureSafeRepoStructure(treePaths) {
  // Evita atualizar a partir de um repositório que perdeu as pastas no upload.
  const required = [
    "index.js",
    "connection.js",
    "version.json",
    "settings/imports/consts.js",
    "settings/imports/menus.js",
    "settings/settings.json",
    "lib/groupCache.js"
  ];

  const missing = required.filter((file) => !treePaths.has(file));
  if (missing.length) {
    throw new Error(
      "A estrutura do GitHub ainda está incompleta. Faltam: " + missing.join(", ")
    );
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

export async function applyUpdate({ force = false } = {}) {
  const status = await checkUpdate();

  if (!force && !status.available) {
    return { ...status, updated: false, files: 0 };
  }

  const tree = await getRepositoryTree();
  const treePaths = new Set(tree.map((item) => cleanPath(item.path)));
  ensureSafeRepoStructure(treePaths);

  const files = tree
    .map((item) => cleanPath(item.path))
    .filter((rel) => rel && !isProtected(rel));

  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  try {
    // Primeiro baixa tudo. Nada do bot é alterado enquanto o download não terminar.
    for (const rel of files) {
      await downloadFile(rel, path.join(STAGING_DIR, rel));
    }

    backupCurrent(files);

    // Só depois substitui os arquivos.
    for (const rel of files) {
      const staged = path.join(STAGING_DIR, rel);
      const target = path.join(ROOT, rel);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(staged, target);
    }

    // Atualiza dependências caso package.json/package-lock tenham mudado.
    installDependencies();

    fs.rmSync(STAGING_DIR, { recursive: true, force: true });

    return {
      ...status,
      remote: getLocalVersion(),
      updated: true,
      files: files.length
    };
  } catch (error) {
    try { restoreBackup(); } catch {}
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
    throw error;
  }
}
