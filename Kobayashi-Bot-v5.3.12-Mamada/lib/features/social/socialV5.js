import fs from "fs";
import path from "path";

const DB=path.resolve("files/database/social-v5.json");
const load=()=>{try{return fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,"utf8")):{}}catch{return {}}};
const save=d=>{fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(d,null,2))};
const G=g=>String(g||""), U=u=>String(u||"");
function mutate(g,fn){const d=load();d[G(g)]??={enabled:false,users:{},notes:[]};const r=fn(d[G(g)]);save(d);return r}
function user(x,u){
  x.users??={};
  const p=x.users[U(u)]??={rep:0,gifts:[],achievements:[],afk:null};
  p.rep=Number(p.rep||0); p.gifts??=[]; p.achievements??=[]; p.repGiven=Number(p.repGiven||0);
  return p;
}
const repRank=n=>n>=100?"Lendário":n>=50?"Famoso":n>=25?"Respeitado":n>=10?"Conhecido":n>=5?"Boa Companhia":"Novato";
export const v5SocialEnabled=g=>load()?.[G(g)]?.enabled===true;
export const v5SetSocialEnabled=(g,v)=>mutate(g,x=>x.enabled=!!v);
export const v5SetAfk=(g,u,reason)=>mutate(g,x=>{const a={since:Date.now(),reason:String(reason||"Sem motivo").slice(0,200)};user(x,u).afk=a;return a});
export const v5GetAfk=(g,u)=>load()?.[G(g)]?.users?.[U(u)]?.afk||null;
export const v5ClearAfk=(g,u)=>mutate(g,x=>{const a=user(x,u).afk;user(x,u).afk=null;return a});
export const v5FormatDuration=ms=>{
  const sec=Math.max(0,Math.floor(Number(ms||0)/1000));
  const d=Math.floor(sec/86400),h=Math.floor((sec%86400)/3600),m=Math.floor((sec%3600)/60),ss=sec%60;
  return [d&&`${d}d`,h&&`${h}h`,m&&`${m}m`,(!d&&!h&&!m)&&`${ss}s`].filter(Boolean).join(" ");
};
export const v5RepRank=rep=>repRank(Number(rep||0));
export const v5AddRep=(g,from,to)=>mutate(g,x=>{
  x.repCooldown??={}; const k=U(from),now=Date.now(),last=Number(x.repCooldown[k]||0);
  if(now-last<12*60*60*1000)return{cooldown:12*60*60*1000-(now-last)};
  x.repCooldown[k]=now;
  const giver=user(x,from),target=user(x,to); giver.repGiven++;
  target.rep++;
  if(target.rep>=5&&!target.achievements.includes("Boa Companhia"))target.achievements.push("Boa Companhia");
  if(target.rep>=25&&!target.achievements.includes("Respeitado"))target.achievements.push("Respeitado");
  if(target.rep>=50&&!target.achievements.includes("Famoso"))target.achievements.push("Famoso");
  if(target.rep>=100&&!target.achievements.includes("Lendário"))target.achievements.push("Lendário");
  return{rep:target.rep,rank:repRank(target.rep),given:giver.repGiven};
});
export const v5GiveGift=(g,from,to,item)=>mutate(g,x=>{
  const t=user(x,to);const gift={from:U(from),item:String(item||"🎁 Presente").slice(0,80),at:Date.now()};
  t.gifts.push(gift);if(t.gifts.length>50)t.gifts.shift();
  if(t.gifts.length>=10&&!t.achievements.includes("Queridinho"))t.achievements.push("Queridinho");
  return gift;
});
export const v5ProfileSocial=(g,u)=>{
  const x=load()?.[G(g)],p=x?.users?.[U(u)]||{rep:0,gifts:[],achievements:[],afk:null,repGiven:0};
  const rep=Number(p.rep||0);
  return{rep,rank:repRank(rep),repGiven:Number(p.repGiven||0),gifts:p.gifts||[],achievements:p.achievements||[],afk:p.afk||null};
};
export const v5ProcessSocialMessage=(g,sender,mentions=[])=>{
  const group=G(g),who=U(sender),now=Date.now(),d=load(),x=d?.[group];
  if(!x?.enabled||!who)return{enabled:false,returned:null,afkMentions:[]};
  x.users??={}; x.afkNotifyCooldown??={};
  let returned=null;
  const me=x.users[who];
  if(me?.afk){returned={...me.afk,duration:now-Number(me.afk.since||now)};me.afk=null;}
  const afkMentions=[];
  for(const jid of [...new Set((mentions||[]).map(U).filter(Boolean))]){
    if(jid===who)continue;
    const a=x.users?.[jid]?.afk;
    if(!a)continue;
    const key=`${who}|${jid}`,last=Number(x.afkNotifyCooldown[key]||0);
    if(now-last<60_000)continue;
    x.afkNotifyCooldown[key]=now;
    afkMentions.push({jid,reason:a.reason||"Sem motivo",since:Number(a.since||now),duration:now-Number(a.since||now)});
  }
  save(d);
  return{enabled:true,returned,afkMentions};
};
export const v5AddNote=(g,by,text)=>mutate(g,x=>{x.notes??=[];const n={id:(x.notes.at(-1)?.id||0)+1,by:U(by),text:String(text||"").slice(0,500),at:Date.now()};x.notes.push(n);if(x.notes.length>100)x.notes.shift();return n});
export const v5ListNotes=g=>(load()?.[G(g)]?.notes||[]);
export const v5RemoveNote=(g,id)=>mutate(g,x=>{const i=(x.notes||[]).findIndex(n=>n.id===Number(id));if(i<0)return false;x.notes.splice(i,1);return true});
