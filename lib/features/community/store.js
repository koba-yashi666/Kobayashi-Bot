import fs from 'node:fs';
import path from 'node:path';
export const root=()=>path.join(process.cwd(),'files/database/community');
export function readCommunity(){const file=path.join(root(),'state.json');if(!fs.existsSync(file))return {groups:{},custom:{},challenges:{}};return JSON.parse(fs.readFileSync(file,'utf8'));}
export function updateCommunity(fn){const db=readCommunity();const value=fn(db);fs.mkdirSync(root(),{recursive:true});const file=path.join(root(),'state.json');fs.writeFileSync(file+'.tmp',JSON.stringify(db,null,2));fs.renameSync(file+'.tmp',file);return value;}
export function communityGroup(db,jid){return db.groups[jid]??={captcha:false,support:false,tickets:[],schedules:[]};}
export const cleanJid=id=>String(id||'').replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');
export function clockSP(now=Date.now()){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);const get=type=>parts.find(p=>p.type===type).value;return {day:`${get('year')}-${get('month')}-${get('day')}`,time:`${get('hour')}:${get('minute')}`};}
export function validTime(time){return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);}
export function dueSchedule(job,now=Date.now()){const clock=clockSP(now);return job.enabled&&job.time===clock.time&&job.lastDay!==clock.day;}
export function renderCustom(template,{user='',group='',prefix='/',args=''}){return String(template||'').replace(/\{(user|grupo|prefixo|args)\}/g,(_,key)=>({user,grupo:group,prefixo:prefix,args})[key]);}
