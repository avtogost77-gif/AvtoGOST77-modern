#!/bin/bash
# Скрипт для добавления новых страниц городов в sitemap.xml

echo "🗺️ Обновление sitemap.xml с новыми страницами городов..."

# Создаем временный файл
cp sitemap.xml sitemap.xml.backup

# Массив новых страниц городов
cities=(
    "gruzoperevozki-moskva-kazan.html"
    "gruzoperevozki-moskva-nizhny-novgorod.html"
    "gruzoperevozki-moskva-rostov.html"
    "gruzoperevozki-moskva-samara.html"
    "gruzoperevozki-moskva-ufa.html"
    "gruzoperevozki-moskva-ekaterinburg.html"
    "gruzoperevozki-moskva-novosibirsk.html"
    "gruzoperevozki-moskva-krasnodar.html"
    "gruzoperevozki-moskva-chelyabinsk.html"
    "gruzoperevozki-moskva-omsk.html"
    "gruzoperevozki-moskva-perm.html"
)

# Находим позицию перед закрывающим тегом </urlset>
closing_tag_line=$(grep -n "</urlset>" sitemap.xml | cut -d: -f1)

# Создаем новый sitemap.xml
head -n $((closing_tag_line - 1)) sitemap.xml > sitemap_new.xml

# Добавляем новые страницы
for city_page in "${cities[@]}"; do
    echo "  <url>" >> sitemap_new.xml
    echo "    <loc>https://avtogost77.ru/$city_page</loc>" >> sitemap_new.xml
    echo "    <lastmod>$(date +%Y-%m-%d)</lastmod>" >> sitemap_new.xml
    echo "    <changefreq>weekly</changefreq>" >> sitemap_new.xml
    echo "    <priority>0.8</priority>" >> sitemap_new.xml
    echo "  </url>" >> sitemap_new.xml
done

# Добавляем закрывающий тег
echo "</urlset>" >> sitemap_new.xml

# Заменяем старый sitemap новым
mv sitemap_new.xml sitemap.xml

echo "✅ Sitemap.xml обновлен!"
echo "📊 Добавлено ${#cities[@]} новых страниц"
echo "📋 Список добавленных страниц:"
for city_page in "${cities[@]}"; do
    echo "   - $city_page"
done

echo ""
echo "🚀 Sitemap готов к деплою!"
