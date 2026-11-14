import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import os from 'node:os';
import path from 'node:path';
import {EventEmitter} from 'node:events';
import {requestSentinelPairingCode} from '../lib/features/moderation/sentinelPairing.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sentinel-lifecycle-'));
try {
let authReads=0,metadataCalls=0,sends=0,holdAuth=null;
const timers=new Map();let timerId=0;const sockets=[];
class Cache{constructor(){this.data=new Map()}get(k){return this.data.get(k)}set(k,v){this.data.set(k,v)}flushAll(){this.data.clear()}}
const source=fs.readFileSync(new URL('../lib/features/moderation/sentinelSystem.js',import.meta.url),'utf8').replace(/^import[\s\S]*?;\n/gm,'').replace(/export /g,'');
function load(){
 const ctx={fs,path,Buffer,ArrayBuffer,process:{cwd:()=>dir},NodeCache:Cache,Date,console,
 setTimeout(fn,ms){const id=++timerId;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},pino:()=>({}),Browsers:{ubuntu:()=>[]},makeCacheableSignalKeyStore:k=>k,DisconnectReason:{loggedOut:401,connectionReplaced:440},requestSentinelPairingCode,
 useMultiFileAuthState:async()=>{authReads++;if(holdAuth)await holdAuth;return {state:{creds:{registered:true},keys:{}},saveCreds:async()=>{}}},
 makeWASocket(){const s={ev:new EventEmitter(),endCalls:0,end(){this.endCalls++;this.ev.emit('connection.update',{connection:'close'})}};sockets.push(s);return s}
 };
 vm.createContext(ctx);vm.runInContext(source+'\nthis.api={configureSentinelRuntime,startSentinelPairing,stopSentinel,getSentinelStatus,setSentinelGroupEnabled,markPrincipalSeen,processInvisibleCandidate,stringifyDeep};',ctx);return ctx.api;
}
const conn={async groupMetadata(){metadataCalls++;return {participants:[]}},async sendMessage(){sends++}};
let a=load();
for(let i=0;i<1000;i++){a.configureSentinelRuntime(conn);a.markPrincipalSeen({key:{remoteJid:'g@g.us',id:String(i)}})}
assert.equal(authReads,0);assert.equal(sockets.length,0);assert.equal(timers.size,0);
await a.startSentinelPairing('5511999999999');assert.equal(sockets.length,1);const old=sockets[0];old.ev.emit('connection.update',{connection:'open'});
a.setSentinelGroupEnabled('g@g.us',true);
const message={key:{remoteJid:'g@g.us',id:'m',participant:'user@lid'},message:{conversation:'https://example.com'}};
const pending=a.processInvisibleCandidate(message);assert.equal(timers.size,1);
await a.processInvisibleCandidate(message);assert.equal(timers.size,1);
await a.stopSentinel();await pending;assert.equal(timers.size,0);assert.equal(metadataCalls,0);assert.equal(sends,0);assert.equal(old.endCalls,1);assert.equal(old.ev.listenerCount('messages.upsert'),0);
old.ev.emit('connection.update',{connection:'close',lastDisconnect:{error:{statusCode:428}}});
for(let i=0;i<1000;i++)a.configureSentinelRuntime(conn);
assert.equal(sockets.length,1);assert.equal(timers.size,0);assert.equal(a.getSentinelStatus().paused,true);
a=load();a.configureSentinelRuntime(conn);await Promise.resolve();assert.equal(sockets.length,1);assert.equal(a.getSentinelStatus().paused,true);
let release;holdAuth=new Promise(r=>release=r);const starting=a.startSentinelPairing('5511999999999');await Promise.resolve();await Promise.resolve();await a.stopSentinel();release();await assert.rejects(starting,/cancelad/);holdAuth=null;assert.equal(sockets.length,1);
await a.startSentinelPairing('5511999999999');assert.equal(sockets.length,2);await a.stopSentinel();
const started=performance.now();const rendered=a.stringifyDeep({huge:Buffer.alloc(2_000_000),text:'https://example.com',large:'x'.repeat(1_000_000)});assert.ok(rendered.includes('https://example.com'));assert.ok(rendered.length<=25000);assert.ok(performance.now()-started<1000);
assert.equal(sends,0);assert.equal(timers.size,0);
await a.startSentinelPairing('5511999999999');
for (let i=0;i<3;i++) {
 sockets.at(-1).ev.emit('connection.update',{connection:'close',lastDisconnect:{error:{statusCode:428}}});
 assert.equal(timers.size,1);
 const [id,timer]=[...timers.entries()][0];timers.delete(id);timer.fn();
 for(let tick=0;tick<10;tick++)await Promise.resolve();
}
sockets.at(-1).ev.emit('connection.update',{connection:'close',lastDisconnect:{error:{statusCode:428}}});
assert.equal(timers.size,0);assert.equal(a.getSentinelStatus().paused,true);
// Recebimento durante a janela de comparação: nenhuma consulta/ação.
await a.startSentinelPairing('5511999999999');
a.setSentinelGroupEnabled('g@g.us',true);
let check=a.processInvisibleCandidate({...message,key:{...message.key,id:'seen-during-delay'}});
a.markPrincipalSeen({key:{remoteJid:'g@g.us',id:'seen-during-delay'}});
let [taskId,task]=[...timers.entries()][0];timers.delete(taskId);task.fn();await check;
assert.equal(metadataCalls,0);assert.equal(sends,0);
// Recebimento enquanto metadata está lenta: aborta antes de apagar/remover.
let releaseMetadata;
conn.groupMetadata=async()=>{metadataCalls++;return await new Promise(resolve=>releaseMetadata=resolve)};
check=a.processInvisibleCandidate({...message,key:{...message.key,id:'seen-during-metadata'}});
[taskId,task]=[...timers.entries()][0];timers.delete(taskId);task.fn();
for(let i=0;i<10;i++)await Promise.resolve();
assert.equal(metadataCalls,1);
a.markPrincipalSeen({key:{remoteJid:'g@g.us',id:'seen-during-metadata'}});
releaseMetadata({participants:[]});await check;assert.equal(sends,0);
// Carga com mensagens já recebidas na principal não agenda verificações.
const loadStarted=performance.now();
for(let i=0;i<10000;i++){
 const info={...message,key:{...message.key,id:'load-'+i}};
 a.markPrincipalSeen(info);await a.processInvisibleCandidate(info);
}
assert.equal(timers.size,0);assert.equal(metadataCalls,1);assert.equal(sends,0);
console.log(`Sentinela carga simulada: 10000 mensagens recebidas na principal em ${(performance.now()-loadStarted).toFixed(1)}ms; zero consultas extras/envios/timers.`);
await a.stopSentinel();
// A conexão registra todo o lote antes da fila de comandos e do botReady.
const connectionSource=fs.readFileSync(new URL('../connection.js',import.meta.url),'utf8');
const capture=connectionSource.indexOf('markPrincipalSeen(m);');
assert.ok(capture>0 && capture<connectionSource.indexOf('if (!botReady) return;',capture));
console.log('Sentinela: zero autostart; desligamento cancela tarefas; sessão preservada; sem reconexão antiga; cancelamento durante auth; reinício pausado; leitura binária limitada OK');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
