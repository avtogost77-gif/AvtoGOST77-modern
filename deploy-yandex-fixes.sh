#!/bin/bash

echo "🚀 Деплой исправлений для Яндекс..."

# Загружаем исправленные файлы
scp -i ~/.ssh/id_ed25519 *.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/
scp -i ~/.ssh/id_ed25519 sitemap.xml root@193.160.208.183:/www/wwwroot/avtogost77.ru/
scp -i ~/.ssh/id_ed25519 robots.txt root@193.160.208.183:/www/wwwroot/avtogost77.ru/

# Загружаем конфигурации (если нужно)
# scp -i ~/.ssh/id_ed25519 .htaccess root@193.160.208.183:/www/wwwroot/avtogost77.ru/
# scp -i ~/.ssh/id_ed25519 nginx-redirects.conf root@193.160.208.183:/etc/nginx/sites-available/

echo "✅ Исправления загружены на сервер"
echo "🔄 Перезапустите nginx: systemctl reload nginx"
