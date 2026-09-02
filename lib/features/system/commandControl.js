import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const CONTROL_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "command-control.json"
);

const ALIASES_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "command-aliases.json"
);

const STATS_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "command-stats.json"
);

let statsCache = null;
let statsDirty = false;
let statsTimer = null;

function normalizeCommand(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
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
      typeof group.blockedCommands === "object"
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

export function blockGlobalCommand(command, reason = "Sem motivo informado") {
  const cmd = normalizeCommand(command);
  if (!cmd) return false;

  const db = readControl();
  db.globalBlocked ||= {};
  db.globalBlocked[cmd] = {
    reason: String(reason || "Sem motivo informado").trim(),
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
    return { ok: false, reason: "invalid" };
  }

  const data = readAliasesDb();
  data.aliases ||= [];

  if (
    data.aliases.some(
      (item) => normalizeCommand(item.alias) === aliasName
    )
  ) {
    return { ok: false, reason: "exists" };
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
