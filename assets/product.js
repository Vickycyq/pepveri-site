/* PepVeri product detail page — data-driven renderer + per-product SEO tags */
(function () {
  'use strict';

  var SITE = 'https://pepveri.com/';
  var root = document.getElementById('pdRoot');
  var qs = new URLSearchParams(location.search);
  var slug = qs.get('p');

  var CHK = '<svg viewBox="0 0 24 24"><path d="m5 12.6 4.6 4.6L19 7.4"/></svg>';
  var DOC = '<svg viewBox="0 0 24 24"><path d="M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5z"/><path d="M13.5 3.5v5h5"/></svg>';
  var FLASK = '<svg viewBox="0 0 24 24"><path d="M9.3 3h5.4M10.4 3v6L5.7 17.6A2.4 2.4 0 0 0 7.8 21h8.4a2.4 2.4 0 0 0 2.1-3.4L13.6 9V3"/><path d="M8 15.4h8"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------------------------------------------------------------- SEO tags */
  function meta(attr, key, content) {
    if (!content) return;
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function link(rel, href) {
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  function applySeo(r) {
    var url = SITE + 'product.html?p=' + encodeURIComponent(r.slug);
    document.title = r.seoTitle;
    meta('name', 'description', r.seoDesc);
    meta('name', 'robots', 'index,follow');
    meta('property', 'og:type', 'product');
    meta('property', 'og:site_name', 'PepVeri');
    meta('property', 'og:title', r.seoTitle);
    meta('property', 'og:description', r.seoDesc);
    meta('property', 'og:url', url);
    meta('property', 'og:image', SITE + 'assets/icon-512.png');
    meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:title', r.seoTitle);
    meta('name', 'twitter:description', r.seoDesc);
    link('canonical', url);

    var crumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Products', item: SITE + 'products.html' },
        { '@type': 'ListItem', position: 3, name: r.lineLabel, item: SITE + 'products.html#' + r.line },
        { '@type': 'ListItem', position: 4, name: r.subLabel, item: SITE + 'products.html?sub=' + r.sub + '#' + r.line },
        { '@type': 'ListItem', position: 5, name: r.name, item: url }
      ]
    };
    var product = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: r.name,
      sku: r.ref,
      mpn: r.ref,
      url: url,
      category: r.lineLabel + ' > ' + r.subLabel,
      description: r.short || (r.overview || []).join(' ').slice(0, 320),
      brand: { '@type': 'Brand', name: 'PepVeri' },
      additionalProperty: []
    };
    if (r.cas) product.additionalProperty.push({ '@type': 'PropertyValue', name: 'CAS no.', value: r.cas });
    if (r.purity) product.additionalProperty.push({ '@type': 'PropertyValue', name: 'Purity', value: r.purity });
    if (r.formula) product.additionalProperty.push({ '@type': 'PropertyValue', name: 'Molecular formula', value: r.formula });
    if (r.seq) product.additionalProperty.push({ '@type': 'PropertyValue', name: 'Sequence', value: r.seq });

    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify([product, crumbs]);
    document.head.appendChild(ld);
  }

  /* ----------------------------------------------------------------- render */
  function fileCopy(t) {
    return String(t || '').split(/(?<=\.)\s+(?=[A-Z])/).filter(function (x) { return x.trim(); });
  }

  function render(p) {
    var packs = p.packs || ['1 mg', '5 mg', '10 mg', '25 mg', '100 mg'];
    var quote = 'inquiry.html?n=' + encodeURIComponent(p.name) + '&p=' + encodeURIComponent(p.ref);
    var aliases = (p.aliases || '').replace(/\s*;\s*/g, ' · ');
    var cas = p.cas || 'Not assigned';

    var head = ''
      + '<div class="v2-head">'
      +   '<div class="v2-tags">'
      +     '<span class="v2-tag line">' + esc(p.lineLabel) + '</span>'
      +     '<span class="v2-tag">' + esc(p.subLabel) + '</span>'
      +     (p.grade ? '<span class="v2-tag grade">' + esc(p.grade) + '</span>' : '')
      +     '<span class="v2-tag">' + esc(p.ref) + '</span>'
      +   '</div>'
      +   '<h1 class="v2-h1">' + esc(p.name) + '</h1>'
      +   (aliases ? '<p class="v2-alias"><b>Also known as</b> ' + esc(aliases) + '</p>' : '')
      +   '<div class="v2-hero" id="sequence">'
      +     '<div class="v2-seq"><span class="lbl">Sequence · one-letter code</span>'
      +       '<code id="v2seq">' + esc(p.seq) + '</code>'
      +       '<button class="cta" id="v2copy" type="button">Copy</button>'
      +     '</div>'
      +     '<div class="v2-mol">'
      +       '<div><span>Catalog no.</span><b>' + esc(p.ref) + '</b></div>'
      +       '<div><span>CAS no.</span><b>' + esc(cas) + '</b></div>'
      +       '<div><span>Purity</span><b>' + esc(p.purity) + '</b></div>'
      +       '<div><span>Molecular weight</span><b>' + (p.mw ? esc(p.mw) : '—') + '</b></div>'
      +       '<div><span>Molecular formula</span><b>' + esc(p.formula || '—') + '</b></div>'
      +       '<div class="txt"><span>Modification</span><b>' + esc(p.mods || '—') + '</b></div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="v2-jump">'
      +     '<a href="#overview">Overview</a>'
      +     '<a href="#specs">Specifications</a>'
      +     '<a href="#applications">Applications</a>'
      +     '<a href="#docs">Documentation</a>'
      +     '<a href="#related">Related peptides</a>'
      +   '</div>'
      + '</div>';

    var overview = '<section class="v2-sec" id="overview"><h2>Product overview</h2>'
      + (p.overview || []).map(function (x) { return '<p class="v2-p">' + esc(x) + '</p>'; }).join('')
      + '</section>';

    function row(k, v) {
      return v ? '<div class="row"><dt>' + k + '</dt><dd>' + esc(v) + '</dd></div>' : '';
    }
    var spec = ''
      + '<section class="v2-sec" id="specs"><h2>Specifications</h2>'
      +   '<dl class="v2-spec">'
      +     '<div class="sgroup"><div class="ghead">Identity</div><div class="rows">'
      +       row('INCI name', p.inci)
      +       row('Grade', p.grade)
      +       row('Appearance', p.appearance)
      +     '</div></div>'
      +     '<div class="sgroup"><div class="ghead">Handling &amp; storage</div><div class="rows">'
      +       row('Solubility', p.solubility)
      +       row('Storage', p.storage)
      +       row('Shelf life', p.shelf)
      +       row('Format', p.format)
      +     '</div></div>'
      +     '<div class="sgroup"><div class="ghead">Supply</div><div class="rows">'
      +       row('Pack sizes', packs.join(' · '))
      +       row('MOQ &amp; lead time', p.moq)
      +       row('Documentation', 'CoA (HPLC, LC-MS) + SDS')
      +       row('Use', 'Research use only (RUO)')
      +     '</div></div>'
      +   '</dl>'
      + '</section>';

    var apps = (p.apps || []).length
      ? '<section class="v2-sec" id="applications"><h2>Typical applications</h2><ul class="v2-apps">'
        + p.apps.map(function (a) { return '<li>' + CHK + esc(a) + '</li>'; }).join('')
        + '</ul></section>'
      : '';

    var sents = fileCopy(p.docs);
    var doc1 = sents[0] || 'CoA (HPLC purity, MS identity) and SDS.';
    var doc2 = sents.slice(1).join(' ') || 'Custom synthesis, scale-up and conjugation available on request.';
    var docs = '<section class="v2-sec" id="docs"><h2>Documentation &amp; services</h2><div class="v2-docs">'
      + '<div class="v2-doc"><span class="di">' + DOC + '</span><div><b>Ships with every order</b><p>' + esc(doc1) + '</p></div></div>'
      + '<div class="v2-doc"><span class="di">' + FLASK + '</span><div><b>Available on request</b><p>' + esc(doc2) + '</p></div></div>'
      + '</div></section>';

    var rel = (p.related || []).slice(0, 6);
    var related = rel.length
      ? '<section class="v2-sec" id="related"><h2>Related peptides</h2><div class="v2-rel">'
        + rel.map(function (x) {
            var badge = ['Control pair', 'Same family', 'Same target'].indexOf(x.reason) >= 0
              ? '<span class="bd">' + esc(x.reason) + '</span>' : '';
            return '<a class="v2-rc" href="product.html?p=' + encodeURIComponent(x.slug) + '">'
              + badge + '<b>' + esc(x.name) + '</b>'
              + '<span class="m">' + esc(x.ref) + ' · ' + esc(x.purity) + (x.target ? ' · ' + esc(x.target) : '') + '</span></a>';
          }).join('')
        + '</div></section>'
      : '';

    var comp = '<section class="v2-sec" id="compliance"><h2>Safety &amp; compliance</h2>'
      + '<div class="v2-compliance"><b>Research use only</b>' + esc(p.safety) + '</div>'
      + (p.note ? '<p class="v2-fine">' + esc(p.note) + '</p>' : '')
      + '</section>';

    var side = ''
      + '<aside class="pd-side">'
      +   '<div class="scard dark">'
      +     '<span class="slab">Catalog price</span>'
      +     '<span class="big">Quoted per batch</span>'
      +     '<p>Pricing depends on pack size and current stock. Send the reference and we reply with a firm quote within one business day.</p>'
      +     '<a class="btn btn-primary" href="' + quote + '">Request a Quote</a>'
      +     '<a class="btn btn-outline" href="' + quote + '&doc=1">Request CoA sample</a>'
      +     '<ul class="sfacts">'
      +       '<li>' + CHK + 'HPLC &amp; MS data on every batch</li>'
      +       '<li>' + CHK + 'Cold-chain delivery worldwide</li>'
      +       '<li>' + CHK + 'NDA available before you share details</li>'
      +     '</ul>'
      +   '</div>'
      +   '<div class="scard">'
      +     '<span class="slab">Available packs</span>'
      +     '<div class="packs">' + packs.map(function (x) { return '<span class="pack">' + esc(x) + '</span>'; }).join('') + '</div>'
      +     '<div class="v2-moq"><span>MOQ &amp; lead time</span><b>' + esc(p.moq) + '</b></div>'
      +     '<p class="v2-fine">Bulk and custom pack sizes on request.</p>'
      +     '<ul class="contact-list">'
      +       '<li><svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.6 6.6 8.4 6 8.4-6"/></svg>'
      +         '<a href="mailto:business@pepveri.com">business@pepveri.com</a></li>'
      +       '<li><svg viewBox="0 0 24 24"><path d="M20.4 11.7a8.4 8.4 0 0 1-12.3 7.4L3.6 20.4l1.3-4.4a8.4 8.4 0 1 1 15.5-4.3z"/></svg>'
      +         '<a href="https://wa.me/85298744510" target="_blank" rel="noopener">WhatsApp +852 98744510</a></li>'
      +     '</ul>'
      +     '<a class="btn btn-outline" href="products.html?sub=' + encodeURIComponent(p.sub) + '#' + p.line + '" '
      +       'style="width:100%;justify-content:center;font-size:13.5px;padding:11px 18px">Back to ' + esc(p.subLabel) + '</a>'
      +   '</div>'
      + '</aside>';

    document.getElementById('crumbRest').innerHTML =
        '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>'
      + '<a href="products.html#' + p.line + '">' + esc(p.lineLabel) + '</a>'
      + '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>'
      + '<a href="products.html?sub=' + encodeURIComponent(p.sub) + '#' + p.line + '">' + esc(p.subLabel) + '</a>'
      + '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>'
      + '<span class="here">' + esc(p.name) + '</span>';

    root.className = '';
    root.innerHTML = '<div class="pd-grid"><div class="pd-main">'
      + head + overview + spec + apps + docs + related + comp
      + '</div>' + side + '</div>';

    applySeo(p);

    var btn = document.getElementById('v2copy');
    if (btn) {
      btn.addEventListener('click', function () {
        var t = document.getElementById('v2seq').textContent;
        var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done);
        else done();
      });
    }
  }

  function notFound() {
    document.title = 'Product not found | PepVeri';
    meta('name', 'robots', 'noindex,follow');
    root.className = 'pd-missing';
    root.innerHTML = '<h1>That catalog item moved</h1>'
      + '<p>The product reference in this link is not in the current catalog. Browse the full list or send us the sequence.</p>'
      + '<a class="btn btn-primary" href="products.html">Back to the catalog</a>';
  }

  /* --------------------------------------------------------------- bootstrap */
  if (!slug || !window.PEP_LINE || !window.PEP_LINE[slug]) {
    notFound();
    return;
  }

  var s = document.createElement('script');
  s.src = 'assets/data/details/' + window.PEP_LINE[slug] + '.js';
  s.onload = function () {
    var rec = (window.PEP_DETAILS || {})[slug];
    if (rec) render(rec);
    else notFound();
  };
  s.onerror = notFound;
  document.head.appendChild(s);
})();
