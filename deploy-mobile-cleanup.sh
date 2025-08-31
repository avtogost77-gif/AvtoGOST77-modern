#!/bin/bash
# Скрипт для деплоя очищенных мобильных файлов

echo "🚀 ДЕПЛОЙ ОЧИЩЕННЫХ МОБИЛЬНЫХ ФАЙЛОВ..."

echo ""
echo "📦 Подготовка файлов для деплоя..."

# Массив HTML файлов для деплоя (исключаем backup директории)
html_files=($(find . -maxdepth 1 -name "*.html" -not -path "./backup*" -not -path "./mega-cleanup-backup*" -not -path "./inline-styles-backup*" -not -path "./canonical-fix-backup*" -not -path "./schema-fix-backup*" -not -path "./seo-fix-backup*" -not -path "./blog-fix-backup*" -not -path "./mobile-cleanup-backup*"))

# CSS файлы для деплоя
css_files=(
    "assets/css/mobile-optimized.css"
    "assets/css/mobile-fixes.css"
    "assets/css/critical-fixes.css"
    "assets/css/unified-site-styles.css"
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
echo "🚀 Начинаем деплой..."

# Деплоим HTML файлы
echo "📄 Загружаем HTML файлы..."
for file in "${html_files[@]}"; do
    echo "   📤 $file"
    scp -i ~/.ssh/id_ed25519 "$file" root@193.160.208.183:/www/wwwroot/avtogost77.ru/
done

# Деплоим CSS файлы
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

# Деплоим посадочную страницу блога
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
echo "   - Обновлена посадочная страница блога"
echo ""
echo "🎯 Проверьте мобильную версию:"
echo "   📱 Главная страница: https://avtogost77.ru/"
echo "   📱 Блог: https://avtogost77.ru/blog/"
echo ""
echo "💡 Рекомендации:"
echo "   1. Очистите кэш браузера (Ctrl+F5)"
echo "   2. Проверьте на разных устройствах"
echo "   3. Убедитесь, что все элементы отображаются корректно"
