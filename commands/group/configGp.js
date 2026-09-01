import { getAdminLogConfig } from "../../lib/features/adminLogs.js";
import { getWelcomeConfig } from "../../lib/features/welcomeConfig.js";
import { readGroupScheduleDb } from "../../lib/features/groupSchedule.js";
import { isAutoStickerEnabled } from "../../lib/features/autoSticker.js";
import { getWhitelist } from "../../lib/features/whitelist.js";
import {
  exportGroupConfig,
  restoreGroupConfig,
} from "../../lib/features/groupConfigTransfer.js";

function normalizeAction(value = "") {
  return String(value).trim().toLowerCase();
}

export default {
  name: "configgp",
  aliases: ["configgrupo", "painelgp"],
  category: "grupo",
  description: "Mostra, exporta e restaura as configurações do grupo.",
  usage: "configgp | configgp exportar | configgp restaurar <código>",
  permission: "ADM",

  async execute(ctx) {
    const {
      isGroup,
      permissions,
      reply,
      from,
      prefix,
      args,
      getGroupProtection,
      isFunModeEnabled,
    } = ctx;

    if (!isGroup) {
      return reply("🐉🌸 Este painel só pode ser usado em grupos.");
    }

    if (!permissions.isAdmin) {
      return reply("🛡️ Apenas administradores podem abrir o painel de configurações.");
    }

    const action = normalizeAction(args?.[0]);

    if (["export", "exportar", "backup"].includes(action)) {
      try {
        const backup = exportGroupConfig(from);

        if (!backup.entryCount) {
          return reply(
            "⚠️ Não encontrei configurações exportáveis deste grupo nos bancos atuais.\n" +
            "O painel continua funcionando normalmente, mas não há dados salvos para gerar o backup."
          );
        }

        return reply(
          `╭══════ ❀ 📦 ❀ ══════╮\n` +
          `   *BACKUP DO GRUPO*\n` +
          `╰══════ ❀ 🐉 ❀ ══════╯\n\n` +
          `✅ Backup criado com *${backup.entryCount} configuração(ões)* em *${backup.fileCount} banco(s)*.\n\n` +
          `🔑 *Código de restauração:*\n${backup.code}\n\n` +
          `⚠️ Guarde esse código em local seguro.\n` +
          `Para restaurar, use:\n*${prefix}configgp restaurar <código>*`
        );
      } catch (error) {
        console.error("[ConfigGP] Erro ao exportar:", error?.message || error);
        return reply("❌ Não consegui exportar as configurações deste grupo.");
      }
    }

    if (["restore", "restaurar", "import", "importar"].includes(action)) {
      const code = String(args?.slice(1).join("") || "").trim();

      if (!code) {
        return reply(
          `📥 Para restaurar um backup, use:\n` +
          `*${prefix}configgp restaurar KCFG1.xxxxx*`
        );
      }

      try {
        const result = restoreGroupConfig(from, code);

        if (!result.restoredEntries) {
          return reply("⚠️ O backup foi lido, mas nenhuma configuração compatível pôde ser restaurada.");
        }

        return reply(
          `╭══════ ❀ ♻️ ❀ ══════╮\n` +
          ` *CONFIG RESTAURADA*\n` +
          `╰══════ ❀ 🐉 ❀ ══════╯\n\n` +
          `✅ *${result.restoredEntries} configuração(ões)* restaurada(s).\n` +
          `📂 Bancos atualizados: *${result.restoredFiles}*\n\n` +
          `🌸 Use *${prefix}configgp* para conferir o estado atual do grupo.`
        );
      } catch (error) {
        console.error("[ConfigGP] Erro ao restaurar:", error?.message || error);
        return reply(`❌ ${error?.message || "Não consegui restaurar esse backup."}`);
      }
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

      `╭──〔 💾 BACKUP 〕─────────╮\n` +
      `│ 📦 ${prefix}configgp exportar\n` +
      `│ ♻️ ${prefix}configgp restaurar <código>\n` +
      `╰────── ❀ ─────────────╯\n\n` +

      `🌷 Os ajustes individuais continuam pelos comandos específicos.`
    );
  },
};
