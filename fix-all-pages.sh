#!/bin/bash

echo "🔧 МАССОВОЕ ИСПРАВЛЕНИЕ ВСЕХ СТРАНИЦ"
echo "====================================="

# Список основных страниц для обновления (без блогов)
PAGES=(
    "about.html"
    "contact.html"
    "desyatitonnik-gruzoperevozki.html"
    "dostavka-na-marketpleysy.html"
    "faq.html"
    "gruzoperevozki-moskva-belgorod.html"
    "gruzoperevozki-moskva-kursk.html"
    "gruzoperevozki-moskva-lipetsk.html"
    "gruzoperevozki-moskva-tula.html"
    "gruzoperevozki-moskva-voronezh.html"
    "gruzoperevozki-moskva-orel.html"
    "gruzoperevozki-moskva-spb.html"
    "help.html"
    "legal-minimum.html"
    "logistika-dlya-biznesa.html"
    "news.html"
    "privacy.html"
    "terms.html"
    "transportnaya-kompaniya.html"
    "urgent-delivery.html"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "📝 Обновляем $page..."
        
        # Добавляем новый CSS если его нет
        if ! grep -q "calculator-modern.css" "$page"; then
            sed -i '/<link rel="stylesheet" href="assets\/css\/unified-styles.min.css"/a \    <link rel="stylesheet" href="assets/css/calculator-modern.css?v=20250813-new">' "$page"
        fi
        
        # Обновляем калькулятор если его нет
        if ! grep -q "smart-calculator-v2.js" "$page"; then
            sed -i '/<script src="assets\/js\/main.js"/a \    <script src="assets/js/smart-calculator-v2.js?v=20250813-fixed" async></script>\n    <script src="assets/js/calculator-ui.js?v=20250813-new" async></script>' "$page"
        fi
        
        # Добавляем mobile-collapse.js если его нет
        if ! grep -q "mobile-collapse.js" "$page"; then
            sed -i '/<script src="assets\/js\/main.js"/a \    <script src="assets/js/mobile-collapse.js" defer></script>' "$page"
        fi
        
        echo "✅ $page обновлен"
    else
        echo "❌ $page не найден"
    fi
done

echo ""
echo "🎉 МАССОВОЕ ОБНОВЛЕНИЕ ЗАВЕРШЕНО!"
echo "====================================="

