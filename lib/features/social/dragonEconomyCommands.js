import { getShopItems, buyShopItem, getShopUsage, farmAction, sellMarketItem, useMarketItem, earnDragonCoins, getMessageGoals, getSocialProfile } from './dragonSocial.js';
export const ECONOMY_COMMANDS = ['loja','menuloja','menushop','comprar','buy','plantar','colher','vender','consumir','metas','economia','trabalhar','pescar','entrega','procurar'];
export function shopMenu(prefix='/') {
  const items=getShopItems();
  const section=(title,types)=>`${title}\n`+items.filter(x=>types.includes(x.type)).map(x=>`${x.icon} ${x.name} • *${x.price}*\n↳ ${x.id}${x.type==='seed'?` • ${x.description}`:''}`).join('\n');
  return `╭─ 🐉 *LOJA DRAGON*\n│ Valores em Dragon-coins\n╰────────────\n\n`+
    section('🍱 *Mercado*',['food'])+'\n\n'+section('🌱 *Sementes*',['seed'])+'\n\n'+section('✨ *Extras*',['title','box','daily_boost'])+
    `\n\n${prefix}comprar ID quantidade (até 20)\n${prefix}inventario • ${prefix}carteira\n${prefix}plantar ID quantidade • ${prefix}colher\n${prefix}vender ID quantidade • ${prefix}consumir ID\nVendas: 60% do preço. Horta: 10 espaços.\n5 compras por dia; renovação às 06h de Brasília.\n\n⚔️ RPG-coins: exclusivas do RPG, em ${prefix}lojarpg.`;
}
export async function handleEconomyCommand(ctx) {
  const {command:c,sender,reply,args=[],prefix='/'}=ctx;
  if(!ECONOMY_COMMANDS.includes(c))return false;
  if(!ctx.isGroup){await reply('Use este comando em um grupo.');return true;}
  if(['loja','menuloja','menushop'].includes(c)) {const usage=getShopUsage(sender);await reply(shopMenu(prefix)+`\nCompras restantes: ${usage.remaining}/${usage.limit}`);}
  else if(['comprar','buy'].includes(c)) {
    const r=buyShopItem(sender,args[0],args[1]??1);
    await reply(r.ok?`🛍️ *${r.qty}× ${r.item.name}*\n💸 ${r.total} Dragon-coins\n💰 Saldo: ${r.coins}\nCompras restantes: ${r.shopRemaining}`:`❌ ${r.reason}`);
  } else if(['plantar','colher'].includes(c)) {
    const r=farmAction(sender,c,args[0],args[1]??1);
    await reply(!r.ok?r.reason:c==='plantar'?`🌱 Plantou ${r.qty}× ${r.crop.name}.\n⏳ ${r.crop.minutes}min para colher com ${prefix}colher.`:`🌾 *Colheita recebida!*\n${Object.entries(r.harvest).map(([id,n])=>`${id}: +${n}`).join('\n')}\nVenda com ${prefix}vender ID quantidade.`);
  } else if(c==='vender') {
    const r=sellMarketItem(sender,args[0],args[1]??1);await reply(r.ok?`💰 Vendeu ${r.qty}× ${r.item.name}: +${r.reward} Dragon-coins.\nSaldo: ${r.coins}`:r.reason);
  } else if(c==='consumir') {
    const r=useMarketItem(sender,args[0]);await reply(r.ok?`🍽️ Consumiu ${r.item.name}! Item usado do inventário.`:r.reason);
  } else if(c==='metas') {
    const m=getMessageGoals(sender);await reply(`🐉 *METAS DE MENSAGENS*\nHoje: ${m.count} mensagens válidas\n${m.goals.map(([n,reward])=>`${m.claimed.includes(n)?'✅':'🎯'} ${n} mensagens → ${reward} Dragon-coins`).join('\n')}\nColeta automática; renovação às 06h de Brasília.\nIntervalo mínimo: 15s. Comandos e textos repetidos não contam.`);
  } else if(c==='economia') {
    await reply(`🐉 *ECONOMIA DRAGON*\n💰 Dragon-coins: ${getSocialProfile(sender).coins}\n\n${prefix}daily — dias 1 a 7: 100/150/200/250/300/350/400; dia 7: +500 de bônus.\nIntervalo: 24h. Sem coletar por 48h, volta ao dia 1.\nNível geral: novo nível × 10 moedas.\n${prefix}metas — 10/100/400/1000 mensagens por dia.\n${prefix}trabalhar — 70–130 a cada 1h\n${prefix}pescar — 60–160 a cada 2h\n${prefix}entrega — 100–200 a cada 3h\n${prefix}procurar — 120–240 a cada 4h\n${prefix}loja • ${prefix}plantar • ${prefix}colher • ${prefix}vender\n\n⚔️ RPG-coins ficam no RPG; use ${prefix}rpgperfil e ${prefix}lojarpg com o modo RPG ativo. As moedas não são convertidas.`);
  } else {
    const r=earnDragonCoins(sender,c);await reply(r.ok?`🐉 ${r.job.name}: +${r.reward} Dragon-coins!\n💰 Saldo: ${r.coins}`:r.reason);
  }
  return true;
}
