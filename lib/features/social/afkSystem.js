import path from "node:path";
import { readJsonFile, writeJsonFile } from "../../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "afk.json");

function db() {
  return readJsonFile(DB_FILE, {});
}

export function setAfk(userJid, reason = "Sem motivo informado") {
  const data = db();
  data[userJid] = {
    reason: String(reason || "Sem motivo informado").trim(),
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
