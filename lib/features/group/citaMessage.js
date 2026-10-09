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
 if(!body.trim())throw new Error('Envie um texto com /cita ou responda a uma mensagem de texto ou mídia.');
 return {text:body,mentions:[...new Set(mentions)]};
}
