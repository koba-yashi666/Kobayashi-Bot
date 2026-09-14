/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import crypto from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x64\x72\x61\x67\x6f\x6e\x2d\x66\x75\x6e\x2d\x76\x30\x39\x2e\x6a\x73\x6f\x6e");
const ASSET = (...p) => path.join(process.cwd(), "\x61\x73\x73\x65\x74\x73", "\x64\x72\x61\x67\x6f\x6e\x5f\x66\x75\x6e", ...p);
const DAY = 86400000;

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "\x75\x74\x66\x38")); } catch { return fallback; }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "\x75\x74\x66\x38");
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
function norm(s="") { return String(s).normalize("\x4e\x46\x44").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim(); }
function pick(a) { return a[Math.floor(Math.random()*a.length)]; }
function pct(seed) { const h=crypto.createHash("\x73\x68\x61\x32\x35\x36").update(seed).digest(); return h.readUInt16BE(0)%101; }
function dayKey(){ return new Date().toISOString().slice(0,10); }
export function stablePercent(jid, trait){ return pct(`${jid}|${norm(trait)}|${dayKey()}`); }
export function getUser(jid){ const db=loadFunDb(); return JSON.parse(JSON.stringify(user(db,jid))); }
export function getRank(jids=[], trait="\x73\x6f\x72\x74\x65", limit=10){ return [...new Set(jids)].map(jid=>({jid,score:stablePercent(jid,trait)})).sort((a,b)=>b.score-a.score).slice(0,limit); }

export const HUTAO_MEDIA = readJson(ASSET("\x68\x75\x74\x61\x6f","\x69\x6d\x67\x6c\x69\x6e\x6b\x73\x2e\x6a\x73\x6f\x6e"), {});
export const NAZUNA_GAME_IMAGES = readJson(ASSET("\x6e\x61\x7a\x75\x6e\x61","\x67\x61\x6d\x65\x73\x2e\x6a\x73\x6f\x6e"), {}).games || {};
const TEXT1 = readJson(ASSET("\x6e\x61\x7a\x75\x6e\x61","\x67\x61\x6d\x65\x73\x74\x65\x78\x74\x2e\x6a\x73\x6f\x6e"), {});
const TEXT2 = readJson(ASSET("\x6e\x61\x7a\x75\x6e\x61","\x67\x61\x6d\x65\x73\x74\x65\x78\x74\x32\x2e\x6a\x73\x6f\x6e"), {});
export function traitText(trait, name, level){
  const t=norm(trait); const template=TEXT1[t] || TEXT2[t];
  return template ? template.replace(/#nome#/g,name).replace(/#level#/g,String(level)) : `🎲 ${name} marcou *${level}%* no medidor de *${trait}*!`;
}
export function mediaFor(command){
  const map={
    beijo:"\x69\x6d\x67\x62\x65\x69\x6a\x6f", beijar:"\x69\x6d\x67\x62\x65\x69\x6a\x6f", abraco:"\x69\x6d\x67\x61\x62\x72\x61\x63\x6f", abraço:"\x69\x6d\x67\x61\x62\x72\x61\x63\x6f", carinho:"\x69\x6d\x67\x63\x61\x72\x69\x6e\x68\x6f", tapa:"\x69\x6d\x67\x74\x61\x70\x61", tapar:"\x69\x6d\x67\x74\x61\x70\x61",
    chute:"\x69\x6d\x67\x63\x68\x75\x74\x65", chutar:"\x69\x6d\x67\x63\x68\x75\x74\x65", matar:"\x69\x6d\x67\x6d\x61\x74\x61\x72", comer:"\x69\x6d\x67\x63\x6f\x6d\x65\x72", louca:"\x69\x6d\x67\x6c\x6f\x75\x63\x61", louça:"\x69\x6d\x67\x6c\x6f\x75\x63\x61",
    gay:"\x69\x6d\x67\x67\x61\x79", lesbica:"\x69\x6d\x67\x6c\x65\x73\x62\x69\x63\x61", linda:"\x69\x6d\x67\x6c\x69\x6e\x64\x61", lindo:"\x69\x6d\x67\x6c\x69\x6e\x64\x6f", feio:"\x69\x6d\x67\x66\x65\x69\x6f", gado:"\x69\x6d\x67\x61\x64\x6f", corno:"\x69\x6d\x67\x63\x6f\x72\x6e\x6f",
    gostosa:"\x69\x6d\x67\x6f\x73\x74\x6f\x73\x61", gostoso:"\x69\x6d\x67\x6f\x73\x74\x6f\x73\x6f", vesgo:"\x69\x6d\x67\x76\x65\x73\x67\x6f", bebado:"\x69\x6d\x67\x62\x65\x62\x61\x64\x6f", nazista:"\x69\x6d\x67\x6e\x61\x7a\x69\x73\x74\x61", minerar:"\x69\x6d\x67\x6d\x69\x6e\x65\x72\x61\x72", enigma:"\x69\x6d\x67\x45\x6e\x69\x67\x6d\x61"
  };
  const key=map[norm(command)]; if(key && HUTAO_MEDIA[key]) return HUTAO_MEDIA[key];
  const n=NAZUNA_GAME_IMAGES[norm(command)]?.image?.url; return n || null;
}

const forcaH=readJson(ASSET("\x68\x75\x74\x61\x6f","\x66\x6f\x72\x63\x61\x2e\x6a\x73\x6f\x6e"),[]);
const forcaN=readJson(ASSET("\x6e\x61\x7a\x75\x6e\x61","\x66\x6f\x72\x63\x61\x2e\x6a\x73\x6f\x6e"),{}).palavras || [];
const anag=readJson(ASSET("\x6e\x61\x7a\x75\x6e\x61","\x61\x6e\x61\x67\x72\x61\x6d\x61\x2e\x6a\x73\x6f\x6e"),{}).palavras || [];
const quiz=readJson(ASSET("\x6e\x61\x7a\x75\x6e\x61","\x71\x75\x69\x7a\x2e\x6a\x73\x6f\x6e"),{});
const wordle=readJson(ASSET("\x6e\x61\x7a\x75\x6e\x61","\x77\x6f\x72\x64\x6c\x65\x2e\x6a\x73\x6f\x6e"),{});
const vord=readJson(ASSET("\x68\x75\x74\x61\x6f","\x76\x6f\x72\x64\x2e\x6a\x73\x6f\x6e"),[]);

function setSession(db,gid,type,data){ db.sessions[gid]={type,...data,createdAt:Date.now()}; save(db); return db.sessions[gid]; }
export function getSession(gid){ return loadFunDb().sessions[gid] || null; }
export function clearSession(gid){ const db=loadFunDb(); delete db.sessions[gid]; save(db); }
export function startForca(gid, by){ const db=loadFunDb(); const pool=[...forcaH.map(x=>({word:x.plvr,hint:x.dica,theme:x.tema})),...forcaN.map(x=>({word:x.palavra,hint:x.dica,theme:"\x67\x65\x72\x61\x6c"}))]; const x=pick(pool); return setSession(db,gid,"\x66\x6f\x72\x63\x61",{by,word:norm(x.word),display:x.word,hint:x.hint,theme:x.theme,guessed:[],tries:6}); }
export function guessForca(gid,jid,input){ const db=loadFunDb(); const s=db.sessions[gid]; if(!s||s.type!=="\x66\x6f\x72\x63\x61") return {ok:false,reason:"\x6e\x6f\x6e\x65"}; const g=norm(input); if(!g) return {ok:false,reason:"\x65\x6d\x70\x74\x79"}; if(g===norm(s.word)){ delete db.sessions[gid]; reward(db,jid,60,45,true); return {ok:true,win:true,word:s.display}; }
  const ch=g[0]; if(!s.guessed.includes(ch)) s.guessed.push(ch); if(!norm(s.word).includes(ch)) s.tries--; const masked=[...norm(s.word)].map(c=>c===" "?" ":s.guessed.includes(c)?c:"_ ").join("");
  if(s.tries<=0){ const w=s.display; delete db.sessions[gid]; reward(db,jid,0,5,false); return {ok:true,lose:true,word:w}; }
  save(db); return {ok:true,masked,tries:s.tries,hint:s.hint,theme:s.theme}; }
export function startAnagram(gid,by){ const db=loadFunDb(); const x=pick(anag); const w=norm(x.palavra); let arr=[...w]; for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return setSession(db,gid,"\x61\x6e\x61\x67\x72\x61\x6d\x61",{by,word:w,display:x.palavra,hint:x.dica,scrambled:arr.join("")}); }
export function answerSimple(gid,jid,input){ const db=loadFunDb(); const s=db.sessions[gid]; if(!s) return {ok:false,reason:"\x6e\x6f\x6e\x65"}; const a=norm(input); let valid=false, display=s.display||s.word;
  if(s.type==="\x61\x6e\x61\x67\x72\x61\x6d\x61") valid=a===norm(s.word);
  if(s.type==="\x71\x75\x69\x7a") valid=(s.answers||[]).some(x=>norm(x)===a);
  if(s.type==="\x65\x6e\x69\x67\x6d\x61") valid=(s.answers||[]).some(x=>norm(x)===a);
  if(s.type==="\x77\x6f\x72\x64\x6c\x65") valid=a===norm(s.word);
  if(!valid) return {ok:true,correct:false}; delete db.sessions[gid]; reward(db,jid,50,35,true); return {ok:true,correct:true,answer:display}; }
export function startQuiz(gid,by,category="\x67\x65\x72\x61\x6c"){ const db=loadFunDb(); const cats=Object.keys(quiz).filter(k=>Array.isArray(quiz[k])&&quiz[k].length); const cat=quiz[category]?category:pick(cats); const x=pick(quiz[cat]); return setSession(db,gid,"\x71\x75\x69\x7a",{by,category:cat,question:x.p,answers:x.r||[x.d],display:x.d}); }
export function startEnigma(gid,by){ const db=loadFunDb(); const bank=[
 {q:"\x54\x65\x6e\x68\x6f\x20\x63\x69\x64\x61\x64\x65\x73\x2c\x20\x6d\x61\x73\x20\x6e\xe3\x6f\x20\x63\x61\x73\x61\x73\x3b\x20\x6d\x6f\x6e\x74\x61\x6e\x68\x61\x73\x2c\x20\x6d\x61\x73\x20\x6e\xe3\x6f\x20\xe1\x72\x76\x6f\x72\x65\x73\x3b\x20\xe1\x67\x75\x61\x2c\x20\x6d\x61\x73\x20\x6e\xe3\x6f\x20\x70\x65\x69\x78\x65\x73\x2e\x20\x4f\x20\x71\x75\x65\x20\x73\x6f\x75\x3f",a:["\x6d\x61\x70\x61"]},
 {q:"\x51\x75\x61\x6e\x74\x6f\x20\x6d\x61\x69\x73\x20\x76\x6f\x63\xea\x20\x74\x69\x72\x61\x20\x64\x65\x20\x6d\x69\x6d\x2c\x20\x6d\x61\x69\x6f\x72\x20\x65\x75\x20\x66\x69\x63\x6f\x2e\x20\x4f\x20\x71\x75\x65\x20\x73\x6f\x75\x3f",a:["\x62\x75\x72\x61\x63\x6f"]},
 {q:"\x4f\x20\x71\x75\x65\x20\x73\x6f\x62\x65\x20\x65\x20\x6e\x75\x6e\x63\x61\x20\x64\x65\x73\x63\x65\x3f",a:["\x69\x64\x61\x64\x65","\x61\x20\x69\x64\x61\x64\x65"]},
 {q:"\x54\x65\x6d\x20\x64\x65\x6e\x74\x65\x73\x20\x6d\x61\x73\x20\x6e\xe3\x6f\x20\x6d\x6f\x72\x64\x65\x2e\x20\x4f\x20\x71\x75\x65\x20\xe9\x3f",a:["\x70\x65\x6e\x74\x65","\x75\x6d\x20\x70\x65\x6e\x74\x65"]}
 ]; const x=pick(bank); return setSession(db,gid,"\x65\x6e\x69\x67\x6d\x61",{by,question:x.q,answers:x.a,display:x.a[0]}); }
export function startWordle(gid,by){ const db=loadFunDb(); let pool=[]; if(Array.isArray(wordle.palavras)) pool=wordle.palavras; else if(Array.isArray(wordle.words)) pool=wordle.words; else pool=["\x64\x72\x61\x67\x61\x6f","\x6d\x61\x69\x64","\x61\x6e\x69\x6d\x65","\x6a\x6f\x67\x6f\x73","\x67\x72\x75\x70\x6f","\x62\x6f\x74"];
 const x=pick(pool); const w=typeof x==="\x73\x74\x72\x69\x6e\x67"?x:(x.palavra||x.word||"\x64\x72\x61\x67\x61\x6f"); return setSession(db,gid,"\x77\x6f\x72\x64\x6c\x65",{by,word:norm(w),display:w,tries:6}); }
export function guessWordle(gid,jid,input){ const db=loadFunDb(); const s=db.sessions[gid]; if(!s||s.type!=="\x77\x6f\x72\x64\x6c\x65") return {ok:false}; const g=norm(input); if(g.length!==s.word.length) return {ok:true,invalid:true,len:s.word.length}; if(g===s.word){delete db.sessions[gid];reward(db,jid,70,50,true);return {ok:true,win:true,word:s.display};}
 let out=""; [...g].forEach((c,i)=>{out+=c===s.word[i]?"🟩":s.word.includes(c)?"🟨":"⬛"}); s.tries--; if(s.tries<=0){const w=s.display;delete db.sessions[gid];reward(db,jid,0,5,false);return {ok:true,lose:true,word:w,grid:out};} save(db); return {ok:true,grid:out,tries:s.tries}; }

export function randomTruth(){ const x=vord.find(x=>x.type==="\x76\x65\x72\x64\x61\x64\x65\x73"); return pick(x?.words || ["\x51\x75\x61\x6c\x20\x66\x6f\x69\x20\x61\x20\x63\x6f\x69\x73\x61\x20\x6d\x61\x69\x73\x20\x65\x6e\x67\x72\x61\xe7\x61\x64\x61\x20\x71\x75\x65\x20\x61\x63\x6f\x6e\x74\x65\x63\x65\x75\x20\x63\x6f\x6d\x20\x76\x6f\x63\xea\x3f"]); }
export function randomDare(){ const x=vord.find(x=>x.type==="\x64\x65\x73\x61\x66\x69\x6f\x73"); return pick(x?.words || ["\x4d\x61\x6e\x64\x65\x20\x75\x6d\x20\xe1\x75\x64\x69\x6f\x20\x69\x6d\x69\x74\x61\x6e\x64\x6f\x20\x75\x6d\x20\x70\x65\x72\x73\x6f\x6e\x61\x67\x65\x6d\x20\x70\x6f\x72\x20\x31\x30\x20\x73\x65\x67\x75\x6e\x64\x6f\x73\x2e"]); }
export function randomNever(){ return pick(["\x45\x75\x20\x6e\x75\x6e\x63\x61\x20\x64\x6f\x72\x6d\x69\x20\x64\x75\x72\x61\x6e\x74\x65\x20\x75\x6d\x61\x20\x61\x75\x6c\x61\x2e","\x45\x75\x20\x6e\x75\x6e\x63\x61\x20\x6d\x61\x6e\x64\x65\x69\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x70\x61\x72\x61\x20\x61\x20\x70\x65\x73\x73\x6f\x61\x20\x65\x72\x72\x61\x64\x61\x2e","\x45\x75\x20\x6e\x75\x6e\x63\x61\x20\x66\x69\x6e\x67\x69\x20\x71\x75\x65\x20\x65\x6e\x74\x65\x6e\x64\x69\x20\x61\x6c\x67\x6f\x2e","\x45\x75\x20\x6e\x75\x6e\x63\x61\x20\x70\x61\x73\x73\x65\x69\x20\x61\x20\x6e\x6f\x69\x74\x65\x20\x69\x6e\x74\x65\x69\x72\x61\x20\x61\x63\x6f\x72\x64\x61\x64\x6f\x2e","\x45\x75\x20\x6e\x75\x6e\x63\x61\x20\x63\x61\x6e\x74\x65\x69\x20\x73\x6f\x7a\x69\x6e\x68\x6f\x20\x61\x63\x68\x61\x6e\x64\x6f\x20\x71\x75\x65\x20\x6e\x69\x6e\x67\x75\xe9\x6d\x20\x65\x73\x74\x61\x76\x61\x20\x6f\x75\x76\x69\x6e\x64\x6f\x2e"]); }

export function daily(jid){ const db=loadFunDb(),u=user(db,jid),now=Date.now(); if(now-u.dailyAt<DAY) return {ok:false,wait:DAY-(now-u.dailyAt),u}; const amount=120+Math.floor(Math.random()*81)+(u.level*5); u.dailyAt=now; u.coins+=amount; u.streak=(u.streak||0)+1; u.xp+=25;recalc(u);save(db);return {ok:true,amount,u}; }
export function work(jid,kind="\x77\x6f\x72\x6b"){ const db=loadFunDb(),u=user(db,jid),now=Date.now(); if(now-u.workAt<20*60000)return{ok:false,wait:20*60000-(now-u.workAt),u}; const ranges={work:[45,110],mine:[35,130],fish:[25,100],hunt:[30,120],explore:[30,140],crime:[-60,180]}; const [a,b]=ranges[kind]||ranges.work; const amount=Math.floor(a+Math.random()*(b-a+1)); u.workAt=now; u.coins=Math.max(0,u.coins+amount); u.xp+=15+Math.max(0,Math.floor(amount/10));recalc(u);save(db);return{ok:true,amount,u}; }
export function transfer(from,to,amount){ const db=loadFunDb(),a=user(db,from),b=user(db,to); amount=Math.floor(Number(amount)); if(!amount||amount<1)return{ok:false,reason:"\x76\x61\x6c\x6f\x72"}; if(a.coins<amount)return{ok:false,reason:"\x73\x61\x6c\x64\x6f"}; a.coins-=amount;b.coins+=amount;save(db);return{ok:true,amount,a,b}; }
export function gamble(jid,game,bet,choice=""){ const db=loadFunDb(),u=user(db,jid); bet=Math.floor(Number(bet)||10); if(bet<1||u.coins<bet)return{ok:false,reason:"\x73\x61\x6c\x64\x6f",u}; u.coins-=bet; let win=false,multi=0,result="";
 if(game==="\x63\x6f\x69\x6e\x66\x6c\x69\x70"){const r=Math.random()<.5?"\x63\x61\x72\x61":"\x63\x6f\x72\x6f\x61";win=norm(choice)===r;multi=2;result=r;}
 else if(game==="\x64\x69\x63\x65"){const n=1+Math.floor(Math.random()*6);win=n>=5;multi=2.5;result=`🎲 ${n}`;}
 else if(game==="\x72\x6f\x75\x6c\x65\x74\x74\x65"){const colors=["\x76\x65\x72\x6d\x65\x6c\x68\x6f","\x70\x72\x65\x74\x6f","\x76\x65\x72\x64\x65"];const r=Math.random()<.06?"\x76\x65\x72\x64\x65":Math.random()<.5?"\x76\x65\x72\x6d\x65\x6c\x68\x6f":"\x70\x72\x65\x74\x6f";win=norm(choice)===r;multi=r==="\x76\x65\x72\x64\x65"?8:2;result=r;}
 else {const icons=["🐉","🌸","🍒","⭐","💎"];const a=[pick(icons),pick(icons),pick(icons)];win=a[0]===a[1]&&a[1]===a[2];multi=win?6:0;result=a.join("\x20\x7c\x20");}
 const prize=win?Math.floor(bet*multi):0;u.coins+=prize;u.games++;if(win)u.wins++;else u.losses++;u.xp+=win?20:4;recalc(u);save(db);return{ok:true,win,bet,prize,result,u}; }
export function topCoins(limit=10){ const db=loadFunDb(); return Object.entries(db.users).map(([jid,u])=>({jid,coins:Number(u.coins||0),level:Number(u.level||1),xp:Number(u.xp||0)})).sort((a,b)=>b.coins-a.coins).slice(0,limit); }

export function proposeMarriage(from,to){ const db=loadFunDb(); if(db.marriages[from]||db.marriages[to])return{ok:false,reason:"\x63\x61\x73\x61\x64\x6f"}; db.proposals[to]={from,at:Date.now()};save(db);return{ok:true}; }
export function acceptMarriage(jid){ const db=loadFunDb(); const p=db.proposals[jid]; if(!p)return{ok:false}; db.marriages[jid]=p.from;db.marriages[p.from]=jid;delete db.proposals[jid];save(db);return{ok:true,partner:p.from}; }
export function marriageOf(jid){ return loadFunDb().marriages[jid]||null; }
export function divorce(jid){ const db=loadFunDb(); const p=db.marriages[jid]; if(!p)return{ok:false}; delete db.marriages[jid];delete db.marriages[p];save(db);return{ok:true,partner:p}; }
export function familyAction(owner,target,action){ const db=loadFunDb(); db.families[owner] ||= {children:[]}; const f=db.families[owner]; if(action==="\x61\x64\x6f\x70\x74"&&!f.children.includes(target))f.children.push(target); if(action==="\x72\x65\x6d\x6f\x76\x65")f.children=f.children.filter(x=>x!==target);save(db);return JSON.parse(JSON.stringify(f)); }
export function getFamily(jid){ const db=loadFunDb(); return db.families[jid]||{children:[]}; }

const SHOP={
 picareta:{name:"\u26cf\ufe0f\x20\x50\x69\x63\x61\x72\x65\x74\x61",price:180},escudo:{name:"\ud83d\ufe0f\x20\x45\x73\x63\x75\x64\x6f",price:260},pocao:{name:"\ud83e\x20\x50\x6f\xe7\xe3\x6f",price:120},cachaca:{name:"\ud83c\x20\x43\x61\x63\x68\x61\xe7\x61",price:90},caixa:{name:"\ud83c\x20\x43\x61\x69\x78\x61\x20\x4d\x69\x73\x74\x65\x72\x69\x6f\x73\x61",price:350},semente:{name:"\ud83c\x20\x53\x65\x6d\x65\x6e\x74\x65\x73",price:60}
};
export function shop(){return SHOP;}
export function buy(jid,item,qty=1){const db=loadFunDb(),u=user(db,jid);item=norm(item);qty=Math.max(1,Math.min(99,Number(qty)||1));const x=SHOP[item];if(!x)return{ok:false,reason:"\x69\x74\x65\x6d"};const total=x.price*qty;if(u.coins<total)return{ok:false,reason:"\x73\x61\x6c\x64\x6f",u};u.coins-=total;u.inventory[item]=(u.inventory[item]||0)+qty;save(db);return{ok:true,item,x,qty,total,u};}
export function inventory(jid){return getUser(jid).inventory||{};}

export function simpleRpgAction(jid,action,arg=""){ const db=loadFunDb(),u=user(db,jid); const a=norm(action); let text=""; let coins=0,xp=8;
 if(["\x70\x6c\x61\x6e\x74\x61\x72","\x63\x75\x6c\x74\x69\x76\x61\x72","\x66\x61\x72\x6d"].includes(a)){u.farm[arg||"\x74\x72\x69\x67\x6f"]=(u.farm[arg||"\x74\x72\x69\x67\x6f"]||0)+1;text=`🌱 Você plantou *${arg||"\x74\x72\x69\x67\x6f"}*.`;xp=12;}
 else if(["\x63\x6f\x6c\x68\x65\x72","\x63\x6f\x6c\x65\x74\x61\x72","\x68\x61\x72\x76\x65\x73\x74"].includes(a)){coins=20+Math.floor(Math.random()*45);text=`🌾 Colheita concluída: +${coins} Dragon Coins.`;}
 else if(["\x63\x6f\x7a\x69\x6e\x68\x61\x72","\x63\x6f\x6f\x6b"].includes(a)){u.foods[arg||"\x65\x6e\x73\x6f\x70\x61\x64\x6f"]=(u.foods[arg||"\x65\x6e\x73\x6f\x70\x61\x64\x6f"]||0)+1;text=`🍳 Receita preparada: *${arg||"\x65\x6e\x73\x6f\x70\x61\x64\x6f"}*.`;xp=15;}
 else if(["\x66\x6f\x72\x67\x65","\x66\x6f\x72\x6a\x61\x72","\x72\x65\x70\x61\x72\x61\x72","\x65\x6e\x63\x61\x6e\x74\x61\x72","\x65\x6e\x63\x68\x61\x6e\x74","\x64\x69\x73\x6d\x61\x6e\x74\x6c\x65","\x64\x65\x73\x6d\x6f\x6e\x74\x61\x72"].includes(a)){text=`⚒️ Oficina RPG executou *${action}* ${arg||"\x6e\x6f\x20\x65\x71\x75\x69\x70\x61\x6d\x65\x6e\x74\x6f"}.`;xp=18;}
 else if(["\x6d\x61\x73\x6d\x6f\x72\x72\x61","\x64\x75\x6e\x67\x65\x6f\x6e","\x62\x6f\x73\x73\x72\x70\x67","\x61\x72\x65\x6e\x61","\x74\x6f\x72\x6e\x65\x69\x6f","\x67\x75\x65\x72\x72\x61","\x64\x65\x73\x61\x66\x69\x6f"].includes(a)){const win=Math.random()<.62;coins=win?80+Math.floor(Math.random()*120):0;xp=win?45:12;text=win?`⚔️ Vitória em *${action}*! +${coins} Dragon Coins.`:`💥 Você enfrentou *${action}*, mas não venceu desta vez.`;if(win)u.wins++;else u.losses++;}
 else {coins=10+Math.floor(Math.random()*26);text=`🐉 Ação RPG *${action}* concluída. +${coins} Dragon Coins.`;}
 u.coins+=coins;u.xp+=xp;recalc(u);save(db);return{text,u}; }
