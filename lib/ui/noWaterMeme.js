import fs from 'node:fs';

export async function buildNoWaterMeme(photo){
  const {default:sharp}=await import('sharp');
  const avatar=await sharp(photo,{limitInputPixels:20000000}).rotate().resize(358,358,{fit:'cover'}).ensureAlpha().composite([{
    input:Buffer.from('<svg width="358" height="358"><circle cx="179" cy="179" r="179" fill="white"/></svg>'),blend:'dest-in'
  }]).png().toBuffer();
  const template=fs.readFileSync(new URL('../../media/brincadeiras/naodeagua-template.png',import.meta.url));
  return sharp({create:{width:984,height:827,channels:4,background:'#ffffff'}})
    .composite([{input:avatar,left:59,top:126},{input:template,left:0,top:0}])
    .jpeg({quality:90}).toBuffer();
}

export async function downloadProfilePhoto(url){
  const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
  if(!response.ok||!response.body)throw Error('Foto indisponível');
  const limit=8*1024*1024;
  if(Number(response.headers.get('content-length'))>limit)throw Error('Foto muito grande');
  const chunks=[];let bytes=0;
  for await(const chunk of response.body){bytes+=chunk.length;if(bytes>limit)throw Error('Foto muito grande');chunks.push(Buffer.from(chunk));}
  if(!bytes)throw Error('Foto vazia');
  return Buffer.concat(chunks);
}
