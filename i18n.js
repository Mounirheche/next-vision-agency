// Next Vision Agency — client-side i18n (English / Arabic) with RTL support.
// Include via <script src="./i18n.js"></script> after support.js on every page.
"use strict";
(function () {
  var STORAGE_KEY = "nv-lang";

  var AR = window.NV_AR_DICT || {};

  function getLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === "ar" ? "ar" : "en";
    } catch (e) {
      return "en";
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  var observer = null;

  function applyToEl(el, lang) {
    var key = el.getAttribute("data-i18n");
    if (!key) return;
    var attr = el.getAttribute("data-i18n-attr");
    if (attr) {
      if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.getAttribute(attr) || "";
      var next = lang === "ar" && AR[key] ? AR[key] : el.dataset.i18nOrig;
      if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
      return;
    }
    if (el.dataset.i18nEn === undefined) el.dataset.i18nEn = el.innerHTML;
    var nextHtml = lang === "ar" && AR[key] ? AR[key] : el.dataset.i18nEn;
    if (el.innerHTML !== nextHtml) el.innerHTML = nextHtml;
  }

  function updateSwitcherUI(lang) {
    document.querySelectorAll("[data-nv-lang-toggle]").forEach(function (el) {
      el.textContent = lang === "ar" ? "AR ▾" : "EN ▾";
    });
    document.querySelectorAll("[data-nv-lang-option]").forEach(function (opt) {
      var active = opt.getAttribute("data-nv-lang-option") === lang;
      opt.style.color = active ? "#00CFFF" : "#FFFFFF";
      opt.style.background = active ? "rgba(0,207,255,0.1)" : "transparent";
    });
  }

  function applyAll(lang) {
    if (observer) observer.disconnect();

    document.documentElement.setAttribute("lang", lang === "ar" ? "ar" : "en");
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.classList.toggle("nv-rtl", lang === "ar");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      applyToEl(el, lang);
    });
    updateSwitcherUI(lang);

    if (observer) {
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  function setLang(lang) {
    lang = lang === "ar" ? "ar" : "en";
    storeLang(lang);
    applyAll(lang);
  }

  function injectRtlStyles() {
    if (document.getElementById("nv-i18n-rtl-style")) return;
    var style = document.createElement("style");
    style.id = "nv-i18n-rtl-style";
    style.textContent =
      "html.nv-rtl body{font-family:'Cairo','Tajawal','Manrope',sans-serif;}" +
      "html.nv-rtl h1,html.nv-rtl h2,html.nv-rtl h3,html.nv-rtl h4{font-family:'Cairo','Tajawal','Space Grotesk',sans-serif;}" +
      "html.nv-rtl [data-nv-lang-menu]{left:0;right:auto;text-align:right;}" +
      "html.nv-rtl button[data-nv-lang-option]{text-align:right;}" +
      "html.nv-rtl [data-nv-underline]{left:auto;right:0;}";
    document.head.appendChild(style);
  }

  function loadArabicFont() {
    if (document.getElementById("nv-ar-font")) return;
    var link = document.createElement("link");
    link.id = "nv-ar-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
  }

  function toggleMenu(menu, force) {
    var open = force !== undefined ? force : menu.style.visibility !== "visible";
    menu.style.opacity = open ? "1" : "0";
    menu.style.visibility = open ? "visible" : "hidden";
    menu.style.transform = open ? "translateY(0)" : "translateY(-8px)";
  }

  function wireLangSwitcher() {
    document.addEventListener("click", function (ev) {
      var option = ev.target.closest("[data-nv-lang-option]");
      var toggle = ev.target.closest("[data-nv-lang-toggle]");
      var menu = document.querySelector("[data-nv-lang-menu]");

      if (option) {
        setLang(option.getAttribute("data-nv-lang-option"));
        if (menu) toggleMenu(menu, false);
        return;
      }
      if (toggle) {
        if (menu) toggleMenu(menu);
        return;
      }
      if (menu && !ev.target.closest("[data-nv-lang]")) toggleMenu(menu, false);
    });
  }

  // Safety net for the page's own scroll-reveal (".nv-reveal" / IntersectionObserver)
  // system: swapping innerHTML to translate content can race with that observer being
  // set up (most noticeably when the page boots directly into Arabic), leaving elements
  // stuck at opacity:0 forever. Independently sweep for anything that should already be
  // visible and reveal it, without disturbing the page's own staggered reveal timing.
  function setupRevealFallback() {
    function sweep() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(".nv-reveal:not(.nv-in)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) {
          el.classList.add("nv-in");
        }
      });
    }
    sweep();
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);
    [200, 500, 1000, 2000, 3500].forEach(function (ms) {
      setTimeout(sweep, ms);
    });
  }

  function boot() {
    loadArabicFont();
    injectRtlStyles();
    wireLangSwitcher();
    observer = new MutationObserver(function () {
      applyAll(getLang());
    });
    applyAll(getLang());
    setupRevealFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.NVI18N = { setLang: setLang, getLang: getLang, applyAll: function () { applyAll(getLang()); } };
})();
