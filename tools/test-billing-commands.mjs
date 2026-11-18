import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const cwd=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-billing-ui-'));process.chdir(dir);
try{
 const {handleBillingCommand}=await import('../lib/features/billing/commands.js');
 const {billingStore,configStore}=await import('../lib/features/billing/storage.js');
 const {writeRentalDb}=await import('../lib/features/rental/rentalSystem.js');
 const creator='5515997075304@s.whatsapp.net',other='5511000000000@s.whatsapp.net';
 let messages=[],relayed=[],deleted=0;
 const ctx={from:creator,sender:creator,identities:[creator],isGroup:false,prefix:'/',info:{key:{id:'test'}},reply:async text=>messages.push(text),conn:{user:{id:'bot'},sendMessage:async(jid,data)=>{if(data.delete)deleted++;else messages.push(data.text||data.caption)},relayMessage:async(jid,msg)=>relayed.push(msg)},generate:(jid,message)=>({key:{id:'menu'},message})};
 async function run(command,q='',extra={}){return handleBillingCommand({...ctx,command,q,...extra});}
 const options=()=>{const m=relayed.at(-1).interactiveMessage.nativeFlowMessage.buttons;return m.flatMap(b=>b.name==='single_select'?JSON.parse(b.buttonParamsJson).sections[0].rows.map(r=>r.id):[JSON.parse(b.buttonParamsJson).id]);};
 async function click(id){const parts=id.split(' ');await run(parts[0].slice(1),parts.slice(1).join(' '));}
 await run('mptoken','SHOULD-NOT-SAVE',{sender:other,identities:[other]});assert.equal(configStore.read().token,undefined);
 await run('mptoken','secret-test-value');assert.equal(configStore.read().token,'secret-test-value');assert.equal(deleted,1);assert(!messages.some(m=>m.includes('secret-test-value')));
 await run('mpteste','suite');assert.match(messages.at(-1),/21 verificações/);
 await run('mpteste','menu');assert.equal(options().length,4);assert(!options().some(o=>o.endsWith(' 45')));
 await click(options().find(o=>o.endsWith(' 30')));assert.equal(options().length,4);assert(options().some(o=>o.includes(' mais ')));
 await click(options().find(o=>o.endsWith(' 3')));assert.match(relayed.at(-1).interactiveMessage.body.text,/75,00/);
 await click(options()[0]);const order=Object.values(billingStore.read().orders)[0];assert(order.simulated);assert.equal(order.quantity,3);assert.equal(order.cents,7500);
 await run('mpteste','aprovar '+order.id);assert.equal(billingStore.read().orders[order.id].status,'approved');
 await run('mpteste','aprovar '+order.id,{sender:other,identities:[other]});assert.match(messages.at(-1),/exclusivos/);
 writeRentalDb({settings:{},groups:{'g1@g.us':{groupName:'Grupo Um',expiresAt:Date.now()+86400000,responsibleJid:creator},'g2@g.us':{groupName:'Grupo Dois',expiresAt:Date.now()+86400000,responsibleJid:creator},'g3@g.us':{groupName:'Outro cliente',expiresAt:Date.now()+86400000,responsibleJid:other}}});
 await run('renovar');const oldChoice=options()[0];await run('alugar',oldChoice.split(' ').slice(1).join(' '),{sender:other,identities:[other]});assert.match(messages.at(-1),/outro responsável/);
 await click(options().find(o=>o.endsWith(' 30')));assert.equal(options().filter(o=>o.includes(' marcar ')).length,2);
 await click(options().find(o=>o.endsWith(' 0')));assert.match(relayed.at(-1).interactiveMessage.body.text,/Selecionados: 1\/2/);
 await click(options().find(o=>o.includes(' resumo ')));const summary=relayed.at(-1).interactiveMessage.body.text;assert.match(summary,/25,00/);assert.match(summary,/Não renovar:\nGrupo Um/);assert.doesNotMatch(summary,/Outro cliente/);
 await run('renovar');await click(options().find(o=>o.endsWith(' 30')));await click(options().find(o=>o.includes(' todos ')));await click(options().find(o=>o.includes(' resumo ')));assert.match(relayed.at(-1).interactiveMessage.body.text,/Nenhum grupo/);const orderCount=Object.keys(billingStore.read().orders).length;await click(options().find(o=>o.includes(' encerrar ')));assert.equal(Object.keys(billingStore.read().orders).length,orderCount);assert.match(messages.at(-1),/não renovar registrada/);
 await run('alugar','',{isGroup:true});assert.match(messages.at(-1),/privado/);
 await run('meuspagamentos','',{sender:other,identities:[other]});assert.equal(messages.at(-1),'Nenhum pedido.');
 console.log('Billing UI: exclusividade do criador, segredo sem eco, exclusão, suite, planos exatos, quantidade, resumo, simulação, seleção de grupo zero e isolamento entre responsáveis OK.');
}finally{process.chdir(cwd);fs.rmSync(dir,{recursive:true,force:true});}
