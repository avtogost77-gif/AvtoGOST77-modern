// ===============================================
// СОБЫТИЯ ЯНДЕКС.МЕТРИКИ ДЛЯ АВТОГОСТ
// Отслеживание ключевых действий пользователей
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Отслеживание кликов по телефону
  document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', function() {
      if (typeof ym !== 'undefined') {
        const isWhatsApp = this.href.includes('wa.me');
        ym(103413788, 'reachGoal', isWhatsApp ? 'WHATSAPP_CLICK' : 'PHONE_CLICK');
        console.log('Метрика:', isWhatsApp ? 'Клик по WhatsApp' : 'Клик по телефону');
      }
    });
  });
  
  // Отслеживание кликов по Telegram
  document.querySelectorAll('a[href^="https://t.me/"]').forEach(link => {
    link.addEventListener('click', function() {
      if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'TELEGRAM_CLICK');
        console.log('Метрика: Клик по Telegram');
      }
    });
  });
  
  // Отслеживание использования калькулятора
  document.addEventListener('click', function(e) {
    // Клик по кнопке "Рассчитать"
    if (e.target.classList.contains('btn-calculate') || e.target.closest('.btn-calculate')) {
      if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'CALCULATOR_USE');
        console.log('Метрика: Использование калькулятора');
      }
    }
    
    // Клик по кнопке "Заказать доставку"
    if (e.target.textContent.includes('Заказать доставку') || e.target.closest('button')?.textContent.includes('Заказать доставку')) {
      if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'ORDER_BUTTON_CLICK');
        console.log('Метрика: Клик по кнопке заказа');
      }
    }
  });
  
  // Отслеживание отправки форм
  const originalHandleContactForm = window.handleContactForm;
  const originalHandleLeadForm = window.handleLeadForm;
  
  // Переопределяем функции отправки форм
  if (typeof handleContactForm === 'function') {
    window.handleContactForm = async function(e) {
      if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'CONTACT_FORM_SUBMIT');
        console.log('Метрика: Отправка формы контактов');
      }
      return originalHandleContactForm.call(this, e);
    };
  }
  
  if (typeof handleLeadForm === 'function') {
    window.handleLeadForm = async function(e) {
      if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'LEAD_FORM_SUBMIT');
        console.log('Метрика: Отправка формы лида');
      }
      return originalHandleLeadForm.call(this, e);
    };
  }
  
});

// Отслеживание времени на сайте (через 30 сек, 1 мин, 3 мин)
setTimeout(() => {
  if (typeof ym !== 'undefined') {
    ym(103413788, 'reachGoal', 'TIME_30SEC');
    console.log('Метрика: 30 секунд на сайте');
  }
}, 30000);

setTimeout(() => {
  if (typeof ym !== 'undefined') {
    ym(103413788, 'reachGoal', 'TIME_1MIN');
    console.log('Метрика: 1 минута на сайте');
  }
}, 60000);

setTimeout(() => {
  if (typeof ym !== 'undefined') {
    ym(103413788, 'reachGoal', 'TIME_3MIN');
    console.log('Метрика: 3 минуты на сайте');
  }
}, 180000);

// Отслеживание скролла страницы
let scrollTracked = false;
window.addEventListener('scroll', function() {
  if (!scrollTracked && window.scrollY > document.body.scrollHeight * 0.5) {
    scrollTracked = true;
    if (typeof ym !== 'undefined') {
      ym(103413788, 'reachGoal', 'SCROLL_50PERCENT');
      console.log('Метрика: Прокрутка 50% страницы');
    }
  }
});

// ===============================================
// ЦЕЛИ ДЛЯ НАСТРОЙКИ В ЯНДЕКС.МЕТРИКЕ:
// ===============================================
/*

В интерфейсе Яндекс.Метрики создайте следующие цели:

1. PHONE_CLICK - Клик по телефону
2. WHATSAPP_CLICK - Клик по WhatsApp  
3. TELEGRAM_CLICK - Клик по Telegram
4. CALCULATOR_USE - Использование калькулятора
5. ORDER_BUTTON_CLICK - Клик по кнопке заказа
6. CONTACT_FORM_SUBMIT - Отправка формы контактов
7. LEAD_FORM_SUBMIT - Отправка формы лида
8. TIME_30SEC - 30 секунд на сайте
9. TIME_1MIN - 1 минута на сайте  
10. TIME_3MIN - 3 минуты на сайте
11. SCROLL_50PERCENT - Прокрутка 50% страницы

Это поможет отслеживать эффективность сайта!

*/