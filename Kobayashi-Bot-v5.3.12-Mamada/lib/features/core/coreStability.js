import fs from "fs";
import path from "path";

const STARTED_AT=Date.now();
const state={lastCleanup:0,deletedTemp:0,freedBytes:0,warnings:[],errors:[]};
const TEMP_DIRS=["temp","tmp","files/temp","files/tmp"];
const MAX_AGE=6*60*60*1000;

function mb(n){return Math.round((Number(n)||0)/1024/1024*100)/100}
function push(arr,item,max=30){arr.push(item);while(arr.length>max)arr.shift()}
export function recordCoreError(type,error){
  push(state.errors,{at:Date.now(),type,message:String(error?.message||error||"erro").slice(0,500)});
}
export function getCoreStatus(){
 const m=process.memoryUsage();
 return {startedAt:STARTED_AT,uptimeMs:Date.now()-STARTED_AT,rssMB:mb(m.rss),heapUsedMB:mb(m.heapUsed),heapTotalMB:mb(m.heapTotal),externalMB:mb(m.external),lastCleanup:state.lastCleanup,deletedTemp:state.deletedTemp,freedMB:mb(state.freedBytes),warnings:[...state.warnings],errors:[...state.errors]};
}
async function walkClean(dir,now){
 let deleted=0,freed=0;
 if(!fs.existsSync(dir))return {deleted,freed};
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
   const p=path.join(dir,ent.name);
   try{
     if(ent.isDirectory()){const r=await walkClean(p,now);deleted+=r.deleted;freed+=r.freed;continue}
     const st=fs.statSync(p);
     if(now-st.mtimeMs>MAX_AGE){freed+=st.size;fs.unlinkSync(p);deleted++}
   }catch{}
 }
 return {deleted,freed};
}
export async function cleanCoreTemp(){
 const now=Date.now();let deleted=0,freed=0;
 for(const d of TEMP_DIRS){const r=await walkClean(path.resolve(d),now);deleted+=r.deleted;freed+=r.freed}
 state.lastCleanup=now;state.deletedTemp+=deleted;state.freedBytes+=freed;
 return {deleted,freedMB:mb(freed)};
}
export function ensureCoreStability(){
 if(global.__KOBAYASHI_CORE_V5)return;
 global.__KOBAYASHI_CORE_V5=true;
 process.on("warning",w=>{if(w?.name==="MaxListenersExceededWarning")push(state.warnings,{at:Date.now(),message:w.message})});
 process.on("unhandledRejection",reason=>{recordCoreError("unhandledRejection",reason);console.error("[CORE V5] Promise rejeitada:",reason?.message||reason)});
 process.on("uncaughtException",err=>{
   recordCoreError("uncaughtException",err);
   console.error("[CORE V5] Erro não tratado:",err?.stack||err);
   // Não cria loop de restart. Erros fatais de runtime deixam o supervisor/hospedagem reiniciar.
   if(["ENOMEM","ENOSPC","EMFILE"].includes(err?.code)) setTimeout(()=>process.exit(1),1500);
 });
 setInterval(async()=>{
   try{
     const m=process.memoryUsage();
     if(m.rss>700*1024*1024)push(state.warnings,{at:Date.now(),message:`RAM alta: ${mb(m.rss)} MB`});
     await cleanCoreTemp();
   }catch(e){recordCoreError("maintenance",e)}
 },10*60*1000).unref?.();
}
