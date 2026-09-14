/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x74\x69\x63\x6b\x65\x72\x2d\x73\x6f\x75\x72\x63\x65\x73\x2e\x6a\x73\x6f\x6e");
const LOCAL_DIR = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x73\x74\x69\x63\x6b\x65\x72\x73");
const MAX_RECENT = 250;

const DEFAULT_DB = {
  mode: "\x61\x75\x74\x6f",
  sources: [
    {
      id: "\x6b\x6f\x62\x61\x2d\x6d\x61\x69\x6e",
      name: "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x4d\x61\x69\x6e",
      type: "\x74\x65\x6d\x70\x6c\x61\x74\x65",
      url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x72\x61\x77\x2e\x67\x69\x74\x68\x75\x62\x75\x73\x65\x72\x63\x6f\x6e\x74\x65\x6e\x74\x2e\x63\x6f\x6d\x2f\x62\x61\x64\x44\x65\x76\x65\x6c\x6f\x70\x70\x65\x72\x2f\x54\x65\x73\x74\x66\x69\x67\x75\x2f\x6d\x61\x69\x6e\x2f\x66\x69\x67\x20\x28\x7b\x6e\x7d\x29\x2e\x77\x65\x62\x70",
      min: 0,
      max: 8050,
      enabled: true,
    },
    {
      id: "\x6c\x6f\x63\x61\x6c",
      name: "\x43\x6f\x6c\x65\xe7\xe3\x6f\x20\x6c\x6f\x63\x61\x6c",
      type: "\x6c\x6f\x63\x61\x6c",
      directory: "\x66\x69\x6c\x65\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x73",
      enabled: true,
    },
  ],
  recent: [],
};

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "\x75\x74\x66\x38");
  }
}

function readDb() {
  ensureDb();
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "\x75\x74\x66\x38"));
    return {
      mode: parsed?.mode || "\x61\x75\x74\x6f",
      sources: Array.isArray(parsed?.sources) && parsed.sources.length ? parsed.sources : DEFAULT_DB.sources,
      recent: Array.isArray(parsed?.recent) ? parsed.recent : [],
    };
  } catch {
    return structuredClone(DEFAULT_DB);
  }
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
}

function slugify(value = "\x66\x6f\x6e\x74\x65") {
  return String(value)
    .normalize("\x4e\x46\x44").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `fonte-${Date.now()}`;
}

function validateRemoteUrl(raw) {
  let parsed;
  try { parsed = new URL(raw); } catch { throw new Error("\x55\x52\x4c\x20\x69\x6e\x76\xe1\x6c\x69\x64\x61"); }
  if (!["\x68\x74\x74\x70\x3a", "\x68\x74\x74\x70\x73\x3a"].includes(parsed.protocol)) throw new Error("\x55\x73\x65\x20\x61\x70\x65\x6e\x61\x73\x20\x55\x52\x4c\x20\x68\x74\x74\x70\x2f\x68\x74\x74\x70\x73");
  const host = parsed.hostname.toLowerCase();
  if (["\x6c\x6f\x63\x61\x6c\x68\x6f\x73\x74", "\x31\x32\x37\x2e\x30\x2e\x30\x2e\x31", "\x30\x2e\x30\x2e\x30\x2e\x30", "\x3a\x3a\x31"].includes(host)) throw new Error("\x48\x6f\x73\x74\x20\x6c\x6f\x63\x61\x6c\x20\x6e\xe3\x6f\x20\x70\x65\x72\x6d\x69\x74\x69\x64\x6f");
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) throw new Error("\x52\x65\x64\x65\x20\x70\x72\x69\x76\x61\x64\x61\x20\x6e\xe3\x6f\x20\x70\x65\x72\x6d\x69\x74\x69\x64\x61");
  return parsed.toString();
}

export function listStickerSources() {
  return readDb();
}

export function setStickerSourceMode(mode = "\x61\x75\x74\x6f") {
  const db = readDb();
  const value = String(mode || "\x61\x75\x74\x6f").trim().toLowerCase();
  if (value !== "\x61\x75\x74\x6f" && !db.sources.some((s) => s.id === value && s.enabled !== false)) {
    throw new Error("\x46\x6f\x6e\x74\x65\x20\x6e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x61\x20\x6f\x75\x20\x64\x65\x73\x61\x74\x69\x76\x61\x64\x61");
  }
  db.mode = value;
  writeDb(db);
  return db;
}

export function addStickerTemplateSource({ name, url, min = 0, max = 1000 }) {
  const cleanName = String(name || "\x4e\x6f\x76\x61\x20\x66\x6f\x6e\x74\x65").trim().slice(0, 40);
  const cleanUrl = validateRemoteUrl(String(url || "").trim());
  if (!cleanUrl.includes("\x7b\x6e\x7d")) throw new Error("\x41\x20\x55\x52\x4c\x20\x70\x72\x65\x63\x69\x73\x61\x20\x63\x6f\x6e\x74\x65\x72\x20\x7b\x6e\x7d\x20\x6f\x6e\x64\x65\x20\x65\x6e\x74\x72\x61\x20\x6f\x20\x6e\xfa\x6d\x65\x72\x6f\x20\x64\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61");
  const minNum = Number(min);
  const maxNum = Number(max);
  if (!Number.isInteger(minNum) || !Number.isInteger(maxNum) || minNum < 0 || maxNum < minNum || maxNum - minNum > 100000) {
    throw new Error("\x46\x61\x69\x78\x61\x20\x6e\x75\x6d\xe9\x72\x69\x63\x61\x20\x69\x6e\x76\xe1\x6c\x69\x64\x61");
  }

  const db = readDb();
  let id = slugify(cleanName);
  if (db.sources.some((s) => s.id === id)) id = `${id}-${Date.now().toString().slice(-5)}`;
  db.sources.push({ id, name: cleanName, type: "\x74\x65\x6d\x70\x6c\x61\x74\x65", url: cleanUrl, min: minNum, max: maxNum, enabled: true });
  writeDb(db);
  return db.sources.at(-1);
}

export function removeStickerSource(id) {
  const db = readDb();
  const clean = String(id || "").trim().toLowerCase();
  if (["\x6b\x6f\x62\x61\x2d\x6d\x61\x69\x6e", "\x6c\x6f\x63\x61\x6c"].includes(clean)) throw new Error("\x45\x73\x73\x61\x20\xe9\x20\x75\x6d\x61\x20\x66\x6f\x6e\x74\x65\x20\x70\x61\x64\x72\xe3\x6f\x20\x65\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x20\x73\x65\x72\x20\x72\x65\x6d\x6f\x76\x69\x64\x61");
  const before = db.sources.length;
  db.sources = db.sources.filter((s) => s.id !== clean);
  if (db.sources.length === before) throw new Error("\x46\x6f\x6e\x74\x65\x20\x6e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x61");
  if (db.mode === clean) db.mode = "\x61\x75\x74\x6f";
  writeDb(db);
  return db;
}

function pickNumber(source, recentSet) {
  const min = Number(source.min ?? 0);
  const max = Number(source.max ?? min);
  for (let tries = 0; tries < 40; tries++) {
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    const key = `${source.id}:${n}`;
    if (!recentSet.has(key)) return { n, key };
  }
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  return { n, key: `${source.id}:${n}` };
}

function localCandidates(source, recentSet) {
  const dir = path.resolve(process.cwd(), source.directory || "\x66\x69\x6c\x65\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x73");
  if (!dir.startsWith(process.cwd())) return [];
  try {
    return fs.readdirSync(dir)
      .filter((f) => /\.(webp|png|jpe?g)$/i.test(f))
      .map((f) => ({ file: f, fullPath: path.join(dir, f), key: `${source.id}:${f}` }))
      .filter((x) => !recentSet.has(x.key));
  } catch {
    return [];
  }
}

function markRecent(db, key) {
  db.recent = [key, ...db.recent.filter((x) => x !== key)].slice(0, MAX_RECENT);
  writeDb(db);
}

export async function getRandomStickerBuffer({ axios, timeout = 25000 } = {}) {
  const db = readDb();
  const recentSet = new Set(db.recent);
  const enabled = db.sources.filter((s) => s.enabled !== false);
  let sources = db.mode === "\x61\x75\x74\x6f" ? enabled : enabled.filter((s) => s.id === db.mode);
  if (!sources.length) sources = enabled;
  sources = [...sources].sort(() => Math.random() - 0.5);

  const errors = [];
  for (const source of sources) {
    try {
      if (source.type === "\x6c\x6f\x63\x61\x6c") {
        const candidates = localCandidates(source, recentSet);
        if (!candidates.length) continue;
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const buffer = fs.readFileSync(chosen.fullPath);
        markRecent(db, chosen.key);
        return { buffer, source };
      }

      if (source.type === "\x74\x65\x6d\x70\x6c\x61\x74\x65") {
        if (!axios) throw new Error("\x43\x6c\x69\x65\x6e\x74\x65\x20\x48\x54\x54\x50\x20\x69\x6e\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c");
        for (let attempt = 0; attempt < 4; attempt++) {
          const { n, key } = pickNumber(source, recentSet);
          const url = String(source.url).replaceAll("\x7b\x6e\x7d", String(n));
          try {
            const response = await axios.get(url, { responseType: "\x61\x72\x72\x61\x79\x62\x75\x66\x66\x65\x72", timeout });
            const buffer = Buffer.from(response.data);
            if (buffer.length < 100) throw new Error("\x41\x72\x71\x75\x69\x76\x6f\x20\x76\x61\x7a\x69\x6f");
            markRecent(db, key);
            return { buffer, source, url };
          } catch (e) {
            errors.push(`${source.id}: ${e?.message || e}`);
          }
        }
      }
    } catch (e) {
      errors.push(`${source.id}: ${e?.message || e}`);
    }
  }

  throw new Error(errors.at(-1) || "\x4e\x65\x6e\x68\x75\x6d\x61\x20\x66\x6f\x6e\x74\x65\x20\x64\x65\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c");
}
