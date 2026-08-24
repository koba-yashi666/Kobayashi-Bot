import path from "node:path";
import { readJsonFile as readJson, writeJsonFile as writeJson } from "../core/jsonStore.js";

const SETTINGS_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "admin-logs-config.json"
);

const LOG_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "admin-logs.json"
);

export function getAdminLogConfig(groupJid) {
  const db = readJson(SETTINGS_FILE, {});
  return {
    enabled: Boolean(db?.[groupJid]?.enabled),
  };
}

export function setAdminLogEnabled(groupJid, enabled) {
  const db = readJson(SETTINGS_FILE, {});
  db[groupJid] = {
    ...(db[groupJid] || {}),
    enabled: Boolean(enabled),
  };
  writeJson(SETTINGS_FILE, db);
  return Boolean(db[groupJid].enabled);
}

export function addAdminLog(groupJid, entry = {}) {
  const cfg = getAdminLogConfig(groupJid);
  if (!cfg.enabled) return false;

  const db = readJson(LOG_FILE, {});
  if (!Array.isArray(db[groupJid])) db[groupJid] = [];

  db[groupJid].unshift({
    at: new Date().toISOString(),
    type: entry.type || "action",
    actor: entry.actor || null,
    target: entry.target || null,
    detail: entry.detail || "",
  });

  db[groupJid] = db[groupJid].slice(0, 100);
  writeJson(LOG_FILE, db);
  return true;
}

export function getAdminLogs(groupJid, limit = 10) {
  const db = readJson(LOG_FILE, {});
  const logs = Array.isArray(db[groupJid]) ? db[groupJid] : [];
  return logs.slice(0, Math.max(1, Math.min(30, Number(limit) || 10)));
}
