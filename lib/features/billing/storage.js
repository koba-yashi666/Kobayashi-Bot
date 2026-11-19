import fs from 'node:fs';
import path from 'node:path';
export function jsonStore(file,initial){
 return {read(){if(!fs.existsSync(file))return structuredClone(initial);const value=JSON.parse(fs.readFileSync(file,'utf8'));if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Banco inválido; arquivo preservado.');return value;},write(value){fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(value,null,2),{mode:0o600});fs.renameSync(tmp,file);},update(fn){const db=this.read();const result=fn(db);this.write(db);return result;}};
}
export const configStore=jsonStore(path.join(process.cwd(),'settings/mercadopago.json'),{mode:'off',groupNotices:true});
export const asaasConfigStore=jsonStore(path.join(process.cwd(),'settings/asaas.json'),{mode:'off',environment:'sandbox',groupNotices:true});
export const billingStore=jsonStore(path.join(process.cwd(),'files/database/billing.json'),{orders:{},sessions:{},profiles:{},notices:{}});
export const DAY=86400000,GRACE=7200000;
export const PLANS=Object.freeze({15:{name:'Plano Inicial',days:15,cents:1700},30:{name:'Plano Popular',days:30,cents:2500},60:{name:'Plano Premium',days:60,cents:4500},90:{name:'Plano Supremo',days:90,cents:6700}});
export const money=cents=>(cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export const canonical=id=>String(id||'').replace(/:\d+(?=@)/,'');
export const isCreator=ids=>(ids||[]).some(id=>canonical(id)==='5515997075304@s.whatsapp.net');
export function price(days,quantity){if(!PLANS[days]||!Number.isInteger(quantity)||quantity<1||quantity>50)throw Error('Escolha um plano válido e de 1 a 50 grupos.');return PLANS[days].cents*quantity;}
