"""Full-body sheet (Gemini: hairstyles or outfits, figures in rows on white) -> art/<prefix>_<id>.png
The figures are found by the white gaps between them, so no boxes need to be measured by hand.
Prints the ART lines (face position + bust crop width matched to the base outfit's crop).
Usage: python tools/hairsheet.py art/_src_hairsheet_s2.jpg s2_hair art/s2_coord1.png 0.66 pony,braids,halfup,bob,twin,bun
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
        # figures touching (pom-poms, dress hems) -> cut the widest run at its emptiest column near the
        # middle until the row has as many figures as expected
        per_row = len(ids) // len(rows)
        ink = lambda x: sum(not white(x, y) for y in range(y0, y1, 2))
        while len(cols) < per_row:
            a, b_ = max(cols, key=lambda c: c[1] - c[0])
            k = round((b_ - a) / ((w - 40) / per_row)) or 2  # how many figures this run holds
            m = min(range(a + (b_ - a) * 7 // (10 * k), a + (b_ - a) * 13 // (10 * k)), key=ink)
            i = cols.index((a, b_)); cols[i:i + 1] = [(a, m), (m, b_)]
        cells += [(x0, y0, x1, y1) for x0, x1 in cols]
    assert len(cells) == len(ids), f'found {len(cells)} figures, expected {len(ids)}'
    b = Image.open(ROOT / base).convert('RGBA'); bf0, bf1, _ = face(b)
    for cid, (x0, y0, x1, y1) in zip(ids, cells):
        pad = 6
        cell = cutout(im.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))), False)
        cell = cell.crop(cell.getbbox())
        f0, f1, fy = face(cell)
        cw = base_cw * ((f1 - f0) / cell.width) / ((bf1 - bf0) / b.width)  # same face size in the bust circle as the base outfit
        cell.save(ROOT / f'art/{prefix}_{cid}.png', optimize=True)
        print(f"{cid}: file:'art/{prefix}_{cid}.png',fx:{(f0 + f1) / 2 / cell.width:.3f},fy:{fy / cell.height:.3f},cw:{cw:.2f}  {cell.size}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5].split(','))
