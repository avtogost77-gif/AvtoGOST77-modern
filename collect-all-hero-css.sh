#!/bin/bash
echo "🎯 СОБИРАЕМ ВСЕ HERO CSS ФАЙЛЫ!"
echo "📅 Бэкап: 20250830-025314"
echo "🔍 Копируем все CSS, JS и изображения..."

cd /www/wwwroot/avtogost77.ru

# Создаем структуру папок если её нет
mkdir -p assets/css
mkdir -p assets/js
mkdir -p assets/img

# Копируем ВСЕ CSS файлы из бэкапа
echo "📁 Копируем CSS файлы..."
cp -r backups/20250830-025314/assets/css/* assets/css/ 2>/dev/null

# Копируем ВСЕ JS файлы из бэкапа
echo "📁 Копируем JS файлы..."
cp -r backups/20250830-025314/assets/js/* assets/js/ 2>/dev/null

# Копируем ВСЕ изображения из бэкапа
echo "📁 Копируем изображения..."
cp -r backups/20250830-025314/assets/img/* assets/img/ 2>/dev/null

# Копируем системные файлы
echo "📁 Копируем системные файлы..."
cp backups/20250830-025314/favicon.svg . 2>/dev/null
cp backups/20250830-025314/sw.js . 2>/dev/null

# Исправляем права
echo "🔐 Исправляем права..."
chown -R www-data:www-data assets/
find assets/ -type d -exec chmod 755 {} \;
find assets/ -type f -exec chmod 644 {} \;

# Проверяем что скопировалось
echo "✅ Проверяем результат:"
echo "📁 CSS файлы:"
ls -la assets/css/ | head -10
echo "📁 JS файлы:"
ls -la assets/js/ | head -10
echo "📁 Изображения:"
ls -la assets/img/ | grep hero | head -10

echo "🎉 ГОТОВО! Все hero CSS файлы собраны!"
echo "🔄 Перезагружаем Nginx..."
nginx -s reload
echo "✅ Сайт обновлен!"
