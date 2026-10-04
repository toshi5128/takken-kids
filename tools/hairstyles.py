"""Hairstyle sheet (Gemini, same girl in the same hoodie) -> full-body variants of the base outfit.
Each cell shows the upper body only, so it is joined to the base picture at the hoodie hem (yellow ends, skirt
begins): scale by hoodie width, align the hems, take the top from the cell and the skirt/legs from the base.
Usage: python tools/hairstyles.py   (writes art/s1_hair_<id>.png and prints face positions)
"""
import colorsys
from collections import deque
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SHEET = ROOT / 'art/_src_hairsheet_s1.jpg'
BASE = ROOT / 'art/s1_coord1.png'
# (id, box in the sheet) — boxes found by tools run on the sheet, in visual reading order
CELLS = [('pony', (20, 12, 236, 348)), ('bob', (276, 36, 484, 348)), ('twinshort', (536, 36, 744, 348)),
         ('long', (20, 392, 240, 692)), ('crown', (268, 392, 492, 984)), ('bun', (532, 364, 748, 692)),
         ('drill', (20, 704, 248, 988)), ('short', (532, 700, 744, 988)), ('sidebraid', (20, 1000, 236, 1376)),
         ('asym', (272, 992, 488, 1376)), ('updo', (532, 992, 744, 1376))]


def yellow(p):
    r, g, b = p[:3]
    if len(p) > 3 and p[3] < 128: return False
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return 40 <= h * 360 <= 62 and s > .45 and v > .7


def cutout(im, open_bottom):
    """White background -> transparent, flooding from the edges (not from a cut-off bottom edge)."""
    im = im.convert('RGBA'); w, h = im.size; px = im.load()
    edges = [(x, 0) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    if not open_bottom: edges += [(x, h - 1) for x in range(w)]
    seen = bytearray(w * h); q = deque(edges)
    while q:
        x, y = q.popleft(); i = y * w + x
        if seen[i]: continue
        seen[i] = 1
        r, g, b, a = px[x, y]
        if not (r > 228 and g > 228 and b > 228): continue
        px[x, y] = (255, 255, 255, 0)
        q.extend((nx, ny) for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)) if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx])
    return im


def hem(im):
    """Lowest row that is still mostly hoodie, and the hoodie span a little above it."""
    w, h = im.size; px = im.load()
    counts = [sum(yellow(px[x, y]) for x in range(w)) for y in range(h)]
    peak = max(counts)
    y = max(i for i, c in enumerate(counts) if c > peak * .35)
    row = y - max(4, h // 60)
    xs = [x for x in range(w) if yellow(px[x, row])]
    return y, min(xs), max(xs)


def skin(p):
    return len(p) < 4 or p[3] > 128 and p[0] > 235 and 195 < p[1] < 238 and 175 < p[2] < 228


def face(im):
    """Bounding box of the face: the largest skin area in the upper part, near the middle (not the waving hand)."""
    w, h = im.size; px = im.load(); top = int(h * .5)
    seen = bytearray(w * top); best = None
    for y0 in range(0, top, 2):
        for x0 in range(0, w, 2):
            if seen[y0 * w + x0] or not skin(px[x0, y0]): continue
            q = deque([(x0, y0)]); seen[y0 * w + x0] = 1; xs = []; ys = []
            while q:
                x, y = q.popleft(); xs.append(x); ys.append(y)
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < top and not seen[ny * w + nx] and skin(px[nx, ny]):
                        seen[ny * w + nx] = 1; q.append((nx, ny))
            cx = sum(xs) / len(xs)
            if len(xs) > 200 and abs(cx - w / 2) < w * .3 and (best is None or len(xs) > best[0]):
                best = (len(xs), min(xs), max(xs), min(ys), sum(ys) / len(ys))
    _, x0, x1, y0, cy = best
    return x0, x1, cy


def main():
    base = Image.open(BASE).convert('RGBA')
    by, _, _ = hem(base)
    bf0, bf1, bfy = face(base)
    sheet = Image.open(SHEET).convert('RGB')
    for cid, box in CELLS:
        cell = sheet.crop(box)
        if cid == 'crown':  # already a full-body picture
            out = cutout(cell, False); out = out.crop(out.getbbox())
        else:
            cell = cutout(cell, True)
            cf0, cf1, cfy = face(cell)
            k = (bf1 - bf0) / (cf1 - cf0)
            cell = cell.resize((round(cell.width * k), round(cell.height * k)), Image.LANCZOS)
            dx = round((bf0 + bf1) / 2 - (cf0 + cf1) / 2 * k); dy = round(bfy - cfy * k)
            try: ch = round(hem(cell)[0])
            except ValueError: ch = cell.height
            seam = min(dy + ch, dy + cell.height - 3)  # join at the hoodie hem, or where the cell is cut off
            left, top_ = min(0, dx), min(0, dy)
            W = max(base.width, dx + cell.width) - left; H = base.height - top_
            canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            canvas.alpha_composite(base.crop((0, seam, base.width, base.height)), (-left, seam - top_))
            canvas.alpha_composite(cell.crop((0, 0, cell.width, seam - dy + 2)), (dx - left, dy - top_))
            out = canvas.crop(canvas.getbbox())
        if out.height > 1300: out = out.resize((round(out.width * 1300 / out.height), 1300), Image.LANCZOS)
        out.save(ROOT / f'art/s1_hair_{cid}.png', optimize=True)
        print(cid, out.size)


if __name__ == '__main__':
    main()
