#!/usr/bin/env python3
"""Generate share pages + preview images for each visible case.

Output (all regenerated on each run):
  cases/<id>.html, cases/pt/<id>.html, cases/es/<id>.html   -> pages with Open Graph tags (LinkedIn, WhatsApp, Word)
  images/cases/<lang>/<id>.png                               -> 1200x627 preview image per case and language
  images/og-default.png                                      -> preview image for the home page

Each page shows the case and redirects browsers to the portfolio with the case modal open.
Run from the repo root:  python3 tools/build_share.py
Needs: node (to read data.js) and Pillow. Uses the Inter font if installed, else DejaVu Sans.
"""
import html, json, os, shutil, subprocess, sys, textwrap
from PIL import Image, ImageDraw, ImageFont

BASE = "https://esouzasp.github.io/executive-portifolio/"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ["en", "pt", "es"]
NAME = "Everton Teixeira de Souza"

# ---------- data
js = "global.window={};require(%s);process.stdout.write(JSON.stringify(window.PORTFOLIO))" % json.dumps(os.path.join(ROOT, "data.js"))
D = json.loads(subprocess.check_output(["node", "-e", js]))
CASES = [c for c in D["cases"] if not c.get("hidden")]

def tr(o, L):
    return o.get(L) if isinstance(o, dict) and o.get(L) is not None else (o.get("en") if isinstance(o, dict) else o)

# ---------- fonts
def font(weight, size):
    inter = {"regular": "Inter-Regular.otf", "medium": "Inter-Medium.otf", "semibold": "Inter-SemiBold.otf", "bold": "Inter-Bold.otf", "extrabold": "Inter-ExtraBold.otf"}[weight]
    for path in ["/usr/share/fonts/opentype/inter/" + inter, "/Library/Fonts/" + inter, os.path.expanduser("~/Library/Fonts/" + inter), "C:/Windows/Fonts/" + inter]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    dv = "DejaVuSans-Bold.ttf" if weight in ("bold", "extrabold", "semibold") else "DejaVuSans.ttf"
    for path in ["/usr/share/fonts/truetype/dejavu/" + dv]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

INK, ACCENT, WHITE, MUTED, SOFT = "#0F1B2D", "#E0A33B", "#FFFFFF", "#AEB8C6", "#C9D1DC"
W, H, PAD = 1200, 627, 72

def wrap(draw, text, fnt, width, max_lines):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= width:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while draw.textlength(lines[-1] + "…", font=fnt) > width and " " in lines[-1]:
            lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] += "…"
    return lines

def card_image(path, eyebrow, title, metric, metric_label, summary, footer_sub):
    img = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 10], fill=ACCENT)
    y = 64
    f_eb = font("semibold", 24)
    for line in wrap(d, eyebrow.upper(), f_eb, W - 2 * PAD, 1):
        d.text((PAD, y), line, font=f_eb, fill=ACCENT); y += 36
    y += 14
    f_t = font("extrabold", 58)
    for line in wrap(d, title, f_t, W - 2 * PAD, 3):
        d.text((PAD, y), line, font=f_t, fill=WHITE); y += 70
    y += 16
    if metric:
        f_m, f_ml = font("extrabold", 60), font("medium", 28)
        d.text((PAD, y), metric, font=f_m, fill=ACCENT)
        mx = PAD + d.textlength(metric, font=f_m) + 20
        for line in wrap(d, metric_label, f_ml, W - PAD - mx, 1):
            d.text((mx, y + 22), line, font=f_ml, fill=SOFT)
    else:
        f_s = font("regular", 28)
        for line in wrap(d, summary, f_s, W - 2 * PAD, 2):
            d.text((PAD, y), line, font=f_s, fill=SOFT); y += 40
    d.line([PAD, H - 112, W - PAD, H - 112], fill="#26364C", width=2)
    d.text((PAD, H - 92), NAME, font=font("bold", 30), fill=WHITE)
    d.text((PAD, H - 50), footer_sub, font=font("regular", 22), fill=MUTED)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, optimize=True)

# ---------- pages
PAGE = """<!doctype html>
<html lang="{lang_attr}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — {name}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="{name} — {site}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">
<meta property="og:image:alt" content="{title}">
<meta property="og:locale" content="{locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{image}">
<meta name="author" content="{name}">
<script>location.replace({target});</script>
<style>
body{{margin:0;font-family:Inter,system-ui,sans-serif;background:#F7F6F2;color:#0F1B2D}}
main{{max-width:720px;margin:0 auto;padding:40px 24px}}
.eb{{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8A5A12}}
h1{{font-size:30px;line-height:1.2;margin:8px 0 12px}}
.m{{font-size:28px;font-weight:800;margin:0 0 16px}}.m span{{font-size:15px;font-weight:400;color:#5A6472;margin-left:8px}}
dt{{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8A5A12;margin-top:14px}}
dd{{margin:4px 0 0;line-height:1.55;color:#3E4856}}
a.btn{{display:inline-block;margin-top:24px;padding:12px 20px;border-radius:8px;background:#0F1B2D;color:#fff;text-decoration:none;font-weight:600}}
</style>
</head>
<body>
<main>
<p class="eb">{eyebrow}</p>
<h1>{title}</h1>
<p>{desc}</p>
{metric_html}
<dl>
<dt>{k0}</dt><dd>{cx}</dd>
<dt>{k1}</dt><dd>{ch}</dd>
<dt>{k2}</dt><dd>{ap}</dd>
<dt>{k3}</dt><dd><ul>{results}</ul></dd>
</dl>
<a class="btn" href={target_attr}>{open_label}</a>
</main>
</body>
</html>
"""
OPEN = {"en": "Open in the portfolio", "pt": "Abrir no portfólio", "es": "Abrir en el portafolio"}
LOCALE = {"en": "en_US", "pt": "pt_BR", "es": "es_ES"}
LANG_ATTR = {"en": "en", "pt": "pt-BR", "es": "es"}

def main():
    for sub in ["cases", os.path.join("images", "cases")]:
        p = os.path.join(ROOT, sub)
        if os.path.isdir(p): shutil.rmtree(p)
    ui = D["ui"]
    for L in LANGS:
        site = tr(ui["eyebrow"], L)
        # home preview image
        if L == "en":
            card_image(os.path.join(ROOT, "images", "og-default.png"), site, NAME,
                       "", "", tr(ui["summary"], L)[:220], BASE.replace("https://", "").rstrip("/"))
        for c in CASES:
            t = c.get(L) or c["en"]
            area = tr(D["areas"][c["a"]], L)
            org = tr(c["org"], L)
            rel = ("" if L == "en" else L + "/") + c["id"] + ".html"
            img_rel = "images/cases/%s/%s.png" % (L, c["id"])
            card_image(os.path.join(ROOT, img_rel), area + "  ·  " + org, t["t"], t["m"], t["ml"], t["s"], site)
            up = "../" if L == "en" else "../../"
            target = up + ("" if L == "en" else "?lang=" + L) + "#" + c["id"]
            stars = tr(ui["star"], L)
            page = PAGE.format(
                lang_attr=LANG_ATTR[L], locale=LOCALE[L], name=NAME, site=html.escape(site),
                title=html.escape(t["t"]), desc=html.escape(t["s"]), url=BASE + "cases/" + rel, image=BASE + img_rel,
                eyebrow=html.escape(area + " · " + org), target=json.dumps(target), target_attr='"%s"' % html.escape(target),
                metric_html=('<p class="m">%s<span>%s</span></p>' % (html.escape(t["m"]), html.escape(t["ml"]))) if t["m"] else "",
                k0=stars[0], k1=stars[1], k2=stars[2], k3=stars[3],
                cx=html.escape(t["cx"]), ch=html.escape(t["ch"]), ap=html.escape(t["ap"]),
                results="".join("<li>%s</li>" % html.escape(r) for r in t["r"]), open_label=OPEN[L])
            out = os.path.join(ROOT, "cases", rel)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, "w", encoding="utf-8") as f:
                f.write(page)
    print("ok: %d cases x %d languages" % (len(CASES), len(LANGS)))

if __name__ == "__main__":
    main()
