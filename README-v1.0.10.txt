KOBAYASHI BOT v1.0.10 — SENTINELA VIA WHATSAPP

Esta atualização conecta a Kobayashi da hospedagem ao Sentinela rodando no Termux.
Não é necessário abrir portas nem usar o endereço 127.0.0.1 entre aparelhos.

CONFIGURAÇÃO NO KOBAYASHI PRINCIPAL

1. Reinicie o bot após instalar a atualização.
2. No PV do dono, use:
   /sentinelbridge numero 55DDDNUMERO_DO_SENTINELA
3. Renove o token, pois o backup enviado continha a configuração antiga:
   /sentinelbridge renovar
4. Copie o novo token recebido no PV para bridgeSecret do config.json do Sentinela.
5. Mantenha o modo seguro durante o primeiro teste:
   /sentinelbridge teste
6. Consulte:
   /sentinelbridge status
   /sentinelbridge logs

ATIVAÇÃO DA REMOÇÃO

Somente depois de confirmar que o heartbeat e o alerta de teste foram aceitos:
   /sentinelbridge proteger

Para voltar imediatamente ao modo sem remoção:
   /sentinelbridge teste

SEGURANÇA

- Somente o número configurado da Sentinela é aceito.
- Todo alerta possui assinatura HMAC-SHA256.
- Alertas vencidos, repetidos ou adulterados são rejeitados.
- Dono, administradores e lista branca permanecem protegidos.
- A conta Sentinela deve continuar como membro comum.
- Sessões do WhatsApp e arquivos de banco de dados não fazem parte desta atualização.

DETECÇÕES DO SENTINELA v0.3.0

- Links gerais.
- Convites e canais do WhatsApp.
- Links do Telegram.
- Texto excessivamente grande.
- Excesso de caracteres invisíveis.
- Marcação em massa a partir de 10 usuários na mesma mensagem.
