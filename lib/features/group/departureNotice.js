import { getWelcomeConfig, updateWelcomeConfig } from './welcomeConfig.js';
export const departureNoticeAllowed = settings => Boolean(settings?.enabled) && settings?.byeEnabled !== false;
export async function handleDepartureCommand({isGroup,isAdmin,from,args=[],prefix='/',reply}) {
  if(!isGroup)return reply('Este comando só funciona em grupos.');
  if(!isAdmin)return reply('🔒 Você precisa ser administrador deste grupo para usar este comando.');
  const action=String(args[0] || '').toLowerCase();
  if(!['on','off'].includes(action)) {
    const cfg=getWelcomeConfig(from);
    return reply(`👋 Aviso de saída: *${cfg.byeEnabled?'ON':'OFF'}*\nUse ${prefix}saída on ou ${prefix}saída off.${cfg.enabled?'':'\nO sistema de boas-vindas está desligado neste grupo.'}`);
  }
  updateWelcomeConfig(from,{byeEnabled:action==='on'});
  return reply(action==='on'?'👋 Aviso de saída ativado neste grupo.':'🔕 Aviso de saída desativado neste grupo.');
}
