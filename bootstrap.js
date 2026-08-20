import { spawnSync } from 'node:child_process';

function hasBaileys() {
  try {
    const result = spawnSync(process.execPath, ['-e', 'import("@whiskeysockets/baileys").then(()=>process.exit(0)).catch(()=>process.exit(1))'], { stdio: 'ignore' });
    return result.status === 0;
  } catch {
    return false;
  }
}

if (!hasBaileys()) {
  console.log('\n🐉🌸 Dependências do Kobayashi Bot não encontradas.');
  console.log('📦 Instalando as dependências automaticamente...\n');
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund'], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error('\n❌ Não foi possível instalar as dependências.');
    process.exit(result.status || 1);
  }
  console.log('\n✅ Dependências instaladas. Iniciando o Kobayashi Bot...\n');
}

await import('./connection.js');
