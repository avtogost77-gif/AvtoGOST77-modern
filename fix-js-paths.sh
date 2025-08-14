#!/bin/bash

# Функция для исправления путей к JS файлам в файле
fix_js_paths() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем абсолютные пути на относительные
    sed -i 's/src="\/assets\/js\//src="assets\/js\//g' "$file"
    
    # Заменяем пути без assets/ на правильные
    sed -i 's/src="js\//src="assets\/js\//g' "$file"
    
    # Заменяем пути с ../assets/ на assets/
    sed -i 's/src="\.\.\/assets\/js\//src="assets\/js\//g' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_js_paths "$file"
done

echo "🎯 All files processed!"
