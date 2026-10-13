import { purgeGroups } from "./groupPurge.js";
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
export async function purgeDragonBannedUser(conn,target,options={}){
 const rows=await purgeGroups(conn,target,DRAGON_COMMUNITY_GROUPS,options);
 return rows.map(r=>({...r,status:r.status==='removed'?'removido':r.status==='absent'?'ausente':'erro',error:r.error||(r.status==='not-admin'?'Bot sem permissão de ADM':r.status==='protected'?'Alvo protegido':undefined)}));
}
