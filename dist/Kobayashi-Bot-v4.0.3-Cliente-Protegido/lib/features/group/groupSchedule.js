/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x68\x6f\x72\x61\x72\x69\x6f\x73\x2d\x67\x72\x75\x70\x6f\x73\x2e\x6a\x73\x6f\x6e");

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
