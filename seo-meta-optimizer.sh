#!/bin/bash

# SEO Meta Tags Optimizer
# Автоматическая оптимизация мета-тегов

echo "🔍 Начинаем SEO оптимизацию мета-тегов..."

# Создаем backup
backup_dir="backup-seo-optimization-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
find . -name "*.html" -exec cp {} "$backup_dir/" \;
echo "✅ Backup создан: $backup_dir"

# Функция для оптимизации мета-тегов
optimize_meta_tags() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    
    echo "📝 Оптимизируем: $filename"
    
    # Создаем временный файл
    local temp_file=$(mktemp)
    cp "$file" "$temp_file"
    
    # Определяем тип страницы и ключевые слова
    local title=""
    local description=""
    local keywords=""
    
    case "$name" in
        "index")
            title="АвтоГОСТ - Грузоперевозки по России | Доставка от 2 часов"
            description="Профессиональные грузоперевозки по России. Быстрая подача от 2 часов, точный расчет стоимости, сборные грузы. Калькулятор онлайн, работаем 24/7."
            keywords="грузоперевозки россия, доставка грузов, транспортная компания, сборные грузы, калькулятор стоимости, быстрая подача"
            ;;
        "gazel-gruzoperevozki")
            title="Грузоперевозки газелью | Доставка по Москве и России"
            description="Грузоперевозки газелью по Москве и России. Быстрая подача, точный расчет, перевозка мебели и грузов. Заказать газель онлайн."
            keywords="грузоперевозки газелью, газель москва, перевозка мебели, доставка газелью, заказать газель"
            ;;
        "fura-20-tonn-gruzoperevozki")
            title="Грузоперевозки фурой 20 тонн | Межгородние перевозки"
            description="Грузоперевозки фурой 20 тонн по России. Межгородние перевозки, доставка крупных грузов, профессиональная логистика."
            keywords="грузоперевозки фурой, фура 20 тонн, межгородние перевозки, доставка крупных грузов"
            ;;
        "sbornye-gruzy")
            title="Сборные грузы | Экономичные грузоперевозки по России"
            description="Сборные грузы по России - экономичный способ доставки. Объединяем грузы, снижаем стоимость, быстрая доставка."
            keywords="сборные грузы, экономичные грузоперевозки, доставка сборных грузов, перевозка по России"
            ;;
        "gruzoperevozki-moskva-spb")
            title="Грузоперевозки Москва - Санкт-Петербург | Быстрая доставка"
            description="Грузоперевозки между Москвой и Санкт-Петербургом. Быстрая доставка, точный расчет стоимости, профессиональная логистика."
            keywords="грузоперевозки москва спб, доставка москва петербург, перевозки между городами"
            ;;
        "urgent-delivery")
            title="Срочная доставка грузов | Экспресс перевозки 24/7"
            description="Срочная доставка грузов по России. Экспресс перевозки 24/7, быстрая подача транспорта, гарантированные сроки."
            keywords="срочная доставка, экспресс перевозки, быстрая доставка грузов, доставка 24/7"
            ;;
        "contact")
            title="Контакты АвтоГОСТ | Связаться с транспортной компанией"
            description="Контакты транспортной компании АвтоГОСТ. Телефон, адрес, форма обратной связи. Заказать грузоперевозки онлайн."
            keywords="контакты автогост, транспортная компания контакты, заказать грузоперевозки"
            ;;
        "about")
            title="О компании АвтоГОСТ | Транспортная компания"
            description="О компании АвтоГОСТ - профессиональная транспортная компания. Опыт работы, преимущества, отзывы клиентов."
            keywords="о компании автогост, транспортная компания, отзывы клиентов"
            ;;
        "services")
            title="Услуги грузоперевозок | Полный спектр транспортных услуг"
            description="Полный спектр услуг грузоперевозок: газель, фура, сборные грузы, срочная доставка, межгородние перевозки."
            keywords="услуги грузоперевозок, транспортные услуги, виды перевозок, логистические услуги"
            ;;
        *)
            # Для остальных страниц используем общие шаблоны
            title="Грузоперевозки $name | АвтоГОСТ - Транспортная компания"
            description="Профессиональные грузоперевозки $name. Быстрая доставка, точный расчет стоимости, работаем 24/7."
            keywords="грузоперевозки $name, доставка $name, транспортные услуги"
            ;;
    esac
    
    # Обновляем title
    if grep -q "<title>" "$temp_file"; then
        sed -i "s|<title>.*</title>|<title>$title</title>|" "$temp_file"
    else
        # Добавляем title в head
        sed -i '/<head>/a \    <title>'$title'</title>' "$temp_file"
    fi
    
    # Обновляем description
    if grep -q 'name="description"' "$temp_file"; then
        sed -i 's|name="description" content="[^"]*"|name="description" content="'$description'"|' "$temp_file"
    else
        # Добавляем description в head
        sed -i '/<head>/a \    <meta name="description" content="'$description'">' "$temp_file"
    fi
    
    # Обновляем keywords
    if grep -q 'name="keywords"' "$temp_file"; then
        sed -i 's|name="keywords" content="[^"]*"|name="keywords" content="'$keywords'"|' "$temp_file"
    else
        # Добавляем keywords в head
        sed -i '/<head>/a \    <meta name="keywords" content="'$keywords'">' "$temp_file"
    fi
    
    # Добавляем Open Graph теги если их нет
    if ! grep -q 'property="og:title"' "$temp_file"; then
        sed -i '/<head>/a \    <meta property="og:title" content="'$title'">' "$temp_file"
        sed -i '/<head>/a \    <meta property="og:description" content="'$description'">' "$temp_file"
        sed -i '/<head>/a \    <meta property="og:type" content="website">' "$temp_file"
        sed -i '/<head>/a \    <meta property="og:url" content="https://avtogost77.ru/'$filename'">' "$temp_file"
    fi
    
    # Копируем обратно
    cp "$temp_file" "$file"
    rm "$temp_file"
    
    echo "✅ Оптимизирован: $filename"
}

# Функция для добавления Schema.org разметки
add_schema_markup() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    
    # Проверяем, есть ли уже Schema.org
    if grep -q 'application/ld+json' "$file"; then
        echo "⏭️ Schema.org уже есть в: $filename"
        return
    fi
    
    # Создаем Schema.org разметку
    local schema='{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Грузоперевозки",
  "description": "Профессиональные грузоперевозки по России",
  "provider": {
    "@type": "Organization",
    "name": "АвтоГОСТ",
    "url": "https://avtogost77.ru",
    "telephone": "+7 916 272-09-32"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Россия"
  },
  "serviceType": "Грузоперевозки"
}'
    
    # Добавляем Schema.org в head
    sed -i '/<head>/a \    <script type="application/ld+json">'$schema'</script>' "$file"
    
    echo "✅ Schema.org добавлен в: $filename"
}

# Функция для оптимизации заголовков
optimize_headings() {
    local file="$1"
    local filename=$(basename "$file")
    
    # Проверяем наличие H1
    if ! grep -q '<h1' "$file"; then
        echo "⚠️ Отсутствует H1 в: $filename"
        
        # Определяем подходящий H1 на основе названия файла
        local h1_text=""
        case "$filename" in
            "gazel-gruzoperevozki.html")
                h1_text="Грузоперевозки газелью"
                ;;
            "fura-20-tonn-gruzoperevozki.html")
                h1_text="Грузоперевозки фурой 20 тонн"
                ;;
            "sbornye-gruzy.html")
                h1_text="Сборные грузы"
                ;;
            "urgent-delivery.html")
                h1_text="Срочная доставка грузов"
                ;;
            *)
                h1_text="Грузоперевозки"
                ;;
        esac
        
        # Добавляем H1 после открытия body
        sed -i '/<body>/a \    <h1>'$h1_text'</h1>' "$file"
        echo "✅ H1 добавлен в: $filename"
    fi
}

# Основная функция
main() {
    echo "🚀 Начинаем SEO оптимизацию..."
    echo "=================================="
    
    # Обрабатываем все HTML файлы
    find . -name "*.html" -type f | while read -r file; do
        local filename=$(basename "$file")
        
        # Пропускаем backup файлы
        if [[ "$file" == *"backup"* ]]; then
            continue
        fi
        
        echo "📄 Обрабатываем: $filename"
        
        # Оптимизируем мета-теги
        optimize_meta_tags "$file"
        
        # Добавляем Schema.org
        add_schema_markup "$file"
        
        # Оптимизируем заголовки
        optimize_headings "$file"
        
        echo "✅ Завершена обработка: $filename"
        echo "---"
    done
    
    echo ""
    echo "✅ SEO оптимизация завершена!"
    echo "📁 Backup сохранен в: $backup_dir"
    echo ""
    echo "📊 Что было сделано:"
    echo "- Оптимизированы мета-теги (title, description, keywords)"
    echo "- Добавлены Open Graph теги"
    echo "- Добавлена Schema.org разметка"
    echo "- Оптимизированы заголовки H1"
    echo ""
    echo "🎯 Следующие шаги:"
    echo "1. Проверить результаты в браузере"
    echo "2. Протестировать в Google Search Console"
    echo "3. Мониторить позиции в поиске"
}

# Запускаем оптимизацию
main
