import {targetOf,displayJid,tag} from './_utils.js';
import {buildNoWaterMeme,downloadProfilePhoto} from '../../../lib/ui/noWaterMeme.js';

export const aliases=['naodeagua','naodenemagua'];

export default async function run(ctx){
  if(ctx.isGroup&&!ctx.isFunModeEnabled(ctx.from))return ctx.reply(`🔒 Ative o Modo Brincadeira com ${ctx.prefix}modobrincadeira.`);
  const raw=targetOf(ctx)||ctx.sender;
  const target=await displayJid(ctx,raw);
  let url;
  for(const id of [...new Set([target,raw])]){
    try{url=await ctx.conn.profilePictureUrl(id,'image');if(url)break;}catch{}
  }
  if(!url)return ctx.reply('🐉 Não consegui acessar a foto de perfil dessa pessoa. Ela pode estar sem foto ou com a privacidade restrita.');
  try{
    const image=await buildNoWaterMeme(await downloadProfilePhoto(url));
    return await ctx.conn.sendMessage(ctx.from,{image,caption:`🚫💧 Não dê nem água para ${tag(target)}!\n🐉 Kobayashi Bot • Só pela zoeira.`,mentions:[target]},{quoted:ctx.info});
  }catch{
    return ctx.reply('🐉 Não consegui montar o meme com essa foto. Tente novamente em instantes.');
  }
}
