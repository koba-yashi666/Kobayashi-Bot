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
 return `✅ ${checks} verificações simuladas passaram.\nPreços, isolamento, rejeição de pagamento de teste, saída após 2h e aluguel permanente.\nNenhuma chamada à API, cobrança, mensagem a cliente ou saída de grupo real foi executada.`;
}
