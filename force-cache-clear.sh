#!/bin/bash
# Скрипт для принудительной очистки кэша

echo "🧹 ПРИНУДИТЕЛЬНАЯ ОЧИСТКА КЭША..."

echo ""
echo "🔧 Обновление версий CSS и JS файлов..."

# Обновляем версии CSS файлов для принудительной очистки кэша
sed -i 's|master-styles.min.css?v=20250825-clean|master-styles.min.css?v=20250826-urgent|g' index.html
sed -i 's|unified-site-styles.css?v=20250825-clean|unified-site-styles.css?v=20250826-urgent|g' index.html
sed -i 's|critical-fixes.css?v=20250825-urgent-fix|critical-fixes.css?v=20250826-urgent|g' index.html

# Обновляем версии в посадочной странице блога
sed -i 's|master-styles.min.css?v=20250825-clean|master-styles.min.css?v=20250826-urgent|g' blog/index.html
sed -i 's|unified-site-styles.css?v=20250825-clean|unified-site-styles.css?v=20250826-urgent|g' blog/index.html

echo ""
echo "🚀 Деплой с обновленными версиями..."

# Деплоим обновленные файлы
scp -i ~/.ssh/id_ed25519 index.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/
scp -i ~/.ssh/id_ed25519 blog/index.html root@193.160.208.183:/www/wwwroot/avtogost77.ru/blog/

echo ""
echo "🔄 Перезапуск nginx..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "systemctl reload nginx"

echo ""
echo "🧹 Очистка кэша на сервере..."
ssh -i ~/.ssh/id_ed25519 root@193.160.208.183 "rm -rf /var/cache/nginx/*"

echo ""
echo "✅ Кэш очищен!"
echo "📊 Проверьте главную страницу: https://avtogost77.ru/"
echo "📊 Проверьте блог: https://avtogost77.ru/blog/"
echo ""
echo "💡 Если проблема остается, попробуйте:"
echo "   1. Очистить кэш браузера (Ctrl+F5)"
echo "   2. Открыть в режиме инкогнито"
echo "   3. Проверить с другого устройства"
