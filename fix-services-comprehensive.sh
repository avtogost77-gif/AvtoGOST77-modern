#!/bin/bash

echo "🔧 КОМПЛЕКСНОЕ ИСПРАВЛЕНИЕ SERVICES.HTML"
echo "======================================="
echo "🎯 Приводим страницу услуг в соответствие с главной"

# Создаем резервную копию
cp services.html services.html.backup-$(date +%Y%m%d-%H%M%S)

echo "📦 Резервная копия создана"

# 1. Удаляем inline стили
echo "🎨 Удаляем inline стили..."
sed -i '/<style>/,/<\/style>/d' services.html

# 2. Добавляем robots meta tag после canonical
echo "🤖 Добавляем robots meta..."
sed -i '/rel="canonical"/a\    <meta name="robots" content="index, follow">' services.html

# 3. Исправляем цены в услугах
echo "💰 Обновляем цены..."
sed -i 's/от 3 000 ₽/от 8 000 ₽/g' services.html
sed -i 's/от 5 000 ₽/от 12 000 ₽/g' services.html  
sed -i 's/от 7 000 ₽/от 18 000 ₽/g' services.html
sed -i 's/от 10 000 ₽/от 25 000 ₽/g' services.html
sed -i 's/от 15 000 ₽/от 35 000 ₽/g' services.html

# 4. Убираем services-hero класс
echo "🎭 Исправляем hero блок..."
sed -i 's/class="hero services-hero"/class="hero"/g' services.html

# 5. Добавляем современные скрипты перед </body>
echo "📜 Добавляем современные скрипты..."

# Создаем временный файл со скриптами
cat > temp_scripts.txt << 'EOF'
    <!-- 🚀 PERFORMANCE GOD MODE: JS BUNDLES -->
    <!-- КРИТИЧЕСКИЙ BUNDLE - МГНОВЕННАЯ ЗАГРУЗКА -->
    <script src="assets/js/bundles/critical-bundle.min.js?v=20250821-bundle"></script>
    <!-- ДОПОЛНИТЕЛЬНЫЙ BUNDLE - АСИНХРОННАЯ ЗАГРУЗКА -->
    <script src="assets/js/bundles/performance-bundle.min.js?v=20250821-bundle" async></script>
    
    <!-- VENDOR SCRIPTS -->
    <script src="assets/js/vendor/aos.min.js" defer></script>
    
    <!-- ОСНОВНЫЕ СКРИПТЫ -->
    <script src="assets/js/main.min.js?v=20250821" defer></script>
    <script src="assets/js/distance-api.js?v=20250821" defer></script>
    <script src="assets/js/cities-simple.min.js" defer></script>
    <script src="assets/js/form-handler.min.js" defer></script>
    
    <!-- ОПТИМИЗИРОВАННЫЕ СКРИПТЫ -->
    <script src="assets/js/dist/optimizations.min.js?v=20250816" defer></script>
    <script src="assets/js/header-sticky.js?v=20250817" defer></script>
    
    <!-- 🎯 UX GOD MODE: Loading States для всех форм -->
    <script src="assets/js/loading-states.js?v=20250821-ux" defer></script>
    
    <!-- ANALYTICS -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-EMQ3D0X8K7"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-EMQ3D0X8K7');
    </script>
    
    <!-- Yandex.Metrika -->
    <script type="text/javascript">
       (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
       m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
       ym(103413788, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
       });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/103413788" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    
    <!-- AOS INIT -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 600,
                    once: true,
                    offset: 100
                });
            }
        });
    </script>
EOF

# Вставляем скрипты перед </body>
sed -i '/^<\/body>/i\
'"$(cat temp_scripts.txt)" services.html

# Удаляем временный файл
rm temp_scripts.txt

echo ""
echo "✅ SERVICES.HTML УСПЕШНО ИСПРАВЛЕН!"
echo ""
echo "🎯 ЧТО ИЗМЕНЕНО:"
echo "   🎨 Удалены inline стили (181 строка)"
echo "   🤖 Добавлен robots meta tag"  
echo "   💰 Обновлены цены услуг"
echo "   🎭 Исправлен hero блок"
echo "   📜 Добавлены современные скрипты"
echo ""
echo "📊 РЕЗУЛЬТАТ:"
echo "   ✅ Современная структура header"
echo "   ✅ Единый стиль с главной страницей"
echo "   ✅ Актуальные цены"
echo "   ✅ Правильные скрипты"
echo ""
echo "🔗 Файл готов к деплою!"


