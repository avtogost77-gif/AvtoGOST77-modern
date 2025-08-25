#!/bin/bash

echo "💀 HARDCORE ДЕПЛОЙ ОЧИЩЕННОГО SERVICES.HTML!"
echo "============================================"
echo "🔥 Деплоим ЖЕСТКО ПОЧИЩЕННУЮ страницу услуг!"

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
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp services.html services.html.before-hardcore-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем ОЧИЩЕННУЮ страницу
echo "💀 Загружаем HARDCORE ОЧИЩЕННУЮ services.html..."
scp -i $SSH_KEY services.html $VPS_HOST:$VPS_PATH/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/services.html"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/services.html"

# Перезапускаем Nginx
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "💀 HARDCORE CLEANUP РАЗВЕРНУТ!"
echo ""
echo "🔥 ЧТО УНИЧТОЖЕНО:"
echo "   💣 180+ строк inline CSS мусора"
echo "   🗑️ Устаревшие комментарии"  
echo "   ⚰️ Legacy классы services-hero"
echo "   💸 Старые цены"
echo ""
echo "✨ ЧТО ДОБАВЛЕНО:"
echo "   🤖 Robots meta tag"
echo "   💰 Актуальные цены (газель 8к, фура 35к)"
echo "   🎯 Чистая структура header"
echo "   📱 Современная навигация"
echo ""
echo "💎 РЕЗУЛЬТАТ:"
echo "   ✅ Страница использует unified-site-styles.css"
echo "   ✅ Единый стиль с главной"
echo "   ✅ Актуальные цены"
echo "   ✅ Оптимизированная структура"
echo ""
echo "🔗 Проверь результат: https://avtogost77.ru/services.html"
echo "🎯 Страница услуг теперь ЧИСТАЯ И ОПТИМИЗИРОВАННАЯ!"


