import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "yuri-protection.json");
const floodMemory = new Map();
const mutedMemory = new Map();

function readDb() { return readJsonFile(DB_FILE, {}); }
function writeDb(db) { writeJsonFile(DB_FILE, db); }

export function getYuriProtection(groupJid) {
  const db = readDb();
  return {
    antiflood: Boolean(db?.[groupJid]?.antiflood),
    antidel: Boolean(db?.[groupJid]?.antidel),
    antiedit: Boolean(db?.[groupJid]?.antiedit),
    floodLimit: Number(db?.[groupJid]?.floodLimit || 6),
    floodWindowMs: Number(db?.[groupJid]?.floodWindowMs || 7000),
  };
}

export function toggleYuriProtection(groupJid, key) {
  const db = readDb();
  db[groupJid] ||= {};
  db[groupJid][key] = !Boolean(db[groupJid][key]);
  writeDb(db);
  return db[groupJid][key];
}

export function registerFlood(groupJid, userJid) {
  const cfg = getYuriProtection(groupJid);
  if (!cfg.antiflood) return { flood: false, count: 0 };

  const key = `${groupJid}:${userJid}`;
  const now = Date.now();
  const list = (floodMemory.get(key) || []).filter(t => now - t <= cfg.floodWindowMs);
  list.push(now);
  floodMemory.set(key, list);
  return { flood: list.length >= cfg.floodLimit, count: list.length };
}

export function resetFlood(groupJid, userJid) {
  floodMemory.delete(`${groupJid}:${userJid}`);
}

export function muteUser(groupJid, userJid) {
  const key = `${groupJid}:${userJid}`;
  mutedMemory.set(key, true);
}

export function unmuteUser(groupJid, userJid) {
  mutedMemory.delete(`${groupJid}:${userJid}`);
}

export function isMuted(groupJid, userJid) {
  return mutedMemory.has(`${groupJid}:${userJid}`);
}
