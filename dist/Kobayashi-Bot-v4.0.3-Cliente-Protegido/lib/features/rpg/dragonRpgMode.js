/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const DB_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x64\x72\x61\x67\x6f\x6e\x2d\x72\x70\x67\x2d\x6d\x6f\x64\x65\x2e\x6a\x73\x6f\x6e");

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ groups: {} }, null, 2), "\x75\x74\x66\x38");
  }
}

function readDb() {
  try {
    ensureDb();
    const db = JSON.parse(fs.readFileSync(DB_PATH, "\x75\x74\x66\x38"));
    db.groups ||= {};
    return db;
  } catch {
    return { groups: {} };
  }
}

function writeDb(db) {
  ensureDb();
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, DB_PATH);
}

export function isDragonRpgEnabled(groupJid) {
  if (!groupJid) return true;
  const db = readDb();
  // Dragon RPG permanece ativado por padrão para não quebrar grupos existentes.
  return db.groups[groupJid]?.enabled !== false;
}

export function setDragonRpgEnabled(groupJid, enabled, by = null) {
  const db = readDb();
  db.groups[groupJid] = {
    ...(db.groups[groupJid] || {}),
    enabled: Boolean(enabled),
    updatedBy: by || null,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  return db.groups[groupJid];
}
