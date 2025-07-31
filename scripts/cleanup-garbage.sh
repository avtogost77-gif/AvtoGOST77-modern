#!/bin/bash

# 🧹 СКРИПТ ОЧИСТКИ МУСОРНЫХ SEO-СТРАНИЦ

echo "🧹 НАЧИНАЕМ ОЧИСТКУ РЕПОЗИТОРИЯ..."
echo "================================"

# Счетчики
total_deleted=0

# Функция удаления файлов по паттерну
delete_pattern() {
    local pattern=$1
    local count=$(ls $pattern 2>/dev/null | wc -l)
    
    if [ $count -gt 0 ]; then
        echo "🗑️  Удаляю $count файлов по паттерну: $pattern"
        git rm -f $pattern 2>/dev/null
        total_deleted=$((total_deleted + count))
    fi
}

# Удаляем файлы транспорта
echo "📦 Удаляем страницы транспорта..."
delete_pattern "fura-*.html"
delete_pattern "gazelle-*.html"
delete_pattern "kamaz-*.html"
delete_pattern "tent-*.html"
delete_pattern "refrizherator-*.html"

# Удаляем модификаторы
echo "🏷️  Удаляем страницы с модификаторами..."
delete_pattern "*-nedorogo.html"
delete_pattern "*-srochno.html"
delete_pattern "*-bistro.html"
delete_pattern "*-deshevo.html"

echo ""
echo "================================"
echo "✅ ОЧИСТКА ЗАВЕРШЕНА!"
echo "📊 Удалено файлов: $total_deleted"
echo ""

# Проверяем что осталось
remaining=$(ls *.html 2>/dev/null | wc -l)
echo "📈 Осталось HTML файлов: $remaining"

if [ $remaining -lt 1000 ]; then
    echo "✅ Количество файлов в норме!"
else
    echo "⚠️  Все еще много файлов, может нужна дополнительная очистка?"
fi

echo ""
echo "🎯 Следующие шаги:"
echo "1. Проверьте изменения: git status"
echo "2. Закоммитьте: git commit -m '🧹 Удалил мусорные SEO-страницы'"
echo "3. Запушьте: git push origin main"