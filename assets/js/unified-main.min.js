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

    // Сжимаем длинные секции на мобильных
    collapseLongSectionsOnMobile();

    // Сокращаем таймлайн процесса на мобильных (показываем 3 шага)
    collapseProcessStepsOnMobile();

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
// Сворачивание длинных секций на мобильных
function collapseLongSectionsOnMobile() {
    try {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) return;
        document.querySelectorAll('[data-collapse="mobile"]').forEach(function(section){
            const maxHeight = 480; // px
            const currentHeight = section.scrollHeight;
            if (currentHeight > maxHeight) {
                section.style.maxHeight = maxHeight + 'px';
                section.style.overflow = 'hidden';
                const expander = document.createElement('button');
                expander.className = 'btn btn-outline btn-sm show-more';
                expander.textContent = 'Показать больше';
                expander.style.margin = '16px auto';
                expander.onclick = function(){
                    section.style.maxHeight = 'none';
                    section.style.overflow = 'visible';
                    expander.remove();
                };
                section.appendChild(expander);
            }
        });
    } catch (e) {
    }
}

// Сократить процесс до 3 шагов на мобильных
function collapseProcessStepsOnMobile() {
    try {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) return;
        const process = document.querySelector('.work-process .process-timeline');
        if (!process) return;
        const steps = Array.from(process.querySelectorAll('.process-step'));
        if (steps.length <= 3) return;
        // скрываем начиная с 4-го
        steps.slice(3).forEach(step => step.style.display = 'none');
        const expander = document.createElement('button');
        expander.className = 'btn btn-outline btn-sm show-more';
        expander.textContent = 'Показать все этапы';
        expander.style.marginTop = '12px';
        process.parentElement.appendChild(expander);
        expander.addEventListener('click', function(){
            steps.slice(3).forEach(step => step.style.display = '');
            expander.remove();
        });
    } catch (e) {
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
window.handleCalculation = handleCalculation;/**
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
 * Анимации для блоков преимуществ
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация анимаций для блоков преимуществ
    initBenefitAnimations();
    
    // Инициализация анимаций для компактных преимуществ
    initCompactBenefitAnimations();
    
    // Инициализация анимаций для технологических преимуществ
    initTechFeatureAnimations();
});

/**
 * Инициализация анимаций для основных блоков преимуществ
 */
function initBenefitAnimations() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    if (!benefitCards.length) return;
    
    benefitCards.forEach(card => {
        // Анимация при наведении
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
        
        // Анимация при прокрутке (если поддерживается IntersectionObserver)
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(card);
        } else {
            // Fallback для старых браузеров
            card.classList.add('animated');
        }
    });
}

/**
 * Инициализация анимаций для компактных блоков преимуществ
 */
function initCompactBenefitAnimations() {
    const compactBenefits = document.querySelectorAll('.compact-benefit');
    
    if (!compactBenefits.length) return;
    
    compactBenefits.forEach(benefit => {
        benefit.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.compact-benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.2s ease';
            }
        });
        
        benefit.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.compact-benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

/**
 * Инициализация анимаций для технологических преимуществ
 */
function initTechFeatureAnimations() {
    const techFeatures = document.querySelectorAll('.tech-feature');
    
    if (!techFeatures.length) return;
    
    techFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) translateY(-5px)';
                icon.style.transition = 'transform 0.3s ease';
                
                // Добавляем тень для эффекта "парения"
                icon.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
            }
        });
        
        feature.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1) translateY(0)';
                icon.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            }
        });
        
        // Анимация при прокрутке
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(feature);
        } else {
            feature.classList.add('fade-in');
        }
    });
}

/**
 * Обновление анимаций при изменении DOM
 * Вызывать эту функцию, если блоки преимуществ добавляются динамически
 */
function refreshBenefitAnimations() {
    initBenefitAnimations();
    initCompactBenefitAnimations();
    initTechFeatureAnimations();
}

// Экспортируем функцию для возможного использования в других скриптах
window.refreshBenefitAnimations = refreshBenefitAnimations;
// Анимации для Hero секции

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация счетчиков
    initCounters();
    
    // Добавление параллакс-эффекта
    initParallax();
});

// Анимированные счетчики
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Функция для запуска счетчика
    function startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 секунды
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Эффект замедления к концу анимации (easeOutQuad)
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                
                // Добавляем эффект пульсации после завершения счетчика
                element.classList.add('counted');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Запуск счетчиков при появлении в области видимости
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target); // Наблюдаем только один раз
            }
        });
    }, { threshold: 0.5 });
    
    // Наблюдаем за всеми счетчиками
    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

// Параллакс-эффект для фона
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    // Проверяем, поддерживается ли параллакс на устройстве
    // (отключаем на мобильных для производительности)
    if (window.innerWidth < 992) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        // Применяем эффект параллакса только если секция в зоне видимости
        if (scrollPosition <= heroHeight) {
            const translateY = scrollPosition * 0.3; // Коэффициент скорости параллакса
            hero.style.backgroundPositionY = `calc(30% + ${translateY}px)`;
        }
    });
    
    // Добавляем эффект при движении мыши (тонкий параллакс)
    hero.addEventListener('mousemove', function(e) {
        // Только на десктопах
        if (window.innerWidth < 992) return;
        
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        const translateX = mouseX * 20; // Горизонтальное смещение
        const translateY = mouseY * 20; // Вертикальное смещение
        
        hero.style.backgroundPositionX = `calc(50% + ${translateX}px)`;
        hero.style.backgroundPositionY = `calc(30% + ${translateY}px)`;
    });
}

// Функция для анимации пульсации кнопок
function pulseButtons() {
    const primaryButton = document.querySelector('.hero-actions .btn-primary');
    
    if (!primaryButton) return;
    
    // Добавляем класс для пульсации с интервалом
    setInterval(() => {
        primaryButton.classList.add('pulse-animation');
        
        // Удаляем класс после завершения анимации
        setTimeout(() => {
            primaryButton.classList.remove('pulse-animation');
        }, 1000);
    }, 5000); // Повторяем каждые 5 секунд
}

// Запускаем пульсацию кнопок после загрузки страницы
window.addEventListener('load', function() {
    // Небольшая задержка перед началом анимации
    setTimeout(pulseButtons, 3000);
});
// 🎨 ИНТЕРАКТИВНАЯ ИНФОГРАФИКА АВТОГОСТ77
// Система выбора типа доставки с анимациями

class InteractiveInfographic {
    constructor() {
        this.currentStep = 'start';
        this.selectedService = null;
        this.counters = {};
        this.initInfographic();
        this.startCounters();
    }

    initInfographic() {
        // Создаем контейнер для инфографики
        const container = document.getElementById('interactive-infographic');
        if (!container) return;

        container.innerHTML = this.getInfographicHTML();
        this.attachEventListeners();
        this.animateEntrance();
    }

    getInfographicHTML() {
        return `
            <div class="infographic-container">
                <div class="infographic-header">
                    <h2>🚛 Как мы доставим ваш груз?</h2>
                    <p>Выберите подходящий вариант и узнайте детали</p>
                </div>
                
                <div class="cargo-flowchart">
                    <div class="flow-start" id="flow-start">
                        <div class="cargo-box">
                            <div class="cargo-icon">📦</div>
                            <div class="cargo-title">ВАШ ГРУЗ</div>
                            <div class="cargo-subtitle">Какой объем?</div>
                        </div>
                    </div>
                    
                    <div class="flow-arrows">
                        <div class="arrow arrow-1"></div>
                        <div class="arrow arrow-2"></div>
                        <div class="arrow arrow-3"></div>
                        <div class="arrow arrow-4"></div>
                    </div>
                    
                    <div class="service-options">
                        <div class="service-card gazelle" data-service="gazelle">
                            <div class="service-icon">🚐</div>
                            <div class="service-title">ГАЗЕЛЬ</div>
                            <div class="service-subtitle">До 1.5 тонн</div>
                            <div class="service-price">от 3,000₽</div>
                            <div class="service-badge">Быстро</div>
                        </div>
                        
                        <div class="service-card truck" data-service="truck">
                            <div class="service-icon">🚛</div>
                            <div class="service-title">ОТДЕЛЬНАЯ МАШИНА</div>
                            <div class="service-subtitle">1.5-20 тонн</div>
                            <div class="service-price">от 25₽/км</div>
                            <div class="service-badge">Надежно</div>
                        </div>
                        
                        <div class="service-card consolidated" data-service="consolidated">
                            <div class="service-icon">🏭</div>
                            <div class="service-title">СБОРНЫЙ ГРУЗ</div>
                            <div class="service-subtitle">Экономия 70%</div>
                            <div class="service-price">от 15₽/кг</div>
                            <div class="service-badge">Выгодно</div>
                        </div>
                        
                        <div class="service-card calculator" data-service="calculator">
                            <div class="service-icon">⚡</div>
                            <div class="service-title">НЕ ЗНАЮ</div>
                            <div class="service-subtitle">Расчет за 30 сек</div>
                            <div class="service-price">Бесплатно</div>
                            <div class="service-badge">Точно</div>
                        </div>
                    </div>
                    
                    <div class="benefits-section" id="benefits-section" style="display: none;">
                        <div class="benefits-arrow"></div>
                        <div class="benefits-title">✅ ВАШИ ВЫГОДЫ</div>
                        <div class="benefits-grid">
                            <div class="benefit-item">
                                <div class="benefit-icon">⏰</div>
                                <div class="benefit-text">Подача за 2 часа</div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">💰</div>
                                <div class="benefit-text">Прозрачная цена</div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">📞</div>
                                <div class="benefit-text">Менеджер 24/7</div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">🛡️</div>
                                <div class="benefit-text">Полная ответственность</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="live-stats">
                    <div class="stat-item">
                        <div class="stat-number" id="today-orders">47</div>
                        <div class="stat-label">заявок сегодня</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="total-clients">12,247</div>
                        <div class="stat-label">довольных клиентов</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">99.2%</div>
                        <div class="stat-label">доставок в срок</div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Клики по типам доставки
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectService(e.currentTarget.dataset.service);
            });
            
            // Эффект наведения
            card.addEventListener('mouseenter', (e) => {
                this.highlightService(e.currentTarget);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.unhighlightService(e.currentTarget);
            });
        });

        // Клики по преимуществам
        document.querySelectorAll('.benefit-item').forEach(benefit => {
            benefit.addEventListener('click', (e) => {
                this.showBenefitDetails(e.currentTarget);
            });
        });
    }

    selectService(serviceType) {
        this.selectedService = serviceType;
        
        // Анимация выбора
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected', 'dimmed');
            if (card.dataset.service === serviceType) {
                card.classList.add('selected');
            } else {
                card.classList.add('dimmed');
            }
        });

        // Показываем преимущества с анимацией
        setTimeout(() => {
            const benefitsSection = document.getElementById('benefits-section');
            benefitsSection.style.display = 'block';
            setTimeout(() => benefitsSection.classList.add('visible'), 50);
        }, 300);

        // Аналитика
        if (typeof ym !== 'undefined') {
            ym(103413788, 'reachGoal', `infographic_${serviceType}_selected`);
        }

        // Редирект на соответствующую воронку через 2 секунды
        setTimeout(() => {
            this.redirectToFunnel(serviceType);
        }, 2000);
    }

    redirectToFunnel(serviceType) {
        const funnels = {
            'gazelle': '#calculator',
            'truck': '#calculator', 
            'consolidated': '#calculator',
            'calculator': '#calculator'
        };

        const targetElement = document.querySelector(funnels[serviceType]);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Подсвечиваем калькулятор
            setTimeout(() => {
                targetElement.classList.add('highlighted');
                setTimeout(() => targetElement.classList.remove('highlighted'), 2000);
            }, 500);
        }
    }

    highlightService(card) {
        if (!card.classList.contains('selected')) {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
        }
    }

    unhighlightService(card) {
        if (!card.classList.contains('selected')) {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }

    showBenefitDetails(benefit) {
        // Подсвечиваем преимущество
        benefit.classList.add('pulsing');
        setTimeout(() => benefit.classList.remove('pulsing'), 1000);
    }

    startCounters() {
        // Анимируем счетчики
        this.animateCounter('today-orders', 47, 52, 5000);
        this.animateCounter('total-clients', 12247, 12253, 10000);
    }

    animateCounter(elementId, startValue, endValue, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startTime = Date.now();
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(startValue + (endValue - startValue) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Запускаем следующий цикл
                setTimeout(() => {
                    this.animateCounter(elementId, endValue, startValue, duration);
                }, 2000);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    animateEntrance() {
        // Последовательное появление элементов
        const elements = [
            '.infographic-header',
            '.flow-start',
            '.service-card',
            '.live-stats'
        ];

        elements.forEach((selector, index) => {
            setTimeout(() => {
                document.querySelectorAll(selector).forEach(el => {
                    el.classList.add('animate-in');
                });
            }, index * 200);
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveInfographic = new InteractiveInfographic();
});

// Lazy Loading для изображений
document.addEventListener('DOMContentLoaded', function() {
    // Native lazy loading для современных браузеров
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback для старых браузеров
        const script = document.createElement('script');
        script.src = '/assets/js/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Intersection Observer для плавной загрузки
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // Наблюдаем за всеми изображениями с data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});
/* ===== LOADING STATES GOD MODE ===== */
/* Добавляет современные loading состояния во все формы */

document.addEventListener('DOMContentLoaded', function() {
    
    // 🎯 УЛУЧШЕНИЕ UX: Loading States для всех форм
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitButton) {
            // Сохраняем оригинальный текст
            const originalText = submitButton.textContent || submitButton.value;
            
            form.addEventListener('submit', function(e) {
                // Показываем loading состояние
                if (submitButton.tagName === 'BUTTON') {
                    submitButton.innerHTML = '<span class="loading-spinner"></span> Отправляем...';
                } else {
                    submitButton.value = 'Отправляем...';
                }
                
                submitButton.disabled = true;
                submitButton.classList.add('loading-state');
                
                // Возвращаем исходное состояние через 3 секунды (если форма не ушла на другую страницу)
                setTimeout(() => {
                    if (submitButton.tagName === 'BUTTON') {
                        submitButton.innerHTML = originalText;
                    } else {
                        submitButton.value = originalText;
                    }
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading-state');
                }, 3000);
            });
        }
    });
    
    // 🎯 КАЛЬКУЛЯТОР: Loading State для расчетов
    const calcButtons = document.querySelectorAll('.btn-calculate, .btn-calc, [onclick*="calculate"]');
    
    calcButtons.forEach(button => {
        const originalText = button.textContent;
        
        button.addEventListener('click', function() {
            if (!button.disabled) {
                button.innerHTML = '<span class="loading-spinner"></span> Рассчитываем...';
                button.disabled = true;
                button.classList.add('loading-state');
                
                // Возвращаем исходное состояние после расчета
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.classList.remove('loading-state');
                }, 2000);
            }
        });
    });
    
    // 🎯 ФАЙЛОВЫЕ ЗАГРУЗКИ: Progress Bar
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                const statusDiv = document.createElement('div');
                statusDiv.className = 'file-upload-status';
                statusDiv.innerHTML = `
                    <div class="upload-progress">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                    <span class="file-name">📎 ${fileName}</span>
                `;
                
                this.parentNode.appendChild(statusDiv);
                
                // Симулируем прогресс загрузки
                let progress = 0;
                const progressBar = statusDiv.querySelector('.progress-bar');
                const interval = setInterval(() => {
                    progress += Math.random() * 30;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        statusDiv.innerHTML = `<span class="file-success">✅ ${fileName} загружен</span>`;
                    }
                    progressBar.style.width = progress + '%';
                }, 200);
            }
        });
    });
    
    console.log('🚀 Loading States активированы для всех форм и элементов!');
});

/* ===== CSS ДЛЯ LOADING STATES ===== */
const loadingCSS = `
.loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-state {
    opacity: 0.7;
    cursor: not-allowed !important;
    position: relative;
}

.file-upload-status {
    margin-top: 10px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

.upload-progress {
    width: 100%;
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    transition: width 0.3s ease;
}

.file-success {
    color: #059669;
    font-weight: 600;
}

.file-name {
    color: #64748b;
}
`;

// Добавляем CSS в head
const style = document.createElement('style');
style.textContent = loadingCSS;
document.head.appendChild(style);


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
/**
 * Улучшенная навигация по странице
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Добавление якорных ссылок к заголовкам секций
    addSectionAnchors();
    
    // Создание навигации по странице
    createPageNavigation();
    
    // Инициализация индикатора прогресса чтения
    initReadingProgress();
    
    // Инициализация кнопки "Наверх"
    initBackToTop();
});

/**
 * Добавление якорных ссылок к заголовкам секций
 */
function addSectionAnchors() {
    // Находим все заголовки секций
    const sectionHeaders = document.querySelectorAll('section h2, section h3');
    
    sectionHeaders.forEach(header => {
        // Создаем ID для заголовка, если его нет
        if (!header.id) {
            // Генерируем ID из текста заголовка
            let id = header.textContent
                .toLowerCase()
                .replace(/[^\wа-яё]+/g, '-') // Заменяем все не буквенно-цифровые символы на дефис
                .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
            
            // Добавляем префикс 'section-' для уникальности
            header.id = 'section-' + id;
        }
        
        // Создаем якорную ссылку
        const anchor = document.createElement('a');
        anchor.href = '#' + header.id;
        anchor.className = 'anchor-link';
        anchor.innerHTML = '#';
        anchor.title = 'Ссылка на этот раздел';
        
        // Оборачиваем заголовок в div для позиционирования якорной ссылки
        if (!header.parentElement.classList.contains('section-header')) {
            const headerWrapper = document.createElement('div');
            headerWrapper.className = 'section-header';
            header.parentNode.insertBefore(headerWrapper, header);
            headerWrapper.appendChild(header);
            headerWrapper.appendChild(anchor);
        }
        
        // Добавляем невидимый якорь перед заголовком для правильной прокрутки
        const anchorTarget = document.createElement('span');
        anchorTarget.className = 'section-anchor';
        anchorTarget.id = header.id + '-anchor';
        header.parentNode.insertBefore(anchorTarget, header.parentNode.firstChild);
        
        // Обновляем ID заголовка, чтобы он указывал на якорь
        header.id = '';
    });
}

/**
 * Создание навигации по странице
 */
function createPageNavigation() {
    // Находим все заголовки секций
    const sectionHeaders = document.querySelectorAll('section h2');
    
    // Если на странице меньше 3 заголовков, не создаем навигацию
    if (sectionHeaders.length < 3) return;
    
    // Создаем контейнер для навигации
    const navigation = document.createElement('div');
    navigation.className = 'page-navigation';
    navigation.innerHTML = `
        <div class="page-navigation-title">
            Содержание страницы
            <button class="page-navigation-toggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>
        <ul class="page-navigation-list"></ul>
    `;
    
    // Создаем список навигации
    const navigationList = navigation.querySelector('.page-navigation-list');
    
    sectionHeaders.forEach(header => {
        // Получаем ID якоря
        const anchorId = header.parentElement.previousSibling.id;
        
        // Создаем элемент списка
        const listItem = document.createElement('li');
        listItem.className = 'page-navigation-item';
        
        // Создаем ссылку
        const link = document.createElement('a');
        link.href = '#' + anchorId;
        link.className = 'page-navigation-link';
        link.textContent = header.textContent;
        link.dataset.target = anchorId;
        
        // Добавляем обработчик клика для плавной прокрутки
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, '#' + targetId);
                
                // Активируем ссылку
                document.querySelectorAll('.page-navigation-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
        
        // Добавляем ссылку в элемент списка
        listItem.appendChild(link);
        
        // Добавляем элемент списка в список навигации
        navigationList.appendChild(listItem);
    });
    
    // Добавляем навигацию в начало первой секции
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.parentNode.insertBefore(navigation, firstSection);
    }
    
    // Обработчик для переключения видимости списка на мобильных устройствах
    const toggleButton = navigation.querySelector('.page-navigation-toggle');
    toggleButton.addEventListener('click', function() {
        navigationList.classList.toggle('expanded');
        
        // Изменяем иконку кнопки
        if (navigationList.classList.contains('expanded')) {
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            `;
        } else {
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            `;
        }
    });
    
    // Отслеживаем прокрутку для активации текущего раздела
    window.addEventListener('scroll', function() {
        // Добавляем тень при прокрутке
        if (window.scrollY > 100) {
            navigation.classList.add('shadow-active');
        } else {
            navigation.classList.remove('shadow-active');
        }
        
        // Находим текущий видимый раздел
        const current = findCurrentSection();
        if (current) {
            // Обновляем активную ссылку
            document.querySelectorAll('.page-navigation-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.target === current) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Находит текущий видимый раздел
 * @returns {string|null} - ID текущего раздела или null
 */
function findCurrentSection() {
    const anchors = document.querySelectorAll('.section-anchor');
    let current = null;
    
    // Находим первый якорь, который находится ниже верхней границы окна
    // с небольшим отступом для лучшего UX
    const scrollPosition = window.scrollY + 100;
    
    for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];
        const nextAnchor = anchors[i + 1];
        
        // Проверяем, находится ли прокрутка между текущим и следующим якорем
        if (anchor.offsetTop <= scrollPosition && 
            (!nextAnchor || nextAnchor.offsetTop > scrollPosition)) {
            current = anchor.id;
            break;
        }
    }
    
    // Если мы в самом низу страницы, выбираем последний якорь
    if (!current && anchors.length > 0 && 
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        current = anchors[anchors.length - 1].id;
    }
    
    return current;
}

/**
 * Инициализация индикатора прогресса чтения
 */
function initReadingProgress() {
    // Создаем контейнер для индикатора прогресса
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    
    // Создаем индикатор прогресса
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    
    // Добавляем индикатор в контейнер
    progressContainer.appendChild(progressBar);
    
    // Добавляем контейнер в начало body
    document.body.insertBefore(progressContainer, document.body.firstChild);
    
    // Обновляем прогресс при прокрутке
    window.addEventListener('scroll', function() {
        updateReadingProgress(progressBar);
    });
    
    // Обновляем прогресс при изменении размера окна
    window.addEventListener('resize', function() {
        updateReadingProgress(progressBar);
    });
    
    // Инициализируем прогресс
    updateReadingProgress(progressBar);
}

/**
 * Обновляет индикатор прогресса чтения
 * @param {HTMLElement} progressBar - Элемент индикатора прогресса
 */
function updateReadingProgress(progressBar) {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Вычисляем процент прокрутки
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    // Обновляем ширину индикатора
    progressBar.style.width = scrollPercentage + '%';
}

/**
 * Инициализация кнопки "Наверх"
 */
function initBackToTop() {
    // Создаем кнопку
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    backToTopButton.title = 'Наверх';
    
    // Добавляем кнопку в конец body
    document.body.appendChild(backToTopButton);
    
    // Обработчик клика для прокрутки наверх
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

/**
 * Обновление навигации при изменении DOM
 * Вызывать эту функцию, если содержимое страницы изменяется динамически
 */
function refreshPageNavigation() {
    // Удаляем существующую навигацию
    const existingNavigation = document.querySelector('.page-navigation');
    if (existingNavigation) {
        existingNavigation.remove();
    }
    
    // Удаляем существующие якоря
    document.querySelectorAll('.section-anchor').forEach(anchor => {
        anchor.remove();
    });
    
    document.querySelectorAll('.section-header').forEach(header => {
        // Извлекаем заголовок из обертки
        const h2 = header.querySelector('h2, h3');
        if (h2) {
            header.parentNode.insertBefore(h2, header);
            header.remove();
        }
    });
    
    // Создаем новую навигацию
    addSectionAnchors();
    createPageNavigation();
}

// Экспортируем функцию для возможного использования в других скриптах
window.refreshPageNavigation = refreshPageNavigation;
/**
 * Sticky CTA Panel для мобильных устройств
 * Док-панель снизу экрана с основными действиями
 */
class StickyCTA {
  constructor() {
    this.isVisible = false;
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    // Создаем панель
    this.createPanel();
    
    // Слушаем изменения размера экрана
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.updateVisibility();
    });

    // Слушаем скролл для показа/скрытия
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Показываем панель через 3 секунды после загрузки
    setTimeout(() => {
      this.show();
    }, 3000);
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.id = 'sticky-cta-panel';
    panel.innerHTML = `
      <div class="sticky-cta-container">
        <button class="sticky-cta-btn sticky-cta-calc" onclick="stickyCTA.scrollToCalculator()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span>Рассчитать</span>
        </button>
        
        <button class="sticky-cta-btn sticky-cta-whatsapp" onclick="stickyCTA.openWhatsApp()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
          <span>WhatsApp</span>
        </button>
        
        <button class="sticky-cta-btn sticky-cta-phone" onclick="stickyCTA.callPhone()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <span>Позвонить</span>
        </button>
      </div>
    `;

    // Добавляем стили
    const styles = document.createElement('style');
    styles.textContent = `
      #sticky-cta-panel {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        transform: translateY(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px 16px;
        padding-bottom: calc(8px + env(safe-area-inset-bottom));
      }

      #sticky-cta-panel.show {
        transform: translateY(0);
      }

      .sticky-cta-container {
        display: flex;
        gap: 8px;
        max-width: 400px;
        margin: 0 auto;
      }

      .sticky-cta-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 8px;
        border: none;
        border-radius: 12px;
        background: #f8f9fa;
        color: #495057;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 60px;
        justify-content: center;
      }

      .sticky-cta-btn:hover {
        background: #e9ecef;
        transform: translateY(-1px);
      }

      .sticky-cta-btn:active {
        transform: translateY(0);
      }

      .sticky-cta-calc {
        background: linear-gradient(135deg, #007bff, #0056b3);
        color: white;
      }

      .sticky-cta-calc:hover {
        background: linear-gradient(135deg, #0056b3, #004085);
      }

      .sticky-cta-whatsapp {
        background: linear-gradient(135deg, #25d366, #128c7e);
        color: white;
      }

      .sticky-cta-whatsapp:hover {
        background: linear-gradient(135deg, #128c7e, #075e54);
      }

      .sticky-cta-phone {
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
      }

      .sticky-cta-phone:hover {
        background: linear-gradient(135deg, #c82333, #a71e2a);
      }

      .sticky-cta-btn svg {
        flex-shrink: 0;
      }

      .sticky-cta-btn span {
        font-size: 11px;
        line-height: 1.2;
        text-align: center;
      }

      /* Только на мобиле */
      @media (min-width: 769px) {
        #sticky-cta-panel {
          display: none;
        }
      }

      /* Анимация появления */
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      #sticky-cta-panel.show {
        animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(panel);
    this.panel = panel;
  }

  show() {
    if (!this.isMobile) return;
    
    this.panel.classList.add('show');
    this.isVisible = true;
    
    // Трекинг показа
    if (window.ym) {
      window.ym(103413788, 'reachGoal', 'sticky_cta_show');
    }
  }

  hide() {
    this.panel.classList.remove('show');
    this.isVisible = false;
  }

  updateVisibility() {
    if (this.isMobile && !this.isVisible) {
      this.show();
    } else if (!this.isMobile && this.isVisible) {
      this.hide();
    }
  }

  handleScroll() {
    if (!this.isMobile) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Показываем если прокрутили больше 50% экрана
    if (scrollY > windowHeight * 0.5) {
      if (!this.isVisible) {
        this.show();
      }
    } else {
      if (this.isVisible) {
        this.hide();
      }
    }
  }

  scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
      calculator.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Трекинг клика
      if (window.ym) {
        window.ym(103413788, 'reachGoal', 'sticky_cta_calc_click');
      }
    }
  }

  openWhatsApp() {
    const message = encodeURIComponent('Здравствуйте! Хочу рассчитать стоимость доставки.');
    const url = `https://wa.me/79162720932?text=${message}`;
    window.open(url, '_blank');
    
    // Трекинг клика
    if (window.ym) {
      window.ym(103413788, 'reachGoal', 'sticky_cta_whatsapp_click');
    }
  }

  callPhone() {
    window.location.href = 'tel:+79162720932';
    
    // Трекинг клика
    if (window.ym) {
      window.ym(103413788, 'reachGoal', 'sticky_cta_phone_click');
    }
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.stickyCTA = new StickyCTA();
});
/**
 * Слайдер отзывов и социальные доказательства
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера отзывов
    initTestimonialsSlider();
    
    // Инициализация анимированных счетчиков
    initStatCounters();
    
    // Инициализация анимации логотипов клиентов
    initClientLogos();
});

/**
 * Инициализация слайдера отзывов
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const prevButton = document.querySelector('.testimonials-nav-prev');
    const nextButton = document.querySelector('.testimonials-nav-next');
    const cards = slider.querySelectorAll('.testimonial-card');
    
    if (!prevButton || !nextButton) return;
    
    // Количество видимых карточек в зависимости от ширины экрана
    const getVisibleCount = () => {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    };
    
    // Текущий индекс
    let currentIndex = 0;
    
    // Обновление состояния кнопок навигации
    const updateNavButtons = () => {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= cards.length - getVisibleCount();
        
        // Обновляем стили кнопок
        if (prevButton.disabled) {
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'not-allowed';
        } else {
            prevButton.style.opacity = '1';
            prevButton.style.cursor = 'pointer';
        }
        
        if (nextButton.disabled) {
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
        }
    };
    
    // Прокрутка к указанному индексу
    const scrollToIndex = (index) => {
        if (index < 0) index = 0;
        if (index > cards.length - getVisibleCount()) {
            index = cards.length - getVisibleCount();
        }
        
        currentIndex = index;
        
        // Вычисляем позицию для прокрутки
        const card = cards[index];
        const scrollLeft = card.offsetLeft - slider.offsetLeft;
        
        // Плавно прокручиваем к нужной позиции
        slider.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        
        // Обновляем состояние кнопок
        updateNavButtons();
    };
    
    // Обработчики для кнопок навигации
    prevButton.addEventListener('click', () => {
        scrollToIndex(currentIndex - 1);
    });
    
    nextButton.addEventListener('click', () => {
        scrollToIndex(currentIndex + 1);
    });
    
    // Обработчик прокрутки слайдера
    slider.addEventListener('scroll', () => {
        // Находим ближайшую карточку к левому краю
        const scrollLeft = slider.scrollLeft;
        let closestIndex = 0;
        let minDistance = Infinity;
        
        cards.forEach((card, index) => {
            const distance = Math.abs(card.offsetLeft - slider.offsetLeft - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        
        currentIndex = closestIndex;
        updateNavButtons();
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        // Перепрокручиваем к текущему индексу при изменении размера окна
        scrollToIndex(currentIndex);
    });
    
    // Инициализируем начальное состояние
    updateNavButtons();
    
    // Автоматическая прокрутка слайдера
    let autoScrollInterval;
    
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            if (currentIndex < cards.length - getVisibleCount()) {
                scrollToIndex(currentIndex + 1);
            } else {
                scrollToIndex(0);
            }
        }, 5000); // Интервал автопрокрутки - 5 секунд
    };
    
    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };
    
    // Запускаем автопрокрутку
    startAutoScroll();
    
    // Останавливаем автопрокрутку при взаимодействии пользователя
    slider.addEventListener('mouseenter', stopAutoScroll);
    prevButton.addEventListener('mouseenter', stopAutoScroll);
    nextButton.addEventListener('mouseenter', stopAutoScroll);
    
    // Возобновляем автопрокрутку, когда пользователь уходит
    slider.addEventListener('mouseleave', startAutoScroll);
    prevButton.addEventListener('mouseleave', startAutoScroll);
    nextButton.addEventListener('mouseleave', startAutoScroll);
}

/**
 * Инициализация анимированных счетчиков
 */
function initStatCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    if (!counters.length) return;
    
    // Функция для анимации счетчика
    const animateCounter = (counter, targetValue) => {
        let startValue = 0;
        const duration = 2000; // 2 секунды
        const increment = targetValue / (duration / 16); // 16мс - примерно один кадр при 60fps
        
        const updateCounter = () => {
            startValue += increment;
            if (startValue < targetValue) {
                counter.textContent = Math.floor(startValue).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = targetValue.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Используем Intersection Observer для запуска анимации при появлении счетчиков в поле зрения
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = parseInt(counter.getAttribute('data-value'));
                animateCounter(counter, targetValue);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });
    
    // Наблюдаем за всеми счетчиками
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Инициализация анимации логотипов клиентов
 */
function initClientLogos() {
    const logos = document.querySelectorAll('.client-logo');
    
    if (!logos.length) return;
    
    // Добавляем эффект появления логотипов при прокрутке
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем задержку для каждого логотипа
                setTimeout(() => {
                    entry.target.style.opacity = '0.7';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Подготавливаем логотипы к анимации
    logos.forEach(logo => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(20px)';
        logo.style.transition = 'all 0.5s ease';
        
        observer.observe(logo);
    });
}

/**
 * Обновление социальных доказательств
 * Вызывать эту функцию, если содержимое добавляется динамически
 */
function refreshSocialProof() {
    initTestimonialsSlider();
    initStatCounters();
    initClientLogos();
}

// Экспортируем функцию для возможного использования в других скриптах
window.refreshSocialProof = refreshSocialProof;
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
