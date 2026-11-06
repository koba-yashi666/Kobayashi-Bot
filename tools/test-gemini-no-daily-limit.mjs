import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {createGeminiChat} from '../lib/features/ai/geminiChat.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-unlimited-'));
try{
 let now=1800000000000,calls=0,replies=[];
 const database=path.join(dir,'db.json'),keyFile=path.join(dir,'key.json'),group='g@g.us',user='u@lid';
 const settings={database,keyFile,env:{GEMINI_API_KEY:'test-only'},clock:()=>now,fetchImpl:async()=>{calls++;return {ok:true,status:200,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:'Oi!'}]}}]})};}};
 const chat=createGeminiChat(settings);chat.configure(group,true);
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
 const d=JSON.parse(fs.readFileSync(database));d.usage={day,total:500,tests:50,groups:{[group]:{count:500,last:0}},users:{[group+'|'+user]:500}};fs.writeFileSync(database,JSON.stringify(d));
 const ctx={from:group,sender:user,isGroup:true,text:'Koba oi',reply:async text=>replies.push(text),confirmAdmin:async()=>true};
 for(let i=0;i<120;i++){await chat.handle(ctx);now+=16000;}
 assert.equal(calls,120);assert.equal(replies.length,120);assert(replies.every(r=>r==='Oi!'));
 // Reiniciar não volta a bloquear pelas estatísticas antigas.
 const restarted=createGeminiChat(settings);await restarted.handle(ctx);assert.equal(calls,121);
 await restarted.handle(ctx);assert.equal(calls,121); // Intervalo de 15s preservado.
 now+=61000;await restarted.handle({...ctx,command:'ia',args:'teste'});assert.equal(calls,122); // Também passa de 5 testes antigos.
 assert(replies.at(-1).includes('funcionando'));
 console.log('✅ Sem cotas diárias de pessoa/grupo/bot/testes, contadores antigos não bloqueiam, 120 chamadas no mesmo dia e intervalo preservado após reinício.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
