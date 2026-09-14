/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const DB_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x72\x70\x67\x2d\x73\x65\x74\x74\x69\x6e\x67\x73\x2e\x6a\x73\x6f\x6e");

function loadDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return { groups: {} };
    const data = JSON.parse(fs.readFileSync(DB_PATH, "\x75\x74\x66\x38"));
    return data && typeof data === "\x6f\x62\x6a\x65\x63\x74" ? { groups: data.groups || {} } : { groups: {} };
  } catch {
    return { groups: {} };
  }
}

function saveDb(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const temp = `${DB_PATH}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(db, null, 2));
  fs.renameSync(temp, DB_PATH);
}

export function isRpgEnabled(groupJid) {
  if (!groupJid) return true;
  return loadDb().groups?.[groupJid]?.enabled !== false;
}

export function setRpgEnabled(groupJid, enabled, changedBy = "") {
  if (!groupJid) return false;
  const db = loadDb();
  db.groups[groupJid] = {
    enabled: Boolean(enabled),
    changedBy: String(changedBy || ""),
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return db.groups[groupJid].enabled;
}
