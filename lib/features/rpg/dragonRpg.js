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

const ADVANCED_HUMAN_CLASSES = {
 necromante:{name:"Necromante",icon:"☠️",role:"Magia sombria e controle",desc:"Classe avançada conquistada em combate.",requires:{level:10,kills:25,baseClasses:["mago","curandeiro"]},bonus:{hp:10,mana:45,atk:0,def:2,mag:12,agi:0}},
 assassino:{name:"Assassino",icon:"🥷",role:"Furtividade e crítico",desc:"Especialização de combatentes ágeis.",requires:{level:12,kills:35,baseClasses:["arqueiro","guerreiro"],stealth:15},bonus:{hp:5,mana:10,atk:8,def:0,mag:0,agi:10}},
 paladino:{name:"Paladino",icon:"🛡️✨",role:"Defesa e magia",desc:"Guerreiro sagrado resistente.",requires:{level:15,kills:40,baseClasses:["escudeiro","curandeiro"],defense:20},bonus:{hp:30,mana:20,atk:5,def:10,mag:5,agi:0}},
 feiticeiro:{name:"Feiticeiro",icon:"🪄",role:"Magia ofensiva avançada",desc:"Evolução de alto poder arcano.",requires:{level:14,kills:30,baseClasses:["mago"],magic:22},bonus:{hp:0,mana:55,atk:0,def:0,mag:15,agi:2}},
 berserker:{name:"Berserker",icon:"🪓",role:"Dano extremo com sacrifício de HP",desc:"Converte a própria vitalidade em força brutal.",requires:{level:16,kills:45,baseClasses:["guerreiro"],combat:30},bonus:{hp:25,mana:5,atk:16,def:2,mag:0,agi:3}},
 druida:{name:"Druida",icon:"🍃",role:"Cura, natureza e sobrevivência",desc:"Controla energia natural para curar e atacar.",requires:{level:15,kills:35,baseClasses:["curandeiro","mago"],survival:12},bonus:{hp:20,mana:40,atk:1,def:5,mag:11,agi:2}},
 sentinela:{name:"Sentinela",icon:"🏹✨",role:"Precisão, velocidade e defesa",desc:"Especialista em ataques precisos e sobrevivência.",requires:{level:16,kills:45,baseClasses:["arqueiro","escudeiro"],stealth:12},bonus:{hp:18,mana:18,atk:10,def:7,mag:2,agi:12}},
 cavaleiro_runa:{name:"Cavaleiro Rúnico",icon:"⚔️🔷",role:"Combate híbrido físico e mágico",desc:"Grava runas na arma e mistura força com magia.",requires:{level:18,kills:55,baseClasses:["guerreiro","mago"],magic:18},bonus:{hp:25,mana:30,atk:11,def:7,mag:10,agi:3}}
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


const AWAKENING_BOSS={id:"guardiao_despertar",name:"Guardião do Despertar",icon:"🐲",level:20,hp:850,atk:50,def:30,mag:44,agi:22,xp:800,gold:[500,700],drops:[]};
const DRAGON_SKILLS={
 chamas:{name:"Inferno Dracônico",icon:"🔥",cost:20,mag:true,mult:3.10},
 abissal:{name:"Ruína Abissal",icon:"🌑",cost:22,mag:true,mult:3.00},
 carmesim:{name:"Fúria Dracônica",icon:"❤️‍🔥",cost:20,mag:false,mult:3.20},
 aquatico:{name:"Maré Celestial",icon:"🌊",cost:18,mag:true,mult:2.90},
 arcano:{name:"Eclipse Arcano",icon:"🌌",cost:24,mag:true,mult:3.35},
 eletrico:{name:"Trovão Celestial",icon:"⚡",cost:19,mag:true,mult:3.00}
};
const RPG_ITEMS = {
  lamina_gelo:{"id": "lamina_gelo", "name": "Lâmina de Gelo", "icon": "❄️", "type": "weapon", "rarity": "Épico", "price": 1800, "minLevel": 18, "bonus": {"atk": 22, "agi": 5}},
  cajado_tempestade:{"id": "cajado_tempestade", "name": "Cajado da Tempestade", "icon": "⚡", "type": "weapon", "rarity": "Épico", "price": 2400, "minLevel": 22, "bonus": {"mag": 28, "mana": 45}},
  arco_lunar:{"id": "arco_lunar", "name": "Arco Lunar", "icon": "🌙", "type": "weapon", "rarity": "Épico", "price": 2300, "minLevel": 22, "bonus": {"atk": 22, "agi": 16}},
  manto_abissal:{"id": "manto_abissal", "name": "Manto Abissal", "icon": "🌑", "type": "armor", "rarity": "Épico", "price": 3200, "minLevel": 28, "bonus": {"def": 22, "mana": 65, "mag": 10}},
  armadura_glacial:{"id": "armadura_glacial", "name": "Armadura Glacial", "icon": "🧊", "type": "armor", "rarity": "Épico", "price": 3500, "minLevel": 30, "bonus": {"hp": 100, "def": 28}},
  anel_reserva:{"id": "anel_reserva", "name": "Anel de Reserva Arcana", "icon": "💍", "type": "accessory", "rarity": "Épico", "price": 1900, "minLevel": 18, "bonus": {"mana": 65, "mag": 8}},
  amuleto_guardiao:{"id": "amuleto_guardiao", "name": "Amuleto do Guardião", "icon": "🛡️", "type": "accessory", "rarity": "Épico", "price": 2600, "minLevel": 25, "bonus": {"hp": 70, "def": 15}},
  lamina_ancestral:{"id": "lamina_ancestral", "name": "Lâmina Ancestral", "icon": "🐉", "type": "weapon", "rarity": "Dracônico", "price": 7200, "minLevel": 50, "bonus": {"atk": 48, "mag": 15, "mana": 40}, "dragonRequired": true},
  coroa_astral:{"id": "coroa_astral", "name": "Coroa Astral", "icon": "👑", "type": "accessory", "rarity": "Dracônico", "price": 8500, "minLevel": 60, "bonus": {"mana": 120, "mag": 25, "agi": 12}, "dragonRequired": true},
  armadura_soberano:{"id": "armadura_soberano", "name": "Armadura do Soberano", "icon": "🔱", "type": "armor", "rarity": "Dracônico", "price": 11000, "minLevel": 75, "bonus": {"hp": 180, "def": 48, "mana": 60}, "dragonRequired": true},
  pocao_mana_maior:{"id": "pocao_mana_maior", "name": "Poção Maior de Mana", "icon": "🔷", "type": "consumivel", "rarity": "Raro", "price": 160, "minLevel": 15, "effect": {"mana": 140}},
  elixir_arcano:{"id": "elixir_arcano", "name": "Elixir Arcano", "icon": "💎", "type": "consumivel", "rarity": "Raro", "price": 450, "minLevel": 35, "effect": {"mana": 320}},
  pocao_vida_maior:{"id": "pocao_vida_maior", "name": "Poção Maior de Vida", "icon": "❤️", "type": "consumivel", "rarity": "Raro", "price": 180, "minLevel": 15, "effect": {"heal": 180}},
  banquete_dragao:{"id": "banquete_dragao", "name": "Banquete Dracônico", "icon": "🍱", "type": "consumivel", "rarity": "Raro", "price": 650, "minLevel": 45, "effect": {"heal": 260, "mana": 180}},
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
  pocao_pequena:{id:"pocao_pequena",name:"Poção de HP",icon:"❤️‍🩹",type:"consumivel",rarity:"Comum",price:35,minLevel:1,effect:{heal:45}},
  pocao_mana:{id:"pocao_mana",name:"Poção de Mana",icon:"🔷",type:"consumivel",rarity:"Comum",price:40,minLevel:1,effect:{mana:40}},
  pocao_forca:{id:"pocao_forca",name:"Poção de Força",icon:"💪",type:"consumivel",rarity:"Incomum",price:75,minLevel:3,effect:{nextAttackMult:1.5}},
  pao_aventureiro:{id:"pao_aventureiro",name:"Pão de Aventureiro",icon:"🥖",type:"consumivel",rarity:"Comum",price:20,minLevel:1,effect:{heal:20,mana:10}}
};
const RPG_SKILLS = {
 escudeiro:[{id:"escudo",name:"Golpe de Escudo",icon:"🛡️",level:1,cost:8,mag:false,mult:1.35},{id:"fortaleza",name:"Fortaleza",icon:"🏰",level:5,cost:14,defend:true},{id:"impacto",name:"Impacto do Guardião",icon:"💥",level:12,cost:22,mag:false,mult:2.25}],
 guerreiro:[{id:"corte",name:"Corte Dracônico",icon:"⚔️",level:1,cost:9,mag:false,mult:1.65},{id:"furia",name:"Fúria Carmesim",icon:"🔥",level:6,cost:16,mag:false,mult:2.05},{id:"executor",name:"Golpe Executor",icon:"💢",level:14,cost:25,mag:false,mult:2.75}],
 mago:[{id:"explosao",name:"Explosão Arcana",icon:"🔮",level:1,cost:14,mag:true,mult:1.85},{id:"meteoro",name:"Meteoro Mágico",icon:"☄️",level:7,cost:24,mag:true,mult:2.45},{id:"cataclismo",name:"Cataclismo Arcano",icon:"🌌",level:16,cost:38,mag:true,mult:3.25}],
 arqueiro:[{id:"flecha",name:"Flecha Veloz",icon:"🏹",level:1,cost:10,mag:false,mult:1.55},{id:"triplo",name:"Disparo Triplo",icon:"🎯",level:6,cost:18,mag:false,mult:2.15},{id:"tempestade",name:"Tempestade de Flechas",icon:"🌪️",level:15,cost:29,mag:false,mult:2.85}],
 curandeiro:[{id:"cura",name:"Luz Restauradora",icon:"🌿",level:1,cost:12,heal:true,healMult:1.4},{id:"cura_maior",name:"Benção Vital",icon:"✨",level:7,cost:22,heal:true,healMult:2.15},{id:"julgamento",name:"Julgamento Sagrado",icon:"☀️",level:15,cost:30,mag:true,mult:2.65}]
};

const ADVANCED_SKILLS = {
 necromante:[{id:"pacto_morte",name:"Pacto da Morte",icon:"☠️",level:10,cost:"all",hpCostPct:.15,mag:true,mult:4.6,desc:"Requer ao menos 35% da reserva máxima; consome toda a Mana e 15% do HP máximo para um ataque sombrio devastador."}],
 assassino:[{id:"execucao_sombria",name:"Execução Sombria",icon:"🗡️🌑",level:12,cost:28,hpCostPct:.08,mag:false,mult:4.0,desc:"Golpe crítico que também consome 8% do HP máximo."}],
 paladino:[{id:"julgamento_divino",name:"Julgamento Divino",icon:"⚜️",level:15,cost:35,mag:true,mult:3.4,healSelfPct:.18,desc:"Causa dano sagrado e recupera 18% do HP máximo."}],
 feiticeiro:[{id:"colapso_arcano",name:"Colapso Arcano",icon:"🌌",level:14,cost:"all",mag:true,mult:5.0,desc:"Requer ao menos 35% da reserva máxima e esvazia toda a Mana em uma explosão arcana."}],
 berserker:[{id:"ultimo_sangue",name:"Último Sangue",icon:"🩸🪓",level:16,cost:10,hpCostPct:.30,mag:false,mult:5.2,desc:"Sacrifica 30% do HP máximo para causar dano físico extremo."}],
 druida:[{id:"renascimento",name:"Renascimento Natural",icon:"🌿✨",level:15,cost:32,heal:true,healMult:3.0,desc:"Grande cura alimentada pela magia natural."}],
 sentinela:[{id:"chuva_astral",name:"Chuva Astral",icon:"🌠🏹",level:16,cost:30,mag:false,mult:4.1,desc:"Sequência de disparos de alta precisão."}],
 cavaleiro_runa:[{id:"ruptura_runica",name:"Ruptura Rúnica",icon:"⚔️🔷",level:18,cost:40,hpCostPct:.10,mag:true,mult:4.7,desc:"Explode as runas da arma, consumindo Mana e 10% do HP máximo."}]
};


// Novas especializações: mesmas regras de requisitos e troca de sete dias.
ADVANCED_HUMAN_CLASSES.samurai = {"name": "Samurai", "icon": "⚔️", "role": "Combate e resistência", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 22, "kills": 65, "baseClasses": ["guerreiro"]}, "bonus": {"hp": 20, "mana": 45, "atk": 20, "def": 5, "mag": 5, "agi": 5}};
ADVANCED_SKILLS.samurai = [{"id": "corte_lunar", "name": "Corte Lunar", "icon": "⚔️", "level": 22, "cost": 30, "mag": false, "mult": 3.8}];
ADVANCED_HUMAN_CLASSES.monge = {"name": "Monge", "icon": "🥋", "role": "Combate e resistência", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 20, "kills": 60, "baseClasses": ["escudeiro"]}, "bonus": {"hp": 20, "mana": 45, "atk": 5, "def": 18, "mag": 5, "agi": 5}};
ADVANCED_SKILLS.monge = [{"id": "punho_celestial", "name": "Punho Celestial", "icon": "🥋", "level": 20, "cost": 30, "mag": false, "mult": 3.8}];
ADVANCED_HUMAN_CLASSES.bardo = {"name": "Bardo", "icon": "🎵", "role": "Magia e controle", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 20, "kills": 55, "baseClasses": ["curandeiro"]}, "bonus": {"hp": 20, "mana": 45, "atk": 5, "def": 5, "mag": 18, "agi": 5}};
ADVANCED_SKILLS.bardo = [{"id": "canto_aurora", "name": "Canto Aurora", "icon": "🎵", "level": 20, "cost": 40, "mag": true, "mult": 4.2}];
ADVANCED_HUMAN_CLASSES.invocador = {"name": "Invocador", "icon": "🌀", "role": "Magia e controle", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 24, "kills": 75, "baseClasses": ["mago"]}, "bonus": {"hp": 20, "mana": 45, "atk": 5, "def": 5, "mag": 24, "agi": 5}};
ADVANCED_SKILLS.invocador = [{"id": "portal_espiritual", "name": "Portal Espiritual", "icon": "🌀", "level": 24, "cost": 40, "mag": true, "mult": 4.2}];
ADVANCED_HUMAN_CLASSES.cacador_dragao = {"name": "Caçador de Dragões", "icon": "🐲", "role": "Combate e resistência", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 28, "kills": 90, "baseClasses": ["arqueiro"]}, "bonus": {"hp": 20, "mana": 45, "atk": 25, "def": 5, "mag": 5, "agi": 5}};
ADVANCED_SKILLS.cacador_dragao = [{"id": "flecha_matadragao", "name": "Flecha Matadragao", "icon": "🐲", "level": 28, "cost": 30, "mag": false, "mult": 3.8}];
ADVANCED_HUMAN_CLASSES.templario = {"name": "Templário", "icon": "✝️", "role": "Magia e controle", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 26, "kills": 85, "baseClasses": ["escudeiro"]}, "bonus": {"hp": 20, "mana": 45, "atk": 5, "def": 24, "mag": 5, "agi": 5}};
ADVANCED_SKILLS.templario = [{"id": "sentenca_sagrada", "name": "Sentenca Sagrada", "icon": "✝️", "level": 26, "cost": 40, "mag": true, "mult": 4.2}];
ADVANCED_HUMAN_CLASSES.cronomago = {"name": "Cronomago", "icon": "⌛", "role": "Magia e controle", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 30, "kills": 100, "baseClasses": ["mago"]}, "bonus": {"hp": 20, "mana": 45, "atk": 5, "def": 5, "mag": 28, "agi": 5}};
ADVANCED_SKILLS.cronomago = [{"id": "fratura_temporal", "name": "Fratura Temporal", "icon": "⌛", "level": 30, "cost": 40, "mag": true, "mult": 4.2}];
ADVANCED_HUMAN_CLASSES.xama = {"name": "Xamã", "icon": "🌩️", "role": "Magia e controle", "desc": "Especialização conquistada por nível e vitórias.", "requires": {"level": 24, "kills": 70, "baseClasses": ["curandeiro"]}, "bonus": {"hp": 20, "mana": 45, "atk": 5, "def": 5, "mag": 21, "agi": 5}};
ADVANCED_SKILLS.xama = [{"id": "furia_totem", "name": "Furia Totem", "icon": "🌩️", "level": 24, "cost": 40, "mag": true, "mult": 4.2}];

const REGIONS = {
  geleira:{"name": "Geleira de Kanna", "icon": "❄️", "min": 18, "max": 32, "dragonRequired": false, "desc": "Criaturas e guardiões próprios. Prepare equipamentos e poções antes de explorar."},
  santuario:{"name": "Santuário de Lucoa", "icon": "🔮", "min": 28, "max": 45, "dragonRequired": false, "desc": "Criaturas e guardiões próprios. Prepare equipamentos e poções antes de explorar."},
  tempestade:{"name": "Arquipélago das Tempestades", "icon": "⚡", "min": 40, "max": 60, "dragonRequired": true, "desc": "Criaturas e guardiões próprios. Exige linhagem dracônica."},
  eclipse:{"name": "Terras do Eclipse", "icon": "🌘", "min": 55, "max": 80, "dragonRequired": true, "desc": "Criaturas e guardiões próprios. Exige linhagem dracônica."},
  trono:{"name": "Trono Ancestral", "icon": "🔱", "min": 75, "max": 120, "dragonRequired": true, "desc": "Criaturas e guardiões próprios. Exige linhagem dracônica."},
  floresta: { name: "Floresta de Elma", icon: "🌲", min: 1, max: 5, desc: "Uma mata úmida e relativamente segura para aventureiros iniciantes." },
  ruinas: { name: "Ruínas Dracônicas", icon: "🏚️", min: 5, max: 10, desc: "Pedras antigas, armadilhas e criaturas que protegem restos de uma era esquecida." },
  vale: { name: "Vale das Chamas", icon: "🌋", min: 10, max: 20, desc: "Terra vulcânica onde monstros resistentes ao calor dominam as trilhas." },
  abismo: { name: "Abismo de Fafnir", icon: "🌑", min: 20, max: 35, desc: "Uma região amaldiçoada para aventureiros experientes." },
  reino: { name: "Reino dos Dragões", icon: "🐉", min: 30, max: 99, desc: "O território mais perigoso do Dragon RPG, reservado para grandes guerreiros e dragões despertos." },
};

const REGION_BOSSES = {
  geleira:{"id": "boss_geleira", "name": "Colosso Glacial", "icon": "❄️👑", "hp": 500, "atk": 46, "def": 28, "mag": 46, "agi": 22, "xp": 500, "gold": [180, 270]},
  santuario:{"id": "boss_santuario", "name": "Oráculo Corrompido", "icon": "🔮👑", "hp": 700, "atk": 60, "def": 38, "mag": 60, "agi": 27, "xp": 750, "gold": [280, 420]},
  tempestade:{"id": "boss_tempestade", "name": "Serpente da Tempestade", "icon": "⚡👑", "hp": 1050, "atk": 82, "def": 50, "mag": 82, "agi": 32, "xp": 1000, "gold": [380, 570]},
  eclipse:{"id": "boss_eclipse", "name": "Imperador do Eclipse", "icon": "🌘👑", "hp": 1500, "atk": 105, "def": 64, "mag": 105, "agi": 37, "xp": 1250, "gold": [480, 720]},
  trono:{"id": "boss_trono", "name": "Soberano Ancestral", "icon": "🔱👑", "hp": 2100, "atk": 135, "def": 80, "mag": 135, "agi": 42, "xp": 1500, "gold": [580, 870]},
  floresta:{id:"boss_floresta",name:"Guardião Ancestral",icon:"🌳👑",hp:180,atk:22,def:13,mag:16,agi:12,xp:160,gold:[50,85]},
  ruinas:{id:"boss_ruinas",name:"Sentinela Dracônico",icon:"🏚️👑",hp:270,atk:31,def:20,mag:24,agi:14,xp:260,gold:[85,130]},
  vale:{id:"boss_vale",name:"Titã das Chamas",icon:"🌋👑",hp:390,atk:43,def:25,mag:38,agi:17,xp:390,gold:[125,190]},
  abismo:{id:"boss_abismo",name:"Devorador do Abismo",icon:"🌑👑",hp:560,atk:56,def:34,mag:52,agi:21,xp:560,gold:[180,270]},
  reino:{id:"boss_reino",name:"Dragão Alfa Ancestral",icon:"🐉👑",hp:820,atk:72,def:46,mag:64,agi:27,xp:820,gold:[270,400]}
};

const MONSTERS = {
  geleira_sentinela:{"id": "geleira_sentinela", "name": "Sentinela de Gelo", "icon": "❄️", "regions": ["geleira"], "level": [18, 32], "hp": 240, "atk": 32, "def": 20, "mag": 30, "agi": 20, "xp": 240, "gold": [65, 110], "drops": [{"id": "fragmento_geleira", "name": "Fragmento de Geleira de Kanna", "icon": "❄️", "chance": 0.25}]},
  geleira_fera:{"id": "geleira_fera", "name": "Lobo Glacial", "icon": "❄️", "regions": ["geleira"], "level": [18, 32], "hp": 280, "atk": 32, "def": 20, "mag": 34, "agi": 20, "xp": 240, "gold": [65, 110], "drops": [{"id": "fragmento_geleira", "name": "Fragmento de Geleira de Kanna", "icon": "❄️", "chance": 0.25}]},
  santuario_sentinela:{"id": "santuario_sentinela", "name": "Guardião Arcano", "icon": "🔮", "regions": ["santuario"], "level": [28, 45], "hp": 336, "atk": 42, "def": 27, "mag": 39, "agi": 24, "xp": 390, "gold": [115, 190], "drops": [{"id": "fragmento_santuario", "name": "Fragmento de Santuário de Lucoa", "icon": "🔮", "chance": 0.25}]},
  santuario_fera:{"id": "santuario_fera", "name": "Quimera Astral", "icon": "🔮", "regions": ["santuario"], "level": [28, 45], "hp": 392, "atk": 42, "def": 27, "mag": 45, "agi": 24, "xp": 390, "gold": [115, 190], "drops": [{"id": "fragmento_santuario", "name": "Fragmento de Santuário de Lucoa", "icon": "🔮", "chance": 0.25}]},
  tempestade_sentinela:{"id": "tempestade_sentinela", "name": "Wyvern da Tempestade", "icon": "⚡", "regions": ["tempestade"], "level": [40, 60], "hp": 504, "atk": 57, "def": 35, "mag": 53, "agi": 28, "xp": 540, "gold": [165, 270], "drops": [{"id": "fragmento_tempestade", "name": "Fragmento de Arquipélago das Tempestades", "icon": "⚡", "chance": 0.25}]},
  tempestade_fera:{"id": "tempestade_fera", "name": "Elemental do Trovão", "icon": "⚡", "regions": ["tempestade"], "level": [40, 60], "hp": 588, "atk": 57, "def": 35, "mag": 62, "agi": 28, "xp": 540, "gold": [165, 270], "drops": [{"id": "fragmento_tempestade", "name": "Fragmento de Arquipélago das Tempestades", "icon": "⚡", "chance": 0.25}]},
  eclipse_sentinela:{"id": "eclipse_sentinela", "name": "Dragão do Eclipse", "icon": "🌘", "regions": ["eclipse"], "level": [55, 80], "hp": 720, "atk": 74, "def": 45, "mag": 68, "agi": 32, "xp": 690, "gold": [215, 350], "drops": [{"id": "fragmento_eclipse", "name": "Fragmento de Terras do Eclipse", "icon": "🌘", "chance": 0.25}]},
  eclipse_fera:{"id": "eclipse_fera", "name": "Ceifador Lunar", "icon": "🌘", "regions": ["eclipse"], "level": [55, 80], "hp": 840, "atk": 74, "def": 45, "mag": 79, "agi": 32, "xp": 690, "gold": [215, 350], "drops": [{"id": "fragmento_eclipse", "name": "Fragmento de Terras do Eclipse", "icon": "🌘", "chance": 0.25}]},
  trono_sentinela:{"id": "trono_sentinela", "name": "Dragão Ancestral", "icon": "🔱", "regions": ["trono"], "level": [75, 120], "hp": 1008, "atk": 94, "def": 56, "mag": 88, "agi": 36, "xp": 840, "gold": [265, 430], "drops": [{"id": "fragmento_trono", "name": "Fragmento de Trono Ancestral", "icon": "🔱", "chance": 0.25}]},
  trono_fera:{"id": "trono_fera", "name": "Titã do Trono", "icon": "🔱", "regions": ["trono"], "level": [75, 120], "hp": 1176, "atk": 94, "def": 56, "mag": 101, "agi": 36, "xp": 840, "gold": [265, 430], "drops": [{"id": "fragmento_trono", "name": "Fragmento de Trono Ancestral", "icon": "🔱", "chance": 0.25}]},
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
  q_geleira:{"id": "q_geleira", "title": "Expedição: Geleira de Kanna", "desc": "Derrote 8 criaturas em Geleira de Kanna.", "type": "regionKills", "region": "geleira", "target": 8, "minLevel": 18, "xp": 900, "gold": 550},
  q_santuario:{"id": "q_santuario", "title": "Expedição: Santuário de Lucoa", "desc": "Derrote 8 criaturas em Santuário de Lucoa.", "type": "regionKills", "region": "santuario", "target": 8, "minLevel": 28, "xp": 1300, "gold": 850},
  q_tempestade:{"id": "q_tempestade", "title": "Expedição: Arquipélago das Tempestades", "desc": "Derrote 8 criaturas em Arquipélago das Tempestades.", "type": "regionKills", "region": "tempestade", "target": 8, "minLevel": 40, "xp": 1700, "gold": 1150},
  q_eclipse:{"id": "q_eclipse", "title": "Expedição: Terras do Eclipse", "desc": "Derrote 8 criaturas em Terras do Eclipse.", "type": "regionKills", "region": "eclipse", "target": 8, "minLevel": 55, "xp": 2100, "gold": 1450},
  q_trono:{"id": "q_trono", "title": "Expedição: Trono Ancestral", "desc": "Derrote 8 criaturas em Trono Ancestral.", "type": "regionKills", "region": "trono", "target": 8, "minLevel": 75, "xp": 2500, "gold": 1750},
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
  p.skillPoints = Number(p.skillPoints)||0;
  p.advancedClass = p.advancedClass || null;
  p.specialties = {combat:Math.max(0,Number(p.specialties?.combat)||0),stealth:Math.max(0,Number(p.specialties?.stealth)||0),survival:Math.max(0,Number(p.specialties?.survival)||0),arcana:Math.max(0,Number(p.specialties?.arcana)||0)};
  p.awakening = p.awakening || {unlocked:false,started:false,bossDefeated:false,completed:false,startedAt:null,completedAt:null};
  p.awakening.bossDefeated = Boolean(p.awakening.bossDefeated);
  p.dragonFormActive = Boolean(p.dragonFormActive);
  p.dragonEnergy = Number.isFinite(p.dragonEnergy) ? p.dragonEnergy : 100;
  p.maxDragonEnergy = Number.isFinite(p.maxDragonEnergy) ? p.maxDragonEnergy : 100;
  p.buffs = p.buffs || {};
  p.buffs.nextAttackMult = Number(p.buffs.nextAttackMult)||0;
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

// Reinicia a progressão dos membros selecionados sem apagar ouro ou inventário.
export function resetDragonRpgProgress(jids = [], label = "grupo") {
  const db=readDb();
  const targets=new Set(jids.map(normalizeUser).filter(Boolean));
  const digits=new Set([...targets].map(onlyDigitsRpg).filter(x=>x.length>=8));
  const keys=Object.keys(db.players).filter(k=>targets.has(k)||digits.has(onlyDigitsRpg(k)));
  if(!keys.length)return {ok:true,reset:0,backup:null};
  const backup=backupDragonRpgDb(label);
  for(const key of keys){
    const old=db.players[key], fresh=makePlayer(old.jid || key,old.name);
    fresh.gold=old.gold + Math.max(0,Number(old.expansion?.bank)||0);fresh.inventory=old.inventory;fresh.createdAt=old.createdAt;
    fresh.class=HUMAN_CLASSES[old.class]?old.class:null;
    fresh.classChosenAt=old.classChosenAt;fresh.lastClassChangedAt=old.lastClassChangedAt;
    if(fresh.class)addStats(fresh.stats,HUMAN_CLASSES[fresh.class].bonus);
    fresh.resources={hp:fresh.stats.hp,mana:fresh.stats.mana};
    // Equipamentos ficam no inventário; especializações e despertar devem ser conquistados novamente.
    db.players[key]=fresh;
  }
  writeDb(db);return {ok:true,reset:keys.length,backup};
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
  return migratePlayer({ jid, name: String(name || "Aventureiro").slice(0, 40), createdAt: now, updatedAt: now, level: 1, xp: 0, xpNext: 100, gold: 100, class: null, classChosenAt: null, faction: null, dragonClass: null, awakening: { unlocked: false, started: false, completed: false, startedAt: null, completedAt: null }, stats: { ...BASE_STATS }, resources:{hp:100,mana:50}, statPoints:0, skillPoints:0, advancedClass:null, specialties:{combat:0,stealth:0,survival:0,arcana:0}, inventory: [{ id: "pocao_pequena", name: "Poção Pequena", icon: "🧪", qty: 2, type: "consumivel" }, { id: "pao_aventureiro", name: "Pão de Aventureiro", icon: "🥖", qty: 1, type: "consumivel" }], equipment: { weapon: null, armor: null, accessory: null }, combat:null, rpgStats:{battles:0,wins:0,losses:0,escapes:0,monstersDefeated:0,damageDealt:0,damageTaken:0}, quests:{active:{},completed:[]}, lastRestAt:0, buffs:{nextAttackMult:0} });
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
function skillManaCost(player, skill, dragon = false) {
  if (skill.cost === "all") return player.resources.mana;
  const pct = dragon
    ? (player.level >= 80 ? 0.30 : player.level >= 40 ? 0.25 : 0.20)
    : (player.level >= 80 ? 0.18 : player.level >= 40 ? 0.15 : 0.12);
  return Math.max(Number(skill.cost || 0) * (dragon ? 7 : 4), Math.ceil(player.stats.mana * pct));
}

export function getRpgSkills(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};const base=RPG_SKILLS[p.class]||[];const advanced=p.advancedClass?(ADVANCED_SKILLS[p.advancedClass]||[]):[];return{ok:true,player:p,skills:[...base,...advanced].map(x=>({...x,advanced:advanced.includes(x),manaCost:skillManaCost(p,x),unlocked:p.level>=x.level}))};}
export function formatRpgShop(prefix="/"){return `╭━━〔 🏪 *LOJA DRAGON RPG* 〕━━╮\n${Object.values(RPG_ITEMS).map(i=>`┃ ${i.icon} *${i.id}* — 🪙 ${i.price}\n┃ ${i.rarity} • Lv.${i.minLevel}${i.dragonRequired?" • 🐉 Dragão":""}${i.effect?` • ${i.effect.heal?`❤️ +${i.effect.heal} `:""}${i.effect.mana?`🔷 +${i.effect.mana}`:""}`:""}${i.bonus?` • ${Object.entries(i.bonus).map(([k,v])=>`${k.toUpperCase()}+${v}`).join(" ")}`:""}`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nComprar: *${prefix}comprarrpg espada_ferro*`;}
export function formatRpgEquipment(p,prefix="/"){p=migratePlayer(p);const row=(sl,l)=>{const i=RPG_ITEMS[p.equipment?.[sl]];return`┃ ${l}: ${i?`${i.icon} *${i.name}* [${i.rarity}]`:"*Nenhum*"}`};return`╭━━〔 ⚔️ *EQUIPAMENTOS* 〕━━╮\n${row("weapon","🗡️ Arma")}\n${row("armor","🛡️ Armadura")}\n${row("accessory","💍 Acessório")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n📦 *${prefix}equiparrpg <id>*\n↩️ *${prefix}desequiparrpg arma|armadura|acessorio*`;}
export function formatRpgSkills(jid,prefix="/"){const r=getRpgSkills(jid);if(!r.ok)return null;return`╭━━〔 ✨ *HABILIDADES • ${HUMAN_CLASSES[r.player.class]?.name||"SEM CLASSE"}* 〕━━╮\n${r.skills.map(x=>`┃ ${x.unlocked?"✅":"🔒"} ${x.icon} *${x.id}* — ${x.name}\n┃ Lv.${x.level} • ${x.cost==="all"?"🔷 TODA a Mana (mínimo 35% da reserva máxima)":`🔷 ${x.manaCost} Mana`}${x.hpCostPct?` • ❤️ ${Math.round(x.hpCostPct*100)}% HP`:""}${x.advanced?" • 🌟 ÚNICA":""}`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nUse: *${prefix}habilidade <id>*`;}

export function chooseHumanClass(jid, classKey) {
  const key = String(classKey || "").toLowerCase(); const klass = HUMAN_CLASSES[key];
  if (!klass) return { ok: false, reason: "invalid" }; const player = getDragonRpgPlayer(jid);
  if (!player) return { ok: false, reason: "missing" }; if (player.class) return { ok: false, reason: "already", player };
  player.class = key; player.classChosenAt = new Date().toISOString(); addStats(player.stats, klass.bonus); player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; savePlayer(player); return { ok: true, player, klass };
}

const CLASS_CHANGE_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
function classChangeWait(player) {
  const last = Date.parse(player.lastClassChangedAt || player.classChosenAt || "");
  const remaining = Number.isFinite(last) ? Math.max(0, last + CLASS_CHANGE_COOLDOWN_MS - Date.now()) : 0;
  return remaining ? {ok:false,reason:"class_cooldown",remaining,nextChangeAt:new Date(last + CLASS_CHANGE_COOLDOWN_MS).toISOString()} : null;
}
function markClassChange(player) { player.lastClassChangedAt = new Date().toISOString(); }

export function switchHumanClass(jid,classKey){
 const key=String(classKey||"").toLowerCase(),klass=HUMAN_CLASSES[key];
 if(!klass)return{ok:false,reason:"invalid"};
 const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};
 if(p.combat)return{ok:false,reason:"combat"};if(p.class===key)return{ok:false,reason:"same"};
 if(!p.class)return chooseHumanClass(jid,key);
 const wait=classChangeWait(p);if(wait)return wait;
 const old=HUMAN_CLASSES[p.class],advanced=ADVANCED_HUMAN_CLASSES[p.advancedClass];
 // Remove também o bônus avançado: trocar a base não pode acumular atributos antigos.
 if(advanced)addStats(p.stats,Object.fromEntries(Object.entries(advanced.bonus).map(([k,v])=>[k,-v])));
 if(old)addStats(p.stats,Object.fromEntries(Object.entries(old.bonus).map(([k,v])=>[k,-v])));
 p.class=key;p.classChosenAt=new Date().toISOString();p.advancedClass=null;
 addStats(p.stats,klass.bonus);markClassChange(p);
 p.resources.hp=p.stats.hp;p.resources.mana=p.stats.mana;savePlayer(p);
 return{ok:true,player:p,klass,old};
}

function advancedRequirements(player,key){const c=ADVANCED_HUMAN_CLASSES[key];if(!c)return null;const r=c.requires||{},kills=Number(player.rpgStats?.monstersDefeated||0);const checks=[{name:`Nível RPG ${r.level}`,ok:player.level>=r.level},{name:`${r.kills} inimigos derrotados`,ok:kills>=r.kills},{name:`Classe base: ${(r.baseClasses||[]).map(x=>HUMAN_CLASSES[x]?.name||x).join(" / ")}`,ok:(r.baseClasses||[]).includes(player.class)}];if(r.stealth)checks.push({name:`Furtividade ${r.stealth}`,ok:player.specialties.stealth>=r.stealth});if(r.defense)checks.push({name:`DEF ${r.defense}`,ok:player.stats.def>=r.defense});if(r.magic)checks.push({name:`MAG ${r.magic}`,ok:player.stats.mag>=r.magic});if(r.combat)checks.push({name:`Combate ${r.combat}`,ok:player.specialties.combat>=r.combat});if(r.survival)checks.push({name:`Sobrevivência ${r.survival}`,ok:player.specialties.survival>=r.survival});return checks;}
export function getAdvancedClassProgress(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};return{ok:true,player:p,classes:Object.entries(ADVANCED_HUMAN_CLASSES).map(([key,c])=>({key,...c,checks:advancedRequirements(p,key)}))};}
export function chooseAdvancedClass(jid,classKey){const key=String(classKey||"").toLowerCase(),c=ADVANCED_HUMAN_CLASSES[key];if(!c)return{ok:false,reason:"invalid"};const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(p.advancedClass)return{ok:false,reason:"already",player:p};const checks=advancedRequirements(p,key),missing=checks.filter(x=>!x.ok);if(missing.length)return{ok:false,reason:"requirements",missing,klass:c,player:p};p.advancedClass=key;addStats(p.stats,c.bonus);p.resources.hp=p.stats.hp;p.resources.mana=p.stats.mana;savePlayer(p);return{ok:true,player:p,klass:c};}
export function switchAdvancedClass(jid,classKey){const key=String(classKey||"").toLowerCase(),c=ADVANCED_HUMAN_CLASSES[key];if(!c)return{ok:false,reason:"invalid"};const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(p.combat)return{ok:false,reason:"combat"};if(p.advancedClass===key)return{ok:false,reason:"same"};if(!p.advancedClass)return chooseAdvancedClass(jid,key);const wait=classChangeWait(p);if(wait)return wait;const checks=advancedRequirements(p,key),missing=checks.filter(x=>!x.ok);if(missing.length)return{ok:false,reason:"requirements",missing,klass:c,player:p};const old=ADVANCED_HUMAN_CLASSES[p.advancedClass];if(old)addStats(p.stats,Object.fromEntries(Object.entries(old.bonus).map(([k,v])=>[k,-v])));p.advancedClass=key;markClassChange(p);addStats(p.stats,c.bonus);p.resources.hp=p.stats.hp;p.resources.mana=p.stats.mana;savePlayer(p);return{ok:true,player:p,klass:c,old};}
export function formatAdvancedClasses(jid,prefix="/"){const r=getAdvancedClassProgress(jid);if(!r.ok)return null;return `╭━━〔 🌟 *CLASSES AVANÇADAS* 〕━━╮\n${r.classes.map(c=>`┃ ${c.icon} *${c.name}*\n${c.checks.map(x=>`┃ ${x.ok?"✅":"🔒"} ${x.name}`).join("\n")}\n┃ ➜ ${prefix}classeavancada ${c.key}`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;}

export function startDragonAwakening(jid, socialLevel = 0) {
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "missing" };
  if (Number(socialLevel) < 20) return { ok: false, reason: "social_level", required: 20, current: Number(socialLevel) || 0 };
  if (!player.class) return { ok: false, reason: "class" }; if (player.awakening?.completed) return { ok: false, reason: "completed", player };
  player.awakening = { ...(player.awakening || {}), unlocked: true, started: true, bossDefeated: Boolean(player.awakening?.bossDefeated), completed: false, startedAt: player.awakening?.startedAt || new Date().toISOString(), completedAt: null }; savePlayer(player); return { ok: true, player };
}
export function chooseDragonFaction(jid, factionKey, socialLevel = 0) {
  const key = String(factionKey || "").toLowerCase(); const faction = FACTIONS[key]; if (!faction) return { ok: false, reason: "invalid" };
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "missing" }; if (Number(socialLevel) < 20 || !player.awakening?.started) return { ok: false, reason: "locked" };
  if (player.faction) return { ok: false, reason: "already", player }; player.faction = key; savePlayer(player); return { ok: true, player, faction };
}
export function chooseDragonClass(jid, dragonKey, socialLevel = 0) {
  const key = String(dragonKey || "").toLowerCase(); const klass = DRAGON_CLASSES[key]; if (!klass) return { ok: false, reason: "invalid" };
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "missing" }; if (Number(socialLevel) < 20 || !player.awakening?.started) return { ok: false, reason: "locked" };
  if (!player.awakening?.bossDefeated) return { ok: false, reason: "boss" }; if (!player.faction) return { ok: false, reason: "faction" }; if (player.dragonClass) return { ok: false, reason: "already", player };
  if (klass.faction !== player.faction) return { ok: false, reason: "faction_mismatch", required: klass.faction };
  player.dragonClass = key; player.awakening.completed = true; player.awakening.completedAt = new Date().toISOString(); addStats(player.stats, klass.bonus); player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; savePlayer(player); return { ok: true, player, klass };
}

export function switchDragonClass(jid,dragonKey){
 const key=String(dragonKey||"").toLowerCase(),klass=DRAGON_CLASSES[key];if(!klass)return{ok:false,reason:"invalid"};
 const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(p.combat)return{ok:false,reason:"combat"};
 if(!p.dragonClass||!p.awakening?.completed)return{ok:false,reason:"locked"};if(p.dragonClass===key)return{ok:false,reason:"same"};
 if(klass.faction!==p.faction)return{ok:false,reason:"faction_mismatch",required:klass.faction};
 const wait=classChangeWait(p);if(wait)return wait;
 const old=DRAGON_CLASSES[p.dragonClass];if(old)addStats(p.stats,Object.fromEntries(Object.entries(old.bonus).map(([k,v])=>[k,-v])));
 p.dragonClass=key;markClassChange(p);addStats(p.stats,klass.bonus);p.resources.hp=p.stats.hp;p.resources.mana=p.stats.mana;p.dragonFormActive=false;savePlayer(p);
 return{ok:true,player:p,klass,old};
}
export function startAwakeningBoss(jid,socialLevel=0){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(Number(socialLevel)<20)return{ok:false,reason:"social_level",required:20};if(!p.awakening?.started)return{ok:false,reason:"not_started"};if(p.awakening?.bossDefeated)return{ok:false,reason:"defeated"};if(p.combat)return{ok:false,reason:"combat"};const guardian={...AWAKENING_BOSS,isBoss:true,level:Math.max(20,p.level)};
 guardian.maxHp=Math.max(guardian.hp,Math.round(p.stats.hp*2.2),Math.round(Math.max(p.stats.atk,p.stats.mag)*16));guardian.hp=guardian.maxHp;
 guardian.atk=Math.max(guardian.atk,Math.round(p.stats.def*.75));guardian.def=Math.max(guardian.def,Math.round(Math.max(p.stats.atk,p.stats.mag)*.55));
 p.combat={region:"despertar",enemy:guardian,turn:1,awakeningBoss:true,startedAt:Date.now()};p.rpgStats.battles++;savePlayer(p);return{ok:true,player:p,enemy:p.combat.enemy};}
export function transformDragon(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(!p.dragonClass||!p.awakening?.completed)return{ok:false,reason:"locked"};if(p.dragonFormActive)return{ok:false,reason:"already"};if(p.dragonEnergy<25)return{ok:false,reason:"energy",required:25,current:p.dragonEnergy};p.dragonEnergy-=25;p.dragonFormActive=true;savePlayer(p);return{ok:true,player:p,klass:DRAGON_CLASSES[p.dragonClass]};}
export function returnHumanForm(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(!p.dragonFormActive)return{ok:false,reason:"human"};p.dragonFormActive=false;savePlayer(p);return{ok:true,player:p};}
export function useDragonSkill(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(!p.combat)return{ok:false,reason:"no_battle"};if(!p.dragonFormActive)return{ok:false,reason:"form"};const sk=DRAGON_SKILLS[p.dragonClass];if(!sk)return{ok:false,reason:"skill"};const dragonManaCost=skillManaCost(p,sk,true);if(p.resources.mana<dragonManaCost)return{ok:false,reason:"mana",required:dragonManaCost,current:p.resources.mana};p.resources.mana-=dragonManaCost;const e=p.combat.enemy;const dmg=playerDamage(p,e,sk.mag,sk.mult);e.hp=Math.max(0,e.hp-dmg);p.rpgStats.damageDealt+=dmg;if(e.hp<=0){savePlayer(p);return{ok:true,skill:sk,manaCost:dragonManaCost,damage:dmg,victory:finishVictory(p)}}p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,false);return{ok:true,skill:sk,manaCost:dragonManaCost,damage:dmg,enemy:e,counter,player:getDragonRpgPlayer(jid)};}
export function restoreDragonEnergy(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};const before=p.dragonEnergy;p.dragonEnergy=Math.min(p.maxDragonEnergy,p.dragonEnergy+25);savePlayer(p);return{ok:true,recovered:p.dragonEnergy-before,player:p};}
export function getAwakeningStatus(jid){const p=getDragonRpgPlayer(jid);if(!p)return null;return{player:p,awakening:p.awakening,klass:p.dragonClass?DRAGON_CLASSES[p.dragonClass]:null};}
export function getHumanClasses() { return HUMAN_CLASSES; }
export function getDragonClasses() { return DRAGON_CLASSES; }
export function getDragonFactions() { return FACTIONS; }
export function factionName(key) { return FACTIONS[key]?.name || key; }

function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function scaleMonster(base, level){ const scale=1+Math.max(0,level-1)*0.10; return { ...base, level, maxHp:Math.round(base.hp*scale), hp:Math.round(base.hp*scale), atk:Math.round(base.atk*scale), def:Math.round(base.def*scale), mag:Math.round(base.mag*scale), agi:Math.round(base.agi*scale), xp:Math.round(base.xp*(.85+level*.08)) }; }
function regionMonster(regionKey,playerLevel,dragon=false){const pool=Object.values(MONSTERS).filter(m=>m.regions.includes(regionKey)),s=pool.filter(m=>playerLevel+(dragon?8:4)>=m.level[0]),list=s.length?s:pool,b=list[randInt(0,list.length-1)],lo=Math.max(b.level[0],dragon?playerLevel+1:playerLevel-2),hi=Math.max(lo,Math.min(b.level[1]+(dragon?5:0),dragon?playerLevel+5:playerLevel+2)),e=scaleMonster(b,randInt(lo,hi));if(dragon){e.maxHp=Math.round(e.maxHp*1.75);e.hp=e.maxHp;e.atk=Math.round(e.atk*1.5);e.def=Math.round(e.def*1.45);e.mag=Math.round(e.mag*1.5);e.agi=Math.round(e.agi*1.18);e.xp=Math.round(e.xp*1.30);e.gold=[Math.round(e.gold[0]*1.2),Math.round(e.gold[1]*1.3)];e.dragonTier=true}return e;}
function enemyDamage(enemy, player, defending=false){ let raw=Math.max(1,Math.round((enemy.atk*1.25)-(player.stats.def*.55)+randInt(-3,4))); if(enemy?.hardcoreTier&&Math.random()<(enemy?.isBoss?0.22:0.12))raw=Math.round(raw*1.55); return Math.max(1, defending?Math.ceil(raw*.45):raw); }
function playerDamage(player, enemy, magical=false, mult=1){ const power=magical?player.stats.mag:player.stats.atk; let raw=(power*1.35*mult)-(enemy.def*.55)+randInt(-3,5); if(enemy?.hardcoreTier)raw*=enemy?.highLevelTier?0.72:0.82; if(enemy?.isBoss&&enemy?.hardcoreTier)raw*=0.88; return Math.max(1,Math.round(raw)); }
function awardXp(player, amount){ let gained=Math.max(0,Math.round(amount)); player.xp+=gained; const levels=[]; while(player.xp>=player.xpNext){ player.xp-=player.xpNext; player.level++; player.xpNext=xpNeeded(player.level); player.statPoints+=3; player.skillPoints+=1; player.specialties.combat+=1; if(player.level%3===0)player.specialties.survival+=1; player.stats.hp+=8; player.stats.mana+=4; player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; levels.push(player.level); } return levels; }
function progressQuests(player, enemy, regionKey){ const completedNow=[]; for(const [qid,qstate] of Object.entries(player.quests.active||{})){ const q=QUESTS[qid]; if(!q)continue; let hit=false; if(q.type==='kill'&&q.monster===enemy.id)hit=true; if(q.type==='regionKills'&&q.region===regionKey)hit=true; if(hit){qstate.progress=Math.min(q.target,Number(qstate.progress||0)+1); if(qstate.progress>=q.target) qstate.ready=true;} } return completedNow; }
function finishVictory(player){ const battle=player.combat, enemy=battle.enemy; const awakeningWin=Boolean(battle?.awakeningBoss); const gold=randInt(enemy.gold[0],enemy.gold[1]); const levels=awardXp(player,enemy.xp); player.gold+=gold; player.rpgStats.wins++; player.rpgStats.monstersDefeated++; player.specialties.combat+=1;
 if(player.class==="arqueiro"||player.advancedClass==="assassino")player.specialties.stealth+=1;
 if(player.class==="mago"||player.class==="curandeiro"||["necromante","feiticeiro"].includes(player.advancedClass))player.specialties.arcana+=1;
 progressQuests(player,enemy,battle.region); let drop=null; for(const d of enemy.drops||[]){ if(Math.random()<d.chance){drop={...d,qty:1,type:'material'}; addItem(player,drop,1); break;} } if(awakeningWin){player.awakening={...(player.awakening||{}),unlocked:true,started:true,bossDefeated:true,completed:false};} player.combat=null; savePlayer(player); return {enemy,gold,xp:enemy.xp,levels,drop,player,awakeningWin}; }
function monsterTurn(player, defending=false){ const e=player.combat.enemy; const dmg=enemyDamage(e,player,defending); player.resources.hp=Math.max(0,player.resources.hp-dmg); player.rpgStats.damageTaken+=dmg; if(player.resources.hp<=0){ player.rpgStats.losses++; player.combat=null; savePlayer(player); return {damage:dmg,defeated:true}; } savePlayer(player); return {damage:dmg,defeated:false}; }

export function getRpgRegions(){ return REGIONS; }
export function formatRpgRegions(prefix='/'){ return `╭━━〔 🗺️ *REGIÕES DRAGON RPG* 〕━━╮\n${Object.entries(REGIONS).map(([k,r])=>`┃ ${r.icon} *${r.name}* — Lv. ${r.min}-${r.max}${r.dragonRequired?" • 🐉 Dragões":""}\n┃   ${prefix}explorar ${k}`).join('\n')}\n┃\n┃ ⚙️ ADM: ${prefix}mododragonrpg on/off\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function startRpgBattle(jid, regionKey='floresta'){
  const player=getDragonRpgPlayer(jid); if(!player)return {ok:false,reason:'missing'}; if(!player.class)return {ok:false,reason:'class'}; if(player.combat)return {ok:false,reason:'active',player}; if(player.resources.hp<=0)return {ok:false,reason:'defeated'};
  const key=String(regionKey||'floresta').toLowerCase(); const region=REGIONS[key]; if(!region)return {ok:false,reason:'region'}; if(player.level<region.min)return {ok:false,reason:'level',required:region.min,current:player.level}; if((key==='reino'||region.dragonRequired)&&!player.dragonClass)return {ok:false,reason:'dragon_required'};
  const bossEncounter=Math.random()<0.20;
  let enemy;
  if(bossEncounter){
    const b=REGION_BOSSES[key]||REGION_BOSSES.floresta;
    const scale=Math.max(1,player.level/(region.min||1));
    enemy={...b,level:Math.max(region.min,player.level),maxHp:Math.round(b.hp*Math.min(1.65,0.9+scale*0.12))};
    enemy.hp=enemy.maxHp;
    enemy.atk=Math.round(b.atk*Math.min(1.55,0.9+scale*0.1));
    enemy.def=Math.round(b.def*Math.min(1.5,0.9+scale*0.08));
    enemy.mag=Math.round(b.mag*Math.min(1.55,0.9+scale*0.1));
    enemy.agi=Math.round(b.agi*Math.min(1.4,0.95+scale*0.05));
    enemy.isBoss=true;
    if(player.dragonClass){enemy.maxHp=Math.round(enemy.maxHp*1.85);enemy.hp=enemy.maxHp;enemy.atk=Math.round(enemy.atk*1.55);enemy.def=Math.round(enemy.def*1.48);enemy.mag=Math.round(enemy.mag*1.55);enemy.agi=Math.round(enemy.agi*1.18);enemy.xp=Math.round(enemy.xp*1.35);enemy.dragonTier=true;}
  }else enemy=regionMonster(key,player.level,Boolean(player.dragonClass));
  // HARDCORE v5.3.35 • escala pelo poder REAL do jogador, não apenas pelo nível.
  if(player.level>=50||(player.dragonClass&&player.level>=30)){
    const awakened=Boolean(player.dragonClass);
    const lv100=player.level>=100;
    const power=Math.max(Number(player.stats.atk||0),Number(player.stats.mag||0));
    const tank=Number(player.stats.def||0);
    const hp=Number(player.stats.hp||100);

    const hpFloor=Math.round(hp*(bossEncounter?(lv100?2.80:2.25):(lv100?2.15:1.75)));
    const atkFloor=Math.round(tank*(bossEncounter?(lv100?1.12:0.98):(lv100?0.92:0.78)));
    const defFloor=Math.round(power*(bossEncounter?(lv100?1.65:1.40):(lv100?1.35:1.15)));

    enemy.maxHp=Math.max(enemy.maxHp||enemy.hp||1,hpFloor);
    enemy.hp=enemy.maxHp;
    enemy.atk=Math.max(enemy.atk||1,atkFloor);
    enemy.mag=Math.max(enemy.mag||1,Math.round(atkFloor*0.95));
    enemy.def=Math.max(enemy.def||1,defFloor);
    enemy.agi=Math.max(enemy.agi||1,Math.round(Number(player.stats.agi||10)*(bossEncounter?1.15:0.95)));
    enemy.hardcoreTier=true;
    enemy.highLevelTier=lv100;
    if(awakened) enemy.dragonTier=true;

    // Recompensa cresce, mas menos que a dificuldade para evitar farm explosivo.
    enemy.xp=Math.round((enemy.xp||50)*(bossEncounter?1.22:1.12));
    if(Array.isArray(enemy.gold)) enemy.gold=[
      Math.round(enemy.gold[0]*1.10),
      Math.round(enemy.gold[1]*1.18)
    ];
  }

  player.combat={region:key,enemy,turn:1,startedAt:Date.now(),bossEncounter}; player.rpgStats.battles++; savePlayer(player); return {ok:true,player,region,enemy,bossEncounter};
}
export function getRpgBattle(jid){ const p=getDragonRpgPlayer(jid); return p?.combat||null; }
export function rpgAttack(jid){
  const p=getDragonRpgPlayer(jid);
  if(!p)return{ok:false,reason:"missing"};
  if(!p.combat)return{ok:false,reason:"no_battle"};
  const e=p.combat.enemy;
  const crit=Math.random()<clamp(.05+p.stats.agi/500,.05,.22);
  const forceMult=Number(p.buffs?.nextAttackMult)||1;
  const dmg=playerDamage(p,e,false,(crit?1.7:1)*forceMult);
  const forceUsed=forceMult>1;
  if(forceUsed)p.buffs.nextAttackMult=0;
  e.hp=Math.max(0,e.hp-dmg);
  p.rpgStats.damageDealt+=dmg;
  if(e.hp<=0){savePlayer(p);return{ok:true,action:"attack",damage:dmg,crit,forceUsed,victory:finishVictory(p)};}
  p.combat.turn++;savePlayer(p);
  const counter=monsterTurn(p,false);
  return{ok:true,action:"attack",damage:dmg,crit,forceUsed,enemy:e,counter,player:getDragonRpgPlayer(jid)};
}
export function rpgDefend(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'missing'}; if(!p.combat)return {ok:false,reason:'no_battle'}; p.combat.turn++; savePlayer(p); const counter=monsterTurn(p,true); return {ok:true,action:'defend',enemy:p.combat?.enemy,counter,player:getDragonRpgPlayer(jid)}; }
export function rpgSkill(jid,skillKey=""){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"missing"};if(!p.combat)return{ok:false,reason:"no_battle"};const skills=[...(RPG_SKILLS[p.class]||[]),...(p.advancedClass?(ADVANCED_SKILLS[p.advancedClass]||[]):[])],key=String(skillKey||"").toLowerCase();let sk=key?skills.find(x=>x.id===key):[...skills].reverse().find(x=>p.level>=x.level);if(!sk)return{ok:false,reason:"skill"};if(p.level<sk.level)return{ok:false,reason:"skill_level",required:sk.level,skill:sk};const manaCost=skillManaCost(p,sk);if(sk.cost==="all"&&p.resources.mana<Math.ceil(p.stats.mana*.35))return{ok:false,reason:"mana",required:Math.ceil(p.stats.mana*.35),current:p.resources.mana};if(sk.cost!=="all"&&p.resources.mana<manaCost)return{ok:false,reason:"mana",required:manaCost,current:p.resources.mana};const hpCost=sk.hpCostPct?Math.max(1,Math.round(p.stats.hp*sk.hpCostPct)):0;if(hpCost&&p.resources.hp<=hpCost)return{ok:false,reason:"hp_cost",required:hpCost,current:p.resources.hp};p.resources.mana-=manaCost;if(hpCost)p.resources.hp-=hpCost;const e=p.combat.enemy;let heal=0,dmg=0;if(sk.heal){heal=Math.min(p.stats.hp-p.resources.hp,Math.max(18,Math.round(p.stats.mag*(sk.healMult||1.4))));p.resources.hp+=heal;}else if(sk.defend){p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,true);return{ok:true,action:"defend",skill:sk,enemy:e,counter,player:getDragonRpgPlayer(jid),manaCost,hpCost};}else{dmg=playerDamage(p,e,sk.mag,sk.mult);e.hp=Math.max(0,e.hp-dmg);p.rpgStats.damageDealt+=dmg;}if(sk.healSelfPct){const bonus=Math.min(p.stats.hp-p.resources.hp,Math.round(p.stats.hp*sk.healSelfPct));p.resources.hp+=bonus;heal+=bonus;}if(e.hp<=0){savePlayer(p);return{ok:true,action:"skill",skill:sk,damage:dmg,heal,manaCost,hpCost,victory:finishVictory(p)}}p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,false);return{ok:true,action:"skill",skill:sk,damage:dmg,heal,manaCost,hpCost,enemy:e,counter,player:getDragonRpgPlayer(jid)};}
export function rpgUseItem(jid,itemKey="pocao_hp"){
  const p=getDragonRpgPlayer(jid);
  if(!p)return{ok:false,reason:"missing"};
  const key=String(itemKey||"pocao_hp").toLowerCase();
  const aliases={
    pocao:"pocao_pequena","poção":"pocao_pequena","hp":"pocao_pequena","vida":"pocao_pequena","pocao_hp":"pocao_pequena","pocao_vida":"pocao_pequena",
    mana:"pocao_mana","pocao_mana":"pocao_mana",
    forca:"pocao_forca","força":"pocao_forca","pocao_forca":"pocao_forca","pocao_força":"pocao_forca",
    pao:"pao_aventureiro","pão":"pao_aventureiro"
  };
  const id=aliases[key]||key;
  const item=p.inventory.find(x=>x.id===id&&Number(x.qty)>0);
  if(!item)return{ok:false,reason:"item"};
  const catalog=RPG_ITEMS[id];
  if(!catalog||catalog.type!=="consumivel")return{ok:false,reason:"not_consumable"};

  let heal=0,mana=0,buff=null;
  if(id==="pocao_pequena"){
    heal=Math.min(p.stats.hp-p.resources.hp,45);
    if(heal<=0)return{ok:false,reason:"full_hp"};
    p.resources.hp+=heal;
  }else if(id==="pocao_mana"){
    mana=Math.min(p.stats.mana-p.resources.mana,40);
    if(mana<=0)return{ok:false,reason:"full_mana"};
    p.resources.mana+=mana;
  }else if(id==="pocao_forca"){
    if(Number(p.buffs?.nextAttackMult)>1)return{ok:false,reason:"buff_active"};
    p.buffs=p.buffs||{};
    p.buffs.nextAttackMult=1.5;
    buff={type:"forca",mult:1.5};
  }else if(id==="pao_aventureiro"){
    heal=Math.min(p.stats.hp-p.resources.hp,20);
    mana=Math.min(p.stats.mana-p.resources.mana,10);
    if(heal<=0&&mana<=0)return{ok:false,reason:"full_resources"};
    p.resources.hp+=heal;p.resources.mana+=mana;
  }else if(catalog.effect){
    heal=Math.min(p.stats.hp-p.resources.hp,Number(catalog.effect.heal||0));
    mana=Math.min(p.stats.mana-p.resources.mana,Number(catalog.effect.mana||0));
    if(heal<=0&&mana<=0)return{ok:false,reason:"full_resources"};
    p.resources.hp+=heal;p.resources.mana+=mana;
  }else return{ok:false,reason:"not_consumable"};

  item.qty--;
  const inCombat=Boolean(p.combat);
  savePlayer(p);

  let counter=null;
  if(inCombat){
    p.combat.turn++;
    savePlayer(p);
    counter=monsterTurn(p,false);
  }

  return{ok:true,item:{...item,name:catalog.name,icon:catalog.icon},heal,mana,buff,inCombat,counter,player:getDragonRpgPlayer(jid)};
}
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
  return `╭═══❀══〔 🐉 *DRAGON RPG • PERFIL* 〕══❀═══╮\n┃ 👤 Nome: *${player.name}*\n┃ ⭐ Nível RPG: *${player.level}*\n┃ ✨ XP: *${player.xp}/${player.xpNext}*\n┃ 🪙 Ouro: *${player.gold}*\n┃ 🎯 Pontos de atributo: *${player.statPoints}*\n┃ ✨ Pontos de habilidade: *${player.skillPoints}*\n┃ ❤️ Vida atual: *${player.resources.hp}/${player.stats.hp}*\n┃ 🔷 Mana atual: *${player.resources.mana}/${player.stats.mana}*\n┃\n┃ 🧭 Classe humana: ${human ? `${human.icon} *${human.name}*` : "❔ Não escolhida"}\n┃ 🌟 Classe avançada: ${player.advancedClass ? `${ADVANCED_HUMAN_CLASSES[player.advancedClass]?.icon||"✨"} *${ADVANCED_HUMAN_CLASSES[player.advancedClass]?.name||player.advancedClass}*` : "Nenhuma"}\n┃ 🐲 Forma dracônica: ${dragonState}\n┃ ${faction ? `${faction.icon} Facção: *${faction.name}*` : "🌸 Facção: *Nenhuma*"}\n┃\n┃ ${statLine(player.stats).replaceAll("\n", "\n┃ ")}\n┃\n┃ ⚔️ Vitórias: *${player.rpgStats.wins}* | ☠️ Derrotas: *${player.rpgStats.losses}*\n┃ 👹 Inimigos derrotados: *${player.rpgStats.monstersDefeated}*\n┃ 🎯 Especialidade de combate: *${player.specialties.combat}*\n┃ 🥷 Furtividade: *${player.specialties.stealth}*\n┃ 🧭 Sobrevivência: *${player.specialties.survival}*\n┃ 🔮 Arcana: *${player.specialties.arcana}*${battleStatus(player)}\n┃\n┃ 🌟 Level social: *${socialLevel}*\n┃ 🐉 Despertar: *${unlock}*\n╰════════════════════════════════════╯\n\n🌸 Ajuda: *${prefix}rpgajuda*`;
}
export function formatDragonRpgInventory(player) {
  player=migratePlayer(player); const rows = (player.inventory || []).filter(x => Number(x.qty) > 0).map((item, i) => `┃ ${i + 1}. ${item.icon || "📦"} *${item.name}* ×${item.qty}`);
  return `╭━━〔 🎒 *INVENTÁRIO DRAGON* 〕━━╮\n${rows.length ? rows.join("\n") : "┃ Inventário vazio."}\n┣━━━━━━━━━━━━━━━━━━━━━━\n┃ ⚔️ Arma: *${RPG_ITEMS[player.equipment?.weapon]?.name || "Nenhuma"}*\n┃ 🛡️ Armadura: *${RPG_ITEMS[player.equipment?.armor]?.name || "Nenhuma"}*\n┃ 💍 Acessório: *${RPG_ITEMS[player.equipment?.accessory]?.name || "Nenhum"}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}
export function formatBattleStart(result,prefix='/'){ const {region,enemy,player}=result; return `╭━━〔 ${region.icon} *${region.name.toUpperCase()}* 〕━━╮\n┃ Você encontrou ${enemy.icon} *${enemy.name}* Lv.${enemy.level}!\n┃ 👹 HP: *${enemy.hp}/${enemy.maxHp}*\n┃ ❤️ Seu HP: *${player.resources.hp}/${player.stats.hp}*\n┃ 🔷 Mana: *${player.resources.mana}/${player.stats.mana}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n⚔️ ${prefix}atacar\n✨ ${prefix}habilidade\n🛡️ ${prefix}defender\n🧪 ${prefix}item pocao\n🏃 ${prefix}fugir`; }
export function formatBattleAction(r,prefix='/'){ if(!r.ok)return ''; if(r.victory){ const v=r.victory; return `🏆 *VITÓRIA!*\n\nVocê derrotou ${v.enemy.icon} *${v.enemy.name}*!\n✨ +${v.xp} XP RPG\n🪙 +${v.gold} ouro${v.drop?`\n🎁 Drop: ${v.drop.icon} *${v.drop.name}*`:''}${v.levels.length?`\n\n🌟 *LEVEL UP!* Você chegou ao nível *${v.player.level}* e recebeu *${v.levels.length*3} pontos de atributo*.`:''}\n\n🗺️ Explore novamente com *${prefix}explorar <região>*.`; }
 const p=r.player, e=r.enemy||p?.combat?.enemy; if(r.counter?.defeated)return `☠️ *VOCÊ FOI DERROTADO*\n\nO inimigo causou *${r.counter.damage}* de dano e seu HP chegou a 0.\n🏕️ Use *${prefix}descansar* para se recuperar.`; const main=r.action==='defend'?`🛡️ Você se defendeu e reduziu o dano recebido.`:r.action==='skill'?`${r.skill?.heal?'🌿':'✨'} *${r.skill?.name}*${r.damage?` causou *${r.damage}* de dano`:''}${r.heal?` recuperou *${r.heal} HP*`:''}.`:`⚔️ Seu ataque causou *${r.damage}* de dano${r.crit?' — *CRÍTICO!* 🔥':''}.`; return `${main}${r.forceUsed?`\n💪 *Poção de Força:* +50% neste ataque.`:""}\n👹 ${e.icon} ${e.name}: *${e.hp}/${e.maxHp} HP*\n\n${r.counter?`💥 O inimigo contra-atacou: *${r.counter.damage}* de dano.\n`:''}❤️ Seu HP: *${p.resources.hp}/${p.stats.hp}* | 🔷 Mana: *${p.resources.mana}/${p.stats.mana}*\n\nSua vez: *${prefix}atacar* | *${prefix}habilidade* | *${prefix}defender*`; }
export function formatRpgQuests(jid,prefix='/'){ const r=listRpgQuests(jid); if(!r.ok)return null; const p=r.player; return `╭━━〔 📜 *MISSÕES DRAGON* 〕━━╮\n${r.quests.map(q=>{const s=p.quests.active[q.id];const done=p.quests.completed.includes(q.id);return `┃ ${done?'✅':s?.ready?'🎁':s?'🟡':'📌'} *${q.id}* — ${q.title}\n┃ ${q.desc}\n┃ Progresso: *${s?`${s.progress}/${q.target}`:done?'Concluída':'Não aceita'}*`;}).join('\n┣━━━━━━━━━━━━━━━━━━━━━━\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n📌 ${prefix}missao aceitar q_slimes\n🎁 ${prefix}missao resgatar q_slimes`; }
export function formatRpgRank(limit=10){ const rows=getRpgRank(limit).map((p,i)=>`${i+1}. ${i===0?'👑':i===1?'🥈':i===2?'🥉':'🐉'} *${p.name}* — Lv.${p.level} • ${p.rpgStats.wins} vitórias`); return `╭━━〔 🏆 *RANK DRAGON RPG* 〕━━╮\n${rows.length?rows.join('\n'):'Nenhum aventureiro ainda.'}\n╰━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function formatRpgMenu(prefix = "/", socialLevel = 0, hasPlayer = false) {
  return `╭═══❀═══〔 🐉 〕═══❀═══╮\n┃       *DRAGON RPG • EXPANSÃO 5.3.43*\n╰═══❀═══〔 🌸 〕═══❀═══╯\n\n${hasPlayer ? "✅ Seu personagem Dragon está ativo." : "🌱 Você ainda não criou seu personagem."}\n\n╭━━〔 🌸 *PERSONAGEM* 〕━━╮\n┃ ${prefix}rpgcriar\n┃ ${prefix}rpgperfil\n┃ ${prefix}rpginventario\n┃ ${prefix}equipamentos\n┃ ${prefix}lojarpg\n┃ ${prefix}habilidades\n┃ ${prefix}rpgatributo\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 ⚔️ *AVENTURA* 〕━━╮\n┃ ${prefix}regioes\n┃ ${prefix}explorar floresta\n┃ ${prefix}missoes\n┃ ${prefix}rankrpg\n┃ ${prefix}descansar\n┃ ${prefix}masmorras\n┃ ${prefix}masmorra <nome>\n┃ ${prefix}materiais\n┃ ${prefix}receitas\n┃ ${prefix}craft <item>\n┃ ${prefix}descansodungeon\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🧭 *CLASSES* 〕━━╮\n┃ ${prefix}rpgclasses\n┃ ${prefix}classeinfo <classe>\n┃ ${prefix}rpgclasse <classe>\n┃ ${prefix}classesavancadas\n┃ Samurai • Monge • Bardo • Invocador\n┃ Caçador de Dragões • Templário\n┃ Cronomago • Xamã\n┃ ${prefix}rpgexpansao — 30 novos comandos\n┃ ${prefix}classeavancada <classe>\n┃ ${prefix}trocarclasse <classe>\n┃ ${prefix}trocarclasse avancada <classe>\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🐲 *DESPERTAR DRACÔNICO* 〕━━╮\n┃ Requisito: *Level social 20+*\n┃ Seu Level social: *${socialLevel}*\n┃ ${prefix}despertardragao\n┃ ${prefix}bossdespertar\n┃ ${prefix}rpgfaccao <facção>\n┃ ${prefix}rpgdragao <classe>\n┃ ${prefix}transformar | ${prefix}formahumana\n┃ ${prefix}habilidadedragao | ${prefix}energiadragao\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n📖 ${prefix}rpgajuda`;
}
export function formatRpgCommands(prefix = "/") { return `╭━━〔 📜 *COMANDOS DRAGON RPG* 〕━━╮\n┃ ${prefix}dragonrpg | ${prefix}rpgcriar | ${prefix}rpgperfil\n┃ ${prefix}rpginventario | ${prefix}rpgatributo\n┃ ${prefix}lojarpg | ${prefix}comprarrpg | ${prefix}equipamentos\n┃ ${prefix}equiparrpg | ${prefix}desequiparrpg | ${prefix}habilidades\n┃ ${prefix}regioes | ${prefix}explorar | ${prefix}batalhar\n┃ ${prefix}atacar | ${prefix}habilidade | ${prefix}defender\n┃ ${prefix}item | ${prefix}fugir | ${prefix}descansar\n┃ ${prefix}missoes | ${prefix}missao | ${prefix}rankrpg\n┃ ${prefix}masmorras | ${prefix}masmorra | ${prefix}materiais\n┃ ${prefix}receitas | ${prefix}craft | ${prefix}descansodungeon\n┃ ${prefix}rpgclasses | ${prefix}classeinfo | ${prefix}rpgclasse\n┃ ${prefix}classesavancadas | ${prefix}classeavancada\n┃ ${prefix}despertardragao | ${prefix}bossdespertar\n┃ ${prefix}rpgfaccao | ${prefix}rpgdragao | ${prefix}transformar\n┃ ${prefix}formahumana | ${prefix}habilidadedragao | ${prefix}energiadragao\n┃ ${prefix}rpgajuda [tema]\n┃ 👑 ${prefix}zerarrpg | ${prefix}zerarrpgg\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function formatRpgClasses(prefix = "/") {
  const humans = Object.entries(HUMAN_CLASSES).map(([k, v]) => `┃ ${v.icon} *${v.name}* — ${prefix}classeinfo ${k}`).join("\n");
  const dragons = Object.entries(DRAGON_CLASSES).map(([k, v]) => `┃ ${v.icon} *${v.name}* [${FACTIONS[v.faction].name}] — ${prefix}classeinfo ${k}`).join("\n");
  return `╭━━〔 🧑 *CLASSES HUMANAS* 〕━━╮\n${humans}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🐉 *CLASSES DRACÔNICAS* 〕━━╮\n┃ 🔒 Desbloqueadas no *Level social 20+*\n${dragons}\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n🌸 As classes dracônicas são linhagens do Dragon RPG inspiradas nos dragões de *Maid Dragon*.`;
}
export function formatClassInfo(classKey, prefix = "/") {
  const key = String(classKey || "").toLowerCase();
  if (HUMAN_CLASSES[key]) { const c = HUMAN_CLASSES[key]; return `╭━━〔 ${c.icon} *${c.name.toUpperCase()}* 〕━━╮\n┃ 🎯 Função: *${c.role}*\n┃ 📖 ${c.desc}\n┃\n┃ 📈 Bônus iniciais:\n┃ ❤️ HP +${c.bonus.hp} | 🔷 Mana +${c.bonus.mana}\n┃ ⚔️ ATK +${c.bonus.atk} | 🛡️ DEF +${c.bonus.def}\n┃ 🔮 MAG +${c.bonus.mag} | 💨 AGI +${c.bonus.agi}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\nEscolher: *${prefix}rpgclasse ${key}*`; }
  if (ADVANCED_HUMAN_CLASSES[key]) { const c=ADVANCED_HUMAN_CLASSES[key]; return `${c.icon} *${c.name}*\n${c.role}\nNível ${c.requires.level} • ${c.requires.kills} vitórias\nClasse base: ${c.requires.baseClasses.join(", ")}\nHabilidade: ${ADVANCED_SKILLS[key].map(x=>x.id).join(", ")}\nEscolher: ${prefix}classeavancada ${key}\nTrocas: intervalo compartilhado de 7 dias.`; }
  if (DRAGON_CLASSES[key]) { const c = DRAGON_CLASSES[key]; const f = FACTIONS[c.faction]; return `╭━━〔 ${c.icon} *${c.name.toUpperCase()}* 〕━━╮\n┃ 🐲 Inspiração: *${c.inspiration}*\n┃ ${f.icon} Facção: *${f.name}*\n┃ 🎯 Função: *${c.role}*\n┃ 📖 ${c.desc}\n┃\n┃ 📈 Bônus do despertar:\n┃ ❤️ HP +${c.bonus.hp} | 🔷 Mana +${c.bonus.mana}\n┃ ⚔️ ATK +${c.bonus.atk} | 🛡️ DEF +${c.bonus.def}\n┃ 🔮 MAG +${c.bonus.mag} | 💨 AGI +${c.bonus.agi}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n🔒 Requer Level social 20+, Despertar iniciado e facção *${f.name}*.`; }
  return `❌ Classe não encontrada. Use *${prefix}rpgclasses* para ver as opções.`;
}
export function formatRpgHelp(topic="",prefix="/"){const x=String(topic||"").toLowerCase();
if(["1","comecar","começar","inicio"].includes(x))return `🌱 *TUTORIAL • PRIMEIROS PASSOS*\n\n1️⃣ *${prefix}rpgcriar* cria seu aventureiro.\n2️⃣ *${prefix}rpgclasses* mostra as classes iniciais e seus estilos.\n3️⃣ *${prefix}rpgperfil* mostra sua progressão completa.\n4️⃣ Comece em *${prefix}explorar floresta*.\n5️⃣ Em batalha: atacar, habilidade, defender, item ou fugir.\n6️⃣ Vitórias dão XP e ouro. Cada nível concede *3 pontos de atributo + 1 ponto de habilidade*.\n7️⃣ Distribua status com *${prefix}rpgatributo atk 1*.\n8️⃣ Faça *${prefix}missoes* e acumule vitórias.\n9️⃣ Depois conquiste especializações em *${prefix}classesavancadas*.\n\n💡 O RPG registra sua evolução permanentemente.`;
if(["2","classes","humanas"].includes(x))return `⚔️ *TUTORIAL • CLASSES*\n\nClasses iniciais: Escudeiro, Guerreiro, Mago, Arqueiro e Curandeiro.\n\n🌟 Classes avançadas exigem feitos:\n☠️ Necromante — Lv.10 + 25 inimigos + Mago/Curandeiro.\n🥷 Assassino — Lv.12 + 35 inimigos + Guerreiro/Arqueiro + Furtividade 15.\n🛡️✨ Paladino — Lv.15 + 40 inimigos + Escudeiro/Curandeiro + DEF 20.\n🪄 Feiticeiro — Lv.14 + 30 inimigos + Mago + MAG 22.\n\nAcompanhe tudo em *${prefix}classesavancadas*.`;
if(["3","dragao","dragão"].includes(x))return `🐉 *TUTORIAL • DESPERTAR*\n\nO caminho dracônico vem depois da evolução humana. Com Level social 20+, use *${prefix}despertardragao*, derrote o Guardião em *${prefix}bossdespertar*, escolha sua facção e uma linhagem compatível. Classe avançada humana e linhagem dracônica podem coexistir.`;
if(["4","faccoes","facções","faccao","facção"].includes(x))return `🏰 *TUTORIAL • FACÇÕES*\n\n🔥 Caos — Chamas, Abissal e Carmesim.\n⚖️ Harmonia — Aquático.\n👁️ Espectadores — Arcano.\n⚡ Independente — Elétrico.\n\nSua facção limita a linhagem dracônica disponível. Trocas de classe humana, avançada e dracônica compartilham um intervalo de 7 dias.`;
if(["5","atributos","status"].includes(x))return `📊 *TUTORIAL • STATUS*\n\n❤️ HP: vida • 🔷 Mana: habilidades\n⚔️ ATK: dano físico • 🛡️ DEF: resistência\n🔮 MAG: poder mágico • 💨 AGI: crítico/fuga\n\nCada nível: *3 pontos de atributo + 1 ponto de habilidade*.\n\n🎯 Combate cresce com nível e vitórias.\n🥷 Furtividade cresce principalmente em estilos ágeis.\n🧭 Sobrevivência cresce com a progressão.\n🔮 Arcana cresce nas vitórias de classes mágicas.\n\nEspecialidades também viram requisitos de classes avançadas.`;
if(["6","nivel","nível","xp"].includes(x))return `⭐ *TUTORIAL • NÍVEL E XP*\n\nBatalhas dão XP RPG. Ao completar a barra você sobe automaticamente, recupera HP/Mana e recebe *3 pontos de atributo + 1 ponto de habilidade*. Pontos de atributo melhoram seu personagem agora; pontos de habilidade ficam registrados para a expansão da árvore de habilidades.`;
if(["7","combate","batalha"].includes(x))return `⚔️ *TUTORIAL • COMBATE*\n\n*${prefix}atacar* — ataque normal.\n*${prefix}habilidade <id>* — técnica da classe, consome Mana.\n*${prefix}defender* — reduz contra-ataque.\n*${prefix}item pocao* — usa consumível.\n*${prefix}fugir* — AGI ajuda na fuga.\n*${prefix}descansar* — recupera fora de batalha.\n\nVitórias contam para missões, especialidades e desbloqueio de classes.`;
if(["8","missoes","missões"].includes(x))return `📜 *TUTORIAL • MISSÕES*\n\nVeja *${prefix}missoes*, aceite com *${prefix}missao aceitar <id>* e cumpra a meta indicada. O progresso é automático durante batalhas. Depois use *${prefix}missao resgatar <id>* para receber XP, ouro e itens.`;
if(["9","avancadas","avançadas"].includes(x))return `🌟 *TUTORIAL • CLASSES AVANÇADAS*\n\nUse *${prefix}classesavancadas*. Cada requisito aparece com ✅ ou 🔒. Quando completar tudo, use *${prefix}classeavancada <classe>*.\n\nExemplo: Necromante exige Mago/Curandeiro, Lv.10 e 25 inimigos derrotados. Não basta chegar ao nível: é uma classe conquistada por feitos.`;
return `╭━━〔 📖 *DRAGON RPG • TUTORIAIS* 〕━━╮\n┃ 1️⃣ Primeiros passos\n┃ 2️⃣ Classes e especializações\n┃ 3️⃣ Despertar dracônico\n┃ 4️⃣ Facções\n┃ 5️⃣ Atributos e especialidades\n┃ 6️⃣ Nível, XP e pontos\n┃ 7️⃣ Combate detalhado\n┃ 8️⃣ Missões\n┃ 9️⃣ Classes avançadas\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nUse *${prefix}rpgajuda 1* até *${prefix}rpgajuda 9*`;}

// Callback síncrono: economia e expansão usam uma única gravação atômica.
export function transactDragonRpg(jid, callback) {
  const db=readDb(), p=db.players[normalizeUser(jid)];
  if(!p) return "🌱 Crie seu personagem com /rpgcriar.";
  const result=callback(p, {awardXp, addItem, items:RPG_ITEMS});
  if(result.ok){p.updatedAt=new Date().toISOString(); db.players[normalizeUser(jid)]=migratePlayer(p);writeDb(db);}
  return result.text;
}
