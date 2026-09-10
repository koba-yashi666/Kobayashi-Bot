Kobayashi Bot v2.0.21 — Lista Negra AutoRemove

/listanegra:
- ao adicionar uma pessoa, tenta remover imediatamente do grupo;
- se a pessoa entrar novamente, o evento de entrada remove automaticamente;
- funciona enquanto a Kobayashi for ADM.

/listanegrag:
- ao adicionar um número globalmente, varre todos os grupos participantes;
- remove a pessoa de cada grupo onde ela estiver e a Kobayashi for ADM;
- qualquer tentativa futura de entrar em grupo é removida automaticamente;
- continua bloqueando interação no PV.

Prioridade:
- Lista Negra local/global passa a ter prioridade sobre Lista Branca para remoções
  automáticas da própria Kobayashi.
- o dono principal continua protegido contra entrada na lista negra.
