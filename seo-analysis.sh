#!/bin/bash

# SEO Analysis Script
# Анализ текущего SEO состояния сайта

echo "🔍 Начинаем SEO анализ..."

# Создаем директорию для отчетов
seo_dir="seo-analysis"
mkdir -p "$seo_dir"

# Функция для анализа мета-тегов
analyze_meta_tags() {
    echo "📄 Анализируем мета-теги..."
    
    local total_pages=0
    local pages_with_title=0
    local pages_with_description=0
    local pages_with_keywords=0
    local pages_with_og=0
    local pages_with_schema=0
    
    find . -name "*.html" -type f | while read -r file; do
        local filename=$(basename "$file")
        echo "📝 Анализируем: $filename"
        
        total_pages=$((total_pages + 1))
        
        # Проверяем title
        if grep -q "<title>" "$file"; then
            pages_with_title=$((pages_with_title + 1))
        fi
        
        # Проверяем description
        if grep -q 'name="description"' "$file"; then
            pages_with_description=$((pages_with_description + 1))
        fi
        
        # Проверяем keywords
        if grep -q 'name="keywords"' "$file"; then
            pages_with_keywords=$((pages_with_keywords + 1))
        fi
        
        # Проверяем Open Graph
        if grep -q 'property="og:' "$file"; then
            pages_with_og=$((pages_with_og + 1))
        fi
        
        # Проверяем Schema.org
        if grep -q 'application/ld+json' "$file"; then
            pages_with_schema=$((pages_with_schema + 1))
        fi
    done
    
    # Создаем отчет
    cat > "$seo_dir/meta-analysis-$(date +%Y%m%d).md" << EOF
# Анализ мета-тегов - $(date)
## Результаты анализа

- **Всего страниц:** $total_pages
- **С title:** $pages_with_title
- **С description:** $pages_with_description
- **С keywords:** $pages_with_keywords
- **С Open Graph:** $pages_with_og
- **С Schema.org:** $pages_with_schema

## Рекомендации

EOF
    
    if [ $pages_with_description -lt $total_pages ]; then
        echo "- Добавить description для всех страниц" >> "$seo_dir/meta-analysis-$(date +%Y%m%d).md"
    fi
    
    if [ $pages_with_og -lt $total_pages ]; then
        echo "- Добавить Open Graph теги для всех страниц" >> "$seo_dir/meta-analysis-$(date +%Y%m%d).md"
    fi
    
    if [ $pages_with_schema -lt $total_pages ]; then
        echo "- Добавить Schema.org разметку для всех страниц" >> "$seo_dir/meta-analysis-$(date +%Y%m%d).md"
    fi
    
    echo "✅ Анализ мета-тегов завершен"
}

# Функция для анализа внутренних ссылок
analyze_internal_links() {
    echo "🔗 Анализируем внутренние ссылки..."
    
    local total_links=0
    local broken_links=0
    
    # Создаем список всех HTML файлов
    find . -name "*.html" -type f > "$seo_dir/all_pages.txt"
    
    # Анализируем ссылки
    find . -name "*.html" -type f | while read -r file; do
        local filename=$(basename "$file")
        echo "🔍 Проверяем ссылки в: $filename"
        
        # Извлекаем все href ссылки
        grep -o 'href="[^"]*"' "$file" | while read -r link; do
            local href=$(echo "$link" | sed 's/href="//' | sed 's/"//')
            
            # Пропускаем внешние ссылки
            if [[ "$href" == http* ]]; then
                continue
            fi
            
            # Пропускаем якоря и javascript
            if [[ "$href" == \#* ]] || [[ "$href" == javascript:* ]]; then
                continue
            fi
            
            total_links=$((total_links + 1))
            
            # Проверяем существование файла
            if [ ! -f "$href" ] && [ ! -f ".$href" ]; then
                echo "❌ Битая ссылка: $href в $filename" >> "$seo_dir/broken_links.txt"
                broken_links=$((broken_links + 1))
            fi
        done
    done
    
    # Создаем отчет
    cat > "$seo_dir/internal-links-$(date +%Y%m%d).md" << EOF
# Анализ внутренних ссылок - $(date)

- **Всего внутренних ссылок:** $total_links
- **Битых ссылок:** $broken_links
- **Процент битых ссылок:** $(echo "scale=2; $broken_links * 100 / $total_links" | bc -l 2>/dev/null || echo "0")%

## Рекомендации

EOF
    
    if [ $broken_links -gt 0 ]; then
        echo "- Исправить битые ссылки" >> "$seo_dir/internal-links-$(date +%Y%m%d).md"
        echo "- Добавить 301 редиректы для старых URL" >> "$seo_dir/internal-links-$(date +%Y%m%d).md"
    fi
    
    echo "✅ Анализ внутренних ссылок завершен"
}

# Функция для анализа заголовков
analyze_headings() {
    echo "📝 Анализируем структуру заголовков..."
    
    find . -name "*.html" -type f | while read -r file; do
        local filename=$(basename "$file")
        echo "📄 Анализируем заголовки в: $filename"
        
        # Создаем отчет для каждого файла
        local report_file="$seo_dir/headings-${filename%.*}.md"
        
        echo "# Анализ заголовков - $filename" > "$report_file"
        echo "" >> "$report_file"
        
        # Извлекаем заголовки
        grep -E '<h[1-6][^>]*>' "$file" | while read -r heading; do
            local level=$(echo "$heading" | grep -o '<h[1-6]' | grep -o '[1-6]')
            local text=$(echo "$heading" | sed 's/<[^>]*>//g' | sed 's/<\/[^>]*>//g')
            echo "- H$level: $text" >> "$report_file"
        done
    done
    
    echo "✅ Анализ заголовков завершен"
}

# Функция для анализа изображений
analyze_images() {
    echo "🖼️ Анализируем изображения..."
    
    local total_images=0
    local images_with_alt=0
    local images_without_alt=0
    
    find . -name "*.html" -type f | while read -r file; do
        local filename=$(basename "$file")
        
        # Считаем изображения
        local images_in_file=$(grep -c '<img' "$file" 2>/dev/null || echo "0")
        total_images=$((total_images + images_in_file))
        
        # Считаем изображения с alt
        local images_with_alt_in_file=$(grep -c 'alt="[^"]*"' "$file" 2>/dev/null || echo "0")
        images_with_alt=$((images_with_alt + images_with_alt_in_file))
        
        # Считаем изображения без alt
        local images_without_alt_in_file=$((images_in_file - images_with_alt_in_file))
        images_without_alt=$((images_without_alt + images_without_alt_in_file))
    done
    
    # Создаем отчет
    cat > "$seo_dir/images-analysis-$(date +%Y%m%d).md" << EOF
# Анализ изображений - $(date)

- **Всего изображений:** $total_images
- **С alt атрибутом:** $images_with_alt
- **Без alt атрибута:** $images_without_alt
- **Процент с alt:** $(echo "scale=2; $images_with_alt * 100 / $total_images" | bc -l 2>/dev/null || echo "0")%

## Рекомендации

EOF
    
    if [ $images_without_alt -gt 0 ]; then
        echo "- Добавить alt атрибуты для всех изображений" >> "$seo_dir/images-analysis-$(date +%Y%m%d).md"
        echo "- Использовать описательные alt тексты" >> "$seo_dir/images-analysis-$(date +%Y%m%d).md"
    fi
    
    echo "✅ Анализ изображений завершен"
}

# Функция для анализа ключевых слов
analyze_keywords() {
    echo "🔑 Анализируем ключевые слова..."
    
    # Основные ключевые слова для грузоперевозок
    local keywords=(
        "грузоперевозки"
        "доставка"
        "транспортная компания"
        "газель"
        "фура"
        "межгород"
        "сборные грузы"
        "срочная доставка"
        "логистика"
        "перевозка"
    )
    
    # Создаем отчет
    cat > "$seo_dir/keywords-analysis-$(date +%Y%m%d).md" << EOF
# Анализ ключевых слов - $(date)

## Основные ключевые слова

EOF
    
    for keyword in "${keywords[@]}"; do
        local count=$(grep -r -i "$keyword" . --include="*.html" | wc -l)
        echo "- **$keyword:** $count упоминаний" >> "$seo_dir/keywords-analysis-$(date +%Y%m%d).md"
    done
    
    echo "" >> "$seo_dir/keywords-analysis-$(date +%Y%m%d).md"
    echo "## Рекомендации" >> "$seo_dir/keywords-analysis-$(date +%Y%m%d).md"
    echo "- Увеличить плотность ключевых слов" >> "$seo_dir/keywords-analysis-$(date +%Y%m%d).md"
    echo "- Добавить LSI ключевые слова" >> "$seo_dir/keywords-analysis-$(date +%Y%m%d).md"
    echo "- Создать контент для длинных хвостов" >> "$seo_dir/keywords-analysis-$(date +%Y%m%d).md"
    
    echo "✅ Анализ ключевых слов завершен"
}

# Основная функция
main() {
    echo "🚀 Начинаем SEO анализ сайта..."
    echo "=================================="
    
    # Анализируем мета-теги
    analyze_meta_tags
    
    # Анализируем внутренние ссылки
    analyze_internal_links
    
    # Анализируем заголовки
    analyze_headings
    
    # Анализируем изображения
    analyze_images
    
    # Анализируем ключевые слова
    analyze_keywords
    
    echo ""
    echo "✅ SEO анализ завершен!"
    echo "📁 Отчеты сохранены в: $seo_dir/"
    echo ""
    echo "📊 Следующие шаги:"
    echo "1. Изучить отчеты в $seo_dir/"
    echo "2. Исправить найденные проблемы"
    echo "3. Оптимизировать контент"
    echo "4. Добавить недостающие мета-теги"
}

# Запускаем анализ
main
