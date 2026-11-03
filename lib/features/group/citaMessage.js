export function unwrapCitaMessage(message={}) {
 for(let i=0;i<8;i++){
  const inner=message.ephemeralMessage?.message||message.viewOnceMessage?.message||message.viewOnceMessageV2?.message||message.viewOnceMessageV2Extension?.message||message.documentWithCaptionMessage?.message;
  if(!inner)break;message=inner;
 }
 return message;
}
export function selectCitaMessage(info,commandText='') {
 const message=unwrapCitaMessage(info?.message);
 const context=Object.values(message).find(node=>node?.contextInfo)?.contextInfo;
 if(context?.quotedMessage)return {message:unwrapCitaMessage(context.quotedMessage),direct:false};
 return {message,direct:true,text:String(commandText||'').trim()};
}
export async function buildCitaPayload(info,text,mentions,download) {
 const source=selectCitaMessage(info,text),m=source.message;
 const safeMentions=[...new Set(mentions)];
 const poll=m.pollCreationMessage||m.pollCreationMessageV2||m.pollCreationMessageV3;
 if(poll){
  const name=String(poll.name||'').trim(),values=(poll.options||[]).map(o=>String(o.optionName||'').trim());
  if(!name||values.length<2||values.length>12||values.some(v=>!v)||new Set(values).size!==values.length)throw Error('Enquete inválida ou indisponível.');
  const count=Number(poll.selectableOptionsCount);
  return {poll:{name,values,selectableCount:Number.isInteger(count)&&count>=1&&count<=values.length?count:values.length},mentions:safeMentions};
 }
 const captions=caption=>source.direct?String(text||'').trim():String(caption||'');
 const media=[['imageMessage','image'],['videoMessage','video'],['stickerMessage','sticker'],['audioMessage','audio'],['documentMessage','document']];
 for(const [key,type] of media){
  if(!m[key])continue;const node=m[key];
  const bytes=await download(node,type);
  if(!Buffer.isBuffer(bytes)||!bytes.length)throw new Error('Mídia não disponível');
  const payload={[type]:bytes,mentions:[...new Set(mentions)]};
  if(['image','video','document'].includes(type))payload.caption=captions(node.caption);
  if(node.mimetype&&type!=='sticker')payload.mimetype=node.mimetype;
  if(type==='video')payload.gifPlayback=!!node.gifPlayback;
  if(type==='audio')payload.ptt=!!node.ptt;
  if(type==='document')payload.fileName=node.fileName||'arquivo';
  return payload;
 }
 const body=source.direct?source.text:String(m.conversation||m.extendedTextMessage?.text||'');
 if(!body.trim()){if(source.direct)return {text:'\u200e',mentions:safeMentions};throw new Error('Conteúdo citado não suportado ou indisponível.');}
 return {text:body,mentions:[...new Set(mentions)]};
}

export async function sendCitaPayload(conn,jid,payload,generateMessage){
 if(!payload.poll)return conn.sendMessage(jid,payload);
 // Anexa as menções à própria enquete, sem depender da ordem dos campos
 // messageContextInfo/pollCreationMessage usada pelo gerador do Baileys.
 const generate=generateMessage||(await import('@whiskeysockets/baileys')).generateWAMessage;
 const message=await generate(jid,payload,{userJid:conn.user.id,upload:conn.waUploadToServer});
 const content=unwrapCitaMessage(message.message);
 const poll=content.pollCreationMessage||content.pollCreationMessageV2||content.pollCreationMessageV3;
 if(!poll)throw Error('Não foi possível gerar a enquete.');
 poll.contextInfo={...poll.contextInfo,mentionedJid:payload.mentions};
 await conn.relayMessage(jid,message.message,{messageId:message.key.id});
 return message;
}
