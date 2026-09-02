import fs from "fs";
import path from "path";

const DB = path.join(process.cwd(), "files", "database", "moderation-history.json");
const MAX_PER_USER = 200;

function readDb() {
  try {
    fs.mkdirSync(path.dirname(DB), { recursive: true });
    if (!fs.existsSync(DB)) fs.writeFileSync(DB, "{}", "utf8");
    const parsed = JSON.parse(fs.readFileSync(DB, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch { return {}; }
}
function writeDb(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  const tmp = `${DB}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB);
}
function normalizeEntry(entry={}) {
  return {
    type: String(entry.type || "acao"),
    reason: String(entry.reason || "Sem motivo"),
    by: String(entry.by || "Kobayashi"),
    source: String(entry.source || "manual"),
    at: entry.at || new Date().toISOString(),
    meta: entry.meta && typeof entry.meta === "object" ? entry.meta : {}
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
      !["rmadv","blacklist_remove"].includes(String(x?.type||""));
  });
  const counts={};
  for(const r of recent) counts[r.type]=(counts[r.type]||0)+1;
  return {days,total:recent.length,counts,recidivist:recent.length>=3};
}
function label(type){
  return ({
    adv:"⚠️ ADV", adv_auto:"🤖 ADV automática", ban:"🔨 Ban",
    ban_auto:"🤖 Ban automático", rmadv:"♻️ ADV removida",
    blacklist_add:"⛔ Lista negra", blacklist_remove:"✅ Saiu da lista negra"
  })[type] || `🛡️ ${type}`;
}
function formatDate(iso){
  try{return new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(iso));}
  catch{return String(iso||"");}
}
export function formatPunishmentHistory(userJid,rows=[],recid={days:30,total:0,recidivist:false}){
  const tag=`@${String(userJid||"").split("@")[0]}`;
  if(!rows.length){
    return `╭─〔 🛡️ MODERAÇÃO PRO 〕\n│ 👤 Usuário › ${tag}\n│ 📚 Nenhuma punição registrada.\n╰────────────────`;
  }
  const lines=rows.map((r,i)=>
    `${i+1}. ${label(r.type)} • ${formatDate(r.at)}\n   📋 ${r.reason}\n   🛡️ Por: ${r.by==="Kobayashi AutoMod"?"AutoMod":`@${String(r.by).split("@")[0]}`}`
  ).join("\n\n");
  return `╭─〔 🛡️ HISTÓRICO DE MODERAÇÃO 〕\n`+
    `│ 👤 Usuário › ${tag}\n`+
    `│ 📅 Últimos ${recid.days} dias › ${recid.total} ocorrência(s)\n`+
    `│ 🔁 Reincidência › ${recid.recidivist?"⚠️ SIM":"✅ Não"}\n`+
    `╰────────────────\n\n${lines}`;
}
