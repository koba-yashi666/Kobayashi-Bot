import fs from "node:fs";
import path from "node:path";
import { targetOf, tag, sendMedia, displayPair } from "./_utils.js";
import { mediaFor } from "../../../lib/features/social/dragonFunV09.js";
export const aliases=["abraco", "abracar"];
export default async function run(ctx){const target=targetOf(ctx);if(!target||target===ctx.sender)return ctx.reply(`• Mencione o "@" ou responda a mensagem de alguém. 🤷‍♀️\n• Exemplo: *${ctx.prefix}${ctx.command} @membro*`);const [actorJid,targetJid]=await displayPair(ctx,ctx.sender,target);const actor=tag(actorJid),targetTag=tag(targetJid);const caption=`Abraço caloroso! 🤗 ${actor} envolveu ${target} em um abraço super apertado e aconchegante! 💕`;return sendMedia(ctx,mediaFor(String(ctx.command||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")),caption,[actorJid,targetJid]);}
