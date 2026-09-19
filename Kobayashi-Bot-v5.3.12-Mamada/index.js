/*
 * KOBAYASHI BOT
 * Criador: Luiz G. / Kobayashi
 * A venda, revenda ou comercialização desta base sem autorização do criador
 * é estritamente proibida.
 * © Luiz G. / Kobayashi.
 */
/* 🐉 KOBAYASHI BOT
Bot criado por Luiz G. / Kobayashi.

A venda deste bot sem autorização do criador é proibida.
Você pode alugar o bot diretamente com o criador.

Contato para aluguel:
WhatsApp: 5515997075304
*/

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
import { startPackageCapture, stopPackageCapture, captureStickerIfActive, getPackageCaptureStatus, saveCapturedPackage, getStickerPackage, listStickerPackages, deleteStickerPackage, getNextStickerFromPackage } from "./lib/features/stickers/stickerPackages.js";
import { getWhitelist, isWhitelisted, addWhitelist, removeWhitelist } from "./lib/features/moderation/whitelist.js";
import { trackAdminActivity, getAdminActivityRank, getAdminActivityStats, getAdminActivityUser, resetAdminActivityRank } from "./lib/features/moderation/adminActivityRank.js";
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
import { DRAGON_COMMUNITY_GROUPS, addDragonBan, removeDragonBan, listDragonBans, purgeDragonBannedUser } from "./lib/features/moderation/dragonBan.js";
import { resolveCommandAlias, getGroupCommandConfig, setSoAdm, blockGroupCommand, unblockGroupCommand, isGroupCommandBlocked, blockGlobalCommand, unblockGlobalCommand, getGlobalCommandBlock, addCommandAlias, removeCommandAlias, listCommandAliases, trackCommandUsage, getMostUsedCommands, getCommandStats, getTotalCommandUsage } from "./lib/features/system/commandControl.js";
import { getReleaseNotes, formatReleaseNotes, markPendingUpdateNews, consumePendingUpdateNews } from "./lib/features/system/updateNews.js";
import { getRental, registerRental, renewRental, removeRental, setPermanentRental, listRentals, setRentalRestriction, getRentalSettings, parseRentalDuration, formatRentalDuration, formatRentalDate, getRentalPlan, listRentalPlans, formatPlan, normalizeGroupJid, registerRentalByPlan, registerPartnerRental, registerTrialRental, renewRentalByPlan, setRentalWarnings } from "./lib/features/rental/rentalSystem.js";
import { setRentalResponsible, resetRentalResponsibleWarning, getRentalResponsible, ensureRentalResponsibleRuntime } from "./lib/features/rental/rentalResponsible.js";
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
  chooseDragonFaction, chooseDragonClass, startAwakeningBoss, transformDragon, returnHumanForm, useDragonSkill, restoreDragonEnergy, getAwakeningStatus, formatDragonRpgProfile, formatDragonRpgInventory,
  formatRpgMenu, formatRpgCommands, formatRpgClasses, formatClassInfo, formatRpgHelp, factionName,
  formatRpgRegions, startRpgBattle, rpgAttack, rpgDefend, rpgSkill, rpgUseItem, rpgFlee, rpgRest,
  rpgSpendStat, formatBattleStart, formatBattleAction, formatRpgQuests, acceptRpgQuest, claimRpgQuest, formatRpgRank,
  resetDragonRpgUsers, resetAllDragonRpg, formatRpgShop, buyRpgItem, equipRpgItem, unequipRpgItem, formatRpgEquipment, formatRpgSkills
, formatAdvancedClasses, chooseAdvancedClass} from "./lib/features/rpg/dragonRpg.js";
import { isDragonRpgEnabled, setDragonRpgEnabled } from "./lib/features/rpg/dragonRpgMode.js";
import { isKobaTriggerEnabled, setKobaTriggerEnabled } from "./lib/features/kobaTrigger.js";
import { configureSentinelBridgeRuntime, ensureSentinelBridgeServer, getSentinelBridgeStatus, rotateSentinelBridgeSecret, setSentinelBridgeEnabled, getSentinelBridgeLogs, processSentinelWhatsAppMessage, setSentinelWhatsAppNumber, setSentinelBridgeTestMode } from "./lib/features/moderation/sentinelBridge.js";
import { resolveV3Alias, runV3Standalone, processV3PassiveMessage, getV3Help } from "./lib/features/v3/v3Suite.js";

import { getGlobalManagementHelp, runGlobalManagementCommand, trackGlobalUsage } from "./lib/features/owner/globalManagement.js";
import { getBanMessageConfig, setBanMessageEnabled, listBanMessages, addBanMessage, removeBanMessage, matchBanMessage } from "./lib/features/moderation/banMessage.js";
import { activateLicense, validateLicense, getEffectiveLicense, getLicenseConfig, maskLicenseKey } from "./lib/features/license/licenseManager.js";
import { createLicense, listLicenses, getLicense, blockLicense, reactivateLicense, revokeInstallation } from "./lib/features/license/licenseAdmin.js";
import { DUNGEONS, RECIPES, MATERIALS, profile as dungeonProfile, dungeon as runDungeon, craft as craftDungeon, rest as restDungeon, fmt as fmtMaterials, needs as fmtNeeds } from "./lib/features/rpg/dungeonCraft.js";


import { getMemberEntry, recordMemberEntry } from "./lib/features/moderation/memberEntryHistory.js";
import { getCoreStatus, cleanCoreTemp } from "./lib/features/core/coreStability.js";
import {gamesEnabled,setGamesEnabled,startForca,playForca,startVelha,playVelha,boardVelha,startConnect4,playConnect4,boardConnect4} from "./lib/features/games/gamesV5.js";
import * as socialV5 from "./lib/features/social/socialV5.js";
const DRAGON_RPG_V3_COMMANDS = new Set([
  "masmorras",
  "dungeons",
  "masmorra",
  "dungeon",
  "materiais",
  "receitas",
  "crafts",
  "craft",
  "descansodungeon",
  "dragonrpg",
  "rpg",
  "menurpg"
]);

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

function setGroupProtection(groupJid, key, enabled) {
  const db = readProtectionDb();
  if (!db[groupJid]) db[groupJid] = {};
  db[groupJid][key] = Boolean(enabled);
  fs.writeFileSync(PROTECTION_DB, JSON.stringify(db, null, 2), "utf8");
  return Boolean(db[groupJid][key]);
}

function setYuriProtectionState(groupJid, key, enabled) {
  const current = Boolean(getYuriProtection(groupJid)?.[key]);
  if (current !== Boolean(enabled)) toggleYuriProtection(groupJid, key);
  return Boolean(getYuriProtection(groupJid)?.[key]);
}

function applyProtectionPreset(groupJid, level) {
  const normalized = String(level || "").toLowerCase();

  const presets = {
    baixa: {
      link: "light",
      telegram: true,
      antiSpam: false,
      antiFake: false,
      antiTrava: true,
      antiMention: true,
      mentionLimit: 20,
      antiLongText: true,
      textLimit: 12000,
      antiFloodMessage: false,
      floodLimit: 10,
      commandFlood: null,
      antiDelete: false,
      antiEdit: false,
      punishment: "adv",
      emergency: false
    },
    media: {
      link: "group",
      telegram: true,
      antiSpam: true,
      antiFake: false,
      antiTrava: true,
      antiMention: true,
      mentionLimit: 15,
      antiLongText: true,
      textLimit: 8000,
      antiFloodMessage: true,
      floodLimit: 10,
      commandFlood: 8,
      antiDelete: true,
      antiEdit: false,
      punishment: "adv",
      emergency: false
    },
    alta: {
      link: "hard",
      telegram: true,
      antiSpam: true,
      antiFake: true,
      antiTrava: true,
      antiMention: true,
      mentionLimit: 10,
      antiLongText: true,
      textLimit: 5000,
      antiFloodMessage: true,
      floodLimit: 7,
      commandFlood: 5,
      antiDelete: true,
      antiEdit: true,
      punishment: "ban",
      emergency: true
    },
    off: {
      link: "off",
      telegram: false,
      antiSpam: false,
      antiFake: false,
      antiTrava: false,
      antiMention: false,
      mentionLimit: 20,
      antiLongText: false,
      textLimit: 12000,
      antiFloodMessage: false,
      floodLimit: 10,
      commandFlood: null,
      antiDelete: false,
      antiEdit: false,
      punishment: "adv",
      emergency: false
    }
  };

  const cfg = presets[normalized];
  if (!cfg) return null;

  // Só um modo de AntiLink fica ativo por vez.
  setGroupProtection(groupJid, "antilink", cfg.link === "hard");
  setGroupProtection(groupJid, "antilinkgp", cfg.link === "group");
  setGroupProtection(groupJid, "antilinklight", cfg.link === "light");
  setGroupProtection(groupJid, "antitelegram", cfg.telegram);

  setAntiSpamEnabled(groupJid, cfg.antiSpam);
  setAntiFakeEnabled(groupJid, cfg.antiFake);

  updateAntiTravaConfig(groupJid, {
    enabled: cfg.antiTrava,
    antiMention: cfg.antiMention,
    mentionLimit: cfg.mentionLimit,
    antiLongText: cfg.antiLongText,
    textLimit: cfg.textLimit,
    antiFloodMessage: cfg.antiFloodMessage,
    floodLimit: cfg.floodLimit,
    punishment: cfg.punishment,
    emergency: cfg.emergency
  });

  configureAntiFlood(groupJid, cfg.commandFlood);
  setYuriProtectionState(groupJid, "antidel", cfg.antiDelete);
  setYuriProtectionState(groupJid, "antiedit", cfg.antiEdit);

  return {
    level: normalized,
    links: getGroupProtection(groupJid),
    antiSpam: getAntiSpamConfig(groupJid),
    antiFake: getAntiFakeConfig(groupJid),
    antiTrava: getAntiTravaConfig(groupJid),
    yuri: getYuriProtection(groupJid)
  };
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
  if (isWhitelisted(groupJid, target)) {
    console.log(`[WHITELIST] AutoMod ignorado para ${target} em ${groupJid}`);
    return { count: 0, removed: false, whitelisted: true };
  }

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
  // v2.0.32: todo resultado percentual é novo em cada execução.
  return Math.floor(Math.random() * 101);
}

function getKobayashiPersonality(groupJid, jid) {
  const randomPercent = () => Math.floor(Math.random() * 101);
  return {
    caos: randomPercent(),
    fofura: randomPercent(),
    aura: randomPercent(),
    coragem: randomPercent(),
    misterio: randomPercent(),
  };
}

function kobayashiPercentBar(value) {
  const n = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const fullBlocks = Math.floor(n / 10);
  const remainder = n % 10;
  const partialBlocks = ["", "▏", "▎", "▍", "▍", "▌", "▋", "▊", "▉", "▉"];
  const partial = remainder > 0 && fullBlocks < 10 ? partialBlocks[remainder] : "";
  const emptyBlocks = Math.max(0, 10 - fullBlocks - (partial ? 1 : 0));
  return `${"█".repeat(fullBlocks)}${partial}${"□".repeat(emptyBlocks)} ${n}%`;
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

async function notifyOwnerAntiPv(conn, ownerJid, { sender, messageId, messageText, type, mode="aviso" }) {
  if (!conn || !ownerJid || !sender) return false;

  const number = String(sender).split("@")[0] || "desconhecido";
  const modeLabel = {
    aviso: "⚠️ Aviso",
    bloquear: "🚫 Bloqueio",
    aluguel: "💼 Redirecionamento para aluguel"
  }[mode] || mode;

  const text =
    `🚨 *ANTI-PV • CONTATO DETECTADO*\n\n` +
    `• Número: @${number}\n` +
    `• ID: ${messageId || "não disponível"}\n` +
    `• Tipo: ${type || "mensagem"}\n` +
    `• Modo: ${modeLabel}\n` +
    `• Mensagem: ${messageText || "[sem conteúdo legível]"}`;

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


async function getBlacklistAliases(conn, groupJid, rawJid) {
  const aliases = new Set([rawJid].filter(Boolean));

  try {
    const pn = await getPNForJid(conn, rawJid, rawJid);
    if (pn) aliases.add(pn);
  } catch {}

  try {
    const metadata = await conn.groupMetadata(groupJid);
    for (const p of metadata?.participants || []) {
      const ids = [p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid].filter(Boolean);
      const rawNorm = (() => { try { return normalizeJid(rawJid); } catch { return rawJid; } })();
      const match = ids.some((id) => {
        if (id === rawJid) return true;
        try { return normalizeJid(id) === rawNorm; } catch { return false; }
      });
      if (!match) continue;

      for (const id of ids) aliases.add(id);
      for (const id of ids) {
        try {
          const pn = await getPNForJid(conn, id, id);
          if (pn) aliases.add(pn);
        } catch {}
      }
    }
  } catch {}

  return [...aliases].filter(Boolean);
}

async function getBlacklistState(conn, groupJid, rawJid) {
  const aliases = await getBlacklistAliases(conn, groupJid, rawJid);
  const global = aliases.some((jid) => {
    try { return isGloballyBlacklisted(jid); } catch { return false; }
  });
  const local = aliases.some((jid) => {
    try { return isBlacklisted(groupJid, jid); } catch { return false; }
  });
  return { aliases, global, local, blocked: global || local };
}

async function removeBlacklistedFromGroup(conn, groupJid, rawJid, { announce=false, source="auto" }={}) {
  const state = await getBlacklistState(conn, groupJid, rawJid);
  if (!state.blocked) return { removed:false, reason:"not-blacklisted", ...state };

  let metadata;
  try {
    metadata = await conn.groupMetadata(groupJid);
  } catch {
    return { removed:false, reason:"metadata-error", ...state };
  }

  const participants = metadata?.participants || [];
  const botRaw = conn?.user?.id;
  const botPN = await getPNForJid(conn, botRaw, conn?.user?.lid || conn?.user?.phoneNumber).catch(() => null);
  const botIds = new Set([botRaw, botPN, conn?.user?.lid, conn?.user?.phoneNumber].filter(Boolean));

  const botParticipant = participants.find((p) =>
    [p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).some((id) => {
      if (botIds.has(id)) return true;
      try {
        return [...botIds].some((b) => normalizeJid(id) === normalizeJid(b));
      } catch { return false; }
    })
  );

  const botIsAdmin = Boolean(botParticipant?.admin);
  if (!botIsAdmin) return { removed:false, reason:"bot-not-admin", ...state };

  const targetParticipant = participants.find((p) =>
    [p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).some((id) =>
      state.aliases.some((a) => {
        if (id === a) return true;
        try { return normalizeJid(id) === normalizeJid(a); } catch { return false; }
      })
    )
  );

  if (!targetParticipant) return { removed:false, reason:"not-in-group", ...state };

  const target =
    targetParticipant?.id ||
    targetParticipant?.jid ||
    targetParticipant?.participant ||
    rawJid;

  try {
    await conn.groupParticipantsUpdate(groupJid, [target], "remove");
    if (announce) {
      await conn.sendMessage(groupJid, {
        text:
          `🖤🔨 *LISTA NEGRA • REMOÇÃO AUTOMÁTICA*\n\n` +
          `@${String(target).split("@")[0]} foi removido automaticamente.\n` +
          `📌 Origem: *${state.global ? "Lista Negra Global" : "Lista Negra do Grupo"}*`,
        mentions:[target]
      }).catch(() => {});
    }
    console.log(`[LISTA NEGRA ${source}] removido ${target} de ${groupJid}`);
    return { removed:true, reason:"removed", target, ...state };
  } catch (e) {
    console.error(`[LISTA NEGRA ${source}]`, e?.message || e);
    return { removed:false, reason:"remove-error", error:e?.message || String(e), ...state };
  }
}

function blacklistDigits(value = "") {
  return String(value || "")
    .split("@")[0]
    .split(":")[0]
    .replace(/\D/g, "");
}

function blacklistNumberVariants(value = "") {
  const n = blacklistDigits(value);
  const set = new Set();
  if (!n) return set;
  set.add(n);

  // Compatibilidade BR: WhatsApp pode expor celular com/sem 9º dígito.
  if (n.startsWith("55") && n.length >= 12) {
    const ddd = n.slice(2, 4);
    const local = n.slice(4);
    if (local.length === 9 && local.startsWith("9")) set.add(`55${ddd}${local.slice(1)}`);
    if (local.length === 8) set.add(`55${ddd}9${local}`);
  }
  return set;
}

function blacklistJidMatches(a, b) {
  if (!a || !b) return false;
  if (String(a) === String(b)) return true;

  try {
    if (normalizeJid(a) === normalizeJid(b)) return true;
  } catch {}

  const av = blacklistNumberVariants(a);
  const bv = blacklistNumberVariants(b);
  return [...av].some((v) => bv.has(v));
}

async function buildBlacklistTargetAliases(conn, rawJid) {
  const aliases = new Set([rawJid].filter(Boolean));

  try {
    const pn = await getPNForJid(conn, rawJid, rawJid);
    if (pn) aliases.add(pn);
  } catch {}

  // Se chegou um PN, mantém também a forma normalizada.
  try {
    const normalized = normalizeJid(rawJid);
    if (normalized) aliases.add(normalized);
  } catch {}

  return [...aliases].filter(Boolean);
}

async function resolveParticipantForBlacklist(conn, participants, targetAliases) {
  // 1) comparação direta / normalizada / número.
  for (const p of participants || []) {
    const ids = [
      p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid
    ].filter(Boolean);

    if (ids.some((id) => targetAliases.some((alias) => blacklistJidMatches(id, alias)))) {
      return p;
    }
  }

  // 2) fallback LID -> PN em cada participante.
  // É mais custoso, por isso só roda quando a comparação normal falha.
  for (const p of participants || []) {
    const ids = [
      p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid
    ].filter(Boolean);

    for (const id of ids) {
      try {
        const pn = await getPNForJid(conn, id, p?.phoneNumber || p?.id || id);
        if (pn && targetAliases.some((alias) => blacklistJidMatches(pn, alias))) {
          return p;
        }
      } catch {}
    }
  }

  return null;
}

async function botIsAdminInMetadata(conn, participants = []) {
  const botIds = new Set([
    conn?.user?.id,
    conn?.user?.lid,
    conn?.user?.phoneNumber
  ].filter(Boolean));

  try {
    const pn = await getPNForJid(
      conn,
      conn?.user?.id,
      conn?.user?.phoneNumber || conn?.user?.lid || conn?.user?.id
    );
    if (pn) botIds.add(pn);
  } catch {}

  const botParticipant = (participants || []).find((p) => {
    const ids = [p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean);
    return ids.some((id) => [...botIds].some((botId) => blacklistJidMatches(id, botId)));
  });

  return Boolean(botParticipant?.admin === "admin" || botParticipant?.admin === "superadmin" || botParticipant?.admin);
}

async function removeResolvedParticipant(conn, groupJid, participant) {
  // Tenta os identificadores reais fornecidos pelos metadados.
  // Isso cobre servidores que esperam PN e servidores novos que entregam LID.
  const candidates = [...new Set([
    participant?.id,
    participant?.jid,
    participant?.participant,
    participant?.phoneNumber,
    participant?.lid
  ].filter(Boolean))];

  let lastError = null;
  for (const target of candidates) {
    try {
      await conn.groupParticipantsUpdate(groupJid, [target], "remove");
      return { ok:true, target };
    } catch (e) {
      lastError = e;
    }
  }

  return {
    ok:false,
    error:lastError?.message || String(lastError || "Falha ao remover")
  };
}

async function purgeUserFromAdminGroups(conn, rawJid, {
  announce = true,
  source = "blacklist-purge"
} = {}) {
  let groups = {};
  try {
    groups = await conn.groupFetchAllParticipating();
  } catch (e) {
    console.error(`[${source}] não foi possível listar grupos:`, e?.message || e);
    return { checked:0, adminGroups:0, found:0, removed:0, failures:0, details:[] };
  }

  const targetAliases = await buildBlacklistTargetAliases(conn, rawJid);
  let checked=0, adminGroups=0, found=0, removed=0, failures=0;
  const details=[];

  for (const groupJid of Object.keys(groups || {})) {
    checked++;

    let metadata;
    try {
      // Sempre busca metadados atualizados em vez de depender só do cache.
      metadata = await conn.groupMetadata(groupJid);
    } catch (e) {
      details.push({ groupJid, status:"metadata-error", error:e?.message || String(e) });
      continue;
    }

    const participants = metadata?.participants || [];
    const isAdmin = await botIsAdminInMetadata(conn, participants);
    if (!isAdmin) {
      details.push({ groupJid, name:metadata?.subject, status:"bot-not-admin" });
      continue;
    }

    adminGroups++;

    const participant = await resolveParticipantForBlacklist(conn, participants, targetAliases);
    if (!participant) {
      details.push({ groupJid, name:metadata?.subject, status:"not-in-group" });
      continue;
    }

    found++;
    const removal = await removeResolvedParticipant(conn, groupJid, participant);

    if (removal.ok) {
      removed++;
      details.push({
        groupJid,
        name:metadata?.subject,
        status:"removed",
        target:removal.target
      });

      if (announce) {
        await conn.sendMessage(groupJid, {
          text:
            `🖤🔨 *LISTA NEGRA • REMOÇÃO GLOBAL*\n\n` +
            `Um usuário bloqueado foi removido automaticamente pela Kobayashi.\n` +
            `📌 Origem: *${source}*`
        }).catch(() => {});
      }
    } else {
      failures++;
      details.push({
        groupJid,
        name:metadata?.subject,
        status:"remove-error",
        error:removal.error
      });
      console.error(`[${source}] falha em ${groupJid}:`, removal.error);
    }

    // Pequeno intervalo para não disparar alterações de participantes em rajada.
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  return { checked, adminGroups, found, removed, failures, details };
}

// Mantém compatibilidade com chamadas antigas.
async function purgeGlobalBlacklistedUser(conn, rawJid) {
  return purgeUserFromAdminGroups(conn, rawJid, {
    announce:true,
    source:"lista-negra-global"
  });
}

function ensureBlacklistJoinGuard(conn) {
  if (conn.__kobayashiBlacklistJoinGuard) return;
  conn.__kobayashiBlacklistJoinGuard = true;

  conn.ev.on("group-participants.update", async (event) => {try{if(event?.action==="add")for(const __p of (event?.participants||[]))recordMemberEntry(event.id,__p,Date.now());}catch(__e){console.error("[ENTRADA_MEMBRO]",__e?.message||__e);}

    try {
      if (String(event?.action || "").toLowerCase() !== "add") return;
      const groupJid = event?.id;
      const participants = Array.isArray(event?.participants) ? event.participants : [];
      if (!groupJid || !participants.length) return;

      for (const target of participants) {
        const result = await removeBlacklistedFromGroup(conn, groupJid, target, {
          announce:true,
          source:"join-guard"
        });

        if (result.removed) {
          addAdminLog(groupJid, {
            type:"blacklist_auto_remove",
            actor:"Kobayashi AutoGuard",
            target:result.target || target,
            detail:result.global ? "Lista Negra Global • reentrada bloqueada" : "Lista Negra Local • reentrada bloqueada"
          });
        }
      }
    } catch (e) {
      console.error("[LISTA NEGRA JOIN GUARD]", e?.stack || e?.message || e);
    }
  });
}

export default async function start(upsert, conn) {
ensureBlacklistJoinGuard(conn);
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



function resolveBanTarget(info, args=[]){
  const msg = info?.message || {};
  const contexts = [
    msg?.extendedTextMessage?.contextInfo,
    msg?.imageMessage?.contextInfo,
    msg?.videoMessage?.contextInfo,
    msg?.documentMessage?.contextInfo,
    msg?.stickerMessage?.contextInfo
  ].filter(Boolean);

  // Resposta a uma mensagem tem prioridade.
  for (const ctx of contexts) {
    const replied = ctx?.participant;
    if (replied) return String(replied);
  }

  // Depois, menção.
  for (const ctx of contexts) {
    const mentioned = Array.isArray(ctx?.mentionedJid) ? ctx.mentionedJid : [];
    if (mentioned.length) return String(mentioned[0]);
  }

  // Compatibilidade com número digitado.
  const raw = String(args?.[0] || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 8) return `${digits}@s.whatsapp.net`;

  return null;
}

function normalizeKobaIntentText(value=""){
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g," ");
}

// Registro completo dos comandos reconhecidos pelo bot.
// O Koba Trigger só dispara se a primeira ação corresponder a um comando real.
const citaLargeGroupCooldown = new Map();

const KOBA_TRIGGER_COMMANDS = new Set([
  "0",
  "1",
  "12345",
  "abraco",
  "abraço",
  "abrircaixa",
  "aceitar",
  "aceitarcasamento",
  "aceitarconvite",
  "aceitarpedido",
  "achievements",
  "add",
  "add_prefixo",
  "add_vord",
  "addalias",
  "addfontefig",
  "admincenter",
  "adminlogs",
  "admins",
  "adms",
  "adotar",
  "adotarfilho",
  "adotaruser",
  "adv",
  "advs",
  "afk",
  "ajudacmd",
  "aliaslist",
  "alugel_permanente",
  "aluguel",
  "aluguel_avisos",
  "aluguel_global",
  "aluguel_gratis",
  "aluguel_info",
  "aluguel_parceria",
  "aluguel_permanente",
  "aluguel_teste",
  "amizade",
  "anotacao",
  "anotacoes",
  "anotar",
  "antidel",
  "antiedit",
  "antifake",
  "antifarm",
  "antifarmdiario",
  "antiflood",
  "antifloodmensagem",
  "antifloodmsg",
  "antilink",
  "antilinkgp",
  "antilinklight",
  "antimencao",
  "antipv",
  "antispam",
  "antitelegram",
  "antitextao",
  "antitexto",
  "antitrava",
  "arena",
  "atacar",
  "ativar",
  "atividade",
  "atributorpg",
  "attstatus",
  "atualizar",
  "auction",
  "autosticker",
  "autostk",
  "b",
  "bam",
  "ban",
  "bang",
  "banc",
  "banfake",
  "banghost",
  "batalhar",
  "bemvindo",
  "blacklist",
  "blacklistg",
  "blockcmd",
  "blockcmdg",
  "boasvindas",
  "boost",
  "bossdespertar",
  "bossrpg",
  "botaoimagem",
  "botaotexto",
  "botaov2",
  "botaovideo",
  "bridge",
  "buy",
  "cafune",
  "carinho",
  "carteira",
  "casa",
  "casais",
  "casal",
  "casar",
  "categoriaslevel",
  "categoriasnivel",
  "centraladm",
  "chance",
  "changelog",
  "charada",
  "checkme",
  "cla",
  "claim",
  "class",
  "classe",
  "classeavancada",
  "classeinfo",
  "classesavancadas",
  "classeslevel",
  "classesrpg",
  "closegp",
  "coinflip",
  "coins",
  "coletar",
  "colher",
  "comandosrpg",
  "comer",
  "comprar",
  "comprarpremium",
  "comprarrpg",
  "configgp",
  "conquistas",
  "conselho",
  "convidar",
  "convite",
  "cook",
  "corrida",
  "cozinhar",
  "creator",
  "criador",
  "criarpersonagem",
  "crime",
  "cta_copy",
  "cta_url",
  "dado",
  "daily",
  "debugbv",
  "defender",
  "delalias",
  "delanotacao",
  "delcmd",
  "delfontefig",
  "delregras",
  "demitir",
  "desafio",
  "desafiomensal",
  "desafiosemanal",
  "desativar",
  "descansar",
  "descansodragao",
  "desequipar",
  "desequipartitulo",
  "desligar",
  "desmontar",
  "desmutar",
  "desmute",
  "despertar",
  "despertarboss",
  "despertardragao",
  "diagnostico",
  "diagnóstico",
  "diagpermissoes",
  "dismantle",
  "doar",
  "doargold",
  "dono",
  "dono1",
  "dono2",
  "dono3",
  "dono4",
  "dono5",
  "donos",
  "dragon_divulgacoes",
  "dragon_divulgações",
  "dragon_stickers",
  "dragondivulgacoes",
  "dragonfun",
  "dragonhelp",
  "dragonrpg",
  "dragonrpgmode",
  "dragonstickers",
  "dungeon",
  "eat",
  "elogio",
  "emergencia",
  "emprego",
  "encantar",
  "enchant",
  "energiadragao",
  "equipamentos",
  "equipar",
  "equipartitulo",
  "equippet",
  "escolherclasse",
  "escolherdragao",
  "escolherfaccao",
  "eununca",
  "eventos",
  "evoluir",
  "evolve",
  "explorar",
  "explore",
  "expulsar",
  "farm",
  "feed",
  "fig",
  "figurinha",
  "figurinhas",
  "fish",
  "fontefig",
  "fontesfig",
  "fontesfigurinha",
  "forge",
  "forjar",
  "formadragao",
  "formahumana",
  "foto_gp",
  "foto_menu",
  "fotobv",
  "fugir",
  "gado",
  "gay",
  "geral",
  "gold",
  "gostosa",
  "gostoso",
  "gp",
  "groupinfo",
  "grupoinfo",
  "guerra",
  "habilidade",
  "habilidadedragao",
  "habilidades",
  "harvest",
  "header",
  "help_vord",
  "helpcmd",
  "hetero",
  "hidetag",
  "historico",
  "historicomod",
  "horta",
  "house",
  "humano",
  "hunt",
  "id1",
  "id2",
  "id_resposta",
  "inativos",
  "info_adv",
  "infoadv",
  "infogrupo",
  "ingredientes",
  "interativo",
  "interativoimagem",
  "interativovideo",
  "inv",
  "inventario",
  "inventariorpg",
  "investir",
  "item",
  "kobaban",
  "kobamode",
  "koban",
  "kobatrigger",
  "kobayashi-666",
  "leilao",
  "letra",
  "level",
  "lideres",
  "ligar",
  "limiteflood",
  "limitemencao",
  "limitemencoes",
  "limitetexto",
  "limparanotacoes",
  "limparhistorico",
  "limparpunicoes",
  "linda",
  "lindo",
  "linkgp",
  "lid",
  "linkgrupo",
  "lista",
  "lista_alugel",
  "lista_aluguel",
  "listaadv",
  "listabranca",
  "listadv",
  "listaliases",
  "listanegra",
  "listanegrag",
  "listanegraglobal",
  "listcmdsticker",
  "logs",
  "loja",
  "lojapremium",
  "lojarpg",
  "loteria",
  "lucy",
  "lyrics",
  "líderes",
  "maid_dragon",
  "maid_femboy",
  "maid_porn",
  "maiddragon",
  "maidfemboy",
  "maidporn",
  "masmorra",
  "materiais",
  "menu",
  "menuadm",
  "menubn",
  "menubrincadeiras",
  "menudiversao",
  "menudono",
  "menudragon",
  "menugeral",
  "menujogos",
  "menulevel",
  "menuloja",
  "menunivel",
  "menuowner",
  "menurpg",
  "menushop",
  "menusocial",
  "menusticker",
  "menustk",
  "mercado",
  "mine",
  "minerar",
  "missao",
  "missoes",
  "modobrincadeira",
  "morde",
  "julgar",
  "gozar",
  "mamada",
  "morder",
  "mododragonrpg",
  "modoemergencia",
  "moeda",
  "motivacional",
  "mutar",
  "mute",
  "nivel",
  "nivelinfo",
  "nome_gp",
  "notas",
  "novidades",
  "numero_bot",
  "numero_dono",
  "número_bot",
  "número_dono",
  "off",
  "on",
  "onlyadm",
  "opcao1",
  "opcao2",
  "opencaixa",
  "opengp",
  "opengp_off",
  "owner",
  "packfig",
  "pacote",
  "pagar",
  "paineladm",
  "painelprotecao",
  "painelsistemas",
  "papel",
  "parceriasbv",
  "pay",
  "pedra",
  "perfil",
  "perfilrpg",
  "permissoesbot",
  "petbattle",
  "petbet",
  "pets",
  "piada",
  "ping",
  "pix",
  "plano",
  "planos",
  "plans",
  "plantacao",
  "plantar",
  "play",
  "ppt",
  "precos",
  "prefixo",
  "presente",
  "prestige",
  "promover",
  "propriedades",
  "protecao",
  "proteções",
  "punicao_trava",
  "punicoes",
  "punirtrava",
  "quando",
  "quests",
  "quick_reply",
  "rank",
  "rankadm",
  "rankcoins",
  "rankgay",
  "rankglobal",
  "rankgold",
  "rankgostosa",
  "rankgostoso",
  "rankhetero",
  "ranklinda",
  "ranklindo",
  "ranknivel",
  "ranknivelg",
  "rankpts",
  "rankrpg",
  "rankxp",
  "rankxpg",
  "rebaixar",
  "receitas",
  "recusarconvite",
  "regioes",
  "registrar_aluguel",
  "regras",
  "regrasbv",
  "reiniciar",
  "remover_aluguel",
  "removerlistanegrag",
  "removerparceriabv",
  "rename",
  "renamepet",
  "renovar_alugel",
  "renovar_aluguel",
  "rep",
  "reparar",
  "reputacao",
  "resetlink",
  "resetrankadm",
  "responder",
  "revogarlink",
  "rg_aluguel",
  "rgcmd",
  "rgfigu",
  "rm_adv",
  "rm_aluguel",
  "rm_closegp",
  "rm_opengp",
  "rm_vord",
  "rmadv",
  "rmanotacao",
  "rmblacklistg",
  "rmclosegp",
  "rmconvite",
  "rmfotobv",
  "rmlistanegrag",
  "rmopengp",
  "rmparceriabv",
  "rmregras",
  "roubar",
  "rpg",
  "rpgajuda",
  "rpgatacar",
  "rpgatributo",
  "rpgclasse",
  "rpgclasseinfo",
  "rpgclasses",
  "rpgcomandos",
  "rpgcomprar",
  "rpgcriar",
  "rpgdefender",
  "rpgdescansar",
  "rpgdesequipar",
  "rpgdragao",
  "rpgequipamentos",
  "rpgequipar",
  "rpgfaccao",
  "rpgfugir",
  "rpghabilidade",
  "rpghabilidades",
  "rpginventario",
  "rpgitem",
  "rpgloja",
  "rpgmissao",
  "rpgmissoes",
  "rpgperfil",
  "rpgrank",
  "rpgregioes",
  "rr",
  "s",
  "sair",
  "sair_familia",
  "saldo",
  "sell",
  "sementes",
  "sentinel",
  "sentinelbridge",
  "setbv",
  "setbye",
  "setcmd",
  "setparceriasbv",
  "setregras",
  "setregrasbv",
  "ship",
  "shipo",
  "single_select",
  "sistemanivel",
  "sistemas",
  "sistemasgp",
  "skilldragao",
  "skillsrpg",
  "soadm",
  "soadmin",
  "sorte",
  "speedup",
  "st",
  "status_bot",
  "status_vord",
  "statusatt",
  "statusbot",
  "statusbv",
  "statusdespertar",
  "statusgp",
  "statusgrupo",
  "statusupdate",
  "steal",
  "sticker",
  "stickercmds",
  "stickerpack",
  "stickers",
  "stk",
  "streak",
  "suicidio",
  "suicídio",
  "take",
  "tempobv",
  "tesoura",
  "testebv",
  "togif",
  "toimage",
  "toimg",
  "topativos",
  "topcmds",
  "topcoins",
  "toplevel",
  "torneio",
  "totag",
  "totalcmd",
  "train",
  "transformar",
  "tributos",
  "unblockcmd",
  "unblockcmdg",
  "unmute",
  "untitle",
  "update",
  "v",
  "vab",
  "vagas",
  "vendercomida",
  "ver_alugel",
  "ver_aluguel",
  "versao",
  "version",
  "vote",
  "whitelist",
  "work",
  "xp",
  "zeraranknivel",
  "zeraranknivelg",
  "zerarrpg",
  "zerarrpgg",
  "masmorras",
  "dungeons",
  "crafts",
  "craft",
  "descansodungeon"
]);

function resolveKobaTrigger(messageText, prefix="/"){
  const raw = String(messageText || "").trim();
  if(!raw) return null;

  const match = raw.match(/^koba(?:yashi)?\s+(.+)$/i);
  if(!match) return null;

  const intentRaw = match[1].trim();
  if(!intentRaw) return null;

  // Atalhos naturais mais amigáveis.
  const naturalRules = [
    {re:/^(?:tocar|toca|musica|música)\s+(.+)$/i, cmd:"play"},
    {re:/^(?:figurinha|sticker)\s*$/i, cmd:"s"},
    {re:/^(?:advertir|advertencia|advertência)\s+(.+)$/i, cmd:"adv"},
    {re:/^(?:tirar advertencia|tirar advertência)\s+(.+)$/i, cmd:"rmadv"},
    {re:/^(?:dragon rpg|rpg dragao|rpg dragão)\s*$/i, cmd:"dragonrpg"}
  ];

  for(const rule of naturalRules){
    const m = intentRaw.match(rule.re);
    if(m){
      const rest = m[1]?.trim();
      return `${prefix}${rule.cmd}${rest ? ` ${rest}` : ""}`;
    }
  }

  // Sistema universal:
  // "Koba <qualquer-comando-real> <argumentos>" -> "/<comando> <argumentos>"
  const parts = intentRaw.split(/\s+/);
  const candidateRaw = String(parts.shift() || "");
  const candidate = normalizeKobaIntentText(candidateRaw);

  if(!KOBA_TRIGGER_COMMANDS.has(candidate)) return null;

  const rest = parts.join(" ").trim();
  return `${prefix}${candidateRaw}${rest ? ` ${rest}` : ""}`;
}

let body = extractCommandText(info.message) || info?.text || "";

// Koba Trigger: só converte intenções conhecidas em comandos reais.
// Frases como "Koba tudo bem?" continuam sem resposta.
if (body && !body.startsWith(prefix)) {
  const triggerEnabled = !isGroup || isKobaTriggerEnabled(from);
  if (triggerEnabled) {
    const mapped = resolveKobaTrigger(body, prefix);
    if (mapped) body = mapped;
  }
}

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

// Parser universal de comandos:
// lê a mensagem inteira depois do prefixo e separa comando + complementos.
// Ex.: /dragonrpg off -> rawCommand="dragonrpg", args=["off"], q="off".
const fullCommandText = isCmd ? body.slice(prefix.length).trim() : "";
const commandParts = fullCommandText ? fullCommandText.split(/\s+/) : [];
const rawCommand = isCmd
  ? String(commandParts.shift() || "").toLowerCase()
  : null;

const command = isCmd
  ? resolveCommandAlias(resolveV3Alias(rawCommand))
  : null;

// Complementos preservados para TODOS os comandos.
const args = commandParts;
const q = args.join(" ").trim();
const commandWithArgs = isCmd
  ? `${command || rawCommand}${q ? ` ${q}` : ""}`
  : "";

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

// 👑 Dono principal • reconhecimento definitivo PN/LID/BR
// Aceita:
// - PN normal (@s.whatsapp.net)
// - LID resolvido pelo Baileys
// - participant / participantAlt / phoneNumber / jid / lid
// - variação brasileira antiga sem o 9º dígito
// - número principal configurado + fallback do criador
const runtimeSettings = readSettingsFile();

const CREATOR_OWNER_FALLBACK = "5515997075304";

const normalizeOwnerDigits = (value) => {
  let n = onlyDigits(String(value || ""));
  // Remove prefixos internos que às vezes aparecem antes do número real.
  if (n.length > 13 && n.startsWith("0")) n = n.replace(/^0+/, "");
  return n;
};

const ownerNumberVariants = (value) => {
  const n = normalizeOwnerDigits(value);
  const set = new Set();
  if (!n) return set;
  set.add(n);

  // Brasil: 55 + DDD + celular. O WhatsApp pode expor o PN com ou sem o 9.
  if (n.startsWith("55")) {
    const ddd = n.slice(2, 4);
    const local = n.slice(4);

    if (local.length === 9 && local.startsWith("9")) {
      set.add(`55${ddd}${local.slice(1)}`);
    }
    if (local.length === 8) {
      set.add(`55${ddd}9${local}`);
    }
  }
  return set;
};

const configuredOwnerCandidates = [
  runtimeSettings?.ownerNumber,
  ownerNumber,
  process.env.KOBAYASHI_OWNER,
  CREATOR_OWNER_FALLBACK
].filter(Boolean);

const configuredOwnerVariants = new Set();
for (const n of configuredOwnerCandidates) {
  for (const variant of ownerNumberVariants(n)) configuredOwnerVariants.add(variant);
}

const primaryOwnerDigits =
  normalizeOwnerDigits(runtimeSettings?.ownerNumber) ||
  normalizeOwnerDigits(ownerNumber) ||
  CREATOR_OWNER_FALLBACK;

const dono = `${primaryOwnerDigits}@s.whatsapp.net`;

const incomingIdentityCandidates = [
  rawSender,
  sender,
  senderLid,
  info?.key?.participant,
  info?.key?.participantAlt,
  info?.participant,
  info?.participantAlt,
  info?.message?.extendedTextMessage?.contextInfo?.participant,
  info?.message?.extendedTextMessage?.contextInfo?.participantAlt
].filter(Boolean);

const senderParticipant = isGroup
  ? (groupMetadata?.participants || []).find((p) => {
      const participantIds = [
        p?.id,
        p?.jid,
        p?.participant,
        p?.phoneNumber,
        p?.lid
      ].filter(Boolean).map(String);

      return participantIds.some((id) =>
        incomingIdentityCandidates.some((incoming) => String(incoming) === id)
      );
    })
  : null;

const ownerIdentityCandidates = [...new Set([
  ...incomingIdentityCandidates,
  senderParticipant?.id,
  senderParticipant?.jid,
  senderParticipant?.participant,
  senderParticipant?.phoneNumber,
  senderParticipant?.lid
].filter(Boolean).map(String))];

const jidLocalDigits = (jid) => {
  const local = String(jid || "").split("@")[0].split(":")[0];
  return normalizeOwnerDigits(local);
};

const ownerMatchedByNumber = ownerIdentityCandidates.some((jid) => {
  const digits = jidLocalDigits(jid);
  if (!digits) return false;
  const variants = ownerNumberVariants(digits);
  return [...variants].some((variant) => configuredOwnerVariants.has(variant));
});

const ownerMatchedByStore = ownerIdentityCandidates.some((jid) => {
  try {
    return Boolean(isMainOwnerJid(jid));
  } catch {
    return false;
  }
});

// Se sender foi convertido para PN, valida também o PN resolvido explicitamente.
let resolvedOwnerPn = null;
for (const jid of ownerIdentityCandidates) {
  try {
    const candidate = await getPNForJid(conn, jid);
    if (candidate) {
      resolvedOwnerPn = candidate;
      const variants = ownerNumberVariants(jidLocalDigits(candidate));
      if ([...variants].some((variant) => configuredOwnerVariants.has(variant))) break;
      resolvedOwnerPn = null;
    }
  } catch {}
}

const ownerMatchedByResolvedPn = Boolean(resolvedOwnerPn);

const SoDonoPrincipal =
  ownerMatchedByNumber ||
  ownerMatchedByStore ||
  ownerMatchedByResolvedPn;

const SoLider = ownerIdentityCandidates.some((jid) => {
  try {
    return Boolean(isLeaderJid(jid));
  } catch {
    return false;
  }
});

const SoDono = SoDonoPrincipal || SoLider;

// 🛰️ SENTINEL WA • recebe alertas assinados enviados pelo número observador.
// É processado antes do Anti-PV para a própria proteção do PV não bloquear a ponte.
configureSentinelBridgeRuntime(conn, {
  ownerJids: [...new Set([dono, ...ownerIdentityCandidates].filter(Boolean))],
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
  if (isGroup) {
    await removeBlacklistedFromGroup(conn, from, sender, {
      announce:true,
      source:"message-global"
    }).catch(() => {});
  }
  continue;
}


// 🚨 BAN MSG GLOBAL v3.0.8
// Detecta frases registradas pelo dono. O autor é removido, entra na
// Lista Negra Global e é expulso dos demais grupos onde a Kobayashi puder agir.
if (
  isGroup &&
  !info.key.fromMe &&
  !SoDonoPrincipal &&
  !isCmd &&
  sender &&
  body
) {
  const banMsgRule = matchBanMessage(body);

  if (banMsgRule) {
    const resolvedBanMsgJid =
      (await getPNForJid(
        conn,
        sender,
        senderParticipant?.phoneNumber ||
        info?.key?.participantAlt ||
        senderParticipant?.id
      ).catch(() => null)) ||
      sender;

    const targetBanMsg = normalizeBlacklistJid(resolvedBanMsgJid);

    if (targetBanMsg) {
      // v4.0.4 — ação imediata no grupo onde o BAN MSG foi disparado.
      // A Kobayashi precisa ser ADM para apagar a mensagem de outro membro
      // e para remover o participante.
      let banMsgDeleted = false;
      let banMsgDeleteError = "";
      try {
        await conn.sendMessage(from, { delete: info.key });
        banMsgDeleted = true;
      } catch (e) {
        banMsgDeleteError = e?.message || String(e);
      }

      let banMsgCurrentGroupRemoved = false;
      let banMsgCurrentGroupRemoveError = "";
      try {
        const currentMetadata = await conn.groupMetadata(from);
        const currentParticipants = currentMetadata?.participants || [];
        const aliases = await buildBlacklistTargetAliases(conn, targetBanMsg);
        const currentTarget = await resolveParticipantForBlacklist(conn, currentParticipants, aliases);

        if (currentTarget) {
          const localRemoval = await removeResolvedParticipant(conn, from, currentTarget);
          banMsgCurrentGroupRemoved = Boolean(localRemoval?.ok);
          if (!localRemoval?.ok) {
            banMsgCurrentGroupRemoveError = localRemoval?.error || "remoção recusada";
          }
        } else {
          banMsgCurrentGroupRemoveError = "participante não localizado no grupo atual";
        }
      } catch (e) {
        banMsgCurrentGroupRemoveError = e?.message || String(e);
      }

      const alreadyGlobal = getGlobalBlacklistEntry(targetBanMsg);

      if (!alreadyGlobal) {
        addGlobalBlacklist(targetBanMsg, {
          reason: `BAN MSG: ${banMsgRule.text}`,
          by: "ban_msg",
          sourceGroup: from,
          sourceMessage: String(body).slice(0, 2000),
          createdAt: Date.now()
        });
      }

      const purgeBanMsg = await purgeUserFromAdminGroups(conn, targetBanMsg, {
        announce:true,
        source:"BAN MSG"
      }).catch(() => ({
        checked:0, adminGroups:0, found:0, removed:0, failures:0
      }));

      const detectedName = String(pushname || senderParticipant?.notify || "Usuário").trim();
      const detectedNumber = String(targetBanMsg).split("@")[0] || "desconhecido";
      const occurredAt = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour12: false
      });

      const ownerAudit =
        `╭═══════ ❀ 🐉 ❀ ═══════╮\n` +
        `   🚨 *BAN MSG • AUDITORIA* 🚨\n` +
        `╰═══════ ❀ 🖤 ❀ ═══════╯\n\n` +
        `╭─〔 🛡️ *OCORRÊNCIA* 〕\n` +
        `│ 👤 Nome › *${detectedName || "Usuário"}*\n` +
        `│ 📱 Número › @${detectedNumber}\n` +
        `│ 👥 Grupo › *${groupName || "Grupo"}*\n` +
        `│ 🆔 Grupo ID › ${from}\n` +
        `│ 🕒 Horário › *${occurredAt}*\n` +
        `╰────────────────\n\n` +
        `╭─〔 🚫 *REGRA ACIONADA* 〕\n` +
        `│ ${banMsgRule.text}\n` +
        `╰────────────────\n\n` +
        `╭─〔 💬 *TEXTO ENVIADO* 〕\n` +
        `│ ${String(body).slice(0, 3500)}\n` +
        `╰────────────────\n\n` +
        `╭─〔 ✅ *RESULTADO* 〕\n` +
        `│ 🗑️ Mensagem apagada: *${banMsgDeleted ? "SIM ✅" : "NÃO ❌"}*\n` +
        `│ 👢 Removido deste grupo: *${banMsgCurrentGroupRemoved ? "SIM ✅" : "NÃO ❌"}*\n` +
        `│ 🖤 Lista Negra Global: *ATIVADA*\n` +
        `│ 🔎 Grupos verificados: *${Number(purgeBanMsg?.checked || 0)}*\n` +
        `│ 🛡️ Grupos onde sou ADM: *${Number(purgeBanMsg?.adminGroups || 0)}*\n` +
        `│ 👤 Encontrado em: *${Number(purgeBanMsg?.found || 0)}*\n` +
        `│ 🔨 Removido de: *${Number(purgeBanMsg?.removed || 0)}*\n` +
        `│ ❌ Falhas: *${Number(purgeBanMsg?.failures || 0)}*\n` +
        (!banMsgDeleted && banMsgDeleteError ? `│ ⚠️ Apagar: ${banMsgDeleteError}\n` : "") +
        (!banMsgCurrentGroupRemoved && banMsgCurrentGroupRemoveError ? `│ ⚠️ Remoção local: ${banMsgCurrentGroupRemoveError}\n` : "") +
        `╰────────────────`;

      await conn.sendMessage(dono, {
        text: ownerAudit,
        mentions: [targetBanMsg]
      }).catch((e) => console.error("[BAN MSG AUDITORIA]", e?.message || e));

      addAdminLog(from, {
        type: "ban_msg",
        actor: targetBanMsg,
        detail: `BAN MSG acionado: ${banMsgRule.text} | mensagem_apagada=${banMsgDeleted} | removido_grupo_atual=${banMsgCurrentGroupRemoved} | purge_global=${Number(purgeBanMsg?.removed || 0)}`
      });

      // Não deixa a mensagem seguir para os demais sistemas do bot.
      continue;
    }
  }
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

if (!isGroup && !isStatus && !info.key.fromMe && !SoDono) {
  // Compatibilidade: instalações antigas com antiPv=true entram em modo aviso.
  const antiPvMode = String(
    runtimeSettings?.antiPvMode ||
    (runtimeSettings?.antiPv ? "aviso" : "off")
  ).toLowerCase();

  if (["aviso","bloquear","aluguel"].includes(antiPvMode)) {
    const antiPvPreview = auditMessagePreview(info, body, type);

    await notifyOwnerAntiPv(conn, dono, {
      sender,
      messageId: info?.key?.id,
      messageText: antiPvPreview,
      type,
      mode: antiPvMode
    });

    if (antiPvMode === "aviso") {
      await conn.sendMessage(
        from,
        {
          text:
            "⚠️🐉 *ANTI-PV KOBAYASHI*\n\n" +
            "Meu privado não é destinado ao uso comum do bot.\n" +
            "Por favor, utilize a Kobayashi nos grupos autorizados.\n\n" +
            "📨 O criador foi avisado sobre este contato."
        },
        { quoted: info }
      ).catch(() => {});
      continue;
    }

    if (antiPvMode === "bloquear") {
      await conn.sendMessage(
        from,
        {
          text:
            "🚫🐉 *ANTI-PV KOBAYASHI*\n\n" +
            "Contatos não autorizados no privado são bloqueados automaticamente."
        },
        { quoted: info }
      ).catch(() => {});

      try {
        if (typeof conn.updateBlockStatus === "function") {
          await conn.updateBlockStatus(sender, "block");
        } else {
          console.log("[ANTI-PV] updateBlockStatus indisponível nesta versão do Baileys.");
        }
      } catch (e) {
        console.error("[ANTI-PV BLOQUEAR]", e?.message || e);
      }
      continue;
    }

    if (antiPvMode === "aluguel") {
      const rentUrl = "https://wa.me/5515997075304?text=Quero%20alugar%20o%20bot%2C%20como%20fa%C3%A7o%3F";
      await conn.sendMessage(
        from,
        {
          text:
            "💼🐉 *QUER USAR A KOBAYASHI?*\n\n" +
            "Este privado não é usado para comandos.\n" +
            "Você pode alugar o bot diretamente com o criador, Luiz G. / Kobayashi.\n\n" +
            "📲 *Falar com o criador e ver o aluguel:*\n" +
            `${rentUrl}`
        },
        { quoted: info }
      ).catch(() => {});
      continue;
    }
  }
}


// 🎴 PACOTES • captura as figurinhas recebidas enquanto /pacote fig on estiver ativo.
if (!info.key.fromMe && type === "stickerMessage") {
  try {
    const captureStatus = getPackageCaptureStatus(from);
    if (captureStatus.active) {
      const stickerBuffer = await downloadMediaMessage(info, "buffer", {});
      const captureResult = captureStickerIfActive(from, stickerBuffer);
      if (captureResult?.reason === "limit") {
        await conn.sendMessage(from, {
          text: "🎴⚠️ A captura chegou ao limite de *250 figurinhas* e foi pausada automaticamente."
        }).catch(() => {});
      }
    }
  } catch (e) {
    console.error("[PACOTE CAPTURE]", e?.message || e);
  }
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
// 👑 RankADM — registra apenas atividade feita enquanto o membro é ADM.
if (isGroup && isGroupAdmins && !info.key.fromMe) {
  let rankAdmKind = null;
  if (isCmd) rankAdmKind = "command";
  else if (info?.message?.stickerMessage) rankAdmKind = "sticker";
  else if (info?.message?.imageMessage) rankAdmKind = "photo";
  else if (info?.message?.videoMessage) rankAdmKind = "video";
  else if (info?.message?.conversation || info?.message?.extendedTextMessage?.text) rankAdmKind = "text";
  if (rankAdmKind) try { trackAdminActivity(from, sender, rankAdmKind); } catch (e) { console.log("[RANKADM]",e?.message||e); }
}


// 🤍 WHITELIST HARD GUARD • v2.0.12
// Proteção no nível do socket: qualquer remoção feita pelo bot passa por esta barreira.
// Isso cobre AntiLink, AntiSpam, AntiTrava, BanFake, Banghost, Sentinel e handlers externos
// que usem o mesmo conn.groupParticipantsUpdate().
if (!conn.__kobayashiWhitelistHardGuard) {
  const originalGroupParticipantsUpdate = conn.groupParticipantsUpdate.bind(conn);

  conn.groupParticipantsUpdate = async (groupJid, participants, action, ...rest) => {
    if (String(action || "").toLowerCase() !== "remove") {
      return originalGroupParticipantsUpdate(groupJid, participants, action, ...rest);
    }

    const list = Array.isArray(participants) ? participants : [participants];
    let metadata = null;

    try {
      metadata = await conn.groupMetadata(groupJid);
    } catch {}

    const groupParts = Array.isArray(metadata?.participants) ? metadata.participants : [];
    const protectedJids = [];
    const allowedJids = [];

    for (const rawTarget of list.filter(Boolean)) {
      const aliases = new Set([rawTarget]);

      try {
        const pn = await getPNForJid(conn, rawTarget, rawTarget);
        if (pn) aliases.add(pn);
      } catch {}

      // Procura o mesmo participante em todos os identificadores que o WhatsApp/Baileys fornece.
      for (const p of groupParts) {
        const ids = [
          p?.id,
          p?.jid,
          p?.participant,
          p?.phoneNumber,
          p?.lid
        ].filter(Boolean);

        const normalizedTarget = normalizeJid(rawTarget);
        const matches = ids.some((id) => {
          if (id === rawTarget) return true;
          try {
            if (normalizeJid(id) === normalizedTarget) return true;
          } catch {}
          return false;
        });

        if (matches) {
          for (const id of ids) aliases.add(id);

          for (const id of ids) {
            try {
              const pn = await getPNForJid(conn, id, id);
              if (pn) aliases.add(pn);
            } catch {}
          }
        }
      }

      const blacklistedMember = [...aliases].some((jid) => {
        try {
          return isGloballyBlacklisted(jid) || isBlacklisted(groupJid, jid);
        } catch {
          return false;
        }
      });

      // 🖤 Lista Negra tem prioridade sobre Lista Branca.
      // Assim, quem está bloqueado local/globalmente pode ser removido pelo AutoGuard.
      const protectedMember = !blacklistedMember && [...aliases].some((jid) => {
        try {
          return isWhitelisted(groupJid, jid);
        } catch {
          return false;
        }
      });

      if (protectedMember) {
        protectedJids.push(rawTarget);
        console.log(
          `[WHITELIST HARD GUARD] Remoção BLOQUEADA: ${rawTarget} em ${groupJid}`
        );
      } else {
        allowedJids.push(rawTarget);
      }
    }

    if (!allowedJids.length) {
      return {
        status: "whitelist-blocked",
        protected: protectedJids
      };
    }

    return originalGroupParticipantsUpdate(groupJid, allowedJids, action, ...rest);
  };

  conn.__kobayashiWhitelistHardGuard = true;
}

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
if (isGroup && sender && !info.key.fromMe && isBlacklisted(from, sender) && !SoDono && !isWhitelisted(from, sender)) {
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
if (isGroup && sender && !info.key.fromMe && sender !== botNumber && !isWhitelisted(from, sender)) {
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
ensureRentalResponsibleRuntime(conn);

// 🐉 KOBAYASHI RENTAL SYSTEM • v2.0.29
// ==========================================
if (isCmd && command && !SoDonoPrincipal) {
  const rentalSettings = getRentalSettings();
  const rentalSafeCommands = new Set([
    "planos", "plans", "plano", "ver_aluguel", "ver_alugel", "aluguel_info",
    "dono", "owner", "criador", "version"
  ]);

  let blockedByRental = false;
  let rentalState = isGroup ? getRental(from) : null;
  const expiredRental = Boolean(isGroup && rentalState?.exists && !rentalState?.active && !rentalState?.permanent);

  // Se um aluguel registrado venceu, trava absoluta: somente o dono principal usa comandos.
  if (expiredRental) {
    blockedByRental = true;
  } else if (rentalSettings.globalRestrictionEnabled) {
    if (!isGroup) blockedByRental = true;
    else blockedByRental = !rentalState?.active;
  } else if (rentalSettings.groupRestrictionEnabled && isGroup) {
    blockedByRental = !rentalState?.active;
  }

  if (blockedByRental && (expiredRental || !rentalSafeCommands.has(command))) {
    const expired = expiredRental;
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

// V5.3 • Social aprimorado: sair do AFK automaticamente e avisar quando alguém AFK é mencionado.
if (isGroup && sender && socialV5.v5SocialEnabled(from)) {
  const socialCtx =
    info?.message?.extendedTextMessage?.contextInfo ||
    info?.message?.imageMessage?.contextInfo ||
    info?.message?.videoMessage?.contextInfo ||
    info?.message?.documentMessage?.contextInfo ||
    {};
  const socialMentions = Array.isArray(socialCtx?.mentionedJid) ? socialCtx.mentionedJid : [];
  const socialPassive = socialV5.v5ProcessSocialMessage(from, sender, socialMentions);

  if (socialPassive.returned && command !== "afk") {
    await conn.sendMessage(from, {
      text: `👋 @${sender.split("@")[0]} voltou! Ficou AFK por *${socialV5.v5FormatDuration(socialPassive.returned.duration)}*.`,
      mentions: [sender]
    }, { quoted: info }).catch(() => {});
  }

  if (socialPassive.afkMentions?.length) {
    const rows = socialPassive.afkMentions.map(x =>
      `💤 @${x.jid.split("@")[0]} está AFK há *${socialV5.v5FormatDuration(x.duration)}*.\n📝 ${x.reason}`
    );
    await conn.sendMessage(from, {
      text: rows.join("\n\n"),
      mentions: socialPassive.afkMentions.map(x => x.jid)
    }, { quoted: info }).catch(() => {});
  }
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

  const DRAGON_RPG_COMMANDS = new Set([
  "atacar",
  "atributorpg",
  "batalhar",
  "bossdespertar",
  "classeavancada",
  "classeinfo",
  "classesavancadas",
  "classesrpg",
  "comandosrpg",
  "comprarrpg",
  "criarpersonagem",
  "defender",
  "descansar",
  "descansodragao",
  "desequipar",
  "despertar",
  "despertarboss",
  "despertardragao",
  "dragonhelp",
  "dragonrpg",
  "energiadragao",
  "equipamentos",
  "equipar",
  "escolherclasse",
  "escolherdragao",
  "escolherfaccao",
  "explorar",
  "formadragao",
  "formahumana",
  "fugir",
  "habilidade",
  "habilidadedragao",
  "habilidades",
  "humano",
  "inventariorpg",
  "item",
  "lojarpg",
  "menurpg",
  "missao",
  "missoes",
  "perfilrpg",
  "rankrpg",
  "regioes",
  "rpg",
  "rpgajuda",
  "rpgatacar",
  "rpgatributo",
  "rpgclasse",
  "rpgclasseinfo",
  "rpgclasses",
  "rpgcomandos",
  "rpgcomprar",
  "rpgcriar",
  "rpgdefender",
  "rpgdescansar",
  "rpgdesequipar",
  "rpgdragao",
  "rpgequipamentos",
  "rpgequipar",
  "rpgfaccao",
  "rpgfugir",
  "rpghabilidade",
  "rpghabilidades",
  "rpginventario",
  "rpgitem",
  "rpgloja",
  "rpgmissao",
  "rpgmissoes",
  "rpgperfil",
  "rpgrank",
  "rpgregioes",
  "skilldragao",
  "skillsrpg",
  "statusdespertar",
  "transformar",
  "zerarrpg",
  "zerarrpgg",
  "masmorras",
  "dungeons",
  "masmorra",
  "dungeon",
  "materiais",
  "receitas",
  "crafts",
  "craft",
  "descansodungeon"
]);

  // Kobayashi V3.0 • ferramentas locais / compatibilidade Kobayashi
  const v3PassiveHandled = await processV3PassiveMessage({
    conn, info, from, sender, body, isGroup, isCmd, permissions: modularPermissions
  });
  if (v3PassiveHandled && !isCmd) continue;

  trackGlobalUsage({ from, sender, command, isGroup });

  const globalManagementHandled = await runGlobalManagementCommand(command, {
    conn, info, from, sender, command, args, q, prefix, reply, reagir,
    isGroup, groupName, groupMembers,
    groupAdmins: Array.isArray(groupAdmins) ? groupAdmins : [],
    permissions: modularPermissions,
    isMainOwner: SoDonoPrincipal,
    isOwner: SoDono,
    isLeader: SoLider
  });
  if (globalManagementHandled) continue;

  const v3Handled = await runV3Standalone(command, {
    conn, info, from, sender, command, args, q, prefix, reply, reagir,
    isGroup, groupName, groupMembers,
    groupAdmins: Array.isArray(groupAdmins) ? groupAdmins : [],
    permissions: modularPermissions
  });
  if (v3Handled) continue;

  const dragonRpgModeEnabled = !isGroup || isDragonRpgEnabled(from);
  const dragonRpgOwnsCommand = DRAGON_RPG_COMMANDS.has(command);

  // Dragon RPG é o único sistema RPG da Kobayashi.
  // Seus comandos nunca são enviados ao Dragon Fun como comandos de RPG.
  const skipModularForDragonRpg = dragonRpgOwnsCommand;

  const modularHandled = skipModularForDragonRpg ? false : await runModularCommand(command, {
    conn,
    info,
    from,
    sender,
    command,
    args,
    q,
    fullCommandText,
    commandWithArgs,
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

  // Dragon RPG desligado = não responde aos comandos dele.
  // /mododragonrpg fica liberado para que um ADM possa reativá-lo.
  const dragonRpgInlineModeArg =
    command === "dragonrpg" &&
    ["on","off","ativar","desativar","ligar","desligar","1","0"].includes(String(args?.[0] || "").toLowerCase());

  if (dragonRpgOwnsCommand && !dragonRpgModeEnabled && !dragonRpgInlineModeArg) {
    continue;
  }

switch (command) {
case "lid": {
 if(!isGroup)return reply("👤 Use este comando em um grupo.");
 const ci=info?.message?.extendedTextMessage?.contextInfo||info?.message?.imageMessage?.contextInfo||info?.message?.videoMessage?.contextInfo||info?.message?.documentMessage?.contextInfo||info?.message?.stickerMessage?.contextInfo||{};
 const target=(Array.isArray(ci?.mentionedJid)?ci.mentionedJid[0]:null)||ci?.participant||sender;
 let participant=null;
 try{
  const meta=await conn.groupMetadata(from);
  const ids=x=>[x?.id,x?.jid,x?.participant,x?.phoneNumber,x?.lid].filter(Boolean).map(String);
  participant=(meta?.participants||[]).find(x=>ids(x).includes(String(target)))||null;
 }catch{}
 const lid=participant?.lid||(String(participant?.id||"").endsWith("@lid")?participant.id:null)||(String(participant?.jid||"").endsWith("@lid")?participant.jid:null)||(String(target||"").endsWith("@lid")?target:null);
 const phone=participant?.phoneNumber||[participant?.id,participant?.jid,participant?.participant,target].find(x=>String(x||"").endsWith("@s.whatsapp.net"))||target;
 if(!lid)return conn.sendMessage(from,{text:`🪪 *LID DO MEMBRO*\n\n👤 Alvo: @${String(phone).split("@")[0]}\n❌ O WhatsApp/Baileys não forneceu o LID desse participante no metadata atual.`,mentions:[phone].filter(Boolean)},{quoted:info});
 return conn.sendMessage(from,{text:`🪪 *LID DO MEMBRO*\n\n👤 Alvo: @${String(phone).split("@")[0]}\n🆔 LID: *${lid}*`,mentions:[phone].filter(Boolean)},{quoted:info});
} break;

case "dragonban": {
 if(!SoDonoPrincipal)return reply(mess.onlyOwner());
 if(!isGroup)return reply(mess.onlyGroup());
 const mentionedTarget=getTargetFromMessage(info,null);
 const rawNumber=String(args?.[0]||"").replace(/\D/g,"");
 const numberTarget=rawNumber.length>=8?`${rawNumber}@s.whatsapp.net`:null;
 const target=mentionedTarget||numberTarget;
 if(!target||target===sender)return reply(`🐉 Use *${prefix}dragonban @membro motivo*\n📱 Ou: *${prefix}dragonban 5511999999999 motivo*\n↩️ Também funciona respondendo à mensagem.`);
 const reason=args.filter((a,i)=>!a.includes("@")&&!(i===0&&numberTarget)).join(" ").trim()||"Sem motivo informado";
 addDragonBan(target,sender,reason);
 const results=await purgeDragonBannedUser(conn,target);
 const removed=results.filter(x=>x.status==="removido"),absent=results.filter(x=>x.status==="ausente"),failed=results.filter(x=>x.status==="erro");
 return conn.sendMessage(from,{text:`🐉🚫 *DRAGON BAN APLICADO*\n\n👤 Alvo: @${target.split("@")[0]}\n📝 Motivo: ${reason}\n\n✅ Removido: *${removed.length}/${DRAGON_COMMUNITY_GROUPS.length} grupos*\n➖ Ausente: *${absent.length}*\n⚠️ Falhas: *${failed.length}*${failed.length?`\n\n${failed.map(x=>`• ${x.name}: não foi possível remover`).join("\n")}`:""}`,mentions:[target]},{quoted:info});
} break;
case "rmdragonban": {
 if(!SoDonoPrincipal)return reply(mess.onlyOwner());
 const mentionedTarget=getTargetFromMessage(info,null);
 const rawNumber=String(args?.[0]||"").replace(/\D/g,"");
 const target=mentionedTarget||(rawNumber.length>=8?`${rawNumber}@s.whatsapp.net`:null);
 if(!target)return reply(`Use *${prefix}rmdragonban @membro* ou *${prefix}rmdragonban 5511999999999*.`);
 return reply(removeDragonBan(target)?"✅ Dragon Ban removido.":"❌ Membro não está no Dragon Ban.");
} break;
case "listadragonban": {
 if(!SoDonoPrincipal)return reply(mess.onlyOwner());
 const rows=listDragonBans();if(!rows.length)return reply("🐉 A lista Dragon Ban está vazia.");
 return conn.sendMessage(from,{text:`🐉🚫 *LISTA DRAGON BAN*\n\n${rows.slice(0,50).map((x,i)=>`${i+1}. @${x.target.split("@")[0]} — ${x.reason}`).join("\n")}`,mentions:rows.slice(0,50).map(x=>x.target)},{quoted:info});
} break;

// ==========================================
// 🏷️🐉 KOBAYASHI RENTAL SYSTEM • v0.8.5
// Inspirado no fluxo de aluguel/ativação do Kobayashi,
// refeito para a arquitetura e banco do Kobayashi.
// ==========================================
case "jogos":{if(!isGroup)return reply(mess.onlyGroup());const o=String(args[0]||"").toLowerCase();if(["on","off"].includes(o)){if(!isGroupAdmins)return reply(mess.onlyAdmins());return reply(`🎮 Jogos 2.0 *${setGamesEnabled(from,o==="on")?"ON":"OFF"}* neste grupo.`)}return reply(`🎮 *JOGOS 2.0* — ${gamesEnabled(from)?"ON":"OFF"}\n\nADM: ${prefix}jogos on/off\n${prefix}forca • ${prefix}letra A\n${prefix}velha @membro • ${prefix}jogada 5\n${prefix}connect4 @membro • ${prefix}c4 4`)}break;
case "forca":{if(!isGroup)return reply(mess.onlyGroup());if(!gamesEnabled(from))return reply(`🎮 Desativado. ADM: *${prefix}jogos on*`);const f=startForca(from,sender);return reply(`🪢 *FORCA*\n\n${[...f.word].map(()=>"_").join(" ")}\n❤️ 0/6\nUse *${prefix}letra A*`)}break;
case "letrajogo":{if(!gamesEnabled(from))return reply("🎮 Jogos 2.0 desativados.");const r=playForca(from,args[0]);if(r.error)return reply(`⚠️ Nenhuma partida ou letra inválida.`);return reply(`🪢 *FORCA*\n\n${r.mask}\n❤️ ${r.f.errors}/6${r.win?`\n🏆 Palavra: *${r.word}*`:r.lose?`\n💀 Palavra: *${r.word}*`:""}`)}break;
case "velha":{if(!gamesEnabled(from))return reply(`🎮 Desativado. ADM: *${prefix}jogos on*`);const t=getTargetFromMessage(info,null);if(!t||t===sender)return reply(`Use *${prefix}velha @membro*`);const v=startVelha(from,sender,t);return conn.sendMessage(from,{text:`❌⭕ *VELHA*\n\n${boardVelha(v)}\nVez de @${sender.split("@")[0]}\n${prefix}jogada 1-9`,mentions:[sender,t]},{quoted:info})}break;
case "jogada":{if(!gamesEnabled(from))return reply("🎮 Jogos desativados.");const r=playVelha(from,sender,args[0]);if(r.error)return reply("⚠️ Jogada inválida ou não é sua vez.");return conn.sendMessage(from,{text:`❌⭕ *VELHA*\n\n${boardVelha(r.v)}${r.won?`\n🏆 @${sender.split("@")[0]} venceu!`:r.draw?"\n🤝 Empate!":`\nVez de @${r.v.turn.split("@")[0]}`}`,mentions:r.won?[sender]:r.draw?[]:[r.v.turn]},{quoted:info})}break;
case "connect4":case "conecta4":{if(!gamesEnabled(from))return reply(`🎮 Desativado. ADM: *${prefix}jogos on*`);const t=getTargetFromMessage(info,null);if(!t||t===sender)return reply(`Use *${prefix}connect4 @membro*`);const c=startConnect4(from,sender,t);return conn.sendMessage(from,{text:`🔴🟡 *CONNECT 4*\n\n${boardConnect4(c)}\nVez de @${sender.split("@")[0]}\n${prefix}c4 1-7`,mentions:[sender,t]},{quoted:info})}break;
case "c4":{if(!gamesEnabled(from))return reply("🎮 Jogos desativados.");const r=playConnect4(from,sender,args[0]);if(r.error)return reply("⚠️ Jogada inválida ou não é sua vez.");return conn.sendMessage(from,{text:`🔴🟡 *CONNECT 4*\n\n${boardConnect4(r.c)}${r.won?`\n🏆 @${sender.split("@")[0]} venceu!`:r.draw?"\n🤝 Empate!":`\nVez de @${r.c.turn.split("@")[0]}`}`,mentions:r.won?[sender]:r.draw?[]:[r.c.turn]},{quoted:info})}break;

case "social": {
 if(!isGroup)return reply(mess.onlyGroup());const o=String(args[0]||"").toLowerCase();
 if(["on","off"].includes(o)){if(!isGroupAdmins)return reply(mess.onlyAdmins());return reply(`💞 Social 2.0 *${socialV5.v5SetSocialEnabled(from,o==="on")?"ON":"OFF"}* neste grupo.`)}
 return reply(`💞 *SOCIAL 2.0* — ${socialV5.v5SocialEnabled(from)?"ON":"OFF"}\n\nADM: ${prefix}social on/off\n${prefix}afk motivo\n${prefix}rep @membro\n${prefix}presente @membro presente\n${prefix}socialperfil @membro\n${prefix}nota texto\n${prefix}notas\n${prefix}rmnota número`);
} break;
case "afk": {
 if(!isGroup)return reply(mess.onlyGroup());if(!socialV5.v5SocialEnabled(from))return reply(`💞 Social 2.0 desativado. ADM: *${prefix}social on*`);
 const a=socialV5.v5SetAfk(from,sender,args.join(" "));return reply(`💤 AFK ativado.\n📝 ${a.reason}`);
} break;
case "rep": {
 if(!isGroup)return reply(mess.onlyGroup());if(!socialV5.v5SocialEnabled(from))return reply("💞 Social 2.0 desativado.");
 const t=getTargetFromMessage(info,null);if(!t||t===sender)return reply(`Use *${prefix}rep @membro*`);
 const r=socialV5.v5AddRep(from,sender,t);if(r.cooldown)return reply(`⏳ Você já deu reputação recentemente. Aguarde *${socialV5.v5FormatDuration(r.cooldown)}*.`);
 return conn.sendMessage(from,{text:`⭐ @${t.split("@")[0]} recebeu +1 reputação!\n🏆 Reputação: *${r.rep}*\n🎖️ Rank social: *${r.rank}*`,mentions:[t]},{quoted:info});
} break;
case "presente": {
 if(!isGroup)return reply(mess.onlyGroup());if(!socialV5.v5SocialEnabled(from))return reply("💞 Social 2.0 desativado.");
 const t=getTargetFromMessage(info,null);if(!t||t===sender)return reply(`Use *${prefix}presente @membro chocolate*`);
 const item=args.filter(a=>!a.includes("@")).join(" ").trim()||"🎁 Presente";socialV5.v5GiveGift(from,sender,t,item);
 return conn.sendMessage(from,{text:`🎁 @${sender.split("@")[0]} deu *${item}* para @${t.split("@")[0]}!`,mentions:[sender,t]},{quoted:info});
} break;
case "socialperfil": {
 if(!isGroup)return reply(mess.onlyGroup());if(!socialV5.v5SocialEnabled(from))return reply("💞 Social 2.0 desativado.");
 const t=getTargetFromMessage(info,null)||sender,p=socialV5.v5ProfileSocial(from,t);
 const afkLine=p.afk?`\n💤 AFK há: *${socialV5.v5FormatDuration(Date.now()-p.afk.since)}*\n📝 Motivo: ${p.afk.reason}`:"";
 return conn.sendMessage(from,{text:`💞 *PERFIL SOCIAL 2.1*\n\n👤 @${t.split("@")[0]}\n⭐ Reputação: *${p.rep}*\n🎖️ Rank: *${p.rank}*\n🤝 Reputações dadas: *${p.repGiven}*\n🎁 Presentes: *${p.gifts.length}*\n🏅 Conquistas: *${p.achievements.length}*${afkLine}\n${p.achievements.length?`✨ ${p.achievements.join(", ")}`:""}`,mentions:[t]},{quoted:info});
} break;
case "nota": {
 if(!isGroup)return reply(mess.onlyGroup());if(!socialV5.v5SocialEnabled(from))return reply("💞 Social 2.0 desativado.");if(!isGroupAdmins)return reply(mess.onlyAdmins());
 const text=args.join(" ").trim();if(!text)return reply(`Use *${prefix}nota texto*`);const n=socialV5.v5AddNote(from,sender,text);return reply(`📝 Nota *#${n.id}* salva.`);
} break;
case "notas": {
 if(!isGroup)return reply(mess.onlyGroup());if(!socialV5.v5SocialEnabled(from))return reply("💞 Social 2.0 desativado.");
 const n=socialV5.v5ListNotes(from);
 const rows=n.slice(-30).map(x=>{const by=x.by?` • @${String(x.by).split("@")[0]}`:"";const dt=x.at?` • ${new Date(x.at).toLocaleDateString("pt-BR")}`:"";return `#${x.id} — ${x.text}${by}${dt}`;});
 const noteMentions=n.slice(-30).map(x=>x.by).filter(Boolean);
 return n.length?conn.sendMessage(from,{text:`📝 *NOTAS DO GRUPO*\n\n${rows.join("\n")}`,mentions:noteMentions},{quoted:info}):reply("📝 Nenhuma nota salva.");
} break;
case "rmnota": {
 if(!isGroup)return reply(mess.onlyGroup());if(!socialV5.v5SocialEnabled(from))return reply("💞 Social 2.0 desativado.");if(!isGroupAdmins)return reply(mess.onlyAdmins());
 return reply(socialV5.v5RemoveNote(from,args[0])?"🗑️ Nota removida.":"❌ Nota não encontrada.");
} break;

case "morde": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) return reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n\n🛡️ Um ADM pode ativar com *${prefix}modobrincadeira*.`);
  const target = getTargetFromMessage(info, null);
  if (!target || target === sender) return reply(`🦷 Marque alguém ou responda à mensagem da pessoa.\nEx.: *${prefix}morde @membro*`);
  const gifPath = path.join(process.cwd(), "media", "acoes", "morde.mp4");
  if (!fs.existsSync(gifPath)) return reply("⚠️ O GIF do /morde não foi encontrado.");
  try {
    return await conn.sendMessage(from, {
      video: fs.readFileSync(gifPath), gifPlayback: true,
      caption: `🦷 @${sender.split("@")[0]} mordeu @${target.split("@")[0]}!`,
      mentions: [sender, target]
    }, { quoted: info });
  } catch (e) {
    console.error("[MORDE] Falha ao enviar GIF:", e?.message || e);
    return reply("❌ Não consegui enviar o GIF do *morde* agora.");
  }
}
break;

case "morder": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isFunModeEnabled(from)) return reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n\n🛡️ Um ADM pode ativar com *${prefix}modobrincadeira*.`);
  const alvo = getTargetFromMessage(info, null);
  if (!alvo || alvo === sender) return reply(`🦷 Use *${prefix}morder @membro*`);
  try {
    return await conn.sendMessage(from, {
      video: fs.readFileSync(path.join(process.cwd(), "media", "acoes", "morder.mp4")),
      caption: `🦷 @${sender.split("@")[0]} mordeu @${alvo.split("@")[0]}!`,
      mentions: [sender, alvo]
    }, { quoted: info });
  } catch (e) {
    console.error("[MORDER] Falha ao enviar vídeo:", e?.message || e);
    return reply("❌ Não consegui enviar o vídeo do *morder* agora.");
  }
}
break;

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
  if (!isGroup) return reply(`🐉 Use *${prefix}rg_aluguel* dentro do grupo que será alugado.`);

  const ctx = info.message?.extendedTextMessage?.contextInfo ||
    info.message?.imageMessage?.contextInfo ||
    info.message?.videoMessage?.contextInfo || {};
  const responsible = ctx?.mentionedJid?.[0] || ctx?.participant || null;

  if (!responsible) {
    return reply(
      `👤 *RESPONSÁVEL OBRIGATÓRIO*\n\n` +
      `Marque ou responda a mensagem da pessoa responsável pelo aluguel.\n\n` +
      `📦 Por plano:\n*${prefix}rg_aluguel @responsavel plano 1*\n\n` +
      `⏳ Por tempo:\n*${prefix}rg_aluguel @responsavel 30D*`
    );
  }

  // Remove @menção dos argumentos para interpretar apenas plano/tempo.
  const cleanArgs = args.filter((x) => !String(x).startsWith("@"));
  let mode = String(cleanArgs[0] || "").toLowerCase();
  let value = cleanArgs[1];

  // Aceita também: /rg_aluguel @fulano 30D
  if (mode !== "plano") {
    value = cleanArgs[0];
    mode = "tempo";
  }

  let targetName = groupName || from;
  try { targetName = (await conn.groupMetadata(from))?.subject || targetName; } catch {}

  let rental, description;
  if (mode === "plano") {
    const plan = getRentalPlan(value);
    if (!plan) return reply(`📦 Plano inválido. Use *${prefix}rg_aluguel @responsavel plano 1* até *plano 4*.`);
    rental = registerRentalByPlan(from, targetName, plan.id, sender);
    description = `📦 ${formatPlan(plan)}`;
  } else {
    const duration = parseRentalDuration(value);
    if (!duration) return reply(`⏳ Tempo inválido. Ex.: *${prefix}rg_aluguel @responsavel 30D*`);
    rental = registerRental(from, targetName, duration.ms, sender, { source:"manual-responsible" });
    description = `⏳ Duração: *${formatRentalDuration(duration.ms)}*`;
  }

  setRentalResponsible(from, responsible);

  return conn.sendMessage(from,{
    text:
      `✅🐉 *ALUGUEL REGISTRADO*\n\n` +
      `🏷️ Grupo: *${targetName}*\n` +
      `${description}\n` +
      `👤 Responsável: @${String(responsible).split("@")[0]}\n` +
      `📅 Início: *${formatRentalDate(rental.rentedAt)}*\n` +
      `⌛ Expira: *${formatRentalDate(rental.expiresAt)}*\n\n` +
      `⚠️ Quando faltar *1 semana*, a Kobayashi marcará o responsável.\n` +
      `🔒 Se vencer sem renovação, somente o dono principal poderá usar comandos.`,
    mentions:[responsible]
  },{quoted:info});
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
  const targetJid = isGroup ? from : normalizeGroupJid(args[0]);
  if (!targetJid) return reply(`Use no grupo: *${prefix}renovar_aluguel plano 1* ou *${prefix}renovar_aluguel 30D*`);

  const offset = isGroup ? 0 : 1;
  const first = String(args[offset] || "").toLowerCase();
  const second = args[offset+1];
  const current = getRental(targetJid);
  if (!current.exists) return reply("🌸 Esse grupo ainda não possui aluguel registrado.");
  if (current.permanent) return reply("♾️ Este grupo possui aluguel permanente.");

  let targetName=current.rental?.groupName||targetJid;
  try { targetName=(await conn.groupMetadata(targetJid))?.subject||targetName; } catch {}

  let result, description;
  if(first==="plano"){
    const plan=getRentalPlan(second);
    if(!plan)return reply(`📦 Plano inválido. Use *${prefix}renovar_aluguel plano 1* até *plano 4*.`);
    result=renewRentalByPlan(targetJid,targetName,plan.id,sender,{partner:Boolean(current.rental?.partner)});
    description=`📦 ${plan.name}`;
  }else{
    const duration=parseRentalDuration(first);
    if(!duration)return reply(`Use *${prefix}renovar_aluguel plano 1* ou *${prefix}renovar_aluguel 30D*.`);
    result=renewRental(targetJid,targetName,duration.ms,sender,{source:"manual-renewal"});
    description=`⏳ +${formatRentalDuration(duration.ms)}`;
  }

  resetRentalResponsibleWarning(targetJid);
  const responsible=getRentalResponsible(targetJid);
  return conn.sendMessage(from,{
    text:`♻️🐉 *ALUGUEL RENOVADO*\n\n🏷️ *${targetName}*\n${description}\n` +
      `${responsible?`👤 Responsável: @${String(responsible).split("@")[0]}\n`:""}` +
      `⌛ Nova expiração: *${formatRentalDate(result.rental.expiresAt)}*`,
    mentions:responsible?[responsible]:[]
  },{quoted:info});
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


case "listaban_msg":
case "listabanmsg": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o dono principal pode consultar o *BAN MSG Global*.");
  }

  const cfg = getBanMessageConfig();
  const entries = listBanMessages();

  if (!entries.length) {
    return reply(
      `🚨🐉 *LISTA BAN MSG*\n\n` +
      `Status: *${cfg.enabled ? "ATIVO ✅" : "DESATIVADO ⛔"}*\n` +
      `📦 Nenhum texto registrado.`
    );
  }

  const lines = entries.slice(0, 100).map((entry, i) =>
    `${i + 1}. ${entry.text}`
  ).join("\n");

  return reply(
    `🚨🐉 *LISTA BAN MSG*\n\n` +
    `Status: *${cfg.enabled ? "ATIVO ✅" : "DESATIVADO ⛔"}*\n` +
    `📦 Textos cadastrados: *${entries.length}*\n\n${lines}\n\n` +
    `🗑️ Para remover: *${prefix}rmban_msg número*\n` +
    `Ex.: *${prefix}rmban_msg 2*`
  );
}
break;

case "rmban_msg":
case "rmbanmsg": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o dono principal pode remover textos do *BAN MSG Global*.");
  }

  const query = args.join(" ").trim();
  if (!query) {
    return reply(
      `🗑️🐉 *REMOVER BAN MSG*\n\n` +
      `Use *${prefix}rmban_msg número* para remover pela posição da lista.\n` +
      `Ex.: *${prefix}rmban_msg 2*\n\n` +
      `Você também pode informar o texto cadastrado.`
    );
  }

  const result = removeBanMessage(query);
  if (!result.ok) {
    return reply(
      `❌ Não encontrei esse registro no BAN MSG.\n\n` +
      `Use *${prefix}listaban_msg* para conferir a lista.`
    );
  }

  return reply(
    `✅🗑️ *BAN MSG REMOVIDO*\n\n` +
    `📝 Texto: *${result.entry.text}*\n\n` +
    `Esse texto não acionará mais o BAN MSG.`
  );
}
break;

case "ban_msg":
case "banmsg": {
  if (!SoDonoPrincipal) {
    return reply("👑 Apenas o dono principal pode gerenciar o *BAN MSG Global*.");
  }

  const action = String(args?.[0] || "").trim().toLowerCase();

  if (!action) {
    return reply(
      `🚨🐉 *BAN MSG GLOBAL*\n\n` +
      `Registra textos proibidos. Quando alguém enviar uma frase cadastrada:\n` +
      `• a mensagem é *apagada*;\n` +
      `• entra na *Lista Negra Global*;\n` +
      `• é removido do grupo onde enviou o texto;\n` +
      `• a Kobayashi tenta removê-lo de todos os outros grupos;\n` +
      `• você recebe uma auditoria com nome, número, grupo, horário e texto.\n\n` +
      `➕ *${prefix}ban_msg texto proibido*\n` +
      `➕ *${prefix}ban_msg add texto proibido*\n` +
      `➖ *${prefix}ban_msg del 1*\n` +
      `📋 *${prefix}ban_msg list*\n` +
      `✅ *${prefix}ban_msg on*\n` +
      `⛔ *${prefix}ban_msg off*`
    );
  }

  if (["on","off"].includes(action)) {
    const enabled = setBanMessageEnabled(action === "on");
    return reply(
      `🚨 *BAN MSG Global:* ${enabled ? "ATIVADO ✅" : "DESATIVADO ⛔"}`
    );
  }

  if (["list","lista","ver"].includes(action)) {
    const cfg = getBanMessageConfig();
    const entries = listBanMessages();
    if (!entries.length) {
      return reply(
        `🚨🐉 *BAN MSG GLOBAL*\n\n` +
        `Status: *${cfg.enabled ? "ATIVO ✅" : "DESATIVADO ⛔"}*\n` +
        `📦 Nenhum texto registrado.`
      );
    }

    const lines = entries.slice(0, 100).map((entry, i) =>
      `${i + 1}. ${entry.text}`
    ).join("\n");

    return reply(
      `🚨🐉 *BAN MSG GLOBAL*\n\n` +
      `Status: *${cfg.enabled ? "ATIVO ✅" : "DESATIVADO ⛔"}*\n` +
      `📦 Textos: *${entries.length}*\n\n${lines}\n\n` +
      `Para remover: *${prefix}ban_msg del número*`
    );
  }

  if (["del","rm","remove","remover"].includes(action)) {
    const query = args.slice(1).join(" ").trim();
    if (!query) return reply(`Use: *${prefix}ban_msg del 1* ou responda com o texto cadastrado.`);

    const result = removeBanMessage(query);
    if (!result.ok) return reply("❌ Não encontrei esse texto no BAN MSG.");

    return reply(`✅ Texto removido do BAN MSG:\n\n*${result.entry.text}*`);
  }

  const textToAdd = action === "add"
    ? args.slice(1).join(" ").trim()
    : args.join(" ").trim();

  if (!textToAdd) {
    return reply(`Use: *${prefix}ban_msg texto proibido*`);
  }

  const result = addBanMessage(textToAdd, sender);
  if (!result.ok && result.reason === "exists") {
    return reply(`ℹ️ Esse texto já está registrado no BAN MSG:\n\n*${result.entry.text}*`);
  }
  if (!result.ok) {
    return reply("❌ Não consegui registrar esse texto.");
  }

  return reply(
    `✅🚨 *BAN MSG REGISTRADO*\n\n` +
    `📝 Texto: *${result.entry.text}*\n` +
    `🌐 Alcance: *GLOBAL*\n\n` +
    `Quem enviar esse texto será colocado automaticamente na *Lista Negra Global* e removido dos grupos onde a Kobayashi conseguir agir.`
  );
}
break;

case "listanegrag":
case "blacklistg":
case "listanegraglobal": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode gerenciar a lista negra global.");

  if (!args.length) {
    const entries=listGlobalBlacklist();
    return reply(
      `🖤🌐 *LISTA NEGRA GLOBAL*\n\n` +
      `📦 Salvos: *${entries.length}*\n\n` +
      `Cole um ou vários números, inclusive um por linha:\n\n` +
      `${prefix}listanegrag +55 21 98093-7319\n+55 11 95941-7992\n+63 975 062 4668`
    );
  }

  // v4.0.13: parser tolerante para listas copiadas/coladas.
  // Normaliza NBSP, hífens Unicode, marcas invisíveis e aceita um número por linha.
  const raw=args.join(" ")
    .replace(/[\u00A0\u2007\u202F]/g," ")
    .replace(/[\u200B-\u200D\u2060\uFEFF\u202C\u202D\u202E]/g,"")
    .replace(/[‐‑‒–—―−]/g,"-");

  // Cada "+" inicia um novo telefone. Assim espaços/hífens dentro do telefone
  // não confundem a separação entre números.
  const pieces=raw.split(/(?=\+\s*\d)/g).map(x=>x.trim()).filter(Boolean);
  const targets=[];
  const invalid=[];

  for(const piece of pieces){
    const digits=piece.replace(/\D/g,"");
    // E.164: 8 a 15 dígitos; mantém números internacionais como +63...
    if(digits.length<8 || digits.length>15){ invalid.push(piece); continue; }
    const jid=normalizeBlacklistJid("+"+digits);
    if(jid && !targets.includes(jid)) targets.push(jid);
    else if(!jid) invalid.push(piece);
  }

  if(!targets.length){
    return reply(`❌ Nenhum número válido encontrado.\n\nExemplo:\n*${prefix}listanegrag +55 21 98093-7319*\n*+55 11 95941-7992*`);
  }

  let newlyAdded=0, alreadySaved=0, protectedOwner=0, saveFailures=0;
  let checked=0,adminGroups=0,found=0,removed=0,removeFailures=0;
  const savedTargets=[];

  // Primeiro SALVA todos. A remoção é feita depois, evitando perder o restante
  // da lista se alguma varredura individual falhar.
  for(const target of targets){
    if(target===dono || isMainOwnerJid(target)){protectedOwner++;continue}
    try{
      const existing=getGlobalBlacklistEntry(target);
      if(!existing){
        addGlobalBlacklist(target,{reason:"Adicionado em lote pelo dono",by:sender});
        newlyAdded++;
      }else alreadySaved++;
      // Confirma persistência antes da fase de remoção.
      if(getGlobalBlacklistEntry(target)) savedTargets.push(target);
      else saveFailures++;
    }catch(e){
      saveFailures++;
      console.error("[LISTANEGRAG SAVE]",target,e?.message||e);
    }
  }

  // Depois varre/remover cada alvo já persistido.
  for(const target of savedTargets){
    try{
      const purge=await purgeUserFromAdminGroups(conn,target,{announce:true,source:"Lista Negra Global"});
      checked+=Number(purge.checked||0);
      adminGroups+=Number(purge.adminGroups||0);
      found+=Number(purge.found||0);
      removed+=Number(purge.removed||0);
      removeFailures+=Number(purge.failures||0);
    }catch(e){
      removeFailures++;
      console.error("[LISTANEGRAG PURGE]",target,e?.message||e);
    }
  }

  // Para lote, resposta curta como solicitado.
  if(targets.length>1){
    return reply(
      `🖤🌐 *${savedTargets.length} números adicionados na lista negra global*\n\n` +
      `💾 Salvos para remoção automática: *${savedTargets.length}*\n` +
      (alreadySaved?`ℹ️ Já estavam salvos: *${alreadySaved}*\n`:"") +
      (protectedOwner?`🛡️ Dono protegido: *${protectedOwner}*\n`:"") +
      (invalid.length?`⚠️ Entradas inválidas ignoradas: *${invalid.length}*\n`:"") +
      (saveFailures?`❌ Falhas ao salvar: *${saveFailures}*\n`:"") +
      `🔨 Removidos agora: *${removed}*`
    );
  }

  const target=savedTargets[0];
  if(!target)return reply("⚠️ O número não pôde ser salvo na lista negra global.");
  return conn.sendMessage(from,{
    text:`🖤🌐 @${target.split("@")[0]} foi salvo na lista negra global.\n🔨 Removido de: *${removed}* grupo(s).`,
    mentions:[target]
  },{quoted:info});
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
        `🛡️ Esses membros ficam protegidos de QUALQUER remoção feita pela Kobayashi e podem enviar links mesmo sem serem ADM.`,
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
    const aliases = new Set([target]);

    try {
      const targetPN = await getPNForJid(conn, target, target);
      if (targetPN) aliases.add(targetPN);
    } catch {}

    const targetParticipant = (groupMembers || []).find((p) => {
      const ids = [p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid].filter(Boolean);
      return ids.includes(target) || ids.some((id) => {
        try { return normalizeJid(id) === normalizeJid(target); } catch { return false; }
      });
    });

    if (targetParticipant) {
      for (const id of [
        targetParticipant?.id,
        targetParticipant?.jid,
        targetParticipant?.participant,
        targetParticipant?.phoneNumber,
        targetParticipant?.lid
      ].filter(Boolean)) {
        aliases.add(id);
        try {
          const pn = await getPNForJid(conn, id, id);
          if (pn) aliases.add(pn);
        } catch {}
      }
    }

    if ([...aliases].some((jid) => isWhitelisted(from, jid))) {
      return reply(`🤍 @${target.split("@")[0]} já está na Lista Branca.`);
    }

    for (const jid of aliases) addWhitelist(from, jid);

    return conn.sendMessage(from, {
      text:
        `🤍🌸 *LISTA BRANCA*\n\n` +
        `✅ @${target.split("@")[0]} foi autorizado.\n\n` +
        `🛡️ Agora está protegido de QUALQUER remoção feita pela Kobayashi enquanto permanecer na Lista Branca.\n` +
        `🔗 Também pode enviar links mesmo sem ser ADM.\n` +
        `🐉 A permissão vale somente neste grupo.`,
      mentions: [target],
    }, { quoted: info });
  }

  const removeAliases = new Set([target]);

  try {
    const targetPN = await getPNForJid(conn, target, target);
    if (targetPN) removeAliases.add(targetPN);
  } catch {}

  const removeParticipant = (groupMembers || []).find((p) => {
    const ids = [p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid].filter(Boolean);
    return ids.includes(target) || ids.some((id) => {
      try { return normalizeJid(id) === normalizeJid(target); } catch { return false; }
    });
  });

  if (removeParticipant) {
    for (const id of [
      removeParticipant?.id,
      removeParticipant?.jid,
      removeParticipant?.participant,
      removeParticipant?.phoneNumber,
      removeParticipant?.lid
    ].filter(Boolean)) {
      removeAliases.add(id);
      try {
        const pn = await getPNForJid(conn, id, id);
        if (pn) removeAliases.add(pn);
      } catch {}
    }
  }

  if (![...removeAliases].some((jid) => isWhitelisted(from, jid))) {
    return reply(`🤍 @${target.split("@")[0]} não está na Lista Branca.`);
  }

  for (const jid of removeAliases) removeWhitelist(from, jid);
  return conn.sendMessage(from, {
    text:
      `🤍🌸 *LISTA BRANCA*\n\n` +
      `❌ @${target.split("@")[0]} foi removido da lista.\n\n` +
      `🔐 As proteções automáticas e os filtros de links voltarão a valer normalmente para esse membro.`,
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
    `🔌 Handler Kobayashi: ${typeof conn.kobayashiHandleGroupParticipantsUpdate === "function" ? "✅ OK" : "❌ AUSENTE"}\n\n` +
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
      console.error("[WELCOME Kobayashi] Handler não encontrado no socket.");
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

    // Mesmo fluxo usado pelo Kobayashi:
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

case "rgfigu": {
  if (!SoDonoPrincipal) {
    return reply("🐉 Apenas o dono principal pode configurar o /rgfigu.");
  }

  const selectedCommand = String(args?.[0] || "")
    .trim()
    .toLowerCase()
    .replace(/^\//, "");

  if (!selectedCommand) {
    return reply(
      "🎴 *RGFIGU — COMANDO POR FIGURINHA*\n\n" +
      "Responda uma figurinha com o comando que ela deve executar:\n\n" +
      "*/rgfigu ban*\n" +
      "*/rgfigu adv*\n" +
      "*/rgfigu menu*"
    );
  }

  // Aqui o comportamento é o inverso do antigo:
  // o nome PRECISA ser um comando real da Kobayashi.
  if (!KOBA_TRIGGER_COMMANDS.has(selectedCommand)) {
    return reply(`⚠️ */${selectedCommand}* não é um comando real da Kobayashi.`);
  }

  const msg = info?.message || {};
  const contexts = [
    msg?.extendedTextMessage?.contextInfo,
    msg?.imageMessage?.contextInfo,
    msg?.videoMessage?.contextInfo,
    msg?.documentMessage?.contextInfo
  ].filter(Boolean);

  const quotedMessage = contexts.find((ctx) => ctx?.quotedMessage)?.quotedMessage;

  if (!quotedMessage?.stickerMessage) {
    return reply(
      "⚠️ Responda a figurinha que deseja configurar.\n\n" +
      "Exemplo: */rgfigu ban*"
    );
  }

  const result = setStickerMappedCommand(quotedMessage, selectedCommand);

  if (result === false) {
    return reply("⚠️ Não consegui vincular essa figurinha. Tente novamente.");
  }

  return reply(
    `🎴🐉 *Figurinha configurada!*\n\n` +
    `Ela agora executa: */${selectedCommand}*` +
    (["ban","banc","kobaban","koban","adv","rmadv"].includes(selectedCommand)
      ? `\n\n↩️ Para usar em alguém, envie essa figurinha *respondendo a mensagem do membro*.`
      : "")
  );
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

    // Rota de áudio usada pelo sistema do Kobayashi V10.
    const apiUrl =
      `https://yuta-apis.xyz/api/downloads/ytaudio2?url=${encodeURIComponent(video.url)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": yutaToken,
        "x-yuta-client": "KobayashiBot-MD",
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

    // O endpoint do Kobayashi retorna o áudio diretamente.
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
    .filter((jid) => !adminSet.has(jid))
    .filter((jid) => !isWhitelisted(from, jid));

  if (!targets.length) {
    return reply(
      "🌸 Os números estrangeiros encontrados são administradores ou estão na Lista Branca. Não removi ninguém automaticamente."
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

  // KobaBan exclusivo do criador pelo LID oficial.
  const KOBABAN_OWNER_LID = "69119714017511@lid";
  const senderCandidates = [
    sender,
    info?.key?.participant,
    info?.participant,
    info?.message?.extendedTextMessage?.contextInfo?.participant,
    info?.message?.imageMessage?.contextInfo?.participant,
    info?.message?.videoMessage?.contextInfo?.participant
  ].filter(Boolean).map(String);

  let senderParticipant = null;
  try {
    const meta = await conn.groupMetadata(from);
    senderParticipant = (meta?.participants || []).find(p => {
      const ids = [p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).map(String);
      return ids.some(id => senderCandidates.includes(id));
    }) || null;
  } catch {}

  const senderLid =
    senderCandidates.find(id => id.endsWith("@lid")) ||
    senderParticipant?.lid ||
    (String(senderParticipant?.id || "").endsWith("@lid") ? senderParticipant.id : null) ||
    (String(senderParticipant?.jid || "").endsWith("@lid") ? senderParticipant.jid : null);

  if (senderLid !== KOBABAN_OWNER_LID) {
    return reply("👑🐉 O *KobaBan* é exclusivo do criador da Kobayashi.");
  }
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  const target = resolveBanTarget(info, args);
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

case "bang": {
  if (!SoDonoPrincipal) return reply("👑🐉 O *Bang* é exclusivo do dono principal.");

  const ctxInfo =
    info?.message?.extendedTextMessage?.contextInfo ||
    info?.message?.imageMessage?.contextInfo ||
    info?.message?.videoMessage?.contextInfo ||
    info?.message?.documentMessage?.contextInfo ||
    info?.message?.stickerMessage?.contextInfo || {};

  const mentioned = Array.isArray(ctxInfo?.mentionedJid) ? ctxInfo.mentionedJid[0] : null;
  const quoted = ctxInfo?.participant || null;
  const rawNumber = String(args?.[0] || "").replace(/\D/g, "");
  const numberTarget = rawNumber.length >= 8 ? `${rawNumber}@s.whatsapp.net` : null;
  const target = mentioned || quoted || numberTarget;

  if (!target) {
    return reply(`💥🐉 Informe quem será removido de todos os grupos onde a Kobayashi é ADM.\n\nExemplos:\n*${prefix}bang @membro*\n*${prefix}bang 5511999999999*\nOu responda à mensagem com *${prefix}bang*.`);
  }

  const targetDigits = String(target).split("@")[0].replace(/\D/g, "");
  let groups = {};
  try { groups = await conn.groupFetchAllParticipating(); }
  catch (e) { console.error("[BANG] Falha ao buscar grupos:", e); return reply("❌ Não consegui carregar os grupos da Kobayashi."); }

  let checked=0, adminGroups=0, found=0, removed=0, failed=0;
  for (const [gid, cached] of Object.entries(groups || {})) {
    checked++;
    try {
      const meta = cached?.participants ? cached : await conn.groupMetadata(gid);
      const participants = Array.isArray(meta?.participants) ? meta.participants : [];
      const botIds = [botNumber, conn?.user?.id, conn?.user?.lid].filter(Boolean).map(String);
      const botP = participants.find(p => [p?.id,p?.jid,p?.lid,p?.phoneNumber].filter(Boolean).map(String).some(id => botIds.includes(id)));
      if (!botP || !["admin","superadmin"].includes(String(botP.admin || ""))) continue;
      adminGroups++;

      const victim = participants.find(p => {
        const ids=[p?.id,p?.jid,p?.lid,p?.phoneNumber].filter(Boolean).map(String);
        if (ids.includes(String(target))) return true;
        return ids.some(id => id.split("@")[0].replace(/\D/g,"") === targetDigits);
      });
      if (!victim) continue;
      found++;

      const victimJid = victim?.id || victim?.jid || victim?.phoneNumber || victim?.lid || target;
      await conn.groupParticipantsUpdate(gid,[victimJid],"remove");
      removed++;
    } catch (e) {
      failed++;
      console.error(`[BANG] ${gid}:`, e?.message || e);
    }
  }

  return reply(`💥🐉 *BANG GLOBAL CONCLUÍDO*\n\n🎯 Alvo: *${targetDigits || target}*\n🌐 Grupos verificados: *${checked}*\n🛡️ Grupos onde a Kobayashi é ADM: *${adminGroups}*\n👤 Alvo encontrado: *${found}*\n🚪 Removido com sucesso: *${removed}*\n⚠️ Falhas: *${failed}*`);
}
break;

case "ban":
case "b":
case "banc": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  const target = resolveBanTarget(info, args);
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

  const target = resolveBanTarget(info, args);
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
    const number = targetJid?.split("@")[0] || target?.split("@")[0] || "desconhecido";

    // 🐉 Perfil 2.0.27 — resolução robusta de hierarquia (PN + LID + aliases).
    // O WhatsApp pode entregar o mesmo membro como @s.whatsapp.net ou @lid.
    const targetAliases = new Set([target, targetJid].filter(Boolean));
    try {
      const pn = await getPNForJid(conn, targetJid || target, target);
      if (pn) targetAliases.add(pn);
    } catch {}

    const normalizeProfileJid = (jid) => {
      try { return normalizeJid(jid); } catch { return String(jid || ""); }
    };
    const profileDigits = (jid) => String(jid || "").split("@")[0].replace(/\D/g, "");

    const targetNorms = new Set([...targetAliases].map(normalizeProfileJid).filter(Boolean));
    const targetDigits = new Set([...targetAliases].map(profileDigits).filter((x) => x.length >= 8));

    let targetParticipant = null;
    if (isGroup) {
      for (const p of groupMembers || []) {
        const ids = [p?.id, p?.jid, p?.participant, p?.phoneNumber, p?.lid].filter(Boolean);
        for (const id of [...ids]) {
          try {
            const pn = await getPNForJid(conn, id, id);
            if (pn) ids.push(pn);
          } catch {}
        }

        const matches = ids.some((id) => {
          const norm = normalizeProfileJid(id);
          const digits = profileDigits(id);
          return targetAliases.has(id) ||
            targetNorms.has(norm) ||
            (digits.length >= 8 && targetDigits.has(digits));
        });

        if (matches) {
          targetParticipant = p;
          for (const id of ids) targetAliases.add(id);
          break;
        }
      }
    }

    // Atualiza aliases depois de localizar o participante real no metadata.
    const finalNorms = new Set([...targetAliases].map(normalizeProfileJid).filter(Boolean));
    const finalDigits = new Set([...targetAliases].map(profileDigits).filter((x) => x.length >= 8));

    const cfgPerfil = readSettingsFile();
    const perfilOwnerNumber = String(
      cfgPerfil?.ownerNumber || cfgPerfil?.dono || ownerNumber || ""
    ).replace(/\D/g, "");

    const leaderNumbers = Array.isArray(cfgPerfil?.leaders)
      ? cfgPerfil.leaders.map((x) => String(x || "").replace(/\D/g, "")).filter(Boolean)
      : [];

    const isTargetOwner =
      finalDigits.has(perfilOwnerNumber) ||
      [...targetAliases].some((jid) => isMainOwnerJid(jid)) ||
      finalNorms.has(normalizeProfileJid(dono));

    const isTargetLeader =
      isTargetOwner ||
      [...finalDigits].some((digits) => leaderNumbers.includes(digits)) ||
      [...targetAliases].some((jid) => {
        try { return isLeaderJid(jid); } catch { return false; }
      });

    const participantRole = String(targetParticipant?.admin || "").toLowerCase();
    const adminByMetadata = participantRole === "admin" || participantRole === "superadmin";

    // getGroupAdmins já é a fonte usada pelo restante da Kobayashi.
    // Aqui comparamos por JID normalizado E número para suportar LID.
    const adminByList = isGroup && Array.isArray(groupAdmins)
      ? groupAdmins.some((adminJid) => {
          const norm = normalizeProfileJid(adminJid);
          const digits = profileDigits(adminJid);
          return targetAliases.has(adminJid) ||
            finalNorms.has(norm) ||
            (digits.length >= 8 && finalDigits.has(digits));
        })
      : false;

    const isTargetAdmin = adminByMetadata || adminByList;
    const isGroupOwner = participantRole === "superadmin";

    let name = target === sender
      ? (pushname || "Usuário")
      : (targetParticipant?.name || targetParticipant?.notify || `Usuário ${number}`);
    try {
      if (typeof conn.getName === "function") {
        const resolvedName = await conn.getName(targetJid);
        if (resolvedName && !/^\+?\d+$/.test(String(resolvedName).trim())) name = String(resolvedName).trim();
      }
    } catch {}

    let bio = "Sem recado público";
    try {
      if (typeof conn.fetchStatus === "function") {
        const statusData = await conn.fetchStatus(targetJid);
        const rawStatus = Array.isArray(statusData) ? statusData[0] : statusData;
        bio = String(rawStatus?.status?.status || rawStatus?.status || bio).trim() || bio;
      }
    } catch {}
    if (bio.length > 90) bio = `${bio.slice(0, 87)}...`;

    const activity = isGroup
      ? getUserActivity(from, targetJid)
      : { messages:0, textMessages:0, images:0, stickers:0, commands:0, xp:0 };

    const textCount = Number(activity?.textMessages || 0);
    const imageCount = Number(activity?.images || 0);
    const stickerCount = Number(activity?.stickers || 0);
    const messageCount = Number(activity?.messages || 0);
    const commandCount = Number(activity?.commands || activity?.commandMessages || 0);

    const levelInfo = getLevelInfoFromXp(activity?.xp || 0);
    const socialInfo = getEconomySummary(targetJid);
    const socialAchievements = getAchievements(targetJid, levelInfo.level);
    const activeCosmeticTitle = getActiveTitle(targetJid);

    const db = readAdvDb();
    const advCount = Math.max(0, Math.min(Number(isGroup ? (db[from]?.[targetJid]?.count || db[from]?.[target]?.count || 0) : 0) || 0, 3));

    const personality = getKobayashiPersonality(isGroup ? from : "private", targetJid);

    const cargo = isTargetOwner
      ? "👑 Criador da Kobayashi"
      : isGroupOwner
        ? "👑 Dono do grupo"
        : isTargetAdmin
          ? "🔱 Administrador"
          : isTargetLeader
            ? "🐉 Líder"
            : "🌸 Membro";

    const rpgPlayer = getDragonRpgPlayer(targetJid);
    const rpgClassNames = {
      escudeiro:"Escudeiro", guerreiro:"Guerreiro", mago:"Mago",
      arqueiro:"Arqueiro", curandeiro:"Curandeiro"
    };
    const advancedNames = {
      necromante:"Necromante", assassino:"Assassino",
      paladino:"Paladino", feiticeiro:"Feiticeiro"
    };
    const rpgClass = rpgPlayer?.class ? (rpgClassNames[rpgPlayer.class] || rpgPlayer.class) : "Não iniciado";
    const rpgAdvanced = rpgPlayer?.advancedClass ? (advancedNames[rpgPlayer.advancedClass] || rpgPlayer.advancedClass) : "Nenhuma";

    const premium = Boolean(
      isTargetOwner ||
      targetParticipant?.premium ||
      cfgPerfil?.premium?.includes?.(number) ||
      cfgPerfil?.premiums?.includes?.(number)
    );

    const advice = [
      "Até uma chama pequena ilumina a noite quando você sabe onde quer chegar.",
      "Força não é atacar sempre; às vezes é saber quando guardar as garras.",
      "Quem evolui um pouco todos os dias acaba virando o próprio boss final.",
      "Nem toda batalha merece sua energia. Escolha bem onde usar seu fogo.",
      "Um dragão também precisa descansar antes de voltar a voar."
    ];
    const adviceSeed = String(number).split("").reduce((a,c)=>a+Number(c||0),0);
    const dailyIndex = (adviceSeed + new Date().getDate()) % advice.length;

    const caption =
`╭━━━〔 🐉🌸 *KOBAYASHI* 〕━━━╮
┃        ✦ *MEU PERFIL* ✦
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 👤 *IDENTIDADE* 〕
┃ 🌸 Nome: *${name}*
┃ 📱 Número: *+${number}*
┃ 💌 Bio: _${bio}_
${activeCosmeticTitle ? `┃ 🎖️ Título: *${activeCosmeticTitle}*\n` : ""}╰────────────────────

╭─〔 🐲 *HIERARQUIA* 〕
┃ 👑 Dono: 〔 ${isTargetOwner ? "✅" : "❌"} 〕
┃ 🐉 Líder: 〔 ${isTargetLeader ? "✅" : "❌"} 〕
┃ 🔱 ADM: 〔 ${isTargetAdmin || isGroupOwner ? "✅" : "❌"} 〕
┃ 💎 Premium: 〔 ${premium ? "✅" : "❌"} 〕
┃ 🎭 Cargo: *${cargo}*
╰────────────────────

╭─〔 💰 *DRAGON SOCIAL* 〕
┃ 🪙 Coins: *${socialInfo.coins}*
┃ ⭐ Level: *${levelInfo.level}*
┃ ✨ XP: *${levelInfo.xp}*
┃ 🏆 Conquistas: *${socialAchievements.unlocked.length}/${socialAchievements.total}*
╰────────────────────

╭─〔 🌸 *AURA KOBAYASHI* 〕
┃ 🔥 Caos       ${kobayashiPercentBar(personality.caos)}
┃ 💖 Fofura     ${kobayashiPercentBar(personality.fofura)}
┃ 🐉 Aura       ${kobayashiPercentBar(personality.aura)}
┃ ⚔️ Coragem    ${kobayashiPercentBar(personality.coragem)}
┃ 🌙 Mistério   ${kobayashiPercentBar(personality.misterio)}
╰────────────────────

╭─〔 📊 *ATIVIDADE* 〕
┃ 💬 Mensagens: *${textCount || messageCount}*
┃ ⚙️ Comandos: *${commandCount}*
┃ 🎴 Figurinhas: *${stickerCount}*
┃ 📸 Fotos: *${imageCount}*
┃ ⚠️ ADVs: *${advCount}/3*
╰────────────────────

╭─〔 ⚔️🐉 *DRAGON RPG* 〕
┃ 🧭 Classe: *${rpgClass}*
┃ 🌟 Especialização: *${rpgAdvanced}*
┃ 🎖️ Nível RPG: *${rpgPlayer?.level || 0}*
┃ ❤️ HP: *${rpgPlayer ? `${rpgPlayer.resources?.hp || 0}/${rpgPlayer.stats?.hp || 0}` : "—"}*
┃ 🔷 Mana: *${rpgPlayer ? `${rpgPlayer.resources?.mana || 0}/${rpgPlayer.stats?.mana || 0}` : "—"}*
${rpgPlayer ? `┃ 🎯 Combate: *${rpgPlayer.specialties?.combat || 0}*
┃ 🥷 Furtividade: *${rpgPlayer.specialties?.stealth || 0}*
` : ""}╰────────────────────

🌸 ─────「 *CONSELHO DA KOBA* 」───── 🌸
_${advice[dailyIndex]}_

╭━━━━━━━━━━━━━━━━━━━━╮
┃ 🐉 *KOBAYASHI BOT*
┃ 🌸 Sua Dragon Maid no WhatsApp
╰━━━━━━━━━━━━━━━━━━━━╯`;

    let profilePicture = null;
    try {
      profilePicture = await conn.profilePictureUrl(targetJid || target, "image");
    } catch {}

    if (profilePicture) {
      try {
        return await conn.sendMessage(from, {
          image: { url: profilePicture },
          caption,
          mentions: [targetJid || target]
        }, { quoted: info });
      } catch {}
    }

    return conn.sendMessage(from, {
      text: caption,
      mentions: [targetJid || target]
    }, { quoted: info });
  } catch (error) {
    console.error("Erro no /perfil:", error);
    return reply("❌🐉 Não consegui montar o perfil agora. Tente novamente em alguns instantes.");
  }
}
break;


// 🎴 PACOTES REGISTRADOS • v2.0.23
case "pacote": {
  const sub = String(args?.[0] || "").trim().toLowerCase();

  if (sub === "fig") {
    if (!SoDonoPrincipal) {
      return reply("👑 Apenas o dono principal pode iniciar ou encerrar a captura de pacotes.");
    }

    const op = String(args?.[1] || "").trim().toLowerCase();
    if (!["on","off"].includes(op)) {
      const status = getPackageCaptureStatus(from);
      return reply(
        `🎴🐉 *CAPTURA DE PACOTE*\n\n` +
        `Status: *${status.active ? "ATIVA ✅" : "DESATIVADA ❌"}*\n` +
        `Figurinhas capturadas: *${status.count}*\n\n` +
        `▶️ *${prefix}pacote fig on*\n` +
        `⏹️ *${prefix}pacote fig off*`
      );
    }

    if (op === "on") {
      startPackageCapture(from, sender);
      return reply(
        `🎴✅ *CAPTURA ATIVADA*\n\n` +
        `A partir de agora, todas as figurinhas recebidas neste chat serão guardadas temporariamente.\n\n` +
        `Quando terminar:\n*${prefix}pacote fig off*\n\n` +
        `Depois registre:\n*${prefix}pacote add Nome do pacote*`
      );
    }

    const result = stopPackageCapture(from, sender, SoDonoPrincipal);
    if (!result.ok && result.reason === "not-started") {
      return reply(`🎴 Não existe uma captura ativa neste chat.`);
    }

    return reply(
      `🎴⏹️ *CAPTURA ENCERRADA*\n\n` +
      `Figurinhas guardadas: *${result.count}*\n\n` +
      `Agora use:\n*${prefix}pacote add Nome do pacote*`
    );
  }

  if (sub === "add") {
    if (!SoDonoPrincipal) {
      return reply("👑 Apenas o dono principal pode registrar pacotes.");
    }

    const packageName = args.slice(1).join(" ").trim().replace(/^["'“”]+|["'“”]+$/g, "");
    if (!packageName) {
      return reply(`🎴 Use: *${prefix}pacote add Nome do pacote*`);
    }

    const result = saveCapturedPackage(from, sender, packageName);

    if (!result.ok) {
      const messages = {
        "no-capture": `🎴 Nenhuma captura foi iniciada.\nUse primeiro *${prefix}pacote fig on*.`,
        "empty": `🎴 A captura não possui figurinhas.`,
        "not-owner": `👑 Essa captura foi iniciada por outra pessoa.`,
        "invalid-name": `⚠️ Escolha um nome válido para o pacote.`
      };
      return reply(messages[result.reason] || "❌ Não consegui registrar esse pacote.");
    }

    return reply(
      `╭━━〔 🎴 *PACOTE REGISTRADO* 〕━━╮\n` +
      `┃ 📦 Nome: *${result.name}*\n` +
      `┃ 🎨 Figurinhas: *${result.count}*\n` +
      `┃ ♻️ ${result.replaced ? "Pacote anterior substituído" : "Novo pacote criado"}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `Enviar pacote inteiro:\n*${prefix}pacote ${result.name}*\n\n` +
      `Enviar uma por vez:\n*${prefix}figurinha ${result.name}*`
    );
  }

  if (["lista","list"].includes(sub)) {
    const packs = listStickerPackages();
    if (!packs.length) {
      return reply(
        `🎴 Nenhum pacote registrado ainda.\n\n` +
        `Use *${prefix}pacote fig on* para começar uma captura.`
      );
    }

    const rows = packs.map((pack, i) =>
      `${i + 1}. *${pack.name}* — ${pack.count} figurinha${pack.count === 1 ? "" : "s"}`
    ).join("\n");

    return reply(
      `╭━━〔 🎴 *PACOTES REGISTRADOS* 〕━━╮\n\n${rows}\n\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`
    );
  }

  if (["del","delete","remover","remove"].includes(sub)) {
    if (!SoDonoPrincipal) {
      return reply("👑 Apenas o dono principal pode remover pacotes.");
    }
    const packageName = args.slice(1).join(" ").trim().replace(/^["'“”]+|["'“”]+$/g, "");
    if (!packageName) return reply(`🗑️ Use: *${prefix}pacote del Nome do pacote*`);
    const ok = deleteStickerPackage(packageName);
    return reply(ok ? `✅ Pacote *${packageName}* removido.` : `⚠️ Não encontrei o pacote *${packageName}*.`);
  }

  const packageName = q.trim().replace(/^["'“”]+|["'“”]+$/g, "");

  if (!packageName) {
    const status = getPackageCaptureStatus(from);
    return reply(
      `╭━━〔 🎴🐉 *PACOTES KOBAYASHI* 〕━━╮\n\n` +
      `▶️ *${prefix}pacote fig on*\n` +
      `⏹️ *${prefix}pacote fig off*\n` +
      `💾 *${prefix}pacote add Nome*\n` +
      `📦 *${prefix}pacote Nome*\n` +
      `🎴 *${prefix}figurinha Nome*\n` +
      `📚 *${prefix}pacote lista*\n\n` +
      `Captura atual: *${status.active ? "ATIVA" : "desativada"}* • ${status.count} figurinha(s)\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`
    );
  }

  const pack = getStickerPackage(packageName);
  if (!pack) {
    return reply(
      `❌ Não encontrei o pacote *${packageName}*.\n` +
      `Use *${prefix}pacote lista*.`
    );
  }

  await reply(
    `🎴📦 Enviando *${pack.name}* com *${pack.count}* figurinha${pack.count === 1 ? "" : "s"}...`
  );

  let sent = 0;
  for (const file of pack.files) {
    try {
      await conn.sendMessage(from, { sticker: fs.readFileSync(file) });
      sent++;
      await delay(350);
    } catch (e) {
      console.error("[PACOTE SEND]", e?.message || e);
    }
  }

  return reply(
    `✅🎴 Pacote *${pack.name}* concluído.\n` +
    `Enviadas: *${sent}/${pack.count}*.`
  );
}
break;

case "figurinha": {
  const packageName = q.trim().replace(/^["'“”]+|["'“”]+$/g, "");
  if (!packageName) {
    return reply(
      `🎴 Use: *${prefix}figurinha Nome do pacote*\n\n` +
      `Cada uso envia a próxima figurinha do pacote e, ao chegar ao final, volta para a primeira.`
    );
  }

  const next = getNextStickerFromPackage(packageName, from, sender);
  if (!next) {
    return reply(
      `❌ Não encontrei o pacote *${packageName}*.\n` +
      `Use *${prefix}pacote lista*.`
    );
  }

  await conn.sendMessage(from, { sticker: next.buffer }, { quoted: info });
  return;
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

case "kobatrigger":
case "kobamode": {
  if (!isGroup) return reply("🐉 O Koba Trigger é configurado por grupo.");
  if (!groupAdmins.includes(sender) && !SoDonoPrincipal) {
    return reply("🛡️ Apenas administradores ou o dono principal podem alterar o Koba Trigger.");
  }

  const atual = isKobaTriggerEnabled(from);
  const arg = String(args?.[0] || "").trim().toLowerCase();
  let enabled;

  if (["on","ativar","ligar","1"].includes(arg)) enabled = true;
  else if (["off","desativar","desligar","0"].includes(arg)) enabled = false;
  else enabled = !atual;

  setKobaTriggerEnabled(from, enabled, sender);

  return reply(enabled
    ? `🐉✨ *Koba Trigger Universal ativado!*\n\nAgora ele reconhece *564 comandos/aliases* do bot.\n\nExemplos:\n*Koba menu*\n*Koba tocar <música>*\n*Koba perfil*\n*Koba ban @membro*\n*Koba zerarrpg confirmar*`
    : `🐉💤 *Koba Trigger desativado!*\n\nAs chamadas naturais começando com *Koba* serão ignoradas neste grupo.`);
}
break;

case "mododragonrpg":
case "dragonrpgmode": {
  if (!isGroup) return reply("🐉 O controle do Dragon RPG é configurado por grupo.");
  if (!groupAdmins.includes(sender) && !SoDonoPrincipal) {
    return reply("🛡️ Apenas administradores ou o dono principal podem alterar o Dragon RPG.");
  }

  const atual = isDragonRpgEnabled(from);
  const arg = String(args?.[0] || "").trim().toLowerCase();
  let enabled;

  if (["on","ativar","ligar","1"].includes(arg)) enabled = true;
  else if (["off","desativar","desligar","0"].includes(arg)) enabled = false;
  else enabled = !atual;

  setDragonRpgEnabled(from, enabled, sender);

  return reply(enabled
    ? `🐉🔥 *Dragon RPG ativado neste grupo!*\n\nOs comandos do Dragon RPG voltaram a responder.`
    : `🐉💤 *Dragon RPG desativado neste grupo!*\n\nEnquanto estiver desligado, nenhum comando do Dragon RPG responderá.`);
}
break;

case "dragonrpg": {
  const dragonModeArg = String(args?.[0] || "").trim().toLowerCase();
  const dragonModeOn = ["on","ativar","ligar","1"];
  const dragonModeOff = ["off","desativar","desligar","0"];

  if (dragonModeOn.includes(dragonModeArg) || dragonModeOff.includes(dragonModeArg)) {
    if (!isGroup) return reply("🐉 O controle do Dragon RPG é configurado por grupo.");
    if (!groupAdmins.includes(sender) && !SoDonoPrincipal) {
      return reply("🛡️ Apenas administradores ou o dono principal podem alterar o Dragon RPG.");
    }

    const enabled = dragonModeOn.includes(dragonModeArg);
    setDragonRpgEnabled(from, enabled, sender);
    return reply(enabled
      ? `🐉🔥 *Dragon RPG ativado neste grupo!*\n\nOs comandos do Dragon RPG voltaram a responder.`
      : `🐉💤 *Dragon RPG desativado neste grupo!*\n\nEnquanto estiver desligado, nenhum comando do Dragon RPG responderá.`);
  }

  // Sem on/off, mantém /dragonrpg como portal/menu do RPG.
  const dragonMenu = formatRpgMenu(prefix);
  return reply(dragonMenu);
}
break;

// === DRAGON RPG 3.0 — roteamento prioritário v4.0.8 ===
case "masmorras": case "dungeons": {
 const rows=Object.entries(DUNGEONS).map(([id,d])=>`${d.emoji} *${id}* — ${d.name} | Nv.${d.min}+ | ⚡${d.energy}`);
 return reply(`🐉🏰 *MASMORRAS*\n\n${rows.join("\n")}\n\nUse *${prefix}masmorra nome*`);
} break;
case "masmorra": case "dungeon": {
 if(!isGroup)return reply("🐉 Use este comando em um grupo.");
 const id=String(args[0]||"").toLowerCase(); if(!id)return reply(`Use *${prefix}masmorras*.`);
 let lv=1; try{lv=Number(userLevel||1)||1}catch{}
 const r=runDungeon(sender,id,lv);
 if(!r.ok){if(r.e==="LEVEL")return reply(`🔒 Nível necessário: *${r.need}*.`);if(r.e==="ENERGY")return reply(`⚡ Energia insuficiente: *${r.energy}/${r.need}*.`);if(r.e==="COOLDOWN")return reply(`⏳ Aguarde *${Math.ceil(r.wait/60000)} min*.`);return reply("❌ Masmorra inexistente.");}
 if(!r.win)return reply(`${r.boss ? "👑⚔️ *BOSS DA MASMORRA!*\\n\\n" : ""}${r.x.emoji} *${r.x.name}*\n\n💀 ${r.boss ? "O Boss te derrotou." : "Derrota."}\n⚡ Energia: *${r.energy}*`);
 return reply(`${r.boss ? "👑⚔️ *BOSS DA MASMORRA DERROTADO!*\\n\\n" : ""}${r.x.emoji} *${r.x.name} CONCLUÍDA!*\n\n🏆 Vitória${r.boss ? " contra o Boss!" : ""}\n✨ XP: *${r.xp}*\n🪙 Coins: *${r.coins}*\n\n🎒 *Drops:*\n${fmtMaterials(r.drops)}\n\n⚡ Energia: *${r.energy}*${r.boss ? "\\n🔥 Chance de Boss: *20%*." : ""}`);
} break;
case "materiais": {
 const u=dungeonProfile(sender); return reply(`🎒🐉 *MATERIAIS*\n\n${fmtMaterials(u.materials)||"Nenhum material ainda."}\n\n⚡ ${u.energy}/100 | 🏰 ${u.runs} exploração(ões)`);
} break;
case "receitas": case "crafts": {
 const rows=Object.entries(RECIPES).map(([id,r])=>`${r.name} — *${id}*\n${fmtNeeds(r.needs)}`);
 return reply(`⚒️🐉 *RECEITAS*\n\n${rows.join("\n\n")}\n\nUse *${prefix}craft item*`);
} break;
case "craft": {
 const id=String(args[0]||"").toLowerCase(),r=craftDungeon(sender,id);
 if(!r.ok){if(r.e==="MATERIALS")return reply(`❌ Faltam materiais:\n${fmtNeeds(r.missing)}`);return reply(`❌ Receita inexistente. Use *${prefix}receitas*.`);}
 return reply(`⚒️✨ *CRAFT CONCLUÍDO!*\n\n${r.r.name}\n🎒 Quantidade criada: *${r.count}*`);
} break;
case "descansodungeon": {
 const r=restDungeon(sender); return reply(`😴🐉 Energia recuperada: *${r.before} → ${r.after}*.`);
} break;

default:
reply(`🐉🌸 Não encontrei esse comando. Dá uma olhada no *${prefix}menu* pra ver tudo que eu sei fazer.`);
break;
case "rpg":
case "menurpg": {
  // /dragonrpg on|off controla o modo usando a mensagem completa.
  // /dragonrpg sem complemento continua abrindo o menu.
  if (command === "dragonrpg" && args?.length) {
    const arg = String(q || args[0] || "").trim().toLowerCase();
    const onArgs = ["on","ativar","ligar","1"];
    const offArgs = ["off","desativar","desligar","0"];

    if (onArgs.includes(arg) || offArgs.includes(arg)) {
      if (!isGroup) return reply("🐉 O Dragon RPG é configurado por grupo.");
      if (!groupAdmins.includes(sender) && !SoDonoPrincipal) {
        return reply("🛡️ Apenas administradores ou o dono principal podem alterar o Dragon RPG.");
      }

      const enabled = onArgs.includes(arg);
      setDragonRpgEnabled(from, enabled, sender);

      return reply(enabled
        ? `🐉🔥 *Dragon RPG ativado neste grupo!*\n\n✅ Comando reconhecido: *${prefix}${commandWithArgs}*`
        : `🐉💤 *Dragon RPG desativado neste grupo!*\n\n✅ Comando reconhecido: *${prefix}${commandWithArgs}*`);
    }
  }

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

case "classesavancadas": {
  const text = formatAdvancedClasses(sender, prefix);
  return reply(text || `🌱 Crie seu personagem primeiro com *${prefix}rpgcriar*.`);
}
break;

case "classeavancada": {
  const key=String(args[0]||"").toLowerCase();
  if(!key)return reply(`🌟 Use *${prefix}classeavancada necromante* por exemplo.\nVeja requisitos em *${prefix}classesavancadas*.`);
  const r=chooseAdvancedClass(sender,key);
  if(!r.ok){
    if(r.reason==="missing")return reply(`🌱 Crie seu personagem primeiro.`);
    if(r.reason==="already")return reply(`🌟 Você já possui uma classe avançada.`);
    if(r.reason==="requirements")return reply(`🔒 *REQUISITOS INCOMPLETOS • ${r.klass.name}*\n\n${r.missing.map(x=>`• ${x.name}`).join("\n")}\n\nVeja *${prefix}classesavancadas*.`);
    return reply(`❌ Classe avançada inválida. Veja *${prefix}classesavancadas*.`);
  }
  return reply(`${r.klass.icon}🌟 *CLASSE AVANÇADA DESBLOQUEADA!*\n\nVocê conquistou *${r.klass.name}*!\n🎯 ${r.klass.role}\n\nSeus bônus foram aplicados ao personagem.`);
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

🐲 Antes da escolha final, prove seu poder.\n\n⚔️ Enfrente: *${prefix}bossdespertar*\n\nDepois escolha sua facção:
🔥 *caos*
⚖️ *harmonia*
👁️ *espectador*
⚡ *independente*

Use: *${prefix}rpgfaccao caos*

⚠️ A escolha da facção é permanente nesta versão.`);
}
break;

case "bossdespertar":
case "despertarboss": {
  const socialInfo=getLevelInfoFromXp(getUserActivity(from,sender)?.xp||0);
  const r=startAwakeningBoss(sender,socialInfo.level);
  if(!r.ok){
    if(r.reason==="not_started")return reply(`🐉 Primeiro use *${prefix}despertardragao*.`);
    if(r.reason==="defeated")return reply(`✅ O Guardião já foi derrotado.`);
    if(r.reason==="combat")return reply(`⚔️ Você já está em batalha.`);
    return reply(`❌ Não foi possível iniciar o Boss do Despertar.`);
  }
  return reply(`🐲 *GUARDIÃO DO DESPERTAR*\n❤️ ${r.enemy.hp}/${r.enemy.maxHp}\n⚔️ ATK ${r.enemy.atk} • 🛡️ DEF ${r.enemy.def}\n\nUse *${prefix}atacar*, *${prefix}habilidade* ou *${prefix}defender*.`);
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
    if (result.reason === "boss") return reply(`🐲 Derrote primeiro o Guardião com *${prefix}bossdespertar*.`);
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

case "transformar":
case "formadragao": {
  const r=transformDragon(sender);
  if(!r.ok){
    if(r.reason==="locked")return reply(`🔒 Conclua o Despertar Dracônico primeiro.`);
    if(r.reason==="already")return reply(`🐉 Você já está na forma dracônica.`);
    if(r.reason==="energy")return reply(`🔥 Energia insuficiente: *${r.current}/${r.required}*.`);
    return reply(`❌ Não foi possível transformar.`);
  }
  return reply(`${r.klass.icon} *FORMA DRACÔNICA ATIVADA!*\n🔥 Energia: *${r.player.dragonEnergy}/${r.player.maxDragonEnergy}*\nUse *${prefix}habilidadedragao* em batalha.`);
}
break;
case "formahumana":
case "humano": {
  const r=returnHumanForm(sender);
  if(!r.ok)return reply(`👤 Você já está na forma humana.`);
  return reply(`👤 *Forma humana restaurada.*`);
}
break;
case "habilidadedragao":
case "skilldragao": {
  const r=useDragonSkill(sender);
  if(!r.ok){
    if(r.reason==="form")return reply(`🐉 Use *${prefix}transformar* primeiro.`);
    if(r.reason==="no_battle")return reply(`⚔️ Use essa habilidade durante uma batalha.`);
    if(r.reason==="mana")return reply(`🔷 Mana insuficiente. Precisa de *${r.required}*.`);
    return reply(`❌ Habilidade dracônica indisponível.`);
  }
  return reply(`${r.skill.icon} *${r.skill.name}*\n💥 Dano: *${r.damage}*${r.victory?`\n🏆 Inimigo derrotado!`:""}`);
}
break;
case "energiadragao":
case "descansodragao": {
  const r=restoreDragonEnergy(sender);
  if(!r.ok)return reply(`🌱 Crie seu personagem primeiro.`);
  return reply(`🔥 Energia Dracônica: *+${r.recovered}*\n🐉 Atual: *${r.player.dragonEnergy}/${r.player.maxDragonEnergy}*`);
}
break;
case "statusdespertar": {
  const r=getAwakeningStatus(sender);
  if(!r)return reply(`🌱 Crie seu personagem primeiro.`);
  return reply(`🐉 *STATUS DO DESPERTAR*\nIniciado: *${r.awakening.started?"Sim":"Não"}*\nBoss derrotado: *${r.awakening.bossDefeated?"Sim":"Não"}*\nConcluído: *${r.awakening.completed?"Sim":"Não"}*\nForma: *${r.klass?.name||"Nenhuma"}*\nEnergia: *${r.player.dragonEnergy}/${r.player.maxDragonEnergy}*`);
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
  if (result.bossEncounter || result.enemy?.isBoss) {
    return reply(`👑⚔️ *BOSS ENCONTRADO!*\n\n${formatBattleStart(result, prefix)}\n\n🔥 Esta região tem *20%* de chance de Boss. Prepare-se!`);
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
  const key = String(args?.[0] || "pocao_hp").toLowerCase();
  const r = rpgUseItem(sender, key);
  if (!r.ok) {
    if (r.reason === "item") return reply(`🎒 Você não possui esse item. Veja *${prefix}rpginventario* ou *${prefix}lojarpg*.`);
    if (r.reason === "full_hp") return reply(`❤️ Seu HP já está cheio.`);
    if (r.reason === "full_mana") return reply(`🔷 Sua Mana já está cheia.`);
    if (r.reason === "full_resources") return reply(`✨ Seu HP e sua Mana já estão cheios.`);
    if (r.reason === "buff_active") return reply(`💪 Você já tem uma Poção de Força ativa para o próximo ataque.`);
    return reply(`❌ Esse item não pode ser usado agora.`);
  }

  if (r.counter?.defeated) {
    return reply(`🧪 Você usou *${r.item.name}*, mas o inimigo contra-atacou e você foi derrotado.\n🏕️ Use *${prefix}descansar*.`);
  }

  const effects =
    `${r.heal ? ` ❤️ +${r.heal} HP.` : ""}` +
    `${r.mana ? ` 🔷 +${r.mana} Mana.` : ""}` +
    `${r.buff?.type === "forca" ? ` 💪 Próximo ataque: *+50% de força*.` : ""}`;

  const combatText = r.inCombat && r.counter
    ? `\n💥 O inimigo contra-atacou: *${r.counter.damage}* de dano.`
    : `\n✅ Item usado fora de combate.`;

  return reply(
    `${r.item.icon || "🧪"} Você usou *${r.item.name}*.${effects}` +
    combatText +
    `\n❤️ HP: *${r.player.resources.hp}/${r.player.stats.hp}*` +
    `\n🔷 Mana: *${r.player.resources.mana}/${r.player.stats.mana}*`
  );
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

case "carinho": {
  const target = resolveBanTarget(info, args);
  const mention = target ? `@${String(target).split("@")[0]}` : null;
  const captions = target ? [
    `🌸 ${mention}, toma um carinho pra deixar o dia um pouquinho mais leve. 🫶`,
    `💗 Um carinho especial chegou pra você, ${mention}. Aceita sem reclamar, hein? ✨`,
    `🐉💞 Kobayashi entregando uma dose de carinho para ${mention}. E não tem como recusar!`,
    `🌷 ${mention}, às vezes um pouquinho de carinho já muda tudo. Então toma. 🤍`
  ] : [
    `🌸 Passando só pra deixar um pouquinho de carinho por aqui. 🫶`,
    `💗 Dose gratuita de carinho entregue pela Kobayashi. ✨`,
    `🐉💞 Nem todo comando precisa causar caos... esse aqui é só carinho.`,
    `🌷 Um carinho inesperado pra deixar o chat um pouco mais fofinho. 🤍`
  ];
  const videoPath = path.join(process.cwd(), "media", "carinho", "carinho.mp4");
  if (!fs.existsSync(videoPath)) return reply("⚠️ O vídeo do /carinho não foi encontrado.");
  return conn.sendMessage(from, {
    video: fs.readFileSync(videoPath),
    caption: captions[Math.floor(Math.random()*captions.length)],
    gifPlayback: true,
    mentions: target ? [target] : []
  }, {quoted: info});
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
  if (!isGroupAdmins && !SoDono) return reply(mess.onlyAdmins());

  const action = String(args?.[0] || "").trim().toLowerCase();

  // Sem argumento: mantém o painel tradicional.
  if (!action || ["status","ver","painel"].includes(action)) {
    const yuriProtection = getYuriProtection(from);
    return reply(
      buildProtectionPanel({
        prefix,
        protections: getGroupProtection(from),
        antiTrava: getAntiTravaConfig(from),
        antiSpam: getAntiSpamConfig(from),
        antiDelete: Boolean(yuriProtection?.antidel),
        antiEdit: Boolean(yuriProtection?.antiedit),
        sentinel: getSentinelStatus(from)
      }) +
      `\n\n╭━━〔 🐉 *MODERAÇÃO V3* 〕━━╮\n` +
      `┃ ${prefix}protecao baixa\n` +
      `┃ ${prefix}protecao media\n` +
      `┃ ${prefix}protecao alta\n` +
      `┃ ${prefix}protecao off\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`
    );
  }

  const aliases = {
    leve: "baixa",
    low: "baixa",
    medio: "media",
    média: "media",
    médio: "media",
    normal: "media",
    high: "alta",
    forte: "alta",
    maxima: "alta",
    máxima: "alta",
    desativar: "off",
    desligar: "off"
  };
  const preset = aliases[action] || action;

  if (!["baixa","media","alta","off"].includes(preset)) {
    return reply(
      `🛡️🐉 *MODERAÇÃO V3*\n\n` +
      `Escolha um nível:\n` +
      `• *${prefix}protecao baixa*\n` +
      `• *${prefix}protecao media*\n` +
      `• *${prefix}protecao alta*\n` +
      `• *${prefix}protecao off*\n\n` +
      `Use *${prefix}protecao* para conferir o painel atual.`
    );
  }

  const applied = applyProtectionPreset(from, preset);
  if (!applied) return reply("❌ Não consegui aplicar esse perfil de proteção.");

  addAdminLog(from, {
    type: "protecao_preset",
    actor: sender,
    detail: `Preset de proteção: ${preset}`
  });

  const labels = {
    baixa: "🟢 BAIXA",
    media: "🟡 MÉDIA",
    alta: "🔴 ALTA",
    off: "⚪ DESATIVADA"
  };

  const descriptions = {
    baixa:
      "AntiLink Light + Telegram, AntiTrava, AntiMenção e AntiTextão. Punições mais leves.",
    media:
      "AntiLink de grupos + Telegram, AntiSpam, AntiTrava, AntiFlood, AntiMenção, AntiTextão e AntiDelete.",
    alta:
      "AntiLink completo, AntiTelegram, AntiSpam, AntiFake, AntiTrava, AntiFlood, AntiMenção, AntiTextão, AntiDelete, AntiEdit e emergência.",
    off:
      "Desativa os módulos automáticos controlados pelo perfil. Lista branca e configurações manuais continuam preservadas."
  };

  const adminWarning = !isBotGroupAdmins && preset !== "off"
    ? `\n\n⚠️ *Atenção:* eu não sou ADM. Algumas proteções não conseguirão apagar mensagens ou remover membros.`
    : "";

  return reply(
    `╭━━〔 🛡️🐉 *MODERAÇÃO V3* 〕━━╮\n` +
    `┃ Perfil: *${labels[preset]}*\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `${descriptions[preset]}` +
    `${adminWarning}\n\n` +
    `📊 Use *${prefix}protecao* ou *${prefix}statusgrupo* para conferir tudo.`
  );
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

case "rankadm": {
  if (!isGroup) return reply("👑 O /rankadm só funciona em grupos.");

  const normalizeRankCategory = (value="") => {
    const v = String(value || "").trim().toLowerCase();
    const map = {
      texto:"text", text:"text", mensagens:"text",
      foto:"photos", fotos:"photos", photo:"photos",
      video:"videos", videos:"videos", vídeo:"videos", vídeos:"videos",
      figu:"stickers", figurinha:"stickers", figurinhas:"stickers", sticker:"stickers", stickers:"stickers",
      cmd:"commands", comando:"commands", comandos:"commands",
      total:"total", geral:"total"
    };
    return map[v] || null;
  };

  const rankLabel = {
    total:"GERAL",
    text:"TEXTOS",
    photos:"FOTOS",
    videos:"VÍDEOS",
    stickers:"FIGURINHAS",
    commands:"COMANDOS"
  };

  const rankIcon = {
    total:"🐉",
    text:"💬",
    photos:"📷",
    videos:"🎥",
    stickers:"🎴",
    commands:"⌨️"
  };

  const dominantCategory = (adm) => {
    const cats = [
      ["💬 Texto", adm.text],
      ["📷 Fotos", adm.photos],
      ["🎥 Vídeos", adm.videos],
      ["🎴 Figurinhas", adm.stickers],
      ["⌨️ Comandos", adm.commands]
    ].sort((a,b)=>b[1]-a[1]);
    return cats[0][1] > 0 ? cats[0][0] : "🌙 Sem atividade";
  };

  const target = resolveBanTarget(info, args);
  const firstArg = String(args?.[0] || "").trim().toLowerCase();
  const requestedCategory =
    firstArg === "top"
      ? normalizeRankCategory(args?.[1])
      : normalizeRankCategory(firstArg);

  // Perfil individual: respondendo/marcando alguém com /rankadm.
  if (target) {
    const isCurrentAdmin = (groupAdmins || []).includes(target);
    if (!isCurrentAdmin) {
      return reply("👑 Esse membro não é administrador atual do grupo.");
    }

    const adm = getAdminActivityUser(from, target);
    if (!adm || !adm.total) {
      return reply(`👑 @${target.split("@")[0]} ainda não possui atividade registrada no Rank ADM.`);
    }

    const groupStats = getAdminActivityStats(from, groupAdmins || []);
    const share = groupStats.totals.total > 0
      ? ((adm.total / groupStats.totals.total) * 100).toFixed(1)
      : "0.0";

    return conn.sendMessage(from, {
      text:
        `╭━━━〔 👑 *PERFIL ADM* 〕━━━╮\n` +
        `┃ 🐉 @${target.split("@")[0]}\n` +
        `┃ ✨ ${adm.total} interações • ${share}% do total\n` +
        `┃ 🌟 Destaque: ${dominantCategory(adm)}\n` +
        `┣━━━━━━━━━━━━━━━━━━\n` +
        `┃ 💬 Textos: *${adm.text}*\n` +
        `┃ 📷 Fotos: *${adm.photos}*\n` +
        `┃ 🎥 Vídeos: *${adm.videos}*\n` +
        `┃ 🎴 Figurinhas: *${adm.stickers}*\n` +
        `┃ ⌨️ Comandos: *${adm.commands}*\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`,
      mentions:[target]
    }, {quoted:info});
  }

  const sortBy = requestedCategory || "total";
  const ranking = getAdminActivityRank(from, groupAdmins || [], 10, sortBy);
  const stats = getAdminActivityStats(from, groupAdmins || []);

  if (!ranking.length) {
    return reply(
      "╭━━━〔 👑 *RANK ADM* 〕━━━╮\n" +
      "┃ Ainda não há atividade registrada.\n" +
      "┃ O ranking começa a contar a partir\n" +
      "┃ da atualização v2.0.15.\n" +
      "╰━━━━━━━━━━━━━━━━━━╯"
    );
  }

  const medals = ["🥇","🥈","🥉"];
  const mentions = [];
  const valueFor = (adm) => Number(adm[sortBy] || 0);

  const cards = ranking.map((adm,index)=>{
    mentions.push(adm.jid);
    const medal = medals[index] || `🏅 ${index+1}º`;
    const share = stats.totals.total > 0
      ? ((adm.total / stats.totals.total) * 100).toFixed(1)
      : "0.0";

    return (
      `${medal} *@${adm.jid.split("@")[0]}*\n` +
      `╰➤ ${rankIcon[sortBy]} *${valueFor(adm)}* em ${rankLabel[sortBy].toLowerCase()}` +
      (sortBy !== "total" ? ` • 🐉 ${adm.total} total` : "") + `\n` +
      `   💬 ${adm.text}  📷 ${adm.photos}  🎥 ${adm.videos}\n` +
      `   🎴 ${adm.stickers}  ⌨️ ${adm.commands}  📊 ${share}%\n` +
      `   🌟 ${dominantCategory(adm)}`
    );
  });

  const leaderLine = (key,emoji,label) => {
    const l = stats.leaders[key];
    if (!l || !Number(l[key]||0)) return `${emoji} ${label}: —`;
    mentions.push(l.jid);
    return `${emoji} ${label}: @${l.jid.split("@")[0]} (${l[key]})`;
  };

  const textOut =
    `╭━━━〔 👑🐉 *RANK ADM 2.0* 〕━━━╮\n` +
    `┃ ${rankIcon[sortBy]} Ranking: *${rankLabel[sortBy]}*\n` +
    `┃ 👑 ADMs ativos: *${stats.activeAdmins}*\n` +
    `┃ ✨ Interações: *${stats.totals.total}*\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    cards.join("\n\n") +
    `\n\n╭━━〔 🌸 *LÍDERES POR CATEGORIA* 〕━━╮\n` +
    `${leaderLine("text","💬","Texto")}\n` +
    `${leaderLine("photos","📷","Fotos")}\n` +
    `${leaderLine("videos","🎥","Vídeos")}\n` +
    `${leaderLine("stickers","🎴","Figurinhas")}\n` +
    `${leaderLine("commands","⌨️","Comandos")}\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `╭━━〔 🎯 *FILTROS* 〕━━╮\n` +
    `┃ /rankadm texto\n` +
    `┃ /rankadm fotos\n` +
    `┃ /rankadm videos\n` +
    `┃ /rankadm figurinhas\n` +
    `┃ /rankadm comandos\n` +
    `┃ /rankadm @adm  • ou responda\n` +
    `╰━━━━━━━━━━━━━━━━╯`;

  return conn.sendMessage(from, {
    text:textOut,
    mentions:[...new Set(mentions)]
  }, {quoted:info});
}
break;

case "resetrankadm": {
  if (!isGroup) return reply("👑 Esse comando só funciona em grupos.");
  if (!isGroupAdmins && !SoDonoPrincipal) {
    return reply("⚠️ Apenas administradores podem zerar o Rank ADM.");
  }

  const confirm = String(args?.[0] || "").trim().toLowerCase();
  if (!["confirmar","confirmo","sim"].includes(confirm)) {
    return reply(
      "⚠️ *Zerar todo o Rank ADM deste grupo?*\n\n" +
      "Use: */resetrankadm confirmar*"
    );
  }

  return reply(
    resetAdminActivityRank(from)
      ? "👑✨ *Rank ADM zerado com sucesso!*"
      : "👑 O Rank ADM ainda não possui dados."
  );
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
case "statusupdate":
case "verificarupdate": {
  if (!SoDono) return reply(mess.onlyOwner());

  reagir("✅");

  try {
    const license = getEffectiveLicense();
    const status = await checkUpdate();
    const sincronizado = !status.available && String(status.local) === String(status.remote);

    return reply(
      `🐉🌸 *KOBAYASHI UPDATE • V4*\n\n` +
      `📦 Instalada: *${status.local}*\n` +
      `☁️ Disponível: *${status.remote}*\n` +
      `📡 Canal: *${status.channel || "stable"}*\n` +
      `🔄 Estado: *${sincronizado ? "ATUALIZADO ✅" : "ATUALIZAÇÃO DISPONÍVEL ⚠️"}*\n\n` +
      `🔑 Licença: *${license.valid ? "ATIVA ✅" : "NÃO ATIVADA ❌"}*\n` +
      `🎟️ Plano: *${license.plan || "-"}*\n` +
      `⬆️ Updates: *${license.updates ? "LIBERADOS ✅" : "BLOQUEADOS ⛔"}*\n\n` +
      (status.available
        ? `Use *${prefix}atualizar* para instalar a versão oficial.`
        : `🌸 Kobayashi está sincronizada.`)
    );
  } catch (e) {
    const license = getEffectiveLicense();
    return reply(
      `🐉🌸 *KOBAYASHI UPDATE • V4*\n\n` +
      `📦 Versão: *${getLocalVersion()}*\n` +
      `🔑 Licença: *${license.valid ? "ATIVA ✅" : "NÃO ATIVADA ❌"}*\n` +
      `⚠️ Não consegui consultar a atualização agora.\n` +
      `Detalhe: ${e?.message || e}`
    );
  }
}
break;
//

// licença oficial v4
case "licenca":
case "license": {
  if (!SoDono) return reply(mess.onlyOwner());

  let license = getEffectiveLicense();
  if (license.mode !== "creator" && license.key && license.needsOnlineValidation) {
    try {
      license = await validateLicense({ version: getLocalVersion() });
    } catch {}
  }

  const cfg = getLicenseConfig();
  const cacheText = license.mode === "creator"
    ? "não necessário"
    : (license.cached ? "válido ✅" : "pendente/expirado ⚠️");

  return reply(
    `╭━━〔 🔑🐉 *LICENÇA KOBAYASHI* 〕━━╮\n` +
    `┃ 📦 Versão: *${getLocalVersion()}*\n` +
    `┃ 🔐 Status: *${license.valid ? "ATIVA ✅" : "NÃO ATIVADA ❌"}*\n` +
    `┃ 🎟️ Plano: *${license.plan || "-"}*\n` +
    `┃ 👤 Cliente: *${license.customer || "-"}*\n` +
    `┃ ⬆️ Updates: *${license.updates ? "LIBERADOS ✅" : "BLOQUEADOS ⛔"}*\n` +
    `┃ 🔑 Chave: *${maskLicenseKey(license.key)}*\n` +
    `┃ 💾 Cache: *${cacheText}*\n` +
    `┃ 📡 Canal: *${cfg.channel || "stable"}*\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
  );
}
break;

case "ativarlicenca":
case "activatelicense": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode ativar a licença.");

  const key = String(q || args.join(" ") || "").trim();
  if (!key) {
    return reply(
      `🔑 *ATIVAÇÃO DA LICENÇA*\n\n` +
      `Use: *${prefix}ativarlicenca SUA-CHAVE*\n\n` +
      `No Termux também funciona:\n` +
      `*npm run license:activate -- SUA-CHAVE*`
    );
  }

  reagir("🔑");
  try {
    const result = await activateLicense(key, getLocalVersion());
    return reply(
      `✅🐉 *LICENÇA ATIVADA!*\n\n` +
      `🎟️ Plano: *${result.plan || "-"}*\n` +
      `👤 Cliente: *${result.customer || "-"}*\n` +
      `⬆️ Atualizações: *${result.updates ? "LIBERADAS ✅" : "BLOQUEADAS ⛔"}*`
    );
  } catch (e) {
    return reply(
      `❌ *Não foi possível ativar a licença.*\n\n` +
      `${e?.message || e}`
    );
  }
}
break;

// administração de licenças v4.0.2
case "licencacriar": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode criar licenças.");
  const customer = String(q || args.join(" ") || "").trim();
  if (!customer) return reply(`Use: *${prefix}licencacriar Nome do comprador*`);
  try {
    const result = await createLicense({ customer, plan:"permanent", updates:true, maxInstallations:1 });
    return reply(
      `🔑🐉 *LICENÇA CRIADA*\n\n` +
      `👤 Cliente: *${result.customer || customer}*\n` +
      `🎟️ Plano: *${result.plan || "permanent"}*\n` +
      `🔑 Chave: *${result.key}*\n` +
      `💻 Instalações: *${result.maxInstallations || 1}*\n` +
      `⬆️ Updates: *${result.updates === false ? "BLOQUEADOS ⛔" : "LIBERADOS ✅"}*`
    );
  } catch (e) {
    return reply(`❌ ${e?.message || e}`);
  }
}
break;

case "licencas": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode listar licenças.");
  try {
    const result = await listLicenses();
    const items = Array.isArray(result?.licenses) ? result.licenses : [];
    if (!items.length) return reply("🔑 Nenhuma licença cadastrada.");
    const lines = items.slice(0, 30).map((x, i) =>
      `${i+1}. ${x.blocked ? "⛔" : "✅"} *${x.key}* — ${x.customer || "-"} — ${x.plan || "-"}`
    );
    return reply(`🔑🐉 *LICENÇAS KOBAYASHI*\n\n${lines.join("\n")}`);
  } catch (e) {
    return reply(`❌ ${e?.message || e}`);
  }
}
break;

case "licencaver": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode consultar licenças.");
  const key = String(q || args.join(" ") || "").trim();
  if (!key) return reply(`Use: *${prefix}licencaver KOBA-XXXX-XXXX-XXXX*`);
  try {
    const result = await getLicense(key);
    const installs = Array.isArray(result?.installations) ? result.installations : [];
    return reply(
      `🔑🐉 *DETALHES DA LICENÇA*\n\n` +
      `🔑 Chave: *${result.key || key}*\n` +
      `👤 Cliente: *${result.customer || "-"}*\n` +
      `🎟️ Plano: *${result.plan || "-"}*\n` +
      `📌 Status: *${result.blocked ? "BLOQUEADA ⛔" : "ATIVA ✅"}*\n` +
      `⬆️ Updates: *${result.updates === false ? "BLOQUEADOS ⛔" : "LIBERADOS ✅"}*\n` +
      `💻 Instalações: *${installs.length}/${result.maxInstallations || 1}*\n` +
      (installs.length ? `\n${installs.map((x,i)=>`${i+1}. ${x.installationId}`).join("\n")}` : "")
    );
  } catch (e) {
    return reply(`❌ ${e?.message || e}`);
  }
}
break;

case "licencabloquear": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode bloquear licenças.");
  const key = String(q || args.join(" ") || "").trim();
  if (!key) return reply(`Use: *${prefix}licencabloquear KOBA-XXXX-XXXX-XXXX*`);
  try {
    await blockLicense(key);
    return reply(`⛔ Licença *${key}* bloqueada.`);
  } catch (e) { return reply(`❌ ${e?.message || e}`); }
}
break;

case "licencareativar": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode reativar licenças.");
  const key = String(q || args.join(" ") || "").trim();
  if (!key) return reply(`Use: *${prefix}licencareativar KOBA-XXXX-XXXX-XXXX*`);
  try {
    await reactivateLicense(key);
    return reply(`✅ Licença *${key}* reativada.`);
  } catch (e) { return reply(`❌ ${e?.message || e}`); }
}
break;

case "licencadesvincular": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o dono principal pode desvincular instalações.");
  const raw = String(q || args.join(" ") || "").trim();
  const [key, installationId] = raw.split(/\s+/);
  if (!key || !installationId) {
    return reply(`Use: *${prefix}licencadesvincular KOBA-XXXX-XXXX-XXXX ID-DA-INSTALACAO*`);
  }
  try {
    await revokeInstallation(key, installationId);
    return reply(`✅ Instalação desvinculada da licença *${key}*.`);
  } catch (e) { return reply(`❌ ${e?.message || e}`); }
}
break;

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
      `☁️ Oficial: *${status.remote}*\n` +
      `📡 Canal: *${status.channel || "stable"}*\n\n` +
      situacao
    );
  } catch (e) {
    return reply(
      `🐉🌸 *KOBAYASHI BOT • VERSÃO*\n\n` +
      `📦 Instalada: *${getLocalVersion()}*\n` +
      `⚠️ Não consegui consultar o canal oficial agora.\n` +
      `Detalhe: ${e?.message || e}`
    );
  }
}
break;

case "update":
case "atualizar": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode alterar configurações críticas do bot.");

  reagir("🔄");
  await reply("🐉🌸 *Verificando licença e atualização oficial...*\n\nNão desligue o bot durante o processo.");

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



case "cita": {
  if (!isGroup) return reply("👥 O comando *cita* só pode ser usado em grupos.");
  if (!isGroupAdmins && !SoDono) return reply("🛡️ Apenas *ADMs* podem usar o comando *cita*.");

  const participantes = [...new Set(
    (groupMembers || []).map(p => p?.id || p?.jid || p?.participant).filter(Boolean)
  )];
  if (!participantes.length) return reply("❌ Não consegui carregar os participantes deste grupo.");

  // Proteção contra disparos repetidos de hidetag em grupos grandes.
  if (participantes.length >= 150 && !SoDono) {
    const now = Date.now();
    const last = Number(citaLargeGroupCooldown.get(from) || 0);
    const wait = 30_000 - (now - last);
    if (wait > 0) return reply(`⏳ Em grupos grandes, aguarde *${Math.ceil(wait/1000)}s* antes de usar o *cita* novamente.`);
    citaLargeGroupCooldown.set(from, now);
  }

  const contextInfo =
    info?.message?.extendedTextMessage?.contextInfo ||
    info?.message?.imageMessage?.contextInfo ||
    info?.message?.videoMessage?.contextInfo ||
    info?.message?.documentMessage?.contextInfo ||
    null;

  const quoted = contextInfo?.quotedMessage;
  if (!quoted) return reply(`↩️ Responda a mensagem desejada usando *${prefix}cita*.`);

  // CITA v5.2.4
  // Baseado no comportamento observado nas bases de referência:
  // reenvia o conteúdo marcado sem cabeçalho/texto extra e injeta mentions ocultas.
  try {
    const unwrap = (msg) =>
      msg?.viewOnceMessage?.message ||
      msg?.viewOnceMessageV2?.message ||
      msg?.viewOnceMessageV2Extension?.message ||
      msg?.ephemeralMessage?.message ||
      msg?.documentWithCaptionMessage?.message ||
      msg;

    const qm = unwrap(quoted);

    const baixar = async (node, tipo) => {
      const stream = await downloadContentFromMessage(node, tipo);
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      return Buffer.concat(chunks);
    };

    if (qm?.conversation || qm?.extendedTextMessage?.text) {
      const text = String(qm.conversation || qm.extendedTextMessage.text || "");
      return await conn.sendMessage(from, { text, mentions: participantes });
    }

    if (qm?.imageMessage) {
      const m = qm.imageMessage;
      const data = await baixar(m, "image");
      return await conn.sendMessage(from, {
        image: data,
        caption: m.caption || "",
        mentions: participantes,
        mimetype: m.mimetype || undefined
      });
    }

    if (qm?.videoMessage) {
      const m = qm.videoMessage;
      const data = await baixar(m, "video");
      return await conn.sendMessage(from, {
        video: data,
        caption: m.caption || "",
        mentions: participantes,
        mimetype: m.mimetype || undefined,
        gifPlayback: !!m.gifPlayback
      });
    }

    if (qm?.audioMessage) {
      const m = qm.audioMessage;
      const data = await baixar(m, "audio");
      return await conn.sendMessage(from, {
        audio: data,
        mentions: participantes,
        mimetype: m.mimetype || "audio/ogg; codecs=opus",
        ptt: true
      });
    }

    if (qm?.stickerMessage) {
      const m = qm.stickerMessage;
      const data = await baixar(m, "sticker");
      return await conn.sendMessage(from, {
        sticker: data,
        mentions: participantes
      });
    }

    if (qm?.documentMessage) {
      const m = qm.documentMessage;
      const data = await baixar(m, "document");
      return await conn.sendMessage(from, {
        document: data,
        fileName: m.fileName || "arquivo",
        mimetype: m.mimetype || "application/octet-stream",
        caption: m.caption || "",
        mentions: participantes
      });
    }

    return reply("⚠️ Esse tipo de mensagem ainda não é compatível com o *cita*.");
  } catch (e) {
    console.error("[CITA] Erro ao reenviar conteúdo marcado:", e?.message || e);
    return reply("❌ Erro ao reenviar a mensagem marcada. Tente novamente.");
  }
}
break;

case "debugdono": {
  const safeIds = ownerIdentityCandidates.map((jid) => {
    const value = String(jid);
    if (value.includes("@lid")) return `LID: ${value}`;
    const digits = jidLocalDigits(value);
    return digits ? `PN: ...${digits.slice(-4)}` : value;
  });

  return reply(
    `👑🐉 *DIAGNÓSTICO DE DONO*\n\n` +
    `Reconhecido como dono: *${SoDonoPrincipal ? "SIM ✅" : "NÃO ❌"}*\n` +
    `Identidades detectadas: *${safeIds.length}*\n` +
    `${safeIds.slice(0, 8).map((v, i) => `${i + 1}. ${v}`).join("\n") || "Nenhuma"}\n\n` +
    `Use este comando para diagnosticar reconhecimento sem expor o número completo.`
  );
}
break;

case "msg": {
  if (!SoDonoPrincipal) return reply("👑 Apenas o *dono principal* pode enviar avisos globais.");

  const aviso=String(q||"").trim();
  if(!aviso)return reply(`📢 *AVISO GLOBAL*\n\nUse: *${prefix}msg texto do aviso*`);

  // v4.0.14: o WhatsApp pode responder 429/500 ao groupFetchAllParticipating.
  // O erro agora é tratado e nunca é relançado para o processo principal.
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  const statusOf=(e)=>Number(e?.data||e?.output?.statusCode||e?.output?.payload?.statusCode||e?.statusCode||0);
  let groups=null;

  for(let attempt=1;attempt<=2;attempt++){
    try{
      groups=await conn.groupFetchAllParticipating();
      if(groups && typeof groups==="object")break;
    }catch(e){
      const status=statusOf(e);
      console.error(`[MSG GLOBAL] groupFetch tentativa ${attempt}/2 (${status||"sem status"}):`,e?.message||e);
      if(attempt===1){
        // Um único retry com espera maior; não martela a API em caso de rate limit.
        await sleep(status===429 ? 12000 : 5000);
      }
    }
  }

  if(!groups || typeof groups!=="object"){
    return reply(
      `⚠️🐉 *AVISO GLOBAL NÃO INICIADO*\n\n`+
      `O WhatsApp limitou temporariamente a consulta dos grupos (429/500).\n`+
      `A Kobayashi continuou online e nenhum envio foi repetido.\n\n`+
      `⏳ Aguarde alguns minutos antes de usar *${prefix}msg* novamente.`
    );
  }

  const entries=Object.entries(groups);
  if(!entries.length)return reply("📭 A Kobayashi não está participando de nenhum grupo.");

  let enviados=0,falhas=0,rateLimits=0;
  await reply(`📢🐉 *ENVIO GLOBAL INICIADO*\n\n🏘️ Grupos encontrados: *${entries.length}*\n🛡️ Modo seguro anti-429 ativado.`);

  const MAX_MSG_CHUNK=55000;
  const partes=[];
  for(let i=0;i<aviso.length;i+=MAX_MSG_CHUNK)partes.push(aviso.slice(i,i+MAX_MSG_CHUNK));
  if(!partes.length)partes.push(aviso);

  for(const [groupJid,cachedMeta] of entries){
    try{
      // Prioriza metadata já devolvida pelo fetch global. Evita uma requisição extra
      // para cada grupo e reduz muito a chance de 429.
      let meta=cachedMeta;
      if(!Array.isArray(meta?.participants)){
        try{
          meta=await conn.groupMetadata(groupJid);
          await sleep(600);
        }catch(e){
          console.error(`[MSG GLOBAL] metadata ${groupJid}:`,e?.message||e);
          meta=cachedMeta||{};
        }
      }

      const mentions=[...new Set((meta?.participants||[]).map(p=>p?.id||p?.jid).filter(Boolean))];

      for(let i=0;i<partes.length;i++){
        const multi=partes.length>1?`\n📄 *Parte ${i+1}/${partes.length}*`:"";
        try{
          await conn.sendMessage(groupJid,{
            text:`╭━━〔 📢🐉 *AVISO KOBAYASHI* 〕━━╮${multi}\n\n${partes[i]}\n\n╰━━〔 🌸 *KOBAYASHI BOT* 〕━━╯`,
            mentions
          });
        }catch(e){
          const status=statusOf(e);
          if(status===429){
            rateLimits++;
            console.error(`[MSG GLOBAL] 429 em ${groupJid}; aguardando antes de continuar.`);
            await sleep(15000);
          }
          throw e;
        }
        if(i<partes.length-1)await sleep(1000);
      }

      enviados++;
      // Ritmo conservador entre grupos para evitar rajada de requests.
      await sleep(2500);
    }catch(e){
      falhas++;
      console.error(`[MSG GLOBAL] Falha em ${groupJid}:`,e?.message||e);
      // Qualquer falha fica contida no grupo atual; o bot não encerra.
      await sleep(statusOf(e)===429?15000:2500);
    }
  }

  return reply(
    `✅🐉 *AVISO GLOBAL FINALIZADO*\n\n`+
    `📨 Enviados: *${enviados}*\n`+
    `❌ Falhas: *${falhas}*\n`+
    `⚠️ Limitações 429 detectadas: *${rateLimits}*\n`+
    `🏘️ Total: *${entries.length}*`
  );
}
break;

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

  const aliases = {
    on:"aviso",
    aviso:"aviso",
    avisar:"aviso",
    warn:"aviso",
    bloquear:"bloquear",
    block:"bloquear",
    aluguel:"aluguel",
    alugar:"aluguel",
    redirecionar:"aluguel",
    redirect:"aluguel",
    off:"off",
    desligar:"off"
  };

  const raw = String(args[0] || "").toLowerCase();
  const op = aliases[raw] || "";

  if (!op) {
    const cfg = readSettingsFile();
    const current = String(cfg?.antiPvMode || (cfg?.antiPv ? "aviso" : "off")).toLowerCase();
    const label = {
      aviso:"⚠️ AVISO",
      bloquear:"🚫 BLOQUEAR",
      aluguel:"💼 ALUGUEL",
      off:"❌ DESATIVADO"
    }[current] || current;

    return reply(
      `╭━━━〔 🛡️🐉 *ANTI-PV 3 MODOS* 〕━━━╮\n` +
      `┃ Status atual: *${label}*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `⚠️ *${prefix}antipv aviso*\n` +
      `Avisa a pessoa que o PV é protegido e notifica o dono.\n\n` +
      `🚫 *${prefix}antipv bloquear*\n` +
      `Avisa e bloqueia o contato no WhatsApp automaticamente.\n\n` +
      `💼 *${prefix}antipv aluguel*\n` +
      `Redireciona a pessoa para alugar a Kobayashi diretamente com você.\n\n` +
      `❌ *${prefix}antipv off*\n` +
      `Desativa a proteção do privado.`
    );
  }

  const cfg = readSettingsFile();
  cfg.antiPvMode = op;
  // Mantém compatibilidade com trechos antigos que ainda consultem antiPv.
  cfg.antiPv = op !== "off";
  writeSettingsFile(cfg);

  const response = {
    aviso:
      "⚠️🐉 *Anti-PV modo AVISO ativado.*\nQuem chamar no PV recebe um aviso e você será notificado.",
    bloquear:
      "🚫🐉 *Anti-PV modo BLOQUEAR ativado.*\nQuem chamar no PV será avisado e bloqueado automaticamente.",
    aluguel:
      "💼🐉 *Anti-PV modo ALUGUEL ativado.*\nQuem chamar no PV será redirecionado para:\nhttps://wa.me/5515997075304?text=Quero%20alugar%20o%20bot%2C%20como%20fa%C3%A7o%3F",
    off:
      "❌🐉 *Anti-PV desativado.*"
  };

  return reply(response[op]);
}
break;
//

// dono
case "statuscore":
case "corestatus": {
  if(!SoDono)return reply(mess.onlyOwner());
  const st=getCoreStatus();
  const up=Math.floor(st.uptimeMs/1000);
  return reply(
    `🐉🛡️ *KOBAYASHI CORE V5*\n\n`+
    `⏱️ Uptime: *${Math.floor(up/86400)}d ${Math.floor(up%86400/3600)}h ${Math.floor(up%3600/60)}m*\n`+
    `🧠 RAM RSS: *${st.rssMB} MB*\n`+
    `📦 Heap: *${st.heapUsedMB}/${st.heapTotalMB} MB*\n`+
    `🧹 Temporários removidos: *${st.deletedTemp}*\n`+
    `💾 Espaço liberado: *${st.freedMB} MB*\n`+
    `⚠️ Alertas: *${st.warnings.length}*\n`+
    `❌ Erros capturados: *${st.errors.length}*`
  );
}
break;

case "limpartemp":
case "cleantemp": {
  if(!SoDono)return reply(mess.onlyOwner());
  const r=await cleanCoreTemp();
  return reply(`🧹🐉 *LIMPEZA CONCLUÍDA*\n\n🗑️ Arquivos removidos: *${r.deleted}*\n💾 Liberado: *${r.freedMB} MB*`);
}
break;

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
  const note = v5AddNote(from, q, sender);
  addAdminLog(from, { type: "anotacao", actor: sender, detail: `Nota #${note.id} criada` });
  return reply(`✅📝 Anotação *#${note.id}* salva.\n\n${note.text}`);
}
break;

case "anotacoes":
case "notas": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const notes = v5ListNotes(from);
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
  const ok = v5RemoveNote(from, id);
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

  // Sem argumentos: explica o novo modo direto.
  if (!args.length && !getTargetFromMessage(info, null)) {
    const list = getBlacklist(from);
    const preview = list.length
      ? `\n📋 *Atualmente bloqueados (${list.length}):*\n${list.slice(0,30).map((jid,i)=>`${i+1}. @${jid.split("@")[0]}`).join("\n")}`
      : "\n📋 Nenhum número bloqueado neste grupo.";

    return conn.sendMessage(from, {
      text:
        `╭━━〔 ⛔ *LISTA NEGRA* 〕━━╮\n` +
        `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
        `📌 *Como usar:*\n` +
        `• ${prefix}listanegra +5511999999999\n` +
        `• ${prefix}listanegra +5511999999999 +5521988888888 +5531977777777\n\n` +
        `✅ Não precisa mais usar *add*.\n` +
        `🐉 Ao enviar um ou vários números, eles são adicionados imediatamente.\n` +
        `💡 Também funciona marcando/respondendo um membro.` +
        preview,
      mentions:list.slice(0,30)
    }, {quoted:info});
  }

  const mentioned = getTargetFromMessage(info, null);
  const raw = args.join(" ");
  const numbers = (raw.match(/\+?\d[\d().\-\s]{8,}\d/g) || [])
    .flatMap(chunk => {
      // Permite vários números separados por vírgula, quebra de linha ou espaço antes de novo +55.
      return chunk.split(/(?=\+\d{10,})/g);
    })
    .map(n => n.replace(/\D/g,""))
    .filter((n,i,a)=>n.length>=10 && a.indexOf(n)===i);

  const targets = [];
  if (mentioned) targets.push(mentioned);
  for (const n of numbers) {
    const jid=inputToJid(n);
    if (jid && !targets.includes(jid)) targets.push(jid);
  }

  if (!targets.length) {
    return reply(
      `❌ Não encontrei nenhum número válido.\n\n` +
      `Exemplo:\n*${prefix}listanegra +5511999999999 +5521988888888*`
    );
  }

  const added=[], skipped=[], failed=[];
  for (const target of targets) {
    if (target === dono || isMainOwnerJid(target)) { skipped.push(target); continue; }
    try {
      if (!getBlacklist(from).includes(target)) {
        addBlacklist(from,target,sender,"Adicionado manualmente");
        addPunishmentHistory(from,target,{type:"blacklist_add",reason:"Adicionado manualmente",by:sender,source:"manual"});
        addAdminLog(from,{type:"blacklist_add",actor:sender,target,detail:"Adicionado manualmente"});
        added.push(target);
      } else skipped.push(target);

      await purgeUserFromAdminGroups(conn,target,{announce:true,source:"Lista Negra"});
    } catch(e) {
      console.error("[LISTANEGRA MULTI]",target,e?.message||e);
      failed.push(target);
    }
  }

  const mentions=[...added,...skipped,...failed];
  return conn.sendMessage(from,{
    text:
      `⛔🐉 *LISTA NEGRA ATUALIZADA*\n\n` +
      `✅ Adicionados: *${added.length}*\n` +
      `ℹ️ Já cadastrados/protegidos: *${skipped.length}*\n` +
      `❌ Falhas: *${failed.length}*\n\n` +
      (added.length ? `👤 ${added.map(j=>`@${j.split("@")[0]}`).join("\n👤 ")}` : ""),
    mentions
  },{quoted:info});
}
break;

case "entrada_membro":
case "entradamembro": {
 if(!isGroup)return reply(mess.onlyGroup());
 const raw=args.join(" ").trim(), mentioned=getTargetFromMessage(info,null), target=mentioned||inputToJid(raw);
 if(!target)return reply(`👥 *ENTRADA DO MEMBRO*\n\nUse: *${prefix}entrada_membro +5511999999999*\nTambém pode marcar/responder o membro.\n\n📅 Mostra: dia/mês hora:minuto.`);
 const aliases=await buildBlacklistTargetAliases(conn,target).catch(()=>new Set([target]));
 const av=[...aliases]; let entry=null;
 for(const a of av){entry=getMemberEntry(from,a);if(entry)break}
 const present=(groupMembers||[]).some(p=>[p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).some(id=>av.some(a=>blacklistJidMatches(id,a))));
 if(!present)return reply("⚠️ Esse número não está presente neste grupo.");
 if(!entry)return conn.sendMessage(from,{text:`👥 *ENTRADA DO MEMBRO*\n\n👤 @${target.split("@")[0]}\n📅 Data de entrada: *não registrada*\n\nℹ️ O WhatsApp não fornece ao bot o histórico retroativo. A Kobayashi registra silenciosamente as novas entradas a partir desta atualização.`,mentions:[target]},{quoted:info});
 const dt=new Date(entry.joinedAt);
 const formatted=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(dt).replace(",","");
 return conn.sendMessage(from,{text:`👥 *ENTRADA DO MEMBRO*\n\n👤 @${target.split("@")[0]}\n📅 Entrou em: *${formatted}*`,mentions:[target]},{quoted:info});
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
    if (!jid || groupAdmins.includes(jid) || jid===botNumber || jid===dono || isWhitelisted(from, jid)) continue;
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
