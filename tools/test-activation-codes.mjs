import assert from 'node:assert/strict';
import {createBillingEngine} from '../lib/features/billing/engine.js';
import {createActivationService} from '../lib/features/billing/activation.js';
import {CODE_TTL} from '../lib/features/billing/activationCodes.js';
import {asaasBinding} from '../lib/features/billing/asaas.js';
import {billingOwner,DAY} from '../lib/features/billing/storage.js';
import {alignBillingIdentity} from '../lib/features/billing/identity.js';
const memory=x=>{let d=structuredClone(x);return {read:()=>structuredClone(d),write(v){d=structuredClone(v)},update(fn){fn(d)}}};
let now=Date.now(),state='RECEIVED',post=0,lookups=0,metadata=0;const owner='5511999999999@s.whatsapp.net',lid='999999@lid',other='5511888888888@s.whatsapp.net',bot='5511000000000@s.whatsapp.net';
const cfg={token:'OFFLINE-ONLY',environment:'production'},asaasConfig=memory(cfg),config=memory({}),rentals=memory({groups:{}}),store=memory({orders:{},profiles:{},sessions:{},notices:{}});
const base={id:'paid',provider:'asaas',flow:'pix-direct',environment:'production',binding:asaasBinding(cfg),pixQrCodeId:'qr_activation_123',status:'approved',createdAt:now,expiresAt:now+1800000,owner,days:30,cents:5000,quantity:2,groups:[],automaticActivation:true};store.update(d=>d.orders.paid=structuredClone(base));
const request=async(c,route)=>{const p={id:'pay_activation',pixQrCodeId:base.pixQrCodeId,value:50,billingType:'PIX',status:state};return route.includes('?')?{data:[p],hasMore:false}:p;};
const makeEngine=()=>createBillingEngine({store,config,rentals,newProvider:'asaas',asaasConfig,asaasRequest:request,clock:()=>now});let engine=makeEngine();const make=()=>createActivationService({store,engine,clock:()=>now});let service=make();
const groups=new Set(),pending=new Set(['200@g.us']);let failJoin=false,omitOwner=false;
const conn={user:{id:bot},groupGetInviteInfo:async code=>{lookups++;return {id:code.startsWith('first')?'100@g.us':code.startsWith('second')?'200@g.us':'300@g.us'}},groupMetadata:async jid=>{metadata++;if(!groups.has(jid))throw Error('not a member');return {id:jid,subject:'Cliente',participants:[{id:bot},...(omitOwner?[]:[{id:lid,phoneNumber:owner}])]};},groupAcceptInvite:async code=>{post++;if(failJoin)throw Error('network unknown');const jid=code.startsWith('first')?'100@g.us':code.startsWith('second')?'200@g.us':'300@g.us';if(!pending.has(jid))groups.add(jid);return jid;}};
await assert.rejects(service.issue('paid',other),/responsável/);
state='PENDING';await assert.rejects(service.issue('paid',owner),/aprovada/);assert(!store.read().orders.paid.activationCode);state='RECEIVED';
let o=await service.issue('paid',owner);const code=o.activationCode.code;assert.match(code,/^KBA-[A-F0-9]{24}$/);assert.equal(o.activationCode.expiresAt,now+CODE_TTL);assert.equal((await service.issue('paid',owner)).activationCode.code,code);
assert.throws(()=>service.find(code,other),/outro responsável/);
await assert.rejects(service.enter({owner:other,code,link:'https://chat.whatsapp.com/firstGroup',conn}));assert.equal(lookups,0);assert.equal(post,0);
let result=await service.enter({owner,code,link:'https://chat.whatsapp.com/firstGroup',conn});assert.equal(result.pending,false);assert.equal(post,1);assert(!rentals.read().groups['100@g.us']);assert.equal(store.read().orders.paid.entryReservations['100@g.us'].state,'joined');
await service.enter({owner,code,link:'https://chat.whatsapp.com/firstGroup',conn});assert.equal(post,1);
omitOwner=true;await assert.rejects(engine.activateByCode('paid',owner,code,'100@g.us',[owner,lid],conn),/participar/);omitOwner=false;
await engine.activateByCode('paid',owner,code,'100@g.us',[owner,lid],conn);assert.equal(rentals.read().groups['100@g.us'].responsibleJid,owner);assert.equal(rentals.read().groups['100@g.us'].expiresAt,now+30*DAY);assert.equal(Object.keys(engine.applied('paid')).length,1);await assert.rejects(engine.attach('paid',owner,'https://chat.whatsapp.com/thirdGroup',conn),/código de ativação/);
result=await service.enter({owner,code,link:'https://chat.whatsapp.com/secondGroup',conn});assert(result.pending);assert.equal(post,2);await service.enter({owner,code,link:'https://chat.whatsapp.com/secondGroup',conn});assert.equal(post,2);
now+=61000;await assert.rejects(service.enter({owner,code,link:'https://chat.whatsapp.com/thirdGroup',conn}),/vagas/);assert.equal(post,2);
engine=makeEngine();service=make();await service.enter({owner,code,link:'https://chat.whatsapp.com/secondGroup',conn});assert.equal(post,2);
groups.add('200@g.us');await engine.activateByCode('paid',owner,code,'200@g.us',[owner,lid],conn);const expiry=rentals.read().groups['200@g.us'].expiresAt;
await engine.activateByCode('paid',owner,code,'200@g.us',[owner,lid],conn);assert.equal(rentals.read().groups['200@g.us'].expiresAt,expiry);assert.equal(Object.keys(engine.applied('paid')).length,2);assert.equal(Object.keys(store.read().orders.paid.entryReservations).length,0);
await assert.rejects(service.issue('paid',owner),/Todas as vagas/);
// Recibo/refund não pode reutilizar o código para ativar outra vaga.
state='REFUNDED';await assert.rejects(engine.activateByCode('paid',owner,code,'100@g.us',[owner],conn));state='RECEIVED';
// Código vencido exige regeneração após nova consulta; reservas sobrevivem ao vencimento.
store.update(d=>d.orders.more={...base,id:'more',quantity:2,activationCode:{code:'KBA-'+'A'.repeat(24),expiresAt:now-1},entryReservations:{'400@g.us':{state:'requested',at:now}}});
assert.throws(()=>service.find('KBA-'+'A'.repeat(24),owner),/vencido/);o=await service.issue('more',owner);assert.notEqual(o.activationCode.code,'KBA-'+'A'.repeat(24));assert(o.entryReservations['400@g.us']);
// Sandbox e simulações não geram código nem entram em grupos.
for(const flag of ['sandbox','simulated']){store.update(d=>d.orders[flag]={...base,id:flag,[flag]:true});await assert.rejects(service.issue(flag,owner));}
// Migração só usa os aliases do autor; não assume responsável para grupo sem cadastro.
assert.equal(billingOwner(lid,[owner]),owner);rentals.update(d=>{d.groups['700@g.us']={responsibleJid:lid,expiresAt:777};d.groups['800@g.us']={expiresAt:888}});store.update(d=>{d.orders.old={...base,id:'old',owner:lid};d.profiles[lid]={email:'old@example.com'}});
alignBillingIdentity({owner,identities:[lid,owner],store,rentals});assert.equal(rentals.read().groups['700@g.us'].responsibleJid,owner);assert.equal(rentals.read().groups['700@g.us'].expiresAt,777);assert(!rentals.read().groups['800@g.us'].responsibleJid);assert.equal(store.read().orders.old.owner,owner);assert.equal(store.read().profiles[owner].email,'old@example.com');
// Entrada com resposta inconclusiva é reservada e nunca reenviada após reinício.
store.update(d=>d.orders.uncertain={...base,id:'uncertain',quantity:1});o=await service.issue('uncertain',owner);failJoin=true;const postsBefore=post;await assert.rejects(service.enter({owner,code:o.activationCode.code,link:'https://chat.whatsapp.com/thirdGroup',conn}));assert.equal(post,postsBefore+1);service=make();result=await service.enter({owner,code:o.activationCode.code,link:'https://chat.whatsapp.com/thirdGroup',conn});assert(result.pending);assert.equal(post,postsBefore+1);
console.log('Ativação por código: pago/owner, PN+LID, vagas/reservas, bot e responsável no grupo, sem ADM obrigatório, validade, regeneração, reinício, duplicidade, refund, Sandbox e entrada incerta sem repetir OK.');
