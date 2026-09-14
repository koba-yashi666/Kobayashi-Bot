Kobayashi Bot v3.0.9 — Blacklist Purge Global Fix

Corrige /ban_msg, /listanegra e /listanegrag.

Ao bloquear alguém, a Kobayashi:
1. lista todos os grupos em que participa;
2. atualiza os metadados de cada grupo;
3. identifica onde ela própria é ADM;
4. procura a pessoa por PN/LID/phoneNumber/participant;
5. tenta remover usando os identificadores reais do participante;
6. informa quantos grupos verificou, em quantos era ADM, onde achou a pessoa,
   quantas remoções deram certo e quantas falharam.

/listanegrag executa a varredura novamente mesmo se o usuário já estiver
na lista global.
