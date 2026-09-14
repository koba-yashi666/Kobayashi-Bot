/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const CONTROL_FILE = path.join(
  process.cwd(),
  "\x66\x69\x6c\x65\x73",
  "\x64\x61\x74\x61\x62\x61\x73\x65",
  "\x63\x6f\x6d\x6d\x61\x6e\x64\x2d\x63\x6f\x6e\x74\x72\x6f\x6c\x2e\x6a\x73\x6f\x6e"
);

const ALIASES_FILE = path.join(
  process.cwd(),
  "\x66\x69\x6c\x65\x73",
  "\x64\x61\x74\x61\x62\x61\x73\x65",
  "\x63\x6f\x6d\x6d\x61\x6e\x64\x2d\x61\x6c\x69\x61\x73\x65\x73\x2e\x6a\x73\x6f\x6e"
);

const STATS_FILE = path.join(
  process.cwd(),
  "\x66\x69\x6c\x65\x73",
  "\x64\x61\x74\x61\x62\x61\x73\x65",
  "\x63\x6f\x6d\x6d\x61\x6e\x64\x2d\x73\x74\x61\x74\x73\x2e\x6a\x73\x6f\x6e"
);

let statsCache = null;
let statsDirty = false;
let statsTimer = null;

function normalizeCommand(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("\x4e\x46\x44")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^[/!+.#$%&*-]+/, "")
    .replace(/\s+/g, "");
}

function readControl() {
  return readJsonFile(CONTROL_FILE, {
    globalBlocked: {},
    groups: {},
  });
}

function writeControl(data) {
  writeJsonFile(CONTROL_FILE, data);
}

export function getGroupCommandConfig(groupJid) {
  const db = readControl();
  const group = db?.groups?.[groupJid] || {};

  return {
    soadm: Boolean(group.soadm),
    blockedCommands:
      group.blockedCommands &&
      typeof group.blockedCommands === "\x6f\x62\x6a\x65\x63\x74"
        ? group.blockedCommands
        : {},
  };
}

export function setSoAdm(groupJid, enabled) {
  const db = readControl();
  db.groups ||= {};
  db.groups[groupJid] ||= {};
  db.groups[groupJid].soadm = Boolean(enabled);
  writeControl(db);
  return Boolean(db.groups[groupJid].soadm);
}

export function toggleSoAdm(groupJid) {
  const current = getGroupCommandConfig(groupJid);
  return setSoAdm(groupJid, !current.soadm);
}

export function blockGroupCommand(groupJid, command) {
  const cmd = normalizeCommand(command);
  if (!cmd) return false;

  const db = readControl();
  db.groups ||= {};
  db.groups[groupJid] ||= {};
  db.groups[groupJid].blockedCommands ||= {};
  db.groups[groupJid].blockedCommands[cmd] = {
    at: new Date().toISOString(),
  };
  writeControl(db);
  return true;
}

export function unblockGroupCommand(groupJid, command) {
  const cmd = normalizeCommand(command);
  const db = readControl();
  const blocked = db?.groups?.[groupJid]?.blockedCommands;

  if (!cmd || !blocked?.[cmd]) return false;

  delete blocked[cmd];
  writeControl(db);
  return true;
}

export function isGroupCommandBlocked(groupJid, command) {
  const cmd = normalizeCommand(command);
  return Boolean(
    readControl()?.groups?.[groupJid]?.blockedCommands?.[cmd]
  );
}

export function blockGlobalCommand(command, reason = "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f") {
  const cmd = normalizeCommand(command);
  if (!cmd) return false;

  const db = readControl();
  db.globalBlocked ||= {};
  db.globalBlocked[cmd] = {
    reason: String(reason || "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f").trim(),
    at: new Date().toISOString(),
  };
  writeControl(db);
  return db.globalBlocked[cmd];
}

export function unblockGlobalCommand(command) {
  const cmd = normalizeCommand(command);
  const db = readControl();

  if (!cmd || !db?.globalBlocked?.[cmd]) return false;

  delete db.globalBlocked[cmd];
  writeControl(db);
  return true;
}

export function getGlobalCommandBlock(command) {
  const cmd = normalizeCommand(command);
  return readControl()?.globalBlocked?.[cmd] || null;
}

function readAliasesDb() {
  return readJsonFile(ALIASES_FILE, { aliases: [] });
}

function writeAliasesDb(data) {
  writeJsonFile(ALIASES_FILE, data);
}

export function listCommandAliases() {
  const data = readAliasesDb();
  return Array.isArray(data.aliases) ? data.aliases : [];
}

export function resolveCommandAlias(command) {
  const cmd = normalizeCommand(command);
  if (!cmd) return cmd;

  const alias = listCommandAliases().find(
    (item) => normalizeCommand(item.alias) === cmd
  );

  return alias
    ? normalizeCommand(alias.command)
    : cmd;
}

export function addCommandAlias(alias, command) {
  const aliasName = normalizeCommand(alias);
  const target = normalizeCommand(command);

  if (!aliasName || !target) {
    return { ok: false, reason: "\x69\x6e\x76\x61\x6c\x69\x64" };
  }

  const data = readAliasesDb();
  data.aliases ||= [];

  if (
    data.aliases.some(
      (item) => normalizeCommand(item.alias) === aliasName
    )
  ) {
    return { ok: false, reason: "\x65\x78\x69\x73\x74\x73" };
  }

  data.aliases.push({
    alias: aliasName,
    command: target,
  });

  writeAliasesDb(data);
  return { ok: true, alias: aliasName, command: target };
}

export function removeCommandAlias(index) {
  const data = readAliasesDb();
  data.aliases ||= [];

  const position = Number(index) - 1;

  if (
    !Number.isInteger(position) ||
    position < 0 ||
    position >= data.aliases.length
  ) {
    return null;
  }

  const [removed] = data.aliases.splice(position, 1);
  writeAliasesDb(data);
  return removed || null;
}

function getStatsCache() {
  if (!statsCache) {
    statsCache = readJsonFile(STATS_FILE, {
      commands: {},
      total: 0,
      lastUpdated: null,
    });
  }
  return statsCache;
}

function scheduleStatsSave() {
  statsDirty = true;

  if (statsTimer) return;

  statsTimer = setTimeout(() => {
    statsTimer = null;
    if (!statsDirty) return;
    statsDirty = false;

    const data = getStatsCache();
    data.lastUpdated = new Date().toISOString();
    writeJsonFile(STATS_FILE, data);
  }, 10000);

  statsTimer.unref?.();
}

export function trackCommandUsage(command, userJid) {
  const cmd = normalizeCommand(command);
  if (!cmd) return;

  const data = getStatsCache();
  data.commands ||= {};
  data.total = Number(data.total || 0) + 1;

  const row = data.commands[cmd] || {
    count: 0,
    users: {},
    lastUsed: null,
  };

  row.count = Number(row.count || 0) + 1;
  row.users ||= {};
  row.users[userJid] =
    Number(row.users[userJid] || 0) + 1;
  row.lastUsed = new Date().toISOString();

  data.commands[cmd] = row;
  scheduleStatsSave();
}

export function getMostUsedCommands(limit = 10) {
  const data = getStatsCache();

  return Object.entries(data.commands || {})
    .map(([name, row]) => ({
      name,
      count: Number(row.count || 0),
      uniqueUsers: Object.keys(row.users || {}).length,
      lastUsed: row.lastUsed || null,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, Math.max(1, Math.min(30, Number(limit) || 10)));
}

export function getCommandStats(command) {
  const cmd = normalizeCommand(command);
  const data = getStatsCache();
  const row = data?.commands?.[cmd];

  if (!row) return null;

  return {
    name: cmd,
    count: Number(row.count || 0),
    uniqueUsers: Object.keys(row.users || {}).length,
    lastUsed: row.lastUsed || null,
    topUsers: Object.entries(row.users || {})
      .map(([jid, count]) => ({
        jid,
        count: Number(count || 0),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
}

export function getTotalCommandUsage() {
  return Number(getStatsCache()?.total || 0);
}

export { normalizeCommand };
