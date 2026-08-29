import fs from "node:fs";
import path from "node:path";

const DB_FILE = path.join(process.cwd(), "files", "database", "dragon-social.json");
const DAY = 24 * 60 * 60 * 1000;

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
    createdAt: Date.now()
  };
  db.users[jid].games ||= { played: 0, wins: 0, losses: 0 };
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
  const reward = base + levelBonus;

  u.coins += reward;
  u.dailyAt = Date.now();
  save(db);
  return { ok: true, reward, base, levelBonus, level: safeLevel, coins: u.coins };
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

export function recordGame(jid, result = "play", reward = 0) {
  const db = load();
  const u = ensure(db, jid);
  u.games.played++;
  if (result === "win") u.games.wins++;
  if (result === "loss") u.games.losses++;
  u.coins += Math.max(0, Math.floor(Number(reward) || 0));
  save(db);
  return JSON.parse(JSON.stringify(u));
}

export function recordSocialInteraction(from, to) {
  const db = load();
  const a = ensure(db, from);
  ensure(db, to);
  a.socialInteractions++;
  a.coins += 2;
  save(db);
  return JSON.parse(JSON.stringify(a));
}

export function getCoinRank(limit = 10) {
  const db = load();
  return Object.entries(db.users || {})
    .map(([jid,u]) => ({ jid, coins: Number(u?.coins || 0) }))
    .filter(x => x.coins > 0)
    .sort((a,b)=>b.coins-a.coins)
    .slice(0, Math.max(1, Math.min(50, Number(limit)||10)));
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
