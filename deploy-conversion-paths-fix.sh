#!/bin/bash

echo "🔥 СРОЧНЫЙ ФИКС: CONVERSION PATHS!"
echo "================================="
echo "🎯 Исправляем белый на белом - добавляем контрастность!"

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    exit 1
fi
echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию
echo "📦 Создание резервной копии CSS..."
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH/assets/css && cp unified-site-styles.css unified-site-styles.css.backup-conv-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем исправленные стили
echo "🎨 Загружаем ИСПРАВЛЕННЫЕ стили для conversion-paths..."
scp -i $SSH_KEY assets/css/unified-site-styles.css $VPS_HOST:$VPS_PATH/assets/css/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/css/unified-site-styles.css"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/assets/css/unified-site-styles.css"

# Перезапускаем Nginx для очистки кеша
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "✅ CONVERSION PATHS ИСПРАВЛЕНЫ!"
echo ""
echo "🎯 ЧТО ДОБАВЛЕНО:"
echo "   🎨 Белый фон с градиентом вместо прозрачного"
echo "   📦 Серые рамки для видимости карточек"
echo "   🌈 Цветные полоски сверху для каждого типа"
echo "   💫 Тени и hover-эффекты для интерактивности"
echo "   📱 Адаптивная сетка для мобилок"
echo ""
echo "🔥 СТИЛИ КАРТОЧЕК:"
echo "   ⚡ Срочно: оранжево-красная полоска"
echo "   💰 Экономия: зелёная полоска"
echo "   🤝 Консультация: синяя полоска"
echo "   📊 Сравнение: фиолетовая полоска"
echo ""
echo "📱 МОБИЛЬНАЯ АДАПТАЦИЯ:"
echo "   • Колонка в 1 ряд"
echo "   • Увеличенные touch-таргеты"
echo "   • Оптимизированные размеры"
echo ""
echo "🔗 Проверь результат: https://avtogost77.ru"
echo "👀 Теперь conversion-paths ВИДНЫ И КРАСИВЫ!"


