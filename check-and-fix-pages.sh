#!/bin/bash

# Скрипт для проверки и исправления всех HTML страниц
echo "🔍 Проверяю все HTML страницы на предмет проблем..."

# Список проблемных страниц
PROBLEM_PAGES=()

# Проверяем каждую HTML страницу
find . -maxdepth 1 -name "*.html" | while read file; do
    echo "📄 Проверяю: $file"
    
    # Проверяем наличие hero секции
    if grep -q "hero" "$file"; then
        echo "  ✅ Найдена hero секция"
        
        # Проверяем порядок загрузки CSS
        if grep -q "critical-fixes.css" "$file"; then
            # Проверяем, загружается ли critical-fixes.css в конце
            last_css_line=$(grep -n "critical-fixes.css" "$file" | tail -1 | cut -d: -f1)
            head_line=$(grep -n "</head>" "$file" | cut -d: -f1)
            
            if [ -n "$last_css_line" ] && [ -n "$head_line" ]; then
                if [ "$last_css_line" -lt "$head_line" ]; then
                    echo "  ⚠️  critical-fixes.css загружается не в конце"
                    PROBLEM_PAGES+=("$file")
                else
                    echo "  ✅ critical-fixes.css загружается в конце"
                fi
            fi
        fi
        
        # Проверяем наличие мобильного меню
        if grep -q "mobile-menu" "$file"; then
            echo "  ⚠️  Найдено мобильное меню"
            PROBLEM_PAGES+=("$file")
        fi
    fi
done

echo ""
echo "📋 Результаты проверки:"
echo "Проблемные страницы: ${PROBLEM_PAGES[@]}"

# Исправляем проблемы
echo ""
echo "🔧 Исправляю проблемы..."

for file in "${PROBLEM_PAGES[@]}"; do
    echo "🔧 Исправляю: $file"
    
    # 1. Перемещаем critical-fixes.css в конец
    if grep -q "critical-fixes.css" "$file"; then
        # Удаляем старую ссылку на critical-fixes.css
        sed -i '/critical-fixes\.css/d' "$file"
        
        # Добавляем в конец перед </head>
        sed -i 's|</head>|    <!-- КРИТИЧНЫЕ СТИЛИ ДЛЯ ОТОБРАЖЕНИЯ - ОБХОД КЭША (ПОСЛЕДНИЕ) -->\n    <link rel="stylesheet" href="assets/css/critical-fixes.css?v=20250826-mobile-hero-fix">\n</head>|' "$file"
    fi
    
    # 2. Обновляем версию CSS файла
    sed -i 's/critical-fixes\.css?v=[^"]*/critical-fixes.css?v=20250826-mobile-hero-fix/g' "$file"
    
    echo "  ✅ Исправлено"
done

echo ""
echo "🎉 Проверка и исправление завершены!"
