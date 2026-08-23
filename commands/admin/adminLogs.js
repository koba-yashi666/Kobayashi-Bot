import {
  getAdminLogConfig,
  setAdminLogEnabled,
  getAdminLogs,
} from "../../lib/features/adminLogs.js";

function shortJid(jid) {
  if (!jid) return "—";
  return `@${String(jid).split("@")[0]}`;
}

export default {
  name: "logadm",
  aliases: ["logsadm", "ultimoslogs"],
  category: "admin",
  description: "Ativa logs administrativos ou consulta ações recentes.",
  usage: "logadm on|off|ver",
  permission: "ADM",

  async execute(ctx) {
    const {
      isGroup,
      permissions,
      args,
      reply,
      from,
    } = ctx;

    if (!isGroup) {
      return reply("🐉 Este comando só funciona em grupos.");
    }

    if (!permissions.isAdmin) {
      return reply("🛡️ Apenas administradores podem gerenciar os logs.");
    }

    const action = String(args?.[0] || "").toLowerCase();

    if (action === "on") {
      setAdminLogEnabled(from, true);
      return reply("✅📋 Logs administrativos ativados neste grupo.");
    }

    if (action === "off") {
      setAdminLogEnabled(from, false);
      return reply("🔒📋 Logs administrativos desativados.");
    }

    if (["ver", "lista", "listar"].includes(action) || ctx.command === "ultimoslogs") {
      const logs = getAdminLogs(from, 10);

      if (!logs.length) {
        return reply("🌸 Ainda não existem ações administrativas registradas.");
      }

      const lines = logs.map((log, i) =>
        `${i + 1}. *${String(log.type).toUpperCase()}*\n` +
        `   👤 ${shortJid(log.actor)}${log.target ? ` → ${shortJid(log.target)}` : ""}\n` +
        `   📝 ${log.detail || "Sem detalhes"}`
      ).join("\n\n");

      return reply(
        `╭──────「 📋 」──────╮\n` +
        `      *LOGS ADM*\n` +
        `╰──────────────────╯\n\n` +
        `${lines}`
      );
    }

    const cfg = getAdminLogConfig(from);

    return reply(
      `📋 *LOGS ADMINISTRATIVOS*\n\n` +
      `Status: ${cfg.enabled ? "🟢 ON" : "⚪ OFF"}\n\n` +
      `• /logadm on\n` +
      `• /logadm off\n` +
      `• /logadm ver`
    );
  },
};
