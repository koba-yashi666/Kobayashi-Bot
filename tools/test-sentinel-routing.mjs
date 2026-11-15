import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8');
const names=['sentinel','antifarm','sentinelbridge'];
function body(name){
 const start=source.indexOf(`case "${name}":`);
 const end=source.indexOf('\nbreak;',start);
 assert.ok(start>0&&end>start);
 return source.slice(start,end);
}
async function run(name,args=[],owner=true){
 const replies=[],calls=[];
 const ctx={args,SoDonoPrincipal:owner,isGroup:true,isGroupAdmins:true,from:'g@g.us',sender:'user',prefix:'/',dono:'owner',
 reply:async text=>{replies.push(text);return text},
 mess:{onlyGroup:()=> 'grupo',onlyAdmins:()=> 'adm'},
 getSentinelStatus:()=>({paused:false,connected:true,groupEnabled:true,delayMs:2000}),
 getSentinelDiagnostic:()=>({mode:'observar'}),setSentinelMode:(...v)=>calls.push(['mode',...v]),
 setSentinelGroupEnabled:(...v)=>calls.push(['sentinel',...v]),
 getAntiFarmConfig:()=>({enabled:true}),getAntiFarmUsage:()=>({actions:0,coins:0}),
 setAntiFarmEnabled:(...v)=>{calls.push(['antifarm',...v]);return v[1]},
 getSentinelBridgeStatus:()=>({enabled:true}),
 };
 vm.createContext(ctx);
 await vm.runInContext(`(async()=>{switch(${JSON.stringify(name)}){${body(name)}\nbreak;}})()`,ctx);
 return {replies,calls};
}
assert.match((await run('sentinel')).replies[0],/KOBAYASHI SENTINEL/);
assert.match((await run('antifarm')).replies[0],/ANTI-FARM DIÁRIO/);
assert.match((await run('sentinelbridge')).replies[0],/SENTINEL BRIDGE/);
assert.deepEqual((await run('sentinel',['off'])).calls,[['sentinel','g@g.us',false]]);
assert.deepEqual((await run('antifarm',['off'])).calls,[['antifarm','g@g.us',false]]);
assert.deepEqual((await run('sentinel',['modo','remover'])).calls,[['mode','g@g.us','remover']]);
assert.match((await run('sentinel',['diagnostico'])).replies[0],/DIAGNÓSTICO SENTINELA/);
assert.deepEqual((await run('sentinel',['modo','remover'],false)).calls,[]);
for(const name of names)assert.equal((source.match(new RegExp(`case "${name}":`,'g'))||[]).length,1);
console.log('Roteamento: sentinel/status/off/modo/diagnostico, antifarm e bridge separados; dono validado.');
