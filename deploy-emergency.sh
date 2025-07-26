#!/bin/bash

# ЭКСТРЕННЫЙ ДЕПЛОЙ - ФИКСИМ СЛОМАННЫЙ САЙТ
echo "🚨 ЭКСТРЕННЫЙ ДЕПЛОЙ AVTOGOST77"
echo "================================"

# Проверка критических файлов
echo "📋 Проверка критических файлов..."
CRITICAL_FILES=(
    "index.html"
    "assets/css/main.css"
    "assets/css/mobile.css"
    "assets/js/main.js"
    "assets/js/calc.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - OK"
    else
        echo "❌ $file - ОТСУТСТВУЕТ!"
        exit 1
    fi
done

# Создание robots.txt если его нет
if [ ! -f "robots.txt" ]; then
    echo "📝 Создаю robots.txt..."
    cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Sitemap: https://avtogost77.ru/sitemap.xml

# Запрещаем индексацию служебных файлов
Disallow: /assets/js/
Disallow: /*.json$
Disallow: /*.sh$
EOF
fi

# Создание простого sitemap.xml
echo "🗺️ Создаю sitemap.xml..."
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://avtogost77.ru/</loc>
        <lastmod>2024-07-26</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://avtogost77.ru/#calculator</loc>
        <lastmod>2024-07-26</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://avtogost77.ru/#services</loc>
        <lastmod>2024-07-26</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://avtogost77.ru/#contact</loc>
        <lastmod>2024-07-26</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>
EOF

echo "✅ SEO файлы созданы!"

# Запрос подтверждения
echo ""
echo "🚀 Готов к деплою на хостинг!"
echo "Файлы будут загружены в: /var/www/u3207373/data/www/avtogost77.ru"
echo ""
read -p "Продолжить? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Деплой отменен"
    exit 1
fi

# Запуск деплоя через SFTP
echo "🔄 Запускаю загрузку..."
./upload_sftp_fixed.sh

echo "✅ ЭКСТРЕННЫЙ ДЕПЛОЙ ЗАВЕРШЕН!"
echo ""
echo "📊 Дальнейшие действия:"
echo "1. Проверить сайт: https://avtogost77.ru"
echo "2. Проверить мобильную версию"
echo "3. Протестировать формы"
echo "4. Проверить калькулятор"
echo ""
echo "После проверки можно спокойно работать над ULTIMATE версией! 🚀"