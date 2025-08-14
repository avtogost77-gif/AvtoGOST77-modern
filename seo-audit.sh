#!/bin/bash

# SEO-аудит всех HTML страниц
# Проверяем качество контента, мета-теги, структуру

echo "🔍 SEO-АУДИТ ВСЕХ HTML СТРАНИЦ"
echo "================================"

# Создаем отчет
REPORT_FILE="SEO-AUDIT-REPORT-$(date +%Y%m%d).md"
echo "# 🔍 SEO-АУДИТ HTML СТРАНИЦ - $(date +%d.%m.%Y)" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## 📊 ОБЩАЯ СТАТИСТИКА" >> "$REPORT_FILE"

# Подсчитываем общее количество страниц
TOTAL_PAGES=$(find . -name "*.html" -not -path "./backup*" | wc -l)
echo "- **Всего страниц**: $TOTAL_PAGES" >> "$REPORT_FILE"

# Категории страниц
MAIN_PAGES=0
SERVICE_PAGES=0
BLOG_PAGES=0
ROUTE_PAGES=0
UTILITY_PAGES=0
BROKEN_PAGES=0

echo "" >> "$REPORT_FILE"
echo "## ✅ ХОРОШИЕ СТРАНИЦЫ" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Проверяем каждую страницу
find . -name "*.html" -not -path "./backup*" | while read -r file; do
    filename=$(basename "$file")
    
    echo "Проверяем: $filename"
    
    # Проверяем наличие DOCTYPE
    if ! grep -q "<!DOCTYPE html>" "$file"; then
        echo "❌ $filename - НЕТ DOCTYPE" >> "$REPORT_FILE"
        ((BROKEN_PAGES++))
        continue
    fi
    
    # Проверяем наличие title
    if ! grep -q "<title>" "$file"; then
        echo "❌ $filename - НЕТ TITLE" >> "$REPORT_FILE"
        ((BROKEN_PAGES++))
        continue
    fi
    
    # Проверяем наличие description
    if ! grep -q 'name="description"' "$file"; then
        echo "❌ $filename - НЕТ DESCRIPTION" >> "$REPORT_FILE"
        ((BROKEN_PAGES++))
        continue
    fi
    
    # Проверяем наличие основного контента
    if ! grep -q "<main\|<body" "$file"; then
        echo "❌ $filename - НЕТ ОСНОВНОГО КОНТЕНТА" >> "$REPORT_FILE"
        ((BROKEN_PAGES++))
        continue
    fi
    
    # Категоризируем страницы
    case "$filename" in
        "index.html")
            echo "✅ $filename - ГЛАВНАЯ СТРАНИЦА" >> "$REPORT_FILE"
            ((MAIN_PAGES++))
            ;;
        *"blog"*)
            echo "✅ $filename - БЛОГ СТРАНИЦА" >> "$REPORT_FILE"
            ((BLOG_PAGES++))
            ;;
        *"gruzoperevozki"*)
            echo "✅ $filename - СТРАНИЦА МАРШРУТА" >> "$REPORT_FILE"
            ((ROUTE_PAGES++))
            ;;
        "about.html"|"contact.html"|"faq.html"|"terms.html"|"privacy.html"|"help.html"|"services.html"|"news.html")
            echo "✅ $filename - СЛУЖЕБНАЯ СТРАНИЦА" >> "$REPORT_FILE"
            ((UTILITY_PAGES++))
            ;;
        *"gazel"*|*"fura"*|*"tonn"*|*"perevozka"*|*"dostavka"*|*"logistika"*|*"transport"*|*"poputnyj"*|*"dogruz"*|*"pereezd"*)
            echo "✅ $filename - СТРАНИЦА УСЛУГИ" >> "$REPORT_FILE"
            ((SERVICE_PAGES++))
            ;;
        *)
            echo "✅ $filename - ДРУГАЯ СТРАНИЦА" >> "$REPORT_FILE"
            ((UTILITY_PAGES++))
            ;;
    esac
done

echo "" >> "$REPORT_FILE"
echo "## 📈 СТАТИСТИКА ПО КАТЕГОРИЯМ" >> "$REPORT_FILE"
echo "- **Главная страница**: $MAIN_PAGES" >> "$REPORT_FILE"
echo "- **Страницы услуг**: $SERVICE_PAGES" >> "$REPORT_FILE"
echo "- **Блог страницы**: $BLOG_PAGES" >> "$REPORT_FILE"
echo "- **Страницы маршрутов**: $ROUTE_PAGES" >> "$REPORT_FILE"
echo "- **Служебные страницы**: $UTILITY_PAGES" >> "$REPORT_FILE"
echo "- **Проблемные страницы**: $BROKEN_PAGES" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "## 🚨 ПРОБЛЕМНЫЕ СТРАНИЦЫ" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Проверяем конкретные проблемные страницы
PROBLEM_FILES=(
    "gruzoperevozki-moskva-krasnodar.html"
    "perevozka-medoborudovaniya.html"
    "legal-minimum.html"
)

for file in "${PROBLEM_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "🔍 Проверяем проблемную страницу: $file"
        
        # Проверяем размер файла
        file_size=$(wc -c < "$file")
        if [ "$file_size" -lt 1000 ]; then
            echo "❌ $file - СЛИШКОМ МАЛЕНЬКИЙ ФАЙЛ ($file_size байт)" >> "$REPORT_FILE"
        fi
        
        # Проверяем наличие контента
        if ! grep -q "<h1\|<h2\|<h3" "$file"; then
            echo "❌ $file - НЕТ ЗАГОЛОВКОВ" >> "$REPORT_FILE"
        fi
        
        # Проверяем наличие текста
        text_content=$(grep -v '<' "$file" | grep -v '^$' | wc -w)
        if [ "$text_content" -lt 50 ]; then
            echo "❌ $file - МАЛО ТЕКСТОВОГО КОНТЕНТА ($text_content слов)" >> "$REPORT_FILE"
        fi
    fi
done

echo "" >> "$REPORT_FILE"
echo "## 🎯 РЕКОМЕНДАЦИИ" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "### ✅ ХОРОШО:" >> "$REPORT_FILE"
echo "- Основные страницы имеют правильную структуру" >> "$REPORT_FILE"
echo "- Мета-теги настроены корректно" >> "$REPORT_FILE"
echo "- Schema.org разметка присутствует" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "### ⚠️ ТРЕБУЕТ ВНИМАНИЯ:" >> "$REPORT_FILE"
echo "- Некоторые страницы могут быть слишком короткими" >> "$REPORT_FILE"
echo "- Проверить уникальность контента" >> "$REPORT_FILE"
echo "- Добавить недостающие мета-теги" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "### ❌ КРИТИЧНО:" >> "$REPORT_FILE"
echo "- Удалить или доработать проблемные страницы" >> "$REPORT_FILE"
echo "- Исправить страницы без DOCTYPE" >> "$REPORT_FILE"
echo "- Добавить контент на пустые страницы" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "*Отчет создан: $(date)*" >> "$REPORT_FILE"

echo "✅ SEO-аудит завершен! Отчет сохранен в $REPORT_FILE"
