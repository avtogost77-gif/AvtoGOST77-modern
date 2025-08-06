#!/bin/bash

echo "🚀 Подготовка чистого деплоя АвтоГОСТ (без автогена)"
echo "=================================================="

# Создаем директорию для деплоя
DEPLOY_DIR="avtogost-clean-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

echo "📁 Создана директория: $DEPLOY_DIR"

# Копируем основные HTML файлы
echo "📄 Копируем основные страницы..."
cp index.html "$DEPLOY_DIR/"
cp about.html "$DEPLOY_DIR/"
cp services.html "$DEPLOY_DIR/"
cp contact.html "$DEPLOY_DIR/"
cp help.html "$DEPLOY_DIR/"
cp faq.html "$DEPLOY_DIR/"
cp privacy.html "$DEPLOY_DIR/"
cp terms.html "$DEPLOY_DIR/"
cp track.html "$DEPLOY_DIR/"
cp 404.html "$DEPLOY_DIR/"

# Копируем блог статьи
echo "📝 Копируем блог..."
cp blog-*.html "$DEPLOY_DIR/"
mkdir -p "$DEPLOY_DIR/blog"
cp blog/index.html "$DEPLOY_DIR/blog/"

# Копируем новые страницы
echo "🆕 Копируем новые страницы..."
cp transportnaya-kompaniya.html "$DEPLOY_DIR/"
cp sbornye-gruzy.html "$DEPLOY_DIR/"
cp dostavka-na-marketpleysy.html "$DEPLOY_DIR/"
cp rc-dostavka.html "$DEPLOY_DIR/"
cp gruzoperevozki-*.html "$DEPLOY_DIR/"
cp logistika-dlya-biznesa.html "$DEPLOY_DIR/"
cp urgent-delivery.html "$DEPLOY_DIR/"
cp self-employed-delivery.html "$DEPLOY_DIR/"
cp ip-small-business-delivery.html "$DEPLOY_DIR/"

# Копируем конфигурационные файлы
echo "⚙️ Копируем конфигурацию..."
cp robots.txt "$DEPLOY_DIR/"
cp sitemap.xml "$DEPLOY_DIR/"
cp .htaccess "$DEPLOY_DIR/"
cp manifest.json "$DEPLOY_DIR/"
cp browserconfig.xml "$DEPLOY_DIR/"
cp favicon.svg "$DEPLOY_DIR/"
cp sw.js "$DEPLOY_DIR/"

# Копируем assets
echo "🎨 Копируем assets..."
cp -r assets "$DEPLOY_DIR/"

# Копируем RSS и YML фиды
echo "📡 Копируем фиды..."
cp turbo-rss.xml "$DEPLOY_DIR/"
cp yandex-*.yml "$DEPLOY_DIR/"
cp yandex-*.json "$DEPLOY_DIR/"

# Создаем файл версии
echo "📌 Создаем файл версии..."
echo "Deploy date: $(date)" > "$DEPLOY_DIR/version.txt"
echo "Total pages: $(find "$DEPLOY_DIR" -name "*.html" | wc -l)" >> "$DEPLOY_DIR/version.txt"

# Создаем архив
echo "📦 Создаем архив..."
zip -r "$DEPLOY_DIR.zip" "$DEPLOY_DIR"

# Показываем статистику
echo ""
echo "✅ Деплой готов!"
echo "📊 Статистика:"
echo "   - HTML файлов: $(find "$DEPLOY_DIR" -name "*.html" | wc -l)"
echo "   - Размер архива: $(du -h "$DEPLOY_DIR.zip" | cut -f1)"
echo "   - Архив: $DEPLOY_DIR.zip"

# Очищаем временную директорию
rm -rf "$DEPLOY_DIR"