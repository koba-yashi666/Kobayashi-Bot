export function groupDiagnostic({name,botIsAdmin,protection={},antiFake={},antiSpam={},antiTrava={},rental}){
 const on=value=>value?'🟢 ON':'⚪ OFF';
 const rows=[['Antilink',protection.antilink],['Links de grupos',protection.antilinkgp],['Antilink leve',protection.antilinklight],['Links Telegram',protection.antitelegram],['AntiStatus',protection.antistts],['Antifake',antiFake.enabled],['AntiSpam',antiSpam.enabled],['Antitrava',antiTrava.enabled]];
 return `🛡️ *DIAGNÓSTICO DO GRUPO*\n${String(name||'Grupo').replace(/[\r\n]/g,' ').slice(0,80)}\n\nBot é ADM: ${botIsAdmin?'✅ Sim':'❌ Não — promova o bot para apagar mensagens e remover infratores'}\n\n`+rows.map(([label,value])=>`${on(value)} • ${label}`).join('\n')+`\n\nAluguel: ${!rental?.exists?'não cadastrado':rental.permanent?'permanente':rental.active?'ativo':'vencido'}\nConfiguração ON não garante a execução de punições; elas dependem das permissões e dos eventos recebidos.`;
}
