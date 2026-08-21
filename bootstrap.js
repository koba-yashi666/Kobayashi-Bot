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

// KOBAYASHI_OWNER_MIGRATION_V0118
try {
  const fs = (await import("node:fs")).default;
  const settingsUrl = new URL("./settings/settings.json", import.meta.url);
  const cfg = JSON.parse(fs.readFileSync(settingsUrl, "utf8"));
  let changed = false;

  if (!cfg.ownerName || cfg.ownerName === "Theo") {
    cfg.ownerName = "✧༒☬ƙσႦαყαʂԋι☬༒✧";
    changed = true;
  }
  if (!cfg.creatorName || cfg.creatorName === "Theo") {
    cfg.creatorName = "✧༒☬ƙσႦαყαʂԋι☬༒✧";
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(settingsUrl, JSON.stringify(cfg, null, 2), "utf8");
    console.log("🌸 Nome do dono/criador atualizado para o tema Kobayashi.");
  }
} catch (e) {
  console.error("⚠️ Não foi possível aplicar a migração de nome:", e?.message || e);
}


await import('./connection.js');
