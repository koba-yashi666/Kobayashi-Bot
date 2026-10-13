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
 const expand=createPurgeResolver(conn,resolvePN);const aliases=new Set(await expand(target));
 const botIds=await expand({id:conn.user?.id,lid:conn.user?.lid,phoneNumber:conn.user?.phoneNumber});
 const matches=(p,set)=>ids(p).some(id=>set.has(id));
 const results=[];
 const retry=async fn=>{for(let attempt=0;attempt<2;attempt++){try{return await fn();}catch(e){if(attempt===0&&[408,429,500,502,503,504].includes(code(e))){await pause(code(e)===429?12000:1500);continue;}throw e;}}};
 for(const entry of groups){const jid=typeof entry==='string'?entry:entry.jid;let name=entry.name||jid;
  try{
   let metadata,member;
   for(let scan=0;scan<2;scan++){
    metadata=await retry(()=>conn.groupMetadata(jid));name=metadata.subject||name;
    if(!Array.isArray(metadata.participants))throw Error('Lista de participantes indisponível');
    member=metadata.participants.find(p=>matches(p,aliases));
    if(!member){for(const p of metadata.participants){if((await expand(p)).some(id=>aliases.has(id))){member=p;break;}}}
    if(member)break;if(scan===0)await pause(600);
   }
   const bot=metadata.participants.find(p=>matches(p,new Set(botIds)));
   const isAdmin=bot?Boolean(bot.admin||bot.isAdmin||bot.isSuperAdmin):null;
   if(!member){results.push({jid,name,status:'absent',isAdmin});continue;}
   const memberAliases=await expand(member);for(const id of memberAliases)aliases.add(id);
   if(memberAliases.some(id=>botIds.includes(id)||protectedIdentity(id))){results.push({jid,name,status:'protected',isAdmin});continue;}
   if(isAdmin===false){results.push({jid,name,status:'not-admin',isAdmin});continue;}
   let removed=false,lastError='Remoção não confirmada';
   // Apenas identificadores do membro efetivamente localizado; nenhum número aproximado.
   for(const candidate of [...new Set([...ids(member),...memberAliases])]){
    try{
     await retry(()=>conn.groupParticipantsUpdate(jid,[candidate],'remove'));
    }catch(e){lastError=`${code(e)||''} ${e.message||'WhatsApp recusou a remoção'}`.trim();}
    for(let check=0;check<2;check++){
     await pause(700);
     try{const fresh=await retry(()=>conn.groupMetadata(jid));if(Array.isArray(fresh.participants)&&!fresh.participants.some(p=>matches(p,aliases))){let stillThere=false;for(const p of fresh.participants){if((await expand(p)).some(id=>aliases.has(id))){stillThere=true;break;}}if(!stillThere){removed=true;break;}}}catch(e){lastError=e.message||String(e);}
    }
    if(removed)break;
   }
   results.push({jid,name,status:removed?'removed':'failed',isAdmin,...(removed?{}:{error:lastError})});
  }catch(e){results.push({jid,name,status:'metadata-error',error:e.message||String(e)});}
  await pause(500);
 }
 return results;
}
