#!/bin/bash

# Update JavaScript Links Script
# Заменяем множественные JS ссылки на объединенный файл

echo "🔗 Обновляем JavaScript ссылки в HTML файлах..."

# Создаем backup
backup_dir="backup-html-js-links-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
find . -name "*.html" -exec cp {} "$backup_dir/" \;
echo "✅ Backup создан: $backup_dir"

# Список файлов для замены
files_to_replace=(
    "assets/js/main.min.js"
    "assets/js/calculator-ui.min.js"
    "assets/js/form-handler.min.js"
    "assets/js/sticky-cta.js"
    "assets/js/ab-test-headers.js"
    "assets/js/animated-counter.js"
    "assets/js/benefit.js"
    "assets/js/mobile-collapse.min.js"
    "assets/js/lazy-loading.min.js"
    "assets/js/ticker.js"
    "assets/js/ux-improvements.js"
    "assets/js/schema-optimizer.js"
)

# Обрабатываем каждый HTML файл
find . -name "*.html" | while read -r file; do
    echo "📝 Обрабатываем: $file"
    
    # Создаем временный файл
    temp_file=$(mktemp)
    
    # Копируем содержимое
    cp "$file" "$temp_file"
    
    # Заменяем множественные JS ссылки на объединенный
    awk '
    BEGIN {
        js_replaced = 0
        in_head = 0
        in_body = 0
    }
    /<head>/ { in_head = 1 }
    /<\/head>/ { in_head = 0 }
    /<body>/ { in_body = 1 }
    /<\/body>/ { in_body = 0 }
    
    # В head секции
    in_head && /<script[^>]*src="assets\/js\/(main|calculator-ui|form-handler|sticky-cta|ab-test-headers|animated-counter|benefit|mobile-collapse|lazy-loading|ticker|ux-improvements|schema-optimizer)/ {
        if (js_replaced == 0) {
            print "    <script src=\"assets/js/unified-main.min.js?v=20250814-optimized\" defer></script>"
            js_replaced = 1
        } else {
            next # Пропускаем остальные JS файлы
        }
    }
    
    # В body секции
    in_body && /<script[^>]*src="assets\/js\/(main|calculator-ui|form-handler|sticky-cta|ab-test-headers|animated-counter|benefit|mobile-collapse|lazy-loading|ticker|ux-improvements|schema-optimizer)/ {
        if (js_replaced == 0) {
            print "    <script src=\"assets/js/unified-main.min.js?v=20250814-optimized\" defer></script>"
            js_replaced = 1
        } else {
            next # Пропускаем остальные JS файлы
        }
    }
    
    # Оставляем остальные строки без изменений
    { print }
    ' "$temp_file" > "$file"
    
    # Удаляем временный файл
    rm "$temp_file"
    
    echo "✅ Обновлен: $file"
done

echo ""
echo "✅ Все HTML файлы обновлены!"
echo "📊 Заменено ссылок на JS файлы на объединенный unified-main.min.js"
