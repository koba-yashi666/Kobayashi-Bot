import path from "node:path";
import { readJsonFile, writeJsonFile } from "../../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "horarios-grupos.json");

export function readGroupScheduleDb() {
  return readJsonFile(DB_FILE, {});
}

export function normalizeClockTime(value = "") {
  const match = String(value).trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : null;
}

export function updateGroupSchedule(groupJid, patch) {
  const db = readGroupScheduleDb();
  db[groupJid] = { ...(db[groupJid] || {}), ...patch };
  writeJsonFile(DB_FILE, db);
  return db[groupJid];
}
