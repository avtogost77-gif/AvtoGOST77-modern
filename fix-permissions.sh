#!/bin/bash

# ========================================================
# 🔧 СКРИПТ ИСПРАВЛЕНИЯ ПРАВ ДОСТУПА АВТОГОСТ77
# Исправляет права доступа для веб-сервера Nginx
# ========================================================

echo "🔧 Исправляем права доступа для сайта avtogost77.ru..."

# Устанавливаем правильные права для файлов и директорий
find /www/wwwroot/avtogost77.ru -type f -exec chmod 644 {} \;
find /www/wwwroot/avtogost77.ru -type d -exec chmod 755 {} \;

# Устанавливаем правильного владельца
chown -R www-data:www-data /www/wwwroot/avtogost77.ru

echo "✅ Права доступа исправлены!"
echo ""
echo "📊 Проверка основных файлов:"

# Проверяем права на основные файлы
echo "Главная страница:"
ls -la /www/wwwroot/avtogost77.ru/index.html

echo ""
echo "JavaScript калькулятора:"
ls -la /www/wwwroot/avtogost77.ru/assets/js/smart-calculator-v2.js

echo ""
echo "CSS стили:"
ls -la /www/wwwroot/avtogost77.ru/assets/css/unified-site-styles.css

echo ""
echo "🎯 Все готово! Сайт должен работать корректно."

