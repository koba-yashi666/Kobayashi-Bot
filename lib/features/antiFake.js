import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const DB_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "antifake.json"
);

const DEFAULT_ALLOWED_PREFIXES = ["55"];

function readDb() {
  return readJsonFile(DB_FILE, {});
}

function writeDb(db) {
  writeJsonFile(DB_FILE, db);
}

export function getAntiFakeConfig(groupJid) {
  const db = readDb();
  const cfg = db?.[groupJid] || {};

  return {
    enabled: Boolean(cfg.enabled),
    allowedPrefixes:
      Array.isArray(cfg.allowedPrefixes) && cfg.allowedPrefixes.length
        ? cfg.allowedPrefixes.map(String)
        : [...DEFAULT_ALLOWED_PREFIXES],
  };
}

export function setAntiFakeEnabled(groupJid, enabled) {
  const db = readDb();

  db[groupJid] ||= {};
  db[groupJid].enabled = Boolean(enabled);

  if (
    !Array.isArray(db[groupJid].allowedPrefixes) ||
    !db[groupJid].allowedPrefixes.length
  ) {
    db[groupJid].allowedPrefixes = [...DEFAULT_ALLOWED_PREFIXES];
  }

  writeDb(db);

  return getAntiFakeConfig(groupJid);
}

export function resolvePhoneParticipant(value) {
  if (!value) return null;

  if (typeof value === "object") {
    value =
      value.phoneNumber ||
      value.phone ||
      value.jid ||
      value.id ||
      value.participant ||
      null;
  }

  if (typeof value !== "string") return null;

  const jid = value.trim();

  // @lid não garante acesso ao número real.
  // Não classificamos para evitar falso positivo.
  if (jid.endsWith("@lid")) {
    return null;
  }

  const number = jid
    .split("@")[0]
    .split(":")[0]
    .replace(/\D/g, "");

  if (!number) return null;

  return { jid, number };
}

export function checkAntiFakeParticipant(groupJid, value) {
  const normalized = resolvePhoneParticipant(value);

  if (!normalized) {
    return {
      known: false,
      allowed: true,
      jid: null,
      number: null,
    };
  }

  const cfg = getAntiFakeConfig(groupJid);

  const allowed = cfg.allowedPrefixes.some(
    (prefix) => normalized.number.startsWith(String(prefix))
  );

  return {
    known: true,
    allowed,
    jid: normalized.jid,
    number: normalized.number,
  };
}

export function findForeignParticipants(groupJid, participants = []) {
  const result = [];

  for (const participant of participants || []) {
    const raw =
      participant?.phoneNumber ||
      participant?.phone ||
      participant?.id ||
      participant?.jid ||
      participant;

    const check = checkAntiFakeParticipant(groupJid, raw);

    if (
      check.known &&
      !check.allowed &&
      check.jid
    ) {
      result.push({
        jid: check.jid,
        number: check.number,
      });
    }
  }

  const seen = new Set();

  return result.filter((item) => {
    if (seen.has(item.jid)) return false;
    seen.add(item.jid);
    return true;
  });
}
