/*ESSA BASE FOI DESENVOLVIDA PELO ALVES COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY ALVES
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

import { getContentType, delay, downloadMediaMessage } from "@whiskeysockets/baileys";
import { makeSticker, applyStickerMetadata } from "./lib/stickerEngine.js";
import { spawn } from "node:child_process";
import fs from "fs";
import { fileURLToPath } from "url";
import { checkUpdate, applyUpdate, getLocalVersion } from "./updater.js";

import { moment, colors, linguagem, mess, normalizeJid, getPNForJid, getGroupAdmins, logos, baileysVersion, fetch, axios, fs as fsx, os, path, randomBytes, ffmpeg } from "./settings/imports/consts.js";

import { getGroupMetadata } from "./lib/groupCache.js";

const settings = JSON.parse(fs.readFileSync(new URL("./settings/settings.json", import.meta.url)));

const { prefix, NomeDoBot, ownerNumber, ownerName } = settings;

const ADV_DB = path.join(process.cwd(), "files", "database", "adv.json");

const FUN_DB = path.join(process.cwd(), "files", "database", "brincadeiras.json");

const AUTOSTICKER_DB = path.join(process.cwd(), "files", "database", "autosticker.json");

const PROTECTION_DB = path.join(process.cwd(), "files", "database", "protecao-links.json");

const WHITELIST_DB = path.join(process.cwd(), "files", "database", "lista-branca.json");

const STICKER_CMD_DB = path.join(process.cwd(), "files", "database", "sticker-cmd.json");
const WELCOME_DB = path.join(process.cwd(), "files", "database", "boas-vindas.json");

function readWelcomeDb() {
  try {
    fs.mkdirSync(path.dirname(WELCOME_DB), { recursive: true });
    if (!fs.existsSync(WELCOME_DB)) fs.writeFileSync(WELCOME_DB, JSON.stringify({}, null, 2), "utf8");
    return JSON.parse(fs.readFileSync(WELCOME_DB, "utf8"));
  } catch { return {}; }
}
function writeWelcomeDb(db) {
  fs.mkdirSync(path.dirname(WELCOME_DB), { recursive: true });
  fs.writeFileSync(WELCOME_DB, JSON.stringify(db, null, 2), "utf8");
}
function getWelcomeConfig(groupJid) {
  const db=readWelcomeDb(); const c=db[groupJid]||{};
  return {
    enabled:!!c.enabled,
    delaySeconds:Number.isFinite(Number(c.delaySeconds))?Math.max(3,Math.min(120,Number(c.delaySeconds))):15,
    title:c.title||"🐉 ─ ⋆ 🌸 ⟨ KOBAYASHI BOT ⟩ 🌸 ⋆ ─ 🐉",
    welcome:c.welcome||"🌸 𝑶𝒉𝒂𝒚𝒐! Sejam bem-vindos(as) ao grupo!",
    bye:c.bye||"🌸 Até mais, {user}. Esperamos te ver novamente em *{group}*.",
    rules:c.rules||"📖 Leia as regras completas na descrição do grupo.",
    partners:c.partners||"🌸 Nenhuma parceria configurada.",
    footer:c.footer||"🐉 KOBAYASHI BOT",
    showAcceptedBy:c.showAcceptedBy!==false,
    showRejected:c.showRejected!==false
  };
}
function updateWelcomeConfig(groupJid, patch) {
  const db=readWelcomeDb(); if(!db[groupJid]) db[groupJid]={}; db[groupJid]={...db[groupJid],...patch}; writeWelcomeDb(db); return getWelcomeConfig(groupJid);
}
function renderWelcomeText(template, vars={}) {
  const {userJid,groupName,count,membersText,quantity,adminJid,rejected}=vars;
  const user=userJid?`@${String(userJid).split("@")[0]}`:"";
  const admin=adminJid?`@${String(adminJid).split("@")[0]}`:"Não identificado";
  return String(template||"")
    .replace(/\{user\}/gi,user).replace(/\{group\}/gi,groupName||"Grupo")
    .replace(/\{count\}/gi,String(count??"?")).replace(/\{membros\}/gi,membersText||"")
    .replace(/\{quantidade\}/gi,String(quantity??0)).replace(/\{adm\}/gi,admin)
    .replace(/\{rejeitados\}/gi,String(rejected??0));
}


function readStickerCmdDb() {
  try {
    fs.mkdirSync(path.dirname(STICKER_CMD_DB), { recursive: true });
    if (!fs.existsSync(STICKER_CMD_DB)) {
      fs.writeFileSync(STICKER_CMD_DB, JSON.stringify({}, null, 2), "utf8");
    }
    return JSON.parse(fs.readFileSync(STICKER_CMD_DB, "utf8"));
  } catch {
    return {};
  }
}

function writeStickerCmdDb(db) {
  fs.mkdirSync(path.dirname(STICKER_CMD_DB), { recursive: true });
  fs.writeFileSync(STICKER_CMD_DB, JSON.stringify(db, null, 2), "utf8");
}

function stickerHashFromMessage(message = {}) {
  const sticker = message?.stickerMessage;
  const hash = sticker?.fileSha256;
  if (!hash) return null;

  try {
    return Buffer.from(hash).toString("base64");
  } catch {
    return null;
  }
}

function getStickerMappedCommand(message = {}) {
  const hash = stickerHashFromMessage(message);
  if (!hash) return null;
  const db = readStickerCmdDb();
  return db[hash] || null;
}

function setStickerMappedCommand(message = {}, commandText) {
  const hash = stickerHashFromMessage(message);
  if (!hash) return false;
  const db = readStickerCmdDb();
  db[hash] = commandText;
  writeStickerCmdDb(db);
  return true;
}

function removeStickerMappedCommand(message = {}) {
  const hash = stickerHashFromMessage(message);
  if (!hash) return false;
  const db = readStickerCmdDb();
  if (!(hash in db)) return false;
  delete db[hash];
  writeStickerCmdDb(db);
  return true;
}



function readWhitelistDb() {
  try {
    fs.mkdirSync(path.dirname(WHITELIST_DB), { recursive: true });
    if (!fs.existsSync(WHITELIST_DB)) {
      fs.writeFileSync(WHITELIST_DB, JSON.stringify({}, null, 2), "utf8");
    }
    return JSON.parse(fs.readFileSync(WHITELIST_DB, "utf8"));
  } catch {
    return {};
  }
}

function writeWhitelistDb(db) {
  fs.mkdirSync(path.dirname(WHITELIST_DB), { recursive: true });
  fs.writeFileSync(WHITELIST_DB, JSON.stringify(db, null, 2), "utf8");
}

function getWhitelist(groupJid) {
  const db = readWhitelistDb();
  return Array.isArray(db[groupJid]) ? db[groupJid] : [];
}

function isWhitelisted(groupJid, jid) {
  return getWhitelist(groupJid).includes(jid);
}

function addWhitelist(groupJid, jid) {
  const db = readWhitelistDb();
  if (!Array.isArray(db[groupJid])) db[groupJid] = [];
  if (!db[groupJid].includes(jid)) db[groupJid].push(jid);
  writeWhitelistDb(db);
}

function removeWhitelist(groupJid, jid) {
  const db = readWhitelistDb();
  if (!Array.isArray(db[groupJid])) db[groupJid] = [];
  db[groupJid] = db[groupJid].filter((x) => x !== jid);
  writeWhitelistDb(db);
}



function readProtectionDb() {
  try {
    fs.mkdirSync(path.dirname(PROTECTION_DB), { recursive: true });
    if (!fs.existsSync(PROTECTION_DB)) {
      fs.writeFileSync(PROTECTION_DB, JSON.stringify({}, null, 2), "utf8");
    }
    return JSON.parse(fs.readFileSync(PROTECTION_DB, "utf8"));
  } catch {
    return {};
  }
}

function getGroupProtection(groupJid) {
  const db = readProtectionDb();
  return {
    antilink: Boolean(db?.[groupJid]?.antilink),
    antilinkgp: Boolean(db?.[groupJid]?.antilinkgp),
    antilinklight: Boolean(db?.[groupJid]?.antilinklight),
    antitelegram: Boolean(db?.[groupJid]?.antitelegram),
  };
}

function toggleGroupProtection(groupJid, key) {
  const db = readProtectionDb();
  if (!db[groupJid]) db[groupJid] = {};
  db[groupJid][key] = !Boolean(db[groupJid][key]);
  fs.writeFileSync(PROTECTION_DB, JSON.stringify(db, null, 2), "utf8");
  return Boolean(db[groupJid][key]);
}

function detectLinkTypes(text = "") {
  const value = String(text || "");

  const telegram =
    /(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me|telegram\.dog)\/[^\s]+/i.test(value);

  const whatsappGroup =
    /(?:https?:\/\/)?(?:chat\.whatsapp\.com|whatsapp\.com\/channel)\/[^\s]+/i.test(value);

  const anyLink =
    /(?:https?:\/\/|www\.)[^\s]+/i.test(value) ||
    /\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|gg|me|app|site|online|br|co|xyz|link|dev|tv|store|info)(?:\/[^\s]*)?/i.test(value) ||
    telegram ||
    whatsappGroup;

  return { anyLink, whatsappGroup, telegram };
}

async function deleteDetectedMessage(conn, jid, info) {
  try {
    await conn.sendMessage(jid, { delete: info.key });
    return true;
  } catch (e) {
    console.error("Erro ao apagar mensagem de link:", e?.message || e);
    return false;
  }
}

async function addAutomaticWarning(conn, groupJid, target, reason, botIsAdmin, quotedInfo) {
  const db = readAdvDb();
  if (!db[groupJid]) db[groupJid] = {};
  if (!db[groupJid][target]) db[groupJid][target] = { count: 0, history: [] };

  db[groupJid][target].count = Math.min((db[groupJid][target].count || 0) + 1, 3);
  db[groupJid][target].history.push({
    reason,
    by: "Kobayashi AutoMod",
    at: new Date().toISOString(),
  });

  const count = db[groupJid][target].count;
  writeAdvDb(db);

  if (count >= 3 && botIsAdmin) {
    try {
      await conn.groupParticipantsUpdate(groupJid, [target], "remove");
      db[groupJid][target] = { count: 0, history: [] };
      writeAdvDb(db);

      await conn.sendMessage(groupJid, {
        text:
          `🚨🌸 *AUTOMOD • 3/3 ADVERTÊNCIAS*\n\n` +
          `👤 @${target.split("@")[0]} atingiu o limite.\n` +
          `🔨 Membro removido automaticamente.\n` +
          `♻️ Advertências zeradas.`,
        mentions: [target],
      }, { quoted: quotedInfo });

      return { count: 3, removed: true };
    } catch (e) {
      console.error("Erro ao remover após ADV automática:", e?.message || e);
    }
  }

  return { count, removed: false };
}



function readAutoStickerDb() {
  try {
    fs.mkdirSync(path.dirname(AUTOSTICKER_DB), { recursive: true });
    if (!fs.existsSync(AUTOSTICKER_DB)) {
      fs.writeFileSync(AUTOSTICKER_DB, JSON.stringify({}, null, 2), "utf8");
    }
    return JSON.parse(fs.readFileSync(AUTOSTICKER_DB, "utf8"));
  } catch {
    return {};
  }
}

function setAutoSticker(groupJid, enabled) {
  const db = readAutoStickerDb();
  db[groupJid] = Boolean(enabled);
  fs.writeFileSync(AUTOSTICKER_DB, JSON.stringify(db, null, 2), "utf8");
  return db[groupJid];
}

function isAutoStickerEnabled(groupJid) {
  const db = readAutoStickerDb();
  return db[groupJid] === true;
}

async function addStickerMetadata(webpBuffer, { userNick, groupName, botName, creatorName }) {
  try {
    const webpModule = await import("node-webpmux");
    const WebpImage = webpModule.Image || webpModule.default?.Image;
    if (!WebpImage) return webpBuffer;

    const packName =
      `Criador: ${userNick || "Usuário"}\n` +
      `Grupo: ${groupName || "Privado"}`;

    const publisher =
      `${botName || "Kobayashi Bot"}\n` +
      `Criador: ${creatorName || "Kobayashi"}`;

    const json = Buffer.from(JSON.stringify({
      "sticker-pack-id": "kobayashi-bot",
      "sticker-pack-name": packName,
      "sticker-pack-publisher": publisher,
      "emojis": ["🐉", "🌸"]
    }), "utf8");

    const exif = Buffer.concat([
      Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00]),
      Buffer.alloc(4),
      Buffer.from([0x16,0x00,0x00,0x00]),
      json
    ]);
    exif.writeUIntLE(json.length, 14, 4);

    const img = new WebpImage();
    await img.load(webpBuffer);
    img.exif = exif;
    return await img.save(null);
  } catch (e) {
    console.error("Erro ao aplicar metadados da figurinha:", e?.message || e);
    return webpBuffer;
  }
}

async function imageToStickerWithMetadata(mediaBuffer, meta) {
  return makeSticker(mediaBuffer, {
    isVideo: false,
    forceSquare: true,
    metadata: meta
  });
}



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

function readFunImageBank() {
  try {
    const bankFile = path.join(process.cwd(), "settings", "FUN", "imglinks.json");
    const mapFile = path.join(process.cwd(), "settings", "FUN", "mapa-imagens.json");
    const bank = JSON.parse(fs.readFileSync(bankFile, "utf8"));
    const map = JSON.parse(fs.readFileSync(mapFile, "utf8"));
    return { bank, map };
  } catch {
    return { bank: {}, map: {} };
  }
}

function getFunMediaUrl(card) {
  const { bank, map } = readFunImageBank();
  const key = map?.[card];
  return key ? bank?.[key] || null : null;
}

async function sendFunCard(conn, from, info, card, caption, mentions = []) {
  const mediaUrl = getFunMediaUrl(card);

  // Primeiro tenta usar o banco de imagens externo.
  if (mediaUrl) {
    try {
      const isVideo = /\.(mp4|mov|m4v)(\?|$)/i.test(mediaUrl);

      if (isVideo) {
        return await conn.sendMessage(
          from,
          {
            video: { url: mediaUrl },
            gifPlayback: true,
            caption,
            mentions,
          },
          { quoted: info }
        );
      }

      return await conn.sendMessage(
        from,
        {
          image: { url: mediaUrl },
          caption,
          mentions,
        },
        { quoted: info }
      );
    } catch (error) {
      console.error(`Falha ao usar mídia externa do Kobayashi Fun (${card}):`, error?.message || error);
    }
  }

  // Fallback: usa o card local da v0.1.15.
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


function getConfiguredLeaders() {
  try {
    const cfg = readSettingsFile();
    const values = Array.isArray(cfg.leaders) ? cfg.leaders : [];
    return values
      .map((n) => onlyDigits(n))
      .filter(Boolean)
      .slice(0, 5)
      .map((n) => `${n}@s.whatsapp.net`);
  } catch {
    return [];
  }
}

function isMainOwnerJid(jid) {
  try {
    const cfg = readSettingsFile();
    const owner = onlyDigits(cfg.ownerNumber || "");
    return Boolean(owner) && jid === `${owner}@s.whatsapp.net`;
  } catch {
    return false;
  }
}

function isLeaderJid(jid) {
  return getConfiguredLeaders().includes(jid);
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

let body = extractCommandText(info.message) || info?.text || "";

// Figurinha pode disparar um comando previamente associado.
if (!body && type === "stickerMessage") {
  const mappedStickerCommand = getStickerMappedCommand(info.message);
  if (mappedStickerCommand) {
    body = mappedStickerCommand.startsWith(prefix)
      ? mappedStickerCommand
      : `${prefix}${mappedStickerCommand}`;
  }
}

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
const SoDonoPrincipal = sender === dono || isMainOwnerJid(sender);
const SoLider = isLeaderJid(sender);
const SoDono = SoDonoPrincipal || SoLider;
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



// ─── KOBAYASHI AUTOMOD • PROTEÇÃO DE LINKS ───
if (isGroup && !info.key.fromMe && !isGroupAdmins && !isWhitelisted(from, sender)) {
  const protection = getGroupProtection(from);
  const detected = detectLinkTypes(body);

  let action = null;
  let reason = "";

  // Prioridade: AntiLink geral > AntiLink GP > AntiTelegram > Light.
  if (protection.antilink && detected.anyLink) {
    action = "strict";
    reason = "Envio de link com AntiLink ativado";
  } else if (protection.antilinkgp && detected.whatsappGroup) {
    action = "strict";
    reason = "Link de grupo com AntiLink GP ativado";
  } else if (protection.antitelegram && detected.telegram) {
    action = "strict";
    reason = "Link de Telegram com AntiTelegram ativado";
  } else if (protection.antilinklight && detected.anyLink) {
    action = "light";
    reason = "Envio de link com AntiLink Light ativado";
  }

  if (action) {
    await deleteDetectedMessage(conn, from, info);

    if (action === "light") {
      const result = await addAutomaticWarning(
        conn,
        from,
        sender,
        reason,
        isBotGroupAdmins,
        info
      );

      if (!result.removed) {
        await conn.sendMessage(from, {
          text:
            `⚠️🌸 *ANTILINK LIGHT*\n\n` +
            `👤 @${sender.split("@")[0]}\n` +
            `🗑️ Link apagado.\n` +
            `⚠️ Advertências: *${result.count}/3*\n\n` +
            `🐉 Na terceira advertência o membro poderá ser removido.`,
          mentions: [sender],
        }, { quoted: info });
      }
    } else {
      if (isBotGroupAdmins) {
        try {
          await conn.groupParticipantsUpdate(from, [sender], "remove");
          await conn.sendMessage(from, {
            text:
              `🚫🐉 *KOBAYASHI AUTOMOD*\n\n` +
              `🔗 Link bloqueado e mensagem apagada.\n` +
              `🔨 @${sender.split("@")[0]} foi removido do grupo.`,
            mentions: [sender],
          }, { quoted: info });
        } catch (e) {
          await conn.sendMessage(from, {
            text:
              `🚫🌸 Link bloqueado e apagado.\n\n` +
              `⚠️ Não consegui remover @${sender.split("@")[0]}.`,
            mentions: [sender],
          }, { quoted: info });
        }
      } else {
        await conn.sendMessage(from, {
          text:
            `🚫🌸 Link bloqueado e apagado.\n\n` +
            `⚠️ Preciso ser ADM para remover o membro.`,
          mentions: [sender],
        }, { quoted: info });
      }
    }

    continue;
  }
}

// Autosticker: em grupos ativados, qualquer foto sem comando vira figurinha automaticamente.
if (
  isGroup &&
  !info.key.fromMe &&
  type === "imageMessage" &&
  !isCmd &&
  isAutoStickerEnabled(from)
) {
  try {
    const mediaBuffer = await downloadMediaMessage(info, "buffer", {});
    const cfg = readSettingsFile();
    const stickerBuffer = await makeSticker(mediaBuffer, {
      isVideo: false,
      forceSquare: true,
      metadata: {
        userNick: pushname || sender.split("@")[0],
        groupName,
        botName: cfg.NomeDoBot || NomeDoBot,
        creatorName: cfg.creatorName || cfg.ownerName || ownerName,
      }
    });

    await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: info });
  } catch (e) {
    console.error("Erro no autosticker:", e?.message || e);
  }
  continue;
}

if (isCmd) {
switch (command) {



case "listabranca":
case "whitelist": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const rawAction = String(args[0] || "").toLowerCase();
  const target = getTargetFromMessage(info, null);
  const list = getWhitelist(from);

  // Sem argumento: mostra a lista atual.
  if (!rawAction && !target) {
    if (!list.length) {
      return reply(
        `╭──────「 🤍 」──────╮\n` +
        `      *LISTA BRANCA*\n` +
        `╰──────────────────╯\n\n` +
        `🌸 Nenhum membro autorizado.\n\n` +
        `➕ *${prefix}listabranca add @membro*\n` +
        `➖ *${prefix}listabranca del @membro*\n` +
        `📋 *${prefix}listabranca*`
      );
    }

    const lines = list.map((jid, i) => `${i + 1}. @${jid.split("@")[0]}`).join("\n");
    return conn.sendMessage(from, {
      text:
        `╭──────「 🤍 」──────╮\n` +
        `      *LISTA BRANCA*\n` +
        `╰──────────────────╯\n\n` +
        `${lines}\n\n` +
        `🔗 Esses membros podem enviar links mesmo sem serem ADM.`,
      mentions: list,
    }, { quoted: info });
  }

  if (!["add","adicionar","+","del","remover","remove","-"].includes(rawAction)) {
    return reply(
      `🤍 *LISTA BRANCA*\n\n` +
      `➕ ${prefix}listabranca add @membro\n` +
      `➖ ${prefix}listabranca del @membro\n` +
      `📋 ${prefix}listabranca`
    );
  }

  if (!target) {
    return reply(`🌸 Marque ou responda à mensagem do membro que deseja alterar na Lista Branca.`);
  }

  if (["add","adicionar","+"].includes(rawAction)) {
    if (isWhitelisted(from, target)) {
      return reply(`🤍 @${target.split("@")[0]} já está na Lista Branca.`);
    }
    addWhitelist(from, target);
    return conn.sendMessage(from, {
      text:
        `🤍🌸 *LISTA BRANCA*\n\n` +
        `✅ @${target.split("@")[0]} foi autorizado.\n\n` +
        `🔗 Agora pode enviar links mesmo sem ser ADM.\n` +
        `🐉 A permissão vale somente neste grupo.`,
      mentions: [target],
    }, { quoted: info });
  }

  if (!isWhitelisted(from, target)) {
    return reply(`🤍 @${target.split("@")[0]} não está na Lista Branca.`);
  }

  removeWhitelist(from, target);
  return conn.sendMessage(from, {
    text:
      `🤍🌸 *LISTA BRANCA*\n\n` +
      `❌ @${target.split("@")[0]} foi removido da lista.\n\n` +
      `🔐 Os filtros de links voltarão a valer normalmente para esse membro.`,
    mentions: [target],
  }, { quoted: info });
}
break;

// proteção / diversão ADM • v0.1.20
case "antilink":
case "antilinkgp":
case "antilinklight":
case "antitelegram": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const modeMap = {
    antilink: {
      key: "antilink",
      title: "ANTILINK",
      description: "qualquer tipo de link",
      icon: "🚫",
      punishment: "apaga o link e remove o membro"
    },
    antilinkgp: {
      key: "antilinkgp",
      title: "ANTILINK GP",
      description: "links de grupos/canais do WhatsApp",
      icon: "🔗",
      punishment: "apaga o link e remove o membro"
    },
    antilinklight: {
      key: "antilinklight",
      title: "ANTILINK LIGHT",
      description: "qualquer tipo de link",
      icon: "⚠️",
      punishment: "apaga o link e aplica 1 advertência"
    },
    antitelegram: {
      key: "antitelegram",
      title: "ANTITELEGRAM",
      description: "links do Telegram",
      icon: "✈️",
      punishment: "apaga o link e remove o membro"
    },
  };

  const mode = modeMap[command];
  const enabled = toggleGroupProtection(from, mode.key);

  return reply(
    `╭──────「 ${mode.icon} 」──────╮\n` +
    `       *${mode.title}*\n` +
    `╰──────────────────╯\n\n` +
    `${enabled ? "🟢 *ATIVADO*" : "🔒 *DESATIVADO*"}\n\n` +
    `🔎 Detecta: ${mode.description}\n` +
    `🛡️ Ação: ${mode.punishment}\n\n` +
    `🌸 Administradores e líderes não são afetados.\n` +
    `↳ Use *${prefix}${command}* novamente para alternar.`
  );
}
break;

case "suicidio":
case "suicídio": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  if (SoDonoPrincipal || SoLider) {
    return reply("👑🌸 Donos e líderes não podem usar esse comando para sair do grupo.");
  }

  try {
    await conn.sendMessage(from, {
      text:
        `💀🐉 *KOBAYASHI BOT*\n\n` +
        `@${sender.split("@")[0]} decidiu sair por conta própria...\n` +
        `🌸 Até uma próxima residência.`,
      mentions: [sender],
    }, { quoted: info });

    await delay(1200);
    await conn.groupParticipantsUpdate(from, [sender], "remove");
    return;
  } catch (e) {
    console.error("Erro no comando suicidio:", e);
    return reply("❌ Não consegui remover você do grupo.");
  }
}
break;

case "bam": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const target = getTargetFromMessage(info, menc_os2);
  if (!target || target === from) {
    return reply(`🐉🌸 Marque um membro ou responda à mensagem dele para usar *${prefix}bam*.`);
  }

  if (target === botNumber) return reply("🌸 Eu já conheço esse truque.");
  if (target === dono) return reply("👑 Melhor não tentar assustar o dono da Kobayashi.");

  const targetNumber = target.split("@")[0];

  // Primeira mensagem imita o /ban normal, mas NÃO remove ninguém.
  await conn.sendMessage(from, {
    text:
      `🐉🌸 *Membro removido!*\n\n` +
      `👤 @${targetNumber}\n` +
      `🛡️ Ação realizada por: @${sender.split("@")[0]}`,
    mentions: [target, sender],
  }, { quoted: info });

  // Pegadinha 10 segundos depois.
  setTimeout(async () => {
    try {
      await conn.sendMessage(from, {
        text:
          `╭──────「 🤡 」──────╮\n` +
          `        *BAM!*\n` +
          `╰──────────────────╯\n\n` +
          `Calma, @${targetNumber}... 😂\n\n` +
          `Você *não foi removido*.\n` +
          `Ainda... 👀🐉`,
        mentions: [target],
      });
    } catch (e) {
      console.error("Erro ao concluir BAM:", e?.message || e);
    }
  }, 10000);

  return;
}
break;
//




case "statusbv":
case "debugbv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const cfg = getWelcomeConfig(from);

  return reply(
    `╭──────「 🌸 」──────╮\n` +
    `    *STATUS WELCOME*\n` +
    `╰──────────────────╯\n\n` +
    `🏠 Grupo: ${from}\n` +
    `📢 Status: ${cfg.enabled ? "🟢 ATIVADO" : "🔴 DESATIVADO"}\n` +
    `⏱️ Tempo: ${cfg.delaySeconds}s\n` +
    `🔌 Handler Nazuna: ${typeof conn.kobayashiHandleGroupParticipantsUpdate === "function" ? "✅ OK" : "❌ AUSENTE"}\n\n` +
    `🧪 Use *${prefix}testebv* para testar o texto.`
  );
}
break;

case "bemvindo":
case "boasvindas": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const op=String(args[0]||"").toLowerCase(); const cfg=getWelcomeConfig(from);
  if(!["on","off"].includes(op)) return reply(`🌸 *WELCOME PRO*\n\nStatus: ${cfg.enabled?"🟢 Ativado":"🔒 Desativado"}\n⏱️ Agrupamento: *${cfg.delaySeconds}s*\n\n🟢 ${prefix}bemvindo on\n🔒 ${prefix}bemvindo off\n📝 ${prefix}setbv texto\n📖 ${prefix}setregrasbv texto\n🤝 ${prefix}setparceriasbv texto\n👋 ${prefix}setbye texto\n⏱️ ${prefix}tempobv 15\n🧪 ${prefix}testebv\n\nVariáveis: {user} {group} {count} {membros} {quantidade} {adm} {rejeitados}`);
  updateWelcomeConfig(from,{enabled:op==="on"});
  return reply(op==="on"?"🌸🐉 Welcome Pro ativado!":"🔒🌸 Welcome Pro desativado.");
}
break;

case "setbv": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if(!q.trim()) return reply(`📝 Use: *${prefix}setbv sua mensagem*`);
  updateWelcomeConfig(from,{welcome:q.trim()}); return reply("✅🌸 Texto principal atualizado.");
}
break;

case "setregrasbv":
case "regrasbv": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if(!q.trim()) return reply(`📖 Use: *${prefix}setregrasbv suas regras*`);
  updateWelcomeConfig(from,{rules:q.trim()}); return reply("✅📖 Regras da recepção atualizadas.");
}
break;

case "setparceriasbv":
case "parceriasbv": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if(!q.trim()) return reply(`🤝 Use: *${prefix}setparceriasbv seus links/parcerias*`);
  updateWelcomeConfig(from,{partners:q.trim()}); return reply("✅🤝 Jardim de parcerias atualizado.");
}
break;

case "setbye": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if(!q.trim()) return reply(`👋 Use: *${prefix}setbye sua mensagem*`);
  updateWelcomeConfig(from,{bye:q.trim()}); return reply("✅👋 Mensagem de saída atualizada.");
}
break;

case "tempobv": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const seconds=Number(args[0]);
  if(!Number.isFinite(seconds)||seconds<3||seconds>120) return reply(`⏱️ Use um tempo entre *3 e 120 segundos*. Ex.: *${prefix}tempobv 15*`);
  updateWelcomeConfig(from,{delaySeconds:Math.floor(seconds)}); return reply(`✅⏱️ Entradas serão agrupadas por *${Math.floor(seconds)} segundos*.`);
}
break;

case "testebv": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const cfg=getWelcomeConfig(from); const total=Array.isArray(groupMembers)?groupMembers.length:0;
  const membersText=`@${sender.split("@")[0]}\n> [ 1 Membro Novo 🪪 ]`;
  const preview=`${cfg.title}\n${renderWelcomeText(cfg.welcome,{groupName,count:total,membersText,quantity:1,adminJid:sender,rejected:0})}\n\n${cfg.rules}\n\n🐾 ── 𖥸 ─── ⋆ ✧ ⋆ ─── 𖥸 ── 🐾\n🧁 *Jardim de Parcerias* 🧁\n${cfg.partners}\n\n${membersText}\n\n> Aceito/Add por @${sender.split("@")[0]}\n> _E rejeitei 0 solicitações irregulares._\n\n${cfg.footer}`;
  return conn.sendMessage(from,{text:preview,mentions:[sender]},{quoted:info});
}
break;


case "add":
case "aceitar": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) {
    return reply("❌🐉 Eu preciso ser *ADM do grupo* para aceitar solicitações.");
  }

  try {
    const pending = await conn.groupRequestParticipantsList(from);

    if (!Array.isArray(pending) || !pending.length) {
      return reply("🌸 Não há solicitações pendentes para entrar no grupo.");
    }

    let targets = pending
      .map((item) => item?.jid || item?.id)
      .filter(Boolean);

    const mentioned =
      info?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      null;

    const numero = String(q || "").replace(/\D/g, "");

    if (mentioned) {
      targets = targets.filter((jid) => jid === mentioned);
    } else if (numero) {
      targets = targets.filter(
        (jid) => String(jid).split("@")[0] === numero
      );
    }

    if (!targets.length) {
      return reply("⚠️ Não encontrei essa pessoa entre as solicitações pendentes.");
    }

    await conn.groupRequestParticipantsUpdate(
      from,
      targets,
      "approve"
    );

    // Aguarda o WhatsApp concluir a aprovação e usa o MESMO handler do evento real.
    await delay(1800);

    if (typeof conn.kobayashiHandleGroupParticipantsUpdate === "function") {
      await conn.kobayashiHandleGroupParticipantsUpdate({
        id: from,
        action: "add",
        participants: targets,
        author: sender,
        source: "command-add"
      });
    } else {
      console.error("[WELCOME NAZUNA] Handler não encontrado no socket.");
    }

    const qtd = targets.length;

    return reply(
      `🌸🐉 *${qtd} ${qtd === 1 ? "solicitação aceita" : "solicitações aceitas"}!*\n\n` +
      `O sistema de boas-vindas foi acionado para os novos membros.`
    );

  } catch (error) {
    console.error("[ADD REQUESTS]", error?.stack || error?.message || error);
    return reply(
      `❌ Não consegui aceitar as solicitações do grupo.\n\n` +
      `Confira se eu continuo como ADM e se existem solicitações pendentes.`
    );
  }
}
break;

// comandos de grupo • v0.1.18
case "gp": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  const op = String(args[0] || "").toLowerCase();

  if (!["a", "f"].includes(op)) {
    return reply(
      `🏮 *CONTROLE DO GRUPO*\n\n` +
      `🟢 *${prefix}gp a* — abrir o grupo\n` +
      `🔒 *${prefix}gp f* — fechar o grupo`
    );
  }

  try {
    if (op === "a") {
      await conn.groupSettingUpdate(from, "not_announcement");
      return reply("🟢🌸 *Grupo aberto!*\n\nTodos os membros podem enviar mensagens novamente.");
    }

    await conn.groupSettingUpdate(from, "announcement");
    return reply("🔒🐉 *Grupo fechado!*\n\nSomente administradores podem enviar mensagens.");
  } catch (e) {
    console.error("Erro no comando gp:", e);
    return reply("❌ Não consegui alterar as configurações do grupo.");
  }
}
break;

case "autosticker":
case "autostk": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const atual = isAutoStickerEnabled(from);
  const novo = setAutoSticker(from, !atual);

  return reply(
    novo
      ? `╭──────「 🎨 」──────╮\n` +
        `      *AUTOSTICKER*\n` +
        `╰──────────────────╯\n\n` +
        `🟢 *Ativado neste grupo.*\n\n` +
        `🌸 A partir de agora, toda foto enviada sem comando será transformada automaticamente em figurinha.\n\n` +
        `🎐 Use *${prefix}autosticker* novamente para desativar.`
      : `╭──────「 🎨 」──────╮\n` +
        `      *AUTOSTICKER*\n` +
        `╰──────────────────╯\n\n` +
        `🔒 *Desativado neste grupo.*\n\n` +
        `As fotos não serão mais convertidas automaticamente.`
  );
}
break;
//


// ferramentas de figurinhas • v0.1.22
case "toimg":
case "toimage": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "stickerMessage" ? info : null);

  if (!target?.message || getContentType(target.message) !== "stickerMessage") {
    return reply(`🖼️ Responda a uma figurinha com *${prefix}toimg*.`);
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "buffer", {});
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default || sharpModule;
    const imageBuffer = await sharp(stickerBuffer).png().toBuffer();

    return conn.sendMessage(
      from,
      {
        image: imageBuffer,
        caption: "🌸 Figurinha convertida para imagem pela Kobayashi."
      },
      { quoted: info }
    );
  } catch (e) {
    console.error("Erro /toimg:", e);
    return reply("❌ Não consegui converter essa figurinha para imagem.");
  }
}
break;

case "togif": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "stickerMessage" ? info : null);

  if (!target?.message || getContentType(target.message) !== "stickerMessage") {
    return reply(`🎞️ Responda a uma figurinha animada com *${prefix}togif*.`);
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "buffer", {});
    const tmpId = randomBytes(6).toString("hex");
    const inputPath = path.join(os.tmpdir(), `koba-togif-${tmpId}.webp`);
    const outputPath = path.join(os.tmpdir(), `koba-togif-${tmpId}.mp4`);

    fsx.writeFileSync(inputPath, stickerBuffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-movflags faststart",
          "-pix_fmt yuv420p",
          "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"
        ])
        .toFormat("mp4")
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    const videoBuffer = fsx.readFileSync(outputPath);
    try { fsx.unlinkSync(inputPath); } catch {}
    try { fsx.unlinkSync(outputPath); } catch {}

    return conn.sendMessage(
      from,
      {
        video: videoBuffer,
        gifPlayback: true,
        caption: "🐉🌸 Figurinha convertida para GIF."
      },
      { quoted: info }
    );
  } catch (e) {
    console.error("Erro /togif:", e);
    return reply("❌ Não consegui converter essa figurinha. Tente com uma figurinha animada.");
  }
}
break;

case "take": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "stickerMessage" ? info : null);

  if (!target?.message || getContentType(target.message) !== "stickerMessage") {
    return reply(
      `🎐 Responda a uma figurinha com:\n\n` +
      `*${prefix}take Nome do pacote | Autor*\n\n` +
      `Ex.: *${prefix}take Kobayashi Pack | ${pushname || "Usuário"}*`
    );
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "buffer", {});
    const parts = String(q || "").split("|").map((x) => x.trim());
    const cfg = readSettingsFile();

    const packName = parts[0] || "Kobayashi Pack";
    const authorName = parts[1] || pushname || sender.split("@")[0];

    const webpModule = await import("node-webpmux");
    const WebpImage = webpModule.Image || webpModule.default?.Image;
    if (!WebpImage) return reply("❌ Não consegui carregar o editor de metadados.");

    const jsonMeta = Buffer.from(JSON.stringify({
      "sticker-pack-id": "kobayashi-take",
      "sticker-pack-name": packName,
      "sticker-pack-publisher": authorName,
      "emojis": ["🐉","🌸"]
    }), "utf8");

    const exif = Buffer.concat([
      Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00]),
      Buffer.alloc(4),
      Buffer.from([0x16,0x00,0x00,0x00]),
      jsonMeta
    ]);
    exif.writeUIntLE(jsonMeta.length, 14, 4);

    const img = new WebpImage();
    await img.load(stickerBuffer);
    img.exif = exif;
    const result = await img.save(null);

    return conn.sendMessage(from, { sticker: result }, { quoted: info });
  } catch (e) {
    console.error("Erro /take:", e);
    return reply("❌ Não consegui alterar os dados dessa figurinha.");
  }
}
break;

case "setcmd":
case "rgcmd": {
  if (!isGroup || !groupAdmins.includes(sender)) {
    return reply("🛡️ Apenas administradores do grupo podem associar comandos a figurinhas.");
  }

  const quoted = getQuotedMessage(info);
  if (!quoted?.message || getContentType(quoted.message) !== "stickerMessage") {
    return reply(
      `🎴 Responda a uma figurinha com:\n\n` +
      `*${prefix}setcmd comando*\n\n` +
      `Ex.: *${prefix}setcmd ping*`
    );
  }

  const cmdText = String(q || "").trim();
  if (!cmdText) {
    return reply(`🎴 Informe o comando.\nEx.: *${prefix}setcmd menu*`);
  }

  const normalized = cmdText.startsWith(prefix) ? cmdText : `${prefix}${cmdText}`;
  if (!setStickerMappedCommand(quoted.message, normalized)) {
    return reply("❌ Não consegui identificar essa figurinha.");
  }

  return reply(
    `✅🎴 *COMANDO NA FIGURINHA*\n\n` +
    `Essa figurinha agora executa:\n*${normalized}*\n\n` +
    `🐉 Basta enviá-la no chat.`
  );
}
break;

case "delcmd": {
  if (!isGroup || !groupAdmins.includes(sender)) {
    return reply("🛡️ Apenas administradores do grupo podem remover comandos de figurinhas.");
  }

  const quoted = getQuotedMessage(info);
  if (!quoted?.message || getContentType(quoted.message) !== "stickerMessage") {
    return reply(`🎴 Responda à figurinha com *${prefix}delcmd*.`);
  }

  if (!removeStickerMappedCommand(quoted.message)) {
    return reply("🌸 Essa figurinha não possui comando associado.");
  }

  return reply("✅🌸 Comando removido dessa figurinha.");
}
break;

case "listcmdsticker":
case "stickercmds": {
  if (!isGroup || !groupAdmins.includes(sender)) {
    return reply("🛡️ Apenas administradores do grupo podem consultar essa lista.");
  }

  const db = readStickerCmdDb();
  const entries = Object.entries(db);

  if (!entries.length) {
    return reply("🎴 Nenhuma figurinha com comando foi configurada ainda.");
  }

  const lines = entries.slice(0, 30).map(([hash, cmd], i) =>
    `${i + 1}. *${cmd}* • ${hash.slice(0, 10)}…`
  ).join("\n");

  return reply(
    `╭──────「 🎴 」──────╮\n` +
    `   *STICKER COMMANDS*\n` +
    `╰──────────────────╯\n\n` +
    `${lines}\n\n` +
    `📦 Total: *${entries.length}*`
  );
}
break;
//


case "play": {
  const query = String(q || "").trim();

  if (!query) {
    return reply(
      `╭──────「 🎧 」──────╮\n` +
      `       *PLAY*\n` +
      `╰──────────────────╯\n\n` +
      `🌸 Digite o nome da música ou envie um link do YouTube.\n\n` +
      `🎵 *${prefix}play nome da música*\n` +
      `🔗 *${prefix}play link do YouTube*`
    );
  }

  try {
    await reagir("🎧");

    const cfg = readSettingsFile();
    const yutaToken = String(cfg.yutaToken || "").trim();

    if (!yutaToken || yutaToken === "COLOQUE_SEU_TOKEN_YUTA_AQUI") {
      return reply(
        `🔑🌸 *YUTA API NÃO CONFIGURADA*\n\n` +
        `O Play agora usa o mesmo backend de download do Hutao.\n\n` +
        `Configure seu token em:\n` +
        `*settings/settings.json*\n\n` +
        `"yutaToken": "SEU_TOKEN_AQUI"`
      );
    }

    const ytsModule = await import("yt-search");
    const yts = ytsModule.default || ytsModule;

    const isUrl = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/i.test(query);
    let video = null;

    if (isUrl) {
      let videoId = null;
      try {
        const u = new URL(query);
        if (u.hostname.includes("youtu.be")) {
          videoId = u.pathname.split("/").filter(Boolean)[0];
        } else if (u.pathname.includes("/shorts/")) {
          videoId = u.pathname.split("/shorts/")[1]?.split(/[?&/]/)[0];
        } else {
          videoId = u.searchParams.get("v");
        }
      } catch {}

      if (videoId) video = await yts({ videoId });
    } else {
      const result = await yts(query);
      video = result?.videos?.[0];
    }

    if (!video?.url) {
      return reply("🌸 Não encontrei essa música no YouTube.");
    }

    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption:
        `╭──────「 🎧 」──────╮\n` +
        `    *KOBAYASHI PLAY*\n` +
        `╰──────────────────╯\n\n` +
        `🎵 *${video.title || "Música"}*\n` +
        `🎙️ Canal: ${video.author?.name || video.author || "Desconhecido"}\n` +
        `⏱️ Duração: ${video.timestamp || "—"}\n` +
        `🔗 ${video.url}\n\n` +
        `🌸 Baixando pela Yuta API...`
    }, { quoted: info });

    // Rota de áudio usada pelo sistema do Hutao V10.
    const apiUrl =
      `https://yuta-apis.xyz/api/downloads/ytaudio2?url=${encodeURIComponent(video.url)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": yutaToken,
        "x-yuta-client": "HutaoBot-MD",
        "x-yuta-apikey": "lmonly_92848OlfQmCn836B53OSR1mEk7X7n8o63l8",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      let detail = "";
      try { detail = await response.text(); } catch {}
      throw new Error(`Yuta API HTTP ${response.status}: ${detail.slice(0,200)}`);
    }

    const contentType = String(response.headers.get("content-type") || "").toLowerCase();
    const buffer = Buffer.from(await response.arrayBuffer());

    // O endpoint do Hutao retorna o áudio diretamente.
    // Se a API devolver JSON de erro, mostramos uma mensagem mais clara.
    if (contentType.includes("application/json")) {
      let apiData = null;
      try { apiData = JSON.parse(buffer.toString("utf8")); } catch {}

      if (apiData) {
        const possibleUrl =
          apiData?.url ||
          apiData?.audio ||
          apiData?.result?.url ||
          apiData?.result?.audio ||
          apiData?.data?.url ||
          apiData?.data?.audio;

        if (typeof possibleUrl === "string" && /^https?:\/\//i.test(possibleUrl)) {
          const mediaRes = await fetch(possibleUrl);
          if (!mediaRes.ok) throw new Error(`Falha ao baixar áudio retornado pela API: ${mediaRes.status}`);
          const audioBuffer = Buffer.from(await mediaRes.arrayBuffer());

          await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            fileName: `${String(video.title || "Kobayashi Play").replace(/[\\/:*?"<>|]/g, "").slice(0,80)}.mp3`
          }, { quoted: info });

          await reagir("🌸");
          break;
        }

        const apiMessage =
          apiData?.message ||
          apiData?.msg ||
          apiData?.error ||
          "A API não retornou um áudio válido.";

        throw new Error(String(apiMessage));
      }
    }

    if (!buffer.length) throw new Error("A Yuta API retornou um arquivo vazio.");

    await conn.sendMessage(from, {
      audio: buffer,
      mimetype: contentType.includes("audio/") ? contentType.split(";")[0] : "audio/mpeg",
      fileName: `${String(video.title || "Kobayashi Play").replace(/[\\/:*?"<>|]/g, "").slice(0,80)}.mp3`
    }, { quoted: info });

    await reagir("🌸");
  } catch (e) {
    console.error("Erro no /play Yuta:", e);
    const errorText = String(e?.message || e || "");

    if (/401|403|token|authorization|unauthorized/i.test(errorText)) {
      return reply("🔑❌ A Yuta API recusou o token. Confira o `yutaToken` nas configurações.");
    }

    return reply(
      `❌🌸 Não consegui baixar essa música pela Yuta API.\n\n` +
      `Detalhe: ${errorText.slice(0,180)}`
    );
  }
}
break;

// comandos públicos
case "stickers":
case "sticker":
case "stk":
case "st":
case "s": {
  reagir("🎨");

  const mediaTarget = getCurrentOrQuotedMedia(info);
  if (!mediaTarget?.message) {
    return reply(
      `🎨🌸 Envie uma imagem ou vídeo com *${prefix}s* na legenda\n` +
      `ou responda à mídia com *${prefix}s*.\n\n` +
      `🎞️ Vídeos: máximo de *9.9 segundos*.`
    );
  }

  try {
    const mediaType = getContentType(mediaTarget.message);

    if (!["imageMessage","videoMessage","stickerMessage"].includes(mediaType)) {
      return reply("🎨🌸 Essa mídia não pode ser convertida em figurinha.");
    }

    const cfg = readSettingsFile();
    const metadata = {
      userNick: pushname || sender.split("@")[0],
      groupName: isGroup ? groupName : "Privado",
      botName: cfg.NomeDoBot || NomeDoBot,
      creatorName: cfg.creatorName || cfg.ownerName || ownerName,
    };

    if (mediaType === "stickerMessage") {
      const original = await downloadMediaMessage(mediaTarget,"buffer",{});
      const renamed = await applyStickerMetadata(original,metadata);
      return conn.sendMessage(from,{sticker:renamed},{quoted:info});
    }

    if (mediaType === "videoMessage") {
      const seconds = Number(mediaTarget.message?.videoMessage?.seconds || 0);
      if (seconds > 9.9) {
        return reply("🎞️🌸 O vídeo precisa ter no máximo *9.9 segundos* para virar figurinha.");
      }
    }

    const buffer = await downloadMediaMessage(mediaTarget,"buffer",{});
    const sticker = await makeSticker(buffer,{
      isVideo: mediaType === "videoMessage",
      forceSquare: true,
      metadata
    });

    return conn.sendMessage(from,{sticker},{quoted:info});
  } catch (e) {
    console.error("Erro na criação de sticker:",e);
    return reply(
      "❌🌸 Não consegui criar essa figurinha.\n\n" +
      "Para vídeos, confirme que o FFmpeg está disponível na hospedagem."
    );
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

  const participants = [...new Set(
    (groupMembers || [])
      .map((p) => p?.id || p?.jid)
      .filter(Boolean)
      .filter((jid) => jid !== botNumber)
  )];

  // Em cada execução sorteia pessoas diferentes do grupo.
  // Fisher-Yates evita repetir o mesmo membro dentro do ranking.
  for (let i = participants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [participants[i], participants[j]] = [participants[j], participants[i]];
  }

  const selected = participants.slice(0, Math.min(10, participants.length));

  // A porcentagem também é nova em cada execução.
  const ranked = selected
    .map((jid) => ({
      jid,
      score: Math.floor(Math.random() * 101),
    }))
    .sort((a, b) => b.score - a.score);

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
    `🎲 Pessoas e porcentagens sorteadas novamente a cada ranking.`;

  return sendFunCard(conn, from, info, command, caption, ranked.map((x) => x.jid));
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

case "menusticker":
case "menustk":
reagir("🎴");
reply(linguagem.menuSticker(prefix));
break;

case "menugeral":
case "geral":
reagir("🪷");
reply(linguagem.menuGeral(prefix));
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
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode alterar configurações críticas do bot.");

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



// líderes / múltiplos donos • v0.1.19
case "dono1":
case "dono2":
case "dono3":
case "dono4":
case "dono5": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o *dono principal* configurado no bot pode alterar os líderes.");
  }

  const slot = Number(command.replace("dono", "")) - 1;
  const numero = onlyDigits(q);

  if (!numero) {
    const cfg = readSettingsFile();
    const leaders = Array.isArray(cfg.leaders) ? cfg.leaders : [];
    const atual = leaders[slot];

    if (!atual) {
      return reply(
        `👑🌸 *LÍDER ${slot + 1}*\n\n` +
        `Este slot está vazio.\n\n` +
        `Para adicionar:\n*${prefix}${command} 5511999999999*`
      );
    }

    return reply(
      `👑🌸 *LÍDER ${slot + 1}*\n\n` +
      `📱 Número: *${atual}*\n\n` +
      `Para remover:\n*${prefix}${command} remover*`
    );
  }

  const raw = String(q || "").trim().toLowerCase();
  const cfg = readSettingsFile();
  const leaders = Array.isArray(cfg.leaders) ? cfg.leaders.slice(0, 5) : [];

  while (leaders.length < 5) leaders.push("");

  if (["remover","remove","off","0"].includes(raw)) {
    leaders[slot] = "";
    cfg.leaders = leaders;
    writeSettingsFile(cfg);

    return reply(
      `✅🌸 *Líder ${slot + 1} removido.*\n\n` +
      `O slot agora está disponível.`
    );
  }

  if (numero.length < 8) {
    return reply(
      `❌ Número inválido.\n\n` +
      `Use: *${prefix}${command} 5511999999999*`
    );
  }

  const ownerNumber = onlyDigits(cfg.ownerNumber || "");
  if (numero === ownerNumber) {
    return reply("👑 Esse número já é o dono principal do bot.");
  }

  // Evita o mesmo líder em mais de um slot.
  for (let i = 0; i < leaders.length; i++) {
    if (i !== slot && onlyDigits(leaders[i]) === numero) {
      return reply(`⚠️ Esse número já está configurado como *Líder ${i + 1}*.`);
    }
  }

  leaders[slot] = numero;
  cfg.leaders = leaders;
  writeSettingsFile(cfg);

  return reply(
    `╭──────「 👑 」──────╮\n` +
    `      *NOVO LÍDER*\n` +
    `╰──────────────────╯\n\n` +
    `🌸 Líder ${slot + 1} configurado com sucesso.\n` +
    `📱 Número: *${numero}*\n\n` +
    `🐉 Esse líder agora pode usar comandos restritos ao dono, exceto alterações críticas do bot.`
  );
}
break;

case "lideres":
case "líderes":
case "donos": {
  if (!SoDono) return reply(mess.onlyOwner());

  const cfg = readSettingsFile();
  const leaders = Array.isArray(cfg.leaders) ? cfg.leaders : [];
  const filled = leaders
    .map((n, i) => ({ n: onlyDigits(n), slot: i + 1 }))
    .filter((x) => x.n);

  const linhas = filled.length
    ? filled.map((x) => `│ 👑 Líder ${x.slot} › ${x.n}`).join("\n")
    : "│ 🌸 Nenhum líder configurado.";

  return reply(
    `╭──────「 👑 」──────╮\n` +
    `     *LÍDERES DO BOT*\n` +
    `╰──────────────────╯\n\n` +
    `${linhas}\n\n` +
    `🐉 Máximo de *5 líderes*.\n` +
    `👑 Apenas o dono principal pode adicionar/remover.`
  );
}
break;
//

// configurações exclusivas do dono • v0.1.6
case "numero_dono":
case "número_dono": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode alterar configurações críticas do bot.");
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
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode alterar configurações críticas do bot.");
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
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode alterar configurações críticas do bot.");
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
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode alterar configurações críticas do bot.");
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
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode alterar configurações críticas do bot.");
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
