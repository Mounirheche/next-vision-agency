"use strict";
const express = require("express");
require("express-async-errors"); // must load after express, before routes are defined
const cookieSession = require("cookie-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const db = require("./lib/db");
const authLib = require("./lib/auth");
const seed = require("./lib/seed");
const supabase = require("./lib/supabase");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(ROOT, "uploads");
const STORAGE_BUCKET = "uploads";

// cookie-session signs the whole session into the cookie itself (no server-side
// store), which is what makes login work across Vercel's serverless instances —
// there's no shared memory to lose. The signing key MUST stay stable across
// restarts/deploys or every existing session cookie stops validating, so set
// SESSION_SECRET in production; the random fallback is fine for local dev only
// (one continuous process).
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.SESSION_SECRET && process.env.VERCEL) {
  console.warn("WARNING: SESSION_SECRET is not set — logins will not persist across deploys/cold starts.");
}

let plaintextPassword = null;

// Ensure data exists with sane defaults on first run, and migrate older
// portfolio entries to the current shape. Every request waits on this via
// the readiness middleware below, so it's safe even on a cold serverless start.
const ready = (async () => {
  await db.read("settings", seed.DEFAULT_SETTINGS);
  await db.read("portfolio", seed.DEFAULT_PORTFOLIO);
  await db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
  await db.read("messages", seed.DEFAULT_MESSAGES);
  await db.read("content", seed.DEFAULT_CONTENT);

  const result = await authLib.ensureAdmin();
  plaintextPassword = result.plaintextPassword;

  const list = await db.read("portfolio", seed.DEFAULT_PORTFOLIO);
  let changed = false;
  const next = list.map((item) => {
    if (item.projectUrl === undefined || item.gallery === undefined || item.description === undefined) {
      changed = true;
      return {
        ...item,
        projectUrl: item.projectUrl || "",
        gallery: item.gallery || [],
        description: item.description || { en: "", ar: "" },
      };
    }
    return item;
  });
  if (changed) await db.write("portfolio", next);
})();

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));

app.use((req, res, next) => {
  ready.then(() => next()).catch((err) => {
    console.error("Startup failed:", err);
    res.status(500).json({ error: "Server is not ready yet, try again shortly." });
  });
});

app.use(
  cookieSession({
    name: "session",
    keys: [SESSION_SECRET],
    maxAge: 1000 * 60 * 60 * 12,
    httpOnly: true,
    sameSite: "lax",
  })
);

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

// Never let the static file server expose server internals (the dashboard has its
// own auth-gated static handler registered separately below, so it's not blocked here).
app.use((req, res, next) => {
  if (/^\/(data|lib|node_modules)(\/|$)/.test(req.path) || /^\/(server\.js|package\.json|package-lock\.json)$/.test(req.path)) {
    return res.status(404).end();
  }
  next();
});

// ---------- Auth ----------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });
  if (await authLib.checkLogin(username, password)) {
    req.session.user = username;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: "Invalid username or password" });
});

app.post("/api/logout", (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

app.get("/api/session", (req, res) => {
  res.json({ loggedIn: !!(req.session && req.session.user), username: (req.session && req.session.user) || null });
});

app.put("/api/account/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }
  const result = await authLib.changePassword(req.session.user, currentPassword, newPassword);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ ok: true });
});

app.get("/api/account/users", requireAuth, async (req, res) => {
  res.json(await authLib.listUsers());
});

app.post("/api/account/users", requireAuth, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  const result = await authLib.addUser(String(username).trim(), password);
  if (result.error) return res.status(400).json({ error: result.error });
  res.status(201).json({ ok: true });
});

app.delete("/api/account/users/:username", requireAuth, async (req, res) => {
  if (req.params.username === req.session.user) {
    return res.status(400).json({ error: "You can't remove the account you're currently logged in as." });
  }
  const result = await authLib.removeUser(req.params.username);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ ok: true });
});

// ---------- Settings ----------
app.get("/api/settings", async (req, res) => {
  res.json(await db.read("settings", seed.DEFAULT_SETTINGS));
});

app.put("/api/settings", requireAuth, async (req, res) => {
  const current = await db.read("settings", seed.DEFAULT_SETTINGS);
  const body = req.body || {};
  const next = {
    email: typeof body.email === "string" ? body.email : current.email,
    phone: typeof body.phone === "string" ? body.phone : current.phone,
    whatsapp: typeof body.whatsapp === "string" ? body.whatsapp : current.whatsapp,
    address: {
      en: body.address && typeof body.address.en === "string" ? body.address.en : current.address.en,
      ar: body.address && typeof body.address.ar === "string" ? body.address.ar : current.address.ar,
    },
    social: {
      facebook: (body.social && body.social.facebook) ?? current.social.facebook,
      instagram: (body.social && body.social.instagram) ?? current.social.instagram,
      linkedin: (body.social && body.social.linkedin) ?? current.social.linkedin,
      twitter: (body.social && body.social.twitter) ?? current.social.twitter,
    },
  };
  await db.write("settings", next);
  res.json(next);
});

// ---------- Uploads (Supabase Storage in production, local disk for dev) ----------
const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype)) return cb(null, true);
    if (/^video\/(mp4|webm|quicktime|x-msvideo)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image or video files are allowed"));
  },
});

const portfolioMediaFields = mediaUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 20 },
]);

function makeFilename(prefix, originalname) {
  const ext = path.extname(originalname).slice(0, 10).replace(/[^a-zA-Z0-9.]/g, "");
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
}

// Returns the URL to store alongside the record: a Supabase public URL in
// production, or a "uploads/..." relative path served by express.static locally.
async function saveUploadedFile(file, prefix) {
  const filename = makeFilename(prefix, file.originalname);
  if (supabase.enabled) {
    const { error } = await supabase.client.storage.from(STORAGE_BUCKET).upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.client.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  }
  if (process.env.VERCEL) {
    // No writable, servable disk here without Supabase — fail the upload
    // cleanly instead of crashing on a read-only filesystem.
    const err = new Error("File uploads need Supabase Storage configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) — add them in Vercel's project settings and redeploy.");
    err.statusCode = 503;
    throw err;
  }
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), file.buffer);
  return `uploads/${filename}`;
}

async function saveGalleryFiles(files, prefix) {
  const out = [];
  for (const f of files || []) {
    const url = await saveUploadedFile(f, prefix);
    out.push({ type: f.mimetype.startsWith("video/") ? "video" : "image", url });
  }
  return out;
}

async function deleteUploadedFile(url) {
  if (!url) return;
  if (supabase.enabled && /^https?:\/\//.test(url)) {
    const filename = url.split("/").pop();
    await supabase.client.storage.from(STORAGE_BUCKET).remove([filename]).catch(() => {});
    return;
  }
  if (!url.startsWith("uploads/")) return;
  fs.unlink(path.join(ROOT, url), () => {});
}

// ---------- Portfolio ----------
app.get("/api/portfolio", async (req, res) => {
  res.json(await db.read("portfolio", seed.DEFAULT_PORTFOLIO));
});

app.post("/api/portfolio", requireAuth, portfolioMediaFields, async (req, res) => {
  const list = await db.read("portfolio", seed.DEFAULT_PORTFOLIO);
  const body = req.body || {};
  const files = req.files || {};
  const item = {
    id: crypto.randomBytes(6).toString("hex"),
    title: { en: body.titleEn || "", ar: body.titleAr || "" },
    category: { en: body.categoryEn || "", ar: body.categoryAr || "" },
    tag: ["web", "mobile", "branding"].includes(body.tag) ? body.tag : "web",
    image: files.image && files.image[0] ? await saveUploadedFile(files.image[0], "portfolio") : null,
    projectUrl: body.projectUrl || "",
    gallery: await saveGalleryFiles(files.gallery, "portfolio"),
    description: { en: body.descriptionEn || "", ar: body.descriptionAr || "" },
  };
  list.push(item);
  await db.write("portfolio", list);
  res.status(201).json(item);
});

app.put("/api/portfolio/:id", requireAuth, portfolioMediaFields, async (req, res) => {
  const list = await db.read("portfolio", seed.DEFAULT_PORTFOLIO);
  const idx = list.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const body = req.body || {};
  const files = req.files || {};
  const current = list[idx];

  let gallery = current.gallery || [];
  if (body.removeGallery) {
    let toRemove = [];
    try {
      toRemove = JSON.parse(body.removeGallery);
    } catch (e) {}
    if (Array.isArray(toRemove) && toRemove.length) {
      gallery = gallery.filter((g) => !toRemove.includes(g.url));
      for (const url of toRemove) await deleteUploadedFile(url);
    }
  }
  gallery = gallery.concat(await saveGalleryFiles(files.gallery, "portfolio"));

  const next = {
    ...current,
    title: { en: body.titleEn ?? current.title.en, ar: body.titleAr ?? current.title.ar },
    category: { en: body.categoryEn ?? current.category.en, ar: body.categoryAr ?? current.category.ar },
    tag: ["web", "mobile", "branding"].includes(body.tag) ? body.tag : current.tag,
    image: files.image && files.image[0] ? await saveUploadedFile(files.image[0], "portfolio") : current.image,
    projectUrl: body.projectUrl !== undefined ? body.projectUrl : current.projectUrl,
    gallery,
    description: {
      en: body.descriptionEn !== undefined ? body.descriptionEn : (current.description && current.description.en) || "",
      ar: body.descriptionAr !== undefined ? body.descriptionAr : (current.description && current.description.ar) || "",
    },
  };
  list[idx] = next;
  await db.write("portfolio", list);
  res.json(next);
});

app.delete("/api/portfolio/:id", requireAuth, async (req, res) => {
  const list = await db.read("portfolio", seed.DEFAULT_PORTFOLIO);
  const item = list.find((p) => p.id === req.params.id);
  const next = list.filter((p) => p.id !== req.params.id);
  await db.write("portfolio", next);
  if (item) {
    await deleteUploadedFile(item.image);
    for (const g of item.gallery || []) await deleteUploadedFile(g.url);
  }
  res.json({ ok: true });
});

// ---------- Testimonials ----------
const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

function clampRating(value, fallback) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(5, Math.max(1, n));
}

app.get("/api/testimonials", async (req, res) => {
  res.json(await db.read("testimonials", seed.DEFAULT_TESTIMONIALS));
});

app.post("/api/testimonials", requireAuth, photoUpload.single("photo"), async (req, res) => {
  const list = await db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
  const body = req.body || {};
  const item = {
    id: crypto.randomBytes(6).toString("hex"),
    name: { en: body.nameEn || "", ar: body.nameAr || "" },
    role: { en: body.roleEn || "", ar: body.roleAr || "" },
    quote: { en: body.quoteEn || "", ar: body.quoteAr || "" },
    rating: clampRating(body.rating, 5),
    photo: req.file ? await saveUploadedFile(req.file, "testimonial") : null,
  };
  list.push(item);
  await db.write("testimonials", list);
  res.status(201).json(item);
});

app.put("/api/testimonials/:id", requireAuth, photoUpload.single("photo"), async (req, res) => {
  const list = await db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
  const idx = list.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const body = req.body || {};
  const current = list[idx];
  const next = {
    ...current,
    name: { en: body.nameEn ?? current.name.en, ar: body.nameAr ?? current.name.ar },
    role: { en: body.roleEn ?? current.role.en, ar: body.roleAr ?? current.role.ar },
    quote: { en: body.quoteEn ?? current.quote.en, ar: body.quoteAr ?? current.quote.ar },
    rating: clampRating(body.rating, current.rating),
    photo: req.file ? await saveUploadedFile(req.file, "testimonial") : current.photo,
  };
  if (req.file && current.photo) await deleteUploadedFile(current.photo);
  list[idx] = next;
  await db.write("testimonials", list);
  res.json(next);
});

app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
  const list = await db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
  const item = list.find((t) => t.id === req.params.id);
  const next = list.filter((t) => t.id !== req.params.id);
  await db.write("testimonials", next);
  if (item) await deleteUploadedFile(item.photo);
  res.json({ ok: true });
});

// ---------- Contact messages ----------
app.post("/api/contact", async (req, res) => {
  const body = req.body || {};
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  const list = await db.read("messages", seed.DEFAULT_MESSAGES);
  const entry = {
    id: crypto.randomBytes(6).toString("hex"),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  list.unshift(entry);
  await db.write("messages", list);
  res.status(201).json({ ok: true });
});

app.get("/api/messages", requireAuth, async (req, res) => {
  res.json(await db.read("messages", seed.DEFAULT_MESSAGES));
});

app.patch("/api/messages/:id", requireAuth, async (req, res) => {
  const list = await db.read("messages", seed.DEFAULT_MESSAGES);
  const idx = list.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx].read = !!(req.body && req.body.read);
  await db.write("messages", list);
  res.json(list[idx]);
});

app.delete("/api/messages/:id", requireAuth, async (req, res) => {
  const list = await db.read("messages", seed.DEFAULT_MESSAGES);
  const next = list.filter((m) => m.id !== req.params.id);
  await db.write("messages", next);
  res.json({ ok: true });
});

// ---------- Content overrides ("affirmations and verbs") ----------
app.get("/api/content", async (req, res) => {
  res.json(await db.read("content", seed.DEFAULT_CONTENT));
});

app.put("/api/content", requireAuth, async (req, res) => {
  const current = await db.read("content", seed.DEFAULT_CONTENT);
  const body = req.body || {};
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const next = { ...current };
  for (const key of Object.keys(body)) {
    const v = body[key];
    if (v && typeof v === "object") {
      next[key] = {
        en: typeof v.en === "string" ? v.en : (current[key] && current[key].en) || "",
        ar: typeof v.ar === "string" ? v.ar : (current[key] && current[key].ar) || "",
      };
    }
  }
  await db.write("content", next);
  res.json(next);
});

// ---------- Dashboard (auth-gated static app) ----------
app.use("/dashboard", (req, res, next) => {
  if (req.path === "/login.html" || /\.(css|js|png|jpg|svg|ico)$/.test(req.path)) return next();
  if (req.session && req.session.user) return next();
  return res.redirect("/dashboard/login.html");
});
app.use("/dashboard", express.static(path.join(ROOT, "dashboard")));

// ---------- The existing static site ----------
app.use(express.static(ROOT));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || /image or video/.test(err.message || "")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// Vercel imports this file as a serverless handler (module.exports = app) and
// never calls listen(); only bind a real port when run directly (local dev).
if (require.main === module) {
  ready.then(() => {
    app.listen(PORT, () => {
      console.log(`Next Vision Agency server running at http://localhost:${PORT}`);
      console.log(`Dashboard:  http://localhost:${PORT}/dashboard/login.html`);
      console.log(`Storage:    ${supabase.enabled ? "Supabase" : "local disk (data/ + uploads/)"}`);
      if (plaintextPassword) {
        console.log("");
        console.log("=========================================");
        console.log(" DASHBOARD LOGIN (shown only this once!)");
        console.log(" Username: admin");
        console.log(` Password: ${plaintextPassword}`);
        console.log(" Saved (hashed) — see the kv_store table or data/auth.json");
        console.log("=========================================");
        console.log("");
      }
    });
  });
}

module.exports = app;
