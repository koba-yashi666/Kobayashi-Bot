import configGp from "./group/configGp.js";
import configBot from "./owner/configBot.js";
import helpCommand from "./general/help.js";
import backupCommand from "./owner/backup.js";
import adminLogsCommand from "./admin/adminLogs.js";
import dragonCoreCommand from "./admin/dragonCore.js";
import dragonFunCommand from "./general/dragonFun.js";

export const modularCommands = [
  configGp,
  configBot,
  helpCommand,
  backupCommand,
  adminLogsCommand,
  dragonCoreCommand,
  dragonFunCommand,
];

export function findModularCommand(name) {
  const target = String(name || "").toLowerCase();

  return modularCommands.find((cmd) => {
    const names = [cmd.name, ...(cmd.aliases || [])]
      .map((x) => String(x).toLowerCase());

    return names.includes(target);
  }) || null;
}

export async function runModularCommand(name, ctx) {
  const command = findModularCommand(name);
  if (!command) return false;

  await command.execute(ctx);
  return true;
}

export function getCommandHelpCatalog() {
  return modularCommands.map((cmd) => ({
    name: cmd.name,
    aliases: cmd.aliases || [],
    category: cmd.category || "geral",
    description: cmd.description || "",
    usage: cmd.usage || cmd.name,
    permission: cmd.permission || "Membro",
  }));
}
