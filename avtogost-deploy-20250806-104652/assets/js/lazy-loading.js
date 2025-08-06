
// Lazy Loading для изображений
document.addEventListener('DOMContentLoaded', function() {
    // Native lazy loading для современных браузеров
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback для старых браузеров
        const script = document.createElement('script');
        script.src = '/assets/js/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Intersection Observer для плавной загрузки
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // Наблюдаем за всеми изображениями с data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});
