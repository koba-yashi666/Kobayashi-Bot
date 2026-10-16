import assert from 'node:assert/strict';
import fs from 'node:fs';
import { authorIdentities, isPhoneIdentity, OWNER_COMMANDS } from '../lib/features/access/ownerAccess.js';
import { createPermissions, PERMISSION_LEVELS } from '../lib/core/permissions.js';

const owner = '5511999999999@s.whatsapp.net';
const member = '5511888888888@s.whatsapp.net';
const spoofed = {
  key: {remoteJid:'123@g.us',participant:member},
  participant:owner,
  message:{extendedTextMessage:{contextInfo:{participant:owner,participantAlt:owner,mentionedJid:[owner]}}}
};
assert.deepEqual(authorIdentities(spoofed.key), [member]);
assert.deepEqual(authorIdentities({remoteJid:member,remoteJidAlt:'123456789@lid',participant:owner}), [member,'123456789@lid']);
assert.deepEqual(authorIdentities({remoteJid:'123@g.us'}), []);
assert.deepEqual(authorIdentities({remoteJid:'123@g.us',participant:'123456789@lid',participantAlt:owner}), ['123456789@lid',owner]);
assert.deepEqual(authorIdentities({fromMe:true,participant:owner},{id:'5511777777777:2@s.whatsapp.net'}), ['5511777777777@s.whatsapp.net']);
assert.equal(isPhoneIdentity('5511999999999@lid'), false);
assert.equal(isPhoneIdentity(owner), true);
for (const args of [{}, {isGroup:true,groupAdmins:[member]}, {isLeader:true}]) {
  const permissions = createPermissions({sender:member,...args});
  assert.equal(permissions.isOwner, false);
  assert.equal(permissions.can(PERMISSION_LEVELS.OWNER), false);
}
assert.equal(createPermissions({isMainOwner:true}).can(PERMISSION_LEVELS.OWNER), true);
for (const command of ['menudono','msg','dragon-msg','dragonban','add_vip','update','debugdono']) assert(OWNER_COMMANDS.has(command));
assert(!OWNER_COMMANDS.has('menu'));
assert(!OWNER_COMMANDS.has('atividade'));
assert(!OWNER_COMMANDS.has('promover'));
// Verifica que o núcleo utiliza a identidade segura e barra antes dos módulos.
const source=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8');
assert(source.includes('const incomingIdentityCandidates = authorIdentities(info.key, conn.user);'));
assert(source.includes('const SoDono = SoDonoPrincipal;'));
assert(source.includes('!digits || !isPhoneIdentity(jid)'));
assert(source.indexOf('if (OWNER_COMMANDS.has(command)') < source.indexOf('if(await handleCommunityCommand'));
assert(!source.includes('ownerJids: [...new Set([dono, ...ownerIdentityCandidates]'));
console.log('✅ Permissões: resposta/menção não concede dono; membro, ADM e líder sem acesso OWNER.');
