import dns from 'node:dns/promises';
import net from 'node:net';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const MAX=32*1024*1024,ROOT='https://yuta-apis.xyz';
const ROUTES={youtube:['/api/downloads/ytvideo','url'],tiktok:['/api/downloads/tiktok-video','url'],instagram:['/api/downloads/instagram-video','url'],pinterest:['/api/downloads/pinterest','query'],pinterestVideo:['/api/downloads/pinterest-video','url']};
const DOMAINS={youtube:['youtube.com','youtu.be'],tiktok:['tiktok.com'],instagram:['instagram.com'],pinterest:['pinterest.com','pinterest.com.br','pin.it']};
export function validSource(value,service){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&DOMAINS[service]?.some(d=>u.hostname===d||u.hostname.endsWith('.'+d));}catch{return false;}}
function publicAddress(ip){
 if(net.isIP(ip)===4){const [a,b]=ip.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&[0,168].includes(b)||a===100&&b>=64&&b<=127||a===198&&[18,19].includes(b));}
 if(net.isIP(ip)===6)return /^[23][0-9a-f]{3}:/i.test(ip)&&!/^200[12]:/i.test(ip);
 return false;
}
export async function safeMediaUrl(raw,lookup=(host)=>dns.lookup(host,{all:true})){const u=new URL(raw);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.port&&!['80','443'].includes(u.port))throw Error('MEDIA_URL');const host=u.hostname.replace(/^\[|\]$/g,'');const addresses=net.isIP(host)?[{address:host}]:await lookup(host);if(!addresses.length||addresses.some(x=>!publicAddress(x.address)))throw Error('MEDIA_URL');return u;}
async function readLimited(response,limit=MAX){const size=Number(response.headers.get('content-length'));if(size>limit)throw Error('TOO_BIG');const chunks=[];let total=0;for await(const part of response.body||[]){const chunk=Buffer.from(part);total+=chunk.length;if(total>limit)throw Error('TOO_BIG');chunks.push(chunk);}if(!total)throw Error('EMPTY');return Buffer.concat(chunks,total);}
export function mediaKind(b){if(b[0]===255&&b[1]===216&&b[2]===255)return 'image';if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'image';if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP')return 'image';if(/^GIF8[79]a/.test(b.toString('ascii',0,6)))return 'gif';if(b.toString('ascii',4,8)==='ftyp')return 'video';if(b.subarray(0,4).equals(Buffer.from([26,69,223,163])))return 'webm';return null;}
export function resultUrls(data,video=false){
 const out=[];const add=s=>{if(typeof s==='string'&&/^https?:\/\//i.test(s)&&!out.includes(s))out.push(s);};
 function visit(node,depth=0){if(depth>5||out.length>30||!node)return;if(typeof node==='string'){add(node);return;}if(Array.isArray(node)){node.slice(0,30).forEach(x=>visit(x,depth+1));return;}if(typeof node!=='object')return;
  const mediaKeys=video?['video','videoUrl','video_url','download','downloadUrl','download_url','mp4','hd','sd','url']:['image','imageUrl','image_url','images','download','downloadUrl','download_url','url'];
  for(const k of mediaKeys)if(node[k])visit(node[k],depth+1);
  for(const k of ['result','resultado','data','results','medias','media','links','items'])if(node[k])visit(node[k],depth+1);
 }
 visit(data);return out;
}
export async function fetchYutaMedia(service,input,{token,clientKey='',fetchImpl=fetch,lookup}={}){
 const [route,param]=ROUTES[service]||[];if(!route)throw Error('ROUTE');
 let url=new URL(route,ROOT);url.searchParams.set(param,input);
 const headers={Authorization:token,'x-yuta-client':'KobayashiBot-MD',Accept:'application/json',...(clientKey?{'x-yuta-apikey':clientKey}:{})};
 async function get(initial,api){let current=new URL(initial);for(let i=0;i<5;i++){
  if(!api)await safeMediaUrl(current,lookup);
  const r=await fetchImpl(current.href,{headers:api?headers:{},redirect:'manual',signal:AbortSignal.timeout(90000)});
  if([301,302,303,307,308].includes(r.status)){const location=r.headers.get('location');await r.body?.cancel?.();if(!location)throw Error('REDIRECT');const next=new URL(location,current);if(api&&next.origin!==ROOT)throw Error('REDIRECT');current=next;continue;}
  if(!r.ok){await r.body?.cancel?.();throw Error([401,403].includes(r.status)&&api?'TOKEN':r.status===429?'RATE':r.status===404?'NOT_FOUND':'SERVICE');}return r;
 }throw Error('REDIRECT');}
 const r=await get(url,true),jsonType=(r.headers.get('content-type')||'').includes('json');const b=await readLimited(r,jsonType?2*1024*1024:MAX);
 const direct=mediaKind(b);if(direct)return {bytes:b,kind:direct};
 let data;try{data=JSON.parse(b.toString('utf8'));}catch{throw Error('NO_MEDIA');}
 const candidates=resultUrls(data,service!=='pinterest');
 for(const candidate of candidates.slice(0,3)){try{const response=await get(candidate,false),bytes=await readLimited(response),kind=mediaKind(bytes);if(kind)return {bytes,kind};}catch(e){if(e.message==='TOO_BIG')throw e;}}
 throw Error('NO_MEDIA');
}
export async function prepareMedia(media){
 if(!['gif','webm'].includes(media.kind))return media;
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'koba-download-'));try{
 const input=path.join(dir,'input.'+media.kind),output=path.join(dir,'output.mp4');await fs.writeFile(input,media.bytes);
 await promisify(execFile)('ffmpeg',['-nostdin','-y','-protocol_whitelist','file,pipe','-i',input,'-vf','scale=ceil(iw/2)*2:ceil(ih/2)*2','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart','-fs',String(MAX),...(media.kind==='gif'?['-an']:['-c:a','aac']),output],{timeout:30000,maxBuffer:65536});
 const bytes=await fs.readFile(output);if(!bytes.length||bytes.length>=MAX)throw Error('TOO_BIG');return {bytes,kind:'video',gifPlayback:media.kind==='gif'};
 }catch(e){if(e.message==='TOO_BIG')throw e;throw Error('CONVERT');}finally{await fs.rm(dir,{recursive:true,force:true});}
}
export function createDownloadHandler({fetchMedia=fetchYutaMedia,convert=prepareMedia,clock=()=>Date.now()}={}){
 let busy=0;const users=new Map();
 return async function handle({command,q,prefix='/',sender,from,conn,info,reply,token,clientKey}){
  const isPin=command==='pinterest',raw=String(q||'').trim();let service=command;
  if(!raw){await reply(isPin?`📌 Use ${prefix}pinterest tema ou ${prefix}pinterest link do pin. Para vídeos: ${prefix}pinterest video LINK.`:`🎬 Use ${prefix}${command} LINK do vídeo.`);return;}
  let input=raw;if(isPin&&/^video\s+/i.test(input)){service='pinterestVideo';input=input.replace(/^video\s+/i,'');}
  else if(isPin&&/^https?:\/\//i.test(input))service='pinterestVideo';
  if(!isPin||service==='pinterestVideo'){if(!validSource(input,isPin?'pinterest':command)){await reply(`🔗 Envie um link HTTPS válido do ${isPin?'Pinterest':command}.`);return;}}
  else if(input.length>200||input.includes('://')){await reply('📌 Envie um tema de até 200 caracteres ou um link válido do Pinterest.');return;}
  if(!token||token==='COLOQUE_SEU_TOKEN_YUTA_AQUI'){await reply('🔑 O dono precisa configurar o token da Yuta usado no /play.');return;}
  const key=from+'|'+sender,now=clock();if(users.has(key)&&now-users.get(key)<15000){await reply('⏳ Aguarde 15 segundos entre downloads.');return;}
  if(busy>=2){await reply('⏳ Já estou preparando outros downloads. Tente novamente em instantes.');return;}
  if(users.size>1000)for(const [id,time] of users)if(now-time>60000)users.delete(id);
  users.set(key,now);busy++;
  try{
   const media=await convert(await fetchMedia(service,input,{token,clientKey}));
   if(!isPin&&media.kind!=='video')throw Error('NO_MEDIA');
   const caption=isPin?'📌 Pinterest':'🎬 '+({youtube:'YouTube',tiktok:'TikTok',instagram:'Instagram'}[command]||command);
   await conn.sendMessage(from,media.kind==='image'?{image:media.bytes,caption}:{video:media.bytes,gifPlayback:Boolean(media.gifPlayback),caption},{quoted:info});
  }catch(e){const errors={TOKEN:'🔑 A Yuta recusou o token. O dono precisa conferir a configuração do /play.',RATE:'⏳ A Yuta atingiu o limite de uso. Tente mais tarde.',TOO_BIG:'📦 O arquivo ultrapassa o limite de 32 MB deste comando.',NOT_FOUND:'❌ A rota ou mídia não foi encontrada pela Yuta.',NO_MEDIA:'❌ A API não retornou mídia compatível. Confira se o link é público e tente novamente.',CONVERT:'❌ Não consegui converter a animação. Confira se o FFmpeg está disponível na hospedagem.'};await reply(errors[e.message]||'❌ Não consegui baixar agora. Confira se o link é público e tente mais tarde.');}
  finally{busy--;}
 };
}
export const handleDownloadCommand=createDownloadHandler();

export const YUTA_CLIENT_KEY = 'lmonly_92848OlfQmCn836B53OSR1mEk7X7n8o63l8';
