Kobayashi Bot v2.0.7 — Emergency Full Command Arguments Fix

CORREÇÃO GLOBAL DO PARSER
Agora todo comando lê a mensagem completa depois do prefixo.

Exemplos:
/dragonrpg on
/dragonrpg off
/mododragonrpg on
/mododragonrpg off
/plano 1
/rpgclasse guerreiro
/explorar floresta
/missao aceitar q_slimes
/comprarrpg espada_ferro 2
/equipar espada_ferro
/habilidade corte
/zerarrpg confirmar

O parser agora separa:
- comando
- argumentos
- texto completo dos argumentos

Também aceita espaços múltiplos, tabs e quebras de linha entre comando e complemento.

/dragonrpg sem argumento continua abrindo o menu.
/dragonrpg on|off agora controla diretamente o Dragon RPG.
