#!/bin/bash
# Скрипт для удаления дублирующейся питерской страницы

echo "🗑️ УДАЛЕНИЕ ДУБЛИРУЮЩЕЙСЯ ПИТЕРСКОЙ СТРАНИЦЫ..."

echo ""
echo "🔍 Проверка файлов..."

# Проверяем существование файлов
if [ -f "gruzoperevozki-moskva-spb.html" ]; then
    echo "   ✅ Найден файл для удаления: gruzoperevozki-moskva-spb.html"
else
    echo "   ❌ Файл gruzoperevozki-moskva-spb.html не найден"
    exit 1
fi

if [ -f "gruzoperevozki-spb.html" ]; then
    echo "   ✅ Оригинальная страница существует: gruzoperevozki-spb.html"
else
    echo "   ❌ Оригинальная страница gruzoperevozki-spb.html не найдена"
    exit 1
fi

echo ""
echo "🗑️ Удаление файла с сервера..."

# Удаляем файл с сервера
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "rm -f /www/wwwroot/avtogost77.ru/gruzoperevozki-moskva-spb.html"

echo ""
echo "🗑️ Удаление локального файла..."

# Удаляем локальный файл
rm -f gruzoperevozki-moskva-spb.html

echo ""
echo "🗑️ Удаление из sitemap.xml..."

# Создаем backup sitemap
cp sitemap.xml sitemap-backup-$(date +%Y%m%d-%H%M%S).xml

# Удаляем запись из sitemap
sed -i '/gruzoperevozki-moskva-spb.html/,+4d' sitemap.xml

echo ""
echo "🗑️ Удаление из всех HTML файлов..."

# Находим все HTML файлы (исключаем backup директории)
html_files=($(find . -maxdepth 1 -name "*.html" -not -path "./backup*" -not -path "./mega-cleanup-backup*" -not -path "./inline-styles-backup*" -not -path "./canonical-fix-backup*" -not -path "./schema-fix-backup*" -not -path "./seo-fix-backup*" -not -path "./blog-fix-backup*" -not -path "./mobile-cleanup-backup*"))

# Удаляем ссылки на дублирующуюся страницу
for file in "${html_files[@]}"; do
    echo "   📄 Очищаем: $file"
    # Удаляем ссылки на дублирующуюся страницу
    sed -i 's|href="gruzoperevozki-moskva-spb.html"|href="gruzoperevozki-spb.html"|g' "$file"
    sed -i 's|href="\/gruzoperevozki-moskva-spb.html"|href="\/gruzoperevozki-spb.html"|g' "$file"
done

echo ""
echo "🗑️ Удаление из robots.txt (если есть)..."

# Удаляем из robots.txt если есть
if [ -f "robots.txt" ]; then
    sed -i '/gruzoperevozki-moskva-spb.html/d' robots.txt
fi

echo ""
echo "🚀 Деплой обновленных файлов..."

# Деплоим обновленные файлы
scp -i ~/.ssh/id_ed25519 sitemap.xml root@193.160.208.183:/www/wwwroot/avtogost77.ru/

# Деплоим все HTML файлы (на случай если были изменения)
for file in "${html_files[@]}"; do
    scp -i ~/.ssh/id_ed25519 "$file" root@193.160.208.183:/www/wwwroot/avtogost77.ru/
done

echo ""
echo "🔄 Перезапуск nginx..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "systemctl reload nginx"

echo ""
echo "✅ Удаление завершено!"
echo "📊 Результат:"
echo "   - Удален файл: gruzoperevozki-moskva-spb.html"
echo "   - Обновлен sitemap.xml"
echo "   - Очищены ссылки во всех HTML файлах"
echo "   - Оставлена оригинальная страница: gruzoperevozki-spb.html"
echo ""
echo "🔗 Проверьте:"
echo "   - Оригинальная страница: https://avtogost77.ru/gruzoperevozki-spb.html"
echo "   - Дублирующаяся страница должна быть недоступна"
