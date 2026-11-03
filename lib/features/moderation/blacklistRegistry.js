import {normalizeBlacklistJid,addGlobalBlacklistBatch} from './globalBlacklist.js';
import {addBlacklistBatch} from './adminPro.js';
import {createPurgeResolver,purgeGroups} from './groupPurge.js';
import {protectedRemovalMessage} from './removalProtection.js';
export function parseBlacklistTargets(text='',mentioned){
 const raw=String(text).replace(/[\u00a0\u2007\u202f]/g,' ').replace(/[\u200b-\u200f\u202a-\u202e\u2060\ufeff]/g,'').replace(/[‐‑‒–—―−]/g,'-').replace(/^\s*add\s+/i,'');
 const targets=[],invalid=[];
 const add=value=>{const jid=normalizeBlacklistJid(value);if(jid&&!targets.includes(jid))targets.push(jid);};
 if(mentioned)add(mentioned);
 for(const line of raw.split(/[,;\n]+/))for(const chunk of line.split(/(?=\+\s*\d)/).map(x=>x.trim()).filter(Boolean)){
  if(/^\d+(?::\d+)?@(s\.whatsapp\.net|lid)$/.test(chunk)){add(chunk);continue;}
  if(!/^\+?[\d ()-]+$/.test(chunk)){invalid.push(chunk);continue;}
  const digits=chunk.replace(/\D/g,'');
  if(digits.length>=8&&digits.length<=15){add(digits);continue;}
  const tokens=chunk.split(/\s+/);if(tokens.length>1&&tokens.every(t=>/^\d{8,15}$/.test(t)))tokens.forEach(add);else invalid.push(chunk);
 }
 return {targets,invalid};
}
export async function registerBlacklistTargets(conn,{group,targets,scope,by,participants=[]}){
 const expand=createPurgeResolver(conn),items=[],protectedTargets=[];
 for(const target of targets){
  if(await protectedRemovalMessage(conn,group,target,{participants})){protectedTargets.push(target);continue;}
  let aliases=await expand(target);
  for(const member of participants){const own=[member?.id,member?.jid,member?.phoneNumber,member?.lid].filter(Boolean);if(own.some(id=>aliases.includes(id)))aliases=[...new Set([...aliases,...await expand(member)])];}
  items.push({jid:target,user:target,aliases,by,reason:'Adicionado manualmente',...(scope?{groupJids:scope.map(g=>g.jid)}:{})});
 }
 // Uma gravação atômica para o lote inteiro, antes de qualquer remoção.
 if(items.length){if(scope)addGlobalBlacklistBatch(items);else addBlacklistBatch(group,items);}
 return {saved:items.map(x=>x.jid),protectedTargets};
}
export async function purgeBlacklistTargets(conn,targets,groups,options={}){
 const result=[];
 for(let i=0;i<groups.length;i+=3){const batch=await Promise.all(groups.slice(i,i+3).map(group=>purgeGroups(conn,targets,[group],options)));result.push(...batch.flat());}
 return result;
}
