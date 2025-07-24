// ===============================================
// ОБРАБОТЧИК ФОРМ АВТОГОСТ
// Отправка лидов в Telegram через бота
// ===============================================

// Конфигурация Telegram бота
const TELEGRAM_CONFIG = {
  botToken: 'YOUR_BOT_TOKEN', // Замените на токен вашего бота
  chatId: 'YOUR_CHAT_ID',     // Замените на ваш chat_id
  apiUrl: 'https://api.telegram.org/bot'
};

document.addEventListener('DOMContentLoaded', function() {
  
  // Обработчик формы на странице контактов
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  // Обработчик модальной формы заявки
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', handleLeadForm);
  }
  
});

async function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message');
  
  // Формируем сообщение для Telegram
  const telegramMessage = `🚛 <b>ЗАЯВКА С САЙТА АВТОГОСТ</b>

👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email}

💬 <b>Сообщение:</b>
${message}

🌐 <b>Источник:</b> avtogost77.ru/contact.html
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

  // Отправляем в Telegram
  try {
    await sendToTelegram(telegramMessage);
    showSuccessMessage('✅ Заявка отправлена! Свяжемся в течение 15 минут.');
    e.target.reset(); // Очищаем форму
  } catch (error) {
    console.error('Ошибка отправки:', error);
    showErrorMessage('❌ Ошибка отправки. Позвоните нам: +7 916 272-09-32');
  }
}

async function handleLeadForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email') || 'не указан';
  const details = formData.get('details') || 'Заявка с калькулятора';
  
  // Формируем сообщение для Telegram
  const telegramMessage = `🧮 <b>ЛИД ИЗ КАЛЬКУЛЯТОРА</b>

👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email}

📋 <b>Детали расчета:</b>
${details}

🌐 <b>Источник:</b> avtogost77.ru (калькулятор)
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

  // Отправляем в Telegram
  try {
    await sendToTelegram(telegramMessage);
    
    // Закрываем модальное окно
    const modal = document.getElementById('lead-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    
    showSuccessMessage('✅ Заявка отправлена! Свяжемся в течение 15 минут.');
    e.target.reset(); // Очищаем форму
  } catch (error) {
    console.error('Ошибка отправки:', error);
    showErrorMessage('❌ Ошибка отправки. Позвоните нам: +7 916 272-09-32');
  }
}

async function sendToTelegram(message) {
  const url = `${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.chatId,
      text: message,
      parse_mode: 'HTML'
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

function showSuccessMessage(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-weight: 500;
    max-width: 350px;
  `;
  notification.innerHTML = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

function showErrorMessage(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc3545;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-weight: 500;
    max-width: 350px;
  `;
  notification.innerHTML = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 7000);
}

// Функция для закрытия модального окна по клику вне его
document.addEventListener('click', function(e) {
  const modal = document.getElementById('lead-modal');
  if (modal && e.target === modal) {
    modal.style.display = 'none';
  }
});

// ESC для закрытия модального окна
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('lead-modal');
    if (modal && modal.style.display !== 'none') {
      modal.style.display = 'none';
    }
  }
});

// ===============================================
// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ TELEGRAM БОТА
// ===============================================
/*

1. Создайте бота через @BotFather:
   - Напишите /newbot
   - Укажите имя: АвтоГост Форм Бот
   - Укажите username: avtogost77_forms_bot
   - Получите токен

2. Узнайте свой chat_id:
   - Напишите боту любое сообщение
   - Откройте: https://api.telegram.org/bot<TOKEN>/getUpdates
   - Найдите "chat":{"id":123456789}

3. Замените в коде:
   - YOUR_BOT_TOKEN на токен бота
   - YOUR_CHAT_ID на ваш chat_id

4. Для продакшена рекомендуется:
   - Создать отдельный файл config.js
   - Использовать переменные окружения
   - Добавить валидацию и retry логику

*/