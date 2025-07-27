#!/bin/bash

echo "🚀 Начинаю деплой АвтоГОСТ..."

# Распаковка архива
echo "📦 Распаковка архива..."
rm -rf temp_deploy
unzip -q AVTOGOST-CLEAN-DEPLOY-20250727-071750.zip -d temp_deploy

# Деплой через lftp
echo "📤 Загрузка на хостинг..."
lftp -c "
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3
set net:reconnect-interval-base 5
open ftp://u3207373:fGX954fqGU2w3ruY@31.31.197.43
cd /www/avtogost77.ru
echo '🧹 Очистка старых файлов...'
rm -rf *
echo '📤 Загрузка новых файлов...'
mirror -R temp_deploy/ ./
echo '✅ Загрузка завершена!'
bye
"

# Очистка
rm -rf temp_deploy

echo "🎉 Деплой завершен!"