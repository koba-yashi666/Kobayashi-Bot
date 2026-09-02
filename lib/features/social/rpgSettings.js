import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "files", "database", "rpg-settings.json");

function loadDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return { groups: {} };
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    return data && typeof data === "object" ? { groups: data.groups || {} } : { groups: {} };
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
