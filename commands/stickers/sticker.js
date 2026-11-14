const originals = new Map();
const TTL = 300000;
const LIMIT = 32 * 1024 * 1024;
const wrappers = ["ephemeralMessage", "viewOnceMessage", "viewOnceMessageV2",
  "viewOnceMessageV2Extension", "documentWithCaptionMessage", "deviceSentMessage"];

export function readStickerMessage(message) {
  const seen = new Set();
  for (let i = 0; i < 12 && message && !seen.has(message); i++) {
    seen.add(message);
    for (const type of ["image", "video", "sticker"]) {
      const media = message[type + "Message"];
      if (media) return {type, media, message};
    }
    const inner = wrappers.map(key => message[key]?.message).find(Boolean);
    if (!inner) break;
    message = inner;
  }
  return {message: message || {}, type: null, media: null};
}

const keyOf = key => JSON.stringify([key?.remoteJid, key?.id]);
const keyBytes = media => media?.mediaKey?.byteLength || media?.mediaKey?.length || media?.mediaKey?.data?.length || 0;
const score = media => Number(keyBytes(media) > 0) + Number(Boolean(media?.url || media?.directPath));

// Captura os dados originais antes de captcha, comandos ou outras transformações.
export function rememberStickerOriginal(info, now = Date.now()) {
  const parsed = readStickerMessage(info?.message);
  if (!parsed.media || !info?.key?.id || !info?.key?.remoteJid) return;
  for (const [key, entry] of originals) if (now - entry.at >= TTL) originals.delete(key);
  const key = keyOf(info.key);
  const old = originals.get(key);
  if (old && score(old.media) > score(parsed.media)) return;
  const media = {...parsed.media};
  if (Buffer.isBuffer(media.mediaKey) || ArrayBuffer.isView(media.mediaKey)) media.mediaKey = Buffer.from(media.mediaKey);
  originals.set(key, {at: now, key: {...info.key}, type: parsed.type, media});
  if (originals.size > 200) originals.delete(originals.keys().next().value);
}

export function stickerCaption(message) {
  const parsed = readStickerMessage(message);
  return typeof parsed.media?.caption === "string" ? parsed.media.caption : "";
}

export function resolveStickerInput(info, now = Date.now()) {
  const current = readStickerMessage(info?.message);
  if (current.media) return {...current, key: info.key, source: "current", original: true};
  const context = Object.values(current.message).find(node => node?.contextInfo?.quotedMessage)?.contextInfo;
  if (!context) return null;
  const cachedKey = keyOf({remoteJid: info?.key?.remoteJid, id: context.stanzaId});
  const cached = originals.get(cachedKey);
  if (cached && now - cached.at >= TTL) originals.delete(cachedKey);
  if (cached && now - cached.at < TTL) return {...cached, source: "quoted", original: true};
  const quoted = readStickerMessage(context.quotedMessage);
  if (!quoted.media) return null;
  return {...quoted, source: "quoted", original: false,
    key: {remoteJid:info?.key?.remoteJid, id:context.stanzaId,
      participant:context.participant || context.participantAlt, fromMe:false}};
}

async function mediaBuffer(input, deps) {
  if (input.media.directPath && keyBytes(input.media)) {
    const stream = await deps.downloadContentFromMessage(input.media, input.type, {});
    const chunks = [];
    let size = 0;
    for await (const chunk of stream) {
      size += chunk.length;
      if (size > LIMIT) { stream.destroy?.(); throw new Error("media-too-large"); }
      chunks.push(chunk);
    }
    if (!size) throw new Error("empty-media");
    return Buffer.concat(chunks);
  }
  const target = {key:input.key, message:{[input.type + "Message"]:input.media}};
  const result = await deps.downloadMediaMessage(target, "buffer", {}, {
    logger: console,
    ...(deps.conn?.updateMediaMessage ? {reuploadRequest:deps.conn.updateMediaMessage.bind(deps.conn)} : {})
  });
  if (!Buffer.isBuffer(result) || !result.length) throw new Error("empty-media");
  if (result.length > LIMIT) throw new Error("media-too-large");
  return result;
}

export async function runStickerCommand(ctx, deps) {
  const input = resolveStickerInput(ctx.info);
  if (!input) return ctx.reply(`🎴 Envie uma foto/vídeo com ${ctx.prefix}${ctx.command} na legenda ou responda à mídia. Vídeos: até 9.9 segundos.`);
  if (input.type === "video" && Number(input.media.seconds || 0) > 9.9) {
    return ctx.reply("🎞️ O vídeo precisa ter no máximo 9.9 segundos.");
  }
  const location = Boolean(input.media.url || input.media.directPath);
  if (!keyBytes(input.media) || !location) {
    return ctx.reply(`❌ A mensagem chegou sem os dados necessários para baixar a mídia.\nTipo: ${input.type} • origem: ${input.source}\nOriginal recebido: ${input.original ? "sim" : "não"} • legenda recebida: ${Boolean(input.media.caption) ? "sim" : "não"}\nChave: ${keyBytes(input.media)} bytes • endereço: ${location ? "sim" : "não"}\nEnvie este diagnóstico ao dono. Não é uma falha de conversão.`);
  }
  let stage = "download";
  try {
    const buffer = await mediaBuffer(input, {...deps, conn:ctx.conn});
    stage = "conversion";
    const sticker = input.type === "sticker"
      ? await deps.applyStickerMetadata(buffer, ctx.metadata)
      : await deps.makeSticker(buffer, {isVideo:input.type === "video",
        forceSquare:ctx.command !== "s2", metadata:ctx.metadata});
    stage = "send";
    return await ctx.conn.sendMessage(ctx.from, {sticker}, {quoted:ctx.info});
  } catch (error) {
    const raw = Number(error?.output?.statusCode || error?.statusCode || error?.status);
    const status = Number.isInteger(raw) && raw >= 100 && raw <= 599 ? raw : "—";
    console.error("[Sticker novo]", stage, status);
    return ctx.reply(`❌ Falha na etapa: ${stage}. Código: ${status}.\nTipo: ${input.type} • origem: ${input.source} • original recebido: ${input.original ? "sim" : "não"}\nChave: ${keyBytes(input.media)} bytes • URL: ${input.media.url ? "sim" : "não"} • caminho: ${input.media.directPath ? "sim" : "não"}`);
  }
}
