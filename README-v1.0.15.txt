Kobayashi Bot v1.0.15 — Updater HTTP 403 Fix

- Corrige o HTTP 403 do /update.
- Remove a dependência principal da API Git Trees.
- Baixa o branch main por codeload.github.com em tar.gz.
- Mantém banco/configurações e arquivos protegidos.
- Faz backup e restauração automática se a atualização falhar.
- version.json possui fallback via jsDelivr.
