import { getCommandHelpCatalog } from "../registry.js";

export default {
  name: "help",
  aliases: ["ajuda", "cmdhelp"],
  category: "geral",
  description: "Explica os novos comandos modulares.",
  usage: "help [comando]",
  permission: "Membro",

  async execute(ctx) {
    const { args, reply, prefix } = ctx;
    const catalog = getCommandHelpCatalog();
    const query = String(args?.[0] || "").toLowerCase();

    if (!query) {
      const lines = catalog
        .map((cmd) =>
          `• *${prefix}${cmd.name}* — ${cmd.description}`
        )
        .join("\n");

      return reply(
        `╭══════ ❀ 📖 ❀ ══════╮\n` +
        `          *AJUDA*\n` +
        `╰══════ ❀ 🐉 ❀ ══════╯\n\n` +
        `${lines}\n\n` +
        `🌸 Use *${prefix}help comando* para ver detalhes.`
      );
    }

    const cmd = catalog.find((item) =>
      item.name === query ||
      item.aliases.includes(query)
    );

    if (!cmd) {
      return reply(
        `🌸 Ainda não tenho uma ficha de ajuda para *${query}*.\n` +
        `Os comandos antigos continuarão entrando neste sistema aos poucos.`
      );
    }

    return reply(
      `╭──────「 📖 」──────╮\n` +
      `       *${cmd.name.toUpperCase()}*\n` +
      `╰──────────────────╯\n\n` +
      `📝 ${cmd.description}\n` +
      `🎐 Uso: *${prefix}${cmd.usage}*\n` +
      `🛡️ Permissão: *${cmd.permission}*\n` +
      `🗂️ Categoria: *${cmd.category}*`
    );
  },
};
