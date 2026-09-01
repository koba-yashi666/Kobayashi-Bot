import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "files", "database", "admin-logs.json");
const DEFAULT_RETENTION_DAYS = 90;
let lastCleanupDay = "";

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ groups: {} }, null, 2), "utf8");
  }
}

function normalizeDb(raw) {
  if (!raw || typeof raw !== "object") return { groups: {} };
  if (raw.groups && typeof raw.groups === "object") return raw;

  // Compatibilidade com versões antigas que salvavam { groupJid: [logs] }.
  const groups = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) groups[key] = value;
  }
  return { groups };
}

function readDb() {
  ensureDb();
  try {
    return normalizeDb(JSON.parse(fs.readFileSync(DB_FILE, "utf8")));
  } catch {
    return { groups: {} };
  }
}

function writeDb(db) {
  ensureDb();
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_FILE);
}

function isoNow() {
  return new Date().toISOString();
}

function toMillis(value) {
  const n = Date.parse(value || "");
  return Number.isFinite(n) ? n : 0;
}

function normalizeEntry(entry = {}) {
  return {
    id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: String(entry.type || "admin").toLowerCase(),
    actor: entry.actor || null,
    target: entry.target || null,
    detail: String(entry.detail || entry.message || "Ação administrativa"),
    message: entry.message ? String(entry.message) : undefined,
    at: entry.at || entry.timestamp || isoNow(),
    meta: entry.meta && typeof entry.meta === "object" ? entry.meta : undefined,
  };
}

export function cleanupAdminLogs({ retentionDays = DEFAULT_RETENTION_DAYS } = {}) {
  const db = readDb();
  const cutoff = Date.now() - Math.max(1, Number(retentionDays) || DEFAULT_RETENTION_DAYS) * 86400000;
  let removed = 0;

  for (const [groupJid, entries] of Object.entries(db.groups || {})) {
    const list = Array.isArray(entries) ? entries : [];
    const kept = list.filter((entry) => {
      const valid = toMillis(entry?.at || entry?.timestamp) >= cutoff;
      if (!valid) removed += 1;
      return valid;
    });
    if (kept.length) db.groups[groupJid] = kept;
    else delete db.groups[groupJid];
  }

  if (removed) writeDb(db);
  return removed;
}

function maybeCleanup() {
  const today = new Date().toISOString().slice(0, 10);
  if (lastCleanupDay === today) return;
  lastCleanupDay = today;
  try { cleanupAdminLogs(); } catch {}
}

export function addAdminLog(groupJid, entry = {}) {
  if (!groupJid) return null;
  maybeCleanup();

  const db = readDb();
  if (!Array.isArray(db.groups[groupJid])) db.groups[groupJid] = [];
  const log = normalizeEntry(entry);
  db.groups[groupJid].push(log);

  // Limite secundário para impedir crescimento excessivo mesmo dentro da retenção.
  if (db.groups[groupJid].length > 3000) {
    db.groups[groupJid] = db.groups[groupJid].slice(-3000);
  }

  writeDb(db);
  return log;
}

export function getAdminLogs(groupJid, filters = {}) {
  const db = readDb();
  let logs = Array.isArray(db.groups?.[groupJid]) ? [...db.groups[groupJid]] : [];

  const type = String(filters.type || "").toLowerCase().trim();
  const member = String(filters.member || "").trim();
  const since = Number(filters.since) || 0;
  const until = Number(filters.until) || 0;

  if (type) {
    logs = logs.filter((entry) => {
      const value = String(entry?.type || "").toLowerCase();
      if (type === "antilink") return value.includes("link") || value.includes("telegram");
      if (type === "adv") return value.includes("adv") || value.includes("warn");
      return value === type || value.includes(type);
    });
  }

  if (member) {
    const digits = member.replace(/\D/g, "");
    logs = logs.filter((entry) => {
      const actor = String(entry?.actor || "");
      const target = String(entry?.target || "");
      return actor === member || target === member || (digits && (actor.includes(digits) || target.includes(digits)));
    });
  }

  if (since) logs = logs.filter((entry) => toMillis(entry?.at || entry?.timestamp) >= since);
  if (until) logs = logs.filter((entry) => toMillis(entry?.at || entry?.timestamp) <= until);

  logs.sort((a, b) => toMillis(b?.at || b?.timestamp) - toMillis(a?.at || a?.timestamp));
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
  return logs.slice(0, limit);
}

export function clearAdminLogs(groupJid, filters = {}) {
  const db = readDb();
  const original = Array.isArray(db.groups?.[groupJid]) ? db.groups[groupJid] : [];
  if (!original.length) return 0;

  const type = String(filters.type || "").toLowerCase().trim();
  const before = Number(filters.before) || 0;

  if (!type && !before) {
    const count = original.length;
    delete db.groups[groupJid];
    writeDb(db);
    return count;
  }

  let removed = 0;
  db.groups[groupJid] = original.filter((entry) => {
    const logType = String(entry?.type || "").toLowerCase();
    const typeMatch = !type || logType === type || logType.includes(type) || (type === "antilink" && (logType.includes("link") || logType.includes("telegram"))) || (type === "adv" && (logType.includes("adv") || logType.includes("warn")));
    const dateMatch = !before || toMillis(entry?.at || entry?.timestamp) < before;
    if (typeMatch && dateMatch) {
      removed += 1;
      return false;
    }
    return true;
  });

  if (!db.groups[groupJid].length) delete db.groups[groupJid];
  if (removed) writeDb(db);
  return removed;
}

export function getAdminLogStats(groupJid) {
  const db = readDb();
  const logs = Array.isArray(db.groups?.[groupJid]) ? db.groups[groupJid] : [];
  const byType = {};
  for (const entry of logs) {
    const type = String(entry?.type || "admin").toLowerCase();
    byType[type] = (byType[type] || 0) + 1;
  }
  return { total: logs.length, byType };
}
