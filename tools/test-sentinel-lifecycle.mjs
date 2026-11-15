import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import os from 'node:os';
import path from 'node:path';
import {EventEmitter} from 'node:events';
import {requestSentinelPairingCode} from '../lib/features/moderation/sentinelPairing.js';
import {inspectSentinelMentions} from '../lib/features/moderation/sentinelMentions.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sentinel-lifecycle-'));
try {
let authReads=0,metadataCalls=0,sends=0,removals=0,holdAuth=null;
const timers=new Map();let timerId=0;const sockets=[];
class Cache{constructor(){this.data=new Map()}get(k){return this.data.get(k)}set(k,v){this.data.set(k,v)}flushAll(){this.data.clear()}}
const source=fs.readFileSync(new URL('../lib/features/moderation/sentinelSystem.js',import.meta.url),'utf8').replace(/^import[\s\S]*?;\n/gm,'').replace(/export /g,'');
function load(){
 const ctx={fs,path,Buffer,ArrayBuffer,process:{cwd:()=>dir},NodeCache:Cache,Date,console,inspectSentinelMentions,
 withAntiLinkGroupLock:async(conn,group,fn)=>fn(),removeAntiLinkParticipant:async()=>{removals++;return {ok:true}},
 setTimeout(fn,ms){const id=++timerId;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},pino:()=>({}),Browsers:{ubuntu:()=>[]},makeCacheableSignalKeyStore:k=>k,DisconnectReason:{loggedOut:401,connectionReplaced:440},requestSentinelPairingCode,
 useMultiFileAuthState:async()=>{authReads++;if(holdAuth)await holdAuth;return {state:{creds:{registered:true},keys:{}},saveCreds:async()=>{}}},
 makeWASocket(){const s={ev:new EventEmitter(),endCalls:0,end(){this.endCalls++;this.ev.emit('connection.update',{connection:'close'})}};sockets.push(s);return s}
 };
 vm.createContext(ctx);vm.runInContext(source+'\nthis.api={configureSentinelRuntime,startSentinelPairing,stopSentinel,getSentinelStatus,setSentinelGroupEnabled,setSentinelMode,getSentinelDiagnostic,getSentinelLogs,markPrincipalSeen,processInvisibleCandidate,stringifyDeep};',ctx);return ctx.api;
}
const conn={async groupMetadata(){metadataCalls++;return {participants:[]}},async sendMessage(){sends++}};
let a=load();
for(let i=0;i<1000;i++){a.configureSentinelRuntime(conn);a.markPrincipalSeen({key:{remoteJid:'g@g.us',id:String(i)}})}
assert.equal(authReads,0);assert.equal(sockets.length,0);assert.equal(timers.size,0);
await a.startSentinelPairing('5511999999999');assert.equal(sockets.length,1);const old=sockets[0];old.ev.emit('connection.update',{connection:'open'});
a.setSentinelGroupEnabled('g@g.us',true);
a.setSentinelMode('g@g.us','remover');
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
conn.groupMetadata=async()=>({participants:[]});
const mentions=Array.from({length:10},(_,i)=>`${55000000000+i}@s.whatsapp.net`);
const mass=id=>({key:{remoteJid:'g@g.us',id,participant:'user@lid'},message:{imageMessage:{caption:'Olá',contextInfo:{mentionedJid:mentions}}}});
async function fire(info){const p=a.processInvisibleCandidate(info);const [id,t]=[...timers.entries()][0];timers.delete(id);t.fn();await p;}
a.setSentinelMode('g@g.us','observar');
await fire(mass('mass-observe-1'));await fire(mass('mass-observe-2'));
assert.equal(sends,0);assert.equal(removals,0);assert.equal(a.getSentinelLogs('g@g.us',1)[0].action,'observado-sem-punição');
await a.stopSentinel();await a.startSentinelPairing('5511999999999');a.setSentinelMode('g@g.us','remover');
await fire(mass('mass-remove-1'));assert.equal(removals,0);
await fire(mass('mass-remove-2'));assert.equal(removals,1);assert.equal(sends,2);
a.configureSentinelRuntime(conn,{isWhitelisted:()=>true});
await fire(mass('mass-protected'));assert.equal(removals,1);
a.configureSentinelRuntime(conn,{isWhitelisted:()=>false});
conn.groupMetadata=async()=>({participants:[{id:'user@lid',admin:'admin'}]});
await fire(mass('mass-admin'));assert.equal(removals,1);
assert.equal(inspectSentinelMentions({extendedTextMessage:{contextInfo:{quotedMessage:{imageMessage:{contextInfo:{mentionedJid:mentions}}}}}}).count,0);
assert.equal(inspectSentinelMentions({viewOnceMessageV2:{message:{imageMessage:{contextInfo:{mentionedJid:[...mentions,...mentions]}}}}}).count,10);
const sourceIndex=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8');
assert.ok(sourceIndex.indexOf('if (action === "modo")',sourceIndex.indexOf('case "sentinel": {'))>sourceIndex.indexOf('case "sentinel": {'));
console.log('Menções: imagem/envelope, deduplicação, citação ignorada, modo observar, repetição e proteção ADM/whitelist OK');
await a.stopSentinel();
// A conexão registra todo o lote antes da fila de comandos e do botReady.
const connectionSource=fs.readFileSync(new URL('../connection.js',import.meta.url),'utf8');
const capture=connectionSource.indexOf('markPrincipalSeen(m);');
assert.ok(capture>0 && capture<connectionSource.indexOf('if (!botReady) return;',capture));
console.log('Sentinela: zero autostart; desligamento cancela tarefas; sessão preservada; sem reconexão antiga; cancelamento durante auth; reinício pausado; leitura binária limitada OK');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
