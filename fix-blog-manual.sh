#!/bin/bash
# Улучшенный скрипт для исправления статей блога

echo "🔧 Ручное исправление статей блога..."

# Массив статей блога
blog_articles=(
    "blog-1-carrier-failed.html"
    "blog-2-wildberries-delivery.html"
    "blog-3-spot-orders.html"
    "blog-4-remote-logistics.html"
    "blog-5-logistics-optimization.html"
    "blog-6-marketplace-insider.html"
    "blog-7-how-to-order-gazelle.html"
    "blog-8-cargo-insurance.html"
    "blog-9-dangerous-goods.html"
    "blog-10-self-employed-logistics.html"
)

echo ""
echo "🔧 Этап 1: Исправление CSS ссылок..."

# Исправляем CSS ссылки во всех статьях
for article in "${blog_articles[@]}"; do
    echo "   📄 Исправляем CSS: $article"
    
    # Исправляем дублирование версий в CSS ссылках
    sed -i 's|master-styles.min.css?v=20250825-clean?v=20250825-clean|master-styles.min.css?v=20250825-clean|g' "$article"
    sed -i 's|unified-site-styles.css?v=20250825-clean?v=20250825-clean|unified-site-styles.css?v=20250825-clean|g' "$article"
    
    # Удаляем устаревшие CSS ссылки если они есть
    sed -i '/fix-inline-styles.css/d' "$article"
done

echo ""
echo "🧹 Этап 2: Очистка Schema.org разметки..."

# Очищаем избыточную Schema.org разметку
for article in "${blog_articles[@]}"; do
    echo "   📄 Очищаем Schema.org: $article"
    
    # Удаляем избыточную Organization разметку (оставляем только BlogPosting)
    # Находим и удаляем Organization блок
    sed -i '/"@context": "https:\/\/schema.org"/,/}/d' "$article"
    
    # Добавляем чистую Organization разметку
    organization_markup='    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "АвтоГОСТ",
  "url": "https://avtogost77.ru",
  "telephone": "+79162720932",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressCountry": "RU"
  }
}
</script>'
    
    # Вставляем после первого script tag
    sed -i '/<script type="application\/ld+json">/a\'"$organization_markup" "$article"
done

echo ""
echo "🔗 Этап 3: Добавление внутренних ссылок..."

# Добавляем ссылки на новые страницы городов в каждую статью
for article in "${blog_articles[@]}"; do
    echo "   📄 Добавляем ссылки: $article"
    
    # Добавляем ссылки в зависимости от темы статьи
    case "$article" in
        "blog-1-carrier-failed.html")
            # Добавляем ссылки на популярные маршруты
            sed -i 's|где искать замену|где искать замену. Попробуйте <a href="gruzoperevozki-moskva-spb.html">Москва-СПб</a> или <a href="gruzoperevozki-moskva-ekaterinburg.html">Москва-Екатеринбург</a>|g' "$article"
            ;;
        "blog-2-wildberries-delivery.html")
            # Добавляем ссылки на популярные маршруты
            sed -i 's|популярные маршруты|популярные маршруты: <a href="gruzoperevozki-moskva-spb.html">Москва-СПб</a>, <a href="gruzoperevozki-moskva-ekaterinburg.html">Москва-Екатеринбург</a>|g' "$article"
            ;;
        "blog-3-spot-orders.html")
            # Добавляем ссылки на все города
            sed -i 's|где доступны спот-заявки|где доступны спот-заявки: <a href="gruzoperevozki-moskva-kazan.html">Москва-Казань</a>, <a href="gruzoperevozki-moskva-nizhny-novgorod.html">Москва-Нижний Новгород</a>|g' "$article"
            ;;
        "blog-4-remote-logistics.html")
            # Добавляем ссылки на удаленные города
            sed -i 's|удаленные города|удаленные города: <a href="gruzoperevozki-moskva-novosibirsk.html">Москва-Новосибирск</a>, <a href="gruzoperevozki-moskva-omsk.html">Москва-Омск</a>|g' "$article"
            ;;
        "blog-5-logistics-optimization.html")
            # Добавляем ссылки на все направления
            sed -i 's|все направления|все направления: <a href="gruzoperevozki-moskva-spb.html">Москва-СПб</a>, <a href="gruzoperevozki-moskva-ekaterinburg.html">Москва-Екатеринбург</a>|g' "$article"
            ;;
        "blog-6-marketplace-insider.html")
            # Добавляем ссылки на популярные маршруты
            sed -i 's|популярные маршруты|популярные маршруты: <a href="gruzoperevozki-moskva-spb.html">Москва-СПб</a>, <a href="gruzoperevozki-moskva-krasnodar.html">Москва-Краснодар</a>|g' "$article"
            ;;
        "blog-7-how-to-order-gazelle.html")
            # Добавляем ссылки на города
            sed -i 's|ссылки на города|ссылки на города: <a href="gruzoperevozki-moskva-kazan.html">Москва-Казань</a>, <a href="gruzoperevozki-moskva-nizhny-novgorod.html">Москва-Нижний Новгород</a>|g' "$article"
            ;;
        "blog-8-cargo-insurance.html")
            # Добавляем ссылки на направления
            sed -i 's|где нужна страховка|где нужна страховка: <a href="gruzoperevozki-moskva-ekaterinburg.html">Москва-Екатеринбург</a>, <a href="gruzoperevozki-moskva-novosibirsk.html">Москва-Новосибирск</a>|g' "$article"
            ;;
        "blog-9-dangerous-goods.html")
            # Добавляем ссылки на промышленные города
            sed -i 's|города с промышленностью|города с промышленностью: <a href="gruzoperevozki-moskva-ekaterinburg.html">Москва-Екатеринбург</a>, <a href="gruzoperevozki-moskva-chelyabinsk.html">Москва-Челябинск</a>|g' "$article"
            ;;
        "blog-10-self-employed-logistics.html")
            # Добавляем ссылки на популярные маршруты
            sed -i 's|популярные маршруты|популярные маршруты: <a href="gruzoperevozki-moskva-kazan.html">Москва-Казань</a>, <a href="gruzoperevozki-moskva-nizhny-novgorod.html">Москва-Нижний Новгород</a>|g' "$article"
            ;;
    esac
done

echo ""
echo "📝 Этап 4: Обновление дат на 26 августа 2025..."

# Обновляем даты на актуальные
for article in "${blog_articles[@]}"; do
    echo "   📄 Обновляем даты: $article"
    sed -i 's/2024/2025/g' "$article"
    sed -i 's/15 января 2025/26 августа 2025/g' "$article"
    sed -i 's/1 января 2025/26 августа 2025/g' "$article"
    sed -i 's/2025-01-15/2025-08-26/g' "$article"
done

echo ""
echo "✅ Все исправления завершены!"
echo "📊 Статистика:"
echo "   - Исправлено статей: ${#blog_articles[@]}"
echo "   - Обновлены CSS ссылки"
echo "   - Очищена Schema.org разметка"
echo "   - Добавлены внутренние ссылки"
echo "   - Обновлены даты на 26 августа 2025"
echo ""
echo "�� Готово к деплою!"
