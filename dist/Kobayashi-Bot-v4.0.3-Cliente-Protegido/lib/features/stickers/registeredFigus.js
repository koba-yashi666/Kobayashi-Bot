/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import { createHash } from "\x6e\x6f\x64\x65\x3a\x63\x72\x79\x70\x74\x6f";

const DB_PATH = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x72\x67\x66\x69\x67\x75\x73\x2e\x6a\x73\x6f\x6e");
const MEDIA_DIR = path.join(process.cwd(), "\x6d\x65\x64\x69\x61", "\x72\x67\x66\x69\x67\x75");

function ensureStorage(){
  fs.mkdirSync(path.dirname(DB_PATH), {recursive:true});
  fs.mkdirSync(MEDIA_DIR, {recursive:true});
  if(!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({commands:{}}, null, 2), "\x75\x74\x66\x38");
}
function readDb(){
  ensureStorage();
  try{
    const db=JSON.parse(fs.readFileSync(DB_PATH,"\x75\x74\x66\x38"));
    db.commands ||= {};
    return db;
  }catch{
    return {commands:{}};
  }
}
function writeDb(db){
  ensureStorage();
  fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2), "\x75\x74\x66\x38");
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
  if(!key || !Buffer.isBuffer(buffer) || !buffer.length) return {ok:false, reason:"\x69\x6e\x76\x61\x6c\x69\x64"};
  ensureStorage();
  const db=readDb();
  const old=db.commands[key];
  const digest=createHash("\x73\x68\x61\x32\x35\x36").update(buffer).digest("\x68\x65\x78").slice(0,16);
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
