// Normaliza somente o conteúdo de mídia recebido; não recupera mídia expirada.
const originals = new Map();
const TTL = 5 * 60 * 1000;
const cacheKey = (chat, id) => JSON.stringify([chat, id]);

export function rememberStickerMediaMessage(info, now = Date.now()) {
  const message = unwrapStickerMessage(info?.message);
  if (!message.imageMessage && !message.videoMessage) return;
  const {remoteJid, id} = info?.key || {};
  if (!remoteJid || !id) return;
  for (const [key, entry] of originals) if (now - entry.at >= TTL) originals.delete(key);
  const key = cacheKey(remoteJid, id);
  originals.set(key, {at:now, key:{...info.key}, message});
  if (originals.size > 200) originals.delete(originals.keys().next().value);
}

export function unwrapStickerMessage(message) {
  for (let depth = 0; depth < 10 && message; depth++) {
    const inner = message.ephemeralMessage?.message ||
      message.viewOnceMessage?.message || message.viewOnceMessageV2?.message ||
      message.viewOnceMessageV2Extension?.message ||
      message.documentWithCaptionMessage?.message;
    if (!inner) break;
    message = inner;
  }
  return message || {};
}

export function getStickerMediaTarget(info, now = Date.now()) {
  const current = unwrapStickerMessage(info?.message);
  const media = message => Boolean(message.imageMessage || message.videoMessage || message.stickerMessage);
  if (media(current)) return {...info, message: current, source: "current"};
  const context = Object.values(current).find(node => node?.contextInfo?.quotedMessage)?.contextInfo;
  const quoted = unwrapStickerMessage(context?.quotedMessage);
  const originalKey = cacheKey(info?.key?.remoteJid, context?.stanzaId);
  const original = originals.get(originalKey);
  if (original && now - original.at >= TTL) originals.delete(originalKey);
  if (original && now - original.at < TTL) {
    const quotedType = quoted.imageMessage ? "imageMessage" : quoted.videoMessage ? "videoMessage" : null;
    if (!quotedType || original.message[quotedType]) {
      return {key:original.key, message:original.message, source:"quoted"};
    }
  }
  if (!media(quoted)) return null;
  return {
    key: {remoteJid: info?.key?.remoteJid, id: context.stanzaId,
      participant: context.participant || context.participantAlt, fromMe: false},
    message: quoted, source: "quoted"
  };
}
