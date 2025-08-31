/**
 * Слайдер отзывов и социальные доказательства
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера отзывов
    initTestimonialsSlider();
    
    // Инициализация анимированных счетчиков
    initStatCounters();
    
    // Инициализация анимации логотипов клиентов
    initClientLogos();
});

/**
 * Инициализация слайдера отзывов
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const prevButton = document.querySelector('.testimonials-nav-prev');
    const nextButton = document.querySelector('.testimonials-nav-next');
    const cards = slider.querySelectorAll('.testimonial-card');
    
    if (!prevButton || !nextButton) return;
    
    // Количество видимых карточек в зависимости от ширины экрана
    const getVisibleCount = () => {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    };
    
    // Текущий индекс
    let currentIndex = 0;
    
    // Обновление состояния кнопок навигации
    const updateNavButtons = () => {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= cards.length - getVisibleCount();
        
        // Обновляем стили кнопок
        if (prevButton.disabled) {
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'not-allowed';
        } else {
            prevButton.style.opacity = '1';
            prevButton.style.cursor = 'pointer';
        }
        
        if (nextButton.disabled) {
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
        }
    };
    
    // Прокрутка к указанному индексу
    const scrollToIndex = (index) => {
        if (index < 0) index = 0;
        if (index > cards.length - getVisibleCount()) {
            index = cards.length - getVisibleCount();
        }
        
        currentIndex = index;
        
        // Вычисляем позицию для прокрутки
        const card = cards[index];
        const scrollLeft = card.offsetLeft - slider.offsetLeft;
        
        // Плавно прокручиваем к нужной позиции
        slider.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        
        // Обновляем состояние кнопок
        updateNavButtons();
    };
    
    // Обработчики для кнопок навигации
    prevButton.addEventListener('click', () => {
        scrollToIndex(currentIndex - 1);
    });
    
    nextButton.addEventListener('click', () => {
        scrollToIndex(currentIndex + 1);
    });
    
    // Обработчик прокрутки слайдера
    slider.addEventListener('scroll', () => {
        // Находим ближайшую карточку к левому краю
        const scrollLeft = slider.scrollLeft;
        let closestIndex = 0;
        let minDistance = Infinity;
        
        cards.forEach((card, index) => {
            const distance = Math.abs(card.offsetLeft - slider.offsetLeft - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        
        currentIndex = closestIndex;
        updateNavButtons();
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        // Перепрокручиваем к текущему индексу при изменении размера окна
        scrollToIndex(currentIndex);
    });
    
    // Инициализируем начальное состояние
    updateNavButtons();
    
    // Автоматическая прокрутка слайдера
    let autoScrollInterval;
    
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            if (currentIndex < cards.length - getVisibleCount()) {
                scrollToIndex(currentIndex + 1);
            } else {
                scrollToIndex(0);
            }
        }, 5000); // Интервал автопрокрутки - 5 секунд
    };
    
    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };
    
    // Запускаем автопрокрутку
    startAutoScroll();
    
    // Останавливаем автопрокрутку при взаимодействии пользователя
    slider.addEventListener('mouseenter', stopAutoScroll);
    prevButton.addEventListener('mouseenter', stopAutoScroll);
    nextButton.addEventListener('mouseenter', stopAutoScroll);
    
    // Возобновляем автопрокрутку, когда пользователь уходит
    slider.addEventListener('mouseleave', startAutoScroll);
    prevButton.addEventListener('mouseleave', startAutoScroll);
    nextButton.addEventListener('mouseleave', startAutoScroll);
}

/**
 * Инициализация анимированных счетчиков
 */
function initStatCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    if (!counters.length) return;
    
    // Функция для анимации счетчика
    const animateCounter = (counter, targetValue) => {
        let startValue = 0;
        const duration = 2000; // 2 секунды
        const increment = targetValue / (duration / 16); // 16мс - примерно один кадр при 60fps
        
        const updateCounter = () => {
            startValue += increment;
            if (startValue < targetValue) {
                counter.textContent = Math.floor(startValue).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = targetValue.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Используем Intersection Observer для запуска анимации при появлении счетчиков в поле зрения
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = parseInt(counter.getAttribute('data-value'));
                animateCounter(counter, targetValue);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });
    
    // Наблюдаем за всеми счетчиками
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Инициализация анимации логотипов клиентов
 */
function initClientLogos() {
    const logos = document.querySelectorAll('.client-logo');
    
    if (!logos.length) return;
    
    // Добавляем эффект появления логотипов при прокрутке
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем задержку для каждого логотипа
                setTimeout(() => {
                    entry.target.style.opacity = '0.7';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Подготавливаем логотипы к анимации
    logos.forEach(logo => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(20px)';
        logo.style.transition = 'all 0.5s ease';
        
        observer.observe(logo);
    });
}

/**
 * Обновление социальных доказательств
 * Вызывать эту функцию, если содержимое добавляется динамически
 */
function refreshSocialProof() {
    initTestimonialsSlider();
    initStatCounters();
    initClientLogos();
}

// Экспортируем функцию для возможного использования в других скриптах
window.refreshSocialProof = refreshSocialProof;
