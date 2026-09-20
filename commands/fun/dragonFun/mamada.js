import fs from "node:fs";
import path from "node:path";
import { targetOf, tag, sendMedia, displayPair } from "./_utils.js";
import { mediaFor } from "../../../lib/features/social/dragonFunV09.js";
export const aliases=["mamada"];
export default async function run(ctx){const target=targetOf(ctx);if(!target||target===ctx.sender)return ctx.reply(`• Mencione o "@" ou responda a mensagem de alguém. 🤷‍♀️\n• Exemplo: *${ctx.prefix}${ctx.command} @membro*`);const [actorJid,targetJid]=await displayPair(ctx,ctx.sender,target);const actor=tag(actorJid),targetTag=tag(targetJid);const caption=`😏 ${actor} foi dar uma atenção especial pro ${target}... e a Kobayashi decidiu não perguntar o que aconteceu. 💦`;try{const local=fs.readFileSync(path.join(process.cwd(),"media","acoes","mamada.mp4"));return ctx.conn.sendMessage(ctx.from,{video:local,gifPlayback:true,caption,mentions:[actorJid,targetJid]},{quoted:ctx.info});}catch(e){console.error("[DRAGON FUN/MAMADA]",e?.message||e);return ctx.conn.sendMessage(ctx.from,{text:caption,mentions:[actorJid,targetJid]},{quoted:ctx.info});}}
