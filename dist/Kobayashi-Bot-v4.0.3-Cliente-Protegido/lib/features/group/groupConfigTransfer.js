/* Kobayashi Protected Distribution v4.0.3 */
import fs from "fs";
import path from "\x70\x61\x74\x68";

const DATABASE_DIR = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65");
const BACKUP_PREFIX = "\x4b\x43\x46\x47\x31\x2e";
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
  return Boolean(value) && typeof value === "\x6f\x62\x6a\x65\x63\x74" && !Array.isArray(value);
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
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith("\x2e\x6a\x73\x6f\x6e")) continue;

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
    return JSON.parse(fs.readFileSync(file, "\x75\x74\x66\x38"));
  } catch {
    return null;
  }
}

function writeJsonAtomic(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "\x75\x74\x66\x38");
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
    if (cursor == null || typeof cursor !== "\x6f\x62\x6a\x65\x63\x74" || !(part in cursor)) return false;
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

    if (cursor[part] == null || typeof cursor[part] !== "\x6f\x62\x6a\x65\x63\x74") {
      cursor[part] = typeof next === "\x6e\x75\x6d\x62\x65\x72" ? [] : {};
    }
    cursor = cursor[part];
  }
  return cursor;
}

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload), "\x75\x74\x66\x38").toString("\x62\x61\x73\x65\x36\x34\x75\x72\x6c");
}

function decodePayload(code) {
  const raw = String(code || "").trim();
  if (!raw.startsWith(BACKUP_PREFIX)) throw new Error("\x43\xf3\x64\x69\x67\x6f\x20\x64\x65\x20\x62\x61\x63\x6b\x75\x70\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e");

  const encoded = raw.slice(BACKUP_PREFIX.length);
  if (!encoded) throw new Error("\x42\x61\x63\x6b\x75\x70\x20\x76\x61\x7a\x69\x6f\x2e");

  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(encoded, "\x62\x61\x73\x65\x36\x34\x75\x72\x6c").toString("\x75\x74\x66\x38"));
  } catch {
    throw new Error("\x4e\xe3\x6f\x20\x66\x6f\x69\x20\x70\x6f\x73\x73\xed\x76\x65\x6c\x20\x6c\x65\x72\x20\x65\x73\x73\x65\x20\x62\x61\x63\x6b\x75\x70\x2e");
  }

  if (parsed?.format !== "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x67\x72\x6f\x75\x70\x2d\x63\x6f\x6e\x66\x69\x67" || parsed?.version !== 1) {
    throw new Error("\x46\x6f\x72\x6d\x61\x74\x6f\x20\x64\x65\x20\x62\x61\x63\x6b\x75\x70\x20\x69\x6e\x63\x6f\x6d\x70\x61\x74\xed\x76\x65\x6c\x2e");
  }
  if (!Array.isArray(parsed.files)) throw new Error("\x42\x61\x63\x6b\x75\x70\x20\x73\x65\x6d\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x76\xe1\x6c\x69\x64\x61\x73\x2e");
  return parsed;
}

export function exportGroupConfig(groupJid) {
  ensureDatabaseDir();
  if (!groupJid) throw new Error("\x47\x72\x75\x70\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e");

  const files = [];
  for (const { full, relative } of listJsonFiles()) {
    const json = readJson(full);
    if (json == null) continue;

    const entries = collectGroupEntries(json, groupJid);
    if (entries.length) files.push({ file: relative, entries });
  }

  const payload = {
    format: "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x67\x72\x6f\x75\x70\x2d\x63\x6f\x6e\x66\x69\x67",
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
  if (!targetGroupJid) throw new Error("\x47\x72\x75\x70\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e");

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
      if (containerPath.some((part) => typeof part !== "\x73\x74\x72\x69\x6e\x67" && typeof part !== "\x6e\x75\x6d\x62\x65\x72")) continue;

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

      if (!container || typeof container !== "\x6f\x62\x6a\x65\x63\x74" || Array.isArray(container)) continue;
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
