# 🐉🌸 Atualizador do Kobayashi Bot

## Comandos
- `/version` — compara a versão instalada com o GitHub.
- `/update` — exclusivo do dono; baixa a nova versão, instala dependências e reinicia.

## Dados preservados
O atualizador NÃO substitui:
- `settings/settings.json`
- `files/database/`
- `.env`
- `node_modules/`

## Importante
O repositório do GitHub precisa manter a estrutura original de pastas.

## Teste v0.1.4
- `/statusatt` — comando ADM criado para confirmar que a v0.1.4 foi realmente carregada após o `/update`.

## Correção v0.1.7
- Comandos em legendas de imagens/vídeos agora são reconhecidos.
- `/s`, `/foto_gp` e `/foto_menu` aceitam a mídia enviada junto com o próprio comando, sem precisar responder outra mensagem.
