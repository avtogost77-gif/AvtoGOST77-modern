#!/bin/bash

echo "🔥 УДАЛЯЕМ ФУРУ ПОЛНОСТЬЮ НАХРЕН!"

# Удаляем подключение CSS фуры
sed -i '/<link rel="stylesheet" href="assets\/css\/truck-animation.css">/d' index.html
sed -i '/<link rel="stylesheet" href="assets\/css\/truck-animation.css">/d' urgent-delivery-moscow.html

# Удаляем подключение JS фуры  
sed -i '/<script src="assets\/js\/truck-animation.js"/d' index.html
sed -i '/<script src="assets\/js\/truck-animation.js"/d' urgent-delivery-moscow.html

# Удаляем скрипт toggleTruck из index.html
sed -i '/function toggleTruck()/,/^<\/script>/d' index.html

# Удаляем остатки JavaScript кода фуры
sed -i '/truck-wrapper.*addEventListener/,/});/d' index.html
sed -i '/const messages = \[/,/}, 20000);/d' index.html

# Чистим пустые теги script
sed -i '/<script>$/,/^<\/script>$/d' index.html

echo "✅ Готово! Фура удалена из:"
echo "   - index.html"  
echo "   - urgent-delivery-moscow.html"
echo ""
echo "🗑️ Можно также удалить файлы:"
echo "   - assets/css/truck-animation.css"
echo "   - assets/js/truck-animation.js"
echo "   - components/truck-animation.html"
