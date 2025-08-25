#!/bin/bash

echo "🎨 ФИНАЛЬНЫЙ ДЕПЛОЙ ВИЗУАЛЬНОЙ ВЕРСИИ!"
echo "======================================"
echo "✨ Загружаем страницу с крутыми кейсами и реквизитами в футере"

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
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp index.html index.html.backup-visual-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем обновленные файлы
echo "🎨 Загружаем ВИЗУАЛЬНУЮ ВЕРСИЮ с новыми кейсами..."
scp -i $SSH_KEY index.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY assets/css/unified-site-styles.css $VPS_HOST:$VPS_PATH/assets/css/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/index.html $VPS_PATH/assets/css/unified-site-styles.css"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/index.html $VPS_PATH/assets/css/unified-site-styles.css"

# Перезапускаем Nginx для очистки кеша
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "🎉 ВИЗУАЛЬНАЯ ВЕРСИЯ УСПЕШНО РАЗВЕРНУТА!"
echo ""
echo "🎯 ЧТО ОБНОВЛЕНО:"
echo "   🎨 Кейсы переделаны в красивые карточки с:"
echo "      • Градientными заголовками"
echo "      • Метриками и цифрами"
echo "      • Timeline с иконками"
echo "      • Результатами с подсветкой"
echo ""
echo "   📋 Реквизиты перенесены в футер:"
echo "      • Простым текстом без спойлера"
echo "      • Компактно и удобно"
echo "      • Все данные на виду"
echo ""
echo "📏 ФИНАЛЬНЫЙ РАЗМЕР: 1800 строк (компактно!)"
echo "🚀 РЕЗУЛЬТАТ: Современная, визуальная, конверсионная страница!"
echo ""
echo "🔗 Проверь результат: https://avtogost77.ru"
echo "📱 Обязательно протестируй на мобильном!"


