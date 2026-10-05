import { transactDragonRpg } from './dragonRpg.js';

const HELP = {
 profissaorpg:'<pescador|minerador|herbalista|lenhador> — escolher profissão (troca: 7 dias)',
 pescarrpg:'— pescar (10 min)', minerarrpg:'— extrair minério (10 min)', coletarrpg:'— colher ervas (10 min)', cortarrpg:'— coletar madeira (10 min)',
 bolsarpg:'— consultar recursos', mercadorrpg:'— preços dos recursos', venderrpg:'<recurso> <quantidade>',
 alquimiarpg:'<vida|mana> — fabricar poção: 3 ervas + 20 ouro', cozinharpg:'— preparar pão: 2 peixes + 10 ouro',
 forjarrpg:'— espada de ferro: 5 minérios + 80 ouro',
 bancorpg:'— saldo guardado', depositarrpg:'<quantidade>', sacarrpg:'<quantidade>', diariorpg:'— recompensa a cada 24h',
 treinarrpg:'<combate|furtividade|sobrevivencia|arcana> — 80 ouro, 6h',
 expedirrpg:'<bosque|montanha|ruinas> — 30 min, custo e nível por destino', acamparrpg:'— 2 madeiras + 20 ouro, 30 min',
 adotarrpg:'<lobo|fada|dragonete> — 500 ouro, um companheiro', petrpg:'— ficha do companheiro', alimentarrpg:'— 2 peixes, uma vez por hora', treinopetrpg:'— 100 ouro, uma vez por 6h',
 tesourorpg:'— procurar baú: 100 ouro, 1h', abrirbaurpg:'— abrir um baú encontrado',
 pesquisarrpg:'— 3 minérios + 100 ouro: +2 mana, máximo 20 estudos', curandeirorpg:'— cura completa por 60 ouro',
 contratosrpg:'— ver contrato de coleta', entregarrpg:'— entregar 5 de cada recurso por 160 ouro, 6h',
 conquistasrpg:'— consultar e resgatar conquistas', titulorpg:'<aventureiro|coletor|explorador|artesao> — escolher título desbloqueado', aprimorarrpg:'<atk|def|mag|agi> — 3 minérios + 150 ouro: +1, máximo 20 melhorias'
};
// Cada entrada corresponde a uma ação ou consulta funcional, sem aliases na contagem.
delete HELP['reciclar rpg']; delete HELP['missao diaria rpg'];
HELP.reciclarrpg='<id do equipamento> — desfazer equipamento não equipado por 2 minérios';
delete HELP.mercadorrpg; delete HELP.bancorpg;
export const DRAGON_EXPANSION_COMMANDS=Object.freeze(Object.keys(HELP));
export function formatExpansionMenu(prefix='/') {
 return `╭━━〔 🐉 *DRAGON • 30 RECURSOS* 〕━━╮\n${Object.entries(HELP).map(([k,v])=>`┃ ${prefix}${k} ${v}`).join('\n')}\n╰━━━━━━━━━━━━━━━━━━━━╯\n🌿 Coleta compartilha intervalo de 10 min. Profissão dá +1 recurso.\n🪙 Banco guarda ouro sem juros. Ações não funcionam durante batalhas.`;
}
const MATERIALS={peixe:8,minerio:12,erva:10,madeira:8};
const PROFESSIONS={pescador:'peixe',minerador:'minerio',herbalista:'erva',lenhador:'madeira'};
export function runDragonExpansion(jid,command,args=[],prefix='/',now=Date.now(),random=Math.random) {
 if(command==='rpgexpansao')return formatExpansionMenu(prefix);
 if(!DRAGON_EXPANSION_COMMANDS.includes(command)) return '❌ Recurso desconhecido.';
 return transactDragonRpg(jid,(p,engine)=>{
  const e=p.expansion ||= {materials:{},bank:0,times:{},counts:{},claims:[],title:'aventureiro',research:0,upgrades:0,chests:0};
  const ok=text=>({ok:true,text}), fail=text=>({ok:false,text:`❌ ${text}`});
  const arg=String(args[0]||'').toLowerCase(), count=Number(args[1]);
  const has=(m,n)=>Number(e.materials[m]||0)>=n, take=(m,n)=>e.materials[m]=(e.materials[m]||0)-n;
  const add=(m,n)=>e.materials[m]=(e.materials[m]||0)+n;
  const ready=(key,ms)=>!e.times[key]||now-e.times[key]>=ms;
  const cooldown=(key,ms)=>fail(`Aguarde ${Math.ceil((ms-(now-e.times[key]))/60000)} min.`);
  const stamp=key=>{e.times[key]=now; e.counts[key]=(e.counts[key]||0)+1;};
  const pay=n=>Number.isSafeInteger(n)&&n>0&&p.gold>=n;
  const quantity=()=>Number.isSafeInteger(Number(args[0]))&&Number(args[0])>0&&Number(args[0])<=1000000;
  const titleUnlocked=t=>t==='aventureiro'||t==='coletor'&&(e.counts.coleta||0)>=10||t==='explorador'&&(e.counts.expedicao||0)>=5||t==='artesao'&&(e.counts.fabricacao||0)>=5;
  if(command==='bolsarpg')return ok(`🎒 *RECURSOS • venda/unidade: peixe 8, minerio 12, erva 10, madeira 8 ouro*\n🏦 Banco: ${e.bank} • Bolso: ${p.gold} ouro\n${Object.keys(MATERIALS).map(m=>`${m}: ${e.materials[m]||0}`).join('\n')}\nBaús: ${e.chests}\nTítulo: ${e.title}`);
  if(command==='mercadorrpg')return ok(`🪙 *MERCADOR*\n${Object.entries(MATERIALS).map(([m,v])=>`${m}: ${v} ouro/unidade`).join('\n')}\n${prefix}venderrpg peixe 2`);
  if(command==='bancorpg')return ok(`🏦 Banco: ${e.bank} ouro\nBolso: ${p.gold} ouro`);
  if(command==='petrpg')return ok(e.pet?`🐾 ${e.pet.type} • Lv.${e.pet.level}\nAlimentações: ${e.pet.feeds}\nTreinos: ${e.pet.trains}\nA cada 5 treinos: +1 sobrevivência do dono.`:`🐾 Adote com ${prefix}adotarrpg lobo (500 ouro).`);
  if(command==='contratosrpg')return ok(`📜 Entregue 5 peixes, 5 minérios, 5 ervas e 5 madeiras por 160 ouro + 80 XP. Intervalo: 6h.\n${prefix}entregarrpg`);
  if(command==='conquistasrpg'){
   const goals=[['coletor',e.counts.coleta||0,10],['explorador',e.counts.expedicao||0,5],['artesao',e.counts.fabricacao||0,5]];let reward=0;
   for(const [id,n,target] of goals)if(n>=target&&!e.claims.includes(id)){e.claims.push(id);reward+=150;}
   p.gold+=reward;return ok(`🏅 ${goals.map(([id,n,t])=>`${id}: ${n}/${t} ${e.claims.includes(id)?'✅':''}`).join('\n')}\nResgate novo: ${reward} ouro (150 por conquista, uma vez).`);
  }
  if(p.combat)return fail('Termine sua batalha antes desta ação.');
  if(command==='profissaorpg'){
   if(!Object.hasOwn(PROFESSIONS,arg))return fail(`Escolha: ${Object.keys(PROFESSIONS).join(', ')}.`);
   if(e.profession===arg)return fail('Você já tem essa profissão.');
   if(e.profession&&!ready('profissao',7*86400000))return cooldown('profissao',7*86400000);
   e.profession=arg;stamp('profissao');return ok(`🛠️ Profissão: ${arg}. Próxima troca em 7 dias.`);
  }
  const gather={pescarrpg:'peixe',minerarrpg:'minerio',coletarrpg:'erva',cortarrpg:'madeira'};
  if(Object.hasOwn(gather,command)){
   if(!ready('coleta',600000))return cooldown('coleta',600000);
   const m=gather[command],n=2+Math.floor(random()*3)+(PROFESSIONS[e.profession]===m?1:0);add(m,n);stamp('coleta');engine.awardXp(p,10);return ok(`🌿 Coletou ${n} ${m}. +10 XP.`);
  }
  if(command==='venderrpg'){
   if(!Object.hasOwn(MATERIALS,arg)||!Number.isSafeInteger(count)||count<1||count>1000000)return fail(`Use ${prefix}venderrpg peixe 2.`);
   if(!has(arg,count))return fail('Recursos insuficientes.');take(arg,count);p.gold+=MATERIALS[arg]*count;return ok(`🪙 Vendeu ${count} ${arg}: +${MATERIALS[arg]*count} ouro.`);
  }
  if(command==='depositarrpg'||command==='sacarrpg'){
   if(!quantity())return fail('Informe um inteiro positivo até 1000000.');const n=Number(args[0]);
   if(command==='depositarrpg'){if(!pay(n))return fail('Ouro insuficiente.');p.gold-=n;e.bank+=n;}
   else{if(e.bank<n)return fail('Saldo insuficiente.');e.bank-=n;p.gold+=n;}
   return ok(`🏦 Banco: ${e.bank} • Bolso: ${p.gold} ouro.`);
  }
  if(command==='diariorpg'){
   if(!ready('diario',86400000))return cooldown('diario',86400000);stamp('diario');p.gold+=80;engine.awardXp(p,40);return ok('🎁 +80 ouro e +40 XP. Novo resgate em 24h.');
  }
  if(['alquimiarpg','cozinharpg','forjarrpg'].includes(command)){
   let m,n,cost,id;
   if(command==='alquimiarpg'){if(!['vida','mana'].includes(arg))return fail(`Use ${prefix}alquimiarpg vida ou mana.`);[m,n,cost,id]=['erva',3,20,arg==='vida'?'pocao_pequena':'pocao_mana'];}
   if(command==='cozinharpg')[m,n,cost,id]=['peixe',2,10,'pao_aventureiro'];
   if(command==='forjarrpg')[m,n,cost,id]=['minerio',5,80,'espada_ferro'];
   if(!has(m,n)||!pay(cost))return fail(`Precisa de ${n} ${m} + ${cost} ouro.`);
   take(m,n);p.gold-=cost;engine.addItem(p,{...engine.items[id],qty:1});stamp('fabricacao');return ok(`⚒️ Criou ${engine.items[id].name}. Use ${prefix}rpginventario.`);
  }
  if(command==='reciclarrpg'){
   const item=p.inventory.find(x=>x.id===arg&&x.qty>0),catalog=engine.items[arg];
   if(!item||!catalog||!['weapon','armor','accessory'].includes(catalog.type))return fail('Informe um equipamento do seu inventário.');
   if(Object.values(p.equipment).includes(arg))return fail('Desequipe antes de reciclar.');item.qty--;p.inventory=p.inventory.filter(x=>x.qty>0);add('minerio',2);return ok('♻️ Equipamento consumido: +2 minérios.');
  }
  if(command==='treinarrpg'){
   const keys={combate:'combat',furtividade:'stealth',sobrevivencia:'survival',arcana:'arcana'};
   if(!Object.hasOwn(keys,arg))return fail('Escolha combate, furtividade, sobrevivencia ou arcana.');
   if(!ready('treino',21600000))return cooldown('treino',21600000);if(!pay(80))return fail('Precisa de 80 ouro.');p.gold-=80;p.specialties[keys[arg]]++;stamp('treino');return ok(`🥋 +1 ${arg}. -80 ouro.`);
  }
  if(command==='expedirrpg'){
   const destinations={bosque:[1,40,40,'madeira'],montanha:[10,90,100,'minerio'],ruinas:[20,160,200,'erva']};
   if(!Object.hasOwn(destinations,arg))return fail('Destinos: bosque (Lv.1/40 ouro), montanha (Lv.10/90 ouro), ruinas (Lv.20/160 ouro).');
   const [lv,cost,xp,m]=destinations[arg];if(p.level<lv||!pay(cost))return fail(`Exige nível ${lv} e ${cost} ouro.`);
   if(!ready('expedicao',1800000))return cooldown('expedicao',1800000);p.gold-=cost;add(m,5);engine.awardXp(p,xp);stamp('expedicao');return ok(`🧭 Voltou de ${arg}: +5 ${m}, +${xp} XP. -${cost} ouro.`);
  }
  if(command==='acamparrpg'){
   if(!ready('acampamento',1800000))return cooldown('acampamento',1800000);if(!has('madeira',2)||!pay(20))return fail('Precisa de 2 madeiras e 20 ouro.');take('madeira',2);p.gold-=20;p.resources.hp=Math.min(p.stats.hp,p.resources.hp+Math.ceil(p.stats.hp*.35));p.resources.mana=Math.min(p.stats.mana,p.resources.mana+Math.ceil(p.stats.mana*.25));stamp('acampamento');return ok('⛺ Recuperou até 35% HP e 25% Mana.');
  }
  if(command==='adotarrpg'){
   if(!['lobo','fada','dragonete'].includes(arg))return fail('Escolha lobo, fada ou dragonete.');if(e.pet)return fail('Você já tem um companheiro.');if(!pay(500))return fail('Precisa de 500 ouro.');p.gold-=500;e.pet={type:arg,level:1,feeds:0,trains:0};return ok(`🐾 Adotou ${arg}. Alimente antes de cada treino.`);
  }
  if(['alimentarrpg','treinopetrpg'].includes(command)){
   if(!e.pet)return fail('Adote um companheiro primeiro.');
   if(command==='alimentarrpg'){if(!ready('alimentar',3600000))return cooldown('alimentar',3600000);if(!has('peixe',2))return fail('Precisa de 2 peixes.');take('peixe',2);e.pet.feeds++;stamp('alimentar');return ok('🐾 Companheiro alimentado.');}
   if(!ready('pettreino',21600000))return cooldown('pettreino',21600000);if(e.pet.feeds<=e.pet.trains||!pay(100))return fail('Precisa de uma alimentação disponível e 100 ouro.');p.gold-=100;e.pet.trains++;e.pet.level=1+Math.floor(e.pet.trains/5);if(e.pet.trains%5===0)p.specialties.survival++;stamp('pettreino');return ok(`🐾 Treino ${e.pet.trains}. Companheiro Lv.${e.pet.level}.`);
  }
  if(command==='tesourorpg'){
   if(!ready('tesouro',3600000))return cooldown('tesouro',3600000);if(!pay(100))return fail('Precisa de 100 ouro.');p.gold-=100;e.chests++;stamp('tesouro');return ok(`🗺️ Encontrou um baú. Abra com ${prefix}abrirbaurpg.`);
  }
  if(command==='abrirbaurpg'){
   if(e.chests<1)return fail('Você não tem baús.');e.chests--;const gold=40+Math.floor(random()*81);p.gold+=gold;add('erva',2);return ok(`🎁 +${gold} ouro e 2 ervas.`);
  }
  if(command==='pesquisarrpg'||command==='aprimorarrpg'){
   const research=command==='pesquisarrpg',cost=research?100:150,key=research?'research':'upgrades';
   if(!research&&!['atk','def','mag','agi'].includes(arg))return fail('Escolha atk, def, mag ou agi.');
   if(e[key]>=20)return fail('Limite de 20 melhorias alcançado.');if(!has('minerio',3)||!pay(cost))return fail(`Precisa de 3 minérios e ${cost} ouro.`);
   take('minerio',3);p.gold-=cost;e[key]++;p.stats[research?'mana':arg]+=research?2:1;return ok(research?'🔬 +2 Mana máxima.':'🔨 +1 atributo permanente.');
  }
  if(command==='curandeirorpg'){
   if(p.resources.hp>=p.stats.hp)return fail('Sua vida já está cheia.');if(!pay(60))return fail('Precisa de 60 ouro.');p.gold-=60;p.resources.hp=p.stats.hp;return ok('💚 Vida restaurada. -60 ouro.');
  }
  if(command==='entregarrpg'){
   if(!ready('contrato',21600000))return cooldown('contrato',21600000);if(!Object.keys(MATERIALS).every(m=>has(m,5)))return fail('Precisa de 5 de cada recurso.');for(const m of Object.keys(MATERIALS))take(m,5);p.gold+=160;engine.awardXp(p,80);stamp('contrato');return ok('📜 Contrato entregue: +160 ouro e +80 XP.');
  }
  if(command==='titulorpg'){
   if(!titleUnlocked(arg))return fail('Título bloqueado ou inexistente. Consulte conquistasrpg.');e.title=arg;return ok(`🏅 Título ativo: ${arg}.`);
  }
  return fail('Recurso desconhecido.');
 });
}
