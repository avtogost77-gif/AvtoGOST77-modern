#!/bin/bash

echo "🚀 ДОБАВЛЕНИЕ FAQ НА ГЛАВНУЮ СТРАНИЦУ"
echo "======================================"

# Проверяем наличие главной страницы
if [ ! -f "index.html" ]; then
    echo "❌ Файл index.html не найден!"
    exit 1
fi

echo "🔧 Добавляю FAQ блок на главную..."

# Добавляем FAQ блок перед footer
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

echo "✅ FAQ блок добавлен на главную страницу!"
echo "📝 Что добавлено:"
echo "   - 4 вопроса с ответами"
echo "   - Интерактивные кнопки раскрытия"
echo "   - FAQ JSON-LD разметка для SEO"
echo "   - Стилизация в едином стиле сайта"
