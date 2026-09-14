Kobayashi Bot v3.0.8 — BAN MSG Global

/ban_msg texto
/ban_msg add texto
/ban_msg del 1
/ban_msg list
/ban_msg on
/ban_msg off

Quando uma mensagem contém um texto registrado:
1. o autor entra na Lista Negra Global;
2. a Kobayashi tenta removê-lo do grupo atual;
3. tenta removê-lo dos demais grupos;
4. envia auditoria ao dono com nome, número, grupo, horário e mensagem.

Banco runtime: files/database/ban-msg.json
O banco não é sobrescrito pelo ZIP.
