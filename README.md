# Executive Portfolio — Everton Teixeira de Souza

Trilingual (EN / PT / ES) executive transformation portfolio: overview, representative solutions, tech stack and 60 cases in AI, analytics, enterprise data platforms, supply chain planning, optimization and governance.

## Structure

- `index.html` — page shell
- `styles.css` — visual style
- `app.js` — rendering, language toggle (PT 🇧🇷 / EN 🇺🇸 / ES 🇪🇸), filters by area and company, case detail pages (`#case-N`)
- `data.js` — **all content**: interface strings (`ui`), overview, tech stack and cases, in English (`en`), Portuguese (`pt`) and Spanish (`es`). A case without `es` falls back to English.

No build step: it is plain HTML, CSS and JavaScript.

## Publish with GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
The site will be available at `https://esouzasp.github.io/executive-portifolio/`.

## Hidden cases

Cases marked `hidden: true` stay in `data.js` but are not shown on the site. See the list in [HIDDEN_CASES.md](HIDDEN_CASES.md) — regenerate it with `node tools/build-hidden-list.js`.

## Adding a case

Copy one entry inside `cases` in `data.js` and fill in:

| Field | Meaning |
|---|---|
| `a` | area: `ai`, `sc`, `mo`, `ec`, `dp`, `go` |
| `co` | company filter: `rch`, `sam`, `pln`, `early` |
| `org`, `y` | company / client label and year |
| `t`, `s` | title and one-line summary |
| `cx`, `ch`, `ap` | context, challenge, approach |
| `r` | results (list) |
| `m`, `ml` | headline metric and its label (leave `""` if none) |
| `featured` | number = shown in Featured Cases, in this order |
| `hidden` | `true` = kept in the file but not shown |
| `tg` | tags |
