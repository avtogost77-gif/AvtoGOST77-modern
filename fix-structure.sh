#!/bin/bash

echo "🔧 ИСПРАВЛЯЕМ СТРУКТУРУ ФАЙЛОВ!"
cd /www/wwwroot/avtogost77.ru

echo "📁 Создаем папку assets..."
mkdir -p assets

echo "📦 Перемещаем файлы в assets..."
mv css assets/ 2>/dev/null
mv img assets/ 2>/dev/null  
mv js assets/ 2>/dev/null
mv redesign-fixes.css assets/ 2>/dev/null
mv ux-improvements.js assets/ 2>/dev/null

echo "✅ Структура исправлена!"
echo "🌐 Проверяем:"
ls -la
echo "📁 Содержимое assets:"
ls -la assets/
