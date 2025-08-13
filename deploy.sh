#!/bin/bash

# Скрипт быстрого деплоя на VPS
# Автоматическая загрузка файлов и перезапуск nginx

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"

echo "🚀 Быстрый деплой на VPS..."

# Проверяем, что мы в правильной директории
if [ ! -f "index.html" ]; then
    echo "❌ Ошибка: index.html не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# Создаем резервную копию на VPS
echo "📦 Создание резервной копии на VPS..."
ssh $VPS_HOST "cd $VPS_PATH && cp -r assets/js assets/js.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"

# Загружаем файлы
echo "📤 Загрузка файлов..."
rsync -avz --progress assets/js/smart-calculator-v2.js $VPS_HOST:$VPS_PATH/assets/js/
rsync -avz --progress assets/js/distance-api.js $VPS_HOST:$VPS_PATH/assets/js/
rsync -avz --progress assets/js/real-distances.js $VPS_HOST:$VPS_PATH/assets/js/
rsync -avz --progress assets/js/mobile-collapse.js $VPS_HOST:$VPS_PATH/assets/js/
rsync -avz --progress assets/css/unified-styles.css $VPS_HOST:$VPS_PATH/assets/css/
rsync -avz --progress assets/css/mobile.css $VPS_HOST:$VPS_PATH/assets/css/
rsync -avz --progress index.html $VPS_HOST:$VPS_PATH/
rsync -avz --progress gruzoperevozki-spb.html $VPS_HOST:$VPS_PATH/
rsync -avz --progress gruzoperevozki-iz-moskvy.html $VPS_HOST:$VPS_PATH/
rsync -avz --progress services.html $VPS_HOST:$VPS_PATH/
rsync -avz --progress sbornye-gruzy.html $VPS_HOST:$VPS_PATH/

# Перезапускаем nginx
echo "🔄 Перезапуск nginx..."
ssh $VPS_HOST "systemctl restart nginx"

# Проверяем статус
echo "✅ Проверка статуса..."
ssh $VPS_HOST "systemctl status nginx --no-pager | head -5"

echo "🎉 Деплой завершен!"
echo "🌐 Сайт: https://avtogost77.ru"
echo "📱 Проверьте калькулятор на главной странице"
echo ""
echo "⚠️  Примечание: SSH ключ требует ввода пароля"
echo "   Используйте deploy-ssh-key.sh для деплоя с явным указанием ключа"
