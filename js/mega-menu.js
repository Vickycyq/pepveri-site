/* Pepveri Products mega menu — left category list + right product panel */
(function () {
  if (typeof PRODUCTS_ALL === 'undefined') return;

  var style = document.createElement('style');
  style.textContent =
    '.nav-item-mega { position: relative; }' +
    '.nav-item-mega > a::after { content: "\\25BE"; font-size: 10px; margin-left: 5px; color: #8fa2cf; vertical-align: 1px; }' +
    '.nav-item-mega:hover > a { color: var(--primary, #081F5C); border-bottom-color: var(--primary, #081F5C); }' +
    '.mega { position: absolute; top: 100%; left: 50%; transform: translate(-50%, -6px); width: min(860px, 94vw);' +
      'background: #fff; border: 1px solid #e3e9f4; border-radius: 14px; box-shadow: 0 24px 60px rgba(8,31,92,.16);' +
      'padding: 20px; display: flex; gap: 20px; opacity: 0; visibility: hidden; pointer-events: none;' +
      'transition: .18s; z-index: 100; }' +
    '.mega::before { content: ""; position: absolute; top: -14px; left: 0; right: 0; height: 14px; }' +
    '.nav-item-mega:hover .mega { opacity: 1; visibility: visible; pointer-events: auto; transform: translate(-50%, 0); }' +

    /* left: category list */
    '.mega-side { flex: 0 0 250px; display: flex; flex-direction: column; gap: 6px; border-right: 1px solid #eef2fa; padding-right: 18px; }' +
    '.mega-cat { display: flex; align-items: center; justify-content: space-between; gap: 10px;' +
      'padding: 11px 14px; border-radius: 10px; cursor: pointer; transition: .15s; }' +
    '.mega-cat .t { font-size: 13.5px; font-weight: 600; color: #3d4a66; }' +
    '.mega-cat .n { font-size: 11.5px; font-weight: 600; color: #8fa2cf; background: #f0f4fb; border-radius: 999px; padding: 2px 9px; }' +
    '.mega-cat:hover, .mega-cat.active { background: #f0f4fb; }' +
    '.mega-cat.active .t { color: #081F5C; }' +
    '.mega-cat.active .n { background: #081F5C; color: #fff; }' +
    '.mega-all { margin-top: auto; padding: 11px 14px; font-size: 13px; font-weight: 700; color: #3D6DEB;' +
      'display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #eef2fa; }' +
    '.mega-all:hover { color: #081F5C; }' +

    /* right: product panel */
    '.mega-panel { flex: 1; min-width: 0; }' +
    '.mega-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }' +
    '.mega-panel-head h4 { font-size: 13px; font-weight: 700; color: #081F5C; }' +
    '.mega-viewall { font-size: 12.5px; font-weight: 600; color: #3D6DEB; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }' +
    '.mega-viewall:hover { color: #081F5C; }' +
    '.mega-products { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 18px; }' +
    '.mega-products a { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 400; color: #3d4a66;' +
      'padding: 7px 8px; border-radius: 8px; transition: .15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
    '.mega-products a:hover { background: #f0f4fb; color: #081F5C; font-weight: 600; }' +
    '.mega-products a::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: #b9c7e4; flex: 0 0 auto; }' +
    '@media (max-width: 1024px) { .mega { display: none; } }';
  document.head.appendChild(style);

  var item = document.querySelector('.nav-item-mega');
  if (!item) return;
  var mega = item.querySelector('.mega');
  if (!mega) return;

  var cats = ['Peptide APIs', 'Cosmetic Peptides', 'Common Catalog Peptides', 'Drug Peptide Intermediates'];
  var PREVIEW = 8; // 每个分类最多展示的产品数

  function catProducts(c) {
    return PRODUCTS_ALL.filter(function (p) { return p.category === c; });
  }

  mega.innerHTML =
    '<div class="mega-side">' +
      cats.map(function (c, i) {
        var n = catProducts(c).length;
        return '<div class="mega-cat' + (i === 0 ? ' active' : '') + '" data-cat="' + c + '">' +
          '<span class="t">' + c + '</span><span class="n">' + n + '</span></div>';
      }).join('') +
      '<a class="mega-all" href="products.html">View all products <span>\u2192</span></a>' +
    '</div>' +
    '<div class="mega-panel"><div class="mega-panel-head"><h4></h4>' +
      '<a class="mega-viewall" href="products.html">View all \u2192</a></div>' +
      '<div class="mega-products"></div></div>';

  var side = mega.querySelector('.mega-side');
  var panelTitle = mega.querySelector('.mega-panel-head h4');
  var panelList = mega.querySelector('.mega-products');
  var panelViewAll = mega.querySelector('.mega-viewall');

  function showCat(c) {
    var items = catProducts(c);
    panelTitle.textContent = c;
    panelList.innerHTML = items.slice(0, PREVIEW).map(function (p) {
      return '<a href="product.html?id=' + encodeURIComponent(p.id) + '">' + p.name + '</a>';
    }).join('');
    panelViewAll.href = 'products.html';
    panelViewAll.innerHTML = 'View all ' + items.length + ' \u2192';
  }

  side.addEventListener('mouseover', function (e) {
    var cat = e.target.closest('.mega-cat');
    if (!cat) return;
    side.querySelectorAll('.mega-cat').forEach(function (el) { el.classList.remove('active'); });
    cat.classList.add('active');
    showCat(cat.getAttribute('data-cat'));
  });

  showCat(cats[0]);
})();
