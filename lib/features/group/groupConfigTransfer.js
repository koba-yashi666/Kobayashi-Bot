import fs from "fs";
import path from "path";

const DATABASE_DIR = path.join(process.cwd(), "files", "database");
const BACKUP_PREFIX = "KCFG1.";
const MAX_DATABASE_FILE_BYTES = 2 * 1024 * 1024;

// Bancos que claramente não são configuração de grupo.
const DENY_FILE = /(log|message|mensagem|level|nivel|xp|coin|econom|rank|inventory|inventario|shop|loja|warn|adv|rental|aluguel|profile|perfil|stat|cache|session|auth)/i;

// Prioriza bancos com nomes típicos de configuração/proteção.
const ALLOW_FILE = /(config|setting|group|grupo|welcome|bem.?vind|schedule|agend|whitelist|lista.?branca|protection|protec|antilink|telegram|autosticker|sticker|funmode|brincadeira|antipv|prefix)/i;

function ensureDatabaseDir() {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function listJsonFiles(dir = DATABASE_DIR, base = DATABASE_DIR) {
  if (!fs.existsSync(dir)) return [];

  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listJsonFiles(full, base));
      continue;
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".json")) continue;

    const relative = path.relative(base, full).replace(/\\/g, "/");
    if (DENY_FILE.test(relative)) continue;
    if (!ALLOW_FILE.test(relative)) continue;

    try {
      const size = fs.statSync(full).size;
      if (size <= MAX_DATABASE_FILE_BYTES) out.push({ full, relative });
    } catch {}
  }
  return out;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writeJsonAtomic(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

// Procura chaves exatamente iguais ao JID do grupo em qualquer nível do JSON.
function collectGroupEntries(node, groupJid, pathParts = [], entries = []) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) {
      collectGroupEntries(node[i], groupJid, [...pathParts, i], entries);
    }
    return entries;
  }

  if (!isPlainObject(node)) return entries;

  for (const [key, value] of Object.entries(node)) {
    if (key === groupJid) {
      entries.push({ path: pathParts, value: clone(value) });
      continue;
    }
    collectGroupEntries(value, groupJid, [...pathParts, key], entries);
  }

  return entries;
}

function pathExists(root, pathParts) {
  let cursor = root;
  for (const part of pathParts) {
    if (cursor == null || typeof cursor !== "object" || !(part in cursor)) return false;
    cursor = cursor[part];
  }
  return true;
}

function getAtPath(root, pathParts) {
  let cursor = root;
  for (const part of pathParts) cursor = cursor[part];
  return cursor;
}

function ensureContainerPath(root, pathParts) {
  let cursor = root;
  for (let i = 0; i < pathParts.length; i += 1) {
    const part = pathParts[i];
    const next = pathParts[i + 1];

    if (cursor[part] == null || typeof cursor[part] !== "object") {
      cursor[part] = typeof next === "number" ? [] : {};
    }
    cursor = cursor[part];
  }
  return cursor;
}

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(code) {
  const raw = String(code || "").trim();
  if (!raw.startsWith(BACKUP_PREFIX)) throw new Error("Código de backup inválido.");

  const encoded = raw.slice(BACKUP_PREFIX.length);
  if (!encoded) throw new Error("Backup vazio.");

  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    throw new Error("Não foi possível ler esse backup.");
  }

  if (parsed?.format !== "kobayashi-group-config" || parsed?.version !== 1) {
    throw new Error("Formato de backup incompatível.");
  }
  if (!Array.isArray(parsed.files)) throw new Error("Backup sem configurações válidas.");
  return parsed;
}

export function exportGroupConfig(groupJid) {
  ensureDatabaseDir();
  if (!groupJid) throw new Error("Grupo inválido.");

  const files = [];
  for (const { full, relative } of listJsonFiles()) {
    const json = readJson(full);
    if (json == null) continue;

    const entries = collectGroupEntries(json, groupJid);
    if (entries.length) files.push({ file: relative, entries });
  }

  const payload = {
    format: "kobayashi-group-config",
    version: 1,
    createdAt: new Date().toISOString(),
    sourceGroup: groupJid,
    files,
  };

  return {
    code: `${BACKUP_PREFIX}${encodePayload(payload)}`,
    fileCount: files.length,
    entryCount: files.reduce((sum, file) => sum + file.entries.length, 0),
  };
}

export function restoreGroupConfig(targetGroupJid, backupCode) {
  ensureDatabaseDir();
  if (!targetGroupJid) throw new Error("Grupo inválido.");

  const payload = decodePayload(backupCode);
  let restoredEntries = 0;
  let restoredFiles = 0;

  for (const fileBackup of payload.files) {
    const relative = String(fileBackup?.file || "").replace(/\\/g, "/");
    if (!relative || relative.includes("..") || path.isAbsolute(relative)) continue;
    if (DENY_FILE.test(relative) || !ALLOW_FILE.test(relative)) continue;

    const targetFile = path.join(DATABASE_DIR, relative);
    let json = readJson(targetFile);
    if (json == null) json = {};
    if (!isPlainObject(json) && !Array.isArray(json)) continue;

    let changed = false;
    for (const entry of Array.isArray(fileBackup.entries) ? fileBackup.entries : []) {
      const containerPath = Array.isArray(entry?.path) ? entry.path : [];
      if (containerPath.some((part) => typeof part !== "string" && typeof part !== "number")) continue;

      // Evita criar estruturas absurdas vindas de um código adulterado.
      if (containerPath.length > 12) continue;

      let container;
      if (!containerPath.length) {
        container = json;
      } else if (pathExists(json, containerPath)) {
        container = getAtPath(json, containerPath);
      } else {
        container = ensureContainerPath(json, containerPath);
      }

      if (!container || typeof container !== "object" || Array.isArray(container)) continue;
      container[targetGroupJid] = clone(entry.value);
      restoredEntries += 1;
      changed = true;
    }

    if (changed) {
      writeJsonAtomic(targetFile, json);
      restoredFiles += 1;
    }
  }

  return {
    restoredFiles,
    restoredEntries,
    sourceGroup: payload.sourceGroup || null,
    createdAt: payload.createdAt || null,
  };
}
