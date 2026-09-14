/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const DB_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x64\x72\x61\x67\x6f\x6e\x2d\x73\x6f\x63\x69\x61\x6c\x2e\x6a\x73\x6f\x6e");
const DAY = 24 * 60 * 60 * 1000;
const ANTIFARM_FILE = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x64\x72\x61\x67\x6f\x6e\x2d\x61\x6e\x74\x69\x66\x61\x72\x6d\x2e\x6a\x73\x6f\x6e");
const ANTIFARM_ACTION_LIMIT = 20;
const ANTIFARM_COIN_LIMIT = 250;

function loadAntiFarm() {
  try {
    if (!fs.existsSync(ANTIFARM_FILE)) return { groups: {} };
    const data = JSON.parse(fs.readFileSync(ANTIFARM_FILE, "\x75\x74\x66\x38"));
    return { groups: data?.groups || {} };
  } catch {
    return { groups: {} };
  }
}

function saveAntiFarm(db) {
  fs.mkdirSync(path.dirname(ANTIFARM_FILE), { recursive: true });
  fs.writeFileSync(ANTIFARM_FILE, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
}

function load() {
  try {
    if (!fs.existsSync(DB_FILE)) return { users: {} };
    const data = JSON.parse(fs.readFileSync(DB_FILE, "\x75\x74\x66\x38"));
    return { users: data?.users || {} };
  } catch {
    return { users: {} };
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
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
    const boostItem = u.inventory?.boost_daily;
    if (boostItem) {
      boostItem.qty = Math.max(0, Number(boostItem.qty || 0) - 1);
      if (boostItem.qty <= 0) delete u.inventory.boost_daily;
    }
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
  if (amount < 1) return { ok: false, reason: "\x4f\x20\x76\x61\x6c\x6f\x72\x20\x70\x72\x65\x63\x69\x73\x61\x20\x73\x65\x72\x20\x6d\x61\x69\x6f\x72\x20\x71\x75\x65\x20\x7a\x65\x72\x6f\x2e" };
  if (amount > 1000000) return { ok: false, reason: "\x56\x61\x6c\x6f\x72\x20\x61\x63\x69\x6d\x61\x20\x64\x6f\x20\x6c\x69\x6d\x69\x74\x65\x20\x70\x6f\x72\x20\x74\x72\x61\x6e\x73\x66\x65\x72\xea\x6e\x63\x69\x61\x2e" };
  const db = load();
  const a = ensure(db, from);
  const b = ensure(db, to);
  if (a.coins < amount) return { ok: false, reason: "\x56\x6f\x63\xea\x20\x6e\xe3\x6f\x20\x74\x65\x6d\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x69\x6e\x73\x20\x73\x75\x66\x69\x63\x69\x65\x6e\x74\x65\x73\x2e" };
  a.coins -= amount;
  b.coins += amount;
  a.transfersSent++;
  b.transfersReceived++;
  save(db);
  return { ok: true, amount, fromCoins: a.coins, toCoins: b.coins };
}

export function recordGame(jid, result = "\x70\x6c\x61\x79", reward = 0, groupJid = null) {
  const db = load();
  const u = ensure(db, jid);
  u.games.played++;
  if (result === "\x77\x69\x6e") u.games.wins++;
  if (result === "\x6c\x6f\x73\x73") u.games.losses++;

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
  const parts = new Intl.DateTimeFormat("\x65\x6e\x2d\x43\x41", {
    timeZone: "\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f",
    year: "\x6e\x75\x6d\x65\x72\x69\x63",
    month: "\x32\x2d\x64\x69\x67\x69\x74",
    day: "\x32\x2d\x64\x69\x67\x69\x74",
    hour: "\x32\x2d\x64\x69\x67\x69\x74",
    hourCycle: "\x68\x32\x33"
  }).formatToParts(now);

  const out = {};
  for (const p of parts) {
    if (p.type !== "\x6c\x69\x74\x65\x72\x61\x6c") out[p.type] = p.value;
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
    resetsAt: "\x30\x36\x3a\x30\x30",
    timeZone: "\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f"
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
    resetsAt: "\x30\x36\x3a\x30\x30"
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
    resetsAt: "\x30\x36\x3a\x30\x30"
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
    return { allowed: false, reward: 0, blocked: true, resetsAt: "\x30\x36\x3a\x30\x30" };
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
    resetsAt: "\x30\x36\x3a\x30\x30"
  };
}

export const DRAGON_SHOP = [
  {
    id: "\x74\x69\x74\x75\x6c\x6f\x5f\x6c\x75\x6e\x61\x72",
    icon: "🌙",
    name: "\x54\xed\x74\x75\x6c\x6f\x20\x44\x72\x61\x67\xe3\x6f\x20\x4c\x75\x6e\x61\x72",
    price: 450,
    type: "\x74\x69\x74\x6c\x65",
    value: "\ud83c\x20\x44\x72\x61\x67\xe3\x6f\x20\x4c\x75\x6e\x61\x72",
    description: "\x54\xed\x74\x75\x6c\x6f\x20\x63\x6f\x73\x6d\xe9\x74\x69\x63\x6f\x20\x70\x61\x72\x61\x20\x6f\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x61\x72\x64\x2e"
  },
  {
    id: "\x74\x69\x74\x75\x6c\x6f\x5f\x63\x61\x72\x6d\x65\x73\x69\x6d",
    icon: "🔥",
    name: "\x54\xed\x74\x75\x6c\x6f\x20\x44\x72\x61\x67\xe3\x6f\x20\x43\x61\x72\x6d\x65\x73\x69\x6d",
    price: 700,
    type: "\x74\x69\x74\x6c\x65",
    value: "\ud83d\x20\x44\x72\x61\x67\xe3\x6f\x20\x43\x61\x72\x6d\x65\x73\x69\x6d",
    description: "\x54\xed\x74\x75\x6c\x6f\x20\x63\x6f\x73\x6d\xe9\x74\x69\x63\x6f\x20\x70\x61\x72\x61\x20\x6f\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x61\x72\x64\x2e"
  },
  {
    id: "\x74\x69\x74\x75\x6c\x6f\x5f\x63\x6f\x73\x6d\x69\x63\x6f",
    icon: "🌌",
    name: "\x54\xed\x74\x75\x6c\x6f\x20\x44\x72\x61\x67\xe3\x6f\x20\x43\xf3\x73\x6d\x69\x63\x6f",
    price: 1100,
    type: "\x74\x69\x74\x6c\x65",
    value: "\ud83c\x20\x44\x72\x61\x67\xe3\x6f\x20\x43\xf3\x73\x6d\x69\x63\x6f",
    description: "\x54\xed\x74\x75\x6c\x6f\x20\x63\x6f\x73\x6d\xe9\x74\x69\x63\x6f\x20\x72\x61\x72\x6f\x20\x70\x61\x72\x61\x20\x6f\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x61\x72\x64\x2e"
  },
  {
    id: "\x62\x6f\x6f\x73\x74\x5f\x64\x61\x69\x6c\x79",
    icon: "🎁",
    name: "\x42\x6f\x6f\x73\x74\x20\x44\x61\x69\x6c\x79\x20\x2b\x37\x35",
    price: 300,
    type: "\x64\x61\x69\x6c\x79\x5f\x62\x6f\x6f\x73\x74",
    value: 75,
    description: "\x41\x64\x69\x63\x69\x6f\x6e\x61\x20\x2b\x37\x35\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x69\x6e\x73\x20\x6e\x6f\x20\x70\x72\xf3\x78\x69\x6d\x6f\x20\x2f\x64\x61\x69\x6c\x79\x2e"
  },
  {
    id: "\x63\x61\x69\x78\x61\x5f\x65\x73\x63\x61\x6d\x61\x73",
    icon: "📦",
    name: "\x43\x61\x69\x78\x61\x20\x64\x65\x20\x45\x73\x63\x61\x6d\x61\x73",
    price: 200,
    type: "\x62\x6f\x78",
    description: "\x41\x62\x72\x61\x20\x70\x61\x72\x61\x20\x72\x65\x63\x65\x62\x65\x72\x20\x65\x6e\x74\x72\x65\x20\x38\x30\x20\x65\x20\x33\x30\x30\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x69\x6e\x73\x2e"
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
    reason: "\x49\x74\x65\x6d\x20\x6e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x6f\x2e",
    shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count)
  };

  if (usage.count >= SHOP_DAILY_LIMIT) {
    save(db);
    return {
      ok: false,
      reason: "\x56\x6f\x63\xea\x20\x61\x74\x69\x6e\x67\x69\x75\x20\x6f\x20\x6c\x69\x6d\x69\x74\x65\x20\x64\x69\xe1\x72\x69\x6f\x20\x64\x65\x20\x35\x20\x63\x6f\x6d\x70\x72\x61\x73\x2e\x20\x41\x20\x6c\x6f\x6a\x61\x20\x6c\x69\x62\x65\x72\x61\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x20\xe0\x73\x20\x30\x36\x3a\x30\x30\x2e",
      coins: u.coins,
      shopRemaining: 0,
      shopLimitReached: true
    };
  }

  if (u.coins < item.price) return {
    ok: false,
    reason: "\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x69\x6e\x73\x20\x69\x6e\x73\x75\x66\x69\x63\x69\x65\x6e\x74\x65\x73\x2e",
    coins: u.coins,
    shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count)
  };

  if (item.type === "\x74\x69\x74\x6c\x65" && u.inventory[item.id]) {
    return {
      ok: false,
      reason: "\x56\x6f\x63\xea\x20\x6a\xe1\x20\x70\x6f\x73\x73\x75\x69\x20\x65\x73\x73\x65\x20\x74\xed\x74\x75\x6c\x6f\x2e",
      coins: u.coins,
      shopRemaining: Math.max(0, SHOP_DAILY_LIMIT - usage.count)
    };
  }

  u.coins -= item.price;

  if (item.type === "\x74\x69\x74\x6c\x65") {
    u.inventory[item.id] = { qty: 1, purchasedAt: Date.now() };
  } else if (item.type === "\x64\x61\x69\x6c\x79\x5f\x62\x6f\x6f\x73\x74") {
    u.dailyBoosts = Number(u.dailyBoosts || 0) + 1;
    u.inventory[item.id] = {
      qty: Number(u.inventory[item.id]?.qty || 0) + 1,
      purchasedAt: Date.now()
    };
  } else if (item.type === "\x62\x6f\x78") {
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
      active: item.type === "\x74\x69\x74\x6c\x65" && u.activeTitle === item.id
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
  const item = DRAGON_SHOP.find(x => x.id === String(itemId || "").toLowerCase() && x.type === "\x74\x69\x74\x6c\x65");
  if (!item) return { ok: false, reason: "\x54\xed\x74\x75\x6c\x6f\x20\x6e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x6f\x2e" };
  if (!u.inventory?.[item.id]?.qty) return { ok: false, reason: "\x56\x6f\x63\xea\x20\x61\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x63\x6f\x6d\x70\x72\x6f\x75\x20\x65\x73\x73\x65\x20\x74\xed\x74\x75\x6c\x6f\x2e" };

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
  const boxId = "\x63\x61\x69\x78\x61\x5f\x65\x73\x63\x61\x6d\x61\x73";
  const qty = Number(u.inventory?.[boxId]?.qty || 0);
  if (qty < 1) return { ok: false, reason: "\x56\x6f\x63\xea\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x75\x6d\x61\x20\x43\x61\x69\x78\x61\x20\x64\x65\x20\x45\x73\x63\x61\x6d\x61\x73\x2e" };

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
  const item = DRAGON_SHOP.find(x => x.id === u.activeTitle && x.type === "\x74\x69\x74\x6c\x65");
  return item?.value || "";
}

const ACHIEVEMENTS = [
  { id:"\x66\x69\x72\x73\x74\x5f\x63\x6f\x69\x6e", icon:"🪙", name:"\x50\x72\x69\x6d\x65\x69\x72\x61\x20\x45\x73\x63\x61\x6d\x61", description:"\x54\x65\x6e\x68\x61\x20\x70\x65\x6c\x6f\x20\x6d\x65\x6e\x6f\x73\x20\x31\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x69\x6e\x2e", test:u=>u.coins>=1 },
  { id:"\x72\x69\x63\x68\x5f\x35\x30\x30", icon:"💰", name:"\x54\x65\x73\x6f\x75\x72\x6f\x20\x64\x6f\x20\x44\x72\x61\x67\xe3\x6f", description:"\x54\x65\x6e\x68\x61\x20\x35\x30\x30\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x69\x6e\x73\x2e", test:u=>u.coins>=500 },
  { id:"\x72\x69\x63\x68\x5f\x32\x30\x30\x30", icon:"👑", name:"\x43\x6f\x66\x72\x65\x20\x49\x6d\x70\x65\x72\x69\x61\x6c", description:"\x54\x65\x6e\x68\x61\x20\x32\x2e\x30\x30\x30\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x69\x6e\x73\x2e", test:u=>u.coins>=2000 },
  { id:"\x67\x61\x6d\x65\x73\x5f\x31\x30", icon:"🎮", name:"\x4a\x6f\x67\x61\x64\x6f\x72\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x6f", description:"\x4a\x6f\x67\x75\x65\x20\x31\x30\x20\x70\x61\x72\x74\x69\x64\x61\x73\x2e", test:u=>u.games.played>=10 },
  { id:"\x77\x69\x6e\x73\x5f\x31\x30", icon:"🏆", name:"\x43\x61\xe7\x61\x64\x6f\x72\x20\x64\x65\x20\x56\x69\x74\xf3\x72\x69\x61\x73", description:"\x56\x65\x6e\xe7\x61\x20\x31\x30\x20\x70\x61\x72\x74\x69\x64\x61\x73\x2e", test:u=>u.games.wins>=10 },
  { id:"\x73\x6f\x63\x69\x61\x6c\x5f\x31\x30", icon:"🤝", name:"\x44\x72\x61\x67\xe3\x6f\x20\x53\x6f\x63\x69\xe1\x76\x65\x6c", description:"\x46\x61\xe7\x61\x20\x31\x30\x20\x69\x6e\x74\x65\x72\x61\xe7\xf5\x65\x73\x20\x73\x6f\x63\x69\x61\x69\x73\x2e", test:u=>u.socialInteractions>=10 },
  { id:"\x73\x6f\x63\x69\x61\x6c\x5f\x35\x30", icon:"🌸", name:"\x43\x6f\x72\x61\xe7\xe3\x6f\x20\x64\x61\x20\x43\x6f\x6d\x75\x6e\x69\x64\x61\x64\x65", description:"\x46\x61\xe7\x61\x20\x35\x30\x20\x69\x6e\x74\x65\x72\x61\xe7\xf5\x65\x73\x20\x73\x6f\x63\x69\x61\x69\x73\x2e", test:u=>u.socialInteractions>=50 },
  { id:"\x74\x72\x61\x6e\x73\x66\x65\x72", icon:"🎁", name:"\x47\x65\x6e\x65\x72\x6f\x73\x69\x64\x61\x64\x65", description:"\x46\x61\xe7\x61\x20\x75\x6d\x61\x20\x74\x72\x61\x6e\x73\x66\x65\x72\xea\x6e\x63\x69\x61\x2e", test:u=>u.transfersSent>=1 }
];

export function getAchievements(jid, level = 1) {
  const u = getSocialProfile(jid);
  const safeLevel = Math.max(1, Math.min(50, Number(level) || 1));
  const levelAchievements = [
    { id:"\x6c\x65\x76\x65\x6c\x5f\x31\x30", icon:"🐣", name:"\x46\x69\x6c\x68\x6f\x74\x65\x20\x56\x65\x74\x65\x72\x61\x6e\x6f", description:"\x41\x6c\x63\x61\x6e\x63\x65\x20\x6f\x20\x6e\xed\x76\x65\x6c\x20\x31\x30\x2e", unlocked:safeLevel>=10 },
    { id:"\x6c\x65\x76\x65\x6c\x5f\x32\x35", icon:"⚡", name:"\x44\x72\x61\x67\xe3\x6f\x20\x41\x73\x63\x65\x6e\x64\x65\x6e\x74\x65", description:"\x41\x6c\x63\x61\x6e\x63\x65\x20\x6f\x20\x6e\xed\x76\x65\x6c\x20\x32\x35\x2e", unlocked:safeLevel>=25 },
    { id:"\x6c\x65\x76\x65\x6c\x5f\x35\x30", icon:"🐲", name:"\x44\x72\x61\x67\xe3\x6f\x20\x50\x72\x69\x6d\x6f\x72\x64\x69\x61\x6c", description:"\x41\x6c\x63\x61\x6e\x63\x65\x20\x6f\x20\x6e\xed\x76\x65\x6c\x20\x35\x30\x2e", unlocked:safeLevel>=50 }
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
