import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "sticker-cmd.json");

function readDb() {
  return readJsonFile(DB_FILE, {});
}

function stickerHashFromMessage(message = {}) {
  const hash = message?.stickerMessage?.fileSha256;
  if (!hash) return null;
  try { return Buffer.from(hash).toString("base64"); } catch { return null; }
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
