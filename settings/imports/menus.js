/* Tema: Kobayashi Bot Beta 🐉🌸 */

export const menuPrincipal = (NomeDoBot, sender, ownerName, prefix) => {
return `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🐉🌸 *KOBAYASHI BOT* 🌸🐉
┃ ✨ *Versão:* 0.1.4-BETA
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 🌸 *MENU PRINCIPAL* 〕─╮
┃ 🎨 ${prefix}stickers / ${prefix}s
┃ 🛡️ ${prefix}adv @membro
┃ 👤 ${prefix}perfil @membro
┃ 🛑 ${prefix}ban / ${prefix}b @membro
┃ ⚡ ${prefix}ping
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 🛡️ *MENUS ESPECIAIS* 〕─╮
┃ 🛡️ ${prefix}menuadm
┃ 👑 ${prefix}menuowner
┃ 💎 ${prefix}menuvip
╰━━━━━━━━━━━━━━━━━━━━━━╯

👤 Usuário: @${sender.split("@")[0]}
👑 Dono: ${ownerName}

🌸 *Kobayashi Bot — simples, rápido e feito para evoluir.*`;
};

export const menuAdm = (prefix) => {
return `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🛡️ *MENU ADMINISTRADOR* 🛡️
╰━━━━━━━━━━━━━━━━━━━━━━╯
┃ 🛑 ${prefix}ban / ${prefix}b @membro
┃ ⚠️ ${prefix}adv @membro [motivo]
┃ 🔨 ${prefix}promover @membro
┃ 📛 ${prefix}rebaixar @membro
┃ 🔄 ${prefix}statusatt — status da atualização
╰━━━━━━━━━━━━━━━━━━━━━━╯
🐉 *Use os poderes com responsabilidade.*`;
};

export const menuOwner = (prefix) => {
return `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 👑 *MENU DO DONO* 👑
╰━━━━━━━━━━━━━━━━━━━━━━╯
┃ 🔄 ${prefix}reiniciar / ${prefix}rr
┃ 🌸 Área reservada ao proprietário
╰━━━━━━━━━━━━━━━━━━━━━━╯
🐉 *Kobayashi está cuidando do sistema.*
┃ 📦 ${prefix}version
┃ 🔄 ${prefix}update
`;
};

export const menuVip = (prefix) => {
return `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 💎 *MENU VIP* 💎
╰━━━━━━━━━━━━━━━━━━━━━━╯
┃ 🌸 Funções VIP serão adicionadas aqui.
┃ ✨ ${prefix}menuvip
╰━━━━━━━━━━━━━━━━━━━━━━╯
🐉 *Área exclusiva dos apoiadores.*`;
};

export const ping = (atraso, uptime, so, ramUsada, cpuUso, nodeVersion, baileysVersion) => {
return `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🐉🌸 *KOBAYASHI STATUS* 🌸🐉
╰━━━━━━━━━━━━━━━━━━━━━━╯
┃ ⚡ Atraso: ${atraso}
┃ ⏱️ Uptime: ${uptime}
┃ 💻 Sistema: ${so}
┃ 🧠 RAM: ${ramUsada}
┃ 📊 CPU: ${cpuUso}
┃ 🟢 NodeJS: ${nodeVersion}
┃ 📦 Baileys: ${baileysVersion}
╰━━━━━━━━━━━━━━━━━━━━━━╯
🌸 *Kobayashi está online!*`;
};
