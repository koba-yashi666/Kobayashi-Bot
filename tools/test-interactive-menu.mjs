import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MENU_CATEGORIES, buildMenuButtons, sendInteractiveMenu } from '../lib/ui/interactiveMenu.js';
const source=fs.readFileSync('index.js','utf8');
const extraction=source.slice(source.indexOf('function extractCommandText('),source.indexOf('\n\n\nfunction resolveBanTarget'));
const extract=new Function(`${extraction}; return extractCommandText;`)();
for(const prefix of ['/','+','!']){
 const buttons=buildMenuButtons(prefix),rows=JSON.parse(buttons[0].buttonParamsJson).sections[0].rows;
 assert.equal(rows.length,MENU_CATEGORIES.length);
 for(const row of rows){
  assert.ok(source.includes(`case "${row.id.slice(prefix.length)}":`));
  const response={interactiveResponseMessage:{nativeFlowResponseMessage:{paramsJson:JSON.stringify({id:row.id})}}};
  assert.equal(extract(response),row.id);
  for(const wrapper of ['ephemeralMessage','viewOnceMessage','viewOnceMessageV2']) assert.equal(extract({[wrapper]:{message:response}}),row.id);
 }
 assert.equal(JSON.parse(buttons[1].buttonParamsJson).id,`${prefix}menu id`);
}
assert.equal(extract({listResponseMessage:{singleSelectReply:{selectedRowId:'/menubn'}}}),'/menubn');
assert.equal(extract({buttonsResponseMessage:{selectedButtonId:'/menu id'}}),'/menu id');
assert.equal(extract({conversation:'/menu texto',interactiveResponseMessage:{nativeFlowResponseMessage:{paramsJson:'bad'}}}),'/menu texto');
let sent,relayed,fallback;
const options={conn:{user:{id:'bot@s.whatsapp.net'},relayMessage:async(...a)=>{relayed=a;},sendMessage:async(...a)=>{fallback=a;}},jid:'group@g.us',quoted:{key:{id:'q'}},sender:'user@lid',botName:'Kobayashi',prefix:'/',version:'5.4.12',imagePath:'settings/LOGOS/menu.png',fallback:'MENU TEXTO'};
const api={prepareWAMessageMedia:async()=>({imageMessage:{url:'test'}}),generateWAMessageFromContent:(jid,content,opts)=>{sent={jid,content,opts};return {key:{id:'test'},message:content};}};
assert.equal((await sendInteractiveMenu(options,api)).interactive,true);
assert.equal(sent.content.interactiveMessage.header.hasMediaAttachment,false);
assert.ok(fallback[1].image);
assert.equal(fallback[1].caption,'MENU TEXTO');
assert.equal(relayed[2].additionalNodes[0].tag,'biz');
assert.equal(relayed[2].messageId,'test');
assert.equal(sent.opts.quoted,options.quoted);
assert.deepEqual(sent.content.interactiveMessage.contextInfo.mentionedJid,['user@lid']);
assert.ok(fallback);
options.imagePath='/nonexistent/menu.png';await sendInteractiveMenu(options,api);
assert.equal(sent.content.interactiveMessage.header.hasMediaAttachment,false);
options.conn.relayMessage=async()=>{throw new Error('simulated send error');};
assert.equal((await sendInteractiveMenu(options,api)).interactive,false);
assert.equal(fallback[1].text,'MENU TEXTO');assert.equal(fallback[2].quoted,options.quoted);
console.log('✅ Lista, destinos, prefixos, respostas, envelopes, imagem e fallback validados.');
