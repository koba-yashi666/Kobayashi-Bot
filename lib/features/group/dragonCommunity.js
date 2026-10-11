export const DRAGON_GROUPS = Object.freeze([
 '120363405231826649@g.us',
 '120363427920501968@g.us',
 '120363423888338432@g.us',
 '120363428210974331@g.us',
 '120363426504134468@g.us',
 '120363409995250913@g.us'
]);
const running = new WeakSet();
const normalize = jid => String(jid || '').replace(/:\d+(?=@)/, '');
export async function setDragonCommunityState(conn, open, botIds = [], pause = ms => new Promise(resolve => setTimeout(resolve, ms))) {
 if(running.has(conn)) return {busy:true,results:[]};
 running.add(conn);
 const results=[];
 try {
  const identities=new Set([...botIds,conn.user?.id,conn.user?.lid,conn.user?.phoneNumber].filter(Boolean).map(normalize));
  for(const jid of DRAGON_GROUPS){
   let name=jid;
   try {
    const metadata=await conn.groupMetadata(jid);name=metadata.subject||jid;
    const bot=(metadata.participants||[]).find(p=>[p.id,p.jid,p.participant,p.phoneNumber,p.lid].some(id=>id&&identities.has(normalize(id))));
    if(!bot)results.push({jid,name,status:'absent'});
    else if(!bot.admin&&!bot.isAdmin&&!bot.isSuperAdmin)results.push({jid,name,status:'not-admin'});
    else if(typeof metadata.announce==='boolean'&&metadata.announce===!open)results.push({jid,name,status:'already'});
    else {
     await conn.groupSettingUpdate(jid,open?'not_announcement':'announcement');
     const updated=await conn.groupMetadata(jid);
     results.push({jid,name,status:updated.announce===!open?'success':'unconfirmed'});
    }
   }catch(error){results.push({jid,name,status:'failed'});console.error('[DRAGON COMMUNITY]',jid,error?.message||error);}
   if(jid!==DRAGON_GROUPS.at(-1))await pause(700);
  }
  return {busy:false,results};
 }finally{running.delete(conn);}
}

export function selectDragonMessageGroups(groups){return DRAGON_GROUPS.filter(jid=>Object.prototype.hasOwnProperty.call(groups||{},jid)).map(jid=>[jid,groups[jid]]);}
