#!/bin/bash

# ============================================
# СКРИПТ КОМПИЛЯЦИИ SCSS - AvtoGOST77
# ============================================
# Дата создания: 31 августа 2025
# Автор: AI Assistant
# Описание: Компиляция SCSS в CSS (глобальный SASS)

echo "🎨 КОМПИЛЯЦИЯ SCSS ===="
echo "📅 Дата: $(date)"
echo "📁 Рабочая папка: $(pwd)"

# Проверяем наличие глобального SASS
if ! sass --version &> /dev/null; then
    echo "❌ Глобальный SASS не найден!"
    echo "📋 Установите: sudo npm install -g sass"
    exit 1
fi

echo "✅ Глобальный SASS найден: $(sass --version)"

# Создаем папку для скомпилированных CSS
mkdir -p compiled

# Компилируем main.scss
echo "🔧 Компилирую main.scss..."
sass styles/main.scss:compiled/main.css --style=expanded

if [ $? -eq 0 ]; then
    echo "✅ main.scss скомпилирован успешно!"
    echo "📊 Размер: $(ls -lh compiled/main.css | awk '{print $5}')"
else
    echo "❌ Ошибка компиляции main.scss"
    exit 1
fi

# Компилируем critical.scss
echo "🔧 Компилирую critical.scss..."
sass styles/critical.scss:compiled/critical.css --style=expanded

if [ $? -eq 0 ]; then
    echo "✅ critical.scss скомпилирован успешно!"
    echo "📊 Размер: $(ls -lh compiled/critical.css | awk '{print $5}')"
else
    echo "❌ Ошибка компиляции critical.scss"
    exit 1
fi

# Компилируем минифицированные версии
echo "🔧 Создаю минифицированные версии..."

sass styles/main.scss:compiled/main.min.css --style=compressed
sass styles/critical.scss:compiled/critical.min.css --style=compressed

if [ $? -eq 0 ]; then
    echo "✅ Минифицированные версии созданы!"
    echo "📊 Размер main.min.css: $(ls -lh compiled/main.min.css | awk '{print $5}')"
    echo "📊 Размер critical.min.css: $(ls -lh compiled/critical.min.css | awk '{print $5}')"
else
    echo "❌ Ошибка создания минифицированных версий"
    exit 1
fi

# Создаем source maps
echo "🔧 Создаем source maps..."
sass styles/main.scss:compiled/main.css --style=expanded --source-map
sass styles/critical.scss:compiled/critical.css --style=expanded --source-map

echo "✅ Source maps созданы!"

# Показываем итоговую статистику
echo ""
echo "🎉 КОМПИЛЯЦИЯ ЗАВЕРШЕНА!"
echo "📁 Файлы созданы в папке compiled/:"
ls -lh compiled/

echo ""
echo "📊 СТАТИСТИКА:"
echo "📄 main.css: $(ls -lh compiled/main.css | awk '{print $5}')"
echo "📄 main.min.css: $(ls -lh compiled/main.min.css | awk '{print $5}')"
echo "📄 critical.css: $(ls -lh compiled/critical.css | awk '{print $5}')"
echo "📄 critical.min.css: $(ls -lh compiled/critical.min.css | awk '{print $5}')"

echo ""
echo "🚀 Готово к использованию!"
echo "💡 Для watch режима используйте: sass --watch styles:compiled"
echo "💡 Или через npm script: npm run sass:watch"
