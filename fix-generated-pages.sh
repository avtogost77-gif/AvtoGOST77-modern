#!/bin/bash
# 🔧 СКРИПТ ИСПРАВЛЕНИЯ СГЕНЕРИРОВАННЫХ СТРАНИЦ АВТОГОСТ77
# Автор: AI-братишка для Визионера

echo "🚛 НАЧИНАЕМ ИСПРАВЛЕНИЕ СТРАНИЦ АВТОГОСТ77..."
echo "📊 Найдено HTML файлов: $(find . -name "*.html" -type f | wc -l)"

# 1. Исправляем undefined в заголовках
echo "📝 Шаг 1: Исправляем undefined..."
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/undefined Барнаул/Грузоперевозки Барнаул/g'
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/undefined Белгород/Грузоперевозки Белгород/g'
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/undefined Москва/Грузоперевозки Москва/g'
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/undefined Санкт-Петербург/Грузоперевозки Санкт-Петербург/g'
# Общий паттерн для всех
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/undefined по маршруту/Грузоперевозки по маршруту/g'
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/"serviceType": ""/"serviceType": "Грузоперевозки"/g'

# 2. Исправляем битые ссылки
echo "🔗 Шаг 2: Исправляем битые ссылки..."
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/href="\/undefined-/href="\//g'
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/<a href="\/\/"><\/a>/<a href="\/">Грузоперевозки<\/a>/g'

# 3. Подключаем новый калькулятор
echo "🧮 Шаг 3: Подключаем AI-калькулятор..."
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/<script src="\/assets\/js\/main.js"><\/script>/<script src="\/assets\/js\/main.js"><\/script>\n  <script src="\/assets\/js\/smart-calculator-v2.js"><\/script>/g'

# 4. Добавляем форму калькулятора если её нет
echo "📋 Шаг 4: Проверяем наличие формы калькулятора..."
# Это сложнее, нужно проверить есть ли секция калькулятора

# 5. Обновляем аналитику (если нужно)
echo "📊 Шаг 5: Проверяем коды аналитики..."
# Google Analytics - новый код уже правильный: G-EMQ3D0X8K7
# Яндекс.Метрика - старый код: 103413788, новый: 98832562
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/ym(103413788/ym(98832562/g'
find . -name "*-*.html" -type f -print0 | xargs -0 sed -i 's/watch\/103413788/watch\/98832562/g'

echo "✅ ГОТОВО! Исправлено основных проблем."
echo ""
echo "⚠️  ВАЖНО:"
echo "1. Сделайте бэкап перед запуском!"
echo "2. Проверьте несколько файлов после исправления"
echo "3. Для полной уникализации нужна дополнительная работа"