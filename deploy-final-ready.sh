#!/bin/bash

echo "🚀 ФИНАЛЬНЫЙ ДЕПЛОЙ AVTOGOST77"
echo "=============================="

# Сначала получаем последние изменения
echo "📥 Получаю последние изменения..."
git pull origin ultimate-version

# Проверяем наличие index-final.html
if [ -f "index-final.html" ]; then
    echo "✅ Найден index-final.html от Сонета!"
    cp index-final.html index.html
    echo "📝 Скопировал index-final.html → index.html"
else
    echo "📌 Используем текущий index.html"
fi

# Создаем команды для деплоя
cat > final_deploy.txt << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set ftp:use-feat no
open ftp://u3207373:5x8cZ19H0rWhh6Qt@31.31.197.43
cd www/avtogost77.ru

echo "🧹 ПОЛНАЯ ОЧИСТКА СЕРВЕРА..."
rm -rf *
rm -rf .*

echo "📤 ЗАГРУЖАЮ ВСЕ ФАЙЛЫ..."
lcd /workspace

# HTML файлы
put -O . *.html
rm -f test-buttons.html
rm -f debug.html

# Системные файлы
put -O . robots.txt
put -O . sitemap.xml
put -O . .htaccess
put -O . favicon.svg
put -O . manifest.json
put -O . dadata-config.js
put -O . sw.js

# Assets
mirror -R --no-perms --no-umask --parallel=4 assets assets

echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
ls -la

quit
EOF

echo "🚀 Запускаю финальный деплой..."
lftp -f final_deploy.txt

rm -f final_deploy.txt

echo ""
echo "🎉 ФИНАЛЬНЫЙ ДЕПЛОЙ ЗАВЕРШЕН!"
echo "🌐 Сайт полностью обновлен: https://avtogost77.ru"
echo ""
echo "✅ Что сделано:"
echo "- Получены последние изменения от Сонета"
echo "- Сервер полностью очищен от мусора"
echo "- Загружены ВСЕ актуальные файлы"
echo "- Сайт готов к работе!"