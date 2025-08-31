#!/bin/bash

echo "🚀 СОЗДАНИЕ МОБИЛЬНЫХ ВЕРСИЙ ДЛЯ ОСТАВШИХСЯ СТРАНИЦ ИЗ SITEMAP"
echo "================================================================"
echo "   - Всего страниц в sitemap: 68"
echo "   - Уже создано мобильных: $(ls *-mobile.html | wc -l)"
echo "   - Осталось создать: $(wc -l < missing-mobile-pages.txt)"
echo ""

# Счетчик созданных файлов
created=0
total=$(wc -l < missing-mobile-pages.txt)

while IFS= read -r page; do
    if [ -f "$page" ]; then
        mobile_page="${page%.html}-mobile.html"
        
        echo "📱 Создаю мобильную версию: $page → $mobile_page"
        
        # Создаем мобильную версию с SEO защитой
        cp "$page" "$mobile_page"
        
        # Добавляем SEO защиту (noindex, nofollow)
        sed -i 's/<meta name="robots" content="[^"]*"/<meta name="robots" content="noindex, nofollow"/g' "$mobile_page"
        sed -i 's/<meta name="googlebot" content="[^"]*"/<meta name="googlebot" content="noindex, nofollow"/g' "$mobile_page"
        sed -i 's/<meta name="yandex" content="[^"]*"/<meta name="yandex" content="noindex, nofollow"/g' "$mobile_page"
        
        # Добавляем мобильные оптимизации в head
        sed -i '/<head>/a\
    <!-- 🚀 МОБИЛЬНЫЕ ОПТИМИЗАЦИИ -->\
    <link rel="stylesheet" href="mobile-performance.css?v=20250829-mobile">\
    <script src="mobile-performance.js?v=20250829-mobile" defer></script>' "$mobile_page"
        
        created=$((created + 1))
        echo "   ✅ Создано: $created/$total"
    else
        echo "   ⚠️  Файл не найден: $page"
    fi
done < missing-mobile-pages.txt

echo ""
echo "🎉 ЗАВЕРШЕНО!"
echo "================================================================"
echo "   - Создано мобильных версий: $created"
echo "   - Всего мобильных версий: $(ls *-mobile.html | wc -l)"
echo "   - Всего страниц в sitemap: 68"
echo ""
echo "📊 СТАТУС: $(ls *-mobile.html | wc -l)/68 страниц имеют мобильные версии"
