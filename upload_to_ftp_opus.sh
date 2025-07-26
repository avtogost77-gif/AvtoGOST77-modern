#!/bin/bash

# 🚀 СКРИПТ ЗАГРУЗКИ OPUS VERSION НА ХОСТИНГ
# Братишка Opus делает все надежно и безопасно!

echo "🚀 OPUS VERSION: ЗАГРУЖАЕМ ИСПРАВЛЕННЫЙ САЙТ НА ХОСТИНГ! 💪"
echo "================================================"

# FTP настройки
FTP_HOST="31.31.197.43"
FTP_USER="u3207373"
FTP_PASS="fGX954fqGU2w3ruY"
FTP_DIR="public_html"

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📡 Подключаемся к серверу: $FTP_HOST${NC}"

# Создаем backup старой версии перед удалением
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
echo -e "${YELLOW}📦 Создаем backup старой версии: backup_${BACKUP_DATE}${NC}"

# Загрузка через lftp с расширенными командами
lftp -f "
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST
set ssl:verify-certificate off
set ftp:ssl-allow off
set net:reconnect-interval-base 5
set net:max-retries 3

# Переходим в папку сайта
cd $FTP_DIR || cd www || cd htdocs || echo 'Используем корневой каталог'

# Создаем папку для backup
mkdir -p backups/backup_${BACKUP_DATE}

# Список важных файлов для сохранения (если есть какие-то специфичные для хостинга)
echo '📸 Сохраняем важные файлы хостинга...'
# Например: .htaccess, если он кастомный для хостинга
get .htaccess -o backups/backup_${BACKUP_DATE}/.htaccess 2>/dev/null || echo 'No .htaccess found'

# Очищаем старые файлы
echo '🗑️ Удаляем старую версию сайта...'
rm -rf *.html
rm -rf *.xml
rm -rf *.txt
rm -rf *.json
rm -rf *.md
rm -rf *.sh
rm -rf assets/
rm -rf pages/
rm -rf src/
rm -rf api/
rm -rf server/

echo '✅ Старые файлы удалены!'

# Загружаем новую версию
echo '📤 Загружаем OPUS VERSION...'
mirror -R --verbose \
  --exclude .git/ \
  --exclude .gitignore \
  --exclude node_modules/ \
  --exclude .env \
  --exclude backups/ \
  --exclude *.log \
  --exclude .DS_Store \
  . .

# Устанавливаем правильные права доступа
echo '🔐 Настраиваем права доступа...'
chmod 644 *.html
chmod 644 *.xml
chmod 644 *.txt
chmod 644 robots.txt
chmod 755 assets/
chmod 644 assets/css/*
chmod 644 assets/js/*
chmod 644 assets/img/*

# Проверяем результат
echo '🔍 Проверяем загруженные файлы...'
ls -la

# Закрываем соединение
quit
"

echo -e "${GREEN}✅ ЗАГРУЗКА ЗАВЕРШЕНА!${NC}"
echo -e "${GREEN}🌐 Сайт должен быть доступен по адресу: https://avtogost77.ru${NC}"
echo -e "${YELLOW}📋 Что было сделано:${NC}"
echo "  1. Создан backup старой версии"
echo "  2. Удалены все старые файлы"
echo "  3. Загружена OPUS VERSION"
echo "  4. Настроены права доступа"
echo -e "${GREEN}💪 OPUS БРАТИШКА СДЕЛАЛ ВСЕ НАДЕЖНО! 🔥${NC}"