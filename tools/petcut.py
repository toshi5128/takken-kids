"""Pet sheet (Gemini 3x3 cards) -> transparent PNGs in art/pet/.
The paper and the thin card borders are flooded away from the crop edges (light, low-saturation pixels);
the creatures' own white fur is safe because it sits inside their dark outlines.
Usage: python tools/petcut.py
"""
import colorsys
from collections import deque
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
COLS = [(101, 897), (984, 1776), (1861, 2657)]
ROWS = [(163, 1128), (1419, 2305), (2590, 3418)]
NAMES = [['starfox', 'gummy', 'mushroom'], ['clovercat', 'crystal', 'bubblebat'], ['sakurasquirrel', 'lantern', 'owl']]


def paper(p):
    h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in p[:3]))
    return v > .74 and s < .22


def keep_creature(im):
    """Drop leftover border lines: keep the biggest piece plus anything near it (bubbles, petals)."""
    w, h = im.size; a = im.getchannel('A').load(); seen = bytearray(w * h); parts = []
    for y0 in range(h):
        for x0 in range(w):
            if seen[y0 * w + x0] or a[x0, y0] < 40: continue
            q = deque([(x0, y0)]); seen[y0 * w + x0] = 1; pts = []
            while q:
                x, y = q.popleft(); pts.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and a[nx, ny] >= 40:
                        seen[ny * w + nx] = 1; q.append((nx, ny))
            parts.append(pts)
    parts.sort(key=len, reverse=True); main_ = parts[0]
    xs = [p[0] for p in main_]; ys = [p[1] for p in main_]
    bx0, bx1, by0, by1 = min(xs) - 40, max(xs) + 40, min(ys) - 40, max(ys) + 40
    keep = Image.new('L', (w, h), 0); k = keep.load()
    for pts in parts:
        cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
        long_thin = (max(p[0] for p in pts) - min(p[0] for p in pts) > 150 or max(p[1] for p in pts) - min(p[1] for p in pts) > 150) and len(pts) < 3000
        if pts is main_ or (bx0 <= cx <= bx1 and by0 <= cy <= by1 and len(pts) > 25 and not long_thin):
            for x, y in pts: k[x, y] = 255
    out = im.copy(); out.putalpha(Image.composite(im.getchannel('A'), keep, keep))
    return out


def main():
    sheet = Image.open(ROOT / 'art/_src_petsheet1.jpg').convert('RGB')
    for r, (y0, y1) in enumerate(ROWS):
        for c, (x0, x1) in enumerate(COLS):
            grow = 70  # the fox's ears and tail reach past its card
            im = sheet.crop((x0 - grow, y0 - grow, x1 + grow, y1 + 8)).convert('RGBA'); w, h = im.size; px = im.load()
            q = deque([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)])
            seen = bytearray(w * h)
            while q:
                x, y = q.popleft(); i = y * w + x
                if seen[i]: continue
                seen[i] = 1
                if not paper(px[x, y]): continue
                px[x, y] = (255, 255, 255, 0)
                q.extend((nx, ny) for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)) if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx])
            im = keep_creature(im)
            im = im.crop(im.getbbox()); im.thumbnail((520, 520), Image.LANCZOS)
            im.save(ROOT / f'art/pet/{NAMES[r][c]}.png', optimize=True); print(NAMES[r][c], im.size)


if __name__ == '__main__':
    main()
