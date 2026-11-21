import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {rememberStickerOriginal,stickerCaption,resolveStickerInput,runStickerCommand} from '../commands/stickers/sticker.js';
const wrap=(name,message)=>name==='plain'?message:{[name]:{message}};
let count=0;
for(const name of ['plain','ephemeralMessage','deviceSentMessage','documentWithCaptionMessage']){
 for(const type of ['image','video','sticker'])for(const replied of [false,true])for(const command of ['s','s2']){
  const id='media'+count++;const chat='chat@g.us';
  const media={mediaKey:Buffer.alloc(32,4),directPath:'/received',seconds:3,caption:'/s'};
  const original={key:{id,remoteJid:chat,participant:'author@lid'},message:wrap('ephemeralMessage',wrap(name,{[type+'Message']:media}))};
  assert.equal(stickerCaption(original.message),'/s');rememberStickerOriginal(original);
  const info=replied?{key:{remoteJid:chat},message:{extendedTextMessage:{text:'/s',contextInfo:{stanzaId:id,quotedMessage:{[type+'Message']:{}}}}}}:original;
  let sent=0,converted=0;
  const metadata={userNick:'Oni-chan'};
  await runStickerCommand({info,command,prefix:'/',metadata,from:chat,reply:t=>{throw Error(t)},conn:{sendMessage:async(j,p)=>{assert.equal(j,chat);assert.ok(Buffer.isBuffer(p.sticker));sent++}}},{
   downloadContentFromMessage:async(n,t)=>{assert.equal(n.directPath,'/received');assert.equal(t,type);return Readable.from([Buffer.from('bytes')])},
   downloadMediaMessage:async()=>{throw Error('wrapper should not run')},
   makeSticker:async(b,o)=>{assert.equal(o.isVideo,type==='video');assert.equal(o.forceSquare,command!=='s2');assert.equal(o.metadata,metadata);converted++;return b},
   applyStickerMetadata:async(b,m)=>{assert.equal(m,metadata);converted++;return b}
  });assert.equal(sent,1);assert.equal(converted,1);
 }
}
const full={key:{remoteJid:'scope@g.us',id:'same'},message:{imageMessage:{mediaKey:Buffer.alloc(32,1),directPath:'/original'}}};
rememberStickerOriginal(full);rememberStickerOriginal({...full,message:{imageMessage:{}}});
const quote=(chat,id)=>({key:{remoteJid:chat},message:{extendedTextMessage:{contextInfo:{stanzaId:id,quotedMessage:{imageMessage:{}}}}}});
assert.equal(resolveStickerInput(quote('scope@g.us','same')).media.directPath,'/original');
assert.equal(resolveStickerInput(quote('other@g.us','same')).original,false);
rememberStickerOriginal({...full,key:{...full.key,id:'expire'}},1000);assert.equal(resolveStickerInput(quote('scope@g.us','expire'),301001).original,false);
let reply='',downloads=0;
await runStickerCommand({info:quote('missing@g.us','x'),prefix:'/',command:'s',reply:t=>reply=t},{downloadContentFromMessage:async()=>downloads++});assert.equal(downloads,0);assert.ok(reply.includes('Chave: 0 bytes'));assert.ok(reply.includes('original')||reply.includes('Original'));assert.ok(!reply.includes('/original'));
await runStickerCommand({info:{key:{},message:{videoMessage:{seconds:10}}},command:'s',reply:t=>reply=t},{});assert.ok(reply.includes('9.9'));
console.log('Novo /s e /s2: '+count+' envios simulados; foto/vídeo/sticker, envelopes, citação incompleta, isolamento, expiração e original não sobrescrito OK');
