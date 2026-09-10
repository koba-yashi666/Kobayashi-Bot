import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.join(process.cwd(), "files", "database", "sticker-packages");
const DB_FILE = path.join(ROOT, "packages.json");
const CAPTURE_ROOT = path.join(ROOT, "_captures");
const PACKAGE_ROOT = path.join(ROOT, "packs");
const MAX_CAPTURE = 250;

function ensureDirs() {
  fs.mkdirSync(ROOT, { recursive: true });
  fs.mkdirSync(CAPTURE_ROOT, { recursive: true });
  fs.mkdirSync(PACKAGE_ROOT, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      packages: {},
      captures: {},
      cursors: {}
    }, null, 2), "utf8");
  }
}

function readDb() {
  ensureDirs();
  try {
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return {
      packages: db?.packages && typeof db.packages === "object" ? db.packages : {},
      captures: db?.captures && typeof db.captures === "object" ? db.captures : {},
      cursors: db?.cursors && typeof db.cursors === "object" ? db.cursors : {}
    };
  } catch {
    return { packages: {}, captures: {}, cursors: {} };
  }
}

function writeDb(db) {
  ensureDirs();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function safeKey(value="") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cleanName(value="") {
  return String(value || "")
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .trim()
    .slice(0, 80);
}

function captureKey(chatJid) {
  return String(chatJid || "");
}

function captureDir(chatJid) {
  const id = crypto.createHash("sha1").update(String(chatJid || "")).digest("hex").slice(0, 16);
  return path.join(CAPTURE_ROOT, id);
}

function packageDir(key) {
  return path.join(PACKAGE_ROOT, key);
}

function existingFiles(dir, names=[]) {
  return names
    .map(name => path.join(dir, name))
    .filter(file => fs.existsSync(file));
}

export function getPackageCaptureStatus(chatJid) {
  const db = readDb();
  const row = db.captures[captureKey(chatJid)];
  if (!row) return { active:false, count:0, owner:null };
  const dir = captureDir(chatJid);
  const count = existingFiles(dir, row.files || []).length;
  return {
    active: Boolean(row.active),
    count,
    owner: row.owner || null,
    startedAt: row.startedAt || null
  };
}

export function startPackageCapture(chatJid, ownerJid) {
  const db = readDb();
  const key = captureKey(chatJid);
  const dir = captureDir(chatJid);

  fs.rmSync(dir, { recursive:true, force:true });
  fs.mkdirSync(dir, { recursive:true });

  db.captures[key] = {
    active:true,
    owner:String(ownerJid || ""),
    startedAt:Date.now(),
    files:[]
  };
  writeDb(db);
  return { active:true, count:0 };
}

export function stopPackageCapture(chatJid, ownerJid, force=false) {
  const db = readDb();
  const key = captureKey(chatJid);
  const row = db.captures[key];
  if (!row) return { ok:false, reason:"not-started", count:0 };
  if (!force && row.owner && row.owner !== ownerJid) {
    return { ok:false, reason:"not-owner", count:(row.files || []).length };
  }
  row.active = false;
  row.stoppedAt = Date.now();
  db.captures[key] = row;
  writeDb(db);
  return { ok:true, count:(row.files || []).length };
}

export function captureStickerIfActive(chatJid, stickerBuffer) {
  if (!Buffer.isBuffer(stickerBuffer) || !stickerBuffer.length) {
    return { captured:false, reason:"invalid-buffer" };
  }

  const db = readDb();
  const key = captureKey(chatJid);
  const row = db.captures[key];
  if (!row?.active) return { captured:false, reason:"inactive" };

  const files = Array.isArray(row.files) ? row.files : [];
  if (files.length >= MAX_CAPTURE) {
    row.active = false;
    row.stoppedAt = Date.now();
    db.captures[key] = row;
    writeDb(db);
    return { captured:false, reason:"limit", count:files.length };
  }

  const dir = captureDir(chatJid);
  fs.mkdirSync(dir, { recursive:true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.webp`;
  fs.writeFileSync(path.join(dir, name), stickerBuffer);

  files.push(name);
  row.files = files;
  db.captures[key] = row;
  writeDb(db);

  return { captured:true, count:files.length };
}

export function saveCapturedPackage(chatJid, ownerJid, rawName) {
  const name = cleanName(rawName);
  const key = safeKey(name);
  if (!name || !key) return { ok:false, reason:"invalid-name" };

  const db = readDb();
  const capKey = captureKey(chatJid);
  const capture = db.captures[capKey];

  if (!capture) return { ok:false, reason:"no-capture" };
  if (capture.owner && capture.owner !== ownerJid) {
    return { ok:false, reason:"not-owner" };
  }

  const sourceDir = captureDir(chatJid);
  const sourceFiles = existingFiles(sourceDir, capture.files || []);
  if (!sourceFiles.length) return { ok:false, reason:"empty" };

  const destDir = packageDir(key);
  fs.rmSync(destDir, { recursive:true, force:true });
  fs.mkdirSync(destDir, { recursive:true });

  const saved = [];
  sourceFiles.forEach((source, index) => {
    const filename = `${String(index + 1).padStart(3, "0")}.webp`;
    fs.copyFileSync(source, path.join(destDir, filename));
    saved.push(filename);
  });

  const replaced = Boolean(db.packages[key]);
  db.packages[key] = {
    key,
    name,
    files:saved,
    count:saved.length,
    createdBy:String(ownerJid || ""),
    createdAt:Date.now(),
    sourceChat:String(chatJid || "")
  };

  delete db.captures[capKey];

  // limpa cursores antigos desse pacote
  for (const cursorKey of Object.keys(db.cursors || {})) {
    if (cursorKey.endsWith(`::${key}`)) delete db.cursors[cursorKey];
  }

  writeDb(db);
  fs.rmSync(sourceDir, { recursive:true, force:true });

  return { ok:true, replaced, name, key, count:saved.length };
}

export function getStickerPackage(rawName) {
  const db = readDb();
  const key = safeKey(rawName);
  const row = db.packages[key];
  if (!row) return null;

  const dir = packageDir(key);
  const files = existingFiles(dir, row.files || []);
  if (!files.length) return null;

  return {
    ...row,
    files,
    count:files.length
  };
}

export function listStickerPackages() {
  const db = readDb();
  return Object.values(db.packages || {})
    .map(row => {
      const dir = packageDir(row.key);
      const count = existingFiles(dir, row.files || []).length;
      return { ...row, count };
    })
    .filter(row => row.count > 0)
    .sort((a,b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
}

export function deleteStickerPackage(rawName) {
  const db = readDb();
  const key = safeKey(rawName);
  const row = db.packages[key];
  if (!row) return false;

  delete db.packages[key];
  for (const cursorKey of Object.keys(db.cursors || {})) {
    if (cursorKey.endsWith(`::${key}`)) delete db.cursors[cursorKey];
  }
  writeDb(db);
  fs.rmSync(packageDir(key), { recursive:true, force:true });
  return true;
}

export function getNextStickerFromPackage(rawName, chatJid, userJid) {
  const pkg = getStickerPackage(rawName);
  if (!pkg) return null;

  const db = readDb();
  const cursorKey = `${chatJid}::${userJid}::${pkg.key}`;
  const current = Number(db.cursors[cursorKey] || 0);
  const index = Number.isInteger(current) && current >= 0 ? current % pkg.files.length : 0;
  const file = pkg.files[index];

  db.cursors[cursorKey] = (index + 1) % pkg.files.length;
  writeDb(db);

  return {
    packageName:pkg.name,
    index,
    total:pkg.files.length,
    buffer:fs.readFileSync(file)
  };
}
