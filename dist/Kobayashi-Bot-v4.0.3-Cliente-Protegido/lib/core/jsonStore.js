/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";

export function readJsonFile(filePath, fallback = {}) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "\x75\x74\x66\x38");
      return structuredClone(fallback);
    }

    const parsed = JSON.parse(fs.readFileSync(filePath, "\x75\x74\x66\x38"));
    return parsed && typeof parsed === "\x6f\x62\x6a\x65\x63\x74" ? parsed : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

export function writeJsonFile(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  const payload = JSON.stringify(data, null, 2);

  try {
    fs.writeFileSync(tempPath, payload, "\x75\x74\x66\x38");
    fs.renameSync(tempPath, filePath);
  } finally {
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch {}
  }

  return data;
}
