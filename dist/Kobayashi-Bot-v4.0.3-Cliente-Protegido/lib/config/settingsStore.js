/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";

const SETTINGS_FILE = new URL("\x2e\x2e\x2f\x2e\x2e\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2e\x6a\x73\x6f\x6e", import.meta.url);

export function readSettingsFile() {
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, "\x75\x74\x66\x38"));
}

export function writeSettingsFile(next) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2), "\x75\x74\x66\x38");
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
