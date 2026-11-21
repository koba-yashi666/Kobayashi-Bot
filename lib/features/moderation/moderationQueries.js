const states=new WeakMap();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export const isModerationRateLimit=e=>Number(e?.output?.statusCode||e?.statusCode||e?.status||e?.data)===429||/rate.?overlimit|rate.?limit|too many requests|resource-limit/i.test(String(e?.message||e||''));
export function moderationQueries(conn,{clock=Date.now,pause=sleep,gap=650,cooldown=60000}={}){
 let state=states.get(conn);if(state)return state;
 let tail=Promise.resolve(),mutationTail=Promise.resolve(),next=0,until=0;const cache=new Map(),inflight=new Map();
 function limited(){const e=Error(`WhatsApp limitou as consultas. Verificação adiada; tente novamente em ${Math.max(1,Math.ceil((until-clock())/1000))}s.`);e.code='KOBA_RATE_LIMIT';e.statusCode=429;return e;}
 function assertReady(){if(clock()<until)throw limited();}
 function markRate(){until=Math.max(until,clock()+cooldown);return limited();}
 function run(fn){
  const task=tail.catch(()=>{}).then(async()=>{assertReady();const wait=Math.max(0,next-clock());if(wait)await pause(wait);assertReady();next=clock()+gap;try{return await fn();}catch(e){if(isModerationRateLimit(e))throw markRate();throw e;}});
  tail=task.catch(()=>{});return task;
 }
 function remember(jid,meta){if(Array.isArray(meta?.participants)){cache.set(jid,{metadata:meta,at:clock()});}return meta;}
 async function metadata(jid,{fresh=false,maxAge=30000}={}){
  const saved=cache.get(jid);if(!fresh&&saved&&clock()-saved.at<=maxAge)return saved.metadata;
  if(inflight.has(jid))return inflight.get(jid);
  const task=run(async()=>{const value=await conn.groupMetadata(jid);if(!value||value.id&&value.id!==jid||!Array.isArray(value.participants))throw Error('Metadados de participantes não confirmados.');return remember(jid,value);});
  inflight.set(jid,task);try{return await task;}finally{inflight.delete(jid);}
 }
 async function all(){const key='all';if(inflight.has(key))return inflight.get(key);const task=run(()=>conn.groupFetchAllParticipating());inflight.set(key,task);try{return await task;}finally{inflight.delete(key);}}
 function mutate(fn){const work=mutationTail.catch(()=>{}).then(async()=>{await run(async()=>{});assertReady();try{return await fn();}catch(e){if(isModerationRateLimit(e))throw markRate();throw e;}});mutationTail=work.catch(()=>{});return work;}
 state={run,mutate,metadata,all,remember,assertReady,markRate,invalidate:jid=>cache.delete(jid),cooldownUntil:()=>until};states.set(conn,state);
 if(conn.ev?.on){conn.ev.on('group-participants.update',e=>{if(e?.id)cache.delete(e.id)});conn.ev.on('groups.update',events=>{for(const e of events||[])if(e?.id)cache.delete(e.id)});}
 return state;
}
