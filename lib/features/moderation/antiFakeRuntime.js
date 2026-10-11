import { getAntiFakeConfig, checkAntiFakeParticipant } from './antiFake.js';
import { removeAntiLinkParticipant } from './antiLinkRemoval.js';
import { isWhitelisted } from './whitelist.js';
import { isMainOwnerJid, isLeaderJid } from '../../config/settingsStore.js';
import { addAdminLog } from './adminLogs.js';
const canonical=jid=>String(jid||'').replace(/:\d+(?=@)/,'');
const aliases=p=>[typeof p==='string'?p:null,p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).map(canonical);
export async function handleAntiFakeJoin(conn,event){
 if(event?.action!=='add'||!event.id?.endsWith('@g.us')||!getAntiFakeConfig(event.id).enabled)return [];
 const results=[];
 const metadata=await conn.groupMetadata(event.id);
 const botIds=[conn.user?.id,conn.user?.lid,conn.user?.phoneNumber].filter(Boolean).map(canonical);
 for(const id of [...botIds]){try{const pn=await conn.signalRepository?.lidMapping?.getPNForLID?.(id);if(pn)botIds.push(canonical(pn));}catch{}}
 const bot=(metadata.participants||[]).find(p=>aliases(p).some(id=>botIds.includes(id)));
 if(!bot?.admin&&!bot?.isAdmin&&!bot?.isSuperAdmin)return [{status:'bot-not-admin'}];
 for(const value of event.participants||[]){
  if(!getAntiFakeConfig(event.id).enabled)break;
  const member=(metadata.participants||[]).find(p=>aliases(p).some(id=>aliases(value).includes(id)));
  if(!member){results.push({status:'member-not-found'});continue;}
  if(member.admin||member.isAdmin||member.isSuperAdmin){results.push({status:'protected'});continue;}
  const check=await checkAntiFakeParticipant(conn,event.id,member);
  const identities=[...aliases(member),check.pnJid].filter(Boolean);
  if(identities.some(id=>botIds.includes(id)||isMainOwnerJid(id)||isLeaderJid(id)||isWhitelisted(event.id,id))){results.push({status:'protected'});continue;}
  if(!check.known){results.push({status:'unknown-phone'});continue;}
  if(check.allowed){results.push({status:'allowed'});continue;}
  if(!getAntiFakeConfig(event.id).enabled)break;
  const removal=await removeAntiLinkParticipant(conn,event.id,identities);
  results.push({status:removal.ok?'removed':'failed',jid:member.id||check.pnJid});
  addAdminLog(event.id,{type:removal.ok?'antifake_remove':'antifake_failure',actor:'Kobayashi AntiFake',target:member.id||check.pnJid,detail:removal.ok?'Número fora dos prefixos permitidos':removal.error||removal.reason});
  if(removal.ok)await conn.sendMessage(event.id,{text:`🐉🛡️ *ANTIFAKE*\n@${check.number} foi removido: o grupo permite números ${getAntiFakeConfig(event.id).allowedPrefixes.map(x=>'+'+x).join(', ')}.`,mentions:[check.pnJid]}).catch(e=>console.error('[ANTIFAKE aviso]',e.message));
 }
 return results;
}
export function installAntiFakeRuntime(conn){
 if(conn.__antiFakeRuntime)return;conn.__antiFakeRuntime=true;
 const queues=new Map();
 conn.ev.on('group-participants.update',event=>{
  if(event?.action!=='add'||!getAntiFakeConfig(event.id).enabled)return;
  const previous=queues.get(event.id)||Promise.resolve();
  const current=previous.then(()=>handleAntiFakeJoin(conn,event)).catch(e=>console.error('[ANTIFAKE]',e?.message||e));
  queues.set(event.id,current);current.finally(()=>{if(queues.get(event.id)===current)queues.delete(event.id);});
 });
}
