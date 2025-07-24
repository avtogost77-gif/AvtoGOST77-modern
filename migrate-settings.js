/**
 * 🔄 Миграция настроек из avtogost77-modern
 * Сохраняем все работающие интеграции
 */

// =============================================================================
// 📊 АНАЛИТИКА (УЖЕ НАСТРОЕНА)
// =============================================================================

// Яндекс.Метрика - СОХРАНЯЕМ КАК ЕСТЬ
const YANDEX_METRICA = {
  id: 103413788,
  events: [
    'PHONE_CLICK',
    'WHATSAPP_CLICK', 
    'TELEGRAM_CLICK',
    'CALCULATOR_USE',
    'ORDER_BUTTON_CLICK',
    'CONTACT_FORM_SUCCESS',
    'LEAD_FORM_SUCCESS'
  ]
};

// Google Analytics 4 - ДОБАВЛЯЕМ
const GOOGLE_ANALYTICS = {
  id: 'G-XXXXXXXXXX', // Нужно создать
  events: [
    'page_view',
    'phone_click',
    'calculator_use',
    'form_submit',
    'scroll_90'
  ]
};

// =============================================================================
// 🤖 TELEGRAM BOT (УЖЕ НАСТРОЕН)
// =============================================================================

const FATHER_BOT = {
  token: '7999458907:AAHAnyTyvfteW1WNKpns8w35jl14f0wn5es',
  chatId: '399711407',
  apiUrl: 'https://api.telegram.org/bot',
  
  // Проверка работоспособности
  async test() {
    try {
      const response = await fetch(`${this.apiUrl}${this.token}/getMe`);
      const result = await response.json();
      console.log('✅ Telegram Bot активен:', result.result.username);
      return true;
    } catch (error) {
      console.error('❌ Ошибка Telegram Bot:', error);
      return false;
    }
  }
};

// =============================================================================
// 🏠 ДОМЕН И ХОСТИНГ
// =============================================================================

const HOSTING_CONFIG = {
  domain: 'avtogost77.ru',
  ssl: {
    enabled: true,
    expires: '2025', // на год
    provider: 'Reg.ru'
  },
  current: {
    provider: 'Reg.ru',
    panel: 'ISPManager',
    plan: 'Basic' // рекомендуем апгрейд
  },
  recommended: {
    plan: 'PRO',
    cost: '$10-15/month',
    features: [
      'SSD 25GB',
      'Unlimited bandwidth',
      'PHP 8+',
      'MySQL 5',
      'Email unlimited',
      '24/7 support'
    ]
  }
};

// =============================================================================
// 📞 КОНТАКТЫ (ОБНОВЛЕННЫЕ)
// =============================================================================

const BUSINESS_CONTACTS = {
  phone: '+79162720932',
  whatsapp: '79162720932',
  telegram: '@avtogost77',
  email: 'avtogost77@gmail.com',
  
  // Для интеграций
  links: {
    phone: 'tel:+79162720932',
    whatsapp: 'https://wa.me/79162720932',
    telegram: 'https://t.me/avtogost77',
    email: 'mailto:avtogost77@gmail.com'
  }
};

// =============================================================================
// 🔧 ФУНКЦИИ МИГРАЦИИ
// =============================================================================

// Перенос метрики в новый код
function migrateYandexMetrica() {
  return `
<!-- Яндекс.Метрика (СОХРАНЕНО ИЗ СТАРОЙ ВЕРСИИ) -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(${YANDEX_METRICA.id}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true,
        ecommerce:"dataLayer"
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${YANDEX_METRICA.id}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
  `;
}

// Добавление Google Analytics
function addGoogleAnalytics() {
  return `
<!-- Google Analytics 4 (НОВОЕ) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS.id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GOOGLE_ANALYTICS.id}', {
    send_page_view: true,
    enhanced_measurement: {
      scrolls: true,
      outbound_clicks: true,
      site_search: true,
      video_engagement: true,
      file_downloads: true
    }
  });
</script>
  `;
}

// Объединенные события аналитики
function createUnifiedAnalytics() {
  return `
// Универсальная функция отправки событий
function trackEvent(action, category = 'general', label = '', value = 0) {
  // Яндекс.Метрика
  if (typeof ym !== 'undefined') {
    ym(${YANDEX_METRICA.id}, 'reachGoal', action.toUpperCase());
  }
  
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  console.log(\`📊 Событие: \${action} (\${category})\`);
}

// События для отслеживания
document.addEventListener('DOMContentLoaded', function() {
  // Клики по телефону
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('phone_click', 'contact'));
  });
  
  // Клики по WhatsApp
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('whatsapp_click', 'contact'));
  });
  
  // Клики по Telegram
  document.querySelectorAll('a[href*="t.me"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('telegram_click', 'contact'));
  });
  
  // Использование калькулятора
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-calculate')) {
      trackEvent('calculator_use', 'engagement');
    }
  });
  
  // Скролл до 90%
  let scrollTracked = false;
  window.addEventListener('scroll', function() {
    if (!scrollTracked && window.scrollY / (document.body.scrollHeight - window.innerHeight) > 0.9) {
      trackEvent('scroll_90', 'engagement');
      scrollTracked = true;
    }
  });
});
  `;
}

// Сохранение Telegram бота
function migrateTelegramBot() {
  return `
// Father Bot конфигурация (СОХРАНЕНО)
const TELEGRAM_BOT = {
  token: '${FATHER_BOT.token}',
  chatId: '${FATHER_BOT.chatId}',
  
  async sendMessage(text, parseMode = 'HTML') {
    try {
      const response = await fetch(\`https://api.telegram.org/bot\${this.token}/sendMessage\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: parseMode,
          disable_web_page_preview: true
        })
      });
      
      const result = await response.json();
      if (result.ok) {
        console.log('✅ Сообщение отправлено в Telegram');
        return true;
      } else {
        console.error('❌ Ошибка Telegram:', result.description);
        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка отправки в Telegram:', error);
      return false;
    }
  }
};
  `;
}

// =============================================================================
// 📋 ЧЕКЛИСТ МИГРАЦИИ
// =============================================================================

const MIGRATION_CHECKLIST = [
  '✅ Сохранить Яндекс.Метрику (ID: 103413788)',
  '🆕 Добавить Google Analytics 4',
  '✅ Сохранить Father Bot настройки',
  '🆕 Добавить Google Search Console',
  '🔄 Обновить контакты во всех файлах',
  '⚡ Настроить объединенную аналитику',
  '🎯 Добавить конверсионные события',
  '📱 Проверить работу на мобильных',
  '🚀 Тестирование всех форм',
  '🔍 SEO проверка и индексация'
];

// =============================================================================
// 🎯 ЭКСПОРТ КОНФИГУРАЦИИ
// =============================================================================

module.exports = {
  YANDEX_METRICA,
  GOOGLE_ANALYTICS,
  FATHER_BOT,
  HOSTING_CONFIG,
  BUSINESS_CONTACTS,
  migrateYandexMetrica,
  addGoogleAnalytics,
  createUnifiedAnalytics,
  migrateTelegramBot,
  MIGRATION_CHECKLIST
};

console.log('🔄 Настройки миграции загружены. Все интеграции сохранены!');