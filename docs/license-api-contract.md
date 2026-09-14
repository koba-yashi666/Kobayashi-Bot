# Kobayashi V4 — contrato do servidor de licença

## POST /activate
Entrada:
```json
{
  "key": "KOBA-XXXX-XXXX",
  "installationId": "id-da-instalacao",
  "version": "4.0.0"
}
```

Resposta aceita:
```json
{
  "valid": true,
  "plan": "permanent",
  "customer": "Nome do comprador",
  "updates": true,
  "token": "token-da-instalacao",
  "expiresAt": null,
  "message": "Licença permanente ativa"
}
```

## POST /validate
Entrada:
```json
{
  "key": "KOBA-XXXX-XXXX",
  "token": "token-da-instalacao",
  "installationId": "id-da-instalacao",
  "version": "4.0.0"
}
```

A resposta segue o mesmo formato.

O bot não precisa consultar o servidor a cada comando. O cache padrão é 7 dias.
A licença permanente não desliga o bot quando o serviço remoto fica temporariamente indisponível.
