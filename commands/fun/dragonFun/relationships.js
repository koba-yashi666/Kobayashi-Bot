import { targetOf, displayJid, tag } from './_utils.js';
import { relationshipId, mergeRelationshipAliases, proposeDating, acceptDating, datingOf, proposeMarriage, acceptMarriage, marriageOf, divorce, endDating, rejectRelationship, cancelRelationship } from '../../../lib/features/social/relationships.js';

export const aliases=['namoro','aceitar_namoro','aceitarnamoro','recusar_namoro','recusarnamoro','cancelarpedido','terminarnamoro','terminar_namoro','casar','aceitarcasamento','aceitarpedido','recusarcasamento','divorciar','minhadupla','relacionamento','casais'];
const errors={self:'Você não pode criar um relacionamento consigo mesmo.',invalid:'Não consegui identificar esse membro.',casado:'Uma das pessoas já está casada.',namorando:'Uma das pessoas já está namorando.',pendente:'Já existe um pedido pendente envolvendo vocês. Aceite, recuse ou cancele antes de enviar outro.',none:'Não existe pedido pendente para você ou ele expirou. Peça para enviar novamente.',indisponivel:'Uma das pessoas já está em outro relacionamento.',nao_namoram:'Vocês precisam estar namorando entre si antes do casamento.',data:'A data desse namoro antigo está inválida. Terminem e registrem o namoro novamente.'};

export default async function run(ctx){
  const command=ctx.command.toLowerCase();
  const sender=relationshipId(await displayJid(ctx,ctx.sender));
  const rawTarget=targetOf(ctx);
  const target=rawTarget?relationshipId(await displayJid(ctx,rawTarget)):null;
  const actorIds=[sender,ctx.sender,ctx.info?.key?.participant,ctx.info?.key?.participantAlt].filter(Boolean);
  const targetIds=[target,rawTarget].filter(Boolean);
  const knownGroups=[];
  for(const p of ctx.groupMembers||[]){
    const ids=[p.id,p.jid,p.lid,p.phoneNumber,p.participant].filter(Boolean);
    const pn=ids.map(relationshipId).find(id=>id.endsWith('@s.whatsapp.net'));
    if(pn)knownGroups.push([pn,...ids]);
    if(ids.some(id=>actorIds.map(relationshipId).includes(relationshipId(id))))actorIds.push(...ids);
    if(ids.some(id=>targetIds.map(relationshipId).includes(relationshipId(id))))targetIds.push(...ids);
  }
  const merged=mergeRelationshipAliases([...knownGroups,[sender,...actorIds],...(target?[[target,...targetIds]]:[])]);
  if(!merged.ok)return ctx.reply('⚠️ Encontrei vínculos antigos conflitantes entre número e LID. Não alterei os registros; é necessário revisar o cadastro.');
  const fail=result=>ctx.reply(result.reason==='tempo'?`⏳ O casamento exige 24 horas de namoro. Faltam aproximadamente ${Math.ceil(result.remainingMs/60000)} minutos.`:`💔 ${errors[result.reason]||'Não foi possível concluir esta ação.'}`);
  const send=(text,ids=[])=>ctx.conn.sendMessage(ctx.from,{text,mentions:[...new Set(ids.filter(Boolean))]},{quoted:ctx.info});
  if(command==='namoro'||command==='casar'){
    if(!target)return ctx.reply(`Marque ou responda à pessoa: ${ctx.prefix}${command} @membro`);
    const botIds=[ctx.conn.user?.id,ctx.conn.user?.lid,ctx.conn.user?.phoneNumber].filter(Boolean);
    for(const id of botIds)if(relationshipId(await displayJid(ctx,id))===target)return ctx.reply('🐉 Eu não posso participar de namoro ou casamento. Marque um membro.');
    const result=command==='namoro'?proposeDating(sender,target):proposeMarriage(sender,target);
    if(!result.ok)return fail(result);
    const action=command==='namoro'?'namoro':'casamento',accept=command==='namoro'?'aceitar_namoro':'aceitarcasamento',reject=command==='namoro'?'recusar_namoro':'recusarcasamento';
    return send(`💌 ${tag(sender)} pediu ${tag(target)} em ${action}!\n\n${tag(target)}, use ${ctx.prefix}${accept} ou ${ctx.prefix}${reject}.\n⏳ Pedido válido por 30 minutos.\nQuem enviou pode usar ${ctx.prefix}cancelarpedido.`,[sender,target]);
  }
  if(['aceitar_namoro','aceitarnamoro','aceitarcasamento','aceitarpedido'].includes(command)){
    const dating=command.includes('namoro'),result=dating?acceptDating(sender):acceptMarriage(sender);
    if(!result.ok)return fail(result);
    return send(`${dating?'💞':'💒'} ${tag(sender)} e ${tag(result.partner)} agora estão ${dating?'namorando':'casados'}!${dating?'\n⏳ Casamento liberado após 24 horas de namoro.':''}`,[sender,result.partner]);
  }
  if(['recusar_namoro','recusarnamoro','recusarcasamento'].includes(command)){
    const result=rejectRelationship(sender,command==='recusarcasamento'?'marriage':'dating');
    return result.ok?ctx.reply('💌 Pedido recusado.'):fail(result);
  }
  if(command==='cancelarpedido')return ctx.reply(cancelRelationship(sender).ok?'💌 Seu pedido foi cancelado.':'Você não tem pedido enviado pendente.');
  if(['terminarnamoro','terminar_namoro','divorciar'].includes(command)){
    const married=command==='divorciar',result=married?divorce(sender):endDating(sender);
    if(!result.ok)return ctx.reply(married?'Você não está casado(a).':'Você não está namorando.');
    return send(`💔 ${tag(sender)} e ${tag(result.partner)} ${married?'se divorciaram':'terminaram o namoro'}.`,[sender,result.partner]);
  }
  const married=marriageOf(sender),dating=datingOf(sender),partner=married||dating?.partner;
  return partner?send(`${married?'💍 Casamento':'💗 Namoro'}\n${tag(sender)} ❤️ ${tag(partner)}${!married&&Number(dating.since)>0?'\n📅 Desde '+new Date(Number(dating.since)).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}):''}`,[sender,partner]):ctx.reply('💔 Você não está namorando nem casado(a).');
}
