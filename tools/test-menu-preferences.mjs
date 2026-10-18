import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { menuButtonsEnabled, setMenuButtonsEnabled } from '../lib/ui/menuPreferences.js';
import { OWNER_COMMANDS } from '../lib/features/access/ownerAccess.js';
const old=process.cwd(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'koba-menu-'));
try {
  process.chdir(tmp);
  assert.equal(menuButtonsEnabled(),true);
  setMenuButtonsEnabled(false,'owner@s.whatsapp.net');
  assert.equal(menuButtonsEnabled(),false);
  const fresh=await import('../lib/ui/menuPreferences.js?restart');
  assert.equal(fresh.menuButtonsEnabled(),false);
  setMenuButtonsEnabled(true,'owner@s.whatsapp.net');assert.equal(fresh.menuButtonsEnabled(),true);
  assert.throws(()=>setMenuButtonsEnabled('off'),TypeError);
  assert(OWNER_COMMANDS.has('botao'));assert(OWNER_COMMANDS.has('botão'));
  const source=fs.readFileSync(new URL('../index.js',import.meta.url),'utf8');
  const handler=source.slice(source.indexOf('case "botão":'),source.indexOf('case "menu":'));
  assert(handler.includes('if (!SoDonoPrincipal)'));
  assert(source.includes('if (!menuButtonsEnabled() ||'));
  console.log('✅ Botões: padrão ligado, on/off persistente após recarga, bloqueio de valor inválido e restrição ao dono.');
} finally {process.chdir(old);fs.rmSync(tmp,{recursive:true,force:true});}
