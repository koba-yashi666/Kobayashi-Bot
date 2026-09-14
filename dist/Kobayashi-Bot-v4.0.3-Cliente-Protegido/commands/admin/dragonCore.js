/* Kobayashi Protected Distribution v4.0.3 */
import {
  addScheduledTask,
  listScheduledTasks,
  removeScheduledTask,
  clearScheduledTasks,
  getGroupCoreConfig,
  updateGroupCoreConfig,
  createCoreBackup,
  getDragonCoreStatus,
} from "\x2e\x2e\x2f\x2e\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x63\x6f\x72\x65\x2f\x64\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x2e\x6a\x73";
import { getAntiSpamConfig } from "\x2e\x2e\x2f\x2e\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x6e\x74\x69\x53\x70\x61\x6d\x2e\x6a\x73";
import { getAntiTravaConfig } from "\x2e\x2e\x2f\x2e\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x6e\x74\x69\x54\x72\x61\x76\x61\x2e\x6a\x73";
import { getAntiFakeConfig } from "\x2e\x2e\x2f\x2e\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x6e\x74\x69\x46\x61\x6b\x65\x2e\x6a\x73";

function taskLabel(type) {
  return ({ open: "\ud83d\x20\x41\x62\x72\x69\x72\x20\x67\x72\x75\x70\x6f", close: "\ud83d\x20\x46\x65\x63\x68\x61\x72\x20\x67\x72\x75\x70\x6f", message: "\ud83d\x20\x4d\x65\x6e\x73\x61\x67\x65\x6d", rules: "\ud83d\x20\x52\x65\x67\x72\x61\x73" })[type] || type;
}

export default {
  name: "\x64\x72\x61\x67\x6f\x6e\x63\x6f\x72\x65",
  aliases: ["\x61\x67\x65\x6e\x64\x61\x72", "\x61\x67\x65\x6e\x64\x61\x6d\x65\x6e\x74\x6f\x73", "\x73\x65\x67\x75\x72\x61\x6e\x63\x61", "\x63\x6f\x72\x65"],
  category: "\x61\x64\x6d\x69\x6e",
  description: "\x43\x65\x6e\x74\x72\x61\x6c\x20\x64\x61\x20\x76\x30\x2e\x38\x2e\x33\x3a\x20\x61\x67\x65\x6e\x64\x61\x6d\x65\x6e\x74\x6f\x73\x2c\x20\x73\x65\x67\x75\x72\x61\x6e\xe7\x61\x2c\x20\x64\x69\x61\x67\x6e\xf3\x73\x74\x69\x63\x6f\x20\x65\x20\x62\x61\x63\x6b\x75\x70\x2e",
  usage: "\x61\x67\x65\x6e\x64\x61\x72\x20\x3c\x61\x62\x72\x69\x72\x7c\x66\x65\x63\x68\x61\x72\x7c\x6d\x65\x6e\x73\x61\x67\x65\x6d\x7c\x72\x65\x67\x72\x61\x73\x3e\x20\x3c\x48\x48\x3a\x4d\x4d\x3e\x20\x5b\x74\x65\x78\x74\x6f\x5d",
  permission: "\x41\x44\x4d",

  async execute(ctx) {
    const { isGroup, permissions, reply, from, prefix, args, sender, isBotGroupAdmins } = ctx;
    if (!isGroup) return reply("\ud83d\x20\x45\x73\x74\x65\x20\x63\x6f\x6d\x61\x6e\x64\x6f\x20\x73\xf3\x20\x66\x75\x6e\x63\x69\x6f\x6e\x61\x20\x65\x6d\x20\x67\x72\x75\x70\x6f\x73\x2e");
    if (!permissions.isAdmin) return reply("\ud83d\ufe0f\x20\x41\x70\x65\x6e\x61\x73\x20\x61\x64\x6d\x69\x6e\x69\x73\x74\x72\x61\x64\x6f\x72\x65\x73\x20\x70\x6f\x64\x65\x6d\x20\x75\x73\x61\x72\x20\x6f\x20\x44\x72\x61\x67\x6f\x6e\x20\x43\x6f\x72\x65\x2e");

    const invoked = String(ctx.command || "").toLowerCase();
    const action = String(args?.[0] || "").toLowerCase();

    if (invoked === "\x73\x65\x67\x75\x72\x61\x6e\x63\x61" || action === "\x73\x65\x67\x75\x72\x61\x6e\x63\x61") {
      const spam = getAntiSpamConfig(from);
      const trava = getAntiTravaConfig(from);
      const fake = getAntiFakeConfig(from);
      return reply(
        `╭━━〔 🛡️ *SEGURANÇA 2.0* 〕━━╮\n` +
        `┃ 🤖 Bot ADM: ${isBotGroupAdmins ? "✅" : "❌"}\n` +
        `┃ 🚨 AntiSpam: ${spam.enabled ? "\ud83d\x20\x4f\x4e" : "\u26aa\x20\x4f\x46\x46"}\n` +
        `┃ 🧨 AntiTrava: ${trava.enabled ? "\ud83d\x20\x4f\x4e" : "\u26aa\x20\x4f\x46\x46"}\n` +
        `┃ 🌎 AntiFake: ${fake.enabled ? "\ud83d\x20\x4f\x4e" : "\u26aa\x20\x4f\x46\x46"}\n` +
        `┃ 📋 Auditoria: 🟢 ON\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `💡 As proteções continuam configuráveis pelos comandos próprios.`
      );
    }

    if (action === "\x66\x75\x73\x6f") {
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

    if (action === "\x62\x61\x63\x6b\x75\x70") {
      try {
        const result = await createCoreBackup("\x6d\x61\x6e\x75\x61\x6c");
        return reply(`💾🐉 Backup administrativo criado.\n📦 Arquivos protegidos: *${result.files}*\n\nO backup fica salvo internamente no banco do bot.`);
      } catch (e) {
        return reply(`❌ Falha ao criar backup: ${e.message}`);
      }
    }

    if (["\x6c\x69\x73\x74\x61\x72", "\x6c\x69\x73\x74\x61", "\x6c\x69\x73\x74"].includes(action) || invoked === "\x61\x67\x65\x6e\x64\x61\x6d\x65\x6e\x74\x6f\x73") {
      const tasks = listScheduledTasks(from);
      if (!tasks.length) return reply(`🕰️ Nenhum agendamento neste grupo.\n\nUse *${prefix}agendar* para ver os exemplos.`);
      const lines = tasks.map((t) => `• *${t.id}* — ${taskLabel(t.type)} às *${t.time}*${t.text ? `\n  ↳ ${t.text.slice(0, 80)}` : ""}`);
      return reply(`╭━━〔 🕰️ *AGENDAMENTOS* 〕━━╮\n${lines.join("\n")}\n╰━━━━━━━━━━━━━━━━━━━━╯\n\nCancelar: *${prefix}agendar cancelar ID*`);
    }

    if (["\x63\x61\x6e\x63\x65\x6c\x61\x72", "\x72\x65\x6d\x6f\x76\x65\x72", "rm"].includes(action)) {
      const id = String(args?.[1] || "").trim();
      if (!id) return reply(`Use: *${prefix}agendar cancelar ID*`);
      return reply(removeScheduledTask(from, id) ? `✅ Agendamento *${id}* cancelado.` : "\u274c\x20\x4e\xe3\x6f\x20\x65\x6e\x63\x6f\x6e\x74\x72\x65\x69\x20\x65\x73\x73\x65\x20\x61\x67\x65\x6e\x64\x61\x6d\x65\x6e\x74\x6f\x20\x6e\x65\x73\x74\x65\x20\x67\x72\x75\x70\x6f\x2e");
    }

    if (action === "\x6c\x69\x6d\x70\x61\x72") {
      const count = clearScheduledTasks(from);
      return reply(`🧹 *${count}* agendamento(s) removido(s).`);
    }

    const typeMap = { abrir: "\x6f\x70\x65\x6e", open: "\x6f\x70\x65\x6e", fechar: "\x63\x6c\x6f\x73\x65", close: "\x63\x6c\x6f\x73\x65", mensagem: "\x6d\x65\x73\x73\x61\x67\x65", msg: "\x6d\x65\x73\x73\x61\x67\x65", regras: "\x72\x75\x6c\x65\x73", rules: "\x72\x75\x6c\x65\x73" };
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
