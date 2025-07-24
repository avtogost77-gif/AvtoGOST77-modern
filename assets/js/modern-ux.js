// ===============================================
// СОВРЕМЕННЫЕ UX/UI УЛУЧШЕНИЯ 2025
// Микроинтеракции, состояния загрузки, прогрессивные улучшения
// ===============================================

class ModernUXEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoadingStates();
    this.setupMicrointeractions();
    this.setupProgressiveEnhancement();
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
  }

  // ===============================================
  // СОСТОЯНИЯ ЗАГРУЗКИ И СКЕЛЕТОНЫ
  // ===============================================
  
  setupLoadingStates() {
    // Skeleton screens для калькулятора
    this.createSkeletonLoader('.smart-calculator', 'calculator');
    
    // Skeleton для карты
    this.createSkeletonLoader('.map-canvas', 'map');
    
    // Плавная загрузка изображений (перенесено в performance.js)
    // this.setupLazyLoading();
    
    // Progress indicators для форм
    this.setupFormProgress();
  }

  createSkeletonLoader(selector, type) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const skeleton = this.generateSkeleton(type);
      element.insertAdjacentHTML('beforebegin', skeleton);
      
      // Убираем скелетон когда контент загрузился
      const observer = new MutationObserver(() => {
        if (element.children.length > 0) {
          const skeletonEl = element.previousElementSibling;
          if (skeletonEl && skeletonEl.classList.contains('skeleton-loader')) {
            this.fadeOutSkeleton(skeletonEl);
          }
          observer.disconnect();
        }
      });
      
      observer.observe(element, { childList: true });
    });
  }

  generateSkeleton(type) {
    const skeletons = {
      calculator: `
        <div class="skeleton-loader" aria-label="Загрузка калькулятора">
          <div class="skeleton-header">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-subtitle"></div>
          </div>
          <div class="skeleton-form">
            <div class="skeleton-section">
              <div class="skeleton-line skeleton-label"></div>
              <div class="skeleton-inputs">
                <div class="skeleton-input"></div>
                <div class="skeleton-input"></div>
              </div>
            </div>
            <div class="skeleton-section">
              <div class="skeleton-line skeleton-label"></div>
              <div class="skeleton-grid">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
              </div>
            </div>
            <div class="skeleton-button"></div>
          </div>
        </div>
      `,
      map: `
        <div class="skeleton-loader skeleton-map" aria-label="Загрузка карты">
          <div class="skeleton-map-placeholder">
            <div class="skeleton-map-icon">🗺️</div>
            <div class="skeleton-map-text">Загрузка интерактивной карты...</div>
          </div>
        </div>
      `
    };
    
    return skeletons[type] || '';
  }

  fadeOutSkeleton(element) {
    element.style.transition = 'opacity 0.3s ease-out';
    element.style.opacity = '0';
    setTimeout(() => {
      element.remove();
    }, 300);
  }

  // ===============================================
  // МИКРОИНТЕРАКЦИИ
  // ===============================================
  
  setupMicrointeractions() {
    // Hover эффекты для кнопок
    this.setupButtonMicrointeractions();
    
    // Анимации при фокусе на формах
    this.setupFormMicrointeractions();
    
    // Ripple эффект для кликов
    this.setupRippleEffect();
    
    // Magnetic buttons
    this.setupMagneticButtons();
    
    // Parallax эффекты
    this.setupParallaxEffects();
  }

  setupButtonMicrointeractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Magnetic effect
      button.addEventListener('mouseenter', (e) => {
        this.addButtonGlow(e.target);
      });
      
      button.addEventListener('mouseleave', (e) => {
        this.removeButtonGlow(e.target);
      });
      
      // Click animation
      button.addEventListener('click', (e) => {
        this.createRipple(e);
        this.addClickAnimation(e.target);
      });
    });
  }

  addButtonGlow(button) {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
  }

  removeButtonGlow(button) {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '';
  }

  setupRippleEffect() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn, .card, .clickable')) {
        this.createRipple(e);
      }
    });
  }

  createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 1000;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // ===============================================
  // ПРОГРЕССИВНЫЕ УЛУЧШЕНИЯ
  // ===============================================
  
  setupProgressiveEnhancement() {
    // Service Worker для кэширования
    this.registerServiceWorker();
    
    // Preload критических ресурсов
    this.preloadCriticalResources();
    
    // Infinite scroll для контента
    this.setupInfiniteScroll();
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Dynamic imports для больших модулей
    this.setupDynamicImports();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K для открытия калькулятора
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.focusCalculator();
      }
      
      // Escape для закрытия модалов
      if (e.key === 'Escape') {
        this.closeModals();
      }
      
      // Tab для навигации с визуальными индикаторами
      if (e.key === 'Tab') {
        this.showFocusIndicators();
      }
    });
  }

  // ===============================================
  // ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ
  // ===============================================
  
  setupPerformanceOptimizations() {
    // Debounce для поиска и автодополнения
    this.setupDebouncedSearch();
    
    // Virtual scrolling для больших списков
    this.setupVirtualScrolling();
    
    // Intersection Observer для ленивой загрузки
    this.setupIntersectionObserver();
    
    // Web Workers для тяжелых вычислений
    this.setupWebWorkers();
  }

  setupDebouncedSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    
    searchInputs.forEach(input => {
      let timeoutId;
      
      input.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      rootMargin: '50px 0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Наблюдаем за всеми элементами с классом reveal
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  // ===============================================
  // ДОСТУПНОСТЬ (A11Y)
  // ===============================================
  
  setupAccessibility() {
    // Screen reader announcements
    this.setupScreenReaderAnnouncements();
    
    // Focus management
    this.setupFocusManagement();
    
    // High contrast mode detection
    this.setupHighContrastMode();
    
    // Reduce motion for users who prefer it
    this.setupReducedMotion();
    
    // ARIA live regions
    this.setupAriaLiveRegions();
  }

  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.classList.add('reduced-motion');
      
      // Отключаем анимации
      const style = document.createElement('style');
      style.textContent = `
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  setupAriaLiveRegions() {
    // Создаем скрытые области для объявлений
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcements';
    document.body.appendChild(announcer);
    
    this.announcer = announcer;
  }

  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
      
      // Очищаем через 1 секунду
      setTimeout(() => {
        this.announcer.textContent = '';
      }, 1000);
    }
  }

  // ===============================================
  // УТИЛИТЫ
  // ===============================================
  
  animateElement(element) {
    element.classList.add('revealed');
    
    // Объявляем для screen readers
    if (element.dataset.announceText) {
      this.announce(element.dataset.announceText);
    }
  }

  focusCalculator() {
    const calculator = document.querySelector('#smart-calculator');
    if (calculator) {
      calculator.scrollIntoView({ behavior: 'smooth' });
      
      // Фокусируемся на первом поле ввода
      const firstInput = calculator.querySelector('input');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
      }
    }
  }

  closeModals() {
    const modals = document.querySelectorAll('.modal-overlay.open');
    modals.forEach(modal => {
      modal.classList.remove('open');
    });
  }

  showFocusIndicators() {
    document.body.classList.add('user-is-tabbing');
    
    // Убираем класс при клике мышью
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('user-is-tabbing');
    }, { once: true });
  }

  // Debounce utility
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

  // Throttle utility
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
    }
  }
}

// ===============================================
// CSS СТИЛИ ДЛЯ МИКРОИНТЕРАКЦИЙ
// ===============================================

const microinteractionStyles = `
  /* Ripple effect */
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  /* Skeleton loaders */
  .skeleton-loader {
    padding: 2rem;
    background: white;
    border-radius: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .skeleton-line,
  .skeleton-input,
  .skeleton-card,
  .skeleton-button {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 8px;
  }

  .skeleton-title {
    height: 32px;
    width: 60%;
    margin-bottom: 1rem;
  }

  .skeleton-subtitle {
    height: 20px;
    width: 80%;
    margin-bottom: 2rem;
  }

  .skeleton-label {
    height: 16px;
    width: 40%;
    margin-bottom: 0.5rem;
  }

  .skeleton-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .skeleton-input {
    height: 48px;
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .skeleton-card {
    height: 120px;
  }

  .skeleton-button {
    height: 56px;
    width: 200px;
    margin: 0 auto;
  }

  .skeleton-map {
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--neutral-100);
  }

  .skeleton-map-placeholder {
    text-align: center;
  }

  .skeleton-map-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .skeleton-map-text {
    color: var(--neutral-500);
    font-size: 1.125rem;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Focus indicators для доступности */
  .user-is-tabbing *:focus {
    outline: 3px solid var(--primary-400);
    outline-offset: 2px;
  }

  /* Reduced motion styles */
  .reduced-motion .animate-fade-in-up,
  .reduced-motion .animate-float,
  .reduced-motion .reveal {
    animation: none !important;
    transition: none !important;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :root {
      --primary-600: #000080;
      --neutral-800: #000000;
      --neutral-200: #808080;
    }
  }

  /* Loading states */
  .loading {
    position: relative;
    pointer-events: none;
    opacity: 0.7;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid var(--primary-200);
    border-top-color: var(--primary-600);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Инжектируем стили
const styleSheet = document.createElement('style');
styleSheet.textContent = microinteractionStyles;
document.head.appendChild(styleSheet);

// Инициализируем при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.modernUX = new ModernUXEnhancer();
});