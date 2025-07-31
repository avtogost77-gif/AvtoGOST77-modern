#!/bin/bash

echo "🔥🔥🔥 УБИВАЕМ ЭТУ ГРЕБАНУЮ ФУРУ РАЗ И НАВСЕГДА! 🔥🔥🔥"

# Команды для выполнения на VPS
cat << 'EOF'
cd /var/www/avtogost77/

# 1. Сохраняем локальные изменения
echo "📦 Сохраняем локальные изменения..."
git stash

# 2. Обновляемся с репозитория  
echo "🔄 Обновляем с GitHub..."
git pull origin main --force

# 3. Удаляем ВСЕ упоминания фуры из index.html
echo "🗑️ Удаляем фуру из index.html..."
sed -i '/truck-animation/d' index.html
sed -i '/truck-wrapper/d' index.html
sed -i '/truck-message/d' index.html
sed -i '/truck-toggle/d' index.html
sed -i '/toggleTruck/d' index.html
sed -i '/🚚/d' index.html

# 4. Удаляем из urgent-delivery-moscow.html
echo "🗑️ Удаляем фуру из urgent-delivery-moscow.html..."
sed -i '/truck-animation/d' urgent-delivery-moscow.html

# 5. Удаляем CSS и JS файлы фуры
echo "🗑️ Удаляем файлы фуры..."
rm -f assets/css/truck-animation.css
rm -f assets/js/truck-animation.js
rm -f components/truck-animation.html

# 6. Очищаем кеш nginx
echo "🔄 Перезагружаем nginx..."
nginx -s reload

echo "✅ ФУРА УНИЧТОЖЕНА!"
echo ""
echo "🎉 Проверьте сайт - фуры больше НЕТ!"
EOF

echo ""
echo "👆 Скопируйте команды выше и выполните на VPS через SSH"
echo "Или сохраните в файл и запустите: bash kill-truck.sh"