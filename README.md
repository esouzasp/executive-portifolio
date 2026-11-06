# Executive Portfolio — Everton Teixeira de Souza

Bilingual (PT / EN) executive transformation portfolio: overview, representative solutions and 34 cases in AI, analytics, enterprise data platforms, supply chain planning, optimization and governance.

## Structure

- `index.html` — page shell
- `styles.css` — visual style
- `app.js` — rendering, language toggle (PT 🇧🇷 / EN 🇺🇸), filters by area and company, case detail pages (`#case-N`)
- `data.js` — **all case content**, in English (`en`) and Portuguese (`pt`). Edit this file to add or change cases.

No build step: it is plain HTML, CSS and JavaScript.

## Publish with GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
The site will be available at `https://esouzasp.github.io/executive-portifolio/`.

## Adding a case

Copy one entry inside `cases` in `data.js` and fill in:

| Field | Meaning |
|---|---|
| `a` | area: `ai`, `sc`, `mo`, `dp`, `go` |
| `co` | company filter: `rch`, `sam`, `pln`, `early` |
| `org`, `y` | company / client label and year |
| `t`, `s` | title and one-line summary |
| `cx`, `ch`, `ap` | context, challenge, approach |
| `r` | results (list) |
| `m`, `ml` | headline metric and its label (leave `""` if none) |
| `tg` | tags |
