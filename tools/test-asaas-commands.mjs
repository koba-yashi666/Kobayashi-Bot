import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-asaas-ui-')),cwd=process.cwd(),originalFetch=globalThis.fetch;process.chdir(dir);
try{
 const {handleBillingCommand}=await import('../lib/features/billing/commands.js');
 const {asaasConfigStore:config,billingStore:store}=await import('../lib/features/billing/storage.js');
 const creator='5515997075304@s.whatsapp.net',other='5511999999999@s.whatsapp.net',secret='FAKE-SANDBOX-KEY-TEST-ONLY';
 const sent=[],replies=[],relayed=[],calls=[];let state='PENDING',posts=0;
 const checkoutId='c7b1c696-b27b-4d3d-80b9-d1c018e387f8';
 const fixture=()=>({id:'pay_ui',checkoutSession:checkoutId,value:25,billingType:'PIX',status:state});
 globalThis.fetch=async(url,opts)=>{calls.push({url,opts});const route=new URL(url).pathname;
  if(route==='/v3/finance/balance')return new Response('{"balance":123.45}');
  if(route==='/v3/checkouts'){posts++;return new Response(JSON.stringify({id:checkoutId}));}
  if(route==='/v3/payments')return new Response(JSON.stringify({data:[fixture()],hasMore:false}));
  if(route==='/v3/payments/pay_ui')return new Response(JSON.stringify(fixture()));
  if(route==='/v3/sandbox/payment/pay_ui/confirm'){state='RECEIVED';return new Response(JSON.stringify(fixture()));}
  throw Error('unexpected '+url);
 };
 const base={from:creator,sender:creator,identities:[creator],isGroup:false,info:{key:{id:'secret-message'},message:{conversation:'/asaastoken sandbox '+secret}},reply:async x=>replies.push(x),conn:{user:{id:'5511000000000@s.whatsapp.net'},sendMessage:async(jid,data,opts)=>{sent.push({data,opts});return {};},relayMessage:async(jid,msg)=>relayed.push(msg)},generate:(jid,message)=>({key:{id:'test'},message})};
 const run=(command,q='',extra={})=>handleBillingCommand({...base,command,q,...extra});
 await run('asaastoken','sandbox '+secret,{sender:other,identities:[other]});assert(!config.read().token);assert(!sent.at(-1).opts);assert.match(sent.at(-1).data.text,/exclusivos/);
 await run('asaastoken','sandbox '+secret,{isGroup:true});assert(!config.read().token);assert(!sent.at(-1).opts);
 await run('asaastoken','sandbox '+secret);assert.equal(config.read().token,secret);assert(sent.some(s=>s.data.delete));assert(!sent.at(-1).opts);assert(!JSON.stringify(sent.filter(s=>!s.data.delete)).includes(secret));
 await run('asaasmodo','sandbox');assert.match(replies.at(-1),/conexao/);
 await run('asaasteste','conexao');assert(config.read().verifiedBinding);assert.equal(posts,0);assert(!JSON.stringify(replies).includes('123.45'));
 await run('asaasretorno','5511000000000');await run('asaasmodo','sandbox');assert.equal(config.read().mode,'sandbox');
 await run('asaasmodo','producao CONFIRMAR');assert.equal(config.read().mode,'sandbox');
 const options=()=>relayed.at(-1).viewOnceMessage.message.interactiveMessage.nativeFlowMessage.buttons.flatMap(b=>b.name==='single_select'?JSON.parse(b.buttonParamsJson).sections[0].rows.map(r=>r.id):[JSON.parse(b.buttonParamsJson).id]);
 const click=async id=>{const [cmd,...args]=id.split(' ');await run(cmd.slice(1),args.join(' '));};
 await run('alugar');assert.equal(options().length,4);await click(options().find(o=>o.endsWith(' 30')));await click(options().find(o=>o.endsWith(' 1')));assert.match(relayed.at(-1).viewOnceMessage.message.interactiveMessage.body.text,/25,00/);await click(options()[0]);
 assert.equal(posts,1);assert.match(relayed.at(-1).viewOnceMessage.message.interactiveMessage.body.text,/SANDBOX/);assert.match(relayed.at(-1).viewOnceMessage.message.interactiveMessage.body.text,/sandbox.asaas.com/);
 const order=Object.values(store.read().orders)[0];assert(order.sandbox);assert(!order.simulated);
 await run('asaasteste','aprovar '+order.id);assert.equal(store.read().orders[order.id].status,'approved');assert.match(replies.at(-1),/Nenhum grupo real/);
 // Test command cannot even consult an order marked as production.
 store.update(d=>{d.orders.real={...order,id:'real',sandbox:false};});const callCount=calls.length;await run('asaasteste','verificar real');assert.equal(calls.length,callCount);assert.match(replies.at(-1),/pagamento ID/);
 const {billingTick,ensureBillingRuntime,reconcileDelay}=await import('../lib/features/billing/runtime.js');
 store.update(d=>{d.orders[order.id].notified=false;d.orders[order.id].lastCheck=0;delete d.orders.real;});
 const beforeNotices=sent.length;await billingTick(base.conn);assert.equal(sent.length,beforeNotices+1);assert.match(sent.at(-1).data.text,/SANDBOX CONFIRMADA/);assert(!sent.at(-1).data.text.includes('Vincule'));await billingTick(base.conn);assert.equal(sent.length,beforeNotices+1);
 // Falha na entrega da confirmação deve poder ser repetida após confirmação financeira.
 store.update(d=>{d.orders[order.id].notified=false;d.orders[order.id].lastCheck=0;});
 await billingTick({...base.conn,sendMessage:async()=>{throw Error('offline')}});assert.equal(store.read().orders[order.id].notified,false);
 store.update(d=>{d.orders[order.id].lastCheck=0;});await billingTick(base.conn);assert.equal(store.read().orders[order.id].notified,true);
 assert.equal(reconcileDelay({provider:'asaas',status:'pending'}),60000);assert.equal(reconcileDelay({provider:'asaas',status:'expired'}),900000);assert(reconcileDelay({provider:'asaas',status:'pending',failures:5})>60000);
 ensureBillingRuntime(base.conn);const beforeLeave=calls.length;await base.conn.kobaBillingBeforeLeave('never@g.us');assert.equal(calls.length,beforeLeave);
 store.update(d=>{d.orders.real={...order,id:'real',sandbox:false};});
 await run('asaasteste','suite');assert.match(replies.at(-1),/38 verificações/);
 await run('asaaspreco','30 25,00');assert.equal(config.read().prices[30],2500);
 await run('asaasavisos','off');assert.equal(config.read().groupNotices,false);
 await run('asaasstatus');assert(!replies.at(-1).includes(secret));assert.match(replies.at(-1),/sandbox/);
 await run('asaastoken','producao '+secret);assert.equal(config.read().environment,'sandbox'); // real unresolved order blocks replacing credential
 assert(calls.every(c=>c.url.startsWith('https://api-sandbox.asaas.com/v3/')));
 console.log('Comandos Asaas: criador/PV, segredo sem citação, apagar chave, validação, produção bloqueada com chave Sandbox, fluxo bot→checkout→confirmação Sandbox, preço, avisos e testes sem operação real OK.');
}finally{globalThis.fetch=originalFetch;process.chdir(cwd);fs.rmSync(dir,{recursive:true,force:true});}
