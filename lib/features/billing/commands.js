import crypto from 'node:crypto';
import {billingStore as store,configStore as mpConfig,asaasConfigStore as config,PLANS,price,money,canonical,isCreator} from './storage.js';
import {billingEngine as engine} from './runtime.js';
import {billingOptions} from './ui.js';
import {asaasRequest,asaasBinding} from './asaas.js';
import {mpRequest} from './mercadoPago.js';
export const ASAAS_COMMANDS='asaastoken asaasstatus asaasmodo asaasteste asaasretorno asaaspreco asaasavisos'.split(' ');
export const BILLING_COMMANDS=new Set('planos plans plano alugar renovar meusalugueis meuspagamentos pagamento cancelarpagamento vincularaluguel emailpagamento mptoken mpmodo mpstatus mpteste mppreco mpavisos'.split(' ').concat(ASAAS_COMMANDS));
const safeText=s=>String(s||'').replace(/[\r\n]/g,' ').slice(0,80);
export async function handleBillingCommand(ctx){
 if(!BILLING_COMMANDS.has(ctx.command))return false;
 if(['planos','plans','plano'].includes(ctx.command))ctx={...ctx,command:'alugar',q:''};
 const {command,q='',from,sender,conn,info,prefix='/'}=ctx;
 // Respostas sobre chaves nunca citam a mensagem original, mesmo em erro ou falta de permissão.
 const reply=['asaastoken','mptoken'].includes(command)?text=>conn.sendMessage(from,{text}):ctx.reply;
 const owner=canonical(sender),creator=isCreator(ctx.identities||[owner]);
 if(ctx.isGroup){await reply('🔐 Gerencie pagamento e renovação no privado da Kobayashi.');return true;}
 const args=q.trim().split(/\s+/).filter(Boolean);
 const send=(text,options=[])=>billingOptions({conn,jid:from,info,text,options,generate:ctx.generate});
 try{
  if(ASAAS_COMMANDS.includes(command)){
   if(!creator){await reply('👑 Configuração e testes são exclusivos do criador.');return true;}
   if(command==='asaastoken'){
    if(args.length!==2||!['sandbox','producao'].includes(args[0])||args[1].length<20||args[1].length>1024)throw Error('Use /asaastoken sandbox CHAVE ou /asaastoken producao CHAVE no privado.');
    const pending=Object.values(store.read().orders).some(o=>o.provider==='asaas'&&!o.sandbox&&['creating','uncertain','pending','expired'].includes(o.status)&&Date.now()-o.expiresAt<48*3600000);
    if(pending)throw Error('Há pedidos reais Asaas em conciliação. Resolva-os antes de trocar a chave ou ambiente.');
    config.update(c=>{c.token=args[1];c.environment=args[0]==='sandbox'?'sandbox':'production';c.mode='off';delete c.verifiedBinding;});
    let deleted=false;try{await conn.sendMessage(from,{delete:info.key});deleted=true;}catch{}
    await reply('🔐 Chave Asaas salva. Cobranças desativadas. Use /asaasteste conexao.'+(deleted?'':' Apague manualmente sua mensagem com a chave.'));return true;
   }
   if(command==='asaasstatus'){const c=config.read();await reply(`💳 ASAAS\nChave: ${c.token?'configurada':'ausente'}\nAmbiente: ${c.environment}\nConexão verificada: ${c.verifiedBinding&&c.verifiedBinding===asaasBinding(c)?'sim':'não'}\nModo: ${c.mode}\nRetorno ao WhatsApp: ${c.returnUrl?'configurado':'pendente — /asaasretorno NUMERO_DO_BOT'}\nAvisos no grupo: ${c.groupNotices!==false?'on':'off'}\nConfirmação: consulta automática com fila e intervalo mínimo de 60s por pedido.\nSandbox nunca libera grupos reais.`);return true;}
   if(command==='asaasretorno'){
    const phone=q.replace(/[^0-9]/g,'');if(!/^\d{10,15}$/.test(phone))throw Error('Use /asaasretorno NUMERO_DO_BOT com DDI e DDD.');
    config.update(c=>{c.returnUrl='https://wa.me/'+phone;});await reply('✅ Retorno ao WhatsApp configurado. O redirecionamento não confirma o pagamento.');return true;
   }
   if(command==='asaasmodo'){
    const c=config.read(),mode=args[0];
    if(mode==='off'){config.update(c=>{c.mode='off'});await reply('Novas cobranças bloqueadas. Pedidos existentes continuam em conciliação.');return true;}
    if(!c.token||c.verifiedBinding!==asaasBinding(c))throw Error('Configure /asaastoken e execute /asaasteste conexao antes.');
    if(mode==='sandbox'&&c.environment==='sandbox'){config.update(c=>{c.mode='sandbox'});await reply('🧪 Sandbox ativa somente para o criador. /alugar e /renovar gerarão links de teste, sem liberar grupos reais.');return true;}
    if(['piloto','producao'].includes(mode)&&args[1]==='CONFIRMAR'&&c.environment==='production'){
     if(!c.returnUrl)throw Error('Configure /asaasretorno NUMERO_DO_BOT antes.');
     config.update(c=>{c.mode=mode==='piloto'?'pilot':'production'});await reply(mode==='piloto'?'💳 Piloto REAL: somente o criador poderá gerar cobranças.':'💳 Cobranças REAIS liberadas para clientes.');return true;
    }
    throw Error('Use /asaasmodo sandbox (chave Sandbox), off, piloto CONFIRMAR ou producao CONFIRMAR (chave de produção).');
   }
   if(command==='asaasavisos'){if(!['on','off'].includes(args[0]))throw Error('Use /asaasavisos on/off.');config.update(c=>{c.groupNotices=args[0]==='on'});await reply('✅ Avisos no grupo atualizados. Avisos privados continuam ativos.');return true;}
   if(command==='asaaspreco'){
    const days=Number(args[0]),cents=Math.round(Number((args[1]||'').replace(',','.'))*100);
    if(!PLANS[days]||!Number.isInteger(cents)||cents<100||cents>100000)throw Error('Use /asaaspreco 30 25.00. Prazos: 15,30,60,90.');
    config.update(c=>{c.prices ||= {};c.prices[days]=cents;});await reply(`✅ ${days} dias: ${money(cents)} por grupo. Pedidos anteriores preservados.`);return true;
   }
   if(command==='asaasteste'){
    if(args[0]==='suite'){const {runBillingSelfTest}=await import('./selfTest.js');await reply(await runBillingSelfTest());return true;}
    if(args[0]==='conexao'){const c=config.read(),result=await asaasRequest(c,'/finance/balance');if(typeof result.balance!=='number'||!Number.isFinite(result.balance))throw Error('Resposta de conexão Asaas inválida.');config.update(d=>{d.verifiedBinding=asaasBinding(c)});await reply(`✅ Asaas respondeu no ambiente ${c.environment}. Nenhuma cobrança foi criada; saldo e chave não são exibidos.`);return true;}
    if(['aprovar','verificar'].includes(args[0])){
     const target=engine.owned(args[1],owner);if(!target.sandbox)throw Error('Use /pagamento ID para pedidos reais.');
     const o=args[0]==='aprovar'?await engine.confirmSandbox(args[1],owner):await engine.verify(args[1],owner);
     await reply(`🧪 SANDBOX: ${o.status}. Nenhum grupo real alterado. ${o.status==='approved'?'Confirmação de teste reconhecida.':''}`);return true;
    }
    if(['menu','renovar'].includes(args[0]))return await start(args[0]==='renovar',true);
    throw Error('Use /asaasteste suite, conexao, menu ou renovar (simulações locais); aprovar ID ou verificar ID (pedido Sandbox). /alugar em modo sandbox cria o link de teste na API.');
   }
  }
  if(command.startsWith('mp')){
   const config=mpConfig;
   if(!creator){await reply('👑 Configuração e testes são exclusivos do criador.');return true;}
   if(command==='mptoken'){
    if(!q||q.length>512||/\s/.test(q))throw Error('Use /mptoken ACCESS_TOKEN no privado.');
    config.update(c=>{c.token=q;c.collectorId=null;c.mode='off';});
    let deleted=false;try{await conn.sendMessage(from,{delete:info.key});deleted=true;}catch{}
    await reply('🔐 Token salvo sem exibir o valor. Modo real desativado. Use /mpteste conexao para validar a conta.'+(deleted?'':' Não consegui apagar sua mensagem com o token; apague-a manualmente.'));return true;
   }
   if(command==='mpstatus'){const c=config.read();await reply(`💳 Mercado Pago\nToken: ${c.token?'configurado':'ausente'}\nConta verificada: ${c.collectorId?'sim':'não'}\nModo: ${c.mode}\nAvisos no grupo: ${c.groupNotices!==false?'on':'off'}\nConfirmação: consulta automática a cada 30s (fila pode ampliar esse prazo).`);return true;}
   if(command==='mpmodo'){
    if((args[0]==='producao'||args[0]==='piloto')&&args[1]==='CONFIRMAR'){const c=config.read();if(!c.token||!c.collectorId)throw Error('Configure o token e use /mpteste conexao antes.');config.update(c=>{c.mode=args[0]==='piloto'?'pilot':'production';});await reply(args[0]==='piloto'?'💳 Piloto: apenas o criador pode gerar Pix real com /alugar. Clientes permanecem bloqueados.':'💳 Cobranças reais habilitadas. Cada cliente verá o resumo antes de gerar o Pix.');}
    else if(['off','teste'].includes(args[0])){config.update(c=>{c.mode=args[0]==='teste'?'test':'off';});await reply('Clientes não gerarão cobranças reais. Testes simulados: /mpteste menu.');}
    else throw Error('Use /mpmodo teste, /mpmodo off, /mpmodo piloto CONFIRMAR ou /mpmodo producao CONFIRMAR.');return true;
   }
   if(command==='mpavisos'){if(!['on','off'].includes(args[0]))throw Error('Use /mpavisos on/off para avisos nos grupos.');config.update(c=>{c.groupNotices=args[0]==='on';});await reply('✅ Preferência salva. Os avisos no privado continuam ativos.');return true;}
   if(command==='mppreco'){
    const days=Number(args[0]),cents=Math.round(Number((args[1]||'').replace(',','.'))*100);
    if(!PLANS[days]||!Number.isInteger(cents)||cents<100||cents>100000)throw Error('Use /mppreco 30 25.00 (planos: 15,30,60,90; R$1 a R$1000 por grupo).');
    config.update(c=>{c.prices ||= {};c.prices[days]=cents;});await reply(`✅ ${days} dias: ${money(cents)} por grupo. Cobranças já geradas mantêm o preço.`);return true;
   }
   if(command==='mpteste'){
    if(args[0]==='suite'){const {runBillingSelfTest}=await import('./selfTest.js');await reply(await runBillingSelfTest());return true;}
    if(args[0]==='conexao'){const account=await mpRequest(config.read().token,'/users/me');if(!account.id)throw Error('Conta não identificada.');config.update(c=>{c.collectorId=String(account.id);});await reply('✅ API respondeu e a conta recebedora foi registrada. Nenhuma cobrança foi criada.');return true;}
    if(['aprovar','cancelar','expirar'].includes(args[0])){const result=engine.simulate(args[1],owner,{aprovar:'approved',cancelar:'cancelled',expirar:'expired'}[args[0]]);await reply(`🧪 SIMULADO: ${result.status}. Nenhum grupo real foi liberado, alterado ou removido.`);return true;}
    if(!['menu','renovar'].includes(args[0]))throw Error('Use /mpteste suite, /mpteste menu, /mpteste renovar, /mpteste conexao, /mpteste aprovar ID, /mpteste cancelar ID ou /mpteste expirar ID.');
    return await start(args[0]==='renovar',true);
   }
  }
  if(command==='emailpagamento'){
   if(!/^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/.test(q)||q.length>254)throw Error('Use /emailpagamento seu@email.com com um e-mail real.');
   store.update(d=>{d.profiles[owner]={...(d.profiles[owner]||{}),email:q};});await reply('✅ E-mail salvo para a cobrança.');return true;
  }
  if(command==='meusalugueis'){const rows=engine.leaseGroups(owner);await send('🏘️ *SEUS ALUGUÉIS*\n\n'+(rows.map(g=>`${safeText(g.groupName||g.jid)}\n${new Date(g.expiresAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}`).join('\n\n')||'Nenhum grupo vinculado. Para contratos antigos, o criador deve cadastrar o responsável.'),[['♻️ Selecionar renovação',prefix+'renovar']]);return true;}
  if(command==='meuspagamentos'){const rows=Object.values(store.read().orders).filter(o=>o.owner===owner).sort((a,b)=>b.createdAt-a.createdAt).slice(0,10);await reply(rows.map(o=>`${o.simulated?'🧪 SIMULAÇÃO':o.sandbox?'🧪 SANDBOX':'💳 PIX'} ${o.id}\n${o.quantity} grupo(s) • ${money(o.cents)} • ${o.status}\n${prefix}pagamento ${o.id}`).join('\n\n')||'Nenhum pedido.');return true;}
  if(command==='pagamento'||command==='cancelarpagamento'){
   let o=engine.owned(args[0],owner);
   if(!o.simulated&&Date.now()-(o.lastManualCheck||0)<15000)throw Error('Aguarde 15 segundos entre consultas do pedido.');
   store.update(d=>{d.orders[o.id].lastManualCheck=Date.now();});
   o=command==='pagamento'?await engine.verify(o.id,owner):await engine.cancel(o.id,owner);
   await reply(`${o.simulated?'🧪 SIMULADO':o.sandbox?'🧪 SANDBOX':'💳 PAGAMENTO'}\nPedido: ${o.id}\nStatus: ${o.status}${o.providerStatus?' ('+o.providerStatus+')':''}\n${o.sandbox?'Nenhum grupo real é liberado na Sandbox.':o.status==='approved'&&!o.simulated?(o.groups.length?'Renovação processada.':`Vincule cada grupo: ${prefix}vincularaluguel ${o.id} LINK`):'Nenhum comprovante enviado manualmente libera o aluguel.'}`);return true;
  }
  if(command==='vincularaluguel'){await engine.verify(args[0],owner);const jid=await engine.attach(args[0],owner,args[1],conn);await reply('✅ Grupo vinculado e prazo registrado: '+jid+'\nPromova a Kobayashi a ADM para usar as funções de moderação.');return true;}
  if(command==='renovar')return await start(true,false);
  if(command==='alugar'){
   if(!args.length)return await start(false,false);
   if(args[0]==='ajuda'){await reply('🐉 ALUGUEL AUTOMÁTICO\n/alugar — contratar\n/renovar — selecionar grupos e plano\n/meusalugueis — contratos\n/meuspagamentos — pedidos\n/emailpagamento EMAIL — cadastrar e-mail\n/pagamento ID — verificar\n/cancelarpagamento ID — cancelar cobrança pendente\n/vincularaluguel ID LINK — cadastrar grupo após pagar');return true;}
   const [action,id,value]=args;
   const session=store.read().sessions[id];
   if(!session||session.owner!==owner||Date.now()-session.at>30*60000)throw Error('Seleção expirada ou de outro responsável. Comece com /alugar ou /renovar.');
   if(session.simulated&&!creator)throw Error('Teste exclusivo do criador.');
   if(session.closed)throw Error('Esta seleção foi encerrada. Use /renovar para iniciar outra.');
   if(session.orderId&&action!=='confirmar')throw Error('A seleção já gerou um pedido. Consulte /meuspagamentos ou inicie outra seleção.');
   if(action==='plano'){if(!PLANS[value])throw Error('Plano inválido.');session.days=Number(value);session.step=session.renew?'groups':'quantity';}
   if(action==='quantidade'){const n=Number(value);price(session.days,n);session.quantity=n;session.step='summary';}
   if(action==='marcar'){const n=Number(value);if(!Number.isInteger(n)||!session.groups[n])throw Error('Grupo inválido.');const jid=session.groups[n].jid;session.selected=session.selected.includes(jid)?session.selected.filter(x=>x!==jid):[...session.selected,jid];}
   if(action==='todos')session.selected=session.selected.length===session.groups.length?[]:session.groups.map(g=>g.jid);
   if(action==='pagina')session.page=Math.max(0,Math.min(Math.ceil(session.groups.length/6)-1,Number(value)||0));
   if(action==='resumo'){session.quantity=session.selected.length;session.step='summary';}
   if(action==='voltar')session.step='groups';
   if(action==='encerrar'){
    if(!session.renew||session.selected.length||session.step!=='summary')throw Error('Confira primeiro a seleção sem grupos.');
    session.closed=true;store.update(d=>{d.sessions[id]=session;});
    await reply('✅ Opção de não renovar registrada. Nenhum Pix foi criado e nenhum prazo já pago foi reduzido. Os grupos seguem até o vencimento; a saída ocorre após a carência de duas horas. Você pode mudar de ideia com /renovar.');return true;
   }
   if(action==='alterar')session.step='plan';
   if(action==='confirmar'){
    if(session.step!=='summary')throw Error('Confira o resumo antes de confirmar.');
    const currentTotal=(config.read().prices?.[session.days]||PLANS[session.days].cents)*session.quantity;
    if(!session.orderId&&session.quotedTotal!==currentTotal){await render(session,id);await reply('O preço foi atualizado. Confira o novo resumo e confirme novamente.');return true;}
    session.orderId ||= crypto.randomUUID();store.update(d=>{d.sessions[id]=session;});
    const o=await engine.create({owner,days:session.days,quantity:session.quantity,groups:session.renew?session.selected:[],simulated:session.simulated,key:session.orderId});
    if(o.status==='creating')throw Error('Pedido em processamento. Consulte /pagamento '+o.id+' para reconciliar.');
    if(o.simulated){await reply(`🧪 *SIMULAÇÃO — NÃO PAGUE*\nPedido: ${o.id}\n${o.quantity} grupo(s) • ${o.days} dias • ${money(o.cents)}\nNenhum Pix real foi criado.\nTeste aprovação: /mpteste aprovar ${o.id}`);return true;}
    if(o.status!=='pending'){await reply('Pedido já processado ou aguardando conciliação. Consulte /pagamento '+o.id);return true;}
    if(o.provider==='asaas'){
     const label=o.sandbox?'🧪 *SANDBOX — NÃO PAGUE COM DINHEIRO REAL*':'💳 *PAGAMENTO KOBAYASHI*';
     const text=`${label}\nPedido: ${o.id}\n${o.quantity} grupo(s) • ${o.days} dias • ${money(o.cents)}\nAbra o link para preencher seus dados e gerar o Pix no Asaas:\n${o.checkoutUrl}\n\n${o.sandbox?`Após gerar o Pix de teste, use /asaasteste aprovar ${o.id}. Nenhum grupo real será liberado.`:'O aluguel só será liberado após confirmação financeira da API.'}`;
     await send(text,[['🔎 Verificar pagamento',`${prefix}pagamento ${o.id}`],['❌ Encerrar checkout',`${prefix}cancelarpagamento ${o.id}`]]);return true;
    }
    const text=`💳 *PIX KOBAYASHI*\nPedido: ${o.id}\n${o.quantity} grupo(s) • ${o.days} dias • ${money(o.cents)}\nVálido até ${new Date(o.expiresAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}\n\nPix Copia e Cola:\n${o.qr||'Não retornado; consulte o pedido.'}`;
    if(o.qrImage&&o.qrImage.length<700000)await conn.sendMessage(from,{image:Buffer.from(o.qrImage,'base64'),caption:'Pix Kobayashi • '+money(o.cents)},{quoted:info});
    await send(text,[['🔎 Verificar pagamento',`${prefix}pagamento ${o.id}`],['❌ Cancelar cobrança',`${prefix}cancelarpagamento ${o.id}`]]);return true;
   }
   store.update(d=>{d.sessions[id]=session;});await render(session,id);return true;
  }
  async function start(renew,simulated){
   const groups=renew?engine.leaseGroups(owner):[];if(renew&&!groups.length)throw Error('Nenhum grupo vinculado a você. O criador precisa cadastrar o responsável dos aluguéis antigos.');
   const id=crypto.randomBytes(12).toString('hex'),session={owner,at:Date.now(),renew,simulated,groups,selected:groups.map(g=>g.jid),days:30,quantity:1,page:0,step:'plan'};
   store.update(d=>{for(const [key,s]of Object.entries(d.sessions))if(Date.now()-s.at>30*60000)delete d.sessions[key];if(Object.keys(d.sessions).length>=500)throw Error('Muitas seleções abertas; tente mais tarde.');d.sessions[id]=session;});
   await render(session,id);return true;
  }
  async function render(s,id){
   const command=(a,v='')=>`${prefix}alugar ${a} ${id}${v!==''?' '+v:''}`;
   const label=s.simulated?'🧪 *SIMULAÇÃO — SEM COBRANÇA*\n':config.read().environment==='sandbox'?'🧪 *SANDBOX — SEM DINHEIRO REAL*\n':'🐉 *ALUGUEL KOBAYASHI*\n';
   if(s.step==='plan')return send(label+'Escolha o prazo. O preço é por grupo.',Object.values(PLANS).map(p=>[`${p.name} • ${p.days} dias • ${money(config.read().prices?.[p.days]||p.cents)}`,command('plano',p.days)]));
   if(s.step==='quantity')return send(label+`${s.days} dias. Quantos grupos?\nPara outra quantidade (1 a 50), envie:\n${command('quantidade','5')}`,[...['1','2','3'].map(n=>[n+' grupo(s)',command('quantidade',n)]),['➕ Mais grupos (instruções)',command('mais')]]);
   if(s.step==='groups'){
    const slice=s.groups.slice(s.page*6,s.page*6+6),options=slice.map((g,i)=>[`${s.selected.includes(g.jid)?'✅':'⬜'} ${safeText(g.groupName||g.jid)}`,command('marcar',s.page*6+i)]);
    if(s.groups.length>6)options.push(['➡️ Próxima página',command('pagina',(s.page+1)%Math.ceil(s.groups.length/6))]);
    options.push(['🏘️ Marcar/desmarcar todos',command('todos')],['✅ Confirmar seleção',command('resumo')]);
    return send(label+`Selecione os grupos que deseja renovar.\nSelecionados: ${s.selected.length}/${s.groups.length}\nPágina: ${s.page+1}/${Math.max(1,Math.ceil(s.groups.length/6))}\nOs desmarcados continuam até o prazo já pago.`,options);
   }
   const cents=(config.read().prices?.[s.days]||PLANS[s.days].cents)*s.quantity;
   s.quotedTotal=cents;store.update(d=>{d.sessions[id]=s;});
   if(s.renew&&!s.selected.length)return send(label+'Nenhum grupo será renovado. Não será gerado Pix. Todos mantêm o prazo já pago e, sem renovação, o bot sairá após a carência de duas horas.',[['✅ Confirmar não renovação',command('encerrar')],['↩️ Voltar à seleção',command('voltar')]]);
   return send(label+`*CONFIRA ANTES DE GERAR O PIX*\nPrazo: ${s.days} dias\nGrupos: ${s.quantity}\nTotal: ${money(cents)}\n`+(s.renew?`\n✅ Renovar:\n${s.groups.filter(g=>s.selected.includes(g.jid)).map(g=>safeText(g.groupName||g.jid)).join('\n')}\n\n⬜ Não renovar:\n${s.groups.filter(g=>!s.selected.includes(g.jid)).map(g=>safeText(g.groupName||g.jid)).join('\n')||'Nenhum'}\nDias restantes serão preservados.`:'Depois do pagamento aprovado, vincule os convites dos grupos.'),[['💳 Confirmar e gerar Pix',command('confirmar')],['📦 Alterar plano',command('alterar')]]);
  }
 }catch(e){await reply('⚠️ '+String(e.message||'Falha na operação.').slice(0,350));return true;}
 return true;
}
