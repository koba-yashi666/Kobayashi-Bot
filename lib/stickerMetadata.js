// Dados exibidos pelo WhatsApp ao abrir os detalhes da figurinha.
const clean = (value, fallback, limit = 36) => Array.from(String(value || fallback).replace(/[\r\n\t]+/g, " ").trim() || fallback).slice(0, limit).join("");
export function buildStickerLabels({userNick, botName, creatorName, packName, publisher} = {}) {
  const user = clean(userNick, "Usuário");
  const bot = clean(botName, "Kobayashi Bot");
  const owner = clean(creatorName, "Kobayashi");
  return {
    pack: packName || `╭─ 🐉☕ FIGURINHA ☕🐉 ─╮\n✦ Criada por: ${user}\n✦ Feita com ${bot}\n╰─ 🌸 Sticker Atelier 🌸 ─╯`,
    publisher: publisher || `╭─ ☕ CRÉDITOS ☕ ─╮\n✦ Dono: ${owner}\n✦ ${bot} 🐉\n╰─ Feita com carinho 💚 ─╯`
  };
}
