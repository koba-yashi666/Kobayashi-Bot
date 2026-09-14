/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x62\x6f\x61\x73\x2d\x76\x69\x6e\x64\x61\x73\x2e\x6a\x73\x6f\x6e");

export function readWelcomeDb() {
  return readJsonFile(DB_FILE, {});
}

export function getWelcomeConfig(groupJid) {
  const c = readWelcomeDb()[groupJid] || {};
  return {
    enabled: Boolean(c.enabled),
    delaySeconds: Number.isFinite(Number(c.delaySeconds))
      ? Math.max(3, Math.min(120, Number(c.delaySeconds)))
      : 15,
    title: c.title || "\ud83d\x20\u2500\x20\u22c6\x20\ud83c\x20\u27e8\x20\x4b\x4f\x42\x41\x59\x41\x53\x48\x49\x20\x42\x4f\x54\x20\u27e9\x20\ud83c\x20\u22c6\x20\u2500\x20\ud83d",
    welcome: c.welcome || "\ud83c\x20\ud835\ud835\ud835\ud835\ud835\x21\x20\x53\x65\x6a\x61\x6d\x20\x62\x65\x6d\x2d\x76\x69\x6e\x64\x6f\x73\x28\x61\x73\x29\x20\x61\x6f\x20\x67\x72\x75\x70\x6f\x21",
    bye: c.bye || "\ud83c\x20\x41\x74\xe9\x20\x6d\x61\x69\x73\x2c\x20\x7b\x75\x73\x65\x72\x7d\x2e\x20\x45\x73\x70\x65\x72\x61\x6d\x6f\x73\x20\x74\x65\x20\x76\x65\x72\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x20\x65\x6d\x20\x2a\x7b\x67\x72\x6f\x75\x70\x7d\x2a\x2e",
    rules: c.rules || "\ud83d\x20\x4c\x65\x69\x61\x20\x61\x73\x20\x72\x65\x67\x72\x61\x73\x20\x63\x6f\x6d\x70\x6c\x65\x74\x61\x73\x20\x6e\x61\x20\x64\x65\x73\x63\x72\x69\xe7\xe3\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e",
    partners: c.partners || "\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x61\x20\x70\x61\x72\x63\x65\x72\x69\x61\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61\x2e",
    footer: c.footer || "\ud83d\x20\x4b\x4f\x42\x41\x59\x41\x53\x48\x49\x20\x42\x4f\x54",
    showAcceptedBy: c.showAcceptedBy !== false,
    showRejected: c.showRejected !== false,
  };
}

export function updateWelcomeConfig(groupJid, patch) {
  const db = readWelcomeDb();
  db[groupJid] = { ...(db[groupJid] || {}), ...patch };
  writeJsonFile(DB_FILE, db);
  return getWelcomeConfig(groupJid);
}

export function renderWelcomeText(template, vars = {}) {
  const { userJid, groupName, count, membersText, quantity, adminJid, rejected } = vars;
  const user = userJid ? `@${String(userJid).split("@")[0]}` : "";
  const admin = adminJid ? `@${String(adminJid).split("@")[0]}` : "\x4e\xe3\x6f\x20\x69\x64\x65\x6e\x74\x69\x66\x69\x63\x61\x64\x6f";

  return String(template || "")
    .replace(/\{user\}/gi, user)
    .replace(/\{group\}/gi, groupName || "\x47\x72\x75\x70\x6f")
    .replace(/\{count\}/gi, String(count ?? "?"))
    .replace(/\{membros\}/gi, membersText || "")
    .replace(/\{quantidade\}/gi, String(quantity ?? 0))
    .replace(/\{adm\}/gi, admin)
    .replace(/\{rejeitados\}/gi, String(rejected ?? 0));
}


export function removePartnerLink(groupJid, link) {
  const target = String(link || "").trim();
  if (!target) {
    return {
      removed: false,
      partners: getWelcomeConfig(groupJid).partners,
    };
  }

  const db = readWelcomeDb();
  const current = String(
    db?.[groupJid]?.partners ||
    "\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x61\x20\x70\x61\x72\x63\x65\x72\x69\x61\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61\x2e"
  );

  // Remove a linha inteira que contém exatamente o link informado.
  // Isso preserva nome/título de outras parcerias.
  const lines = current
    .split(/\r?\n/)
    .filter((line) => !line.includes(target));

  const removed = lines.length !== current.split(/\r?\n/).length;

  const partners = lines
    .join("\n")
    .trim() || "\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x61\x20\x70\x61\x72\x63\x65\x72\x69\x61\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61\x2e";

  if (!db[groupJid]) db[groupJid] = {};
  db[groupJid].partners = partners;
  writeWelcomeDb(db);

  return {
    removed,
    partners,
  };
}



export function setWelcomePhoto(groupJid, photoPath) {
  const db = readJsonFile(DB_FILE, {});
  db[groupJid] ||= {};
  db[groupJid].welcomePhoto = String(photoPath || "").trim();
  writeJsonFile(DB_FILE, db);
  return getWelcomeConfig(groupJid);
}

export function removeWelcomePhoto(groupJid) {
  const db = readJsonFile(DB_FILE, {});
  if (db[groupJid]) {
    delete db[groupJid].welcomePhoto;
    writeJsonFile(DB_FILE, db);
  }
  return getWelcomeConfig(groupJid);
}
