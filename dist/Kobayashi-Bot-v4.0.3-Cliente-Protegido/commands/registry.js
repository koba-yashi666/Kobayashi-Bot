/* Kobayashi Protected Distribution v4.0.3 */
import configGp from "\x2e\x2f\x67\x72\x6f\x75\x70\x2f\x63\x6f\x6e\x66\x69\x67\x47\x70\x2e\x6a\x73";
import configBot from "\x2e\x2f\x6f\x77\x6e\x65\x72\x2f\x63\x6f\x6e\x66\x69\x67\x42\x6f\x74\x2e\x6a\x73";
import helpCommand from "\x2e\x2f\x67\x65\x6e\x65\x72\x61\x6c\x2f\x68\x65\x6c\x70\x2e\x6a\x73";
import backupCommand from "\x2e\x2f\x6f\x77\x6e\x65\x72\x2f\x62\x61\x63\x6b\x75\x70\x2e\x6a\x73";
import adminLogsCommand from "\x2e\x2f\x61\x64\x6d\x69\x6e\x2f\x61\x64\x6d\x69\x6e\x4c\x6f\x67\x73\x2e\x6a\x73";
import dragonCoreCommand from "\x2e\x2f\x61\x64\x6d\x69\x6e\x2f\x64\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x2e\x6a\x73";
import dragonFunCommand from "\x2e\x2f\x66\x75\x6e\x2f\x64\x72\x61\x67\x6f\x6e\x46\x75\x6e\x2e\x6a\x73";

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
    category: cmd.category || "\x67\x65\x72\x61\x6c",
    description: cmd.description || "",
    usage: cmd.usage || cmd.name,
    permission: cmd.permission || "\x4d\x65\x6d\x62\x72\x6f",
  }));
}
