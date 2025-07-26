#!/bin/bash

echo "🚀 ДЕПЛОЙ MVP AVTOGOST"
echo "========================"

# Критически важные файлы для MVP
MVP_FILES=(
    "index.html"
    "robots.txt"
    "sitemap.xml"
    "favicon.svg"
    "assets/css/main.css"
    "assets/css/mobile.css"
    "assets/css/critical.css"
    "assets/js/main.js"
    "assets/js/form-handler.js"
    "assets/img/hero-logistics.webp"
)

# Блог файлы (для SEO)
BLOG_FILES=(
    "blog-1-carrier-failed.html"
    "blog-2-wildberries-delivery.html" 
    "blog-3-spot-orders.html"
    "blog-4-remote-logistics.html"
)

echo "📋 Проверка критических файлов..."
for file in "${MVP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - НЕ НАЙДЕН!"
        exit 1
    fi
done

echo ""
echo "📋 Проверка блог файлов..."
for file in "${BLOG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "⚠️  $file - не найден (опционально)"
    fi
done

echo ""
echo "🔧 Настройки подключения:"
echo "Host: hosting.reg.ru"
echo "User: u3207373"
echo "Dir: /www/avtogost77.ru"

echo ""
echo "📦 Готов к деплою!"
echo ""
echo "Для деплоя используйте один из скриптов:"
echo "1. ./deploy_ftp.py - через FTP (Python)"
echo "2. ./deploy-fixed.sh - через SFTP (если работает)"
echo ""
echo "После деплоя проверьте:"
echo "✅ https://avtogost77.ru - главная"
echo "✅ https://avtogost77.ru/favicon.svg - иконка"
echo "✅ Форма отправки заявок"
echo "✅ Калькулятор"
echo ""
echo "🎉 MVP ГОТОВ К ЗАПУСКУ!"