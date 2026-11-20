import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const cwd=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-operations-ui-')),originalFetch=globalThis.fetch;process.chdir(dir);
try{
 const {handleBillingCommand,BILLING_COMMANDS}=await import('../lib/features/billing/commands.js');
 const {asaasConfigStore:config,billingStore:store,DAY}=await import('../lib/features/billing/storage.js');
 const {readRentalDb,writeRentalDb}=await import('../lib/features/rental/rentalSystem.js');
 const {asaasBinding}=await import('../lib/features/billing/asaas.js');
 const creator='5515997075304@s.whatsapp.net',referrer='5511888888888@s.whatsapp.net';const now=Date.now();
 config.write({token:'OFFLINE-OPERATIONS-TEST',environment:'production',mode:'pilot',pixAddressKey:'test-pix'});config.update(c=>{c.verifiedBinding=asaasBinding(c);c.directPixBinding=asaasBinding(c)});
 writeRentalDb({groups:{'100@g.us':{groupName:'Indicador',responsibleJid:referrer,expiresAt:now+DAY,permanent:false}},settings:{}});
 let paymentStatus='PENDING',calls=0,body;globalThis.fetch=async(url,opts)=>{calls++;const u=new URL(url);assert.equal(u.hostname,'api.asaas.com');
  if(u.pathname==='/v3/pix/qrCodes/static'){body=JSON.parse(opts.body);return new Response(JSON.stringify({id:'qr_manage_123456',externalReference:body.externalReference,allowsMultiplePayments:false,payload:'000201br.gov.bcb.pix'+'0'.repeat(70),encodedImage:'iVBORw0KGgoAAAAA'}));}
  const p={id:'pay_manage',pixQrCodeId:'qr_manage_123456',value:25,billingType:'PIX',status:paymentStatus};
  if(u.pathname==='/v3/payments')return new Response(JSON.stringify({data:[p],hasMore:false}));
  if(u.pathname==='/v3/payments/pay_manage')return new Response(JSON.stringify(p));throw Error('unexpected route');
 };
 const sent=[],replies=[],relays=[];let id=0,fetches=0;
 const base={from:creator,sender:creator,identities:[creator],isGroup:false,info:{key:{id:'in'}},reply:async t=>replies.push(t),conn:{user:{id:creator},sendMessage:async(jid,m)=>{sent.push(m);return {key:{id:'m'+(++id)}}},relayMessage:async(jid,m)=>relays.push(m),groupFetchAllParticipating:async()=>{fetches++;return {'200@g.us':{id:'200@g.us',subject:'Cliente'}}},groupMetadata:async jid=>({id:jid,subject:'Cliente',participants:[{id:creator,admin:'admin'}]})},generate:(jid,message)=>({key:{id:'relay'},message})};
 const run=(command,q='',extra={})=>handleBillingCommand({...base,command,q,...extra});
 const options=()=>relays.at(-1).viewOnceMessage.message.interactiveMessage.nativeFlowMessage.buttons.flatMap(b=>b.name==='single_select'?JSON.parse(b.buttonParamsJson).sections[0].rows.map(r=>r.id):[JSON.parse(b.buttonParamsJson).id]).filter(Boolean);
 const click=async full=>{const [command,...args]=full.split(' ');return run(command.slice(1),args.join(' '));};
 for(const command of ['ativacoes','ativarpedido','indicacao','indicacoes','minhasindicacoes','aprovarindicacao','meuplano'])assert(BILLING_COMMANDS.has(command));
 await run('indicacao','',{from:'100@g.us',sender:referrer,identities:[referrer],isGroup:true,isGroupAdmins:true});const code=Object.keys(store.read().referralCodes)[0];assert(code);assert(replies.at(-1).includes('/alugar '+code));
 await run('alugar',code);assert(store.read().sessions[Object.keys(store.read().sessions)[0]].referralCode===code);
 await click(options().find(o=>o.endsWith(' 30')));await click(options().find(o=>o.endsWith(' 1')));await click(options()[0]);const order=Object.values(store.read().orders)[0];assert.equal(order.referral.code,code);assert.equal(order.manualActivation,true);assert.equal(body.value,25);
 await run('ativacoes');assert(!sent.at(-1).text.includes(order.id));
 paymentStatus='RECEIVED';await run('pagamento',order.id);assert.match(replies.at(-1),/PIX APROVADO/);assert(decodeURIComponent(replies.at(-1)).includes('Indicação: '+code));
 const before=calls;await run('ativacoes','',{sender:referrer,identities:[referrer]});assert.equal(calls,before);assert.match(replies.at(-1),/criador/);
 await run('ativacoes');assert(sent.at(-1).text.includes(order.id));await click(options()[0]);assert.equal(fetches,1);
 await click(options().find(o=>o.includes(' marcar ')));await click(options().find(o=>o.includes(' confirmar ')));await click(options()[0]);assert.match(replies.at(-1),/Ativação concluída/);assert.equal(readRentalDb().groups['200@g.us'].responsibleJid,creator);
 await run('indicacoes');assert(sent.at(-1).text.includes(order.id));await click(options()[0]);await click(options()[0]);assert.match(replies.at(-1),/20 dias adicionados/);assert.equal(readRentalDb().groups['100@g.us'].expiresAt,now+21*DAY);
 await run('aprovarindicacao',order.id+' CONFIRMAR');assert.match(replies.at(-1),/já aplicado/);assert.equal(readRentalDb().groups['100@g.us'].expiresAt,now+21*DAY);
 await run('meuplano');assert(sent.at(-1).text.includes('Cliente'));assert(!sent.at(-1).text.includes('Indicador'));
 await run('meuplano','',{isGroup:true,from:'200@g.us'});assert.match(replies.at(-1),/Restam: 29 dia/);
 const main=fs.readFileSync(path.join(cwd,'index.js'),'utf8');assert(main.includes('identities:ownerIdentityCandidates,isGroupAdmins,generate:'));assert(main.includes("if(isGroup&&command!=='statusbot')"));
 console.log('Integração comandos: código→/alugar→Pix→aprovação→painel→seleção→ativação→bônus 20d único; criador, privado, meuplano e roteamento preservados OK.');
}finally{globalThis.fetch=originalFetch;process.chdir(cwd);fs.rmSync(dir,{recursive:true,force:true})}
