// ===============================================
// ОБРАБОТЧИК ФОРМ АВТОГОСТ
// Простое перенаправление в WhatsApp с данными
// ===============================================

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

function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message');
  
  // Формируем сообщение для WhatsApp
  const whatsappMessage = `🚛 ЗАЯВКА С САЙТА АВТОГОСТ

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}

💬 Сообщение:
${message}

---
Отправлено с сайта avtogost77.ru`;

  // Перенаправляем в WhatsApp
  const whatsappUrl = `https://wa.me/79162720932?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank');
  
  // Показываем уведомление
  showSuccessMessage('Перенаправляем в WhatsApp...');
}

function handleLeadForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email') || 'не указан';
  const details = formData.get('details') || 'Заявка с сайта';
  
  // Формируем сообщение для WhatsApp
  const whatsappMessage = `🧮 ЗАЯВКА ИЗ КАЛЬКУЛЯТОРА

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}

📋 Детали:
${details}

---
Отправлено с калькулятора avtogost77.ru`;

  // Перенаправляем в WhatsApp
  const whatsappUrl = `https://wa.me/79162720932?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank');
  
  // Закрываем модальное окно
  const modal = document.getElementById('lead-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  
  // Показываем уведомление
  showSuccessMessage('Перенаправляем в WhatsApp...');
}

function showSuccessMessage(message) {
  // Создаем простое уведомление
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
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Убираем через 3 секунды
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
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