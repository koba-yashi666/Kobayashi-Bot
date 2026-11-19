import assert from 'node:assert/strict';
import {billingOptions} from '../lib/features/billing/ui.js';
const options=[['Plano Inicial','/alugar plano abc 15'],['Plano Popular','/alugar plano abc 30'],['Plano Premium','/alugar plano abc 60'],['Plano Supremo','/alugar plano abc 90']];
for(const mode of ['accepted-but-not-rendered','throw','no-generator']){
 const events=[];const conn={user:{id:'bot'},sendMessage:async(jid,msg)=>{events.push({kind:'text',jid,msg});return {key:{id:'visible'}};},relayMessage:async()=>{events.push({kind:'relay'});if(mode==='throw')throw Error('rejected');return {};}};
 await billingOptions({conn,jid:'user@s.whatsapp.net',info:{key:{id:'test'}},text:'Escolha o plano',options,generate:mode==='no-generator'?undefined:(jid,message)=>({key:{id:'buttons'},message})});
 assert.equal(events[0].kind,'text');assert.equal(events.filter(x=>x.kind==='text').length,1);assert.match(events[0].msg.text,/Escolha o plano/);
 for(const [,command]of options)assert(events[0].msg.text.includes(command));
 if(mode!=='no-generator')assert.equal(events[1].kind,'relay');
}
let relays=0;await assert.rejects(billingOptions({conn:{user:{id:'bot'},sendMessage:async()=>{throw Error('transport unavailable')},relayMessage:async()=>relays++},jid:'u',text:'test',options,generate:()=>({})}));assert.equal(relays,0);
console.log('Entrega do aluguel: texto com opções antes do relay, botões silenciosamente ocultos, exceção e ausência de gerador; sem duplicar alternativa nem esconder falha de transporte OK.');
