/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { createHash, randomUUID } from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x74\x69\x63\x6b\x65\x72\x2d\x70\x61\x63\x6b\x73\x2e\x6a\x73\x6f\x6e");
const PACK_DIR = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x73\x74\x69\x63\x6b\x65\x72\x2d\x70\x61\x63\x6b\x73");

function ensureStorage() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.mkdirSync(PACK_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ packs: {}, captures: {}, lastPackByChat: {} }, null, 2));
  }
}

function readDb() {
  ensureStorage();
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "\x75\x74\x66\x38"));
    return {
      packs: parsed?.packs && typeof parsed.packs === "\x6f\x62\x6a\x65\x63\x74" ? parsed.packs : {},
      captures: parsed?.captures && typeof parsed.captures === "\x6f\x62\x6a\x65\x63\x74" ? parsed.captures : {},
      lastPackByChat: parsed?.lastPackByChat && typeof parsed.lastPackByChat === "\x6f\x62\x6a\x65\x63\x74" ? parsed.lastPackByChat : {},
    };
  } catch {
    return { packs: {}, captures: {}, lastPackByChat: {} };
  }
}

function writeDb(db) {
  ensureStorage();
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

export function cleanPackName(input = "") {
  let value = String(input || "").trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim();
  }
  return value.replace(/\s+/g, " ").slice(0, 80);
}

function normalizeName(input = "") {
  return cleanPackName(input)
    .normalize("\x4e\x46\x44")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function safeDirName(input = "") {
  const base = normalizeName(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "\x70\x61\x63\x6b";
  return base;
}

function findPackEntry(db, nameOrId) {
  const wanted = normalizeName(nameOrId);
  if (!wanted) return null;
  for (const [id, pack] of Object.entries(db.packs || {})) {
    if (id === nameOrId || normalizeName(pack?.name) === wanted) return [id, pack];
  }
  return null;
}

export function createStickerPack(name, { chatJid = "", creatorJid = "" } = {}) {
  const cleanName = cleanPackName(name);
  if (!cleanName) throw new Error("\x4e\x6f\x6d\x65\x20\x64\x6f\x20\x70\x61\x63\x6f\x74\x65\x20\x76\x61\x7a\x69\x6f");

  const db = readDb();
  const existing = findPackEntry(db, cleanName);
  if (existing) {
    const [id, pack] = existing;
    db.lastPackByChat[chatJid] = id;
    writeDb(db);
    return { id, ...pack, existed: true };
  }

  const id = `koba-${safeDirName(cleanName)}-${randomUUID().slice(0, 8)}`;
  const dir = path.join(PACK_DIR, id);
  fs.mkdirSync(dir, { recursive: true });

  const pack = {
    name: cleanName,
    creatorJid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stickers: [],
  };
  db.packs[id] = pack;
  if (chatJid) db.lastPackByChat[chatJid] = id;
  writeDb(db);
  return { id, ...pack, existed: false };
}

export function startPackCapture(chatJid, packNameOrId, startedBy = "") {
  const db = readDb();
  let entry = findPackEntry(db, packNameOrId);
  if (!entry && db.lastPackByChat?.[chatJid]) {
    const id = db.lastPackByChat[chatJid];
    if (db.packs[id]) entry = [id, db.packs[id]];
  }
  if (!entry) return null;

  const [id, pack] = entry;
  db.captures[chatJid] = { packId: id, startedBy, startedAt: new Date().toISOString() };
  db.lastPackByChat[chatJid] = id;
  writeDb(db);
  return { id, ...pack };
}

export function stopPackCapture(chatJid) {
  const db = readDb();
  const capture = db.captures?.[chatJid] || null;
  let pack = null;
  if (capture?.packId && db.packs[capture.packId]) {
    pack = { id: capture.packId, ...db.packs[capture.packId] };
  }
  delete db.captures[chatJid];
  writeDb(db);
  return pack;
}

export function getPackCapture(chatJid) {
  const db = readDb();
  const capture = db.captures?.[chatJid];
  if (!capture?.packId || !db.packs[capture.packId]) return null;
  return { ...capture, id: capture.packId, ...db.packs[capture.packId] };
}

export function addStickerToActivePack(chatJid, buffer, meta = {}) {
  if (!Buffer.isBuffer(buffer) || !buffer.length) return null;
  const db = readDb();
  const capture = db.captures?.[chatJid];
  if (!capture?.packId || !db.packs[capture.packId]) return null;

  const pack = db.packs[capture.packId];
  const digest = createHash("\x73\x68\x61\x32\x35\x36").update(buffer).digest("\x68\x65\x78");
  const duplicate = (pack.stickers || []).find((s) => s.sha256 === digest);
  if (duplicate) {
    return { duplicate: true, count: pack.stickers.length, pack: { id: capture.packId, ...pack } };
  }

  const fileName = `${String((pack.stickers?.length || 0) + 1).padStart(4, "0")}-${digest.slice(0, 12)}.webp`;
  const packPath = path.join(PACK_DIR, capture.packId);
  fs.mkdirSync(packPath, { recursive: true });
  fs.writeFileSync(path.join(packPath, fileName), buffer);

  pack.stickers = Array.isArray(pack.stickers) ? pack.stickers : [];
  pack.stickers.push({
    file: fileName,
    sha256: digest,
    senderJid: meta.senderJid || "",
    addedAt: new Date().toISOString(),
  });
  pack.updatedAt = new Date().toISOString();
  db.lastPackByChat[chatJid] = capture.packId;
  writeDb(db);

  return { duplicate: false, count: pack.stickers.length, pack: { id: capture.packId, ...pack } };
}

export function getStickerPack(nameOrId) {
  const db = readDb();
  const entry = findPackEntry(db, nameOrId);
  if (!entry) return null;
  const [id, pack] = entry;
  return { id, ...pack };
}

export function listStickerPacks() {
  const db = readDb();
  return Object.entries(db.packs || {})
    .map(([id, pack]) => ({ id, ...pack, count: Array.isArray(pack.stickers) ? pack.stickers.length : 0 }))
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "\x70\x74\x2d\x42\x52"));
}

export function getStickerPackBuffers(nameOrId) {
  const pack = getStickerPack(nameOrId);
  if (!pack) return null;
  const dir = path.join(PACK_DIR, pack.id);
  const stickers = (pack.stickers || []).map((item, index) => {
    const filePath = path.join(dir, item.file);
    if (!fs.existsSync(filePath)) return null;
    return { index: index + 1, ...item, buffer: fs.readFileSync(filePath) };
  }).filter(Boolean);
  return { ...pack, stickers };
}
