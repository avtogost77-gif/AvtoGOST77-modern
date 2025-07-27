#!/bin/bash

echo "🚨 ЭКСТРЕННЫЙ ДЕПЛОЙ - OPUS RESCUE MISSION"
echo "========================================="

# Минимальный набор для восстановления
cat > emergency_deploy.txt << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set ftp:use-feat no
set net:timeout 30
set net:reconnect-interval-base 5
set net:max-retries 3

open ftp://u3207373:5x8cZ19H0rWhh6Qt@31.31.197.43

echo "📡 Подключаюсь..."
cd www/avtogost77.ru

echo "🧹 Удаляю мусор..."
rm -f *.md
rm -f *.sh
rm -f *.txt
rm -f *.zip
rm -f test-*.html
rm -f debug.html

echo "📤 Загружаю критичные файлы..."
lcd /workspace

# Основные файлы
put -O . index.html
put -O . robots.txt
put -O . sitemap.xml
put -O . .htaccess
put -O . favicon.svg
put -O . dadata-config.js

# HTML страницы
put -O . contact.html
put -O . services.html
put -O . faq.html
put -O . help.html
put -O . terms.html

# CSS минимум
cd assets/css
lcd /workspace/assets/css
put -O . main.css
put -O . mobile.css
put -O . styles.css

# JS минимум  
cd ../js
lcd /workspace/assets/js
put -O . main.js
put -O . emergency-fix.js
put -O . form-handler.js
put -O . fias-integration.js

cd ../..

echo "✅ Готово!"
ls -la

quit
EOF

echo "🚀 Запускаю экстренный деплой..."
lftp -f emergency_deploy.txt

rm -f emergency_deploy.txt

echo ""
echo "📊 РЕЗУЛЬТАТ:"
echo "- Если успешно - сайт должен работать"
echo "- Если timeout - нужен альтернативный способ"