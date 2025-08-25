#!/bin/bash
# Скрипт для деплоя новых страниц городов на сервер

echo "🚀 Деплой новых страниц городов на сервер..."

# Массив новых страниц для деплоя
pages=(
    "gruzoperevozki-moskva-kazan.html"
    "gruzoperevozki-moskva-nizhny-novgorod.html"
    "gruzoperevozki-moskva-rostov.html"
    "gruzoperevozki-moskva-samara.html"
    "gruzoperevozki-moskva-ufa.html"
    "gruzoperevozki-moskva-ekaterinburg.html"
    "gruzoperevozki-moskva-novosibirsk.html"
    "gruzoperevozki-moskva-krasnodar.html"
    "gruzoperevozki-moskva-chelyabinsk.html"
    "gruzoperevozki-moskva-omsk.html"
    "gruzoperevozki-moskva-perm.html"
    "sitemap.xml"
)

echo "📤 Загружаем страницы на сервер..."

# Загружаем все новые страницы
for page in "${pages[@]}"; do
    echo "   📄 Загружаем: $page"
    scp -i ~/.ssh/id_ed25519 "$page" root@193.160.208.183:/www/wwwroot/avtogost77.ru/
done

echo ""
echo "✅ Все страницы загружены на сервер!"
echo "📊 Загружено ${#pages[@]} файлов"

echo ""
echo "🔄 Перезапускаем nginx..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "systemctl reload nginx"

echo ""
echo "🎯 Деплой завершен!"
echo "📋 Созданные страницы:"
for page in "${pages[@]}"; do
    if [[ $page != "sitemap.xml" ]]; then
        echo "   - https://avtogost77.ru/$page"
    fi
done

echo ""
echo "🚀 Следующие шаги:"
echo "1. Проверить доступность страниц"
echo "2. Отправить обновленный sitemap в поисковые системы"
echo "3. Мониторить индексацию новых страниц"
echo ""
echo "Готово! 🚛"
