#!/bin/bash
echo "🔐 ИСПРАВЛЯЕМ ПРАВА НА ВСЕ ФАЙЛЫ!"
echo "📅 Дата: $(date)"
echo "📁 Переходим в корень прода..."

cd /www/wwwroot/avtogost77.ru

echo "👤 Меняем владельца на www-data..."
chown -R www-data:www-data .

echo "📁 Устанавливаем права на папки (755)..."
find . -type d -exec chmod 755 {} \;

echo "📄 Устанавливаем права на файлы (644)..."
find . -type f -exec chmod 644 {} \;

echo "🔄 Перезагружаем Nginx..."
nginx -s reload

echo "✅ ГОТОВО! Права исправлены на все файлы!"
echo "🎉 Сайт должен работать корректно!"
