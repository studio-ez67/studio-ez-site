#!/usr/bin/env python3
"""Makes the small orbit tiles for the landing page.
For every  images/t-NAME.jpg  named under "tiles" in public/projects.js this
reads  images/NAME.jpg, centre-crops it to 4:5, shrinks it to 440x550 and
saves it. Run after adding a project:   python3 tools/make_tiles.py"""
import re, pathlib
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent / "public"
js = (ROOT / "projects.js").read_text()
for name in sorted(set(re.findall(r'images/t-([A-Za-z0-9_.\-]+\.jpg)', js))):
    src = ROOT / "images" / name
    im = Image.open(src).convert("RGB")
    w, h = im.size
    target = 4 / 5
    if w / h > target:
        nw = round(h * target); x0 = (w - nw) // 2; im = im.crop((x0, 0, x0 + nw, h))
    else:
        nh = round(w / target); y0 = (h - nh) // 2; im = im.crop((0, y0, w, y0 + nh))
    im = im.resize((440, 550), Image.LANCZOS)
    out = ROOT / "images" / ("t-" + name)
    im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    print(out.name, out.stat().st_size // 1024, "KB")
