/*
 * KOBAYASHI BOT • BETA
 * Conexão WhatsApp via código de pareamento.
 */

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";

import NodeCache from "node-cache";
import start from "./index.js";
import { bindGroupCache, groupCache } from "./lib/groupCache.js";
import {
  readline,
  P,
  time,
  date,
  Boom,
  colors,
  mess,
  banner2,
  banner3,
} from "./settings/imports/consts.js";

const AUTH_DIR = "./files/database/qr-code";
const msgStore = new NodeCache({ stdTTL: 10 * 60, useClones: false });
const msgRetryCounterCache = new NodeCache();

let botReady = false;
let reconnecting = false;
let rl;

function collectNumbers(input) {
  return String(input || "").replace(/\D/g, "");
}

function closeReadline() {
  if (rl) {
    rl.close();
    rl = undefined;
  }
}

function ask(text) {
  closeReadline();
  rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(text, resolve));
}

async function getMessage(key) {
  return msgStore.get(key.id);
}

async function requestPairingCode(conn) {
  let configuredNumber = "";
  try {
    const settings = JSON.parse(
      (await import("node:fs")).default.readFileSync(new URL("./settings/settings.json", import.meta.url), "utf8")
    );
    configuredNumber = collectNumbers(settings?.botNumber || "");
  } catch {}

  const input = configuredNumber ||
    await ask(colors.cyan("\n🐉🌸 Digite o número do WhatsApp com DDI (somente números): "));
  const phoneNumber = collectNumbers(input);

  if (configuredNumber) {
    console.log(colors.cyan(`\n🐉🌸 Gerando pareamento para o número configurado: ${phoneNumber}`));
  }

  // O WhatsApp exige um número real com DDI. Ex.: 5511999999999
  if (phoneNumber.length < 8) {
    console.log(colors.red("❌ Número inválido. Execute novamente e informe o número com DDI."));
    closeReadline();
    process.exitCode = 1;
    return false;
  }

  try {
    // Pequena espera para garantir que o socket esteja pronto para o pedido de pareamento.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const code = await conn.requestPairingCode(phoneNumber);

    console.log("\n" + colors.cyan("╭────────────────────────────────────╮"));
    console.log(colors.cyan("│ 🐉🌸 CÓDIGO DE PAREAMENTO           │"));
    console.log(colors.cyan("│                                    │"));
    console.log(colors.white(`│        ${code.padEnd(18, " ")}        │`));
    console.log(colors.cyan("│                                    │"));
    console.log(colors.cyan("╰────────────────────────────────────╯"));
    console.log(colors.yellow("Abra o WhatsApp → Dispositivos conectados → Conectar com número de telefone."));
    console.log(colors.gray("Não feche o terminal enquanto o pareamento estiver sendo concluído.\n"));
    closeReadline();
    return true;
  } catch (error) {
    console.error(colors.red("❌ Não foi possível gerar o código de pareamento."));
    console.error(colors.gray(error?.message || error));
    closeReadline();
    process.exitCode = 1;
    return false;
  }
}

async function startConnect() {
  if (reconnecting) return;
  reconnecting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    const conn = makeWASocket({
      logger: P({ level: "fatal" }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, P({ level: "fatal" })),
      },
      browser: Browsers.ubuntu("Chrome"),
      markOnlineOnConnect: false,
      syncFullHistory: false,
      generateHighQualityLinkPreview: false,
      connectTimeoutMs: 60_000,
      keepAliveIntervalMs: 30_000,
      defaultQueryTimeoutMs: 60_000,
      msgRetryCounterCache,
      cachedGroupMetadata: async (jid) => groupCache.get(jid),
      getMessage,
      emitOwnEvents: true,
    });

    bindGroupCache(conn);

    // ==========================================
    // 🌸 KOBAYASHI WELCOME BRIDGE • v0.1.32
    // ==========================================
    const welcomeQueues = new Map();
    const welcomeRecentEvents = new Map();

    async function readWelcomeConfigRuntime(groupJid) {
      const fsM = (await import("node:fs")).default;
      const pathM = (await import("node:path")).default;

      const dbFile = pathM.join(
        process.cwd(),
        "files",
        "database",
        "boas-vindas.json"
      );

      let db = {};

      try {
        if (fsM.existsSync(dbFile)) {
          db = JSON.parse(
            fsM.readFileSync(dbFile, "utf8")
          );
        }
      } catch (error) {
        console.error(
          "[WELCOME] Erro ao ler boas-vindas.json:",
          error?.message || error
        );
      }

      return db?.[groupJid] || {};
    }

    async function sendWelcomeBatch(
      groupJid,
      members,
      acceptedBy = null
    ) {
      try {
        const cfg = await readWelcomeConfigRuntime(groupJid);

        console.log(
          `[WELCOME] Preparando envio | grupo=${groupJid} | enabled=${Boolean(cfg.enabled)} | membros=${members.length}`
        );

        if (!cfg.enabled) {
          console.log(
            `[WELCOME] Ignorado: sistema está desativado para ${groupJid}`
          );
          return false;
        }

        let metadata = null;

        try {
          metadata = await conn.groupMetadata(groupJid);
        } catch (error) {
          console.error(
            "[WELCOME] Não consegui ler metadata:",
            error?.message || error
          );
        }

        const groupName =
          metadata?.subject ||
          "Grupo";

        const total =
          Array.isArray(metadata?.participants)
            ? metadata.participants.length
            : "?";

        const cleanMembers =
          [...new Set(
            (members || [])
              .filter(Boolean)
          )];

        if (!cleanMembers.length) {
          console.log("[WELCOME] Nenhum membro válido para enviar.");
          return false;
        }

        const amount = cleanMembers.length;

        const memberLines =
          cleanMembers
            .map(
              (jid) =>
                `@${String(jid).split("@")[0]}`
            )
            .join("\n");

        const membersText =
          `${memberLines}\n` +
          `> [ ${amount} ${
            amount === 1
              ? "Membro Novo"
              : "Membros Novos"
          } 🪪 ]`;

        const title =
          cfg.title ||
          "🐉 ─ ⋆ 🌸 ⟨ KOBAYASHI BOT ⟩ 🌸 ⋆ ─ 🐉";

        const welcome =
          cfg.welcome ||
          "🌸 𝑶𝒉𝒂𝒚𝒐! Sejam bem-vindos(as) ao grupo!";

        const rules =
          cfg.rules ||
          "📖 Leia as regras completas na descrição do grupo.";

        const partners =
          cfg.partners ||
          "🌸 Nenhuma parceria configurada.";

        const footer =
          cfg.footer ||
          "🐉 KOBAYASHI BOT";

        const adminText =
          acceptedBy
            ? `@${String(acceptedBy).split("@")[0]}`
            : "não identificado";

        const welcomeRendered =
          String(welcome)
            .replace(/\{group\}/gi, groupName)
            .replace(/\{count\}/gi, String(total))
            .replace(/\{quantidade\}/gi, String(amount))
            .replace(/\{membros\}/gi, membersText)
            .replace(/\{adm\}/gi, adminText)
            .replace(/\{rejeitados\}/gi, "0");

        let text =
          `${title}\n` +
          `${welcomeRendered}\n\n` +
          `${rules}\n\n` +
          `🐾 ── 𖥸 ─── ⋆ ✧ ⋆ ─── 𖥸 ── 🐾\n` +
          `🧁 *Jardim de Parcerias* 🧁\n` +
          `${partners}\n\n` +
          `${membersText}\n\n`;

        if (cfg.showAcceptedBy !== false) {
          text +=
            `> Aceito/Add por ${adminText}\n`;
        }

        if (cfg.showRejected !== false) {
          text +=
            `> _E rejeitei 0 solicitações irregulares._\n`;
        }

        text += `\n${footer}`;

        const mentions = [
          ...cleanMembers,
          ...(acceptedBy ? [acceptedBy] : [])
        ];

        try {
          await conn.sendMessage(
            groupJid,
            {
              text,
              mentions
            }
          );
        } catch (mentionError) {
          // Alguns JIDs vindos de solicitação podem vir como LID.
          // Se a marcação falhar, o texto ainda precisa ser enviado.
          console.error(
            "[WELCOME] Falha com mentions; tentando texto simples:",
            mentionError?.message || mentionError
          );

          await conn.sendMessage(
            groupJid,
            { text }
          );
        }

        console.log(
          `[WELCOME] ✅ Mensagem enviada para ${amount} membro(s) em ${groupName}`
        );

        return true;

      } catch (error) {
        console.error(
          "[WELCOME] ❌ Falha final no envio:",
          error?.stack || error?.message || error
        );

        return false;
      }
    }

    async function queueWelcome(
      groupJid,
      participants,
      acceptedBy = null
    ) {
      const cfg =
        await readWelcomeConfigRuntime(groupJid);

      if (!cfg.enabled) {
        console.log(
          `[WELCOME] Fila ignorada: ${groupJid} está OFF`
        );
        return false;
      }

      const delaySeconds =
        Math.max(
          3,
          Math.min(
            120,
            Number(cfg.delaySeconds || 15)
          )
        );

      const current =
        welcomeQueues.get(groupJid) || {
          members: [],
          admins: [],
          timer: null
        };

      for (const jid of participants || []) {
        if (
          jid &&
          !current.members.includes(jid)
        ) {
          current.members.push(jid);
        }
      }

      if (
        acceptedBy &&
        !current.admins.includes(acceptedBy)
      ) {
        current.admins.push(acceptedBy);
      }

      if (current.timer) {
        clearTimeout(current.timer);
      }

      current.timer =
        setTimeout(
          async () => {
            const queued =
              welcomeQueues.get(groupJid);

            welcomeQueues.delete(groupJid);

            if (!queued?.members?.length) {
              return;
            }

            await sendWelcomeBatch(
              groupJid,
              queued.members,
              queued.admins?.[0] || null
            );
          },
          delaySeconds * 1000
        );

      welcomeQueues.set(
        groupJid,
        current
      );

      console.log(
        `[WELCOME] 🕒 ${current.members.length} membro(s) na fila; envio em ${delaySeconds}s`
      );

      return true;
    }

    async function handleWelcomeEvent(update) {
      try {
        const groupJid = update?.id;

        const participants =
          Array.isArray(update?.participants)
            ? update.participants
            : [];

        const action = update?.action;

        if (
          !groupJid ||
          !participants.length ||
          !["add", "remove"].includes(action)
        ) {
          return;
        }

        // Evita duplicar quando o mesmo evento chega por .on e .process.
        const eventKey =
          `${groupJid}|${action}|${participants
            .map(String)
            .sort()
            .join(",")}`;

        const now = Date.now();
        const previous =
          welcomeRecentEvents.get(eventKey) || 0;

        if (
          now - previous < 5000
        ) {
          console.log(
            `[WELCOME] Evento duplicado ignorado: ${eventKey}`
          );
          return;
        }

        welcomeRecentEvents.set(
          eventKey,
          now
        );

        setTimeout(
          () =>
            welcomeRecentEvents.delete(
              eventKey
            ),
          10000
        );

        console.log(
          `[WELCOME] Evento recebido: action=${action} group=${groupJid} members=${participants.length}`
        );

        if (action === "add") {
          await queueWelcome(
            groupJid,
            participants,
            update?.author ||
              update?.actor ||
              null
          );

          return;
        }

        // Saída continua individual.
        const cfg =
          await readWelcomeConfigRuntime(groupJid);

        if (!cfg.enabled) return;

        let metadata = null;

        try {
          metadata =
            await conn.groupMetadata(
              groupJid
            );
        } catch {}

        const groupName =
          metadata?.subject || "Grupo";

        const count =
          Array.isArray(
            metadata?.participants
          )
            ? metadata.participants.length
            : "?";

        const bye =
          cfg.bye ||
          "🌸 Até mais, {user}. Esperamos te ver novamente em *{group}*.";

        for (const jid of participants) {
          const text =
            String(bye)
              .replace(
                /\{user\}/gi,
                `@${String(jid).split("@")[0]}`
              )
              .replace(
                /\{group\}/gi,
                groupName
              )
              .replace(
                /\{count\}/gi,
                String(count)
              );

          try {
            await conn.sendMessage(
              groupJid,
              {
                text,
                mentions: [jid]
              }
            );
          } catch {
            await conn.sendMessage(
              groupJid,
              { text }
            );
          }
        }

      } catch (error) {
        console.error(
          "[WELCOME] Erro no handler:",
          error?.stack || error?.message || error
        );
      }
    }

    // Pontes usadas pelo /add e por diagnóstico.
    conn.kobayashiQueueWelcome =
      queueWelcome;

    conn.kobayashiSendWelcomeNow =
      sendWelcomeBatch;

    conn.kobayashiHandleWelcomeEvent =
      handleWelcomeEvent;

    // Caminho 1: listener normal do Baileys.
    conn.ev.on(
      "group-participants.update",
      handleWelcomeEvent
    );

    if (!conn.authState?.creds?.registered) {
      const ok = await requestPairingCode(conn);
      if (!ok) return;
    }

    conn.ev.process(async (events) => {
      if (events["connection.update"]) {
        const update = events["connection.update"];
        const { connection, lastDisconnect } = update;
        const status = new Boom(lastDisconnect?.error)?.output?.statusCode;

        switch (connection) {
          case "close": {
            botReady = false;
            const shouldReconnect = status !== DisconnectReason.loggedOut;

            if (status === 401) {
              console.log(colors.blue(mess.ErrorBaileys_401()));
            } else if (status === 408) {
              console.log(colors.blue(mess.ErrorBaileys_408()));
            } else if (status === 411) {
              console.log(colors.blue(mess.ErrorBaileys_411()));
            } else if (status === 428) {
              console.log(colors.blue(mess.ErrorBaileys_428()));
            } else if (status === 440) {
              console.log(colors.gray(mess.ErrorBaileys_440()));
            } else if (status === 500) {
              console.log(colors.gray(mess.ErrorBaileys_500()));
            } else if (status === 503) {
              console.log(colors.gray(mess.ErrorBaileys_503()));
            } else {
              console.log(`${colors.red("[CONNECTION CLOSED]")} Conexão fechada: ${lastDisconnect?.error?.message || lastDisconnect?.error || "erro desconhecido"}`);
            }

            if (shouldReconnect) {
              console.log(colors.yellow("🐉🌸 Tentando reconectar em 3 segundos..."));
              setTimeout(() => {
                reconnecting = false;
                startConnect().catch((err) => console.error(colors.red(err?.message || err)));
              }, 3000);
            } else {
              reconnecting = false;
              console.log(colors.red("Sessão encerrada (logout). Apague files/database/qr-code e pareie novamente."));
            }
            break;
          }

          case "connecting":
            console.log(colors.cyan(mess.connecting()));
            console.log(colors.cyan(`[ ${date} ${time} ]`));
            break;

          case "open":
            reconnecting = false;
            botReady = true;
            global.startTime = Math.floor(Date.now() / 1000);

            if (banner2) console.log(banner2.string);
            if (banner3) console.log(banner3.string);

            console.log(colors.cyan(mess.open()));
            console.log(colors.magenta("🐉🌸 Kobayashi Bot conectado com sucesso!"));
            await conn.sendPresenceUpdate("available");
            break;
        }
      }

      // Caminho 2: também trata o evento pelo processador em lote.
      if (events["group-participants.update"]) {
        await conn.kobayashiHandleWelcomeEvent(
          events["group-participants.update"]
        );
      }

      if (events["messages.upsert"]) {
        const upsert = events["messages.upsert"];

        for (const m of upsert.messages || []) {
          if (m.message) msgStore.set(m.key.id, m.message);
        }

        if (!botReady) return;
        await start(upsert, conn);
      }

      if (events["creds.update"]) {
        await saveCreds();
      }
    });
  } catch (error) {
    reconnecting = false;
    console.error(colors.red("❌ Erro ao iniciar a conexão:"), error?.message || error);
    setTimeout(() => startConnect().catch(() => {}), 3000);
  }
}

process.on("SIGINT", () => {
  closeReadline();
  console.log(colors.cyan("\n🐉🌸 Kobayashi Bot encerrado."));
  process.exit(0);
});

startConnect().catch((error) => {
  console.error(colors.red("❌ Falha fatal:"), error?.message || error);
  process.exitCode = 1;
});
