"use strict";
const fs = require("fs");
const path = require("path");
const supabase = require("./supabase");

// On Vercel the project directory is read-only — only /tmp is writable, and it
// isn't persistent (wiped between cold starts / not shared across instances).
// Without Supabase configured this is the only way to avoid crashing outright;
// it's a "the site loads, but dashboard edits may not stick" degraded mode,
// not real persistence. Local dev keeps using the project's own data/ folder.
const DATA_DIR = process.env.VERCEL && !supabase.enabled
  ? path.join("/tmp", "nv-data")
  : path.join(__dirname, "..", "data");
const TABLE = "kv_store";

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name) {
  return path.join(DATA_DIR, name + ".json");
}

async function read(name, defaultValue) {
  if (supabase.enabled) {
    const { data, error } = await supabase.client.from(TABLE).select("value").eq("key", name).maybeSingle();
    if (error) throw error;
    if (!data) {
      await write(name, defaultValue);
      return defaultValue;
    }
    return data.value;
  }

  ensureDataDir();
  const p = filePath(name);
  if (!fs.existsSync(p)) {
    await write(name, defaultValue);
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return defaultValue;
  }
}

async function write(name, value) {
  if (supabase.enabled) {
    const { error } = await supabase.client.from(TABLE).upsert({ key: name, value }, { onConflict: "key" });
    if (error) throw error;
    return;
  }

  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(value, null, 2), "utf8");
}

module.exports = { read, write, DATA_DIR, useSupabase: supabase.enabled };
