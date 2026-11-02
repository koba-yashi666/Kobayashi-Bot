import assert from 'node:assert/strict';
import {groupStatusKind,handleAntiStatus} from '../lib/features/moderation/antiStatus.js';
let seq=0;
const info=message=>({key:{remoteJid:'test@g.us',participant:'user@lid',id:String(++seq)},message});
for(const type of ['groupStatusMessage','groupStatusMessageV2','groupStatusMentionMessage','statusMentionMessage']){
 const raw=info({[type]:{message:{imageMessage:{}}}});assert(groupStatusKind(raw));
 for(const wrap of ['ephemeralMessage','viewOnceMessage','viewOnceMessageV2','viewOnceMessageV2Extension'])assert(groupStatusKind(info({[wrap]:{message:raw.message}})));
}
for(const type of [25,'STATUS_MENTION_MESSAGE'])assert.equal(groupStatusKind(info({protocolMessage:{type}})),'mention');
assert.equal(groupStatusKind(info({imageMessage:{caption:'status @grupo'}})),null);
assert.equal(groupStatusKind(info({extendedTextMessage:{contextInfo:{quotedMessage:{groupStatusMessage:{}}}}})),null);
assert.equal(groupStatusKind({...info({groupStatusMessage:{}}),key:{remoteJid:'status@broadcast'}}),null);
let deleted=[],removed=[],logs=[];
const conn={sendMessage:async(g,p)=>{deleted.push(p.delete);}};
const options={conn,enabled:true,botIsAdmin:true,protectedMember:false,identities:['user@lid'],removeParticipant:async ids=>{removed.push(ids);return {ok:true};},log:x=>logs.push(x)};
for(const type of ['groupStatusMessage','groupStatusMessageV2','groupStatusMentionMessage']){const event=info({[type]:{}});const r=await handleAntiStatus({...options,info:event});assert(r.deleted&&r.removed);assert.equal(deleted.at(-1),event.key);const count=removed.length;await handleAntiStatus({...options,info:event});assert.equal(removed.length,count);}
for(const changes of [{enabled:false},{protectedMember:true}]){const count=deleted.length;assert.equal((await handleAntiStatus({...options,...changes,info:info({groupStatusMessage:{}})})).handled,false);assert.equal(deleted.length,count);}
const retry=info({groupStatusMessage:{}});assert.equal((await handleAntiStatus({...options,botIsAdmin:false,info:retry})).reason,'not_admin');assert((await handleAntiStatus({...options,info:retry})).removed);
const failing={sendMessage:async()=>{throw Error('delete failed');}};assert((await handleAntiStatus({...options,conn:failing,info:info({groupStatusMessage:{}})})).removed);
assert.equal((await handleAntiStatus({...options,info:info({groupStatusMessage:{}}),removeParticipant:async()=>({ok:false,reason:'403'})})).removed,false);
const self=info({groupStatusMessage:{}});self.key.fromMe=true;assert.equal((await handleAntiStatus({...options,info:self})).handled,false);
assert(logs.some(x=>x.detail.includes('Status publicado')));assert(logs.some(x=>x.detail.includes('Menção ao grupo')));
console.log('✅ AntiSTTS: posts V1/V2, menções, wrappers, falso positivo, proteção, dedupe, permissão e falhas.');
