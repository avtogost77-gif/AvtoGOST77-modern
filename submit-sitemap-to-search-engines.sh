#!/bin/bash

# Скрипт для отправки обновленного sitemap в поисковые системы
# Выполняется локально

echo "🚀 Отправка обновленного sitemap в поисковые системы..."

# URL sitemap
SITEMAP_URL="https://avtogost77.ru/sitemap.xml"

echo "📋 Sitemap URL: $SITEMAP_URL"

# Google Search Console API (если есть доступ)
echo "🔍 Google Search Console:"
echo "   Перейдите в Google Search Console"
echo "   Выберите сайт avtogost77.ru"
echo "   Перейдите в Sitemaps"
echo "   Добавьте: $SITEMAP_URL"

# Яндекс.Вебмастер
echo "🔍 Яндекс.Вебмастер:"
echo "   Перейдите в Яндекс.Вебмастер"
echo "   Выберите сайт avtogost77.ru"
echo "   Перейдите в Индексирование > Sitemap файлы"
echo "   Добавьте: $SITEMAP_URL"

# Bing Webmaster Tools
echo "🔍 Bing Webmaster Tools:"
echo "   Перейдите в Bing Webmaster Tools"
echo "   Выберите сайт avtogost77.ru"
echo "   Перейдите в Configure My Site > Sitemaps"
echo "   Добавьте: $SITEMAP_URL"

# Пинг поисковых систем
echo "📡 Пинг поисковых систем..."

# Google
echo "🔍 Пинг Google..."
curl -s "https://www.google.com/ping?sitemap=$SITEMAP_URL" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Google пинг отправлен"
else
    echo "❌ Ошибка отправки пинга в Google"
fi

# Bing
echo "🔍 Пинг Bing..."
curl -s "https://www.bing.com/ping?sitemap=$SITEMAP_URL" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Bing пинг отправлен"
else
    echo "❌ Ошибка отправки пинга в Bing"
fi

# Yandex
echo "🔍 Пинг Yandex..."
curl -s "https://blogs.yandex.com/pings/?status=success&url=$SITEMAP_URL" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Yandex пинг отправлен"
else
    echo "❌ Ошибка отправки пинга в Yandex"
fi

echo ""
echo "📊 Следующие шаги:"
echo "1. Проверьте Google Search Console на наличие ошибок"
echo "2. Проверьте Яндекс.Вебмастер на наличие ошибок"
echo "3. Мониторьте индексацию в течение 24-48 часов"
echo "4. Проверьте позиции по ключевым запросам"

echo ""
echo "🔗 Полезные ссылки:"
echo "   Google Search Console: https://search.google.com/search-console"
echo "   Яндекс.Вебмастер: https://webmaster.yandex.ru/"
echo "   Bing Webmaster Tools: https://www.bing.com/webmasters"

echo ""
echo "✅ Sitemap отправлен в поисковые системы!"
