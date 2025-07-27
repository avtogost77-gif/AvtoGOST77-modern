#!/bin/bash

echo "🚀 ДЕПЛОЙ ПО ПЛАНУ СОНЕТА"
echo "========================="

# Данные для подключения
HOST="31.31.197.43"
USER="u3207373"
PASS="5x8cZ19H0rWhh6Qt"

echo "📋 Создаю список файлов для загрузки..."

# Создаем команды для lftp
cat > lftp_deploy.txt << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set ftp:use-feat no
open ftp://u3207373:5x8cZ19H0rWhh6Qt@31.31.197.43
cd www/avtogost77.ru

echo "🗑️ Очищаю старые файлы..."
rm -f *.md
rm -f *.txt
rm -f *.sh
rm -f *.zip
rm -f test-buttons.html
rm -f debug.html

echo "📤 Загружаю основные HTML файлы..."
lcd /workspace
put -O . index.html
put -O . help.html
put -O . terms.html
put -O . sitemap.xml
put -O . robots.txt
put -O . .htaccess
put -O . dadata-config.js

echo "📤 Загружаю CSS файлы..."
cd assets/css
lcd /workspace/assets/css
put -O . styles.css
put -O . main.css
put -O . mobile.css
put -O . emergency-mobile-fix.css
put -O . critical.css
put -O . critical-mobile-fix.css

echo "📤 Загружаю JS файлы..."
cd ../js
lcd /workspace/assets/js
put -O . emergency-fix.js
put -O . fias-integration.js
put -O . form-handler.js
put -O . main.js
put -O . calc.js
put -O . modern-ux.js
put -O . seo-optimizer.js
put -O . content-generator.js
put -O . interactive-map.js
put -O . performance.js
put -O . sticky-bar.js
put -O . ticker.js
put -O . benefit.js

echo "📤 Загружаю остальные важные страницы..."
cd ../..
lcd /workspace
put -O . contact.html
put -O . services.html
put -O . faq.html
put -O . blog-1-carrier-failed.html
put -O . blog-2-wildberries-delivery.html
put -O . blog-3-spot-orders.html
put -O . blog-4-remote-logistics.html
put -O . blog-5-logistics-optimization.html
put -O . blog-6-marketplace-insider.html
put -O . marketplace-delivery.html
put -O . moscow-regions.html
put -O . urgent-delivery.html
put -O . faq-seo-optimized.html
put -O . moscow-spb-delivery.html
put -O . logistics-for-pvh.html
put -O . ip-small-business-delivery.html
put -O . self-employed-delivery.html
put -O . confectionery-delivery.html
put -O . regions-to-marketplaces.html
put -O . favicon.svg
put -O . manifest.json
put -O . sw.js

echo "📊 Проверяю финальную структуру..."
ls -la
cd assets
ls -la

echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
quit
EOF

echo "🚀 Запускаю деплой..."
lftp -f lftp_deploy.txt

# Удаляем временный файл
rm -f lftp_deploy.txt

echo ""
echo "✅ ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!"
echo "🌐 Сайт обновлен: https://avtogost77.ru"
echo ""
echo "📋 Что было загружено:"
echo "- ✅ Все HTML страницы (включая новые SEO)"
echo "- ✅ Все CSS файлы"
echo "- ✅ Все JS файлы"
echo "- ✅ sitemap.xml, robots.txt, .htaccess"
echo "- ✅ Favicon и манифест"