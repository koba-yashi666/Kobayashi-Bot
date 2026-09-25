export function ctxInfo(info){return info?.message?.extendedTextMessage?.contextInfo||info?.message?.imageMessage?.contextInfo||info?.message?.videoMessage?.contextInfo||{};}
export function targetOf(ctx){const c=ctxInfo(ctx.info);return c?.mentionedJid?.[0]||c?.participant||null;}
export function tag(jid){return jid?`@${String(jid).split("@")[0]}`:"alguém";}
export async function displayJid(ctx,jid){if(!jid)return jid;try{return await ctx.resolveDisplayJid?.(jid)||jid;}catch{return jid;}}
export async function displayPair(ctx,actor,target){return [await displayJid(ctx,actor),await displayJid(ctx,target)];}
export async function sendMedia(ctx,url,caption,mentions=[]){const safe=[...new Set((mentions||[]).filter(Boolean))];if(!url)return ctx.conn.sendMessage(ctx.from,{text:caption,mentions:safe},{quoted:ctx.info});try{const isVideo=/\.(mp4|gif)(?:$|\?)/i.test(url);return await ctx.conn.sendMessage(ctx.from,isVideo?{video:{url},gifPlayback:true,caption,mentions:safe}:{image:{url},caption,mentions:safe},{quoted:ctx.info});}catch(e){console.error("[DRAGON FUN MEDIA]",ctx.command,e?.message||e);return ctx.conn.sendMessage(ctx.from,{text:caption,mentions:safe},{quoted:ctx.info});}}
