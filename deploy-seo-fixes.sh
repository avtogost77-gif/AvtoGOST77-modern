#!/bin/bash

echo "🚀 Деплой SEO исправлений..."

# Загружаем исправленные файлы
scp -i ~/.ssh/id_ed25519 blog-3-spot-orders.html blog-5-logistics-optimization.html blog-9-dangerous-goods.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/

# Загружаем .htaccess
scp -i ~/.ssh/id_ed25519 .htaccess root@193.160.208.183:/www/wwwroot/avtogost77.ru/

echo "✅ SEO исправления загружены на сервер"
echo "🔄 Перезапустите nginx: systemctl reload nginx"
echo ""
echo "📊 Проверьте через 24-48 часов:"
echo "   - H1=Title ошибки исчезли"
echo "   - 404 ошибки исправлены"
