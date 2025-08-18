/**
 * Улучшенная обработка форм и воронки продаж
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация улучшенной формы лид-магнита
    initLeadForm();
    
    // Инициализация промо-таймера
    initPromoTimer();
    
    // Инициализация индикаторов заполнения
    initCompletionIndicators();
    
    // Инициализация микро-конверсий
    initMicroConversions();
});

/**
 * Инициализация улучшенной формы лид-магнита
 */
function initLeadForm() {
    const leadForm = document.getElementById('calculatorLeadForm');
    if (!leadForm) return;
    
    // Добавляем класс для стилизации
    leadForm.classList.add('optimized-form');
    
    // Добавляем индикатор прогресса
    const formHeader = document.querySelector('.lead-form .section-header');
    if (formHeader) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress-container';
        progressContainer.innerHTML = `
            <div class="form-progress-bar">
                <div class="form-progress-fill" style="width: 0%"></div>
            </div>
            <div class="form-progress-steps">
                <div class="form-progress-step active" data-step="1">Контактные данные</div>
                <div class="form-progress-step" data-step="2">Детали заказа</div>
                <div class="form-progress-step" data-step="3">Подтверждение</div>
            </div>
        `;
        
        formHeader.after(progressContainer);
    }
    
    // Обработка валидации полей
    const formInputs = leadForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        // Добавляем обработчики для валидации
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            updateCompletionIndicator();
        });
    });
    
    // Обработка отправки формы
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидируем все поля перед отправкой
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Имитация отправки формы
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Отправка...';
                
                // Имитация задержки отправки
                setTimeout(() => {
                    showFormSuccess();
                }, 1500);
            }
        } else {
            // Прокручиваем к первому невалидному полю
            const firstInvalidField = this.querySelector('.invalid-field');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

/**
 * Валидация поля формы
 * @param {HTMLElement} field - Поле для валидации
 * @returns {boolean} - Результат валидации
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;
    
    // Удаляем предыдущие классы валидации
    formGroup.classList.remove('valid-field', 'invalid-field');
    
    // Проверяем, есть ли сообщение об ошибке
    let errorMessage = formGroup.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        field.after(errorMessage);
    }
    
    // Проверяем обязательность поля
    if (field.required && !field.value.trim()) {
        formGroup.classList.add('invalid-field');
        errorMessage.textContent = 'Это поле обязательно для заполнения';
        return false;
    }
    
    // Проверка email
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            formGroup.classList.add('invalid-field');
            errorMessage.textContent = 'Введите корректный email';
            return false;
        }
    }
    
    // Проверка телефона
    if (field.id === 'leadPhone' && field.value.trim()) {
        const phoneRegex = /^\+?[0-9\s\-\(\)]{10,20}$/;
        if (!phoneRegex.test(field.value)) {
            formGroup.classList.add('invalid-field');
            errorMessage.textContent = 'Введите корректный номер телефона';
            return false;
        }
    }
    
    // Если все проверки пройдены, поле валидно
    formGroup.classList.add('valid-field');
    return true;
}

/**
 * Инициализация промо-таймера
 */
function initPromoTimer() {
    const timerMinutes = document.getElementById('timerMinutes');
    const timerSeconds = document.getElementById('timerSeconds');
    
    if (!timerMinutes || !timerSeconds) return;
    
    let minutes = 15;
    let seconds = 0;
    
    // Проверяем, есть ли сохраненное время в localStorage
    const savedTime = localStorage.getItem('promoTimerEnd');
    if (savedTime) {
        const timeLeft = Math.floor((parseInt(savedTime) - Date.now()) / 1000);
        
        if (timeLeft > 0) {
            minutes = Math.floor(timeLeft / 60);
            seconds = timeLeft % 60;
        } else {
            // Если время истекло, сбрасываем таймер
            localStorage.removeItem('promoTimerEnd');
        }
    } else {
        // Если таймер запускается впервые, сохраняем время окончания
        const endTime = Date.now() + (minutes * 60 + seconds) * 1000;
        localStorage.setItem('promoTimerEnd', endTime.toString());
    }
    
    // Обновляем отображение таймера
    updateTimerDisplay();
    
    // Запускаем таймер
    const timerInterval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                // Время истекло
                clearInterval(timerInterval);
                handleTimerExpired();
                return;
            }
        }
        
        updateTimerDisplay();
    }, 1000);
    
    /**
     * Обновление отображения таймера
     */
    function updateTimerDisplay() {
        timerMinutes.textContent = minutes.toString().padStart(2, '0');
        timerSeconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    /**
     * Обработка истечения времени таймера
     */
    function handleTimerExpired() {
        const promoSection = document.querySelector('.promo-section');
        if (promoSection) {
            promoSection.innerHTML = `
                <div class="timer-label">⏰ Специальное предложение закончилось</div>
                <button type="button" class="micro-conversion-action" id="restartPromo">
                    Активировать снова
                </button>
            `;
            
            // Добавляем обработчик для перезапуска промо
            const restartButton = document.getElementById('restartPromo');
            if (restartButton) {
                restartButton.addEventListener('click', () => {
                    localStorage.removeItem('promoTimerEnd');
                    location.reload();
                });
            }
        }
    }
}

/**
 * Инициализация индикаторов заполнения формы
 */
function initCompletionIndicators() {
    const leadForm = document.getElementById('calculatorLeadForm');
    if (!leadForm) return;
    
    // Создаем индикатор заполнения
    const formActions = leadForm.querySelector('.form-actions');
    if (formActions) {
        const completionIndicator = document.createElement('div');
        completionIndicator.className = 'form-completion';
        completionIndicator.innerHTML = `
            <div class="completion-progress">
                <div class="completion-bar">
                    <div class="completion-fill" style="width: 0%"></div>
                </div>
                <div class="completion-text">Заполнено: <strong>0%</strong></div>
            </div>
        `;
        
        formActions.before(completionIndicator);
    }
    
    // Первоначальное обновление индикатора
    updateCompletionIndicator();
}

/**
 * Обновление индикатора заполнения формы
 */
function updateCompletionIndicator() {
    const leadForm = document.getElementById('calculatorLeadForm');
    if (!leadForm) return;
    
    const requiredFields = leadForm.querySelectorAll('[required]');
    const completionFill = leadForm.querySelector('.completion-fill');
    const completionText = leadForm.querySelector('.completion-text strong');
    
    if (!requiredFields.length || !completionFill || !completionText) return;
    
    // Подсчитываем заполненные обязательные поля
    let filledFields = 0;
    requiredFields.forEach(field => {
        if (field.value.trim()) {
            filledFields++;
        }
    });
    
    // Рассчитываем процент заполнения
    const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);
    
    // Обновляем индикатор
    completionFill.style.width = `${completionPercentage}%`;
    completionText.textContent = `${completionPercentage}%`;
    
    // Обновляем прогресс-бар
    const progressFill = leadForm.closest('.lead-form').querySelector('.form-progress-fill');
    if (progressFill) {
        progressFill.style.width = `${completionPercentage / 3}%`; // Первый шаг из трех
    }
}

/**
 * Показать сообщение об успешной отправке формы
 */
function showFormSuccess() {
    const leadForm = document.getElementById('calculatorLeadForm');
    if (!leadForm) return;
    
    const leadFormContainer = leadForm.closest('.lead-form');
    if (leadFormContainer) {
        leadFormContainer.innerHTML = `
            <div class="form-success" style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
                <h3 style="font-size: 24px; margin-bottom: 16px; color: #10b981;">Заявка успешно отправлена!</h3>
                <p style="font-size: 16px; margin-bottom: 24px; color: #64748b;">
                    Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.
                </p>
                <p style="font-size: 14px; color: #94a3b8;">
                    Номер заявки: <strong>${generateOrderNumber()}</strong>
                </p>
            </div>
        `;
        
        // Отправляем событие конверсии в аналитику
        if (typeof ym !== 'undefined') {
            ym(12345678, 'reachGoal', 'lead_form_submit');
        }
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_form_submit', {
                'event_category': 'form',
                'event_label': 'calculator_lead'
            });
        }
    }
}

/**
 * Генерация номера заказа
 * @returns {string} - Номер заказа
 */
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `AG-${year}${month}${day}-${random}`;
}

/**
 * Инициализация микро-конверсий
 */
function initMicroConversions() {
    // Добавляем микро-конверсию для скачивания PDF
    addPdfMicroConversion();
    
    // Добавляем микро-конверсию для чек-листа подготовки груза
    addChecklistMicroConversion();
}

/**
 * Добавление микро-конверсии для скачивания PDF
 */
function addPdfMicroConversion() {
    const calculatorResult = document.getElementById('calculatorResult');
    if (!calculatorResult) return;
    
    const microConversion = document.createElement('div');
    microConversion.className = 'micro-conversion';
    microConversion.innerHTML = `
        <div class="micro-conversion-icon">📄</div>
        <div class="micro-conversion-content">
            <div class="micro-conversion-title">Сохраните расчет для вашей бухгалтерии</div>
            <div class="micro-conversion-description">
                PDF-документ с детальным расчетом стоимости и условиями перевозки
            </div>
            <a href="#" class="micro-conversion-action" id="downloadDetailedPdf">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                    <path d="M5,20H19V18H5V20M19,9H15V3H9V9H5L12,16L19,9Z"/>
                </svg>
                Скачать подробный PDF
            </a>
        </div>
    `;
    
    calculatorResult.appendChild(microConversion);
    
    // Добавляем обработчик для кнопки скачивания
    const downloadButton = document.getElementById('downloadDetailedPdf');
    if (downloadButton) {
        downloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Имитация скачивания
            this.innerHTML = 'Подготовка PDF...';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                        <path d="M5,20H19V18H5V20M19,9H15V3H9V9H5L12,16L19,9Z"/>
                    </svg>
                    Скачать подробный PDF
                `;
                this.style.opacity = '1';
                
                // Отправляем событие микро-конверсии в аналитику
                if (typeof ym !== 'undefined') {
                    ym(12345678, 'reachGoal', 'detailed_pdf_download');
                }
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'detailed_pdf_download', {
                        'event_category': 'micro_conversion',
                        'event_label': 'calculator_result'
                    });
                }
                
                // Показываем форму лид-магнита после скачивания
                showLeadForm();
            }, 1500);
        });
    }
}

/**
 * Добавление микро-конверсии для чек-листа подготовки груза
 */
function addChecklistMicroConversion() {
    const leadForm = document.getElementById('calculatorLeadForm');
    if (!leadForm) return;
    
    const formActions = leadForm.querySelector('.form-actions');
    if (formActions) {
        const microConversion = document.createElement('div');
        microConversion.className = 'micro-conversion';
        microConversion.innerHTML = `
            <div class="micro-conversion-icon">📋</div>
            <div class="micro-conversion-content">
                <div class="micro-conversion-title">Чек-лист подготовки груза к отправке</div>
                <div class="micro-conversion-description">
                    Полезные рекомендации, которые помогут избежать проблем и задержек
                </div>
                <a href="#" class="micro-conversion-action" id="downloadChecklist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                        <path d="M5,20H19V18H5V20M19,9H15V3H9V9H5L12,16L19,9Z"/>
                    </svg>
                    Скачать чек-лист
                </a>
            </div>
        `;
        
        formActions.before(microConversion);
        
        // Добавляем обработчик для кнопки скачивания чек-листа
        const downloadButton = document.getElementById('downloadChecklist');
        if (downloadButton) {
            downloadButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Имитация скачивания
                this.innerHTML = 'Подготовка документа...';
                this.style.opacity = '0.7';
                
                setTimeout(() => {
                    this.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M5,20H19V18H5V20M19,9H15V3H9V9H5L12,16L19,9Z"/>
                        </svg>
                        Скачать чек-лист
                    `;
                    this.style.opacity = '1';
                    
                    // Отправляем событие микро-конверсии в аналитику
                    if (typeof ym !== 'undefined') {
                        ym(12345678, 'reachGoal', 'checklist_download');
                    }
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'checklist_download', {
                            'event_category': 'micro_conversion',
                            'event_label': 'lead_form'
                        });
                    }
                }, 1500);
            });
        }
    }
}

/**
 * Показать форму лид-магнита
 */
function showLeadForm() {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.style.display = 'block';
        leadForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
