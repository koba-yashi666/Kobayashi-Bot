import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import os from 'node:os';
import path from 'node:path';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sentinel-perf-'));
try{
let reads=0,authReads=0,now=1000000;const pending=[];
const fakeFs={...fs,readFileSync(...args){if(String(args[0]).endsWith('sentinel-config.json'))reads++;return fs.readFileSync(...args)}};
const source=fs.readFileSync(new URL('../lib/features/moderation/sentinelSystem.js',import.meta.url),'utf8').replace(/^import[\s\S]*?;\n/gm,'').replace(/export /g,'');
const ctx={fs:fakeFs,path,process:{cwd:()=>dir},NodeCache:class{},Date:{now:()=>now},setTimeout:fn=>{pending.push(fn);return {unref(){}}},clearTimeout(){},useMultiFileAuthState:async()=>{authReads++;return {state:{creds:{registered:false}}}},console};
vm.createContext(ctx);vm.runInContext(source+'\nthis.api={markPrincipalSeen,configureSentinelRuntime,setSentinelGroupEnabled,getConfig,processInvisibleCandidate};',ctx);
const a=ctx.api,conn={};
a.setSentinelGroupEnabled('g@g.us',true);
for(let i=0;i<1000;i++){a.configureSentinelRuntime(conn);a.getConfig()}
await Promise.resolve();assert.equal(authReads,1);assert.equal(reads,0);
now+=2100;a.getConfig();assert.equal(reads,1);a.setSentinelGroupEnabled('g@g.us',false);assert.equal(a.getConfig().groups['g@g.us'],false);
a.setSentinelGroupEnabled('g@g.us',true);
const msg=id=>({key:{remoteJid:'g@g.us',id,participant:'u@lid'},message:{conversation:'oi'}});
a.markPrincipalSeen(msg('seen'));await a.processInvisibleCandidate(msg('seen'));assert.equal(pending.length,0);
const first=a.processInvisibleCandidate(msg('duplicate'));await a.processInvisibleCandidate(msg('duplicate'));assert.equal(pending.length,1);
a.markPrincipalSeen(msg('duplicate'));pending.shift()();await first;
assert.equal(fs.existsSync(path.join(dir,'files/database/sentinel-log.json')),false);
const next=a.processInvisibleCandidate(msg('off'));a.setSentinelGroupEnabled('g@g.us',false);pending.shift()();await next;
assert.equal(fs.existsSync(path.join(dir,'files/database/sentinel-log.json')),false);
console.log('Sentinela: 1000 consultas em cache, inicialização única, sem espera para mensagens vistas, deduplicação e desligamento durante espera OK');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
