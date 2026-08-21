/*ESSA BASE FOI DESENVOLVIDA PELO ALVES COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY ALVES
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

import { getContentType, delay, downloadMediaMessage } from "@whiskeysockets/baileys";
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
  const sharpModule = await import("sharp");
  const sharp = sharpModule.default || sharpModule;

  const webpBuffer = await sharp(mediaBuffer)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .webp({ quality: 90 })
    .toBuffer();

  return addStickerMetadata(webpBuffer, meta);
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
      remot