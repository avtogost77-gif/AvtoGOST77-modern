// =======================================================
// 🚛 MAIN.JS - ОСНОВНОЙ СКРИПТ АВТОГОСТ
// =======================================================

// Глобальная переменная для калькулятора
let smartCalculatorV2;

// ===============================================
// ВОРОНКА ПРОДАЖ - МОДАЛЬНЫЕ ОКНА И ИНТЕРАКТИВНОСТЬ
// ===============================================

// Анимация живого счетчика
function animateActiveUsers() {
    const counter = document.getElementById('activeUsers');
    if (!counter) return;
    
    const minUsers = 3;
    const maxUsers = 12;
    
    setInterval(() => {
        const currentValue = parseInt(counter.textContent);
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        let newValue = currentValue + change;
        
        // Ограничиваем диапазон
        newValue = Math.max(minUsers, Math.min(maxUsers, newValue));
        
        if (newValue !== currentValue) {
            counter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counter.textContent = newValue;
                counter.style.transform = 'scale(1)';
            }, 150);
        }
    }, Math.random() * 10000 + 5000); // 5-15 секунд
}

// Срочный заказ
function openUrgentModal() {
    const modal = createModal('urgent', {
        title: '⚡ Срочная доставка за 2 часа',
        subtitle: 'Заполните заявку и мы свяжемся с вами в течение 3 минут',
        fields: [
            { name: 'urgentName', type: 'text', placeholder: 'Ваше имя', required: true },
            { name: 'urgentPhone', type: 'tel', placeholder: '+7 (999) 123-45-67', required: true },
            { name: 'urgentFrom', type: 'text', placeholder: 'Откуда забрать груз', required: true },
            { name: 'urgentTo', type: 'text', placeholder: 'Куда доставить', required: true },
            { name: 'urgentCargo', type: 'text', placeholder: 'Описание груза', required: true }
        ],
        buttonText: 'Заказать срочно',
        source: 'urgent-delivery'
    });
}

// Аудит экономии
function openSavingsModal() {
    const modal = createModal('savings', {
        title: '💰 Бесплатный аудит расходов',
        subtitle: 'Узнайте, сколько переплачиваете за логистику',
        fields: [
            { name: 'savingsName', type: 'text', placeholder: 'Ваше имя', required: true },
            { name: 'savingsPhone', type: 'tel', placeholder: '+7 (999) 123-45-67', required: true },
            { name: 'savingsCompany', type: 'text', placeholder: 'Название компании', required: true },
            { name: 'savingsMonthlySpend', type: 'number', placeholder: 'Тратите на логистику в месяц (₽)', required: true },
            { name: 'savingsRoutes', type: 'text', placeholder: 'Основные маршруты', required: false }
        ],
        buttonText: 'Получить аудит',
        source: 'savings-audit',
        extraInfo: 'Аудит проводится бесплатно в течение 24 часов'
    });
}

// Консультация
function openConsultationModal() {
    const modal = createModal('consultation', {
        title: '🤝 Консультация эксперта',
        subtitle: '15 минут с экспертом по логистике',
        fields: [
            { name: 'consultName', type: 'text', placeholder: 'Ваше имя', required: true },
            { name: 'consultPhone', type: 'tel', placeholder: '+7 (999) 123-45-67', required: true },
            { name: 'consultEmail', type: 'email', placeholder: 'email@company.ru', required: false },
            { name: 'consultTopic', type: 'select', placeholder: 'Выберите тему', options: [
                'Оптимизация расходов',
                'Выбор перевозчика', 
                'Организация логистики',
                'Срочные доставки',
                'Другое'
            ], required: true },
            { name: 'consultTime', type: 'select', placeholder: 'Удобное время', options: [
                'Сегодня до 18:00',
                'Завтра утром',
                'Завтра вечером',
                'В течение недели'
            ], required: true }
        ],
        buttonText: 'Записаться на консультацию',
        source: 'consultation',
        extraInfo: 'Консультация проводится бесплатно'
    });
}

// Коммерческое предложение
function openComparisonModal() {
    const modal = createModal('comparison', {
        title: '📊 Персональное КП',
        subtitle: 'Получите индивидуальные условия для вашего бизнеса',
        fields: [
            { name: 'companyName', type: 'text', placeholder: 'Название компании', required: true },
            { name: 'contactName', type: 'text', placeholder: 'Контактное лицо', required: true },
            { name: 'contactPhone', type: 'tel', placeholder: '+7 (999) 123-45-67', required: true },
            { name: 'contactEmail', type: 'email', placeholder: 'email@company.ru', required: true },
            { name: 'cargoTypes', type: 'text', placeholder: 'Типы грузов', required: true },
            { name: 'monthlyVolume', type: 'text', placeholder: 'Объем перевозок в месяц', required: true },
            { name: 'currentProvider', type: 'text', placeholder: 'Текущий перевозчик (если есть)', required: false }
        ],
        buttonText: 'Получить КП',
        source: 'commercial-offer',
        extraInfo: 'КП будет готово в течение 2 часов'
    });
}

// Универсальная функция создания модального окна
function createModal(type, config) {
    // Создаем HTML модального окна
    const modalHTML = `
        <div class="modal-overlay" id="modal-${type}">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${config.title}</h3>
                    <button class="modal-close" onclick="closeModal('${type}')">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="modal-subtitle">${config.subtitle}</p>
                    <form class="modal-form" onsubmit="submitModal(event, '${type}', '${config.source}')">
                        ${config.fields.map(field => {
                            if (field.type === 'select') {
                                return `
                                    <div class="form-group">
                                        <select name="${field.name}" ${field.required ? 'required' : ''}>
                                            <option value="">${field.placeholder}</option>
                                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                                        </select>
                                    </div>
                                `;
                            } else {
                                return `
                                    <div class="form-group">
                                        <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
                                    </div>
                                `;
                            }
                        }).join('')}
                        ${config.extraInfo ? `<p class="modal-info">${config.extraInfo}</p>` : ''}
                        <button type="submit" class="btn btn-primary btn-lg">
                            ${config.buttonText}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем в DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Показываем модальное окно
    const modal = document.getElementById(`modal-${type}`);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Закрытие по клику на overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(type);
        }
    });
    
    return modal;
}

// Закрытие модального окна
function closeModal(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Отправка формы модального окна
async function submitModal(event, type, source) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Показываем загрузку
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Отправляем...';
    button.disabled = true;
    
    try {
        // Отправляем в Telegram
        const success = await sendToTelegram({
            ...data,
            source: source,
            timestamp: new Date().toLocaleString('ru-RU')
        });
        
        if (success) {
            // Показываем успех
            form.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">✅</div>
                    <h4>Заявка отправлена!</h4>
                    <p>Мы свяжемся с вами в течение 15 минут</p>
                    <button class="btn btn-outline" onclick="closeModal('${type}')">Закрыть</button>
                </div>
            `;
            
            // Автозакрытие через 5 секунд
            setTimeout(() => closeModal(type), 5000);
            
        } else {
            throw new Error('Ошибка отправки');
        }
        
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        button.textContent = 'Ошибка. Попробуйте еще раз';
        button.disabled = false;
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
}

// CSS стили для модальных окон
const modalStyles = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    }
    
    .modal-content {
        background: white;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2rem 0;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--neutral-900);
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--neutral-500);
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .modal-subtitle {
        color: var(--neutral-600);
        margin-bottom: 1.5rem;
    }
    
    .modal-form .form-group {
        margin-bottom: 1rem;
    }
    
    .modal-form input,
    .modal-form select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--neutral-200);
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color var(--transition-fast);
    }
    
    .modal-form input:focus,
    .modal-form select:focus {
        outline: none;
        border-color: var(--primary-500);
    }
    
    .modal-info {
        font-size: 0.875rem;
        color: var(--neutral-600);
        background: var(--neutral-50);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .success-message {
        text-align: center;
        padding: 2rem;
    }
    
    .success-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .success-message h4 {
        color: var(--success);
        margin-bottom: 1rem;
    }
`;

// Добавляем стили
if (!document.getElementById('modal-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'modal-styles';
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Main.js loaded');
    
    // Инициализация калькулятора
    initCalculator();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация плавающих кнопок
    initFloatingButtons();
    
    // Инициализация форм
    initForms();

    // Запускаем анимацию счетчика
    animateActiveUsers();
    
    // Анимация счетчика слотов (уменьшается каждые 10-20 минут)
    const slotsCounter = document.querySelector('.slots-counter');
    if (slotsCounter) {
        setInterval(() => {
            const current = parseInt(slotsCounter.textContent);
            if (current > 1 && Math.random() > 0.8) {
                slotsCounter.textContent = current - 1;
                slotsCounter.style.animation = 'none';
                setTimeout(() => {
                    slotsCounter.style.animation = 'pulse-red 2s infinite';
                }, 100);
            }
        }, Math.random() * 600000 + 600000); // 10-20 минут
    }
});

// Инициализация калькулятора
function initCalculator() {
    try {
        if (typeof SmartCalculatorV2 !== 'undefined') {
            smartCalculatorV2 = new SmartCalculatorV2();
            window.smartCalculatorV2 = smartCalculatorV2; // Глобальный доступ
            console.log('✅ SmartCalculatorV2 initialized');
        } else {
            console.error('❌ SmartCalculatorV2 class not found');
            // Повторяем попытку через 1 секунду
            setTimeout(initCalculator, 1000);
        }
    } catch (error) {
        console.error('❌ Calculator initialization error:', error);
    }
}

// Инициализация форм
function initForms() {
    // Форма калькулятора
    const calcForm = document.getElementById('calculatorForm');
    if (calcForm) {
        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Form submitted');
            handleCalculation();
        });
    }
    
    // Кнопка расчёта по ID
    const calcButton = document.getElementById('calculateButton');
    if (calcButton) {
        calcButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Calculate button clicked');
            handleCalculation();
        });
        console.log('✅ Calculate button listener added');
    } else {
        console.error('❌ Calculate button not found');
    }
    
    // Резервный обработчик для старых onclick
    const oldButton = document.querySelector('button[onclick*="handleCalculation"]');
    if (oldButton) {
        oldButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Old button clicked');
            handleCalculation();
        });
    }
}

// Универсальная функция расчёта
function handleCalculation() {
    console.log('🧮 Starting calculation...');
    
    if (smartCalculatorV2 && typeof smartCalculatorV2.handleCalculation === 'function') {
        try {
            smartCalculatorV2.handleCalculation();
            console.log('✅ Calculator method called');
        } catch (error) {
            console.error('❌ Calculator error:', error);
            alert('Ошибка расчёта: ' + error.message);
        }
    } else {
        console.error('❌ Calculator not ready');
        alert('Калькулятор загружается, попробуйте через секунду');
        
        // Попытка повторной инициализации
        setTimeout(() => {
            initCalculator();
            setTimeout(handleCalculation, 500);
        }, 1000);
    }
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// Плавающие кнопки
function initFloatingButtons() {
    // Кнопки уже инициализированы в HTML
}

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Глобальный доступ к функциям
window.smartCalculatorV2 = smartCalculatorV2;
window.handleCalculation = handleCalculation;