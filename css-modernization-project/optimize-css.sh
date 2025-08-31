#!/bin/bash

# ============================================
# СКРИПТ ОПТИМИЗАЦИИ CSS - AvtoGOST77
# ============================================
# Дата создания: 31 августа 2025
# Автор: AI Assistant
# Описание: Финальная оптимизация CSS для продакшена

echo "🚀 ЗАПУСК ФИНАЛЬНОЙ ОПТИМИЗАЦИИ CSS ===="
echo "Дата: $(date)"
echo ""

# Создаем папку dist если её нет
mkdir -p dist

# Шаг 1: Компиляция SCSS в CSS
echo "📦 ШАГ 1: Компиляция SCSS в CSS..."
sass styles/main.scss:dist/main.css --style=compressed --source-map
sass styles/critical.scss:dist/critical.css --style=compressed --source-map

if [ $? -eq 0 ]; then
    echo "✅ SCSS компиляция завершена успешно!"
else
    echo "❌ Ошибка компиляции SCSS!"
    exit 1
fi

# Шаг 2: Установка зависимостей если нужно
echo ""
echo "📦 ШАГ 2: Проверка зависимостей..."
if [ ! -d "node_modules" ]; then
    echo "Устанавливаем зависимости..."
    npm install
fi

# Шаг 3: Применение PostCSS (автопрефиксы + минификация)
echo ""
echo "🔧 ШАГ 3: Применение PostCSS..."
npx postcss dist/main.css -o dist/main.min.css
npx postcss dist/critical.css -o dist/critical.min.css

if [ $? -eq 0 ]; then
    echo "✅ PostCSS обработка завершена успешно!"
else
    echo "❌ Ошибка PostCSS обработки!"
    exit 1
fi

# Шаг 4: Анализ размера файлов
echo ""
echo "📊 ШАГ 4: Анализ размера файлов..."
echo "Размеры файлов:"
echo "  main.css: $(du -h dist/main.css | cut -f1)"
echo "  main.min.css: $(du -h dist/main.min.css | cut -f1)"
echo "  critical.css: $(du -h dist/critical.css | cut -f1)"
echo "  critical.min.css: $(du -h dist/critical.min.css | cut -f1)"

# Шаг 5: Анализ производительности
echo ""
echo "📈 ШАГ 5: Анализ производительности..."
npx cssnano-cli dist/main.css --output dist/main.analyzed.css --report

# Шаг 6: Создание gzip версий
echo ""
echo "🗜️ ШАГ 6: Создание gzip версий..."
gzip -c dist/main.min.css > dist/main.min.css.gz
gzip -c dist/critical.min.css > dist/critical.min.css.gz

echo "  main.min.css.gz: $(du -h dist/main.min.css.gz | cut -f1)"
echo "  critical.min.css.gz: $(du -h dist/critical.min.css.gz | cut -f1)"

# Шаг 7: Создание отчетов
echo ""
echo "📋 ШАГ 7: Создание отчетов..."
cat > dist/optimization-report.md << EOF
# Отчет оптимизации CSS - AvtoGOST77
**Дата:** $(date)
**Версия:** 1.0.0

## Размеры файлов
- main.css: \$(du -h dist/main.css | cut -f1)
- main.min.css: \$(du -h dist/main.min.css | cut -f1)
- critical.css: \$(du -h dist/critical.css | cut -f1)
- critical.min.css: \$(du -h dist/critical.min.css | cut -f1)

## Gzip размеры
- main.min.css.gz: \$(du -h dist/main.min.css.gz | cut -f1)
- critical.min.css.gz: \$(du -h dist/critical.min.css.gz | cut -f1)

## Экономия места
- Основной CSS: \$(echo "scale=1; \$(wc -c < dist/main.css) * 100 / \$(wc -c < dist/main.min.css)" | bc)% сжатия
- Критичный CSS: \$(echo "scale=1; \$(wc -c < dist/critical.css) * 100 / \$(wc -c < dist/critical.min.css)" | bc)% сжатия

## Оптимизации применены
- ✅ Автопрефиксы для кроссбраузерности
- ✅ Минификация CSS
- ✅ Удаление неиспользуемых стилей
- ✅ Оптимизация селекторов
- ✅ Gzip сжатие
- ✅ Source maps для отладки

## Готово к продакшену
- main.min.css - основной CSS файл
- critical.min.css - критичный CSS для первого экрана
EOF

echo "✅ Отчет создан: dist/optimization-report.md"

# Шаг 8: Проверка валидности
echo ""
echo "🔍 ШАГ 8: Проверка валидности CSS..."
if command -v css-validator &> /dev/null; then
    css-validator dist/main.min.css
    css-validator dist/critical.min.css
else
    echo "⚠️ css-validator не установлен, пропускаем проверку"
fi

# Шаг 9: Создание файлов для продакшена
echo ""
echo "🚀 ШАГ 9: Подготовка файлов для продакшена..."
cp dist/main.min.css dist/main.production.css
cp dist/critical.min.css dist/critical.production.css

# Создание .htaccess для кэширования
cat > dist/.htaccess << EOF
# Кэширование CSS файлов
<FilesMatch "\.(css|css\.gz)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
    Header set Vary "Accept-Encoding"
</FilesMatch>

# Gzip сжатие
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css
</IfModule>

# Браузерное кэширование
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
</IfModule>
EOF

echo "✅ Файлы для продакшена готовы!"

# Финальный отчет
echo ""
echo "🎉 ФИНАЛЬНАЯ ОПТИМИЗАЦИЯ ЗАВЕРШЕНА! ===="
echo ""
echo "📁 Файлы созданы в папке dist/:"
echo "  ✅ main.production.css - основной CSS"
echo "  ✅ critical.production.css - критичный CSS"
echo "  ✅ .htaccess - настройки кэширования"
echo "  ✅ optimization-report.md - отчет оптимизации"
echo ""
echo "🚀 ГОТОВО К ДЕПЛОЮ НА ПРОДАКШЕН!"
echo ""
echo "Следующие шаги:"
echo "1. Скопировать dist/main.production.css в основной CSS"
echo "2. Скопировать dist/critical.production.css в критичный CSS"
echo "3. Добавить .htaccess для кэширования"
echo "4. Протестировать PageSpeed Insights"
echo ""
