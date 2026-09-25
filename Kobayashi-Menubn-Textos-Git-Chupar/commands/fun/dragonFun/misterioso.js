import { targetOf, tag, sendMedia, displayJid } from "./_utils.js";
import { traitCaption } from "./_traitCaptions.js";
import { traitText, mediaFor } from "../../../lib/features/social/dragonFunV09.js";
export const aliases=["misterioso"];
export default async function run(ctx){const rawTarget=targetOf(ctx)||ctx.sender;const target=await displayJid(ctx,rawTarget);const value=Math.floor(Math.random()*101);const caption=traitCaption("misterioso",tag(target),value)||traitText("misterioso",tag(target),value);return sendMedia(ctx,mediaFor("misterioso"),caption,[target]);}
