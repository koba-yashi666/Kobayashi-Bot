// Baileys pode rejeitar mídia sem "url" no wrapper, mesmo com directPath válido.
export async function downloadStickerMedia(target, {downloadMediaMessage, downloadContentFromMessage, conn}) {
  const message = target?.message || {};
  const type = message.imageMessage ? "image" : message.videoMessage ? "video" : message.stickerMessage ? "sticker" : null;
  const node = type ? message[type + "Message"] : null;
  const canUsePath = Boolean(node?.directPath && node?.mediaKey);
  const direct = async () => {
    const stream = await downloadContentFromMessage(node, type, {});
    const chunks = [];
    let size = 0;
    for await (const chunk of stream) {
      size += chunk.length;
      if (size > 32 * 1024 * 1024) {
        stream.destroy?.();
        throw new Error("sticker_media_too_large");
      }
      chunks.push(chunk);
    }
    if (!size) throw new Error("sticker_media_empty");
    return Buffer.concat(chunks);
  };
  if (canUsePath && !node.url) return direct();
  try {
    return await downloadMediaMessage(target, "buffer", {}, {
      logger: console,
      ...(typeof conn?.updateMediaMessage === "function" ? {reuploadRequest: conn.updateMediaMessage.bind(conn)} : {})
    });
  } catch (error) {
    const status = Number(error?.output?.statusCode || error?.statusCode || error?.status);
    if (status === 400 && canUsePath) return direct();
    throw error;
  }
}
