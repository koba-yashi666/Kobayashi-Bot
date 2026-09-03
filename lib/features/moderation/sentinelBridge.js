import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CONFIG_PATH = path.join(process.cwd(), "files", "database", "sentinel-bridge.json");
const LOG_PATH = path.join(process.cwd(), "files", "database", "sentinel-bridge-log.json");
const MAX_BODY = 256 * 1024;
const EVENT_MAX_AGE = 2 * 60 * 1000;
const DEDUPE_TTL = 10 * 60 * 1000;

let server = null;
let runtime = { conn: null, ownerJids: [], isWhitelisted: () => false };
let runtimeStatus = {
  listening: false,
  received: 0,
  accepted: 0,
  rejected: 0,
  removals: 0,
  lastEventAt: 0,
  lastError: "",
  address: ""
};
const seen = new Map();

function atomicWrite(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

function defaultConfig() {
  return {
    enabled: true,
    host: "127.0.0.1",
    port: 3333,
    secret: crypto.randomBytes(32).toString("hex"),
    removeOnSuspicious: true,
    notifyGroup: true,
    notifyOwner: true,
    whatsappEnabled: true,
    sentinelNumber: "",
    testMode: true
  };
}

export function getSentinelBridgeConfig() {
  try {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
    if (!fs.existsSync(CONFIG_PATH)) atomicWrite(CONFIG_PATH, defaultConfig());
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return { ...defaultConfig(), ...raw, secret: raw.secret || defaultConfig().secret };
  } catch (e) {
    console.error("Erro config Sentinel Bridge:", e?.message || e);
    return defaultConfig();
  }
}

function saveConfig(cfg) { atomicWrite(CONFIG_PATH, cfg); }

export function setSentinelBridgeEnabled(enabled) {
  const cfg = getSentinelBridgeConfig(); cfg.enabled = Boolean(enabled); saveConfig(cfg); return cfg;
}

export function setSentinelWhatsAppNumber(number) {
  const cfg = getSentinelBridgeConfig();
  cfg.sentinelNumber = String(number || "").replace(/\D/g, "");
  saveConfig(cfg);
  return cfg;
}

export function setSentinelBridgeTestMode(enabled) {
  const cfg = getSentinelBridgeConfig();
  cfg.testMode = Boolean(enabled);
  saveConfig(cfg);
  return cfg;
}

export function rotateSentinelBridgeSecret() {
  const cfg = getSentinelBridgeConfig();
  cfg.secret = crypto.randomBytes(32).toString("hex");
  saveConfig(cfg);
  return cfg.secret;
}

function addLog(entry) {
  let rows=[];
  try { rows=JSON.parse(fs.readFileSync(LOG_PATH,"utf8")); } catch {}
  if (!Array.isArray(rows)) rows=[];
  rows.push({ timestamp: Date.now(), ...entry });
  if (rows.length > 300) rows = rows.slice(-300);
  try { atomicWrite(LOG_PATH, rows); } catch {}
}

export function getSentinelBridgeLogs(limit=10) {
  try {
    const rows=JSON.parse(fs.readFileSync(LOG_PATH,"utf8"));
    return Array.isArray(rows) ? rows.slice(-Math.max(1,Math.min(50,Number(limit)||10))).reverse() : [];
  } catch { return []; }
}

export function configureSentinelBridgeRuntime(conn, opts={}) {
  runtime = {
    conn: conn || runtime.conn,
    ownerJids: Array.isArray(opts.ownerJids) ? opts.ownerJids.filter(Boolean) : runtime.ownerJids,
    isWhitelisted: typeof opts.isWhitelisted === "function" ? opts.isWhitelisted : runtime.isWhitelisted
  };
}

function safeEqualHex(a,b) {
  try {
    const aa=Buffer.from(String(a||""),"hex"), bb=Buffer.from(String(b||""),"hex");
    return aa.length===bb.length && aa.length>0 && crypto.timingSafeEqual(aa,bb);
  } catch { return false; }
}

function verify(secret, raw, signature) {
  const expected=crypto.createHmac("sha256",secret).update(raw).digest("hex");
  return safeEqualHex(expected, signature);
}

function pruneSeen() {
  const now=Date.now();
  for (const [k,ts] of seen) if (now-ts>DEDUPE_TTL) seen.delete(k);
}

function idsForParticipant(p={}) {
  return [...new Set([p.id,p.jid,p.participant,p.phoneNumber,p.lid].filter(Boolean).map(String))];
}

function sameIdentity(value, candidate) {
  if (!value || !candidate) return false;
  const a=String(value), b=String(candidate);
  if (a===b) return true;
  if (a.includes("@lid") || b.includes("@lid")) return false;
  return a.split(":")[0].split("@")[0] === b.split(":")[0].split("@")[0];
}

function findParticipant(metadata,event) {
  const wanted=[event.senderJid,event.senderLid,event.senderRaw].filter(Boolean);
  return (metadata?.participants||[]).find(p => idsForParticipant(p).some(id => wanted.some(w => sameIdentity(id,w)))) || null;
}

function ownerMatches(participant) {
  const ids=idsForParticipant(participant);
  return runtime.ownerJids.some(owner => ids.some(id => sameIdentity(id,owner)));
}

function whitelisted(groupJid, participant) {
  const ids=idsForParticipant(participant);
  return ids.some(id => {
    try { return Boolean(runtime.isWhitelisted(groupJid,id)); } catch { return false; }
  });
}

async function notifyOwner(text, mentions=[]) {
  const conn=runtime.conn;
  if (!conn) return;
  for (const jid of runtime.ownerJids) {
    await conn.sendMessage(jid,{text,mentions}).catch(()=>{});
  }
}

export async function handleSentinelEvent(event) {
  const cfg=getSentinelBridgeConfig();
  const conn=runtime.conn;
  if (!cfg.enabled) throw Object.assign(new Error("bridge_disabled"),{status:503});
  if (!conn) throw Object.assign(new Error("executor_not_ready"),{status:503});
  if (event?.source!=="kobayashi-sentinel-core" || event?.type!=="message_detected") throw Object.assign(new Error("invalid_event"),{status:400});
  if (!String(event.groupJid||"").endsWith("@g.us") || !event.messageId) throw Object.assign(new Error("invalid_group_or_message"),{status:400});
  if (Math.abs(Date.now()-Number(event.timestamp||0))>EVENT_MAX_AGE) throw Object.assign(new Error("stale_event"),{status:409});
  if (!event.suspicious || !Array.isArray(event.reasons) || !event.reasons.length) throw Object.assign(new Error("not_suspicious"),{status:422});

  pruneSeen();
  const key=`${event.groupJid}:${event.messageId}`;
  if (seen.has(key)) return {ok:true,deduped:true};
  seen.set(key,Date.now());

  const metadata=await conn.groupMetadata(event.groupJid);
  const participant=findParticipant(metadata,event);
  if (!participant) throw Object.assign(new Error("participant_not_found"),{status:404});

  const target=participant.id || participant.jid || participant.participant || participant.phoneNumber || participant.lid;
  const mention=participant.phoneNumber || participant.id || target;
  const targetNumber=String(mention||target).split("@")[0];

  if (participant.admin || ownerMatches(participant) || whitelisted(event.groupJid,participant)) {
    addLog({action:"protected",groupJid:event.groupJid,target,reasons:event.reasons,messageId:event.messageId});
    return {ok:true,protected:true};
  }

  const botId=String(conn?.user?.id||"").split(":")[0]+"@s.whatsapp.net";
  const botParticipant=(metadata?.participants||[]).find(p=>idsForParticipant(p).some(id=>sameIdentity(id,botId)));
  if (!botParticipant?.admin) throw Object.assign(new Error("executor_not_admin"),{status:409});

  let removed=false;
  if (cfg.removeOnSuspicious && !cfg.testMode) {
    await conn.groupParticipantsUpdate(event.groupJid,[target],"remove");
    removed=true;
    runtimeStatus.removals++;
  }

  const reasons=event.reasons.join(" • ");
  if (cfg.notifyGroup) {
    await conn.sendMessage(event.groupJid,{
      text:`🛰️🐉 *KOBAYASHI SENTINEL*\n\n👤 @${targetNumber}\n🚨 Detectado pela conta observadora: *${reasons}*\n${removed?"🔨 Membro removido pela Kobayashi ADM.":"⚠️ Evento registrado sem remoção."}`,
      mentions:[mention||target]
    }).catch(()=>{});
  }
  if (cfg.notifyOwner) {
    await notifyOwner(
      `╭━━〔 🛰️ *SENTINEL BRIDGE* 〕━━╮\n`+
      `┃ 👥 Grupo: ${metadata?.subject||event.groupJid}\n`+
      `┃ 👤 Alvo: @${targetNumber}\n`+
      `┃ 🆔 LID: ${event.senderLid||participant.lid||"não disponível"}\n`+
      `┃ 🚨 Motivo: ${reasons}\n`+
      `┃ 📨 ID: ${event.messageId}\n`+
      `┃ 🔨 Resultado: ${removed?"removido":"registrado"}\n`+
      `╰━━━━━━━━━━━━━━━━━━━━╯`,
      [mention||target]
    );
  }

  addLog({action:removed?"removed":"detected",groupJid:event.groupJid,target,senderLid:event.senderLid||participant.lid||null,reasons:event.reasons,messageId:event.messageId,text:String(event.text||"").slice(0,500)});
  return {ok:true,removed,target};
}

function normalizeNumberJid(value) {
  const number = String(value || "").split(":")[0].split("@")[0].replace(/\D/g, "");
  return number ? `${number}@s.whatsapp.net` : "";
}

export async function processSentinelWhatsAppMessage({ text, senderJid }) {
  const marker = "KOBAYASHI_SENTINEL_V1";
  if (!String(text || "").startsWith(`${marker}\n`)) return { handled: false };

  runtimeStatus.received++;
  runtimeStatus.lastEventAt = Date.now();

  try {
    const cfg = getSentinelBridgeConfig();
    if (!cfg.enabled || !cfg.whatsappEnabled) throw Object.assign(new Error("whatsapp_bridge_disabled"), { status: 503 });
    if (!cfg.sentinelNumber) throw Object.assign(new Error("sentinel_number_not_configured"), { status: 403 });
    if (normalizeNumberJid(senderJid) !== normalizeNumberJid(cfg.sentinelNumber)) {
      throw Object.assign(new Error("unauthorized_sentinel_number"), { status: 403 });
    }

    const lines = String(text).trim().split("\n");
    if (lines.length !== 3) throw Object.assign(new Error("invalid_envelope"), { status: 400 });
    const payload64 = lines[1];
    const signature = lines[2];
    if (!verify(cfg.secret, payload64, signature)) throw Object.assign(new Error("bad_signature"), { status: 401 });

    const event = JSON.parse(Buffer.from(payload64, "base64url").toString("utf8"));
    if (event?.source !== "kobayashi-sentinel-core") throw Object.assign(new Error("invalid_source"), { status: 400 });
    if (Math.abs(Date.now() - Number(event.timestamp || 0)) > EVENT_MAX_AGE) {
      throw Object.assign(new Error("stale_event"), { status: 409 });
    }

    if (event.type === "heartbeat") {
      runtimeStatus.accepted++;
      runtimeStatus.lastError = "";
      addLog({ action: "heartbeat", transport: "whatsapp", sentinel: senderJid });
      await runtime.conn?.sendMessage(senderJid, { text: `KOBAYASHI_SENTINEL_ACK ${event.messageId || Date.now()}` }).catch(() => {});
      return { handled: true, ok: true, heartbeat: true };
    }

    const result = await handleSentinelEvent(event);
    runtimeStatus.accepted++;
    runtimeStatus.lastError = "";
    return { handled: true, ...result };
  } catch (e) {
    runtimeStatus.rejected++;
    runtimeStatus.lastError = e?.message || String(e);
    addLog({ action: "rejected_whatsapp", reason: runtimeStatus.lastError, senderJid });
    return { handled: true, ok: false, error: runtimeStatus.lastError };
  }
}

function json(res,status,obj) {
  const body=JSON.stringify(obj);
  res.writeHead(status,{"content-type":"application/json; charset=utf-8","content-length":Buffer.byteLength(body)});
  res.end(body);
}

export function ensureSentinelBridgeServer() {
  if (server) return server;
  const cfg=getSentinelBridgeConfig();
  if (!cfg.enabled) return null;

  server=http.createServer((req,res)=>{
    if (req.method==="GET" && req.url==="/sentinel/health") return json(res,200,{ok:true,service:"kobayashi-sentinel-bridge",version:"0.7.0"});
    if (req.method!=="POST" || req.url!=="/sentinel/event") return json(res,404,{ok:false,error:"not_found"});

    let size=0, chunks=[];
    req.on("data",chunk=>{
      size+=chunk.length;
      if (size>MAX_BODY) { res.destroy(); return; }
      chunks.push(chunk);
    });
    req.on("end",async()=>{
      runtimeStatus.received++; runtimeStatus.lastEventAt=Date.now();
      try {
        const raw=Buffer.concat(chunks).toString("utf8");
        const current=getSentinelBridgeConfig();
        if (!verify(current.secret,raw,req.headers["x-kobayashi-signature"])) {
          runtimeStatus.rejected++; addLog({action:"rejected",reason:"bad_signature"});
          return json(res,401,{ok:false,error:"bad_signature"});
        }
        const event=JSON.parse(raw);
        const result=await handleSentinelEvent(event);
        runtimeStatus.accepted++;
        return json(res,200,result);
      } catch (e) {
        runtimeStatus.rejected++; runtimeStatus.lastError=e?.message||String(e);
        addLog({action:"error",reason:runtimeStatus.lastError});
        return json(res,Number(e?.status)||500,{ok:false,error:runtimeStatus.lastError});
      }
    });
  });

  server.on("error",e=>{ runtimeStatus.lastError=e?.message||String(e); runtimeStatus.listening=false; console.error("Sentinel Bridge:",runtimeStatus.lastError); });
  server.listen(Number(cfg.port)||3333,String(cfg.host||"127.0.0.1"),()=>{
    runtimeStatus.listening=true;
    runtimeStatus.address=`http://${cfg.host}:${cfg.port}`;
    console.log(`🛰️ Sentinel Bridge ouvindo em ${runtimeStatus.address}`);
  });
  return server;
}

export function getSentinelBridgeStatus() {
  const cfg=getSentinelBridgeConfig();
  return {...runtimeStatus,enabled:cfg.enabled,host:cfg.host,port:cfg.port,secret:cfg.secret,whatsappEnabled:cfg.whatsappEnabled,sentinelNumber:cfg.sentinelNumber,testMode:cfg.testMode};
}
