/* =============================================================================
   JAVASCRIPT ДЛЯ ЗАМОРОЗКИ ЦЕНЫ
   ============================================================================= */

// Глобальные переменные для хранения данных расчета
let currentCalculation = {
    price: 0,
    route: '',
    vehicle: '',
    distance: '',
    weight: '',
    volume: '',
    additionalServices: []
};

// Функция открытия модального окна заморозки цены
function openPriceFreezeModal() {
    // Собираем данные текущего расчета
    collectCalculationData();
    
    // Показываем модальное окно
    const modal = document.getElementById('priceFreezeModal');
    modal.style.display = 'flex';
    
    // Добавляем класс для анимации
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
}

// Функция закрытия модального окна
function closePriceFreezeModal() {
    const modal = document.getElementById('priceFreezeModal');
    modal.classList.remove('show');
    
    // Скрываем модальное окно после анимации
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Сбор данных текущего расчета
function collectCalculationData() {
    const priceElement = document.getElementById('priceDisplay');
    const vehicleElement = document.getElementById('vehicleDisplay');
    const distanceElement = document.getElementById('distanceDisplay');
    
    if (priceElement) {
        const priceText = priceElement.textContent;
        currentCalculation.price = extractPrice(priceText);
    }
    
    if (vehicleElement) {
        currentCalculation.vehicle = vehicleElement.textContent;
    }
    
    if (distanceElement) {
        currentCalculation.distance = distanceElement.textContent;
    }
    
    // Собираем данные из формы калькулятора
    const form = document.getElementById('calculatorForm');
    if (form) {
        const formData = new FormData(form);
        currentCalculation.route = formData.get('route') || '';
        currentCalculation.weight = formData.get('weight') || '';
        currentCalculation.volume = formData.get('volume') || '';
        
        // Собираем дополнительные услуги
        const additionalServices = form.querySelectorAll('input[name="additionalServices"]:checked');
        currentCalculation.additionalServices = Array.from(additionalServices).map(service => service.value);
    }
}

// Извлечение цены из текста
function extractPrice(priceText) {
    const match = priceText.match(/[\d\s]+/);
    if (match) {
        return parseInt(match[0].replace(/\s/g, ''));
    }
    return 0;
}

// Обработка отправки формы заморозки цены
document.addEventListener('DOMContentLoaded', function() {
    const freezeForm = document.getElementById('priceFreezeForm');
    
    if (freezeForm) {
        freezeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePriceFreezeSubmit();
        });
    }
    
    // Закрытие модального окна при клике вне его
    const modal = document.getElementById('priceFreezeModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePriceFreezeModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePriceFreezeModal();
        }
    });
});

// Обработка отправки формы
async function handlePriceFreezeSubmit() {
    const form = document.getElementById('priceFreezeForm');
    const submitBtn = document.getElementById('freezeSubmitBtn');
    
    // Показываем состояние загрузки
    submitBtn.innerHTML = '⏳ Отправляем...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(form);
        
        // Добавляем данные расчета
        formData.append('calculationData', JSON.stringify(currentCalculation));
        formData.append('freezeType', 'price_freeze');
        formData.append('freezeDuration', '3_days');
        
        // Отправляем данные
        const response = await fetch('/api/price-freeze', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Успешная отправка
            showSuccessMessage();
            
            // Генерируем и отправляем расширенный PDF
            await generateExtendedPDF(formData);
            
            // Закрываем модальное окно
            setTimeout(() => {
                closePriceFreezeModal();
                resetForm(form);
            }, 2000);
            
        } else {
            throw new Error('Ошибка отправки');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showErrorMessage();
    } finally {
        // Восстанавливаем кнопку
        submitBtn.innerHTML = '🔒 Зафиксировать цену';
        submitBtn.disabled = false;
    }
}

// Показ сообщения об успехе
function showSuccessMessage() {
    const submitBtn = document.getElementById('freezeSubmitBtn');
    submitBtn.innerHTML = '✅ Цена зафиксирована!';
    submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
    
    // Показываем уведомление
    showNotification('✅ Цена успешно зафиксирована на 3 дня! Проверьте email.', 'success');
}

// Показ сообщения об ошибке
function showErrorMessage() {
    const submitBtn = document.getElementById('freezeSubmitBtn');
    submitBtn.innerHTML = '❌ Ошибка отправки';
    submitBtn.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
    
    // Показываем уведомление
    showNotification('❌ Произошла ошибка. Попробуйте еще раз или позвоните нам.', 'error');
    
    // Восстанавливаем кнопку через 3 секунды
    setTimeout(() => {
        submitBtn.innerHTML = '🔒 Зафиксировать цену';
        submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
    }, 3000);
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Добавляем стили
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
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Генерация расширенного PDF
async function generateExtendedPDF(formData) {
    try {
        const response = await fetch('/api/generate-extended-pdf', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Создаем ссылку для скачивания
            const a = document.createElement('a');
            a.href = url;
            a.download = `КП_АвтоГОСТ_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
    }
}

// Сброс формы
function resetForm(form) {
    form.reset();
    const submitBtn = document.getElementById('freezeSubmitBtn');
    submitBtn.innerHTML = '🔒 Зафиксировать цену';
    submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
}

// Анимация появления уведомления
const priceFreezeStyle = document.createElement('style');
priceFreezeStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(priceFreezeStyle);
