import assert from 'node:assert/strict';
import {createRentalLifecycle} from '../lib/features/billing/lifecycle.js';
import {DAY,GRACE} from '../lib/features/billing/storage.js';
const memory=x=>{let d=structuredClone(x);return {read:()=>structuredClone(d),write(v){d=structuredClone(v)},update(fn){fn(d)}}};
let now=Date.now();const expiry=now+7*DAY,owner='5511999999999@s.whatsapp.net',lid='777777@lid';
const rentals=memory({groups:{'100@g.us':{groupName:'Cliente',expiresAt:expiry,responsibleJid:owner}}}),notices=memory({notices:{}}),sent=[];let pvFails=true,left=0;
const conn={user:{id:'bot'},sendMessage:async(jid,data)=>{if(jid===owner&&pvFails)throw Error('private blocked');sent.push({jid,data})},groupMetadata:async jid=>({id:jid,participants:[{id:lid,phoneNumber:owner}]}),groupLeave:async()=>left++};
const tick=createRentalLifecycle({rentals,notices,clock:()=>now});await tick(conn);assert.equal(sent.length,1);assert.equal(sent[0].jid,'100@g.us');assert.deepEqual(sent[0].data.mentions,[lid]);assert.match(sent[0].data.text,/7 dia/);
pvFails=false;await tick(conn);assert.equal(sent.length,2);assert.equal(sent[1].jid,owner);await tick(conn);assert.equal(sent.length,2);
now=expiry-3*DAY;await tick(conn);assert.equal(sent.length,4);assert.match(sent.at(-1).data.text,/3 dia/);await tick(conn);assert.equal(sent.length,4);
now=expiry;await tick(conn);assert.equal(sent.length,6);assert.match(sent.at(-1).data.text,/aluguel venceu/);assert.match(sent.at(-1).data.text,/duas horas/);assert.equal(left,0);
now=expiry+GRACE-1;await tick(conn);assert.equal(left,0);now++;await tick(conn);assert.equal(left,1);await tick(conn);assert.equal(left,1);
// Novo vencimento gera outro ciclo de avisos; desativar o grupo mantém avisos privados.
rentals.update(d=>{d.groups['100@g.us'].expiresAt=now+7*DAY;delete d.groups['100@g.us'].leftAfterExpiry});const privateOnly=createRentalLifecycle({rentals,notices,clock:()=>now,groupNotices:()=>false});const before=sent.length;await privateOnly(conn);assert.equal(sent.length,before+1);assert.equal(sent.at(-1).jid,owner);
console.log('Avisos: 7d/3d/vencimento, PV independente do grupo, menção PN→LID, repetição/reinício, renovação, grupo off e saída após 2h OK.');
