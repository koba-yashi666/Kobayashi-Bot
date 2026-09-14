/* Kobayashi Protected Distribution v4.0.3 */
import fs from "fs";
import path from "\x70\x61\x74\x68";

const DB = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2d\x68\x69\x73\x74\x6f\x72\x79\x2e\x6a\x73\x6f\x6e");
const MAX_PER_USER = 200;

function readDb() {
  try {
    fs.mkdirSync(path.dirname(DB), { recursive: true });
    if (!fs.existsSync(DB)) fs.writeFileSync(DB, "{}", "\x75\x74\x66\x38");
    const parsed = JSON.parse(fs.readFileSync(DB, "\x75\x74\x66\x38"));
    return parsed && typeof parsed === "\x6f\x62\x6a\x65\x63\x74" ? parsed : {};
  } catch { return {}; }
}
function writeDb(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  const tmp = `${DB}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, DB);
}
function normalizeEntry(entry={}) {
  return {
    type: String(entry.type || "\x61\x63\x61\x6f"),
    reason: String(entry.reason || "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f"),
    by: String(entry.by || "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69"),
    source: String(entry.source || "\x6d\x61\x6e\x75\x61\x6c"),
    at: entry.at || new Date().toISOString(),
    meta: entry.meta && typeof entry.meta === "\x6f\x62\x6a\x65\x63\x74" ? entry.meta : {}
  };
}
export function addPunishmentHistory(groupJid, userJid, entry={}) {
  if (!groupJid || !userJid) return null;
  const db=readDb();
  if (!db[groupJid]) db[groupJid]={};
  if (!Array.isArray(db[groupJid][userJid])) db[groupJid][userJid]=[];
  const row=normalizeEntry(entry);
  db[groupJid][userJid].push(row);
  if(db[groupJid][userJid].length>MAX_PER_USER){
    db[groupJid][userJid]=db[groupJid][userJid].slice(-MAX_PER_USER);
  }
  writeDb(db);
  return row;
}
export function getPunishmentHistory(groupJid,userJid,limit=20){
  const rows=readDb()?.[groupJid]?.[userJid];
  if(!Array.isArray(rows)) return [];
  return rows.slice(-Math.max(1,Math.min(100,Number(limit)||20))).reverse();
}
export function clearPunishmentHistory(groupJid,userJid){
  const db=readDb();
  const rows=db?.[groupJid]?.[userJid];
  const count=Array.isArray(rows)?rows.length:0;
  if(db?.[groupJid]?.[userJid]){
    delete db[groupJid][userJid];
    if(Object.keys(db[groupJid]||{}).length===0) delete db[groupJid];
    writeDb(db);
  }
  return count;
}
export function getRecidivismSummary(groupJid,userJid,days=30){
  const rows=readDb()?.[groupJid]?.[userJid];
  const cutoff=Date.now()-(Math.max(1,days)*86400000);
  const recent=(Array.isArray(rows)?rows:[]).filter(x=>{
    const ts=Date.parse(x?.at||"");
    return Number.isFinite(ts)&&ts>=cutoff &&
      !["\x72\x6d\x61\x64\x76","\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x5f\x72\x65\x6d\x6f\x76\x65"].includes(String(x?.type||""));
  });
  const counts={};
  for(const r of recent) counts[r.type]=(counts[r.type]||0)+1;
  return {days,total:recent.length,counts,recidivist:recent.length>=3};
}
function label(type){
  return ({
    adv:"\u26a0\ufe0f\x20\x41\x44\x56", adv_auto:"\ud83e\x20\x41\x44\x56\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x61", ban:"\ud83d\x20\x42\x61\x6e",
    ban_auto:"\ud83e\x20\x42\x61\x6e\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x6f", rmadv:"\u267b\ufe0f\x20\x41\x44\x56\x20\x72\x65\x6d\x6f\x76\x69\x64\x61",
    blacklist_add:"\u26d4\x20\x4c\x69\x73\x74\x61\x20\x6e\x65\x67\x72\x61", blacklist_remove:"\u2705\x20\x53\x61\x69\x75\x20\x64\x61\x20\x6c\x69\x73\x74\x61\x20\x6e\x65\x67\x72\x61"
  })[type] || `🛡️ ${type}`;
}
function formatDate(iso){
  try{return new Intl.DateTimeFormat("\x70\x74\x2d\x42\x52",{timeZone:"\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f",day:"\x32\x2d\x64\x69\x67\x69\x74",month:"\x32\x2d\x64\x69\x67\x69\x74",year:"\x32\x2d\x64\x69\x67\x69\x74",hour:"\x32\x2d\x64\x69\x67\x69\x74",minute:"\x32\x2d\x64\x69\x67\x69\x74"}).format(new Date(iso));}
  catch{return String(iso||"");}
}
export function formatPunishmentHistory(userJid,rows=[],recid={days:30,total:0,recidivist:false}){
  const tag=`@${String(userJid||"").split("@")[0]}`;
  if(!rows.length){
    return `╭─〔 🛡️ MODERAÇÃO PRO 〕\n│ 👤 Usuário › ${tag}\n│ 📚 Nenhuma punição registrada.\n╰────────────────`;
  }
  const lines=rows.map((r,i)=>
    `${i+1}. ${label(r.type)} • ${formatDate(r.at)}\n   📋 ${r.reason}\n   🛡️ Por: ${r.by==="\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x41\x75\x74\x6f\x4d\x6f\x64"?"\x41\x75\x74\x6f\x4d\x6f\x64":`@${String(r.by).split("@")[0]}`}`
  ).join("\n\n");
  return `╭─〔 🛡️ HISTÓRICO DE MODERAÇÃO 〕\n`+
    `│ 👤 Usuário › ${tag}\n`+
    `│ 📅 Últimos ${recid.days} dias › ${recid.total} ocorrência(s)\n`+
    `│ 🔁 Reincidência › ${recid.recidivist?"\u26a0\ufe0f\x20\x53\x49\x4d":"\u2705\x20\x4e\xe3\x6f"}\n`+
    `╰────────────────\n\n${lines}`;
}
