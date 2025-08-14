#!/bin/bash

# Функция для исправления ссылок на маршруты в файле
fix_route_links() {
    local file=$1
    echo "Processing $file..."
    
    # Заменяем несуществующие маршруты на существующие
    sed -i 's/gruzoperevozki-moskva-yaroslavl\.html/gruzoperevozki-moskva-spb.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-ivanovo\.html/gruzoperevozki-moskva-voronezh.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-kostroma\.html/gruzoperevozki-moskva-kursk.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-vologda\.html/gruzoperevozki-moskva-tula.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-tver\.html/gruzoperevozki-moskva-lipetsk.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-vladimir\.html/gruzoperevozki-moskva-krasnodar.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-ryazan\.html/gruzoperevozki-moskva-belgorod.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-kaluga\.html/gruzoperevozki-moskva-tambov.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-ekaterinburg\.html/gruzoperevozki-moskva-spb.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-nizhnij-novgorod\.html/gruzoperevozki-moskva-voronezh.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-kazan\.html/gruzoperevozki-moskva-kursk.html/g' "$file"
    sed -i 's/gruzoperevozki-moskva-rostov\.html/gruzoperevozki-moskva-tula.html/g' "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все HTML файлы
find . -name "*.html" -type f | while read -r file; do
    fix_route_links "$file"
done

echo "🎯 All files processed!"
