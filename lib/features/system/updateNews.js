import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const NOTES_FILE = path.join(ROOT, "release-notes.json");
const PENDING_FILE = path.join(ROOT, "files", "database", "update-news-pending.json");

function parseSemver(value="0.0.0") {
  const match = String(value || "").match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0,0,0];
}

function compareVersions(a,b) {
  const av=parseSemver(a), bv=parseSemver(b);
  for (let i=0;i<3;i++) {
    if (av[i] !== bv[i]) return av[i] - bv[i];
  }
  return 0;
}

function readNotesFile() {
  try {
    if (!fs.existsSync(NOTES_FILE)) return {};
    const data = JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function normalizeEntries(data) {
  const entries = [];

  if (data?.version) {
    entries.push({
      version:String(data.version),
      title:data.title || "Atualização Kobayashi",
      date:data.date || null,
      added:Array.isArray(data.added) ? data.added : [],
      changed:Array.isArray(data.changed) ? data.changed : [],
      changes:Array.isArray(data.changes) ? data.changes : [],
      commands:Array.isArray(data.commands) ? data.commands : []
    });
  }

  for (const value of Object.values(data || {})) {
    if (!value || typeof value !== "object" || Array.isArray(value) || !value.version) continue;
    entries.push({
      version:String(value.version),
      title:value.title || "Atualização Kobayashi",
      date:value.date || null,
      added:Array.isArray(value.added) ? value.added : [],
      changed:Array.isArray(value.changed) ? value.changed : [],
      changes:Array.isArray(value.changes) ? value.changes : [],
      commands:Array.isArray(value.commands) ? value.commands : []
    });
  }

  const unique = new Map();
  for (const entry of entries) unique.set(entry.version, entry);
  return [...unique.values()].sort((a,b) => compareVersions(b.version, a.version));
}

export function getReleaseNotes(version=null) {
  const entries = normalizeEntries(readNotesFile());
  if (!entries.length) return null;
  if (version) {
    return entries.find(entry => compareVersions(entry.version, version) === 0) || null;
  }
  return entries[0];
}

function commandLine(item, prefix) {
  if (typeof item === "string") {
    const clean = item.replace(/^[/!+.#-]+/, "");
    return `• *${prefix}${clean}*`;
  }

  const name = String(item?.name || item?.command || "").replace(/^[/!+.#-]+/, "");
  if (!name) return null;
  const category = item?.category ? ` — ${item.category}` : "";
  const note = item?.note ? `\n  ↳ ${item.note}` : "";
  return `• *${prefix}${name}*${category}${note}`;
}

export function formatReleaseNotes(notes, { prefix="/" }={}) {
  if (!notes) {
    return "📰 Não encontrei informações da atualização atual.";
  }

  const lines = [
    "╭━━━〔 📰🐉 *NOVIDADES KOBAYASHI* 〕━━━╮",
    `┃ 📦 Versão: *v${notes.version}*`,
    `┃ 🌸 ${notes.title || "Atualização Kobayashi"}`,
    ...(notes.date ? [`┃ 📅 ${notes.date}`] : []),
    "╰━━━━━━━━━━━━━━━━━━━━╯"
  ];

  if (Array.isArray(notes.commands) && notes.commands.length) {
    lines.push("", "🌟 *NOVOS COMANDOS*");
    for (const item of notes.commands) {
      const row = commandLine(item, prefix);
      if (row) lines.push(row);
    }
  }

  const changes = [
    ...(Array.isArray(notes.changes) ? notes.changes : []),
    ...(Array.isArray(notes.added) ? notes.added : []),
    ...(Array.isArray(notes.changed) ? notes.changed : [])
  ];

  if (changes.length) {
    lines.push("", "🛠️ *ALTERAÇÕES*");
    for (const change of changes) lines.push(`• ${change}`);
  }

  lines.push("", `🔎 Use *${prefix}helpcmd comando* para saber como um comando funciona.`);
  return lines.join("\n");
}

export function markPendingUpdateNews(data={}) {
  try {
    fs.mkdirSync(path.dirname(PENDING_FILE), { recursive:true });
    fs.writeFileSync(PENDING_FILE, JSON.stringify({
      ...data,
      createdAt:Date.now()
    }, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export function consumePendingUpdateNews() {
  try {
    if (!fs.existsSync(PENDING_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"));
    fs.rmSync(PENDING_FILE, { force:true });
    return data;
  } catch {
    try { fs.rmSync(PENDING_FILE, { force:true }); } catch {}
    return null;
  }
}
