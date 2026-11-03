const canonical=value=>{const raw=String(value||'').trim();if(!raw.includes('@'))return /^\+?\d{8,15}$/.test(raw)?raw.replace('+','')+'@s.whatsapp.net':'';return raw.replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');};
const ids=p=>[typeof p==='string'?p:null,p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].map(canonical).filter(Boolean);
const code=e=>Number(e?.output?.statusCode||e?.statusCode||(typeof e?.data==='number'?e.data:0));
export function createPurgeResolver(conn,resolvePN){
 const cache=new Map();
 async function expand(value){const start=ids(value),result=new Set(start);
  for(const id of start){
   let promise=cache.get(id);
   if(!promise){promise=(async()=>{const found=[];const mapping=conn.signalRepository?.lidMapping;
    try{const mapped=id.endsWith('@lid')?await mapping?.getPNForLID?.(id):id.endsWith('@s.whatsapp.net')?await mapping?.getLIDForPN?.(id):null;if(mapped)found.push(canonical(mapped));}catch{}
    if(resolvePN){try{const mapped=await resolvePN(id);if(mapped)found.push(canonical(mapped));}catch{}}
    return found.filter(Boolean);
   })();cache.set(id,promise);}
   for(const alias of await promise)result.add(alias);
  }
  return [...result];
 }
 return expand;
}
export async function purgeGroups(conn,target,groups,{resolvePN,protectedIdentity=()=>false,pause=ms=>new Promise(r=>setTimeout(r,ms))}={}){
 const expand=createPurgeResolver(conn,resolvePN),aliases=new Set();
 for(const value of Array.isArray(target)?target:[target])for(const id of await expand(value))aliases.add(id);
 const botIds=new Set(await expand({id:conn.user?.id,lid:conn.user?.lid,phoneNumber:conn.user?.phoneNumber})),results=[];
 const matches=(p,set)=>ids(p).some(id=>set.has(id));
 const retry=async fn=>{for(let i=0;i<2;i++)try{return await fn();}catch(e){if(i===0&&[408,429,500,502,503,504].includes(code(e))){await pause(code(e)===429?12000:1000);continue;}throw e;}};
 for(const entry of groups){const jid=typeof entry==='string'?entry:entry.jid;let name=entry.name||jid,isAdmin=null;
 try{
  const meta=await retry(()=>conn.groupMetadata(jid));name=meta.subject||name;
  if(!Array.isArray(meta.participants))throw Error('Lista de participantes indisponível');
  let bot=meta.participants.find(p=>matches(p,botIds));
  if(!bot)for(const p of meta.participants)if((await expand(p)).some(id=>botIds.has(id))){bot=p;break;}
  isAdmin=bot?Boolean(bot.admin||bot.isAdmin||bot.isSuperAdmin):null;
  if(!bot){results.push({jid,name,status:'bot-unknown',isAdmin});continue;}
  if(!isAdmin){results.push({jid,name,status:'not-admin',isAdmin});continue;}
  const members=[];
  for(const p of meta.participants){const own=await expand(p);if(own.some(id=>aliases.has(id)))members.push({p,own});}
  if(!members.length){results.push({jid,name,status:'absent',isAdmin});continue;}
  for(const {p,own} of members){
   const targetId=ids(p)[0];
   if(own.some(id=>botIds.has(id)||protectedIdentity(id))){results.push({jid,name,target:targetId,status:'protected',isAdmin});continue;}
   let removed=false,lastError='Remoção não confirmada';
   for(const candidate of [...new Set([...ids(p),...own])]){
    try{
     const response=await retry(()=>conn.groupParticipantsUpdate(jid,[candidate],'remove'));
     if(Array.isArray(response)&&response.some(r=>String(r.status)==='200'&&(!r.jid||own.includes(canonical(r.jid))))){removed=true;break;}
     lastError=(response||[]).map(r=>r.status).join(', ')||'Sem confirmação';
    }catch(e){lastError=e.message||String(e);}
    // Resposta ambígua só é sucesso se os metadados confirmarem a ausência.
    await pause(200);
    try{const fresh=await conn.groupMetadata(jid);if(Array.isArray(fresh.participants)){let present=false;for(const member of fresh.participants)if((await expand(member)).some(id=>own.includes(id))){present=true;break;}if(!present){removed=true;break;}}}catch(e){lastError=e.message||String(e);}
   }
   results.push({jid,name,target:targetId,status:removed?'removed':'failed',isAdmin,...(removed?{}:{error:lastError})});
   if(members.length>1)await pause(150);
  }
 }catch(e){results.push({jid,name,status:'metadata-error',isAdmin,error:e.message||String(e)});}
 }
 return results;
}

export function formatPurgeIssues(rows){
 return rows.filter(r=>['failed','metadata-error','not-admin','bot-unknown','protected','remove-error','bot-not-admin'].includes(r.status)).map(r=>{
  const admin=r.isAdmin===true?'👑 Kobayashi: ADM':r.isAdmin===false?'🚫 Kobayashi: não é ADM':'❔ Kobayashi: ADM não confirmado';
  const reason=r.status==='not-admin'||r.status==='bot-not-admin'?'Grupo ignorado por falta de ADM':r.status==='bot-unknown'?'Participação/identidade do bot não confirmada; grupo ignorado':r.status==='protected'?'Alvo protegido':r.error||'Falha na consulta/remoção';
  return `🏘️ ${r.name||r.jid||r.groupJid}\n${admin}\n↳ ${reason}`;
 }).join('\n\n');
}
