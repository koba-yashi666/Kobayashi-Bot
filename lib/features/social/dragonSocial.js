import { MARKET_ITEMS, CROPS } from "./dragonMarketCatalog.js";
import fs from "node:fs";
import path from "node:path";

const DB_FILE = path.join(process.cwd(), "files", "database", "dragon-social.json");
const DAY = 24 * 60 * 60 * 1000;
const ANTIFARM_FILE = path.join(process.cwd(), "files", "database", "dragon-antifarm.json");
const ANTIFARM_ACTION_LIMIT = 20;
const ANTIFARM_COIN_LIMIT = 250;

function loadAntiFarm() {
  try {
    if (!fs.existsSync(ANTIFARM_FILE)) return { groups: {} };
    const data = JSON.parse(fs.readFileSync(ANTIFARM_FILE, "utf8"));
    return { groups: data?.groups || {} };
  } catch {
    return { groups: {} };
  }
}

function saveAntiFarm(db) {
  fs.mkdirSync(path.dirname(ANTIFARM_FILE), { recursive: true });
  fs.writeFileSync(ANTIFARM_FILE, JSON.stringify(db, null, 2), "utf8");
}

function load() {
  try {
    if (!fs.existsSync(DB_FILE)) return { users: {} };
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return { ...data, users: data?.users || {} };
  } catch {
    return { users: {} };
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(`${DB_FILE}.tmp`, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(`${DB_FILE}.tmp`, DB_FILE);
}

function ensure(db, jid) {
  jid = db.aliases?.[jid] || jid;
  db.users[jid] ||= {
    coins: 0,
    dailyAt: 0,
    games: { played: 0, wins: 0, losses: 0 },
    socialInteractions: 0,
    transfersSent: 0,
    transfersReceived: 0,
    inventory: {},
    activeTitle: "",
    dailyBoosts: 0,
    shopUsage: { key: "", count: 0 },
    createdAt: Date.now()
  };
  db.users[jid].games ||= { played: 0, wins: 0, losses: 0 };
  db.users[jid].inventory ||= {};
  db.users[jid].activeTitle ||= "";
  db.users[jid].dailyBoosts ||= 0;
  db.users[jid].shopUsage ||= { key: "", count: 0 };
  const u = db.users[jid];
  // Importa uma única vez o saldo antigo dos jogos, sem tocar no ouro do RPG.
  if (!u.legacyWalletImported) {
    const file = path.join(path.dirname(DB_FILE), "dragon-fun-v09.json");
    if (fs.existsSync(file)) {
      const legacy = JSON.parse(fs.readFileSync(file, "utf8"))?.users?.[jid];
      u.coins = Number(u.coins || 0) + Math.max(0, Number(legacy?.coins || 0)) + Math.max(0, Number(legacy?.bank || 0));
    }
    u.legacyWalletImported = true;
    save(db);
  }
  return u;
}

export function getSocialProfile(jid) {
  const db = load();
  const u = ensure(db, jid);
  return JSON.parse(JSON.stringify(u));
}

export function claimDaily(jid, level = 1) {
  const db = load();
  const u = ensure(db, jid);
  const elapsed = Date.now() - Number(u.dailyAt || 0);
  if (u.dailyAt && elapsed < DAY) return { ok: false, remainingMs: DAY - elapsed };

  const safeLevel = Math.max(1, Math.min(50, Number(level) || 1));
  const streak = u.dailyAt && elapsed < DAY * 2 ? (Number(u.dailyStreak || 0) % 7) + 1 : 1;
  const base = 100 + (streak - 1) * 50;
  const weekBonus = streak === 7 ? 500 : 0;
  const levelBonus = Math.floor((safeLevel - 1) * 3);

  let boostBonus = 0;
  let boostUsed = false;
  if (Number(u.dailyBoosts || 0) > 0) {
    boostBonus = 75;
    u.dailyBoosts -= 1;
    const boostItem = u.inventory?.boost_daily;
    if (boostItem) {
      boostItem.qty = Math.max(0, Number(boostItem.qty || 0) - 1);
      if (boostItem.qty <= 0) delete u.inventory.boost_daily;
    }
    boostUsed = true;
  }

  const reward = base + levelBonus + boostBonus + weekBonus;
  u.dailyStreak = streak;

  u.coins += reward;
  u.dailyAt = Date.now();
  save(db);
  return {
    ok: true,
    reward,
    streak,
    weekBonus,
    base,
    levelBonus,
    boostBonus,
    boostUsed,
    level: safeLevel,
    coins: u.coins,
    boostsRemaining: u.dailyBoosts
  };
}

export function awardLevelUpCoins(jid, newLevel) {
  const db = load();
  const u = ensure(db, jid);
  u.levelRewards ||= {};

  const level = Math.max(1, Math.min(50, Number(newLevel) || 1));
  if (u.levelRewards[level]) {
    return { awarded: false, reward: 0, coins: u.coins, level };
  }

  const reward = level * 10;
  u.coins += reward;
  u.levelRewards[level] = Date.now();
  save(db);

  return { awarded: true, reward, coins: u.coins, level };
}

export function transferCoins(from, to, amount) {
  amount = Math.floor(Number(amount) || 0);
  if (amount < 1) return { ok: false, reason: "O valor precisa ser maior que zero." };
  if (amount > 1000000) return { ok: false, reason: "Valor acima do limite por transferência." };
  const db = load();
  const a = ensure(db, from);
  const b = ensure(db, to);
  if (a.coins < amount) return { ok: false, reason: "Você não tem Dragon-coins suficientes." };
  a.coins -= amount;
  b.coins += amount;
  a.transfersSent++;
  b.transfersReceived++;
  save(db);
  return { ok: true, amount, fromCoins: a.coins, toCoins: b.coins };
}

export function recordGame(jid, result = "play", reward = 0, groupJid = null) {
  const db = load();
  const u = ensure(db, jid);
  u.games.played++;
  if (result === "win") u.games.wins++;
  if (result === "loss") u.games.losses++;

  const antiFarm = applyAntiFarmReward(groupJid, jid, reward);
  const granted = antiFarm.allowed ? Number(antiFarm.reward || 0) : 0;
  u.coins += granted;
  save(db);

  return { ...JSON.parse(JSON.stringify(u)), reward: granted, antiFarm };
}

export function recordSocialInteraction(from, to, groupJid = null) {
  const db = load();
  const a = ensure(db, from);
  ensure(db, to);
  a.socialInteractions++;

  const antiFarm = applyAntiFarmReward(groupJid, from, 2);
  const granted = antiFarm.allowed ? Number(antiFarm.reward || 0) : 0;
  a.coins += granted;
  save(db);

  return { ...JSON.parse(JSON.stringify(a)), reward: granted, antiFarm };
}

export function getCoinRank(limit = 10) {
  const db = load();
  return Object.entries(db.users || {})
    .map(([jid,u]) => ({ jid, coins: Number(u?.coins || 0) }))
    .filter(x => x.coins > 0)
    .sort((a,b)=>b.coins-a.coins)
    .slice(0, Math.max(1, Math.min(50, Number(limit)||10)));
}



const SHOP_DAILY_LIMIT = 5;

function getSaoPauloParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);

  const out = {};
  for (const p of parts) {
    if (p.type !== "literal") out[p.type] = p.value;
  }
  return out;
}

function getShopDayKey(now = new Date()) {
  const p = getSaoPauloParts(now);
  let y = Number(p.year);
  let m = Number(p.month);
  let d = Number(p.day);
  const h = Number(p.hour);

  // A "virada do dia" da loja acontece às 06:00 em America/Sao_Paulo.
  // Entre 00:00 e 05:59, ainda vale a cota do dia anterior.
  if (h < 6) {
    const previous = new Date(Date.UTC(y, m - 1, d) - 86400000);
    y = previous.getUTCFullYear();
    m = previous.getUTCMonth() + 1;
    d = previous.getUTCDate();
  }

  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function normalizeShopUsage(u) {
  const key = getShopDayKey();
  u.shopUsage ||= { key: "", count: 0 };

  if (u.shopUsage.key !== key) {
    u.shopUsage.key = key;
    u.shopUsage.count = 0;
  }

  u.shopUsage.count = Math.max(0, Number(u.shopUsage.count || 0));
  return u.shopUsage;
}

export function getShopUsage(jid) {
  const db = load();
  const u = ensure(db, jid);
  const usage = normalizeShopUsage(u);
  save(db);

  return {
    used: usage.count,
    limit: SHOP_DAILY_LIMIT,
    remaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count),
    resetsAt: "06:00",
    timeZone: "America/Sao_Paulo"
  };
}

function ensureAntiFarmGroup(db, groupJid) {
  db.groups[groupJid] ||= { enabled: true, users: {}, updatedAt: Date.now() };
  db.groups[groupJid].users ||= {};
  return db.groups[groupJid];
}

function normalizeAntiFarmUser(group, userJid) {
  const key = getShopDayKey();
  group.users[userJid] ||= { key, actions: 0, coins: 0 };

  const row = group.users[userJid];
  if (row.key !== key) {
    row.key = key;
    row.actions = 0;
    row.coins = 0;
  }

  row.actions = Math.max(0, Number(row.actions || 0));
  row.coins = Math.max(0, Number(row.coins || 0));
  return row;
}

export function getAntiFarmConfig(groupJid) {
  const db = loadAntiFarm();
  const group = ensureAntiFarmGroup(db, groupJid);
  saveAntiFarm(db);
  return {
    enabled: group.enabled !== false,
    actionLimit: ANTIFARM_ACTION_LIMIT,
    coinLimit: ANTIFARM_COIN_LIMIT,
    resetsAt: "06:00"
  };
}

export function setAntiFarmEnabled(groupJid, enabled) {
  const db = loadAntiFarm();
  const group = ensureAntiFarmGroup(db, groupJid);
  group.enabled = Boolean(enabled);
  group.updatedAt = Date.now();
  saveAntiFarm(db);
  return group.enabled;
}

export function getAntiFarmUsage(groupJid, userJid) {
  const db = loadAntiFarm();
  const group = ensureAntiFarmGroup(db, groupJid);
  const row = normalizeAntiFarmUser(group, userJid);
  saveAntiFarm(db);
  return {
    enabled: group.enabled !== false,
    actions: row.actions,
    coins: row.coins,
    actionLimit: ANTIFARM_ACTION_LIMIT,
    coinLimit: ANTIFARM_COIN_LIMIT,
    actionsRemaining: Math.max(0, ANTIFARM_ACTION_LIMIT - row.actions),
    coinsRemaining: Math.max(0, ANTIFARM_COIN_LIMIT - row.coins),
    resetsAt: "06:00"
  };
}

function applyAntiFarmReward(groupJid, userJid, reward) {
  const requested = Math.max(0, Math.floor(Number(reward) || 0));
  if (!groupJid || !userJid || requested <= 0) {
    return { allowed: true, reward: requested, blocked: false };
  }

  const db = loadAntiFarm();
  const group = ensureAntiFarmGroup(db, groupJid);
  const row = normalizeAntiFarmUser(group, userJid);

  if (group.enabled === false) {
    saveAntiFarm(db);
    return { allowed: true, reward: requested, blocked: false };
  }

  const actionsLeft = ANTIFARM_ACTION_LIMIT - row.actions;
  const coinsLeft = ANTIFARM_COIN_LIMIT - row.coins;
  if (actionsLeft <= 0 || coinsLeft <= 0) {
    saveAntiFarm(db);
    return { allowed: false, reward: 0, blocked: true, resetsAt: "06:00" };
  }

  const granted = Math.min(requested, coinsLeft);
  row.actions += 1;
  row.coins += granted;
  saveAntiFarm(db);

  return {
    allowed: granted > 0,
    reward: granted,
    blocked: granted <= 0,
    limited: granted < requested,
    actionsRemaining: Math.max(0, ANTIFARM_ACTION_LIMIT - row.actions),
    coinsRemaining: Math.max(0, ANTIFARM_COIN_LIMIT - row.coins),
    resetsAt: "06:00"
  };
}

export const DRAGON_SHOP = [
  ...MARKET_ITEMS,
  {
    id: "titulo_lunar",
    icon: "🌙",
    name: "Título Dragão Lunar",
    price: 450,
    type: "title",
    value: "🌙 Dragão Lunar",
    description: "Título cosmético para o Dragon Card."
  },
  {
    id: "titulo_carmesim",
    icon: "🔥",
    name: "Título Dragão Carmesim",
    price: 700,
    type: "title",
    value: "🔥 Dragão Carmesim",
    description: "Título cosmético para o Dragon Card."
  },
  {
    id: "titulo_cosmico",
    icon: "🌌",
    name: "Título Dragão Cósmico",
    price: 1100,
    type: "title",
    value: "🌌 Dragão Cósmico",
    description: "Título cosmético raro para o Dragon Card."
  },
  {
    id: "boost_daily",
    icon: "🎁",
    name: "Boost Daily +75",
    price: 300,
    type: "daily_boost",
    value: 75,
    description: "Adiciona +75 Dragon-coins no próximo /daily."
  },
  {
    id: "caixa_escamas",
    icon: "📦",
    name: "Caixa de Escamas",
    price: 200,
    type: "box",
    description: "Abra para receber entre 80 e 300 Dragon-coins."
  }
];

export function getShopItems() {
  return DRAGON_SHOP.map(x => ({ ...x }));
}

export function buyShopItem(jid, itemId, quantity = 1) {
  const db = load();
  const u = ensure(db, jid);
  const usage = normalizeShopUsage(u);
  const item = DRAGON_SHOP.find(x => x.id === normalizeMarketId(itemId));

  if (!item) return {
    ok: false,
    reason: "Item não encontrado.",
    shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count)
  };

  const qty = Number(quantity);
  if (!Number.isSafeInteger(qty) || qty < 1 || qty > 20 || (item.type === "title" && qty !== 1)) return {ok:false,reason:"Quantidade inválida: 1 a 20; títulos: 1."};
  const total = item.price * qty;
  if (usage.count >= SHOP_DAILY_LIMIT) {
    save(db);
    return {
      ok: false,
      reason: "Você atingiu o limite diário de 5 compras. A loja libera novamente às 06:00.",
      coins: u.coins,
      shopRemaining: 0,
      shopLimitReached: true
    };
  }

  if (u.coins < total) return {
    ok: false,
    reason: "Dragon-coins insuficientes.",
    coins: u.coins,
    shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count)
  };

  if (item.type === "title" && u.inventory[item.id]) {
    return {
      ok: false,
      reason: "Você já possui esse título.",
      coins: u.coins,
      shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count)
    };
  }

  u.coins -= total;

  if (item.type === "title") {
    u.inventory[item.id] = { qty: 1, purchasedAt: Date.now() };
  } else if (item.type === "daily_boost") {
    u.dailyBoosts = Number(u.dailyBoosts || 0) + qty;
    u.inventory[item.id] = {
      qty: Number(u.inventory[item.id]?.qty || 0) + qty,
      purchasedAt: Date.now()
    };
  } else {
    u.inventory[item.id] = {
      qty: Number(u.inventory[item.id]?.qty || 0) + qty,
      purchasedAt: Date.now()
    };
  }

  usage.count += 1;
  save(db);

  return {
    ok: true,
    item,
    qty,
    total,
    coins: u.coins,
    profile: JSON.parse(JSON.stringify(u)),
    shopUsed: usage.count,
    shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count),
    shopLimit: SHOP_DAILY_LIMIT
  };
}

export function getInventory(jid) {
  const db = load();
  const u = ensure(db, jid);
  const owned = [];

  for (const item of DRAGON_SHOP) {
    const row = u.inventory?.[item.id];
    if (!row?.qty) continue;
    owned.push({
      ...item,
      qty: Number(row.qty || 0),
      active: item.type === "title" && u.activeTitle === item.id
    });
  }

  return {
    coins: u.coins,
    activeTitle: u.activeTitle || "",
    dailyBoosts: Number(u.dailyBoosts || 0),
    items: owned
  };
}

export function equipTitle(jid, itemId) {
  const db = load();
  const u = ensure(db, jid);
  const item = DRAGON_SHOP.find(x => x.id === normalizeMarketId(itemId) && x.type === "title");
  if (!item) return { ok: false, reason: "Título não encontrado." };
  if (!u.inventory?.[item.id]?.qty) return { ok: false, reason: "Você ainda não comprou esse título." };

  u.activeTitle = item.id;
  save(db);
  return { ok: true, item, title: item.value };
}

export function unequipTitle(jid) {
  const db = load();
  const u = ensure(db, jid);
  u.activeTitle = "";
  save(db);
  return { ok: true };
}

export function openDragonBox(jid) {
  const db = load();
  const u = ensure(db, jid);
  const boxId = "caixa_escamas";
  const qty = Number(u.inventory?.[boxId]?.qty || 0);
  if (qty < 1) return { ok: false, reason: "Você não possui uma Caixa de Escamas." };

  const reward = 80 + Math.floor(Math.random() * 221);
  u.inventory[boxId].qty = qty - 1;
  if (u.inventory[boxId].qty <= 0) delete u.inventory[boxId];
  u.coins += reward;
  save(db);

  return { ok: true, reward, coins: u.coins };
}

export function getActiveTitle(jid) {
  const db = load();
  const u = ensure(db, jid);
  const item = DRAGON_SHOP.find(x => x.id === u.activeTitle && x.type === "title");
  return item?.value || "";
}

const ACHIEVEMENTS = [
  { id:"first_coin", icon:"🪙", name:"Primeira Escama", description:"Tenha pelo menos 1 Dragon-coin.", test:u=>u.coins>=1 },
  { id:"rich_500", icon:"💰", name:"Tesouro do Dragão", description:"Tenha 500 Dragon-coins.", test:u=>u.coins>=500 },
  { id:"rich_2000", icon:"👑", name:"Cofre Imperial", description:"Tenha 2.000 Dragon-coins.", test:u=>u.coins>=2000 },
  { id:"games_10", icon:"🎮", name:"Jogador Dracônico", description:"Jogue 10 partidas.", test:u=>u.games.played>=10 },
  { id:"wins_10", icon:"🏆", name:"Caçador de Vitórias", description:"Vença 10 partidas.", test:u=>u.games.wins>=10 },
  { id:"social_10", icon:"🤝", name:"Dragão Sociável", description:"Faça 10 interações sociais.", test:u=>u.socialInteractions>=10 },
  { id:"social_50", icon:"🌸", name:"Coração da Comunidade", description:"Faça 50 interações sociais.", test:u=>u.socialInteractions>=50 },
  { id:"transfer", icon:"🎁", name:"Generosidade", description:"Faça uma transferência.", test:u=>u.transfersSent>=1 }
];

export function getAchievements(jid, level = 1) {
  const u = getSocialProfile(jid);
  const safeLevel = Math.max(1, Math.min(50, Number(level) || 1));
  const levelAchievements = [
    { id:"level_10", icon:"🐣", name:"Filhote Veterano", description:"Alcance o nível 10.", unlocked:safeLevel>=10 },
    { id:"level_25", icon:"⚡", name:"Dragão Ascendente", description:"Alcance o nível 25.", unlocked:safeLevel>=25 },
    { id:"level_50", icon:"🐲", name:"Dragão Primordial", description:"Alcance o nível 50.", unlocked:safeLevel>=50 }
  ];
  const items = [
    ...ACHIEVEMENTS.map(a=>({ ...a, test:undefined, unlocked:Boolean(a.test(u)) })),
    ...levelAchievements
  ];
  return { total:items.length, unlocked:items.filter(x=>x.unlocked), items };
}

export function getEconomySummary(jid) {
  const profile = getSocialProfile(jid);
  const achievements = getAchievements(jid);
  return { ...profile, achievements: achievements.unlocked.length, achievementsTotal: achievements.total };
}

export function normalizeMarketId(value) {
  return String(value || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[ -]+/g,'_');
}
export function setDragonBalance(jid, value) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('Saldo inválido');
  const db=load(), u=ensure(db,jid);u.coins=value;save(db);return value;
}
export function getDragonBalance(jid) { return getSocialProfile(jid).coins; }

export const MESSAGE_GOALS = [[10,30],[100,150],[400,450],[1000,1000]];
function messageState(u) {
  const key=getShopDayKey();
  if(u.messageGoals?.key!==key)u.messageGoals={key,count:0,claimed:[],lastAt:0,lastText:'',recentIds:[]};
  return u.messageGoals;
}
export function recordEconomyMessage(jid, {id,text='',isCommand=false,isMedia=false}={}) {
  if(!id || isCommand || (!isMedia && String(text).trim().length<3))return {reward:0};
  const db=load(),u=ensure(db,jid),m=messageState(u),now=Date.now();
  if(m.recentIds.includes(id)||now-m.lastAt<15000||(!isMedia&&m.lastText===String(text).trim()))return {reward:0};
  m.lastAt=now;m.lastText=String(text).trim();m.recentIds=[...m.recentIds.slice(-99),id];m.count++;
  let reward=0;
  for(const [goal,coins] of MESSAGE_GOALS)if(m.count>=goal&&!m.claimed.includes(goal)){m.claimed.push(goal);reward+=coins;}
  u.coins+=reward;save(db);return {reward,count:m.count,coins:u.coins};
}
export function getMessageGoals(jid) {
  const db=load(),u=ensure(db,jid),m=messageState(u);save(db);
  return {...m,goals:MESSAGE_GOALS};
}
export const DAY_JOBS = {
  trabalhar:{name:'Trabalho',cooldown:3600000,min:70,max:130},
  pescar:{name:'Pescaria',cooldown:2*3600000,min:60,max:160},
  entrega:{name:'Entrega',cooldown:3*3600000,min:100,max:200},
  procurar:{name:'Caça ao tesouro',cooldown:4*3600000,min:120,max:240}
};
export function earnDragonCoins(jid, action) {
  const job=DAY_JOBS[action];if(!job)return {ok:false,reason:'Atividade inválida.'};
  const db=load(),u=ensure(db,jid),now=Date.now();u.jobs ||= {};
  const wait=Number(u.jobs[action]||0)+job.cooldown-now;
  if(wait>0)return {ok:false,reason:`Aguarde ${Math.ceil(wait/60000)}min para repetir.`,remainingMs:wait};
  const reward=job.min+Math.floor(Math.random()*(job.max-job.min+1));
  u.jobs[action]=now;u.coins+=reward;save(db);return {ok:true,reward,coins:u.coins,job};
}
export function farmAction(jid, action, rawId='', rawQty='1') {
  const db=load(),u=ensure(db,jid);u.plots ||= [];
  if(action==='colher') {
    const ready=u.plots.filter(x=>x.readyAt<=Date.now());
    if(!ready.length)return {ok:false,reason:u.plots.length?`A colheita fica pronta em ${Math.max(1,Math.ceil((Math.min(...u.plots.map(x=>x.readyAt))-Date.now())/60000))}min.`:'Não há plantações. Compre sementes e use /plantar.'};
    const harvest={};
    for(const plot of ready){const c=CROPS.find(x=>x.id===plot.id);if(!c)continue;harvest[c.id]=(harvest[c.id]||0)+c.yieldQty;u.inventory[c.id]={qty:Number(u.inventory[c.id]?.qty||0)+c.yieldQty};}
    u.plots=u.plots.filter(x=>x.readyAt>Date.now());save(db);return {ok:true,harvest};
  }
  const id=normalizeMarketId(rawId).replace(/^semente_/,''),c=CROPS.find(x=>x.id===id),qty=Number(rawQty);
  if(!c)return {ok:false,reason:'Escolha uma semente da /loja. Ex.: /plantar tomate 2.'};
  if(!Number.isSafeInteger(qty)||qty<1||qty>10)return {ok:false,reason:'Quantidade: 1 a 10.'};
  if(u.plots.length+qty>10)return {ok:false,reason:'Sua horta comporta 10 plantações. Colha antes de plantar mais.'};
  const seed=`semente_${id}`;
  if(Number(u.inventory[seed]?.qty||0)<qty)return {ok:false,reason:`Faltam sementes. Use /comprar ${seed} ${qty}.`};
  u.inventory[seed].qty-=qty;
  for(let i=0;i<qty;i++)u.plots.push({id,readyAt:Date.now()+c.minutes*60000});
  save(db);return {ok:true,crop:c,qty};
}
export function sellMarketItem(jid,rawId,rawQty='1') {
  const db=load(),u=ensure(db,jid),id=normalizeMarketId(rawId),qty=Number(rawQty),item=DRAGON_SHOP.find(x=>x.id===id&&x.type==='food');
  if(!item)return {ok:false,reason:'Venda alimentos e itens do mercado pelo ID da /loja.'};
  if(!Number.isSafeInteger(qty)||qty<1||qty>999)return {ok:false,reason:'Quantidade: 1 a 999.'};
  if(Number(u.inventory[id]?.qty||0)<qty)return {ok:false,reason:'Você não possui essa quantidade.'};
  const reward=Math.floor(item.price*.6)*qty;u.inventory[id].qty-=qty;u.coins+=reward;save(db);return {ok:true,item,qty,reward,coins:u.coins};
}
export function useMarketItem(jid,rawId) {
  const db=load(),u=ensure(db,jid),id=normalizeMarketId(rawId),item=DRAGON_SHOP.find(x=>x.id===id&&x.type==='food');
  if(!item||!u.inventory[id]?.qty)return {ok:false,reason:'Escolha um alimento do seu /inventario.'};
  u.inventory[id].qty--;u.consumed=Number(u.consumed||0)+1;save(db);return {ok:true,item};
}

// Aceita apenas pares confirmados pelos metadados do próprio grupo.
export function linkEconomyIdentity(sender, participants=[]) {
  const member=participants.find(p=>[p.id,p.jid,p.phoneNumber,p.lid].includes(sender));
  if(!member)return;
  const ids=[...new Set([member.id,member.jid,member.phoneNumber,member.lid].filter(x=>typeof x==='string'&&/@(s\.whatsapp\.net|lid)$/.test(x)))];
  const primary=ids.find(x=>x.endsWith('@s.whatsapp.net'));
  if(!primary||ids.length<2)return;
  const db=load();db.aliases ||= {};
  if(ids.every(id=>db.aliases[id]===primary))return;
  const a=ensure(db,primary);
  for(const id of ids){
    if(id===primary||db.aliases[id]===primary)continue;
    const b=ensure(db,id);
    a.coins+=Number(b.coins||0);
    for(const [key,row] of Object.entries(b.inventory||{}))a.inventory[key]={...row,qty:Number(a.inventory[key]?.qty||0)+Number(row.qty||0)};
    a.dailyBoosts+=Number(b.dailyBoosts||0);
    if(Number(b.dailyAt)>Number(a.dailyAt)){a.dailyAt=b.dailyAt;a.dailyStreak=b.dailyStreak;}
    a.levelRewards={...b.levelRewards,...a.levelRewards};
    a.jobs ||= {};for(const [key,at] of Object.entries(b.jobs||{}))a.jobs[key]=Math.max(Number(a.jobs[key]||0),Number(at||0));
    const au=normalizeShopUsage(a),bu=normalizeShopUsage(b);au.count=Math.max(au.count,bu.count);
    a.plots=[...(a.plots||[]),...(b.plots||[])];
    const am=messageState(a),bm=messageState(b);
    am.count=Math.max(am.count,bm.count);am.claimed=[...new Set([...am.claimed,...bm.claimed])];am.lastAt=Math.max(am.lastAt,bm.lastAt);am.recentIds=[...new Set([...am.recentIds,...bm.recentIds])].slice(-100);
    delete db.users[id];db.aliases[id]=primary;
  }
  db.aliases[primary]=primary;save(db);
}
