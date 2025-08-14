#!/bin/bash

# Функция для исправления CSS путей в файле
fix_css_paths() {
    local file=$1
    echo "Processing $file..."
    
    # Удаляем дублирующиеся строки calculator-modern.min.css
    sed -i '/<link.*calculator-modern.min.css.*>/!b;/preload/!d' "$file"
    
    # Заменяем preload на стандартный формат
    sed -i 's/<link rel="preload" href="assets\/css\/calculator-modern.min.css" as="style" onload="this.onload=null;this.rel='\''stylesheet'\''">/<link rel="stylesheet" href="assets\/css\/calculator-modern.min.css?v=20250813-new">/' "$file"
    
    # Удаляем абсолютные пути к CSS файлам
    sed -i 's/href="\/assets\/css\//href="assets\/css\//' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_css_paths "$file"
done

echo "🎯 All files processed!"
