// Somente o envelope da mensagem identifica quem executou o comando.
// ContextInfo (resposta, encaminhamento e menções) nunca concede permissões.
export function authorIdentities(key = {}, bot = {}) {
  const values = key.fromMe
    ? [bot.id, bot.lid, bot.phoneNumber]
    : key.remoteJid?.endsWith('@g.us')
      ? [key.participant, key.participantAlt]
      : [key.remoteJid, key.remoteJidAlt];
  return [...new Set(values.filter(Boolean).map(normalizeIdentity).filter(Boolean))];
}

export function normalizeIdentity(value) {
  return String(value || '').replace(/:\d+(?=@)/, '').replace(/@c\.us$/, '@s.whatsapp.net');
}

export function isPhoneIdentity(value) {
  return /^\d{8,15}@s\.whatsapp\.net$/.test(normalizeIdentity(value));
}

// Comandos do menu de dono também são barrados antes de qualquer dispatcher.
export const OWNER_COMMANDS = new Set(`
botao botão menuowner menudono ownermenu debugdono numero_dono numero_bot status_bot statuscore
limpartemp prefixo add_prefixo nome_gp foto_gp foto_menu antipv reiniciar licenca
ativarlicenca licencacriar licencas licencaver licencabloquear licencareativar
licencadesvincular verificarupdate update statusatt atualizar listanegrag rmlistanegrag
ban_msg listaban_msg rmban_msg sentinel sentinelbridge aluguel_global registrar_aluguel
renovar_aluguel add_dias rm_aluguel lista_aluguel aluguel_permanente zerarrpg zerarrpgg
zerarank zeraranknivel zerarankrpg zerarank-geral msg msg-alugados msg-alugados-lista
dragon_open dragon_close drsgon_close dragon-msg dragonban bang grupos grupo clientes
alugueis statusglobal estatisticas comandosmaisusados erros add_cmd_vip del_cmd_vip
add_vip del_vip lista_vip addcmd addcmdmidia delcmd listacmd
`.trim().split(/\s+/));
