/* Kobayashi Protected Distribution v4.0.3 */
import fs from "fs";
import path from "\x70\x61\x74\x68";

const DB_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x64\x72\x61\x67\x6f\x6e\x2d\x72\x70\x67\x2e\x6a\x73\x6f\x6e");

const HUMAN_CLASSES = {
  escudeiro: { name: "\x45\x73\x63\x75\x64\x65\x69\x72\x6f", icon: "\ud83d\ufe0f", role: "\x44\x65\x66\x65\x73\x61\x20\x65\x20\x72\x65\x73\x69\x73\x74\xea\x6e\x63\x69\x61", desc: "\x43\x6f\x6d\x65\xe7\x61\x20\x70\x72\x6f\x74\x65\x67\x69\x64\x6f\x2c\x20\x61\x67\x75\x65\x6e\x74\x61\x20\x6d\x61\x69\x73\x20\x64\x61\x6e\x6f\x20\x65\x20\x70\x72\x65\x70\x61\x72\x61\x20\x6f\x20\x63\x61\x6d\x69\x6e\x68\x6f\x20\x70\x61\x72\x61\x20\x63\x6c\x61\x73\x73\x65\x73\x20\x64\x65\x20\x63\x61\x76\x61\x6c\x65\x69\x72\x6f\x2e", bonus: { hp: 25, mana: 0, atk: 2, def: 6, mag: 0, agi: 0 } },
  guerreiro: { name: "\x47\x75\x65\x72\x72\x65\x69\x72\x6f", icon: "⚔️", role: "\x44\x61\x6e\x6f\x20\x66\xed\x73\x69\x63\x6f", desc: "\x43\x6c\x61\x73\x73\x65\x20\x64\x69\x72\x65\x74\x61\x20\x65\x20\x61\x67\x72\x65\x73\x73\x69\x76\x61\x2c\x20\x63\x6f\x6d\x20\x66\x6f\x72\xe7\x61\x20\x61\x6c\x74\x61\x20\x65\x20\x62\x6f\x61\x20\x72\x65\x73\x69\x73\x74\xea\x6e\x63\x69\x61\x20\x70\x61\x72\x61\x20\x63\x6f\x6d\x62\x61\x74\x65\x73\x20\x63\x6f\x72\x70\x6f\x20\x61\x20\x63\x6f\x72\x70\x6f\x2e", bonus: { hp: 15, mana: 0, atk: 7, def: 3, mag: 0, agi: 1 } },
  mago: { name: "\x4d\x61\x67\x6f", icon: "🔮", role: "\x4d\x61\x67\x69\x61\x20\x65\x20\x4d\x61\x6e\x61", desc: "\x45\x73\x70\x65\x63\x69\x61\x6c\x69\x73\x74\x61\x20\x65\x6d\x20\x6d\x61\x67\x69\x61\x2e\x20\x50\x6f\x73\x73\x75\x69\x20\x6d\x75\x69\x74\x6f\x20\x4d\x61\x6e\x61\x20\x65\x20\x67\x72\x61\x6e\x64\x65\x20\x70\x6f\x74\x65\x6e\x63\x69\x61\x6c\x20\x6d\xe1\x67\x69\x63\x6f\x2c\x20\x6d\x61\x73\x20\x6d\x65\x6e\x6f\x73\x20\x72\x65\x73\x69\x73\x74\xea\x6e\x63\x69\x61\x20\x66\xed\x73\x69\x63\x61\x2e", bonus: { hp: 0, mana: 35, atk: 0, def: 0, mag: 8, agi: 1 } },
  arqueiro: { name: "\x41\x72\x71\x75\x65\x69\x72\x6f", icon: "🏹", role: "\x41\x67\x69\x6c\x69\x64\x61\x64\x65\x20\x65\x20\x70\x72\x65\x63\x69\x73\xe3\x6f", desc: "\x41\x74\x61\x63\x61\x20\x63\x6f\x6d\x20\x76\x65\x6c\x6f\x63\x69\x64\x61\x64\x65\x20\x65\x20\x70\x72\x65\x63\x69\x73\xe3\x6f\x2e\x20\x49\x64\x65\x61\x6c\x20\x70\x61\x72\x61\x20\x71\x75\x65\x6d\x20\x70\x72\x65\x66\x65\x72\x65\x20\x65\x73\x71\x75\x69\x76\x61\x20\x65\x20\x61\x74\x61\x71\x75\x65\x73\x20\x72\xe1\x70\x69\x64\x6f\x73\x2e", bonus: { hp: 5, mana: 10, atk: 4, def: 1, mag: 1, agi: 7 } },
  curandeiro: { name: "\x43\x75\x72\x61\x6e\x64\x65\x69\x72\x6f", icon: "🌿", role: "\x53\x75\x70\x6f\x72\x74\x65\x20\x65\x20\x63\x75\x72\x61", desc: "\x55\x73\x61\x20\x6d\x61\x67\x69\x61\x20\x70\x61\x72\x61\x20\x72\x65\x73\x74\x61\x75\x72\x61\x72\x20\x61\x6c\x69\x61\x64\x6f\x73\x20\x65\x20\x73\x6f\x62\x72\x65\x76\x69\x76\x65\x72\x20\x61\x20\x62\x61\x74\x61\x6c\x68\x61\x73\x20\x6c\x6f\x6e\x67\x61\x73\x2e\x20\xd3\x74\x69\x6d\x6f\x20\x70\x61\x72\x61\x20\x67\x72\x75\x70\x6f\x73\x2e", bonus: { hp: 10, mana: 30, atk: 0, def: 2, mag: 6, agi: 1 } },
};

const ADVANCED_HUMAN_CLASSES = {
 necromante:{name:"\x4e\x65\x63\x72\x6f\x6d\x61\x6e\x74\x65",icon:"☠️",role:"\x4d\x61\x67\x69\x61\x20\x73\x6f\x6d\x62\x72\x69\x61\x20\x65\x20\x63\x6f\x6e\x74\x72\x6f\x6c\x65",desc:"\x43\x6c\x61\x73\x73\x65\x20\x61\x76\x61\x6e\xe7\x61\x64\x61\x20\x63\x6f\x6e\x71\x75\x69\x73\x74\x61\x64\x61\x20\x65\x6d\x20\x63\x6f\x6d\x62\x61\x74\x65\x2e",requires:{level:10,kills:25,baseClasses:["\x6d\x61\x67\x6f","\x63\x75\x72\x61\x6e\x64\x65\x69\x72\x6f"]},bonus:{hp:10,mana:45,atk:0,def:2,mag:12,agi:0}},
 assassino:{name:"\x41\x73\x73\x61\x73\x73\x69\x6e\x6f",icon:"🥷",role:"\x46\x75\x72\x74\x69\x76\x69\x64\x61\x64\x65\x20\x65\x20\x63\x72\xed\x74\x69\x63\x6f",desc:"\x45\x73\x70\x65\x63\x69\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x20\x64\x65\x20\x63\x6f\x6d\x62\x61\x74\x65\x6e\x74\x65\x73\x20\xe1\x67\x65\x69\x73\x2e",requires:{level:12,kills:35,baseClasses:["\x61\x72\x71\x75\x65\x69\x72\x6f","\x67\x75\x65\x72\x72\x65\x69\x72\x6f"],stealth:15},bonus:{hp:5,mana:10,atk:8,def:0,mag:0,agi:10}},
 paladino:{name:"\x50\x61\x6c\x61\x64\x69\x6e\x6f",icon:"\ud83d\ufe0f\u2728",role:"\x44\x65\x66\x65\x73\x61\x20\x65\x20\x6d\x61\x67\x69\x61",desc:"\x47\x75\x65\x72\x72\x65\x69\x72\x6f\x20\x73\x61\x67\x72\x61\x64\x6f\x20\x72\x65\x73\x69\x73\x74\x65\x6e\x74\x65\x2e",requires:{level:15,kills:40,baseClasses:["\x65\x73\x63\x75\x64\x65\x69\x72\x6f","\x63\x75\x72\x61\x6e\x64\x65\x69\x72\x6f"],defense:20},bonus:{hp:30,mana:20,atk:5,def:10,mag:5,agi:0}},
 feiticeiro:{name:"\x46\x65\x69\x74\x69\x63\x65\x69\x72\x6f",icon:"🪄",role:"\x4d\x61\x67\x69\x61\x20\x6f\x66\x65\x6e\x73\x69\x76\x61\x20\x61\x76\x61\x6e\xe7\x61\x64\x61",desc:"\x45\x76\x6f\x6c\x75\xe7\xe3\x6f\x20\x64\x65\x20\x61\x6c\x74\x6f\x20\x70\x6f\x64\x65\x72\x20\x61\x72\x63\x61\x6e\x6f\x2e",requires:{level:14,kills:30,baseClasses:["\x6d\x61\x67\x6f"],magic:22},bonus:{hp:0,mana:55,atk:0,def:0,mag:15,agi:2}}
};

const FACTIONS = {
  caos: { name: "\x43\x61\x6f\x73", icon: "🔥", desc: "\x44\x72\x61\x67\xf5\x65\x73\x20\x71\x75\x65\x20\x72\x65\x6a\x65\x69\x74\x61\x6d\x20\x61\x20\x6f\x72\x64\x65\x6d\x20\x69\x6d\x70\x6f\x73\x74\x61\x20\x65\x20\x76\x61\x6c\x6f\x72\x69\x7a\x61\x6d\x20\x70\x6f\x64\x65\x72\x2c\x20\x6c\x69\x62\x65\x72\x64\x61\x64\x65\x20\x65\x20\x66\x6f\x72\xe7\x61\x20\x69\x6e\x64\x69\x76\x69\x64\x75\x61\x6c\x2e" },
  harmonia: { name: "\x48\x61\x72\x6d\x6f\x6e\x69\x61", icon: "⚖️", desc: "\x44\x72\x61\x67\xf5\x65\x73\x20\x6c\x69\x67\x61\x64\x6f\x73\x20\xe0\x20\x6f\x72\x64\x65\x6d\x20\x65\x20\x61\x6f\x20\x65\x71\x75\x69\x6c\xed\x62\x72\x69\x6f\x2c\x20\x63\x6f\x6d\x20\x66\x6f\x72\x74\x65\x20\x66\x6f\x63\x6f\x20\x65\x6d\x20\x64\x69\x73\x63\x69\x70\x6c\x69\x6e\x61\x2c\x20\x70\x72\x6f\x74\x65\xe7\xe3\x6f\x20\x65\x20\x63\x6f\x6e\x74\x72\x6f\x6c\x65\x2e" },
  espectador: { name: "\x45\x73\x70\x65\x63\x74\x61\x64\x6f\x72\x65\x73", icon: "\ud83d\ufe0f", desc: "\x4f\x62\x73\x65\x72\x76\x61\x64\x6f\x72\x65\x73\x20\x71\x75\x65\x20\x65\x76\x69\x74\x61\x6d\x20\x74\x6f\x6d\x61\x72\x20\x70\x61\x72\x74\x69\x64\x6f\x20\x64\x69\x72\x65\x74\x61\x6d\x65\x6e\x74\x65\x20\x65\x20\x64\x6f\x6d\x69\x6e\x61\x6d\x20\x63\x6f\x6e\x68\x65\x63\x69\x6d\x65\x6e\x74\x6f\x73\x20\x65\x20\x6d\x61\x67\x69\x61\x73\x20\x69\x6e\x63\x6f\x6d\x75\x6e\x73\x2e" },
  independente: { name: "\x49\x6e\x64\x65\x70\x65\x6e\x64\x65\x6e\x74\x65", icon: "⚡", desc: "\x43\x61\x6d\x69\x6e\x68\x6f\x20\x6c\x69\x76\x72\x65\x20\x70\x61\x72\x61\x20\x64\x72\x61\x67\xf5\x65\x73\x20\x73\x65\x6d\x20\x76\xed\x6e\x63\x75\x6c\x6f\x20\x66\x6f\x72\x6d\x61\x6c\x20\x63\x6f\x6d\x20\x61\x73\x20\x67\x72\x61\x6e\x64\x65\x73\x20\x66\x61\x63\xe7\xf5\x65\x73\x2e" },
};

const DRAGON_CLASSES = {
  chamas: { name: "\x44\x72\x61\x67\xe3\x6f\x20\x64\x61\x73\x20\x43\x68\x61\x6d\x61\x73", icon: "🔥", faction: "\x63\x61\x6f\x73", inspiration: "\x54\x6f\x68\x72\x75", role: "\x41\x74\x61\x71\x75\x65\x20\x65\x20\x64\x61\x6e\x6f\x20\x65\x6d\x20\xe1\x72\x65\x61", desc: "\x55\x6d\x61\x20\x6c\x69\x6e\x68\x61\x67\x65\x6d\x20\x64\x65\x20\x66\x6f\x67\x6f\x20\x65\x78\x74\x72\x65\x6d\x61\x6d\x65\x6e\x74\x65\x20\x6f\x66\x65\x6e\x73\x69\x76\x61\x2c\x20\x66\x65\x69\x74\x61\x20\x70\x61\x72\x61\x20\x64\x6f\x6d\x69\x6e\x61\x72\x20\x6f\x20\x63\x61\x6d\x70\x6f\x20\x64\x65\x20\x62\x61\x74\x61\x6c\x68\x61\x2e", bonus: { hp: 40, mana: 25, atk: 12, def: 5, mag: 10, agi: 4 } },
  abissal: { name: "\x44\x72\x61\x67\xe3\x6f\x20\x41\x62\x69\x73\x73\x61\x6c", icon: "🌑", faction: "\x63\x61\x6f\x73", inspiration: "\x46\x61\x66\x6e\x69\x72", role: "\x4d\x61\x6c\x64\x69\xe7\xf5\x65\x73\x20\x65\x20\x70\x6f\x64\x65\x72\x20\x73\x6f\x6d\x62\x72\x69\x6f", desc: "\x45\x73\x70\x65\x63\x69\x61\x6c\x69\x73\x74\x61\x20\x65\x6d\x20\x6d\x61\x67\x69\x61\x20\x6f\x62\x73\x63\x75\x72\x61\x2c\x20\x72\x65\x73\x69\x73\x74\xea\x6e\x63\x69\x61\x20\x65\x20\x65\x66\x65\x69\x74\x6f\x73\x20\x71\x75\x65\x20\x65\x6e\x66\x72\x61\x71\x75\x65\x63\x65\x6d\x20\x61\x64\x76\x65\x72\x73\xe1\x72\x69\x6f\x73\x2e", bonus: { hp: 45, mana: 40, atk: 6, def: 8, mag: 14, agi: 1 } },
  carmesim: { name: "\x44\x72\x61\x67\xe3\x6f\x20\x43\x61\x72\x6d\x65\x73\x69\x6d", icon: "💥", faction: "\x63\x61\x6f\x73", inspiration: "\x49\x6c\x75\x6c\x75", role: "\x46\x6f\x72\xe7\x61\x20\x65\x78\x70\x6c\x6f\x73\x69\x76\x61", desc: "\x50\x6f\x64\x65\x72\x20\x62\x72\x75\x74\x6f\x20\x65\x20\x65\x78\x70\x6c\x6f\x73\xf5\x65\x73\x20\x64\x65\x76\x61\x73\x74\x61\x64\x6f\x72\x61\x73\x2e\x20\x54\x72\x6f\x63\x61\x20\x70\x61\x72\x74\x65\x20\x64\x61\x20\x64\x65\x66\x65\x73\x61\x20\x70\x6f\x72\x20\x70\x72\x65\x73\x73\xe3\x6f\x20\x6f\x66\x65\x6e\x73\x69\x76\x61\x2e", bonus: { hp: 35, mana: 20, atk: 15, def: 2, mag: 9, agi: 3 } },
  aquatico: { name: "\x44\x72\x61\x67\xe3\x6f\x20\x41\x71\x75\xe1\x74\x69\x63\x6f", icon: "🌊", faction: "\x68\x61\x72\x6d\x6f\x6e\x69\x61", inspiration: "\x45\x6c\x6d\x61", role: "\x43\x6f\x6e\x74\x72\x6f\x6c\x65\x20\x65\x20\x65\x71\x75\x69\x6c\xed\x62\x72\x69\x6f", desc: "\x4d\x61\x6e\x69\x70\x75\x6c\x61\x20\xe1\x67\x75\x61\x20\x65\x20\x63\x6f\x6d\x62\x69\x6e\x61\x20\x64\x65\x66\x65\x73\x61\x2c\x20\x6d\x61\x67\x69\x61\x20\x65\x20\x63\x6f\x6e\x74\x72\x6f\x6c\x65\x20\x64\x6f\x20\x63\x61\x6d\x70\x6f\x20\x63\x6f\x6d\x20\x67\x72\x61\x6e\x64\x65\x20\x63\x6f\x6e\x73\x69\x73\x74\xea\x6e\x63\x69\x61\x2e", bonus: { hp: 40, mana: 45, atk: 5, def: 10, mag: 12, agi: 3 } },
  arcano: { name: "\x44\x72\x61\x67\xe3\x6f\x20\x41\x72\x63\x61\x6e\x6f", icon: "🔮", faction: "\x65\x73\x70\x65\x63\x74\x61\x64\x6f\x72", inspiration: "\x4c\x75\x63\x6f\x61", role: "\x4d\x61\x67\x69\x61\x20\x61\x76\x61\x6e\xe7\x61\x64\x61", desc: "\x55\x6d\x61\x20\x6c\x69\x6e\x68\x61\x67\x65\x6d\x20\x76\x6f\x6c\x74\x61\x64\x61\x20\xe0\x20\x6d\x61\x67\x69\x61\x2c\x20\x63\x6f\x6e\x68\x65\x63\x69\x6d\x65\x6e\x74\x6f\x20\x65\x20\x65\x66\x65\x69\x74\x6f\x73\x20\x65\x73\x70\x65\x63\x69\x61\x69\x73\x20\x69\x6d\x70\x72\x65\x76\x69\x73\xed\x76\x65\x69\x73\x2e", bonus: { hp: 30, mana: 60, atk: 2, def: 5, mag: 18, agi: 4 } },
  eletrico: { name: "\x44\x72\x61\x67\xe3\x6f\x20\x45\x6c\xe9\x74\x72\x69\x63\x6f", icon: "⚡", faction: "\x69\x6e\x64\x65\x70\x65\x6e\x64\x65\x6e\x74\x65", inspiration: "\x4b\x61\x6e\x6e\x61", role: "\x56\x65\x6c\x6f\x63\x69\x64\x61\x64\x65\x20\x65\x20\x65\x6c\x65\x74\x72\x69\x63\x69\x64\x61\x64\x65", desc: "\x43\x61\x6e\x61\x6c\x69\x7a\x61\x20\x65\x6c\x65\x74\x72\x69\x63\x69\x64\x61\x64\x65\x20\x65\x20\x76\x65\x6c\x6f\x63\x69\x64\x61\x64\x65\x2c\x20\x66\x61\x76\x6f\x72\x65\x63\x65\x6e\x64\x6f\x20\x61\x74\x61\x71\x75\x65\x73\x20\x72\xe1\x70\x69\x64\x6f\x73\x20\x65\x20\x61\x6c\x74\x6f\x20\x70\x6f\x74\x65\x6e\x63\x69\x61\x6c\x20\x64\x65\x20\x65\x73\x71\x75\x69\x76\x61\x2e", bonus: { hp: 30, mana: 35, atk: 9, def: 4, mag: 11, agi: 12 } },
};

const BASE_STATS = { hp: 100, mana: 50, atk: 10, def: 10, mag: 10, agi: 10 };
const REST_COOLDOWN_MS = 30 * 60 * 1000;


const AWAKENING_BOSS={id:"\x67\x75\x61\x72\x64\x69\x61\x6f\x5f\x64\x65\x73\x70\x65\x72\x74\x61\x72",name:"\x47\x75\x61\x72\x64\x69\xe3\x6f\x20\x64\x6f\x20\x44\x65\x73\x70\x65\x72\x74\x61\x72",icon:"🐲",level:20,hp:520,atk:42,def:22,mag:34,agi:18,xp:800,gold:[500,700],drops:[]};
const DRAGON_SKILLS={
 chamas:{name:"\x49\x6e\x66\x65\x72\x6e\x6f\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x6f",icon:"🔥",cost:20,mag:true,mult:3.10},
 abissal:{name:"\x52\x75\xed\x6e\x61\x20\x41\x62\x69\x73\x73\x61\x6c",icon:"🌑",cost:22,mag:true,mult:3.00},
 carmesim:{name:"\x46\xfa\x72\x69\x61\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x61",icon:"\u2764\ufe0f\u200d\ud83d",cost:20,mag:false,mult:3.20},
 aquatico:{name:"\x4d\x61\x72\xe9\x20\x43\x65\x6c\x65\x73\x74\x69\x61\x6c",icon:"🌊",cost:18,mag:true,mult:2.90},
 arcano:{name:"\x45\x63\x6c\x69\x70\x73\x65\x20\x41\x72\x63\x61\x6e\x6f",icon:"🌌",cost:24,mag:true,mult:3.35},
 eletrico:{name:"\x54\x72\x6f\x76\xe3\x6f\x20\x43\x65\x6c\x65\x73\x74\x69\x61\x6c",icon:"⚡",cost:19,mag:true,mult:3.00}
};
const RPG_ITEMS = {
  espada_ferro:{id:"\x65\x73\x70\x61\x64\x61\x5f\x66\x65\x72\x72\x6f",name:"\x45\x73\x70\x61\x64\x61\x20\x64\x65\x20\x46\x65\x72\x72\x6f",icon:"\ud83d\ufe0f",type:"\x77\x65\x61\x70\x6f\x6e",rarity:"\x43\x6f\x6d\x75\x6d",price:120,minLevel:1,bonus:{atk:5}},
  espada_draconica:{id:"\x65\x73\x70\x61\x64\x61\x5f\x64\x72\x61\x63\x6f\x6e\x69\x63\x61",name:"\x45\x73\x70\x61\x64\x61\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x61",icon:"🐉",type:"\x77\x65\x61\x70\x6f\x6e",rarity:"\xc9\x70\x69\x63\x6f",price:1250,minLevel:15,classes:["\x67\x75\x65\x72\x72\x65\x69\x72\x6f","\x65\x73\x63\x75\x64\x65\x69\x72\x6f"],bonus:{atk:18,def:4}},
  cajado_arcano:{id:"\x63\x61\x6a\x61\x64\x6f\x5f\x61\x72\x63\x61\x6e\x6f",name:"\x43\x61\x6a\x61\x64\x6f\x20\x41\x72\x63\x61\x6e\x6f",icon:"🪄",type:"\x77\x65\x61\x70\x6f\x6e",rarity:"\x52\x61\x72\x6f",price:680,minLevel:8,classes:["\x6d\x61\x67\x6f","\x63\x75\x72\x61\x6e\x64\x65\x69\x72\x6f"],bonus:{mag:14,mana:20}},
  arco_vento:{id:"\x61\x72\x63\x6f\x5f\x76\x65\x6e\x74\x6f",name:"\x41\x72\x63\x6f\x20\x64\x6f\x20\x56\x65\x6e\x74\x6f",icon:"🏹",type:"\x77\x65\x61\x70\x6f\x6e",rarity:"\x52\x61\x72\x6f",price:650,minLevel:8,classes:["\x61\x72\x71\x75\x65\x69\x72\x6f"],bonus:{atk:10,agi:8}},
  armadura_ferro:{id:"\x61\x72\x6d\x61\x64\x75\x72\x61\x5f\x66\x65\x72\x72\x6f",name:"\x41\x72\x6d\x61\x64\x75\x72\x61\x20\x64\x65\x20\x46\x65\x72\x72\x6f",icon:"\ud83d\ufe0f",type:"\x61\x72\x6d\x6f\x72",rarity:"\x43\x6f\x6d\x75\x6d",price:180,minLevel:2,bonus:{hp:20,def:7}},
  manto_arcano:{id:"\x6d\x61\x6e\x74\x6f\x5f\x61\x72\x63\x61\x6e\x6f",name:"\x4d\x61\x6e\x74\x6f\x20\x41\x72\x63\x61\x6e\x6f",icon:"🥋",type:"\x61\x72\x6d\x6f\x72",rarity:"\x52\x61\x72\x6f",price:720,minLevel:8,classes:["\x6d\x61\x67\x6f","\x63\x75\x72\x61\x6e\x64\x65\x69\x72\x6f"],bonus:{mana:25,def:4,mag:6}},
  armadura_draconica:{id:"\x61\x72\x6d\x61\x64\x75\x72\x61\x5f\x64\x72\x61\x63\x6f\x6e\x69\x63\x61",name:"\x41\x72\x6d\x61\x64\x75\x72\x61\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x61",icon:"🐲",type:"\x61\x72\x6d\x6f\x72",rarity:"\x4c\x65\x6e\x64\xe1\x72\x69\x6f",price:2200,minLevel:20,bonus:{hp:60,def:18,atk:5}},
  amuleto_agilidade:{id:"\x61\x6d\x75\x6c\x65\x74\x6f\x5f\x61\x67\x69\x6c\x69\x64\x61\x64\x65",name:"\x41\x6d\x75\x6c\x65\x74\x6f\x20\x64\x61\x20\x41\x67\x69\x6c\x69\x64\x61\x64\x65",icon:"💨",type:"\x61\x63\x63\x65\x73\x73\x6f\x72\x79",rarity:"\x49\x6e\x63\x6f\x6d\x75\x6d",price:350,minLevel:5,bonus:{agi:8}},
  cristal_mana:{id:"\x63\x72\x69\x73\x74\x61\x6c\x5f\x6d\x61\x6e\x61",name:"\x43\x72\x69\x73\x74\x61\x6c\x20\x64\x65\x20\x4d\x61\x6e\x61",icon:"💎",type:"\x61\x63\x63\x65\x73\x73\x6f\x72\x79",rarity:"\x52\x61\x72\x6f",price:700,minLevel:8,bonus:{mana:30,mag:7}},
  coracao_dragao:{id:"\x63\x6f\x72\x61\x63\x61\x6f\x5f\x64\x72\x61\x67\x61\x6f",name:"\x43\x6f\x72\x61\xe7\xe3\x6f\x20\x64\x65\x20\x44\x72\x61\x67\xe3\x6f",icon:"\u2764\ufe0f\u200d\ud83d",type:"\x61\x63\x63\x65\x73\x73\x6f\x72\x79",rarity:"\x44\x72\x61\x63\xf4\x6e\x69\x63\x6f",price:3200,minLevel:30,dragonRequired:true,bonus:{hp:50,mana:40,atk:8,def:8,mag:8,agi:5}},
  pocao_pequena:{id:"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61",name:"\x50\x6f\xe7\xe3\x6f\x20\x64\x65\x20\x48\x50",icon:"\u2764\ufe0f\u200d\ud83e",type:"\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c",rarity:"\x43\x6f\x6d\x75\x6d",price:35,minLevel:1,effect:{heal:45}},
  pocao_mana:{id:"\x70\x6f\x63\x61\x6f\x5f\x6d\x61\x6e\x61",name:"\x50\x6f\xe7\xe3\x6f\x20\x64\x65\x20\x4d\x61\x6e\x61",icon:"🔷",type:"\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c",rarity:"\x43\x6f\x6d\x75\x6d",price:40,minLevel:1,effect:{mana:40}},
  pocao_forca:{id:"\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\x63\x61",name:"\x50\x6f\xe7\xe3\x6f\x20\x64\x65\x20\x46\x6f\x72\xe7\x61",icon:"💪",type:"\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c",rarity:"\x49\x6e\x63\x6f\x6d\x75\x6d",price:75,minLevel:3,effect:{nextAttackMult:1.5}},
  pao_aventureiro:{id:"\x70\x61\x6f\x5f\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f",name:"\x50\xe3\x6f\x20\x64\x65\x20\x41\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f",icon:"🥖",type:"\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c",rarity:"\x43\x6f\x6d\x75\x6d",price:20,minLevel:1,effect:{heal:20,mana:10}}
};
const RPG_SKILLS = {
 escudeiro:[{id:"\x65\x73\x63\x75\x64\x6f",name:"\x47\x6f\x6c\x70\x65\x20\x64\x65\x20\x45\x73\x63\x75\x64\x6f",icon:"\ud83d\ufe0f",level:1,cost:8,mag:false,mult:1.35},{id:"\x66\x6f\x72\x74\x61\x6c\x65\x7a\x61",name:"\x46\x6f\x72\x74\x61\x6c\x65\x7a\x61",icon:"🏰",level:5,cost:14,defend:true},{id:"\x69\x6d\x70\x61\x63\x74\x6f",name:"\x49\x6d\x70\x61\x63\x74\x6f\x20\x64\x6f\x20\x47\x75\x61\x72\x64\x69\xe3\x6f",icon:"💥",level:12,cost:22,mag:false,mult:2.25}],
 guerreiro:[{id:"\x63\x6f\x72\x74\x65",name:"\x43\x6f\x72\x74\x65\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x6f",icon:"⚔️",level:1,cost:9,mag:false,mult:1.65},{id:"\x66\x75\x72\x69\x61",name:"\x46\xfa\x72\x69\x61\x20\x43\x61\x72\x6d\x65\x73\x69\x6d",icon:"🔥",level:6,cost:16,mag:false,mult:2.05},{id:"\x65\x78\x65\x63\x75\x74\x6f\x72",name:"\x47\x6f\x6c\x70\x65\x20\x45\x78\x65\x63\x75\x74\x6f\x72",icon:"💢",level:14,cost:25,mag:false,mult:2.75}],
 mago:[{id:"\x65\x78\x70\x6c\x6f\x73\x61\x6f",name:"\x45\x78\x70\x6c\x6f\x73\xe3\x6f\x20\x41\x72\x63\x61\x6e\x61",icon:"🔮",level:1,cost:14,mag:true,mult:1.85},{id:"\x6d\x65\x74\x65\x6f\x72\x6f",name:"\x4d\x65\x74\x65\x6f\x72\x6f\x20\x4d\xe1\x67\x69\x63\x6f",icon:"☄️",level:7,cost:24,mag:true,mult:2.45},{id:"\x63\x61\x74\x61\x63\x6c\x69\x73\x6d\x6f",name:"\x43\x61\x74\x61\x63\x6c\x69\x73\x6d\x6f\x20\x41\x72\x63\x61\x6e\x6f",icon:"🌌",level:16,cost:38,mag:true,mult:3.25}],
 arqueiro:[{id:"\x66\x6c\x65\x63\x68\x61",name:"\x46\x6c\x65\x63\x68\x61\x20\x56\x65\x6c\x6f\x7a",icon:"🏹",level:1,cost:10,mag:false,mult:1.55},{id:"\x74\x72\x69\x70\x6c\x6f",name:"\x44\x69\x73\x70\x61\x72\x6f\x20\x54\x72\x69\x70\x6c\x6f",icon:"🎯",level:6,cost:18,mag:false,mult:2.15},{id:"\x74\x65\x6d\x70\x65\x73\x74\x61\x64\x65",name:"\x54\x65\x6d\x70\x65\x73\x74\x61\x64\x65\x20\x64\x65\x20\x46\x6c\x65\x63\x68\x61\x73",icon:"\ud83c\ufe0f",level:15,cost:29,mag:false,mult:2.85}],
 curandeiro:[{id:"\x63\x75\x72\x61",name:"\x4c\x75\x7a\x20\x52\x65\x73\x74\x61\x75\x72\x61\x64\x6f\x72\x61",icon:"🌿",level:1,cost:12,heal:true,healMult:1.4},{id:"\x63\x75\x72\x61\x5f\x6d\x61\x69\x6f\x72",name:"\x42\x65\x6e\xe7\xe3\x6f\x20\x56\x69\x74\x61\x6c",icon:"✨",level:7,cost:22,heal:true,healMult:2.15},{id:"\x6a\x75\x6c\x67\x61\x6d\x65\x6e\x74\x6f",name:"\x4a\x75\x6c\x67\x61\x6d\x65\x6e\x74\x6f\x20\x53\x61\x67\x72\x61\x64\x6f",icon:"☀️",level:15,cost:30,mag:true,mult:2.65}]
};

const REGIONS = {
  floresta: { name: "\x46\x6c\x6f\x72\x65\x73\x74\x61\x20\x64\x65\x20\x45\x6c\x6d\x61", icon: "🌲", min: 1, max: 5, desc: "\x55\x6d\x61\x20\x6d\x61\x74\x61\x20\xfa\x6d\x69\x64\x61\x20\x65\x20\x72\x65\x6c\x61\x74\x69\x76\x61\x6d\x65\x6e\x74\x65\x20\x73\x65\x67\x75\x72\x61\x20\x70\x61\x72\x61\x20\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f\x73\x20\x69\x6e\x69\x63\x69\x61\x6e\x74\x65\x73\x2e" },
  ruinas: { name: "\x52\x75\xed\x6e\x61\x73\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x61\x73", icon: "\ud83c\ufe0f", min: 5, max: 10, desc: "\x50\x65\x64\x72\x61\x73\x20\x61\x6e\x74\x69\x67\x61\x73\x2c\x20\x61\x72\x6d\x61\x64\x69\x6c\x68\x61\x73\x20\x65\x20\x63\x72\x69\x61\x74\x75\x72\x61\x73\x20\x71\x75\x65\x20\x70\x72\x6f\x74\x65\x67\x65\x6d\x20\x72\x65\x73\x74\x6f\x73\x20\x64\x65\x20\x75\x6d\x61\x20\x65\x72\x61\x20\x65\x73\x71\x75\x65\x63\x69\x64\x61\x2e" },
  vale: { name: "\x56\x61\x6c\x65\x20\x64\x61\x73\x20\x43\x68\x61\x6d\x61\x73", icon: "🌋", min: 10, max: 20, desc: "\x54\x65\x72\x72\x61\x20\x76\x75\x6c\x63\xe2\x6e\x69\x63\x61\x20\x6f\x6e\x64\x65\x20\x6d\x6f\x6e\x73\x74\x72\x6f\x73\x20\x72\x65\x73\x69\x73\x74\x65\x6e\x74\x65\x73\x20\x61\x6f\x20\x63\x61\x6c\x6f\x72\x20\x64\x6f\x6d\x69\x6e\x61\x6d\x20\x61\x73\x20\x74\x72\x69\x6c\x68\x61\x73\x2e" },
  abismo: { name: "\x41\x62\x69\x73\x6d\x6f\x20\x64\x65\x20\x46\x61\x66\x6e\x69\x72", icon: "🌑", min: 20, max: 35, desc: "\x55\x6d\x61\x20\x72\x65\x67\x69\xe3\x6f\x20\x61\x6d\x61\x6c\x64\x69\xe7\x6f\x61\x64\x61\x20\x70\x61\x72\x61\x20\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f\x73\x20\x65\x78\x70\x65\x72\x69\x65\x6e\x74\x65\x73\x2e" },
  reino: { name: "\x52\x65\x69\x6e\x6f\x20\x64\x6f\x73\x20\x44\x72\x61\x67\xf5\x65\x73", icon: "🐉", min: 30, max: 99, desc: "\x4f\x20\x74\x65\x72\x72\x69\x74\xf3\x72\x69\x6f\x20\x6d\x61\x69\x73\x20\x70\x65\x72\x69\x67\x6f\x73\x6f\x20\x64\x6f\x20\x44\x72\x61\x67\x6f\x6e\x20\x52\x50\x47\x2c\x20\x72\x65\x73\x65\x72\x76\x61\x64\x6f\x20\x70\x61\x72\x61\x20\x67\x72\x61\x6e\x64\x65\x73\x20\x67\x75\x65\x72\x72\x65\x69\x72\x6f\x73\x20\x65\x20\x64\x72\x61\x67\xf5\x65\x73\x20\x64\x65\x73\x70\x65\x72\x74\x6f\x73\x2e" },
};

const MONSTERS = {
  slime: { id:"\x73\x6c\x69\x6d\x65", name:"\x53\x6c\x69\x6d\x65\x20\x4d\xe1\x67\x69\x63\x6f", icon:"🟢", regions:["\x66\x6c\x6f\x72\x65\x73\x74\x61"], level:[1,3], hp:48, atk:8, def:3, mag:5, agi:4, xp:28, gold:[8,16], drops:[{id:"\x67\x65\x6c\x5f\x6d\x61\x67\x69\x63\x6f",name:"\x47\x65\x6c\x20\x4d\xe1\x67\x69\x63\x6f",icon:"🧫",chance:.55}] },
  goblin: { id:"\x67\x6f\x62\x6c\x69\x6e", name:"\x47\x6f\x62\x6c\x69\x6e\x20\x53\x61\x71\x75\x65\x61\x64\x6f\x72", icon:"👺", regions:["\x66\x6c\x6f\x72\x65\x73\x74\x61","\x72\x75\x69\x6e\x61\x73"], level:[2,7], hp:68, atk:12, def:6, mag:2, agi:8, xp:42, gold:[12,24], drops:[{id:"\x70\x72\x65\x73\x61\x5f\x67\x6f\x62\x6c\x69\x6e",name:"\x50\x72\x65\x73\x61\x20\x64\x65\x20\x47\x6f\x62\x6c\x69\x6e",icon:"🦷",chance:.4}] },
  lobo: { id:"\x6c\x6f\x62\x6f", name:"\x4c\x6f\x62\x6f\x20\x53\x6f\x6d\x62\x72\x69\x6f", icon:"🐺", regions:["\x66\x6c\x6f\x72\x65\x73\x74\x61","\x72\x75\x69\x6e\x61\x73"], level:[3,8], hp:78, atk:14, def:5, mag:4, agi:13, xp:50, gold:[14,28], drops:[{id:"\x70\x65\x6c\x65\x5f\x73\x6f\x6d\x62\x72\x69\x61",name:"\x50\x65\x6c\x65\x20\x53\x6f\x6d\x62\x72\x69\x61",icon:"🧶",chance:.38}] },
  orc: { id:"\x6f\x72\x63", name:"\x4f\x72\x63\x20\x64\x61\x73\x20\x52\x75\xed\x6e\x61\x73", icon:"👹", regions:["\x72\x75\x69\x6e\x61\x73","\x76\x61\x6c\x65"], level:[7,14], hp:125, atk:21, def:12, mag:3, agi:5, xp:78, gold:[24,42], drops:[{id:"\x66\x65\x72\x72\x6f\x5f\x6f\x72\x63",name:"\x46\x65\x72\x72\x6f\x20\x4f\x72\x63",icon:"⛓️",chance:.42}] },
  elemental: { id:"\x65\x6c\x65\x6d\x65\x6e\x74\x61\x6c", name:"\x45\x6c\x65\x6d\x65\x6e\x74\x61\x6c\x20\x64\x65\x20\x46\x6f\x67\x6f", icon:"🔥", regions:["\x76\x61\x6c\x65"], level:[11,20], hp:155, atk:20, def:10, mag:25, agi:10, xp:110, gold:[32,55], drops:[{id:"\x6e\x75\x63\x6c\x65\x6f\x5f\x66\x6f\x67\x6f",name:"\x4e\xfa\x63\x6c\x65\x6f\x20\x64\x65\x20\x46\x6f\x67\x6f",icon:"🔸",chance:.36}] },
  wyvern: { id:"\x77\x79\x76\x65\x72\x6e", name:"\x57\x79\x76\x65\x72\x6e\x20\x53\x65\x6c\x76\x61\x67\x65\x6d", icon:"🐲", regions:["\x76\x61\x6c\x65","\x61\x62\x69\x73\x6d\x6f"], level:[15,28], hp:220, atk:32, def:18, mag:15, agi:18, xp:175, gold:[55,90], drops:[{id:"\x65\x73\x63\x61\x6d\x61\x5f\x77\x79\x76\x65\x72\x6e",name:"\x45\x73\x63\x61\x6d\x61\x20\x64\x65\x20\x57\x79\x76\x65\x72\x6e",icon:"🐲",chance:.3}] },
  espectro: { id:"\x65\x73\x70\x65\x63\x74\x72\x6f", name:"\x45\x73\x70\x65\x63\x74\x72\x6f\x20\x41\x6d\x61\x6c\x64\x69\xe7\x6f\x61\x64\x6f", icon:"👻", regions:["\x61\x62\x69\x73\x6d\x6f"], level:[21,32], hp:235, atk:26, def:14, mag:38, agi:17, xp:205, gold:[65,105], drops:[{id:"\x65\x73\x73\x65\x6e\x63\x69\x61\x5f\x61\x62\x69\x73\x73\x61\x6c",name:"\x45\x73\x73\xea\x6e\x63\x69\x61\x20\x41\x62\x69\x73\x73\x61\x6c",icon:"🌑",chance:.3}] },
  dragao_selvagem: { id:"\x64\x72\x61\x67\x61\x6f\x5f\x73\x65\x6c\x76\x61\x67\x65\x6d", name:"\x44\x72\x61\x67\xe3\x6f\x20\x53\x65\x6c\x76\x61\x67\x65\x6d", icon:"🐉", regions:["\x72\x65\x69\x6e\x6f"], level:[30,45], hp:390, atk:48, def:30, mag:38, agi:24, xp:360, gold:[110,180], drops:[{id:"\x65\x73\x63\x61\x6d\x61\x5f\x64\x72\x61\x63\x6f\x6e\x69\x63\x61",name:"\x45\x73\x63\x61\x6d\x61\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x61",icon:"💠",chance:.28}] },
};

const QUESTS = {
  q_slimes: { id:"\x71\x5f\x73\x6c\x69\x6d\x65\x73", title:"\x50\x72\x69\x6d\x65\x69\x72\x6f\x73\x20\x50\x61\x73\x73\x6f\x73", desc:"\x44\x65\x72\x72\x6f\x74\x65\x20\x33\x20\x53\x6c\x69\x6d\x65\x73\x20\x4d\xe1\x67\x69\x63\x6f\x73\x2e", type:"\x6b\x69\x6c\x6c", monster:"\x73\x6c\x69\x6d\x65", target:3, minLevel:1, xp:120, gold:80, item:{id:"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61",name:"\x50\x6f\xe7\xe3\x6f\x20\x50\x65\x71\x75\x65\x6e\x61",icon:"🧪",qty:2,type:"\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c"} },
  q_floresta: { id:"\x71\x5f\x66\x6c\x6f\x72\x65\x73\x74\x61", title:"\x47\x75\x61\x72\x64\x69\xe3\x6f\x20\x64\x61\x20\x46\x6c\x6f\x72\x65\x73\x74\x61", desc:"\x44\x65\x72\x72\x6f\x74\x65\x20\x35\x20\x63\x72\x69\x61\x74\x75\x72\x61\x73\x20\x6e\x61\x20\x46\x6c\x6f\x72\x65\x73\x74\x61\x20\x64\x65\x20\x45\x6c\x6d\x61\x2e", type:"\x72\x65\x67\x69\x6f\x6e\x4b\x69\x6c\x6c\x73", region:"\x66\x6c\x6f\x72\x65\x73\x74\x61", target:5, minLevel:2, xp:180, gold:110 },
  q_ruinas: { id:"\x71\x5f\x72\x75\x69\x6e\x61\x73", title:"\x45\x63\x6f\x73\x20\x64\x61\x73\x20\x52\x75\xed\x6e\x61\x73", desc:"\x44\x65\x72\x72\x6f\x74\x65\x20\x33\x20\x63\x72\x69\x61\x74\x75\x72\x61\x73\x20\x6e\x61\x73\x20\x52\x75\xed\x6e\x61\x73\x20\x44\x72\x61\x63\xf4\x6e\x69\x63\x61\x73\x2e", type:"\x72\x65\x67\x69\x6f\x6e\x4b\x69\x6c\x6c\x73", region:"\x72\x75\x69\x6e\x61\x73", target:3, minLevel:5, xp:240, gold:160 },
  q_wyvern: { id:"\x71\x5f\x77\x79\x76\x65\x72\x6e", title:"\x43\x61\xe7\x61\x64\x6f\x72\x20\x64\x65\x20\x57\x79\x76\x65\x72\x6e", desc:"\x44\x65\x72\x72\x6f\x74\x65\x20\x31\x20\x57\x79\x76\x65\x72\x6e\x20\x53\x65\x6c\x76\x61\x67\x65\x6d\x2e", type:"\x6b\x69\x6c\x6c", monster:"\x77\x79\x76\x65\x72\x6e", target:1, minLevel:12, xp:420, gold:300, item:{id:"\x65\x73\x63\x61\x6d\x61\x5f\x77\x79\x76\x65\x72\x6e",name:"\x45\x73\x63\x61\x6d\x61\x20\x64\x65\x20\x57\x79\x76\x65\x72\x6e",icon:"🐲",qty:1,type:"\x6d\x61\x74\x65\x72\x69\x61\x6c"} },
};

function normalizeUser(jid = "") { return String(jid || "").trim(); }
function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ version: 2, players: {} }, null, 2), "\x75\x74\x66\x38");
}
function migratePlayer(p){
  if(!p) return p;
  p.stats = { ...BASE_STATS, ...(p.stats || {}) };
  p.level = Math.max(1, Number(p.level)||1); p.xp=Number(p.xp)||0; p.xpNext=Number(p.xpNext)||xpNeeded(p.level); p.gold=Number(p.gold)||0;
  p.inventory = Array.isArray(p.inventory) ? p.inventory : [];
  p.equipment = p.equipment || {weapon:null,armor:null,accessory:null};
  for (const slot of ["\x77\x65\x61\x70\x6f\x6e","\x61\x72\x6d\x6f\x72","\x61\x63\x63\x65\x73\x73\x6f\x72\x79"]) if (p.equipment[slot] && typeof p.equipment[slot] === "\x6f\x62\x6a\x65\x63\x74") p.equipment[slot] = p.equipment[slot].id || null;
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
  try { const parsed = JSON.parse(fs.readFileSync(DB_PATH, "\x75\x74\x66\x38")); if (!parsed.players || typeof parsed.players !== "\x6f\x62\x6a\x65\x63\x74") parsed.players = {}; parsed.version=2; for(const k of Object.keys(parsed.players)) migratePlayer(parsed.players[k]); return parsed; }
  catch { return { version: 2, players: {} }; }
}
function writeDb(db) { ensureDb(); db.version=2; const tmp = `${DB_PATH}.tmp`; fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "\x75\x74\x66\x38"); fs.renameSync(tmp, DB_PATH); }

function onlyDigitsRpg(value = "") {
  return String(value || "").replace(/\D/g, "");
}

function backupDragonRpgDb(label = "\x6d\x61\x6e\x75\x61\x6c") {
  ensureDb();
  const backupDir = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x62\x61\x63\x6b\x75\x70\x73", "\x64\x72\x61\x67\x6f\x6e\x2d\x72\x70\x67");
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeLabel = String(label || "\x6d\x61\x6e\x75\x61\x6c").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
  const backupPath = path.join(backupDir, `dragon-rpg-${safeLabel}-${stamp}.json`);
  fs.copyFileSync(DB_PATH, backupPath);
  return backupPath;
}

export function resetDragonRpgUsers(jids = [], label = "\x67\x72\x75\x70\x6f") {
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

export function resetAllDragonRpg(label = "\x67\x6c\x6f\x62\x61\x6c") {
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
function makePlayer(jid, name = "\x41\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f") {
  const now = new Date().toISOString();
  return migratePlayer({ jid, name: String(name || "\x41\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f").slice(0, 40), createdAt: now, updatedAt: now, level: 1, xp: 0, xpNext: 100, gold: 100, class: null, classChosenAt: null, faction: null, dragonClass: null, awakening: { unlocked: false, started: false, completed: false, startedAt: null, completedAt: null }, stats: { ...BASE_STATS }, resources:{hp:100,mana:50}, statPoints:0, skillPoints:0, advancedClass:null, specialties:{combat:0,stealth:0,survival:0,arcana:0}, inventory: [{ id: "\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61", name: "\x50\x6f\xe7\xe3\x6f\x20\x50\x65\x71\x75\x65\x6e\x61", icon: "🧪", qty: 2, type: "\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c" }, { id: "\x70\x61\x6f\x5f\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f", name: "\x50\xe3\x6f\x20\x64\x65\x20\x41\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f", icon: "🥖", qty: 1, type: "\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c" }], equipment: { weapon: null, armor: null, accessory: null }, combat:null, rpgStats:{battles:0,wins:0,losses:0,escapes:0,monstersDefeated:0,damageDealt:0,damageTaken:0}, quests:{active:{},completed:[]}, lastRestAt:0, buffs:{nextAttackMult:0} });
}
export function getDragonRpgPlayer(jid) { const db = readDb(); return db.players[normalizeUser(jid)] || null; }
export function createDragonRpgPlayer(jid, name) { const key = normalizeUser(jid); const db = readDb(); if (db.players[key]) return { created: false, player: db.players[key] }; const player = makePlayer(key, name); db.players[key] = player; writeDb(db); return { created: true, player }; }
function savePlayer(player) { const db = readDb(); player.updatedAt = new Date().toISOString(); db.players[normalizeUser(player.jid)] = migratePlayer(player); writeDb(db); return player; }
function addStats(stats, bonus) { for (const key of Object.keys(BASE_STATS)) stats[key] = Number(stats[key] || 0) + Number(bonus?.[key] || 0); }
function addItem(player,item,qty=1){ if(!item||qty<=0)return; const id=item.id; let ex=player.inventory.find(x=>x.id===id); if(ex) ex.qty=Number(ex.qty||0)+qty; else player.inventory.push({...item,qty}); }

function applyEquipmentBonus(p,i,sign=1){if(!i?.bonus)return;for(const[k,v]of Object.entries(i.bonus))p.stats[k]=Math.max(1,Number(p.stats[k]||0)+Number(v||0)*sign);p.resources.hp=Math.min(p.resources.hp,p.stats.hp);p.resources.mana=Math.min(p.resources.mana,p.stats.mana);}
export function getRpgShop(){return Object.values(RPG_ITEMS);}
export function buyRpgItem(jid,id,qty=1){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};const i=RPG_ITEMS[String(id||"").toLowerCase()];if(!i)return{ok:false,reason:"\x69\x6e\x76\x61\x6c\x69\x64"};const n=clamp(parseInt(qty)||1,1,10);if(p.level<i.minLevel)return{ok:false,reason:"\x6c\x65\x76\x65\x6c",required:i.minLevel};if(i.dragonRequired&&!p.dragonClass)return{ok:false,reason:"\x64\x72\x61\x67\x6f\x6e"};if(i.classes&&!i.classes.includes(p.class))return{ok:false,reason:"\x63\x6c\x61\x73\x73"};const total=i.price*n;if(p.gold<total)return{ok:false,reason:"\x67\x6f\x6c\x64",required:total,current:p.gold};p.gold-=total;addItem(p,i,n);savePlayer(p);return{ok:true,item:i,qty:n,total,player:p};}
export function equipRpgItem(jid,id){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(p.combat)return{ok:false,reason:"\x63\x6f\x6d\x62\x61\x74"};const i=RPG_ITEMS[String(id||"").toLowerCase()];if(!i)return{ok:false,reason:"\x69\x6e\x76\x61\x6c\x69\x64"};if(!["\x77\x65\x61\x70\x6f\x6e","\x61\x72\x6d\x6f\x72","\x61\x63\x63\x65\x73\x73\x6f\x72\x79"].includes(i.type))return{ok:false,reason:"\x74\x79\x70\x65"};if(!p.inventory.find(x=>x.id===i.id&&Number(x.qty)>0))return{ok:false,reason:"\x69\x6e\x76\x65\x6e\x74\x6f\x72\x79"};if(p.level<i.minLevel)return{ok:false,reason:"\x6c\x65\x76\x65\x6c",required:i.minLevel};if(i.dragonRequired&&!p.dragonClass)return{ok:false,reason:"\x64\x72\x61\x67\x6f\x6e"};if(i.classes&&!i.classes.includes(p.class))return{ok:false,reason:"\x63\x6c\x61\x73\x73"};const oldId=p.equipment[i.type];if(oldId===i.id)return{ok:false,reason:"\x61\x6c\x72\x65\x61\x64\x79"};if(oldId&&RPG_ITEMS[oldId])applyEquipmentBonus(p,RPG_ITEMS[oldId],-1);p.equipment[i.type]=i.id;applyEquipmentBonus(p,i,1);savePlayer(p);return{ok:true,item:i,old:oldId?RPG_ITEMS[oldId]:null,player:p};}
export function unequipRpgItem(jid,key){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(p.combat)return{ok:false,reason:"\x63\x6f\x6d\x62\x61\x74"};let slot=String(key||"").toLowerCase();slot=({arma:"\x77\x65\x61\x70\x6f\x6e",armadura:"\x61\x72\x6d\x6f\x72",acessorio:"\x61\x63\x63\x65\x73\x73\x6f\x72\x79","\x61\x63\x65\x73\x73\xf3\x72\x69\x6f":"\x61\x63\x63\x65\x73\x73\x6f\x72\x79"})[slot]||slot;if(!["\x77\x65\x61\x70\x6f\x6e","\x61\x72\x6d\x6f\x72","\x61\x63\x63\x65\x73\x73\x6f\x72\x79"].includes(slot))slot=["\x77\x65\x61\x70\x6f\x6e","\x61\x72\x6d\x6f\x72","\x61\x63\x63\x65\x73\x73\x6f\x72\x79"].find(x=>p.equipment[x]===slot);if(!slot||!p.equipment[slot])return{ok:false,reason:"\x65\x6d\x70\x74\x79"};const i=RPG_ITEMS[p.equipment[slot]];if(i)applyEquipmentBonus(p,i,-1);p.equipment[slot]=null;savePlayer(p);return{ok:true,item:i,slot,player:p};}
export function getRpgSkills(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};return{ok:true,player:p,skills:(RPG_SKILLS[p.class]||[]).map(x=>({...x,unlocked:p.level>=x.level}))};}
export function formatRpgShop(prefix="/"){return `╭━━〔 🏪 *LOJA DRAGON RPG* 〕━━╮\n${Object.values(RPG_ITEMS).map(i=>`┃ ${i.icon} *${i.id}* — 🪙 ${i.price}\n┃ ${i.rarity} • Lv.${i.minLevel}${i.bonus?` • ${Object.entries(i.bonus).map(([k,v])=>`${k.toUpperCase()}+${v}`).join(" ")}`:""}`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nComprar: *${prefix}comprarrpg espada_ferro*`;}
export function formatRpgEquipment(p,prefix="/"){p=migratePlayer(p);const row=(sl,l)=>{const i=RPG_ITEMS[p.equipment?.[sl]];return`┃ ${l}: ${i?`${i.icon} *${i.name}* [${i.rarity}]`:"\x2a\x4e\x65\x6e\x68\x75\x6d\x2a"}`};return`╭━━〔 ⚔️ *EQUIPAMENTOS* 〕━━╮\n${row("\x77\x65\x61\x70\x6f\x6e","\ud83d\ufe0f\x20\x41\x72\x6d\x61")}\n${row("\x61\x72\x6d\x6f\x72","\ud83d\ufe0f\x20\x41\x72\x6d\x61\x64\x75\x72\x61")}\n${row("\x61\x63\x63\x65\x73\x73\x6f\x72\x79","\ud83d\x20\x41\x63\x65\x73\x73\xf3\x72\x69\x6f")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n📦 *${prefix}equipar <id>*\n↩️ *${prefix}desequipar arma|armadura|acessorio*`;}
export function formatRpgSkills(jid,prefix="/"){const r=getRpgSkills(jid);if(!r.ok)return null;return`╭━━〔 ✨ *HABILIDADES • ${HUMAN_CLASSES[r.player.class]?.name||"\x53\x45\x4d\x20\x43\x4c\x41\x53\x53\x45"}* 〕━━╮\n${r.skills.map(x=>`┃ ${x.unlocked?"✅":"🔒"} ${x.icon} *${x.id}* — ${x.name}\n┃ Lv.${x.level} • 🔷 ${x.cost} Mana`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nUse: *${prefix}habilidade <id>*`;}

export function chooseHumanClass(jid, classKey) {
  const key = String(classKey || "").toLowerCase(); const klass = HUMAN_CLASSES[key];
  if (!klass) return { ok: false, reason: "\x69\x6e\x76\x61\x6c\x69\x64" }; const player = getDragonRpgPlayer(jid);
  if (!player) return { ok: false, reason: "\x6d\x69\x73\x73\x69\x6e\x67" }; if (player.class) return { ok: false, reason: "\x61\x6c\x72\x65\x61\x64\x79", player };
  player.class = key; player.classChosenAt = new Date().toISOString(); addStats(player.stats, klass.bonus); player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; savePlayer(player); return { ok: true, player, klass };
}

function advancedRequirements(player,key){const c=ADVANCED_HUMAN_CLASSES[key];if(!c)return null;const r=c.requires||{},kills=Number(player.rpgStats?.monstersDefeated||0);const checks=[{name:`Nível RPG ${r.level}`,ok:player.level>=r.level},{name:`${r.kills} inimigos derrotados`,ok:kills>=r.kills},{name:`Classe base: ${(r.baseClasses||[]).map(x=>HUMAN_CLASSES[x]?.name||x).join("\x20\x2f\x20")}`,ok:(r.baseClasses||[]).includes(player.class)}];if(r.stealth)checks.push({name:`Furtividade ${r.stealth}`,ok:player.specialties.stealth>=r.stealth});if(r.defense)checks.push({name:`DEF ${r.defense}`,ok:player.stats.def>=r.defense});if(r.magic)checks.push({name:`MAG ${r.magic}`,ok:player.stats.mag>=r.magic});return checks;}
export function getAdvancedClassProgress(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};return{ok:true,player:p,classes:Object.entries(ADVANCED_HUMAN_CLASSES).map(([key,c])=>({key,...c,checks:advancedRequirements(p,key)}))};}
export function chooseAdvancedClass(jid,classKey){const key=String(classKey||"").toLowerCase(),c=ADVANCED_HUMAN_CLASSES[key];if(!c)return{ok:false,reason:"\x69\x6e\x76\x61\x6c\x69\x64"};const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(p.advancedClass)return{ok:false,reason:"\x61\x6c\x72\x65\x61\x64\x79",player:p};const checks=advancedRequirements(p,key),missing=checks.filter(x=>!x.ok);if(missing.length)return{ok:false,reason:"\x72\x65\x71\x75\x69\x72\x65\x6d\x65\x6e\x74\x73",missing,klass:c,player:p};p.advancedClass=key;addStats(p.stats,c.bonus);p.resources.hp=p.stats.hp;p.resources.mana=p.stats.mana;savePlayer(p);return{ok:true,player:p,klass:c};}
export function formatAdvancedClasses(jid,prefix="/"){const r=getAdvancedClassProgress(jid);if(!r.ok)return null;return `╭━━〔 🌟 *CLASSES AVANÇADAS* 〕━━╮\n${r.classes.map(c=>`┃ ${c.icon} *${c.name}*\n${c.checks.map(x=>`┃ ${x.ok?"✅":"🔒"} ${x.name}`).join("\n")}\n┃ ➜ ${prefix}classeavancada ${c.key}`).join("\n┣━━━━━━━━━━━━━━━━━━━━━━\n")}\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;}

export function startDragonAwakening(jid, socialLevel = 0) {
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "\x6d\x69\x73\x73\x69\x6e\x67" };
  if (Number(socialLevel) < 20) return { ok: false, reason: "\x73\x6f\x63\x69\x61\x6c\x5f\x6c\x65\x76\x65\x6c", required: 20, current: Number(socialLevel) || 0 };
  if (!player.class) return { ok: false, reason: "\x63\x6c\x61\x73\x73" }; if (player.awakening?.completed) return { ok: false, reason: "\x63\x6f\x6d\x70\x6c\x65\x74\x65\x64", player };
  player.awakening = { ...(player.awakening || {}), unlocked: true, started: true, bossDefeated: Boolean(player.awakening?.bossDefeated), completed: false, startedAt: player.awakening?.startedAt || new Date().toISOString(), completedAt: null }; savePlayer(player); return { ok: true, player };
}
export function chooseDragonFaction(jid, factionKey, socialLevel = 0) {
  const key = String(factionKey || "").toLowerCase(); const faction = FACTIONS[key]; if (!faction) return { ok: false, reason: "\x69\x6e\x76\x61\x6c\x69\x64" };
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "\x6d\x69\x73\x73\x69\x6e\x67" }; if (Number(socialLevel) < 20 || !player.awakening?.started) return { ok: false, reason: "\x6c\x6f\x63\x6b\x65\x64" };
  if (player.faction) return { ok: false, reason: "\x61\x6c\x72\x65\x61\x64\x79", player }; player.faction = key; savePlayer(player); return { ok: true, player, faction };
}
export function chooseDragonClass(jid, dragonKey, socialLevel = 0) {
  const key = String(dragonKey || "").toLowerCase(); const klass = DRAGON_CLASSES[key]; if (!klass) return { ok: false, reason: "\x69\x6e\x76\x61\x6c\x69\x64" };
  const player = getDragonRpgPlayer(jid); if (!player) return { ok: false, reason: "\x6d\x69\x73\x73\x69\x6e\x67" }; if (Number(socialLevel) < 20 || !player.awakening?.started) return { ok: false, reason: "\x6c\x6f\x63\x6b\x65\x64" };
  if (!player.awakening?.bossDefeated) return { ok: false, reason: "\x62\x6f\x73\x73" }; if (!player.faction) return { ok: false, reason: "\x66\x61\x63\x74\x69\x6f\x6e" }; if (player.dragonClass) return { ok: false, reason: "\x61\x6c\x72\x65\x61\x64\x79", player };
  if (klass.faction !== player.faction) return { ok: false, reason: "\x66\x61\x63\x74\x69\x6f\x6e\x5f\x6d\x69\x73\x6d\x61\x74\x63\x68", required: klass.faction };
  player.dragonClass = key; player.awakening.completed = true; player.awakening.completedAt = new Date().toISOString(); addStats(player.stats, klass.bonus); player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; savePlayer(player); return { ok: true, player, klass };
}

export function startAwakeningBoss(jid,socialLevel=0){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(Number(socialLevel)<20)return{ok:false,reason:"\x73\x6f\x63\x69\x61\x6c\x5f\x6c\x65\x76\x65\x6c",required:20};if(!p.awakening?.started)return{ok:false,reason:"\x6e\x6f\x74\x5f\x73\x74\x61\x72\x74\x65\x64"};if(p.awakening?.bossDefeated)return{ok:false,reason:"\x64\x65\x66\x65\x61\x74\x65\x64"};if(p.combat)return{ok:false,reason:"\x63\x6f\x6d\x62\x61\x74"};p.combat={region:"\x64\x65\x73\x70\x65\x72\x74\x61\x72",enemy:{...AWAKENING_BOSS,maxHp:AWAKENING_BOSS.hp},turn:1,awakeningBoss:true,startedAt:Date.now()};p.rpgStats.battles++;savePlayer(p);return{ok:true,player:p,enemy:p.combat.enemy};}
export function transformDragon(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(!p.dragonClass||!p.awakening?.completed)return{ok:false,reason:"\x6c\x6f\x63\x6b\x65\x64"};if(p.dragonFormActive)return{ok:false,reason:"\x61\x6c\x72\x65\x61\x64\x79"};if(p.dragonEnergy<25)return{ok:false,reason:"\x65\x6e\x65\x72\x67\x79",required:25,current:p.dragonEnergy};p.dragonEnergy-=25;p.dragonFormActive=true;savePlayer(p);return{ok:true,player:p,klass:DRAGON_CLASSES[p.dragonClass]};}
export function returnHumanForm(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(!p.dragonFormActive)return{ok:false,reason:"\x68\x75\x6d\x61\x6e"};p.dragonFormActive=false;savePlayer(p);return{ok:true,player:p};}
export function useDragonSkill(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(!p.combat)return{ok:false,reason:"\x6e\x6f\x5f\x62\x61\x74\x74\x6c\x65"};if(!p.dragonFormActive)return{ok:false,reason:"\x66\x6f\x72\x6d"};const sk=DRAGON_SKILLS[p.dragonClass];if(!sk)return{ok:false,reason:"\x73\x6b\x69\x6c\x6c"};if(p.resources.mana<sk.cost)return{ok:false,reason:"\x6d\x61\x6e\x61",required:sk.cost,current:p.resources.mana};p.resources.mana-=sk.cost;const e=p.combat.enemy;const dmg=playerDamage(p,e,sk.mag,sk.mult);e.hp=Math.max(0,e.hp-dmg);p.rpgStats.damageDealt+=dmg;if(e.hp<=0){savePlayer(p);return{ok:true,skill:sk,damage:dmg,victory:finishVictory(p)}}p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,false);return{ok:true,skill:sk,damage:dmg,enemy:e,counter,player:getDragonRpgPlayer(jid)};}
export function restoreDragonEnergy(jid){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};const before=p.dragonEnergy;p.dragonEnergy=Math.min(p.maxDragonEnergy,p.dragonEnergy+25);savePlayer(p);return{ok:true,recovered:p.dragonEnergy-before,player:p};}
export function getAwakeningStatus(jid){const p=getDragonRpgPlayer(jid);if(!p)return null;return{player:p,awakening:p.awakening,klass:p.dragonClass?DRAGON_CLASSES[p.dragonClass]:null};}
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
function awardXp(player, amount){ let gained=Math.max(0,Math.round(amount)); player.xp+=gained; const levels=[]; while(player.xp>=player.xpNext){ player.xp-=player.xpNext; player.level++; player.xpNext=xpNeeded(player.level); player.statPoints+=3; player.skillPoints+=1; player.specialties.combat+=1; if(player.level%3===0)player.specialties.survival+=1; player.stats.hp+=8; player.stats.mana+=4; player.resources.hp=player.stats.hp; player.resources.mana=player.stats.mana; levels.push(player.level); } return levels; }
function progressQuests(player, enemy, regionKey){ const completedNow=[]; for(const [qid,qstate] of Object.entries(player.quests.active||{})){ const q=QUESTS[qid]; if(!q)continue; let hit=false; if(q.type==='\x6b\x69\x6c\x6c'&&q.monster===enemy.id)hit=true; if(q.type==='\x72\x65\x67\x69\x6f\x6e\x4b\x69\x6c\x6c\x73'&&q.region===regionKey)hit=true; if(hit){qstate.progress=Math.min(q.target,Number(qstate.progress||0)+1); if(qstate.progress>=q.target) qstate.ready=true;} } return completedNow; }
function finishVictory(player){ const battle=player.combat, enemy=battle.enemy; const awakeningWin=Boolean(battle?.awakeningBoss); const gold=randInt(enemy.gold[0],enemy.gold[1]); const levels=awardXp(player,enemy.xp); player.gold+=gold; player.rpgStats.wins++; player.rpgStats.monstersDefeated++; player.specialties.combat+=1;
 if(player.class==="\x61\x72\x71\x75\x65\x69\x72\x6f"||player.advancedClass==="\x61\x73\x73\x61\x73\x73\x69\x6e\x6f")player.specialties.stealth+=1;
 if(player.class==="\x6d\x61\x67\x6f"||player.class==="\x63\x75\x72\x61\x6e\x64\x65\x69\x72\x6f"||["\x6e\x65\x63\x72\x6f\x6d\x61\x6e\x74\x65","\x66\x65\x69\x74\x69\x63\x65\x69\x72\x6f"].includes(player.advancedClass))player.specialties.arcana+=1;
 progressQuests(player,enemy,battle.region); let drop=null; for(const d of enemy.drops||[]){ if(Math.random()<d.chance){drop={...d,qty:1,type:'\x6d\x61\x74\x65\x72\x69\x61\x6c'}; addItem(player,drop,1); break;} } if(awakeningWin){player.awakening={...(player.awakening||{}),unlocked:true,started:true,bossDefeated:true,completed:false};} player.combat=null; savePlayer(player); return {enemy,gold,xp:enemy.xp,levels,drop,player,awakeningWin}; }
function monsterTurn(player, defending=false){ const e=player.combat.enemy; const dmg=enemyDamage(e,player,defending); player.resources.hp=Math.max(0,player.resources.hp-dmg); player.rpgStats.damageTaken+=dmg; if(player.resources.hp<=0){ player.rpgStats.losses++; player.combat=null; savePlayer(player); return {damage:dmg,defeated:true}; } savePlayer(player); return {damage:dmg,defeated:false}; }

export function getRpgRegions(){ return REGIONS; }
export function formatRpgRegions(prefix='/'){ return `╭━━〔 🗺️ *REGIÕES DRAGON RPG* 〕━━╮\n${Object.entries(REGIONS).map(([k,r])=>`┃ ${r.icon} *${r.name}* — Lv. ${r.min}-${r.max}\n┃   ${prefix}explorar ${k}`).join('\n')}\n┃\n┃ ⚙️ ADM: ${prefix}mododragonrpg on/off\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function startRpgBattle(jid, regionKey='\x66\x6c\x6f\x72\x65\x73\x74\x61'){
  const player=getDragonRpgPlayer(jid); if(!player)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; if(!player.class)return {ok:false,reason:'\x63\x6c\x61\x73\x73'}; if(player.combat)return {ok:false,reason:'\x61\x63\x74\x69\x76\x65',player}; if(player.resources.hp<=0)return {ok:false,reason:'\x64\x65\x66\x65\x61\x74\x65\x64'};
  const key=String(regionKey||'\x66\x6c\x6f\x72\x65\x73\x74\x61').toLowerCase(); const region=REGIONS[key]; if(!region)return {ok:false,reason:'\x72\x65\x67\x69\x6f\x6e'}; if(player.level<region.min)return {ok:false,reason:'\x6c\x65\x76\x65\x6c',required:region.min,current:player.level}; if(key==='\x72\x65\x69\x6e\x6f'&&!player.dragonClass)return {ok:false,reason:'\x64\x72\x61\x67\x6f\x6e\x5f\x72\x65\x71\x75\x69\x72\x65\x64'};
  const enemy=regionMonster(key,player.level); player.combat={region:key,enemy,turn:1,startedAt:Date.now()}; player.rpgStats.battles++; savePlayer(player); return {ok:true,player,region,enemy};
}
export function getRpgBattle(jid){ const p=getDragonRpgPlayer(jid); return p?.combat||null; }
export function rpgAttack(jid){
  const p=getDragonRpgPlayer(jid);
  if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};
  if(!p.combat)return{ok:false,reason:"\x6e\x6f\x5f\x62\x61\x74\x74\x6c\x65"};
  const e=p.combat.enemy;
  const crit=Math.random()<clamp(.05+p.stats.agi/500,.05,.22);
  const forceMult=Number(p.buffs?.nextAttackMult)||1;
  const dmg=playerDamage(p,e,false,(crit?1.7:1)*forceMult);
  const forceUsed=forceMult>1;
  if(forceUsed)p.buffs.nextAttackMult=0;
  e.hp=Math.max(0,e.hp-dmg);
  p.rpgStats.damageDealt+=dmg;
  if(e.hp<=0){savePlayer(p);return{ok:true,action:"\x61\x74\x74\x61\x63\x6b",damage:dmg,crit,forceUsed,victory:finishVictory(p)};}
  p.combat.turn++;savePlayer(p);
  const counter=monsterTurn(p,false);
  return{ok:true,action:"\x61\x74\x74\x61\x63\x6b",damage:dmg,crit,forceUsed,enemy:e,counter,player:getDragonRpgPlayer(jid)};
}
export function rpgDefend(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; if(!p.combat)return {ok:false,reason:'\x6e\x6f\x5f\x62\x61\x74\x74\x6c\x65'}; p.combat.turn++; savePlayer(p); const counter=monsterTurn(p,true); return {ok:true,action:'\x64\x65\x66\x65\x6e\x64',enemy:p.combat?.enemy,counter,player:getDragonRpgPlayer(jid)}; }
export function rpgSkill(jid,skillKey=""){const p=getDragonRpgPlayer(jid);if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};if(!p.combat)return{ok:false,reason:"\x6e\x6f\x5f\x62\x61\x74\x74\x6c\x65"};const skills=RPG_SKILLS[p.class]||[],key=String(skillKey||"").toLowerCase();let sk=key?skills.find(x=>x.id===key):[...skills].reverse().find(x=>p.level>=x.level);if(!sk)return{ok:false,reason:"\x73\x6b\x69\x6c\x6c"};if(p.level<sk.level)return{ok:false,reason:"\x73\x6b\x69\x6c\x6c\x5f\x6c\x65\x76\x65\x6c",required:sk.level,skill:sk};if(p.resources.mana<sk.cost)return{ok:false,reason:"\x6d\x61\x6e\x61",required:sk.cost,current:p.resources.mana};p.resources.mana-=sk.cost;const e=p.combat.enemy;let heal=0,dmg=0;if(sk.heal){heal=Math.min(p.stats.hp-p.resources.hp,Math.max(18,Math.round(p.stats.mag*(sk.healMult||1.4))));p.resources.hp+=heal;}else if(sk.defend){p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,true);return{ok:true,action:"\x64\x65\x66\x65\x6e\x64",skill:sk,enemy:e,counter,player:getDragonRpgPlayer(jid)};}else{dmg=playerDamage(p,e,sk.mag,sk.mult);e.hp=Math.max(0,e.hp-dmg);p.rpgStats.damageDealt+=dmg;}if(e.hp<=0){savePlayer(p);return{ok:true,action:"\x73\x6b\x69\x6c\x6c",skill:sk,damage:dmg,heal,victory:finishVictory(p)}}p.combat.turn++;savePlayer(p);const counter=monsterTurn(p,false);return{ok:true,action:"\x73\x6b\x69\x6c\x6c",skill:sk,damage:dmg,heal,enemy:e,counter,player:getDragonRpgPlayer(jid)};}
export function rpgUseItem(jid,itemKey="\x70\x6f\x63\x61\x6f\x5f\x68\x70"){
  const p=getDragonRpgPlayer(jid);
  if(!p)return{ok:false,reason:"\x6d\x69\x73\x73\x69\x6e\x67"};
  const key=String(itemKey||"\x70\x6f\x63\x61\x6f\x5f\x68\x70").toLowerCase();
  const aliases={
    pocao:"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61","\x70\x6f\xe7\xe3\x6f":"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61","hp":"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61","\x76\x69\x64\x61":"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61","\x70\x6f\x63\x61\x6f\x5f\x68\x70":"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61","\x70\x6f\x63\x61\x6f\x5f\x76\x69\x64\x61":"\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61",
    mana:"\x70\x6f\x63\x61\x6f\x5f\x6d\x61\x6e\x61","\x70\x6f\x63\x61\x6f\x5f\x6d\x61\x6e\x61":"\x70\x6f\x63\x61\x6f\x5f\x6d\x61\x6e\x61",
    forca:"\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\x63\x61","\x66\x6f\x72\xe7\x61":"\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\x63\x61","\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\x63\x61":"\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\x63\x61","\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\xe7\x61":"\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\x63\x61",
    pao:"\x70\x61\x6f\x5f\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f","\x70\xe3\x6f":"\x70\x61\x6f\x5f\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f"
  };
  const id=aliases[key]||key;
  const item=p.inventory.find(x=>x.id===id&&Number(x.qty)>0);
  if(!item)return{ok:false,reason:"\x69\x74\x65\x6d"};
  const catalog=RPG_ITEMS[id];
  if(!catalog||catalog.type!=="\x63\x6f\x6e\x73\x75\x6d\x69\x76\x65\x6c")return{ok:false,reason:"\x6e\x6f\x74\x5f\x63\x6f\x6e\x73\x75\x6d\x61\x62\x6c\x65"};

  let heal=0,mana=0,buff=null;
  if(id==="\x70\x6f\x63\x61\x6f\x5f\x70\x65\x71\x75\x65\x6e\x61"){
    heal=Math.min(p.stats.hp-p.resources.hp,45);
    if(heal<=0)return{ok:false,reason:"\x66\x75\x6c\x6c\x5f\x68\x70"};
    p.resources.hp+=heal;
  }else if(id==="\x70\x6f\x63\x61\x6f\x5f\x6d\x61\x6e\x61"){
    mana=Math.min(p.stats.mana-p.resources.mana,40);
    if(mana<=0)return{ok:false,reason:"\x66\x75\x6c\x6c\x5f\x6d\x61\x6e\x61"};
    p.resources.mana+=mana;
  }else if(id==="\x70\x6f\x63\x61\x6f\x5f\x66\x6f\x72\x63\x61"){
    if(Number(p.buffs?.nextAttackMult)>1)return{ok:false,reason:"\x62\x75\x66\x66\x5f\x61\x63\x74\x69\x76\x65"};
    p.buffs=p.buffs||{};
    p.buffs.nextAttackMult=1.5;
    buff={type:"\x66\x6f\x72\x63\x61",mult:1.5};
  }else if(id==="\x70\x61\x6f\x5f\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f"){
    heal=Math.min(p.stats.hp-p.resources.hp,20);
    mana=Math.min(p.stats.mana-p.resources.mana,10);
    if(heal<=0&&mana<=0)return{ok:false,reason:"\x66\x75\x6c\x6c\x5f\x72\x65\x73\x6f\x75\x72\x63\x65\x73"};
    p.resources.hp+=heal;p.resources.mana+=mana;
  }else return{ok:false,reason:"\x6e\x6f\x74\x5f\x63\x6f\x6e\x73\x75\x6d\x61\x62\x6c\x65"};

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
export function rpgFlee(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; if(!p.combat)return {ok:false,reason:'\x6e\x6f\x5f\x62\x61\x74\x74\x6c\x65'}; const chance=clamp(.45+(p.stats.agi-p.combat.enemy.agi)/100,.2,.85); if(Math.random()<chance){p.combat=null;p.rpgStats.escapes++;savePlayer(p);return {ok:true,escaped:true,chance};} const counter=monsterTurn(p,false); return {ok:true,escaped:false,chance,counter,player:getDragonRpgPlayer(jid)}; }
export function rpgRest(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; if(p.combat)return {ok:false,reason:'\x63\x6f\x6d\x62\x61\x74'}; const now=Date.now(), remain=REST_COOLDOWN_MS-(now-p.lastRestAt); if(p.lastRestAt&&remain>0)return {ok:false,reason:'\x63\x6f\x6f\x6c\x64\x6f\x77\x6e',remaining:remain}; p.resources.hp=p.stats.hp;p.resources.mana=p.stats.mana;p.lastRestAt=now;savePlayer(p);return {ok:true,player:p}; }
export function rpgSpendStat(jid,stat,points=1){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; const key=String(stat||'').toLowerCase(); const allowed=['hp','\x6d\x61\x6e\x61','\x61\x74\x6b','\x64\x65\x66','\x6d\x61\x67','\x61\x67\x69']; if(!allowed.includes(key))return {ok:false,reason:'\x73\x74\x61\x74'}; const n=clamp(parseInt(points)||1,1,20); if(p.statPoints<n)return {ok:false,reason:'\x70\x6f\x69\x6e\x74\x73',current:p.statPoints}; const mult=key==='hp'?5:key==='\x6d\x61\x6e\x61'?3:1; p.stats[key]+=n*mult; p.statPoints-=n; if(key==='hp')p.resources.hp=Math.min(p.stats.hp,p.resources.hp+n*mult); if(key==='\x6d\x61\x6e\x61')p.resources.mana=Math.min(p.stats.mana,p.resources.mana+n*mult); savePlayer(p);return {ok:true,player:p,stat:key,points:n,gain:n*mult}; }

export function listRpgQuests(jid){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; return {ok:true,player:p,quests:Object.values(QUESTS).filter(q=>p.level>=q.minLevel)}; }
export function acceptRpgQuest(jid,questId){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; const q=QUESTS[String(questId||'')]; if(!q)return {ok:false,reason:'\x69\x6e\x76\x61\x6c\x69\x64'}; if(p.level<q.minLevel)return {ok:false,reason:'\x6c\x65\x76\x65\x6c',required:q.minLevel}; if(p.quests.completed.includes(q.id))return {ok:false,reason:'\x63\x6f\x6d\x70\x6c\x65\x74\x65\x64'}; if(p.quests.active[q.id])return {ok:false,reason:'\x61\x63\x74\x69\x76\x65'}; if(Object.keys(p.quests.active).length>=3)return {ok:false,reason:'\x6c\x69\x6d\x69\x74'}; p.quests.active[q.id]={progress:0,ready:false,acceptedAt:Date.now()};savePlayer(p);return {ok:true,quest:q,player:p}; }
export function claimRpgQuest(jid,questId){ const p=getDragonRpgPlayer(jid); if(!p)return {ok:false,reason:'\x6d\x69\x73\x73\x69\x6e\x67'}; const q=QUESTS[String(questId||'')], st=p.quests.active[String(questId||'')]; if(!q||!st)return {ok:false,reason:'\x69\x6e\x61\x63\x74\x69\x76\x65'}; if(!st.ready)return {ok:false,reason:'\x70\x72\x6f\x67\x72\x65\x73\x73',progress:st.progress,target:q.target}; p.gold+=q.gold; const levels=awardXp(p,q.xp); if(q.item)addItem(p,q.item,q.item.qty||1); delete p.quests.active[q.id];p.quests.completed.push(q.id);savePlayer(p);return {ok:true,quest:q,levels,player:p}; }
export function getRpgRank(limit=10){ const db=readDb(); return Object.values(db.players).map(migratePlayer).sort((a,b)=>b.level-a.level||b.xp-a.xp||b.rpgStats.wins-a.rpgStats.wins).slice(0,limit); }

function battleStatus(p){ if(!p.combat)return ''; const e=p.combat.enemy; return `\n┃ ⚔️ Em batalha: ${e.icon} *${e.name}* Lv.${e.level}\n┃ 👹 HP inimigo: *${e.hp}/${e.maxHp}*`; }
function statLine(stats) { return `❤️ HP: *${stats.hp}*  🔷 Mana: *${stats.mana}*\n⚔️ ATK: *${stats.atk}*  🛡️ DEF: *${stats.def}*\n🔮 MAG: *${stats.mag}*  💨 AGI: *${stats.agi}*`; }
export function formatDragonRpgProfile(player, { socialLevel = 0, prefix = "/" } = {}) {
  player=migratePlayer(player); const human = player.class ? HUMAN_CLASSES[player.class] : null; const faction = player.faction ? FACTIONS[player.faction] : null; const dragon = player.dragonClass ? DRAGON_CLASSES[player.dragonClass] : null;
  const unlock = Number(socialLevel) >= 20 ? "\u2705\x20\x44\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c" : `🔒 Level social ${socialLevel}/20`; const dragonState = dragon ? `${dragon.icon} *${dragon.name}*` : player.awakening?.started ? "\ud83c\x20\x44\x65\x73\x70\x65\x72\x74\x61\x72\x20\x69\x6e\x69\x63\x69\x61\x64\x6f" : "\ud83d\x20\x41\x69\x6e\x64\x61\x20\x68\x75\x6d\x61\x6e\x6f";
  return `╭═══❀══〔 🐉 *DRAGON RPG • PERFIL* 〕══❀═══╮\n┃ 👤 Nome: *${player.name}*\n┃ ⭐ Nível RPG: *${player.level}*\n┃ ✨ XP: *${player.xp}/${player.xpNext}*\n┃ 🪙 Ouro: *${player.gold}*\n┃ 🎯 Pontos de atributo: *${player.statPoints}*\n┃ ✨ Pontos de habilidade: *${player.skillPoints}*\n┃ ❤️ Vida atual: *${player.resources.hp}/${player.stats.hp}*\n┃ 🔷 Mana atual: *${player.resources.mana}/${player.stats.mana}*\n┃\n┃ 🧭 Classe humana: ${human ? `${human.icon} *${human.name}*` : "\u2754\x20\x4e\xe3\x6f\x20\x65\x73\x63\x6f\x6c\x68\x69\x64\x61"}\n┃ 🌟 Classe avançada: ${player.advancedClass ? `${ADVANCED_HUMAN_CLASSES[player.advancedClass]?.icon||"✨"} *${ADVANCED_HUMAN_CLASSES[player.advancedClass]?.name||player.advancedClass}*` : "\x4e\x65\x6e\x68\x75\x6d\x61"}\n┃ 🐲 Forma dracônica: ${dragonState}\n┃ ${faction ? `${faction.icon} Facção: *${faction.name}*` : "\ud83c\x20\x46\x61\x63\xe7\xe3\x6f\x3a\x20\x2a\x4e\x65\x6e\x68\x75\x6d\x61\x2a"}\n┃\n┃ ${statLine(player.stats).replaceAll("\n", "\n┃ ")}\n┃\n┃ ⚔️ Vitórias: *${player.rpgStats.wins}* | ☠️ Derrotas: *${player.rpgStats.losses}*\n┃ 👹 Inimigos derrotados: *${player.rpgStats.monstersDefeated}*\n┃ 🎯 Especialidade de combate: *${player.specialties.combat}*\n┃ 🥷 Furtividade: *${player.specialties.stealth}*\n┃ 🧭 Sobrevivência: *${player.specialties.survival}*\n┃ 🔮 Arcana: *${player.specialties.arcana}*${battleStatus(player)}\n┃\n┃ 🌟 Level social: *${socialLevel}*\n┃ 🐉 Despertar: *${unlock}*\n╰════════════════════════════════════╯\n\n🌸 Ajuda: *${prefix}rpgajuda*`;
}
export function formatDragonRpgInventory(player) {
  player=migratePlayer(player); const rows = (player.inventory || []).filter(x => Number(x.qty) > 0).map((item, i) => `┃ ${i + 1}. ${item.icon || "📦"} *${item.name}* ×${item.qty}`);
  return `╭━━〔 🎒 *INVENTÁRIO DRAGON* 〕━━╮\n${rows.length ? rows.join("\n") : "\u2503\x20\x49\x6e\x76\x65\x6e\x74\xe1\x72\x69\x6f\x20\x76\x61\x7a\x69\x6f\x2e"}\n┣━━━━━━━━━━━━━━━━━━━━━━\n┃ ⚔️ Arma: *${RPG_ITEMS[player.equipment?.weapon]?.name || "\x4e\x65\x6e\x68\x75\x6d\x61"}*\n┃ 🛡️ Armadura: *${RPG_ITEMS[player.equipment?.armor]?.name || "\x4e\x65\x6e\x68\x75\x6d\x61"}*\n┃ 💍 Acessório: *${RPG_ITEMS[player.equipment?.accessory]?.name || "\x4e\x65\x6e\x68\x75\x6d"}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}
export function formatBattleStart(result,prefix='/'){ const {region,enemy,player}=result; return `╭━━〔 ${region.icon} *${region.name.toUpperCase()}* 〕━━╮\n┃ Você encontrou ${enemy.icon} *${enemy.name}* Lv.${enemy.level}!\n┃ 👹 HP: *${enemy.hp}/${enemy.maxHp}*\n┃ ❤️ Seu HP: *${player.resources.hp}/${player.stats.hp}*\n┃ 🔷 Mana: *${player.resources.mana}/${player.stats.mana}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n⚔️ ${prefix}atacar\n✨ ${prefix}habilidade\n🛡️ ${prefix}defender\n🧪 ${prefix}item pocao\n🏃 ${prefix}fugir`; }
export function formatBattleAction(r,prefix='/'){ if(!r.ok)return ''; if(r.victory){ const v=r.victory; return `🏆 *VITÓRIA!*\n\nVocê derrotou ${v.enemy.icon} *${v.enemy.name}*!\n✨ +${v.xp} XP RPG\n🪙 +${v.gold} ouro${v.drop?`\n🎁 Drop: ${v.drop.icon} *${v.drop.name}*`:''}${v.levels.length?`\n\n🌟 *LEVEL UP!* Você chegou ao nível *${v.player.level}* e recebeu *${v.levels.length*3} pontos de atributo*.`:''}\n\n🗺️ Explore novamente com *${prefix}explorar <região>*.`; }
 const p=r.player, e=r.enemy||p?.combat?.enemy; if(r.counter?.defeated)return `☠️ *VOCÊ FOI DERROTADO*\n\nO inimigo causou *${r.counter.damage}* de dano e seu HP chegou a 0.\n🏕️ Use *${prefix}descansar* para se recuperar.`; const main=r.action==='\x64\x65\x66\x65\x6e\x64'?`🛡️ Você se defendeu e reduziu o dano recebido.`:r.action==='\x73\x6b\x69\x6c\x6c'?`${r.skill?.heal?'🌿':'✨'} *${r.skill?.name}*${r.damage?` causou *${r.damage}* de dano`:''}${r.heal?` recuperou *${r.heal} HP*`:''}.`:`⚔️ Seu ataque causou *${r.damage}* de dano${r.crit?'\x20\u2014\x20\x2a\x43\x52\xcd\x54\x49\x43\x4f\x21\x2a\x20\ud83d':''}.`; return `${main}${r.forceUsed?`\n💪 *Poção de Força:* +50% neste ataque.`:""}\n👹 ${e.icon} ${e.name}: *${e.hp}/${e.maxHp} HP*\n\n${r.counter?`💥 O inimigo contra-atacou: *${r.counter.damage}* de dano.\n`:''}❤️ Seu HP: *${p.resources.hp}/${p.stats.hp}* | 🔷 Mana: *${p.resources.mana}/${p.stats.mana}*\n\nSua vez: *${prefix}atacar* | *${prefix}habilidade* | *${prefix}defender*`; }
export function formatRpgQuests(jid,prefix='/'){ const r=listRpgQuests(jid); if(!r.ok)return null; const p=r.player; return `╭━━〔 📜 *MISSÕES DRAGON* 〕━━╮\n${r.quests.map(q=>{const s=p.quests.active[q.id];const done=p.quests.completed.includes(q.id);return `┃ ${done?'✅':s?.ready?'🎁':s?'🟡':'📌'} *${q.id}* — ${q.title}\n┃ ${q.desc}\n┃ Progresso: *${s?`${s.progress}/${q.target}`:done?'\x43\x6f\x6e\x63\x6c\x75\xed\x64\x61':'\x4e\xe3\x6f\x20\x61\x63\x65\x69\x74\x61'}*`;}).join('\n┣━━━━━━━━━━━━━━━━━━━━━━\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n📌 ${prefix}missao aceitar q_slimes\n🎁 ${prefix}missao resgatar q_slimes`; }
export function formatRpgRank(limit=10){ const rows=getRpgRank(limit).map((p,i)=>`${i+1}. ${i===0?'👑':i===1?'🥈':i===2?'🥉':'🐉'} *${p.name}* — Lv.${p.level} • ${p.rpgStats.wins} vitórias`); return `╭━━〔 🏆 *RANK DRAGON RPG* 〕━━╮\n${rows.length?rows.join('\n'):'\x4e\x65\x6e\x68\x75\x6d\x20\x61\x76\x65\x6e\x74\x75\x72\x65\x69\x72\x6f\x20\x61\x69\x6e\x64\x61\x2e'}\n╰━━━━━━━━━━━━━━━━━━━━━━╯`; }
export function formatRpgMenu(prefix = "/", socialLevel = 0, hasPlayer = false) {
  return `╭═══❀═══〔 🐉 〕═══❀═══╮\n┃       *DRAGON RPG • v2.0.8*\n╰═══❀═══〔 🌸 〕═══❀═══╯\n\n${hasPlayer ? "\u2705\x20\x53\x65\x75\x20\x70\x65\x72\x73\x6f\x6e\x61\x67\x65\x6d\x20\x44\x72\x61\x67\x6f\x6e\x20\x65\x73\x74\xe1\x20\x61\x74\x69\x76\x6f\x2e" : "\ud83c\x20\x56\x6f\x63\xea\x20\x61\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x63\x72\x69\x6f\x75\x20\x73\x65\x75\x20\x70\x65\x72\x73\x6f\x6e\x61\x67\x65\x6d\x2e"}\n\n╭━━〔 🌸 *PERSONAGEM* 〕━━╮\n┃ ${prefix}rpgcriar\n┃ ${prefix}rpgperfil\n┃ ${prefix}rpginventario\n┃ ${prefix}equipamentos\n┃ ${prefix}lojarpg\n┃ ${prefix}habilidades\n┃ ${prefix}rpgatributo\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 ⚔️ *AVENTURA* 〕━━╮\n┃ ${prefix}regioes\n┃ ${prefix}explorar floresta\n┃ ${prefix}missoes\n┃ ${prefix}rankrpg\n┃ ${prefix}descansar\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🧭 *CLASSES* 〕━━╮\n┃ ${prefix}rpgclasses\n┃ ${prefix}classeinfo <classe>\n┃ ${prefix}rpgclasse <classe>\n┃ ${prefix}classesavancadas\n┃ ${prefix}classeavancada <classe>\n╰━━━━━━━━━━━━━━━━━━━╯\n\n╭━━〔 🐲 *DESPERTAR DRACÔNICO* 〕━━╮\n┃ Requisito: *Level social 20+*\n┃ Seu Level social: *${socialLevel}*\n┃ ${prefix}despertardragao\n┃ ${prefix}bossdespertar\n┃ ${prefix}rpgfaccao <facção>\n┃ ${prefix}rpgdragao <classe>\n┃ ${prefix}transformar | ${prefix}formahumana\n┃ ${prefix}habilidadedragao | ${prefix}energiadragao\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n📖 ${prefix}rpgajuda`;
}
export function formatRpgCommands(prefix = "/") { return `╭━━〔 📜 *COMANDOS DRAGON RPG* 〕━━╮\n┃ ${prefix}dragonrpg | ${prefix}rpgcriar | ${prefix}rpgperfil\n┃ ${prefix}rpginventario | ${prefix}rpgatributo\n┃ ${prefix}lojarpg | ${prefix}comprarrpg | ${prefix}equipamentos\n┃ ${prefix}equipar | ${prefix}desequipar | ${prefix}habilidades\n┃ ${prefix}regioes | ${prefix}explorar | ${prefix}batalhar\n┃ ${prefix}atacar | ${prefix}habilidade | ${prefix}defender\n┃ ${prefix}item | ${prefix}fugir | ${prefix}descansar\n┃ ${prefix}missoes | ${prefix}missao | ${prefix}rankrpg\n┃ ${prefix}rpgclasses | ${prefix}classeinfo | ${prefix}rpgclasse\n┃ ${prefix}classesavancadas | ${prefix}classeavancada\n┃ ${prefix}despertardragao | ${prefix}bossdespertar\n┃ ${prefix}rpgfaccao | ${prefix}rpgdragao | ${prefix}transformar\n┃ ${prefix}formahumana | ${prefix}habilidadedragao | ${prefix}energiadragao\n┃ ${prefix}rpgajuda [tema]\n┃ 👑 ${prefix}zerarrpg | ${prefix}zerarrpgg\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`; }
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
export function formatRpgHelp(topic="",prefix="/"){const x=String(topic||"").toLowerCase();
if(["1","\x63\x6f\x6d\x65\x63\x61\x72","\x63\x6f\x6d\x65\xe7\x61\x72","\x69\x6e\x69\x63\x69\x6f"].includes(x))return `🌱 *TUTORIAL • PRIMEIROS PASSOS*\n\n1️⃣ *${prefix}rpgcriar* cria seu aventureiro.\n2️⃣ *${prefix}rpgclasses* mostra as classes iniciais e seus estilos.\n3️⃣ *${prefix}rpgperfil* mostra sua progressão completa.\n4️⃣ Comece em *${prefix}explorar floresta*.\n5️⃣ Em batalha: atacar, habilidade, defender, item ou fugir.\n6️⃣ Vitórias dão XP e ouro. Cada nível concede *3 pontos de atributo + 1 ponto de habilidade*.\n7️⃣ Distribua status com *${prefix}rpgatributo atk 1*.\n8️⃣ Faça *${prefix}missoes* e acumule vitórias.\n9️⃣ Depois conquiste especializações em *${prefix}classesavancadas*.\n\n💡 O RPG registra sua evolução permanentemente.`;
if(["2","\x63\x6c\x61\x73\x73\x65\x73","\x68\x75\x6d\x61\x6e\x61\x73"].includes(x))return `⚔️ *TUTORIAL • CLASSES*\n\nClasses iniciais: Escudeiro, Guerreiro, Mago, Arqueiro e Curandeiro.\n\n🌟 Classes avançadas exigem feitos:\n☠️ Necromante — Lv.10 + 25 inimigos + Mago/Curandeiro.\n🥷 Assassino — Lv.12 + 35 inimigos + Guerreiro/Arqueiro + Furtividade 15.\n🛡️✨ Paladino — Lv.15 + 40 inimigos + Escudeiro/Curandeiro + DEF 20.\n🪄 Feiticeiro — Lv.14 + 30 inimigos + Mago + MAG 22.\n\nAcompanhe tudo em *${prefix}classesavancadas*.`;
if(["3","\x64\x72\x61\x67\x61\x6f","\x64\x72\x61\x67\xe3\x6f"].includes(x))return `🐉 *TUTORIAL • DESPERTAR*\n\nO caminho dracônico vem depois da evolução humana. Com Level social 20+, use *${prefix}despertardragao*, derrote o Guardião em *${prefix}bossdespertar*, escolha sua facção e uma linhagem compatível. Classe avançada humana e linhagem dracônica podem coexistir.`;
if(["4","\x66\x61\x63\x63\x6f\x65\x73","\x66\x61\x63\xe7\xf5\x65\x73","\x66\x61\x63\x63\x61\x6f","\x66\x61\x63\xe7\xe3\x6f"].includes(x))return `🏰 *TUTORIAL • FACÇÕES*\n\n🔥 Caos — Chamas, Abissal e Carmesim.\n⚖️ Harmonia — Aquático.\n👁️ Espectadores — Arcano.\n⚡ Independente — Elétrico.\n\nSua facção limita a linhagem dracônica disponível.`;
if(["5","\x61\x74\x72\x69\x62\x75\x74\x6f\x73","\x73\x74\x61\x74\x75\x73"].includes(x))return `📊 *TUTORIAL • STATUS*\n\n❤️ HP: vida • 🔷 Mana: habilidades\n⚔️ ATK: dano físico • 🛡️ DEF: resistência\n🔮 MAG: poder mágico • 💨 AGI: crítico/fuga\n\nCada nível: *3 pontos de atributo + 1 ponto de habilidade*.\n\n🎯 Combate cresce com nível e vitórias.\n🥷 Furtividade cresce principalmente em estilos ágeis.\n🧭 Sobrevivência cresce com a progressão.\n🔮 Arcana cresce nas vitórias de classes mágicas.\n\nEspecialidades também viram requisitos de classes avançadas.`;
if(["6","\x6e\x69\x76\x65\x6c","\x6e\xed\x76\x65\x6c","xp"].includes(x))return `⭐ *TUTORIAL • NÍVEL E XP*\n\nBatalhas dão XP RPG. Ao completar a barra você sobe automaticamente, recupera HP/Mana e recebe *3 pontos de atributo + 1 ponto de habilidade*. Pontos de atributo melhoram seu personagem agora; pontos de habilidade ficam registrados para a expansão da árvore de habilidades.`;
if(["7","\x63\x6f\x6d\x62\x61\x74\x65","\x62\x61\x74\x61\x6c\x68\x61"].includes(x))return `⚔️ *TUTORIAL • COMBATE*\n\n*${prefix}atacar* — ataque normal.\n*${prefix}habilidade <id>* — técnica da classe, consome Mana.\n*${prefix}defender* — reduz contra-ataque.\n*${prefix}item pocao* — usa consumível.\n*${prefix}fugir* — AGI ajuda na fuga.\n*${prefix}descansar* — recupera fora de batalha.\n\nVitórias contam para missões, especialidades e desbloqueio de classes.`;
if(["8","\x6d\x69\x73\x73\x6f\x65\x73","\x6d\x69\x73\x73\xf5\x65\x73"].includes(x))return `📜 *TUTORIAL • MISSÕES*\n\nVeja *${prefix}missoes*, aceite com *${prefix}missao aceitar <id>* e cumpra a meta indicada. O progresso é automático durante batalhas. Depois use *${prefix}missao resgatar <id>* para receber XP, ouro e itens.`;
if(["9","\x61\x76\x61\x6e\x63\x61\x64\x61\x73","\x61\x76\x61\x6e\xe7\x61\x64\x61\x73"].includes(x))return `🌟 *TUTORIAL • CLASSES AVANÇADAS*\n\nUse *${prefix}classesavancadas*. Cada requisito aparece com ✅ ou 🔒. Quando completar tudo, use *${prefix}classeavancada <classe>*.\n\nExemplo: Necromante exige Mago/Curandeiro, Lv.10 e 25 inimigos derrotados. Não basta chegar ao nível: é uma classe conquistada por feitos.`;
return `╭━━〔 📖 *DRAGON RPG • TUTORIAIS* 〕━━╮\n┃ 1️⃣ Primeiros passos\n┃ 2️⃣ Classes e especializações\n┃ 3️⃣ Despertar dracônico\n┃ 4️⃣ Facções\n┃ 5️⃣ Atributos e especialidades\n┃ 6️⃣ Nível, XP e pontos\n┃ 7️⃣ Combate detalhado\n┃ 8️⃣ Missões\n┃ 9️⃣ Classes avançadas\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\nUse *${prefix}rpgajuda 1* até *${prefix}rpgajuda 9*`;}
