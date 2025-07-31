#!/bin/bash

set -e

echo "📦 Сборка чистого архива для деплоя"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TEMP_DIR="deploy_payload"
ZIP_NAME="AVTOGOST-CLEAN-DEPLOY-${TIMESTAMP}.zip"

rm -rf "$TEMP_DIR" "$ZIP_NAME"
mkdir -p "$TEMP_DIR"

# ────────────────────────────────────────────────
# 1. Копируем все .html в корень проекта
# ────────────────────────────────────────────────
echo "📄 Собираю HTML страницы…"
find . -maxdepth 1 -type f -name "*.html" -exec cp {} "$TEMP_DIR/" \;

# ────────────────────────────────────────────────
# 2. Копируем sitemap, robots, конфиги, сервис-файлы
# ────────────────────────────────────────────────
for f in sitemap.xml robots.txt .htaccess manifest.json sw.js dadata-config.js favicon.svg; do
  [[ -f "$f" ]] && cp "$f" "$TEMP_DIR/"
done

# ────────────────────────────────────────────────
# 3. Копируем директории assets (css/js/img)
# ────────────────────────────────────────────────
echo "🎨 Копирую assets…"
mkdir -p "$TEMP_DIR/assets"
cp -R assets/css "$TEMP_DIR/assets/" 2>/dev/null || true
cp -R assets/js  "$TEMP_DIR/assets/" 2>/dev/null || true
cp -R assets/img "$TEMP_DIR/assets/" 2>/dev/null || true

# ────────────────────────────────────────────────
# 4. Создаём ZIP
# ────────────────────────────────────────────────
cd "$TEMP_DIR"
zip -qr "../$ZIP_NAME" .
cd - >/dev/null

rm -rf "$TEMP_DIR"

echo "✅ Архив создан: $ZIP_NAME"
ls -lh "$ZIP_NAME"