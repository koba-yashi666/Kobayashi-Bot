import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {getStickerMediaTarget} from '../lib/features/stickers/stickerMediaTarget.js';
const source=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8');
const block=source.split('case "s": {')[1].split('\n}\nbreak;')[0];
const wrap=(kind,message)=>kind==='plain'?message:{[kind]:{message}};
for(const wrapper of ['plain','viewOnceMessage','viewOnceMessageV2','viewOnceMessageV2Extension','ephemeralMessage']){
 for(const type of ['imageMessage','videoMessage'])for(const quoted of [false,true]){
  const media={ [type]:{seconds:3,caption:'/s',viewOnce:true}};
  const wrapped=wrap('ephemeralMessage',wrap(wrapper,media));
  const info=quoted?{key:{remoteJid:'g@g.us'},message:{extendedTextMessage:{text:'/s',contextInfo:{stanzaId:'quoted-id',participant:'user@lid',quotedMessage:wrapped}}}}:{key:{remoteJid:'g@g.us',id:'current-id'},message:wrapped};
  const target=getStickerMediaTarget(info);assert.equal(target.message[type],media[type]);assert.equal(target.source,quoted?'quoted':'current');
  for(const command of ['s','s2']){
   let sent=0,downloaded=false;
   await vm.runInNewContext('(async()=>{'+block+'})()',{
    info,command,prefix:'/',pushname:'u',sender:'u@lid',groupName:'g',NomeDoBot:'Koba',ownerName:'owner',from:'g@g.us',isGroup:true,
    reagir(){},reply:t=>{throw Error(t)},getStickerMediaTarget,getContentType:m=>Object.keys(m)[0],readSettingsFile:()=>({}),
    downloadMediaMessage:async(t,format,options,reupload)=>{assert.equal(t.message[type],media[type]);assert.equal(format,'buffer');assert.equal(typeof reupload.reuploadRequest,'function');downloaded=true;return Buffer.from('media')},
    makeSticker:async(b,o)=>{assert.equal(o.isVideo,type==='videoMessage');assert.equal(o.forceSquare,command!=='s2');return b},
    conn:{updateMediaMessage(){},sendMessage:async(j,payload)=>{assert.ok(payload.sticker);sent++}},console
   });assert.equal(downloaded,true);assert.equal(sent,1);
  }
 }
}
assert.equal(getStickerMediaTarget({message:{extendedTextMessage:{text:'/s',contextInfo:{quotedMessage:{conversation:'oi'}}}}}),null);
console.log('Figurinhas: /s e /s2, foto/vídeo atual ou citado, envelopes visualização única V1/V2/Extension e efêmero OK');
