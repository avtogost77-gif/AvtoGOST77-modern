#!/bin/bash

echo "🚀 Деплой исправлений Schema.org для Google..."

# Загружаем исправленные файлы
scp -i ~/.ssh/id_ed25519 *.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/

echo "✅ Исправления Schema.org загружены на сервер"
echo "🔄 Перезапустите nginx: systemctl reload nginx"
echo ""
echo "📊 Проверьте Google Search Console через 24-48 часов"
echo "🔗 Ссылка: https://search.google.com/search-console"
