import crypto from 'node:crypto';
import path from 'node:path';
import {jsonStore,billingStore,asaasConfigStore,billingOwner,canonical,isCreator,DAY,GRACE} from './storage.js';
import {readRentalDb,writeRentalDb} from '../rental/rentalSystem.js';
import {createBillingEngine} from './engine.js';
import {createActivationService} from './activation.js';
import {createRentalManagement} from './management.js';
import {createRentalLifecycle} from './lifecycle.js';
import {billingOptions,resolveBillingInput} from './ui.js';
const privateDb=()=>({orders:{},profiles:{},sessions:{},notices:{}});
export function createRentalTestMode({modeStore,baseDir,productionStore=billingStore,productionRentals={read:readRentalDb,write:writeRentalDb},prices=()=>asaasConfigStore.read().prices,clock=Date.now}){
 const caches=new Map(),running=new Map();let cleanupBusy=false;
 function protectedGroup(jid){return Boolean(productionRentals.read().groups?.[jid]||Object.values(productionStore.read().orders||{}).some(o=>!o.simulated&&!o.sandbox&&!o.localTest&&o.entryReservations?.[jid]));}
 function assertLive(id){const m=modeStore.read();if(!m.active||m.id!==id)throw Error('O teste foi encerrado. Use /iniciarteste para começar outro.');}
 function services(m){
  if(!/^[a-f0-9]{24}$/.test(m.id||''))throw Error('Sessão de teste inválida.');
  if(caches.has(m.id))return caches.get(m.id);
  const root=path.join(baseDir,m.id),store=jsonStore(path.join(root,'billing.json'),privateDb()),rentals=jsonStore(path.join(root,'rentals.json'),{groups:{}}),config=jsonStore(path.join(root,'config.json'),{mode:'production',prices:m.prices||{}});
  const engine=createBillingEngine({store,config,rentals,newProvider:'local-test',testRunId:m.id,clock,request:async()=>{throw Error('O teste local não acessa pagamentos externos.')}});
  const activationService=createActivationService({store,engine,clock,testRunId:m.id}),management=createRentalManagement({store,rentals,engine,clock});
  const value={store,rentals,config,mpConfig:config,engine,activationService,management};caches.set(m.id,value);return value;
 }
 const markText=text=>String(text||'').startsWith('🧪')?String(text):'🧪 *TESTE DO CRIADOR — SEM PAGAMENTO REAL*\n'+String(text||'');
 function wrapper(conn,m,s){
  const wrapped=Object.create(conn),invites=new Map();
  const guard=jid=>{assertLive(m.id);if(protectedGroup(jid))throw Error('Use um grupo exclusivo de teste, sem contrato real nem vaga real reservada.');};
  wrapped.sendMessage=(jid,data,opts)=>conn.sendMessage(jid,{...data,...(typeof data.text==='string'?{text:markText(data.text)}:{}),...(typeof data.caption==='string'?{caption:markText(data.caption)}:{})},opts);
  wrapped.groupGetInviteInfo=async code=>{assertLive(m.id);const meta=await conn.groupGetInviteInfo(code);guard(meta?.id);invites.set(code,meta.id);return meta;};
  wrapped.groupMetadata=async jid=>{guard(jid);return conn.groupMetadata(jid);};
  wrapped.groupFetchAllParticipating=async()=>{assertLive(m.id);const all=await conn.groupFetchAllParticipating();return Object.fromEntries(Object.entries(all||{}).filter(([id,g])=>!protectedGroup(g.id||id)));};
  wrapped.groupAcceptInvite=async code=>{
   const jid=invites.get(code);if(!jid)throw Error('Confira o convite antes de solicitar entrada.');guard(jid);
   const all=await conn.groupFetchAllParticipating();guard(jid);if(all?.[jid]||Object.values(all||{}).some(g=>g.id===jid))return jid;
   // Rastreia a tentativa antes da rede; a limpeza pode tratar uma aprovação tardia.
   s.store.update(d=>{d.testEffects ||= {};d.testEffects[jid]={attemptedAt:clock(),enteredByTest:true};});
   return conn.groupAcceptInvite(code);
  };
  wrapped.groupLeave=async jid=>{guard(jid);return conn.groupLeave(jid);};
  wrapped.kobaBillingBeforeLeave=async jid=>guard(jid);
  wrapped.kobaBillingReminder=(jid,text)=>billingOptions({conn:wrapped,jid,text,options:[['♻️ Renovar no teste',(m.prefix||'/')+'renovar']],store:s.store});
  return wrapped;
 }
 function menu(m){const p=m.prefix||'/';return `🧪 *MODO DE TESTE DO CRIADOR*\nSessão: ${m.id.slice(0,8)}\nSem Pix, sem API de pagamento e sem mudar o prefixo ${p}. Só você usa este ambiente.\n\n${p}alugar — escolher plano e quantidade; aprovação simulada\n${p}meuspagamentos — pedidos do teste\n${p}pagamento ID — verificar o pedido simulado\n${p}gerarcodigo ID — recuperar código TST\n${p}meuscodigos — códigos e vagas do teste\n${p}entrar LINK CODIGO — entrada REAL em grupo exclusivo de teste\n${p}ativarbot CODIGO — registrar contrato de teste no grupo\n${p}meuplano — conferir prazo de teste\n${p}renovar — renovar/trocar plano só no registro de teste\n${p}ativacoes — painel de ativações do teste\n${p}ativarpedido ID — ativação manual no teste\n\nNo grupo já ativado para teste:\n${p}iniciarteste avisos 7d\n${p}iniciarteste avisos 3d\n${p}iniciarteste avisos vencido\n${p}iniciarteste avisos saida — faz o bot SAIR do grupo de teste\n\n${p}iniciarteste — mostrar esta lista novamente\n${p}encerrarteste — invalidar códigos e voltar ao modo normal; sair dos grupos em que entrou pelo teste.\n\nGrupos com contratos reais ficam bloqueados. Se o bot já estava num grupo sem contrato, ele permanece lá ao encerrar. Não altere configurações globais durante a verificação.`;}
 async function cleanup(conn){
  const state=modeStore.read(),list=state.cleanup||[],remaining=[];if(!conn?.user||!list.length||cleanupBusy)return;cleanupBusy=true;
  try{for(const item of list){
   if(item.until<clock())continue;
   const live=modeStore.read();if(live.active){const active=services(live);if(active.rentals.read().groups?.[item.jid]||Object.values(active.store.read().orders).some(o=>o.entryReservations?.[item.jid])){remaining.push(item);continue;}}
   if(protectedGroup(item.jid))continue; // Um contrato real posterior tem prioridade.
   try{const meta=await conn.groupMetadata(item.jid),ids=[conn.user.id,conn.user.lid,conn.user.phoneNumber].filter(Boolean).map(canonical);
    if(!meta.participants?.some(p=>[p.id,p.jid,p.lid,p.phoneNumber].some(v=>v&&ids.includes(canonical(v))))){remaining.push(item);continue;}
    if(protectedGroup(item.jid))continue;
    const freshMode=modeStore.read();if(freshMode.active){const active=services(freshMode);if(active.rentals.read().groups?.[item.jid]||Object.values(active.store.read().orders).some(o=>o.entryReservations?.[item.jid])){remaining.push(item);continue;}}
    await conn.groupLeave(item.jid);
   }catch{remaining.push(item);}
  }
  modeStore.update(d=>{const old=new Set(list.map(i=>i.runId+':'+i.jid));d.cleanup=[...remaining,...(d.cleanup||[]).filter(i=>!old.has(i.runId+':'+i.jid))];});
  }finally{cleanupBusy=false;}
 }
 function clearRealMenu(m){productionStore.update(d=>{if(d.numericMenus)for(const key of [m.owner,...(m.aliases||[])])delete d.numericMenus[canonical(key)];});}
 async function route(ctx,next){
  const explicit=['iniciarteste','encerrarteste'].includes(ctx.command),owner=billingOwner(ctx.sender,ctx.identities||[]),ids=[owner,...(ctx.identities||[])],creator=isCreator(ids),args=String(ctx.q||'').trim().split(/\s+/).filter(Boolean);
  if(explicit&&!creator){await ctx.reply('👑 Iniciar e encerrar testes é exclusivo do criador.');return true;}
  if(explicit){
   if(ctx.command==='iniciarteste'){
    let m=modeStore.read();
    if(args[0]==='avisos'){
     if(!m.active||m.owner!==owner)throw Error('Inicie o modo de teste no privado antes.');
     if(!ctx.isGroup){await ctx.reply('Use a simulação de avisos dentro do grupo ativado para teste.');return true;}
     const stages={'7d':7*DAY,'3d':3*DAY,vencido:0,saida:-GRACE};if(!Object.hasOwn(stages,args[1])){await ctx.reply('Use /iniciarteste avisos 7d, 3d, vencido ou saida.');return true;}
     const s=services(m);if(protectedGroup(ctx.from)||!s.rentals.read().groups[ctx.from]){await ctx.reply('Ative um grupo exclusivo de teste antes de simular os avisos.');return true;}
     s.rentals.update(d=>{const r=d.groups[ctx.from];r.expiresAt=clock()+stages[args[1]];delete r.leftAfterExpiry;});
     const wrapped=wrapper(ctx.conn,m,s),tick=createRentalLifecycle({rentals:s.rentals,notices:s.store,clock,groupNotices:()=>true});
     await tick(wrapped);await ctx.reply(markText(args[1]==='saida'?'Verificação de saída do grupo de teste executada.':'Aviso de teste executado; confira o grupo e o privado.'));return true;
    }
    if(ctx.isGroup){await ctx.reply('Inicie o teste no privado do bot. Depois use o código no grupo exclusivo de teste.');return true;}
    if(!m.active){if(m.closing){await ctx.reply('O teste anterior ainda está encerrando. Aguarde.');return true;}
     m={...m,id:crypto.randomBytes(12).toString('hex'),owner,aliases:[...new Set([canonical(ctx.from),...ids.map(canonical)])],active:true,prefix:ctx.prefix||'/',at:clock(),prices:prices()||{}};
     const s=services(m);s.store.write(privateDb());s.rentals.write({groups:{}});s.config.write({mode:'production',prices:m.prices});modeStore.write(m);clearRealMenu(m);
    }
    await ctx.reply(menu(m));return true;
   }
   let m=modeStore.read();if(!m.active&&!m.closing){await ctx.reply('✅ Modo normal já está ativo. Nenhuma configuração de pagamento ou prefixo foi alterada.');return true;}
   if(ctx.isGroup){await ctx.reply('Encerre o teste no privado do bot para acompanhar a limpeza.');return true;}
   modeStore.update(d=>{d.active=false;d.closing=true;});
   await ctx.reply('🧪 Encerrando o teste e conferindo os grupos em que o bot entrou. Aguarde.');
   await Promise.allSettled([...(running.get(m.id)||[])]);
   const s=services(m),effects=Object.keys(s.store.read().testEffects||{});
   modeStore.update(d=>{d.active=false;d.closing=true;d.endedAt=clock();d.cleanup ||= [];for(const jid of effects)if(!d.cleanup.some(i=>i.runId===m.id&&i.jid===jid))d.cleanup.push({jid,runId:m.id,until:clock()+7*DAY});});
   clearRealMenu(m);caches.delete(m.id);await cleanup(ctx.conn);modeStore.update(d=>{if(d.id===m.id)d.closing=false;});
   const pending=(modeStore.read().cleanup||[]).filter(i=>i.runId===m.id).length;
   await ctx.reply(`✅ *TESTE ENCERRADO*\nModo normal retomado. Códigos TST e contratos desta sessão não funcionam no modo normal.\nPrefixo mantido: ${m.prefix}\nConfigurações de pagamento e contratos reais preservados.${pending?'\nHá '+pending+' grupo(s) com entrada/limpeza ainda não confirmada. Recuse solicitações pendentes do bot; a limpeza tentará novamente por até sete dias.':''}`);return true;
  }
  const m=modeStore.read();if(!m.active||!creator||m.owner!==owner)return false;
  if(/^(?:asaas|mp)/.test(ctx.command)&&!(['asaasteste','mpteste'].includes(ctx.command)&&args[0]==='suite')){await ctx.reply('🧪 No teste, use /alugar e os comandos da lista. Configurações e conexões financeiras ficam bloqueadas; use /encerrarteste antes de gerenciá-las.');return true;}
  const s=services(m),wrapped=wrapper(ctx.conn,m,s);
  const promise=next({...ctx,conn:wrapped,reply:text=>ctx.reply(markText(text)),skipRentalTest:true,isRentalTest:true,billingServices:s});
  let set=running.get(m.id);if(!set){set=new Set();running.set(m.id,set);}set.add(promise);
  try{return await promise;}finally{set.delete(promise);}
 }
 async function blockLiveCommand(ctx){const m=modeStore.read();if(!m.active||!isCreator([ctx.sender,...(ctx.identities||[])]))return false;const blocked=new Set('registrar_aluguel rg_aluguel renovar_aluguel add_dias rm_aluguel aluguel_permanente aluguel_global aluguel_avisos prefixo add_prefixo'.split(' '));if(!blocked.has(ctx.command))return false;await ctx.reply('🧪 Durante o teste, use /alugar, /ativarbot e /renovar. Cadastros legados e alterações de prefixo ficam bloqueados. Use /encerrarteste antes de gerenciar os dados reais.');return true;}
 function resolveInput(input){const m=modeStore.read();if(!m.active||input.isGroup||input.fromMe||![m.owner,...(m.aliases||[])].includes(canonical(input.jid)))return null;return resolveBillingInput({...input,store:services(m).store,clock});}
 return {route,cleanup,resolveInput,blockLiveCommand,state:()=>modeStore.read(),services};
}
export const rentalTestMode=createRentalTestMode({modeStore:jsonStore(path.join(process.cwd(),'files/database/rental-test-mode.json'),{active:false,cleanup:[]}),baseDir:path.join(process.cwd(),'files/database/rental-tests')});
export const resolveRentalTestInput=input=>rentalTestMode.resolveInput(input);
let cleanupStarted=false,cleanupConn=null;
export function ensureRentalTestRuntime(conn){
 cleanupConn=conn;if(cleanupStarted)return;cleanupStarted=true;
 const tick=()=>rentalTestMode.cleanup(cleanupConn).catch(()=>{});void tick();const timer=setInterval(tick,60000);timer.unref?.();
}
