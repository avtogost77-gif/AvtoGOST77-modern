#!/bin/bash

# Скрипт для добавления sticky CTA на все HTML страницы продакшена

echo "🔄 Добавление mobile sticky CTA на все страницы..."

for file in $(find . -maxdepth 1 -name "*.html"); do
    echo "Обработка $file..."

    # Проверяем, есть ли уже sticky CTA
    if ! grep -q "mobile-sticky-cta" "$file"; then
        # Находим место для вставки - перед </body>
        if grep -q "</body>" "$file"; then
            # Вставляем перед </body>
            sed -i '/<\/body>/i\
\
    <!-- 📱 MOBILE STICKY CTA -->\
    <div class="mobile-sticky-cta">\
        <div class="cta-buttons">\
            <a href="tel:+79162720932" class="btn btn-primary">\
                📞 Позвонить сейчас\
            </a>\
            <a href="https://wa.me/79162720932" class="btn btn-outline">\
                💬 WhatsApp\
            </a>\
        </div>\
    </div>' "$file"
            echo "✅ Добавлен sticky CTA в $file"
        else
            echo "⚠️  Нет закрывающего тега </body> в $file"
        fi
    else
        echo "⚠️  Sticky CTA уже существует в $file"
    fi
done

echo "🎉 Готово! Sticky CTA добавлен на все страницы"

