/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import os from "\x6e\x6f\x64\x65\x3a\x6f\x73";
import crypto from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";
import { spawnSync } from "\x6e\x6f\x64\x65\x3a\x63\x68\x69\x6c\x64\x5f\x70\x72\x6f\x63\x65\x73\x73";
import { assertUpdateLicense, getLicenseConfig } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6c\x69\x63\x65\x6e\x73\x65\x2f\x6c\x69\x63\x65\x6e\x73\x65\x4d\x61\x6e\x61\x67\x65\x72\x2e\x6a\x73";

const REPO = "\x6b\x6f\x62\x61\x2d\x79\x61\x73\x68\x69\x36\x36\x36\x2f\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x42\x6f\x74";
const BRANCH = "\x6d\x61\x69\x6e";
const ROOT = process.cwd();

const LOCAL_VERSION_FILE = path.join(ROOT, "\x76\x65\x72\x73\x69\x6f\x6e\x2e\x6a\x73\x6f\x6e");
const STAGING_DIR = path.join(ROOT, "\x2e\x6b\x6f\x62\x61\x2d\x75\x70\x64\x61\x74\x65\x2d\x74\x6d\x70");
const BACKUP_DIR = path.join(ROOT, "\x2e\x6b\x6f\x62\x61\x2d\x75\x70\x64\x61\x74\x65\x2d\x62\x61\x63\x6b\x75\x70");
const ARCHIVE_FILE = path.join(os.tmpdir(), "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x75\x70\x64\x61\x74\x65\x2d\x70\x61\x63\x6b\x61\x67\x65");

const PROTECTED_PATHS = [
  "\x73\x65\x74\x74\x69\x6e\x67\x73\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2e\x6a\x73\x6f\x6e",
  "\x73\x65\x74\x74\x69\x6e\x67\x73\x2f\x4c\x4f\x47\x4f\x53\x2f\x6d\x65\x6e\x75\x2e\x70\x6e\x67",
  "\x73\x65\x74\x74\x69\x6e\x67\x73\x2e\x6a\x73\x6f\x6e",
  "\x66\x69\x6c\x65\x73\x2f\x64\x61\x74\x61\x62\x61\x73\x65\x2f",
  "\x66\x69\x6c\x65\x73\x2f\x6c\x69\x63\x65\x6e\x73\x65\x2f",
  "\x2e\x65\x6e\x76",
  "\x2e\x67\x69\x74\x2f",
  "\x6e\x6f\x64\x65\x5f\x6d\x6f\x64\x75\x6c\x65\x73\x2f",
  "\x2e\x6b\x6f\x62\x61\x2d\x75\x70\x64\x61\x74\x65\x2d\x74\x6d\x70\x2f",
  "\x2e\x6b\x6f\x62\x61\x2d\x75\x70\x64\x61\x74\x65\x2d\x62\x61\x63\x6b\x75\x70\x2f"
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
    const data = JSON.parse(fs.readFileSync(LOCAL_VERSION_FILE, "\x75\x74\x66\x38"));
    return data?.version || "\x30\x2e\x30\x2e\x30";
  } catch {
    return "\x30\x2e\x30\x2e\x30";
  }
}

function githubHeaders(extra = {}) {
  const token = process.env.KOBAYASHI_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
  return {
    "\x55\x73\x65\x72\x2d\x41\x67\x65\x6e\x74": "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x42\x6f\x74\x2d\x55\x70\x64\x61\x74\x65\x72\x2f\x34\x2e\x30\x2e\x30",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
}

async function getManifest() {
  const cfg = getLicenseConfig();

  if (cfg.manifestUrl) {
    const res = await fetch(`${cfg.manifestUrl}${cfg.manifestUrl.includes("?") ? "&" : "?"}t=${Date.now()}`, {
      headers: { "\x75\x73\x65\x72\x2d\x61\x67\x65\x6e\x74": "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x42\x6f\x74\x2d\x55\x70\x64\x61\x74\x65\x72\x2f\x34\x2e\x30\x2e\x30", accept: "\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e" },
      cache: "\x6e\x6f\x2d\x73\x74\x6f\x72\x65"
    });
    if (!res.ok) throw new Error(`Manifesto oficial respondeu HTTP ${res.status}`);
    const data = await res.json();

    if (!data?.version || !data?.downloadUrl) {
      throw new Error("\x4d\x61\x6e\x69\x66\x65\x73\x74\x6f\x20\x6f\x66\x69\x63\x69\x61\x6c\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x3a\x20\x76\x65\x72\x73\x69\x6f\x6e\x20\x65\x20\x64\x6f\x77\x6e\x6c\x6f\x61\x64\x55\x72\x6c\x20\x73\xe3\x6f\x20\x6f\x62\x72\x69\x67\x61\x74\xf3\x72\x69\x6f\x73\x2e");
    }

    if (data?.channel && cfg.channel && data.channel !== cfg.channel) {
      throw new Error(`Canal incompatível. Instalação: ${cfg.channel}; manifesto: ${data.channel}`);
    }

    return {
      source: "\x6d\x61\x6e\x69\x66\x65\x73\x74",
      version: String(data.version),
      downloadUrl: String(data.downloadUrl),
      sha256: String(data.sha256 || "").toLowerCase(),
      channel: String(data.channel || cfg.channel || "\x73\x74\x61\x62\x6c\x65"),
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
        headers: githubHeaders({ Accept: "\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e" }),
        cache: "\x6e\x6f\x2d\x73\x74\x6f\x72\x65"
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        source: "\x67\x69\x74\x68\x75\x62\x2d\x62\x72\x61\x6e\x63\x68",
        version: String(data?.version || "\x30\x2e\x30\x2e\x30"),
        downloadUrl: `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}`,
        sha256: "",
        channel: "\x64\x65\x76\x65\x6c\x6f\x70\x6d\x65\x6e\x74",
        minimumVersion: "",
        notes: null
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Não consegui consultar a versão remota: ${lastError?.message || "\x65\x72\x72\x6f\x20\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f"}`);
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
    headers: manifest.source === "\x67\x69\x74\x68\x75\x62\x2d\x62\x72\x61\x6e\x63\x68"
      ? githubHeaders({ Accept: "\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6f\x63\x74\x65\x74\x2d\x73\x74\x72\x65\x61\x6d" })
      : { "\x75\x73\x65\x72\x2d\x61\x67\x65\x6e\x74": "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x42\x6f\x74\x2d\x55\x70\x64\x61\x74\x65\x72\x2f\x34\x2e\x30\x2e\x30", accept: "\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6f\x63\x74\x65\x74\x2d\x73\x74\x72\x65\x61\x6d" },
    redirect: "\x66\x6f\x6c\x6c\x6f\x77",
    cache: "\x6e\x6f\x2d\x73\x74\x6f\x72\x65"
  });

  if (!res.ok) throw new Error(`Falha ao baixar atualização: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  if (buffer.length < 1024) throw new Error("\x50\x61\x63\x6f\x74\x65\x20\x64\x65\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x20\x6d\x75\x69\x74\x6f\x20\x70\x65\x71\x75\x65\x6e\x6f\x2e");

  if (manifest.sha256) {
    const actual = crypto.createHash("\x73\x68\x61\x32\x35\x36").update(buffer).digest("\x68\x65\x78").toLowerCase();
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
    result = spawnSync("\x75\x6e\x7a\x69\x70", ["\x2d\x6f\x71", ARCHIVE_FILE, "-d", STAGING_DIR], {
      stdio: "\x70\x69\x70\x65",
      encoding: "\x75\x74\x66\x38"
    });
  } else {
    result = spawnSync("\x74\x61\x72", ["\x2d\x78\x7a\x66", ARCHIVE_FILE, "-C", STAGING_DIR, "\x2d\x2d\x73\x74\x72\x69\x70\x2d\x63\x6f\x6d\x70\x6f\x6e\x65\x6e\x74\x73\x3d\x31"], {
      stdio: "\x70\x69\x70\x65",
      encoding: "\x75\x74\x66\x38"
    });
  }

  if (result.status !== 0) {
    throw new Error(`Não consegui extrair atualização: ${result.stderr || result.stdout || "\x65\x78\x74\x72\x61\xe7\xe3\x6f\x20\x66\x61\x6c\x68\x6f\x75"}`);
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
  if (fs.existsSync(path.join(STAGING_DIR, "\x69\x6e\x64\x65\x78\x2e\x6a\x73"))) return STAGING_DIR;

  const dirs = fs.readdirSync(STAGING_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(STAGING_DIR, e.name));

  const candidate = dirs.find((dir) => fs.existsSync(path.join(dir, "\x69\x6e\x64\x65\x78\x2e\x6a\x73")));
  return candidate || STAGING_DIR;
}

function ensureSafeRepoStructure(root, treePaths) {
  const required = ["\x69\x6e\x64\x65\x78\x2e\x6a\x73", "\x76\x65\x72\x73\x69\x6f\x6e\x2e\x6a\x73\x6f\x6e", "\x70\x61\x63\x6b\x61\x67\x65\x2e\x6a\x73\x6f\x6e"];
  const missing = required.filter((file) => !treePaths.has(file));
  if (missing.length) {
    throw new Error("\x50\x61\x63\x6f\x74\x65\x20\x64\x65\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x20\x69\x6e\x63\x6f\x6d\x70\x6c\x65\x74\x6f\x2e\x20\x46\x61\x6c\x74\x61\x6d\x3a\x20" + missing.join(", "));
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
  const npm = process.platform === "\x77\x69\x6e\x33\x32" ? "\x6e\x70\x6d\x2e\x63\x6d\x64" : "\x6e\x70\x6d";
  const result = spawnSync(npm, ["\x69\x6e\x73\x74\x61\x6c\x6c", "\x2d\x2d\x6e\x6f\x2d\x61\x75\x64\x69\x74", "\x2d\x2d\x6e\x6f\x2d\x66\x75\x6e\x64"], {
    cwd: ROOT,
    stdio: "\x69\x6e\x68\x65\x72\x69\x74"
  });
  if (result.status !== 0) throw new Error("\x6e\x70\x6d\x20\x69\x6e\x73\x74\x61\x6c\x6c\x20\x74\x65\x72\x6d\x69\x6e\x6f\x75\x20\x63\x6f\x6d\x20\x65\x72\x72\x6f\x2e");
}

function readInstalledReleaseNotes() {
  try {
    const file = path.join(ROOT, "\x72\x65\x6c\x65\x61\x73\x65\x2d\x6e\x6f\x74\x65\x73\x2e\x6a\x73\x6f\x6e");
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, "\x75\x74\x66\x38"));
    return data && typeof data === "\x6f\x62\x6a\x65\x63\x74" ? data : null;
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
