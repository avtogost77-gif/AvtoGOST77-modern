#!/bin/bash
# Скрипт для исправления CSS во всех страницах

echo "🔧 ИСПРАВЛЕНИЕ CSS ВО ВСЕХ СТРАНИЦАХ..."

# Массив HTML файлов для исправления (исключаем backup директории)
html_files=($(find . -maxdepth 1 -name "*.html" -not -path "./backup*" -not -path "./mega-cleanup-backup*" -not -path "./inline-styles-backup*" -not -path "./canonical-fix-backup*" -not -path "./schema-fix-backup*" -not -path "./seo-fix-backup*" -not -path "./blog-fix-backup*" -not -path "./mobile-cleanup-backup*"))

echo ""
echo "📄 Найдено HTML файлов для исправления: ${#html_files[@]}"

echo ""
echo "🔧 Исправляем CSS ссылки..."

for file in "${html_files[@]}"; do
    echo "   📄 Исправляем: $file"
    
    # Обновляем версии CSS файлов
    sed -i 's|master-styles.min.css?v=20250825-clean|master-styles.min.css?v=20250826-urgent|g' "$file"
    sed -i 's|unified-site-styles.css?v=20250825-clean|unified-site-styles.css?v=20250826-urgent|g' "$file"
    
    # Добавляем critical-fixes.css если его нет
    if ! grep -q "critical-fixes.css" "$file"; then
        sed -i '/mobile-optimized.css/a\    <!-- КРИТИЧНЫЕ СТИЛИ ДЛЯ ОТОБРАЖЕНИЯ - ОБХОД КЭША -->\n    <link rel="stylesheet" href="assets/css/critical-fixes.css?v=20250826-urgent">' "$file"
    fi
done

echo ""
echo "✅ CSS исправлен во всех файлах!"
echo "📊 Статистика:"
echo "   - Обработано файлов: ${#html_files[@]}"
echo "   - Обновлены версии CSS"
echo "   - Добавлен critical-fixes.css"
echo ""
echo "�� Готово к деплою!"
