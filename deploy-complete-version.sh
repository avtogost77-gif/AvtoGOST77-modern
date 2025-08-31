#!/bin/bash

echo "🎯 РАЗВЕРТЫВАЕМ ПОЛНУЮ ВЕРСИЮ!"
echo "📅 Бэкап: 20250830-025314 (02:53 - ПОЛНАЯ ВЕРСИЯ!)"
echo "⏰ Время: $(date)"
echo ""

# Создаем backup текущего состояния
echo "📦 Создаем backup текущего состояния..."
BACKUP_NAME="backup-before-complete-restore-$(date +%Y%m%d-%H%M%S)"
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

# Копируем ПОЛНУЮ версию
echo "📤 Копируем ПОЛНУЮ версию..."
cp -r backups/20250830-025314/assets/* .
echo "✅ Полная версия скопирована"
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

echo "🎉 ПОЛНАЯ ВЕРСИЯ РАЗВЕРНУТА!"
echo ""
echo "🔍 ПРОВЕРЬ НА САЙТЕ:"
echo "1. Открой avtogost77.ru"
echo "2. Hero должен быть с градиентом"
echo "3. Webp изображения должны загружаться"
echo "4. Все CSS/JS должны работать"
echo "5. Аккордеоны должны быть красиво оформлены"
echo "6. Калькулятор должен быть новый"
echo "7. Функция заморозки цены должна работать"
echo "8. НЕТ интент попапа в hero"
echo ""
echo "💾 Backup: /www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME"
echo ""
echo "🎯 ТЕПЕРЬ У ТЕБЯ ДОЛЖНА БЫТЬ ПОЛНАЯ ВЕРСИЯ С ВСЕМИ ФАЙЛАМИ!"
