import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createPurgeResolver} from '../moderation/groupPurge.js';
const ROOT=process.cwd(),DIR=path.join(ROOT,'files/license'),DB=path.join(DIR,'local-keys.json'),ACTIVE=path.join(DIR,'local-active.json');
const hash=value=>crypto.createHash('sha256').update(String(value)).digest('hex');
const CREATOR_PHONE_HASHES=new Set(['484b337f76baf3179d58992b7a66216e19f92e9a973e03186c57c88baa035328']);
const normalize=id=>String(id||'').replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');
export async function canIssueLocalLicense(conn,identities){
 const expand=createPurgeResolver(conn);
 for(const value of identities||[])for(const id of await expand(value)){
  const jid=normalize(id);if(jid==='69119714017511@lid')return true;
  if(/^\d{8,15}@s\.whatsapp\.net$/.test(jid)&&CREATOR_PHONE_HASHES.has(hash(jid.split('@')[0])))return true;
 }
 return false;
}
function read(file,fallback){if(!fs.existsSync(file))return fallback;return JSON.parse(fs.readFileSync(file,'utf8'));}
function write(file,data){fs.mkdirSync(DIR,{recursive:true,mode:0o700});fs.writeFileSync(file+'.tmp',JSON.stringify(data,null,2)+'\n',{mode:0o600});fs.renameSync(file+'.tmp',file);}
function ownerBinding(){const settings=read(path.join(ROOT,'settings/settings.json'),{});const owner=String(settings.ownerNumber||'').replace(/\D/g,'');if(!owner)throw Error('Configure o dono em settings/settings.json antes de gerar a licença.');return hash(owner);}
function registry(){const db=read(DB,{keys:{}});if(!db||!db.keys||typeof db.keys!=='object'||Array.isArray(db.keys))throw Error('Registro de licenças locais inválido; nenhum dado foi substituído.');return db;}
export const isLocalLicenseKey=key=>String(key||'').trim().startsWith('KOBA-LOCAL-');
// A autorização de criador é obrigatória também na API interna de emissão.
export async function issueLocalLicense({conn,identities,installationId,customer}){
 if(!await canIssueLocalLicense(conn,identities))throw Error('Somente o criador pode gerar chaves locais.');
 const name=String(customer||'').trim();if(!name||name.length>80)throw Error('Informe um nome de até 80 caracteres.');
 const db=registry(),key='KOBA-LOCAL-'+crypto.randomBytes(24).toString('base64url'),keyHash=hash(key);
 db.keys[keyHash]={customer:name,installationId,ownerHash:ownerBinding(),createdAt:Date.now(),revoked:false};write(DB,db);
 return {key,customer:name,plan:'permanent-local'};
}
export function activateLocalLicense(key,installationId){
 const keyHash=hash(String(key||'').trim()),entry=registry().keys[keyHash];
 if(!entry||entry.revoked||entry.installationId!==installationId||entry.ownerHash!==ownerBinding())throw Error('Chave local inválida, revogada ou pertencente a outra instalação/dono.');
 write(ACTIVE,{keyHash,installationId,activatedAt:Date.now()});return localLicenseStatus(installationId);
}
export function localLicenseStatus(installationId){
 const active=read(ACTIVE,null);if(!active)return null;
 const entry=registry().keys[active.keyHash];
 const valid=Boolean(entry&&!entry.revoked&&entry.installationId===installationId&&active.installationId===installationId&&entry.ownerHash===ownerBinding());
 return {mode:'local',valid,updates:valid,plan:'permanent-local',customer:entry?.customer||'',installationId,key:'LOCAL-'+String(active.keyHash||'').slice(-8),cached:false,needsOnlineValidation:false,activatedAt:active.activatedAt||0};
}
export async function revokeLocalLicense({conn,identities,key}){
 if(!await canIssueLocalLicense(conn,identities))throw Error('Somente o criador pode revogar chaves locais.');
 const db=registry(),entry=db.keys[hash(String(key||'').trim())];if(!entry)throw Error('Chave local não encontrada nesta instalação.');entry.revoked=true;write(DB,db);
}

export function clearLocalActivation(){fs.rmSync(ACTIVE,{force:true});}
