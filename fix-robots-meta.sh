#!/bin/bash

echo "🤖 БЫСТРЫЙ ФИКС: ДОБАВЛЯЕМ ROBOTS META"
echo "===================================="

# Список критичных страниц без robots meta
PAGES=(
    "about.html"
    "contact.html" 
    "track.html"
    "sbornye-gruzy.html"
    "gruzoperevozki-po-moskve.html"
    "privacy.html"
    "dogruz.html"
    "poputnyj-gruz.html"
)

echo "📦 Создаем бэкап..."
mkdir -p backups
cp *.html backups/ 2>/dev/null

FIXED=0

# Фиксим основные страницы
for page in "${PAGES[@]}"; do
    if [[ -f "$page" ]]; then
        echo "🔧 Обрабатываем: $page"
        
        # Проверяем есть ли уже robots meta
        if ! grep -q 'name="robots"' "$page"; then
            # Добавляем robots meta после charset
            sed -i '/<meta charset=/a\    <meta name="robots" content="index, follow">' "$page"
            echo "  ✅ Добавлен robots meta"
            ((FIXED++))
        else
            echo "  ⚠️ robots meta уже есть"
        fi
    fi
done

echo ""
echo "🎉 ИСПРАВЛЕНО: $FIXED файлов"
echo "🔍 Проверяем результат..."
grep -l 'name="robots"' *.html | wc -l


