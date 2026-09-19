import fs from "node:fs";
import path from "node:path";
import { targetOf, tag, sendMedia } from "./_utils.js";
import { mediaFor } from "../../../lib/features/social/dragonFunV09.js";
export const aliases=["gozar"];
export default async function run(ctx){const target=targetOf(ctx);if(!target||target===ctx.sender)return ctx.reply(`• Mencione o "@" ou responda a mensagem de alguém. 🤷‍♀️\n• Exemplo: *${ctx.prefix}${ctx.command} @membro*`);const actor=tag(ctx.sender),targetTag=tag(target);const caption=`😏 ${actor} aprontou com ${target}... 💦 Na próxima a Kobayashi nem quer saber.`;try{const local=fs.readFileSync(path.join(process.cwd(),"media","acoes","gozar.mp4"));return ctx.conn.sendMessage(ctx.from,{video:local,gifPlayback:true,caption,mentions:[ctx.sender,target]},{quoted:ctx.info});}catch(e){console.error("[DRAGON FUN/GOZAR]",e?.message||e);return ctx.conn.sendMessage(ctx.from,{text:caption,mentions:[ctx.sender,target]},{quoted:ctx.info});}}
