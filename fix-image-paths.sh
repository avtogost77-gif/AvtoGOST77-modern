#!/bin/bash

# Функция для исправления путей к изображениям в файле
fix_image_paths() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем абсолютные пути на относительные
    sed -i 's/src="\/assets\/img\//src="assets\/img\//g' "$file"
    sed -i 's/href="\/assets\/img\//href="assets\/img\//g' "$file"
    
    # Исправляем пути для файлов в поддиректориях
    if [[ "$file" == *"blog/"* ]]; then
        sed -i 's/src="assets\/img\//src="..\/assets\/img\//g' "$file"
        sed -i 's/href="assets\/img\//href="..\/assets\/img\//g' "$file"
    fi
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_image_paths "$file"
done

echo "🎯 All files processed!"
