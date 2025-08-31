#!/bin/bash

echo "🔧 Исправляю все HTML страницы..."

# 1. Убираем preload ссылки на bundle файлы
echo "📦 Убираю preload ссылки на bundle файлы..."
find . -maxdepth 1 -name "*.html" -exec sed -i '/preload.*bundle/d' {} \;

# 2. Обновляем версию critical-fixes.css
echo "🎨 Обновляю версию critical-fixes.css..."
find . -maxdepth 1 -name "*.html" -exec sed -i 's/critical-fixes\.css?v=[^"]*/critical-fixes.css?v=20250826-mobile-hero-fix/g' {} \;

# 3. Перемещаем critical-fixes.css в конец (перед </head>)
echo "📝 Перемещаю critical-fixes.css в конец..."
find . -maxdepth 1 -name "*.html" -exec sed -i '/critical-fixes\.css/d' {} \;
find . -maxdepth 1 -name "*.html" -exec sed -i 's|</head>|    <!-- КРИТИЧНЫЕ СТИЛИ ДЛЯ ОТОБРАЖЕНИЯ - ОБХОД КЭША (ПОСЛЕДНИЕ) -->\n    <link rel="stylesheet" href="assets/css/critical-fixes.css?v=20250826-mobile-hero-fix">\n</head>|' {} \;

echo "✅ Все страницы исправлены!"

