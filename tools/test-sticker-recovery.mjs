import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {downloadStickerMedia,stickerMediaKeyBytes} from '../lib/features/stickers/stickerMediaDownload.js';
import {runStickerCommand,rememberStickerOriginal} from '../commands/stickers/sticker.js';
import {getStickerMediaTarget,rememberStickerMediaMessage} from '../lib/features/stickers/stickerMediaTarget.js';
const key=Buffer.alloc(32,9), media={directPath:'/old',mediaKey:key}, target={key:{remoteJid:'test@g.us',id:'ordinary'},message:{imageMessage:media}};
for (const bytes of [key,new Uint8Array(key),[...key],key.toJSON(),key.toString('base64')]) assert.deepEqual(stickerMediaKeyBytes(bytes),key);
for (const invalid of [null,{},[],{data:[1,2]},'not key!']) assert.equal(stickerMediaKeyBytes(invalid).length,0);
for (const status of [404,410]) {
 let requests=0,refreshes=0;
 const result=await downloadStickerMedia(target,{preferDirect:true,conn:{updateMediaMessage:async original=>{refreshes++;assert.equal(original.key.id,'ordinary');original.message.imageMessage.directPath='/new';return original}},downloadContentFromMessage:async node=>{requests++;if(requests===1)throw {response:{status}};assert.equal(node.directPath,'/new');return Readable.from([Buffer.from('valid')])}});
 assert.equal(result.toString(),'valid');assert.equal(requests,2);assert.equal(refreshes,1);assert.equal(media.directPath,'/old');
}
for(const status of [400,401,403,429,500]){
 let refreshes=0,requests=0;await assert.rejects(downloadStickerMedia(target,{preferDirect:true,conn:{updateMediaMessage:async()=>refreshes++},downloadContentFromMessage:async()=>{requests++;throw {statusCode:status}}}));assert.equal(refreshes,0);assert.equal(requests,1);
}
let requests=0,refreshes=0;await assert.rejects(downloadStickerMedia(target,{conn:{updateMediaMessage:async t=>{refreshes++;return t}},downloadContentFromMessage:async()=>{requests++;throw {status:410}}}));assert.equal(refreshes,1);assert.equal(requests,2);
await assert.rejects(downloadStickerMedia(target,{conn:{updateMediaMessage:async t=>({...t,key:{...t.key,id:'another'}})},downloadContentFromMessage:async()=>{throw {status:404}}}),/mismatch/);
// Reenvio comum com chave serializada também usa a conversão e o envio normais.
let converted=0,sent=0;
await runStickerCommand({info:{...target,message:{imageMessage:{...media,mediaKey:key.toString('base64')}}},command:'s',prefix:'/',from:'test@g.us',metadata:{},reply:t=>assert.fail(t),conn:{sendMessage:async()=>sent++}},{downloadContentFromMessage:async()=>Readable.from([Buffer.from('image')]),makeSticker:async b=>{converted++;return b}});assert.equal(converted,1);assert.equal(sent,1);
// Nada é baixado ou guardado para converter mídias de visualização única.
for(const message of [{imageMessage:{...media,viewOnce:true}},...['viewOnceMessage','viewOnceMessageV2','viewOnceMessageV2Extension'].map(name=>({[name]:{message:{imageMessage:media}}}))]){
 const info={key:{id:'protected',remoteJid:'private@g.us'},message};let downloads=0,reply='';
 rememberStickerOriginal(info);rememberStickerMediaMessage(info);assert.equal(getStickerMediaTarget(info),null);
 await runStickerCommand({info,reply:t=>reply=t},{downloadContentFromMessage:async()=>downloads++});assert(reply.includes('visualização única'));assert.equal(downloads,0);
 await assert.rejects(downloadStickerMedia(info,{downloadContentFromMessage:async()=>downloads++}),{code:'VIEW_ONCE_PROTECTED'});assert.equal(downloads,0);
 const quoted={key:{remoteJid:'private@g.us'},message:{extendedTextMessage:{contextInfo:{stanzaId:'protected',quotedMessage:message}}}};
 assert.equal(getStickerMediaTarget(quoted),null);await runStickerCommand({info:quoted,reply:t=>reply=t},{});assert(reply.includes('visualização única'));
}
for (const buffer of [Buffer.alloc(0),Buffer.alloc(32*1024*1024+1)]) await assert.rejects(downloadStickerMedia({key:target.key,message:{imageMessage:{url:'https://mmg.whatsapp.net/x',mediaKey:key}}},{downloadMediaMessage:async()=>buffer}),/empty|too_large/);
console.log('Figurinhas: chave serializada, atualização única em 404/410, sem retry 401/403/429, falha persistente, identidade da mensagem, limite de tamanho e visualização única sem download/cache OK.');

let socketDownload=0;
await downloadStickerMedia(target,{conn:{downloadContentFromMessage:async()=>{socketDownload++;return Readable.from([Buffer.from('socket-host')])}},downloadContentFromMessage:async()=>assert.fail('Prefere o download vinculado à conexão')});assert.equal(socketDownload,1);
