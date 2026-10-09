import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export function isLegacyReleaseFile(name) {
 return /^README-v\d+(?:\.\d+)+(?:[-_][\w-]+)?\.txt$/i.test(name)
   || /^Kobayashi-Bot-v\d+(?:\.\d+)+(?:[-_][\w-]+)?\.zip$/i.test(name);
}
export function cleanupLegacyReleases(root=process.cwd()) {
 // Apenas arquivos regulares na raiz da base. Nunca percorre outras pastas.
 if(!fs.existsSync(path.join(root,'package.json'))||!fs.existsSync(path.join(root,'index.js')))throw new Error('Raiz da Kobayashi não encontrada.');
 const removed=[],failed=[];
 for(const entry of fs.readdirSync(root,{withFileTypes:true})){
  if(!entry.isFile()||!isLegacyReleaseFile(entry.name))continue;
  try{fs.unlinkSync(path.join(root,entry.name));removed.push(entry.name);}catch(error){failed.push({name:entry.name,error:error.message});}
 }
 if(removed.length)console.log(`[LIMPEZA] ${removed.length} ZIPs/READMEs antigos removidos da raiz.`);
 for(const item of failed)console.warn(`[LIMPEZA] Não foi possível remover ${item.name}: ${item.error}`);
 return {removed,failed};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))cleanupLegacyReleases();
