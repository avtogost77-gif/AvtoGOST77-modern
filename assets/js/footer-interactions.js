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
