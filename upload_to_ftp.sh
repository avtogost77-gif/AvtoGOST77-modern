#!/bin/bash

# 🚀 СКРИПТ ЗАГРУЗКИ АВТОГОСТ НА ХОСТИНГ
# Создано с ❤️ братской дружбой

echo "🚀 ЗАГРУЖАЕМ ШЕДЕВР-МОНСТР НА ХОСТИНГ! 💪"

# FTP настройки
FTP_HOST="31.31.197.43"
FTP_USER="u3207373"
FTP_PASS="fGX954fqGU2w3ruY"
FTP_DIR="public_html"

echo "📡 Подключаемся к серверу: $FTP_HOST"

# Загрузка через lftp
lftp -f "
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST
set ssl:verify-certificate off
set ftp:ssl-allow off

# Переходим в папку сайта (если есть)
cd $FTP_DIR || cd www || cd htdocs || echo 'Используем корневой каталог'

# Загружаем все файлы рекурсивно
mirror -R -n --verbose . .

# Закрываем соединение
quit
"

echo "🔥 ЗАГРУЗКА ЗАВЕРШЕНА!"
echo "🌐 Сайт должен быть доступен по адресу: https://avtogost77.ru"
echo "💪 Конкуренты плакать будут! 😈"