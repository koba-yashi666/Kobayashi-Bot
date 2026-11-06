import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {createGeminiSettings} from '../lib/features/ai/geminiSettings.js';
import {listGeminiModels,diagnoseGemini} from '../lib/features/ai/geminiDiagnostic.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-models-'));
try{
 const file=path.join(dir,'gemini.json'),read=createGeminiSettings(file);
 fs.writeFileSync(file,JSON.stringify({apiKey:'test-secret',model:'gemini-test-flash-lite'}));
 assert.equal(read.model({}),'gemini-test-flash-lite');assert.equal(read.model({GEMINI_MODEL:'gemini-env'}),'gemini-env');
 const result=await listGeminiModels({readKey:read,env:{},fetchImpl:async(url,opts)=>{assert(url.endsWith('models?pageSize=1000'));assert.equal(opts.method,'GET');assert.equal(opts.headers['x-goog-api-key'],'test-secret');return {ok:true,json:async()=>({models:[{name:'models/gemini-test-flash-lite',supportedGenerationMethods:['generateContent']},{name:'models/gemini-image',supportedGenerationMethods:['generateContent']},{name:'models/gemini-embedding',supportedGenerationMethods:['embedContent']},{name:'models/bad\nname',supportedGenerationMethods:['generateContent']}]})};}});
 assert(result.includes('gemini-test-flash-lite'));assert(!result.includes('gemini-image'));assert(!result.includes('gemini-embedding'));assert(!result.includes('test-secret'));assert.equal(JSON.parse(fs.readFileSync(file)).model,'gemini-test-flash-lite');
 await diagnoseGemini({readKey:read,env:{},fetchImpl:async url=>{assert(url.endsWith('gemini-test-flash-lite:generateContent'));return {ok:false,status:404,json:async()=>({})};}});
 console.log('✅ Modelo pelo arquivo, prioridade de variável, consulta GET, filtro de conversa, sem troca automática nem exposição da chave.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
