import fs from 'node:fs';

export const aliases = ['duque'];

export default async function run(ctx) {
  if (ctx.isGroup && !ctx.isFunModeEnabled(ctx.from)) {
    return ctx.reply(`🔒 O *Modo Brincadeira* está desativado neste grupo.\n🛡️ Um ADM pode ativar com *${ctx.prefix}modobrincadeira*.`);
  }
  const percentual = Math.floor(Math.random() * 101);
  const humor = percentual < 30 ? 'Hoje até aceita dividir o café. ☕'
    : percentual < 70 ? 'Melhor chegar com café e falar baixinho. 👀'
      : 'O dragão acordou! Não testa a paciência dele. 🐉🔥';
  return ctx.conn.sendMessage(ctx.from, {
    image: fs.readFileSync(new URL('../../../media/brincadeiras/duque.jpg', import.meta.url)),
    caption: `🐉😤 *MEDIDOR DO DUQUE*\n\nDuque está *${percentual}% puto* hoje!\n${humor}\n\n☕ Kobayashi Bot • Só pela zoeira!`
  }, { quoted: ctx.info });
}
