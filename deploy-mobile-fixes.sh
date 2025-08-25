#!/bin/bash

echo "🚀 СРОЧНЫЙ ДЕПЛОЙ МОБИЛЬНЫХ ФИКСОВ!"
echo "=================================="
echo "📱 Исправляем сжатую и нечитаемую мобилку"

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    exit 1
fi
echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию CSS
echo "📦 Создание резервной копии CSS..."
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp assets/css/unified-site-styles.css assets/css/unified-site-styles.css.backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем исправленный CSS с мобильными стилями
echo "📱 Загружаем ИСПРАВЛЕННЫЕ мобильные стили..."
scp -i $SSH_KEY assets/css/unified-site-styles.css $VPS_HOST:$VPS_PATH/assets/css/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/css/unified-site-styles.css"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/assets/css/unified-site-styles.css"

# Перезапускаем Nginx для очистки кеша
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "✅ МОБИЛЬНЫЕ ФИКСЫ УСПЕШНО РАЗВЕРНУТЫ!"
echo "🎯 Что исправлено:"
echo "   • Увеличены размеры шрифтов для читаемости"
echo "   • Исправлены размеры кнопок и форм"
echo "   • Добавлены touch-friendly таргеты (44px+)"
echo "   • Исправлен зум на iOS при фокусе на input"
echo "   • Улучшена адаптация хиро-секции"
echo "   • Исправлена навигация и калькулятор"
echo "   • Добавлены отступы и правильные grid-ы"
echo ""
echo "📱 Проверь сайт на мобильном - должно быть намного лучше!"
echo "🔗 https://avtogost77.ru"


