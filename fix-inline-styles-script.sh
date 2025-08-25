#!/bin/bash

echo "🎨 БЫСТРОЕ ИСПРАВЛЕНИЕ ИНЛАЙН СТИЛЕЙ"
echo "===================================="

# Добавляем CSS файл в head основных проблемных страниц
PROBLEMATIC_PAGES=(
    "blog-4-remote-logistics.html"
    "blog-2-wildberries-delivery.html"
    "blog-1-carrier-failed.html"
    "index.html"
)

echo "📦 Создаем бэкап..."
mkdir -p inline-styles-backup
cp "${PROBLEMATIC_PAGES[@]}" inline-styles-backup/ 2>/dev/null

# Перемещаем CSS файл в правильную папку
mv fix-inline-styles.css assets/css/

FIXED=0

for page in "${PROBLEMATIC_PAGES[@]}"; do
    if [[ -f "$page" ]]; then
        echo "🔧 Обрабатываем: $page"
        
        # Добавляем ссылку на CSS файл после master-styles
        if grep -q "master-styles.min.css" "$page"; then
            sed -i '/master-styles.min.css/a\    <link rel="stylesheet" href="assets/css/fix-inline-styles.css">' "$page"
            echo "  ✅ Добавлена ссылка на CSS"
            ((FIXED++))
        fi
        
        # Заменяем самые частые инлайн стили на классы
        
        # Калькулятор-превью
        sed -i 's/style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 2rem; border-radius: 8px; margin: 2rem 0; text-align: center;"/class="calculator-preview"/g' "$page"
        
        # Юридическая справка
        sed -i 's/style="margin: 2rem 0; padding: 1.5rem; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9fafb;"/class="legal-reference"/g' "$page"
        
        # Простые утилиты
        sed -i 's/style="text-align: center;"/class="text-center"/g' "$page"
        sed -i 's/style="color: #2563eb;"/class="text-primary"/g' "$page"
        sed -i 's/style="color: #28a745;"/class="text-success"/g' "$page"
        sed -i 's/style="margin-bottom: 0;"/class="mb-0"/g' "$page"
        sed -i 's/style="margin-top: 0;"/class="mt-0"/g' "$page"
        
        echo "  🎨 Заменены основные инлайн стили"
    fi
done

echo ""
echo "🎉 ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!"
echo "========================"
echo "✅ Обработано файлов: $FIXED"
echo "📦 Бэкап: inline-styles-backup/"
echo "🎨 CSS файл: assets/css/fix-inline-styles.css"
echo ""
echo "🔍 Проверяем сколько стилей осталось..."

for page in "${PROBLEMATIC_PAGES[@]}"; do
    if [[ -f "$page" ]]; then
        count=$(grep -c 'style="' "$page" 2>/dev/null || echo 0)
        echo "$page: $count инлайн стилей (было больше)"
    fi
done


