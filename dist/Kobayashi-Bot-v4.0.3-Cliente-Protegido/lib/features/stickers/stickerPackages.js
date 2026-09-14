/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import crypto from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";

const ROOT = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x74\x69\x63\x6b\x65\x72\x2d\x70\x61\x63\x6b\x61\x67\x65\x73");
const DB_FILE = path.join(ROOT, "\x70\x61\x63\x6b\x61\x67\x65\x73\x2e\x6a\x73\x6f\x6e");
const CAPTURE_ROOT = path.join(ROOT, "\x5f\x63\x61\x70\x74\x75\x72\x65\x73");
const PACKAGE_ROOT = path.join(ROOT, "\x70\x61\x63\x6b\x73");
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
    }, null, 2), "\x75\x74\x66\x38");
  }
}

function readDb() {
  ensureDirs();
  try {
    const db = JSON.parse(fs.readFileSync(DB_FILE, "\x75\x74\x66\x38"));
    return {
      packages: db?.packages && typeof db.packages === "\x6f\x62\x6a\x65\x63\x74" ? db.packages : {},
      captures: db?.captures && typeof db.captures === "\x6f\x62\x6a\x65\x63\x74" ? db.captures : {},
      cursors: db?.cursors && typeof db.cursors === "\x6f\x62\x6a\x65\x63\x74" ? db.cursors : {}
    };
  } catch {
    return { packages: {}, captures: {}, cursors: {} };
  }
}

function writeDb(db) {
  ensureDirs();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
}

function safeKey(value="") {
  return String(value || "")
    .normalize("\x4e\x46\x44")
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
  const id = crypto.createHash("\x73\x68\x61\x31").update(String(chatJid || "")).digest("\x68\x65\x78").slice(0, 16);
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
  if (!row) return { ok:false, reason:"\x6e\x6f\x74\x2d\x73\x74\x61\x72\x74\x65\x64", count:0 };
  if (!force && row.owner && row.owner !== ownerJid) {
    return { ok:false, reason:"\x6e\x6f\x74\x2d\x6f\x77\x6e\x65\x72", count:(row.files || []).length };
  }
  row.active = false;
  row.stoppedAt = Date.now();
  db.captures[key] = row;
  writeDb(db);
  return { ok:true, count:(row.files || []).length };
}

export function captureStickerIfActive(chatJid, stickerBuffer) {
  if (!Buffer.isBuffer(stickerBuffer) || !stickerBuffer.length) {
    return { captured:false, reason:"\x69\x6e\x76\x61\x6c\x69\x64\x2d\x62\x75\x66\x66\x65\x72" };
  }

  const db = readDb();
  const key = captureKey(chatJid);
  const row = db.captures[key];
  if (!row?.active) return { captured:false, reason:"\x69\x6e\x61\x63\x74\x69\x76\x65" };

  const files = Array.isArray(row.files) ? row.files : [];
  if (files.length >= MAX_CAPTURE) {
    row.active = false;
    row.stoppedAt = Date.now();
    db.captures[key] = row;
    writeDb(db);
    return { captured:false, reason:"\x6c\x69\x6d\x69\x74", count:files.length };
  }

  const dir = captureDir(chatJid);
  fs.mkdirSync(dir, { recursive:true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("\x68\x65\x78")}.webp`;
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
  if (!name || !key) return { ok:false, reason:"\x69\x6e\x76\x61\x6c\x69\x64\x2d\x6e\x61\x6d\x65" };

  const db = readDb();
  const capKey = captureKey(chatJid);
  const capture = db.captures[capKey];

  if (!capture) return { ok:false, reason:"\x6e\x6f\x2d\x63\x61\x70\x74\x75\x72\x65" };
  if (capture.owner && capture.owner !== ownerJid) {
    return { ok:false, reason:"\x6e\x6f\x74\x2d\x6f\x77\x6e\x65\x72" };
  }

  const sourceDir = captureDir(chatJid);
  const sourceFiles = existingFiles(sourceDir, capture.files || []);
  if (!sourceFiles.length) return { ok:false, reason:"\x65\x6d\x70\x74\x79" };

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
    .sort((a,b) => String(a.name).localeCompare(String(b.name), "\x70\x74\x2d\x42\x52"));
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
