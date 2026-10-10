// Dados exibidos pelo WhatsApp ao abrir os detalhes da figurinha.
const clean = (value, fallback, limit = 36) => Array.from(String(value || fallback).replace(/[\r\n\t]+/g, " ").trim() || fallback).slice(0, limit).join("");
export function buildStickerLabels({userNick, groupName, botName, creatorName, packName, publisher} = {}) {
  const user = clean(userNick, "Usuário");
  const group = clean(groupName, "Privado");
  const owner = clean(creatorName, "Kobayashi");
  return {
    pack: packName || `╭─ 🐉☕ 𝑺𝒕𝒊𝒄𝒌𝒆𝒓 𝑨𝒕𝒆𝒍𝒊𝒆𝒓 ☕🐉 ─╮\n\n🌸 Criada por\n   ╰➤ ${user}\n\n🍀 Grupo\n   ╰➤ ${group}\n\n╰─ ✧ Uma pitada de magia ✧ ─╯`,
    publisher: publisher || `╭─ 👑☕ 𝑪𝒓é𝒅𝒊𝒕𝒐𝒔 ☕👑 ─╮\n\n👑 Dono do bot\n   ╰➤ ${owner}\n\n🐉 Feita por\n   ╰➤ Kobayashi Bot\n\n╰─ 🌸 Feita com carinho 💚 ─╯`
  };
}
