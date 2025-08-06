#!/bin/bash
# Скрипт для копирования недостающих папок с сервера

echo "📁 Копирование недостающих папок с сервера..."

# Копируем папки если их нет
if [ ! -d "routes" ]; then
    echo "Создаю заглушку для routes..."
    mkdir -p routes
    echo "Папка routes должна быть скопирована с сервера!"
fi

if [ ! -d "industries" ]; then
    echo "Создаю заглушку для industries..."
    mkdir -p industries
    echo "Папка industries должна быть скопирована с сервера!"
fi

if [ ! -d "calculators" ]; then
    echo "Создаю заглушку для calculators..."
    mkdir -p calculators
    echo "Папка calculators должна быть скопирована с сервера!"
fi

echo "✅ Готово! Теперь нужно:"
echo "1. Скопировать содержимое папок с сервера:"
echo "   scp -r user@server:/www/wwwroot/avtogost77.ru/routes/* ./routes/"
echo "   scp -r user@server:/www/wwwroot/avtogost77.ru/industries/* ./industries/"
echo "   scp -r user@server:/www/wwwroot/avtogost77.ru/calculators/* ./calculators/"
echo "2. Запустить prepare-deploy.sh для создания нового архива"
