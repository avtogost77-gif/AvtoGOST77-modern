#!/bin/bash

# Список файлов для обработки
FILES=(
    "ip-small-business-delivery.html"
    "faq.html"
    "gruzoperevozki-po-moskve.html"
    "self-employed-delivery.html"
    "urgent-delivery.html"
    "blog-2-wildberries-delivery.html"
    "blog-1-carrier-failed.html"
    "blog-6-marketplace-insider.html"
    "blog-5-logistics-optimization.html"
    "blog-4-remote-logistics.html"
    "blog-3-spot-orders.html"
    "transportnaya-kompaniya.html"
    "index.html"
    "blog/index.html"
)

# Функция для удаления физических адресов из файла
remove_addresses() {
    local file=$1
    echo "Processing $file..."
    
    # Удаляем postalCode и geo блоки
    sed -i '/"postalCode": /d' "$file"
    sed -i '/"geo": {/,/}/d' "$file"
    sed -i '/"@type": "GeoCoordinates"/,/}/d' "$file"
    sed -i '/"latitude": /d' "$file"
    sed -i '/"longitude": /d' "$file"
    
    # Чистим пустые строки после удаления
    sed -i '/^[[:space:]]*$/d' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем каждый файл
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        remove_addresses "$file"
    else
        echo "⚠️ File not found: $file"
    fi
done

echo "🎯 All files processed!"
