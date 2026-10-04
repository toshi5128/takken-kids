"""Gemini art (white background) -> transparent PNG in art/.
Usage: python tools/cutout.py <input image> <name>   e.g. python tools/cutout.py ~/Downloads/x.jpg s1_happy
Only white connected to the image edge is removed, so white socks/shirts inside the outline stay.
"""
import sys
from collections import deque
from pathlib import Path
from PIL import Image

src, name = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA'); w, h = im.size; px = im.load()
bg = lambda p: p[0] > 232 and p[1] > 232 and p[2] > 232
seen = bytearray(w * h); q = deque([(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)])
while q:
    x, y = q.popleft(); i = y * w + x
    if seen[i]: continue
    seen[i] = 1
    if not bg(px[x, y]): continue
    px[x, y] = (255, 255, 255, 0)
    q.extend((nx, ny) for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)) if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx])
# soften the light fringe left along the outline
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a and r > 215 and g > 215 and b > 215 and any(0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0 for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))):
            px[x, y] = (r, g, b, 90)
im = im.crop(im.getbbox())
if im.height > 1300: im = im.resize((round(im.width * 1300 / im.height), 1300), Image.LANCZOS)
out = Path(__file__).resolve().parent.parent / 'art' / f'{name}.png'
im.save(out, optimize=True); print(out, im.size)
