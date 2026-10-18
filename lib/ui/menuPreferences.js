import fs from 'node:fs';
import path from 'node:path';

const file=()=>path.join(process.cwd(),'files','database','menu-preferences.json');
export function menuButtonsEnabled(){
  if(!fs.existsSync(file()))return true;
  const data=JSON.parse(fs.readFileSync(file(),'utf8'));
  return data.buttonsEnabled!==false;
}
export function setMenuButtonsEnabled(enabled,by){
  if(typeof enabled!=='boolean')throw new TypeError('Estado do menu inválido');
  const target=file();fs.mkdirSync(path.dirname(target),{recursive:true});
  const data=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):{};
  data.buttonsEnabled=enabled;data.updatedBy=by;data.updatedAt=new Date().toISOString();
  fs.writeFileSync(target+'.tmp',JSON.stringify(data,null,2)+'\n');
  fs.renameSync(target+'.tmp',target);return enabled;
}
