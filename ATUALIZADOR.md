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

## v0.1.11-beta
- Novo visual do menu inspirado no menu enviado pelo proprietário.
- `/admins` / `/adms`: lista administradores do grupo.
- `/criador`: mostra os dados do criador do projeto.
- `/dono`: mostra o dono atualmente configurado.
- `/infoadv`: explica o sistema de 3 advertências.
- Fonte de `/figurinhas` mantida sem alterações nesta versão.

## v0.1.12-beta
- Nova identidade visual própria e minimalista: KOBAYASHI SYSTEM.
- Menu principal: Dragon Panel.
- Menu ADM: Guardian Panel.
- Menu do dono: Dragon Core.
- Menu VIP: Dragon VIP.
- Ping redesenhado como System Status.
- Nenhuma alteração no sistema de figurinhas nesta versão.

## v0.1.13-beta
- Nova identidade visual oficial Kobayashi.
- Visual floral detalhado, mantendo Kobayashi como tema central.
- Menus principal, ADM, dono, VIP e ping redesenhados.

## v0.1.14-beta
- `/criador` redesenhado.
- Adicionados link de WhatsApp, GitHub e Instagram do criador.
- GitHub e Instagram configuráveis pelo `settings/settings.json`.

## v0.1.15-beta
- Novo `/menubn` (Kobayashi Fun).
- `/modobrincadeira` exclusivo de ADM/dono; alterna ligado/desligado por grupo.
- Todos os membros podem usar as brincadeiras quando o modo está ativo.
- Comandos: linda, lindo, gay, hetero, abraco, gado, shipo, gostosa, gostoso.
- Rankings: ranklinda, ranklindo, rankgay, rankhetero, rankgostosa, rankgostoso.
- Scores são persistentes em `files/database/brincadeiras.json`.
- Imagens locais temáticas incluídas, sem depender de APIs externas.

## v0.1.16-beta
- Banco de imagens/links importado da base Hutao enviada pelo proprietário.
- Kobayashi Fun agora usa imagens/GIFs correspondentes a linda, lindo, gay, hetero, abraço, gado, shipo, gostosa e gostoso.
- Rankings usam mídias específicas quando disponíveis.
- Cards locais continuam como fallback caso algum link externo falhe.
- Banco salvo em `settings/FUN/imglinks.json` e mapeamento em `settings/FUN/mapa-imagens.json`.

## v0.1.17-beta
- Rankings do Modo Brincadeira agora sorteiam membros diferentes do grupo em cada execução.
- Nenhum membro se repete dentro do mesmo ranking.
- Porcentagens são aleatórias de 0% a 100% em toda execução.
- O ranking é reordenado pela porcentagem sorteada.
- Os comandos individuais continuam com o comportamento anterior.

## v0.1.18-beta
- `/gp a`: abre o grupo; `/gp f`: fecha o grupo. Somente ADM.
- `/autosticker`: alterna conversão automática de fotos por grupo. Somente ADM pode ativar/desativar.
- Figurinhas criadas por `/s` e pelo autosticker recebem metadados com usuário, grupo, bot e criador.
- Dono/criador padrão alterado para `✧༒☬ƙσႦαყαʂԋι☬༒✧` com migração automática para instalações que ainda usam `Theo`.
- Observação: o WhatsApp não suporta legenda visível em sticker; os dados ficam nos metadados/informações do pacote da figurinha.

## v0.1.19-beta
- Sistema de múltiplos donos/líderes com até 5 slots (`/dono1` até `/dono5`).
- `/lideres` mostra os líderes configurados.
- Líderes passam a usar comandos anteriormente exclusivos do dono.
- Apenas o dono principal pode alterar líderes ou configurações críticas: número do bot, número do dono, prefixo, foto do menu, Anti-PV e atualização do bot.
- Configuração salva em `settings.settings.json -> leaders`.
