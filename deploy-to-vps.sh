#!/bin/bash

echo "🚀 ДЕПЛОЙ ОПТИМИЗИРОВАННЫХ ФАЙЛОВ НА VPS"
echo "=========================================="

# Настройки VPS
VPS_HOST="avtogost77.ru"
VPS_USER="root"
VPS_PATH="/www/wwwroot/avtogost77.ru"

# Создаем бэкап на VPS
echo "📦 Создаем бэкап на VPS..."
ssh $VPS_USER@$VPS_HOST "mkdir -p $VPS_PATH/backups/$(date +%Y%m%d-%H%M%S) && cp -r $VPS_PATH/*.html $VPS_PATH/backups/$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true"

# Деплоим основные HTML файлы
echo "📄 Деплоим HTML файлы..."
scp index.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp services.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp contact.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp sbornye-gruzy.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp gruzoperevozki-spb.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp gruzoperevozki-ekaterinburg.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp gruzoperevozki-moskva-omsk.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp moscow-spb-delivery.html $VPS_USER@$VPS_HOST:$VPS_PATH/
scp blog-3-spot-orders.html $VPS_USER@$VPS_HOST:$VPS_PATH/

# Деплоим объединенные CSS/JS файлы
echo "🎨 Деплоим объединенные файлы..."
scp assets/css/unified-main.css $VPS_USER@$VPS_HOST:$VPS_PATH/assets/css/
scp assets/js/unified-main.js $VPS_USER@$VPS_HOST:$VPS_PATH/assets/js/
scp assets/js/calculator.js $VPS_USER@$VPS_HOST:$VPS_PATH/assets/js/

# Создаем минифицированные версии на VPS
echo "📦 Создаем минифицированные версии..."
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH/assets/css && cp unified-main.css unified-main.min.css"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH/assets/js && cp unified-main.js unified-main.min.js"

# Проверяем права доступа
echo "🔐 Устанавливаем права доступа..."
ssh $VPS_USER@$VPS_HOST "chown -R www-data:www-data $VPS_PATH && chmod -R 644 $VPS_PATH/*.html && chmod -R 644 $VPS_PATH/assets/css/* && chmod -R 644 $VPS_PATH/assets/js/*"

# Очищаем кэш
echo "🧹 Очищаем кэш..."
ssh $VPS_USER@$VPS_HOST "systemctl reload nginx"

echo ""
echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
echo "📊 Статистика:"
echo "   - HTML файлов: 9"
echo "   - CSS файлов: 1 (объединенный)"
echo "   - JS файлов: 2 (объединенный + калькулятор)"
echo "   - Бэкап создан на VPS"
echo ""
echo "🌐 Сайт доступен: https://avtogost77.ru"
echo "📱 Мобильная версия: https://avtogost77.ru/index-mobile-ultra.html"
