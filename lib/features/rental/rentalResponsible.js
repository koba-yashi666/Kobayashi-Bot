import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "files", "database", "alugueis.json");
const DAY = 24 * 60 * 60 * 1000;
let runtimeStarted = false;
let runtimeConn = null;
let runtimeTimer = null;

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return { settings:{}, groups:{} };
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    db.groups = db.groups && typeof db.groups === "object" ? db.groups : {};
    return db;
  } catch { return { settings:{}, groups:{} }; }
}
function writeDb(db) {
  fs.mkdirSync(path.dirname(DB_PATH), {recursive:true});
  const tmp=`${DB_PATH}.responsible.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db,null,2), "utf8");
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
// Avisos e saída unificados em rentalSystem.js, inclusive contratos antigos.
export function ensureRentalResponsibleRuntime(conn) {}
