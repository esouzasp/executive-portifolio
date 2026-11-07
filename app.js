(function () {
  var D = window.PORTFOLIO;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var state = { modal: null, lang: store.get('lang') || 'en', area: 'all', co: 'all', vf: 'cards', vm: 'list' };

  var FLAG_BR = '<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#009C3B"/><path d="M10 1.6 18.2 7 10 12.4 1.8 7Z" fill="#FFDF00"/><circle cx="10" cy="7" r="3.2" fill="#002776"/><path d="M6.9 6.4c2-.5 4.4-.2 6.1.9" stroke="#fff" stroke-width=".6" fill="none"/></svg>';
  var FLAG_ES = '<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#AA151B"/><rect y="3.5" width="20" height="7" fill="#F1BF00"/><rect x="4.4" y="5.4" width="2.6" height="3.2" rx=".4" fill="#AA151B" opacity=".85"/></svg>';
  var FLAG_US = '<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#fff"/><g fill="#B22234"><rect y="0" width="20" height="1.08"/><rect y="2.15" width="20" height="1.08"/><rect y="4.3" width="20" height="1.08"/><rect y="6.46" width="20" height="1.08"/><rect y="8.62" width="20" height="1.08"/><rect y="10.77" width="20" height="1.08"/><rect y="12.92" width="20" height="1.08"/></g><rect width="8.6" height="7.54" fill="#3C3B6E"/><g fill="#fff"><circle cx="1.6" cy="1.4" r=".45"/><circle cx="4.3" cy="1.4" r=".45"/><circle cx="7" cy="1.4" r=".45"/><circle cx="2.95" cy="2.9" r=".45"/><circle cx="5.65" cy="2.9" r=".45"/><circle cx="1.6" cy="4.4" r=".45"/><circle cx="4.3" cy="4.4" r=".45"/><circle cx="7" cy="4.4" r=".45"/><circle cx="2.95" cy="5.9" r=".45"/><circle cx="5.65" cy="5.9" r=".45"/></g></svg>';

  var T = D.ui;
  var DOMAINS = D.overview.domains, GROUPS = D.overview.groups, SOLUTIONS = D.overview.solutions;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function L(o) { return o[state.lang] != null ? o[state.lang] : o.en; }
  function O(c) { return typeof c.org === 'string' ? c.org : L(c.org); }
  function CT(c) { return c[state.lang] || c.en; }
  function visible() {
    return D.cases.map(function (c, i) { return { c: c, i: i }; }).filter(function (x) {
      return !x.c.hidden && (state.area === 'all' || x.c.a === state.area) && (state.co === 'all' || x.c.co === state.co);
    });
  }
  function caseFromHash() { var m = /^#case-(\d+)$/.exec(location.hash); if (!m) return null; var n = +m[1]; return D.cases[n] && !D.cases[n].hidden ? n : null; }

  var STAR = '<svg class="star" width="12" height="12" viewBox="0 0 24 24" role="img" aria-label="Featured"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="currentColor"/></svg>';
  function tip(c) {
    var t = CT(c);
    return '<div class="tip" role="tooltip"><p class="tip-sum">' + esc(t.s) + '</p>' + starBlock(t) + '</div>';
  }
  function starBlock(t) {
    var k = L(T.star);
    return '<dl class="star-dl"><dt>' + k[0] + '</dt><dd>' + esc(t.cx) + '</dd><dt>' + k[1] + '</dt><dd>' + esc(t.ch) + '</dd>' +
      '<dt>' + k[2] + '</dt><dd>' + esc(t.ap) + '</dd><dt>' + k[3] + '</dt><dd><ul>' +
      t.r.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></dd></dl>';
  }
  function modal() {
    if (state.modal == null || !D.cases[state.modal]) return '';
    var c = D.cases[state.modal], t = CT(c);
    return '<div class="overlay" data-overlay><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<button type="button" class="modal-close" data-close aria-label="' + L(T.close) + '"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<p class="modal-meta">' + (c.featured ? STAR : '') + '<span class="area">' + esc(L(D.areas[c.a])) + '</span> | ' + esc(O(c)) + (c.y ? ' · ' + esc(c.y) : '') + '</p>' +
      '<h2 id="modal-title">' + esc(t.t) + '</h2><p class="modal-sum">' + esc(t.s) + '</p>' +
      (t.m ? '<p class="modal-metric"><strong>' + esc(t.m) + '</strong>' + esc(t.ml) + '</p>' : '') +
      starBlock(t) + '<p class="tags modal-tags">' + t.tg.map(function (g) { return '<span class="tag">' + esc(g) + '</span>'; }).join('') + '</p></div></div>';
  }
  function card(x) {
    var c = x.c, t = CT(c);
    return '<article class="case hv" tabindex="0" role="button" aria-haspopup="dialog" data-modal="' + x.i + '">' +
      '<p class="meta">' + (c.featured ? STAR : '') + '<span class="area">' + esc(L(D.areas[c.a])) + '</span> | ' + esc(O(c)) + '</p>' +
      '<h3>' + esc(t.t) + '</h3><p class="sum">' + esc(t.s) + '</p>' +
      '<p class="res">' + (t.m ? '<strong>' + esc(t.m) + '</strong> ' + esc(t.ml) : esc(t.r[0])) + '</p>' +
      '<p class="tags">' + t.tg.map(function (g) { return '<span class="tag">' + esc(g) + '</span>'; }).join('') + '</p></article>';
  }
  var ICON_CARDS = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  var ICON_LIST = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>';
  function viewToggle(key) {
    var cur = state[key];
    return '<div class="view" role="group" aria-label="' + L(T.view) + '">' +
      '<button type="button" data-view="' + key + '|cards" aria-pressed="' + (cur === 'cards') + '">' + ICON_CARDS + L(T.cards) + '</button>' +
      '<button type="button" data-view="' + key + '|list" aria-pressed="' + (cur === 'list') + '">' + ICON_LIST + L(T.list) + '</button></div>';
  }
  function row(x) {
    var c = x.c, t = CT(c);
    return '<div class="row hv" role="row" tabindex="0"><span role="cell" class="c-title">' + (c.featured ? STAR : '') + esc(t.t) + '</span>' +
      '<span role="cell" class="c-area">' + esc(L(D.areas[c.a])) + '</span><span role="cell" class="c-org">' + esc(O(c)) + '</span>' +
      '<span role="cell" class="c-res">' + (t.m ? '<strong>' + esc(t.m) + '</strong>' + esc(t.ml) : esc(t.r[0])) + '</span>' +
      '<span role="cell" class="c-tags">' + t.tg.map(function (g) { return '<span class="tag">' + esc(g) + '</span>'; }).join('') + '</span>' + tip(c) + '</div>';
  }
  function grid(list, mode) {
    if (mode === 'list') {
      var h = L(T.cols);
      return '<div class="rows" role="table"><div class="row head" role="row">' + h.map(function (x) { return '<span role="columnheader">' + x + '</span>'; }).join('') + '</div>' +
        list.map(row).join('') + '</div>';
    }
    return '<div class="cases">' + list.map(card).join('') + '</div>';
  }
  function casesBlock(vis) {
    if (state.area !== 'all' || state.co !== 'all') return '<div class="subrow"><span></span>' + viewToggle('vm') + '</div>' + grid(vis, state.vm);
    var feat = vis.filter(function (x) { return x.c.featured; }).sort(function (a, b) { return a.c.featured - b.c.featured; });
    var more = vis.filter(function (x) { return !x.c.featured; });
    return '<div class="subrow"><h3 class="subhead">' + STAR + L(T.featured) + '</h3>' + viewToggle('vf') + '</div>' + grid(feat, state.vf) +
      '<div class="subrow"><h3 class="subhead">' + L(T.more) + '</h3>' + viewToggle('vm') + '</div>' + grid(more, state.vm);
  }
  function header(home) {
    var n = L(T.nav), base = home ? '' : '#';
    return '<header class="top"><div class="wrap bar">' +
      (home ? '<nav class="nav" aria-label="Main"><a href="#overview">' + n[0] + '</a><a href="#solutions">' + n[1] + '</a><a href="#stack">' + n[2] + '</a><a href="#portfolio">' + n[3] + '</a><a href="#contact">' + n[4] + '</a></nav>'
            : '<a class="backlink" href="#portfolio" data-back>← ' + L(T.back) + '</a>') + '</div></header>';
  }
  function masthead(home, eyebrow, title, width) {
    return '<div class="masthead" id="masthead">' + header(home) +
      '<div class="mast"><div class="' + width + '"><p class="eyebrow">' + eyebrow + '</p>' +
      '<div class="name-row"><h1>' + title + '</h1>' + langToggle() + '</div></div></div></div>';
  }
  function langToggle() {
    return '<div class="lang" role="group" aria-label="Language / Idioma">' +
      '<button type="button" data-lang="pt" aria-pressed="' + (state.lang === 'pt') + '" aria-label="Português">PT ' + FLAG_BR + '</button>' +
      '<button type="button" data-lang="en" aria-pressed="' + (state.lang === 'en') + '" aria-label="English">EN ' + FLAG_US + '</button>' +
      '<button type="button" data-lang="es" aria-pressed="' + (state.lang === 'es') + '" aria-label="Español">ES ' + FLAG_ES + '</button></div>';
  }

  function home() {
    var h = '';
    h += masthead(true, L(T.eyebrow), 'Everton Teixeira de Souza', 'wrap');
    h += '<section id="top" class="hero"><div class="wrap">' +
      '<p class="lead">' + L(T.summary) + '</p>' +
      '<div class="ctas"><a class="btn primary" href="#portfolio">' + L(T.cta)[0] + '</a><a class="btn ghost" href="#contact">' + L(T.cta)[1] + '</a></div>' +
      '<div class="stats">' + ['20+', '10+', '20+', '100+'].map(function (v, k) { return '<div><strong>' + v + '</strong><span>' + L(T.stats)[k] + '</span></div>'; }).join('') + '</div></div></section>';

    h += '<section id="overview" class="block first"><div class="wrap"><div class="head"><p class="eyebrow">' + L(T.s1)[0] + '</p><h2>' + L(T.s1)[1] + '</h2></div><div class="grid5">';
    h += '<div class="card"><h3>' + L(T.domains) + '</h3>' + DOMAINS.map(function (d) {
      return '<div class="dom"><span>' + esc(L(d)) + '</span><span class="bars" role="img" aria-label="' + d.l + (state.lang === 'en' ? ' of 3' : ' de 3') + '"><i class="on"></i><i class="' + (d.l >= 2 ? 'on' : '') + '"></i><i class="' + (d.l >= 3 ? 'on' : '') + '"></i></span></div>';
    }).join('') + '</div>';
    h += GROUPS.map(function (g) { return '<div class="card"><h3>' + esc(L(g.t)) + '</h3><ul>' + L(g).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'; }).join('');
    h += '</div><p class="legend"><span class="bars" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></span>' + L(T.legend) + '</p></div></section>';

    h += '<section id="solutions" class="block"><div class="wrap"><div class="head"><p class="eyebrow">' + L(T.s2)[0] + '</p><h2>' + L(T.s2)[1] + '</h2></div><div class="grid5">' +
      SOLUTIONS.map(function (s) { return '<div class="sol"><h3>' + esc(L(s.t)) + '</h3><div class="chips">' + L(s).map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div></div>'; }).join('') +
      '</div></div></section>';

    h += '<section id="stack" class="block"><div class="wrap"><div class="head"><p class="eyebrow">' + L(T.sT)[0] + '</p><h2>' + L(T.sT)[1] + '</h2></div><div class="pillars">' +
      D.overview.stack.map(function (g) { return '<div class="pillar"><h3>' + esc(L(g.t)) + '</h3><p>' + g.i.map(esc).join(' · ') + '</p></div>'; }).join('') +
      '</div></div></section>';
    var vis = visible();
    var allOn = state.area === 'all' && state.co === 'all';
    var pills = '<button type="button" class="pill" data-all aria-pressed="' + allOn + '">' + L(T.all) + '</button>' +
      Object.keys(D.areas).map(function (k) { return '<button type="button" class="pill pa" data-area="' + k + '" aria-pressed="' + (state.area === k) + '">' + esc(L(D.areas[k])) + '</button>'; }).join('') +
      Object.keys(D.companies).map(function (k) { return '<button type="button" class="pill pc" data-co="' + k + '" aria-pressed="' + (state.co === k) + '">' + esc(L(D.companies[k])) + '</button>'; }).join('');
    h += '<section id="portfolio" class="block last"><div class="wrap"><div class="port-head"><div class="head"><p class="eyebrow">' + L(T.s3)[0] + '</p><h2>' + L(T.s3)[1] + '</h2></div>' +
      '<p class="count" aria-live="polite">' + vis.length + L(T.count) + '</p></div>' +
      '<div class="filters"><div class="frow" role="group" aria-label="' + L(T.filter) + '">' + pills + '</div>' +
      '<p class="fkey"><span class="k-a"></span>' + L(T.byArea) + '<span class="k-c"></span>' + L(T.byCo) + '</p></div>' +
      casesBlock(vis) + '</div></section>';
    h += footer();
    h += modal();
    return h;
  }

  function footer() {
    return '<footer id="contact" class="contact"><div class="wrap"><div><h2>' + L(T.foot)[0] + '</h2><p>' + L(T.foot)[1] + '</p></div>' +
      '<div class="ctas"><span class="btn ghost plain">isouzae@gmail.com</span>' +
      '<a class="btn primary" href="https://wa.me/5519981608088" target="_blank" rel="noopener">WhatsApp +55 19 98160-8088</a>' +
      '<a class="btn ghost" href="https://esouzasp.github.io/executive-portifolio/">' + L(T.github) + '</a>' +
      '<a class="btn ghost" href="https://www.linkedin.com/">LinkedIn</a></div></div></footer>';
  }

  function detail(n) {
    var c = D.cases[n], t = CT(c), k = L(T.k), cx = L(T.cxa);
    var vis = visible().map(function (x) { return x.i; });
    var pos = vis.indexOf(n); if (pos < 0) { vis = D.cases.map(function (_, i) { return i; }); pos = n; }
    var prev = vis[(pos - 1 + vis.length) % vis.length], next = vis[(pos + 1) % vis.length];
    var h = masthead(false, esc(L(D.areas[c.a])), esc(t.t), 'narrow');
    h += '<section id="top" class="hero"><div class="narrow">' +
      '<p class="lead">' + esc(t.s) + '</p>' +
      '<div class="dtags">' + t.tg.map(function (g) { return '<span>' + esc(g) + '</span>'; }).join('') + '</div>' +
      '<div class="stats"><div><span class="k">' + k[0] + '</span><span class="v">' + esc(O(c)) + '</span></div><div><span class="k">' + k[1] + '</span><span class="v">' + esc(c.y || '—') + '</span></div><div><span class="k">' + k[2] + '</span><span class="v">' + esc(L(D.areas[c.a])) + '</span></div></div></div></section>';
    h += '<main class="detail"><div class="narrow"><div class="cxa">' +
      [t.cx, t.ch, t.ap].map(function (p, j) { return '<div class="card"><h2>' + cx[j] + '</h2><p>' + esc(p) + '</p></div>'; }).join('') + '</div>' +
      '<section class="results"><h2 class="display" style="font-size:26px">' + L(T.results) + '</h2><div class="rgrid">' +
      (t.m ? '<div class="big"><strong>' + esc(t.m) + '</strong><span>' + esc(t.ml) + '</span></div>' : '') +
      '<ul class="rlist">' + t.r.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div></section>' +
      '<div class="pager"><a class="btn outline" href="#case-' + prev + '">' + L(T.prev) + '</a><a class="btn dark" href="#case-' + next + '">' + L(T.next) + '</a></div></div></main>';
    h += footer();
    return h;
  }

  var app = document.getElementById('app');
  function render(scrollTop) {
    document.documentElement.lang = { pt: 'pt-BR', es: 'es', en: 'en' }[state.lang] || 'en';
    var n = caseFromHash();
    app.innerHTML = n === null ? home() : detail(n);
    document.title = (n === null ? 'Everton Teixeira de Souza — ' + L(T.eyebrow) : CT(D.cases[n]).t + ' — Everton Teixeira de Souza');
    if (scrollTop) window.scrollTo(0, 0);
    onScroll();
  }
  function onScroll() {
    var m = document.getElementById('masthead');
    if (m) m.classList.toggle('shrink', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function openModal(n) { state.modal = n; render(false); document.body.style.overflow = 'hidden'; var x = app.querySelector('.modal-close'); if (x) x.focus(); }
  function closeModal() { var n = state.modal; state.modal = null; document.body.style.overflow = ''; render(false); var el = app.querySelector('[data-modal="' + n + '"]'); if (el) el.focus(); }
  document.addEventListener('keydown', function (e) {
    if (state.modal != null && e.key === 'Escape') { closeModal(); return; }
    var c = e.target.closest && e.target.closest('[data-modal]');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(+c.getAttribute('data-modal')); }
  });
  app.addEventListener('click', function (e) {
    if (state.modal != null) { if (e.target.closest('[data-close]') || e.target.hasAttribute('data-overlay')) closeModal(); return; }
    var m = e.target.closest('[data-modal]'); if (m) { openModal(+m.getAttribute('data-modal')); return; }
    var b = e.target.closest('[data-lang],[data-all],[data-area],[data-co],[data-view],[data-open],[data-back]');
    if (!b) return;
    if (b.hasAttribute('data-lang')) { state.lang = b.getAttribute('data-lang'); store.set('lang', state.lang); render(false); }
    else if (b.hasAttribute('data-all')) { state.area = 'all'; state.co = 'all'; render(false); }
    else if (b.hasAttribute('data-area')) { state.area = b.getAttribute('data-area'); state.co = 'all'; render(false); }
    else if (b.hasAttribute('data-co')) { state.co = b.getAttribute('data-co'); state.area = 'all'; render(false); }
    else if (b.hasAttribute('data-view')) { var v = b.getAttribute('data-view').split('|'); state[v[0]] = v[1]; render(false); }
    else if (b.hasAttribute('data-open')) { location.hash = 'case-' + b.getAttribute('data-open'); }
    else if (b.hasAttribute('data-back')) { e.preventDefault(); history.pushState(null, '', location.pathname); render(false); var p = document.getElementById('portfolio'); if (p) p.scrollIntoView(); }
  });
  window.addEventListener('hashchange', function () {
    var n = caseFromHash();
    if (n !== null) { render(true); return; }
    if (!document.getElementById('overview')) { render(false); var id = location.hash.slice(1); var el = id && document.getElementById(id); if (el) el.scrollIntoView(); }
  });
  render(false);
})();
