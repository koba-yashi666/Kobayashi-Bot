const CHANNEL =
  "https://whatsapp.com/channel/0029Vb8j6MyGk1FzGOr4EP3M";

function top(title, icon = "🌸") {
  return (
    `╭━━━〔 ${icon} *${title}* ${icon} 〕━━━╮\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`
  );
}

export function buildMainMenu({
  sender,
  botName,
  ownerName,
  prefix,
  version
}) {
  return (
    `╭═══════ ❀ 小林 ❀ ═══════╮\n` +
    `       ୨୧ *KOBAYASHI BOT* ୨୧\n` +
    `          🐉 SYSTEM 🌸\n` +
    `╰═══════ ❀ 🐉 ❀ ═══════╯\n\n` +
    `╭─〔 🌷 *INFORMAÇÕES* 〕\n` +
    `│ 👤 Usuário › @${String(sender).split("@")[0]}\n` +
    `│ 🪷 Bot › ${botName}\n` +
    `│ 🌺 Dono › ${ownerName}\n` +
    `│ 🪭 Prefixo › ${prefix}\n` +
    `│ 💮 Versão › ${version}\n` +
    `╰────────────────\n\n` +
    `╭─〔 🌸 *MENUS* 〕\n` +
    `│ 🛡️ ${prefix}menuadm\n` +
    `│ 👑 ${prefix}menudono\n` +
    `│ 🎭 ${prefix}menubn\n` +
    `│ 🎴 ${prefix}menusticker\n` +
    `│ 🪷 ${prefix}menugeral\n` +
    `│ 🐉 ${prefix}menunivel\n` +
    `│ 💞 ${prefix}menusocial\n` +
    `│ 🛒 ${prefix}menuloja\n` +
    `╰────────────────\n\n` +
    `╭─〔 📢 *CANAL OFICIAL* 〕\n` +
    `│ ${CHANNEL}\n` +
    `│ └ Novidades e atualizações da Kobayashi\n` +
    `╰────────────────`
  );
}

export function buildSocialMenu(prefix) {
  return (
    `${top("DRAGON SOCIAL", "🐉")}\n\n` +
    `╭─〔 💰 *ECONOMIA* 〕\n` +
    `│ ${prefix}carteira [@]\n` +
    `│ ${prefix}daily\n` +
    `│ ${prefix}pagar @membro valor\n` +
    `│ ${prefix}rankcoins\n` +
    `╰────────────────\n\n` +
    `╭─〔 🏆 *CONQUISTAS* 〕\n` +
    `│ ${prefix}conquistas [@]\n` +
    `╰────────────────\n\n` +
    `╭─〔 🎮 *JOGOS* 〕\n` +
    `│ ${prefix}dado\n` +
    `│ ${prefix}moeda\n` +
    `│ ${prefix}ppt pedra|papel|tesoura\n` +
    `╰────────────────\n\n` +
    `╭─〔 💞 *SOCIAL* 〕\n` +
    `│ ${prefix}cafune @membro\n` +
    `│ ${prefix}presente @membro\n` +
    `│ ${prefix}amizade @membro\n` +
    `╰────────────────\n\n` +
    `╭─〔 🛡️ *ANTI-FARM* 〕\n` +
    `│ ${prefix}antifarm\n` +
    `│ ${prefix}antifarm on/off • ADM\n` +
    `╰────────────────\n\n` +
    `🛒 Loja e inventário › *${prefix}menuloja*`
  );
}

export function buildShopMenu(prefix, items, usage) {
  const lines = items.map((x, i) =>
    `${x.icon} *${i + 1}. ${x.name}*\n` +
    `│ 🪙 ${x.price} moedas\n` +
    `│ 📝 ${x.description}\n` +
    `│ 🆔 ${x.id}`
  ).join("\n\n");

  return (
    `${top("DRAGON SHOP", "🛒")}\n` +
    `🛍️ Compras hoje: *${usage.used}/${usage.limit}*\n` +
    `🌅 Reset diário: *06:00*\n\n` +
    `${lines}\n\n` +
    `╭─〔 📦 *COMANDOS* 〕\n` +
    `│ ${prefix}comprar ID\n` +
    `│ ${prefix}inventario\n` +
    `│ ${prefix}equipar ID\n` +
    `│ ${prefix}desequipartitulo\n` +
    `│ ${prefix}abrircaixa\n` +
    `╰────────────────`
  );
}

export function buildLevelMenu(prefix) {
  return (
    `${top("DRAGON LEVEL", "🐉")}\n\n` +
    `╭─〔 ✨ *PROGRESSO* 〕\n` +
    `│ ${prefix}nivel — seu nível e XP\n` +
    `│ ${prefix}ranknivel — ranking do grupo\n` +
    `│ ${prefix}ranknivelg — ranking global\n` +
    `│ ${prefix}nivelinfo — guia de progressão\n` +
    `│ ${prefix}categoriaslevel — categorias\n` +
    `╰────────────────\n\n` +
    `╭─〔 ⚙️ *CONTROLE* 〕\n` +
    `│ ${prefix}level on/off • ADM\n` +
    `│ ${prefix}zeraranknivel • DONO\n` +
    `│ ${prefix}zeraranknivelg • DONO\n` +
    `╰────────────────\n\n` +
    `╭─〔 🌸 *XP* 〕\n` +
    `│ 💬 Texto: +5–12 XP\n` +
    `│ 🖼️ Foto: +10 XP\n` +
    `│ 🎨 Figurinha: +7 XP\n` +
    `│ 🐉 Comandos: +14–18 XP\n` +
    `│ 🎯 Progressão: nível 1 → 50\n` +
    `╰────────────────`
  );
}
