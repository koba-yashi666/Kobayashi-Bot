/*ESSA BASE FOI DESENVOLVIDA PELO ALVES COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY ALVES
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

import { getContentType, delay, downloadMediaMessage } from "@whiskeysockets/baileys";
import fs from "fs";
import { fileURLToPath } from "url";
import { checkUpdate, applyUpdate, getLocalVersion } from "./updater.js";

import { moment, colors, linguagem, mess, normalizeJid, getPNForJid, getGroupAdmins, logos, baileysVersion, fetch, axios, fs as fsx, os, path, randomBytes, ffmpeg } from "./settings/imports/consts.js";

import { getGroupMetadata } from "./lib/groupCache.js";

const settings = JSON.parse(fs.readFileSync(new URL("./settings/settings.json", import.meta.url)));

const { prefix, NomeDoBot, ownerNumber, ownerName } = settings;

const ADV_DB = path.join(process.cwd(), "files", "database", "adv.json");

const FUN_DB = path.join(process.cwd(), "files", "database", "brincadeiras.json");

function ensureFunDb() {
  try {
    fs.mkdirSync(path.dirname(FUN_DB), { recursive: true });
    if (!fs.existsSync(FUN_DB)) {
      fs.writeFileSync(FUN_DB, JSON.stringify({ groups: {}, scores: {} }, null, 2), "utf8");
    }
  } catch {}
}

function readFunDb() {
  ensureFunDb();
  try {
    const data = JSON.parse(fs.readFileSync(FUN_DB, "utf8"));
    return {
      groups: data?.groups && typeof data.groups === "object" ? data.groups : {},
      scores: data?.scores && typeof data.scores === "object" ? data.scores : {},
    };
  } catch {
    return { groups: {}, scores: {} };
  }
}

function writeFunDb(data) {
  ensureFunDb();
  fs.writeFileSync(FUN_DB, JSON.stringify(data, null, 2), "utf8");
}

function isFunModeEnabled(groupJid) {
  const db = readFunDb();
  return db.groups?.[groupJid]?.enabled === true;
}

function setFunMode(groupJid, enabled) {
  const db = readFunDb();
  if (!db.groups[groupJid]) db.groups[groupJid] = {};
  db.groups[groupJid].enabled = Boolean(enabled);
  writeFunDb(db);
  return db.groups[groupJid].enabled;
}

function getOrCreateFunScore(groupJid, category, jid) {
  const db = readFunDb();
  if (!db.scores[groupJid]) db.scores[groupJid] = {};
  if (!db.scores[groupJid][category]) db.scores[groupJid][category] = {};
  if (!Number.isInteger(db.scores[groupJid][category][jid])) {
    // Persistente: o primeiro valor sorteado permanece até o DB ser limpo.
    db.scores[groupJid][category][jid] = Math.floor(Math.random() * 101);
    writeFunDb(db);
  }
  return db.scores[groupJid][category][jid];
}

function getTwoTargetsFromMessage(info, sender, text) {
  const context =
    info.message?.extendedTextMessage?.contextInfo ||
    info.message?.imageMessage?.contextInfo ||
    info.message?.videoMessage?.contextInfo ||
    {};
  const mentions = context.mentionedJid || [];
  if (mentions.length >= 2) return [mentions[0], mentions[1]];
  if (mentions.length === 1) return [sender, mentions[0]];

  const quotedTarget = context.participant || context.participantAlt;
  if (quotedTarget) return [sender, quotedTarget];

  return [sender, null];
}

function funCardPath(name) {
  return path.join(process.cwd(), "settings", "FUN", `${name}.png`);
}

async function sendFunCard(conn, from, info, card, caption, mentions = []) {
  const imagePath = funCardPath(card);
  if (fs.existsSync(imagePath)) {
    return conn.sendMessage(
      from,
      { image: fs.readFileSync(imagePath), caption, mentions },
      { quoted: info }
    );
  }
  return conn.sendMessage(from, { text: caption, mentions }, { quoted: info });
}



const SETTINGS_FILE = new URL("./settings/settings.json", import.meta.url);

function readSettingsFile() {
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
}

function writeSettingsFile(next) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2), "utf8");
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}



function ensureAdvDb() {
  try {
    fs.mkdirSync(path.dirname(ADV_DB), { recursive: true });
    if (!fs.existsSync(ADV_DB)) fs.writeFileSync(ADV_DB, "{}", "utf8");
  } catch {}
}

function readAdvDb() {
  ensureAdvDb();
  try {
    const data = JSON.parse(fs.readFileSync(ADV_DB, "utf8"));
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function writeAdvDb(data) {
  ensureAdvDb();
  fs.writeFileSync(ADV_DB, JSON.stringify(data, null, 2), "utf8");
}

function getQuotedMessage(info) {
  const context = info.message?.extendedTextMessage?.contextInfo ||
    info.message?.imageMessage?.contextInfo ||
    info.message?.videoMessage?.contextInfo ||
    info.message?.documentMessage?.contextInfo;
  if (!context?.quotedMessage) return null;
  return {
    key: {
      remoteJid: info.key.remoteJid,
      fromMe: false,
      id: context.stanzaId,
      participant: context.participant || context.participantAlt,
    },
    message: context.quotedMessage,
  };
}


function getCurrentOrQuotedMedia(info) {
  const currentMessage = info?.message || {};
  const currentType = getContentType(currentMessage);

  if (["imageMessage", "videoMessage", "stickerMessage"].includes(currentType)) {
    return { key: info.key, message: currentMessage, source: "current" };
  }

  const quoted = getQuotedMessage(info);
  if (quoted?.message) {
    const quotedType = getContentType(quoted.message);
    if (["imageMessage", "videoMessage", "stickerMessage"].includes(quotedType)) {
      return { ...quoted, source: "quoted" };
    }
  }

  return null;
}

function getTargetFromMessage(info, fallback) {
  const context = info.message?.extendedTextMessage?.contextInfo ||
    info.message?.imageMessage?.contextInfo ||
    info.message?.videoMessage?.contextInfo ||
    info.message?.documentMessage?.contextInfo;
  return context?.mentionedJid?.[0] || context?.participant || fallback || null;
}

function inputToJid(text) {
if (!text) return null;
const onlyNumber = text.replace(/\D/g, "");
return onlyNumber ? `${onlyNumber}@lid` : null;
}

export default async function start(upsert, conn) {
try {
for (const info of upsert?.messages || []) {
if (!info.message) continue;
if (upsert.type === "append") continue;

const type = getContentType(info.message);
const pushname = info.pushName ? info.pushName : "";

const from = info.key.remoteJid;
const isGroup = from.endsWith("@g.us");
const isStatus = from.endsWith("@broadcast");

function extractCommandText(message = {}) {
  try {
    const interactiveId = JSON.parse(
      message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || "{}"
    )?.id;

    return (
      message?.conversation ||
      message?.extendedTextMessage?.text ||
      message?.imageMessage?.caption ||
      message?.videoMessage?.caption ||
      message?.documentMessage?.caption ||
      message?.documentWithCaptionMessage?.message?.documentMessage?.caption ||
      message?.viewOnceMessage?.message?.imageMessage?.caption ||
      message?.viewOnceMessage?.message?.videoMessage?.caption ||
      message?.viewOnceMessageV2?.message?.imageMessage?.caption ||
      message?.viewOnceMessageV2?.message?.videoMessage?.caption ||
      message?.ephemeralMessage?.message?.conversation ||
      message?.ephemeralMessage?.message?.extendedTextMessage?.text ||
      message?.ephemeralMessage?.message?.imageMessage?.caption ||
      message?.ephemeralMessage?.message?.videoMessage?.caption ||
      message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text ||
      message?.editedMessage?.message?.protocolMessage?.editedMessage?.imageMessage?.caption ||
      message?.editedMessage?.message?.protocolMessage?.editedMessage?.videoMessage?.caption ||
      message?.buttonsMessage?.imageMessage?.caption ||
      message?.buttonsResponseMessage?.selectedButtonId ||
      message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
      message?.templateButtonReplyMessage?.selectedId ||
      interactiveId ||
      ""
    );
  } catch {
    return "";
  }
}

const body = extractCommandText(info.message) || info?.text || "";

const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : null;

const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");

let groupMetadata = "";
try {
groupMetadata = isGroup ? await getGroupMetadata(conn, from) : "";
} catch {
continue;
}

const groupName = isGroup ? groupMetadata.subject : "";

const rawSender = info.key.fromMe
? conn?.user?.id
: info?.key?.participant || from;

const sender =
(await getPNForJid(conn, rawSender, info?.key?.participantAlt)) ||
normalizeJid(rawSender);

const botNumber = await getPNForJid(conn, conn.user.id, conn.user.lid || conn.user.phoneNumber) ||
(conn.user.id.split(":")[0] + "@s.whatsapp.net");

const groupMembers = isGroup ? groupMetadata.participants : "";

const dono = ownerNumber + "@s.whatsapp.net";
const SoDono = sender === dono;
const runtimeSettings = readSettingsFile();
if (!isGroup && !isStatus && !info.key.fromMe && runtimeSettings.antiPv && !SoDono) {
  if (isCmd) {
    await conn.sendMessage(from, { text: "🐉🌸 Meu privado está desativado pelo proprietário." }, { quoted: info });
  }
  continue;
}

const groupAdmins = isGroup ? await getGroupAdmins(groupMembers, conn) : "";
const isGroupAdmins = groupAdmins.includes(sender) || SoDono || false;

const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;

const menc_prt = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
const menc_info = info.message?.extendedTextMessage?.contextInfo;
const numDigitado = inputToJid(q);
const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const menc_os2 = menc_info?.participant || menc_info?.mentionedJid?.[0] || numDigitado || null;

const MessageType =
type == "audioMessage" ? "Áudio" :
type == "stickerMessage" ? "Figurinha" :
type == "imageMessage" ? "Imagem" :
type == "videoMessage" ? "Vídeo" :
type == "documentMessage" ? "Documento" :
type == "contactMessage" ? "Contato" :
type == "locationMessage" ? "Localização" :
info.message?.reactionMessage?.text ? `Reação '${info.message.reactionMessage.text}'` :
"Texto";

const hourofc = moment.tz("America/Sao_Paulo").format("HH:mm:ss");

if (!isGroup && isCmd) console.log(`${colors.red("╭════════════════════╮")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Cmd-Privado: ${MessageType}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Número: ${sender.split("@")[0]}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("╰════════════════════╯")}`);

if (!isGroup && !isCmd && !info.key.fromMe) console.log(`${colors.red("╭════════════════════╮")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Msg-Privado: ${MessageType}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Número: ${sender.split("@")[0]}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("╰════════════════════╯")}`);

if (isGroup && !isCmd && !info.key.fromMe) console.log(`${colors.red("╭════════════════════╮")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Msg-Grupo: ${MessageType}
${colors.red("┃")} Grupo: ${groupName}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("╰════════════════════╯")}`);

if (isGroup && isCmd) console.log(`${colors.red("╭════════════════════╮")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Cmd-Grupo: ${MessageType}
${colors.red("┃")} Grupo: ${groupName}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("╰════════════════════╯")}`);

async function reply(texto) {
await conn.sendPresenceUpdate("composing", from);

return conn.sendMessage(from, { text: texto }, { quoted: info });
}

async function sendMenu(from, caption, sender) {
try {
reagir("❤️");
const menuImagePath = path.join(process.cwd(), "settings", "LOGOS", "menu.png");
await conn.sendMessage(
from,
{ image: fsx.readFileSync(menuImagePath), caption, mentions: [sender] },
{ quoted: info }
);
} catch (e) {
console.log(e);
reply("❌ Erro ao enviar menu em imagem.");
}
};

const enviarImg = async (link) => {
await conn.sendMessage(from, { image: { url: link } }, { quoted: info });
};

const enviarImg2 = async (link, texto) => {
await conn.sendMessage(from, { image: { url: link }, caption: texto }, { quoted: info });
};

const enviarGif = async (link) => {
await conn.sendMessage(from, { video: { url: link }, gifPlayback: true }, { quoted: info });
};

const enviarVd = async (link) => {
await conn.sendMessage(from, { video: { url: link }, mimetype: "video/mp4", fileName: "video.mp4" }, { quoted: info });
};

const enviarVd2 = async (link, texto) => {
await conn.sendMessage(
from,
{ video: { url: link }, caption: texto, mimetype: "video/mp4", fileName: "video.mp4" },
{ quoted: info }
);
};

const enviarAd = async (link) => {
conn.sendPresenceUpdate("recording", from);
await delay(1000);
await conn.sendMessage(from, { audio: { url: link }, mimetype: "audio/mpeg" }, { quoted: info });
};

const enviarAd2 = async (link) => {
await conn.sendMessage(from, { audio: { url: link }, mimetype: "audio/mpeg", ptt: true }, { quoted: info });
};

async function toPTT(link) {
const tmpId = randomBytes(6).toString("hex");
const inputPath = path.join(os.tmpdir(), `ptt-in-${tmpId}`);
const outputPath = path.join(os.tmpdir(), `ptt-out-${tmpId}.ogg`);

const res = await fetch(link);
const buffer = Buffer.from(await res.arrayBuffer());
fsx.writeFileSync(inputPath, buffer);

await new Promise((resolve, reject) => {
ffmpeg(inputPath)
.audioCodec("libopus")
.audioBitrate("64k")
.audioChannels(1)
.format("ogg")
.on("end", resolve)
.on("error", reject)
.save(outputPath);
});

const oggBuffer = fsx.readFileSync(outputPath);
fsx.unlinkSync(inputPath);
fsx.unlinkSync(outputPath);

return oggBuffer;
}

const enviarPtt = async (link) => {
conn.sendPresenceUpdate("recording", from);
const oggBuffer = await toPTT(link);
await conn.sendMessage(from, { audio: oggBuffer, mimetype: "audio/ogg; codecs=opus", ptt: true }, { quoted: info });
};

const reagir = (reassao) => {
conn.sendMessage(from, { react: { text: reassao, key: info.key } });
};

if (isCmd) {
switch (command) {
// comandos públicos
case "stickers":
case "sticker":
case "s": {
  reagir("🎨");
  const mediaTarget = getCurrentOrQuotedMedia(info);
  if (!mediaTarget?.message) return reply(`🎨🌸 Envie uma *imagem/vídeo com ${prefix}s na legenda* ou responda uma mídia com o comando.`);

  try {
    const quotedType = getContentType(mediaTarget.message);
    if (!['imageMessage', 'videoMessage', 'stickerMessage'].includes(quotedType)) {
      return reply(`🎨🌸 O arquivo respondido não é uma imagem, vídeo ou figurinha.`);
    }

    if (quotedType === 'stickerMessage') {
      const stickerBuffer = await downloadMediaMessage(mediaTarget, 'buffer', {});
      return conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: info });
    }

    const mediaBuffer = await downloadMediaMessage(mediaTarget, 'buffer', {});
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default || sharpModule;

    if (quotedType === 'imageMessage') {
      const stickerBuffer = await sharp(mediaBuffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 90 })
        .toBuffer();
      return conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: info });
    }

    const tmpId = randomBytes(6).toString('hex');
    const inputPath = path.join(os.tmpdir(), `koba-sticker-${tmpId}.mp4`);
    const outputPath = path.join(os.tmpdir(), `koba-sticker-${tmpId}.webp`);
    fsx.writeFileSync(inputPath, mediaBuffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputOptions(['-t 6'])
        .outputOptions(['-vcodec libwebp', '-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=0x00000000', '-loop 0', '-an', '-vsync 0'])
        .toFormat('webp')
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });

    const stickerBuffer = fsx.readFileSync(outputPath);
    try { fsx.unlinkSync(inputPath); } catch {}
    try { fsx.unlinkSync(outputPath); } catch {}
    return conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: info });
  } catch (e) {
    console.error('Erro no comando stickers:', e);
    return reply(`❌🌸 Não consegui transformar essa mídia em figurinha. Verifique se o FFmpeg está instalado para vídeos.`);
  }
}
break;

case "ban":
case "b":
case "banc": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  const target = getTargetFromMessage(info, menc_os2);
  if (!target || target === from) return reply(`🐉🌸 Marque o membro ou responda à mensagem dele para usar ${prefix}ban.`);
  if (target === botNumber) return reply(`🌸 Eu não posso me banir do próprio grupo.`);
  if (target === dono) return reply(`👑 Não posso banir o dono do Kobayashi Bot.`);

  try {
    const targetNumber = target.split('@')[0];
    await conn.groupParticipantsUpdate(from, [target], 'remove');
    return conn.sendMessage(from, {
      text: `🐉🌸 *Membro removido!*\n\n👤 @${targetNumber}\n🛡️ Ação realizada por: @${sender.split('@')[0]}`,
      mentions: [target, sender],
    }, { quoted: info });
  } catch (e) {
    console.error('Erro no comando ban:', e);
    return reply(`❌🌸 Não consegui remover esse membro. Ele pode ser administrador ou o WhatsApp pode ter recusado a ação.`);
  }
}
break;

case "adv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const target = getTargetFromMessage(info, menc_os2);
  if (!target) return reply(`⚠️🌸 Marque um membro ou responda à mensagem dele.
Exemplo: ${prefix}adv @membro motivo`);
  if (target === botNumber) return reply(`🐉🌸 Eu não posso receber advertência.`);
  if (target === dono) return reply(`👑 O dono do Kobayashi Bot não pode receber advertência.`);

  const reason = args.filter((arg) => !arg.startsWith('@')).join(' ').trim() || 'Motivo não informado';
  const db = readAdvDb();
  if (!db[from]) db[from] = {};
  if (!db[from][target]) db[from][target] = { count: 0, history: [] };

  // Mantém o contador no máximo em 3 até a punição ser concluída.
  db[from][target].count = Math.min((db[from][target].count || 0) + 1, 3);
  db[from][target].history.push({
    reason,
    by: sender,
    at: new Date().toISOString(),
  });

  const count = db[from][target].count;
  writeAdvDb(db);

  if (count < 3) {
    return conn.sendMessage(from, {
      text:
        `⚠️🌸 *ADVERTÊNCIA REGISTRADA*

` +
        `👤 Usuário: @${target.split('@')[0]}
` +
        `📋 Motivo: ${reason}
` +
        `⚠️ Advertências: *${count}/3*
` +
        `🛡️ Aplicada por: @${sender.split('@')[0]}

` +
        `🐉 Ao atingir *3/3*, o membro será removido automaticamente.`,
      mentions: [target, sender],
    }, { quoted: info });
  }

  if (!isBotGroupAdmins) {
    return conn.sendMessage(from, {
      text:
        `🚨🌸 *LIMITE DE ADVERTÊNCIAS ATINGIDO*

` +
        `👤 @${target.split('@')[0]} chegou a *3/3 advertências*.
` +
        `📋 Último motivo: ${reason}

` +
        `⚠️ Eu preciso ser administradora para remover o membro automaticamente.`,
      mentions: [target],
    }, { quoted: info });
  }

  try {
    await conn.groupParticipantsUpdate(from, [target], "remove");

    // Zera as ADVs depois da remoção bem-sucedida.
    db[from][target] = { count: 0, history: [] };
    writeAdvDb(db);

    return conn.sendMessage(from, {
      text:
        `🚨🌸 *3/3 ADVERTÊNCIAS*

` +
        `👤 @${target.split('@')[0]} atingiu o limite.
` +
        `📋 Último motivo: ${reason}
` +
        `🔨 Membro removido automaticamente.
` +
        `♻️ Advertências zeradas.`,
      mentions: [target],
    }, { quoted: info });
  } catch (e) {
    console.error("Erro ao remover após 3 ADVs:", e);
    return conn.sendMessage(from, {
      text:
        `🚨🌸 *3/3 ADVERTÊNCIAS*

` +
        `👤 @${target.split('@')[0]} atingiu o limite, mas não consegui removê-lo.
` +
        `⚠️ Verifique se o membro é administrador ou se tenho permissão suficiente.`,
      mentions: [target],
    }, { quoted: info });
  }
}
break;

case "perfil": {
  const target = getTargetFromMessage(info, sender);
  const targetPN = await getPNForJid(conn, target, target);
  const targetJid = targetPN || normalizeJid(target);
  const number = targetJid?.split('@')[0] || target?.split('@')[0] || 'desconhecido';
  const isTargetOwner = targetJid === dono || target === dono;
  const targetParticipant = isGroup ? groupMembers.find((p) => {
    const raw = p?.id || p?.jid || p?.participant;
    return normalizeJid(raw) === targetJid || raw === target;
  }) : null;
  const admin = !!targetParticipant?.admin;
  const db = readAdvDb();
  const advCount = isGroup ? (db[from]?.[targetJid]?.count || db[from]?.[target]?.count || 0) : 0;
  const name = target === sender ? pushname || 'Usuário' : (targetParticipant?.name || targetParticipant?.notify || `Usuário ${number}`);

  return conn.sendMessage(from, {
    text: `🐉🌸 *PERFIL DO USUÁRIO*\n\n👤 Nome: *${name}*\n📱 Número: *${number}*\n${isGroup ? `👑 Cargo: *${isTargetOwner ? 'Dono do Bot' : admin ? 'Administrador' : 'Membro'}*\n⚠️ Advertências: *${advCount}*\n` : ''}🌸 Kobayashi Bot Beta`,
    mentions: [target],
  }, { quoted: info });
}
break;


// pacote de figurinhas aleatórias • quantidade obrigatória de 1 a 15
case "figurinhas":
case "stickerpack":
case "packfig": {
  try {
    const quantidadeTexto = String(args?.[0] || "").trim();

    if (!quantidadeTexto) {
      return reply(
        `╭🌸・🎨・☆・🎨・🌸╮
` +
        `┆ ⋮ *PACOTE DE FIGURINHAS*
` +
        `╰🌸・🎨・☆・🎨・🌸╯

` +
        `🔢 Por favor, selecione uma quantidade entre *1 e 15*.

` +
        `✨ Exemplos:
` +
        `┃ • *${prefix}figurinhas 5*
` +
        `┃ • *${prefix}figurinhas 10*
` +
        `┃ • *${prefix}figurinhas 15*

` +
        `🐉 A Kobayashi envia exatamente a quantidade escolhida.`
      );
    }

    const quantidade = Number(quantidadeTexto);

    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 15) {
      return reply(
        `❌🌸 *QUANTIDADE INVÁLIDA*

` +
        `Escolha um número inteiro entre *1 e 15*.

` +
        `Exemplo: *${prefix}figurinhas 10*`
      );
    }

    const destino = isGroup ? sender : from;

    if (isGroup) {
      await reply(
        `╭📬・🐉・☆・🐉・📬╮
` +
        `┆ ⋮ *PREPARANDO PACOTE*
` +
        `╰📬・🐉・☆・🐉・📬╯

` +
        `🎨 Quantidade: *${quantidade}*
` +
        `📱 Destino: *seu privado*
` +
        `⏳ Aguarde um pouquinho...`
      );
    } else {
      await reply(
        `╭🎨・🌸・☆・🌸・🎨╮
` +
        `┆ ⋮ *PREPARANDO PACOTE*
` +
        `╰🎨・🌸・☆・🌸・🎨╯

` +
        `✨ Vou enviar *${quantidade}* figurinha${quantidade > 1 ? "s" : ""}.
` +
        `⏳ Aguarde um pouquinho...`
      );
    }

    const usedNumbers = new Set();
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < quantidade; i++) {
      try {
        let randomNum;
        do {
          randomNum = Math.floor(Math.random() * 8051);
        } while (usedNumbers.has(randomNum));

        usedNumbers.add(randomNum);

        const stickerUrl =
          `https://raw.githubusercontent.com/badDevelopper/Testfigu/main/fig (${randomNum}).webp`;

        const response = await axios.get(stickerUrl, {
          responseType: "arraybuffer",
          timeout: 120000,
        });

        await conn.sendMessage(destino, {
          sticker: Buffer.from(response.data),
        });

        successCount++;
        await delay(800);
      } catch (stickerError) {
        console.error(`Erro ao buscar/enviar figurinha ${i + 1}:`, stickerError?.message || stickerError);
        failCount++;
      }
    }

    return conn.sendMessage(destino, {
      text:
        `╭🌸・✅・☆・✅・🌸╮
` +
        `┆ ⋮ *PACOTE CONCLUÍDO*
` +
        `╰🌸・✅・☆・✅・🌸╯

` +
        `🎨 Solicitadas: *${quantidade}*
` +
        `✅ Enviadas: *${successCount}*
` +
        `${failCount ? `⚠️ Falhas: *${failCount}*
` : ""}` +
        `
🐉 *Kobayashi Bot*`,
    });
  } catch (e) {
    console.error("Erro no comando figurinhas:", e);
    return reply(
      `❌🌸 *Não consegui buscar as figurinhas agora.*

` +
      `Tente novamente daqui a pouco.`
    );
  }
}
break;
//

// informações • v0.1.11
case "admins":
case "adms": {
  if (!isGroup) return reply(mess.onlyGroup());

  const adminsLista = Array.isArray(groupAdmins) ? groupAdmins : [];
  if (!adminsLista.length) return reply("🌸 Não encontrei administradores neste grupo.");

  const linhas = adminsLista.map((jid, i) => {
    const isOwnerBot = jid === dono;
    return `┃╎୨୧ ${isOwnerBot ? "👑" : "🛡️"} ${i + 1}. @${jid.split("@")[0]}${isOwnerBot ? " • Dono do Bot" : ""}`;
  }).join("\n");

  return conn.sendMessage(from, {
    text:
      `┏╾ׁ═╼･ﾟ♡ﾟ･｡🛡️｡･ﾟ♡ﾟ･╾ᷓ═╼┓\n` +
      `┣━〔 • 𝑨𝑫𝑴𝒊𝒏𝒔 • 🛡️ 〕\n` +
      `┗╾ׁ═╼･ﾟ♡ﾟ･｡🛡️｡･ﾟ♡ﾟ･╾ᷓ═╼┛\n╎\n` +
      `┃╭╾ׁ═╼〔 • 👑 • 〕╾ׁ═╼╮\n` +
      `${linhas}\n` +
      `┃╎\n┃╎୨୧ Total: *${adminsLista.length}*\n` +
      `┃╰╾ׁ═╼〔 • 🌸 • 〕╾ׁ═╼╯`,
    mentions: adminsLista,
  }, { quoted: info });
}
break;

case "criador":
case "creator": {
  const cfg = readSettingsFile();
  const creatorName = cfg.creatorName || cfg.ownerName || ownerName;
  const creatorNumber = onlyDigits(cfg.creatorNumber || cfg.ownerNumber || ownerNumber);
  const creatorGithub = String(cfg.creatorGithub || "koba-yashi666").replace(/^@/, "");
  const creatorInstagram = String(cfg.creatorInstagram || "Koba.yashi666").replace(/^@/, "");
  const creatorJid = creatorNumber ? `${creatorNumber}@s.whatsapp.net` : null;
  const whatsappLink = creatorNumber ? `https://wa.me/${creatorNumber}` : "Não configurado";
  const githubLink = `https://github.com/${creatorGithub}`;
  const instagramLink = `https://instagram.com/${creatorInstagram}`;

  return conn.sendMessage(from, {
    text:
      `╭═══════ ❀ 小林 ❀ ═══════╮
` +
      `       🐉 *CRIADOR DO BOT*
` +
      `╰═══════ ❀ 🌸 ❀ ═══════╯

` +
      `╭───〔 🎐 DESENVOLVEDOR 〕──╮
` +
      `│ 🌷 Nome     › *${creatorName}*
` +
      `│ 🤖 Projeto  › *KOBAYASHI BOT*
` +
      `│ 💮 Versão   › *${getLocalVersion()}*
` +
      `╰──────── ❀ ─────────────╯

` +
      `╭───〔 💌 CONTATO 〕────────╮
` +
      `│ 📱 WhatsApp
` +
      `│ ↳ ${whatsappLink}
` +
      `│
` +
      `│ 💻 GitHub
` +
      `│ ↳ ${githubLink}
` +
      `│
` +
      `│ 📸 Instagram
` +
      `│ ↳ ${instagramLink}
` +
      `╰──────── ❀ ─────────────╯

` +
      `     🌸 ──「 小林 」── 🐉
` +
      `       *KOBAYASHI SYSTEM*`,
    mentions: creatorJid ? [creatorJid] : [],
  }, { quoted: info });
}
break;

case "dono":
case "owner": {
  const cfg = readSettingsFile();
  const numero = onlyDigits(cfg.ownerNumber || ownerNumber);
  const nome = cfg.ownerName || ownerName;
  const jid = numero ? `${numero}@s.whatsapp.net` : null;

  return conn.sendMessage(from, {
    text:
      `┏╾ׁ═╼･ﾟ♡ﾟ･｡👑｡･ﾟ♡ﾟ･╾ᷓ═╼┓\n` +
      `┣━〔 • 𝑫𝒐𝒏𝒐 • 👑 〕\n` +
      `┗╾ׁ═╼･ﾟ♡ﾟ･｡👑｡･ﾟ♡ﾟ･╾ᷓ═╼┛\n╎\n` +
      `┃╭╾ׁ═╼〔 • 💌 • 〕╾ׁ═╼╮\n` +
      `┃╎୨୧ 👤 *Nome*: ${nome}\n` +
      `┃╎୨୧ 📱 *Número*: ${numero || "Não configurado"}\n` +
      `┃╎୨୧ 🐉 *Responsável atual pela Kobayashi*\n` +
      `┃╰╾ׁ═╼〔 • 💌 • 〕╾ׁ═╼╯`,
    mentions: jid ? [jid] : [],
  }, { quoted: info });
}
break;

case "infoadv":
case "info_adv": {
  return reply(
    `┏╾ׁ═╼･ﾟ♡ﾟ･｡⚠️｡･ﾟ♡ﾟ･╾ᷓ═╼┓\n` +
    `┣━〔 • 𝑺𝒊𝒔𝒕𝒆𝒎𝒂 𝑨𝑫𝑽 • ⚠️ 〕\n` +
    `┗╾ׁ═╼･ﾟ♡ﾟ･｡⚠️｡･ﾟ♡ﾟ･╾ᷓ═╼┛\n╎\n` +
    `┃╭╾ׁ═╼〔 • 🐉 • 〕╾ׁ═╼╮\n` +
    `┃╎୨୧ ⚠️ *1/3* — Primeira advertência\n` +
    `┃╎୨୧ ⚠️ *2/3* — Segunda advertência\n` +
    `┃╎୨୧ 🚨 *3/3* — Remoção automática\n` +
    `┃╎\n` +
    `┃╎୨୧ 📝 *Como usar:*\n` +
    `┃╎   ${prefix}adv @membro motivo\n` +
    `┃╎\n` +
    `┃╎୨୧ 🛡️ Apenas administradores podem aplicar ADV.\n` +
    `┃╎୨୧ 🤖 A Kobayashi precisa ser ADM para remover no 3/3.\n` +
    `┃╎୨୧ ♻️ Após uma remoção bem-sucedida, as ADVs são zeradas.\n` +
    `┃╰╾ׁ═╼〔 • 🌸 • 〕╾ׁ═╼╯`
  );
}
break;
//


// KOBAYASHI FUN • v0.1.15
case "menubn": {
  if (!isGroup) return reply(mess.onlyGroup());

  const enabled = isFunModeEnabled(from);
  const status = enabled ? "🟢 ATIVADO" : "🔒 DESATIVADO";

  return reply(
    `╭────────「 🎭 」────────╮\n` +
    `      *KOBAYASHI FUN*\n` +
    `╰─────────────────────╯\n\n` +
    `Status › *${status}*\n\n` +
    `┌─ 🌸 *BRINCADEIRAS*\n` +
    `│ 🌷 ${prefix}linda @membro\n` +
    `│ 🌺 ${prefix}lindo @membro\n` +
    `│ 🏳️‍🌈 ${prefix}gay @membro\n` +
    `│ 💙 ${prefix}hetero @membro\n` +
    `│ 🫂 ${prefix}abraco @membro\n` +
    `│ 🐂 ${prefix}gado @membro\n` +
    `│ 💞 ${prefix}shipo @membro\n` +
    `│ 🔥 ${prefix}gostosa @membro\n` +
    `│ 😏 ${prefix}gostoso @membro\n` +
    `│\n` +
    `├─ 🏆 *RANKINGS*\n` +
    `│ 👑 ${prefix}ranklinda\n` +
    `│ 👑 ${prefix}ranklindo\n` +
    `│ 🌈 ${prefix}rankgay\n` +
    `│ 💙 ${prefix}rankhetero\n` +
    `│ 🔥 ${prefix}rankgostosa\n` +
    `│ 😏 ${prefix}rankgostoso\n` +
    `│\n` +
    `└ 🎭 ${prefix}modobrincadeira\n` +
    `   ↳ Somente ADM liga/desliga\n\n` +
    `🌸 Quando ativado, todos os membros podem brincar.`
  );
}
break;

case "modobrincadeira": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const atual = isFunModeEnabled(from);
  const novo = setFunMode(from, !atual);

  return reply(
    novo
      ? `╭──────「 🎭 」──────╮\n` +
        `   *KOBAYASHI FUN*\n` +
        `╰──────────────────╯\n\n` +
        `🟢 *Modo Brincadeira ativado!*\n\n` +
        `🌸 Todos os membros agora podem usar os comandos do *${prefix}menubn*.\n` +
        `↳ Use *${prefix}modobrincadeira* novamente para desativar.`
      : `╭──────「 🎭 」──────╮\n` +
        `   *KOBAYASHI FUN*\n` +
        `╰──────────────────╯\n\n` +
        `🔒 *Modo Brincadeira desativado.*\n\n` +
        `Os comandos de diversão foram bloqueados neste grupo.`
  );
}
break;

case "linda":
case "lindo":
case "gay":
case "hetero":
case "gado":
case "gostosa":
case "gostoso": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) {
    return reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n\n🛡️ Um ADM pode ativar com *${prefix}modobrincadeira*.`);
  }

  const target = getTargetFromMessage(info, sender) || sender;
  const labels = {
    linda: ["🌷", "Linda"],
    lindo: ["🌺", "Lindo"],
    gay: ["🏳️‍🌈", "Gay"],
    hetero: ["💙", "Hétero"],
    gado: ["🐂", "Gado"],
    gostosa: ["🔥", "Gostosa"],
    gostoso: ["😏", "Gostoso"],
  };
  const [emoji, label] = labels[command];
  const score = getOrCreateFunScore(from, command, target);

  const caption =
    `╭──────「 ${emoji} 」──────╮\n` +
    `     *${label.toUpperCase()} METER*\n` +
    `╰──────────────────╯\n\n` +
    `👤 @${target.split("@")[0]}\n` +
    `${emoji} Resultado › *${score}%*\n\n` +
    `🐉 Avaliação oficial do Kobayashi Fun.`;

  return sendFunCard(conn, from, info, command, caption, [target]);
}
break;

case "abraco":
case "abraço": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) {
    return reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n\n🛡️ Um ADM pode ativar com *${prefix}modobrincadeira*.`);
  }

  const target = getTargetFromMessage(info, null);
  if (!target || target === sender) {
    return reply(`🫂 Marque alguém ou responda à mensagem da pessoa.\nEx.: *${prefix}abraco @membro*`);
  }

  const caption =
    `╭──────「 🫂 」──────╮\n` +
    `       *ABRAÇO*\n` +
    `╰──────────────────╯\n\n` +
    `🌸 @${sender.split("@")[0]} deu um abraço em @${target.split("@")[0]}!\n\n` +
    `🐉 Um pouquinho de carinho na residência.`;

  return sendFunCard(conn, from, info, "abraco", caption, [sender, target]);
}
break;

case "shipo":
case "ship": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) {
    return reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n\n🛡️ Um ADM pode ativar com *${prefix}modobrincadeira*.`);
  }

  const [a, b] = getTwoTargetsFromMessage(info, sender, q);
  if (!b) {
    return reply(`💞 Marque alguém para shippar.\nEx.: *${prefix}shipo @membro*\n\nVocê também pode marcar duas pessoas.`);
  }

  const pairKey = [a, b].sort().join("|");
  const score = getOrCreateFunScore(from, "shipo", pairKey);

  const caption =
    `╭──────「 💞 」──────╮\n` +
    `        *SHIPO*\n` +
    `╰──────────────────╯\n\n` +
    `💗 @${a.split("@")[0]}\n` +
    `           ×\n` +
    `💗 @${b.split("@")[0]}\n\n` +
    `💞 Compatibilidade › *${score}%*\n\n` +
    (score >= 80 ? `🌸 Isso aqui tá perigoso de tão fofo.` :
     score >= 50 ? `🐉 Tem potencial... talvez com um café.` :
     `🎐 A Kobayashi recomenda amizade primeiro.`);

  return sendFunCard(conn, from, info, "shipo", caption, [a, b]);
}
break;

case "ranklinda":
case "ranklindo":
case "rankgay":
case "rankhetero":
case "rankgostosa":
case "rankgostoso": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) {
    return reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n\n🛡️ Um ADM pode ativar com *${prefix}modobrincadeira*.`);
  }

  const categoryMap = {
    ranklinda: ["linda", "🌷", "RANK LINDA"],
    ranklindo: ["lindo", "🌺", "RANK LINDO"],
    rankgay: ["gay", "🏳️‍🌈", "RANK GAY"],
    rankhetero: ["hetero", "💙", "RANK HÉTERO"],
    rankgostosa: ["gostosa", "🔥", "RANK GOSTOSA"],
    rankgostoso: ["gostoso", "😏", "RANK GOSTOSO"],
  };
  const [category, emoji, title] = categoryMap[command];

  const participants = (groupMembers || [])
    .map((p) => p?.id || p?.jid)
    .filter(Boolean)
    .filter((jid) => jid !== botNumber);

  const ranked = participants
    .map((jid) => ({ jid, score: getOrCreateFunScore(from, category, jid) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  if (!ranked.length) return reply("🏆 Não encontrei membros suficientes para montar o ranking.");

  const medals = ["🥇","🥈","🥉"];
  const lines = ranked.map((item, i) =>
    `${medals[i] || `#${i+1}`} @${item.jid.split("@")[0]} — *${item.score}%*`
  ).join("\n");

  const caption =
    `╭──────「 🏆 」──────╮\n` +
    `      *${title}*\n` +
    `╰──────────────────╯\n\n` +
    `${lines}\n\n` +
    `🌸 Ranking persistente do Kobayashi Fun.`;

  return sendFunCard(conn, from, info, "rank", caption, ranked.map((x) => x.jid));
}
break;
//
// menu
case "menu":
reagir("🐉");
sendMenu(from, linguagem.menuPrincipal(NomeDoBot, sender, ownerName, prefix), sender);
break;

case "menuadm":
if (!isGroup) return reply(mess.onlyGroup());
reagir("🛡️");
reply(linguagem.menuAdm(prefix));
break;

case "menuowner":
case "menudono":
if (!SoDono) return reply(mess.onlyOwner());
reagir("👑");
reply(linguagem.menuOwner(prefix));
break;

case "menuvip":
reagir("💎");
reply(linguagem.menuVip(prefix));
break;
//



// teste de atualização v0.1.4
case "statusatt":
case "attstatus":
case "statusupdate": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  reagir("✅");

  try {
    const status = await checkUpdate();
    const sincronizado = status.local === "0.1.4-beta";

    return reply(
      `🐉🌸 *STATUS DA ATUALIZAÇÃO*\n\n` +
      `📦 Versão carregada: *${status.local}*\n` +
      `☁️ Versão no GitHub: *${status.remote}*\n` +
      `🧪 Teste v0.1.4: *${sincronizado ? "APROVADO ✅" : "AINDA NÃO ATUALIZOU ⚠️"}*\n\n` +
      (status.available
        ? `🔄 Ainda existe uma atualização disponível no GitHub.`
        : `🌸 Kobayashi está sincronizada com a versão publicada.`)
    );
  } catch (e) {
    return reply(
      `🐉🌸 *STATUS DA ATUALIZAÇÃO*\n\n` +
      `📦 Versão carregada: *${getLocalVersion()}*\n` +
      `🧪 Comando da *v0.1.4-beta* carregado com sucesso ✅\n` +
      `⚠️ Só não consegui consultar o GitHub agora.`
    );
  }
}
break;
//

// versão e atualização
case "version":
case "versao":
case "v": {
  reagir("📦");
  try {
    const status = await checkUpdate();
    const situacao = status.available
      ? `🟡 Nova versão disponível: *${status.remote}*\n👑 O dono pode usar *${prefix}update*.`
      : "🟢 Você está usando a versão mais recente.";

    return reply(
      `🐉🌸 *KOBAYASHI BOT • VERSÃO*\n\n` +
      `📦 Instalada: *${status.local}*\n` +
      `☁️ GitHub: *${status.remote}*\n\n` +
      situacao
    );
  } catch (e) {
    return reply(
      `🐉🌸 *KOBAYASHI BOT • VERSÃO*\n\n` +
      `📦 Instalada: *${getLocalVersion()}*\n` +
      `⚠️ Não consegui consultar o GitHub agora.\n` +
      `Detalhe: ${e?.message || e}`
    );
  }
}
break;

case "update":
case "atualizar": {
  if (!SoDono) return reply(mess.onlyOwner());

  reagir("🔄");
  await reply("🐉🌸 *Verificando atualização...*\n\nNão desligue o bot durante o processo.");

  try {
    const result = await applyUpdate();

    if (!result.updated) {
      return reply(
        `✅ *Kobayashi Bot já está atualizado!*\n\n` +
        `📦 Versão atual: *${result.local}*`
      );
    }

    await reply(
      `✅🌸 *ATUALIZAÇÃO CONCLUÍDA!*\n\n` +
      `📦 Nova versão: *${result.remote}*\n` +
      `📁 Arquivos atualizados: *${result.files}*\n\n` +
      `🐉 Reiniciando o Kobayashi Bot...`
    );

    // npm start usa start.sh; ao encerrar, o loop inicia a versão nova.
    setTimeout(() => process.exit(0), 2500);
    return;
  } catch (e) {
    console.error("Erro ao atualizar:", e);
    return reply(
      `❌🌸 *Não foi possível atualizar.*\n\n` +
      `${e?.message || e}\n\n` +
      `Nenhuma sessão do WhatsApp foi apagada.`
    );
  }
}
break;
//


// informações do grupo
case "grupoinfo":
case "infogrupo":
case "groupinfo": {
  if (!isGroup) return reply(mess.onlyGroup());

  reagir("🐉");

  try {
    // Usa os metadados já carregados pelo bot para evitar chamadas desnecessárias.
    const membros = Array.isArray(groupMembers) ? groupMembers.length : 0;
    const admins = Array.isArray(groupAdmins) ? groupAdmins.length : 0;
    const descricao = groupMetadata?.desc?.trim() || "Sem descrição.";
    const criadorJid = groupMetadata?.owner || null;
    const criador = criadorJid
      ? `@${normalizeJid(criadorJid).split("@")[0]}`
      : "Não disponível";
    const criadoEm = groupMetadata?.creation
      ? moment.unix(Number(groupMetadata.creation)).format("DD/MM/YYYY HH:mm")
      : "Não disponível";
    const botAdm = isBotGroupAdmins ? "Sim ✅" : "Não ❌";

    const texto =
      `╭━━━━━━━━━━━━━━━━━━━━━━╮\n` +
      `┃ 🐉🌸 *INFORMAÇÕES DO GRUPO* 🌸🐉\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `🏷️ *Nome:* ${groupName}\n` +
      `👥 *Membros:* ${membros}\n` +
      `👑 *Administradores:* ${admins}\n` +
      `🤖 *Kobayashi ADM:* ${botAdm}\n` +
      `👤 *Criador:* ${criador}\n` +
      `📅 *Criado em:* ${criadoEm}\n\n` +
      `📝 *Descrição:*\n${descricao}\n\n` +
      `🆔 *ID:* ${from}`;

    return conn.sendMessage(
      from,
      {
        text: texto,
        mentions: criadorJid ? [normalizeJid(criadorJid)] : []
      },
      { quoted: info }
    );
  } catch (e) {
    console.error("Erro no comando grupoinfo:", e);
    return reply("❌ Não consegui obter as informações deste grupo agora.");
  }
}
break;
//

// ping
case "ping": {
reagir("🌸");
const tsMsg = Number(info.messageTimestamp) * 1000;
const atraso = `${Date.now() - tsMsg}ms`;
const segundos = process.uptime();
const uptime = `${Math.floor(segundos / 86400)}d ${Math.floor((segundos % 86400) / 3600)}h ${Math.floor((segundos % 3600) / 60)}m ${Math.floor(segundos % 60)}s`;
const so = `${os.type()}`;
const ramUsada = `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`;
const cpuInicio = process.cpuUsage();
const cpuInicioTempo = Date.now();
await new Promise((resolve) => setTimeout(resolve, 100));
const cpuDecorrido = Date.now() - cpuInicioTempo;
const cpuUsoBruto = process.cpuUsage(cpuInicio);
const cpuUso = `${(((cpuUsoBruto.user + cpuUsoBruto.system) / 1000 / cpuDecorrido) * 100).toFixed(2)}%`;
const nodeVersion = process.version;
reply(linguagem.ping(atraso, uptime, so, ramUsada, cpuUso, nodeVersion, baileysVersion));
}
break;
//

// aux btn
case "id1":
reagir("1️⃣");
reply("🌸 Você clicou no *Botão 1* ✅");
break;

case "id2":
reagir("2️⃣");
reply("🐉 Você clicou no *Botão 2* ✅");
break;

case "id_resposta":
reagir("↩️");
reply("Você clicou em *Responder* ✅");
break;

case "opcao1":
reagir("1️⃣");
reply("Você escolheu a *Opção 1* ✅");
break;

case "opcao2":
reagir("2️⃣");
reply("Você escolheu a *Opção 2* ✅");
break;
//


// configurações exclusivas do dono • v0.1.6
case "numero_dono":
case "número_dono": {
  if (!SoDono) return reply(mess.onlyOwner());
  const numero = onlyDigits(q);
  if (numero.length < 8) return reply(`📱 Use: *${prefix}numero_dono 5511999999999*`);

  const cfg = readSettingsFile();
  cfg.ownerNumber = numero;
  writeSettingsFile(cfg);

  await reply(`👑🌸 Número do dono alterado para *${numero}*.\n\n♻️ Reiniciando para aplicar a alteração...`);
  setTimeout(() => process.exit(0), 1800);
  return;
}
break;

case "numero_bot":
case "número_bot": {
  if (!SoDono) return reply(mess.onlyOwner());
  const numero = onlyDigits(q);
  if (numero.length < 8) return reply(`🤖 Use: *${prefix}numero_bot 5511999999999*`);

  const cfg = readSettingsFile();
  cfg.botNumber = numero;
  writeSettingsFile(cfg);

  await reply(
    `🤖🌸 Número de pareamento alterado para *${numero}*.\n\n` +
    `⚠️ A sessão atual será removida e a Kobayashi vai reiniciar.\n` +
    `🔐 O novo código de pareamento aparecerá no console do servidor.`
  );

  const authDir = path.join(process.cwd(), "files", "database", "qr-code");
  fs.rmSync(authDir, { recursive: true, force: true });
  setTimeout(() => process.exit(0), 2200);
  return;
}
break;

case "status_bot": {
  if (!SoDono) return reply(mess.onlyOwner());
  const cfg = readSettingsFile();
  const uptime = Math.floor(process.uptime());
  const h = Math.floor(uptime / 3600);
  const m = Math.floor((uptime % 3600) / 60);
  const s = uptime % 60;
  const mem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

  return reply(
    `🐉🌸 *STATUS DO KOBAYASHI BOT*\n\n` +
    `🟢 Estado: *Online*\n` +
    `📦 Versão: *${getLocalVersion()}*\n` +
    `⌨️ Prefixo: *${cfg.prefix}*\n` +
    `⏱️ Uptime: *${h}h ${m}m ${s}s*\n` +
    `💾 Memória: *${mem} MB*\n` +
    `🛡️ Anti-PV: *${cfg.antiPv ? "Ativado" : "Desativado"}*`
  );
}
break;

case "prefixo": {
  if (!SoDono) return reply(mess.onlyOwner());
  const cfg = readSettingsFile();
  return reply(`⌨️🌸 Prefixo atual: *${cfg.prefix}*\n\nPara alterar: *${cfg.prefix}add_prefixo !*`);
}
break;

case "add_prefixo": {
  if (!SoDono) return reply(mess.onlyOwner());
  const novo = String(q || "").trim();
  if (!novo || /\s/.test(novo) || novo.length > 3)
    return reply(`➕ Use: *${prefix}add_prefixo !*\nO prefixo deve ter de 1 a 3 caracteres e não pode conter espaços.`);

  const cfg = readSettingsFile();
  cfg.prefix = novo;
  writeSettingsFile(cfg);
  await reply(`✅🌸 Prefixo alterado de *${prefix}* para *${novo}*.\n♻️ Reiniciando para aplicar...`);
  setTimeout(() => process.exit(0), 1800);
  return;
}
break;

case "nome_gp": {
  if (!SoDono) return reply(mess.onlyOwner());
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  if (!q.trim()) return reply(`✏️ Use: *${prefix}nome_gp Novo nome do grupo*`);
  await conn.groupUpdateSubject(from, q.trim());
  return reply(`✅🌸 Nome do grupo alterado para *${q.trim()}*.`);
}
break;

case "foto_gp": {
  if (!SoDono) return reply(mess.onlyOwner());
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  const mediaTarget = getCurrentOrQuotedMedia(info);
  if (!mediaTarget?.message || getContentType(mediaTarget.message) !== "imageMessage")
    return reply(`🖼️ Envie uma *imagem com ${prefix}foto_gp na legenda* ou responda uma imagem com o comando.`);

  try {
    const media = await downloadMediaMessage(mediaTarget, "buffer", {});
    await conn.updateProfilePicture(from, media);
    return reply("✅🌸 Foto do grupo atualizada.");
  } catch (e) {
    console.error("Erro foto_gp:", e);
    return reply("❌ Não consegui alterar a foto do grupo.");
  }
}
break;

case "foto_menu": {
  if (!SoDono) return reply(mess.onlyOwner());
  const mediaTarget = getCurrentOrQuotedMedia(info);
  if (!mediaTarget?.message || getContentType(mediaTarget.message) !== "imageMessage")
    return reply(`🌸 Envie uma *imagem com ${prefix}foto_menu na legenda* ou responda uma imagem com o comando.`);

  try {
    const media = await downloadMediaMessage(mediaTarget, "buffer", {});
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default || sharpModule;
    const output = await sharp(media).png().toBuffer();
    const menuPath = path.join(process.cwd(), "settings", "LOGOS", "menu.png");
    fs.mkdirSync(path.dirname(menuPath), { recursive: true });
    fs.writeFileSync(menuPath, output);
    return reply("✅🌸 Foto dos menus atualizada.");
  } catch (e) {
    console.error("Erro foto_menu:", e);
    return reply("❌ Não consegui salvar a nova foto do menu.");
  }
}
break;

case "antipv": {
  if (!SoDono) return reply(mess.onlyOwner());
  const op = String(args[0] || "").toLowerCase();
  if (!["on", "off"].includes(op))
    return reply(`🛡️ Use *${prefix}antipv on* ou *${prefix}antipv off*.`);

  const cfg = readSettingsFile();
  cfg.antiPv = op === "on";
  writeSettingsFile(cfg);
  return reply(`🛡️🌸 Anti-PV *${cfg.antiPv ? "ativado" : "desativado"}* com sucesso.`);
}
break;
//

// dono
case "reiniciar":
case "rr":
if (!SoDono) return reply(mess.onlyOwner());
reply("*Reiniciando o bot...*");
setTimeout(() => {
process.exit();
}, 1200);
break;
//

// adm
case "promover":
if (!isGroupAdmins) return reply(mess.onlyAdmins());
if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
if (!menc_os2 || menc_jid2?.[1])
return reply("Marque a mensagem do usuário ou marque o @ dele. Lembre-se de marcar apenas um usuário.");
if (!JSON.stringify(groupMembers).includes(menc_os2))
return reply("Este usuário foi removido do grupo ou saiu. Não será possível promover.");
conn.sendMessage(from, { text: `@${menc_os2.split("@")[0]} foi promovido(a) para admin com sucesso.`, mentions: [menc_os2] });
conn.groupParticipantsUpdate(from, [menc_os2], "promote");
break;

case "rebaixar":
if (!isGroupAdmins) return reply(mess.onlyAdmins());
if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
if (!menc_os2 || menc_jid2?.[1])
return reply("Marque a mensagem do usuário ou marque o @ dele. Lembre-se de marcar apenas um usuário.");
if (!JSON.stringify(groupMembers).includes(menc_os2))
return reply("Este usuário foi removido do grupo ou saiu. Não será possível rebaixar.");
conn.sendMessage(from, { text: `@${menc_os2.split("@")[0]} foi rebaixado(a) para membro com sucesso.`, mentions: [menc_os2] });
conn.groupParticipantsUpdate(from, [menc_os2], "demote");
break;
//

// ex btn
case "botaotexto": {
const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "Botão 1" }, type: 1 },
{ buttonId: `${prefix}id2`, buttonText: { displayText: "Botão 2" }, type: 1 }
];
conn.sendMessage(from, {
text: "Olá, essa é a mensagem com botão",
footer: "Olá Mundo",
buttons,
headerType: 1
}, { quoted: info });
}
break;

case "botaoimagem": {
const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "Botão 1" }, type: 1 },
{ buttonId: `${prefix}id2`, buttonText: { displayText: "Botão 2" }, type: 1 }
];
conn.sendMessage(from, {
image: { url: "https://www.dropbox.com/scl/fi/y8dm5a2ilujvwd8d9v3rv/e055b6cb38173e3ae60763be08f86fa1.jpg?rlkey=9zn90uhxj41amg8rbmkad5evr&st=yao78kz6&dl=1" },
caption: "Olá, esta é a mensagem do botão com imagem",
footer: "Olá Mundo",
buttons,
headerType: 1
}, { quoted: info });
}
break;

case "botaovideo": {
const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "Botão 1" }, type: 1 },
{ buttonId: `${prefix}id2`, buttonText: { displayText: "Botão 2" }, type: 1 }
];
conn.sendMessage(from, {
video: { url: "https://www.dropbox.com/scl/fi/b0tm6wu6htyspkihoka3o/ssstik.io_-vaf_ix_1785379647087.mp4?rlkey=v4zauyh96v7ofp43qjdkweyoo&st=62redgwm&dl=1" },
caption: "Olá, esta é a mensagem do botão com vídeo",
footer: "Olá Mundo",
buttons,
headerType: 1
}, { quoted: info });
}
break;

case "interativo": {
const interactiveButtons = [
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Responder", id: `${prefix}id_resposta` }) },
{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Abrir link", url: "https://example.com" }) },
{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "Copiar código", id: "12345", copy_code: "12345" }) }
];
conn.sendMessage(from, {
text: "Olá Mundo!",
title: "este é o título",
footer: "este é o rodapé",
interactiveButtons
}, { quoted: info });
}
break;

case "interativoimagem": {
const interactiveButtons = [
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Responder", id: `${prefix}id_resposta` }) },
{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Abrir link", url: "https://example.com" }) },
{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "Copiar código", id: "12345", copy_code: "12345" }) }
];
conn.sendMessage(from, {
image: { url: "https://www.dropbox.com/scl/fi/y8dm5a2ilujvwd8d9v3rv/e055b6cb38173e3ae60763be08f86fa1.jpg?rlkey=9zn90uhxj41amg8rbmkad5evr&st=yao78kz6&dl=1" },
caption: "Olá Mundo!",
title: "este é o título",
footer: "este é o rodapé",
interactiveButtons
}, { quoted: info });
}
break;

case "interativovideo": {
const interactiveButtons = [
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Responder", id: `${prefix}id_resposta` }) },
{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Abrir link", url: "https://example.com" }) },
{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "Copiar código", id: "12345", copy_code: "12345" }) }
];
conn.sendMessage(from, {
video: { url: "https://www.dropbox.com/scl/fi/b0tm6wu6htyspkihoka3o/ssstik.io_-vaf_ix_1785379647087.mp4?rlkey=v4zauyh96v7ofp43qjdkweyoo&st=62redgwm&dl=1" },
caption: "Olá Mundo!",
title: "este é o título",
footer: "este é o rodapé",
interactiveButtons
}, { quoted: info });
}
break;

case "lista": {
const interactiveButtons = [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "Ver opções",
sections: [{
title: "Menu",
rows: [
{ header: "Header", title: "Opção 1", description: "Descrição 1", id: `${prefix}opcao1` },
{ header: "Header", title: "Opção 2", description: "Descrição 2", id: `${prefix}opcao2` }
]
}]
})
}];
conn.sendMessage(from, {
text: "esta é a legenda",
title: "este é o título",
footer: "este é o rodapé",
interactiveButtons
}, { quoted: info });
}
break;

case "botaov2": {
 const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "Botão 1" }, type: 1 },
 { buttonId: `${prefix}id2`, buttonText: { displayText: "Botão 2" }, type: 1 }
 ];
conn.sendMessage(from, {
text: "Olá, essa é a mensagem com ButtonV2",
footer: "Olá Mundo",
title: "Título do card",
subtitle: "Subtítulo do card",
thumbnail: "https://www.dropbox.com/scl/fi/y8dm5a2ilujvwd8d9v3rv/e055b6cb38173e3ae60763be08f86fa1.jpg?rlkey=9zn90uhxj41amg8rbmkad5evr&st=yao78kz6&dl=1",
buttonsV2: buttons
}, { quoted: info });
}
break;
//

default:
reply(`🐉🌸 Não encontrei esse comando. Dá uma olhada no *${prefix}menu* pra ver tudo que eu sei fazer.`);
break;
}
}
}
} catch (e) {
console.error("Erro:", e);
}
}

const __filename = fileURLToPath(import.meta.url);
if (process.env.NODE_OPTIONS?.includes("--watch") || process.argv.includes("--watch")) {
console.log(colors.yellow(`Hot reload ativo para '${__filename}'`));
}
