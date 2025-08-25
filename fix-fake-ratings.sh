#!/bin/bash

# КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Удаление всех фейковых aggregateRating

echo "🚨 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ ФЕЙКОВЫХ РЕЙТИНГОВ"
echo "=============================================="

# Создаем бэкап
echo "📦 Создаем бэкап..."
mkdir -p backup-rating-fix-$(date +%Y%m%d-%H%M%S)
cp *.html backup-rating-fix-$(date +%Y%m%d-%H%M%S)/

echo "🔧 Удаляем aggregateRating блоки..."

# Удаляем все aggregateRating блоки из всех HTML файлов
find . -maxdepth 1 -name "*.html" -not -path "./backup*" -not -name "test*" | while read file; do
    echo "Обрабатываем: $file"
    
    # Удаляем aggregateRating блоки (включая многострочные)
    sed -i '/aggregateRating/,/},/d' "$file"
    
    # Также удаляем одиночные строки с aggregateRating
    sed -i '/aggregateRating/d' "$file"
    
    # Очищаем пустые строки и лишние запятые
    sed -i '/^[[:space:]]*$/d' "$file"
    sed -i 's/,[[:space:]]*,/,/g' "$file"
    sed -i 's/,[[:space:]]*}/}/g' "$file"
    
done

echo "✅ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!"
echo ""
echo "📊 Проверяем результат..."
remaining=$(grep -r "aggregateRating" . --include="*.html" | wc -l)
echo "Осталось aggregateRating блоков: $remaining"

if [ $remaining -eq 0 ]; then
    echo "🎉 ВСЕ ФЕЙКОВЫЕ РЕЙТИНГИ УДАЛЕНЫ!"
else
    echo "⚠️  Требуется ручная доработка..."
fi

echo ""
echo "🚀 СЛЕДУЮЩИЕ ШАГИ:"
echo "1. Проверить файлы вручную"  
echo "2. Загрузить на сервер"
echo "3. Запросить переиндексацию"
echo "4. Google должен простить фейковые рейтинги"


