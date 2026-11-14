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
const {stickerDownloadDiagnostic,formatStickerDownloadDiagnostic}=await import('../lib/features/stickers/stickerMediaDownload.js');
const privateTarget={source:'quoted',message:{imageMessage:{mediaKey:Buffer.alloc(32,7),directPath:'/private-secret-path',url:'https://private.example/secret'}}};
const error={output:{statusCode:400},message:'No valid media URL or directPath present in message https://private.example/secret',stickerRoute:'direct'};
const report=stickerDownloadDiagnostic(privateTarget,error);assert.equal(report.keyBytes,32);assert.equal(report.route,'direct');assert.equal(report.reason,'missing-location');
const safe=formatStickerDownloadDiagnostic(privateTarget,error);assert.ok(!safe.includes('private'));assert.ok(!safe.includes('secret'));assert.ok(!safe.includes('https'));assert.ok(safe.includes('32 bytes'));
const missing=stickerDownloadDiagnostic({message:{imageMessage:{viewOnce:true}}},{output:{statusCode:400}});assert.equal(missing.keyBytes,0);assert.equal(missing.hasDirectPath,false);assert.equal(missing.hasUrl,false);
console.log('Diagnóstico: diferencia dados ausentes; não inclui chave, URL, caminho ou mensagem bruta do erro OK');
