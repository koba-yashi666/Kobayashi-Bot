import path from "node:path";
import { readJsonFile, writeJsonFile } from "../../core/jsonStore.js";

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

function numberFromPnJid(jid) {
  if (!jid || typeof jid !== "string") return null;

  const user = jid
    .split("@")[0]
    .split(":")[0]
    .replace(/\D/g, "");

  return user || null;
}

function isPnJid(jid) {
  return (
    typeof jid === "string" &&
    (
      jid.endsWith("@s.whatsapp.net") ||
      jid.endsWith("@hosted")
    )
  );
}

function isLidJid(jid) {
  return (
    typeof jid === "string" &&
    (
      jid.endsWith("@lid") ||
      jid.endsWith("@hosted.lid")
    )
  );
}

export async function resolveParticipantPhone(conn, value) {
  let raw = value;

  if (raw && typeof raw === "object") {
    raw =
      raw.phoneNumber ||
      raw.phone ||
      raw.pn ||
      raw.jid ||
      raw.id ||
      raw.participant ||
      null;
  }

  if (!raw || typeof raw !== "string") {
    return {
      known: false,
      originalJid: null,
      pnJid: null,
      number: null,
    };
  }

  const originalJid = raw.trim();

  // Se já veio como PN, não precisamos converter.
  if (isPnJid(originalJid)) {
    const number = numberFromPnJid(originalJid);

    return {
      known: Boolean(number),
      originalJid,
      pnJid: originalJid,
      number,
    };
  }

  // Baileys 7 usa LID em muitos grupos.
  // O Hutao v10 também usa Baileys 7; então aqui resolvemos LID -> PN
  // pelo signalRepository.lidMapping, em vez de assumir que o LID é telefone.
  if (isLidJid(originalJid)) {
    try {
      const pnJid =
        await conn?.signalRepository?.lidMapping?.getPNForLID?.(
          originalJid
        );

      const number = numberFromPnJid(pnJid);

      return {
        known: Boolean(number),
        originalJid,
        pnJid: pnJid || null,
        number,
      };
    } catch (error) {
      console.error(
        "[ANTIFAKE] Falha ao resolver LID:",
        error?.message || error
      );
    }

    return {
      known: false,
      originalJid,
      pnJid: null,
      number: null,
    };
  }

  // Fallback para formatos simples.
  const number = numberFromPnJid(originalJid);

  return {
    known: Boolean(number),
    originalJid,
    pnJid: originalJid,
    number,
  };
}

export async function checkAntiFakeParticipant(
  conn,
  groupJid,
  value
) {
  const resolved =
    await resolveParticipantPhone(
      conn,
      value
    );

  if (!resolved.known) {
    return {
      ...resolved,
      allowed: true,
    };
  }

  const cfg =
    getAntiFakeConfig(groupJid);

  const allowed =
    cfg.allowedPrefixes.some(
      (prefix) =>
        resolved.number.startsWith(
          String(prefix)
        )
    );

  return {
    ...resolved,
    allowed,
  };
}

export async function findForeignParticipants(
  conn,
  groupJid,
  participants = []
) {
  const result = [];

  for (const participant of participants || []) {
    const raw =
      participant?.phoneNumber ||
      participant?.phone ||
      participant?.pn ||
      participant?.id ||
      participant?.jid ||
      participant;

    const check =
      await checkAntiFakeParticipant(
        conn,
        groupJid,
        raw
      );

    if (
      check.known &&
      !check.allowed &&
      check.originalJid
    ) {
      result.push({
        jid: check.originalJid,
        pnJid: check.pnJid,
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
