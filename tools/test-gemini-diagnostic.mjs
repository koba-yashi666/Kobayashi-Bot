import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {diagnoseGemini} from '../lib/features/ai/geminiDiagnostic.js';
import {createGeminiChat} from '../lib/features/ai/geminiChat.js';
const secret='secret-for-test',env={GEMINI_API_KEY:secret};
let calls=0;
const request=(status,message='',success=false)=>async(url,opts)=>{calls++;assert(!url.includes(secret));assert.equal(opts.headers['x-goog-api-key'],secret);return {status,ok:status===200,json:async()=>success?{candidates:[{content:{parts:[{text:'OK'}]}}]}:{error:{message}}};};
for(const [status,message,needle] of [[400,'API key not valid '+secret,'inválida'],[403,'blocked '+secret,'Acesso negado'],[404,secret,'não encontrado'],[429,secret,'Cota'],[503,secret,'falha']]){
 const text=await diagnoseGemini({readKey:()=>secret,env,fetchImpl:request(status,message)});assert(text.includes(String(status)));assert(text.includes(needle));assert(!text.includes(secret));
}
assert((await diagnoseGemini({readKey:()=>secret,env,fetchImpl:request(200,'',true)})).includes('funcionando'));
assert((await diagnoseGemini({readKey:()=>{throw Error(secret);},env,fetchImpl:request(200)})).includes('JSON válido'));
assert((await diagnoseGemini({readKey:()=>'',env:{},fetchImpl:request(200)})).includes('Chave ausente'));
assert((await diagnoseGemini({readKey:()=>secret,env,fetchImpl:async()=>{throw Error(secret);}})).includes('falha de rede'));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-diag-'));
try{
 let now=1800000000000,admin=false,replies=[];
 const database=path.join(dir,'db.json'),keyFile=path.join(dir,'key.json');
 const settings={database,keyFile,env,clock:()=>now,fetchImpl:request(403,secret)};
 const bot=createGeminiChat(settings),ctx={command:'ia',args:'teste',from:'g@g.us',sender:'u@lid',isGroup:true,reply:async text=>replies.push(text),confirmAdmin:async()=>admin};
 const before=calls;await bot.handle(ctx);assert.equal(calls,before);admin=true;await bot.handle(ctx);assert.equal(calls,before+1);assert(!bot.status(ctx.from));assert(replies.at(-1).includes('HTTP 403'));
 await bot.handle(ctx);assert.equal(calls,before+1);
 for(let i=0;i<4;i++){now+=61000;await bot.handle(ctx);}assert.equal(calls,before+5);
 now+=61000;await createGeminiChat(settings).handle(ctx);assert.equal(calls,before+5);assert(replies.at(-1).includes('diário'));
 assert(!replies.join('\n').includes(secret));assert.equal(JSON.parse(fs.readFileSync(database)).usage.tests,5);
 console.log('✅ Diagnóstico: erros sem segredo, sucesso, rede, JSON, ADM obrigatório, teste com IA OFF, intervalo e cota persistente.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
