import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "files", "database", "alugueis.json");
const DAY = 24 * 60 * 60 * 1000;

export const RENTAL_PLANS = Object.freeze({
  1: { id: 1, name: "Plano Inicial", days: 30, price: 30, partnerBonusDays: 5 },
  2: { id: 2, name: "Plano Popular", days: 45, price: 45, partnerBonusDays: 7 },
  3: { id: 3, name: "Plano Premium", days: 60, price: 55, partnerBonusDays: 10 },
  4: { id: 4, name: "Plano Supremo", days: 90, price: 75, partnerBonusDays: 15 },
});

const WARNING_STAGES = [
  { key: "7d", ms: 7 * DAY, label: "7 dias" },
  { key: "3d", ms: 3 * DAY, label: "3 dias" },
  { key: "1d", ms: DAY, label: "1 dia" },
  { key: "12h", ms: 12 * 60 * 60 * 1000, label: "12 horas" },
  { key: "1h", ms: 60 * 60 * 1000, label: "1 hora" },
];

let runtimeStarted = false;
let runtimeConn = null;
let runtimeTimer = null;

function defaultDb() {
  return {
    schemaVersion: 2,
    settings: {
      groupRestrictionEnabled: false,
      globalRestrictionEnabled: false,
      warningsEnabled: true,
      expirationNoticeEnabled: true,
      checkIntervalMinutes: 5,
    },
    groups: {},
  };
}

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    writeRentalDb(defaultDb());
  }
}

function atomicWrite(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

export function readRentalDb() {
  ensureDb();
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    const def = defaultDb();
    return {
      schemaVersion: 2,
      settings: {
        ...def.settings,
        ...(parsed?.settings || {}),
        groupRestrictionEnabled: Boolean(parsed?.settings?.groupRestrictionEnabled),
        globalRestrictionEnabled: Boolean(parsed?.settings?.globalRestrictionEnabled),
        warningsEnabled: parsed?.settings?.warningsEnabled !== false,
        expirationNoticeEnabled: parsed?.settings?.expirationNoticeEnabled !== false,
      },
      groups: parsed?.groups && typeof parsed.groups === "object" ? parsed.groups : {},
    };
  } catch {
    return defaultDb();
  }
}

export function writeRentalDb(db) {
  atomicWrite(DB_PATH, db);
}

export function migrateRentalDb() {
  const db = readRentalDb();
  let changed = false;
  db.schemaVersion = 2;
  for (const [jid, old] of Object.entries(db.groups || {})) {
    if (!old || typeof old !== "object") continue;
    if (!Array.isArray(old.warningHistory)) { old.warningHistory = []; changed = true; }
    if (old.expirationNotified == null) { old.expirationNotified = false; changed = true; }
    if (old.planId == null) { old.planId = null; changed = true; }
    if (old.partner == null) { old.partner = false; changed = true; }
    if (old.bonusDays == null) { old.bonusDays = 0; changed = true; }
    if (old.status == null) { old.status = old.permanent ? "permanent" : "active"; changed = true; }
    db.groups[jid] = old;
  }
  if (changed) writeRentalDb(db);
  return db;
}

export function getRentalPlan(planId) {
  const key = Number(String(planId || "").replace(/\D/g, ""));
  return RENTAL_PLANS[key] || null;
}

export function listRentalPlans() {
  return Object.values(RENTAL_PLANS);
}

export function formatPlan(plan, partner = false) {
  if (!plan) return "Plano inválido";
  const totalDays = plan.days + (partner ? plan.partnerBonusDays : 0);
  return `${plan.name} • ${plan.days} dias • R$ ${plan.price.toFixed(2).replace(".", ",")}${partner ? ` • +${plan.partnerBonusDays} dias parceria = ${totalDays} dias` : ""}`;
}

export function normalizeGroupJid(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^[0-9-]+@g\.us$/i.test(raw)) return raw.toLowerCase();
  if (/^[0-9-]+$/.test(raw) && raw.includes("-")) return `${raw}@g.us`.toLowerCase();
  return null;
}

export function parseRentalDuration(input = "") {
  const value = String(input || "").trim().toLowerCase().replace(/\s+/g, "");
  const match = value.match(/^(\d+)(m|min|h|d|dia|dias|w|sem|semana|semanas)?$/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const unit = (match[2] || "d").toLowerCase();
  let ms = 0;
  if (["m", "min"].includes(unit)) ms = amount * 60 * 1000;
  else if (unit === "h") ms = amount * 60 * 60 * 1000;
  else if (["d", "dia", "dias"].includes(unit)) ms = amount * DAY;
  else if (["w", "sem", "semana", "semanas"].includes(unit)) ms = amount * 7 * DAY;
  return { amount, unit, ms, raw: value };
}

export function formatRentalDuration(ms) {
  const total = Math.max(0, Number(ms) || 0);
  const days = Math.floor(total / DAY);
  const hours = Math.floor((total % DAY) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || !parts.length) parts.push(`${minutes}min`);
  return parts.join(" ");
}

export function formatRentalDate(timestamp) {
  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function getRental(groupJid) {
  const db = readRentalDb();
  const rental = db.groups?.[groupJid] || null;
  if (!rental) return { exists: false, active: false, permanent: false, rental: null };
  if (rental.permanent) return { exists: true, active: true, permanent: true, rental };
  const active = Number(rental.expiresAt || 0) > Date.now();
  return { exists: true, active, permanent: false, rental };
}

function baseRental({ groupJid, groupName, durationMs, by, plan = null, partner = false, bonusDays = 0, source = "manual", trial = false }) {
  const now = Date.now();
  return {
    groupName: groupName || groupJid,
    permanent: false,
    rentedAt: now,
    expiresAt: now + durationMs,
    lastRenewedAt: null,
    registeredBy: by || null,
    renewedBy: null,
    planId: plan?.id || null,
    planName: plan?.name || null,
    baseDays: plan?.days || Math.ceil(durationMs / DAY),
    price: plan?.price ?? null,
    partner: Boolean(partner),
    bonusDays: Number(bonusDays) || 0,
    source,
    trial: Boolean(trial),
    warningHistory: [],
    expirationNotified: false,
    status: "active",
  };
}

export function registerRental(groupJid, groupName, durationMs, by, meta = {}) {
  const db = readRentalDb();
  db.groups[groupJid] = baseRental({ groupJid, groupName, durationMs, by, ...meta });
  writeRentalDb(db);
  return db.groups[groupJid];
}

export function registerRentalByPlan(groupJid, groupName, planId, by, { partner = false, source = "plan" } = {}) {
  const plan = getRentalPlan(planId);
  if (!plan) throw new Error("Plano inválido. Use 1, 2, 3 ou 4.");
  const bonusDays = partner ? plan.partnerBonusDays : 0;
  return registerRental(groupJid, groupName, (plan.days + bonusDays) * DAY, by, { plan, partner, bonusDays, source });
}

export function registerPartnerRental(groupJid, groupName, planId, by) {
  return registerRentalByPlan(groupJid, groupName, planId, by, { partner: true, source: "partnership" });
}

export function registerTrialRental(groupJid, groupName, days, by) {
  const safeDays = Math.max(1, Math.min(30, Number(days) || 3));
  return registerRental(groupJid, groupName, safeDays * DAY, by, { source: "trial", trial: true });
}

export function renewRental(groupJid, groupName, durationMs, by, meta = {}) {
  const db = readRentalDb();
  const now = Date.now();
  const current = db.groups[groupJid];
  if (current?.permanent) return { permanent: true, rental: current };
  const base = current && Number(current.expiresAt || 0) > now ? Number(current.expiresAt) : now;
  db.groups[groupJid] = {
    ...(current || {}),
    groupName: groupName || current?.groupName || groupJid,
    permanent: false,
    rentedAt: current?.rentedAt || now,
    expiresAt: base + durationMs,
    lastRenewedAt: now,
    registeredBy: current?.registeredBy || by || null,
    renewedBy: by || null,
    warningHistory: [],
    expirationNotified: false,
    status: "active",
    ...(meta || {}),
  };
  writeRentalDb(db);
  return { permanent: false, rental: db.groups[groupJid] };
}

export function renewRentalByPlan(groupJid, groupName, planId, by, { partner = false } = {}) {
  const plan = getRentalPlan(planId);
  if (!plan) throw new Error("Plano inválido. Use 1, 2, 3 ou 4.");
  const bonusDays = partner ? plan.partnerBonusDays : 0;
  return renewRental(groupJid, groupName, (plan.days + bonusDays) * DAY, by, {
    planId: plan.id,
    planName: plan.name,
    baseDays: plan.days,
    price: plan.price,
    partner: Boolean(partner),
    bonusDays,
    source: partner ? "partnership-renewal" : "plan-renewal",
    trial: false,
  });
}

export function removeRental(groupJid) {
  const db = readRentalDb();
  const existed = Boolean(db.groups[groupJid]);
  if (existed) { delete db.groups[groupJid]; writeRentalDb(db); }
  return existed;
}

export function setPermanentRental(groupJid, groupName, by) {
  const db = readRentalDb();
  const now = Date.now();
  const current = db.groups[groupJid] || {};
  db.groups[groupJid] = {
    ...current,
    groupName: groupName || current.groupName || groupJid,
    permanent: true,
    rentedAt: current.rentedAt || now,
    expiresAt: null,
    permanentSince: now,
    registeredBy: current.registeredBy || by || null,
    status: "permanent",
    expirationNotified: false,
  };
  writeRentalDb(db);
  return db.groups[groupJid];
}

export function listRentals() {
  const db = readRentalDb();
  return Object.entries(db.groups).map(([groupJid, rental]) => {
    const permanent = Boolean(rental?.permanent);
    const remainingMs = permanent ? Infinity : Math.max(0, Number(rental?.expiresAt || 0) - Date.now());
    return { groupJid, ...rental, permanent, active: permanent || remainingMs > 0, remainingMs };
  });
}

export function setRentalRestriction(type, enabled) {
  const db = readRentalDb();
  if (type === "global") db.settings.globalRestrictionEnabled = Boolean(enabled);
  else db.settings.groupRestrictionEnabled = Boolean(enabled);
  writeRentalDb(db);
  return db.settings;
}

export function setRentalWarnings(enabled) {
  const db = readRentalDb();
  db.settings.warningsEnabled = Boolean(enabled);
  writeRentalDb(db);
  return db.settings;
}

export function getRentalSettings() {
  return readRentalDb().settings;
}

async function rentalTick() {
  const conn = runtimeConn;
  if (!conn?.user) return;
  const db = readRentalDb();
  const now = Date.now();
  let changed = false;

  for (const [groupJid, rental] of Object.entries(db.groups || {})) {
    if (!rental || rental.permanent || !rental.expiresAt) continue;
    const remaining = Number(rental.expiresAt) - now;
    rental.warningHistory = Array.isArray(rental.warningHistory) ? rental.warningHistory : [];

    if (remaining <= 0) {
      rental.status = "expired";
      if (db.settings.expirationNoticeEnabled && !rental.expirationNotified) {
        await conn.sendMessage(groupJid, {
          text: `⏳🐉 *ALUGUEL EXPIRADO*\n\nO período de uso do Kobayashi Bot neste grupo terminou.\n📦 Use */planos* para consultar a renovação.\n👑 Fale com o proprietário do bot para reativar o acesso.`,
        }).catch(() => {});
        rental.expirationNotified = true;
        changed = true;
      }
      continue;
    }

    rental.status = "active";
    if (!db.settings.warningsEnabled) continue;
    for (const stage of WARNING_STAGES) {
      if (remaining <= stage.ms && !rental.warningHistory.includes(stage.key)) {
        await conn.sendMessage(groupJid, {
          text: `⚠️🐉 *AVISO DE ALUGUEL*\n\nFaltam aproximadamente *${stage.label}* para o aluguel do Kobayashi Bot expirar.\n⌛ Expiração: *${formatRentalDate(rental.expiresAt)}*\n📦 Plano: *${rental.planName || "Personalizado"}*\n\nEntre em contato com o proprietário para renovar.`,
        }).catch(() => {});
        rental.warningHistory.push(stage.key);
        changed = true;
        break;
      }
    }
  }
  if (changed) writeRentalDb(db);
}

export function ensureRentalRuntime(conn) {
  runtimeConn = conn || runtimeConn;
  if (runtimeStarted) return;
  runtimeStarted = true;
  migrateRentalDb();
  rentalTick().catch(() => {});
  runtimeTimer = setInterval(() => rentalTick().catch((e) => console.error("[Rental2]", e?.message || e)), 5 * 60 * 1000);
  runtimeTimer.unref?.();
  console.log("🏷️🐉 Aluguel 2.0 iniciado: planos, parceria, avisos e expiração automática.");
}
