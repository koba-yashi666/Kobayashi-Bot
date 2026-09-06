Kobayashi Bot v2.0.11 — Lista Branca Protection Fix

Correções:
- Recriado/fortalecido o módulo lib/features/moderation/whitelist.js.
- Comparação consistente de números e JIDs.
- Compatibilidade com +55, espaços, hífens, :device@s.whatsapp.net e formatos antigos do banco.
- AntiSpam continua respeitando a Lista Branca.
- AntiLink continua respeitando a Lista Branca.
- Anti-Trava agora respeita a Lista Branca.
- ADVs automáticas não são aplicadas a membros da Lista Branca.
- BanFake ignora membros da Lista Branca.
- Banghost ignora membros da Lista Branca.
- Lista negra local não remove automaticamente um membro protegido.

Importante:
Comandos manuais explícitos de ADM, como /ban, continuam funcionando.
A Lista Branca protege contra sistemas automáticos do bot.
