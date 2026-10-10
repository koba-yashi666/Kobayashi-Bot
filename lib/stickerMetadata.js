// Dados exibidos pelo WhatsApp ao abrir os detalhes da figurinha.
const clean = (value, fallback, limit = 36) => Array.from(String(value || fallback).replace(/[\r\n\t]+/g, " ").trim() || fallback).slice(0, limit).join("");
export function buildStickerLabels({userNick, groupName, botName, creatorName, packName, publisher} = {}) {
  const user = clean(userNick, "Usuário");
  const group = clean(groupName, "Privado");
  const owner = clean(creatorName, "Kobayashi");
  return {
    pack: packName || `🐉 Criada por: ${user}\n👑 Dono: ${owner}`,
    publisher: publisher || `🔥 Feita por: Kobayashi Bot\n🏯 Grupo: ${group}`
  };
}
