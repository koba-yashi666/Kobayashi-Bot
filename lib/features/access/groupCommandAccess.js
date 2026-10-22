import { createPurgeResolver } from '../moderation/groupPurge.js';
export const GROUP_ADMIN_REQUIRED = '🔒 Você precisa ser administrador deste grupo para usar este comando.';
export const hasAdminRole = p => Boolean(p && (p.admin === 'admin' || p.admin === 'superadmin' || p.admin === true || p.isAdmin === true || p.isSuperAdmin === true));
export async function currentGroupAdmin(conn, group, identities, metadata) {
  const expand=createPurgeResolver(conn), known=new Set();
  for(const id of identities.filter(Boolean))for(const alias of await expand(id))known.add(alias);
  const meta=metadata || await conn.groupMetadata(group);
  for(const member of meta.participants || []) {
    if((await expand(member)).some(id=>known.has(id)))return hasAdminRole(member);
  }
  return false;
}

// Apenas ações administrativas recebem esta exigência adicional.
// Comandos comuns mantêm suas permissões de membro/VIP/dono no dispatcher.
export const GROUP_ADMIN_COMMANDS = new Set(`
ban b banc kobaban koban cafeban bang dragonban banfake banghost
adv rmadv zeraradv mute mutar muteb desmute desmutar unmute
listanegra rmlistanegra listanegrag rmlistanegrag
promover promote rebaixar demote promover2 adv_adm
antifake antilink antistts antistatus x9 cita recita
fechar abrir grupo novolink fotogp descgp nomegp add adicionar
`.trim().split(/\s+/));
export function requiresGroupAdmin(command) {
  return GROUP_ADMIN_COMMANDS.has(String(command || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase());
}
