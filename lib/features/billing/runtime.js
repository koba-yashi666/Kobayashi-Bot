import {paymentReceipt} from './paymentReceipt.js';
import {billingStore,configStore,asaasConfigStore} from './storage.js';
import {asaasBinding} from './asaas.js';
import {createBillingEngine} from './engine.js';
import {readRentalDb,writeRentalDb} from '../rental/rentalSystem.js';
import {billingOptions} from './ui.js';
export const billingEngine=createBillingEngine({store:billingStore,config:configStore,rentals:{read:readRentalDb,write:writeRentalDb},newProvider:'asaas',asaasConfig:asaasConfigStore});
let conn=null,started=false,busy=false;
export function reconcileDelay(o){const base=o.provider==='asaas'?(o.status==='expired'?15*60000:60000):30000;return Math.max(base,Math.min(15*60000,30000*2**Math.min(o.failures||0,5)));}
export async function billingTick(connection=conn){
 if(busy||!connection?.user)return;busy=true;
 try{
  const rows=Object.values(billingStore.read().orders).filter(o=>!o.simulated&&(!o.sandbox||o.binding===asaasBinding(asaasConfigStore.read()))&&Date.now()-(o.lastCheck||0)>=reconcileDelay(o)&&(['creating','pending'].includes(o.status)||(o.status==='expired'&&Date.now()-o.expiresAt<(o.provider==='asaas'?7*24:48)*3600000)||(o.status==='approved'&&(!o.notified||(!o.sandbox&&o.groups.some(jid=>!billingEngine.applied(o.id)[jid])))))).sort((a,b)=>(a.lastCheck||0)-(b.lastCheck||0)).slice(0,10);
  for(const order of rows){
   try{
    billingStore.update(d=>{d.orders[order.id].lastCheck=Date.now();});
    const result=await billingEngine.verify(order.id,order.owner);
    billingStore.update(d=>{d.orders[order.id].failures=0;delete d.orders[order.id].lastError;});
    if(result.status==='approved'&&!result.notified){
     await connection.sendMessage(result.owner,{text:paymentReceipt(result)||`🧪 *SANDBOX CONFIRMADA — SEM LIBERAR GRUPOS*\nPedido: ${result.id}\nNenhum grupo real alterado.`});
     billingStore.update(d=>{d.orders[result.id].notified=true;});
    }
   }catch(e){billingStore.update(d=>{const o=d.orders[order.id];if(o){o.failures=(o.failures||0)+1;o.lastError=String(e.message).slice(0,250);o.errorAt=Date.now();}});/* Nenhuma falha de rede libera aluguel. A próxima rodada reconcilia. */}
  }
 }finally{busy=false;}
}
export function ensureBillingRuntime(connection,{generate}={}){
 conn=connection||conn;
 if(conn)conn.kobaBillingBeforeLeave=async jid=>{
  const relevant=Object.values(billingStore.read().orders).filter(o=>!o.simulated&&!o.sandbox&&o.groups.includes(jid)&&(['creating','pending','uncertain'].includes(o.status)||(o.status==='expired'&&Date.now()-o.expiresAt<(o.provider==='asaas'?7*24:48)*3600000)||(o.status==='approved'&&!billingEngine.applied(o.id)[jid])));
  for(const order of relevant)await billingEngine.verify(order.id,order.owner);
 };
 if(conn)conn.kobaBillingReminder=(jid,text)=>billingOptions({conn,jid,text,options:[['♻️ Renovar / alterar grupos','/renovar'],['📦 Alterar plano','/renovar'],['🏘️ Meus aluguéis','/meusalugueis']],generate});
 if(started)return;started=true;const timer=setInterval(()=>billingTick().catch(()=>{}),30000);timer.unref?.();
 void billingTick();
}
