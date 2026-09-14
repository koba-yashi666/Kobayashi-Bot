/* Kobayashi Protected Distribution v4.0.3 */
/*
 * KOBAYASHI BOT • BETA
 * Conexão WhatsApp via código de pareamento.
 */

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
} from "\x40\x77\x68\x69\x73\x6b\x65\x79\x73\x6f\x63\x6b\x65\x74\x73\x2f\x62\x61\x69\x6c\x65\x79\x73";

import NodeCache from "\x6e\x6f\x64\x65\x2d\x63\x61\x63\x68\x65";
import start from "\x2e\x2f\x69\x6e\x64\x65\x78\x2e\x6a\x73";
import { bindGroupCache, groupCache } from "\x2e\x2f\x6c\x69\x62\x2f\x67\x72\x6f\x75\x70\x43\x61\x63\x68\x65\x2e\x6a\x73";
import { ensureDragonCoreRuntime } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x63\x6f\x72\x65\x2f\x64\x72\x61\x67\x6f\x6e\x43\x6f\x72\x65\x2e\x6a\x73";
import { ensureRentalRuntime } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x72\x65\x6e\x74\x61\x6c\x2f\x72\x65\x6e\x74\x61\x6c\x53\x79\x73\x74\x65\x6d\x2e\x6a\x73";
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
} from "\x2e\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2f\x69\x6d\x70\x6f\x72\x74\x73\x2f\x63\x6f\x6e\x73\x74\x73\x2e\x6a\x73";
import { getAntiFakeConfig, checkAntiFakeParticipant } from "\x2e\x2f\x6c\x69\x62\x2f\x66\x65\x61\x74\x75\x72\x65\x73\x2f\x6d\x6f\x64\x65\x72\x61\x74\x69\x6f\x6e\x2f\x61\x6e\x74\x69\x46\x61\x6b\x65\x2e\x6a\x73";

const AUTH_DIR = "\x2e\x2f\x66\x69\x6c\x65\x73\x2f\x64\x61\x74\x61\x62\x61\x73\x65\x2f\x71\x72\x2d\x63\x6f\x64\x65";
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
      (await import("\x6e\x6f\x64\x65\x3a\x66\x73")).default.readFileSync(new URL("\x2e\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2f\x73\x65\x74\x74\x69\x6e\x67\x73\x2e\x6a\x73\x6f\x6e", import.meta.url), "\x75\x74\x66\x38")
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
    console.log(colors.red("\u274c\x20\x4e\xfa\x6d\x65\x72\x6f\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f\x2e\x20\x45\x78\x65\x63\x75\x74\x65\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x20\x65\x20\x69\x6e\x66\x6f\x72\x6d\x65\x20\x6f\x20\x6e\xfa\x6d\x65\x72\x6f\x20\x63\x6f\x6d\x20\x44\x44\x49\x2e"));
    closeReadline();
    process.exitCode = 1;
    return false;
  }

  try {
    // Pequena espera para garantir que o socket esteja pronto para o pedido de pareamento.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const code = await conn.requestPairingCode(phoneNumber);

    console.log("\n" + colors.cyan("\u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e"));
    console.log(colors.cyan("\u2502\x20\ud83d\ud83c\x20\x43\xd3\x44\x49\x47\x4f\x20\x44\x45\x20\x50\x41\x52\x45\x41\x4d\x45\x4e\x54\x4f\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u2502"));
    console.log(colors.cyan("\u2502\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u2502"));
    console.log(colors.white(`│        ${code.padEnd(18, " ")}        │`));
    console.log(colors.cyan("\u2502\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u2502"));
    console.log(colors.cyan("\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f"));
    console.log(colors.yellow("\x41\x62\x72\x61\x20\x6f\x20\x57\x68\x61\x74\x73\x41\x70\x70\x20\u2192\x20\x44\x69\x73\x70\x6f\x73\x69\x74\x69\x76\x6f\x73\x20\x63\x6f\x6e\x65\x63\x74\x61\x64\x6f\x73\x20\u2192\x20\x43\x6f\x6e\x65\x63\x74\x61\x72\x20\x63\x6f\x6d\x20\x6e\xfa\x6d\x65\x72\x6f\x20\x64\x65\x20\x74\x65\x6c\x65\x66\x6f\x6e\x65\x2e"));
    console.log(colors.gray("Não feche o terminal enquanto o pareamento estiver sendo concluído.\n"));
    closeReadline();
    return true;
  } catch (error) {
    console.error(colors.red("\u274c\x20\x4e\xe3\x6f\x20\x66\x6f\x69\x20\x70\x6f\x73\x73\xed\x76\x65\x6c\x20\x67\x65\x72\x61\x72\x20\x6f\x20\x63\xf3\x64\x69\x67\x6f\x20\x64\x65\x20\x70\x61\x72\x65\x61\x6d\x65\x6e\x74\x6f\x2e"));
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
      logger: P({ level: "\x66\x61\x74\x61\x6c" }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, P({ level: "\x66\x61\x74\x61\x6c" })),
      },
      browser: Browsers.ubuntu("\x43\x68\x72\x6f\x6d\x65"),
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
          "\x70\x74\x2d\x42\x52",
          {
            timeZone: "\x41\x6d\x65\x72\x69\x63\x61\x2f\x53\x61\x6f\x5f\x50\x61\x75\x6c\x6f",
            hour: "\x32\x2d\x64\x69\x67\x69\x74",
            minute: "\x32\x2d\x64\x69\x67\x69\x74",
            hour12: false,
            year: "\x6e\x75\x6d\x65\x72\x69\x63",
            month: "\x32\x2d\x64\x69\x67\x69\x74",
            day: "\x32\x2d\x64\x69\x67\x69\x74"
          }
        );

      const parts =
        Object.fromEntries(
          formatter
            .formatToParts(new Date())
            .filter((p) => p.type !== "\x6c\x69\x74\x65\x72\x61\x6c")
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
          (await import("\x6e\x6f\x64\x65\x3a\x66\x73")).default;

        const pathM =
          (await import("\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68")).default;

        const dbFile =
          pathM.join(
            process.cwd(),
            "\x66\x69\x6c\x65\x73",
            "\x64\x61\x74\x61\x62\x61\x73\x65",
            "\x68\x6f\x72\x61\x72\x69\x6f\x73\x2d\x67\x72\x75\x70\x6f\x73\x2e\x6a\x73\x6f\x6e"
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
                "\x75\x74\x66\x38"
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
              type: "\x6f\x70\x65\x6e",
              time: cfg.open,
              setting: "\x6e\x6f\x74\x5f\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74",
              message:
                "🟢🌸 *Grupo aberto automaticamente!*\n\nTodos os membros podem enviar mensagens novamente."
            },
            {
              type: "\x63\x6c\x6f\x73\x65",
              time: cfg.close,
              setting: "\x61\x6e\x6e\x6f\x75\x6e\x63\x65\x6d\x65\x6e\x74",
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
          "\x5b\x47\x52\x4f\x55\x50\x20\x53\x43\x48\x45\x44\x55\x4c\x45\x52\x5d",
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

      if (typeof value === "\x73\x74\x72\x69\x6e\x67") {
        return value;
      }

      if (typeof value === "\x6f\x62\x6a\x65\x63\x74") {
        const candidate =
          value.jid ||
          value.id ||
          value.participant ||
          value.phoneNumber ||
          value.lid ||
          null;

        return typeof candidate === "\x73\x74\x72\x69\x6e\x67"
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
      const fsM = (await import("\x6e\x6f\x64\x65\x3a\x66\x73")).default;
      const pathM = (await import("\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68")).default;
      const dbFile = pathM.join(
        process.cwd(),
        "\x66\x69\x6c\x65\x73",
        "\x64\x61\x74\x61\x62\x61\x73\x65",
        "\x62\x6f\x61\x73\x2d\x76\x69\x6e\x64\x61\x73\x2e\x6a\x73\x6f\x6e"
      );

      try {
        if (!fsM.existsSync(dbFile)) return {};
        const db = JSON.parse(fsM.readFileSync(dbFile, "\x75\x74\x66\x38"));
        return db?.[groupJid] || {};
      } catch (e) {
        console.error("\x5b\x57\x45\x4c\x43\x4f\x4d\x45\x20\x4e\x41\x5a\x55\x4e\x41\x5d\x20\x45\x72\x72\x6f\x20\x61\x6f\x20\x6c\x65\x72\x20\x62\x61\x6e\x63\x6f\x3a", e?.message || e);
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
        `> [ ${amount} ${amount === 1 ? "\x4d\x65\x6d\x62\x72\x6f\x20\x4e\x6f\x76\x6f" : "\x4d\x65\x6d\x62\x72\x6f\x73\x20\x4e\x6f\x76\x6f\x73"} 🪪 ]`;

      const replacements = {
        "\x7b\x75\x73\x65\x72\x7d": participants.length === 1 ? `@${String(participants[0]).split("@")[0]}` : memberTags,
        "\x7b\x67\x72\x6f\x75\x70\x7d": groupMetadata?.subject || "\x47\x72\x75\x70\x6f",
        "\x7b\x63\x6f\x75\x6e\x74\x7d": Array.isArray(groupMetadata?.participants) ? groupMetadata.participants.length : "?",
        "\x7b\x6d\x65\x6d\x62\x72\x6f\x73\x7d": membersText,
        "\x7b\x71\x75\x61\x6e\x74\x69\x64\x61\x64\x65\x7d": amount,
        "\x7b\x61\x64\x6d\x7d": acceptedBy ? `@${String(acceptedBy).split("@")[0]}` : "\x6e\xe3\x6f\x20\x69\x64\x65\x6e\x74\x69\x66\x69\x63\x61\x64\x6f",
        "\x7b\x72\x65\x6a\x65\x69\x74\x61\x64\x6f\x73\x7d": 0,
      };

      const title = settings.title || "\ud83d\x20\u2500\x20\u22c6\x20\ud83c\x20\u27e8\x20\x4b\x4f\x42\x41\x59\x41\x53\x48\x49\x20\x42\x4f\x54\x20\u27e9\x20\ud83c\x20\u22c6\x20\u2500\x20\ud83d";
      const welcome = settings.welcome || "\ud83c\x20\ud835\ud835\ud835\ud835\ud835\x21\x20\x53\x65\x6a\x61\x6d\x20\x62\x65\x6d\x2d\x76\x69\x6e\x64\x6f\x73\x28\x61\x73\x29\x20\x61\x6f\x20\x67\x72\x75\x70\x6f\x21";
      const rules = settings.rules || "\ud83d\x20\x4c\x65\x69\x61\x20\x61\x73\x20\x72\x65\x67\x72\x61\x73\x20\x63\x6f\x6d\x70\x6c\x65\x74\x61\x73\x20\x6e\x61\x20\x64\x65\x73\x63\x72\x69\xe7\xe3\x6f\x20\x64\x6f\x20\x67\x72\x75\x70\x6f\x2e";
      const partners = settings.partners || "\ud83c\x20\x4e\x65\x6e\x68\x75\x6d\x61\x20\x70\x61\x72\x63\x65\x72\x69\x61\x20\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x64\x61\x2e";
      const footer = settings.footer || "\ud83d\x20\x4b\x4f\x42\x41\x59\x41\x53\x48\x49\x20\x42\x4f\x54";

      let text =
        `${title}\n` +
        `${formatWelcomeText(welcome, replacements)}\n\n` +
        `${formatWelcomeText(rules, replacements)}\n\n` +
        `🐾 ── 𖥸 ─── ⋆ ✧ ⋆ ─── 𖥸 ── 🐾\n` +
        `🧁 *Jardim de Parcerias* 🧁\n` +
        `${formatWelcomeText(partners, replacements)}\n\n` +
        `${membersText}\n\n`;

      if (settings.showAcceptedBy !== false) {
        text += `> Aceito/Add por ${replacements["\x7b\x61\x64\x6d\x7d"]}\n`;
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
        if (inf.action === "\x61\x64\x64") {
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
                  "\x72\x65\x6d\x6f\x76\x65"
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
              "\x5b\x41\x4e\x54\x49\x46\x41\x4b\x45\x5d",
              error?.message || error
            );
          }
        }

        if (!settings.enabled) return;

        switch (inf.action) {
          case "\x61\x64\x64": {
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
              console.error("\x5b\x57\x45\x4c\x43\x4f\x4d\x45\x20\x4e\x41\x5a\x55\x4e\x41\x5d\x20\x46\x61\x6c\x68\x61\x20\x63\x6f\x6d\x20\x6d\x65\x6e\x74\x69\x6f\x6e\x73\x2c\x20\x74\x65\x6e\x74\x61\x6e\x64\x6f\x20\x74\x65\x78\x74\x6f\x3a", e?.message || e);
              await conn.sendMessage(from, { text: message.text });
            }

            console.log(`[WELCOME NAZUNA] ✅ Welcome enviado para ${participants.length} membro(s)`);
            break;
          }

          case "\x72\x65\x6d\x6f\x76\x65": {
            const count = Array.isArray(groupMetadata?.participants)
              ? groupMetadata.participants.length
              : "?";
            const bye = settings.bye || "\ud83c\x20\x41\x74\xe9\x20\x6d\x61\x69\x73\x2c\x20\x7b\x75\x73\x65\x72\x7d\x2e\x20\x45\x73\x70\x65\x72\x61\x6d\x6f\x73\x20\x74\x65\x20\x76\x65\x72\x20\x6e\x6f\x76\x61\x6d\x65\x6e\x74\x65\x20\x65\x6d\x20\x2a\x7b\x67\x72\x6f\x75\x70\x7d\x2a\x2e";

            const replacements = {
              "\x7b\x75\x73\x65\x72\x7d": participants.map((p) => `@${String(p).split("@")[0]}`).join(", "),
              "\x7b\x67\x72\x6f\x75\x70\x7d": groupMetadata.subject || "\x47\x72\x75\x70\x6f",
              "\x7b\x63\x6f\x75\x6e\x74\x7d": count,
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
        console.error("\x5b\x57\x45\x4c\x43\x4f\x4d\x45\x20\x4e\x41\x5a\x55\x4e\x41\x5d\x20\x45\x72\x72\x6f\x20\x6e\x6f\x20\x68\x61\x6e\x64\x6c\x65\x72\x3a", e?.stack || e?.message || e);
      }
    }

    // Exposto para o /add, igualando o fluxo do comando ao evento real.
    conn.kobayashiHandleGroupParticipantsUpdate = handleGroupParticipantsUpdate;

    // Mesmo padrão estrutural do Nazuna: listener direto no evento do Baileys.
    conn.ev.on("\x67\x72\x6f\x75\x70\x2d\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74\x73\x2e\x75\x70\x64\x61\x74\x65", async (inf) => {
      console.log("\x5b\x57\x45\x4c\x43\x4f\x4d\x45\x20\x4e\x41\x5a\x55\x4e\x41\x5d\x20\x45\x76\x65\x6e\x74\x6f\x20\x67\x72\x6f\x75\x70\x2d\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74\x73\x2e\x75\x70\x64\x61\x74\x65\x20\x72\x65\x63\x65\x62\x69\x64\x6f");
      await handleGroupParticipantsUpdate(inf);
    });

    if (!conn.authState?.creds?.registered) {
      const ok = await requestPairingCode(conn);
      if (!ok) return;
    }

    conn.ev.process(async (events) => {
      if (events["\x63\x6f\x6e\x6e\x65\x63\x74\x69\x6f\x6e\x2e\x75\x70\x64\x61\x74\x65"]) {
        const update = events["\x63\x6f\x6e\x6e\x65\x63\x74\x69\x6f\x6e\x2e\x75\x70\x64\x61\x74\x65"];
        const { connection, lastDisconnect } = update;
        const status = new Boom(lastDisconnect?.error)?.output?.statusCode;

        switch (connection) {
          case "\x63\x6c\x6f\x73\x65": {
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
              console.log(`${colors.red("\x5b\x43\x4f\x4e\x4e\x45\x43\x54\x49\x4f\x4e\x20\x43\x4c\x4f\x53\x45\x44\x5d")} Conexão fechada: ${lastDisconnect?.error?.message || lastDisconnect?.error || "\x65\x72\x72\x6f\x20\x64\x65\x73\x63\x6f\x6e\x68\x65\x63\x69\x64\x6f"}`);
            }

            if (shouldReconnect) {
              console.log(colors.yellow("\ud83d\ud83c\x20\x54\x65\x6e\x74\x61\x6e\x64\x6f\x20\x72\x65\x63\x6f\x6e\x65\x63\x74\x61\x72\x20\x65\x6d\x20\x33\x20\x73\x65\x67\x75\x6e\x64\x6f\x73\x2e\x2e\x2e"));
              setTimeout(() => {
                reconnecting = false;
                startConnect().catch((err) => console.error(colors.red(err?.message || err)));
              }, 3000);
            } else {
              reconnecting = false;
              console.log(colors.red("\x53\x65\x73\x73\xe3\x6f\x20\x65\x6e\x63\x65\x72\x72\x61\x64\x61\x2e\x20\x4c\x69\x6d\x70\x65\x20\x61\x20\x61\x75\x74\x65\x6e\x74\x69\x63\x61\xe7\xe3\x6f\x20\x64\x6f\x20\x62\x6f\x74\x20\x65\x20\x66\x61\xe7\x61\x20\x75\x6d\x20\x6e\x6f\x76\x6f\x20\x70\x61\x72\x65\x61\x6d\x65\x6e\x74\x6f\x2e"));
            }
            break;
          }

          case "\x63\x6f\x6e\x6e\x65\x63\x74\x69\x6e\x67":
            console.log(colors.cyan(mess.connecting()));
            console.log(colors.cyan(`[ ${date} ${time} ]`));
            break;

          case "\x6f\x70\x65\x6e":
            reconnecting = false;
            botReady = true;
            global.startTime = Math.floor(Date.now() / 1000);

            if (banner2) console.log(banner2.string);
            if (banner3) console.log(banner3.string);

            console.log(colors.cyan(mess.open()));
            console.log(colors.magenta("\ud83d\ud83c\x20\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x42\x6f\x74\x20\x63\x6f\x6e\x65\x63\x74\x61\x64\x6f\x20\x63\x6f\x6d\x20\x73\x75\x63\x65\x73\x73\x6f\x21"));
            ensureDragonCoreRuntime(conn);
            ensureRentalRuntime(conn);
            await conn.sendPresenceUpdate("\x61\x76\x61\x69\x6c\x61\x62\x6c\x65");
            break;
        }
      }

      if (events["\x6d\x65\x73\x73\x61\x67\x65\x73\x2e\x75\x70\x73\x65\x72\x74"]) {
        const upsert = events["\x6d\x65\x73\x73\x61\x67\x65\x73\x2e\x75\x70\x73\x65\x72\x74"];

        for (const m of upsert.messages || []) {
          if (m.message) msgStore.set(m.key.id, m.message);
        }

        if (!botReady) return;
        await start(upsert, conn);
      }


      if (events["\x63\x72\x65\x64\x73\x2e\x75\x70\x64\x61\x74\x65"]) {
        await saveCreds();
      }
    });
  } catch (error) {
    reconnecting = false;
    console.error(colors.red("\u274c\x20\x45\x72\x72\x6f\x20\x61\x6f\x20\x69\x6e\x69\x63\x69\x61\x72\x20\x61\x20\x63\x6f\x6e\x65\x78\xe3\x6f\x3a"), error?.message || error);
    setTimeout(() => startConnect().catch(() => {}), 3000);
  }
}

process.on("\x53\x49\x47\x49\x4e\x54", () => {
  closeReadline();
  console.log(colors.cyan("\n🐉🌸 Kobayashi Bot encerrado."));
  process.exit(0);
});

startConnect().catch((error) => {
  console.error(colors.red("\u274c\x20\x46\x61\x6c\x68\x61\x20\x66\x61\x74\x61\x6c\x3a"), error?.message || error);
  process.exitCode = 1;
});