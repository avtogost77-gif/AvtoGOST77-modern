/**
 * 🚀 АвтоГОСТ 2030 - Временная заглушка JavaScript
 * Минимальный функционал для работоспособности
 */

console.log('🚀 АвтоГОСТ 2030 загружен и готов к работе!');

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM загружен, инициализация...');
    
    // Инициализация основных функций
    initializeAnalytics();
    initializeButtons();
    initializeMobileMenu();
    initializeCalculators();
    
    console.log('✅ Все системы запущены!');
});

/**
 * Инициализация аналитики
 */
function initializeAnalytics() {
    // Трекинг кликов по телефону
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('📞 Клик по телефону: ' + this.href);
            
            // Яндекс.Метрика
            if (typeof ym !== 'undefined') {
                ym(103413788, 'reachGoal', 'PHONE_CLICK');
            }
            
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'contact',
                    'event_label': 'phone_number'
                });
            }
        });
    });

    // Трекинг кликов по WhatsApp
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('💬 Клик по WhatsApp');
            
            if (typeof ym !== 'undefined') {
                ym(103413788, 'reachGoal', 'WHATSAPP_CLICK');
            }
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'contact',
                    'event_label': 'whatsapp'
                });
            }
        });
    });

    // Трекинг кликов по Telegram
    const telegramLinks = document.querySelectorAll('a[href*="t.me"]');
    telegramLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('📱 Клик по Telegram');
            
            if (typeof ym !== 'undefined') {
                ym(103413788, 'reachGoal', 'TELEGRAM_CLICK');
            }
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'telegram_click', {
                    'event_category': 'contact',
                    'event_label': 'telegram'
                });
            }
        });
    });

    console.log('📊 Аналитика инициализирована');
}

/**
 * Инициализация кнопок
 */
function initializeButtons() {
    // Кнопки калькулятора
    const calcButtons = document.querySelectorAll('.calculator-btn, .spb-calc-btn, .gazel-calc-btn');
    calcButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📊 Клик по калькулятору');
            
            // Трекинг
            if (typeof ym !== 'undefined') {
                ym(103413788, 'reachGoal', 'CALCULATOR_USE');
            }
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'calculator_open', {
                    'event_category': 'engagement',
                    'event_label': 'calculator'
                });
            }
            
            // Простая заглушка калькулятора
            alert('📊 Калькулятор в разработке!\n\nПозвоните нам для точного расчета:\n📞 +7 (916) 272-09-32');
        });
    });

    // Кнопки заказа
    const orderButtons = document.querySelectorAll('.order-btn, #spb-order-btn, .gazel-order-btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🛒 Клик по кнопке заказа');
            
            // Трекинг
            if (typeof ym !== 'undefined') {
                ym(103413788, 'reachGoal', 'ORDER_BUTTON_CLICK');
            }
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'order_click', {
                    'event_category': 'conversion',
                    'event_label': 'order_button'
                });
            }
            
            // Переход на звонок
            window.location.href = 'tel:+79162720932';
        });
    });

    console.log('🔘 Кнопки инициализированы');
}

/**
 * Мобильное меню (если понадобится)
 */
function initializeMobileMenu() {
    // Пока простая заглушка
    console.log('📱 Мобильное меню готово');
}

/**
 * Инициализация калькуляторов
 */
function initializeCalculators() {
    // SPB калькулятор
    const spbTransport = document.getElementById('spb-transport');
    const spbWeight = document.getElementById('spb-weight');
    const spbVolume = document.getElementById('spb-volume');
    const spbPrice = document.getElementById('spb-price');
    
    if (spbTransport) {
        spbTransport.addEventListener('change', updateSPBPrice);
        console.log('📊 SPB калькулятор подключен');
    }

    // Gazel калькулятор
    const gazelLength = document.getElementById('gazel-length');
    if (gazelLength) {
        gazelLength.addEventListener('change', updateGazelPrice);
        console.log('🚐 Gazel калькулятор подключен');
    }
}

/**
 * Обновление цены для SPB маршрута
 */
function updateSPBPrice() {
    const transport = document.getElementById('spb-transport');
    const urgency = document.querySelector('input[name="urgency"]:checked');
    const priceElement = document.getElementById('spb-price');
    
    if (!transport || !priceElement) return;
    
    const basePrices = {
        'gazel-4.2': 12000,
        'gazel-5': 13500,
        'gazel-6': 15000,
        '5t': 18000,
        '10t': 25000,
        '20t': 35000
    };
    
    let price = basePrices[transport.value] || 12000;
    
    if (urgency && urgency.value === 'express') {
        price = Math.round(price * 1.25); // +25% за экспресс
    }
    
    priceElement.textContent = `от ${price.toLocaleString()}₽`;
    
    console.log(`💰 SPB цена обновлена: ${price}₽`);
}

/**
 * Обновление цены для Gazel
 */
function updateGazelPrice() {
    const length = document.getElementById('gazel-length');
    if (!length) return;
    
    const prices = {
        '4.2m': 2500,
        '5m': 2700,
        '6m': 3000,
        'open': 2600
    };
    
    const price = prices[length.value] || 2500;
    
    console.log(`🚐 Gazel цена обновлена: ${price}₽`);
}

/**
 * Утилиты
 */
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Экспорт для глобального доступа
window.AutoGost = {
    updateSPBPrice,
    updateGazelPrice,
    smoothScroll
};

console.log('🎯 JavaScript инициализация завершена');