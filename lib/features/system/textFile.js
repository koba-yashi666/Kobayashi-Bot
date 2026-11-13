function unwrap(message) {
  for (let i = 0; i < 10 && message; i++) {
    const inner = message.ephemeralMessage?.message || message.viewOnceMessage?.message ||
      message.viewOnceMessageV2?.message || message.viewOnceMessageV2Extension?.message ||
      message.documentWithCaptionMessage?.message;
    if (!inner) break;
    message = inner;
  }
  return message || {};
}

export function textForFile(info, rawCommandText = "") {
  // Remove somente o comando e um separador; mantém o conteúdo e as quebras.
  const inline = String(rawCommandText).replace(/^\S+(?:\r?\n|[ \t])?/, "");
  if (inline.trim()) return inline;
  const current = unwrap(info?.message);
  const context = Object.values(current).find(node => node?.contextInfo?.quotedMessage)?.contextInfo;
  const quoted = unwrap(context?.quotedMessage);
  return quoted.conversation ?? quoted.extendedTextMessage?.text ??
    quoted.imageMessage?.caption ?? quoted.videoMessage?.caption ??
    quoted.documentMessage?.caption ?? "";
}

export async function sendTextFile({info, rawCommandText, conn, from, reply, prefix = "/"}) {
  const text = textForFile(info, rawCommandText);
  if (!text.trim()) return reply(`📄 Use *${prefix}txt seu texto* ou responda uma mensagem com *${prefix}txt*.`);
  if (Buffer.byteLength(text, "utf8") > 1024 * 1024) return reply("📄 O texto ultrapassa o limite de 1 MB.");
  return conn.sendMessage(from, {
    document: Buffer.from(text, "utf8"),
    mimetype: "text/plain",
    fileName: "texto.txt"
  }, {quoted: info});
}
