#!/bin/bash

# Функция для исправления телефонных номеров в файле
fix_phones() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем телефонные номера в ссылках
    sed -i 's/tel:+7[0-9]\{10\}/tel:+79162720932/g' "$file"
    sed -i 's/tel:[0-9]\{11\}/tel:+79162720932/g' "$file"
    
    # Заменяем телефонные номера в тексте
    sed -i 's/+7 [0-9]\{3\} [0-9]\{3\}-[0-9]\{2\}-[0-9]\{2\}/+7 916 272-09-32/g' "$file"
    sed -i 's/+7[0-9]\{10\}/+79162720932/g' "$file"
    
    # Заменяем телефонные номера в WhatsApp ссылках
    sed -i 's/wa.me\/7[0-9]\{10\}/wa.me\/79162720932/g' "$file"
    
    # Заменяем телефонные номера в Schema.org
    sed -i 's/"telephone": "+7[0-9]\{10\}"/"telephone": "+79162720932"/g' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_phones "$file"
done

echo "🎯 All files processed!"
