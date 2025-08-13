#!/bin/bash

# Скрипт для исправления страниц по городам/маршрутам согласно BRATISHKA-INSTRUCTION.md

echo "🔧 Исправление страниц по городам/маршрутам согласно BRATISHKA-INSTRUCTION.md"

# Список страниц по городам/маршрутам
CITY_PAGES=(
    "gruzoperevozki-spb.html"
    "gruzoperevozki-ekaterinburg.html"
    "gruzoperevozki-po-moskve.html"
    "gruzoperevozki-iz-moskvy.html"
    "gruzoperevozki-moskva-voronezh.html"
    "gruzoperevozki-moskva-spb.html"
    "gruzoperevozki-moskva-kursk.html"
    "gruzoperevozki-moskva-lipetsk.html"
    "gruzoperevozki-moskva-tambov.html"
    "gruzoperevozki-moskva-orel.html"
    "gruzoperevozki-moskva-tula.html"
    "gruzoperevozki-moskva-belgorod.html"
)

# Исправления для каждой страницы
for file in "${CITY_PAGES[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Исправляем $file..."
        
        # 1. Исправляем описание организации в Schema.org
        sed -i 's/"description": "Профессиональная транспортная компания, специализирующаяся на грузоперевозках по России. Быстрая подача транспорта, точный расчет стоимости, круглосуточная работа."/"description": "Инфраструктура вашего бизнеса. Специализируемся на грузоперевозках по России: отдельной машиной и сборные грузы. Быстрая подача транспорта, точный расчет стоимости."/g' "$file"
        
        # 2. Исправляем слоган
        sed -i 's/"slogan": "Доставим вовремя и безопасно"/"slogan": "Инфраструктура вашего бизнеса — пока вы занимаетесь бизнесом, мы решаем вопросы логистики"/g' "$file"
        
        # 3. Исправляем дату основания
        sed -i 's/"foundingDate": "2010"/"foundingDate": "2015"/g' "$file"
        
        # 4. Убираем выдуманные данные о количестве сотрудников
        sed -i '/"numberOfEmployees": {/,/}/d' "$file"
        
        # 5. Убираем "экспресс" и заменяем на "срочная"
        sed -i 's/экспресс доставка/срочная доставка/g' "$file"
        sed -i 's/Экспресс доставка/Срочная доставка/g' "$file"
        sed -i 's/экспресс-доставка/срочная доставка/g' "$file"
        sed -i 's/Экспресс-доставка/Срочная доставка/g' "$file"
        
        # 6. Убираем выдуманные цифры (более аккуратно)
        sed -i 's/более [0-9]* выполненных заказов/множество выполненных заказов/g' "$file"
        sed -i 's/[0-9]*% клиентов рекомендуют/клиенты рекомендуют/g' "$file"
        sed -i 's/[0-9]*% вовремя/вовремя/g' "$file"
        
        echo "✅ $file исправлен"
    else
        echo "⚠️ Файл $file не найден"
    fi
done

echo "🎯 Исправление страниц по городам/маршрутам завершено!"
echo "📋 Проверьте результаты и при необходимости внесите дополнительные правки вручную."
