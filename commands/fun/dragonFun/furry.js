import fs from 'node:fs';
import { targetOf, displayJid, tag } from './_utils.js';

export const aliases = ['furry'];

export default async function run(ctx) {
  if (ctx.isGroup && !ctx.isFunModeEnabled(ctx.from)) {
    return ctx.reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n🛡️ Um ADM pode ativar com *${ctx.prefix}modobrincadeira*.`);
  }
  const target = await displayJid(ctx, targetOf(ctx) || ctx.sender);
  const percentual = Math.floor(Math.random() * 91) + 10;
  const resultado = percentual < 40 ? 'Furry em desenvolvimento'
    : percentual < 70 ? 'Se assumindo furry' : 'Furry completo';
  return ctx.conn.sendMessage(ctx.from, {
    video: fs.readFileSync(new URL('../../../media/brincadeiras/furry.mp4', import.meta.url)),
    gifPlayback: true,
    mentions: [target],
    caption: `🐉🐾 *MEDIDOR FURRY*\n\n${tag(target)} é *${percentual}% furry*.\n🦊 ${resultado}\n\n☕ Kobayashi Bot • Só pela zoeira!`
  }, { quoted: ctx.info });
}
