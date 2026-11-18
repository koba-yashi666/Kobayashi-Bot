import {DAY,GRACE} from './storage.js';
export function createRentalLifecycle({rentals,notices,clock=Date.now,groupNotices=()=>true}){
 let busy=false;
 const fresh=(jid,expiry)=>{const r=rentals.read().groups?.[jid];return r&&!r.permanent&&Number(r.expiresAt)===expiry?r:null;};
 function mark(jid,expiry,patch){const db=rentals.read();const r=db.groups?.[jid];if(r&&!r.permanent&&Number(r.expiresAt)===expiry){Object.assign(r,patch);rentals.write(db);}}
 async function once(key,fn){if(notices.read().notices[key])return;await fn();notices.update(db=>{db.notices[key]=clock();});}
 return async function tick(conn){
  if(busy||!conn?.user)return;busy=true;
  try{
   const rows=Object.entries(rentals.read().groups||{});
   for(const [jid,row]of rows){
    if(!row||row.permanent||!Number.isFinite(Number(row.expiresAt))||Number(row.expiresAt)<=0)continue;
    const expiry=Number(row.expiresAt),remaining=expiry-clock();
    if(!fresh(jid,expiry)||row.leftAfterExpiry===expiry)continue;
    if(remaining<=-GRACE){
     // Reconcilia Pix de renovação que possa ter sido aprovado antes da saída.
     if(conn.kobaBillingBeforeLeave){try{await conn.kobaBillingBeforeLeave(jid);}catch{continue;}}
     // Nenhum await entre a última conferência de renovação e groupLeave.
     const latest=fresh(jid,expiry);if(!latest||Number(latest.expiresAt)>clock()-GRACE)continue;
     try{await conn.groupLeave(jid);mark(jid,expiry,{leftAfterExpiry:expiry,leftAt:clock(),status:'expired-left'});}catch{/* Tenta novamente na próxima rodada. */}
     continue;
    }
    const stage=remaining<=0?'vencido':remaining<=3*DAY?'3d':remaining<=7*DAY?'7d':null;
    if(!stage)continue;
    const common=`🐉 *ALUGUEL KOBAYASHI*\nGrupo: ${row.groupName||jid}\nVencimento: ${new Date(expiry).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}\n${remaining<=0?'O aluguel venceu. A saída está prevista para duas horas após o vencimento.':'Faltam aproximadamente '+Math.ceil(remaining/DAY)+' dia(s).'}\nRenove no privado com /renovar. A renovação antecipada preserva os dias restantes.`;
    try{
     if(row.responsibleJid)await once(`${jid}:${expiry}:${stage}:pv`,()=>conn.kobaBillingReminder?conn.kobaBillingReminder(row.responsibleJid,common):conn.sendMessage(row.responsibleJid,{text:common}));
     if(fresh(jid,expiry)&&groupNotices())await once(`${jid}:${expiry}:${stage}:gp`,()=>conn.sendMessage(jid,{text:common+(row.responsibleJid?'\nResponsável: @'+row.responsibleJid.split('@')[0]:''),mentions:row.responsibleJid?[row.responsibleJid]:[]}));
    }catch{/* Avisos sem confirmação são tentados novamente. */}
   }
  }finally{busy=false;}
 };
}
