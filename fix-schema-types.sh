#!/bin/bash

# Функция для исправления типов Schema.org в файле
fix_schema_types() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем LocalBusiness на Organization
    sed -i 's/"@type": "LocalBusiness"/"@type": "Organization"/g' "$file"
    
    # Заменяем MovingCompany на Service
    sed -i 's/"@type": "MovingCompany"/"@type": "Service"/g' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_schema_types "$file"
done

echo "🎯 All files processed!"
