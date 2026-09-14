/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x61\x75\x74\x6f\x73\x74\x69\x63\x6b\x65\x72\x2e\x6a\x73\x6f\x6e");

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
