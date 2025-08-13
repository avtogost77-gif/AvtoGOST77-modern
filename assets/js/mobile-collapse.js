// Mobile Collapse Functionality
// Обработка секций с data-collapse="mobile"

document.addEventListener('DOMContentLoaded', function() {
    // Находим все секции с data-collapse="mobile"
    const collapsibleSections = document.querySelectorAll('[data-collapse="mobile"]');
    
    collapsibleSections.forEach(section => {
        // Создаем кнопку-переключатель
        const toggle = document.createElement('button');
        toggle.className = 'mobile-toggle';
        toggle.setAttribute('aria-label', 'Показать/скрыть секцию');
        
        // Получаем заголовок секции для кнопки
        const sectionTitle = section.querySelector('h2, h3, h4') || 
                           section.querySelector('.section-title') ||
                           section.getAttribute('data-title') ||
                           'Подробнее';
        
        toggle.textContent = sectionTitle.textContent || sectionTitle;
        
        // Вставляем кнопку перед секцией
        section.parentNode.insertBefore(toggle, section);
        
        // Обработчик клика
        toggle.addEventListener('click', function() {
            const isExpanded = section.classList.contains('expanded');
            
            if (isExpanded) {
                // Скрываем секцию
                section.classList.remove('expanded');
                toggle.classList.remove('expanded');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                // Показываем секцию
                section.classList.add('expanded');
                toggle.classList.add('expanded');
                toggle.setAttribute('aria-expanded', 'true');
                
                // Плавная анимация появления
                section.style.display = 'block';
                section.style.opacity = '0';
                section.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 10);
            }
        });
        
        // На десктопе показываем все секции
        function handleResize() {
            if (window.innerWidth > 768) {
                section.style.display = 'block';
                section.style.opacity = '1';
                section.style.transform = 'none';
                toggle.style.display = 'none';
            } else {
                if (!section.classList.contains('expanded')) {
                    section.style.display = 'none';
                }
                toggle.style.display = 'flex';
            }
        }
        
        // Инициализация при загрузке
        handleResize();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', handleResize);
    });
    
    // Дополнительная функциональность для улучшения UX
    const mobileToggles = document.querySelectorAll('.mobile-toggle');
    
    // Добавляем поддержку клавиатуры
    mobileToggles.forEach(toggle => {
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
    
    // Автоматическое раскрытие секции при переходе по якорю
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection && targetSection.hasAttribute('data-collapse')) {
            const toggle = targetSection.previousElementSibling;
            if (toggle && toggle.classList.contains('mobile-toggle')) {
                setTimeout(() => {
                    toggle.click();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }
});

// Экспорт для использования в других скриптах
window.MobileCollapse = {
    init: function() {
        // Повторная инициализация при необходимости
        this.handleResize();
    },
    
    handleResize: function() {
        const collapsibleSections = document.querySelectorAll('[data-collapse="mobile"]');
        const mobileToggles = document.querySelectorAll('.mobile-toggle');
        
        collapsibleSections.forEach(section => {
            if (window.innerWidth > 768) {
                section.style.display = 'block';
                section.style.opacity = '1';
                section.style.transform = 'none';
            }
        });
        
        mobileToggles.forEach(toggle => {
            if (window.innerWidth > 768) {
                toggle.style.display = 'none';
            } else {
                toggle.style.display = 'flex';
            }
        });
    }
};
