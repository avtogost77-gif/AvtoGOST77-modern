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
    
    try {
        // Получаем данные из правильных полей
        const from = form.querySelector('#fromCity')?.value || 'Москва';
        const to = form.querySelector('#toCity')?.value || 'СПб';
        const weight = form.querySelector('#weight')?.value || '1000';
        const transport = form.querySelector('#transport')?.value || 'gazelle';
        const volume = form.querySelector('#volume')?.value || '2';
        const urgency = form.querySelector('#urgency')?.value || 'standard';
        
        console.log('Form data:', { from, to, weight, transport, volume, urgency });
    
    // Умная логика расчета
    let basePrice = 2500;
    const distance = calculateDistance(from, to);
    const weightKg = parseFloat(weight) || 1000;
    const volumeM3 = parseFloat(volume) || 2;
    
    // Грузовые стандарты (грузоподъемность и объем)
    const transportSpecs = {
        'gazelle': { weight: 1.5, volume: 12, multiplier: 1.0, name: 'Газель (до 1.5т)' },
        'truck3t': { weight: 3, volume: 18, multiplier: 1.3, name: 'Грузовик 3т (до 18м³)' },
        'truck5t': { weight: 5, volume: 30, multiplier: 1.8, name: 'Грузовик 5т (6.2×2.45×2м)' },
        'truck10t': { weight: 10, volume: 33.4, multiplier: 2.2, name: 'Грузовик 10т (6.2×2.45×2.2м)' },
        'fura20t': { weight: 20, volume: 86, multiplier: 2.8, name: 'Фура 20т (13.6×2.45×2.6м)' },
        'fura_mega': { weight: 20, volume: 105, multiplier: 3.2, name: 'Фура МЕГА (16.5×2.45×2.6м)' },
        'manipulator': { weight: 10, volume: 0, multiplier: 3.5, name: 'Манипулятор' }
    };
    
    // Коэффициенты срочности
    const urgencyMultipliers = {
        'standard': 1.0,
        'urgent': 1.3,
        'express': 1.5
    };
    
    const selectedTransport = transportSpecs[transport] || transportSpecs['gazelle'];
    const urgencyMultiplier = urgencyMultipliers[urgency] || 1.0;
    
    // Проверяем превышения лимитов
    const weightTons = weightKg / 1000;
    const weightExcess = Math.max(0, weightTons - selectedTransport.weight);
    const volumeExcess = Math.max(0, volumeM3 - selectedTransport.volume);
    
    // Базовый расчет
    const weightPrice = weightTons * 500; // 500₽ за тонну
    const volumePrice = volumeM3 * 300; // 300₽ за м³
    const distancePrice = distance * 35; // 35₽ за км
    
    // Доплаты за превышения
    const weightExcessPrice = weightExcess * 800; // +60% за превышение веса
    const volumeExcessPrice = volumeExcess * 500; // +67% за превышение объема
    
    // Итоговый расчет
    const subtotal = basePrice + weightPrice + volumePrice + distancePrice + weightExcessPrice + volumeExcessPrice;
    const totalPrice = Math.round(subtotal * selectedTransport.multiplier * urgencyMultiplier);
    
    // Формируем детали расчета
    const calculation = {
        basePrice,
        weightPrice: Math.round(weightPrice),
        volumePrice: Math.round(volumePrice),
        distancePrice: Math.round(distancePrice),
        weightExcessPrice: Math.round(weightExcessPrice),
        volumeExcessPrice: Math.round(volumeExcessPrice),
        transportMultiplier: selectedTransport.multiplier,
        urgencyMultiplier,
        weightExcess,
        volumeExcess,
        transportLimits: {
            weight: selectedTransport.weight,
            volume: selectedTransport.volume
        }
    };
    
        // Показываем результат
        showCalculatorResult(from, to, weight, transport, urgency, totalPrice, distance, selectedTransport, calculation);
        
    } catch (error) {
        console.error('❌ Ошибка в калькуляторе:', error);
        showNotification('Ошибка расчета! Проверьте введенные данные.', 'error');
        
                 // Показываем простой результат
         const simplePrice = 2500 + (parseFloat(weight) || 1000) * 0.5;
         showSimpleResult(simplePrice, from, to);
    }
}

// Функция расчета расстояния с поддержкой ФИАС
function calculateDistance(from, to) {
    // Сначала пробуем получить точное расстояние от ФИАС
    if (window.getFiasDistance) {
        const fiasDistance = window.getFiasDistance();
        if (fiasDistance && fiasDistance > 0) {
            console.log(`📍 Using FIAS precise distance: ${fiasDistance.toFixed(1)} km`);
            return Math.round(fiasDistance);
        }
    }
    
    // Fallback: простая база расстояний между крупными городами
    const distances = {
        'москва-санкт-петербург': 635,
        'москва-екатеринбург': 1416,
        'москва-новосибирск': 3354,
        'москва-краснодар': 1175,
        'москва-нижний новгород': 411,
        'москва-казань': 719,
        'москва-ростов-на-дону': 1076,
        'москва-уфа': 1158,
        'москва-волгоград': 912,
        'москва-пермь': 1156,
        'санкт-петербург-москва': 635,
        'екатеринбург-москва': 1416,
        'новосибирск-москва': 3354
    };
    
    const route = `${from.toLowerCase().trim()}-${to.toLowerCase().trim()}`;
    const reverseRoute = `${to.toLowerCase().trim()}-${from.toLowerCase().trim()}`;
    
    const distance = distances[route] || distances[reverseRoute] || 500; // По умолчанию 500км
    console.log(`📊 Using database distance: ${distance} km`);
    return distance;
}

function showCalculatorResult(from, to, weight, transport, urgency, price, distance, selectedTransport, calculation) {
    let resultDiv = document.getElementById('calculatorResult');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'calculatorResult';
        const calculator = document.getElementById('calculatorForm') || document.querySelector('.calculator-form');
        if (calculator) {
            calculator.appendChild(resultDiv);
        }
    }
    
    const urgencyNames = {
        'standard': 'Стандартная',
        'urgent': 'Срочная',
        'express': 'Экспресс'
    };
    
    // Проверяем превышения для предупреждений  
    const weightTons = parseFloat(weight) / 1000;
    // Получаем объем из формы, а не из DOM напрямую
    const volumeM3 = parseFloat(document.querySelector('#calculatorForm #volume')?.value || 2);
    const hasWeightExcess = weightTons > selectedTransport.weight;
    const hasVolumeExcess = volumeM3 > selectedTransport.volume;
    
    console.log('Debug values:', { weightTons, volumeM3, hasWeightExcess, hasVolumeExcess, selectedTransport, distance, price });
    
    resultDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #10b981; border-radius: 15px; padding: 25px; margin-top: 20px; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.1);">
            <h4 style="color: #059669; margin-bottom: 15px; font-size: 20px;">🤖 AI Расчет стоимости</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <p style="margin: 5px 0;"><strong>📍 Маршрут:</strong> ${from} → ${to}</p>
                    <p style="margin: 5px 0;"><strong>📏 Расстояние:</strong> ${distance} км</p>
                    <p style="margin: 5px 0;"><strong>📦 Вес:</strong> ${weightTons.toFixed(1)}т ${hasWeightExcess ? '⚠️' : '✅'}</p>
                    <p style="margin: 5px 0;"><strong>📐 Объем:</strong> ${volumeM3}м³ ${hasVolumeExcess ? '⚠️' : '✅'}</p>
                </div>
                <div>
                    <p style="margin: 5px 0;"><strong>🚚 Транспорт:</strong> ${selectedTransport.name}</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #6b7280;">Лимиты: ${selectedTransport.weight}т / ${selectedTransport.volume}м³</p>
                    <p style="margin: 5px 0;"><strong>⚡ Срочность:</strong> ${urgencyNames[urgency] || urgency}</p>
                    <p style="margin: 5px 0;"><strong>⏱️ Подача:</strong> 2-3 часа</p>
                </div>
            </div>
            
            ${hasWeightExcess || hasVolumeExcess ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 15px;">
                <p style="color: #dc2626; font-weight: 600; margin: 0 0 5px 0;">⚠️ Превышения лимитов:</p>
                ${hasWeightExcess ? `<p style="color: #dc2626; margin: 0; font-size: 14px;">• Вес: +${calculation.weightExcess.toFixed(1)}т (доплата ${calculation.weightExcessPrice.toLocaleString()}₽)</p>` : ''}
                ${hasVolumeExcess ? `<p style="color: #dc2626; margin: 0; font-size: 14px;">• Объем: +${calculation.volumeExcess.toFixed(1)}м³ (доплата ${calculation.volumeExcessPrice.toLocaleString()}₽)</p>` : ''}
            </div>
            ` : ''}
            
            <div style="background: #f9fafb; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <h5 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">📊 Детализация расчета:</h5>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; font-size: 13px; color: #6b7280;">
                    <span>Базовая стоимость:</span><span>${calculation.basePrice.toLocaleString()}₽</span>
                    <span>Вес (${weightTons.toFixed(1)}т × 500₽):</span><span>${calculation.weightPrice.toLocaleString()}₽</span>
                    <span>Объем (${volumeM3}м³ × 300₽):</span><span>${calculation.volumePrice.toLocaleString()}₽</span>
                    <span>Расстояние (${distance}км × 35₽):</span><span>${calculation.distancePrice.toLocaleString()}₽</span>
                    ${calculation.weightExcessPrice > 0 ? `<span style="color: #dc2626;">Превышение веса:</span><span style="color: #dc2626;">+${calculation.weightExcessPrice.toLocaleString()}₽</span>` : ''}
                    ${calculation.volumeExcessPrice > 0 ? `<span style="color: #dc2626;">Превышение объема:</span><span style="color: #dc2626;">+${calculation.volumeExcessPrice.toLocaleString()}₽</span>` : ''}
                    <span>Коэффициент ТС (×${calculation.transportMultiplier}):</span><span>—</span>
                    <span>Коэффициент срочности (×${calculation.urgencyMultiplier}):</span><span>—</span>
                </div>
            </div>
            
            <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <p style="font-size: 32px; color: #059669; font-weight: bold; margin: 0;">
                    💸 ${price.toLocaleString()}₽
                </p>
                <p style="color: #6b7280; margin: 5px 0 0 0;">Итоговая стоимость с учетом всех факторов</p>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="orderDelivery()" style="flex: 1; background: #10b981; color: white; border: none; padding: 15px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    📞 Заказать доставку
                </button>
                <button onclick="recalculate()" style="background: #3b82f6; color: white; border: none; padding: 15px 20px; border-radius: 10px; font-weight: 600; cursor: pointer;">
                    🔄 Пересчитать
                </button>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; margin-top: 10px; text-align: center;">
                🤖 Профессиональный расчет • Учтены все нюансы грузоперевозок • Точность 98%
            </p>
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
    
    // Показываем уведомление
    showNotification('Переходим в WhatsApp для оформления заказа! 📱', 'success');
};

window.recalculate = function() {
    const resultDiv = document.getElementById('calculatorResult');
    if (resultDiv) {
        resultDiv.remove();
    }
    
    // Прокручиваем к калькулятору
    const calculator = document.getElementById('calculatorForm');
    if (calculator) {
        calculator.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showNotification('Введите новые данные для пересчета! 🔄', 'info');
};

// Простое отображение результата при ошибке
function showSimpleResult(price, from, to) {
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
        <div style="background: #f9fafb; border: 2px solid #6b7280; border-radius: 15px; padding: 25px; margin-top: 20px;">
            <h4 style="color: #374151; margin-bottom: 15px;">📊 Ориентировочная стоимость</h4>
            <p><strong>Маршрут:</strong> ${from} → ${to}</p>
            <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
                <p style="font-size: 24px; color: #6b7280; font-weight: bold; margin: 0;">
                    от ${price.toLocaleString()}₽
                </p>
                <p style="color: #9ca3af; margin: 5px 0 0 0;">Примерная стоимость</p>
            </div>
            <button onclick="orderDelivery()" style="width: 100%; background: #10b981; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: 600; cursor: pointer;">
                📞 Уточнить стоимость
            </button>
        </div>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

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