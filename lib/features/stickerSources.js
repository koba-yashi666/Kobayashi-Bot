import fs from "node:fs";
import path from "node:path";

const DB_FILE = path.join(process.cwd(), "files", "database", "sticker-sources.json");
const LOCAL_DIR = path.join(process.cwd(), "files", "stickers");
const MAX_RECENT = 250;

const DEFAULT_DB = {
  mode: "auto",
  sources: [
    {
      id: "koba-main",
      name: "Kobayashi Main",
      type: "template",
      url: "https://raw.githubusercontent.com/badDevelopper/Testfigu/main/fig ({n}).webp",
      min: 0,
      max: 8050,
      enabled: true,
    },
    {
      id: "local",
      name: "Coleção local",
      type: "local",
      directory: "files/stickers",
      enabled: true,
    },
  ],
  recent: [],
};

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
  }
}

function readDb() {
  ensureDb();
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return {
      mode: parsed?.mode || "auto",
      sources: Array.isArray(parsed?.sources) && parsed.sources.length ? parsed.sources : DEFAULT_DB.sources,
      recent: Array.isArray(parsed?.recent) ? parsed.recent : [],
    };
  } catch {
    return structuredClone(DEFAULT_DB);
  }
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function slugify(value = "fonte") {
  return String(value)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `fonte-${Date.now()}`;
}

function validateRemoteUrl(raw) {
  let parsed;
  try { parsed = new URL(raw); } catch { throw new Error("URL inválida"); }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Use apenas URL http/https");
  const host = parsed.hostname.toLowerCase();
  if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(host)) throw new Error("Host local não permitido");
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) throw new Error("Rede privada não permitida");
  return parsed.toString();
}

export function listStickerSources() {
  return readDb();
}

export function setStickerSourceMode(mode = "auto") {
  const db = readDb();
  const value = String(mode || "auto").trim().toLowerCase();
  if (value !== "auto" && !db.sources.some((s) => s.id === value && s.enabled !== false)) {
    throw new Error("Fonte não encontrada ou desativada");
  }
  db.mode = value;
  writeDb(db);
  return db;
}

export function addStickerTemplateSource({ name, url, min = 0, max = 1000 }) {
  const cleanName = String(name || "Nova fonte").trim().slice(0, 40);
  const cleanUrl = validateRemoteUrl(String(url || "").trim());
  if (!cleanUrl.includes("{n}")) throw new Error("A URL precisa conter {n} onde entra o número da figurinha");
  const minNum = Number(min);
  const maxNum = Number(max);
  if (!Number.isInteger(minNum) || !Number.isInteger(maxNum) || minNum < 0 || maxNum < minNum || maxNum - minNum > 100000) {
    throw new Error("Faixa numérica inválida");
  }

  const db = readDb();
  let id = slugify(cleanName);
  if (db.sources.some((s) => s.id === id)) id = `${id}-${Date.now().toString().slice(-5)}`;
  db.sources.push({ id, name: cleanName, type: "template", url: cleanUrl, min: minNum, max: maxNum, enabled: true });
  writeDb(db);
  return db.sources.at(-1);
}

export function removeStickerSource(id) {
  const db = readDb();
  const clean = String(id || "").trim().toLowerCase();
  if (["koba-main", "local"].includes(clean)) throw new Error("Essa é uma fonte padrão e não pode ser removida");
  const before = db.sources.length;
  db.sources = db.sources.filter((s) => s.id !== clean);
  if (db.sources.length === before) throw new Error("Fonte não encontrada");
  if (db.mode === clean) db.mode = "auto";
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
  const dir = path.resolve(process.cwd(), source.directory || "files/stickers");
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
  let sources = db.mode === "auto" ? enabled : enabled.filter((s) => s.id === db.mode);
  if (!sources.length) sources = enabled;
  sources = [...sources].sort(() => Math.random() - 0.5);

  const errors = [];
  for (const source of sources) {
    try {
      if (source.type === "local") {
        const candidates = localCandidates(source, recentSet);
        if (!candidates.length) continue;
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const buffer = fs.readFileSync(chosen.fullPath);
        markRecent(db, chosen.key);
        return { buffer, source };
      }

      if (source.type === "template") {
        if (!axios) throw new Error("Cliente HTTP indisponível");
        for (let attempt = 0; attempt < 4; attempt++) {
          const { n, key } = pickNumber(source, recentSet);
          const url = String(source.url).replaceAll("{n}", String(n));
          try {
            const response = await axios.get(url, { responseType: "arraybuffer", timeout });
            const buffer = Buffer.from(response.data);
            if (buffer.length < 100) throw new Error("Arquivo vazio");
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

  throw new Error(errors.at(-1) || "Nenhuma fonte de figurinha disponível");
}
