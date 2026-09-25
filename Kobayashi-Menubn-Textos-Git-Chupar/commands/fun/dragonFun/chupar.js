import fs from "node:fs";
import path from "node:path";
import { targetOf, tag, displayPair } from "./_utils.js";

export const aliases = ["chupar"];

export default async function run(ctx) {
  const target = targetOf(ctx);
  if (!target || target === ctx.sender) {
    return ctx.reply(
      `• Mencione o "@" ou responda a mensagem de alguém. 🤷‍♀️\n` +
      `• Exemplo: *${ctx.prefix}${ctx.command} @membro*`
    );
  }

  const [actorJid, targetJid] = await displayPair(ctx, ctx.sender, target);
  const actor = tag(actorJid);
  const targetTag = tag(targetJid);
  const caption = `😏 ${actor} chupou o(a) ${targetTag} até gozar💦.`;

  try {
    const local = fs.readFileSync(path.join(process.cwd(), "media", "acoes", "chupar.mp4"));
    return ctx.conn.sendMessage(ctx.from, {
      video: local,
      gifPlayback: true,
      caption,
      mentions: [actorJid, targetJid]
    }, { quoted: ctx.info });
  } catch (e) {
    console.error("[DRAGON FUN/CHUPAR]", e?.message || e);
    return ctx.conn.sendMessage(ctx.from, {
      text: caption,
      mentions: [actorJid, targetJid]
    }, { quoted: ctx.info });
  }
}
