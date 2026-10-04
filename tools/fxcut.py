"""Effect sheet (Gemini, beige panels) -> transparent PNG sprites in art/fx/.
Uses colour-to-alpha against the panel colour, so soft glows and bubbles stay see-through instead of getting
a hard edge. Usage: python tools/fxcut.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SHEET = ROOT / 'art/_src_fxsheet1.jpg'
L, R = (32, 324), (365, 657)
ROWS = [(33, 290), (332, 504), (548, 698), (741, 880), (924, 1102), (1147, 1260), (1273, 1483)]
# (name, column, row, optional sub-box inside the panel as fractions x0,y0,x1,y1)
CUTS = [('galaxy', L, 0, None), ('gems', R, 0, None), ('flowerwind', L, 1, (0, 0, 1, .8)), ('koi', R, 1, None),
        ('snow', L, 2, None), ('notes', R, 2, None), ('sakura', L, 3, (.36, 0, 1, 1)),
        ('wings', L, 4, (0, 0, .36, .75)), ('gears', R, 4, None), ('bubbles', R, 5, None)]


def color_to_alpha(img, bg):
    """Keep the drawing's own colours; fade out only what is close to the paper colour.
    (True colour-to-alpha washed out the pastel sakura/wings and blew up JPEG blocks.)"""
    a = np.asarray(img.convert('RGB')).astype(float)
    d = np.sqrt(((a - np.array(bg, float)) ** 2).sum(axis=2))
    alpha = np.clip((d - 16) / 38, 0, 1) ** .8
    return Image.fromarray(np.dstack([a, alpha * 255]).astype('uint8'), 'RGBA')


def main():
    sheet = Image.open(SHEET).convert('RGB'); out = ROOT / 'art/fx'; out.mkdir(exist_ok=True)
    for name, (x0, x1), r, sub in CUTS:
        y0, y1 = ROWS[r]; pad = 8
        panel = sheet.crop((x0 + pad, y0 + pad, x1 - pad, y1 - pad))
        if sub:
            w, h = panel.size; panel = panel.crop((int(sub[0] * w), int(sub[1] * h), int(sub[2] * w), int(sub[3] * h)))
        if name == 'galaxy':  # a picture, not a sprite: keep it, round the corners off
            m = Image.new('L', panel.size, 0); ImageDraw.Draw(m).ellipse((0, 0, *panel.size), fill=255)
            sprite = panel.convert('RGBA'); sprite.putalpha(m)
        else:
            bg = tuple(int(v) for v in np.median(np.asarray(panel)[:6].reshape(-1, 3), axis=0))
            sprite = color_to_alpha(panel, bg)
        sprite = sprite.crop(sprite.getbbox())
        sprite = sprite.resize((sprite.width * 2, sprite.height * 2), Image.LANCZOS)
        sprite.save(out / f'{name}.png', optimize=True); print(name, sprite.size)


if __name__ == '__main__':
    main()
