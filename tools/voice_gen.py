"""Record every app line with a local VOICEVOX engine (http://127.0.0.1:50021).

usage: node tools/voice_list.js ねいろ > lines.json
       python tools/voice_gen.py lines.json

The kanji text gives the most natural accent, but VOICEVOX sometimes misreads kanji. So the kanji
reading is compared with the furigana reading (both through the engine), and the furigana version is used
when they differ. Output: voice/<key>.m4a and data/voice.json (list of recorded keys). Re-running skips
clips that already exist.
"""
import json, os, subprocess, sys, tempfile, urllib.parse, urllib.request

ENGINE = 'http://127.0.0.1:50021'
SPEAKER = {'teacher': '青山龍星', 'girl': '春日部つむぎ'}
SPEED = {'teacher': 1.0, 'girl': 1.05}
ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'voice')


def call(path, body=None, **q):
    url = ENGINE + path + ('?' + urllib.parse.urlencode(q) if q else '')
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method='POST' if path != '/speakers' else 'GET',
                                 headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read()


def style_id(name):
    for sp in json.loads(call('/speakers')):
        if sp['name'] == name:
            return next(s['id'] for s in sp['styles'] if s['name'] == 'ノーマル')
    raise SystemExit(f'speaker not found: {name}')


def sounds(query):
    """Mora sequence as (consonant, vowel); long vowels written either way compare equal."""
    out = []
    for ap in query['accent_phrases']:
        for m in ap['moras']:
            c, v = m.get('consonant') or '', m['vowel']
            prev = out[-1][1] if out else ''
            if m['text'] == 'ー' or (not c and ((v == 'i' and prev == 'e') or (v == 'u' and prev == 'o'))):
                v = prev
                c = ''
            out.append((c, v))
    return out


def main():
    lines = json.load(open(sys.argv[1], encoding='utf-8'))
    os.makedirs(OUT, exist_ok=True)
    ids = {w: style_id(n) for w, n in SPEAKER.items()}
    done, fixed = 0, 0
    tmp = os.path.join(tempfile.gettempdir(), 'tk_voice.wav')
    for i, ln in enumerate(lines):
        dst = os.path.join(OUT, ln['key'] + '.m4a')
        if os.path.exists(dst):
            done += 1
            continue
        sid = ids[ln['who']]
        q_kana = json.loads(call('/audio_query', text=ln['kana'], speaker=sid))
        q = q_kana
        if ln['kanji'] != ln['kana']:
            q_kanji = json.loads(call('/audio_query', text=ln['kanji'], speaker=sid))
            if sounds(q_kanji) == sounds(q_kana):
                q = q_kanji
            else:
                fixed += 1
        q['speedScale'] = SPEED[ln['who']]
        q['outputSamplingRate'] = 24000
        open(tmp, 'wb').write(call('/synthesis', q, speaker=sid))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-ac', '1', '-c:a', 'aac', '-b:a', '32k', dst], check=True)
        done += 1
        if i % 50 == 0:
            print(f'{done}/{len(lines)} recorded (furigana used: {fixed})', flush=True)
    keys = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith('.m4a'))
    json.dump(keys, open(os.path.join(ROOT, 'data', 'voice.json'), 'w'), separators=(',', ':'))
    print(f'done {done}/{len(lines)}, furigana used {fixed}, index {len(keys)}')


if __name__ == '__main__':
    main()
