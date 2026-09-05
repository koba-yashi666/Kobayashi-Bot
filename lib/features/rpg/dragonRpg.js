import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "files", "database", "dragon-rpg.json");

const HUMAN_CLASSES = {
  escudeiro: { name: "Escudeiro", icon: "🛡️", role: "Defesa e resistência", desc: "Começa protegido, aguenta mais dano e prepara o caminho para classes de cavaleiro.", bonus: { hp: 25, mana: 0, atk: 2, def: 6, mag: 0, agi: 0 } },
  guerreiro: { name: "Guerreiro", icon: "⚔️", role: "Dano físico", desc: "Classe direta e agressiva, com força alta e boa resistência para combates corpo a corpo.", bonus: { hp: 15, mana: 0, atk: 7, def: 3, mag: 0, agi: 1 } },
  mago: { name: "Mago", icon: "🔮", role: "Magia e Mana", desc: "Especialista em magia. Possui muito Mana e grande potencial mágico, mas menos resistência física.", bonus: { hp: 0, mana: 35, atk: 0, def: 0, mag: 8, agi: 1 } },
  arqueiro: { name: "Arqueiro", icon: "🏹", role: "Agilidade e precisão", desc: "Ataca com velocidade e precisão. Ideal para quem prefere esquiva e ataques rápidos.", bonus: { hp: 5, mana: 10, atk: 4, def: 1, mag: 1, agi: 7 } },
  curandeiro: { name: "Curandeiro", icon: "🌿", role: "Suporte e cura", desc: "Usa magia para restaurar aliados e sobreviver a batalhas longas. Ótimo para grupos.", bonus: { hp: 10, mana: 30, atk: 0, def: 2, mag: 6, agi: 1 } },
};

const FACTIONS = {
  caos: { name: "Caos", icon: "🔥", desc: "Dragões que rejeitam a ordem imposta e valorizam poder, liberdade e força individual." },
  harmonia: { name: "Harmonia", icon: "⚖️", desc: "Dragões ligados à ordem e ao equilíbrio, com forte foco em disciplina, proteção e controle." },
  espectador: { name: "Espectadores", icon: "👁️", desc: "Observadores que evitam tomar partido diretamente e dominam conhecimentos e magias incomuns." },
  independente: { name: "Independente", icon: "⚡", desc: "Caminho livre para dragões sem vínculo formal com as grandes facções." },
};

const DRAGON_CLASSES = {
  chamas: { name: "Dragão das Chamas", icon: "🔥", faction: "caos", inspiration: "Tohru", role: "Ataque e dano em área", desc: "Uma linhagem de fogo extremamente ofensiva, feita para dominar o campo de batalha.", bonus: { hp: 40, mana: 25, atk: 12, def: 5, mag: 10, agi: 4 } },
  abissal: { name: "Dragão Abissal", icon: "🌑", faction: "caos", inspiration: "Fafnir", role: "Maldições e poder sombrio", desc: "Especialista em magia obscura, resistência e efeitos que enfraquecem adversários.", bonus: { hp: 45, mana: 40, atk: 6, def: 8, mag: 14, agi: 1 } },
  carmesim: { name: "Dragão Carmesim", icon: "💥", faction: "caos", inspiration: "Ilulu", role: "Força explosiva", desc: "Poder bruto e explosões devastadoras. Troca parte da defesa por pressão ofensiva.", bonus: { hp: 35, mana: 20, atk: 15, def: 2, mag: 9, agi: 3 } },
  aquatico: { name: "Dragão Aquático", icon: "🌊", faction: "harmonia", inspiration: "Elma", role: "Controle e equilíbrio", desc: "Manipula água e combina defesa, magia e controle do campo com grande consistência.", bonus: { hp: 40, mana: 45, atk: 5, def: 10, mag: 12, agi: 3 } },
  arcano: { name: "Dragão Arcano", icon: "🔮", faction: "espectador", inspiration: "Lucoa", role: "Magia avançada", desc: "Uma linhagem voltada à magia, conhecimento e efeitos especiais imprevisíveis.", bonus: { hp: 30, mana: 60, atk: 2, def: 5, mag: 18, agi: 4 } },
  eletrico: { name: "Dragão Elétrico", icon: "⚡", faction: "independente", inspiration: "Kanna", role: "Velocidade e eletricidade", desc: "Canaliza eletricidade e velocidade, favorecendo ataques rápidos e alto potencial de esquiva.", bonus: { hp: 30, mana: 35, atk: 9, def: 4, mag: 11, agi: 12 } },
};

const BASE_STATS = { hp: 100, mana: 50, atk: 10, def: 10, mag: 10, agi: 10 };
const REST_COOLDOWN_MS = 30 * 60 * 1000;

const RPG_ITEMS = {
  espada_ferro:{id:"espada_ferro",name:"Espada de Ferro",icon:"🗡️",type:"weapon",rarity:"Comum",price:120,minLevel:1,bonus:{atk:5}},
  espada_draconica:{id:"espada_draconica",name:"Espada Dracônica",icon:"🐉",type:"weapon",rarity:"Épico",price:1250,minLevel:15,classes:["guerreiro","escudeiro"],bonus:{atk:18,def:4}},
  cajado_arcano:{id:"cajado_arcano",name:"Cajado Arcano",icon:"🪄",type:"weapon",rarity:"Raro",price:680,minLevel:8,classes:["mago","curandeiro"],bonus:{mag:14,mana:20}},
  arco_vento:{id:"arco_vento",name:"Arco do Vento",icon:"🏹",type:"weapon",rarity:"Raro",price:650,minLevel:8,classes:["arqueiro"],bonus:{atk:10,agi:8}},
  armadura_ferro:{id:"armadura_ferro",name:"Armadura de Ferro",icon:"🛡️",type:"armor",rarity:"Comum",price:180,minLevel:2,bonus:{hp:20,def:7}},
  manto_arcano:{id:"manto_arcano",name:"Manto Arcano",icon:"🥋",type:"armor",rarity:"Raro",price:720,minLevel:8,classes:["mago","curandeiro"],bonus:{mana:25,def:4,mag:6}},
  armadura_draconica:{id:"armadura_draconica",name:"Armadura Dracônica",icon:"🐲",type:"armor",rarity:"Lendário",price:2200,minLevel:20,bonus:{hp:60,def:18,atk:5}},
  amuleto_agilidade:{id:"amuleto_agilidade",name:"Amuleto da Agilidade",icon:"💨",type:"accessory",rarity:"Incomum",price:350,minLevel:5,bonus:{agi:8}},
  cristal_mana:{id:"cristal_mana",name:"Cristal de Mana",icon:"💎",type:"accessory",rarity:"Raro",price:700,minLevel:8,bonus:{mana:30,mag:7}},
  coracao_dragao:{id:"coracao_dragao",name:"Coração de Dragão",icon:"❤️‍🔥",type:"accessory",rarity:"Dracônico",price:3200,minLevel:30,dragonRequired:true,bonus:{hp:50,mana:40,atk:8,def:8,mag:8,agi:5}},
  pocao_pequena:{id:"pocao_pequena",name:"Poção Pequena",icon:"🧪",type:"consumivel",rarity:"Comum",price:35,minLevel:1},
  pao_aventureiro:{id:"pao_aventureiro",name:"Pão de Aventureiro",icon:"🥖",type:"consumivel",rarity:"Comum",price:20,minLevel:1}
};
const RPG_SKILLS = {
 escudeiro:[{id:"escudo",name:"Golpe de Escudo",icon:"🛡️",level:1,cost:8,mag:false,mult:1.35},{id:"fortaleza",name:"Fortaleza",icon:"🏰",level:5,cost:14,defend:true},{id:"impacto",name:"Impacto do Guardião",icon:"💥",level:12,cost:22,mag:false,mult:2.25}],
 guerreiro:[{id:"corte",name:"Corte Dracônico",icon:"⚔️",level:1,cost:9,mag:false,mult:1.65},{id:"furia",name:"Fúria Carmesim",icon:"🔥",level:6,cost:16,mag:false,mult:2.05},{id:"executor",name:"Golpe Executor",icon:"💢",level:14,cost:25,mag:false,mult:2.75}],
 mago:[{id:"explosao",name:"Explosão Arcana",icon:"🔮",level:1,cost:14,mag:true,mult:1.85},{id:"meteoro",name:"Meteoro Mágico",icon:"☄️",level:7,cost:24,mag:true,mult:2.45},{id:"cataclismo",name:"Cataclismo Arcano",icon:"🌌",level:16,cost:38,mag:true,mult:3.25}],
 arqueiro:[{id:"flecha",name:"Flecha Veloz",icon:"🏹",level:1,cost:10,mag:false,mult:1.55},{id:"triplo",name:"Disparo Triplo",icon:"🎯",level:6,cost:18,mag:false,mult:2.15},{id:"tempestade",name:"Tempestade de Flechas",icon:"🌪️",level:15,cost:29,mag:false,mult:2.85}],
 curandeiro:[{id:"cura",name:"Luz Restauradora",icon:"🌿",level:1,cost:12,heal:true,healMult:1.4},{id:"cura_maior",name:"Benção Vital",icon:"✨",level:7,cost:22,heal:true,healMult:2.15},{id:"julgamento",name:"Julgamento Sagrado",icon:"☀️",level:15,cost:30,mag:true,mult:2.65}]
};

const REGIONS = {
  floresta: { name: "Floresta de Elma", icon: "🌲", min: 1, max: 5, desc: "Uma mata úmida e relativamente segura para aventureiros iniciantes." },
  ruinas: { name: "Ruínas Dracônicas", icon: "🏚️", min: 5, max: 10, desc: "Pedras antigas, armadilhas e criaturas que protegem restos de uma era esquecida." },
  vale: { name: "Vale das Chamas", icon: "🌋", min: 10, max: 20, desc: "Terra vulcânica onde monstros resistentes ao calor dominam as trilhas." },
  abismo: { name: "Abismo de Fafnir", icon: "🌑", min: 20, max: 35, desc: "Uma região amaldiçoada para aventureiros experientes." },
  reino: { name: "Reino dos Dragões", icon: "🐉", min: 30, max: 99, desc: "O território mais perigoso do Dragon RPG, reservado para grandes guerreiros e dragões despertos." },
};

const MONSTERS = {
  slime: { id:"slime", name:"Slime Mágico", icon:"🟢", regions:["floresta"], level:[1,3], hp:48, atk:8, def:3, mag:5, agi:4, xp:28, gold:[8,16], drops:[{id:"gel_magico",name:"Gel Mágico",icon:"🧫",chance:.55}] },
  goblin: { id:"goblin", name:"Goblin Saqueador", icon:"👺", regions:["floresta","ruinas"], level:[2,7], hp:68, atk:12, def:6, mag:2, agi:8, xp:42, gold:[12,24], drops:[{id:"presa_goblin",name:"Presa de Goblin",icon:"🦷",chance:.4}] },
  lobo: { id:"lobo", name:"Lobo Sombrio", icon:"🐺", regions:["floresta","ruinas"], level:[3,8], hp:78, atk:14, def:5, mag:4, agi:13, xp:50, gold:[14,28], drops:[{id:"pele_sombria",name:"Pele Sombria",icon:"🧶",chance:.38}] },
  orc: { id:"orc", name:"Orc das Ruínas", icon:"👹", regions:["ruinas","vale"], level:[7,14], hp:125, atk:21, def:12, mag:3, agi:5, xp:78, gold:[24,42], drops:[{id:"ferro_orc",name:"Ferro Orc",icon:"⛓️",chance:.42}] },
  elemental: { id:"elemental", name:"Elemental de Fogo", icon:"🔥", regions:["vale"], level:[11,20], hp:155, atk:20, def:10, mag:25, agi:10, xp:110, gold:[32,55], drops:[{id:"nucleo_fogo",name:"Núcleo de Fogo",icon:"🔸",chance:.36}] },
  wyvern: { id:"wyvern", name:"Wyvern Selvagem", icon:"🐲", regions:["vale","abismo"], level:[15,28], hp:220, atk:32, def:18, mag:15, agi:18, xp:175, gold:[55,90], drops:[{id:"escama_wyvern",name:"Escama de Wyvern",icon:"🐲",chance:.3}] },
  espectro: { id:"espectro", name:"Espectro Amaldiçoado", icon:"👻", regions:["abismo"], level:[21,32], hp:235, atk:26, def:14, mag:38, agi:17, xp:205, gold:[65,105], drops:[{id:"essencia_abissal",name:"Essência Abissal",icon:"🌑",chance:.3}] },
  dragao_selvagem: { id:"dragao_selvagem", name:"Dragão Selvagem", icon:"🐉", regions:["reino"], level:[30,45], hp:390, atk:48, def:30, mag:38, agi:24, xp:360, gold:[110,180], drops:[{id:"escama_draconica",name:"Escama Dracônica",icon:"💠",chance:.28}] },
};

const QUESTS = {
  q_slimes: { id:"q_slimes", title:"Primeiros Passos", desc:"Derrote 3 Slimes Mágicos.", type:"kill", monster:"slime", target:3, minLevel:1, xp:120, gold:80, item:{id:"pocao_pequena",name:"Poção Pequena",icon:"🧪",qty:2,type:"consumivel"} },
  q_floresta: { id:"q_floresta", title:"Guardião da Floresta", desc:"Derrote 5 criaturas na Floresta de Elma.", type:"regionKills", region:"floresta", target:5, minLevel:2, xp:180, gold:110 },
  q_ruinas: { id:"q_ruinas", title:"Ecos das Ruínas", desc:"Derrote 3 criaturas nas Ruínas Dracônicas.", type:"regionKills", region:"ruinas", target:3, minLevel:5, xp:240, gold:160 },
  q_wyvern: { id:"q_wyvern", title:"Caçador de Wyvern", desc:"Derrote 1 Wyvern Selvagem.", type:"kill", monster:"wyvern", target:1, minLevel:12, xp:420, gold:300, item:{id:"escama_wyvern",name:"Escama de Wyvern",icon:"🐲",qty:1,type:"material"} },
};

function normalizeUser(jid = "") { return String(jid || "").trim(); }
function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ version: 2, players: {} }, null, 2), "utf8");
}
function migratePlayer(p){
  if(!p) return p;
  p.stats = { ...BASE_STATS, ...(p.stats || {}) };
  p.level = Math.max(1, Number(p.level)||1); p.xp=Number(p.xp)||0; p.xpNext=Number(p.xpNext)||xpNeeded(p.level); p.gold=Number(p.gold)||0;
  p.inventory = Array.isArray(p.inventory) ? p.inventory : [];
  p.equipment = p.equipment || {weapon:null,armor:null,accessory:null};
  for (const slot of ["weapon","armor","accessory"]) if (p.equipment[slot] && typeof p.equipment[slot] === "object") p.equipment[slot] = p.equipment[slot].id || null;
  p.resources = p.resources || { hp: p.stats.hp, mana: p.stats.mana };
  p.resources.hp = Math.max(0, Math.min(Number(p.resources.hp ?? p.stats.hp), p.stats.hp));
  p.resources.mana = Math.max(0, Math.min(Number(p.resources.mana ?? p.stats.mana), p.stats.mana));
  p.combat = p.combat || null;
  p.rpgStats = p.rpgStats || { battles:0, wins:0, losses:0, escapes:0, monstersDefeated:0, damageDealt:0, damageTaken:0 };
  p.quests = p.quests || { active:{}, completed:[] };
  p.quests.active = p.quests.active || {}; p.quests.completed = Array.isArray(p.quests.completed) ? p.quests.completed : [];
  p.lastRestAt = Number(p.lastRestAt)||0;
  p.statPoints = Number(p.statPoints)||0;
  return p;
}
function readDb() {
  ensureDb();
  try { const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf8")); if (!parsed.players || typeof parsed.players !== "object") parsed.players = {}; parsed.version=2; for(const k of Object.keys(parsed.players)) migratePlayer(parsed.players[k]); return parsed; }
  catch { return { version: 2, players: {} }; }
}
function writeDb(db) { ensureDb(); db.version=2; const tmp = `${DB_PATH}.tmp`; fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8"); fs.renameSync(tmp, DB_PATH); }

function onlyDigitsRpg(value = "") {
  return String(value || "").replace(/\D/g, "");
}

function backupDragonRpgDb(label = "manual") {
  ensureDb();
  const backupDir = path.join(process.cwd(), "files", "database", "backups", "dragon-rpg");
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeLabel = String(label || "manual").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
  const backupPath = path.join(backupDir, `dragon-rpg-${safeLabel}-${stamp}.json`);
  fs.copyFileSync(DB_PATH, backupPath);
  return backupPath;
}

export function resetDragonRpgUsers(jids = [], label = "grupo") {
  const db = readDb();
  const rawTargets = new Set((Array.isArray(jids) ? jids : [jids]).map(normalizeUser).filter(Boolean));
  const digitTargets = new Set(
    [...rawTargets].map(onlyDigitsRpg).filter((x) => x.length >= 8)
  );

  const matchedKeys = Object.keys(db.players).filter((key) => {
    if (rawTargets.has(key)) return true;
    const digits = onlyDigitsRpg(key);
    return digits && digitTargets.has(digits);
  });

  if (!matchedKeys.length) {
    return { ok: true, reset: 0, totalBefore: Object.keys(db.players).length, backup: null };
  }

  const backup = backupDragonRpgDb(label);
  for (const key of matchedKeys) delete db.players[key];
  writeDb(db);

  return {
    ok: true,
    reset: matchedKeys.length,
    totalBefore: matchedKeys.length + Object.keys(db.players).length,
    totalAfter: Object.keys(db.players).length,
    backup
  };
}

export function resetAllDragonRpg(label = "global") {
  const db = readDb();
  const total = Object.keys(db.players).length;

  if (!total) {
    return { ok: true, reset: 0, backup: null };
  }

  const backup = backupDragonRpgDb(label);
  db.players = {};
  writeDb(db);

  return { ok: true, reset: total, backup };
}
function xpNeeded(level){ return 100 + Math.max(0, level-1)*55; }
function makePlayer(jid, name = "Aventureiro") {
  const now = new Date().toISOString();
  return migratePlayer({ jid, name: String(name || "Aventureiro").slice(0, 40), createdAt: now, updatedAt: now, level: 1, xp: 0, xpNext: 100, gold: 100, class: null, classChosenAt: null, faction: null, dragonClass: null, awakening: { unlocked: false, started: false, completed: false, startedAt: null, completedAt: null }, stats: { ...BASE_STATS }, resources:{hp:100,mana:50}, statPoints:0, inventory: [{ id: "pocao_pequena", name: "Poção Pequena", icon: "🧪", qty: 2, type: "consumivel" }, { id: "pao_aventureiro", name: "Pão de Aventureiro", icon: "🥖", qty: 1, type: "consumivel" }], equipment: { weapon: null, armor: null, accessory: null }, combat:null, rpgStats:{battles:0,wins:0,losses:0,escapes:0,monstersDefeated:0,damageDealt:0,damageTaken:0}, quests:{active:{},completed:[]}, lastRestAt:0 });
}
export function getDragonRpgPlayer(jid) { const db = readDb(); return db.players[normalizeUser(jid)] || null; }
export function createDragonRpgPlayer(jid, name) { const key = normalizeUser(jid); const db = readDb(); if (db.players[key]) return { created: false, player: db.players[key] }; const player = makePlayer(key, name); db.players[key] = player; writeDb(db); return { created: true, player }; }
function savePlayer(player) { const db = readDb(); player.updatedAt = new Date().toISOString(); db.players[normalizeUser(player.jid)] = migratePlayer(player); writeDb(db); return player; }
function addStats(stats, bonus) { for (const key of Object.keys(BASE_STATS)) stats[key] = Number(stats[key] || 0) + Number(bonus?.[key] || 0); }
function addItem(player,item,qty=1){ if(!item||qty<=0)return; const id=item.id; let ex=player.inventory.find(x=>x.id===id); if(ex) ex.qty=Number(ex.qty||0)+qty; else player.inventory.push({...item,qty}); }

function applyEquipmentBonus(p,i,sign=1){if(!i?.bonus)return;for(const[k,v]of Object.entries(i.bonus))p.stats[k]=Math.max(1,Number(p.stats[k]||0)+Number(v||0)*sign);p.resources.hp=Math.min(p.resources.hp,p.stats.hp);p.resources.mana=Math.min(p.resources.mana,p.stats.mana);}
export function getRpgShop(){return Object.values(RPG_ITEMS);}
export function buyRpgItem(jid,id,qty=1){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};const i=RPG_ITEMS[String(id||"").toLowerCase()];if(!i)return{ok:false,reason:"invalid"};const n=clamp(parseInt(qty)||1,1,10);if(p.level<i.minLevel)return{ok:false,reason:"level",required:i.minLevel};if(i.dragonRequired&&!p.dragonClass)return{ok:false,reason:"dragon"};if(i.classes&&!i.classes.includes(p.class))return{ok:false,reason:"class"};const total=i.price*n;if(p.gold<total)return{ok:false,reason:"gold",required:total,current:p.gold};p.gold-=total;addItem(p,i,n);savePlayer(p);return{ok:true,item:i,qty:n,total,player:p};}
export function equipRpgItem(jid,id){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(p.combat)return{ok:false,reason:"combat"};const i=RPG_ITEMS[String(id||"").toLowerCase()];if(!i)return{ok:false,reason:"invalid"};if(!["weapon","armor","accessory"].includes(i.type))return{ok:false,reason:"type"};if(!p.inventory.find(x=>x.id===i.id&&Number(x.qty)>0))return{ok:false,reason:"inventory"};if(p.level<i.minLevel)return{ok:false,reason:"level",required:i.minLevel};if(i.dragonRequired&&!p.dragonClass)return{ok:false,reason:"dragon"};if(i.classes&&!i.classes.includes(p.class))return{ok:false,reason:"class"};const oldId=p.equipment[i.type];if(oldId===i.id)return{ok:false,reason:"already"};if(oldId&&RPG_ITEMS[oldId])applyEquipmentBonus(p,RPG_ITEMS[oldId],-1);p.equipment[i.type]=i.id;applyEquipmentBonus(p,i,1);savePlayer(p);return{ok:true,item:i,old:oldId?RPG_ITEMS[oldId]:null,player:p};}
export function unequipRpgItem(jid,key){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(p.combat)return{ok:false,reason:"combat"};let slot=String(key||"").toLowerCase();slot=({arma:"weapon",armadura:"armor",acessorio:"accessory","acessório":"accessory"})[slot]||slot;if(!["weapon","armor","accessory"].includes(slot))slot=["weapon","armor","accessory"].find(x=>p.equipment[x]===slot);if(!slot||!p.equipment[slot])return{ok:false,reason:"empty"};const i=RPG_ITEMS[p.equipment[slot]];if(i)applyEquipmentBonus(p,i,-1);p.equipment[slot]=null;savePlayer(p);return{ok:true,item:i,slot,player:p};}
export function getRpgSkills(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};return{ok:true,player:p,skills:(RPG_SKILLS[p.class]||[]).map(x=>({...x,unlocked:p.level>=x.level}))};}
export function formatRpgShop(prefix="/"){return `╭━━〔 🏪 *LOJA DRAGON RPG* 〕━━╮\n${Object.values(RPG_ITEMS).map(i=>`┃ ${i.icon} *${i.id}* — 🪙 ${i.price}\n┃ ${i.rarity} • Lv.${i.minLevel}${i.bonus?` • ${Object.entries(i.bonus).map(([k,v])=>`${k.toUpperCase()}+${v}`).join(" ")}`:""}`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nComprar: *${prefix}comprarrpg espada_ferro*`;}
export function formatRpgEquipment(p,prefix="/"){p=migratePlayer(p);const row=(sl,l)=>{const i=RPG_ITEMS[p.equipment?.[sl]];return`┃ ${l}: ${i?`${i.icon} *${i.name}* [${i.rarity}]`:"*Nenhum*"}`};return`╭━━〔 ⚔️ *EQUIPAMENTOS* 〕━━╮\n${row("weapon","🗡️ Arma")}\n${row("armor","🛡️ Armadura")}\n${row("accessory","💍 Acessório")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n📦 *${prefix}equipar <id>*\n↩️ *${prefix}desequipar arma|armadura|acessorio*`;}
export function formatRpgSkills(jid,prefix="/"){const r=getRpgSkills(jid);if(!r.ok)return null;return`╭━━〔 ✨ *HABILIDADES • ${HUMAN_CLASSES[r.player.class]?.name||"SEM CLASSE"}* 〕━━╮\n${r.skills.map(x=>`┃ ${x.unlocked?"✅":"🔒"} ${x.icon} *${x.id}* — ${x.name}\n┃ Lv.${x.level} • 🔷 ${x.cost} Mana`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nUse: *${prefix}habilidade <id>*`;}

export function chooseHumanClass(jid, classKey) {
  const key = String(classKey || "").toLowerCase(); const klass = HUMAN_CLASSES[key];
  if (!klass) return { ok: false, reason: "invalid" }; const player = getDragonRpgPlayer(jid);
  if (!player) return { ok: false, reason: "missing" }; if (player.class) return { ok: false, reason: "already", player };
  player.class = key; player.classChosenAt = new Date().toISOString(); addStats(player.stats, klass.bonus); player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; savePlayer(player); return { ok: true, player, klass };
}
export function startDragonAwakening(jid, socialLevel = 0) {
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "missing" };
  if (Number(socialLevel) < 20) return { ok: false, reason: "social_level", required: 20, current: Number(socialLevel) || 0 };
  if (!player.class) return { ok: false, reason: "class" }; if (player.awakening?.completed) return { ok: false, reason: "completed", player };
  player.awakening = { ...(player.awakening || {}), unlocked: true, started: true, completed: false, startedAt: player.awakening?.startedAt || new Date().toISOString(), completedAt: null }; savePlayer(player); return { ok: true, player };
}
export function chooseDragonFaction(jid, factionKey, socialLevel = 0) {
  const key = String(factionKey || "").toLowerCase(); const faction = FACTIONS[key]; if (!faction) return { ok: false, reason: "invalid" };
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "missing" }; if (Number(socialLevel) < 20 || !player.awakening?.started) return { ok: false, reason: "locked" };
  if (player.faction) return { ok: false, reason: "already", player }; player.faction = key; savePlayer(player); return { ok: true, player, faction };
}
export function chooseDragonClass(jid, dragonKey, socialLevel = 0) {
  const key = String(dragonKey || "").toLowerCase(); const klass = DRAGON_CLASSES[key]; if (!klass) return { ok: false, reason: "invalid" };
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "missing" }; if (Number(socialLevel) < 20 || !player.awakening?.started) return { ok: false, reason: "locked" };
  if (!player.faction) return { ok: false, reason: "faction" }; if (player.dragonClass) return { ok: false, reason: "already", player };
  if (klass.faction !== player.faction) return { ok: false, reason: "faction_mismatch", required: klass.faction };
  player.dragonClass = key; player.awakening.completed = true; player.awakening.completedAt = new Date().toISOString(); addStats(player.stats, klass.bonus); player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; savePlayer(player); return { ok: true, player, klass };
}
export function getHumanClasses() { return HUMAN_CLASSES; }
export function getDragonClasses() { return DRAGON_CLASSES; }
export function getDragonFactions() { return FACTIONS; }
export function factionName(key) { return FACTIONS[key]?.name || key; }

function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function scaleMonster(base, level){ const scale=1+Math.max(0,level-1)*0.10; return { ...base, level, maxHp:Math.round(base.hp*scale), hp:Math.round(base.hp*scale), atk:Math.round(base.atk*scale), def:Math.round(base.def*scale), mag:Math.round(base.mag*scale), agi:Math.round(base.agi*scale), xp:Math.round(base.xp*(.85+level*.08)) }; }
function regionMonster(regionKey, playerLevel){ const pool=Object.values(MONSTERS).filter(m=>m.regions.includes(regionKey)); const suitable=pool.filter(m=>playerLevel+4>=m.level[0]); const base=(suitable.length?suitable:pool)[randInt(0,(suitable.length?suitable:pool).length-1)]; const lo=Math.max(base.level[0],playerLevel-2), hi=Math.min(base.level[1],playerLevel+2); return scaleMonster(base, randInt(Math.min(lo,hi),Math.max(lo,hi))); }
function enemyDamage(enemy, player, defending=false){ const raw=Math.max(1,Math.round((enemy.atk*1.25)-(player.stats.def*.55)+randInt(-3,4))); return Math.max(1, defending?Math.ceil(raw*.45):raw); }
function playerDamage(player, enemy, magical=false, mult=1){ const power=magical?player.stats.mag:player.stats.atk; const raw=(power*1.35*mult)-(enemy.def*.55)+randInt(-3,5); return Math.max(1,Math.round(raw)); }
function awardXp(player, amount){ let gained=Math.max(0,Math.round(amount)); player.xp+=gained; const levels=[]; while(player.xp>=player.xpNext){ player.xp-=player.xpNext; player.level++; player.xpNext=xpNeeded(player.level); player.statPoints+=3; player.stats.hp+=8; player.stats.mana+=4; player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; levels.push(player.level); } return levels; }
function progressQuests(player, enemy, regionKey){ const completedNow=[]; for(const [qid,qstate] of Object.entries(player.quests.active||{})){ const q=QUESTS[qid]; if(!q)continue; let hit=false; if(q.type==='kill'&&q.monster===enemy.id)hit=true; if(q.type==='regionKills'&&q.region===regionKey)hit=true; if(hit){qstate.progress=Math.min(q.target,Number(qstate.progress||0)+1); if(qstate.progress>=q.target) qstate.ready=true;} } return completedNow; }
function finishVictory(player){ const battle=player.combat, enemy=battle.enemy; const gold=randInt(enemy.gold[0],enemy.gold[1]); const levels=awardXp(player,enemy.xp); player.gold+=gold; player.rpgStats.wins++; player.rpgStats.monstersDefeated++; progressQuests(player,enemy,battle.region); let drop=null; for(const d of enemy.drops||[]){ if(Math.random()<d.chance){drop={...d,qty:1,type:'material'}; addItem(player,drop,1); break;} } player.combat=null; savePlayer(player); return {enemy,gold,xp:enemy.xp,levels,drop,player}; }
function monsterTurn(player, defending=false){ const e=player.combat.enemy; const dmg=enemyDamage(e,player,defending); player.resources.hp=Math.max(0,player.resources.hp-dmg); player.rpgStats.damageTaken+=dmg; if(player.resources.hp<=0){ player.rpgStats.losses++; player.combat=null; savePlayer(player); return {damage:dmg,defeated:true}; } savePlayer(player); return {damage:dmg,defeated:false}; }

export function getRpgRegions(){ return REGIONS; }
export function formatRpgRegions(prefix='/'){ return `╭━━〔 🗺️ *REGIÕES DRAGON RPG* 〕━━╮\n${Object.entries(REGIONS).map(([k,r])=>`┃ ${r.icon} *${r.name}* — Lv. ${r.min}-${r.max}\n┃   ${prefix}explorar ${k}`).join('\n')}\n┃\n┃ ⚙️ ADM: ${prefix}mododragonrpg on/off\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function startRpgBattle(jid, regionKey='floresta'){
  const player=getDragonRpgPlayer(jid); if(!player)return {ok:false,reason:'missing'}; if(!player.class)return {ok:false,reason:'class'}; if(player.combat)return {ok:false,reason:'active',player}; if(player.resources.hp<=0)return {ok:false,reason:'defeated'};
  const key=String(regionKey||'floresta').toLowerCase(); const region=REGIONS[key]; if(!region)return {ok:false,reason:'region'}; if(player.level<region.min)return {ok:false,reason:'level',required:region.min,current:player.level}; if(key==='reino'&&!player.dragonClass)return {ok:false,reason:'dragon_required'};
  const enemy=regionMonster(key,player.level); player.combat={region:key,enemy,turn:1,startedAt:Date.now()}; player.rpgStats.battles++; savePlayer(player); return {ok:true,player,region,enemy};
}
export function getRpgBattle(jid){ const p=getDragonRpgPlayer(jid); return p?.combat||null; }
export function rpgAttack(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; if(!p.combat)return {ok:false,reason:'no_battle'}; const e=p.combat.enemy; const crit=Math.random()<clamp(.05+p.stats.agi/500,.05,.22); let dmg=playerDamage(p,e,false,crit?1.7:1); e.hp=Math.max(0,e.hp-dmg); p.rpgStats.damageDealt+=dmg; if(e.hp<=0){ savePlayer(p); return {ok:true,action:'attack',damage:dmg,crit,victory:finishVictory(p)}; } p.combat.turn++; savePlayer(p); const counter=monsterTurn(p,false); return {ok:true,action:'attack',damage:dmg,crit,enemy:e,counter,player:getDragonRpgPlayer(jid)}; }
export function rpgDefend(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; if(!p.combat)return {ok:false,reason:'no_battle'}; p.combat.turn++; savePlayer(p); const counter=monsterTurn(p,true); return {ok:true,action:'defend',enemy:p.combat?.enemy,counter,player:getDragonRpgPlayer(jid)}; }
export function rpgSkill(jid,skillKey=""){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(!p.combat)return{ok:false,reason:"no_battle"};const skills=RPG_SKILLS[p.class]||[],key=String(skillKey||"").toLowerCase();let sk=key?skills.find(x=>x.id===key):[...skills].reverse().find(x=>p.level>=x.level);if(!sk)return{ok:false,reason:"skill"};if(p.level<sk.level)return{ok:false,reason:"skill_level",required:sk.level,skill:sk};if(p.resources.mana<sk.cost)return{ok:false,reason:"mana",required:sk.cost,current:p.resources.mana};p.resources.mana-=sk.cost;const e=p.combat.enemy;let heal=0,dmg=0;if(sk.heal){heal=Math.min(p.stats.hp-p.resources.hp,Math.max(18,Math.round(p.stats.mag*(sk.healMult||1.4))));p.resources.hp+=heal;}else if(sk.defend){p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,true);return{ok:true,action:"defend",skill:sk,enemy:e,counter,player:getDragonRpgPlayer(jid)};}else{dmg=playerDamage(p,e,sk.mag,sk.mult);e.hp=Math.max(0,e.hp-dmg);p.rpgStats.damageDealt+=dmg;}if(e.hp<=0){savePlayer(p);return{ok:true,action:"skill",skill:sk,damage:dmg,heal,victory:finishVictory(p)}}p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,false);return{ok:true,action:"skill",skill:sk,damage:dmg,heal,enemy:e,counter,player:getDragonRpgPlayer(jid)};}
export function rpgUseItem(jid,itemKey='pocao_pequena'){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; if(!p.combat)return {ok:false,reason:'no_battle'}; const key=String(itemKey||'pocao_pequena').toLowerCase(); const aliases={pocao:'pocao_pequena','poção':'pocao_pequena',pao:'pao_aventureiro','pão':'pao_aventureiro'}; const id=aliases[key]||key; const item=p.inventory.find(x=>x.id===id&&Number(x.qty)>0); if(!item)return {ok:false,reason:'item'}; let heal=0,mana=0; if(id==='pocao_pequena'){heal=Math.min(p.stats.hp-p.resources.hp,45);p.resources.hp+=heal;} else if(id==='pao_aventureiro'){heal=Math.min(p.stats.hp-p.resources.hp,20);p.resources.hp+=heal;mana=Math.min(p.stats.mana-p.resources.mana,10);p.resources.mana+=mana;} else return {ok:false,reason:'not_consumable'}; item.qty--; p.combat.turn++; savePlayer(p); const counter=monsterTurn(p,false); return {ok:true,item,heal,mana,counter,player:getDragonRpgPlayer(jid)}; }
export function rpgFlee(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; if(!p.combat)return {ok:false,reason:'no_battle'}; const chance=clamp(.45+(p.stats.agi-p.combat.enemy.agi)/100,.2,.85); if(Math.random()<chance){p.combat=null;p.rpgStats.escapes++;savePlayer(p);return {ok:true,escaped:true,chance};} const counter=monsterTurn(p,false); return {ok:true,escaped:false,chance,counter,player:getDragonRpgPlayer(jid)}; }
export function rpgRest(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; if(p.combat)return {ok:false,reason:'combat'}; const now=Date.now(), remain=REST_COOLDOWN_MS-(now-p.lastRestAt); if(p.lastRestAt&&remain>0)return {ok:false,reason:'cooldown',remaining:remain}; p.resources.hp=p.stats.hp;p.resources.mana=p.stats.mana;p.lastRestAt=now;savePlayer(p);return {ok:true,player:p}; }
export function rpgSpendStat(jid,stat,points=1){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; const key=String(stat||'').toLowerCase(); const allowed=['hp','mana','atk','def','mag','agi']; if(!allowed.includes(key))return {ok:false,reason:'stat'}; const n=clamp(parseInt(points)||1,1,20); if(p.statPoints<n)return {ok:false,reason:'points',current:p.statPoints}; const mult=key==='hp'?5:key==='mana'?3:1; p.stats[key]+=n*mult; p.statPoints-=n; if(key==='hp')p.resources.hp=Math.min(p.stats.hp,p.resources.hp+n*mult); if(key==='mana')p.resources.mana=Math.min(p.stats.mana,p.resources.mana+n*mult); savePlayer(p);return {ok:true,player:p,stat:key,points:n,gain:n*mult}; }

export function listRpgQuests(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; return {ok:true,player:p,quests:Object.values(QUESTS).filter(q=>p.level>=q.minLevel)}; }
export function acceptRpgQuest(jid,questId){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; const q=QUESTS[String(questId||'')]; if(!q)return {ok:false,reason:'invalid'}; if(p.level<q.minLevel)return {ok:false,reason:'level',required:q.minLevel}; if(p.quests.completed.includes(q.id))return {ok:false,reason:'completed'}; if(p.quests.active[q.id])return {ok:false,reason:'active'}; if(Object.keys(p.quests.active).length>=3)return {ok:false,reason:'limit'}; p.quests.active[q.id]={progress:0,ready:false,acceptedAt:Date.now()};savePlayer(p);return {ok:true,quest:q,player:p}; }
export function claimRpgQuest(jid,questId){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; const q=QUESTS[String(questId||'')], st=p.quests.active[String(questId||'')]; if(!q||!st)return {ok:false,reason:'inactive'}; if(!st.ready)return {ok:false,reason:'progress',progress:st.progress,target:q.target}; p.gold+=q.gold; const levels=awardXp(p,q.xp); if(q.item)addItem(p,q.item,q.item.qty||1); delete p.quests.active[q.id];p.quests.completed.push(q.id);savePlayer(p);return {ok:true,quest:q,levels,player:p}; }
export function getRpgRank(limit=10){ const db=readDb(); return Object.values(db.players).map(migratePlayer).sort((a,b)=>b.level-a.level||b.xp-a.xp||b.rpgStats.wins-a.rpgStats.wins).slice(0,limit); }

function battleStatus(p){ if(!p.combat)return ''; const e=p.combat.enemy; return `\n┃ ⚔️ Em batalha: ${e.icon} *${e.name}* Lv.${e.level}\n┃ 👹 HP inimigo: *${e.hp}/${e.maxHp}*`; }
function statLine(stats) { return `❤️ HP: *${stats.hp}*  🔷 Mana: *${stats.mana}*\n⚔️ ATK: *${stats.atk}*  🛡️ DEF: *${stats.def}*\n🔮 MAG: *${stats.mag}*  💨 AGI: *${stats.agi}*`; }
export function formatDragonRpgProfile(player, { socialLevel = 0, prefix = "/" } = {}) {
  player=migratePlayer(player); const human = player.class ? HUMAN_CLASSES[player.class] : null; const faction = player.faction ? FACTIONS[player.faction] : null; const dragon = player.dragonClass ? DRAGON_CLASSES[player.dragonClass] : null;
  const unlock = Number(socialLevel) >= 20 ? "✅ Disponível" : `🔒 Level social ${socialLevel}/20`; const dragonState = dragon ? `${dragon.icon} *${dragon.name}*` : player.awakening?.started ? "🌋 Despertar iniciado" : "🐣 Ainda humano";
  return `╭═══❀══〔 🐉 *DRAGON RPG • PERFIL* 〕══❀═══╮\n┃ 👤 Nome: *${player.name}*\n┃ ⭐ Nível RPG: *${player.level}*\n┃ ✨ XP: *${player.xp}/${player.xpNext}*\n┃ 🪙 Ouro: *${player.gold}*\n┃ 🎯 Pontos de atributo: *${player.statPoints}*\n┃ ❤️ Vida atual: *${player.resources.hp}/${player.stats.hp}*\n┃ 🔷 Mana atual: *${player.resources.mana}/${player.stats.mana}*\n┃\n┃ 🧭 Classe humana: ${human ? `${human.icon} *${human.name}*` : "❔ Não escolhida"}\n┃ 🐲 Forma dracônica: ${dragonState}\n┃ ${faction ? `${faction.icon} Facção: *${faction.name}*` : "🌸 Facção: *Nenhuma*"}\n┃\n┃ ${statLine(player.stats).replaceAll("\n", "\n┃ ")}\n┃\n┃ ⚔️ Vitórias: *${player.rpgStats.wins}* | ☠️ Derrotas: *${player.rpgStats.losses}*${battleStatus(player)}\n┃\n┃ 🌟 Level social: *${socialLevel}*\n┃ 🐉 Despertar: *${unlock}*\n╰════════════════════════════════════╯\n\n🌸 Ajuda: *${prefix}rpgajuda*`;
}
export function formatDragonRpgInventory(player) {
  player=migratePlayer(player); const rows = (player.inventory || []).filter(x => Number(x.qty) > 0).map((item, i) => `┃ ${i + 1}. ${item.icon || "📦"} *${item.name}* ×${item.qty}`);
  return `╭━━〔 🎒 *INVENTÁRIO DRAGON* 〕━━╮\n${rows.length ? rows.join("\n") : "┃ Inventário vazio."}\n┣━━━━━━━━━━━━━━━━━━━━━━\n┃ ⚔️ Arma: *${RPG_ITEMS[player.equipment?.weapon]?.name || "Nenhuma"}*\n┃ 🛡️ Armadura: *${RPG_ITEMS[player.equipment?.armor]?.name || "Nenhuma"}*\n┃ 💍 Acessório: *${RPG_ITEMS[player.equipment?.accessory]?.name || "Nenhum"}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}
export function formatBattleStart(result,prefix='/'){ const {region,enemy,player}=result; return `╭━━〔 ${region.icon} *${region.name.toUpperCase()}* 〕━━╮\n┃ Você encontrou ${enemy.icon} *${enemy.name}* Lv.${enemy.level}!\n┃ 👹 HP: *${enemy.hp}/${enemy.maxHp}*\n┃ ❤️ Seu HP: *${player.resources.hp}/${player.stats.hp}*\n┃ 🔷 Mana: *${player.resources.mana}/${player.stats.mana}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n⚔️ ${prefix}atacar\n✨ ${prefix}habilidade\n🛡️ ${prefix}defender\n🧪 ${prefix}item pocao\n🏃 ${prefix}fugir`; }
export function formatBattleAction(r,prefix='/'){ if(!r.ok)return ''; if(r.victory){ const v=r.victory; return `🏆 *VITÓRIA!*\n\nVocê derrotou ${v.enemy.icon} *${v.enemy.name}*!\n✨ +${v.xp} XP RPG\n🪙 +${v.gold} ouro${v.drop?`\n🎁 Drop: ${v.drop.icon} *${v.drop.name}*`:''}${v.levels.length?`\n\n🌟 *LEVEL UP!* Você chegou ao nível *${v.player.level}* e recebeu *${v.levels.length*3} pontos de atributo*.`:''}\n\n🗺️ Explore novamente com *${prefix}explorar <região>*.`; }
 const p=r.player, e=r.enemy||p?.combat?.enemy; if(r.counter?.defeated)return `☠️ *VOCÊ FOI DERROTADO*\n\nO inimigo causou *${r.counter.damage}* de dano e seu HP chegou a 0.\n🏕️ Use *${prefix}descansar* para se recuperar.`; const main=r.action==='defend'?`🛡️ Você se defendeu e reduziu o dano recebido.`:r.action==='skill'?`${r.skill?.heal?'🌿':'✨'} *${r.skill?.name}*${r.damage?` causou *${r.damage}* de dano`:''}${r.heal?` recuperou *${r.heal} HP*`:''}.`:`⚔️ Seu ataque causou *${r.damage}* de dano${r.crit?' — *CRÍTICO!* 🔥':''}.`; return `${main}\n👹 ${e.icon} ${e.name}: *${e.hp}/${e.maxHp} HP*\n\n${r.counter?`💥 O inimigo contra-atacou: *${r.counter.damage}* de dano.\n`:''}❤️ Seu HP: *${p.resources.hp}/${p.stats.hp}* | 🔷 Mana: *${p.resources.mana}/${p.stats.mana}*\n\nSua vez: *${prefix}atacar* | *${prefix}habilidade* | *${prefix}defender*`; }
export function formatRpgQuests(jid,prefix='/'){ const r=listRpgQuests(jid); if(!r.ok)return null; const p=r.player; return `╭━━〔 📜 *MISSÕES DRAGON* 〕━━╮\n${r.quests.map(q=>{const s=p.quests.active[q.id];const done=p.quests.completed.includes(q.id);return `┃ ${done?'✅':s?.ready?'🎁':s?'🟡':'📌'} *${q.id}* — ${q.title}\n┃ ${q.desc}\n┃ Progresso: *${s?`${s.progress}/${q.target}`:done?'Concluída':'Não aceita'}*`;}).join('\n┣━━━━━━━━━━━━━━━━━━━━━━\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n📌 ${prefix}missao aceitar q_slimes\n🎁 ${prefix}missao resgatar q_slimes`; }
export function formatRpgRank(limit=10){ const rows=getRpgRank(limit).map((p,i)=>`${i+1}. ${i===0?'👑':i===1?'🥈':i===2?'🥉':'🐉'} *${p.name}* — Lv.${p.level} • ${p.rpgStats.wins} vitórias`); return `╭━━〔 🏆 *RANK DRAGON RPG* 〕━━╮\n${rows.length?rows.join('\n'):'Nenhum aventureiro ainda.'}\n╰━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function formatRpgMenu(prefix = "/", socialLevel = 0, hasPlayer = false) {
  return `╭═══❀═══〔 🐉 〕═══❀═══╮\n┃       *DRAGON RPG • v2.0.7*\n╰═══❀═══〔 🌸 〕═══❀═══╯\n\n${hasPlayer ? "✅ Seu personagem Dragon está ativo." : "🌱 Você ainda não criou seu personagem."}\n\n╭━━〔 🌸 *PERSONAGEM* 〕━━╮\n┃ ${prefix}rpgcriar\n┃ ${prefix}rpgperfil\n┃ ${prefix}rpginventario\n┃ ${prefix}equipamentos\n┃ ${prefix}lojarpg\n┃ ${prefix}habilidades\n┃ ${prefix}rpgatributo\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 ⚔️ *AVENTURA* 〕━━╮\n┃ ${prefix}regioes\n┃ ${prefix}explorar floresta\n┃ ${prefix}missoes\n┃ ${prefix}rankrpg\n┃ ${prefix}descansar\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🧭 *CLASSES* 〕━━╮\n┃ ${prefix}rpgclasses\n┃ ${prefix}classeinfo <classe>\n┃ ${prefix}rpgclasse <classe>\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🐲 *DESPERTAR DRACÔNICO* 〕━━╮\n┃ Requisito: *Level social 20+*\n┃ Seu Level social: *${socialLevel}*\n┃ ${prefix}despertardragao\n┃ ${prefix}rpgfaccao <facção>\n┃ ${prefix}rpgdragao <classe>\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n📖 ${prefix}rpgajuda`;
}
export function formatRpgCommands(prefix = "/") { return `╭━━〔 📜 *COMANDOS DRAGON RPG* 〕━━╮\n┃ ${prefix}dragonrpg | ${prefix}rpgcriar | ${prefix}rpgperfil\n┃ ${prefix}rpginventario | ${prefix}rpgatributo\n┃ ${prefix}lojarpg | ${prefix}comprarrpg | ${prefix}equipamentos\n┃ ${prefix}equipar | ${prefix}desequipar | ${prefix}habilidades\n┃ ${prefix}regioes | ${prefix}explorar | ${prefix}batalhar\n┃ ${prefix}atacar | ${prefix}habilidade | ${prefix}defender\n┃ ${prefix}item | ${prefix}fugir | ${prefix}descansar\n┃ ${prefix}missoes | ${prefix}missao | ${prefix}rankrpg\n┃ ${prefix}rpgclasses | ${prefix}classeinfo | ${prefix}rpgclasse\n┃ ${prefix}despertardragao | ${prefix}rpgfaccao | ${prefix}rpgdragao\n┃ ${prefix}rpgajuda [tema]\n┃ 👑 ${prefix}zerarrpg | ${prefix}zerarrpgg\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function formatRpgClasses(prefix = "/") {
  const humans = Object.entries(HUMAN_CLASSES).map(([k, v]) => `┃ ${v.icon} *${v.name}* — ${prefix}classeinfo ${k}`).join("\n");
  const dragons = Object.entries(DRAGON_CLASSES).map(([k, v]) => `┃ ${v.icon} *${v.name}* [${FACTIONS[v.faction].name}] — ${prefix}classeinfo ${k}`).join("\n");
  return `╭━━〔 🧑 *CLASSES HUMANAS* 〕━━╮\n${humans}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🐉 *CLASSES DRACÔNICAS* 〕━━╮\n┃ 🔒 Desbloqueadas no *Level social 20+*\n${dragons}\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n🌸 As classes dracônicas são linhagens do Dragon RPG inspiradas nos dragões de *Maid Dragon*.`;
}
export function formatClassInfo(classKey, prefix = "/") {
  const key = String(classKey || "").toLowerCase();
  if (HUMAN_CLASSES[key]) { const c = HUMAN_CLASSES[key]; return `╭━━〔 ${c.icon} *${c.name.toUpperCase()}* 〕━━╮\n┃ 🎯 Função: *${c.role}*\n┃ 📖 ${c.desc}\n┃\n┃ 📈 Bônus iniciais:\n┃ ❤️ HP +${c.bonus.hp} | 🔷 Mana +${c.bonus.mana}\n┃ ⚔️ ATK +${c.bonus.atk} | 🛡️ DEF +${c.bonus.def}\n┃ 🔮 MAG +${c.bonus.mag} | 💨 AGI +${c.bonus.agi}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\nEscolher: *${prefix}rpgclasse ${key}*`; }
  if (DRAGON_CLASSES[key]) { const c = DRAGON_CLASSES[key]; const f = FACTIONS[c.faction]; return `╭━━〔 ${c.icon} *${c.name.toUpperCase()}* 〕━━╮\n┃ 🐲 Inspiração: *${c.inspiration}*\n┃ ${f.icon} Facção: *${f.name}*\n┃ 🎯 Função: *${c.role}*\n┃ 📖 ${c.desc}\n┃\n┃ 📈 Bônus do despertar:\n┃ ❤️ HP +${c.bonus.hp} | 🔷 Mana +${c.bonus.mana}\n┃ ⚔️ ATK +${c.bonus.atk} | 🛡️ DEF +${c.bonus.def}\n┃ 🔮 MAG +${c.bonus.mag} | 💨 AGI +${c.bonus.agi}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n🔒 Requer Level social 20+, Despertar iniciado e facção *${f.name}*.`; }
  return `❌ Classe não encontrada. Use *${prefix}rpgclasses* para ver as opções.`;
}
export function formatRpgHelp(topic = "", prefix = "/") {
  const t = String(topic || "").toLowerCase();
  if (["1", "comecar", "começar", "inicio", "início"].includes(t)) return `🌱 *COMEÇANDO NO DRAGON RPG*\n\n1. Use *${prefix}rpgcriar*\n2. Escolha uma classe em *${prefix}rpgclasses*\n3. Veja regiões em *${prefix}regioes*\n4. Entre em batalha com *${prefix}explorar floresta*\n5. Faça missões em *${prefix}missoes*.`;
  if (["2", "classes", "humanas"].includes(t)) return `⚔️ *CLASSES HUMANAS*\n\nSua primeira especialização. Cada classe altera atributos e possui uma habilidade própria durante o combate. Veja *${prefix}rpgclasses* e *${prefix}classeinfo <classe>*.`;
  if (["3", "dragao", "dragão", "dragoes", "dragões"].includes(t)) return `🐉 *CLASSES DRACÔNICAS*\n\nPara despertar você precisa de *Level social 20+*, iniciar *${prefix}despertardragao*, escolher uma facção e uma linhagem compatível.`;
  if (["4", "faccoes", "facções", "faccao", "facção"].includes(t)) return `🏰 *FACÇÕES DRACÔNICAS*\n\n🔥 Caos — Chamas, Abissal e Carmesim\n⚖️ Harmonia — Aquático\n👁️ Espectadores — Arcano\n⚡ Independente — Elétrico`;
  if (["5", "atributos", "status"].includes(t)) return `📊 *ATRIBUTOS*\n\n❤️ HP: vida máxima\n🔷 Mana: energia para habilidades\n⚔️ ATK: dano físico\n🛡️ DEF: reduz dano\n🔮 MAG: poder mágico\n💨 AGI: crítico e fuga\n\nAo subir de nível você recebe pontos. Use *${prefix}rpgatributo atk 1*.`;
  if (["6", "nivel", "nível", "xp"].includes(t)) return `⭐ *XP RPG*\n\nBatalhas e missões dão XP próprio. Ao subir de nível você recupera HP/Mana, ganha atributos básicos e recebe 3 pontos para distribuir.`;
  if (["7", "combate", "batalha"].includes(t)) return `⚔️ *COMBATE POR TURNOS*\n\n${prefix}atacar — ataque normal\n${prefix}habilidade — técnica da classe, gasta Mana\n${prefix}defender — reduz o próximo dano\n${prefix}item pocao — usa consumível\n${prefix}fugir — tenta escapar\n${prefix}descansar — recupera fora de combate`;
  if (["8", "missoes", "missões"].includes(t)) return `📜 *MISSÕES*\n\nVeja *${prefix}missoes*. Aceite com *${prefix}missao aceitar <id>*. Progresso conta automaticamente nas batalhas e a recompensa é resgatada com *${prefix}missao resgatar <id>*.`;
  return `╭━━〔 📖 *DRAGON RPG • AJUDA* 〕━━╮\n┃ 1️⃣ Começando no RPG\n┃ 2️⃣ Classes humanas\n┃ 3️⃣ Classes de dragões\n┃ 4️⃣ Facções dracônicas\n┃ 5️⃣ Atributos\n┃ 6️⃣ Níveis e XP\n┃ 7️⃣ Combate\n┃ 8️⃣ Missões\n┃ 📜 ${prefix}rpgcomandos\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}
