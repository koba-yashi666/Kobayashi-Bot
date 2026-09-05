import fs from "node:fs";
import path from "node:path";
import {
  stablePercent, getRank, traitText, mediaFor, startForca, guessForca,
  startAnagram, answerSimple, startQuiz, startEnigma, startWordle, guessWordle,
  randomTruth, randomDare, randomNever, daily, work, transfer, gamble, topCoins,
  proposeMarriage, acceptMarriage, marriageOf, divorce, familyAction, getFamily,
  getUser, shop, buy, inventory, simpleRpgAction
} from "../../lib/features/social/dragonFunV09.js";
import { isRpgEnabled, setRpgEnabled } from "../../lib/features/social/rpgSettings.js";
import { buildFunMenu } from "../../lib/ui/menuTheme.js";

const TRAITS = [
"personalidade","linda","lindo","gay","hetero","lesbica","puta","gado","feio","corno","vesgo","bebado","gostoso","gostosa","golpista","nazista","otaku","pobre","rico","burro","burra","inteligente","fiel","infiel","safado","safada","ladrao","ladra","sortudo","sortuda","azarado","azarada","forte","fraco","fraca","pegador","pegadora","otario","otaria","bobo","boba","nerd","preguicoso","preguicosa","trabalhador","trabalhadora","brabo","braba","malandro","malandra","simpatico","simpatica","engracado","engracada","charmoso","charmosa","ciumento","ciumenta","romantico","romantica","responsavel","irresponsavel","introvertido","introvertida","extrovertido","extrovertida","criativo","criativa","gamer","programador","programadora","visionario","visionaria","sonhador","sonhadora","viajante","caseiro","caseira","misterioso","misteriosa","zueiro","zueira","chance","sorte"
];
const ACTIONS = ["beijo","beijar","abraco","abraço","abracar","tapa","tapar","chute","chutar","carinho","cafune","matar","comer","louca","louça","lamber","morder","socar","soco","chorao","chorona"];
const GAME_ALIASES = ["modorpg","menubn","menujogos","menudiversao","menubrincadeiras","brincadeira","games","forca","fc","anagrama","quiz","trivia","enigma","wordle","palavra","ppt","pedrapapeltesoura","coinflip","moeda","dados","dice","cassino","slots","slotmachine","roleta","roulette","verdade","desafio","eununca","vord","jogodavelha","tictactoe","connect4","uno","stop","adedonha","cacapalavras","batalhanaval","dueloquiz","duelo","jogov","resetv","gartic","revelar_gartic","quiz_animais","revelar_animal","revelar_enigma","revelar_anagrama","participar","start_vord","help_vord","regras_vord","status_vord","rm_vord","add_vord","exit_vord","pular","reset_vord","responder","confirmar","pontos","checkpts","rankpts","sn","shipo","casal","cantada","piada","fato","conselho","elogio","reflexao","motivacional","quando","amongus","roletaban"];
const SOCIAL = ["casar","aceitarcasamento","aceitarpedido","divorciar","minhadupla","relacionamento","casais","familia","adotaruser","adotarfilho","deserdar","arvore","criar_familia","sair_familia","deletar_familia"];
const ECON = ["menurpg","rpg","perfilrpg","carteira","gold","vergold","daily","diario","work","trabalhar","mine","minerar","fish","pescar","hunt","cacar","caçar","explore","explorar","crime","roubar","assaltar","doargold","pix","rankgold","toprpg","topriqueza","loja","comprar","inv","inventario"];
const RPG = ["emprego","vagas","demitir","habilidades","desafiosemanal","desafiomensal","investir","sell","plantar","cultivar","farm","colher","coletar","harvest","plantacao","horta","cozinhar","cook","receitas","ingredientes","sementes","comer","eat","vendercomida","masmorra","dungeon","bossrpg","arena","torneio","guerra","desafio","forge","forjar","encantar","enchant","dismantle","desmontar","reparar","materiais","precos","equipamentos","pets","adotar","feed","train","evolve","renamepet","petbattle","petbet","equippet","unequippet","classe","class","casa","house","auction","mercado","missoes","quests","conquistas","achievements","prestige","evoluir","streak","reivindicar","claim","speedup","boost","tributos","meustats","criarcla","cla","convidar","convite","rmconvite","aceitarconvite","recusarconvite","expulsar","sair","lojapremium","comprarpremium","propriedades","cprop","cprops","doar","presente","reputacao","rep","vote","eventos","loteria","corrida","leilao","investir","evoluir","reivindicar","speedup"];
const RANKS = TRAITS.map(x=>`rank${x}`);
export const dragonFunAliases=[...new Set([...TRAITS,...ACTIONS,...GAME_ALIASES,...SOCIAL,...ECON,...RPG,...RANKS])];

function ctxInfo(info){return info?.message?.extendedTextMessage?.contextInfo||info?.message?.imageMessage?.contextInfo||info?.message?.videoMessage?.contextInfo||{};}
function targetOf(ctx){const c=ctxInfo(ctx.info);return c?.mentionedJid?.[0]||c?.participant||null;}
function tag(jid){return jid?`@${String(jid).split("@")[0]}`:"alguém";}

function traitCaption(command, targetTag, value){
  const t = String(targetTag || "alguém");
  const bank = {
    personalidade: `🧠✨ *PERSONALIDADE DRAGON*\n\n➬ 「 ${t} 」\n\nA Kobayashi analisou sua aura e detectou *${value}%* de personalidade marcante. 🐉🌸`,
    linda: `💎🌟 *O quanto você é linda?*\n\n➬ 「 ${t} 」\n\nVOCÊ É: ✰ *${value}%* ✰ LINDA 😻✨`,
    lindo: `💎🌟 *O quanto você é lindo?*\n\n➬ 「 ${t} 」\n\nVOCÊ É: ✰ *${value}%* ✰ LINDO 😻✨`,
    gay: `🌈✨ ${t} está irradiando *${value}%* de orgulho e alegria! O arco-íris ficou até mais forte hoje. 🏳️‍🌈💖`,
    hetero: `✨📊 ${t} marcou *${value}%* no medidor hétero da Kobayashi. Resultado totalmente científico, confia. 🐉`,
    lesbica: `🌈🌸 ${t} está com *${value}%* de energia sáfica detectada pelo radar Dragon. 💖✨`,
    gado: `🐄💨 *O quanto você é gado?*\n\n「 ${t} 」\n\nVocê é: ❰ *${value}%* ❱ GADO 🐂\n\n${value >= 90 ? "👑 Gado-Rei detectado!" : value >= 60 ? "🐂 Gado avançado!" : value >= 30 ? "🐮 Gadinho em treinamento." : "🌱 Ainda há esperança."}`,
    feio: `👻😅 *O quanto você é feio?*\n\n➬ 「 ${t} 」\n\nVOCÊ É ✰ *${value}%* ✰ FEIO\n\n📐 Charme é questão de ângulo, né?`,
    corno: `🐂👑 *MEDIDOR DE CHIFRES*\n\n➬ 「 ${t} 」\n\nResultado: ✰ *${value}%* ✰\n\nSerá que tem fundamento ou é só folclore? 🤭📊`,
    bebado: `🍻🎤 ${t} está com *${value}%* de alegria de boteco! 💧 A Kobayashi recomenda água antes do próximo rolê. 🥴`,
    gostoso: `🔥🌟 *Se liga o quanto você é gostoso*\n\n➬ 「 ${t} 」\n\nVOCÊ É › *${value}%* ‹ GOSTOSO 🤤✨`,
    gostosa: `🔥🌸 *O quanto você é gostosa?*\n\n➬ 「 ${t} 」\n\nVOCÊ É › *${value}%* ‹ GOSTOSA 🙀✨`,
    golpista: `🕵️‍♂️💸 ${t} está com *${value}%* de energia suspeita. A Kobayashi já escondeu a carteira. 👀`,
    otaku: `🎌🍜 ${t} atingiu *${value}%* de poder otaku! Já dá pra ouvir uma opening tocando ao fundo. ⚔️✨`,
    pobre: `💸🥺 ${t} está com *${value}%* de crise financeira! Alguém inicia a vaquinha Dragon? 🐉💔`,
    rico: `💰🏦 ${t} ostenta *${value}%* de fortuna! Tá quase nadando em Dragon Coins. 🤑💎`,
    chance: `🔮🐉 *ORÁCULO DRAGON*\n\n${t}, a chance indicada pela Kobayashi é de *${value}%*.`
  };
  return bank[command] || null;
}

function actionCaption(command, actor, target){
  const bank = {
    beijo: `Awwww 😍 ${actor} deu um beijo carinhoso em ${target}! 💋💖`,
    beijar: `Awwww 😍 ${actor} deu um beijo carinhoso em ${target}! 💋💖`,
    abraco: `Abraço caloroso! 🤗 ${actor} envolveu ${target} em um abraço super apertado e aconchegante! 💕`,
    abracar: `Abraço caloroso! 🤗 ${actor} envolveu ${target} em um abraço super apertado e aconchegante! 💕`,
    carinho: `🥰 ${actor} fez um carinho fofinho em ${target}... energia de conforto +100! 💞`,
    cafune: `Que delícia de cafuné! 🥰 ${actor} fez ${target} relaxar com seus dedos mágicos! 💆✨`,
    tapa: `PÁH! 👋 ${actor} deu um tapa sonoro em ${target}! Não deu nem tempo de reagir. 😳`,
    tapar: `PÁH! 👋 ${actor} deu um tapa sonoro em ${target}! Não deu nem tempo de reagir. 😳`,
    chute: `PUFF! 💥 ${actor} acabou de dar uma bicuda poderosa em ${target}! 😱`,
    chutar: `PUFF! 💥 ${actor} acabou de dar uma bicuda poderosa em ${target}! 😱`,
    morder: `😋 ${actor} deu uma mordida em ${target}! A Kobayashi vai fingir que não viu. 🐉`,
    socar: `🥊 ${actor} acertou um soco de brincadeira em ${target}!`,
    soco: `🥊 ${actor} acertou um soco de brincadeira em ${target}!`,
    lamber: `👅💖 ${actor} deu uma lambida em ${target}. Isso ficou estranho bem rápido.`,
    matar: `💀🎭 ${actor} eliminou ${target} dramaticamente... no faz de conta, obviamente.`,
    comer: `🍜 ${actor} chamou ${target} pra comer alguma coisa. Finalmente uma interação pacífica.`,
    louca: `🍽️😤 ${actor} mandou ${target} lavar a louça. A guerra começou.`,
    chorao: `😭 ${actor} declarou que ${target} está no modo chorão hoje.`,
    chorona: `😭 ${actor} declarou que ${target} está no modo chorona hoje.`
  };
  return bank[command] || `💞 ${actor} interagiu com ${target}!`;
}
function ms(ms){const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000);return `${h}h ${m}m`;}
async function sendMedia(ctx,url,caption,mentions=[]){ if(!url)return ctx.conn.sendMessage(ctx.from,{text:caption,mentions},{quoted:ctx.info}); try{const isVideo=/\.(mp4|gif)(?:$|\?)/i.test(url); await ctx.conn.sendMessage(ctx.from,isVideo?{video:{url},gifPlayback:true,caption,mentions}:{image:{url},caption,mentions},{quoted:ctx.info});}catch{await ctx.conn.sendMessage(ctx.from,{text:caption,mentions},{quoted:ctx.info});}}
function menu(p){return buildFunMenu(p);}
function rpgMenu(p){return `╭━━〔 🐉⚔️ *DRAGON RPG 0.9* 〕━━╮\n👤 ${p}perfilrpg | ${p}carteira | ${p}toprpg\n💰 ${p}daily | ${p}work | ${p}mine | ${p}fish | ${p}explore\n🎰 ${p}dados 20 | ${p}coinflip cara 50 | ${p}slots 30 | ${p}roleta preto 50\n🛒 ${p}loja | ${p}comprar picareta | ${p}inv\n🌱 ${p}plantar trigo | ${p}colher | ${p}cook sopa\n⚔️ ${p}dungeon | ${p}bossrpg | ${p}arena | ${p}torneio\n🔨 ${p}forge espada | ${p}encantar espada | ${p}reparar espada\n🐾 ${p}pets | ${p}adotar dragao | ${p}feed 1 | ${p}train 1\n🏰 ${p}classe | ${p}casa | ${p}auction | ${p}mercado\n📜 ${p}missoes | ${p}conquistas | ${p}prestige\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;}

export default {
 name:"dragonfun", aliases:dragonFunAliases, category:"diversao", description:"Sistema completo de diversão e RPG da v0.9.0.", usage:"menujogos", permission:"Membro",
 async execute(ctx){
  const c=String(ctx.command||"").toLowerCase(); const n=c.normalize("NFD").replace(/[\u0300-\u036f]/g,""); const target=targetOf(ctx)||ctx.sender; const mentions=target?[target]:[];
  if(["dragonfun","menubn","menujogos","menudiversao","menubrincadeiras","brincadeira","games"].includes(n)) return ctx.reply(menu(ctx.prefix));

  const rpgEnabled = !ctx.isGroup || isRpgEnabled(ctx.from);

  if(n === "modorpg"){
    if(!ctx.isGroup) return ctx.reply("🐉 O controle do RPG é configurado por grupo.");
    if(!ctx.permissions?.isAdmin) return ctx.reply("🛡️ Apenas administradores podem ativar ou desativar o modo RPG.");
    const enabled = !rpgEnabled;
    setRpgEnabled(ctx.from, enabled, ctx.sender);
    return ctx.reply(enabled
      ? "🐉⚔️ *Modo RPG ativado neste grupo!*\nOs comandos do Dragon RPG voltaram a funcionar."
      : `🐉💤 *Modo RPG desativado neste grupo!*\nUse *${ctx.prefix}modorpg* novamente para reativar.`);
  }

  if(["menurpg","rpg"].includes(n)){
    if(!rpgEnabled) return ctx.reply(`🐉💤 O *Modo RPG está desativado* neste grupo.\n\n🛡️ ADM: use *${ctx.prefix}modorpg* para ativar.`);
    return ctx.reply(rpgMenu(ctx.prefix) + `\n\n🛡️ ADM: *${ctx.prefix}modorpg* para desativar neste grupo.`);
  }

  if((ECON.includes(n) || RPG.includes(n)) && !rpgEnabled){
    return ctx.reply(`🐉💤 O *Modo RPG está desativado* neste grupo.\n🛡️ Um ADM pode ativar com *${ctx.prefix}modorpg*.`);
  }
  if(RANKS.includes(n)){const trait=n.slice(4);const jids=(ctx.groupMembers||[]).map(x=>x.id||x.jid).filter(Boolean);const rows=getRank(jids,trait,10);return ctx.conn.sendMessage(ctx.from,{text:`🏆 *RANK ${trait.toUpperCase()}*\n\n`+rows.map((x,i)=>`${i+1}. ${tag(x.jid)} — *${x.score}%*`).join("\n"),mentions:rows.map(x=>x.jid)},{quoted:ctx.info});}
  if(TRAITS.includes(n)){const val=stablePercent(target,n);const txt=traitCaption(n,tag(target),val)||traitText(n,tag(target),val);return sendMedia(ctx,mediaFor(n),txt,mentions);}
  if(ACTIONS.includes(n)){if(target===ctx.sender)return ctx.reply(`• Mencione o "@" ou responda a mensagem de alguém. 🤷‍♀️\n• Exemplo: *${ctx.prefix}${c} @membro*`);const cap=actionCaption(n,tag(ctx.sender),tag(target));return sendMedia(ctx,mediaFor(n),cap,[ctx.sender,target]);}
  if(n==="forca"||n==="fc"){if(ctx.args?.length){const r=guessForca(ctx.from,ctx.sender,ctx.args.join(" "));if(r.win)return ctx.reply(`🎉 Acertou! A palavra era *${r.word}*. +60 coins.`);if(r.lose)return ctx.reply(`💀 Fim de jogo! A palavra era *${r.word}*.`);if(r.ok)return ctx.reply(`🪢 ${r.masked}\n❤️ Tentativas: ${r.tries}\n💡 ${r.hint}`);}const s=startForca(ctx.from,ctx.sender);const mask=[...s.word].map(x=>x===" "?" ":"_ ").join("");return ctx.reply(`🪢 *FORCA*\n\n${mask}\n💡 Dica: ${s.hint}\n📚 Tema: ${s.theme}\n\nResponda com *${ctx.prefix}forca letra/palavra*`);}
  if(n==="anagrama"){if(ctx.args?.length){const r=answerSimple(ctx.from,ctx.sender,ctx.args.join(" "));return r.correct?ctx.reply(`✅ Acertou! *${r.answer}* +50 coins.`):ctx.reply("❌ Ainda não. Tente novamente!");}const s=startAnagram(ctx.from,ctx.sender);return ctx.reply(`🔀 *ANAGRAMA*\n\n🔤 *${s.scrambled.toUpperCase()}*\n💡 ${s.hint}\n\nResponda: *${ctx.prefix}anagrama resposta*`);}
  if(["quiz","trivia"].includes(n)){if(ctx.args?.length){const r=answerSimple(ctx.from,ctx.sender,ctx.args.join(" "));return r.correct?ctx.reply(`✅ Resposta certa: *${r.answer}*. +50 coins.`):ctx.reply("❌ Resposta incorreta. Tente de novo!");}const s=startQuiz(ctx.from,ctx.sender);return ctx.reply(`🧠 *QUIZ • ${s.category.toUpperCase()}*\n\n${s.question}\n\nResponda: *${ctx.prefix}quiz resposta*`);}
  if(n==="enigma"){if(ctx.args?.length){const r=answerSimple(ctx.from,ctx.sender,ctx.args.join(" "));return r.correct?ctx.reply(`🧩 Acertou: *${r.answer}*! +50 coins.`):ctx.reply("❌ Não foi dessa vez.");}const s=startEnigma(ctx.from,ctx.sender);return sendMedia(ctx,mediaFor("enigma"),`🧩 *ENIGMA*\n\n${s.question}\n\nResponda: *${ctx.prefix}enigma resposta*`);}
  if(["wordle","palavra"].includes(n)){if(ctx.args?.length){const r=guessWordle(ctx.from,ctx.sender,ctx.args[0]);if(r.invalid)return ctx.reply(`A palavra possui *${r.len} letras*.`);if(r.win)return ctx.reply(`🟩🟩🟩 Vitória! *${r.word}* +70 coins.`);if(r.lose)return ctx.reply(`${r.grid}\n💀 Acabaram as tentativas. Palavra: *${r.word}*`);return ctx.reply(`${r.grid}\n❤️ Restam ${r.tries} tentativa(s).`);}const s=startWordle(ctx.from,ctx.sender);return ctx.reply(`🟩 *WORDLE*\nA palavra tem *${s.word.length} letras*.\nVocê tem 6 tentativas.\n\nUse *${ctx.prefix}wordle palavra*`);}
  if(["verdade","vord"].includes(n))return ctx.reply(`💬 *VERDADE*\n${randomTruth()}`);
  if(n==="desafio")return ctx.reply(`🔥 *DESAFIO*\n${randomDare()}`);
  if(n==="eununca")return ctx.reply(`🙈 *EU NUNCA*\n${randomNever()}`);
  if(["cantada","piada","fato","conselho","elogio","reflexao","motivacional","quando"].includes(n)){const bank={cantada:["Você não é Wi-Fi, mas senti uma conexão aqui 😏","Você é estrela? Porque iluminou o grupo inteiro ✨"],piada:["Por que o computador foi ao médico? Porque pegou um vírus. 💻😂","O zero disse pro oito: belo cinto! 😭"],fato:["🐙 Polvos têm três corações.","🌌 A luz do Sol leva cerca de 8 minutos para chegar à Terra."],conselho:["🌱 Faça primeiro o que depende de você; o resto fica mais fácil de organizar.","🧭 Nem toda pressa é progresso. Escolha uma direção antes de acelerar."],elogio:["✨ Você parece ser o tipo de pessoa que melhora o clima do grupo.","🌸 Seu bom humor merece XP extra hoje."],reflexao:["🌙 Às vezes mudar de rota é parte do caminho, não um fracasso.","🐉 Consistência pequena costuma vencer motivação gigante e rara."],motivacional:["🔥 Um passo hoje ainda é um passo.","🐉 Continue acumulando XP; chefão nenhum cai no primeiro hit."],quando:["🔮 Meu palpite totalmente científico: em breve.","⏳ Os dragões disseram: ainda não, mas tá chegando."]};return ctx.reply(bank[n][Math.floor(Math.random()*bank[n].length)]);}
  if(["ppt","pedrapapeltesoura"].includes(n)){const choices=["pedra","papel","tesoura"],me=String(ctx.args?.[0]||"").toLowerCase(),bot=choices[Math.floor(Math.random()*3)];if(!choices.includes(me))return ctx.reply(`🎮 *PEDRA, PAPEL OU TESOURA*\n\n💡 *Como jogar:*\n• Escolha sua jogada após o comando\n• ${ctx.prefix}ppt pedra\n• ${ctx.prefix}ppt papel\n• ${ctx.prefix}ppt tesoura\n\n🐉 Vamos ver quem ganha!`);const win=(me==="pedra"&&bot==="tesoura")||(me==="papel"&&bot==="pedra")||(me==="tesoura"&&bot==="papel");return ctx.reply(`╭━━〔 ✊✋✌️ *PPT DRAGON* 〕━━╮\n┃ 👤 Você: *${me}*\n┃ 🐉 Kobayashi: *${bot}*\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n${me===bot?"🤝 *Empate!*":win?"🏆 *Você venceu!*":"🐉 *Kobayashi venceu!*"}`);}
  if(["dados","dice","coinflip","moeda","cassino","slots","slotmachine","roleta","roulette"].includes(n)){let game="slots",choice="",bet=10;if(["dados","dice"].includes(n)){game="dice";bet=ctx.args?.[0];}else if(["coinflip","moeda"].includes(n)){game="coinflip";choice=ctx.args?.[0];bet=ctx.args?.[1];}else if(["roleta","roulette"].includes(n)){game="roulette";choice=ctx.args?.[0];bet=ctx.args?.[1];}else bet=ctx.args?.[0];const r=gamble(ctx.sender,game,bet,choice);if(!r.ok)return ctx.reply("💸 Saldo insuficiente ou aposta inválida.");return ctx.reply(`🎰 *${game.toUpperCase()}*\n${r.result}\n\n${r.win?`🏆 Ganhou *${r.prize}* coins!`:`💥 Perdeu *${r.bet}* coins.`}\n💰 Saldo: ${r.u.coins}`);}
  if(["jogodavelha","tictactoe","connect4","uno","stop","adedonha","cacapalavras","batalhanaval","dueloquiz","duelo","jogov","gartic","quiz_animais","amongus","roletaban"].includes(n)){const r=simpleRpgAction(ctx.sender,n,ctx.args?.join(" "));return ctx.reply(`🎮 *${n.toUpperCase()}*\n${r.text}\n⭐ Lv.${r.u.level} • 💰 ${r.u.coins}`);}
  if(["revelar_gartic","revelar_animal","revelar_enigma","revelar_anagrama","resetv","pular","responder","confirmar","participar","start_vord","help_vord","regras_vord","status_vord","rm_vord","add_vord","exit_vord","reset_vord","pontos","checkpts","rankpts"].includes(n)){return ctx.reply(`🎲 *${n.toUpperCase()}* integrado ao Dragon Fun 2.0.\nUse *${ctx.prefix}menubn* para iniciar uma rodada ou consultar os jogos disponíveis.`);}
  if(n==="daily"||n==="diario"){const r=daily(ctx.sender);return r.ok?ctx.reply(`🎁 Daily recebido: *${r.amount} coins*\n🔥 Streak: ${r.u.streak}\n💰 Saldo: ${r.u.coins}`):ctx.reply(`⏳ Daily já coletado. Volte em ${ms(r.wait)}.`);}
  if(["work","trabalhar","mine","minerar","fish","pescar","hunt","cacar","explore","explorar","crime"].includes(n)){const map={trabalhar:"work",minerar:"mine",pescar:"fish",cacar:"hunt",explorar:"explore"};const r=work(ctx.sender,map[n]||n);return r.ok?sendMedia(ctx,mediaFor(n),`${r.amount>=0?"✅":"💥"} *${n.toUpperCase()}*\nResultado: ${r.amount>=0?"+":""}${r.amount} coins\n💰 Saldo: ${r.u.coins}`):ctx.reply(`⏳ Aguarde ${ms(r.wait)} para tentar novamente.`);}
  if(["perfilrpg","carteira","gold","vergold"].includes(n)){const u=getUser(target);return ctx.conn.sendMessage(ctx.from,{text:`🐉 *DRAGON CARD*\n👤 ${tag(target)}\n⭐ Nível: ${u.level}\n✨ XP: ${u.xp}\n💰 Coins: ${u.coins}\n🏦 Banco: ${u.bank}\n🏆 Vitórias: ${u.wins}\n💥 Derrotas: ${u.losses}`,mentions:[target]},{quoted:ctx.info});}
  if(["rankgold","toprpg","topriqueza"].includes(n)){const rows=topCoins(10);return ctx.conn.sendMessage(ctx.from,{text:`🏆 *RANK DRAGON COINS*\n\n`+rows.map((x,i)=>`${i+1}. ${tag(x.jid)} — 💰 ${x.coins} | Lv.${x.level}`).join("\n"),mentions:rows.map(x=>x.jid)},{quoted:ctx.info});}
  if(["pix","doargold"].includes(n)){if(!target||target===ctx.sender)return ctx.reply(`Marque alguém: *${ctx.prefix}${c} @user 100*`);const amount=Number(ctx.args?.find(x=>/^\d+$/.test(x)));const r=transfer(ctx.sender,target,amount);return r.ok?ctx.conn.sendMessage(ctx.from,{text:`💸 ${tag(ctx.sender)} enviou *${r.amount} coins* para ${tag(target)}.`,mentions:[ctx.sender,target]},{quoted:ctx.info}):ctx.reply(r.reason==="saldo"?"💸 Saldo insuficiente.":"Informe um valor válido.");}
  if(n==="loja"){const s=shop();return ctx.reply(`🛒 *LOJA DRAGON*\n\n`+Object.entries(s).map(([id,x])=>`• *${id}* — ${x.name} — ${x.price} coins`).join("\n")+`\n\nUse *${ctx.prefix}comprar item [qtd]*`);}
  if(n==="comprar"){const r=buy(ctx.sender,ctx.args?.[0],ctx.args?.[1]);return r.ok?ctx.reply(`✅ Comprou ${r.qty}x ${r.x.name} por ${r.total} coins.\n💰 Saldo: ${r.u.coins}`):ctx.reply(r.reason==="saldo"?"💸 Saldo insuficiente.":`Item não encontrado. Veja *${ctx.prefix}loja*.`);}
  if(["inv","inventario"].includes(n)){const inv=inventory(target),rows=Object.entries(inv);return ctx.reply(rows.length?`🎒 *INVENTÁRIO*\n\n`+rows.map(([k,v])=>`• ${k}: ${v}`).join("\n"):"🎒 Inventário vazio.");}
  if(n==="casar"){if(!target||target===ctx.sender)return ctx.reply(`💍 Marque alguém: *${ctx.prefix}casar @user*`);const r=proposeMarriage(ctx.sender,target);return r.ok?ctx.conn.sendMessage(ctx.from,{text:`💍 ${tag(ctx.sender)} pediu ${tag(target)} em casamento!\n${tag(target)}, use *${ctx.prefix}aceitarcasamento* para aceitar.`,mentions:[ctx.sender,target]},{quoted:ctx.info}):ctx.reply("💔 Uma das pessoas já está em um relacionamento.");}
  if(["aceitarcasamento","aceitarpedido"].includes(n)){const r=acceptMarriage(ctx.sender);return r.ok?ctx.conn.sendMessage(ctx.from,{text:`💒 ${tag(ctx.sender)} e ${tag(r.partner)} agora são um casal!`,mentions:[ctx.sender,r.partner]},{quoted:ctx.info}):ctx.reply("Não existe pedido de casamento pendente para você.");}
  if(n==="divorciar"){const r=divorce(ctx.sender);return r.ok?ctx.conn.sendMessage(ctx.from,{text:`💔 ${tag(ctx.sender)} e ${tag(r.partner)} se divorciaram.`,mentions:[ctx.sender,r.partner]},{quoted:ctx.info}):ctx.reply("Você não está casado(a).");}
  if(["minhadupla","relacionamento","casais"].includes(n)){const p=marriageOf(ctx.sender);return p?ctx.conn.sendMessage(ctx.from,{text:`💞 Sua dupla é ${tag(p)}.`,mentions:[p]},{quoted:ctx.info}):ctx.reply("💔 Você ainda não tem uma dupla.");}
  if(n==="familia"||n==="arvore"){const f=getFamily(ctx.sender);return ctx.conn.sendMessage(ctx.from,{text:`👨‍👩‍👧‍👦 *FAMÍLIA*\nFilhos: ${f.children.length?f.children.map(tag).join(", "):"nenhum"}`,mentions:f.children},{quoted:ctx.info});}
  if(["adotaruser","adotarfilho"].includes(n)){if(!target||target===ctx.sender)return ctx.reply("Marque alguém para adotar.");const f=familyAction(ctx.sender,target,"adopt");return ctx.conn.sendMessage(ctx.from,{text:`🍼 ${tag(target)} entrou na família de ${tag(ctx.sender)}!`,mentions:[ctx.sender,target]},{quoted:ctx.info});}
  if(n==="deserdar"){if(!target||target===ctx.sender)return ctx.reply("Marque quem deseja remover da família.");familyAction(ctx.sender,target,"remove");return ctx.conn.sendMessage(ctx.from,{text:`👋 ${tag(target)} foi removido(a) da família.`,mentions:[target]},{quoted:ctx.info});}
  if(["shipo","casal"].includes(n)){if(!target||target===ctx.sender)return ctx.reply("Marque alguém para shippar.");const v=stablePercent(`${ctx.sender}:${target}`,"ship");return ctx.conn.sendMessage(ctx.from,{text:`💘 *SHIPÔMETRO*\n${tag(ctx.sender)} ❤️ ${tag(target)}\nCompatibilidade: *${v}%*`,mentions:[ctx.sender,target]},{quoted:ctx.info});}
  if(["sn","chance"].includes(n)){return ctx.reply(`🔮 Chance: *${Math.floor(Math.random()*101)}%*`);}
  if(RPG.includes(n)){const r=simpleRpgAction(ctx.sender,n,ctx.args?.join(" "));return ctx.reply(`${r.text}\n⭐ Lv.${r.u.level} • ✨ ${r.u.xp} XP • 💰 ${r.u.coins}`);}
  return ctx.reply(menu(ctx.prefix));
 }
};
