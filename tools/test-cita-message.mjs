import assert from 'node:assert/strict';
import {buildCitaPayload} from '../lib/features/group/citaMessage.js';
const mentions=['1@lid','2@lid','1@lid'],download=async()=>Buffer.from('media');
let p=await buildCitaPayload({message:{conversation:'/cita'}},'',mentions,download);
assert.equal(p.text,'\u200e');assert.deepEqual(p.mentions,['1@lid','2@lid']);
const quote=m=>({message:{extendedTextMessage:{text:'/cita',contextInfo:{quotedMessage:m}}}});
p=await buildCitaPayload(quote({conversation:'Olá'}),'',mentions,download);assert.equal(p.text,'Olá');
for(const key of ['pollCreationMessage','pollCreationMessageV2','pollCreationMessageV3']){
 p=await buildCitaPayload(quote({[key]:{name:'Qual?',options:[{optionName:'A'},{optionName:'B'}],selectableOptionsCount:1}}),'',mentions,download);
 assert.deepEqual(p.poll,{name:'Qual?',values:['A','B'],selectableCount:1});assert.deepEqual(p.mentions,['1@lid','2@lid']);assert(!p.messageSecret);
}
p=await buildCitaPayload(quote({videoMessage:{gifPlayback:true,caption:'GIF'}}),'',mentions,download);assert(p.video.length);assert(p.gifPlayback);assert.equal(p.caption,'GIF');
await assert.rejects(()=>buildCitaPayload(quote({reactionMessage:{}}),'',mentions,download));
console.log('✅ Cita: marcação sem texto visível, texto citado, enquetes V1/V2/V3 e GIF.');
const {sendCitaPayload}=await import('../lib/features/group/citaMessage.js');
let sent;
const conn={user:{id:'bot@lid'},relayMessage:async(jid,message)=>{sent=message;},sendMessage:async()=>{throw Error('Enquete não deve usar caminho comum');}};
await sendCitaPayload(conn,'grupo@g.us',{poll:{name:'Qual?',values:['A','B'],selectableCount:1},mentions:['1@lid','2@lid']},async()=>({key:{id:'novo'},message:{messageContextInfo:{messageSecret:Buffer.alloc(32)},pollCreationMessageV3:{name:'Qual?'}}}));
assert.deepEqual(sent.pollCreationMessageV3.contextInfo.mentionedJid,['1@lid','2@lid']);assert(sent.messageContextInfo.messageSecret);
