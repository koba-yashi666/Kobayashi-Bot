import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const old=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'partnerships-'));process.chdir(temp);
try{
 const {inviteCode,configurePartnership,tickPartnerships,sendInviteLink}=await import('../lib/features/group/partnershipLinks.js');
 const group='g@g.us',owner='5511000000000@s.whatsapp.net',bot='5522000000000@s.whatsapp.net',link='https://chat.whatsapp.com/ABCDEFGHIJKLMNOPQRSTUV';
 let metaCalls=0,outputs=[],relayed,sent=[],allow=true;
 const conn={user:{id:bot},groupMetadata:async()=>({id:group,subject:'Destino',participants:[{id:owner,admin:allow?'admin':null},{id:bot,admin:'admin'},{id:'member@lid'}]}),groupGetInviteInfo:async()=>{metaCalls++;return {id:'partner@g.us',subject:'Parceiro'};},profilePictureUrl:async()=>{throw Error('private')},relayMessage:async(...a)=>{relayed=a}};
 const now=Date.parse('2026-11-02T22:00:00Z');const ctx={conn,from:group,sender:owner,isGroup:true,reply:async t=>outputs.push(t),q:`on ${link} 20:00`};
 assert.equal(inviteCode('https://evil.example/ABCDEFGHIJKLMNOPQRSTUV'),null);assert.equal(inviteCode(link),'ABCDEFGHIJKLMNOPQRSTUV');
 allow=false;await configurePartnership(ctx,now);assert.equal(metaCalls,0);allow=true;
 await configurePartnership({...ctx,q:`on ${link} 25:00`},now);assert.equal(metaCalls,0);
 await configurePartnership(ctx,now);assert(outputs.at(-1).includes('20:00'));const send=async(c,to,invite,opts)=>sent.push({to,invite,opts});
 assert.equal((await tickPartnerships(conn,now,{send})).length,0);
 await tickPartnerships(conn,now+3600000,{send});assert.equal(sent.length,1);assert.equal(sent[0].to,group);assert.deepEqual(sent[0].opts.mentions,[owner,bot,'member@lid']);
 await tickPartnerships(conn,now+3601000,{send});assert.equal(sent.length,1);
 await tickPartnerships({...conn},now+3602000,{send});assert.equal(sent.length,1);
 await tickPartnerships(conn,now+86400000+3600000,{send});assert.equal(sent.length,2);
 await configurePartnership({...ctx,q:'off'},now+86400000+3601000);await tickPartnerships(conn,now+2*86400000+3600000,{send});assert.equal(sent.length,2);
 await configurePartnership({...ctx,q:'on'},now+2*86400000);const fail=async()=>{throw Error('simulated')};let r=await tickPartnerships(conn,now+2*86400000+3600000,{send:fail});assert.equal(r[0].status,'failed');await tickPartnerships(conn,now+2*86400000+3601000,{send});assert.equal(sent.length,2);
 let message;conn.sendMessage=async(...args)=>{message=args};await sendInviteLink(conn,group,{code:'ABCDEFGHIJKLMNOPQRSTUV',metadata:{id:'partner@g.us',subject:'Parceiro'}},{quoted:{key:{id:'quoted'}},mentions:['member@lid','member@lid']});assert(message[1].text.includes(link));assert.deepEqual(message[1].mentions,['member@lid']);assert.equal(message[2].quoted.key.id,'quoted');assert.equal(message[1].groupInviteMessage,undefined);
 console.log('✅ Parcerias: link/horário, ADM, São Paulo, diário, OFF/ON, persistência, falha sem repetição, link em texto e menções.');
}finally{process.chdir(old);fs.rmSync(temp,{recursive:true,force:true});}
