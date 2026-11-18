import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {jsonStore,price,DAY,GRACE} from '../lib/features/billing/storage.js';
import {createBillingEngine} from '../lib/features/billing/engine.js';
import {confirmedPayment} from '../lib/features/billing/mercadoPago.js';
import {createRentalLifecycle} from '../lib/features/billing/lifecycle.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-billing-'));
const store=jsonStore(path.join(dir,'billing.json'),{orders:{},sessions:{},profiles:{},notices:{}}),config=jsonStore(path.join(dir,'config.json'),{mode:'production',token:'test-secret',collectorId:'seller'}),rentals=jsonStore(path.join(dir,'rentals.json'),{groups:{}});
let now=Date.now(),state='pending',sent=[],left=[],apiCalls=[];
const owner='5511999999999@s.whatsapp.net';store.update(d=>{d.profiles[owner]={email:'real@example.com'};});
let payments=new Map();
const request=async(token,route,options={})=>{
 assert.equal(token,'test-secret');apiCalls.push({route,options});
 if(options.method==='POST'){
  if(payments.has(options.idempotency))return payments.get(options.idempotency);
  const p={id:String(payments.size+1),external_reference:options.body.external_reference,transaction_amount:options.body.transaction_amount,currency_id:'BRL',payment_method_id:'pix',collector_id:'seller',live_mode:true,status:'pending',point_of_interaction:{transaction_data:{qr_code:'TEST-NOT-PAYABLE'}}};payments.set(options.idempotency,p);return p;
 }
 const p=[...payments.values()].find(p=>p.id===route.split('/').at(-1));assert(p);
 if(options.method==='PUT'){p.status='cancelled';return p;}return {...p,status:state};
};
let engine=createBillingEngine({store,config,rentals,request,clock:()=>now});
try {
 for(const [days,cents]of [[15,1700],[30,2500],[60,4500],[90,6700]])for(const n of [1,2,3,5,6,50])assert.equal(price(days,n),cents*n);
 for(const n of [0,-1,1.5,51,NaN])assert.throws(()=>price(30,n));assert.throws(()=>price(45,1));
 const o=await engine.create({owner,days:30,quantity:2,key:'order-one'});assert.equal(o.cents,5000);assert.equal(o.status,'pending');assert.equal(apiCalls[0].options.idempotency,o.id);
 await assert.rejects(engine.verify(o.id,'other'));
 state='approved';await engine.verify(o.id,owner);
 assert.equal(engine.owned(o.id,owner).status,'approved');
 let accepts=0;
 const conn={groupGetInviteInfo:async()=>({id:'g1@g.us',subject:'Grupo1'}),groupAcceptInvite:async()=>{accepts++;return 'g1@g.us'}};
 await engine.attach(o.id,owner,'https://chat.whatsapp.com/ABCD',conn);
 const expiry=rentals.read().groups['g1@g.us'].expiresAt;assert.equal(expiry,now+30*DAY);
 await engine.attach(o.id,owner,'https://chat.whatsapp.com/ABCD',conn);assert.equal(accepts,1);assert.equal(rentals.read().groups['g1@g.us'].expiresAt,expiry);
 assert.equal(Object.keys(engine.applied(o.id)).length,1);
 let fresh=createBillingEngine({store,config,rentals,request,clock:()=>now});await fresh.verify(o.id,owner);assert.equal(rentals.read().groups['g1@g.us'].expiresAt,expiry);
 const renewal=await engine.create({owner,days:60,quantity:1,groups:['g1@g.us'],key:'renew-one'});
 await engine.verify(renewal.id,owner);assert.equal(rentals.read().groups['g1@g.us'].expiresAt,expiry+60*DAY);
 await engine.verify(renewal.id,owner);assert.equal(rentals.read().groups['g1@g.us'].expiresAt,expiry+60*DAY);
 const p={...payments.get(renewal.id),status:'approved'};
 assert(confirmedPayment(renewal,p,'seller'));
 for(const patch of [{transaction_amount:1},{external_reference:'foreign'},{collector_id:'other'},{live_mode:false},{currency_id:'USD'},{status:'pending'},{payment_method_id:'visa'},{transaction_amount_refunded:1}])assert(!confirmedPayment(renewal,{...p,...patch},'seller'));
 await assert.rejects(engine.create({owner:'other',days:30,quantity:1,groups:['g1@g.us']}));
 const simulation=await engine.create({owner,days:15,quantity:1,simulated:true});const before=JSON.stringify(rentals.read());engine.simulate(simulation.id,owner,'approved');assert.equal(JSON.stringify(rentals.read()),before);await assert.rejects(engine.attach(simulation.id,owner,'https://chat.whatsapp.com/a',conn));
 assert.throws(()=>engine.simulate(o.id,owner,'approved'));
 const delayed=await engine.create({owner,days:15,quantity:1,key:'delayed-approval'});now+=31*60000;state='pending';await engine.verify(delayed.id,owner);assert.equal(engine.owned(delayed.id,owner).status,'expired');state='approved';await engine.verify(delayed.id,owner);assert.equal(engine.owned(delayed.id,owner).status,'approved');
 // Falha de rede após persistir o pedido: repetir usa a mesma chave.
 let first=true;const failing=createBillingEngine({store,config,rentals,clock:()=>now,request:async(...args)=>{if(first){first=false;throw Error('timeout');}return request(...args);}});
 await assert.rejects(failing.create({owner,days:15,quantity:1,key:'network-retry'}));assert.equal(store.read().orders['network-retry'].status,'creating');await failing.verify('network-retry',owner);assert.equal(apiCalls.at(-2).options.idempotency,'network-retry');
 config.update(c=>{c.mode='pilot';});await assert.rejects(engine.create({owner,days:30,quantity:1,key:'not-creator-pilot'}));
 const creator='5515997075304@s.whatsapp.net';store.update(d=>{d.profiles[creator]={email:'creator@example.com'};});const pilot=await engine.create({owner:creator,days:15,quantity:1,key:'creator-pilot'});assert.equal(pilot.status,'pending');config.update(c=>{c.mode='production';});
 // Contratos antigos/novos: prazo, carência, permanentes, reinício e renovação durante aviso.
 rentals.write({groups:{'old@g.us':{expiresAt:now-7200000,groupName:'Antigo',responsibleJid:owner},'new@g.us':{expiresAt:now-7199999,source:'mercadopago'},'permanent@g.us':{permanent:true,expiresAt:1},'unexpired@g.us':{expiresAt:now+DAY,responsibleJid:owner}}});
 const socket={user:{id:'bot'},sendMessage:async(jid,msg)=>sent.push({jid,msg}),groupLeave:async jid=>left.push(jid)};
 let tick=createRentalLifecycle({rentals,notices:store,clock:()=>now});await tick(socket);assert.deepEqual(left,['old@g.us']);assert.ok(!left.includes('permanent@g.us'));
 const noticeCount=sent.length;tick=createRentalLifecycle({rentals,notices:store,clock:()=>now});await tick(socket);assert.equal(sent.length,noticeCount);assert.equal(left.length,1);
 now++;await tick(socket);assert.ok(left.includes('new@g.us'));
 rentals.update(d=>{d.groups['late@g.us']={expiresAt:now-1000,responsibleJid:owner};});
 const racing={...socket,sendMessage:async()=>rentals.update(d=>{d.groups['late@g.us'].expiresAt=now+30*DAY;})};await tick(racing);assert.equal(rentals.read().groups['late@g.us'].expiresAt,now+30*DAY);assert.ok(!left.includes('late@g.us'));
 rentals.update(d=>{d.groups['reconcile@g.us']={expiresAt:now-GRACE};});
 await tick({...socket,kobaBillingBeforeLeave:async jid=>{if(jid==='reconcile@g.us')rentals.update(d=>{d.groups[jid].expiresAt=now+DAY;});}});assert.ok(!left.includes('reconcile@g.us'));
 rentals.update(d=>{d.groups['network@g.us']={expiresAt:now-GRACE};});await tick({...socket,kobaBillingBeforeLeave:async()=>{throw Error('API unavailable')}});assert.ok(!left.includes('network@g.us'));
 const badFile=path.join(dir,'corrupt.json');fs.writeFileSync(badFile,'bad');assert.throws(()=>jsonStore(badFile,{}).read());assert.equal(fs.readFileSync(badFile,'utf8'),'bad');
 console.log('Billing: matriz de preços 24 casos; autorização, idempotência, rede/reinício, Pix incompatível, simulação isolada, renovação sem perder dias, legado, carência 2h, permanentes e avisos persistidos OK.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
