"use strict";

// ---------- Dashboard chrome translations (EN/AR) ----------
var DASH_I18N = {
  dash: { en: "Dashboard", ar: "لوحة التحكم" },
  logout: { en: "Log Out", ar: "تسجيل الخروج" },
  viewSite: { en: "View Website", ar: "زيارة الموقع" },
  "nav.messages": { en: "Messages", ar: "الرسائل" },
  "nav.portfolio": { en: "Portfolio", ar: "الأعمال" },
  "nav.testimonials": { en: "Testimonials", ar: "آراء العملاء" },
  "nav.content": { en: "Site Content", ar: "محتوى الموقع" },
  "nav.settings": { en: "Settings", ar: "الإعدادات" },
  "messages.title": { en: "Contact Messages", ar: "رسائل التواصل" },
  "messages.sub": { en: "Submissions from the website's contact form.", ar: "الرسائل المرسلة من نموذج التواصل في الموقع." },
  "portfolio.title": { en: "Portfolio", ar: "الأعمال" },
  "portfolio.sub": { en: "Projects shown on the public Portfolio page.", ar: "المشاريع المعروضة في صفحة الأعمال." },
  "portfolio.addTitle": { en: "Add a Project", ar: "إضافة مشروع" },
  "portfolio.editTitle": { en: "Edit Project", ar: "تعديل المشروع" },
  "portfolio.field.titleEn": { en: "Title (English)", ar: "العنوان (إنجليزي)" },
  "portfolio.field.titleAr": { en: "Title (Arabic)", ar: "العنوان (عربي)" },
  "portfolio.field.categoryEn": { en: "Category (English)", ar: "الفئة (إنجليزي)" },
  "portfolio.field.categoryAr": { en: "Category (Arabic)", ar: "الفئة (عربي)" },
  "portfolio.field.tag": { en: "Filter Tag", ar: "تصنيف الفلترة" },
  "portfolio.field.projectUrl": { en: "Project Link", ar: "رابط المشروع" },
  "portfolio.field.descriptionEn": { en: "Description (English)", ar: "الوصف (إنجليزي)" },
  "portfolio.field.descriptionAr": { en: "Description (Arabic)", ar: "الوصف (عربي)" },
  "portfolio.field.image": { en: "Cover Image", ar: "صورة الغلاف" },
  "portfolio.field.gallery": { en: "Additional Photos & Video", ar: "صور وفيديو إضافية" },
  "portfolio.field.currentGallery": { en: "Current Photos & Video", ar: "الصور والفيديو الحالية" },
  "portfolio.save": { en: "Add Project", ar: "إضافة المشروع" },
  "portfolio.update": { en: "Save Changes", ar: "حفظ التعديلات" },
  "portfolio.cancel": { en: "Cancel", ar: "إلغاء" },
  "testimonials.title": { en: "Testimonials", ar: "آراء العملاء" },
  "testimonials.sub": { en: "Client reviews shown in the homepage testimonials carousel.", ar: "آراء العملاء المعروضة في السلايدر بالصفحة الرئيسية." },
  "testimonials.addTitle": { en: "Add a Testimonial", ar: "إضافة رأي عميل" },
  "testimonials.editTitle": { en: "Edit Testimonial", ar: "تعديل رأي العميل" },
  "testimonials.field.nameEn": { en: "Name (English)", ar: "الاسم (إنجليزي)" },
  "testimonials.field.nameAr": { en: "Name (Arabic)", ar: "الاسم (عربي)" },
  "testimonials.field.roleEn": { en: "Role / Company (English)", ar: "المنصب / الشركة (إنجليزي)" },
  "testimonials.field.roleAr": { en: "Role / Company (Arabic)", ar: "المنصب / الشركة (عربي)" },
  "testimonials.field.quoteEn": { en: "Quote (English)", ar: "الرأي (إنجليزي)" },
  "testimonials.field.quoteAr": { en: "Quote (Arabic)", ar: "الرأي (عربي)" },
  "testimonials.field.rating": { en: "Rating", ar: "التقييم" },
  "testimonials.field.photo": { en: "Photo", ar: "الصورة" },
  "testimonials.save": { en: "Add Testimonial", ar: "إضافة الرأي" },
  "testimonials.update": { en: "Save Changes", ar: "حفظ التعديلات" },
  "testimonials.cancel": { en: "Cancel", ar: "إلغاء" },
  "content.title": { en: "Site Content", ar: "محتوى الموقع" },
  "content.sub": { en: "Edit the headlines, testimonials, and button text shown on the website, in both languages.", ar: "عدّل العناوين والشهادات ونصوص الأزرار الظاهرة في الموقع، باللغتين." },
  "content.save": { en: "Save All Changes", ar: "حفظ كل التغييرات" },
  "settings.title": { en: "Agency Settings", ar: "إعدادات الوكالة" },
  "settings.sub": { en: "The real contact info shown across the website.", ar: "معلومات التواصل الحقيقية المعروضة في الموقع." },
  "settings.email": { en: "Email Address", ar: "البريد الإلكتروني" },
  "settings.phone": { en: "Phone Number", ar: "رقم الهاتف" },
  "settings.whatsapp": { en: "WhatsApp Number (digits only, with country code)", ar: "رقم واتساب (أرقام فقط مع رمز الدولة)" },
  "settings.addressEn": { en: "Address (English)", ar: "العنوان (إنجليزي)" },
  "settings.addressAr": { en: "Address (Arabic)", ar: "العنوان (عربي)" },
  "settings.social": { en: "Social Links", ar: "روابط التواصل الاجتماعي" },
  "settings.save": { en: "Save Settings", ar: "حفظ الإعدادات" },
  "settings.changePasswordTitle": { en: "Change Your Password", ar: "تغيير كلمة المرور" },
  "settings.changePasswordSub": { en: "Update the password for the account you're logged in as.", ar: "تحديث كلمة مرور الحساب الذي سجّلت الدخول به." },
  "settings.currentPassword": { en: "Current Password", ar: "كلمة المرور الحالية" },
  "settings.newPassword": { en: "New Password", ar: "كلمة المرور الجديدة" },
  "settings.confirmPassword": { en: "Confirm New Password", ar: "تأكيد كلمة المرور الجديدة" },
  "settings.changePasswordSave": { en: "Update Password", ar: "تحديث كلمة المرور" },
  "settings.accountsTitle": { en: "Dashboard Accounts", ar: "حسابات لوحة التحكم" },
  "settings.accountsSub": { en: "Everyone listed here can log into this dashboard.", ar: "يمكن لكل من هو مدرج هنا تسجيل الدخول إلى لوحة التحكم." },
  "settings.addAccountTitle": { en: "Add an Account", ar: "إضافة حساب" },
  "settings.newUsername": { en: "Username", ar: "اسم المستخدم" },
  "settings.newAccountPassword": { en: "Password", ar: "كلمة المرور" },
  "settings.addAccountSave": { en: "Add Account", ar: "إضافة الحساب" },
  "settings.you": { en: "you", ar: "أنت" },
  "settings.remove": { en: "Remove", ar: "إزالة" },
};

var DASH_LANG_KEY = "nv-dashboard-lang";

function getDashLang() {
  try {
    return localStorage.getItem(DASH_LANG_KEY) === "ar" ? "ar" : "en";
  } catch (e) {
    return "en";
  }
}

function applyDashLang(lang) {
  document.documentElement.classList.toggle("nv-rtl", lang === "ar");
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.querySelectorAll("[data-t]").forEach(function (el) {
    var key = el.getAttribute("data-t");
    var entry = DASH_I18N[key];
    if (entry) el.textContent = entry[lang] || entry.en;
  });
  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

function setDashLang(lang) {
  try {
    localStorage.setItem(DASH_LANG_KEY, lang);
  } catch (e) {}
  applyDashLang(lang);
}

function t(key) {
  var entry = DASH_I18N[key];
  if (!entry) return key;
  return entry[getDashLang()] || entry.en;
}

// ---------- Toast ----------
var toastTimer = null;
function showToast(message, isError) {
  var el = document.getElementById("toast");
  el.textContent = message;
  el.classList.toggle("error", !!isError);
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    el.classList.remove("show");
  }, 3200);
}

// ---------- Auth guard ----------
var currentUsername = null;

function checkSession() {
  return fetch("/api/session")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.loggedIn) {
        window.location.href = "./login.html";
        return false;
      }
      currentUsername = data.username;
      return true;
    });
}

function wireLogout() {
  document.getElementById("logout-btn").addEventListener("click", function () {
    fetch("/api/logout", { method: "POST" }).then(function () {
      window.location.href = "./login.html";
    });
  });
}

// ---------- Section navigation ----------
function wireNav() {
  document.querySelectorAll(".nv-nav-item[data-section]").forEach(function (item) {
    item.addEventListener("click", function () {
      var section = item.getAttribute("data-section");
      document.querySelectorAll(".nv-nav-item[data-section]").forEach(function (i) {
        i.classList.toggle("active", i === item);
      });
      document.querySelectorAll(".nv-section").forEach(function (s) {
        s.classList.toggle("active", s.id === "section-" + section);
      });
      closeMobileMenu();
    });
  });
}

// ---------- Mobile hamburger menu ----------
function closeMobileMenu() {
  var toggle = document.getElementById("sidebar-toggle");
  var panel = document.getElementById("sidebar-collapsible");
  if (!toggle || !panel) return;
  panel.style.maxHeight = "0px";
  panel.classList.remove("open");
  toggle.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}

function openMobileMenu() {
  var toggle = document.getElementById("sidebar-toggle");
  var panel = document.getElementById("sidebar-collapsible");
  if (!toggle || !panel) return;
  panel.classList.add("open");
  panel.style.maxHeight = panel.scrollHeight + "px";
  toggle.classList.add("open");
  toggle.setAttribute("aria-expanded", "true");
}

function wireMobileNav() {
  var toggle = document.getElementById("sidebar-toggle");
  var panel = document.getElementById("sidebar-collapsible");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    if (panel.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  document.addEventListener("click", function (ev) {
    if (window.innerWidth > 860) return;
    if (!panel.classList.contains("open")) return;
    if (ev.target.closest("#sidebar-collapsible") || ev.target.closest("#sidebar-toggle")) return;
    closeMobileMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) {
      panel.style.maxHeight = "";
      panel.classList.remove("open");
      toggle.classList.remove("open");
    }
  });
}

// ---------- Messages ----------
function loadMessages() {
  fetch("/api/messages")
    .then(function (r) { return r.json(); })
    .then(renderMessages)
    .catch(function () { showToast("Failed to load messages", true); });
}

function renderMessages(messages) {
  var list = document.getElementById("messages-list");
  var unreadCount = messages.filter(function (m) { return !m.read; }).length;
  var badge = document.getElementById("unread-count");
  if (unreadCount > 0) {
    badge.style.display = "";
    badge.textContent = unreadCount;
  } else {
    badge.style.display = "none";
  }

  if (!messages.length) {
    list.innerHTML = '<div class="nv-glass nv-empty">No messages yet.</div>';
    return;
  }

  list.innerHTML = messages
    .map(function (m) {
      var date = new Date(m.createdAt).toLocaleString();
      return (
        '<div class="nv-glass nv-msg-item" data-id="' + m.id + '">' +
        '<div class="nv-msg-head">' +
        '<div><div class="nv-msg-name">' + escapeHtml(m.name) + "</div>" +
        '<div class="nv-msg-meta">' + escapeHtml(m.email) + " · " + date + "</div></div>" +
        '<span class="nv-badge ' + (m.read ? "nv-badge-read" : "nv-badge-unread") + '">' + (m.read ? "Read" : "New") + "</span>" +
        "</div>" +
        (m.whatsapp || m.country
          ? '<div style="font-size:12.5px;color:var(--text-dimmer);margin-bottom:6px;">' +
            (m.whatsapp ? "📱 " + escapeHtml(m.whatsapp) : "") +
            (m.whatsapp && m.country ? "  ·  " : "") +
            (m.country ? "🌍 " + escapeHtml(m.country) : "") +
            "</div>"
          : "") +
        (m.subject ? '<div style="font-weight:700;font-size:13.5px;margin-bottom:6px;">' + escapeHtml(m.subject) + "</div>" : "") +
        '<div class="nv-msg-body">' + escapeHtml(m.message) + "</div>" +
        '<div class="nv-msg-actions">' +
        '<button class="nv-btn-ghost nv-btn toggle-read-btn" data-id="' + m.id + '" data-read="' + m.read + '">' + (m.read ? "Mark Unread" : "Mark Read") + "</button>" +
        '<button class="nv-btn-danger nv-btn delete-msg-btn" data-id="' + m.id + '">Delete</button>' +
        "</div>" +
        "</div>"
      );
    })
    .join("");

  list.querySelectorAll(".toggle-read-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-id");
      var currentlyRead = btn.getAttribute("data-read") === "true";
      fetch("/api/messages/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentlyRead }),
      }).then(loadMessages);
    });
  });

  list.querySelectorAll(".delete-msg-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-id");
      if (!confirm("Delete this message?")) return;
      fetch("/api/messages/" + id, { method: "DELETE" }).then(loadMessages);
    });
  });
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// ---------- Portfolio ----------
var portfolioCache = [];
var pendingRemoveGallery = [];

function loadPortfolio() {
  fetch("/api/portfolio")
    .then(function (r) { return r.json(); })
    .then(function (items) {
      portfolioCache = items;
      renderPortfolio(items);
    });
}

function renderPortfolio(items) {
  var grid = document.getElementById("portfolio-grid");
  if (!items.length) {
    grid.innerHTML = '<div class="nv-glass nv-empty" style="grid-column:1/-1;">No projects yet.</div>';
    return;
  }
  grid.innerHTML = items
    .map(function (item) {
      var thumb = item.image
        ? '<img src="/' + item.image + '" alt="">'
        : "";
      var mediaCount = (item.gallery || []).length;
      return (
        '<div class="nv-glass nv-portfolio-item">' +
        '<div class="nv-portfolio-thumb">' + thumb + "</div>" +
        '<div class="nv-portfolio-body">' +
        '<div class="nv-portfolio-title">' + escapeHtml(item.title.en) + "</div>" +
        '<div class="nv-portfolio-cat">' + escapeHtml(item.category.en) + "</div>" +
        (item.projectUrl ? '<div style="font-size:11.5px;color:var(--text-dimmer);margin-top:4px;">🔗 ' + escapeHtml(item.projectUrl) + "</div>" : "") +
        (mediaCount ? '<div style="font-size:11.5px;color:var(--text-dimmer);margin-top:2px;">' + mediaCount + " extra file" + (mediaCount > 1 ? "s" : "") + "</div>" : "") +
        '<div class="nv-portfolio-actions">' +
        '<button class="nv-btn-ghost nv-btn edit-portfolio-btn" data-id="' + item.id + '">Edit</button>' +
        '<button class="nv-btn-danger nv-btn delete-portfolio-btn" data-id="' + item.id + '">Delete</button>' +
        "</div></div></div>"
      );
    })
    .join("");

  grid.querySelectorAll(".edit-portfolio-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      startEditPortfolio(btn.getAttribute("data-id"));
    });
  });
  grid.querySelectorAll(".delete-portfolio-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-id");
      if (!confirm("Delete this project?")) return;
      fetch("/api/portfolio/" + id, { method: "DELETE" }).then(function () {
        loadPortfolio();
        showToast("Project deleted");
      });
    });
  });
}

function renderGalleryManager(item) {
  var wrap = document.getElementById("gallery-manage-wrap");
  var list = document.getElementById("gallery-manage-list");
  var gallery = (item && item.gallery) || [];
  if (!gallery.length) {
    wrap.style.display = "none";
    list.innerHTML = "";
    return;
  }
  wrap.style.display = "";
  list.innerHTML = gallery
    .map(function (g) {
      var media = g.type === "video"
        ? '<video src="/' + g.url + '" muted></video><span class="video-tag">VIDEO</span>'
        : '<img src="/' + g.url + '" alt="">';
      return (
        '<div class="nv-gallery-thumb" data-url="' + escapeHtml(g.url) + '">' +
        media +
        '<button type="button" class="remove-thumb" data-url="' + escapeHtml(g.url) + '">×</button>' +
        "</div>"
      );
    })
    .join("");

  list.querySelectorAll(".remove-thumb").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-url");
      var thumb = btn.closest(".nv-gallery-thumb");
      var idx = pendingRemoveGallery.indexOf(url);
      if (idx === -1) {
        pendingRemoveGallery.push(url);
        thumb.classList.add("pending-remove");
      } else {
        pendingRemoveGallery.splice(idx, 1);
        thumb.classList.remove("pending-remove");
      }
    });
  });
}

function startEditPortfolio(id) {
  var item = portfolioCache.find(function (p) { return p.id === id; });
  if (!item) return;
  pendingRemoveGallery = [];
  document.getElementById("portfolio-edit-id").value = id;
  document.getElementById("p-titleEn").value = item.title.en || "";
  document.getElementById("p-titleAr").value = item.title.ar || "";
  document.getElementById("p-categoryEn").value = item.category.en || "";
  document.getElementById("p-categoryAr").value = item.category.ar || "";
  document.getElementById("p-tag").value = item.tag || "web";
  document.getElementById("p-projectUrl").value = item.projectUrl || "";
  document.getElementById("p-descriptionEn").value = (item.description && item.description.en) || "";
  document.getElementById("p-descriptionAr").value = (item.description && item.description.ar) || "";
  renderGalleryManager(item);
  document.getElementById("portfolio-form-title").textContent = t("portfolio.editTitle");
  document.getElementById("portfolio-submit-btn").textContent = t("portfolio.update");
  document.getElementById("portfolio-cancel-btn").style.display = "";
  document.getElementById("portfolio-form").scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetPortfolioForm() {
  document.getElementById("portfolio-form").reset();
  document.getElementById("portfolio-edit-id").value = "";
  pendingRemoveGallery = [];
  renderGalleryManager(null);
  document.getElementById("portfolio-form-title").textContent = t("portfolio.addTitle");
  document.getElementById("portfolio-submit-btn").textContent = t("portfolio.save");
  document.getElementById("portfolio-cancel-btn").style.display = "none";
}

function wirePortfolioForm() {
  document.getElementById("portfolio-cancel-btn").addEventListener("click", resetPortfolioForm);

  document.getElementById("portfolio-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("portfolio-edit-id").value;
    var formData = new FormData();
    formData.append("titleEn", document.getElementById("p-titleEn").value.trim());
    formData.append("titleAr", document.getElementById("p-titleAr").value.trim());
    formData.append("categoryEn", document.getElementById("p-categoryEn").value.trim());
    formData.append("categoryAr", document.getElementById("p-categoryAr").value.trim());
    formData.append("tag", document.getElementById("p-tag").value);
    formData.append("projectUrl", document.getElementById("p-projectUrl").value.trim());
    formData.append("descriptionEn", document.getElementById("p-descriptionEn").value.trim());
    formData.append("descriptionAr", document.getElementById("p-descriptionAr").value.trim());
    var fileInput = document.getElementById("p-image");
    if (fileInput.files[0]) formData.append("image", fileInput.files[0]);
    var galleryInput = document.getElementById("p-gallery");
    Array.from(galleryInput.files || []).forEach(function (f) { formData.append("gallery", f); });
    if (pendingRemoveGallery.length) formData.append("removeGallery", JSON.stringify(pendingRemoveGallery));

    var url = id ? "/api/portfolio/" + id : "/api/portfolio";
    var method = id ? "PUT" : "POST";

    fetch(url, { method: method, body: formData })
      .then(function (r) {
        if (!r.ok) throw new Error("Request failed");
        return r.json();
      })
      .then(function () {
        resetPortfolioForm();
        loadPortfolio();
        showToast(id ? "Project updated" : "Project added");
      })
      .catch(function () { showToast("Could not save project", true); });
  });
}

// ---------- Testimonials ----------
var testimonialsCache = [];

function loadTestimonials() {
  fetch("/api/testimonials")
    .then(function (r) { return r.json(); })
    .then(function (items) {
      testimonialsCache = items;
      renderTestimonials(items);
    });
}

function starString(rating) {
  var full = Math.max(0, Math.min(5, rating || 0));
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}

function renderTestimonials(items) {
  var grid = document.getElementById("testimonials-grid");
  if (!items.length) {
    grid.innerHTML = '<div class="nv-glass nv-empty" style="grid-column:1/-1;">No testimonials yet.</div>';
    return;
  }
  grid.innerHTML = items
    .map(function (item) {
      var avatar = item.photo
        ? '<img class="nv-testimonial-avatar" src="/' + item.photo + '" alt="">'
        : '<div class="nv-testimonial-avatar-fallback">' + escapeHtml((item.name.en || "?").charAt(0).toUpperCase()) + "</div>";
      return (
        '<div class="nv-glass nv-portfolio-item">' +
        '<div style="padding:18px 18px 0; display:flex; align-items:center; gap:12px;">' +
        avatar +
        '<div><div class="nv-portfolio-title">' + escapeHtml(item.name.en) + "</div>" +
        '<div style="font-size:12px; color:var(--text-dimmer);">' + escapeHtml(item.role.en) + "</div></div>" +
        "</div>" +
        '<div class="nv-portfolio-body">' +
        '<div class="nv-testimonial-stars">' + starString(item.rating) + "</div>" +
        '<div style="font-size:13px; color:var(--text-dim); margin-top:8px; line-height:1.5;">' + escapeHtml(item.quote.en) + "</div>" +
        '<div class="nv-portfolio-actions">' +
        '<button class="nv-btn-ghost nv-btn edit-testimonial-btn" data-id="' + item.id + '">Edit</button>' +
        '<button class="nv-btn-danger nv-btn delete-testimonial-btn" data-id="' + item.id + '">Delete</button>' +
        "</div></div></div>"
      );
    })
    .join("");

  grid.querySelectorAll(".edit-testimonial-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      startEditTestimonial(btn.getAttribute("data-id"));
    });
  });
  grid.querySelectorAll(".delete-testimonial-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-id");
      if (!confirm("Delete this testimonial?")) return;
      fetch("/api/testimonials/" + id, { method: "DELETE" }).then(function () {
        loadTestimonials();
        showToast("Testimonial deleted");
      });
    });
  });
}

function setStarPicker(rating) {
  var picker = document.getElementById("t-rating-picker");
  picker.setAttribute("data-value", rating);
  picker.querySelectorAll("span").forEach(function (star) {
    star.classList.toggle("filled", parseInt(star.getAttribute("data-star"), 10) <= rating);
  });
}

function wireStarPicker() {
  var picker = document.getElementById("t-rating-picker");
  picker.querySelectorAll("span").forEach(function (star) {
    star.addEventListener("click", function () {
      setStarPicker(parseInt(star.getAttribute("data-star"), 10));
    });
  });
}

function startEditTestimonial(id) {
  var item = testimonialsCache.find(function (p) { return p.id === id; });
  if (!item) return;
  document.getElementById("t-edit-id").value = id;
  document.getElementById("t-nameEn").value = item.name.en || "";
  document.getElementById("t-nameAr").value = item.name.ar || "";
  document.getElementById("t-roleEn").value = item.role.en || "";
  document.getElementById("t-roleAr").value = item.role.ar || "";
  document.getElementById("t-quoteEn").value = item.quote.en || "";
  document.getElementById("t-quoteAr").value = item.quote.ar || "";
  setStarPicker(item.rating || 5);
  document.getElementById("testimonial-form-title").textContent = t("testimonials.editTitle");
  document.getElementById("testimonial-submit-btn").textContent = t("testimonials.update");
  document.getElementById("testimonial-cancel-btn").style.display = "";
  document.getElementById("testimonial-form").scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetTestimonialForm() {
  document.getElementById("testimonial-form").reset();
  document.getElementById("t-edit-id").value = "";
  setStarPicker(5);
  document.getElementById("testimonial-form-title").textContent = t("testimonials.addTitle");
  document.getElementById("testimonial-submit-btn").textContent = t("testimonials.save");
  document.getElementById("testimonial-cancel-btn").style.display = "none";
}

function wireTestimonialForm() {
  wireStarPicker();
  setStarPicker(5);
  document.getElementById("testimonial-cancel-btn").addEventListener("click", resetTestimonialForm);

  document.getElementById("testimonial-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("t-edit-id").value;
    var formData = new FormData();
    formData.append("nameEn", document.getElementById("t-nameEn").value.trim());
    formData.append("nameAr", document.getElementById("t-nameAr").value.trim());
    formData.append("roleEn", document.getElementById("t-roleEn").value.trim());
    formData.append("roleAr", document.getElementById("t-roleAr").value.trim());
    formData.append("quoteEn", document.getElementById("t-quoteEn").value.trim());
    formData.append("quoteAr", document.getElementById("t-quoteAr").value.trim());
    formData.append("rating", document.getElementById("t-rating-picker").getAttribute("data-value"));
    var fileInput = document.getElementById("t-photo");
    if (fileInput.files[0]) formData.append("photo", fileInput.files[0]);

    var url = id ? "/api/testimonials/" + id : "/api/testimonials";
    var method = id ? "PUT" : "POST";

    fetch(url, { method: method, body: formData })
      .then(function (r) {
        if (!r.ok) throw new Error("Request failed");
        return r.json();
      })
      .then(function () {
        resetTestimonialForm();
        loadTestimonials();
        showToast(id ? "Testimonial updated" : "Testimonial added");
      })
      .catch(function () { showToast("Could not save testimonial", true); });
  });
}

// ---------- Settings ----------
function loadSettings() {
  fetch("/api/settings")
    .then(function (r) { return r.json(); })
    .then(function (s) {
      document.getElementById("s-email").value = s.email || "";
      document.getElementById("s-phone").value = s.phone || "";
      document.getElementById("s-whatsapp").value = s.whatsapp || "";
      document.getElementById("s-addressEn").value = (s.address && s.address.en) || "";
      document.getElementById("s-addressAr").value = (s.address && s.address.ar) || "";
      document.getElementById("s-facebook").value = (s.social && s.social.facebook) || "";
      document.getElementById("s-instagram").value = (s.social && s.social.instagram) || "";
      document.getElementById("s-linkedin").value = (s.social && s.social.linkedin) || "";
      document.getElementById("s-twitter").value = (s.social && s.social.twitter) || "";
    });
}

function wireSettingsForm() {
  document.getElementById("settings-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var payload = {
      email: document.getElementById("s-email").value.trim(),
      phone: document.getElementById("s-phone").value.trim(),
      whatsapp: document.getElementById("s-whatsapp").value.trim(),
      address: {
        en: document.getElementById("s-addressEn").value.trim(),
        ar: document.getElementById("s-addressAr").value.trim(),
      },
      social: {
        facebook: document.getElementById("s-facebook").value.trim(),
        instagram: document.getElementById("s-instagram").value.trim(),
        linkedin: document.getElementById("s-linkedin").value.trim(),
        twitter: document.getElementById("s-twitter").value.trim(),
      },
    };
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("failed");
        showToast("Settings saved");
      })
      .catch(function () { showToast("Could not save settings", true); });
  });
}

// ---------- Password + accounts ----------
function wirePasswordForm() {
  document.getElementById("password-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var current = document.getElementById("pw-current").value;
    var next = document.getElementById("pw-new").value;
    var confirm = document.getElementById("pw-confirm").value;
    if (next !== confirm) {
      showToast("New password and confirmation don't match", true);
      return;
    }
    fetch("/api/account/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    })
      .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (result) {
        if (!result.ok) throw new Error((result.body && result.body.error) || "Could not update password");
        document.getElementById("password-form").reset();
        showToast("Password updated");
      })
      .catch(function (err) { showToast(err.message, true); });
  });
}

function loadAccounts() {
  fetch("/api/account/users")
    .then(function (r) { return r.json(); })
    .then(renderAccounts);
}

function renderAccounts(users) {
  var list = document.getElementById("accounts-list");
  list.innerHTML = users
    .map(function (u) {
      var isSelf = u.username === currentUsername;
      var created = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "";
      return (
        '<div class="nv-glass" style="padding:16px 20px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between;">' +
        "<div><div style=\"font-weight:700; font-size:14.5px;\">" + escapeHtml(u.username) +
        (isSelf ? ' <span class="nv-badge nv-badge-unread" style="margin-left:8px;" data-t="settings.you">' + t("settings.you") + "</span>" : "") +
        "</div>" +
        (created ? '<div style="font-size:12px; color:var(--text-dimmer); margin-top:2px;">' + created + "</div>" : "") +
        "</div>" +
        (isSelf || users.length <= 1
          ? ""
          : '<button class="nv-btn-danger nv-btn remove-account-btn" data-username="' + escapeHtml(u.username) + '">' + t("settings.remove") + "</button>") +
        "</div>"
      );
    })
    .join("");

  list.querySelectorAll(".remove-account-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var username = btn.getAttribute("data-username");
      if (!confirm('Remove account "' + username + '"?')) return;
      fetch("/api/account/users/" + encodeURIComponent(username), { method: "DELETE" })
        .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
        .then(function (result) {
          if (!result.ok) throw new Error((result.body && result.body.error) || "Could not remove account");
          loadAccounts();
          showToast("Account removed");
        })
        .catch(function (err) { showToast(err.message, true); });
    });
  });
}

function wireAddAccountForm() {
  document.getElementById("add-account-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var username = document.getElementById("acc-username").value.trim();
    var password = document.getElementById("acc-password").value;
    fetch("/api/account/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (result) {
        if (!result.ok) throw new Error((result.body && result.body.error) || "Could not add account");
        document.getElementById("add-account-form").reset();
        loadAccounts();
        showToast("Account added");
      })
      .catch(function (err) { showToast(err.message, true); });
  });
}

// ---------- Content ----------
var contentOverridesCache = {};

function loadContent() {
  fetch("/api/content")
    .then(function (r) { return r.json(); })
    .then(function (overrides) {
      contentOverridesCache = overrides || {};
      renderContentEditor();
    });
}

function renderContentEditor() {
  var container = document.getElementById("content-groups");
  var schema = window.NV_CONTENT_SCHEMA || [];
  container.innerHTML = schema
    .map(function (group) {
      var fields = group.items
        .map(function (item) {
          var override = contentOverridesCache[item.key] || {};
          var enVal = override.en !== undefined && override.en !== "" ? override.en : item.en;
          var arVal = override.ar !== undefined && override.ar !== "" ? override.ar : item.ar;
          return (
            '<div class="nv-field">' +
            '<label class="nv-label">' + escapeHtml(item.label) + "</label>" +
            '<div class="nv-grid-2">' +
            '<input class="nv-input content-input" data-key="' + item.key + '" data-lang="en" value="' + escapeHtml(enVal) + '" placeholder="English">' +
            '<input class="nv-input content-input" data-key="' + item.key + '" data-lang="ar" dir="rtl" value="' + escapeHtml(arVal) + '" placeholder="Arabic">' +
            "</div></div>"
          );
        })
        .join("");
      return (
        '<div class="nv-glass nv-card nv-content-group">' +
        '<div class="nv-content-group-title">' + escapeHtml(group.group) + "</div>" +
        fields +
        "</div>"
      );
    })
    .join("");
}

function wireContentSave() {
  document.getElementById("content-save-btn").addEventListener("click", function () {
    var inputs = document.querySelectorAll(".content-input");
    var payload = {};
    inputs.forEach(function (input) {
      var key = input.getAttribute("data-key");
      var lang = input.getAttribute("data-lang");
      if (!payload[key]) payload[key] = {};
      payload[key][lang] = input.value;
    });
    fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then(function (saved) {
        contentOverridesCache = saved;
        showToast("Content saved — live on the website");
      })
      .catch(function () { showToast("Could not save content", true); });
  });
}

// ---------- Boot ----------
checkSession().then(function (ok) {
  if (!ok) return;
  applyDashLang(getDashLang());
  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setDashLang(btn.getAttribute("data-lang"));
      var panel = document.getElementById("sidebar-collapsible");
      if (!panel || !panel.classList.contains("open")) return;
      // Re-measure immediately (covers plain text-length changes)...
      requestAnimationFrame(function () { panel.style.maxHeight = panel.scrollHeight + "px"; });
      // ...and again once web fonts finish loading, since Cairo/Tajawal only start
      // downloading the first time Arabic text actually renders, which reflows the
      // panel taller *after* the immediate measurement above already ran.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (panel.classList.contains("open")) panel.style.maxHeight = panel.scrollHeight + "px";
        });
      }
    });
  });
  wireLogout();
  wireNav();
  wireMobileNav();
  wirePortfolioForm();
  wireTestimonialForm();
  wireSettingsForm();
  wirePasswordForm();
  wireAddAccountForm();
  wireContentSave();
  loadMessages();
  loadPortfolio();
  loadTestimonials();
  loadSettings();
  loadContent();
  loadAccounts();
});
