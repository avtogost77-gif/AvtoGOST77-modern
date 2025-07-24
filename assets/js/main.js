document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.navbar-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  // Улучшенная валидация форм с согласием 152-ФЗ
  initConsentValidation();

  // PWA Installation
  initPWAInstall();
});

// ===============================================
// PWA УСТАНОВКА
// ===============================================

let deferredPrompt;

function initPWAInstall() {
  const installBtn = document.getElementById('pwa-install-btn');
  
  if (!installBtn) return;

  // Показываем кнопку, если PWA может быть установлено
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
    
    // Добавляем анимацию появления
    installBtn.style.opacity = '0';
    setTimeout(() => {
      installBtn.style.transition = 'opacity 0.3s ease';
      installBtn.style.opacity = '1';
    }, 100);
  });

  // Обработчик клика на кнопку установки
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    // Показываем диалог установки
    deferredPrompt.prompt();
    
    // Ждем выбор пользователя
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ PWA установлено');
      showInstallSuccess();
    } else {
      console.log('❌ Установка PWA отклонена');
    }
    
    // Очищаем промпт
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });

  // Скрываем кнопку после установки
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA успешно установлено');
    installBtn.style.display = 'none';
    showInstallSuccess();
  });
}

function showInstallSuccess() {
  // Создаем уведомление об успешной установке
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    ">
      🎉 Приложение АвтоГОСТ установлено!
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Убираем уведомление через 3 секунды
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===============================================
// ВАЛИДАЦИЯ СОГЛАСИЯ 152-ФЗ
// ===============================================

function initConsentValidation() {
  const consentCheckboxes = document.querySelectorAll('input[name="consent"]');
  
  consentCheckboxes.forEach(checkbox => {
    const label = checkbox.closest('.consent-checkbox');
    
    // Валидация при изменении состояния
    checkbox.addEventListener('change', () => {
      validateConsent(checkbox, label);
    });
    
    // Валидация при фокусе
    checkbox.addEventListener('focus', () => {
      label?.classList.remove('invalid');
    });
    
    // Валидация при потере фокуса
    checkbox.addEventListener('blur', () => {
      validateConsent(checkbox, label);
    });
  });
  
  // Валидация всех форм при отправке
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const consent = form.querySelector('input[name="consent"]');
      const label = consent?.closest('.consent-checkbox');
      
      if (consent && !consent.checked) {
        e.preventDefault();
        
        // Визуальная индикация ошибки
        if (label) {
          label.classList.add('invalid');
          label.classList.remove('valid');
        }
        
        // Прокрутка к чекбоксу
        consent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        consent.focus();
        
        // Уведомление
        showConsentError();
        
        return false;
      }
      
      if (label) {
        label.classList.add('valid');
        label.classList.remove('invalid');
      }
    });
  });
}

function validateConsent(checkbox, label) {
  if (!label) return;
  
  if (checkbox.checked) {
    label.classList.add('valid');
    label.classList.remove('invalid');
  } else {
    label.classList.remove('valid');
    // Не добавляем invalid сразу, только при отправке формы
  }
}

function showConsentError() {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    ">
      ⚠️ Необходимо согласие на обработку данных
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Убираем уведомление через 4 секунды
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}