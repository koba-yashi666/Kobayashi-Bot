import {
  activateLicense,
  validateLicense,
  getEffectiveLicense,
  getLicenseConfig,
  saveLicenseConfig,
  clearLicenseState,
  maskLicenseKey
} from "../lib/features/license/licenseManager.js";
import fs from "node:fs";
import path from "node:path";

function localVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "version.json"), "utf8"))?.version || "0.0.0";
  } catch { return "0.0.0"; }
}

const args = process.argv.slice(2);
const action = String(args.shift() || "status").toLowerCase();

function valueAfter(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : "";
}

function showStatus() {
  const lic = getEffectiveLicense();
  const cfg = getLicenseConfig();

  console.log("🐉 KOBAYASHI BOT • LICENÇA");
  console.log(`Versão: ${localVersion()}`);
  console.log(`Modo: ${lic.mode}`);
  console.log(`Licença: ${lic.valid ? "ATIVA ✅" : "NÃO ATIVADA ❌"}`);
  console.log(`Plano: ${lic.plan || "-"}`);
  console.log(`Cliente: ${lic.customer || "-"}`);
  console.log(`Atualizações: ${lic.updates ? "LIBERADAS ✅" : "BLOQUEADAS ⛔"}`);
  console.log(`Chave: ${maskLicenseKey(lic.key)}`);
  console.log(`Instalação: ${lic.installationId}`);
  console.log(`API: ${cfg.apiBase || "não configurada"}`);
  console.log(`Manifesto: ${cfg.manifestUrl || "fallback do repositório atual"}`);
  console.log(`Canal: ${cfg.channel}`);
}

try {
  if (action === "activate" || action === "ativar") {
    const key = String(args[0] || "").trim();
    if (!key) throw new Error("Use: npm run license:activate -- SUA-CHAVE");
    const result = await activateLicense(key, localVersion());
    console.log("✅ Licença ativada.");
    console.log(`Plano: ${result.plan || "-"}`);
    console.log(`Cliente: ${result.customer || "-"}`);
    console.log(`Atualizações: ${result.updates ? "liberadas" : "bloqueadas"}`);
  } else if (action === "validate" || action === "validar") {
    const result = await validateLicense({ force: true, version: localVersion() });
    console.log(result.valid ? "✅ Licença válida." : "❌ Licença inválida.");
    showStatus();
  } else if (action === "clear" || action === "limpar") {
    clearLicenseState();
    console.log("✅ Ativação local removida. O ID da instalação foi preservado.");
  } else if (action === "configure" || action === "configurar") {
    const api = valueAfter("--api");
    const manifest = valueAfter("--manifest");
    const channel = valueAfter("--channel");

    const patch = {};
    if (api) patch.apiBase = api;
    if (manifest) patch.manifestUrl = manifest;
    if (channel) patch.channel = channel;

    if (!Object.keys(patch).length) {
      console.log("Use:");
      console.log("npm run license:configure -- --api https://seu-servidor");
      console.log("npm run license:configure -- --manifest https://.../latest.json");
      console.log("npm run license:configure -- --channel stable");
      process.exit(0);
    }

    const cfg = saveLicenseConfig(patch);
    console.log("✅ Configuração salva.");
    console.log(JSON.stringify(cfg, null, 2));
  } else {
    showStatus();
  }
} catch (e) {
  console.error(`❌ ${e?.message || e}`);
  process.exitCode = 1;
}
