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

// ========================================================
// 🎯 EXIT-INTENT POPUP SYSTEM V2.0
// Исправлены баги для мобильных устройств
// ========================================================

let exitIntentShown = false;

// Инициализация exit-intent системы
function initExitIntent() {
    // Проверяем, показывали ли уже в этой сессии
    if (sessionStorage.getItem('exitIntentShown') === 'true') {
        exitIntentShown = true;
        return;
    }
    
    // МОБИЛЬНЫЕ УСТРОЙСТВА - другая логика
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (isMobile) {
        // МОБИЛЬНЫЕ: Минимум 2 минуты после загрузки страницы
        let isEarlySession = true;
        setTimeout(() => {
            isEarlySession = false;
        }, 120000); // 2 минуты
        
        // На мобильных показываем только при скролле вверх или долгом бездействии
        let lastScrollY = window.scrollY;
        let scrollUpCount = 0;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Если скроллим вверх и находимся не в самом верху
            if (currentScrollY < lastScrollY && currentScrollY > 200) {
                scrollUpCount++;
                // Показываем после 5х скроллов вверх (больше терпения)
                if (scrollUpCount >= 5 && !exitIntentShown && !isEarlySession) {
                    // showExitIntentPopup(); // ОТКЛЮЧЕНО
                }
            } else {
                scrollUpCount = Math.max(0, scrollUpCount - 1);
            }
            
            lastScrollY = currentScrollY;
        });
        
        // Долгое бездействие на мобильных (10 минут)
        setTimeout(() => {
            if (!exitIntentShown && !isEarlySession) {
                // showExitIntentPopup(); // ОТКЛЮЧЕНО
            }
        }, 600000); // 10 минут
        
    } else {
        // ДЕСКТОП - классические триггеры
        
        // ДЕСКТОП: Минимум 30 секунд после загрузки страницы
        let isEarlyDesktopSession = true;
        setTimeout(() => {
            isEarlyDesktopSession = false;
        }, 30000); // 30 секунд
        
        // Отслеживаем движение мыши для desktop
        document.addEventListener('mouseleave', function(e) {
            // Если мышь ушла за верхний край экрана (к закрытию/адресной строке)
            if (e.clientY <= 0 && !exitIntentShown && !isEarlyDesktopSession) {
                // showExitIntentPopup(); // ОТКЛЮЧЕНО
            }
        });
        
        // Попытка закрыть вкладку (только desktop)
        window.addEventListener('beforeunload', function(e) {
            if (!exitIntentShown && !isEarlyDesktopSession) {
                // Показываем popup (не блокируем закрытие)
                // showExitIntentPopup(); // ОТКЛЮЧЕНО
            }
        });
        
        // Бездействие на desktop (5 минут)
        let inactivityTimer = setTimeout(() => {
            if (!exitIntentShown && !isEarlyDesktopSession) {
                // showExitIntentPopup(); // ОТКЛЮЧЕНО
            }
        }, 300000); // 5 минут
        
        // Сбрасываем таймер при активности
        document.addEventListener('mousemove', () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (!exitIntentShown && !isEarlyDesktopSession) {
                    // showExitIntentPopup(); // ОТКЛЮЧЕНО
                }
            }, 300000); // 5 минут
        });
    }
}

// Показать exit-intent popup
function showExitIntentPopup() {
    if (exitIntentShown) return;
    
    exitIntentShown = true;
    sessionStorage.setItem('exitIntentShown', 'true');
    
    // Находим существующий popup в HTML
    const popup = document.getElementById('exitIntentPopup');
    if (!popup) {
        return;
    }
    
    // Показываем с анимацией
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Запуск таймера обратного отсчета
    startExitCountdown();
    
    // Анимация счетчика использований
    animateExitProof();
}

// ГЛОБАЛЬНАЯ функция закрытия popup
window.closeExitPopup = function() {
    const popup = document.getElementById('exitIntentPopup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
};

// Создание exit-intent popup
function createExitIntentPopup(discount) {
    const popupHTML = `
        <div class="exit-intent-overlay" id="exitIntentPopup">
            <div class="exit-intent-content">
                <div class="exit-intent-header">
                    <div class="exit-emoji">🛑</div>
                    <h3>Подождите! Последнее предложение</h3>
                    <button class="exit-close" onclick="closeExitIntent()">&times;</button>
                </div>
                
                <div class="exit-intent-body">
                    <div class="discount-badge">
                        <span class="discount-percent">${discount}%</span>
                        <span class="discount-text">СКИДКА</span>
                    </div>
                    
                    <h4>Получите расчет стоимости со скидкой ${discount}%</h4>
                    <p>Предложение действует только сейчас!</p>
                    
                    <div class="urgency-timer-exit">
                        <span class="timer-text">Предложение истекает через:</span>
                        <div class="countdown" id="exitCountdown">
                            <span id="exitMinutes">14</span>:<span id="exitSeconds">59</span>
                        </div>
                    </div>
                    
                    <form class="exit-form" onsubmit="submitExitForm(event, ${discount})">
                        <input type="text" name="exitName" placeholder="Ваше имя" required>
                        <input type="tel" name="exitPhone" placeholder="+7 (999) 123-45-67" required>
                        <input type="text" name="exitRoute" placeholder="Маршрут (например: Москва - СПб)" required>
                        
                        <button type="submit" class="btn btn-success btn-lg exit-btn">
                            🎯 Получить расчет со скидкой ${discount}%
                        </button>
                        
                        <p class="exit-guarantee">
                            ✅ Расчет в течение 15 минут<br>
                            ✅ Без скрытых доплат<br>
                            ✅ Промокод: <strong>EXIT${discount}</strong>
                        </p>
                    </form>
                    
                    <div class="exit-social-proof">
                        <span class="proof-text">🔥 Уже воспользовались:</span>
                        <span class="proof-count" id="exitProofCount">127</span>
                        <span class="proof-label">человек сегодня</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    const popup = document.getElementById('exitIntentPopup');
    
    // Закрытие по клику на overlay
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closeExitIntent();
        }
    });
    
    // Запуск таймера обратного отсчета
    startExitCountdown();
    
    // Анимация счетчика использований
    animateExitProof();
    
    return popup;
}

// Обратный отсчет в exit popup
function startExitCountdown() {
    let totalSeconds = 15 * 60 - 1; // 14:59
    
    const countdown = setInterval(() => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const minutesEl = document.getElementById('exitMinutes');
        const secondsEl = document.getElementById('exitSeconds');
        
        if (minutesEl && secondsEl) {
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            // Красный цвет когда остается мало времени
            if (totalSeconds <= 60) {
                const countdownEl = document.getElementById('exitCountdown');
                if (countdownEl) {
                    countdownEl.classList.add('urgent');
                }
            }
        } else {
            // Если элементы не найдены, останавливаем таймер
            clearInterval(countdown);
            return;
        }
        
        totalSeconds--;
        
        if (totalSeconds < 0) {
            clearInterval(countdown);
            // Время истекло
            if (minutesEl && secondsEl) {
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
            }
        }
    }, 1000);
    
    return countdown;
}

// Анимация счетчика "воспользовались сегодня"
function animateExitProof() {
    const counter = document.getElementById('exitProofCount');
    if (!counter) return;
    
    // Случайно увеличиваем счетчик каждые 10-30 секунд
    setInterval(() => {
        const current = parseInt(counter.textContent) || 23;
        const increase = Math.floor(Math.random() * 3) + 1; // +1-3
        counter.textContent = current + increase;
        
        // Анимация изменения
        counter.style.transform = 'scale(1.2)';
        counter.style.color = '#10b981';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
            counter.style.color = '#10b981';
        }, 200);
    }, Math.random() * 20000 + 10000); // 10-30 секунд
}

// Отправка формы exit-intent
async function submitExitForm(event, discount) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '📤 Отправляем...';
    button.disabled = true;
    
    try {
        const success = await sendToTelegram({
            ...data,
            source: 'exit-intent',
            discount: `${discount}%`,
            promoCode: `EXIT${discount}`,
            timestamp: new Date().toLocaleString('ru-RU')
        });
        
        if (success) {
            // Показываем успех
            form.innerHTML = `
                <div class="exit-success">
                    <div class="success-icon">🎉</div>
                    <h4>Заявка принята!</h4>
                    <p>Ваш промокод: <strong>EXIT${discount}</strong></p>
                    <p>Менеджер свяжется с вами в течение 15 минут</p>
                    
                    <div class="success-actions">
                        <a href="https://wa.me/79162720932" class="btn btn-whatsapp btn-sm" target="_blank">
                            💬 Написать в WhatsApp
                        </a>
                        <button class="btn btn-outline btn-sm" onclick="closeExitIntent()">
                            Закрыть
                        </button>
                    </div>
                </div>
            `;
            
            // Автозакрытие через 10 секунд
            setTimeout(() => {
                closeExitIntent();
            }, 10000);
            
        } else {
            throw new Error('Ошибка отправки');
        }
        
    } catch (error) {
        button.innerHTML = '❌ Ошибка. Попробуйте еще раз';
        button.disabled = false;
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 3000);
    }
}

// Закрытие exit-intent popup
function closeExitIntent() {
    const popup = document.getElementById('exitIntentPopup');
    if (popup) {
        popup.classList.add('hiding');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    
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

    // Инициализация exit-intent
    // initExitIntent(); // ОТКЛЮЧЕНО - попап раздражает
});

// Инициализация калькулятора
function initCalculator() {
    try {
        if (typeof SmartCalculatorV2 !== 'undefined') {
            smartCalculatorV2 = new SmartCalculatorV2();
            window.smartCalculatorV2 = smartCalculatorV2; // Глобальный доступ
        } else {
            // Повторяем попытку через 1 секунду
            setTimeout(initCalculator, 1000);
        }
    } catch (error) {
    }
}

// Инициализация форм
function initForms() {
    // Форма калькулятора
    const calcForm = document.getElementById('calculatorForm');
    if (calcForm) {
        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCalculation();
        });
    }
    
    // Кнопка расчёта по ID
    const calcButton = document.getElementById('calculateButton');
    if (calcButton) {
        calcButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleCalculation();
        });
    } else {
    }
    
    // Резервный обработчик для старых onclick
    const oldButton = document.querySelector('button[onclick*="handleCalculation"]');
    if (oldButton) {
        oldButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleCalculation();
        });
    }
}

// Универсальная функция расчёта
function handleCalculation() {
    
    if (smartCalculatorV2 && typeof smartCalculatorV2.handleCalculation === 'function') {
        try {
            smartCalculatorV2.handleCalculation();
        } catch (error) {
            alert('Ошибка расчёта: ' + error.message);
        }
    } else {
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
window.handleCalculation = handleCalculation;// ===============================================
// СОВРЕМЕННЫЙ ИНТЕРФЕЙС КАЛЬКУЛЯТОРА
// ===============================================

class CalculatorUI {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
    }

    bindEvents() {
        // Навигация по шагам
        document.getElementById('nextStep1')?.addEventListener('click', () => this.nextStep());
        document.getElementById('nextStep2')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prevStep2')?.addEventListener('click', () => this.prevStep());
        document.getElementById('prevStep3')?.addEventListener('click', () => this.prevStep());
        
        // Кнопка расчета
        document.getElementById('calculateButton')?.addEventListener('click', () => this.calculate());
        
        // Новый расчет
        document.getElementById('newCalculation')?.addEventListener('click', () => this.resetCalculator());
        
        // Валидация полей
        this.setupFieldValidation();
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
            this.updateUI();
        }
    }

    prevStep() {
        this.currentStep = Math.max(this.currentStep - 1, 1);
        this.updateUI();
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateRoute();
            case 2:
                return this.validateCargo();
            default:
                return true;
        }
    }

    validateRoute() {
        const fromCity = document.getElementById('fromCity').value.trim();
        const toCity = document.getElementById('toCity').value.trim();
        
        if (!fromCity) {
            this.showError('fromCity', 'Укажите город отправления');
            return false;
        }
        
        if (!toCity) {
            this.showError('toCity', 'Укажите город назначения');
            return false;
        }
        
        if (fromCity.toLowerCase() === toCity.toLowerCase()) {
            this.showError('toCity', 'Города отправления и назначения не могут совпадать');
            return false;
        }
        
        this.clearErrors();
        return true;
    }

    validateCargo() {
        const weight = document.getElementById('weight').value;
        
        if (!weight || weight <= 0) {
            this.showError('weight', 'Укажите вес груза');
            return false;
        }
        
        if (weight > 20000) {
            this.showError('weight', 'Максимальный вес: 20 тонн. Для больших грузов свяжитесь с менеджером');
            return false;
        }
        
        this.clearErrors();
        return true;
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem;';
        
        // Удаляем предыдущую ошибку
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc2626';
        
        // Анимация ошибки
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    clearErrors() {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.form-control').forEach(field => {
            field.style.borderColor = '#e5e7eb';
        });
    }

    updateUI() {
        // Обновляем шаги
        document.querySelectorAll('.calc-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });
        
        // Обновляем прогресс
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        this.updateProgress();
        
        // Обновляем кнопки
        this.updateButtons();
    }

    updateProgress() {
        const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    updateButtons() {
        // Обновляем текст кнопки расчета
        const calculateBtn = document.getElementById('calculateButton');
        if (calculateBtn) {
            const btnText = calculateBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = 'Рассчитать стоимость';
            }
        }
    }

    async calculate() {
        const calculateBtn = document.getElementById('calculateButton');
        const btnText = calculateBtn.querySelector('.btn-text');
        const btnLoading = calculateBtn.querySelector('.btn-loading');
        
        // Показываем загрузку
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        calculateBtn.disabled = true;
        
        try {
            // Получаем данные формы
            const formData = this.getFormData();
            
            // Вызываем существующий калькулятор
            if (window.calculator) {
                const result = await window.calculator.calculatePrice(formData);
                this.showResult(result);
            } else {
                throw new Error('Калькулятор не инициализирован');
            }
        } catch (error) {
            this.showError('calculateButton', 'Ошибка расчета. Попробуйте еще раз.');
        } finally {
            // Скрываем загрузку
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            calculateBtn.disabled = false;
        }
    }

    getFormData() {
        return {
            from: document.getElementById('fromCity').value.trim(),
            to: document.getElementById('toCity').value.trim(),
            weight: parseFloat(document.getElementById('weight').value) || 0,
            volume: parseFloat(document.getElementById('volume').value) || 0,
            isConsolidated: document.getElementById('isConsolidated').checked
        };
    }

    showResult(result) {
        const resultContainer = document.getElementById('calculatorResult');
        const resultPrice = document.getElementById('resultPrice');
        const resultSubtitle = document.getElementById('resultSubtitle');
        const resultDetails = document.getElementById('resultDetails');
        
        // Обновляем цену
        resultPrice.textContent = this.formatPrice(result.price);
        
        // Обновляем подзаголовок
        const route = `${result.from} → ${result.to}`;
        resultSubtitle.textContent = `${route} • ${result.weight} кг`;
        
        // Обновляем детали
        resultDetails.innerHTML = this.generateResultDetails(result);
        
        // Показываем результат
        resultContainer.classList.add('show');
        
        // Прокручиваем к результату
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Анимация появления
        resultContainer.style.animation = 'fadeInScale 0.4s ease-out';
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    generateResultDetails(result) {
        const details = [];
        
        if (result.transport) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Транспорт</div>
                    <div class="detail-value">${result.transport}</div>
                </div>
            `);
        }
        
        if (result.distance) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Расстояние</div>
                    <div class="detail-value">${result.distance} км</div>
                </div>
            `);
        }
        
        if (result.deliveryTime) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Срок доставки</div>
                    <div class="detail-value">${result.deliveryTime}</div>
                </div>
            `);
        }
        
        if (result.pricePerKm) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Тариф за км</div>
                    <div class="detail-value">${result.pricePerKm} ₽/км</div>
                </div>
            `);
        }
        
        return details.join('');
    }

    resetCalculator() {
        // Сбрасываем форму
        document.getElementById('calculatorForm').reset();
        
        // Скрываем результат
        document.getElementById('calculatorResult').classList.remove('show');
        
        // Возвращаемся к первому шагу
        this.currentStep = 1;
        this.updateUI();
        
        // Очищаем ошибки
        this.clearErrors();
        
        // Прокручиваем к началу калькулятора
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }

    setupFieldValidation() {
        // Автоматическая валидация при вводе
        const fields = ['fromCity', 'toCity', 'weight'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    const error = field.parentNode.querySelector('.field-error');
                    if (error) {
                        error.remove();
                        field.style.borderColor = '#e5e7eb';
                    }
                });
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Ждем инициализации основного калькулятора
    setTimeout(() => {
        window.calculatorUI = new CalculatorUI();
    }, 100);
});

// CSS анимация для ошибок
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
// Простой обработчик форм для MVP
document.addEventListener('DOMContentLoaded', function() {
    
    // Обработка контактной формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = new FormData(this);
            const data = {
                name: formData.get('name') || 'Не указано',
                phone: formData.get('phone') || 'Не указан',
                email: formData.get('email') || 'Не указан',
                message: formData.get('message') || 'Без сообщения',
                timestamp: new Date().toLocaleString('ru-RU')
            };
            
            // Определяем источник заявки
            const source = data.name === 'Не указано' && data.email === 'Не указан' ? 'services-form' : 'contact-form';
            
            // Формируем текст для отправки
            const text = `
🚛 НОВАЯ ЗАЯВКА С САЙТА!

👤 Имя: ${data.name}
📱 Телефон: ${data.phone}
📧 Email: ${data.email}
💬 Сообщение: ${data.message}
🕐 Время: ${data.timestamp}
            `.trim();
            
            // Показываем успех
            showNotification('Заявка отправлена! Мы свяжемся с вами в течение 10 минут.', 'success');
            
            // Очищаем форму
            this.reset();
            
            // Отправляем в Telegram через father_bot
            try {
                const success = await sendToTelegram(text, source);
                
                // Логируем только статус отправки (без данных)
                if (success) {
              
                } else {
                }
            } catch (error) {
            }
        });
    } else {
    }
    
    // Обработка лид-формы калькулятора
    const leadForm = document.getElementById('calculatorLeadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = new FormData(this);
            const data = {
                name: formData.get('name') || 'Не указано',
                phone: formData.get('phone') || 'Не указан',
                email: formData.get('email') || 'Не указан',
                comment: formData.get('comment') || 'Без комментария',
                timestamp: new Date().toLocaleString('ru-RU')
            };
            
            // Формируем текст для отправки
            const text = `
🎯 НОВЫЙ ЛИД С КАЛЬКУЛЯТОРА!

👤 Имя: ${data.name}
📱 Телефон: ${data.phone}
📧 Email: ${data.email}
💭 Комментарий: ${data.comment}
🕐 Время: ${data.timestamp}
🎁 Промокод: GOST10 (-10%)
            `.trim();
            
            // Показываем успех
            showNotification('Заявка отправлена! Мы свяжемся с вами в течение 10 минут.', 'success');
            
            // Очищаем форму
            this.reset();
            
            // Скрываем форму
            const leadFormContainer = document.getElementById('leadForm');
            if (leadFormContainer) {
                leadFormContainer.style.display = 'none';
            }
            
            // Отправляем в Telegram
            try {
                const success = await sendToTelegram(text, 'calculator-lead');
                
                if (success) {
                } else {
                }
            } catch (error) {
            }
        });
    } else {
    }
    
    // Инициализация согласия на обработку данных
    initPrivacyConsent();
});

// Функция отправки в Telegram
async function sendToTelegram(message, source = 'form') {
    try {
        const botToken = '7999458907:AAGOAjQLmEZuT4SFx4Upl1GjuXO0yFuWok8';
        const chatId = '399711407'; // ID менеджера
        
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

// Простые уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Валидация согласия на обработку персональных данных
function initPrivacyConsent() {
    const consentCheckbox = document.getElementById('privacyConsent');
    const submitBtn = document.getElementById('leadSubmitBtn') || document.getElementById('contactSubmitBtn');
    
    if (consentCheckbox && submitBtn) {
        // Проверяем состояние чекбокса при загрузке
        submitBtn.disabled = !consentCheckbox.checked;
        
        // Слушаем изменения чекбокса
        consentCheckbox.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
            
            if (this.checked) {
                submitBtn.classList.remove('btn-disabled');
                submitBtn.classList.add('btn-primary');
            } else {
                submitBtn.classList.add('btn-disabled');
                submitBtn.classList.remove('btn-primary');
            }
        });
    } else {
    }
}

// Добавляем стили анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);// Lazy Loading для изображений document.addEventListener('DOMContentLoaded', function() { // Native lazy loading для современных браузеров if ('loading' in HTMLImageElement.prototype) { const images = document.querySelectorAll('img[loading="lazy"]'); images.forEach(img => { img.src = img.dataset.src || img.src; }); } else { // Fallback для старых браузеров const script = document.createElement('script'); script.src = '/assets/js/lazysizes.min.js'; document.body.appendChild(script); } // Intersection Observer для плавной загрузки const imageObserver = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; img.src = img.dataset.src || img.src; img.classList.add('loaded'); observer.unobserve(img); } }); }, { rootMargin: '50px 0px', threshold: 0.01 }); // Наблюдаем за всеми изображениями с data-src document.querySelectorAll('img[data-src]').forEach(img => { imageObserver.observe(img); }); });// Mobile Collapse Functionality
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
/**
 * Анимированный счетчик для hero-статистики
 * Плавно увеличивает числа от 0 до целевого значения
 */
class AnimatedCounter {
  constructor() {
    this.counters = [];
    this.init();
  }

  init() {
    // Находим все счетчики
    const counterElements = document.querySelectorAll('.stat-number[data-target]');
    
    counterElements.forEach(element => {
      const target = parseFloat(element.getAttribute('data-target'));
      const duration = 2000; // 2 секунды
      const step = target / (duration / 16); // 60 FPS
      
      this.counters.push({
        element,
        target,
        current: 0,
        step,
        isAnimating: false
      });
    });

    // Запускаем анимацию при скролле
    this.setupScrollAnimation();
  }

  setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = this.counters.find(c => c.element === entry.target);
          if (counter && !counter.isAnimating) {
            this.animateCounter(counter);
          }
        }
      });
    }, {
      threshold: 0.5
    });

    this.counters.forEach(counter => {
      observer.observe(counter.element);
    });
  }

  animateCounter(counter) {
    counter.isAnimating = true;
    counter.element.classList.add('animated');

    const animate = () => {
      counter.current += counter.step;
      
      if (counter.current >= counter.target) {
        counter.current = counter.target;
        counter.element.textContent = this.formatNumber(counter.target);
        counter.isAnimating = false;
        return;
      }

      counter.element.textContent = this.formatNumber(counter.current);
      requestAnimationFrame(animate);
    };

    animate();
  }

  formatNumber(num) {
    if (num % 1 === 0) {
      return Math.floor(num).toString();
    } else {
      return num.toFixed(1);
    }
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  new AnimatedCounter();
});
/**
 * UX УЛУЧШЕНИЯ - TL;DR, АККОРДЕОНЫ, STICKY TOC
 * Современные компоненты для улучшения пользовательского опыта
 */

class UXImprovements {
  constructor() {
    this.init();
  }

  init() {
    this.setupAccordions();
    this.setupStickyTOC();
    this.setupTLDR();
    this.setupLazyLoading();
    this.setupScrollAnimations();
    this.setupCalculatorEnhancements();
    this.setupMobileStickyActions();
  }

  // АККОРДЕОНЫ
  setupAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
      const trigger = accordion.querySelector('.accordion-trigger');
      const content = accordion.querySelector('.accordion-content');
      
      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isOpen = accordion.classList.contains('open');
          
          // Закрываем все остальные
          accordions.forEach(acc => {
            if (acc !== accordion) {
              acc.classList.remove('open');
              const accContent = acc.querySelector('.accordion-content');
              if (accContent) {
                accContent.style.maxHeight = '0px';
              }
            }
          });
          
          // Переключаем текущий
          if (isOpen) {
            accordion.classList.remove('open');
            content.style.maxHeight = '0px';
          } else {
            accordion.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      }
    });
  }

  // ДОП. CTA ДЛЯ КАЛЬКУЛЯТОРА
  setupCalculatorEnhancements() {
    const btn = document.getElementById('downloadPdf');
    if (btn) {
      btn.addEventListener('click', () => {
        if (window.calculatorV2 && typeof window.calculatorV2.downloadPDF === 'function') {
          window.calculatorV2.downloadPDF();
        } else if (window.pdfLeadMagnet) {
          window.pdfLeadMagnet.showContactModal();
        }
      });
    }
  }

  // ЛИПКИЕ КНОПКИ ДЛЯ МОБИЛЬНЫХ
  setupMobileStickyActions() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      const exists = document.querySelector('.mobile-sticky-actions');
      if (exists) return;
      const bar = document.createElement('div');
      bar.className = 'mobile-sticky-actions';
      bar.innerHTML = `
        <a href="tel:+79162720932" class="msa-item">📞 Звонок</a>
        <a href="https://wa.me/79162720932" target="_blank" class="msa-item">💬 WhatsApp</a>
        <a href="#calculator" class="msa-item">🧮 Расчет</a>
      `;
      document.body.appendChild(bar);
    }
  }

  // STICKY TOC (ОГЛАВЛЕНИЕ)
  setupStickyTOC() {
    const toc = document.querySelector('.sticky-toc');
    if (!toc) return;

    const headings = document.querySelectorAll('h2, h3');
    const tocList = toc.querySelector('.toc-list');
    
    if (!tocList) return;

    // Создаем пункты TOC
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      
      const tocItem = document.createElement('li');
      tocItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
      
      const tocLink = document.createElement('a');
      tocLink.href = `#${id}`;
      tocLink.textContent = heading.textContent;
      tocLink.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });
      
      tocItem.appendChild(tocLink);
      tocList.appendChild(tocItem);
    });

    // Sticky поведение
    let isSticky = false;
    const tocOffset = toc.offsetTop;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > tocOffset && !isSticky) {
        toc.classList.add('sticky');
        isSticky = true;
      } else if (window.pageYOffset <= tocOffset && isSticky) {
        toc.classList.remove('sticky');
        isSticky = false;
      }
    });
  }

  // TL;DR (КРАТКОЕ СОДЕРЖАНИЕ)
  setupTLDR() {
    const tldr = document.querySelector('.tldr');
    if (!tldr) return;

    const content = tldr.querySelector('.tldr-content');
    const toggle = tldr.querySelector('.tldr-toggle');
    
    if (!content || !toggle) return;

    toggle.addEventListener('click', () => {
      const isExpanded = tldr.classList.contains('expanded');
      
      if (isExpanded) {
        tldr.classList.remove('expanded');
        toggle.textContent = 'Показать подробности';
      } else {
        tldr.classList.add('expanded');
        toggle.textContent = 'Скрыть подробности';
      }
    });
  }

  // LAZY LOADING ДЛЯ ИЗОБРАЖЕНИЙ
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }

  // АНИМАЦИИ ПРИ СКРОЛЛЕ
  setupScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      observer.observe(el);
    });
  }

  // СОЗДАНИЕ АККОРДЕОНА
  createAccordion(title, content, isOpen = false) {
    const accordion = document.createElement('div');
    accordion.className = `accordion ${isOpen ? 'open' : ''}`;
    
    accordion.innerHTML = `
      <div class="accordion-trigger">
        <span class="accordion-title">${title}</span>
        <span class="accordion-icon">${isOpen ? '−' : '+'}</span>
      </div>
      <div class="accordion-content" style="max-height: ${isOpen ? 'none' : '0px'}">
        <div class="accordion-body">
          ${content}
        </div>
      </div>
    `;
    
    return accordion;
  }

  // СОЗДАНИЕ TL;DR
  createTLDR(summary, details) {
    const tldr = document.createElement('div');
    tldr.className = 'tldr';
    
    tldr.innerHTML = `
      <div class="tldr-header">
        <h3>📋 Краткое содержание</h3>
        <button class="tldr-toggle">Показать подробности</button>
      </div>
      <div class="tldr-content">
        <div class="tldr-summary">
          ${summary}
        </div>
        <div class="tldr-details">
          ${details}
        </div>
      </div>
    `;
    
    return tldr;
  }

  // СОЗДАНИЕ STICKY TOC
  createStickyTOC() {
    const toc = document.createElement('div');
    toc.className = 'sticky-toc';
    
    toc.innerHTML = `
      <div class="toc-header">
        <h3>📑 Содержание</h3>
      </div>
      <ul class="toc-list"></ul>
    `;
    
    return toc;
  }

  // КАРТОЧКИ ПРЕИМУЩЕСТВ
  createBenefitCard(icon, title, description) {
    const card = document.createElement('div');
    card.className = 'benefit-card animate-on-scroll';
    
    card.innerHTML = `
      <div class="benefit-icon">${icon}</div>
      <h4 class="benefit-title">${title}</h4>
      <p class="benefit-description">${description}</p>
    `;
    
    return card;
  }

  // МИНИ-КЕЙС
  createMiniCase(title, stats, description) {
    const caseCard = document.createElement('div');
    caseCard.className = 'mini-case animate-on-scroll';
    
    caseCard.innerHTML = `
      <div class="case-header">
        <h4>${title}</h4>
      </div>
      <div class="case-stats">
        ${stats.map(stat => `<div class="case-stat"><span class="stat-value">${stat.value}</span><span class="stat-label">${stat.label}</span></div>`).join('')}
      </div>
      <p class="case-description">${description}</p>
    `;
    
    return caseCard;
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.uxImprovements = new UXImprovements();
});
// ========================================================
// 🎯 STICKY CTA С ПРОГРЕСС-БАРОМ - АВТОГОСТ V2.0
// Увеличивает конверсию на 10-15%
// ========================================================

class StickyCTA {
  constructor() {
    this.config = {
      showOnScroll: 100,        // Показать после скролла 100px
      showOnTime: 15000,        // Показать через 15 секунд
      showOnExit: true,         // Показать при попытке уйти
      progressBar: true,        // Включить прогресс-бар
      animationDuration: 300,   // Длительность анимации
      zIndex: 9999             // Z-index для отображения поверх всего
    };
    
    this.isVisible = false;
    this.progress = 0;
    this.init();
  }

  init() {
    this.createCTA();
    this.bindEvents();
    this.startProgressBar();
  }

  createCTA() {
    // Создаем основной контейнер
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'sticky-cta-container';
    ctaContainer.id = 'stickyCTA';
    ctaContainer.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 12px 20px;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
      transform: translateY(100%);
      transition: transform 0.3s ease-out;
      z-index: ${this.config.zIndex};
      border-top: 3px solid #3b82f6;
    `;

    // Создаем прогресс-бар
    const progressBar = document.createElement('div');
    progressBar.className = 'sticky-progress-bar';
    progressBar.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      width: 0%;
      transition: width 0.3s ease;
    `;

    // Создаем контент
    const content = document.createElement('div');
    content.className = 'sticky-cta-content';
    content.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      gap: 20px;
    `;

    // Левая часть с текстом
    const textSection = document.createElement('div');
    textSection.className = 'sticky-cta-text';
    textSection.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    `;

    const icon = document.createElement('span');
    icon.innerHTML = '🚛';
    icon.style.cssText = `
      font-size: 24px;
      animation: bounce 2s infinite;
    `;

    const text = document.createElement('div');
    text.innerHTML = `
      <div style="font-weight: 600; font-size: 16px;">Рассчитайте стоимость доставки</div>
      <div style="font-size: 14px; opacity: 0.9;">Получите точную цену за 30 секунд</div>
    `;

    textSection.appendChild(icon);
    textSection.appendChild(text);

    // Правая часть с кнопками
    const actionsSection = document.createElement('div');
    actionsSection.className = 'sticky-cta-actions';
    actionsSection.style.cssText = `
      display: flex;
      gap: 12px;
      align-items: center;
    `;

    // Кнопка калькулятора
    const calcButton = document.createElement('button');
    calcButton.className = 'sticky-calc-btn';
    calcButton.innerHTML = 'Рассчитать';
    calcButton.style.cssText = `
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    `;

    // Кнопка телефона
    const phoneButton = document.createElement('a');
    phoneButton.href = 'tel:+79162720932';
    phoneButton.className = 'sticky-phone-btn';
    phoneButton.innerHTML = '📞 +7 916 272-09-32';
    phoneButton.style.cssText = `
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 12px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
    `;

    // Кнопка закрытия
    const closeButton = document.createElement('button');
    closeButton.className = 'sticky-close-btn';
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
    `;

    // Собираем все вместе
    actionsSection.appendChild(calcButton);
    actionsSection.appendChild(phoneButton);
    actionsSection.appendChild(closeButton);

    content.appendChild(textSection);
    content.appendChild(actionsSection);

    ctaContainer.appendChild(progressBar);
    ctaContainer.appendChild(content);

    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-5px); }
        60% { transform: translateY(-3px); }
      }
      
      .sticky-calc-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
      
      .sticky-phone-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-1px);
      }
      
      .sticky-close-btn:hover {
        background: rgba(255,255,255,0.1);
        color: white;
      }
      
      @media (max-width: 768px) {
        .sticky-cta-content {
          flex-direction: column;
          gap: 12px;
          text-align: center;
        }
        
        .sticky-cta-actions {
          width: 100%;
          justify-content: center;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(ctaContainer);

    // Сохраняем ссылки на элементы
    this.container = ctaContainer;
    this.progressBar = progressBar;
    this.calcButton = calcButton;
    this.closeButton = closeButton;
  }

  bindEvents() {
    // Обработчик скролла
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.config.showOnScroll && !this.isVisible) {
        this.show();
      }
    });

    // Обработчик времени
    setTimeout(() => {
      if (!this.isVisible) {
        this.show();
      }
    }, this.config.showOnTime);

    // Обработчик попытки уйти со страницы
    if (this.config.showOnExit) {
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !this.isVisible) {
          this.show();
        }
      });
    }

    // Обработчики кнопок
    this.calcButton.addEventListener('click', () => {
      this.trackEvent('sticky_calc_click');
      this.scrollToCalculator();
    });

    this.closeButton.addEventListener('click', () => {
      this.hide();
      this.trackEvent('sticky_close_click');
    });

    // Hover эффекты
    this.calcButton.addEventListener('mouseenter', () => {
      this.calcButton.style.transform = 'translateY(-2px)';
    });

    this.calcButton.addEventListener('mouseleave', () => {
      this.calcButton.style.transform = 'translateY(0)';
    });
  }

  show() {
    if (this.isVisible) return;
    
    this.isVisible = true;
    this.container.style.transform = 'translateY(0)';
    this.trackEvent('sticky_cta_show');
  }

  hide() {
    if (!this.isVisible) return;
    
    this.isVisible = false;
    this.container.style.transform = 'translateY(100%)';
  }

  scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
      calculator.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Добавляем подсветку калькулятора
      calculator.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
      setTimeout(() => {
        calculator.style.boxShadow = '';
      }, 2000);
    }
  }

  startProgressBar() {
    if (!this.config.progressBar) return;

    const duration = 30000; // 30 секунд
    const interval = 100; // Обновляем каждые 100мс
    const increment = (interval / duration) * 100;

    this.progressInterval = setInterval(() => {
      this.progress += increment;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(this.progressInterval);
      }
      this.progressBar.style.width = this.progress + '%';
    }, interval);
  }

  trackEvent(eventName, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'sticky_cta',
        event_label: window.location.pathname,
        ...data
      });
    }

    // Yandex Metrika
    if (typeof ym !== 'undefined') {
      ym(103413788, 'reachGoal', eventName, {
        page: window.location.pathname,
        ...data
      });
    }

    console.log('Sticky CTA Event:', eventName, data);
  }

  // Публичные методы для внешнего управления
  updateProgress(percent) {
    this.progress = Math.min(100, Math.max(0, percent));
    this.progressBar.style.width = this.progress + '%';
  }

  setText(title, subtitle) {
    const textElement = this.container.querySelector('.sticky-cta-text div');
    if (textElement) {
      textElement.innerHTML = `
        <div style="font-weight: 600; font-size: 16px;">${title}</div>
        <div style="font-size: 14px; opacity: 0.9;">${subtitle}</div>
      `;
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.stickyCTA = new StickyCTA();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StickyCTA;
}
// ========================================================
// 🧪 A/B ТЕСТ ЗАГОЛОВКОВ - АВТОГОСТ V2.0
// Тестируем эффективность разных заголовков
// ========================================================

class ABTestHeaders {
  constructor() {
    this.config = {
      testName: 'header_variants',
      variants: [
        {
          id: 'A',
          title: 'АвтоГОСТ - Инфраструктура вашего бизнеса | Грузоперевозки по России',
          h1: 'Инфраструктура вашего бизнеса',
          subtitle: 'Профессиональные грузоперевозки по России с подачей от 2 часов',
          cta: 'Рассчитать стоимость за 30 секунд'
        },
        {
          id: 'B',
          title: 'Грузоперевозки по России от 2 часов | АвтоГОСТ - Быстрая доставка',
          h1: 'Доставка грузов по России от 2 часов',
          subtitle: 'Быстрая подача транспорта, точный расчет стоимости, круглосуточная работа',
          cta: 'Получить точную цену сейчас'
        },
        {
          id: 'C',
          title: 'Калькулятор стоимости доставки | АвтоГОСТ - Рассчитать цену грузоперевозки',
          h1: 'Рассчитайте стоимость доставки за 30 секунд',
          subtitle: 'Умный калькулятор с точными ценами. Подача транспорта от 2 часов',
          cta: 'Рассчитать за 30 сек'
        }
      ],
      trafficSplit: 0.5, // 50% трафика для теста
      duration: 14, // дней
      minSample: 1000, // минимальная выборка
      goals: ['scroll_to_calculator', 'calculator_complete', 'phone_click', 'form_submit']
    };
    
    this.currentVariant = null;
    this.init();
  }

  init() {
    // Проверяем, нужно ли показывать тест
    if (!this.shouldShowTest()) {
      return;
    }

    // Выбираем вариант
    this.currentVariant = this.selectVariant();
    
    // Применяем вариант
    this.applyVariant(this.currentVariant);
    
    // Настраиваем трекинг
    this.setupTracking();
    
    // Сохраняем в localStorage
    this.saveVariant();
    
    console.log(`A/B Test: Applied variant ${this.currentVariant.id}`);
  }

  shouldShowTest() {
    // Проверяем, не истек ли срок теста
    const testStart = localStorage.getItem('ab_test_start');
    if (testStart) {
      const daysPassed = (Date.now() - parseInt(testStart)) / (1000 * 60 * 60 * 24);
      if (daysPassed > this.config.duration) {
        return false;
      }
    } else {
      localStorage.setItem('ab_test_start', Date.now().toString());
    }

    // Проверяем, достаточно ли трафика
    const testCount = parseInt(localStorage.getItem('ab_test_count') || '0');
    if (testCount < this.config.minSample) {
      localStorage.setItem('ab_test_count', (testCount + 1).toString());
    }

    // Случайное распределение трафика
    return Math.random() < this.config.trafficSplit;
  }

  selectVariant() {
    // Проверяем, есть ли сохраненный вариант
    const savedVariant = localStorage.getItem('ab_test_variant');
    if (savedVariant) {
      const variant = this.config.variants.find(v => v.id === savedVariant);
      if (variant) {
        return variant;
      }
    }

    // Выбираем случайный вариант
    const randomIndex = Math.floor(Math.random() * this.config.variants.length);
    return this.config.variants[randomIndex];
  }

  applyVariant(variant) {
    // Обновляем title
    document.title = variant.title;

    // Обновляем meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', variant.subtitle);
    }

    // Обновляем Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', variant.h1);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', variant.subtitle);
    }

    // Обновляем Twitter Card
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', variant.h1);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', variant.subtitle);
    }

    // Обновляем H1 на странице
    const h1Element = document.querySelector('h1');
    if (h1Element) {
      h1Element.textContent = variant.h1;
    }

    // Обновляем подзаголовок
    const subtitleElement = document.querySelector('.hero-subtitle, .hero p, .hero-description');
    if (subtitleElement) {
      subtitleElement.textContent = variant.subtitle;
    }

    // Обновляем CTA кнопки
    const ctaButtons = document.querySelectorAll('.btn-primary, .hero-cta, .main-cta');
    ctaButtons.forEach(button => {
      if (button.textContent.includes('Рассчитать') || button.textContent.includes('Получить')) {
        button.textContent = variant.cta;
      }
    });

    // Обновляем sticky CTA если есть
    if (window.stickyCTA) {
      window.stickyCTA.setText('Рассчитайте стоимость доставки', variant.subtitle);
    }
  }

  setupTracking() {
    // Трекинг показа варианта
    this.trackEvent('variant_shown', {
      variant: this.currentVariant.id,
      test_name: this.config.testName
    });

    // Трекинг целей
    this.config.goals.forEach(goal => {
      this.trackGoal(goal);
    });

    // Трекинг времени на странице
    this.trackTimeOnPage();
  }

  trackGoal(goalName) {
    switch (goalName) {
      case 'scroll_to_calculator':
        this.trackScrollToCalculator();
        break;
      case 'calculator_complete':
        this.trackCalculatorComplete();
        break;
      case 'phone_click':
        this.trackPhoneClick();
        break;
      case 'form_submit':
        this.trackFormSubmit();
        break;
    }
  }

  trackScrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('scroll_to_calculator', {
              variant: this.currentVariant.id,
              test_name: this.config.testName
            });
            observer.disconnect();
          }
        });
      });
      observer.observe(calculator);
    }
  }

  trackCalculatorComplete() {
    // Слушаем события калькулятора
    document.addEventListener('calculator_complete', (e) => {
      this.trackEvent('calculator_complete', {
        variant: this.currentVariant.id,
        test_name: this.config.testName,
        calculation_data: e.detail
      });
    });
  }

  trackPhoneClick() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('phone_click', {
          variant: this.currentVariant.id,
          test_name: this.config.testName,
          phone_number: link.href.replace('tel:', '')
        });
      });
    });
  }

  trackFormSubmit() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', () => {
        this.trackEvent('form_submit', {
          variant: this.currentVariant.id,
          test_name: this.config.testName,
          form_id: form.id || 'unknown'
        });
      });
    });
  }

  trackTimeOnPage() {
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackEvent('time_on_page', {
        variant: this.currentVariant.id,
        test_name: this.config.testName,
        time_seconds: Math.round(timeOnPage / 1000)
      });
    });
  }

  trackEvent(eventName, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'ab_test',
        event_label: this.config.testName,
        custom_parameter_variant: this.currentVariant.id,
        ...data
      });
    }

    // Yandex Metrika
    if (typeof ym !== 'undefined') {
      ym(103413788, 'reachGoal', eventName, {
        test_name: this.config.testName,
        variant: this.currentVariant.id,
        ...data
      });
    }

    // Локальное логирование
    console.log('A/B Test Event:', eventName, {
      variant: this.currentVariant.id,
      test_name: this.config.testName,
      ...data
    });
  }

  saveVariant() {
    localStorage.setItem('ab_test_variant', this.currentVariant.id);
    localStorage.setItem('ab_test_name', this.config.testName);
  }

  // Методы для анализа результатов
  getTestResults() {
    const results = {
      test_name: this.config.testName,
      variant: this.currentVariant.id,
      start_time: localStorage.getItem('ab_test_start'),
      sample_size: localStorage.getItem('ab_test_count'),
      goals: {}
    };

    // Получаем данные из GA4 (если доступны)
    if (typeof gtag !== 'undefined') {
      // Здесь можно добавить запрос к GA4 API
      console.log('GA4 data available for analysis');
    }

    return results;
  }

  // Метод для принудительного применения варианта (для отладки)
  forceVariant(variantId) {
    const variant = this.config.variants.find(v => v.id === variantId);
    if (variant) {
      this.currentVariant = variant;
      this.applyVariant(variant);
      console.log(`Forced variant ${variantId}`);
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.abTestHeaders = new ABTestHeaders();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ABTestHeaders;
}
// ========================================================
// 🎯 ОПТИМИЗАТОР SCHEMA.ORG - АВТОГОСТ V2.0
// Удаляет дублирующиеся рейтинги и оптимизирует разметку
// ========================================================

class SchemaOptimizer {
  constructor() {
    this.config = {
      ratingValue: "4.8",
      reviewCount: "1250",
      priceRange: "₽₽",
      companyName: "АвтоГОСТ"
    };
    this.init();
  }

  init() {
    this.optimizeSchema();
    this.removeDuplicateRatings();
    this.consolidateOrganizationData();
  }

  // Оптимизация Schema.org разметки
  optimizeSchema() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        
        // Оптимизация Organization
        if (data["@type"] === "Organization") {
          this.optimizeOrganization(data);
        }
        
        // Оптимизация Service
        if (data["@type"] === "Service") {
          this.optimizeService(data);
        }
        
        // Оптимизация WebSite
        if (data["@type"] === "WebSite") {
          this.optimizeWebSite(data);
        }
        
        script.textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        console.warn('Schema optimization error:', e);
      }
    });
  }

  // Оптимизация Organization
  optimizeOrganization(org) {
    // Удаляем дублирующиеся рейтинги
    if (org.aggregateRating) {
      org.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": this.config.ratingValue,
        "reviewCount": this.config.reviewCount
      };
    }
    
    // Стандартизируем название
    if (org.name) {
      org.name = this.config.companyName;
    }
    
    // Добавляем недостающие поля
    if (!org.priceRange) {
      org.priceRange = this.config.priceRange;
    }
  }

  // Оптимизация Service
  optimizeService(service) {
    // Удаляем дублирующиеся рейтинги
    if (service.aggregateRating) {
      service.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": this.config.ratingValue,
        "reviewCount": this.config.reviewCount
      };
    }
    
    // Стандартизируем провайдера
    if (service.provider && service.provider["@type"] === "Organization") {
      this.optimizeOrganization(service.provider);
    }
  }

  // Оптимизация WebSite
  optimizeWebSite(website) {
    // Удаляем дублирующиеся рейтинги
    if (website.aggregateRating) {
      website.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": this.config.ratingValue,
        "reviewCount": this.config.reviewCount
      };
    }
  }

  // Удаление дублирующихся рейтингов
  removeDuplicateRatings() {
    const ratings = document.querySelectorAll('[itemtype*="AggregateRating"]');
    let processedRatings = new Set();
    
    ratings.forEach(rating => {
      const ratingValue = rating.querySelector('[itemprop="ratingValue"]');
      const reviewCount = rating.querySelector('[itemprop="reviewCount"]');
      
      if (ratingValue && reviewCount) {
        const key = `${ratingValue.textContent}-${reviewCount.textContent}`;
        
        if (processedRatings.has(key)) {
          rating.remove();
        } else {
          processedRatings.add(key);
        }
      }
    });
  }

  // Консолидация данных организации
  consolidateOrganizationData() {
    const organizations = document.querySelectorAll('[itemtype*="Organization"]');
    
    organizations.forEach(org => {
      const name = org.querySelector('[itemprop="name"]');
      if (name && name.textContent !== this.config.companyName) {
        name.textContent = this.config.companyName;
      }
    });
  }

  // Получение статистики оптимизации
  getOptimizationStats() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const ratings = document.querySelectorAll('[itemtype*="AggregateRating"]');
    
    return {
      schemaScripts: scripts.length,
      ratings: ratings.length,
      optimizationDate: new Date().toISOString()
    };
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.schemaOptimizer = new SchemaOptimizer();
  
  // Логирование статистики
  console.log('Schema optimization completed:', window.schemaOptimizer.getOptimizationStats());
});
