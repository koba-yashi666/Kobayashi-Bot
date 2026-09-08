import fs from "node:fs";
import path from "node:path";

const DB = path.join(process.cwd(), "files", "database", "rank-adm.json");
const TYPES = ["text","photos","videos","stickers","commands"];

function read(){
  try{
    fs.mkdirSync(path.dirname(DB), {recursive:true});
    if(!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({groups:{}}, null, 2));
    const d = JSON.parse(fs.readFileSync(DB, "utf8"));
    d.groups ||= {};
    return d;
  }catch{
    return {groups:{}};
  }
}
function write(d){
  fs.mkdirSync(path.dirname(DB), {recursive:true});
  fs.writeFileSync(DB, JSON.stringify(d, null, 2));
}
const n = x => String(x || "").toLowerCase().trim();
const empty = () => ({
  text:0, photos:0, videos:0, stickers:0, commands:0,
  total:0, firstSeenAt:null, lastSeenAt:null
});
function hydrate(row={}){
  const r = {...empty(), ...row};
  r.total = Number(r.text||0)+Number(r.photos||0)+Number(r.videos||0)+Number(r.stickers||0)+Number(r.commands||0);
  return r;
}

export function trackAdminActivity(g,u,k){
  if(!g || !u || !["text","photo","video","sticker","command"].includes(k)) return;
  const d=read(), G=n(g), U=n(u);
  d.groups[G] ||= {};
  const r=hydrate(d.groups[G][U] || {});
  if(k==="text") r.text++;
  if(k==="photo") r.photos++;
  if(k==="video") r.videos++;
  if(k==="sticker") r.stickers++;
  if(k==="command") r.commands++;
  r.total=r.text+r.photos+r.videos+r.stickers+r.commands;
  r.firstSeenAt ||= Date.now();
  r.lastSeenAt=Date.now();
  d.groups[G][U]=r;
  write(d);
}

export function getAdminActivityRank(g,admins=[],limit=10,sortBy="total"){
  const d=read(), set=new Set(admins.map(n));
  const allowed = new Set(["total","text","photos","videos","stickers","commands"]);
  const key = allowed.has(sortBy) ? sortBy : "total";

  return Object.entries(d.groups?.[n(g)] || {})
    .filter(([j]) => set.has(n(j)))
    .map(([jid,x]) => ({jid, ...hydrate(x)}))
    .sort((a,b) => Number(b[key]||0)-Number(a[key]||0) || b.total-a.total || b.commands-a.commands)
    .slice(0, Math.max(1, Number(limit)||10));
}

export function getAdminActivityStats(g,admins=[]){
  const all = getAdminActivityRank(g,admins,9999,"total");
  const totals = all.reduce((acc,r)=>{
    acc.text += r.text;
    acc.photos += r.photos;
    acc.videos += r.videos;
    acc.stickers += r.stickers;
    acc.commands += r.commands;
    acc.total += r.total;
    return acc;
  }, {text:0,photos:0,videos:0,stickers:0,commands:0,total:0});

  const leaders = {};
  for(const key of ["text","photos","videos","stickers","commands"]){
    leaders[key] = [...all].sort((a,b)=>Number(b[key]||0)-Number(a[key]||0))[0] || null;
  }

  return {all, totals, leaders, activeAdmins: all.filter(x=>x.total>0).length};
}

export function getAdminActivityUser(g,jid){
  const d=read();
  const row=d.groups?.[n(g)]?.[n(jid)];
  return row ? {jid:n(jid), ...hydrate(row)} : null;
}

export function resetAdminActivityRank(g){
  const d=read(), G=n(g);
  if(!d.groups[G]) return false;
  delete d.groups[G];
  write(d);
  return true;
}
