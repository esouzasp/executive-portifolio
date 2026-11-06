(function () {
  var D = window.PORTFOLIO;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var state = { lang: store.get('lang') || ((navigator.language || '').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en'), area: 'all', co: 'all' };

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
    count: { en: ' cases', pt: ' cases' }, open: { en: 'View case', pt: 'Ver case' },
    back: { en: 'Back to portfolio', pt: 'Voltar ao portfólio' },
    k: { en: ['Company / Client', 'Year', 'Area'], pt: ['Empresa / Cliente', 'Ano', 'Área'] },
    cxa: { en: ['Context', 'Challenge', 'Approach'], pt: ['Contexto', 'Desafio', 'Abordagem'] },
    results: { en: 'Results', pt: 'Resultados' },
    prev: { en: '← Previous case', pt: '← Case anterior' }, next: { en: 'Next case →', pt: 'Próximo case →' },
    foot: { en: ["Let's talk transformation.", 'São Paulo, Brazil · Open to conversations on data, AI and supply chain leadership.'],
            pt: ['Vamos conversar sobre transformação.', 'São Paulo, Brasil · Aberto a conversas sobre liderança em dados, IA e supply chain.'] }
  };
  var DOMAINS = [['Supply Chain', 'Supply Chain', 3], ['Data Analytics & AI', 'Analytics de Dados e IA', 3], ['Data Science', 'Ciência de Dados', 3],
    ['Logistics', 'Logística', 2], ['Ecommerce', 'E-commerce', 2], ['Data Engineering', 'Engenharia de Dados', 2], ['Manufacturing', 'Manufatura', 2],
    ['Commercial', 'Comercial', 1], ['Procurement', 'Compras', 1]];
  var GROUPS = [
    { t: ['Industries', 'Indústrias'], en: ['Retail', 'Industrial', 'Consumer Goods', 'Electronics', 'Agribusiness', 'Oil & Gas', 'Logistics', 'Financial Services'], pt: ['Varejo', 'Industrial', 'Bens de Consumo', 'Eletrônicos', 'Agronegócio', 'Óleo e Gás', 'Logística', 'Serviços Financeiros'] },
    { t: ['Capabilities', 'Competências'], en: ['Planning & Forecasting', 'Optimization & OR', 'Data & Analytics', 'AI & Decision Intelligence', 'Enterprise Platforms', 'Governance & Delivery'], pt: ['Planejamento e Forecasting', 'Otimização e Pesquisa Operacional', 'Dados e Analytics', 'IA e Inteligência de Decisão', 'Plataformas Corporativas', 'Governança e Entrega'] },
    { t: ['Leadership', 'Liderança'], en: ['Program Management', 'Portfolio Management', 'Product Management', 'Stakeholder Management', 'Vendor Management'], pt: ['Gestão de Programas', 'Gestão de Portfólio', 'Gestão de Produto', 'Gestão de Stakeholders', 'Gestão de Fornecedores'] },
    { t: ['Transformation', 'Transformação'], en: ['Analytics Modernization', 'Data Platforms', 'Operating Models', 'Strategy & Governance', 'Enterprise Architecture', 'SAP Modernization', 'AI & Automation'], pt: ['Modernização de Analytics', 'Plataformas de Dados', 'Modelos Operacionais', 'Estratégia e Governança', 'Arquitetura Corporativa', 'Modernização SAP', 'IA e Automação'] }
  ];
  var SOLUTIONS = [
    ['ai', ['Databricks Genie', 'AI Agents', 'Conversational Analytics', 'Forecasting Platforms'], ['Databricks Genie', 'Agentes de IA', 'Analytics Conversacional', 'Plataformas de Forecast']],
    ['sc', ['Demand Collaboration', 'Manufacturing Planning', 'Order Sequencing', 'Inventory Optimization'], ['Colaboração de Demanda', 'Planejamento de Manufatura', 'Sequenciamento de Pedidos', 'Otimização de Estoque']],
    ['mo', ['Margin Engine', 'Capacity Planning', 'Make vs Buy', 'Production Analytics'], ['Motor de Margem', 'Planejamento de Capacidade', 'Make vs Buy', 'Analytics de Produção']],
    ['dp', ['SAP Datasphere', 'Databricks', 'Lakehouse', 'Power BI Modernization'], ['SAP Datasphere', 'Databricks', 'Lakehouse', 'Modernização Power BI']],
    ['go', ['Analytics Governance', 'Portfolio Management', 'Delivery Frameworks', 'Data Governance'], ['Governança de Analytics', 'Gestão de Portfólio', 'Frameworks de Entrega', 'Governança de Dados']]
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function L(o) { return o[state.lang]; }
  function idx() { return state.lang === 'pt' ? 1 : 0; }
  function visible() {
    return D.cases.map(function (c, i) { return { c: c, i: i }; }).filter(function (x) {
      return !x.c.hidden && (state.area === 'all' || x.c.a === state.area) && (state.co === 'all' || x.c.co === state.co);
    });
  }
  function caseFromHash() { var m = /^#case-(\d+)$/.exec(location.hash); if (!m) return null; var n = +m[1]; return D.cases[n] && !D.cases[n].hidden ? n : null; }

  function header(home) {
    var n = L(T.nav), base = home ? '' : '#';
    return '<header class="top"><div class="wrap bar">' +
      (home ? '<nav class="nav" aria-label="Main"><a href="#overview">' + n[0] + '</a><a href="#solutions">' + n[1] + '</a><a href="#portfolio">' + n[2] + '</a><a href="#contact">' + n[3] + '</a></nav>'
            : '<a class="backlink" href="#portfolio" data-back>← ' + L(T.back) + '</a>') + '</div></header>';
  }
  function langToggle() {
    return '<div class="lang" role="group" aria-label="Language / Idioma">' +
      '<button type="button" data-lang="pt" aria-pressed="' + (state.lang === 'pt') + '" aria-label="Português">PT ' + FLAG_BR + '</button>' +
      '<button type="button" data-lang="en" aria-pressed="' + (state.lang === 'en') + '" aria-label="English">EN ' + FLAG_US + '</button></div>';
  }

  function home() {
    var i = idx(), h = '';
    h += header(true);
    h += '<section id="top" class="hero"><div class="wrap"><p class="eyebrow">' + L(T.eyebrow) + '</p>' +
      '<div class="name-row"><h1>Everton Teixeira de Souza</h1>' + langToggle() + '</div>' +
      '<p class="lead">' + L(T.summary) + '</p>' +
      '<div class="ctas"><a class="btn primary" href="#portfolio">' + L(T.cta)[0] + '</a><a class="btn ghost" href="#contact">' + L(T.cta)[1] + '</a></div>' +
      '<div class="stats">' + ['20+', '8+', '15+', '100+'].map(function (v, k) { return '<div><strong>' + v + '</strong><span>' + L(T.stats)[k] + '</span></div>'; }).join('') + '</div></div></section>';

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
      '<div class="cases">' + vis.map(function (x) {
        var c = x.c, t = c[state.lang];
        return '<article class="case">' +
          '<p class="meta"><span class="area">' + esc(L(D.areas[c.a])) + '</span> | ' + esc(c.org) + '</p>' +
          '<h3>' + esc(t.t) + '</h3><p class="sum">' + esc(t.s) + '</p>' +
          '<p class="res">' + (t.m ? '<strong>' + esc(t.m) + '</strong> ' + esc(t.ml) : esc(t.r[0])) + '</p>' +
          '<p class="tags">' + t.tg.map(function (g) { return '<span class="tag">' + esc(g) + '</span>'; }).join('') + '</p></article>';
      }).join('') + '</div></div></section>';
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
    var h = header(false);
    h += '<section id="top" class="hero"><div class="narrow"><p class="eyebrow">' + esc(L(D.areas[c.a])) + '</p>' +
      '<div class="name-row"><h1>' + esc(t.t) + '</h1>' + langToggle() + '</div>' +
      '<p class="lead">' + esc(t.s) + '</p>' +
      '<div class="dtags">' + t.tg.map(function (g) { return '<span>' + esc(g) + '</span>'; }).join('') + '</div>' +
      '<div class="stats"><div><span class="k">' + k[0] + '</span><span class="v">' + esc(c.org) + '</span></div><div><span class="k">' + k[1] + '</span><span class="v">' + esc(c.y || '—') + '</span></div><div><span class="k">' + k[2] + '</span><span class="v">' + esc(L(D.areas[c.a])) + '</span></div></div></div></section>';
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
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang],[data-area],[data-co],[data-open],[data-back]');
    if (!b) return;
    if (b.hasAttribute('data-lang')) { state.lang = b.getAttribute('data-lang'); store.set('lang', state.lang); render(false); }
    else if (b.hasAttribute('data-area')) { state.area = b.getAttribute('data-area'); render(false); }
    else if (b.hasAttribute('data-co')) { state.co = b.getAttribute('data-co'); render(false); }
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
