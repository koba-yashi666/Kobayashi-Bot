import fs from "fs";
import path from "path";

const DB_FILE = path.join(
  process.cwd(),
  "files",
  "database",
  "admin-logs.json"
);

const DEFAULT_RETENTION_DAYS = 90;
const MAX_LOGS_PER_GROUP = 3000;

let lastCleanupDay = "";

/**
 * Garante que o banco de logs existe.
 */
function ensureDb() {
  fs.mkdirSync(path.dirname(DB_FILE), {
    recursive: true,
  });

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          groups: {},
          configs: {},
        },
        null,
        2
      ),
      "utf8"
    );
  }
}

/**
 * Compatibilidade com bancos de versões antigas.
 *
 * Formato atual:
 * {
 *   groups: {
 *     "grupo@g.us": []
 *   }
 * }
 */
function normalizeDb(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      groups: {},
      configs: {},
    };
  }

  if (
    raw.groups &&
    typeof raw.groups === "object" &&
    !Array.isArray(raw.groups)
  ) {
    return {
      ...raw,
      groups: raw.groups || {},
      configs: raw.configs || {},
    };
  }

  // Compatibilidade com:
  // {
  //   "grupo@g.us": [...]
  // }
  const groups = {};

  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      groups[key] = value;
    }
  }

  return {
    groups,
    configs: {},
  };
}

/**
 * Lê o banco.
 */
function readDb() {
  ensureDb();

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return normalizeDb(JSON.parse(raw));
  } catch (error) {
    console.error(
      "[AdminLogs] Erro ao ler banco:",
      error?.message || error
    );

    return {
      groups: {},
      configs: {},
    };
  }
}

/**
 * Salva utilizando arquivo temporário para diminuir
 * o risco de corromper o JSON.
 */
function writeDb(db) {
  ensureDb();

  const tmp = `${DB_FILE}.tmp`;

  try {
    fs.writeFileSync(
      tmp,
      JSON.stringify(db, null, 2),
      "utf8"
    );

    fs.renameSync(tmp, DB_FILE);
  } catch (error) {
    console.error(
      "[AdminLogs] Erro ao salvar banco:",
      error?.message || error
    );

    try {
      if (fs.existsSync(tmp)) {
        fs.unlinkSync(tmp);
      }
    } catch {}

    throw error;
  }
}

/**
 * Retorna data atual no formato ISO.
 */
function isoNow() {
  return new Date().toISOString();
}

/**
 * Converte datas para timestamp.
 */
function toMillis(value) {
  const n = Date.parse(value || "");
  return Number.isFinite(n) ? n : 0;
}

/**
 * Padroniza uma entrada de log.
 */
function normalizeEntry(entry = {}) {
  return {
    id:
      entry.id ||
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    type: String(
      entry.type || "admin"
    ).toLowerCase(),

    actor: entry.actor || null,

    target: entry.target || null,

    detail: String(
      entry.detail ||
        entry.message ||
        "Ação administrativa"
    ),

    message: entry.message
      ? String(entry.message)
      : undefined,

    at:
      entry.at ||
      entry.timestamp ||
      isoNow(),

    meta:
      entry.meta &&
      typeof entry.meta === "object"
        ? entry.meta
        : undefined,
  };
}

/**
 * ==========================================
 * CONFIGURAÇÃO — LOGS 2.0
 * ==========================================
 *
 * Necessário para:
 * - commands/admin/adminLogs.js
 * - commands/group/configGp.js
 */
export function getAdminLogConfig(groupJid = null) {
  if (!groupJid) {
    return {
      enabled: true,
      retentionDays: DEFAULT_RETENTION_DAYS,
      autoCleanup: true,
      maxLogsPerGroup: MAX_LOGS_PER_GROUP,
      databaseFile: DB_FILE,
    };
  }

  const db = readDb();
  const config = db.configs?.[groupJid] || {};

  return {
    enabled: config.enabled !== false,
    retentionDays: Number(config.retentionDays) || DEFAULT_RETENTION_DAYS,
    autoCleanup: config.autoCleanup !== false,
    maxLogsPerGroup: Number(config.maxLogsPerGroup) || MAX_LOGS_PER_GROUP,
    databaseFile: DB_FILE,
  };
}

export function setAdminLogEnabled(groupJid, enabled = true) {
  if (!groupJid) return false;

  const db = readDb();
  if (!db.configs || typeof db.configs !== "object") db.configs = {};
  if (!db.configs[groupJid] || typeof db.configs[groupJid] !== "object") {
    db.configs[groupJid] = {};
  }

  db.configs[groupJid].enabled = Boolean(enabled);
  writeDb(db);
  return Boolean(enabled);
}

// Compatibilidade com builds que usaram o nome no plural.
export function setAdminLogsEnabled(groupJid, enabled = true) {
  return setAdminLogEnabled(groupJid, enabled);
}

/**
 * Remove logs antigos.
 */
export function cleanupAdminLogs({
  retentionDays = DEFAULT_RETENTION_DAYS,
} = {}) {
  const db = readDb();

  const days = Math.max(
    1,
    Number(retentionDays) ||
      DEFAULT_RETENTION_DAYS
  );

  const cutoff =
    Date.now() -
    days * 24 * 60 * 60 * 1000;

  let removed = 0;

  for (const [
    groupJid,
    entries,
  ] of Object.entries(
    db.groups || {}
  )) {
    const list = Array.isArray(entries)
      ? entries
      : [];

    const kept = list.filter(
      (entry) => {
        const timestamp = toMillis(
          entry?.at ||
            entry?.timestamp
        );

        const valid =
          timestamp >= cutoff;

        if (!valid) {
          removed += 1;
        }

        return valid;
      }
    );

    if (kept.length > 0) {
      db.groups[groupJid] = kept;
    } else {
      delete db.groups[groupJid];
    }
  }

  if (removed > 0) {
    writeDb(db);
  }

  return removed;
}

/**
 * Executa limpeza automática no máximo
 * uma vez por dia.
 */
function maybeCleanup() {
  const today = new Date()
    .toISOString()
    .slice(0, 10);

  if (lastCleanupDay === today) {
    return;
  }

  lastCleanupDay = today;

  try {
    cleanupAdminLogs();
  } catch (error) {
    console.error(
      "[AdminLogs] Erro na limpeza automática:",
      error?.message || error
    );
  }
}

/**
 * Adiciona um novo registro.
 */
export function addAdminLog(
  groupJid,
  entry = {}
) {
  if (!groupJid) {
    return null;
  }

  const config = getAdminLogConfig(groupJid);
  if (!config.enabled) return null;

  maybeCleanup();

  const db = readDb();

  if (
    !Array.isArray(
      db.groups[groupJid]
    )
  ) {
    db.groups[groupJid] = [];
  }

  const log =
    normalizeEntry(entry);

  db.groups[groupJid].push(log);

  /**
   * Limite secundário para impedir
   * crescimento excessivo do banco.
   */
  if (
    db.groups[groupJid].length >
    MAX_LOGS_PER_GROUP
  ) {
    db.groups[groupJid] =
      db.groups[groupJid].slice(
        -MAX_LOGS_PER_GROUP
      );
  }

  writeDb(db);

  return log;
}

/**
 * Retorna logs com filtros.
 *
 * Exemplos:
 *
 * getAdminLogs(groupJid)
 *
 * getAdminLogs(groupJid, {
 *   type: "antilink"
 * })
 *
 * getAdminLogs(groupJid, {
 *   member: "5511999999999"
 * })
 */
export function getAdminLogs(
  groupJid,
  filters = {}
) {
  maybeCleanup();

  // Compatibilidade com getAdminLogs(groupJid, 10).
  if (typeof filters === "number") filters = { limit: filters };
  if (!filters || typeof filters !== "object") filters = {};

  const db = readDb();

  let logs = Array.isArray(
    db.groups?.[groupJid]
  )
    ? [...db.groups[groupJid]]
    : [];

  const type = String(
    filters.type || ""
  )
    .toLowerCase()
    .trim();

  const member = String(
    filters.member || ""
  ).trim();

  const since =
    Number(filters.since) || 0;

  const until =
    Number(filters.until) || 0;

  /**
   * Filtro de categoria.
   */
  if (type) {
    logs = logs.filter(
      (entry) => {
        const value = String(
          entry?.type || ""
        ).toLowerCase();

        if (type === "antilink") {
          return (
            value.includes("link") ||
            value.includes(
              "telegram"
            )
          );
        }

        if (type === "adv") {
          return (
            value.includes("adv") ||
            value.includes("warn")
          );
        }

        return (
          value === type ||
          value.includes(type)
        );
      }
    );
  }

  /**
   * Filtro por membro.
   */
  if (member) {
    const digits =
      member.replace(/\D/g, "");

    logs = logs.filter(
      (entry) => {
        const actor = String(
          entry?.actor || ""
        );

        const target = String(
          entry?.target || ""
        );

        return (
          actor === member ||
          target === member ||
          (digits &&
            (actor.includes(digits) ||
              target.includes(
                digits
              )))
        );
      }
    );
  }

  /**
   * Filtro de data inicial.
   */
  if (since) {
    logs = logs.filter(
      (entry) =>
        toMillis(
          entry?.at ||
            entry?.timestamp
        ) >= since
    );
  }

  /**
   * Filtro de data final.
   */
  if (until) {
    logs = logs.filter(
      (entry) =>
        toMillis(
          entry?.at ||
            entry?.timestamp
        ) <= until
    );
  }

  /**
   * Mais recentes primeiro.
   */
  logs.sort(
    (a, b) =>
      toMillis(
        b?.at || b?.timestamp
      ) -
      toMillis(
        a?.at || a?.timestamp
      )
  );

  /**
   * Proteção contra solicitações
   * gigantes.
   */
  const limit = Math.min(
    100,
    Math.max(
      1,
      Number(filters.limit) ||
        20
    )
  );

  return logs.slice(0, limit);
}

/**
 * Limpa registros do grupo.
 */
export function clearAdminLogs(
  groupJid,
  filters = {}
) {
  const db = readDb();

  const original =
    Array.isArray(
      db.groups?.[groupJid]
    )
      ? db.groups[groupJid]
      : [];

  if (!original.length) {
    return 0;
  }

  const type = String(
    filters.type || ""
  )
    .toLowerCase()
    .trim();

  const before =
    Number(filters.before) || 0;

  /**
   * Sem filtros = apagar todos
   * os logs desse grupo.
   */
  if (!type && !before) {
    const count =
      original.length;

    delete db.groups[groupJid];

    writeDb(db);

    return count;
  }

  let removed = 0;

  db.groups[groupJid] =
    original.filter(
      (entry) => {
        const logType =
          String(
            entry?.type || ""
          ).toLowerCase();

        const typeMatch =
          !type ||
          logType === type ||
          logType.includes(type) ||
          (type ===
            "antilink" &&
            (logType.includes(
              "link"
            ) ||
              logType.includes(
                "telegram"
              ))) ||
          (type === "adv" &&
            (logType.includes(
              "adv"
            ) ||
              logType.includes(
                "warn"
              )));

        const dateMatch =
          !before ||
          toMillis(
            entry?.at ||
              entry?.timestamp
          ) < before;

        /**
         * Se corresponder aos filtros,
         * removemos.
         */
        if (
          typeMatch &&
          dateMatch
        ) {
          removed += 1;
          return false;
        }

        return true;
      }
    );

  if (
    !db.groups[groupJid]
      .length
  ) {
    delete db.groups[groupJid];
  }

  if (removed > 0) {
    writeDb(db);
  }

  return removed;
}

/**
 * Estatísticas dos logs.
 */
export function getAdminLogStats(
  groupJid
) {
  maybeCleanup();

  const db = readDb();

  const logs = Array.isArray(
    db.groups?.[groupJid]
  )
    ? db.groups[groupJid]
    : [];

  const byType = {};

  for (const entry of logs) {
    const type = String(
      entry?.type || "admin"
    ).toLowerCase();

    byType[type] =
      (byType[type] || 0) + 1;
  }

  return {
    total: logs.length,
    byType,
  };
}