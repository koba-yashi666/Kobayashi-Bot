import { loadFunDb, saveFunDb } from './dragonFunV09.js';

const DAY=86400000, TTL=30*60*1000;
export const relationshipId=value=>String(value||'').replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');
const valid=id=>/^\d+@(s\.whatsapp\.net|lid)$/.test(id);
const partnerOf=value=>typeof value==='string'?value:value?.partner;
function clearRequests(db,people){
  const set=new Set(people);
  for(const key of ['proposals','datingProposals'])for(const [to,p] of Object.entries(db[key]))if(set.has(to)||set.has(p.from))delete db[key][to];
}
function read(){
  const db=loadFunDb();
  for(const key of ['proposals','datingProposals'])for(const [to,p] of Object.entries(db[key]))if(!p||!valid(p.from)||!valid(to)||p.from===to||!Number.isFinite(Number(p.at))||Date.now()-Number(p.at)>TTL)delete db[key][to];
  return db;
}
const occupied=(db,id)=>Boolean(db.marriages[id]||db.dating[id]);

// Somente aliases do autor/alvo confirmados pelo envelope ou pelo resolvedor do bot.
export function mergeRelationshipAliases(groups){
  const db=loadFunDb(),map=new Map();
  for(const [primary,...aliases] of groups){const target=relationshipId(primary);if(!valid(target))continue;for(const alias of [primary,...aliases])if(valid(relationshipId(alias)))map.set(relationshipId(alias),target);}
  const id=value=>map.get(relationshipId(value))||relationshipId(value);
  for(const type of ['dating','marriages']){
    const out={};
    for(const [key,value] of Object.entries(db[type])){
      const who=id(key),partner=id(partnerOf(value));
      if(!valid(who)||!valid(partner)||who===partner)continue;
      if(out[who]&&partnerOf(out[who])!==partner)return {ok:false,reason:'conflito'};
      out[who]=type==='dating'?{...value,partner}:partner;
    }
    db[type]=out;
  }
  for(const type of ['proposals','datingProposals']){
    const out={};for(const [key,p] of Object.entries(db[type])){
      const who=id(key);if(!p)continue;
      const item={...p,from:id(p.from)};
      if(!out[who]||Number(item.at)>Number(out[who].at))out[who]=item;
    }db[type]=out;
  }
  saveFunDb(db);return {ok:true};
}
export function proposeDating(from,to){
  from=relationshipId(from);to=relationshipId(to);const db=read();
  if(!valid(from)||!valid(to))return{ok:false,reason:'invalid'};
  if(from===to)return{ok:false,reason:'self'};
  if(db.marriages[from]||db.marriages[to])return{ok:false,reason:'casado'};
  if(db.dating[from]||db.dating[to])return{ok:false,reason:'namorando'};
  if(Object.entries(db.datingProposals).some(([recipient,p])=>[from,to].includes(recipient)||[from,to].includes(p.from)))return{ok:false,reason:'pendente'};
  db.datingProposals[to]={from,at:Date.now()};saveFunDb(db);return{ok:true};
}
export function acceptDating(jid){
  jid=relationshipId(jid);const db=read(),p=db.datingProposals[jid];
  if(!p)return{ok:false,reason:'none'};
  if(occupied(db,jid)||occupied(db,p.from)){delete db.datingProposals[jid];saveFunDb(db);return{ok:false,reason:'indisponivel'};}
  const since=Date.now();db.dating[jid]={partner:p.from,since};db.dating[p.from]={partner:jid,since};clearRequests(db,[jid,p.from]);saveFunDb(db);return{ok:true,partner:p.from,since};
}
export function datingOf(jid){return read().dating[relationshipId(jid)]||null;}
function marriageReady(db,a,b){
  if(db.marriages[a]||db.marriages[b])return{ok:false,reason:'casado'};
  const x=db.dating[a],y=db.dating[b];
  if(x?.partner!==b||y?.partner!==a)return{ok:false,reason:'nao_namoram'};
  const since=Math.max(Number(x.since),Number(y.since));
  if(!Number.isFinite(since)||since<=0)return{ok:false,reason:'data'};
  const remainingMs=DAY-(Date.now()-since);return remainingMs>0?{ok:false,reason:'tempo',remainingMs}:{ok:true};
}
export function proposeMarriage(from,to){
  from=relationshipId(from);to=relationshipId(to);const db=read();
  if(!valid(from)||!valid(to)||from===to)return{ok:false,reason:'self'};
  const ready=marriageReady(db,from,to);if(!ready.ok)return ready;
  if(Object.entries(db.proposals).some(([recipient,p])=>[from,to].includes(recipient)||[from,to].includes(p.from)))return{ok:false,reason:'pendente'};
  db.proposals[to]={from,at:Date.now()};saveFunDb(db);return{ok:true};
}
export function acceptMarriage(jid){
  jid=relationshipId(jid);const db=read(),p=db.proposals[jid];if(!p)return{ok:false,reason:'none'};
  const ready=marriageReady(db,jid,p.from);
  if(!ready.ok){delete db.proposals[jid];saveFunDb(db);return ready;}
  db.marriages[jid]=p.from;db.marriages[p.from]=jid;delete db.dating[jid];delete db.dating[p.from];clearRequests(db,[jid,p.from]);saveFunDb(db);return{ok:true,partner:p.from};
}
export function marriageOf(jid){return read().marriages[relationshipId(jid)]||null;}
export function endDating(jid){
  jid=relationshipId(jid);const db=read(),p=db.dating[jid]?.partner;if(!p)return{ok:false,reason:'none'};
  delete db.dating[jid];if(db.dating[p]?.partner===jid)delete db.dating[p];clearRequests(db,[jid,p]);saveFunDb(db);return{ok:true,partner:p};
}
export function divorce(jid){
  jid=relationshipId(jid);const db=read(),p=db.marriages[jid];if(!p)return{ok:false,reason:'none'};
  delete db.marriages[jid];if(db.marriages[p]===jid)delete db.marriages[p];clearRequests(db,[jid,p]);saveFunDb(db);return{ok:true,partner:p};
}
export function rejectRelationship(jid,type){
  jid=relationshipId(jid);const db=read(),key=type==='marriage'?'proposals':'datingProposals',p=db[key][jid];
  if(!p)return{ok:false,reason:'none'};delete db[key][jid];saveFunDb(db);return{ok:true,partner:p.from};
}
export function cancelRelationship(jid){
  jid=relationshipId(jid);const db=read();let count=0;
  for(const key of ['proposals','datingProposals'])for(const [to,p] of Object.entries(db[key]))if(p.from===jid){delete db[key][to];count++;}
  if(count)saveFunDb(db);return{ok:count>0,count};
}
