import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "files", "database", "antilink-temporary-locks.json");
const queues = new WeakMap();
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function readLocks() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
function updateLock(jid, record) {
  const locks=readLocks();
  if(record)locks[jid]=record;else delete locks[jid];
  fs.mkdirSync(path.dirname(FILE),{recursive:true});
  fs.writeFileSync(`${FILE}.tmp`,JSON.stringify(locks,null,2));
  fs.renameSync(`${FILE}.tmp`,FILE);
}
function socketQueues(conn) {
  let map=queues.get(conn);if(!map){map=new Map();queues.set(conn,map);}return map;
}
async function reopen(conn,jid) {
  for(let attempt=1;attempt<=3;attempt++){
    try{
      await conn.groupSettingUpdate(jid,"not_announcement");
      updateLock(jid,null);return true;
    }catch(error){
      console.error(`[ANTILINK] Reabrir ${jid}, tentativa ${attempt}/3:`,error?.message||error);
      if(attempt<3)await wait(750*attempt);
    }
  }
  // Mantém o registro para tentar novamente após a reconexão.
  return false;
}
async function drain(conn,jid,state,map) {
  while(state.jobs.length){
    let restore=false;
    const completed=[];
    try{
      const meta=await conn.groupMetadata(jid);
      if(!meta||!Array.isArray(meta.participants))throw new Error("Metadados do grupo indisponíveis");
      if(meta.announce!==true){
        // Registra ANTES do fechamento para poder recuperar após queda do processo.
        updateLock(jid,{originallyOpen:true,startedAt:Date.now()});
        restore=true;
        await conn.groupSettingUpdate(jid,"announcement");
      }else if(readLocks()[jid]?.originallyOpen){
        // Uma tentativa anterior de reabertura falhou; não confundir com grupo fechado originalmente.
        restore=true;
      }
    }catch(error){
      console.error(`[ANTILINK] Fechamento temporário ${jid}:`,error?.message||error);
    }
    // Serializa incidentes do mesmo grupo. Nenhum deles reabre antes dos demais.
    try{
      while(state.jobs.length){
        const job=state.jobs.shift();
        try{completed.push({job,value:await job.task()});}
        catch(error){completed.push({job,error});}
      }
    }finally{
      if(restore)await reopen(conn,jid);
    }
    for(const item of completed){
      if(item.error)item.job.reject(item.error);else item.job.resolve(item.value);
    }
    // Incidentes que chegaram DURANTE a reabertura começam outro ciclo antes de executar.
  }
  map.delete(jid);
}

export function withAntiLinkGroupLock(conn,jid,task,{enabled=true}={}) {
  if(!enabled)return Promise.resolve().then(task);
  const map=socketQueues(conn);let state=map.get(jid);
  const promise=new Promise((resolve,reject)=>{
    if(!state){state={jobs:[]};map.set(jid,state);}
    state.jobs.push({task,resolve,reject});
  });
  if(!state.running){
    state.running=true;
    drain(conn,jid,state,map).catch(error=>{
      console.error("[ANTILINK] Falha na fila:",error?.message||error);
      for(const job of state.jobs)job.reject(error);
      map.delete(jid);
    });
  }
  return promise;
}

export async function recoverAntiLinkGroupLocks(conn) {
  let locks;
  try{locks=readLocks();}catch(error){console.error("[ANTILINK] Registro de recuperação inválido:",error?.message||error);return;}
  for(const [jid,record] of Object.entries(locks)){
    if(!record?.originallyOpen||socketQueues(conn).has(jid))continue;
    try{
      const meta=await conn.groupMetadata(jid);
      if(meta?.announce===false){updateLock(jid,null);continue;}
      await reopen(conn,jid);
    }catch(error){console.error(`[ANTILINK] Recuperação ${jid}:`,error?.message||error);}
  }
}
