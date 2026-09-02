import fs from "fs";
import path from "path";
import { getContentType } from "@whiskeysockets/baileys";

const DB = path.join(process.cwd(), "files", "database", "antispam.json");
const runtime = new Map();

function readDb() {
  try {
    fs.mkdirSync(path.dirname(DB), { recursive: true });
    if (!fs.existsSync(DB)) fs.writeFileSync(DB, "{}", "utf8");
    return JSON.parse(fs.readFileSync(DB, "utf8"));
  } catch { return {}; }
}
function writeDb(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  const tmp = `${DB}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB);
}
export function getAntiSpamConfig(groupJid) {
  const row=readDb()?.[groupJid] || {};
  return {
    enabled: Boolean(row.enabled),
    punishment: ["adv","ban","alert"].includes(row.punishment) ? row.punishment : "adv",
    windowMs: 10000,
    maxMessages: 8,
    maxCommands: 5,
    maxStickers: 6,
    maxImages: 6,
    maxMentions: 8,
    duplicateWindowMs: 20000,
    maxDuplicates: 4,
    cooldownMs: 15000
  };
}
export function setAntiSpamEnabled(groupJid, enabled) {
  const db=readDb(); db[groupJid]={...(db[groupJid]||{}),enabled:Boolean(enabled)}; writeDb(db); return Boolean(enabled);
}
function unwrap(message={}) {
  let m=message;
  for(let i=0;i<5;i++){
    const type=getContentType(m);
    if(["ephemeralMessage","viewOnceMessage","viewOnceMessageV2","viewOnceMessageV2Extension"].includes(type)){
      m=m?.[type]?.message || m; continue;
    }
    break;
  }
  return m;
}
function normalizedText(text=""){
  return String(text).toLowerCase().replace(/\s+/g," ").trim().slice(0,1500);
}
export function inspectAntiSpam({groupJid,userJid,message,text="",isCommand=false,config}={}) {
  const cfg=config || getAntiSpamConfig(groupJid);
  if(!cfg.enabled) return {triggered:false,reasons:[],punishment:cfg.punishment};

  const now=Date.now(), key=`${groupJid}|${userJid}`;
  const state=runtime.get(key)||{events:[],lastTrigger:0};
  state.events=state.events.filter(x=>now-x.at<=Math.max(cfg.duplicateWindowMs,cfg.windowMs));

  const unwrapped=unwrap(message||{});
  const type=getContentType(unwrapped);
  const context=unwrapped?.[type]?.contextInfo || {};
  const mentions=Array.isArray(context.mentionedJid)?context.mentionedJid.length:0;
  const kind=type==="stickerMessage"?"sticker":type==="imageMessage"?"image":isCommand?"command":"message";
  const norm=normalizedText(text);

  state.events.push({at:now,kind,norm,mentions});
  runtime.set(key,state);

  if(now-state.lastTrigger<cfg.cooldownMs) return {triggered:false,reasons:[],punishment:cfg.punishment};

  const short=state.events.filter(x=>now-x.at<=cfg.windowMs);
  const reasons=[];
  if(short.length>=cfg.maxMessages) reasons.push(`flood (${short.length} mensagens/${Math.round(cfg.windowMs/1000)}s)`);
  const commands=short.filter(x=>x.kind==="command").length;
  const stickers=short.filter(x=>x.kind==="sticker").length;
  const images=short.filter(x=>x.kind==="image").length;
  if(commands>=cfg.maxCommands) reasons.push(`spam de comandos (${commands})`);
  if(stickers>=cfg.maxStickers) reasons.push(`spam de figurinhas (${stickers})`);
  if(images>=cfg.maxImages) reasons.push(`spam de imagens (${images})`);
  if(mentions>=cfg.maxMentions) reasons.push(`menções em massa (${mentions})`);

  if(norm.length>=4){
    const dup=state.events.filter(x=>now-x.at<=cfg.duplicateWindowMs && x.norm===norm).length;
    if(dup>=cfg.maxDuplicates) reasons.push(`mensagem repetida (${dup}x)`);
  }

  if(reasons.length){
    state.lastTrigger=now;
    state.events=[];
    runtime.set(key,state);
    return {triggered:true,reasons,punishment:cfg.punishment};
  }
  return {triggered:false,reasons:[],punishment:cfg.punishment};
}
export function formatAntiSpamStatus(groupJid,prefix="/") {
  const c=getAntiSpamConfig(groupJid);
  return `╭─〔 🐉 ANTISPAM PRO 〕\n`+
    `│ Status › ${c.enabled?"🟢 Ativado":"🔴 Desativado"}\n`+
    `│ Punição › ${c.punishment.toUpperCase()}\n`+
    `│ Flood › ${c.maxMessages} mensagens / ${Math.round(c.windowMs/1000)}s\n`+
    `│ Comandos › ${c.maxCommands}\n│ Figurinhas › ${c.maxStickers}\n│ Imagens › ${c.maxImages}\n`+
    `│ Menções › ${c.maxMentions}\n│ Repetidas › ${c.maxDuplicates}x / ${Math.round(c.duplicateWindowMs/1000)}s\n`+
    `╰────────────────\n\nUse *${prefix}antispam on* ou *${prefix}antispam off*.`;
}
