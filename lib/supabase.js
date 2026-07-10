"use strict";
// Shared Supabase client for both the kv_store table (lib/db.js) and the
// "uploads" storage bucket (server.js). Only active when both env vars are
// set; otherwise callers fall back to local disk (see lib/db.js), which is
// what keeps `npm start` working with zero setup for local development.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const enabled = !!(SUPABASE_URL && SUPABASE_KEY);

let client = null;
if (enabled) {
  const { createClient } = require("@supabase/supabase-js");
  client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
}

module.exports = { client, enabled };
