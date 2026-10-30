#!/usr/bin/env python3
"""Builds ONE self-contained HTML file from public/ (all pages, CSS, JS and
photos inlined) so the site can be opened by double-clicking the file.
Run:  python3 tools/build_standalone.py   ->  studio-ez-standalone.html"""
import base64, mimetypes, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
OUT = ROOT / "studio-ez-standalone.html"

def rd(n): return (PUB / n).read_text(encoding="utf-8")

def sub1(text, old, new, label):
    assert text.count(old) == 1, f"expected exactly one match for {label}: {text.count(old)}"
    return text.replace(old, new)

def datauri(rel):
    p = PUB / rel
    mt = mimetypes.guess_type(p.name)[0] or "application/octet-stream"
    return f"data:{mt};base64," + base64.b64encode(p.read_bytes()).decode()

def body(name):
    t = rd(name)
    return re.search(r"<body[^>]*>(.*)</body>", t, re.S).group(1)

def strip_scripts(t):
    return re.sub(r"\s*<script[^>]*></script>", "", t)

def links(t):
    t = t.replace('href="work.html#', 'href="#/work/')
    t = t.replace('href="contact.html"', 'href="#/contact"')
    t = t.replace('href="index.html"', 'href="#/"').replace('href="work.html"', 'href="#/work"').replace('href="about.html"', 'href="#/about"')
    return t

# ---------- views ----------
home = strip_scripts(body("index.html"))
home = re.sub(r"<!-- START PAGE.*?-->\s*", "", home, flags=re.S)
work = strip_scripts(body("work.html"))
about = strip_scripts(body("about.html"))
contact = strip_scripts(body("contact.html"))

work = work.replace('<a class="skip" href="#main">Skip to content</a>\n', "")
about = about.replace('<a class="skip" href="#main">Skip to content</a>\n', "")
contact = contact.replace('<a class="skip" href="#main">Skip to content</a>\n', "")
work = sub1(work, '<main id="main">', '<main id="main-work">', "work main")
about = sub1(about, '<main id="main" class="wrap">', '<main id="main-about" class="wrap">', "about main")
contact = sub1(contact, '<main id="main" class="wrap">', '<main id="main-contact" class="wrap">', "contact main")
# the dialog belongs to the work view but must live outside its hidden wrapper rules; keep inside, it is fine.

home, work, about, contact = links(home), links(work), links(about), links(contact)
# nav copies: the work and about pages carry their own (current-page) nav; home has its own inside .site

# ---------- scripts ----------
projects = rd("projects.js")
orbit = rd("orbit.js")
workjs = rd("work.js")
intro = rd("intro.js")
contactjs = rd("contact.js")

orbit = sub1(orbit, '"work.html#" + p.id', '"#/work/" + p.id', "orbit href")

workjs = sub1(workjs, 'cta.href = "contact.html";', 'cta.href = "#/contact";', "cta")
workjs = sub1(workjs, 'if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);',
              'if (location.hash !== "#/work/" + id) history.replaceState(null, "", "#/work/" + id);', "open hash")
workjs = sub1(workjs, '''  dlg.addEventListener("close", function () {
    history.replaceState(null, "", location.pathname + location.search);
  });''', '''  dlg.addEventListener("close", function () {
    if (/^#\\/work\\//.test(location.hash)) history.replaceState(null, "", "#/work");
  });''', "close handler")
workjs = sub1(workjs, '''  function fromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;''', '''  function fromHash() {
    var m = /^#\\/work\\/(.+)$/.exec(location.hash);
    if (!m) { if (dlg.open) dlg.close(); return; }
    var id = decodeURIComponent(m[1]);''', "fromHash")
workjs = sub1(workjs, '''  window.addEventListener("hashchange", function () {
    if (!location.hash) return;
    fromHash();
  });''', '''  window.addEventListener("hashchange", fromHash);''', "hashchange")

router = r"""
(function () {
  var views = { home: document.getElementById("view-home"), work: document.getElementById("view-work"), about: document.getElementById("view-about"), contact: document.getElementById("view-contact") };
  var titles = { home: "studio ez | Creative studio in Dhaka", work: "Work | studio ez", about: "About | studio ez", contact: "Contact | studio ez" };
  var current = null;
  function route() {
    var h = location.hash.replace(/^#\/?/, "");
    var first = h.split("/")[0];
    var name = first === "" ? "home" : (views[first] ? first : null);
    if (!name) return;                     // in-page links such as #main-work: leave the view alone
    if (name !== current) {
      Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
      document.body.classList.toggle("home", name === "home");
      document.title = titles[name];
      current = name;
      window.scrollTo(0, 0);
    }
  }
  window.addEventListener("hashchange", route);
  route();
})();
"""

css = rd("style.css")
css = sub1(css, 'url("images/texture.png")', f'url("{datauri("images/texture.png")}")', "texture")
# bundle the fonts into the file too, so it looks right offline
for f in sorted(re.findall(r'url\("(fonts/[A-Za-z0-9_.\-]+\.woff)"\)', css)):
    css = css.replace(f'url("{f}")', f'url("{datauri(f)}")')
css += "\n.view[hidden] { display: none; }\n"

# images used by projects.js / orbit.js, plus the logos used in the markup
imgs = sorted(set(re.findall(r'images/[A-Za-z0-9_.\-]+\.(?:jpg|png|svg)', projects)))
imgmap = {i: datauri(i) for i in imgs}

def inline_markup_imgs(t):
    def f(m):
        rel = m.group(1)
        return 'src="' + datauri(rel) + '"'
    return re.sub(r'src="(images/[A-Za-z0-9_.\-]+\.(?:svg|png|jpg))"', f, t)

home, work, about, contact = inline_markup_imgs(home), inline_markup_imgs(work), inline_markup_imgs(about), inline_markup_imgs(contact)

import json
imgjs = "window.__IMG = " + json.dumps(imgmap) + ";\n" + """
(function walk(o) {
  Object.keys(o).forEach(function (k) {
    var v = o[k];
    if (typeof v === "string" && window.__IMG[v]) o[k] = window.__IMG[v];
    else if (v && typeof v === "object") walk(v);
  });
})(window.PROJECTS);
"""

fav = datauri("favicon.svg")

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>studio ez | Creative studio in Dhaka</title>
<meta name="description" content="studio ez is a Dhaka-based creative studio for brand identity, UX/UI, gamification, motion and video, and content production.">
<meta name="theme-color" content="#EFECE3">
<link rel="icon" type="image/svg+xml" href="{fav}">
<style>
{css}
</style>
<script>
/* Start page: once per visit, only on the home view, not for reduced motion. */
try {{
  var h = location.hash.replace(/^#\\/?/, "");
  if (!h && !sessionStorage.getItem("ez-intro") && !matchMedia("(prefers-reduced-motion: reduce)").matches) {{
    document.documentElement.classList.add("intro");
  }}
}} catch (e) {{}}
</script>
</head>
<body class="home">

<!-- START PAGE: only the logo. It pops up, the key presses itself down, the site opens from the key -->
<div class="intro-screen" id="intro" aria-hidden="true">
  <div class="intro-wrap">
    <img src="{datauri('images/logo-word-white.svg')}" alt="">
    <div class="key-layer" id="key-layer"><img src="{datauri('images/logo-key-white.svg')}" alt=""></div>
  </div>
</div>
<div class="intro-ring" id="intro-ring" aria-hidden="true"></div>

<div class="view" id="view-home">
{re.sub(r'<div class="intro-screen".*?</div>\s*</div>\s*<div class="intro-ring"[^>]*></div>', '', home, flags=re.S)}
</div>
<div class="view" id="view-work" hidden>
{work}
</div>
<div class="view" id="view-about" hidden>
{about}
</div>
<div class="view" id="view-contact" hidden>
{contact}
</div>

<script>
{projects}
{imgjs}
</script>
<script>
{orbit}
</script>
<script>
{workjs}
</script>
<script>
{contactjs}
</script>
<script>
{intro}
</script>
<script>
{router}
</script>
</body>
</html>
"""
OUT.write_text(html, encoding="utf-8")
print("wrote", OUT, f"{OUT.stat().st_size/1e6:.2f} MB")
