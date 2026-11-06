// Generates HIDDEN_CASES.md from data.js — run: node tools/build-hidden-list.js
const fs = require('fs'), path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'data.js'));
const D = window.PORTFOLIO;
const org = (c) => (typeof c.org === 'string' ? c.org : c.org.en);
const rows = D.cases.map((c, i) => ({ c, i })).filter((x) => x.c.hidden);
let md = '# Hidden cases\n\nCases kept in `data.js` with `hidden: true` — not shown on the site.\n' +
  'To publish one again, remove `hidden: true` from its entry in `data.js`.\n\n' +
  '| # | Case | Area | Company | Featured |\n|---|---|---|---|---|\n';
rows.forEach(({ c, i }) => { md += `| ${i} | ${c.en.t} | ${D.areas[c.a].en} | ${org(c)} | ${c.featured ? '★ ' + c.featured : ''} |\n`; });
md += `\n_${rows.length} hidden of ${D.cases.length} cases._\n`;
fs.writeFileSync(path.join(__dirname, '..', 'HIDDEN_CASES.md'), md);
console.log(md);
