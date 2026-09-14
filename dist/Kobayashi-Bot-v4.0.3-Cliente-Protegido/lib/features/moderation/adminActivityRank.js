/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const DB = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x72\x61\x6e\x6b\x2d\x61\x64\x6d\x2e\x6a\x73\x6f\x6e");
const TYPES = ["\x74\x65\x78\x74","\x70\x68\x6f\x74\x6f\x73","\x76\x69\x64\x65\x6f\x73","\x73\x74\x69\x63\x6b\x65\x72\x73","\x63\x6f\x6d\x6d\x61\x6e\x64\x73"];

function read(){
  try{
    fs.mkdirSync(path.dirname(DB), {recursive:true});
    if(!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({groups:{}}, null, 2));
    const d = JSON.parse(fs.readFileSync(DB, "\x75\x74\x66\x38"));
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
  if(!g || !u || !["\x74\x65\x78\x74","\x70\x68\x6f\x74\x6f","\x76\x69\x64\x65\x6f","\x73\x74\x69\x63\x6b\x65\x72","\x63\x6f\x6d\x6d\x61\x6e\x64"].includes(k)) return;
  const d=read(), G=n(g), U=n(u);
  d.groups[G] ||= {};
  const r=hydrate(d.groups[G][U] || {});
  if(k==="\x74\x65\x78\x74") r.text++;
  if(k==="\x70\x68\x6f\x74\x6f") r.photos++;
  if(k==="\x76\x69\x64\x65\x6f") r.videos++;
  if(k==="\x73\x74\x69\x63\x6b\x65\x72") r.stickers++;
  if(k==="\x63\x6f\x6d\x6d\x61\x6e\x64") r.commands++;
  r.total=r.text+r.photos+r.videos+r.stickers+r.commands;
  r.firstSeenAt ||= Date.now();
  r.lastSeenAt=Date.now();
  d.groups[G][U]=r;
  write(d);
}

export function getAdminActivityRank(g,admins=[],limit=10,sortBy="\x74\x6f\x74\x61\x6c"){
  const d=read(), set=new Set(admins.map(n));
  const allowed = new Set(["\x74\x6f\x74\x61\x6c","\x74\x65\x78\x74","\x70\x68\x6f\x74\x6f\x73","\x76\x69\x64\x65\x6f\x73","\x73\x74\x69\x63\x6b\x65\x72\x73","\x63\x6f\x6d\x6d\x61\x6e\x64\x73"]);
  const key = allowed.has(sortBy) ? sortBy : "\x74\x6f\x74\x61\x6c";

  return Object.entries(d.groups?.[n(g)] || {})
    .filter(([j]) => set.has(n(j)))
    .map(([jid,x]) => ({jid, ...hydrate(x)}))
    .sort((a,b) => Number(b[key]||0)-Number(a[key]||0) || b.total-a.total || b.commands-a.commands)
    .slice(0, Math.max(1, Number(limit)||10));
}

export function getAdminActivityStats(g,admins=[]){
  const all = getAdminActivityRank(g,admins,9999,"\x74\x6f\x74\x61\x6c");
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
  for(const key of ["\x74\x65\x78\x74","\x70\x68\x6f\x74\x6f\x73","\x76\x69\x64\x65\x6f\x73","\x73\x74\x69\x63\x6b\x65\x72\x73","\x63\x6f\x6d\x6d\x61\x6e\x64\x73"]){
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
