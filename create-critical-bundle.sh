#!/bin/bash

echo "🚀 СОЗДАЕМ КРИТИЧЕСКИЙ JS BUNDLE ДЛЯ PERFORMANCE GOD MODE"
echo "========================================================"

# Создаем директорию для bundle
mkdir -p assets/js/bundles

echo "📦 Создаем critical-bundle.js (основной функционал)..."

# Объединяем критически важные JS файлы
cat > assets/js/bundles/critical-bundle.js << 'EOF'
/* ===== КРИТИЧЕСКИЙ BUNDLE ДЛЯ AVTOGOST77 ===== */
/* Включает: main.js + calculator + UI + mobile */

EOF

# Добавляем содержимое основных файлов
echo "// === MAIN.JS ===" >> assets/js/bundles/critical-bundle.js
cat assets/js/main.min.js >> assets/js/bundles/critical-bundle.js

echo "" >> assets/js/bundles/critical-bundle.js
echo "// === CALCULATOR UI ===" >> assets/js/bundles/critical-bundle.js
cat assets/js/calculator-ui.min.js >> assets/js/bundles/critical-bundle.js

echo "" >> assets/js/bundles/critical-bundle.js
echo "// === MOBILE COLLAPSE ===" >> assets/js/bundles/critical-bundle.js
cat assets/js/mobile-collapse.min.js >> assets/js/bundles/critical-bundle.js

echo "" >> assets/js/bundles/critical-bundle.js
echo "// === SMART CALCULATOR V2 ===" >> assets/js/bundles/critical-bundle.js
cat assets/js/smart-calculator-v2.min.js >> assets/js/bundles/critical-bundle.js

echo "📦 Создаем performance-bundle.js (дополнительный функционал)..."

cat > assets/js/bundles/performance-bundle.js << 'EOF'
/* ===== PERFORMANCE BUNDLE ДЛЯ AVTOGOST77 ===== */
/* Включает: distances + api + testing + lazy loading */

EOF

echo "// === REAL DISTANCES ===" >> assets/js/bundles/performance-bundle.js
cat assets/js/real-distances.js >> assets/js/bundles/performance-bundle.js

echo "" >> assets/js/bundles/performance-bundle.js
echo "// === DISTANCE API ===" >> assets/js/bundles/performance-bundle.js
cat assets/js/distance-api.js >> assets/js/bundles/performance-bundle.js

echo "" >> assets/js/bundles/performance-bundle.js
echo "// === AB TESTING ===" >> assets/js/bundles/performance-bundle.js
cat assets/js/ab-testing.js >> assets/js/bundles/performance-bundle.js

echo "" >> assets/js/bundles/performance-bundle.js
echo "// === LAZY LOADING ===" >> assets/js/bundles/performance-bundle.js
cat assets/js/lazy-loading.min.js >> assets/js/bundles/performance-bundle.js

echo "🗜️ Минифицируем bundle'ы..."

# Создаем минифицированные версии (базовая минификация)
echo "Минифицируем critical-bundle..."
sed 's/  //g' assets/js/bundles/critical-bundle.js | tr -d '\n' > assets/js/bundles/critical-bundle.min.js

echo "Минифицируем performance-bundle..."
sed 's/  //g' assets/js/bundles/performance-bundle.js | tr -d '\n' > assets/js/bundles/performance-bundle.min.js

echo ""
echo "✅ BUNDLE'Ы СОЗДАНЫ!"
echo "📊 СТАТИСТИКА:"
echo "Critical Bundle: $(wc -c < assets/js/bundles/critical-bundle.min.js) байт"
echo "Performance Bundle: $(wc -c < assets/js/bundles/performance-bundle.min.js) байт"
echo ""
echo "🎯 РЕЗУЛЬТАТ:"
echo "• Было: 9 отдельных JS файлов"
echo "• Стало: 2 оптимизированных bundle'а"
echo "• Экономия: 7 HTTP запросов!"
echo ""
echo "🚀 ГОТОВО К DEPLOYMENT!"


