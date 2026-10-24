import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const old=process.cwd(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'koba-bye-'));process.chdir(tmp);
try {
 const {getWelcomeConfig,updateWelcomeConfig}=await import('../lib/features/group/welcomeConfig.js');
 const {handleDepartureCommand,departureNoticeAllowed}=await import('../lib/features/group/departureNotice.js');
 const {requiresGroupAdmin}=await import('../lib/features/access/groupCommandAccess.js');
 const out=[],ctx={isGroup:true,isAdmin:true,from:'a@g.us',reply:async s=>out.push(s)};
 updateWelcomeConfig(ctx.from,{enabled:true,welcome:'Olá!',bye:'Até!',byePhoto:'bye.jpg',welcomePhoto:'welcome.jpg'});
 assert(departureNoticeAllowed(getWelcomeConfig(ctx.from)));
 await handleDepartureCommand({...ctx,args:['off']});assert(!departureNoticeAllowed(getWelcomeConfig(ctx.from)));
 const cfg=getWelcomeConfig(ctx.from);assert(cfg.enabled);assert.equal(cfg.bye,'Até!');assert.equal(cfg.byePhoto,'bye.jpg');assert.equal(cfg.welcomePhoto,'welcome.jpg');assert.equal(cfg.welcome,'Olá!');
 assert(getWelcomeConfig('b@g.us').byeEnabled);
 await handleDepartureCommand({...ctx,isAdmin:false,args:['on']});assert(!getWelcomeConfig(ctx.from).byeEnabled);
 await handleDepartureCommand({...ctx,isGroup:false,args:['on']});assert(!getWelcomeConfig(ctx.from).byeEnabled);
 await handleDepartureCommand({...ctx,args:['banana']});assert(!getWelcomeConfig(ctx.from).byeEnabled);assert(out.at(-1).includes('OFF'));
 await handleDepartureCommand({...ctx,args:['on']});assert(departureNoticeAllowed(getWelcomeConfig(ctx.from)));
 assert(!departureNoticeAllowed({enabled:false,byeEnabled:true}));assert(departureNoticeAllowed({enabled:true}));
 assert(requiresGroupAdmin('saída'));assert(requiresGroupAdmin('saida'));assert(!requiresGroupAdmin('menu'));
 const raw=JSON.parse(fs.readFileSync('files/database/boas-vindas.json'));assert.equal(raw[ctx.from].byeEnabled,true);
 console.log('✅ Saída: ON/OFF, padrão legado, persistência, isolamento por grupo, permissões e preservação da recepção/texto/fotos.');
} finally {process.chdir(old);fs.rmSync(tmp,{recursive:true,force:true});}
