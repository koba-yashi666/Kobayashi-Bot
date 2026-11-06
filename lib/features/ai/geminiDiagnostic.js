export async function diagnoseGemini({readKey,env,fetchImpl}){
 let key;
 try{key=readKey(env);}catch{return '⚙️ settings/gemini.json não pôde ser lido. Confira se é um JSON válido, com apiKey entre aspas.';}
 if(!key)return '⚙️ Chave ausente. Preencha apiKey em settings/gemini.json na hospedagem.';
 let model;
 try{model=readKey.model?readKey.model(env):String(env.GEMINI_MODEL||'gemini-2.5-flash-lite');}catch{return '⚙️ Confira o campo model e o JSON de settings/gemini.json.';}
 if(!/^gemini-[a-zA-Z0-9._-]+$/.test(model))return '⚙️ GEMINI_MODEL inválido. Confira o identificador nas variáveis da hospedagem.';
 const source=String(env.GEMINI_API_KEY||'').trim()?'variável GEMINI_API_KEY (prioridade sobre o arquivo)':'arquivo settings/gemini.json';
 const header=`🐉 *DIAGNÓSTICO GEMINI*\nChave: configurada via ${source}\n`;
 try{
  const response=await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},signal:AbortSignal.timeout(20000),
   body:JSON.stringify({contents:[{role:'user',parts:[{text:'Responda apenas OK.'}]}],generationConfig:{maxOutputTokens:16}})
  });
  const data=await response.json().catch(()=>({}));
  if(response.ok){const text=data.candidates?.[0]?.content?.parts?.some(p=>typeof p.text==='string'&&p.text.trim());return header+`HTTP ${response.status}\n`+(text?'✅ Conexão e geração de texto funcionando. Use /ia on e depois Koba, como você está?':'⚠️ O Google aceitou a chamada, mas não retornou texto. Tente novamente mais tarde.');}
  // O erro completo pode conter credenciais ou informações do projeto.
  // Apenas classifica o retorno; nenhum conteúdo bruto é enviado ao WhatsApp.
  const message=String(data.error?.message||'').toLowerCase();
  let detail;
  if(message.includes('api key not valid')||message.includes('api_key_invalid')||message.includes('api key expired'))detail='Chave inválida ou expirada. Crie outra no Google AI Studio e atualize a origem indicada acima.';
  else if(message.includes('leaked'))detail='O Google sinalizou a chave como exposta. Substitua a chave no Google AI Studio e na hospedagem.';
  else if(message.includes('location')||message.includes('country')||message.includes('region'))detail='O Google informou uma restrição de localização. Confira a disponibilidade do Gemini na região da hospedagem.';
  else if(response.status===404)detail='Modelo ou rota não encontrado. Use /ia modelos e configure o campo model em settings/gemini.json. GEMINI_MODEL, se definida, tem prioridade.';
  else if(response.status===429)detail='Cota ou limite do Google atingido. Consulte os limites do projeto no AI Studio e aguarde a liberação.';
  else if(response.status===401)detail='Autenticação recusada. Confira a chave e se ela ainda está ativa.';
  else if(response.status===403)detail='Acesso negado. Confira as restrições da chave, as permissões do projeto e a disponibilidade do serviço.';
  else if(response.status===400)detail='Solicitação recusada pelo Google. Confira a chave, o modelo e os requisitos de acesso do projeto.';
  else if(response.status>=500)detail='O serviço do Google apresentou falha. Tente novamente mais tarde.';
  else detail='O Google recusou a chamada. Confira a configuração e a disponibilidade do serviço.';
  return header+`HTTP ${Number(response.status)||'indisponível'}\n❌ ${detail}`;
 }catch{return header+'❌ Sem resposta válida: falha de rede, conexão bloqueada ou tempo limite de 20 segundos.';}
}

export async function listGeminiModels({readKey,env,fetchImpl}){
 let key;
 try{key=readKey(env);}catch{return '⚙️ Confira se settings/gemini.json é um JSON válido.';}
 if(!key)return '⚙️ Preencha apiKey em settings/gemini.json antes de consultar os modelos.';
 try{
  const response=await fetchImpl('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000',{
   method:'GET',headers:{'x-goog-api-key':key},signal:AbortSignal.timeout(20000)
  });
  if(!response.ok)return `⚙️ A consulta de modelos retornou HTTP ${Number(response.status)||'indisponível'}. Use /ia teste para verificar a configuração.`;
  const data=await response.json();
  const names=[...new Set((data.models||[]).filter(m=>m.supportedGenerationMethods?.includes('generateContent')).map(m=>String(m.name||'').replace(/^models\//,'')).filter(n=>/^gemini-[a-zA-Z0-9._-]+$/.test(n)&&!n.includes(key)&&!/(image|audio|tts|live|robotics)/i.test(n)))].sort((a,b)=>Number(!a.includes('flash-lite'))-Number(!b.includes('flash-lite'))||a.localeCompare(b));
  if(!names.length)return '⚙️ O Google não listou modelos Gemini de conversa compatíveis com esta chave.';
  return `🐉 *MODELOS LISTADOS PELO GOOGLE*\n\n${names.slice(0,20).map(n=>'• '+n).join('\n')}\n\nNo gerenciador da hospedagem, abra settings/gemini.json e adicione "model": "NOME_ESCOLHIDO", preservando apiKey. Depois use /ia teste.\nSe GEMINI_MODEL estiver configurada, ela tem prioridade.\nA listagem não garante cota gratuita nem acesso à geração; confira o plano no AI Studio.${names.length>20||data.nextPageToken?'\nLista parcial (até 20 modelos de conversa).':''}`;
 }catch{return '☕ Não consegui consultar os modelos: falha de conexão ou tempo limite. Tente mais tarde.';}
}
