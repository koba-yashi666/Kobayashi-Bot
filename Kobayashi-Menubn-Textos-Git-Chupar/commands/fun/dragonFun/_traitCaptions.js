export function traitCaption(command, targetTag, value){
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
