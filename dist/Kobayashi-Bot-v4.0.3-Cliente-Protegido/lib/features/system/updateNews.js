/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const ROOT = process.cwd();
const NOTES_FILE = path.join(ROOT, "\x72\x65\x6c\x65\x61\x73\x65\x2d\x6e\x6f\x74\x65\x73\x2e\x6a\x73\x6f\x6e");
const PENDING_FILE = path.join(ROOT, "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x75\x70\x64\x61\x74\x65\x2d\x6e\x65\x77\x73\x2d\x70\x65\x6e\x64\x69\x6e\x67\x2e\x6a\x73\x6f\x6e");

function parseSemver(value="\x30\x2e\x30\x2e\x30") {
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
    const data = JSON.parse(fs.readFileSync(NOTES_FILE, "\x75\x74\x66\x38"));
    return data && typeof data === "\x6f\x62\x6a\x65\x63\x74" ? data : {};
  } catch {
    return {};
  }
}

function normalizeEntries(data) {
  const entries = [];

  if (data?.version) {
    entries.push({
      version:String(data.version),
      title:data.title || "\x41\x74\x75\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69",
      date:data.date || null,
      added:Array.isArray(data.added) ? data.added : [],
      changed:Array.isArray(data.changed) ? data.changed : [],
      changes:Array.isArray(data.changes) ? data.changes : [],
      commands:Array.isArray(data.commands) ? data.commands : []
    });
  }

  for (const value of Object.values(data || {})) {
    if (!value || typeof value !== "\x6f\x62\x6a\x65\x63\x74" || Array.isArray(value) || !value.version) continue;
    entries.push({
      version:String(value.version),
      title:value.title || "\x41\x74\x75\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69",
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
  if (typeof item === "\x73\x74\x72\x69\x6e\x67") {
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
    return "\ud83d\x20\x4e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x65\x69\x20\x69\x6e\x66\x6f\x72\x6d\x61\xe7\xf5\x65\x73\x20\x64\x61\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x20\x61\x74\x75\x61\x6c\x2e";
  }

  const lines = [
    "\u256d\u2501\u2501\u2501\u3014\x20\ud83d\ud83d\x20\x2a\x4e\x4f\x56\x49\x44\x41\x44\x45\x53\x20\x4b\x4f\x42\x41\x59\x41\x53\x48\x49\x2a\x20\u3015\u2501\u2501\u2501\u256e",
    `┃ 📦 Versão: *v${notes.version}*`,
    `┃ 🌸 ${notes.title || "\x41\x74\x75\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69"}`,
    ...(notes.date ? [`┃ 📅 ${notes.date}`] : []),
    "\u2570\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u256f"
  ];

  if (Array.isArray(notes.commands) && notes.commands.length) {
    lines.push("", "\ud83c\x20\x2a\x4e\x4f\x56\x4f\x53\x20\x43\x4f\x4d\x41\x4e\x44\x4f\x53\x2a");
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
    lines.push("", "\ud83d\ufe0f\x20\x2a\x41\x4c\x54\x45\x52\x41\xc7\xd5\x45\x53\x2a");
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
    }, null, 2), "\x75\x74\x66\x38");
    return true;
  } catch {
    return false;
  }
}

export function consumePendingUpdateNews() {
  try {
    if (!fs.existsSync(PENDING_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(PENDING_FILE, "\x75\x74\x66\x38"));
    fs.rmSync(PENDING_FILE, { force:true });
    return data;
  } catch {
    try { fs.rmSync(PENDING_FILE, { force:true }); } catch {}
    return null;
  }
}
