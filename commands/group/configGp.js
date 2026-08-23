import { getWelcomeConfig } from "../../lib/features/welcomeConfig.js";
import { readGroupScheduleDb } from "../../lib/features/groupSchedule.js";
import { isAutoStickerEnabled } from "../../lib/features/autoSticker.js";
import { getWhitelist } from "../../lib/features/whitelist.js";
import { getAdminLogConfig } from "../../lib/features/adminLogs.js";

export default {
  name: "configgp",
  aliases: ["configgrupo", "painelgp"],
  category: "grupo",
  description: "Mostra as principais configurações do grupo.",
  usage: "configgp",
  permission: "ADM",

  async execute(ctx) {
    const {
      isGroup,
      permissions,
      reply,
      from,
      prefix,
      getGroupProtection,
      isFunModeEnabled,
    } = ctx;

    if (!isGroup) {
      return reply("🐉🌸 Este painel só pode ser usado em grupos.");
    }

    if (!permissions.isAdmin) {
      return reply("🛡️ Apenas administradores podem abrir o painel de configurações.");
    }

    const welcome = getWelcomeConfig(from);
    const schedules = readGroupScheduleDb()?.[from] || {};
    const protection = getGroupProtection(from);
    const logs = getAdminLogConfig(from);

    const bool = (v) => v ? "🟢 ON" : "⚪ OFF";

    return reply(
      `╭══════ ❀ ⚙️ ❀ ══════╮\n` +
      `      *CONFIG DO GRUPO*\n` +
      `╰══════ ❀ 🐉 ❀ ══════╯\n\n` +

      `🌸 *Welcome:* ${bool(welcome.enabled)}\n` +
      `🎨 *AutoSticker:* ${bool(isAutoStickerEnabled(from))}\n` +
      `🎭 *Modo Brincadeira:* ${bool(isFunModeEnabled(from))}\n` +
      `📋 *Logs ADM:* ${bool(logs.enabled)}\n\n` +

      `╭──〔 🔐 PROTEÇÃO 〕──────╮\n` +
      `│ 🚫 AntiLink: ${bool(protection.antilink)}\n` +
      `│ 🔗 AntiLink GP: ${bool(protection.antilinkgp)}\n` +
      `│ ⚠️ AntiLink Light: ${bool(protection.antilinklight)}\n` +
      `│ ✈️ AntiTelegram: ${bool(protection.antitelegram)}\n` +
      `│ 🤍 Lista Branca: *${getWhitelist(from).length} membro(s)*\n` +
      `╰────── ❀ ─────────────╯\n\n` +

      `╭──〔 🕰️ HORÁRIOS 〕──────╮\n` +
      `│ 🟢 Abre: *${schedules.open || "não definido"}*\n` +
      `│ 🔒 Fecha: *${schedules.close || "não definido"}*\n` +
      `╰────── ❀ ─────────────╯\n\n` +

      `🌷 Ajustes continuam pelos comandos específicos.\n` +
      `Use *${prefix}help* para consultar os comandos novos.`
    );
  },
};
