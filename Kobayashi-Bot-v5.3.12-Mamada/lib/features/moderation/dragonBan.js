import fs from "node:fs";import path from "node:path";
const DB=path.resolve("files/database/dragon-ban.json");
export const DRAGON_COMMUNITY_GROUPS=Object.freeze([
{name:"Dragon divulgações",jid:"120363409995250913@g.us"},
{name:"Maid porn",jid:"120363426504134468@g.us"},
{name:"Maid femboy",jid:"120363427920501968@g.us"},
{name:"Dragon Stickers",jid:"120363423888338432@g.us"},
{name:"Maid Dragon",jid:"120363405231826649@g.us"},
{name:"Dragon RPG",jid:"120363428210974331@g.us"}]);
const load=()=>{try{return fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,"utf8")):{users:{}}}catch{return{users:{}}}};
const save=d=>{fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(d,null,2))};
const J=x=>String(x||"").trim();
export const addDragonBan=(target,by,reason="Sem motivo")=>{const d=load();d.users??={};const k=J(target);d.users[k]={target:k,by:J(by),reason:String(reason||"Sem motivo").slice(0,300),at:Date.now()};save(d);return d.users[k]};
export const removeDragonBan=target=>{const d=load(),k=J(target);if(!d.users?.[k])return false;delete d.users[k];save(d);return true};
export const listDragonBans=()=>Object.values(load()?.users||{}).sort((a,b)=>Number(b.at||0)-Number(a.at||0));
export async function purgeDragonBannedUser(conn,target){
 const results=[];
 for(const group of DRAGON_COMMUNITY_GROUPS){try{
  const meta=await conn.groupMetadata(group.jid),ps=meta?.participants||[];
  const match=p=>[p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).map(String).includes(String(target));
  if(!ps.some(match)){results.push({...group,status:"ausente"});continue}
  await conn.groupParticipantsUpdate(group.jid,[target],"remove");
  results.push({...group,status:"removido"});
 }catch(e){results.push({...group,status:"erro",error:String(e?.message||e)})}}
 return results;
}
