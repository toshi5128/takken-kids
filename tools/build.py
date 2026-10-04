"""content/*.json (plain text) -> data/course.json (ruby HTML + tap-to-explain terms).

Every kanji gets furigana so a 5th grader can read everything. Readings come from fugashi (UniDic);
wrong ones are fixed in READING_FIX. Glossary terms (content/words.json) become tappable and use the
glossary's own reading. Run: python tools/build.py  (prints readings for proofreading with --check)
"""
import html, json, re, sys
from pathlib import Path
import fugashi

ROOT = Path(__file__).resolve().parent.parent
KANJI = re.compile(r'[㐀-鿿々]')
# Words the dictionary reads wrongly or splits oddly.
READING_FIX = {'年れい': None, '何千万円': 'なんぜんまんえん', '大家': 'おおや', '水路': 'すいろ', '本店': 'ほんてん', '支店': 'してん',
               '1部屋': None, '部屋': 'へや', '区切': 'くぎ', '日本中': 'にほんじゅう', '前日': 'ぜんじつ', '何回': 'なんかい',
               '何': 'なに', '1年': None, '1回': None,
               '母さん': 'かあさん', '父さん': 'とうさん', '言う': 'いう', '日本': 'にほん'}
tagger = fugashi.Tagger()


def hira(s):
    return ''.join(chr(ord(c) - 0x60) if 'ァ' <= c <= 'ヶ' else c for c in s)


def ruby(surface, reading):
    """Ruby only on the kanji core: 与える/あたえる -> <ruby>与<rt>あた</rt></ruby>える."""
    if not KANJI.search(surface) or not reading:
        return html.escape(surface)
    pre = 0
    while pre < len(surface) and not KANJI.match(surface[pre]) and pre < len(reading) and hira(surface[pre]) == reading[pre]:
        pre += 1
    suf = 0
    while suf < len(surface) - pre and not KANJI.match(surface[-1 - suf]) and suf < len(reading) - pre and hira(surface[-1 - suf]) == reading[-1 - suf]:
        suf += 1
    core, rt = surface[pre:len(surface) - suf], reading[pre:len(reading) - suf]
    return html.escape(surface[:pre]) + f'<ruby>{html.escape(core)}<rt>{rt}</rt></ruby>' + html.escape(surface[len(surface) - suf:])


SEEN = {}


def furigana(text):
    out, i = [], 0
    while i < len(text):
        fix = next((k for k in sorted(READING_FIX, key=len, reverse=True) if text.startswith(k, i)), None)
        if fix:
            r = READING_FIX[fix]
            out.append(furigana_plain(fix) if r is None else ruby(fix, r)); i += len(fix); continue
        j = i
        while j < len(text) and not any(text.startswith(k, j) for k in READING_FIX):
            j += 1
        out.append(furigana_plain(text[i:j])); i = j
    return ''.join(out)


def furigana_plain(text):
    parts = []
    for w in tagger(text):
        kana = getattr(w.feature, 'kana', None)
        r = hira(kana) if kana and kana != '*' else ''
        if KANJI.search(w.surface):
            SEEN[w.surface] = r
        parts.append(ruby(w.surface, r) + html.escape(w.white_space or ''))
    return ''.join(parts)


def render(text, terms):
    """Terms first (longest wins), the rest through furigana."""
    if not terms:
        return furigana(text)
    pat =re.compile('|'.join(re.escape(t) for t in sorted(terms, key=len, reverse=True)))
    out, pos = [], 0
    for m in pat.finditer(text):
        out.append(furigana(text[pos:m.start()]))
        t = m.group(0)
        out.append(f'<button class="w" data-w="{html.escape(t)}">' + ruby(t, terms[t]['yomi']) + '</button>')
        pos = m.end()
    out.append(furigana(text[pos:]))
    return ''.join(out)


def main():
    terms = json.loads((ROOT / 'content/words.json').read_text(encoding='utf-8'))
    chapters = []
    for f in sorted((ROOT / 'content').glob('ch*.json')):
        ch = json.loads(f.read_text(encoding='utf-8'))
        for les in ch['lessons']:
            les['titleHtml'] = furigana(les['title'])
            for p in les['panels']:
                p['html'] = render(p['text'], terms)
            for q in les['quiz']:
                q['qHtml'] = render(q['q'], terms); q['whyHtml'] = render(q['why'], terms)
            missing = [w for w in les['words'] if w not in terms]
            if missing: sys.exit(f'{les["id"]}: words.json に無い言葉 {missing}')
        ch['titleHtml'] = furigana(ch['title']); ch['subtitleHtml'] = furigana(ch['subtitle'])
        chapters.append(ch)
    words = {t: {**v, 'meanHtml': render(v['mean'], {}), 'tatoeHtml': render(v['tatoe'], {})} for t, v in terms.items()}
    (ROOT / 'data/course.json').write_text(json.dumps({'chapters': chapters, 'words': words}, ensure_ascii=False), encoding='utf-8')
    print(f'OK: {len(chapters)}章 {sum(len(c["lessons"]) for c in chapters)}レッスン 言葉{len(words)}')
    if '--check' in sys.argv:
        for k, v in sorted(SEEN.items()):
            print(k, v)


if __name__ == '__main__':
    main()
