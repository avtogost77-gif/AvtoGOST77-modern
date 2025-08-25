#!/bin/bash

echo "💰 АПГРЕЙД МЕТРИК В КЕЙСАХ!"
echo "=========================="
echo "✨ Заменяем скучные рейтинги на убедительные цифры"

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    exit 1
fi
echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию
echo "📦 Создание резервной копии..."
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp index.html index.html.backup-metrics-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем обновленную страницу
echo "💰 Загружаем АПГРЕЙД с крутыми метриками..."
scp -i $SSH_KEY index.html $VPS_HOST:$VPS_PATH/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/index.html"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/index.html"

# Перезапускаем Nginx для очистки кеша
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "🎉 МЕТРИКИ УСПЕШНО АПГРЕЙДНУТЫ!"
echo ""
echo "💰 ЧТО ИЗМЕНИЛОСЬ:"
echo "   🌟 Кейс #2: E-commerce"
echo "      • Было: 4.7★ рейтинг"
echo "      • Стало: ₽5.6М экономия в год"
echo ""
echo "   🏆 Кейс #3: Маркетплейсы"
echo "      • Было: 4.9★ рейтинг поставщика"
echo "      • Стало: ₽180к бонусы в месяц"
echo ""
echo "🔥 ПОЧЕМУ ЭТО ЛУЧШЕ:"
echo "   💸 Деньги убеждают больше звездочек"
echo "   📊 Конкретные цифры > абстрактные рейтинги"
echo "   🎯 Фокус на финансовую выгоду клиента"
echo ""
echo "🔗 Проверь результат: https://avtogost77.ru"
echo "💪 Теперь кейсы еще убедительнее!"


