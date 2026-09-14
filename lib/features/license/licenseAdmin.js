/*
 * KOBAYASHI BOT
 * Criador: Luiz G. / Kobayashi
 * A venda, revenda ou comercialização desta base sem autorização do criador
 * é estritamente proibida.
 * © Luiz G. / Kobayashi.
 */
import fs from "node:fs";
import path from "node:path";
import { getLicenseConfig } from "./licenseManager.js";

const ROOT = process.cwd();
const ADMIN_FILE = path.join(ROOT, "files", "license", "admin.json");

function readJson(file, fallback = {}) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function getAdminToken() {
  const local = readJson(ADMIN_FILE, {});
  return String(local?.adminToken || process.env.KOBAYASHI_LICENSE_ADMIN_TOKEN || "").trim();
}

export function saveAdminToken(token) {
  fs.mkdirSync(path.dirname(ADMIN_FILE), { recursive: true });
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({ adminToken: String(token || "").trim() }, null, 2));
}

async function adminRequest(pathname, payload = {}) {
  const cfg = getLicenseConfig();
  if (!cfg.apiBase) throw new Error("Servidor de licença não configurado.");

  const adminToken = getAdminToken();
  if (!adminToken) {
    throw new Error("Token administrativo não configurado. Use KOBAYASHI_LICENSE_ADMIN_TOKEN.");
  }

  const res = await fetch(`${cfg.apiBase}${pathname}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${adminToken}`,
      "user-agent": "Kobayashi-Bot-LicenseAdmin/4.0.2"
    },
    body: JSON.stringify(payload)
  });

  let body = {};
  try { body = await res.json(); } catch {}

  if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);
  return body;
}

export async function createLicense({ customer, plan = "permanent", updates = true, maxInstallations = 1 } = {}) {
  return adminRequest("/admin/license/create", { customer, plan, updates, maxInstallations });
}

export async function listLicenses() {
  return adminRequest("/admin/license/list");
}

export async function getLicense(key) {
  return adminRequest("/admin/license/get", { key });
}

export async function blockLicense(key) {
  return adminRequest("/admin/license/block", { key });
}

export async function reactivateLicense(key) {
  return adminRequest("/admin/license/reactivate", { key });
}

export async function revokeInstallation(key, installationId) {
  return adminRequest("/admin/license/revoke-installation", { key, installationId });
}
