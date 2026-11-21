export const canonicalPurgeId=value=>{
 const raw=String(value||'').trim();if(!raw.includes('@'))return /^\+?\d{8,15}$/.test(raw)?raw.replace('+','')+'@s.whatsapp.net':'';
 const id=raw.replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');return /^\d+@(s\.whatsapp\.net|lid)$/.test(id)?id:'';
};
export const participantPurgeIds=p=>[typeof p==='string'||typeof p==='number'?p:null,p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid,p?.pn].map(canonicalPurgeId).filter(Boolean);
export function createPurgeResolver(conn,resolvePN){
 const cache=new Map();
 return async function expand(value){
  const result=new Set(participantPurgeIds(value)),queue=[...result];
  // Mapeia somente identidades locais; nunca consulta perfis/números no servidor.
  for(let i=0;i<queue.length&&i<12;i++){
   const id=queue[i];let promise=cache.get(id);
   if(!promise){promise=(async()=>{const found=[],mapping=conn.signalRepository?.lidMapping;
    try{const mapped=id.endsWith('@lid')?await mapping?.getPNForLID?.(id):await mapping?.getLIDForPN?.(id);found.push(...participantPurgeIds(mapped));}catch{}
    if(resolvePN)try{found.push(...participantPurgeIds(await resolvePN(id)));}catch{}
    return found;
   })();cache.set(id,promise);}
   for(const alias of await promise)if(!result.has(alias)){result.add(alias);queue.push(alias);}
  }
  return [...result];
 };
}
const botKnown=new WeakMap();
export async function resolvePurgeBot(conn,metadatas=[],expand=createPurgeResolver(conn)){
 const me=conn.authState?.creds?.me||conn.creds?.me||{};
 const auth=[...participantPurgeIds(conn.user),...participantPurgeIds(me)],fingerprint=[...auth].sort().join('|');
 let record=botKnown.get(conn);if(!record||record.fingerprint!==fingerprint){record={fingerprint,ids:new Set(auth)};botKnown.set(conn,record);}
 for(const id of auth)for(const alias of await expand(id))record.ids.add(alias);
 // Aprende PN/LID em conjunto nos metadados onde há uma identidade própria já comprovada.
 // Permite resolver um grupo incompleto usando outro grupo do mesmo lote, sem adivinhar pelo nome.
 for(let round=0;round<4;round++){let changed=false;
  for(const meta of metadatas)for(const p of meta?.participants||[]){const ids=participantPurgeIds(p);if(ids.some(id=>record.ids.has(id)))for(const id of ids)if(!record.ids.has(id)){record.ids.add(id);changed=true;}}
  if(!changed)break;
 }
 for(const meta of metadatas){
  if(findPurgeBot(meta,record.ids))continue;
  for(const p of meta?.participants||[]){const aliases=await expand(p);if(aliases.some(id=>record.ids.has(id))){for(const id of aliases)record.ids.add(id);for(const id of participantPurgeIds(p))record.ids.add(id);break;}}
 }
 return new Set(record.ids);
}
export function findPurgeBot(meta,botIds){return meta?.participants?.find(p=>participantPurgeIds(p).some(id=>botIds.has(id)));}
export function purgeAdminState(bot,{complete=true}={}){
 if(!bot)return null;
 if(bot.admin===true||bot.admin==='admin'||bot.admin==='superadmin'||bot.isAdmin===true||bot.isSuperAdmin===true)return true;
 if(bot.admin===null||bot.admin===false||bot.admin==='member'||bot.admin==='none'||bot.isAdmin===false||bot.isSuperAdmin===false)return false;
 return complete?false:null;
}
