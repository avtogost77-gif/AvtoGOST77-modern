#!/bin/bash

echo "🔧 СРОЧНЫЙ ФИКС КАЛЬКУЛЯТОРА!"
echo "============================="
echo "🚫 Убираем линию которая перечеркивает текст в прогресс-баре!"

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
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH/assets/css && cp unified-site-styles.css unified-site-styles.css.backup-calc-fix-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем исправленные стили
echo "🔧 Загружаем ИСПРАВЛЕННЫЕ стили калькулятора..."
scp -i $SSH_KEY assets/css/unified-site-styles.css $VPS_HOST:$VPS_PATH/assets/css/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/css/unified-site-styles.css"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/assets/css/unified-site-styles.css"

# Перезапускаем Nginx для очистки кеша
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "✅ КАЛЬКУЛЯТОР ИСПРАВЛЕН!"
echo ""
echo "🔧 ЧТО ИСПРАВЛЕНО:"
echo "   ❌ БЫЛО: Линия прогресс-бара перечеркивала текст"
echo "   ✅ СТАЛО: Линия проходит через центр кружочков"
echo ""
echo "🎯 СТРУКТУРА ПРОГРЕСС-БАРА:"
echo "   📊 Линия позиционирована в центре кружочков (top: 24px)"
echo "   🎨 Кружочки поднимаются выше с z-index: 3"
echo "   📝 Подписи ('Данные', 'Результат') размещены ниже"
echo "   🌈 Цветовая схема: серый → синий → зеленый"
echo ""
echo "💡 КАК РАБОТАЕТ:"
echo "   1️⃣ Шаг 'Данные': синий кружочек + синий текст"
echo "   2️⃣ Шаг 'Результат': зеленый кружочек + зеленый текст"
echo "   ➡️ Линия между ними НЕ МЕШАЕТ тексту"
echo ""
echo "📱 МОБИЛЬНАЯ АДАПТАЦИЯ:"
echo "   • Меньшие кружочки (40px вместо 48px)"
echo "   • Уменьшенные отступы"
echo "   • Читаемые размеры текста"
echo ""
echo "🔗 Проверь результат: https://avtogost77.ru"
echo "🎯 Теперь прогресс-бар калькулятора ЧИТАЕМЫЙ!"


