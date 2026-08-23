import path from "node:path";
import { readJsonFile, writeJsonFile } from "../core/jsonStore.js";

const DB_FILE = path.join(process.cwd(), "files", "database", "adv.json");

export function readAdvDb() {
  return readJsonFile(DB_FILE, {});
}

export function writeAdvDb(data) {
  return writeJsonFile(DB_FILE, data);
}
