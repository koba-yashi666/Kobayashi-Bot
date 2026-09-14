/* Kobayashi Protected Distribution v4.0.3 */
import { getCommandHelpCatalog } from "\x2e\x2e\x2f\x72\x65\x67\x69\x73\x74\x72\x79\x2e\x6a\x73";

export default {
  name: "\x68\x65\x6c\x70",
  aliases: ["\x61\x6a\x75\x64\x61", "\x63\x6d\x64\x68\x65\x6c\x70"],
  category: "\x67\x65\x72\x61\x6c",
  description: "\x45\x78\x70\x6c\x69\x63\x61\x20\x6f\x73\x20\x6e\x6f\x76\x6f\x73\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x73\x20\x6d\x6f\x64\x75\x6c\x61\x72\x65\x73\x2e",
  usage: "\x68\x65\x6c\x70\x20\x5b\x63\x6f\x6d\x61\x6e\x64\x6f\x5d",
  permission: "\x4d\x65\x6d\x62\x72\x6f",

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
