# Kobayashi Bot v1.0 — Arquitetura

A v1.0 separa responsabilidades por domínio sem quebrar imports antigos.

- `commands/admin`: administração e diagnóstico.
- `commands/fun`: jogos, brincadeiras e menus de diversão.
- `commands/general`: utilidades gerais.
- `commands/group`: configuração por grupo.
- `commands/owner`: manutenção e dono.
- `lib/features/core`: runtimes centrais.
- `lib/features/moderation`: proteção, logs, blacklist, Sentinel e antispam.
- `lib/features/group`: boas-vindas, horários, autosticker e transferência de config.
- `lib/features/social`: Dragon Social, Dragon Fun/RPG, AFK e atividade.
- `lib/features/stickers`: fontes e comandos de figurinhas.
- `lib/features/rental`: aluguel e expiração.
- `lib/features/system`: aliases, bloqueios, estatísticas de comandos e notícias de update.

Arquivos diretamente em `lib/features/` são bridges de compatibilidade.
