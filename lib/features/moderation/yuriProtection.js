import path from "node:path";
import { readJsonFile, writeJsonFile } from "../../core/jsonStore.js";

const DB_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "yuri-protection.json"
);

const floodMemory = new Map();

function readDb() {
  return readJsonFile(DB_FILE, {});
}

function writeDb(db) {
  writeJsonFile(DB_FILE, db);
}

export function getYuriProtection(groupJid) {
  const db = readDb();
  const group = db?.[groupJid] || {};

  return {
    antiflood: Boolean(group.antiflood),
    antidel: Boolean(group.antidel),
    antiedit: Boolean(group.antiedit),
    floodInterval: Math.max(1, Number(group.floodInterval || 5)),
    mutedUsers: group.mutedUsers || {},
  };
}

export function setProtection(groupJid, key, value) {
  const db = readDb();
  db[groupJid] ||= {};
  db[groupJid][key] = value;
  writeDb(db);
  return db[groupJid][key];
}

export function toggleYuriProtection(groupJid, key) {
  const current = getYuriProtection(groupJid);
  return setProtection(groupJid, key, !Boolean(current[key]));
}

export function configureAntiFlood(groupJid, seconds) {
  const db = readDb();
  db[groupJid] ||= {};

  if (seconds === null) {
    db[groupJid].antiflood = false;
    delete db[groupJid].floodInterval;
    writeDb(db);
    return { enabled: false, interval: null };
  }

  const interval = Math.max(1, Math.min(300, Number(seconds) || 5));
  db[groupJid].antiflood = true;
  db[groupJid].floodInterval = interval;
  writeDb(db);

  return { enabled: true, interval };
}

export function checkCommandFlood(groupJid, userJid) {
  const cfg = getYuriProtection(groupJid);

  if (!cfg.antiflood) {
    return { blocked: false, waitSeconds: 0, strikes: 0, reason: null };
  }

  const key = `${groupJid}:${userJid}`;
  const now = Date.now();
  const intervalMs = cfg.floodInterval * 1000;

  const state = floodMemory.get(key) || {
    last: 0,
    recent: [],
    strikes: 0,
    penaltyUntil: 0,
    lastStrikeAt: 0,
  };

  // Limpa histórico antigo para não crescer em memória.
  state.recent = state.recent.filter(ts => now - ts <= 15000);

  if (state.penaltyUntil > now) {
    floodMemory.set(key, state);
    return {
      blocked: true,
      waitSeconds: Math.max(1, Math.ceil((state.penaltyUntil - now) / 1000)),
      strikes: state.strikes,
      reason: "penalty",
    };
  }

  const tooFast = state.last && now - state.last < intervalMs;
  const burst = state.recent.length >= 4; // 5º comando em até 15s.

  if (tooFast || burst) {
    // Reincidência expira depois de 2 minutos sem flood.
    if (state.lastStrikeAt && now - state.lastStrikeAt > 120000) state.strikes = 0;
    state.strikes = Math.min(5, state.strikes + 1);
    state.lastStrikeAt = now;

    // Penalidade progressiva, sem ban automático.
    const base = Math.max(cfg.floodInterval, 2);
    const penalty = Math.min(60, base * Math.max(1, state.strikes));
    state.penaltyUntil = now + penalty * 1000;

    floodMemory.set(key, state);
    return {
      blocked: true,
      waitSeconds: penalty,
      strikes: state.strikes,
      reason: burst ? "burst" : "interval",
    };
  }

  state.last = now;
  state.recent.push(now);

  // Bom comportamento reduz reincidência gradualmente.
  if (state.lastStrikeAt && now - state.lastStrikeAt > 120000) {
    state.strikes = 0;
    state.lastStrikeAt = 0;
  }

  floodMemory.set(key, state);
  return { blocked: false, waitSeconds: 0, strikes: state.strikes, reason: null };
}

const muteId=id=>String(id||"").replace(/:\d+(?=@)/,"").replace(/@c\.us$/,"@s.whatsapp.net");
const muteIds=values=>[...new Set((Array.isArray(values)?values:[values]).map(muteId).filter(Boolean))];
export function muteUser(groupJid,userJid,{mode="delete",aliases=[]}={}) {
  const db=readDb();db[groupJid] ||= {};db[groupJid].mutedUsers ||= {};
  const ids=muteIds([userJid,...aliases]);
  // Atualiza todos os aliases conhecidos e registros antigos da mesma pessoa.
  for(const [id,entry] of Object.entries(db[groupJid].mutedUsers))if([id,...(entry?.aliases||[])].some(x=>ids.includes(muteId(x))))ids.push(...muteIds([id,...(entry?.aliases||[])]));
  const entry={mode:mode==="ban"?"ban":"delete",aliases:muteIds(ids),at:Date.now()};
  for(const id of entry.aliases)db[groupJid].mutedUsers[id]=entry;
  writeDb(db);return true;
}
export function getMuteState(groupJid,identities) {
  const ids=muteIds(identities),users=readDb()?.[groupJid]?.mutedUsers||{};
  const entries=Object.entries(users).filter(([id,entry])=>entry&&[id,...(entry?.aliases||[])].some(x=>ids.includes(muteId(x))));
  if(!entries.length)return null;
  return {mode:entries.some(([,entry])=>entry?.mode==="ban")?"ban":"delete",aliases:muteIds([...ids,...entries.flatMap(([id,entry])=>[id,...(entry?.aliases||[])])])};
}
export function unmuteUser(groupJid,identities) {
  const db=readDb(),users=db?.[groupJid]?.mutedUsers||{},state=getMuteState(groupJid,identities);
  if(!state)return false;
  for(const [id,entry] of Object.entries(users))if([id,...(entry?.aliases||[])].some(x=>state.aliases.includes(muteId(x))))delete users[id];
  writeDb(db);return true;
}
export function isMuted(groupJid,userJid){return Boolean(getMuteState(groupJid,userJid));}

