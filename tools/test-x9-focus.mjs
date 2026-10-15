import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {EventEmitter} from 'node:events';
const old=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'x9-focus-'));process.chdir(dir);
try{
 const x=await import('../lib/features/group/x9Audit.js');const group='g@g.us';x.setX9Enabled(group,true);
 const e=(action)=>({id:group,participants:[{id:'user@lid',phoneNumber:'5511000000000@s.whatsapp.net'}],author:'adm@lid',action});
 assert.deepEqual(x.recordX9Participants(e('add'),1000),[]);
 assert.deepEqual(x.recordX9Participants(e('remove'),2000),[]);
 const returned=x.recordX9Participants(e('add'),3000);assert.equal(returned[0].type,'returned');assert.equal(returned[0].count,2);
 assert.equal(x.recordX9Participants(e('add'),3001).length,0);
 assert.equal(x.recordX9Participants(e('promote'),4000)[0].actor,'adm@lid');
 assert.equal(x.recordX9Participants(e('demote'),5000)[0].type,'demoted');
 x.recordX9Request({id:group,participant:'new@lid',action:'created'},6000);
 const approved=x.recordX9Participants({id:group,participants:['new@lid'],author:'adm@lid',action:'add'},7000);assert.deepEqual(approved.map(x=>x.type),['approved']);
 x.recordX9Request({id:group,participant:'other@lid',author:'adm@lid',action:'rejected'},8000);
 const file=path.join(dir,'files/database/x9-audit.json');const db=JSON.parse(fs.readFileSync(file));for(const type of ['joined','left','removed','exit_unknown'])db.groups[group].events.push({type,target:'old@lid',at:8000});fs.writeFileSync(file,JSON.stringify(db));
 const list=x.getX9Events(group,'todos',100,9000);assert.equal(list.length,5);assert(!list.some(e=>['joined','left','removed','exit_unknown'].includes(e.type)));
 assert.equal(x.getX9Events(group,'entradas',100,9000).length,1);assert.equal(x.formatX9Entry({type:'left'}),'');
 const sent=[];const conn={ev:new EventEmitter(),groupFetchAllParticipating:async()=>({}),sendMessage:async(j,p)=>sent.push(p)};x.installX9Audit(conn);
 await conn.kobayashiX9Notify(group,[{type:'left',target:'old@lid',at:8000}]);assert.equal(sent.length,0);
 await conn.kobayashiX9Notify(group,returned);assert.equal(sent.length,1);assert(sent[0].text.includes('2ª entrada'));assert(!sent[0].text.includes('Por:'));
 const notices=[];
 for(let i=0;i<6;i++){x.recordX9Request({id:group,participant:`batch${i}@lid`,participantPn:`551199999000${i}@s.whatsapp.net`,action:'created'});const rows=x.recordX9Participants({id:group,participants:[{id:`batch${i}@lid`,phoneNumber:`551199999000${i}@s.whatsapp.net`}],author:'bot@lid',action:'add'});notices.push(conn.kobayashiX9Notify(group,rows));x.recordX9Decision(group,[`551199999000${i}@s.whatsapp.net`],'realadm@lid','approve');}
 await Promise.all(notices);assert.equal(sent.at(-1).text,'✅ ADM @realadm aceitou 6 membros.');assert.deepEqual(sent.at(-1).mentions,['realadm@lid']);assert(!sent.at(-1).text.includes('batch'));
 const summary=x.summarizeX9Entries([{type:'rejected',target:'a@lid',actor:'adm@lid'},{type:'rejected',target:'b@lid',actor:'adm@lid'}]);assert.equal(summary.text,'❌ ADM @adm recusou 2 membros.');
 console.log('✅ X9: primeira entrada e saída silenciosas; reentrada, ações ADM e filtragem de histórico/avisos antigos passaram.');
}finally{process.chdir(old);fs.rmSync(dir,{recursive:true,force:true});}
