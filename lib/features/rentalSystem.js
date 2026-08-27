import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "files", "database", "alugueis.json");

function defaultDb() {
  return {
    settings: {
      groupRestrictionEnabled: false,
      globalRestrictionEnabled: false,
    },
    groups: {},
  };
}

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2), "utf8");
  }
}

export function readRentalDb() {
  ensureDb();
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    return {
      settings: {
        groupRestrictionEnabled: Boolean(parsed?.settings?.groupRestrictionEnabled),
        globalRestrictionEnabled: Boolean(parsed?.settings?.globalRestrictionEnabled),
      },
      groups: parsed?.groups && typeof parsed.groups === "object" ? parsed.groups : {},
    };
  } catch {
    return defaultDb();
  }
}

export function writeRentalDb(db) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
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
  else if (["d", "dia", "dias"].includes(unit)) ms = amount * 24 * 60 * 60 * 1000;
  else if (["w", "sem", "semana", "semanas"].includes(unit)) ms = amount * 7 * 24 * 60 * 60 * 1000;

  return { amount, unit, ms, raw: value };
}

export function formatRentalDuration(ms) {
  const total = Math.max(0, Number(ms) || 0);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
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

export function registerRental(groupJid, groupName, durationMs, by) {
  const db = readRentalDb();
  const now = Date.now();
  db.groups[groupJid] = {
    groupName: groupName || groupJid,
    permanent: false,
    rentedAt: now,
    expiresAt: now + durationMs,
    lastRenewedAt: null,
    registeredBy: by || null,
  };
  writeRentalDb(db);
  return db.groups[groupJid];
}

export function renewRental(groupJid, groupName, durationMs, by) {
  const db = readRentalDb();
  const now = Date.now();
  const current = db.groups[groupJid];
  if (current?.permanent) return { permanent: true, rental: current };

  const base = current && Number(current.expiresAt || 0) > now
    ? Number(current.expiresAt)
    : now;

  db.groups[groupJid] = {
    groupName: groupName || current?.groupName || groupJid,
    permanent: false,
    rentedAt: current?.rentedAt || now,
    expiresAt: base + durationMs,
    lastRenewedAt: now,
    registeredBy: current?.registeredBy || by || null,
    renewedBy: by || null,
  };
  writeRentalDb(db);
  return { permanent: false, rental: db.groups[groupJid] };
}

export function removeRental(groupJid) {
  const db = readRentalDb();
  const existed = Boolean(db.groups[groupJid]);
  if (existed) {
    delete db.groups[groupJid];
    writeRentalDb(db);
  }
  return existed;
}

export function setPermanentRental(groupJid, groupName, by) {
  const db = readRentalDb();
  const now = Date.now();
  const current = db.groups[groupJid] || {};
  db.groups[groupJid] = {
    groupName: groupName || current.groupName || groupJid,
    permanent: true,
    rentedAt: current.rentedAt || now,
    expiresAt: null,
    permanentSince: now,
    registeredBy: current.registeredBy || by || null,
  };
  writeRentalDb(db);
  return db.groups[groupJid];
}

export function listRentals() {
  const db = readRentalDb();
  return Object.entries(db.groups).map(([groupJid, rental]) => {
    const permanent = Boolean(rental?.permanent);
    const remainingMs = permanent ? Infinity : Math.max(0, Number(rental?.expiresAt || 0) - Date.now());
    return {
      groupJid,
      ...rental,
      permanent,
      active: permanent || remainingMs > 0,
      remainingMs,
    };
  });
}

export function setRentalRestriction(type, enabled) {
  const db = readRentalDb();
  if (type === "global") db.settings.globalRestrictionEnabled = Boolean(enabled);
  else db.settings.groupRestrictionEnabled = Boolean(enabled);
  writeRentalDb(db);
  return db.settings;
}

export function getRentalSettings() {
  return readRentalDb().settings;
}
