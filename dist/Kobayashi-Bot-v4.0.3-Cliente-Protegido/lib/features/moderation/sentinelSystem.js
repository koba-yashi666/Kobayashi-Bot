/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import pino from "\x70\x69\x6e\x6f";
import NodeCache from "\x6e\x6f\x64\x65\x2d\x63\x61\x63\x68\x65";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  Browsers,
  makeCacheableSignalKeyStore
} from "\x40\x77\x68\x69\x73\x6b\x65\x79\x73\x6f\x63\x6b\x65\x74\x73\x2f\x62\x61\x69\x6c\x65\x79\x73";

const CONFIG_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x63\x6f\x6e\x66\x69\x67\x2e\x6a\x73\x6f\x6e");
const LOG_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x6c\x6f\x67\x2e\x6a\x73\x6f\x6e");
const AUTH_DIR = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x61\x75\x74\x68");

// Mesmo modelo usado pela conexão principal da Kobayashi.
const sentinelMsgStore = new NodeCache({ stdTTL: 10 * 60, useClones: false });
const sentinelMsgRetryCounterCache = new NodeCache();

async function getSentinelMessage(key) {
  return sentinelMsgStore.get(key?.id);
}

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
    return JSON.parse(fs.readFileSync(file, "\x75\x74\x66\x38"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2), "\x75\x74\x66\x38");
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
  if (!groupJid?.endsWith("\x40\x67\x2e\x75\x73") || !messageId) return;
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
  if (typeof value === "\x73\x74\x72\x69\x6e\x67") return value;
  if (typeof value === "\x6e\x75\x6d\x62\x65\x72" || typeof value === "\x62\x6f\x6f\x6c\x65\x61\x6e") return String(value);
  if (Array.isArray(value)) return value.map(v => stringifyDeep(v, depth + 1)).join(" ");
  if (typeof value === "\x6f\x62\x6a\x65\x63\x74") {
    return Object.entries(value)
      .filter(([key]) => !["\x6a\x70\x65\x67\x54\x68\x75\x6d\x62\x6e\x61\x69\x6c", "\x74\x68\x75\x6d\x62\x6e\x61\x69\x6c", "\x6d\x65\x64\x69\x61\x4b\x65\x79", "\x66\x69\x6c\x65\x53\x68\x61\x32\x35\x36", "\x66\x69\x6c\x65\x45\x6e\x63\x53\x68\x61\x32\x35\x36"].includes(key))
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
    if (p?.admin === "\x61\x64\x6d\x69\x6e" || p?.admin === "\x73\x75\x70\x65\x72\x61\x64\x6d\x69\x6e") return true;
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

  if (!groupJid?.endsWith("\x40\x67\x2e\x75\x73") || !messageId || !rawSender) return;
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
      action: "\x69\x6e\x76\x69\x73\xed\x76\x65\x6c\x2d\x73\x65\x6d\x2d\x6c\x69\x6e\x6b",
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
      action: "\x73\x65\x6d\x2d\x65\x78\x65\x63\x75\x74\x6f\x72\x2d\x70\x72\x69\x6e\x63\x69\x70\x61\x6c",
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
      action: "\x66\x61\x6c\x68\x61\x2d\x6d\x65\x74\x61\x64\x61\x74\x61",
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
      action: "\x69\x67\x6e\x6f\x72\x61\x64\x6f\x2d\x61\x64\x6d\x69\x6e\x2d\x64\x6f\x6e\x6f",
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
        action: "\x69\x67\x6e\x6f\x72\x61\x64\x6f\x2d\x77\x68\x69\x74\x65\x6c\x69\x73\x74",
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
    const result = await principalConn.groupParticipantsUpdate(groupJid, [senderJid], "\x72\x65\x6d\x6f\x76\x65");
    removed = Array.isArray(result) ? result.some(x => String(x?.status || "").startsWith("2")) : true;
  } catch {}

  const log = {
    timestamp: Date.now(),
    groupJid,
    senderJid,
    rawSender,
    messageId,
    action: removed ? "\x72\x65\x6d\x6f\x76\x69\x64\x6f" : "\x72\x65\x6d\x6f\xe7\xe3\x6f\x2d\x66\x61\x6c\x68\x6f\x75",
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
        `🗑️ Exclusão: *${deleted ? "\x74\x65\x6e\x74\x61\x64\x61\x20\x63\x6f\x6d\x20\x73\x75\x63\x65\x73\x73\x6f\x20\u2705" : "\x6e\xe3\x6f\x20\x63\x6f\x6e\x66\x69\x72\x6d\x61\x64\x61\x20\u26a0\ufe0f"}*\n` +
        `🚫 Remoção: *${removed ? "\x65\x78\x65\x63\x75\x74\x61\x64\x61\x20\u2705" : "\x66\x61\x6c\x68\x6f\x75\x20\u26a0\ufe0f"}*\n` +
        `🆔 ID: *${messageId}*\n\n` +
        `🐉 Evento registrado no Sentinel Log.`,
      mentions: [senderJid]
    });
  } catch {}
}

async function createSentinelSocket({ pairingNumber = null } = {}) {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const logger = pino({ level: "\x66\x61\x74\x61\x6c" });

  // Espelha a conexão principal da Kobayashi:
  // - multi-file auth
  // - key store cacheado
  // - browser Ubuntu/Chrome
  // - retry cache
  // - mesmos timeouts básicos
  const sock = makeWASocket({
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    browser: Browsers.ubuntu("\x43\x68\x72\x6f\x6d\x65"),
    markOnlineOnConnect: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60_000,
    keepAliveIntervalMs: 30_000,
    defaultQueryTimeoutMs: 60_000,
    msgRetryCounterCache: sentinelMsgRetryCounterCache,
    getMessage: getSentinelMessage
  });

  // Mantém referência do state porque algumas versões do Baileys
  // não expõem authState diretamente no socket.
  sock.sentinelAuthState = state;

  sentinelSock = sock;
  sentinelConnected = false;

  sock.ev.on("\x63\x72\x65\x64\x73\x2e\x75\x70\x64\x61\x74\x65", saveCreds);

  sock.ev.on("\x6d\x65\x73\x73\x61\x67\x65\x73\x2e\x75\x70\x73\x65\x72\x74", async (upsert) => {
    if (!Array.isArray(upsert?.messages)) return;
    if (upsert?.type !== "\x6e\x6f\x74\x69\x66\x79") return;

    for (const info of upsert.messages) {
      if (info?.message && info?.key?.id) {
        sentinelMsgStore.set(info.key.id, info.message);
      }

      if (!info?.message || info?.key?.fromMe) continue;
      if (!info?.key?.remoteJid?.endsWith("\x40\x67\x2e\x75\x73")) continue;

      const rawTimestamp = Number(info?.messageTimestamp || 0);
      const timestampMs = rawTimestamp > 1e12 ? rawTimestamp : rawTimestamp * 1000;
      if (timestampMs && Date.now() - timestampMs > 60000) continue;

      processInvisibleCandidate(info).catch(() => {});
    }
  });

  sock.ev.on("\x63\x6f\x6e\x6e\x65\x63\x74\x69\x6f\x6e\x2e\x75\x70\x64\x61\x74\x65", ({ connection, lastDisconnect }) => {
    if (connection === "\x6f\x70\x65\x6e") {
      sentinelConnected = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (connection === "\x63\x6c\x6f\x73\x65") {
      sentinelConnected = false;

      // Só derruba a referência se este ainda for o socket atual.
      if (sentinelSock === sock) sentinelSock = null;

      const code =
        lastDisconnect?.error?.output?.statusCode ||
        lastDisconnect?.error?.statusCode ||
        lastDisconnect?.error?.data?.statusCode;

      if (
        code !== DisconnectReason.loggedOut &&
        code !== DisconnectReason.connectionReplaced
      ) {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          ensureSentinelStarted().catch(() => {});
        }, 3000);
        reconnectTimer.unref?.();
      }
    }
  });

  let code = null;

  // Mesmo fluxo da conexão principal:
  // espera o socket inicializar e só então solicita o código.
  if (pairingNumber && !state.creds.registered) {
    const phoneNumber = String(pairingNumber).replace(/\D/g, "");

    if (phoneNumber.length < 8) {
      throw new Error("\x4e\xfa\x6d\x65\x72\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e\x20\x49\x6e\x66\x6f\x72\x6d\x65\x20\x44\x44\x49\x20\x2b\x20\x44\x44\x44\x20\x2b\x20\x6e\xfa\x6d\x65\x72\x6f\x2e");
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    const rawCode = await sock.requestPairingCode(phoneNumber);
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
  if (number.length < 10 || number.length > 15) throw new Error("\x4e\xfa\x6d\x65\x72\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e");

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

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (sentinelSock) {
    try { sentinelSock.end?.(new Error("\x72\x65\x69\x6e\x69\x63\x69\x61\x6e\x64\x6f\x20\x70\x61\x72\x65\x61\x6d\x65\x6e\x74\x6f")); } catch {}
    sentinelSock = null;
    await new Promise(resolve => setTimeout(resolve, 500));
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
    sentinelSock.end?.(new Error("\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x70\x61\x72\x61\x64\x6f\x20\x70\x65\x6c\x6f\x20\x64\x6f\x6e\x6f"));
  } catch {}
  sentinelSock = null;
  sentinelConnected = false;
  return true;
}

export function getSentinelStatus(groupJid = null) {
  const cfg = getConfig();
  let registered = false;
  try {
    const creds = readJson(path.join(AUTH_DIR, "\x63\x72\x65\x64\x73\x2e\x6a\x73\x6f\x6e"), {});
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
