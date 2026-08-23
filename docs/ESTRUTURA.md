# 🐉 Kobayashi Bot — Estrutura da base

A v0.1.37 inicia a preparação estrutural para a v0.2.0.

## Núcleo
- `index.js` — roteamento e execução dos comandos.
- `connection.js` — conexão e eventos do WhatsApp.
- `bootstrap.js` — inicialização/migrações.
- `updater.js` — atualização do bot.

## Bibliotecas
- `lib/core/` — utilidades genéricas da base.
- `lib/config/` — leitura e gravação de configurações.
- `lib/features/` — sistemas independentes (Welcome, horários, stickers, lista branca etc.).
- `lib/moderation/` — dados e recursos de moderação.

## Interface
- `settings/imports/menus.js` — menus enviados aos usuários.
- `settings/FUN/` — mídias do modo brincadeira.
- `settings/LOGOS/` — imagens de menu.

## Dados
Os dados continuam nos mesmos locais usados pelas versões anteriores para preservar compatibilidade com instalações existentes. Os caminhos internos não precisam aparecer nas mensagens do WhatsApp.

## Próximas etapas até v0.2
1. Migrar blocos de comandos do `index.js` para `commands/`.
2. Centralizar permissões (dono, líder, ADM e membro).
3. Criar `/configgp` e `/diagnostico`.
4. Revisar menus e remover aliases/trechos obsoletos.
