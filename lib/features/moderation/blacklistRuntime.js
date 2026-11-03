import {createPurgeResolver,purgeGroups} from './groupPurge.js';
import {isBlacklisted} from './adminPro.js';
import {isGloballyBlacklisted} from './globalBlacklist.js';
import {isMainOwnerJid} from '../../config/settingsStore.js';
import {addAdminLog} from './adminLogs.js';
import {recordMemberEntry} from './memberEntryHistory.js';
export async function blacklistState(conn,group,value){
 const expand=createPurgeResolver(conn),aliases=new Set(await expand(value));
 const metadata=await conn.groupMetadata(group);
 for(const p of metadata.participants||[]){const own=await expand(p);if(own.some(id=>aliases.has(id)))for(const id of own)aliases.add(id);}
 const global=[...aliases].some(id=>isGloballyBlacklisted(id,group)),local=[...aliases].some(id=>isBlacklisted(group,id));
 return {aliases:[...aliases],global,local,blocked:global||local};
}
const locks=new WeakMap();
export function enforceBlacklist(conn,group,value,{announce=false,source='auto'}={}){
 let cache=locks.get(conn);if(!cache)locks.set(conn,cache=new Map());
 const key=group+':'+JSON.stringify(value);if(cache.has(key))return cache.get(key);
 const task=(async()=>{
  const state=await blacklistState(conn,group,value);if(!state.blocked)return {...state,removed:false,reason:'not-blacklisted'};
  const rows=await purgeGroups(conn,state.aliases,[{jid:group}],{protectedIdentity:isMainOwnerJid});const removed=rows.find(r=>r.status==='removed');
  if(removed){addAdminLog(group,{type:'blacklist_auto_remove',actor:'Kobayashi AutoGuard',target:removed.target,detail:source});if(announce)await conn.sendMessage(group,{text:'🖤 Usuário bloqueado removido automaticamente.',mentions:[removed.target]}).catch(()=>{});}
  return {...state,removed:Boolean(removed),target:removed?.target,reason:removed?'removed':rows[0]?.status||'not-in-group'};
 })();cache.set(key,task);task.then(()=>cache.delete(key),()=>cache.delete(key));return task;
}
export function installBlacklistRuntime(conn){
 if(conn.__kobayashiBlacklistJoinGuard)return;conn.__kobayashiBlacklistJoinGuard=true;
 const groups=new Map();
 conn.ev.on('group-participants.update',event=>{
  if(event?.action!=='add'||!event.id?.endsWith('@g.us'))return;
  const task=(groups.get(event.id)||Promise.resolve()).catch(()=>{}).then(async()=>{
   for(const value of event.participants||[]){try{recordMemberEntry(event.id,typeof value==='string'?value:value.id||value.jid||value.participant||value.lid||value.phoneNumber,Date.now());await enforceBlacklist(conn,event.id,value,{announce:true,source:'join-guard'});}catch(e){console.error('[Autoban]',e.message);}}
  });groups.set(event.id,task);const clear=()=>{if(groups.get(event.id)===task)groups.delete(event.id);};task.then(clear,clear);
 });
}
