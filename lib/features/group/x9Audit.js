import fs from 'node:fs';
import path from 'node:path';
const visibleTypes=new Set(['approved','rejected','promoted','demoted','returned']);
export const isVisibleX9Event=e=>visibleTypes.has(e?.type)&&(e.type!=='returned'||e.count===undefined||e.count>=2);
const dbPath=()=>path.join(process.cwd(),'files/database/x9-audit.json');
const ids=p=>typeof p==='string'?[p]:[p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean);
function read(){if(!fs.existsSync(dbPath()))return {groups:{}};return JSON.parse(fs.readFileSync(dbPath(),'utf8'));}
function save(db){fs.mkdirSync(path.dirname(dbPath()),{recursive:true});fs.writeFileSync(dbPath()+'.tmp',JSON.stringify(db,null,2));fs.renameSync(dbPath()+'.tmp',dbPath());}
function group(db,jid){return db.groups[jid]??= {enabled:false,members:[],pending:[],events:[]};}
export function isX9Enabled(jid){return read().groups[jid]?.enabled===true;}
export function setX9Enabled(jid,enabled,participants=[]){const db=read(),g=group(db,jid);g.enabled=enabled;g.pending=[];if(enabled){for(const m of g.members)m.present=false;for(const p of participants){const m=member(g,p);m.count=Math.max(m.count,1);m.present=true;}}save(db);}
function member(g,p){const aliases=ids(p);let m=g.members.find(m=>m.ids.some(id=>aliases.includes(id)));if(!m){m={ids:aliases,count:0,present:false};g.members.push(m);}else m.ids=[...new Set([...m.ids,...aliases])];return m;}
function log(g,type,target,actor,now,count){const previous=g.events.findLast(e=>e.type===type&&e.target===target&&now-e.at<10000);if(previous){if(actor&&!previous.actor)previous.actor=actor;return;}const entry={type,target,actor:actor||null,at:now,...(count?{count}:{})};g.events.push(entry);g.events=g.events.filter(e=>now-e.at<90*86400000).slice(-2000);return entry;}
export function seedX9Groups(groups){const db=read();for(const [jid,metadata] of Object.entries(groups||{})){if(!jid.endsWith('@g.us'))continue;const g=group(db,jid);if(!g.enabled)continue;for(const p of metadata.participants||[]){const m=member(g,p);m.count=Math.max(m.count,1);m.present=true;}}save(db);}
export function recordX9Participants(event,now=Date.now()) {
 if(!event?.id?.endsWith('@g.us'))return;
 const db=read(),g=group(db,event.id);if(!g.enabled)return [];const notices=[];const add=(...args)=>{const entry=log(g,...args);if(entry)notices.push(entry);};
 for(const p of event.participants||[]){const target=ids(p)[0];if(!target)continue;const m=member(g,p);
  if(event.action==='add'){
   const pending=g.pending.find(x=>m.ids.includes(x));
   if(pending){add('approved',target,event.author||event.authorPn,now);g.pending=g.pending.filter(x=>!m.ids.includes(x));}
   if(!m.present){m.count++;m.present=true;if(m.count>=2)add('returned',target,event.author||event.authorPn,now,m.count);}
  }else if(event.action==='remove'){
   m.present=false;
   // A saída só atualiza presença para reconhecer uma futura reentrada; sem denúncia.
  }else if(event.action==='promote')add('promoted',target,event.author||event.authorPn,now);
  else if(event.action==='demote')add('demoted',target,event.author||event.authorPn,now);
 }
 save(db);return notices;
}
export function recordX9Request(event,now=Date.now()) {
 if(!event?.id?.endsWith('@g.us'))return;
 const db=read(),g=group(db,event.id);if(!g.enabled)return [];const notices=[];const target=ids(event.participant)[0];if(!target)return;
 member(g,{id:target,phoneNumber:event.participantPn});
 if(event.action==='created'){if(!g.pending.includes(target))g.pending.push(target);}
 else if(event.action==='rejected'){const entry=log(g,'rejected',target,event.author||event.authorPn,now);if(entry)notices.push(entry);g.pending=g.pending.filter(x=>x!==target);}
 else if(event.action==='revoked')g.pending=g.pending.filter(x=>x!==target);
 save(db);return notices;
}
export function recordX9Decision(jid,targets,actor,action,now=Date.now()){
 const db=read(),g=group(db,jid);if(!g.enabled)return [];const notices=[];for(const target of targets){const entry=log(g,action==='approve'?'approved':'rejected',target,actor,now);if(entry)notices.push(entry);g.pending=g.pending.filter(x=>x!==target);}save(db);return notices;
}
export function getX9Events(jid,filter='todos',limit=15,now=Date.now()){
 const types={solicitacoes:['approved','rejected'],adms:['approved','rejected','demoted','promoted'],reentradas:['returned'],entradas:['returned']};
 return (read().groups[jid]?.events||[]).filter(e=>isVisibleX9Event(e)&&now-e.at<90*86400000&&(!types[filter]||types[filter].includes(e.type))).slice(-limit).reverse();
}
export function formatX9Entry(e){
 if(!isVisibleX9Event(e))return '';
 if(e.type==='returned')return `🔄 *REENTRADA NO GRUPO*\n👤 @${e.target.split('@')[0]}${e.count?` • ${e.count}ª entrada registrada`:''}`;
 const labels={approved:'✅ Solicitação aceita',rejected:'❌ Solicitação recusada',removed:'🚫 Membro removido',demoted:'⬇️ ADM rebaixado',promoted:'👑 Promovido a ADM',returned:'🔄 Voltou ao grupo',joined:'🐉 Entrou no grupo',left:'🚪 Saiu do grupo',exit_unknown:'🚪 Saída/remoção'};
 return `${labels[e.type]||e.type}\n👤 @${e.target.split('@')[0]}${e.count?` • ${e.count}ª entrada registrada`:''}\n🛡️ Por: ${e.actor?'@'+e.actor.split('@')[0]:'não informado pelo WhatsApp'}`;
}
export function installX9Audit(conn){
 if(conn.__x9Audit)return;conn.__x9Audit=true;
 let queue=Promise.resolve();
 conn.kobayashiX9Notify=(jid,entries)=>{
  entries=(entries||[]).filter(isVisibleX9Event);
  if(!entries.length)return queue;
  queue=queue.then(async()=>{if(!isX9Enabled(jid))return;const shown=entries.slice(0,20);await conn.sendMessage(jid,{text:`╭─ 🐉👁️ X9 ATIVO ─╮\n\n${shown.map(formatX9Entry).join('\n\n')}${entries.length>20?`\n\nMais ${entries.length-20} registros no /x9.`:''}\n╰─ ☕ Kobayashi Bot ─╯`,mentions:[...new Set(shown.flatMap(e=>[e.target,e.actor]).filter(Boolean))]});}).catch(e=>console.error('[X9 aviso]',e.message));return queue;
 };
 const safe=fn=>event=>{try{const entries=fn(event);conn.kobayashiX9Notify(event.id,entries);}catch(e){console.error('[X9]',e.message);}};
 conn.ev.on('group-participants.update',safe(recordX9Participants));
 conn.ev.on('group.join-request',safe(recordX9Request));
 Promise.resolve().then(()=>conn.groupFetchAllParticipating()).then(seedX9Groups).catch(e=>console.error('[X9 snapshot]',e.message));
}
