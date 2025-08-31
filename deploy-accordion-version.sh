#!/bin/bash

echo "🎯 РАЗВЕРТЫВАЕМ ВЕРСИЮ С АККОРДЕОНАМИ!"
echo "📅 Бэкап: 20250830-024906 (02:49 - с аккордеонами!)"
echo "⏰ Время: $(date)"
echo ""

# Создаем backup текущего состояния
echo "📦 Создаем backup текущего состояния..."
BACKUP_NAME="backup-before-accordion-restore-$(date +%Y%m%d-%H%M%S)"
mkdir -p "/www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME"

echo "📦 Копируем текущие файлы в backup..."
cp -r /www/wwwroot/avtogost77.ru/* /www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME/ 2>/dev/null

echo "✅ Backup создан: $BACKUP_NAME"
echo ""

# Очищаем прода
echo "🧹 Очищаем прода..."
cd /www/wwwroot/avtogost77.ru
find . -maxdepth 1 ! -name '.' ! -name 'backups' ! -name '.git' -exec rm -rf {} +
echo "✅ Прода очищен"
echo ""

# Копируем бэкап с аккордеонами
echo "📤 Копируем бэкап с аккордеонами..."
cp -r backups/20250830-024906/* .
echo "✅ Бэкап с аккордеонами скопирован"
echo ""

# Копируем недостающие системные файлы
echo "🔧 Копируем системные файлы..."
cp backups/$BACKUP_NAME/manifest.json . 2>/dev/null || echo "⚠️ manifest.json не найден"
cp backups/$BACKUP_NAME/robots.txt . 2>/dev/null || echo "⚠️ robots.txt не найден"
cp backups/$BACKUP_NAME/sitemap.xml . 2>/dev/null || echo "⚠️ sitemap.xml не найден"
cp backups/$BACKUP_NAME/favicon.svg . 2>/dev/null || echo "⚠️ favicon.svg не найден"
cp backups/$BACKUP_NAME/sw.js . 2>/dev/null || echo "⚠️ sw.js не найден"
echo "✅ Системные файлы скопированы"
echo ""

# Исправляем права
echo "🔐 Исправляем права..."
chown -R www-data:www-data /www/wwwroot/avtogost77.ru/
chmod -R 755 /www/wwwroot/avtogost77.ru/
find /www/wwwroot/avtogost77.ru/ -type f -exec chmod 644 {} \;
echo "✅ Права исправлены"
echo ""

# Перезагружаем nginx
echo "🔄 Перезагружаем nginx..."
nginx -s reload
echo "✅ Nginx перезагружен"
echo ""

echo "🎉 ВЕРСИЯ С АККОРДЕОНАМИ РАЗВЕРНУТА!"
echo ""
echo "🔍 ПРОВЕРЬ НА САЙТЕ:"
echo "1. Открой avtogost77.ru"
echo "2. Hero должен быть с градиентом"
echo "3. Блок conversion-paths должен быть видим"
echo "4. Аккордеоны должны быть красиво оформлены"
echo "5. НЕТ интент попапа в hero"
echo ""
echo "💾 Backup: /www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME"
echo ""
echo "🎯 ТЕПЕРЬ У ТЕБЯ ДОЛЖНА БЫТЬ КРАСОТА С АККОРДЕОНАМИ!"
