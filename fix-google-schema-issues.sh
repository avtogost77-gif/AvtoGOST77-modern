#!/bin/bash

# Скрипт для исправления проблем с Schema.org разметкой, обнаруженных Google
# Исправляет дублирование Schema.org и проблемы с canonical

echo "🔧 Исправление проблем с Schema.org разметкой для Google..."

# Создаем временную директорию для бэкапов
mkdir -p schema-fix-backup-$(date +%Y%m%d-%H%M%S)

# Функция для очистки дублирующихся Schema.org разметок
clean_schema_duplicates() {
    local file="$1"
    local filename=$(basename "$file")
    local backup_dir="schema-fix-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Создаем бэкап
    cp "$file" "$backup_dir/"
    
    echo "🧹 Очистка дублирующихся Schema.org в $filename..."
    
    # Временный файл для работы
    local temp_file="${file}.temp"
    
    # Удаляем все существующие Schema.org разметки
    sed '/<script type="application\/ld\+json">/,/<\/script>/d' "$file" > "$temp_file"
    
    # Добавляем одну правильную Schema.org разметку в зависимости от типа страницы
    if [[ "$filename" == "index.html" ]]; then
        # Для главной страницы - только Organization и WebSite
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка для главной страницы -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "АвтоГОСТ",
        "url": "https://avtogost77.ru",
        "logo": "https://avtogost77.ru/assets/img/logo.png",
        "description": "Инфраструктура вашего бизнеса. Перевозки по России: отдельные и сборные отправления.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "RU",
            "addressLocality": "Москва"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+7-495-123-45-67",
            "contactType": "customer service",
            "availableLanguage": "Russian"
        },
        "sameAs": [
            "https://t.me/avtogost77"
        ]
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "АвтоГОСТ - Грузоперевозки по России",
        "url": "https://avtogost77.ru",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://avtogost77.ru/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>
EOF
    elif [[ "$filename" == "services.html" ]]; then
        # Для страницы услуг - Service
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка для страницы услуг -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Грузоперевозки по России",
        "provider": {
            "@type": "Organization",
            "name": "АвтоГОСТ"
        },
        "description": "Инфраструктура вашего бизнеса. Перевозки по России: отдельные и сборные отправления.",
        "serviceType": "Грузоперевозки",
        "areaServed": "RU"
    }
    </script>
EOF
    elif [[ "$filename" == "contact.html" ]]; then
        # Для страницы контактов - ContactPage
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка для страницы контактов -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Контакты АвтоГОСТ",
        "mainEntity": {
            "@type": "Organization",
            "name": "АвтоГОСТ",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+7-495-123-45-67",
                "contactType": "customer service"
            }
        }
    }
    </script>
EOF
    elif [[ "$filename" == "about.html" ]]; then
        # Для страницы о компании - AboutPage
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка для страницы о компании -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "О компании АвтоГОСТ",
        "mainEntity": {
            "@type": "Organization",
            "name": "АвтоГОСТ",
            "foundingDate": "2015",
            "description": "Инфраструктура вашего бизнеса. Перевозки по России: отдельные и сборные отправления."
        }
    }
    </script>
EOF
    elif [[ "$filename" == "faq.html" ]]; then
        # Для FAQ страницы - FAQPage
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка для FAQ -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Как заказать грузоперевозку?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Вы можете заказать грузоперевозку через наш калькулятор на сайте или позвонив по телефону."
                }
            }
        ]
    }
    </script>
EOF
    elif [[ "$filename" =~ ^blog-.*\.html$ ]]; then
        # Для блог страниц - Article
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка для блог статьи -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Статья о грузоперевозках",
        "author": {
            "@type": "Organization",
            "name": "АвтоГОСТ"
        },
        "publisher": {
            "@type": "Organization",
            "name": "АвтоГОСТ",
            "logo": {
                "@type": "ImageObject",
                "url": "https://avtogost77.ru/assets/img/logo.png"
            }
        },
        "datePublished": "2025-08-25",
        "dateModified": "2025-08-25"
    }
    </script>
EOF
    elif [[ "$filename" =~ ^gruzoperevozki-.*\.html$ ]]; then
        # Для страниц маршрутов - Service
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка для страницы маршрута -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Грузоперевозки по маршруту",
        "provider": {
            "@type": "Organization",
            "name": "АвтоГОСТ"
        },
        "serviceType": "Грузоперевозки",
        "areaServed": "RU"
    }
    </script>
EOF
    else
        # Для остальных страниц - базовый Organization
        cat >> "$temp_file" << 'EOF'
    <!-- Schema.org разметка -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "АвтоГОСТ",
        "url": "https://avtogost77.ru"
    }
    </script>
EOF
    fi
    
    # Заменяем оригинальный файл
    mv "$temp_file" "$file"
    
    echo "✅ Schema.org разметка исправлена для $filename"
}

# Обрабатываем все HTML файлы в текущей директории
for file in *.html; do
    if [ -f "$file" ]; then
        clean_schema_duplicates "$file"
    fi
done

# Обрабатываем файлы в поддиректориях (кроме backup)
find . -name "*.html" -not -path "./backups/*" -not -path "./mega-cleanup-backup-*" -not -path "./inline-styles-backup/*" -not -path "./canonical-fix-backup-*" -not -path "./schema-fix-backup-*" | while read file; do
    if [ -f "$file" ] && [ "$(dirname "$file")" != "." ]; then
        clean_schema_duplicates "$file"
    fi
done

echo ""
echo "✅ Очистка дублирующихся Schema.org завершена!"
echo "📁 Бэкапы сохранены в: schema-fix-backup-$(date +%Y%m%d-%H%M%S)/"
echo ""
echo "📋 Проверьте несколько файлов для подтверждения исправлений:"
echo "   grep -c 'schema.org' index.html"
echo "   grep -c 'schema.org' services.html"
echo "   grep -c 'schema.org' contact.html"
