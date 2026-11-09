import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
const previous=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'koba-license-'));process.chdir(dir);
try{
 const issuer=String(process.env.KOBA_TEST_CREATOR_NUMBER||'').replace(/\D/g,'');
 const current=issuer||'5511000000000';fs.mkdirSync('settings');fs.writeFileSync('settings/settings.json',JSON.stringify({ownerNumber:current}));
 const local=await import('../lib/features/license/localLicense.js');const manager=await import('../lib/features/license/licenseManager.js');
 const conn={signalRepository:{lidMapping:{getPNForLID:async id=>id==='new-author@lid'?current+'@s.whatsapp.net':null}}};
 if(issuer)assert(await local.canIssueLocalLicense(conn,['new-author@lid']));
 assert(!await local.canIssueLocalLicense(conn,['5511444444444@s.whatsapp.net']));
 await assert.rejects(()=>local.issueLocalLicense({conn,identities:['5511444444444@s.whatsapp.net'],installationId:'x',customer:'Teste'}));
 const id=manager.getInstallationId(),identities=issuer?[current+'@s.whatsapp.net']:['69119714017511@lid'];
 const a=await local.issueLocalLicense({conn,identities,installationId:id,customer:'Teste'}),b=await local.issueLocalLicense({conn,identities,installationId:id,customer:'Teste'});
 assert.match(a.key,/^KOBA-LOCAL-[\w-]{32}$/);assert.notEqual(a.key,b.key);
 assert(!fs.readFileSync('files/license/local-keys.json','utf8').includes(a.key));
 assert(!manager.getEffectiveLicense().valid);await assert.rejects(()=>manager.activateLicense('KOBA-LOCAL-invalid'));
 const active=await manager.activateLicense(a.key);assert(active.valid&&active.updates);assert.equal(active.mode,'local');assert((await manager.assertUpdateLicense()).valid);assert((await manager.validateLicense({force:true})).valid);
 assert(local.localLicenseStatus(id).valid);assert(!local.localLicenseStatus('outra-instalacao').valid);
 fs.writeFileSync('settings/settings.json',JSON.stringify({ownerNumber:'5511333333333'}));assert(!manager.getEffectiveLicense().valid);await assert.rejects(()=>manager.assertUpdateLicense());fs.writeFileSync('settings/settings.json',JSON.stringify({ownerNumber:current}));
 await local.revokeLocalLicense({conn,identities,key:a.key});assert(!manager.getEffectiveLicense().valid);await assert.rejects(()=>manager.assertUpdateLicense());await assert.rejects(()=>manager.activateLicense(a.key));
 manager.clearLicenseState();assert(!manager.getEffectiveLicense().valid);
 // Clientes com licença remota/cached continuam usando o caminho existente.
 fs.writeFileSync('files/license/license.json',JSON.stringify({installationId:id,key:'legacy-test',valid:true,updates:true,lastValidatedAt:Date.now()}));assert(manager.getEffectiveLicense().valid);assert((await manager.assertUpdateLicense()).valid);
 fs.writeFileSync('files/license/local-keys.json','broken');await assert.rejects(()=>local.issueLocalLicense({conn,identities,installationId:id,customer:'Teste'}));assert.equal(fs.readFileSync('files/license/local-keys.json','utf8'),'broken');
 console.log('✅ Licença: emissão exclusiva, chaves aleatórias, hash em disco, ativação local, vínculo de instalação/dono, revogação, dados legados e erro sem sobrescrita.');
}finally{process.chdir(previous);fs.rmSync(dir,{recursive:true,force:true});}
