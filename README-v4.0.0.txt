KOBAYASHI BOT v4.0.0 — LICENÇA + ATUALIZADOR OFICIAL

Objetivo:
Permitir venda permanente do bot, deixando hospedagem por conta do comprador
(VPS/painel/Termux), e permitir futuras atualizações oficiais.

COMANDOS NO WHATSAPP
/licenca
/ativarlicenca SUA-CHAVE
/verificarupdate
/atualizar

TERMUX — CLIENTE
cd ~/Kobayashi-Bot
npm install

# Configurar servidor de licença:
npm run license:configure -- --api https://SEU-SERVIDOR-DE-LICENCA

# Configurar manifesto das releases:
npm run license:configure -- --manifest https://SEU-DOMINIO/latest.json

# Canal estável:
npm run license:configure -- --channel stable

# Ativar:
npm run license:activate -- KOBA-XXXX-XXXX-XXXX

# Conferir:
npm run license:status

# Revalidar:
npm run license:validate

# Iniciar:
npm start

ARQUIVOS LOCAIS PRESERVADOS EM UPDATE
- settings/settings.json
- settings/LOGOS/menu.png
- files/database/
- files/license/
- .env
- .git/
- node_modules/

O serviço remoto de licenças ainda precisa ser hospedado pelo criador.
O contrato esperado está em docs/license-api-contract.md.
Um manifesto de release está em docs/release-manifest-example.json.
