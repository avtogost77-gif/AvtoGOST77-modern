#!/bin/bash
# Скрипт для исправления телефонов во всех файлах

echo "📞 ИСПРАВЛЕНИЕ ТЕЛЕФОНОВ ВО ВСЕХ ФАЙЛАХ..."

# Массив HTML файлов для исправления (исключаем backup директории)
html_files=($(find . -maxdepth 1 -name "*.html" -not -path "./backup*" -not -path "./mega-cleanup-backup*" -not -path "./inline-styles-backup*" -not -path "./canonical-fix-backup*" -not -path "./schema-fix-backup*" -not -path "./seo-fix-backup*" -not -path "./blog-fix-backup*" -not -path "./mobile-cleanup-backup*"))

echo ""
echo "📄 Найдено HTML файлов для исправления: ${#html_files[@]}"

echo ""
echo "📞 Исправляем телефоны..."

# Счетчики для статистики
fixed_count=0

for file in "${html_files[@]}"; do
    echo "   📄 Проверяем: $file"
    
    # Заменяем неправильные телефоны на правильный
    # 7999458907 -> +79162720932
    sed -i 's/7999458907/+79162720932/g' "$file"
    
    # +7 (495) 268-06-8X -> +7 916 272-09-32
    sed -i 's/+7 (495) 268-06-8[0-9]/+7 916 272-09-32/g' "$file"
    
    # +7 495 268-06-8X -> +7 916 272-09-32
    sed -i 's/+7 495 268-06-8[0-9]/+7 916 272-09-32/g' "$file"
    
    # 495 268-06-8X -> +7 916 272-09-32
    sed -i 's/495 268-06-8[0-9]/+7 916 272-09-32/g' "$file"
    
    # Проверяем, есть ли еще неправильные телефоны
    if grep -q "268-06-8" "$file"; then
        echo "   ⚠️  Найдены дополнительные телефоны в: $file"
        fixed_count=$((fixed_count + 1))
    fi
done

echo ""
echo "✅ Телефоны исправлены во всех файлах!"
echo "📊 Статистика:"
echo "   - Обработано файлов: ${#html_files[@]}"
echo "   - Исправлено телефонов: $fixed_count"
echo "   - Правильный телефон: +7 916 272-09-32"
echo ""
echo "�� Готово к деплою!"
