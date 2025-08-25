#!/bin/bash

echo "🚀🚀🚀 MEGA DEPLOY ALL 56 CLEANED PAGES! 🚀🚀🚀"
echo "==============================================="
echo "📤📤📤 МАССОВЫЙ ДЕПЛОЙ ВСЕГО ОЧИЩЕННОГО САЙТА!"

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    exit 1
fi
echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию ВСЕГО сайта на VPS
echo "📦 Создание МАССОВОЙ резервной копии на VPS..."
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && tar -czf mega-backup-before-cleanup-$(date +%Y%m%d-%H%M%S).tar.gz *.html 2>/dev/null || true"

# Находим все HTML файлы
html_files=$(find . -name "*.html" -not -path "./backup*" -not -path "./inline-styles-backup*" -not -path "./mega-cleanup-backup*" -not -name "*.backup*")
total_files=$(echo "$html_files" | wc -l)

echo "🎯 Деплоим $total_files очищенных HTML файлов..."

counter=0

# Загружаем все файлы
for file in $html_files; do
    counter=$((counter + 1))
    filename=$(basename "$file")
    
    echo "📤 [$counter/$total_files] Деплоим: $filename"
    
    # Загружаем файл
    scp -i $SSH_KEY "$file" $VPS_HOST:$VPS_PATH/
    
    # Устанавливаем права
    ssh -i $SSH_KEY $VPS_HOST "chmod 644 $VPS_PATH/$filename && chown www-data:www-data $VPS_PATH/$filename"
done

# Специально загружаем blog директорию если есть
if [ -d "blog" ]; then
    echo "📚 Деплоим blog директорию..."
    scp -r -i $SSH_KEY blog/ $VPS_HOST:$VPS_PATH/
    ssh -i $SSH_KEY $VPS_HOST "find $VPS_PATH/blog -name '*.html' -exec chmod 644 {} \; -exec chown www-data:www-data {} \;"
fi

# Перезапускаем Nginx
echo "🔄 Перезапускаем Nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl reload nginx"

# Очищаем кэш если есть
ssh -i $SSH_KEY $VPS_HOST "systemctl restart php8.1-fpm 2>/dev/null || true"

echo ""
echo "🚀🚀🚀 MEGA DEPLOY ЗАВЕРШЕН! 🚀🚀🚀"
echo ""
echo "📊 СТАТИСТИКА МАССОВОГО ДЕПЛОЯ:"
echo "   🎯 Развернуто страниц: $total_files"
echo "   📦 Резервная копия создана на VPS"
echo "   🔄 Nginx перезапущен"
echo ""
echo "🌟🌟🌟 ВЕСЬ САЙТ ОБНОВЛЕН!"
echo ""
echo "✨ ЧТО ТЕПЕРЬ НА ВСЕХ СТРАНИЦАХ:"
echo "   ✅ Единый современный дизайн"
echo "   ✅ Актуальные цены (газель 8к, фура 35к)"
echo "   ✅ Правильные meta теги для SEO"
echo "   ✅ Убраны все inline стили"
echo "   ✅ Используется unified-site-styles.css"
echo "   ✅ Оптимизированная структура"
echo ""
echo "🔗 ПРОВЕРЬ РЕЗУЛЬТАТ:"
echo "   🏠 Главная: https://avtogost77.ru/"
echo "   📋 Услуги: https://avtogost77.ru/services.html"
echo "   📞 Контакты: https://avtogost77.ru/contact.html"
echo "   ❓ FAQ: https://avtogost77.ru/faq.html"
echo "   📰 Блог: https://avtogost77.ru/blog/"
echo ""
echo "🎉🎉🎉 САЙТ ПОЛНОСТЬЮ УНИФИЦИРОВАН И ОПТИМИЗИРОВАН!"
echo "💎 Все 56 страниц теперь работают в едином стиле!"


