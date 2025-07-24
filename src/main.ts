/**
 * АвтоГОСТ Future 2030 - Главный модуль
 * Тактильное удовольствие и идеальная воронка продаж
 */

import { initializeApp } from './lib/app';
import { Calculator } from './lib/calculator';
import { Analytics } from './lib/analytics';
import { UIComponents } from './lib/ui-components';
import { AIAssistant } from './lib/ai-assistant';
import { SalesPlaybook } from './lib/sales-playbook';
import { SEOOptimizer } from './lib/seo-optimizer';
import { PerformanceMonitor } from './lib/performance-monitor';

// Импорт стилей
import './styles/main.scss';

// Типы для приложения
interface AppConfig {
  apiUrl: string;
  openaiApiKey?: string;
  analyticsKey?: string;
  version: string;
  buildTime: string;
  isDevelopment: boolean;
}

class AvtoGostApp {
  private calculator: Calculator;
  private analytics: Analytics;
  private ui: UIComponents;
  private ai: AIAssistant;
  private salesPlaybook: SalesPlaybook;
  private seo: SEOOptimizer;
  private performance: PerformanceMonitor;
  
  constructor(private config: AppConfig) {
    console.log(`🚀 АвтоГОСТ Future 2030 v${config.version}`);
    console.log(`📅 Собрано: ${config.buildTime}`);
    
    this.initializeModules();
    this.setupEventListeners();
    this.loadDynamicContent();
  }
  
  private initializeModules(): void {
    try {
      // Инициализация модулей в правильном порядке
      this.performance = new PerformanceMonitor();
      this.analytics = new Analytics(this.config.analyticsKey);
      this.ui = new UIComponents();
      this.calculator = new Calculator();
      this.ai = new AIAssistant(this.config.openaiApiKey);
      this.salesPlaybook = new SalesPlaybook(this.analytics);
      this.seo = new SEOOptimizer();
      
      console.log('✅ Все модули инициализированы');
    } catch (error) {
      console.error('❌ Ошибка инициализации:', error);
    }
  }
  
  private setupEventListeners(): void {
    // Глобальные обработчики событий
    document.addEventListener('DOMContentLoaded', () => {
      this.onDOMReady();
    });
    
    window.addEventListener('load', () => {
      this.onWindowLoad();
    });
    
    // Обработка ошибок
    window.addEventListener('error', (event) => {
      this.analytics.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno
      });
    });
    
    // Отслеживание производительности
    window.addEventListener('beforeunload', () => {
      this.performance.sendMetrics();
    });
  }
  
  private onDOMReady(): void {
    console.log('📄 DOM готов');
    
    // Запуск воронки продаж
    this.salesPlaybook.initializeFunnel();
    
    // Инициализация UI компонентов
    this.ui.initializeComponents();
    
    // SEO оптимизация
    this.seo.optimizePage();
    
    // Аналитика первого взаимодействия
    this.analytics.trackEvent('page_ready', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  }
  
  private onWindowLoad(): void {
    console.log('🎉 Страница полностью загружена');
    
    // Метрики производительности
    this.performance.measureCoreWebVitals();
    
    // Ленивая загрузка контента
    this.loadNonCriticalContent();
    
    // Проверка возможностей браузера
    this.detectBrowserCapabilities();
  }
  
  private async loadDynamicContent(): Promise<void> {
    try {
      // Загружаем калькулятор
      const calculatorHTML = await this.renderCalculator();
      const mainContent = document.getElementById('main-content');
      
      if (mainContent) {
        mainContent.innerHTML = calculatorHTML;
        
        // Инициализируем после вставки
        this.calculator.initialize();
        this.ai.initialize();
      }
      
    } catch (error) {
      console.error('❌ Ошибка загрузки контента:', error);
      this.showFallbackContent();
    }
  }
  
  private async renderCalculator(): Promise<string> {
    return `
      <!-- ЭТАП 3: CONSIDERATION - Умный калькулятор -->
      <section id="smart-calculator" class="calculator-section">
        <div class="container">
          <div class="calculator-header">
            <h2 class="section-title">💰 Умный калькулятор стоимости</h2>
            <p class="section-subtitle">
              Рассчитайте стоимость доставки за 30 секунд. Никаких звонков и регистраций.
            </p>
          </div>
          
          <div class="calculator-card glass-morphism">
            <form id="future-calculator" class="calculator-form">
              <!-- Шаг 1: Маршрут -->
              <div class="calc-step" data-step="1">
                <h3 class="step-title">📍 Откуда и куда везем?</h3>
                <div class="input-group">
                  <div class="input-field">
                    <input 
                      type="text" 
                      id="from-city" 
                      name="fromCity"
                      placeholder="Откуда (город)"
                      class="tactile-input"
                      required
                      autocomplete="address-level2"
                    >
                    <div class="input-suggestions" id="from-suggestions"></div>
                  </div>
                  <div class="input-field">
                    <input 
                      type="text" 
                      id="to-city" 
                      name="toCity"
                      placeholder="Куда (город)"
                      class="tactile-input"
                      required
                      autocomplete="address-level2"
                    >
                    <div class="input-suggestions" id="to-suggestions"></div>
                  </div>
                </div>
              </div>
              
              <!-- Шаг 2: Тип груза -->
              <div class="calc-step" data-step="2">
                <h3 class="step-title">📦 Что перевозим?</h3>
                <div class="cargo-options">
                  <label class="cargo-option tactile-card">
                    <input type="radio" name="cargoType" value="general" class="sr-only">
                    <div class="cargo-icon">📦</div>
                    <div class="cargo-label">Обычный груз</div>
                  </label>
                  <label class="cargo-option tactile-card">
                    <input type="radio" name="cargoType" value="furniture" class="sr-only">
                    <div class="cargo-icon">🛋️</div>
                    <div class="cargo-label">Мебель</div>
                  </label>
                  <label class="cargo-option tactile-card">
                    <input type="radio" name="cargoType" value="appliances" class="sr-only">
                    <div class="cargo-icon">🔌</div>
                    <div class="cargo-label">Техника</div>
                  </label>
                  <label class="cargo-option tactile-card">
                    <input type="radio" name="cargoType" value="documents" class="sr-only">
                    <div class="cargo-icon">📄</div>
                    <div class="cargo-label">Документы</div>
                  </label>
                </div>
              </div>
              
              <!-- Шаг 3: Параметры -->
              <div class="calc-step" data-step="3">
                <h3 class="step-title">⚖️ Вес и объем</h3>
                <div class="parameters-grid">
                  <div class="parameter-group">
                    <label class="parameter-label">Вес (кг)</label>
                    <div class="slider-group">
                      <input 
                        type="range" 
                        id="weight-slider" 
                        name="weight"
                        min="1" 
                        max="1000" 
                        value="50"
                        class="tactile-slider"
                      >
                      <input 
                        type="number" 
                        id="weight-input" 
                        name="weightInput"
                        value="50" 
                        min="1" 
                        max="1000"
                        class="tactile-input parameter-input"
                      >
                    </div>
                  </div>
                  <div class="parameter-group">
                    <label class="parameter-label">Объем (м³)</label>
                    <div class="slider-group">
                      <input 
                        type="range" 
                        id="volume-slider" 
                        name="volume"
                        min="0.1" 
                        max="20" 
                        step="0.1" 
                        value="1"
                        class="tactile-slider"
                      >
                      <input 
                        type="number" 
                        id="volume-input" 
                        name="volumeInput"
                        value="1" 
                        min="0.1" 
                        max="20" 
                        step="0.1"
                        class="tactile-input parameter-input"
                      >
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- AI помощник -->
              <div class="ai-assistant-card">
                <div class="ai-icon">🤖</div>
                <div class="ai-content">
                  <div class="ai-title">AI-помощник</div>
                  <div class="ai-description">Опишите груз голосом или текстом</div>
                  <button type="button" id="voice-input" class="tactile-button ai-button">
                    🎤 Голосовой ввод
                  </button>
                </div>
              </div>
              
              <!-- Кнопка расчета -->
              <button 
                type="submit" 
                id="calculate-btn"
                class="tactile-button primary-button calculate-button"
              >
                <span class="button-icon">🚀</span>
                <span class="button-text">Рассчитать стоимость</span>
                <div class="button-ripple"></div>
              </button>
            </form>
            
            <!-- Результат расчета -->
            <div id="calculation-result" class="calculation-result hidden">
              <div class="result-card">
                <div class="result-price">
                  <span id="price-value" class="price-number">25,000</span>
                  <span class="price-currency">₽</span>
                </div>
                <div class="result-description">Примерная стоимость доставки</div>
                
                <!-- ЭТАП 5: ACTION - Форма лида -->
                <div class="lead-form-card">
                  <h4 class="lead-form-title">Получить точный расчет</h4>
                  <form id="lead-form" class="lead-form">
                    <div class="form-fields">
                      <input 
                        type="text" 
                        id="lead-name" 
                        name="name"
                        placeholder="Ваше имя"
                        class="tactile-input"
                        required
                      >
                      <input 
                        type="tel" 
                        id="lead-phone" 
                        name="phone"
                        placeholder="Телефон"
                        class="tactile-input"
                        required
                      >
                    </div>
                    
                    <!-- Согласие на обработку данных (152-ФЗ) -->
                    <label class="consent-label">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        name="consent"
                        checked 
                        required
                        class="consent-checkbox"
                      >
                      <span class="consent-text">
                        Я согласен с 
                        <a href="/privacy-policy.html" target="_blank" class="consent-link">
                          обработкой персональных данных
                        </a>
                        в соответствии с 152-ФЗ РФ
                      </span>
                    </label>
                    
                    <button 
                      type="submit" 
                      id="submit-lead"
                      class="tactile-button success-button lead-submit-button"
                      disabled
                    >
                      <span class="button-icon">📞</span>
                      <span class="button-text">Получить точный расчет</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Дополнительные секции -->
      <section class="value-propositions">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Почему выбирают нас</h2>
            <p class="section-subtitle">Мы решаем главные боли логистики</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card tactile-card">
              <div class="feature-icon">🏢</div>
              <h3 class="feature-title">Удаленный отдел логистики</h3>
              <p class="feature-description">
                Становимся вашим штатным отделом логистики без затрат на зарплаты сотрудников
              </p>
            </div>
            
            <div class="feature-card tactile-card">
              <div class="feature-icon">⚡</div>
              <h3 class="feature-title">Спот-заявки день-в-день</h3>
              <p class="feature-description">
                Экстренная подача транспорта за 2-3 часа в Москве при форс-мажорах
              </p>
            </div>
            
            <div class="feature-card tactile-card">
              <div class="feature-icon">📦</div>
              <h3 class="feature-title">Доставка на маркетплейсы</h3>
              <p class="feature-description">
                Знаем все тонкости работы с Wildberries, Ozon и другими площадками
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  private loadNonCriticalContent(): void {
    // Ленивая загрузка дополнительного контента
    this.loadSocialProofs();
    this.loadTestimonials();
    this.loadFAQ();
  }
  
  private async loadSocialProofs(): Promise<void> {
    // Загрузка отзывов и социальных доказательств
  }
  
  private async loadTestimonials(): Promise<void> {
    // Загрузка отзывов клиентов
  }
  
  private async loadFAQ(): Promise<void> {
    // Загрузка FAQ секции
  }
  
  private detectBrowserCapabilities(): void {
    const capabilities = {
      webp: this.supportsWebP(),
      haptics: 'vibrate' in navigator,
      speech: 'speechSynthesis' in window,
      recognition: 'webkitSpeechRecognition' in window,
      serviceWorker: 'serviceWorker' in navigator,
      intersectionObserver: 'IntersectionObserver' in window
    };
    
    console.log('🔍 Возможности браузера:', capabilities);
    this.analytics.trackEvent('browser_capabilities', capabilities);
  }
  
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  private showFallbackContent(): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <section class="fallback-section">
          <div class="container">
            <div class="fallback-card">
              <h2>📞 Свяжитесь с нами для расчета</h2>
              <p>Временные технические работы. Позвоните нам для точного расчета стоимости:</p>
                             <div class="contact-buttons">
                 <a href="tel:+79162720932" class="tactile-button primary-button">
                   📞 +7 (916) 272-09-32
                 </a>
                 <a href="https://wa.me/79162720932" class="tactile-button success-button">
                   💬 WhatsApp
                 </a>
                 <a href="https://t.me/avtogost77" class="tactile-button info-button">
                   📱 Telegram
                 </a>
                 <a href="mailto:avtogost77@gmail.com" class="tactile-button secondary-button">
                   ✉️ Email
                 </a>
               </div>
            </div>
          </div>
        </section>
      `;
    }
  }
}

// Конфигурация приложения
const appConfig: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  analyticsKey: import.meta.env.VITE_ANALYTICS_KEY,
  version: __APP_VERSION__,
  buildTime: __BUILD_TIME__,
  isDevelopment: import.meta.env.DEV
};

// Инициализация приложения
const app = new AvtoGostApp(appConfig);

// Экспорт для глобального доступа
declare global {
  interface Window {
    AvtoGostApp: AvtoGostApp;
  }
}

window.AvtoGostApp = app;

export default app;