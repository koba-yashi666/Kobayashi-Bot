import fs from "node:fs";
import path from "node:path";
import { targetOf, tag, sendMedia } from "./_utils.js";
import { mediaFor } from "../../../lib/features/social/dragonFunV09.js";
export const aliases=["abraco", "abracar"];
export default async function run(ctx){const target=targetOf(ctx);if(!target||target===ctx.sender)return ctx.reply(`• Mencione o "@" ou responda a mensagem de alguém. 🤷‍♀️\n• Exemplo: *${ctx.prefix}${ctx.command} @membro*`);const actor=tag(ctx.sender),targetTag=tag(target);const caption=`Abraço caloroso! 🤗 ${actor} envolveu ${target} em um abraço super apertado e aconchegante! 💕`;return sendMedia(ctx,mediaFor(String(ctx.command||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")),caption,[ctx.sender,target]);}
