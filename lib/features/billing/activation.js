import crypto from 'node:crypto';
import {canonical,billingOwner,PLANS} from './storage.js';
import {CODE_TTL,CODE_PATTERN,normalizeActivationCode,assertActivationCode,reservedGroups} from './activationCodes.js';
export const ACTIVATION_COMMANDS=['entrar','gerarcodigo','meuscodigos','ativarbot','ativarcodigo'];
export function createActivationService({store,engine,clock=Date.now}){
 const joining=new Set(),attempts=new Map();
 const remaining=o=>Math.max(0,o.quantity-Object.keys(engine.applied(o.id)).length);
 function codeForVerified(order){
  const o=engine.owned(order.id,order.owner);
  if(o.status!=='approved'||o.simulated||o.sandbox||o.groups.length)throw Error('Somente contratação real aprovada gera código de ativação.');
  if(!remaining(o))throw Error('Todas as vagas deste pedido já foram ativadas.');
  if(o.activationCode&&o.activationCode.expiresAt>clock())return o;
  const entry={code:'KBA-'+crypto.randomBytes(12).toString('hex').toUpperCase(),at:clock(),expiresAt:clock()+CODE_TTL};
  store.update(d=>{const current=d.orders[o.id];if(current.status!=='approved'||current.simulated||current.sandbox)throw Error('Pagamento não está aprovado.');current.activationCode=entry;current.automaticActivation=true;});
  return engine.owned(o.id,o.owner);
 }
 async function issue(id,owner){const o=engine.owned(id,owner);if(o.simulated||o.sandbox||o.groups.length)throw Error('Pedido de teste ou renovação não gera código para novos grupos.');return codeForVerified(await engine.verify(id,owner));}
 function find(code,owner){
  const value=normalizeActivationCode(code);if(!CODE_PATTERN.test(value))throw Error('Use o código KBA recebido no privado após o pagamento.');
  const o=Object.values(store.read().orders).find(o=>canonical(o.owner)===canonical(owner)&&o.activationCode?.code===value);
  assertActivationCode(o,value,owner,clock());return o;
 }
 function rate(owner){
  const now=clock();for(const [key,list]of attempts)if(list.every(t=>now-t>=60000))attempts.delete(key);
  const rows=(attempts.get(owner)||[]).filter(t=>now-t<60000);if(rows.length>=6)throw Error('Aguarde um minuto antes de tentar novamente.');rows.push(now);attempts.set(owner,rows);
 }
 async function enter({owner,code,link,conn}){
  rate(owner);const match=/^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9_-]{6,100})(?:\?[^\s#]*)?$/.exec(link||'');if(!match)throw Error('Use /entrar LINK_DO_GRUPO CODIGO com um convite válido do WhatsApp.');
  let order;
  if(code)order=find(code,owner);
  else{const rows=Object.values(store.read().orders).filter(o=>o.owner===canonical(owner)&&o.status==='approved'&&!o.sandbox&&!o.simulated&&!o.groups.length&&remaining(o)>0);if(rows.length!==1)throw Error('Informe o código do pedido: /entrar LINK CODIGO. Consulte /meuscodigos.');order=await issue(rows[0].id,owner);code=order.activationCode.code;}
  // Não consultar convites antes de autorizar o pedido pago.
  const checked=await engine.verify(order.id,owner);if(checked.status!=='approved')throw Error('Pagamento ainda não aprovado pela API.');
  const meta=await conn.groupGetInviteInfo(match[1]);if(!/^\d+(?:-\d+)?@g\.us$/.test(meta?.id||''))throw Error('O convite não identificou um grupo válido.');
  const jid=meta.id,key=order.id+':'+jid;if(joining.has(key))throw Error('Entrada em processamento. Aguarde.');joining.add(key);
  try{
   const reserved=await engine.reserveEntry(order.id,owner,code,jid,crypto.createHash('sha256').update(match[1]).digest('hex'));
   if(reserved.activated)return {jid,activated:true,order};
   const ids=[conn.user?.id,conn.user?.lid,conn.user?.phoneNumber].filter(Boolean).map(canonical);
   let present=false;
   try{const current=await conn.groupMetadata(jid);present=current.id===jid&&current.participants?.some(p=>[p.id,p.jid,p.phoneNumber,p.lid].some(v=>v&&ids.includes(canonical(v))));}catch{}
   if(!present){
    // A tentativa é persistida ANTES do envio. Resposta inconclusiva não repete a entrada.
    const reservation=engine.owned(order.id,owner).entryReservations?.[jid];
    if(reservation?.state==='requested')return {jid,pending:true,order};
    store.update(d=>{d.orders[order.id].entryReservations[jid].state='requested';});
    try{await conn.groupAcceptInvite(match[1]);}catch{throw Error('Não foi possível confirmar a entrada. A vaga permanece reservada para este grupo; confira solicitações e aceite a Kobayashi antes de tentar novamente.');}
    try{const current=await conn.groupMetadata(jid);present=current.id===jid&&current.participants?.some(p=>[p.id,p.jid,p.phoneNumber,p.lid].some(v=>v&&ids.includes(canonical(v))));}catch{}
   }
   if(present)store.update(d=>{d.orders[order.id].entryReservations[jid].state='joined';});
   return {jid,pending:!present,order};
  }finally{joining.delete(key);}
 }
 async function handle(ctx){
  const {command,q='',from,sender,conn,reply,prefix='/',isGroup}=ctx;if(!ACTIVATION_COMMANDS.includes(command))return false;
  const identities=ctx.identities||[sender],owner=billingOwner(sender,identities),args=q.trim().split(/\s+/).filter(Boolean);
  try{
   if(command==='ativarbot'||command==='ativarcodigo'){
    if(!isGroup)throw Error('Use /ativarbot CODIGO dentro do grupo, após adicionar o bot.');
    rate(owner);const o=find(args[0],owner),result=await engine.activateByCode(o.id,owner,args[0],from,identities,conn);
    const r=ctx.rentals.read().groups[from];
    await conn.sendMessage(from,{text:`✅ *KOBAYASHI ATIVADA*\nPlano: ${PLANS[o.days]?.name||o.days+' dias'} • ${o.days} dias\nResponsável: @${String(sender).split('@')[0]}\nVencimento: ${new Date(r.expiresAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}\nVagas utilizadas: ${result.used}/${result.quantity}\nPromova o bot a ADM para ativar as funções de moderação.\nAvisos de 7 dias, 3 dias e vencimento; sem renovação, saída após duas horas.`,mentions:[sender]},ctx.info?{quoted:ctx.info}:undefined);return true;
   }
   if(isGroup)throw Error('Consulte códigos e solicite entrada no privado da Kobayashi.');
   if(command==='meuscodigos'){
    const rows=Object.values(store.read().orders).filter(o=>o.owner===owner&&!o.sandbox&&!o.simulated&&!o.groups.length&&o.status==='approved'&&remaining(o)>0);
    await ctx.send(rows.map(o=>`Pedido: ${o.id}\nPlano: ${o.days} dias • Vagas restantes: ${remaining(o)}\nGrupos reservados: ${reservedGroups(o).length}\n${o.activationCode?.expiresAt>clock()?'Código: '+o.activationCode.code:'Código ainda não gerado ou vencido.'}`).join('\n\n')||'Nenhuma contratação aprovada com vaga disponível.',rows.slice(0,8).map(o=>['🔑 Código '+o.id.slice(0,8),`${prefix}gerarcodigo ${o.id}`]));return true;
   }
   if(command==='gerarcodigo'){
    rate(owner);let id=args[0];if(!id){const rows=Object.values(store.read().orders).filter(o=>o.owner===owner&&o.status==='approved'&&!o.sandbox&&!o.simulated&&!o.groups.length&&remaining(o)>0);if(rows.length!==1)throw Error('Use /gerarcodigo ID ou /meuscodigos para escolher o pedido.');id=rows[0].id;}
    const o=await issue(id,owner);await ctx.send(codeInstructions(o,prefix),[['🏘️ Meus planos',prefix+'meuplano']],{copy:`${prefix}ativarbot ${o.activationCode.code}`,copyLabel:'📋 Copiar ativação'});return true;
   }
   if(command==='entrar'){
    const result=await enter({owner,link:args[0],code:args[1],conn});
    await reply(result.activated?'✅ Este grupo já foi ativado por este pedido. Nenhum prazo foi duplicado.':result.pending?'⏳ A entrada ainda não foi confirmada. Aceite a solicitação do bot no grupo. A vaga está reservada. Depois, use /ativarbot CODIGO no grupo.':`✅ Entrada confirmada. No grupo, o responsável deve enviar:\n${prefix}ativarbot ${result.order.activationCode.code}\nDepois promova a Kobayashi a ADM.`);return true;
   }
  }catch(e){await reply('⚠️ '+String(e.message||'Falha na operação.').slice(0,400));return true;}
  return true;
 }
 return {handle,issue,codeForVerified,find,enter,remaining};
}
export function codeInstructions(o,prefix='/'){
 return `🔑 *CÓDIGO DE ATIVAÇÃO*\nPedido: ${o.id}\nPlano: ${PLANS[o.days]?.name||o.days+' dias'} • ${o.days} dias\nGrupos pagos: ${o.quantity}\nCódigo: ${o.activationCode.code}\nVálido até ${new Date(o.activationCode.expiresAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}\n\n1. No privado: ${prefix}entrar LINK_DO_GRUPO ${o.activationCode.code}\n2. Após a entrada, no grupo: ${prefix}ativarbot ${o.activationCode.code}\n3. Promova o bot a ADM.\n\nVocê também pode adicionar o bot manualmente e usar o código no grupo. Só o responsável pelo pagamento pode ativar. O prazo começa na ativação; cada grupo usa uma vaga. Código vencido: ${prefix}gerarcodigo ${o.id}`;
}
