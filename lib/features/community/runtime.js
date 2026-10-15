import {randomInt,randomBytes} from 'node:crypto';
import {readCommunity,updateCommunity,communityGroup,cleanJid,clockSP,dueSchedule} from './store.js';
import {sendCommunityContent} from './media.js';
import {getAntiFakeConfig,checkAntiFakeParticipant} from '../moderation/antiFake.js';
import {recordX9Decision} from '../group/x9Audit.js';
import {unwrapGlobalMessage} from '../system/globalMessage.js';
export async function communityIdentities(conn,...values){const set=new Set(values.filter(Boolean).map(cleanJid));for(const id of [...set])try{const map=conn.signalRepository?.lidMapping;const alias=id.endsWith('@lid')?await map?.getPNForLID?.(id):await map?.getLIDForPN?.(id);if(alias)set.add(cleanJid(alias));}catch{}return [...set];}
export async function isCommunityBotAdmin(conn,group){const botIds=await communityIdentities(conn,conn.user?.id,conn.user?.lid,conn.user?.phoneNumber);const meta=await conn.groupMetadata(group);for(const p of meta.participants||[]){const ids=await communityIdentities(conn,p.id,p.lid,p.phoneNumber,p.jid);if(ids.some(id=>botIds.includes(id)))return Boolean(p.admin||p.isAdmin||p.isSuperAdmin);}return false;}
const pendingJid=p=>p?.jid||p?.id||p?.participant||p?.lid;
export async function createCaptcha(conn,event,{resend=false,now=Date.now()}={}){
 const group=event.id,user=cleanJid(event.participant);if(event.action!=='created'||!user||!readCommunity().groups[group]?.captcha)return;
 if(!await isCommunityBotAdmin(conn,group))return;
 const aliases=await communityIdentities(conn,user,event.participantPn);
 const list=readCommunity();const previous=Object.values(list.challenges).find(ch=>ch.group===group&&ch.ids.some(id=>aliases.includes(id))&&['pending','delivery_failed','manual'].includes(ch.status));
 if(previous?.status==='pending'&&previous.expiresAt>now){if(resend)await sendChallenge(conn,previous);return;}
 if(Object.values(list.challenges).filter(ch=>ch.group===group&&ch.status==='pending').length>=100)return;
 const a=randomInt(1,21),b=randomInt(1,21);const ch={id:randomBytes(3).toString('hex').toUpperCase(),group,user,ids:aliases,a,b,answer:a+b,expiresAt:now+300000,status:'pending',at:now};
 updateCommunity(db=>{if(previous)db.challenges[previous.id].status='replaced';for(const [key,item] of Object.entries(db.challenges))if(item.expiresAt<now-86400000)delete db.challenges[key];db.challenges[ch.id]=ch;});
 await sendChallenge(conn,ch);
}
async function sendChallenge(conn,ch){try{const meta=await conn.groupMetadata(ch.group);const destination=ch.ids.find(id=>id.endsWith('@s.whatsapp.net'))||ch.user;await conn.sendMessage(destination,{text:`🐉🔐 *PORTÃO KOBAYASHI*\nGrupo: ${meta.subject||ch.group}\n\nQuanto é ${ch.a} + ${ch.b}?\nResponda aqui: *${ch.id} SUA_RESPOSTA*\nExemplo de formato: ${ch.id} 42\n\nVocê tem 5 minutos. Uma resposta errada ou prazo vencido recusa a solicitação.`});}catch(e){updateCommunity(db=>{if(db.challenges[ch.id]?.status==='pending')db.challenges[ch.id].status='delivery_failed';});console.error('[CAPTCHA envio]',e.message);}}
export async function decideCaptcha(conn,ch,approve,now=Date.now()){
 if(!readCommunity().groups[ch.group]?.captcha)return;
 if(!await isCommunityBotAdmin(conn,ch.group))throw Error('O bot perdeu a permissão de ADM. Um ADM precisa revisar a solicitação.');
 const pending=await conn.groupRequestParticipantsList(ch.group);const match=(pending||[]).find(p=>ch.ids.includes(cleanJid(pendingJid(p)))||ch.ids.includes(cleanJid(p.phoneNumber)));
 if(!match){updateCommunity(db=>{if(db.challenges[ch.id])db.challenges[ch.id].status='resolved-externally';});return 'A solicitação já foi resolvida por um ADM ou cancelada.';}
 if(approve&&getAntiFakeConfig(ch.group).enabled){const phone=ch.ids.find(x=>x.endsWith('@s.whatsapp.net'))||ch.user;const result=await checkAntiFakeParticipant(conn,ch.group,phone);if(!result.known)throw Error('Telefone não identificado para o antifake. Um ADM precisa revisar.');if(!result.allowed)approve=false;}
 if(!readCommunity().groups[ch.group]?.captcha)return 'O captcha foi desligado pelo ADM.';
 updateCommunity(db=>{if(db.challenges[ch.id])db.challenges[ch.id].status='processing';});
 const target=pendingJid(match),action=approve?'approve':'reject';
 let results;
 try{results=await conn.groupRequestParticipantsUpdate(ch.group,[target],action);}catch(error){updateCommunity(db=>{if(db.challenges[ch.id]){db.challenges[ch.id].status='manual';db.challenges[ch.id].error=String(error.message||error).slice(0,160);}});throw error;}
 const ok=(results||[]).some(r=>String(r.status)==='200');
 updateCommunity(db=>{if(db.challenges[ch.id]){db.challenges[ch.id].status=ok?(approve?'approved':'rejected'):'manual';db.challenges[ch.id].decidedAt=now;}});
 if(!ok)throw Error('O WhatsApp não confirmou a decisão. Um ADM precisa revisar.');
 const notices=recordX9Decision(ch.group,[target],cleanJid(conn.user?.id),action);await conn.kobayashiX9Notify?.(ch.group,notices);
 return approve?'✅ Resposta correta! Sua solicitação foi aprovada.':'❌ Solicitação recusada: resposta errada, prazo vencido ou regra do antifake.';
}
export async function handleCaptchaMessage(conn,info,now=Date.now()){
 const remote=info.key?.remoteJid;if(!remote||remote.endsWith('@g.us')||remote==='status@broadcast'||info.key.fromMe)return false;
 const message=unwrapGlobalMessage(info.message);const text=String(message.conversation||message.extendedTextMessage?.text||'').trim();
 const match=text.match(/^(?:\/?captcha-responder\s+)?([A-F0-9]{6})\s+(-?\d{1,4})$/i),onlyAnswer=text.match(/^-?\d{1,4}$/);
 if(!match&&!onlyAnswer)return false;
 const identities=await communityIdentities(conn,remote,info.key.remoteJidAlt);const pending=Object.values(readCommunity().challenges).filter(ch=>ch.status==='pending'&&ch.ids.some(id=>identities.includes(id))&&readCommunity().groups[ch.group]?.captcha);
 if(!pending.length)return false;
 const ch=match?pending.find(ch=>ch.id===match[1].toUpperCase()):pending.length===1?pending[0]:null;
 if(!ch){await conn.sendMessage(remote,{text:'🔐 Informe o código e a resposta: CODIGO NÚMERO. Use o código do desafio enviado para o grupo desejado.'});return true;}
 try{const answer=Number(match?match[2]:text);const result=await decideCaptcha(conn,ch,now<ch.expiresAt&&answer===ch.answer,now);if(result)await conn.sendMessage(remote,{text:result});}catch(e){updateCommunity(db=>{if(db.challenges[ch.id]?.status==='pending')db.challenges[ch.id].status='manual';});await conn.sendMessage(remote,{text:`🔐 ${e.message||'Um ADM precisa revisar sua solicitação.'}`});}return true;
}
export async function tickCommunity(conn,now=Date.now()){
 const snapshot=readCommunity();
 for(const ch of Object.values(snapshot.challenges).filter(ch=>ch.status==='pending'&&ch.expiresAt<=now)){
  try{await decideCaptcha(conn,ch,false,now);}catch(e){updateCommunity(db=>{if(db.challenges[ch.id]){db.challenges[ch.id].status='manual';db.challenges[ch.id].error=String(e.message||e).slice(0,160);}});}
 }
 for(const [jid,g] of Object.entries(readCommunity().groups))for(const job of g.schedules||[]){
  if(!dueSchedule(job,now))continue;
  // Reserva antes do envio: reiniciar ou uma falha ambígua não repete a mesma mensagem no dia.
  const claimed=updateCommunity(db=>{const current=communityGroup(db,jid).schedules.find(j=>j.id===job.id);if(!current||!dueSchedule(current,now))return false;current.lastDay=clockSP(now).day;current.lastResult='envio iniciado; sem confirmação';return true;});if(!claimed)continue;
  try{await sendCommunityContent(conn,jid,job);updateCommunity(db=>{const current=communityGroup(db,jid).schedules.find(j=>j.id===job.id);if(current)current.lastResult='enviado';});}catch(e){updateCommunity(db=>{const current=communityGroup(db,jid).schedules.find(j=>j.id===job.id);if(current)current.lastResult='falha: '+String(e.message||e).slice(0,120);});}
 }
}
export function installCommunityRuntime(conn){
 if(conn.__communityRuntime)return;conn.__communityRuntime=true;let serial=Promise.resolve(),timer=null;
 const enqueue=fn=>{const task=serial.then(fn);serial=task.catch(e=>console.error('[COMUNIDADE]',e?.message||e));return task;};
 conn.kobayashiCaptchaMessage=info=>enqueue(()=>handleCaptchaMessage(conn,info));
 conn.kobayashiCaptchaSync=(group,resend=false)=>enqueue(async()=>{const list=await conn.groupRequestParticipantsList(group);for(const p of list||[])await createCaptcha(conn,{id:group,participant:pendingJid(p),participantPn:p.phoneNumber,action:'created'},{resend});});
 conn.ev.on('group.join-request',event=>{if(event.action==='created')enqueue(()=>createCaptcha(conn,event)).catch(()=>{});});
 conn.ev.on('connection.update',({connection})=>{
  if(connection==='close'){if(timer)clearInterval(timer);timer=null;return;}
  if(connection!=='open'||timer)return;
  updateCommunity(db=>{for(const ch of Object.values(db.challenges))if(ch.status==='processing')ch.status='manual';});
  let ticking=false;const tick=()=>{if(ticking)return;ticking=true;enqueue(()=>tickCommunity(conn)).catch(()=>{}).finally(()=>{ticking=false;});};
  timer=setInterval(tick,30000);timer.unref?.();tick();
 });
}
