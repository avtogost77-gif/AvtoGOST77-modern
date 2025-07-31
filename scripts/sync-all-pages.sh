#!/bin/bash

# 🔄 СКРИПТ СИНХРОНИЗАЦИИ ВСЕХ СТРАНИЦ
# Обновляет все HTML файлы новыми фичами из index.html

echo "🔄 Начинаем синхронизацию всех страниц..."
echo "=================================="

# Список основных файлов для обновления
MAIN_FILES="about.html contact.html services.html faq.html"
BLOG_FILES="blog-1-carrier-failed.html blog-2-wildberries-delivery.html blog-3-spot-orders.html blog-4-remote-logistics.html blog-5-logistics-optimization.html blog-6-marketplace-insider.html"

# Объединяем все файлы
ALL_FILES="$MAIN_FILES $BLOG_FILES"

# Счетчики
updated=0
skipped=0

# Функция для безопасного обновления файла
update_file() {
    local file=$1
    
    if [ ! -f "$file" ]; then
        echo "⚠️  Файл $file не найден, пропускаем..."
        ((skipped++))
        return
    fi
    
    echo "📝 Обновляю $file..."
    
    # 1. Добавляем новые стили если их нет
    if ! grep -q "assets/css/styles.css" "$file"; then
        sed -i '/<\/head>/i\    <link rel="stylesheet" href="\/assets\/css\/styles.css">' "$file"
        echo "   ✅ Добавлены новые стили"
    fi
    
    # 2. Добавляем скрипты для калькулятора и городов
    if ! grep -q "smart-calculator-v2.js" "$file"; then
        sed -i '/<\/body>/i\    <script src="\/assets\/js\/smart-calculator-v2.js"><\/script>' "$file"
        echo "   ✅ Добавлен скрипт калькулятора"
    fi
    
    if ! grep -q "cities-simple.js" "$file"; then
        sed -i '/<\/body>/i\    <script src="\/assets\/js\/cities-simple.js"><\/script>' "$file"
        echo "   ✅ Добавлен скрипт городов"
    fi
    
    # 3. Добавляем ссылку на Telegram бот в header
    if ! grep -q "avtogost77_bot" "$file"; then
        # Ищем блок с контактами в header
        if grep -q "header-contacts" "$file"; then
            sed -i '/header-contacts/a\                <a href="https:\/\/t.me\/avtogost77_bot" class="header-contact">\n                    <i class="fab fa-telegram"><\/i> Telegram бот\n                <\/a>' "$file"
            echo "   ✅ Добавлена ссылка на Telegram бот"
        fi
    fi
    
    # 4. Обновляем контакты в footer
    if grep -q "footer-contacts" "$file" && ! grep -q "avtogost77_bot" "$file"; then
        sed -i '/WhatsApp/a\                    <a href="https:\/\/t.me\/avtogost77_bot" class="contact-link">\n                        <i class="fab fa-telegram"><\/i> Telegram бот\n                    <\/a>' "$file"
        echo "   ✅ Обновлены контакты в footer"
    fi
    
    ((updated++))
    echo "   ✅ Файл обновлен!"
    echo ""
}

# Обновляем основные страницы
echo "📋 Обновляем основные страницы..."
for file in $ALL_FILES; do
    update_file "$file"
done

# Проверяем есть ли exit-popup в index.html
if grep -q "exitPopup" index.html; then
    echo "💡 Найден exit-intent popup в index.html"
    echo "   Рекомендуется добавить его на все страницы вручную"
fi

echo "=================================="
echo "✅ Синхронизация завершена!"
echo "📊 Статистика:"
echo "   - Обновлено файлов: $updated"
echo "   - Пропущено файлов: $skipped"
echo ""
echo "🎯 Рекомендации:"
echo "1. Проверьте обновленные страницы в браузере"
echo "2. Добавьте exit-intent popup на важные страницы"
echo "3. Протестируйте формы на всех страницах"
echo "4. Запустите на VPS: git pull && ./scripts/sync-all-pages.sh"