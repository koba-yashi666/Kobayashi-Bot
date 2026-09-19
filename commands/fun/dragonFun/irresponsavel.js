import { targetOf, tag, sendMedia } from "./_utils.js";
import { traitCaption } from "./_traitCaptions.js";
import { traitText, mediaFor } from "../../../lib/features/social/dragonFunV09.js";
export const aliases=["irresponsavel"];
export default async function run(ctx){const target=targetOf(ctx)||ctx.sender;const value=Math.floor(Math.random()*101);const caption=traitCaption("irresponsavel",tag(target),value)||traitText("irresponsavel",tag(target),value);return sendMedia(ctx,mediaFor("irresponsavel"),caption,[target]);}
