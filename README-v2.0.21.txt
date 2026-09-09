KOBAYASHI BOT v2.0.21 — PACOTES DE FIGURINHAS

Novos comandos:
/pacote add "nome do pacote"
  Cria/seleciona o pacote e já ativa a captura.

/pacote fig on
  Reativa a captura usando o último pacote selecionado no chat.
  Também aceita /pacote fig on "nome".

/pacote fig off
  Encerra a captura e informa quantas figurinhas foram registradas.

/pacote "nome do pacote"
  Reenvia a coleção aplicando o mesmo nome e ID de pacote aos metadados das figurinhas.

/figurinha "nome do pacote"
  Envia as figurinhas salvas uma por uma, mantendo os arquivos capturados.

/pacotes
  Lista todos os pacotes registrados.

Observações:
- Durante a captura, toda figurinha recebida no chat é registrada.
- Figurinhas duplicadas não são salvas novamente.
- Os arquivos ficam em files/sticker-packs e o índice em files/database/sticker-packs.json.
- /pacote add e /pacote fig on/off ficam restritos ao dono/líderes para evitar uso indevido de armazenamento.
