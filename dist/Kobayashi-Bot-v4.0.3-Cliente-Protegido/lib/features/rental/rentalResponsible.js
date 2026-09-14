/* Kobayashi Protected Distribution v4.0.3 */
import fs from "fs";
import path from "\x70\x61\x74\x68";

const DB_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x61\x6c\x75\x67\x75\x65\x69\x73\x2e\x6a\x73\x6f\x6e");
const DAY = 24 * 60 * 60 * 1000;
let runtimeStarted = false;
let runtimeConn = null;
let runtimeTimer = null;

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return { settings:{}, groups:{} };
    const db = JSON.parse(fs.readFileSync(DB_PATH, "\x75\x74\x66\x38"));
    db.groups = db.groups && typeof db.groups === "\x6f\x62\x6a\x65\x63\x74" ? db.groups : {};
    return db;
  } catch { return { settings:{}, groups:{} }; }
}
function writeDb(db) {
  fs.mkdirSync(path.dirname(DB_PATH), {recursive:true});
  const tmp=`${DB_PATH}.responsible.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db,null,2), "\x75\x74\x66\x38");
  fs.renameSync(tmp,DB_PATH);
}
export function setRentalResponsible(groupJid, responsibleJid) {
  const db=readDb();
  if(!db.groups[groupJid]) return null;
  db.groups[groupJid].responsibleJid=responsibleJid;
  db.groups[groupJid].responsibleSetAt=Date.now();
  db.groups[groupJid].responsibleWarning7d=false;
  writeDb(db);
  return db.groups[groupJid];
}
export function resetRentalResponsibleWarning(groupJid) {
  const db=readDb();
  if(!db.groups[groupJid]) return null;
  db.groups[groupJid].responsibleWarning7d=false;
  db.groups[groupJid].expirationResponsibleNotified=false;
  writeDb(db);
  return db.groups[groupJid];
}
export function getRentalResponsible(groupJid) {
  return readDb().groups?.[groupJid]?.responsibleJid || null;
}
async function tick() {
  const conn=runtimeConn;
  if(!conn?.user) return;
  const db=readDb(), now=Date.now();
  let changed=false;
  for(const [groupJid,rental] of Object.entries(db.groups||{})){
    if(!rental || rental.permanent || !rental.expiresAt || !rental.responsibleJid) continue;
    const remaining=Number(rental.expiresAt)-now;
    const responsible=rental.responsibleJid;
    if(remaining>0 && remaining<=7*DAY && !rental.responsibleWarning7d){
      await conn.sendMessage(groupJid,{
        text:`⚠️🐉 *ALUGUEL • 1 SEMANA RESTANTE*\n\n👤 @${String(responsible).split("@")[0]}, você é o responsável pelo aluguel do Kobayashi Bot neste grupo.\n\n⌛ O aluguel vence em aproximadamente *${Math.max(1,Math.ceil(remaining/DAY))} dia(s)*.\n📅 Vencimento: *${new Date(Number(rental.expiresAt)).toLocaleString("\x70\x74\x2d\x42\x52",{timeZone:"\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f"})}*\n\n♻️ Para continuar usando o bot, solicite a renovação antes do vencimento.`,
        mentions:[responsible]
      }).catch(()=>{});
      rental.responsibleWarning7d=true;
      changed=true;
    }
    if(remaining<=0 && !rental.expirationResponsibleNotified){
      await conn.sendMessage(groupJid,{
        text:`⏳🐉 *ALUGUEL ENCERRADO*\n\n👤 @${String(responsible).split("@")[0]}, o aluguel do Kobayashi Bot venceu.\n\n🔒 Os comandos deste grupo foram bloqueados.\n👑 A partir de agora, somente o dono principal do bot pode usar comandos até que o aluguel seja renovado.`,
        mentions:[responsible]
      }).catch(()=>{});
      rental.expirationResponsibleNotified=true;
      changed=true;
    }
  }
  if(changed) writeDb(db);
}
export function ensureRentalResponsibleRuntime(conn){
  runtimeConn=conn||runtimeConn;
  if(runtimeStarted) return;
  runtimeStarted=true;
  tick().catch(()=>{});
  runtimeTimer=setInterval(()=>tick().catch(()=>{}),5*60*1000);
  runtimeTimer?.unref?.();
}
