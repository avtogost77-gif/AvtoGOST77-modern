#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://avtogost77.ru"

add_in_head_once() {
  local file="$1"; shift
  local marker="$1"; shift
  local insert_block="$1"; shift || true
  if ! grep -qiE "$marker" "$file"; then
    # insert before </head>
    perl -0777 -pe "s#</head>#$insert_block\n</head>#is" -i "$file"
  fi
}

ensure_analytics() {
  local file="$1"
  if ! grep -q 'G-EMQ3D0X8K7' "$file"; then
    cat >> "$file" <<'ANA'
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-EMQ3D0X8K7"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-EMQ3D0X8K7');
    </script>
    <!-- /Google Analytics -->
    
    <!-- Yandex.Metrika -->
    <script type="text/javascript">
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(103413788, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
    </script>
    <noscript><div><img loading="lazy" src="https://mc.yandex.ru/watch/103413788" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika -->
ANA
  fi
}

ensure_og_and_canonical() {
  local file="$1" path url title desc ogblock canblock
  # Build URL
  if [[ "$file" == "index.html" ]]; then
    path="/"
  else
    path="/${file}"
  fi
  url="${BASE_URL}${path}"

  # Extract title and description
  title=$(grep -oP '(?is)(?<=<title>).*?(?=</title>)' "$file" | head -1 | sed 's/[\t ]\+/ /g; s/^ //; s/ $//')
  desc=$(grep -oP '(?is)<meta\s+name="description"\s+content="\K[^"]*' "$file" | head -1)

  # Canonical
  if ! grep -qi '<link[^>]*rel="canonical"' "$file"; then
    canblock="    <link rel=\"canonical\" href=\"${url}\">"
    add_in_head_once "$file" 'rel="canonical"' "$canblock"
  fi

  # OG minimal set if missing
  if ! grep -qi 'property="og:title"' "$file"; then
    ogblock=$(cat <<EOF
    <!-- Open Graph fallback -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${BASE_URL}/assets/img/hero-logistics.webp">
EOF
)
    add_in_head_once "$file" 'property="og:title"' "$ogblock"
  fi
}

ensure_preconnects() {
  local file="$1"
  local block='
    <!-- Preconnect for analytics -->
    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="preconnect" href="https://mc.yandex.ru">
  '
  add_in_head_once "$file" 'gooogletagmanager|mc.yandex.ru' "$block"
}

process_file() {
  local f="$1"
  # Ensure blocks before </head>
  ensure_preconnects "$f"
  ensure_og_and_canonical "$f"
  # Ensure analytics before </body>
  if ! grep -q 'G-EMQ3D0X8K7' "$f" || ! grep -q 'ym(103413788' "$f"; then
    # Insert before </body>
    perl -0777 -pe 's#</body>#\n<!-- Analytics Injection -->\n#is' -i "$f" 2>/dev/null || true
    # If marker not inserted, append at end
    ensure_analytics "$f"
  fi
}

main() {
  shopt -s nullglob
  files=( *.html )
  blogfiles=( blog/*.html )
  files=( "${files[@]}" "${blogfiles[@]}" )
  for f in "${files[@]}"; do
    [[ -f "$f" ]] || continue
    process_file "$f"
  done

  # robots.txt Host directive
  if [[ -f robots.txt ]] && ! grep -qi '^Host:' robots.txt; then
    { echo 'Host: avtogost77.ru'; cat robots.txt; } > robots.txt.tmp && mv robots.txt.tmp robots.txt
  fi

  echo "Processed ${#files[@]} HTML files."
}

main "$@"


