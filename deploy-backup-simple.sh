#!/bin/bash

echo "🚀 ПРОСТАЯ ЗАМЕНА ПРОДА БЭКАПОМ ОТ 30 АВГУСТА!"
echo "📅 Бэкап: 20250830-025314"
echo "⏰ Время: $(date)"
echo ""

# Создаем backup текущего состояния
echo "🔄 СОЗДАНИЕ BACKUP ТЕКУЩЕГО СОСТОЯНИЯ..."
BACKUP_NAME="backup-before-restore-$(date +%Y%m%d-%H%M%S)"
mkdir -p "/www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME"

echo "📦 Копируем текущие файлы в backup..."
cp -r /www/wwwroot/avtogost77.ru/* /www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME/ 2>/dev/null

echo "✅ Backup создан: /www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME"
echo ""

# Очищаем текущую директорию (кроме backups)
echo "🧹 ОЧИСТКА ТЕКУЩЕЙ ДИРЕКТОРИИ..."
cd /www/wwwroot/avtogost77.ru
find . -maxdepth 1 ! -name '.' ! -name 'backups' ! -name '.git' -exec rm -rf {} +
echo "✅ Текущая директория очищена"
echo ""

# Копируем бэкап
echo "📤 КОПИРОВАНИЕ БЭКАПА..."
cp -r backups/20250830-025314/assets/* .
echo "✅ Бэкап скопирован"
echo ""

# Копируем недостающие системные файлы
echo "🔧 КОПИРОВАНИЕ СИСТЕМНЫХ ФАЙЛОВ..."
cp backups/$BACKUP_NAME/manifest.json . 2>/dev/null || echo "⚠️ manifest.json не найден"
cp backups/$BACKUP_NAME/robots.txt . 2>/dev/null || echo "⚠️ robots.txt не найден"
cp backups/$BACKUP_NAME/sitemap.xml . 2>/dev/null || echo "⚠️ sitemap.xml не найден"
cp backups/$BACKUP_NAME/favicon.svg . 2>/dev/null || echo "⚠️ favicon.svg не найден"
cp backups/$BACKUP_NAME/sw.js . 2>/dev/null || echo "⚠️ sw.js не найден"
echo "✅ Системные файлы скопированы"
echo ""

# Исправляем права доступа
echo "🔐 ИСПРАВЛЕНИЕ ПРАВ ДОСТУПА..."
chown -R www-data:www-data /www/wwwroot/avtogost77.ru/
chmod -R 755 /www/wwwroot/avtogost77.ru/
find /www/wwwroot/avtogost77.ru/ -type f -exec chmod 644 {} \;
echo "✅ Права доступа исправлены"
echo ""

# Перезагружаем nginx
echo "🔄 ПЕРЕЗАГРУЗКА NGINX..."
nginx -s reload
echo "✅ Nginx перезагружен"
echo ""

echo "🎉 ЗАМЕНА ПРОДА ЗАВЕРШЕНА!"
echo ""
echo "🔍 ПРОВЕРЬ НА САЙТЕ:"
echo "1. Открой avtogost77.ru в браузере"
echo "2. Проверь hero секцию - должен быть градиент"
echo "3. Проверь блок conversion-paths - должен быть видим"
echo "4. Проверь, что нет интент попапа в hero"
echo ""
echo "💾 BACKUP ТЕКУЩЕГО СОСТОЯНИЯ:"
echo "   /www/wwwroot/avtogost77.ru/backups/$BACKUP_NAME"
echo ""
echo "🎯 УСПЕХ! Теперь у тебя должна быть красота без попапов!"
