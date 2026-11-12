import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {getGlobalMediaTarget,getGlobalMediaText} from '../lib/features/system/globalMessage.js';
const quote=m=>({key:{remoteJid:'owner'},message:{extendedTextMessage:{text:'/msg',contextInfo:{stanzaId:'q',participant:'p',quotedMessage:m}}}});
let source=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8').split('case "msg": {')[1].split('\n}\nbreak;')[0];
for(const [message,text,kind,expected] of [
 [{imageMessage:{caption:'/msg Olá'}},'/msg Olá','image','Olá'],
 [null,'/msg','image','Legenda original'],
 [null,'/msg Nova legenda','image','Nova legenda'],
 [{stickerMessage:{isAnimated:true}},'/msg','sticker',''],
 [null,'/msg Recado','sticker','Recado']
]){
 const info=message?{key:{remoteJid:'owner'},message}:quote(kind==='image'?{imageMessage:{caption:'Legenda original'}}:{stickerMessage:{isAnimated:true}});
 const calls=[];const media=Buffer.from('media');
 await vm.runInNewContext('(async()=>{'+source+'})()',{
 SoDonoPrincipal:true,command:'msg',prefix:'/',fullCommandText:text,info,getGlobalMediaTarget,getGlobalMediaText,Buffer,console,
 downloadMediaMessage:async()=>media,setTimeout:f=>{f();return 0},reply:async()=>{},
 conn:{groupFetchAllParticipating:async()=>({'g@g.us':{participants:[{id:'a@lid'},{id:'b@lid'}]}}),sendMessage:async(jid,payload)=>calls.push(payload)}
 });
 assert.deepEqual([...calls[0].mentions],['a@lid','b@lid']);assert.equal(calls[0][kind],media);
 if(kind==='image'){assert.ok(calls[0].caption.includes(expected));assert.equal(calls.length,1)}
 else {assert.equal(calls.length,expected?2:1);if(expected)assert.equal(calls[1].text,expected)}
}
assert.equal(getGlobalMediaTarget(quote({conversation:'a'})),null);
assert.equal(getGlobalMediaTarget({message:{ephemeralMessage:{message:{videoMessage:{}}}}}),null);
console.log('MSG: foto com legenda, legenda citada/substituída, figurinha animada, texto adicional e menções OK');
