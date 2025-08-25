#!/bin/bash

echo "🔍 ТЕХНИЧЕСКИЙ АУДИТ ВСЕХ СТРАНИЦ - SENIOR LEVEL"
echo "================================================"

# Создаем папку для отчетов
mkdir -p audit-reports
cd audit-reports

echo "📊 Найдено страниц для аудита: $(find .. -name "*.html" -not -path "../backup*" -not -path "../test*" | wc -l)"

echo ""
echo "🔍 1. ПРОВЕРКА ДУБЛИРУЮЩИХ META ТЕГОВ..."
# Ищем страницы с одинаковыми title
echo "=== ДУБЛИРУЮЩИЕ TITLE ===" > meta-duplicates.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" -exec grep -l "<title>" {} \; | while read file; do
    title=$(grep -o "<title>.*</title>" "$file" 2>/dev/null | head -1)
    echo "$file: $title" >> meta-duplicates.txt
done

echo ""
echo "🔍 2. ПРОВЕРКА ПУСТЫХ ALT АТРИБУТОВ..."
# Ищем картинки без alt или с пустыми alt
echo "=== КАРТИНКИ БЕЗ ALT ===" > missing-alts.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" -exec grep -l "<img" {} \; | while read file; do
    # Ищем img без alt
    grep -n "<img[^>]*>" "$file" | grep -v "alt=" >> missing-alts.txt
    # Ищем img с пустыми alt
    grep -n 'alt=""' "$file" >> missing-alts.txt
done

echo ""
echo "🔍 3. ПРОВЕРКА MISSING H1 ТЕГОВ..."
# Ищем страницы без H1
echo "=== СТРАНИЦЫ БЕЗ H1 ===" > missing-h1.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" | while read file; do
    if ! grep -q "<h1" "$file"; then
        echo "$file: НЕТ H1 ТЕГА" >> missing-h1.txt
    fi
done

echo ""
echo "🔍 4. ПРОВЕРКА БИТЫХ LINKS..."
# Ищем битые внутренние ссылки
echo "=== БИТЫЕ ССЫЛКИ ===" > broken-links.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" | while read file; do
    # Извлекаем внутренние ссылки
    grep -o 'href="[^"]*\.html[^"]*"' "$file" | grep -v "http" | while read link; do
        # Убираем href=" и "
        clean_link=$(echo "$link" | sed 's/href="//;s/"//')
        # Проверяем существование файла
        if [[ ! -f "../$clean_link" && ! -f "$clean_link" ]]; then
            echo "$file: БИТАЯ ССЫЛКА -> $clean_link" >> broken-links.txt
        fi
    done
done

echo ""
echo "🔍 5. ПРОВЕРКА ИНЛАЙН СТИЛЕЙ..."
# Ищем инлайн стили
echo "=== ИНЛАЙН СТИЛИ ===" > inline-styles.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" | while read file; do
    inline_count=$(grep -c 'style="' "$file" 2>/dev/null || echo 0)
    if [[ $inline_count -gt 5 ]]; then
        echo "$file: $inline_count инлайн стилей (МНОГО!)" >> inline-styles.txt
    fi
done

echo ""
echo "🔍 6. ПРОВЕРКА CONSOLE.LOG..."
# Ищем забытые console.log
echo "=== CONSOLE.LOG В ПРОДАКШЕНЕ ===" > console-logs.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" -exec grep -l "console.log" {} \; | while read file; do
    grep -n "console.log" "$file" >> console-logs.txt
done

echo ""
echo "🔍 7. ПРОВЕРКА МЕТА ROBOTS..."
# Ищем страницы без robots meta
echo "=== ОТСУТСТВУЕТ ROBOTS META ===" > missing-robots.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" | while read file; do
    if ! grep -q 'name="robots"' "$file"; then
        echo "$file: НЕТ ROBOTS META" >> missing-robots.txt
    fi
done

echo ""
echo "🔍 8. ПРОВЕРКА CANONICAL URL..."
# Ищем страницы без canonical
echo "=== ОТСУТСТВУЕТ CANONICAL ===" > missing-canonical.txt
find .. -name "*.html" -not -path "../backup*" -not -path "../test*" | while read file; do
    if ! grep -q 'rel="canonical"' "$file"; then
        echo "$file: НЕТ CANONICAL URL" >> missing-canonical.txt
    fi
done

echo ""
echo "✅ АУДИТ ЗАВЕРШЕН! Отчеты сохранены в audit-reports/"
echo ""
echo "📊 КРАТКАЯ СТАТИСТИКА:"
echo "Дублирующие meta: $(wc -l < meta-duplicates.txt) проблем"
echo "Картинки без alt: $(wc -l < missing-alts.txt) проблем"  
echo "Страницы без H1: $(wc -l < missing-h1.txt) проблем"
echo "Битые ссылки: $(wc -l < broken-links.txt) проблем"
echo "Много инлайн стилей: $(wc -l < inline-styles.txt) проблем"
echo "Console.log: $(wc -l < console-logs.txt) проблем"
echo "Без robots meta: $(wc -l < missing-robots.txt) проблем"
echo "Без canonical: $(wc -l < missing-canonical.txt) проблем"


