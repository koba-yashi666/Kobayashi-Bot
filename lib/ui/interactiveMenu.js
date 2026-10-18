import fs from "node:fs";

// IDs são comandos normais: passam pelas mesmas permissões do dispatcher.
export const MENU_CATEGORIES = [
  ["🛡️ Administração", "menuadm", "Moderação e proteções do grupo"],
  ["🌸 Geral", "menugeral", "Utilidades, perfil e informações"],
  ["🎴 Figurinhas", "menusticker", "Criação, pacotes e conversão"],
  ["⭐ Níveis", "menulevel", "Experiência e rankings"],
  ["🐲 Dragon Social", "menusocial", "Coins, conquistas e inventário"],
  ["🛍️ Loja", "menuloja", "Itens e títulos Dragon"],
  ["🎮 Brincadeiras", "menubn", "Jogos e diversão"],
  ["🐉 Dragon RPG", "dragonrpg", "Classes, batalhas e aventuras"],
  ["👑 Dono", "menudono", "Comandos restritos ao dono"],
  ["💎 VIP", "menuvip", "Comandos e benefícios VIP"],
  ["🏡 Aluguel", "planos", "Planos de aluguel da Kobayashi"]
];

export function buildMenuButtons(prefix = "/") {
  return [
    { name: "single_select", buttonParamsJson: JSON.stringify({
      title: "Ver categorias 📂",
      sections: [{ title: "📌 Escolha uma categoria", rows: MENU_CATEGORIES.map(([title, command, description]) => ({
        header: "Aba de comandos", title, description, id: `${prefix}${command}`
      })) }]
    }) },
    { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Meu ID 🆔", id: `${prefix}menu id` }) }
  ];
}

export function buildInteractiveMenuText({ sender, botName, prefix, version }) {
  return [
    "╭── 🌸 KOBAYASHI BOT 🌸 ──╮",
    `│ 🐉 Bot: ${botName}`,
    `│ ✨ Versão: v${version}`,
    `│ 🎐 Prefixo: ${prefix}`,
    `│ 👤 Solicitante: @${String(sender).split("@")[0]}`,
    "│ 🟢 Status: Online",
    `│ 📂 Categorias: ${MENU_CATEGORIES.length}`,
    "╰────────────────────╯", "",
    "🌀 Toque em *Ver categorias* e escolha uma aba.",
    `💡 Se os botões não aparecerem: *${prefix}menu texto*`
  ].join("\n");
}

// O ACK do relay não comprova renderização: o menu convencional vai primeiro.
export async function sendInteractiveMenu({ conn, jid, quoted, sender, botName, prefix, version, imagePath, fallback }, api) {
  const normal = { caption: fallback, mentions: [sender] };
  if (fs.existsSync(imagePath)) {
    try {
      await conn.sendMessage(jid, { ...normal, image: fs.readFileSync(imagePath) }, { quoted });
    } catch (error) {
      console.error("[Menu] Imagem indisponível:", error?.message);
      await conn.sendMessage(jid, { text: fallback, mentions: [sender] }, { quoted });
    }
  } else {
    await conn.sendMessage(jid, { text: fallback, mentions: [sender] }, { quoted });
  }

  let timer;
  try {
    const { generateWAMessageFromContent } = api;
    // A lista não depende de upload de imagem e não usa envelope de visualização única.
    const interactiveMessage = {
      header: { title: "🐉 Kobayashi Bot", hasMediaAttachment: false },
      body: { text: buildInteractiveMenuText({ sender, botName, prefix, version }) },
      footer: { text: "Kobayashi Bot • Theo" },
      contextInfo: { mentionedJid: [sender] },
      nativeFlowMessage: { buttons: buildMenuButtons(prefix), messageParamsJson: "" }
    };
    const message = generateWAMessageFromContent(jid, { interactiveMessage }, { userJid: conn.user.id, quoted });
    const sending = conn.relayMessage(jid, message.message, {
      messageId: message.key.id,
      additionalNodes: [{ tag: "biz", attrs: {}, content: [{
        tag: "interactive", attrs: { type: "native_flow", v: "1" }, content: [{
          tag: "native_flow", attrs: { v: "9", name: "mixed" }
        }]
      }] }, ...(jid.endsWith("@g.us") ? [] : [{ tag: "bot", attrs: { biz_bot: "1" } }])]
    });
    await Promise.race([sending, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Tempo limite da lista interativa")), 12000);
    })]);
    return { interactive: true };
  } catch (error) {
    console.error("[Menu interativo] Lista indisponível; menu convencional já enviado:", error?.message);
    return { interactive: false };
  } finally {
    clearTimeout(timer);
  }
}
