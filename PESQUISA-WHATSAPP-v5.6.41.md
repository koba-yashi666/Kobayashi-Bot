# Pesquisa e correção — WhatsApp / Kobayashi

Consulta: 21/11/2026. Escopo: fontes públicas acessíveis por busca e páginas técnicas. Não houve acesso a conteúdo privado, vídeos completos nem sessão real do WhatsApp.

## O que foi possível confirmar

**Visualização única:** a documentação do WhatsApp descreve restrições para copiar, salvar, compartilhar e capturar a tela. Essa proteção não equivale a uma falha na conversão de figurinhas. Não encontrei uma confirmação oficial de uma nova alteração geral que explique todos os bots mencionados pelo usuário. O pacote não implementa formas de revelar ou contornar essas restrições.

Fonte: [WhatsApp — About view once](https://faq.whatsapp.com/1077018839582332).

**Download de figurinhas comuns:** a issue #1557 descreveu falha com figurinhas do WhatsApp Web. Foi associada à PR #1560, com validação da URL e confirmação de funcionamento pelo relator; a PR foi incorporada em 30/06/2025. É um problema documentado anterior, não prova de uma mudança geral em novembro de 2026.

Fontes: [issue #1557](https://github.com/WhiskeySockets/Baileys/issues/1557), [PR #1560](https://github.com/WhiskeySockets/Baileys/pull/1560).

**Chave ausente e rede:** a issue #2546 reúne relatos de `fetch failed` e `Cannot derive from empty media key`. Parte da telemetria relatada corresponde especificamente a canais/newsletters. Esses dados não permitem atribuir automaticamente o erro de um grupo à mesma causa. O encerramento da issue não comprova que todos os formatos ou cenários foram resolvidos.

Fonte: [issue #2546](https://github.com/WhiskeySockets/Baileys/issues/2546).

**Roteamento de mídia por conexão:** a PR #2588 trata do endereço de download associado à conexão. Isso motivou a preferência pelo método de download do próprio socket quando existir; versões que não o expõem continuam usando a função recebida pelo bot. Não foram instalados forks.

Fonte: [PR #2588](https://github.com/WhiskeySockets/Baileys/pull/2588).

**Novo formato Lottie:** a PR #2776 propôs normalização do envelope Lottie; a página consultada mostra encerramento por inatividade. Não a tratei como correção incorporada nem instalei a proposta. O pacote não promete converter Lottie em WebP.

Fonte: [PR #2776](https://github.com/WhiskeySockets/Baileys/pull/2776).

Foram feitas buscas públicas também com filtros para YouTube e Instagram. Os resultados encontrados não forneceram uma correção técnica verificável para esta aplicação. Tutoriais sobre cache do aplicativo não demonstram solução para o download feito pelo Baileys; não foram usados como fundamento da alteração.

## Falha encontrada no código local

O comando manual priorizava `downloadContentFromMessage` quando recebia caminho e chave, mas encerrava a tentativa em 404/410 sem pedir a atualização da mídia comum. Além disso, chaves serializadas não eram normalizadas de modo consistente. Isso é um defeito reproduzível localmente, mas ainda não confirma a causa de cada falha observada pelo usuário.

## Alteração entregue

- Comandos manuais e autosticker usam um helper compartilhado.
- A rota direta solicita no máximo uma atualização da própria mídia comum em 404/410, desde que tenha ID e chave; confere a identidade da resposta.
- Chaves em formatos de serialização conhecidos são normalizadas.
- O download da conexão é preferido quando exposto pela biblioteca.
- O limite de 32 MiB e a rejeição de resultado vazio também valem para o retorno em buffer.
- Mídia protegida não é guardada nem baixada pelo fluxo de figurinhas. O comando orienta pedir o reenvio como mídia comum.

## Testes e limites

48 envios simulados cobrem fotos, vídeos e figurinhas comuns, envelopes comuns, comandos /s e /s2 e respostas. Casos adicionais verificam recuperação 404/410, falha persistente, ausência de repetição em 401/403/429, chaves serializadas, identidade da mensagem, tamanho e mídia protegida. As regressões de aluguel e moderação são executadas no pacote.

Nenhum teste se conectou ao WhatsApp ou gerou cobrança real. Não se garante recuperar arquivos apagados, chaves ausentes, mídia indisponível no telefone ou formatos não suportados. A validação no bot conectado ainda é necessária.
