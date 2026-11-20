import assert from 'node:assert/strict';
import {billingOptions,resolveBillingInput} from '../lib/features/billing/ui.js';
const memory=()=>{let d={};return {read:()=>structuredClone(d),update(fn){fn(d)}}};
const options=[['Plano Inicial','/alugar plano abc 15'],['Plano Popular','/alugar plano abc 30'],['Plano Premium','/alugar plano abc 60'],['Plano Supremo','/alugar plano abc 90']];
for(const mode of ['accepted-but-not-rendered','throw','no-generator']){
 const store=memory(),events=[];let now=10000,wire;
 const conn={user:{id:'bot'},sendMessage:async(jid,msg)=>{events.push({kind:'text',jid,msg});return {key:{id:'visible'}};},relayMessage:async(jid,msg)=>{wire=msg;events.push({kind:'relay'});if(mode==='throw')throw Error('rejected');}};
 await billingOptions({conn,jid:'user@s.whatsapp.net',info:{key:{id:'test'}},text:'Escolha o plano',options,store,clock:()=>now,generate:mode==='no-generator'?undefined:(jid,message)=>({key:{id:'buttons'},message})});
 assert.equal(events[0].kind,'text');assert.equal(events.filter(x=>x.kind==='text').length,1);assert.match(events[0].msg.text,/2 • Plano Popular/);assert(!events[0].msg.text.includes('/alugar plano'));
 const input=extra=>resolveBillingInput({jid:'user@s.whatsapp.net',text:'2',store,clock:()=>now,...extra});
 assert.equal(input(),options[1][1]);assert.equal(input({jid:'other@s.whatsapp.net'}),null);assert.equal(input({isGroup:true}),null);assert.equal(input({fromMe:true}),null);assert.equal(input({text:'oi 2'}),null);assert.equal(input({text:'99'}),null);assert.equal(input({quotedId:'old-menu'}),null);assert.equal(input({quotedId:'visible'}),options[1][1]);
 if(mode!=='no-generator'){assert.equal(events[1].kind,'relay');assert(wire.viewOnceMessage.message.messageContextInfo);assert.equal(wire.viewOnceMessage.message.interactiveMessage.nativeFlowMessage.buttons[0].name,'single_select');}
 now+=600001;assert.equal(input(),null);
 await billingOptions({conn,jid:'user@s.whatsapp.net',text:'Quantos?',options:[],quantityCommand:'/alugar quantidade abc',store,clock:()=>now});assert.equal(input({text:'6'}),'/alugar quantidade abc 6');assert.equal(input({text:'51'}),null);
 await billingOptions({conn,jid:'user@s.whatsapp.net',text:'Pix',options:options.slice(0,2),copy:'000201example',store,clock:()=>now,generate:(jid,message)=>({key:{id:'copy'},message})});
 assert.equal(JSON.parse(wire.viewOnceMessage.message.interactiveMessage.nativeFlowMessage.buttons[0].buttonParamsJson).copy_code,'000201example');
}
const aliases=memory();aliases.update(d=>d.identityAliases={'777@lid':'user@s.whatsapp.net'});
await billingOptions({conn:{sendMessage:async()=>({key:{id:'alias-menu'}})},jid:'user@s.whatsapp.net',text:'Renovar',options:[['Renovar','/renovar']],store:aliases});
assert.equal(resolveBillingInput({jid:'777@lid',text:'1',store:aliases}),'/renovar');
let relays=0;await assert.rejects(billingOptions({conn:{user:{id:'bot'},sendMessage:async()=>{throw Error('transport unavailable')},relayMessage:async()=>relays++},jid:'u',text:'test',options,store:memory(),generate:()=>({})}));assert.equal(relays,0);
console.log('Entrega: envelope nativo, copiar Pix, fallback numerado, quantidade livre 1–50, TTL, remetente, privado, citação antiga e transporte OK.');
