/* Kobayashi Protected Distribution v4.0.3 */
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { readJsonFile, writeJsonFile } from "\x2e\x2e\x2f\x2e\x2e\x2f\x63\x6f\x72\x65\x2f\x6a\x73\x6f\x6e\x53\x74\x6f\x72\x65\x2e\x6a\x73";

const DB_FILE = path.join(
  process.cwd(),
  "\x66\x69\x6c\x65\x73",
  "\x64\x61\x74\x61\x62\x61\x73\x65",
  "\x61\x6e\x74\x69\x66\x61\x6b\x65\x2e\x6a\x73\x6f\x6e"
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
  if (!jid || typeof jid !== "\x73\x74\x72\x69\x6e\x67") return null;

  const user = jid
    .split("@")[0]
    .split(":")[0]
    .replace(/\D/g, "");

  return user || null;
}

function isPnJid(jid) {
  return (
    typeof jid === "\x73\x74\x72\x69\x6e\x67" &&
    (
      jid.endsWith("\x40\x73\x2e\x77\x68\x61\x74\x73\x61\x70\x70\x2e\x6e\x65\x74") ||
      jid.endsWith("\x40\x68\x6f\x73\x74\x65\x64")
    )
  );
}

function isLidJid(jid) {
  return (
    typeof jid === "\x73\x74\x72\x69\x6e\x67" &&
    (
      jid.endsWith("\x40\x6c\x69\x64") ||
      jid.endsWith("\x40\x68\x6f\x73\x74\x65\x64\x2e\x6c\x69\x64")
    )
  );
}

export async function resolveParticipantPhone(conn, value) {
  let raw = value;

  if (raw && typeof raw === "\x6f\x62\x6a\x65\x63\x74") {
    raw =
      raw.phoneNumber ||
      raw.phone ||
      raw.pn ||
      raw.jid ||
      raw.id ||
      raw.participant ||
      null;
  }

  if (!raw || typeof raw !== "\x73\x74\x72\x69\x6e\x67") {
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
        "\x5b\x41\x4e\x54\x49\x46\x41\x4b\x45\x5d\x20\x46\x61\x6c\x68\x61\x20\x61\x6f\x20\x72\x65\x73\x6f\x6c\x76\x65\x72\x20\x4c\x49\x44\x3a",
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
