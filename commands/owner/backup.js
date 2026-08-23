import {
  createDatabaseBackup,
  listDatabaseBackups,
} from "../../lib/core/backupManager.js";

export default {
  name: "backupdb",
  aliases: ["backup", "backups"],
  category: "dono",
  description: "Cria ou consulta backups internos das configurações.",
  usage: "backupdb [listar]",
  permission: "Dono",

  async execute(ctx) {
    const { permissions, args, reply } = ctx;

    if (!permissions.isOwner) {
      return reply("👑 Apenas o dono principal pode gerenciar backups.");
    }

    const action = String(args?.[0] || "").toLowerCase();

    if (["listar", "list", "lista"].includes(action)) {
      const backups = listDatabaseBackups(10);

      if (!backups.length) {
        return reply("🌸 Ainda não existem backups internos.");
      }

      return reply(
        `╭──────「 💾 」──────╮\n` +
        `        *BACKUPS*\n` +
        `╰──────────────────╯\n\n` +
        backups.map((_, i) => `💾 Backup ${i + 1}`).join("\n") +
        `\n\n🌸 Os detalhes internos ficam ocultos por segurança.`
      );
    }

    const result = createDatabaseBackup();

    return reply(
      `✅💾 *Backup concluído!*\n\n` +
      `📦 Bancos copiados: *${result.files}*\n` +
      `🕒 Criado agora com sucesso.\n\n` +
      `🌸 Recomendado antes de atualizações estruturais.`
    );
  },
};
