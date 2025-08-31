#!/bin/bash

echo "🔐 ИСПРАВЛЯЕМ ПРАВА!"
cd /www/wwwroot/avtogost77.ru

echo "👤 Меняем владельца на www-data..."
chown -R www-data:www-data .

echo "🔐 Устанавливаем права..."
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

echo "✅ Права исправлены!"

echo "🔄 Перезагружаем nginx..."
nginx -s reload

echo "🎉 ГОТОВО! Проверяй сайт!"

