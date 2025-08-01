// Простой обработчик форм для MVP
document.addEventListener('DOMContentLoaded', function() {
    // Обработка контактной формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
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
            sendToTelegram(text, 'contact-form');
            
            // Логируем для отладки
            console.log('Новая заявка отправлена в Telegram:', text);
        });
    }
    
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
            
            console.log('Сообщение отправлено в Telegram');
            return true;
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
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
});