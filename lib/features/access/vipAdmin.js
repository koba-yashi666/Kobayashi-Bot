import fs from 'node:fs';
import path from 'node:path';
import aliases from './vipAliases.json' with { type: 'json' };
export const vipCommand = value => aliases[String(value || '').trim().replace(/^[^\p{L}\p{N}_]+/u, '').toLowerCase()] || String(value || '').trim().replace(/^[^\p{L}\p{N}_]+/u, '').toLowerCase();
const file = () => path.join(process.cwd(), 'files/database/vip-admin.json');
function read() {
 if (!fs.existsSync(file())) return {commands:[],members:[],warnings:{}};
 const data=JSON.parse(fs.readFileSync(file(),'utf8'));
 return {commands:[],members:[],warnings:{},...data};
}
function write(data) { fs.mkdirSync(path.dirname(file()),{recursive:true});fs.writeFileSync(file()+'.tmp',JSON.stringify(data,null,2));fs.renameSync(file()+'.tmp',file()); }
export function vipState() {return read();}
export function vipAllowed(command, identities, owner=false) {
 const db=read();return owner || !db.commands.includes(vipCommand(command)) || db.members.some(m=>m.ids.some(id=>identities.includes(id)));
}
export function setVipCommand(command, enabled) {
 const db=read(), name=vipCommand(command);db.commands=db.commands.filter(c=>c!==name);if(enabled)db.commands.push(name);write(db);return name;
}
export function setVipMember(ids, name, enabled) {
 const db=read();db.members=db.members.filter(m=>!m.ids.some(id=>ids.includes(id)));if(enabled)db.members.push({ids:[...new Set(ids)],name,at:Date.now()});write(db);
}
export function adminWarnings(group, now=Date.now()) {return (read().warnings[group]||[]).filter(w=>w.expiresAt>now);}
export function addAdminWarning(group,target,reason,by,duration,now=Date.now()) {
 const db=read();const warning={target,reason,by,at:now,expiresAt:now+duration};db.warnings[group]=[...(db.warnings[group]||[]).filter(w=>w.expiresAt>now),warning];write(db);return warning;
}
