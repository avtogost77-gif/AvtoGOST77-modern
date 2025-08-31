// Обработка взаимодействий с хедером

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация выпадающего меню
    initDropdownMenu();
    
    // Инициализация поиска
    initSearch();
    
    // Обработка мобильного меню
    initMobileMenu();
});

// Инициализация выпадающего меню
function initDropdownMenu() {
    const navSecondary = document.querySelector('.nav-secondary');
    const navDropdown = document.querySelector('.nav-dropdown');
    
    if (!navSecondary || !navDropdown) return;
    
    // Открытие/закрытие по клику
    const moreBtn = navSecondary.querySelector('.nav-more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navDropdown.style.display = navDropdown.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Закрытие по клику вне меню
    document.addEventListener('click', function(e) {
        if (!navSecondary.contains(e.target)) {
            navDropdown.style.display = 'none';
        }
    });
}

// Инициализация поиска
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchDropdown = document.querySelector('.search-dropdown');
    const searchForm = document.querySelector('.search-form');
    
    if (!searchToggle || !searchDropdown || !searchForm) return;
    
    // Открытие/закрытие по клику
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = searchDropdown.style.display === 'block';
        searchDropdown.style.display = isVisible ? 'none' : 'block';
        
        // Фокус на поле ввода при открытии
        if (!isVisible) {
            setTimeout(() => {
                const searchInput = searchDropdown.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    });
    
    // Закрытие по клику вне поиска
    document.addEventListener('click', function(e) {
        const headerSearch = document.querySelector('.header-search');
        if (headerSearch && !headerSearch.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
    
    // Обработка отправки формы поиска
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = searchForm.querySelector('.search-input');
        if (searchInput && searchInput.value.trim()) {
            // Редирект на страницу поиска (можно заменить на реальную страницу поиска)
            window.location.href = 'services.html?search=' + encodeURIComponent(searchInput.value.trim());
        }
    });
}

// Обработка мобильного меню
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (!mobileToggle) return;
    
    // Добавляем обработчик, если его еще нет
    if (typeof window.toggleMobileMenu !== 'function') {
        window.toggleMobileMenu = function() {
            const header = document.querySelector('.header');
            header.classList.toggle('mobile-menu-open');
            
            // Добавляем временное мобильное меню, если его нет
            let mobileMenu = document.querySelector('.mobile-menu');
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                
                // Копируем ссылки из основной навигации
                const navLinks = document.querySelectorAll('.nav-link');
                const navLinksHtml = Array.from(navLinks).map(link => {
                    return `<a href="${link.getAttribute('href')}" class="mobile-menu-link">${link.textContent}</a>`;
                }).join('');
                
                mobileMenu.innerHTML = navLinksHtml;
                document.body.appendChild(mobileMenu);
                
                // Добавляем стили для мобильного меню
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-menu {
                        position: fixed;
                        top: 46px;
                        left: 0;
                        right: 0;
                        background: white;
                        padding: 20px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        display: none;
                        flex-direction: column;
                        z-index: 99;
                    }
                    
                    .header.mobile-menu-open .mobile-menu {
                        display: flex;
                    }
                    
                    .mobile-menu-link {
                        padding: 12px;
                        border-bottom: 1px solid #f3f4f6;
                        color: #1f2937;
                        text-decoration: none;
                        font-size: 1rem;
                    }
                    
                    .mobile-menu-link:last-child {
                        border-bottom: none;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Показываем/скрываем мобильное меню
            mobileMenu.style.display = header.classList.contains('mobile-menu-open') ? 'flex' : 'none';
        };
    }
}
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
/**
 * Улучшенная навигация по странице
 * v1.0.0 - 2025-08
 */

// Блок навигации по странице удален до лучших времен

// addSectionAnchors удалена

// createPageNavigation удалена

// findCurrentSection удалена

// initReadingProgress удалена

// updateReadingProgress удалена

// initBackToTop удалена

// refreshPageNavigation удалена
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
 * Интерактивные элементы футера
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация формы подписки
    initSubscribeForm();
    
    // Анимация ссылок в футере
    initFooterLinksAnimation();
    
    // Плавная прокрутка для якорных ссылок
    initSmoothScrolling();
});

/**
 * Инициализация формы подписки
 */
function initSubscribeForm() {
    const subscribeForm = document.querySelector('.footer-subscribe-form');
    if (!subscribeForm) return;
    
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('.footer-subscribe-input');
        const email = emailInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            showSubscribeError(emailInput, 'Пожалуйста, введите корректный email');
            return;
        }
        
        // Имитация отправки формы
        const submitButton = this.querySelector('.footer-subscribe-button');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
        
        setTimeout(() => {
            showSubscribeSuccess(emailInput, submitButton);
            
            // Возвращаем исходное состояние через 3 секунды
            setTimeout(() => {
                emailInput.value = '';
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Удаляем сообщение об успехе
                const successMessage = document.querySelector('.footer-subscribe-success');
                if (successMessage) {
                    successMessage.remove();
                }
            }, 3000);
        }, 1500);
    });
}

/**
 * Проверка валидности email
 * @param {string} email - Email для проверки
 * @returns {boolean} - Результат проверки
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Показать ошибку подписки
 * @param {HTMLElement} input - Поле ввода email
 * @param {string} message - Сообщение об ошибке
 */
function showSubscribeError(input, message) {
    // Удаляем предыдущее сообщение об ошибке, если оно есть
    const existingError = document.querySelector('.footer-subscribe-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем новое сообщение об ошибке
    const errorElement = document.createElement('div');
    errorElement.className = 'footer-subscribe-error';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '8px';
    errorElement.textContent = message;
    
    // Добавляем сообщение после формы
    input.parentNode.parentNode.appendChild(errorElement);
    
    // Выделяем поле ввода
    input.style.border = '1px solid #ef4444';
    input.focus();
    
    // Удаляем сообщение через 3 секунды
    setTimeout(() => {
        errorElement.remove();
        input.style.border = '';
    }, 3000);
}

/**
 * Показать успешную подписку
 * @param {HTMLElement} input - Поле ввода email
 * @param {HTMLElement} button - Кнопка подписки
 */
function showSubscribeSuccess(input, button) {
    // Удаляем предыдущее сообщение об успехе, если оно есть
    const existingSuccess = document.querySelector('.footer-subscribe-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Создаем новое сообщение об успехе
    const successElement = document.createElement('div');
    successElement.className = 'footer-subscribe-success';
    successElement.style.color = '#10b981';
    successElement.style.fontSize = '14px';
    successElement.style.marginTop = '8px';
    successElement.style.fontWeight = '600';
    successElement.textContent = 'Спасибо за подписку!';
    
    // Добавляем сообщение после формы
    input.parentNode.parentNode.appendChild(successElement);
    
    // Изменяем стили кнопки
    button.style.background = '#10b981';
    button.textContent = '✓';
    
    // Возвращаем исходный стиль кнопки через 3 секунды
    setTimeout(() => {
        button.style.background = '';
    }, 3000);
}

/**
 * Инициализация анимации ссылок в футере
 */
function initFooterLinksAnimation() {
    const footerNavLinks = document.querySelectorAll('.footer-nav-link');
    
    footerNavLinks.forEach(link => {
        // Добавляем иконку стрелки, если её ещё нет
        if (!link.querySelector('.footer-nav-icon')) {
            const icon = document.createElement('span');
            icon.className = 'footer-nav-icon';
            icon.innerHTML = '→';
            link.prepend(icon);
        }
    });
}

/**
 * Инициализация плавной прокрутки для якорных ссылок
 */
function initSmoothScrolling() {
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Проверяем, что это якорная ссылка на существующий элемент
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                const headerOffset = 80; // Высота фиксированного хедера
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Обновление интерактивных элементов футера
 * Вызывать эту функцию, если содержимое футера изменяется динамически
 */
function refreshFooterInteractions() {
    initSubscribeForm();
    initFooterLinksAnimation();
    initSmoothScrolling();
}

// Экспортируем функцию для возможного использования в других скриптах
window.refreshFooterInteractions = refreshFooterInteractions;
