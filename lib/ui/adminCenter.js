function state(value) {
  return value ? "ON ✅" : "OFF ❌";
}

export function buildAdminCenter(prefix) {
  return (
    `╭═══════ ❀ 🛡️ ❀ ═══════╮\n` +
    `      *KOBAYASHI ADMIN CENTER*\n` +
    `╰═══════ ❀ 🐉 ❀ ═══════╯\n\n` +

    `╭─〔 📊 *CENTRAL* 〕\n` +
    `│ ${prefix}statusgrupo\n` +
    `│ └ Visão geral das proteções\n` +
    `╰────────────────\n\n` +

    `╭─〔 🔗 *LINKS & SPAM* 〕\n` +
    `│ ${prefix}antilink\n` +
    `│ ${prefix}antilinkgp\n` +
    `│ ${prefix}antilinklight\n` +
    `│ ${prefix}antitelegram\n` +
    `│ ${prefix}antitrava on/off\n` +
    `│ ${prefix}antifarm on/off\n` +
    `╰────────────────\n\n` +

    `╭─〔 ⚖️ *MODERAÇÃO* 〕\n` +
    `│ ${prefix}adv @membro motivo\n` +
    `│ ${prefix}rmadv @membro\n` +
    `│ ${prefix}ban @membro\n` +
    `│ ${prefix}listanegra\n` +
    `│ ${prefix}regras\n` +
    `│ ${prefix}anotacoes\n` +
    `╰────────────────\n\n` +

    `╭─〔 🐉 *SISTEMAS* 〕\n` +
    `│ ${prefix}level on/off\n` +
    `│ ${prefix}modobrincadeira\n` +
    `│ ${prefix}autosticker on/off\n` +
    `╰────────────────\n\n` +

    `🌸 Use *${prefix}menuadm* para ver todos os comandos administrativos.`
  );
}

export function buildGroupStatus({
  groupName,
  botIsAdmin,
  protections,
  antiTrava,
  antiFarm,
  levelEnabled,
  funEnabled,
  autoStickerEnabled,
  antiDelete,
  antiEdit,
  antiPv,
  sentinel,
  whitelistCount
}) {
  return (
    `╭═══════ ❀ 📊 ❀ ═══════╮\n` +
    `       *STATUS DO GRUPO*\n` +
    `╰═══════ ❀ 🐉 ❀ ═══════╯\n\n` +

    `👥 Grupo › *${groupName || "Grupo"}*\n` +
    `🤖 Kobayashi ADM › *${state(botIsAdmin)}*\n\n` +

    `╭─〔 🔗 *PROTEÇÃO DE LINKS* 〕\n` +
    `│ 🚫 AntiLink › *${state(protections?.antilink)}*\n` +
    `│ 🔗 AntiLink GP › *${state(protections?.antilinkgp)}*\n` +
    `│ ⚠️ AntiLink Light › *${state(protections?.antilinklight)}*\n` +
    `│ ✈️ AntiTelegram › *${state(protections?.antitelegram)}*\n` +
    `╰────────────────\n\n` +

    `╭─〔 🛡️ *ANTI-TRAVA* 〕\n` +
    `│ Sistema › *${state(antiTrava?.enabled)}*\n` +
    `│ 👥 Anti-menção › *${state(antiTrava?.antiMention)}*\n` +
    `│ 📝 Anti-textão › *${state(antiTrava?.antiLongText)}*\n` +
    `│ 🌊 Anti-flood › *${state(antiTrava?.antiFloodMessage)}*\n` +
    `╰────────────────\n\n` +

    `╭─〔 🐉 *SISTEMAS DO GRUPO* 〕\n` +
    `│ 🪙 Anti-Farm › *${state(antiFarm?.enabled)}*\n` +
    `│ ⭐ Dragon Level › *${state(levelEnabled)}*\n` +
    `│ 🎭 Modo Brincadeira › *${state(funEnabled)}*\n` +
    `│ 🎴 AutoSticker › *${state(autoStickerEnabled)}*\n` +
    `│ 🗑️ AntiDelete › *${state(antiDelete)}*\n` +
    `│ ✏️ AntiEdit › *${state(antiEdit)}*\n` +
    `╰────────────────\n\n` +

    `╭─〔 🛰️ *PROTEÇÃO AVANÇADA* 〕\n` +
    `│ Sentinel no grupo › *${state(sentinel?.groupEnabled)}*\n` +
    `│ Sentinel conectado › *${state(sentinel?.connected)}*\n` +
    `│ 🛡️ Anti-PV global › *${state(antiPv)}*\n` +
    `│ 🤍 Whitelist › *${Number(whitelistCount || 0)} membro(s)*\n` +
    `╰────────────────`
  );
}
