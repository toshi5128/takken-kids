"""content/new_words_*.json (章ごとに書いた新しい言葉) を content/words.json へまとめる。

- 同じ言葉が何章にも出てきたら、先の章の説明を使う(ファイル名の順)。words.json に既にある言葉は上書きしない。
- 毎日の言葉すぎて、どこでも黄色くなるとうるさい言葉(GENERIC)はずかんに入れず、レッスンの words からも外す。
- まとめ終わった new_words_*.json は消す(内容は words.json に入っている)。
使い方: python tools/merge_words.py  → そのあと python tools/build.py --check
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'content'
GENERIC = {'上限', '合意', '承諾', '特例', '依頼者', '相手方', '書面', '根拠', '保険'}


def main():
    words = json.loads((ROOT / 'words.json').read_text(encoding='utf-8'))
    added = 0
    files = sorted(ROOT.glob('new_words_*.json'))
    for f in files:
        for k, v in json.loads(f.read_text(encoding='utf-8')).items():
            if k not in words and k not in GENERIC:
                words[k] = v
                added += 1
    (ROOT / 'words.json').write_text(json.dumps(words, ensure_ascii=False, indent=1), encoding='utf-8')
    for ch in sorted(ROOT.glob('ch*.json')):
        d = json.loads(ch.read_text(encoding='utf-8'))
        changed = False
        for les in d['lessons']:
            keep = [w for w in les['words'] if w not in GENERIC]
            if keep != les['words']:
                les['words'], changed = keep, True
        if changed:
            ch.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf-8')
    for f in files:
        f.unlink()
    print(f'言葉を {added} 個追加（合計 {len(words)}）')


if __name__ == '__main__':
    main()
