import path from 'node:path';
import {readJsonFile,writeJsonFile} from '../../core/jsonStore.js';
import {clockSP,validTime} from '../community/store.js';
import {currentGroupAdmin} from '../access/groupCommandAccess.js';
const file=()=>path.join(process.cwd(),'files/database/partnership-links.json');
const read=()=>readJsonFile(file(),{});
const clean=id=>String(id||'').replace(/:\d+(?=@)/,'');
export function inviteCode(link){const match=String(link||'').trim().match(/^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]{10,64})(?:\?[^\s]*)?$/i);return match?.[1]||null;}
export async function resolveInvite(conn,link){const code=inviteCode(link);if(!code)throw Error('Informe um link válido: https://chat.whatsapp.com/CODIGO');const metadata=await conn.groupGetInviteInfo(code);if(!metadata?.id?.endsWith('@g.us')||!metadata.subject)throw Error('Não consegui consultar o convite. Confira se ele ainda é válido.');return {code,metadata,link:`https://chat.whatsapp.com/${code}`};}
export async function sendInviteLink(conn,to,invite,{quoted,mentions=[],caption='🐉 Venha conhecer o grupo!'}={}){
 const link=invite.link||`https://chat.whatsapp.com/${invite.code}`;
 await conn.sendMessage(to,{text:`${caption}\n\n${invite.metadata.subject}\n${link}`,mentions:[...new Set(mentions)]},quoted?{quoted}:{});
}
export async function configurePartnership(ctx,now=Date.now()){
 const {conn,from,sender,prefix='/',reply,q=''}=ctx;
 if(!ctx.isGroup) return reply('Use este comando no grupo que receberá a parceria.');
 if(!await currentGroupAdmin(conn,from,[sender,...(ctx.identities||[])]))return reply('🔒 Apenas ADM deste grupo pode configurar a parceria.');
 const args=q.trim().split(/\s+/),action=args[0]?.toLowerCase(),db=read(),current=db[from];
 if(!action||action==='status')return reply(current?`🤝 Parceria ${current.enabled?'ON':'OFF'}\nGrupo: ${current.name}\nLink: ${current.link}\nTodos os dias às ${current.time} (São Paulo).\nÚltimo resultado: ${current.lastResult||'ainda não enviado'}`:`Use ${prefix}link-parceria on LINK 20:00\n${prefix}link-parceria off\n${prefix}link-parceria status`);
 if(action==='off') {if(current){current.enabled=false;writeJsonFile(file(),db);}return reply('🤝 Parceria diária desativada neste grupo.');}
 if(action!=='on')return reply(`Use ${prefix}link-parceria on LINK 20:00 ou ${prefix}link-parceria off.`);
 let link=args[1],time=args[2];
 if(!link&&!time&&current){link=current.link;time=current.time;}
 if(args.length>3||!validTime(time||''))return reply('Informe o link e horário no formato HH:MM. Exemplo: /link-parceria on LINK 20:00');
 const invite=await resolveInvite(conn,link);const clock=clockSP(now),latest=read();
 latest[from]={...latest[from],enabled:true,link:invite.link,name:invite.metadata.subject,time,by:sender,configuredAt:now,lastDay:latest[from]?.lastDay===clock.day||clock.time>=time?clock.day:'',lastResult:'agendado'};
 writeJsonFile(file(),latest);
 return reply(`🤝 Parceria ativada!\nGrupo: ${invite.metadata.subject}\nDiariamente às ${time} (São Paulo).\nEnviarei o convite neste grupo, marcando todos.\n${prefix}link-parceria off para desativar.`);
}
const running=new WeakSet();
export async function tickPartnerships(conn,now=Date.now(),{send=sendInviteLink}={}){
 if(running.has(conn))return [];running.add(conn);const reports=[];
 try{const clock=clockSP(now);for(const [jid,snapshot] of Object.entries(read())){
 if(!snapshot.enabled||!validTime(snapshot.time)||clock.time<snapshot.time||snapshot.lastDay===clock.day)continue;
 // Reserva persistente antes do envio: não repete ao reiniciar ou em falha ambígua.
 const db=read(),job=db[jid];if(!job?.enabled||job.lastDay===clock.day||job.configuredAt!==snapshot.configuredAt)continue;
 job.lastDay=clock.day;job.lastResult='envio iniciado; sem confirmação';writeJsonFile(file(),db);
 try{const invite=await resolveInvite(conn,job.link);const metadata=await conn.groupMetadata(jid);const mentions=[...new Set((metadata.participants||[]).map(p=>clean(p.id||p.jid||p.lid||p.phoneNumber)).filter(Boolean))];
 const latest=read()[jid];if(!latest?.enabled||latest.configuredAt!==job.configuredAt){reports.push({jid,status:'cancelled'});continue;}
 await send(conn,jid,invite,{mentions,now,caption:'🤝🐉 PARCERIA DO GRUPO\nConheça nosso parceiro!'});
 const fresh=read();if(fresh[jid]?.configuredAt===job.configuredAt){fresh[jid].lastResult='enviado';writeJsonFile(file(),fresh);}reports.push({jid,status:'sent'});
 }catch(error){const fresh=read();if(fresh[jid]?.configuredAt===job.configuredAt){fresh[jid].lastResult='falha: '+String(error?.message||error).slice(0,180);writeJsonFile(file(),fresh);}reports.push({jid,status:'failed'});console.error('[Parceria]',error?.message);}
 }}finally{running.delete(conn);}return reports;
}
