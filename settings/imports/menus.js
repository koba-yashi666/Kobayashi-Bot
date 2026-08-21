/* Tema: Kobayashi Bot Beta 🐉🌸
 * Layout renovado na v0.1.8 usando molduras e símbolos decorativos
 * inspirados nos packs enviados pelo usuário.
 */

export const menuPrincipal = (NomeDoBot, sender, ownerName, prefix) => {
return `╭🌸・🐉・☆・🐉・🌸╮
┆ ⋮ *${NomeDoBot.toUpperCase()}*
┆ ⋮ 🧪 Beta • v0.1.8
┆ ⋮ 👤 @${sender.split("@")[0]}
┆ ⋮ 👑 ${ownerName}
╰🌸・🐉・☆・🐉・🌸╯

┏━─━─━─━─━─━─━─━─━┓
│▢ 🌸 *MENU PRINCIPAL*
┗━─━─━─━─━─━─━─━─━┛
┏━─━─━─━─━─━─━─━─━┓
│▢ 🎨 ${prefix}stickers / ${prefix}s
│▢ 👤 ${prefix}perfil @membro
│▢ ⚡ ${prefix}ping
│▢ 🐉 ${prefix}grupoinfo
┗━─━─━─━─━─━─━─━─━┛

╭・・・・☆・・・・・・☆ ・・・・
┆ ⋮ 🛡️ *ADMINISTRAÇÃO*
┆°⋅⊰ꕤ ⚠️ ${prefix}adv @membro
┆°⋅⊰ꕤ 🛑 ${prefix}ban / ${prefix}b
╰・・・・☆・・・・・・☆ ・・・・

╭🌟・🌸・☆・🌸・🌟╮
┆ ⋮ 📚 *OUTROS MENUS*
┆ ➤🛡️ ${prefix}menuadm
┆ ➤👑 ${prefix}menudono
┆ ➤💎 ${prefix}menuvip
╰🌟・🌸・☆・🌸・🌟╯

⊰᯽⊱═══❖•ೋ°🐉°ೋ•❖═══⊰᯽⊱
🌸 *Kobayashi Bot — pequena no tamanho, grande no caos.*
⊰᯽⊱═══❖•ೋ°🌸°ೋ•❖═══⊰᯽⊱`;
};

export const menuAdm = (prefix) => {
return `╭🌸・🛡️・☆・🛡️・🌸╮
┆ ⋮ *MENU ADMINISTRADOR*
┆ ⋮ 🐉 Kobayashi Security
╰🌸・🛡️・☆・🛡️・🌸╯

┏━─━─━─━─━─━─━─━─━┓
│▢ 👥 *MEMBROS*
┗━─━─━─━─━─━─━─━─━┛
│▢ 🛑 ${prefix}ban / ${prefix}b @membro
│▢ ⚠️ ${prefix}adv @membro [motivo]
│▢ 🔨 ${prefix}promover @membro
│▢ 📛 ${prefix}rebaixar @membro

┏━─━─━─━─━─━─━─━─━┓
│▢ 🔧 *FERRAMENTAS*
┗━─━─━─━─━─━─━─━─━┛
│▢ 🔄 ${prefix}statusatt
│▢ 🐉 ${prefix}grupoinfo

★━━━━━━━━▃▅▆█✿█▆▅▃━━━━━━━━★
🛡️ *Administre com calma. A Tohru já causa caos suficiente.*
★━━━━━━━━▃▅▆█✿█▆▅▃━━━━━━━━★`;
};

export const menuOwner = (prefix) => {
return `╭👑・🐉・☆・🐉・👑╮
┆ ⋮ *MENU DO DONO*
┆ ⋮ 🌸 Painel da Kobayashi
╰👑・🐉・☆・🐉・👑╯

╭・・・・☆・・・・・・☆ ・・・・
┆ ⋮ 👑 *PROPRIETÁRIO*
┆°⋅⊰ꕤ 📱 ${prefix}numero_dono 55...
┆°⋅⊰ꕤ 🤖 ${prefix}numero_bot 55...
┆°⋅⊰ꕤ 📊 ${prefix}status_bot
╰・・・・☆・・・・・・☆ ・・・・

╭・・・・☆・・・・・・☆ ・・・・
┆ ⋮ ⚙️ *CONFIGURAÇÕES*
┆°⋅⊰ꕤ ⌨️ ${prefix}prefixo
┆°⋅⊰ꕤ ➕ ${prefix}add_prefixo !
┆°⋅⊰ꕤ 🛡️ ${prefix}antipv on/off
╰・・・・☆・・・・・・☆ ・・・・

╭・・・・☆・・・・・・☆ ・・・・
┆ ⋮ 🎨 *PERSONALIZAÇÃO*
┆°⋅⊰ꕤ 🖼️ ${prefix}foto_gp
┆°⋅⊰ꕤ ✏️ ${prefix}nome_gp Novo nome
┆°⋅⊰ꕤ 🌸 ${prefix}foto_menu
╰・・・・☆・・・・・・☆ ・・・・

╭・・・・☆・・・・・・☆ ・・・・
┆ ⋮ 🔧 *SISTEMA*
┆°⋅⊰ꕤ 📦 ${prefix}version
┆°⋅⊰ꕤ 🔄 ${prefix}update
┆°⋅⊰ꕤ 🧪 ${prefix}statusatt
┆°⋅⊰ꕤ ♻️ ${prefix}reiniciar / ${prefix}rr
╰・・・・☆・・・・・・☆ ・・・・

⊰᯽⊱═══❖•ೋ°👑°ೋ•❖═══⊰᯽⊱
🐉 *Acesso exclusivo do proprietário.*
⊰᯽⊱═══❖•ೋ°🌸°ೋ•❖═══⊰᯽⊱`;
};

export const menuVip = (prefix) => {
return `╭💎・🌸・☆・🌸・💎╮
┆ ⋮ *MENU VIP*
┆ ⋮ ✨ Kobayashi Premium
╰💎・🌸・☆・🌸・💎╯

┏━─━─━─━─━─━─━─━─━┓
│▢ 💎 *ÁREA EXCLUSIVA*
┗━─━─━─━─━─━─━─━─━┛
│▢ 🌸 Novas funções VIP chegarão em breve.
│▢ ✨ ${prefix}menuvip

◇☆★☆★☆★☆◆◇☆★☆★☆★☆◆
💎 *Obrigado por apoiar o Kobayashi Bot.*
◇☆★☆★☆★☆◆◇☆★☆★☆★☆◆`;
};

export const ping = (atraso, uptime, so, ramUsada, cpuUso, nodeVersion, baileysVersion) => {
return `╭⚡・🐉・☆・🐉・⚡╮
┆ ⋮ *KOBAYASHI STATUS*
┆ ⋮ 🌸 Sistemas da residência
╰⚡・🐉・☆・🐉・⚡╯

┏━─━─━─━─━─━─━─━─━┓
│▢ ⚡ Atraso: ${atraso}
│▢ ⏱️ Uptime: ${uptime}
│▢ 💻 Sistema: ${so}
│▢ 🧠 RAM: ${ramUsada}
│▢ 📊 CPU: ${cpuUso}
│▢ 🟢 NodeJS: ${nodeVersion}
│▢ 📦 Baileys: ${baileysVersion}
┗━─━─━─━─━─━─━─━─━┛

★━━━━━━━━▃▅▆█✿█▆▅▃━━━━━━━━★
🌸 *Kobayashi está online e servindo café.*
★━━━━━━━━▃▅▆█✿█▆▅▃━━━━━━━━★`;
};
