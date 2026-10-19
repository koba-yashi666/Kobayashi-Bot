import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const old=process.cwd(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'koba-mute-'));
process.chdir(tmp);
try{
  const store=await import('../lib/features/moderation/yuriProtection.js');
  const {handleMutedMessage,handleMuteCommand}=await import('../lib/features/moderation/muteSystem.js');
  const group='123@g.us',other='456@g.us',user='5511111111111@s.whatsapp.net',lid='999999999@lid',bot='5522222222222@s.whatsapp.net',adm='5533333333333@s.whatsapp.net';
  const members=[{id:bot,admin:'admin'},{id:adm,admin:'admin'},{id:lid,phoneNumber:user,lid}];
  const operations=[],replies=[];
  const conn={user:{id:bot},signalRepository:{lidMapping:{getPNForLID:async id=>id===lid?user:null,getLIDForPN:async id=>id===user?lid:null}},groupMetadata:async()=>({participants:members}),sendMessage:async(g,p)=>operations.push(p.delete?'delete':'notice'),groupParticipantsUpdate:async(g,targets,action)=>{operations.push(action);return [{jid:targets[0],status:'200'}];}};
  const info={key:{remoteJid:group,participant:lid,id:'message-1'},message:{stickerMessage:{}}};
  const run=()=>handleMutedMessage({conn,info,group,identities:[lid]});
  const command={conn,from:group,isGroup:true,isAdmin:true,isOwner:false,authorIds:[adm],info:{key:{participant:adm},message:{extendedTextMessage:{contextInfo:{mentionedJid:[lid]}}}},q:'',prefix:'/',reply:async text=>replies.push(text),isWhitelisted:()=>false};
  await handleMuteCommand({...command,command:'mute'});
  assert(store.isMuted(group,user));assert(store.isMuted(group,lid));assert(!store.isMuted(other,lid));
  operations.length=0;let result=await run();assert(result.deleted);assert.deepEqual(operations,['delete']);
  await handleMuteCommand({...command,command:'muteb'});assert.equal(store.getMuteState(group,[user]).mode,'ban');
  operations.length=0;result=await run();assert(result.deleted&&result.removed);assert.deepEqual(operations,['delete','remove']);
  await handleMuteCommand({...command,command:'unmute'});assert(!store.isMuted(group,user));assert(!store.isMuted(group,lid));
  assert(!(await run()).handled);
  // Registros antigos booleanos continuam funcionando por PN/LID.
  const dbFile='files/database/yuri-protection.json';let db=JSON.parse(fs.readFileSync(dbFile));db[group].mutedUsers={[user]:true};fs.writeFileSync(dbFile,JSON.stringify(db));
  operations.length=0;assert((await run()).deleted);assert.deepEqual(operations,['delete']);store.unmuteUser(group,[user,lid]);
  // Um membro comum não consegue aplicar a punição.
  await handleMuteCommand({...command,command:'muteb',isAdmin:false});assert(!store.isMuted(group,user));
  // Resposta a mensagem também identifica o membro.
  await handleMuteCommand({...command,command:'muteb',info:{message:{videoMessage:{contextInfo:{participant:lid}}}}});assert(store.isMuted(group,user));
  members[2].admin='admin';operations.length=0;assert(!(await run()).handled);assert.deepEqual(operations,[]);members[2].admin=null;
  operations.length=0;assert(!(await handleMutedMessage({conn,info,group,identities:[lid],protectedMember:true})).handled);assert.deepEqual(operations,[]);
  operations.length=0;assert(!(await handleMutedMessage({conn,info,group,identities:[lid],isWhitelisted:()=>true})).handled);assert.deepEqual(operations,[]);
  members[0].admin=null;operations.length=0;assert.equal((await run()).reason,'bot-not-admin');assert.deepEqual(operations,[]);members[0].admin='admin';
  // Falha ao apagar não impede tentar a remoção, e não é relatada como sucesso.
  conn.sendMessage=async()=>{throw Error('falha simulada de delete');};operations.length=0;result=await run();assert.equal(result.deleted,false);assert(result.removed);assert.deepEqual(operations,['remove']);
  console.log('✅ Mute: PN/LID, menção/resposta, persistência legada, desmute, delete, muteb, permissões e proteções.');
}finally{process.chdir(old);fs.rmSync(tmp,{recursive:true,force:true});}
