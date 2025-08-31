#!/bin/bash

# Скрипт для очистки дублирующих блоков на всех HTML страницах
echo "🧹 Начинаю очистку дублирующих блоков на всех страницах..."

# Список секций для удаления
SECTIONS_TO_REMOVE=(
    "route-comparison"
    "spb-districts"
    "useful-tips"
    "consolidation-process"
    "small-business-benefits"
    "contact-process"
    "contact-advantages"
    "b2b-advantages"
    "case-studies"
    "work-process"
    "pricing"
    "process"
    "advantages"
    "benefits"
)

# Функция для удаления секции
remove_section() {
    local file="$1"
    local section="$2"
    
    # Ищем секцию и удаляем её
    if grep -q "section.*$section" "$file"; then
        echo "🗑️ Удаляю секцию $section из $file"
        
        # Удаляем секцию с комментарием
        sed -i "/<!--.*$section.*-->/d" "$file"
        sed -i "/<section.*$section.*>/,/<\/section>/d" "$file"
        
        # Добавляем комментарий о удалении
        sed -i "s/<section.*$section.*>/<!-- 🗑️ СЕКЦИЯ $section УДАЛЕНА - дублирует информацию из аккордеонов -->/g" "$file"
    fi
}

# Находим все HTML файлы (исключая бэкапы)
find . -maxdepth 1 -name "*.html" | while read file; do
    echo "📄 Обрабатываю: $file"
    
    # Удаляем дублирующие секции
    for section in "${SECTIONS_TO_REMOVE[@]}"; do
        remove_section "$file" "$section"
    done
    
    # Удаляем пустые строки
    sed -i '/^[[:space:]]*$/d' "$file"
    
    echo "✅ $file обработан"
done

echo "🎉 Очистка завершена! Все дублирующие блоки удалены."
