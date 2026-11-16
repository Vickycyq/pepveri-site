/* ============================================================
   Pepveri — i18n language framework
   ------------------------------------------------------------
   HOW TO ADD A LANGUAGE LATER:
   1. Set available: true for that language below.
   2. Add a strings object for it (copy the en structure and
      translate values). All page text uses data-i18n keys,
      so translations apply automatically.
   3. Arabic (ar) automatically switches the page to RTL
      (dir="rtl") when activated.
   ============================================================ */

const I18N = {
  defaultLang: "en",
  langs: [
    { code: "en", name: "English",        native: "English",    available: true,  dir: "ltr" },
    { code: "fr", name: "French",         native: "Français",   available: false, dir: "ltr" },
    { code: "es", name: "Spanish",        native: "Español",    available: false, dir: "ltr" },
    { code: "pt", name: "Portuguese",     native: "Português",  available: false, dir: "ltr" },
    { code: "ar", name: "Arabic",         native: "العربية",     available: false, dir: "rtl" },
    { code: "ru", name: "Russian",        native: "Русский",    available: false, dir: "ltr" },
  ],

  strings: {
    en: {
      "nav.home": "Home",
      "nav.products": "Products",
      "nav.oem": "OEM & ODM",
      "nav.about": "About Us",
      "nav.news": "News",
      "nav.contact": "Contact",
      "cta.quote": "Request a Quote",
      "cta.catalog": "Download Catalog",
      "search.placeholder": "Search by part number or OE number...",
      "lang.comingSoon": "The {lang} version is coming soon. Our team can assist you in English right now.",
      "search.doing": "Parts search is connected to your catalog database once products are imported. Contact us for a quick quote meanwhile.",
    },
    // fr / es / pt / ar / ru: add translated objects here with the same keys.
  },
};

function i18nInit() {
  const saved = localStorage.getItem("pepveri-lang") || I18N.defaultLang;
  applyLang(saved, true);
}

function applyLang(code, silent) {
  const lang = I18N.langs.find(l => l.code === code) || I18N.langs[0];
  document.documentElement.setAttribute("lang", lang.code);
  document.documentElement.setAttribute("dir", lang.dir);
  localStorage.setItem("pepveri-lang", lang.code);

  const strings = I18N.strings[lang.code];
  if (strings) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (strings[key]) el.textContent = strings[key];
    });
  }
  updateLangButtons(lang);
  if (!silent && !lang.available) {
    showToast(t("lang.comingSoon").replace("{lang}", lang.native));
  }
}

function t(key) {
  const code = localStorage.getItem("pepveri-lang") || I18N.defaultLang;
  return (I18N.strings[code] && I18N.strings[code][key]) ||
         (I18N.strings[I18N.defaultLang] && I18N.strings[I18N.defaultLang][key]) || key;
}

function updateLangButtons(current) {
  document.querySelectorAll(".lang-menu button").forEach(btn => {
    const code = btn.getAttribute("data-lang");
    btn.classList.toggle("active", code === current.code);
  });
  const label = document.querySelector(".lang-current");
  if (label) label.textContent = current.code.toUpperCase();
}

function buildLangMenu() {
  const menu = document.querySelector(".lang-menu");
  if (!menu) return;
  menu.innerHTML = I18N.langs.map(l => `
    <button data-lang="${l.code}" ${l.available ? "" : 'data-unavailable="true"'}>
      <span>${l.native}</span>
      <span class="lang-tag">${l.available ? "100%" : "Coming soon"}</span>
    </button>
  `).join("");
  menu.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      applyLang(btn.getAttribute("data-lang"));
      menu.classList.remove("open");
    });
  });
}

let toastTimer;
function showToast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

document.addEventListener("DOMContentLoaded", () => {
  buildLangMenu();
  i18nInit();
  const langBtn = document.querySelector(".lang-btn");
  const menu = document.querySelector(".lang-menu");
  if (langBtn && menu) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", () => menu.classList.remove("open"));
  }
});
