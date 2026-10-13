import { readSettingsFile } from '../../config/settingsStore.js';
export const CREATOR_LID='69119714017511@lid';
const normalize=x=>String(x||'').replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');
const ids=p=>[typeof p==='string'?p:null,p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).map(normalize);
export async function protectedRemovalMessage(conn,jid,target,{ownerNumber,participants}={}){
 const creator=new Set([CREATOR_LID]);
 const digits=String(ownerNumber===undefined?readSettingsFile().ownerNumber:ownerNumber).replace(/\D/g,'');
 const owner=new Set(digits?[digits+'@s.whatsapp.net']:[]);
 const mapped=async set=>{for(const id of [...set])try{const map=conn.signalRepository?.lidMapping;const value=id.endsWith('@lid')?await map?.getPNForLID?.(id):await map?.getLIDForPN?.(id);if(value)set.add(normalize(value));}catch{}};
 await mapped(creator);await mapped(owner);
 let members=participants;
 if(!Array.isArray(members)){try{members=(await conn.groupMetadata(jid)).participants||[];}catch{members=[];}}
 for(const p of members){const aliases=ids(p);if(aliases.some(x=>creator.has(x)))for(const id of aliases)creator.add(id);if(aliases.some(x=>owner.has(x)))for(const id of aliases)owner.add(id);}
 const targetIds=new Set(ids(target));await mapped(targetIds);
 if([...targetIds].some(id=>creator.has(id)))return 'Não posso remover meu mestre do grupo';
 if([...targetIds].some(id=>owner.has(id)))return 'Não posso remover meu dono';
 return null;
}
export function installRemovalProtection(conn){
 if(conn.__removalProtection)return;conn.__removalProtection=true;
 const original=conn.groupParticipantsUpdate.bind(conn),notices=new Map();
 conn.groupParticipantsUpdate=async(jid,targets,action)=>{
  if(action!=='remove')return original(jid,targets,action);
  const allowed=[],blocked=[];
  for(const target of targets){const message=await protectedRemovalMessage(conn,jid,target);if(message){blocked.push({target,message});}else allowed.push(target);}
  for(const message of new Set(blocked.map(x=>x.message))){const key=jid+message;if(Date.now()-(notices.get(key)||0)>5000){notices.set(key,Date.now());await conn.sendMessage(jid,{text:message}).catch(()=>{});}}
  if(!allowed.length){const error=new Error(blocked[0]?.message||'Alvo protegido');error.code='KOBA_PROTECTED_REMOVAL';throw error;}
  const result=await original(jid,allowed,action);
  return [...(Array.isArray(result)?result:[]),...blocked.map(x=>({jid:x.target,status:'403',protected:true}))];
 };
}
