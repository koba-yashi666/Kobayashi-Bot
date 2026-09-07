import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const DB_PATH = path.join(process.cwd(), "files", "database", "rgfigus.json");
const MEDIA_DIR = path.join(process.cwd(), "media", "rgfigu");

function ensureStorage(){
  fs.mkdirSync(path.dirname(DB_PATH), {recursive:true});
  fs.mkdirSync(MEDIA_DIR, {recursive:true});
  if(!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({commands:{}}, null, 2), "utf8");
}
function readDb(){
  ensureStorage();
  try{
    const db=JSON.parse(fs.readFileSync(DB_PATH,"utf8"));
    db.commands ||= {};
    return db;
  }catch{
    return {commands:{}};
  }
}
function writeDb(db){
  ensureStorage();
  fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2), "utf8");
}
export function normalizeRgfCommand(value=""){
  return String(value||"").trim().toLowerCase().replace(/^\/+/,"").split(/\s+/)[0].replace(/[^a-z0-9_\-À-ÿ]/gi,"");
}
export function hasRegisteredFigu(command){
  const key=normalizeRgfCommand(command);
  if(!key) return false;
  const row=readDb().commands[key];
  return Boolean(row?.file && fs.existsSync(path.join(MEDIA_DIR,row.file)));
}
export function getRegisteredFigu(command){
  const key=normalizeRgfCommand(command);
  if(!key) return null;
  const row=readDb().commands[key];
  if(!row?.file) return null;
  const filePath=path.join(MEDIA_DIR,row.file);
  if(!fs.existsSync(filePath)) return null;
  try{return {command:key, buffer:fs.readFileSync(filePath), ...row};}catch{return null;}
}
export function registerFigu(command, buffer, by=null){
  const key=normalizeRgfCommand(command);
  if(!key || !Buffer.isBuffer(buffer) || !buffer.length) return {ok:false, reason:"invalid"};
  ensureStorage();
  const db=readDb();
  const old=db.commands[key];
  const digest=createHash("sha256").update(buffer).digest("hex").slice(0,16);
  const file=`${key}-${digest}.webp`;
  fs.writeFileSync(path.join(MEDIA_DIR,file), buffer);
  if(old?.file && old.file!==file){
    try{fs.unlinkSync(path.join(MEDIA_DIR,old.file));}catch{}
  }
  db.commands[key]={file,by:by||null,updatedAt:new Date().toISOString()};
  writeDb(db);
  return {ok:true,command:key,file};
}
export function removeRegisteredFigu(command){
  const key=normalizeRgfCommand(command);
  const db=readDb();
  const row=db.commands[key];
  if(!row) return false;
  if(row.file){try{fs.unlinkSync(path.join(MEDIA_DIR,row.file));}catch{}}
  delete db.commands[key];
  writeDb(db);
  return true;
}
export function listRegisteredFigus(){
  const db=readDb();
  return Object.entries(db.commands).map(([command,row])=>({command,...row}));
}
