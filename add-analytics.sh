#!/bin/bash

# Скрипт для добавления Google Analytics и Яндекс.Метрики на страницы без аналитики

ANALYTICS_CODE='    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-EMQ3D0X8K7"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('\''js'\'', new Date());
        gtag('\''config'\'', '\''G-EMQ3D0X8K7'\'');
    </script>
    
    <!-- Яндекс.Метрика -->
    <script type="text/javascript">
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(103413788, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    </script>
    <noscript><div><img loading="lazy" src="https://mc.yandex.ru/watch/103413788" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    
    <!-- Цели для страницы -->
    <script>
        document.addEventListener('\''DOMContentLoaded'\'', function() {
            // Цели для телефона
            document.querySelectorAll('\''a[href^="tel:"]'\'').forEach(function(link){
                link.addEventListener('\''click'\'', function(){
                    if (typeof ym !== '\''undefined'\'') {
                        ym(103413788, '\''reachGoal'\'', '\''phone_click'\'', { from: window.location.pathname.replace('\''/'\'', '\'''\'').replace('\''.html'\'', '\'''\'') });
                    }
                });
            });
            
            // Цели для WhatsApp
            document.querySelectorAll('\''a[href*="wa.me"]'\'').forEach(function(link){
                link.addEventListener('\''click'\'', function(){
                    if (typeof ym !== '\''undefined'\'') {
                        ym(103413788, '\''reachGoal'\'', '\''whatsapp_click'\'', { from: window.location.pathname.replace('\''/'\'', '\'''\'').replace('\''.html'\'', '\'''\'') });
                    }
                });
            });
        });
    </script>'

# Список файлов без аналитики (исключая backup и несуществующие)
FILES=(
    "gazel-gruzoperevozki.html"
    "gruzoperevozki-moskva-tambov.html"
    "blog-10-self-employed-logistics.html"
    "blog-7-how-to-order-gazelle.html"
    "desyatitonnik-gruzoperevozki.html"
    "perevozka-mebeli.html"
    "perevozka-medoborudovaniya.html"
    "pyatitonnik-gruzoperevozki.html"
    "trehtonnik-gruzoperevozki.html"
    "gruzoperevozki-moskva-lipetsk.html"
    "legal-minimum.html"
    "gruzoperevozki-moskva-kursk.html"
    "fura-20-tonn-gruzoperevozki.html"
    "rc-dostavka.html"
    "gruzoperevozki-moskva-orel.html"
    "gruzoperevozki-moskva-spb.html"
    "blog/index.html"
)

echo "Добавляем аналитику на страницы..."

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Обрабатываем: $file"
        
        # Проверяем, есть ли уже аналитика
        if ! grep -q "gtag\|ym(" "$file"; then
            # Добавляем аналитику перед закрывающим тегом body
            sed -i "s|</body>|$ANALYTICS_CODE\n</body>|" "$file"
            echo "  ✅ Аналитика добавлена"
        else
            echo "  ⚠️  Аналитика уже есть"
        fi
    else
        echo "  ❌ Файл не найден: $file"
    fi
done

echo "Готово!"
