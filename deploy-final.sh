#!/bin/bash

# ФИНАЛЬНЫЙ СКРИПТ ДЕПЛОЯ - ПОДГОТОВКА К СДАЧЕ
# Дата: 2025-08-13

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo "🚀 ФИНАЛЬНЫЙ ДЕПЛОЙ - ПОДГОТОВКА К СДАЧЕ"
echo "=========================================="

# Проверяем, что мы в правильной директории
if [ ! -f "index.html" ]; then
    echo "❌ Ошибка: index.html не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# Проверяем наличие SSH ключа
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    exit 1
fi

echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию на VPS
echo "📦 Создание резервной копии на VPS..."
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && cp -r assets assets.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем CSS файлы
echo "📤 Загрузка CSS файлов..."
scp -i $SSH_KEY assets/css/unified-styles.css $VPS_HOST:$VPS_PATH/assets/css/
scp -i $SSH_KEY assets/css/mobile.css $VPS_HOST:$VPS_PATH/assets/css/
scp -i $SSH_KEY assets/css/calculator-modern.css $VPS_HOST:$VPS_PATH/assets/css/

# Загружаем JavaScript файлы
echo "📤 Загрузка JavaScript файлов..."
scp -i $SSH_KEY assets/js/smart-calculator-v2.js $VPS_HOST:$VPS_PATH/assets/js/
scp -i $SSH_KEY assets/js/distance-api.js $VPS_HOST:$VPS_PATH/assets/js/
scp -i $SSH_KEY assets/js/real-distances.js $VPS_HOST:$VPS_PATH/assets/js/
scp -i $SSH_KEY assets/js/mobile-collapse.js $VPS_HOST:$VPS_PATH/assets/js/
scp -i $SSH_KEY assets/js/calculator-ui.js $VPS_HOST:$VPS_PATH/assets/js/

# Загружаем основные HTML страницы
echo "📤 Загрузка основных HTML страниц..."
scp -i $SSH_KEY index.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY services.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY sbornye-gruzy.html $VPS_HOST:$VPS_PATH/

# Загружаем региональные страницы
echo "📤 Загрузка региональных страниц..."
scp -i $SSH_KEY gruzoperevozki-spb.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY gruzoperevozki-iz-moskvy.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY gruzoperevozki-ekaterinburg.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY gruzoperevozki-po-moskve.html $VPS_HOST:$VPS_PATH/

# Загружаем страницы типов транспорта
echo "📤 Загрузка страниц типов транспорта..."
scp -i $SSH_KEY gazel-gruzoperevozki.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY fura-20-tonn-gruzoperevozki.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY pyatitonnik-gruzoperevozki.html $VPS_HOST:$VPS_PATH/

# Загружаем специальные страницы
echo "📤 Загрузка специальных страниц..."
scp -i $SSH_KEY self-employed-delivery.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY rc-dostavka.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY urgent-delivery.html $VPS_HOST:$VPS_PATH/

# Загружаем маршрутные страницы
echo "📤 Загрузка маршрутных страниц..."
scp -i $SSH_KEY gruzoperevozki-moskva-voronezh.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY gruzoperevozki-moskva-tambov.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY gruzoperevozki-moskva-orel.html $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY gruzoperevozki-moskva-spb.html $VPS_HOST:$VPS_PATH/

# Перезапускаем nginx
echo "🔄 Перезапуск nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl restart nginx"

# Проверяем статус
echo "✅ Проверка статуса..."
ssh -i $SSH_KEY $VPS_HOST "systemctl status nginx --no-pager | head -5"

echo ""
echo "🎉 ФИНАЛЬНЫЙ ДЕПЛОЙ ЗАВЕРШЕН!"
echo "=========================================="
echo "🌐 Сайт: https://avtogost77.ru"
echo "📱 Все страницы обновлены с новым дизайном калькулятора"
echo "🎨 Единый стиль на всех страницах"
echo "✨ Современный интерфейс вместо 'Excel 98'"
echo ""
echo "📋 ГОТОВО К СДАЧЕ!"
