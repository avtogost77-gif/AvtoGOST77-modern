#!/bin/bash
# Скрипт для создания страниц городов на основе шаблона Москва-Казань

echo "🚀 Создание страниц городов для расширения семантической базы..."

# Массив городов с их данными
declare -A cities=(
    ["nizhny-novgorod"]="Нижний Новгород|500|1-2 дня|грузоперевозки-москва-нижний-новгород"
    ["rostov"]="Ростов-на-Дону|1100|2-3 дня|грузоперевозки-москва-ростов"
    ["samara"]="Самара|900|2-3 дня|грузоперевозки-москва-самара"
    ["ufa"]="Уфа|1200|2-3 дня|грузоперевозки-москва-уфа"
    ["ekaterinburg"]="Екатеринбург|1800|3-4 дня|грузоперевозки-москва-екатеринбург"
    ["novosibirsk"]="Новосибирск|3100|4-5 дней|грузоперевозки-москва-новосибирск"
    ["krasnodar"]="Краснодар|1400|2-3 дня|грузоперевозки-москва-краснодар"
    ["chelyabinsk"]="Челябинск|1900|3-4 дня|грузоперевозки-москва-челябинск"
    ["omsk"]="Омск|2800|4-5 дней|грузоперевозки-москва-омск"
    ["perm"]="Пермь|1400|2-3 дня|грузоперевозки-москва-пермь"
)

# Создаем страницы для каждого города
for city_key in "${!cities[@]}"; do
    IFS='|' read -r city_name distance delivery_time filename <<< "${cities[$city_key]}"
    
    echo "📄 Создаем страницу: $city_name"
    
    # Создаем файл на основе шаблона
    cp gruzoperevozki-moskva-kazan.html "gruzoperevozki-moskva-$city_key.html"
    
    # Заменяем данные в файле
    sed -i "s/Казань/$city_name/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/800 км/$distance км/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/1-2 дня/$delivery_time/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/800/$distance/g" "gruzoperevozki-moskva-$city_key.html"
    
    # Обновляем title и description
    sed -i "s/Грузоперевозки Москва-Казань/Грузоперевозки Москва-$city_name/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/между Москвой и Казанью/между Москвой и $city_name/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/Москва-Казань/Москва-$city_name/g" "gruzoperevozki-moskva-$city_key.html"
    
    # Обновляем canonical URL
    sed -i "s/gruzoperevozki-moskva-kazan.html/gruzoperevozki-moskva-$city_key.html/g" "gruzoperevozki-moskva-$city_key.html"
    
    # Обновляем Schema.org разметку
    sed -i "s/Грузоперевозки Москва-Казань/Грузоперевозки Москва-$city_name/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/между Москвой и Казанью/между Москвой и $city_name/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/\"name\": \"Казань\"/\"name\": \"$city_name\"/g" "gruzoperevozki-moskva-$city_key.html"
    
    # Обновляем JavaScript калькулятор
    sed -i "s/const distance = 800;/const distance = $distance;/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/Москва-Казань/Москва-$city_name/g" "gruzoperevozki-moskva-$city_key.html"
    sed -i "s/route: 'moscow-kazan'/route: 'moscow-$city_key'/g" "gruzoperevozki-moskva-$city_key.html"
    
    echo "✅ Создана страница: gruzoperevozki-moskva-$city_key.html"
done

echo ""
echo "🎯 Создано ${#cities[@]} страниц городов!"
echo "📋 Список созданных файлов:"
for city_key in "${!cities[@]}"; do
    echo "   - gruzoperevozki-moskva-$city_key.html"
done

echo ""
echo "🚀 Следующие шаги:"
echo "1. Добавить новые страницы в sitemap.xml"
echo "2. Создать внутренние ссылки между страницами"
echo "3. Запустить деплой на сервер"
echo ""
echo "Готово к деплою! 🚛"
