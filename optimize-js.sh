#!/bin/bash

# JavaScript Optimization Script
# Объединение, удаление дубликатов, минификация

echo "🚀 Начинаем JavaScript оптимизацию..."

# Создаем backup
backup_dir="backup-js-optimization-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
cp -r assets/js "$backup_dir/"
echo "✅ Backup создан: $backup_dir"

# Удаляем дубликаты (оставляем только .min.js версии)
echo "🗑️ Удаляем дубликаты..."

# Удаляем non-minified версии, если есть .min.js
rm -f assets/js/calculator-ui.js
rm -f assets/js/cities-simple.js  
rm -f assets/js/form-handler.js
rm -f assets/js/lazy-loading.js
rm -f assets/js/main.js
rm -f assets/js/mobile-collapse.js

echo "✅ Дубликаты удалены"

# Создаем объединенный файл для основных функций
echo "🔧 Создаем объединенный JS файл..."

# Основные файлы для объединения (в порядке загрузки)
main_files=(
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

# Создаем объединенный файл
echo "// Объединенный JavaScript - $(date)" > assets/js/unified-main.js
echo "// АвтоГост - Оптимизированная версия" >> assets/js/unified-main.js
echo "" >> assets/js/unified-main.js

for file in "${main_files[@]}"; do
    if [ -f "$file" ]; then
        echo "// === $file ===" >> assets/js/unified-main.js
        cat "$file" >> assets/js/unified-main.js
        echo "" >> assets/js/unified-main.js
        echo "" >> assets/js/unified-main.js
    fi
done

echo "✅ Объединенный файл создан: assets/js/unified-main.js"

# Минифицируем объединенный файл
echo "📦 Минифицируем объединенный файл..."

# Простая минификация (удаляем комментарии, лишние пробелы)
sed -e 's/\/\*.*\*\///g' \
    -e 's/\/\/.*$//g' \
    -e 's/\s\s*/ /g' \
    -e 's/ *{ */{/g' \
    -e 's/ *} */}/g' \
    -e 's/ *; */;/g' \
    -e 's/;}/}/g' \
    -e 's/\t//g' \
    -e 's/\n//g' \
    -e 's/\r//g' \
    assets/js/unified-main.js > assets/js/unified-main.min.js

echo "✅ Минифицированный файл создан: assets/js/unified-main.min.js"

# Показываем размеры
echo ""
echo "📊 Размеры файлов:"
echo "Объединенный: $(wc -c < assets/js/unified-main.js) байт"
echo "Минифицированный: $(wc -c < assets/js/unified-main.min.js) байт"

# Создаем список файлов для удаления
echo ""
echo "🗑️ Файлы для удаления (после тестирования):"
for file in "${main_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  - $file"
    fi
done

echo ""
echo "✅ JavaScript оптимизация завершена!"
echo "📝 Следующий шаг: обновить ссылки в HTML файлах"
