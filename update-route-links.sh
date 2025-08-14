#!/bin/bash

# Функция для добавления блока "Другие маршруты" в файл
update_route_links() {
    local file=$1
    local current_route=$(basename "$file" .html | sed 's/gruzoperevozki-moskva-//')
    echo "Processing $file..."
    
    # Создаем временный файл
    local temp_file=$(mktemp)
    
    # Копируем содержимое до </main>
    sed '/<\/main>/,$d' "$file" > "$temp_file"
    
    # Добавляем блок с другими маршрутами
    cat >> "$temp_file" << EOL
<section class="other-routes">
    <div class="container">
        <h2>Другие маршруты</h2>
        <div class="route-cards">
EOL
    
    # Добавляем карточки маршрутов
    for route_file in gruzoperevozki-moskva-*.html; do
        local route=$(basename "$route_file" .html | sed 's/gruzoperevozki-moskva-//')
        if [ "$route" != "$current_route" ]; then
            case "$route" in
                "spb") route_name="Санкт-Петербург";;
                "orel") route_name="Орёл";;
                "voronezh") route_name="Воронеж";;
                "kursk") route_name="Курск";;
                "tula") route_name="Тула";;
                "lipetsk") route_name="Липецк";;
                "krasnodar") route_name="Краснодар";;
                "belgorod") route_name="Белгород";;
                "tambov") route_name="Тамбов";;
                *) route_name="$route";;
            esac
            cat >> "$temp_file" << EOL
            <a href="gruzoperevozki-moskva-$route.html" class="route-card">
                <h3>Москва — $route_name</h3>
                <div class="route-info">
                    <div class="route-stat">
                        <strong>от 5000₽</strong>
                        <span>Стоимость</span>
                    </div>
                    <div class="route-stat">
                        <strong>24/7</strong>
                        <span>Режим работы</span>
                    </div>
                </div>
            </a>
EOL
        fi
    done
    
    # Закрываем блок и добавляем оставшуюся часть файла
    cat >> "$temp_file" << EOL
        </div>
    </div>
</section>
</main>
EOL
    
    # Добавляем оставшуюся часть файла после </main>
    sed '1,/<\/main>/d' "$file" >> "$temp_file"
    
    # Заменяем оригинальный файл
    mv "$temp_file" "$file"
    
    echo "✅ Processed $file"
}

# Обрабатываем все файлы маршрутов
for file in gruzoperevozki-moskva-*.html; do
    update_route_links "$file"
done

echo "🎯 All files processed!"