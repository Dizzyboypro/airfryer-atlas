#!/usr/bin/env bash
# Публикует собранный каталог в ветку gh-pages (источник GitHub Pages).
set -euo pipefail

cd "$(dirname "$0")/.."
remote="$(git remote get-url origin)"

GH_PAGES=1 npm run build

cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push -q --force "$remote" gh-pages
