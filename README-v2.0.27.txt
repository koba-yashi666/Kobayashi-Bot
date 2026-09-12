Kobayashi Bot v2.0.27 — Perfil Hierarquia ADM Fix

Correção:
O /perfil não reconhecia corretamente alguns administradores porque o WhatsApp
pode representar o mesmo usuário por JID telefônico (@s.whatsapp.net) ou LID (@lid).

Agora o perfil cruza:
- participant metadata
- getGroupAdmins()
- JID normalizado
- número telefônico
- LID
- aliases resolvidos por getPNForJid()

Resultado:
Quem for ADM real do grupo aparece como:
🔱 ADM: 〔 ✅ 〕

Dono/Líder/ADM são indicadores independentes.
O /perfil antigo continua substituído; não foi criado handler duplicado.
