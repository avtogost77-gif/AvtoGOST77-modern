#!/bin/bash

# Скрипт для исправления canonical URL на всех страницах
# Исправляет проблемы с canonical, которые Яндекс обнаружил

echo "🔧 Исправление canonical URL на всех страницах..."

# Создаем временную директорию для бэкапов
mkdir -p canonical-fix-backup-$(date +%Y%m%d-%H%M%S)

# Функция для исправления canonical URL
fix_canonical() {
    local file="$1"
    local filename=$(basename "$file")
    local backup_dir="canonical-fix-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Создаем бэкап
    cp "$file" "$backup_dir/"
    
    # Определяем правильный canonical URL
    local canonical_url=""
    
    case "$filename" in
        "index.html")
            canonical_url="https://avtogost77.ru/"
            ;;
        "services.html")
            canonical_url="https://avtogost77.ru/services.html"
            ;;
        "contact.html")
            canonical_url="https://avtogost77.ru/contact.html"
            ;;
        "about.html")
            canonical_url="https://avtogost77.ru/about.html"
            ;;
        "help.html")
            canonical_url="https://avtogost77.ru/help.html"
            ;;
        "faq.html")
            canonical_url="https://avtogost77.ru/faq.html"
            ;;
        "privacy.html")
            canonical_url="https://avtogost77.ru/privacy.html"
            ;;
        "terms.html")
            canonical_url="https://avtogost77.ru/terms.html"
            ;;
        "track.html")
            canonical_url="https://avtogost77.ru/track.html"
            ;;
        "urgent-delivery.html")
            canonical_url="https://avtogost77.ru/urgent-delivery.html"
            ;;
        "self-employed-delivery.html")
            canonical_url="https://avtogost77.ru/self-employed-delivery.html"
            ;;
        "ip-small-business-delivery.html")
            canonical_url="https://avtogost77.ru/ip-small-business-delivery.html"
            ;;
        "transportnaya-kompaniya.html")
            canonical_url="https://avtogost77.ru/transportnaya-kompaniya.html"
            ;;
        "sbornye-gruzy.html")
            canonical_url="https://avtogost77.ru/sbornye-gruzy.html"
            ;;
        "dostavka-na-marketpleysy.html")
            canonical_url="https://avtogost77.ru/dostavka-na-marketpleysy.html"
            ;;
        "rc-dostavka.html")
            canonical_url="https://avtogost77.ru/rc-dostavka.html"
            ;;
        "logistika-dlya-biznesa.html")
            canonical_url="https://avtogost77.ru/logistika-dlya-biznesa.html"
            ;;
        "gazel-gruzoperevozki.html")
            canonical_url="https://avtogost77.ru/gazel-gruzoperevozki.html"
            ;;
        "trehtonnik-gruzoperevozki.html")
            canonical_url="https://avtogost77.ru/trehtonnik-gruzoperevozki.html"
            ;;
        "pyatitonnik-gruzoperevozki.html")
            canonical_url="https://avtogost77.ru/pyatitonnik-gruzoperevozki.html"
            ;;
        "desyatitonnik-gruzoperevozki.html")
            canonical_url="https://avtogost77.ru/desyatitonnik-gruzoperevozki.html"
            ;;
        "fura-20-tonn-gruzoperevozki.html")
            canonical_url="https://avtogost77.ru/fura-20-tonn-gruzoperevozki.html"
            ;;
        "poputnyj-gruz.html")
            canonical_url="https://avtogost77.ru/poputnyj-gruz.html"
            ;;
        "dogruz.html")
            canonical_url="https://avtogost77.ru/dogruz.html"
            ;;
        "pereezd-moskva.html")
            canonical_url="https://avtogost77.ru/pereezd-moskva.html"
            ;;
        "perevozka-mebeli.html")
            canonical_url="https://avtogost77.ru/perevozka-mebeli.html"
            ;;
        "perevozka-medoborudovaniya.html")
            canonical_url="https://avtogost77.ru/perevozka-medoborudovaniya.html"
            ;;
        "gruzoperevozki-spb.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-spb.html"
            ;;
        "gruzoperevozki-ekaterinburg.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-ekaterinburg.html"
            ;;
        "gruzoperevozki-po-moskve.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-po-moskve.html"
            ;;
        "gruzoperevozki-iz-moskvy.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-iz-moskvy.html"
            ;;
        "gruzoperevozki-moskva-voronezh.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-voronezh.html"
            ;;
        "gruzoperevozki-moskva-spb.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-spb.html"
            ;;
        "gruzoperevozki-moskva-kursk.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-kursk.html"
            ;;
        "gruzoperevozki-moskva-lipetsk.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-lipetsk.html"
            ;;
        "gruzoperevozki-moskva-tambov.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-tambov.html"
            ;;
        "gruzoperevozki-moskva-orel.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-orel.html"
            ;;
        "gruzoperevozki-moskva-tula.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-tula.html"
            ;;
        "gruzoperevozki-moskva-belgorod.html")
            canonical_url="https://avtogost77.ru/gruzoperevozki-moskva-belgorod.html"
            ;;
        "blog-1-carrier-failed.html")
            canonical_url="https://avtogost77.ru/blog-1-carrier-failed.html"
            ;;
        "blog-2-wildberries-delivery.html")
            canonical_url="https://avtogost77.ru/blog-2-wildberries-delivery.html"
            ;;
        "blog-3-spot-orders.html")
            canonical_url="https://avtogost77.ru/blog-3-spot-orders.html"
            ;;
        "blog-4-remote-logistics.html")
            canonical_url="https://avtogost77.ru/blog-4-remote-logistics.html"
            ;;
        "blog-5-logistics-optimization.html")
            canonical_url="https://avtogost77.ru/blog-5-logistics-optimization.html"
            ;;
        "blog-6-marketplace-insider.html")
            canonical_url="https://avtogost77.ru/blog-6-marketplace-insider.html"
            ;;
        "blog-7-how-to-order-gazelle.html")
            canonical_url="https://avtogost77.ru/blog-7-how-to-order-gazelle.html"
            ;;
        "blog-8-cargo-insurance.html")
            canonical_url="https://avtogost77.ru/blog-8-cargo-insurance.html"
            ;;
        "blog-9-dangerous-goods.html")
            canonical_url="https://avtogost77.ru/blog-9-dangerous-goods.html"
            ;;
        "blog-10-self-employed-logistics.html")
            canonical_url="https://avtogost77.ru/blog-10-self-employed-logistics.html"
            ;;
        "news.html")
            canonical_url="https://avtogost77.ru/news.html"
            ;;
        "legal-minimum.html")
            canonical_url="https://avtogost77.ru/legal-minimum.html"
            ;;
        "404.html")
            canonical_url="https://avtogost77.ru/404.html"
            ;;
        *)
            # Для остальных файлов используем базовое имя
            canonical_url="https://avtogost77.ru/$filename"
            ;;
    esac
    
    # Заменяем canonical URL
    if [ -n "$canonical_url" ]; then
        # Удаляем старые canonical теги
        sed -i '/<link[^>]*rel="canonical"[^>]*>/d' "$file"
        
        # Добавляем правильный canonical тег после charset
        sed -i '/<meta charset="UTF-8">/a\    <link rel="canonical" href="'"$canonical_url"'">' "$file"
        
        echo "✅ Исправлен canonical для $filename: $canonical_url"
    else
        echo "⚠️  Не удалось определить canonical для $filename"
    fi
}

# Обрабатываем все HTML файлы в текущей директории
for file in *.html; do
    if [ -f "$file" ]; then
        fix_canonical "$file"
    fi
done

# Обрабатываем файлы в поддиректориях (кроме backup)
find . -name "*.html" -not -path "./backups/*" -not -path "./mega-cleanup-backup-*" -not -path "./inline-styles-backup/*" -not -path "./canonical-fix-backup-*" | while read file; do
    if [ -f "$file" ] && [ "$(dirname "$file")" != "." ]; then
        fix_canonical "$file"
    fi
done

echo ""
echo "✅ Исправление canonical URL завершено!"
echo "📁 Бэкапы сохранены в: canonical-fix-backup-$(date +%Y%m%d-%H%M%S)/"
echo ""
echo "📋 Проверьте несколько файлов для подтверждения исправлений:"
echo "   grep -n 'rel=\"canonical\"' index.html"
echo "   grep -n 'rel=\"canonical\"' services.html"
echo "   grep -n 'rel=\"canonical\"' gazel-gruzoperevozki.html"
