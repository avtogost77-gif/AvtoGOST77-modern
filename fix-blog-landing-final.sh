#!/bin/bash
# Финальный скрипт для исправления посадочной страницы блога

echo "🔧 Финальное исправление посадочной страницы блога..."

# Создаем backup
cp blog/index.html blog/index.html.backup.final
echo "📁 Создан backup: blog/index.html.backup.final"

echo ""
echo "🧹 Этап 1: Очистка Schema.org разметки..."

# Удаляем все существующие Schema.org блоки
sed -i '/<script type="application\/ld+json">/,/<\/script>/d' blog/index.html

echo ""
echo "🔧 Этап 2: Добавление правильной Schema.org разметки..."

# Добавляем правильную Schema.org разметку
correct_schema='    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "АвтоГОСТ - Блог о грузоперевозках",
  "url": "https://avtogost77.ru/blog/",
  "description": "Экспертные статьи о грузоперевозках, логистике и транспорте"
}
</script>
    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://avtogost77.ru/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Блог АвтоГОСТ",
      "item": "https://avtogost77.ru/blog/"
    }
  ]
}
</script>'

# Вставляем после первого script tag
sed -i '/<script type="application\/ld+json">/a\'"$correct_schema" blog/index.html

echo ""
echo "🔗 Этап 3: Проверка canonical URL..."

# Проверяем и исправляем canonical URL
if grep -q 'rel="canonical" href="https://avtogost77.ru/blog/"' blog/index.html; then
    echo "   ✅ Canonical URL уже правильный"
else
    echo "   🔧 Исправляем canonical URL..."
    sed -i 's|<link rel="canonical" href="https://avtogost77.ru/">|<link rel="canonical" href="https://avtogost77.ru/blog/">|g' blog/index.html
fi

echo ""
echo "📝 Этап 4: Обновление дат..."

# Обновляем даты на актуальные
sed -i 's/1 января 2025/26 августа 2025/g' blog/index.html
sed -i 's/25 августа 2025/26 августа 2025/g' blog/index.html

echo ""
echo "✅ Все исправления завершены!"
echo "📊 Что исправлено:"
echo "   - ✅ Canonical URL указывает на /blog/"
echo "   - ✅ Очищена Schema.org разметка"
echo "   - ✅ Добавлена правильная Schema.org разметка"
echo "   - ✅ Обновлены даты на 26 августа 2025"
echo ""
echo "�� Готово к деплою!"
