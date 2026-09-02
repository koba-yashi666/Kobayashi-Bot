import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "files", "database", "lista-negra-global.json");

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2), "utf8");
  }
}

function readDb() {
  ensureDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    return { users: data?.users && typeof data.users === "object" ? data.users : {} };
  } catch {
    return { users: {} };
  }
}

function writeDb(db) {
  ensureDb();
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
}

export function normalizeBlacklistJid(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.includes("@s.whatsapp.net")) return raw.split(":")[0];
  const digits = raw.replace(/\D/g, "");
  return digits ? `${digits}@s.whatsapp.net` : null;
}

export function isGloballyBlacklisted(jid) {
  const target = normalizeBlacklistJid(jid);
  if (!target) return false;
  return Boolean(readDb().users[target]);
}

export function addGlobalBlacklist(jid, { reason = "Sem motivo informado", by = null } = {}) {
  const target = normalizeBlacklistJid(jid);
  if (!target) return null;
  const db = readDb();
  db.users[target] = {
    jid: target,
    reason: String(reason || "Sem motivo informado"),
    by,
    addedAt: new Date().toISOString()
  };
  writeDb(db);
  return db.users[target];
}

export function removeGlobalBlacklist(jid) {
  const target = normalizeBlacklistJid(jid);
  if (!target) return false;
  const db = readDb();
  if (!db.users[target]) return false;
  delete db.users[target];
  writeDb(db);
  return true;
}

export function getGlobalBlacklistEntry(jid) {
  const target = normalizeBlacklistJid(jid);
  return target ? readDb().users[target] || null : null;
}

export function listGlobalBlacklist() {
  return Object.values(readDb().users)
    .sort((a, b) => String(b.addedAt || "").localeCompare(String(a.addedAt || "")));
}
