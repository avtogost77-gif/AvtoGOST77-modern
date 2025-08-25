#!/bin/bash

echo "📊 КРУТАЯ ДИАГРАММА ПРОЦЕССА!"
echo "============================="
echo "🎨 Заменяем скучный текст на визуальную диаграмму!"

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
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp index.html index.html.backup-diagram-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH/assets/css && cp unified-site-styles.css unified-site-styles.css.backup-diagram-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем обновленные файлы
echo "📊 Загружаем ДИАГРАММУ процесса..."
scp -i $SSH_KEY index.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY assets/css/unified-site-styles.css $VPS_HOST:$VPS_PATH/assets/css/

# Устанавливаем права доступа
echo "🔒 Устанавливаем права доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/index.html"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/index.html"
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/css/unified-site-styles.css"
ssh -i $SSH_KEY $VPS_HOST "chown www-data:www-data $VPS_PATH/assets/css/unified-site-styles.css"

# Перезапускаем Nginx для очистки кеша
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

echo ""
echo "🎉 ДИАГРАММА ПРОЦЕССА ГОТОВА!"
echo ""
echo "📊 ЧТО ИЗМЕНИЛОСЬ:"
echo "   🗑️ УДАЛИЛИ: Скучный текстовый список шагов"
echo "   ✨ ДОБАВИЛИ: Крутую визуальную диаграмму"
echo ""
echo "🎯 СТРУКТУРА ДИАГРАММЫ:"
echo "   🧮 Этап 1: Расчет онлайн (30 сек)"
echo "      • 📍 Маршрут"
echo "      • ⚖️ Вес/габариты"
echo "      • 💰 Цена без скрытых платежей"
echo ""
echo "   📋 Этап 2: Оформление (2 мин)"
echo "      • 📞 Онлайн/звонок"
echo "      • ⏰ Время подачи"
echo "      • 📝 Особые требования"
echo ""
echo "   🚛 Этап 3: Подача авто (от 2 часов)"
echo "      • ⚡ Точно в срок"
echo "      • 📦 Помощь с погрузкой"
echo "      • 🔒 Надежное крепление"
echo ""
echo "   ✅ Этап 4: Доставка (точно в срок)"
echo "      • 📞 Связь с получателем"
echo "      • 📋 Разгрузка/документы"
echo "      • 📄 Транспортная накладная"
echo ""
echo "🎨 ДИЗАЙН ФИШКИ:"
echo "   • 🎯 Интерактивные карточки с hover-эффектами"
echo "   • ➡️ Стрелки между этапами"
echo "   • 🌈 Цветные акценты (синий/зеленый)"
echo "   • ⏱️ Время выполнения каждого этапа"
echo "   • 📱 Адаптивный дизайн для мобилок"
echo ""
echo "📱 МОБИЛЬНАЯ ВЕРСИЯ:"
echo "   • Вертикальное расположение"
echo "   • Повернутые стрелки (90°)"
echo "   • Увеличенные touch-таргеты"
echo ""
echo "🔗 Проверь результат: https://avtogost77.ru"
echo "🎯 Теперь процесс работы НАГЛЯДНЫЙ И ПОНЯТНЫЙ!"


