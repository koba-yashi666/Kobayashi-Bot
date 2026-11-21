import {createPurgeResolver,resolvePurgeBot,findPurgeBot,purgeAdminState} from './purgeIdentity.js';
import {moderationQueries,isModerationRateLimit} from './moderationQueries.js';
// Uma fotografia por lote: falha de consulta nunca amplia o alcance e nunca vira "não é ADM".
export async function discoverBlacklistGroups(conn,options={}){
 const queries=moderationQueries(conn,options),live=await queries.all();
 if(!live||typeof live!=='object'||Array.isArray(live))throw Error('Não foi possível consultar os grupos atuais.');
 const entries=Object.entries(live).filter(([id])=>id.endsWith('@g.us')),expand=createPurgeResolver(conn);
 let botIds=await resolvePurgeBot(conn,entries.map(([,meta])=>meta),expand);const groups=[],diagnostics=[];
 for(const [jid,cached]of entries){
  let meta=cached,name=cached?.subject||jid;
  try{
   let bot=findPurgeBot(meta,botIds),admin=purgeAdminState(bot,{complete:false});
   // Se o snapshot não prova a identidade e a função, busca só esse grupo, uma única vez.
   if(!Array.isArray(meta?.participants)||meta.id&&meta.id!==jid||!bot||admin===null){meta=await queries.metadata(jid,{fresh:true});name=meta.subject||name;botIds=await resolvePurgeBot(conn,[meta],expand);bot=findPurgeBot(meta,botIds);admin=purgeAdminState(bot,{complete:true});}
   if(!bot){diagnostics.push({jid,name,status:'bot-unknown',isAdmin:null});continue;}
   if(admin===true){queries.remember(jid,meta);groups.push({jid,name,metadata:meta,checkedAt:Date.now()});}
   else diagnostics.push({jid,name,status:admin===false?'not-admin':'bot-unknown',isAdmin:admin});
  }catch(e){diagnostics.push({jid,name,status:isModerationRateLimit(e)?'rate-limited':'metadata-error',isAdmin:null,error:e.message});}
 }
 const issues=diagnostics.map(r=>r.status==='not-admin'?`🚫 ${r.name}: Kobayashi não é ADM (confirmado).`:r.status==='bot-unknown'?`❔ ${r.name}: identidade da Kobayashi ainda não confirmada; verificação pendente.`:`⏳ ${r.name}: ${r.error||'verificação pendente'}`);
 return {groups,issues,diagnostics,checked:entries.length};
}
