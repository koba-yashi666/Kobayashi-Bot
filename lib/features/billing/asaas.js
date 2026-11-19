import {createDirectPix} from './pixDirect.js';
import crypto from 'node:crypto';
export const asaasBinding=c=>crypto.createHash('sha256').update(`${c.environment}:${c.token||''}`).digest('hex');
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export async function asaasRequest(config,route,{method='GET',body,fetchImpl=fetch}={}){
 if(!['sandbox','production'].includes(config.environment)||!config.token)throw Error('Configure /asaastoken sandbox CHAVE no privado do criador.');
 if(!/^\/(?:finance\/balance|checkouts(?:\/[a-f0-9-]+\/cancel)?|payments(?:\/[\w-]+)?|pix\/(?:addressKeys|qrCodes\/static(?:\/[\w-]+)?)|sandbox\/payment\/[\w-]+\/confirm)(?:\?[^#]*)?$/.test(route))throw Error('Rota Asaas inválida.');
 if(route.startsWith('/sandbox/')&&config.environment!=='sandbox')throw Error('Simulação proibida em Produção.');
 const root=config.environment==='sandbox'?'https://api-sandbox.asaas.com/v3':'https://api.asaas.com/v3';
 let r;
 try{r=await fetchImpl(root+route,{method,redirect:'error',headers:{access_token:config.token,'User-Agent':'Kobayashi-Bot/5.6.35','Content-Type':'application/json',accept:'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});}catch{throw Error('Asaas: falha de rede ou tempo esgotado. Consulte o pedido; não gere outra cobrança para a mesma compra.');}
 if(!r.ok){const e=Error(`Asaas recusou a operação (HTTP ${r.status}). Confira chave, ambiente e cadastro da conta.`);e.httpStatus=r.status;throw e;}
 try{let raw='';for await(const chunk of r.body){raw+=Buffer.from(chunk).toString('utf8');if(raw.length>1000000)throw Error('large');}return raw?JSON.parse(raw):{};}catch{throw Error('Resposta Asaas inválida ou maior que o limite.');}
}
export function checkoutUrl(id,environment){
 if(!UUID.test(id))throw Error('Identificador de checkout inválido.');
 return `https://${environment==='sandbox'?'sandbox.asaas.com':'asaas.com'}/checkoutSession/show?id=${encodeURIComponent(id)}`;
}
export function checkoutBody(order,returnUrl){
 if(!/^https:\/\/wa\.me\/\d{10,15}$/.test(returnUrl||''))throw Error('Configure /asaasretorno NUMERO_DO_BOT (DDI e DDD).');
 const back=returnUrl+'?text='+encodeURIComponent('/pagamento '+order.id);
 return {billingTypes:['PIX'],chargeTypes:['DETACHED'],minutesToExpire:30,externalReference:order.id,callback:{successUrl:back,cancelUrl:back,expiredUrl:back},items:[{name:`Kobayashi • ${order.days} dias`,description:`Aluguel para ${order.quantity} grupo(s). Pedido ${order.id}`,quantity:1,value:order.cents/100}]};
}
export function matchingAsaasPayment(order,p){
 return Boolean(p&&/^pay_[\w-]+$/.test(p.id||'')&&p.checkoutSession===order.checkoutId&&(!order.paymentId||p.id===order.paymentId)&&p.billingType==='PIX'&&typeof p.value==='number'&&Math.round(p.value*100)===order.cents&&!p.deleted&&!p.chargeback&&!(p.refunds?.length));
}
export function createAsaasProvider({store,config,clock=Date.now,request=asaasRequest}){
 const patch=(o,p)=>store.update(d=>Object.assign(d.orders[o.id],p));
 function credentials(o){const c=config.read();if(c.environment!==o.environment||asaasBinding(c)!==o.binding)throw Error('Chave ou ambiente Asaas mudou. Restaure a chave original para reconciliar este pedido.');return c;}
 const direct=createDirectPix({store,credentials,patch,request,clock});
 async function resume(o){
  if(o.flow==='pix-direct')return direct.resume(o);
  const c=credentials(o);
  if(o.checkoutId)return o;
  // Sem idempotência documentada para POST /checkouts: nunca repetir uma tentativa inconclusiva.
  if(o.creationAttempted)throw Error('Criação Asaas inconclusiva. Não será repetida para evitar cobrança duplicada. O criador deve conferir os logs do Asaas. Pedido: '+o.id);
  const body=checkoutBody(o,c.returnUrl);
  patch(o,{creationAttempted:true});
  try{
   const result=await request(c,'/checkouts',{method:'POST',body});
   const link=checkoutUrl(result.id,o.environment);
   patch(o,{checkoutId:result.id,checkoutUrl:link,status:'pending'});
   return store.read().orders[o.id];
  }catch(e){patch(o,{status:'uncertain'});throw e;}
 }
 async function payment(o){
  const c=credentials(o);
  const list=await request(c,'/payments?checkoutSession='+encodeURIComponent(o.checkoutId)+'&limit=100');
  if(!Array.isArray(list.data)||list.hasMore)throw Error('Lista de pagamentos inválida ou ambígua. Peça ao criador para reconciliar.');
  // Não confiar apenas no filtro: cada resultado deve pertencer exatamente ao checkout e preço.
  if(list.data.some(p=>!matchingAsaasPayment(o,p)))throw Error('Pagamento Asaas incompatível. Nenhum aluguel liberado.');
  if(list.data.length>1)throw Error('Mais de uma cobrança para o checkout. Encaminhe o pedido ao criador.');
  if(!list.data.length)return null;
  const p=await request(c,'/payments/'+encodeURIComponent(list.data[0].id));
  if(!matchingAsaasPayment(o,p)||p.id!==list.data[0].id)throw Error('Detalhes do pagamento Asaas incompatíveis.');
  patch(o,{paymentId:p.id,providerStatus:p.status});return p;
 }
 async function verify(o){
  if(o.flow==='pix-direct')return direct.verify(o);
  if(!o.checkoutId)throw Error('Criação Asaas não confirmada. O criador deve verificar os logs antes de prosseguir.');
  const p=await payment(o);
  if(p?.status==='RECEIVED')patch(o,{status:'approved'});
  else if(p?.status?.includes('REFUND')||p?.status?.includes('CHARGEBACK'))patch(o,{status:'review'});
  else if(o.status!=='cancelled'&&o.status!=='approved')patch(o,{status:clock()>=o.expiresAt?'expired':'pending'});
  return store.read().orders[o.id];
 }
 async function cancel(o){
  if(o.flow==='pix-direct')return direct.cancel(o);
  o=await verify(o);
  if(o.status==='approved')throw Error('Pagamento recebido não pode ser cancelado pelo bot.');
  // Cancelar checkout não garante cancelamento de um Pix já gerado; continuar conciliando.
  await request(credentials(o),'/checkouts/'+o.checkoutId+'/cancel',{method:'POST'});
  patch(o,{cancelRequested:true});return verify(o);
 }
 async function confirmSandbox(o){
  if(o.flow==='pix-direct')return direct.confirmSandbox(o);
  if(o.environment!=='sandbox'||!o.sandbox)throw Error('Confirmação simulada só existe para pedidos Sandbox.');
  const p=await payment(o);if(!p)throw Error('Abra o link Sandbox e preencha os dados de teste para gerar o Pix antes de confirmar. Não pague com dinheiro real.');
  if(p.status!=='RECEIVED')await request(credentials(o),'/sandbox/payment/'+p.id+'/confirm',{method:'POST'});
  return verify(o);
 }
 return {resume,verify,cancel,confirmSandbox};
}
