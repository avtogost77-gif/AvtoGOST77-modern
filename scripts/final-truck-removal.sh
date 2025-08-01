#!/bin/bash

echo "🚛 ПОЛНОЕ УДАЛЕНИЕ ФУРЫ (TRUCK ANIMATION)"
echo "=========================================="

# 1. Удаляем все файлы связанные с фурой
echo "1. Удаляем файлы фуры..."
rm -f assets/css/truck-animation.css
rm -f assets/js/truck-animation.js
rm -f components/truck-animation.html
rm -f assets/img/truck*.svg
rm -f assets/img/truck*.png

# 2. Удаляем все упоминания в HTML файлах
echo "2. Чистим HTML файлы..."
find . -name "*.html" -type f -exec sed -i '/<link.*truck-animation/d' {} +
find . -name "*.html" -type f -exec sed -i '/<script.*truck-animation/d' {} +
find . -name "*.html" -type f -exec sed -i '/truck-animation-container/,/<\/div>/d' {} +
find . -name "*.html" -type f -exec sed -i '/call-from-road/,/<\/div>/d' {} +
find . -name "*.html" -type f -exec sed -i '/truck-wrapper/,/<\/div>/d' {} +
find . -name "*.html" -type f -exec sed -i '/truck-toggle/d' {} +

# 3. Удаляем из CSS файлов
echo "3. Чистим CSS файлы..."
find assets/css -name "*.css" -type f -exec sed -i '/truck-animation/d' {} +
find assets/css -name "*.css" -type f -exec sed -i '/truck-wrapper/d' {} +
find assets/css -name "*.css" -type f -exec sed -i '/call-from-road/d' {} +
find assets/css -name "*.css" -type f -exec sed -i '/truck-toggle/d' {} +

# 4. Удаляем из JS файлов
echo "4. Чистим JS файлы..."
find assets/js -name "*.js" -type f -exec sed -i '/truck-animation/d' {} +
find assets/js -name "*.js" -type f -exec sed -i '/callFromRoad/d' {} +
find assets/js -name "*.js" -type f -exec sed -i '/Едем к вам/d' {} +

# 5. Добавляем CSS для скрытия любых остатков
echo "5. Добавляем CSS для гарантированного скрытия..."
cat >> assets/css/urgent-fixes.css << 'EOF'

/* ПОЛНОЕ СКРЫТИЕ ФУРЫ */
[class*="truck"],
[id*="truck"],
[class*="call-from-road"],
[id*="callFromRoad"],
.truck-animation-container,
.truck-wrapper,
.truck-toggle,
.moving-truck,
.truck-strip {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    position: absolute !important;
    left: -9999px !important;
    top: -9999px !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
}
EOF

echo "✅ Фура полностью удалена!"
echo ""
echo "Проверка остатков:"
echo "=================="
grep -r "truck\|фура\|Едем к вам" --include="*.html" --include="*.js" --include="*.css" . 2>/dev/null | grep -v "node_modules" | grep -v ".git" | grep -v "scripts/final-truck-removal.sh" || echo "✅ Чисто! Никаких следов фуры не найдено."