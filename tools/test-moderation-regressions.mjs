import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),temp=fs.mkdtempSync(path.join(os.tmpdir(),'koba-moderation-regression-'));
try{
 fs.cpSync(path.join(root,'lib'),path.join(temp,'lib'),{recursive:true});fs.mkdirSync(path.join(temp,'tools'));fs.mkdirSync(path.join(temp,'settings'));
 fs.writeFileSync(path.join(temp,'package.json'),' {"type":"module"}');fs.writeFileSync(path.join(temp,'settings/settings.json'),JSON.stringify({ownerNumber:'5515997075304'}));fs.copyFileSync(path.join(root,'index.js'),path.join(temp,'index.js'));
 for(const file of ['test-blacklist-scope.mjs','test-blacklist-autoban.mjs','test-blacklist-throttle.mjs','test-mute-system.mjs','test-banfake.mjs']){
  fs.copyFileSync(path.join(root,'tools',file),path.join(temp,'tools',file));execFileSync(process.execPath,[path.join(temp,'tools',file)],{cwd:temp,stdio:'inherit'});
 }
 console.log('Regressões de moderação executadas com configuração fictícia isolada; nenhuma chave ou banco real acessado.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
