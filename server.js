"use strict";
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const db = require("./lib/db");
const authLib = require("./lib/auth");
const seed = require("./lib/seed");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

// Ensure data files exist with sane defaults on first run.
db.read("settings", seed.DEFAULT_SETTINGS);
db.read("portfolio", seed.DEFAULT_PORTFOLIO);
db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
db.read("messages", seed.DEFAULT_MESSAGES);
db.read("content", seed.DEFAULT_CONTENT);
const { plaintextPassword } = authLib.ensureAdmin();

// Backfill projectUrl/gallery/description on portfolio items saved before those fields existed.
(function migratePortfolio() {
  const list = db.read("portfolio", seed.DEFAULT_PORTFOLIO);
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
  if (changed) db.write("portfolio", next);
})();

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));

app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 12 },
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
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });
  if (authLib.checkLogin(username, password)) {
    req.session.user = username;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: "Invalid username or password" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/session", (req, res) => {
  res.json({ loggedIn: !!(req.session && req.session.user), username: (req.session && req.session.user) || null });
});

app.put("/api/account/password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }
  const result = authLib.changePassword(req.session.user, currentPassword, newPassword);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ ok: true });
});

app.get("/api/account/users", requireAuth, (req, res) => {
  res.json(authLib.listUsers());
});

app.post("/api/account/users", requireAuth, (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  const result = authLib.addUser(String(username).trim(), password);
  if (result.error) return res.status(400).json({ error: result.error });
  res.status(201).json({ ok: true });
});

app.delete("/api/account/users/:username", requireAuth, (req, res) => {
  if (req.params.username === req.session.user) {
    return res.status(400).json({ error: "You can't remove the account you're currently logged in as." });
  }
  const result = authLib.removeUser(req.params.username);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ ok: true });
});

// ---------- Settings ----------
app.get("/api/settings", (req, res) => {
  res.json(db.read("settings", seed.DEFAULT_SETTINGS));
});

app.put("/api/settings", requireAuth, (req, res) => {
  const current = db.read("settings", seed.DEFAULT_SETTINGS);
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
  db.write("settings", next);
  res.json(next);
});

// ---------- Portfolio ----------
const UPLOAD_DIR = path.join(ROOT, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const mediaUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).slice(0, 10).replace(/[^a-zA-Z0-9.]/g, "");
      cb(null, `portfolio-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
    },
  }),
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

function galleryEntriesFromFiles(files) {
  return (files || []).map((f) => ({
    type: f.mimetype.startsWith("video/") ? "video" : "image",
    url: `uploads/${f.filename}`,
  }));
}

function deleteUploadedFile(relativeUrl) {
  if (!relativeUrl || !relativeUrl.startsWith("uploads/")) return;
  fs.unlink(path.join(ROOT, relativeUrl), () => {});
}

app.get("/api/portfolio", (req, res) => {
  res.json(db.read("portfolio", seed.DEFAULT_PORTFOLIO));
});

app.post("/api/portfolio", requireAuth, portfolioMediaFields, (req, res) => {
  const list = db.read("portfolio", seed.DEFAULT_PORTFOLIO);
  const body = req.body || {};
  const files = req.files || {};
  const item = {
    id: crypto.randomBytes(6).toString("hex"),
    title: { en: body.titleEn || "", ar: body.titleAr || "" },
    category: { en: body.categoryEn || "", ar: body.categoryAr || "" },
    tag: ["web", "mobile", "branding"].includes(body.tag) ? body.tag : "web",
    image: files.image && files.image[0] ? `uploads/${files.image[0].filename}` : null,
    projectUrl: body.projectUrl || "",
    gallery: galleryEntriesFromFiles(files.gallery),
    description: { en: body.descriptionEn || "", ar: body.descriptionAr || "" },
  };
  list.push(item);
  db.write("portfolio", list);
  res.status(201).json(item);
});

app.put("/api/portfolio/:id", requireAuth, portfolioMediaFields, (req, res) => {
  const list = db.read("portfolio", seed.DEFAULT_PORTFOLIO);
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
      toRemove.forEach(deleteUploadedFile);
    }
  }
  gallery = gallery.concat(galleryEntriesFromFiles(files.gallery));

  const next = {
    ...current,
    title: { en: body.titleEn ?? current.title.en, ar: body.titleAr ?? current.title.ar },
    category: { en: body.categoryEn ?? current.category.en, ar: body.categoryAr ?? current.category.ar },
    tag: ["web", "mobile", "branding"].includes(body.tag) ? body.tag : current.tag,
    image: files.image && files.image[0] ? `uploads/${files.image[0].filename}` : current.image,
    projectUrl: body.projectUrl !== undefined ? body.projectUrl : current.projectUrl,
    gallery,
    description: {
      en: body.descriptionEn !== undefined ? body.descriptionEn : (current.description && current.description.en) || "",
      ar: body.descriptionAr !== undefined ? body.descriptionAr : (current.description && current.description.ar) || "",
    },
  };
  list[idx] = next;
  db.write("portfolio", list);
  res.json(next);
});

app.delete("/api/portfolio/:id", requireAuth, (req, res) => {
  const list = db.read("portfolio", seed.DEFAULT_PORTFOLIO);
  const item = list.find((p) => p.id === req.params.id);
  const next = list.filter((p) => p.id !== req.params.id);
  db.write("portfolio", next);
  if (item) {
    deleteUploadedFile(item.image);
    (item.gallery || []).forEach((g) => deleteUploadedFile(g.url));
  }
  res.json({ ok: true });
});

// ---------- Testimonials ----------
const photoUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).slice(0, 10).replace(/[^a-zA-Z0-9.]/g, "");
      cb(null, `testimonial-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
    },
  }),
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

app.get("/api/testimonials", (req, res) => {
  res.json(db.read("testimonials", seed.DEFAULT_TESTIMONIALS));
});

app.post("/api/testimonials", requireAuth, photoUpload.single("photo"), (req, res) => {
  const list = db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
  const body = req.body || {};
  const item = {
    id: crypto.randomBytes(6).toString("hex"),
    name: { en: body.nameEn || "", ar: body.nameAr || "" },
    role: { en: body.roleEn || "", ar: body.roleAr || "" },
    quote: { en: body.quoteEn || "", ar: body.quoteAr || "" },
    rating: clampRating(body.rating, 5),
    photo: req.file ? `uploads/${req.file.filename}` : null,
  };
  list.push(item);
  db.write("testimonials", list);
  res.status(201).json(item);
});

app.put("/api/testimonials/:id", requireAuth, photoUpload.single("photo"), (req, res) => {
  const list = db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
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
    photo: req.file ? `uploads/${req.file.filename}` : current.photo,
  };
  if (req.file && current.photo) deleteUploadedFile(current.photo);
  list[idx] = next;
  db.write("testimonials", list);
  res.json(next);
});

app.delete("/api/testimonials/:id", requireAuth, (req, res) => {
  const list = db.read("testimonials", seed.DEFAULT_TESTIMONIALS);
  const item = list.find((t) => t.id === req.params.id);
  const next = list.filter((t) => t.id !== req.params.id);
  db.write("testimonials", next);
  if (item) deleteUploadedFile(item.photo);
  res.json({ ok: true });
});

// ---------- Contact messages ----------
app.post("/api/contact", (req, res) => {
  const body = req.body || {};
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  const list = db.read("messages", seed.DEFAULT_MESSAGES);
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
  db.write("messages", list);
  res.status(201).json({ ok: true });
});

app.get("/api/messages", requireAuth, (req, res) => {
  res.json(db.read("messages", seed.DEFAULT_MESSAGES));
});

app.patch("/api/messages/:id", requireAuth, (req, res) => {
  const list = db.read("messages", seed.DEFAULT_MESSAGES);
  const idx = list.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx].read = !!(req.body && req.body.read);
  db.write("messages", list);
  res.json(list[idx]);
});

app.delete("/api/messages/:id", requireAuth, (req, res) => {
  const list = db.read("messages", seed.DEFAULT_MESSAGES);
  const next = list.filter((m) => m.id !== req.params.id);
  db.write("messages", next);
  res.json({ ok: true });
});

// ---------- Content overrides ("affirmations and verbs") ----------
app.get("/api/content", (req, res) => {
  res.json(db.read("content", seed.DEFAULT_CONTENT));
});

app.put("/api/content", requireAuth, (req, res) => {
  const current = db.read("content", seed.DEFAULT_CONTENT);
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
  db.write("content", next);
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
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Next Vision Agency server running at http://localhost:${PORT}`);
  console.log(`Dashboard:  http://localhost:${PORT}/dashboard/login.html`);
  if (plaintextPassword) {
    console.log("");
    console.log("=========================================");
    console.log(" DASHBOARD LOGIN (shown only this once!)");
    console.log(" Username: admin");
    console.log(` Password: ${plaintextPassword}`);
    console.log(" Saved (hashed) in data/auth.json");
    console.log("=========================================");
    console.log("");
  }
});
