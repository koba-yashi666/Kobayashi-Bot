import assert from 'node:assert/strict';
import sharp from 'sharp';
import {buildNoWaterMeme,downloadProfilePhoto} from '../lib/ui/noWaterMeme.js';
import command from '../commands/fun/dragonFun/naodeagua.js';
import fun from '../commands/fun/dragonFun.js';

const sample=await sharp({create:{width:400,height:250,channels:3,background:'#22aaee'}}).png().toBuffer();
const output=await buildNoWaterMeme(sample);
const {data,info}=await sharp(output).raw().toBuffer({resolveWithObject:true});
assert.equal(info.width,984);assert.equal(info.height,827);
const pixel=(x,y)=>Array.from(data.subarray((y*info.width+x)*info.channels,(y*info.width+x)*info.channels+3));
assert(pixel(160,340)[2]>180); // Foto visível dentro da placa.
assert(pixel(238,305)[0]>pixel(238,305)[2]); // Faixa vermelha continua acima da foto.
assert(fun.aliases.includes('naodeagua'));
const oldFetch=globalThis.fetch,images=[],replies=[],lookups=[];
const sender='111@s.whatsapp.net',target='222@s.whatsapp.net';
const ctx={command:'naodeagua',prefix:'/',isGroup:true,isFunModeEnabled:()=>true,from:'g@g.us',sender,info:{message:{extendedTextMessage:{contextInfo:{mentionedJid:[target]}}}},reply:async t=>replies.push(t),conn:{profilePictureUrl:async id=>{lookups.push(id);return 'https://example.invalid/avatar.png';},sendMessage:async(j,p)=>images.push(p)}};
try{
  globalThis.fetch=async()=>new Response(sample,{headers:{'content-type':'image/png'}});
  await command(ctx);assert.deepEqual(images.at(-1).mentions,[target]);assert(Buffer.isBuffer(images.at(-1).image));
  await command({...ctx,info:{message:{extendedTextMessage:{contextInfo:{participant:target}}}}});assert.equal(lookups.at(-1),target);
  await command({...ctx,info:{}});assert.equal(lookups.at(-1),sender);
  await command({...ctx,conn:{...ctx.conn,profilePictureUrl:async()=>{throw Error('privado');}}});assert(replies.at(-1).includes('foto de perfil'));
  const count=images.length;await command({...ctx,isFunModeEnabled:()=>false});assert.equal(images.length,count);
  globalThis.fetch=async()=>new Response('x',{headers:{'content-length':String(9*1024*1024)}});await assert.rejects(downloadProfilePhoto('https://example.invalid/large'));
  globalThis.fetch=async()=>new Response('no',{status:404});await assert.rejects(downloadProfilePhoto('https://example.invalid/missing'));
  console.log('✅ Meme: composição real, faixa por cima, menção, resposta, própria foto, privacidade, limite de download e modo brincadeira.');
}finally{globalThis.fetch=oldFetch;}
