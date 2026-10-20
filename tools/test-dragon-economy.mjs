import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const old=process.cwd(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'koba-economy-')),realNow=Date.now;
process.chdir(tmp);
try {
 let now=1800000000000;Date.now=()=>now;
 fs.mkdirSync('files/database',{recursive:true});
 fs.writeFileSync('files/database/dragon-fun-v09.json',JSON.stringify({users:{a:{coins:500,bank:100},'5@lid':{coins:50}}}));
 fs.writeFileSync('files/database/dragon-social.json',JSON.stringify({users:{a:{coins:400,inventory:{},dailyBoosts:0},'5@s.whatsapp.net':{coins:200}}}));
 const e=await import('../lib/features/social/dragonSocial.js');
 const cmd=await import('../lib/features/social/dragonEconomyCommands.js');
 assert.equal(e.getDragonBalance('a'),1000);assert.equal(e.getDragonBalance('a'),1000);
 assert.equal(e.awardLevelUpCoins('a',10).reward,100);assert.equal(e.awardLevelUpCoins('a',10).reward,0);
 assert.equal(e.awardLevelUpCoins('a',1).reward,10);
 let expected=0;
 for(let day=1;day<=7;day++) {const r=e.claimDaily('daily');assert.equal(r.streak,day);assert.equal(r.reward,100+(day-1)*50+(day===7?500:0));expected+=r.reward;assert(!e.claimDaily('daily').ok);now+=86400000;}
 assert.equal(e.getDragonBalance('daily'),expected);assert.equal(e.claimDaily('daily').streak,1);now+=86400000*2;assert.equal(e.claimDaily('daily').streak,1);
 for(let i=1;i<=1000;i++){now+=15001;e.recordEconomyMessage('chat',{id:`msg-${i}`,text:`mensagem ${i}`});}
 assert.equal(e.getDragonBalance('chat'),1630);assert.equal(e.getMessageGoals('chat').count,1000);
 assert.equal(e.recordEconomyMessage('chat',{id:'msg-1000',text:'mensagem nova'}).reward,0);
 assert.equal(e.recordEconomyMessage('chat',{id:'cmd',text:'/metas',isCommand:true}).reward,0);
 assert(e.earnDragonCoins('a','trabalhar').ok);assert(!e.earnDragonCoins('a','trabalhar').ok);assert(e.earnDragonCoins('a','pescar').ok);
 e.setDragonBalance('farmer',5000);
 assert(!e.buyShopItem('farmer','tomate',-1).ok);assert(!e.buyShopItem('farmer','tomate',Infinity).ok);
 const bought=e.buyShopItem('farmer','semente_tomate',2);assert(bought.ok);assert.equal(bought.total,36);
 assert(e.farmAction('farmer','plantar','tomate',2).ok);assert(!e.farmAction('farmer','plantar','tomate',1).ok);assert(!e.farmAction('farmer','colher').ok);
 now+=3600000;const harvest=e.farmAction('farmer','colher');assert.equal(harvest.harvest.tomate,8);assert(!e.farmAction('farmer','colher').ok);
 assert(e.sellMarketItem('farmer','tomate',7).ok);assert(!e.sellMarketItem('farmer','tomate',2).ok);assert(e.useMarketItem('farmer','tomate').ok);assert(!e.useMarketItem('farmer','tomate').ok);
 assert(e.buyShopItem('farmer','Açaí').ok);
 e.linkEconomyIdentity('5@lid',[{id:'5@lid',phoneNumber:'5@s.whatsapp.net'}]);assert.equal(e.getDragonBalance('5@lid'),250);assert.equal(e.getDragonBalance('5@s.whatsapp.net'),250);
 e.linkEconomyIdentity('5@lid',[{id:'5@lid',phoneNumber:'5@s.whatsapp.net'}]);assert.equal(e.getDragonBalance('5@lid'),250);
 const f=await import('../lib/features/social/dragonFunV09.js');assert.equal(f.getUser('a').coins,e.getDragonBalance('a'));
 f.transfer('a','b',10);assert.equal(f.getUser('b').coins,10);assert.equal(e.getDragonBalance('b'),10);
 const msgs=[];assert(await cmd.handleEconomyCommand({command:'loja',sender:'a',isGroup:true,reply:t=>msgs.push(t)}));assert(msgs[0].includes('semente_tomate'));assert(msgs[0].includes('Dragon-coins'));
 assert(!await cmd.handleEconomyCommand({command:'rpgloja'}));
 const rpg=await import('../lib/features/rpg/dragonRpg.js');
 const rpgPlayer=rpg.createDragonRpgPlayer('farmer','Fazendeiro').player;
 const initialGold=rpgPlayer.gold,initialGeneral=e.getDragonBalance('farmer');
 e.claimDaily('farmer');assert.equal(rpg.getDragonRpgPlayer('farmer').gold,initialGold);
 const generalAfterDaily=e.getDragonBalance('farmer');assert(generalAfterDaily>initialGeneral);
 const purchase=rpg.buyRpgItem('farmer','pocao_pequena',1);
 assert(purchase.ok);assert.equal(e.getDragonBalance('farmer'),generalAfterDaily);assert(rpg.getDragonRpgPlayer('farmer').gold<initialGold);
 assert(rpg.formatRpgShop().includes('RPG-coins'));
 console.log('✅ Economia: migração única, PN/LID, daily 7 dias/bônus/reset, nível, metas, cooldowns, compra, plantação, colheita, venda e menu.');
} finally {Date.now=realNow;process.chdir(old);fs.rmSync(tmp,{recursive:true,force:true});}
