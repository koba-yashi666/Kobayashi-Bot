import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const cwd=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-rental-test-mode-')),oldFetch=globalThis.fetch;process.chdir(dir);
try{
 const {handleBillingCommand}=await import('../lib/features/billing/commands.js');
 const {rentalTestMode,resolveRentalTestInput,createRentalTestMode}=await import('../lib/features/billing/testMode.js');
 const {billingStore:productionStore,asaasConfigStore:config,jsonStore,DAY}=await import('../lib/features/billing/storage.js');
 const {readRentalDb,writeRentalDb}=await import('../lib/features/rental/rentalSystem.js');
 const {createBillingEngine}=await import('../lib/features/billing/engine.js');
 const owner='5515997075304@s.whatsapp.net',lid='888888@lid',other='5511888888888@s.whatsapp.net',bot='5511000000000@s.whatsapp.net';let api=0,joins=0;const left=[],messages=[],replies=[],relays=[];const members=new Set(['100@g.us','300@g.us']);
 globalThis.fetch=async()=>{api++;throw Error('External payments forbidden in test');};
 config.write({mode:'off',environment:'production',token:'PRODUCTION-SECRET-NOT-TOUCH',prices:{30:2700}});
 productionStore.write({orders:{untouched:{id:'untouched',owner:other,status:'pending',groups:[],cents:1700}},profiles:{},sessions:{},notices:{},numericMenus:{[owner]:{options:[['Old','/renovar']],at:Date.now()}}});
 const expiry=Date.now()+30*DAY;writeRentalDb({groups:{'100@g.us':{groupName:'Real contract',expiresAt:expiry,responsibleJid:other}},settings:{}});const snapshot=structuredClone(readRentalDb()),cfg=structuredClone(config.read());
 const conn={user:{id:bot},sendMessage:async(jid,data)=>{messages.push({jid,data});return {key:{id:'out'}}},relayMessage:async(jid,m)=>relays.push(m),groupGetInviteInfo:async code=>({id:code.startsWith('real')?'100@g.us':code.startsWith('existing')?'300@g.us':'200@g.us'}),groupFetchAllParticipating:async()=>Object.fromEntries([...members].map(id=>[id,{id,subject:id}])),groupMetadata:async jid=>{if(!members.has(jid))throw Error('not present');return {id:jid,subject:'Test '+jid,participants:[{id:bot},{id:lid,phoneNumber:owner}]};},groupAcceptInvite:async code=>{joins++;members.add('200@g.us');return '200@g.us';},groupLeave:async jid=>{left.push(jid);members.delete(jid);}};
 const base={from:lid,sender:lid,identities:[lid,owner],prefix:'/',isGroup:false,info:{key:{id:'in'}},conn,reply:async t=>replies.push(t),generate:(jid,message)=>({message,key:{id:'relay'}})};
 const run=(command,q='',extra={})=>handleBillingCommand({...base,command,q,...extra});
 const options=()=>relays.at(-1).viewOnceMessage.message.interactiveMessage.nativeFlowMessage.buttons.flatMap(b=>b.name==='single_select'?JSON.parse(b.buttonParamsJson).sections[0].rows.map(r=>r.id):[JSON.parse(b.buttonParamsJson).id]).filter(Boolean);
 const click=async full=>{assert(full);const [c,...args]=full.split(' ');await run(c.slice(1),args.join(' '));};
 await run('iniciarteste','',{sender:other,identities:[other],from:other,info:{message:{extendedTextMessage:{contextInfo:{participant:owner}}}}});assert(!rentalTestMode.state().active);assert.equal(joins,0);assert.match(replies.at(-1),/exclusivo/);
 await run('iniciarteste');assert(rentalTestMode.state().active);for(const command of ['/alugar','/renovar','/entrar','/ativarbot','/encerrarteste'])assert(replies.at(-1).includes(command));const runId=rentalTestMode.state().id;
 await run('iniciarteste');assert.equal(rentalTestMode.state().id,runId);assert(await rentalTestMode.blockLiveCommand({...base,sender:owner,command:'rg_aluguel'}));assert(await rentalTestMode.blockLiveCommand({...base,sender:owner,command:'prefixo'}));assert(!await rentalTestMode.blockLiveCommand({...base,sender:other,identities:[other],command:'rg_aluguel'}));
 await run('asaastoken','producao SHOULD-NOT-REPLACE-SECRET');assert.deepEqual(config.read(),cfg);assert.match(replies.at(-1),/bloqueadas/);
 await run('meuplano','',{sender:other,identities:[other],from:other});assert(messages.at(-1).data.text.includes('Real contract'));assert(!messages.at(-1).data.text.includes('MODO DE TESTE'));
 await run('alugar');assert(messages.at(-1).data.text.includes('MODO DE TESTE'));assert(resolveRentalTestInput({jid:lid,text:'2'})?.includes('plano'));
 await click(options().find(o=>o.endsWith(' 30')));await click(options().find(o=>o.endsWith(' 1')));await click(options()[0]);
 const services=rentalTestMode.services(rentalTestMode.state()),order=Object.values(services.store.read().orders)[0],code=order.activationCode.code;assert.equal(order.localTest,runId);assert.equal(order.status,'approved');assert.match(code,/^TST-/);assert.equal(order.cents,2700);assert.equal(api,0);assert(!messages.some(m=>m.data.image));assert(!productionStore.read().orders[order.id]);
 await run('entrar','https://chat.whatsapp.com/realGroup '+code);assert.equal(joins,0);assert(messages.at(-1)?.data.text?.includes('TESTE')||replies.at(-1).includes('contrato real'));
 await run('entrar','https://chat.whatsapp.com/newGroup '+code);assert.equal(joins,1);assert(members.has('200@g.us'));
 await run('ativarbot',code,{isGroup:true,from:'200@g.us'});assert(services.rentals.read().groups['200@g.us']);assert(!readRentalDb().groups['200@g.us']);
 const beforeRenew=services.rentals.read().groups['200@g.us'].expiresAt;
 await run('renovar');await click(options().find(o=>o.endsWith(' 60')));await click(options().find(o=>o.includes(' resumo ')));await click(options()[0]);assert.equal(services.rentals.read().groups['200@g.us'].expiresAt,beforeRenew+60*DAY);
 for(const stage of ['7d','3d','vencido'])await run('iniciarteste','avisos '+stage,{isGroup:true,from:'200@g.us'});assert.equal(left.length,0);assert(messages.some(m=>m.jid===owner&&m.data.text?.includes('aluguel venceu')));
 assert.equal(resolveRentalTestInput({jid:lid,text:'1'}),'/renovar');
 // Um grupo em que o bot já estava pode ser usado, mas não será abandonado ao encerrar.
 await run('alugar');await click(options().find(o=>o.endsWith(' 15')));await click(options().find(o=>o.endsWith(' 1')));await click(options()[0]);const second=Object.values(services.store.read().orders).at(-1);
 await run('ativarbot',second.activationCode.code,{isGroup:true,from:'300@g.us'});assert(services.rentals.read().groups['300@g.us']);
 // Um novo controlador após reinício recupera só o banco da mesma sessão.
 const resumed=createRentalTestMode({modeStore:jsonStore(path.join(dir,'files/database/rental-test-mode.json'),{}),baseDir:path.join(dir,'files/database/rental-tests'),productionStore,productionRentals:{read:readRentalDb,write:writeRentalDb}});assert.equal(resumed.services(resumed.state()).store.read().orders[order.id].activationCode.code,code);
 // Mesmo se dados de teste forem copiados por engano, o motor normal os rejeita.
 const isolatedNormal=createBillingEngine({store:services.store,config:services.config,rentals:services.rentals});await assert.rejects(isolatedNormal.verify(order.id,owner),/outro ambiente/);assert.throws(()=>isolatedNormal.grant(order,{jid:'500@g.us'}),/outro ambiente/);
 await run('encerrarteste','',{sender:other,identities:[other],from:other});assert(rentalTestMode.state().active);
 await run('encerrarteste');assert(!rentalTestMode.state().active);assert(left.includes('200@g.us'));assert(!left.includes('100@g.us'));assert(!left.includes('300@g.us'));assert(members.has('300@g.us'));assert.deepEqual(readRentalDb(),snapshot);assert.deepEqual(config.read(),cfg);assert.equal(api,0);
 await run('ativarbot',code,{isGroup:true,from:'300@g.us'});assert(!readRentalDb().groups['300@g.us']);assert.match(replies.at(-1),/outro ambiente|outro responsável/);
 await run('alugar');assert(!messages.at(-1).data.text.includes('MODO DE TESTE'));assert(messages.at(-1).data.text.includes('Escolha o prazo'));
 await run('iniciarteste');assert.notEqual(rentalTestMode.state().id,runId);await run('encerrarteste');
 assert(!JSON.stringify(messages).includes('PRODUCTION-SECRET-NOT-TOUCH'));
 console.log('Modo de teste: criador PN/LID, lista, compra/código TST sem API, entrada real simulada, renovação/avisos isolados, cliente normal, proteção dos contratos, reinício, fim/limpeza, grupo preexistente e retorno padrão OK.');
}finally{globalThis.fetch=oldFetch;process.chdir(cwd);fs.rmSync(dir,{recursive:true,force:true});}
