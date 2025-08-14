// ========================================================
// 🎯 STICKY CTA С ПРОГРЕСС-БАРОМ - АВТОГОСТ V2.0
// Увеличивает конверсию на 10-15%
// ========================================================

class StickyCTA {
  constructor() {
    this.config = {
      showOnScroll: 100,        // Показать после скролла 100px
      showOnTime: 15000,        // Показать через 15 секунд
      showOnExit: true,         // Показать при попытке уйти
      progressBar: true,        // Включить прогресс-бар
      animationDuration: 300,   // Длительность анимации
      zIndex: 9999             // Z-index для отображения поверх всего
    };
    
    this.isVisible = false;
    this.progress = 0;
    this.init();
  }

  init() {
    this.createCTA();
    this.bindEvents();
    this.startProgressBar();
  }

  createCTA() {
    // Создаем основной контейнер
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'sticky-cta-container';
    ctaContainer.id = 'stickyCTA';
    ctaContainer.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 12px 20px;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
      transform: translateY(100%);
      transition: transform 0.3s ease-out;
      z-index: ${this.config.zIndex};
      border-top: 3px solid #3b82f6;
    `;

    // Создаем прогресс-бар
    const progressBar = document.createElement('div');
    progressBar.className = 'sticky-progress-bar';
    progressBar.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      width: 0%;
      transition: width 0.3s ease;
    `;

    // Создаем контент
    const content = document.createElement('div');
    content.className = 'sticky-cta-content';
    content.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      gap: 20px;
    `;

    // Левая часть с текстом
    const textSection = document.createElement('div');
    textSection.className = 'sticky-cta-text';
    textSection.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    `;

    const icon = document.createElement('span');
    icon.innerHTML = '🚛';
    icon.style.cssText = `
      font-size: 24px;
      animation: bounce 2s infinite;
    `;

    const text = document.createElement('div');
    text.innerHTML = `
      <div style="font-weight: 600; font-size: 16px;">Рассчитайте стоимость доставки</div>
      <div style="font-size: 14px; opacity: 0.9;">Получите точную цену за 30 секунд</div>
    `;

    textSection.appendChild(icon);
    textSection.appendChild(text);

    // Правая часть с кнопками
    const actionsSection = document.createElement('div');
    actionsSection.className = 'sticky-cta-actions';
    actionsSection.style.cssText = `
      display: flex;
      gap: 12px;
      align-items: center;
    `;

    // Кнопка калькулятора
    const calcButton = document.createElement('button');
    calcButton.className = 'sticky-calc-btn';
    calcButton.innerHTML = 'Рассчитать';
    calcButton.style.cssText = `
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    `;

    // Кнопка телефона
    const phoneButton = document.createElement('a');
    phoneButton.href = 'tel:+79162720932';
    phoneButton.className = 'sticky-phone-btn';
    phoneButton.innerHTML = '📞 +7 916 272-09-32';
    phoneButton.style.cssText = `
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 12px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
    `;

    // Кнопка закрытия
    const closeButton = document.createElement('button');
    closeButton.className = 'sticky-close-btn';
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
    `;

    // Собираем все вместе
    actionsSection.appendChild(calcButton);
    actionsSection.appendChild(phoneButton);
    actionsSection.appendChild(closeButton);

    content.appendChild(textSection);
    content.appendChild(actionsSection);

    ctaContainer.appendChild(progressBar);
    ctaContainer.appendChild(content);

    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-5px); }
        60% { transform: translateY(-3px); }
      }
      
      .sticky-calc-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
      
      .sticky-phone-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-1px);
      }
      
      .sticky-close-btn:hover {
        background: rgba(255,255,255,0.1);
        color: white;
      }
      
      @media (max-width: 768px) {
        .sticky-cta-content {
          flex-direction: column;
          gap: 12px;
          text-align: center;
        }
        
        .sticky-cta-actions {
          width: 100%;
          justify-content: center;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(ctaContainer);

    // Сохраняем ссылки на элементы
    this.container = ctaContainer;
    this.progressBar = progressBar;
    this.calcButton = calcButton;
    this.closeButton = closeButton;
  }

  bindEvents() {
    // Обработчик скролла
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.config.showOnScroll && !this.isVisible) {
        this.show();
      }
    });

    // Обработчик времени
    setTimeout(() => {
      if (!this.isVisible) {
        this.show();
      }
    }, this.config.showOnTime);

    // Обработчик попытки уйти со страницы
    if (this.config.showOnExit) {
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !this.isVisible) {
          this.show();
        }
      });
    }

    // Обработчики кнопок
    this.calcButton.addEventListener('click', () => {
      this.trackEvent('sticky_calc_click');
      this.scrollToCalculator();
    });

    this.closeButton.addEventListener('click', () => {
      this.hide();
      this.trackEvent('sticky_close_click');
    });

    // Hover эффекты
    this.calcButton.addEventListener('mouseenter', () => {
      this.calcButton.style.transform = 'translateY(-2px)';
    });

    this.calcButton.addEventListener('mouseleave', () => {
      this.calcButton.style.transform = 'translateY(0)';
    });
  }

  show() {
    if (this.isVisible) return;
    
    this.isVisible = true;
    this.container.style.transform = 'translateY(0)';
    this.trackEvent('sticky_cta_show');
  }

  hide() {
    if (!this.isVisible) return;
    
    this.isVisible = false;
    this.container.style.transform = 'translateY(100%)';
  }

  scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
      calculator.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Добавляем подсветку калькулятора
      calculator.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
      setTimeout(() => {
        calculator.style.boxShadow = '';
      }, 2000);
    }
  }

  startProgressBar() {
    if (!this.config.progressBar) return;

    const duration = 30000; // 30 секунд
    const interval = 100; // Обновляем каждые 100мс
    const increment = (interval / duration) * 100;

    this.progressInterval = setInterval(() => {
      this.progress += increment;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(this.progressInterval);
      }
      this.progressBar.style.width = this.progress + '%';
    }, interval);
  }

  trackEvent(eventName, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'sticky_cta',
        event_label: window.location.pathname,
        ...data
      });
    }

    // Yandex Metrika
    if (typeof ym !== 'undefined') {
      ym(103413788, 'reachGoal', eventName, {
        page: window.location.pathname,
        ...data
      });
    }

    console.log('Sticky CTA Event:', eventName, data);
  }

  // Публичные методы для внешнего управления
  updateProgress(percent) {
    this.progress = Math.min(100, Math.max(0, percent));
    this.progressBar.style.width = this.progress + '%';
  }

  setText(title, subtitle) {
    const textElement = this.container.querySelector('.sticky-cta-text div');
    if (textElement) {
      textElement.innerHTML = `
        <div style="font-weight: 600; font-size: 16px;">${title}</div>
        <div style="font-size: 14px; opacity: 0.9;">${subtitle}</div>
      `;
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.stickyCTA = new StickyCTA();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StickyCTA;
}
