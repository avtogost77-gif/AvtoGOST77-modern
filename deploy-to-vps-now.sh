#!/bin/bash

echo "🚀 НЕМЕДЛЕННЫЙ ДЕПЛОЙ ВЕРСИИ ОТ 29 АВГУСТА НА VPS!"
echo "📅 Версия: restore-stable-version-20250829"
echo "⏰ Время: $(date)"
echo ""

# Проверяем, что мы в правильной ветке
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Текущая ветка: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "restore-stable-version-20250829" ]; then
    echo "❌ ОШИБКА: Мы не в ветке restore-stable-version-20250829"
    echo "🔄 Переключаемся на нужную ветку..."
    git checkout restore-stable-version-20250829
fi

echo ""
echo "📦 Архив для деплоя: deploy-version-20250829.tar.gz"
echo "📏 Размер: $(ls -lh deploy-version-20250829.tar.gz | awk '{print $5}')"
echo ""

echo "🔄 Начинаем деплой на VPS..."

# Создаем список файлов для проверки
echo "📋 Файлы в архиве:"
tar -tzf deploy-version-20250829.tar.gz | head -20
echo "..."

echo ""
echo "🎯 ГОТОВ К ДЕПЛОЮ НА VPS!"
echo ""
echo "📤 КОМАНДЫ ДЛЯ ДЕПЛОЯ:"
echo ""
echo "1️⃣ ЗАЛИТЬ АРХИВ НА VPS:"
echo "   scp deploy-version-20250829.tar.gz user@your-server:/tmp/"
echo ""
echo "2️⃣ ПОДКЛЮЧИТЬСЯ К VPS:"
echo "   ssh user@your-server"
echo ""
echo "3️⃣ РАСПАКОВАТЬ НА VPS:"
echo "   cd /var/www/your-site/"
echo "   tar -xzf /tmp/deploy-version-20250829.tar.gz"
echo ""
echo "4️⃣ ПРОВЕРИТЬ ПРАВА:"
echo "   sudo chown -R www-data:www-data /var/www/your-site/"
echo "   sudo chmod -R 755 /var/www/your-site/"
echo ""
echo "🔍 ПРОВЕРКА НА VPS:"
echo "   1. Открыть сайт в браузере"
echo "   2. Проверить hero секцию на страницах тонников"
echo "   3. Убедиться, что нет попапа"
echo "   4. Проверить блок conversion-paths"
echo ""
echo "💡 АЛЬТЕРНАТИВНЫЙ СПОСОБ (rsync):"
echo "   rsync -avz --exclude='.git' --exclude='backups' ./ user@server:/var/www/your-site/"
