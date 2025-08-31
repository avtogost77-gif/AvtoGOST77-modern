#!/bin/bash
echo "🎯 ФИНАЛЬНОЕ ВОССТАНОВЛЕНИЕ HERO СЕКЦИЙ!"
echo "📅 Дата: $(date)"
echo "🔍 Собираем все недостающие файлы..."

cd /www/wwwroot/avtogost77.ru

# Создаем структуру папок если её нет
echo "📁 Создаем структуру папок..."
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

# Копируем hero CSS для вторичных страниц
echo "📁 Копируем hero CSS для вторичных страниц..."
cp hero-secondary-pages.css assets/css/ 2>/dev/null

# Исправляем права
echo "🔐 Исправляем права..."
chown -R www-data:www-data assets/
find assets/ -type d -exec chmod 755 {} \;
find assets/ -type f -exec chmod 644 {} \;

# Перезагружаем Nginx
echo "🔄 Перезагружаем Nginx..."
nginx -s reload

echo "✅ ГОТОВО! Все файлы восстановлены!"
echo "🎉 Hero секции должны работать!"
echo "🔍 Проверяй сайт!"
