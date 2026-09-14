/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(
  process.cwd(),
  "\x66\x69\x6c\x65\x73",
  "\x64\x61\x74\x61\x62\x61\x73\x65",
  "\x79\x75\x72\x69\x2d\x70\x72\x6f\x74\x65\x63\x74\x69\x6f\x6e\x2e\x6a\x73\x6f\x6e"
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
    return { blocked: false, waitSeconds: 0 };
  }

  const key = `${groupJid}:${userJid}`;
  const now = Date.now();
  const previous = Number(floodMemory.get(key) || 0);
  const intervalMs = cfg.floodInterval * 1000;

  if (previous && now - previous < intervalMs) {
    return {
      blocked: true,
      waitSeconds: Math.max(
        1,
        Math.ceil((intervalMs - (now - previous)) / 1000)
      ),
    };
  }

  floodMemory.set(key, now);
  return { blocked: false, waitSeconds: 0 };
}

export function muteUser(groupJid, userJid) {
  const db = readDb();
  db[groupJid] ||= {};
  db[groupJid].mutedUsers ||= {};
  db[groupJid].mutedUsers[userJid] = true;
  writeDb(db);
  return true;
}

export function unmuteUser(groupJid, userJid) {
  const db = readDb();
  db[groupJid] ||= {};
  db[groupJid].mutedUsers ||= {};

  const existed = Boolean(db[groupJid].mutedUsers[userJid]);

  delete db[groupJid].mutedUsers[userJid];
  writeDb(db);

  return existed;
}

export function isMuted(groupJid, userJid) {
  return Boolean(
    readDb()?.[groupJid]?.mutedUsers?.[userJid]
  );
}
