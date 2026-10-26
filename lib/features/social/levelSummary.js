import fs from 'node:fs';
import path from 'node:path';
import { writeJsonFile } from '../../core/jsonStore.js';
import { isLevelEnabled } from './activityTracker.js';
export const LEVEL_SUMMARY_HOUR = 3600000;
const FILE=path.join(process.cwd(),'files','database','level-hourly-summary.json');
const locks=new Set();
const canonical=id=>String(id||'').replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');
const valid=id=>/^\d+@(s\.whatsapp\.net|lid|hosted|hosted\.lid)$/.test(id);
function read(){
  if(!fs.existsSync(FILE))return {groups:{}};
  const db=JSON.parse(fs.readFileSync(FILE,'utf8'));db.groups ||= {};return db;
}
function group(db,jid){return db.groups[jid] ||= {users:{},dueAt:0,lastSentAt:0,inflight:null};}
function merge(a,b){
  if(!a)return {...b,ids:[...(b.ids||[])]};
  const first=a.firstAt<=b.firstAt?a:b,last=a.lastAt<=b.lastAt?b:a;
  const ids=[...new Set([...(a.ids||[]),...(b.ids||[])])];
  return {...last,jid:ids.find(id=>id.endsWith('@s.whatsapp.net'))||last.jid,ids,fromLevel:first.fromLevel,toLevel:last.toLevel,coins:a.coins+b.coins,firstAt:Math.min(a.firstAt,b.firstAt),lastAt:Math.max(a.lastAt,b.lastAt)};
}
export function queueLevelUp({groupJid,userJid,aliases=[],oldLevel,newLevel,coins=0,now=Date.now()}) {
  if(!groupJid?.endsWith('@g.us')||!valid(canonical(userJid))||!Number.isInteger(oldLevel)||!Number.isInteger(newLevel)||newLevel<=oldLevel)return false;
  const ids=[...new Set([userJid,...aliases].filter(Boolean).map(canonical).filter(valid))];
  const jid=ids.find(id=>id.endsWith('@s.whatsapp.net'))||canonical(userJid);
  const db=read(),g=group(db,groupJid);g.users ||= {};
  let row={jid,ids,fromLevel:oldLevel,toLevel:newLevel,coins:Math.max(0,Math.floor(Number(coins)||0)),firstAt:now,lastAt:now};
  for(const [key,existing] of Object.entries(g.users))if((existing.ids||[existing.jid]).some(id=>ids.includes(id))){row=merge(existing,row);delete g.users[key];}
  g.users[row.jid]=row;
  if(!g.dueAt)g.dueAt=Math.max(now+LEVEL_SUMMARY_HOUR,Number(g.lastSentAt||0)+LEVEL_SUMMARY_HOUR);
  writeJsonFile(FILE,db);return true;
}
export function formatLevelSummary(users,remaining=0) {
  const rows=Object.values(users).sort((a,b)=>a.firstAt-b.firstAt);
  return {
    text:'🐉✨ *EVOLUÇÃO DA ÚLTIMA HORA*\n\n'+rows.map(r=>`👤 @${r.jid.split('@')[0]}\n⭐ Nível ${r.fromLevel} → ${r.toLevel}\n🪙 Ganhou ${r.coins} Dragon-coins`).join('\n\n')+(remaining?'\n\nAs demais evoluções serão incluídas no próximo resumo.':''),
    mentions:[...new Set(rows.map(r=>r.jid))]
  };
}
export async function flushLevelSummaries(conn,{now=Date.now(),enabled=isLevelEnabled}={}) {
  if(!conn?.sendMessage)return [];
  const results=[];
  for(const jid of Object.keys(read().groups)) {
    if(locks.has(jid)||!enabled(jid))continue;
    locks.add(jid);
    try {
      let db=read(),g=db.groups[jid];
      if(now<Number(g.lastSentAt||0)+LEVEL_SUMMARY_HOUR)continue;
      if(g.inflight&&now<Number(g.retryAt||0))continue;
      if(!g.inflight) {
        if(!g.dueAt||now<g.dueAt||!Object.keys(g.users||{}).length)continue;
        // Um único envio, sem dividir em várias mensagens. Excedentes aguardam a próxima hora.
        const rows=Object.entries(g.users).sort((a,b)=>a[1].firstAt-b[1].firstAt).slice(0,200);
        g.inflight={users:Object.fromEntries(rows),claimedAt:now};
        for(const [key] of rows)delete g.users[key];
        g.dueAt=Object.keys(g.users).length?now+LEVEL_SUMMARY_HOUR:0;
        writeJsonFile(FILE,db);
      }
      const payload=formatLevelSummary(g.inflight.users,Object.keys(g.users||{}).length);
      try {
        await conn.sendMessage(jid,payload);
        db=read();g=db.groups[jid];g.inflight=null;g.retryAt=0;g.lastSentAt=now;
        if(Object.keys(g.users||{}).length)g.dueAt=Math.max(Number(g.dueAt||0),now+LEVEL_SUMMARY_HOUR);
        writeJsonFile(FILE,db);results.push({group:jid,status:'sent'});
      } catch(error) {
        db=read();g=db.groups[jid];g.retryAt=now+5*60000;g.lastError=String(error?.message||error).slice(0,160);writeJsonFile(FILE,db);
        results.push({group:jid,status:'failed'});
      }
    } finally {locks.delete(jid);}
  }
  return results;
}
let runtimeConn=null,runtimeTimer=null,running=false;
export function ensureLevelSummaryRuntime(conn) {
  runtimeConn=conn;
  if(runtimeTimer)return;
  const tick=async()=>{
    if(running||!runtimeConn?.user)return;
    running=true;
    try{await flushLevelSummaries(runtimeConn);}catch(e){console.error('[LEVEL resumo]',e?.message||e);}finally{running=false;}
  };
  runtimeTimer=setInterval(tick,60000);runtimeTimer.unref?.();
  void tick();
}
