function flag(value) { return value ? "🟢 ATIVO" : "🔴 DESATIVADO"; }
function yes(value) { return value ? "✅ SIM" : "❌ NÃO"; }

export function buildAdminCenter(prefix = "/") {
  return `╭━━〔 🛡️ ADMIN CENTER 2.0 〕━━╮\n` +
    `┃ Central administrativa da Kobayashi\n` +
    `┃ Use os botões/lista ou os comandos abaixo.\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `📊 ${prefix}statusgrupo — visão geral\n` +
    `🛡️ ${prefix}painelprotecao — proteções\n` +
    `🩺 ${prefix}diagpermissoes — permissões\n` +
    `⚙️ ${prefix}painelsistemas — sistemas do grupo\n\n` +
    `🌸 Kobayashi Bot • Admin Center 2.0`;
}

export function buildProtectionPanel({ prefix = "/", protections = {}, antiTrava = {}, antiSpam = {}, antiDelete = false, antiEdit = false, sentinel = {} } = {}) {
  return `╭━━〔 🛡️ PROTEÇÕES 〕━━╮\n` +
    `┃ 🔗 Antilink: ${flag(protections.antilink)}\n` +
    `┃ 👥 Antilink GP: ${flag(protections.antilinkgp)}\n` +
    `┃ 💡 Antilink Light: ${flag(protections.antilinklight)}\n` +
    `┃ ✈️ AntiTelegram: ${flag(protections.antitelegram)}\n` +
    `┃ 💥 AntiTrava: ${flag(Boolean(antiTrava?.enabled))}\n` +
    `┃ 🚫 AntiSpam: ${flag(Boolean(antiSpam?.enabled))}\n` +
    `┃ 🗑️ AntiDelete: ${flag(antiDelete)}\n` +
    `┃ ✏️ AntiEdit: ${flag(antiEdit)}\n` +
    `┃ 🛰️ Sentinel: ${flag(Boolean(sentinel?.enabled))}\n` +
    `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
    `💡 Alterne uma proteção usando seu comando normal.\n` +
    `Ex.: ${prefix}antilink`;
}

export function buildSystemsPanel({ levelEnabled=false, funEnabled=false, autoStickerEnabled=false, antiFarm={}, antiPv=false, whitelistCount=0, rental=null } = {}) {
  return `╭━━〔 ⚙️ SISTEMAS DO GRUPO 〕━━╮\n` +
    `┃ ⭐ Level: ${flag(levelEnabled)}\n` +
    `┃ 🎮 Diversão: ${flag(funEnabled)}\n` +
    `┃ 🎨 AutoSticker: ${flag(autoStickerEnabled)}\n` +
    `┃ 🌾 AntiFarm: ${flag(Boolean(antiFarm?.enabled))}\n` +
    `┃ 📵 AntiPV global: ${flag(antiPv)}\n` +
    `┃ 🤍 Lista branca: ${whitelistCount} membro(s)\n` +
    (rental ? `┃ 🏷️ Aluguel: ${rental}\n` : "") +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}

export function buildPermissionDiagnostic({ botIsAdmin=false, userIsAdmin=false, canRemove=false, canEditGroup=false, canInvite=false } = {}) {
  const problems = [];
  if (!botIsAdmin) problems.push("O bot não é administrador do grupo.");
  if (!canRemove) problems.push("Remoções/moderação automática podem falhar.");
  if (!canEditGroup) problems.push("Abrir/fechar ou editar dados do grupo pode falhar.");
  if (!canInvite) problems.push("Recursos que dependem de convite/link podem ficar limitados.");
  return `╭━━〔 🩺 DIAGNÓSTICO RÁPIDO 〕━━╮\n` +
    `┃ 👤 Você é ADM: ${yes(userIsAdmin)}\n` +
    `┃ 🤖 Bot é ADM: ${yes(botIsAdmin)}\n` +
    `┃ 🔨 Moderação: ${yes(canRemove)}\n` +
    `┃ 🔒 Controle do grupo: ${yes(canEditGroup)}\n` +
    `┃ 🔗 Convites/links: ${yes(canInvite)}\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    (problems.length ? `⚠️ *Atenção*\n${problems.map(x => `• ${x}`).join("\n")}` : "✅ Nenhum problema básico de permissão detectado.");
}

export function buildGroupStatus({ groupName="Grupo", botIsAdmin=false, protections={}, antiTrava={}, antiSpam={}, antiFarm={}, levelEnabled=false, funEnabled=false, autoStickerEnabled=false, antiDelete=false, antiEdit=false, antiPv=false, sentinel={}, whitelistCount=0 } = {}) {
  const protectionValues = [protections.antilink, protections.antilinkgp, protections.antilinklight, protections.antitelegram, antiTrava?.enabled, antiSpam?.enabled, antiDelete, antiEdit, sentinel?.enabled];
  const activeProtections = protectionValues.filter(Boolean).length;
  return `╭━━〔 📊 STATUS DO GRUPO 〕━━╮\n` +
    `┃ 👥 ${groupName}\n` +
    `┃ 🤖 Bot ADM: ${yes(botIsAdmin)}\n` +
    `┃ 🛡️ Proteções ativas: ${activeProtections}/${protectionValues.length}\n` +
    `┃ ⭐ Level: ${flag(levelEnabled)}\n` +
    `┃ 🎮 Diversão: ${flag(funEnabled)}\n` +
    `┃ 🎨 AutoSticker: ${flag(autoStickerEnabled)}\n` +
    `┃ 🌾 AntiFarm: ${flag(Boolean(antiFarm?.enabled))}\n` +
    `┃ 📵 AntiPV: ${flag(antiPv)}\n` +
    `┃ 🤍 Whitelist: ${whitelistCount}\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}
