import {randomBytes} from 'node:crypto';
import {readCommunity,updateCommunity,communityGroup,validTime,renderCustom} from './store.js';
import {captureCommunityMedia,deleteCommunityMedia,quotedCommunityText,sendCommunityContent} from './media.js';
export const COMMUNITY_COMMANDS=['comunidade-ajuda','captcha','captchasolic','captcha-pendentes','captcha-reenviar','ticket','tickets','ticketaceitar','ticketfechar','addcmd','addcmdmidia','delcmd','listacmd','automsg'];
const id=()=>randomBytes(3).toString('hex').toUpperCase();
const requireAdmin=ctx=>{if(!ctx.isGroup)throw Error('Use este comando no grupo.');if(!ctx.isGroupAdmins)throw Error('Exclusivo de ADM do grupo.');};
const requireOwner=ctx=>{if(!ctx.isOwner)throw Error('Exclusivo do dono principal.');};
export async function handleCommunityCommand(ctx){
 const {command:c,q='',from,sender,conn,reply,prefix='/',info,download}=ctx;
 const custom=readCommunity().custom[c];
 if(!COMMUNITY_COMMANDS.includes(c)&&!custom)return false;
 try{
 if(c==='comunidade-ajuda'){
  await reply(`🐉☕ *COMUNIDADE KOBAYASHI*\n\n🔐 ${prefix}captcha on/off\n${prefix}captcha-pendentes\n${prefix}captcha-reenviar\n\n🎫 ${prefix}ticket on/off\n${prefix}ticket motivo\n${prefix}tickets\n${prefix}ticketaceitar ID\n${prefix}ticketfechar ID\n\n🧩 ${prefix}addcmd nome | texto\n${prefix}addcmdmidia nome | legenda (respondendo à mídia)\n${prefix}addcmd nome | adm | texto\nPermissões: todos, adm, dono. Campos: {user}, {grupo}, {prefixo}, {args}.\n${prefix}listacmd / ${prefix}delcmd nome\n\n⏰ ${prefix}automsg add HH:MM | texto\nPode responder mídia para salvá-la. Horário de São Paulo.\n${prefix}automsg list\n${prefix}automsg on/off/del ID`);return true;
 }
 if(['captcha','captchasolic','captcha-pendentes','captcha-reenviar'].includes(c)){
  requireAdmin(ctx);
  if(c==='captcha-pendentes'){
   const rows=Object.values(readCommunity().challenges).filter(x=>x.group===from&&['pending','processing','manual'].includes(x.status));
   await reply(`🔐 *CAPTCHAS*\n${rows.map(x=>`${x.id} • @${x.user.split('@')[0]} • ${x.status} • ${new Date(x.expiresAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}`).join('\n')||'Nenhum desafio pendente.'}`);return true;
  }
  if(c==='captcha-reenviar'){
   if(!readCommunity().groups[from]?.captcha)throw Error('Ative o captcha primeiro.');
   if(!conn.kobayashiCaptchaSync)throw Error('O captcha ainda não está pronto.');
   await conn.kobayashiCaptchaSync(from,true);await reply('🔐 Solicitações pendentes consultadas; os desafios foram reenviados quando possível. Confira /captcha-pendentes.');return true;
  }
  const action=q.trim().toLowerCase();
  if(!action){await reply(`🔐 Captcha: ${readCommunity().groups[from]?.captcha?'ON':'OFF'}\nUse ${prefix}captcha on/off. O desafio é enviado no privado; prazo de 5 minutos.`);return true;}
  if(!['on','off'].includes(action))throw Error(`Use ${prefix}captcha on/off.`);
  if(action==='on'&&!await ctx.confirmBotAdmin())throw Error('Preciso ser ADM para aprovar e recusar solicitações.');
  if(action==='on'){if(typeof conn.groupJoinApprovalMode!=='function')throw Error('Esta biblioteca não oferece configuração de aprovação de entrada.');await conn.groupJoinApprovalMode(from,'on');}
  updateCommunity(db=>{communityGroup(db,from).captcha=action==='on';if(action==='off')for(const ch of Object.values(db.challenges))if(ch.group===from&&ch.status==='pending')ch.status='cancelled';});
  await reply(`🔐 Captcha ${action==='on'?'ativado':'desativado'}. ${action==='on'?'Respostas certas aprovam; erro ou prazo vencido recusam a solicitação. Falha no envio privado fica para revisão do ADM.':'O histórico foi preservado.'}`);
  if(action==='on')await conn.kobayashiCaptchaSync?.(from);return true;
 }
 if(['ticket','tickets','ticketaceitar','ticketfechar'].includes(c)){
  if(!ctx.isGroup)throw Error('Use este comando no grupo.');
  const action=q.trim().toLowerCase();
  if(c==='ticket'&&['on','off'].includes(action)){requireAdmin(ctx);updateCommunity(db=>{communityGroup(db,from).support=action==='on';});await reply(`🎫 Suporte ${action==='on'?'ativado':'desativado'}.`);return true;}
  if(c==='tickets'){requireAdmin(ctx);const rows=readCommunity().groups[from]?.tickets||[];await reply(`🎫 *TICKETS ABERTOS*\n${rows.filter(t=>t.status!=='closed').map(t=>`${t.id} • @${t.user.split('@')[0]} • ${t.status==='waiting'?'aguardando':'em atendimento'}\n${t.reason}`).join('\n\n')||'Nenhum ticket.'}`);return true;}
  if(c==='ticket'){
   if(!q.trim())throw Error(`Use ${prefix}ticket motivo. ADM: ${prefix}ticket on/off.`);
   const result=updateCommunity(db=>{const g=communityGroup(db,from);if(!g.support)throw Error('O suporte está desligado neste grupo.');const existing=g.tickets.find(t=>t.ids?.some(x=>ctx.identities.includes(x))&&t.status!=='closed');if(existing)throw Error(`Você já tem um ticket aberto: ${existing.id}.`);const active=g.tickets.filter(t=>t.status!=='closed');if(active.length>=100)throw Error('A fila do grupo está cheia.');const t={id:id(),user:sender,ids:ctx.identities,reason:q.trim().slice(0,1000),status:'waiting',at:Date.now()};g.tickets=g.tickets.filter(t=>t.status!=='closed'||Date.now()-t.closedAt<30*86400000).slice(-499);g.tickets.push(t);return {ticket:t,ahead:active.filter(t=>t.status==='waiting').length};});
   await reply(`🎫 *TICKET ${result.ticket.id}*\n${result.ticket.reason}\n⏳ Pessoas aguardando antes de você: ${result.ahead}\nUm ADM pode assumir com ${prefix}ticketaceitar ${result.ticket.id}.`);return true;
  }
  const target=q.trim().toUpperCase();if(!target)throw Error(`Informe o ID do ticket.`);
  const result=updateCommunity(db=>{const g=communityGroup(db,from),t=g.tickets.find(t=>t.id===target);if(!t)throw Error('Ticket não encontrado neste grupo.');if(c==='ticketaceitar'){requireAdmin(ctx);if(t.status!=='waiting')throw Error('Este ticket já foi assumido ou encerrado.');t.status='accepted';t.assignedTo=sender;}else{if(!ctx.isGroupAdmins&&!t.ids.some(x=>ctx.identities.includes(x)))throw Error('Só o solicitante ou ADM pode encerrar.');if(t.status==='closed')throw Error('Ticket já encerrado.');t.status='closed';t.closedAt=Date.now();}return t;});
  await reply(`🎫 Ticket ${result.id} ${c==='ticketaceitar'?'assumido por @'+sender.split('@')[0]:'encerrado'}.`);return true;
 }
 if(['addcmd','addcmdmidia','delcmd','listacmd'].includes(c)){
  requireOwner(ctx);
  if(c==='listacmd'){const rows=Object.values(readCommunity().custom);await reply(`🧩 *COMANDOS PERSONALIZADOS*\n${rows.map(x=>`${prefix}${x.name} • ${x.permission} • ${x.media?'mídia':'texto'}`).join('\n')||'Nenhum comando criado.'}`);return true;}
  const parts=q.split('|').map(x=>x.trim());const name=parts[0]?.replace(/^\//,'').toLowerCase();if(!/^[a-z][a-z0-9_-]{1,29}$/.test(name||''))throw Error('Nome: 2 a 30 letras/números, hífen ou _.');
  if(c==='delcmd'){const previous=updateCommunity(db=>{const prev=db.custom[name];if(!prev)throw Error('Comando não encontrado.');delete db.custom[name];return prev;});deleteCommunityMedia(previous.media);await reply(`🗑️ /${name} excluído.`);return true;}
  if(ctx.commandExists(name)||COMMUNITY_COMMANDS.includes(name))throw Error('Esse nome já pertence a um comando da Kobayashi.');
  if(readCommunity().custom[name])throw Error('Esse comando já existe. Exclua com /delcmd antes de recriar.');
  if(Object.keys(readCommunity().custom).length>=100)throw Error('Limite de 100 comandos personalizados atingido.');
  let permission='todos';if(['todos','adm','dono'].includes(parts[1]))permission=parts.splice(1,1)[0];
  const text=parts.slice(1).join(' | ')||quotedCommunityText(info);if(text.length>8000)throw Error('Texto: máximo de 8000 caracteres.');
  let media=null;if(c==='addcmdmidia')media=await captureCommunityMedia(info,download,conn);
  if(!media&&!text.trim())throw Error(`Use ${prefix}${c} nome | texto; para mídia, responda ao arquivo.`);
  try{updateCommunity(db=>{db.custom[name]={name,permission,text,media,by:sender,at:Date.now()};});}catch(e){deleteCommunityMedia(media);throw e;}
  await reply(`🧩 ${prefix}${name} criado. Permissão: ${permission}.`);return true;
 }
 if(c==='automsg'){
  requireAdmin(ctx);const match=q.trim().match(/^(\S+)(?:\s+([\s\S]*))?$/);const action=match?.[1]?.toLowerCase(),rest=match?.[2]||'';
  if(!action){await reply(`⏰ ${prefix}automsg add HH:MM | texto (ou respondendo à mídia)\n${prefix}automsg list\n${prefix}automsg on/off/del ID\nEnvio diário no horário de São Paulo.`);return true;}
  if(action==='list'){const rows=readCommunity().groups[from]?.schedules||[];await reply(`⏰ *AGENDAMENTOS*\n${rows.map(j=>`${j.id} • ${j.time} • ${j.enabled?'ON':'OFF'} • ${j.media?j.media.kind:'texto'}\n${j.text?.slice(0,100)||''}\nÚltimo resultado: ${j.lastResult||'ainda não enviado'}`).join('\n\n')||'Nenhum agendamento.'}`);return true;}
  if(action==='add'){
   const pieces=rest.split('|').map(x=>x.trim()),time=pieces.shift();if(!validTime(time||''))throw Error('Horário inválido. Use HH:MM, por exemplo 08:30.');
   const text=pieces.join(' | ')||quotedCommunityText(info);if(text.length>8000)throw Error('Texto: máximo de 8000 caracteres.');if((readCommunity().groups[from]?.schedules||[]).length>=20)throw Error('Limite de 20 agendamentos por grupo.');
   const media=await captureCommunityMedia(info,download,conn);if(!media&&!text.trim())throw Error('Informe o texto ou responda a uma mídia.');
   const job={id:id(),time,text,media,enabled:true,createdBy:sender,at:Date.now()};
   try{updateCommunity(db=>communityGroup(db,from).schedules.push(job));}catch(e){deleteCommunityMedia(media);throw e;}
   await reply(`⏰ Agendamento ${job.id} criado: todos os dias às ${time} (São Paulo).`);return true;
  }
  if(!['on','off','del'].includes(action))throw Error('Use add, list, on, off ou del.');
  const target=rest.trim().toUpperCase();const previous=updateCommunity(db=>{const g=communityGroup(db,from),job=g.schedules.find(j=>j.id===target);if(!job)throw Error('ID não encontrado neste grupo.');if(action==='del')g.schedules=g.schedules.filter(j=>j.id!==target);else job.enabled=action==='on';return job;});if(action==='del')deleteCommunityMedia(previous.media);await reply(`⏰ Agendamento ${target}: ${action==='del'?'excluído':action.toUpperCase()}.`);return true;
 }
 if(custom){
  if(custom.permission==='dono'&&!ctx.isOwner)throw Error('Esse comando é exclusivo do dono.');
  if(custom.permission==='adm'&&(!ctx.isGroup||!ctx.isGroupAdmins))throw Error('Esse comando é exclusivo dos ADMs do grupo.');
  const text=renderCustom(custom.text,{user:ctx.pushname||sender.split('@')[0],group:ctx.groupName||'Privado',prefix,args:q});
  await sendCommunityContent(conn,from,{media:custom.media,text});return true;
 }
 }catch(error){await reply(`🐉 ${error.message||'Não consegui concluir essa operação.'}`);return true;}
 return false;
}
