#!/bin/bash

# ========================================================
# 🧹 СКРИПТ УДАЛЕНИЯ ДУБЛИРУЮЩИХСЯ INLINE-СКРИПТОВ
# АвтоГост V2.0 - Оптимизация производительности
# ========================================================

echo "🔍 Начинаем удаление дублирующихся inline-скриптов..."

# Создаем временную директорию
TMPDIR=$(mktemp -d)
BACKUP_DIR="backup-duplicate-removal-$(date +%Y%m%d-%H%M%S)"

# Создаем резервную копию
mkdir -p "$BACKUP_DIR"

# Функция для создания резервной копии
backup_file() {
    local file="$1"
    local backup_path="$BACKUP_DIR/$(basename "$file")"
    cp "$file" "$backup_path"
    echo "✅ Резервная копия: $backup_path"
}

# Функция для удаления дублирующихся DOMContentLoaded
remove_duplicate_domcontentloaded() {
    local file="$1"
    local temp_file="$TMPDIR/$(basename "$file")"
    
    # Создаем резервную копию
    backup_file "$file"
    
    # Удаляем дублирующиеся DOMContentLoaded скрипты
    # Оставляем только первый, остальные удаляем
    awk '
    BEGIN { found = 0 }
    /document\.addEventListener.*DOMContentLoaded/ {
        if (found == 0) {
            found = 1
            print
            # Пропускаем весь блок скрипта
            while (getline) {
                if ($0 ~ /^[[:space:]]*<\/script>/) {
                    print
                    break
                }
                print
            }
        } else {
            # Пропускаем дублирующиеся скрипты
            while (getline) {
                if ($0 ~ /^[[:space:]]*<\/script>/) {
                    break
                }
            }
        }
        next
    }
    { print }
    ' "$file" > "$temp_file"
    
    # Заменяем оригинальный файл
    mv "$temp_file" "$file"
    echo "✅ Обработан: $file"
}

# Функция для удаления дублирующихся console.log
remove_duplicate_console_logs() {
    local file="$1"
    local temp_file="$TMPDIR/$(basename "$file")"
    
    # Удаляем дублирующиеся console.log
    sed '/console\.log.*debug/d' "$file" > "$temp_file"
    mv "$temp_file" "$file"
}

# Функция для удаления пустых скрипт-блоков
remove_empty_script_blocks() {
    local file="$1"
    local temp_file="$TMPDIR/$(basename "$file")"
    
    # Удаляем пустые скрипт-блоки
    sed '/<script[^>]*>[[:space:]]*<\/script>/d' "$file" > "$temp_file"
    mv "$temp_file" "$file"
}

# Обрабатываем все HTML файлы
echo "📁 Обрабатываем HTML файлы..."

for file in *.html; do
    if [ -f "$file" ]; then
        echo "🔧 Обрабатываем: $file"
        
        # Удаляем дублирующиеся DOMContentLoaded
        remove_duplicate_domcontentloaded "$file"
        
        # Удаляем дублирующиеся console.log
        remove_duplicate_console_logs "$file"
        
        # Удаляем пустые скрипт-блоки
        remove_empty_script_blocks "$file"
    fi
done

# Обрабатываем файлы в поддиректориях
for subdir in blog/; do
    if [ -d "$subdir" ]; then
        echo "📁 Обрабатываем директорию: $subdir"
        
        for file in "$subdir"/*.html; do
            if [ -f "$file" ]; then
                echo "🔧 Обрабатываем: $file"
                
                # Удаляем дублирующиеся DOMContentLoaded
                remove_duplicate_domcontentloaded "$file"
                
                # Удаляем дублирующиеся console.log
                remove_duplicate_console_logs "$file"
                
                # Удаляем пустые скрипт-блоки
                remove_empty_script_blocks "$file"
            fi
        done
    fi
done

# Статистика
echo ""
echo "📊 СТАТИСТИКА ОПТИМИЗАЦИИ:"
echo "=========================="
echo "✅ Резервные копии созданы в: $BACKUP_DIR"
echo "✅ Обработано HTML файлов: $(find . -name "*.html" | wc -l)"
echo "✅ Удалены дублирующиеся inline-скрипты"
echo "✅ Удалены отладочные console.log"
echo "✅ Удалены пустые скрипт-блоки"

# Очистка временной директории
rm -rf "$TMPDIR"

echo ""
echo "🎯 ОПТИМИЗАЦИЯ ЗАВЕРШЕНА!"
echo "📁 Резервные копии: $BACKUP_DIR"
echo "🚀 Производительность улучшена!"
