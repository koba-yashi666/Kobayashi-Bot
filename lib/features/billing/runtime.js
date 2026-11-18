import {billingStore,configStore} from './storage.js';
import {createBillingEngine} from './engine.js';
import {readRentalDb,writeRentalDb} from '../rental/rentalSystem.js';
import {billingOptions} from './ui.js';
export const billingEngine=createBillingEngine({store:billingStore,config:configStore,rentals:{read:readRentalDb,write:writeRentalDb}});
let conn=null,started=false,busy=false;
export async function billingTick(connection=conn){
 if(busy||!connection?.user)return;busy=true;
 try{
  const rows=Object.values(billingStore.read().orders).filter(o=>!o.simulated&&(['creating','pending'].includes(o.status)||(o.status==='expired'&&Date.now()-o.expiresAt<48*3600000)||(o.status==='approved'&&o.groups.some(jid=>!billingEngine.applied(o.id)[jid])))).sort((a,b)=>(a.lastCheck||0)-(b.lastCheck||0)).slice(0,10);
  for(const order of rows){
   try{
    billingStore.update(d=>{d.orders[order.id].lastCheck=Date.now();});
    const result=await billingEngine.verify(order.id,order.owner);
    if(result.status==='approved'&&!result.notified){
     await connection.sendMessage(result.owner,{text:`✅ *PIX APROVADO*\nPedido: ${result.id}\n${result.groups.length?'Renovação aplicada aos grupos selecionados.':`Você tem ${result.quantity} vaga(s). Vincule cada grupo com:\n/vincularaluguel ${result.id} LINK_DO_GRUPO`}`});
     billingStore.update(d=>{d.orders[result.id].notified=true;});
    }
   }catch{/* Nenhuma falha de rede libera aluguel. A próxima rodada reconcilia. */}
  }
 }finally{busy=false;}
}
export function ensureBillingRuntime(connection,{generate}={}){
 conn=connection||conn;
 if(conn)conn.kobaBillingBeforeLeave=async jid=>{
  const relevant=Object.values(billingStore.read().orders).filter(o=>!o.simulated&&o.groups.includes(jid)&&(['creating','pending'].includes(o.status)||(o.status==='expired'&&Date.now()-o.expiresAt<48*3600000)||(o.status==='approved'&&!billingEngine.applied(o.id)[jid])));
  for(const order of relevant)await billingEngine.verify(order.id,order.owner);
 };
 if(conn)conn.kobaBillingReminder=(jid,text)=>billingOptions({conn,jid,text,options:[['♻️ Renovar / alterar grupos','/renovar'],['📦 Alterar plano','/renovar'],['🏘️ Meus aluguéis','/meusalugueis']],generate});
 if(started)return;started=true;const timer=setInterval(()=>billingTick().catch(()=>{}),30000);timer.unref?.();
 void billingTick();
}
