/**
 * Sticky CTA Panel для мобильных устройств
 * Док-панель снизу экрана с основными действиями
 */
class StickyCTA {
  constructor() {
    this.isVisible = false;
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    // Создаем панель
    this.createPanel();
    
    // Слушаем изменения размера экрана
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.updateVisibility();
    });

    // Слушаем скролл для показа/скрытия
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Показываем панель через 3 секунды после загрузки
    setTimeout(() => {
      this.show();
    }, 3000);
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.id = 'sticky-cta-panel';
    panel.innerHTML = `
      <div class="sticky-cta-container">
        <button class="sticky-cta-btn sticky-cta-calc" onclick="stickyCTA.scrollToCalculator()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span>Рассчитать</span>
        </button>
        
        <button class="sticky-cta-btn sticky-cta-whatsapp" onclick="stickyCTA.openWhatsApp()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
          <span>WhatsApp</span>
        </button>
        
        <button class="sticky-cta-btn sticky-cta-phone" onclick="stickyCTA.callPhone()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <span>Позвонить</span>
        </button>
      </div>
    `;

    // Добавляем стили
    const styles = document.createElement('style');
    styles.textContent = `
      #sticky-cta-panel {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        transform: translateY(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px 16px;
        padding-bottom: calc(8px + env(safe-area-inset-bottom));
      }

      #sticky-cta-panel.show {
        transform: translateY(0);
      }

      .sticky-cta-container {
        display: flex;
        gap: 8px;
        max-width: 400px;
        margin: 0 auto;
      }

      .sticky-cta-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 8px;
        border: none;
        border-radius: 12px;
        background: #f8f9fa;
        color: #495057;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 60px;
        justify-content: center;
      }

      .sticky-cta-btn:hover {
        background: #e9ecef;
        transform: translateY(-1px);
      }

      .sticky-cta-btn:active {
        transform: translateY(0);
      }

      .sticky-cta-calc {
        background: linear-gradient(135deg, #007bff, #0056b3);
        color: white;
      }

      .sticky-cta-calc:hover {
        background: linear-gradient(135deg, #0056b3, #004085);
      }

      .sticky-cta-whatsapp {
        background: linear-gradient(135deg, #25d366, #128c7e);
        color: white;
      }

      .sticky-cta-whatsapp:hover {
        background: linear-gradient(135deg, #128c7e, #075e54);
      }

      .sticky-cta-phone {
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
      }

      .sticky-cta-phone:hover {
        background: linear-gradient(135deg, #c82333, #a71e2a);
      }

      .sticky-cta-btn svg {
        flex-shrink: 0;
      }

      .sticky-cta-btn span {
        font-size: 11px;
        line-height: 1.2;
        text-align: center;
      }

      /* Только на мобиле */
      @media (min-width: 769px) {
        #sticky-cta-panel {
          display: none;
        }
      }

      /* Анимация появления */
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      #sticky-cta-panel.show {
        animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(panel);
    this.panel = panel;
  }

  show() {
    if (!this.isMobile) return;
    
    this.panel.classList.add('show');
    this.isVisible = true;
    
    // Трекинг показа
    if (window.ym) {
      window.ym(103413788, 'reachGoal', 'sticky_cta_show');
    }
  }

  hide() {
    this.panel.classList.remove('show');
    this.isVisible = false;
  }

  updateVisibility() {
    if (this.isMobile && !this.isVisible) {
      this.show();
    } else if (!this.isMobile && this.isVisible) {
      this.hide();
    }
  }

  handleScroll() {
    if (!this.isMobile) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Показываем если прокрутили больше 50% экрана
    if (scrollY > windowHeight * 0.5) {
      if (!this.isVisible) {
        this.show();
      }
    } else {
      if (this.isVisible) {
        this.hide();
      }
    }
  }

  scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
      calculator.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Трекинг клика
      if (window.ym) {
        window.ym(103413788, 'reachGoal', 'sticky_cta_calc_click');
      }
    }
  }

  openWhatsApp() {
    const message = encodeURIComponent('Здравствуйте! Хочу рассчитать стоимость доставки.');
    const url = `https://wa.me/79162720932?text=${message}`;
    window.open(url, '_blank');
    
    // Трекинг клика
    if (window.ym) {
      window.ym(103413788, 'reachGoal', 'sticky_cta_whatsapp_click');
    }
  }

  callPhone() {
    window.location.href = 'tel:+79162720932';
    
    // Трекинг клика
    if (window.ym) {
      window.ym(103413788, 'reachGoal', 'sticky_cta_phone_click');
    }
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.stickyCTA = new StickyCTA();
});
