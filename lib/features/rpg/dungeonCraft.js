import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const DB=path.join(process.cwd(),"files","database","dragon-rpg-craft.json");
export const DUNGEONS={
 floresta:{name:"Floresta Ancestral",emoji:"🌲",min:1,energy:10,drops:["madeira","essencia","cristal"]},
 caverna:{name:"Caverna Dracônica",emoji:"⛰️",min:5,energy:15,drops:["ferro","escama","cristal"]},
 ruinas:{name:"Ruínas Arcanas",emoji:"🏛️",min:10,energy:20,drops:["cristal","essencia","sombra"]},
 abismo:{name:"Abismo Sombrio",emoji:"🌑",min:20,energy:30,drops:["sombra","escama","cristal"]}};
export const MATERIALS={escama:"🐉 Escama de Dragão",ferro:"⛓️ Ferro Dracônico",cristal:"💎 Cristal Arcano",madeira:"🪵 Madeira Ancestral",essencia:"✨ Essência Mágica",sombra:"🌑 Fragmento Sombrio"};
export const RECIPES={
 pocao:{name:"🧪 Poção Dracônica",needs:{essencia:2,cristal:1}},
 espada:{name:"⚔️ Espada Dracônica",needs:{ferro:4,escama:2}},
 arco:{name:"🏹 Arco Ancestral",needs:{madeira:4,cristal:2}},
 cajado:{name:"🪄 Cajado Arcano",needs:{madeira:2,cristal:3,essencia:2}},
 armadura:{name:"🛡️ Armadura de Escamas",needs:{escama:5,ferro:3}},
 amuleto:{name:"📿 Amuleto Sombrio",needs:{sombra:3,cristal:2}}};
function load(){try{return JSON.parse(fs.readFileSync(DB,"utf8"))}catch{return {users:{}}}}
function save(d){fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(d,null,2))}
function U(d,j){d.users||={};return d.users[j]||=( {materials:{},crafted:{},energy:100,lastDungeon:0,runs:0} )}
const rnd=(a,b)=>crypto.randomInt(a,b+1);
export function profile(j){const d=load(),u=U(d,j);save(d);return u}
export function dungeon(j,id,level=1){
 const x=DUNGEONS[id];if(!x)return {ok:false,e:"NOT_FOUND"};if(level<x.min)return {ok:false,e:"LEVEL",need:x.min};
 const d=load(),u=U(d,j);if(u.energy<x.energy)return {ok:false,e:"ENERGY",need:x.energy,energy:u.energy};
 const wait=120000-(Date.now()-u.lastDungeon);if(wait>0)return {ok:false,e:"COOLDOWN",wait};
 u.energy-=x.energy;u.lastDungeon=Date.now();u.runs++;const win=rnd(1,100)<=82,drops={};
 if(win)for(let i=0;i<rnd(2,4);i++){const m=x.drops[rnd(0,x.drops.length-1)],q=rnd(1,id==="abismo"?3:2);drops[m]=(drops[m]||0)+q;u.materials[m]=(u.materials[m]||0)+q}
 save(d);return {ok:true,win,x,drops,energy:u.energy,xp:win?rnd(25,65)+x.min:0,coins:win?rnd(15,45)+x.min:0}}
export function craft(j,id){
 const r=RECIPES[id];if(!r)return {ok:false,e:"NOT_FOUND"};const d=load(),u=U(d,j),missing={};
 for(const [m,q] of Object.entries(r.needs))if((u.materials[m]||0)<q)missing[m]=q-(u.materials[m]||0);
 if(Object.keys(missing).length)return {ok:false,e:"MATERIALS",missing,r};
 for(const [m,q] of Object.entries(r.needs))u.materials[m]-=q;u.crafted[id]=(u.crafted[id]||0)+1;save(d);return {ok:true,r,count:u.crafted[id]}}
export function rest(j){const d=load(),u=U(d,j),before=u.energy;u.energy=Math.min(100,u.energy+35);save(d);return {before,after:u.energy}}
export const fmt=m=>Object.entries(m||{}).map(([k,v])=>`${MATERIALS[k]||k}: *${v}*`).join("\n");
export const needs=n=>Object.entries(n||{}).map(([k,v])=>`${MATERIALS[k]||k} x${v}`).join(", ");
