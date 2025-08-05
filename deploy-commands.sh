#!/bin/bash
# Команды для деплоя на сервере avtogost77.ru

# 1. Переход в корневую директорию сайта
cd /www/wwwroot/avtogost77.ru

# 2. Создание полного бекапа текущей версии
echo "📦 Создание бекапа текущей версии..."
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz --exclude='backup-*' --exclude='*.zip' --exclude='.git' .

# 3. Проверка что бекап создан
ls -lah backup-*.tar.gz

# 4. Загрузка и распаковка новой версии
echo "📥 Распаковка новой версии..."
# Предполагаем что файл avtogost-deploy-*.zip уже загружен
unzip -o avtogost-deploy-*.zip

# 5. Копирование файлов с заменой
echo "📄 Обновление файлов..."
cp -rf avtogost-deploy-*/* .

# 6. Установка правильных прав доступа
echo "🔒 Установка прав доступа..."
chown -R www:www .
find . -type f -name "*.html" -exec chmod 644 {} \;
find . -type f -name "*.css" -exec chmod 644 {} \;
find . -type f -name "*.js" -exec chmod 644 {} \;
chmod 644 .htaccess
chmod 644 robots.txt
chmod 644 sitemap.xml

# 7. Очистка временных файлов
echo "🧹 Очистка..."
rm -rf avtogost-deploy-*
rm -f *.zip

# 8. Проверка новых страниц
echo "✅ Проверка новых SEO-страниц..."
ls -la | grep -E "(transportnaya|sbornye|marketpleysy|rc-dostavka|gruzoperevozki|logistika)" || echo "⚠️ Новые страницы не найдены!"

# 9. Вывод информации
echo ""
echo "📊 Статус после деплоя:"
echo "Размер сайта: $(du -sh . | cut -f1)"
echo "Всего HTML файлов: $(find . -name "*.html" -type f | wc -l)"
echo ""
echo "🔍 Проверьте:"
echo "1. https://avtogost77.ru/ - главная работает"
echo "2. https://avtogost77.ru/transportnaya-kompaniya - новая страница (без .html!)"
echo "3. https://avtogost77.ru/robots.txt - доступен"
echo "4. https://avtogost77.ru/sitemap.xml - доступен"