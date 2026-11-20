import crypto from 'node:crypto';
import {canonical} from './storage.js';
export const normalizeReferral=value=>String(value||'').trim().toUpperCase();
export function referralForOrder(db,code,owner,groups=[]){
 if(!code)return null;
 const item=db.referralCodes?.[normalizeReferral(code)];
 if(!item||item.disabled)throw Error('Código de indicação inválido ou desativado.');
 if(groups.length)throw Error('Indicação vale para uma nova contratação, não para renovação.');
 if([item.owner,item.createdBy].map(canonical).includes(canonical(owner)))throw Error('Não é permitido indicar a si mesmo.');
 if(Object.values(db.orders||{}).some(o=>o.owner===canonical(owner)&&!o.sandbox&&!o.simulated&&o.status==='approved'))throw Error('Indicação exclusiva da primeira contratação do responsável.');
 return {code:item.code,groupJid:item.groupJid,owner:item.owner,days:20};
}
export function issueReferral({store,groupJid,owner,actor,clock=Date.now}){
 if(!String(groupJid).endsWith('@g.us')||!canonical(owner).endsWith('@s.whatsapp.net'))throw Error('Cadastre o telefone do responsável pelo aluguel antes de gerar a indicação.');
 const existing=Object.values(store.read().referralCodes||{}).find(r=>r.groupJid===groupJid&&!r.disabled);
 if(existing){if(existing.owner!==canonical(owner))throw Error('Código vinculado ao responsável anterior. Peça ao criador para revisar o cadastro.');return existing;}
 const code='KOBA'+crypto.randomBytes(5).toString('hex').toUpperCase();const item={code,groupJid,owner:canonical(owner),createdBy:canonical(actor),at:clock()};
 store.update(d=>{d.referralCodes ||= {};d.referralCodes[code]=item});return item;
}
