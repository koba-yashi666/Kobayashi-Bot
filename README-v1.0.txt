KOBAYASHI BOT v1.0 STABLE

Arquitetura organizada por domínio.

commands/
  admin/  comandos administrativos
  fun/    jogos e diversão
  general/ comandos gerais
  group/  configuração por grupo
  owner/  comandos do proprietário

lib/features/
  core/        núcleo e Dragon Core
  moderation/ segurança, logs e proteção
  group/       recursos específicos de grupo
  social/      Dragon Social, RPG e diversão
  stickers/    sistema de figurinhas
  rental/      sistema de aluguel
  system/      controle de comandos e updates

assets/dragon_fun/
  hutao/ e nazuna/ preservam as fontes de mídia e dados dos jogos.

Os arquivos antigos em lib/features/*.js são bridges pequenos de compatibilidade e não devem receber novas funções.
Novos recursos devem ser criados nas pastas organizadas.

IMPORTANTE: files/database não deve ser substituído ao atualizar uma instalação existente.
