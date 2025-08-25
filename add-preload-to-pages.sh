#!/bin/bash

# Скрипт для добавления preload ссылок для JS bundle'ов на все HTML страницы

echo "🔄 Добавление preload для JS bundle'ов..."

# Добавляем preload после preload для шрифтов или в конце head секции
for file in $(find . -maxdepth 1 -name "*.html"); do
    echo "Обработка $file..."

    # Проверяем, есть ли уже preload для critical-bundle
    if ! grep -q "critical-bundle.min.js" "$file"; then
        # Находим место для вставки - после preload шрифтов или перед закрытием </head>
        if grep -q "fonts.gstatic.com" "$file"; then
            # Вставляем после preload шрифтов
            sed -i '/fonts.gstatic.com/a\
    <!-- 🚀 Preload новых bundle'\''ов вместо отдельных файлов -->\
    <link rel="preload" href="assets/js/bundles/critical-bundle.min.js?v=20250821-bundle" as="script">\
    <link rel="preload" href="assets/js/bundles/performance-bundle.min.js?v=20250821-bundle" as="script">' "$file"
        else
            # Вставляем перед </head>
            sed -i '/<\/head>/i\
    <!-- 🚀 Preload новых bundle'\''ов вместо отдельных файлов -->\
    <link rel="preload" href="assets/js/bundles/critical-bundle.min.js?v=20250821-bundle" as="script">\
    <link rel="preload" href="assets/js/bundles/performance-bundle.min.js?v=20250821-bundle" as="script">' "$file"
        fi
        echo "✅ Добавлен preload в $file"
    else
        echo "⚠️  Preload уже существует в $file"
    fi
done

echo "🎉 Готово! Preload добавлен на все страницы"

