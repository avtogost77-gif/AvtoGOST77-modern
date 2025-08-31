#!/bin/bash

echo "🔗 Улучшаю внутреннюю навигацию для проблемных страниц..."

# Список проблемных страниц из Google Search Console
PROBLEM_PAGES=(
    "gazel-gruzoperevozki.html"
    "trehtonnik-gruzoperevozki.html"
    "pyatitonnik-gruzoperevozki.html"
    "desyatitonnik-gruzoperevozki.html"
    "fura-20-tonn-gruzoperevozki.html"
    "dogruz.html"
    "pereezd-moskva.html"
    "perevozka-mebeli.html"
    "perevozka-medoborudovaniya.html"
    "poputnyj-gruz.html"
    "help.html"
    "news.html"
    "privacy.html"
    "services.html"
)

# Проверяем, какие страницы существуют
echo "📄 Проверяю существующие страницы..."
for page in "${PROBLEM_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page существует"
    else
        echo "❌ $page НЕ существует"
    fi
done

echo ""
echo "🔍 Анализирую внутренние ссылки..."

# Проверяем ссылки на главной странице
echo "📊 Ссылки на главной странице:"
for page in "${PROBLEM_PAGES[@]}"; do
    if [ -f "$page" ]; then
        count=$(grep -c "$page" index.html 2>/dev/null || echo "0")
        echo "  $page: $count ссылок"
    fi
done

echo ""
echo "📋 Рекомендации:"
echo "1. Добавить больше внутренних ссылок на проблемные страницы"
echo "2. Создать карту сайта для пользователей"
echo "3. Добавить хлебные крошки"
echo "4. Улучшить навигационное меню"
echo "5. Добавить связанные статьи в конце страниц"
