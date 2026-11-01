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

// A lista de solicitações do Baileys devolve os atributos do WhatsApp sem
// converter snake_case: phone_number/participant_pn também são telefones.
export function participantPhoneCandidates(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  const fields = ["phoneNumber", "phone_number", "participantPn", "participant_pn", "phone", "pn", "jid", "id", "participant", "lid"];
  return [...new Set(fields.map(key => value[key]).filter(item => typeof item === "string" && item.trim()))];
}

function phoneJid(value) {
  if (typeof value !== "string") return null;
  const raw = value.trim().replace(/:\d+(?=@)/, "");
  const pn = raw.match(/^(\d{10,15})@(s\.whatsapp\.net|c\.us|hosted)$/);
  if (pn) return { number: pn[1], pnJid: `${pn[1]}@${pn[2] === "c.us" ? "s.whatsapp.net" : pn[2]}` };
  // Só campos de telefone explícitos/valor simples: nunca converte dígitos de LID.
  if (!/^\+?[\d ()-]+$/.test(raw)) return null;
  const number = raw.replace(/\D/g, "");
  return /^\d{10,15}$/.test(number) ? { number, pnJid: `${number}@s.whatsapp.net` } : null;
}

export async function resolveParticipantPhone(conn, value) {
  const candidates = participantPhoneCandidates(value);
  const originalJid = candidates[0]?.trim() || null;
  // Um campo inválido não deve esconder outro campo de telefone válido.
  for (const candidate of candidates) {
    const phone = phoneJid(candidate);
    if (phone) return { known: true, originalJid: candidate.trim(), ...phone };
  }
  for (const candidate of candidates) {
    const lid = candidate.trim().replace(/:\d+(?=@)/, "");
    if (!/@(?:lid|hosted\.lid)$/.test(lid)) continue;
    try {
      const mapped = await conn?.signalRepository?.lidMapping?.getPNForLID?.(lid);
      const phone = phoneJid(mapped);
      if (phone) return { known: true, originalJid: lid, ...phone };
    } catch (error) {
      console.error("[ANTIFAKE] Falha ao resolver LID:", error?.message || error);
    }
  }
  return { known: false, originalJid, pnJid: null, number: null };
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
    const check = await checkAntiFakeParticipant(conn, groupJid, participant);

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
