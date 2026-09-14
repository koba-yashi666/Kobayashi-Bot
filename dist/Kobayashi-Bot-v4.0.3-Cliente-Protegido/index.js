/* Kobayashi Protected Distribution v4.0.3 */
/* 🐉 KOBAYASHI BOT
Bot criado por Luiz G. / Kobayashi.

A venda deste bot sem autorização do criador é proibida.
Você pode alugar o bot diretamente com o criador.

Contato para aluguel:
WhatsApp: 5515997075304
*/

import { getContentType, delay, downloadMediaMessage } from "\x40\x77\x68\x69\x73\x6b\x65\x79\x73\x6f\x63\x6b\x65\x74\x73\x2f\x62\x61\x69\x6c\x65\x79\x73";
import { makeSticker, applyStickerMetadata } from "\x2e\x2f\x6c\x69\x62\x2f\x73\x74\x69\x63\x6b\x65\x72\x45\x6e\x67\x69\x6e\x65\x2e\x6a\x73";
import fs from "fs";
import { fileURLToPath } from "\x75\x72\x6c";
import { checkUpdate, applyUpdate, getLocalVersion } from "\x2e\x2f\x75\x70\x64\x61\x74\x65\x72\x2e\x6a\x73";

import { moment, colors, linguagem, mess, normalizeJid, getPNForJid, getGroupAdmins, logos, baileysVersion, fetch, axios, fs as fsx, os, path, randomBytes, ffmpeg } from "\x2e\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2f\x69\x6d\x70\x6f\x72\x74\x73\x2f\x63\x6f\x6e\x73\x74\x73\x2e\x6a\x73";

import { getGroupMetadata } from "\x2e\x2f\x6c\x69\x62\x2f\x67\x72\x6f\x75\x70\x43\x61\x63\x68\x65\x2e\x6a\x73";
import { readGroupScheduleDb, normalizeClockTime, updateGroupSchedule } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x67\x72\x6f\x75\x70\x2f\x67\x72\x6f\x75\x70\x53\x63\x68\x65\x64\x75\x6c\x65\x2e\x6a\x73";
import { getWelcomeConfig, updateWelcomeConfig, renderWelcomeText, removePartnerLink, setWelcomePhoto, removeWelcomePhoto } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x67\x72\x6f\x75\x70\x2f\x77\x65\x6c\x63\x6f\x6d\x65\x43\x6f\x6e\x66\x69\x67\x2e\x6a\x73";
import { getStickerMappedCommand, setStickerMappedCommand, removeStickerMappedCommand, listStickerMappedCommands } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x43\x6f\x6d\x6d\x61\x6e\x64\x73\x2e\x6a\x73";
import { startPackageCapture, stopPackageCapture, captureStickerIfActive, getPackageCaptureStatus, saveCapturedPackage, getStickerPackage, listStickerPackages, deleteStickerPackage, getNextStickerFromPackage } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x50\x61\x63\x6b\x61\x67\x65\x73\x2e\x6a\x73";
import { getWhitelist, isWhitelisted, addWhitelist, removeWhitelist } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x77\x68\x69\x74\x65\x6c\x69\x73\x74\x2e\x6a\x73";
import { trackAdminActivity, getAdminActivityRank, getAdminActivityStats, getAdminActivityUser, resetAdminActivityRank } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x64\x6d\x69\x6e\x41\x63\x74\x69\x76\x69\x74\x79\x52\x61\x6e\x6b\x2e\x6a\x73";
import { setAutoSticker, isAutoStickerEnabled } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x67\x72\x6f\x75\x70\x2f\x61\x75\x74\x6f\x53\x74\x69\x63\x6b\x65\x72\x2e\x6a\x73";
import { readSettingsFile, writeSettingsFile, getConfiguredLeaders, isMainOwnerJid, isLeaderJid, onlyDigits } from "\x2e\x2f\x6c\x69\x62\x2f\x63\x6f\x6e\x66\x69\x67\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x53\x74\x6f\x72\x65\x2e\x6a\x73";
import { readAdvDb, writeAdvDb } from "\x2e\x2f\x6c\x69\x62\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x64\x76\x53\x74\x6f\x72\x65\x2e\x6a\x73";
import { runModularCommand, getCommandHelpCatalog } from "\x2e\x2f\x63\x6f\x6d\x6d\x61\x6e\x64\x73\x2f\x72\x65\x67\x69\x73\x74\x72\x79\x2e\x6a\x73";
import { createPermissions, permissionName } from "\x2e\x2f\x6c\x69\x62\x2f\x63\x6f\x72\x65\x2f\x70\x65\x72\x6d\x69\x73\x73\x69\x6f\x6e\x73\x2e\x6a\x73";
import { addAdminLog, getAdminLogs, clearAdminLogs, getAdminLogStats, cleanupAdminLogs } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x64\x6d\x69\x6e\x4c\x6f\x67\x73\x2e\x6a\x73";
import { setAfk, getAfk, removeAfk, formatDuration as formatAfkDuration } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x6f\x63\x69\x61\x6c\x2f\x61\x66\x6b\x53\x79\x73\x74\x65\x6d\x2e\x6a\x73";
import { trackActivity, getUserActivity, getTopActivity, getInactive, getTopLevel, getLevelInfoFromXp, isLevelEnabled, setLevelEnabled, getGlobalTopLevel, resetGroupLevelRank, resetGlobalLevelRank
} from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x6f\x63\x69\x61\x6c\x2f\x61\x63\x74\x69\x76\x69\x74\x79\x54\x72\x61\x63\x6b\x65\x72\x2e\x6a\x73";
import { getYuriProtection, toggleYuriProtection, configureAntiFlood, checkCommandFlood, muteUser, unmuteUser, isMuted } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x79\x75\x72\x69\x50\x72\x6f\x74\x65\x63\x74\x69\x6f\x6e\x2e\x6a\x73";
import { getAntiFakeConfig, setAntiFakeEnabled, findForeignParticipants } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x6e\x74\x69\x46\x61\x6b\x65\x2e\x6a\x73";
import { resolveCommandAlias, getGroupCommandConfig, setSoAdm, blockGroupCommand, unblockGroupCommand, isGroupCommandBlocked, blockGlobalCommand, unblockGlobalCommand, getGlobalCommandBlock, addCommandAlias, removeCommandAlias, listCommandAliases, trackCommandUsage, getMostUsedCommands, getCommandStats, getTotalCommandUsage } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x79\x73\x74\x65\x6d\x2f\x63\x6f\x6d\x6d\x61\x6e\x64\x43\x6f\x6e\x74\x72\x6f\x6c\x2e\x6a\x73";
import { getReleaseNotes, formatReleaseNotes, markPendingUpdateNews, consumePendingUpdateNews } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x79\x73\x74\x65\x6d\x2f\x75\x70\x64\x61\x74\x65\x4e\x65\x77\x73\x2e\x6a\x73";
import { getRental, registerRental, renewRental, removeRental, setPermanentRental, listRentals, setRentalRestriction, getRentalSettings, parseRentalDuration, formatRentalDuration, formatRentalDate, getRentalPlan, listRentalPlans, formatPlan, normalizeGroupJid, registerRentalByPlan, registerPartnerRental, registerTrialRental, renewRentalByPlan, setRentalWarnings } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x72\x65\x6e\x74\x61\x6c\x2f\x72\x65\x6e\x74\x61\x6c\x53\x79\x73\x74\x65\x6d\x2e\x6a\x73";
import { setRentalResponsible, resetRentalResponsibleWarning, getRentalResponsible, ensureRentalResponsibleRuntime } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x72\x65\x6e\x74\x61\x6c\x2f\x72\x65\x6e\x74\x61\x6c\x52\x65\x73\x70\x6f\x6e\x73\x69\x62\x6c\x65\x2e\x6a\x73";
import { getAntiTravaConfig, updateAntiTravaConfig, inspectPotentialTrava, formatAntiTravaStatus } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x6e\x74\x69\x54\x72\x61\x76\x61\x2e\x6a\x73";
import { getAntiSpamConfig, setAntiSpamEnabled, inspectAntiSpam, formatAntiSpamStatus } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x6e\x74\x69\x53\x70\x61\x6d\x2e\x6a\x73";
import { addPunishmentHistory, getPunishmentHistory, clearPunishmentHistory, formatPunishmentHistory, getRecidivismSummary } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x48\x69\x73\x74\x6f\x72\x79\x2e\x6a\x73";
import { listStickerSources, setStickerSourceMode, addStickerTemplateSource, removeStickerSource, getRandomStickerBuffer } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x73\x2f\x73\x74\x69\x63\x6b\x65\x72\x53\x6f\x75\x72\x63\x65\x73\x2e\x6a\x73";
import { getRules, setRules, clearRules, listNotes, addNote, removeNote, clearNotes, getBlacklist, isBlacklisted, addBlacklist, removeBlacklist, getBlacklistMeta } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x64\x6d\x69\x6e\x50\x72\x6f\x2e\x6a\x73";
import { isGloballyBlacklisted, addGlobalBlacklist, removeGlobalBlacklist, getGlobalBlacklistEntry, listGlobalBlacklist, normalizeBlacklistJid } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x67\x6c\x6f\x62\x61\x6c\x42\x6c\x61\x63\x6b\x6c\x69\x73\x74\x2e\x6a\x73";
import { markPrincipalSeen, configureSentinelRuntime, getSentinelStatus, setSentinelGroupEnabled, startSentinelPairing, stopSentinel, getSentinelLogs, setSentinelDelay } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x73\x65\x6e\x74\x69\x6e\x65\x6c\x53\x79\x73\x74\x65\x6d\x2e\x6a\x73";
import { getSocialProfile, claimDaily, transferCoins, getCoinRank, recordGame, getAchievements, recordSocialInteraction, getEconomySummary, awardLevelUpCoins, getShopItems, buyShopItem, getInventory, equipTitle, unequipTitle, openDragonBox, getActiveTitle, getShopUsage, getAntiFarmConfig, setAntiFarmEnabled, getAntiFarmUsage } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x73\x6f\x63\x69\x61\x6c\x2f\x64\x72\x61\x67\x6f\x6e\x53\x6f\x63\x69\x61\x6c\x2e\x6a\x73";
import {
  buildMainMenu, buildGeneralMenu, buildAdminMenu, buildStickerMenu, buildOwnerMenu,
  buildSocialMenu, buildShopMenu, buildLevelMenu, buildFunMenu, getCommandHelp
} from "\x2e\x2f\x6c\x69\x62\x2f\x75\x69\x2f\x6d\x65\x6e\x75\x54\x68\x65\x6d\x65\x2e\x6a\x73";

import { buildAdminCenter, buildGroupStatus, buildProtectionPanel, buildSystemsPanel, buildPermissionDiagnostic } from "\x2e\x2f\x6c\x69\x62\x2f\x75\x69\x2f\x61\x64\x6d\x69\x6e\x43\x65\x6e\x74\x65\x72\x2e\x6a\x73";
import { ensureDragonCoreRuntime } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x63\x6f\x72\x65\x2f\x64\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x2e\x6a\x73";
import {
  getDragonRpgPlayer, createDragonRpgPlayer, chooseHumanClass, startDragonAwakening,
  chooseDragonFaction, chooseDragonClass, startAwakeningBoss, transformDragon, returnHumanForm, useDragonSkill, restoreDragonEnergy, getAwakeningStatus, formatDragonRpgProfile, formatDragonRpgInventory,
  formatRpgMenu, formatRpgCommands, formatRpgClasses, formatClassInfo, formatRpgHelp, factionName,
  formatRpgRegions, startRpgBattle, rpgAttack, rpgDefend, rpgSkill, rpgUseItem, rpgFlee, rpgRest,
  rpgSpendStat, formatBattleStart, formatBattleAction, formatRpgQuests, acceptRpgQuest, claimRpgQuest, formatRpgRank,
  resetDragonRpgUsers, resetAllDragonRpg, formatRpgShop, buyRpgItem, equipRpgItem, unequipRpgItem, formatRpgEquipment, formatRpgSkills
, formatAdvancedClasses, chooseAdvancedClass} from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x72\x70\x67\x2f\x64\x72\x61\x67\x6f\x6e\x52\x70\x67\x2e\x6a\x73";
import { isDragonRpgEnabled, setDragonRpgEnabled } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x72\x70\x67\x2f\x64\x72\x61\x67\x6f\x6e\x52\x70\x67\x4d\x6f\x64\x65\x2e\x6a\x73";
import { isKobaTriggerEnabled, setKobaTriggerEnabled } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6b\x6f\x62\x61\x54\x72\x69\x67\x67\x65\x72\x2e\x6a\x73";
import { configureSentinelBridgeRuntime, ensureSentinelBridgeServer, getSentinelBridgeStatus, rotateSentinelBridgeSecret, setSentinelBridgeEnabled, getSentinelBridgeLogs, processSentinelWhatsAppMessage, setSentinelWhatsAppNumber, setSentinelBridgeTestMode } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x73\x65\x6e\x74\x69\x6e\x65\x6c\x42\x72\x69\x64\x67\x65\x2e\x6a\x73";
import { resolveV3Alias, runV3Standalone, processV3PassiveMessage, getV3Help } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x76\x33\x2f\x76\x33\x53\x75\x69\x74\x65\x2e\x6a\x73";

import { getGlobalManagementHelp, runGlobalManagementCommand, trackGlobalUsage } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6f\x77\x6e\x65\x72\x2f\x67\x6c\x6f\x62\x61\x6c\x4d\x61\x6e\x61\x67\x65\x6d\x65\x6e\x74\x2e\x6a\x73";
import { getBanMessageConfig, setBanMessageEnabled, listBanMessages, addBanMessage, removeBanMessage, matchBanMessage } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x62\x61\x6e\x4d\x65\x73\x73\x61\x67\x65\x2e\x6a\x73";
import { activateLicense, validateLicense, getEffectiveLicense, getLicenseConfig, maskLicenseKey } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6c\x69\x63\x65\x6e\x73\x65\x2f\x6c\x69\x63\x65\x6e\x73\x65\x4d\x61\x6e\x61\x67\x65\x72\x2e\x6a\x73";
const jsCommandSource = (await import("\x6e\x6f\x64\x65\x3a\x66\x73")).default.readFileSync(new URL("\x2e\x2f\x69\x6e\x64\x65\x78\x2e\x6a\x73", import.meta.url), "\x75\x74\x66\x38");

// ─────────────────────────────────────────────
// 🐉 Configuração principal
// ─────────────────────────────────────────────
const settings = JSON.parse(
  fs.readFileSync(new URL("\x2e\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2e\x6a\x73\x6f\x6e", import.meta.url))
);

const { prefix, NomeDoBot, ownerNumber, ownerName } = settings;

const FUN_DB = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x62\x72\x69\x6e\x63\x61\x64\x65\x69\x72\x61\x73\x2e\x6a\x73\x6f\x6e");

const PROTECTION_DB = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x70\x72\x6f\x74\x65\x63\x61\x6f\x2d\x6c\x69\x6e\x6b\x73\x2e\x6a\x73\x6f\x6e");

function readProtectionDb() {
  try {
    fs.mkdirSync(path.dirname(PROTECTION_DB), { recursive: true });
    if (!fs.existsSync(PROTECTION_DB)) {
      fs.writeFileSync(PROTECTION_DB, JSON.stringify({}, null, 2), "\x75\x74\x66\x38");
    }
    return JSON.parse(fs.readFileSync(PROTECTION_DB, "\x75\x74\x66\x38"));
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
  fs.writeFileSync(PROTECTION_DB, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
  return Boolean(db[groupJid][key]);
}

function setGroupProtection(groupJid, key, enabled) {
  const db = readProtectionDb();
  if (!db[groupJid]) db[groupJid] = {};
  db[groupJid][key] = Boolean(enabled);
  fs.writeFileSync(PROTECTION_DB, JSON.stringify(db, null, 2), "\x75\x74\x66\x38");
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
      link: "\x6c\x69\x67\x68\x74",
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
      punishment: "\x61\x64\x76",
      emergency: false
    },
    media: {
      link: "\x67\x72\x6f\x75\x70",
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
      punishment: "\x61\x64\x76",
      emergency: false
    },
    alta: {
      link: "\x68\x61\x72\x64",
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
      punishment: "\x62\x61\x6e",
      emergency: true
    },
    off: {
      link: "\x6f\x66\x66",
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
      punishment: "\x61\x64\x76",
      emergency: false
    }
  };

  const cfg = presets[normalized];
  if (!cfg) return null;

  // Só um modo de AntiLink fica ativo por vez.
  setGroupProtection(groupJid, "\x61\x6e\x74\x69\x6c\x69\x6e\x6b", cfg.link === "\x68\x61\x72\x64");
  setGroupProtection(groupJid, "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x67\x70", cfg.link === "\x67\x72\x6f\x75\x70");
  setGroupProtection(groupJid, "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x6c\x69\x67\x68\x74", cfg.link === "\x6c\x69\x67\x68\x74");
  setGroupProtection(groupJid, "\x61\x6e\x74\x69\x74\x65\x6c\x65\x67\x72\x61\x6d", cfg.telegram);

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
  setYuriProtectionState(groupJid, "\x61\x6e\x74\x69\x64\x65\x6c", cfg.antiDelete);
  setYuriProtectionState(groupJid, "\x61\x6e\x74\x69\x65\x64\x69\x74", cfg.antiEdit);

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
    console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x61\x70\x61\x67\x61\x72\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x65\x20\x6c\x69\x6e\x6b\x3a", e?.message || e);
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
    by: "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x41\x75\x74\x6f\x4d\x6f\x64",
    at: new Date().toISOString(),
  });

  const count = db[groupJid][target].count;
  writeAdvDb(db);

  addPunishmentHistory(groupJid, target, {
    type: "\x61\x64\x76\x5f\x61\x75\x74\x6f",
    reason,
    by: "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x41\x75\x74\x6f\x4d\x6f\x64",
    source: "\x61\x75\x74\x6f\x6d\x6f\x64",
    meta: { count }
  });

  if (count >= 3 && botIsAdmin) {
    try {
      await conn.groupParticipantsUpdate(groupJid, [target], "\x72\x65\x6d\x6f\x76\x65");
      db[groupJid][target] = { count: 0, history: [] };
      writeAdvDb(db);

      addPunishmentHistory(groupJid, target, {
        type: "\x62\x61\x6e\x5f\x61\x75\x74\x6f",
        reason: "\x4c\x69\x6d\x69\x74\x65\x20\x64\x65\x20\x33\x20\x61\x64\x76\x65\x72\x74\xea\x6e\x63\x69\x61\x73\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x61\x73\x20\x61\x74\x69\x6e\x67\x69\x64\x6f",
        by: "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x41\x75\x74\x6f\x4d\x6f\x64",
        source: "\x61\x75\x74\x6f\x6d\x6f\x64"
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
      console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x61\x70\xf3\x73\x20\x41\x44\x56\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x61\x3a", e?.message || e);
    }
  }

  return { count, removed: false };
}



function ensureFunDb() {
  try {
    fs.mkdirSync(path.dirname(FUN_DB), { recursive: true });
    if (!fs.existsSync(FUN_DB)) {
      fs.writeFileSync(FUN_DB, JSON.stringify({ groups: {}, scores: {} }, null, 2), "\x75\x74\x66\x38");
    }
  } catch {}
}

function readFunDb() {
  ensureFunDb();
  try {
    const data = JSON.parse(fs.readFileSync(FUN_DB, "\x75\x74\x66\x38"));
    return {
      groups: data?.groups && typeof data.groups === "\x6f\x62\x6a\x65\x63\x74" ? data.groups : {},
      scores: data?.scores && typeof data.scores === "\x6f\x62\x6a\x65\x63\x74" ? data.scores : {},
    };
  } catch {
    return { groups: {}, scores: {} };
  }
}

function writeFunDb(data) {
  ensureFunDb();
  fs.writeFileSync(FUN_DB, JSON.stringify(data, null, 2), "\x75\x74\x66\x38");
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
  return path.join(process.cwd(), "\x73\x65\x74\x74\x69\x6e\x67\x73", "\x46\x55\x4e", `${name}.png`);
}

function readFunImageBank() {
  try {
    const bankFile = path.join(process.cwd(), "\x73\x65\x74\x74\x69\x6e\x67\x73", "\x46\x55\x4e", "\x69\x6d\x67\x6c\x69\x6e\x6b\x73\x2e\x6a\x73\x6f\x6e");
    const mapFile = path.join(process.cwd(), "\x73\x65\x74\x74\x69\x6e\x67\x73", "\x46\x55\x4e", "\x6d\x61\x70\x61\x2d\x69\x6d\x61\x67\x65\x6e\x73\x2e\x6a\x73\x6f\x6e");
    const bank = JSON.parse(fs.readFileSync(bankFile, "\x75\x74\x66\x38"));
    const map = JSON.parse(fs.readFileSync(mapFile, "\x75\x74\x66\x38"));
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
      `${text || "\x4d\x65\x6e\x73\x61\x67\x65\x6d\x20\x73\x65\x6d\x20\x74\x65\x78\x74\x6f\x20\x72\x65\x63\x75\x70\x65\x72\xe1\x76\x65\x6c\x2e"}`,
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

  if (["\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65", "\x76\x69\x64\x65\x6f\x4d\x65\x73\x73\x61\x67\x65", "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65"].includes(currentType)) {
    return { key: info.key, message: currentMessage, source: "\x63\x75\x72\x72\x65\x6e\x74" };
  }

  const quoted = getQuotedMessage(info);
  if (quoted?.message) {
    const quotedType = getContentType(quoted.message);
    if (["\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65", "\x76\x69\x64\x65\x6f\x4d\x65\x73\x73\x61\x67\x65", "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65"].includes(quotedType)) {
      return { ...quoted, source: "\x71\x75\x6f\x74\x65\x64" };
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
  if (message?.stickerMessage) return "\x5b\x46\x69\x67\x75\x72\x69\x6e\x68\x61\x5d";
  if (message?.imageMessage) {
    const caption = String(message.imageMessage.caption || "").trim();
    return caption ? `[Foto]\n${caption}` : "\x5b\x46\x6f\x74\x6f\x5d";
  }
  if (message?.videoMessage) {
    const caption = String(message.videoMessage.caption || "").trim();
    return caption ? `[Vídeo]\n${caption}` : "\x5b\x56\xed\x64\x65\x6f\x5d";
  }
  if (message?.audioMessage) return "\x5b\xc1\x75\x64\x69\x6f\x5d";
  if (message?.documentMessage) return `[Documento: ${message.documentMessage.fileName || "\x73\x65\x6d\x20\x6e\x6f\x6d\x65"}]`;
  if (message?.contactMessage || message?.contactsArrayMessage) return "\x5b\x43\x6f\x6e\x74\x61\x74\x6f\x5d";
  if (message?.locationMessage || message?.liveLocationMessage) return "\x5b\x4c\x6f\x63\x61\x6c\x69\x7a\x61\xe7\xe3\x6f\x5d";
  if (message?.pollCreationMessage || message?.pollCreationMessageV3) return "\x5b\x45\x6e\x71\x75\x65\x74\x65\x5d";

  return `[${type || "\x4d\x65\x6e\x73\x61\x67\x65\x6d\x20\x73\x65\x6d\x20\x74\x65\x78\x74\x6f"}]`;
}

function formatAuditPhone(sender = "") {
  const raw = String(sender || "").split("@")[0].replace(/\D/g, "");
  if (!raw) return "\x6e\xe3\x6f\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c";

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
  action = "\x41\x6e\x74\x69\x4c\x69\x6e\x6b"
}) {
  const targetNumber = String(sender || "").split("@")[0] || "\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f";
  const phone = formatAuditPhone(sender);
  const fullMessage = String(messageText || "\x5b\x73\x65\x6d\x20\x63\x6f\x6e\x74\x65\xfa\x64\x6f\x20\x6c\x65\x67\xed\x76\x65\x6c\x5d").trim();
  const readMoreBreak = buildWhatsAppReadMoreBreak();

  return (
    `╭═══════ ❀ 🐉 ❀ ═══════╮\n` +
    `   🚨 *KOBAYASHI AUDIT* 🚨\n` +
    `╰═══════ ❀ 🌸 ❀ ═══════╯\n\n` +

    `╭─〔 🛡️ *REGISTRO DE AUDITORIA* 〕\n` +
    `│ ⚙️ Ação › *${action}*\n` +
    `│ 🎯 Alvo › @${targetNumber}\n` +
    `│ 👥 Grupo › ${groupName || "\x47\x72\x75\x70\x6f"}\n` +
    `│ 🆔 Lid › ${senderLid || "\x6e\xe3\x6f\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c"}\n` +
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
    console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x65\x6e\x76\x69\x61\x72\x20\x61\x75\x64\x69\x74\x6f\x72\x69\x61\x20\x41\x6e\x74\x69\x4c\x69\x6e\x6b\x20\x61\x6f\x20\x64\x6f\x6e\x6f\x3a", e?.message || e);
    return false;
  }
}

async function notifyOwnerAntiPv(conn, ownerJid, { sender, messageId, messageText, type, mode="\x61\x76\x69\x73\x6f" }) {
  if (!conn || !ownerJid || !sender) return false;

  const number = String(sender).split("@")[0] || "\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f";
  const modeLabel = {
    aviso: "\u26a0\ufe0f\x20\x41\x76\x69\x73\x6f",
    bloquear: "\ud83d\x20\x42\x6c\x6f\x71\x75\x65\x69\x6f",
    aluguel: "\ud83d\x20\x52\x65\x64\x69\x72\x65\x63\x69\x6f\x6e\x61\x6d\x65\x6e\x74\x6f\x20\x70\x61\x72\x61\x20\x61\x6c\x75\x67\x75\x65\x6c"
  }[mode] || mode;

  const text =
    `🚨 *ANTI-PV • CONTATO DETECTADO*\n\n` +
    `• Número: @${number}\n` +
    `• ID: ${messageId || "\x6e\xe3\x6f\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c"}\n` +
    `• Tipo: ${type || "\x6d\x65\x6e\x73\x61\x67\x65\x6d"}\n` +
    `• Modo: ${modeLabel}\n` +
    `• Mensagem: ${messageText || "\x5b\x73\x65\x6d\x20\x63\x6f\x6e\x74\x65\xfa\x64\x6f\x20\x6c\x65\x67\xed\x76\x65\x6c\x5d"}`;

  try {
    await conn.sendMessage(ownerJid, {
      text,
      mentions: [sender]
    });
    return true;
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x61\x76\x69\x73\x61\x72\x20\x64\x6f\x6e\x6f\x20\x73\x6f\x62\x72\x65\x20\x41\x6e\x74\x69\x2d\x50\x56\x3a", e?.message || e);
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

async function removeBlacklistedFromGroup(conn, groupJid, rawJid, { announce=false, source="\x61\x75\x74\x6f" }={}) {
  const state = await getBlacklistState(conn, groupJid, rawJid);
  if (!state.blocked) return { removed:false, reason:"\x6e\x6f\x74\x2d\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x65\x64", ...state };

  let metadata;
  try {
    metadata = await conn.groupMetadata(groupJid);
  } catch {
    return { removed:false, reason:"\x6d\x65\x74\x61\x64\x61\x74\x61\x2d\x65\x72\x72\x6f\x72", ...state };
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
  if (!botIsAdmin) return { removed:false, reason:"\x62\x6f\x74\x2d\x6e\x6f\x74\x2d\x61\x64\x6d\x69\x6e", ...state };

  const targetParticipant = participants.find((p) =>
    [p?.id,p?.jid,p?.participant,p?.phoneNumber,p?.lid].filter(Boolean).some((id) =>
      state.aliases.some((a) => {
        if (id === a) return true;
        try { return normalizeJid(id) === normalizeJid(a); } catch { return false; }
      })
    )
  );

  if (!targetParticipant) return { removed:false, reason:"\x6e\x6f\x74\x2d\x69\x6e\x2d\x67\x72\x6f\x75\x70", ...state };

  const target =
    targetParticipant?.id ||
    targetParticipant?.jid ||
    targetParticipant?.participant ||
    rawJid;

  try {
    await conn.groupParticipantsUpdate(groupJid, [target], "\x72\x65\x6d\x6f\x76\x65");
    if (announce) {
      await conn.sendMessage(groupJid, {
        text:
          `🖤🔨 *LISTA NEGRA • REMOÇÃO AUTOMÁTICA*\n\n` +
          `@${String(target).split("@")[0]} foi removido automaticamente.\n` +
          `📌 Origem: *${state.global ? "\x4c\x69\x73\x74\x61\x20\x4e\x65\x67\x72\x61\x20\x47\x6c\x6f\x62\x61\x6c" : "\x4c\x69\x73\x74\x61\x20\x4e\x65\x67\x72\x61\x20\x64\x6f\x20\x47\x72\x75\x70\x6f"}*`,
        mentions:[target]
      }).catch(() => {});
    }
    console.log(`[LISTA NEGRA ${source}] removido ${target} de ${groupJid}`);
    return { removed:true, reason:"\x72\x65\x6d\x6f\x76\x65\x64", target, ...state };
  } catch (e) {
    console.error(`[LISTA NEGRA ${source}]`, e?.message || e);
    return { removed:false, reason:"\x72\x65\x6d\x6f\x76\x65\x2d\x65\x72\x72\x6f\x72", error:e?.message || String(e), ...state };
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

  return Boolean(botParticipant?.admin === "\x61\x64\x6d\x69\x6e" || botParticipant?.admin === "\x73\x75\x70\x65\x72\x61\x64\x6d\x69\x6e" || botParticipant?.admin);
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
      await conn.groupParticipantsUpdate(groupJid, [target], "\x72\x65\x6d\x6f\x76\x65");
      return { ok:true, target };
    } catch (e) {
      lastError = e;
    }
  }

  return {
    ok:false,
    error:lastError?.message || String(lastError || "\x46\x61\x6c\x68\x61\x20\x61\x6f\x20\x72\x65\x6d\x6f\x76\x65\x72")
  };
}

async function purgeUserFromAdminGroups(conn, rawJid, {
  announce = true,
  source = "\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x2d\x70\x75\x72\x67\x65"
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
      details.push({ groupJid, status:"\x6d\x65\x74\x61\x64\x61\x74\x61\x2d\x65\x72\x72\x6f\x72", error:e?.message || String(e) });
      continue;
    }

    const participants = metadata?.participants || [];
    const isAdmin = await botIsAdminInMetadata(conn, participants);
    if (!isAdmin) {
      details.push({ groupJid, name:metadata?.subject, status:"\x62\x6f\x74\x2d\x6e\x6f\x74\x2d\x61\x64\x6d\x69\x6e" });
      continue;
    }

    adminGroups++;

    const participant = await resolveParticipantForBlacklist(conn, participants, targetAliases);
    if (!participant) {
      details.push({ groupJid, name:metadata?.subject, status:"\x6e\x6f\x74\x2d\x69\x6e\x2d\x67\x72\x6f\x75\x70" });
      continue;
    }

    found++;
    const removal = await removeResolvedParticipant(conn, groupJid, participant);

    if (removal.ok) {
      removed++;
      details.push({
        groupJid,
        name:metadata?.subject,
        status:"\x72\x65\x6d\x6f\x76\x65\x64",
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
        status:"\x72\x65\x6d\x6f\x76\x65\x2d\x65\x72\x72\x6f\x72",
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
    source:"\x6c\x69\x73\x74\x61\x2d\x6e\x65\x67\x72\x61\x2d\x67\x6c\x6f\x62\x61\x6c"
  });
}

function ensureBlacklistJoinGuard(conn) {
  if (conn.__kobayashiBlacklistJoinGuard) return;
  conn.__kobayashiBlacklistJoinGuard = true;

  conn.ev.on("\x67\x72\x6f\x75\x70\x2d\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74\x73\x2e\x75\x70\x64\x61\x74\x65", async (event) => {
    try {
      if (String(event?.action || "").toLowerCase() !== "\x61\x64\x64") return;
      const groupJid = event?.id;
      const participants = Array.isArray(event?.participants) ? event.participants : [];
      if (!groupJid || !participants.length) return;

      for (const target of participants) {
        const result = await removeBlacklistedFromGroup(conn, groupJid, target, {
          announce:true,
          source:"\x6a\x6f\x69\x6e\x2d\x67\x75\x61\x72\x64"
        });

        if (result.removed) {
          addAdminLog(groupJid, {
            type:"\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x5f\x61\x75\x74\x6f\x5f\x72\x65\x6d\x6f\x76\x65",
            actor:"\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x41\x75\x74\x6f\x47\x75\x61\x72\x64",
            target:result.target || target,
            detail:result.global ? "\x4c\x69\x73\x74\x61\x20\x4e\x65\x67\x72\x61\x20\x47\x6c\x6f\x62\x61\x6c\x20\u2022\x20\x72\x65\x65\x6e\x74\x72\x61\x64\x61\x20\x62\x6c\x6f\x71\x75\x65\x61\x64\x61" : "\x4c\x69\x73\x74\x61\x20\x4e\x65\x67\x72\x61\x20\x4c\x6f\x63\x61\x6c\x20\u2022\x20\x72\x65\x65\x6e\x74\x72\x61\x64\x61\x20\x62\x6c\x6f\x71\x75\x65\x61\x64\x61"
          });
        }
      }
    } catch (e) {
      console.error("\x5b\x4c\x49\x53\x54\x41\x20\x4e\x45\x47\x52\x41\x20\x4a\x4f\x49\x4e\x20\x47\x55\x41\x52\x44\x5d", e?.stack || e?.message || e);
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
if (upsert.type === "\x61\x70\x70\x65\x6e\x64") continue;

const type = getContentType(info.message);
const pushname = info.pushName ? info.pushName : "";

const from = info.key.remoteJid;
const isGroup = from.endsWith("\x40\x67\x2e\x75\x73");
const isStatus = from.endsWith("\x40\x62\x72\x6f\x61\x64\x63\x61\x73\x74");

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
    .normalize("\x4e\x46\x44")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g," ");
}

// Registro completo dos comandos reconhecidos pelo bot.
// O Koba Trigger só dispara se a primeira ação corresponder a um comando real.
const KOBA_TRIGGER_COMMANDS = new Set([
  "0",
  "1",
  "\x31\x32\x33\x34\x35",
  "\x61\x62\x72\x61\x63\x6f",
  "\x61\x62\x72\x61\xe7\x6f",
  "\x61\x62\x72\x69\x72\x63\x61\x69\x78\x61",
  "\x61\x63\x65\x69\x74\x61\x72",
  "\x61\x63\x65\x69\x74\x61\x72\x63\x61\x73\x61\x6d\x65\x6e\x74\x6f",
  "\x61\x63\x65\x69\x74\x61\x72\x63\x6f\x6e\x76\x69\x74\x65",
  "\x61\x63\x65\x69\x74\x61\x72\x70\x65\x64\x69\x64\x6f",
  "\x61\x63\x68\x69\x65\x76\x65\x6d\x65\x6e\x74\x73",
  "\x61\x64\x64",
  "\x61\x64\x64\x5f\x70\x72\x65\x66\x69\x78\x6f",
  "\x61\x64\x64\x5f\x76\x6f\x72\x64",
  "\x61\x64\x64\x61\x6c\x69\x61\x73",
  "\x61\x64\x64\x66\x6f\x6e\x74\x65\x66\x69\x67",
  "\x61\x64\x6d\x69\x6e\x63\x65\x6e\x74\x65\x72",
  "\x61\x64\x6d\x69\x6e\x6c\x6f\x67\x73",
  "\x61\x64\x6d\x69\x6e\x73",
  "\x61\x64\x6d\x73",
  "\x61\x64\x6f\x74\x61\x72",
  "\x61\x64\x6f\x74\x61\x72\x66\x69\x6c\x68\x6f",
  "\x61\x64\x6f\x74\x61\x72\x75\x73\x65\x72",
  "\x61\x64\x76",
  "\x61\x64\x76\x73",
  "\x61\x66\x6b",
  "\x61\x6a\x75\x64\x61\x63\x6d\x64",
  "\x61\x6c\x69\x61\x73\x6c\x69\x73\x74",
  "\x61\x6c\x75\x67\x65\x6c\x5f\x70\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65",
  "\x61\x6c\x75\x67\x75\x65\x6c",
  "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x61\x76\x69\x73\x6f\x73",
  "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x67\x6c\x6f\x62\x61\x6c",
  "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x67\x72\x61\x74\x69\x73",
  "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x69\x6e\x66\x6f",
  "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x70\x61\x72\x63\x65\x72\x69\x61",
  "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x70\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65",
  "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x74\x65\x73\x74\x65",
  "\x61\x6d\x69\x7a\x61\x64\x65",
  "\x61\x6e\x6f\x74\x61\x63\x61\x6f",
  "\x61\x6e\x6f\x74\x61\x63\x6f\x65\x73",
  "\x61\x6e\x6f\x74\x61\x72",
  "\x61\x6e\x74\x69\x64\x65\x6c",
  "\x61\x6e\x74\x69\x65\x64\x69\x74",
  "\x61\x6e\x74\x69\x66\x61\x6b\x65",
  "\x61\x6e\x74\x69\x66\x61\x72\x6d",
  "\x61\x6e\x74\x69\x66\x61\x72\x6d\x64\x69\x61\x72\x69\x6f",
  "\x61\x6e\x74\x69\x66\x6c\x6f\x6f\x64",
  "\x61\x6e\x74\x69\x66\x6c\x6f\x6f\x64\x6d\x65\x6e\x73\x61\x67\x65\x6d",
  "\x61\x6e\x74\x69\x66\x6c\x6f\x6f\x64\x6d\x73\x67",
  "\x61\x6e\x74\x69\x6c\x69\x6e\x6b",
  "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x67\x70",
  "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x6c\x69\x67\x68\x74",
  "\x61\x6e\x74\x69\x6d\x65\x6e\x63\x61\x6f",
  "\x61\x6e\x74\x69\x70\x76",
  "\x61\x6e\x74\x69\x73\x70\x61\x6d",
  "\x61\x6e\x74\x69\x74\x65\x6c\x65\x67\x72\x61\x6d",
  "\x61\x6e\x74\x69\x74\x65\x78\x74\x61\x6f",
  "\x61\x6e\x74\x69\x74\x65\x78\x74\x6f",
  "\x61\x6e\x74\x69\x74\x72\x61\x76\x61",
  "\x61\x72\x65\x6e\x61",
  "\x61\x74\x61\x63\x61\x72",
  "\x61\x74\x69\x76\x61\x72",
  "\x61\x74\x69\x76\x69\x64\x61\x64\x65",
  "\x61\x74\x72\x69\x62\x75\x74\x6f\x72\x70\x67",
  "\x61\x74\x74\x73\x74\x61\x74\x75\x73",
  "\x61\x74\x75\x61\x6c\x69\x7a\x61\x72",
  "\x61\x75\x63\x74\x69\x6f\x6e",
  "\x61\x75\x74\x6f\x73\x74\x69\x63\x6b\x65\x72",
  "\x61\x75\x74\x6f\x73\x74\x6b",
  "b",
  "\x62\x61\x6d",
  "\x62\x61\x6e",
  "\x62\x61\x6e\x63",
  "\x62\x61\x6e\x66\x61\x6b\x65",
  "\x62\x61\x6e\x67\x68\x6f\x73\x74",
  "\x62\x61\x74\x61\x6c\x68\x61\x72",
  "\x62\x65\x6d\x76\x69\x6e\x64\x6f",
  "\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74",
  "\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x67",
  "\x62\x6c\x6f\x63\x6b\x63\x6d\x64",
  "\x62\x6c\x6f\x63\x6b\x63\x6d\x64\x67",
  "\x62\x6f\x61\x73\x76\x69\x6e\x64\x61\x73",
  "\x62\x6f\x6f\x73\x74",
  "\x62\x6f\x73\x73\x64\x65\x73\x70\x65\x72\x74\x61\x72",
  "\x62\x6f\x73\x73\x72\x70\x67",
  "\x62\x6f\x74\x61\x6f\x69\x6d\x61\x67\x65\x6d",
  "\x62\x6f\x74\x61\x6f\x74\x65\x78\x74\x6f",
  "\x62\x6f\x74\x61\x6f\x76\x32",
  "\x62\x6f\x74\x61\x6f\x76\x69\x64\x65\x6f",
  "\x62\x72\x69\x64\x67\x65",
  "\x62\x75\x79",
  "\x63\x61\x66\x75\x6e\x65",
  "\x63\x61\x72\x69\x6e\x68\x6f",
  "\x63\x61\x72\x74\x65\x69\x72\x61",
  "\x63\x61\x73\x61",
  "\x63\x61\x73\x61\x69\x73",
  "\x63\x61\x73\x61\x6c",
  "\x63\x61\x73\x61\x72",
  "\x63\x61\x74\x65\x67\x6f\x72\x69\x61\x73\x6c\x65\x76\x65\x6c",
  "\x63\x61\x74\x65\x67\x6f\x72\x69\x61\x73\x6e\x69\x76\x65\x6c",
  "\x63\x65\x6e\x74\x72\x61\x6c\x61\x64\x6d",
  "\x63\x68\x61\x6e\x63\x65",
  "\x63\x68\x61\x6e\x67\x65\x6c\x6f\x67",
  "\x63\x68\x61\x72\x61\x64\x61",
  "\x63\x68\x65\x63\x6b\x6d\x65",
  "\x63\x6c\x61",
  "\x63\x6c\x61\x69\x6d",
  "\x63\x6c\x61\x73\x73",
  "\x63\x6c\x61\x73\x73\x65",
  "\x63\x6c\x61\x73\x73\x65\x61\x76\x61\x6e\x63\x61\x64\x61",
  "\x63\x6c\x61\x73\x73\x65\x69\x6e\x66\x6f",
  "\x63\x6c\x61\x73\x73\x65\x73\x61\x76\x61\x6e\x63\x61\x64\x61\x73",
  "\x63\x6c\x61\x73\x73\x65\x73\x6c\x65\x76\x65\x6c",
  "\x63\x6c\x61\x73\x73\x65\x73\x72\x70\x67",
  "\x63\x6c\x6f\x73\x65\x67\x70",
  "\x63\x6f\x69\x6e\x66\x6c\x69\x70",
  "\x63\x6f\x69\x6e\x73",
  "\x63\x6f\x6c\x65\x74\x61\x72",
  "\x63\x6f\x6c\x68\x65\x72",
  "\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x72\x70\x67",
  "\x63\x6f\x6d\x65\x72",
  "\x63\x6f\x6d\x70\x72\x61\x72",
  "\x63\x6f\x6d\x70\x72\x61\x72\x70\x72\x65\x6d\x69\x75\x6d",
  "\x63\x6f\x6d\x70\x72\x61\x72\x72\x70\x67",
  "\x63\x6f\x6e\x66\x69\x67\x67\x70",
  "\x63\x6f\x6e\x71\x75\x69\x73\x74\x61\x73",
  "\x63\x6f\x6e\x73\x65\x6c\x68\x6f",
  "\x63\x6f\x6e\x76\x69\x64\x61\x72",
  "\x63\x6f\x6e\x76\x69\x74\x65",
  "\x63\x6f\x6f\x6b",
  "\x63\x6f\x72\x72\x69\x64\x61",
  "\x63\x6f\x7a\x69\x6e\x68\x61\x72",
  "\x63\x72\x65\x61\x74\x6f\x72",
  "\x63\x72\x69\x61\x64\x6f\x72",
  "\x63\x72\x69\x61\x72\x70\x65\x72\x73\x6f\x6e\x61\x67\x65\x6d",
  "\x63\x72\x69\x6d\x65",
  "\x63\x74\x61\x5f\x63\x6f\x70\x79",
  "\x63\x74\x61\x5f\x75\x72\x6c",
  "\x64\x61\x64\x6f",
  "\x64\x61\x69\x6c\x79",
  "\x64\x65\x62\x75\x67\x62\x76",
  "\x64\x65\x66\x65\x6e\x64\x65\x72",
  "\x64\x65\x6c\x61\x6c\x69\x61\x73",
  "\x64\x65\x6c\x61\x6e\x6f\x74\x61\x63\x61\x6f",
  "\x64\x65\x6c\x63\x6d\x64",
  "\x64\x65\x6c\x66\x6f\x6e\x74\x65\x66\x69\x67",
  "\x64\x65\x6c\x72\x65\x67\x72\x61\x73",
  "\x64\x65\x6d\x69\x74\x69\x72",
  "\x64\x65\x73\x61\x66\x69\x6f",
  "\x64\x65\x73\x61\x66\x69\x6f\x6d\x65\x6e\x73\x61\x6c",
  "\x64\x65\x73\x61\x66\x69\x6f\x73\x65\x6d\x61\x6e\x61\x6c",
  "\x64\x65\x73\x61\x74\x69\x76\x61\x72",
  "\x64\x65\x73\x63\x61\x6e\x73\x61\x72",
  "\x64\x65\x73\x63\x61\x6e\x73\x6f\x64\x72\x61\x67\x61\x6f",
  "\x64\x65\x73\x65\x71\x75\x69\x70\x61\x72",
  "\x64\x65\x73\x65\x71\x75\x69\x70\x61\x72\x74\x69\x74\x75\x6c\x6f",
  "\x64\x65\x73\x6c\x69\x67\x61\x72",
  "\x64\x65\x73\x6d\x6f\x6e\x74\x61\x72",
  "\x64\x65\x73\x6d\x75\x74\x61\x72",
  "\x64\x65\x73\x6d\x75\x74\x65",
  "\x64\x65\x73\x70\x65\x72\x74\x61\x72",
  "\x64\x65\x73\x70\x65\x72\x74\x61\x72\x62\x6f\x73\x73",
  "\x64\x65\x73\x70\x65\x72\x74\x61\x72\x64\x72\x61\x67\x61\x6f",
  "\x64\x69\x61\x67\x6e\x6f\x73\x74\x69\x63\x6f",
  "\x64\x69\x61\x67\x6e\xf3\x73\x74\x69\x63\x6f",
  "\x64\x69\x61\x67\x70\x65\x72\x6d\x69\x73\x73\x6f\x65\x73",
  "\x64\x69\x73\x6d\x61\x6e\x74\x6c\x65",
  "\x64\x6f\x61\x72",
  "\x64\x6f\x61\x72\x67\x6f\x6c\x64",
  "\x64\x6f\x6e\x6f",
  "\x64\x6f\x6e\x6f\x31",
  "\x64\x6f\x6e\x6f\x32",
  "\x64\x6f\x6e\x6f\x33",
  "\x64\x6f\x6e\x6f\x34",
  "\x64\x6f\x6e\x6f\x35",
  "\x64\x6f\x6e\x6f\x73",
  "\x64\x72\x61\x67\x6f\x6e\x5f\x64\x69\x76\x75\x6c\x67\x61\x63\x6f\x65\x73",
  "\x64\x72\x61\x67\x6f\x6e\x5f\x64\x69\x76\x75\x6c\x67\x61\xe7\xf5\x65\x73",
  "\x64\x72\x61\x67\x6f\x6e\x5f\x73\x74\x69\x63\x6b\x65\x72\x73",
  "\x64\x72\x61\x67\x6f\x6e\x64\x69\x76\x75\x6c\x67\x61\x63\x6f\x65\x73",
  "\x64\x72\x61\x67\x6f\x6e\x66\x75\x6e",
  "\x64\x72\x61\x67\x6f\x6e\x68\x65\x6c\x70",
  "\x64\x72\x61\x67\x6f\x6e\x72\x70\x67",
  "\x64\x72\x61\x67\x6f\x6e\x72\x70\x67\x6d\x6f\x64\x65",
  "\x64\x72\x61\x67\x6f\x6e\x73\x74\x69\x63\x6b\x65\x72\x73",
  "\x64\x75\x6e\x67\x65\x6f\x6e",
  "\x65\x61\x74",
  "\x65\x6c\x6f\x67\x69\x6f",
  "\x65\x6d\x65\x72\x67\x65\x6e\x63\x69\x61",
  "\x65\x6d\x70\x72\x65\x67\x6f",
  "\x65\x6e\x63\x61\x6e\x74\x61\x72",
  "\x65\x6e\x63\x68\x61\x6e\x74",
  "\x65\x6e\x65\x72\x67\x69\x61\x64\x72\x61\x67\x61\x6f",
  "\x65\x71\x75\x69\x70\x61\x6d\x65\x6e\x74\x6f\x73",
  "\x65\x71\x75\x69\x70\x61\x72",
  "\x65\x71\x75\x69\x70\x61\x72\x74\x69\x74\x75\x6c\x6f",
  "\x65\x71\x75\x69\x70\x70\x65\x74",
  "\x65\x73\x63\x6f\x6c\x68\x65\x72\x63\x6c\x61\x73\x73\x65",
  "\x65\x73\x63\x6f\x6c\x68\x65\x72\x64\x72\x61\x67\x61\x6f",
  "\x65\x73\x63\x6f\x6c\x68\x65\x72\x66\x61\x63\x63\x61\x6f",
  "\x65\x75\x6e\x75\x6e\x63\x61",
  "\x65\x76\x65\x6e\x74\x6f\x73",
  "\x65\x76\x6f\x6c\x75\x69\x72",
  "\x65\x76\x6f\x6c\x76\x65",
  "\x65\x78\x70\x6c\x6f\x72\x61\x72",
  "\x65\x78\x70\x6c\x6f\x72\x65",
  "\x65\x78\x70\x75\x6c\x73\x61\x72",
  "\x66\x61\x72\x6d",
  "\x66\x65\x65\x64",
  "\x66\x69\x67",
  "\x66\x69\x67\x75\x72\x69\x6e\x68\x61",
  "\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x73",
  "\x66\x69\x73\x68",
  "\x66\x6f\x6e\x74\x65\x66\x69\x67",
  "\x66\x6f\x6e\x74\x65\x73\x66\x69\x67",
  "\x66\x6f\x6e\x74\x65\x73\x66\x69\x67\x75\x72\x69\x6e\x68\x61",
  "\x66\x6f\x72\x67\x65",
  "\x66\x6f\x72\x6a\x61\x72",
  "\x66\x6f\x72\x6d\x61\x64\x72\x61\x67\x61\x6f",
  "\x66\x6f\x72\x6d\x61\x68\x75\x6d\x61\x6e\x61",
  "\x66\x6f\x74\x6f\x5f\x67\x70",
  "\x66\x6f\x74\x6f\x5f\x6d\x65\x6e\x75",
  "\x66\x6f\x74\x6f\x62\x76",
  "\x66\x75\x67\x69\x72",
  "\x67\x61\x64\x6f",
  "\x67\x61\x79",
  "\x67\x65\x72\x61\x6c",
  "\x67\x6f\x6c\x64",
  "\x67\x6f\x73\x74\x6f\x73\x61",
  "\x67\x6f\x73\x74\x6f\x73\x6f",
  "gp",
  "\x67\x72\x6f\x75\x70\x69\x6e\x66\x6f",
  "\x67\x72\x75\x70\x6f\x69\x6e\x66\x6f",
  "\x67\x75\x65\x72\x72\x61",
  "\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65",
  "\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65\x64\x72\x61\x67\x61\x6f",
  "\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65\x73",
  "\x68\x61\x72\x76\x65\x73\x74",
  "\x68\x65\x61\x64\x65\x72",
  "\x68\x65\x6c\x70\x5f\x76\x6f\x72\x64",
  "\x68\x65\x6c\x70\x63\x6d\x64",
  "\x68\x65\x74\x65\x72\x6f",
  "\x68\x69\x64\x65\x74\x61\x67",
  "\x68\x69\x73\x74\x6f\x72\x69\x63\x6f",
  "\x68\x69\x73\x74\x6f\x72\x69\x63\x6f\x6d\x6f\x64",
  "\x68\x6f\x72\x74\x61",
  "\x68\x6f\x75\x73\x65",
  "\x68\x75\x6d\x61\x6e\x6f",
  "\x68\x75\x6e\x74",
  "\x69\x64\x31",
  "\x69\x64\x32",
  "\x69\x64\x5f\x72\x65\x73\x70\x6f\x73\x74\x61",
  "\x69\x6e\x61\x74\x69\x76\x6f\x73",
  "\x69\x6e\x66\x6f\x5f\x61\x64\x76",
  "\x69\x6e\x66\x6f\x61\x64\x76",
  "\x69\x6e\x66\x6f\x67\x72\x75\x70\x6f",
  "\x69\x6e\x67\x72\x65\x64\x69\x65\x6e\x74\x65\x73",
  "\x69\x6e\x74\x65\x72\x61\x74\x69\x76\x6f",
  "\x69\x6e\x74\x65\x72\x61\x74\x69\x76\x6f\x69\x6d\x61\x67\x65\x6d",
  "\x69\x6e\x74\x65\x72\x61\x74\x69\x76\x6f\x76\x69\x64\x65\x6f",
  "\x69\x6e\x76",
  "\x69\x6e\x76\x65\x6e\x74\x61\x72\x69\x6f",
  "\x69\x6e\x76\x65\x6e\x74\x61\x72\x69\x6f\x72\x70\x67",
  "\x69\x6e\x76\x65\x73\x74\x69\x72",
  "\x69\x74\x65\x6d",
  "\x6b\x6f\x62\x61\x62\x61\x6e",
  "\x6b\x6f\x62\x61\x6d\x6f\x64\x65",
  "\x6b\x6f\x62\x61\x6e",
  "\x6b\x6f\x62\x61\x74\x72\x69\x67\x67\x65\x72",
  "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x36\x36\x36",
  "\x6c\x65\x69\x6c\x61\x6f",
  "\x6c\x65\x74\x72\x61",
  "\x6c\x65\x76\x65\x6c",
  "\x6c\x69\x64\x65\x72\x65\x73",
  "\x6c\x69\x67\x61\x72",
  "\x6c\x69\x6d\x69\x74\x65\x66\x6c\x6f\x6f\x64",
  "\x6c\x69\x6d\x69\x74\x65\x6d\x65\x6e\x63\x61\x6f",
  "\x6c\x69\x6d\x69\x74\x65\x6d\x65\x6e\x63\x6f\x65\x73",
  "\x6c\x69\x6d\x69\x74\x65\x74\x65\x78\x74\x6f",
  "\x6c\x69\x6d\x70\x61\x72\x61\x6e\x6f\x74\x61\x63\x6f\x65\x73",
  "\x6c\x69\x6d\x70\x61\x72\x68\x69\x73\x74\x6f\x72\x69\x63\x6f",
  "\x6c\x69\x6d\x70\x61\x72\x70\x75\x6e\x69\x63\x6f\x65\x73",
  "\x6c\x69\x6e\x64\x61",
  "\x6c\x69\x6e\x64\x6f",
  "\x6c\x69\x6e\x6b\x67\x70",
  "\x6c\x69\x6e\x6b\x67\x72\x75\x70\x6f",
  "\x6c\x69\x73\x74\x61",
  "\x6c\x69\x73\x74\x61\x5f\x61\x6c\x75\x67\x65\x6c",
  "\x6c\x69\x73\x74\x61\x5f\x61\x6c\x75\x67\x75\x65\x6c",
  "\x6c\x69\x73\x74\x61\x61\x64\x76",
  "\x6c\x69\x73\x74\x61\x62\x72\x61\x6e\x63\x61",
  "\x6c\x69\x73\x74\x61\x64\x76",
  "\x6c\x69\x73\x74\x61\x6c\x69\x61\x73\x65\x73",
  "\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61",
  "\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67",
  "\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67\x6c\x6f\x62\x61\x6c",
  "\x6c\x69\x73\x74\x63\x6d\x64\x73\x74\x69\x63\x6b\x65\x72",
  "\x6c\x6f\x67\x73",
  "\x6c\x6f\x6a\x61",
  "\x6c\x6f\x6a\x61\x70\x72\x65\x6d\x69\x75\x6d",
  "\x6c\x6f\x6a\x61\x72\x70\x67",
  "\x6c\x6f\x74\x65\x72\x69\x61",
  "\x6c\x75\x63\x79",
  "\x6c\x79\x72\x69\x63\x73",
  "\x6c\xed\x64\x65\x72\x65\x73",
  "\x6d\x61\x69\x64\x5f\x64\x72\x61\x67\x6f\x6e",
  "\x6d\x61\x69\x64\x5f\x66\x65\x6d\x62\x6f\x79",
  "\x6d\x61\x69\x64\x5f\x70\x6f\x72\x6e",
  "\x6d\x61\x69\x64\x64\x72\x61\x67\x6f\x6e",
  "\x6d\x61\x69\x64\x66\x65\x6d\x62\x6f\x79",
  "\x6d\x61\x69\x64\x70\x6f\x72\x6e",
  "\x6d\x61\x73\x6d\x6f\x72\x72\x61",
  "\x6d\x61\x74\x65\x72\x69\x61\x69\x73",
  "\x6d\x65\x6e\x75",
  "\x6d\x65\x6e\x75\x61\x64\x6d",
  "\x6d\x65\x6e\x75\x62\x6e",
  "\x6d\x65\x6e\x75\x62\x72\x69\x6e\x63\x61\x64\x65\x69\x72\x61\x73",
  "\x6d\x65\x6e\x75\x64\x69\x76\x65\x72\x73\x61\x6f",
  "\x6d\x65\x6e\x75\x64\x6f\x6e\x6f",
  "\x6d\x65\x6e\x75\x64\x72\x61\x67\x6f\x6e",
  "\x6d\x65\x6e\x75\x67\x65\x72\x61\x6c",
  "\x6d\x65\x6e\x75\x6a\x6f\x67\x6f\x73",
  "\x6d\x65\x6e\x75\x6c\x65\x76\x65\x6c",
  "\x6d\x65\x6e\x75\x6c\x6f\x6a\x61",
  "\x6d\x65\x6e\x75\x6e\x69\x76\x65\x6c",
  "\x6d\x65\x6e\x75\x6f\x77\x6e\x65\x72",
  "\x6d\x65\x6e\x75\x72\x70\x67",
  "\x6d\x65\x6e\x75\x73\x68\x6f\x70",
  "\x6d\x65\x6e\x75\x73\x6f\x63\x69\x61\x6c",
  "\x6d\x65\x6e\x75\x73\x74\x69\x63\x6b\x65\x72",
  "\x6d\x65\x6e\x75\x73\x74\x6b",
  "\x6d\x65\x72\x63\x61\x64\x6f",
  "\x6d\x69\x6e\x65",
  "\x6d\x69\x6e\x65\x72\x61\x72",
  "\x6d\x69\x73\x73\x61\x6f",
  "\x6d\x69\x73\x73\x6f\x65\x73",
  "\x6d\x6f\x64\x6f\x62\x72\x69\x6e\x63\x61\x64\x65\x69\x72\x61",
  "\x6d\x6f\x64\x6f\x64\x72\x61\x67\x6f\x6e\x72\x70\x67",
  "\x6d\x6f\x64\x6f\x65\x6d\x65\x72\x67\x65\x6e\x63\x69\x61",
  "\x6d\x6f\x64\x6f\x72\x70\x67",
  "\x6d\x6f\x65\x64\x61",
  "\x6d\x6f\x74\x69\x76\x61\x63\x69\x6f\x6e\x61\x6c",
  "\x6d\x75\x74\x61\x72",
  "\x6d\x75\x74\x65",
  "\x6e\x69\x76\x65\x6c",
  "\x6e\x69\x76\x65\x6c\x69\x6e\x66\x6f",
  "\x6e\x6f\x6d\x65\x5f\x67\x70",
  "\x6e\x6f\x74\x61\x73",
  "\x6e\x6f\x76\x69\x64\x61\x64\x65\x73",
  "\x6e\x75\x6d\x65\x72\x6f\x5f\x62\x6f\x74",
  "\x6e\x75\x6d\x65\x72\x6f\x5f\x64\x6f\x6e\x6f",
  "\x6e\xfa\x6d\x65\x72\x6f\x5f\x62\x6f\x74",
  "\x6e\xfa\x6d\x65\x72\x6f\x5f\x64\x6f\x6e\x6f",
  "\x6f\x66\x66",
  "on",
  "\x6f\x6e\x6c\x79\x61\x64\x6d",
  "\x6f\x70\x63\x61\x6f\x31",
  "\x6f\x70\x63\x61\x6f\x32",
  "\x6f\x70\x65\x6e\x63\x61\x69\x78\x61",
  "\x6f\x70\x65\x6e\x67\x70",
  "\x6f\x70\x65\x6e\x67\x70\x5f\x6f\x66\x66",
  "\x6f\x77\x6e\x65\x72",
  "\x70\x61\x63\x6b\x66\x69\x67",
  "\x70\x61\x63\x6f\x74\x65",
  "\x70\x61\x67\x61\x72",
  "\x70\x61\x69\x6e\x65\x6c\x61\x64\x6d",
  "\x70\x61\x69\x6e\x65\x6c\x70\x72\x6f\x74\x65\x63\x61\x6f",
  "\x70\x61\x69\x6e\x65\x6c\x73\x69\x73\x74\x65\x6d\x61\x73",
  "\x70\x61\x70\x65\x6c",
  "\x70\x61\x72\x63\x65\x72\x69\x61\x73\x62\x76",
  "\x70\x61\x79",
  "\x70\x65\x64\x72\x61",
  "\x70\x65\x72\x66\x69\x6c",
  "\x70\x65\x72\x66\x69\x6c\x72\x70\x67",
  "\x70\x65\x72\x6d\x69\x73\x73\x6f\x65\x73\x62\x6f\x74",
  "\x70\x65\x74\x62\x61\x74\x74\x6c\x65",
  "\x70\x65\x74\x62\x65\x74",
  "\x70\x65\x74\x73",
  "\x70\x69\x61\x64\x61",
  "\x70\x69\x6e\x67",
  "\x70\x69\x78",
  "\x70\x6c\x61\x6e\x6f",
  "\x70\x6c\x61\x6e\x6f\x73",
  "\x70\x6c\x61\x6e\x73",
  "\x70\x6c\x61\x6e\x74\x61\x63\x61\x6f",
  "\x70\x6c\x61\x6e\x74\x61\x72",
  "\x70\x6c\x61\x79",
  "\x70\x70\x74",
  "\x70\x72\x65\x63\x6f\x73",
  "\x70\x72\x65\x66\x69\x78\x6f",
  "\x70\x72\x65\x73\x65\x6e\x74\x65",
  "\x70\x72\x65\x73\x74\x69\x67\x65",
  "\x70\x72\x6f\x6d\x6f\x76\x65\x72",
  "\x70\x72\x6f\x70\x72\x69\x65\x64\x61\x64\x65\x73",
  "\x70\x72\x6f\x74\x65\x63\x61\x6f",
  "\x70\x72\x6f\x74\x65\xe7\xf5\x65\x73",
  "\x70\x75\x6e\x69\x63\x61\x6f\x5f\x74\x72\x61\x76\x61",
  "\x70\x75\x6e\x69\x63\x6f\x65\x73",
  "\x70\x75\x6e\x69\x72\x74\x72\x61\x76\x61",
  "\x71\x75\x61\x6e\x64\x6f",
  "\x71\x75\x65\x73\x74\x73",
  "\x71\x75\x69\x63\x6b\x5f\x72\x65\x70\x6c\x79",
  "\x72\x61\x6e\x6b",
  "\x72\x61\x6e\x6b\x61\x64\x6d",
  "\x72\x61\x6e\x6b\x63\x6f\x69\x6e\x73",
  "\x72\x61\x6e\x6b\x67\x61\x79",
  "\x72\x61\x6e\x6b\x67\x6c\x6f\x62\x61\x6c",
  "\x72\x61\x6e\x6b\x67\x6f\x6c\x64",
  "\x72\x61\x6e\x6b\x67\x6f\x73\x74\x6f\x73\x61",
  "\x72\x61\x6e\x6b\x67\x6f\x73\x74\x6f\x73\x6f",
  "\x72\x61\x6e\x6b\x68\x65\x74\x65\x72\x6f",
  "\x72\x61\x6e\x6b\x6c\x69\x6e\x64\x61",
  "\x72\x61\x6e\x6b\x6c\x69\x6e\x64\x6f",
  "\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c",
  "\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c\x67",
  "\x72\x61\x6e\x6b\x70\x74\x73",
  "\x72\x61\x6e\x6b\x72\x70\x67",
  "\x72\x61\x6e\x6b\x78\x70",
  "\x72\x61\x6e\x6b\x78\x70\x67",
  "\x72\x65\x62\x61\x69\x78\x61\x72",
  "\x72\x65\x63\x65\x69\x74\x61\x73",
  "\x72\x65\x63\x75\x73\x61\x72\x63\x6f\x6e\x76\x69\x74\x65",
  "\x72\x65\x67\x69\x6f\x65\x73",
  "\x72\x65\x67\x69\x73\x74\x72\x61\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c",
  "\x72\x65\x67\x72\x61\x73",
  "\x72\x65\x67\x72\x61\x73\x62\x76",
  "\x72\x65\x69\x6e\x69\x63\x69\x61\x72",
  "\x72\x65\x6d\x6f\x76\x65\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c",
  "\x72\x65\x6d\x6f\x76\x65\x72\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67",
  "\x72\x65\x6d\x6f\x76\x65\x72\x70\x61\x72\x63\x65\x72\x69\x61\x62\x76",
  "\x72\x65\x6e\x61\x6d\x65",
  "\x72\x65\x6e\x61\x6d\x65\x70\x65\x74",
  "\x72\x65\x6e\x6f\x76\x61\x72\x5f\x61\x6c\x75\x67\x65\x6c",
  "\x72\x65\x6e\x6f\x76\x61\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c",
  "\x72\x65\x70",
  "\x72\x65\x70\x61\x72\x61\x72",
  "\x72\x65\x70\x75\x74\x61\x63\x61\x6f",
  "\x72\x65\x73\x65\x74\x6c\x69\x6e\x6b",
  "\x72\x65\x73\x65\x74\x72\x61\x6e\x6b\x61\x64\x6d",
  "\x72\x65\x73\x70\x6f\x6e\x64\x65\x72",
  "\x72\x65\x76\x6f\x67\x61\x72\x6c\x69\x6e\x6b",
  "\x72\x67\x5f\x61\x6c\x75\x67\x75\x65\x6c",
  "\x72\x67\x63\x6d\x64",
  "\x72\x67\x66\x69\x67\x75",
  "\x72\x6d\x5f\x61\x64\x76",
  "\x72\x6d\x5f\x61\x6c\x75\x67\x75\x65\x6c",
  "\x72\x6d\x5f\x63\x6c\x6f\x73\x65\x67\x70",
  "\x72\x6d\x5f\x6f\x70\x65\x6e\x67\x70",
  "\x72\x6d\x5f\x76\x6f\x72\x64",
  "\x72\x6d\x61\x64\x76",
  "\x72\x6d\x61\x6e\x6f\x74\x61\x63\x61\x6f",
  "\x72\x6d\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x67",
  "\x72\x6d\x63\x6c\x6f\x73\x65\x67\x70",
  "\x72\x6d\x63\x6f\x6e\x76\x69\x74\x65",
  "\x72\x6d\x66\x6f\x74\x6f\x62\x76",
  "\x72\x6d\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67",
  "\x72\x6d\x6f\x70\x65\x6e\x67\x70",
  "\x72\x6d\x70\x61\x72\x63\x65\x72\x69\x61\x62\x76",
  "\x72\x6d\x72\x65\x67\x72\x61\x73",
  "\x72\x6f\x75\x62\x61\x72",
  "\x72\x70\x67",
  "\x72\x70\x67\x61\x6a\x75\x64\x61",
  "\x72\x70\x67\x61\x74\x61\x63\x61\x72",
  "\x72\x70\x67\x61\x74\x72\x69\x62\x75\x74\x6f",
  "\x72\x70\x67\x63\x6c\x61\x73\x73\x65",
  "\x72\x70\x67\x63\x6c\x61\x73\x73\x65\x69\x6e\x66\x6f",
  "\x72\x70\x67\x63\x6c\x61\x73\x73\x65\x73",
  "\x72\x70\x67\x63\x6f\x6d\x61\x6e\x64\x6f\x73",
  "\x72\x70\x67\x63\x6f\x6d\x70\x72\x61\x72",
  "\x72\x70\x67\x63\x72\x69\x61\x72",
  "\x72\x70\x67\x64\x65\x66\x65\x6e\x64\x65\x72",
  "\x72\x70\x67\x64\x65\x73\x63\x61\x6e\x73\x61\x72",
  "\x72\x70\x67\x64\x65\x73\x65\x71\x75\x69\x70\x61\x72",
  "\x72\x70\x67\x64\x72\x61\x67\x61\x6f",
  "\x72\x70\x67\x65\x71\x75\x69\x70\x61\x6d\x65\x6e\x74\x6f\x73",
  "\x72\x70\x67\x65\x71\x75\x69\x70\x61\x72",
  "\x72\x70\x67\x66\x61\x63\x63\x61\x6f",
  "\x72\x70\x67\x66\x75\x67\x69\x72",
  "\x72\x70\x67\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65",
  "\x72\x70\x67\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65\x73",
  "\x72\x70\x67\x69\x6e\x76\x65\x6e\x74\x61\x72\x69\x6f",
  "\x72\x70\x67\x69\x74\x65\x6d",
  "\x72\x70\x67\x6c\x6f\x6a\x61",
  "\x72\x70\x67\x6d\x69\x73\x73\x61\x6f",
  "\x72\x70\x67\x6d\x69\x73\x73\x6f\x65\x73",
  "\x72\x70\x67\x70\x65\x72\x66\x69\x6c",
  "\x72\x70\x67\x72\x61\x6e\x6b",
  "\x72\x70\x67\x72\x65\x67\x69\x6f\x65\x73",
  "rr",
  "s",
  "\x73\x61\x69\x72",
  "\x73\x61\x69\x72\x5f\x66\x61\x6d\x69\x6c\x69\x61",
  "\x73\x61\x6c\x64\x6f",
  "\x73\x65\x6c\x6c",
  "\x73\x65\x6d\x65\x6e\x74\x65\x73",
  "\x73\x65\x6e\x74\x69\x6e\x65\x6c",
  "\x73\x65\x6e\x74\x69\x6e\x65\x6c\x62\x72\x69\x64\x67\x65",
  "\x73\x65\x74\x62\x76",
  "\x73\x65\x74\x62\x79\x65",
  "\x73\x65\x74\x63\x6d\x64",
  "\x73\x65\x74\x70\x61\x72\x63\x65\x72\x69\x61\x73\x62\x76",
  "\x73\x65\x74\x72\x65\x67\x72\x61\x73",
  "\x73\x65\x74\x72\x65\x67\x72\x61\x73\x62\x76",
  "\x73\x68\x69\x70",
  "\x73\x68\x69\x70\x6f",
  "\x73\x69\x6e\x67\x6c\x65\x5f\x73\x65\x6c\x65\x63\x74",
  "\x73\x69\x73\x74\x65\x6d\x61\x6e\x69\x76\x65\x6c",
  "\x73\x69\x73\x74\x65\x6d\x61\x73",
  "\x73\x69\x73\x74\x65\x6d\x61\x73\x67\x70",
  "\x73\x6b\x69\x6c\x6c\x64\x72\x61\x67\x61\x6f",
  "\x73\x6b\x69\x6c\x6c\x73\x72\x70\x67",
  "\x73\x6f\x61\x64\x6d",
  "\x73\x6f\x61\x64\x6d\x69\x6e",
  "\x73\x6f\x72\x74\x65",
  "\x73\x70\x65\x65\x64\x75\x70",
  "st",
  "\x73\x74\x61\x74\x75\x73\x5f\x62\x6f\x74",
  "\x73\x74\x61\x74\x75\x73\x5f\x76\x6f\x72\x64",
  "\x73\x74\x61\x74\x75\x73\x61\x74\x74",
  "\x73\x74\x61\x74\x75\x73\x62\x6f\x74",
  "\x73\x74\x61\x74\x75\x73\x62\x76",
  "\x73\x74\x61\x74\x75\x73\x64\x65\x73\x70\x65\x72\x74\x61\x72",
  "\x73\x74\x61\x74\x75\x73\x67\x70",
  "\x73\x74\x61\x74\x75\x73\x67\x72\x75\x70\x6f",
  "\x73\x74\x61\x74\x75\x73\x75\x70\x64\x61\x74\x65",
  "\x73\x74\x65\x61\x6c",
  "\x73\x74\x69\x63\x6b\x65\x72",
  "\x73\x74\x69\x63\x6b\x65\x72\x63\x6d\x64\x73",
  "\x73\x74\x69\x63\x6b\x65\x72\x70\x61\x63\x6b",
  "\x73\x74\x69\x63\x6b\x65\x72\x73",
  "\x73\x74\x6b",
  "\x73\x74\x72\x65\x61\x6b",
  "\x73\x75\x69\x63\x69\x64\x69\x6f",
  "\x73\x75\x69\x63\xed\x64\x69\x6f",
  "\x74\x61\x6b\x65",
  "\x74\x65\x6d\x70\x6f\x62\x76",
  "\x74\x65\x73\x6f\x75\x72\x61",
  "\x74\x65\x73\x74\x65\x62\x76",
  "\x74\x6f\x67\x69\x66",
  "\x74\x6f\x69\x6d\x61\x67\x65",
  "\x74\x6f\x69\x6d\x67",
  "\x74\x6f\x70\x61\x74\x69\x76\x6f\x73",
  "\x74\x6f\x70\x63\x6d\x64\x73",
  "\x74\x6f\x70\x63\x6f\x69\x6e\x73",
  "\x74\x6f\x70\x6c\x65\x76\x65\x6c",
  "\x74\x6f\x72\x6e\x65\x69\x6f",
  "\x74\x6f\x74\x61\x67",
  "\x74\x6f\x74\x61\x6c\x63\x6d\x64",
  "\x74\x72\x61\x69\x6e",
  "\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x61\x72",
  "\x74\x72\x69\x62\x75\x74\x6f\x73",
  "\x75\x6e\x62\x6c\x6f\x63\x6b\x63\x6d\x64",
  "\x75\x6e\x62\x6c\x6f\x63\x6b\x63\x6d\x64\x67",
  "\x75\x6e\x6d\x75\x74\x65",
  "\x75\x6e\x74\x69\x74\x6c\x65",
  "\x75\x70\x64\x61\x74\x65",
  "v",
  "\x76\x61\x62",
  "\x76\x61\x67\x61\x73",
  "\x76\x65\x6e\x64\x65\x72\x63\x6f\x6d\x69\x64\x61",
  "\x76\x65\x72\x5f\x61\x6c\x75\x67\x65\x6c",
  "\x76\x65\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c",
  "\x76\x65\x72\x73\x61\x6f",
  "\x76\x65\x72\x73\x69\x6f\x6e",
  "\x76\x6f\x74\x65",
  "\x77\x68\x69\x74\x65\x6c\x69\x73\x74",
  "\x77\x6f\x72\x6b",
  "xp",
  "\x7a\x65\x72\x61\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c",
  "\x7a\x65\x72\x61\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c\x67",
  "\x7a\x65\x72\x61\x72\x72\x70\x67",
  "\x7a\x65\x72\x61\x72\x72\x70\x67\x67"
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
    {re:/^(?:tocar|toca|musica|música)\s+(.+)$/i, cmd:"\x70\x6c\x61\x79"},
    {re:/^(?:figurinha|sticker)\s*$/i, cmd:"s"},
    {re:/^(?:advertir|advertencia|advertência)\s+(.+)$/i, cmd:"\x61\x64\x76"},
    {re:/^(?:tirar advertencia|tirar advertência)\s+(.+)$/i, cmd:"\x72\x6d\x61\x64\x76"},
    {re:/^(?:dragon rpg|rpg dragao|rpg dragão)\s*$/i, cmd:"\x64\x72\x61\x67\x6f\x6e\x72\x70\x67"}
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
if (!body && type === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
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
  String(jid).includes("\x40\x6c\x69\x64")
) || null;

const botNumber = await getPNForJid(conn, conn.user.id, conn.user.lid || conn.user.phoneNumber) ||
(conn.user.id.split(":")[0] + "\x40\x73\x2e\x77\x68\x61\x74\x73\x61\x70\x70\x2e\x6e\x65\x74");

const groupMembers = isGroup ? groupMetadata.participants : "";

// 👑 Dono principal • reconhecimento definitivo PN/LID/BR
// Aceita:
// - PN normal (@s.whatsapp.net)
// - LID resolvido pelo Baileys
// - participant / participantAlt / phoneNumber / jid / lid
// - variação brasileira antiga sem o 9º dígito
// - número principal configurado + fallback do criador
const runtimeSettings = readSettingsFile();

const CREATOR_OWNER_FALLBACK = "\x35\x35\x31\x35\x39\x39\x37\x30\x37\x35\x33\x30\x34";

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
      source:"\x6d\x65\x73\x73\x61\x67\x65\x2d\x67\x6c\x6f\x62\x61\x6c"
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
      const alreadyGlobal = getGlobalBlacklistEntry(targetBanMsg);

      if (!alreadyGlobal) {
        addGlobalBlacklist(targetBanMsg, {
          reason: `BAN MSG: ${banMsgRule.text}`,
          by: "\x62\x61\x6e\x5f\x6d\x73\x67",
          sourceGroup: from,
          sourceMessage: String(body).slice(0, 2000),
          createdAt: Date.now()
        });
      }

      const purgeBanMsg = await purgeUserFromAdminGroups(conn, targetBanMsg, {
        announce:true,
        source:"\x42\x41\x4e\x20\x4d\x53\x47"
      }).catch(() => ({
        checked:0, adminGroups:0, found:0, removed:0, failures:0
      }));

      const currentGroupRemoved = Number(purgeBanMsg?.removed || 0) > 0;

      const detectedName = String(pushname || senderParticipant?.notify || "\x55\x73\x75\xe1\x72\x69\x6f").trim();
      const detectedNumber = String(targetBanMsg).split("@")[0] || "\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f";
      const occurredAt = new Date().toLocaleString("\x70\x74\x2d\x42\x52", {
        timeZone: "\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f",
        hour12: false
      });

      const ownerAudit =
        `╭═══════ ❀ 🐉 ❀ ═══════╮\n` +
        `   🚨 *BAN MSG • AUDITORIA* 🚨\n` +
        `╰═══════ ❀ 🖤 ❀ ═══════╯\n\n` +
        `╭─〔 🛡️ *OCORRÊNCIA* 〕\n` +
        `│ 👤 Nome › *${detectedName || "\x55\x73\x75\xe1\x72\x69\x6f"}*\n` +
        `│ 📱 Número › @${detectedNumber}\n` +
        `│ 👥 Grupo › *${groupName || "\x47\x72\x75\x70\x6f"}*\n` +
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
        `│ 🖤 Lista Negra Global: *ATIVADA*\n` +
        `│ 🔎 Grupos verificados: *${Number(purgeBanMsg?.checked || 0)}*\n` +
        `│ 🛡️ Grupos onde sou ADM: *${Number(purgeBanMsg?.adminGroups || 0)}*\n` +
        `│ 👤 Encontrado em: *${Number(purgeBanMsg?.found || 0)}*\n` +
        `│ 🔨 Removido de: *${Number(purgeBanMsg?.removed || 0)}*\n` +
        `│ ❌ Falhas: *${Number(purgeBanMsg?.failures || 0)}*\n` +
        `╰────────────────`;

      await conn.sendMessage(dono, {
        text: ownerAudit,
        mentions: [targetBanMsg]
      }).catch((e) => console.error("\x5b\x42\x41\x4e\x20\x4d\x53\x47\x20\x41\x55\x44\x49\x54\x4f\x52\x49\x41\x5d", e?.message || e));

      addAdminLog(from, {
        type: "\x62\x61\x6e\x5f\x6d\x73\x67",
        actor: targetBanMsg,
        detail: `BAN MSG acionado: ${banMsgRule.text}`
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
      `📦 *Versão*\n${pendingUpdateNews?.fromVersion || "\x61\x6e\x74\x65\x72\x69\x6f\x72"} → ${currentVersion}\n\n` +
      formatReleaseNotes(currentNotes, { prefix });

    await conn.sendMessage(
      pendingUpdateNews.targetJid,
      { text: updateText }
    ).catch((e) => console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x65\x6e\x76\x69\x61\x72\x20\x55\x70\x64\x61\x74\x65\x20\x4e\x65\x77\x73\x3a", e));
  }
}

if (!isGroup && !isStatus && !info.key.fromMe && !SoDono) {
  // Compatibilidade: instalações antigas com antiPv=true entram em modo aviso.
  const antiPvMode = String(
    runtimeSettings?.antiPvMode ||
    (runtimeSettings?.antiPv ? "\x61\x76\x69\x73\x6f" : "\x6f\x66\x66")
  ).toLowerCase();

  if (["\x61\x76\x69\x73\x6f","\x62\x6c\x6f\x71\x75\x65\x61\x72","\x61\x6c\x75\x67\x75\x65\x6c"].includes(antiPvMode)) {
    const antiPvPreview = auditMessagePreview(info, body, type);

    await notifyOwnerAntiPv(conn, dono, {
      sender,
      messageId: info?.key?.id,
      messageText: antiPvPreview,
      type,
      mode: antiPvMode
    });

    if (antiPvMode === "\x61\x76\x69\x73\x6f") {
      await conn.sendMessage(
        from,
        {
          text:
            "⚠️🐉 *ANTI-PV KOBAYASHI*\n\n" +
            "Meu privado não é destinado ao uso comum do bot.\n" +
            "Por favor, utilize a Kobayashi nos grupos autorizados.\n\n" +
            "\ud83d\x20\x4f\x20\x63\x72\x69\x61\x64\x6f\x72\x20\x66\x6f\x69\x20\x61\x76\x69\x73\x61\x64\x6f\x20\x73\x6f\x62\x72\x65\x20\x65\x73\x74\x65\x20\x63\x6f\x6e\x74\x61\x74\x6f\x2e"
        },
        { quoted: info }
      ).catch(() => {});
      continue;
    }

    if (antiPvMode === "\x62\x6c\x6f\x71\x75\x65\x61\x72") {
      await conn.sendMessage(
        from,
        {
          text:
            "🚫🐉 *ANTI-PV KOBAYASHI*\n\n" +
            "\x43\x6f\x6e\x74\x61\x74\x6f\x73\x20\x6e\xe3\x6f\x20\x61\x75\x74\x6f\x72\x69\x7a\x61\x64\x6f\x73\x20\x6e\x6f\x20\x70\x72\x69\x76\x61\x64\x6f\x20\x73\xe3\x6f\x20\x62\x6c\x6f\x71\x75\x65\x61\x64\x6f\x73\x20\x61\x75\x74\x6f\x6d\x61\x74\x69\x63\x61\x6d\x65\x6e\x74\x65\x2e"
        },
        { quoted: info }
      ).catch(() => {});

      try {
        if (typeof conn.updateBlockStatus === "\x66\x75\x6e\x63\x74\x69\x6f\x6e") {
          await conn.updateBlockStatus(sender, "\x62\x6c\x6f\x63\x6b");
        } else {
          console.log("\x5b\x41\x4e\x54\x49\x2d\x50\x56\x5d\x20\x75\x70\x64\x61\x74\x65\x42\x6c\x6f\x63\x6b\x53\x74\x61\x74\x75\x73\x20\x69\x6e\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c\x20\x6e\x65\x73\x74\x61\x20\x76\x65\x72\x73\xe3\x6f\x20\x64\x6f\x20\x42\x61\x69\x6c\x65\x79\x73\x2e");
        }
      } catch (e) {
        console.error("\x5b\x41\x4e\x54\x49\x2d\x50\x56\x20\x42\x4c\x4f\x51\x55\x45\x41\x52\x5d", e?.message || e);
      }
      continue;
    }

    if (antiPvMode === "\x61\x6c\x75\x67\x75\x65\x6c") {
      const rentUrl = "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x61\x2e\x6d\x65\x2f\x35\x35\x31\x35\x39\x39\x37\x30\x37\x35\x33\x30\x34\x3f\x74\x65\x78\x74\x3d\x51\x75\x65\x72\x6f\x25\x32\x30\x61\x6c\x75\x67\x61\x72\x25\x32\x30\x6f\x25\x32\x30\x62\x6f\x74\x25\x32\x43\x25\x32\x30\x63\x6f\x6d\x6f\x25\x32\x30\x66\x61\x25\x43\x33\x25\x41\x37\x6f\x25\x33\x46";
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
if (!info.key.fromMe && type === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
  try {
    const captureStatus = getPackageCaptureStatus(from);
    if (captureStatus.active) {
      const stickerBuffer = await downloadMediaMessage(info, "\x62\x75\x66\x66\x65\x72", {});
      const captureResult = captureStickerIfActive(from, stickerBuffer);
      if (captureResult?.reason === "\x6c\x69\x6d\x69\x74") {
        await conn.sendMessage(from, {
          text: "\ud83c\u26a0\ufe0f\x20\x41\x20\x63\x61\x70\x74\x75\x72\x61\x20\x63\x68\x65\x67\x6f\x75\x20\x61\x6f\x20\x6c\x69\x6d\x69\x74\x65\x20\x64\x65\x20\x2a\x32\x35\x30\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x73\x2a\x20\x65\x20\x66\x6f\x69\x20\x70\x61\x75\x73\x61\x64\x61\x20\x61\x75\x74\x6f\x6d\x61\x74\x69\x63\x61\x6d\x65\x6e\x74\x65\x2e"
        }).catch(() => {});
      }
    }
  } catch (e) {
    console.error("\x5b\x50\x41\x43\x4f\x54\x45\x20\x43\x41\x50\x54\x55\x52\x45\x5d", e?.message || e);
  }
}

// KOBAYASHI AFK + ACTIVITY v0.1.55
// O tracker precisa rodar em grupos independentemente do Anti-PV.
if (isGroup && sender && !info.key.fromMe) {
  const rawActivityType = getContentType(info.message || {});
  const activityType =
    rawActivityType === "\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65"
      ? "\x69\x6d\x61\x67\x65"
      : rawActivityType === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65"
        ? "\x73\x74\x69\x63\x6b\x65\x72"
        : "\x74\x65\x78\x74";

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
  if (ownAfk && command !== "\x61\x66\x6b") {
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
        `📝 Motivo: *${afk.reason || "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f"}*\n` +
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
  if (isCmd) rankAdmKind = "\x63\x6f\x6d\x6d\x61\x6e\x64";
  else if (info?.message?.stickerMessage) rankAdmKind = "\x73\x74\x69\x63\x6b\x65\x72";
  else if (info?.message?.imageMessage) rankAdmKind = "\x70\x68\x6f\x74\x6f";
  else if (info?.message?.videoMessage) rankAdmKind = "\x76\x69\x64\x65\x6f";
  else if (info?.message?.conversation || info?.message?.extendedTextMessage?.text) rankAdmKind = "\x74\x65\x78\x74";
  if (rankAdmKind) try { trackAdminActivity(from, sender, rankAdmKind); } catch (e) { console.log("\x5b\x52\x41\x4e\x4b\x41\x44\x4d\x5d",e?.message||e); }
}


// 🤍 WHITELIST HARD GUARD • v2.0.12
// Proteção no nível do socket: qualquer remoção feita pelo bot passa por esta barreira.
// Isso cobre AntiLink, AntiSpam, AntiTrava, BanFake, Banghost, Sentinel e handlers externos
// que usem o mesmo conn.groupParticipantsUpdate().
if (!conn.__kobayashiWhitelistHardGuard) {
  const originalGroupParticipantsUpdate = conn.groupParticipantsUpdate.bind(conn);

  conn.groupParticipantsUpdate = async (groupJid, participants, action, ...rest) => {
    if (String(action || "").toLowerCase() !== "\x72\x65\x6d\x6f\x76\x65") {
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
        status: "\x77\x68\x69\x74\x65\x6c\x69\x73\x74\x2d\x62\x6c\x6f\x63\x6b\x65\x64",
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
    await conn.groupParticipantsUpdate(from, [sender], "\x72\x65\x6d\x6f\x76\x65").catch(() => {});
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
      `📝 Motivo: *${globalBlock.reason || "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f"}*`
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

    let punishmentText = "\x53\x6f\x6d\x65\x6e\x74\x65\x20\x61\x6c\x65\x72\x74\x61";
    if (antiSpamHit.punishment === "\x62\x61\x6e" && isBotGroupAdmins) {
      try {
        await conn.groupParticipantsUpdate(from, [sender], "\x72\x65\x6d\x6f\x76\x65");
        punishmentText = "\x4d\x65\x6d\x62\x72\x6f\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f";
      } catch (e) {
        const result = await addAutomaticWarning(conn, from, sender, "\x41\x6e\x74\x69\x53\x70\x61\x6d\x3a\x20" + antiSpamHit.reasons.join(", "), isBotGroupAdmins, info);
        punishmentText = result.removed ? "\x33\x2f\x33\x20\x41\x44\x56\x73\x20\u2022\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f" : `Ban falhou • ADV ${result.count}/3`;
      }
    } else if (antiSpamHit.punishment === "\x61\x64\x76") {
      const result = await addAutomaticWarning(conn, from, sender, "\x41\x6e\x74\x69\x53\x70\x61\x6d\x3a\x20" + antiSpamHit.reasons.join(", "), isBotGroupAdmins, info);
      punishmentText = result.removed ? "\x33\x2f\x33\x20\x41\x44\x56\x73\x20\u2022\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f" : `ADV ${result.count}/3`;
    }

    await conn.sendMessage(from, {
      text:
        `🚨🐉 *KOBAYASHI ANTISPAM*\n\n` +
        `👤 @${sender.split("@")[0]}\n` +
        `⚠️ Detectado: *${antiSpamHit.reasons.join("\x20\u2022\x20")}*\n` +
        `🗑️ Mensagem: *${deleted ? "\x61\x70\x61\x67\x61\x64\x61\x20\u2705" : isBotGroupAdmins ? "\x6e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x61\x70\x61\x67\x61\x72\x20\u26a0\ufe0f" : "\x62\x6f\x74\x20\x73\x65\x6d\x20\x41\x44\x4d\x20\u26a0\ufe0f"}*\n` +
        `⚖️ Ação: *${punishmentText}*`,
      mentions: [sender]
    }).catch(() => {});

    addAdminLog(from, {
      type: "\x61\x6e\x74\x69\x73\x70\x61\x6d",
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

    let punishmentText = "\x53\x6f\x6d\x65\x6e\x74\x65\x20\x61\x6c\x65\x72\x74\x61";
    const punishment = String(antiTravaCfg.punishment || "\x61\x64\x76").toLowerCase();

    if (punishment === "\x62\x61\x6e") {
      if (isBotGroupAdmins) {
        try {
          await conn.groupParticipantsUpdate(from, [sender], "\x72\x65\x6d\x6f\x76\x65");
          punishmentText = "\x4d\x65\x6d\x62\x72\x6f\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f";
        } catch (e) {
          const result = await addAutomaticWarning(conn, from, sender, "\x41\x6e\x74\x69\x2d\x54\x72\x61\x76\x61\x3a\x20" + inspection.reasons.join(", "), isBotGroupAdmins, info);
          punishmentText = `Ban falhou • ADV ${result.count}/3`;
        }
      } else {
        const result = await addAutomaticWarning(conn, from, sender, "\x41\x6e\x74\x69\x2d\x54\x72\x61\x76\x61\x3a\x20" + inspection.reasons.join(", "), false, info);
        punishmentText = `Sem ADM • ADV ${result.count}/3`;
      }
    } else if (punishment === "\x61\x64\x76") {
      const result = await addAutomaticWarning(conn, from, sender, "\x41\x6e\x74\x69\x2d\x54\x72\x61\x76\x61\x3a\x20" + inspection.reasons.join(", "), isBotGroupAdmins, info);
      punishmentText = result.removed ? "\x33\x2f\x33\x20\x41\x44\x56\x73\x20\u2022\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f" : `ADV ${result.count}/3`;
    }

    if (inspection.severe && antiTravaCfg.emergency && isBotGroupAdmins) {
      const wasAnnouncement = Boolean(groupMetadata?.announce);
      if (!wasAnnouncement) {
        try {
          await conn.groupSettingUpdate(from, "\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74");
          const reopenMs = Math.max(5, Math.min(120, Number(antiTravaCfg.emergencySeconds) || 20)) * 1000;
          setTimeout(async () => {
            try { await conn.groupSettingUpdate(from, "\x6e\x6f\x74\x5f\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74"); } catch {}
          }, reopenMs).unref?.();
        } catch (e) {
          console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x61\x74\x69\x76\x61\x72\x20\x6d\x6f\x64\x6f\x20\x64\x65\x20\x65\x6d\x65\x72\x67\xea\x6e\x63\x69\x61\x3a", e?.message || e);
        }
      }
    }

    await conn.sendMessage(from, {
      text:
        `🚨🐉 *KOBAYASHI ANTI-TRAVA*\n\n` +
        `👤 @${sender.split("@")[0]}\n` +
        `🧨 Detectado: *${inspection.reasons.join("\x20\u2022\x20")}*\n` +
        `🗑️ Mensagem: *${deleted ? "\x61\x70\x61\x67\x61\x64\x61\x20\u2705" : isBotGroupAdmins ? "\x6e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x61\x70\x61\x67\x61\x72\x20\u26a0\ufe0f" : "\x70\x72\x65\x63\x69\x73\x6f\x20\x73\x65\x72\x20\x41\x44\x4d\x20\u26a0\ufe0f"}*\n` +
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
    "\x70\x6c\x61\x6e\x6f\x73", "\x70\x6c\x61\x6e\x73", "\x70\x6c\x61\x6e\x6f", "\x76\x65\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c", "\x76\x65\x72\x5f\x61\x6c\x75\x67\x65\x6c", "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x69\x6e\x66\x6f",
    "\x64\x6f\x6e\x6f", "\x6f\x77\x6e\x65\x72", "\x63\x72\x69\x61\x64\x6f\x72", "\x76\x65\x72\x73\x69\x6f\x6e"
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
      `${expired ? "\u23f3\x20\x4f\x20\x61\x6c\x75\x67\x75\x65\x6c\x20\x64\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x20\x65\x78\x70\x69\x72\x6f\x75\x2e" : "\ud83d\x20\x45\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x75\x6d\x20\x61\x6c\x75\x67\x75\x65\x6c\x20\x61\x74\x69\x76\x6f\x2e"}\n\n` +
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
type == "\x61\x75\x64\x69\x6f\x4d\x65\x73\x73\x61\x67\x65" ? "\xc1\x75\x64\x69\x6f" :
type == "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65" ? "\x46\x69\x67\x75\x72\x69\x6e\x68\x61" :
type == "\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65" ? "\x49\x6d\x61\x67\x65\x6d" :
type == "\x76\x69\x64\x65\x6f\x4d\x65\x73\x73\x61\x67\x65" ? "\x56\xed\x64\x65\x6f" :
type == "\x64\x6f\x63\x75\x6d\x65\x6e\x74\x4d\x65\x73\x73\x61\x67\x65" ? "\x44\x6f\x63\x75\x6d\x65\x6e\x74\x6f" :
type == "\x63\x6f\x6e\x74\x61\x63\x74\x4d\x65\x73\x73\x61\x67\x65" ? "\x43\x6f\x6e\x74\x61\x74\x6f" :
type == "\x6c\x6f\x63\x61\x74\x69\x6f\x6e\x4d\x65\x73\x73\x61\x67\x65" ? "\x4c\x6f\x63\x61\x6c\x69\x7a\x61\xe7\xe3\x6f" :
info.message?.reactionMessage?.text ? `Reação '\x24\x7b\x69\x6e\x66\x6f\x2e\x6d\x65\x73\x73\x61\x67\x65\x2e\x72\x65\x61\x63\x74\x69\x6f\x6e\x4d\x65\x73\x73\x61\x67\x65\x2e\x74\x65\x78\x74\x7d'` :
"\x54\x65\x78\x74\x6f";

const hourofc = moment.tz("\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f").format("\x48\x48\x3a\x6d\x6d\x3a\x73\x73");

if (!isGroup && isCmd) console.log(`${colors.red("\u256d\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256e")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Cmd-Privado: ${MessageType}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Número: ${sender.split("@")[0]}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("\u2570\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256f")}`);

if (!isGroup && !isCmd && !info.key.fromMe) console.log(`${colors.red("\u256d\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256e")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Msg-Privado: ${MessageType}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Número: ${sender.split("@")[0]}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("\u2570\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256f")}`);

if (isGroup && !isCmd && !info.key.fromMe) console.log(`${colors.red("\u256d\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256e")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Msg-Grupo: ${MessageType}
${colors.red("┃")} Grupo: ${groupName}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("\u2570\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256f")}`);

if (isGroup && isCmd) console.log(`${colors.red("\u256d\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256e")}
${colors.red("┃")} ${NomeDoBot} LOG
${colors.red("┃")} Cmd-Grupo: ${MessageType}
${colors.red("┃")} Grupo: ${groupName}
${colors.red("┃")} Nome: ${pushname}
${colors.red("┃")} Hora: ${hourofc}
${colors.red("\u2570\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u256f")}`);

async function reply(texto) {
await conn.sendPresenceUpdate("\x63\x6f\x6d\x70\x6f\x73\x69\x6e\x67", from);

return conn.sendMessage(from, { text: texto }, { quoted: info });
}

async function sendMenu(from, caption, sender) {
try {
reagir("❤️");
const menuImagePath = path.join(process.cwd(), "\x73\x65\x74\x74\x69\x6e\x67\x73", "\x4c\x4f\x47\x4f\x53", "\x6d\x65\x6e\x75\x2e\x70\x6e\x67");
await conn.sendMessage(
from,
{ image: fsx.readFileSync(menuImagePath), caption, mentions: [sender] },
{ quoted: info }
);
} catch (e) {
console.log(e);
reply("\u274c\x20\x45\x72\x72\x6f\x20\x61\x6f\x20\x65\x6e\x76\x69\x61\x72\x20\x6d\x65\x6e\x75\x20\x65\x6d\x20\x69\x6d\x61\x67\x65\x6d\x2e");
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
await conn.sendMessage(from, { video: { url: link }, mimetype: "\x76\x69\x64\x65\x6f\x2f\x6d\x70\x34", fileName: "\x76\x69\x64\x65\x6f\x2e\x6d\x70\x34" }, { quoted: info });
};

const enviarVd2 = async (link, texto) => {
await conn.sendMessage(
from,
{ video: { url: link }, caption: texto, mimetype: "\x76\x69\x64\x65\x6f\x2f\x6d\x70\x34", fileName: "\x76\x69\x64\x65\x6f\x2e\x6d\x70\x34" },
{ quoted: info }
);
};

const enviarAd = async (link) => {
conn.sendPresenceUpdate("\x72\x65\x63\x6f\x72\x64\x69\x6e\x67", from);
await delay(1000);
await conn.sendMessage(from, { audio: { url: link }, mimetype: "\x61\x75\x64\x69\x6f\x2f\x6d\x70\x65\x67" }, { quoted: info });
};

const enviarAd2 = async (link) => {
await conn.sendMessage(from, { audio: { url: link }, mimetype: "\x61\x75\x64\x69\x6f\x2f\x6d\x70\x65\x67", ptt: true }, { quoted: info });
};

async function toPTT(link) {
const tmpId = randomBytes(6).toString("\x68\x65\x78");
const inputPath = path.join(os.tmpdir(), `ptt-in-${tmpId}`);
const outputPath = path.join(os.tmpdir(), `ptt-out-${tmpId}.ogg`);

const res = await fetch(link);
const buffer = Buffer.from(await res.arrayBuffer());
fsx.writeFileSync(inputPath, buffer);

await new Promise((resolve, reject) => {
ffmpeg(inputPath)
.audioCodec("\x6c\x69\x62\x6f\x70\x75\x73")
.audioBitrate("\x36\x34\x6b")
.audioChannels(1)
.format("\x6f\x67\x67")
.on("\x65\x6e\x64", resolve)
.on("\x65\x72\x72\x6f\x72", reject)
.save(outputPath);
});

const oggBuffer = fsx.readFileSync(outputPath);
fsx.unlinkSync(inputPath);
fsx.unlinkSync(outputPath);

return oggBuffer;
}

const enviarPtt = async (link) => {
conn.sendPresenceUpdate("\x72\x65\x63\x6f\x72\x64\x69\x6e\x67", from);
const oggBuffer = await toPTT(link);
await conn.sendMessage(from, { audio: oggBuffer, mimetype: "\x61\x75\x64\x69\x6f\x2f\x6f\x67\x67\x3b\x20\x63\x6f\x64\x65\x63\x73\x3d\x6f\x70\x75\x73", ptt: true }, { quoted: info });
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
    action = "\x73\x74\x72\x69\x63\x74";
    reason = "\x45\x6e\x76\x69\x6f\x20\x64\x65\x20\x6c\x69\x6e\x6b\x20\x63\x6f\x6d\x20\x41\x6e\x74\x69\x4c\x69\x6e\x6b\x20\x61\x74\x69\x76\x61\x64\x6f";
  } else if (protection.antilinkgp && detected.whatsappGroup) {
    action = "\x73\x74\x72\x69\x63\x74";
    reason = "\x4c\x69\x6e\x6b\x20\x64\x65\x20\x67\x72\x75\x70\x6f\x20\x63\x6f\x6d\x20\x41\x6e\x74\x69\x4c\x69\x6e\x6b\x20\x47\x50\x20\x61\x74\x69\x76\x61\x64\x6f";
  } else if (protection.antitelegram && detected.telegram) {
    action = "\x73\x74\x72\x69\x63\x74";
    reason = "\x4c\x69\x6e\x6b\x20\x64\x65\x20\x54\x65\x6c\x65\x67\x72\x61\x6d\x20\x63\x6f\x6d\x20\x41\x6e\x74\x69\x54\x65\x6c\x65\x67\x72\x61\x6d\x20\x61\x74\x69\x76\x61\x64\x6f";
  } else if (protection.antilinklight && detected.anyLink) {
    action = "\x6c\x69\x67\x68\x74";
    reason = "\x45\x6e\x76\x69\x6f\x20\x64\x65\x20\x6c\x69\x6e\x6b\x20\x63\x6f\x6d\x20\x41\x6e\x74\x69\x4c\x69\x6e\x6b\x20\x4c\x69\x67\x68\x74\x20\x61\x74\x69\x76\x61\x64\x6f";
  }

  if (action) {
    const auditPreview = auditMessagePreview(info, body, type);
    const messageId = info?.key?.id || "\x6e\xe3\x6f\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c";

    // Responde diretamente à mensagem proibida ANTES de apagar/banir.
    // Assim o aviso fica visualmente ligado ao link que acionou o AntiLink.
    await conn.sendMessage(from, {
      text:
        action === "\x6c\x69\x67\x68\x74"
          ? `⚠️🌸 *Link proibido detectado.*\n@${sender.split("@")[0]}, esse tipo de link não é permitido aqui.`
          : `🚫🐉 *PROIBIDO LINKS AQUI!*\n@${sender.split("@")[0]} será removido por enviar link proibido.`,
      mentions: [sender]
    }, { quoted: info }).catch((e) => {
      console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x72\x65\x73\x70\x6f\x6e\x64\x65\x72\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x6f\x20\x41\x6e\x74\x69\x4c\x69\x6e\x6b\x3a", e?.message || e);
    });

    await delay(700);
    await deleteDetectedMessage(conn, from, info);

    let actionResult = "\x4d\x65\x6e\x73\x61\x67\x65\x6d\x20\x72\x65\x6d\x6f\x76\x69\x64\x61";

    if (action === "\x6c\x69\x67\x68\x74") {
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
          await conn.groupParticipantsUpdate(from, [sender], "\x72\x65\x6d\x6f\x76\x65");
          removed = true;
        } catch (e) {
          console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x75\x73\x75\xe1\x72\x69\x6f\x20\x70\x65\x6c\x6f\x20\x41\x6e\x74\x69\x4c\x69\x6e\x6b\x3a", e?.message || e);
        }
      }

      actionResult = isBotGroupAdmins
        ? (removed
            ? "\x4d\x65\x6e\x73\x61\x67\x65\x6d\x20\x72\x65\x6d\x6f\x76\x69\x64\x61\x20\u2022\x20\x6d\x65\x6d\x62\x72\x6f\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f"
            : "\x4d\x65\x6e\x73\x61\x67\x65\x6d\x20\x72\x65\x6d\x6f\x76\x69\x64\x61\x20\u2022\x20\x66\x61\x6c\x68\x61\x20\x61\x6f\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x6d\x65\x6d\x62\x72\x6f")
        : "\x4d\x65\x6e\x73\x61\x67\x65\x6d\x20\x72\x65\x6d\x6f\x76\x69\x64\x61\x20\u2022\x20\x62\x6f\x74\x20\x73\x65\x6d\x20\x41\x44\x4d\x20\x70\x61\x72\x61\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x6d\x65\x6d\x62\x72\x6f";

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
      type: "\x61\x6e\x74\x69\x6c\x69\x6e\x6b",
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
  type === "\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65" &&
  !isCmd &&
  isAutoStickerEnabled(from)
) {
  try {
    const mediaBuffer = await downloadMediaMessage(info, "\x62\x75\x66\x66\x65\x72", {});
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
    console.error("\x45\x72\x72\x6f\x20\x6e\x6f\x20\x61\x75\x74\x6f\x73\x74\x69\x63\x6b\x65\x72\x3a", e?.message || e);
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

  let modularVersion = "\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x61";
  try {
    modularVersion = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "\x76\x65\x72\x73\x69\x6f\x6e\x2e\x6a\x73\x6f\x6e"),
        "\x75\x74\x66\x38"
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
    "\x61\x74\x61\x63\x61\x72",
    "\x61\x74\x72\x69\x62\x75\x74\x6f\x72\x70\x67",
    "\x62\x61\x74\x61\x6c\x68\x61\x72",
    "\x62\x6f\x73\x73\x64\x65\x73\x70\x65\x72\x74\x61\x72",
    "\x63\x6c\x61\x73\x73\x65\x61\x76\x61\x6e\x63\x61\x64\x61",
    "\x63\x6c\x61\x73\x73\x65\x69\x6e\x66\x6f",
    "\x63\x6c\x61\x73\x73\x65\x73\x61\x76\x61\x6e\x63\x61\x64\x61\x73",
    "\x63\x6c\x61\x73\x73\x65\x73\x72\x70\x67",
    "\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x72\x70\x67",
    "\x63\x6f\x6d\x70\x72\x61\x72\x72\x70\x67",
    "\x63\x72\x69\x61\x72\x70\x65\x72\x73\x6f\x6e\x61\x67\x65\x6d",
    "\x64\x65\x66\x65\x6e\x64\x65\x72",
    "\x64\x65\x73\x63\x61\x6e\x73\x61\x72",
    "\x64\x65\x73\x63\x61\x6e\x73\x6f\x64\x72\x61\x67\x61\x6f",
    "\x64\x65\x73\x65\x71\x75\x69\x70\x61\x72",
    "\x64\x65\x73\x70\x65\x72\x74\x61\x72",
    "\x64\x65\x73\x70\x65\x72\x74\x61\x72\x62\x6f\x73\x73",
    "\x64\x65\x73\x70\x65\x72\x74\x61\x72\x64\x72\x61\x67\x61\x6f",
    "\x64\x72\x61\x67\x6f\x6e\x68\x65\x6c\x70",
    "\x64\x72\x61\x67\x6f\x6e\x72\x70\x67",
    "\x65\x6e\x65\x72\x67\x69\x61\x64\x72\x61\x67\x61\x6f",
    "\x65\x71\x75\x69\x70\x61\x6d\x65\x6e\x74\x6f\x73",
    "\x65\x71\x75\x69\x70\x61\x72",
    "\x65\x73\x63\x6f\x6c\x68\x65\x72\x63\x6c\x61\x73\x73\x65",
    "\x65\x73\x63\x6f\x6c\x68\x65\x72\x64\x72\x61\x67\x61\x6f",
    "\x65\x73\x63\x6f\x6c\x68\x65\x72\x66\x61\x63\x63\x61\x6f",
    "\x65\x78\x70\x6c\x6f\x72\x61\x72",
    "\x66\x6f\x72\x6d\x61\x64\x72\x61\x67\x61\x6f",
    "\x66\x6f\x72\x6d\x61\x68\x75\x6d\x61\x6e\x61",
    "\x66\x75\x67\x69\x72",
    "\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65",
    "\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65\x64\x72\x61\x67\x61\x6f",
    "\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65\x73",
    "\x68\x75\x6d\x61\x6e\x6f",
    "\x69\x6e\x76\x65\x6e\x74\x61\x72\x69\x6f\x72\x70\x67",
    "\x69\x74\x65\x6d",
    "\x6c\x6f\x6a\x61\x72\x70\x67",
    "\x6d\x65\x6e\x75\x72\x70\x67",
    "\x6d\x69\x73\x73\x61\x6f",
    "\x6d\x69\x73\x73\x6f\x65\x73",
    "\x70\x65\x72\x66\x69\x6c\x72\x70\x67",
    "\x72\x61\x6e\x6b\x72\x70\x67",
    "\x72\x65\x67\x69\x6f\x65\x73",
    "\x72\x70\x67",
    "\x72\x70\x67\x61\x6a\x75\x64\x61",
    "\x72\x70\x67\x61\x74\x61\x63\x61\x72",
    "\x72\x70\x67\x61\x74\x72\x69\x62\x75\x74\x6f",
    "\x72\x70\x67\x63\x6c\x61\x73\x73\x65",
    "\x72\x70\x67\x63\x6c\x61\x73\x73\x65\x69\x6e\x66\x6f",
    "\x72\x70\x67\x63\x6c\x61\x73\x73\x65\x73",
    "\x72\x70\x67\x63\x6f\x6d\x61\x6e\x64\x6f\x73",
    "\x72\x70\x67\x63\x6f\x6d\x70\x72\x61\x72",
    "\x72\x70\x67\x63\x72\x69\x61\x72",
    "\x72\x70\x67\x64\x65\x66\x65\x6e\x64\x65\x72",
    "\x72\x70\x67\x64\x65\x73\x63\x61\x6e\x73\x61\x72",
    "\x72\x70\x67\x64\x65\x73\x65\x71\x75\x69\x70\x61\x72",
    "\x72\x70\x67\x64\x72\x61\x67\x61\x6f",
    "\x72\x70\x67\x65\x71\x75\x69\x70\x61\x6d\x65\x6e\x74\x6f\x73",
    "\x72\x70\x67\x65\x71\x75\x69\x70\x61\x72",
    "\x72\x70\x67\x66\x61\x63\x63\x61\x6f",
    "\x72\x70\x67\x66\x75\x67\x69\x72",
    "\x72\x70\x67\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65",
    "\x72\x70\x67\x68\x61\x62\x69\x6c\x69\x64\x61\x64\x65\x73",
    "\x72\x70\x67\x69\x6e\x76\x65\x6e\x74\x61\x72\x69\x6f",
    "\x72\x70\x67\x69\x74\x65\x6d",
    "\x72\x70\x67\x6c\x6f\x6a\x61",
    "\x72\x70\x67\x6d\x69\x73\x73\x61\x6f",
    "\x72\x70\x67\x6d\x69\x73\x73\x6f\x65\x73",
    "\x72\x70\x67\x70\x65\x72\x66\x69\x6c",
    "\x72\x70\x67\x72\x61\x6e\x6b",
    "\x72\x70\x67\x72\x65\x67\x69\x6f\x65\x73",
    "\x73\x6b\x69\x6c\x6c\x64\x72\x61\x67\x61\x6f",
    "\x73\x6b\x69\x6c\x6c\x73\x72\x70\x67",
    "\x73\x74\x61\x74\x75\x73\x64\x65\x73\x70\x65\x72\x74\x61\x72",
    "\x74\x72\x61\x6e\x73\x66\x6f\x72\x6d\x61\x72",
    "\x7a\x65\x72\x61\x72\x72\x70\x67",
    "\x7a\x65\x72\x61\x72\x72\x70\x67\x67"
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

  // Se o Dragon RPG estiver ligado, ele recebe primeiro os aliases compartilhados.
  // Assim o RPG clássico não consegue responder ao mesmo comando.
  const skipModularForDragonRpg = dragonRpgModeEnabled && dragonRpgOwnsCommand;

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
    command === "\x64\x72\x61\x67\x6f\x6e\x72\x70\x67" &&
    ["on","\x6f\x66\x66","\x61\x74\x69\x76\x61\x72","\x64\x65\x73\x61\x74\x69\x76\x61\x72","\x6c\x69\x67\x61\x72","\x64\x65\x73\x6c\x69\x67\x61\x72","1","0"].includes(String(args?.[0] || "").toLowerCase());

  if (dragonRpgOwnsCommand && !dragonRpgModeEnabled && !dragonRpgInlineModeArg) {
    continue;
  }

switch (command) {

// ==========================================
// 🏷️🐉 KOBAYASHI RENTAL SYSTEM • v0.8.5
// Inspirado no fluxo de aluguel/ativação do Kobayashi,
// refeito para a arquitetura e banco do Kobayashi.
// ==========================================
case "\x70\x6c\x61\x6e\x6f\x73":
case "\x70\x6c\x61\x6e\x73": {
  const plans = listRentalPlans();
  const caption =
    `╭━━〔 🏷️🐉 *KOBAYASHI • PLANOS* 〕━━╮\n` +
    plans.map((p) => `┃ *${p.id}.* ${p.name}\n┃ 📅 ${p.days} dias • 💰 R$ ${p.price.toFixed(2).replace(".", ",")}\n┃ 🤝 Parceria: +${p.partnerBonusDays} dias`).join("\n┃\n") +
    `\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `🔎 Veja um plano: *${prefix}plano 1* até *${prefix}plano 4*\n` +
    `📩 *Contato do dono:* https://wa.me/5515997075304\n` +
    `💬 Escolha um plano para receber o link já com o plano selecionado.`;
  try {
    const planImage = fs.readFileSync(new URL("\x2e\x2f\x61\x73\x73\x65\x74\x73\x2f\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x70\x6c\x61\x6e\x6f\x73\x2e\x70\x6e\x67", import.meta.url));
    await conn.sendMessage(from, { image: planImage, caption }, { quoted: info });
    return;
  } catch {
    return reply(caption);
  }
}
break;

case "\x70\x6c\x61\x6e\x6f": {
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

case "\x61\x6c\x75\x67\x75\x65\x6c": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
  const action = String(args[0] || "").toLowerCase();
  if (!['on','\x6f\x66\x66'].includes(action)) {
    const cfg = getRentalSettings();
    return reply(
      `🏷️🐉 *ALUGUEL 2.0*\n\n` +
      `🔒 Restrição por grupo: *${cfg.groupRestrictionEnabled ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\n` +
      `🌐 Restrição global: *${cfg.globalRestrictionEnabled ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\n` +
      `⚠️ Avisos automáticos: *${cfg.warningsEnabled ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\n\n` +
      `Use *${prefix}aluguel on/off*.`
    );
  }
  const cfg = setRentalRestriction("\x67\x72\x6f\x75\x70", action === "on");
  return reply(`🏷️ Restrição de aluguel nos grupos *${cfg.groupRestrictionEnabled ? "\x41\x54\x49\x56\x41\x44\x41\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x41\x20\u274c"}*.`);
}
break;

case "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x67\x6c\x6f\x62\x61\x6c": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
  const action = String(args[0] || "").toLowerCase();
  if (!['on','\x6f\x66\x66'].includes(action)) return reply(`Use: *${prefix}aluguel_global on* ou *off*`);
  const cfg = setRentalRestriction("\x67\x6c\x6f\x62\x61\x6c", action === "on");
  return reply(`🌐🐉 Restrição global *${cfg.globalRestrictionEnabled ? "\x41\x54\x49\x56\x41\x44\x41\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x41\x20\u274c"}*.`);
}
break;

case "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x61\x76\x69\x73\x6f\x73": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
  const action = String(args[0] || "").toLowerCase();
  if (!['on','\x6f\x66\x66'].includes(action)) return reply(`Use: *${prefix}aluguel_avisos on* ou *off*`);
  const cfg = setRentalWarnings(action === "on");
  return reply(`⚠️ Avisos automáticos de vencimento *${cfg.warningsEnabled ? "\x41\x54\x49\x56\x41\x44\x4f\x53\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x53\x20\u274c"}*.`);
}
break;

case "\x72\x65\x67\x69\x73\x74\x72\x61\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c":
case "\x72\x67\x5f\x61\x6c\x75\x67\x75\x65\x6c": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
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
  if (mode !== "\x70\x6c\x61\x6e\x6f") {
    value = cleanArgs[0];
    mode = "\x74\x65\x6d\x70\x6f";
  }

  let targetName = groupName || from;
  try { targetName = (await conn.groupMetadata(from))?.subject || targetName; } catch {}

  let rental, description;
  if (mode === "\x70\x6c\x61\x6e\x6f") {
    const plan = getRentalPlan(value);
    if (!plan) return reply(`📦 Plano inválido. Use *${prefix}rg_aluguel @responsavel plano 1* até *plano 4*.`);
    rental = registerRentalByPlan(from, targetName, plan.id, sender);
    description = `📦 ${formatPlan(plan)}`;
  } else {
    const duration = parseRentalDuration(value);
    if (!duration) return reply(`⏳ Tempo inválido. Ex.: *${prefix}rg_aluguel @responsavel 30D*`);
    rental = registerRental(from, targetName, duration.ms, sender, { source:"\x6d\x61\x6e\x75\x61\x6c\x2d\x72\x65\x73\x70\x6f\x6e\x73\x69\x62\x6c\x65" });
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

case "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x70\x61\x72\x63\x65\x72\x69\x61": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x72\x65\x67\x69\x73\x74\x72\x61\x72\x20\x61\x6c\x75\x67\x75\x65\x6c\x20\x64\x65\x20\x70\x61\x72\x63\x65\x72\x69\x61\x2e");
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

case "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x74\x65\x73\x74\x65":
case "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x67\x72\x61\x74\x69\x73": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x6c\x69\x62\x65\x72\x61\x72\x20\x70\x65\x72\xed\x6f\x64\x6f\x20\x67\x72\xe1\x74\x69\x73\x2e");
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

case "\x72\x65\x6e\x6f\x76\x61\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c":
case "\x72\x65\x6e\x6f\x76\x61\x72\x5f\x61\x6c\x75\x67\x65\x6c": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x72\x65\x6e\x6f\x76\x61\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
  const targetJid = isGroup ? from : normalizeGroupJid(args[0]);
  if (!targetJid) return reply(`Use no grupo: *${prefix}renovar_aluguel plano 1* ou *${prefix}renovar_aluguel 30D*`);

  const offset = isGroup ? 0 : 1;
  const first = String(args[offset] || "").toLowerCase();
  const second = args[offset+1];
  const current = getRental(targetJid);
  if (!current.exists) return reply("\ud83c\x20\x45\x73\x73\x65\x20\x67\x72\x75\x70\x6f\x20\x61\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x61\x6c\x75\x67\x75\x65\x6c\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x2e");
  if (current.permanent) return reply("\u267e\ufe0f\x20\x45\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x61\x6c\x75\x67\x75\x65\x6c\x20\x70\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65\x2e");

  let targetName=current.rental?.groupName||targetJid;
  try { targetName=(await conn.groupMetadata(targetJid))?.subject||targetName; } catch {}

  let result, description;
  if(first==="\x70\x6c\x61\x6e\x6f"){
    const plan=getRentalPlan(second);
    if(!plan)return reply(`📦 Plano inválido. Use *${prefix}renovar_aluguel plano 1* até *plano 4*.`);
    result=renewRentalByPlan(targetJid,targetName,plan.id,sender,{partner:Boolean(current.rental?.partner)});
    description=`📦 ${plan.name}`;
  }else{
    const duration=parseRentalDuration(first);
    if(!duration)return reply(`Use *${prefix}renovar_aluguel plano 1* ou *${prefix}renovar_aluguel 30D*.`);
    result=renewRental(targetJid,targetName,duration.ms,sender,{source:"\x6d\x61\x6e\x75\x61\x6c\x2d\x72\x65\x6e\x65\x77\x61\x6c"});
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

case "\x72\x6d\x5f\x61\x6c\x75\x67\x75\x65\x6c":
case "\x72\x65\x6d\x6f\x76\x65\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
  const targetJid = normalizeGroupJid(args[0]) || (isGroup ? from : null);
  if (!targetJid) return reply(`Use: *${prefix}rm_aluguel ID_DO_GRUPO*`);
  const state = getRental(targetJid);
  if (!state.exists) return reply("\ud83c\x20\x45\x73\x73\x65\x20\x67\x72\x75\x70\x6f\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x61\x6c\x75\x67\x75\x65\x6c\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x2e");
  removeRental(targetJid);
  return reply(`🗑️🐉 Aluguel removido de *${state.rental?.groupName || targetJid}*.`);
}
break;

case "\x76\x65\x72\x5f\x61\x6c\x75\x67\x75\x65\x6c":
case "\x76\x65\x72\x5f\x61\x6c\x75\x67\x65\x6c":
case "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x69\x6e\x66\x6f": {
  const requested = SoDonoPrincipal ? normalizeGroupJid(args[0]) : null;
  const targetJid = requested || (isGroup ? from : null);
  if (!targetJid) return reply(`Use: *${prefix}ver_aluguel ID_DO_GRUPO*`);
  const state = getRental(targetJid);
  if (!state.exists) return reply(`🐉 *DADOS DO ALUGUEL*\n\n🆔 ${targetJid}\n📦 Status: *Não registrado ❌*`);
  const r = state.rental;
  const status = state.permanent ? "\x50\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65\x20\u267e\ufe0f" : state.active ? "\x41\x74\x69\x76\x6f\x20\u2705" : "\x45\x78\x70\x69\x72\x61\x64\x6f\x20\u274c";
  const remaining = state.permanent ? "\x49\x6c\x69\x6d\x69\x74\x61\x64\x6f\x20\u267e\ufe0f" : formatRentalDuration(Number(r.expiresAt || 0) - Date.now());
  return reply(
    `╭━━〔 🏷️ *DADOS DO ALUGUEL* 〕━━╮\n` +
    `┃ 🏷️ Grupo: *${r.groupName || targetJid}*\n┃ 🆔 ${targetJid}\n` +
    `┃ 📦 Status: *${status}*\n┃ 🎟️ Plano: *${r.planName || (r.trial ? "\x50\x65\x72\xed\x6f\x64\x6f\x20\x67\x72\xe1\x74\x69\x73" : "\x50\x65\x72\x73\x6f\x6e\x61\x6c\x69\x7a\x61\x64\x6f")}*\n` +
    `┃ 🤝 Parceria: *${r.partner ? `Sim (+${r.bonusDays || 0}d)` : "\x4e\xe3\x6f"}*\n` +
    `┃ ⏳ Restante: *${remaining}*\n` +
    `${state.permanent ? "┃ ♾️ Expiração: *Sem limite*\n" : `┃ ⌛ Expira: *${formatRentalDate(r.expiresAt)}*\n`}` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
  );
}
break;

case "\x6c\x69\x73\x74\x61\x5f\x61\x6c\x75\x67\x75\x65\x6c":
case "\x6c\x69\x73\x74\x61\x5f\x61\x6c\x75\x67\x65\x6c": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x6c\x69\x73\x74\x61\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
  const rentals = listRentals();
  if (!rentals.length) return reply("\ud83d\x20\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x68\xe1\x20\x67\x72\x75\x70\x6f\x73\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x73\x20\x6e\x6f\x20\x73\x69\x73\x74\x65\x6d\x61\x20\x64\x65\x20\x61\x6c\x75\x67\x75\x65\x6c\x2e");
  const active = rentals.filter((x) => x.active);
  const expired = rentals.filter((x) => !x.active);
  const partners = rentals.filter((x) => x.partner && x.active);
  const lines = rentals.slice(0, 50).map((item, i) => {
    const status = item.permanent ? "♾️" : item.active ? "✅" : "❌";
    const time = item.permanent ? "\x50\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65" : item.active ? formatRentalDuration(item.remainingMs) : "\x45\x78\x70\x69\x72\x61\x64\x6f";
    return `${i + 1}. ${status} *${item.groupName || "\x47\x72\x75\x70\x6f"}*${item.partner ? "\x20\ud83e" : ""}\n   🆔 ${item.groupJid}\n   🎟️ ${item.planName || (item.trial ? "\x47\x72\xe1\x74\x69\x73" : "\x50\x65\x72\x73\x6f\x6e\x61\x6c\x69\x7a\x61\x64\x6f")} • ⏳ ${time}`;
  }).join("\n\n");
  return reply(
    `╭━━〔 📋 *ALUGUÉIS 2.0* 〕━━╮\n┃ ✅ Ativos: *${active.length}*\n┃ 🤝 Parcerias: *${partners.length}*\n┃ ❌ Expirados: *${expired.length}*\n┃ 📦 Total: *${rentals.length}*\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n${lines}`
  );
}
break;

case "\x61\x6c\x75\x67\x75\x65\x6c\x5f\x70\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65":
case "\x61\x6c\x75\x67\x65\x6c\x5f\x70\x65\x72\x6d\x61\x6e\x65\x6e\x74\x65": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x61\x6c\x75\x67\x75\xe9\x69\x73\x2e");
  const targetJid = normalizeGroupJid(args[0]) || (isGroup ? from : null);
  if (!targetJid) return reply(`Use: *${prefix}aluguel_permanente ID_DO_GRUPO*`);
  let targetName = targetJid === from ? groupName : targetJid;
  try { targetName = (await conn.groupMetadata(targetJid))?.subject || targetName; } catch {}
  const rental = setPermanentRental(targetJid, targetName, sender);
  return reply(`♾️🐉 *ALUGUEL PERMANENTE ATIVADO*\n\n🏷️ ${targetName}\n🆔 ${targetJid}\n📅 ${formatRentalDate(rental.permanentSince || rental.rentedAt)}`);
}
break;


case "\x62\x61\x6e\x5f\x6d\x73\x67":
case "\x62\x61\x6e\x6d\x73\x67": {
  if (!SoDonoPrincipal) {
    return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x6f\x20\x2a\x42\x41\x4e\x20\x4d\x53\x47\x20\x47\x6c\x6f\x62\x61\x6c\x2a\x2e");
  }

  const action = String(args?.[0] || "").trim().toLowerCase();

  if (!action) {
    return reply(
      `🚨🐉 *BAN MSG GLOBAL*\n\n` +
      `Registra textos proibidos. Quando alguém enviar uma frase cadastrada:\n` +
      `• entra na *Lista Negra Global*;\n` +
      `• é removido do grupo;\n` +
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

  if (["on","\x6f\x66\x66"].includes(action)) {
    const enabled = setBanMessageEnabled(action === "on");
    return reply(
      `🚨 *BAN MSG Global:* ${enabled ? "\x41\x54\x49\x56\x41\x44\x4f\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x20\u26d4"}`
    );
  }

  if (["\x6c\x69\x73\x74","\x6c\x69\x73\x74\x61","\x76\x65\x72"].includes(action)) {
    const cfg = getBanMessageConfig();
    const entries = listBanMessages();
    if (!entries.length) {
      return reply(
        `🚨🐉 *BAN MSG GLOBAL*\n\n` +
        `Status: *${cfg.enabled ? "\x41\x54\x49\x56\x4f\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x20\u26d4"}*\n` +
        `📦 Nenhum texto registrado.`
      );
    }

    const lines = entries.slice(0, 100).map((entry, i) =>
      `${i + 1}. ${entry.text}`
    ).join("\n");

    return reply(
      `🚨🐉 *BAN MSG GLOBAL*\n\n` +
      `Status: *${cfg.enabled ? "\x41\x54\x49\x56\x4f\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x20\u26d4"}*\n` +
      `📦 Textos: *${entries.length}*\n\n${lines}\n\n` +
      `Para remover: *${prefix}ban_msg del número*`
    );
  }

  if (["\x64\x65\x6c","rm","\x72\x65\x6d\x6f\x76\x65","\x72\x65\x6d\x6f\x76\x65\x72"].includes(action)) {
    const query = args.slice(1).join(" ").trim();
    if (!query) return reply(`Use: *${prefix}ban_msg del 1* ou responda com o texto cadastrado.`);

    const result = removeBanMessage(query);
    if (!result.ok) return reply("\u274c\x20\x4e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x65\x69\x20\x65\x73\x73\x65\x20\x74\x65\x78\x74\x6f\x20\x6e\x6f\x20\x42\x41\x4e\x20\x4d\x53\x47\x2e");

    return reply(`✅ Texto removido do BAN MSG:\n\n*${result.entry.text}*`);
  }

  const textToAdd = action === "\x61\x64\x64"
    ? args.slice(1).join(" ").trim()
    : args.join(" ").trim();

  if (!textToAdd) {
    return reply(`Use: *${prefix}ban_msg texto proibido*`);
  }

  const result = addBanMessage(textToAdd, sender);
  if (!result.ok && result.reason === "\x65\x78\x69\x73\x74\x73") {
    return reply(`ℹ️ Esse texto já está registrado no BAN MSG:\n\n*${result.entry.text}*`);
  }
  if (!result.ok) {
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x72\x65\x67\x69\x73\x74\x72\x61\x72\x20\x65\x73\x73\x65\x20\x74\x65\x78\x74\x6f\x2e");
  }

  return reply(
    `✅🚨 *BAN MSG REGISTRADO*\n\n` +
    `📝 Texto: *${result.entry.text}*\n` +
    `🌐 Alcance: *GLOBAL*\n\n` +
    `Quem enviar esse texto será colocado automaticamente na *Lista Negra Global* e removido dos grupos onde a Kobayashi conseguir agir.`
  );
}
break;

case "\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67":
case "\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x67":
case "\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67\x6c\x6f\x62\x61\x6c": {
  if (!SoDonoPrincipal) {
    return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x61\x20\x6c\x69\x73\x74\x61\x20\x6e\x65\x67\x72\x61\x20\x67\x6c\x6f\x62\x61\x6c\x2e");
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
    return reply("\ud83d\ufe0f\x20\x4f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x20\x73\x65\x72\x20\x63\x6f\x6c\x6f\x63\x61\x64\x6f\x20\x6e\x61\x20\x6c\x69\x73\x74\x61\x20\x6e\x65\x67\x72\x61\x20\x67\x6c\x6f\x62\x61\x6c\x2e");
  }

  const existing = getGlobalBlacklistEntry(target);

  if (!existing) {
    addGlobalBlacklist(target, {
      reason: "\x41\x64\x69\x63\x69\x6f\x6e\x61\x64\x6f\x20\x6d\x61\x6e\x75\x61\x6c\x6d\x65\x6e\x74\x65\x20\x70\x65\x6c\x6f\x20\x64\x6f\x6e\x6f",
      by: sender
    });
  }

  // Sempre vasculha novamente todos os grupos. Assim /listanegrag também
  // funciona como uma varredura manual para alguém já cadastrado.
  const purge = await purgeUserFromAdminGroups(conn, target, {
    announce:true,
    source:"\x4c\x69\x73\x74\x61\x20\x4e\x65\x67\x72\x61\x20\x47\x6c\x6f\x62\x61\x6c"
  });

  return conn.sendMessage(from, {
    text:
      `🖤🌐 *LISTA NEGRA GLOBAL*\n\n` +
      `👤 @${target.split("@")[0]} ${existing ? "\x6a\xe1\x20\x65\x73\x74\x61\x76\x61\x20\x63\x61\x64\x61\x73\x74\x72\x61\x64\x6f\x20\x65\x20\x66\x6f\x69\x20\x76\x61\x73\x63\x75\x6c\x68\x61\x64\x6f\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x2e" : "\x66\x6f\x69\x20\x61\x64\x69\x63\x69\x6f\x6e\x61\x64\x6f\x2e"}\n` +
      `🔎 Grupos verificados: *${purge.checked}*\n` +
      `🛡️ Onde a Kobayashi é ADM: *${purge.adminGroups}*\n` +
      `👤 Encontrado em: *${purge.found}*\n` +
      `🔨 Removido de: *${purge.removed}*\n` +
      `❌ Falhas: *${purge.failures}*\n` +
      `🚪 Se entrar novamente em qualquer grupo monitorado, será removido automaticamente.\n` +
      `🚫 A Kobayashi também continuará ignorando esse número no PV.`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "\x72\x6d\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67":
case "\x72\x6d\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x67":
case "\x72\x65\x6d\x6f\x76\x65\x72\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61\x67": {
  if (!SoDonoPrincipal) {
    return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x67\x65\x72\x65\x6e\x63\x69\x61\x72\x20\x61\x20\x6c\x69\x73\x74\x61\x20\x6e\x65\x67\x72\x61\x20\x67\x6c\x6f\x62\x61\x6c\x2e");
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

case "\x6c\x69\x73\x74\x61\x62\x72\x61\x6e\x63\x61":
case "\x77\x68\x69\x74\x65\x6c\x69\x73\x74": {
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

  if (!["\x61\x64\x64","\x61\x64\x69\x63\x69\x6f\x6e\x61\x72","+","\x64\x65\x6c","\x72\x65\x6d\x6f\x76\x65\x72","\x72\x65\x6d\x6f\x76\x65","-"].includes(rawAction)) {
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

  if (["\x61\x64\x64","\x61\x64\x69\x63\x69\x6f\x6e\x61\x72","+"].includes(rawAction)) {
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
case "\x61\x6e\x74\x69\x6c\x69\x6e\x6b":
case "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x67\x70":
case "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x6c\x69\x67\x68\x74":
case "\x61\x6e\x74\x69\x74\x65\x6c\x65\x67\x72\x61\x6d": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const modeMap = {
    antilink: {
      key: "\x61\x6e\x74\x69\x6c\x69\x6e\x6b",
      title: "\x41\x4e\x54\x49\x4c\x49\x4e\x4b",
      description: "\x71\x75\x61\x6c\x71\x75\x65\x72\x20\x74\x69\x70\x6f\x20\x64\x65\x20\x6c\x69\x6e\x6b",
      icon: "🚫",
      punishment: "\x61\x70\x61\x67\x61\x20\x6f\x20\x6c\x69\x6e\x6b\x20\x65\x20\x72\x65\x6d\x6f\x76\x65\x20\x6f\x20\x6d\x65\x6d\x62\x72\x6f"
    },
    antilinkgp: {
      key: "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x67\x70",
      title: "\x41\x4e\x54\x49\x4c\x49\x4e\x4b\x20\x47\x50",
      description: "\x6c\x69\x6e\x6b\x73\x20\x64\x65\x20\x67\x72\x75\x70\x6f\x73\x2f\x63\x61\x6e\x61\x69\x73\x20\x64\x6f\x20\x57\x68\x61\x74\x73\x41\x70\x70",
      icon: "🔗",
      punishment: "\x61\x70\x61\x67\x61\x20\x6f\x20\x6c\x69\x6e\x6b\x20\x65\x20\x72\x65\x6d\x6f\x76\x65\x20\x6f\x20\x6d\x65\x6d\x62\x72\x6f"
    },
    antilinklight: {
      key: "\x61\x6e\x74\x69\x6c\x69\x6e\x6b\x6c\x69\x67\x68\x74",
      title: "\x41\x4e\x54\x49\x4c\x49\x4e\x4b\x20\x4c\x49\x47\x48\x54",
      description: "\x71\x75\x61\x6c\x71\x75\x65\x72\x20\x74\x69\x70\x6f\x20\x64\x65\x20\x6c\x69\x6e\x6b",
      icon: "⚠️",
      punishment: "\x61\x70\x61\x67\x61\x20\x6f\x20\x6c\x69\x6e\x6b\x20\x65\x20\x61\x70\x6c\x69\x63\x61\x20\x31\x20\x61\x64\x76\x65\x72\x74\xea\x6e\x63\x69\x61"
    },
    antitelegram: {
      key: "\x61\x6e\x74\x69\x74\x65\x6c\x65\x67\x72\x61\x6d",
      title: "\x41\x4e\x54\x49\x54\x45\x4c\x45\x47\x52\x41\x4d",
      description: "\x6c\x69\x6e\x6b\x73\x20\x64\x6f\x20\x54\x65\x6c\x65\x67\x72\x61\x6d",
      icon: "✈️",
      punishment: "\x61\x70\x61\x67\x61\x20\x6f\x20\x6c\x69\x6e\x6b\x20\x65\x20\x72\x65\x6d\x6f\x76\x65\x20\x6f\x20\x6d\x65\x6d\x62\x72\x6f"
    },
  };

  const mode = modeMap[command];
  const enabled = toggleGroupProtection(from, mode.key);

  addAdminLog(from, {
    type: mode.key,
    actor: sender,
    detail: enabled ? "\x50\x72\x6f\x74\x65\xe7\xe3\x6f\x20\x61\x74\x69\x76\x61\x64\x61" : "\x50\x72\x6f\x74\x65\xe7\xe3\x6f\x20\x64\x65\x73\x61\x74\x69\x76\x61\x64\x61",
  });

  return reply(
    `╭──────「 ${mode.icon} 」──────╮\n` +
    `       *${mode.title}*\n` +
    `╰──────────────────╯\n\n` +
    `${enabled ? "\ud83d\x20\x2a\x41\x54\x49\x56\x41\x44\x4f\x2a" : "\ud83d\x20\x2a\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x2a"}\n\n` +
    `🔎 Detecta: ${mode.description}\n` +
    `🛡️ Ação: ${mode.punishment}\n\n` +
    `🌸 Administradores e líderes não são afetados.\n` +
    `↳ Use *${prefix}${command}* novamente para alternar.`
  );
}
break;

case "\x73\x75\x69\x63\x69\x64\x69\x6f":
case "\x73\x75\x69\x63\xed\x64\x69\x6f": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  if (SoDonoPrincipal || SoLider) {
    return reply("\ud83d\ud83c\x20\x44\x6f\x6e\x6f\x73\x20\x65\x20\x6c\xed\x64\x65\x72\x65\x73\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x6d\x20\x75\x73\x61\x72\x20\x65\x73\x73\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x70\x61\x72\x61\x20\x73\x61\x69\x72\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e");
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
    await conn.groupParticipantsUpdate(from, [sender], "\x72\x65\x6d\x6f\x76\x65");
    return;
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x6e\x6f\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x73\x75\x69\x63\x69\x64\x69\x6f\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x76\x6f\x63\xea\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e");
  }
}
break;

case "\x62\x61\x6d": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const target = getTargetFromMessage(info, menc_os2);
  if (!target || target === from) {
    return reply(`🐉🌸 Marque um membro ou responda à mensagem dele para usar *${prefix}bam*.`);
  }

  if (target === botNumber) return reply("\ud83c\x20\x45\x75\x20\x6a\xe1\x20\x63\x6f\x6e\x68\x65\xe7\x6f\x20\x65\x73\x73\x65\x20\x74\x72\x75\x71\x75\x65\x2e");
  if (target === dono) return reply("\ud83d\x20\x4d\x65\x6c\x68\x6f\x72\x20\x6e\xe3\x6f\x20\x74\x65\x6e\x74\x61\x72\x20\x61\x73\x73\x75\x73\x74\x61\x72\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x64\x61\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x2e");

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
      console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x63\x6f\x6e\x63\x6c\x75\x69\x72\x20\x42\x41\x4d\x3a", e?.message || e);
    }
  }, 10000);

  return;
}
break;
//




case "\x73\x74\x61\x74\x75\x73\x62\x76":
case "\x64\x65\x62\x75\x67\x62\x76": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const cfg = getWelcomeConfig(from);

  return reply(
    `╭──────「 🌸 」──────╮\n` +
    `    *STATUS WELCOME*\n` +
    `╰──────────────────╯\n\n` +
    `🏠 Grupo: ${from}\n` +
    `📢 Status: ${cfg.enabled ? "\ud83d\x20\x41\x54\x49\x56\x41\x44\x4f" : "\ud83d\x20\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f"}\n` +
    `⏱️ Tempo: ${cfg.delaySeconds}s\n` +
    `🔌 Handler Kobayashi: ${typeof conn.kobayashiHandleGroupParticipantsUpdate === "\x66\x75\x6e\x63\x74\x69\x6f\x6e" ? "\u2705\x20\x4f\x4b" : "\u274c\x20\x41\x55\x53\x45\x4e\x54\x45"}\n\n` +
    `🧪 Use *${prefix}testebv* para testar o texto.`
  );
}
break;

case "\x62\x65\x6d\x76\x69\x6e\x64\x6f":
case "\x62\x6f\x61\x73\x76\x69\x6e\x64\x61\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const op=String(args[0]||"").toLowerCase(); const cfg=getWelcomeConfig(from);
  if(!["on","\x6f\x66\x66"].includes(op)) return reply(`🌸 *WELCOME PRO*\n\nStatus: ${cfg.enabled?"\ud83d\x20\x41\x74\x69\x76\x61\x64\x6f":"\ud83d\x20\x44\x65\x73\x61\x74\x69\x76\x61\x64\x6f"}\n⏱️ Agrupamento: *${cfg.delaySeconds}s*\n\n🟢 ${prefix}bemvindo on\n🔒 ${prefix}bemvindo off\n📝 ${prefix}setbv texto\n📖 ${prefix}setregrasbv texto\n🤝 ${prefix}setparceriasbv texto\n👋 ${prefix}setbye texto\n⏱️ ${prefix}tempobv 15\n🧪 ${prefix}testebv\n\nVariáveis: {user} {group} {count} {membros} {quantidade} {adm} {rejeitados}`);
  updateWelcomeConfig(from,{enabled:op==="on"});
  return reply(op==="on"?"\ud83c\ud83d\x20\x57\x65\x6c\x63\x6f\x6d\x65\x20\x50\x72\x6f\x20\x61\x74\x69\x76\x61\x64\x6f\x21":"\ud83d\ud83c\x20\x57\x65\x6c\x63\x6f\x6d\x65\x20\x50\x72\x6f\x20\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x2e");
}
break;

case "\x73\x65\x74\x62\x76": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if(!q.trim()) return reply(`📝 Use: *${prefix}setbv sua mensagem*`);
  updateWelcomeConfig(from,{welcome:q.trim()}); return reply("\u2705\ud83c\x20\x54\x65\x78\x74\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x64\x6f\x2e");
}
break;

case "\x73\x65\x74\x72\x65\x67\x72\x61\x73\x62\x76":
case "\x72\x65\x67\x72\x61\x73\x62\x76": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if(!q.trim()) return reply(`📖 Use: *${prefix}setregrasbv suas regras*`);
  updateWelcomeConfig(from,{rules:q.trim()}); return reply("\u2705\ud83d\x20\x52\x65\x67\x72\x61\x73\x20\x64\x61\x20\x72\x65\x63\x65\x70\xe7\xe3\x6f\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x64\x61\x73\x2e");
}
break;


case "\x72\x6d\x70\x61\x72\x63\x65\x72\x69\x61\x62\x76":
case "\x72\x6d\x70\x61\x72\x63\x65\x72\x69\x61\x62\x76":
case "\x72\x65\x6d\x6f\x76\x65\x72\x70\x61\x72\x63\x65\x72\x69\x61\x62\x76": {
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

case "\x73\x65\x74\x70\x61\x72\x63\x65\x72\x69\x61\x73\x62\x76":
case "\x70\x61\x72\x63\x65\x72\x69\x61\x73\x62\x76": {
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
    atuais === "\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x61\x20\x70\x61\x72\x63\x65\x72\x69\x61\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61\x2e"
  ) {
    atuais = "";
  }

  // Evita cadastrar exatamente o mesmo bloco duas vezes.
  const blocosAtuais = atuais
    ? atuais.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
    : [];

  if (blocosAtuais.includes(novaParceria)) {
    return reply(
      "\u26a0\ufe0f\ud83e\x20\x45\x73\x73\x61\x20\x70\x61\x72\x63\x65\x72\x69\x61\x20\x6a\xe1\x20\x65\x73\x74\xe1\x20\x63\x61\x64\x61\x73\x74\x72\x61\x64\x61\x20\x6e\x6f\x20\x57\x65\x6c\x63\x6f\x6d\x65\x20\x64\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e"
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

case "\x73\x65\x74\x62\x79\x65": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if(!q.trim()) return reply(`👋 Use: *${prefix}setbye sua mensagem*`);
  updateWelcomeConfig(from,{bye:q.trim()}); return reply("\u2705\ud83d\x20\x4d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x65\x20\x73\x61\xed\x64\x61\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x64\x61\x2e");
}
break;

case "\x74\x65\x6d\x70\x6f\x62\x76": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const seconds=Number(args[0]);
  if(!Number.isFinite(seconds)||seconds<3||seconds>120) return reply(`⏱️ Use um tempo entre *3 e 120 segundos*. Ex.: *${prefix}tempobv 15*`);
  updateWelcomeConfig(from,{delaySeconds:Math.floor(seconds)}); return reply(`✅⏱️ Entradas serão agrupadas por *${Math.floor(seconds)} segundos*.`);
}
break;

case "\x74\x65\x73\x74\x65\x62\x76": {
  if (!isGroup) return reply(mess.onlyGroup()); if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const cfg=getWelcomeConfig(from); const total=Array.isArray(groupMembers)?groupMembers.length:0;
  const membersText=`@${sender.split("@")[0]}\n> [ 1 Membro Novo 🪪 ]`;
  const preview=`${cfg.title}\n${renderWelcomeText(cfg.welcome,{groupName,count:total,membersText,quantity:1,adminJid:sender,rejected:0})}\n\n${cfg.rules}\n\n🐾 ── 𖥸 ─── ⋆ ✧ ⋆ ─── 𖥸 ── 🐾\n🧁 *Jardim de Parcerias* 🧁\n${cfg.partners}\n\n${membersText}\n\n> Aceito/Add por @${sender.split("@")[0]}\n> _E rejeitei 0 solicitações irregulares._\n\n${cfg.footer}`;
  return conn.sendMessage(from,{text:preview,mentions:[sender]},{quoted:info});
}
break;


case "\x61\x64\x64":
case "\x61\x63\x65\x69\x74\x61\x72": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) {
    return reply("\u274c\ud83d\x20\x45\x75\x20\x70\x72\x65\x63\x69\x73\x6f\x20\x73\x65\x72\x20\x2a\x41\x44\x4d\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2a\x20\x70\x61\x72\x61\x20\x61\x63\x65\x69\x74\x61\x72\x20\x73\x6f\x6c\x69\x63\x69\x74\x61\xe7\xf5\x65\x73\x2e");
  }

  try {
    const pending = await conn.groupRequestParticipantsList(from);

    if (!Array.isArray(pending) || !pending.length) {
      return reply("\ud83c\x20\x4e\xe3\x6f\x20\x68\xe1\x20\x73\x6f\x6c\x69\x63\x69\x74\x61\xe7\xf5\x65\x73\x20\x70\x65\x6e\x64\x65\x6e\x74\x65\x73\x20\x70\x61\x72\x61\x20\x65\x6e\x74\x72\x61\x72\x20\x6e\x6f\x20\x67\x72\x75\x70\x6f\x2e");
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
      return reply("\u26a0\ufe0f\x20\x4e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x65\x69\x20\x65\x73\x73\x61\x20\x70\x65\x73\x73\x6f\x61\x20\x65\x6e\x74\x72\x65\x20\x61\x73\x20\x73\x6f\x6c\x69\x63\x69\x74\x61\xe7\xf5\x65\x73\x20\x70\x65\x6e\x64\x65\x6e\x74\x65\x73\x2e");
    }

    await conn.groupRequestParticipantsUpdate(
      from,
      targets,
      "\x61\x70\x70\x72\x6f\x76\x65"
    );

    // Aguarda o WhatsApp concluir a aprovação e usa o MESMO handler do evento real.
    await delay(1800);

    if (typeof conn.kobayashiHandleGroupParticipantsUpdate === "\x66\x75\x6e\x63\x74\x69\x6f\x6e") {
      await conn.kobayashiHandleGroupParticipantsUpdate({
        id: from,
        action: "\x61\x64\x64",
        participants: targets,
        author: sender,
        source: "\x63\x6f\x6d\x6d\x61\x6e\x64\x2d\x61\x64\x64"
      });
    } else {
      console.error("\x5b\x57\x45\x4c\x43\x4f\x4d\x45\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x5d\x20\x48\x61\x6e\x64\x6c\x65\x72\x20\x6e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x6f\x20\x6e\x6f\x20\x73\x6f\x63\x6b\x65\x74\x2e");
    }

    const qtd = targets.length;

    addAdminLog(from, {
      type: "\x61\x64\x64",
      actor: sender,
      detail: `${qtd} solicitação(ões) aprovada(s)`,
    });

    return reply(
      `🌸🐉 *${qtd} ${qtd === 1 ? "\x73\x6f\x6c\x69\x63\x69\x74\x61\xe7\xe3\x6f\x20\x61\x63\x65\x69\x74\x61" : "\x73\x6f\x6c\x69\x63\x69\x74\x61\xe7\xf5\x65\x73\x20\x61\x63\x65\x69\x74\x61\x73"}!*\n\n` +
      `O sistema de boas-vindas foi acionado para os novos membros.`
    );

  } catch (error) {
    console.error("\x5b\x41\x44\x44\x20\x52\x45\x51\x55\x45\x53\x54\x53\x5d", error?.stack || error?.message || error);
    return reply(
      `❌ Não consegui aceitar as solicitações do grupo.\n\n` +
      `Confira se eu continuo como ADM e se existem solicitações pendentes.`
    );
  }
}
break;



case "\x72\x6d\x5f\x63\x6c\x6f\x73\x65\x67\x70":
case "\x72\x6d\x63\x6c\x6f\x73\x65\x67\x70": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const atual =
    readGroupScheduleDb()?.[from]?.close || null;

  if (!atual) {
    return reply(
      "\ud83c\x20\x4e\xe3\x6f\x20\x65\x78\x69\x73\x74\x65\x20\x6e\x65\x6e\x68\x75\x6d\x20\x68\x6f\x72\xe1\x72\x69\x6f\x20\x64\x65\x20\x66\x65\x63\x68\x61\x6d\x65\x6e\x74\x6f\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x6f\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x6f\x20\x6e\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e"
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

case "\x72\x6d\x5f\x6f\x70\x65\x6e\x67\x70":
case "\x72\x6d\x6f\x70\x65\x6e\x67\x70": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const atual =
    readGroupScheduleDb()?.[from]?.open || null;

  if (!atual) {
    return reply(
      "\ud83c\x20\x4e\xe3\x6f\x20\x65\x78\x69\x73\x74\x65\x20\x6e\x65\x6e\x68\x75\x6d\x20\x68\x6f\x72\xe1\x72\x69\x6f\x20\x64\x65\x20\x61\x62\x65\x72\x74\x75\x72\x61\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x61\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x6f\x20\x6e\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e"
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

case "\x6f\x70\x65\x6e\x67\x70": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const raw =
    String(args[0] || "").toLowerCase();

  if (["\x6f\x66\x66","\x72\x65\x6d\x6f\x76\x65\x72","\x72\x65\x6d\x6f\x76\x65","0"].includes(raw)) {
    updateGroupSchedule(
      from,
      { open: null }
    );

    return reply(
      "\ud83d\ud83c\x20\x48\x6f\x72\xe1\x72\x69\x6f\x20\x64\x65\x20\x61\x62\x65\x72\x74\x75\x72\x61\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x61\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f\x2e"
    );
  }

  const horario =
    normalizeClockTime(args[0]);

  if (!horario) {
    const atual =
      readGroupScheduleDb()?.[from]?.open || null;

    return reply(
      `🟢🌸 *ABERTURA AUTOMÁTICA*\n\n` +
      `Atual: ${atual ? `*${atual}*` : "\x6e\xe3\x6f\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61"}\n\n` +
      `Use:\n*${prefix}opengp 08:00*\n\n` +
      `Para remover:\n*${prefix}opengp off*`
    );
  }

  updateGroupSchedule(
    from,
    { open: horario }
  );

  addAdminLog(from, {
    type: "\x6f\x70\x65\x6e\x67\x70",
    actor: sender,
    detail: `Abertura programada para ${horario}`,
  });

  return reply(
    `✅🟢 Grupo programado para abrir todos os dias às *${horario}*.\n\n` +
    `🌸 Horário padrão: *America/Sao_Paulo*.`
  );
}
break;

case "\x63\x6c\x6f\x73\x65\x67\x70": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const raw =
    String(args[0] || "").toLowerCase();

  if (["\x6f\x66\x66","\x72\x65\x6d\x6f\x76\x65\x72","\x72\x65\x6d\x6f\x76\x65","0"].includes(raw)) {
    updateGroupSchedule(
      from,
      { close: null }
    );

    return reply(
      "\ud83d\ud83c\x20\x48\x6f\x72\xe1\x72\x69\x6f\x20\x64\x65\x20\x66\x65\x63\x68\x61\x6d\x65\x6e\x74\x6f\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x6f\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f\x2e"
    );
  }

  const horario =
    normalizeClockTime(args[0]);

  if (!horario) {
    const atual =
      readGroupScheduleDb()?.[from]?.close || null;

    return reply(
      `🔒🐉 *FECHAMENTO AUTOMÁTICO*\n\n` +
      `Atual: ${atual ? `*${atual}*` : "\x6e\xe3\x6f\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x6f"}\n\n` +
      `Use:\n*${prefix}closegp 23:00*\n\n` +
      `Para remover:\n*${prefix}closegp off*`
    );
  }

  updateGroupSchedule(
    from,
    { close: horario }
  );

  addAdminLog(from, {
    type: "\x63\x6c\x6f\x73\x65\x67\x70",
    actor: sender,
    detail: `Fechamento programado para ${horario}`,
  });

  return reply(
    `✅🔒 Grupo programado para fechar todos os dias às *${horario}*.\n\n` +
    `🌸 Horário padrão: *America/Sao_Paulo*.`
  );
}
break;

case "\x6f\x70\x65\x6e\x67\x70\x5f\x6f\x66\x66": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  updateGroupSchedule(
    from,
    { open: null }
  );

  return reply(
    "\ud83d\ud83c\x20\x48\x6f\x72\xe1\x72\x69\x6f\x20\x64\x65\x20\x61\x62\x65\x72\x74\x75\x72\x61\x20\x61\x75\x74\x6f\x6d\xe1\x74\x69\x63\x61\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f\x2e"
  );
}
break;

case "\x6c\x69\x6e\x6b\x67\x70":
case "\x6c\x69\x6e\x6b\x67\x72\x75\x70\x6f": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) {
    return reply(
      "\u274c\ud83d\x20\x45\x75\x20\x70\x72\x65\x63\x69\x73\x6f\x20\x73\x65\x72\x20\x41\x44\x4d\x20\x70\x61\x72\x61\x20\x67\x65\x72\x61\x72\x20\x6f\x20\x6c\x69\x6e\x6b\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e"
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
      "\x5b\x4c\x49\x4e\x4b\x47\x50\x5d",
      error?.message || error
    );

    return reply(
      "\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x67\x65\x72\x61\x72\x20\x6f\x20\x6c\x69\x6e\x6b\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e"
    );
  }
}
break;

case "\x6c\x65\x74\x72\x61":
case "\x6c\x79\x72\x69\x63\x73": {
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

    if (busca.includes("\x20\x2d\x20")) {
      const partes =
        busca.split("\x20\x2d\x20");

      artista =
        partes.shift()?.trim() || "";

      musica =
        partes.join("\x20\x2d\x20").trim();
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
        `🌸 Separe artista e música com "\x20\x2d\x20".\n\n` +
        `Ex.: *${prefix}letra Adele - Hello*`
      );
    }

    const url =
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(musica)}`;

    const response =
      await fetch(url);

    if (!response.ok) {
      return reply(
        "\ud83c\x20\x4e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x65\x69\x20\x61\x20\x6c\x65\x74\x72\x61\x20\x64\x65\x73\x73\x61\x20\x6d\xfa\x73\x69\x63\x61\x2e"
      );
    }

    const data =
      await response.json();

    const letra =
      String(data?.lyrics || "").trim();

    if (!letra) {
      return reply(
        "\ud83c\x20\x4e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x65\x69\x20\x61\x20\x6c\x65\x74\x72\x61\x20\x64\x65\x73\x73\x61\x20\x6d\xfa\x73\x69\x63\x61\x2e"
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
      "\x5b\x4c\x45\x54\x52\x41\x5d",
      error?.message || error
    );

    return reply(
      "\u274c\ud83c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x62\x75\x73\x63\x61\x72\x20\x61\x20\x6c\x65\x74\x72\x61\x20\x61\x67\x6f\x72\x61\x2e"
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
      await conn.groupSettingUpdate(from, "\x6e\x6f\x74\x5f\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74");
      return reply("🟢🌸 *Grupo aberto!*\n\nTodos os membros podem enviar mensagens novamente.");
    }

    await conn.groupSettingUpdate(from, "\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74");
    return reply("🔒🐉 *Grupo fechado!*\n\nSomente administradores podem enviar mensagens.");
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x6e\x6f\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x67\x70\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x61\x73\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e");
  }
}
break;

case "\x61\x75\x74\x6f\x73\x74\x69\x63\x6b\x65\x72":
case "\x61\x75\x74\x6f\x73\x74\x6b": {
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
case "\x74\x6f\x69\x6d\x67":
case "\x74\x6f\x69\x6d\x61\x67\x65": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65" ? info : null);

  if (!target?.message || getContentType(target.message) !== "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
    return reply(`🖼️ Responda a uma figurinha com *${prefix}toimg*.`);
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "\x62\x75\x66\x66\x65\x72", {});
    const sharpModule = await import("\x73\x68\x61\x72\x70");
    const sharp = sharpModule.default || sharpModule;
    const imageBuffer = await sharp(stickerBuffer).png().toBuffer();

    return conn.sendMessage(
      from,
      {
        image: imageBuffer,
        caption: "\ud83c\x20\x46\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x63\x6f\x6e\x76\x65\x72\x74\x69\x64\x61\x20\x70\x61\x72\x61\x20\x69\x6d\x61\x67\x65\x6d\x20\x70\x65\x6c\x61\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x2e"
      },
      { quoted: info }
    );
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x2f\x74\x6f\x69\x6d\x67\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x63\x6f\x6e\x76\x65\x72\x74\x65\x72\x20\x65\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x70\x61\x72\x61\x20\x69\x6d\x61\x67\x65\x6d\x2e");
  }
}
break;

case "\x74\x6f\x67\x69\x66": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65" ? info : null);

  if (!target?.message || getContentType(target.message) !== "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
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

  const tmpId = randomBytes(6).toString("\x68\x65\x78");
  const togifTempDir = path.join(os.tmpdir(), `koba-temp_togif_${tmpId}`);
  const inputWebp = path.join(togifTempDir, "\x69\x6e\x70\x75\x74\x2e\x77\x65\x62\x70");
  const outputGif = path.join(togifTempDir, "\x6f\x75\x74\x70\x75\x74\x2e\x67\x69\x66");
  const outputMp4 = path.join(togifTempDir, "\x6f\x75\x74\x70\x75\x74\x2e\x6d\x70\x34");

  try {
    fsx.mkdirSync(togifTempDir, { recursive: true });

    const stickerBuffer = await downloadMediaMessage(target, "\x62\x75\x66\x66\x65\x72", {});
    if (!stickerBuffer?.length) throw new Error("\x62\x75\x66\x66\x65\x72\x20\x64\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x76\x61\x7a\x69\x6f");

    fsx.writeFileSync(inputWebp, stickerBuffer);

    // Mesmo fluxo usado pelo Kobayashi:
    // WebP animado -> GIF via Sharp -> MP4 com gifPlayback via FFmpeg.
    const sharpModule = await import("\x73\x68\x61\x72\x70");
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
          "\x2d\x6d\x6f\x76\x66\x6c\x61\x67\x73\x20\x66\x61\x73\x74\x73\x74\x61\x72\x74",
          "\x2d\x70\x69\x78\x5f\x66\x6d\x74\x20\x79\x75\x76\x34\x32\x30\x70",
          "\x2d\x76\x66\x20\x73\x63\x61\x6c\x65\x3d\x74\x72\x75\x6e\x63\x28\x69\x77\x2f\x32\x29\x2a\x32\x3a\x74\x72\x75\x6e\x63\x28\x69\x68\x2f\x32\x29\x2a\x32"
        ])
        .toFormat("\x6d\x70\x34")
        .on("\x65\x6e\x64", resolve)
        .on("\x65\x72\x72\x6f\x72", reject)
        .save(outputMp4);
    });

    return conn.sendMessage(from, {
      video: fsx.readFileSync(outputMp4),
      gifPlayback: true,
      mimetype: "\x76\x69\x64\x65\x6f\x2f\x6d\x70\x34",
      fileName: "\x73\x74\x69\x63\x6b\x65\x72\x2e\x67\x69\x66"
    }, {
      quoted: info
    });
  } catch (error) {
    console.error("\x45\x72\x72\x6f\x20\x2f\x74\x6f\x67\x69\x66\x3a", error?.message || error);
    return reply("\u274c\x20\x45\x72\x72\x6f\x20\x61\x6f\x20\x63\x6f\x6e\x76\x65\x72\x74\x65\x72\x20\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x61\x6e\x69\x6d\x61\x64\x61\x2e");
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

case "\x72\x65\x6e\x61\x6d\x65": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65" ? info : null);

  if (!target?.message || getContentType(target.message) !== "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
    return reply(
      `🎴 Responda a uma figurinha com:\n\n` +
      `*${prefix}rename Seu nome | Nome do pacote*\n\n` +
      `Ex.: *${prefix}rename ${pushname || "\x4f\x6e\x69\x2d\x63\x68\x61\x6e"} | Minha coleção*`
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
    const stickerBuffer = await downloadMediaMessage(target, "\x62\x75\x66\x66\x65\x72", {});
    const authorName = parts[0].slice(0, 60);
    const packName = parts.slice(1).join("\x20\x7c\x20").slice(0, 80);
    const result = await applyStickerMetadata(stickerBuffer, {
      userNick: authorName,
      packName: `🐉 ${packName}`,
      publisher: `🌸 ${authorName} • Kobayashi Bot`,
      packId: "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x72\x65\x6e\x61\x6d\x65",
      emojis: ["🐉", "🌸", "✨"]
    });
    return conn.sendMessage(from, { sticker: result }, { quoted: info });
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x2f\x72\x65\x6e\x61\x6d\x65\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x72\x65\x6e\x6f\x6d\x65\x61\x72\x20\x65\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x2e");
  }
}
break;

case "\x72\x6f\x75\x62\x61\x72":
case "\x73\x74\x65\x61\x6c": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65" ? info : null);

  if (!target?.message || getContentType(target.message) !== "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
    return reply(`🎴 Responda a uma figurinha com *${prefix}roubar*.`);
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "\x62\x75\x66\x66\x65\x72", {});
    const authorName = String(pushname || sender.split("@")[0]).trim().slice(0, 60);
    const result = await applyStickerMetadata(stickerBuffer, {
      userNick: authorName,
      packName: "\ud83d\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\u2022\x20\x4d\x69\x6e\x68\x61\x20\x43\x6f\x6c\x65\xe7\xe3\x6f",
      publisher: `🌸 ${authorName}`,
      packId: "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x72\x6f\x75\x62\x61\x72",
      emojis: ["🐉", "🌸", "💜"]
    });
    return conn.sendMessage(from, { sticker: result }, { quoted: info });
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x2f\x72\x6f\x75\x62\x61\x72\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x70\x65\x67\x61\x72\x20\x65\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x61\x67\x6f\x72\x61\x2e");
  }
}
break;

case "\x74\x61\x6b\x65": {
  const quoted = getQuotedMessage(info);
  const target = quoted?.message ? quoted : (type === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65" ? info : null);

  if (!target?.message || getContentType(target.message) !== "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
    return reply(
      `🎐 O *${prefix}take* antigo continua disponível.\n` +
      `Responda a uma figurinha com *${prefix}take Pacote | Autor*.\n\n` +
      `✨ Novo formato recomendado: *${prefix}rename Autor | Pacote*.`
    );
  }

  try {
    const stickerBuffer = await downloadMediaMessage(target, "\x62\x75\x66\x66\x65\x72", {});
    const parts = String(q || "").split("|").map((x) => x.trim());
    const packName = parts[0] || "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x50\x61\x63\x6b";
    const authorName = parts[1] || pushname || sender.split("@")[0];
    const result = await applyStickerMetadata(stickerBuffer, {
      userNick: authorName,
      packName: `🐉 ${packName}`,
      publisher: `🌸 ${authorName} • Kobayashi Bot`,
      packId: "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x74\x61\x6b\x65",
      emojis: ["🐉", "🌸"]
    });
    return conn.sendMessage(from, { sticker: result }, { quoted: info });
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x2f\x74\x61\x6b\x65\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x6f\x73\x20\x64\x61\x64\x6f\x73\x20\x64\x65\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x2e");
  }
}
break;

case "\x73\x65\x74\x63\x6d\x64":
case "\x72\x67\x63\x6d\x64": {
  if (!isGroup || !groupAdmins.includes(sender)) {
    return reply("\ud83d\ufe0f\x20\x41\x70\x65\x6e\x61\x73\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72\x65\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x70\x6f\x64\x65\x6d\x20\x61\x73\x73\x6f\x63\x69\x61\x72\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x73\x2e");
  }

  const quoted = getQuotedMessage(info);
  if (!quoted?.message || getContentType(quoted.message) !== "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
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
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x69\x64\x65\x6e\x74\x69\x66\x69\x63\x61\x72\x20\x65\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x2e");
  }

  return reply(
    `✅🎴 *COMANDO NA FIGURINHA*\n\n` +
    `Essa figurinha agora executa:\n*${normalized}*\n\n` +
    `🐉 Basta enviá-la no chat.`
  );
}
break;

case "\x64\x65\x6c\x63\x6d\x64": {
  if (!isGroup || !groupAdmins.includes(sender)) {
    return reply("\ud83d\ufe0f\x20\x41\x70\x65\x6e\x61\x73\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72\x65\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x70\x6f\x64\x65\x6d\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x64\x65\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x73\x2e");
  }

  const quoted = getQuotedMessage(info);
  if (!quoted?.message || getContentType(quoted.message) !== "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
    return reply(`🎴 Responda à figurinha com *${prefix}delcmd*.`);
  }

  if (!removeStickerMappedCommand(quoted.message)) {
    return reply("\ud83c\x20\x45\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x61\x73\x73\x6f\x63\x69\x61\x64\x6f\x2e");
  }

  return reply("\u2705\ud83c\x20\x43\x6f\x6d\x61\x6e\x64\x6f\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f\x20\x64\x65\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x2e");
}
break;

case "\x72\x67\x66\x69\x67\x75": {
  if (!SoDonoPrincipal) {
    return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x72\x20\x6f\x20\x2f\x72\x67\x66\x69\x67\x75\x2e");
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
      "\x2a\x2f\x72\x67\x66\x69\x67\x75\x20\x6d\x65\x6e\x75\x2a"
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
      "\x45\x78\x65\x6d\x70\x6c\x6f\x3a\x20\x2a\x2f\x72\x67\x66\x69\x67\x75\x20\x62\x61\x6e\x2a"
    );
  }

  const result = setStickerMappedCommand(quotedMessage, selectedCommand);

  if (result === false) {
    return reply("\u26a0\ufe0f\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x76\x69\x6e\x63\x75\x6c\x61\x72\x20\x65\x73\x73\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x2e\x20\x54\x65\x6e\x74\x65\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x2e");
  }

  return reply(
    `🎴🐉 *Figurinha configurada!*\n\n` +
    `Ela agora executa: */${selectedCommand}*` +
    (["\x62\x61\x6e","\x62\x61\x6e\x63","\x6b\x6f\x62\x61\x62\x61\x6e","\x6b\x6f\x62\x61\x6e","\x61\x64\x76","\x72\x6d\x61\x64\x76"].includes(selectedCommand)
      ? `\n\n↩️ Para usar em alguém, envie essa figurinha *respondendo a mensagem do membro*.`
      : "")
  );
}
break;

case "\x6c\x69\x73\x74\x63\x6d\x64\x73\x74\x69\x63\x6b\x65\x72":
case "\x73\x74\x69\x63\x6b\x65\x72\x63\x6d\x64\x73": {
  if (!isGroup || !groupAdmins.includes(sender)) {
    return reply("\ud83d\ufe0f\x20\x41\x70\x65\x6e\x61\x73\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72\x65\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x70\x6f\x64\x65\x6d\x20\x63\x6f\x6e\x73\x75\x6c\x74\x61\x72\x20\x65\x73\x73\x61\x20\x6c\x69\x73\x74\x61\x2e");
  }

  const db = listStickerMappedCommands();
  const entries = Object.entries(db);

  if (!entries.length) {
    return reply("\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x61\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x20\x63\x6f\x6d\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x66\x6f\x69\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61\x20\x61\x69\x6e\x64\x61\x2e");
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


case "\x68\x65\x6c\x70\x63\x6d\x64":
case "\x61\x6a\x75\x64\x61\x63\x6d\x64": {
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

case "\x70\x6c\x61\x79": {
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

    if (!yutaToken || yutaToken === "\x43\x4f\x4c\x4f\x51\x55\x45\x5f\x53\x45\x55\x5f\x54\x4f\x4b\x45\x4e\x5f\x59\x55\x54\x41\x5f\x41\x51\x55\x49") {
      return reply(
        `🎧🌸 *PLAY NÃO CONFIGURADO*\n\n` +
        `O serviço de música ainda não foi configurado pelo dono do bot.\n\n` +
        `👑 Dono: use *${prefix}yutatoken TOKEN* para ativar o Play.`
      );
    }

    const ytsModule = await import("\x79\x74\x2d\x73\x65\x61\x72\x63\x68");
    const yts = ytsModule.default || ytsModule;

    const isUrl = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/i.test(query);
    let video = null;

    if (isUrl) {
      let videoId = null;
      try {
        const u = new URL(query);
        if (u.hostname.includes("\x79\x6f\x75\x74\x75\x2e\x62\x65")) {
          videoId = u.pathname.split("/").filter(Boolean)[0];
        } else if (u.pathname.includes("\x2f\x73\x68\x6f\x72\x74\x73\x2f")) {
          videoId = u.pathname.split("\x2f\x73\x68\x6f\x72\x74\x73\x2f")[1]?.split(/[?&/]/)[0];
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
      return reply("\ud83c\x20\x4e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x65\x69\x20\x65\x73\x73\x61\x20\x6d\xfa\x73\x69\x63\x61\x20\x6e\x6f\x20\x59\x6f\x75\x54\x75\x62\x65\x2e");
    }

    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption:
        `╭──────「 🎧 」──────╮\n` +
        `    *KOBAYASHI PLAY*\n` +
        `╰──────────────────╯\n\n` +
        `🎵 *${video.title || "\x4d\xfa\x73\x69\x63\x61"}*\n` +
        `🎙️ Canal: ${video.author?.name || video.author || "\x44\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f"}\n` +
        `⏱️ Duração: ${video.timestamp || "—"}\n` +
        `🔗 ${video.url}\n\n` +
        `🌸 Preparando seu áudio...`
    }, { quoted: info });

    // Rota de áudio usada pelo sistema do Kobayashi V10.
    const apiUrl =
      `https://yuta-apis.xyz/api/downloads/ytaudio2?url=${encodeURIComponent(video.url)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "\x41\x75\x74\x68\x6f\x72\x69\x7a\x61\x74\x69\x6f\x6e": yutaToken,
        "\x78\x2d\x79\x75\x74\x61\x2d\x63\x6c\x69\x65\x6e\x74": "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x42\x6f\x74\x2d\x4d\x44",
        "\x78\x2d\x79\x75\x74\x61\x2d\x61\x70\x69\x6b\x65\x79": "\x6c\x6d\x6f\x6e\x6c\x79\x5f\x39\x32\x38\x34\x38\x4f\x6c\x66\x51\x6d\x43\x6e\x38\x33\x36\x42\x35\x33\x4f\x53\x52\x31\x6d\x45\x6b\x37\x58\x37\x6e\x38\x6f\x36\x33\x6c\x38",
        "\x41\x63\x63\x65\x70\x74": "\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e"
      }
    });

    if (!response.ok) {
      let detail = "";
      try { detail = await response.text(); } catch {}
      throw new Error(`Yuta API HTTP ${response.status}: ${detail.slice(0,200)}`);
    }

    const contentType = String(response.headers.get("\x63\x6f\x6e\x74\x65\x6e\x74\x2d\x74\x79\x70\x65") || "").toLowerCase();
    const buffer = Buffer.from(await response.arrayBuffer());

    // O endpoint do Kobayashi retorna o áudio diretamente.
    // Se a API devolver JSON de erro, mostramos uma mensagem mais clara.
    if (contentType.includes("\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e")) {
      let apiData = null;
      try { apiData = JSON.parse(buffer.toString("\x75\x74\x66\x38")); } catch {}

      if (apiData) {
        const possibleUrl =
          apiData?.url ||
          apiData?.audio ||
          apiData?.result?.url ||
          apiData?.result?.audio ||
          apiData?.data?.url ||
          apiData?.data?.audio;

        if (typeof possibleUrl === "\x73\x74\x72\x69\x6e\x67" && /^https?:\/\//i.test(possibleUrl)) {
          const mediaRes = await fetch(possibleUrl);
          if (!mediaRes.ok) throw new Error(`Falha ao baixar áudio retornado pela API: ${mediaRes.status}`);
          const audioBuffer = Buffer.from(await mediaRes.arrayBuffer());

          await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "\x61\x75\x64\x69\x6f\x2f\x6d\x70\x65\x67",
            fileName: `${String(video.title || "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x50\x6c\x61\x79").replace(/[\\/:*?"<>|]/g, "").slice(0,80)}.mp3`
          }, { quoted: info });

          await reagir("🌸");
          break;
        }

        const apiMessage =
          apiData?.message ||
          apiData?.msg ||
          apiData?.error ||
          "\x41\x20\x41\x50\x49\x20\x6e\xe3\x6f\x20\x72\x65\x74\x6f\x72\x6e\x6f\x75\x20\x75\x6d\x20\xe1\x75\x64\x69\x6f\x20\x76\xe1\x6c\x69\x64\x6f\x2e";

        throw new Error(String(apiMessage));
      }
    }

    if (!buffer.length) throw new Error("\x41\x20\x59\x75\x74\x61\x20\x41\x50\x49\x20\x72\x65\x74\x6f\x72\x6e\x6f\x75\x20\x75\x6d\x20\x61\x72\x71\x75\x69\x76\x6f\x20\x76\x61\x7a\x69\x6f\x2e");

    await conn.sendMessage(from, {
      audio: buffer,
      mimetype: contentType.includes("\x61\x75\x64\x69\x6f\x2f") ? contentType.split(";")[0] : "\x61\x75\x64\x69\x6f\x2f\x6d\x70\x65\x67",
      fileName: `${String(video.title || "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x50\x6c\x61\x79").replace(/[\\/:*?"<>|]/g, "").slice(0,80)}.mp3`
    }, { quoted: info });

    await reagir("🌸");
  } catch (e) {
    console.error("\x5b\x50\x4c\x41\x59\x5d\x20\x45\x72\x72\x6f\x20\x61\x6f\x20\x70\x72\x65\x70\x61\x72\x61\x72\x20\xe1\x75\x64\x69\x6f\x3a", e);
    const errorText = String(e?.message || e || "");

    if (/401|403|token|authorization|unauthorized/i.test(errorText)) {
      return reply("\ud83d\u274c\x20\x4f\x20\x73\x65\x72\x76\x69\xe7\x6f\x20\x64\x65\x20\x6d\xfa\x73\x69\x63\x61\x20\x72\x65\x63\x75\x73\x6f\x75\x20\x61\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xe3\x6f\x20\x61\x74\x75\x61\x6c\x2e\x20\x4f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x65\x63\x69\x73\x61\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x72\x20\x6f\x20\x74\x6f\x6b\x65\x6e\x20\x64\x6f\x20\x50\x6c\x61\x79\x2e");
    }

    return reply(
      `❌🌸 Não consegui preparar essa música agora. Tente novamente em alguns instantes.`
    );
  }
}
break;


case "\x73\x74\x61\x74\x75\x73\x62\x6f\x74":
case "\x64\x69\x61\x67\x6e\x6f\x73\x74\x69\x63\x6f":
case "\x64\x69\x61\x67\x6e\xf3\x73\x74\x69\x63\x6f": {
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

  let version = "\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x61";
  try {
    const versionFile = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "\x76\x65\x72\x73\x69\x6f\x6e\x2e\x6a\x73\x6f\x6e"),
        "\x75\x74\x66\x38"
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
    await conn.sendPresenceUpdate("\x61\x76\x61\x69\x6c\x61\x62\x6c\x65");
  } catch {}
  const pingMs = Date.now() - startPing;

  const commandMatches = [...jsCommandSource.matchAll(/case\s+"([^"]+)":/g)];
  const commandNames = new Set(commandMatches.map((m) => m[1]));

  const checks = [];

  // Welcome
  try {
    const welcomePath = path.join(
      process.cwd(),
      "\x66\x69\x6c\x65\x73",
      "\x64\x61\x74\x61\x62\x61\x73\x65",
      "\x62\x6f\x61\x73\x2d\x76\x69\x6e\x64\x61\x73\x2e\x6a\x73\x6f\x6e"
    );
    checks.push(`🌸 Welcome: ${fs.existsSync(welcomePath) ? "\u2705\x20\x4f\x4b" : "\u26aa\x20\x73\x65\x6d\x20\x62\x61\x6e\x63\x6f"}`);
  } catch {
    checks.push("\ud83c\x20\x57\x65\x6c\x63\x6f\x6d\x65\x3a\x20\u274c\x20\x65\x72\x72\x6f");
  }

  // Horários
  try {
    const schedulePath = path.join(
      process.cwd(),
      "\x66\x69\x6c\x65\x73",
      "\x64\x61\x74\x61\x62\x61\x73\x65",
      "\x68\x6f\x72\x61\x72\x69\x6f\x73\x2d\x67\x72\x75\x70\x6f\x73\x2e\x6a\x73\x6f\x6e"
    );
    checks.push(`⏰ Horários: ${fs.existsSync(schedulePath) ? "\u2705\x20\x4f\x4b" : "\u26aa\x20\x73\x65\x6d\x20\x62\x61\x6e\x63\x6f"}`);
  } catch {
    checks.push("\u23f0\x20\x48\x6f\x72\xe1\x72\x69\x6f\x73\x3a\x20\u274c\x20\x65\x72\x72\x6f");
  }

  // Lista branca
  try {
    const whitelistPath = path.join(
      process.cwd(),
      "\x66\x69\x6c\x65\x73",
      "\x64\x61\x74\x61\x62\x61\x73\x65",
      "\x6c\x69\x73\x74\x61\x2d\x62\x72\x61\x6e\x63\x61\x2e\x6a\x73\x6f\x6e"
    );
    checks.push(`🤍 Lista Branca: ${fs.existsSync(whitelistPath) ? "\u2705\x20\x4f\x4b" : "\u26aa\x20\x73\x65\x6d\x20\x62\x61\x6e\x63\x6f"}`);
  } catch {
    checks.push("\ud83e\x20\x4c\x69\x73\x74\x61\x20\x42\x72\x61\x6e\x63\x61\x3a\x20\u274c\x20\x65\x72\x72\x6f");
  }

  // AutoSticker
  try {
    const autoStickerPath = path.join(
      process.cwd(),
      "\x66\x69\x6c\x65\x73",
      "\x64\x61\x74\x61\x62\x61\x73\x65",
      "\x61\x75\x74\x6f\x73\x74\x69\x63\x6b\x65\x72\x2e\x6a\x73\x6f\x6e"
    );
    checks.push(`🎨 AutoSticker: ${fs.existsSync(autoStickerPath) ? "\u2705\x20\x4f\x4b" : "\u26aa\x20\x73\x65\x6d\x20\x62\x61\x6e\x63\x6f"}`);
  } catch {
    checks.push("\ud83c\x20\x41\x75\x74\x6f\x53\x74\x69\x63\x6b\x65\x72\x3a\x20\u274c\x20\x65\x72\x72\x6f");
  }

  // ADV
  try {
    const advPath = path.join(
      process.cwd(),
      "\x66\x69\x6c\x65\x73",
      "\x64\x61\x74\x61\x62\x61\x73\x65",
      "\x61\x64\x76\x2e\x6a\x73\x6f\x6e"
    );
    checks.push(`⚠️ ADV: ${fs.existsSync(advPath) ? "\u2705\x20\x4f\x4b" : "\u26aa\x20\x73\x65\x6d\x20\x62\x61\x6e\x63\x6f"}`);
  } catch {
    checks.push("\u26a0\ufe0f\x20\x41\x44\x56\x3a\x20\u274c\x20\x65\x72\x72\x6f");
  }

  // Sticker Engine
  checks.push(
    `🎴 Sticker Engine: ${
      fs.existsSync(path.join(process.cwd(), "\x6c\x69\x62", "\x73\x74\x69\x63\x6b\x65\x72\x45\x6e\x67\x69\x6e\x65\x2e\x6a\x73"))
        ? "\u2705\x20\x4f\x4b"
        : "\u274c\x20\x61\x75\x73\x65\x6e\x74\x65"
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


case "\x61\x66\x6b": {
  if (!isGroup) return reply("\ud83d\ud83c\x20\x4f\x20\x41\x46\x4b\x20\x66\x75\x6e\x63\x69\x6f\x6e\x61\x20\x64\x65\x6e\x74\x72\x6f\x20\x64\x6f\x73\x20\x67\x72\x75\x70\x6f\x73\x2e");
  const reason = String(q || "").trim() || "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f";
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

case "\x6e\x69\x76\x65\x6c":
case "\x6c\x65\x76\x65\x6c":
case "xp": {
  if (!isGroup) return reply(mess.onlyGroup());

  const levelAction = String(args?.[0] || "").toLowerCase();
  if (["on", "\x6f\x66\x66"].includes(levelAction)) {
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
      `┃ ⚙️ Sistema: *${isLevelEnabled(from) ? "\x41\x54\x49\x56\x4f\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x20\ud83d"}*\n` +
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

case "\x63\x61\x74\x65\x67\x6f\x72\x69\x61\x73\x6c\x65\x76\x65\x6c":
case "\x63\x61\x74\x65\x67\x6f\x72\x69\x61\x73\x6e\x69\x76\x65\x6c":
case "\x63\x6c\x61\x73\x73\x65\x73\x6c\x65\x76\x65\x6c": {
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

case "\x7a\x65\x72\x61\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x7a\x65\x72\x61\x72\x20\x6f\x20\x72\x61\x6e\x6b\x69\x6e\x67\x20\x64\x65\x20\x6e\xed\x76\x65\x6c\x2e");

  const result = resetGroupLevelRank(from);
  return reply(
    `🏆🐉 *TEMPORADA DE NÍVEL ENCERRADA!*\n\n` +
    `📍 Grupo: *${groupName || "\x47\x72\x75\x70\x6f"}*\n` +
    `👥 Rankings zerados: *${result.users}*\n` +
    `⭐ Todos começam novamente no nível 1 com 0 XP.\n\n` +
    `🌸 Uma nova temporada do Dragon Level começou!`
  );
}
break;

case "\x7a\x65\x72\x61\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c\x67": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x7a\x65\x72\x61\x72\x20\x6f\x20\x72\x61\x6e\x6b\x69\x6e\x67\x20\x67\x6c\x6f\x62\x61\x6c\x20\x64\x65\x20\x6e\xed\x76\x65\x6c\x2e");

  const result = resetGlobalLevelRank();
  return reply(
    `🌍🏆 *TEMPORADA GLOBAL ENCERRADA!*\n\n` +
    `🏘️ Grupos processados: *${result.groups}*\n` +
    `👥 Registros zerados: *${result.users}*\n` +
    `⭐ O Dragon Level global começou uma nova temporada.`
  );
}
break;

case "\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c\x67":
case "\x72\x61\x6e\x6b\x67\x6c\x6f\x62\x61\x6c":
case "\x72\x61\x6e\x6b\x78\x70\x67": {
  const top = getGlobalTopLevel(10);
  if (!top.length) {
    return reply(
      "\ud83d\x20\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x68\xe1\x20\x58\x50\x20\x73\x75\x66\x69\x63\x69\x65\x6e\x74\x65\x20\x6e\x6f\x73\x20\x67\x72\x75\x70\x6f\x73\x20\x63\x6f\x6d\x20\x6f\x20\x73\x69\x73\x74\x65\x6d\x61\x20\x64\x65\x20\x6e\xed\x76\x65\x69\x73\x20\x61\x74\x69\x76\x61\x64\x6f\x2e"
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
    console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x63\x6f\x6e\x73\x75\x6c\x74\x61\x72\x20\x67\x72\x75\x70\x6f\x73\x20\x70\x61\x72\x61\x20\x6f\x20\x72\x61\x6e\x6b\x20\x67\x6c\x6f\x62\x61\x6c\x3a", e?.message || e);
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
    return reply("\ud83d\x20\x4e\x65\x6e\x68\x75\x6d\x20\x6a\x6f\x67\x61\x64\x6f\x72\x20\x64\x6f\x20\x72\x61\x6e\x6b\x20\x65\x73\x74\xe1\x20\x61\x74\x75\x61\x6c\x6d\x65\x6e\x74\x65\x20\x65\x6d\x20\x67\x72\x75\x70\x6f\x73\x20\x63\x6f\x6d\x20\x6f\x20\x73\x69\x73\x74\x65\x6d\x61\x20\x64\x65\x20\x6e\xed\x76\x65\x69\x73\x20\x61\x74\x69\x76\x61\x64\x6f\x2e");
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

case "\x72\x61\x6e\x6b\x6e\x69\x76\x65\x6c":
case "\x74\x6f\x70\x6c\x65\x76\x65\x6c":
case "\x72\x61\x6e\x6b\x78\x70": {
  if (!isGroup) return reply(mess.onlyGroup());
  const top = getTopLevel(from, 10);
  if (!top.length) return reply("\ud83d\x20\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x68\xe1\x20\x58\x50\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x20\x6e\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e");
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

case "\x73\x69\x73\x74\x65\x6d\x61\x6e\x69\x76\x65\x6c":
case "\x6e\x69\x76\x65\x6c\x69\x6e\x66\x6f": {
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

case "\x72\x61\x6e\x6b":
case "\x74\x6f\x70\x61\x74\x69\x76\x6f\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  const top = getTopActivity(from, 10);
  if (!top.length) return reply("\ud83c\x20\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x74\x65\x6e\x68\x6f\x20\x61\x74\x69\x76\x69\x64\x61\x64\x65\x20\x73\x75\x66\x69\x63\x69\x65\x6e\x74\x65\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x61\x20\x6e\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e");
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

case "\x61\x74\x69\x76\x69\x64\x61\x64\x65":
case "\x63\x68\x65\x63\x6b\x6d\x65": {
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
    ? new Date(row.lastSeen).toLocaleString('\x70\x74\x2d\x42\x52', { timeZone: '\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f' })
    : "\x73\x65\x6d\x20\x72\x65\x67\x69\x73\x74\x72\x6f";
  const rankName = row.title || "\ud83e\x20\x4f\x76\x6f\x20\x64\x65\x20\x44\x72\x61\x67\xe3\x6f";
  return conn.sendMessage(from, {
    text:
      `╭━━〔 📊 ATIVIDADE 〕━━╮\n` +
      `┃ 👤 @${String(target).split("@")[0]}\n` +
      `┃ 💬 Textos: *${row.textMessages}*\n` +
      `┃ 🖼️ Fotos: *${row.images}*\n` +
      `┃ 🎨 Figurinhas: *${row.stickers}*\n` +
      `┃ 📊 Total: *${row.messages}*\n` +
      (row.legacyMessages > 0 ? `┃ 📦 Registros anteriores: *${row.legacyMessages}*\n` : "") +
      `┃ 🏆 Posição: *${position > 0 ? `#${position}` : "\x73\x65\x6d\x20\x72\x61\x6e\x6b\x69\x6e\x67"}*\n` +
      `┃ 🐲 Classe: *${rankName}*\n` +
      `┃ ⭐ Nível: *${row.level}* • ${row.xp} XP\n` +
      `┃ 🕒 Última: *${last}*\n` +
      `╰━━━━━━━━━━━━━━━━╯`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "\x69\x6e\x61\x74\x69\x76\x6f\x73": {
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


case "\x61\x6e\x74\x69\x74\x72\x61\x76\x61": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!action || action === "\x73\x74\x61\x74\x75\x73" || action === "\x76\x65\x72") {
    return reply(formatAntiTravaStatus(getAntiTravaConfig(from)) + `\n\nUse *${prefix}antitrava on* ou *${prefix}antitrava off*.`);
  }
  if (!["on", "\x6f\x66\x66"].includes(action)) return reply(`🛡️ Use *${prefix}antitrava on* ou *${prefix}antitrava off*.`);
  const cfg = updateAntiTravaConfig(from, { enabled: action === "on" });
  return reply(formatAntiTravaStatus(cfg));
}
break;

case "\x61\x6e\x74\x69\x6d\x65\x6e\x63\x61\x6f":
case "\x61\x6e\x74\x69\x6d\x65\x6e\x63\x61\x6f": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "\x6f\x66\x66"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`👥 *ANTI-MENÇÃO*\nStatus: *${cfg.antiMention ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\nLimite: *${cfg.mentionLimit}*\n\nUse *${prefix}antimencao on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { antiMention: action === "on" });
  return reply(`👥 Anti-menção *${cfg.antiMention ? "\x61\x74\x69\x76\x61\x64\x6f\x20\u2705" : "\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x20\u274c"}*.\nLimite atual: *${cfg.mentionLimit}* menções.`);
}
break;

case "\x6c\x69\x6d\x69\x74\x65\x6d\x65\x6e\x63\x61\x6f":
case "\x6c\x69\x6d\x69\x74\x65\x6d\x65\x6e\x63\x6f\x65\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = Number(args[0]);
  if (!Number.isInteger(value) || value < 2 || value > 100) return reply(`👥 Informe um limite entre *2 e 100*.\nEx.: *${prefix}limitemencao 10*`);
  updateAntiTravaConfig(from, { mentionLimit: value });
  return reply(`✅ Limite de menções definido para *${value}* por mensagem.`);
}
break;

case "\x61\x6e\x74\x69\x74\x65\x78\x74\x61\x6f":
case "\x61\x6e\x74\x69\x74\x65\x78\x74\x6f": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "\x6f\x66\x66"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`📝 *ANTI-TEXTÃO*\nStatus: *${cfg.antiLongText ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\nLimite: *${cfg.textLimit}* caracteres.\n\nUse *${prefix}antitextao on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { antiLongText: action === "on" });
  return reply(`📝 Anti-textão *${cfg.antiLongText ? "\x61\x74\x69\x76\x61\x64\x6f\x20\u2705" : "\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x20\u274c"}*.\nLimite atual: *${cfg.textLimit}* caracteres.`);
}
break;

case "\x6c\x69\x6d\x69\x74\x65\x74\x65\x78\x74\x6f": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = Number(args[0]);
  if (!Number.isInteger(value) || value < 500 || value > 50000) return reply(`📝 Informe um limite entre *500 e 50000* caracteres.\nEx.: *${prefix}limitetexto 4000*`);
  updateAntiTravaConfig(from, { textLimit: value });
  return reply(`✅ Limite de texto definido para *${value} caracteres*.`);
}
break;

case "\x61\x6e\x74\x69\x66\x6c\x6f\x6f\x64\x6d\x73\x67":
case "\x61\x6e\x74\x69\x66\x6c\x6f\x6f\x64\x6d\x65\x6e\x73\x61\x67\x65\x6d": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "\x6f\x66\x66"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`🌊 *ANTI-FLOOD DE MENSAGENS*\nStatus: *${cfg.antiFloodMessage ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\nLimite: *${cfg.floodLimit} mensagens/${cfg.floodWindowSeconds}s*.\n\nUse *${prefix}antifloodmsg on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { antiFloodMessage: action === "on" });
  return reply(`🌊 Anti-flood de mensagens *${cfg.antiFloodMessage ? "\x61\x74\x69\x76\x61\x64\x6f\x20\u2705" : "\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x20\u274c"}*.`);
}
break;

case "\x6c\x69\x6d\x69\x74\x65\x66\x6c\x6f\x6f\x64": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = Number(args[0]);
  if (!Number.isInteger(value) || value < 3 || value > 30) return reply(`🌊 Informe entre *3 e 30 mensagens*.\nEx.: *${prefix}limiteflood 6*`);
  const cfg = updateAntiTravaConfig(from, { floodLimit: value });
  return reply(`✅ Flood configurado para *${cfg.floodLimit} mensagens em ${cfg.floodWindowSeconds}s*.`);
}
break;

case "\x70\x75\x6e\x69\x72\x74\x72\x61\x76\x61":
case "\x70\x75\x6e\x69\x63\x61\x6f\x5f\x74\x72\x61\x76\x61": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const value = String(args[0] || "").toLowerCase();
  if (!["\x61\x64\x76", "\x62\x61\x6e", "\x61\x6c\x65\x72\x74\x61"].includes(value)) return reply(`⚖️ Escolha: *adv*, *ban* ou *alerta*.\nEx.: *${prefix}punirtrava adv*`);
  const cfg = updateAntiTravaConfig(from, { punishment: value });
  return reply(`⚖️ Punição do Anti-Trava definida como *${cfg.punishment.toUpperCase()}*.`);
}
break;

case "\x6d\x6f\x64\x6f\x65\x6d\x65\x72\x67\x65\x6e\x63\x69\x61":
case "\x65\x6d\x65\x72\x67\x65\x6e\x63\x69\x61": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const action = String(args[0] || "").toLowerCase();
  if (!["on", "\x6f\x66\x66"].includes(action)) {
    const cfg = getAntiTravaConfig(from);
    return reply(`🚨 *MODO DE EMERGÊNCIA*\nStatus: *${cfg.emergency ? "\x4f\x4e\x20\u2705" : "\x4f\x46\x46\x20\u274c"}*\nFechamento: *${cfg.emergencySeconds}s*.\n\nUse *${prefix}modoemergencia on/off*.`);
  }
  const cfg = updateAntiTravaConfig(from, { emergency: action === "on" });
  return reply(`🚨 Modo de emergência *${cfg.emergency ? "\x61\x74\x69\x76\x61\x64\x6f\x20\u2705" : "\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x20\u274c"}*.\nAtaques graves podem fechar o grupo por *${cfg.emergencySeconds}s*.`);
}
break;

case "\x61\x6e\x74\x69\x66\x6c\x6f\x6f\x64": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const value = String(args?.[0] || "").trim().toLowerCase();

  if (!value) {
    const cfg = getYuriProtection(from);

    return reply(
      `🚨 *ANTI-FLOOD DE COMANDOS*\n\n` +
      `Status: ${cfg.antiflood ? "\ud83d\x20\x4f\x4e" : "\u26aa\x20\x4f\x46\x46"}\n` +
      `Intervalo: *${cfg.floodInterval}s*\n\n` +
      `Use:\n` +
      `*${prefix}antiflood 5*\n` +
      `*${prefix}antiflood off*`
    );
  }

  if (value === "\x6f\x66\x66") {
    configureAntiFlood(from, null);

    return reply(
      "\u26aa\ud83d\x20\x41\x6e\x74\x69\x46\x6c\x6f\x6f\x64\x20\x64\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x2e"
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

case "\x61\x6e\x74\x69\x64\x65\x6c":
case "\x61\x6e\x74\x69\x65\x64\x69\x74": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const key = command;
  const enabled = toggleYuriProtection(from, key);

  return reply(
    `${enabled ? "✅" : "⚪"} *${key.toUpperCase()}* ` +
    `${enabled ? "\x61\x74\x69\x76\x61\x64\x6f" : "\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f"} neste grupo.\n\n` +
    `${key === "\x61\x6e\x74\x69\x64\x65\x6c"
      ? "\ud83d\ufe0f\x20\x4d\x65\x6e\x73\x61\x67\x65\x6e\x73\x20\x61\x70\x61\x67\x61\x64\x61\x73\x20\x72\x65\x63\x65\x6e\x74\x65\x73\x20\x70\x6f\x64\x65\x72\xe3\x6f\x20\x73\x65\x72\x20\x72\x65\x63\x75\x70\x65\x72\x61\x64\x61\x73\x2e"
      : "\u270f\ufe0f\x20\x41\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x6d\x6f\x73\x74\x72\x61\x72\xe1\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x6f\x72\x69\x67\x69\x6e\x61\x6c\x20\x71\x75\x61\x6e\x64\x6f\x20\x64\x65\x74\x65\x63\x74\x61\x72\x20\x75\x6d\x61\x20\x65\x64\x69\xe7\xe3\x6f\x2e"
    }`
  );
}
break;

case "\x6d\x75\x74\x61\x72":
case "\x6d\x75\x74\x65": {
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
    return reply("\ud83d\ufe0f\x20\x4e\xe3\x6f\x20\x76\x6f\x75\x20\x6d\x75\x74\x61\x72\x20\x6f\x75\x74\x72\x6f\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72\x2e");
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

case "\x64\x65\x73\x6d\x75\x74\x61\x72":
case "\x64\x65\x73\x6d\x75\x74\x65":
case "\x75\x6e\x6d\x75\x74\x65": {
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
    return reply("\ud83c\x20\x45\x73\x73\x65\x20\x6d\x65\x6d\x62\x72\x6f\x20\x6e\xe3\x6f\x20\x65\x73\x74\xe1\x20\x6d\x75\x74\x61\x64\x6f\x2e");
  }

  return conn.sendMessage(from, {
    text:
      `🔊 @${String(target).split("@")[0]} foi desmutado e pode falar novamente.`,
    mentions: [target]
  }, { quoted: info });
}
break;

case "\x68\x69\x64\x65\x74\x61\x67":
case "\x74\x6f\x74\x61\x67": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const mentions = (groupMembers || [])
    .map((p) => p?.id)
    .filter(Boolean);

  if (!mentions.length) {
    return reply("\ud83c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x63\x61\x72\x72\x65\x67\x61\x72\x20\x6f\x73\x20\x6d\x65\x6d\x62\x72\x6f\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e");
  }

  const quoted =
    info?.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
    null;

  const messageText =
    String(q || "").trim() ||
    quoted?.conversation ||
    quoted?.extendedTextMessage?.text ||
    "\ud83d\ud83c\x20\x41\x74\x65\x6e\xe7\xe3\x6f\x2c\x20\x70\x65\x73\x73\x6f\x61\x6c\x21";

  return conn.sendMessage(from, {
    text: messageText,
    mentions,
  }, { quoted: info });
}
break;


case "\x66\x6f\x74\x6f\x62\x76": {
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
    const { downloadContentFromMessage } = await import("\x40\x77\x68\x69\x73\x6b\x65\x79\x73\x6f\x63\x6b\x65\x74\x73\x2f\x62\x61\x69\x6c\x65\x79\x73");
    const stream = await downloadContentFromMessage(imageMessage, "\x69\x6d\x61\x67\x65");
    let buffer = Buffer.alloc(0);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    if (!buffer.length) throw new Error("\x49\x6d\x61\x67\x65\x6d\x20\x76\x61\x7a\x69\x61");

    const fsM = (await import("\x6e\x6f\x64\x65\x3a\x66\x73")).default;
    const pathM = (await import("\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68")).default;
    const dir = pathM.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x77\x65\x6c\x63\x6f\x6d\x65\x2d\x6d\x65\x64\x69\x61");
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
    console.error("\x45\x72\x72\x6f\x20\x2f\x66\x6f\x74\x6f\x62\x76\x3a", e?.message || e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x73\x61\x6c\x76\x61\x72\x20\x65\x73\x73\x61\x20\x69\x6d\x61\x67\x65\x6d\x2e\x20\x54\x65\x6e\x74\x65\x20\x65\x6e\x76\x69\x61\x72\x20\x61\x20\x66\x6f\x74\x6f\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x2e");
  }
}
break;

case "\x72\x6d\x66\x6f\x74\x6f\x62\x76": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  const cfg = getWelcomeConfig(from);
  const oldPhoto = String(cfg?.welcomePhoto || "").trim();

  if (!oldPhoto) {
    return reply("\ud83c\x20\x45\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x75\x6d\x61\x20\x66\x6f\x74\x6f\x20\x70\x65\x72\x73\x6f\x6e\x61\x6c\x69\x7a\x61\x64\x61\x20\x64\x65\x20\x62\x65\x6d\x2d\x76\x69\x6e\x64\x6f\x2e");
  }

  try {
    const fsM = (await import("\x6e\x6f\x64\x65\x3a\x66\x73")).default;
    if (fsM.existsSync(oldPhoto)) fsM.unlinkSync(oldPhoto);
  } catch {}

  removeWelcomePhoto(from);

  return reply(
    `🗑️🌸 *Foto do bem-vindo removida!*\n\n` +
    `🐉 O Welcome voltou ao comportamento padrão.`
  );
}
break;

case "\x6c\x75\x63\x79": {
  const porcentagem = Math.floor(Math.random() * 101);

  return conn.sendMessage(from, {
    image: { url: "\x2e\x2f\x6d\x65\x64\x69\x61\x2f\x6c\x75\x63\x79\x2e\x6a\x70\x67" },
    caption:
      `😈 *LUCY METER* 😈\n\n` +
      `🔥 O nível de safadeza da Lucy é *${porcentagem}%*`
  }, { quoted: info });
}
break;


case "\x61\x6e\x74\x69\x66\x61\x6b\x65": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  if (!isBotGroupAdmins) {
    return reply(
      "\u274c\ud83d\x20\x45\x75\x20\x70\x72\x65\x63\x69\x73\x6f\x20\x73\x65\x72\x20\x41\x44\x4d\x20\x70\x61\x72\x61\x20\x75\x73\x61\x72\x20\x6f\x20\x41\x6e\x74\x69\x46\x61\x6b\x65\x2e"
    );
  }

  const raw = String(args?.[0] || "").toLowerCase();
  const cfg = getAntiFakeConfig(from);

  if (!raw) {
    return reply(
      `╭──────「 🛡️🌎 」──────╮\n` +
      `         *ANTI-FAKE*\n` +
      `╰─────────────────────╯\n\n` +
      `Status: ${cfg.enabled ? "\ud83d\x20\x4f\x4e" : "\u26aa\x20\x4f\x46\x46"}\n` +
      `🇧🇷 DDI permitido: *+55*\n\n` +
      `• *${prefix}antifake on*\n` +
      `• *${prefix}antifake off*\n\n` +
      `🌸 Quando ativado, novos números estrangeiros identificáveis são removidos automaticamente.`
    );
  }

  if (!["on", "\x6f\x66\x66"].includes(raw)) {
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

case "\x62\x61\x6e\x66\x61\x6b\x65": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());

  if (!isBotGroupAdmins) {
    return reply(
      "\u274c\ud83d\x20\x45\x75\x20\x70\x72\x65\x63\x69\x73\x6f\x20\x73\x65\x72\x20\x41\x44\x4d\x20\x70\x61\x72\x61\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x6d\x65\x6d\x62\x72\x6f\x73\x2e"
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
      "\ud83c\x20\x4f\x73\x20\x6e\xfa\x6d\x65\x72\x6f\x73\x20\x65\x73\x74\x72\x61\x6e\x67\x65\x69\x72\x6f\x73\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x6f\x73\x20\x73\xe3\x6f\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72\x65\x73\x20\x6f\x75\x20\x65\x73\x74\xe3\x6f\x20\x6e\x61\x20\x4c\x69\x73\x74\x61\x20\x42\x72\x61\x6e\x63\x61\x2e\x20\x4e\xe3\x6f\x20\x72\x65\x6d\x6f\x76\x69\x20\x6e\x69\x6e\x67\x75\xe9\x6d\x20\x61\x75\x74\x6f\x6d\x61\x74\x69\x63\x61\x6d\x65\x6e\x74\x65\x2e"
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
        "\x72\x65\x6d\x6f\x76\x65"
      );

      removed += batch.length;
    } catch (error) {
      failed += batch.length;

      console.error(
        "\x5b\x42\x41\x4e\x46\x41\x4b\x45\x5d",
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


case "\x73\x6f\x61\x64\x6d":
case "\x6f\x6e\x6c\x79\x61\x64\x6d":
case "\x73\x6f\x61\x64\x6d\x69\x6e": {
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

case "\x62\x6c\x6f\x63\x6b\x63\x6d\x64": {
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
    "\x62\x6c\x6f\x63\x6b\x63\x6d\x64",
    "\x75\x6e\x62\x6c\x6f\x63\x6b\x63\x6d\x64",
    "\x73\x6f\x61\x64\x6d",
    "\x63\x6f\x6e\x66\x69\x67\x67\x70",
  ]);

  if (protectedCommands.has(normalizedTarget)) {
    return reply(
      "\ud83d\ufe0f\x20\x45\x73\x73\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x64\x65\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\xe7\xe3\x6f\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x20\x73\x65\x72\x20\x62\x6c\x6f\x71\x75\x65\x61\x64\x6f\x20\x6e\x6f\x20\x67\x72\x75\x70\x6f\x2e"
    );
  }

  blockGroupCommand(from, normalizedTarget);

  return reply(
    `✅⛔ *${prefix}${normalizedTarget}* foi bloqueado para membros.\n` +
    `ADMs continuam podendo usar normalmente.`
  );
}
break;

case "\x75\x6e\x62\x6c\x6f\x63\x6b\x63\x6d\x64": {
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

case "\x62\x6c\x6f\x63\x6b\x63\x6d\x64\x67": {
  if (!SoDonoPrincipal) {
    return reply(
      "\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x62\x6c\x6f\x71\x75\x65\x61\x72\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x67\x6c\x6f\x62\x61\x6c\x6d\x65\x6e\x74\x65\x2e"
    );
  }

  const target = String(args?.[0] || "")
    .replace(prefix, "")
    .trim();

  const reason = args?.slice(1).join(" ").trim() ||
    "\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f";

  if (!target) {
    return reply(
      `🌸 Use *${prefix}blockcmdg comando motivo*.`
    );
  }

  const normalizedTarget = resolveCommandAlias(target);

  const protectedCommands = new Set([
    "\x75\x70\x64\x61\x74\x65",
    "\x61\x74\x75\x61\x6c\x69\x7a\x61\x72",
    "\x62\x6c\x6f\x63\x6b\x63\x6d\x64\x67",
    "\x75\x6e\x62\x6c\x6f\x63\x6b\x63\x6d\x64\x67",
    "\x76\x65\x72\x73\x69\x6f\x6e",
    "\x76\x65\x72\x73\x61\x6f",
    "v",
  ]);

  if (protectedCommands.has(normalizedTarget)) {
    return reply(
      "\ud83d\ufe0f\x20\x45\x73\x73\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x63\x72\xed\x74\x69\x63\x6f\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x20\x73\x65\x72\x20\x62\x6c\x6f\x71\x75\x65\x61\x64\x6f\x20\x67\x6c\x6f\x62\x61\x6c\x6d\x65\x6e\x74\x65\x2e"
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

case "\x75\x6e\x62\x6c\x6f\x63\x6b\x63\x6d\x64\x67": {
  if (!SoDonoPrincipal) {
    return reply(
      "\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x64\x65\x73\x62\x6c\x6f\x71\x75\x65\x61\x72\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x67\x6c\x6f\x62\x61\x6c\x6d\x65\x6e\x74\x65\x2e"
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

case "\x61\x64\x64\x61\x6c\x69\x61\x73": {
  if (!SoDonoPrincipal) {
    return reply(
      "\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x63\x72\x69\x61\x72\x20\x61\x6c\x69\x61\x73\x65\x73\x2e"
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
      result.reason === "\x65\x78\x69\x73\x74\x73"
        ? `⚠️ O alias *${prefix}${alias}* já existe.`
        : "\ud83c\x20\x41\x6c\x69\x61\x73\x20\x6f\x75\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e"
    );
  }

  return reply(
    `✅📛 Alias criado!\n\n` +
    `*${prefix}${result.alias}* → *${prefix}${result.command}*`
  );
}
break;

case "\x64\x65\x6c\x61\x6c\x69\x61\x73": {
  if (!SoDonoPrincipal) {
    return reply(
      "\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x61\x6c\x69\x61\x73\x65\x73\x2e"
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
      : "\ud83c\x20\x4e\xfa\x6d\x65\x72\x6f\x20\x64\x65\x20\x61\x6c\x69\x61\x73\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e"
  );
}
break;

case "\x61\x6c\x69\x61\x73\x6c\x69\x73\x74":
case "\x6c\x69\x73\x74\x61\x6c\x69\x61\x73\x65\x73": {
  if (!SoDonoPrincipal) {
    return reply(
      "\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x63\x6f\x6e\x73\x75\x6c\x74\x61\x72\x20\x6f\x73\x20\x61\x6c\x69\x61\x73\x65\x73\x2e"
    );
  }

  const aliases = listCommandAliases();

  if (!aliases.length) {
    return reply(
      "\ud83d\x20\x4e\x65\x6e\x68\x75\x6d\x20\x61\x6c\x69\x61\x73\x20\x70\x65\x72\x73\x6f\x6e\x61\x6c\x69\x7a\x61\x64\x6f\x20\x63\x61\x64\x61\x73\x74\x72\x61\x64\x6f\x2e"
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

case "\x74\x6f\x70\x63\x6d\x64\x73": {
  const top = getMostUsedCommands(10);

  if (!top.length) {
    return reply(
      "\ud83c\x20\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x65\x78\x69\x73\x74\x65\x6d\x20\x65\x73\x74\x61\x74\xed\x73\x74\x69\x63\x61\x73\x20\x64\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x73\x75\x66\x69\x63\x69\x65\x6e\x74\x65\x73\x2e"
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

case "\x74\x6f\x74\x61\x6c\x63\x6d\x64": {
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
    `🕒 Último uso: *${stats.lastUsed ? new Date(stats.lastUsed).toLocaleString("\x70\x74\x2d\x42\x52") : "—"}*`
  );
}
break;

case "\x6e\x6f\x76\x69\x64\x61\x64\x65\x73":
case "\x63\x68\x61\x6e\x67\x65\x6c\x6f\x67": {
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
case "\x66\x69\x67":
case "\x73\x74\x69\x63\x6b\x65\x72\x73":
case "\x73\x74\x69\x63\x6b\x65\x72":
case "\x73\x74\x6b":
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

    if (!["\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65","\x76\x69\x64\x65\x6f\x4d\x65\x73\x73\x61\x67\x65","\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65"].includes(mediaType)) {
      return reply("\ud83c\ud83c\x20\x45\x73\x73\x61\x20\x6d\xed\x64\x69\x61\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x20\x73\x65\x72\x20\x63\x6f\x6e\x76\x65\x72\x74\x69\x64\x61\x20\x65\x6d\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x2e");
    }

    const cfg = readSettingsFile();
    const metadata = {
      userNick: pushname || sender.split("@")[0],
      groupName: isGroup ? groupName : "\x50\x72\x69\x76\x61\x64\x6f",
      botName: cfg.NomeDoBot || NomeDoBot,
      creatorName: cfg.creatorName || cfg.ownerName || ownerName,
    };

    if (mediaType === "\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65") {
      const original = await downloadMediaMessage(mediaTarget,"\x62\x75\x66\x66\x65\x72",{});
      const renamed = await applyStickerMetadata(original,metadata);
      return conn.sendMessage(from,{sticker:renamed},{quoted:info});
    }

    if (mediaType === "\x76\x69\x64\x65\x6f\x4d\x65\x73\x73\x61\x67\x65") {
      const seconds = Number(mediaTarget.message?.videoMessage?.seconds || 0);
      if (seconds > 9.9) {
        return reply("\ud83c\ufe0f\ud83c\x20\x4f\x20\x76\xed\x64\x65\x6f\x20\x70\x72\x65\x63\x69\x73\x61\x20\x74\x65\x72\x20\x6e\x6f\x20\x6d\xe1\x78\x69\x6d\x6f\x20\x2a\x39\x2e\x39\x20\x73\x65\x67\x75\x6e\x64\x6f\x73\x2a\x20\x70\x61\x72\x61\x20\x76\x69\x72\x61\x72\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x2e");
      }
    }

    const buffer = await downloadMediaMessage(mediaTarget,"\x62\x75\x66\x66\x65\x72",{});
    const sticker = await makeSticker(buffer,{
      isVideo: mediaType === "\x76\x69\x64\x65\x6f\x4d\x65\x73\x73\x61\x67\x65",
      forceSquare: true,
      metadata
    });

    return conn.sendMessage(from,{sticker},{quoted:info});
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x6e\x61\x20\x63\x72\x69\x61\xe7\xe3\x6f\x20\x64\x65\x20\x73\x74\x69\x63\x6b\x65\x72\x3a",e);
    return reply(
      "❌🌸 Não consegui criar essa figurinha.\n\n" +
      "\x54\x65\x6e\x74\x65\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x20\x63\x6f\x6d\x20\x6f\x75\x74\x72\x61\x20\x69\x6d\x61\x67\x65\x6d\x20\x6f\x75\x20\x75\x6d\x20\x76\xed\x64\x65\x6f\x20\x6d\x61\x69\x73\x20\x63\x75\x72\x74\x6f\x2e"
    );
  }
}
break;

case "\x6b\x6f\x62\x61\x6e":
case "\x6b\x6f\x62\x61\x62\x61\x6e": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());

  const target = resolveBanTarget(info, args);
  if (!target || target === from) return reply(`🐉 Marque o membro ou responda à mensagem dele.\nExemplo: *${prefix}KobaBan @membro spam*`);
  if (target === botNumber) return reply("\ud83c\x20\x41\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x20\x65\x78\x70\x75\x6c\x73\x61\x72\x20\x61\x20\x73\x69\x20\x6d\x65\x73\x6d\x61\x2e");
  if (target === dono) return reply("\ud83d\x20\x4f\x20\x63\x72\x69\x61\x64\x6f\x72\x20\x64\x61\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x65\x73\x74\xe1\x20\x70\x72\x6f\x74\x65\x67\x69\x64\x6f\x2e");

  const reason = args.filter((arg) => !arg.startsWith("@")).join(" ").trim() || "\x4e\xe3\x6f\x20\x69\x6e\x66\x6f\x72\x6d\x61\x64\x6f";
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
    const kobaBanMedia = path.join(process.cwd(), "\x6d\x65\x64\x69\x61", "\x6b\x6f\x62\x61\x62\x61\x6e", "\x6b\x6f\x62\x61\x62\x61\x6e\x2e\x6d\x70\x34");
    if (!fs.existsSync(kobaBanMedia)) {
      return reply("\u274c\ud83d\x20\x41\x20\x6d\xed\x64\x69\x61\x20\x64\x6f\x20\x4b\x6f\x62\x61\x42\x61\x6e\x20\x6e\xe3\x6f\x20\x66\x6f\x69\x20\x65\x6e\x63\x6f\x6e\x74\x72\x61\x64\x61\x2e");
    }

    await conn.sendMessage(from, {
      video: fs.readFileSync(kobaBanMedia),
      gifPlayback: true,
      caption: kobaBanText,
      mentions: [target, sender]
    }, { quoted: info });

    await conn.groupParticipantsUpdate(from, [target], "\x72\x65\x6d\x6f\x76\x65");

    addPunishmentHistory(from, target, {
      type: "\x6b\x6f\x62\x61\x62\x61\x6e",
      reason,
      by: sender,
      source: "\x6d\x61\x6e\x75\x61\x6c"
    });

    addAdminLog(from, {
      type: "\x6b\x6f\x62\x61\x62\x61\x6e",
      actor: sender,
      target,
      detail: `KobaBan executado • ${reason}`,
    });
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x6e\x6f\x20\x4b\x6f\x62\x61\x42\x61\x6e\x3a", e);
    return reply("\u274c\ud83d\x20\x41\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x74\x65\x6e\x74\x6f\x75\x20\x65\x78\x65\x63\x75\x74\x61\x72\x20\x6f\x20\x62\x61\x6e\x2c\x20\x6d\x61\x73\x20\x6f\x20\x57\x68\x61\x74\x73\x41\x70\x70\x20\x72\x65\x63\x75\x73\x6f\x75\x20\x61\x20\x72\x65\x6d\x6f\xe7\xe3\x6f\x2e");
  }
}
break;

case "\x62\x61\x6e":
case "b":
case "\x62\x61\x6e\x63": {
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
    await conn.groupParticipantsUpdate(from, [target], '\x72\x65\x6d\x6f\x76\x65');

    addPunishmentHistory(from, target, {
      type: "\x62\x61\x6e",
      reason,
      by: sender,
      source: "\x6d\x61\x6e\x75\x61\x6c"
    });

    addAdminLog(from, {
      type: "\x62\x61\x6e",
      actor: sender,
      target,
      detail: `Membro removido do grupo • ${reason}`,
    });

    return conn.sendMessage(from, {
      text: `🐉🌸 *Membro removido!*\n\n👤 @${targetNumber}\n📋 Motivo: ${reason}\n🛡️ Ação realizada por: @${sender.split('@')[0]}`,
      mentions: [target, sender],
    }, { quoted: info });
  } catch (e) {
    console.error('\x45\x72\x72\x6f\x20\x6e\x6f\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x62\x61\x6e\x3a', e);
    return reply(`❌🌸 Não consegui remover esse membro. Ele pode ser administrador ou o WhatsApp pode ter recusado a ação.`);
  }
}
break;

case "\x61\x64\x76": {
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
    type: "\x61\x64\x76",
    reason,
    by: sender,
    source: "\x6d\x61\x6e\x75\x61\x6c",
    meta: { count }
  });

  addAdminLog(from, {
    type: "\x61\x64\x76",
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
    await conn.groupParticipantsUpdate(from, [target], "\x72\x65\x6d\x6f\x76\x65");

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
    console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x61\x70\xf3\x73\x20\x33\x20\x41\x44\x56\x73\x3a", e);
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

case "\x61\x64\x76\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  const target = getTargetFromMessage(info, sender) || sender;
  const db = readAdvDb();
  const record = db[from]?.[target];
  const count = Math.max(0, Math.min(Number(record?.count || 0), 3));
  const history = Array.isArray(record?.history) ? record.history.slice(-5).reverse() : [];
  const status = count === 0 ? "\u2705\x20\x46\x69\x63\x68\x61\x20\x6c\x69\x6d\x70\x61" : count === 1 ? "\ud83d\x20\x53\x6f\x62\x20\x61\x74\x65\x6e\xe7\xe3\x6f" : count === 2 ? "\ud83d\x20\x5a\x6f\x6e\x61\x20\x64\x65\x20\x72\x69\x73\x63\x6f" : "\ud83d\x20\x4c\x69\x6d\x69\x74\x65\x20\x61\x74\x69\x6e\x67\x69\x64\x6f";
  const lines = history.length ? history.map((h, i) => {
    const date = h?.at ? new Date(h.at).toLocaleString('\x70\x74\x2d\x42\x52', { timeZone: '\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f' }) : '\x64\x61\x74\x61\x20\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x61';
    return `${i + 1}. ${h?.reason || '\x53\x65\x6d\x20\x6d\x6f\x74\x69\x76\x6f'} — ${date}`;
  }).join("\n") : "\x4e\x65\x6e\x68\x75\x6d\x61\x20\x61\x64\x76\x65\x72\x74\xea\x6e\x63\x69\x61\x20\x6e\x6f\x20\x68\x69\x73\x74\xf3\x72\x69\x63\x6f\x2e";
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

case "\x6c\x69\x73\x74\x61\x64\x76":
case "\x6c\x69\x73\x74\x61\x61\x64\x76": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const db = readAdvDb();
  const rows = Object.entries(db[from] || {})
    .map(([jid, rec]) => ({ jid, count: Number(rec?.count || 0) }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
  if (!rows.length) return reply("\u2705\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x20\x6d\x65\x6d\x62\x72\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x61\x64\x76\x65\x72\x74\xea\x6e\x63\x69\x61\x73\x20\x61\x74\x69\x76\x61\x73\x20\x6e\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e");
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

case "\x72\x6d\x61\x64\x76":
case "\x72\x6d\x5f\x61\x64\x76": {
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
    type: "\x72\x6d\x61\x64\x76",
    reason: removed?.reason ? `ADV removida: ${removed.reason}` : "\x55\x6d\x61\x20\x61\x64\x76\x65\x72\x74\xea\x6e\x63\x69\x61\x20\x66\x6f\x69\x20\x72\x65\x6d\x6f\x76\x69\x64\x61",
    by: sender,
    source: "\x6d\x61\x6e\x75\x61\x6c",
    meta: { before: current, after: newCount }
  });

  addAdminLog(from, {
    type: "\x72\x6d\x61\x64\x76",
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

case "\x70\x65\x72\x66\x69\x6c": {
  try {
    const target = getTargetFromMessage(info, sender) || sender;
    const targetPN = await getPNForJid(conn, target, target);
    const targetJid = targetPN || normalizeJid(target) || target;
    const number = targetJid?.split("@")[0] || target?.split("@")[0] || "\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f";

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
    const adminByMetadata = participantRole === "\x61\x64\x6d\x69\x6e" || participantRole === "\x73\x75\x70\x65\x72\x61\x64\x6d\x69\x6e";

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
    const isGroupOwner = participantRole === "\x73\x75\x70\x65\x72\x61\x64\x6d\x69\x6e";

    let name = target === sender
      ? (pushname || "\x55\x73\x75\xe1\x72\x69\x6f")
      : (targetParticipant?.name || targetParticipant?.notify || `Usuário ${number}`);
    try {
      if (typeof conn.getName === "\x66\x75\x6e\x63\x74\x69\x6f\x6e") {
        const resolvedName = await conn.getName(targetJid);
        if (resolvedName && !/^\+?\d+$/.test(String(resolvedName).trim())) name = String(resolvedName).trim();
      }
    } catch {}

    let bio = "\x53\x65\x6d\x20\x72\x65\x63\x61\x64\x6f\x20\x70\xfa\x62\x6c\x69\x63\x6f";
    try {
      if (typeof conn.fetchStatus === "\x66\x75\x6e\x63\x74\x69\x6f\x6e") {
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

    const personality = getKobayashiPersonality(isGroup ? from : "\x70\x72\x69\x76\x61\x74\x65", targetJid);

    const cargo = isTargetOwner
      ? "\ud83d\x20\x43\x72\x69\x61\x64\x6f\x72\x20\x64\x61\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69"
      : isGroupOwner
        ? "\ud83d\x20\x44\x6f\x6e\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f"
        : isTargetAdmin
          ? "\ud83d\x20\x41\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72"
          : isTargetLeader
            ? "\ud83d\x20\x4c\xed\x64\x65\x72"
            : "\ud83c\x20\x4d\x65\x6d\x62\x72\x6f";

    const rpgPlayer = getDragonRpgPlayer(targetJid);
    const rpgClassNames = {
      escudeiro:"\x45\x73\x63\x75\x64\x65\x69\x72\x6f", guerreiro:"\x47\x75\x65\x72\x72\x65\x69\x72\x6f", mago:"\x4d\x61\x67\x6f",
      arqueiro:"\x41\x72\x71\x75\x65\x69\x72\x6f", curandeiro:"\x43\x75\x72\x61\x6e\x64\x65\x69\x72\x6f"
    };
    const advancedNames = {
      necromante:"\x4e\x65\x63\x72\x6f\x6d\x61\x6e\x74\x65", assassino:"\x41\x73\x73\x61\x73\x73\x69\x6e\x6f",
      paladino:"\x50\x61\x6c\x61\x64\x69\x6e\x6f", feiticeiro:"\x46\x65\x69\x74\x69\x63\x65\x69\x72\x6f"
    };
    const rpgClass = rpgPlayer?.class ? (rpgClassNames[rpgPlayer.class] || rpgPlayer.class) : "\x4e\xe3\x6f\x20\x69\x6e\x69\x63\x69\x61\x64\x6f";
    const rpgAdvanced = rpgPlayer?.advancedClass ? (advancedNames[rpgPlayer.advancedClass] || rpgPlayer.advancedClass) : "\x4e\x65\x6e\x68\x75\x6d\x61";

    const premium = Boolean(
      isTargetOwner ||
      targetParticipant?.premium ||
      cfgPerfil?.premium?.includes?.(number) ||
      cfgPerfil?.premiums?.includes?.(number)
    );

    const advice = [
      "\x41\x74\xe9\x20\x75\x6d\x61\x20\x63\x68\x61\x6d\x61\x20\x70\x65\x71\x75\x65\x6e\x61\x20\x69\x6c\x75\x6d\x69\x6e\x61\x20\x61\x20\x6e\x6f\x69\x74\x65\x20\x71\x75\x61\x6e\x64\x6f\x20\x76\x6f\x63\xea\x20\x73\x61\x62\x65\x20\x6f\x6e\x64\x65\x20\x71\x75\x65\x72\x20\x63\x68\x65\x67\x61\x72\x2e",
      "\x46\x6f\x72\xe7\x61\x20\x6e\xe3\x6f\x20\xe9\x20\x61\x74\x61\x63\x61\x72\x20\x73\x65\x6d\x70\x72\x65\x3b\x20\xe0\x73\x20\x76\x65\x7a\x65\x73\x20\xe9\x20\x73\x61\x62\x65\x72\x20\x71\x75\x61\x6e\x64\x6f\x20\x67\x75\x61\x72\x64\x61\x72\x20\x61\x73\x20\x67\x61\x72\x72\x61\x73\x2e",
      "\x51\x75\x65\x6d\x20\x65\x76\x6f\x6c\x75\x69\x20\x75\x6d\x20\x70\x6f\x75\x63\x6f\x20\x74\x6f\x64\x6f\x73\x20\x6f\x73\x20\x64\x69\x61\x73\x20\x61\x63\x61\x62\x61\x20\x76\x69\x72\x61\x6e\x64\x6f\x20\x6f\x20\x70\x72\xf3\x70\x72\x69\x6f\x20\x62\x6f\x73\x73\x20\x66\x69\x6e\x61\x6c\x2e",
      "\x4e\x65\x6d\x20\x74\x6f\x64\x61\x20\x62\x61\x74\x61\x6c\x68\x61\x20\x6d\x65\x72\x65\x63\x65\x20\x73\x75\x61\x20\x65\x6e\x65\x72\x67\x69\x61\x2e\x20\x45\x73\x63\x6f\x6c\x68\x61\x20\x62\x65\x6d\x20\x6f\x6e\x64\x65\x20\x75\x73\x61\x72\x20\x73\x65\x75\x20\x66\x6f\x67\x6f\x2e",
      "\x55\x6d\x20\x64\x72\x61\x67\xe3\x6f\x20\x74\x61\x6d\x62\xe9\x6d\x20\x70\x72\x65\x63\x69\x73\x61\x20\x64\x65\x73\x63\x61\x6e\x73\x61\x72\x20\x61\x6e\x74\x65\x73\x20\x64\x65\x20\x76\x6f\x6c\x74\x61\x72\x20\x61\x20\x76\x6f\x61\x72\x2e"
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
      profilePicture = await conn.profilePictureUrl(targetJid || target, "\x69\x6d\x61\x67\x65");
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
    console.error("\x45\x72\x72\x6f\x20\x6e\x6f\x20\x2f\x70\x65\x72\x66\x69\x6c\x3a", error);
    return reply("\u274c\ud83d\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x6d\x6f\x6e\x74\x61\x72\x20\x6f\x20\x70\x65\x72\x66\x69\x6c\x20\x61\x67\x6f\x72\x61\x2e\x20\x54\x65\x6e\x74\x65\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x20\x65\x6d\x20\x61\x6c\x67\x75\x6e\x73\x20\x69\x6e\x73\x74\x61\x6e\x74\x65\x73\x2e");
  }
}
break;


// 🎴 PACOTES REGISTRADOS • v2.0.23
case "\x70\x61\x63\x6f\x74\x65": {
  const sub = String(args?.[0] || "").trim().toLowerCase();

  if (sub === "\x66\x69\x67") {
    if (!SoDonoPrincipal) {
      return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x69\x6e\x69\x63\x69\x61\x72\x20\x6f\x75\x20\x65\x6e\x63\x65\x72\x72\x61\x72\x20\x61\x20\x63\x61\x70\x74\x75\x72\x61\x20\x64\x65\x20\x70\x61\x63\x6f\x74\x65\x73\x2e");
    }

    const op = String(args?.[1] || "").trim().toLowerCase();
    if (!["on","\x6f\x66\x66"].includes(op)) {
      const status = getPackageCaptureStatus(from);
      return reply(
        `🎴🐉 *CAPTURA DE PACOTE*\n\n` +
        `Status: *${status.active ? "\x41\x54\x49\x56\x41\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x41\x20\u274c"}*\n` +
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
    if (!result.ok && result.reason === "\x6e\x6f\x74\x2d\x73\x74\x61\x72\x74\x65\x64") {
      return reply(`🎴 Não existe uma captura ativa neste chat.`);
    }

    return reply(
      `🎴⏹️ *CAPTURA ENCERRADA*\n\n` +
      `Figurinhas guardadas: *${result.count}*\n\n` +
      `Agora use:\n*${prefix}pacote add Nome do pacote*`
    );
  }

  if (sub === "\x61\x64\x64") {
    if (!SoDonoPrincipal) {
      return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x72\x65\x67\x69\x73\x74\x72\x61\x72\x20\x70\x61\x63\x6f\x74\x65\x73\x2e");
    }

    const packageName = args.slice(1).join(" ").trim().replace(/^["'“”]+|["'“”]+$/g, "");
    if (!packageName) {
      return reply(`🎴 Use: *${prefix}pacote add Nome do pacote*`);
    }

    const result = saveCapturedPackage(from, sender, packageName);

    if (!result.ok) {
      const messages = {
        "\x6e\x6f\x2d\x63\x61\x70\x74\x75\x72\x65": `🎴 Nenhuma captura foi iniciada.\nUse primeiro *${prefix}pacote fig on*.`,
        "\x65\x6d\x70\x74\x79": `🎴 A captura não possui figurinhas.`,
        "\x6e\x6f\x74\x2d\x6f\x77\x6e\x65\x72": `👑 Essa captura foi iniciada por outra pessoa.`,
        "\x69\x6e\x76\x61\x6c\x69\x64\x2d\x6e\x61\x6d\x65": `⚠️ Escolha um nome válido para o pacote.`
      };
      return reply(messages[result.reason] || "\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x72\x65\x67\x69\x73\x74\x72\x61\x72\x20\x65\x73\x73\x65\x20\x70\x61\x63\x6f\x74\x65\x2e");
    }

    return reply(
      `╭━━〔 🎴 *PACOTE REGISTRADO* 〕━━╮\n` +
      `┃ 📦 Nome: *${result.name}*\n` +
      `┃ 🎨 Figurinhas: *${result.count}*\n` +
      `┃ ♻️ ${result.replaced ? "\x50\x61\x63\x6f\x74\x65\x20\x61\x6e\x74\x65\x72\x69\x6f\x72\x20\x73\x75\x62\x73\x74\x69\x74\x75\xed\x64\x6f" : "\x4e\x6f\x76\x6f\x20\x70\x61\x63\x6f\x74\x65\x20\x63\x72\x69\x61\x64\x6f"}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `Enviar pacote inteiro:\n*${prefix}pacote ${result.name}*\n\n` +
      `Enviar uma por vez:\n*${prefix}figurinha ${result.name}*`
    );
  }

  if (["\x6c\x69\x73\x74\x61","\x6c\x69\x73\x74"].includes(sub)) {
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

  if (["\x64\x65\x6c","\x64\x65\x6c\x65\x74\x65","\x72\x65\x6d\x6f\x76\x65\x72","\x72\x65\x6d\x6f\x76\x65"].includes(sub)) {
    if (!SoDonoPrincipal) {
      return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x70\x61\x63\x6f\x74\x65\x73\x2e");
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
      `Captura atual: *${status.active ? "\x41\x54\x49\x56\x41" : "\x64\x65\x73\x61\x74\x69\x76\x61\x64\x61"}* • ${status.count} figurinha(s)\n` +
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
      console.error("\x5b\x50\x41\x43\x4f\x54\x45\x20\x53\x45\x4e\x44\x5d", e?.message || e);
    }
  }

  return reply(
    `✅🎴 Pacote *${pack.name}* concluído.\n` +
    `Enviadas: *${sent}/${pack.count}*.`
  );
}
break;

case "\x66\x69\x67\x75\x72\x69\x6e\x68\x61": {
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
case "\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x73":
case "\x73\x74\x69\x63\x6b\x65\x72\x70\x61\x63\x6b":
case "\x70\x61\x63\x6b\x66\x69\x67": {
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
          packName: "\ud83c\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\u2022\x20\x52\x61\x6e\x64\x6f\x6d\x20\x43\x6f\x6c\x6c\x65\x63\x74\x69\x6f\x6e",
          publisher: "\ud83d\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x42\x6f\x74\x20\u2022\x20\x4d\x75\x6c\x74\x69\x20\x53\x6f\x75\x72\x63\x65",
          packId: "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x72\x61\x6e\x64\x6f\x6d",
          emojis: ["🐉", "🌸", "🎴"]
        };
        const isWebp = fetched.buffer?.slice(0,4).toString() === "\x52\x49\x46\x46" && fetched.buffer?.slice(8,12).toString() === "\x57\x45\x42\x50";
        const personalized = isWebp
          ? await applyStickerMetadata(fetched.buffer, randomMetadata)
          : await makeSticker(fetched.buffer, { isVideo: false, forceSquare: true, metadata: randomMetadata });

        await conn.sendMessage(destino, { sticker: personalized });
        sourceHits[fetched.source?.name || fetched.source?.id || "\x46\x6f\x6e\x74\x65"] =
          (sourceHits[fetched.source?.name || fetched.source?.id || "\x46\x6f\x6e\x74\x65"] || 0) + 1;

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
    console.error("\x45\x72\x72\x6f\x20\x6e\x6f\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61\x73\x3a", e);
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
case "\x66\x6f\x6e\x74\x65\x73\x66\x69\x67":
case "\x66\x6f\x6e\x74\x65\x73\x66\x69\x67\x75\x72\x69\x6e\x68\x61": {
  const db = listStickerSources();
  const lines = db.sources.map((src) => {
    const selected = db.mode === src.id ? "\x20\ud83c" : "";
    const status = src.enabled === false ? "🔴" : "🟢";
    const detail = src.type === "\x74\x65\x6d\x70\x6c\x61\x74\x65" ? `${src.min}-${src.max}` : "\x70\x61\x73\x74\x61\x20\x6c\x6f\x63\x61\x6c";
    return `${status} *${src.id}*${selected}\n   ↳ ${src.name} • ${detail}`;
  }).join("\n");
  return reply(
    `╭━━〔 🎴 FONTES DE FIGURINHAS 〕━━╮\n` +
    `┃ Modo: *${db.mode === "\x61\x75\x74\x6f" ? "\x41\x75\x74\x6f\x6d\xe1\x74\x69\x63\x6f\x20\ud83d" : db.mode}*\n` +
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
    ? `🐉🔥 *Dragon RPG ativado neste grupo!*\n\nOs comandos da versão 2.x voltaram a responder.\n🎮 O RPG clássico continua sendo controlado separadamente por *${prefix}modorpg*.`
    : `🐉💤 *Dragon RPG desativado neste grupo!*\n\nEnquanto estiver desligado, nenhum comando do Dragon RPG responderá.\n🎮 O RPG clássico continua independente em *${prefix}modorpg*.`);
}
break;

case "dragonrpg":
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
      ? "\ud83d\u2728\x20\x2a\x52\x61\x6e\x6b\x20\x41\x44\x4d\x20\x7a\x65\x72\x61\x64\x6f\x20\x63\x6f\x6d\x20\x73\x75\x63\x65\x73\x73\x6f\x21\x2a"
      : "\ud83d\x20\x4f\x20\x52\x61\x6e\x6b\x20\x41\x44\x4d\x20\x61\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x70\x6f\x73\x73\x75\x69\x20\x64\x61\x64\x6f\x73\x2e"
  );
}
break;

case "\x73\x74\x61\x74\x75\x73\x67\x72\x75\x70\x6f":
case "\x73\x74\x61\x74\x75\x73\x67\x70": {
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

case "\x6d\x65\x6e\x75\x61\x64\x6d":
if (!isGroup) return reply(mess.onlyGroup());
reagir("\ud83d\ufe0f");
reply(buildAdminMenu(prefix));
break;


case "\x73\x65\x6e\x74\x69\x6e\x65\x6c\x62\x72\x69\x64\x67\x65":
case "\x62\x72\x69\x64\x67\x65": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x72\x20\x6f\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x42\x72\x69\x64\x67\x65\x2e");

  const action = String(args?.[0] || "\x73\x74\x61\x74\x75\x73").toLowerCase();
  const s = getSentinelBridgeStatus();

  if (action === "\x73\x74\x61\x74\x75\x73") {
    return reply(
      `╭━━〔 🛰️ SENTINEL BRIDGE 〕━━╮\n` +
      `┃ 📡 Transporte: *WhatsApp*\n` +
      `┃ 🛡️ Sistema: *${s.enabled ? "\x41\x54\x49\x56\x4f\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x20\u274c"}*\n` +
      `┃ 🧪 Modo: *${s.testMode ? "\x54\x45\x53\x54\x45\x20\x28\x73\x65\x6d\x20\x72\x65\x6d\x6f\xe7\xe3\x6f\x29" : "\x50\x52\x4f\x54\x45\xc7\xc3\x4f\x20\x28\x72\x65\x6d\x6f\x76\x65\x29"}*\n` +
      `┃ 📱 Sentinela: *${s.sentinelNumber || "\x6e\xe3\x6f\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61"}*\n` +
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

  if (action === "\x74\x6f\x6b\x65\x6e") {
    const tokenText = `🛰️ *TOKEN DO SENTINEL BRIDGE*\n\n${s.secret}\n\n⚠️ Não compartilhe este token. Use-o como bridgeSecret no config.json do Sentinel Core.`;
    if (from === dono) return reply(tokenText);
    await conn.sendMessage(dono, { text: tokenText }).catch(() => {});
    return reply("\ud83d\x20\x45\x6e\x76\x69\x65\x69\x20\x6f\x20\x74\x6f\x6b\x65\x6e\x20\x64\x6f\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x42\x72\x69\x64\x67\x65\x20\x6e\x6f\x20\x50\x56\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e");
  }

  if (["\x72\x65\x6e\x6f\x76\x61\x72","\x72\x6f\x74\x61\x74\x65","\x72\x6f\x74\x61\x63\x69\x6f\x6e\x61\x72"].includes(action)) {
    const secret = rotateSentinelBridgeSecret();
    await conn.sendMessage(dono, { text: `🔐 *NOVO TOKEN SENTINEL BRIDGE*\n\n${secret}\n\nAtualize o bridgeSecret do Sentinel Core.` }).catch(() => {});
    return reply("\u2705\x20\x54\x6f\x6b\x65\x6e\x20\x64\x6f\x20\x42\x72\x69\x64\x67\x65\x20\x72\x65\x6e\x6f\x76\x61\x64\x6f\x2e\x20\x4f\x20\x6e\x6f\x76\x6f\x20\x74\x6f\x6b\x65\x6e\x20\x66\x6f\x69\x20\x65\x6e\x76\x69\x61\x64\x6f\x20\x61\x6f\x20\x50\x56\x20\x64\x6f\x20\x64\x6f\x6e\x6f\x2e");
  }

  if (["\x6e\x75\x6d\x65\x72\x6f","\x6e\xfa\x6d\x65\x72\x6f","\x6e\x75\x6d\x62\x65\x72"].includes(action)) {
    const number = String(args?.[1] || "").replace(/\D/g, "");
    if (number.length < 10 || number.length > 15) {
      return reply(`📱 Use: *${prefix}sentinelbridge numero 55DDDNUMERO*`);
    }
    const cfg = setSentinelWhatsAppNumber(number);
    return reply(`✅ Número autorizado da Sentinela: *${cfg.sentinelNumber}*\n\nEssa conta deve permanecer como membro comum.`);
  }

  if (["\x74\x65\x73\x74\x65","\x74\x65\x73\x74"].includes(action)) {
    setSentinelBridgeTestMode(true);
    return reply("\ud83e\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x42\x72\x69\x64\x67\x65\x20\x65\x6d\x20\x2a\x6d\x6f\x64\x6f\x20\x64\x65\x20\x74\x65\x73\x74\x65\x2a\x2e\x20\x4f\x73\x20\x65\x76\x65\x6e\x74\x6f\x73\x20\x73\x65\x72\xe3\x6f\x20\x76\x61\x6c\x69\x64\x61\x64\x6f\x73\x20\x65\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x73\x2c\x20\x73\x65\x6d\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x6d\x65\x6d\x62\x72\x6f\x73\x2e");
  }

  if (["\x70\x72\x6f\x74\x65\x67\x65\x72","\x70\x72\x6f\x74\x65\x63\x61\x6f","\x70\x72\x6f\x74\x65\xe7\xe3\x6f","\x61\x74\x69\x76\x6f"].includes(action)) {
    setSentinelBridgeTestMode(false);
    return reply("\ud83d\ufe0f\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x42\x72\x69\x64\x67\x65\x20\x65\x6d\x20\x2a\x6d\x6f\x64\x6f\x20\x64\x65\x20\x70\x72\x6f\x74\x65\xe7\xe3\x6f\x2a\x2e\x20\x45\x76\x65\x6e\x74\x6f\x73\x20\x76\xe1\x6c\x69\x64\x6f\x73\x20\x70\x6f\x64\x65\x72\xe3\x6f\x20\x72\x65\x6d\x6f\x76\x65\x72\x20\x69\x6e\x76\x61\x73\x6f\x72\x65\x73\x2e");
  }

  if (action === "on" || action === "\x6f\x66\x66") {
    const cfg = setSentinelBridgeEnabled(action === "on");
    if (cfg.enabled) ensureSentinelBridgeServer();
    return reply(`🛰️ Sentinel Bridge *${cfg.enabled ? "\x61\x74\x69\x76\x61\x64\x6f\x20\u2705" : "\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x20\u274c"}*.`);
  }

  if (action === "\x6c\x6f\x67\x73" || action === "\x6c\x6f\x67") {
    const logs = getSentinelBridgeLogs(10);
    if (!logs.length) return reply("\ud83d\ufe0f\x20\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x68\xe1\x20\x65\x76\x65\x6e\x74\x6f\x73\x20\x6e\x6f\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x42\x72\x69\x64\x67\x65\x2e");
    return reply(
      `╭━━〔 🛰️ BRIDGE LOG 〕━━╮\n` +
      logs.map((x,i)=>`┃ ${i+1}. ${x.action || "\x65\x76\x65\x6e\x74\x6f"} • ${x.reason || (x.reasons||[]).join(", ") || "ok"}\n┃ ${new Date(x.timestamp||Date.now()).toLocaleString("\x70\x74\x2d\x42\x52")}`).join("\n┃\n") +
      `\n╰━━━━━━━━━━━━━━━━━━╯`
    );
  }

  return reply(`🛰️ Use *${prefix}sentinelbridge status*.`);
}
break;

case "\x73\x65\x6e\x74\x69\x6e\x65\x6c": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x72\x20\x6f\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x2e");

  const action = String(args?.[0] || "\x73\x74\x61\x74\x75\x73").toLowerCase();

  if (action === "\x73\x74\x61\x74\x75\x73") {
    const s = getSentinelStatus(from);
    return reply(
      `╭━━〔 🛰️ KOBAYASHI SENTINEL 〕━━╮\n` +
      `┃ 🤖 Sessão: *${s.connected ? "\x4f\x4e\x4c\x49\x4e\x45\x20\u2705" : s.registered ? "\x4f\x46\x46\x4c\x49\x4e\x45\x20\u26a0\ufe0f" : "\x4e\xc3\x4f\x20\x50\x41\x52\x45\x41\x44\x41"}*\n` +
      `┃ 👁️ Neste grupo: *${s.groupEnabled ? "\x41\x54\x49\x56\x4f\x20\u2705" : "\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f\x20\u274c"}*\n` +
      `┃ 🛡️ Modo: *links invisíveis*\n` +
      `┃ ⏱️ Confirmação: *${s.delayMs} ms*\n` +
      `┃ 📱 Sentinela: *${s.phoneNumber || "\x6e\xe3\x6f\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x6f"}*\n` +
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

  if (action === "\x70\x61\x72\x65\x61\x72" || action === "\x70\x61\x69\x72") {
    const number = String(args?.[1] || "").replace(/\D/g, "");
    if (number.length < 10 || number.length > 15) {
      return reply(`📱 Use: *${prefix}sentinel parear 5511999999999*`);
    }

    await reply("\ud83d\ufe0f\x20\x50\x72\x65\x70\x61\x72\x61\x6e\x64\x6f\x20\x61\x20\x63\x6f\x6e\x74\x61\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x61\x2e\x2e\x2e");
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

  if (action === "on" || action === "\x6f\x66\x66") {
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

  if (action === "\x64\x65\x6c\x61\x79") {
    const value = Number(args?.[1]);
    if (!Number.isFinite(value) || value < 1200 || value > 10000) {
      return reply(`⏱️ Use um valor entre *1200 e 10000 ms*.\nEx.: *${prefix}sentinel delay 2000*`);
    }
    const delayMs = setSentinelDelay(value);
    return reply(`⏱️ Confirmação do Sentinel definida para *${delayMs} ms*.`);
  }

  if (action === "\x6c\x6f\x67" || action === "\x6c\x6f\x67\x73") {
    const logs = getSentinelLogs(isGroup ? from : null, 10);
    if (!logs.length) return reply("\ud83d\ufe0f\x20\x41\x69\x6e\x64\x61\x20\x6e\xe3\x6f\x20\x65\x78\x69\x73\x74\x65\x6d\x20\x64\x65\x74\x65\x63\xe7\xf5\x65\x73\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x61\x73\x2e");

    return reply(
      `╭━━〔 🛰️ SENTINEL LOG 〕━━╮\n` +
      logs.map((x, i) =>
        `┃ ${i + 1}. ${x.action || "\x64\x65\x74\x65\x63\x74\x61\x64\x6f"}\n` +
        `┃ 👤 ${String(x.senderJid || "\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f").split("@")[0]}\n` +
        `┃ 🆔 ${x.messageId || "—"}\n` +
        `┃ 🕒 ${new Date(x.timestamp || Date.now()).toLocaleString("\x70\x74\x2d\x42\x52")}`
      ).join("\n┃\n") +
      `\n╰━━━━━━━━━━━━━━━━━━╯`
    );
  }

  if (action === "\x64\x65\x73\x63\x6f\x6e\x65\x63\x74\x61\x72" || action === "\x73\x74\x6f\x70") {
    const stopped = await stopSentinel();
    return reply(
      stopped
        ? "\ud83d\ufe0f\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x61\x20\x64\x65\x73\x63\x6f\x6e\x65\x63\x74\x61\x64\x6f\x2e\x20\x41\x20\x73\x65\x73\x73\xe3\x6f\x20\x66\x6f\x69\x20\x70\x72\x65\x73\x65\x72\x76\x61\x64\x61\x20\x70\x61\x72\x61\x20\x72\x65\x63\x6f\x6e\x65\x63\x74\x61\x72\x20\x64\x65\x70\x6f\x69\x73\x2e"
        : "\ud83d\ufe0f\x20\x4f\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x61\x20\x6a\xe1\x20\x65\x73\x74\x61\x76\x61\x20\x64\x65\x73\x63\x6f\x6e\x65\x63\x74\x61\x64\x6f\x2e"
    );
  }

  return reply(`🛰️ Use *${prefix}sentinel status* para ver as opções.`);
}
break;

case "\x6d\x65\x6e\x75\x6f\x77\x6e\x65\x72":
case "\x6d\x65\x6e\x75\x64\x6f\x6e\x6f":
if (!SoDono) return reply(mess.onlyOwner());
reagir("👑");
reply(buildOwnerMenu(prefix));
break;

case "\x6d\x65\x6e\x75\x73\x74\x69\x63\x6b\x65\x72":
case "\x6d\x65\x6e\x75\x73\x74\x6b":
reagir("🎴");
reply(buildStickerMenu(prefix));
break;

case "\x6d\x65\x6e\x75\x67\x65\x72\x61\x6c":
case "\x67\x65\x72\x61\x6c":
reagir("🪷");
reply(buildGeneralMenu(prefix));
break;
//



// teste de atualização v0.1.4
case "\x73\x74\x61\x74\x75\x73\x61\x74\x74":
case "\x61\x74\x74\x73\x74\x61\x74\x75\x73":
case "\x73\x74\x61\x74\x75\x73\x75\x70\x64\x61\x74\x65":
case "\x76\x65\x72\x69\x66\x69\x63\x61\x72\x75\x70\x64\x61\x74\x65": {
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
      `📡 Canal: *${status.channel || "\x73\x74\x61\x62\x6c\x65"}*\n` +
      `🔄 Estado: *${sincronizado ? "\x41\x54\x55\x41\x4c\x49\x5a\x41\x44\x4f\x20\u2705" : "\x41\x54\x55\x41\x4c\x49\x5a\x41\xc7\xc3\x4f\x20\x44\x49\x53\x50\x4f\x4e\xcd\x56\x45\x4c\x20\u26a0\ufe0f"}*\n\n` +
      `🔑 Licença: *${license.valid ? "\x41\x54\x49\x56\x41\x20\u2705" : "\x4e\xc3\x4f\x20\x41\x54\x49\x56\x41\x44\x41\x20\u274c"}*\n` +
      `🎟️ Plano: *${license.plan || "-"}*\n` +
      `⬆️ Updates: *${license.updates ? "\x4c\x49\x42\x45\x52\x41\x44\x4f\x53\x20\u2705" : "\x42\x4c\x4f\x51\x55\x45\x41\x44\x4f\x53\x20\u26d4"}*\n\n` +
      (status.available
        ? `Use *${prefix}atualizar* para instalar a versão oficial.`
        : `🌸 Kobayashi está sincronizada.`)
    );
  } catch (e) {
    const license = getEffectiveLicense();
    return reply(
      `🐉🌸 *KOBAYASHI UPDATE • V4*\n\n` +
      `📦 Versão: *${getLocalVersion()}*\n` +
      `🔑 Licença: *${license.valid ? "\x41\x54\x49\x56\x41\x20\u2705" : "\x4e\xc3\x4f\x20\x41\x54\x49\x56\x41\x44\x41\x20\u274c"}*\n` +
      `⚠️ Não consegui consultar a atualização agora.\n` +
      `Detalhe: ${e?.message || e}`
    );
  }
}
break;
//

// licença oficial v4
case "\x6c\x69\x63\x65\x6e\x63\x61":
case "\x6c\x69\x63\x65\x6e\x73\x65": {
  if (!SoDono) return reply(mess.onlyOwner());

  let license = getEffectiveLicense();
  if (license.mode !== "\x63\x72\x65\x61\x74\x6f\x72" && license.key && license.needsOnlineValidation) {
    try {
      license = await validateLicense({ version: getLocalVersion() });
    } catch {}
  }

  const cfg = getLicenseConfig();
  const cacheText = license.mode === "\x63\x72\x65\x61\x74\x6f\x72"
    ? "\x6e\xe3\x6f\x20\x6e\x65\x63\x65\x73\x73\xe1\x72\x69\x6f"
    : (license.cached ? "\x76\xe1\x6c\x69\x64\x6f\x20\u2705" : "\x70\x65\x6e\x64\x65\x6e\x74\x65\x2f\x65\x78\x70\x69\x72\x61\x64\x6f\x20\u26a0\ufe0f");

  return reply(
    `╭━━〔 🔑🐉 *LICENÇA KOBAYASHI* 〕━━╮\n` +
    `┃ 📦 Versão: *${getLocalVersion()}*\n` +
    `┃ 🔐 Status: *${license.valid ? "\x41\x54\x49\x56\x41\x20\u2705" : "\x4e\xc3\x4f\x20\x41\x54\x49\x56\x41\x44\x41\x20\u274c"}*\n` +
    `┃ 🎟️ Plano: *${license.plan || "-"}*\n` +
    `┃ 👤 Cliente: *${license.customer || "-"}*\n` +
    `┃ ⬆️ Updates: *${license.updates ? "\x4c\x49\x42\x45\x52\x41\x44\x4f\x53\x20\u2705" : "\x42\x4c\x4f\x51\x55\x45\x41\x44\x4f\x53\x20\u26d4"}*\n` +
    `┃ 🔑 Chave: *${maskLicenseKey(license.key)}*\n` +
    `┃ 💾 Cache: *${cacheText}*\n` +
    `┃ 📡 Canal: *${cfg.channel || "\x73\x74\x61\x62\x6c\x65"}*\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
  );
}
break;

case "\x61\x74\x69\x76\x61\x72\x6c\x69\x63\x65\x6e\x63\x61":
case "\x61\x63\x74\x69\x76\x61\x74\x65\x6c\x69\x63\x65\x6e\x73\x65": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x70\x6f\x64\x65\x20\x61\x74\x69\x76\x61\x72\x20\x61\x20\x6c\x69\x63\x65\x6e\xe7\x61\x2e");

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
      `⬆️ Atualizações: *${result.updates ? "\x4c\x49\x42\x45\x52\x41\x44\x41\x53\x20\u2705" : "\x42\x4c\x4f\x51\x55\x45\x41\x44\x41\x53\x20\u26d4"}*`
    );
  } catch (e) {
    return reply(
      `❌ *Não foi possível ativar a licença.*\n\n` +
      `${e?.message || e}`
    );
  }
}
break;

// versão e atualização
case "\x76\x65\x72\x73\x69\x6f\x6e":
case "\x76\x65\x72\x73\x61\x6f":
case "v": {
  reagir("📦");
  try {
    const status = await checkUpdate();
    const situacao = status.available
      ? `🟡 Nova versão disponível: *${status.remote}*\n👑 O dono pode usar *${prefix}update*.`
      : "\ud83d\x20\x56\x6f\x63\xea\x20\x65\x73\x74\xe1\x20\x75\x73\x61\x6e\x64\x6f\x20\x61\x20\x76\x65\x72\x73\xe3\x6f\x20\x6d\x61\x69\x73\x20\x72\x65\x63\x65\x6e\x74\x65\x2e";

    return reply(
      `🐉🌸 *KOBAYASHI BOT • VERSÃO*\n\n` +
      `📦 Instalada: *${status.local}*\n` +
      `☁️ Oficial: *${status.remote}*\n` +
      `📡 Canal: *${status.channel || "\x73\x74\x61\x62\x6c\x65"}*\n\n` +
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

case "\x75\x70\x64\x61\x74\x65":
case "\x61\x74\x75\x61\x6c\x69\x7a\x61\x72": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x70\x6f\x64\x65\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x63\x72\xed\x74\x69\x63\x61\x73\x20\x64\x6f\x20\x62\x6f\x74\x2e");

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

    await reply("\ud83d\x20\x52\x65\x69\x6e\x69\x63\x69\x61\x6e\x64\x6f\x20\x6f\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x42\x6f\x74\x2e\x2e\x2e");

    // npm start usa start.sh; ao encerrar, o loop inicia a versão nova.
    setTimeout(() => process.exit(0), 3500);
    return;
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x61\x6f\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x72\x3a", e);
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
case "\x67\x72\x75\x70\x6f\x69\x6e\x66\x6f":
case "\x69\x6e\x66\x6f\x67\x72\x75\x70\x6f":
case "\x67\x72\x6f\x75\x70\x69\x6e\x66\x6f": {
  if (!isGroup) return reply(mess.onlyGroup());

  reagir("🐉");

  try {
    // Usa os metadados já carregados pelo bot para evitar chamadas desnecessárias.
    const membros = Array.isArray(groupMembers) ? groupMembers.length : 0;
    const admins = Array.isArray(groupAdmins) ? groupAdmins.length : 0;
    const descricao = groupMetadata?.desc?.trim() || "\x53\x65\x6d\x20\x64\x65\x73\x63\x72\x69\xe7\xe3\x6f\x2e";
    const criadorJid = groupMetadata?.owner || null;
    const criador = criadorJid
      ? `@${normalizeJid(criadorJid).split("@")[0]}`
      : "\x4e\xe3\x6f\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c";
    const criadoEm = groupMetadata?.creation
      ? moment.unix(Number(groupMetadata.creation)).format("\x44\x44\x2f\x4d\x4d\x2f\x59\x59\x59\x59\x20\x48\x48\x3a\x6d\x6d")
      : "\x4e\xe3\x6f\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c";
    const botAdm = isBotGroupAdmins ? "\x53\x69\x6d\x20\u2705" : "\x4e\xe3\x6f\x20\u274c";

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
    console.error("\x45\x72\x72\x6f\x20\x6e\x6f\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x67\x72\x75\x70\x6f\x69\x6e\x66\x6f\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x6f\x62\x74\x65\x72\x20\x61\x73\x20\x69\x6e\x66\x6f\x72\x6d\x61\xe7\xf5\x65\x73\x20\x64\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x20\x61\x67\x6f\x72\x61\x2e");
  }
}
break;
//

// ping
case "\x70\x69\x6e\x67": {
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
case "\x69\x64\x31":
reagir("\x31\ufe0f\u20e3");
reply("\ud83c\x20\x56\x6f\x63\xea\x20\x63\x6c\x69\x63\x6f\x75\x20\x6e\x6f\x20\x2a\x42\x6f\x74\xe3\x6f\x20\x31\x2a\x20\u2705");
break;

case "\x69\x64\x32":
reagir("\x32\ufe0f\u20e3");
reply("\ud83d\x20\x56\x6f\x63\xea\x20\x63\x6c\x69\x63\x6f\x75\x20\x6e\x6f\x20\x2a\x42\x6f\x74\xe3\x6f\x20\x32\x2a\x20\u2705");
break;

case "\x69\x64\x5f\x72\x65\x73\x70\x6f\x73\x74\x61":
reagir("↩️");
reply("\x56\x6f\x63\xea\x20\x63\x6c\x69\x63\x6f\x75\x20\x65\x6d\x20\x2a\x52\x65\x73\x70\x6f\x6e\x64\x65\x72\x2a\x20\u2705");
break;

case "\x6f\x70\x63\x61\x6f\x31":
reagir("\x31\ufe0f\u20e3");
reply("\x56\x6f\x63\xea\x20\x65\x73\x63\x6f\x6c\x68\x65\x75\x20\x61\x20\x2a\x4f\x70\xe7\xe3\x6f\x20\x31\x2a\x20\u2705");
break;

case "\x6f\x70\x63\x61\x6f\x32":
reagir("\x32\ufe0f\u20e3");
reply("\x56\x6f\x63\xea\x20\x65\x73\x63\x6f\x6c\x68\x65\x75\x20\x61\x20\x2a\x4f\x70\xe7\xe3\x6f\x20\x32\x2a\x20\u2705");
break;
//



case "\x63\x69\x74\x61": {
  if (!isGroup) return reply("\ud83d\x20\x4f\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x2a\x63\x69\x74\x61\x2a\x20\x73\xf3\x20\x70\x6f\x64\x65\x20\x73\x65\x72\x20\x75\x73\x61\x64\x6f\x20\x65\x6d\x20\x67\x72\x75\x70\x6f\x73\x2e");
  if (!isGroupAdmins && !SoDono) return reply("\ud83d\ufe0f\x20\x41\x70\x65\x6e\x61\x73\x20\x2a\x41\x44\x4d\x73\x2a\x20\x70\x6f\x64\x65\x6d\x20\x75\x73\x61\x72\x20\x6f\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x2a\x63\x69\x74\x61\x2a\x2e");

  const participantes = [...new Set(
    (groupMembers || []).map((p) => p?.id || p?.jid || p?.participant).filter(Boolean)
  )];
  if (!participantes.length) return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x63\x61\x72\x72\x65\x67\x61\x72\x20\x6f\x73\x20\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74\x65\x73\x20\x64\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e");

  const texto = String(q || "").trim();
  return conn.sendMessage(from, {
    text: texto ? `📢 *${texto}*` : "\ud83d\ud83d\x20\x2a\x41\x54\x45\x4e\xc7\xc3\x4f\x2c\x20\x47\x52\x55\x50\x4f\x21\x2a",
    mentions: participantes
  }, { quoted: info });
}
break;

case "\x64\x65\x62\x75\x67\x64\x6f\x6e\x6f": {
  const safeIds = ownerIdentityCandidates.map((jid) => {
    const value = String(jid);
    if (value.includes("\x40\x6c\x69\x64")) return `LID: ${value}`;
    const digits = jidLocalDigits(value);
    return digits ? `PN: ...${digits.slice(-4)}` : value;
  });

  return reply(
    `👑🐉 *DIAGNÓSTICO DE DONO*\n\n` +
    `Reconhecido como dono: *${SoDonoPrincipal ? "\x53\x49\x4d\x20\u2705" : "\x4e\xc3\x4f\x20\u274c"}*\n` +
    `Identidades detectadas: *${safeIds.length}*\n` +
    `${safeIds.slice(0, 8).map((v, i) => `${i + 1}. ${v}`).join("\n") || "\x4e\x65\x6e\x68\x75\x6d\x61"}\n\n` +
    `Use este comando para diagnosticar reconhecimento sem expor o número completo.`
  );
}
break;

case "\x6d\x73\x67": {
  if (!SoDonoPrincipal) {
    return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x70\x6f\x64\x65\x20\x65\x6e\x76\x69\x61\x72\x20\x61\x76\x69\x73\x6f\x73\x20\x67\x6c\x6f\x62\x61\x69\x73\x2e");
  }

  const aviso = String(q || "").trim();
  if (!aviso) {
    return reply(
      `📢 *AVISO GLOBAL*\n\n` +
      `Use: *${prefix}msg texto do aviso*\n\n` +
      `A Kobayashi enviará a mensagem em todos os grupos em que estiver, marcando todos os participantes.`
    );
  }

  let groups = {};
  try {
    groups = await conn.groupFetchAllParticipating();
  } catch (e) {
    console.error("\x5b\x4d\x53\x47\x20\x47\x4c\x4f\x42\x41\x4c\x5d\x20\x46\x61\x6c\x68\x61\x20\x61\x6f\x20\x6c\x69\x73\x74\x61\x72\x20\x67\x72\x75\x70\x6f\x73\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x63\x61\x72\x72\x65\x67\x61\x72\x20\x61\x20\x6c\x69\x73\x74\x61\x20\x64\x65\x20\x67\x72\x75\x70\x6f\x73\x20\x61\x67\x6f\x72\x61\x2e");
  }

  const entries = Object.entries(groups || {});
  if (!entries.length) return reply("\ud83d\x20\x41\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x6e\xe3\x6f\x20\x65\x73\x74\xe1\x20\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x64\x6f\x20\x64\x65\x20\x6e\x65\x6e\x68\x75\x6d\x20\x67\x72\x75\x70\x6f\x2e");

  let enviados = 0;
  let falhas = 0;

  await reply(
    `📢🐉 *ENVIO GLOBAL INICIADO*\n\n` +
    `🏘️ Grupos encontrados: *${entries.length}*\n` +
    `⏳ Vou enviar o aviso marcando todos os participantes.`
  );

  for (const [groupJid, cachedMeta] of entries) {
    try {
      let meta = cachedMeta;
      try {
        meta = await conn.groupMetadata(groupJid);
      } catch {}

      const mentions = [...new Set(
        (meta?.participants || [])
          .map((p) => p?.id || p?.jid)
          .filter(Boolean)
      )];

      const MAX_MSG_CHUNK = 55000;
      const partes = [];
      for (let i = 0; i < aviso.length; i += MAX_MSG_CHUNK) {
        partes.push(aviso.slice(i, i + MAX_MSG_CHUNK));
      }
      if (!partes.length) partes.push(aviso);

      for (let i = 0; i < partes.length; i++) {
        const multi = partes.length > 1 ? `\n📄 *Parte ${i + 1}/${partes.length}*` : "";
        await conn.sendMessage(groupJid, {
          text:
            `╭━━〔 📢🐉 *AVISO KOBAYASHI* 〕━━╮${multi}\n\n` +
            `${partes[i]}\n\n` +
            `╰━━〔 🌸 *KOBAYASHI BOT* 〕━━╯`,
          mentions
        });
        if (i < partes.length - 1) await new Promise((resolve) => setTimeout(resolve, 500));
      }

      enviados++;
      // Pequeno intervalo para evitar disparos simultâneos em muitos grupos.
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } catch (e) {
      falhas++;
      console.error(`[MSG GLOBAL] Falha em ${groupJid}:`, e?.message || e);
    }
  }

  return reply(
    `✅🐉 *AVISO GLOBAL FINALIZADO*\n\n` +
    `📨 Enviados: *${enviados}*\n` +
    `❌ Falhas: *${falhas}*\n` +
    `🏘️ Total: *${entries.length}*`
  );
}
break;

// líderes / múltiplos donos • v0.1.19
case "\x64\x6f\x6e\x6f\x31":
case "\x64\x6f\x6e\x6f\x32":
case "\x64\x6f\x6e\x6f\x33":
case "\x64\x6f\x6e\x6f\x34":
case "\x64\x6f\x6e\x6f\x35": {
  if (!SoDonoPrincipal) {
    return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x6f\x20\x6e\x6f\x20\x62\x6f\x74\x20\x70\x6f\x64\x65\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x6f\x73\x20\x6c\xed\x64\x65\x72\x65\x73\x2e");
  }

  const slot = Number(command.replace("\x64\x6f\x6e\x6f", "")) - 1;
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

  if (["\x72\x65\x6d\x6f\x76\x65\x72","\x72\x65\x6d\x6f\x76\x65","\x6f\x66\x66","0"].includes(raw)) {
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
    return reply("\ud83d\x20\x45\x73\x73\x65\x20\x6e\xfa\x6d\x65\x72\x6f\x20\x6a\xe1\x20\xe9\x20\x6f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x64\x6f\x20\x62\x6f\x74\x2e");
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

case "\x6c\x69\x64\x65\x72\x65\x73":
case "\x6c\xed\x64\x65\x72\x65\x73":
case "\x64\x6f\x6e\x6f\x73": {
  if (!SoDono) return reply(mess.onlyOwner());

  const cfg = readSettingsFile();
  const leaders = Array.isArray(cfg.leaders) ? cfg.leaders : [];
  const filled = leaders
    .map((n, i) => ({ n: onlyDigits(n), slot: i + 1 }))
    .filter((x) => x.n);

  const linhas = filled.length
    ? filled.map((x) => `│ 👑 Líder ${x.slot} › ${x.n}`).join("\n")
    : "\u2502\x20\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x20\x6c\xed\x64\x65\x72\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x6f\x2e";

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
case "\x6e\x75\x6d\x65\x72\x6f\x5f\x64\x6f\x6e\x6f":
case "\x6e\xfa\x6d\x65\x72\x6f\x5f\x64\x6f\x6e\x6f": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x70\x6f\x64\x65\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x63\x72\xed\x74\x69\x63\x61\x73\x20\x64\x6f\x20\x62\x6f\x74\x2e");
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

case "\x6e\x75\x6d\x65\x72\x6f\x5f\x62\x6f\x74":
case "\x6e\xfa\x6d\x65\x72\x6f\x5f\x62\x6f\x74": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x70\x6f\x64\x65\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x63\x72\xed\x74\x69\x63\x61\x73\x20\x64\x6f\x20\x62\x6f\x74\x2e");
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

  const authDir = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x71\x72\x2d\x63\x6f\x64\x65");
  fs.rmSync(authDir, { recursive: true, force: true });
  setTimeout(() => process.exit(0), 2200);
  return;
}
break;

case "\x73\x74\x61\x74\x75\x73\x5f\x62\x6f\x74": {
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
    `🛡️ Anti-PV: *${cfg.antiPv ? "\x41\x74\x69\x76\x61\x64\x6f" : "\x44\x65\x73\x61\x74\x69\x76\x61\x64\x6f"}*`
  );
}
break;

case "\x70\x72\x65\x66\x69\x78\x6f": {
  if (!SoDono) return reply(mess.onlyOwner());
  const cfg = readSettingsFile();
  return reply(`⌨️🌸 Prefixo atual: *${cfg.prefix}*\n\nPara alterar: *${cfg.prefix}add_prefixo !*`);
}
break;

case "\x61\x64\x64\x5f\x70\x72\x65\x66\x69\x78\x6f": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x70\x6f\x64\x65\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x63\x72\xed\x74\x69\x63\x61\x73\x20\x64\x6f\x20\x62\x6f\x74\x2e");
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

case "\x6e\x6f\x6d\x65\x5f\x67\x70": {
  if (!SoDono) return reply(mess.onlyOwner());
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  if (!q.trim()) return reply(`✏️ Use: *${prefix}nome_gp Novo nome do grupo*`);
  await conn.groupUpdateSubject(from, q.trim());
  return reply(`✅🌸 Nome do grupo alterado para *${q.trim()}*.`);
}
break;

case "\x66\x6f\x74\x6f\x5f\x67\x70": {
  if (!SoDono) return reply(mess.onlyOwner());
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  const mediaTarget = getCurrentOrQuotedMedia(info);
  if (!mediaTarget?.message || getContentType(mediaTarget.message) !== "\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65")
    return reply(`🖼️ Envie uma *imagem com ${prefix}foto_gp na legenda* ou responda uma imagem com o comando.`);

  try {
    const media = await downloadMediaMessage(mediaTarget, "\x62\x75\x66\x66\x65\x72", {});
    await conn.updateProfilePicture(from, media);
    return reply("\u2705\ud83c\x20\x46\x6f\x74\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x64\x61\x2e");
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x66\x6f\x74\x6f\x5f\x67\x70\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x61\x20\x66\x6f\x74\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e");
  }
}
break;

case "\x66\x6f\x74\x6f\x5f\x6d\x65\x6e\x75": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x70\x6f\x64\x65\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x63\x72\xed\x74\x69\x63\x61\x73\x20\x64\x6f\x20\x62\x6f\x74\x2e");
  const mediaTarget = getCurrentOrQuotedMedia(info);
  if (!mediaTarget?.message || getContentType(mediaTarget.message) !== "\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65")
    return reply(`🌸 Envie uma *imagem com ${prefix}foto_menu na legenda* ou responda uma imagem com o comando.`);

  try {
    const media = await downloadMediaMessage(mediaTarget, "\x62\x75\x66\x66\x65\x72", {});
    const sharpModule = await import("\x73\x68\x61\x72\x70");
    const sharp = sharpModule.default || sharpModule;
    const output = await sharp(media).png().toBuffer();
    const menuPath = path.join(process.cwd(), "\x73\x65\x74\x74\x69\x6e\x67\x73", "\x4c\x4f\x47\x4f\x53", "\x6d\x65\x6e\x75\x2e\x70\x6e\x67");
    fs.mkdirSync(path.dirname(menuPath), { recursive: true });
    fs.writeFileSync(menuPath, output);
    return reply("\u2705\ud83c\x20\x46\x6f\x74\x6f\x20\x64\x6f\x73\x20\x6d\x65\x6e\x75\x73\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x64\x61\x2e");
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x66\x6f\x74\x6f\x5f\x6d\x65\x6e\x75\x3a", e);
    return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x73\x61\x6c\x76\x61\x72\x20\x61\x20\x6e\x6f\x76\x61\x20\x66\x6f\x74\x6f\x20\x64\x6f\x20\x6d\x65\x6e\x75\x2e");
  }
}
break;

case "\x61\x6e\x74\x69\x70\x76": {
  if (!SoDonoPrincipal) return reply("\ud83d\x20\x41\x70\x65\x6e\x61\x73\x20\x6f\x20\x2a\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x2a\x20\x70\x6f\x64\x65\x20\x61\x6c\x74\x65\x72\x61\x72\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\xe7\xf5\x65\x73\x20\x63\x72\xed\x74\x69\x63\x61\x73\x20\x64\x6f\x20\x62\x6f\x74\x2e");

  const aliases = {
    on:"\x61\x76\x69\x73\x6f",
    aviso:"\x61\x76\x69\x73\x6f",
    avisar:"\x61\x76\x69\x73\x6f",
    warn:"\x61\x76\x69\x73\x6f",
    bloquear:"\x62\x6c\x6f\x71\x75\x65\x61\x72",
    block:"\x62\x6c\x6f\x71\x75\x65\x61\x72",
    aluguel:"\x61\x6c\x75\x67\x75\x65\x6c",
    alugar:"\x61\x6c\x75\x67\x75\x65\x6c",
    redirecionar:"\x61\x6c\x75\x67\x75\x65\x6c",
    redirect:"\x61\x6c\x75\x67\x75\x65\x6c",
    off:"\x6f\x66\x66",
    desligar:"\x6f\x66\x66"
  };

  const raw = String(args[0] || "").toLowerCase();
  const op = aliases[raw] || "";

  if (!op) {
    const cfg = readSettingsFile();
    const current = String(cfg?.antiPvMode || (cfg?.antiPv ? "\x61\x76\x69\x73\x6f" : "\x6f\x66\x66")).toLowerCase();
    const label = {
      aviso:"\u26a0\ufe0f\x20\x41\x56\x49\x53\x4f",
      bloquear:"\ud83d\x20\x42\x4c\x4f\x51\x55\x45\x41\x52",
      aluguel:"\ud83d\x20\x41\x4c\x55\x47\x55\x45\x4c",
      off:"\u274c\x20\x44\x45\x53\x41\x54\x49\x56\x41\x44\x4f"
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
  cfg.antiPv = op !== "\x6f\x66\x66";
  writeSettingsFile(cfg);

  const response = {
    aviso:
      "⚠️🐉 *Anti-PV modo AVISO ativado.*\nQuem chamar no PV recebe um aviso e você será notificado.",
    bloquear:
      "🚫🐉 *Anti-PV modo BLOQUEAR ativado.*\nQuem chamar no PV será avisado e bloqueado automaticamente.",
    aluguel:
      "💼🐉 *Anti-PV modo ALUGUEL ativado.*\nQuem chamar no PV será redirecionado para:\nhttps://wa.me/5515997075304?text=Quero%20alugar%20o%20bot%2C%20como%20fa%C3%A7o%3F",
    off:
      "\u274c\ud83d\x20\x2a\x41\x6e\x74\x69\x2d\x50\x56\x20\x64\x65\x73\x61\x74\x69\x76\x61\x64\x6f\x2e\x2a"
  };

  return reply(response[op]);
}
break;
//

// dono
case "\x72\x65\x69\x6e\x69\x63\x69\x61\x72":
case "rr":
if (!SoDono) return reply(mess.onlyOwner());
reply("\x2a\x52\x65\x69\x6e\x69\x63\x69\x61\x6e\x64\x6f\x20\x6f\x20\x62\x6f\x74\x2e\x2e\x2e\x2a");
setTimeout(() => {
process.exit();
}, 1200);
break;
//

// 🛡️ ADMIN PRO v0.2.0
case "\x72\x65\x67\x72\x61\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  const rules = getRules(from);
  if (!rules) return reply(`📜🐉 *REGRAS DO GRUPO*\n\nNenhuma regra foi configurada ainda.\n\n🛡️ ADM: use *${prefix}setregras texto*`);
  return reply(`╭━━〔 📜 *REGRAS DO GRUPO* 〕━━╮\n\n${rules}\n\n╰━━〔 🐉 KOBAYASHI BOT 〕━━╯`);
}
break;

case "\x73\x65\x74\x72\x65\x67\x72\x61\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!q.trim()) return reply(`📜 Use: *${prefix}setregras suas regras aqui*\n🗑️ Para apagar: *${prefix}delregras*`);
  setRules(from, q, sender);
  addAdminLog(from, { type: "\x73\x65\x74\x72\x65\x67\x72\x61\x73", actor: sender, detail: "\x52\x65\x67\x72\x61\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x64\x61\x73" });
  return reply("\u2705\ud83d\x20\x52\x65\x67\x72\x61\x73\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x61\x74\x75\x61\x6c\x69\x7a\x61\x64\x61\x73\x20\x63\x6f\x6d\x20\x73\x75\x63\x65\x73\x73\x6f\x2e");
}
break;

case "\x64\x65\x6c\x72\x65\x67\x72\x61\x73":
case "\x72\x6d\x72\x65\x67\x72\x61\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  clearRules(from);
  addAdminLog(from, { type: "\x64\x65\x6c\x72\x65\x67\x72\x61\x73", actor: sender, detail: "\x52\x65\x67\x72\x61\x73\x20\x72\x65\x6d\x6f\x76\x69\x64\x61\x73" });
  return reply("\ud83d\ufe0f\ud83d\x20\x52\x65\x67\x72\x61\x73\x20\x72\x65\x6d\x6f\x76\x69\x64\x61\x73\x2e");
}
break;

case "\x61\x6e\x6f\x74\x61\x63\x61\x6f":
case "\x61\x6e\x6f\x74\x61\x72": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!q.trim()) return reply(`📝 Use: *${prefix}anotacao texto da anotação*`);
  const note = addNote(from, q, sender);
  addAdminLog(from, { type: "\x61\x6e\x6f\x74\x61\x63\x61\x6f", actor: sender, detail: `Nota #${note.id} criada` });
  return reply(`✅📝 Anotação *#${note.id}* salva.\n\n${note.text}`);
}
break;

case "\x61\x6e\x6f\x74\x61\x63\x6f\x65\x73":
case "\x6e\x6f\x74\x61\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const notes = listNotes(from);
  if (!notes.length) return reply("\ud83d\x20\x4e\xe3\x6f\x20\x68\xe1\x20\x61\x6e\x6f\x74\x61\xe7\xf5\x65\x73\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x74\x69\x76\x61\x73\x20\x6e\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e");
  const lines = notes.slice(-30).map(n => `*#${n.id}* • ${n.text}\n   👤 @${String(n.by||'').split('@')[0] || '\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f'}`).join("\n\n");
  const mentions = [...new Set(notes.map(n=>n.by).filter(Boolean))];
  return conn.sendMessage(from, { text:`╭━━〔 📝 *ANOTAÇÕES ADM* 〕━━╮\n\n${lines}\n\n╰━━━━━━━━━━━━━━━━━━╯`, mentions }, { quoted: info });
}
break;

case "\x64\x65\x6c\x61\x6e\x6f\x74\x61\x63\x61\x6f":
case "\x72\x6d\x61\x6e\x6f\x74\x61\x63\x61\x6f": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const id = Number(args[0]);
  if (!Number.isInteger(id)) return reply(`🗑️ Use: *${prefix}delanotacao 3*`);
  const ok = removeNote(from, id);
  return reply(ok ? `✅ Anotação *#${id}* removida.` : `❌ Não encontrei a anotação #${id}.`);
}
break;

case "\x6c\x69\x6d\x70\x61\x72\x61\x6e\x6f\x74\x61\x63\x6f\x65\x73": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  const count = clearNotes(from);
  return reply(`🧹 ${count} anotação(ões) removida(s).`);
}
break;

case "\x6c\x69\x73\x74\x61\x6e\x65\x67\x72\x61":
case "\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74": {
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
  if (!["\x61\x64\x64","\x61\x64\x69\x63\x69\x6f\x6e\x61\x72","+","\x64\x65\x6c","\x72\x65\x6d\x6f\x76\x65\x72","\x72\x65\x6d\x6f\x76\x65","-"].includes(action)) return reply(`⛔ Use:\n${prefix}listanegra add @membro motivo\n${prefix}listanegra del @membro\n${prefix}listanegra`);
  if (!target) return reply("\ud83d\x20\x4d\x61\x72\x71\x75\x65\x20\x6f\x75\x20\x72\x65\x73\x70\x6f\x6e\x64\x61\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x6f\x20\x75\x73\x75\xe1\x72\x69\x6f\x2e");
  if (target === dono || isMainOwnerJid(target)) return reply("\ud83d\x20\x4f\x20\x64\x6f\x6e\x6f\x20\x70\x72\x69\x6e\x63\x69\x70\x61\x6c\x20\x6e\xe3\x6f\x20\x70\x6f\x64\x65\x20\x65\x6e\x74\x72\x61\x72\x20\x6e\x61\x20\x6c\x69\x73\x74\x61\x20\x6e\x65\x67\x72\x61\x2e");
  if (["\x61\x64\x64","\x61\x64\x69\x63\x69\x6f\x6e\x61\x72","+"].includes(action)) {
    const reason = args.slice(2).join(" ").trim();
    if (!reason) return reply(`⚠️ Informe o motivo.\nExemplo: *${prefix}listanegra add @membro golpes*`);
    addBlacklist(from,target,sender,reason);
    // Além de registrar o bloqueio local, vasculha TODOS os grupos
    // onde a Kobayashi é ADM e remove a pessoa imediatamente.
    const blacklistRemoval = await purgeUserFromAdminGroups(conn, target, {
      announce:true,
      source:"\x4c\x69\x73\x74\x61\x20\x4e\x65\x67\x72\x61"
    });
    addPunishmentHistory(from, target, {
      type: "\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x5f\x61\x64\x64",
      reason,
      by: sender,
      source: "\x6d\x61\x6e\x75\x61\x6c"
    });
    addAdminLog(from,{type:"\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x5f\x61\x64\x64",actor:sender,target,detail:reason});
    return conn.sendMessage(from,{
      text:
        `⛔ @${target.split('@')[0]} adicionado à lista negra.\n` +
        `📝 Motivo: *${reason}*\n\n` +
        `🌐 *VARREDURA DE GRUPOS*\n` +
        `🔎 Verificados: *${blacklistRemoval.checked}*\n` +
        `🛡️ Kobayashi ADM: *${blacklistRemoval.adminGroups}*\n` +
        `👤 Encontrado em: *${blacklistRemoval.found}*\n` +
        `🔨 Removido de: *${blacklistRemoval.removed}*\n` +
        `❌ Falhas: *${blacklistRemoval.failures}*\n\n` +
        `🚪 Neste grupo, se entrar novamente, continuará sendo removido automaticamente.`,
      mentions:[target]
    },{quoted:info});
  }
  const ok=removeBlacklist(from,target);
  if (ok) {
    addPunishmentHistory(from, target, {
      type: "\x62\x6c\x61\x63\x6b\x6c\x69\x73\x74\x5f\x72\x65\x6d\x6f\x76\x65",
      reason: "\x52\x65\x6d\x6f\x76\x69\x64\x6f\x20\x64\x61\x20\x6c\x69\x73\x74\x61\x20\x6e\x65\x67\x72\x61",
      by: sender,
      source: "\x6d\x61\x6e\x75\x61\x6c"
    });
  }
  return conn.sendMessage(from,{text:ok?`✅ @${target.split('@')[0]} removido da lista negra.`:`⚠️ @${target.split('@')[0]} não estava na lista negra.`,mentions:[target]},{quoted:info});
}
break;

case "\x72\x65\x76\x6f\x67\x61\x72\x6c\x69\x6e\x6b":
case "\x72\x65\x73\x65\x74\x6c\x69\x6e\x6b": {
  if (!isGroup) return reply(mess.onlyGroup());
  if (!isGroupAdmins) return reply(mess.onlyAdmins());
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  try {
    await conn.groupRevokeInvite(from);
    addAdminLog(from,{type:"\x72\x65\x76\x6f\x67\x61\x72\x6c\x69\x6e\x6b",actor:sender,detail:"\x4c\x69\x6e\x6b\x20\x64\x65\x20\x63\x6f\x6e\x76\x69\x74\x65\x20\x72\x65\x76\x6f\x67\x61\x64\x6f"});
    return reply("\u2705\ud83d\x20\x4c\x69\x6e\x6b\x20\x61\x6e\x74\x69\x67\x6f\x20\x72\x65\x76\x6f\x67\x61\x64\x6f\x2e\x20\x55\x73\x65\x20\x2f\x6c\x69\x6e\x6b\x67\x70\x20\x70\x61\x72\x61\x20\x67\x65\x72\x61\x72\x2f\x76\x65\x72\x20\x6f\x20\x6e\x6f\x76\x6f\x20\x6c\x69\x6e\x6b\x2e");
  } catch (e) { console.error('\x5b\x52\x45\x56\x4f\x47\x41\x52\x4c\x49\x4e\x4b\x5d',e?.message||e); return reply("\u274c\x20\x4e\xe3\x6f\x20\x63\x6f\x6e\x73\x65\x67\x75\x69\x20\x72\x65\x76\x6f\x67\x61\x72\x20\x6f\x20\x6c\x69\x6e\x6b\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e"); }
}
break;

case "\x62\x61\x6e\x67\x68\x6f\x73\x74": {
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
  if (String(args[1]||'').toLowerCase() !== '\x63\x6f\x6e\x66\x69\x72\x6d\x61\x72') {
    const preview=candidates.slice(0,20).map((j,i)=>`${i+1}. @${j.split('@')[0]}`).join('\n');
    return conn.sendMessage(from,{text:`👻 *BANGHOST — PRÉVIA*\n\nCritério: sem atividade há *${days} dias*\nEncontrados: *${candidates.length}*\n\n${preview}${candidates.length>20?'\n…':''}\n\n⚠️ Para remover, use:\n*${prefix}banghost ${days} confirmar*`,mentions:candidates.slice(0,20)},{quoted:info});
  }
  const batch=candidates.slice(0,50);
  await conn.groupParticipantsUpdate(from,batch,'\x72\x65\x6d\x6f\x76\x65').catch(()=>{});
  addAdminLog(from,{type:'\x62\x61\x6e\x67\x68\x6f\x73\x74',actor:sender,detail:`${batch.length} ghosts removidos • ${days} dias`});
  return reply(`👻🔨 *BANGHOST concluído*\n\nRemovidos: *${batch.length}*\nCritério: *${days} dias sem atividade*.`);
}
break;

// adm
case "\x70\x72\x6f\x6d\x6f\x76\x65\x72":
if (!isGroupAdmins) return reply(mess.onlyAdmins());
if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
if (!menc_os2 || menc_jid2?.[1])
return reply("\x4d\x61\x72\x71\x75\x65\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x6f\x20\x75\x73\x75\xe1\x72\x69\x6f\x20\x6f\x75\x20\x6d\x61\x72\x71\x75\x65\x20\x6f\x20\x40\x20\x64\x65\x6c\x65\x2e\x20\x4c\x65\x6d\x62\x72\x65\x2d\x73\x65\x20\x64\x65\x20\x6d\x61\x72\x63\x61\x72\x20\x61\x70\x65\x6e\x61\x73\x20\x75\x6d\x20\x75\x73\x75\xe1\x72\x69\x6f\x2e");
if (!JSON.stringify(groupMembers).includes(menc_os2))
return reply("\x45\x73\x74\x65\x20\x75\x73\x75\xe1\x72\x69\x6f\x20\x66\x6f\x69\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x6f\x75\x20\x73\x61\x69\x75\x2e\x20\x4e\xe3\x6f\x20\x73\x65\x72\xe1\x20\x70\x6f\x73\x73\xed\x76\x65\x6c\x20\x70\x72\x6f\x6d\x6f\x76\x65\x72\x2e");
conn.sendMessage(from, { text: `@${menc_os2.split("@")[0]} foi promovido(a) para admin com sucesso.`, mentions: [menc_os2] });
conn.groupParticipantsUpdate(from, [menc_os2], "\x70\x72\x6f\x6d\x6f\x74\x65");
break;

case "\x72\x65\x62\x61\x69\x78\x61\x72":
if (!isGroupAdmins) return reply(mess.onlyAdmins());
if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
if (!menc_os2 || menc_jid2?.[1])
return reply("\x4d\x61\x72\x71\x75\x65\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x6f\x20\x75\x73\x75\xe1\x72\x69\x6f\x20\x6f\x75\x20\x6d\x61\x72\x71\x75\x65\x20\x6f\x20\x40\x20\x64\x65\x6c\x65\x2e\x20\x4c\x65\x6d\x62\x72\x65\x2d\x73\x65\x20\x64\x65\x20\x6d\x61\x72\x63\x61\x72\x20\x61\x70\x65\x6e\x61\x73\x20\x75\x6d\x20\x75\x73\x75\xe1\x72\x69\x6f\x2e");
if (!JSON.stringify(groupMembers).includes(menc_os2))
return reply("\x45\x73\x74\x65\x20\x75\x73\x75\xe1\x72\x69\x6f\x20\x66\x6f\x69\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x20\x6f\x75\x20\x73\x61\x69\x75\x2e\x20\x4e\xe3\x6f\x20\x73\x65\x72\xe1\x20\x70\x6f\x73\x73\xed\x76\x65\x6c\x20\x72\x65\x62\x61\x69\x78\x61\x72\x2e");
conn.sendMessage(from, { text: `@${menc_os2.split("@")[0]} foi rebaixado(a) para membro com sucesso.`, mentions: [menc_os2] });
conn.groupParticipantsUpdate(from, [menc_os2], "\x64\x65\x6d\x6f\x74\x65");
break;
//

// ex btn
case "\x62\x6f\x74\x61\x6f\x74\x65\x78\x74\x6f": {
const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x31" }, type: 1 },
{ buttonId: `${prefix}id2`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x32" }, type: 1 }
];
conn.sendMessage(from, {
text: "\x4f\x6c\xe1\x2c\x20\x65\x73\x73\x61\x20\xe9\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x63\x6f\x6d\x20\x62\x6f\x74\xe3\x6f",
footer: "\x4f\x6c\xe1\x20\x4d\x75\x6e\x64\x6f",
buttons,
headerType: 1
}, { quoted: info });
}
break;

case "\x62\x6f\x74\x61\x6f\x69\x6d\x61\x67\x65\x6d": {
const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x31" }, type: 1 },
{ buttonId: `${prefix}id2`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x32" }, type: 1 }
];
conn.sendMessage(from, {
image: { url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x64\x72\x6f\x70\x62\x6f\x78\x2e\x63\x6f\x6d\x2f\x73\x63\x6c\x2f\x66\x69\x2f\x79\x38\x64\x6d\x35\x61\x32\x69\x6c\x75\x6a\x76\x77\x64\x38\x64\x39\x76\x33\x72\x76\x2f\x65\x30\x35\x35\x62\x36\x63\x62\x33\x38\x31\x37\x33\x65\x33\x61\x65\x36\x30\x37\x36\x33\x62\x65\x30\x38\x66\x38\x36\x66\x61\x31\x2e\x6a\x70\x67\x3f\x72\x6c\x6b\x65\x79\x3d\x39\x7a\x6e\x39\x30\x75\x68\x78\x6a\x34\x31\x61\x6d\x67\x38\x72\x62\x6d\x6b\x61\x64\x35\x65\x76\x72\x26\x73\x74\x3d\x79\x61\x6f\x37\x38\x6b\x7a\x36\x26\x64\x6c\x3d\x31" },
caption: "\x4f\x6c\xe1\x2c\x20\x65\x73\x74\x61\x20\xe9\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x6f\x20\x62\x6f\x74\xe3\x6f\x20\x63\x6f\x6d\x20\x69\x6d\x61\x67\x65\x6d",
footer: "\x4f\x6c\xe1\x20\x4d\x75\x6e\x64\x6f",
buttons,
headerType: 1
}, { quoted: info });
}
break;

case "\x62\x6f\x74\x61\x6f\x76\x69\x64\x65\x6f": {
const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x31" }, type: 1 },
{ buttonId: `${prefix}id2`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x32" }, type: 1 }
];
conn.sendMessage(from, {
video: { url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x64\x72\x6f\x70\x62\x6f\x78\x2e\x63\x6f\x6d\x2f\x73\x63\x6c\x2f\x66\x69\x2f\x62\x30\x74\x6d\x36\x77\x75\x36\x68\x74\x79\x73\x70\x6b\x69\x68\x6f\x6b\x61\x33\x6f\x2f\x73\x73\x73\x74\x69\x6b\x2e\x69\x6f\x5f\x2d\x76\x61\x66\x5f\x69\x78\x5f\x31\x37\x38\x35\x33\x37\x39\x36\x34\x37\x30\x38\x37\x2e\x6d\x70\x34\x3f\x72\x6c\x6b\x65\x79\x3d\x76\x34\x7a\x61\x75\x79\x68\x39\x36\x76\x37\x6f\x66\x70\x34\x33\x71\x6a\x64\x6b\x77\x65\x79\x6f\x6f\x26\x73\x74\x3d\x36\x32\x72\x65\x64\x67\x77\x6d\x26\x64\x6c\x3d\x31" },
caption: "\x4f\x6c\xe1\x2c\x20\x65\x73\x74\x61\x20\xe9\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x64\x6f\x20\x62\x6f\x74\xe3\x6f\x20\x63\x6f\x6d\x20\x76\xed\x64\x65\x6f",
footer: "\x4f\x6c\xe1\x20\x4d\x75\x6e\x64\x6f",
buttons,
headerType: 1
}, { quoted: info });
}
break;

case "\x69\x6e\x74\x65\x72\x61\x74\x69\x76\x6f": {
const interactiveButtons = [
{ name: "\x71\x75\x69\x63\x6b\x5f\x72\x65\x70\x6c\x79", buttonParamsJson: JSON.stringify({ display_text: "\x52\x65\x73\x70\x6f\x6e\x64\x65\x72", id: `${prefix}id_resposta` }) },
{ name: "\x63\x74\x61\x5f\x75\x72\x6c", buttonParamsJson: JSON.stringify({ display_text: "\x41\x62\x72\x69\x72\x20\x6c\x69\x6e\x6b", url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x65\x78\x61\x6d\x70\x6c\x65\x2e\x63\x6f\x6d" }) },
{ name: "\x63\x74\x61\x5f\x63\x6f\x70\x79", buttonParamsJson: JSON.stringify({ display_text: "\x43\x6f\x70\x69\x61\x72\x20\x63\xf3\x64\x69\x67\x6f", id: "\x31\x32\x33\x34\x35", copy_code: "\x31\x32\x33\x34\x35" }) }
];
conn.sendMessage(from, {
text: "\x4f\x6c\xe1\x20\x4d\x75\x6e\x64\x6f\x21",
title: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x74\xed\x74\x75\x6c\x6f",
footer: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x72\x6f\x64\x61\x70\xe9",
interactiveButtons
}, { quoted: info });
}
break;

case "\x69\x6e\x74\x65\x72\x61\x74\x69\x76\x6f\x69\x6d\x61\x67\x65\x6d": {
const interactiveButtons = [
{ name: "\x71\x75\x69\x63\x6b\x5f\x72\x65\x70\x6c\x79", buttonParamsJson: JSON.stringify({ display_text: "\x52\x65\x73\x70\x6f\x6e\x64\x65\x72", id: `${prefix}id_resposta` }) },
{ name: "\x63\x74\x61\x5f\x75\x72\x6c", buttonParamsJson: JSON.stringify({ display_text: "\x41\x62\x72\x69\x72\x20\x6c\x69\x6e\x6b", url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x65\x78\x61\x6d\x70\x6c\x65\x2e\x63\x6f\x6d" }) },
{ name: "\x63\x74\x61\x5f\x63\x6f\x70\x79", buttonParamsJson: JSON.stringify({ display_text: "\x43\x6f\x70\x69\x61\x72\x20\x63\xf3\x64\x69\x67\x6f", id: "\x31\x32\x33\x34\x35", copy_code: "\x31\x32\x33\x34\x35" }) }
];
conn.sendMessage(from, {
image: { url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x64\x72\x6f\x70\x62\x6f\x78\x2e\x63\x6f\x6d\x2f\x73\x63\x6c\x2f\x66\x69\x2f\x79\x38\x64\x6d\x35\x61\x32\x69\x6c\x75\x6a\x76\x77\x64\x38\x64\x39\x76\x33\x72\x76\x2f\x65\x30\x35\x35\x62\x36\x63\x62\x33\x38\x31\x37\x33\x65\x33\x61\x65\x36\x30\x37\x36\x33\x62\x65\x30\x38\x66\x38\x36\x66\x61\x31\x2e\x6a\x70\x67\x3f\x72\x6c\x6b\x65\x79\x3d\x39\x7a\x6e\x39\x30\x75\x68\x78\x6a\x34\x31\x61\x6d\x67\x38\x72\x62\x6d\x6b\x61\x64\x35\x65\x76\x72\x26\x73\x74\x3d\x79\x61\x6f\x37\x38\x6b\x7a\x36\x26\x64\x6c\x3d\x31" },
caption: "\x4f\x6c\xe1\x20\x4d\x75\x6e\x64\x6f\x21",
title: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x74\xed\x74\x75\x6c\x6f",
footer: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x72\x6f\x64\x61\x70\xe9",
interactiveButtons
}, { quoted: info });
}
break;

case "\x69\x6e\x74\x65\x72\x61\x74\x69\x76\x6f\x76\x69\x64\x65\x6f": {
const interactiveButtons = [
{ name: "\x71\x75\x69\x63\x6b\x5f\x72\x65\x70\x6c\x79", buttonParamsJson: JSON.stringify({ display_text: "\x52\x65\x73\x70\x6f\x6e\x64\x65\x72", id: `${prefix}id_resposta` }) },
{ name: "\x63\x74\x61\x5f\x75\x72\x6c", buttonParamsJson: JSON.stringify({ display_text: "\x41\x62\x72\x69\x72\x20\x6c\x69\x6e\x6b", url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x65\x78\x61\x6d\x70\x6c\x65\x2e\x63\x6f\x6d" }) },
{ name: "\x63\x74\x61\x5f\x63\x6f\x70\x79", buttonParamsJson: JSON.stringify({ display_text: "\x43\x6f\x70\x69\x61\x72\x20\x63\xf3\x64\x69\x67\x6f", id: "\x31\x32\x33\x34\x35", copy_code: "\x31\x32\x33\x34\x35" }) }
];
conn.sendMessage(from, {
video: { url: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x64\x72\x6f\x70\x62\x6f\x78\x2e\x63\x6f\x6d\x2f\x73\x63\x6c\x2f\x66\x69\x2f\x62\x30\x74\x6d\x36\x77\x75\x36\x68\x74\x79\x73\x70\x6b\x69\x68\x6f\x6b\x61\x33\x6f\x2f\x73\x73\x73\x74\x69\x6b\x2e\x69\x6f\x5f\x2d\x76\x61\x66\x5f\x69\x78\x5f\x31\x37\x38\x35\x33\x37\x39\x36\x34\x37\x30\x38\x37\x2e\x6d\x70\x34\x3f\x72\x6c\x6b\x65\x79\x3d\x76\x34\x7a\x61\x75\x79\x68\x39\x36\x76\x37\x6f\x66\x70\x34\x33\x71\x6a\x64\x6b\x77\x65\x79\x6f\x6f\x26\x73\x74\x3d\x36\x32\x72\x65\x64\x67\x77\x6d\x26\x64\x6c\x3d\x31" },
caption: "\x4f\x6c\xe1\x20\x4d\x75\x6e\x64\x6f\x21",
title: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x74\xed\x74\x75\x6c\x6f",
footer: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x72\x6f\x64\x61\x70\xe9",
interactiveButtons
}, { quoted: info });
}
break;

case "\x6c\x69\x73\x74\x61": {
const interactiveButtons = [{
name: "\x73\x69\x6e\x67\x6c\x65\x5f\x73\x65\x6c\x65\x63\x74",
buttonParamsJson: JSON.stringify({
title: "\x56\x65\x72\x20\x6f\x70\xe7\xf5\x65\x73",
sections: [{
title: "\x4d\x65\x6e\x75",
rows: [
{ header: "\x48\x65\x61\x64\x65\x72", title: "\x4f\x70\xe7\xe3\x6f\x20\x31", description: "\x44\x65\x73\x63\x72\x69\xe7\xe3\x6f\x20\x31", id: `${prefix}opcao1` },
{ header: "\x48\x65\x61\x64\x65\x72", title: "\x4f\x70\xe7\xe3\x6f\x20\x32", description: "\x44\x65\x73\x63\x72\x69\xe7\xe3\x6f\x20\x32", id: `${prefix}opcao2` }
]
}]
})
}];
conn.sendMessage(from, {
text: "\x65\x73\x74\x61\x20\xe9\x20\x61\x20\x6c\x65\x67\x65\x6e\x64\x61",
title: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x74\xed\x74\x75\x6c\x6f",
footer: "\x65\x73\x74\x65\x20\xe9\x20\x6f\x20\x72\x6f\x64\x61\x70\xe9",
interactiveButtons
}, { quoted: info });
}
break;

case "\x62\x6f\x74\x61\x6f\x76\x32": {
 const buttons = [
{ buttonId: `${prefix}id1`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x31" }, type: 1 },
 { buttonId: `${prefix}id2`, buttonText: { displayText: "\x42\x6f\x74\xe3\x6f\x20\x32" }, type: 1 }
 ];
conn.sendMessage(from, {
text: "\x4f\x6c\xe1\x2c\x20\x65\x73\x73\x61\x20\xe9\x20\x61\x20\x6d\x65\x6e\x73\x61\x67\x65\x6d\x20\x63\x6f\x6d\x20\x42\x75\x74\x74\x6f\x6e\x56\x32",
footer: "\x4f\x6c\xe1\x20\x4d\x75\x6e\x64\x6f",
title: "\x54\xed\x74\x75\x6c\x6f\x20\x64\x6f\x20\x63\x61\x72\x64",
subtitle: "\x53\x75\x62\x74\xed\x74\x75\x6c\x6f\x20\x64\x6f\x20\x63\x61\x72\x64",
thumbnail: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x64\x72\x6f\x70\x62\x6f\x78\x2e\x63\x6f\x6d\x2f\x73\x63\x6c\x2f\x66\x69\x2f\x79\x38\x64\x6d\x35\x61\x32\x69\x6c\x75\x6a\x76\x77\x64\x38\x64\x39\x76\x33\x72\x76\x2f\x65\x30\x35\x35\x62\x36\x63\x62\x33\x38\x31\x37\x33\x65\x33\x61\x65\x36\x30\x37\x36\x33\x62\x65\x30\x38\x66\x38\x36\x66\x61\x31\x2e\x6a\x70\x67\x3f\x72\x6c\x6b\x65\x79\x3d\x39\x7a\x6e\x39\x30\x75\x68\x78\x6a\x34\x31\x61\x6d\x67\x38\x72\x62\x6d\x6b\x61\x64\x35\x65\x76\x72\x26\x73\x74\x3d\x79\x61\x6f\x37\x38\x6b\x7a\x36\x26\x64\x6c\x3d\x31",
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
console.error("\x45\x72\x72\x6f\x3a", e);
}
}

const __filename = fileURLToPath(import.meta.url);
if (process.env.NODE_OPTIONS?.includes("\x2d\x2d\x77\x61\x74\x63\x68") || process.argv.includes("\x2d\x2d\x77\x61\x74\x63\x68")) {
console.log(colors.yellow(`Hot reload ativo para '\x24\x7b\x5f\x5f\x66\x69\x6c\x65\x6e\x61\x6d\x65\x7d'`));
}
