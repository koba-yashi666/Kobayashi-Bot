import fs from "fs";
import path from "path";
import os from "os";

const DB_FILE = path.join(process.cwd(), "files", "database", "global-stats.json");
const ERROR_FILE = path.join(process.cwd(), "files", "database", "global-errors.json");

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch { return fallback; }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
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
  } catch (e) { console.error("[GLOBAL-STATS]", e?.message || e); }
}
export function recordGlobalError(error, context={}) {
  try {
    const list=readJson(ERROR_FILE,[]); list.unshift({at:Date.now(),message:String(error?.message||error||"Erro desconhecido"),stack:String(error?.stack||"").slice(0,1500),command:context.command||null,from:context.from||null,sender:context.sender||null});
    writeJson(ERROR_FILE,list.slice(0,200));
  } catch {}
}
export function getRecentErrors(limit=10){ return readJson(ERROR_FILE,[]).slice(0,Math.max(1,Math.min(50,limit))); }
function fmtUptime(sec){sec=Math.floor(Number(sec)||0);const d=Math.floor(sec/86400);sec%=86400;const h=Math.floor(sec/3600);sec%=3600;const m=Math.floor(sec/60);const s=sec%60;return `${d}d ${h}h ${m}m ${s}s`;}
function fmtDate(ts){try{return new Date(ts).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"});}catch{return new Date(ts).toISOString();}}
function fmtMB(bytes){return `${(Number(bytes||0)/1024/1024).toFixed(1)} MB`;}
async function fetchGroups(conn){try{return await conn.groupFetchAllParticipating();}catch{return {};}}
function rentalSummary(){
  const files=[path.join(process.cwd(),"files","database","alugueis.json"),path.join(process.cwd(),"files","database","rentals.json")];
  for(const file of files){if(!fs.existsSync(file))continue;const raw=readJson(file,{});if(Array.isArray(raw))return raw;if(Array.isArray(raw?.rentals))return raw.rentals;if(raw&&typeof raw==="object")return Object.entries(raw).map(([jid,v])=>({jid,...(v||{})}));}
  return [];
}
const rentalJid=r=>r?.jid||r?.groupJid||r?.group||r?.id||null;
const rentalExp=r=>Number(r?.expiresAt||r?.expires||r?.expiration||r?.expiraEm||r?.fim||0)||0;
const rentalPerm=r=>Boolean(r?.permanent||r?.isPermanent||r?.permanente);
const rentalResp=r=>r?.responsibleJid||r?.responsible||r?.responsavel||null;
const topCommands=(db,n=10)=>Object.entries(db.commands||{}).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,n);
const topGroups=(db,n=10)=>Object.entries(db.groups||{}).sort((a,b)=>Number(b[1]?.commands||0)-Number(a[1]?.commands||0)).slice(0,n);

export const GLOBAL_MANAGEMENT_COMMANDS=["grupos","grupo","clientes","alugueis","statusglobal","estatisticas","comandosmaisusados","erros","atividadegp","infogrupo"];
export function getGlobalManagementHelp(command=""){
  const m={grupos:"lista todos os grupos da Kobayashi; exclusivo do dono.",grupo:"mostra detalhes de um grupo; exclusivo do dono.",clientes:"lista os clientes/alugueis registrados; exclusivo do dono.",alugueis:"mostra o resumo dos aluguéis; exclusivo do dono.",statusglobal:"mostra o status geral da Kobayashi; exclusivo do dono.",estatisticas:"mostra estatísticas globais de uso; exclusivo do dono.",comandosmaisusados:"mostra o ranking dos comandos mais usados; exclusivo do dono.",erros:"mostra os erros recentes; exclusivo do dono.",atividadegp:"mostra a atividade rastreada do grupo.",infogrupo:"mostra informações gerais do grupo."};
  return m[String(command||"").toLowerCase()]||null;
}
export async function runGlobalManagementCommand(command,ctx){
  const c=String(command||"").toLowerCase(); if(!GLOBAL_MANAGEMENT_COMMANDS.includes(c))return false;
  const {conn,from,q="",args=[],prefix="/",reply,isGroup,groupName,groupMembers=[],permissions={}}=ctx;
  const owner=Boolean(permissions?.isMainOwner);
  if(["grupos","grupo","clientes","alugueis","statusglobal","estatisticas","comandosmaisusados","erros"].includes(c)&&!owner){await reply("👑 Este comando é exclusivo do *dono principal*.");return true;}
  if(c==="grupos"){
    const groups=await fetchGroups(conn),entries=Object.entries(groups||{});if(!entries.length){await reply("📭 A Kobayashi não está em nenhum grupo.");return true;}
    const rows=entries.map(([jid,m],i)=>`${i+1}. *${m?.subject||"Sem nome"}*\n   👥 ${Array.isArray(m?.participants)?m.participants.length:"?"} membros\n   🆔 ${jid}`);
    await reply(`🏘️🐉 *GRUPOS DA KOBAYASHI* (${entries.length})\n\n${rows.join("\n\n")}\n\nUse *${prefix}grupo número* para ver detalhes.`);return true;
  }
  if(c==="grupo"){
    const entries=Object.entries(await fetchGroups(conn)||{});if(!entries.length){await reply("📭 Nenhum grupo encontrado.");return true;}
    const sel=String(q||"").trim();if(!sel){await reply(`Use *${prefix}grupo número*, JID ou parte do nome.`);return true;}
    let found=null;if(/^\d+$/.test(sel)){found=entries[Number(sel)-1]||null;}else if(sel.endsWith("@g.us")){found=entries.find(([jid])=>jid===sel)||null;}else{found=entries.find(([,m])=>String(m?.subject||"").toLowerCase().includes(sel.toLowerCase()))||null;}
    if(!found){await reply("❌ Grupo não encontrado.");return true;}const [jid,m]=found;const parts=Array.isArray(m?.participants)?m.participants:[];const admins=parts.filter(p=>p?.admin==="admin"||p?.admin==="superadmin");const db=ensureDb();const st=db.groups?.[jid]||{};const rentals=rentalSummary();const rent=rentals.find(r=>rentalJid(r)===jid);let rs="Não registrado";if(rent){rs=rentalPerm(rent)?"Permanente":rentalExp(rent)?`Até ${fmtDate(rentalExp(rent))}`:"Registrado";}
    await reply(`🏘️🐉 *DETALHES DO GRUPO*\n\n📛 Nome: *${m?.subject||"Sem nome"}*\n🆔 JID: ${jid}\n👥 Membros: *${parts.length}*\n🛡️ ADMs: *${admins.length}*\n📨 Mensagens rastreadas: *${Number(st.messages||0)}*\n⌨️ Comandos usados: *${Number(st.commands||0)}*\n💰 Aluguel: *${rs}*`);return true;
  }
  if(c==="clientes"||c==="alugueis"){
    const rentals=rentalSummary();if(!rentals.length){await reply("📭 Nenhum aluguel registrado foi encontrado.");return true;}const groups=await fetchGroups(conn);const now=Date.now();const rows=rentals.map((r,i)=>{const jid=rentalJid(r),m=jid?groups?.[jid]:null,perm=rentalPerm(r),exp=rentalExp(r),expired=!perm&&exp>0&&exp<=now,status=perm?"♾️ Permanente":expired?"❌ Expirado":exp?`✅ ${fmtDate(exp)}`:"✅ Ativo",resp=rentalResp(r);return `${i+1}. *${m?.subject||r?.name||jid||"Cliente"}*\n   💳 ${status}\n${resp?`   👤 Responsável: ${resp}\n`:""}${jid?`   🆔 ${jid}`:""}`;});const active=rentals.filter(r=>rentalPerm(r)||!rentalExp(r)||rentalExp(r)>now).length;
    await reply(`💰🐉 *${c==="clientes"?"CLIENTES":"ALUGUÉIS"}*\n\n✅ Ativos: *${active}*\n❌ Expirados: *${rentals.length-active}*\n📦 Total: *${rentals.length}*\n\n${rows.join("\n\n")}`);return true;
  }
  if(c==="statusglobal"){
    const groups=await fetchGroups(conn),db=ensureDb(),mem=process.memoryUsage(),load=os.loadavg?.()||[0,0,0];await reply(`🐉📡 *STATUS GLOBAL DA KOBAYASHI*\n\n🟢 Processo: *ONLINE*\n⏱️ Uptime: *${fmtUptime(process.uptime())}*\n🏘️ Grupos: *${Object.keys(groups||{}).length}*\n👤 Usuários rastreados: *${Object.keys(db.users||{}).length}*\n⌨️ Comandos executados: *${Number(db.commandsTotal||0)}*\n📨 Mensagens rastreadas: *${Number(db.messagesTotal||0)}*\n\n🧠 RAM RSS: *${fmtMB(mem.rss)}*\n📦 Heap: *${fmtMB(mem.heapUsed)} / ${fmtMB(mem.heapTotal)}*\n⚙️ Node: *${process.version}*\n💻 Plataforma: *${process.platform} ${process.arch}*\n📊 Load: *${load.map(v=>Number(v).toFixed(2)).join(" / ")}*`);return true;
  }
  if(c==="estatisticas"){
    const db=ensureDb(),top=topCommands(db,5),groups=topGroups(db,5),today=db.days?.[todayKey()]||{messages:0,commands:0};await reply(`📊🐉 *ESTATÍSTICAS GLOBAIS*\n\n📨 Mensagens rastreadas: *${Number(db.messagesTotal||0)}*\n⌨️ Comandos executados: *${Number(db.commandsTotal||0)}*\n👤 Usuários únicos: *${Object.keys(db.users||{}).length}*\n🏘️ Grupos rastreados: *${Object.keys(db.groups||{}).length}*\n\n📅 *Hoje*\n├ Mensagens: *${Number(today.messages||0)}*\n└ Comandos: *${Number(today.commands||0)}*\n\n🏆 *Top comandos*\n${top.length?top.map(([cmd,n],i)=>`${i+1}. /${cmd} — ${n}`).join("\n"):"Sem dados ainda."}\n\n🔥 *Grupos mais ativos*\n${groups.length?groups.map(([jid,s],i)=>`${i+1}. ${jid} — ${Number(s?.commands||0)} comandos`).join("\n"):"Sem dados ainda."}`);return true;
  }
  if(c==="comandosmaisusados"){
    const top=topCommands(ensureDb(),20);await reply(`🏆⌨️ *COMANDOS MAIS USADOS*\n\n${top.length?top.map(([cmd,n],i)=>`${i+1}. *${prefix}${cmd}* — ${n} usos`).join("\n"):"Ainda não há dados suficientes."}`);return true;
  }
  if(c==="erros"){
    const errors=getRecentErrors(Number(args[0])||10);if(!errors.length){await reply("✅ Nenhum erro registrado recentemente.");return true;}await reply(`🚨🐉 *ERROS RECENTES* (${errors.length})\n\n${errors.map((e,i)=>`${i+1}. *${fmtDate(e.at)}*\n   ${String(e.message||"Erro").slice(0,180)}${e.command?`\n   Comando: /${e.command}`:""}`).join("\n\n")}`);return true;
  }
  if(c==="atividadegp"){
    if(!isGroup){await reply("👥 Use este comando em um grupo.");return true;}const s=ensureDb().groups?.[from]||{};await reply(`🔥🐉 *ATIVIDADE DO GRUPO*\n\n📛 Grupo: *${groupName||"Grupo"}*\n👥 Membros atuais: *${groupMembers.length}*\n📨 Mensagens rastreadas: *${Number(s.messages||0)}*\n⌨️ Comandos usados: *${Number(s.commands||0)}*\n🕒 Última atividade: *${s.lastSeen?fmtDate(s.lastSeen):"Sem dados"}*`);return true;
  }
  if(c==="infogrupo"){
    if(!isGroup){await reply("👥 Use este comando em um grupo.");return true;}let m=null;try{m=await conn.groupMetadata(from);}catch{}const parts=m?.participants||groupMembers||[];const admins=parts.filter(p=>p?.admin==="admin"||p?.admin==="superadmin");await reply(`🏘️🐉 *INFO DO GRUPO*\n\n📛 Nome: *${m?.subject||groupName||"Grupo"}*\n🆔 ID: ${from}\n👥 Membros: *${parts.length}*\n🛡️ ADMs: *${admins.length}*\n📝 Descrição:\n${m?.desc||"Sem descrição."}`);return true;
  }
  return false;
}
