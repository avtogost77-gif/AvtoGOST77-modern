#!/bin/bash

# Функция для исправления версий JS файлов в файле
fix_js_versions() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем версии smart-calculator-v2.min.js на v=20250813-fixed
    sed -i 's/smart-calculator-v2\.min\.js\?v=[0-9-]*/smart-calculator-v2.min.js?v=20250813-fixed/g' "$file"
    sed -i 's/smart-calculator-v2\.min\.js"/smart-calculator-v2.min.js?v=20250813-fixed"/g' "$file"
    
    # Заменяем версии calculator-ui.min.js на v=20250813-new
    sed -i 's/calculator-ui\.min\.js\?v=[0-9-]*/calculator-ui.min.js?v=20250813-new/g' "$file"
    sed -i 's/calculator-ui\.min\.js"/calculator-ui.min.js?v=20250813-new"/g' "$file"
    
    # Заменяем версии main.min.js на v=20250813-new
    sed -i 's/main\.min\.js\?v=[0-9-]*/main.min.js?v=20250813-new/g' "$file"
    sed -i 's/main\.min\.js"/main.min.js?v=20250813-new"/g' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_js_versions "$file"
done

echo "🎯 All files processed!"
