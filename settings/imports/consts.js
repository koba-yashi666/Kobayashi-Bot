/*ESSA BASE FOI DESENVOLVIDA PELO  COM FOCO EM PERFORMANCE E OTIMIZAÇÃO.
© COPYRIGHT BY 
BASE PÚBLICA - O USO E A MODIFICAÇÃO SÃO PERMITIDOS,
PORÉM É EXPRESSAMENTE PROIBIDA A VENDA OU COMERCIALIZAÇÃO
DESTA BASE, NO TODO OU EM PARTE.
NÃO VENDA, REVENDA OU COMERCIALIZE ESTA BASE
SEM A AUTORIZAÇÃO DO AUTOR.*/

import { Boom } from "@hapi/boom";
import axios from "axios";
import fs from "fs-extra";
import * as cheerio from "cheerio";
import crypto from "crypto";
import util from "util";
import { randomBytes } from "crypto";
import { emoji } from "scr-emoji";
import P from "pino";
import NodeCache from "node-cache";
import * as linkfy from "linkifyjs";
import request from "request";
import ms from "ms";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import qrterminal from "qrcode-terminal";
import { exec, spawn, execSync } from "child_process";
import moment from "moment-timezone";
import colors from "colors";
import readline from "readline";
import path from "path";
import { createRequire } from "module";

import { linguagem, mess } from "./index.js";
import { normalizeJid, getPNForJid, getGroupAdmins, getMembros, banner2, banner3 } from "../../files/functions/functions.js";

const require = createRequire(import.meta.url);

async function fetch(...args) {
const { default: nodeFetch } = await import("node-fetch");
return nodeFetch(...args);
}

const packname = require("../../package.json");
const logos = JSON.parse(fs.readFileSync('./settings/logos.json'));

let baileysVersion = "desconhecida";
try {
const pkgPath = require.resolve("@whiskeysockets/baileys/package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
baileysVersion = pkg.version;
} catch {
baileysVersion = "desconhecida";
}

const time = moment.tz("America/Sao_Paulo").format("HH:mm:ss");
const hora = moment.tz("America/Sao_Paulo").format("HH:mm:ss");
const date = moment.tz("America/Sao_Paulo").format("DD/MM/YYYY");

function DLT_FL(file) {
try {
fs.unlinkSync(file);
} catch (error) {
}
}

export { fetch, Boom, axios, fs, cheerio, crypto, util, randomBytes, emoji, P, NodeCache, linkfy, request, ms, os, ffmpeg, qrterminal, exec, spawn, execSync,moment, colors, readline, path, mess, time, hora, date, DLT_FL, normalizeJid, getPNForJid, getGroupAdmins, getMembros, banner2, banner3, packname, logos, baileysVersion, linguagem };
