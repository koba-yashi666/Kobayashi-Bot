/* KOBAYASHI SYSTEM
 * Dragon Panel • identidade visual própria
 * v0.1.12-beta
 */

export const menuPrincipal = (NomeDoBot, sender, ownerName, prefix) => {
return `╭────────「 小林 」────────╮
       🐉 *KOBAYASHI BOT*
          0.1.12 • BETA
╰────────────────────────╯

🌸 Olá, @${sender.split("@")[0]}.
   A residência está online.

╭─「 🪪 PERFIL 」
│ Usuário  › @${sender.split("@")[0]}
│ Dono     › ${ownerName}
│ Prefixo  › ${prefix}
╰────────────────────────

┌─ 🐉 *DRAGON PANEL*
│
├ 🌸 ${prefix}menuadm
│  Administração do grupo
│
├ 👑 ${prefix}menudono
│  Configurações da Kobayashi
│
└ 💎 ${prefix}menuvip
   Recursos exclusivos

┌─ 📖 *INFORMAÇÕES*
│
├ ⚡ ${prefix}ping
├ 🏠 ${prefix}grupoinfo
├ 🛡️ ${prefix}admins
├ 🐉 ${prefix}criador
├ 👑 ${prefix}dono
└ ⚠️ ${prefix}infoadv

┌─ 🎨 *UTILIDADES*
│
├ 🌸 ${prefix}figurinhas 1-15
├ 🖼️ ${prefix}stickers
└ 👤 ${prefix}perfil
│
╰────────────────────────╯

── 🌸 *KOBAYASHI SYSTEM* 🐉 ──`;
};

export const menuAdm = (prefix) => {
return `╭────────「 守護 」────────╮
       🛡️ *GUARDIAN PANEL*
╰────────────────────────╯

   Administração • Kobayashi

┌─ ⚠️ *MODERAÇÃO*
│
├ ⚠️ ${prefix}adv @membro motivo
│  3/3 › remoção automática
│
├ 🔨 ${prefix}ban @membro
├ 📚 ${prefix}infoadv
└ 🛡️ ${prefix}admins

┌─ 🏠 *GRUPO*
│
├ 🐉 ${prefix}grupoinfo
└ 🔄 ${prefix}statusatt
│
╰────────────────────────╯

── 🛡️ *KOBAYASHI GUARD* 🐉 ──`;
};

export const menuOwner = (prefix) => {
return `╭────────「 核心 」────────╮
        👑 *DRAGON CORE*
╰────────────────────────╯

   Controle do proprietário

┌─ 🤖 *IDENTIDADE*
│
├ 📱 ${prefix}numero_dono 55...
├ 🤖 ${prefix}numero_bot 55...
└ 📊 ${prefix}status_bot

┌─ ⚙️ *SISTEMA*
│
├ ⌨️ ${prefix}prefixo
├ ➕ ${prefix}add_prefixo !
├ 🛡️ ${prefix}antipv on/off
├ 📦 ${prefix}version
├ 🔄 ${prefix}update
└ 🧪 ${prefix}statusatt

┌─ 🎨 *PERSONALIZAÇÃO*
│
├ 🖼️ ${prefix}foto_gp
├ ✏️ ${prefix}nome_gp Novo nome
└ 🌸 ${prefix}foto_menu
│
╰────────────────────────╯

── 👑 *KOBAYASHI CORE* 🐉 ──`;
};

export const menuVip = (prefix) => {
return `╭────────「 特別 」────────╮
        💎 *DRAGON VIP*
╰────────────────────────╯

🌸 Área exclusiva da Kobayashi.

┌─ 💎 *PREMIUM*
│
└ ✨ Novos recursos em desenvolvimento.
│
╰────────────────────────╯

── 💎 *KOBAYASHI VIP* 🐉 ──`;
};

export const ping = (atraso, uptime, so, ramUsada, cpuUso, nodeVersion, baileysVersion) => {
return `╭────────「 状態 」────────╮
       ⚡ *SYSTEM STATUS*
╰────────────────────────╯

├ Conexão › ${atraso}
├ Uptime  › ${uptime}
├ Sistema › ${so}
├ RAM     › ${ramUsada}
├ CPU     › ${cpuUso}
├ Node    › ${nodeVersion}
└ Baileys › ${baileysVersion}

── 🌸 *ONLINE* 🐉 ──`;
};
