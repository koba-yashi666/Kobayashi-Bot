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

## v0.1.20-beta
- `/antilink`: bloqueia links em geral; apaga e remove o remetente.
- `/antilinkgp`: bloqueia links de grupos/canais do WhatsApp; apaga e remove.
- `/antilinklight`: apaga links e aplica uma ADV; 3/3 pode remover automaticamente.
- `/antitelegram`: bloqueia links do Telegram; apaga e remove.
- Proteções são ativadas/desativadas por grupo e apenas ADMs podem alternar.
- Administradores, dono e líderes são imunes aos filtros.
- `/suicidio`: remove do grupo o próprio membro que executou o comando.
- `/bam`: falso ban; imita a mensagem do `/ban` e após 10 segundos revela a pegadinha.

## v0.1.21-beta
- Novo `/listabranca` para exceções aos filtros de links.
- Apenas ADMs podem adicionar/remover membros da Lista Branca.
- Membros autorizados podem enviar links sem serem ADM.
- A Lista Branca é independente por grupo.
- `/listabranca add @membro`, `/listabranca del @membro` e `/listabranca` para consultar.

## v0.1.22-beta
- `/toimg`: converte figurinha para imagem PNG.
- `/togif`: converte figurinha animada para vídeo com reprodução GIF.
- `/take Pacote | Autor`: altera metadados de uma figurinha.
- Sistema de comandos por figurinha: `/setcmd`, `/delcmd`, `/listcmdsticker`.
- Figurinhas associadas passam a executar comandos quando enviadas no chat.
- Apenas ADM/líder/dono podem configurar comandos por figurinha.

## v0.1.23-beta
- Menu principal reduzido a cinco painéis: ADM, Dono, BN, Sticker e Geral.
- Novo `/menusticker`.
- Novo `/menugeral`.
- `/rgcmd` registra comandos em figurinhas e é restrito a ADM do grupo.
- Ferramentas administrativas de sticker também foram movidas para os menus adequados.

## v0.1.24-beta
- Novo `/play nome da música` para pesquisar no YouTube e enviar áudio MP3.
- `/play` também aceita URL do YouTube.
- Mostra thumbnail, título, canal e duração antes do áudio.
- Play adicionado ao Menu Geral.
- Bootstrap verifica/tenta instalar yt-dlp automaticamente.

### Fix do Play v0.1.24
- Removido executável externo yt-dlp.
- Download feito diretamente pelo Node com @distube/ytdl-core.
- Limite preventivo de 25 MB.

## v0.1.25-beta — Play via Yuta API
- `/play` refeito usando o backend de download observado no Hutao V10.
- Download usa `https://yuta-apis.xyz/api/downloads/ytaudio2`.
- Token configurável em `settings/settings.json -> yutaToken`.
- Novo `/yutatoken TOKEN`, exclusivo do dono principal, para configurar sem editar arquivos.
- Pesquisa por nome continua usando `yt-search`; o download é feito pela Yuta API.
- Removida dependência do ytdl-core para o Play.

## v0.1.26-beta — Sticker Engine Nazuna
- Criação de figurinhas refeita com base no sistema do Nazuna enviado pelo proprietário.
- Conversão WebP via FFmpeg/libwebp com compressão adaptativa.
- Limite aproximado de 990 KB e até 8 tentativas reduzindo qualidade quando necessário.
- Vídeos limitados a 9.9 segundos e 15 FPS.
- `/s`, `/st`, `/stk`, `/sticker` e `/stickers` usam o novo motor.
- Autosticker também usa o novo motor.
- Metadados personalizados da Kobayashi preservados: usuário, grupo, bot e criador.

## v0.1.27-beta — Boas-vindas
- `/bemvindo on/off`
- `/setbv`
- `/setbye`
- `/testebv`
- Variáveis `{user}`, `{group}`, `{count}` e foto de perfil quando disponível.

## v0.1.28-beta — Welcome Pro
- Entradas agrupadas por fila.
- `/tempobv 3-120`.
- `/setregrasbv`.
- `/setparceriasbv`.
- Variáveis `{membros}`, `{quantidade}`, `{adm}`, `{rejeitados}`.
- Tenta identificar o ADM via evento do WhatsApp quando disponível.
- Rejeitados ficam em 0 quando o WhatsApp não informa esse dado.

### Fix Welcome Pro v0.1.28
- `group-participants.update` agora é tratado dentro de `conn.ev.process`, junto aos demais eventos do Baileys.
- Adicionado log `[WELCOME PRO] Evento recebido` para confirmar entradas/saídas na hospedagem.
- Mantida fila de agrupamento e configurações por grupo.

## v0.1.29-beta — Welcome Pro Fix
- Versão incrementada para que o updater reconheça a correção.
- Mantido o tratamento de `group-participants.update` dentro de `conn.ev.process`.
- Mantido log `[WELCOME PRO] Evento recebido` para diagnóstico.

## v0.1.30-beta — /add + Welcome Pro
- Novo `/add numero`, exclusivo para administradores do grupo.
- O bot precisa ser administrador para executar a adição.
- A entrada confirmada pelo WhatsApp cai naturalmente no evento `group-participants.update`, então o novo membro entra na fila do Welcome Pro.
- Tratamento básico de retorno e privacidade do WhatsApp.

## v0.1.31-beta — Solicitações + Welcome Fix
- `/add` agora aprova todas as solicitações pendentes do grupo.
- `/add numero` ou `/add @membro` tenta aprovar apenas uma solicitação específica.
- Welcome Pro ganhou fila reutilizável e `emitOwnEvents: true`.
- `/add` envia os aprovados diretamente à fila de boas-vindas, sem depender apenas do evento do WhatsApp.
- Entradas normais continuam sendo capturadas por `group-participants.update`.

## v0.1.32-beta — Welcome Bridge Fix
- Welcome agora possui dois caminhos de evento: `conn.ev.on` e `conn.ev.process`, com deduplicação.
- `/add` chama diretamente a fila de boas-vindas após aprovar solicitações.
- Envio possui fallback sem `mentions`, útil para JIDs/LIDs problemáticos.
- Novo `/statusbv` para conferir status do banco e se as funções do Welcome estão ligadas ao socket.
- Logs detalhados `[WELCOME]` adicionados para localizar qualquer falha restante.

## v0.1.33-beta — Welcome Nazuna
- Sistema de boas-vindas reconstruído seguindo a arquitetura do Nazuna enviado: `createGroupMessage` + `handleGroupParticipantsUpdate` + listener direto `group-participants.update`.
- Removida a fila/bridge experimental das versões anteriores.
- `/add` chama o mesmo handler usado pelas entradas reais após aprovar solicitações.
- Mantidos texto customizado, regras, parcerias, múltiplos membros e ADM que aprovou.
- Fallback para envio sem mentions em caso de JID/LID problemático.
- Logs `[WELCOME NAZUNA]` adicionados.

## v0.1.34-beta — Welcome Duplicate Fix
- Corrigido Welcome sendo enviado duas vezes após `/add`.
- Eventos do Baileys agora normalizam participantes retornados como objetos.
- Corrigido `@[object Object]` no texto.
- `author/actor` também é normalizado antes de mostrar quem aceitou/adicionou.
- Deduplicação existente agora compara os mesmos JIDs tanto no `/add` quanto no evento real.

## v0.1.35-beta — Group Schedule + Letra
- `/opengp HH:MM`: programa abertura diária do grupo.
- `/closegp HH:MM`: programa fechamento diário.
- `/opengp off` e `/closegp off`: removem os horários.
- `/linkgp`: envia o link do grupo; somente ADM.
- `/letra Artista - Música`: busca letra usando lyrics.ovh.
- Scheduler verifica horários a cada 30 segundos em `America/Sao_Paulo`.

## v0.1.36-beta — Remover horários de grupo
- `/rm_closegp`: remove o horário de fechamento automático do grupo.
- `/rm_opengp`: remove o horário de abertura automática do grupo.
- Ambos são exclusivos para administradores e avisam quando não existe horário configurado.

## v0.1.37-beta — Organização Base
- Iniciada a reorganização estrutural para a futura v0.2.0.
- Criados `lib/core`, `lib/config`, `lib/features`, `lib/moderation` e `docs`.
- Horários de grupo, Welcome Config, Sticker Commands, Lista Branca, AutoSticker, settings e ADV foram extraídos do `index.js` para módulos próprios.
- Mensagens do Play deixaram de expor backend/API, hospedagem ou caminhos internos.
- Mensagens de erro de stickers foram simplificadas para o usuário final.
- Mensagem de logout deixou de expor pasta interna de autenticação.
- Adicionado `docs/ESTRUTURA.md` com o mapa da base.
