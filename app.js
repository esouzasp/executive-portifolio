(function () {
  var D = window.PORTFOLIO;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var state = { lang: store.get('lang') || 'en', area: 'all', co: 'all', vf: 'cards', vm: 'list' };

  var FLAG_BR = '<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#009C3B"/><path d="M10 1.6 18.2 7 10 12.4 1.8 7Z" fill="#FFDF00"/><circle cx="10" cy="7" r="3.2" fill="#002776"/><path d="M6.9 6.4c2-.5 4.4-.2 6.1.9" stroke="#fff" stroke-width=".6" fill="none"/></svg>';
  var FLAG_US = '<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#fff"/><g fill="#B22234"><rect y="0" width="20" height="1.08"/><rect y="2.15" width="20" height="1.08"/><rect y="4.3" width="20" height="1.08"/><rect y="6.46" width="20" height="1.08"/><rect y="8.62" width="20" height="1.08"/><rect y="10.77" width="20" height="1.08"/><rect y="12.92" width="20" height="1.08"/></g><rect width="8.6" height="7.54" fill="#3C3B6E"/><g fill="#fff"><circle cx="1.6" cy="1.4" r=".45"/><circle cx="4.3" cy="1.4" r=".45"/><circle cx="7" cy="1.4" r=".45"/><circle cx="2.95" cy="2.9" r=".45"/><circle cx="5.65" cy="2.9" r=".45"/><circle cx="1.6" cy="4.4" r=".45"/><circle cx="4.3" cy="4.4" r=".45"/><circle cx="7" cy="4.4" r=".45"/><circle cx="2.95" cy="5.9" r=".45"/><circle cx="5.65" cy="5.9" r=".45"/></g></svg>';

  var T = {
    nav: { en: ['Overview', 'Solutions', 'Portfolio', 'Contact'], pt: ['Visão geral', 'Soluções', 'Portfólio', 'Contato'] },
    eyebrow: { en: 'Executive Transformation Portfolio', pt: 'Portfólio Executivo de Transformação' },
    summary: {
      en: 'Senior transformation leader with 20+ years of experience connecting business strategy, operations, data and technology across retail, manufacturing, logistics and supply chain environments. This portfolio presents selected programs in AI, analytics, enterprise platforms, planning, optimization and governance, delivering measurable operational and business outcomes at scale.',
      pt: 'Líder sênior de transformação com mais de 20 anos de experiência conectando estratégia de negócio, operações, dados e tecnologia em ambientes de varejo, manufatura, logística e supply chain. Este portfólio apresenta programas selecionados em IA, analytics, plataformas corporativas, planejamento, otimização e governança, com resultados operacionais e de negócio mensuráveis em escala.'
    },
    cta: { en: ['View portfolio', 'Get in touch'], pt: ['Ver portfólio', 'Fale comigo'] },
    stats: { en: ['Years of experience', 'Industries', 'Enterprise clients', 'Programs & projects'], pt: ['Anos de experiência', 'Indústrias', 'Clientes enterprise', 'Programas e projetos'] },
    s1: { en: ['01 — Executive Overview', 'Where I create value'], pt: ['01 — Visão Executiva', 'Onde gero valor'] },
    domains: { en: 'Functional domains', pt: 'Domínios funcionais' },
    legend: { en: 'Depth of expertise — three bars = core specialty', pt: 'Profundidade de expertise — três barras = especialidade principal' },
    s2: { en: ['02 — Representative Solutions', 'What I have built and led'], pt: ['02 — Soluções Representativas', 'O que construí e liderei'] },
    s3: { en: ['03 — Portfolio Projects', 'Selected cases'], pt: ['03 — Projetos do Portfólio', 'Cases selecionados'] },
    all: { en: 'All', pt: 'Todos' }, byArea: { en: 'Area', pt: 'Área' }, byCo: { en: 'Company', pt: 'Empresa' },
    count: { en: ' cases', pt: ' cases' }, featured: { en: 'Featured Cases', pt: 'Cases em destaque' }, more: { en: 'More Cases', pt: 'Mais cases' }, view: { en: 'View', pt: 'Visualização' }, cards: { en: 'Cards', pt: 'Caixas' }, list: { en: 'List', pt: 'Lista' },
    cols: { en: ['Case', 'Area', 'Company', 'Result', 'Tags'], pt: ['Case', 'Área', 'Empresa', 'Resultado', 'Tags'] },
    star: { en: ['Situation', 'Task', 'Action', 'Result'], pt: ['Situação', 'Tarefa', 'Ação', 'Resultado'] }, open: { en: 'View case', pt: 'Ver case' },
    back: { en: 'Back to portfolio', pt: 'Voltar ao portfólio' },
    k: { en: ['Company / Client', 'Year', 'Area'], pt: ['Empresa / Cliente', 'Ano', 'Área'] },
    cxa: { en: ['Context', 'Challenge', 'Approach'], pt: ['Contexto', 'Desafio', 'Abordagem'] },
    results: { en: 'Results', pt: 'Resultados' },
    prev: { en: '← Previous case', pt: '← Case anterior' }, next: { en: 'Next case →', pt: 'Próximo case →' },
    foot: { en: ["Let's talk transformation.", 'São Paulo, Brazil · Open to conversations on data, AI and supply chain leadership.'],
            pt: ['Vamos conversar sobre transformação.', 'São Paulo, Brasil · Aberto a conversas sobre liderança em dados, IA e supply chain.'] }
  };
  var DOMAINS = D.overview.domains, GROUPS = D.overview.groups, SOLUTIONS = D.overview.solutions;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function L(o) { return o[state.lang]; }
  function O(c) { return typeof c.org === 'string' ? c.org : c.org[state.lang]; }
  function idx() { return state.lang === 'pt' ? 1 : 0; }
  function visible() {
    return D.cases.map(function (c, i) { return { c: c, i: i }; }).filter(function (x) {
      return !x.c.hidden && (state.area === 'all' || x.c.a === state.area) && (state.co === 'all' || x.c.co === state.co);
    });
  }
  function caseFromHash() { var m = /^#case-(\d+)$/.exec(location.hash); if (!m) return null; var n = +m[1]; return D.cases[n] && !D.cases[n].hidden ? n : null; }

  var STAR = '<svg class="star" width="12" height="12" viewBox="0 0 24 24" role="img" aria-label="Featured"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="currentColor"/></svg>';
  function tip(c) {
    var t = c[state.lang], k = L(T.star);
    return '<div class="tip" role="tooltip"><p class="tip-sum">' + esc(t.s) + '</p><dl>' +
      '<dt>' + k[0] + '</dt><dd>' + esc(t.cx) + '</dd><dt>' + k[1] + '</dt><dd>' + esc(t.ch) + '</dd>' +
      '<dt>' + k[2] + '</dt><dd>' + esc(t.ap) + '</dd><dt>' + k[3] + '</dt><dd><ul>' +
      t.r.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></dd></dl></div>';
  }
  function card(x) {
    var c = x.c, t = c[state.lang];
    return '<article class="case hv" tabindex="0">' +
      '<p class="meta">' + (c.featured ? STAR : '') + '<span class="area">' + esc(L(D.areas[c.a])) + '</span> | ' + esc(O(c)) + '</p>' +
      '<h3>' + esc(t.t) + '</h3><p class="sum">' + esc(t.s) + '</p>' +
      '<p class="res">' + (t.m ? '<strong>' + esc(t.m) + '</strong> ' + esc(t.ml) : esc(t.r[0])) + '</p>' +
      '<p class="tags">' + t.tg.map(function (g) { return '<span class="tag">' + esc(g) + '</span>'; }).join('') + '</p>' + tip(c) + '</article>';
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
    var c = x.c, t = c[state.lang];
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
      (home ? '<nav class="nav" aria-label="Main"><a href="#overview">' + n[0] + '</a><a href="#solutions">' + n[1] + '</a><a href="#portfolio">' + n[2] + '</a><a href="#contact">' + n[3] + '</a></nav>'
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
      '<button type="button" data-lang="en" aria-pressed="' + (state.lang === 'en') + '" aria-label="English">EN ' + FLAG_US + '</button></div>';
  }

  function home() {
    var i = idx(), h = '';
    h += masthead(true, L(T.eyebrow), 'Everton Teixeira de Souza', 'wrap');
    h += '<section id="top" class="hero"><div class="wrap">' +
      '<p class="lead">' + L(T.summary) + '</p>' +
      '<div class="ctas"><a class="btn primary" href="#portfolio">' + L(T.cta)[0] + '</a><a class="btn ghost" href="#contact">' + L(T.cta)[1] + '</a></div>' +
      '<div class="stats">' + ['20+', '10+', '20+', '100+'].map(function (v, k) { return '<div><strong>' + v + '</strong><span>' + L(T.stats)[k] + '</span></div>'; }).join('') + '</div></div></section>';

    h += '<section id="overview" class="block first"><div class="wrap"><div class="head"><p class="eyebrow">' + L(T.s1)[0] + '</p><h2>' + L(T.s1)[1] + '</h2></div><div class="grid5">';
    h += '<div class="card"><h3>' + L(T.domains) + '</h3>' + DOMAINS.map(function (d) {
      return '<div class="dom"><span>' + esc(d[i]) + '</span><span class="bars" role="img" aria-label="' + d[2] + (i ? ' de 3' : ' of 3') + '"><i class="on"></i><i class="' + (d[2] >= 2 ? 'on' : '') + '"></i><i class="' + (d[2] >= 3 ? 'on' : '') + '"></i></span></div>';
    }).join('') + '</div>';
    h += GROUPS.map(function (g) { return '<div class="card"><h3>' + g.t[i] + '</h3><ul>' + g[state.lang].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'; }).join('');
    h += '</div><p class="legend"><span class="bars" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></span>' + L(T.legend) + '</p></div></section>';

    h += '<section id="solutions" class="block"><div class="wrap"><div class="head"><p class="eyebrow">' + L(T.s2)[0] + '</p><h2>' + L(T.s2)[1] + '</h2></div><div class="grid5">' +
      SOLUTIONS.map(function (s) { return '<div class="sol"><h3>' + esc(L(D.areas[s[0]])) + '</h3><div class="chips">' + s[1 + i].map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div></div>'; }).join('') +
      '</div></div></section>';

    var vis = visible();
    var areaPills = '<button type="button" class="pill" data-area="all" aria-pressed="' + (state.area === 'all') + '">' + L(T.all) + '</button>' +
      Object.keys(D.areas).map(function (k) { return '<button type="button" class="pill" data-area="' + k + '" aria-pressed="' + (state.area === k) + '">' + esc(L(D.areas[k])) + '</button>'; }).join('');
    var coPills = '<button type="button" class="pill" data-co="all" aria-pressed="' + (state.co === 'all') + '">' + L(T.all) + '</button>' +
      Object.keys(D.companies).map(function (k) { return '<button type="button" class="pill" data-co="' + k + '" aria-pressed="' + (state.co === k) + '">' + esc(L(D.companies[k])) + '</button>'; }).join('');
    h += '<section id="portfolio" class="block last"><div class="wrap"><div class="port-head"><div class="head"><p class="eyebrow">' + L(T.s3)[0] + '</p><h2>' + L(T.s3)[1] + '</h2></div>' +
      '<p class="count" aria-live="polite">' + vis.length + L(T.count) + '</p></div>' +
      '<div class="filters"><div class="frow" role="group" aria-label="' + L(T.byArea) + '"><span class="lbl">' + L(T.byArea) + '</span>' + areaPills + '</div>' +
      '<div class="frow" role="group" aria-label="' + L(T.byCo) + '"><span class="lbl">' + L(T.byCo) + '</span>' + coPills + '</div></div>' +
      casesBlock(vis) + '</div></section>';
    h += footer();
    return h;
  }

  function footer() {
    return '<footer id="contact" class="contact"><div class="wrap"><div><h2>' + L(T.foot)[0] + '</h2><p>' + L(T.foot)[1] + '</p></div>' +
      '<div class="ctas"><span class="btn ghost plain">isouzae@gmail.com</span>' +
      '<a class="btn primary" href="https://wa.me/5519981608088" target="_blank" rel="noopener">WhatsApp +55 19 98160-8088</a>' +
      '<a class="btn ghost" href="https://esouzasp.github.io/executive-portifolio/">' + (state.lang === 'pt' ? 'Portfólio no GitHub' : 'GitHub portfolio') + '</a>' +
      '<a class="btn ghost" href="https://www.linkedin.com/">LinkedIn</a></div></div></footer>';
  }

  function detail(n) {
    var c = D.cases[n], t = c[state.lang], k = L(T.k), cx = L(T.cxa);
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
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
    var n = caseFromHash();
    app.innerHTML = n === null ? home() : detail(n);
    document.title = (n === null ? 'Everton Teixeira de Souza — ' + L(T.eyebrow) : D.cases[n][state.lang].t + ' — Everton Teixeira de Souza');
    if (scrollTop) window.scrollTo(0, 0);
    onScroll();
  }
  function onScroll() {
    var m = document.getElementById('masthead');
    if (m) m.classList.toggle('shrink', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang],[data-area],[data-co],[data-view],[data-open],[data-back]');
    if (!b) return;
    if (b.hasAttribute('data-lang')) { state.lang = b.getAttribute('data-lang'); store.set('lang', state.lang); render(false); }
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
