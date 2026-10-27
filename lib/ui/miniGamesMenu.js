export const MINI_GAMES_URL = 'https://kobayashi-mini-jogos.lz-silva2112.chatgpt.site/';
export const MINI_GAMES = ['🧪 Poções — 20 fases', '⭕ Jogo da velha — IA ou 2 pessoas', '🟢 Conecta 4 — IA ou 2 pessoas', '🧠 Quiz — 50 perguntas', '🔤 Forca — 60 palavras'];
export function miniGamesText() {
  return ['╭─ 🐉 MINI-JOGOS ─╮', '', ...MINI_GAMES, '', 'Toque em Jogar para abrir os jogos no navegador.', 'O progresso fica salvo no navegador. Sem apostas ou moedas do bot.', '╰────────────────╯'].join('\n');
}
export async function sendMiniGamesMenu({conn, jid, quoted, buttonsEnabled = true}, {generateWAMessageFromContent}) {
  const text = miniGamesText();
  if (buttonsEnabled) {
    try {
      const content = {interactiveMessage: {
        header: {title: '🐉 Kobayashi • Mini-jogos', hasMediaAttachment: false},
        body: {text},
        nativeFlowMessage: {buttons: [{name: 'cta_url', buttonParamsJson: JSON.stringify({display_text: '🎮 Jogar', url: MINI_GAMES_URL, merchant_url: MINI_GAMES_URL})}], messageParamsJson: ''}
      }};
      const message = generateWAMessageFromContent(jid, content, {userJid: conn.user.id, quoted});
      await conn.relayMessage(jid, message.message, {
        messageId: message.key.id,
        additionalNodes: [{tag: 'biz', attrs: {}, content: [{tag: 'interactive', attrs: {type: 'native_flow', v: '1'}, content: [{tag: 'native_flow', attrs: {v: '9', name: 'mixed'}}]}]}, ...(jid.endsWith('@g.us') ? [] : [{tag: 'bot', attrs: {biz_bot: '1'}}])]
      });
      return {interactive: true};
    } catch (error) {
      console.error('[Mini-jogos] Falha no botão:', error?.message);
    }
  }
  await conn.sendMessage(jid, {text: `${text}\n\n🎮 Jogar: ${MINI_GAMES_URL}`}, {quoted});
  return {interactive: false};
}
