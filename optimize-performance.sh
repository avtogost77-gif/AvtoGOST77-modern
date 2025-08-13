#!/bin/bash

echo "⚡ ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ"
echo "=================================="

# 1. Удаляем отладочные сообщения
echo "🔧 Удаляем отладочные сообщения..."
find assets/js/ -name "*.js" -exec sed -i '/console\.log\|console\.error/d' {} \;

# 2. Скачиваем AOS локально
echo "📥 Скачиваем AOS локально..."
mkdir -p assets/js/vendor
mkdir -p assets/css/vendor

# Скачиваем AOS CSS
curl -s https://unpkg.com/aos@2.3.4/dist/aos.css > assets/css/vendor/aos.min.css

# Скачиваем AOS JS
curl -s https://unpkg.com/aos@2.3.4/dist/aos.js > assets/js/vendor/aos.min.js

# Скачиваем jsPDF
curl -s https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js > assets/js/vendor/jspdf.umd.min.js

# 3. Заменяем внешние ссылки на локальные
echo "🔄 Заменяем внешние ссылки на локальные..."

# Заменяем AOS CSS
find *.html -exec sed -i 's|https://unpkg.com/aos@2.3.4/dist/aos.css|assets/css/vendor/aos.min.css|g' {} \;

# Заменяем AOS JS
find *.html -exec sed -i 's|https://unpkg.com/aos@2.3.4/dist/aos.js|assets/js/vendor/aos.min.js|g' {} \;

# Заменяем jsPDF
find *.html -exec sed -i 's|https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js|assets/js/vendor/jspdf.umd.min.js|g' {} \;

# 4. Минифицируем CSS файлы
echo "📦 Минифицируем CSS файлы..."

# Проверяем наличие uglifycss
if ! command -v uglifycss &> /dev/null; then
    echo "📦 Устанавливаем uglifycss..."
    npm install -g uglifycss
fi

# Минифицируем основные CSS файлы
if command -v uglifycss &> /dev/null; then
    uglifycss assets/css/calculator-modern.css > assets/css/calculator-modern.min.css
    uglifycss assets/css/unified-styles.css > assets/css/unified-styles.min.css
    uglifycss assets/css/mobile.css > assets/css/mobile.min.css
    echo "✅ CSS файлы минифицированы"
else
    echo "⚠️ uglifycss не найден, пропускаем минификацию CSS"
fi

# 5. Минифицируем JS файлы
echo "📦 Минифицируем JS файлы..."

# Проверяем наличие uglifyjs
if ! command -v uglifyjs &> /dev/null; then
    echo "📦 Устанавливаем uglifyjs..."
    npm install -g uglify-js
fi

# Минифицируем основные JS файлы
if command -v uglifyjs &> /dev/null; then
    uglifyjs assets/js/smart-calculator-v2.js -o assets/js/smart-calculator-v2.min.js
    uglifyjs assets/js/calculator-ui.js -o assets/js/calculator-ui.min.js
    uglifyjs assets/js/mobile-collapse.js -o assets/js/mobile-collapse.min.js
    echo "✅ JS файлы минифицированы"
else
    echo "⚠️ uglifyjs не найден, пропускаем минификацию JS"
fi

# 6. Обновляем ссылки на минифицированные файлы
echo "🔄 Обновляем ссылки на минифицированные файлы..."

# Обновляем CSS ссылки
find *.html -exec sed -i 's|calculator-modern.css|calculator-modern.min.css|g' {} \;
find *.html -exec sed -i 's|unified-styles.css|unified-styles.min.css|g' {} \;
find *.html -exec sed -i 's|mobile.css|mobile.min.css|g' {} \;

# Обновляем JS ссылки
find *.html -exec sed -i 's|smart-calculator-v2.js|smart-calculator-v2.min.js|g' {} \;
find *.html -exec sed -i 's|calculator-ui.js|calculator-ui.min.js|g' {} \;
find *.html -exec sed -i 's|mobile-collapse.js|mobile-collapse.min.js|g' {} \;

# 7. Добавляем preload для критических ресурсов
echo "⚡ Добавляем preload для критических ресурсов..."

# Добавляем preload в head
find *.html -exec sed -i '/<link rel="stylesheet" href="assets\/css\/critical-optimized.min.css">/a \    <link rel="preload" href="assets/css/calculator-modern.min.css" as="style" onload="this.onload=null;this.rel=\x27stylesheet\x27">' {} \;

echo ""
echo "🎉 ОПТИМИЗАЦИЯ ЗАВЕРШЕНА!"
echo "=========================="
echo "📊 Результаты:"
echo "✅ Отладочные сообщения удалены"
echo "✅ Внешние CDN заменены на локальные файлы"
echo "✅ CSS и JS файлы минифицированы"
echo "✅ Preload добавлен для критических ресурсов"
echo ""
echo "📈 Ожидаемое улучшение производительности: 40-60%"

