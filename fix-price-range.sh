#!/bin/bash

echo "🔧 Исправляю priceRange в Schema.org разметке..."

# Исправляем priceRange на всех HTML файлах
find . -maxdepth 1 -name "*.html" -exec sed -i 's/"priceRange": "₽₽"/"priceRange": "$$"/g' {} \;
find . -maxdepth 1 -name "*.html" -exec sed -i 's/"priceRange": "₽₽₽"/"priceRange": "$$$"/g' {} \;
find . -maxdepth 1 -name "*.html" -exec sed -i 's/"priceRange": "₽₽₽₽"/"priceRange": "$$$$"/g' {} \;

echo "✅ PriceRange исправлен!"
echo "📊 Изменения:"
echo "   - ₽₽ → $$ (средний ценовой диапазон)"
echo "   - ₽₽₽ → $$$ (высокий ценовой диапазон)"
echo "   - ₽₽₽₽ → $$$$ (премиум ценовой диапазон)"

# Проверяем, что изменения применились
echo ""
echo "🔍 Проверяем результат:"
grep -r '"priceRange"' . --include="*.html" | head -5
