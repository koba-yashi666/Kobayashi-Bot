import { getMuteState, muteUser, unmuteUser } from './yuriProtection.js';
import { createPurgeResolver } from './groupPurge.js';
import { removeAntiLinkParticipant } from './antiLinkRemoval.js';
import { protectedRemovalMessage } from './removalProtection.js';
import { resolveActivityTarget } from '../social/activityTarget.js';

const pending=new Set();
const ids=p=>[p?.id,p?.jid,p?.lid,p?.phoneNumber,p?.participant].filter(Boolean).map(x=>String(x).replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net'));
const admin=p=>Boolean(p?.admin||p?.isAdmin||p?.isSuperAdmin);
async function identify(conn,group,identities){
  const expand=createPurgeResolver(conn),aliases=new Set();
  for(const id of identities)for(const x of await expand(id))aliases.add(x);
  const metadata=await conn.groupMetadata(group);
  const botIds=await expand({id:conn.user?.id,lid:conn.user?.lid,phoneNumber:conn.user?.phoneNumber});
  let member,bot;
  for(const p of metadata.participants||[]){
    const expanded=await expand(p);
    if(expanded.some(id=>aliases.has(id)))member=p;
    if(expanded.some(id=>botIds.includes(id)))bot=p;
  }
  if(member)for(const x of await expand(member))aliases.add(x);
  return {metadata,member,bot,aliases:[...aliases],botIds};
}

export async function handleMuteCommand(ctx){
  if(!ctx.isGroup)return ctx.reply('Este comando só funciona em grupos.');
  if(!ctx.isAdmin)return ctx.reply('🛡️ Apenas administradores podem usar este comando.');
  const release=['desmutar','desmute','unmute'].includes(ctx.command);
  try{
    const selected=await resolveActivityTarget({info:ctx.info,sender:null});
    const digits=String(ctx.q||'').trim().replace(/[+\s().-]/g,'');
    const target=selected.target||(/^\d{8,15}$/.test(digits)?digits+'@s.whatsapp.net':null);
    if(!target)return ctx.reply(`Use ${ctx.prefix}${ctx.command} @membro ou responda à mensagem da pessoa.`);
    const data=await identify(ctx.conn,ctx.from,[target,...selected.aliases].filter(Boolean));
    if(release){
      const removed=unmuteUser(ctx.from,data.aliases);
      return ctx.reply(removed?'🔊 Mute removido. A pessoa pode enviar mensagens novamente.':'Essa pessoa não está mutada neste grupo.');
    }
    // Revalida o cargo do autor e do bot com metadados atuais.
    if(!ctx.isOwner){
      const author=await identify(ctx.conn,ctx.from,ctx.authorIds);
      if(!admin(author.member))return ctx.reply('🛡️ Apenas administradores podem aplicar mute.');
    }
    if(!admin(data.bot))return ctx.reply('🛡️ A Kobayashi precisa ser ADM para apagar mensagens e remover membros.');
    if(!data.member)return ctx.reply('Não encontrei essa pessoa no grupo.');
    if(data.aliases.some(id=>data.botIds.includes(id)))return ctx.reply('Não posso mutar a mim mesma.');
    const protectedMessage=await protectedRemovalMessage(ctx.conn,ctx.from,target,{participants:data.metadata.participants});
    if(protectedMessage)return ctx.reply(protectedMessage);
    if(admin(data.member))return ctx.reply('🛡️ Não vou mutar outro administrador.');
    if(data.aliases.some(id=>ctx.isWhitelisted(id)))return ctx.reply('🛡️ Essa pessoa está protegida pela lista branca.');
    const ban=ctx.command==='muteb';
    muteUser(ctx.from,target,{mode:ban?'ban':'delete',aliases:data.aliases});
    return ctx.conn.sendMessage(ctx.from,{text:ban?`🔇🚫 @${target.split('@')[0]} recebeu mute com banimento. Se enviar mensagem, ela será apagada e a pessoa será removida.`:`🔇 @${target.split('@')[0]} foi mutado. As novas mensagens serão apagadas automaticamente até usar ${ctx.prefix}desmute.`,mentions:[target]},{quoted:ctx.info});
  }catch(error){
    console.error('[MUTE comando]',error?.message);
    return ctx.reply('Não consegui concluir o mute. Confira se a Kobayashi é ADM e tente novamente.');
  }
}

export async function handleMutedMessage({conn,info,group,identities,protectedMember=false,isWhitelisted=()=>false}){
  if(info.key?.fromMe||protectedMember)return {handled:false};
  const expand=createPurgeResolver(conn),aliases=new Set();
  for(const id of identities)for(const x of await expand(id))aliases.add(x);
  const state=getMuteState(group,[...aliases]);
  if(!state)return {handled:false};
  let data;
  try{data=await identify(conn,group,state.aliases);}catch{return {handled:true,reason:'metadata'};}
  if(admin(data.member)||data.aliases.some(isWhitelisted)||data.aliases.some(id=>data.botIds.includes(id)))return {handled:false};
  if(await protectedRemovalMessage(conn,group,data.aliases[0],{participants:data.metadata.participants}))return {handled:false};
  if(!admin(data.bot))return {handled:true,reason:'bot-not-admin'};
  let deleted=false;
  try{await conn.sendMessage(group,{delete:{...info.key,remoteJid:group,fromMe:false,participant:info.key.participant||info.key.participantAlt||identities[0]}});deleted=true;}
  catch(error){console.error('[MUTE apagar]',error?.message);}
  if(state.mode!=='ban')return {handled:true,deleted};
  const lock=group+'|'+state.aliases.slice().sort().join(',');
  if(pending.has(lock))return {handled:true,deleted};
  pending.add(lock);
  try{
    const result=await removeAntiLinkParticipant(conn,group,data.aliases);
    return {handled:true,deleted,removed:result.ok};
  }finally{pending.delete(lock);}
}
