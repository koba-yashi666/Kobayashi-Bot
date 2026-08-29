import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "atividade-grupos.json");
const LEVEL_CONFIG_FILE = path.join(process.cwd(), "files", "database", "nivel-config.json");
const SAVE_INTERVAL = 15000;
const XP_COOLDOWN = 45000;
const COMMAND_XP_COOLDOWN = 60000;
const DUPLICATE_WINDOW = 5 * 60000;
let cache = null;
let dirty = false;
let timer = null;

function load() {
  if (!cache) cache = readJsonFile(DB_FILE, {});
  return cache;
}


function loadLevelConfig() {
  return readJsonFile(LEVEL_CONFIG_FILE, {});
}

export function isLevelEnabled(groupJid) {
  if (!groupJid) return false;
  const db = loadLevelConfig();
  // Compatibilidade: grupos sem configuração explícita continuam com Level ligado.
  return db?.[groupJid]?.enabled !== false;
}

export function setLevelEnabled(groupJid, enabled) {
  if (!groupJid) return false;
  const db = loadLevelConfig();
  db[groupJid] = { ...(db[groupJid] || {}), enabled: Boolean(enabled), updatedAt: Date.now() };
  writeJsonFile(LEVEL_CONFIG_FILE, db);
  return Boolean(enabled);
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

export const MAX_LEVEL = 50;

export function xpRequiredForNextLevel(level = 1) {
  const lv = Math.max(1, Math.min(MAX_LEVEL, Number(level) || 1));
  if (lv >= MAX_LEVEL) return 0;

  // Níveis 1–10: 100 XP por nível.
  // Depois do nível 10, a exigência cresce suavemente em +25 XP por nível.
  if (lv <= 10) return 100;
  return 100 + ((lv - 10) * 25);
}

export function xpForLevel(level = 1) {
  const target = Math.max(1, Math.min(MAX_LEVEL, Number(level) || 1));
  let total = 0;
  for (let current = 1; current < target; current += 1) {
    total += xpRequiredForNextLevel(current);
  }
  return total;
}

export function levelFromXp(xp = 0) {
  const value = Math.max(0, Number(xp) || 0);
  let level = 1;
  while (level < MAX_LEVEL && xpForLevel(level + 1) <= value) level += 1;
  return level;
}

export function getLevelTitle(level = 1) {
  const lv = Math.max(1, Math.min(MAX_LEVEL, Number(level) || 1));

  if (lv >= 50) return "🐲 Dragão Primordial";
  if (lv >= 46) return "🌠 Dragão Lendário";
  if (lv >= 41) return "🌌 Dragão Cósmico";
  if (lv >= 36) return "👑 Dragão Imperial";
  if (lv >= 31) return "🔥 Dragão Carmesim";
  if (lv >= 26) return "🌙 Dragão Lunar";
  if (lv >= 21) return "⚡ Dragão Ascendente";
  if (lv >= 16) return "🐉 Jovem Dragão";
  if (lv >= 11) return "🌸 Dragão Aprendiz";
  if (lv >= 6) return "🐣 Filhote de Dragão";
  return "🥚 Ovo de Dragão";
}

export function getLevelInfoFromXp(xp = 0) {
  const totalXp = Math.max(0, Number(xp) || 0);
  const level = levelFromXp(totalXp);
  const start = xpForLevel(level);

  if (level >= MAX_LEVEL) {
    return {
      xp: totalXp,
      level: MAX_LEVEL,
      title: getLevelTitle(MAX_LEVEL),
      currentXp: 0,
      neededXp: 0,
      nextLevelXp: xpForLevel(MAX_LEVEL),
      progress: 100,
      maxLevel: true
    };
  }

  const needed = xpRequiredForNextLevel(level);
  const current = Math.max(0, totalXp - start);
  const progress = Math.max(0, Math.min(100, Math.floor((current / needed) * 100)));

  return {
    xp: totalXp,
    level,
    title: getLevelTitle(level),
    currentXp: current,
    neededXp: needed,
    nextLevelXp: start + needed,
    progress,
    maxLevel: false
  };
}

function normalizeText(text = "") {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim().slice(0, 300);
}

function xpGainForText(text = "") {
  const length = normalizeText(text).length;
  const bonus = Math.min(7, Math.floor(length / 25));
  return 5 + bonus; // 5–12 XP por conversa válida
}

function xpGainForCommand(text = "") {
  const length = normalizeText(text).length;
  const bonus = Math.min(4, Math.floor(length / 35));
  return 14 + bonus; // 14–18 XP: usar o bot rende mais que conversar
}

function xpGainForMedia(activityType = "text") {
  if (activityType === "image") return 10;   // fotos também participam do Dragon Level
  if (activityType === "sticker") return 7; // figurinhas rendem XP menor para reduzir farm
  return 0;
}

function normalizeActivityType(value = "text") {
  const type = String(value || "text").toLowerCase();
  if (["image", "photo", "foto"].includes(type)) return "image";
  if (["sticker", "figurinha", "fig"].includes(type)) return "sticker";
  return "text";
}

function ensureCounters(row) {
  // Registros criados antes da v0.3.8 não guardavam o tipo da mensagem.
  // Preservamos esse total separadamente para não fingir que eram textos/fotos/figurinhas.
  if (!row.activityCountersV2) {
    row.legacyMessages = Math.max(0, Number(row.messages || 0));
    row.textMessages = 0;
    row.images = 0;
    row.stickers = 0;
    row.activityCountersV2 = true;
  }

  row.textMessages = Math.max(0, Number(row.textMessages || 0));
  row.images = Math.max(0, Number(row.images || 0));
  row.stickers = Math.max(0, Number(row.stickers || 0));
  row.legacyMessages = Math.max(0, Number(row.legacyMessages || 0));
}

export function trackActivity(groupJid, userJid, options = {}) {
  if (!groupJid || !userJid) return { xpGained: 0, levelUp: false };

  const data = load();
  data[groupJid] ||= {};
  const row = data[groupJid][userJid] ||= {
    messages: 0,
    textMessages: 0,
    images: 0,
    stickers: 0,
    legacyMessages: 0,
    activityCountersV2: true,
    lastSeen: 0,
    xp: 0,
    level: 1,
    lastXpAt: 0,
    lastXpText: "",
    lastXpTextAt: 0
  };

  ensureCounters(row);

  const activityType = normalizeActivityType(options.activityType);
  row.messages = Number(row.messages || 0) + 1;
  if (activityType === "image") row.images += 1;
  else if (activityType === "sticker") row.stickers += 1;
  else row.textMessages += 1;

  row.lastSeen = Date.now();

  const text = normalizeText(options.text || "");
  const isCommand = Boolean(options.isCommand);
  const now = Date.now();
  const oldLevel = levelFromXp(row.xp || 0);
  let xpGained = 0;

  // O contador funciona sempre. O XP só é concedido se o Dragon Level estiver ligado.
  if (isLevelEnabled(groupJid)) {
    const isMedia = activityType === "image" || activityType === "sticker";
    const eligible = isMedia || text.length >= (isCommand ? 1 : 3);

    if (eligible) {
      const cooldown = isCommand ? COMMAND_XP_COOLDOWN : XP_COOLDOWN;
      const cooldownOk = now - Number(row.lastXpAt || 0) >= cooldown;

      // Textos repetidos continuam protegidos pelo anti-farm.
      // Mídias usam o cooldown global; não dependem de legenda para ganhar XP.
      const duplicateKey = isMedia ? "" : text;
      const duplicated =
        Boolean(duplicateKey) &&
        row.lastXpText === duplicateKey &&
        now - Number(row.lastXpTextAt || 0) < DUPLICATE_WINDOW;

      if (cooldownOk && !duplicated) {
        xpGained = isCommand
          ? xpGainForCommand(text || activityType)
          : isMedia
            ? xpGainForMedia(activityType)
            : xpGainForText(text);

        row.xp = Math.max(0, Number(row.xp || 0)) + xpGained;
        row.lastXpAt = now;
        row.lastXpText = duplicateKey;
        row.lastXpTextAt = now;
      }
    }
  }

  const newLevel = levelFromXp(row.xp || 0);
  row.level = newLevel;
  scheduleSave();

  return {
    xpGained,
    levelUp: newLevel > oldLevel,
    oldLevel,
    level: newLevel,
    xp: Number(row.xp || 0),
    title: getLevelTitle(newLevel),
    activityType
  };
}

export function getUserActivity(groupJid, userJid) {
  const row = load()?.[groupJid]?.[userJid];
  if (!row) {
    return {
      messages: 0,
      textMessages: 0,
      images: 0,
      stickers: 0,
      legacyMessages: 0,
      lastSeen: 0,
      xp: 0,
      ...getLevelInfoFromXp(0)
    };
  }

  ensureCounters(row);
  const info = getLevelInfoFromXp(row.xp || 0);
  return {
    messages: Number(row.messages || 0),
    textMessages: Number(row.textMessages || 0),
    images: Number(row.images || 0),
    stickers: Number(row.stickers || 0),
    legacyMessages: Number(row.legacyMessages || 0),
    lastSeen: Number(row.lastSeen || 0),
    ...info
  };
}

export function getTopActivity(groupJid, limit = 10) {
  return Object.entries(load()?.[groupJid] || {})
    .map(([jid, row]) => {
      ensureCounters(row);
      return {
        jid,
        messages: Number(row.messages || 0),
        textMessages: Number(row.textMessages || 0),
        images: Number(row.images || 0),
        stickers: Number(row.stickers || 0),
        legacyMessages: Number(row.legacyMessages || 0),
        lastSeen: Number(row.lastSeen || 0),
        ...getLevelInfoFromXp(row.xp || 0)
      };
    })
    .sort((a,b) => b.messages - a.messages)
    .slice(0, Math.max(1, Math.min(1000, Number(limit) || 10)));
}

export function getTopLevel(groupJid, limit = 10) {
  return Object.entries(load()?.[groupJid] || {})
    .map(([jid, row]) => {
      ensureCounters(row);
      return {
        jid,
        messages: Number(row.messages || 0),
        textMessages: Number(row.textMessages || 0),
        images: Number(row.images || 0),
        stickers: Number(row.stickers || 0),
        legacyMessages: Number(row.legacyMessages || 0),
        lastSeen: Number(row.lastSeen || 0),
        ...getLevelInfoFromXp(row.xp || 0)
      };
    })
    .sort((a,b) => b.xp - a.xp || b.messages - a.messages)
    .slice(0, Math.max(1, Math.min(30, Number(limit) || 10)));
}


export function getGlobalTopLevel(limit = 10) {
  const db = load();
  const aggregated = new Map();

  for (const [groupJid, users] of Object.entries(db || {})) {
    if (!isLevelEnabled(groupJid)) continue;

    for (const [jid, row] of Object.entries(users || {})) {
      const current = aggregated.get(jid) || {
        jid,
        xp: 0,
        messages: 0,
        textMessages: 0,
        images: 0,
        stickers: 0,
        legacyMessages: 0,
        groups: 0
      };

      current.xp += Math.max(0, Number(row?.xp || 0));
      ensureCounters(row);
      current.messages += Math.max(0, Number(row?.messages || 0));
      current.textMessages += Math.max(0, Number(row?.textMessages || 0));
      current.images += Math.max(0, Number(row?.images || 0));
      current.stickers += Math.max(0, Number(row?.stickers || 0));
      current.legacyMessages += Math.max(0, Number(row?.legacyMessages || 0));
      current.groups += 1;
      aggregated.set(jid, current);
    }
  }

  return [...aggregated.values()]
    .map((row) => ({
      ...row,
      ...getLevelInfoFromXp(row.xp)
    }))
    .sort((a, b) => b.xp - a.xp || b.messages - a.messages)
    .slice(0, Math.max(1, Math.min(50, Number(limit) || 10)));
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
