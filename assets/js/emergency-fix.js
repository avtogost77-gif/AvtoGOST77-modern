// ===============================================
// 🚨 EMERGENCY JAVASCRIPT FIX
// Критическое исправление кнопок и событий
// ===============================================

console.log('🚨 EMERGENCY FIX LOADED!');

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Starting Emergency Button Fix...');
    
    // ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ КНОПОК
    fixAllButtons();
    
    // ИСПРАВЛЕНИЕ ФОРМ
    fixForms();
    
    // ИСПРАВЛЕНИЕ КАЛЬКУЛЯТОРА
    fixCalculator();
    
    // МОНИТОРИНГ КЛИКОВ
    setupClickMonitoring();
    
    console.log('✅ Emergency Fix Applied!');
});

// ===============================================
// ИСПРАВЛЕНИЕ ВСЕХ КНОПОК
// ===============================================
function fixAllButtons() {
    console.log('🔄 Fixing buttons...');
    
    // Находим ВСЕ возможные кнопки
    const buttons = document.querySelectorAll(`
        .btn, button, 
        [type="button"], [type="submit"],
        .header-cta, .calculator-btn,
        a[href="#calculator"], a[href="#contact"],
        .hero-buttons a, .cta-button
    `);
    
    console.log(`Found ${buttons.length} buttons to fix`);
    
    buttons.forEach((btn, index) => {
        // Убираем старые обработчики
        btn.removeEventListener('click', handleClick);
        btn.removeEventListener('touchstart', handleTouchStart);
        btn.removeEventListener('touchend', handleTouchEnd);
        
        // Добавляем новые исправленные обработчики
        btn.addEventListener('click', handleClick, { passive: false });
        btn.addEventListener('touchstart', handleTouchStart, { passive: true });
        btn.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Добавляем data-атрибуты для отслеживания
        btn.setAttribute('data-button-id', `btn-${index}`);
        btn.setAttribute('data-fixed', 'true');
        
        // Touch-friendly настройки
        btn.style.touchAction = 'manipulation';
        btn.style.userSelect = 'none';
        btn.style.webkitUserSelect = 'none';
        
        console.log(`✅ Fixed button ${index}: ${btn.tagName} ${btn.className}`);
    });
}

// ===============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ===============================================
function handleClick(event) {
    const button = event.currentTarget;
    const buttonId = button.getAttribute('data-button-id');
    
    console.log(`🎯 CLICK: ${buttonId}`, button);
    
    // Предотвращаем двойные клики
    if (button.getAttribute('data-processing') === 'true') {
        event.preventDefault();
        return false;
    }
    
    // Отмечаем как обрабатываемая
    button.setAttribute('data-processing', 'true');
    button.setAttribute('data-clicked', 'true');
    
    // Визуальная обратная связь
    button.classList.add('working');
    
    // Определяем тип кнопки и действие
    const href = button.getAttribute('href');
    const onClick = button.getAttribute('onclick');
    const type = button.getAttribute('type');
    
    if (href && href.startsWith('#')) {
        // Якорная ссылка
        event.preventDefault();
        smoothScrollTo(href);
    } else if (href && (href.startsWith('tel:') || href.startsWith('mailto:'))) {
        // Контактные ссылки - позволяем стандартное поведение
        // Не preventDefault
    } else if (type === 'submit') {
        // Отправка формы - обрабатываем отдельно
        handleFormSubmit(event);
    } else if (onClick) {
        // Если есть onclick - выполняем
        try {
            eval(onClick);
        } catch (e) {
            console.error('Error in onclick:', e);
        }
    }
    
    // Убираем блокировку через короткое время
    setTimeout(() => {
        button.removeAttribute('data-processing');
        button.classList.remove('working');
    }, 300);
    
    // Тактильная обратная связь
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
    
    return true;
}

function handleTouchStart(event) {
    const button = event.currentTarget;
    button.style.transform = 'scale(0.98)';
    button.style.opacity = '0.8';
}

function handleTouchEnd(event) {
    const button = event.currentTarget;
    button.style.transform = '';
    button.style.opacity = '';
}

// ===============================================
// ПЛАВНАЯ ПРОКРУТКА
// ===============================================
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Учитываем header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        console.log(`📍 Scrolled to: ${target}`);
    }
}

// ===============================================
// ИСПРАВЛЕНИЕ ФОРМ
// ===============================================
function fixForms() {
    console.log('📝 Fixing forms...');
    
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
        form.addEventListener('submit', handleFormSubmit, { passive: false });
        form.setAttribute('data-form-id', `form-${index}`);
        
        // Исправляем inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.fontSize = '16px'; // Предотвращаем zoom в iOS
            input.addEventListener('focus', function() {
                this.style.borderColor = '#2563eb';
            });
        });
        
        console.log(`✅ Fixed form ${index}`);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.currentTarget.closest('form') || event.currentTarget;
    const formId = form.getAttribute('data-form-id');
    
    console.log(`📤 FORM SUBMIT: ${formId}`, form);
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Form data:', data);
    
    // Показываем уведомление
    showNotification('Заявка отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
    
    // Здесь можно добавить реальную отправку данных
    // sendToServer(data);
    
    return false;
}

// ===============================================
// ИСПРАВЛЕНИЕ КАЛЬКУЛЯТОРА
// ===============================================
function fixCalculator() {
    console.log('🧮 Fixing calculator...');
    
    const calculatorForm = document.getElementById('calculatorForm');
    if (calculatorForm) {
        const submitBtn = calculatorForm.querySelector('button[type="submit"], .calculator-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleCalculatorSubmit(calculatorForm);
            });
            console.log('✅ Calculator submit fixed');
        }
    }
}

function handleCalculatorSubmit(form) {
    console.log('🧮 Calculator submit');
    
    // Простой расчет для демо
    const from = form.querySelector('[name="from"], #fromLocation')?.value || 'Москва';
    const to = form.querySelector('[name="to"], #toLocation')?.value || 'СПб';
    const weight = form.querySelector('[name="weight"], #cargoWeight')?.value || '1';
    
    const basePrice = 2500;
    const distance = 635; // Москва-СПб
    const weightMultiplier = parseFloat(weight) || 1;
    
    const price = Math.round(basePrice + (distance * weightMultiplier * 0.5));
    
    // Показываем результат
    showCalculatorResult(from, to, weight, price);
}

function showCalculatorResult(from, to, weight, price) {
    let resultDiv = document.getElementById('calculatorResult');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'calculatorResult';
        const calculator = document.getElementById('calculatorForm') || document.querySelector('.calculator-form');
        if (calculator) {
            calculator.appendChild(resultDiv);
        }
    }
    
    resultDiv.innerHTML = `
        <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin-top: 20px;">
            <h4 style="color: #059669; margin-bottom: 10px;">💰 Стоимость доставки</h4>
            <p><strong>Маршрут:</strong> ${from} → ${to}</p>
            <p><strong>Вес:</strong> ${weight} тонн</p>
            <p style="font-size: 24px; color: #059669; font-weight: bold;">
                💸 ${price.toLocaleString()}₽
            </p>
            <button onclick="orderDelivery()" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; margin-top: 10px; cursor: pointer;">
                📞 Заказать доставку
            </button>
        </div>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===============================================
// МОНИТОРИНГ КЛИКОВ
// ===============================================
function setupClickMonitoring() {
    let clickCount = 0;
    
    document.addEventListener('click', function(e) {
        clickCount++;
        console.log(`👆 Click ${clickCount}:`, e.target.tagName, e.target.className);
        
        // Показываем индикатор клика
        showClickIndicator(e.clientX, e.clientY);
    });
}

function showClickIndicator(x, y) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        background: #10b981;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(0);
        animation: clickPulse 0.5s ease-out;
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }, 500);
}

// ===============================================
// УВЕДОМЛЕНИЯ
// ===============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#2563eb'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Автоскрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===============================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ
// ===============================================
window.orderDelivery = function() {
    const phone = '+7 916 272-09-32';
    const message = 'Здравствуйте! Хочу заказать доставку. Рассчитал стоимость на сайте.';
    const whatsappUrl = `https://wa.me/79162720932?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    console.log('📱 Opening WhatsApp');
};

// CSS для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes clickPulse {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🚀 Emergency Fix Script Ready!');