/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

const DATA_DIR = path.join(process.cwd(), "\x66\x69\x6c\x65\x73", "\x64\x61\x74\x61\x62\x61\x73\x65");
const BACKUP_DIR = path.join(process.cwd(), "\x62\x61\x63\x6b\x75\x70\x73");

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
    .filter((file) => file.endsWith("\x2e\x6a\x73\x6f\x6e"));

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
    bot: "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x42\x6f\x74",
  };

  fs.writeFileSync(
    path.join(dest, "\x6d\x61\x6e\x69\x66\x65\x73\x74\x2e\x6a\x73\x6f\x6e"),
    JSON.stringify(manifest, null, 2),
    "\x75\x74\x66\x38"
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
    .filter((item) => item.isDirectory() && item.name.startsWith("\x62\x61\x63\x6b\x75\x70\x2d"))
    .map((item) => item.name)
    .sort()
    .reverse()
    .slice(0, Math.max(1, Math.min(20, Number(limit) || 10)));
}
