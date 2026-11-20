import crypto from 'node:crypto';
import {canonical,isCreator,DAY,PLANS,money} from './storage.js';
import {issueReferral} from './referrals.js';
const clean=s=>String(s||'').replace(/[\r\n]/g,' ').slice(0,80);
export const MANAGEMENT_COMMANDS=['ativacoes','ativarpedido','indicacao','indicacoes','minhasindicacoes','aprovarindicacao','meuplano'];
export function planText(r,now=Date.now()){
 if(!r)return 'Nenhum aluguel cadastrado para este grupo.';
 if(r.permanent)return `💎 ${clean(r.groupName)}\nAluguel permanente.`;
 const remaining=Math.max(0,Number(r.expiresAt)-now),days=Math.floor(remaining/DAY),hours=Math.floor(remaining%DAY/3600000);
 return `🏘️ ${clean(r.groupName)}\nPlano: ${clean(r.planName||'Prazo personalizado')}\nVencimento: ${new Date(r.expiresAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}\n${remaining?`Restam: ${days} dia(s) e ${hours} hora(s).`:'Prazo vencido; sem renovação, saída após a carência de duas horas.'}\nResponsável: ${r.responsibleJid?'cadastrado':'pendente — peça ao criador para cadastrar'}`;
}
export function createRentalManagement({store,rentals,engine,clock=Date.now}){
 let serial=Promise.resolve();const locked=fn=>{const p=serial.then(fn);serial=p.catch(()=>{});return p};
 const requireCreator=identities=>{if(!isCreator(identities))throw Error('Comando exclusivo do criador.');};
 function activations(){return Object.values(store.read().orders).filter(o=>o.status==='approved'&&!o.sandbox&&!o.simulated&&!o.groups.length&&Object.keys(engine.applied(o.id)).length<o.quantity).sort((a,b)=>a.createdAt-b.createdAt);}
 function referralOrders(){return Object.values(store.read().orders).filter(o=>o.referral&&!o.simulated&&!o.sandbox&&o.status==='approved').sort((a,b)=>b.createdAt-a.createdAt);}
 async function approveReferral(id,identities){
  requireCreator(identities);const initial=store.read().orders[id];if(!initial?.referral||initial.simulated||initial.sandbox)throw Error('Pedido sem indicação real elegível.');
  const o=await engine.verify(id,initial.owner);if(o.status!=='approved')throw Error('Pagamento não aprovado pela API.');
  return locked(async()=>{
   const db=rentals.read();db.referralApplications ||= {};db.referralBuyers ||= {};
   if(db.referralApplications[id])return {already:true,...db.referralApplications[id]};
   const current=store.read().orders[id];if(current?.status!=='approved')throw Error('Pedido não está mais aprovado.');
   if(db.referralBuyers[o.owner])throw Error('Este responsável já gerou bônus por indicação.');
   if(Object.keys(db.billingApplications?.[id]||{}).length!==o.quantity)throw Error('Ative todos os grupos pagos antes de aprovar o bônus.');
   const code=store.read().referralCodes?.[o.referral.code];
   if(!code||code.disabled||code.owner!==o.referral.owner||code.groupJid!==o.referral.groupJid)throw Error('Indicação alterada ou desativada; revise o cadastro.');
   if([code.owner,code.createdBy].map(canonical).includes(o.owner))throw Error('Autoindicação bloqueada.');
   if(Object.values(store.read().orders).some(x=>x.id!==id&&x.owner===o.owner&&!x.simulated&&!x.sandbox&&x.status==='approved'&&(x.createdAt<o.createdAt||(x.createdAt===o.createdAt&&x.id<id))))throw Error('O pedido não é a primeira contratação do responsável.');
   const r=db.groups?.[code.groupJid];if(!r||r.permanent||canonical(r.responsibleJid)!==code.owner)throw Error('Grupo indicado sem contrato temporário e responsável correspondente. Cadastre ou revise antes.');
   if(Object.keys(db.billingApplications[id]).includes(code.groupJid)||canonical(r.responsibleJid)===o.owner)throw Error('O comprador não pode receber o próprio bônus.');
   const days=20;r.expiresAt=Math.max(clock(),Number(r.expiresAt)||0)+days*DAY;r.bonusDays=(Number(r.bonusDays)||0)+days;r.status='active';r.warningHistory=[];r.expirationNotified=false;r.responsibleWarning7d=false;r.expirationResponsibleNotified=false;
   const applied={groupJid:code.groupJid,days,expiresAt:r.expiresAt,at:clock(),by:'5515997075304@s.whatsapp.net'};
   db.referralApplications[id]=applied;db.referralBuyers[o.owner]=id;rentals.write(db);return {already:false,...applied};
  });
 }
 async function handle(ctx){
  const {command,q='',from,sender,conn,reply,prefix='/',isGroup}=ctx;if(!MANAGEMENT_COMMANDS.includes(command))return false;
  const owner=canonical(sender),identities=ctx.identities||[owner],creator=isCreator(identities),args=q.trim().split(/\s+/).filter(Boolean),send=ctx.send;
  try{
   if(['ativacoes','ativarpedido','indicacoes','aprovarindicacao'].includes(command)){requireCreator(identities);if(isGroup)throw Error('Gerencie pedidos e pagamentos no privado.');}
   if(command==='meuplano'){
    if(isGroup){const r=rentals.read().groups[from];await reply(planText(r,clock())+(r&&!r.permanent?`\nPara renovar, fale com a Kobayashi no privado e use ${prefix}renovar.`:''));}
    else{const rows=Object.entries(rentals.read().groups||{}).filter(([,r])=>canonical(r.responsibleJid)===owner);await send(rows.map(([,r])=>planText(r,clock())).join('\n\n')||'Nenhum aluguel vinculado a você.',[['♻️ Renovar / alterar plano',prefix+'renovar']]);}return true;
   }
   if(command==='indicacao'){
    const db=rentals.read(),page=args[0]==='pagina'?Math.max(0,Number(args[1])||0):0;let jid=isGroup?from:(args[0]==='pagina'?null:args[0]);
    if(!jid){const rows=Object.entries(db.groups||{}).filter(([,r])=>canonical(r.responsibleJid)===owner&&!r.permanent);await send('🎁 Selecione o grupo que receberá 20 dias de bônus por indicação aprovada.',[...rows.slice(page*6,page*6+6).map(([id,r])=>[clean(r.groupName||id),prefix+'indicacao '+id]),...(rows.length>(page+1)*6?[['➡️ Próxima',`${prefix}indicacao pagina ${page+1}`]]:[])]);return true;}
    const r=db.groups[jid];if(!r||r.permanent)throw Error('O grupo precisa ter um aluguel temporário cadastrado.');
    if(isGroup&&!creator&&!ctx.isGroupAdmins&&canonical(r.responsibleJid)!==owner)throw Error('Somente ADM, responsável ou criador pode gerar o código.');
    if(!isGroup&&!creator&&canonical(r.responsibleJid)!==owner)throw Error('Grupo vinculado a outro responsável.');
    const item=issueReferral({store,groupJid:jid,owner:r.responsibleJid,actor:owner,clock});
    await reply(`🎁 *INDIQUE A KOBAYASHI*\nGrupo: ${clean(r.groupName||jid)}\nCódigo: *${item.code}*\n\nA pessoa deve iniciar no privado do bot:\n${prefix}alugar ${item.code}\n\nApós a primeira contratação paga, ativação e aprovação do criador, este grupo recebe 20 dias extras. O código não dá desconto. Autoindicação e bônus repetido do mesmo comprador não são permitidos.`);return true;
   }
   if(command==='minhasindicacoes'){
    if(isGroup)throw Error('Consulte suas indicações no privado.');
    const codes=Object.values(store.read().referralCodes||{}).filter(c=>c.owner===owner),codeSet=new Set(codes.map(c=>c.code)),orders=referralOrders().filter(o=>codeSet.has(o.referral.code));
    const applied=rentals.read().referralApplications||{};
    await reply('🎁 *SUAS INDICAÇÕES*\n'+(codes.map(c=>`${c.code} • ${clean(rentals.read().groups[c.groupJid]?.groupName||c.groupJid)}`).join('\n')||'Nenhum código. Use /indicacao no seu grupo.')+`\nContratações aprovadas: ${orders.length}\nBônus aplicados: ${orders.filter(o=>applied[o.id]).length}\nAguardando análise: ${orders.filter(o=>!applied[o.id]).length}`);return true;
   }
   if(command==='indicacoes'){
    const applied=rentals.read().referralApplications||{},rows=referralOrders().filter(o=>!applied[o.id]),page=Math.max(0,Number(args[0])||0),slice=rows.slice(page*6,page*6+6);
    await send(`🎁 *BÔNUS AGUARDANDO APROVAÇÃO*\nTotal: ${rows.length}\n`+(slice.map(o=>`${o.id}\nCódigo: ${o.referral.code} • ${o.quantity} grupo(s) • ${money(o.cents)}\nAtivados: ${Object.keys(engine.applied(o.id)).length}/${o.quantity}`).join('\n\n')||'Nenhuma indicação nesta página.'),[...slice.map(o=>['Revisar '+o.id.slice(0,8),`${prefix}aprovarindicacao ${o.id}`]),...(rows.length>(page+1)*6?[['➡️ Próxima',`${prefix}indicacoes ${page+1}`]]:[])]);return true;
   }
   if(command==='aprovarindicacao'){
    if(args[1]!=='CONFIRMAR'){const o=store.read().orders[args[0]];if(!o?.referral||o.simulated||o.sandbox||o.status!=='approved')throw Error('Pedido sem indicação real aprovada.');await send(`🎁 Confira o pedido ${o.id}.\nCódigo: ${o.referral.code}\nGrupo beneficiado: ${clean(rentals.read().groups[o.referral.groupJid]?.groupName||o.referral.groupJid)}\nBônus: 20 dias. Exige pagamento aprovado e todos os grupos ativados.`,[['✅ Aprovar 20 dias',`${prefix}aprovarindicacao ${o.id} CONFIRMAR`]]);return true;}
    const result=await approveReferral(args[0],identities);await reply(result.already?'✅ Bônus já aplicado anteriormente; nenhum dia duplicado.':`✅ 20 dias adicionados ao grupo ${result.groupJid}. Novo vencimento: ${new Date(result.expiresAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}`);return true;
   }
   if(command==='ativacoes'){
    const rows=activations(),page=Math.max(0,Number(args[0])||0),slice=rows.slice(page*6,page*6+6);
    await send(`📋 *ATIVAÇÕES PENDENTES*\nTotal: ${rows.length}\n`+(slice.map(o=>`${o.id}\n${PLANS[o.days]?.name} • ${o.days} dias • ${money(o.cents)}\nResponsável: ${o.owner.split('@')[0]}\nVagas ativadas: ${Object.keys(engine.applied(o.id)).length}/${o.quantity}`).join('\n\n')||'Nenhum pedido nesta página.'),[...slice.map(o=>['Ativar '+o.id.slice(0,8),`${prefix}ativarpedido ${o.id}`]),...(rows.length>(page+1)*6?[['➡️ Próxima',`${prefix}ativacoes ${page+1}`]]:[])]);return true;
   }
   if(command==='ativarpedido'){
    const [id,action,nonce,value]=args;
    if(!id)throw Error('Use /ativacoes ou /ativarpedido ID. Adicione o bot aos grupos antes.');
    const order=store.read().orders[id];if(!order||order.simulated||order.sandbox||order.status!=='approved'||order.groups.length)throw Error('Pedido não é uma contratação real aprovada de novos grupos.');
    if(!action){
     const remaining=order.quantity-Object.keys(engine.applied(id)).length;if(remaining<=0){await reply('✅ Todas as vagas deste pedido já foram ativadas.');return true;}
     const all=await conn.groupFetchAllParticipating(),db=rentals.read(),applied=engine.applied(id);
     const groups=Object.values(all||{}).filter(g=>/^\d+(?:-\d+)?@g\.us$/.test(g.id||'')&&!applied[g.id]&&(!db.groups[g.id]||(!db.groups[g.id].permanent&&canonical(db.groups[g.id].responsibleJid)===order.owner))).map(g=>({jid:g.id,name:clean(g.subject||g.id)})).sort((a,b)=>a.name.localeCompare(b.name));
     if(!groups.length)throw Error('Nenhum grupo elegível. Adicione o bot ao grupo do cliente e tente novamente.');
     const key=crypto.randomBytes(12).toString('hex'),session={owner,orderId:id,at:clock(),groups,selected:[],page:0};
     store.update(d=>{d.activationSessions ||= {};for(const [k,s]of Object.entries(d.activationSessions))if(clock()-s.at>10*60000)delete d.activationSessions[k];d.activationSessions[key]=session});
     return await render(session,key);
    }
    const s=store.read().activationSessions?.[nonce];if(!s||s.owner!==owner||s.orderId!==id||clock()-s.at>10*60000||s.closed)throw Error('Seleção expirada. Abra /ativarpedido ID novamente.');
    if(action==='marcar'){delete s.confirmed;const n=Number(value);if(!Number.isInteger(n)||!s.groups[n])throw Error('Grupo inválido.');const jid=s.groups[n].jid;s.selected=s.selected.includes(jid)?s.selected.filter(j=>j!==jid):[...s.selected,jid];if(s.selected.length>order.quantity-Object.keys(engine.applied(id)).length)throw Error('Quantidade selecionada maior que as vagas disponíveis.');}
    else if(action==='pagina')s.page=(s.page+1)%Math.ceil(s.groups.length/6);
    else if(action==='confirmar'){
     if(!s.selected.length)throw Error('Selecione ao menos um grupo.');
     s.confirmed=JSON.stringify(s.selected);store.update(d=>d.activationSessions[nonce]=s);
     await send(`Confirma ativar ${s.selected.length} grupo(s) do pedido ${id}?\n${s.groups.filter(g=>s.selected.includes(g.jid)).map(g=>g.name).join('\n')}\nPlano: ${order.days} dias. O prazo começa na ativação; dias existentes são preservados.`,[['✅ Ativar agora',`${prefix}ativarpedido ${id} executar ${nonce}`]]);return true;
    }else if(action==='executar'){
     if(!s.confirmed||s.confirmed!==JSON.stringify(s.selected))throw Error('Confira a seleção antes de ativar.');
     const result=await engine.activateByCreator(id,identities,s.selected,conn);s.closed=true;store.update(d=>d.activationSessions[nonce]=s);await reply(`✅ Ativação concluída: ${result.used}/${result.quantity} vagas do pedido. Responsável e prazo registrados. Promova o bot a ADM para moderação.`);return true;
    }else throw Error('Opção de ativação inválida.');
    store.update(d=>d.activationSessions[nonce]=s);return await render(s,nonce);
   }
   async function render(s,key){const o=store.read().orders[s.orderId],left=o.quantity-Object.keys(engine.applied(o.id)).length;const command=(a,v='')=>`${prefix}ativarpedido ${o.id} ${a} ${key}${v!==''?' '+v:''}`;
    await send(`📋 *SELECIONE OS GRUPOS*\nPedido: ${o.id}\nPlano: ${o.days} dias • ${money(o.cents)}\nVagas disponíveis: ${left}\nSelecionados: ${s.selected.length}\nPágina: ${s.page+1}/${Math.ceil(s.groups.length/6)}\nAdicione o bot aos grupos antes de abrir esta seleção.`,[...s.groups.slice(s.page*6,s.page*6+6).map((g,i)=>[`${s.selected.includes(g.jid)?'✅':'⬜'} ${g.name}`,command('marcar',s.page*6+i)]),...(s.groups.length>6?[['➡️ Próxima página',command('pagina')]]:[]),['✅ Conferir ativação',command('confirmar')]]);return true;
   }
  }catch(e){await reply('⚠️ '+String(e.message||'Falha na operação.').slice(0,350));return true;}
  return true;
 }
 return {handle,approveReferral,activations,referralOrders};
}
