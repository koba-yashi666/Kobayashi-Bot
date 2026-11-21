import {canonicalPurgeId as canonical,participantPurgeIds as ids,createPurgeResolver,resolvePurgeBot,findPurgeBot,purgeAdminState} from './purgeIdentity.js';
import {moderationQueries,isModerationRateLimit} from './moderationQueries.js';
export {createPurgeResolver} from './purgeIdentity.js';
export async function purgeGroups(conn,target,groups,{resolvePN,protectedIdentity=()=>false,...queryOptions}={}){
 const queries=moderationQueries(conn,queryOptions),expand=createPurgeResolver(conn,resolvePN),aliases=new Set();
 for(const value of Array.isArray(target)?target:[target])for(const id of await expand(value))aliases.add(id);
 const results=[],seen=new Set();
 for(const entry of groups){const jid=typeof entry==='string'?entry:entry.jid;if(!jid?.endsWith('@g.us')||seen.has(jid))continue;seen.add(jid);let name=entry.name||jid,isAdmin=null;
  try{
   const meta=await queries.metadata(jid);name=meta.subject||name;
   const botIds=await resolvePurgeBot(conn,[meta],expand),bot=findPurgeBot(meta,botIds);isAdmin=purgeAdminState(bot);
   if(!bot){results.push({jid,name,status:'bot-unknown',isAdmin:null});continue;}
   if(!isAdmin){results.push({jid,name,status:'not-admin',isAdmin:false});continue;}
   const members=[];
   for(const p of meta.participants){const own=await expand(p);if(own.some(id=>aliases.has(id)))members.push({p,own});}
   if(!members.length){results.push({jid,name,status:'absent',isAdmin});continue;}
   for(const {p,own}of members){
    const targetId=ids(p)[0];
    if(own.some(id=>botIds.has(id)||protectedIdentity(id))){results.push({jid,name,target:targetId,status:'protected',isAdmin});continue;}
    let removed=false,lastError='Remoção não confirmada',status='failed';
    // Primeiro usa a identidade exata presente no grupo. Alias alternativo só após erro de formato.
    const candidates=[...new Set([targetId,...own])];
    for(let attempt=0;attempt<candidates.length;attempt++){
     let mayTryAlias=false;
     try{
      queries.assertReady();
      const response=await queries.mutate(()=>conn.groupParticipantsUpdate(jid,[candidates[attempt]],'remove'));
      if(Array.isArray(response)&&response.some(r=>Number(r.status)===429))throw queries.markRate();
      if(Array.isArray(response)&&response.some(r=>String(r.status)==='200'&&(!r.jid||own.includes(canonical(r.jid))))){removed=true;break;}
      if(Array.isArray(response)&&response.some(r=>r.protected)){status='protected';break;}
      const codes=(response||[]).map(r=>String(r.status));lastError=codes.length?'WhatsApp não confirmou a remoção ('+codes.join(', ')+').':'Sem confirmação da remoção.';
      mayTryAlias=codes.length>0&&codes.every(s=>['400','404'].includes(s));
     }catch(e){
      if(isModerationRateLimit(e)){status='rate-limited';lastError=e.message;break;}
      if(e.code==='KOBA_PROTECTED_REMOVAL'){status='protected';lastError='Alvo protegido';break;}
      lastError=e.message||String(e);
     }
     // Resposta ambígua só é sucesso se uma consulta nova comprovar a ausência.
     try{const fresh=await queries.metadata(jid,{fresh:true});let present=false;
      for(const member of fresh.participants)if((await expand(member)).some(id=>own.includes(id))){present=true;break;}
      if(!present){removed=true;break;}
     }catch(e){if(isModerationRateLimit(e)){status='rate-limited';lastError=e.message;}else lastError=e.message||String(e);break;}
     if(!mayTryAlias)break;
    }
    results.push({jid,name,target:targetId,status:removed?'removed':status,isAdmin,...(removed?{}:{error:lastError})});
    if(status==='rate-limited')break;
   }
  }catch(e){results.push({jid,name,status:isModerationRateLimit(e)?'rate-limited':'metadata-error',isAdmin,error:e.message||String(e)});}
 }
 return results;
}
export function formatPurgeIssues(rows){
 const relevant=new Set(['failed','metadata-error','not-admin','bot-unknown','protected','remove-error','bot-not-admin','rate-limited']);
 const grouped=new Map();
 for(const r of rows){if(!relevant.has(r.status))continue;const key=r.jid||r.groupJid||r.name;if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(r);}
 const names=new Map();for(const [id,items]of grouped){const name=items.at(-1).name||id;names.set(name,(names.get(name)||0)+1);}
 return [...grouped].map(([id,items])=>{
  const r=items.at(-1),name=r.name||id,suffix=names.get(name)>1?' ['+id+']':'';
  const admin=r.isAdmin===true?'👑 Kobayashi: ADM confirmado':r.isAdmin===false?'🚫 Kobayashi: não é ADM (confirmado)':'❔ Kobayashi: verificação de ADM pendente';
  const reasons=[...new Set(items.map(x=>x.status==='not-admin'||x.status==='bot-not-admin'?'Grupo ignorado por falta de ADM confirmada':x.status==='bot-unknown'?'Identidade PN/LID ainda não confirmada; nenhuma remoção tentada':x.status==='protected'?'Alvo protegido':x.status==='rate-limited'?'WhatsApp limitou as operações; pendente para nova tentativa após a pausa':x.error||'Falha na consulta/remoção'))];
  return `🏘️ ${name}${suffix}\n${admin}\n↳ ${reasons.join('\n↳ ')}`;
 }).join('\n\n');
}
export function formatBlacklistIssues(scope,rows){
 const checked=new Set(rows.map(r=>r.jid));
 return formatPurgeIssues([...(scope.diagnostics||[]).filter(r=>!checked.has(r.jid)),...rows]);
}
