# たっけんクエスト

小学生が宅建（宅地建物取引士）を楽しく学ぶためのスマホ用学習アプリ。目標：2027年10月の試験。

- 内容は `content/` に普通の文章で書く → `python tools/build.py` で `data/course.json` を作る
  - 漢字にはすべてふりがなを自動で付ける（読みの間違いは build.py の READING_FIX で直す。`--check` で全読みを表示）
  - `content/words.json` の言葉は本文中で黄色になり、タップで意味とたとえが出る（言葉ずかんのカードにもなる）
- キャラクターの絵は `chara/<neko|mirai>_<normal|happy|surprise|think|sad>.png`。無いあいだはSVGの仮の絵を表示
- 記録はスマホの中（localStorage）だけ。名前もアプリ内に保存し、ソースには書かない
- 問題・解説はすべてオリジナル（教科書・過去問の転載ではない）
