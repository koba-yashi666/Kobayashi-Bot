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
import { ensureDragonCoreRuntime } from "./lib/features/dragonCore.js";
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
import { getAntiFakeConfig, checkAntiFakeParticipant } from "./lib/features/antiFake.js";

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

    // Permite aos sistemas AntiDelete/AntiEdit consultar mensagens recentes.
    conn.kobayashiGetCachedMessage = (id) => msgStore.get(id) || null;


    // ==========================================
    // 🕰️ KOBAYASHI GROUP SCHEDULER • v0.1.35
    // ==========================================
    const scheduleLastRun = new Map();

    function getSaoPauloClock() {
      const formatter =
        new Intl.DateTimeFormat(
          "pt-BR",
          {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          }
        );

      const parts =
        Object.fromEntries(
          formatter
            .formatToParts(new Date())
            .filter((p) => p.type !== "literal")
            .map((p) => [p.type,p.value])
        );

      return {
        time: `${parts.hour}:${parts.minute}`,
        date: `${parts.year}-${parts.month}-${parts.day}`
      };
    }

    async function runGroupSchedules() {
      try {
        const fsM =
          (await import("node:fs")).default;

        const pathM =
          (await import("node:path")).default;

        const dbFile =
          pathM.join(
            process.cwd(),
            "files",
            "database",
            "horarios-grupos.json"
          );

        if (!fsM.existsSync(dbFile)) {
          return;
        }

        let db = {};

        try {
          db =
            JSON.parse(
              fsM.readFileSync(
                dbFile,
                "utf8"
              )
            );
        } catch {
          return;
        }

        const clock =
          getSaoPauloClock();

        for (
          const [groupJid,cfg]
          of Object.entries(db)
        ) {
          if (!cfg) continue;

          const tasks = [
            {
              type: "open",
              time: cfg.open,
              setting: "not_announcement",
              message:
                "🟢🌸 *Grupo aberto automaticamente!*\n\nTodos os membros podem enviar mensagens novamente."
            },
            {
              type: "close",
              time: cfg.close,
              setting: "announcement",
              message:
                "🔒🐉 *Grupo fechado automaticamente!*\n\nSomente administradores podem enviar mensagens."
            }
          ];

          for (const task of tasks) {
            if (
              !task.time ||
              task.time !== clock.time
            ) {
              continue;
            }

            const runKey =
              `${groupJid}|${task.type}|${clock.date}|${clock.time}`;

            if (
              scheduleLastRun.has(runKey)
            ) {
              continue;
            }

            scheduleLastRun.set(
              runKey,
              Date.now()
            );

            try {
              await conn.groupSettingUpdate(
                groupJid,
                task.setting
              );

              await conn.sendMessage(
                groupJid,
                { text: task.message }
              );

              console.log(
                `[GROUP SCHEDULER] ${task.type} executado em ${groupJid} às ${clock.time}`
              );
            } catch (error) {
              console.error(
                `[GROUP SCHEDULER] Falha ${task.type}:`,
                error?.message || error
              );
            }
          }
        }

        // Limpeza simples das chaves antigas.
        if (scheduleLastRun.size > 500) {
          scheduleLastRun.clear();
        }

      } catch (error) {
        console.error(
          "[GROUP SCHEDULER]",
          error?.message || error
        );
      }
    }

    const groupScheduleInterval =
      setInterval(
        runGroupSchedules,
        30_000
      );

    // Executa uma verificação ao iniciar.
    setTimeout(
      runGroupSchedules,
      5_000
    );


    // ==========================================
    // 🌸 KOBAYASHI WELCOME • BASE NAZUNA v0.1.33
    // ==========================================
    const welcomeRecentEvents = new Map();


    function normalizeWelcomeJid(value) {
      if (!value) return null;

      if (typeof value === "string") {
        return value;
      }

      if (typeof value === "object") {
        const candidate =
          value.jid ||
          value.id ||
          value.participant ||
          value.phoneNumber ||
          value.lid ||
          null;

        return typeof candidate === "string"
          ? candidate
          : null;
      }

      return null;
    }

    function normalizeWelcomeParticipants(values = []) {
      return [...new Set(
        (Array.isArray(values) ? values : [])
          .map(normalizeWelcomeJid)
          .filter(Boolean)
      )];
    }


    async function loadWelcomeSettings(groupJid) {
      const fsM = (await import("node:fs")).default;
      const pathM = (await import("node:path")).default;
      const dbFile = pathM.join(
        process.cwd(),
        "files",
        "database",
        "boas-vindas.json"
      );

      try {
        if (!fsM.existsSync(dbFile)) return {};
        const db = JSON.parse(fsM.readFileSync(dbFile, "utf8"));
        return db?.[groupJid] || {};
      } catch (e) {
        console.error("[WELCOME NAZUNA] Erro ao ler banco:", e?.message || e);
        return {};
      }
    }

    function formatWelcomeText(template, replacements) {
      let text = String(template || "");
      for (const [key, value] of Object.entries(replacements)) {
        text = text.split(key).join(String(value));
      }
      return text;
    }

    async function createWelcomeMessage(groupMetadata, participants, settings, acceptedBy = null) {
      participants = normalizeWelcomeParticipants(participants);
      acceptedBy = normalizeWelcomeJid(acceptedBy);

      const mentions = [...participants, ...(acceptedBy ? [acceptedBy] : [])];
      const amount = participants.length;
      const memberTags = participants
        .map((p) => `@${String(p).split("@")[0]}`)
        .join("\n");

      const membersText =
        `${memberTags}\n` +
        `> [ ${amount} ${amount === 1 ? "Membro Novo" : "Membros Novos"} 🪪 ]`;

      const replacements = {
        "{user}": participants.length === 1 ? `@${String(participants[0]).split("@")[0]}` : memberTags,
        "{group}": groupMetadata?.subject || "Grupo",
        "{count}": Array.isArray(groupMetadata?.participants) ? groupMetadata.participants.length : "?",
        "{membros}": membersText,
        "{quantidade}": amount,
        "{adm}": acceptedBy ? `@${String(acceptedBy).split("@")[0]}` : "não identificado",
        "{rejeitados}": 0,
      };

      const title = settings.title || "🐉 ─ ⋆ 🌸 ⟨ KOBAYASHI BOT ⟩ 🌸 ⋆ ─ 🐉";
      const welcome = settings.welcome || "🌸 𝑶𝒉𝒂𝒚𝒐! Sejam bem-vindos(as) ao grupo!";
      const rules = settings.rules || "📖 Leia as regras completas na descrição do grupo.";
      const partners = settings.partners || "🌸 Nenhuma parceria configurada.";
      const footer = settings.footer || "🐉 KOBAYASHI BOT";

      let text =
        `${title}\n` +
        `${formatWelcomeText(welcome, replacements)}\n\n` +
        `${formatWelcomeText(rules, replacements)}\n\n` +
        `🐾 ── 𖥸 ─── ⋆ ✧ ⋆ ─── 𖥸 ── 🐾\n` +
        `🧁 *Jardim de Parcerias* 🧁\n` +
        `${formatWelcomeText(partners, replacements)}\n\n` +
        `${membersText}\n\n`;

      if (settings.showAcceptedBy !== false) {
        text += `> Aceito/Add por ${replacements["{adm}"]}\n`;
      }

      if (settings.showRejected !== false) {
        text += `> _E rejeitei 0 solicitações irregulares._\n`;
      }

      text += `\n${footer}`;

      return { text, mentions };
    }

    async function handleGroupParticipantsUpdate(inf) {
      try {
        const from = inf?.id || inf?.jid || null;
        if (!from) return;

        let participants = normalizeWelcomeParticipants(
          Array.isArray(inf?.participants)
            ? inf.participants
            : []
        );

        if (!participants.length) return;

        const botId = String(conn.user?.id || "").split(":")[0];
        participants = participants.filter(
          (p) => !String(p).split("@")[0].startsWith(botId)
        );
        if (!participants.length) return;

        const eventKey = `${from}|${inf.action}|${participants.map(String).sort().join(",")}`;
        const now = Date.now();
        const last = welcomeRecentEvents.get(eventKey) || 0;
        if (now - last < 10000) {
          console.log(`[WELCOME NAZUNA] Evento duplicado ignorado: ${eventKey}`);
          return;
        }
        welcomeRecentEvents.set(eventKey, now);
        setTimeout(() => welcomeRecentEvents.delete(eventKey), 15000);

        const groupMetadata = await conn.groupMetadata(from).catch(() => null);
        if (!groupMetadata) {
          console.log(`[WELCOME NAZUNA] Metadata indisponível: ${from}`);
          return;
        }

        const settings = await loadWelcomeSettings(from);

        console.log(
          `[WELCOME NAZUNA] action=${inf.action} group=${from} enabled=${Boolean(settings.enabled)} participants=${participants.length}`
        );

        // ==========================================
        // 🛡️ ANTIFAKE • KOBAYASHI v0.1.48
        // Executa mesmo que o Welcome esteja OFF.
        // ==========================================
        if (inf.action === "add") {
          try {
            const antiFake = getAntiFakeConfig(from);

            if (antiFake.enabled) {
              const adminSet = new Set(
                (groupMetadata?.participants || [])
                  .filter((p) => p?.admin)
                  .map((p) => p?.id)
              );

              const targets = [];

              for (const jid of participants) {
                const check = await checkAntiFakeParticipant(
                  conn,
                  from,
                  jid
                );

                if (
                  check.known &&
                  !check.allowed &&
                  check.jid &&
                  !adminSet.has(check.jid)
                ) {
                  targets.push(check.jid);
                }
              }

              if (targets.length) {
                await conn.groupParticipantsUpdate(
                  from,
                  targets,
                  "remove"
                );

                await conn.sendMessage(from, {
                  text:
                    `🛡️🌎 *ANTI-FAKE*\n\n` +
                    `${targets.length} número(s) estrangeiro(s) foram removidos automaticamente.\n` +
                    `🇧🇷 DDI permitido: +55.`
                }).catch(() => {});

                participants = participants.filter(
                  (jid) => !targets.includes(jid)
                );

                if (!participants.length) {
                  return;
                }
              }
            }
          } catch (error) {
            console.error(
              "[ANTIFAKE]",
              error?.message || error
            );
          }
        }

        if (!settings.enabled) return;

        switch (inf.action) {
          case "add": {
            const acceptedBy = normalizeWelcomeJid(
              inf?.author || inf?.actor || null
            );
            const message = await createWelcomeMessage(
              groupMetadata,
              participants,
              settings,
              acceptedBy
            );

            try {
              await conn.sendMessage(from, message);
            } catch (e) {
              // Fallback do Nazuna adaptado: se mentions/JID der problema, envia texto puro.
              console.error("[WELCOME NAZUNA] Falha com mentions, tentando texto:", e?.message || e);
              await conn.sendMessage(from, { text: message.text });
            }

            console.log(`[WELCOME NAZUNA] ✅ Welcome enviado para ${participants.length} membro(s)`);
            break;
          }

          case "remove": {
            const count = Array.isArray(groupMetadata?.participants)
              ? groupMetadata.participants.length
              : "?";
            const bye = settings.bye || "🌸 Até mais, {user}. Esperamos te ver novamente em *{group}*.";

            const replacements = {
              "{user}": participants.map((p) => `@${String(p).split("@")[0]}`).join(", "),
              "{group}": groupMetadata.subject || "Grupo",
              "{count}": count,
            };

            const text = formatWelcomeText(bye, replacements);
            try {
              await conn.sendMessage(from, { text, mentions: participants });
            } catch {
              await conn.sendMessage(from, { text });
            }
            break;
          }
        }
      } catch (e) {
        console.error("[WELCOME NAZUNA] Erro no handler:", e?.stack || e?.message || e);
      }
    }

    // Exposto para o /add, igualando o fluxo do comando ao evento real.
    conn.kobayashiHandleGroupParticipantsUpdate = handleGroupParticipantsUpdate;

    // Mesmo padrão estrutural do Nazuna: listener direto no evento do Baileys.
    conn.ev.on("group-participants.update", async (inf) => {
      console.log("[WELCOME NAZUNA] Evento group-participants.update recebido");
      await handleGroupParticipantsUpdate(inf);
    });

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
              console.log(colors.red("Sessão encerrada. Limpe a autenticação do bot e faça um novo pareamento."));
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
            ensureDragonCoreRuntime(conn);
            await conn.sendPresenceUpdate("available");
            break;
        }
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