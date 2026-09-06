import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "files", "database", "koba-trigger.json");

function ensureDb(){
  fs.mkdirSync(path.dirname(DB_PATH), {recursive:true});
  if(!fs.existsSync(DB_PATH)){
    fs.writeFileSync(DB_PATH, JSON.stringify({groups:{}}, null, 2), "utf8");
  }
}

function readDb(){
  try{
    ensureDb();
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    db.groups ||= {};
    return db;
  }catch{
    return {groups:{}};
  }
}

function writeDb(db){
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export function isKobaTriggerEnabled(groupJid){
  if(!groupJid) return true;
  const db = readDb();
  return db.groups[groupJid]?.enabled !== false;
}

export function setKobaTriggerEnabled(groupJid, enabled, by=null){
  const db = readDb();
  db.groups[groupJid] = {
    ...(db.groups[groupJid] || {}),
    enabled: Boolean(enabled),
    updatedBy: by || null,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  return db.groups[groupJid];
}
