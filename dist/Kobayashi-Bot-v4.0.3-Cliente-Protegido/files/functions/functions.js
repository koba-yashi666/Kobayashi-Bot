/* Kobayashi Protected Distribution v4.0.3 */
/*ESSA BASE FOI DESENVOLVIDA PELO  COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY 
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

import fs from "fs";
import axios from "\x61\x78\x69\x6f\x73";
import path from "\x70\x61\x74\x68";
import cfonts from "\x63\x66\x6f\x6e\x74\x73";
import Crypto from "\x63\x72\x79\x70\x74\x6f";
import chalk from "\x63\x68\x61\x6c\x6b";
import { exec, spawn } from "\x63\x68\x69\x6c\x64\x5f\x70\x72\x6f\x63\x65\x73\x73";
import mimetype from "\x6d\x69\x6d\x65\x2d\x74\x79\x70\x65\x73";
import * as cheerio from "\x63\x68\x65\x65\x72\x69\x6f";
import FormData from "\x66\x6f\x72\x6d\x2d\x64\x61\x74\x61";
import * as FileType from "\x66\x69\x6c\x65\x2d\x74\x79\x70\x65";
import qs from "qs";
import toMs from "ms";
import request from "\x72\x65\x71\x75\x65\x73\x74";
import ffmpeg from "\x66\x6c\x75\x65\x6e\x74\x2d\x66\x66\x6d\x70\x65\x67";
import moment from "\x6d\x6f\x6d\x65\x6e\x74\x2d\x74\x69\x6d\x65\x7a\x6f\x6e\x65";

const log = console.debug;

async function fetch(...args) {
const { default: nodeFetch } = await import("\x6e\x6f\x64\x65\x2d\x66\x65\x74\x63\x68");
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

if (clean.endsWith("\x40\x73\x2e\x77\x68\x61\x74\x73\x61\x70\x70\x2e\x6e\x65\x74")) return clean;

const cleanAlt = stripDevice(alt);
if (cleanAlt && cleanAlt.endsWith("\x40\x73\x2e\x77\x68\x61\x74\x73\x61\x70\x70\x2e\x6e\x65\x74")) return cleanAlt;

if (clean.endsWith("\x40\x6c\x69\x64")) {
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
const admins = participants.filter((p) => p?.admin === "\x61\x64\x6d\x69\x6e" || p?.admin === "\x73\x75\x70\x65\x72\x61\x64\x6d\x69\x6e");
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

const banner3 = cfonts.render("\ud83d\ud83c\x20\x42\x65\x74\x61\x20\x62\x79\x20\x54\x68\x65\x6f", {
font: "\x63\x6f\x6e\x73\x6f\x6c\x65",
align: "\x63\x65\x6e\x74\x65\x72",
gradient: ["\x6d\x61\x67\x65\x6e\x74\x61", "\x63\x79\x61\x6e"]
});

const banner2 = cfonts.render("\x4b\x4f\x42\x41\x59\x41\x53\x48\x49\x20\x42\x4f\x54", {
font: "\x62\x6c\x6f\x63\x6b",
align: "\x63\x65\x6e\x74\x65\x72",
gradient: ["\x6d\x61\x67\x65\x6e\x74\x61", "\x72\x65\x64"]
});

export { fetch, fs, axios, path, cfonts, Crypto, chalk,exec, log, mimetype, cheerio, spawn, FormData, FileType, qs, toMs, request, ffmpeg, moment, normalizeJid, getPNForJid, getGroupAdmins, getMembros, banner2, banner3 };
