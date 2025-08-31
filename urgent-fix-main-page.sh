#!/bin/bash
# Срочный скрипт для исправления проблемы с главной страницей

echo "🚨 СРОЧНОЕ ИСПРАВЛЕНИЕ ГЛАВНОЙ СТРАНИЦЫ..."

echo ""
echo "🔍 Проверка главной страницы..."

# Проверяем canonical URL главной страницы
if grep -q 'rel="canonical" href="https://avtogost77.ru/"' index.html; then
    echo "   ✅ Canonical URL главной страницы правильный"
else
    echo "   ❌ Проблема с canonical URL главной страницы"
    # Исправляем canonical URL главной страницы
    sed -i 's|<link rel="canonical" href="https://avtogost77.ru/blog/">|<link rel="canonical" href="https://avtogost77.ru/">|g' index.html
    echo "   🔧 Исправлен canonical URL главной страницы"
fi

echo ""
echo "🔍 Проверка посадочной страницы блога..."

# Проверяем canonical URL посадочной страницы блога
if grep -q 'rel="canonical" href="https://avtogost77.ru/blog/"' blog/index.html; then
    echo "   ✅ Canonical URL блога правильный"
else
    echo "   ❌ Проблема с canonical URL блога"
    # Исправляем canonical URL посадочной страницы блога
    sed -i 's|<link rel="canonical" href="https://avtogost77.ru/">|<link rel="canonical" href="https://avtogost77.ru/blog/">|g' blog/index.html
    echo "   🔧 Исправлен canonical URL блога"
fi

echo ""
echo "🔍 Проверка robots.txt..."

# Проверяем robots.txt на наличие проблемных редиректов
if [ -f "robots.txt" ]; then
    echo "   ✅ robots.txt существует"
    if grep -q "Disallow: /" robots.txt; then
        echo "   ⚠️  Найдены проблемные правила в robots.txt"
    else
        echo "   ✅ robots.txt в порядке"
    fi
else
    echo "   ❌ robots.txt не найден"
fi

echo ""
echo "🔍 Проверка .htaccess..."

# Проверяем .htaccess на наличие проблемных редиректов
if [ -f ".htaccess" ]; then
    echo "   ✅ .htaccess существует"
    if grep -q "RewriteRule.*blog" .htaccess; then
        echo "   ⚠️  Найдены редиректы на блог в .htaccess"
    else
        echo "   ✅ .htaccess в порядке"
    fi
else
    echo "   ❌ .htaccess не найден"
fi

echo ""
echo "🚀 Срочный деплой исправлений..."

# Деплоим исправления на сервер
scp -i ~/.ssh/id_ed25519 index.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/
scp -i ~/.ssh/id_ed25519 blog/index.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/blog/

echo ""
echo "🔄 Перезапуск nginx..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "systemctl reload nginx"

echo ""
echo "✅ Срочное исправление завершено!"
echo "📊 Проверьте главную страницу: https://avtogost77.ru/"
echo "📊 Проверьте блог: https://avtogost77.ru/blog/"
