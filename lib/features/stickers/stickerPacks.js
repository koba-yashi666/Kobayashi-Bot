import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";

const DB_FILE = path.join(process.cwd(), "files", "database", "sticker-packs.json");
const PACK_DIR = path.join(process.cwd(), "files", "sticker-packs");

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
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return {
      packs: parsed?.packs && typeof parsed.packs === "object" ? parsed.packs : {},
      captures: parsed?.captures && typeof parsed.captures === "object" ? parsed.captures : {},
      lastPackByChat: parsed?.lastPackByChat && typeof parsed.lastPackByChat === "object" ? parsed.lastPackByChat : {},
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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function safeDirName(input = "") {
  const base = normalizeName(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "pack";
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
  if (!cleanName) throw new Error("Nome do pacote vazio");

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
  const digest = createHash("sha256").update(buffer).digest("hex");
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
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
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
