#!/bin/bash

# Функция для исправления атрибутов загрузки JS в файле
fix_js_attributes() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем атрибуты для калькулятора на async
    sed -i 's/smart-calculator-v2\.min\.js[^"]*" defer/smart-calculator-v2.min.js?v=20250813-fixed" async/g' "$file"
    sed -i 's/calculator-ui\.min\.js[^"]*" defer/calculator-ui.min.js?v=20250813-new" async/g' "$file"
    
    # Заменяем атрибуты для остальных скриптов на defer
    sed -i 's/main\.min\.js[^"]*" async/main.min.js?v=20250813-new" defer/g' "$file"
    sed -i 's/lazy-loading\.min\.js[^"]*" async/lazy-loading.min.js" defer/g' "$file"
    sed -i 's/form-handler\.min\.js[^"]*" async/form-handler.min.js" defer/g' "$file"
    sed -i 's/cities-simple\.min\.js[^"]*" async/cities-simple.min.js" defer/g' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_js_attributes "$file"
done

echo "🎯 All files processed!"
