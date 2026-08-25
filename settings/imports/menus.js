/* KOBAYASHI BOT • v0.1.46-beta */
export const menuPrincipal = (NomeDoBot, sender, ownerName, prefix) => {
return `╭═══════ ❀ 小林 ❀ ═══════╮
       ୨୧ *KOBAYASHI BOT* ୨୧
          🐉 SYSTEM 🌸
╰═══════ ❀ 🐉 ❀ ═══════╯

🌷 Olá, @${sender.split("@")[0]}
🪷 Bot › ${NomeDoBot}
🌺 Dono › ${ownerName}
🪭 Prefixo › ${prefix}
💮 Versão › 0.1.46-beta

╭───〔 🌸 MENUS 〕────────╮
│ 🛡️ ${prefix}menuadm
│ 👑 ${prefix}menudono
│ 🎭 ${prefix}menubn
│ 🎴 ${prefix}menusticker
│ 🪷 ${prefix}menugeral
╰─────── ❀ ────────────╯

🌸 Cada painel agora tem sua própria categoria.
🐉 ──「 小林 」── KOBAYASHI`;
};

export const menuAdm = (prefix) => {
return `╭══════ ❀ 守護 ❀ ══════╮
       🛡️ *MENU ADM*
╰══════ ❀ 🐉 ❀ ══════╯

╭──〔 🛡️ MODERAÇÃO 〕────╮
│ ⚠️ ${prefix}adv @membro motivo
│ 🔨 ${prefix}ban @membro
│ 🤡 ${prefix}bam @membro
│ 🎐 ${prefix}admins
│ 📖 ${prefix}infoadv
│ 💀 ${prefix}suicidio
╰────── ❀ ─────────────╯

╭──〔 🏮 GRUPO 〕─────────╮
│ 🟢 ${prefix}gp a
│ ⏰ ${prefix}opengp 08:00
│ 🌙 ${prefix}closegp 23:00
│ 🗑️ ${prefix}rm_closegp
│ 🗑️ ${prefix}rm_opengp
│ 🔗 ${prefix}linkgp
│ 🔒 ${prefix}gp f
│ 💤 ${prefix}inativos 7
│ 🚨 ${prefix}antiflood 5
│ 🗑️ ${prefix}antidel
│ ✏️ ${prefix}antiedit
│ 🔇 ${prefix}mutar @
│ 🔊 ${prefix}desmutar @
│ 📢 ${prefix}hidetag texto
│ ⚙️ ${prefix}configgp
│    ↳ Painel do grupo
│ 📋 ${prefix}logadm on/off/ver
│ 🐉 ${prefix}grupoinfo
│ 🎨 ${prefix}autosticker
╰────── ❀ ─────────────╯

╭──〔 🌸 WELCOME PRO 〕────╮
│ 🌸 ${prefix}bemvindo on/off
│ ➕ ${prefix}add  — aceitar solicitações
│ 📝 ${prefix}setbv texto
│ 📖 ${prefix}setregrasbv texto
│ 🤝 ${prefix}setparceriasbv texto
│ 🗑️ ${prefix}rmparceriabv link
│ 👋 ${prefix}setbye texto
│ ⏱️ ${prefix}tempobv 15
│ 🧪 ${prefix}testebv
│ 🔎 ${prefix}statusbv
╰────── ❀ ─────────────╯

╭──〔 🔐 PROTEÇÃO 〕──────╮
│ 🚫 ${prefix}antilink
│ 🔗 ${prefix}antilinkgp
│ ⚠️ ${prefix}antilinklight
│ ✈️ ${prefix}antitelegram
│ 🤍 ${prefix}listabranca
╰────── ❀ ─────────────╯

╭──〔 🎴 STICKER CMD 〕────╮
│ 🎴 ${prefix}rgcmd comando
│ 🗑️ ${prefix}delcmd
│ 📋 ${prefix}listcmdsticker
╰────── ❀ ─────────────╯`;
};

export const menuOwner = (prefix) => {
return `╭══════ ❀ 核心 ❀ ══════╮
       👑 *MENU DONO*
╰══════ ❀ 🐉 ❀ ══════╯

╭──〔 👑 IDENTIDADE 〕────╮
│ 📱 ${prefix}numero_dono 55...
│ 🤖 ${prefix}numero_bot 55...
│ 🪷 ${prefix}status_bot
╰────── ❀ ─────────────╯

╭──〔 🪭 CONFIGURAÇÕES 〕──╮
│ 🎐 ${prefix}prefixo
│ 🌷 ${prefix}add_prefixo !
│ 🛡️ ${prefix}antipv on/off
│ 🖼️ ${prefix}foto_gp
│ 🏮 ${prefix}nome_gp Novo nome
│ 🌸 ${prefix}foto_menu
╰────── ❀ ─────────────╯

╭──〔 👑 LÍDERES 〕───────╮
│ 👑 ${prefix}dono1 55...
│ 👑 ${prefix}dono2 55...
│ 👑 ${prefix}dono3 55...
│ 👑 ${prefix}dono4 55...
│ 👑 ${prefix}dono5 55...
│ 📋 ${prefix}lideres
╰────── ❀ ─────────────╯

╭──〔 ⚙️ SISTEMA 〕────────╮
│ 🔑 ${prefix}yutatoken TOKEN
│    ↳ Configurar serviço do Play
│ 👑 ${prefix}configbot
│    ↳ Painel geral seguro
│ 💾 ${prefix}backupdb
│    ↳ Backup das configurações
│ 🐉 ${prefix}statusbot
│    ↳ Diagnóstico do bot
│ 💮 ${prefix}version
│ 🫧 ${prefix}update
│ 🎀 ${prefix}statusatt
╰────── ❀ ─────────────╯`;
};

export const menuSticker = (prefix) => {
return `╭══════ ❀ 🎴 ❀ ══════╮
      *MENU STICKER*
╰══════ ❀ 🌸 ❀ ══════╯

╭──〔 🌸 CRIAÇÃO 〕───────╮
│ 🖼️ ${prefix}stickers
│ 🎴 ${prefix}figurinhas 1-15
│ 🎨 ${prefix}autosticker
╰────── ❀ ─────────────╯

╭──〔 🪄 FERRAMENTAS 〕────╮
│ 🌄 ${prefix}toimg
│ 🎞️ ${prefix}togif
│ 🎐 ${prefix}take Pacote | Autor
╰────── ❀ ─────────────╯

╭──〔 🎴 STICKER CMD 〕────╮
│ 🎴 ${prefix}rgcmd comando
│    ↳ Somente ADM
│ 🗑️ ${prefix}delcmd
│ 📋 ${prefix}listcmdsticker
╰────── ❀ ─────────────╯`;
};

export const menuGeral = (prefix) => {
return `╭══════ ❀ 🪷 ❀ ══════╮
       *MENU GERAL*
╰══════ ❀ 🐉 ❀ ══════╯

╭──〔 🌸 INFORMAÇÕES 〕────╮
│ 💤 ${prefix}afk motivo
│ 📊 ${prefix}atividade
│ 👤 ${prefix}checkme @
│ 🏆 ${prefix}topativos
│ 📖 ${prefix}help
│    ↳ Ajuda dos comandos modulares
│ 🫧 ${prefix}ping
│ 🐉 ${prefix}criador
│ 🎀 ${prefix}dono
│ 🎐 ${prefix}admins
│ 🏮 ${prefix}grupoinfo
│ 🌷 ${prefix}perfil
╰────── ❀ ─────────────╯

╭──〔 🎧 MÚSICA 〕──────────╮
│ 🎵 ${prefix}play nome/link
│ 📝 ${prefix}letra Artista - Música
│    ↳ Baixar música do YouTube
╰────── ❀ ─────────────╯

╭──〔 🎴 FIGURINHAS 〕─────╮
│ 🖼️ ${prefix}stickers
│ 🎴 ${prefix}figurinhas 1-15
│ 🌄 ${prefix}toimg
│ 🎞️ ${prefix}togif
│ 🎐 ${prefix}take
╰────── ❀ ─────────────╯

╭──〔 🎭 DIVERSÃO 〕───────╮
│ 🎭 ${prefix}menubn
╰────── ❀ ─────────────╯

🌸 Estes são os comandos gerais para membros.`;
};


export const ping = (atraso, uptime, so, ramUsada, cpuUso, nodeVersion, baileysVersion) => {
return `╭══════ ❀ 状態 ❀ ══════╮
      🫧 *KOBAYASHI STATUS*
╰══════ ❀ 🐉 ❀ ══════╯

╭───〔 🌸 SISTEMA 〕───────╮
│ 🎐 Conexão › ${atraso}
│ 🕰️ Uptime  › ${uptime}
│ 🪭 Sistema › ${so}
│ 🪷 RAM     › ${ramUsada}
│ 🌺 CPU     › ${cpuUso}
│ 💮 Node    › ${nodeVersion}
│ 🎀 Baileys › ${baileysVersion}
╰─────── ❀ ───────────╯

     🐉 residência online 🌸`;
};
