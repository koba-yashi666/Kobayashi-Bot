/*ESSA BASE FOI DESENVOLVIDA PELO ALVES COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY ALVES
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

export const ErrorBaileys_401 = () => {
const response = ["🌸 Ops! Minha conexão caiu, preciso que você escaneie o QR novamente para voltarmos a conversar.", "🔄 Desconectei do WhatsApp, que tal reconectar escaneando o QR code? Já estou gerando um novo.", "⚡ Parece que alguém me desconectou... Vamos refazer nossa conexão? Escaneie o novo QR que estou criando."];
return response[Math.floor(Math.random() * response.length)];
};

export const ErrorBaileys_408 = () => {
const response = ["⏰ Eita! Demorei demais para responder e a sessão expirou. Já estou recarregando tudo.", "🔄 O tempo limite foi atingido, mas calma que já estou reiniciando nossa conexão.", "⚡ Timeout detectado! Estou recarregando o sistema para voltarmos ao normal."];
return response[Math.floor(Math.random() * response.length)];
};

export const ErrorBaileys_411 = () => {
const response = ["🔧 Algo deu errado com minha sessão salva... Estou corrigindo isso automaticamente.", "⚙️ Detectei incompatibilidade na sessão, mas já estou ajustando para funcionar perfeitamente.", "🛠️ Parece que meus arquivos de sessão estão desatualizados. Corrigindo agora mesmo."];
return response[Math.floor(Math.random() * response.length)];
};

export const ErrorBaileys_428 = () => {
const response = ["📶 Ops! Parece que sua internet deu uma oscilada. Estou tentando reconectar automaticamente.", "🌐 A conexão com o WhatsApp foi perdida, mas não se preocupe, já estou restabelecendo.", "🔄 Detectei instabilidade na rede... Reconectando para manter nossa conversa fluindo."];
return response[Math.floor(Math.random() * response.length)];
};

export const ErrorBaileys_440 = () => {
const response = ["⚠️ Detectei múltiplas sessões do WhatsApp Web no meu número. Por favor, feche as outras abas.", "🚫 Parece que você tem outro WhatsApp Web aberto comigo. Feche para eu funcionar corretamente.", "📱 Muitas conexões simultâneas detectadas! Deixe apenas uma sessão ativa para eu operar."];
return response[Math.floor(Math.random() * response.length)];
};

export const ErrorBaileys_500 = () => {
const response = ["🔧 Algo não estava configurado corretamente... Já estou ajustando automaticamente.", "⚙️ Detectei erro interno na sessão. Iniciando processo de correção automática.", "🛠️ Configuração inconsistente detectada! Reinicializando para resolver o problema."];
return response[Math.floor(Math.random() * response.length)];
};

export const ErrorBaileys_503 = () => {
const response = ["🌩️ Ocorreu um erro desconhecido no servidor do WhatsApp... Tentando reconectar.", "⚠️ Instabilidade detectada do lado do WhatsApp (erro 503). Já estou tentando de novo.", "🔄 O serviço do WhatsApp ficou indisponível por um instante, reconectando automaticamente."];
return response[Math.floor(Math.random() * response.length)];
};

export const ErrorBaileys_515 = () => {
const response = ["🔄 O sistema solicitou uma atualização.", "⬆️ Atualização necessária detectada!", "🚀 Hora de uma atualização!"];
return response[Math.floor(Math.random() * response.length)];
};

export const open = () => {
const response = ["✅ Perfeito! Estou online e conectada com sucesso ao WhatsApp Web! Vamos conversar?", "🎉 Conexão estabelecida com êxito! Estou pronta para te ajudar no que precisar.", "🌸 Online e operacional! Sessão carregada perfeitamente, estou à sua disposição.", "⚡ Conexão estabilizada! Sistema carregado e pronto para atender você."];
return response[Math.floor(Math.random() * response.length)];
};

export const connecting = () => {
const response = ["🔄 Inicializando meus sistemas... Em breve estarei pronta para conversar.", "⚡ Carregando todas as funcionalidades... Aguarde só um pouquinho.", "🚀 Preparando tudo para te oferecer a melhor experiência... Quase lá.", "🐉 Oi! Estou acordando e configurando tudo... Logo estaremos conversando.", "🎯 Sincronizando dados e carregando recursos... Preparando surpresas para você."];
return response[Math.floor(Math.random() * response.length)];
};

export const onlyAdmins = () => {
const response = ["🌸 Você não é admin deste grupo. A Kobayashi não liberou esse acesso.", "🐉 Calma aí! Só os administradores podem usar esse comando.", "🌸 Comando de admin detectado... mas você ainda não tem permissão.", "🛡️ Somente administradores podem usar essa função.", "🐉 Quer usar poderes de admin? Primeiro vire administrador."];
return response[Math.floor(Math.random() * response.length)];
};

export const onlyOwner = () => {
const response = ["👑 Essa função é exclusiva do dono do Kobayashi Bot.", "Área restrita! Apenas o dono do bot possui acesso a isso.", "Você está fora da hierarquia do bot. Apenas os escolhidos podem executar esta função.", "🐉 Essa função pertence ao proprietário. Não adianta insistir."];
return response[Math.floor(Math.random() * response.length)];
};

export const onlyGroup = () => {
const response = ["Comando de grupo detectado, mas estamos em privado. Tente em um grupo real.", "Este comando só funciona dentro de grupos, não em chats privados.", "Função bloqueada. Adicione-me a um grupo para usar este comando.", "Somente grupos podem executar essa função. Aqui não é permitido."];
return response[Math.floor(Math.random() * response.length)];
};

export const onlyBotAdmin = () => {
const response = ["Coloque-me como admin primeiro. Sem isso não posso executar certas funções.", "Eu não sou admin ainda. Me dê permissões para liberar meu potencial.", "Sem status de admin, minhas habilidades ficam limitadas. Configure-me como admin do grupo.", "Funções bloqueadas! Admin do bot é necessário para prosseguir."];
return response[Math.floor(Math.random() * response.length)];
};

export const error = () => {
return "🌸 Algo deu errado por aqui... Tente novamente em alguns instantes.";
};

export const mess = { ErrorBaileys_401, ErrorBaileys_408, ErrorBaileys_411, ErrorBaileys_428, ErrorBaileys_440, ErrorBaileys_500, ErrorBaileys_503, ErrorBaileys_515, open, connecting, onlyAdmins, onlyOwner, onlyGroup, onlyBotAdmin, error };

export default mess;