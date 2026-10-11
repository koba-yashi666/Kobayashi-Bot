import fs from 'node:fs';
import path from 'node:path';
const dbPath=()=>path.join(process.cwd(),'files/database/x9-audit.json');
const ids=p=>typeof p==='string'?[p]:[p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean);
function read(){if(!fs.existsSync(dbPath()))return {groups:{}};return JSON.parse(fs.readFileSync(dbPath(),'utf8'));}
function save(db){fs.mkdirSync(path.dirname(dbPath()),{recursive:true});fs.writeFileSync(dbPath()+'.tmp',JSON.stringify(db,null,2));fs.renameSync(dbPath()+'.tmp',dbPath());}
function group(db,jid){return db.groups[jid]??= {members:[],pending:[],events:[]};}
function member(g,p){const aliases=ids(p);let m=g.members.find(m=>m.ids.some(id=>aliases.includes(id)));if(!m){m={ids:aliases,count:0,present:false};g.members.push(m);}else m.ids=[...new Set([...m.ids,...aliases])];return m;}
function log(g,type,target,actor,now){const previous=g.events.findLast(e=>e.type===type&&e.target===target&&now-e.at<10000);if(previous){if(actor&&!previous.actor)previous.actor=actor;return;}g.events.push({type,target,actor:actor||null,at:now});g.events=g.events.filter(e=>now-e.at<90*86400000).slice(-2000);}
export function seedX9Groups(groups){const db=read();for(const [jid,metadata] of Object.entries(groups||{})){if(!jid.endsWith('@g.us'))continue;const g=group(db,jid);for(const p of metadata.participants||[]){const m=member(g,p);m.count=Math.max(m.count,1);m.present=true;}}save(db);}
export function recordX9Participants(event,now=Date.now()) {
 if(!event?.id?.endsWith('@g.us'))return;
 const db=read(),g=group(db,event.id);
 for(const p of event.participants||[]){const target=ids(p)[0];if(!target)continue;const m=member(g,p);
  if(event.action==='add'){
   const pending=g.pending.find(x=>m.ids.includes(x));
   if(pending){log(g,'approved',target,event.author||event.authorPn,now);g.pending=g.pending.filter(x=>!m.ids.includes(x));}
   if(!m.present){m.count++;m.present=true;if(m.count>=2)log(g,'returned',target,event.author||event.authorPn,now);}
  }else if(event.action==='remove'){
   m.present=false;
   log(g,event.author&&m.ids.includes(event.author)?'left':event.author?'removed':'exit_unknown',target,event.author||event.authorPn,now);
  }else if(event.action==='demote')log(g,'demoted',target,event.author||event.authorPn,now);
 }
 save(db);
}
export function recordX9Request(event,now=Date.now()) {
 if(!event?.id?.endsWith('@g.us'))return;
 const db=read(),g=group(db,event.id);const target=ids(event.participant)[0];if(!target)return;
 member(g,{id:target,phoneNumber:event.participantPn});
 if(event.action==='created'){if(!g.pending.includes(target))g.pending.push(target);}
 else if(event.action==='rejected'){log(g,'rejected',target,event.author||event.authorPn,now);g.pending=g.pending.filter(x=>x!==target);}
 else if(event.action==='revoked')g.pending=g.pending.filter(x=>x!==target);
 save(db);
}
export function recordX9Decision(jid,targets,actor,action,now=Date.now()){
 const db=read(),g=group(db,jid);for(const target of targets){log(g,action==='approve'?'approved':'rejected',target,actor,now);g.pending=g.pending.filter(x=>x!==target);}save(db);
}
export function getX9Events(jid,filter='todos',limit=15,now=Date.now()){
 const types={solicitacoes:['approved','rejected'],adms:['removed','demoted','exit_unknown'],reentradas:['returned']};
 return (read().groups[jid]?.events||[]).filter(e=>now-e.at<90*86400000&&(!types[filter]||types[filter].includes(e.type))).slice(-limit).reverse();
}
export function installX9Audit(conn){
 if(conn.__x9Audit)return;conn.__x9Audit=true;
 const safe=fn=>(...args)=>{try{fn(...args);}catch(e){console.error('[X9]',e.message);}};
 conn.ev.on('group-participants.update',safe(recordX9Participants));
 conn.ev.on('group.join-request',safe(recordX9Request));
 Promise.resolve().then(()=>conn.groupFetchAllParticipating()).then(safe(seedX9Groups)).catch(e=>console.error('[X9 snapshot]',e.message));
}
