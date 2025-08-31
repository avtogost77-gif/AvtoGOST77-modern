#!/bin/bash

# Скрипт для обновления версии CSS файла на всех страницах
echo "🔄 Обновляю версию CSS файла на всех страницах..."

# Обновляем версию critical-fixes.css на всех HTML страницах
find . -maxdepth 1 -name "*.html" -exec sed -i 's/critical-fixes\.css?v=[^"]*/critical-fixes.css?v=20250826-mobile-fix/g' {} \;

echo "✅ Версия CSS файла обновлена на всех страницах!"
