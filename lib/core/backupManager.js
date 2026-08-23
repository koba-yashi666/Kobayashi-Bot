import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "files", "database");
const BACKUP_DIR = path.join(process.cwd(), "backups");

function stamp() {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, "-");
}

export function createDatabaseBackup() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const name = `backup-${stamp()}`;
  const dest = path.join(BACKUP_DIR, name);

  fs.mkdirSync(dest, { recursive: true });

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.endsWith(".json"));

  let copied = 0;

  for (const file of files) {
    try {
      fs.copyFileSync(
        path.join(DATA_DIR, file),
        path.join(dest, file)
      );
      copied++;
    } catch {}
  }

  const manifest = {
    createdAt: new Date().toISOString(),
    files: copied,
    bot: "Kobayashi Bot",
  };

  fs.writeFileSync(
    path.join(dest, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  return {
    id: name,
    files: copied,
    createdAt: manifest.createdAt,
  };
}

export function listDatabaseBackups(limit = 10) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  return fs
    .readdirSync(BACKUP_DIR, { withFileTypes: true })
    .filter((item) => item.isDirectory() && item.name.startsWith("backup-"))
    .map((item) => item.name)
    .sort()
    .reverse()
    .slice(0, Math.max(1, Math.min(20, Number(limit) || 10)));
}
