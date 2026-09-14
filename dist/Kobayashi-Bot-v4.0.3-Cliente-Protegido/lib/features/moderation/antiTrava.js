/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x61\x6e\x74\x69\x74\x72\x61\x76\x61\x2e\x6a\x73\x6f\x6e");
const DEFAULTS = Object.freeze({
  enabled: false,
  antiMention: true,
  mentionLimit: 10,
  antiLongText: true,
  textLimit: 4000,
  antiFloodMessage: true,
  floodLimit: 6,
  floodWindowSeconds: 10,
  punishment: "\x61\x64\x76",
  emergency: false,
  emergencySeconds: 20,
});

const floodMap = new Map();
const floodCooldown = new Map();

function readDb() {
  return readJsonFile(DB_FILE, { groups: {} });
}

function writeDb(data) {
  writeJsonFile(DB_FILE, data);
}

export function getAntiTravaConfig(groupJid) {
  const db = readDb();
  return { ...DEFAULTS, ...(db?.groups?.[groupJid] || {}) };
}

export function updateAntiTravaConfig(groupJid, patch = {}) {
  const db = readDb();
  db.groups ||= {};
  db.groups[groupJid] = { ...DEFAULTS, ...(db.groups[groupJid] || {}), ...patch };
  writeDb(db);
  return { ...db.groups[groupJid] };
}

export function countMentions(message = {}) {
  const found = new Set();
  const seen = new Set();

  const visit = (value, depth = 0) => {
    if (!value || depth > 12) return;
    if (typeof value !== "\x6f\x62\x6a\x65\x63\x74") return;
    if (seen.has(value)) return;
    seen.add(value);

    if (Array.isArray(value)) {
      for (const item of value) visit(item, depth + 1);
      return;
    }

    for (const [key, item] of Object.entries(value)) {
      if (key === "\x6d\x65\x6e\x74\x69\x6f\x6e\x65\x64\x4a\x69\x64" && Array.isArray(item)) {
        for (const jid of item) if (typeof jid === "\x73\x74\x72\x69\x6e\x67") found.add(jid);
      } else {
        visit(item, depth + 1);
      }
    }
  };

  visit(message);
  return found.size;
}

function countInvisibleChars(text = "") {
  const match = String(text).match(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g);
  return match ? match.length : 0;
}

function longestRepeatedRun(text = "") {
  const value = String(text || "");
  let best = 0;
  let current = 0;
  let last = null;

  for (const ch of value) {
    if (ch === last) current += 1;
    else {
      last = ch;
      current = 1;
    }
    if (current > best) best = current;
  }
  return best;
}

function payloadSize(message = {}) {
  try {
    return Buffer.byteLength(JSON.stringify(message), "\x75\x74\x66\x38");
  } catch {
    return 0;
  }
}

export function checkMessageFlood(groupJid, userJid, config) {
  if (!config?.antiFloodMessage) return { triggered: false, count: 0 };

  const now = Date.now();
  const windowMs = Math.max(3, Number(config.floodWindowSeconds) || 10) * 1000;
  const limit = Math.max(3, Number(config.floodLimit) || 6);
  const key = `${groupJid}:${userJid}`;

  const cooldownUntil = Number(floodCooldown.get(key) || 0);
  if (cooldownUntil > now) return { triggered: false, count: 0, cooldown: true };

  const previous = (floodMap.get(key) || []).filter((time) => now - time <= windowMs);
  previous.push(now);
  floodMap.set(key, previous);

  if (previous.length >= limit) {
    floodMap.set(key, []);
    floodCooldown.set(key, now + windowMs);
    return { triggered: true, count: previous.length, limit, windowMs };
  }

  return { triggered: false, count: previous.length, limit, windowMs };
}

export function inspectPotentialTrava({ groupJid, userJid, message, text, config }) {
  const cfg = { ...DEFAULTS, ...(config || {}) };
  if (!cfg.enabled) return { triggered: false, reasons: [], severe: false };

  const reasons = [];
  let severe = false;
  const mentionCount = countMentions(message);
  const textLength = [...String(text || "")].length;
  const invisibleCount = countInvisibleChars(text);
  const repeatedRun = longestRepeatedRun(text);
  const bytes = payloadSize(message);

  if (cfg.antiMention && mentionCount >= Math.max(2, Number(cfg.mentionLimit) || 10)) {
    reasons.push(`menção em massa (${mentionCount} menções)`);
    if (mentionCount >= Math.max(25, (Number(cfg.mentionLimit) || 10) * 2)) severe = true;
  }

  if (cfg.antiLongText && textLength >= Math.max(500, Number(cfg.textLimit) || 4000)) {
    reasons.push(`texto excessivo (${textLength} caracteres)`);
    if (textLength >= Math.max(12000, (Number(cfg.textLimit) || 4000) * 2)) severe = true;
  }

  // Caracteres invisíveis/repetições enormes são padrões comuns em mensagens abusivas.
  if (cfg.antiLongText && invisibleCount >= 250) {
    reasons.push(`caracteres invisíveis em excesso (${invisibleCount})`);
    if (invisibleCount >= 500) severe = true;
  }

  if (cfg.antiLongText && repeatedRun >= 500) {
    reasons.push(`repetição anormal de caracteres (${repeatedRun}x)`);
    if (repeatedRun >= 1000) severe = true;
  }

  // O Baileys normalmente recebe apenas metadados de mídia; payload textual/protocolar muito grande é suspeito.
  if (bytes >= 120000) {
    reasons.push(`payload anormal (${Math.round(bytes / 1024)} KB)`);
    severe = true;
  }

  const flood = checkMessageFlood(groupJid, userJid, cfg);
  if (flood.triggered) {
    reasons.push(`flood (${flood.count} mensagens em ${Math.round(flood.windowMs / 1000)}s)`);
  }

  return {
    triggered: reasons.length > 0,
    reasons,
    severe,
    stats: { mentionCount, textLength, invisibleCount, repeatedRun, bytes, flood },
  };
}

export function formatAntiTravaStatus(config) {
  const cfg = { ...DEFAULTS, ...(config || {}) };
  return (
    `🛡️ *ANTI-TRAVA KOBAYASHI*\n\n` +
    `🐉 Sistema: *${cfg.enabled ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\n` +
    `👥 Anti-menção: *${cfg.antiMention ? "ON" : "\x4f\x46\x46"}* — limite ${cfg.mentionLimit}\n` +
    `📝 Anti-textão: *${cfg.antiLongText ? "ON" : "\x4f\x46\x46"}* — limite ${cfg.textLimit}\n` +
    `🌊 Anti-flood msg: *${cfg.antiFloodMessage ? "ON" : "\x4f\x46\x46"}* — ${cfg.floodLimit}/${cfg.floodWindowSeconds}s\n` +
    `⚖️ Punição: *${String(cfg.punishment || "\x61\x64\x76").toUpperCase()}*\n` +
    `🚨 Emergência: *${cfg.emergency ? `ON (${cfg.emergencySeconds}s)` : "\x4f\x46\x46"}*`
  );
}
