// Normaliza somente o conteúdo de mídia recebido; não recupera mídia expirada.
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

export function getStickerMediaTarget(info) {
  const current = unwrapStickerMessage(info?.message);
  const media = message => Boolean(message.imageMessage || message.videoMessage || message.stickerMessage);
  if (media(current)) return {...info, message: current, source: "current"};
  const context = Object.values(current).find(node => node?.contextInfo?.quotedMessage)?.contextInfo;
  const quoted = unwrapStickerMessage(context?.quotedMessage);
  if (!media(quoted)) return null;
  return {
    key: {remoteJid: info?.key?.remoteJid, id: context.stanzaId,
      participant: context.participant || context.participantAlt, fromMe: false},
    message: quoted, source: "quoted"
  };
}
