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

## Visual v0.1.8
- Menus principal, ADM, dono, VIP e status foram redesenhados.
- Novo estilo com molduras, divisórias, símbolos e tema 🐉🌸.
- Adicionado/garantido alias `/menudono`.

## v0.1.9-beta
- `/adv`: ao atingir 3/3 advertências, tenta remover o membro automaticamente e zera o contador após sucesso.
- `/figurinhas 1-15`: sistema de pacote aleatório baseado no comando `figurinhas` do Nazuna enviado pelo usuário.
- Em grupos, `/figurinhas` envia o pacote no privado de quem solicitou.
- Aliases: `/stickerpack` e `/packfig`.

## v0.1.10-beta
- `/figurinhas` sem número agora pede claramente uma quantidade entre 1 e 15.
- `/figurinhas 10` envia exatamente 10 figurinhas.
- Mensagens do comando redesenhadas com tema Kobayashi 🐉🌸.
