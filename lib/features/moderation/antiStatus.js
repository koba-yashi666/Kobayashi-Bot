// Apenas eventos reais de status: não examina legendas, texto nem mensagens citadas.
export function isGroupStatusMention(info) {
  if(!String(info?.key?.remoteJid||"").endsWith("@g.us"))return false;
  let message=info?.message;
  for(let depth=0;depth<10&&message;depth++){
    if(message.groupStatusMentionMessage || message.statusMentionMessage)return true;
    const protocol=message.protocolMessage;
    if(protocol && (protocol.type===25 || protocol.type==="STATUS_MENTION_MESSAGE"))return true;
    message=message.ephemeralMessage?.message || message.viewOnceMessage?.message ||
      message.viewOnceMessageV2?.message || message.viewOnceMessageV2Extension?.message;
  }
  return false;
}
const seen = new WeakMap();
export async function handleAntiStatus({conn,info,enabled,protectedMember,botIsAdmin,identities,removeParticipant,log}) {
  if(!enabled || !isGroupStatusMention(info) || info.key.fromMe || protectedMember)return {handled:false};
  const groupJid=info.key.remoteJid;
  // A identidade vem do remetente do evento, nunca do autor de um status citado.
  if(!info.key.participant||!info.key.id)return {handled:false};
  let cache=seen.get(conn);if(!cache){cache=new Map();seen.set(conn,cache);}
  const now=Date.now();for(const [id,ts] of cache)if(now-ts>600000)cache.delete(id);
  const id=`${groupJid}:${info.key.id}`;
  if(cache.has(id))return {handled:true,deduped:true};
  if(cache.size>=1000)cache.delete(cache.keys().next().value);
  cache.set(id,now);
  if(!botIsAdmin){
    log({type:"antistts",target:identities[0],detail:"Menção em status detectada • bot sem ADM para apagar/remover"});
    return {handled:true,deleted:false,removed:false,reason:"not_admin"};
  }
  let deleted=false,deleteError="";
  try{await conn.sendMessage(groupJid,{delete:info.key});deleted=true;}
  catch(e){deleteError=e?.message||String(e);}
  // Falha na exclusão não impede a tentativa de remover o autor.
  let removal;
  try{removal=await removeParticipant(identities);}
  catch(e){removal={ok:false,error:e?.message||String(e)};}
  const detail=`Menção ao grupo em status • exclusão: ${deleted?"enviada":"falhou"}${deleteError?` (${deleteError})`:""} • remoção: ${removal.ok?"confirmada":`falhou (${removal.error||removal.reason||"sem confirmação"})`} • ID ${info.key.id}`;
  log({type:"antistts",target:identities[0],detail});
  return {handled:true,deleted,removed:Boolean(removal.ok),reason:removal.reason};
}
