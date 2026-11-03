import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "files", "database", "lista-negra-global.json");

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2), "utf8");
  }
}

function readDb() {
  ensureDb();
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  if (!data || typeof data.users !== 'object' || Array.isArray(data.users) || data.users === null) throw Error('Banco global inválido; nenhum registro foi sobrescrito.');
  return data;
}
function writeDb(db) {
  ensureDb();
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
}

export function normalizeBlacklistJid(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^\d+(?::\d+)?@(s\.whatsapp\.net|lid)$/.test(raw)) return raw.replace(/:\d+(?=@)/, "");
  if (raw.includes('@')) return null;
  const digits = raw.replace(/\D/g, "");
  return digits ? `${digits}@s.whatsapp.net` : null;
}

export function isGloballyBlacklisted(jid, groupJid = null) {
  const target = normalizeBlacklistJid(jid);
  if (!target) return false;
  const entry = Object.values(readDb().users).find(e => e.jid === target || e.aliases?.includes(target));
  if (!entry) return false;
  return Array.isArray(entry.groupJids) ? entry.groupJids.includes(groupJid) : true;
}

export function addGlobalBlacklistBatch(items) {
  const db=readDb(), saved=[];
  for(const {jid,reason='Sem motivo informado',by=null,groupJids,aliases=[]} of items){
    const target=normalizeBlacklistJid(jid);if(!target)throw Error('Identidade inválida para lista negra.');
    const previous=Object.values(db.users).find(e=>e.jid===target||e.aliases?.includes(target));
    const key=previous?.jid||target;
    const scope=previous&&!Array.isArray(previous.groupJids)?undefined:Array.isArray(groupJids)?[...new Set([...(previous?.groupJids||[]),...groupJids].filter(x=>typeof x==='string'&&x.endsWith('@g.us')))]:undefined;
    const entry={...previous,jid:key,reason:String(reason),by,addedAt:previous?.addedAt||new Date().toISOString(),aliases:[...new Set([key,target,...(previous?.aliases||[]),...aliases].map(normalizeBlacklistJid).filter(Boolean))]};
    if(scope)entry.groupJids=scope;else delete entry.groupJids;
    db.users[key]=entry;saved.push(entry);
  }
  writeDb(db);return saved;
}
export function addGlobalBlacklist(jid, options={}) { return addGlobalBlacklistBatch([{jid,...options}])[0]||null; }

export function removeGlobalBlacklist(jid) {
  const target = normalizeBlacklistJid(jid);
  if (!target) return false;
  const db = readDb();
  const key=Object.keys(db.users).find(key=>key===target||db.users[key].aliases?.includes(target));
  if (!key) return false;
  delete db.users[key];
  writeDb(db);
  return true;
}

export function getGlobalBlacklistEntry(jid) {
  const target = normalizeBlacklistJid(jid);
  return target ? Object.values(readDb().users).find(e=>e.jid===target||e.aliases?.includes(target)) || null : null;
}

export function listGlobalBlacklist() {
  return Object.values(readDb().users)
    .sort((a, b) => String(b.addedAt || "").localeCompare(String(a.addedAt || "")));
}
