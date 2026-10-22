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
