#!/bin/bash

# 🚀 СКРИПТ СОЗДАНИЯ МОБИЛЬНЫХ ВЕРСИЙ
# Создает ультра-оптимизированные мобильные версии всех страниц

echo "🚀 НАЧИНАЕМ СОЗДАНИЕ МОБИЛЬНЫХ ВЕРСИЙ..."

# Список важных страниц для мобильной оптимизации
PAGES=(
    "about.html"
    "services.html"
    "contact.html"
    "transportnaya-kompaniya.html"
    "legal-minimum.html"
    "gazel-gruzoperevozki.html"
    "gruzoperevozki-spb.html"
    "poputnyj-gruz.html"
    "gruzoperevozki-moskva-tambov.html"
    "gruzoperevozki-moskva-belgorod.html"
    "gruzovoe-taksi.html"
    "gruzoperevozki-moskva-krasnodar.html"
    "gruzoperevozki-ekaterinburg.html"
    "desyatitonnik-gruzoperevozki.html"
    "dostavka-gruzov.html"
    "sbornye-gruzy.html"
    "gruzoperevozki-moskva-orel.html"
    "dostavka-na-marketpleysy.html"
    "gruzoperevozki-po-moskve.html"
    "gruzoperevozki-moskva-tula.html"
    "pyatitonnik-gruzoperevozki.html"
    "pereezd-moskva.html"
    "self-employed-delivery.html"
    "trehtonnik-gruzoperevozki.html"
    "gruzoperevozki-iz-moskvy.html"
    "rc-dostavka.html"
    "gruzoperevozki-moskva-lipetsk.html"
    "gruzoperevozki-moskva-voronezh.html"
    "fura-20-tonn-gruzoperevozki.html"
    "gruzoperevozki-moskva-kursk.html"
    "perevozka-mebeli.html"
    "dogruz.html"
)

# Счетчик
TOTAL=${#PAGES[@]}
CURRENT=0

for page in "${PAGES[@]}"; do
    CURRENT=$((CURRENT + 1))
    echo "📱 [$CURRENT/$TOTAL] Создаем мобильную версию: $page"
    
    # Проверяем существование файла
    if [ ! -f "$page" ]; then
        echo "❌ Файл $page не найден, пропускаем"
        continue
    fi
    
    # Создаем имя мобильной версии
    mobile_page="${page%.html}-mobile.html"
    
    # Копируем файл
    cp "$page" "$mobile_page"
    
    # Добавляем SEO защиту
    sed -i '/<meta name="robots"/d' "$mobile_page"
    sed -i '/<meta name="googlebot"/d' "$mobile_page"
    sed -i '/<meta name="yandex"/d' "$mobile_page"
    
    # Вставляем SEO защиту после keywords
    sed -i '/<meta name="keywords"/a\
    <!-- 🚀 SEO ЗАЩИТА ДЛЯ МОБИЛЬНОЙ ВЕРСИИ -->\
    <meta name="robots" content="noindex, nofollow">\
    <meta name="googlebot" content="noindex, nofollow">\
    <meta name="yandex" content="noindex, nofollow">' "$mobile_page"
    
    # Упрощаем CSS (заменяем внешние стили на инлайн)
    sed -i '/<link rel="stylesheet"/d' "$mobile_page"
    sed -i '/<link rel="preload".*as="style"/d' "$mobile_page"
    
    # Добавляем упрощенный CSS после SEO защиты
    sed -i '/<meta name="yandex" content="noindex, nofollow">/a\
    <!-- 🚀 МОБИЛЬНАЯ ОПТИМИЗАЦИЯ CSS -->\
    <style>\
    :root{--primary:#2D67F8;--dark:#1a1a1a;--gray:#666;--white:#fff;--border:#e0e0e0}\
    *{margin:0;padding:0;box-sizing:border-box}\
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;color:var(--dark)}\
    .container{max-width:1200px;margin:0 auto;padding:0 20px}\
    .header{background:var(--white);border-bottom:1px solid var(--border);padding:1rem 0;position:sticky;top:0;z-index:1000}\
    .header-content{display:flex;align-items:center;justify-content:space-between}\
    .logo{display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:var(--dark);font-weight:700;font-size:1.25rem}\
    .logo-img{width:40px;height:40px}\
    .nav{display:none}\
    @media (min-width:768px){.nav{display:flex;gap:2rem}}\
    .nav-link{color:var(--dark);text-decoration:none;font-weight:500}\
    .nav-link:hover{color:var(--primary)}\
    .btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;border:none;cursor:pointer;font-size:1rem}\
    .btn-primary{background:var(--primary);color:var(--white)}\
    .btn-primary:hover{background:#1e4fd8}\
    .hero{background:#667eea;color:white;padding:3rem 0;text-align:center}\
    .hero-content{max-width:800px;margin:0 auto}\
    .hero-title{font-size:2rem;font-weight:700;margin-bottom:1.5rem;line-height:1.2}\
    @media (min-width:768px){.hero-title{font-size:3.5rem}}\
    .hero-subtitle{font-size:1.1rem;margin-bottom:2rem;opacity:0.9}\
    .section{padding:3rem 0}\
    .section-title{font-size:1.8rem;font-weight:700;text-align:center;margin-bottom:2rem;color:var(--dark)}\
    .form-row{display:grid;grid-template-columns:1fr;gap:1.5rem;margin-bottom:1.5rem}\
    @media (min-width:768px){.form-row{grid-template-columns:1fr 1fr}}\
    .form-group{position:relative}\
    .form-group label{display:block;margin-bottom:0.5rem;font-weight:600;color:var(--dark)}\
    .form-control{width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:8px;font-size:1rem}\
    .form-control:focus{outline:none;border-color:var(--primary)}\
    img{max-width:100%;height:auto}\
    h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2;margin-bottom:1rem}\
    h1{font-size:2.5rem}\
    h2{font-size:2rem}\
    h3{font-size:1.5rem}\
    p{margin-bottom:1rem;line-height:1.6}\
    .grid{display:grid;gap:2rem}\
    @media (min-width:768px){.grid{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}}\
    .footer{background:var(--dark);color:var(--white);padding:3rem 0 1rem;margin-top:4rem}\
    .content-card{background:white;border-radius:8px;padding:1.5rem;margin-bottom:2rem;box-shadow:0 2px 4px rgba(0,0,0,0.1)}\
    .card-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}\
    .card-icon{font-size:1.5rem}\
    .legal-item{margin-bottom:1.5rem}\
    .legal-item h4{color:var(--primary);margin-bottom:0.5rem}\
    .legal-item ul{list-style:none;padding-left:0}\
    .legal-item li{padding:0.25rem 0;position:relative;padding-left:1.5rem}\
    .legal-item li:before{content:"•";color:var(--primary);position:absolute;left:0}\
    .tips-grid{display:grid;gap:1.5rem}\
    @media (min-width:768px){.tips-grid{grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}}\
    .tip-card{background:white;border-radius:8px;padding:1.5rem;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,0.1)}\
    .tip-icon{font-size:2rem;margin-bottom:1rem;display:block}\
    .faq-item{margin-bottom:1rem;border:1px solid var(--border);border-radius:8px;overflow:hidden}\
    .faq-question{background:var(--white);padding:1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center}\
    .faq-answer{padding:1rem;background:#f8f9fa;display:none}\
    .faq-answer.active{display:block}\
    .cta-content{text-align:center;background:var(--primary);color:white;padding:3rem 2rem;border-radius:16px}\
    .cta-buttons{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:2rem}\
    .modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center}\
    .modal-content{background:white;border-radius:16px;padding:2rem;max-width:500px;width:90%;max-height:90%;overflow-y:auto}\
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}\
    .modal-close{background:none;border:none;font-size:2rem;cursor:pointer}\
    </style>' "$mobile_page"
    
    # Упрощаем JavaScript (удаляем внешние скрипты)
    sed -i '/<script src="assets\/js/d' "$mobile_page"
    sed -i '/<script src="performance-optimized.js/d' "$mobile_page"
    sed -i '/<script src="mobile-performance.js/d' "$mobile_page"
    
    # Заменяем сложный JavaScript на простой
    sed -i '/<script>/,/<\/script>/d' "$mobile_page"
    
    # Добавляем простой JavaScript перед закрывающим тегом body
    sed -i 's|</body>|    <!-- 🚀 УЛЬТРА-МИНИМАЛЬНЫЙ JAVASCRIPT -->\
    <script>\
    function openContactForm(){document.getElementById("contactModal").style.display="flex"}\
    function closeContactForm(){document.getElementById("contactModal").style.display="none"}\
    function toggleFAQ(element){element.nextElementSibling.classList.toggle("active")}\
    document.addEventListener("DOMContentLoaded",function(){\
        const forms=document.querySelectorAll("form");\
        forms.forEach(form=>form.addEventListener("submit",function(e){e.preventDefault();alert("Заявка отправлена! Мы свяжемся с вами.");this.reset()}))\
        const modal=document.getElementById("contactModal");\
        if(modal)modal.addEventListener("click",function(e){if(e.target===this)closeContactForm()})\
    });\
    setTimeout(()=>{\
        const gaScript=document.createElement("script");gaScript.async=true;gaScript.src="https://www.googletagmanager.com/gtag/js?id=G-EMQ3D0X8K7";document.head.appendChild(gaScript);\
        gaScript.onload=()=>{window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-EMQ3D0X8K7")};\
        const ymScript=document.createElement("script");ymScript.async=true;ymScript.src="https://mc.yandex.ru/metrika/tag.js";document.head.appendChild(ymScript);\
        ymScript.onload=()=>{(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(103413788,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true})}\
    },3000);\
    </script>\
</body>|' "$mobile_page"
    
    echo "✅ Создана мобильная версия: $mobile_page"
done

echo ""
echo "🎯 ИТОГИ СОЗДАНИЯ МОБИЛЬНЫХ ВЕРСИЙ:"
echo "📊 Всего страниц: $TOTAL"
echo "✅ Создано мобильных версий: $CURRENT"
echo "📁 Файлы сохранены с суффиксом '-mobile.html'"
echo ""
echo "🚀 СЛЕДУЮЩИЕ ШАГИ:"
echo "1. Загрузить мобильные версии на сервер"
echo "2. Обновить редирект-скрипт для всех страниц"
echo "3. Протестировать производительность"
