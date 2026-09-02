import path from "node:path";
import { readJsonFile, writeJsonFile } from "../../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "lista-branca.json");

function readDb() {
  return readJsonFile(DB_FILE, {});
}

export function getWhitelist(groupJid) {
  const list = readDb()[groupJid];
  return Array.isArray(list) ? list : [];
}

export function isWhitelisted(groupJid, jid) {
  return getWhitelist(groupJid).includes(jid);
}

export function addWhitelist(groupJid, jid) {
  const db = readDb();
  if (!Array.isArray(db[groupJid])) db[groupJid] = [];
  if (!db[groupJid].includes(jid)) db[groupJid].push(jid);
  writeJsonFile(DB_FILE, db);
}

export function removeWhitelist(groupJid, jid) {
  const db = readDb();
  if (!Array.isArray(db[groupJid])) db[groupJid] = [];
  db[groupJid] = db[groupJid].filter((item) => item !== jid);
  writeJsonFile(DB_FILE, db);
}
