import {
  addScheduledTask,
  listScheduledTasks,
  removeScheduledTask,
  clearScheduledTasks,
  getGroupCoreConfig,
  updateGroupCoreConfig,
  createCoreBackup,
  getDragonCoreStatus,
} from "../../lib/features/dragonCore.js";
import { getAntiSpamConfig } from "../../lib/features/antiSpam.js";
import { getAntiTravaConfig } from "../../lib/features/antiTrava.js";
import { getAntiFakeConfig } from "../../lib/features/antiFake.js";

function taskLabel(type) {
  return ({ open: "🟢 Abrir grupo", close: "🔒 Fechar grupo", message: "💬 Mensagem", rules: "📖 Regras" })[type] || type;
}

export default {
  name: "dragoncore",
  aliases: ["agendar", "agendamentos", "seguranca", "core"],
  category: "admin",
  description: "Central da v0.8.3: agendamentos, segurança, diagnóstico e backup.",
  usage: "agendar <abrir|fechar|mensagem|regras> <HH:MM> [texto]",
  permission: "ADM",

  async execute(ctx) {
    const { isGroup, permissions, reply, from, prefix, args, sender, isBotGroupAdmins } = ctx;
    if (!isGroup) return reply("🐉 Este comando só funciona em grupos.");
    if (!permissions.isAdmin) return reply("🛡️ Apenas administradores podem usar o Dragon Core.");

    const invoked = String(ctx.command || "").toLowerCase();
    const action = String(args?.[0] || "").toLowerCase();

    if (invoked === "seguranca" || action === "seguranca") {
      const spam = getAntiSpamConfig(from);
      const trava = getAntiTravaConfig(from);
      const fake = getAntiFakeConfig(from);
      return reply(
        `╭━━〔 🛡️ *SEGURANÇA 2.0* 〕━━╮\n` +
        `┃ 🤖 Bot ADM: ${isBotGroupAdmins ? "✅" : "❌"}\n` +
        `┃ 🚨 AntiSpam: ${spam.enabled ? "🟢 ON" : "⚪ OFF"}\n` +
        `┃ 🧨 AntiTrava: ${trava.enabled ? "🟢 ON" : "⚪ OFF"}\n` +
        `┃ 🌎 AntiFake: ${fake.enabled ? "🟢 ON" : "⚪ OFF"}\n` +
        `┃ 📋 Auditoria: 🟢 ON\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `💡 As proteções continuam configuráveis pelos comandos próprios.`
      );
    }

    if (action === "fuso") {
      const zone = String(args?.[1] || "").trim();
      if (!zone) {
        return reply(`🌎 Fuso atual: *${getGroupCoreConfig(from).timezone}*\n\nUse: *${prefix}dragoncore fuso America/Sao_Paulo*`);
      }
      try {
        const cfg = updateGroupCoreConfig(from, { timezone: zone });
        return reply(`✅ Fuso do grupo alterado para *${cfg.timezone}*.`);
      } catch (e) {
        return reply(`❌ ${e.message}`);
      }
    }

    if (action === "backup") {
      try {
        const result = await createCoreBackup("manual");
        return reply(`💾🐉 Backup administrativo criado.\n📦 Arquivos protegidos: *${result.files}*\n\nO backup fica salvo internamente no banco do bot.`);
      } catch (e) {
        return reply(`❌ Falha ao criar backup: ${e.message}`);
      }
    }

    if (["listar", "lista", "list"].includes(action) || invoked === "agendamentos") {
      const tasks = listScheduledTasks(from);
      if (!tasks.length) return reply(`🕰️ Nenhum agendamento neste grupo.\n\nUse *${prefix}agendar* para ver os exemplos.`);
      const lines = tasks.map((t) => `• *${t.id}* — ${taskLabel(t.type)} às *${t.time}*${t.text ? `\n  ↳ ${t.text.slice(0, 80)}` : ""}`);
      return reply(`╭━━〔 🕰️ *AGENDAMENTOS* 〕━━╮\n${lines.join("\n")}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\nCancelar: *${prefix}agendar cancelar ID*`);
    }

    if (["cancelar", "remover", "rm"].includes(action)) {
      const id = String(args?.[1] || "").trim();
      if (!id) return reply(`Use: *${prefix}agendar cancelar ID*`);
      return reply(removeScheduledTask(from, id) ? `✅ Agendamento *${id}* cancelado.` : "❌ Não encontrei esse agendamento neste grupo.");
    }

    if (action === "limpar") {
      const count = clearScheduledTasks(from);
      return reply(`🧹 *${count}* agendamento(s) removido(s).`);
    }

    const typeMap = { abrir: "open", open: "open", fechar: "close", close: "close", mensagem: "message", msg: "message", regras: "rules", rules: "rules" };
    const type = typeMap[action];
    if (type) {
      try {
        const task = addScheduledTask(from, {
          type,
          time: args?.[1],
          text: args?.slice(2).join(" "),
          createdBy: sender,
        });
        return reply(
          `✅🐉 *AGENDAMENTO CRIADO*\n\n` +
          `🆔 ${task.id}\n` +
          `⚙️ ${taskLabel(task.type)}\n` +
          `🕰️ ${task.time}\n` +
          `🔁 Todos os dias\n` +
          `🌎 ${getGroupCoreConfig(from).timezone}` +
          `${task.text ? `\n💬 ${task.text}` : ""}`
        );
      } catch (e) {
        return reply(`❌ ${e.message}`);
      }
    }

    const status = getDragonCoreStatus();
    return reply(
      `╭══════ ❀ 🐉 ❀ ══════╮\n` +
      `    *DRAGON CORE v0.8.3*\n` +
      `╰══════ ❀ ⚙️ ❀ ══════╯\n\n` +
      `🕰️ *Agendamento 2.0*\n` +
      `• ${prefix}agendar abrir 08:00\n` +
      `• ${prefix}agendar fechar 23:00\n` +
      `• ${prefix}agendar mensagem 18:00 Boa noite!\n` +
      `• ${prefix}agendar regras 12:00\n` +
      `• ${prefix}agendar listar\n` +
      `• ${prefix}agendar cancelar ID\n\n` +
      `🛡️ *Segurança:* ${prefix}seguranca\n` +
      `🌎 *Fuso:* ${prefix}dragoncore fuso America/Sao_Paulo\n` +
      `💾 *Backup:* ${prefix}dragoncore backup\n\n` +
      `📊 Tarefas registradas no bot: *${status.tasks}*\n` +
      `🧬 Banco Dragon Core: schema *${status.schemaVersion}*`
    );
  },
};
