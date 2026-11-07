import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {EventEmitter} from 'node:events';
const cwd=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'x9-window-'));process.chdir(dir);
try{
 const x=await import('../lib/features/group/x9Audit.js');const group='g@g.us',second='h@g.us';x.setX9Enabled(group,true);x.setX9Enabled(second,true);
 let now=0,jobs=[],sent=[];
 const schedule=(fn,delay)=>{jobs.push({fn,at:now+delay});};
 async function advance(ms){const end=now+ms;while(true){jobs.sort((a,b)=>a.at-b.at);if(!jobs.length||jobs[0].at>end)break;const job=jobs.shift();now=job.at;await job.fn();}now=end;}
 const conn={ev:new EventEmitter(),groupFetchAllParticipating:async()=>({}),sendMessage:async(jid,p)=>sent.push({jid,...p,at:now})};x.installX9Audit(conn,{schedule});
 const e=(target,actor='adm@lid',type='rejected')=>({type,target:target+'@lid',actor,at:100000+now});
 const first=conn.kobayashiX9Notify(group,[e('p1')]);await advance(5000);conn.kobayashiX9Notify(group,[e('p2'),e('p3')]);await advance(9999);assert.equal(sent.length,0);
 await advance(1);await first;assert.equal(sent.length,1);assert.equal(sent[0].at,15000);assert.equal(sent[0].text,'❌ ADM @adm recusou 3 solicitações de @p1, @p2, @p3.');assert.deepEqual(sent[0].mentions,['adm@lid','p1@lid','p2@lid','p3@lid']);
 const five=conn.kobayashiX9Notify(group,[e('p4'),e('p5'),e('p6'),e('p7'),e('p8'),e('p8')]);conn.kobayashiX9Notify(group,[e('another','otheradm@lid')]);conn.kobayashiX9Notify(second,[e('second')]);conn.kobayashiX9Notify(group,[e('accepted','adm@lid','approved')]);
 await advance(1000);assert.equal(sent.at(-1).text,'✅ ADM @adm aceitou 1 membro.');await advance(14000);await five;
 assert(sent.some(p=>p.text==='❌ ADM @adm recusou 5 solicitações de @p4, @p5, @p6, @p7, @p8.'));assert(sent.some(p=>p.text==='❌ ADM @otheradm recusou a solicitação de @another.'));assert(sent.some(p=>p.jid===second&&p.text.includes('@second')));
 const count=sent.length,pending=conn.kobayashiX9Notify(group,[e('silent')]);x.setX9Enabled(group,false);await advance(15000);await pending;assert.equal(sent.length,count);
 console.log('✅ X9: janela fixa de 15s, 1/3/5 recusas, deduplicação, separação por ADM e grupo, aceitações preservadas e OFF antes do envio.');
}finally{process.chdir(cwd);fs.rmSync(dir,{recursive:true,force:true});}
