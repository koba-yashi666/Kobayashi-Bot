/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x74\x69\x63\x6b\x65\x72\x2d\x63\x6d\x64\x2e\x6a\x73\x6f\x6e");

function readDb() {
  return readJsonFile(DB_FILE, {});
}

function stickerHashFromMessage(message = {}) {
  const hash = message?.stickerMessage?.fileSha256;
  if (!hash) return null;
  try { return Buffer.from(hash).toString("\x62\x61\x73\x65\x36\x34"); } catch { return null; }
}

export function getStickerMappedCommand(message = {}) {
  const hash = stickerHashFromMessage(message);
  return hash ? readDb()[hash] || null : null;
}

export function setStickerMappedCommand(message = {}, commandText) {
  const hash = stickerHashFromMessage(message);
  if (!hash) return false;
  const db = readDb();
  db[hash] = commandText;
  writeJsonFile(DB_FILE, db);
  return true;
}

export function removeStickerMappedCommand(message = {}) {
  const hash = stickerHashFromMessage(message);
  if (!hash) return false;
  const db = readDb();
  if (!(hash in db)) return false;
  delete db[hash];
  writeJsonFile(DB_FILE, db);
  return true;
}

export function listStickerMappedCommands() {
  return readDb();
}
