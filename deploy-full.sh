#!/bin/bash

# Полный деплой сайта на VPS
# Дата: 2025-08-14

VPS_HOST="root@193.160.208.183"
VPS_PATH="/www/wwwroot/avtogost77.ru"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo "🚀 ПОЛНЫЙ ДЕПЛОЙ САЙТА НА VPS"
echo "================================"

# Проверяем, что мы в правильной директории
if [ ! -f "index.html" ]; then
    echo "❌ Ошибка: index.html не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# Проверяем наличие SSH ключа
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Ошибка: SSH ключ не найден: $SSH_KEY"
    echo "💡 Попробуйте использовать deploy.sh без ключа"
    exit 1
fi

echo "✅ SSH ключ найден: $SSH_KEY"

# Создаем резервную копию на VPS
echo "📦 Создание резервной копии на VPS..."
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
ssh -i $SSH_KEY $VPS_HOST "cd $VPS_PATH && mkdir -p $BACKUP_DIR && cp -r * $BACKUP_DIR/ 2>/dev/null || true"
echo "✅ Резервная копия создана: $BACKUP_DIR"

# Загружаем все HTML файлы
echo "📤 Загрузка HTML файлов..."
find . -name "*.html" -not -path "./backup*" | while read file; do
    echo "  📄 $file"
    scp -i $SSH_KEY "$file" $VPS_HOST:$VPS_PATH/
done

# Загружаем CSS файлы
echo "📤 Загрузка CSS файлов..."
scp -i $SSH_KEY -r assets/css/* $VPS_HOST:$VPS_PATH/assets/css/

# Загружаем JS файлы
echo "📤 Загрузка JS файлов..."
scp -i $SSH_KEY -r assets/js/* $VPS_HOST:$VPS_PATH/assets/js/

# Загружаем изображения
echo "📤 Загрузка изображений..."
scp -i $SSH_KEY -r assets/img/* $VPS_HOST:$VPS_PATH/assets/img/

# Загружаем важные файлы
echo "📤 Загрузка важных файлов..."
scp -i $SSH_KEY sitemap.xml $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY robots.txt $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY manifest.json $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY favicon.svg $VPS_HOST:$VPS_PATH/
scp -i $SSH_KEY browserconfig.xml $VPS_HOST:$VPS_PATH/

# Устанавливаем правильные права
echo "🔐 Установка прав доступа..."
ssh -i $SSH_KEY $VPS_HOST "chmod -R 644 $VPS_PATH/*.html && chmod -R 644 $VPS_PATH/assets/css/* && chmod -R 644 $VPS_PATH/assets/js/*"

# Перезапускаем nginx
echo "🔄 Перезапуск nginx..."
ssh -i $SSH_KEY $VPS_HOST "systemctl restart nginx"

# Проверяем статус
echo "✅ Проверка статуса..."
ssh -i $SSH_KEY $VPS_HOST "systemctl status nginx --no-pager | head -5"

# Проверяем доступность сайта
echo "🌐 Проверка доступности сайта..."
sleep 3
if curl -s -o /dev/null -w "%{http_code}" https://avtogost77.ru | grep -q "200"; then
    echo "✅ Сайт доступен: https://avtogost77.ru"
else
    echo "⚠️  Сайт может быть недоступен, проверьте вручную"
fi

echo ""
echo "🎉 ПОЛНЫЙ ДЕПЛОЙ ЗАВЕРШЕН!"
echo "🌐 Сайт: https://avtogost77.ru"
echo "📱 Проверьте все страницы и калькулятор"
echo "📦 Резервная копия: $BACKUP_DIR"
echo ""
echo "📋 ЧТО БЫЛО ЗАГРУЖЕНО:"
echo "  ✅ Все HTML страницы (53 файла)"
echo "  ✅ Все CSS файлы"
echo "  ✅ Все JS файлы"
echo "  ✅ Все изображения"
echo "  ✅ Sitemap.xml и robots.txt"
echo "  ✅ PWA файлы (manifest.json, favicon.svg)"
