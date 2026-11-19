import {billingStore,canonical} from './storage.js';
const TTL=10*60000;
export function resolveBillingInput({jid,text,quotedId,fromMe=false,isGroup=false,store=billingStore,clock=Date.now}){
 if(fromMe||isGroup||!/^\d{1,2}$/.test(String(text||'').trim()))return null;
 const menu=store.read().numericMenus?.[canonical(jid)];
 if(!menu||clock()-menu.at>TTL||clock()<menu.at||quotedId&&quotedId!==menu.messageId)return null;
 const n=Number(text);if(menu.quantityCommand)return n>=1&&n<=50?menu.quantityCommand+' '+n:null;
 return menu.options[n-1]?.[1]||null;
}
export async function billingOptions({conn,jid,info,text,options=[],generate,copy,quantityCommand,store=billingStore,clock=Date.now}){
 const fallback=text+(options.length?'\n\n'+options.map(([title],i)=>`${i+1} • ${title}`).join('\n')+'\n\nToque em uma opção ou responda com o número. Vale para o último menu, por 10 minutos.':'');
 const delivered=await conn.sendMessage(jid,{text:fallback},info?{quoted:info}:undefined);
 store.update(d=>{d.numericMenus ||= {};for(const [key,m]of Object.entries(d.numericMenus))if(clock()-m.at>TTL)delete d.numericMenus[key];d.numericMenus[canonical(jid)]={at:clock(),options,messageId:delivered?.key?.id,quantityCommand};});
 if((options.length||copy)&&generate){try{
  const buttons=options.length<=3?options.map(([title,id])=>({name:'quick_reply',buttonParamsJson:JSON.stringify({display_text:title,id})})):[{name:'single_select',buttonParamsJson:JSON.stringify({title:'Escolher',sections:[{title:'Opções',rows:options.map(([title,id])=>({title,id}))}]})}];
  if(copy)buttons.unshift({name:'cta_copy',buttonParamsJson:JSON.stringify({display_text:'📋 Copiar Pix',copy_code:copy})});
  const message=generate(jid,{viewOnceMessage:{message:{messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},interactiveMessage:{header:{title:'Kobayashi • Aluguel',hasMediaAttachment:false},body:{text},footer:{text:'Kobayashi Bot'},nativeFlowMessage:{buttons,messageParamsJson:'{}'}}}}},{userJid:conn.user.id,quoted:info});
  await conn.relayMessage(jid,message.message,{messageId:message.key.id,additionalNodes:[{tag:'biz',attrs:{},content:[{tag:'interactive',attrs:{type:'native_flow',v:'1'},content:[{tag:'native_flow',attrs:{v:'9',name:'mixed'}}]}]}]});
 }catch{}}
 return delivered;
}
