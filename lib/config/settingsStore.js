import fs from "node:fs";

const SETTINGS_FILE = new URL("../../settings/settings.json", import.meta.url);

export function readSettingsFile() {
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
}

export function writeSettingsFile(next) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2), "utf8");
}

export function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export function getConfiguredLeaders() {
  try {
    const cfg = readSettingsFile();
    return (Array.isArray(cfg.leaders) ? cfg.leaders : [])
      .map(onlyDigits)
      .filter(Boolean)
      .slice(0, 5)
      .map((n) => `${n}@s.whatsapp.net`);
  } catch { return []; }
}

export function isMainOwnerJid(jid) {
  try {
    const owner = onlyDigits(readSettingsFile().ownerNumber || "");
    return Boolean(owner) && jid === `${owner}@s.whatsapp.net`;
  } catch { return false; }
}

export function isLeaderJid(jid) {
  return getConfiguredLeaders().includes(jid);
}
