import { targetOf, tag, displayPair } from './_utils.js';
export const aliases = ['macetar'];
export default async function run(ctx) {
  const target = targetOf(ctx);
  if (!target || target === ctx.sender) return ctx.reply(`Mencione alguém ou responda à mensagem da pessoa.\nExemplo: ${ctx.prefix}macetar @membro`);
  const [actorJid, targetJid] = await displayPair(ctx, ctx.sender, target);
  return ctx.conn.sendMessage(ctx.from, {
    text: `🔥 ${tag(actorJid)} deixou ${tag(targetJid)} sem reação.`,
    mentions: [...new Set([actorJid, targetJid])]
  }, { quoted: ctx.info });
}
