"use strict";
const crypto = require("crypto");
const db = require("./db");

function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(check, "hex"), Buffer.from(hash, "hex"));
}

function randomWord(len) {
  return crypto.randomBytes(len).toString("base64url").slice(0, len);
}

function readAuth() {
  const auth = db.read("auth", null);
  // Migrate the old single-account shape { username, salt, hash } to { users: [...] }.
  if (auth && !auth.users && auth.username && auth.salt && auth.hash) {
    const migrated = { users: [{ username: auth.username, salt: auth.salt, hash: auth.hash, createdAt: new Date().toISOString() }] };
    db.write("auth", migrated);
    return migrated;
  }
  return auth;
}

// Returns { plaintextPassword } only on first-ever creation (nothing existed yet).
function ensureAdmin() {
  let auth = readAuth();
  if (auth && Array.isArray(auth.users) && auth.users.length) {
    return { plaintextPassword: null };
  }
  const username = "admin";
  const password = randomWord(6) + "-" + randomWord(6);
  const { salt, hash } = hashPassword(password);
  auth = { users: [{ username, salt, hash, createdAt: new Date().toISOString() }] };
  db.write("auth", auth);
  return { plaintextPassword: password };
}

function checkLogin(username, password) {
  const auth = readAuth();
  if (!auth || !Array.isArray(auth.users)) return false;
  const user = auth.users.find((u) => u.username === username);
  if (!user) return false;
  return verifyPassword(password, user.salt, user.hash);
}

function listUsers() {
  const auth = readAuth();
  if (!auth || !Array.isArray(auth.users)) return [];
  return auth.users.map((u) => ({ username: u.username, createdAt: u.createdAt || null }));
}

function addUser(username, password) {
  const auth = readAuth() || { users: [] };
  if (auth.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { error: "A user with that username already exists." };
  }
  const { salt, hash } = hashPassword(password);
  auth.users.push({ username, salt, hash, createdAt: new Date().toISOString() });
  db.write("auth", auth);
  return { ok: true };
}

function removeUser(username) {
  const auth = readAuth();
  if (!auth || !Array.isArray(auth.users)) return { error: "Not found." };
  if (auth.users.length <= 1) return { error: "At least one account must remain." };
  const next = auth.users.filter((u) => u.username !== username);
  if (next.length === auth.users.length) return { error: "Not found." };
  db.write("auth", { users: next });
  return { ok: true };
}

function changePassword(username, currentPassword, newPassword) {
  const auth = readAuth();
  if (!auth || !Array.isArray(auth.users)) return { error: "Not found." };
  const idx = auth.users.findIndex((u) => u.username === username);
  if (idx === -1) return { error: "Not found." };
  if (!verifyPassword(currentPassword, auth.users[idx].salt, auth.users[idx].hash)) {
    return { error: "Current password is incorrect." };
  }
  const { salt, hash } = hashPassword(newPassword);
  auth.users[idx] = { ...auth.users[idx], salt, hash };
  db.write("auth", auth);
  return { ok: true };
}

module.exports = {
  ensureAdmin,
  checkLogin,
  listUsers,
  addUser,
  removeUser,
  changePassword,
  hashPassword,
  verifyPassword,
};
