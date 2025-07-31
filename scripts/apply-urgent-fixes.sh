#!/bin/bash

# 🚀 ПРИМЕНЯЕМ СРОЧНЫЕ УЛУЧШЕНИЯ НА ВСЕ СТРАНИЦЫ

echo "🎯 Начинаем применение срочных улучшений..."

# Список всех HTML файлов для обновления
HTML_FILES=(
    "index.html"
    "about.html"
    "services.html"
    "contact.html"
    "faq.html"
    "blog-1-carrier-failed.html"
    "blog-2-wildberries-delivery.html"
    "blog-3-spot-orders.html"
    "blog-4-remote-logistics.html"
    "blog-5-logistics-optimization.html"
    "blog-6-marketplace-insider.html"
)

# Функция для добавления стилей
add_styles() {
    local file=$1
    echo "  📎 Добавляем стили в $file"
    
    # Проверяем, есть ли уже urgent-fixes.css
    if ! grep -q "urgent-fixes.css" "$file"; then
        # Добавляем после main.css
        sed -i '/<link rel="stylesheet" href="assets\/css\/main.css">/a\    <link rel="stylesheet" href="assets/css/urgent-fixes.css">' "$file"
    fi
}

# Функция для добавления плавающих кнопок
add_float_buttons() {
    local file=$1
    echo "  📱 Добавляем плавающие кнопки в $file"
    
    # HTML для кнопок
    FLOAT_BUTTONS='
<!-- Плавающие кнопки -->
<div class="float-buttons">
    <a href="tel:+79999999999" class="float-btn phone-btn">
        <i class="fas fa-phone-alt"></i>
        <span class="tooltip">Позвонить сейчас</span>
    </a>
    <a href="https://wa.me/79999999999?text=Здравствуйте! Интересует расчет стоимости грузоперевозки" class="float-btn whatsapp-btn" target="_blank">
        <i class="fab fa-whatsapp"></i>
        <span class="tooltip">WhatsApp</span>
    </a>
    <a href="https://t.me/avtogost77_bot" class="float-btn telegram-btn" target="_blank">
        <i class="fab fa-telegram-plane"></i>
        <span class="tooltip">Telegram бот</span>
    </a>
</div>'
    
    # Проверяем, есть ли уже кнопки
    if ! grep -q "float-buttons" "$file"; then
        # Добавляем перед </body>
        awk -v buttons="$FLOAT_BUTTONS" '
            /<\/body>/ { print buttons }
            { print }
        ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
}

# Функция для добавления скрипта отслеживания
add_tracking() {
    local file=$1
    echo "  📊 Добавляем отслеживание кликов в $file"
    
    TRACKING_SCRIPT='
<!-- Отслеживание кликов -->
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Телефон
    document.querySelectorAll("a[href^=\"tel:\"]").forEach(link => {
        link.addEventListener("click", () => {
            if (typeof ym !== "undefined") {
                ym(103413788, "reachGoal", "phone_click", {
                    from: window.location.pathname
                });
            }
        });
    });
    
    // WhatsApp
    document.querySelectorAll("a[href*=\"wa.me\"]").forEach(link => {
        link.addEventListener("click", () => {
            if (typeof ym !== "undefined") {
                ym(103413788, "reachGoal", "whatsapp_click", {
                    from: window.location.pathname
                });
            }
        });
    });
});
</script>'
    
    # Проверяем, есть ли уже скрипт
    if ! grep -q "phone_click" "$file"; then
        # Добавляем перед </body>
        awk -v script="$TRACKING_SCRIPT" '
            /<\/body>/ { print script }
            { print }
        ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
}

# Применяем ко всем файлам
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "🔧 Обновляем $file..."
        add_styles "$file"
        add_float_buttons "$file"
        add_tracking "$file"
    else
        echo "⚠️  Файл $file не найден"
    fi
done

echo ""
echo "✅ Готово! Применены улучшения:"
echo "  • Добавлены стили urgent-fixes.css"
echo "  • Добавлены плавающие кнопки (телефон, WhatsApp, Telegram)"
echo "  • Добавлено отслеживание кликов для Метрики"
echo ""
echo "📱 НЕ ЗАБУДЬ:"
echo "  1. Заменить +79999999999 на реальный телефон"
echo "  2. Проверить ссылку на Telegram бота"
echo "  3. Обновить форму захвата в калькуляторе"