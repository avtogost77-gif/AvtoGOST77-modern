#!/bin/bash

echo "🔧 СОБИРАЕМ НЕДОСТАЮЩИЕ ФАЙЛЫ!"
cd /www/wwwroot/avtogost77.ru

echo "📁 Создаем структуру папок..."
mkdir -p assets/css/vendor
mkdir -p assets/js/bundles
mkdir -p assets/js/vendor
mkdir -p assets/img

echo "📦 Копируем CSS файлы..."
cp backups/20250830-025314/assets/css/master-styles.min.css assets/css/ 2>/dev/null
cp backups/20250830-025314/assets/css/mobile-optimized.css assets/css/ 2>/dev/null
cp backups/20250830-025314/assets/css/critical-fixes.css assets/css/ 2>/dev/null
cp backups/20250830-025314/assets/css/unified-site-styles.css assets/css/ 2>/dev/null
cp backups/20250830-025314/assets/css/vendor/aos.min.css assets/css/vendor/ 2>/dev/null

echo "📦 Копируем JS файлы..."
cp backups/20250830-025314/assets/js/bundles/critical-bundle.min.js assets/js/bundles/ 2>/dev/null
cp backups/20250830-025314/assets/js/bundles/performance-bundle.min.js assets/js/bundles/ 2>/dev/null
cp backups/20250830-025314/assets/js/aos.min.js assets/js/ 2>/dev/null
cp backups/20250830-025314/assets/js/animated-counter.js assets/js/ 2>/dev/null
cp backups/20250830-025314/assets/js/interactive-infographic.js assets/js/ 2>/dev/null
cp backups/20250830-025314/assets/js/vendor/aos.min.js assets/js/vendor/ 2>/dev/null

echo "📦 Копируем изображения..."
cp backups/20250830-025314/assets/img/ozon-logo.svg assets/img/ 2>/dev/null
cp backups/20250830-025314/assets/img/lamoda-logo.svg assets/img/ 2>/dev/null
cp backups/20250830-025314/assets/img/logo-192.svg assets/img/ 2>/dev/null
cp backups/20250830-025314/assets/favicon.svg . 2>/dev/null

echo "📦 Копируем системные файлы..."
cp backups/20250830-025314/assets/sw.js . 2>/dev/null

echo "🔐 Исправляем права..."
chown -R www-data:www-data assets/
find assets/ -type d -exec chmod 755 {} \;
find assets/ -type f -exec chmod 644 {} \;

echo "✅ Сборка завершена!"
echo "🌐 Проверяем структуру:"
ls -la assets/
echo "📁 CSS:"
ls -la assets/css/
echo "📁 JS:"
ls -la assets/js/
echo "📁 IMG:"
ls -la assets/img/
