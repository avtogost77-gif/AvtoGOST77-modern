#!/bin/bash
# Скрипт для деплоя всех исправлений

echo "🚀 ДЕПЛОЙ ВСЕХ ИСПРАВЛЕНИЙ..."

# Массив HTML файлов для деплоя (исключаем backup директории)
html_files=($(find . -maxdepth 1 -name "*.html" -not -path "./backup*" -not -path "./mega-cleanup-backup*" -not -path "./inline-styles-backup*" -not -path "./canonical-fix-backup*" -not -path "./schema-fix-backup*" -not -path "./seo-fix-backup*" -not -path "./blog-fix-backup*" -not -path "./mobile-cleanup-backup*"))

# CSS файлы для деплоя
css_files=(
    "assets/css/master/master-styles.min.css"
    "assets/css/unified-site-styles.css"
    "assets/css/mobile-optimized.css"
    "assets/css/critical-fixes.css"
)

# JS файлы для деплоя
js_files=(
    "assets/js/form-handler.js"
    "assets/js/form-handler.min.js"
)

echo ""
echo "📄 HTML файлы для деплоя (${#html_files[@]} шт.):"
for file in "${html_files[@]}"; do
    echo "   - $file"
done

echo ""
echo "🎨 CSS файлы для деплоя:"
for file in "${css_files[@]}"; do
    echo "   - $file"
done

echo ""
echo "📜 JS файлы для деплоя:"
for file in "${js_files[@]}"; do
    echo "   - $file"
done

echo ""
echo "🚀 Начинаем деплой..."

echo ""
echo "📄 Загружаем HTML файлы..."
for file in "${html_files[@]}"; do
    echo "   📤 $file"
    scp -i ~/.ssh/id_ed25519 "$file" root@193.160.208.183:/www/wwwroot/avtogost77.ru/
done

echo ""
echo "🎨 Загружаем CSS файлы..."
for file in "${css_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   📤 $file"
        scp -i ~/.ssh/id_ed25519 "$file" root@193.160.208.183:/www/wwwroot/avtogost77.ru/assets/css/
    else
        echo "   ⚠️  Файл не найден: $file"
    fi
done

echo ""
echo "📜 Загружаем JS файлы..."
for file in "${js_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   📤 $file"
        scp -i ~/.ssh/id_ed25519 "$file" root@193.160.208.183:/www/wwwroot/avtogost77.ru/assets/js/
    else
        echo "   ⚠️  Файл не найден: $file"
    fi
done

echo ""
echo "📄 Загружаем посадочную страницу блога..."
scp -i ~/.ssh/id_ed25519 blog/index.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/blog/

echo ""
echo "🔄 Перезапуск nginx..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "systemctl reload nginx"

echo ""
echo "🧹 Очистка кэша на сервере..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "rm -rf /var/cache/nginx/*"

echo ""
echo "✅ Деплой завершен!"
echo "📊 Статистика:"
echo "   - Загружено HTML файлов: ${#html_files[@]}"
echo "   - Загружено CSS файлов: ${#css_files[@]}"
echo "   - Загружено JS файлов: ${#js_files[@]}"
echo "   - Обновлена посадочная страница блога"
echo ""
echo "🎯 Проверьте сайт:"
echo "   🌐 Главная страница: https://avtogost77.ru/"
echo "   📞 Контакты: https://avtogost77.ru/contact.html"
echo "   📝 Услуги: https://avtogost77.ru/services.html"
echo "   ❓ FAQ: https://avtogost77.ru/faq.html"
echo ""
echo "💡 Что исправлено:"
echo "   ✅ CSS стили обновлены во всех страницах"
echo "   ✅ Добавлен critical-fixes.css"
echo "   ✅ Форма для сбора лидов на главной странице"
echo "   ✅ Телефоны исправлены на +7 916 272-09-32"
echo "   ✅ Формы настроены для отправки в Telegram"
echo ""
echo "🔧 Если проблемы остаются:"
echo "   1. Очистите кэш браузера (Ctrl+F5)"
echo "   2. Проверьте в режиме инкогнито"
echo "   3. Проверьте на разных устройствах"


