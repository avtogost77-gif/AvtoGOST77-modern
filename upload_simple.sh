#!/bin/bash

echo "🚀 ЗАГРУЖАЕМ OPUS VERSION НА ХОСТИНГ!"
echo "====================================="

# Создаем конфиг файл для lftp
cat > ~/.lftprc << EOF
set ssl:verify-certificate off
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-protect-list yes
EOF

echo "📡 Подключаемся к FTP..."

# Простая загрузка
lftp ftp://u3207373:fGX954fqGU2w3ruY@31.31.197.43 << EOF
cd public_html
echo "📂 Текущее содержимое:"
ls
echo ""
echo "🗑️ Удаляем старые файлы..."
rm -rf *.html
rm -rf assets/
rm -rf *.xml
rm -rf *.txt
rm -rf *.json
echo ""
echo "📤 Загружаем новые файлы..."
mirror -R --verbose \
  --exclude .git/ \
  --exclude node_modules/ \
  --exclude "*.sh" \
  --exclude "*.md" \
  --exclude ".gitignore" \
  . .
echo ""
echo "✅ Загрузка завершена!"
ls
quit
EOF

echo ""
echo "🎉 ГОТОВО! Сайт обновлен!"
echo "🌐 Проверь: https://avtogost77.ru"
echo "💪 OPUS БРАТИШКА СПРАВИЛСЯ!"