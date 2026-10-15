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
function log(g,type,target,actor,now,count,authoritative=false){const aliases=member(g,target).ids;const previous=g.events.findLast(e=>e.type===type&&aliases.includes(e.target)&&Math.abs(now-e.at)<10000);if(previous){if(actor&&(authoritative||!previous.actor))previous.actor=actor;return;}const entry={type,target,actor:actor||null,at:now,...(count?{count}:{})};g.events.push(entry);g.events=g.events.filter(e=>now-e.at<90*86400000).slice(-2000);return entry;}
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
 const db=read(),g=group(db,jid);if(!g.enabled)return [];const notices=[];for(const target of targets){const entry=log(g,action==='approve'?'approved':'rejected',target,actor,now,undefined,true);if(entry)notices.push(entry);g.pending=g.pending.filter(x=>x!==target);}save(db);return notices;
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
export function summarizeX9Entries(entries){
 const summaries=new Map(),other=[];const mentions=new Set();
 for(const e of entries.filter(isVisibleX9Event)){
  if(['approved','rejected'].includes(e.type)){const key=e.type+'|'+(e.actor||'unknown');const item=summaries.get(key)||{type:e.type,actor:e.actor,targets:new Set()};item.targets.add(e.target);summaries.set(key,item);}
  else{other.push(formatX9Entry(e));if(e.target)mentions.add(e.target);if(e.actor&&e.type!=='returned')mentions.add(e.actor);}
 }
 const lines=[...summaries.values()].map(e=>{const n=e.targets.size;if(e.actor)mentions.add(e.actor);return `${e.type==='approved'?'✅':'❌'} ${e.actor?'ADM @'+e.actor.split('@')[0]:'ADM não informado'} ${e.type==='approved'?'aceitou':'recusou'} ${n} ${n===1?'membro':'membros'}.`;});
 return {text:[...lines,...other].join('\n\n'),mentions:[...mentions]};
}
export function installX9Audit(conn){
 if(conn.__x9Audit)return;conn.__x9Audit=true;
 const buffers=new Map();
 conn.kobayashiX9Notify=(jid,entries)=>{
  entries=(entries||[]).filter(isVisibleX9Event);if(!entries.length)return Promise.resolve();
  const existing=buffers.get(jid);if(existing){existing.entries.push(...entries);return existing.promise;}
  let finish;const promise=new Promise(resolve=>{finish=resolve;});const batch={entries:[...entries],promise};buffers.set(jid,batch);
  setTimeout(async()=>{
   buffers.delete(jid);
   try{if(!isX9Enabled(jid))return;const g=read().groups[jid];const selected=new Map();
    for(const entry of batch.entries){const aliases=g?.members.find(m=>m.ids.includes(entry.target))?.ids||[entry.target];const latest=g?.events.findLast(e=>e.type===entry.type&&aliases.includes(e.target)&&Math.abs(e.at-entry.at)<10000)||entry;selected.set(latest.type+'|'+latest.target+'|'+latest.at,latest);}
    const summary=summarizeX9Entries([...selected.values()]);if(summary.text)await conn.sendMessage(jid,{text:summary.text,mentions:summary.mentions});
   }catch(e){console.error('[X9 aviso]',e.message);}finally{finish();}
  },1000);
  return promise;
 };
 const safe=fn=>event=>{try{const entries=fn(event);conn.kobayashiX9Notify(event.id,entries);}catch(e){console.error('[X9]',e.message);}};
 conn.ev.on('group-participants.update',safe(recordX9Participants));
 conn.ev.on('group.join-request',safe(recordX9Request));
 Promise.resolve().then(()=>conn.groupFetchAllParticipating()).then(seedX9Groups).catch(e=>console.error('[X9 snapshot]',e.message));
}
