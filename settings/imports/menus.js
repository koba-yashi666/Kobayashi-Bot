/* KOBAYASHI BOT • v0.1.16-beta • tema oficial Kobayashi */
export const menuPrincipal = (NomeDoBot, sender, ownerName, prefix) => {
return `╭═══════ ❀ 小林 ❀ ═══════╮
       ୨୧ *KOBAYASHI BOT* ୨୧
          🐉 SYSTEM 🌸
╰═══════ ❀ 🐉 ❀ ═══════╯
          ⋮
     🌸 いらっしゃい 🌸
          ⋮
╭───〔 🎐 PERFIL 〕────╮
│ 🌷 Olá, @${sender.split("@")[0]}
│
│ 🪷 Bot      › ${NomeDoBot}
│ 🎀 Usuário  › @${sender.split("@")[0]}
│ 🌺 Dono     › ${ownerName}
│ 🪭 Prefixo  › ${prefix}
│ 💮 Versão   › 0.1.16-beta
╰─────── ❀ ───────────╯

       ── 🌸 ──
     🐉 KOBAYASHI MENU
       ── 🌸 ──

╭───〔 🎐 PAINÉIS 〕────╮
│ 🪷 ${prefix}menuadm
│    ↳ Administração
│ 🎎 ${prefix}menudono
│    ↳ Configurações
│ 💎 ${prefix}menuvip
│    ↳ Recursos exclusivos
│ 🎭 ${prefix}menubn
│    ↳ Modo Brincadeira
╰─────── ❀ ───────────╯

╭───〔 🌺 INFORMAÇÕES 〕──╮
│ 🫧 ${prefix}ping
│    ↳ Status da Kobayashi
│ 🏮 ${prefix}grupoinfo
│    ↳ Informações do grupo
│ 🎐 ${prefix}admins
│    ↳ Administradores
│ 🐉 ${prefix}criador
│    ↳ Criador do projeto
│ 🎀 ${prefix}dono
│    ↳ Proprietário atual
│ ⚠️ ${prefix}infoadv
│    ↳ Sistema de advertências
╰─────── ❀ ────────────╯

╭───〔 🪷 UTILIDADES 〕────╮
│ 🎴 ${prefix}figurinhas 1-15
│    ↳ Pacote de figurinhas
│ 🖼️ ${prefix}stickers
│    ↳ Criar figurinha
│ 🌷 ${prefix}perfil
│    ↳ Informações do usuário
╰─────── ❀ ────────────╯

     🌸 ──「 小林 」── 🌸
       K O B A Y A S H I
          B O T
    🐉 residência online 🐉`;
};

export const menuAdm = (prefix) => {
return `╭══════ ❀ 守護 ❀ ══════╮
      🌺 *KOBAYASHI GUARD*
╰══════ ❀ 🐉 ❀ ══════╯

╭───〔 🛡️ MODERAÇÃO 〕───╮
│ ⚠️ ${prefix}adv @membro motivo
│    ↳ 3/3 = remoção automática
│ 🔨 ${prefix}ban @membro
│    ↳ Remover membro
│ 🎐 ${prefix}admins
│ 📖 ${prefix}infoadv
╰─────── ❀ ───────────╯

╭───〔 🏮 GRUPO 〕────────╮
│ 🐉 ${prefix}grupoinfo
│ 🫧 ${prefix}statusatt
╰─────── ❀ ───────────╯

  🌸 Kobayashi • Guardian System 🐉`;
};

export const menuOwner = (prefix) => {
return `╭══════ ❀ 核心 ❀ ══════╮
       🎎 *KOBAYASHI CORE*
╰══════ ❀ 👑 ❀ ══════╯

╭───〔 👑 IDENTIDADE 〕───╮
│ 📱 ${prefix}numero_dono 55...
│ 🤖 ${prefix}numero_bot 55...
│ 🪷 ${prefix}status_bot
╰─────── ❀ ───────────╯

╭───〔 🪭 CONFIGURAÇÕES 〕─╮
│ 🎐 ${prefix}prefixo
│ 🌷 ${prefix}add_prefixo !
│ 🛡️ ${prefix}antipv on/off
╰─────── ❀ ───────────╯

╭───〔 🎨 APARÊNCIA 〕─────╮
│ 🖼️ ${prefix}foto_gp
│ 🏮 ${prefix}nome_gp Novo nome
│ 🌸 ${prefix}foto_menu
╰─────── ❀ ───────────╯

╭───〔 ⚙️ SISTEMA 〕───────╮
│ 💮 ${prefix}version
│ 🫧 ${prefix}update
│ 🎀 ${prefix}statusatt
╰─────── ❀ ───────────╯

     👑 ──「 小林 」── 🐉
         OWNER CORE`;
};

export const menuVip = (prefix) => {
return `╭══════ ❀ 特別 ❀ ══════╮
       💎 *KOBAYASHI VIP*
╰══════ ❀ 🌸 ❀ ══════╯

╭───〔 🪷 PREMIUM 〕───────╮
│ 💎 Área exclusiva
│ 🎐 Novos recursos em breve
╰─────── ❀ ───────────╯

     🌸 KOBAYASHI VIP 🐉`;
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
