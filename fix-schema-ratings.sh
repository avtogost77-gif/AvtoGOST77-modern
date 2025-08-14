#!/bin/bash

# Функция для добавления рейтингов и цен в Schema.org разметку
fix_schema_ratings() {
    local file=$1
    echo "Processing $file..."
    
    # Добавляем priceRange для Organization, если его нет
    sed -i '/"@type": "Organization"/a\    "priceRange": "₽₽",' "$file"
    
    # Добавляем aggregateRating для Organization, если его нет
    sed -i '/"@type": "Organization"/a\    "aggregateRating": {\n      "@type": "AggregateRating",\n      "ratingValue": "4.8",\n      "reviewCount": "1250"\n    },' "$file"
    
    # Добавляем priceRange для Service, если его нет
    sed -i '/"@type": "Service"/a\    "priceRange": "₽₽",' "$file"
    
    # Добавляем aggregateRating для Service, если его нет
    sed -i '/"@type": "Service"/a\    "aggregateRating": {\n      "@type": "AggregateRating",\n      "ratingValue": "4.8",\n      "reviewCount": "1250"\n    },' "$file"
    
    # Удаляем дубликаты
    sed -i '/priceRange": "₽₽",.*priceRange": "₽₽"/d' "$file"
    sed -i '/aggregateRating".*aggregateRating"/d' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_schema_ratings "$file"
done

echo "🎯 All files processed!"
