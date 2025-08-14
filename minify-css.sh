#!/bin/bash

# ========================================================
# 🎨 CSS МИНИФИКАТОР - АВТОГОСТ V2.0
# Простая минификация CSS без внешних зависимостей
# ========================================================

echo "🎨 Начинаем минификацию CSS..."

# Функция для минификации CSS
minify_css() {
    local input_file="$1"
    local output_file="$2"
    
    echo "🔧 Минифицируем: $input_file -> $output_file"
    
    # Удаляем комментарии, лишние пробелы, переносы строк
    cat "$input_file" | \
        sed 's|/\*[^*]*\*+\([^/*][^*]*\*+\)*//*||g' | \
        sed 's|^[[:space:]]*//.*$||g' | \
        sed 's|[[:space:]]\+| |g' | \
        sed 's|[[:space:]]*{[[:space:]]*|{|g' | \
        sed 's|[[:space:]]*}[[:space:]]*|}|g' | \
        sed 's|[[:space:]]*:[[:space:]]*|:|g' | \
        sed 's|[[:space:]]*;[[:space:]]*|;|g' | \
        sed 's|[[:space:]]*,[[:space:]]*|,|g' | \
        sed 's|;[[:space:]]*}|}|g' | \
        sed 's|[[:space:]]*$||g' | \
        tr -d '\n' > "$output_file"
    
    echo "✅ Минифицирован: $output_file"
}

# Создаем резервную копию
BACKUP_DIR="backup-css-optimization-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Резервная копия оригинальных файлов
cp assets/css/critical-optimized.css "$BACKUP_DIR/"
cp assets/css/redesign-fixes.css "$BACKUP_DIR/"
cp assets/css/mobile.css "$BACKUP_DIR/"
cp assets/css/calculator-modern.css "$BACKUP_DIR/"
cp assets/css/unified-optimized.css "$BACKUP_DIR/"

echo "✅ Резервные копии созданы в: $BACKUP_DIR"

# Минифицируем объединенный файл
minify_css "assets/css/unified-optimized.css" "assets/css/unified-optimized.min.css"

# Проверяем размеры
echo ""
echo "📊 РАЗМЕРЫ ФАЙЛОВ:"
echo "=================="
echo "До минификации:"
du -h assets/css/unified-optimized.css
echo "После минификации:"
du -h assets/css/unified-optimized.min.css

# Статистика
ORIGINAL_SIZE=$(wc -c < assets/css/unified-optimized.css)
MINIFIED_SIZE=$(wc -c < assets/css/unified-optimized.min.css)
SAVINGS=$((ORIGINAL_SIZE - MINIFIED_SIZE))
SAVINGS_PERCENT=$((SAVINGS * 100 / ORIGINAL_SIZE))

echo ""
echo "📈 СТАТИСТИКА МИНИФИКАЦИИ:"
echo "=========================="
echo "Оригинальный размер: $ORIGINAL_SIZE байт"
echo "Минифицированный размер: $MINIFIED_SIZE байт"
echo "Экономия: $SAVINGS байт ($SAVINGS_PERCENT%)"

echo ""
echo "🎯 CSS МИНИФИКАЦИЯ ЗАВЕРШЕНА!"
echo "📁 Резервные копии: $BACKUP_DIR"
echo "🚀 Производительность улучшена!"
