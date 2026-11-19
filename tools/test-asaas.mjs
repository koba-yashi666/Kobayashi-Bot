import assert from 'node:assert/strict';
import {createBillingEngine} from '../lib/features/billing/engine.js';
import {asaasBinding,asaasRequest,checkoutBody,matchingAsaasPayment} from '../lib/features/billing/asaas.js';
import {DAY} from '../lib/features/billing/storage.js';
const memory=initial=>{let v=structuredClone(initial);return {read:()=>structuredClone(v),write:x=>{v=structuredClone(x)},update(fn){const x=this.read();const r=fn(x);this.write(x);return r;}}};
const creator='5515997075304@s.whatsapp.net',client='5511999999999@s.whatsapp.net';
let now=Date.now(),posts=0,gets=0,confirms=0,cancels=0,paymentState='PENDING',fault=false,mismatch={},rows=true,throwCreate=false;
const checkoutId='c7b1c696-b27b-4d3d-80b9-d1c018e387f8';
const store=memory({orders:{},profiles:{},sessions:{},notices:{}}),rentals=memory({groups:{}}),config=memory({mode:'off'}),asaasConfig=memory({environment:'sandbox',mode:'sandbox',token:'FAKE-KEY-FOR-OFFLINE-TESTS',returnUrl:'https://wa.me/5511000000000'});
asaasConfig.update(c=>c.verifiedBinding=asaasBinding(c));
let value=25;
function fixture(){return {id:'pay_123',checkoutSession:checkoutId,billingType:'PIX',value,status:paymentState,deleted:false,...mismatch};}
const request=async(c,route,opts={})=>{
 assert.equal(c.token,'FAKE-KEY-FOR-OFFLINE-TESTS');
 if(fault)throw Error('offline');
 if(route==='/checkouts'){posts++;if(throwCreate)throw Error('timeout after create');value=opts.body.items[0].value;assert.deepEqual(opts.body.billingTypes,['PIX']);assert.deepEqual(opts.body.chargeTypes,['DETACHED']);assert(!('customerData' in opts.body));return {id:checkoutId};}
 if(route.startsWith('/payments?')){gets++;return {data:rows?[fixture()]:[],hasMore:false};}
 if(route==='/payments/pay_123')return fixture();
 if(route==='/sandbox/payment/pay_123/confirm'){assert.equal(c.environment,'sandbox');confirms++;paymentState='RECEIVED';return fixture();}
 if(route.endsWith('/cancel')){cancels++;return {};}
 throw Error('unexpected '+route);
};
const engine=()=>createBillingEngine({store,config,rentals,newProvider:'asaas',asaasConfig,asaasRequest:request,clock:()=>now});
let e=engine();
const sandbox=await e.create({owner:creator,days:30,quantity:1,key:'sandbox'});assert.equal(posts,1);assert.equal(sandbox.sandbox,true);assert.match(sandbox.checkoutUrl,/https:\/\/sandbox\.asaas\.com/);
await e.create({owner:creator,days:30,quantity:1,key:'sandbox'});assert.equal(posts,1);
await assert.rejects(e.create({owner:creator,days:30,quantity:1,key:'too-fast'}),/15 segundos/);
await assert.rejects(e.create({owner:client,days:30,quantity:1,key:'client-sandbox'}),/Sandbox exclusiva/);
await assert.rejects(e.confirmSandbox(sandbox.id,client));
rows=false;await assert.rejects(e.confirmSandbox(sandbox.id,creator),/preencha/);rows=true;
const approved=await e.confirmSandbox(sandbox.id,creator);assert.equal(approved.status,'approved');assert.equal(confirms,1);assert.deepEqual(rentals.read().groups,{});
assert.throws(()=>e.grant(approved,{jid:'real@g.us'}));let joins=0;await assert.rejects(e.attach(sandbox.id,creator,'https://chat.whatsapp.com/abc',{groupAcceptInvite:async()=>joins++}));assert.equal(joins,0);
// Ambiente de produção: renovar uma vez e preservar dias pagos, mesmo após reinício.
now+=16000;asaasConfig.update(c=>{c.environment='production';c.mode='pilot';c.verifiedBinding=asaasBinding(c);});paymentState='PENDING';
await assert.rejects(e.create({owner:client,days:30,quantity:1,key:'client-pilot'}));
rentals.write({groups:{'old@g.us':{expiresAt:now+2*DAY,responsibleJid:creator}}});
const real=await e.create({owner:creator,days:60,quantity:1,groups:['old@g.us'],key:'real'});assert.equal(value,45);assert.match(real.checkoutUrl,/https:\/\/asaas\.com/);
await assert.rejects(e.confirmSandbox(real.id,creator),/Sandbox/);assert.equal(confirms,1);
for(const bad of [{value:1},{billingType:'RECEIVED_IN_CASH'},{checkoutSession:'foreign'},{deleted:true},{refunds:[{value:1}]},{chargeback:{status:'OPEN'}}]){
 mismatch=bad;await assert.rejects(e.verify(real.id,creator));assert.equal(rentals.read().groups['old@g.us'].expiresAt,now+2*DAY);
}mismatch={};paymentState='CONFIRMED';await e.verify(real.id,creator);assert.equal(e.owned(real.id,creator).status,'pending');assert.equal(rentals.read().groups['old@g.us'].expiresAt,now+2*DAY);
paymentState='RECEIVED';await e.verify(real.id,creator);assert.equal(rentals.read().groups['old@g.us'].expiresAt,now+62*DAY);
e=engine();await e.verify(real.id,creator);assert.equal(rentals.read().groups['old@g.us'].expiresAt,now+62*DAY);assert.equal(Object.keys(e.applied(real.id)).length,1);
await assert.rejects(e.cancel(real.id,creator));assert.equal(cancels,0);
asaasConfig.update(c=>c.token='CHANGED');await assert.rejects(e.verify(real.id,creator),/mudou/);asaasConfig.update(c=>c.token='FAKE-KEY-FOR-OFFLINE-TESTS');
await assert.rejects(e.verify(real.id,client));
// Cancelamento de checkout não implica cancelamento financeiro. Pagamento tardio é conciliado.
now+=16000;paymentState='PENDING';const later=await e.create({owner:creator,days:15,quantity:1,key:'later'});await e.cancel(later.id,creator);assert.equal(cancels,1);assert.equal(e.owned(later.id,creator).cancelRequested,true);assert.equal(e.owned(later.id,creator).status,'pending');now+=31*60000;await e.verify(later.id,creator);assert.equal(e.owned(later.id,creator).status,'expired');paymentState='RECEIVED';await e.verify(later.id,creator);assert.equal(e.owned(later.id,creator).status,'approved');
// POST inconclusivo não é repetido automaticamente nem ao clicar duas vezes ou reiniciar.
now+=16000;throwCreate=true;const beforePosts=posts;await assert.rejects(e.create({owner:creator,days:30,quantity:1,key:'uncertain'}));assert.equal(store.read().orders.uncertain.status,'uncertain');assert.equal(posts,beforePosts+1);e=engine();await e.create({owner:creator,days:30,quantity:1,key:'uncertain'});await assert.rejects(e.verify('uncertain',creator));assert.equal(posts,beforePosts+1);throwCreate=false;
// Falha de consulta não libera aluguel nem consome vaga.
fault=true;await assert.rejects(e.verify(later.id,creator));fault=false;
assert.throws(()=>checkoutBody(real,'https://evil.example'));
// Transporte: host fixo por ambiente, chave apenas no header, redirecionamento proibido e erros sanitizados.
const c=asaasConfig.read();let captured;
const good=async(url,opts)=>{captured={url,opts};return new Response(JSON.stringify({balance:0}),{status:200});};
await asaasRequest(c,'/finance/balance',{fetchImpl:good});assert.equal(captured.url,'https://api.asaas.com/v3/finance/balance');assert.equal(captured.opts.headers.access_token,c.token);assert.equal(captured.opts.redirect,'error');assert(!captured.url.includes(c.token));assert.equal(captured.opts.body,undefined);
await assert.rejects(asaasRequest(c,'/sandbox/payment/pay_123/confirm',{fetchImpl:good}),/proibida/);
for(const route of ['https://evil.example','/../customers','/payments#bad'])await assert.rejects(asaasRequest(c,route,{fetchImpl:good}));
for(const status of [400,401,403,429,500])await assert.rejects(asaasRequest(c,'/finance/balance',{fetchImpl:async()=>new Response('SENSITIVE '+c.token,{status})}),err=>err.message.includes('HTTP '+status)&&!err.message.includes(c.token));
await assert.rejects(asaasRequest(c,'/finance/balance',{fetchImpl:async()=>{throw Error(c.token)}}),err=>!err.message.includes(c.token));
await assert.rejects(asaasRequest(c,'/finance/balance',{fetchImpl:async()=>new Response('x'.repeat(1000001))}));
assert(!matchingAsaasPayment(real,{...fixture(),status:'RECEIVED',value:NaN}));
console.log('Asaas: Sandbox isolada, produção/piloto, 6 adulterações, retenção CONFIRMED, renovação única após reinício, Pix tardio, cancelamento, POST inconclusivo sem duplicar, dono, rede, ambientes e segredo HTTP OK.');
