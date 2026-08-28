import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "atividade-grupos.json");
const SAVE_INTERVAL = 15000;
const XP_COOLDOWN = 45000;
const DUPLICATE_WINDOW = 5 * 60000;
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

export function xpForLevel(level = 0) {
  const lv = Math.max(0, Number(level) || 0);
  return 50 * lv * (lv + 1);
}

export function levelFromXp(xp = 0) {
  const value = Math.max(0, Number(xp) || 0);
  let level = 0;
  while (level < 500 && xpForLevel(level + 1) <= value) level += 1;
  return level;
}

export function getLevelTitle(level = 0) {
  const lv = Math.max(0, Number(level) || 0);
  if (lv >= 100) return "🐲 Dragão Primordial";
  if (lv >= 75) return "🌌 Dragão Cósmico";
  if (lv >= 50) return "👑 Dragão Imperial";
  if (lv >= 35) return "🔥 Dragão Carmesim";
  if (lv >= 25) return "🌙 Dragão Lunar";
  if (lv >= 15) return "⚡ Dragão Ascendente";
  if (lv >= 10) return "🐉 Jovem Dragão";
  if (lv >= 5) return "🐲 Filhote de Dragão";
  if (lv >= 1) return "🥚 Ovo Desperto";
  return "🥚 Ovo de Dragão";
}

export function getLevelInfoFromXp(xp = 0) {
  const totalXp = Math.max(0, Number(xp) || 0);
  const level = levelFromXp(totalXp);
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const current = Math.max(0, totalXp - start);
  const needed = Math.max(1, next - start);
  const progress = Math.max(0, Math.min(100, Math.floor((current / needed) * 100)));
  return { xp: totalXp, level, title: getLevelTitle(level), currentXp: current, neededXp: needed, nextLevelXp: next, progress };
}

function normalizeText(text = "") {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim().slice(0, 300);
}

function xpGainForText(text = "") {
  const length = normalizeText(text).length;
  const bonus = Math.min(7, Math.floor(length / 25));
  return 5 + bonus;
}

export function trackActivity(groupJid, userJid, options = {}) {
  if (!groupJid || !userJid) return { xpGained: 0, levelUp: false };
  const data = load();
  data[groupJid] ||= {};
  const row = data[groupJid][userJid] ||= { messages: 0, lastSeen: 0, xp: 0, level: 0, lastXpAt: 0, lastXpText: "", lastXpTextAt: 0 };
  row.messages = Number(row.messages || 0) + 1;
  row.lastSeen = Date.now();

  const text = normalizeText(options.text || "");
  const isCommand = Boolean(options.isCommand);
  const now = Date.now();
  const oldLevel = levelFromXp(row.xp || 0);
  let xpGained = 0;

  // Anti-farm: comando não dá XP, mensagem precisa ter conteúdo,
  // há cooldown por usuário e repetição recente não pontua.
  if (!isCommand && text.length >= 3) {
    const cooldownOk = now - Number(row.lastXpAt || 0) >= XP_COOLDOWN;
    const duplicated = row.lastXpText === text && now - Number(row.lastXpTextAt || 0) < DUPLICATE_WINDOW;
    if (cooldownOk && !duplicated) {
      xpGained = xpGainForText(text);
      row.xp = Math.max(0, Number(row.xp || 0)) + xpGained;
      row.lastXpAt = now;
      row.lastXpText = text;
      row.lastXpTextAt = now;
    }
  }

  const newLevel = levelFromXp(row.xp || 0);
  row.level = newLevel;
  scheduleSave();
  return { xpGained, levelUp: newLevel > oldLevel, oldLevel, level: newLevel, xp: Number(row.xp || 0), title: getLevelTitle(newLevel) };
}

export function getUserActivity(groupJid, userJid) {
  const row = load()?.[groupJid]?.[userJid];
  if (!row) return { messages: 0, lastSeen: 0, xp: 0, level: 0, title: getLevelTitle(0), ...getLevelInfoFromXp(0) };
  const info = getLevelInfoFromXp(row.xp || 0);
  return { messages: Number(row.messages || 0), lastSeen: Number(row.lastSeen || 0), ...info };
}

export function getTopActivity(groupJid, limit = 10) {
  return Object.entries(load()?.[groupJid] || {})
    .map(([jid, row]) => ({ jid, messages: Number(row.messages || 0), lastSeen: Number(row.lastSeen || 0), ...getLevelInfoFromXp(row.xp || 0) }))
    .sort((a,b) => b.messages - a.messages)
    .slice(0, Math.max(1, Math.min(1000, Number(limit) || 10)));
}

export function getTopLevel(groupJid, limit = 10) {
  return Object.entries(load()?.[groupJid] || {})
    .map(([jid, row]) => ({ jid, messages: Number(row.messages || 0), lastSeen: Number(row.lastSeen || 0), ...getLevelInfoFromXp(row.xp || 0) }))
    .sort((a,b) => b.xp - a.xp || b.messages - a.messages)
    .slice(0, Math.max(1, Math.min(30, Number(limit) || 10)));
}

export function getInactive(groupJid, memberJids = [], days = 7) {
  const requestedDays = Math.max(1, Number(days) || 7);
  const cutoff = Date.now() - requestedDays * 86400000;
  const group = load()?.[groupJid] || {};
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
