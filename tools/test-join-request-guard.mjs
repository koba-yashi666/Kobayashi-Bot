import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const old=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'request-test-'));process.chdir(temp);
try {
 const {setAntiFakeEnabled}=await import('../lib/features/moderation/antiFake.js');
 const {processJoinRequests,handleAntiFakeRequest}=await import('../lib/features/moderation/joinRequestGuard.js');
 const {createCaptcha,decideCaptcha}=await import('../lib/features/community/runtime.js');
 const {readCommunity,updateCommunity}=await import('../lib/features/community/store.js');
 const group='g@g.us',br='5511999999999@s.whatsapp.net',foreign='441234567890@s.whatsapp.net',lid='999@lid',unknown='55119998888@lid';
 let pending=[],calls=[],admin=true,status='200',fail=false,sent=0;
 const conn={user:{id:br},signalRepository:{lidMapping:{getPNForLID:async id=>id===lid?foreign:null}},groupMetadata:async()=>({participants:[{id:br,admin:admin?'admin':null}]}),groupRequestParticipantsList:async()=>pending,groupRequestParticipantsUpdate:async(g,jids,action)=>{calls.push({action,jids});if(fail)throw Error('simulated');if(status==='200')pending=pending.filter(p=>!jids.includes(p.jid));return jids.map(jid=>({jid,status}));},sendMessage:async()=>{sent++;}};
 const reset=()=>{pending=[];calls=[];admin=true;status='200';fail=false;};
 setAntiFakeEnabled(group,true);pending=[{jid:br},{jid:foreign},{jid:lid},{jid:unknown}];let r=await processJoinRequests(conn,group);assert.deepEqual(r.approved,[br]);assert.deepEqual(r.rejected,[foreign,lid]);assert.deepEqual(r.unknown,[unknown]);assert.equal(r.remaining,1);assert.equal(calls[0].action,'reject');
 reset();pending=[{jid:unknown},{jid:foreign}];r=await processJoinRequests(conn,group,{limit:1});assert.equal(calls.length,0);assert.equal(r.remaining,2);
 reset();pending=[{jid:unknown,phoneNumber:br}];r=await processJoinRequests(conn,group);assert.deepEqual(r.approved,[unknown]);
 reset();pending=[{jid:foreign}];await handleAntiFakeRequest(conn,{id:group,participant:foreign,action:'created'});assert.equal(calls[0].action,'reject');assert.equal(sent,0);
 reset();pending=[{jid:br}];await handleAntiFakeRequest(conn,{id:group,participant:br,action:'created'});assert.equal(calls.length,0);
 reset();admin=false;pending=[{jid:foreign}];await assert.rejects(()=>processJoinRequests(conn,group),/ADM/);assert.equal(calls.length,0);
 reset();status='403';pending=[{jid:br},{jid:foreign}];r=await processJoinRequests(conn,group);assert.equal(r.approved.length,0);assert.equal(r.rejected.length,0);assert.equal(r.failed.length,2);assert.equal(r.remaining,2);
 reset();fail=true;pending=[{jid:foreign}];r=await processJoinRequests(conn,group);assert.equal(r.failed.length,1);assert.equal(r.remaining,1);
 reset();pending=[{jid:foreign}];await Promise.all([processJoinRequests(conn,group),processJoinRequests(conn,group)]);assert.equal(calls.length,1);
 reset();setAntiFakeEnabled(group,false);pending=[{jid:foreign},{jid:unknown}];r=await processJoinRequests(conn,group);assert.equal(r.approved.length,2);
 reset();updateCommunity(db=>{db.groups[group]={captcha:true};});pending=[{jid:foreign}];await createCaptcha(conn,{id:group,participant:foreign,action:'created'});let ch=Object.values(readCommunity().challenges).find(c=>c.status==='pending');assert(ch);setAntiFakeEnabled(group,true);await decideCaptcha(conn,ch,true);assert.equal(calls.at(-1).action,'reject');assert.equal(readCommunity().challenges[ch.id].status,'rejected');
 reset();pending=[{jid:foreign}];const count=sent;await createCaptcha(conn,{id:group,participant:foreign,action:'created'});assert.equal(calls.at(-1).action,'reject');assert.equal(sent,count);
 console.log('✅ Solicitações: Brasil, estrangeiro, LID real/desconhecido, limites, falhas, concorrência, toggle e captcha.');
}finally{process.chdir(old);fs.rmSync(temp,{recursive:true,force:true});}
