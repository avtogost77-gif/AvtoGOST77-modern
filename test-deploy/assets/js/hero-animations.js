// Анимации для Hero секции

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация счетчиков
    initCounters();
    
    // Добавление параллакс-эффекта
    initParallax();
});

// Анимированные счетчики
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Функция для запуска счетчика
    function startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 секунды
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Эффект замедления к концу анимации (easeOutQuad)
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                
                // Добавляем эффект пульсации после завершения счетчика
                element.classList.add('counted');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Запуск счетчиков при появлении в области видимости
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target); // Наблюдаем только один раз
            }
        });
    }, { threshold: 0.5 });
    
    // Наблюдаем за всеми счетчиками
    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

// Параллакс-эффект для фона
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    // Проверяем, поддерживается ли параллакс на устройстве
    // (отключаем на мобильных для производительности)
    if (window.innerWidth < 992) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        // Применяем эффект параллакса только если секция в зоне видимости
        if (scrollPosition <= heroHeight) {
            const translateY = scrollPosition * 0.3; // Коэффициент скорости параллакса
            hero.style.backgroundPositionY = `calc(30% + ${translateY}px)`;
        }
    });
    
    // Добавляем эффект при движении мыши (тонкий параллакс)
    hero.addEventListener('mousemove', function(e) {
        // Только на десктопах
        if (window.innerWidth < 992) return;
        
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        const translateX = mouseX * 20; // Горизонтальное смещение
        const translateY = mouseY * 20; // Вертикальное смещение
        
        hero.style.backgroundPositionX = `calc(50% + ${translateX}px)`;
        hero.style.backgroundPositionY = `calc(30% + ${translateY}px)`;
    });
}

// Функция для анимации пульсации кнопок
function pulseButtons() {
    const primaryButton = document.querySelector('.hero-actions .btn-primary');
    
    if (!primaryButton) return;
    
    // Добавляем класс для пульсации с интервалом
    setInterval(() => {
        primaryButton.classList.add('pulse-animation');
        
        // Удаляем класс после завершения анимации
        setTimeout(() => {
            primaryButton.classList.remove('pulse-animation');
        }, 1000);
    }, 5000); // Повторяем каждые 5 секунд
}

// Запускаем пульсацию кнопок после загрузки страницы
window.addEventListener('load', function() {
    // Небольшая задержка перед началом анимации
    setTimeout(pulseButtons, 3000);
});
