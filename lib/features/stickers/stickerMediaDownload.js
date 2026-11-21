// Somente mídias comuns: não remove envelopes de visualização única.
export function isViewOnceStickerMessage(message) {
  const seen = new Set();
  for (let i = 0; i < 12 && message && !seen.has(message); i++) {
    seen.add(message);
    if (message.viewOnceMessage || message.viewOnceMessageV2 || message.viewOnceMessageV2Extension) return true;
    if (["imageMessage", "videoMessage", "stickerMessage"].some(type => message[type]?.viewOnce)) return true;
    message = message.ephemeralMessage?.message || message.documentWithCaptionMessage?.message || message.deviceSentMessage?.message;
  }
  return false;
}
export function stickerMediaKeyBytes(value) {
  if (Buffer.isBuffer(value)) return Buffer.from(value);
  if (ArrayBuffer.isView(value)) return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  const list = Array.isArray(value) ? value : value?.type === "Buffer" && Array.isArray(value.data) ? value.data : null;
  if (list && list.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) return Buffer.from(list);
  if (typeof value === "string" && value.length <= 256 && /^[A-Za-z0-9+/]+={0,2}$/.test(value)) {
    const buffer = Buffer.from(value, "base64");
    if (buffer.toString("base64").replace(/=+$/, "") === value.replace(/=+$/, "")) return buffer;
  }
  return Buffer.alloc(0);
}
const mediaStatus = error => Number(error?.output?.statusCode || error?.statusCode || error?.status || error?.response?.status);
// Baileys pode rejeitar mídia sem "url" no wrapper, mesmo com directPath válido.
export function stickerDownloadDiagnostic(target, error) {
  const message = target?.message || {};
  const type = message.imageMessage ? "image" : message.videoMessage ? "video" : message.stickerMessage ? "sticker" : "unknown";
  const node = message[type + "Message"] || {};
  const key = node.mediaKey;
  const keyBytes = stickerMediaKeyBytes(key).length;
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

export async function downloadStickerMedia(target, {downloadMediaMessage, downloadContentFromMessage, conn, preferDirect = false}) {
  if (isViewOnceStickerMessage(target?.message)) throw Object.assign(new Error("view-once-protected"), {code:"VIEW_ONCE_PROTECTED"});
  const message = target?.message || {};
  const type = message.imageMessage ? "image" : message.videoMessage ? "video" : message.stickerMessage ? "sticker" : null;
  let node = type ? message[type + "Message"] : null;
  const normalize = value => value ? {...value, mediaKey:stickerMediaKeyBytes(value.mediaKey)} : null;
  node = normalize(node);
  const canUsePath = Boolean(node?.directPath && node?.mediaKey?.length);
  const attempt = async (route, operation) => {
    try { return await operation(); }
    catch (error) {
      try { error.stickerRoute = route; } catch {}
      throw error;
    }
  };
  const contentDownload = typeof conn?.downloadContentFromMessage === "function" ? conn.downloadContentFromMessage.bind(conn) : downloadContentFromMessage;
  const wrapperDownload = typeof conn?.downloadMediaMessage === "function" ? conn.downloadMediaMessage.bind(conn) : downloadMediaMessage;
  const direct = () => attempt("direct", async () => {
    const stream = await contentDownload(node, type, {});
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
  const directWithRefresh = async () => {
    try { return await direct(); }
    catch (error) {
      if (![404,410].includes(mediaStatus(error)) || !target?.key?.id || typeof conn?.updateMediaMessage !== "function") throw error;
      // Usa somente o mecanismo normal de renovação da própria mensagem, uma vez.
      const freshTarget = {key:{...target.key}, message:{[type + "Message"]:{...node}}};
      const updated = await conn.updateMediaMessage(freshTarget);
      const fresh = updated || freshTarget;
      if (isViewOnceStickerMessage(fresh.message)) throw Object.assign(new Error("view-once-protected"), {code:"VIEW_ONCE_PROTECTED"});
      if ((fresh.key?.id && fresh.key.id !== target.key.id) || (fresh.key?.remoteJid && fresh.key.remoteJid !== target.key.remoteJid)) throw new Error("media-refresh-mismatch");
      node = normalize(fresh.message?.[type + "Message"]);
      if (!node?.mediaKey?.length || !(node.directPath || node.url)) throw new Error("media-refresh-incomplete");
      return direct();
    }
  };
  if (canUsePath && (preferDirect || !node.url)) return directWithRefresh();
  try {
    const buffer = await attempt("wrapper", () => wrapperDownload({...target, message:{[type + "Message"]:node}}, "buffer", {options:{maxContentLength:32 * 1024 * 1024}}, {
      logger: console,
      ...(typeof conn?.updateMediaMessage === "function" ? {reuploadRequest: conn.updateMediaMessage.bind(conn)} : {})
    }));
    if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error("sticker_media_empty");
    if (buffer.length > 32 * 1024 * 1024) throw new Error("sticker_media_too_large");
    return buffer;
  } catch (error) {
    const status = Number(error?.output?.statusCode || error?.statusCode || error?.status);
    if (status === 400 && canUsePath) return directWithRefresh();
    throw error;
  }
}
