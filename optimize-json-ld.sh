#!/bin/bash

echo "🚀 ОПТИМИЗАЦИЯ JSON-LD ПО ПЛАНУ GPT-5"
echo "======================================="

# Создаем бэкап
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)-jsonld"
mkdir -p "$BACKUP_DIR"
cp -r *.html "$BACKUP_DIR/"
echo "✅ Бэкап создан: $BACKUP_DIR"

# Список страниц для оптимизации JSON-LD
PAGES=(
    "index.html"
    "services.html"
    "contact.html"
    "sbornye-gruzy.html"
    "gruzoperevozki-spb.html"
    "gruzoperevozki-ekaterinburg.html"
    "gruzoperevozki-moskva-omsk.html"
    "moscow-spb-delivery.html"
    "blog-3-spot-orders.html"
)

echo ""
echo "📝 ОПТИМИЗАЦИЯ JSON-LD:"

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "   🔧 Обрабатываю: $page"
        
        # 1. Убираем все существующие JSON-LD блоки
        sed -i '/<script type="application\/ld+json">/,/<\/script>/d' "$page"
        
        # 2. Добавляем оптимизированный JSON-LD в head
        sed -i '/<title>/a\
    <!-- 🚨 ОПТИМИЗИРОВАННЫЙ JSON-LD (максимум 3 сущности) -->\
    <script type="application/ld+json">\
{\
  "@context": "https://schema.org",\
  "@type": "Organization",\
  "@id": "https://avtogost77.ru/#organization",\
  "name": "АвтоГОСТ",\
  "alternateName": "AvtoGOST77",\
  "url": "https://avtogost77.ru/",\
  "logo": {\
    "@type": "ImageObject",\
    "url": "https://avtogost77.ru/assets/img/logo.svg",\
    "width": 200,\
    "height": 60\
  },\
  "description": "Профессиональная логистическая компания, обеспечивающая перевозки по всей России. Быстрая подача транспорта, точный расчет стоимости, круглосуточная работа.",\
  "telephone": "+7 916 272-09-32",\
  "email": "avtogost77@gmail.com",\
  "address": {\
    "@type": "PostalAddress",\
    "addressLocality": "Москва",\
    "addressRegion": "Москва",\
    "addressCountry": "RU"\
  },\
  "openingHoursSpecification": {\
    "@type": "OpeningHoursSpecification",\
    "dayOfWeek": [\
      "Monday",\
      "Tuesday",\
      "Wednesday",\
      "Thursday",\
      "Friday",\
      "Saturday",\
      "Sunday"\
    ],\
    "opens": "00:00",\
    "closes": "23:59"\
  },\
  "sameAs": [\
    "https://t.me/avtogost77",\
    "https://wa.me/79162720932"\
  ],\
  "paymentAccepted": [\
    "Cash",\
    "Credit Card",\
    "Bank Transfer"\
  ],\
  "currenciesAccepted": "RUB",\
  "areaServed": {\
    "@type": "Country",\
    "name": "Россия"\
  }\
}\
</script>\
\
<script type="application/ld+json">\
{\
  "@context": "https://schema.org",\
  "@type": "Service",\
  "name": "Грузоперевозки по России",\
  "description": "Профессиональные грузоперевозки по всей России с подачей от 2 часов. Отдельные и сборные отправления.",\
  "provider": {\
    "@id": "https://avtogost77.ru/#organization"\
  },\
  "areaServed": {\
    "@type": "Country",\
    "name": "Россия"\
  },\
  "serviceType": "Грузоперевозки",\
  "offers": {\
    "@type": "Offer",\
    "price": "5000",\
    "priceCurrency": "RUB",\
    "description": "Базовая стоимость перевозки"\
  }\
}\
</script>\
\
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
    }\
  ]\
}\
</script>' "$page"
        
        echo "   ✅ JSON-LD оптимизирован: $page"
    else
        echo "   ❌ Файл не найден: $page"
    fi
done

echo ""
echo "✅ ОПТИМИЗАЦИЯ JSON-LD ЗАВЕРШЕНА!"
echo "📝 Результат:"
echo "   - Максимум 3 сущности на страницу"
echo "   - Убраны дубли и priceRange"
echo "   - Правильная структура Organization + Service + BreadcrumbList"
echo "   - Единый @id для Organization"
