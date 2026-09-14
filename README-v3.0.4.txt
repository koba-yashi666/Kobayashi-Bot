Kobayashi Bot v3.0.4 — Dono PN/LID Fix

Corrige o reconhecimento do dono principal em versões recentes do WhatsApp/Baileys.

A Kobayashi agora reconhece o dono através de:
- PN (@s.whatsapp.net)
- LID (@lid)
- participant
- participantAlt
- phoneNumber presente nos metadados do grupo
- número configurado comparado somente pelos dígitos

Isso evita que comandos de dono sejam bloqueados quando o WhatsApp muda o identificador entregue na mensagem.
