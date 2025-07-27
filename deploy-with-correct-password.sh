#!/bin/bash

echo "🚀 ДЕПЛОЙ С ПРАВИЛЬНЫМ ПАРОЛЕМ!"
echo "==============================="

# ПРАВИЛЬНЫЕ данные для FTP
FTP_USER="u3207373"
FTP_PASS="fGX954fqGU2w3ruY"  # Новый пароль!
FTP_HOST="31.31.197.43"

cat > deploy_correct.txt << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set ftp:use-feat no
set net:timeout 30
set net:reconnect-interval-base 5
set net:max-retries 3

# Подключаемся с ПРАВИЛЬНЫМ паролем
open ftp://u3207373:fGX954fqGU2w3ruY@31.31.197.43

echo "📡 Подключаюсь с правильным паролем..."
cd www/avtogost77.ru

echo "🧹 Чищу мусор..."
rm -f *.md
rm -f *.sh
rm -f *.txt
rm -f *.zip
rm -f test-*.html
rm -f debug.html
rm -f sonnet-message.md
rm -f OUR-FRIENDSHIP*
rm -f CALCULATOR*
rm -f COMPLETE*
rm -f MVP*

echo "📤 Загружаю файлы..."
lcd /workspace

# HTML файлы
mput *.html
rm test-buttons.html
rm debug.html

# Системные файлы
put -O . robots.txt
put -O . sitemap.xml
put -O . .htaccess
put -O . favicon.svg
put -O . manifest.json
put -O . dadata-config.js
put -O . sw.js

# Assets целиком
mirror -R --no-perms --no-umask --parallel=4 assets assets

echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
ls -la

quit
EOF

echo "🚀 Запускаю деплой..."
lftp -f deploy_correct.txt

rm -f deploy_correct.txt

echo ""
echo "🎉 ГОТОВО!"
echo "🌐 Проверь сайт: https://avtogost77.ru"