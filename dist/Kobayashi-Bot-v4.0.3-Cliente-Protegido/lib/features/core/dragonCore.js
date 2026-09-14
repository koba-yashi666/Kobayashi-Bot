/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import crypto from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";
import moment from "\x6d\x6f\x6d\x65\x6e\x74\x2d\x74\x69\x6d\x65\x7a\x6f\x6e\x65";

const DB_DIR = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65");
const CORE_DB = path.join(DB_DIR, "\x64\x72\x61\x67\x6f\x6e\x2d\x63\x6f\x72\x65\x2e\x6a\x73\x6f\x6e");
const BACKUP_DIR = path.join(DB_DIR, "\x62\x61\x63\x6b\x75\x70\x73", "\x64\x72\x61\x67\x6f\x6e\x2d\x63\x6f\x72\x65");
const DEFAULT_TZ = "\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f";
const TICK_MS = 30_000;

let runtimeStarted = false;
let runtimeConn = null;
let timer = null;
let listenersInstalled = false;
const runningTasks = new Set();

function ensureDir() {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function atomicWrite(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, file);
}

function defaultDb() {
  return {
    schemaVersion: 1,
    groups: {},
    tasks: {},
    runtime: { lastBackupDay: null, lastMigrationAt: null },
  };
}

export function readDragonCoreDb() {
  ensureDir();
  if (!fs.existsSync(CORE_DB)) {
    const db = defaultDb();
    atomicWrite(CORE_DB, db);
    return db;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(CORE_DB, "\x75\x74\x66\x38"));
    return {
      ...defaultDb(),
      ...raw,
      groups: raw?.groups && typeof raw.groups === "\x6f\x62\x6a\x65\x63\x74" ? raw.groups : {},
      tasks: raw?.tasks && typeof raw.tasks === "\x6f\x62\x6a\x65\x63\x74" ? raw.tasks : {},
      runtime: raw?.runtime && typeof raw.runtime === "\x6f\x62\x6a\x65\x63\x74" ? raw.runtime : {},
    };
  } catch {
    const broken = `${CORE_DB}.corrupt-${Date.now()}`;
    try { fs.renameSync(CORE_DB, broken); } catch {}
    const db = defaultDb();
    atomicWrite(CORE_DB, db);
    return db;
  }
}

function writeDb(db) {
  atomicWrite(CORE_DB, db);
}

export function getGroupCoreConfig(groupJid) {
  const db = readDragonCoreDb();
  const c = db.groups[groupJid] || {};
  return {
    timezone: moment.tz.zone(c.timezone) ? c.timezone : DEFAULT_TZ,
    schedulerEnabled: c.schedulerEnabled !== false,
    securityAudit: c.securityAudit !== false,
  };
}

export function updateGroupCoreConfig(groupJid, patch = {}) {
  const db = readDragonCoreDb();
  const current = db.groups[groupJid] || {};
  const next = { ...current, ...patch };
  if (patch.timezone && !moment.tz.zone(patch.timezone)) {
    throw new Error("\x46\x75\x73\x6f\x20\x68\x6f\x72\xe1\x72\x69\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e");
  }
  db.groups[groupJid] = next;
  writeDb(db);
  return getGroupCoreConfig(groupJid);
}

function makeId() {
  return crypto.randomBytes(4).toString("\x68\x65\x78");
}

function normalizeTime(value = "") {
  const m = String(value).trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : null;
}

export function addScheduledTask(groupJid, task = {}) {
  const time = normalizeTime(task.time);
  if (!time) throw new Error("\x48\x6f\x72\xe1\x72\x69\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e\x20\x55\x73\x65\x20\x48\x48\x3a\x4d\x4d\x2c\x20\x70\x6f\x72\x20\x65\x78\x65\x6d\x70\x6c\x6f\x20\x30\x38\x3a\x30\x30\x2e");
  const type = String(task.type || "").toLowerCase();
  if (!["\x6f\x70\x65\x6e", "\x63\x6c\x6f\x73\x65", "\x6d\x65\x73\x73\x61\x67\x65", "\x72\x75\x6c\x65\x73"].includes(type)) {
    throw new Error("\x54\x69\x70\x6f\x20\x64\x65\x20\x61\x67\x65\x6e\x64\x61\x6d\x65\x6e\x74\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e");
  }
  if (type === "\x6d\x65\x73\x73\x61\x67\x65" && !String(task.text || "").trim()) {
    throw new Error("\x49\x6e\x66\x6f\x72\x6d\x65\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x71\x75\x65\x20\x73\x65\x72\xe1\x20\x65\x6e\x76\x69\x61\x64\x61\x2e");
  }

  const db = readDragonCoreDb();
  const id = makeId();
  db.tasks[id] = {
    id,
    groupJid,
    type,
    time,
    text: String(task.text || "").trim() || null,
    enabled: true,
    recurring: "\x64\x61\x69\x6c\x79",
    createdBy: task.createdBy || null,
    createdAt: new Date().toISOString(),
    lastRunKey: null,
  };
  writeDb(db);
  return db.tasks[id];
}

export function listScheduledTasks(groupJid) {
  const db = readDragonCoreDb();
  return Object.values(db.tasks)
    .filter((x) => x?.groupJid === groupJid)
    .sort((a, b) => String(a.time).localeCompare(String(b.time)));
}

export function removeScheduledTask(groupJid, id) {
  const db = readDragonCoreDb();
  const task = db.tasks[id];
  if (!task || task.groupJid !== groupJid) return false;
  delete db.tasks[id];
  writeDb(db);
  return true;
}

export function clearScheduledTasks(groupJid) {
  const db = readDragonCoreDb();
  let count = 0;
  for (const [id, task] of Object.entries(db.tasks)) {
    if (task?.groupJid === groupJid) {
      delete db.tasks[id];
      count += 1;
    }
  }
  writeDb(db);
  return count;
}

async function runTask(conn, task) {
  if (task.type === "\x6f\x70\x65\x6e") {
    await conn.groupSettingUpdate(task.groupJid, "\x6e\x6f\x74\x5f\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74");
    await conn.sendMessage(task.groupJid, { text: "\ud83d\ud83d\x20\x47\x72\x75\x70\x6f\x20\x61\x62\x65\x72\x74\x6f\x20\x61\x75\x74\x6f\x6d\x61\x74\x69\x63\x61\x6d\x65\x6e\x74\x65\x20\x70\x65\x6c\x6f\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x72\x65\x2e" }).catch(() => {});
    return;
  }
  if (task.type === "\x63\x6c\x6f\x73\x65") {
    await conn.groupSettingUpdate(task.groupJid, "\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74");
    await conn.sendMessage(task.groupJid, { text: "\ud83d\ud83d\x20\x47\x72\x75\x70\x6f\x20\x66\x65\x63\x68\x61\x64\x6f\x20\x61\x75\x74\x6f\x6d\x61\x74\x69\x63\x61\x6d\x65\x6e\x74\x65\x20\x70\x65\x6c\x6f\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x72\x65\x2e" }).catch(() => {});
    return;
  }
  if (task.type === "\x6d\x65\x73\x73\x61\x67\x65") {
    await conn.sendMessage(task.groupJid, { text: task.text });
    return;
  }
  if (task.type === "\x72\x75\x6c\x65\x73") {
    let rules = "\ud83d\x20\x43\x6f\x6e\x73\x75\x6c\x74\x65\x20\x61\x20\x64\x65\x73\x63\x72\x69\xe7\xe3\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x70\x61\x72\x61\x20\x76\x65\x72\x20\x61\x73\x20\x72\x65\x67\x72\x61\x73\x2e";
    try {
      const mod = await import("\x2e\x2e\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x64\x6d\x69\x6e\x50\x72\x6f\x2e\x6a\x73");
      const configured = mod.getRules?.(task.groupJid);
      if (configured) rules = configured;
    } catch {}
    await conn.sendMessage(task.groupJid, { text: `📖🐉 *REGRAS DO GRUPO*\n\n${rules}` });
  }
}

async function tick() {
  const conn = runtimeConn;
  if (!conn?.user) return;

  const db = readDragonCoreDb();
  let changed = false;

  for (const task of Object.values(db.tasks)) {
    if (!task?.enabled || !task.groupJid || runningTasks.has(task.id)) continue;
    const cfg = getGroupCoreConfig(task.groupJid);
    if (!cfg.schedulerEnabled) continue;

    const now = moment().tz(cfg.timezone);
    const runKey = `${now.format("\x59\x59\x59\x59\x2d\x4d\x4d\x2d\x44\x44")}@${task.time}`;
    if (now.format("\x48\x48\x3a\x6d\x6d") !== task.time || task.lastRunKey === runKey) continue;

    runningTasks.add(task.id);
    try {
      await runTask(conn, task);
      if (db.tasks[task.id]) {
        db.tasks[task.id].lastRunKey = runKey;
        db.tasks[task.id].lastRunAt = new Date().toISOString();
        changed = true;
      }
    } catch (error) {
      console.error(`[DragonCore] Falha no agendamento ${task.id}:`, error?.message || error);
    } finally {
      runningTasks.delete(task.id);
    }
  }

  if (changed) writeDb(db);
  await maybeAutoBackup();
}

function backupCandidates() {
  const allow = /(config|setting|group|grupo|welcome|bem.?vind|schedule|horario|agend|whitelist|protection|protec|antilink|telegram|autosticker|brincadeira|antipv|prefix|admin-logs|dragon-core)/i;
  const deny = /(qr-code|session|auth|message|mensagem|level|nivel|xp|coin|inventory|inventario|rental|aluguel)/i;
  if (!fs.existsSync(DB_DIR)) return [];
  return fs.readdirSync(DB_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith("\x2e\x6a\x73\x6f\x6e") && allow.test(e.name) && !deny.test(e.name))
    .map((e) => path.join(DB_DIR, e.name));
}

export async function createCoreBackup(reason = "\x6d\x61\x6e\x75\x61\x6c") {
  const stamp = moment().tz(DEFAULT_TZ).format("\x59\x59\x59\x59\x2d\x4d\x4d\x2d\x44\x44\x5f\x48\x48\x2d\x6d\x6d\x2d\x73\x73");
  const dir = path.join(BACKUP_DIR, `${stamp}_${reason.replace(/[^a-z0-9_-]/gi, "-")}`);
  fs.mkdirSync(dir, { recursive: true });
  let files = 0;
  for (const src of backupCandidates()) {
    fs.copyFileSync(src, path.join(dir, path.basename(src)));
    files += 1;
  }
  atomicWrite(path.join(dir, "\x6d\x61\x6e\x69\x66\x65\x73\x74\x2e\x6a\x73\x6f\x6e"), {
    version: "\x30\x2e\x38\x2e\x33",
    createdAt: new Date().toISOString(),
    reason,
    files,
  });

  // Mantém apenas os 7 backups mais recentes.
  const dirs = fs.readdirSync(BACKUP_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
    .reverse();
  for (const old of dirs.slice(7)) {
    fs.rmSync(path.join(BACKUP_DIR, old), { recursive: true, force: true });
  }
  return { dir, files };
}

async function maybeAutoBackup() {
  const db = readDragonCoreDb();
  const day = moment().tz(DEFAULT_TZ).format("\x59\x59\x59\x59\x2d\x4d\x4d\x2d\x44\x44");
  if (db.runtime?.lastBackupDay === day) return;
  try {
    await createCoreBackup("\x61\x75\x74\x6f");
    db.runtime = { ...(db.runtime || {}), lastBackupDay: day };
    writeDb(db);
  } catch (error) {
    console.error("\x5b\x44\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x5d\x20\x42\x61\x63\x6b\x75\x70\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x6f\x20\x66\x61\x6c\x68\x6f\x75\x3a", error?.message || error);
  }
}

export function migrateDragonCore() {
  const db = readDragonCoreDb();
  db.schemaVersion = 1;
  db.runtime = { ...(db.runtime || {}), lastMigrationAt: new Date().toISOString() };
  writeDb(db);
  return db.schemaVersion;
}

function installProcessGuards() {
  if (listenersInstalled) return;
  listenersInstalled = true;
  process.on("\x75\x6e\x68\x61\x6e\x64\x6c\x65\x64\x52\x65\x6a\x65\x63\x74\x69\x6f\x6e", (reason) => {
    console.error("\x5b\x44\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x5d\x20\x50\x72\x6f\x6d\x69\x73\x65\x20\x72\x65\x6a\x65\x69\x74\x61\x64\x61\x20\x73\x65\x6d\x20\x74\x72\x61\x74\x61\x6d\x65\x6e\x74\x6f\x3a", reason);
  });
  process.on("\x75\x6e\x63\x61\x75\x67\x68\x74\x45\x78\x63\x65\x70\x74\x69\x6f\x6e", (error) => {
    console.error("\x5b\x44\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x5d\x20\x45\x72\x72\x6f\x20\x6e\xe3\x6f\x20\x74\x72\x61\x74\x61\x64\x6f\x3a", error?.stack || error);
  });
}

export function ensureDragonCoreRuntime(conn) {
  runtimeConn = conn || runtimeConn;
  if (runtimeStarted) return;
  runtimeStarted = true;
  installProcessGuards();
  migrateDragonCore();
  maybeAutoBackup().catch(() => {});
  timer = setInterval(() => tick().catch((e) => console.error("\x5b\x44\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x5d\x20\x54\x69\x63\x6b\x3a", e?.message || e)), TICK_MS);
  timer.unref?.();
  console.log("\ud83d\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x72\x65\x20\x76\x30\x2e\x38\x2e\x33\x20\x69\x6e\x69\x63\x69\x61\x64\x6f\x3a\x20\x61\x67\x65\x6e\x64\x61\x6d\x65\x6e\x74\x6f\x73\x2c\x20\x62\x61\x63\x6b\x75\x70\x20\x65\x20\x70\x72\x6f\x74\x65\xe7\xe3\x6f\x20\x64\x65\x20\x72\x75\x6e\x74\x69\x6d\x65\x2e");
}

export function getDragonCoreStatus() {
  const db = readDragonCoreDb();
  return {
    schemaVersion: db.schemaVersion,
    groups: Object.keys(db.groups || {}).length,
    tasks: Object.keys(db.tasks || {}).length,
    runtimeStarted,
    backupDir: BACKUP_DIR,
  };
}
