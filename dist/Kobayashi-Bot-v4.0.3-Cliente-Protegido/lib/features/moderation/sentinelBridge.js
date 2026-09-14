/* Kobayashi Protected Distribution v4.0.3 */
import http from "\x6e\x6f\x64\x65\x3a\x68\x74\x74\x70";
import crypto from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const CONFIG_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x62\x72\x69\x64\x67\x65\x2e\x6a\x73\x6f\x6e");
const LOG_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x62\x72\x69\x64\x67\x65\x2d\x6c\x6f\x67\x2e\x6a\x73\x6f\x6e");
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
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "\x75\x74\x66\x38");
  fs.renameSync(tmp, file);
}

function defaultConfig() {
  return {
    enabled: true,
    host: "\x31\x32\x37\x2e\x30\x2e\x30\x2e\x31",
    port: 3333,
    secret: crypto.randomBytes(32).toString("\x68\x65\x78"),
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
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "\x75\x74\x66\x38"));
    return { ...defaultConfig(), ...raw, secret: raw.secret || defaultConfig().secret };
  } catch (e) {
    console.error("\x45\x72\x72\x6f\x20\x63\x6f\x6e\x66\x69\x67\x20\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x42\x72\x69\x64\x67\x65\x3a", e?.message || e);
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
  cfg.secret = crypto.randomBytes(32).toString("\x68\x65\x78");
  saveConfig(cfg);
  return cfg.secret;
}

function addLog(entry) {
  let rows=[];
  try { rows=JSON.parse(fs.readFileSync(LOG_PATH,"\x75\x74\x66\x38")); } catch {}
  if (!Array.isArray(rows)) rows=[];
  rows.push({ timestamp: Date.now(), ...entry });
  if (rows.length > 300) rows = rows.slice(-300);
  try { atomicWrite(LOG_PATH, rows); } catch {}
}

export function getSentinelBridgeLogs(limit=10) {
  try {
    const rows=JSON.parse(fs.readFileSync(LOG_PATH,"\x75\x74\x66\x38"));
    return Array.isArray(rows) ? rows.slice(-Math.max(1,Math.min(50,Number(limit)||10))).reverse() : [];
  } catch { return []; }
}

export function configureSentinelBridgeRuntime(conn, opts={}) {
  runtime = {
    conn: conn || runtime.conn,
    ownerJids: Array.isArray(opts.ownerJids) ? opts.ownerJids.filter(Boolean) : runtime.ownerJids,
    isWhitelisted: typeof opts.isWhitelisted === "\x66\x75\x6e\x63\x74\x69\x6f\x6e" ? opts.isWhitelisted : runtime.isWhitelisted
  };
}

function safeEqualHex(a,b) {
  try {
    const aa=Buffer.from(String(a||""),"\x68\x65\x78"), bb=Buffer.from(String(b||""),"\x68\x65\x78");
    return aa.length===bb.length && aa.length>0 && crypto.timingSafeEqual(aa,bb);
  } catch { return false; }
}

function verify(secret, raw, signature) {
  const expected=crypto.createHmac("\x73\x68\x61\x32\x35\x36",secret).update(raw).digest("\x68\x65\x78");
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
  if (a.includes("\x40\x6c\x69\x64") || b.includes("\x40\x6c\x69\x64")) return false;
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
  if (!cfg.enabled) throw Object.assign(new Error("\x62\x72\x69\x64\x67\x65\x5f\x64\x69\x73\x61\x62\x6c\x65\x64"),{status:503});
  if (!conn) throw Object.assign(new Error("\x65\x78\x65\x63\x75\x74\x6f\x72\x5f\x6e\x6f\x74\x5f\x72\x65\x61\x64\x79"),{status:503});
  if (event?.source!=="\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x63\x6f\x72\x65" || event?.type!=="\x6d\x65\x73\x73\x61\x67\x65\x5f\x64\x65\x74\x65\x63\x74\x65\x64") throw Object.assign(new Error("\x69\x6e\x76\x61\x6c\x69\x64\x5f\x65\x76\x65\x6e\x74"),{status:400});
  if (!String(event.groupJid||"").endsWith("\x40\x67\x2e\x75\x73") || !event.messageId) throw Object.assign(new Error("\x69\x6e\x76\x61\x6c\x69\x64\x5f\x67\x72\x6f\x75\x70\x5f\x6f\x72\x5f\x6d\x65\x73\x73\x61\x67\x65"),{status:400});
  if (Math.abs(Date.now()-Number(event.timestamp||0))>EVENT_MAX_AGE) throw Object.assign(new Error("\x73\x74\x61\x6c\x65\x5f\x65\x76\x65\x6e\x74"),{status:409});
  if (!event.suspicious || !Array.isArray(event.reasons) || !event.reasons.length) throw Object.assign(new Error("\x6e\x6f\x74\x5f\x73\x75\x73\x70\x69\x63\x69\x6f\x75\x73"),{status:422});

  pruneSeen();
  const key=`${event.groupJid}:${event.messageId}`;
  if (seen.has(key)) return {ok:true,deduped:true};
  seen.set(key,Date.now());

  const metadata=await conn.groupMetadata(event.groupJid);
  const participant=findParticipant(metadata,event);
  if (!participant) throw Object.assign(new Error("\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74\x5f\x6e\x6f\x74\x5f\x66\x6f\x75\x6e\x64"),{status:404});

  const target=participant.id || participant.jid || participant.participant || participant.phoneNumber || participant.lid;
  const mention=participant.phoneNumber || participant.id || target;
  const targetNumber=String(mention||target).split("@")[0];

  if (participant.admin || ownerMatches(participant) || whitelisted(event.groupJid,participant)) {
    addLog({action:"\x70\x72\x6f\x74\x65\x63\x74\x65\x64",groupJid:event.groupJid,target,reasons:event.reasons,messageId:event.messageId});
    return {ok:true,protected:true};
  }

  const botId=String(conn?.user?.id||"").split(":")[0]+"\x40\x73\x2e\x77\x68\x61\x74\x73\x61\x70\x70\x2e\x6e\x65\x74";
  const botParticipant=(metadata?.participants||[]).find(p=>idsForParticipant(p).some(id=>sameIdentity(id,botId)));
  if (!botParticipant?.admin) throw Object.assign(new Error("\x65\x78\x65\x63\x75\x74\x6f\x72\x5f\x6e\x6f\x74\x5f\x61\x64\x6d\x69\x6e"),{status:409});

  let removed=false;
  if (cfg.removeOnSuspicious && !cfg.testMode) {
    await conn.groupParticipantsUpdate(event.groupJid,[target],"\x72\x65\x6d\x6f\x76\x65");
    removed=true;
    runtimeStatus.removals++;
  }

  const reasons=event.reasons.join("\x20\u2022\x20");
  if (cfg.notifyGroup) {
    await conn.sendMessage(event.groupJid,{
      text:`🛰️🐉 *KOBAYASHI SENTINEL*\n\n👤 @${targetNumber}\n🚨 Detectado pela conta observadora: *${reasons}*\n${removed?"\ud83d\x20\x4d\x65\x6d\x62\x72\x6f\x20\x72\x65\x6d\x6f\x76\x69\x64\x6f\x20\x70\x65\x6c\x61\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x41\x44\x4d\x2e":"\u26a0\ufe0f\x20\x45\x76\x65\x6e\x74\x6f\x20\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f\x20\x73\x65\x6d\x20\x72\x65\x6d\x6f\xe7\xe3\x6f\x2e"}`,
      mentions:[mention||target]
    }).catch(()=>{});
  }
  if (cfg.notifyOwner) {
    await notifyOwner(
      `╭━━〔 🛰️ *SENTINEL BRIDGE* 〕━━╮\n`+
      `┃ 👥 Grupo: ${metadata?.subject||event.groupJid}\n`+
      `┃ 👤 Alvo: @${targetNumber}\n`+
      `┃ 🆔 LID: ${event.senderLid||participant.lid||"\x6e\xe3\x6f\x20\x64\x69\x73\x70\x6f\x6e\xed\x76\x65\x6c"}\n`+
      `┃ 🚨 Motivo: ${reasons}\n`+
      `┃ 📨 ID: ${event.messageId}\n`+
      `┃ 🔨 Resultado: ${removed?"\x72\x65\x6d\x6f\x76\x69\x64\x6f":"\x72\x65\x67\x69\x73\x74\x72\x61\x64\x6f"}\n`+
      `╰━━━━━━━━━━━━━━━━━━━━╯`,
      [mention||target]
    );
  }

  addLog({action:removed?"\x72\x65\x6d\x6f\x76\x65\x64":"\x64\x65\x74\x65\x63\x74\x65\x64",groupJid:event.groupJid,target,senderLid:event.senderLid||participant.lid||null,reasons:event.reasons,messageId:event.messageId,text:String(event.text||"").slice(0,500)});
  return {ok:true,removed,target};
}

function normalizeNumberJid(value) {
  const number = String(value || "").split(":")[0].split("@")[0].replace(/\D/g, "");
  return number ? `${number}@s.whatsapp.net` : "";
}

export async function processSentinelWhatsAppMessage({ text, senderJid }) {
  const marker = "\x4b\x4f\x42\x41\x59\x41\x53\x48\x49\x5f\x53\x45\x4e\x54\x49\x4e\x45\x4c\x5f\x56\x31";
  if (!String(text || "").startsWith(`${marker}\n`)) return { handled: false };

  runtimeStatus.received++;
  runtimeStatus.lastEventAt = Date.now();

  try {
    const cfg = getSentinelBridgeConfig();
    if (!cfg.enabled || !cfg.whatsappEnabled) throw Object.assign(new Error("\x77\x68\x61\x74\x73\x61\x70\x70\x5f\x62\x72\x69\x64\x67\x65\x5f\x64\x69\x73\x61\x62\x6c\x65\x64"), { status: 503 });
    if (!cfg.sentinelNumber) throw Object.assign(new Error("\x73\x65\x6e\x74\x69\x6e\x65\x6c\x5f\x6e\x75\x6d\x62\x65\x72\x5f\x6e\x6f\x74\x5f\x63\x6f\x6e\x66\x69\x67\x75\x72\x65\x64"), { status: 403 });
    if (normalizeNumberJid(senderJid) !== normalizeNumberJid(cfg.sentinelNumber)) {
      throw Object.assign(new Error("\x75\x6e\x61\x75\x74\x68\x6f\x72\x69\x7a\x65\x64\x5f\x73\x65\x6e\x74\x69\x6e\x65\x6c\x5f\x6e\x75\x6d\x62\x65\x72"), { status: 403 });
    }

    const lines = String(text).trim().split("\n");
    if (lines.length !== 3) throw Object.assign(new Error("\x69\x6e\x76\x61\x6c\x69\x64\x5f\x65\x6e\x76\x65\x6c\x6f\x70\x65"), { status: 400 });
    const payload64 = lines[1];
    const signature = lines[2];
    if (!verify(cfg.secret, payload64, signature)) throw Object.assign(new Error("\x62\x61\x64\x5f\x73\x69\x67\x6e\x61\x74\x75\x72\x65"), { status: 401 });

    const event = JSON.parse(Buffer.from(payload64, "\x62\x61\x73\x65\x36\x34\x75\x72\x6c").toString("\x75\x74\x66\x38"));
    if (event?.source !== "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x63\x6f\x72\x65") throw Object.assign(new Error("\x69\x6e\x76\x61\x6c\x69\x64\x5f\x73\x6f\x75\x72\x63\x65"), { status: 400 });
    if (Math.abs(Date.now() - Number(event.timestamp || 0)) > EVENT_MAX_AGE) {
      throw Object.assign(new Error("\x73\x74\x61\x6c\x65\x5f\x65\x76\x65\x6e\x74"), { status: 409 });
    }

    if (event.type === "\x68\x65\x61\x72\x74\x62\x65\x61\x74") {
      runtimeStatus.accepted++;
      runtimeStatus.lastError = "";
      addLog({ action: "\x68\x65\x61\x72\x74\x62\x65\x61\x74", transport: "\x77\x68\x61\x74\x73\x61\x70\x70", sentinel: senderJid });
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
    addLog({ action: "\x72\x65\x6a\x65\x63\x74\x65\x64\x5f\x77\x68\x61\x74\x73\x61\x70\x70", reason: runtimeStatus.lastError, senderJid });
    return { handled: true, ok: false, error: runtimeStatus.lastError };
  }
}

function json(res,status,obj) {
  const body=JSON.stringify(obj);
  res.writeHead(status,{"\x63\x6f\x6e\x74\x65\x6e\x74\x2d\x74\x79\x70\x65":"\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e\x3b\x20\x63\x68\x61\x72\x73\x65\x74\x3d\x75\x74\x66\x2d\x38","\x63\x6f\x6e\x74\x65\x6e\x74\x2d\x6c\x65\x6e\x67\x74\x68":Buffer.byteLength(body)});
  res.end(body);
}

export function ensureSentinelBridgeServer() {
  if (server) return server;
  const cfg=getSentinelBridgeConfig();
  if (!cfg.enabled) return null;

  server=http.createServer((req,res)=>{
    if (req.method==="\x47\x45\x54" && req.url==="\x2f\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2f\x68\x65\x61\x6c\x74\x68") return json(res,200,{ok:true,service:"\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2d\x62\x72\x69\x64\x67\x65",version:"\x30\x2e\x37\x2e\x30"});
    if (req.method!=="\x50\x4f\x53\x54" || req.url!=="\x2f\x73\x65\x6e\x74\x69\x6e\x65\x6c\x2f\x65\x76\x65\x6e\x74") return json(res,404,{ok:false,error:"\x6e\x6f\x74\x5f\x66\x6f\x75\x6e\x64"});

    let size=0, chunks=[];
    req.on("\x64\x61\x74\x61",chunk=>{
      size+=chunk.length;
      if (size>MAX_BODY) { res.destroy(); return; }
      chunks.push(chunk);
    });
    req.on("\x65\x6e\x64",async()=>{
      runtimeStatus.received++; runtimeStatus.lastEventAt=Date.now();
      try {
        const raw=Buffer.concat(chunks).toString("\x75\x74\x66\x38");
        const current=getSentinelBridgeConfig();
        if (!verify(current.secret,raw,req.headers["\x78\x2d\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x73\x69\x67\x6e\x61\x74\x75\x72\x65"])) {
          runtimeStatus.rejected++; addLog({action:"\x72\x65\x6a\x65\x63\x74\x65\x64",reason:"\x62\x61\x64\x5f\x73\x69\x67\x6e\x61\x74\x75\x72\x65"});
          return json(res,401,{ok:false,error:"\x62\x61\x64\x5f\x73\x69\x67\x6e\x61\x74\x75\x72\x65"});
        }
        const event=JSON.parse(raw);
        const result=await handleSentinelEvent(event);
        runtimeStatus.accepted++;
        return json(res,200,result);
      } catch (e) {
        runtimeStatus.rejected++; runtimeStatus.lastError=e?.message||String(e);
        addLog({action:"\x65\x72\x72\x6f\x72",reason:runtimeStatus.lastError});
        return json(res,Number(e?.status)||500,{ok:false,error:runtimeStatus.lastError});
      }
    });
  });

  server.on("\x65\x72\x72\x6f\x72",e=>{ runtimeStatus.lastError=e?.message||String(e); runtimeStatus.listening=false; console.error("\x53\x65\x6e\x74\x69\x6e\x65\x6c\x20\x42\x72\x69\x64\x67\x65\x3a",runtimeStatus.lastError); });
  server.listen(Number(cfg.port)||3333,String(cfg.host||"\x31\x32\x37\x2e\x30\x2e\x30\x2e\x31"),()=>{
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
