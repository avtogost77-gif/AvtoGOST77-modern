#!/usr/bin/env bash
set -euo pipefail

BASE="https://avtogost77.ru"
DATE="$(date +%F)"
REPORT="PROD-UX-SEO-REPORT-${DATE}.md"
TMPDIR="$(mktemp -d)"

cleanup() { rm -rf "$TMPDIR" || true; }
trap cleanup EXIT

curl -s "$BASE/sitemap.xml" > "$TMPDIR/sitemap.xml"

mapfile -t URLS < <(grep -oP '(?<=<loc>)[^<]+' "$TMPDIR/sitemap.xml" | sed 's#\r##')

echo "# Отчёт по продакшену (UX/SEO) — ${DATE}" > "$REPORT"
echo "Всего URL: ${#URLS[@]}" >> "$REPORT"
echo "" >> "$REPORT"

touch \
  "$TMPDIR/miss_title" "$TMPDIR/long_title" \
  "$TMPDIR/miss_desc" "$TMPDIR/short_desc" "$TMPDIR/long_desc" \
  "$TMPDIR/miss_h1" "$TMPDIR/multi_h1" \
  "$TMPDIR/bad_canon" "$TMPDIR/robots_noindex" \
  "$TMPDIR/miss_og" "$TMPDIR/miss_ga" "$TMPDIR/miss_ym" \
  "$TMPDIR/miss_redesign"

for u in "${URLS[@]}"; do
  html="$(curl -sL "$u" | tr -d '\r')"

  # title
  title="$(grep -oP '(?is)(?<=<title>).*?(?=</title>)' <<< "$html" | head -1 | sed 's/[\t ]\+/ /g' | sed 's/^ //; s/ $//')"
  if [[ -z "$title" ]]; then
    echo "$u" >> "$TMPDIR/miss_title"
  else
    tl=$(printf %s "$title" | wc -m)
    if (( tl > 65 )); then echo "$u ($tl)" >> "$TMPDIR/long_title"; fi
  fi

  # description
  desc="$(grep -oP '(?is)<meta\s+name="description"\s+content="\K[^"]*' <<< "$html" | head -1)"
  if [[ -z "$desc" ]]; then
    echo "$u" >> "$TMPDIR/miss_desc"
  else
    dl=$(printf %s "$desc" | wc -m)
    if (( dl < 120 )); then echo "$u ($dl)" >> "$TMPDIR/short_desc"; fi
    if (( dl > 180 )); then echo "$u ($dl)" >> "$TMPDIR/long_desc"; fi
  fi

  # H1 count
  h1count=$(grep -io '<h1[^>]*>' <<< "$html" | wc -l | awk '{print $1}')
  if [[ "$h1count" == "0" ]]; then echo "$u" >> "$TMPDIR/miss_h1"; fi
  if (( h1count > 1 )); then echo "$u ($h1count)" >> "$TMPDIR/multi_h1"; fi

  # canonical
  canon="$(grep -oP '(?is)<link\s+rel="canonical"[^>]*href="\K[^"]+' <<< "$html" | head -1)"
  if [[ -n "$canon" ]]; then
    nu="${u%/}"; nc="${canon%/}"
    if [[ "$nu" != "$nc" ]]; then echo "$u -> $canon" >> "$TMPDIR/bad_canon"; fi
  fi

  # robots noindex
  if grep -qi '<meta[^>]*name="robots"[^>]*noindex' <<< "$html"; then echo "$u" >> "$TMPDIR/robots_noindex"; fi

  # Open Graph minimal check
  if ! grep -qi 'property="og:title"' <<< "$html"; then echo "$u" >> "$TMPDIR/miss_og"; fi

  # Analytics
  if ! grep -q 'G-EMQ3D0X8K7' <<< "$html"; then echo "$u" >> "$TMPDIR/miss_ga"; fi
  if ! grep -q 'ym(103413788' <<< "$html" && ! grep -q 'mc.yandex.ru/watch/103413788' <<< "$html"; then echo "$u" >> "$TMPDIR/miss_ym"; fi

  # Redesign CSS
  if ! grep -q 'assets/css/redesign-fixes.css' <<< "$html"; then echo "$u" >> "$TMPDIR/miss_redesign"; fi
done

section() {
  local title="$1"; shift
  local file="$1"
  local count=0
  if [[ -f "$file" ]]; then count=$(wc -l < "$file" | awk '{print $1}'); fi
  echo "## ${title}" >> "$REPORT"
  echo "Найдено: ${count}" >> "$REPORT"
  if (( count > 0 )); then echo "" >> "$REPORT"; sed -e 's/^/- /' "$file" >> "$REPORT"; fi
  echo "" >> "$REPORT"
}

section "Нет <title>" "$TMPDIR/miss_title"
section "Длинный <title> (>65)" "$TMPDIR/long_title"
section "Нет meta description" "$TMPDIR/miss_desc"
section "Короткий description (<120)" "$TMPDIR/short_desc"
section "Длинный description (>180)" "$TMPDIR/long_desc"
section "Нет H1" "$TMPDIR/miss_h1"
section "Несколько H1" "$TMPDIR/multi_h1"
section "Каноникал не совпадает с URL" "$TMPDIR/bad_canon"
section "Robots: noindex на странице" "$TMPDIR/robots_noindex"
section "Нет Open Graph" "$TMPDIR/miss_og"
section "Нет GA (G-EMQ3D0X8K7)" "$TMPDIR/miss_ga"
section "Нет YM (103413788)" "$TMPDIR/miss_ym"
section "Нет redesign-fixes.css" "$TMPDIR/miss_redesign"

echo "Готово: $REPORT"

