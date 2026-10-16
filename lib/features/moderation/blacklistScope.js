import { createPurgeResolver } from './groupPurge.js';

// Fotografia dos grupos atuais: falha de consulta nunca amplia o alcance.
export async function discoverBlacklistGroups(conn) {
  const live = await conn.groupFetchAllParticipating();
  if (!live || typeof live !== 'object' || Array.isArray(live)) throw Error('Não foi possível consultar os grupos atuais.');
  const expand = createPurgeResolver(conn);
  const botIds = new Set(await expand({id:conn.user?.id,lid:conn.user?.lid,phoneNumber:conn.user?.phoneNumber}));
  const groups=[], issues=[];
  for (const [jid,cached] of Object.entries(live)) {
    if (!jid.endsWith('@g.us')) continue;
    let name=cached?.subject || jid;
    try {
      const meta=await conn.groupMetadata(jid);
      name=meta.subject || name;
      if (!Array.isArray(meta.participants)) throw Error('Participantes indisponíveis');
      let bot;
      for (const p of meta.participants) {
        if ((await expand(p)).some(id=>botIds.has(id))) {bot=p;break;}
      }
      if (!bot) issues.push(`❔ ${name}: identidade da Kobayashi não confirmada.`);
      else if (bot.admin || bot.isAdmin || bot.isSuperAdmin) groups.push({jid,name});
      else issues.push(`🚫 ${name}: Kobayashi não é ADM.`);
    } catch (e) {issues.push(`⚠️ ${name}: não foi possível confirmar ADM (${e.message}).`);}
  }
  return {groups,issues};
}
