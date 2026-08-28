import fs from 'fs';
import path from 'path';

const DB = path.join(process.cwd(), 'files', 'database', 'admin-pro.json');

function ensureDb() {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({ groups: {} }, null, 2));
}
function readDb() {
  ensureDb();
  try {
    const d = JSON.parse(fs.readFileSync(DB, 'utf8'));
    if (!d.groups || typeof d.groups !== 'object') d.groups = {};
    return d;
  } catch { return { groups: {} }; }
}
function writeDb(db) { ensureDb(); fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }
function group(db, jid) {
  if (!db.groups[jid]) db.groups[jid] = { rules: '', notes: [], blacklist: [] };
  if (!Array.isArray(db.groups[jid].notes)) db.groups[jid].notes = [];
  if (!Array.isArray(db.groups[jid].blacklist)) db.groups[jid].blacklist = [];
  return db.groups[jid];
}

export function getRules(jid) { const db=readDb(); return group(db,jid).rules || ''; }
export function setRules(jid, text, by) { const db=readDb(); const g=group(db,jid); g.rules=String(text||'').trim(); g.rulesUpdatedAt=new Date().toISOString(); g.rulesUpdatedBy=by||null; writeDb(db); return g.rules; }
export function clearRules(jid) { const db=readDb(); const g=group(db,jid); g.rules=''; g.rulesUpdatedAt=new Date().toISOString(); writeDb(db); }

export function listNotes(jid) { const db=readDb(); return [...group(db,jid).notes]; }
export function addNote(jid, text, by) {
  const db=readDb(); const g=group(db,jid);
  const next=(g.notes.reduce((m,n)=>Math.max(m,Number(n.id)||0),0)+1);
  const note={ id:next, text:String(text||'').trim(), by:by||null, at:new Date().toISOString() };
  g.notes.push(note); if (g.notes.length>100) g.notes=g.notes.slice(-100); writeDb(db); return note;
}
export function removeNote(jid, id) { const db=readDb(); const g=group(db,jid); const before=g.notes.length; g.notes=g.notes.filter(n=>Number(n.id)!==Number(id)); writeDb(db); return before!==g.notes.length; }
export function clearNotes(jid) { const db=readDb(); const g=group(db,jid); const count=g.notes.length; g.notes=[]; writeDb(db); return count; }

export function getBlacklist(jid) { const db=readDb(); return [...group(db,jid).blacklist]; }
export function isBlacklisted(jid, user) { return getBlacklist(jid).includes(user); }
export function addBlacklist(jid, user, by, reason='') {
  const db=readDb(); const g=group(db,jid); if (!g.blacklist.includes(user)) g.blacklist.push(user);
  if (!g.blacklistMeta) g.blacklistMeta={}; g.blacklistMeta[user]={ by:by||null, reason:String(reason||'').trim(), at:new Date().toISOString() };
  writeDb(db); return true;
}
export function removeBlacklist(jid, user) { const db=readDb(); const g=group(db,jid); const before=g.blacklist.length; g.blacklist=g.blacklist.filter(x=>x!==user); if(g.blacklistMeta) delete g.blacklistMeta[user]; writeDb(db); return before!==g.blacklist.length; }
export function getBlacklistMeta(jid, user) { const db=readDb(); return group(db,jid).blacklistMeta?.[user] || null; }
