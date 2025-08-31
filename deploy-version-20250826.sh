#!/bin/bash

echo "🚀 ДЕПЛОЙ ВЕРСИИ ОТ 26 АВГУСТА НА VPS"
echo "📅 Версия: restore-stable-version-20250826"
echo "⏰ Время: $(date)"
echo ""

# Проверяем, что мы в правильной ветке
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Текущая ветка: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "restore-stable-version-20250826" ]; then
    echo "❌ ОШИБКА: Мы не в ветке restore-stable-version-20250826"
    echo "🔄 Переключаемся на нужную ветку..."
    git checkout restore-stable-version-20250826
fi

echo ""
echo "📁 Файлы для деплоя:"
echo "✅ index.html - главная страница"
echo "✅ assets/css/critical-fixes.css - критические стили"
echo "✅ sw.js - Service Worker"
echo "✅ 11 страниц городов для семантической базы"
echo "✅ Все HTML страницы"
echo "✅ Все CSS и JS файлы"

echo ""
echo "🔄 Начинаем деплой на VPS..."

# Здесь будет команда для деплоя на VPS
# Пока что просто показываем, что готовы
echo "🎯 ГОТОВ К ДЕПЛОЮ НА VPS!"
echo "📋 Следующий шаг: залить файлы на сервер"
echo ""
echo "💡 Для деплоя используй:"
echo "   rsync -avz --exclude='.git' --exclude='backups' ./ user@server:/path/to/site/"
echo ""
echo "🔍 Проверь на VPS:"
echo "   1. Открыть сайт в браузере"
echo "   2. Проверить hero секцию на страницах тонников"
echo "   3. Убедиться, что нет попапа"
echo "   4. Проверить блок conversion-paths"
echo "   5. Проверить 11 страниц городов"
