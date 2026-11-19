import {asaasBinding,matchingAsaasPayment,checkoutBody} from './asaas.js';
import {createBillingEngine} from './engine.js';
import {price,DAY,GRACE} from './storage.js';
import {confirmedPayment} from './mercadoPago.js';
import {createRentalLifecycle} from './lifecycle.js';
const memory=initial=>{let value=structuredClone(initial);return {read:()=>structuredClone(value),write:v=>{value=structuredClone(v)},update(fn){const v=this.read(),r=fn(v);this.write(v);return r;}};};
export async function runBillingSelfTest(){
 let checks=0;const check=(ok,label)=>{if(!ok)throw Error('Teste falhou: '+label);checks++;};
 const now=Date.now(),owner='test@s.whatsapp.net',store=memory({orders:{},sessions:{},profiles:{},notices:{}}),config=memory({mode:'off'}),rentals=memory({groups:{}});
 for(const [d,p]of [[15,1700],[30,2500],[60,4500],[90,6700]])for(const n of [1,2,3,6])check(price(d,n)===p*n,'preço');
 const engine=createBillingEngine({store,config,rentals,clock:()=>now,request:async()=>{throw Error('O teste não deve acessar API real.');}});
 const order=await engine.create({owner,days:30,quantity:2,simulated:true});engine.simulate(order.id,owner,'approved');
 check(Object.keys(rentals.read().groups).length===0,'simulação isolada');
 try{await engine.attach(order.id,owner,'fake',{});throw Error('Liberou grupo');}catch(e){check(e.message!=='Liberou grupo','simulação não libera vaga');}
 check(!confirmedPayment({paymentId:'1',id:'id',cents:2500},{id:'1',external_reference:'id',transaction_amount:25,currency_id:'BRL',collector_id:'c',payment_method_id:'pix',live_mode:false,status:'approved'},'c'),'ambiente');
 rentals.write({groups:{'test@g.us':{expiresAt:now-GRACE},'permanent@g.us':{expiresAt:1,permanent:true}}});
 let leaves=0;const tick=createRentalLifecycle({rentals,notices:store,clock:()=>now});await tick({user:{id:'fake'},groupLeave:async()=>{leaves++},sendMessage:async()=>{}});check(leaves===1,'carência e permanente');
 check(DAY===86400000,'unidade');
 const asaasConfig=memory({mode:'sandbox',environment:'sandbox',token:'OFFLINE-TEST-KEY',returnUrl:'https://wa.me/5511000000000'});
 asaasConfig.update(c=>{c.verifiedBinding=asaasBinding(c)});
 const testStore=memory({orders:{},profiles:{},sessions:{},notices:{}}),testRentals=memory({groups:{}}),creator='5515997075304@s.whatsapp.net',checkoutId='c7b1c696-b27b-4d3d-80b9-d1c018e387f8';
 const request=async(c,route)=>route==='/checkouts'?{id:checkoutId}:route.startsWith('/payments?')?{data:[{id:'pay_test',checkoutSession:checkoutId,billingType:'PIX',value:25,status:'RECEIVED'}]}:{id:'pay_test',checkoutSession:checkoutId,billingType:'PIX',value:25,status:'RECEIVED'};
 const apiTest=createBillingEngine({store:testStore,config,rentals:testRentals,newProvider:'asaas',asaasConfig,asaasRequest:request,clock:()=>now});
 const sandbox=await apiTest.create({owner:creator,days:30,quantity:1,key:'offline-sandbox'});
 check(sandbox.sandbox,'ambiente Sandbox');
 check(sandbox.checkoutUrl.startsWith('https://sandbox.asaas.com/'),'link Sandbox');
 const approved=await apiTest.verify(sandbox.id,creator);
 check(approved.status==='approved','confirmação Sandbox mock');
 check(!Object.keys(testRentals.read().groups).length,'Sandbox não libera grupos');
 let blocked=false;try{apiTest.grant(approved,{jid:'real@g.us'});}catch{blocked=true;}check(blocked,'bloqueio de grant Sandbox');
 check(checkoutBody(sandbox,asaasConfig.read().returnUrl).items[0].value===25,'valor Checkout');
 check(!matchingAsaasPayment(sandbox,{id:'pay_test',checkoutSession:'outro',billingType:'PIX',value:25}),'checkout adulterado');
 return `✅ ${checks} verificações simuladas passaram.\nPreços, Asaas mock, Sandbox isolada, saída após 2h e aluguel permanente.\nNenhuma chamada à API, cobrança, mensagem a cliente ou saída de grupo real foi executada.`;
}
