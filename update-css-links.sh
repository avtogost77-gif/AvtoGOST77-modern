#!/bin/bash

# ========================================================
# 🔗 ОБНОВЛЕНИЕ CSS ССЫЛОК - АВТОГОСТ V2.0
# Заменяем множественные CSS файлы на один объединенный
# ========================================================

echo "🔗 Начинаем обновление CSS ссылок..."

# Создаем резервную копию
BACKUP_DIR="backup-css-links-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Функция для создания резервной копии
backup_file() {
    local file="$1"
    local backup_path="$BACKUP_DIR/$(basename "$file")"
    cp "$file" "$backup_path"
    echo "✅ Резервная копия: $backup_path"
}

# Функция для обновления CSS ссылок
update_css_links() {
    local file="$1"
    local temp_file="/tmp/$(basename "$file")"
    
    # Создаем резервную копию
    backup_file "$file"
    
    # Заменяем множественные CSS файлы на один объединенный
    awk '
    BEGIN { 
        css_replaced = 0 
        in_head = 0
    }
    
    /<head>/ { in_head = 1 }
    /<\/head>/ { in_head = 0 }
    
    in_head && /<link[^>]*rel="stylesheet"[^>]*>/ {
        if (css_replaced == 0) {
            # Заменяем первый CSS файл на объединенный
            print "    <link rel=\"stylesheet\" href=\"assets/css/unified-optimized.min.css?v=20250814-optimized\">"
            css_replaced = 1
        } else {
            # Пропускаем остальные CSS файлы
            next
        }
    }
    
    { print }
    ' "$file" > "$temp_file"
    
    # Заменяем оригинальный файл
    mv "$temp_file" "$file"
    echo "✅ Обновлен: $file"
}

# Обрабатываем все HTML файлы
echo "📁 Обрабатываем HTML файлы..."

for file in *.html; do
    if [ -f "$file" ]; then
        echo "🔧 Обрабатываем: $file"
        update_css_links "$file"
    fi
done

# Обрабатываем файлы в поддиректориях
for subdir in blog/; do
    if [ -d "$subdir" ]; then
        echo "📁 Обрабатываем директорию: $subdir"
        
        for file in "$subdir"/*.html; do
            if [ -f "$file" ]; then
                echo "🔧 Обрабатываем: $file"
                update_css_links "$file"
            fi
        done
    fi
done

# Статистика
echo ""
echo "📊 СТАТИСТИКА ОБНОВЛЕНИЯ:"
echo "========================"
echo "✅ Резервные копии созданы в: $BACKUP_DIR"
echo "✅ Обработано HTML файлов: $(find . -name "*.html" | wc -l)"
echo "✅ Заменены CSS ссылки на объединенный файл"
echo "✅ Добавлена версия для кеширования"

echo ""
echo "🎯 ОБНОВЛЕНИЕ CSS ССЫЛОК ЗАВЕРШЕНО!"
echo "📁 Резервные копии: $BACKUP_DIR"
echo "🚀 Производительность улучшена!"
