/**
 * Скрипт для создания скрывающегося хедера при скролле вниз
 * и показа при скролле вверх
 */
document.addEventListener('DOMContentLoaded', function() {
    let header = document.querySelector('.header');
    let lastScrollTop = 0;
    let scrollThreshold = 50; // Минимальное количество пикселей для срабатывания
    let isScrollingUp = false;
    
    // Добавляем класс для анимации
    if (header) {
        header.style.transition = 'transform 0.3s ease';
    }
    
    // Функция для обработки скролла
    function handleScroll() {
        if (!header) return;
        
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Если находимся в верхней части страницы, всегда показываем хедер
        if (currentScrollTop <= scrollThreshold) {
            header.style.transform = 'translateY(0)';
            return;
        }
        
        // Определяем направление скролла
        if (currentScrollTop > lastScrollTop) {
            // Скролл вниз - скрываем хедер
            if (!isScrollingUp) {
                header.style.transform = 'translateY(-100%)';
            }
            isScrollingUp = false;
        } else {
            // Скролл вверх - показываем хедер
            header.style.transform = 'translateY(0)';
            isScrollingUp = true;
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    // Добавляем обработчик события скролла с debounce для производительности
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 10);
    });
    
    // Инициализация
    handleScroll();
});
