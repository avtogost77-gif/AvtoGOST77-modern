#!/bin/bash

echo "🚀 МАССОВАЯ ОПТИМИЗАЦИЯ СТРАНИЦ ПО ПЛАНУ GPT-5"
echo "================================================"

# Создаем бэкап
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r *.html "$BACKUP_DIR/"
echo "✅ Бэкап создан: $BACKUP_DIR"

# Список страниц для оптимизации
PAGES=(
    "index.html"
    "services.html"
    "contact.html"
    "sbornye-gruzy.html"
    "gruzoperevozki-spb.html"
    "gruzoperevozki-ekaterinburg.html"
    "gruzoperevozki-moskva-omsk.html"
    "moscow-spb-delivery.html"
    "blog-3-spot-orders.html"
)

echo ""
echo "📝 ОПТИМИЗАЦИЯ СТРАНИЦ:"

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "   🔧 Обрабатываю: $page"
        
        # 1. Убираем дубли critical-css
        sed -i '/<style id="critical-css">/,/<\/style>/d' "$page"
        
        # 2. Добавляем единый critical-css в head
        sed -i '/<title>/i\
    <!-- 🚨 КРИТИЧЕСКИЙ CSS ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ -->\
    <style id="critical-css">\
    /* Критический CSS загружается инлайн для устранения блокирующих ресурсов */\
    :root{--primary-color:#2D67F8;--text-dark:#1a1a1a;--text-gray:#666;--white:#ffffff;--border:#e0e0e0;}*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,BlinkMacSystemFont,\x27Segoe UI\x27,Roboto,sans-serif;line-height:1.6;color:var(--text-dark);overflow-x:hidden;}.container{max-width:1200px;margin:0 auto;padding:0 20px;}.header{background:var(--white);border-bottom:1px solid var(--border);padding:1rem 0;position:sticky;top:0;z-index:1000;box-shadow:0 2px 4px rgba(0,0,0,0.1);}.header-content{display:flex;align-items:center;justify-content:space-between;}.logo{display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:var(--text-dark);font-weight:700;font-size:1.25rem;}.logo-img{width:40px;height:40px;}.nav{display:none;}@media (min-width:768px){.nav{display:flex;gap:2rem;}}.nav-link{color:var(--text-dark);text-decoration:none;transition:color 0.3s;font-weight:500;}.nav-link:hover{color:var(--primary-color);}.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;transition:all 0.3s;border:none;cursor:pointer;font-size:1rem;}.btn-primary{background:var(--primary-color);color:var(--white);}.btn-primary:hover{background:#1e4fd8;transform:translateY(-1px);}.hero{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:4rem 0;position:relative;overflow:hidden;text-align:center;}.hero::before{content:\x27\x27;position:absolute;top:0;left:0;right:0;bottom:0;background:url(\x27data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\x27);opacity:0.3;}.hero-content{position:relative;z-index:2;max-width:800px;margin:0 auto;}.hero-title{font-size:2.5rem;font-weight:700;margin-bottom:1.5rem;line-height:1.2;}@media (min-width:768px){.hero-title{font-size:3.5rem;}}.hero-subtitle{font-size:1.25rem;margin-bottom:2rem;opacity:0.9;line-height:1.6;}.calculator-section{background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);padding:4rem 0;}.calculator-wrapper{max-width:800px;margin:0 auto;background:white;border-radius:16px;padding:3rem;box-shadow:0 10px 30px rgba(0,0,0,0.1);}.section-title{font-size:2rem;font-weight:700;text-align:center;margin-bottom:2rem;color:var(--text-dark);}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;}.form-group{position:relative;}.form-group label{display:block;margin-bottom:0.5rem;font-weight:600;color:var(--text-dark);}.form-control{width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:8px;font-size:1rem;transition:border-color 0.3s;}.form-control:focus{outline:none;border-color:var(--primary-color);}img,svg{max-width:100%;height:auto;}h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2;margin-bottom:1rem;}h1{font-size:2.5rem;}h2{font-size:2rem;}h3{font-size:1.5rem;}h4{font-size:1.25rem;}p{margin-bottom:1rem;line-height:1.6;}.grid{display:grid;gap:2rem;}@media (min-width:768px){.grid{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));}}.footer{background:var(--text-dark);color:var(--white);padding:3rem 0 1rem;margin-top:4rem;}@media (max-width:768px){.form-row{grid-template-columns:1fr;}.calculator-wrapper{padding:2rem;margin:0 1rem;}.hero{padding:3rem 0;}.hero-title{font-size:2rem;}.hero-subtitle{font-size:1.1rem;}}@media (prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;}}.loading{opacity:0;transition:opacity 0.3s;}.loaded{opacity:1;}\
    </style>' "$page"
        
        # 3. Заменяем множественные CSS на объединенный
        sed -i 's|assets/css/styles.css|assets/css/unified-main.min.css|g' "$page"
        sed -i 's|assets/css/main.css|assets/css/unified-main.min.css|g' "$page"
        
        # 4. Заменяем множественные JS на объединенный
        sed -i 's|assets/js/main.js|assets/js/unified-main.min.js|g' "$page"
        sed -i 's|assets/js/animated-counter.js|assets/js/unified-main.min.js|g' "$page"
        sed -i 's|assets/js/benefits-animations.js|assets/js/unified-main.min.js|g' "$page"
        
        echo "   ✅ Оптимизирована: $page"
    else
        echo "   ❌ Файл не найден: $page"
    fi
done

echo ""
echo "📊 СТАТИСТИКА ОПТИМИЗАЦИИ:"
echo "   - Объединенный CSS: $(ls -lh assets/css/unified-main.css | awk '{print $5}')"
echo "   - Объединенный JS: $(ls -lh assets/js/unified-main.js | awk '{print $5}')"
echo "   - Калькулятор (отдельно): $(ls -lh assets/js/calculator.js | awk '{print $5}')"

echo ""
echo "✅ ОПТИМИЗАЦИЯ ЗАВЕРШЕНА!"
echo "📝 Следующие шаги:"
echo "   1. Проверить внешний вид страниц"
echo "   2. Протестировать калькулятор"
echo "   3. Проверить PageSpeed"
echo "   4. Исправить JSON-LD (если нужно)"
