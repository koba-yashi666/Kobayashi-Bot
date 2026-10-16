import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { discoverBlacklistGroups } from '../lib/features/moderation/blacklistScope.js';
import { purgeGroups } from '../lib/features/moderation/groupPurge.js';

const old=process.cwd(), temp=fs.mkdtempSync(path.join(os.tmpdir(),'koba-blacklist-'));
process.chdir(temp);
try {
  const global=await import('../lib/features/moderation/globalBlacklist.js');
  const local=await import('../lib/features/moderation/adminPro.js');
  const bot='5511999999999@s.whatsapp.net', user='5511888888888@s.whatsapp.net';
  const a='111@g.us',b='222@g.us',c='333@g.us',d='444@g.us';
  const members=new Map([[a,[{id:bot,admin:'admin'},{id:user}]],[b,[{id:bot},{id:user}]],[c,[{id:'99@lid',phoneNumber:bot,admin:'superadmin'}]]]);
  const conn={user:{id:bot},groupFetchAllParticipating:async()=>({[a]:{subject:'Dragão'},[b]:{subject:'Café'},[c]:{subject:'Maid'},[d]:{subject:'Falha'}}),groupMetadata:async id=>{if(id===d)throw Error('indisponível');return {subject:id,participants:members.get(id)};},groupParticipantsUpdate:async(id,targets)=>{members.set(id,members.get(id).filter(p=>!targets.includes(p.id)));return [];} };
  const scope=await discoverBlacklistGroups(conn);
  assert.deepEqual(scope.groups.map(g=>g.jid),[a,c]);
  assert.equal(scope.issues.length,2);
  global.addGlobalBlacklist(user,{groupJids:scope.groups.map(g=>g.jid)});
  assert(global.isGloballyBlacklisted(user,a));
  assert(global.isGloballyBlacklisted(user,c));
  assert(!global.isGloballyBlacklisted(user,b));
  assert(!global.isGloballyBlacklisted(user,'novo@g.us'));
  assert(!global.isGloballyBlacklisted(user)); // Não bloqueia o PV.
  const persisted=JSON.parse(fs.readFileSync('files/database/lista-negra-global.json','utf8'));
  assert.deepEqual(persisted.users[user].groupJids,[a,c]);
  global.removeGlobalBlacklist(user);
  local.addBlacklist(a,user,bot,'Teste local');
  assert(local.isBlacklisted(a,user));assert(!local.isBlacklisted(b,user));
  const calls=[];
  const fetchMetadata=conn.groupMetadata;
  conn.groupMetadata=async id=>{calls.push(id);return fetchMetadata(id);};
  const result=await purgeGroups(conn,user,[{jid:a,name:'Dragão'}],{pause:async()=>{}});
  assert.equal(result[0].status,'removed');
  assert(calls.every(id=>id===a));
  assert(members.get(b).some(p=>p.id===user));
  await assert.rejects(()=>discoverBlacklistGroups({...conn,groupFetchAllParticipating:async()=>{throw Error('falha');}}));
  assert.equal(global.normalizeBlacklistJid('123456789:2@lid'),'123456789@lid');
  assert.equal(global.normalizeBlacklistJid('5511888888888:2@s.whatsapp.net'),user);
  const source=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8');
  const localCase=source.slice(source.indexOf('case "listanegra":'),source.indexOf('case "entrada_membro":'));
  assert(!localCase.includes('purgeUserFromAdminGroups'));
  assert(localCase.includes('[{jid:from,name:groupName}]'));
  assert(source.includes('isGloballyBlacklisted(jid, groupJid)'));
  assert(source.includes('registeredGroups:scope.groups'));
  console.log('✅ Lista Negra: alcance local, registro somente em grupos ADM, reentrada por grupo e falha de consulta sem ampliação.');
} finally {process.chdir(old);fs.rmSync(temp,{recursive:true,force:true});}
