#!/bin/bash

# Функция для унификации логотипа в файле
fix_logo() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем все варианты логотипа на logo.svg
    sed -i 's/src="[^"]*logo\.png"/src="assets\/img\/logo.svg"/g' "$file"
    sed -i 's/src="[^"]*icon-[0-9x]*\.svg"/src="assets\/img\/logo.svg"/g' "$file"
    sed -i 's/src="[^"]*logo-[0-9]*\.svg"/src="assets\/img\/logo.svg"/g' "$file"
    
    # Исправляем пути для файлов в поддиректориях
    if [[ "$file" == *"blog/"* ]]; then
        sed -i 's/src="assets\/img\/logo\.svg"/src="..\/assets\/img\/logo.svg"/g' "$file"
    fi
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_logo "$file"
done

echo "🎯 All files processed!"
