"use strict";
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name) {
  return path.join(DATA_DIR, name + ".json");
}

function read(name, defaultValue) {
  ensureDataDir();
  const p = filePath(name);
  if (!fs.existsSync(p)) {
    write(name, defaultValue);
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return defaultValue;
  }
}

function write(name, value) {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(value, null, 2), "utf8");
}

module.exports = { read, write, DATA_DIR };
