#!/bin/bash
# Скрипт для деплоя исправленных статей блога

echo "🚀 Деплой исправленных статей блога на сервер..."

# Массив статей блога для деплоя
blog_articles=(
    "blog-1-carrier-failed.html"
    "blog-2-wildberries-delivery.html"
    "blog-3-spot-orders.html"
    "blog-4-remote-logistics.html"
    "blog-5-logistics-optimization.html"
    "blog-6-marketplace-insider.html"
    "blog-7-how-to-order-gazelle.html"
    "blog-8-cargo-insurance.html"
    "blog-9-dangerous-goods.html"
    "blog-10-self-employed-logistics.html"
)

# Массив файлов для деплоя
deploy_files=(
    "${blog_articles[@]}"
    "blog/index.html"
)

echo ""
echo "📤 Загружаем исправленные файлы на сервер..."

# Загружаем все исправленные файлы
for file in "${deploy_files[@]}"; do
    echo "   📄 Загружаем: $file"
    scp -i ~/.ssh/id_ed25519 "$file" root@193.160.208.183:/www/wwwroot/avtogost77.ru/
done

echo ""
echo "✅ Все файлы загружены на сервер!"
echo "📊 Загружено файлов: ${#deploy_files[@]}"

echo ""
echo "🔄 Перезапускаем nginx..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "systemctl reload nginx"

echo ""
echo "🎯 Деплой завершен!"
echo "📋 Исправленные файлы:"
for file in "${deploy_files[@]}"; do
    echo "   - $file"
done

echo ""
echo "🚀 Следующие шаги:"
echo "1. Проверить доступность исправленных страниц"
echo "2. Отправить обновленный sitemap в поисковые системы"
echo "3. Запустить мониторинг индексации"
echo ""
echo "Готово! 🚛"
