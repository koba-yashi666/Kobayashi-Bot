const LINE = "━━━━━━━━━━━━━━━━━━━━";

const cmdLines = (prefix, commands) => commands.map(cmd => `┃  ${prefix}${cmd}`).join("\n");
const box = (icon, title, subtitle, prefix, commands) => [
  `╭━━〔 ${icon} *${title}* 〕━━╮`,
  `┃ ${subtitle}`,
  `┃ ──────────────────`,
  cmdLines(prefix, commands),
  `╰${LINE}╯`,
  `🌸 Ajuda: *${prefix}helpcmd comando*`
].join("\n");

export function buildMainMenu({ sender, botName="Kobayashi Bot", ownerName="Kobayashi-666", prefix="/", version="1.0.12" }={}) {
  const mention = sender ? `@${String(sender).split("@")[0]}` : "Visitante";
  return [
    `╭━━〔 🐉 *${botName}* 〕━━╮`,
    `┃ 🌸 Olá, ${mention}`,
    `┃ 📦 v${version}`,
    `╰━━━━━━━━━━━━━━━━━━━━╯`,
    ``,
    `╭─〔 ✨ *CENTRAIS* 〕`,
    `┃ 🪷 ${prefix}menugeral   • Central Essencial`,
    `┃ 🛡️ ${prefix}menuadm     • Central de Administração`,
    `┃ 🎴 ${prefix}menusticker • Atelier de Figurinhas`,
    `┃ ⭐ ${prefix}menulevel   • Trilha de Níveis`,
    `┃ 🐲 ${prefix}menusocial  • Reino Dragon Social`,
    `┃ 🛍️ ${prefix}menuloja    • Empório Dragon`,
    `┃ 🎮 ${prefix}menubn      • Salão de Brincadeiras`,
    `┃ 👑 ${prefix}menudono    • Câmara do Dono`,
    `╰────────────────────`,
    ``,
    `🔎 *${prefix}helpcmd comando*`,
    `Ex.: *${prefix}helpcmd play*`,
    ``,
    `🌸 ${ownerName} • Kobayashi System`
  ].join("\n");
}

export const buildGeneralMenu = (p="/") => box("🪷", "CENTRAL ESSENCIAL", "Comandos do dia a dia", p, [
  "ping","version","novidades","perfil","admins","criador","dono","grupoinfo","regras","linkgp","play","letra","afk","checkme","atividade","topativos","helpcmd"
]);
export const buildAdminMenu = (p="/") => box("🛡️", "CENTRAL DE ADMINISTRAÇÃO", "Moderação, proteção e controle", p, [
  "paineladm","statusgrupo","logs","ban","adv","rmadv","listadv","promover","rebaixar","hidetag","totag","mutar","desmutar","antilink","antitelegram","antifake","banfake","antispam","antitrava","antimencao","antitextao","antiflood","antidel","antiedit","bemvindo","setbv","setbye","soadm","listabranca","revogarlink","banghost","opengp","closegp"
]);
export const buildStickerMenu = (p="/") => box("🎴", "ATELIER DE FIGURINHAS", "Criação e personalização", p, [
  "s","fig","figurinhas","rename","roubar","toimg","togif","autosticker","setcmd","delcmd","listcmdsticker","fontesfig","fontefig","addfontefig","delfontefig"
]);
export const buildLevelMenu = (p="/") => box("⭐", "TRILHA DE NÍVEIS", "XP, atividade e rankings", p, [
  "level","nivel","xp","ranknivel","ranknivelg","rank","topativos","atividade","checkme","categoriaslevel","classeslevel","sistemanivel"
]);
export const buildSocialMenu = (p="/") => box("🐲", "REINO DRAGON SOCIAL", "Moedas, conquistas e interação", p, [
  "carteira","daily","pagar","rankcoins","conquistas","inventario","equipar","desequipartitulo","abrircaixa","antifarm"
]);
export const buildShopMenu = (p="/") => box("🛍️", "EMPÓRIO DRAGON", "Loja e inventário", p, [
  "comprar","inventario","equipar","desequipartitulo","abrircaixa","carteira"
]);
export const buildFunMenu = (p="/") => box("🎮", "SALÃO DE BRINCADEIRAS", "Diversão da comunidade", p, [
  "modobrincadeira","dado","moeda","ppt","piada","conselho","motivacional","charada","eununca","vab","sorte","chance","quando","elogio","cafune","presente","amizade","abraco","ship","linda","lindo","gay","hetero","gado","gostosa","gostoso"
]);
export const buildOwnerMenu = (p="/") => box("👑", "CÂMARA DO DONO", "Configuração e segurança global", p, [
  "numero_dono","numero_bot","status_bot","prefixo","add_prefixo","nome_gp","foto_gp","foto_menu","antipv","reiniciar","update","statusatt","listanegrag","rmlistanegrag","sentinel","sentinelbridge","aluguel_global","registrar_aluguel","renovar_aluguel","rm_aluguel","lista_aluguel","aluguel_permanente"
]);

const HELP = {
  menu:"abre o menu principal da Kobayashi.", menugeral:"abre a Central Essencial com os comandos gerais.", menuadm:"abre a Central de Administração do grupo.", menusticker:"abre o Atelier de Figurinhas.", menulevel:"abre a Trilha de Níveis e rankings de XP.", menusocial:"abre o Reino Dragon Social, com moedas e conquistas.", menuloja:"abre o Empório Dragon.", menubn:"abre o Salão de Brincadeiras.", menudono:"abre a Câmara do Dono com comandos exclusivos.", helpcmd:"explica para que serve um comando selecionado.",
  play:"serve para buscar e baixar músicas usando o nome ou um link do YouTube.", letra:"busca a letra de uma música pelo nome.", ping:"mostra a resposta e o estado básico da Kobayashi.", version:"mostra a versão instalada e verifica se existe atualização.", novidades:"mostra as novidades e alterações recentes do bot.", perfil:"mostra o perfil e as estatísticas do membro.", admins:"lista os administradores do grupo.", criador:"mostra os créditos do criador da Kobayashi.", dono:"mostra o contato configurado como dono do bot.", grupoinfo:"mostra informações do grupo atual.", regras:"mostra as regras configuradas para o grupo.", setregras:"define as regras do grupo.", delregras:"remove as regras configuradas.", linkgp:"mostra ou gera o link do grupo quando permitido.", afk:"marca você como ausente (AFK).", checkme:"mostra suas informações de atividade.", atividade:"consulta a atividade de um membro.", topativos:"mostra o ranking dos membros mais ativos.",
  paineladm:"abre o Admin Center.", statusgrupo:"mostra o estado das proteções e sistemas do grupo.", logs:"consulta registros administrativos e de proteção.", ban:"remove do grupo o membro marcado ou respondido.", adv:"adiciona uma advertência a um membro.", rmadv:"remove uma advertência de um membro.", listadv:"lista as advertências registradas.", promover:"promove um membro a administrador.", rebaixar:"remove o cargo de administrador.", hidetag:"marca os membros de forma oculta.", totag:"marca os membros do grupo.", mutar:"aplica mute a um membro conforme o sistema de moderação.", desmutar:"remove o mute aplicado.", antilink:"ativa ou desativa a proteção contra links.", antitelegram:"ativa ou desativa o bloqueio de links do Telegram.", antifake:"configura a detecção de números estrangeiros/fakes.", banfake:"remove números detectados pelo AntiFake.", antispam:"ativa, desativa ou mostra o AntiSpam Pro.", antitrava:"configura a proteção contra mensagens de trava.", antimencao:"configura a proteção contra excesso de menções.", antitextao:"configura a proteção contra textos grandes demais.", antiflood:"configura a proteção contra flood.", antidel:"ativa ou desativa o anti-apagar mensagens.", antiedit:"ativa ou desativa o anti-edição.", bemvindo:"ativa ou desativa as boas-vindas.", setbv:"define a mensagem de boas-vindas.", setbye:"define a despedida.", soadm:"limita o bot aos administradores.", listabranca:"gerencia a whitelist das proteções.", revogarlink:"revoga o link atual do grupo.", banghost:"remove membros fantasma/inativos conforme os critérios do comando.", opengp:"abre o grupo para mensagens.", closegp:"fecha o grupo para mensagens dos membros.",
  s:"cria uma figurinha a partir da mídia enviada ou respondida.", fig:"cria uma figurinha a partir da mídia enviada ou respondida.", figurinhas:"envia figurinhas do catálogo configurado.", rename:"renomeia os metadados de uma figurinha.", roubar:"recria uma figurinha com os dados configurados de pacote/autor.", toimg:"converte uma figurinha estática em imagem.", togif:"converte mídia compatível para GIF/figurinha animada.", autosticker:"ativa ou desativa a criação automática de figurinhas.", setcmd:"associa um comando a uma figurinha respondida.", delcmd:"remove o comando associado a uma figurinha.", listcmdsticker:"lista figurinhas com comandos associados.", fontesfig:"lista as fontes de figurinhas.", fontefig:"seleciona ou consulta a fonte de figurinhas.", addfontefig:"adiciona uma fonte ao sistema de figurinhas.", delfontefig:"remove uma fonte do sistema de figurinhas.",
  level:"ativa, desativa ou consulta o sistema de níveis.", nivel:"mostra o nível e XP do membro.", xp:"consulta a experiência do sistema de níveis.", ranknivel:"mostra o ranking de níveis do grupo.", ranknivelg:"mostra o ranking global de níveis.", rank:"mostra o ranking disponível para o sistema atual.", categoriaslevel:"mostra as categorias do sistema de níveis.", classeslevel:"mostra as classes do sistema de níveis.", sistemanivel:"mostra informações do sistema de níveis.",
  carteira:"mostra Dragon Coins e estatísticas sociais.", daily:"coleta a recompensa diária de Dragon Coins.", pagar:"transfere Dragon Coins para outro membro.", rankcoins:"mostra o ranking de Dragon Coins.", conquistas:"mostra as conquistas do membro.", inventario:"mostra itens e títulos do inventário Dragon.", equipar:"equipa um título do inventário.", desequipartitulo:"remove o título equipado.", abrircaixa:"abre uma Caixa de Escamas.", antifarm:"configura ou consulta o limite diário de farm.", comprar:"compra um item usando Dragon Coins.",
  modobrincadeira:"ativa ou desativa os comandos de brincadeira.", dado:"rola um dado.", moeda:"joga cara ou coroa.", ppt:"joga pedra, papel e tesoura.", piada:"envia uma piada.", conselho:"envia um conselho aleatório.", motivacional:"envia uma mensagem motivacional.", charada:"envia uma charada.", eununca:"envia uma pergunta de Eu Nunca.", vab:"envia uma brincadeira de verdade/desafio conforme o módulo.", sorte:"gera uma leitura divertida de sorte.", chance:"gera uma porcentagem divertida para a pergunta.", quando:"gera uma resposta divertida sobre quando algo pode acontecer.", elogio:"envia um elogio divertido.", cafune:"faz uma interação de cafuné.", presente:"envia uma interação de presente.", amizade:"faz uma interação de amizade.", abraco:"envia uma interação de abraço.", ship:"faz uma brincadeira de compatibilidade.",
  sentinel:"configura a segunda conta Sentinela contra links invisíveis.", sentinelbridge:"configura a ponte do Kobayashi Sentinel.", listanegrag:"gerencia números na lista negra global.", rmlistanegrag:"remove um número da lista negra global.", update:"atualiza a Kobayashi pelo sistema configurado.", statusatt:"verifica a sincronização da versão local.", planos:"mostra os planos de aluguel.", aluguel:"consulta ou gerencia o aluguel conforme os argumentos.", registrar_aluguel:"registra um grupo no sistema de aluguel.", aluguel_parceria:"registra aluguel com regra de parceria.", renovar_aluguel:"adiciona tempo ao aluguel.", rm_aluguel:"remove um aluguel.", ver_aluguel:"consulta o aluguel do grupo.", lista_aluguel:"lista os aluguéis registrados.", aluguel_permanente:"gerencia um aluguel permanente.",
  prefixo:"mostra ou configura o prefixo principal.", add_prefixo:"adiciona um prefixo aceito pelo bot.", nome_gp:"altera o nome do grupo.", foto_gp:"altera a foto do grupo.", foto_menu:"altera a imagem dos menus quando configurada.", antipv:"ativa ou desativa a proteção contra uso no privado.", reiniciar:"reinicia o processo do bot quando o ambiente permite.", numero_dono:"configura ou consulta o número do dono.", numero_bot:"configura ou consulta o número do bot.", status_bot:"mostra ou configura o status operacional do bot."
};

const ALIASES = {
  geral:"menugeral",menustk:"menusticker",menunivel:"menulevel",menudragon:"menusocial",menushop:"menuloja",menuowner:"menudono",versao:"version",v:"version",atualizar:"update",
  b:"ban",banc:"ban",advs:"listadv",listaadv:"listadv",rm_adv:"rmadv",stk:"s",st:"s",sticker:"s",stickers:"s",toimage:"toimg",autostk:"autosticker",steal:"roubar",take:"roubar",rgcmd:"setcmd",stickercmds:"listcmdsticker",lyrics:"letra",linkgrupo:"linkgp",infogrupo:"grupoinfo",adminlogs:"logs",admincenter:"paineladm",centraladm:"paineladm",statusgp:"statusgrupo",bridge:"sentinelbridge",blacklistg:"listanegrag",rmblacklistg:"rmlistanegrag",whitelist:"listabranca",antifarmdiario:"antifarm",coins:"carteira",saldo:"carteira",pay:"pagar",topcoins:"rankcoins",achievements:"conquistas",inv:"inventario",buy:"comprar",equipartitulo:"equipar",untitle:"desequipartitulo",opencaixa:"abrircaixa",coinflip:"moeda",abraço:"abraco",shipo:"ship",owner:"dono",creator:"criador",adms:"admins",mute:"mutar",desmute:"desmutar",unmute:"desmutar",onlyadm:"soadm",soadmin:"soadm",plans:"planos",rg_aluguel:"registrar_aluguel",renovar_alugel:"renovar_aluguel",remover_aluguel:"rm_aluguel",ver_alugel:"ver_aluguel",lista_alugel:"lista_aluguel",alugel_permanente:"aluguel_permanente"
};

export function getCommandHelp(rawCommand, prefix="/") {
  let cmd=String(rawCommand||"").trim().toLowerCase();
  if(!cmd) return null;
  cmd=cmd.split(/\s+/)[0].replace(/^[/!+.#-]+/,"");
  const key=ALIASES[cmd]||cmd;
  const description=HELP[key];
  return description ? {command:key,found:true,description,usage:`${prefix}${key}`} : {command:cmd,found:false};
}
