/* Kobayashi Protected Distribution v4.0.3 */
import fs from "fs";
import path from "\x70\x61\x74\x68";

const DB_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x6c\x69\x73\x74\x61\x2d\x6e\x65\x67\x72\x61\x2d\x67\x6c\x6f\x62\x61\x6c\x2e\x6a\x73\x6f\x6e");

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2), "\x75\x74\x66\x38");
  }
}

function readDb() {
  ensureDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "\x75\x74\x66\x38"));
    return { users: data?.users && typeof data.users === "\x6f\x62\x6a\x65\x63\x74" ? data.users : {} };
  } catch {
    return { users: {} };
  }
}

function writeDb(db) {
  ensureDb();
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, DB_PATH);
}

export function normalizeBlacklistJid(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.includes("\x40\x73\x2e\x77\x68\x61\x74\x73\x61\x70\x70\x2e\x6e\x65\x74")) return raw.split(":")[0];
  const digits = raw.replace(/\D/g, "");
  return digits ? `${digits}@s.whatsapp.net` : null;
}

export function isGloballyBlacklisted(jid) {
  const target = normalizeBlacklistJid(jid);
  if (!target) return false;
  return Boolean(readDb().users[target]);
}

export function addGlobalBlacklist(jid, { reason = "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f", by = null } = {}) {
  const target = normalizeBlacklistJid(jid);
  if (!target) return null;
  const db = readDb();
  db.users[target] = {
    jid: target,
    reason: String(reason || "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f"),
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
