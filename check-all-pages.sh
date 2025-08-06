#!/bin/bash

echo "🔍 Проверка всех страниц из sitemap..."
echo "=================================="

# Массив всех URL из sitemap
URLS=(
    "/"
    "/transportnaya-kompaniya.html"
    "/sbornye-gruzy.html"
    "/dostavka-na-marketpleysy.html"
    "/rc-dostavka.html"
    "/gruzoperevozki-spb.html"
    "/gruzoperevozki-ekaterinburg.html"
    "/logistika-dlya-biznesa.html"
    "/gruzoperevozki-po-moskve.html"
    "/gruzoperevozki-iz-moskvy.html"
    "/blog-7-how-to-order-gazelle.html"
    "/blog-8-cargo-insurance.html"
    "/blog-9-dangerous-goods.html"
    "/blog-10-self-employed-logistics.html"
    "/services.html"
    "/about.html"
    "/contact.html"
    "/help.html"
    "/faq.html"
    "/privacy.html"
    "/terms.html"
    "/track.html"
    "/blog-1-carrier-failed.html"
    "/blog-2-wildberries-delivery.html"
    "/blog-3-spot-orders.html"
    "/blog-4-remote-logistics.html"
    "/blog-5-logistics-optimization.html"
    "/blog-6-marketplace-insider.html"
    "/urgent-delivery/"
    "/ip-small-business-delivery/"
    "/self-employed-delivery/"
    "/blog/"
    "/blog/gruzoporevozki-moskva-spb/"
    "/calculators/"
    "/industries/"
    "/routes/kazan/"
    "/routes/moskva/"
    "/routes/nizhniy-novgorod/"
    "/routes/samara/"
    "/routes/spb/"
    "/routes/voronezh/"
    "/routes/kazan/kazan-moskva/"
    "/routes/kazan/kazan-nizhniy-novgorod/"
    "/routes/kazan/kazan-samara/"
    "/routes/moskva/moskva-belgorod/"
    "/routes/moskva/moskva-belye-stolby/"
    "/routes/moskva/moskva-bryansk/"
    "/routes/moskva/moskva-chelyabinsk/"
    "/routes/moskva/moskva-ekaterinburg/"
    "/routes/moskva/moskva-elektrostal/"
    "/routes/moskva/moskva-ivanovo/"
    "/routes/moskva/moskva-kaluga/"
    "/routes/moskva/moskva-kazan/"
    "/routes/moskva/moskva-koledinovo/"
    "/routes/moskva/moskva-kostroma/"
    "/routes/moskva/moskva-kursk/"
    "/routes/moskva/moskva-lipetsk/"
    "/routes/moskva/moskva-murom/"
    "/routes/moskva/moskva-nizhniy-novgorod/"
    "/routes/moskva/moskva-orel/"
    "/routes/moskva/moskva-penza/"
    "/routes/moskva/moskva-podolsk/"
    "/routes/moskva/moskva-rostov/"
    "/routes/moskva/moskva-ryazan/"
    "/routes/moskva/moskva-rybinsk/"
    "/routes/moskva/moskva-samara/"
    "/routes/moskva/moskva-saransk/"
    "/routes/moskva/moskva-smolensk/"
    "/routes/moskva/moskva-spb/"
    "/routes/moskva/moskva-tambov/"
    "/routes/moskva/moskva-tula/"
    "/routes/moskva/moskva-tver-ozon/"
    "/routes/moskva/moskva-tver/"
    "/routes/moskva/moskva-vladimir/"
    "/routes/moskva/moskva-voronezh/"
    "/routes/moskva/moskva-yaroslavl/"
    "/routes/nizhniy-novgorod/nizhniy-novgorod-kazan/"
    "/routes/nizhniy-novgorod/nizhniy-novgorod-moskva/"
    "/routes/samara/samara-kazan/"
    "/routes/samara/samara-moskva/"
    "/routes/spb/spb-moskva/"
    "/routes/voronezh/voronezh-moskva/"
    "/industries/agricultural/"
    "/industries/automotive/"
    "/industries/ecommerce/"
    "/industries/promyshlennost/"
    "/industries/retail/"
    "/industries/stroitelstvo/"
    "/calculators/skolko-stoit-perevozka-mebeli/"
    "/calculators/skolko-stoit-kvartirnyj-pereezd/"
    "/calculators/skolko-stoit-perevozka-pianino/"
    "/calculators/skolko-stoit-perevezti-mashinu/"
    "/calculators/skolko-stoit-dostavka-stroymaterialov/"
    "/calculators/skolko-stoit-gruzovoe-taksi/"
)

# Счетчики
FOUND=0
NOT_FOUND=0

echo "Проверяю ${#URLS[@]} страниц..."
echo ""

# Проверка каждого URL
for url in "${URLS[@]}"; do
    # Убираем начальный слеш для проверки файла
    file_path="${url#/}"
    
    # Если URL заканчивается на /, добавляем index.html
    if [[ "$file_path" == */ ]]; then
        file_path="${file_path}index.html"
    fi
    
    # Проверяем существование файла
    if [ -f "$file_path" ]; then
        echo "✅ $url -> $file_path"
        ((FOUND++))
    else
        echo "❌ $url -> $file_path (НЕ НАЙДЕН!)"
        ((NOT_FOUND++))
    fi
done

echo ""
echo "=================================="
echo "📊 ИТОГО:"
echo "✅ Найдено: $FOUND"
echo "❌ Не найдено: $NOT_FOUND"
echo "=================================="

if [ $NOT_FOUND -gt 0 ]; then
    echo ""
    echo "⚠️  ВНИМАНИЕ: $NOT_FOUND страниц отсутствуют!"
    echo "Это вызовет 404 ошибки в Google!"
fi