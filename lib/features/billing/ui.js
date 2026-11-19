export async function billingOptions({conn,jid,info,text,options,generate}){
 // O aceite do relay não garante que o cliente exibirá a mensagem interativa.
 // A resposta convencional é enviada primeiro e sempre permite continuar por comando.
 const delivered=await conn.sendMessage(jid,{text:text+(options.length?'\n\n'+options.map(([title,id])=>`${title}: ${id}`).join('\n'):'')},info?{quoted:info}:undefined);
 if(options.length&&generate){try{
  const buttons=options.length<=3?options.map(([title,id])=>({name:'quick_reply',buttonParamsJson:JSON.stringify({display_text:title,id})})):[{name:'single_select',buttonParamsJson:JSON.stringify({title:'Escolher',sections:[{title:'Opções',rows:options.map(([title,id])=>({title,id}))}]})}];
  const message=generate(jid,{interactiveMessage:{header:{title:'Kobayashi • Aluguel',hasMediaAttachment:false},body:{text},nativeFlowMessage:{buttons,messageParamsJson:''}}},{userJid:conn.user.id,quoted:info});
  return await conn.relayMessage(jid,message.message,{messageId:message.key.id,additionalNodes:[{tag:'biz',attrs:{},content:[{tag:'interactive',attrs:{type:'native_flow',v:'1'},content:[{tag:'native_flow',attrs:{v:'9',name:'mixed'}}]}]},...(jid.endsWith('@g.us')?[]:[{tag:'bot',attrs:{biz_bot:'1'}}])]});
 }catch{}}
 return delivered;
}
