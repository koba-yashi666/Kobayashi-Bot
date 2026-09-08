import fs from "node:fs";
import path from "node:path";
const DB=path.join(process.cwd(),"files","database","rank-adm.json");
function read(){try{fs.mkdirSync(path.dirname(DB),{recursive:true});if(!fs.existsSync(DB))fs.writeFileSync(DB,JSON.stringify({groups:{}},null,2));const d=JSON.parse(fs.readFileSync(DB,"utf8"));d.groups||={};return d}catch{return {groups:{}}}}
function write(d){fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(d,null,2))}
const n=x=>String(x||"").toLowerCase().trim(), empty=()=>({text:0,photos:0,videos:0,stickers:0,commands:0,total:0});
export function trackAdminActivity(g,u,k){if(!g||!u||!["text","photo","video","sticker","command"].includes(k))return;const d=read(),G=n(g),U=n(u);d.groups[G]||={};const r={...empty(),...(d.groups[G][U]||{})};if(k==="text")r.text++;if(k==="photo")r.photos++;if(k==="video")r.videos++;if(k==="sticker")r.stickers++;if(k==="command")r.commands++;r.total=r.text+r.photos+r.videos+r.stickers+r.commands;r.lastSeenAt=Date.now();d.groups[G][U]=r;write(d)}
export function getAdminActivityRank(g,admins=[],limit=10){const d=read(),set=new Set(admins.map(n));return Object.entries(d.groups?.[n(g)]||{}).filter(([j])=>set.has(n(j))).map(([jid,x])=>({jid,...empty(),...x})).map(x=>({...x,total:+x.text + +x.photos + +x.videos + +x.stickers + +x.commands})).sort((a,b)=>b.total-a.total||b.commands-a.commands).slice(0,limit)}
export function resetAdminActivityRank(g){const d=read(),G=n(g);if(!d.groups[G])return false;delete d.groups[G];write(d);return true}
