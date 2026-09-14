KOBAYASHI BOT v4.0.1 — DISTRIBUIÇÃO PROTEGIDA + BUILD CLIENTE

NOVIDADE PRINCIPAL
- npm run build:client gera automaticamente a edição para comprador.
- Não exporta sessão, bancos de dados, licença local, logs, backups, node_modules,
  cache NPM, ZIPs antigos ou arquivos históricos de desenvolvimento.
- settings/settings.json é criado sanitizado para o comprador.
- JavaScript distribuído recebe proteção/ofuscação segura compatível com ESM.
- O ZIP do comprador recebe validação de sintaxe antes de ser criado.

IMPORTANTE
A fonte oficial continua limpa para desenvolvimento.
Somente o ZIP destinado ao comprador deve ser distribuído.

GERAR CLIENTE
npm run build:client

Saída:
dist/Kobayashi-Bot-v4.0.1-Cliente-Protegido.zip

A ofuscação dificulta leitura e alteração casual, mas JavaScript entregue ao cliente
não pode ser tornado matematicamente impossível de analisar. Licença + atualizador
oficial continuam sendo a proteção principal de distribuição.
