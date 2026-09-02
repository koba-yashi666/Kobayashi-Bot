import path from "node:path";
import { readJsonFile, writeJsonFile } from "../../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "autosticker.json");

function readDb() {
  return readJsonFile(DB_FILE, {});
}

export function setAutoSticker(groupJid, enabled) {
  const db = readDb();
  db[groupJid] = Boolean(enabled);
  writeJsonFile(DB_FILE, db);
  return db[groupJid];
}

export function isAutoStickerEnabled(groupJid) {
  return readDb()[groupJid] === true;
}
