import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "atividade-grupos.json");
const SAVE_INTERVAL = 15000;
const TRACKER_STARTED_AT = Date.now();
let cache = null;
let dirty = false;
let timer = null;

function load() {
  if (!cache) cache = readJsonFile(DB_FILE, {});
  return cache;
}

function scheduleSave() {
  dirty = true;
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    if (!dirty) return;
    dirty = false;
    writeJsonFile(DB_FILE, load());
  }, SAVE_INTERVAL);
  timer.unref?.();
}

export function trackActivity(groupJid, userJid) {
  if (!groupJid || !userJid) return;
  const data = load();
  data[groupJid] ||= {};
  const row = data[groupJid][userJid] ||= { messages: 0, lastSeen: 0 };
  row.messages = Number(row.messages || 0) + 1;
  row.lastSeen = Date.now();
  scheduleSave();
}

export function getUserActivity(groupJid, userJid) {
  const row = load()?.[groupJid]?.[userJid];
  return row ? { messages: Number(row.messages || 0), lastSeen: Number(row.lastSeen || 0) } : { messages: 0, lastSeen: 0 };
}

export function getTopActivity(groupJid, limit = 10) {
  return Object.entries(load()?.[groupJid] || {})
    .map(([jid, row]) => ({ jid, messages: Number(row.messages || 0), lastSeen: Number(row.lastSeen || 0) }))
    .sort((a,b) => b.messages - a.messages)
    .slice(0, Math.max(1, Math.min(30, Number(limit) || 10)));
}

export function getInactive(groupJid, memberJids = [], days = 7) {
  const requestedDays = Math.max(1, Number(days) || 7);
  const cutoff = Date.now() - requestedDays * 86400000;
  const group = load()?.[groupJid] || {};

  // Só podemos afirmar que alguém está inativo quando existe histórico
  // registrado pelo tracker. Usuários sem registro não entram na lista.
  return memberJids.filter((jid) => {
    const row = group?.[jid];
    if (!row) return false;

    const lastSeen = Number(row.lastSeen || 0);
    return lastSeen > 0 && lastSeen < cutoff;
  });
}

export function flushActivity() {
  if (dirty) {
    dirty = false;
    writeJsonFile(DB_FILE, load());
  }
}
