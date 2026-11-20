import {assertActivationCode,reservedGroups} from './activationCodes.js';
import {referralForOrder} from './referrals.js';
import {createAsaasProvider,asaasBinding} from './asaas.js';
import crypto from 'node:crypto';
import {canonical,price,DAY,PLANS,isCreator} from './storage.js';
import {mpRequest,confirmedPayment,pixBody} from './mercadoPago.js';
export function createBillingEngine({store,config,rentals,request=mpRequest,clock=Date.now,newProvider='mercadopago',asaasConfig,asaasRequest,testRunId=null}){
 const asaas=asaasConfig?createAsaasProvider({store,config:asaasConfig,clock,request:asaasRequest}):null;
 const inflight=new Set();let serial=Promise.resolve();
 const locked=fn=>{const work=serial.then(fn);serial=work.catch(()=>{});return work;};
 function owned(id,owner){const o=store.read().orders[id];if(!o||o.owner!==canonical(owner))throw Error('Pedido não encontrado para esse responsável.');if((o.localTest||null)!==testRunId)throw Error('Pedido de outro ambiente de execução.');return o;}
 function updateOrder(id,patch){store.update(db=>Object.assign(db.orders[id],patch));}
 function leaseGroups(owner){return Object.entries(rentals.read().groups||{}).filter(([,r])=>canonical(r.responsibleJid)===canonical(owner)&&!r.permanent).map(([jid,r])=>({jid,...r}));}
 function applied(id){return rentals.read().billingApplications?.[id]||{};}
 function grant(order,group,batchDb){
  if((order.localTest||null)!==testRunId)throw Error('Contrato de outro ambiente de execução.');
  if(order.sandbox||order.simulated||order.status!=='approved')throw Error('Somente pagamentos reais aprovados liberam aluguel.');
  const db=batchDb||rentals.read();db.billingApplications ||= {};const used=db.billingApplications[order.id]||{};
  if(used[group.jid])return false;
  if(Object.keys(used).length>=order.quantity)throw Error('Todas as vagas deste pagamento já foram utilizadas.');
  const old=db.groups[group.jid];
  if(order.groups.length&&!order.groups.includes(group.jid))throw Error('Grupo fora da seleção paga.');
  if(old?.permanent)throw Error('Esse grupo já tem aluguel permanente.');
  if(old && canonical(old.responsibleJid)!==order.owner)throw Error('Grupo vinculado a outro responsável. Peça ao criador para ajustar o cadastro.');
  const base=Math.max(clock(),Number(old?.expiresAt)||0);
  db.groups[group.jid]={...(old||{}),groupName:group.name||old?.groupName||group.jid,responsibleJid:order.owner,registeredBy:old?.registeredBy||order.owner,renewedBy:order.owner,rentedAt:old?.rentedAt||clock(),expiresAt:base+order.days*DAY,lastRenewedAt:clock(),permanent:false,trial:false,partner:false,bonusDays:0,source:order.provider||'mercadopago',...(order.localTest?{localTest:order.localTest}:{}),planId:({15:1,30:2,60:3,90:4})[order.days],planName:PLANS[order.days].name,baseDays:order.days,price:order.cents/100/order.quantity,status:'active',warningHistory:[],expirationNotified:false,responsibleWarning7d:false,expirationResponsibleNotified:false};
  used[group.jid]=db.groups[group.jid].expiresAt;db.billingApplications[order.id]=used;if(!batchDb)rentals.write(db);return true;
 }
 async function create({owner,days,quantity,groups=[],simulated=false,key,manualActivation=false,referralCode,automaticActivation=false}){
  const activeConfig=newProvider==='asaas'?asaasConfig:config;
  owner=canonical(owner);groups=[...new Set(groups)];let cents=price(days,quantity);
  if(activeConfig.read().prices?.[days])cents=activeConfig.read().prices[days]*quantity;
  if(!Number.isSafeInteger(cents)||cents<=0)throw Error('Preço configurado inválido.');
  if(groups.length&&groups.length!==quantity)throw Error('Seleção de grupos não corresponde à quantidade.');
  const own=new Set(leaseGroups(owner).map(g=>g.jid));if(groups.some(g=>!own.has(g)))throw Error('Seleção contém grupo de outro responsável.');
  const db=store.read();const id=key||crypto.randomUUID();
  if(db.orders[id]){if(db.orders[id].owner!==owner||(db.orders[id].localTest||null)!==testRunId)throw Error('Pedido inválido ou de outro ambiente.');return db.orders[id];}
  if(Object.values(db.orders).filter(o=>o.owner===owner&&['creating','pending','uncertain'].includes(o.status)).length>=3)throw Error('Você já tem três cobranças pendentes. Consulte /meuspagamentos.');
  const referral=referralForOrder(db,referralCode,owner,groups);
  const cfg=activeConfig.read();const sandbox=newProvider==='asaas'&&cfg.environment==='sandbox';
  if(!simulated&&newProvider==='asaas'&&(!cfg.verifiedBinding||cfg.verifiedBinding!==asaasBinding(cfg)))throw Error('Use /asaasteste conexao antes de criar cobranças.');
  if(!simulated&&sandbox&&owner!=='5515997075304@s.whatsapp.net')throw Error('Sandbox exclusiva do criador.');
  if(!simulated&&sandbox&&cfg.mode!=='sandbox')throw Error('Ative /asaasmodo sandbox para testar.');
  if(!simulated&&!sandbox&&cfg.mode!=='production'&&!(cfg.mode==='pilot'&&owner==='5515997075304@s.whatsapp.net'))throw Error('Pagamento real ainda não liberado pelo criador.');
  const email=db.profiles[owner]?.email;
  if(!simulated&&!testRunId&&newProvider!=='asaas'&&!email)throw Error('Cadastre seu e-mail real no privado: /emailpagamento seu@email.com');
  if(!simulated&&newProvider==='asaas'&&Object.values(db.orders).some(o=>o.owner===owner&&o.provider==='asaas'&&!o.simulated&&clock()-o.createdAt<15000))throw Error('Aguarde 15 segundos antes de gerar outro pedido.');
  const order={provider:newProvider,...(newProvider==='asaas'?{sandbox,environment:cfg.environment,binding:asaasBinding(cfg),...(cfg.directPixBinding===asaasBinding(cfg)&&cfg.pixAddressKey?{flow:'pix-direct'}:{})}:{}),id,owner,days,quantity,groups,cents,simulated,...(testRunId?{localTest:testRunId}:{}),...(referral?{referral}:{}),...(manualActivation&&!groups.length?{manualActivation:true}:{}),...(automaticActivation&&!groups.length?{automaticActivation:true}:{}),collector:cfg.collectorId,payerEmail:email,status:'creating',createdAt:clock(),expiresAt:clock()+30*60000};
  store.update(d=>{d.orders[id]=order;});return await resume(order);
 }
 async function resume(order){
  if(testRunId){if(order.localTest!==testRunId)throw Error('Pedido de outro ambiente.');updateOrder(order.id,{status:'pending'});return owned(order.id,order.owner);}
  if(order.simulated){updateOrder(order.id,{status:'pending',paymentId:'SIM-'+order.id});return owned(order.id,order.owner);}
  if(inflight.has(order.id))throw Error('Cobrança em processamento. Aguarde.');inflight.add(order.id);
  try{
   if(order.provider==='asaas')return await asaas.resume(order);
   const cfg=config.read();
   if(cfg.collectorId!==order.collector)throw Error('A conta recebedora mudou. O criador deve reconciliar o pedido antes de continuar.');
   const payment=await request(cfg.token,'/v1/payments',{method:'POST',idempotency:order.id,body:pixBody(order,order.payerEmail)});
   if(!payment.id||payment.external_reference!==order.id)throw Error('Resposta de cobrança inválida.');
   updateOrder(order.id,{paymentId:String(payment.id),collector:cfg.collectorId,status:'pending',qr:payment.point_of_interaction?.transaction_data?.qr_code||'',qrImage:payment.point_of_interaction?.transaction_data?.qr_code_base64||''});
   return owned(order.id,order.owner);
  }finally{inflight.delete(order.id);}
 }
 async function verify(id,owner){
  let order=owned(id,owner);if(testRunId){if(order.status==='cancelled')return order;updateOrder(id,{status:'approved'});order=owned(id,owner);await locked(async()=>{for(const jid of order.groups)grant(order,{jid});});return order;}if(order.simulated)return order;
  if(order.status==='creating')order=await resume(order);
  if(order.provider==='asaas'){
   order=await asaas.verify(order);
   if(order.status==='approved'&&!order.sandbox)await locked(async()=>{for(const jid of order.groups)grant(order,{jid});});
   return order;
  }
  if(order.status==='cancelled')return order;
  const cfg=config.read(),p=await request(cfg.token,'/v1/payments/'+encodeURIComponent(order.paymentId));
  if(confirmedPayment(order,p,order.collector)){
   updateOrder(id,{status:'approved'});order=owned(id,owner);
   await locked(async()=>{for(const jid of order.groups)grant(order,{jid});});
  }else if(['refunded','charged_back'].includes(p.status)){updateOrder(id,{status:'review'});}
  else if(['cancelled','rejected'].includes(p.status))updateOrder(id,{status:'cancelled'});
  else if(clock()>=order.expiresAt&&p.status!=='approved')updateOrder(id,{status:'expired'});
  else if(p.status==='approved')throw Error('Pagamento aprovado com dados incompatíveis. Encaminhe o pedido ao criador.');
  return owned(id,owner);
 }
 async function attach(id,owner,invite,conn){return locked(async()=>{
  const order=owned(id,owner);if(order.status!=='approved'||order.simulated||order.sandbox)throw Error('Pedido sem pagamento real aprovado.');
  if(order.manualActivation)throw Error('A ativação deste pedido será feita pelo criador. Use /pagamento '+id+' para obter o contato e enviar o comprovante.');
  if(order.automaticActivation)throw Error('Este pedido usa código de ativação. Use /gerarcodigo '+id+' no privado e /ativarbot CODIGO no grupo.');
  if(order.groups.length)throw Error('Esse pedido já tem grupos de renovação definidos.');
  if(Object.keys(applied(id)).length>=order.quantity)throw Error('Pedido sem vagas disponíveis.');
  const match=/^https:\/\/chat\.whatsapp\.com\/([\w-]+)(?:\?[^\s]*)?$/.exec(invite);if(!match)throw Error('Envie o link de convite do grupo.');
  const meta=await conn.groupGetInviteInfo(match[1]);if(!meta?.id?.endsWith('@g.us'))throw Error('Não consegui identificar o grupo.');
  if(applied(id)[meta.id])return meta.id;
  const existing=rentals.read().groups[meta.id];if(existing&&(existing.permanent||canonical(existing.responsibleJid)!==order.owner))throw Error('Esse grupo já está vinculado a outro contrato.');
  const joined=await conn.groupAcceptInvite(match[1]);if(joined!==meta.id)throw Error('Entrada pendente ou não confirmada. Nenhuma vaga foi consumida; tente após aprovação da entrada.');
  grant(order,{jid:meta.id,name:meta.subject});return meta.id;
 });}
 function simulate(id,owner,status){const o=owned(id,owner);if(!o.simulated)throw Error('Pedido real não pode ser aprovado por comando.');if(!['approved','cancelled','expired'].includes(status))throw Error('Estado inválido.');updateOrder(id,{status});return owned(id,owner);}
 async function cancel(id,owner){
  let o=owned(id,owner);
  if(testRunId){if(o.status==='approved')throw Error('Pedido de teste já aprovado.');updateOrder(id,{status:'cancelled'});return owned(id,owner);}
  if(o.simulated)return simulate(id,owner,'cancelled');
  if(o.provider==='asaas')return asaas.cancel(o);
  o=await verify(id,owner);
  if(o.status==='approved')throw Error('Pagamento aprovado não pode ser cancelado por esse comando.');
  if(o.status==='pending'){
   const cfg=config.read();
   const result=await request(cfg.token,'/v1/payments/'+o.paymentId,{method:'PUT',body:{status:'cancelled'}});
   if(result.status==='cancelled')updateOrder(id,{status:'cancelled'});
   else {await verify(id,owner);throw Error('Cancelamento não confirmado. Consulte o pedido novamente.');}
  }
  return owned(id,owner);
 }

 async function activateByCreator(id,identities,groupIds,conn){
  if(!isCreator(identities))throw Error('Ativação exclusiva do criador.');
  return activatePaidGroups(id,groupIds,conn);
 }
 async function activatePaidGroups(id,groupIds,conn,buyer){
  const initial=store.read().orders[id];if(!initial)throw Error('Pedido não encontrado.');
  if(buyer)assertActivationCode(initial,buyer.code,buyer.owner,clock(),testRunId);
  if(initial.simulated||initial.sandbox||initial.groups.length)throw Error('Selecione uma contratação real de novos grupos.');
  const order=await verify(id,initial.owner);if(order.status!=='approved')throw Error('Pagamento ainda não aprovado pela API.');
  const ids=[...new Set(groupIds)];if(!ids.length||ids.length>order.quantity||ids.some(j=>!/^\d+(?:-\d+)?@g\.us$/.test(j)))throw Error('Selecione grupos válidos dentro da quantidade paga.');
  const botIds=[conn.user?.id,conn.user?.lid,conn.user?.phoneNumber].filter(Boolean).map(canonical);
  const groups=[];
  for(const jid of ids){const meta=await conn.groupMetadata(jid);
   if(meta?.id!==jid||!meta.participants?.some(p=>[p.id,p.jid,p.phoneNumber,p.lid].some(v=>v&&botIds.includes(canonical(v)))))throw Error('Adicione o bot ao grupo antes de ativar: '+jid);
   if(buyer&&!meta.participants.some(p=>[p.id,p.jid,p.phoneNumber,p.lid].some(v=>v&&buyer.identities.map(canonical).includes(canonical(v)))))throw Error('O responsável pelo pagamento precisa participar deste grupo para ativar.');
   groups.push({jid,name:String(meta.subject||jid).replace(/[\r\n]/g,' ').slice(0,120)});
  }
  return locked(async()=>{
   const current=owned(id,order.owner);if(current.status!=='approved'||current.sandbox||current.simulated)throw Error('Pedido deixou de estar aprovado.');
   if(buyer){assertActivationCode(current,buyer.code,buyer.owner,clock(),testRunId);const occupied=new Set([...Object.keys(applied(id)),...reservedGroups(current),...ids]);if(occupied.size>current.quantity)throw Error('As vagas disponíveis já estão reservadas para outros grupos.');}
   const db=rentals.read();for(const group of groups){grant(current,group,db);if(buyer){const lid=buyer.identities.map(canonical).find(j=>/^\d+@lid$/.test(j));if(lid)db.groups[group.jid].responsibleLid=lid;}}
   rentals.write(db);
   store.update(d=>{const o=d.orders[id];o.activationBy=buyer?buyer.owner:'5515997075304@s.whatsapp.net';o.activationAt=clock();for(const jid of ids)if(o.entryReservations)delete o.entryReservations[jid];});
   return {order:owned(id,order.owner),used:Object.keys(applied(id)).length,quantity:order.quantity};
  });
 }
 async function reserveEntry(id,owner,code,jid,inviteHash){
  const initial=owned(id,owner);assertActivationCode(initial,code,owner,clock(),testRunId);
  const checked=await verify(id,owner);if(checked.status!=='approved')throw Error('Pagamento não está aprovado pela API.');
  return locked(async()=>{
   const o=owned(id,owner);assertActivationCode(o,code,owner,clock(),testRunId);if(o.status!=='approved')throw Error('Pagamento não está aprovado.');
   if(!/^\d+(?:-\d+)?@g\.us$/.test(jid))throw Error('Grupo inválido.');
   if(applied(id)[jid])return {activated:true};
   const current=rentals.read().groups[jid];if(current&&(current.permanent||canonical(current.responsibleJid)!==o.owner))throw Error('Grupo permanente ou vinculado a outro responsável.');
   const occupied=new Set([...Object.keys(applied(id)),...reservedGroups(o),jid]);if(occupied.size>o.quantity)throw Error('Todas as vagas pagas estão ativadas ou reservadas. Consulte /meuscodigos.');
   store.update(d=>{const r=d.orders[id];r.entryReservations ||= {};r.entryReservations[jid] ||= {at:clock(),state:'reserved'};r.entryReservations[jid].inviteHash=inviteHash;});
   return {activated:false,reservation:owned(id,owner).entryReservations[jid]};
  });
 }
 async function activateByCode(id,owner,code,jid,identities,conn){
  return activatePaidGroups(id,[jid],conn,{owner:canonical(owner),code,identities:[owner,...identities].filter(Boolean)});
 }
 async function confirmSandbox(id,owner){const o=owned(id,owner);if(canonical(owner)!=='5515997075304@s.whatsapp.net'||o.provider!=='asaas')throw Error('Teste exclusivo do criador.');return asaas.confirmSandbox(o);}
 return {activateByCode,reserveEntry,activateByCreator,confirmSandbox,create,verify,attach,simulate,cancel,owned,leaseGroups,applied,grant};
}
