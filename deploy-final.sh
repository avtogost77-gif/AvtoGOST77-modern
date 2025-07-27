#!/bin/bash

echo "🚀 ФИНАЛЬНЫЙ ДЕПЛОЙ СТАБИЛЬНОЙ ВЕРСИИ"
echo "======================================"

SERVER="u3207373@avtogost77.ru"
REMOTE_PATH="www/avtogost77.ru"

echo "📁 Загружаю основные файлы..."

# Основная страница (переименовываем финальную в index.html)
echo "📄 index.html (финальная стабильная версия)"
scp -o StrictHostKeyChecking=no index-final.html $SERVER:$REMOTE_PATH/index.html

# Дополнительные страницы
echo "📄 Дополнительные страницы..."
scp -o StrictHostKeyChecking=no help.html $SERVER:$REMOTE_PATH/
scp -o StrictHostKeyChecking=no terms.html $SERVER:$REMOTE_PATH/
scp -o StrictHostKeyChecking=no track.html $SERVER:$REMOTE_PATH/

# SEO файлы
echo "🔍 SEO файлы..."
scp -o StrictHostKeyChecking=no sitemap.xml $SERVER:$REMOTE_PATH/
scp -o StrictHostKeyChecking=no robots.txt $SERVER:$REMOTE_PATH/
scp -o StrictHostKeyChecking=no .htaccess $SERVER:$REMOTE_PATH/

# JS конфигурация
echo "⚙️ JS конфигурация..."
scp -o StrictHostKeyChecking=no dadata-config.js $SERVER:$REMOTE_PATH/

# CSS файлы
echo "🎨 CSS файлы..."
scp -o StrictHostKeyChecking=no assets/css/styles.css $SERVER:$REMOTE_PATH/assets/css/
scp -o StrictHostKeyChecking=no assets/css/main.css $SERVER:$REMOTE_PATH/assets/css/
scp -o StrictHostKeyChecking=no assets/css/mobile.css $SERVER:$REMOTE_PATH/assets/css/

# JS файлы
echo "⚡ JS файлы..."
scp -o StrictHostKeyChecking=no assets/js/emergency-fix.js $SERVER:$REMOTE_PATH/assets/js/
scp -o StrictHostKeyChecking=no assets/js/fias-integration.js $SERVER:$REMOTE_PATH/assets/js/
scp -o StrictHostKeyChecking=no assets/js/form-handler.js $SERVER:$REMOTE_PATH/assets/js/
scp -o StrictHostKeyChecking=no assets/js/main.js $SERVER:$REMOTE_PATH/assets/js/

echo ""
echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
echo "🌍 Проверяйте: https://avtogost77.ru/"
echo ""
echo "📋 Загружено:"
echo "- index.html (финальная стабильная версия)"
echo "- help.html, terms.html, track.html"
echo "- sitemap.xml, robots.txt, .htaccess"
echo "- dadata-config.js"
echo "- CSS: styles.css, main.css, mobile.css"
echo "- JS: emergency-fix.js, fias-integration.js, form-handler.js, main.js"