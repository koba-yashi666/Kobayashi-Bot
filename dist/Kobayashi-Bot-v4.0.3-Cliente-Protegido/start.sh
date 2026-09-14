#!/bin/bash

while true; do
  printf "\033[1;35m🐉🌸 Kobayashi Bot Beta iniciando...\n\033[0m"

  node bootstrap.js
  EXIT_CODE=$?

  printf "\033[0;34m🐉 Processo encerrado (código %s). Reiniciando em 2 segundos...\n\033[0m" "$EXIT_CODE"
  sleep 2
done
