import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB = path.join(process.cwd(), "files", "database", "v3-suite.json");

function readDb() {
  try {
    if (!fs.existsSync(DB)) return { groups: {} };
    const x = JSON.parse(fs.readFileSync(DB, "utf8"));
    return { groups: x?.groups && typeof x.groups === "object" ? x.groups : {} };
  } catch { return { groups: {} }; }
}
function writeDb(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  const tmp = `${DB}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB);
}
function gcfg(jid) {
  const db = readDb();
  if (!db.groups[jid]) db.groups[jid] = {
    antiword: { enabled: false, words: [] },
    autoresponses: {}
  };
  return { db, cfg: db.groups[jid] };
}
function digits(jid=""){ return String(jid).split("@")[0].replace(/\D/g,""); }
function tag(jid=""){ return `@${digits(jid)}`; }
function pick(a=[]){ return a[Math.floor(Math.random()*a.length)]; }
function randomPercent(){ return Math.floor(Math.random()*101); }

const ALIASES = {
  // Hutao/Nazuna -> Kobayashi
  "menujogos":"menubn","menudiversao":"menubn","menubrincadeiras":"menubn","games":"menubn",
  "admmenu":"menuadm","menoadm":"menuadm","ownermenu":"menudono","menuowner":"menudono",
  "sticker-menu":"menusticker","menuf": "menusticker",
  "banir":"ban","kick":"ban","expulsar":"ban","remover":"ban","ban2":"ban",
  "advertir":"adv","warn":"adv","rmwarn":"rmadv","delwarn":"rmadv",
  "promote":"promover","promoveradm":"promover","demote":"rebaixar","rebaixaradm":"rebaixar",
  "abrirgp":"opengp","abrirgrupo":"opengp","open":"opengp",
  "fechargp":"closegp","fechargrupo":"closegp","close":"closegp",
  "tagall":"hidetag","marcar":"hidetag","marcartodos":"hidetag","totag":"hidetag",
  "linkgrupo":"linkgp","grouplink":"linkgp","resetlinkgp":"resetlink","revokelink":"revogarlink",
  "groupinfo":"grupoinfo","infogp":"grupoinfo","gpinfo":"grupoinfo",
  "welcome":"bemvindo","boasvindas":"bemvindo","bv":"bemvindo",
  "autostk":"autosticker","autostiker":"autosticker",
  "s":"sticker","stiker":"sticker","figurinha":"sticker",
  "roubarfig":"take","steal":"take","renamefig":"rename",
  "toimage":"toimg","img":"toimg",
  "admins":"adms","admin":"adms",
  "warns":"advs","listadv":"advs","listaadv":"advs",
  "blacklist":"listanegra","globalblacklist":"listanegrag",
  "whitelist":"listabranca","allowlist":"listabranca",
  "antifake":"antifake","banfake":"banfake","antiflood":"antiflood",
  "antispamcmd":"antispam","antispamcomando":"antispam",
  "antidelete":"antidel","antiedit":"antiedit",
  "antilinksoft":"antilinklight","antilinkhard":"antilink",
  "antipvmsg":"antipv","antipvmessage":"antipv",
  "ranklevel":"ranknivel","rankxp":"ranknivel","rankglobal":"ranknivelg",
  "levelinfo":"nivelinfo","level":"nivel",
  "daily":"daily","diario":"daily","gold":"carteira","vergold":"carteira",
  "rankgold":"rankcoins","topriqueza":"rankcoins",
  "shop":"menuloja","loja":"menuloja",
  "inv":"inventario","inventory":"inventario",
  "casamento":"casar","marry":"casar","divorce":"divorciar",
  "family":"familia","familia":"familia",
  "rpgmenu":"menurpg","menu-rpg":"menurpg",
  "profile":"perfil","profilegp":"perfil",
  "botinfo":"statusbot","infobot":"statusbot","status":"statusbot",
  "owner":"dono","creator":"criador","autor":"criador",
  "versao":"version","versão":"version",
  "update":"atualizar","atualizarbot":"atualizar",
  "broadcast":"msg","bc":"msg","aviso":"msg","avisoglobal":"msg",
  "plans":"planos","rental":"aluguel","rent":"aluguel",
  "registraraluguel":"rg_aluguel","addaluguel":"rg_aluguel",
  "renewrent":"renovar_aluguel","renewaluguel":"renovar_aluguel",
  "delaluguel":"rm_aluguel","cancelaraluguel":"rm_aluguel",
  "cmdfig":"rgfigu","stickercmd":"rgfigu",
  "afk":"afk","notas":"anotacoes","notes":"anotacoes",
  "rules":"regras","regra":"regras",
  "help":"menu","ajuda":"menu","commands":"menu","comandos":"menu",
  "cmdhelp":"helpcmd","ajudacmd":"helpcmd",
  "novidades":"novidades","changelog":"novidades",
  "prefix":"prefixo","setprefix":"prefixo",
  "setname":"nome_gp","setfoto":"foto_gp","setphotogp":"foto_gp",
  "botname":"nome_gp",
  "mutar":"mute","desmutar":"unmute",
  "rankadm":"rankadm","logsadm":"adminlogs","ultimoslogs":"adminlogs",
  "soadmin":"soadm","onlyadmin":"soadm",
  "fun":"menubn","brincadeiras":"menubn"
};

export function resolveV3Alias(command="") {
  const c = String(command || "").toLowerCase();
  return ALIASES[c] || c;
}

export const V3_STANDALONE_COMMANDS = [
  "menuv3","calc","calculadora","calcular","maiusculo","minusculo","inverter","reverse",
  "contar","escolher","random","aleatorio","senha","base64","unbase64","uuid",
  "parimpar","porcentagem","idgp","meuid","id","membros","listarmembros","listargrupos",
  "alterardesc","setdesc","alterarnome","setnomegp",
  "antipalavra","antiword","addautoresposta","addautoresponse","delautoresposta",
  "delautoresponse","autorespostas","autoresponses","v3status"
];

export function getV3Help(command="") {
  const c = String(command||"").toLowerCase();
  const h = {
    menuv3:"abre a Central V3 com os sistemas integrados inspirados nas bases Nazuna e Hutao, adaptados para a Kobayashi.",
    calc:"faz cálculos locais sem API. Ex.: /calc (10+5)*2",
    maiusculo:"transforma o texto em letras maiúsculas.",
    minusculo:"transforma o texto em letras minúsculas.",
    inverter:"inverte o texto informado.",
    contar:"conta caracteres, palavras e linhas do texto.",
    escolher:"escolhe aleatoriamente entre opções separadas por |.",
    random:"sorteia um número. Ex.: /random 1 100",
    senha:"gera uma senha aleatória local.",
    base64:"codifica texto em Base64.",
    unbase64:"decodifica Base64.",
    uuid:"gera um identificador UUID aleatório.",
    parimpar:"diz se um número é par ou ímpar.",
    porcentagem:"gera uma porcentagem totalmente aleatória de 0 a 100%.",
    idgp:"mostra o ID do grupo atual.",
    meuid:"mostra seu JID/identificador no WhatsApp.",
    membros:"lista os participantes do grupo.",
    listargrupos:"lista os grupos em que a Kobayashi está; exclusivo do dono.",
    alterardesc:"altera a descrição do grupo; exige ADM.",
    alterarnome:"altera o nome do grupo; exige ADM.",
    antipalavra:"proteção local por palavras. Use on/off, add, del ou list.",
    addautoresposta:"cria resposta automática local. Ex.: /addautoresposta oi | Olá!",
    delautoresposta:"remove uma resposta automática.",
    autorespostas:"lista as respostas automáticas do grupo.",
    v3status:"mostra o estado dos módulos locais da V3."
  };
  return h[c] || null;
}

function safeCalc(expr) {
  const x=String(expr||"").trim().replace(/,/g,".");
  if(!x || x.length>160) throw new Error("expressão inválida");
  if(!/^[0-9+\-*/%().\s^]+$/.test(x)) throw new Error("use apenas números e operadores");
  const normalized=x.replace(/\^/g,"**");
  // Input is restricted to numeric operators only.
  const result=Function(`"use strict"; return (${normalized})`)();
  if(typeof result!=="number" || !Number.isFinite(result)) throw new Error("resultado inválido");
  return result;
}

export async function runV3Standalone(command, ctx) {
  const c=String(command||"").toLowerCase();
  if(!V3_STANDALONE_COMMANDS.includes(c)) return false;
  const {conn,from,sender,prefix="/",q="",args=[],reply,isGroup,groupName,groupMembers=[],groupAdmins=[],permissions={}}=ctx;

  if(c==="menuv3"){
    return reply(
`╭━━〔 🐉🌸 *KOBAYASHI V3.0* 〕━━╮
┃  Integração Nazuna + Hutao
╰━━━━━━━━━━━━━━━━━━━━╯

🛡️ *GRUPOS & MODERAÇÃO*
${prefix}menuadm
${prefix}paineladm
${prefix}antipalavra
${prefix}bemvindo
${prefix}opengp
${prefix}closegp
${prefix}rgfigu
${prefix}rankadm

🎮 *DIVERSÃO & JOGOS*
${prefix}menubn
${prefix}menulevel
${prefix}menusocial
${prefix}menuloja
${prefix}menurpg
${prefix}dragonrpg

🧰 *FERRAMENTAS LOCAIS*
${prefix}calc
${prefix}maiusculo
${prefix}minusculo
${prefix}inverter
${prefix}contar
${prefix}escolher
${prefix}random
${prefix}senha
${prefix}base64
${prefix}unbase64
${prefix}uuid
${prefix}porcentagem

🤖 *AUTOMAÇÕES LOCAIS*
${prefix}addautoresposta
${prefix}autorespostas
${prefix}v3status

👑 *DONO*
${prefix}menudono
${prefix}listargrupos
${prefix}msg

📡 Comandos que exigem API externa ficaram reservados para uma atualização própria.`);
  }

  if(["calc","calculadora","calcular"].includes(c)){
    try{return reply(`🧮 *CALCULADORA*\n\n${q} = *${safeCalc(q)}*`);}
    catch(e){return reply(`❌ ${e.message}\nEx.: *${prefix}calc (10+5)*2*`);}
  }
  if(c==="maiusculo") return reply(String(q||"").toUpperCase() || `Use: *${prefix}maiusculo texto*`);
  if(c==="minusculo") return reply(String(q||"").toLowerCase() || `Use: *${prefix}minusculo texto*`);
  if(["inverter","reverse"].includes(c)) return reply(q ? [...q].reverse().join("") : `Use: *${prefix}inverter texto*`);
  if(c==="contar"){
    const text=String(q||"");
    if(!text)return reply(`Use: *${prefix}contar texto*`);
    const words=text.trim()?text.trim().split(/\s+/).length:0;
    return reply(`🔢 *CONTADOR*\n\nCaracteres: *${[...text].length}*\nPalavras: *${words}*\nLinhas: *${text.split(/\n/).length}*`);
  }
  if(c==="escolher"){
    const opts=String(q||"").split("|").map(x=>x.trim()).filter(Boolean);
    if(opts.length<2)return reply(`Use: *${prefix}escolher pizza | hambúrguer | sushi*`);
    return reply(`🎲 A Kobayashi escolheu: *${pick(opts)}*`);
  }
  if(["random","aleatorio"].includes(c)){
    let a=Number(args[0]),b=Number(args[1]);
    if(!Number.isFinite(a)){a=0;b=100;}
    if(!Number.isFinite(b)){b=a;a=0;}
    if(a>b)[a,b]=[b,a];
    a=Math.ceil(a);b=Math.floor(b);
    return reply(`🎲 Número sorteado: *${Math.floor(Math.random()*(b-a+1))+a}*`);
  }
  if(c==="senha"){
    const len=Math.max(8,Math.min(64,Number(args[0])||16));
    const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*_-";
    let s="";for(let i=0;i<len;i++)s+=chars[crypto.randomInt(0,chars.length)];
    return reply(`🔐 *SENHA GERADA*\n\n\`${s}\`\n\n⚠️ Guarde em local seguro.`);
  }
  if(c==="base64"){
    if(!q)return reply(`Use: *${prefix}base64 texto*`);
    return reply(Buffer.from(q,"utf8").toString("base64"));
  }
  if(c==="unbase64"){
    if(!q)return reply(`Use: *${prefix}unbase64 código*`);
    try{return reply(Buffer.from(q,"base64").toString("utf8"));}catch{return reply("❌ Base64 inválido.");}
  }
  if(c==="uuid") return reply(`🆔 \`${crypto.randomUUID()}\``);
  if(c==="parimpar"){
    const n=Number(args[0]);if(!Number.isInteger(n))return reply(`Use: *${prefix}parimpar 10*`);
    return reply(`🔢 *${n}* é *${n%2===0?"PAR":"ÍMPAR"}*.`);
  }
  if(c==="porcentagem") return reply(`📊 Resultado aleatório: *${randomPercent()}%*`);
  if(c==="idgp"){
    if(!isGroup)return reply("👥 Use este comando em um grupo.");
    return reply(`🆔 *ID DO GRUPO*\n\n${from}`);
  }
  if(["meuid","id"].includes(c)) return reply(`🪪 *SEU ID*\n\n${sender}`);
  if(["membros","listarmembros"].includes(c)){
    if(!isGroup)return reply("👥 Use este comando em um grupo.");
    const jids=[...new Set(groupMembers.map(x=>x?.id||x?.jid).filter(Boolean))];
    const text=jids.map((j,i)=>`${i+1}. ${tag(j)}`).join("\n");
    return conn.sendMessage(from,{text:`👥 *MEMBROS • ${groupName||"GRUPO"}*\n\n${text}`,mentions:jids},{quoted:ctx.info}).then(()=>true);
  }
  if(c==="listargrupos"){
    if(!permissions?.isMainOwner)return reply("👑 Apenas o dono principal pode listar os grupos.");
    const gs=await conn.groupFetchAllParticipating();
    const rows=Object.entries(gs||{}).map(([jid,m],i)=>`${i+1}. *${m?.subject||"Sem nome"}*\n   ${jid}`);
    return reply(`🏘️ *GRUPOS DA KOBAYASHI* (${rows.length})\n\n${rows.join("\n\n")}`);
  }
  if(["alterardesc","setdesc"].includes(c)){
    if(!isGroup)return reply("👥 Use em um grupo.");
    if(!permissions?.isAdmin && !permissions?.isMainOwner)return reply("🛡️ Apenas ADM pode alterar a descrição.");
    if(!q)return reply(`Use: *${prefix}alterardesc nova descrição*`);
    await conn.groupUpdateDescription(from,q);
    return reply("✅ Descrição do grupo atualizada.");
  }
  if(["alterarnome","setnomegp"].includes(c)){
    if(!isGroup)return reply("👥 Use em um grupo.");
    if(!permissions?.isAdmin && !permissions?.isMainOwner)return reply("🛡️ Apenas ADM pode alterar o nome.");
    if(!q)return reply(`Use: *${prefix}alterarnome novo nome*`);
    await conn.groupUpdateSubject(from,q.slice(0,100));
    return reply("✅ Nome do grupo atualizado.");
  }
  if(["antipalavra","antiword"].includes(c)){
    if(!isGroup)return reply("👥 Use em um grupo.");
    if(!permissions?.isAdmin && !permissions?.isMainOwner)return reply("🛡️ Apenas ADM pode configurar.");
    const {db,cfg}=gcfg(from);
    const action=String(args[0]||"").toLowerCase();
    const rest=args.slice(1).join(" ").trim().toLowerCase();
    if(action==="on"){cfg.antiword.enabled=true;writeDb(db);return reply("🚫 AntiPalavra ativado.");}
    if(action==="off"){cfg.antiword.enabled=false;writeDb(db);return reply("✅ AntiPalavra desativado.");}
    if(action==="add" && rest){if(!cfg.antiword.words.includes(rest))cfg.antiword.words.push(rest);writeDb(db);return reply(`🚫 Palavra adicionada: *${rest}*`);}
    if(["del","rm","remove"].includes(action) && rest){cfg.antiword.words=cfg.antiword.words.filter(x=>x!==rest);writeDb(db);return reply(`🗑️ Palavra removida: *${rest}*`);}
    if(action==="list")return reply(`🚫 *ANTIPALAVRA*\nStatus: *${cfg.antiword.enabled?"ON":"OFF"}*\n\n${cfg.antiword.words.length?cfg.antiword.words.map((x,i)=>`${i+1}. ${x}`).join("\n"):"Nenhuma palavra cadastrada."}`);
    return reply(`🚫 *ANTIPALAVRA*\n\n${prefix}antipalavra on/off\n${prefix}antipalavra add palavra\n${prefix}antipalavra del palavra\n${prefix}antipalavra list`);
  }
  if(["addautoresposta","addautoresponse"].includes(c)){
    if(!isGroup)return reply("👥 Use em um grupo.");
    if(!permissions?.isAdmin && !permissions?.isMainOwner)return reply("🛡️ Apenas ADM pode configurar.");
    const parts=String(q||"").split("|").map(x=>x.trim());
    if(parts.length<2 || !parts[0] || !parts.slice(1).join("|").trim())return reply(`Use: *${prefix}addautoresposta oi | Olá! 🌸*`);
    const trigger=parts.shift().toLowerCase(), response=parts.join("|").trim();
    const {db,cfg}=gcfg(from); cfg.autoresponses[trigger]=response; writeDb(db);
    return reply(`🤖 Auto resposta criada para *${trigger}*.`);
  }
  if(["delautoresposta","delautoresponse"].includes(c)){
    if(!isGroup)return reply("👥 Use em um grupo.");
    if(!permissions?.isAdmin && !permissions?.isMainOwner)return reply("🛡️ Apenas ADM pode configurar.");
    const trigger=String(q||"").trim().toLowerCase();if(!trigger)return reply(`Use: *${prefix}delautoresposta gatilho*`);
    const {db,cfg}=gcfg(from);delete cfg.autoresponses[trigger];writeDb(db);return reply(`🗑️ Auto resposta removida: *${trigger}*`);
  }
  if(["autorespostas","autoresponses"].includes(c)){
    if(!isGroup)return reply("👥 Use em um grupo.");
    const {cfg}=gcfg(from);const rows=Object.entries(cfg.autoresponses||{});
    return reply(`🤖 *AUTO RESPOSTAS*\n\n${rows.length?rows.map(([a,b],i)=>`${i+1}. *${a}* → ${b}`).join("\n"):"Nenhuma cadastrada."}`);
  }
  if(c==="v3status"){
    const {cfg}=isGroup?gcfg(from):{cfg:{antiword:{enabled:false,words:[]},autoresponses:{}}};
    return reply(`🐉🌸 *KOBAYASHI V3 STATUS*\n\n🚫 AntiPalavra: *${cfg.antiword.enabled?"ON":"OFF"}* (${cfg.antiword.words.length})\n🤖 Auto respostas: *${Object.keys(cfg.autoresponses||{}).length}*\n🎮 Dragon Fun: integrado\n⚔️ Dragon RPG: integrado\n🏷️ Aluguel 2.0: integrado\n🛡️ Admin Center: integrado\n📡 APIs externas: reservadas para módulo posterior`);
  }
  return false;
}

export async function processV3PassiveMessage(ctx) {
  const {conn,from,sender,body="",isGroup,isCmd,permissions={},info}=ctx;
  if(!isGroup || isCmd || !body) return false;
  const {cfg}=gcfg(from);
  const text=String(body).trim();
  const lower=text.toLowerCase();

  if(cfg.antiword?.enabled && !permissions?.isAdmin && !permissions?.isMainOwner){
    const hit=(cfg.antiword.words||[]).find(w=>w && lower.includes(String(w).toLowerCase()));
    if(hit){
      try{await conn.sendMessage(from,{delete:info.key});}catch{}
      await conn.sendMessage(from,{text:`🚫 ${tag(sender)}, esta palavra está bloqueada neste grupo.`,mentions:[sender]},{quoted:info}).catch(()=>{});
      return true;
    }
  }

  const response=cfg.autoresponses?.[lower];
  if(response){
    await conn.sendMessage(from,{text:response},{quoted:info}).catch(()=>{});
    return true;
  }
  return false;
}
