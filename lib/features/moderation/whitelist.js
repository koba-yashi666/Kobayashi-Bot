import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "files", "database", "lista-branca.json");

function onlyDigits(value=""){
  return String(value || "").replace(/\D/g, "");
}

function normalizeGroup(value=""){
  return String(value || "").trim().toLowerCase();
}

function normalizeUser(value=""){
  const raw = String(value || "").trim().toLowerCase();
  if(!raw) return "";

  if(raw.includes("@")){
    const [left, server] = raw.split("@");
    const digits = onlyDigits(left.split(":")[0]);
    if(!digits) return raw;
    return `${digits}@${server || "s.whatsapp.net"}`;
  }

  const digits = onlyDigits(raw);
  return digits ? `${digits}@s.whatsapp.net` : raw;
}

function comparable(value=""){
  const raw = String(value || "").trim().toLowerCase();
  const digits = onlyDigits(raw.split("@")[0].split(":")[0]);
  const server = raw.includes("@") ? raw.split("@")[1] : "";

  return {
    raw,
    normalized: normalizeUser(raw),
    digits,
    server
  };
}

function sameUser(a,b){
  const A = comparable(a);
  const B = comparable(b);
  if(!A.raw || !B.raw) return false;

  // JID idêntico/normalizado.
  if(A.normalized === B.normalized) return true;

  // Mesmo telefone em formatos diferentes:
  // +55 11..., 5511...@s.whatsapp.net, 5511...:device@s.whatsapp.net.
  // Não iguala @lid a @s.whatsapp.net apenas pelos dígitos, pois LID não é o telefone.
  const aPhoneLike = !A.server || A.server === "s.whatsapp.net";
  const bPhoneLike = !B.server || B.server === "s.whatsapp.net";
  if(aPhoneLike && bPhoneLike && A.digits && A.digits === B.digits) return true;

  return false;
}

function ensureDb(){
  fs.mkdirSync(path.dirname(DB_PATH), {recursive:true});
  if(!fs.existsSync(DB_PATH)){
    fs.writeFileSync(DB_PATH, JSON.stringify({groups:{}}, null, 2), "utf8");
  }
}

function readDb(){
  ensureDb();

  try{
    const raw = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));

    // Formato atual.
    if(raw && typeof raw === "object" && raw.groups && typeof raw.groups === "object"){
      return raw;
    }

    // Migração de formato antigo: { "grupo@g.us": [jids...] }
    if(raw && typeof raw === "object" && !Array.isArray(raw)){
      return {groups: raw};
    }

    return {groups:{}};
  }catch{
    return {groups:{}};
  }
}

function writeDb(db){
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function groupEntries(db, groupJid){
  const key = normalizeGroup(groupJid);
  const groups = db.groups || {};
  const direct = groups[key] ?? groups[groupJid];

  if(Array.isArray(direct)) return direct;

  // Compatibilidade com formatos em objeto.
  if(direct && typeof direct === "object"){
    return Object.entries(direct)
      .filter(([,enabled]) => enabled !== false && enabled != null)
      .map(([jid]) => jid);
  }

  return [];
}

export function getWhitelist(groupJid){
  const db = readDb();
  return [...new Set(groupEntries(db, groupJid).map(normalizeUser).filter(Boolean))];
}

export function isWhitelisted(groupJid, userJid){
  if(!groupJid || !userJid) return false;
  return getWhitelist(groupJid).some(saved => sameUser(saved, userJid));
}

export function addWhitelist(groupJid, userJid){
  const db = readDb();
  const group = normalizeGroup(groupJid);
  const user = normalizeUser(userJid);
  if(!group || !user) return false;

  const current = groupEntries(db, group);
  if(current.some(saved => sameUser(saved, user))) return false;

  db.groups ||= {};
  db.groups[group] = [...current, user];
  writeDb(db);
  return true;
}

export function removeWhitelist(groupJid, userJid){
  const db = readDb();
  const group = normalizeGroup(groupJid);
  const current = groupEntries(db, group);
  const filtered = current.filter(saved => !sameUser(saved, userJid));

  if(filtered.length === current.length) return false;

  db.groups ||= {};
  db.groups[group] = filtered;
  writeDb(db);
  return true;
}

export function getWhitelistDbPath(){
  return DB_PATH;
}
