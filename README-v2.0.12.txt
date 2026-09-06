Kobayashi Bot v2.0.12 — Lista Branca Hard Guard

Mudança principal:
A Lista Branca agora possui uma trava no próprio conn.groupParticipantsUpdate.

Consequência:
- Se a Kobayashi tentar remover um membro protegido por QUALQUER sistema, a remoção é bloqueada antes de chegar ao WhatsApp.
- Isso vale para AntiLink, AntiSpam, AntiTrava, BanFake, Banghost, Lista Negra, Sentinel e outros handlers que usem o mesmo socket.
- Enquanto o membro estiver na Lista Branca, até um /ban executado pela Kobayashi é bloqueado.

Compatibilidade JID:
- Ao adicionar alguém, o bot salva os aliases disponíveis do participante:
  id, jid, participant, phoneNumber, lid e PN resolvido pelo Baileys.
- Isso corrige casos em que o WhatsApp entrega @lid em um lugar e @s.whatsapp.net em outro.

Para realmente remover alguém protegido:
1. /listabranca del @membro
2. depois /ban @membro

Logs:
[WHITELIST HARD GUARD] Remoção BLOQUEADA: ...
