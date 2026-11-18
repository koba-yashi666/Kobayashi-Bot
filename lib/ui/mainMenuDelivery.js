import fs from 'node:fs';

export function menuMentionJid(rawSender,sender){
 return String(rawSender||sender||'').replace(/:\d+(?=@)/,'');
}
export async function sendCleanMainMenu({conn,from,info,text,mention,imagePath,buttons,generate,prepare,prefix='/'}){
 const mentions=mention?[mention]:[];
 const image=fs.existsSync(imagePath)?fs.readFileSync(imagePath):null;
 if(buttons){
  try{
   let header={title:'Kobayashi Bot',hasMediaAttachment:false};
   if(image){const media=await prepare({image},{upload:conn.waUploadToServer});header={...header,hasMediaAttachment:true,imageMessage:media.imageMessage};}
   const nativeButtons=[{name:'single_select',buttonParamsJson:JSON.stringify({title:'📂 Categorias',sections:[{title:'Menus',rows:[['🌸 Geral','menugeral'],['🛡️ Administração','menuadm'],['🎴 Figurinhas','menusticker'],['⭐ Níveis','menulevel'],['🐲 Social','menusocial'],['🛍️ Loja','menuloja'],['🎮 Brincadeiras','menubn'],['🕹️ Mini-jogos','mini-jogos'],['🎬 Downloads','menubaixar'],['🐉 RPG','dragonrpg'],['👑 Dono','menudono'],['💎 VIP','menuvip']].map(([title,command])=>({title,id:prefix+command}))}]})}];
   const msg=generate(from,{interactiveMessage:{header,body:{text},contextInfo:{mentionedJid:mentions},nativeFlowMessage:{buttons:nativeButtons,messageParamsJson:''}}},{userJid:conn.user.id,quoted:info});
   return await conn.relayMessage(from,msg.message,{messageId:msg.key.id,additionalNodes:[{tag:'biz',attrs:{},content:[{tag:'interactive',attrs:{type:'native_flow',v:'1'},content:[{tag:'native_flow',attrs:{v:'9',name:'mixed'}}]}]},...(from.endsWith('@g.us')?[]:[{tag:'bot',attrs:{biz_bot:'1'}}])]});
  }catch{ /* Alternativa convencional somente se o envio falhar. */ }
 }
 if(image){try{return await conn.sendMessage(from,{image,caption:text,mentions},{quoted:info});}catch{}}
 return conn.sendMessage(from,{text,mentions},{quoted:info});
}
