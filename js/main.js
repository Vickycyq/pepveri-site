/* ============================================================
   Pepveri — shared layout (header & footer injected everywhere
   so you edit them in ONE place), plus page interactions.
   ============================================================ */

const PEPVERI = {
  email: "business@pepveri.com",
  phone: "+86 13128275412",
  whatsapp: "85298744501",             // WhatsApp: +852 98744501
  whatsappDisplay: "+852 98744501",
  address: "Shenzhen, Guangdong, China", // TODO: replace with real address
};

const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  burger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  wheel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 17h4V5H2v12h3m5 0h4m0 0h3v-4l-3-4h-4v8"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
};

/* Placeholder image block — replace with <img src="images/xxx.jpg"> later.
   data-ph controls the label shown inside; data-size hints the recommended px size. */
function ph(label, size, variant) {
  return `<div class="ph ${variant || ""}">
    ${ICONS.wheel}
    <span class="ph-label">${label}</span>
    ${size ? `<span class="ph-size">${size}</span>` : ""}
  </div>`;
}

/* ---------- Shared header / footer ---------- */
function currentPage() {
  const f = location.pathname.split("/").pop() || "index.html";
  return f.replace(".html", "") || "index";
}

function renderHeader() {
  const page = currentPage();
  const nav = [
    ["index", "nav.home"],
    ["about", "nav.about"],
  ].map(([p, key]) =>
    `<a href="${p}.html" class="${page === p ? "active" : ""}" data-i18n="${key}">${t(key)}</a>`
  ).join("");

  document.getElementById("site-header").innerHTML = `
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="topbar-left">
        <span class="topbar-item">${ICONS.mail}<a href="mailto:${PEPVERI.email}">${PEPVERI.email}</a></span>
      </div>
      <div class="lang-switch">
        <button class="lang-btn">${ICONS.globe}<span class="lang-current">EN</span>${ICONS.chevron}</button>
        <div class="lang-menu"></div>
      </div>
    </div>
  </div>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img class="logo-img" src="images/logo.jpg" alt="Pepveri — China Auto Spare Part Supply">
        <span class="logo-sub">China Auto Spare Part Supply</span>
      </a>
      <nav class="main-nav" id="mainNav"><ul>${nav}</ul></nav>
      <div class="header-cta">
        <!-- SEARCH HIDDEN per request 2026-11-16 — uncomment to restore
        <button class="search-toggle" id="searchToggle" title="Search parts">${ICONS.search}</button>
        -->
        <a href="about.html#rfq" class="btn btn-primary btn-sm" data-i18n="cta.quote">Request a Quote</a>
        <button class="nav-burger" id="navBurger">${ICONS.burger}</button>
      </div>
    </div>
    <!-- SEARCH PANEL HIDDEN per request 2026-11-16
    <div class="search-panel" id="searchPanel">
      <div class="container search-panel-inner">
        <input type="text" id="siteSearchInput" placeholder="Search by part number or OE number...">
        <button class="btn btn-primary" id="siteSearchGo">${ICONS.search}</button>
      </div>
    </div>
    -->
  </header>`;
}

function renderFooter() {
  document.getElementById("site-footer").innerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">
            <img class="logo-img logo-img--white" src="images/logo-white.png" alt="Pepveri — China Auto Spare Part Supply">
            <span class="logo-sub">China Auto Spare Part Supply</span>
          </a>
          <p>Professional B2B supplier of automotive spare parts. Serving importers, wholesalers, distributors and repair chains.</p>
        </div>
        <!-- PRODUCTS PAGE HIDDEN per request 2026-11-16
        <div class="footer-col">
          <h4>Products</h4>
          <ul>
            <li><a href="products.html#brake">Brake System</a></li>
            <li><a href="products.html#lighting">Lighting &amp; Electrical</a></li>
            <li><a href="products.html#filters">Filters</a></li>
            <li><a href="products.html#suspension">Suspension &amp; Steering</a></li>
            <li><a href="products.html#engine">Engine &amp; Cooling</a></li>
            <li><a href="products.html#body">Body Parts</a></li>
          </ul>
        </div>
        -->
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="about.html#rfq">Request a Quote</a></li>
            <li><a href="about.html#rfq">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul class="footer-contact">
            <li>${ICONS.mail}<span>${PEPVERI.email}</span></li>
            <li>${ICONS.phone}<span>${PEPVERI.phone}</span></li>
            <li>${ICONS.chat}<span>WhatsApp: ${PEPVERI.whatsappDisplay}</span></li>
            <li>${ICONS.pin}<span>${PEPVERI.address}</span></li>
            <li>${ICONS.clock}<span>Mon–Sat: 8:30 – 18:30 (GMT+8)</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} Pepveri Auto Parts. All rights reserved.</span>
        <div class="footer-social">
          <a href="#" title="LinkedIn">${ICONS.globe}</a>
          <a href="#" title="YouTube">${ICONS.chat}</a>
          <a href="#" title="Facebook">${ICONS.globe}</a>
        </div>
      </div>
    </div>
  </footer>
  <a class="wa-float" href="https://wa.me/${PEPVERI.whatsapp}" target="_blank" rel="noopener" title="Chat on WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.87-9.9 9.87zm8.42-18.3A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.85 11.85 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.47-8.41z"/></svg>
  </a>`;
}

/* ---------- Page interactions ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  buildLangMenu();
  i18nInit();

  // Mobile nav
  const burger = document.getElementById("navBurger");
  const nav = document.getElementById("mainNav");
  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // Search panel
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", () => searchPanel.classList.toggle("open"));
    const go = document.getElementById("siteSearchGo");
    const input = document.getElementById("siteSearchInput");
    if (go && input) {
      const doSearch = () => {
        if (input.value.trim()) showToast(t("search.doing"));
      };
      go.addEventListener("click", doSearch);
      input.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
    }
  }

  // RFQ / contact forms (static demo — wire to backend or email service later)
  const form = document.getElementById("rfqForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thank you! Your inquiry has been recorded. Our sales team will reply within 24 hours. For urgent requests, email " + PEPVERI.email);
      form.reset();
    });
  }
});
