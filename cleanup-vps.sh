#!/bin/bash

echo "🧹 ОЧИСТКА ЛИШНИХ ФАЙЛОВ НА VPS"
echo "================================"

VPS_HOST="avtogost77.ru"
VPS_USER="root"
VPS_PATH="/www/wwwroot/avtogost77.ru"

echo "📦 Создаем бэкап перед очисткой..."
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && mkdir -p backups/$(date +%Y%m%d-%H%M%S) && cp -r assets/ backups/$(date +%Y%m%d-%H%M%S)/"

echo "🗑️ Удаляем старые CSS файлы..."
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH/assets/css && rm -f block-alignment-fixes.css calculator-modern.css calculator-modern.min.css compact-optimization.css critical.css critical-fixes.css critical-inline.css critical-inline.min.css critical-optimized.css critical-optimized.min.css enhanced-content.css hero-fix-2.css hero-fix.css interactive-infographic.css main.css mobile.css mobile-fixes.css mobile-optimized.css redesign-fixes.css styles.css styles-optimized.css styles-optimized.min.css unified-optimized.min.css unified-site-styles.css unified-styles.css unified-styles.min.css urgent-fixes.css"

echo "🗑️ Удаляем старые JS файлы..."
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH/assets/js && rm -f ab-test-headers.js ab-testing.js animated-counter.js benefit.js calc.js calculator-ui.js calculator-ui.min.js calc-v2-enhanced.js"

echo "✅ Оставляем только нужные файлы:"
echo "   - unified-main.css (объединенный CSS)"
echo "   - unified-main.js (объединенный JS)"
echo "   - calculator.js (калькулятор отдельно)"
echo "   - smart-calculator-v2.min.js (логика расчетов)"
echo "   - distance-api.js (расчет расстояний)"

echo "📊 Проверяем результат..."
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && echo '=== CSS ФАЙЛЫ ===' && ls -la assets/css/ | grep -E '\.(css|min\.css)$' && echo '=== JS ФАЙЛЫ ===' && ls -la assets/js/ | grep -E '\.(js|min\.js)$' | head -10"

echo "✅ ОЧИСТКА ЗАВЕРШЕНА!"
echo "🌐 Сайт доступен: https://avtogost77.ru"
