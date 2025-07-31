// 🚀 ОТПРАВКА ФОРМ В TELEGRAM - ИСПРАВЛЕННАЯ ВЕРСИЯ
// Ночная смена: полностью переработанный модуль

const TELEGRAM_CONFIG = {
    // Настройки подключения
    botToken: null, // Будет загружен из атрибута data-bot-token
    chatId: null,   // Будет загружен из атрибута data-chat-id
    
    // Шаблоны сообщений
    templates: {
        leadForm: (data) => {
            return `🔔 *НОВАЯ ЗАЯВКА С САЙТА!*

👤 *Имя:* ${data.name || 'Не указано'}
📞 *Телефон:* ${data.phone || 'Не указан'}
${data.email ? `📧 *Email:* ${data.email}` : ''}
${data.comment ? `💬 *Комментарий:* ${data.comment}` : ''}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
🌐 *Источник:* ${data.source || 'Форма на сайте'}`;
        },
        
        exitIntent: (data) => {
            return `🎁 *ЗАЯВКА С EXIT-POPUP!*

👤 *Имя:* ${data.name || 'Не указано'}
📞 *Телефон:* ${data.phone || 'Не указан'}
${data.email ? `📧 *Email:* ${data.email}` : ''}

🎯 *Промокод:* WELCOME10
⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;
        },
        
        calculator: (data) => {
            return `🧮 *РАСЧЕТ В КАЛЬКУЛЯТОРЕ!*

📍 *Маршрут:* ${data.from} → ${data.to}
📦 *Груз:* ${data.weight}кг, ${data.volume}м³
🚛 *Транспорт:* ${data.transport}
💰 *Расчетная стоимость:* ${data.price}₽

👤 *Контакт:* ${data.name || 'Не указано'}
📞 *Телефон:* ${data.phone || 'Не указан'}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;
        }
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Получаем токен и chat ID из data-атрибутов или из скрипта
    const scriptTag = document.currentScript || document.querySelector('script[src*="telegram-sender"]');
    
    if (scriptTag) {
        TELEGRAM_CONFIG.botToken = scriptTag.getAttribute('data-bot-token') || 'ВАШ_ТОКЕН_ЗДЕСЬ';
        TELEGRAM_CONFIG.chatId = scriptTag.getAttribute('data-chat-id') || '399711407';
    }
    
    // Проверяем конфигурацию
    if (TELEGRAM_CONFIG.botToken === 'ВАШ_ТОКЕН_ЗДЕСЬ' || 
        TELEGRAM_CONFIG.botToken === 'ВАШ_НОВЫЙ_ТОКЕН_ЗДЕСЬ') {
        console.error('⚠️ Telegram бот не настроен! Установите правильный токен.');
        return;
    }
    
    console.log('✅ Telegram sender инициализирован');
    
    // Отправляем отложенные заявки
    sendPendingLeads();
});

// Основная функция отправки
async function sendToTelegram(data, templateType = 'leadForm') {
    // Проверка конфигурации
    if (!TELEGRAM_CONFIG.botToken || TELEGRAM_CONFIG.botToken === 'ВАШ_ТОКЕН_ЗДЕСЬ') {
        console.error('❌ Токен бота не установлен!');
        saveToLocalStorage(data);
        showNotification('Заявка сохранена. Мы свяжемся с вами в ближайшее время.', 'warning');
        return { success: false, error: 'Bot token not configured' };
    }
    
    try {
        // Формируем сообщение
        const template = TELEGRAM_CONFIG.templates[templateType] || TELEGRAM_CONFIG.templates.leadForm;
        const message = template(data);
        
        // Отправляем в Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Заявка отправлена в Telegram');
            showNotification('Спасибо! Мы свяжемся с вами в течение 15 минут.', 'success');
            return { success: true, messageId: result.result.message_id };
        } else {
            console.error('❌ Ошибка Telegram API:', result);
            saveToLocalStorage(data);
            showNotification('Заявка принята. Мы свяжемся с вами в ближайшее время.', 'info');
            return { success: false, error: result.description };
        }
        
    } catch (error) {
        console.error('❌ Ошибка отправки:', error);
        saveToLocalStorage(data);
        showNotification('Заявка сохранена. Мы свяжемся с вами в ближайшее время.', 'info');
        return { success: false, error: error.message };
    }
}

// Сохранение в localStorage как запасной вариант
function saveToLocalStorage(data) {
    const pendingLeads = JSON.parse(localStorage.getItem('pendingLeads') || '[]');
    pendingLeads.push({
        ...data,
        timestamp: new Date().toISOString(),
        sent: false
    });
    localStorage.setItem('pendingLeads', JSON.stringify(pendingLeads));
    console.log('💾 Заявка сохранена локально');
}

// Отправка отложенных заявок
async function sendPendingLeads() {
    const pendingLeads = JSON.parse(localStorage.getItem('pendingLeads') || '[]');
    
    if (pendingLeads.length === 0) return;
    
    console.log(`📤 Найдено ${pendingLeads.length} отложенных заявок`);
    
    for (let i = 0; i < pendingLeads.length; i++) {
        const lead = pendingLeads[i];
        if (!lead.sent) {
            const result = await sendToTelegram(lead);
            if (result.success) {
                pendingLeads[i].sent = true;
                pendingLeads[i].messageId = result.messageId;
            }
        }
    }
    
    // Сохраняем обновленный список (только неотправленные)
    const unsent = pendingLeads.filter(lead => !lead.sent);
    localStorage.setItem('pendingLeads', JSON.stringify(unsent));
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    // Если есть готовая система уведомлений - используем её
    if (window.NotificationManager && typeof window.NotificationManager.show === 'function') {
        window.NotificationManager.show(message, type);
        return;
    }
    
    // Иначе создаем простое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Обработчики форм
window.submitExitIntentForm = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.source = 'Exit-Intent Pop-up';
    
    await sendToTelegram(data, 'exitIntent');
    
    // Закрываем popup
    if (typeof closeExitPopup === 'function') {
        setTimeout(closeExitPopup, 2000);
    }
};

window.submitLeadForm = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    await sendToTelegram(data, 'leadForm');
};

window.submitCalculatorData = async function(calculatorData) {
    await sendToTelegram(calculatorData, 'calculator');
};

// Экспорт функций
window.sendToTelegram = sendToTelegram;
window.TelegramSender = {
    send: sendToTelegram,
    config: TELEGRAM_CONFIG,
    showNotification: showNotification
};

// CSS для анимаций
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

console.log('📱 Telegram Sender v2.0 загружен');