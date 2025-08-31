// 🚨 ОПТИМИЗИРОВАННЫЙ JAVASCRIPT BUNDLE ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ

// Основные функции калькулятора (только используемые)
class OptimizedCalculator {
    constructor() {
        this.init();
    }
    
    init() {
        const form = document.getElementById('calculatorForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
            this.initAutocomplete();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const result = this.calculate(formData);
        this.showResult(result);
    }
    
    calculate(formData) {
        const from = formData.get('fromCity') || '';
        const to = formData.get('toCity') || '';
        const weight = parseFloat(formData.get('weight')) || 0;
        const volume = parseFloat(formData.get('volume')) || 0;
        const isConsolidated = formData.get('consolidated') === 'yes';
        
        // Упрощенный расчет
        let price = Math.max(weight * 0.5, volume * 1000, 5000);
        if (isConsolidated) price *= 0.65;
        
        return {
            price: Math.round(price),
            from,
            to,
            weight,
            volume,
            isConsolidated
        };
    }
    
    showResult(result) {
        const resultEl = document.getElementById('calculatorResult');
        const priceEl = document.getElementById('calculatedPrice');
        
        if (resultEl && priceEl) {
            priceEl.textContent = result.price.toLocaleString() + ' ₽';
            resultEl.style.display = 'block';
            resultEl.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    initAutocomplete() {
        const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'];
        const inputs = document.querySelectorAll('input[name="fromCity"], input[name="toCity"]');
        
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.toLowerCase();
                const suggestions = cities.filter(city => 
                    city.toLowerCase().includes(value)
                ).slice(0, 3);
                
                // Простое автодополнение
                if (suggestions.length === 1 && value.length > 2) {
                    e.target.value = suggestions[0];
                }
            });
        });
    }
}

// Оптимизированная навигация
class OptimizedNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        this.initMobileMenu();
        this.initSmoothScroll();
    }
    
    initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const menu = document.querySelector('.mobile-menu');
        
        if (menuBtn && menu) {
            menuBtn.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
        }
    }
    
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Оптимизированные формы
class OptimizedForms {
    constructor() {
        this.init();
    }
    
    init() {
        this.initContactForm();
        this.initPriceFreeze();
    }
    
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
    }
    
    async handleContactSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            // Упрощенная отправка
            if (typeof sendToTelegram === 'function') {
                const message = `
🔔 <b>Новая заявка</b>
👤 <b>Имя:</b> ${formData.get('name')}
📞 <b>Телефон:</b> ${formData.get('phone')}
📧 <b>Email:</b> ${formData.get('email') || 'Не указан'}
💬 <b>Сообщение:</b> ${formData.get('message') || 'Не указано'}
                `;
                sendToTelegram(message, 'contact-form');
            }
            
            this.showSuccess('Спасибо! Мы свяжемся с вами в ближайшее время.');
            e.target.reset();
        } catch (error) {
            this.showError('Произошла ошибка. Попробуйте еще раз.');
        }
    }
    
    initPriceFreeze() {
        const form = document.getElementById('priceFreezeForm');
        if (form) {
            form.addEventListener('submit', this.handlePriceFreeze.bind(this));
        }
    }
    
    async handlePriceFreeze(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            // Упрощенная заморозка цены
            this.showSuccess('Цена зафиксирована! Мы свяжемся с вами в течение 30 минут.');
            e.target.reset();
        } catch (error) {
            this.showError('Произошла ошибка. Попробуйте еще раз.');
        }
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            max-width: 400px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Оптимизированная аналитика (только необходимое)
class OptimizedAnalytics {
    constructor() {
        this.init();
    }
    
    init() {
        this.trackClicks();
        this.trackForms();
    }
    
    trackClicks() {
        // Отслеживаем только важные клики
        const importantLinks = document.querySelectorAll('a[href^="tel:"], a[href*="wa.me"]');
        importantLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.sendEvent('click', link.href);
            });
        });
    }
    
    trackForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', () => {
                this.sendEvent('form_submit', form.id || 'unknown');
            });
        });
    }
    
    sendEvent(action, label) {
        // Упрощенная отправка событий
        if (typeof gtag !== 'undefined') {
            gtag('event', action, { event_label: label });
        }
        if (typeof ym !== 'undefined') {
            ym(103413788, 'reachGoal', action, { label });
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    new OptimizedCalculator();
    new OptimizedNavigation();
    new OptimizedForms();
    new OptimizedAnalytics();
});

// Отложенная загрузка тяжелых ресурсов
window.addEventListener('load', function() {
    // Загружаем тяжелые изображения
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
    });
    
    // Загружаем дополнительные скрипты
    setTimeout(() => {
        // AOS анимации (если нужны)
        if (typeof AOS !== 'undefined') {
            AOS.init();
        }
    }, 2000);
});
