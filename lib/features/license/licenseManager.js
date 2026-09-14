/*
 * KOBAYASHI BOT
 * Criador: Luiz G. / Kobayashi
 * A venda, revenda ou comercialização desta base sem autorização do criador
 * é estritamente proibida.
 * © Luiz G. / Kobayashi.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";

const ROOT = process.cwd();
const LICENSE_DIR = path.join(ROOT, "files", "license");
const CONFIG_FILE = path.join(LICENSE_DIR, "config.json");
const STATE_FILE = path.join(LICENSE_DIR, "license.json");

const CREATOR_OWNER_FALLBACK = "5515997075304";
const CACHE_MS = 7 * 24 * 60 * 60 * 1000;

function ensureDir() {
  fs.mkdirSync(LICENSE_DIR, { recursive: true });
}

function readJson(file, fallback = {}) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDir();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

function normalizeDigits(value = "") {
  return String(value || "").replace(/\D/g, "");
}

function getOwnerFromSettings() {
  try {
    const settings = readJson(path.join(ROOT, "settings", "settings.json"), {});
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
    channel: String(local?.channel || process.env.KOBAYASHI_RELEASE_CHANNEL || "stable"),
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
    .createHash("sha256")
    .update(`${machineSeed()}|${crypto.randomUUID()}`)
    .digest("hex")
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
      mode: "creator",
      valid: true,
      plan: "creator",
      customer: "Criador Kobayashi",
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
    mode: "customer",
    ...state,
    cached: Boolean(cacheFresh),
    needsOnlineValidation: !cacheFresh
  };
}

async function apiRequest(pathname, payload) {
  const cfg = getLicenseConfig();
  if (!cfg.apiBase) {
    throw new Error(
      "Servidor de licenças ainda não configurado. Configure com: npm run license:configure -- --api URL"
    );
  }

  const res = await fetch(`${cfg.apiBase}${pathname}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "Kobayashi-Bot-License/4.0.0"
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

export async function activateLicense(key, version = "0.0.0") {
  const cleanKey = String(key || "").trim();
  if (!cleanKey) throw new Error("Informe a chave da licença.");

  const installationId = getInstallationId();
  const data = await apiRequest("/activate", {
    key: cleanKey,
    installationId,
    version
  });

  if (!data?.valid) {
    persistRemoteLicense({ installationId }, data, cleanKey);
    throw new Error(data?.message || "Licença recusada.");
  }

  return persistRemoteLicense({ installationId }, data, cleanKey);
}

export async function validateLicense({ force = false, version = "0.0.0" } = {}) {
  if (isCreatorInstallation()) return getEffectiveLicense();

  const state = getLicenseState();
  if (!state.key) return getEffectiveLicense();

  const cfg = getLicenseConfig();
  const maxAge = Math.max(1, cfg.cacheDays || 7) * 24 * 60 * 60 * 1000;
  const cacheFresh = state.valid && state.lastValidatedAt && (Date.now() - state.lastValidatedAt <= maxAge);

  if (!force && cacheFresh) return getEffectiveLicense();

  const data = await apiRequest("/validate", {
    key: state.key,
    token: state.token,
    installationId: state.installationId,
    version
  });

  persistRemoteLicense(state, data, state.key);
  return getEffectiveLicense();
}

export async function assertUpdateLicense(version = "0.0.0") {
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

  if (!license.valid) throw new Error("Licença não ativada ou inválida.");
  if (!license.updates) throw new Error("Esta licença não possui acesso às atualizações oficiais.");

  return license;
}

export function maskLicenseKey(key = "") {
  const value = String(key || "");
  if (!value) return "não ativada";
  if (value.length <= 8) return `${value.slice(0, 2)}••••`;
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}
