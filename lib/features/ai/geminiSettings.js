import fs from 'node:fs';
import path from 'node:path';
export function createGeminiSettings(file=path.resolve('settings/gemini.json')){
 if(!fs.existsSync(file)){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  try{fs.writeFileSync(file,JSON.stringify({apiKey:''},null,2)+'\n',{flag:'wx',mode:0o600});}catch(error){if(error.code!=='EEXIST')throw error;}
 }
 return env=>{
  if(String(env.GEMINI_API_KEY||'').trim())return String(env.GEMINI_API_KEY).trim();
  const data=JSON.parse(fs.readFileSync(file,'utf8'));
  return typeof data.apiKey==='string'?data.apiKey.trim():'';
 };
}
