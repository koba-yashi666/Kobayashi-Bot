export const DRAGON_GROUPS = Object.freeze([
 '120363405231826649@g.us',
 '120363427920501968@g.us',
 '120363423888338432@g.us',
 '120363428210974331@g.us',
 '120363426504134468@g.us',
 '120363409995250913@g.us'
]);
const running = new WeakSet();
const errorCode = error => Number(error?.output?.statusCode || error?.output?.payload?.statusCode || error?.statusCode || (typeof error?.data==='number'?error.data:0));
function failure(error){
 const code=errorCode(error);
 if(code===403)return {status:'not-admin',reason:'WhatsApp negou a permissão (403). Confira se o bot é ADM e as restrições da comunidade.'};
 if(code===404)return {status:'absent',reason:'Grupo não encontrado ou inacessível para esta conta (404).'};
 if(code===429)return {status:'failed',reason:'WhatsApp limitou as alterações (429). Tente novamente mais tarde.'};
 return {status:'failed',reason:`${code?`Erro ${code}: `:''}${String(error?.message||'Sem resposta do WhatsApp').replace(/[\r\n]/g,' ').slice(0,120)}`};
}
export async function setDragonCommunityState(conn, open, botIds = [], pause = ms => new Promise(resolve => setTimeout(resolve, ms))) {
 if(running.has(conn)) return {busy:true,results:[]};
 running.add(conn);
 const results=[];
 const desired=!open;
 try {
  for(const jid of DRAGON_GROUPS){
   let name=jid;
   let metadata=null;
   try{metadata=await conn.groupMetadata(jid);name=metadata.subject||jid;}catch(error){console.error('[DRAGON metadata]',jid,error?.message||error);}
   try {
    {
     // A API valida participação e permissão. Listas com LID/PN incompletos não impedem a tentativa.
     for(let attempt=0;attempt<2;attempt++){
      try{await conn.groupSettingUpdate(jid,open?'not_announcement':'announcement');break;}
      catch(error){const code=errorCode(error);if(attempt===0&&[429,500,502,503,504,408].includes(code)){await pause(code===429?15000:2500);continue;}throw error;}
     }
     let confirmed=false;
     for(let attempt=0;attempt<3;attempt++){
      await pause(1000);
      try{const updated=await conn.groupMetadata(jid);if(updated.announce===desired){confirmed=true;break;}}
      catch(error){console.error('[DRAGON confirmação]',jid,error?.message||error);}
     }
     results.push({jid,name,status:confirmed?'success':'unconfirmed',...(confirmed?{}:{reason:'WhatsApp aceitou a alteração, mas o estado ainda não foi confirmado.'})});
    }
   }catch(error){results.push({jid,name,...failure(error)});console.error('[DRAGON COMMUNITY]',jid,error?.message||error);}
   if(jid!==DRAGON_GROUPS.at(-1))await pause(1500);
  }
  return {busy:false,results};
 }finally{running.delete(conn);}
}

export function selectDragonMessageGroups(groups){return DRAGON_GROUPS.filter(jid=>Object.prototype.hasOwnProperty.call(groups||{},jid)).map(jid=>[jid,groups[jid]]);}
