import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {createGeminiChat,kobaQuestion} from '../lib/features/ai/geminiChat.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-gemini-'));
try{
 assert.equal(kobaQuestion('Koba, como você está?'),'como você está?');assert.equal(kobaQuestion('koba tudo bem'),'tudo bem');assert.equal(kobaQuestion('falei com a koba'),null);assert.equal(kobaQuestion('kobayashi oi'),null);
 let now=1800000000000,calls=[],messages=[],admin=true;
 const env={GEMINI_API_KEY:'test-key'},database=path.join(dir,'state.json');
 const api=async(url,opts)=>{calls.push({url,opts,body:JSON.parse(opts.body)});return {ok:true,status:200,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:'Tudo certo, café na mão. ☕'}]}}]})};};
 const chat=createGeminiChat({database,fetchImpl:api,env,clock:()=>now});
 const base={conn:{},from:'g@g.us',sender:'u@lid',isGroup:true,reply:async m=>messages.push(m),confirmAdmin:async()=>admin};
 const run=extra=>chat.handle({...base,text:'Koba, como você está?',...extra});
 assert.equal(await run(),false);assert.equal(calls.length,0);
 admin=false;await run({command:'ia',args:'on'});assert(!chat.status(base.from));admin=true;
 await run({command:'ia',args:'on'});assert(chat.status(base.from));
 assert(createGeminiChat({database,env}).status(base.from));
 await run({fromMe:true});assert.equal(calls.length,0);
 await run();assert.equal(calls.length,1);assert.equal(calls[0].opts.headers['x-goog-api-key'],'test-key');assert(!calls[0].url.includes('test-key'));assert.equal(calls[0].body.contents.length,1);
 await run();assert.equal(calls.length,1);now+=16000;await run();assert.equal(calls[1].body.contents.length,3);
 now+=16000;await run({sender:'other@lid'});assert.equal(calls[2].body.contents.length,1);
 await run({command:'ia',args:'off'});now+=16000;assert.equal(await run(),false);
 await run({command:'ia',args:'on'});await run();assert.equal(calls.at(-1).body.contents.length,1);
 for(let i=0;i<15;i++){now+=16000;await run();}assert.equal(calls.filter(c=>c.body.contents.at(-1).parts[0].text==='como você está?').length,11); // 10 do usuário original + 1 de outro.
 assert(!fs.readFileSync(database,'utf8').includes('test-key'));assert(!fs.readFileSync(database,'utf8').includes('como você está'));
 const limited=createGeminiChat({database:path.join(dir,'quota.json'),env,clock:()=>now,fetchImpl:async()=>({status:429,ok:false})});limited.configure(base.from,true);await limited.handle({...base,text:'Koba oi'});assert(messages.at(-1).includes('limite'));const before=messages.length;await limited.handle({...base,text:'Koba oi'});assert.equal(messages.length,before);
 let finish;const waiting=createGeminiChat({database:path.join(dir,'off.json'),env,fetchImpl:async()=>new Promise(resolve=>{finish=resolve;})});waiting.configure(base.from,true);const pending=waiting.handle({...base,text:'Koba oi'});await new Promise(resolve=>setImmediate(resolve));waiting.configure(base.from,false);const count=messages.length;finish({ok:true,status:200,json:async()=>({candidates:[{content:{parts:[{text:'Resposta atrasada'}]},finishReason:'STOP'}]})});await pending;assert.equal(messages.length,count);
 console.log('✅ Gemini: ativação ADM, OFF padrão/persistente, gatilho, memória isolada, cotas, 429, chave fora do banco e cancelamento por OFF.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
