# 🐉🌸 Kobayashi Bot

> Base em desenvolvimento — preparação para a v0.2.0.

## Estrutura atual
A partir da v0.1.37, os sistemas internos começaram a ser separados por responsabilidade para reduzir o tamanho do `index.js` e facilitar manutenção.

- `lib/core` → utilidades compartilhadas
- `lib/config` → configurações
- `lib/features` → recursos independentes
- `lib/moderation` → moderação
- `docs/ESTRUTURA.md` → mapa técnico da base

As mensagens enviadas aos usuários foram limpas para evitar mostrar detalhes internos como hospedagem, caminhos de arquivos e nomes de serviços usados por trás do bot.

---

# 🐉🌸 Kobayashi Bot — Beta v0.1.2

## Correção da inicialização no Pterodactyl

A v0.1.2 inclui um `bootstrap.js` que detecta quando as dependências ainda não foram instaladas e executa `npm install` automaticamente antes de iniciar o bot.

### Opção recomendada
No Pterodactyl, use como comando de inicialização:

```bash
npm start
```

Se o painel já estiver configurado para executar `node connection.js`, altere para `npm start`.

### Alternativa manual
No terminal do servidor, dentro da pasta do bot:

```bash
npm install --no-audit --no-fund
npm start
```

Depois disso, o bot deverá pedir o número para gerar o código de pareamento:

```text
🐉🌸 Digite o número do WhatsApp com DDI (somente números):
```

## Pareamento

1. Digite o número com DDI, por exemplo `5511999999999`.
2. Copie o código exibido.
3. No WhatsApp: **Configurações → Dispositivos conectados → Conectar com número de telefone**.
4. Informe o código.
5. Aguarde o terminal mostrar `Kobayashi Bot conectado com sucesso!`.

## Se continuar dando MODULE_NOT_FOUND

Execute:

```bash
rm -rf node_modules package-lock.json
npm install --no-audit --no-fund
npm start
```

Não apague `files/database/qr-code` se quiser preservar uma sessão já pareada.


## 🐉🌸 Comandos adicionados na Beta 0.1.2

- `/banc` ou `/b` — remove um membro do grupo (admin + bot admin).
- `/stickers` ou `/s` — transforma imagem, vídeo curto ou figurinha respondida em figurinha. Vídeos dependem do FFmpeg no servidor.
- `/adv @membro [motivo]` — registra uma advertência persistente no grupo.
- `/perfil [@membro]` — mostra perfil básico e quantidade de advertências no grupo.
- `/menudono` foi adicionado como alias de `/menuowner`.
- `/menuvip` foi criado como categoria inicial para futuras funções VIP.

### ⚠️ Atualização
A pasta `files/database/qr-code` não deve ser apagada no servidor atual, pois contém a sessão do WhatsApp já pareada. Este pacote de atualização não inclui a sessão por segurança.
