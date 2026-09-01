import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import moment from "moment-timezone";

const DB_DIR = path.join(process.cwd(), "files", "database");
const CORE_DB = path.join(DB_DIR, "dragon-core.json");
const BACKUP_DIR = path.join(DB_DIR, "backups", "dragon-core");
const DEFAULT_TZ = "America/Sao_Paulo";
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
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
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
    const raw = JSON.parse(fs.readFileSync(CORE_DB, "utf8"));
    return {
      ...defaultDb(),
      ...raw,
      groups: raw?.groups && typeof raw.groups === "object" ? raw.groups : {},
      tasks: raw?.tasks && typeof raw.tasks === "object" ? raw.tasks : {},
      runtime: raw?.runtime && typeof raw.runtime === "object" ? raw.runtime : {},
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
    throw new Error("Fuso horário inválido.");
  }
  db.groups[groupJid] = next;
  writeDb(db);
  return getGroupCoreConfig(groupJid);
}

function makeId() {
  return crypto.randomBytes(4).toString("hex");
}

function normalizeTime(value = "") {
  const m = String(value).trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : null;
}

export function addScheduledTask(groupJid, task = {}) {
  const time = normalizeTime(task.time);
  if (!time) throw new Error("Horário inválido. Use HH:MM, por exemplo 08:00.");
  const type = String(task.type || "").toLowerCase();
  if (!["open", "close", "message", "rules"].includes(type)) {
    throw new Error("Tipo de agendamento inválido.");
  }
  if (type === "message" && !String(task.text || "").trim()) {
    throw new Error("Informe a mensagem que será enviada.");
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
    recurring: "daily",
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
  if (task.type === "open") {
    await conn.groupSettingUpdate(task.groupJid, "not_announcement");
    await conn.sendMessage(task.groupJid, { text: "🟢🐉 Grupo aberto automaticamente pelo Dragon Core." }).catch(() => {});
    return;
  }
  if (task.type === "close") {
    await conn.groupSettingUpdate(task.groupJid, "announcement");
    await conn.sendMessage(task.groupJid, { text: "🔒🐉 Grupo fechado automaticamente pelo Dragon Core." }).catch(() => {});
    return;
  }
  if (task.type === "message") {
    await conn.sendMessage(task.groupJid, { text: task.text });
    return;
  }
  if (task.type === "rules") {
    let rules = "📖 Consulte a descrição do grupo para ver as regras.";
    try {
      const mod = await import("./adminPro.js");
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
    const runKey = `${now.format("YYYY-MM-DD")}@${task.time}`;
    if (now.format("HH:mm") !== task.time || task.lastRunKey === runKey) continue;

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
    .filter((e) => e.isFile() && e.name.endsWith(".json") && allow.test(e.name) && !deny.test(e.name))
    .map((e) => path.join(DB_DIR, e.name));
}

export async function createCoreBackup(reason = "manual") {
  const stamp = moment().tz(DEFAULT_TZ).format("YYYY-MM-DD_HH-mm-ss");
  const dir = path.join(BACKUP_DIR, `${stamp}_${reason.replace(/[^a-z0-9_-]/gi, "-")}`);
  fs.mkdirSync(dir, { recursive: true });
  let files = 0;
  for (const src of backupCandidates()) {
    fs.copyFileSync(src, path.join(dir, path.basename(src)));
    files += 1;
  }
  atomicWrite(path.join(dir, "manifest.json"), {
    version: "0.8.3",
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
  const day = moment().tz(DEFAULT_TZ).format("YYYY-MM-DD");
  if (db.runtime?.lastBackupDay === day) return;
  try {
    await createCoreBackup("auto");
    db.runtime = { ...(db.runtime || {}), lastBackupDay: day };
    writeDb(db);
  } catch (error) {
    console.error("[DragonCore] Backup automático falhou:", error?.message || error);
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
  process.on("unhandledRejection", (reason) => {
    console.error("[DragonCore] Promise rejeitada sem tratamento:", reason);
  });
  process.on("uncaughtException", (error) => {
    console.error("[DragonCore] Erro não tratado:", error?.stack || error);
  });
}

export function ensureDragonCoreRuntime(conn) {
  runtimeConn = conn || runtimeConn;
  if (runtimeStarted) return;
  runtimeStarted = true;
  installProcessGuards();
  migrateDragonCore();
  maybeAutoBackup().catch(() => {});
  timer = setInterval(() => tick().catch((e) => console.error("[DragonCore] Tick:", e?.message || e)), TICK_MS);
  timer.unref?.();
  console.log("🐉 Dragon Core v0.8.3 iniciado: agendamentos, backup e proteção de runtime.");
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
