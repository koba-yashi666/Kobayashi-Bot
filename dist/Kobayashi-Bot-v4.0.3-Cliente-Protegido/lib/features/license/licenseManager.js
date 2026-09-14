/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import crypto from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";
import os from "\x6e\x6f\x64\x65\x3a\x6f\x73";

const ROOT = process.cwd();
const LICENSE_DIR = path.join(ROOT, "\x66\x69\x6c\x65\x73", "\x6c\x69\x63\x65\x6e\x73\x65");
const CONFIG_FILE = path.join(LICENSE_DIR, "\x63\x6f\x6e\x66\x69\x67\x2e\x6a\x73\x6f\x6e");
const STATE_FILE = path.join(LICENSE_DIR, "\x6c\x69\x63\x65\x6e\x73\x65\x2e\x6a\x73\x6f\x6e");

const CREATOR_OWNER_FALLBACK = "\x35\x35\x31\x35\x39\x39\x37\x30\x37\x35\x33\x30\x34";
const CACHE_MS = 7 * 24 * 60 * 60 * 1000;

function ensureDir() {
  fs.mkdirSync(LICENSE_DIR, { recursive: true });
}

function readJson(file, fallback = {}) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "\x75\x74\x66\x38"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDir();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, file);
}

function normalizeDigits(value = "") {
  return String(value || "").replace(/\D/g, "");
}

function getOwnerFromSettings() {
  try {
    const settings = readJson(path.join(ROOT, "\x73\x65\x74\x74\x69\x6e\x67\x73", "\x73\x65\x74\x74\x69\x6e\x67\x73\x2e\x6a\x73\x6f\x6e"), {});
    return normalizeDigits(settings?.ownerNumber);
  } catch {
    return "";
  }
}

export function getLicenseConfig() {
  const local = readJson(CONFIG_FILE, {});
  return {
    apiBase: String(local?.apiBase || process.env.KOBAYASHI_LICENSE_API || "").replace(/\/+$/, ""),
    manifestUrl: String(local?.manifestUrl || process.env.KOBAYASHI_RELEASE_MANIFEST || ""),
    channel: String(local?.channel || process.env.KOBAYASHI_RELEASE_CHANNEL || "\x73\x74\x61\x62\x6c\x65"),
    cacheDays: Number(local?.cacheDays || 7)
  };
}

export function saveLicenseConfig(patch = {}) {
  const current = getLicenseConfig();
  const next = {
    ...current,
    ...patch
  };
  writeJson(CONFIG_FILE, next);
  return next;
}

function machineSeed() {
  const parts = [
    os.hostname(),
    os.platform(),
    os.arch(),
    process.env.PREFIX || "",
    process.env.HOME || ""
  ];
  return parts.join("|");
}

export function getInstallationId() {
  ensureDir();
  const state = readJson(STATE_FILE, {});
  if (state.installationId) return state.installationId;

  const id = crypto
    .createHash("\x73\x68\x61\x32\x35\x36")
    .update(`${machineSeed()}|${crypto.randomUUID()}`)
    .digest("\x68\x65\x78")
    .slice(0, 32);

  writeJson(STATE_FILE, { ...state, installationId: id });
  return id;
}

export function getLicenseState() {
  ensureDir();
  const state = readJson(STATE_FILE, {});
  return {
    installationId: state.installationId || getInstallationId(),
    key: state.key || "",
    token: state.token || "",
    valid: Boolean(state.valid),
    plan: state.plan || "",
    customer: state.customer || "",
    updates: Boolean(state.updates),
    activatedAt: Number(state.activatedAt || 0),
    lastValidatedAt: Number(state.lastValidatedAt || 0),
    expiresAt: state.expiresAt || null,
    message: state.message || ""
  };
}

export function clearLicenseState() {
  const installationId = getInstallationId();
  writeJson(STATE_FILE, { installationId });
  return getLicenseState();
}

export function isCreatorInstallation() {
  const owner = getOwnerFromSettings();
  return Boolean(owner && owner === CREATOR_OWNER_FALLBACK);
}

export function getEffectiveLicense() {
  if (isCreatorInstallation()) {
    return {
      mode: "\x63\x72\x65\x61\x74\x6f\x72",
      valid: true,
      plan: "\x63\x72\x65\x61\x74\x6f\x72",
      customer: "\x43\x72\x69\x61\x64\x6f\x72\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69",
      updates: true,
      installationId: getInstallationId(),
      cached: false,
      needsOnlineValidation: false
    };
  }

  const state = getLicenseState();
  const maxAge = Math.max(1, getLicenseConfig().cacheDays || 7) * 24 * 60 * 60 * 1000;
  const cacheFresh = state.valid && state.lastValidatedAt && (Date.now() - state.lastValidatedAt <= maxAge);

  return {
    mode: "\x63\x75\x73\x74\x6f\x6d\x65\x72",
    ...state,
    cached: Boolean(cacheFresh),
    needsOnlineValidation: !cacheFresh
  };
}

async function apiRequest(pathname, payload) {
  const cfg = getLicenseConfig();
  if (!cfg.apiBase) {
    throw new Error(
      "\x53\x65\x72\x76\x69\x64\x6f\x72\x20\x64\x65\x20\x6c\x69\x63\x65\x6e\xe7\x61\x73\x20\x61\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x6f\x2e\x20\x43\x6f\x6e\x66\x69\x67\x75\x72\x65\x20\x63\x6f\x6d\x3a\x20\x6e\x70\x6d\x20\x72\x75\x6e\x20\x6c\x69\x63\x65\x6e\x73\x65\x3a\x63\x6f\x6e\x66\x69\x67\x75\x72\x65\x20\x2d\x2d\x20\x2d\x2d\x61\x70\x69\x20\x55\x52\x4c"
    );
  }

  const res = await fetch(`${cfg.apiBase}${pathname}`, {
    method: "\x50\x4f\x53\x54",
    headers: {
      "\x63\x6f\x6e\x74\x65\x6e\x74\x2d\x74\x79\x70\x65": "\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e",
      "\x75\x73\x65\x72\x2d\x61\x67\x65\x6e\x74": "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x42\x6f\x74\x2d\x4c\x69\x63\x65\x6e\x73\x65\x2f\x34\x2e\x30\x2e\x30"
    },
    body: JSON.stringify(payload)
  });

  let body = {};
  try { body = await res.json(); } catch {}

  if (!res.ok) {
    throw new Error(body?.message || `Servidor de licenças respondeu HTTP ${res.status}`);
  }

  return body;
}

function persistRemoteLicense(previous, data, key = previous?.key || "") {
  const now = Date.now();
  const state = {
    installationId: previous?.installationId || getInstallationId(),
    key,
    token: String(data?.token || previous?.token || ""),
    valid: Boolean(data?.valid),
    plan: String(data?.plan || previous?.plan || ""),
    customer: String(data?.customer || previous?.customer || ""),
    updates: data?.updates !== false && Boolean(data?.valid),
    activatedAt: Number(previous?.activatedAt || (data?.valid ? now : 0)),
    lastValidatedAt: data?.valid ? now : Number(previous?.lastValidatedAt || 0),
    expiresAt: data?.expiresAt || previous?.expiresAt || null,
    message: String(data?.message || "")
  };
  writeJson(STATE_FILE, state);
  return getLicenseState();
}

export async function activateLicense(key, version = "\x30\x2e\x30\x2e\x30") {
  const cleanKey = String(key || "").trim();
  if (!cleanKey) throw new Error("\x49\x6e\x66\x6f\x72\x6d\x65\x20\x61\x20\x63\x68\x61\x76\x65\x20\x64\x61\x20\x6c\x69\x63\x65\x6e\xe7\x61\x2e");

  const installationId = getInstallationId();
  const data = await apiRequest("\x2f\x61\x63\x74\x69\x76\x61\x74\x65", {
    key: cleanKey,
    installationId,
    version
  });

  if (!data?.valid) {
    persistRemoteLicense({ installationId }, data, cleanKey);
    throw new Error(data?.message || "\x4c\x69\x63\x65\x6e\xe7\x61\x20\x72\x65\x63\x75\x73\x61\x64\x61\x2e");
  }

  return persistRemoteLicense({ installationId }, data, cleanKey);
}

export async function validateLicense({ force = false, version = "\x30\x2e\x30\x2e\x30" } = {}) {
  if (isCreatorInstallation()) return getEffectiveLicense();

  const state = getLicenseState();
  if (!state.key) return getEffectiveLicense();

  const cfg = getLicenseConfig();
  const maxAge = Math.max(1, cfg.cacheDays || 7) * 24 * 60 * 60 * 1000;
  const cacheFresh = state.valid && state.lastValidatedAt && (Date.now() - state.lastValidatedAt <= maxAge);

  if (!force && cacheFresh) return getEffectiveLicense();

  const data = await apiRequest("\x2f\x76\x61\x6c\x69\x64\x61\x74\x65", {
    key: state.key,
    token: state.token,
    installationId: state.installationId,
    version
  });

  persistRemoteLicense(state, data, state.key);
  return getEffectiveLicense();
}

export async function assertUpdateLicense(version = "\x30\x2e\x30\x2e\x30") {
  if (isCreatorInstallation()) return getEffectiveLicense();

  let license = getEffectiveLicense();

  if (!license.valid || !license.updates || license.needsOnlineValidation) {
    try {
      license = await validateLicense({ force: true, version });
    } catch (error) {
      // Uma licença permanente válida continua utilizável pelo cache durante
      // indisponibilidade temporária do servidor. Atualizações, porém, só
      // seguem se ainda houver cache válido e updates habilitados.
      const cached = getEffectiveLicense();
      if (!(cached.valid && cached.updates && cached.cached)) throw error;
      license = cached;
    }
  }

  if (!license.valid) throw new Error("\x4c\x69\x63\x65\x6e\xe7\x61\x20\x6e\xe3\x6f\x20\x61\x74\x69\x76\x61\x64\x61\x20\x6f\x75\x20\x69\x6e\x76\xe1\x6c\x69\x64\x61\x2e");
  if (!license.updates) throw new Error("\x45\x73\x74\x61\x20\x6c\x69\x63\x65\x6e\xe7\x61\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x61\x63\x65\x73\x73\x6f\x20\xe0\x73\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\xe7\xf5\x65\x73\x20\x6f\x66\x69\x63\x69\x61\x69\x73\x2e");

  return license;
}

export function maskLicenseKey(key = "") {
  const value = String(key || "");
  if (!value) return "\x6e\xe3\x6f\x20\x61\x74\x69\x76\x61\x64\x61";
  if (value.length <= 8) return `${value.slice(0, 2)}••••`;
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}
