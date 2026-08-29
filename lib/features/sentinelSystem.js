import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";

const CONFIG_FILE = path.join(process.cwd(), "files", "database", "sentinel-config.json");
const LOG_FILE = path.join(process.cwd(), "files", "database", "sentinel-log.json");
const AUTH_DIR = path.join(process.cwd(), "files", "database", "sentinel-auth");

const DEFAULT_CONFIG = {
  phoneNumber: "",
  delayMs: 2000,
  groups: {}
};

let principalConn = null;
let runtime = {
  ownerJids: [],
  resolveJid: async (raw, alt) => alt || raw,
  isWhitelisted: () => false
};

let sentinelSock = null;
let sentinelConnected = false;
let startingPromise = null;
let reconnectTimer = null;

const principalSeen = new Map();
const handled = new Map();

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf8");
}

function getConfig() {
  return { ...DEFAULT_CONFIG, ...readJson(CONFIG_FILE, DEFAULT_CONFIG) };
}

function saveConfig(config) {
  writeJson(CONFIG_FILE, config);
  return config;
}

function cleanupMaps() {
  const now = Date.now();
  const maxAge = 10 * 60 * 1000;
  for (const [k, t] of principalSeen) if (now - t > maxAge) principalSeen.delete(k);
  for (const [k, t] of handled) if (now - t > maxAge) handled.delete(k);
}

function keyFor(groupJid, messageId) {
  return `${groupJid || ""}:${messageId || ""}`;
}

export function markPrincipalSeen(info = {}) {
  const groupJid = info?.key?.remoteJid;
  const messageId = info?.key?.id;
  if (!groupJid?.endsWith("@g.us") || !messageId) return;
  principalSeen.set(keyFor(groupJid, messageId), Date.now());
  cleanupMaps();
}

export function configureSentinelRuntime(conn, helpers = {}) {
  principalConn = conn || principalConn;
  runtime = {
    ...runtime,
    ...helpers
  };

  // Sessão já registrada? Tenta manter o Sentinela ativo automaticamente.
  if (!sentinelSock && !startingPromise) {
    useMultiFileAuthState(AUTH_DIR)
      .then(({ state }) => {
        if (state?.creds?.registered) ensureSentinelStarted().catch(() => {});
      })
      .catch(() => {});
  }
}

export function setSentinelGroupEnabled(groupJid, enabled) {
  const cfg = getConfig();
  cfg.groups ||= {};
  cfg.groups[groupJid] = Boolean(enabled);
  saveConfig(cfg);
  return Boolean(enabled);
}

export function setSentinelDelay(ms) {
  const cfg = getConfig();
  cfg.delayMs = Math.max(1200, Math.min(10000, Number(ms) || 2000));
  saveConfig(cfg);
  return cfg.delayMs;
}

function isGroupEnabled(groupJid) {
  return getConfig()?.groups?.[groupJid] === true;
}

function stringifyDeep(value, depth = 0) {
  if (depth > 9 || value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(v => stringifyDeep(v, depth + 1)).join(" ");
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([key]) => !["jpegThumbnail", "thumbnail", "mediaKey", "fileSha256", "fileEncSha256"].includes(key))
      .map(([key, val]) => `${key} ${stringifyDeep(val, depth + 1)}`)
      .join(" ");
  }
  return "";
}

function inspectSuspiciousLink(message = {}) {
  const raw = stringifyDeep(message).slice(0, 25000);
  const patterns = [
    /https?:\/\/[^\s"'<>]+/i,
    /(?:chat\.whatsapp\.com|whatsapp\.com\/channel)\/[a-z0-9_-]+/i,
    /(?:t\.me|telegram\.me|telegram\.dog)\/[^\s"'<>]+/i,
    /\b(?:wa\.me)\/\d+/i,
    /\b(?:www\.)?[a-z0-9-]+\.(?:com|net|org|io|gg|me|app|site|online|br|co|xyz|link|dev|tv|store|info)\b/i
  ];

  const match = patterns.map(p => raw.match(p)?.[0]).find(Boolean);
  return {
    suspicious: Boolean(match),
    preview: match ? String(match).slice(0, 180) : "",
    rawPreview: raw.replace(/\s+/g, " ").trim().slice(0, 300)
  };
}

function normalizeParticipantId(p = {}) {
  return p?.id || p?.jid || p?.lid || "";
}

function isProtectedParticipant(meta, rawJid, resolvedJid) {
  const candidates = new Set([rawJid, resolvedJid].filter(Boolean));
  const participants = Array.isArray(meta?.participants) ? meta.participants : [];

  for (const p of participants) {
    const pid = normalizeParticipantId(p);
    if (!candidates.has(pid)) continue;
    if (p?.admin === "admin" || p?.admin === "superadmin") return true;
  }

  if (meta?.owner && candidates.has(meta.owner)) return true;
  if (runtime.ownerJids.some(jid => candidates.has(jid))) return true;
  return false;
}

function appendLog(entry) {
  const db = readJson(LOG_FILE, []);
  const list = Array.isArray(db) ? db : [];
  list.unshift(entry);
  writeJson(LOG_FILE, list.slice(0, 500));
}

export function getSentinelLogs(groupJid = null, limit = 10) {
  const db = readJson(LOG_FILE, []);
  return (Array.isArray(db) ? db : [])
    .filter(x => !groupJid || x.groupJid === groupJid)
    .slice(0, Math.max(1, Math.min(50, Number(limit) || 10)));
}

async function processInvisibleCandidate(info) {
  const groupJid = info?.key?.remoteJid;
  const messageId = info?.key?.id;
  const rawSender = info?.key?.participant;
  const senderAlt = info?.key?.participantAlt || null;

  if (!groupJid?.endsWith("@g.us") || !messageId || !rawSender) return;
  if (!isGroupEnabled(groupJid)) return;

  const mapKey = keyFor(groupJid, messageId);
  if (handled.has(mapKey)) return;

  const cfg = getConfig();
  await new Promise(resolve => setTimeout(resolve, cfg.delayMs || 2000));

  // A conta ADM também recebeu o evento: não é invisível, não faz nada.
  if (principalSeen.has(mapKey)) return;

  handled.set(mapKey, Date.now());

  const inspection = inspectSuspiciousLink(info.message || {});
  if (!inspection.suspicious) {
    appendLog({
      timestamp: Date.now(),
      groupJid,
      senderJid: rawSender,
      messageId,
      action: "invisível-sem-link",
      preview: inspection.rawPreview
    });
    return;
  }

  if (!principalConn) {
    appendLog({
      timestamp: Date.now(),
      groupJid,
      senderJid: rawSender,
      messageId,
      action: "sem-executor-principal",
      preview: inspection.preview
    });
    return;
  }

  let senderJid = rawSender;
  try {
    senderJid = await runtime.resolveJid(rawSender, senderAlt) || rawSender;
  } catch {}

  let meta = null;
  try {
    meta = await principalConn.groupMetadata(groupJid);
  } catch (e) {
    appendLog({
      timestamp: Date.now(),
      groupJid,
      senderJid,
      messageId,
      action: "falha-metadata",
      preview: inspection.preview
    });
    return;
  }

  if (isProtectedParticipant(meta, rawSender, senderJid)) {
    appendLog({
      timestamp: Date.now(),
      groupJid,
      senderJid,
      messageId,
      action: "ignorado-admin-dono",
      preview: inspection.preview
    });
    return;
  }

  try {
    if (runtime.isWhitelisted(groupJid, senderJid)) {
      appendLog({
        timestamp: Date.now(),
        groupJid,
        senderJid,
        messageId,
        action: "ignorado-whitelist",
        preview: inspection.preview
      });
      return;
    }
  } catch {}

  // Tenta apagar usando a chave observada pelo membro comum.
  let deleted = false;
  try {
    await principalConn.sendMessage(groupJid, {
      delete: {
        remoteJid: groupJid,
        fromMe: false,
        id: messageId,
        participant: senderJid
      }
    });
    deleted = true;
  } catch {}

  let removed = false;
  try {
    const result = await principalConn.groupParticipantsUpdate(groupJid, [senderJid], "remove");
    removed = Array.isArray(result) ? result.some(x => String(x?.status || "").startsWith("2")) : true;
  } catch {}

  const log = {
    timestamp: Date.now(),
    groupJid,
    senderJid,
    rawSender,
    messageId,
    action: removed ? "removido" : "remoção-falhou",
    deleted,
    preview: inspection.preview
  };
  appendLog(log);

  try {
    await principalConn.sendMessage(groupJid, {
      text:
        `🚨🛰️ *KOBAYASHI SENTINEL*\n\n` +
        `Um link foi detectado pela conta Sentinela, mas não chegou à sessão ADM.\n\n` +
        `👤 Autor: @${String(senderJid).split("@")[0]}\n` +
        `🔗 Detecção: *link invisível para ADM*\n` +
        `🗑️ Exclusão: *${deleted ? "tentada com sucesso ✅" : "não confirmada ⚠️"}*\n` +
        `🚫 Remoção: *${removed ? "executada ✅" : "falhou ⚠️"}*\n` +
        `🆔 ID: *${messageId}*\n\n` +
        `🐉 Evento registrado no Sentinel Log.`,
      mentions: [senderJid]
    });
  } catch {}
}

async function createSentinelSocket({ pairingNumber = null } = {}) {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const logger = pino({ level: "silent" });

  const sock = makeWASocket({
    auth: state,
    logger,
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => false,
    generateHighQualityLinkPreview: false
  });

  sentinelSock = sock;
  sentinelConnected = false;

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (upsert) => {
    if (!Array.isArray(upsert?.messages)) return;
    if (!["notify", "append"].includes(upsert?.type)) return;

    for (const info of upsert.messages) {
      if (!info?.message || info?.key?.fromMe) continue;
      if (!info?.key?.remoteJid?.endsWith("@g.us")) continue;
      processInvisibleCandidate(info).catch(() => {});
    }
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      sentinelConnected = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (connection === "close") {
      sentinelConnected = false;
      sentinelSock = null;

      const code =
        lastDisconnect?.error?.output?.statusCode ||
        lastDisconnect?.error?.statusCode ||
        lastDisconnect?.error?.data?.statusCode;

      if (code !== DisconnectReason.loggedOut && code !== DisconnectReason.connectionReplaced) {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          ensureSentinelStarted().catch(() => {});
        }, 10000);
        reconnectTimer.unref?.();
      }
    }
  });

  let code = null;
  if (pairingNumber && !state.creds.registered) {
    await new Promise(resolve => setTimeout(resolve, 1800));
    const rawCode = await sock.requestPairingCode(pairingNumber);
    code = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode;
  }

  return {
    sock,
    code,
    registered: Boolean(state.creds.registered)
  };
}

async function ensureSentinelStarted() {
  if (sentinelSock) return sentinelSock;
  if (startingPromise) return startingPromise;

  startingPromise = createSentinelSocket()
    .then(({ sock }) => sock)
    .finally(() => { startingPromise = null; });

  return startingPromise;
}

export async function startSentinelPairing(phoneNumber) {
  const number = String(phoneNumber || "").replace(/\D/g, "");
  if (number.length < 10 || number.length > 15) throw new Error("Número inválido.");

  const cfg = getConfig();
  cfg.phoneNumber = number;
  saveConfig(cfg);

  const { state } = await useMultiFileAuthState(AUTH_DIR);
  if (state?.creds?.registered) {
    await ensureSentinelStarted();
    return {
      alreadyRegistered: true,
      phoneNumber: cfg.phoneNumber
    };
  }

  if (sentinelSock) {
    try { sentinelSock.end?.(new Error("reiniciando pareamento")); } catch {}
    sentinelSock = null;
  }

  const result = await createSentinelSocket({ pairingNumber: number });
  return {
    alreadyRegistered: false,
    phoneNumber: number,
    code: result.code
  };
}

export async function stopSentinel() {
  if (!sentinelSock) return false;
  try {
    sentinelSock.end?.(new Error("Sentinel parado pelo dono"));
  } catch {}
  sentinelSock = null;
  sentinelConnected = false;
  return true;
}

export function getSentinelStatus(groupJid = null) {
  const cfg = getConfig();
  let registered = false;
  try {
    const creds = readJson(path.join(AUTH_DIR, "creds.json"), {});
    registered = Boolean(creds?.registered);
  } catch {}

  return {
    connected: sentinelConnected,
    registered,
    phoneNumber: cfg.phoneNumber || "",
    delayMs: cfg.delayMs || 2000,
    groupEnabled: groupJid ? cfg?.groups?.[groupJid] === true : false
  };
}
