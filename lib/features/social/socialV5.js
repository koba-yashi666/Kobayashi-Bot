import fs from "fs";import path from "path";
const DB=path.resolve("files/database/social-v5.json");
const load=()=>{try{return fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,"utf8")):{}}catch{return {}}};
const save=d=>{fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(d,null,2))};
const G=g=>String(g||""), U=u=>String(u||"");
function mutate(g,fn){const d=load();d[G(g)]??={enabled:false,users:{},notes:[]};const r=fn(d[G(g)]);save(d);return r}
function user(x,u){x.users??={};return x.users[U(u)]??={rep:0,gifts:[],achievements:[],afk:null}}
export const v5SocialEnabled=g=>load()?.[G(g)]?.enabled===true;
export const v5SetSocialEnabled=(g,v)=>mutate(g,x=>x.enabled=!!v);
export const v5SetAfk=(g,u,reason)=>mutate(g,x=>{const a={since:Date.now(),reason:String(reason||"Sem motivo").slice(0,200)};user(x,u).afk=a;return a});
export const v5GetAfk=(g,u)=>load()?.[G(g)]?.users?.[U(u)]?.afk||null;
export const v5ClearAfk=(g,u)=>mutate(g,x=>{const a=user(x,u).afk;user(x,u).afk=null;return a});
export const v5AddRep=(g,from,to)=>mutate(g,x=>{x.repCooldown??={};const k=U(from),now=Date.now(),last=Number(x.repCooldown[k]||0);if(now-last<12*60*60*1000)return{cooldown:12*60*60*1000-(now-last)};x.repCooldown[k]=now;const t=user(x,to);t.rep=(t.rep||0)+1;if(t.rep===5&&!t.achievements.includes("Boa Companhia"))t.achievements.push("Boa Companhia");if(t.rep===25&&!t.achievements.includes("Respeitado"))t.achievements.push("Respeitado");return{rep:t.rep}});
export const v5GiveGift=(g,from,to,item)=>mutate(g,x=>{const t=user(x,to);const gift={from:U(from),item:String(item||"🎁 Presente").slice(0,80),at:Date.now()};t.gifts.push(gift);if(t.gifts.length>50)t.gifts.shift();if(t.gifts.length>=10&&!t.achievements.includes("Queridinho"))t.achievements.push("Queridinho");return gift});
export const v5ProfileSocial=(g,u)=>{const x=load()?.[G(g)];const p=x?.users?.[U(u)]||{rep:0,gifts:[],achievements:[],afk:null};return{rep:p.rep||0,gifts:p.gifts||[],achievements:p.achievements||[],afk:p.afk||null}};
export const v5AddNote=(g,by,text)=>mutate(g,x=>{x.notes??=[];const n={id:(x.notes.at(-1)?.id||0)+1,by:U(by),text:String(text||"").slice(0,500),at:Date.now()};x.notes.push(n);if(x.notes.length>100)x.notes.shift();return n});
export const v5ListNotes=g=>(load()?.[G(g)]?.notes||[]);
export const v5RemoveNote=(g,id)=>mutate(g,x=>{const i=(x.notes||[]).findIndex(n=>n.id===Number(id));if(i<0)return false;x.notes.splice(i,1);return true});
