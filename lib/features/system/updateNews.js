import fs from "node:fs";
import path from "node:path";

const RELEASE_FILE = path.join(process.cwd(), "release-notes.json");
const STATE_FILE = path.join(process.cwd(), "files", "database", "update-news-state.json");

function readJson(file, fallback = {}) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

export function getReleaseNotes() {
  return readJson(RELEASE_FILE, {
    version: "desconhecida",
    title: "Atualização Kobayashi",
    added: [],
    menus: [],
    changed: [],
    fixed: [],
    notes: [],
    summary: ""
  });
}

function section(title, items = []) {
  const clean = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!clean.length) return "";
  return `\n${title}\n${clean.map((x) => `• ${x}`).join("\n")}\n`;
}

export function formatReleaseNotes(notes = getReleaseNotes(), { prefix = "/" } = {}) {
  const n = notes || {};
  let out =
    `📦 *${n.title || "NOVA ATUALIZAÇÃO"}*\n` +
    `🏷️ Versão: *${n.version || "—"}*\n`;

  out += section("✨ *O QUE FOI ADICIONADO*", n.added);
  out += section("📚 *MENUS ATUALIZADOS*", n.menus);
  out += section("🔧 *MELHORIAS*", n.changed);
  out += section("🩹 *CORREÇÕES*", n.fixed);
  out += section("📌 *OBSERVAÇÕES*", n.notes);

  if (n.summary) {
    out += `\n🐉 *RESUMO DA ATUALIZAÇÃO*\n${n.summary}\n`;
  }

  out += `\n💡 Use *${prefix}novidades* para consultar novamente.`;
  return out.trim();
}

export function markPendingUpdateNews(data = {}) {
  const state = readJson(STATE_FILE, {});
  state.pending = {
    targetJid: data.targetJid || "",
    fromVersion: data.fromVersion || "",
    toVersion: data.toVersion || "",
    requestedBy: data.requestedBy || "",
    createdAt: Date.now()
  };
  writeJson(STATE_FILE, state);
  return state.pending;
}

export function consumePendingUpdateNews() {
  const state = readJson(STATE_FILE, {});
  const pending = state.pending;
  if (!pending?.targetJid) return null;

  // Uma versão só é anunciada uma vez.
  const key = `${pending.targetJid}:${pending.toVersion}`;
  if (state.lastAnnouncementKey === key) {
    delete state.pending;
    writeJson(STATE_FILE, state);
    return null;
  }

  state.lastAnnouncementKey = key;
  state.lastAnnouncedAt = Date.now();
  delete state.pending;
  writeJson(STATE_FILE, state);
  return pending;
}
