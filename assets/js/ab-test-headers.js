// ========================================================
// 🧪 A/B ТЕСТ ЗАГОЛОВКОВ - АВТОГОСТ V2.0
// Тестируем эффективность разных заголовков
// ========================================================

class ABTestHeaders {
  constructor() {
    this.config = {
      testName: 'header_variants',
      variants: [
        {
          id: 'A',
          title: 'АвтоГОСТ - Инфраструктура вашего бизнеса | Грузоперевозки по России',
          h1: 'Инфраструктура вашего бизнеса',
          subtitle: 'Профессиональные грузоперевозки по России с подачей от 2 часов',
          cta: 'Рассчитать стоимость за 30 секунд'
        },
        {
          id: 'B',
          title: 'Грузоперевозки по России от 2 часов | АвтоГОСТ - Быстрая доставка',
          h1: 'Доставка грузов по России от 2 часов',
          subtitle: 'Быстрая подача транспорта, точный расчет стоимости, круглосуточная работа',
          cta: 'Получить точную цену сейчас'
        },
        {
          id: 'C',
          title: 'Калькулятор стоимости доставки | АвтоГОСТ - Рассчитать цену грузоперевозки',
          h1: 'Рассчитайте стоимость доставки за 30 секунд',
          subtitle: 'Умный калькулятор с точными ценами. Подача транспорта от 2 часов',
          cta: 'Рассчитать за 30 сек'
        }
      ],
      trafficSplit: 0.5, // 50% трафика для теста
      duration: 14, // дней
      minSample: 1000, // минимальная выборка
      goals: ['scroll_to_calculator', 'calculator_complete', 'phone_click', 'form_submit']
    };
    
    this.currentVariant = null;
    this.init();
  }

  init() {
    // Проверяем, нужно ли показывать тест
    if (!this.shouldShowTest()) {
      return;
    }

    // Выбираем вариант
    this.currentVariant = this.selectVariant();
    
    // Применяем вариант
    this.applyVariant(this.currentVariant);
    
    // Настраиваем трекинг
    this.setupTracking();
    
    // Сохраняем в localStorage
    this.saveVariant();
    
    console.log(`A/B Test: Applied variant ${this.currentVariant.id}`);
  }

  shouldShowTest() {
    // Проверяем, не истек ли срок теста
    const testStart = localStorage.getItem('ab_test_start');
    if (testStart) {
      const daysPassed = (Date.now() - parseInt(testStart)) / (1000 * 60 * 60 * 24);
      if (daysPassed > this.config.duration) {
        return false;
      }
    } else {
      localStorage.setItem('ab_test_start', Date.now().toString());
    }

    // Проверяем, достаточно ли трафика
    const testCount = parseInt(localStorage.getItem('ab_test_count') || '0');
    if (testCount < this.config.minSample) {
      localStorage.setItem('ab_test_count', (testCount + 1).toString());
    }

    // Случайное распределение трафика
    return Math.random() < this.config.trafficSplit;
  }

  selectVariant() {
    // Проверяем, есть ли сохраненный вариант
    const savedVariant = localStorage.getItem('ab_test_variant');
    if (savedVariant) {
      const variant = this.config.variants.find(v => v.id === savedVariant);
      if (variant) {
        return variant;
      }
    }

    // Выбираем случайный вариант
    const randomIndex = Math.floor(Math.random() * this.config.variants.length);
    return this.config.variants[randomIndex];
  }

  applyVariant(variant) {
    // Обновляем title
    document.title = variant.title;

    // Обновляем meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', variant.subtitle);
    }

    // Обновляем Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', variant.h1);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', variant.subtitle);
    }

    // Обновляем Twitter Card
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', variant.h1);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', variant.subtitle);
    }

    // Обновляем H1 на странице
    const h1Element = document.querySelector('h1');
    if (h1Element) {
      h1Element.textContent = variant.h1;
    }

    // Обновляем подзаголовок
    const subtitleElement = document.querySelector('.hero-subtitle, .hero p, .hero-description');
    if (subtitleElement) {
      subtitleElement.textContent = variant.subtitle;
    }

    // Обновляем CTA кнопки
    const ctaButtons = document.querySelectorAll('.btn-primary, .hero-cta, .main-cta');
    ctaButtons.forEach(button => {
      if (button.textContent.includes('Рассчитать') || button.textContent.includes('Получить')) {
        button.textContent = variant.cta;
      }
    });

    // Обновляем sticky CTA если есть
    if (window.stickyCTA) {
      window.stickyCTA.setText('Рассчитайте стоимость доставки', variant.subtitle);
    }
  }

  setupTracking() {
    // Трекинг показа варианта
    this.trackEvent('variant_shown', {
      variant: this.currentVariant.id,
      test_name: this.config.testName
    });

    // Трекинг целей
    this.config.goals.forEach(goal => {
      this.trackGoal(goal);
    });

    // Трекинг времени на странице
    this.trackTimeOnPage();
  }

  trackGoal(goalName) {
    switch (goalName) {
      case 'scroll_to_calculator':
        this.trackScrollToCalculator();
        break;
      case 'calculator_complete':
        this.trackCalculatorComplete();
        break;
      case 'phone_click':
        this.trackPhoneClick();
        break;
      case 'form_submit':
        this.trackFormSubmit();
        break;
    }
  }

  trackScrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('scroll_to_calculator', {
              variant: this.currentVariant.id,
              test_name: this.config.testName
            });
            observer.disconnect();
          }
        });
      });
      observer.observe(calculator);
    }
  }

  trackCalculatorComplete() {
    // Слушаем события калькулятора
    document.addEventListener('calculator_complete', (e) => {
      this.trackEvent('calculator_complete', {
        variant: this.currentVariant.id,
        test_name: this.config.testName,
        calculation_data: e.detail
      });
    });
  }

  trackPhoneClick() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('phone_click', {
          variant: this.currentVariant.id,
          test_name: this.config.testName,
          phone_number: link.href.replace('tel:', '')
        });
      });
    });
  }

  trackFormSubmit() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', () => {
        this.trackEvent('form_submit', {
          variant: this.currentVariant.id,
          test_name: this.config.testName,
          form_id: form.id || 'unknown'
        });
      });
    });
  }

  trackTimeOnPage() {
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackEvent('time_on_page', {
        variant: this.currentVariant.id,
        test_name: this.config.testName,
        time_seconds: Math.round(timeOnPage / 1000)
      });
    });
  }

  trackEvent(eventName, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'ab_test',
        event_label: this.config.testName,
        custom_parameter_variant: this.currentVariant.id,
        ...data
      });
    }

    // Yandex Metrika
    if (typeof ym !== 'undefined') {
      ym(103413788, 'reachGoal', eventName, {
        test_name: this.config.testName,
        variant: this.currentVariant.id,
        ...data
      });
    }

    // Локальное логирование
    console.log('A/B Test Event:', eventName, {
      variant: this.currentVariant.id,
      test_name: this.config.testName,
      ...data
    });
  }

  saveVariant() {
    localStorage.setItem('ab_test_variant', this.currentVariant.id);
    localStorage.setItem('ab_test_name', this.config.testName);
  }

  // Методы для анализа результатов
  getTestResults() {
    const results = {
      test_name: this.config.testName,
      variant: this.currentVariant.id,
      start_time: localStorage.getItem('ab_test_start'),
      sample_size: localStorage.getItem('ab_test_count'),
      goals: {}
    };

    // Получаем данные из GA4 (если доступны)
    if (typeof gtag !== 'undefined') {
      // Здесь можно добавить запрос к GA4 API
      console.log('GA4 data available for analysis');
    }

    return results;
  }

  // Метод для принудительного применения варианта (для отладки)
  forceVariant(variantId) {
    const variant = this.config.variants.find(v => v.id === variantId);
    if (variant) {
      this.currentVariant = variant;
      this.applyVariant(variant);
      console.log(`Forced variant ${variantId}`);
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.abTestHeaders = new ABTestHeaders();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ABTestHeaders;
}
