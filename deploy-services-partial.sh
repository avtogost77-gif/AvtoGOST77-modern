#!/bin/bash

echo "🚀 ЧАСТИЧНЫЙ ДЕПЛОЙ SERVICES.HTML"
echo "================================="
echo "📤 Деплоим исправленный header и начальные фиксы"

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    exit 1
fi
echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию на VPS
echo "📦 Создание резервной копии на VPS..."
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp services.html services.html.backup-header-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем исправленную страницу
echo "📤 Загружаем ЧАСТИЧНО ИСПРАВЛЕННУЮ services.html..."
scp -i $SSH_KEY services.html $VPS_HOST:$VPS_PATH/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/services.html"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/services.html"

# Перезапускаем Nginx
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "✅ ЧАСТИЧНЫЕ ИСПРАВЛЕНИЯ РАЗВЕРНУТЫ!"
echo ""
echo "🎯 ЧТО УЖЕ ИСПРАВЛЕНО:"
echo "   ✅ Современный header с логотипом 🚛 АвтоГОСТ"
echo "   ✅ Полная навигация с поиском и телефоном"  
echo "   ✅ Мобильное меню"
echo "   ✅ Правильные ссылки на главную"
echo ""
echo "⏳ ЕЩЕ НУЖНО СДЕЛАТЬ:"
echo "   🎨 Удалить inline стили"
echo "   💰 Обновить цены"
echo "   📜 Добавить современные скрипты"
echo "   🎭 Исправить footer"
echo ""
echo "🔗 Проверь результат: https://avtogost77.ru/services.html"
echo "📱 Header уже должен выглядеть как на главной!"


