#!/usr/bin/env python3
"""Tightens the letter spacing of the word "studio" in the studio ez logo.

The original logo files are kept in tools/original-logo/. This script reads
them, moves the letters closer together and writes new files into
public/images/. Run it again after changing the two numbers below.

TRACK    how much to tighten each gap, as a share of the font size
         (-0.08 means -8%).
MIN_GAP  the smallest clear space left between two letters, in logo units,
         so thin outlines never touch. (The logo is 626 units wide.)
"""
import re, pathlib, json
from fontTools.pens.boundsPen import BoundsPen
from fontTools.svgLib.path import parse_path

TRACK = -0.08
MIN_GAP = 4.5
EM = 118.0            # estimated font size in logo units (x-height 62.8 / 0.52)

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "original-logo"
OUT = ROOT / "public" / "images"

def bounds(d):
    bp = BoundsPen(None); parse_path(d, bp); return bp.bounds

def letters_from(svg):
    d = re.search(r' d="([^"]+)"', svg).group(1)
    subs = [x for x in re.split(r'(?=M)', d) if x.strip()]
    bs = [bounds(x) for x in subs]
    # group sub-paths into letters by their outer outline x-ranges (known for this logo)
    ranges = [("s", 5.2, 59.2), ("t", 65.1, 108.7), ("u", 119.0, 182.8), ("d", 195.8, 268.6), ("i", 284.1, 302.6), ("o", 315.4, 387.9)]
    groups = {k: [] for k, _, _ in ranges}
    for sp, b in zip(subs, bs):
        cx = (b[0] + b[2]) / 2
        for k, a, z in ranges:
            if a - 0.5 <= cx <= z + 0.5:
                groups[k].append(sp); break
        else:
            raise SystemExit("sub-path not assigned: %s" % (b,))
    return ranges, groups

def build():
    word_src = (SRC / "logo-word-ink.svg").read_text()
    ranges, groups = letters_from(word_src)

    # new offsets
    shifts, cum = {}, 0.0
    prev_end = None
    for k, a, z in ranges:
        if prev_end is not None:
            gap = a - prev_end
            want = -TRACK * EM
            cum += max(0.0, min(want, gap - MIN_GAP))
        shifts[k] = -cum
        prev_end = z
    S = cum                                   # total the word got narrower
    new_w = 626 - S

    def word_paths(fill):
        out = []
        for k, _, _ in ranges:
            d = "".join(groups[k])
            out.append('<path transform="translate(%.3f 690.0)" d="%s" fill="%s" fill-rule="evenodd"/>' % (965.252 + shifts[k], d, fill))
        return "".join(out)

    def key_paths(src_text, fill_attr):
        def mv(m):
            x = float(m.group(1)) - S
            return 'transform="translate(%.3f %s)"' % (x, m.group(2))
        return re.sub(r'transform="translate\(([\d.]+) ([\d.]+)\)"', mv, src_text)

    def wrap(inner):
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="962 652 %.3f 212" width="%.3f" height="212" fill="none">%s</svg>' % (new_w, new_w, inner)

    for tone, fill in (("ink", "#2C2324"), ("white", "#FFFFFF")):
        kt = (SRC / f"logo-key-{tone}.svg").read_text()
        key_inner = re.search(r'<svg[^>]*>(.*)</svg>', kt, re.S).group(1)
        key_inner = key_paths(key_inner, None)
        (OUT / f"logo-word-{tone}.svg").write_text(wrap(word_paths(fill)))
        (OUT / f"logo-key-{tone}.svg").write_text(wrap(key_inner))
        (OUT / f"logo-{tone}.svg").write_text(wrap(word_paths(fill) + key_inner))

    # where is the middle of the key, as a share of the logo width?
    key_d = re.findall(r' d="([^"]+)"', (SRC / "logo-key-ink.svg").read_text())[0]
    kb = bounds(key_d)
    kx0 = 1373.087 - S + kb[0]; kx1 = 1373.087 - S + kb[2]
    cx_frac = ((kx0 + kx1) / 2 - 962) / new_w
    info = {"width": round(new_w, 3), "aspect": "%.3f / 212" % new_w, "key_center_x": round(cx_frac, 4), "narrower_by": round(S, 2), "shifts": {k: round(v, 2) for k, v in shifts.items()}}
    (ROOT / "tools" / "wordmark.json").write_text(json.dumps(info, indent=1))
    print(json.dumps(info, indent=1))

build()
