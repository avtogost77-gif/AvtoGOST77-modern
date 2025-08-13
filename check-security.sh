#!/bin/bash

echo "🔒 Проверка безопасности АвтоГОСТ77..."

# Проверяем наличие API токенов в коде
echo "🔍 Проверяем API токены..."
if grep -r "7999458907:AAGOAjQLmEZuT4SFx4Upl1GjuXO0yFuWok8" assets/js/ 2>/dev/null; then
    echo "❌ КРИТИЧНО: API токены найдены в коде!"
else
    echo "✅ API токены не найдены в коде"
fi

# Проверяем console.log
echo "🔍 Проверяем console.log..."
console_count=$(grep -r "console.log" assets/js/ 2>/dev/null | wc -l)
if [ "$console_count" -gt 0 ]; then
    echo "⚠️ Найдено $console_count console.log в JS файлах"
else
    echo "✅ console.log не найдены"
fi

# Проверяем тестовые файлы
echo "🔍 Проверяем тестовые файлы..."
if [ -f "test-calculator.html" ]; then
    echo "❌ Найден тестовый файл: test-calculator.html"
else
    echo "✅ Тестовые файлы не найдены"
fi

# Проверяем Service Worker
echo "🔍 Проверяем Service Worker..."
if grep -q "KILLER\|NUKING\|DESTROY" sw.js 2>/dev/null; then
    echo "❌ Service Worker содержит проблемную логику"
else
    echo "✅ Service Worker в порядке"
fi

echo "✅ Проверка безопасности завершена"
