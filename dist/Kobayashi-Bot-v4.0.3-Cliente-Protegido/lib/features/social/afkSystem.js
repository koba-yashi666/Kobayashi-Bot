/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x61\x66\x6b\x2e\x6a\x73\x6f\x6e");

function db() {
  return readJsonFile(DB_FILE, {});
}

export function setAfk(userJid, reason = "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f") {
  const data = db();
  data[userJid] = {
    reason: String(reason || "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f").trim(),
    since: Date.now(),
  };
  writeJsonFile(DB_FILE, data);
  return data[userJid];
}

export function getAfk(userJid) {
  return db()?.[userJid] || null;
}

export function removeAfk(userJid) {
  const data = db();
  const old = data?.[userJid] || null;
  if (!old) return null;
  delete data[userJid];
  writeJsonFile(DB_FILE, data);
  return old;
}

export function formatDuration(ms) {
  let sec = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const d = Math.floor(sec / 86400); sec %= 86400;
  const h = Math.floor(sec / 3600); sec %= 3600;
  const m = Math.floor(sec / 60); sec %= 60;
  return [d ? `${d}d` : "", h ? `${h}h` : "", m ? `${m}m` : "", `${sec}s`].filter(Boolean).join(" ");
}
