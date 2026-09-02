import path from "node:path";
import { readJsonFile, writeJsonFile } from "../../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "boas-vindas.json");

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
    title: c.title || "🐉 ─ ⋆ 🌸 ⟨ KOBAYASHI BOT ⟩ 🌸 ⋆ ─ 🐉",
    welcome: c.welcome || "🌸 𝑶𝒉𝒂𝒚𝒐! Sejam bem-vindos(as) ao grupo!",
    bye: c.bye || "🌸 Até mais, {user}. Esperamos te ver novamente em *{group}*.",
    rules: c.rules || "📖 Leia as regras completas na descrição do grupo.",
    partners: c.partners || "🌸 Nenhuma parceria configurada.",
    footer: c.footer || "🐉 KOBAYASHI BOT",
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
  const admin = adminJid ? `@${String(adminJid).split("@")[0]}` : "Não identificado";

  return String(template || "")
    .replace(/\{user\}/gi, user)
    .replace(/\{group\}/gi, groupName || "Grupo")
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
    "🌸 Nenhuma parceria configurada."
  );

  // Remove a linha inteira que contém exatamente o link informado.
  // Isso preserva nome/título de outras parcerias.
  const lines = current
    .split(/\r?\n/)
    .filter((line) => !line.includes(target));

  const removed = lines.length !== current.split(/\r?\n/).length;

  const partners = lines
    .join("\n")
    .trim() || "🌸 Nenhuma parceria configurada.";

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
