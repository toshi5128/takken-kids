"""Full-body hairstyle sheet (Gemini, 3 x 2 figures on white) -> art/<prefix>_hair_<id>.png
The figures are found by the white gaps between them, so no boxes need to be measured by hand.
Prints the ART lines (face position + bust crop width matched to the base outfit's crop).
Usage: python tools/hairsheet.py art/_src_hairsheet_s2.jpg s2 art/s2_coord1.png 0.66 pony,braids,halfup,bob,twin,bun
"""
import sys
from pathlib import Path
from PIL import Image
from hairstyles import cutout, face

ROOT = Path(__file__).resolve().parent.parent


def spans(blank, n_min=8):
    """Runs of non-blank lines -> [(start, end)], ignoring tiny specks."""
    out, start = [], None
    for i, b in enumerate(blank + [True]):
        if not b and start is None: start = i
        if b and start is not None:
            if i - start >= n_min: out.append((start, i))
            start = None
    return out


def main(sheet, prefix, base, base_cw, ids):
    im = Image.open(ROOT / sheet).convert('RGB'); w, h = im.size; g = im.convert('L').load()
    white = lambda x, y: g[x, y] > 232
    rows = spans([all(white(x, y) for x in range(0, w, 2)) for y in range(h)], 40)
    cells = []
    for y0, y1 in rows:
        cols = spans([all(white(x, y) for y in range(y0, y1, 2)) for x in range(w)], 40)
        cells += [(x0, y0, x1, y1) for x0, x1 in cols]
    assert len(cells) == len(ids), f'found {len(cells)} figures, expected {len(ids)}'
    b = Image.open(ROOT / base).convert('RGBA'); bf0, bf1, _ = face(b)
    for cid, (x0, y0, x1, y1) in zip(ids, cells):
        pad = 6
        cell = cutout(im.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))), False)
        cell = cell.crop(cell.getbbox())
        f0, f1, fy = face(cell)
        cw = base_cw * ((bf1 - bf0) / b.width) / ((f1 - f0) / cell.width)
        cell.save(ROOT / f'art/{prefix}_hair_{cid}.png', optimize=True)
        print(f"{cid}: file:'art/{prefix}_hair_{cid}.png',fx:{(f0 + f1) / 2 / cell.width:.3f},fy:{fy / cell.height:.3f},cw:{cw:.2f}  {cell.size}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5].split(','))
