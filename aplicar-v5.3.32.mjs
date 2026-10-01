import fs from "node:fs";let s=fs.readFileSync("index.js","utf8");
const I='import { getAntiMsgGlobalConfig, setAntiMsgGlobalEnabled, addAntiMsgGlobalRule, removeAntiMsgGlobalRule, matchAntiMsgGlobal, listAntiMsgGlobalRules, addAntiMsgGlobalAudit, listAntiMsgGlobalAudit, getAntiMsgGlobalAudit } from "./lib/features/moderation/antiMsgGlobal.js";';
const A='import { isGloballyBlacklisted, addGlobalBlacklist, removeGlobalBlacklist, getGlobalBlacklistEntry, listGlobalBlacklist, normalizeBlacklistJid } from "./lib/features/moderation/globalBlacklist.js";';
if(!s.includes("antiMsgGlobal.js")){if(!s.includes(A))throw Error("import globalBlacklist não encontrado");s=s.replace(A,A+"\n"+I)}
const M='// 🛰️ SENTINEL WA • recebe alertas assinados enviados pelo número observador.';
if(!s.includes("ANTI-MSG GLOBAL • PASSIVO")){let P=`// 🛡️ ANTI-MSG GLOBAL • PASSIVO
if(isGroup&&!SoDonoPrincipal&&body){
 const rule=matchAntiMsgGlobal(body);
 if(rule){
  const pj=normalizeBlacklistJid(sender),num=String(pj||sender||"").split("@")[0].replace(/\\D/g,"");
  const base={userJid:sender,mention:num?\`@\${num}\`:String(sender),number:num||null,groupName,groupJid:from,fullMessage:String(body),matchedRuleId:rule.id,matchedRuleMessage:rule.message};
  const pre=addAntiMsgGlobalAudit({...base,status:"detected",deleted:false,removed:false,blacklisted:false});
  let deleted=false,removed=false,blacklisted=false,deleteError=null,removeError=null;
  try{await conn.sendMessage(from,{delete:info.key});deleted=true}catch(e){deleteError=e?.message||String(e)}
  try{if(pj){addGlobalBlacklist(pj,{reason:\`Anti-Msg Global • regra #\${rule.id}: \${rule.message}\`,by:"Kobayashi Anti-Msg Global"});blacklisted=true}}catch{}
  try{if(isBotGroupAdmins){await conn.groupParticipantsUpdate(from,[sender],"remove");removed=true}else removeError="Kobayashi sem ADM"}catch(e){removeError=e?.message||String(e)}
  addAntiMsgGlobalAudit({...base,parentId:pre.id,status:"result",deleted,removed,blacklisted,deleteError,removeError});
  try{await conn.sendMessage(from,{text:\`🚨🐉 *ANTI-MSG GLOBAL*\\n\\n👤 @\${num}\\n🗑️ Mensagem: \${deleted?"apagada":"falhou"}\\n🚪 Remoção: \${removed?"realizada":"falhou"}\\n🌐 Lista Negra Global: \${blacklisted?"adicionado":"falhou"}\`,mentions:pj?[pj]:[]})}catch{}
  continue;
 }
}
`;if(!s.includes(M))throw Error("marcador Sentinel não encontrado");s=s.replace(M,P+M)}
if(!s.includes('case "anti-msg-global":')){let H=`case "anti-msg-global": case "antimsgglobal": {
 if(!SoDonoPrincipal)return reply("👑🐉 Exclusivo do dono principal.");
 const sub=String(args?.[0]||"").toLowerCase(),ctx=info?.message?.extendedTextMessage?.contextInfo||{},qt=ctx?.quotedMessage?extractCommandText(ctx.quotedMessage):"";
 if(sub==="on"||sub==="off"){let e=setAntiMsgGlobalEnabled(sub==="on");return reply(\`🛡️ Anti-Msg Global: *\${e?"ON":"OFF"}*\`)}
 if(sub==="add"){let m=String(args.slice(1).join(" ")||qt||"").trim();if(!m)return reply(\`Use \${prefix}anti-msg-global add <mensagem> ou responda uma mensagem.\`);let r=addAntiMsgGlobalRule(m,sender);return reply(\`✅ Regra #\${r.id} registrada.\\n\\n🚫 \${r.message}\`)}
 if(sub==="del"||sub==="rm"){let r=removeAntiMsgGlobalRule(args[1]);return reply(r?\`🗑️ Regra #\${r.id} removida.\`:"❌ Regra não encontrada.")}
 if(sub==="list"){let r=listAntiMsgGlobalRules();return reply(r.length?\`🚫 *MENSAGENS BANIDAS*\\n\\n\${r.map(x=>\`#\${x.id} — \${x.message}\`).join("\\n\\n")}\`:"Nenhuma regra.")}
 let c=getAntiMsgGlobalConfig();return reply(\`🛡️ *ANTI-MSG GLOBAL*\\nStatus: *\${c.enabled?"ON":"OFF"}*\\nRegras: *\${c.rules.length}*\\n\\n\${prefix}anti-msg-global on/off\\n\${prefix}anti-msg-global add <mensagem>\\n\${prefix}anti-msg-global del <ID>\\n\${prefix}anti-msg-global list\\n\${prefix}auditoria-msg-global [ID]\`);
} break;
case "auditoria-msg-global": case "auditoriamsgglobal": {
 if(!SoDonoPrincipal)return reply("👑🐉 Exclusivo do dono principal.");
 const fmt=x=>{let d=new Date(x.at),h=isNaN(d)?x.at:d.toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"});return \`🚨 *ANTI-MSG GLOBAL • AUDITORIA*\\n\\n🆔 #\${x.id}\\n👤 \${x.mention||"-"}\\n📱 Número: \${x.number||"-"}\\n👥 Grupo: \${x.groupName||"-"}\\n🆔 Grupo: \${x.groupJid||"-"}\\n🕐 Horário: \${h}\\n\\n📨 *MENSAGEM COMPLETA:*\\n\${x.fullMessage||"-"}\\n\\n🚫 *REGRA USADA:*\\n#\${x.matchedRuleId} — \${x.matchedRuleMessage||"-"}\\n\\n🗑️ Apagada: \${x.deleted?"SIM":"NÃO"}\\n🚪 Removido: \${x.removed?"SIM":"NÃO"}\\n⛔ Lista Negra: \${x.blacklisted?"ADICIONADO":"NÃO"}\`};
 let id=String(args?.[0]||"").replace(/^#/,"");if(id){let x=getAntiMsgGlobalAudit(id);return reply(x?fmt(x):"❌ Registro não encontrado.")}let l=listAntiMsgGlobalAudit(10);return reply(l.length?l.map(fmt).join("\\n\\n━━━━━━━━━━━━\\n\\n"):"Nenhuma auditoria.");
} break;
`;let k=s.indexOf("switch (command) {");if(k<0)throw Error("switch não encontrado");k+="switch (command) {".length;s=s.slice(0,k)+"\n"+H+s.slice(k)}
fs.writeFileSync("index.js",s);console.log("✅ Anti-Msg Global integrado");
