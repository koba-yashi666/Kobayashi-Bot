import crypto from 'node:crypto';
import {fetchYutaMedia,validSource} from './yutaDownloads.js';

export function playDescription(video){
 const channel=typeof video.author==='object'?video.author?.name:video.author;
 return `🎵 *${video.title||'Sem título'}*\n🎙️ Canal: ${channel||'Não informado'}\n⏱️ Duração: ${video.timestamp||video.duration?.timestamp||'Não informada'}\n👁️ Visualizações: ${Number.isFinite(video.views)?video.views.toLocaleString('pt-BR'):'Não informadas'}\n📅 Publicado: ${video.ago||video.uploadDate||'Não informado'}\n🔗 ${video.url}\n\n📝 Descrição:\n${String(video.description||'Não disponibilizada pelo YouTube.').slice(0,4000)}`;
}
export async function sendPlayButtons(ctx,video,id,generate){
 const text=playDescription(video)+'\n\nEscolha áudio ou vídeo:';
 const buttons=['audio','video'].map(kind=>({name:'quick_reply',buttonParamsJson:JSON.stringify({display_text:kind==='audio'?'🎧 Áudio':'🎬 Vídeo',id:`${ctx.prefix}play ${kind} ${id}`})}));
 let header={title:'Kobayashi Play',hasMediaAttachment:false};
 try {
  if(video.thumbnail && ctx.prepareWAMessageMedia){
   const url=new URL(video.thumbnail);
   if(url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&['i.ytimg.com','img.youtube.com'].includes(url.hostname)){
    const media=await ctx.prepareWAMessageMedia({image:{url:url.href}},{upload:ctx.conn.waUploadToServer});
    if(media.imageMessage)header={...header,hasMediaAttachment:true,imageMessage:media.imageMessage};
   }
  }
 } catch { /* Falha na thumbnail não impede escolher o formato. */ }
 const msg=generate(ctx.from,{interactiveMessage:{header,body:{text},nativeFlowMessage:{buttons,messageParamsJson:''}}},{userJid:ctx.conn.user.id,quoted:ctx.info});
 await ctx.conn.relayMessage(ctx.from,msg.message,{messageId:msg.key.id,additionalNodes:[{tag:'biz',attrs:{},content:[{tag:'interactive',attrs:{type:'native_flow',v:'1'},content:[{tag:'native_flow',attrs:{v:'9',name:'mixed'}}]}]},...(ctx.from.endsWith('@g.us')?[]:[{tag:'bot',attrs:{biz_bot:'1'}}])]});
}
export function createPlayHandler({search,sendButtons,download=fetchYutaMedia,clock=Date.now}={}){
 const choices=new Map(),cooldowns=new Map();let busy=0;
 return async function handle(ctx){
  const {q,token,reply}=ctx, raw=String(q||'').trim();
  for(const [id,row]of choices)if(clock()-row.at>=300000)choices.delete(id);
  for(const [id,at]of cooldowns)if(clock()-at>=15000)cooldowns.delete(id);
  if(!raw)return reply(`Use ${ctx.prefix}play nome da música ou link do YouTube. Depois escolha Áudio ou Vídeo.`);
  if(!token||token==='COLOQUE_SEU_TOKEN_YUTA_AQUI')return reply('🔑 O dono precisa configurar o token da Yuta com /yutatoken.');
  const click=/^(audio|video) ([a-f0-9]{24})$/.exec(raw);
  if(click){
   const [,kind,id]=click,row=choices.get(id);
   if(!row||row.from!==ctx.from||row.sender!==ctx.sender)return reply('⌛ Escolha expirada ou pertencente a outra pessoa. Faça seu próprio /play.');
   if(row.processing||row.used)return reply('⏳ Esta escolha já está sendo processada ou foi utilizada.');
   const user=ctx.from+'|'+ctx.sender;
   if(busy>=2)return reply('⏳ Já estou preparando dois arquivos. Tente novamente em instantes.');
   if(cooldowns.has(user))return reply('⏳ Aguarde 15 segundos entre downloads.');
   row.processing=true;busy++;cooldowns.set(user,clock());
   try{
    const media=await download(kind==='audio'?'playAudio':'youtube',row.video.url,{token,clientKey:ctx.clientKey});
    if(kind==='audio'&&!['audio','video'].includes(media.kind)||kind==='video'&&media.kind!=='video')throw Error('NO_MEDIA');
    const description=playDescription(row.video),name=String(row.video.title||'Kobayashi Play').replace(/[\\/:*?"<>|]/g,'').slice(0,80);
    if(kind==='video')await ctx.conn.sendMessage(ctx.from,{video:media.bytes,mimetype:'video/mp4',caption:description,fileName:name+'.mp4'},{quoted:ctx.info});
    else {
     await ctx.conn.sendMessage(ctx.from,{text:description},{quoted:ctx.info});
     await ctx.conn.sendMessage(ctx.from,{audio:media.bytes,mimetype:media.kind==='video'?'audio/mp4':'audio/mpeg',fileName:name+(media.kind==='video'?'.m4a':'.mp3')},{quoted:ctx.info});
    }
    row.used=true;
   }catch{return reply('❌ Não consegui preparar esse formato. Confira o serviço Yuta e tente novamente.');}
   finally{busy--;row.processing=false;}
   return;
  }
  if(raw.length>250)return reply('Envie uma busca de até 250 caracteres.');
  if(busy>=2)return reply('⏳ Estou preparando outras solicitações. Tente novamente em instantes.');
  busy++;
  try{
   let input=raw;
   if(/^https?:\/\//i.test(raw)){
    if(!validSource(raw,'youtube'))return reply('Envie um link HTTPS válido do YouTube.');
    const u=new URL(raw),videoId=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.split('/')[2];
    if(!/^[\w-]{11}$/.test(videoId||''))return reply('Não identifiquei o vídeo nesse link.');
    input={videoId};
   }
   let timeout;
   const result=await Promise.race([search(input),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('SEARCH_TIMEOUT')),20000);})]).finally(()=>clearTimeout(timeout));
   const video=typeof input==='object'?result:result?.videos?.[0];
   if(!video?.url||!validSource(video.url,'youtube'))return reply('Não encontrei um vídeo para essa busca.');
   const id=crypto.randomBytes(12).toString('hex');choices.set(id,{video,from:ctx.from,sender:ctx.sender,at:clock()});
   if(choices.size>200)choices.delete(choices.keys().next().value);
   try{await sendButtons(ctx,video,id);}catch{
    await reply(`${playDescription(video)}\n\nBotões indisponíveis. Escolha:\n${ctx.prefix}play audio ${id}\n${ctx.prefix}play video ${id}`);
   }
  }catch{return reply('❌ Não consegui pesquisar no YouTube agora. Tente novamente.');}
  finally{busy--;}
 };
}
export const handlePlay=createPlayHandler({
 search:async input=>{const mod=await import('yt-search');return (mod.default||mod)(input);},
 sendButtons:(ctx,video,id)=>sendPlayButtons(ctx,video,id,ctx.generateWAMessageFromContent)
});
