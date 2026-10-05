function canonical(value) {
  const raw=String(value||"").trim();
  if(!raw)return "";
  const [local,domain]=raw.split("@");
  if(!domain)return /^\d+$/.test(raw)?`${raw}@s.whatsapp.net`:raw;
  return `${local.split(":")[0]}@${domain==="c.us"?"s.whatsapp.net":domain}`;
}
function participantIds(p) {
  return [...new Set([p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].map(canonical).filter(Boolean))];
}

// Usa os identificadores REAIS do membro; uma resposta sem exceção não prova remoção.
export async function removeAntiLinkParticipant(conn,groupJid,identities,{resolvePN}={}) {
  const aliases=new Set(identities.map(canonical).filter(Boolean));
  if(resolvePN){
    for(const id of [...aliases]){
      try{const pn=canonical(await resolvePN(id));if(pn)aliases.add(pn);}catch{}
    }
  }
  let meta;
  try{meta=await conn.groupMetadata(groupJid);}catch(e){return{ok:false,reason:"metadata",error:e?.message||String(e)};}
  if(!Array.isArray(meta?.participants))return{ok:false,reason:"metadata"};
  let member=meta.participants.find(p=>participantIds(p).some(id=>aliases.has(id)));
  if(!member&&resolvePN){
    for(const p of meta.participants){
      for(const id of participantIds(p)){
        try{if(aliases.has(canonical(await resolvePN(id)))){member=p;break;}}catch{}
      }
      if(member)break;
    }
  }
  if(!member)return{ok:false,reason:"participant_not_found"};
  if(member.admin)return{ok:false,reason:"protected_admin"};
  const candidates=participantIds(member);
  let lastError="Resposta de remoção não confirmada";
  for(const target of candidates){
    try{
      const result=await conn.groupParticipantsUpdate(groupJid,[target],"remove");
      const rows=Array.isArray(result)?result:[];
      if(rows.some(row=>String(row?.status)==="200"))return{ok:true,target};
      lastError=rows.map(row=>String(row?.status||"sem status")).join(", ")||lastError;
      // Alguns servidores retornam vazio ou 404 depois de uma remoção já aplicada.
      const fresh=await conn.groupMetadata(groupJid);
      if(Array.isArray(fresh?.participants)&&!fresh.participants.some(p=>participantIds(p).some(id=>candidates.includes(id)))){
        return{ok:true,target,verified:true};
      }
    }catch(e){lastError=e?.message||String(e);}
  }
  console.error(`[ANTILINK] Remoção não confirmada em ${groupJid}:`,lastError);
  return{ok:false,reason:"remove_failed",error:lastError};
}
