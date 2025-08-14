#!/bin/bash

# Функция для исправления путей к файлам в файле
fix_file_paths() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем абсолютные пути на относительные
    sed -i 's/href="\/assets\//href="assets\//g' "$file"
    sed -i 's/src="\/assets\//src="assets\//g' "$file"
    sed -i 's/href="\/favicon/href="favicon/g' "$file"
    
    # Заменяем абсолютные пути к HTML файлам на относительные
    sed -i 's/href="\/\([^"]*\.html\)"/href="\1"/g' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_file_paths "$file"
done

echo "🎯 All files processed!"
