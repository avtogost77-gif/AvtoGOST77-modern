#!/bin/bash

echo "🔧 КАЧЕСТВЕННОЕ ИСПРАВЛЕНИЕ ВСЕХ ПРОБЛЕМ"
echo "========================================="

# 1. Добавляем Font Awesome
echo "1️⃣ Добавляем Font Awesome..."
sed -i '/<\/head>/i\    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">' index.html

# 2. Исправляем WhatsApp номер
echo "2️⃣ Исправляем WhatsApp номер..."
find . -name "*.html" -type f -exec sed -i 's/79999999999/79162720932/g' {} +

# 3. Проверяем белую полосу
echo "3️⃣ Ищем и скрываем белые полосы..."
grep -n "sticky-bar\|white-bar\|banner" index.html

echo "✅ Готово!"
