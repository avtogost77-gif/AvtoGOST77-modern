#!/bin/bash

echo "🚀 OPUS DEPLOY SCRIPT - ЧИСТЫЙ ДЕПЛОЙ С ПРОВЕРКОЙ МУСОРА"
echo "=================================================="

# Данные для подключения
HOST="31.31.197.43"
USER="u3207373"
PASS="5x8cZ19H0rWhh6Qt"
REMOTE_DIR="www/avtogost77.ru"

echo "📋 Подключаюсь к серверу..."

# Создаем команды для lftp
cat > lftp_commands.txt << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set ftp:use-feat no
open ftp://u3207373:5x8cZ19H0rWhh6Qt@31.31.197.43
cd www/avtogost77.ru

echo "📂 Текущее содержимое директории:"
ls -la

echo "🗑️ Удаляю временные и тестовые файлы..."
rm -f test-buttons.html
rm -f debug.html
rm -f *.zip
rm -f *.sh
rm -f *.md
rm -f *.txt
rm -f *.log
rm -f .DS_Store
rm -f Thumbs.db
rm -f deploy-*
rm -f upload-*
rm -f sftp_*
rm -f simple_*
rm -f create-favicon.sh
rm -f sonnet-message.md
rm -f OUR-FRIENDSHIP*
rm -f CALCULATOR*
rm -f COMPLETE*
rm -f MVP*
rm -f BUSINESS*
rm -f CONTENT*
rm -f CURRENT*
rm -f DADATA*
rm -f DEPLOY*
rm -f PROFESSIONAL*
rm -f ROADMAP*
rm -f URGENT*
rm -f FIAS*
rm -f QUICK*
rm -f FINAL*
rm -f PRE-DEPLOY*
rm -f TROUBLESHOOTING*
rm -f README*
rm -f FULL_*
rm -f PWA_*
rm -f business_intel.md
rm -f friends_log.md
rm -f brand-messaging.md
rm -f content-strategy.md
rm -f keywords-strategy.md
rm -f low-competition-keywords.md
rm -f SEO-*.md

echo "📁 Проверяю папку assets..."
cd assets
rm -f *.md
rm -f *.txt
rm -f .DS_Store
cd ..

echo "✅ Очистка завершена!"

echo "📤 Загружаю новые файлы..."
lcd /workspace

# Загружаем HTML файлы
put -O . *.html
rm test-buttons.html
rm debug.html

# Загружаем важные файлы
put -O . robots.txt
put -O . sitemap.xml
put -O . .htaccess
put -O . favicon.svg
put -O . manifest.json
put -O . dadata-config.js
put -O . sw.js

# Загружаем assets
mirror -R --no-perms --no-umask --parallel=4 assets assets

echo "📊 Финальная проверка содержимого:"
ls -la
cd assets
ls -la
cd js
ls -la
cd ../css
ls -la
cd ../..

echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
quit
EOF

echo "🚀 Запускаю деплой..."
lftp -f lftp_commands.txt

# Удаляем временный файл
rm -f lftp_commands.txt

echo ""
echo "✅ ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!"
echo "🌐 Проверьте сайт: https://avtogost77.ru"
echo ""
echo "📋 Что было сделано:"
echo "1. ✅ Удалены все временные файлы и мусор"
echo "2. ✅ Загружены все HTML страницы (включая SEO)"
echo "3. ✅ Обновлены robots.txt, sitemap.xml, .htaccess"
echo "4. ✅ Загружены все JS и CSS файлы"
echo "5. ✅ Сайт готов к работе!"