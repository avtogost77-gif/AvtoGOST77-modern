#!/bin/bash

# Функция для добавления хлебных крошек в Schema.org разметку
fix_schema_breadcrumbs() {
    local file=$1
    local filename=$(basename "$file")
    local title=""
    local url="https://avtogost77.ru/$filename"
    
    # Получаем title из файла
    title=$(grep -o '<title>.*</title>' "$file" | sed 's/<title>\(.*\)<\/title>/\1/')
    
    # Если title не найден, используем имя файла
    if [ -z "$title" ]; then
        title=$(echo "$filename" | sed 's/\.html//' | tr '-' ' ' | sed 's/\b\(.\)/\u\1/g')
    fi
    
    echo "Processing $file..."
    
    # Проверяем наличие BreadcrumbList
    if ! grep -q '"@type": "BreadcrumbList"' "$file"; then
        # Добавляем BreadcrumbList после первого закрывающего тега script
        sed -i '/<\/script>/a\
    <script type="application/ld+json">\
    {\
        "@context": "https://schema.org",\
        "@type": "BreadcrumbList",\
        "itemListElement": [\
            {\
                "@type": "ListItem",\
                "position": 1,\
                "name": "Главная",\
                "item": "https://avtogost77.ru/"\
            },\
            {\
                "@type": "ListItem",\
                "position": 2,\
                "name": "'"$title"'",\
                "item": "'"$url"'"\
            }\
        ]\
    }\
    </script>' "$file"
    fi
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_schema_breadcrumbs "$file"
done

echo "🎯 All files processed!"
