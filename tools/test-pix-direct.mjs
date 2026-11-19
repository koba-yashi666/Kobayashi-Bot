import assert from 'node:assert/strict';
import {createBillingEngine} from '../lib/features/billing/engine.js';
import {asaasBinding,asaasRequest} from '../lib/features/billing/asaas.js';
import {DAY} from '../lib/features/billing/storage.js';
const memory=x=>{let d=structuredClone(x);return {read:()=>structuredClone(d),write(v){d=structuredClone(v)},update(fn){fn(d)}}};
const creator='5515997075304@s.whatsapp.net',client='5511999999999@s.whatsapp.net';let now=Date.now(),posts=0,deletes=0,rows=[],detail,fail=false,body,replyPatch={};
const store=memory({orders:{},profiles:{},sessions:{}}),config=memory({}),rentals=memory({groups:{'g@g.us':{responsibleJid:creator,expiresAt:now+2*DAY}}}),asaasConfig=memory({token:'OFFLINE-KEY',environment:'production',mode:'pilot',pixAddressKey:'own-key'});
asaasConfig.update(c=>{c.verifiedBinding=asaasBinding(c);c.directPixBinding=asaasBinding(c)});
const request=async(c,r,opts={})=>{
 if(r==='/pix/qrCodes/static'){posts++;body=opts.body;if(fail)throw Error('timeout after creation');return {id:'qr_direct_123456',allowsMultiplePayments:false,externalReference:body.externalReference,payload:'000201br.gov.bcb.pix'+'0'.repeat(70),encodedImage:'iVBORw0KGgoAAAAA',...replyPatch};}
 if(r.startsWith('/payments?')){assert(r.includes('pixQrCodeId=qr_direct_123456'));return {data:rows,hasMore:false};}
 if(r==='/payments/pay_direct')return detail;
 if(r==='/pix/qrCodes/static/qr_direct_123456'){deletes++;return {deleted:true};}
 throw Error('unexpected '+r);
};
const make=()=>createBillingEngine({store,config,rentals,newProvider:'asaas',asaasConfig,asaasRequest:request,clock:()=>now});let e=make();
const o=await e.create({owner:creator,days:30,quantity:1,groups:['g@g.us'],key:'direct'});assert.equal(o.flow,'pix-direct');assert.equal(o.status,'pending');assert(!o.checkoutUrl);assert(o.qr&&o.qrImage);assert.equal(body.value,25);assert.equal(body.allowsMultiplePayments,false);assert.equal(body.expirationSeconds,1800);assert.equal(body.externalReference,o.id);assert.equal(body.addressKey,'own-key');assert(!body.customer);assert(!body.customerData);
await e.create({owner:creator,days:30,quantity:1,key:'direct'});assert.equal(posts,1);
assert.equal((await e.verify(o.id,creator)).status,'pending');await assert.rejects(e.verify(o.id,client));
const valid={id:'pay_direct',pixQrCodeId:o.pixQrCodeId,billingType:'PIX',value:25,status:'RECEIVED'};
for(const bad of [{value:24.99},{value:NaN},{pixQrCodeId:'foreign'},{billingType:'BOLETO'},{deleted:true},{refunds:[{}]},{chargeback:{}}]){
 rows=[{...valid,...bad}];detail=rows[0];await assert.rejects(e.verify(o.id,creator));assert.equal(rentals.read().groups['g@g.us'].expiresAt,now+2*DAY);
}
rows=[valid,valid];await assert.rejects(e.verify(o.id,creator));rows=[valid];detail={...valid,pixQrCodeId:'wrong'};await assert.rejects(e.verify(o.id,creator));
rows=[{...valid,status:'CONFIRMED'}];detail=rows[0];assert.equal((await e.verify(o.id,creator)).status,'pending');
rows=[valid];detail=valid;assert.equal((await e.verify(o.id,creator)).status,'approved');assert.equal(rentals.read().groups['g@g.us'].expiresAt,now+32*DAY);e=make();await e.verify(o.id,creator);assert.equal(rentals.read().groups['g@g.us'].expiresAt,now+32*DAY);await assert.rejects(e.cancel(o.id,creator));assert.equal(deletes,0);
asaasConfig.update(c=>c.token='changed');await assert.rejects(e.verify(o.id,creator),/mudou/);asaasConfig.update(c=>c.token='OFFLINE-KEY');
now+=16000;rows=[];const later=await e.create({owner:creator,days:15,quantity:2,key:'late'});assert.equal(body.value,34);await e.cancel(later.id,creator);assert.equal(deletes,1);await e.cancel(later.id,creator);assert.equal(deletes,1);now+=31*60000;assert.equal((await e.verify(later.id,creator)).status,'expired');rows=[{...valid,value:34}];detail=rows[0];assert.equal((await e.verify(later.id,creator)).status,'approved');
now+=16000;fail=true;await assert.rejects(e.create({owner:creator,days:30,quantity:1,key:'unknown'}));const before=posts;e=make();await e.create({owner:creator,days:30,quantity:1,key:'unknown'});await assert.rejects(e.verify('unknown',creator));assert.equal(posts,before);fail=false;
now+=16000;replyPatch={externalReference:'other-order'};await assert.rejects(e.create({owner:creator,days:30,quantity:1,key:'bad-reply'}));assert(!store.read().orders['bad-reply'].pixQrCodeId);replyPatch={};
now+=16000;asaasConfig.update(c=>{c.environment='sandbox';c.mode='sandbox';c.verifiedBinding=asaasBinding(c);c.directPixBinding=asaasBinding(c)});const sb=await e.create({owner:creator,days:30,quantity:1,key:'sandbox'});assert(sb.sandbox);await assert.rejects(e.confirmSandbox(sb.id,creator),/outra conta Sandbox/);rows=[valid];detail=valid;await e.verify(sb.id,creator);assert.equal(Object.keys(e.applied(sb.id)).length,0);await assert.rejects(e.attach(sb.id,creator,'https://chat.whatsapp.com/abc',{}));
// As rotas Pix usam os mesmos hosts fixos, sem permitir transferências.
let url;await asaasRequest(asaasConfig.read(),'/pix/addressKeys?status=ACTIVE&limit=100',{fetchImpl:async u=>{url=u;return new Response('{"data":[]}')}});assert.match(url,/^https:\/\/api-sandbox.asaas.com\/v3\/pix\/addressKeys/);await assert.rejects(asaasRequest(asaasConfig.read(),'/pix/qrCodes/pay',{fetchImpl:async()=>{throw Error('must not call')}}));
console.log('Pix direto: valor/validade/uso único, sem CPF/checkout, 7 adulterações, duplicidade, detalhe divergente, RECEIVED, reinício, cancelamento/Pix tardio, segredo/ambiente, POST incerto e Sandbox isolada OK.');
