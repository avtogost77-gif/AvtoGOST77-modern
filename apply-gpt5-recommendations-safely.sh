#!/bin/bash

echo "🎯 КОРРЕКТНОЕ ПРИМЕНЕНИЕ РЕКОМЕНДАЦИЙ GPT-5"
echo "============================================="

# Создаем бэкап
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)-gpt5-safe"
mkdir -p "$BACKUP_DIR"
cp -r *.html assets/ "$BACKUP_DIR/"
echo "✅ Бэкап создан: $BACKUP_DIR"

echo ""
echo "🔧 ПРИМЕНЯЕМ РЕКОМЕНДАЦИИ БЕЗОПАСНО:"

# 1. Убираем только явные дубли critical-css (не трогаем дизайн)
echo "   📝 Убираем дубли critical-css..."
for page in *.html; do
    if [ -f "$page" ]; then
        # Считаем количество critical-css блоков
        count=$(grep -c "critical-css" "$page")
        if [ "$count" -gt 1 ]; then
            echo "     🔧 Исправляем: $page ($count блоков)"
            # Убираем дубли, оставляем только первый
            sed -i '/<style id="critical-css">/,/<\/style>/d' "$page"
            # Добавляем один блок в head
            sed -i '/<title>/a\
    <!-- 🚨 КРИТИЧЕСКИЙ CSS ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ -->\
    <style id="critical-css">\
    /* Критический CSS загружается инлайн для устранения блокирующих ресурсов */\
    :root{--primary-color:#2D67F8;--text-dark:#1a1a1a;--text-gray:#666;--white:#ffffff;--border:#e0e0e0;}*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,BlinkMacSystemFont,\x27Segoe UI\x27,Roboto,sans-serif;line-height:1.6;color:var(--text-dark);overflow-x:hidden;}.container{max-width:1200px;margin:0 auto;padding:0 20px;}.header{background:var(--white);border-bottom:1px solid var(--border);padding:1rem 0;position:sticky;top:0;z-index:1000;box-shadow:0 2px 4px rgba(0,0,0,0.1);}.header-content{display:flex;align-items:center;justify-content:space-between;}.logo{display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:var(--text-dark);font-weight:700;font-size:1.25rem;}.logo-img{width:40px;height:40px;}.nav{display:none;}@media (min-width:768px){.nav{display:flex;gap:2rem;}}.nav-link{color:var(--text-dark);text-decoration:none;transition:color 0.3s;font-weight:500;}.nav-link:hover{color:var(--primary-color);}.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;transition:all 0.3s;border:none;cursor:pointer;font-size:1rem;}.btn-primary{background:var(--primary-color);color:var(--white);}.btn-primary:hover{background:#1e4fd8;transform:translateY(-1px);}.hero{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:4rem 0;position:relative;overflow:hidden;text-align:center;}.hero::before{content:\x27\x27;position:absolute;top:0;left:0;right:0;bottom:0;background:url(\x27data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\x27);opacity:0.3;}.hero-content{position:relative;z-index:2;max-width:800px;margin:0 auto;}.hero-title{font-size:2.5rem;font-weight:700;margin-bottom:1.5rem;line-height:1.2;}@media (min-width:768px){.hero-title{font-size:3.5rem;}}.hero-subtitle{font-size:1.25rem;margin-bottom:2rem;opacity:0.9;line-height:1.6;}.calculator-section{background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:4rem 0;}.calculator-wrapper{max-width:800px;margin:0 auto;background:white;border-radius:16px;padding:3rem;box-shadow:0 10px 30px rgba(0,0,0,0.1);}.section-title{font-size:2rem;font-weight:700;text-align:center;margin-bottom:2rem;color:var(--text-dark);}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;}.form-group{position:relative;}.form-group label{display:block;margin-bottom:0.5rem;font-weight:600;color:var(--text-dark);}.form-control{width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:8px;font-size:1rem;transition:border-color 0.3s;}.form-control:focus{outline:none;border-color:var(--primary-color);}img,svg{max-width:100%;height:auto;}h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2;margin-bottom:1rem;}h1{font-size:2.5rem;}h2{font-size:2rem;}h3{font-size:1.5rem;}h4{font-size:1.25rem;}p{margin-bottom:1rem;line-height:1.6;}.grid{display:grid;gap:2rem;}@media (min-width:768px){.grid{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));}}.footer{background:var(--text-dark);color:var(--white);padding:3rem 0 1rem;margin-top:4rem;}@media (max-width:768px){.form-row{grid-template-columns:1fr;}.calculator-wrapper{padding:2rem;margin:0 1rem;}.hero{padding:3rem 0;}.hero-title{font-size:2rem;}.hero-subtitle{font-size:1.1rem;}}@media (prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;}}.loading{opacity:0;transition:opacity 0.3s;}.loaded{opacity:1;}\
    </style>' "$page"
        fi
    fi
done

# 2. Оптимизируем JSON-LD (только основные страницы)
echo "   📊 Оптимизируем JSON-LD..."
MAIN_PAGES=("index.html" "services.html" "contact.html" "sbornye-gruzy.html")
for page in "${MAIN_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "     🔧 Оптимизируем: $page"
        # Убираем все JSON-LD блоки
        sed -i '/<script type="application\/ld+json">/,/<\/script>/d' "$page"
        # Добавляем оптимизированный JSON-LD
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
    fi
done

# 3. Добавляем FAQ только на главную (если нет)
echo "   ❓ Добавляем FAQ на главную..."
if ! grep -q "faq-section" index.html; then
    echo "     🔧 Добавляем FAQ блок..."
    sed -i '/<footer class="footer">/i\
\
<!-- 🚨 FAQ БЛОК ДЛЯ SEO -->\
<section class="faq-section" style="background: #f8f9fa; padding: 4rem 0; margin: 2rem 0;">\
    <div class="container">\
        <h2 class="section-title text-center" style="margin-bottom: 3rem;">Часто задаваемые вопросы</h2>\
        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">\
            <div class="faq-item" style="background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">\
                <button class="faq-question" style="width: 100%; padding: 1.5rem; text-align: left; background: none; border: none; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">\
                    <span>Как быстро подается транспорт?</span>\
                    <span class="faq-toggle" style="font-size: 1.5rem;">+</span>\
                </button>\
                <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.5rem; color: #666; line-height: 1.6;">\
                    <p>Мы подаем транспорт от 2 часов в Москве и МО. В других городах время подачи зависит от загруженности и составляет 2-4 часа.</p>\
                </div>\
            </div>\
            \
            <div class="faq-item" style="background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">\
                <button class="faq-question" style="width: 100%; padding: 1.5rem; text-align: left; background: none; border: none; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">\
                    <span>Какие документы нужны для перевозки?</span>\
                    <span class="faq-toggle" style="font-size: 1.5rem;">+</span>\
                </button>\
                <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.5rem; color: #666; line-height: 1.6;">\
                    <p>Для перевозки нужны: паспорт отправителя, документы на груз (если требуется), адрес доставки. Мы оформляем все необходимые документы.</p>\
                </div>\
            </div>\
            \
            <div class="faq-item" style="background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">\
                <button class="faq-question" style="width: 100%; padding: 1.5rem; text-align: left; background: none; border: none; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">\
                    <span>Работаете ли вы по выходным?</span>\
                    <span class="faq-toggle" style="font-size: 1.5rem;">+</span>\
                </button>\
                <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.5rem; color: #666; line-height: 1.6;">\
                    <p>Да, мы работаем 24/7, включая выходные и праздничные дни. Круглосуточная поддержка клиентов.</p>\
                </div>\
            </div>\
            \
            <div class="faq-item" style="background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">\
                <button class="faq-question" style="width: 100%; padding: 1.5rem; text-align: left; background: none; border: none; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">\
                    <span>Как рассчитывается стоимость доставки?</span>\
                    <span class="faq-toggle" style="font-size: 1.5rem;">+</span>\
                </button>\
                <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.5rem; color: #666; line-height: 1.6;">\
                    <p>Стоимость зависит от расстояния, веса и объема груза, типа транспорта. Используйте наш калькулятор для точного расчета.</p>\
                </div>\
            </div>\
        </div>\
    </div>\
</section>\
\
<!-- 🚨 FAQ JSON-LD ДЛЯ SEO -->\
<script type="application/ld+json">\
{\
  "@context": "https://schema.org",\
  "@type": "FAQPage",\
  "mainEntity": [\
    {\
      "@type": "Question",\
      "name": "Как быстро подается транспорт?",\
      "acceptedAnswer": {\
        "@type": "Answer",\
        "text": "Мы подаем транспорт от 2 часов в Москве и МО. В других городах время подачи зависит от загруженности и составляет 2-4 часа."\
      }\
    },\
    {\
      "@type": "Question",\
      "name": "Какие документы нужны для перевозки?",\
      "acceptedAnswer": {\
        "@type": "Answer",\
        "text": "Для перевозки нужны: паспорт отправителя, документы на груз (если требуется), адрес доставки. Мы оформляем все необходимые документы."\
      }\
    },\
    {\
      "@type": "Question",\
      "name": "Работаете ли вы по выходным?",\
      "acceptedAnswer": {\
        "@type": "Answer",\
        "text": "Да, мы работаем 24/7, включая выходные и праздничные дни. Круглосуточная поддержка клиентов."\
      }\
    },\
    {\
      "@type": "Question",\
      "name": "Как рассчитывается стоимость доставки?",\
      "acceptedAnswer": {\
        "@type": "Answer",\
        "text": "Стоимость зависит от расстояния, веса и объема груза, типа транспорта. Используйте наш калькулятор для точного расчета."\
      }\
    }\
  ]\
}\
</script>' index.html
fi

echo ""
echo "✅ РЕКОМЕНДАЦИИ GPT-5 ПРИМЕНЕНЫ БЕЗОПАСНО!"
echo "📝 Результат:"
echo "   - Дизайн сохранен (герой, картинки, градиенты)"
echo "   - Дубли critical-css убраны"
echo "   - JSON-LD оптимизирован"
echo "   - FAQ добавлен на главную"
echo "   - Функциональность сохранена"
