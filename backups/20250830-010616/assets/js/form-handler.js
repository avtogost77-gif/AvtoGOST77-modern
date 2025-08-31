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
        const botToken = '79162720932:AAGOAjQLmEZuT4SFx4Upl1GjuXO0yFuWok8';
        const chatId = '@avtogost77'; // ID канала @avtogost77
        
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
document.head.appendChild(style);