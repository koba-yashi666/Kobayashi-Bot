KOBAYASHI BOT v4.0.3 — PUBLICADOR DE UPDATES OFICIAIS

GERAR UMA RELEASE PARA OS COMPRADORES

Teste local:
npm run release:client -- --dry-run

Produção:
npm run release:client -- --base-url https://SEU-DOMINIO/releases --channel stable

Também pode definir:
export KOBAYASHI_RELEASE_BASE_URL="https://SEU-DOMINIO/releases"
npm run release:client

A pasta dist/ receberá:
- Kobayashi-Bot-v4.0.3-Cliente-Protegido.zip
- latest.json
- changelog-v4.0.3.json
- PUBLICAR-v4.0.3.txt
- relatório do build protegido

Publique o ZIP, latest.json e changelog no mesmo diretório público.
Os compradores apontam o manifesto com:
npm run license:configure -- --manifest https://SEU-DOMINIO/releases/latest.json
npm run license:configure -- --channel stable

Depois disso, /verificarupdate e /atualizar usam o manifesto oficial.
