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

function normalizeUser(jid = "") { return String(jid || "").trim(); }
function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ version: 1, players: {} }, null, 2), "utf8");
}
function readDb() {
  ensureDb();
  try { const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf8")); if (!parsed.players || typeof parsed.players !== "object") parsed.players = {}; return parsed; }
  catch { return { version: 1, players: {} }; }
}
function writeDb(db) { ensureDb(); const tmp = `${DB_PATH}.tmp`; fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8"); fs.renameSync(tmp, DB_PATH); }
function makePlayer(jid, name = "Aventureiro") {
  const now = new Date().toISOString();
  return { jid, name: String(name || "Aventureiro").slice(0, 40), createdAt: now, updatedAt: now, level: 1, xp: 0, xpNext: 100, gold: 100, class: null, classChosenAt: null, faction: null, dragonClass: null, awakening: { unlocked: false, started: false, completed: false, startedAt: null, completedAt: null }, stats: { ...BASE_STATS }, inventory: [{ id: "pocao_pequena", name: "Poção Pequena", icon: "🧪", qty: 2, type: "consumivel" }, { id: "pao_aventureiro", name: "Pão de Aventureiro", icon: "🥖", qty: 1, type: "consumivel" }], equipment: { weapon: null, armor: null, accessory: null } };
}
export function getDragonRpgPlayer(jid) { const db = readDb(); return db.players[normalizeUser(jid)] || null; }
export function createDragonRpgPlayer(jid, name) { const key = normalizeUser(jid); const db = readDb(); if (db.players[key]) return { created: false, player: db.players[key] }; const player = makePlayer(key, name); db.players[key] = player; writeDb(db); return { created: true, player }; }
function savePlayer(player) { const db = readDb(); player.updatedAt = new Date().toISOString(); db.players[normalizeUser(player.jid)] = player; writeDb(db); return player; }
function addStats(stats, bonus) { for (const key of Object.keys(BASE_STATS)) stats[key] = Number(stats[key] || 0) + Number(bonus?.[key] || 0); }

export function chooseHumanClass(jid, classKey) {
  const key = String(classKey || "").toLowerCase(); const klass = HUMAN_CLASSES[key];
  if (!klass) return { ok: false, reason: "invalid" }; const player = getDragonRpgPlayer(jid);
  if (!player) return { ok: false, reason: "missing" }; if (player.class) return { ok: false, reason: "already", player };
  player.class = key; player.classChosenAt = new Date().toISOString(); addStats(player.stats, klass.bonus); savePlayer(player); return { ok: true, player, klass };
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
  player.dragonClass = key; player.awakening.completed = true; player.awakening.completedAt = new Date().toISOString(); addStats(player.stats, klass.bonus); savePlayer(player); return { ok: true, player, klass };
}
export function getHumanClasses() { return HUMAN_CLASSES; }
export function getDragonClasses() { return DRAGON_CLASSES; }
export function getDragonFactions() { return FACTIONS; }
export function factionName(key) { return FACTIONS[key]?.name || key; }

function statLine(stats) { return `❤️ HP: *${stats.hp}*  🔷 Mana: *${stats.mana}*\n⚔️ ATK: *${stats.atk}*  🛡️ DEF: *${stats.def}*\n🔮 MAG: *${stats.mag}*  💨 AGI: *${stats.agi}*`; }
export function formatDragonRpgProfile(player, { socialLevel = 0, prefix = "/" } = {}) {
  const human = player.class ? HUMAN_CLASSES[player.class] : null; const faction = player.faction ? FACTIONS[player.faction] : null; const dragon = player.dragonClass ? DRAGON_CLASSES[player.dragonClass] : null;
  const unlock = Number(socialLevel) >= 20 ? "✅ Disponível" : `🔒 Level social ${socialLevel}/20`; const dragonState = dragon ? `${dragon.icon} *${dragon.name}*` : player.awakening?.started ? "🌋 Despertar iniciado" : "🐣 Ainda humano";
  return `╭═══❀══〔 🐉 *DRAGON RPG • PERFIL* 〕══❀═══╮\n┃ 👤 Nome: *${player.name}*\n┃ ⭐ Nível RPG: *${player.level}*\n┃ ✨ XP: *${player.xp}/${player.xpNext}*\n┃ 🪙 Ouro: *${player.gold}*\n┃\n┃ 🧭 Classe humana: ${human ? `${human.icon} *${human.name}*` : "❔ Não escolhida"}\n┃ 🐲 Forma dracônica: ${dragonState}\n┃ ${faction ? `${faction.icon} Facção: *${faction.name}*` : "🌸 Facção: *Nenhuma*"}\n┃\n┃ ${statLine(player.stats).replaceAll("\n", "\n┃ ")}\n┃\n┃ 🌟 Level social: *${socialLevel}*\n┃ 🐉 Despertar: *${unlock}*\n╰════════════════════════════════════╯\n\n🌸 Ajuda: *${prefix}rpgajuda*`;
}
export function formatDragonRpgInventory(player) {
  const rows = (player.inventory || []).filter(x => Number(x.qty) > 0).map((item, i) => `┃ ${i + 1}. ${item.icon || "📦"} *${item.name}* ×${item.qty}`);
  return `╭━━〔 🎒 *INVENTÁRIO DRAGON* 〕━━╮\n${rows.length ? rows.join("\n") : "┃ Inventário vazio."}\n┣━━━━━━━━━━━━━━━━━━━━━━\n┃ ⚔️ Arma: *${player.equipment?.weapon || "Nenhuma"}*\n┃ 🛡️ Armadura: *${player.equipment?.armor || "Nenhuma"}*\n┃ 💍 Acessório: *${player.equipment?.accessory || "Nenhum"}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}
export function formatRpgMenu(prefix = "/", socialLevel = 0, hasPlayer = false) {
  return `╭═══❀═══〔 🐉 〕═══❀═══╮\n┃       *DRAGON RPG • v2.0*\n╰═══❀═══〔 🌸 〕═══❀═══╯\n\n${hasPlayer ? "✅ Seu personagem Dragon está ativo." : "🌱 Você ainda não criou seu personagem."}\n\n╭━━〔 🌸 *COMEÇANDO* 〕━━╮\n┃ ${prefix}rpgcriar\n┃ ${prefix}rpgperfil\n┃ ${prefix}rpgajuda\n┃ ${prefix}rpgcomandos\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 ⚔️ *CLASSES* 〕━━╮\n┃ ${prefix}rpgclasses\n┃ ${prefix}classeinfo <classe>\n┃ ${prefix}rpgclasse <classe>\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🐲 *DESPERTAR DRACÔNICO* 〕━━╮\n┃ Requisito: *Level social 20+*\n┃ Seu Level social: *${socialLevel}*\n┃ ${prefix}despertardragao\n┃ ${prefix}rpgfaccao <facção>\n┃ ${prefix}rpgdragao <classe>\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🎒 *PERSONAGEM* 〕━━╮\n┃ ${prefix}rpginventario\n╰━━━━━━━━━━━━━━━━━━━╯`;
}
export function formatRpgCommands(prefix = "/") { return `╭━━〔 📜 *COMANDOS DRAGON RPG* 〕━━╮\n┃ ${prefix}dragonrpg\n┃ ${prefix}rpgcriar\n┃ ${prefix}rpgperfil\n┃ ${prefix}rpginventario\n┃ ${prefix}rpgclasses\n┃ ${prefix}classeinfo <classe>\n┃ ${prefix}rpgclasse <classe>\n┃ ${prefix}despertardragao\n┃ ${prefix}rpgfaccao <facção>\n┃ ${prefix}rpgdragao <classe>\n┃ ${prefix}rpgajuda [tema]\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`; }
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
  if (["1", "comecar", "começar", "inicio", "início"].includes(t)) return `🌱 *COMEÇANDO NO DRAGON RPG*\n\n1. Use *${prefix}rpgcriar*\n2. Veja *${prefix}rpgclasses*\n3. Escolha sua classe com *${prefix}rpgclasse <classe>*\n4. Consulte *${prefix}rpgperfil* e *${prefix}rpginventario*\n5. Ao alcançar Level social 20, use *${prefix}despertardragao*.`;
  if (["2", "classes", "humanas"].includes(t)) return `⚔️ *CLASSES HUMANAS*\n\nSão a primeira especialização do personagem. A escolha é permanente nesta versão. Veja todas em *${prefix}rpgclasses* e detalhes com *${prefix}classeinfo <classe>*.`;
  if (["3", "dragao", "dragão", "dragoes", "dragões"].includes(t)) return `🐉 *CLASSES DRACÔNICAS*\n\nO Level do RPG e o Level social são diferentes. Para despertar como dragão você precisa ter *Level social 20+*, iniciar *${prefix}despertardragao*, escolher uma facção e então uma linhagem compatível.`;
  if (["4", "faccoes", "facções", "faccao", "facção"].includes(t)) return `🏰 *FACÇÕES DRACÔNICAS*\n\n🔥 Caos — Chamas, Abissal e Carmesim\n⚖️ Harmonia — Aquático\n👁️ Espectadores — Arcano\n⚡ Independente — Elétrico\n\nUse *${prefix}rpgfaccao <facção>* após iniciar o Despertar.`;
  if (["5", "atributos", "status"].includes(t)) return `📊 *ATRIBUTOS*\n\n❤️ HP: vida\n🔷 Mana: energia mágica\n⚔️ ATK: ataque físico\n🛡️ DEF: defesa\n🔮 MAG: poder mágico\n💨 AGI: velocidade e esquiva\n\nClasses humanas e dracônicas alteram esses valores.`;
  if (["6", "nivel", "nível", "xp"].includes(t)) return `⭐ *DOIS SISTEMAS DE NÍVEL*\n\n🌸 *Level social:* já existente no Kobayashi Bot e sobe pela atividade. Ele libera o Despertar no nível 20.\n🐉 *Nível RPG:* pertence somente ao Dragon RPG e será usado em batalhas, missões e progressão do personagem.`;
  return `╭━━〔 📖 *DRAGON RPG • AJUDA* 〕━━╮\n┃ 1️⃣ Começando no RPG\n┃ 2️⃣ Classes humanas\n┃ 3️⃣ Classes de dragões\n┃ 4️⃣ Facções dracônicas\n┃ 5️⃣ Atributos e status\n┃ 6️⃣ Níveis e XP\n┃ 📜 ${prefix}rpgcomandos\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nUse *${prefix}rpgajuda 1* até *${prefix}rpgajuda 6*.`;
}
