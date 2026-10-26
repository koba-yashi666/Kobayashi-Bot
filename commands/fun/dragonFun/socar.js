import fs from "node:fs";
import path from "node:path";
import { targetOf, tag, displayPair } from "./_utils.js";
export const aliases = ["socar", "soco"];
export default async function run(ctx) {
  const target = targetOf(ctx);
  if (!target || target === ctx.sender) return ctx.reply(`• Mencione o "@" ou responda a mensagem de alguém. 🤷‍♀️\n• Exemplo: *${ctx.prefix}${ctx.command} @membro*`);
  const [actorJid, targetJid] = await displayPair(ctx, ctx.sender, target);
  const media = path.join(process.cwd(), "media", "brincadeiras", "socar.mp4");
  if (!fs.existsSync(media)) return ctx.reply("O GIF do /socar não foi encontrado. Atualize os arquivos do bot.");
  return ctx.conn.sendMessage(ctx.from, {
    video: fs.readFileSync(media),
    gifPlayback: true,
    caption: `${tag(actorJid)} espancou ${tag(targetJid)} que deixou ele sem dentes`,
    mentions: [...new Set([actorJid, targetJid])]
  }, { quoted: ctx.info });
}
