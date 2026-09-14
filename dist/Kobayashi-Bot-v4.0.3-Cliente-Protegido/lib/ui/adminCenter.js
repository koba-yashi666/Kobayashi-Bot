/* Kobayashi Protected Distribution v4.0.3 */
function flag(value) { return value ? "\ud83d\x20\x41\x54\x49\x56\x4f" : "\ud83d\x20\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f"; }
function yes(value) { return value ? "\u2705\x20\x53\x49\x4d" : "\u274c\x20\x4e\xc3\x4f"; }

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
  if (!botIsAdmin) problems.push("\x4f\x20\x62\x6f\x74\x20\x6e\xe3\x6f\x20\xe9\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e");
  if (!canRemove) problems.push("\x52\x65\x6d\x6f\xe7\xf5\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\xe7\xe3\x6f\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x61\x20\x70\x6f\x64\x65\x6d\x20\x66\x61\x6c\x68\x61\x72\x2e");
  if (!canEditGroup) problems.push("\x41\x62\x72\x69\x72\x2f\x66\x65\x63\x68\x61\x72\x20\x6f\x75\x20\x65\x64\x69\x74\x61\x72\x20\x64\x61\x64\x6f\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x70\x6f\x64\x65\x20\x66\x61\x6c\x68\x61\x72\x2e");
  if (!canInvite) problems.push("\x52\x65\x63\x75\x72\x73\x6f\x73\x20\x71\x75\x65\x20\x64\x65\x70\x65\x6e\x64\x65\x6d\x20\x64\x65\x20\x63\x6f\x6e\x76\x69\x74\x65\x2f\x6c\x69\x6e\x6b\x20\x70\x6f\x64\x65\x6d\x20\x66\x69\x63\x61\x72\x20\x6c\x69\x6d\x69\x74\x61\x64\x6f\x73\x2e");
  return `╭━━〔 🩺 DIAGNÓSTICO RÁPIDO 〕━━╮\n` +
    `┃ 👤 Você é ADM: ${yes(userIsAdmin)}\n` +
    `┃ 🤖 Bot é ADM: ${yes(botIsAdmin)}\n` +
    `┃ 🔨 Moderação: ${yes(canRemove)}\n` +
    `┃ 🔒 Controle do grupo: ${yes(canEditGroup)}\n` +
    `┃ 🔗 Convites/links: ${yes(canInvite)}\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    (problems.length ? `⚠️ *Atenção*\n${problems.map(x => `• ${x}`).join("\n")}` : "\u2705\x20\x4e\x65\x6e\x68\x75\x6d\x20\x70\x72\x6f\x62\x6c\x65\x6d\x61\x20\x62\xe1\x73\x69\x63\x6f\x20\x64\x65\x20\x70\x65\x72\x6d\x69\x73\x73\xe3\x6f\x20\x64\x65\x74\x65\x63\x74\x61\x64\x6f\x2e");
}

export function buildGroupStatus({ groupName="\x47\x72\x75\x70\x6f", botIsAdmin=false, protections={}, antiTrava={}, antiSpam={}, antiFarm={}, levelEnabled=false, funEnabled=false, autoStickerEnabled=false, antiDelete=false, antiEdit=false, antiPv=false, sentinel={}, whitelistCount=0 } = {}) {
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
