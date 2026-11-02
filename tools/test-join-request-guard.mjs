import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {EventEmitter} from 'node:events';
const old=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'requests-legacy-'));process.chdir(temp);
try{
 const {setAntiFakeEnabled}=await import('../lib/features/moderation/antiFake.js');
 const {processJoinRequests}=await import('../lib/features/moderation/joinRequestGuard.js');
 const {handleAntiFakeJoin,installAntiFakeRuntime}=await import('../lib/features/moderation/antiFakeRuntime.js');
 const group='test@g.us',bot='5511888888888@s.whatsapp.net',br='5511999999999@s.whatsapp.net',foreign='441234567890@s.whatsapp.net',unknown='551122334455@lid';
 let pending=[],members=[{id:bot,admin:'admin'}],calls=[],removed=[],status='200';
 const conn={user:{id:bot},ev:new EventEmitter(),groupMetadata:async()=>({participants:members}),groupRequestParticipantsList:async()=>pending,groupRequestParticipantsUpdate:async(g,jids,action)=>{calls.push({action,jids});if(status==='200'){pending=pending.filter(p=>!jids.includes(p.jid));if(action==='approve')members.push(...jids.map(id=>({id})));}return jids.map(jid=>({jid,status}));},groupParticipantsUpdate:async(g,jids,action)=>{assert.equal(action,'remove');removed.push(...jids);members=members.filter(p=>!jids.includes(p.id));return jids.map(jid=>({jid,status:'200'}));},sendMessage:async()=>{}};
 setAntiFakeEnabled(group,true);pending=[{jid:br},{jid:foreign},{jid:unknown}];let r=await processJoinRequests(conn,group);assert.deepEqual(r.approved,[br,foreign,unknown]);assert.equal(r.unknown.length,0);assert.equal(r.rejected.length,0);assert.equal(pending.length,0);assert(calls.every(c=>c.action==='approve'));assert.equal(removed.length,0);
 const joined=await handleAntiFakeJoin(conn,{id:group,action:'add',participants:r.approved});assert(removed.includes(foreign));assert(!removed.includes(br));assert(!removed.includes(unknown));assert(joined.some(x=>x.status==='unknown-phone'));
 installAntiFakeRuntime(conn);assert.equal(conn.ev.listenerCount('group.join-request'),0);assert.equal(conn.ev.listenerCount('group-participants.update'),1);
 pending=[{jid:br},{jid:foreign}];calls=[];r=await processJoinRequests(conn,group,{limit:1});assert.equal(r.approved.length,1);assert.equal(r.remaining,1);
 calls=[];await Promise.all([processJoinRequests(conn,group),processJoinRequests(conn,group)]);assert.equal(calls.length,1);
 pending=[{jid:foreign}];r=await processJoinRequests(conn,group,{action:'reject'});assert.equal(calls.at(-1).action,'reject');assert.equal(r.rejected.length,1);
 status='403';pending=[{jid:br}];r=await processJoinRequests(conn,group);assert.equal(r.approved.length,0);assert.equal(r.failed.length,1);assert.equal(r.remaining,1);
 setAntiFakeEnabled(group,false);members.push({id:foreign});removed=[];await handleAntiFakeJoin(conn,{id:group,action:'add',participants:[foreign]});assert.equal(removed.length,0);
 console.log('✅ Fluxo antigo: aprova BR/estrangeiro/LID, sem recusa automática; antifake remove apenas após entrar; limites, concorrência, falhas e OFF.');
}finally{process.chdir(old);fs.rmSync(temp,{recursive:true,force:true});}
