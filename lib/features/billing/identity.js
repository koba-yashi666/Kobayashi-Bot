import {canonical} from './storage.js';
// Somente aliases do AUTOR autenticado, fornecidos pelo roteador, podem migrar um LID.
// Não consulta menções, respostas, encaminhamentos nem assume que o criador pagou todos os grupos.
export function alignBillingIdentity({owner,identities=[],store,rentals}){
 if(!/^\d{8,15}@s\.whatsapp\.net$/.test(owner))return;
 const lids=new Set(identities.map(canonical).filter(id=>/^\d+@lid$/.test(id)));
 if(!lids.size)return;
 const db=rentals.read();let changed=false;
 for(const r of Object.values(db.groups||{}))if(lids.has(canonical(r.responsibleJid))){r.responsibleLid ||= canonical(r.responsibleJid);r.responsibleJid=owner;changed=true;}
 if(changed)rentals.write(db);
 const billing=store.read();let update=false;billing.identityAliases ||= {};
 for(const lid of lids)if(billing.identityAliases[lid]!==owner){billing.identityAliases[lid]=owner;update=true;}
 for(const o of Object.values(billing.orders||{}))if(lids.has(canonical(o.owner))){o.ownerLid ||= canonical(o.owner);o.owner=owner;update=true;}
 for(const s of Object.values(billing.sessions||{}))if(lids.has(canonical(s.owner))){s.owner=owner;update=true;}
 for(const lid of lids)if(billing.profiles?.[lid]){billing.profiles[owner]={...billing.profiles[lid],...(billing.profiles[owner]||{})};delete billing.profiles[lid];update=true;}
 if(update)store.write(billing);
}
