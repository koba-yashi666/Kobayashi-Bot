import fs from "node:fs";
import path from "node:path";

const RELEASE_NOTES_FILE = path.join(
  process.cwd(),
  "release-notes.json"
);

export function getReleaseNotes() {
  try {
    const data = JSON.parse(
      fs.readFileSync(RELEASE_NOTES_FILE, "utf8")
    );

    return data && typeof data === "object"
      ? data
      : null;
  } catch {
    return null;
  }
}

export function formatReleaseNotes(
  notes,
  { prefix = "/" } = {}
) {
  if (!notes) {
    return "🌸 Nenhuma nota de atualização disponível.";
  }

  let text =
    `╭══════ ❀ 🐉 ❀ ══════╮\n` +
    `       *NOVIDADES*\n` +
    `╰══════ ❀ 🌸 ❀ ══════╯\n\n` +
    `📦 *Versão:* ${notes.version || "?"}\n` +
    `✨ *${notes.title || "Atualização Kobayashi"}*\n`;

  if (notes.summary) {
    text += `\n${notes.summary}\n`;
  }

  for (const category of notes.categories || []) {
    text += `\n${category.name || "📁 Categoria"}\n`;

    for (const item of category.commands || []) {
      const cmd = String(item.command || "")
        .replace(/^[/!+.#$%&*-]+/, "");

      text +=
        `• *${prefix}${cmd}*` +
        `${item.description ? ` — ${item.description}` : ""}\n`;
    }
  }

  const changes = Array.isArray(notes.changes)
    ? notes.changes
    : [];

  if (changes.length) {
    text += `\n🔧 *Outras mudanças*\n`;
    for (const change of changes) {
      text += `• ${change}\n`;
    }
  }

  return text.trim();
}
