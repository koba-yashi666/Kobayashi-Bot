# 🐉 Kobayashi Bot — Estrutura rumo à v0.2.0

A série v0.1.3x começou a desmontar o `index.js` monolítico sem quebrar os comandos estáveis.

## Entrada principal
- `index.js` — compatibilidade com comandos antigos + ponte para o roteador modular.
- `connection.js` — conexão, eventos e sistemas em tempo real.
- `bootstrap.js` — inicialização e migrações.
- `updater.js` — atualização.

## Comandos modulares
- `commands/general/` — comandos para membros.
- `commands/group/` — configuração e utilidades de grupos.
- `commands/admin/` — moderação e administração.
- `commands/owner/` — dono, configuração global e manutenção.
- `commands/registry.js` — registro e roteamento dos comandos novos.

Os comandos antigos serão migrados para essas pastas aos poucos. Isso evita uma mudança gigante e arriscada de uma vez.

## Núcleo
- `lib/core/permissions.js` — níveis Membro → Premium → ADM → Líder → Dono.
- `lib/core/backupManager.js` — backups internos dos bancos.
- `lib/core/jsonStore.js` — leitura/gravação JSON.

## Sistemas
- `lib/features/welcomeConfig.js`
- `lib/features/groupSchedule.js`
- `lib/features/autoSticker.js`
- `lib/features/whitelist.js`
- `lib/features/stickerCommands.js`
- `lib/features/adminLogs.js`

## Moderação
- `lib/moderation/advStore.js`

## Configuração
- `lib/config/settingsStore.js`

## Interface
- `settings/imports/menus.js`
- `settings/FUN/`
- `settings/LOGOS/`

## Painéis adicionados
- `/configgp` — resumo das configurações do grupo.
- `/configbot` — resumo seguro da configuração global.
- `/help` — documentação modular.
- `/logadm` — logs administrativos.
- `/backupdb` — backup interno.

## Meta para v0.2.0
Migrar gradualmente os `case` restantes para `commands/`, centralizar permissões e deixar o `index.js` focado apenas em contexto, automações e roteamento.
