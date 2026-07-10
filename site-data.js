// Next Vision Agency — pulls live agency settings + dashboard-edited copy overrides
// onto the static page. Include via <script src="./site-data.js"></script> AFTER i18n.js.
"use strict";
(function () {
  function applyTextOverride(key, en, ar) {
    var els = document.querySelectorAll('[data-i18n="' + key + '"]');
    if (!els.length) return;
    els.forEach(function (el) {
      if (typeof en === "string" && en) el.dataset.i18nEn = en;
      if (typeof ar === "string" && ar && window.NV_AR_DICT) window.NV_AR_DICT[key] = ar;
    });
  }

  function isSafeUrl(url) {
    return typeof url === "string" && /^https?:\/\/\S+$/i.test(url);
  }

  function applyContactInfo(settings) {
    if (!settings) return;

    document.querySelectorAll('[data-nv-field="email"]').forEach(function (el) {
      el.textContent = settings.email || "";
    });
    document.querySelectorAll('[data-nv-field="phone"]').forEach(function (el) {
      el.textContent = settings.phone || "";
    });
    document.querySelectorAll('[data-nv-contact="email"]').forEach(function (el) {
      if (settings.email) el.setAttribute("href", "mailto:" + settings.email);
    });
    document.querySelectorAll('[data-nv-contact="phone"]').forEach(function (el) {
      if (settings.phone) el.setAttribute("href", "tel:" + settings.phone.replace(/[^0-9+]/g, ""));
    });

    var waDigits = (settings.whatsapp || "").replace(/[^0-9]/g, "");
    document.querySelectorAll('[data-nv-contact="whatsapp"]').forEach(function (el) {
      if (waDigits) {
        el.setAttribute("href", "https://wa.me/" + waDigits);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    });

    var socials = settings.social || {};
    ["facebook", "instagram", "linkedin", "twitter"].forEach(function (key) {
      document.querySelectorAll('[data-nv-contact="' + key + '"]').forEach(function (el) {
        if (isSafeUrl(socials[key])) {
          el.setAttribute("href", socials[key]);
          el.style.display = "";
        } else {
          el.style.display = "none";
        }
      });
    });

    if (settings.address) {
      applyTextOverride("footer.location", settings.address.en, settings.address.ar);
      applyTextOverride("contact.info.address.value", settings.address.en, settings.address.ar);
    }
  }

  function applyContentOverrides(content) {
    if (!content) return;
    Object.keys(content).forEach(function (key) {
      var entry = content[key];
      if (entry) applyTextOverride(key, entry.en, entry.ar);
    });
  }

  function fetchJson(url) {
    return fetch(url)
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .catch(function () {
        return null;
      });
  }

  function boot() {
    Promise.all([fetchJson("/api/settings"), fetchJson("/api/content")]).then(function (results) {
      applyContactInfo(results[0]);
      applyContentOverrides(results[1]);
      if (window.NVI18N && window.NVI18N.applyAll) window.NVI18N.applyAll();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.NVSiteData = { applyContactInfo: applyContactInfo, applyContentOverrides: applyContentOverrides };
})();
