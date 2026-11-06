import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {createGeminiSettings} from '../lib/features/ai/geminiSettings.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-key-'));
try{
 const file=path.join(dir,'settings/gemini.json'),read=createGeminiSettings(file);
 assert.equal(read({}),'');assert.equal(fs.statSync(file).mode&0o777,0o600);
 fs.writeFileSync(file,JSON.stringify({apiKey:'file-test-key'}));
 const reloaded=createGeminiSettings(file);assert.equal(reloaded({}),'file-test-key');assert.equal(reloaded({GEMINI_API_KEY:'env-test-key'}),'env-test-key');assert.equal(JSON.parse(fs.readFileSync(file)).apiKey,'file-test-key');
 fs.writeFileSync(file,'invalid');assert.throws(()=>read({}));assert.equal(fs.readFileSync(file,'utf8'),'invalid');
 console.log('✅ Arquivo criado restrito, chave preservada, prioridade da variável e erro sem sobrescrever.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
