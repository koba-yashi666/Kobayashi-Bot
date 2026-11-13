import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {downloadStickerMedia} from '../lib/features/stickers/stickerMediaDownload.js';
for(const type of ['image','video']){
 let generic=0,direct=0;const node={directPath:'/received-media',mediaKey:Buffer.from('key')};
 const deps={conn:{},downloadMediaMessage:async()=>{generic++;throw Error('wrapper must not run without url')},downloadContentFromMessage:async(n,t)=>{assert.equal(n,node);assert.equal(t,type);direct++;return Readable.from([Buffer.from('abc'),Buffer.from('def')])}};
 assert.equal((await downloadStickerMedia({message:{[type+'Message']:node}},deps)).toString(),'abcdef');assert.equal(generic,0);assert.equal(direct,1);
 node.url='https://mmg.whatsapp.net/media';deps.downloadMediaMessage=async()=>{generic++;return Buffer.from('normal')};
 assert.equal((await downloadStickerMedia({message:{[type+'Message']:node}},deps)).toString(),'normal');assert.equal(direct,1);
 deps.downloadMediaMessage=async()=>{throw {output:{statusCode:400}}};await downloadStickerMedia({message:{[type+'Message']:node}},deps);assert.equal(direct,2);
 deps.downloadMediaMessage=async()=>{throw {output:{statusCode:401}}};await assert.rejects(downloadStickerMedia({message:{[type+'Message']:node}},deps));assert.equal(direct,2);
}
const target={message:{imageMessage:{directPath:'/media',mediaKey:Buffer.from('key')}}};
await assert.rejects(downloadStickerMedia(target,{conn:{},downloadContentFromMessage:async()=>Readable.from([])}),/empty/);
await assert.rejects(downloadStickerMedia(target,{conn:{},downloadContentFromMessage:async()=>Readable.from([Buffer.alloc(32*1024*1024+1)])}),/too_large/);
console.log('Download: foto/vídeo sem URL usa directPath; normal preservado; fallback 400; sem retry 401; vazio e limite de tamanho OK');
