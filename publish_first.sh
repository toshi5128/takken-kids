#!/usr/bin/env bash
# 初回公開用：GitHubに公開リポジトリ toshi5128/takken-kids を作り、push して GitHub Pages をオンにする
set -e
cd "$(dirname "$0")"
git branch -M main
T=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill | sed -n 's/^password=//p')
H=(-H "Authorization: token $T" -H "Accept: application/vnd.github+json")

code=$(curl -s -o /tmp/tk_create.json -w "%{http_code}" "${H[@]}" https://api.github.com/user/repos \
  -d '{"name":"takken-kids","description":"Kids study app for the takken exam","private":false}')
if [ "$code" = "201" ]; then echo "1/3 リポジトリ作成OK"
elif grep -q "already exists" /tmp/tk_create.json; then echo "1/3 リポジトリは作成済み"
else echo "1/3 失敗 (HTTP $code)"; cat /tmp/tk_create.json; exit 1; fi

git remote add origin https://github.com/toshi5128/takken-kids.git 2>/dev/null || true
git push -u origin main && echo "2/3 push OK"

code=$(curl -s -o /tmp/tk_pages.json -w "%{http_code}" "${H[@]}" https://api.github.com/repos/toshi5128/takken-kids/pages \
  -d '{"source":{"branch":"main","path":"/"}}')
if [ "$code" = "201" ] || [ "$code" = "409" ]; then echo "3/3 公開OK → https://toshi5128.github.io/takken-kids/ （反映まで1〜2分）"
else echo "3/3 失敗 (HTTP $code)"; cat /tmp/tk_pages.json; exit 1; fi
