import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {requestSentinelPairingCode} from '../lib/features/moderation/sentinelPairing.js';
const socket=fn=>({ev:new EventEmitter(),requestPairingCode:fn});
let calls=0;
const sock=socket(async n=>{assert.equal(n,'5511999999999');calls++;return 'ABCD1234'});
const p=requestSentinelPairingCode(sock,'5511999999999');
sock.ev.emit('connection.update',{connection:'connecting'});
await Promise.resolve();assert.equal(calls,0);
sock.ev.emit('connection.update',{qr:'ready'});sock.ev.emit('connection.update',{qr:'repeat'});
assert.equal(await p,'ABCD-1234');assert.equal(calls,1);assert.equal(sock.ev.listenerCount('connection.update'),0);
for(const [fn,event,pattern] of [
 [async()=>'',{qr:'q'},/gerar o código/],
 [async()=>{throw {output:{statusCode:429}}},{qr:'q'},/HTTP 429/],
 [async()=>{throw Error('unused')},{connection:'close',lastDisconnect:{error:{output:{statusCode:428}}}},/HTTP 428/]
]){
 const s=socket(fn);const promise=requestSentinelPairingCode(s,'5511999999999');s.ev.emit('connection.update',event);await assert.rejects(promise,pattern);assert.equal(s.ev.listenerCount('connection.update'),0);
}
const slow=socket(async()=> 'ABCD1234');await assert.rejects(requestSentinelPairingCode(slow,'5511999999999',{timeoutMs:5}),/Tempo esgotado/);assert.equal(slow.ev.listenerCount('connection.update'),0);
let resolve;const late=socket(()=>new Promise(r=>resolve=r));const latePromise=requestSentinelPairingCode(late,'5511999999999');late.ev.emit('connection.update',{qr:'q'});await Promise.resolve();late.ev.emit('connection.update',{connection:'close'});await assert.rejects(latePromise,/encerrada/);resolve('ABCD1234');await Promise.resolve();assert.equal(late.ev.listenerCount('connection.update'),0);
console.log('Sentinela: prontidão QR, pedido único, erro HTTP, timeout, fechamento e limpeza OK');
