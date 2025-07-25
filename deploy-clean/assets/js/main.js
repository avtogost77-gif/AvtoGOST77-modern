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
    // Кнопки калькулятора (старые заглушки убраны)

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

    // Главный калькулятор
    initializeMainCalculator();
}

/**
 * Инициализация главного калькулятора
 */
function initializeMainCalculator() {
    const calcInputs = document.querySelectorAll('#calc-weight, #calc-volume, #calc-transport, #calc-urgency');
    calcInputs.forEach(input => {
        input.addEventListener('change', updateMainCalculator);
        input.addEventListener('input', updateMainCalculator);
    });
    
    console.log('🧮 Главный калькулятор подключен');
}

/**
 * Обновление главного калькулятора
 */
function updateMainCalculator() {
    const weight = parseFloat(document.getElementById('calc-weight')?.value) || 0;
    const volume = parseFloat(document.getElementById('calc-volume')?.value) || 0;
    const transport = document.getElementById('calc-transport')?.value || 'gazel';
    const urgency = document.getElementById('calc-urgency')?.value || 'standard';
    const resultElement = document.getElementById('result-price');
    
    if (!resultElement) return;
    
    // Проверка корректности данных
    if (weight <= 0 || volume <= 0) {
        resultElement.textContent = 'Введите корректные параметры груза';
        resultElement.className = 'result-price error';
        return;
    }
    
    // Базовые тарифы
    const basePrices = {
        'gazel': { base: 2500, perKm: 35, maxWeight: 1500 },
        '5t': { base: 4500, perKm: 45, maxWeight: 5000 },
        '10t': { base: 7500, perKm: 55, maxWeight: 10000 },
        '20t': { base: 12000, perKm: 65, maxWeight: 20000 }
    };
    
    const tariff = basePrices[transport];
    
    // Проверка превышения веса
    if (weight > tariff.maxWeight) {
        resultElement.textContent = `Превышен максимальный вес для ${transport}`;
        resultElement.className = 'result-price error';
        return;
    }
    
    // Расчет базовой стоимости
    let price = tariff.base;
    
    // Надбавка за объем (если больше стандартного)
    const standardVolume = transport === 'gazel' ? 9 : transport === '5t' ? 25 : transport === '10t' ? 45 : 82;
    if (volume > standardVolume) {
        price += (volume - standardVolume) * 500;
    }
    
    // Надбавка за срочность
    if (urgency === 'express') {
        price = Math.round(price * 1.3);
    }
    
    // Отображение результата
    resultElement.textContent = `от ${price.toLocaleString()}₽`;
    resultElement.className = 'result-price success';
    
    console.log(`💰 Рассчитана стоимость: ${price}₽ (${transport}, ${weight}кг, ${volume}м³)`);
}

/**
 * Функция расчета стоимости (вызывается кнопкой)
 */
function calculatePrice() {
    updateMainCalculator();
    
    // Трекинг
    if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'CALCULATOR_USE');
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculator_use', {
            'event_category': 'engagement',
            'event_label': 'main_calculator'
        });
    }
    
    console.log('📊 Использован калькулятор');
}

/**
 * Функция заказа транспорта
 */
function orderTransport() {
    const weight = document.getElementById('calc-weight')?.value || '';
    const volume = document.getElementById('calc-volume')?.value || '';
    const from = document.getElementById('calc-from')?.value || '';
    const to = document.getElementById('calc-to')?.value || '';
    const transport = document.getElementById('calc-transport')?.value || '';
    
    // Формируем сообщение
    let message = `🚛 Заказ перевозки:\n`;
    if (from) message += `📍 Откуда: ${from}\n`;
    if (to) message += `📍 Куда: ${to}\n`;
    if (weight) message += `⚖️ Вес: ${weight} кг\n`;
    if (volume) message += `📦 Объем: ${volume} м³\n`;
    if (transport) message += `🚚 Транспорт: ${transport}\n`;
    
    // Трекинг
    if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'ORDER_FROM_CALCULATOR');
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'order_from_calculator', {
            'event_category': 'conversion',
            'event_label': 'main_calculator'
        });
    }
    
    // Переход на звонок с данными
    const phone = '+79162720932';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Открываем WhatsApp или звоним
    if (window.innerWidth <= 768) {
        window.open(whatsappUrl, '_blank');
    } else {
        window.location.href = `tel:${phone}`;
    }
    
    console.log('📞 Заказ транспорта из калькулятора');
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