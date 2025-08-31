#!/bin/bash

echo "🚀 СОЗДАНИЕ МОБИЛЬНЫХ ВЕРСИЙ ДЛЯ ОСТАВШИХСЯ СТРАНИЦ"
echo "=================================================="

# Проверяем статистику
echo "📊 СТАТИСТИКА:"
echo "   - HTML страниц в sitemap: 66"
echo "   - Создано мобильных версий: $(ls *-mobile.html | wc -l)"
echo "   - Осталось создать: $(cat missing-mobile-pages.txt | wc -l)"

echo ""
echo "⚡ СОЗДАЮ МОБИЛЬНЫЕ ВЕРСИИ..."

# Создаем мобильные версии для всех оставшихся страниц
while IFS= read -r page; do
    if [ -f "$page" ]; then
        echo "   📱 Создаю: $page -> ${page%.html}-mobile.html"
        
        # Создаем мобильную версию с SEO защитой
        cp "$page" "${page%.html}-mobile.html"
        
        # Добавляем SEO защиту в head
        sed -i '/<head>/a\
    <!-- 📱 PWA метатеги -->\
    <meta name="theme-color" content="#2D67F8">\
    <link rel="icon" type="image/svg+xml" href="favicon.svg">\
    \
    <!-- 🔍 SEO метатеги -->\
    <link rel="canonical" href="https://avtogost77.ru/'${page%.html}'.html">\
    <meta name="robots" content="noindex, nofollow">\
    <meta name="googlebot" content="noindex, nofollow">\
    <meta name="yandex" content="noindex, nofollow">' "${page%.html}-mobile.html"
        
        # Добавляем мобильный редирект скрипт
        sed -i '/<head>/a\
    <!-- 📱 Мобильный редирект -->\
    <script>\
    (function() {\
        if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i) || window.innerWidth < 768) {\
            if (!window.location.href.includes("-mobile.html")) {\
                window.location.href = window.location.href.replace(".html", "-mobile.html");\
            }\
        }\
    })();\
    </script>' "${page%.html}-mobile.html"
        
    else
        echo "   ❌ Файл не найден: $page"
    fi
done < missing-mobile-pages.txt

echo ""
echo "✅ ГОТОВО! Создано мобильных версий: $(ls *-mobile.html | wc -l)"
echo "📊 Финальная статистика:"
echo "   - Всего HTML страниц в sitemap: 66"
echo "   - Создано мобильных версий: $(ls *-mobile.html | wc -l)"
echo "   - Покрытие: $(( $(ls *-mobile.html | wc -l) * 100 / 66 ))%"
