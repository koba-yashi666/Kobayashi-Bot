import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-direct-ui-')),cwd=process.cwd(),originalFetch=globalThis.fetch;process.chdir(dir);
try{
 const {handleBillingCommand}=await import('../lib/features/billing/commands.js');
 const {resolveBillingInput}=await import('../lib/features/billing/ui.js');
 const {asaasConfigStore:config,billingStore:store}=await import('../lib/features/billing/storage.js');
 const {asaasBinding}=await import('../lib/features/billing/asaas.js');
 const creator='5515997075304@s.whatsapp.net',other='5511999999999@s.whatsapp.net';let posts=0,gets=0,active=true,ref;
 config.write({token:'OFFLINE-FAKE-KEY',environment:'production',mode:'pilot'});config.update(c=>c.verifiedBinding=asaasBinding(c));
 globalThis.fetch=async(url,opts)=>{gets++;const u=new URL(url);assert.equal(u.hostname,'api.asaas.com');
  if(u.pathname==='/v3/pix/addressKeys')return new Response(JSON.stringify({data:active?[{key:'own-account-key',status:'ACTIVE',type:'EVP'},{key:'inactive-key',status:'ERROR'}]:[]}));
  if(u.pathname==='/v3/pix/qrCodes/static'){posts++;const b=JSON.parse(opts.body);assert.equal(b.value,150);assert.equal(b.allowsMultiplePayments,false);ref=b.externalReference;return new Response(JSON.stringify({id:'qr_ui_123456789',externalReference:ref,allowsMultiplePayments:false,payload:'000201br.gov.bcb.pix'+'0'.repeat(70),encodedImage:'iVBORw0KGgoAAAAA'}));}
  throw Error('unexpected request');
 };
 const messages=[],replies=[],relays=[];let seq=0;
 const base={from:creator,sender:creator,identities:[creator],isGroup:false,prefix:'/',info:{key:{id:'incoming'}},reply:async text=>replies.push(text),conn:{user:{id:'bot@s.whatsapp.net'},sendMessage:async(jid,data)=>{messages.push(data);return {key:{id:'m'+(++seq)}}},relayMessage:async(jid,msg)=>relays.push(msg)},generate:(jid,message)=>({message,key:{id:'i'+seq}})};
 const run=(command,q='',extra={})=>handleBillingCommand({...base,command,q,...extra});
 const number=async n=>{const full=resolveBillingInput({jid:creator,text:String(n)});assert(full);const [cmd,...args]=full.split(' ');await run(cmd.slice(1),args.join(' '));};
 await run('asaaspix','ativar',{sender:other,identities:[other]});assert.equal(gets,0);await run('asaaspix','ativar',{isGroup:true});assert.equal(gets,0);
 active=false;await run('asaaspix','ativar');assert(!config.read().directPixBinding);active=true;await run('asaaspix','ativar');assert.equal(config.read().directPixBinding,asaasBinding(config.read()));assert(!JSON.stringify(replies).includes('own-account-key'));
 await run('asaasstatus');assert.match(replies.at(-1),/Pix na conversa: ativado/);
 await run('alugar');await number(2);await number(4);assert.match(messages.at(-1).text,/Responda apenas com a quantidade/);await number(6);assert.match(messages.at(-1).text,/150,00/);assert.equal(posts,0);await number(1);assert.equal(posts,1);assert.equal(store.read().orders[ref].automaticActivation,true);
 const image=messages.findIndex(m=>m.image);assert(image>=0);assert.match(messages[image].caption,/150,00/);assert.equal(messages[image+1].text,store.read().orders[ref].qr);assert(!JSON.stringify(messages.slice(image)).includes('checkoutSession'));
 const buttons=relays.at(-1).viewOnceMessage.message.interactiveMessage.nativeFlowMessage.buttons;assert.equal(buttons[0].name,'cta_copy');assert.equal(JSON.parse(buttons[0].buttonParamsJson).copy_code,messages[image+1].text);
 await run('asaasteste','suite');assert.match(replies.at(-1),/38/);assert.equal(posts,1);
 const index=fs.readFileSync(path.join(cwd,'index.js'),'utf8');assert(index.indexOf('const billingInput=resolveBillingInput')<index.indexOf('const isCmd ='));assert(index.includes('if(billingInput)body=billingInput;'));
 console.log('Comandos Pix: criador/PV, chave ativa da própria conta sem eco, planos por número, seis grupos, confirmação explícita R$150, QR→payload→copiar, suite sem API real e parser/anti-PV OK.');
}finally{globalThis.fetch=originalFetch;process.chdir(cwd);fs.rmSync(dir,{recursive:true,force:true})}
