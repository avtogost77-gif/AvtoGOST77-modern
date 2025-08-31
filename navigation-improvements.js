/* =============================================================================
   УЛУЧШЕНИЯ НАВИГАЦИИ - JAVASCRIPT
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация dropdown меню
    initDropdownMenus();
    
    // Закрытие dropdown при клике вне
    initOutsideClickClose();
    
    // Мобильная адаптация
    initMobileNavigation();
    
});

function initDropdownMenus() {
    const dropdownContainers = document.querySelectorAll('.nav-dropdown-container');
    
    dropdownContainers.forEach(container => {
        const toggle = container.querySelector('.dropdown-toggle');
        const dropdown = container.querySelector('.nav-dropdown');
        
        if (!toggle || !dropdown) return;
        
        // Клик по кнопке
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Закрываем другие открытые dropdown
            closeAllDropdowns();
            
            // Переключаем текущий
            const isOpen = container.getAttribute('aria-expanded') === 'true';
            container.setAttribute('aria-expanded', !isOpen);
            toggle.setAttribute('aria-expanded', !isOpen);
        });
        
        // Hover для десктопа
        if (window.innerWidth > 768) {
            container.addEventListener('mouseenter', function() {
                closeAllDropdowns();
                container.setAttribute('aria-expanded', 'true');
                toggle.setAttribute('aria-expanded', 'true');
            });
            
            container.addEventListener('mouseleave', function() {
                container.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

function closeAllDropdowns() {
    const dropdownContainers = document.querySelectorAll('.nav-dropdown-container');
    dropdownContainers.forEach(container => {
        container.setAttribute('aria-expanded', 'false');
        const toggle = container.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
}

function initOutsideClickClose() {
    document.addEventListener('click', function(e) {
        const isDropdownClick = e.target.closest('.nav-dropdown-container');
        if (!isDropdownClick) {
            closeAllDropdowns();
        }
    });
}

function initMobileNavigation() {
    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // На десктопе убираем обработчики кликов и добавляем hover
            initDropdownMenus();
        }
    });
    
    // Улучшение мобильного меню
    const moreBtn = document.querySelector('.nav-more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isOpen);
            
            if (dropdown) {
                dropdown.style.display = isOpen ? 'none' : 'block';
            }
        });
    }
}

// Улучшение accessibility
function initAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
        
        if (e.key === 'Tab') {
            // Обработка Tab navigation в dropdown
            const activeDropdown = document.querySelector('.nav-dropdown-container[aria-expanded="true"]');
            if (activeDropdown) {
                const links = activeDropdown.querySelectorAll('.dropdown-link');
                const currentIndex = Array.from(links).indexOf(document.activeElement);
                
                if (e.shiftKey && currentIndex === 0) {
                    // Shift+Tab на первом элементе - закрываем dropdown
                    closeAllDropdowns();
                } else if (!e.shiftKey && currentIndex === links.length - 1) {
                    // Tab на последнем элементе - закрываем dropdown
                    closeAllDropdowns();
                }
            }
        }
    });
}

// Инициализация accessibility
initAccessibility();

// Аналитика навигации
function trackNavigation(linkText, section) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'Navigation',
            event_label: section + ': ' + linkText,
            transport_type: 'beacon'
        });
    }
}

// Добавляем tracking к ссылкам
document.querySelectorAll('.dropdown-link, .footer-nav-link, .footer-route-link').forEach(link => {
    link.addEventListener('click', function() {
        const section = this.closest('.nav-dropdown-services') ? 'Services Menu' :
                       this.closest('.nav-dropdown-routes') ? 'Routes Menu' :
                       this.closest('.footer-nav') ? 'Footer Nav' :
                       this.closest('.footer-routes') ? 'Footer Routes' : 'Other';
        
        trackNavigation(this.textContent.trim(), section);
    });
});

console.log('🚀 Улучшения навигации загружены');
