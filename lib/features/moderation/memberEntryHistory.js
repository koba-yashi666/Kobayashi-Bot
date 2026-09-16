import fs from "fs"; import path from "path";
const DB=path.resolve("files/database/member-entry-history.json");
const load=()=>{try{return fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,"utf8")):{}}catch{return {}}};
const save=d=>{try{fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(d,null,2))}catch{}};
const key=v=>String(v||"").replace(/\D/g,"");
export function recordMemberEntry(g,p,t=Date.now()){g=String(g||"");const k=key(p);if(!g||!k)return false;const d=load();d[g]??={};d[g][k]={jid:String(p),joinedAt:Number(t)||Date.now()};save(d);return true}
export function getMemberEntry(g,p){return load()?.[String(g||"")]?.[key(p)]||null}
