#!/bin/bash

echo "🔒 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ ПРАВ ДОСТУПА"
echo "======================================"

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo "🔧 Исправляем права доступа на все папки и файлы..."

# Устанавливаем правильные права для директорий (755)
ssh -i $SSH_KEY $VPS_HOST "find $VPS_PATH -type d -exec chmod 755 {} \;"

# Устанавливаем правильные права для файлов (644)
ssh -i $SSH_KEY $VPS_HOST "find $VPS_PATH -type f -exec chmod 644 {} \;"

echo "🔧 Проверяем и исправляем конкретные проблемные папки..."

# Конкретно для проблемных папок
ssh -i $SSH_KEY $VPS_HOST "chmod 755 $VPS_PATH/assets/css/master"
ssh -i $SSH_KEY $VPS_HOST "chmod 755 $VPS_PATH/assets/css/vendor"
ssh -i $SSH_KEY $VPS_HOST "chmod 755 $VPS_PATH/assets/js/vendor"
ssh -i $SSH_KEY $VPS_HOST "chmod 755 $VPS_PATH/assets/js/dist"
ssh -i $SSH_KEY $VPS_HOST "chmod 755 $VPS_PATH/assets/img/clients"

echo "🔧 Устанавливаем правильного владельца..."
ssh -i $SSH_KEY $VPS_HOST "chown -R www-data:www-data $VPS_PATH/assets"

echo "🔧 Перепроверяем критичные файлы..."
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/css/master/master-styles.min.css"
ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/assets/css/vendor/aos.min.css"

echo "📋 Проверяем результат..."
echo "=== CSS MASTER ==="
ssh -i $SSH_KEY $VPS_HOST "ls -la $VPS_PATH/assets/css/master/"

echo "=== CSS VENDOR ==="  
ssh -i $SSH_KEY $VPS_HOST "ls -la $VPS_PATH/assets/css/vendor/"

echo "=== JS VENDOR ==="
ssh -i $SSH_KEY $VPS_HOST "ls -la $VPS_PATH/assets/js/vendor/"

echo "=== IMG CLIENTS ==="
ssh -i $SSH_KEY $VPS_HOST "ls -la $VPS_PATH/assets/img/clients/"

echo "🔄 Перезапускаем nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl restart nginx"

echo "🧪 Тестируем доступность файлов напрямую..."
echo "Тестируем: curl -I https://avtogost77.ru/assets/css/master/master-styles.min.css"
curl -I https://avtogost77.ru/assets/css/master/master-styles.min.css 2>/dev/null | head -1

echo ""
echo "✅ ПРАВА ДОСТУПА ИСПРАВЛЕНЫ!"
echo "============================"
echo "🔒 Все папки: 755 (rwxr-xr-x)"
echo "🔒 Все файлы: 644 (rw-r--r--)"
echo "👤 Владелец: www-data:www-data"
echo "🔄 Nginx: перезапущен"
echo ""
echo "🌐 Проверяйте сайт: https://avtogost77.ru"


