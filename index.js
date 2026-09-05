/*ESSA BASE FOI DESENVOLVIDA PELO  COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY 
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

import { getContentType, delay, downloadMediaMessage } from "@whiskeysockets/baileys";
import { makeSticker, applyStickerMetadata } from "./lib/stickerEngine.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { checkUpdate, applyUpdate, getLocalVersion } from "./updater.js";

import { moment, colors, linguagem, mess, normalizeJid, getPNForJid, getGroupAdmins, logos, baileysVersion, fetch, axios, fs as fsx, os, path, randomBytes, ffmpeg } from "./settings/imports/consts.js";

import { getGroupMetadata } from "./lib/groupCache.js";
import { readGroupScheduleDb, normalizeClockTime, updateGroupSchedule } from "./lib/features/group/groupSchedule.js";
import { getWelcomeConfig, updateWelcomeConfig, renderWelcomeText, removePartnerLink, setWelcomePhoto, removeWelcomePhoto } from "./lib/features/group/welcomeConfig.js";
import { getStickerMappedCommand, setStickerMappedCommand, removeStickerMappedCommand, listStickerMappedCommands } from "./lib/features/stickers/stickerCommands.js";
import { getWhitelist, isWhitelisted, addWhitelist, removeWhitelist } from "./lib/features/moderation/whitelist.js";
import { setAutoSticker, isAutoStickerEnabled } from "./lib/features/group/autoSticker.js";
import { readSettingsFile, writeSettingsFile, getConfiguredLeaders, isMainOwnerJid, isLeaderJid, onlyDigits } from "./lib/config/settingsStore.js";
import { readAdvDb, writeAdvDb } from "./lib/moderation/advStore.js";
import { runModularCommand, getCommandHelpCatalog } from "./commands/registry.js";
import { createPermissions, permissionName } from "./lib/core/permissions.js";
import { addAdminLog, getAdminLogs, clearAdminLogs, getAdminLogStats, cleanupAdminLogs } from "./lib/features/moderation/adminLogs.js";
import { setAfk, getAfk, removeAfk, formatDuration as formatAfkDuration } from "./lib/features/social/afkSystem.js";
import { trackActivity, getUserActivity, getTopActivity, getInactive, getTopLevel, getLevelInfoFromXp, isLevelEnabled, setLevelEnabled, getGlobalTopLevel, resetGroupLevelRank, resetGlobalLevelRank
} from "./lib/features/social/activityTracker.js";
import { getYuriProtection, toggleYuriProtection, configureAntiFlood, checkCommandFlood, muteUser, unmuteUser, isMuted } from "./lib/features/moderation/yuriProtection.js";
import { getAntiFakeConfig, setAntiFakeEnabled, findForeignParticipants } from "./lib/features/moderation/antiFake.js";
import { resolveCommandAlias, getGroupCommandConfig, setSoAdm, blockGroupCommand, unblockGroupCommand, isGroupCommandBlocked, blockGlobalCommand, unblockGlobalCommand, getGlobalCommandBlock, addCommandAlias, removeCommandAlias, listCommandAliases, trackCommandUsage, getMostUsedCommands, getCommandStats, getTotalCommandUsage } from "./lib/features/system/commandControl.js";
import { getReleaseNotes, formatReleaseNotes, markPendingUpdateNews, consumePendingUpdateNews } from "./lib/features/system/updateNews.js";
import { getRental, registerRental, renewRental, removeRental, setPermanentRental, listRentals, setRentalRestriction, getRentalSettings, parseRentalDuration, formatRentalDuration, formatRentalDate, getRentalPlan, listRentalPlans, formatPlan, normalizeGroupJid, registerRentalByPlan, registerPartnerRental, registerTrialRental, renewRentalByPlan, setRentalWarnings } from "./lib/features/rental/rentalSystem.js";
import { getAntiTravaConfig, updateAntiTravaConfig, inspectPotentialTrava, formatAntiTravaStatus } from "./lib/features/moderation/antiTrava.js";
import { getAntiSpamConfig, setAntiSpamEnabled, inspectAntiSpam, formatAntiSpamStatus } from "./lib/features/moderation/antiSpam.js";
import { addPunishmentHistory, getPunishmentHistory, clearPunishmentHistory, formatPunishmentHistory, getRecidivismSummary } from "./lib/features/moderation/moderationHistory.js";
import { listStickerSources, setStickerSourceMode, addStickerTemplateSource, removeStickerSource, getRandomStickerBuffer } from "./lib/features/stickers/stickerSources.js";
import { getRules, setRules, clearRules, listNotes, addNote, removeNote, clearNotes, getBlacklist, isBlacklisted, addBlacklist, removeBlacklist, getBlacklistMeta } from "./lib/features/moderation/adminPro.js";
import { isGloballyBlacklisted, addGlobalBlacklist, removeGlobalBlacklist, getGlobalBlacklistEntry, listGlobalBlacklist, normalizeBlacklistJid } from "./lib/features/moderation/globalBlacklist.js";
import { markPrincipalSeen, configureSentinelRuntime, getSentinelStatus, setSentinelGroupEnabled, startSentinelPairing, stopSentinel, getSentinelLogs, setSentinelDelay } from "./lib/features/moderation/sentinelSystem.js";
import { getSocialProfile, claimDaily, transferCoins, getCoinRank, recordGame, getAchievements, recordSocialInteraction, getEconomySummary, awardLevelUpCoins, getShopItems, buyShopItem, getInventory, equipTitle, unequipTitle, openDragonBox, getActiveTitle, getShopUsage, getAntiFarmConfig, setAntiFarmEnabled, getAntiFarmUsage } from "./lib/features/social/dragonSocial.js";
import {
  buildMainMenu, buildGeneralMenu, buildAdminMenu, buildStickerMenu, buildOwnerMenu,
  buildSocialMenu, buildShopMenu, buildLevelMenu, buildFunMenu, getCommandHelp
} from "./lib/ui/menuTheme.js";

import { buildAdminCenter, buildGroupStatus, buildProtectionPanel, buildSystemsPanel, buildPermissionDiagnostic } from "./lib/ui/adminCenter.js";
import { ensureDragonCoreRuntime } from "./lib/features/core/dragonCore.js";
import {
  getDragonRpgPlayer, createDragonRpgPlayer, chooseHumanClass, startDragonAwakening,
  chooseDragonFaction, chooseDragonClass, formatDragonRpgProfile, formatDragonRpgInventory,
  formatRpgMenu, formatRpgCommands, formatRpgClasses, formatClassInfo, formatRpgHelp, factionName,
  formatRpgRegions, startRpgBattle, rpgAttack, rpgDefend, rpgSkill, rpgUseItem, rpgFlee, rpgRest,
  rpgSpendStat, formatBattleStart, formatBattleAction, formatRpgQuests, acceptRpgQuest, claimRpgQuest, formatRpgRank,
  resetDragonRpgUsers, resetAllDragonRpg, formatRpgShop, buyRpgItem, equipRpgItem, unequipRpgItem, formatRpgEquipment, formatRpgSkills
} from "./lib/features/rpg/dragonRpg.js";
import { configureSentinelBridgeRuntime, ensureSentinelBridgeServer, getSentinelBridgeStatus, rotateSentinelBridgeSecret, setSentinelBridgeEnabled, getSentinelBridgeLogs, processSentinelWhatsAppMessage, setSentinelWhatsAppNumber, setSentinelBridgeTestMode } from "./lib/features/moderation/sentinelBridge.js";

const jsCommandSource = (await import("node:fs")).default.readFileSync(new URL("./index.js", import.meta.url), "utf8");

// ─────────────────────────────────────────────
// 🐉 Configuração principal
// ─────────────────────────────────────────────
const settings = JSON.parse(
  fs.readFileSync(new URL("./settings/settings.json", import.meta.url))
);

const { prefix, NomeDoBot, ownerNumber, ownerName } = settings;

const FUN_DB = path.join(process.cwd(), "files", "database", "brincadeiras.json");

const PROTECTION_DB = path.join(process.cwd(), "files", "database", "protecao-links.json");

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

  addPunishmentHistory(groupJid, target, {
    type: "adv_auto",
    reason,
    by: "Kobayashi AutoMod",
    source: "automod",
    meta: { count }
  });

  if (count >= 3 && botIsAdmin) {
    try {
      await conn.groupParticipantsUpdate(groupJid, [target], "remove");
      db[groupJid][target] = { count: 0, history: [] };
      writeAdvDb(db);

      addPunishmentHistory(groupJid, target, {
        type: "ban_auto",
        reason: "Limite de 3 advertências automáticas atingido",
        by: "Kobayashi AutoMod",
        source: "automod"
      });

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


function getSimpleMessageText(message = {}) {
  return (
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    message?.documentMessage?.caption ||
    message?.documentWithCaptionMessage?.message?.documentMessage?.caption ||
    ""
  );
}

async function replayCachedMessage(conn, from, cachedMessage, title, senderJid = null) {
  if (!cachedMessage) return false;

  const mentions = senderJid ? [senderJid] : [];
  const senderLine = senderJid
    ? `\n👤 Autor: @${String(senderJid).split("@")[0]}`
    : "";

  const text = getSimpleMessageText(cachedMessage);

  if (cachedMessage.imageMessage?.url) {
    try {
      await conn.sendMessage(from, {
        image: { url: cachedMessage.imageMessage.url },
        caption:
          `${title}${senderLine}\n\n` +
          `${cachedMessage.imageMessage.caption || ""}`,
        mentions,
      });
      return true;
    } catch {}
  }

  if (cachedMessage.videoMessage?.url) {
    try {
      await conn.sendMessage(from, {
        video: { url: cachedMessage.videoMessage.url },
        caption:
          `${title}${senderLine}\n\n` +
          `${cachedMessage.videoMessage.caption || ""}`,
        mentions,
      });
      return true;
    } catch {}
  }

  if (cachedMessage.stickerMessage?.url) {
    try {
      await conn.sendMessage(from, {
        sticker: { url: cachedMessage.stickerMessage.url },
      });
      await conn.sendMessage(from, {
        text: `${title}${senderLine}`,
        mentions,
      });
      return true;
    } catch {}
  }

  await conn.sendMessage(from, {
    text:
      `${title}${senderLine}\n\n` +
      `${text || "Mensagem sem texto recuperável."}`,
    mentions,
  });

  return true;
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

function auditMessagePreview(info, body = "", type = "") {
  const clean = String(body || "")
    .replace(/\u0000/g, "")
    .trim();

  if (clean) return clean;

  const message = info?.message || {};
  if (message?.stickerMessage) return "[Figurinha]";
  if (message?.imageMessage) {
    const caption = String(message.imageMessage.caption || "").trim();
    return caption ? `[Foto]\n${caption}` : "[Foto]";
  }
  if (message?.videoMessage) {
    const caption = String(message.videoMessage.caption || "").trim();
    return caption ? `[Vídeo]\n${caption}` : "[Vídeo]";
  }
  if (message?.audioMessage) return "[Áudio]";
  if (message?.documentMessage) return `[Documento: ${message.documentMessage.fileName || "sem nome"}]`;
  if (message?.contactMessage || message?.contactsArrayMessage) return "[Contato]";
  if (message?.locationMessage || message?.liveLocationMessage) return "[Localização]";
  if (message?.pollCreationMessage || message?.pollCreationMessageV3) return "[Enquete]";

  return `[${type || "Mensagem sem texto"}]`;
}

function formatAuditPhone(sender = "") {
  const raw = String(sender || "").split("@")[0].replace(/\D/g, "");
  if (!raw) return "não disponível";

  if (raw.startsWith("55") && raw.length >= 12) {
    const ddd = raw.slice(2, 4);
    const local = raw.slice(4);
    if (local.length === 9) {
      return `+55 ${ddd} ${local.slice(0, 5)}-${local.slice(5)}`;
    }
    if (local.length === 8) {
      return `+55 ${ddd} ${local.slice(0, 4)}-${local.slice(4)}`;
    }
  }

  return `+${raw}`;
}

function buildWhatsAppReadMoreBreak() {
  // O WhatsApp cria "Ler mais" automaticamente quando a mensagem ultrapassa
  // o limite visual. Usamos caracteres invisíveis NA MESMA LINHA para não
  // criar um bloco gigante de espaço vazio no chat.
  return "\u200B".repeat(1400);
}

function formatAntiLinkAudit({
  sender,
  senderLid,
  groupName,
  groupJid,
  messageId,
  messageText,
  actionResult = "",
  action = "AntiLink"
}) {
  const targetNumber = String(sender || "").split("@")[0] || "desconhecido";
  const phone = formatAuditPhone(sender);
  const fullMessage = String(messageText || "[sem conteúdo legível]").trim();
  const readMoreBreak = buildWhatsAppReadMoreBreak();

  return (
    `╭═══════ ❀ 🐉 ❀ ═══════╮\n` +
    `   🚨 *KOBAYASHI AUDIT* 🚨\n` +
    `╰═══════ ❀ 🌸 ❀ ═══════╯\n\n` +

    `╭─〔 🛡️ *REGISTRO DE AUDITORIA* 〕\n` +
    `│ ⚙️ Ação › *${action}*\n` +
    `│ 🎯 Alvo › @${targetNumber}\n` +
    `│ 👥 Grupo › ${groupName || "Grupo"}\n` +
    `│ 🆔 Lid › ${senderLid || "não disponível"}\n` +
    `│ 📱 Número › ${phone}\n` +
    `╰────────────────\n\n` +

    `╭─〔 💬 *MENSAGEM DETECTADA* 〕\n` +
    `│ ${readMoreBreak}${fullMessage}\n` +
    `╰────────────────` +
    (actionResult
      ? `\n\n╭─〔 ✅ *RESULTADO* 〕\n│ ${actionResult}\n╰────────────────`
      : "")
  );
}

async function notifyOwnerAntiLink(conn, ownerJid, data) {
  if (!conn || !ownerJid || !data?.sender) return false;

  try {
    await conn.sendMessage(ownerJid, {
      text: formatAntiLinkAudit(data),
      mentions: [data.sender]
    });
    return true;
  } catch (e) {
    console.error("Erro ao enviar auditoria AntiLink ao dono:", e?.message || e);
    return false;
  }
}

async function notifyOwnerAntiPv(conn, ownerJid, { sender, messageId, messageText, type }) {
  if (!conn || !ownerJid || !sender) return false;

  const number = String(sender).split("@")[0] || "desconhecido";
  const text =
    `🚨 *ANTI-PV • NOVA INVASÃO*\n\n` +
    `- Número: @${number}\n` +
    `- Id: ${messageId || "não disponível"}\n` +
    `- Tipo: ${type || "mensagem"}\n` +
    `- Mensagem: ${messageText || "[sem conteúdo legível]"}\n\n` +
    `🛡️ O Anti-PV bloqueou a interação automaticamente.`;

  try {
    await conn.sendMessage(ownerJid, {
      text,
      mentions: [sender]
    });
    return true;
  } catch (e) {
    console.error("Erro ao avisar dono sobre Anti-PV:", e?.message || e);
    return false;
  }
}

export default async function start(upsert, conn) {
try {
ensureDragonCoreRuntime(conn);
for (const info of upsert?.messages || []) {
// 🛰️ Kobayashi Sentinel: registra até eventos sem conteúdo.
// Isso permite comparar o que a conta ADM recebeu com o que a conta membro recebeu.
markPrincipalSeen(info);
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
const rawCommand = isCmd
  ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
  : null;

const command = isCmd
  ? resolveCommandAlias(rawCommand)
  : null;

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

// Mantém o identificador LID original para auditoria.
// participantAlt costuma carregar o LID quando participant já foi entregue como PN.
const senderLidCandidates = [
  info?.key?.participant,
  info?.key?.participantAlt,
  rawSender,
  groupMetadata?.participants?.find?.((p) => {
    const ids = [p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid].filter(Boolean);
    return ids.includes(rawSender) || ids.includes(sender);
  })?.lid
].filter(Boolean);

const senderLid = senderLidCandidates.find((jid) =>
  String(jid).includes("@lid")
) || null;

const botNumber = await getPNForJid(conn, conn.user.id, conn.user.lid || conn.user.phoneNumber) ||
(conn.user.id.split(":")[0] + "@s.whatsapp.net");

const groupMembers = isGroup ? groupMetadata.participants : "";

const dono = ownerNumber + "@s.whatsapp.net";
const SoDonoPrincipal = sender === dono || isMainOwnerJid(sender);
const SoLider = isLeaderJid(sender);
const SoDono = SoDonoPrincipal || SoLider;
const runtimeSettings = readSettingsFile();

// 🛰️ SENTINEL WA • recebe alertas assinados enviados pelo número observador.
// É processado antes do Anti-PV para a própria proteção do PV não bloquear a ponte.
configureSentinelBridgeRuntime(conn, {
  ownerJids: [dono],
  isWhitelisted: (groupJid, userJid) => isWhitelisted(groupJid, userJid)
});
const sentinelWaResult = await processSentinelWhatsAppMessage({
  text: body,
  senderJid: sender
});
if (sentinelWaResult.handled) continue;

// 🖤 LISTA NEGRA GLOBAL v1.0.2
// Usuários cadastrados aqui são ignorados pelo bot em qualquer grupo/PV.
// O dono principal sempre possui bypass para evitar lockout administrativo.
if (!SoDonoPrincipal && sender && isGloballyBlacklisted(sender)) {
  continue;
}

// 🐉 UPDATE NEWS v0.3.6
// Após um /update, a notícia fica pendente em disco. Na primeira atividade
// recebida depois do reinício, a Kobayashi publica o resumo no chat que iniciou a atualização.
const pendingUpdateNews = consumePendingUpdateNews();
if (pendingUpdateNews?.targetJid) {
  const currentNotes = getReleaseNotes();
  const expectedVersion = String(pendingUpdateNews?.toVersion || "").trim();
  const currentVersion = String(currentNotes?.version || getLocalVersion()).trim();

  if (!expectedVersion || expectedVersion === currentVersion) {
    const updateText =
      `🐉🌸 *KOBAYASHI BOT ATUALIZADA!*\n\n` +
      `📦 *Versão*\n${pendingUpdateNews?.fromVersion || "anterior"} → ${currentVersion}\n\n` +
      formatReleaseNotes(currentNotes, { prefix });

    await conn.sendMessage(
      pendingUpdateNews.targetJid,
      { text: updateText }
    ).catch((e) => console.error("Erro ao enviar Update News:", e));
  }
}

if (!isGroup && !isStatus && !info.key.fromMe && runtimeSettings.antiPv && !SoDono) {
  const antiPvPreview = auditMessagePreview(info, body, type);

  // Avisa o dono em QUALQUER tentativa de contato no PV, não apenas comandos.
  await notifyOwnerAntiPv(conn, dono, {
    sender,
    messageId: info?.key?.id,
    messageText: antiPvPreview,
    type
  });

  // Mantém uma resposta curta ao invasor. Evita múltiplas mensagens do bot.
  await conn.sendMessage(
    from,
    { text: "🛡️🐉 Meu privado está protegido pelo Anti-PV. O proprietário foi notificado." },
    { quoted: info }
  ).catch(() => {});

  continue;
}

// KOBAYASHI AFK + ACTIVITY v0.1.55
// O tracker precisa rodar em grupos independentemente do Anti-PV.
if (isGroup && sender && !info.key.fromMe) {
  const rawActivityType = getContentType(info.message || {});
  const activityType =
    rawActivityType === "imageMessage"
      ? "image"
      : rawActivityType === "stickerMessage"
        ? "sticker"
        : "text";

  const levelEvent = trackActivity(from, sender, {
    text: body,
    isCommand: isCmd,
    activityType
  });
  if (levelEvent?.levelUp) {
    const levelReward = awardLevelUpCoins(sender, levelEvent.level);

    await conn.sendMessage(from, {
      text:
        `🐉✨ *LEVEL UP!*\n\n` +
        `@${String(sender).split("@")[0]} subiu para o *nível ${levelEvent.level}*! 🎉\n` +
        `🏷️ ${levelEvent.title}\n` +
        (levelReward.awarded
          ? `🪙 Recompensa: *+${levelReward.reward} Dragon Coins*\n💰 Saldo: *${levelReward.coins}*\n\n`
          : `\n`) +
        (levelEvent.level >= 50
          ? `👑 *NÍVEL MÁXIMO ALCANÇADO!* Você chegou ao topo do Dragon Level.`
          : `✨ Continue conversando e usando a Kobayashi para evoluir.`),
      mentions: [sender]
    }, { quoted: info }).catch(() => {});
  }

  // Se o próprio usuário voltou a falar, remove o AFK.
  const ownAfk = getAfk(sender);
  if (ownAfk && command !== "afk") {
    const elapsed = formatAfkDuration(Date.now() - Number(ownAfk.since || Date.now()));
    removeAfk(sender);
    await conn.sendMessage(from, {
      text: `🌸 @${String(sender).split("@")[0]} voltou do AFK.\n⏱️ Ficou ausente por *${elapsed}*.`,
      mentions: [sender]
    }, { quoted: info }).catch(() => {});
  }

  // Avisa quando alguém menciona/responde uma pessoa em AFK.
  const mentioned = [
    ...(info?.message?.extendedTextMessage?.contextInfo?.mentionedJid || []),
    info?.message?.extendedTextMessage?.contextInfo?.participant || null
  ].filter(Boolean);

  const uniqueMentioned = [...new Set(mentioned)].filter(jid => jid !== sender);

  for (const jid of uniqueMentioned.slice(0, 5)) {
    const afk = getAfk(jid);
    if (!afk) continue;
    const elapsed = formatAfkDuration(Date.now() - Number(afk.since || Date.now()));
    await conn.sendMessage(from, {
      text:
        `💤 @${String(jid).split("@")[0]} está AFK.\n` +
        `📝 Motivo: *${afk.reason || "Sem motivo informado"}*\n` +
        `⏱️ Há: *${elapsed}*`,
      mentions: [jid]
    }, { quoted: info }).catch(() => {});
  }
}

const groupAdmins = isGroup ? await getGroupAdmins(groupMembers, conn) : "";
const isGroupAdmins = groupAdmins.includes(sender) || SoDono || false;
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;

// 🛰️ KOBAYASHI SENTINEL • v0.3.9
// Atualiza a conexão principal usada pelo executor. A conta sentinela nunca recebe poder de ADM.
configureSentinelRuntime(conn, {
  ownerJids: [dono],
  resolveJid: async (raw, alt = null) =>
    (await getPNForJid(conn, raw, alt)) || normalizeJid(alt || raw),
  isWhitelisted: (groupJid, userJid) => isWhitelisted(groupJid, userJid)
});

// 🛰️ SENTINEL BRIDGE EXTERNO • v0.7.0
configureSentinelBridgeRuntime(conn, {
  ownerJids: [dono],
  isWhitelisted: (groupJid, userJid) => isWhitelisted(groupJid, userJid)
});
ensureSentinelBridgeServer();


// ==========================================
// 🛡️ ADMIN PRO • LISTA NEGRA v0.2.0
// ==========================================
if (isGroup && sender && !info.key.fromMe && isBlacklisted(from, sender) && !SoDono) {
  if (isBotGroupAdmins) {
    await conn.groupParticipantsUpdate(from, [sender], "remove").catch(() => {});
  }
  await conn.sendMessage(from, {
    text: `⛔🐉 *LISTA NEGRA*\n\n@${sender.split("@")[0]} está bloqueado neste grupo.${isBotGroupAdmins ? "\n🔨 Remoção automática executada." : "\n⚠️ Preciso ser ADM para remover automaticamente."}`,
    mentions: [sender]
  }).catch(() => {});
  continue;
}

// ==========================================
// 🐉 YURI PACK 2 • CONTROLE DE COMANDOS
// ==========================================
if (isCmd && command) {
  const globalBlock = getGlobalCommandBlock(command);

  if (
    globalBlock &&
    !SoDonoPrincipal
  ) {
    await reply(
      `⛔ *Comando bloqueado globalmente.*\n\n` +
      `🧩 Comando: *${prefix}${command}*\n` +
      `📝 Motivo: *${globalBlock.reason || "Sem motivo informado"}*`
    );
    continue;
  }

  if (isGroup) {
    const commandCfg = getGroupCommandConfig(from);

    if (
      commandCfg.soadm &&
      !isGroupAdmins &&
      !SoDono
    ) {
      continue;
    }

    if (
      isGroupCommandBlocked(from, command) &&
      !isGroupAdmins &&
      !SoDono
    ) {
      await reply(
        `⛔ Este comando foi bloqueado pelos administradores deste grupo.`
      );
      continue;
    }
  }

  trackCommandUsage(command, sender);
}

// ==========================================
// 🐉 KOBAYASHI ANTISPAM PRO • v0.7.2
// ==========================================
if (isGroup && sender && !info.key.fromMe && sender !== botNumber && !isGroupAdmins && !isWhitelisted(from, sender)) {
  const antiSpamCfg = getAntiSpamConfig(from);
  const antiSpamHit = inspectAntiSpam({
    groupJid: from,
    userJid: sender,
    message: info.message,
    text: body,
    isCommand: isCmd,
    config: antiSpamCfg
  });

  if (antiSpamHit.triggered) {
    let deleted = false;
    if (isBotGroupAdmins) {
      deleted = await deleteDetectedMessage(conn, from, info);
    }

    let punishmentText = "Somente alerta";
    if (antiSpamHit.punishment === "ban" && isBotGroupAdmins) {
      try {
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        punishmentText = "Membro removido";
      } catch (e) {
        const result = await addAutomaticWarning(conn, from, sender, "AntiSpam: " + antiSpamHit.reasons.join(", "), isBotGroupAdmins, info);
        punishmentText = result.removed ? "3/3 ADVs • removido" : `Ban falhou • ADV ${result.count}/3`;
      }
    } else if (antiSpamHit.punishment === "adv") {
      const result = await addAutomaticWarning(conn, from, sender, "AntiSpam: " + antiSpamHit.reasons.join(", "), isBotGroupAdmins, info);
      punishmentText = result.removed ? "3/3 ADVs • removido" : `ADV ${result.count}/3`;
    }

    await conn.sendMessage(from, {
      text:
        `🚨🐉 *KOBAYASHI ANTISPAM*\n\n` +
        `👤 @${sender.split("@")[0]}\n` +
        `⚠️ Detectado: *${antiSpamHit.reasons.join(" • ")}*\n` +
        `🗑️ Mensagem: *${deleted ? "apagada ✅" : isBotGroupAdmins ? "não consegui apagar ⚠️" : "bot sem ADM ⚠️"}*\n` +
        `⚖️ Ação: *${punishmentText}*`,
      mentions: [sender]
    }).catch(() => {});

    addAdminLog(from, {
      type: "antispam",
      actor: botNumber,
      target: sender,
      detail: `${antiSpamHit.reasons.join(", ")} • ${punishmentText}`
    });

    continue;
  }
}


// ==========================================
// 🛡️ KOBAYASHI ANTI-TRAVA • v0.1.58
// ==========================================
if (isGroup && sender && !info.key.fromMe && sender !== botNumber) {
  const antiTravaCfg = getAntiTravaConfig(from);
  const inspection = inspectPotentialTrava({
    groupJid: from,
    userJid: sender,
    message: info.message,
    text: body,
    config: antiTravaCfg,
  });

  if (inspection.triggered) {
    let deleted = false;
    if (isBotGroupAdmins) {
      deleted = await deleteDetectedMessage(conn, from, info);
    }

    let punishmentText = "Somente alerta";
    const punishment = String(antiTravaCfg.punishment || "adv").toLowerCase();

    if (punishment === "ban") {
      if (isBotGroupAdmins) {
        try {
          await conn.groupParticipantsUpdate(from, [sender], "remove");
          punishmentText = "Membro removido";
        } catch (e) {
          const result = await addAutomaticWarning(conn, from, sender, "Anti-Trava: " + inspection.reasons.join(", "), isBotGroupAdmins, info);
          punishmentText = `Ban falhou • ADV ${result.count}/3`;
        }
      } else {
        const result = await addAutomaticWarning(conn, from, sender, "Anti-Trava: " + inspection.reasons.join(", "), false, info);
        punishmentText = `Sem ADM • ADV ${result.count}/3`;
      }
    } else if (punishment === "adv") {
      const result = await addAutomaticWarning(conn, from, sender, "Anti-Trava: " + inspection.reasons.join(", "), isBotGroupAdmins, info);
      punishmentText = result.removed ? "3/3 ADVs • removido" : `ADV ${result.count}/3`;
    }

    if (inspection.severe && antiTravaCfg.emergency && isBotGroupAdmins) {
      const wasAnnouncement = Boolean(groupMetadata?.announce);
      if (!wasAnnouncement) {
        try {
          await conn.groupSettingUpdate(from, "announcement");
          const reopenMs = Math.max(5, Math.min(120, Number(antiTravaCfg.emergencySeconds) || 20)) * 1000;
          setTimeout(async () => {
            try { await conn.groupSettingUpdate(from, "not_announcement"); } catch {}
          }, reopenMs).unref?.();
        } catch (e) {
          console.error("Erro ao ativar modo de emergência:", e?.message || e);
        }
      }
    }

    await conn.sendMessage(from, {
      text:
        `🚨🐉 *KOBAYASHI ANTI-TRAVA*\n\n` +
        `👤 @${sender.split("@")[0]}\n` +
        `🧨 Detectado: *${inspection.reasons.join(" • ")}*\n` +
        `🗑️ Mensagem: *${deleted ? "apagada ✅" : isBotGroupAdmins ? "não consegui apagar ⚠️" : "preciso ser ADM ⚠️"}*\n` +
        `⚖️ Ação: *${punishmentText}*` +
        `${inspection.severe && antiTravaCfg.emergency ? `\n🚧 Modo de emergência acionado por ${antiTravaCfg.emergencySeconds}s.` : ""}`,
      mentions: [sender],
    }).catch(() => {});

    continue;
  }
}


// ==========================================
// 🐉 KOBAYASHI RENTAL SYSTEM • v0.1.57
// ==========================================
if (isCmd && command && !SoDonoPrincipal) {
  const rentalSettings = getRentalSettings();
  const rentalSafeCommands = new Set([
    "planos", "plans", "plano", "ver_aluguel", "ver_alugel", "aluguel_info",
    "dono", "owner", "criador", "version"
  ]);

  let blockedByRental = false;
  let rentalState = null;

  if (rentalSettings.globalRestrictionEnabled) {
    if (!isGroup) {
      blockedByRental = true;
    } else {
      rentalState = getRental(from);
      blockedByRental = !rentalState.active;
    }
  } else if (rentalSettings.groupRestrictionEnabled && isGroup) {
    rentalState = getRental(from);
    blockedByRental = !rentalState.active;
  }

  if (blockedByRental && !rentalSafeCommands.has(command)) {
    const expired = rentalState?.exists && !rentalState?.active;
    await reply(
      `🐉🌸 *KOBAYASHI • ACESSO RESTRITO*\n\n` +
      `${expired ? "⏳ O aluguel deste grupo expirou." : "🔒 Este grupo não possui um aluguel ativo."}\n\n` +
      `📦 Use *${prefix}planos* para consultar os planos.\n` +
      `🔎 Use *${prefix}ver_aluguel* para consultar o status.\n` +
      `👑 Fale com o proprietário do bot para liberar o acesso.`
    );
    continue;
  }
}

const menc_prt = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
const menc_info = info.message?.extendedTextMessage?.contextInfo;
const numDigitado = inputToJid(q);
const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
const menc_os2 = menc_info?.participant || menc_info?.mentionedJid?.[0] || numDigitado || null;

// ==========================================
// 🐉 YURI PACK 1 • RUNTIME FIX v0.1.45
// ==========================================
if (isGroup && sender) {
  // MUTE persistente: apaga mensagens de membros mutados.
  if (
    isMuted(from, sender) &&
    !isGroupAdmins &&
    !info.key.fromMe
  ) {
    if (isBotGroupAdmins) {
      await conn.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: info.key.id,
          participant:
            info.key.participant ||
            info.key.participantAlt ||
            sender,
        },
      }).catch(() => {});
    }

    continue;
  }

  // AntiFlood no estilo Yuri: limita a frequência de COMANDOS.
  if (
    isCmd &&
    !isGroupAdmins &&
    !info.key.fromMe
  ) {
    const flood = checkCommandFlood(from, sender);

    if (flood.blocked) {
      await reply(
        `⏳ Calma aí! Aguarde *${flood.waitSeconds}s* antes de usar outro comando.`
      );
      continue;
    }
  }

  // AntiDelete / AntiEdit no mesmo tipo de evento usado pelo Yuri.
  const protocol =
    info.message?.protocolMessage ||
    info.message?.editedMessage?.message?.protocolMessage ||
    null;

  if (protocol) {
    const protection = getYuriProtection(from);
    const originalId = protocol?.key?.id;
    const cached = originalId
      ? conn.kobayashiGetCachedMessage?.(originalId)
      : null;

    if (
      protocol.type === 0 &&
      protection.antidel &&
      cached
    ) {
      await replayCachedMessage(
        conn,
        from,
        cached,
        "🗑️ *ANTI-DELETE*\nUma mensagem apagada foi recuperada.",
        protocol?.key?.participant || null
      ).catch(() => {});
      continue;
    }

    if (
      protocol.type === 14 &&
      protection.antiedit &&
      cached
    ) {
      await replayCachedMessage(
        conn,
        from,
        cached,
        "✏️ *ANTI-EDIT*\nMensagem original antes da edição:",
        protocol?.key?.participant || null
      ).catch(() => {});
      // Não damos continue: a edição atual ainda pode seguir normalmente.
    }
  }
}

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



// ─── KOBAYASHI AUTOMOD • PROTEÇÃO DE LINKS + AUDITORIA v0.3.11 ───
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
    const auditPreview = auditMessagePreview(info, body, type);
    const messageId = info?.key?.id || "não disponível";

    // Responde diretamente à mensagem proibida ANTES de apagar/banir.
    // Assim o aviso fica visualmente ligado ao link que acionou o AntiLink.
    await conn.sendMessage(from, {
      text:
        action === "light"
          ? `⚠️🌸 *Link proibido detectado.*\n@${sender.split("@")[0]}, esse tipo de link não é permitido aqui.`
          : `🚫🐉 *PROIBIDO LINKS AQUI!*\n@${sender.split("@")[0]} será removido por enviar link proibido.`,
      mentions: [sender]
    }, { quoted: info }).catch((e) => {
      console.error("Erro ao responder mensagem do AntiLink:", e?.message || e);
    });

    await delay(700);
    await deleteDetectedMessage(conn, from, info);

    let actionResult = "Mensagem removida";

    if (action === "light") {
      const result = await addAutomaticWarning(
        conn,
        from,
        sender,
        reason,
        isBotGroupAdmins,
        info
      );

      actionResult = result.removed
        ? `Mensagem removida • 3/3 ADVs • membro removido`
        : `Mensagem removida • ADV ${result.count}/3`;

      if (!result.removed) {
        await conn.sendMessage(from, {
          text:
            `⚠️🌸 *ANTILINK LIGHT*\n\n` +
            `👤 @${sender.split("@")[0]}\n` +
            `🗑️ Link apagado.\n` +
            `⚠️ Advertências: *${result.count}/3*`,
          mentions: [sender]
        }).catch(() => {});
      }

      await notifyOwnerAntiLink(conn, dono, {
        sender,
        senderLid,
        groupName,
        groupJid: from,
        messageId,
        messageText: auditPreview,
        actionResult
      });
    } else {
      let removed = false;

      if (isBotGroupAdmins) {
        try {
          await conn.groupParticipantsUpdate(from, [sender], "remove");
          removed = true;
        } catch (e) {
          console.error("Erro ao remover usuário pelo AntiLink:", e?.message || e);
        }
      }

      actionResult = isBotGroupAdmins
        ? (removed
            ? "Mensagem removida • membro removido"
            : "Mensagem removida • falha ao remover membro")
        : "Mensagem removida • bot sem ADM para remover membro";

      await notifyOwnerAntiLink(conn, dono, {
        sender,
        senderLid,
        groupName,
        groupJid: from,
        messageId,
        messageText: auditPreview,
        actionResult
      });
    }

    // Também registra no histórico administrativo interno.
    addAdminLog(from, {
      type: "antilink",
      actor: botNumber,
      target: sender,
      detail:
        `${reason} • ID ${messageId} • ${actionResult} • ` +
        `Mensagem: ${auditPreview.slice(0, 300)}`
    });

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
  const modularPermissions = createPermissions({
    sender,
    isGroup,
    groupAdmins: Array.isArray(groupAdmins) ? groupAdmins : [],
    isMainOwner: SoDonoPrincipal,
    isLeader: SoLider,
    isPremium: false,
  });

  let modularVersion = "desconhecida";
  try {
    modularVersion = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "version.json"),
        "utf8"
      )
    )?.version || modularVersion;
  } catch {}

  let modularGroupsCount = "?";
  try {
    const groups = await conn.groupFetchAllParticipating();
    modularGroupsCount = Object.keys(groups || {}).length;
  } catch {}

  const switchCommandNames = new Set(
    [...jsCommandSource.matchAll(/case\s+"([^"]+)":/g)]
      .map((m) => m[1])
  );

  const modularCatalog = getCommandHelpCatalog();
  const modularCommandNames = new Set(
    modularCatalog.flatMap((item) => [item.name, ...(item.aliases || [])])
  );

  const modularHandled = await runModularCommand(command, {
    conn,
    info,
    from,
    sender,
    command,
    args,
    q,
    prefix,
    reply,
    reagir,
    isGroup,
    isBotGroupAdmins,
    groupName,
    groupMembers,
    groupAdmins: Array.isArray(groupAdmins) ? groupAdmins : [],
    permissions: modularPermissions,
    permissionName: permissionName(modularPermissions.level),
    version: modularVersion,
    groupsCount: modularGroupsCount,
    commandCount: new Set([...switchCommandNames, ...modularCommandNames]).size,
    getGroupProtection,
    isFunModeEnabled,
  });

  if (modularHandled) {
    continue;
  }

switch (command) {

// ==========================================
// 🏷️🐉 KOBAYASHI RENTAL SYSTEM • v0.8.5
// Inspirado no fluxo de aluguel/ativação do Hutao,
// refeito para a arquitetura e banco do Kobayashi.
// ==========================================
case "planos":
case "plans": {
  const plans = listRentalPlans();
  const caption =
    `╭━━〔 🏷️🐉 *KOBAYASHI • PLANOS* 〕━━╮\n` +
    plans.map((p) => `┃ *${p.id}.* ${p.name}\n┃ 📅 ${p.days} dias • 💰 R$ ${p.price.toFixed(2).replace(".", ",")}\n┃ 🤝 Parceria: +${p.partnerBonusDays} dias`).join("\n┃\n") +
    `\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `🔎 Veja um plano: *${prefix}plano 1* até *${prefix}plano 4*\n` +
    `📩 *Contato do dono:* https://wa.me/5515997075304\n` +
    `💬 Escolha um plano para receber o link já com o plano selecionado.`;
  try {
    const planImage = fs.readFileSync(new URL("./assets/kobayashi-planos.png", import.meta.url));
    await conn.sendMessage(from, { image: planImage, caption }, { quoted: info });
    return;
  } catch {
    return reply(caption);
  }
}
break;

case "plano": {
  const plan = getRentalPlan(args[0]);
  if (!plan) return reply(`📦 Use *${prefix}plano 1*, *2*, *3* ou *4*.`);
  return reply(
    `╭━━〔 🐉 *${plan.name.toUpperCase()}* 〕━━╮\n` +
    `┃ 📅 Duração: *${plan.days} dias*\n` +
    `┃ 💰 Valor: *R$ ${plan.price.toFixed(2).replace(".", ",")}*\n` +
    `┃ 🤝 Com parceria: *+${plan.partnerBonusDays} dias grátis*\n` +
    `┃ 🎁 Total com parceria: *${plan.days + plan.partnerBonusDays} dias*\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `📩 *CONTRATAR ESTE PLANO*\n` +
    `🔗 https://wa.me/5515997075304?text=${encodeURIComponent(`Olá! Quero contratar o Plano ${plan.id} - ${plan.name} do Kobayashi Bot (${plan.days} dias por R$ ${plan.price.toFixed(2).replace(".", ",")}).`)}\n\n` +
    `👑 Dono: https://wa.me/5515997075304\n` +
    `📦 Plano selecionado: *Plano ${plan.id} - ${plan.name}*`
  );
}
break;

case "aluguel": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode gerenciar aluguéis.");
  const action = String(args[0] || "").toLowerCase();
  if (!['on','off'].includes(action)) {
    const cfg = getRentalSettings();
    return reply(
      `🏷️🐉 *ALUGUEL 2.0*\n\n` +
      `🔒 Restrição por grupo: *${cfg.groupRestrictionEnabled ? "ON ✅" : "OFF ❌"}*\n` +
      `🌐 Restrição global: *${cfg.globalRestrictionEnabled ? "ON ✅" : "OFF ❌"}*\n` +
      `⚠️ Avisos automáticos: *${cfg.warningsEnabled ? "ON ✅" : "OFF ❌"}*\n\n` +
      `Use *${prefix}aluguel on/off*.`
    );
  }
  const cfg = setRentalRestriction("group", action === "on");
  return reply(`🏷️ Restrição de aluguel nos grupos *${cfg.groupRestrictionEnabled ? "ATIVADA ✅" : "DESATIVADA ❌"}*.`);
}
break;

case "aluguel_global": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode gerenciar aluguéis.");
  const action = String(args[0] || "").toLowerCase();
  if (!['on','off'].includes(action)) return reply(`Use: *${prefix}aluguel_global on* ou *off*`);
  const cfg = setRentalRestriction("global", action === "on");
  return reply(`🌐🐉 Restrição global *${cfg.globalRestrictionEnabled ? "ATIVADA ✅" : "DESATIVADA ❌"}*.`);
}
break;

case "aluguel_avisos": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode gerenciar aluguéis.");
  const action = String(args[0] || "").toLowerCase();
  if (!['on','off'].includes(action)) return reply(`Use: *${prefix}aluguel_avisos on* ou *off*`);
  const cfg = setRentalWarnings(action === "on");
  return reply(`⚠️ Avisos automáticos de vencimento *${cfg.warningsEnabled ? "ATIVADOS ✅" : "DESATIVADOS ❌"}*.`);
}
break;

case "registrar_aluguel":
case "rg_aluguel": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode gerenciar aluguéis.");
  let targetJid = isGroup ? from : null;
  let planArg = args[0];
  const possibleJid = normalizeGroupJid(args[0]);
  if (possibleJid) { targetJid = possibleJid; planArg = args[1]; }
  if (!targetJid) return reply(`Use: *${prefix}registrar_aluguel ID_DO_GRUPO 1*`);
  const plan = getRentalPlan(planArg);
  if (!plan) return reply(`📦 Informe o plano 1, 2, 3 ou 4. Ex.: *${prefix}registrar_aluguel ${targetJid} 1*`);
  let targetName = targetJid === from ? groupName : targetJid;
  try { targetName = (await conn.groupMetadata(targetJid))?.subject || targetName; } catch {}
  const rental = registerRentalByPlan(targetJid, targetName, plan.id, sender);
  return reply(
    `✅🐉 *ALUGUEL REGISTRADO*\n\n` +
    `🏷️ Grupo: *${targetName}*\n🆔 ${targetJid}\n` +
    `📦 ${formatPlan(plan)}\n` +
    `📅 Início: *${formatRentalDate(rental.rentedAt)}*\n` +
    `⌛ Expira: *${formatRentalDate(rental.expiresAt)}*`
  );
}
break;

case "aluguel_parceria": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode registrar aluguel de parceria.");
  const targetJid = normalizeGroupJid(args[0]);
  const plan = getRentalPlan(args[1]);
  if (!targetJid || !plan) {
    return reply(
      `🤝🐉 *ALUGUEL COM PARCERIA*\n\n` +
      `Use: *${prefix}aluguel_parceria ID_DO_GRUPO PLANO*\n` +
      `Ex.: *${prefix}aluguel_parceria 120363000000000000@g.us 1*\n\n` +
      `🎁 Bônus: plano 1 +5d • plano 2 +7d • plano 3 +10d • plano 4 +15d`
    );
  }
  let targetName = targetJid;
  try { targetName = (await conn.groupMetadata(targetJid))?.subject || targetJid; } catch {}
  const rental = registerPartnerRental(targetJid, targetName, plan.id, sender);
  return reply(
    `🤝✅ *ALUGUEL DE PARCERIA REGISTRADO*\n\n` +
    `🏷️ Grupo: *${targetName}*\n🆔 ${targetJid}\n` +
    `📦 ${plan.name}\n💰 R$ ${plan.price.toFixed(2).replace(".", ",")}\n` +
    `📅 Base: *${plan.days} dias*\n🎁 Bônus parceria: *+${plan.partnerBonusDays} dias*\n` +
    `🔥 Total liberado: *${plan.days + plan.partnerBonusDays} dias*\n` +
    `⌛ Expira: *${formatRentalDate(rental.expiresAt)}*`
  );
}
break;

case "aluguel_teste":
case "aluguel_gratis": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode liberar período grátis.");
  let targetJid = normalizeGroupJid(args[0]);
  let days = Number(args[1] || 3);
  if (!targetJid && isGroup) { targetJid = from; days = Number(args[0] || 3); }
  if (!targetJid) return reply(`Use: *${prefix}aluguel_teste ID_DO_GRUPO 3*`);
  let targetName = targetJid === from ? groupName : targetJid;
  try { targetName = (await conn.groupMetadata(targetJid))?.subject || targetName; } catch {}
  const rental = registerTrialRental(targetJid, targetName, days, sender);
  return reply(`🎁🐉 Período grátis ativado para *${targetName}*.\n⏳ ${formatRentalDuration(rental.expiresAt - Date.now())}\n⌛ ${formatRentalDate(rental.expiresAt)}`);
}
break;

case "renovar_aluguel":
case "renovar_alugel": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode renovar aluguéis.");
  let targetJid = isGroup ? from : null;
  let planArg = args[0];
  const possibleJid = normalizeGroupJid(args[0]);
  if (possibleJid) { targetJid = possibleJid; planArg = args[1]; }
  if (!targetJid) return reply(`Use: *${prefix}renovar_aluguel ID_DO_GRUPO 1*`);
  const plan = getRentalPlan(planArg);
  if (!plan) return reply(`📦 Informe o plano 1, 2, 3 ou 4.`);
  const current = getRental(targetJid);
  if (current.permanent) return reply("♾️ Este grupo possui aluguel permanente.");
  let targetName = current.rental?.groupName || targetJid;
  try { targetName = (await conn.groupMetadata(targetJid))?.subject || targetName; } catch {}
  const result = renewRentalByPlan(targetJid, targetName, plan.id, sender, { partner: Boolean(current.rental?.partner) });
  return reply(
    `♻️🐉 *ALUGUEL RENOVADO*\n\n🏷️ ${targetName}\n📦 ${plan.name}` +
    `${result.rental.partner ? ` + ${plan.partnerBonusDays}d parceria` : ""}\n` +
    `⏳ Restante: *${formatRentalDuration(result.rental.expiresAt - Date.now())}*\n⌛ Nova expiração: *${formatRentalDate(result.rental.expiresAt)}*`
  );
}
break;

case "rm_aluguel":
case "remover_aluguel": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode remover aluguéis.");
  const targetJid = normalizeGroupJid(args[0]) || (isGroup ? from : null);
  if (!targetJid) return reply(`Use: *${prefix}rm_aluguel ID_DO_GRUPO*`);
  const state = getRental(targetJid);
  if (!state.exists) return reply("🌸 Esse grupo não possui aluguel registrado.");
  removeRental(targetJid);
  return reply(`🗑️🐉 Aluguel removido de *${state.rental?.groupName || targetJid}*.`);
}
break;

case "ver_aluguel":
case "ver_alugel":
case "aluguel_info": {
  const requested = SoDonoPrincipal ? normalizeGroupJid(args[0]) : null;
  const targetJid = requested || (isGroup ? from : null);
  if (!targetJid) return reply(`Use: *${prefix}ver_aluguel ID_DO_GRUPO*`);
  const state = getRental(targetJid);
  if (!state.exists) return reply(`🐉 *DADOS DO ALUGUEL*\n\n🆔 ${targetJid}\n📦 Status: *Não registrado ❌*`);
  const r = state.rental;
  const status = state.permanent ? "Permanente ♾️" : state.active ? "Ativo ✅" : "Expirado ❌";
  const remaining = state.permanent ? "Ilimitado ♾️" : formatRentalDuration(Number(r.expiresAt || 0) - Date.now());
  return reply(
    `╭━━〔 🏷️ *DADOS DO ALUGUEL* 〕━━╮\n` +
    `┃ 🏷️ Grupo: *${r.groupName || targetJid}*\n┃ 🆔 ${targetJid}\n` +
    `┃ 📦 Status: *${status}*\n┃ 🎟️ Plano: *${r.planName || (r.trial ? "Período grátis" : "Personalizado")}*\n` +
    `┃ 🤝 Parceria: *${r.partner ? `Sim (+${r.bonusDays || 0}d)` : "Não"}*\n` +
    `┃ ⏳ Restante: *${remaining}*\n` +
    `${state.permanent ? "┃ ♾️ Expiração: *Sem limite*\n" : `┃ ⌛ Expira: *${formatRentalDate(r.expiresAt)}*\n`}` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
  );
}
break;

case "lista_aluguel":
case "lista_alugel": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode listar aluguéis.");
  const rentals = listRentals();
  if (!rentals.length) return reply("🐉 Ainda não há grupos registrados no sistema de aluguel.");
  const active = rentals.filter((x) => x.active);
  const expired = rentals.filter((x) => !x.active);
  const partners = rentals.filter((x) => x.partner && x.active);
  const lines = rentals.slice(0, 50).map((item, i) => {
    const status = item.permanent ? "♾️" : item.active ? "✅" : "❌";
    const time = item.permanent ? "Permanente" : item.active ? formatRentalDuration(item.remainingMs) : "Expirado";
    return `${i + 1}. ${status} *${item.groupName || "Grupo"}*${item.partner ? " 🤝" : ""}\n   🆔 ${item.groupJid}\n   🎟️ ${item.planName || (item.trial ? "Grátis" : "Personalizado")} • ⏳ ${time}`;
  }).join("\n\n");
  return reply(
    `╭━━〔 📋 *ALUGUÉIS 2.0* 〕━━╮\n┃ ✅ Ativos: *${active.length}*\n┃ 🤝 Parcerias: *${partners.length}*\n┃ ❌ Expirados: *${expired.length}*\n┃ 📦 Total: *${rentals.length}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n${lines}`
  );
}
break;

case "aluguel_permanente":
case "alugel_permanente": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode gerenciar aluguéis.");
  const targetJid = normalizeGroupJid(args[0]) || (isGroup ? from : null);
  if (!targetJid) return reply(`Use: *${prefix}aluguel_permanente ID_DO_GRUPO*`);
  let targetName = targetJid === from ? groupName : targetJid;
  try { targetName = (await conn.groupMetadata(targetJid))?.subject || targetName; } catch {}
  const rental = setPermanentRental(targetJid, targetName, sender);
  return reply(`♾️🐉 *ALUGUEL PERMANENTE ATIVADO*\n\n🏷️ ${targetName}\n🆔 ${targetJid}\n📅 ${formatRentalDate(rental.permanentSince || rental.rentedAt)}`);
}
break;


case "listanegrag":
case "blacklistg":
case "listanegraglobal": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o dono principal pode gerenciar a lista negra global.");
  }

  // Sem número: lista os usuários atualmente bloqueados.
  if (!args.length) {
    const entries = listGlobalBlacklist();

    if (!entries.length) {
      return reply(
        `╭━━〔 🖤 *LISTA NEGRA GLOBAL* 〕━━╮\n` +
        `┃ 📦 Total: *0*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `Nenhum usuário está bloqueado globalmente.\n\n` +
        `➕ *${prefix}listanegrag +55 21 98093-7319*\n` +
        `➖ *${prefix}rmlistanegrag +55 21 98093-7319*`
      );
    }

    const lines = entries.slice(0, 100).map((entry, i) =>
      `${i + 1}. @${entry.jid.split("@")[0]}`
    ).join("\n");

    return conn.sendMessage(from, {
      text:
        `╭━━〔 🖤 *LISTA NEGRA GLOBAL* 〕━━╮\n` +
        `┃ 📦 Total: *${entries.length}*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n${lines}`,
      mentions: entries.slice(0, 100).map((entry) => entry.jid)
    }, { quoted: info });
  }

  // Junta todos os argumentos para aceitar:
  // /listanegrag +55 21 98093-7319
  const rawNumber = args.join(" ");
  const target = normalizeBlacklistJid(rawNumber);

  if (!target) {
    return reply(
      `❌ Número inválido.\n\n` +
      `Use: *${prefix}listanegrag +55 21 98093-7319*`
    );
  }

  if (target === dono || isMainOwnerJid(target)) {
    return reply("🛡️ O dono principal não pode ser colocado na lista negra global.");
  }

  const existing = getGlobalBlacklistEntry(target);
  if (existing) {
    return conn.sendMessage(from, {
      text: `ℹ️ @${target.split("@")[0]} já está na lista negra global.`,
      mentions: [target]
    }, { quoted: info });
  }

  addGlobalBlacklist(target, {
    reason: "Adicionado manualmente pelo dono",
    by: sender
  });

  return conn.sendMessage(from, {
    text:
      `🖤🌐 *LISTA NEGRA GLOBAL*\n\n` +
      `👤 @${target.split("@")[0]} foi adicionado.\n` +
      `🚫 A Kobayashi passará a ignorar esse número em todos os grupos e no PV.`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "rmlistanegrag":
case "rmblacklistg":
case "removerlistanegrag": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o dono principal pode gerenciar a lista negra global.");
  }

  if (!args.length) {
    return reply(
      `Use: *${prefix}rmlistanegrag +55 21 98093-7319*`
    );
  }

  const rawNumber = args.join(" ");
  const target = normalizeBlacklistJid(rawNumber);

  if (!target) {
    return reply(
      `❌ Número inválido.\n\n` +
      `Use: *${prefix}rmlistanegrag +55 21 98093-7319*`
    );
  }

  const removed = removeGlobalBlacklist(target);

  return conn.sendMessage(from, {
    text: removed
      ? `✅ @${target.split("@")[0]} foi removido da lista negra global.`
      : `ℹ️ @${target.split("@")[0]} não estava na lista negra global.`,
    mentions: [target]
  }, { quoted: info });
}
break;

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

  addAdminLog(from, {
    type: mode.key,
    actor: sender,
    detail: enabled ? "Proteção ativada" : "Proteção desativada",
  });

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


case "rmparceriabv":
case "rmparceriabv":
case "removerparceriabv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const link = String(q || "").trim();

  if (!link) {
    return reply(
      `🌸 *REMOVER PARCERIA DO BEM-VINDO*\n\n` +
      `Envie o link que deseja remover:\n\n` +
      `*${prefix}rmparceriabv https://exemplo.com/parceria*\n\n` +
      `🐉 A Kobayashi remove somente a parceria que contém esse link.`
    );
  }

  const result = removePartnerLink(from, link);

  if (!result.removed) {
    return reply(
      `⚠️ Não encontrei esse link nas parcerias cadastradas do Welcome.`
    );
  }

  return reply(
    `✅🤝 *Parceria removida do Welcome!*\n\n` +
    `O link enviado foi retirado da lista de parcerias deste grupo.`
  );
}
break;

case "setparceriasbv":
case "parceriasbv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const novaParceria = String(q || "").trim();

  if (!novaParceria) {
    return reply(
      `🤝🌸 *ADICIONAR PARCERIA AO WELCOME*\n\n` +
      `Use:\n*${prefix}setparceriasbv Nome da parceria\\nhttps://link-da-parceria.com*\n\n` +
      `Você pode usar o comando várias vezes.\n` +
      `Cada nova parceria será adicionada sem apagar as anteriores.`
    );
  }

  const cfgAtual = getWelcomeConfig(from);

  let atuais = String(cfgAtual.partners || "").trim();

  // Remove o texto padrão antes de começar a lista real.
  if (
    !atuais ||
    atuais === "🌸 Nenhuma parceria configurada."
  ) {
    atuais = "";
  }

  // Evita cadastrar exatamente o mesmo bloco duas vezes.
  const blocosAtuais = atuais
    ? atuais.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
    : [];

  if (blocosAtuais.includes(novaParceria)) {
    return reply(
      "⚠️🤝 Essa parceria já está cadastrada no Welcome deste grupo."
    );
  }

  const atualizado = atuais
    ? `${atuais}\n\n${novaParceria}`
    : novaParceria;

  updateWelcomeConfig(
    from,
    { partners: atualizado }
  );

  const total = atualizado
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .length;

  return reply(
    `✅🤝 *Parceria adicionada!*\n\n` +
    `🧁 Jardim de Parcerias: *${total} cadastrada(s)*\n\n` +
    `🌸 As parcerias anteriores foram mantidas.\n` +
    `Para remover uma específica, use *${prefix}rmparceriabv link*.`
  );
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

    addAdminLog(from, {
      type: "add",
      actor: sender,
      detail: `${qtd} solicitação(ões) aprovada(s)`,
    });

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



case "rm_closegp":
case "rmclosegp": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const atual =
    readGroupScheduleDb()?.[from]?.close || null;

  if (!atual) {
    return reply(
      "🌸 Não existe nenhum horário de fechamento automático configurado neste grupo."
    );
  }

  updateGroupSchedule(
    from,
    { close: null }
  );

  return reply(
    `✅🔓 *Fechamento automático removido!*\n\n` +
    `O horário *${atual}* foi apagado e o grupo não será mais fechado automaticamente.`
  );
}
break;

case "rm_opengp":
case "rmopengp": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const atual =
    readGroupScheduleDb()?.[from]?.open || null;

  if (!atual) {
    return reply(
      "🌸 Não existe nenhum horário de abertura automática configurado neste grupo."
    );
  }

  updateGroupSchedule(
    from,
    { open: null }
  );

  return reply(
    `✅🔓 *Abertura automática removida!*\n\n` +
    `O horário *${atual}* foi apagado e o grupo não será mais aberto automaticamente.`
  );
}
break;

case "opengp": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const raw =
    String(args[0] || "").toLowerCase();

  if (["off","remover","remove","0"].includes(raw)) {
    updateGroupSchedule(
      from,
      { open: null }
    );

    return reply(
      "🔒🌸 Horário de abertura automática removido."
    );
  }

  const horario =
    normalizeClockTime(args[0]);

  if (!horario) {
    const atual =
      readGroupScheduleDb()?.[from]?.open || null;

    return reply(
      `🟢🌸 *ABERTURA AUTOMÁTICA*\n\n` +
      `Atual: ${atual ? `*${atual}*` : "não configurada"}\n\n` +
      `Use:\n*${prefix}opengp 08:00*\n\n` +
      `Para remover:\n*${prefix}opengp off*`
    );
  }

  updateGroupSchedule(
    from,
    { open: horario }
  );

  addAdminLog(from, {
    type: "opengp",
    actor: sender,
    detail: `Abertura programada para ${horario}`,
  });

  return reply(
    `✅🟢 Grupo programado para abrir todos os dias às *${horario}*.\n\n` +
    `🌸 Horário padrão: *America/Sao_Paulo*.`
  );
}
break;

case "closegp": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const raw =
    String(args[0] || "").toLowerCase();

  if (["off","remover","remove","0"].includes(raw)) {
    updateGroupSchedule(
      from,
      { close: null }
    );

    return reply(
      "🔓🌸 Horário de fechamento automático removido."
    );
  }

  const horario =
    normalizeClockTime(args[0]);

  if (!horario) {
    const atual =
      readGroupScheduleDb()?.[from]?.close || null;

    return reply(
      `🔒🐉 *FECHAMENTO AUTOMÁTICO*\n\n` +
      `Atual: ${atual ? `*${atual}*` : "não configurado"}\n\n` +
      `Use:\n*${prefix}closegp 23:00*\n\n` +
      `Para remover:\n*${prefix}closegp off*`
    );
  }

  updateGroupSchedule(
    from,
    { close: horario }
  );

  addAdminLog(from, {
    type: "closegp",
    actor: sender,
    detail: `Fechamento programado para ${horario}`,
  });

  return reply(
    `✅🔒 Grupo programado para fechar todos os dias às *${horario}*.\n\n` +
    `🌸 Horário padrão: *America/Sao_Paulo*.`
  );
}
break;

case "opengp_off": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  updateGroupSchedule(
    from,
    { open: null }
  );

  return reply(
    "🔒🌸 Horário de abertura automática removido."
  );
}
break;

case "linkgp":
case "linkgrupo": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) {
    return reply(
      "❌🐉 Eu preciso ser ADM para gerar o link do grupo."
    );
  }

  try {
    const code =
      await conn.groupInviteCode(from);

    const link =
      `https://chat.whatsapp.com/${code}`;

    return reply(
      `╭──────「 🔗 」──────╮\n` +
      `      *LINK DO GRUPO*\n` +
      `╰──────────────────╯\n\n` +
      `${link}\n\n` +
      `🌸 Compartilhe com responsabilidade.`
    );
  } catch (error) {
    console.error(
      "[LINKGP]",
      error?.message || error
    );

    return reply(
      "❌ Não consegui gerar o link do grupo."
    );
  }
}
break;

case "letra":
case "lyrics": {
  const busca =
    String(q || "").trim();

  if (!busca) {
    return reply(
      `🎵🌸 *LETRA DE MÚSICA*\n\n` +
      `Use:\n*${prefix}letra artista - música*\n\n` +
      `Exemplo:\n*${prefix}letra Linkin Park - Numb*`
    );
  }

  try {
    await reagir("🎵");

    let artista = "";
    let musica = "";

    if (busca.includes(" - ")) {
      const partes =
        busca.split(" - ");

      artista =
        partes.shift()?.trim() || "";

      musica =
        partes.join(" - ").trim();
    } else {
      // Sem separador, tenta usar o primeiro termo como artista.
      const partes =
        busca.split(/\s+/);

      artista =
        partes.shift() || "";

      musica =
        partes.join(" ");
    }

    if (!artista || !musica) {
      return reply(
        `🌸 Separe artista e música com " - ".\n\n` +
        `Ex.: *${prefix}letra Adele - Hello*`
      );
    }

    const url =
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(musica)}`;

    const response =
      await fetch(url);

    if (!response.ok) {
      return reply(
        "🌸 Não encontrei a letra dessa música."
      );
    }

    const data =
      await response.json();

    const letra =
      String(data?.lyrics || "").trim();

    if (!letra) {
      return reply(
        "🌸 Não encontrei a letra dessa música."
      );
    }

    const maxChars = 3500;

    if (letra.length <= maxChars) {
      return reply(
        `╭──────「 🎵 」──────╮\n` +
        `        *LETRA*\n` +
        `╰──────────────────╯\n\n` +
        `🎙️ *${artista}*\n` +
        `🎶 *${musica}*\n\n` +
        `${letra}\n\n` +
        `🌸 Kobayashi Bot`
      );
    }

    const partes = [];
    for (
      let i = 0;
      i < letra.length;
      i += maxChars
    ) {
      partes.push(
        letra.slice(
          i,
          i + maxChars
        )
      );
    }

    for (
      let i = 0;
      i < partes.length;
      i++
    ) {
      await conn.sendMessage(
        from,
        {
          text:
            `${i === 0
              ? `🎙️ *${artista}*\n🎶 *${musica}*\n\n`
              : ""
            }${partes[i]}\n\n` +
            `🌸 Parte ${i+1}/${partes.length}`
        },
        { quoted: info }
      );
    }

    return;

  } catch (error) {
    console.error(
      "[LETRA]",
      error?.message || error
    );

    return reply(
      "❌🌸 Não consegui buscar a letra agora."
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
    return reply(
      `╭━━━⊱ 🎞️ *CONVERTER* 🎞️ ⊱━━━╮\n` +
      `│\n` +
      `│ ❌ Marque uma figurinha animada\n` +
      `│    para converter em GIF!\n` +
      `│\n` +
      `│ 💡 Responda uma figurinha com:\n` +
      `│ ${prefix}togif\n` +
      `│\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  }

  const tmpId = randomBytes(6).toString("hex");
  const togifTempDir = path.join(os.tmpdir(), `koba-temp_togif_${tmpId}`);
  const inputWebp = path.join(togifTempDir, "input.webp");
  const outputGif = path.join(togifTempDir, "output.gif");
  const outputMp4 = path.join(togifTempDir, "output.mp4");

  try {
    fsx.mkdirSync(togifTempDir, { recursive: true });

    const stickerBuffer = await downloadMediaMessage(target, "buffer", {});
    if (!stickerBuffer?.length) throw new Error("buffer da figurinha vazio");

    fsx.writeFileSync(inputWebp, stickerBuffer);

    // Mesmo fluxo usado pelo Nazuna:
    // WebP animado -> GIF via Sharp -> MP4 com gifPlayback via FFmpeg.
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default || sharpModule;

    await sharp(stickerBuffer, { animated: true })
      .gif({
        loop: 0,
        effort: 3
      })
      .toFile(outputGif);

    await new Promise((resolve, reject) => {
      ffmpeg(outputGif)
        .outputOptions([
          "-movflags faststart",
          "-pix_fmt yuv420p",
          "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"
        ])
        .toFormat("mp4")
        .on("end", resolve)
        .on("error", reject)
        .save(outputMp4);
    });

    return conn.sendMessage(from, {
      video: fsx.readFileSync(outputMp4),
      gifPlayback: true,
      mimetype: "video/mp4",
      fileName: "sticker.gif"
    }, {
      quoted: info
    });
  } catch (error) {
    console.error("Erro /togif:", error?.message || error);
    return reply("❌ Erro ao converter a figurinha animada.");
  } finally {
    try {
      fsx.rmSync(togifTempDir, {
        recursive: true,
        force: true
      });
    } catch {}
  }
}
break;

case "rename": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "stickerMessage" ? info : null);

  if (!target?.message || getContentType(target.message) !== "stickerMessage") {
    return reply(
      `🎴 Responda a uma figurinha com:\n\n` +
      `*${prefix}rename Seu nome | Nome do pacote*\n\n` +
      `Ex.: *${prefix}rename ${pushname || "Oni-chan"} | Minha coleção*`
    );
  }

  const parts = String(q || "").split("|").map((x) => x.trim()).filter(Boolean);
  if (parts.length < 2) {
    return reply(
      `🌸 Use assim:\n*${prefix}rename Seu nome | Nome do pacote*\n\n` +
      `O primeiro campo vira o autor e o segundo vira o pacote.`
    );
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "buffer", {});
    const authorName = parts[0].slice(0, 60);
    const packName = parts.slice(1).join(" | ").slice(0, 80);
    const result = await applyStickerMetadata(stickerBuffer, {
      userNick: authorName,
      packName: `🐉 ${packName}`,
      publisher: `🌸 ${authorName} • Kobayashi Bot`,
      packId: "kobayashi-rename",
      emojis: ["🐉", "🌸", "✨"]
    });
    return conn.sendMessage(from, { sticker: result }, { quoted: info });
  } catch (e) {
    console.error("Erro /rename:", e);
    return reply("❌ Não consegui renomear essa figurinha.");
  }
}
break;

case "roubar":
case "steal": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "stickerMessage" ? info : null);

  if (!target?.message || getContentType(target.message) !== "stickerMessage") {
    return reply(`🎴 Responda a uma figurinha com *${prefix}roubar*.`);
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "buffer", {});
    const authorName = String(pushname || sender.split("@")[0]).trim().slice(0, 60);
    const result = await applyStickerMetadata(stickerBuffer, {
      userNick: authorName,
      packName: "🐉 Kobayashi • Minha Coleção",
      publisher: `🌸 ${authorName}`,
      packId: "kobayashi-roubar",
      emojis: ["🐉", "🌸", "💜"]
    });
    return conn.sendMessage(from, { sticker: result }, { quoted: info });
  } catch (e) {
    console.error("Erro /roubar:", e);
    return reply("❌ Não consegui pegar essa figurinha agora.");
  }
}
break;

case "take": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "stickerMessage" ? info : null);

  if (!target?.message || getContentType(target.message) !== "stickerMessage") {
    return reply(
      `🎐 O *${prefix}take* antigo continua disponível.\n` +
      `Responda a uma figurinha com *${prefix}take Pacote | Autor*.\n\n` +
      `✨ Novo formato recomendado: *${prefix}rename Autor | Pacote*.`
    );
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "buffer", {});
    const parts = String(q || "").split("|").map((x) => x.trim());
    const packName = parts[0] || "Kobayashi Pack";
    const authorName = parts[1] || pushname || sender.split("@")[0];
    const result = await applyStickerMetadata(stickerBuffer, {
      userNick: authorName,
      packName: `🐉 ${packName}`,
      publisher: `🌸 ${authorName} • Kobayashi Bot`,
      packId: "kobayashi-take",
      emojis: ["🐉", "🌸"]
    });
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

  const db = listStickerMappedCommands();
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


case "helpcmd":
case "ajudacmd": {
  const selected = String(args?.[0] || q || "").trim();
  if (!selected) {
    return reply(
      `┏╾❀╼━━〔 🔎 *𝑯𝑬𝑳𝑷 𝑪𝑴𝑫* 🔎 〕━━╾❀╼┓\n` +
      `┃╎ ୨୧ *${prefix}helpcmd comando*\n` +
      `┃╎ ୨୧ Ex.: *${prefix}helpcmd play*\n` +
      `┗╾🌸╼━━━━━━━━━━━━━━━━╾🌸╼┛`
    );
  }

  const help = getCommandHelp(selected, prefix);
  if (!help?.found) {
    return reply(
      `╭╾ׁ═╼･ﾟ♡ﾟ･｡🔎｡･ﾟ♡ﾟ･╾ׁ═╼╮\n` +
      `┃ ୨୧ Não encontrei ajuda para *${selected.replace(/^[/!+.#-]+/, "")}*\n` +
      `┃ ୨୧ Tente: *${prefix}helpcmd play*\n` +
      `╰╾ׁ═╼･ﾟ♡ﾟ･｡🌸｡･ﾟ♡ﾟ･╾ׁ═╼╯`
    );
  }

  return reply(
    `┏╾❀╼━━〔 🔎 *𝑨𝑱𝑼𝑫𝑨 𝑫𝑨 𝑲𝑶𝑩𝑨𝒀𝑨𝑺𝑯𝑰* 〕━━╾❀╼┓\n` +
    `┃╎ ୨୧ 🐉 *${prefix}${help.command}*\n` +
    `┃╎\n` +
    `┃╎ 🌸 O comando *${prefix}${help.command}* ${help.description}\n` +
    `┗╾🌸╼━━━━━━━━━━━━━━━━━━━━╾🌸╼┛`
  );
}
break;

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
        `🎧🌸 *PLAY NÃO CONFIGURADO*\n\n` +
        `O serviço de música ainda não foi configurado pelo dono do bot.\n\n` +
        `👑 Dono: use *${prefix}yutatoken TOKEN* para ativar o Play.`
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
        `🌸 Preparando seu áudio...`
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
    console.error("[PLAY] Erro ao preparar áudio:", e);
    const errorText = String(e?.message || e || "");

    if (/401|403|token|authorization|unauthorized/i.test(errorText)) {
      return reply("🔑❌ O serviço de música recusou a configuração atual. O dono precisa atualizar o token do Play.");
    }

    return reply(
      `❌🌸 Não consegui preparar essa música agora. Tente novamente em alguns instantes.`
    );
  }
}
break;


case "statusbot":
case "diagnostico":
case "diagnóstico": {
  const startedAt = Number(global.startTime || 0);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const uptimeSeconds = startedAt > 0
    ? Math.max(0, nowSeconds - startedAt)
    : Math.floor(process.uptime());

  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  const uptimeText = [
    days ? `${days}d` : null,
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    `${seconds}s`
  ].filter(Boolean).join(" ");

  const memory = process.memoryUsage();
  const toMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  let version = "desconhecida";
  try {
    const versionFile = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "version.json"),
        "utf8"
      )
    );
    version = versionFile?.version || version;
  } catch {}

  let groupsCount = "?";
  try {
    const groups = await conn.groupFetchAllParticipating();
    groupsCount = Object.keys(groups || {}).length;
  } catch {}

  const startPing = Date.now();
  try {
    await conn.sendPresenceUpdate("available");
  } catch {}
  const pingMs = Date.now() - startPing;

  const commandMatches = [...jsCommandSource.matchAll(/case\s+"([^"]+)":/g)];
  const commandNames = new Set(commandMatches.map((m) => m[1]));

  const checks = [];

  // Welcome
  try {
    const welcomePath = path.join(
      process.cwd(),
      "files",
      "database",
      "boas-vindas.json"
    );
    checks.push(`🌸 Welcome: ${fs.existsSync(welcomePath) ? "✅ OK" : "⚪ sem banco"}`);
  } catch {
    checks.push("🌸 Welcome: ❌ erro");
  }

  // Horários
  try {
    const schedulePath = path.join(
      process.cwd(),
      "files",
      "database",
      "horarios-grupos.json"
    );
    checks.push(`⏰ Horários: ${fs.existsSync(schedulePath) ? "✅ OK" : "⚪ sem banco"}`);
  } catch {
    checks.push("⏰ Horários: ❌ erro");
  }

  // Lista branca
  try {
    const whitelistPath = path.join(
      process.cwd(),
      "files",
      "database",
      "lista-branca.json"
    );
    checks.push(`🤍 Lista Branca: ${fs.existsSync(whitelistPath) ? "✅ OK" : "⚪ sem banco"}`);
  } catch {
    checks.push("🤍 Lista Branca: ❌ erro");
  }

  // AutoSticker
  try {
    const autoStickerPath = path.join(
      process.cwd(),
      "files",
      "database",
      "autosticker.json"
    );
    checks.push(`🎨 AutoSticker: ${fs.existsSync(autoStickerPath) ? "✅ OK" : "⚪ sem banco"}`);
  } catch {
    checks.push("🎨 AutoSticker: ❌ erro");
  }

  // ADV
  try {
    const advPath = path.join(
      process.cwd(),
      "files",
      "database",
      "adv.json"
    );
    checks.push(`⚠️ ADV: ${fs.existsSync(advPath) ? "✅ OK" : "⚪ sem banco"}`);
  } catch {
    checks.push("⚠️ ADV: ❌ erro");
  }

  // Sticker Engine
  checks.push(
    `🎴 Sticker Engine: ${
      fs.existsSync(path.join(process.cwd(), "lib", "stickerEngine.js"))
        ? "✅ OK"
        : "❌ ausente"
    }`
  );

  const statusText =
    `╭══════ ❀ 🐉 ❀ ══════╮\n` +
    `     *STATUS DO BOT*\n` +
    `╰══════ ❀ 🌸 ❀ ══════╯\n\n` +
    `🤖 *Bot:* ${NomeDoBot}\n` +
    `💮 *Versão:* ${version}\n` +
    `🫧 *Ping:* ${pingMs} ms\n` +
    `⏱️ *Uptime:* ${uptimeText}\n` +
    `👥 *Grupos:* ${groupsCount}\n` +
    `🧩 *Comandos reconhecidos:* ${commandNames.size}\n\n` +
    `╭──〔 💾 MEMÓRIA 〕──────╮\n` +
    `│ RSS: ${toMB(memory.rss)}\n` +
    `│ Heap: ${toMB(memory.heapUsed)} / ${toMB(memory.heapTotal)}\n` +
    `│ External: ${toMB(memory.external)}\n` +
    `╰────── ❀ ─────────────╯\n\n` +
    `╭──〔 🛠️ SISTEMAS 〕─────╮\n` +
    `${checks.map((x) => `│ ${x}`).join("\n")}\n` +
    `╰────── ❀ ─────────────╯\n\n` +
    `🌸 Kobayashi Bot • Diagnóstico interno`;

  return reply(statusText);
}
break;


case "afk": {
  if (!isGroup) return reply("🐉🌸 O AFK funciona dentro dos grupos.");
  const reason = String(q || "").trim() || "Sem motivo informado";
  setAfk(sender, reason);
  return conn.sendMessage(from, {
    text:
      `💤 @${String(sender).split("@")[0]} agora está AFK.\n` +
      `📝 Motivo: *${reason}*\n\n` +
      `🌸 Eu aviso quem tentar chamar você.`,
    mentions: [sender]
  }, { quoted: info });
}
break;

case "nivel":
case "level":
case "xp": {
  if (!isGroup) return reply(mess.onlyGroup());

  const levelAction = String(args?.[0] || "").toLowerCase();
  if (["on", "off"].includes(levelAction)) {
    if (!isGroupAdmins) return reply(mess.onlyAdmins());
    const enabled = levelAction === "on";
    setLevelEnabled(from, enabled);
    return reply(
      enabled
        ? "🐉✨ *Dragon Level ativado!*\nAgora conversar e usar os comandos da Kobayashi rende XP neste grupo."
        : "🐉💤 *Dragon Level desativado.*\nAs mensagens continuam sendo contabilizadas, mas ninguém ganhará XP até um ADM usar /level on."
    );
  }

  const contextInfo =
    info?.message?.extendedTextMessage?.contextInfo ||
    info?.message?.imageMessage?.contextInfo ||
    info?.message?.videoMessage?.contextInfo || {};
  const target = contextInfo?.mentionedJid?.[0] || contextInfo?.participant || sender;
  const row = getUserActivity(from, target);
  const filled = Math.max(0, Math.min(10, Math.round(row.progress / 10)));
  const bar = "▰".repeat(filled) + "▱".repeat(10 - filled);
  return conn.sendMessage(from, {
    text:
      `╭━━〔 🐉 DRAGON LEVEL 〕━━╮\n` +
      `┃ 👤 @${String(target).split("@")[0]}\n` +
      `┃ 🏷️ ${row.title}\n` +
      `┃ ⚙️ Sistema: *${isLevelEnabled(from) ? "ATIVO ✅" : "DESATIVADO 💤"}*\n` +
      `┃ ⭐ Nível: *${row.level}*\n` +
      `┃ ✨ XP total: *${row.xp}*\n` +
      `┃ 💬 Textos: *${row.textMessages}*\n` +
      `┃ 🖼️ Fotos: *${row.images}*\n` +
      `┃ 🎨 Figurinhas: *${row.stickers}*\n` +
      (row.legacyMessages > 0 ? `┃ 📦 Registros anteriores: *${row.legacyMessages}*\n` : "") +
      `┃\n` +
      `┃ ${bar} *${row.progress}%*\n` +
            (row.level >= 50
        ? `┃ 👑 *Nível máximo alcançado!*\n`
        : `┃ 📈 ${row.currentXp}/${row.neededXp} XP para o próximo nível\n`) +
      `╰━━━━━━━━━━━━━━━━━━╯`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "categoriaslevel":
case "categoriasnivel":
case "classeslevel": {
  return reply(
    `╭━━〔 🐉 CATEGORIAS DRAGON LEVEL 〕━━╮\n` +
    `┃ 🥚 *Níveis 1–5*   • Ovo de Dragão\n` +
    `┃ 🐣 *Níveis 6–10*  • Filhote de Dragão\n` +
    `┃ 🌸 *Níveis 11–15* • Dragão Aprendiz\n` +
    `┃ 🐉 *Níveis 16–20* • Jovem Dragão\n` +
    `┃ ⚡ *Níveis 21–25* • Dragão Ascendente\n` +
    `┃ 🌙 *Níveis 26–30* • Dragão Lunar\n` +
    `┃ 🔥 *Níveis 31–35* • Dragão Carmesim\n` +
    `┃ 👑 *Níveis 36–40* • Dragão Imperial\n` +
    `┃ 🌌 *Níveis 41–45* • Dragão Cósmico\n` +
    `┃ 🌠 *Níveis 46–49* • Dragão Lendário\n` +
    `┃ 🐲 *Nível 50*      • Dragão Primordial\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `✨ O título muda automaticamente conforme você evolui.`
  );
}
break;

case "zeraranknivel": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode zerar o ranking de nível.");

  const result = resetGroupLevelRank(from);
  return reply(
    `🏆🐉 *TEMPORADA DE NÍVEL ENCERRADA!*\n\n` +
    `📍 Grupo: *${groupName || "Grupo"}*\n` +
    `👥 Rankings zerados: *${result.users}*\n` +
    `⭐ Todos começam novamente no nível 1 com 0 XP.\n\n` +
    `🌸 Uma nova temporada do Dragon Level começou!`
  );
}
break;

case "zeraranknivelg": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode zerar o ranking global de nível.");

  const result = resetGlobalLevelRank();
  return reply(
    `🌍🏆 *TEMPORADA GLOBAL ENCERRADA!*\n\n` +
    `🏘️ Grupos processados: *${result.groups}*\n` +
    `👥 Registros zerados: *${result.users}*\n` +
    `⭐ O Dragon Level global começou uma nova temporada.`
  );
}
break;

case "ranknivelg":
case "rankglobal":
case "rankxpg": {
  const top = getGlobalTopLevel(10);
  if (!top.length) {
    return reply(
      "🐉 Ainda não há XP suficiente nos grupos com o sistema de níveis ativado."
    );
  }

  // Conta somente grupos em que:
  // 1) o Level está ativo;
  // 2) a Kobayashi ainda participa;
  // 3) o usuário realmente é membro atualmente.
  let participatingGroups = {};
  try {
    participatingGroups = await conn.groupFetchAllParticipating();
  } catch (e) {
    console.error("Erro ao consultar grupos para o rank global:", e?.message || e);
  }

  const enabledGroups = Object.entries(participatingGroups || {})
    .filter(([groupJid]) => isLevelEnabled(groupJid));

  const countCurrentLevelGroups = (userJid) => {
    const userPN = normalizeJid(userJid);
    let count = 0;

    for (const [, metadata] of enabledGroups) {
      const members = Array.isArray(metadata?.participants) ? metadata.participants : [];
      const found = members.some((p) => {
        const ids = [p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid]
          .filter(Boolean);
        return ids.some((id) =>
          id === userJid ||
          normalizeJid(id) === userPN ||
          String(id).split("@")[0] === String(userJid).split("@")[0]
        );
      });
      if (found) count++;
    }
    return count;
  };

  const ranked = top
    .map((x) => ({ ...x, currentGroups: countCurrentLevelGroups(x.jid) }))
    .filter((x) => x.currentGroups > 0);

  if (!ranked.length) {
    return reply("🐉 Nenhum jogador do rank está atualmente em grupos com o sistema de níveis ativado.");
  }

  const medals = ["🥇", "🥈", "🥉"];
  const mentions = ranked.map((x) => x.jid);
  const rows = ranked.map((x, i) =>
    `${medals[i] || `#${i + 1}`} @${String(x.jid).split("@")[0]} — *Nv.${x.level}* • *Grupos: ${x.currentGroups}*`
  ).join("\n");

  return conn.sendMessage(from, {
    text:
      `╭━━〔 🌍 RANK GLOBAL DE NÍVEL 〕━━╮\n` +
      `┃ Apenas grupos atuais com Level ativo\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `${rows}\n\n` +
      `🐉 A quantidade considera somente grupos em que a pessoa ainda está e o sistema de nível está ativado.`,
    mentions
  }, { quoted: info });
}
break;

case "ranknivel":
case "toplevel":
case "rankxp": {
  if (!isGroup) return reply(mess.onlyGroup());
  const top = getTopLevel(from, 10);
  if (!top.length) return reply("🐉 Ainda não há XP registrado neste grupo.");
  const medals = ["🥇", "🥈", "🥉"];
  const mentions = top.map((x) => x.jid);
  const rows = top.map((x, i) =>
    `${medals[i] || `#${i + 1}`} @${String(x.jid).split("@")[0]} — *Nv.${x.level}* • ${x.xp} XP`
  ).join("\n");
  return conn.sendMessage(from, {
    text:
      `╭━━〔 🏆 RANK DE NÍVEIS 〕━━╮\n` +
      `┃ Os dragões que mais evoluíram\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `${rows}\n\n` +
      `✨ Conversar rende XP e usar a Kobayashi rende bônus maior. Spam não conta.`,
    mentions
  }, { quoted: info });
}
break;

case "sistemanivel":
case "nivelinfo": {
  return reply(
    `╭━━〔 🐲 SISTEMA DE NÍVEIS 〕━━╮\n` +
    `┃ 🎯 O sistema possui *50 níveis*.\n` +
    `┃ 🐉 São *10 categorias* + título especial no nível 50.\n` +
    `┃ ⭐ Do nível *1 ao 10*: 100 XP por nível.\n` +
    `┃ 📈 Após o nível 10, a exigência aumenta gradualmente.\n` +
    `┃ 💬 Conversas válidas rendem *5–12 XP*.\n` +
    `┃ 🤖 Usar a Kobayashi rende *14–18 XP*.\n` +
    `┃ ⏱️ Há cooldown entre ganhos para evitar farm.\n` +
    `┃ ♻️ Repetir a mesma mensagem/comando não dá XP.\n` +
    `┃ ⚙️ ADM: *${prefix}level on/off* ativa ou desativa por grupo.\n` +
    `┃ 🏆 Use *${prefix}ranknivel* para ver o Top 10 do grupo.\n` +
    `┃ 🌍 Use *${prefix}ranknivelg* para ver o Top 10 global.\n` +
    `┃ 🐉 Use *${prefix}nivel* para ver sua evolução.\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
  );
}
break;

case "rank":
case "topativos": {
  if (!isGroup) return reply(mess.onlyGroup());
  const top = getTopActivity(from, 10);
  if (!top.length) return reply("🌸 Ainda não tenho atividade suficiente registrada neste grupo.");
  const medals = ["🥇", "🥈", "🥉"];
  const mentions = top.map((x) => x.jid);
  const rows = top.map((x, i) =>
    `${medals[i] || `#${i + 1}`} @${String(x.jid).split("@")[0]} — ` +
    `💬 ${x.textMessages} • 🖼️ ${x.images} • 🎨 ${x.stickers} • 📊 ${x.messages}`
  ).join("\n");
  return conn.sendMessage(from, {
    text:
      `╭━━〔 🐉 RANK KOBAYASHI 〕━━╮\n` +
      `┃ 🌸 Os dragões mais ativos do grupo\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `${rows}\n\n` +
      `📊 Use *${prefix}atividade @membro* para consultar alguém.\n` +
      `📌 Contagem registrada desde a ativação do sistema.`,
    mentions
  }, { quoted: info });
}
break;

case "atividade":
case "checkme": {
  if (!isGroup) return reply(mess.onlyGroup());
  const contextInfo =
    info?.message?.extendedTextMessage?.contextInfo ||
    info?.message?.imageMessage?.contextInfo ||
    info?.message?.videoMessage?.contextInfo || {};
  const target = contextInfo?.mentionedJid?.[0] || contextInfo?.participant || sender;
  const row = getUserActivity(from, target);
  const top = getTopActivity(from, 1000);
  const position = top.findIndex((x) => x.jid === target) + 1;
  const last = row.lastSeen > 0
    ? new Date(row.lastSeen).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    : "sem registro";
  const rankName = row.title || "🥚 Ovo de Dragão";
  return conn.sendMessage(from, {
    text:
      `╭━━〔 📊 ATIVIDADE 〕━━╮\n` +
      `┃ 👤 @${String(target).split("@")[0]}\n` +
      `┃ 💬 Textos: *${row.textMessages}*\n` +
      `┃ 🖼️ Fotos: *${row.images}*\n` +
      `┃ 🎨 Figurinhas: *${row.stickers}*\n` +
      `┃ 📊 Total: *${row.messages}*\n` +
      (row.legacyMessages > 0 ? `┃ 📦 Registros anteriores: *${row.legacyMessages}*\n` : "") +
      `┃ 🏆 Posição: *${position > 0 ? `#${position}` : "sem ranking"}*\n` +
      `┃ 🐲 Classe: *${rankName}*\n` +
      `┃ ⭐ Nível: *${row.level}* • ${row.xp} XP\n` +
      `┃ 🕒 Última: *${last}*\n` +
      `╰━━━━━━━━━━━━━━━━╯`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "inativos": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const rawDays =
    Number(String(args?.[0] || "7").replace(/\D/g, "")) || 7;

  const days = Math.max(1, Math.min(90, rawDays));

  const botNumber = String(conn?.user?.id || "")
    .split(":")[0]
    .split("@")[0];

  const memberJids = (groupMembers || [])
    .map((p) => p?.id)
    .filter(Boolean)
    .filter((jid) => String(jid).split("@")[0] !== botNumber);

  const inactive = getInactive(
    from,
    memberJids,
    days
  ).slice(0, 50);

  if (!inactive.length) {
    return reply(
      `✅🌸 Não encontrei membros com histórico registrado que estejam sem atividade há *${days} dias*.\n\n` +
      `📌 A Kobayashi não considera como inativo quem ainda não possui histórico suficiente no sistema.`
    );
  }

  return conn.sendMessage(from, {
    text:
      `╭──────「 💤 」──────╮\n` +
      `       *INATIVOS*\n` +
      `╰──────────────────╯\n\n` +
      inactive
        .map((jid, i) =>
          `${i + 1}. @${String(jid).split("@")[0]}`
        )
        .join("\n") +
      `\n\n📅 Sem mensagens registradas há pelo menos *${days} dias*.\n` +
      `📌 Apenas membros com histórico conhecido entram nesta lista.`,
    mentions: inactive
  }, { quoted: info });
}
break;


case "antitrava": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!action || action === "status" || action === "ver") {
    return reply(formatAntiTravaStatus(getAntiTravaConfig(from)) + `\n\nUse *${prefix}antitrava on* ou *${prefix}antitrava off*.`);
  }
  if (!["on", "off"].includes(action)) return reply(`🛡️ Use *${prefix}antitrava on* ou *${prefix}antitrava off*.`);
  const cfg = updateAntiTravaConfig(from, { enabled: action === "on" });
  return reply(formatAntiTravaStatus(cfg));
}
break;

case "antimencao":
case "antimencao": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "off"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`👥 *ANTI-MENÇÃO*\nStatus: *${cfg.antiMention ? "ON ✅" : "OFF ❌"}*\nLimite: *${cfg.mentionLimit}*\n\nUse *${prefix}antimencao on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { antiMention: action === "on" });
  return reply(`👥 Anti-menção *${cfg.antiMention ? "ativado ✅" : "desativado ❌"}*.\nLimite atual: *${cfg.mentionLimit}* menções.`);
}
break;

case "limitemencao":
case "limitemencoes": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = Number(args[0]);
  if (!Number.isInteger(value) || value < 2 || value > 100) return reply(`👥 Informe um limite entre *2 e 100*.\nEx.: *${prefix}limitemencao 10*`);
  updateAntiTravaConfig(from, { mentionLimit: value });
  return reply(`✅ Limite de menções definido para *${value}* por mensagem.`);
}
break;

case "antitextao":
case "antitexto": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "off"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`📝 *ANTI-TEXTÃO*\nStatus: *${cfg.antiLongText ? "ON ✅" : "OFF ❌"}*\nLimite: *${cfg.textLimit}* caracteres.\n\nUse *${prefix}antitextao on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { antiLongText: action === "on" });
  return reply(`📝 Anti-textão *${cfg.antiLongText ? "ativado ✅" : "desativado ❌"}*.\nLimite atual: *${cfg.textLimit}* caracteres.`);
}
break;

case "limitetexto": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = Number(args[0]);
  if (!Number.isInteger(value) || value < 500 || value > 50000) return reply(`📝 Informe um limite entre *500 e 50000* caracteres.\nEx.: *${prefix}limitetexto 4000*`);
  updateAntiTravaConfig(from, { textLimit: value });
  return reply(`✅ Limite de texto definido para *${value} caracteres*.`);
}
break;

case "antifloodmsg":
case "antifloodmensagem": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "off"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`🌊 *ANTI-FLOOD DE MENSAGENS*\nStatus: *${cfg.antiFloodMessage ? "ON ✅" : "OFF ❌"}*\nLimite: *${cfg.floodLimit} mensagens/${cfg.floodWindowSeconds}s*.\n\nUse *${prefix}antifloodmsg on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { antiFloodMessage: action === "on" });
  return reply(`🌊 Anti-flood de mensagens *${cfg.antiFloodMessage ? "ativado ✅" : "desativado ❌"}*.`);
}
break;

case "limiteflood": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = Number(args[0]);
  if (!Number.isInteger(value) || value < 3 || value > 30) return reply(`🌊 Informe entre *3 e 30 mensagens*.\nEx.: *${prefix}limiteflood 6*`);
  const cfg = updateAntiTravaConfig(from, { floodLimit: value });
  return reply(`✅ Flood configurado para *${cfg.floodLimit} mensagens em ${cfg.floodWindowSeconds}s*.`);
}
break;

case "punirtrava":
case "punicao_trava": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = String(args[0] || "").toLowerCase();
  if (!["adv", "ban", "alerta"].includes(value)) return reply(`⚖️ Escolha: *adv*, *ban* ou *alerta*.\nEx.: *${prefix}punirtrava adv*`);
  const cfg = updateAntiTravaConfig(from, { punishment: value });
  return reply(`⚖️ Punição do Anti-Trava definida como *${cfg.punishment.toUpperCase()}*.`);
}
break;

case "modoemergencia":
case "emergencia": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "off"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`🚨 *MODO DE EMERGÊNCIA*\nStatus: *${cfg.emergency ? "ON ✅" : "OFF ❌"}*\nFechamento: *${cfg.emergencySeconds}s*.\n\nUse *${prefix}modoemergencia on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { emergency: action === "on" });
  return reply(`🚨 Modo de emergência *${cfg.emergency ? "ativado ✅" : "desativado ❌"}*.\nAtaques graves podem fechar o grupo por *${cfg.emergencySeconds}s*.`);
}
break;

case "antiflood": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const value = String(args?.[0] || "").trim().toLowerCase();

  if (!value) {
    const cfg = getYuriProtection(from);

    return reply(
      `🚨 *ANTI-FLOOD DE COMANDOS*\n\n` +
      `Status: ${cfg.antiflood ? "🟢 ON" : "⚪ OFF"}\n` +
      `Intervalo: *${cfg.floodInterval}s*\n\n` +
      `Use:\n` +
      `*${prefix}antiflood 5*\n` +
      `*${prefix}antiflood off*`
    );
  }

  if (value === "off") {
    configureAntiFlood(from, null);

    return reply(
      "⚪🚨 AntiFlood de comandos desativado."
    );
  }

  const seconds = Number(value);

  if (
    !Number.isFinite(seconds) ||
    seconds < 1 ||
    seconds > 300
  ) {
    return reply(
      `🌸 Informe um intervalo entre *1 e 300 segundos*.\n` +
      `Ex.: *${prefix}antiflood 5*`
    );
  }

  configureAntiFlood(from, Math.floor(seconds));

  return reply(
    `✅🚨 AntiFlood ativado.\n` +
    `Membros deverão esperar *${Math.floor(seconds)}s* entre comandos.`
  );
}
break;

case "antidel":
case "antiedit": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const key = command;
  const enabled = toggleYuriProtection(from, key);

  return reply(
    `${enabled ? "✅" : "⚪"} *${key.toUpperCase()}* ` +
    `${enabled ? "ativado" : "desativado"} neste grupo.\n\n` +
    `${key === "antidel"
      ? "🗑️ Mensagens apagadas recentes poderão ser recuperadas."
      : "✏️ A Kobayashi mostrará a mensagem original quando detectar uma edição."
    }`
  );
}
break;

case "mutar":
case "mute": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  const target = menc_os2;

  if (!target) {
    return reply(
      `🌸 Use *${prefix}mutar @membro* ou responda à mensagem dele.`
    );
  }

  if (groupAdmins.includes(target)) {
    return reply("🛡️ Não vou mutar outro administrador.");
  }

  muteUser(from, target);

  return conn.sendMessage(from, {
    text:
      `🔇 @${String(target).split("@")[0]} foi mutado.\n\n` +
      `As novas mensagens desse membro serão apagadas enquanto o mute estiver ativo.`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "desmutar":
case "desmute":
case "unmute": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const target = menc_os2;

  if (!target) {
    return reply(
      `🌸 Use *${prefix}desmutar @membro* ou responda à mensagem dele.`
    );
  }

  const existed = unmuteUser(from, target);

  if (!existed) {
    return reply("🌸 Esse membro não está mutado.");
  }

  return conn.sendMessage(from, {
    text:
      `🔊 @${String(target).split("@")[0]} foi desmutado e pode falar novamente.`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "hidetag":
case "totag": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const mentions = (groupMembers || [])
    .map((p) => p?.id)
    .filter(Boolean);

  if (!mentions.length) {
    return reply("🌸 Não consegui carregar os membros do grupo.");
  }

  const quoted =
    info?.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
    null;

  const messageText =
    String(q || "").trim() ||
    quoted?.conversation ||
    quoted?.extendedTextMessage?.text ||
    "🐉🌸 Atenção, pessoal!";

  return conn.sendMessage(from, {
    text: messageText,
    mentions,
  }, { quoted: info });
}
break;


case "fotobv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const quotedImage =
    info?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
    info?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage ||
    info?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage ||
    null;

  const directImage =
    info?.message?.imageMessage ||
    info?.message?.viewOnceMessage?.message?.imageMessage ||
    info?.message?.viewOnceMessageV2?.message?.imageMessage ||
    null;

  const imageMessage = directImage || quotedImage;

  if (!imageMessage) {
    return reply(
      `🖼️🌸 *FOTO DO BEM-VINDO*\n\n` +
      `Envie uma imagem com *${prefix}fotobv* na legenda\n` +
      `ou responda uma imagem usando *${prefix}fotobv*.`
    );
  }

  try {
    const { downloadContentFromMessage } = await import("@whiskeysockets/baileys");
    const stream = await downloadContentFromMessage(imageMessage, "image");
    let buffer = Buffer.alloc(0);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    if (!buffer.length) throw new Error("Imagem vazia");

    const fsM = (await import("node:fs")).default;
    const pathM = (await import("node:path")).default;
    const dir = pathM.join(process.cwd(), "files", "database", "welcome-media");
    fsM.mkdirSync(dir, { recursive: true });

    const safeGroup = String(from).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filePath = pathM.join(dir, `${safeGroup}.jpg`);

    fsM.writeFileSync(filePath, buffer);
    setWelcomePhoto(from, filePath);

    return conn.sendMessage(from, {
      image: buffer,
      caption:
        `✅🌸 *Foto do bem-vindo definida!*\n\n` +
        `🐉 Esta imagem será usada quando o Welcome deste grupo for enviado.`
    }, { quoted: info });
  } catch (e) {
    console.error("Erro /fotobv:", e?.message || e);
    return reply("❌ Não consegui salvar essa imagem. Tente enviar a foto novamente.");
  }
}
break;

case "rmfotobv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const cfg = getWelcomeConfig(from);
  const oldPhoto = String(cfg?.welcomePhoto || "").trim();

  if (!oldPhoto) {
    return reply("🌸 Este grupo não possui uma foto personalizada de bem-vindo.");
  }

  try {
    const fsM = (await import("node:fs")).default;
    if (fsM.existsSync(oldPhoto)) fsM.unlinkSync(oldPhoto);
  } catch {}

  removeWelcomePhoto(from);

  return reply(
    `🗑️🌸 *Foto do bem-vindo removida!*\n\n` +
    `🐉 O Welcome voltou ao comportamento padrão.`
  );
}
break;

case "lucy": {
  const porcentagem = Math.floor(Math.random() * 101);

  return conn.sendMessage(from, {
    image: { url: "./media/lucy.jpg" },
    caption:
      `😈 *LUCY METER* 😈\n\n` +
      `🔥 O nível de safadeza da Lucy é *${porcentagem}%*`
  }, { quoted: info });
}
break;


case "antifake": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  if (!isBotGroupAdmins) {
    return reply(
      "❌🐉 Eu preciso ser ADM para usar o AntiFake."
    );
  }

  const raw = String(args?.[0] || "").toLowerCase();
  const cfg = getAntiFakeConfig(from);

  if (!raw) {
    return reply(
      `╭──────「 🛡️🌎 」──────╮\n` +
      `         *ANTI-FAKE*\n` +
      `╰─────────────────────╯\n\n` +
      `Status: ${cfg.enabled ? "🟢 ON" : "⚪ OFF"}\n` +
      `🇧🇷 DDI permitido: *+55*\n\n` +
      `• *${prefix}antifake on*\n` +
      `• *${prefix}antifake off*\n\n` +
      `🌸 Quando ativado, novos números estrangeiros identificáveis são removidos automaticamente.`
    );
  }

  if (!["on", "off"].includes(raw)) {
    return reply(
      `🌸 Use *${prefix}antifake on* ou *${prefix}antifake off*.`
    );
  }

  const enabled = raw === "on";

  setAntiFakeEnabled(from, enabled);

  return reply(
    enabled
      ? `✅🛡️ *AntiFake ativado!*\n\n🇧🇷 Apenas números identificáveis com DDI +55 passam pelo filtro automático.`
      : `⚪🛡️ *AntiFake desativado.*`
  );
}
break;

case "banfake": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  if (!isBotGroupAdmins) {
    return reply(
      "❌🐉 Eu preciso ser ADM para remover membros."
    );
  }

  const foreign = await findForeignParticipants(
    conn,
    from,
    groupMembers || []
  );

  if (!foreign.length) {
    return reply(
      `✅🌸 Não encontrei números estrangeiros identificáveis no grupo.\n\n` +
      `📌 Contas @lid sem telefone visível são ignoradas para evitar banimentos errados.`
    );
  }

  const adminSet = new Set(groupAdmins || []);

  const targets = foreign
    .map((item) => item.jid)
    .filter((jid) => !adminSet.has(jid));

  if (!targets.length) {
    return reply(
      "🌸 Os números estrangeiros encontrados são administradores. Não removi ninguém automaticamente."
    );
  }

  let removed = 0;
  let failed = 0;

  for (let i = 0; i < targets.length; i += 5) {
    const batch = targets.slice(i, i + 5);

    try {
      await conn.groupParticipantsUpdate(
        from,
        batch,
        "remove"
      );

      removed += batch.length;
    } catch (error) {
      failed += batch.length;

      console.error(
        "[BANFAKE]",
        error?.message || error
      );
    }

    await delay(800);
  }

  return reply(
    `╭──────「 🧹🌎 」──────╮\n` +
    `        *BANFAKE*\n` +
    `╰─────────────────────╯\n\n` +
    `✅ Removidos: *${removed}*\n` +
    `❌ Falhas: *${failed}*\n\n` +
    `🇧🇷 Filtro atual: DDI +55 permitido.`
  );
}
break;


case "soadm":
case "onlyadm":
case "soadmin": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const enabled = !getGroupCommandConfig(from).soadm;
  setSoAdm(from, enabled);

  return reply(
    enabled
      ? `✅🛡️ *Modo Só ADM ativado!*\n\nApenas administradores poderão usar os comandos da Kobayashi neste grupo.`
      : `⚪🛡️ *Modo Só ADM desativado!*\n\nOs membros podem usar os comandos novamente.`
  );
}
break;

case "blockcmd": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const target = String(args?.[0] || "")
    .replace(prefix, "")
    .trim();

  if (!target) {
    return reply(
      `🌸 Use *${prefix}blockcmd comando*\n` +
      `Ex.: *${prefix}blockcmd sticker*`
    );
  }

  const normalizedTarget = resolveCommandAlias(target);

  const protectedCommands = new Set([
    "blockcmd",
    "unblockcmd",
    "soadm",
    "configgp",
  ]);

  if (protectedCommands.has(normalizedTarget)) {
    return reply(
      "🛡️ Esse comando de administração não pode ser bloqueado no grupo."
    );
  }

  blockGroupCommand(from, normalizedTarget);

  return reply(
    `✅⛔ *${prefix}${normalizedTarget}* foi bloqueado para membros.\n` +
    `ADMs continuam podendo usar normalmente.`
  );
}
break;

case "unblockcmd": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const target = String(args?.[0] || "")
    .replace(prefix, "")
    .trim();

  if (!target) {
    return reply(
      `🌸 Use *${prefix}unblockcmd comando*.`
    );
  }

  const normalizedTarget = resolveCommandAlias(target);
  const removed = unblockGroupCommand(
    from,
    normalizedTarget
  );

  return reply(
    removed
      ? `✅🔓 *${prefix}${normalizedTarget}* foi desbloqueado neste grupo.`
      : `🌸 Esse comando não estava bloqueado neste grupo.`
  );
}
break;

case "blockcmdg": {
  if (!SoDonoPrincipal) {
    return reply(
      "👑 Apenas o dono principal pode bloquear comandos globalmente."
    );
  }

  const target = String(args?.[0] || "")
    .replace(prefix, "")
    .trim();

  const reason = args?.slice(1).join(" ").trim() ||
    "Sem motivo informado";

  if (!target) {
    return reply(
      `🌸 Use *${prefix}blockcmdg comando motivo*.`
    );
  }

  const normalizedTarget = resolveCommandAlias(target);

  const protectedCommands = new Set([
    "update",
    "atualizar",
    "blockcmdg",
    "unblockcmdg",
    "version",
    "versao",
    "v",
  ]);

  if (protectedCommands.has(normalizedTarget)) {
    return reply(
      "🛡️ Esse comando crítico não pode ser bloqueado globalmente."
    );
  }

  blockGlobalCommand(
    normalizedTarget,
    reason
  );

  return reply(
    `✅🚫 *${prefix}${normalizedTarget}* foi bloqueado globalmente.\n` +
    `📝 Motivo: *${reason}*`
  );
}
break;

case "unblockcmdg": {
  if (!SoDonoPrincipal) {
    return reply(
      "👑 Apenas o dono principal pode desbloquear comandos globalmente."
    );
  }

  const target = String(args?.[0] || "")
    .replace(prefix, "")
    .trim();

  if (!target) {
    return reply(
      `🌸 Use *${prefix}unblockcmdg comando*.`
    );
  }

  const normalizedTarget = resolveCommandAlias(target);
  const removed = unblockGlobalCommand(
    normalizedTarget
  );

  return reply(
    removed
      ? `✅🔓 *${prefix}${normalizedTarget}* foi desbloqueado globalmente.`
      : `🌸 Esse comando não estava bloqueado globalmente.`
  );
}
break;

case "addalias": {
  if (!SoDonoPrincipal) {
    return reply(
      "👑 Apenas o dono principal pode criar aliases."
    );
  }

  if (!q || !q.includes("/")) {
    return reply(
      `📛 Use *${prefix}addalias apelido/comando*\n` +
      `Ex.: *${prefix}addalias h/hidetag*`
    );
  }

  const [alias, target] = q
    .split("/")
    .map((x) => x.trim());

  const result = addCommandAlias(
    alias,
    target
  );

  if (!result.ok) {
    return reply(
      result.reason === "exists"
        ? `⚠️ O alias *${prefix}${alias}* já existe.`
        : "🌸 Alias ou comando inválido."
    );
  }

  return reply(
    `✅📛 Alias criado!\n\n` +
    `*${prefix}${result.alias}* → *${prefix}${result.command}*`
  );
}
break;

case "delalias": {
  if (!SoDonoPrincipal) {
    return reply(
      "👑 Apenas o dono principal pode remover aliases."
    );
  }

  const index = Number(args?.[0]);

  if (!Number.isInteger(index)) {
    return reply(
      `🌸 Use *${prefix}delalias número*.\n` +
      `Veja os números em *${prefix}aliaslist*.`
    );
  }

  const removed = removeCommandAlias(index);

  return reply(
    removed
      ? `🗑️ Alias *${prefix}${removed.alias}* → *${prefix}${removed.command}* removido.`
      : "🌸 Número de alias inválido."
  );
}
break;

case "aliaslist":
case "listaliases": {
  if (!SoDonoPrincipal) {
    return reply(
      "👑 Apenas o dono principal pode consultar os aliases."
    );
  }

  const aliases = listCommandAliases();

  if (!aliases.length) {
    return reply(
      "📜 Nenhum alias personalizado cadastrado."
    );
  }

  return reply(
    `╭──────「 📛 」──────╮\n` +
    `        *ALIASES*\n` +
    `╰──────────────────╯\n\n` +
    aliases.map(
      (item, i) =>
        `${i + 1}. *${prefix}${item.alias}* → *${prefix}${item.command}*`
    ).join("\n")
  );
}
break;

case "topcmds": {
  const top = getMostUsedCommands(10);

  if (!top.length) {
    return reply(
      "🌸 Ainda não existem estatísticas de comandos suficientes."
    );
  }

  return reply(
    `╭══════ ❀ 📊 ❀ ══════╮\n` +
    `       *TOP COMANDOS*\n` +
    `╰══════ ❀ 🐉 ❀ ══════╯\n\n` +
    top.map(
      (item, i) =>
        `${i + 1}. *${prefix}${item.name}* — ${item.count} uso(s) • ${item.uniqueUsers} usuário(s)`
    ).join("\n") +
    `\n\n📈 Total registrado: *${getTotalCommandUsage()}* usos.`
  );
}
break;

case "totalcmd": {
  const target = resolveCommandAlias(
    String(args?.[0] || command)
      .replace(prefix, "")
      .trim()
  );

  if (!args?.[0]) {
    return reply(
      `🌸 Use *${prefix}totalcmd comando*.\n` +
      `Ex.: *${prefix}totalcmd play*`
    );
  }

  const stats = getCommandStats(target);

  if (!stats) {
    return reply(
      `📊 Ainda não há uso registrado para *${prefix}${target}*.`
    );
  }

  return reply(
    `╭──────「 📊 」──────╮\n` +
    `      *TOTAL CMD*\n` +
    `╰──────────────────╯\n\n` +
    `🧩 Comando: *${prefix}${stats.name}*\n` +
    `🔢 Usos: *${stats.count}*\n` +
    `👥 Usuários únicos: *${stats.uniqueUsers}*\n` +
    `🕒 Último uso: *${stats.lastUsed ? new Date(stats.lastUsed).toLocaleString("pt-BR") : "—"}*`
  );
}
break;

case "novidades":
case "changelog": {
  const notes = getReleaseNotes();

  return reply(
    formatReleaseNotes(
      notes,
      { prefix }
    )
  );
}
break;

// comandos públicos
case "fig":
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
      "Tente novamente com outra imagem ou um vídeo mais curto."
    );
  }
}
break;

case "koban":
case "kobaban": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  const target = getTargetFromMessage(info, menc_os2);
  if (!target || target === from) return reply(`🐉 Marque o membro ou responda à mensagem dele.\nExemplo: *${prefix}KobaBan @membro spam*`);
  if (target === botNumber) return reply("🌸 A Kobayashi não pode expulsar a si mesma.");
  if (target === dono) return reply("👑 O criador da Kobayashi está protegido.");

  const reason = args.filter((arg) => !arg.startsWith("@")).join(" ").trim() || "Não informado";
  const targetNumber = target.split("@")[0];
  const adminNumber = sender.split("@")[0];

  const kobaBanText =
`┏╾ׁ═╼°❀•°: | ⊱🐉⊰ | :°•❀°╾ׁ═╼┓
┃       *KOBAYASHI BAN* 🌸
┗╾ׁ═╼°❀•°: | ⊱🔥⊰ | :°•❀°╾ׁ═╼┛
╎
┃ 🐉 *A Kobayashi tomou uma decisão.*
┃
┃ 👤 Alvo: @${targetNumber}
┃ 🛡️ ADM: @${adminNumber}
┃ 📜 Motivo: *${reason}*
┃
┃ 🌸 _As portas do Reino Dragon se fecharam para você._
┃ 🔥 *Que as chamas da Kobayashi marquem sua saída.*
╎
┗━━━〔 🐲 KOBAYASHI BOT 🐲 〕━━━┛`;

  try {
    // KobaBan em uma única mensagem: GIF + texto no caption.
    const kobaBanMedia = path.join(process.cwd(), "media", "kobaban", "kobaban.mp4");
    if (!fs.existsSync(kobaBanMedia)) {
      return reply("❌🐉 A mídia do KobaBan não foi encontrada.");
    }

    await conn.sendMessage(from, {
      video: fs.readFileSync(kobaBanMedia),
      gifPlayback: true,
      caption: kobaBanText,
      mentions: [target, sender]
    }, { quoted: info });

    await conn.groupParticipantsUpdate(from, [target], "remove");

    addPunishmentHistory(from, target, {
      type: "kobaban",
      reason,
      by: sender,
      source: "manual"
    });

    addAdminLog(from, {
      type: "kobaban",
      actor: sender,
      target,
      detail: `KobaBan executado • ${reason}`,
    });
  } catch (e) {
    console.error("Erro no KobaBan:", e);
    return reply("❌🐉 A Kobayashi tentou executar o ban, mas o WhatsApp recusou a remoção.");
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

  const reason = args.filter((arg) => !arg.startsWith("@")).join(" ").trim();
  if (!reason) return reply(`⚠️ Informe o motivo da remoção.\nExemplo: *${prefix}banc @membro spam*`);

  try {
    const targetNumber = target.split('@')[0];
    await conn.groupParticipantsUpdate(from, [target], 'remove');

    addPunishmentHistory(from, target, {
      type: "ban",
      reason,
      by: sender,
      source: "manual"
    });

    addAdminLog(from, {
      type: "ban",
      actor: sender,
      target,
      detail: `Membro removido do grupo • ${reason}`,
    });

    return conn.sendMessage(from, {
      text: `🐉🌸 *Membro removido!*\n\n👤 @${targetNumber}\n📋 Motivo: ${reason}\n🛡️ Ação realizada por: @${sender.split('@')[0]}`,
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

  const reason = args.filter((arg) => !arg.startsWith('@')).join(' ').trim();
  if (!reason) return reply(`⚠️ Informe o motivo da advertência.\nExemplo: *${prefix}adv @membro spam*`);
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

  addPunishmentHistory(from, target, {
    type: "adv",
    reason,
    by: sender,
    source: "manual",
    meta: { count }
  });

  addAdminLog(from, {
    type: "adv",
    actor: sender,
    target,
    detail: `${count}/3 • ${reason}`,
  });

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

case "advs": {
  if (!isGroup) return reply(mess.onlyGroup());
  const target = getTargetFromMessage(info, sender) || sender;
  const db = readAdvDb();
  const record = db[from]?.[target];
  const count = Math.max(0, Math.min(Number(record?.count || 0), 3));
  const history = Array.isArray(record?.history) ? record.history.slice(-5).reverse() : [];
  const status = count === 0 ? "✅ Ficha limpa" : count === 1 ? "🟡 Sob atenção" : count === 2 ? "🟠 Zona de risco" : "🔴 Limite atingido";
  const lines = history.length ? history.map((h, i) => {
    const date = h?.at ? new Date(h.at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'data desconhecida';
    return `${i + 1}. ${h?.reason || 'Sem motivo'} — ${date}`;
  }).join("\n") : "Nenhuma advertência no histórico.";
  return conn.sendMessage(from, {
    text:
      `╭━━〔 ⚠️ FICHA DE ADVs 〕━━╮\n` +
      `┃ 👤 @${String(target).split('@')[0]}\n` +
      `┃ ⚠️ Total: *${count}/3*\n` +
      `┃ ${status}\n` +
      `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
      `📜 *Últimas advertências*\n${lines}`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "listadv":
case "listaadv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const db = readAdvDb();
  const rows = Object.entries(db[from] || {})
    .map(([jid, rec]) => ({ jid, count: Number(rec?.count || 0) }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
  if (!rows.length) return reply("✅🌸 Nenhum membro possui advertências ativas neste grupo.");
  const mentions = rows.map((x) => x.jid);
  const textRows = rows.slice(0, 50).map((x, i) => `${i + 1}. @${x.jid.split('@')[0]} — *${Math.min(x.count, 3)}/3*`).join("\n");
  return conn.sendMessage(from, {
    text:
      `╭━━〔 🛡️ ADVs DO GRUPO 〕━━╮\n` +
      `┃ 👥 Membros advertidos: *${rows.length}*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n${textRows}\n\n` +
      `🔎 Use *${prefix}advs @membro* para ver os detalhes.`,
    mentions
  }, { quoted: info });
}
break;

case "rmadv":
case "rm_adv": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const target = getTargetFromMessage(info, menc_os2);
  if (!target) return reply(`⚠️🌸 Marque um membro ou responda à mensagem dele.
Exemplo: ${prefix}rmadv @membro`);

  const db = readAdvDb();
  const record = db[from]?.[target];
  const current = Number(record?.count || 0);

  if (current <= 0) {
    return conn.sendMessage(from, {
      text: `🌸 @${target.split('@')[0]} não possui advertências registradas neste grupo.`,
      mentions: [target],
    }, { quoted: info });
  }

  const newCount = Math.max(current - 1, 0);
  if (!Array.isArray(record.history)) record.history = [];
  const removed = record.history.pop() || null;
  record.count = newCount;

  if (newCount === 0 && record.history.length === 0) {
    delete db[from][target];
    if (db[from] && Object.keys(db[from]).length === 0) delete db[from];
  }

  writeAdvDb(db);

  addPunishmentHistory(from, target, {
    type: "rmadv",
    reason: removed?.reason ? `ADV removida: ${removed.reason}` : "Uma advertência foi removida",
    by: sender,
    source: "manual",
    meta: { before: current, after: newCount }
  });

  addAdminLog(from, {
    type: "rmadv",
    actor: sender,
    target,
    detail: `${current}/3 → ${newCount}/3${removed?.reason ? ` • removida: ${removed.reason}` : ""}`,
  });

  return conn.sendMessage(from, {
    text:
      `♻️🌸 *ADVERTÊNCIA REMOVIDA*\n\n` +
      `👤 Usuário: @${target.split('@')[0]}\n` +
      `⚠️ Antes: *${current}/3*\n` +
      `✅ Agora: *${newCount}/3*\n` +
      (removed?.reason ? `📋 ADV removida: ${removed.reason}\n` : "") +
      `🛡️ Removida por: @${sender.split('@')[0]}`,
    mentions: [target, sender],
  }, { quoted: info });
}
break;

case "perfil": {
  try {
    const target = getTargetFromMessage(info, sender) || sender;
    const targetPN = await getPNForJid(conn, target, target);
    const targetJid = targetPN || normalizeJid(target) || target;
    const number = targetJid?.split('@')[0] || target?.split('@')[0] || 'desconhecido';

    const targetParticipant = isGroup ? groupMembers.find((p) => {
      const raw = p?.id || p?.jid || p?.participant;
      return normalizeJid(raw) === targetJid || raw === target;
    }) : null;

    const cfgPerfil = readSettingsFile();
    const perfilOwnerNumber = String(cfgPerfil?.ownerNumber || cfgPerfil?.dono || '').replace(/\D/g, '');
    const leaderNumbers = Array.isArray(cfgPerfil?.leaders)
      ? cfgPerfil.leaders.map((x) => String(x || '').replace(/\D/g, '')).filter(Boolean)
      : [];

    const isTargetOwner = number === perfilOwnerNumber || targetJid === dono || target === dono;
    const isTargetLeader = leaderNumbers.includes(number);
    const participantRole = targetParticipant?.admin;
    const isTargetAdmin = participantRole === 'admin' || participantRole === 'superadmin';
    const isGroupOwner = participantRole === 'superadmin';

    let name = target === sender
      ? (pushname || 'Usuário')
      : (targetParticipant?.name || targetParticipant?.notify || `Usuário ${number}`);

    // Nome salvo no WhatsApp quando disponível.
    try {
      if (typeof conn.getName === 'function') {
        const resolvedName = await conn.getName(targetJid);
        if (resolvedName && !/^\+?\d+$/.test(String(resolvedName).trim())) name = String(resolvedName).trim();
      }
    } catch (_) {}

    let bio = 'Sem recado público';
    let bioSetAt = '';
    try {
      if (typeof conn.fetchStatus === 'function') {
        const statusData = await conn.fetchStatus(targetJid);
        const rawStatus = Array.isArray(statusData) ? statusData[0] : statusData;
        bio = String(rawStatus?.status?.status || rawStatus?.status || bio).trim() || bio;
        const setAt = rawStatus?.status?.setAt || rawStatus?.setAt;
        if (setAt) {
          bioSetAt = new Date(Number(setAt)).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Sao_Paulo'
          });
        }
      }
    } catch (_) {}
    if (bio.length > 95) bio = `${bio.slice(0, 92)}...`;

    const db = readAdvDb();
    const advCountRaw = isGroup ? (db[from]?.[targetJid]?.count || db[from]?.[target]?.count || 0) : 0;
    const advCount = Math.max(0, Math.min(Number(advCountRaw) || 0, 3));
    const advStatus = advCount === 0
      ? '✅ Ficha limpa'
      : advCount === 1
        ? '🟡 Sob atenção'
        : advCount === 2
          ? '🟠 Zona de risco'
          : '🔴 Limite atingido';

    const activity = isGroup
      ? getUserActivity(from, targetJid)
      : { messages: 0, textMessages: 0, images: 0, stickers: 0, legacyMessages: 0, lastSeen: 0 };

    const messageCount = Number(activity?.messages || 0);
    const textCount = Number(activity?.textMessages || 0);
    const imageCount = Number(activity?.images || 0);
    const stickerCount = Number(activity?.stickers || 0);
    const legacyCount = Number(activity?.legacyMessages || 0);
    const lastSeen = Number(activity?.lastSeen || 0);
    const lastSeenText = lastSeen
      ? new Date(lastSeen).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      : 'Ainda não registrada';

    // Medidores de brincadeira persistentes.
    const gado = isGroup ? getOrCreateFunScore(from, 'gado', targetJid) : 0;
    const beleza = isGroup ? getOrCreateFunScore(from, 'lindo', targetJid) : 0;
    const presenca = isGroup ? getOrCreateFunScore(from, 'gostoso', targetJid) : 0;

    const cargo = isTargetOwner
      ? '👑 Dono da Kobayashi'
      : isGroupOwner
        ? '👑 Dono do grupo'
        : isTargetAdmin
          ? '🛡️ Administrador'
          : isTargetLeader
            ? '🐉 Líder da Kobayashi'
            : '🌸 Membro';

    const levelInfo = getLevelInfoFromXp(activity?.xp || 0);
    const socialInfo = getEconomySummary(targetJid);
    const socialAchievements = getAchievements(targetJid, levelInfo.level);
    const activeCosmeticTitle = getActiveTitle(targetJid);
    const dragonRank = levelInfo.title;

    const levelBlocks = Math.max(0, Math.min(10, Math.round(levelInfo.progress / 10)));
    const levelBar = "▰".repeat(levelBlocks) + "▱".repeat(10 - levelBlocks);

    // "Humor" inspirado no perfil do Nazuna, mas estável para o mesmo membro no dia.
    const humorOptions = [
      '😎 Tranquilão',
      '🔥 Modo Dragon',
      '😴 Sonolento',
      '🤓 Nerd mode',
      '😜 Caos total',
      '🧘 Zen',
      '🌸 Energia de maid',
      '🐉 Pronto pra batalha'
    ];
    const todayKey = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const humorSeed = `${number}:${todayKey}`.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const humor = humorOptions[humorSeed % humorOptions.length];

    const caption =
`╔════════════════════════════╗
║      🐉 *KOBAYASHI DRAGON CARD* 🐉
╚════════════════════════════╝

╭━━━〔 👤 *IDENTIDADE* 〕━━━╮
┃ 🌸 Nome: *${name}*
┃ 📱 Número: *+${number}*
┃ 🎭 Cargo: *${cargo}*
┃ 😸 Humor: *${humor}*
┃ 💬 Bio: _${bio}_
${bioSetAt ? `┃ 🕒 Bio atualizada: *${bioSetAt}*\n` : ''}╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🐲 *REGISTRO DRAGON* 〕━━━╮
┃ 🏷️ Classe: *${dragonRank}*
${activeCosmeticTitle ? `┃ 🎖️ Título: *${activeCosmeticTitle}*\n` : ''}┃ ⭐ Nível: *${levelInfo.level}*
┃ ✨ XP: *${levelInfo.xp}*
┃ 📈 ${levelBar} *${levelInfo.progress}%*
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📊 *ATIVIDADE* 〕━━━╮
┃ 💬 Mensagens: *${textCount}*
┃ 🖼️ Fotos: *${imageCount}*
┃ 🎨 Figurinhas: *${stickerCount}*
┃ 📦 Total registrado: *${messageCount}*
${legacyCount > 0 ? `┃ 🗃️ Registros antigos: *${legacyCount}*\n` : ''}┃ 🕒 Última atividade:
┃ _${lastSeenText}_
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 💰 *DRAGON SOCIAL* 〕━━━╮
┃ 🪙 Coins: *${socialInfo.coins}*
┃ 🏆 Conquistas: *${socialAchievements.unlocked.length}/${socialAchievements.total}*
┃ 🎮 Partidas: *${socialInfo.games.played}*
┃ 🥇 Vitórias: *${socialInfo.games.wins}*
┃ 🤝 Interações: *${socialInfo.socialInteractions}*
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 ✨ *AURA DO MEMBRO* 〕━━━╮
┃ 🐂 Gadice: *${gado}%*
┃ 🌸 Charme: *${beleza}%*
┃ 🔥 Presença: *${presenca}%*
┃ ⚠️ ADVs: *${advCount}/3*
┃ ${advStatus}
╰━━━━━━━━━━━━━━━━━━━━━━╯

☆━━━━━━━━〔 🌸 *KOBAYASHI BOT* 〕━━━━━━━━☆`;

    let profilePicture = null;
    try {
      profilePicture = await conn.profilePictureUrl(targetJid || target, 'image');
    } catch (_) {}

    if (profilePicture) {
      try {
        return await conn.sendMessage(from, {
          image: { url: profilePicture },
          caption,
          mentions: [targetJid || target],
        }, { quoted: info });
      } catch (_) {}
    }

    return conn.sendMessage(from, {
      text: caption,
      mentions: [targetJid || target],
    }, { quoted: info });
  } catch (error) {
    console.error("Erro no /perfil:", error);
    return reply("❌🐉 Não consegui montar o perfil agora. Tente novamente em alguns instantes.");
  }
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

    let successCount = 0;
    let failCount = 0;
    const sourceHits = {};

    for (let i = 0; i < quantidade; i++) {
      try {
        const fetched = await getRandomStickerBuffer({ axios, timeout: 30000 });
        const randomMetadata = {
          userNick: pushname || sender.split("@")[0],
          packName: "🌸 Kobayashi • Random Collection",
          publisher: "🐉 Kobayashi Bot • Multi Source",
          packId: "kobayashi-random",
          emojis: ["🐉", "🌸", "🎴"]
        };
        const isWebp = fetched.buffer?.slice(0,4).toString() === "RIFF" && fetched.buffer?.slice(8,12).toString() === "WEBP";
        const personalized = isWebp
          ? await applyStickerMetadata(fetched.buffer, randomMetadata)
          : await makeSticker(fetched.buffer, { isVideo: false, forceSquare: true, metadata: randomMetadata });

        await conn.sendMessage(destino, { sticker: personalized });
        sourceHits[fetched.source?.name || fetched.source?.id || "Fonte"] =
          (sourceHits[fetched.source?.name || fetched.source?.id || "Fonte"] || 0) + 1;

        successCount++;
        await delay(650);
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
        `${Object.keys(sourceHits).length ? `🌐 Fontes usadas: *${Object.entries(sourceHits).map(([name,count]) => `${name} (${count})`).join(", ")}*
` : ""}` +
        `
🐉 *Kobayashi Bot • Multi Source*`,
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

// fontes de figurinhas • v0.1.59
case "fontesfig":
case "fontesfigurinha": {
  const db = listStickerSources();
  const lines = db.sources.map((src) => {
    const selected = db.mode === src.id ? " 🎯" : "";
    const status = src.enabled === false ? "🔴" : "🟢";
    const detail = src.type === "template" ? `${src.min}-${src.max}` : "pasta local";
    return `${status} *${src.id}*${selected}\n   ↳ ${src.name} • ${detail}`;
  }).join("\n");
  return reply(
    `╭━━〔 🎴 FONTES DE FIGURINHAS 〕━━╮\n` +
    `┃ Modo: *${db.mode === "auto" ? "Automático 🔄" : db.mode}*\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯\n\n${lines}\n\n` +
    `🌸 No modo automático a Kobayashi alterna entre as fontes disponíveis e evita repetir as últimas figurinhas.\n` +
    `📁 Você também pode colocar .webp/.png/.jpg em *files/stickers/*.\n\n` +
    `👑 Dono: *${prefix}fontefig auto* ou *${prefix}fontefig ID*`
  );
}
break;

case "fontefig": {
  if (!SoDono) return reply(mess.onlyOwner());
  const mode = String(args?.[0] || "").trim().toLowerCase();
  if (!mode) return reply(`🎴 Use *${prefix}fontefig auto* ou *${prefix}fontefig ID*.`);
  try {
    const db = setStickerSourceMode(mode);
    return reply(`✅ Fonte de figurinhas definida para *${db.mode === "auto" ? "automático" : db.mode}*.`);
  } catch (e) {
    return reply(`❌ ${e?.message || "Não consegui selecionar essa fonte."}`);
  }
}
break;

case "addfontefig": {
  if (!SoDono) return reply(mess.onlyOwner());
  const parts = String(q || "").split("|").map((x) => x.trim());
  if (parts.length < 4) {
    return reply(
      `🌐 Use:\n*${prefix}addfontefig Nome | URL com {n} | mínimo | máximo*\n\n` +
      `Ex.: *${prefix}addfontefig MinhaFonte | https://site.com/sticker-{n}.webp | 1 | 500*`
    );
  }
  try {
    const src = addStickerTemplateSource({ name: parts[0], url: parts[1], min: Number(parts[2]), max: Number(parts[3]) });
    return reply(`✅ Fonte adicionada!\n\n🆔 *${src.id}*\n🌐 ${src.name}\n🔢 ${src.min}-${src.max}`);
  } catch (e) {
    return reply(`❌ ${e?.message || "Não consegui adicionar essa fonte."}`);
  }
}
break;

case "delfontefig": {
  if (!SoDono) return reply(mess.onlyOwner());
  const id = String(args?.[0] || "").trim().toLowerCase();
  if (!id) return reply(`🗑️ Use *${prefix}delfontefig ID*.`);
  try {
    removeStickerSource(id);
    return reply(`✅ Fonte *${id}* removida.`);
  } catch (e) {
    return reply(`❌ ${e?.message || "Não consegui remover essa fonte."}`);
  }
}
break;

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
    `┃╎   ${prefix}rmadv @membro — remove 1 ADV\n` +
    `┃╎\n` +
    `┃╎୨୧ 🛡️ Apenas administradores podem aplicar ADV.\n` +
    `┃╎୨୧ 🤖 A Kobayashi precisa ser ADM para remover no 3/3.\n` +
    `┃╎୨୧ ♻️ Após uma remoção bem-sucedida, as ADVs são zeradas.\n` +
    `┃╰╾ׁ═╼〔 • 🌸 • 〕╾ׁ═╼╯`
  );
}
break;
//


// KOBAYASHI FUN • estabilizado v0.5.0
case "menuloja":
case "menushop": {
  if (!isGroup) return reply(mess.onlyGroup());
  const items = getShopItems();
  const shopUsage = getShopUsage(sender);
  return reply(buildShopMenu(prefix, items, shopUsage));
}
break;

case "comprar":
case "buy": {
  if (!isGroup) return reply(mess.onlyGroup());
  const itemId = String(args?.[0] || "").toLowerCase();
  if (!itemId) return reply(`🛒 Use *${prefix}menuloja* para ver os itens e depois *${prefix}comprar ID*.`);

  const result = buyShopItem(sender, itemId);
  if (!result.ok) return reply(`❌ ${result.reason}${Number.isFinite(result.coins) ? `\n🪙 Saldo: *${result.coins}*` : ""}`);

  return reply(
    `🛒🐉 *COMPRA REALIZADA!*\n\n` +
    `${result.item.icon} ${result.item.name}\n` +
    `💸 Valor: *${result.item.price} Dragon Coins*\n` +
    `🪙 Saldo restante: *${result.coins}*\n` +
    `🛍️ Compras restantes hoje: *${result.shopRemaining}/${result.shopLimit}*\n` +
    `🌅 A cota reseta às *06:00*.`
  );
}
break;

case "inventario":
case "inv": {
  if (!isGroup) return reply(mess.onlyGroup());
  const target = getTargetFromMessage(info, sender) || sender;
  const inv = getInventory(target);

  const itemText = inv.items.length
    ? inv.items.map(x =>
        `${x.icon} *${x.name}* ×${x.qty}${x.active ? " ✅ Equipado" : ""}`
      ).join("\n")
    : "📭 Inventário vazio.";

  return conn.sendMessage(from, {
    text:
      `╭━━〔 🎒 *INVENTÁRIO DRAGON* 〕━━╮\n` +
      `┃ 👤 @${String(target).split("@")[0]}\n` +
      `┃ 🪙 Saldo: *${inv.coins}*\n` +
      `┃ 🎁 Boosts Daily: *${inv.dailyBoosts}*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      itemText,
    mentions: [target]
  }, { quoted: info });
}
break;

case "equipar":
case "equipartitulo": {
  if (!isGroup) return reply(mess.onlyGroup());
  const itemId = String(args?.[0] || "").toLowerCase();
  if (!itemId) return reply(`🎭 Use *${prefix}inventario* e depois *${prefix}equipar ID*.`);

  const result = equipTitle(sender, itemId);
  if (!result.ok) return reply(`❌ ${result.reason}`);
  return reply(`✅🎭 Título equipado: *${result.title}*`);
}
break;

case "desequipartitulo":
case "untitle": {
  if (!isGroup) return reply(mess.onlyGroup());
  unequipTitle(sender);
  return reply("✅ Título cosmético removido do Dragon Card.");
}
break;

case "abrircaixa":
case "opencaixa": {
  if (!isGroup) return reply(mess.onlyGroup());
  const result = openDragonBox(sender);
  if (!result.ok) return reply(`📦 ${result.reason}\nUse *${prefix}menuloja* para comprar uma.`);
  return reply(
    `📦✨ *CAIXA DE ESCAMAS ABERTA!*\n\n` +
    `🪙 Você encontrou *${result.reward} Dragon Coins*!\n` +
    `💰 Saldo atual: *${result.coins}*`
  );
}
break;

case "antifarm":
case "antifarmdiario": {
  if (!isGroup) return reply(mess.onlyGroup());
  const action = String(args?.[0] || "status").toLowerCase();

  if (action === "on" || action === "off") {
    if (!isGroupAdmins) return reply(mess.onlyAdmins());
    const enabled = setAntiFarmEnabled(from, action === "on");
    return reply(
      enabled
        ? "🛡️🐉 *Anti-Farm Diário ativado neste grupo!*"
        : "⚠️ *Anti-Farm Diário desativado neste grupo.*"
    );
  }

  const cfg = getAntiFarmConfig(from);
  const usage = getAntiFarmUsage(from, sender);
  return reply(
    `╭━━〔 🛡️ *ANTI-FARM DIÁRIO* 〕━━╮\n` +
    `┃ Status: *${cfg.enabled ? "ATIVO ✅" : "DESATIVADO ❌"}*\n` +
    `┃ 🎮 Ações premiadas: *${usage.actions}/${usage.actionLimit}*\n` +
    `┃ 🪙 Moedas de farm: *${usage.coins}/${usage.coinLimit}*\n` +
    `┃ 🌅 Reset diário: *06:00*\n` +
    `┃\n` +
    `┃ ADM: ${prefix}antifarm on\n` +
    `┃ ADM: ${prefix}antifarm off\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`
  );
}
break;

case "menusocial":
case "menudragon": {
  if (!isGroup) return reply(mess.onlyGroup());
  return reply(buildSocialMenu(prefix));
}
break;

case "carteira":
case "coins":
case "saldo": {
  if (!isGroup) return reply(mess.onlyGroup());
  const target = getTargetFromMessage(info, sender) || sender;
  const p = getSocialProfile(target);
  const levelRow = getUserActivity(from, target);
  const walletAchievements = getAchievements(target, levelRow?.level || 1);
  return conn.sendMessage(from, {
    text:
      `╭━━〔 💰 *DRAGON WALLET* 〕━━╮\n` +
      `┃ 👤 @${String(target).split("@")[0]}\n` +
      `┃ 🪙 Dragon Coins: *${p.coins}*\n` +
      `┃ 🎮 Vitórias: *${p.games.wins}*\n` +
      `┃ 💀 Derrotas: *${p.games.losses}*\n` +
      `┃ 🤝 Interações: *${p.socialInteractions}*\n` +
      `┃ 🏆 Conquistas: *${walletAchievements.unlocked.length}/${walletAchievements.total}*\n` +
      `╰━━━━━━━━━━━━━━━━━━╯`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "daily": {
  if (!isGroup) return reply(mess.onlyGroup());
  const levelRow = getUserActivity(from, sender);
  const result = claimDaily(sender, levelRow?.level || 1);
  if (!result.ok) {
    const hours = Math.floor(result.remainingMs / 3600000);
    const mins = Math.ceil((result.remainingMs % 3600000) / 60000);
    return reply(`⏳ Você já coletou o Daily de hoje.\nVolte em *${hours}h ${mins}min*.`);
  }
  return reply(
    `🎁🐉 *DAILY COLETADO!*\n\n` +
    `🪙 Base: *${result.base}*\n` +
    `⭐ Bônus Nv.${result.level}: *+${result.levelBonus}*\n` +
    (result.boostUsed ? `🎁 Boost de inventário: *+${result.boostBonus}*\n` : "") +
    `💰 Total recebido: *${result.reward} Dragon Coins*\n` +
    `🏦 Saldo: *${result.coins}*`
  );
}
break;

case "pagar":
case "pay": {
  if (!isGroup) return reply(mess.onlyGroup());
  const target = getTargetFromMessage(info, null);
  const amountRaw = String(args?.[args.length - 1] || "").trim();
  const amount = /^\d+$/.test(amountRaw) ? Number(amountRaw) : 0;
  if (!target || target === sender) return reply(`💸 Marque alguém e informe o valor.\nEx.: *${prefix}pagar @membro 100*`);
  const result = transferCoins(sender, target, amount);
  if (!result.ok) return reply(`❌ ${result.reason}`);
  return conn.sendMessage(from, {
    text:
      `💸🐉 *TRANSFERÊNCIA DRAGON*\n\n` +
      `@${sender.split("@")[0]} enviou *${result.amount} moedas* para @${target.split("@")[0]}.\n` +
      `💰 Seu saldo: *${result.fromCoins}*`,
    mentions: [sender, target]
  }, { quoted: info });
}
break;

case "rankcoins":
case "topcoins": {
  if (!isGroup) return reply(mess.onlyGroup());
  const top = getCoinRank(10);
  if (!top.length) return reply("🪙 Ainda não há Dragon Coins no ranking.");
  const medals = ["🥇","🥈","🥉"];
  return conn.sendMessage(from, {
    text:
      `╭━━〔 💰 *RANK DRAGON COINS* 〕━━╮\n\n` +
      top.map((x,i)=>`${medals[i] || `#${i+1}`} @${x.jid.split("@")[0]} — *${x.coins}* 🪙`).join("\n") +
      `\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    mentions: top.map(x=>x.jid)
  }, { quoted: info });
}
break;

case "conquistas":
case "achievements": {
  if (!isGroup) return reply(mess.onlyGroup());
  const target = getTargetFromMessage(info, sender) || sender;
  const levelRow = getUserActivity(from, target);
  const a = getAchievements(target, levelRow?.level || 1);
  return conn.sendMessage(from, {
    text:
      `╭━━〔 🏆 *CONQUISTAS* 〕━━╮\n` +
      `┃ 👤 @${target.split("@")[0]}\n` +
      `┃ Desbloqueadas: *${a.unlocked.length}/${a.total}*\n` +
      `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
      a.items.map(x=>`${x.unlocked ? "✅" : "🔒"} ${x.icon} *${x.name}* — ${x.description}`).join("\n"),
    mentions: [target]
  }, { quoted: info });
}
break;

case "dado": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) return reply(`🔒 Ative o Modo Brincadeira com *${prefix}modobrincadeira*.`);
  const value = 1 + Math.floor(Math.random() * 6);
  const win = value >= 5;
  const reward = win ? 15 : 3;
  const g = recordGame(sender, win ? "win" : "loss", reward, from);
  return reply(`🎲 Você tirou *${value}*!\n${win ? "🏆 Boa! Vitória." : "🐉 Dessa vez não."}\n${g.antiFarm?.blocked ? "🛡️ Limite diário de farm atingido • +0 moedas" : `🪙 +${g.reward} moedas • Saldo: *${g.coins}*`}`);
}
break;

case "moeda":
case "coinflip": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) return reply(`🔒 Ative o Modo Brincadeira com *${prefix}modobrincadeira*.`);
  const side = Math.random() < .5 ? "Cara 🪙" : "Coroa 👑";
  const reward = 5;
  const g = recordGame(sender, "play", reward, from);
  return reply(`🪙 A moeda caiu em: *${side}*\n${g.antiFarm?.blocked ? "🛡️ Limite diário de farm atingido • +0 moedas" : `✨ +${g.reward} Dragon Coins • Saldo: *${g.coins}*`}`);
}
break;

case "cafune":
case "presente":
case "amizade": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) return reply(`🔒 Ative o Modo Brincadeira com *${prefix}modobrincadeira*.`);
  const target = getTargetFromMessage(info, null);
  if (!target || target === sender) return reply("🌸 Marque outro membro.");
  const labels = {
    cafune: ["🌸", "fez um cafuné em"],
    presente: ["🎁", "deu um presente para"],
    amizade: ["🤝", "celebrou a amizade com"]
  };
  const [icon, phrase] = labels[command];
  const social = recordSocialInteraction(sender, target, from);
  return conn.sendMessage(from, {
    text: `${icon} @${sender.split("@")[0]} ${phrase} @${target.split("@")[0]}!\n\n${social.antiFarm?.blocked ? "🛡️ Limite diário de farm atingido • +0 moedas" : `🪙 +${social.reward} Dragon Coins`} • Interações: *${social.socialInteractions}*`,
    mentions: [sender, target]
  }, { quoted: info });
}
break;

case "menubn": {
  if (!isGroup) return reply(mess.onlyGroup());
  reagir("🎮");
  return reply(buildFunMenu(prefix));
}
break;

case "piada":
case "conselho":
case "motivacional":
case "charada":
case "eununca":
case "vab":
case "sorte":
case "chance":
case "quando":
case "elogio":
case "ppt": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) {
    return reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n\n🛡️ Um ADM pode ativar com *${prefix}modobrincadeira*.`);
  }

  const pick = (items) => items[Math.floor(Math.random() * items.length)];

  const content = {
    piada: [
      "Por que o computador foi ao médico? Porque ele pegou um vírus. 💻😂",
      "O que o zero disse para o oito? Belo cinto! 😂",
      "Por que o livro de matemática ficou triste? Porque tinha muitos problemas. 📚"
    ],
    conselho: [
      "Nem toda resposta precisa vir hoje. Às vezes continuar já é progresso. 🌱",
      "Se algo parece grande demais, divide em uma tarefa pequena e começa por ela. 🐉",
      "Não gaste toda sua energia tentando vencer discussões que não mudam sua vida. 🌸"
    ],
    motivacional: [
      "🐉 Um passo pequeno ainda muda sua posição. Continua.",
      "🌟 Consistência vence aquela empolgação que dura só um dia.",
      "🔥 Você não precisa fazer tudo hoje; precisa só não abandonar tudo hoje."
    ],
    charada: [
      "🧩 O que é, o que é: quanto mais você tira, maior fica?\n||Resposta: um buraco.||",
      "🧩 O que sobe quando a chuva desce?\n||Resposta: o guarda-chuva.||",
      "🧩 Tem dentes, mas não morde. O que é?\n||Resposta: um pente.||"
    ],
    eununca: [
      "🙈 Eu nunca mandei mensagem e apaguei antes da pessoa ler.",
      "🙈 Eu nunca fingi que não vi uma mensagem para responder depois.",
      "🙈 Eu nunca virei a noite conversando com alguém."
    ],
    vab: [
      "⚔️ Verdade: qual foi a última coisa que você pesquisou no celular?",
      "⚔️ Verdade: qual hábito seu quase ninguém conhece?",
      "🔥 Desafio: mande um emoji que descreva sua vida amorosa agora.",
      "🔥 Desafio: escolha alguém do grupo e faça um elogio sincero."
    ]
  };

  if (content[command]) {
    return reply(pick(content[command]));
  }

  if (command === "sorte") {
    const value = Math.floor(Math.random() * 101);
    return reply(`🍀 *SORTE DO DIA*\n\nSua sorte hoje está em *${value}%*.`);
  }

  if (command === "chance") {
    if (!q?.trim()) return reply(`🎯 Use: *${prefix}chance sua pergunta*`);
    const value = Math.floor(Math.random() * 101);
    return reply(`🎯 *CHANCE KOBAYASHI*\n\n❓ ${q.trim()}\n✨ Chance: *${value}%*`);
  }

  if (command === "quando") {
    if (!q?.trim()) return reply(`⏳ Use: *${prefix}quando sua pergunta*`);
    const answers = ["ainda hoje", "nos próximos dias", "esta semana", "em algumas semanas", "quando você menos esperar", "vai demorar um pouquinho"];
    return reply(`⏳ *ORÁCULO KOBAYASHI*\n\n❓ ${q.trim()}\n🐉 Meu palpite: *${pick(answers)}*.`);
  }

  if (command === "elogio") {
    const target = getTargetFromMessage(info, sender) || sender;
    const compliments = [
      "tem uma energia que deixa o grupo mais leve 🌸",
      "parece ser alguém em quem dá para confiar 🐉",
      "tem presença — quando aparece, dá para notar ✨",
      "merece um pouco mais de reconhecimento hoje 💜"
    ];
    return conn.sendMessage(from, {
      text: `💖 @${String(target).split("@")[0]} ${pick(compliments)}`,
      mentions: [target]
    }, { quoted: info });
  }

  if (command === "ppt") {
    const choice = String(args?.[0] || "").toLowerCase();
    const valid = ["pedra", "papel", "tesoura"];
    if (!valid.includes(choice)) return reply(`✊ Use: *${prefix}ppt pedra|papel|tesoura*`);

    const bot = pick(valid);
    const wins = { pedra: "tesoura", papel: "pedra", tesoura: "papel" };
    const result = choice === bot ? "🤝 Empate!" : wins[choice] === bot ? "🏆 Você ganhou!" : "🐉 Kobayashi ganhou!";
    return reply(`✊ *PEDRA, PAPEL E TESOURA*\n\n👤 Você: *${choice}*\n🐉 Kobayashi: *${bot}*\n\n${result}`);
  }
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
// ==========================================
// 🛡️ MODERAÇÃO PRO • v0.7.3
// ==========================================
case "historico":
case "historicomod":
case "punicoes": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins && !SoDono) return reply(mess.onlyAdmins());

  const target = getTargetFromMessage(info, sender) || sender;
  const rows = getPunishmentHistory(from, target, 20);
  const recid = getRecidivismSummary(from, target, 30);

  return conn.sendMessage(from, {
    text: formatPunishmentHistory(target, rows, recid),
    mentions: [target]
  }, { quoted: info });
}
break;

case "limparhistorico":
case "limparpunicoes": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins && !SoDono) return reply(mess.onlyAdmins());

  const target = getTargetFromMessage(info, null);
  if (!target) return reply(`⚠️ Marque ou responda ao membro.\nExemplo: *${prefix}limparhistorico @membro*`);

  const count = clearPunishmentHistory(from, target);
  addAdminLog(from, {
    type: "history_clear",
    actor: sender,
    target,
    detail: `${count} registro(s) removido(s)`
  });

  return conn.sendMessage(from, {
    text: `🧹🌸 Histórico de @${target.split("@")[0]} limpo.\n📚 Registros removidos: *${count}*`,
    mentions: [target]
  }, { quoted: info });
}
break;


// ==========================================
// 🐉 ANTISPAM PRO • CONFIGURAÇÃO
// ==========================================
case "antispam": {
  if (!isGroup) return reply("❌ Este comando só funciona em grupos.");
  if (!isGroupAdmins && !SoDono) return reply("❌ Apenas administradores podem configurar o AntiSpam.");

  const option = String(args?.[0] || "").toLowerCase();
  if (["on", "1", "ativar"].includes(option)) {
    setAntiSpamEnabled(from, true);
    return reply("🐉🛡️ *AntiSpam Pro ativado neste grupo.*");
  }
  if (["off", "0", "desativar"].includes(option)) {
    setAntiSpamEnabled(from, false);
    return reply("🌸 *AntiSpam Pro desativado neste grupo.*");
  }

  return reply(formatAntiSpamStatus(from, prefix));
}
break;

// ==========================================
// 🌸 KOBAYASHI COMMUNITY • v0.7.1
// ==========================================
case "dragon_stickers":
case "dragonstickers": {
  return reply(
    `🐉🎴 *DRAGON STICKERS*\n\n` +
    `Grupo da comunidade dedicado a figurinhas:\n` +
    `https://chat.whatsapp.com/D4DglH53CywAafglpeU4ie`
  );
}
break;

case "maid_femboy":
case "maidfemboy": {
  return reply(
    `🌸🧹 *MAID FEMBOY*\n\n` +
    `Grupo da comunidade:\n` +
    `https://chat.whatsapp.com/E7tLoS1klOy28da87u7zzv`
  );
}
break;

case "dragon_divulgacoes":
case "dragon_divulgações":
case "dragondivulgacoes": {
  return reply(
    `🐉📢 *DRAGON DIVULGAÇÕES*\n\n` +
    `Grupo da comunidade dedicado a divulgações:\n` +
    `https://chat.whatsapp.com/GrWV8BngltU8puCXuQCOEK`
  );
}
break;

case "maid_porn":
case "maidporn": {
  return reply(
    `🔞🌸 *MAID PORN*\n\n` +
    `Grupo +18 da comunidade:\n` +
    `https://chat.whatsapp.com/ICSUFyPMG9VGauB9h6RAo1`
  );
}
break;

case "maid_dragon":
case "maiddragon": {
  return reply(
    `🐉🌸 *MAID DRAGON*\n\n` +
    `Grupo principal da nossa comunidade:\n` +
    `https://chat.whatsapp.com/H1oVU0BhQMZAdcI1KiFULO`
  );
}
break;

case "zerarrpg": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o dono principal da Kobayashi pode zerar o Dragon RPG.");
  }
  if (!isGroup) {
    return reply(`🐉 Esse comando funciona dentro de um grupo.\n\nUse *${prefix}zerarrpgg* para zerar o Dragon RPG global.`);
  }

  const confirmation = String(
    q ||
    (Array.isArray(args) ? args.join(" ") : "") ||
    ""
  )
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
  if (!["confirmar", "confirmo", "sim", "confirmado"].includes(confirmation)) {
    return reply(
`⚠️🐉 *RESET DO DRAGON RPG — GRUPO*

Isso vai apagar o progresso RPG de *todos os membros deste grupo* que possuírem personagem salvo.

Serão zerados:
• Nível e XP RPG
• Ouro e inventário
• Classe humana
• Facção e classe dracônica
• Atributos e pontos
• Batalhas, vitórias e derrotas
• Missões e progresso
• Despertar Dracônico

🌸 O Level social normal da Kobayashi *não será apagado*.

Para confirmar:
*${prefix}zerarrpg confirmar*

🛡️ Um backup automático será criado antes do reset.`);
  }

  try {
    const memberJids = new Set();
    for (const participant of groupMembers || []) {
      const raw = participant?.id || participant?.jid || participant?.participant;
      if (!raw) continue;
      memberJids.add(raw);
      try {
        const normalized = normalizeJid(raw);
        if (normalized) memberJids.add(normalized);
      } catch (_) {}
      try {
        const pn = await getPNForJid(conn, raw, raw);
        if (pn) memberJids.add(pn);
      } catch (_) {}
    }

    // Garante que o próprio dono também seja considerado se estiver no grupo.
    memberJids.add(sender);
    try {
      const normalizedSender = normalizeJid(sender);
      if (normalizedSender) memberJids.add(normalizedSender);
    } catch (_) {}

    const result = resetDragonRpgUsers(
      [...memberJids],
      `grupo-${String(from || "grupo").replace(/[^a-zA-Z0-9_-]/g, "_")}`
    );

    return reply(
`✅🐉 *DRAGON RPG ZERADO — GRUPO*

👥 Personagens apagados: *${result.reset}*
🌱 Todos os afetados voltaram ao estado inicial do RPG.

${result.backup ? "🛡️ Backup automático criado antes do reset." : "📭 Nenhum personagem RPG deste grupo estava salvo."}

Para jogar novamente:
*${prefix}rpgcriar*`);
  } catch (error) {
    console.error("Erro no /zerarrpg:", error);
    return reply("❌🐉 Não consegui zerar o Dragon RPG deste grupo. O banco original foi preservado.");
  }
}
break;

case "zerarrpgg": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o dono principal da Kobayashi pode zerar o Dragon RPG global.");
  }

  const confirmation = String(
    q ||
    (Array.isArray(args) ? args.join(" ") : "") ||
    ""
  )
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
  if (!["confirmar", "confirmo", "sim", "confirmado"].includes(confirmation)) {
    return reply(
`🚨🐉 *RESET GLOBAL DO DRAGON RPG*

Esse é o reset máximo.

Ele vai apagar *TODO o Dragon RPG de TODOS os grupos*, incluindo:
• Todos os jogadores
• O personagem do dono do bot
• Níveis e XP RPG
• Ouro, itens e equipamentos
• Classes e facções
• Despertar Dracônico
• Missões
• Estatísticas de combate

🌸 O sistema de Level social da Kobayashi não será apagado.

Para confirmar:
*${prefix}zerarrpgg confirmar*

🛡️ Um backup automático completo será criado antes da exclusão.`);
  }

  try {
    const result = resetAllDragonRpg("reset-global");

    return reply(
`✅🌎🐉 *DRAGON RPG GLOBAL ZERADO*

👥 Personagens apagados: *${result.reset}*
👑 O progresso RPG do dono também foi incluído.
🌱 O Dragon RPG voltou ao estado inicial em todos os grupos.

${result.backup ? "🛡️ Backup completo criado antes do reset." : "📭 O banco RPG já estava vazio."}

O primeiro passo para todos agora é:
*${prefix}rpgcriar*`);
  } catch (error) {
    console.error("Erro no /zerarrpgg:", error);
    return reply("❌🐉 Não consegui executar o reset global. O banco original foi preservado.");
  }
}
break;

case "dragonrpg":
case "rpg":
case "menurpg": {
  const socialInfo = getLevelInfoFromXp(getUserActivity(from, sender)?.xp || 0);
  const player = getDragonRpgPlayer(sender);
  return reply(formatRpgMenu(prefix, socialInfo.level, Boolean(player)));
}
break;

case "rpgcriar":
case "criarpersonagem": {
  const result = createDragonRpgPlayer(sender, pushname || sender.split("@")[0]);
  if (!result.created) {
    return reply(`🐉 Você já possui um personagem no Dragon RPG.\n\nUse *${prefix}rpgperfil* para consultar sua ficha.`);
  }
  return reply(
`╭═══❀══〔 🐉 *NOVO AVENTUREIRO* 〕══❀═══╮
┃ 🌸 Bem-vindo ao *Dragon RPG*!
┃ 👤 Personagem: *${result.player.name}*
┃ ⭐ Nível RPG: *1*
┃ 🪙 Ouro inicial: *100*
┃ 🎒 Itens iniciais: *2 Poções + 1 Pão*
╰══════════════════════════════════╯

🧭 Agora escolha seu primeiro caminho:
*${prefix}rpgclasses*

Depois use:
*${prefix}rpgclasse escudeiro*

📖 Ficou perdido? *${prefix}rpgajuda 1*`);
}
break;

case "rpgperfil":
case "perfilrpg": {
  const player = getDragonRpgPlayer(sender);
  if (!player) return reply(`🌱 Você ainda não entrou no Dragon RPG. Use *${prefix}rpgcriar*.`);
  const socialInfo = getLevelInfoFromXp(getUserActivity(from, sender)?.xp || 0);
  return reply(formatDragonRpgProfile(player, { socialLevel: socialInfo.level, prefix }));
}
break;

case "rpginventario":
case "inventariorpg": {
  const player = getDragonRpgPlayer(sender);
  if (!player) return reply(`🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
  return reply(formatDragonRpgInventory(player));
}
break;

case "rpgclasses":
case "classesrpg": {
  return reply(formatRpgClasses(prefix));
}
break;

case "classeinfo":
case "rpgclasseinfo": {
  const key = String(args?.[0] || "").toLowerCase();
  if (!key) return reply(`🌸 Informe uma classe. Ex.: *${prefix}classeinfo escudeiro*\n\nVeja todas em *${prefix}rpgclasses*.`);
  return reply(formatClassInfo(key, prefix));
}
break;

case "rpgclasse":
case "escolherclasse": {
  const key = String(args?.[0] || "").toLowerCase();
  if (!key) return reply(`⚔️ Escolha uma classe. Ex.: *${prefix}rpgclasse escudeiro*\n\nVeja: *${prefix}rpgclasses*`);
  const result = chooseHumanClass(sender, key);
  if (!result.ok) {
    if (result.reason === "missing") return reply(`🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
    if (result.reason === "already") return reply(`🔒 Sua classe humana já foi escolhida e não pode ser trocada nesta versão.\n\nUse *${prefix}rpgperfil* para ver sua ficha.`);
    return reply(`❌ Classe inválida. Use *${prefix}rpgclasses* para ver as opções.`);
  }
  return reply(`╭━━〔 ${result.klass.icon} *CLASSE DESPERTADA* 〕━━╮\n┃ Você agora é *${result.klass.name}*!\n┃ 🎯 Função: *${result.klass.role}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n${result.klass.desc}\n\n🐉 Veja seus novos atributos em *${prefix}rpgperfil*.`);
}
break;

case "despertardragao":
case "despertar": {
  const socialInfo = getLevelInfoFromXp(getUserActivity(from, sender)?.xp || 0);
  const result = startDragonAwakening(sender, socialInfo.level);
  if (!result.ok) {
    if (result.reason === "missing") return reply(`🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
    if (result.reason === "class") return reply(`⚔️ Você precisa escolher uma classe humana antes. Use *${prefix}rpgclasses*.`);
    if (result.reason === "social_level") return reply(`🔒 *DESPERTAR BLOQUEADO*\n\n🌟 Seu Level social: *${result.current}*\n🐉 Requisito: *Level 20*\n\nContinue participando do grupo e evoluindo no sistema de níveis da Kobayashi.`);
    if (result.reason === "completed") return reply(`🐲 Seu Despertar Dracônico já foi concluído. Veja *${prefix}rpgperfil*.`);
  }
  return reply(
`╭═══🔥══〔 🐉 *DESPERTAR DRACÔNICO* 〕══🔥═══╮
┃ O poder adormecido dentro de você respondeu.
┃ As escamas ainda não surgiram... mas o caminho abriu.
╰════════════════════════════════════╯

🏰 Escolha sua facção:
🔥 *caos*
⚖️ *harmonia*
👁️ *espectador*
⚡ *independente*

Use: *${prefix}rpgfaccao caos*

⚠️ A escolha da facção é permanente nesta versão.`);
}
break;

case "rpgfaccao":
case "escolherfaccao": {
  const socialInfo = getLevelInfoFromXp(getUserActivity(from, sender)?.xp || 0);
  const key = String(args?.[0] || "").toLowerCase();
  if (!key) return reply(`🏰 Escolha: *caos*, *harmonia*, *espectador* ou *independente*.\nEx.: *${prefix}rpgfaccao caos*`);
  const result = chooseDragonFaction(sender, key, socialInfo.level);
  if (!result.ok) {
    if (result.reason === "missing") return reply(`🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
    if (result.reason === "locked") return reply(`🔒 Primeiro alcance Level social 20 e use *${prefix}despertardragao*.`);
    if (result.reason === "already") return reply(`🔒 Você já pertence à facção *${factionName(result.player.faction)}*.`);
    return reply(`❌ Facção inválida. Escolha: *caos*, *harmonia*, *espectador* ou *independente*.`);
  }
  return reply(`${result.faction.icon} Você jurou seu caminho à facção *${result.faction.name}*.\n\n${result.faction.desc}\n\n🐉 Agora veja as linhagens em *${prefix}rpgclasses* e escolha com *${prefix}rpgdragao <classe>*.`);
}
break;

case "rpgdragao":
case "escolherdragao": {
  const socialInfo = getLevelInfoFromXp(getUserActivity(from, sender)?.xp || 0);
  const key = String(args?.[0] || "").toLowerCase();
  if (!key) return reply(`🐉 Informe a linhagem dracônica. Ex.: *${prefix}rpgdragao chamas*\n\nVeja *${prefix}rpgclasses*.`);
  const result = chooseDragonClass(sender, key, socialInfo.level);
  if (!result.ok) {
    if (result.reason === "missing") return reply(`🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
    if (result.reason === "locked") return reply(`🔒 O Despertar ainda está bloqueado. Use *${prefix}despertardragao* quando atingir Level social 20.`);
    if (result.reason === "faction") return reply(`🏰 Escolha sua facção primeiro com *${prefix}rpgfaccao <facção>*.`);
    if (result.reason === "already") return reply(`🐲 Você já possui uma forma dracônica e não pode trocá-la nesta versão.`);
    if (result.reason === "faction_mismatch") return reply(`⚠️ Essa linhagem pertence à facção *${factionName(result.required)}*.\n\nUse *${prefix}rpgclasses* para encontrar uma linhagem compatível com sua facção.`);
    return reply(`❌ Linhagem inválida. Use *${prefix}rpgclasses*.`);
  }
  return reply(
`╭═══🔥══〔 ${result.klass.icon} *DRAGÃO DESPERTO* 〕══🔥═══╮
┃ Sua transformação foi concluída!
┃ 🐲 Classe: *${result.klass.name}*
┃ 🎯 Função: *${result.klass.role}*
┃ ✨ Inspiração: *${result.klass.inspiration}*
╰════════════════════════════════════╯

${result.klass.desc}

🌸 Sua ficha recebeu os bônus dracônicos.
Veja: *${prefix}rpgperfil*`);
}
break;

case "regioes":
case "rpgregioes": {
  return reply(formatRpgRegions(prefix));
}
break;

case "explorar":
case "batalhar": {
  const region = String(args?.[0] || "floresta").toLowerCase();
  const result = startRpgBattle(sender, region);
  if (!result.ok) {
    if (result.reason === "missing") return reply(`🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
    if (result.reason === "class") return reply(`⚔️ Escolha uma classe primeiro com *${prefix}rpgclasse <classe>*.`);
    if (result.reason === "active") return reply(`⚠️ Você já está em batalha. Use *${prefix}atacar*, *${prefix}habilidade*, *${prefix}defender* ou *${prefix}fugir*.`);
    if (result.reason === "defeated") return reply(`☠️ Você está sem HP. Use *${prefix}descansar* antes de explorar novamente.`);
    if (result.reason === "level") return reply(`🔒 Essa região exige Nível RPG *${result.required}+*. Seu nível: *${result.current}*.`);
    if (result.reason === "dragon_required") return reply(`🐉 O Reino dos Dragões exige que seu Despertar Dracônico esteja completo.`);
    return reply(`❌ Região inválida. Veja *${prefix}regioes*.`);
  }
  return reply(formatBattleStart(result, prefix));
}
break;

case "atacar":
case "rpgatacar": {
  const r = rpgAttack(sender);
  if (!r.ok) return reply(r.reason === "no_battle" ? `🗺️ Você não está em batalha. Use *${prefix}explorar floresta*.` : `🌱 Crie seu personagem primeiro.`);
  return reply(formatBattleAction(r, prefix));
}
break;

case "defender":
case "rpgdefender": {
  const r = rpgDefend(sender);
  if (!r.ok) return reply(`🗺️ Você não está em batalha. Use *${prefix}explorar floresta*.`);
  return reply(formatBattleAction(r, prefix));
}
break;

case "habilidade":
case "rpghabilidade": {
  const r = rpgSkill(sender, args?.[0] || "");
  if (!r.ok) {
    if (r.reason === "no_battle") return reply(`🗺️ Você não está em batalha.`);
    if (r.reason === "mana") return reply(`🔷 Mana insuficiente. Precisa de *${r.required}*, você tem *${r.current}*.`);
    if (r.reason === "skill_level") return reply(`🔒 *${r.skill.name}* exige Nível RPG *${r.required}*.`);
    if (r.reason === "skill") return reply(`✨ Habilidade inválida. Veja *${prefix}habilidades*.`);
    return reply(`❌ Não foi possível usar a habilidade.`);
  }
  return reply(formatBattleAction(r, prefix));
}
break;

case "item":
case "rpgitem": {
  const key = String(args?.[0] || "pocao").toLowerCase();
  const r = rpgUseItem(sender, key);
  if (!r.ok) {
    if (r.reason === "no_battle") return reply(`🗺️ Itens de batalha são usados durante um combate.`);
    if (r.reason === "item") return reply(`🎒 Você não possui esse item. Veja *${prefix}rpginventario*.`);
    return reply(`❌ Esse item não pode ser usado agora.`);
  }
  if (r.counter?.defeated) return reply(`🧪 Você usou *${r.item.name}*, mas o inimigo contra-atacou e você foi derrotado.\n🏕️ Use *${prefix}descansar*.`);
  return reply(`🧪 Você usou *${r.item.name}*.${r.heal ? ` ❤️ +${r.heal} HP.` : ""}${r.mana ? ` 🔷 +${r.mana} Mana.` : ""}\n💥 O inimigo contra-atacou: *${r.counter.damage}* de dano.\n❤️ HP: *${r.player.resources.hp}/${r.player.stats.hp}*`);
}
break;

case "fugir":
case "rpgfugir": {
  const r = rpgFlee(sender);
  if (!r.ok) return reply(`🗺️ Você não está em batalha.`);
  if (r.escaped) return reply(`🏃💨 Você conseguiu escapar da batalha!`);
  if (r.counter?.defeated) return reply(`❌ A fuga falhou e o inimigo te derrotou.\n🏕️ Use *${prefix}descansar*.`);
  return reply(`❌ A fuga falhou! O inimigo causou *${r.counter.damage}* de dano.\n❤️ HP: *${r.player.resources.hp}/${r.player.stats.hp}*`);
}
break;

case "descansar":
case "rpgdescansar": {
  const r = rpgRest(sender);
  if (!r.ok) {
    if (r.reason === "combat") return reply(`⚔️ Você não pode descansar no meio de uma batalha.`);
    if (r.reason === "cooldown") { const min = Math.ceil(r.remaining / 60000); return reply(`🏕️ Você já descansou recentemente. Tente novamente em cerca de *${min} min*.`); }
    return reply(`🌱 Crie seu personagem primeiro.`);
  }
  return reply(`🏕️✨ Você descansou e recuperou completamente suas forças.\n❤️ HP: *${r.player.resources.hp}/${r.player.stats.hp}*\n🔷 Mana: *${r.player.resources.mana}/${r.player.stats.mana}*`);
}
break;

case "rpgatributo":
case "atributorpg": {
  const stat = String(args?.[0] || "").toLowerCase();
  const pts = Number(args?.[1] || 1);
  if (!stat) return reply(`📊 Use: *${prefix}rpgatributo atk 1*\nOpções: hp, mana, atk, def, mag, agi`);
  const r = rpgSpendStat(sender, stat, pts);
  if (!r.ok) {
    if (r.reason === "points") return reply(`🎯 Pontos insuficientes. Você possui *${r.current}*.`);
    if (r.reason === "stat") return reply(`❌ Atributo inválido. Use: hp, mana, atk, def, mag ou agi.`);
    return reply(`🌱 Crie seu personagem primeiro.`);
  }
  return reply(`📈 Atributo melhorado! *${r.stat.toUpperCase()} +${r.gain}*\n🎯 Pontos restantes: *${r.player.statPoints}*`);
}
break;

case "missoes":
case "rpgmissoes": {
  const text = formatRpgQuests(sender, prefix);
  if (!text) return reply(`🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
  return reply(text);
}
break;

case "missao":
case "rpgmissao": {
  const action = String(args?.[0] || "").toLowerCase();
  const id = String(args?.[1] || "");
  if (!action || !id) return reply(`📜 Use:\n*${prefix}missao aceitar q_slimes*\n*${prefix}missao resgatar q_slimes*\n\nVeja *${prefix}missoes*.`);
  if (["aceitar", "accept"].includes(action)) {
    const r = acceptRpgQuest(sender, id);
    if (!r.ok) {
      if (r.reason === "level") return reply(`🔒 Essa missão exige Nível RPG *${r.required}+*.`);
      if (r.reason === "completed") return reply(`✅ Você já concluiu essa missão.`);
      if (r.reason === "active") return reply(`🟡 Essa missão já está ativa.`);
      if (r.reason === "limit") return reply(`📜 Você já possui 3 missões ativas. Conclua alguma primeiro.`);
      return reply(`❌ Missão inválida. Veja *${prefix}missoes*.`);
    }
    return reply(`📜 Missão aceita: *${r.quest.title}*\n${r.quest.desc}\n\nO progresso será contado automaticamente.`);
  }
  if (["resgatar", "claim", "receber"].includes(action)) {
    const r = claimRpgQuest(sender, id);
    if (!r.ok) {
      if (r.reason === "progress") return reply(`⏳ Missão ainda incompleta: *${r.progress}/${r.target}*.`);
      return reply(`❌ Essa missão não está pronta para resgate.`);
    }
    return reply(`🎁 *MISSÃO CONCLUÍDA!*\n${r.quest.title}\n✨ +${r.quest.xp} XP RPG\n🪙 +${r.quest.gold} ouro${r.quest.item ? `\n📦 +${r.quest.item.qty || 1} ${r.quest.item.name}` : ""}${r.levels.length ? `\n🌟 Você subiu para o Nível RPG *${r.player.level}*!` : ""}`);
  }
  return reply(`📜 Ação inválida. Use *aceitar* ou *resgatar*.`);
}
break;

case "lojarpg": case "rpgloja": { return reply(formatRpgShop(prefix)); } break;
case "comprarrpg": case "rpgcomprar": { const id=String(args?.[0]||"").toLowerCase(),qty=Number(args?.[1]||1);if(!id)return reply(`🏪 Use: *${prefix}comprarrpg espada_ferro*`);const r=buyRpgItem(sender,id,qty);if(!r.ok){if(r.reason==="gold")return reply(`🪙 Ouro insuficiente. Custa *${r.required}*, você tem *${r.current}*.`);if(r.reason==="level")return reply(`🔒 Exige Nível RPG *${r.required}+*.`);if(r.reason==="class")return reply(`⚔️ Item incompatível com sua classe.`);if(r.reason==="dragon")return reply(`🐉 Item exclusivo para dragões despertos.`);return reply(`❌ Não foi possível comprar. Veja *${prefix}lojarpg*.`);}return reply(`${r.item.icon} *${r.qty}x ${r.item.name}* comprado!\n🪙 -${r.total} • Saldo: *${r.player.gold}*`);} break;
case "equipamentos": case "rpgequipamentos": {const p=getDragonRpgPlayer(sender);if(!p)return reply(`🌱 Crie seu personagem primeiro.`);return reply(formatRpgEquipment(p,prefix));} break;
case "equipar": case "rpgequipar": {const r=equipRpgItem(sender,String(args?.[0]||"").toLowerCase());if(!r.ok){if(r.reason==="combat")return reply(`⚔️ Não troque equipamento durante a batalha.`);if(r.reason==="inventory")return reply(`🎒 Você não possui esse equipamento.`);if(r.reason==="level")return reply(`🔒 Exige Nível RPG *${r.required}+*.`);if(r.reason==="class")return reply(`⚔️ Equipamento incompatível com sua classe.`);if(r.reason==="dragon")return reply(`🐉 Exige Despertar Dracônico.`);return reply(`❌ Não foi possível equipar.`);}return reply(`${r.item.icon} *${r.item.name} equipado!*${r.old?`\n↩️ ${r.old.name} foi substituído.`:""}`);} break;
case "desequipar": case "rpgdesequipar": {const r=unequipRpgItem(sender,String(args?.[0]||"").toLowerCase());if(!r.ok)return reply(r.reason==="combat"?`⚔️ Não troque equipamento durante a batalha.`:`📦 Não há equipamento nesse espaço.`);return reply(`↩️ ${r.item?.icon||"📦"} *${r.item?.name||"Equipamento"}* desequipado.`);} break;
case "habilidades": case "skillsrpg": case "rpghabilidades": {const text=formatRpgSkills(sender,prefix);if(!text)return reply(`🌱 Crie seu personagem primeiro.`);return reply(text);} break;

case "rankrpg":
case "rpgrank": {
  return reply(formatRpgRank(10));
}
break;

case "rpgajuda":
case "dragonhelp": {
  return reply(formatRpgHelp(args?.[0] || "", prefix));
}
break;

case "rpgcomandos":
case "comandosrpg": {
  return reply(formatRpgCommands(prefix));
}
break;

case "menu": {
  await conn.sendMessage(from, {
    react: { text: "🐉", key: info.key }
  }).catch(() => {});

  const menuPrincipal = buildMainMenu({
    sender,
    botName: NomeDoBot,
    ownerName,
    prefix,
    version: getLocalVersion()
  });

  await sendMenu(from, menuPrincipal, sender);
}
break;

case "menulevel":
case "menunivel":
reagir("🐉");
reply(buildLevelMenu(prefix));
break;

case "logs":
case "adminlogs": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const rawArgs = Array.isArray(args) ? args : [];
  const tokens = rawArgs.map((x) => String(x || "").trim()).filter(Boolean);
  const lower = tokens.map((x) => x.toLowerCase());
  const mentioned = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    || info.message?.imageMessage?.contextInfo?.mentionedJid?.[0]
    || info.message?.videoMessage?.contextInfo?.mentionedJid?.[0]
    || null;

  if (["ajuda", "help", "?"].includes(lower[0])) {
    return reply(
      `╭━━〔 📋 LOGS 2.0 〕━━╮\n` +
      `┃ ${prefix}logs\n` +
      `┃ ${prefix}logs @membro\n` +
      `┃ ${prefix}logs antilink\n` +
      `┃ ${prefix}logs adv\n` +
      `┃ ${prefix}logs hoje\n` +
      `┃ ${prefix}logs ontem\n` +
      `┃ ${prefix}logs 7d\n` +
      `┃ ${prefix}logs 30d\n` +
      `┃ ${prefix}logs data 01/09/2026\n` +
      `┃ ${prefix}logs adv hoje\n` +
      `┃ ${prefix}logs status\n` +
      `┃ ${prefix}logs limpar 30d\n` +
      `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
      `🧹 Logs com mais de 90 dias são removidos automaticamente.`
    );
  }

  if (["status", "stats", "estatisticas", "estatísticas"].includes(lower[0])) {
    const stats = getAdminLogStats(from);
    const top = Object.entries(stats.byType)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 8)
      .map(([type, count]) => `┃ • ${type}: *${count}*`)
      .join("\n") || "┃ Nenhum registro ainda.";
    return reply(
      `╭━━〔 📊 LOGS • STATUS 〕━━╮\n` +
      `┃ Total armazenado: *${stats.total}*\n` +
      `${top}\n` +
      `┃ Retenção automática: *90 dias*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`
    );
  }

  if (["limpar", "clear", "clean"].includes(lower[0])) {
    const spec = lower[1] || "";
    if (["tudo", "all"].includes(spec)) {
      const removed = clearAdminLogs(from);
      addAdminLog(from, { type: "logs_clear", actor: sender, detail: `${removed} logs removidos; histórico reiniciado` });
      return reply(`🧹 *Logs 2.0*\n\n✅ ${removed} registro(s) removido(s).`);
    }

    const matchDays = spec.match(/^(\d{1,3})d$/i);
    if (!matchDays) {
      return reply(`🧹 Use *${prefix}logs limpar 30d* para apagar logs mais antigos que 30 dias, ou *${prefix}logs limpar tudo*.`);
    }
    const days = Math.max(1, Number(matchDays[1]));
    const before = Date.now() - days * 86400000;
    const removed = clearAdminLogs(from, { before });
    addAdminLog(from, { type: "logs_clear", actor: sender, detail: `${removed} logs anteriores a ${days} dias removidos` });
    return reply(`🧹 *Logs 2.0*\n\n✅ ${removed} registro(s) com mais de *${days} dias* removido(s).`);
  }

  let type = "";
  let member = mentioned;
  let since = 0;
  let until = 0;
  let dateLabel = "recentes";

  for (let i = 0; i < lower.length; i++) {
    const token = lower[i];
    if (["antilink", "link", "links"].includes(token)) type = "antilink";
    else if (["adv", "advertencia", "advertência", "advs"].includes(token)) type = "adv";
    else if (token === "hoje") {
      const d = new Date(); d.setHours(0,0,0,0); since = d.getTime(); dateLabel = "hoje";
    } else if (token === "ontem") {
      const d = new Date(); d.setHours(0,0,0,0); until = d.getTime() - 1; since = until - 86400000 + 1; dateLabel = "ontem";
    } else if (/^\d{1,3}d$/.test(token)) {
      const days = Number(token.slice(0,-1)); since = Date.now() - days * 86400000; dateLabel = `últimos ${days} dias`;
    } else if (token === "data" && tokens[i+1]) {
      const m = tokens[i+1].match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) {
        const start = new Date(Number(m[3]), Number(m[2])-1, Number(m[1]), 0,0,0,0);
        const end = new Date(Number(m[3]), Number(m[2])-1, Number(m[1]), 23,59,59,999);
        since = start.getTime(); until = end.getTime(); dateLabel = tokens[i+1]; i++;
      }
    }
  }

  // Se não houve menção, aceita número/JID digitado como filtro de membro.
  if (!member) {
    const possibleMember = tokens.find((x) => /^@?\d{8,20}$/.test(x));
    if (possibleMember) member = possibleMember.replace(/^@/, "");
  }

  const logs = getAdminLogs(from, { type, member, since, until, limit: 20 });
  if (!logs.length) {
    return reply(`📋 *Logs 2.0*\n\nNenhum registro encontrado com esses filtros.\n💡 Use *${prefix}logs ajuda* para ver os filtros disponíveis.`);
  }

  const jidName = (jid) => jid ? `@${String(jid).split("@")[0]}` : "—";
  const lines = logs.map((log, i) => {
    const when = new Date(log.at || log.timestamp || Date.now()).toLocaleString("pt-BR");
    return `${i+1}. *${String(log.type || "admin").toUpperCase()}*\n   👤 Ação: ${jidName(log.actor)}${log.target ? ` → ${jidName(log.target)}` : ""}\n   📝 ${log.detail || log.message || "Sem detalhes"}\n   🕒 ${when}`;
  }).join("\n\n");

  const activeFilters = [type ? `tipo: ${type}` : "", member ? `membro: ${jidName(member)}` : "", `data: ${dateLabel}`].filter(Boolean).join(" • ");
  return conn.sendMessage(from, {
    text:
      `╭━━〔 📋 LOGS 2.0 〕━━╮\n` +
      `┃ ${activeFilters}\n` +
      `┃ Exibindo: *${logs.length}* registro(s)\n` +
      `╰━━━━━━━━━━━━━━━━━━╯\n\n` + lines,
    mentions: [...new Set(logs.flatMap((x) => [x.actor, x.target]).filter((x) => typeof x === "string" && x.includes("@")))]
  }, { quoted: info });
}
break;

case "paineladm":
case "admincenter":
case "centraladm": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  reagir("🛡️");
  const interactiveButtons = [{
    name: "single_select",
    buttonParamsJson: JSON.stringify({
      title: "🛡️ Abrir Admin Center",
      sections: [{ title: "Admin Center 2.0", rows: [
        { header: "📊 Visão geral", title: "Status do grupo", description: "Veja os sistemas e proteções ativas", id: `${prefix}statusgrupo` },
        { header: "🛡️ Segurança", title: "Proteções", description: "Confira o estado das proteções", id: `${prefix}painelprotecao` },
        { header: "⚙️ Recursos", title: "Sistemas", description: "Level, diversão, stickers e outros", id: `${prefix}painelsistemas` },
        { header: "🩺 Diagnóstico", title: "Permissões do bot", description: "Descubra rapidamente o que pode falhar", id: `${prefix}diagpermissoes` },
        { header: "📋 Auditoria", title: "Logs 2.0", description: "Ações, filtros e histórico administrativo", id: `${prefix}logs` }
      ]}]
    })
  }];
  return conn.sendMessage(from, {
    text: buildAdminCenter(prefix),
    footer: `Kobayashi Bot • ${getLocalVersion()}`,
    interactiveButtons
  }, { quoted: info });
}
break;

case "painelprotecao":
case "protecao": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const yuriProtection = getYuriProtection(from);
  return reply(buildProtectionPanel({
    prefix,
    protections: getGroupProtection(from),
    antiTrava: getAntiTravaConfig(from),
    antiSpam: getAntiSpamConfig(from),
    antiDelete: Boolean(yuriProtection?.antidel),
    antiEdit: Boolean(yuriProtection?.antiedit),
    sentinel: getSentinelStatus(from)
  }));
}
break;

case "painelsistemas":
case "sistemasgp": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const settingsNow = readSettingsFile();
  const whitelistNow = getWhitelist(from);
  return reply(buildSystemsPanel({
    levelEnabled: isLevelEnabled(from),
    funEnabled: isFunModeEnabled(from),
    autoStickerEnabled: isAutoStickerEnabled(from),
    antiFarm: getAntiFarmConfig(from),
    antiPv: Boolean(settingsNow?.antiPv),
    whitelistCount: Array.isArray(whitelistNow) ? whitelistNow.length : 0
  }));
}
break;

case "diagpermissoes":
case "permissoesbot": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  // No WhatsApp, tornar o bot ADM normalmente concede as capacidades administrativas
  // usadas pela Kobayashi (remover membros, editar grupo e gerar/consultar convites).
  return reply(buildPermissionDiagnostic({
    botIsAdmin: isBotGroupAdmins,
    userIsAdmin: isGroupAdmins,
    canRemove: isBotGroupAdmins,
    canEditGroup: isBotGroupAdmins,
    canInvite: isBotGroupAdmins
  }));
}
break;

case "statusgrupo":
case "statusgp": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const protections = getGroupProtection(from);
  const antiTrava = getAntiTravaConfig(from);
  const antiSpam = getAntiSpamConfig(from);
  const antiFarm = getAntiFarmConfig(from);
  const yuriProtection = getYuriProtection(from);
  const sentinel = getSentinelStatus(from);
  const settings = readSettingsFile();
  const whitelist = getWhitelist(from);

  return reply(buildGroupStatus({
    groupName,
    botIsAdmin: isBotGroupAdmins,
    protections,
    antiTrava,
    antiSpam,
    antiFarm,
    levelEnabled: isLevelEnabled(from),
    funEnabled: isFunModeEnabled(from),
    autoStickerEnabled: isAutoStickerEnabled(from),
    antiDelete: Boolean(yuriProtection?.antidel),
    antiEdit: Boolean(yuriProtection?.antiedit),
    antiPv: Boolean(settings?.antiPv),
    sentinel,
    whitelistCount: Array.isArray(whitelist) ? whitelist.length : 0
  }));
}
break;

case "menuadm":
if (!isGroup) return reply(mess.onlyGroup());
reagir("🛡️");
reply(buildAdminMenu(prefix));
break;


case "sentinelbridge":
case "bridge": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode configurar o Sentinel Bridge.");

  const action = String(args?.[0] || "status").toLowerCase();
  const s = getSentinelBridgeStatus();

  if (action === "status") {
    return reply(
      `╭━━〔 🛰️ SENTINEL BRIDGE 〕━━╮\n` +
      `┃ 📡 Transporte: *WhatsApp*\n` +
      `┃ 🛡️ Sistema: *${s.enabled ? "ATIVO ✅" : "DESATIVADO ❌"}*\n` +
      `┃ 🧪 Modo: *${s.testMode ? "TESTE (sem remoção)" : "PROTEÇÃO (remove)"}*\n` +
      `┃ 📱 Sentinela: *${s.sentinelNumber || "não configurada"}*\n` +
      `┃ 📨 Recebidos: *${s.received}*\n` +
      `┃ ✅ Aceitos: *${s.accepted}*\n` +
      `┃ ⛔ Rejeitados: *${s.rejected}*\n` +
      `┃ 🔨 Remoções: *${s.removals}*\n` +
      `┃\n` +
      `┃ ${prefix}sentinelbridge token\n` +
      `┃ ${prefix}sentinelbridge renovar\n` +
      `┃ ${prefix}sentinelbridge logs\n` +
      `┃ ${prefix}sentinelbridge numero 55DDDNUMERO\n` +
      `┃ ${prefix}sentinelbridge teste/proteger\n` +
      `┃ ${prefix}sentinelbridge on/off\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  }

  if (action === "token") {
    const tokenText = `🛰️ *TOKEN DO SENTINEL BRIDGE*\n\n${s.secret}\n\n⚠️ Não compartilhe este token. Use-o como bridgeSecret no config.json do Sentinel Core.`;
    if (from === dono) return reply(tokenText);
    await conn.sendMessage(dono, { text: tokenText }).catch(() => {});
    return reply("🔐 Enviei o token do Sentinel Bridge no PV do dono.");
  }

  if (["renovar","rotate","rotacionar"].includes(action)) {
    const secret = rotateSentinelBridgeSecret();
    await conn.sendMessage(dono, { text: `🔐 *NOVO TOKEN SENTINEL BRIDGE*\n\n${secret}\n\nAtualize o bridgeSecret do Sentinel Core.` }).catch(() => {});
    return reply("✅ Token do Bridge renovado. O novo token foi enviado ao PV do dono.");
  }

  if (["numero","número","number"].includes(action)) {
    const number = String(args?.[1] || "").replace(/\D/g, "");
    if (number.length < 10 || number.length > 15) {
      return reply(`📱 Use: *${prefix}sentinelbridge numero 55DDDNUMERO*`);
    }
    const cfg = setSentinelWhatsAppNumber(number);
    return reply(`✅ Número autorizado da Sentinela: *${cfg.sentinelNumber}*\n\nEssa conta deve permanecer como membro comum.`);
  }

  if (["teste","test"].includes(action)) {
    setSentinelBridgeTestMode(true);
    return reply("🧪 Sentinel Bridge em *modo de teste*. Os eventos serão validados e registrados, sem remover membros.");
  }

  if (["proteger","protecao","proteção","ativo"].includes(action)) {
    setSentinelBridgeTestMode(false);
    return reply("🛡️ Sentinel Bridge em *modo de proteção*. Eventos válidos poderão remover invasores.");
  }

  if (action === "on" || action === "off") {
    const cfg = setSentinelBridgeEnabled(action === "on");
    if (cfg.enabled) ensureSentinelBridgeServer();
    return reply(`🛰️ Sentinel Bridge *${cfg.enabled ? "ativado ✅" : "desativado ❌"}*.`);
  }

  if (action === "logs" || action === "log") {
    const logs = getSentinelBridgeLogs(10);
    if (!logs.length) return reply("🛰️ Ainda não há eventos no Sentinel Bridge.");
    return reply(
      `╭━━〔 🛰️ BRIDGE LOG 〕━━╮\n` +
      logs.map((x,i)=>`┃ ${i+1}. ${x.action || "evento"} • ${x.reason || (x.reasons||[]).join(", ") || "ok"}\n┃ ${new Date(x.timestamp||Date.now()).toLocaleString("pt-BR")}`).join("\n┃\n") +
      `\n╰━━━━━━━━━━━━━━━━━━╯`
    );
  }

  return reply(`🛰️ Use *${prefix}sentinelbridge status*.`);
}
break;

case "sentinel": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode configurar o Kobayashi Sentinel.");

  const action = String(args?.[0] || "status").toLowerCase();

  if (action === "status") {
    const s = getSentinelStatus(from);
    return reply(
      `╭━━〔 🛰️ KOBAYASHI SENTINEL 〕━━╮\n` +
      `┃ 🤖 Sessão: *${s.connected ? "ONLINE ✅" : s.registered ? "OFFLINE ⚠️" : "NÃO PAREADA"}*\n` +
      `┃ 👁️ Neste grupo: *${s.groupEnabled ? "ATIVO ✅" : "DESATIVADO ❌"}*\n` +
      `┃ 🛡️ Modo: *links invisíveis*\n` +
      `┃ ⏱️ Confirmação: *${s.delayMs} ms*\n` +
      `┃ 📱 Sentinela: *${s.phoneNumber || "não configurado"}*\n` +
      `┃\n` +
      `┃ ${prefix}sentinel parear 55DDDNUMERO\n` +
      `┃ ${prefix}sentinel on\n` +
      `┃ ${prefix}sentinel off\n` +
      `┃ ${prefix}sentinel delay 2000\n` +
      `┃ ${prefix}sentinel log\n` +
      `┃ ${prefix}sentinel desconectar\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  }

  if (action === "parear" || action === "pair") {
    const number = String(args?.[1] || "").replace(/\D/g, "");
    if (number.length < 10 || number.length > 15) {
      return reply(`📱 Use: *${prefix}sentinel parear 5511999999999*`);
    }

    await reply("🛰️ Preparando a conta Sentinela...");
    try {
      const result = await startSentinelPairing(number);
      if (result.alreadyRegistered) {
        return reply(
          `✅ A conta Sentinela já possui sessão registrada.\n` +
          `📱 Número: *${result.phoneNumber || number}*\n\n` +
          `Use *${prefix}sentinel on* no grupo que deseja proteger.`
        );
      }

      return reply(
        `🛰️ *CÓDIGO DE PAREAMENTO SENTINEL*\n\n` +
        `📱 Número: *${number}*\n` +
        `🔑 Código: *${result.code}*\n\n` +
        `No WhatsApp do segundo número:\n` +
        `*Aparelhos conectados → Conectar um aparelho → Conectar com número de telefone*.\n\n` +
        `✅ O pareamento agora usa o *mesmo método da conexão principal da Kobayashi*.\n` +
        `⚠️ Essa conta deve permanecer como *membro comum*, sem ADM.`
      );
    } catch (e) {
      return reply(`❌ Não consegui iniciar o pareamento do Sentinela.\n\n${e?.message || e}`);
    }
  }

  if (action === "on" || action === "off") {
    if (!isGroup) return reply(mess.onlyGroup());
    const enabled = action === "on";
    setSentinelGroupEnabled(from, enabled);

    return reply(
      enabled
        ? `🛰️✅ *Kobayashi Sentinel ativado neste grupo.*\n\n` +
          `A conta membro comum irá comparar mensagens com a Kobayashi ADM.\n` +
          `Se um *link suspeito* aparecer apenas para o Sentinela, o autor será validado e removido automaticamente.`
        : `🛰️❌ *Kobayashi Sentinel desativado neste grupo.*`
    );
  }

  if (action === "delay") {
    const value = Number(args?.[1]);
    if (!Number.isFinite(value) || value < 1200 || value > 10000) {
      return reply(`⏱️ Use um valor entre *1200 e 10000 ms*.\nEx.: *${prefix}sentinel delay 2000*`);
    }
    const delayMs = setSentinelDelay(value);
    return reply(`⏱️ Confirmação do Sentinel definida para *${delayMs} ms*.`);
  }

  if (action === "log" || action === "logs") {
    const logs = getSentinelLogs(isGroup ? from : null, 10);
    if (!logs.length) return reply("🛰️ Ainda não existem detecções registradas.");

    return reply(
      `╭━━〔 🛰️ SENTINEL LOG 〕━━╮\n` +
      logs.map((x, i) =>
        `┃ ${i + 1}. ${x.action || "detectado"}\n` +
        `┃ 👤 ${String(x.senderJid || "desconhecido").split("@")[0]}\n` +
        `┃ 🆔 ${x.messageId || "—"}\n` +
        `┃ 🕒 ${new Date(x.timestamp || Date.now()).toLocaleString("pt-BR")}`
      ).join("\n┃\n") +
      `\n╰━━━━━━━━━━━━━━━━━━╯`
    );
  }

  if (action === "desconectar" || action === "stop") {
    const stopped = await stopSentinel();
    return reply(
      stopped
        ? "🛰️ Sentinela desconectado. A sessão foi preservada para reconectar depois."
        : "🛰️ O Sentinela já estava desconectado."
    );
  }

  return reply(`🛰️ Use *${prefix}sentinel status* para ver as opções.`);
}
break;

case "menuowner":
case "menudono":
if (!SoDono) return reply(mess.onlyOwner());
reagir("👑");
reply(buildOwnerMenu(prefix));
break;

case "menusticker":
case "menustk":
reagir("🎴");
reply(buildStickerMenu(prefix));
break;

case "menugeral":
case "geral":
reagir("🪷");
reply(buildGeneralMenu(prefix));
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
    const sincronizado = !status.available && String(status.local) === String(status.remote);

    return reply(
      `🐉🌸 *STATUS DA ATUALIZAÇÃO*\n\n` +
      `📦 Versão carregada: *${status.local}*\n` +
      `☁️ Versão no GitHub: *${status.remote}*\n` +
      `🔄 Sincronização: *${sincronizado ? "ATUALIZADO ✅" : "ATUALIZAÇÃO PENDENTE ⚠️"}*\n\n` +
      (status.available
        ? `🔄 Ainda existe uma atualização disponível no GitHub.`
        : `🌸 Kobayashi está sincronizada com a versão publicada.`)
    );
  } catch (e) {
    return reply(
      `🐉🌸 *STATUS DA ATUALIZAÇÃO*\n\n` +
      `📦 Versão carregada: *${getLocalVersion()}*\n` +
      `📦 Versão local lida dinamicamente: *${getLocalVersion()}* ✅\n` +
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
      `📁 Arquivos atualizados: *${result.files}*`
    );

    markPendingUpdateNews({
      targetJid: from,
      fromVersion: result.local,
      toVersion: result.remote,
      requestedBy: sender
    });

    await reply(
      `📰 *Update News preparado!*\n` +
      `Após reiniciar, a Kobayashi enviará aqui o resumo da nova versão.\n\n` +
      `💡 Depois você também pode usar *${prefix}novidades*.`
    );

    await reply("🐉 Reiniciando o Kobayashi Bot...");

    // npm start usa start.sh; ao encerrar, o loop inicia a versão nova.
    setTimeout(() => process.exit(0), 3500);
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

  if (!["on", "off"].includes(op)) {
    const cfg = readSettingsFile();
    return reply(
      `🛡️ *ANTI-PV*\n\n` +
      `Status: *${cfg.antiPv ? "ATIVADO ✅" : "DESATIVADO ❌"}*\n` +
      `Quando ativo, qualquer pessoa que chamar a Kobayashi no privado terá a tentativa bloqueada e o dono receberá:\n` +
      `• número/JID\n• ID da mensagem\n• tipo\n• conteúdo recebido\n\n` +
      `Use *${prefix}antipv on* ou *${prefix}antipv off*.`
    );
  }

  const cfg = readSettingsFile();
  cfg.antiPv = op === "on";
  writeSettingsFile(cfg);
  return reply(
    `🛡️🌸 Anti-PV *${cfg.antiPv ? "ativado" : "desativado"}* com sucesso.` +
    (cfg.antiPv ? `\n📨 Alertas de invasão serão enviados ao PV do dono.` : "")
  );
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

// 🛡️ ADMIN PRO v0.2.0
case "regras": {
  if (!isGroup) return reply(mess.onlyGroup());
  const rules = getRules(from);
  if (!rules) return reply(`📜🐉 *REGRAS DO GRUPO*\n\nNenhuma regra foi configurada ainda.\n\n🛡️ ADM: use *${prefix}setregras texto*`);
  return reply(`╭━━〔 📜 *REGRAS DO GRUPO* 〕━━╮\n\n${rules}\n\n╰━━〔 🐉 KOBAYASHI BOT 〕━━╯`);
}
break;

case "setregras": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!q.trim()) return reply(`📜 Use: *${prefix}setregras suas regras aqui*\n🗑️ Para apagar: *${prefix}delregras*`);
  setRules(from, q, sender);
  addAdminLog(from, { type: "setregras", actor: sender, detail: "Regras do grupo atualizadas" });
  return reply("✅📜 Regras do grupo atualizadas com sucesso.");
}
break;

case "delregras":
case "rmregras": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  clearRules(from);
  addAdminLog(from, { type: "delregras", actor: sender, detail: "Regras removidas" });
  return reply("🗑️📜 Regras removidas.");
}
break;

case "anotacao":
case "anotar": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!q.trim()) return reply(`📝 Use: *${prefix}anotacao texto da anotação*`);
  const note = addNote(from, q, sender);
  addAdminLog(from, { type: "anotacao", actor: sender, detail: `Nota #${note.id} criada` });
  return reply(`✅📝 Anotação *#${note.id}* salva.\n\n${note.text}`);
}
break;

case "anotacoes":
case "notas": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const notes = listNotes(from);
  if (!notes.length) return reply("📝 Não há anotações administrativas neste grupo.");
  const lines = notes.slice(-30).map(n => `*#${n.id}* • ${n.text}\n   👤 @${String(n.by||'').split('@')[0] || 'desconhecido'}`).join("\n\n");
  const mentions = [...new Set(notes.map(n=>n.by).filter(Boolean))];
  return conn.sendMessage(from, { text:`╭━━〔 📝 *ANOTAÇÕES ADM* 〕━━╮\n\n${lines}\n\n╰━━━━━━━━━━━━━━━━━━╯`, mentions }, { quoted: info });
}
break;

case "delanotacao":
case "rmanotacao": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const id = Number(args[0]);
  if (!Number.isInteger(id)) return reply(`🗑️ Use: *${prefix}delanotacao 3*`);
  const ok = removeNote(from, id);
  return reply(ok ? `✅ Anotação *#${id}* removida.` : `❌ Não encontrei a anotação #${id}.`);
}
break;

case "limparanotacoes": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const count = clearNotes(from);
  return reply(`🧹 ${count} anotação(ões) removida(s).`);
}
break;

case "listanegra":
case "blacklist": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  const target = getTargetFromMessage(info, null) || inputToJid(args[1] || (action ? "" : q));
  if (!action) {
    const list = getBlacklist(from);
    if (!list.length) return reply(`⛔ *LISTA NEGRA*\n\nNenhum usuário bloqueado.\n\n➕ ${prefix}listanegra add @membro motivo\n➖ ${prefix}listanegra del @membro`);
    const lines=list.map((jid,i)=>{ const m=getBlacklistMeta(from,jid); return `${i+1}. @${jid.split('@')[0]}${m?.reason?` — ${m.reason}`:''}`; }).join('\n');
    return conn.sendMessage(from,{text:`╭━━〔 ⛔ *LISTA NEGRA* 〕━━╮\n\n${lines}\n\n╰━━━━━━━━━━━━━━━━━━╯`,mentions:list},{quoted:info});
  }
  if (!["add","adicionar","+","del","remover","remove","-"].includes(action)) return reply(`⛔ Use:\n${prefix}listanegra add @membro motivo\n${prefix}listanegra del @membro\n${prefix}listanegra`);
  if (!target) return reply("👤 Marque ou responda a mensagem do usuário.");
  if (target === dono || isMainOwnerJid(target)) return reply("👑 O dono principal não pode entrar na lista negra.");
  if (["add","adicionar","+"].includes(action)) {
    const reason = args.slice(2).join(" ").trim();
    if (!reason) return reply(`⚠️ Informe o motivo.\nExemplo: *${prefix}listanegra add @membro golpes*`);
    addBlacklist(from,target,sender,reason);
    if (isBotGroupAdmins) await conn.groupParticipantsUpdate(from,[target],"remove").catch(()=>{});
    addPunishmentHistory(from, target, {
      type: "blacklist_add",
      reason,
      by: sender,
      source: "manual"
    });
    addAdminLog(from,{type:"blacklist_add",actor:sender,target,detail:reason});
    return conn.sendMessage(from,{text:`⛔ @${target.split('@')[0]} adicionado à lista negra.\n📝 Motivo: *${reason}*${isBotGroupAdmins?'\n🔨 Removido do grupo.':''}`,mentions:[target]},{quoted:info});
  }
  const ok=removeBlacklist(from,target);
  if (ok) {
    addPunishmentHistory(from, target, {
      type: "blacklist_remove",
      reason: "Removido da lista negra",
      by: sender,
      source: "manual"
    });
  }
  return conn.sendMessage(from,{text:ok?`✅ @${target.split('@')[0]} removido da lista negra.`:`⚠️ @${target.split('@')[0]} não estava na lista negra.`,mentions:[target]},{quoted:info});
}
break;

case "revogarlink":
case "resetlink": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  try {
    await conn.groupRevokeInvite(from);
    addAdminLog(from,{type:"revogarlink",actor:sender,detail:"Link de convite revogado"});
    return reply("✅🔗 Link antigo revogado. Use /linkgp para gerar/ver o novo link.");
  } catch (e) { console.error('[REVOGARLINK]',e?.message||e); return reply("❌ Não consegui revogar o link do grupo."); }
}
break;

case "banghost": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  const days = Math.max(1, Math.min(90, Number(args[0]) || 30));
  const limit = Date.now() - days*24*60*60*1000;
  const candidates = [];
  for (const p of groupMembers) {
    const jid = p.id || p.jid;
    if (!jid || groupAdmins.includes(jid) || jid===botNumber || jid===dono) continue;
    const a = getUserActivity(from,jid);
    const last = Number(a?.lastActivity || a?.lastMessageAt || 0);
    const msgs = Number(a?.messages || a?.count || 0);
    if ((!last && msgs===0) || (last && last < limit)) candidates.push(jid);
  }
  if (!candidates.length) return reply(`👻 Nenhum ghost encontrado com *${days} dias* de inatividade.`);
  if (String(args[1]||'').toLowerCase() !== 'confirmar') {
    const preview=candidates.slice(0,20).map((j,i)=>`${i+1}. @${j.split('@')[0]}`).join('\n');
    return conn.sendMessage(from,{text:`👻 *BANGHOST — PRÉVIA*\n\nCritério: sem atividade há *${days} dias*\nEncontrados: *${candidates.length}*\n\n${preview}${candidates.length>20?'\n…':''}\n\n⚠️ Para remover, use:\n*${prefix}banghost ${days} confirmar*`,mentions:candidates.slice(0,20)},{quoted:info});
  }
  const batch=candidates.slice(0,50);
  await conn.groupParticipantsUpdate(from,batch,'remove').catch(()=>{});
  addAdminLog(from,{type:'banghost',actor:sender,detail:`${batch.length} ghosts removidos • ${days} dias`});
  return reply(`👻🔨 *BANGHOST concluído*\n\nRemovidos: *${batch.length}*\nCritério: *${days} dias sem atividade*.`);
}
break;

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
