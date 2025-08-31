#!/bin/bash

echo "🔧 ПОЛНАЯ ЗАМЕНА ВСЕХ ФАЙЛОВ!"
cd /www/wwwroot/avtogost77.ru

echo "📦 Создаем backup текущего состояния..."
BACKUP_NAME="backup-before-full-restore-$(date +%Y%m%d-%H%M%S)"
mkdir -p backups/$BACKUP_NAME
cp -r * backups/$BACKUP_NAME/ 2>/dev/null

echo "✅ Backup создан: $BACKUP_NAME"

echo "🧹 Очищаем прода..."
find . -maxdepth 1 ! -name '.' ! -name 'backups' ! -name '.git' -exec rm -rf {} +

echo "📤 Копируем ВСЕ файлы из бэкапа..."
cp -r backups/20250830-024906/* .

echo "✅ Все файлы скопированы!"

echo "🔐 Исправляем права..."
chown -R www-data:www-data .
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

echo "🔄 Перезагружаем nginx..."
nginx -s reload

echo "🎉 ПОЛНАЯ ЗАМЕНА ЗАВЕРШЕНА!"
echo "💾 Backup: backups/$BACKUP_NAME"
