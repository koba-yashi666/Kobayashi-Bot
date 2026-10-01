import fs from "fs"; import path from "path";
const DB=path.join(process.cwd(),"files","database","anti-msg-global.json"), AU=path.join(process.cwd(),"files","database","anti-msg-global-auditoria.json");
function rd(p,d){fs.mkdirSync(path.dirname(p),{recursive:true});if(!fs.existsSync(p))fs.writeFileSync(p,JSON.stringify(d,null,2));try{return JSON.parse(fs.readFileSync(p,"utf8"))}catch{return d}}
function wr(p,d){const t=p+".tmp";fs.writeFileSync(t,JSON.stringify(d,null,2));fs.renameSync(t,p)}
const n=s=>String(s||"").trim().replace(/\r\n/g,"\n");
export function getAntiMsgGlobalConfig(){let d=rd(DB,{enabled:false,rules:[]});return {enabled:d.enabled===true,rules:Array.isArray(d.rules)?d.rules:[]}}
export function setAntiMsgGlobalEnabled(x){let d=getAntiMsgGlobalConfig();d.enabled=!!x;wr(DB,d);return d.enabled}
export function addAntiMsgGlobalRule(m,by){let x=n(m);if(!x)return null;let d=getAntiMsgGlobalConfig(),old=d.rules.find(r=>n(r.message)===x);if(old)return old;let id=d.rules.reduce((a,r)=>Math.max(a,+r.id||0),0)+1,r={id,message:x,by,createdAt:new Date().toISOString()};d.rules.push(r);wr(DB,d);return r}
export function removeAntiMsgGlobalRule(id){let d=getAntiMsgGlobalConfig(),i=d.rules.findIndex(r=>+r.id===+id);if(i<0)return null;let [r]=d.rules.splice(i,1);wr(DB,d);return r}
export function listAntiMsgGlobalRules(){return getAntiMsgGlobalConfig().rules}
export function matchAntiMsgGlobal(m){let x=n(m),d=getAntiMsgGlobalConfig();return d.enabled&&x?d.rules.find(r=>n(r.message)===x)||null:null}
export function addAntiMsgGlobalAudit(e){let d=rd(AU,{seq:0,logs:[]});d.seq=(+d.seq||0)+1;let x={id:`AMG-${String(d.seq).padStart(4,"0")}`,at:new Date().toISOString(),...e};d.logs.unshift(x);d.logs=d.logs.slice(0,1000);wr(AU,d);return x}
export function listAntiMsgGlobalAudit(l=10){return rd(AU,{seq:0,logs:[]}).logs.slice(0,Math.min(100,+l||10))}
export function getAntiMsgGlobalAudit(id){return rd(AU,{seq:0,logs:[]}).logs.find(x=>String(x.id).toLowerCase()===String(id).toLowerCase())||null}
