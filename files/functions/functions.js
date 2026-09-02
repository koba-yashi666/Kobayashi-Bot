/*ESSA BASE FOI DESENVOLVIDA PELO  COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY 
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

import fs from "fs";
import axios from "axios";
import path from "path";
import cfonts from "cfonts";
import Crypto from "crypto";
import chalk from "chalk";
import { exec, spawn } from "child_process";
import mimetype from "mime-types";
import * as cheerio from "cheerio";
import FormData from "form-data";
import * as FileType from "file-type";
import qs from "qs";
import toMs from "ms";
import request from "request";
import ffmpeg from "fluent-ffmpeg";
import moment from "moment-timezone";

const log = console.debug;

async function fetch(...args) {
const { default: nodeFetch } = await import("node-fetch");
return nodeFetch(...args);
}

function stripDevice(jid) {
if (!jid) return null;
return jid.replace(/:.*(?=@)/, "");
}

function normalizeJid(jid) {
return stripDevice(jid);
}

async function getPNForJid(conn, jid, alt) {
const clean = stripDevice(jid);
if (!clean) return null;

if (clean.endsWith("@s.whatsapp.net")) return clean;

const cleanAlt = stripDevice(alt);
if (cleanAlt && cleanAlt.endsWith("@s.whatsapp.net")) return cleanAlt;

if (clean.endsWith("@lid")) {
try {
const pn = await conn?.signalRepository?.lidMapping?.getPNForLID(clean);
if (pn) return stripDevice(pn);
} catch {}
}

return null;
}

function participantRawId(p) {
return p.id || p.jid || p.participant || null;
}

async function getGroupAdmins(participants = [], conn = null) {
const admins = participants.filter((p) => p?.admin === "admin" || p?.admin === "superadmin");
const resolved = await Promise.all(
admins.map((p) => getPNForJid(conn, participantRawId(p), p.phoneNumber))
);
return resolved.filter(Boolean);
}

async function getMembros(participants = [], conn = null) {
const membros = participants.filter((p) => !p?.admin);
const resolved = await Promise.all(
membros.map((p) => getPNForJid(conn, participantRawId(p), p.phoneNumber))
);
return resolved.filter(Boolean);
}

const banner3 = cfonts.render("🐉🌸 Beta by Theo", {
font: "console",
align: "center",
gradient: ["magenta", "cyan"]
});

const banner2 = cfonts.render("KOBAYASHI BOT", {
font: "block",
align: "center",
gradient: ["magenta", "red"]
});

export { fetch, fs, axios, path, cfonts, Crypto, chalk,exec, log, mimetype, cheerio, spawn, FormData, FileType, qs, toMs, request, ffmpeg, moment, normalizeJid, getPNForJid, getGroupAdmins, getMembros, banner2, banner3 };
