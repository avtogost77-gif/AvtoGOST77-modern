// 🚀 ОТПРАВКА ФОРМ В TELEGRAM
// Вместо API endpoint используем прямую отправку в Telegram

const TELEGRAM_CONFIG = {
    // Бот токен @father_bot
    botToken: '7999458907:AAHAnyTyvfteW1WNKpns8w35jl14f0wn5es',
    
    // Chat ID менеджера (Илюша)
    chatId: 399711407,
    
    // Шаблоны сообщений
    templates: {
        leadForm: (data) => `
🔔 *НОВАЯ ЗАЯВКА С САЙТА!*

👤 *Имя:* ${data.name || 'Не указано'}
📞 *Телефон:* ${data.phone}
${data.email ? `📧 *Email:* ${data.email}` : ''}
${data.route ? `🚚 *Маршрут:* ${data.route}` : ''}
${data.price ? `💰 *Рассчитанная цена:* ${data.price}` : ''}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
🌐 *Источник:* ${data.source || 'Форма на сайте'}
        `,
        
        exitIntent: (data) => `
🎁 *ЗАЯВКА С POP-UP (ПРОМОКОД)!*

👤 *Имя:* ${data.name}
📞 *Телефон:* ${data.phone}
📧 *Email:* ${data.email || 'Не указан'}
🎟️ *Промокод:* ${data.promoCode || 'WELCOME10'}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
🔥 *Клиент хотел уйти с сайта!*
        `,
        
        calculator: (data) => `
📊 *РАСЧЕТ В КАЛЬКУЛЯТОРЕ!*

📍 *Откуда:* ${data.from}
📍 *Куда:* ${data.to}
📦 *Вес:* ${data.weight} кг
${data.volume ? `📐 *Объем:* ${data.volume} м³` : ''}
🚛 *Транспорт:* ${data.transport}
💰 *Рассчитанная цена:* ${data.price}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
        `
    }
};

// Функция отправки в Telegram
async function sendToTelegram(data, templateType = 'leadForm') {
    try {
        // Формируем сообщение
        const message = TELEGRAM_CONFIG.templates[templateType](data);
        
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
        
        if (!result.ok) {
            console.error('Telegram API error:', result);
            // Fallback - сохраняем в localStorage
            saveToLocalStorage(data);
            return { success: false, error: result.description };
        }
        
        return { success: true, messageId: result.result.message_id };
        
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        // Fallback - сохраняем в localStorage
        saveToLocalStorage(data);
        return { success: false, error: error.message };
    }
}

// Fallback - сохранение в localStorage если Telegram недоступен
function saveToLocalStorage(data) {
    const leads = JSON.parse(localStorage.getItem('pendingLeads') || '[]');
    leads.push({
        ...data,
        timestamp: new Date().toISOString(),
        sent: false
    });
    localStorage.setItem('pendingLeads', JSON.stringify(leads));
    console.log('Lead saved to localStorage:', data);
}

// Переопределяем функцию отправки формы
window.submitLeadForm = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Добавляем дополнительную информацию
    data.source = 'Форма захвата после калькулятора';
    data.timestamp = new Date().toISOString();
    
    // Показываем индикатор загрузки
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
    submitButton.disabled = true;
    
    // Отправляем в Telegram
    const result = await sendToTelegram(data, 'leadForm');
    
    if (result.success) {
        // Показываем успех
        event.target.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 60px; color: #4CAF50; margin-bottom: 20px;"></i>
                <h3>Спасибо! Мы уже звоним вам!</h3>
                <p>Менеджер перезвонит в течение 5 минут</p>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                    Ваша заявка №${result.messageId}
                </p>
            </div>
        `;
        
        // Цель в Метрике
        if (typeof ym !== 'undefined') {
            ym(103413788, 'reachGoal', 'lead_form_sent', data);
        }
    } else {
        // Показываем ошибку, но делаем вид что все ок для пользователя
        event.target.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 60px; color: #4CAF50; margin-bottom: 20px;"></i>
                <h3>Спасибо! Ваша заявка принята!</h3>
                <p>Менеджер свяжется с вами в течение 15 минут</p>
                <p style="margin-top: 20px; color: #ff9800; font-size: 12px;">
                    Если мы не позвоним в течение 10 минут, позвоните нам: +7 916 272-09-32
                </p>
            </div>
        `;
        
        console.error('Failed to send to Telegram, saved locally');
    }
};

// Функция для Exit-Intent popup
window.submitExitIntentForm = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.promoCode = 'WELCOME10';
    data.source = 'Exit-Intent Pop-up';
    
    // Отправляем в Telegram
    const result = await sendToTelegram(data, 'exitIntent');
    
    // Показываем успех в любом случае
    showExitIntentSuccess();
};

// Переопределяем отправку данных калькулятора
window.sendCalculatorDataToTelegram = async function(calculatorData) {
    // Отправляем данные расчета
    await sendToTelegram(calculatorData, 'calculator');
    
    // Можно также показать форму захвата
    if (typeof showLeadForm === 'function') {
        showLeadForm(
            `${calculatorData.from} → ${calculatorData.to}`,
            calculatorData.price
        );
    }
};

// Проверяем и отправляем сохраненные заявки при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    const pendingLeads = JSON.parse(localStorage.getItem('pendingLeads') || '[]');
    
    if (pendingLeads.length > 0) {
        console.log(`Found ${pendingLeads.length} pending leads, trying to send...`);
        
        for (const lead of pendingLeads) {
            if (!lead.sent) {
                const result = await sendToTelegram(lead);
                if (result.success) {
                    lead.sent = true;
                    lead.messageId = result.messageId;
                }
            }
        }
        
        // Сохраняем обновленный список
        localStorage.setItem('pendingLeads', JSON.stringify(pendingLeads.filter(l => !l.sent)));
    }
});

// Экспорт для использования в других скриптах
window.TelegramSender = {
    send: sendToTelegram,
    config: TELEGRAM_CONFIG
};