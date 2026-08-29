import fs from "node:fs";
import path from "node:path";

const DB_FILE = path.join(process.cwd(), "files", "database", "dragon-social.json");
const DAY = 24 * 60 * 60 * 1000;
const ANTIFARM_FILE = path.join(process.cwd(), "files", "database", "dragon-antifarm.json");
const ANTIFARM_DAILY_ACTION_LIMIT = 20;
const ANTIFARM_DAILY_COIN_LIMIT = 250;


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
    return { users: data?.users || {} };
  } catch {
    return { users: {} };
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function ensure(db, jid) {
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
  return db.users[jid];
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
  const base = 80 + Math.floor(Math.random() * 41);
  const levelBonus = Math.floor((safeLevel - 1) * 3);

  let boostBonus = 0;
  let boostUsed = false;
  if (Number(u.dailyBoosts || 0) > 0) {
    boostBonus = 75;
    u.dailyBoosts -= 1;
    boostUsed = true;
  }

  const reward = base + levelBonus + boostBonus;

  u.coins += reward;
  u.dailyAt = Date.now();
  save(db);
  return {
    ok: true,
    reward,
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

  const reward = 20 + (level * 5);
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
  if (a.coins < amount) return { ok: false, reason: "Você não tem Dragon Coins suficientes." };
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

  const requestedReward = Math.max(0, Math.floor(Number(reward) || 0));
  const antiFarm = groupJid
    ? applyAntiFarmReward(groupJid, jid, requestedReward)
    : { allowed: true, reward: requestedReward, blocked: false };

  const grantedReward = antiFarm.allowed ? Math.max(0, Number(antiFarm.reward || 0)) : 0;
  u.coins += grantedReward;
  save(db);

  return {
    ...JSON.parse(JSON.stringify(u)),
    reward: grantedReward,
    requestedReward,
    antiFarm
  };
}

export function recordSocialInteraction(from, to, groupJid = null) {
  const db = load();
  const a = ensure(db, from);
  ensure(db, to);
  a.socialInteractions++;

  const requestedReward = 2;
  const antiFarm = groupJid
    ? applyAntiFarmReward(groupJid, from, requestedReward)
    : { allowed: true, reward: requestedReward, blocked: false };

  const grantedReward = antiFarm.allowed ? Math.max(0, Number(antiFarm.reward || 0)) : 0;
  a.coins += grantedReward;
  save(db);

  return {
    ...JSON.parse(JSON.stringify(a)),
    reward: grantedReward,
    requestedReward,
    antiFarm
  };
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
  db.groups[groupJid] ||= {
    enabled: true,
    users: {},
    updatedAt: Date.now()
  };
  db.groups[groupJid].users ||= {};
  return db.groups[groupJid];
}

function normalizeAntiFarmUser(group, userJid) {
  const key = getShopDayKey();
  group.users[userJid] ||= {
    key,
    rewardedActions: 0,
    rewardedCoins: 0,
    lastRewardAt: 0
  };

  const row = group.users[userJid];
  if (row.key !== key) {
    row.key = key;
    row.rewardedActions = 0;
    row.rewardedCoins = 0;
    row.lastRewardAt = 0;
  }

  row.rewardedActions = Math.max(0, Number(row.rewardedActions || 0));
  row.rewardedCoins = Math.max(0, Number(row.rewardedCoins || 0));
  return row;
}

export function getAntiFarmConfig(groupJid) {
  if (!groupJid) {
    return {
      enabled: false,
      actionLimit: ANTIFARM_DAILY_ACTION_LIMIT,
      coinLimit: ANTIFARM_DAILY_COIN_LIMIT,
      resetsAt: "06:00"
    };
  }

  const db = loadAntiFarm();
  const group = ensureAntiFarmGroup(db, groupJid);
  saveAntiFarm(db);

  return {
    enabled: group.enabled !== false,
    actionLimit: ANTIFARM_DAILY_ACTION_LIMIT,
    coinLimit: ANTIFARM_DAILY_COIN_LIMIT,
    resetsAt: "06:00"
  };
}

export function setAntiFarmEnabled(groupJid, enabled) {
  if (!groupJid) return false;
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
    rewardedActions: row.rewardedActions,
    rewardedCoins: row.rewardedCoins,
    actionLimit: ANTIFARM_DAILY_ACTION_LIMIT,
    coinLimit: ANTIFARM_DAILY_COIN_LIMIT,
    actionsRemaining: Math.max(0, ANTIFARM_DAILY_ACTION_LIMIT - row.rewardedActions),
    coinsRemaining: Math.max(0, ANTIFARM_DAILY_COIN_LIMIT - row.rewardedCoins),
    resetsAt: "06:00"
  };
}

export function applyAntiFarmReward(groupJid, userJid, requestedCoins = 0) {
  const amount = Math.max(0, Math.floor(Number(requestedCoins) || 0));

  if (!groupJid || !userJid || amount <= 0) {
    return { allowed: true, reward: amount, blocked: false };
  }

  const db = loadAntiFarm();
  const group = ensureAntiFarmGroup(db, groupJid);
  const row = normalizeAntiFarmUser(group, userJid);

  if (group.enabled === false) {
    saveAntiFarm(db);
    return {
      allowed: true,
      reward: amount,
      blocked: false,
      antiFarmDisabled: true
    };
  }

  if (
    row.rewardedActions >= ANTIFARM_DAILY_ACTION_LIMIT ||
    row.rewardedCoins >= ANTIFARM_DAILY_COIN_LIMIT
  ) {
    saveAntiFarm(db);
    return {
      allowed: false,
      reward: 0,
      blocked: true,
      rewardedActions: row.rewardedActions,
      rewardedCoins: row.rewardedCoins,
      actionsRemaining: 0,
      coinsRemaining: 0,
      resetsAt: "06:00"
    };
  }

  const remainingCoins = Math.max(0, ANTIFARM_DAILY_COIN_LIMIT - row.rewardedCoins);
  const granted = Math.min(amount, remainingCoins);

  if (granted <= 0) {
    saveAntiFarm(db);
    return {
      allowed: false,
      reward: 0,
      blocked: true,
      rewardedActions: row.rewardedActions,
      rewardedCoins: row.rewardedCoins,
      actionsRemaining: Math.max(0, ANTIFARM_DAILY_ACTION_LIMIT - row.rewardedActions),
      coinsRemaining: 0,
      resetsAt: "06:00"
    };
  }

  row.rewardedActions += 1;
  row.rewardedCoins += granted;
  row.lastRewardAt = Date.now();
  saveAntiFarm(db);

  return {
    allowed: true,
    reward: granted,
    requestedReward: amount,
    limited: granted < amount,
    blocked: false,
    rewardedActions: row.rewardedActions,
    rewardedCoins: row.rewardedCoins,
    actionsRemaining: Math.max(0, ANTIFARM_DAILY_ACTION_LIMIT - row.rewardedActions),
    coinsRemaining: Math.max(0, ANTIFARM_DAILY_COIN_LIMIT - row.rewardedCoins),
    resetsAt: "06:00"
  };
}

export const DRAGON_SHOP = [
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
    description: "Adiciona +75 Dragon Coins no próximo /daily."
  },
  {
    id: "caixa_escamas",
    icon: "📦",
    name: "Caixa de Escamas",
    price: 200,
    type: "box",
    description: "Abra para receber entre 80 e 400 Dragon Coins."
  }
];

export function getShopItems() {
  return DRAGON_SHOP.map(x => ({ ...x }));
}

export function buyShopItem(jid, itemId) {
  const db = load();
  const u = ensure(db, jid);
  const usage = normalizeShopUsage(u);
  const item = DRAGON_SHOP.find(x => x.id === String(itemId || "").toLowerCase());

  if (!item) return {
    ok: false,
    reason: "Item não encontrado.",
    shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count)
  };

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

  if (u.coins < item.price) return {
    ok: false,
    reason: "Dragon Coins insuficientes.",
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

  u.coins -= item.price;

  if (item.type === "title") {
    u.inventory[item.id] = { qty: 1, purchasedAt: Date.now() };
  } else if (item.type === "daily_boost") {
    u.dailyBoosts = Number(u.dailyBoosts || 0) + 1;
    u.inventory[item.id] = {
      qty: Number(u.inventory[item.id]?.qty || 0) + 1,
      purchasedAt: Date.now()
    };
  } else if (item.type === "box") {
    u.inventory[item.id] = {
      qty: Number(u.inventory[item.id]?.qty || 0) + 1,
      purchasedAt: Date.now()
    };
  }

  usage.count += 1;
  save(db);

  return {
    ok: true,
    item,
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
  const item = DRAGON_SHOP.find(x => x.id === String(itemId || "").toLowerCase() && x.type === "title");
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

  const reward = 80 + Math.floor(Math.random() * 321);
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
  { id:"first_coin", icon:"🪙", name:"Primeira Escama", description:"Tenha pelo menos 1 Dragon Coin.", test:u=>u.coins>=1 },
  { id:"rich_500", icon:"💰", name:"Tesouro do Dragão", description:"Tenha 500 Dragon Coins.", test:u=>u.coins>=500 },
  { id:"rich_2000", icon:"👑", name:"Cofre Imperial", description:"Tenha 2.000 Dragon Coins.", test:u=>u.coins>=2000 },
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
