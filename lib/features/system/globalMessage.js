// Resolve fotos atuais e citadas sem depender do tipo do envelope externo.
export function unwrapGlobalMessage(message) {
  for (let depth = 0; depth < 10 && message; depth++) {
    const nested = message.ephemeralMessage?.message ||
      message.viewOnceMessage?.message || message.viewOnceMessageV2?.message ||
      message.viewOnceMessageV2Extension?.message || message.documentWithCaptionMessage?.message;
    if (!nested) break;
    message = nested;
  }
  return message || {};
}

export function getGlobalImageTarget(info) {
  const current = unwrapGlobalMessage(info?.message);
  if (current.imageMessage) return { ...info, message: current, source: 'current' };
  const context = Object.values(current).find(node => node?.contextInfo?.quotedMessage)?.contextInfo;
  const quoted = unwrapGlobalMessage(context?.quotedMessage);
  if (!quoted.imageMessage) return null;
  return {
    key: { remoteJid: info?.key?.remoteJid, id: context.stanzaId,
      participant: context.participant || context.participantAlt, fromMe: false },
    message: quoted, source: 'quoted'
  };
}

export function getGlobalNoticeText(fullCommandText) {
  return String(fullCommandText || '').replace(/^\S+(?:\s+|$)/, '').trim();
}
