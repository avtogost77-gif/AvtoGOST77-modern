// ===============================================
// ПРОИЗВОДИТЕЛЬНОСТЬ И ОПТИМИЗАЦИЯ
// Lazy loading, сжатие, Web Vitals
// ===============================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Инициализация после загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initOptimizations());
    } else {
      this.initOptimizations();
    }
  }

  initOptimizations() {
    this.setupLazyLoading();
    this.setupResourceHints();
    this.setupCriticalResourceLoading();
    this.monitorWebVitals();
    this.optimizeImages();
    this.deferNonCriticalCSS();
  }

  // ===============================================
  // LAZY LOADING ИЗОБРАЖЕНИЙ
  // ===============================================
  
  setupLazyLoading() {
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Загружаем за 50px до появления
        threshold: 0.01
      });

      // Находим все изображения с data-src
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });

      // Добавляем skeleton loading для изображений
      this.addImageSkeletons();
    } else {
      // Fallback для старых браузеров
      this.loadAllImages();
    }
  }

  loadImage(img) {
    // Создаем новый объект Image для предзагрузки
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Плавная замена skeleton на изображение
      img.src = img.dataset.src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      
      // Удаляем data-src
      delete img.dataset.src;
    };

    imageLoader.onerror = () => {
      // Показываем placeholder при ошибке
      img.src = this.createPlaceholderImage(img.width || 300, img.height || 200);
      img.classList.add('lazy-error');
    };

    imageLoader.src = img.dataset.src;
  }

  addImageSkeletons() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.classList.add('lazy-loading', 'skeleton');
      
      // Добавляем размеры если их нет
      if (!img.width && !img.height) {
        img.style.width = '100%';
        img.style.height = '200px';
      }
    });
  }

  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img));
  }

  createPlaceholderImage(width, height) {
    // Создаем SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">
          📷 Изображение недоступно
        </text>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  // ===============================================
  // ОПТИМИЗАЦИЯ РЕСУРСОВ
  // ===============================================

  setupResourceHints() {
    // DNS prefetch для внешних ресурсов
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'unpkg.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect для критических ресурсов
    const criticalDomains = ['fonts.googleapis.com'];
    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  setupCriticalResourceLoading() {
    // Предзагрузка критических ресурсов
    const criticalResources = [
      { href: 'assets/css/critical.css', as: 'style' },
      { href: 'assets/js/main.js', as: 'script' },
      { href: 'manifest.json', as: 'manifest' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'script') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  deferNonCriticalCSS() {
    // Отложенная загрузка некритического CSS
    const nonCriticalCSS = [
      'https://unpkg.com/aos@2.3.4/dist/aos.css'
    ];

    // Загружаем после полной загрузки страницы
    window.addEventListener('load', () => {
      nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print'; // Сначала как print
        link.onload = () => {
          link.media = 'all'; // Потом переключаем на all
        };
        document.head.appendChild(link);
      });
    });
  }

  // ===============================================
  // ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ
  // ===============================================

  optimizeImages() {
    // WebP поддержка
    this.setupWebPSupport();
    
    // Responsive images
    this.setupResponsiveImages();
  }

  setupWebPSupport() {
    // Проверяем поддержку WebP
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      const hasWebP = webP.height === 2;
      document.documentElement.classList.toggle('webp', hasWebP);
      document.documentElement.classList.toggle('no-webp', !hasWebP);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  setupResponsiveImages() {
    // Автоматическое добавление srcset для изображений
    const images = document.querySelectorAll('img:not([srcset])');
    images.forEach(img => {
      if (img.src && !img.dataset.src) {
        const baseSrc = img.src.replace(/\.[^/.]+$/, ''); // Убираем расширение
        const ext = img.src.split('.').pop();
        
        // Создаем srcset для разных разрешений
        const srcset = [
          `${baseSrc}-320w.${ext} 320w`,
          `${baseSrc}-640w.${ext} 640w`,
          `${baseSrc}-1024w.${ext} 1024w`,
          `${baseSrc}-1920w.${ext} 1920w`
        ].join(', ');
        
        img.srcset = srcset;
        img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
      }
    });
  }

  // ===============================================
  // WEB VITALS МОНИТОРИНГ
  // ===============================================

  monitorWebVitals() {
    // Мониторинг Core Web Vitals
    this.measureLCP(); // Largest Contentful Paint
    this.measureFID(); // First Input Delay  
    this.measureCLS(); // Cumulative Layout Shift
    this.measureTTFB(); // Time to First Byte
  }

  measureLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        console.log('🎯 LCP (Largest Contentful Paint):', Math.round(lastEntry.startTime), 'ms');
        
        // Отправляем метрику (если есть аналитика)
        this.sendMetric('LCP', Math.round(lastEntry.startTime));
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  measureFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('⚡ FID (First Input Delay):', Math.round(entry.processingStart - entry.startTime), 'ms');
          this.sendMetric('FID', Math.round(entry.processingStart - entry.startTime));
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  measureCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        console.log('📐 CLS (Cumulative Layout Shift):', clsValue.toFixed(4));
        this.sendMetric('CLS', clsValue);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  measureTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        console.log('🚀 TTFB (Time to First Byte):', Math.round(ttfb), 'ms');
        this.sendMetric('TTFB', Math.round(ttfb));
      }
    }
  }

  sendMetric(name, value) {
    // Здесь можно отправлять метрики в аналитику
    // Например, в Yandex.Metrika или Google Analytics
    if (window.ym) {
      window.ym(123456789, 'params', { [name]: value });
    }
    
    // Или в собственную систему аналитики
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        metric_name: name,
        metric_value: value
      });
    }
  }

  // ===============================================
  // УТИЛИТЫ ПРОИЗВОДИТЕЛЬНОСТИ
  // ===============================================

  // Debounce для оптимизации событий
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle для scroll событий
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

  // Проверка видимости элемента
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

// ===============================================
// ИНИЦИАЛИЗАЦИЯ
// ===============================================

// Запускаем оптимизацию производительности
const performanceOptimizer = new PerformanceOptimizer();

// Экспортируем для использования в других скриптах
window.PerformanceOptimizer = PerformanceOptimizer;