/* Kobayashi Protected Distribution v4.0.3 */
import fs from "fs";
import path from "\x70\x61\x74\x68";
import os from "os";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x67\x6c\x6f\x62\x61\x6c\x2d\x73\x74\x61\x74\x73\x2e\x6a\x73\x6f\x6e");
const ERROR_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x67\x6c\x6f\x62\x61\x6c\x2d\x65\x72\x72\x6f\x72\x73\x2e\x6a\x73\x6f\x6e");

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const parsed = JSON.parse(fs.readFileSync(file, "\x75\x74\x66\x38"));
    return parsed && typeof parsed === "\x6f\x62\x6a\x65\x63\x74" ? parsed : fallback;
  } catch { return fallback; }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, file);
}
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function ensureDb() {
  const db = readJson(DB_FILE, { startedAt: Date.now(), commandsTotal: 0, messagesTotal: 0, commands: {}, users: {}, groups: {}, days: {} });
  db.commands ||= {}; db.users ||= {}; db.groups ||= {}; db.days ||= {};
  return db;
}
export function trackGlobalUsage({ from, sender, command, isGroup }) {
  try {
    const db = ensureDb();
    db.messagesTotal = Number(db.messagesTotal || 0) + 1;
    const day = todayKey(); db.days[day] ||= { messages: 0, commands: 0 }; db.days[day].messages++;
    if (sender) { db.users[sender] ||= { messages:0, commands:0, lastSeen:0 }; db.users[sender].messages++; db.users[sender].lastSeen=Date.now(); }
    if (isGroup && from) { db.groups[from] ||= { messages:0, commands:0, lastSeen:0 }; db.groups[from].messages++; db.groups[from].lastSeen=Date.now(); }
    if (command) {
      db.commandsTotal = Number(db.commandsTotal || 0) + 1; db.days[day].commands++; db.commands[command] = Number(db.commands[command] || 0) + 1;
      if (sender) db.users[sender].commands++; if (isGroup && from) db.groups[from].commands++;
    }
    writeJson(DB_FILE, db);
  } catch (e) { console.error("\x5b\x47\x4c\x4f\x42\x41\x4c\x2d\x53\x54\x41\x54\x53\x5d", e?.message || e); }
}
export function recordGlobalError(error, context={}) {
  try {
    const list=readJson(ERROR_FILE,[]); list.unshift({at:Date.now(),message:String(error?.message||error||"\x45\x72\x72\x6f\x20\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f"),stack:String(error?.stack||"").slice(0,1500),command:context.command||null,from:context.from||null,sender:context.sender||null});
    writeJson(ERROR_FILE,list.slice(0,200));
  } catch {}
}
export function getRecentErrors(limit=10){ return readJson(ERROR_FILE,[]).slice(0,Math.max(1,Math.min(50,limit))); }
function fmtUptime(sec){sec=Math.floor(Number(sec)||0);const d=Math.floor(sec/86400);sec%=86400;const h=Math.floor(sec/3600);sec%=3600;const m=Math.floor(sec/60);const s=sec%60;return `${d}d ${h}h ${m}m ${s}s`;}
function fmtDate(ts){try{return new Date(ts).toLocaleString("\x70\x74\x2d\x42\x52",{timeZone:"\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f"});}catch{return new Date(ts).toISOString();}}
function fmtMB(bytes){return `${(Number(bytes||0)/1024/1024).toFixed(1)} MB`;}
async function fetchGroups(conn){try{return await conn.groupFetchAllParticipating();}catch{return {};}}
function rentalSummary(){
  const files=[path.join(process.cwd(),"\x66\x69\x6c\x65\x73","\x64\x61\x74\x61\x62\x61\x73\x65","\x61\x6c\x75\x67\x75\x65\x69\x73\x2e\x6a\x73\x6f\x6e"),path.join(process.cwd(),"\x66\x69\x6c\x65\x73","\x64\x61\x74\x61\x62\x61\x73\x65","\x72\x65\x6e\x74\x61\x6c\x73\x2e\x6a\x73\x6f\x6e")];
  for(const file of files){if(!fs.existsSync(file))continue;const raw=readJson(file,{});if(Array.isArray(raw))return raw;if(Array.isArray(raw?.rentals))return raw.rentals;if(raw&&typeof raw==="\x6f\x62\x6a\x65\x63\x74")return Object.entries(raw).map(([jid,v])=>({jid,...(v||{})}));}
  return [];
}
const rentalJid=r=>r?.jid||r?.groupJid||r?.group||r?.id||null;
const rentalExp=r=>Number(r?.expiresAt||r?.expires||r?.expiration||r?.expiraEm||r?.fim||0)||0;
const rentalPerm=r=>Boolean(r?.permanent||r?.isPermanent||r?.permanente);
const rentalResp=r=>r?.responsibleJid||r?.responsible||r?.responsavel||null;
const topCommands=(db,n=10)=>Object.entries(db.commands||{}).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,n);
const topGroups=(db,n=10)=>Object.entries(db.groups||{}).sort((a,b)=>Number(b[1]?.commands||0)-Number(a[1]?.commands||0)).slice(0,n);

export const GLOBAL_MANAGEMENT_COMMANDS=["\x67\x72\x75\x70\x6f\x73","\x67\x72\x75\x70\x6f","\x63\x6c\x69\x65\x6e\x74\x65\x73","\x61\x6c\x75\x67\x75\x65\x69\x73","\x73\x74\x61\x74\x75\x73\x67\x6c\x6f\x62\x61\x6c","\x65\x73\x74\x61\x74\x69\x73\x74\x69\x63\x61\x73","\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x6d\x61\x69\x73\x75\x73\x61\x64\x6f\x73","\x65\x72\x72\x6f\x73","\x61\x74\x69\x76\x69\x64\x61\x64\x65\x67\x70","\x69\x6e\x66\x6f\x67\x72\x75\x70\x6f"];
export function getGlobalManagementHelp(command=""){
  const m={grupos:"\x6c\x69\x73\x74\x61\x20\x74\x6f\x64\x6f\x73\x20\x6f\x73\x20\x67\x72\x75\x70\x6f\x73\x20\x64\x61\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",grupo:"\x6d\x6f\x73\x74\x72\x61\x20\x64\x65\x74\x61\x6c\x68\x65\x73\x20\x64\x65\x20\x75\x6d\x20\x67\x72\x75\x70\x6f\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",clientes:"\x6c\x69\x73\x74\x61\x20\x6f\x73\x20\x63\x6c\x69\x65\x6e\x74\x65\x73\x2f\x61\x6c\x75\x67\x75\x65\x69\x73\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x73\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",alugueis:"\x6d\x6f\x73\x74\x72\x61\x20\x6f\x20\x72\x65\x73\x75\x6d\x6f\x20\x64\x6f\x73\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",statusglobal:"\x6d\x6f\x73\x74\x72\x61\x20\x6f\x20\x73\x74\x61\x74\x75\x73\x20\x67\x65\x72\x61\x6c\x20\x64\x61\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",estatisticas:"\x6d\x6f\x73\x74\x72\x61\x20\x65\x73\x74\x61\x74\xed\x73\x74\x69\x63\x61\x73\x20\x67\x6c\x6f\x62\x61\x69\x73\x20\x64\x65\x20\x75\x73\x6f\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",comandosmaisusados:"\x6d\x6f\x73\x74\x72\x61\x20\x6f\x20\x72\x61\x6e\x6b\x69\x6e\x67\x20\x64\x6f\x73\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x6d\x61\x69\x73\x20\x75\x73\x61\x64\x6f\x73\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",erros:"\x6d\x6f\x73\x74\x72\x61\x20\x6f\x73\x20\x65\x72\x72\x6f\x73\x20\x72\x65\x63\x65\x6e\x74\x65\x73\x3b\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e",atividadegp:"\x6d\x6f\x73\x74\x72\x61\x20\x61\x20\x61\x74\x69\x76\x69\x64\x61\x64\x65\x20\x72\x61\x73\x74\x72\x65\x61\x64\x61\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e",infogrupo:"\x6d\x6f\x73\x74\x72\x61\x20\x69\x6e\x66\x6f\x72\x6d\x61\xe7\xf5\x65\x73\x20\x67\x65\x72\x61\x69\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e"};
  return m[String(command||"").toLowerCase()]||null;
}
export async function runGlobalManagementCommand(command,ctx){
  const c=String(command||"").toLowerCase(); if(!GLOBAL_MANAGEMENT_COMMANDS.includes(c))return false;
  const {conn,from,q="",args=[],prefix="/",reply,isGroup,groupName,groupMembers=[],permissions={},isMainOwner=false,isOwner=false,isLeader=false}=ctx;
  // Usa diretamente a validação SoDonoPrincipal já confirmada pelo núcleo.
  const owner=Boolean(isMainOwner);
  if(["\x67\x72\x75\x70\x6f\x73","\x67\x72\x75\x70\x6f","\x63\x6c\x69\x65\x6e\x74\x65\x73","\x61\x6c\x75\x67\x75\x65\x69\x73","\x73\x74\x61\x74\x75\x73\x67\x6c\x6f\x62\x61\x6c","\x65\x73\x74\x61\x74\x69\x73\x74\x69\x63\x61\x73","\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x6d\x61\x69\x73\x75\x73\x61\x64\x6f\x73","\x65\x72\x72\x6f\x73"].includes(c)&&!owner){await reply("\ud83d\x20\x45\x73\x74\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\xe9\x20\x65\x78\x63\x6c\x75\x73\x69\x76\x6f\x20\x64\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x2e");return true;}
  if(c==="\x67\x72\x75\x70\x6f\x73"){
    const groups=await fetchGroups(conn),entries=Object.entries(groups||{});if(!entries.length){await reply("\ud83d\x20\x41\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x6e\xe3\x6f\x20\x65\x73\x74\xe1\x20\x65\x6d\x20\x6e\x65\x6e\x68\x75\x6d\x20\x67\x72\x75\x70\x6f\x2e");return true;}
    const rows=entries.map(([jid,m],i)=>`${i+1}. *${m?.subject||"\x53\x65\x6d\x20\x6e\x6f\x6d\x65"}*\n   👥 ${Array.isArray(m?.participants)?m.participants.length:"?"} membros\n   🆔 ${jid}`);
    await reply(`🏘️🐉 *GRUPOS DA KOBAYASHI* (${entries.length})\n\n${rows.join("\n\n")}\n\nUse *${prefix}grupo número* para ver detalhes.`);return true;
  }
  if(c==="\x67\x72\x75\x70\x6f"){
    const entries=Object.entries(await fetchGroups(conn)||{});if(!entries.length){await reply("\ud83d\x20\x4e\x65\x6e\x68\x75\x6d\x20\x67\x72\x75\x70\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x6f\x2e");return true;}
    const sel=String(q||"").trim();if(!sel){await reply(`Use *${prefix}grupo número*, JID ou parte do nome.`);return true;}
    let found=null;if(/^\d+$/.test(sel)){found=entries[Number(sel)-1]||null;}else if(sel.endsWith("\x40\x67\x2e\x75\x73")){found=entries.find(([jid])=>jid===sel)||null;}else{found=entries.find(([,m])=>String(m?.subject||"").toLowerCase().includes(sel.toLowerCase()))||null;}
    if(!found){await reply("\u274c\x20\x47\x72\x75\x70\x6f\x20\x6e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x6f\x2e");return true;}const [jid,m]=found;const parts=Array.isArray(m?.participants)?m.participants:[];const admins=parts.filter(p=>p?.admin==="\x61\x64\x6d\x69\x6e"||p?.admin==="\x73\x75\x70\x65\x72\x61\x64\x6d\x69\x6e");const db=ensureDb();const st=db.groups?.[jid]||{};const rentals=rentalSummary();const rent=rentals.find(r=>rentalJid(r)===jid);let rs="\x4e\xe3\x6f\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f";if(rent){rs=rentalPerm(rent)?"\x50\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65":rentalExp(rent)?`Até ${fmtDate(rentalExp(rent))}`:"\x52\x65\x67\x69\x73\x74\x72\x61\x64\x6f";}
    await reply(`🏘️🐉 *DETALHES DO GRUPO*\n\n📛 Nome: *${m?.subject||"\x53\x65\x6d\x20\x6e\x6f\x6d\x65"}*\n🆔 JID: ${jid}\n👥 Membros: *${parts.length}*\n🛡️ ADMs: *${admins.length}*\n📨 Mensagens rastreadas: *${Number(st.messages||0)}*\n⌨️ Comandos usados: *${Number(st.commands||0)}*\n💰 Aluguel: *${rs}*`);return true;
  }
  if(c==="\x63\x6c\x69\x65\x6e\x74\x65\x73"||c==="\x61\x6c\x75\x67\x75\x65\x69\x73"){
    const rentals=rentalSummary();if(!rentals.length){await reply("\ud83d\x20\x4e\x65\x6e\x68\x75\x6d\x20\x61\x6c\x75\x67\x75\x65\x6c\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x20\x66\x6f\x69\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x6f\x2e");return true;}const groups=await fetchGroups(conn);const now=Date.now();const rows=rentals.map((r,i)=>{const jid=rentalJid(r),m=jid?groups?.[jid]:null,perm=rentalPerm(r),exp=rentalExp(r),expired=!perm&&exp>0&&exp<=now,status=perm?"\u267e\ufe0f\x20\x50\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65":expired?"\u274c\x20\x45\x78\x70\x69\x72\x61\x64\x6f":exp?`✅ ${fmtDate(exp)}`:"\u2705\x20\x41\x74\x69\x76\x6f",resp=rentalResp(r);return `${i+1}. *${m?.subject||r?.name||jid||"\x43\x6c\x69\x65\x6e\x74\x65"}*\n   💳 ${status}\n${resp?`   👤 Responsável: ${resp}\n`:""}${jid?`   🆔 ${jid}`:""}`;});const active=rentals.filter(r=>rentalPerm(r)||!rentalExp(r)||rentalExp(r)>now).length;
    await reply(`💰🐉 *${c==="\x63\x6c\x69\x65\x6e\x74\x65\x73"?"\x43\x4c\x49\x45\x4e\x54\x45\x53":"\x41\x4c\x55\x47\x55\xc9\x49\x53"}*\n\n✅ Ativos: *${active}*\n❌ Expirados: *${rentals.length-active}*\n📦 Total: *${rentals.length}*\n\n${rows.join("\n\n")}`);return true;
  }
  if(c==="\x73\x74\x61\x74\x75\x73\x67\x6c\x6f\x62\x61\x6c"){
    const groups=await fetchGroups(conn),db=ensureDb(),mem=process.memoryUsage(),load=os.loadavg?.()||[0,0,0];await reply(`🐉📡 *STATUS GLOBAL DA KOBAYASHI*\n\n🟢 Processo: *ONLINE*\n⏱️ Uptime: *${fmtUptime(process.uptime())}*\n🏘️ Grupos: *${Object.keys(groups||{}).length}*\n👤 Usuários rastreados: *${Object.keys(db.users||{}).length}*\n⌨️ Comandos executados: *${Number(db.commandsTotal||0)}*\n📨 Mensagens rastreadas: *${Number(db.messagesTotal||0)}*\n\n🧠 RAM RSS: *${fmtMB(mem.rss)}*\n📦 Heap: *${fmtMB(mem.heapUsed)} / ${fmtMB(mem.heapTotal)}*\n⚙️ Node: *${process.version}*\n💻 Plataforma: *${process.platform} ${process.arch}*\n📊 Load: *${load.map(v=>Number(v).toFixed(2)).join("\x20\x2f\x20")}*`);return true;
  }
  if(c==="\x65\x73\x74\x61\x74\x69\x73\x74\x69\x63\x61\x73"){
    const db=ensureDb(),top=topCommands(db,5),groups=topGroups(db,5),today=db.days?.[todayKey()]||{messages:0,commands:0};await reply(`📊🐉 *ESTATÍSTICAS GLOBAIS*\n\n📨 Mensagens rastreadas: *${Number(db.messagesTotal||0)}*\n⌨️ Comandos executados: *${Number(db.commandsTotal||0)}*\n👤 Usuários únicos: *${Object.keys(db.users||{}).length}*\n🏘️ Grupos rastreados: *${Object.keys(db.groups||{}).length}*\n\n📅 *Hoje*\n├ Mensagens: *${Number(today.messages||0)}*\n└ Comandos: *${Number(today.commands||0)}*\n\n🏆 *Top comandos*\n${top.length?top.map(([cmd,n],i)=>`${i+1}. /${cmd} — ${n}`).join("\n"):"\x53\x65\x6d\x20\x64\x61\x64\x6f\x73\x20\x61\x69\x6e\x64\x61\x2e"}\n\n🔥 *Grupos mais ativos*\n${groups.length?groups.map(([jid,s],i)=>`${i+1}. ${jid} — ${Number(s?.commands||0)} comandos`).join("\n"):"\x53\x65\x6d\x20\x64\x61\x64\x6f\x73\x20\x61\x69\x6e\x64\x61\x2e"}`);return true;
  }
  if(c==="\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x6d\x61\x69\x73\x75\x73\x61\x64\x6f\x73"){
    const top=topCommands(ensureDb(),20);await reply(`🏆⌨️ *COMANDOS MAIS USADOS*\n\n${top.length?top.map(([cmd,n],i)=>`${i+1}. *${prefix}${cmd}* — ${n} usos`).join("\n"):"\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x68\xe1\x20\x64\x61\x64\x6f\x73\x20\x73\x75\x66\x69\x63\x69\x65\x6e\x74\x65\x73\x2e"}`);return true;
  }
  if(c==="\x65\x72\x72\x6f\x73"){
    const errors=getRecentErrors(Number(args[0])||10);if(!errors.length){await reply("\u2705\x20\x4e\x65\x6e\x68\x75\x6d\x20\x65\x72\x72\x6f\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x20\x72\x65\x63\x65\x6e\x74\x65\x6d\x65\x6e\x74\x65\x2e");return true;}await reply(`🚨🐉 *ERROS RECENTES* (${errors.length})\n\n${errors.map((e,i)=>`${i+1}. *${fmtDate(e.at)}*\n   ${String(e.message||"\x45\x72\x72\x6f").slice(0,180)}${e.command?`\n   Comando: /${e.command}`:""}`).join("\n\n")}`);return true;
  }
  if(c==="\x61\x74\x69\x76\x69\x64\x61\x64\x65\x67\x70"){
    if(!isGroup){await reply("\ud83d\x20\x55\x73\x65\x20\x65\x73\x74\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x65\x6d\x20\x75\x6d\x20\x67\x72\x75\x70\x6f\x2e");return true;}const s=ensureDb().groups?.[from]||{};await reply(`🔥🐉 *ATIVIDADE DO GRUPO*\n\n📛 Grupo: *${groupName||"\x47\x72\x75\x70\x6f"}*\n👥 Membros atuais: *${groupMembers.length}*\n📨 Mensagens rastreadas: *${Number(s.messages||0)}*\n⌨️ Comandos usados: *${Number(s.commands||0)}*\n🕒 Última atividade: *${s.lastSeen?fmtDate(s.lastSeen):"\x53\x65\x6d\x20\x64\x61\x64\x6f\x73"}*`);return true;
  }
  if(c==="\x69\x6e\x66\x6f\x67\x72\x75\x70\x6f"){
    if(!isGroup){await reply("\ud83d\x20\x55\x73\x65\x20\x65\x73\x74\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x65\x6d\x20\x75\x6d\x20\x67\x72\x75\x70\x6f\x2e");return true;}let m=null;try{m=await conn.groupMetadata(from);}catch{}const parts=m?.participants||groupMembers||[];const admins=parts.filter(p=>p?.admin==="\x61\x64\x6d\x69\x6e"||p?.admin==="\x73\x75\x70\x65\x72\x61\x64\x6d\x69\x6e");await reply(`🏘️🐉 *INFO DO GRUPO*\n\n📛 Nome: *${m?.subject||groupName||"\x47\x72\x75\x70\x6f"}*\n🆔 ID: ${from}\n👥 Membros: *${parts.length}*\n🛡️ ADMs: *${admins.length}*\n📝 Descrição:\n${m?.desc||"\x53\x65\x6d\x20\x64\x65\x73\x63\x72\x69\xe7\xe3\x6f\x2e"}`);return true;
  }
  return false;
}
