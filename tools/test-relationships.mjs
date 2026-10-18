import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const old=process.cwd(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'koba-relationships-')),originalNow=Date.now;
process.chdir(tmp);
try {
  const r=await import('../lib/features/social/relationships.js');
  const fun=await import('../commands/fun/dragonFun.js');
  let now=1800000000000;Date.now=()=>now;
  const a='5511111111111@s.whatsapp.net',b='5522222222222@s.whatsapp.net',c='5533333333333@s.whatsapp.net',lid='999999999@lid';
  assert.equal(r.proposeDating(a,a).reason,'self');
  assert(r.proposeDating(a,b).ok);
  assert.equal(r.proposeDating(c,b).reason,'pendente');
  assert(!r.acceptDating(c).ok);
  assert(r.acceptDating(b).ok);
  assert.equal(r.datingOf(a).partner,b);assert.equal(r.datingOf(b).partner,a);
  assert.equal(r.proposeMarriage(a,b).reason,'tempo');
  now+=86400000;assert(r.proposeMarriage(a,b).ok);
  assert(!r.acceptMarriage(c).ok);assert(r.acceptMarriage(b).ok);
  assert.equal(r.marriageOf(a),b);assert.equal(r.marriageOf(b),a);assert(!r.datingOf(a));
  assert.equal(r.proposeDating(c,b).reason,'casado');
  assert(r.divorce(b).ok);assert(!r.marriageOf(a));assert(!r.marriageOf(b));
  assert(r.proposeDating(a,b).ok);assert(r.rejectRelationship(b,'dating').ok);assert(!r.acceptDating(b).ok);
  assert(r.proposeDating(a,b).ok);assert(!r.cancelRelationship(c).ok);assert(r.cancelRelationship(a).ok);assert(!r.acceptDating(b).ok);
  assert(r.proposeDating(a,b).ok);now+=1800001;assert(!r.acceptDating(b).ok);
  assert(r.proposeDating(a,b).ok);assert(r.acceptDating(b).ok);now+=86400000;
  assert(r.proposeMarriage(a,b).ok);assert(r.endDating(a).ok);assert(!r.datingOf(b));assert(!r.acceptMarriage(b).ok);
  assert(r.proposeDating(lid,b).ok);assert(r.acceptDating(b).ok);
  assert(r.mergeRelationshipAliases([[a,lid]]).ok);assert.equal(r.datingOf(a).partner,b);assert.equal(r.datingOf(b).partner,a);
  // Estado mudou depois do pedido: aceitação não sobrescreve outro casamento.
  now+=86400000;assert(r.proposeMarriage(a,b).ok);
  const file='files/database/dragon-fun-v09.json';let db=JSON.parse(fs.readFileSync(file));db.marriages[b]=c;db.marriages[c]=b;fs.writeFileSync(file,JSON.stringify(db));
  assert.equal(r.acceptMarriage(b).reason,'casado');assert.equal(r.marriageOf(b),c);
  assert(r.divorce(b).ok);r.endDating(a);
  const outputs=[],ctx={from:'g@g.us',sender:a,command:'namoro',prefix:'/',info:{key:{participant:a},message:{extendedTextMessage:{contextInfo:{mentionedJid:[b]}}}},groupMembers:[],resolveDisplayJid:async id=>id,reply:async text=>outputs.push({text}),conn:{user:{id:'5544444444444@s.whatsapp.net'},sendMessage:async(j,p)=>outputs.push(p)}};
  await fun.default.execute(ctx);assert(outputs.at(-1).text.includes('pediu'));
  await fun.default.execute({...ctx,sender:b,command:'aceitar_namoro',info:{key:{participant:b}}});assert(outputs.at(-1).text.includes('namorando'));
  await fun.default.execute({...ctx,command:'relacionamento'});assert(outputs.at(-1).text.includes('Namoro'));assert(outputs.at(-1).mentions.includes(b));
  await fun.default.execute({...ctx,command:'terminarnamoro'});assert(outputs.at(-1).text.includes('terminaram'));
  console.log('✅ Relacionamentos: PN/LID, consentimento, exclusividade, prazo, casamento após 24h, recusa, cancelamento, término, divórcio e dispatcher.');
} finally {Date.now=originalNow;process.chdir(old);fs.rmSync(tmp,{recursive:true,force:true});}
