import { readSettingsFile, getConfiguredLeaders } from "../../lib/config/settingsStore.js";

export default {
  name: "configbot",
  aliases: ["painelbot"],
  category: "dono",
  description: "Mostra configurações gerais seguras do bot.",
  usage: "configbot",
  permission: "Dono",

  async execute(ctx) {
    const {
      permissions,
      reply,
      version,
      commandCount,
      groupsCount,
    } = ctx;

    if (!permissions.isOwner) {
      return reply("👑 Apenas o dono principal pode abrir este painel.");
    }

    const cfg = readSettingsFile();
    const leaders = getConfiguredLeaders();

    return reply(
      `╭══════ ❀ 👑 ❀ ══════╮\n` +
      `      *CONFIG DO BOT*\n` +
      `╰══════ ❀ 🐉 ❀ ══════╯\n\n` +
      `🤖 *Nome:* ${cfg.NomeDoBot || "Kobayashi Bot"}\n` +
      `🎐 *Prefixo:* ${cfg.prefix || "/"}\n` +
      `💮 *Versão:* ${version}\n` +
      `👑 *Líderes:* ${leaders.length}/5\n` +
      `👥 *Grupos:* ${groupsCount}\n` +
      `🧩 *Comandos:* ${commandCount}\n\n` +
      `🛡️ Tokens, chaves e caminhos internos ficam ocultos por segurança.\n` +
      `🌸 Kobayashi • Painel principal`
    );
  },
};
