/* Kobayashi Protected Distribution v4.0.3 */
import fs from "fs";
import path from "\x70\x61\x74\x68";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x62\x61\x6e\x2d\x6d\x73\x67\x2e\x6a\x73\x6f\x6e");

function readDb() {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    if (!fs.existsSync(DB_FILE)) {
      return { enabled: true, phrases: [] };
    }
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "\x75\x74\x66\x38"));
    return {
      enabled: parsed?.enabled !== false,
      phrases: Array.isArray(parsed?.phrases) ? parsed.phrases : []
    };
  } catch {
    return { enabled: true, phrases: [] };
  }
}

function writeDb(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, DB_FILE);
}

function normalizeText(value = "") {
  return String(value)
    .normalize("\x4e\x46\x4b\x43")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function cleanQuotedText(value = "") {
  let text = String(value || "").trim();
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim();
  }
  return text;
}

function makeId() {
  return `bm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getBanMessageConfig() {
  return readDb();
}

export function setBanMessageEnabled(enabled) {
  const db = readDb();
  db.enabled = Boolean(enabled);
  writeDb(db);
  return db.enabled;
}

export function listBanMessages() {
  return readDb().phrases;
}

export function addBanMessage(text, by = null) {
  const clean = cleanQuotedText(text);
  const normalized = normalizeText(clean);

  if (!normalized) return { ok: false, reason: "\x65\x6d\x70\x74\x79" };

  const db = readDb();
  const existing = db.phrases.find((entry) => entry.normalized === normalized);
  if (existing) return { ok: false, reason: "\x65\x78\x69\x73\x74\x73", entry: existing };

  const entry = {
    id: makeId(),
    text: clean,
    normalized,
    by,
    createdAt: Date.now()
  };
  db.phrases.push(entry);
  writeDb(db);
  return { ok: true, entry };
}

export function removeBanMessage(query = "") {
  const value = cleanQuotedText(query);
  const normalized = normalizeText(value);
  const db = readDb();

  let index = db.phrases.findIndex((entry) => entry.id === value);
  if (index < 0 && /^\d+$/.test(value)) {
    const pos = Number(value) - 1;
    if (pos >= 0 && pos < db.phrases.length) index = pos;
  }
  if (index < 0 && normalized) {
    index = db.phrases.findIndex((entry) => entry.normalized === normalized);
  }
  if (index < 0) return { ok: false };

  const [entry] = db.phrases.splice(index, 1);
  writeDb(db);
  return { ok: true, entry };
}

export function matchBanMessage(text = "") {
  const db = readDb();
  if (!db.enabled || !db.phrases.length) return null;

  const normalized = normalizeText(text);
  if (!normalized) return null;

  // A frase registrada pode estar sozinha ou dentro de uma mensagem maior.
  // Preferimos a maior frase para evitar colisões entre regras semelhantes.
  const matches = db.phrases
    .filter((entry) => normalized.includes(entry.normalized))
    .sort((a, b) => b.normalized.length - a.normalized.length);

  return matches[0] || null;
}
