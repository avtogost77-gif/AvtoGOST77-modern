#!/bin/bash

echo "🚀 Создаю мобильные версии для оставшихся 73 страниц..."

# Читаем список страниц
while IFS= read -r page; do
    if [ -f "$page" ]; then
        mobile_page="${page%.html}-mobile.html"
        
        echo "📱 Создаю мобильную версию для: $page"
        
        # Создаем мобильную версию с SEO защитой
        cp "$page" "$mobile_page"
        
        # Добавляем SEO защиту в head
        sed -i '/<head>/a\
    <!-- 📱 МОБИЛЬНАЯ ВЕРСИЯ - SEO ЗАЩИТА -->\
    <meta name="robots" content="noindex, nofollow">\
    <meta name="googlebot" content="noindex, nofollow">\
    <meta name="yandex" content="noindex, nofollow">\
    <link rel="canonical" href="https://avtogost77.ru/'$page'">' "$mobile_page"
        
        # Добавляем мобильный редирект скрипт
        sed -i '/<head>/a\
    <script>\
    if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i) || window.innerWidth < 768) {\
        window.location.href = "'$page'";\
    }\
    </script>' "$mobile_page"
        
        echo "✅ Создана: $mobile_page"
    fi
done < remaining-pages.txt

echo "🎉 Все мобильные версии созданы!"
echo "📊 Статистика:"
echo "   - Всего страниц: $(ls *.html | grep -v backup | grep -v test | grep -v debug | grep -v new | grep -v performance-backup | wc -l)"
echo "   - Мобильных версий: $(ls *-mobile.html | wc -l)"
