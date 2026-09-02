import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DB_FILE = path.join(process.cwd(), "files", "database", "dragon-fun-v09.json");
const ASSET = (...p) => path.join(process.cwd(), "assets", "dragon_fun", ...p);
const DAY = 86400000;

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, file);
}
function baseDb() { return { schema: 1, groups: {}, users: {}, marriages: {}, proposals: {}, sessions: {}, families: {}, clans: {}, updatedAt: Date.now() }; }
export function loadFunDb() {
  const db = readJson(DB_FILE, baseDb());
  return { ...baseDb(), ...db, groups: db.groups || {}, users: db.users || {}, marriages: db.marriages || {}, proposals: db.proposals || {}, sessions: db.sessions || {}, families: db.families || {}, clans: db.clans || {} };
}
function save(db) { db.updatedAt = Date.now(); writeJson(DB_FILE, db); }
function user(db, jid) {
  db.users[jid] ||= {
    coins: 250, bank: 0, xp: 0, level: 1, dailyAt: 0, workAt: 0,
    inventory: {}, wins: 0, losses: 0, games: 0, streak: 0,
    job: null, pets: [], materials: {}, foods: {}, farm: {},
    achievements: [], reputation: 0, prestige: 0, createdAt: Date.now()
  };
  return db.users[jid];
}
function recalc(u) { u.level = Math.max(1, Math.floor(Math.sqrt(Math.max(0, u.xp) / 100)) + 1); return u.level; }
function reward(db, jid, coins=0, xp=0, win=null) {
  const u=user(db,jid); u.coins=Math.max(0,Number(u.coins||0)+coins); u.xp=Math.max(0,Number(u.xp||0)+xp); recalc(u); u.games++;
  if(win===true) u.wins++; if(win===false) u.losses++;
  save(db); return u;
}
function norm(s="") { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim(); }
function pick(a) { return a[Math.floor(Math.random()*a.length)]; }
function pct(seed) { const h=crypto.createHash("sha256").update(seed).digest(); return h.readUInt16BE(0)%101; }
function dayKey(){ return new Date().toISOString().slice(0,10); }
export function stablePercent(jid, trait){ return pct(`${jid}|${norm(trait)}|${dayKey()}`); }
export function getUser(jid){ const db=loadFunDb(); return JSON.parse(JSON.stringify(user(db,jid))); }
export function getRank(jids=[], trait="sorte", limit=10){ return [...new Set(jids)].map(jid=>({jid,score:stablePercent(jid,trait)})).sort((a,b)=>b.score-a.score).slice(0,limit); }

export const HUTAO_MEDIA = readJson(ASSET("hutao","imglinks.json"), {});
export const NAZUNA_GAME_IMAGES = readJson(ASSET("nazuna","games.json"), {}).games || {};
const TEXT1 = readJson(ASSET("nazuna","gamestext.json"), {});
const TEXT2 = readJson(ASSET("nazuna","gamestext2.json"), {});
export function traitText(trait, name, level){
  const t=norm(trait); const template=TEXT1[t] || TEXT2[t];
  return template ? template.replace(/#nome#/g,name).replace(/#level#/g,String(level)) : `🎲 ${name} marcou *${level}%* no medidor de *${trait}*!`;
}
export function mediaFor(command){
  const map={
    beijo:"imgbeijo", beijar:"imgbeijo", abraco:"imgabraco", abraço:"imgabraco", carinho:"imgcarinho", tapa:"imgtapa", tapar:"imgtapa",
    chute:"imgchute", chutar:"imgchute", matar:"imgmatar", comer:"imgcomer", louca:"imglouca", louça:"imglouca",
    gay:"imggay", lesbica:"imglesbica", linda:"imglinda", lindo:"imglindo", feio:"imgfeio", gado:"imgado", corno:"imgcorno",
    gostosa:"imgostosa", gostoso:"imgostoso", vesgo:"imgvesgo", bebado:"imgbebado", nazista:"imgnazista", minerar:"imgminerar", enigma:"imgEnigma"
  };
  const key=map[norm(command)]; if(key && HUTAO_MEDIA[key]) return HUTAO_MEDIA[key];
  const n=NAZUNA_GAME_IMAGES[norm(command)]?.image?.url; return n || null;
}

const forcaH=readJson(ASSET("hutao","forca.json"),[]);
const forcaN=readJson(ASSET("nazuna","forca.json"),{}).palavras || [];
const anag=readJson(ASSET("nazuna","anagrama.json"),{}).palavras || [];
const quiz=readJson(ASSET("nazuna","quiz.json"),{});
const wordle=readJson(ASSET("nazuna","wordle.json"),{});
const vord=readJson(ASSET("hutao","vord.json"),[]);

function setSession(db,gid,type,data){ db.sessions[gid]={type,...data,createdAt:Date.now()}; save(db); return db.sessions[gid]; }
export function getSession(gid){ return loadFunDb().sessions[gid] || null; }
export function clearSession(gid){ const db=loadFunDb(); delete db.sessions[gid]; save(db); }
export function startForca(gid, by){ const db=loadFunDb(); const pool=[...forcaH.map(x=>({word:x.plvr,hint:x.dica,theme:x.tema})),...forcaN.map(x=>({word:x.palavra,hint:x.dica,theme:"geral"}))]; const x=pick(pool); return setSession(db,gid,"forca",{by,word:norm(x.word),display:x.word,hint:x.hint,theme:x.theme,guessed:[],tries:6}); }
export function guessForca(gid,jid,input){ const db=loadFunDb(); const s=db.sessions[gid]; if(!s||s.type!=="forca") return {ok:false,reason:"none"}; const g=norm(input); if(!g) return {ok:false,reason:"empty"}; if(g===norm(s.word)){ delete db.sessions[gid]; reward(db,jid,60,45,true); return {ok:true,win:true,word:s.display}; }
  const ch=g[0]; if(!s.guessed.includes(ch)) s.guessed.push(ch); if(!norm(s.word).includes(ch)) s.tries--; const masked=[...norm(s.word)].map(c=>c===" "?" ":s.guessed.includes(c)?c:"_ ").join("");
  if(s.tries<=0){ const w=s.display; delete db.sessions[gid]; reward(db,jid,0,5,false); return {ok:true,lose:true,word:w}; }
  save(db); return {ok:true,masked,tries:s.tries,hint:s.hint,theme:s.theme}; }
export function startAnagram(gid,by){ const db=loadFunDb(); const x=pick(anag); const w=norm(x.palavra); let arr=[...w]; for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return setSession(db,gid,"anagrama",{by,word:w,display:x.palavra,hint:x.dica,scrambled:arr.join("")}); }
export function answerSimple(gid,jid,input){ const db=loadFunDb(); const s=db.sessions[gid]; if(!s) return {ok:false,reason:"none"}; const a=norm(input); let valid=false, display=s.display||s.word;
  if(s.type==="anagrama") valid=a===norm(s.word);
  if(s.type==="quiz") valid=(s.answers||[]).some(x=>norm(x)===a);
  if(s.type==="enigma") valid=(s.answers||[]).some(x=>norm(x)===a);
  if(s.type==="wordle") valid=a===norm(s.word);
  if(!valid) return {ok:true,correct:false}; delete db.sessions[gid]; reward(db,jid,50,35,true); return {ok:true,correct:true,answer:display}; }
export function startQuiz(gid,by,category="geral"){ const db=loadFunDb(); const cats=Object.keys(quiz).filter(k=>Array.isArray(quiz[k])&&quiz[k].length); const cat=quiz[category]?category:pick(cats); const x=pick(quiz[cat]); return setSession(db,gid,"quiz",{by,category:cat,question:x.p,answers:x.r||[x.d],display:x.d}); }
export function startEnigma(gid,by){ const db=loadFunDb(); const bank=[
 {q:"Tenho cidades, mas não casas; montanhas, mas não árvores; água, mas não peixes. O que sou?",a:["mapa"]},
 {q:"Quanto mais você tira de mim, maior eu fico. O que sou?",a:["buraco"]},
 {q:"O que sobe e nunca desce?",a:["idade","a idade"]},
 {q:"Tem dentes mas não morde. O que é?",a:["pente","um pente"]}
 ]; const x=pick(bank); return setSession(db,gid,"enigma",{by,question:x.q,answers:x.a,display:x.a[0]}); }
export function startWordle(gid,by){ const db=loadFunDb(); let pool=[]; if(Array.isArray(wordle.palavras)) pool=wordle.palavras; else if(Array.isArray(wordle.words)) pool=wordle.words; else pool=["dragao","maid","anime","jogos","grupo","bot"];
 const x=pick(pool); const w=typeof x==="string"?x:(x.palavra||x.word||"dragao"); return setSession(db,gid,"wordle",{by,word:norm(w),display:w,tries:6}); }
export function guessWordle(gid,jid,input){ const db=loadFunDb(); const s=db.sessions[gid]; if(!s||s.type!=="wordle") return {ok:false}; const g=norm(input); if(g.length!==s.word.length) return {ok:true,invalid:true,len:s.word.length}; if(g===s.word){delete db.sessions[gid];reward(db,jid,70,50,true);return {ok:true,win:true,word:s.display};}
 let out=""; [...g].forEach((c,i)=>{out+=c===s.word[i]?"🟩":s.word.includes(c)?"🟨":"⬛"}); s.tries--; if(s.tries<=0){const w=s.display;delete db.sessions[gid];reward(db,jid,0,5,false);return {ok:true,lose:true,word:w,grid:out};} save(db); return {ok:true,grid:out,tries:s.tries}; }

export function randomTruth(){ const x=vord.find(x=>x.type==="verdades"); return pick(x?.words || ["Qual foi a coisa mais engraçada que aconteceu com você?"]); }
export function randomDare(){ const x=vord.find(x=>x.type==="desafios"); return pick(x?.words || ["Mande um áudio imitando um personagem por 10 segundos."]); }
export function randomNever(){ return pick(["Eu nunca dormi durante uma aula.","Eu nunca mandei mensagem para a pessoa errada.","Eu nunca fingi que entendi algo.","Eu nunca passei a noite inteira acordado.","Eu nunca cantei sozinho achando que ninguém estava ouvindo."]); }

export function daily(jid){ const db=loadFunDb(),u=user(db,jid),now=Date.now(); if(now-u.dailyAt<DAY) return {ok:false,wait:DAY-(now-u.dailyAt),u}; const amount=120+Math.floor(Math.random()*81)+(u.level*5); u.dailyAt=now; u.coins+=amount; u.streak=(u.streak||0)+1; u.xp+=25;recalc(u);save(db);return {ok:true,amount,u}; }
export function work(jid,kind="work"){ const db=loadFunDb(),u=user(db,jid),now=Date.now(); if(now-u.workAt<20*60000)return{ok:false,wait:20*60000-(now-u.workAt),u}; const ranges={work:[45,110],mine:[35,130],fish:[25,100],hunt:[30,120],explore:[30,140],crime:[-60,180]}; const [a,b]=ranges[kind]||ranges.work; const amount=Math.floor(a+Math.random()*(b-a+1)); u.workAt=now; u.coins=Math.max(0,u.coins+amount); u.xp+=15+Math.max(0,Math.floor(amount/10));recalc(u);save(db);return{ok:true,amount,u}; }
export function transfer(from,to,amount){ const db=loadFunDb(),a=user(db,from),b=user(db,to); amount=Math.floor(Number(amount)); if(!amount||amount<1)return{ok:false,reason:"valor"}; if(a.coins<amount)return{ok:false,reason:"saldo"}; a.coins-=amount;b.coins+=amount;save(db);return{ok:true,amount,a,b}; }
export function gamble(jid,game,bet,choice=""){ const db=loadFunDb(),u=user(db,jid); bet=Math.floor(Number(bet)||10); if(bet<1||u.coins<bet)return{ok:false,reason:"saldo",u}; u.coins-=bet; let win=false,multi=0,result="";
 if(game==="coinflip"){const r=Math.random()<.5?"cara":"coroa";win=norm(choice)===r;multi=2;result=r;}
 else if(game==="dice"){const n=1+Math.floor(Math.random()*6);win=n>=5;multi=2.5;result=`🎲 ${n}`;}
 else if(game==="roulette"){const colors=["vermelho","preto","verde"];const r=Math.random()<.06?"verde":Math.random()<.5?"vermelho":"preto";win=norm(choice)===r;multi=r==="verde"?8:2;result=r;}
 else {const icons=["🐉","🌸","🍒","⭐","💎"];const a=[pick(icons),pick(icons),pick(icons)];win=a[0]===a[1]&&a[1]===a[2];multi=win?6:0;result=a.join(" | ");}
 const prize=win?Math.floor(bet*multi):0;u.coins+=prize;u.games++;if(win)u.wins++;else u.losses++;u.xp+=win?20:4;recalc(u);save(db);return{ok:true,win,bet,prize,result,u}; }
export function topCoins(limit=10){ const db=loadFunDb(); return Object.entries(db.users).map(([jid,u])=>({jid,coins:Number(u.coins||0),level:Number(u.level||1),xp:Number(u.xp||0)})).sort((a,b)=>b.coins-a.coins).slice(0,limit); }

export function proposeMarriage(from,to){ const db=loadFunDb(); if(db.marriages[from]||db.marriages[to])return{ok:false,reason:"casado"}; db.proposals[to]={from,at:Date.now()};save(db);return{ok:true}; }
export function acceptMarriage(jid){ const db=loadFunDb(); const p=db.proposals[jid]; if(!p)return{ok:false}; db.marriages[jid]=p.from;db.marriages[p.from]=jid;delete db.proposals[jid];save(db);return{ok:true,partner:p.from}; }
export function marriageOf(jid){ return loadFunDb().marriages[jid]||null; }
export function divorce(jid){ const db=loadFunDb(); const p=db.marriages[jid]; if(!p)return{ok:false}; delete db.marriages[jid];delete db.marriages[p];save(db);return{ok:true,partner:p}; }
export function familyAction(owner,target,action){ const db=loadFunDb(); db.families[owner] ||= {children:[]}; const f=db.families[owner]; if(action==="adopt"&&!f.children.includes(target))f.children.push(target); if(action==="remove")f.children=f.children.filter(x=>x!==target);save(db);return JSON.parse(JSON.stringify(f)); }
export function getFamily(jid){ const db=loadFunDb(); return db.families[jid]||{children:[]}; }

const SHOP={
 picareta:{name:"⛏️ Picareta",price:180},escudo:{name:"🛡️ Escudo",price:260},pocao:{name:"🧪 Poção",price:120},cachaca:{name:"🍹 Cachaça",price:90},caixa:{name:"🎁 Caixa Misteriosa",price:350},semente:{name:"🌱 Sementes",price:60}
};
export function shop(){return SHOP;}
export function buy(jid,item,qty=1){const db=loadFunDb(),u=user(db,jid);item=norm(item);qty=Math.max(1,Math.min(99,Number(qty)||1));const x=SHOP[item];if(!x)return{ok:false,reason:"item"};const total=x.price*qty;if(u.coins<total)return{ok:false,reason:"saldo",u};u.coins-=total;u.inventory[item]=(u.inventory[item]||0)+qty;save(db);return{ok:true,item,x,qty,total,u};}
export function inventory(jid){return getUser(jid).inventory||{};}

export function simpleRpgAction(jid,action,arg=""){ const db=loadFunDb(),u=user(db,jid); const a=norm(action); let text=""; let coins=0,xp=8;
 if(["plantar","cultivar","farm"].includes(a)){u.farm[arg||"trigo"]=(u.farm[arg||"trigo"]||0)+1;text=`🌱 Você plantou *${arg||"trigo"}*.`;xp=12;}
 else if(["colher","coletar","harvest"].includes(a)){coins=20+Math.floor(Math.random()*45);text=`🌾 Colheita concluída: +${coins} Dragon Coins.`;}
 else if(["cozinhar","cook"].includes(a)){u.foods[arg||"ensopado"]=(u.foods[arg||"ensopado"]||0)+1;text=`🍳 Receita preparada: *${arg||"ensopado"}*.`;xp=15;}
 else if(["forge","forjar","reparar","encantar","enchant","dismantle","desmontar"].includes(a)){text=`⚒️ Oficina RPG executou *${action}* ${arg||"no equipamento"}.`;xp=18;}
 else if(["masmorra","dungeon","bossrpg","arena","torneio","guerra","desafio"].includes(a)){const win=Math.random()<.62;coins=win?80+Math.floor(Math.random()*120):0;xp=win?45:12;text=win?`⚔️ Vitória em *${action}*! +${coins} Dragon Coins.`:`💥 Você enfrentou *${action}*, mas não venceu desta vez.`;if(win)u.wins++;else u.losses++;}
 else {coins=10+Math.floor(Math.random()*26);text=`🐉 Ação RPG *${action}* concluída. +${coins} Dragon Coins.`;}
 u.coins+=coins;u.xp+=xp;recalc(u);save(db);return{text,u}; }
