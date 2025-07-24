// ===============================================
// SEO ОПТИМИЗАЦИЯ И СТРУКТУРИРОВАННЫЕ ДАННЫЕ
// Schema.org, Open Graph, Core Web Vitals
// ===============================================

class SEOOptimizer {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initSEO());
    } else {
      this.initSEO();
    }
  }

  initSEO() {
    this.injectStructuredData();
    this.optimizeMetaTags();
    this.setupBreadcrumbs();
    this.trackUserBehavior();
    this.optimizeImages();
    this.setupInternalLinking();
    this.monitorCoreWebVitals();
  }

  // ===============================================
  // СТРУКТУРИРОВАННЫЕ ДАННЫЕ (SCHEMA.ORG)
  // ===============================================

  injectStructuredData() {
    const schemas = [
      this.createOrganizationSchema(),
      this.createLocalBusinessSchema(),
      this.createServiceSchema(),
      this.createWebsiteSchema(),
      this.createBreadcrumbSchema(),
      this.createFAQSchema()
    ];

    schemas.forEach(schema => {
      if (schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
  }

  createOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "АвтоГОСТ",
      "alternateName": "AvtoGOST",
      "description": "Инфраструктура бизнеса. Грузоперевозки, аутсорсинг логистики, удаленный отдел логистики для малого и среднего бизнеса.",
      "url": "https://avtogost77.ru",
      "logo": {
        "@type": "ImageObject",
        "url": "https://avtogost77.ru/assets/img/icon-512x512.svg",
        "width": 512,
        "height": 512
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+7-916-272-09-32",
        "contactType": "customer service",
        "availableLanguage": ["Russian"],
        "areaServed": "RU"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RU",
        "addressRegion": "Московская область",
        "addressLocality": "Москва"
      },
      "sameAs": [
        "https://t.me/avtogost77",
        "https://wa.me/79162720932"
      ],
      "foundingDate": "2014",
      "numberOfEmployees": "10-50",
      "knowsAbout": [
        "Грузоперевозки",
        "Логистика",
        "Аутсорсинг транспорта",
        "Доставка на маркетплейсы",
        "Спот-заявки"
      ]
    };
  }

  createLocalBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://avtogost77.ru/#business",
      "name": "АвтоГОСТ",
      "image": "https://avtogost77.ru/assets/img/icon-512x512.svg",
      "telephone": "+7-916-272-09-32",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Москва и Московская область",
        "addressLocality": "Москва",
        "addressRegion": "Московская область",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 55.7558,
        "longitude": 37.6176
      },
      "url": "https://avtogost77.ru",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "priceRange": "₽₽",
      "currenciesAccepted": "RUB",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer"
    };
  }

  createServiceSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Удаленный отдел логистики",
      "description": "Аутсорсинг логистики для малого и среднего бизнеса. Спот-заявки, доставка на маркетплейсы, прямые перевозки без складов.",
      "provider": {
        "@type": "Organization",
        "name": "АвтоГОСТ"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Russia"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Логистические услуги",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Грузоперевозки по России",
              "description": "От Газели до 20-тонных фур"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Доставка на маркетплейсы",
              "description": "Wildberries, Ozon, сортировочные центры"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Спот-заявки",
              "description": "Срочная подача транспорта за 2-3 часа"
            }
          }
        ]
      }
    };
  }

  createWebsiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "АвтоГОСТ - Инфраструктура бизнеса",
      "url": "https://avtogost77.ru",
      "description": "Пока вы создаете — мы доставляем. Логистика без тревог для малого и среднего бизнеса.",
      "inLanguage": "ru",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://avtogost77.ru/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  createBreadcrumbSchema() {
    const breadcrumbs = this.getBreadcrumbs();
    if (breadcrumbs.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  createFAQSchema() {
    const faqData = [
      {
        question: "Как быстро вы можете подать транспорт?",
        answer: "Для спот-заявок в Москве и МО - от 2 до 3 часов. Плановые перевозки - от 24 часов."
      },
      {
        question: "Какие грузы вы перевозите?",
        answer: "Обычные грузы, хрупкие, товары для маркетплейсов. Не работаем с опасными грузами, медикаментами и негабаритом."
      },
      {
        question: "Работаете ли вы с малым бизнесом?",
        answer: "Да, мы специализируемся на микро, малом и среднем бизнесе с оборотом от 100 млн до 500 млн рублей."
      },
      {
        question: "Как формируется стоимость?",
        answer: "Индивидуальный расчет по маршруту, весу, объему и типу груза. Фиксированная стоимость без скрытых доплат."
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  }

  // ===============================================
  // ОПТИМИЗАЦИЯ META ТЕГОВ
  // ===============================================

  optimizeMetaTags() {
    // Динамическое обновление title и description
    this.updatePageTitle();
    this.updateMetaDescription();
    this.addOpenGraphTags();
    this.addTwitterCardTags();
    this.addCanonicalTag();
    this.optimizeKeywords();
  }

  updatePageTitle() {
    const currentTitle = document.title;
    const pageType = this.getPageType();
    
    let optimizedTitle = currentTitle;
    
    switch (pageType) {
      case 'home':
        optimizedTitle = "АвтоГОСТ — Инфраструктура бизнеса | Грузоперевозки Москва | Удаленный отдел логистики";
        break;
      case 'calculator':
        optimizedTitle = "Калькулятор стоимости грузоперевозок | Расчет доставки по России | АвтоГОСТ";
        break;
      case 'services':
        optimizedTitle = "Услуги логистики и грузоперевозок | Аутсорсинг транспорта | АвтоГОСТ";
        break;
      case 'contact':
        optimizedTitle = "Контакты АвтоГОСТ | Заказать грузоперевозку | Телефон логистической компании";
        break;
    }
    
    if (optimizedTitle !== currentTitle) {
      document.title = optimizedTitle;
    }
  }

  updateMetaDescription() {
    const pageType = this.getPageType();
    let description = "";
    
    switch (pageType) {
      case 'home':
        description = "🎯 Мы не логистическая компания — мы инфраструктура вашего бизнеса. Аутсорсинг логистики, спот-заявки, доставка на маркетплейсы. Работаем незаметно, как электричество в розетке.";
        break;
      case 'calculator':
        description = "Точный расчет стоимости грузоперевозок по России. Калькулятор учитывает маршрут, вес, объем и тип груза. Мгновенный результат без скрытых доплат.";
        break;
      case 'services':
        description = "Полный спектр логистических услуг: грузоперевозки от Газели до 20т, доставка на маркетплейсы, спот-заявки, аутсорсинг транспорта для малого и среднего бизнеса.";
        break;
    }
    
    if (description) {
      this.updateMetaTag('description', description);
    }
  }

  addOpenGraphTags() {
    const ogTags = {
      'og:type': 'website',
      'og:site_name': 'АвтоГОСТ',
      'og:locale': 'ru_RU',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/jpeg'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      this.updateMetaTag(property, content, 'property');
    });
  }

  addTwitterCardTags() {
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@avtogost77',
      'twitter:creator': '@avtogost77'
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      this.updateMetaTag(name, content, 'name');
    });
  }

  addCanonicalTag() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.href.split('?')[0].split('#')[0];
      document.head.appendChild(link);
    }
  }

  optimizeKeywords() {
    // Добавляем скрытые семантические ключевые слова
    const keywords = [
      'грузоперевозки москва',
      'логистика малый бизнес', 
      'аутсорсинг транспорта',
      'доставка маркетплейсы',
      'спот заявки',
      'удаленный отдел логистики',
      'прямые перевозки',
      'газель фура',
      'расчет доставки',
      'транспортная компания'
    ];
    
    this.updateMetaTag('keywords', keywords.join(', '));
  }

  updateMetaTag(name, content, attribute = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  // ===============================================
  // ХЛЕБНЫЕ КРОШКИ
  // ===============================================

  setupBreadcrumbs() {
    const breadcrumbs = this.getBreadcrumbs();
    if (breadcrumbs.length > 1) {
      this.renderBreadcrumbs(breadcrumbs);
    }
  }

  getBreadcrumbs() {
    const path = window.location.pathname;
    const breadcrumbs = [{ name: 'Главная', url: '/' }];
    
    const pathMap = {
      '/services.html': 'Услуги',
      '/contact.html': 'Контакты', 
      '/about.html': 'О компании',
      '/faq.html': 'Вопросы и ответы',
      '/moscow-regions.html': 'Московская область',
      '/marketplace-delivery.html': 'Доставка на маркетплейсы',
      '/urgent-delivery.html': 'Срочная доставка'
    };
    
    if (pathMap[path]) {
      breadcrumbs.push({ 
        name: pathMap[path], 
        url: window.location.href 
      });
    }
    
    return breadcrumbs;
  }

  renderBreadcrumbs(breadcrumbs) {
    const breadcrumbHTML = `
      <nav class="breadcrumbs" aria-label="Навигация">
        <ol class="breadcrumb-list">
          ${breadcrumbs.map((crumb, index) => `
            <li class="breadcrumb-item">
              ${index === breadcrumbs.length - 1 
                ? `<span aria-current="page">${crumb.name}</span>`
                : `<a href="${crumb.url}">${crumb.name}</a>`
              }
            </li>
          `).join('')}
        </ol>
      </nav>
    `;
    
    // Вставляем после header
    const header = document.querySelector('.header');
    if (header) {
      header.insertAdjacentHTML('afterend', breadcrumbHTML);
    }
  }

  // ===============================================
  // ПОВЕДЕНЧЕСКИЕ ФАКТОРЫ
  // ===============================================

  trackUserBehavior() {
    this.trackScrollDepth();
    this.trackTimeOnPage();
    this.trackClickEvents();
    this.trackFormInteractions();
  }

  trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90, 100];
    const tracked = new Set();

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);
      
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          this.sendBehaviorEvent('scroll_depth', { depth: milestone });
        }
      });
    };

    window.addEventListener('scroll', this.throttle(trackScroll, 250));
  }

  trackTimeOnPage() {
    const startTime = Date.now();
    
    // Отправляем время через определенные интервалы
    const intervals = [30, 60, 120, 300]; // секунды
    
    intervals.forEach(interval => {
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          this.sendBehaviorEvent('time_on_page', { seconds: interval });
        }
      }, interval * 1000);
    });
    
    // Отправляем итоговое время при уходе
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.sendBehaviorEvent('session_duration', { seconds: timeSpent });
    });
  }

  trackClickEvents() {
    // Отслеживаем клики по важным элементам
    const selectors = [
      'a[href^="tel:"]',
      'a[href^="mailto:"]', 
      'a[href*="whatsapp"]',
      'a[href*="telegram"]',
      '.btn-primary',
      '.calculator-form button',
      '#pwa-install-btn'
    ];

    selectors.forEach(selector => {
      document.addEventListener('click', (e) => {
        if (e.target.matches(selector)) {
          this.sendBehaviorEvent('click', {
            element: selector,
            text: e.target.textContent.trim(),
            href: e.target.href
          });
        }
      });
    });
  }

  trackFormInteractions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Начало заполнения формы
      form.addEventListener('focusin', () => {
        this.sendBehaviorEvent('form_start', { form: form.id || 'unnamed' });
      }, { once: true });
      
      // Отправка формы
      form.addEventListener('submit', () => {
        this.sendBehaviorEvent('form_submit', { form: form.id || 'unnamed' });
      });
    });
  }

  sendBehaviorEvent(event, data) {
    // Отправляем в аналитику (Yandex.Metrika, Google Analytics)
    if (window.ym) {
      window.ym(123456789, 'reachGoal', event, data);
    }
    
    if (window.gtag) {
      window.gtag('event', event, {
        event_category: 'user_behavior',
        ...data
      });
    }
    
    console.log('📊 Behavior Event:', event, data);
  }

  // ===============================================
  // ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ ДЛЯ SEO
  // ===============================================

  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Добавляем alt если его нет
      if (!img.alt) {
        img.alt = this.generateAltText(img);
      }
      
      // Добавляем loading="lazy" для неважных изображений
      if (!img.hasAttribute('loading') && !this.isCriticalImage(img)) {
        img.loading = 'lazy';
      }
      
      // Добавляем title для дополнительного контекста
      if (!img.title && img.alt) {
        img.title = img.alt;
      }
    });
  }

  generateAltText(img) {
    const src = img.src || img.dataset.src || '';
    const filename = src.split('/').pop().split('.')[0];
    
    // Простая генерация alt на основе имени файла
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim() || 'Изображение АвтоГОСТ';
  }

  isCriticalImage(img) {
    // Определяем критические изображения (логотип, hero, первый экран)
    const rect = img.getBoundingClientRect();
    const isAboveFold = rect.top < window.innerHeight;
    const isLogo = img.classList.contains('logo') || img.alt.includes('лого');
    
    return isAboveFold || isLogo;
  }

  // ===============================================
  // ВНУТРЕННЯЯ ПЕРЕЛИНКОВКА
  // ===============================================

  setupInternalLinking() {
    this.addContextualLinks();
    this.highlightImportantLinks();
  }

  addContextualLinks() {
    // Автоматически добавляем ссылки на релевантные страницы
    const contentLinks = {
      'калькулятор': '/#smart-calculator',
      'услуги': '/services.html',
      'контакты': '/contact.html',
      'маркетплейс': '/marketplace-delivery.html',
      'срочная доставка': '/urgent-delivery.html',
      'московская область': '/moscow-regions.html'
    };

    const textNodes = this.getTextNodes(document.body);
    
    Object.entries(contentLinks).forEach(([keyword, url]) => {
      textNodes.forEach(node => {
        if (node.textContent.toLowerCase().includes(keyword)) {
          // Заменяем текст на ссылку (упрощенная версия)
          const parent = node.parentNode;
          if (parent && !parent.closest('a')) {
            const text = node.textContent;
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            if (regex.test(text)) {
              const newHTML = text.replace(regex, `<a href="${url}" class="contextual-link">$&</a>`);
              parent.innerHTML = parent.innerHTML.replace(text, newHTML);
            }
          }
        }
      });
    });
  }

  getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
    }

    return textNodes;
  }

  highlightImportantLinks() {
    // Добавляем микроразметку для важных ссылок
    const importantLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
    
    importantLinks.forEach(link => {
      link.setAttribute('itemscope', '');
      link.setAttribute('itemtype', 'https://schema.org/ContactPoint');
    });
  }

  // ===============================================
  // CORE WEB VITALS МОНИТОРИНГ
  // ===============================================

  monitorCoreWebVitals() {
    // Используем существующий PerformanceOptimizer если доступен
    if (window.PerformanceOptimizer) {
      return; // Уже настроен в performance.js
    }

    // Базовый мониторинг если PerformanceOptimizer недоступен
    this.measureBasicMetrics();
  }

  measureBasicMetrics() {
    // Простые метрики производительности
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstByte: navigation.responseStart - navigation.requestStart
      };

      console.log('📈 Basic Performance Metrics:', metrics);
      
      // Отправляем в аналитику
      Object.entries(metrics).forEach(([name, value]) => {
        this.sendBehaviorEvent('performance', { metric: name, value: Math.round(value) });
      });
    });
  }

  // ===============================================
  // УТИЛИТЫ
  // ===============================================

  getPageType() {
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('calculator') || window.location.hash.includes('calculator')) return 'calculator';
    if (path.includes('services')) return 'services';
    if (path.includes('contact')) return 'contact';
    if (path.includes('about')) return 'about';
    
    return 'other';
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ===============================================
// ИНИЦИАЛИЗАЦИЯ
// ===============================================

// Запускаем SEO оптимизацию
const seoOptimizer = new SEOOptimizer();

// Экспортируем для использования в других скриптах
window.SEOOptimizer = SEOOptimizer;