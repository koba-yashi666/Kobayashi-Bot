import { checkAntiFakeParticipant, getAntiFakeConfig } from './antiFake.js';
import { createPurgeResolver } from './groupPurge.js';
import { removeAntiLinkParticipant } from './antiLinkRemoval.js';
import { protectedRemovalMessage } from './removalProtection.js';
import { isWhitelisted } from './whitelist.js';
import { isMainOwnerJid, isLeaderJid } from '../../config/settingsStore.js';
import { addAdminLog } from './adminLogs.js';
import { currentGroupAdmin, hasAdminRole, GROUP_ADMIN_REQUIRED } from '../access/groupCommandAccess.js';
const running=new Set();
export async function runBanFake({conn,from,sender,authorIds=[sender],isGroup,reply,pause=ms=>new Promise(r=>setTimeout(r,ms))}) {
  if(!isGroup)return reply('Este comando só funciona em grupos.');
  if(running.has(from))return reply('Já existe uma verificação /banfake em andamento neste grupo.');
  running.add(from);
  try {
    const meta=await conn.groupMetadata(from);
    if(!await currentGroupAdmin(conn,from,authorIds,meta))return reply(GROUP_ADMIN_REQUIRED);
    const botIds=[conn.user?.id,conn.user?.lid,conn.user?.phoneNumber].filter(Boolean);
    if(!await currentGroupAdmin(conn,from,botIds,meta))return reply('🛡️ A Kobayashi precisa ser ADM para remover os fakes.');
    const cfg=getAntiFakeConfig(from), expand=createPurgeResolver(conn),botAliases=new Set();
    for(const id of botIds)for(const alias of await expand(id))botAliases.add(alias);
    await reply(`🛡️ Verificando os membros deste grupo. Prefixos permitidos: ${cfg.allowedPrefixes.map(x=>'+'+x).join(', ')}.`);
    const report={removed:0,protected:0,allowed:0,unknown:0,failed:[],name:meta.subject||from};
    const seen=new Set();
    for(const member of meta.participants || []) {
      const identities=await expand(member),target=member.id||member.jid||member.phoneNumber;
      if(!target||identities.some(id=>seen.has(id)))continue;
      for(const id of identities)seen.add(id);
      if(hasAdminRole(member)||identities.some(id=>botAliases.has(id)||isMainOwnerJid(id)||isLeaderJid(id)||isWhitelisted(from,id))||await protectedRemovalMessage(conn,from,target,{participants:meta.participants})) {report.protected++;continue;}
      const check=await checkAntiFakeParticipant(conn,from,member);
      if(!check.known){report.unknown++;continue;}
      if(check.allowed){report.allowed++;continue;}
      // Revalida os cargos e as proteções antes de cada remoção.
      const fresh=await conn.groupMetadata(from);
      if(!await currentGroupAdmin(conn,from,authorIds,fresh)||!await currentGroupAdmin(conn,from,botIds,fresh)) {
        report.stopped='A verificação parou: autor ou bot deixou de ser ADM.';break;
      }
      const current=(fresh.participants||[]).find(p=>[p.id,p.jid,p.phoneNumber,p.lid,p.participant].some(id=>identities.includes(id)));
      if(!current)continue;
      const currentIds=await expand(current);
      if(hasAdminRole(current)||currentIds.some(id=>isMainOwnerJid(id)||isLeaderJid(id)||isWhitelisted(from,id))||await protectedRemovalMessage(conn,from,target,{participants:fresh.participants})) {report.protected++;continue;}
      const latest=await checkAntiFakeParticipant(conn,from,current);
      if(!latest.known){report.unknown++;continue;}
      if(latest.allowed){report.allowed++;continue;}
      const removal=await removeAntiLinkParticipant(conn,from,[...currentIds,latest.pnJid].filter(Boolean));
      if(removal.ok)report.removed++;
      else report.failed.push({number:latest.number,reason:removal.error||removal.reason||'sem confirmação'});
      addAdminLog(from,{type:removal.ok?'banfake_remove':'banfake_failure',actor:sender,target,detail:removal.ok?'Número fora dos prefixos permitidos':removal.error||removal.reason});
      await pause(1200);
    }
    await reply(`🛡️ *BANFAKE — ${report.name}*\n\n✅ Removidos: ${report.removed}\n🌍 Prefixo permitido: ${report.allowed}\n🛡️ Protegidos: ${report.protected}\n❔ Telefone não confirmado: ${report.unknown}\n⚠️ Falhas: ${report.failed.length}${report.failed.length?'\n'+report.failed.slice(0,15).map(x=>`• +${x.number}: ${x.reason}`).join('\n'):''}${report.failed.length>15?'\nConsulte /logs para as demais falhas.':''}${report.stopped?'\n\n'+report.stopped:''}`);
    return report;
  } catch(error) {
    console.error('[BANFAKE]',error?.message);
    return reply('Não consegui concluir a verificação. Confira as permissões de ADM e tente novamente.');
  } finally {running.delete(from);}
}
