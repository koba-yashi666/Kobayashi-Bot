import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {buildStickerLabels} from '../lib/stickerMetadata.js';
const source=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8');
for(const [command,q,nick,pack,author] of [['rename','Kobayashi/bot','u','Kobayashi','bot'],['rename','Autor | Pacote','u','Pacote','Autor'],['roubar','','Oni-chan','','Oni-chan']]){
 const marker=command==='rename'?'case "rename": {':'case "steal": {';
 const body=source.split(marker)[1].split('\n}\nbreak;')[0];let got,sent=0;
 await vm.runInNewContext('(async()=>{'+body+'})()',{
 q,pushname:nick,sender:'123@lid',prefix:'/',info:{},type:'extendedTextMessage',from:'g',console,
 getStickerMediaTarget:()=>({message:{stickerMessage:{}}}),getContentType:()=> 'stickerMessage',
 reply:t=>{throw Error(t)},downloadMediaMessage:async()=>Buffer.from('sticker'),
 applyStickerMetadata:async(b,m)=>{got=buildStickerLabels(m);return b},conn:{sendMessage:async()=>sent++}
 });
 assert.equal(got.pack,pack);assert.equal(got.publisher,author);assert.equal(sent,1);
}
const defaults=buildStickerLabels({userNick:'u'});assert.ok(defaults.pack.includes('Criada por'));
console.log('Rename: pacote/autor exatos; formato antigo compatível; roubar somente nick; padrão de /s preservado OK');
