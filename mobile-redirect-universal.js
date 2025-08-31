// 🚀 УНИВЕРСАЛЬНЫЙ МОБИЛЬНЫЙ РЕДИРЕКТ
// Перенаправляет мобильные устройства на ультра-оптимизированные версии всех страниц

(function() {
    'use strict';
    
    // Проверяем, что это мобильное устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (!isMobile) {
        return; // Выходим на десктопе
    }
    
    // Получаем текущий путь
    const currentPath = window.location.pathname;
    
    // Проверяем, что мы не на мобильной версии уже
    if (currentPath.includes('-mobile.html')) {
        return; // Уже на мобильной версии
    }
    
    // Список страниц с мобильными версиями
    const mobilePages = [
        '/',
        '/about.html',
        '/services.html',
        '/contact.html',
        '/transportnaya-kompaniya.html',
        '/legal-minimum.html',
        '/gazel-gruzoperevozki.html',
        '/gruzoperevozki-spb.html',
        '/poputnyj-gruz.html',
        '/gruzoperevozki-moskva-tambov.html',
        '/gruzoperevozki-moskva-belgorod.html',
        '/gruzovoe-taksi.html',
        '/gruzoperevozki-moskva-krasnodar.html',
        '/gruzoperevozki-ekaterinburg.html',
        '/desyatitonnik-gruzoperevozki.html',
        '/dostavka-gruzov.html',
        '/sbornye-gruzy.html',
        '/gruzoperevozki-moskva-orel.html',
        '/dostavka-na-marketpleysy.html',
        '/gruzoperevozki-po-moskve.html',
        '/gruzoperevozki-moskva-tula.html',
        '/pyatitonnik-gruzoperevozki.html',
        '/pereezd-moskva.html',
        '/self-employed-delivery.html',
        '/trehtonnik-gruzoperevozki.html',
        '/gruzoperevozki-iz-moskvy.html',
        '/rc-dostavka.html',
        '/gruzoperevozki-moskva-lipetsk.html',
        '/gruzoperevozki-moskva-voronezh.html',
        '/fura-20-tonn-gruzoperevozki.html',
        '/gruzoperevozki-moskva-kursk.html',
        '/perevozka-mebeli.html',
        '/dogruz.html'
    ];
    
    // Проверяем, есть ли мобильная версия для текущей страницы
    if (mobilePages.includes(currentPath)) {
        // Создаем путь к мобильной версии
        let mobilePath;
        
        if (currentPath === '/') {
            mobilePath = '/index-mobile-ultra.html';
        } else {
            mobilePath = currentPath.replace('.html', '-mobile.html');
        }
        
        // Перенаправляем на мобильную версию
        window.location.href = mobilePath;
    }
})();
