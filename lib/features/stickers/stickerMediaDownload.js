// Baileys pode rejeitar mídia sem "url" no wrapper, mesmo com directPath válido.
export function stickerDownloadDiagnostic(target, error) {
  const message = target?.message || {};
  const type = message.imageMessage ? "image" : message.videoMessage ? "video" : message.stickerMessage ? "sticker" : "unknown";
  const node = message[type + "Message"] || {};
  const key = node.mediaKey;
  const keyBytes = Buffer.isBuffer(key) || ArrayBuffer.isView(key) ? key.byteLength :
    Array.isArray(key) ? key.length : Array.isArray(key?.data) ? key.data.length : 0;
  const rawStatus = Number(error?.output?.statusCode || error?.statusCode || error?.status || error?.response?.status);
  const status = Number.isInteger(rawStatus) && rawStatus >= 100 && rawStatus <= 599 ? rawStatus : 0;
  const text = String(error?.message || "").toLowerCase();
  const reason = /no message present/.test(text) ? "missing-message" :
    /not a media message/.test(text) ? "not-media" :
    /no valid media url/.test(text) ? "missing-location" :
    /bad decrypt|decrypt|authenticate data/.test(text) ? "decrypt" :
    /too_large/.test(text) ? "size-limit" : /empty/.test(text) ? "empty" :
    status ? "http-or-baileys" : "unknown";
  return {
    type, source: target?.source === "quoted" ? "quoted" : "current",
    keyBytes, hasUrl: Boolean(node.url), hasDirectPath: Boolean(node.directPath),
    status, reason, route: ["direct", "wrapper"].includes(error?.stickerRoute) ? error.stickerRoute : "unknown"
  };
}

export function formatStickerDownloadDiagnostic(target, error) {
  const d = stickerDownloadDiagnostic(target, error);
  return `Tipo: ${d.type} • origem: ${d.source}\nChave: ${d.keyBytes} bytes • URL: ${d.hasUrl ? "sim" : "não"} • caminho: ${d.hasDirectPath ? "sim" : "não"}\nCódigo: ${d.status || "—"} • rota: ${d.route} • motivo: ${d.reason}`;
}

export async function downloadStickerMedia(target, {downloadMediaMessage, downloadContentFromMessage, conn}) {
  const message = target?.message || {};
  const type = message.imageMessage ? "image" : message.videoMessage ? "video" : message.stickerMessage ? "sticker" : null;
  const node = type ? message[type + "Message"] : null;
  const canUsePath = Boolean(node?.directPath && node?.mediaKey);
  const attempt = async (route, operation) => {
    try { return await operation(); }
    catch (error) {
      try { error.stickerRoute = route; } catch {}
      throw error;
    }
  };
  const direct = () => attempt("direct", async () => {
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
  });
  if (canUsePath && !node.url) return direct();
  try {
    return await attempt("wrapper", () => downloadMediaMessage(target, "buffer", {}, {
      logger: console,
      ...(typeof conn?.updateMediaMessage === "function" ? {reuploadRequest: conn.updateMediaMessage.bind(conn)} : {})
    }));
  } catch (error) {
    const status = Number(error?.output?.statusCode || error?.statusCode || error?.status);
    if (status === 400 && canUsePath) return direct();
    throw error;
  }
}
