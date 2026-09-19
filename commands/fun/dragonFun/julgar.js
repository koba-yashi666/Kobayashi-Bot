import { targetOf, tag } from "./_utils.js";
export const aliases=["julgar","judge"];
export default async function run(ctx){const explicitTarget=targetOf(ctx);const target=explicitTarget||ctx.sender;

    if(!explicitTarget||explicitTarget===ctx.sender)return ctx.reply(`🤖 Marque alguém ou responda à mensagem da pessoa.\nExemplo: *${ctx.prefix}julgar @membro*`);
    const pick=a=>a[Math.floor(Math.random()*a.length)];
    const vergonha=Math.floor(Math.random()*101),caos=Math.floor(Math.random()*101),suspeita=Math.floor(Math.random()*101);
    const inteligencia=pick(["em manutenção 🛠️","questionável 🤨","funcionando por milagre 🙏","acima da média (talvez) 🧠","foi tomar café ☕","modo economia de energia 🔋"]);
    const redflags=Math.floor(Math.random()*11);
    const besteira=pick(["BAIXA 😇","MÉDIA 😶","ALTA 🤡","ABSURDA 💀","LENDÁRIA 🐉"]);
    const veredito=pick(["culpado de ser esquisito","inocente por falta de provas","culpado de causar caos no grupo","suspeito demais para ser liberado","condenado a mandar figurinha até segunda ordem","absolvido pela Kobayashi... desta vez","100% cidadão duvidoso"]);
    return ctx.conn.sendMessage(ctx.from,{text:`🤖 *ANALISANDO O SUSPEITO...* 🔎\n\n👤 Suspeito: ${tag(target)}\n📊 Nível de vergonha: *${vergonha}%*\n🧠 Inteligência: *${inteligencia}*\n💀 Chance de fazer merda hoje: *${caos}%*\n🚩 Red flags detectadas: *${redflags}*\n🕵️ Nível de suspeita: *${suspeita}%*\n🗣️ Capacidade de falar besteira: *${besteira}*\n\n⚖️ *Veredito da Kobayashi:* ${veredito}.`,mentions:[target]},{quoted:ctx.info});
}
