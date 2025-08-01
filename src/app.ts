// 🚀 NextGen Logistics - Main Application Entry Point
// Основано на реальной логике АвтоГОСТ с современными улучшениями

import { SmartLogisticsCalculator } from './services/calculator.js';
import type { CalculatorFormData, CalculationResponse, CalculationError, LeadData } from './types/logistics.js';

// 🎯 Main Application Class
class NextGenLogisticsApp {
  private calculator: SmartLogisticsCalculator;
  private isCalculating = false;

  constructor() {
    this.calculator = new SmartLogisticsCalculator();
    this.init();
  }

  /**
   * Initialize the application
   */
  private init(): void {
    console.log('🚀 NextGen Logistics App started');
    
    // Initialize components
    this.initCalculator();
    this.initCityAutocomplete();
    this.initSmoothScrolling();
    this.initExitIntent();
    this.initAnalytics();
    
    console.log('✅ All components initialized');
  }

  /**
   * Initialize the smart calculator
   */
  private initCalculator(): void {
    const form = document.getElementById('calculatorForm') as HTMLFormElement;
    const resultContainer = document.getElementById('calculatorResult') as HTMLElement;
    
    if (!form) {
      console.warn('Calculator form not found');
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleCalculation(form, resultContainer);
    });

    console.log('✅ Calculator initialized');
  }

  /**
   * Handle calculation request
   */
  private async handleCalculation(form: HTMLFormElement, resultContainer: HTMLElement): Promise<void> {
    if (this.isCalculating) return;

    try {
      this.isCalculating = true;
      this.showLoadingState(true);

      // Collect form data
      const formData = this.collectFormData(form);
      
      // Track analytics
      this.trackEvent('calculator_submit', {
        from_city: formData.fromCity,
        to_city: formData.toCity,
        weight: formData.weight,
        cargo_type: formData.cargoType,
        urgency: formData.urgency
      });

      // Calculate price
      const result = this.calculator.calculatePrice(formData);
      
      // Show result
      this.displayResult(result, resultContainer);

      // Track successful calculation
      if (result.success) {
        this.trackEvent('calculation_success', {
          price: result.price,
          transport: result.transport.name,
          distance: result.route.distance
        });
             } else {
         const errorResult = result as CalculationError;
         this.trackEvent('calculation_error', {
           error_code: errorResult.code,
           error_message: errorResult.error
         });
       }

    } catch (error) {
      console.error('Calculation error:', error);
      this.displayError(resultContainer, 'Произошла ошибка при расчете. Попробуйте еще раз.');
    } finally {
      this.isCalculating = false;
      this.showLoadingState(false);
    }
  }

  /**
   * Collect form data with validation
   */
  private collectFormData(form: HTMLFormElement): CalculatorFormData {
    const formData = new FormData(form);
    
    const volumeValue = formData.get('volume');
    const data: CalculatorFormData = {
      fromCity: (formData.get('fromCity') as string)?.trim() || '',
      toCity: (formData.get('toCity') as string)?.trim() || '',
      weight: Number(formData.get('weight')) || 0,
      volume: volumeValue ? Number(volumeValue) : undefined,
      cargoType: (formData.get('cargoType') as any) || 'general',
      urgency: (formData.get('urgency') as any) || 'standard'
    };

    return data;
  }

  /**
   * Display calculation result
   */
  private displayResult(result: CalculationResponse, container: HTMLElement): void {
    container.classList.remove('hidden');
    
    if (result.success) {
      container.innerHTML = this.renderSuccessResult(result);
    } else {
      container.innerHTML = this.renderErrorResult(result);
    }

    // Smooth scroll to result
    container.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }

  /**
   * Render successful calculation result
   */
  private renderSuccessResult(result: CalculationResponse): string {
    if (!result.success) return '';

    const restrictionsHtml = result.restrictions?.length ? 
      `<div class="alert alert-warning">
        <h4>⚠️ Ограничения:</h4>
        <ul>${result.restrictions.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>` : '';

    const recommendationsHtml = result.recommendations?.length ?
      `<div class="alert alert-success">
        <h4>💡 Рекомендации:</h4>
        <ul>${result.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>` : '';

    return `
      <div class="calculator-result">
        <div class="space-y-6">
          <!-- Main Result -->
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              ${result.transport.icon} Расчет готов!
            </h3>
            <div class="text-4xl font-bold text-primary-600 mb-2">
              ${result.price.toLocaleString()} ₽
            </div>
            <div class="text-gray-600">
              ${result.pricePerKm} ₽/км • ${result.deliveryTime}
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Route Info -->
            <div class="card">
              <div class="card-body">
                <h4 class="font-semibold mb-3">📍 Маршрут</h4>
                <div class="space-y-2 text-sm">
                  <div>Откуда: <strong>${result.route.from.name}</strong></div>
                  <div>Куда: <strong>${result.route.to.name}</strong></div>
                  <div>Расстояние: <strong>${result.route.distance} км</strong></div>
                  <div>Время в пути: <strong>${Math.round(result.route.estimatedTime)}ч</strong></div>
                </div>
              </div>
            </div>

            <!-- Transport Info -->
            <div class="card">
              <div class="card-body">
                <h4 class="font-semibold mb-3">🚛 Транспорт</h4>
                <div class="space-y-2 text-sm">
                  <div>Тип: <strong>${result.transport.name}</strong></div>
                  <div>Загрузка: <strong>${result.details.loadPercent}%</strong> по весу</div>
                  ${result.details.volumePercent ? 
                    `<div>Объем: <strong>${result.details.volumePercent}%</strong></div>` : ''
                  }
                  ${result.details.density ? 
                    `<div>Плотность: <strong>${result.details.density} кг/м³</strong></div>` : ''
                  }
                </div>
              </div>
            </div>
          </div>

          ${restrictionsHtml}
          ${recommendationsHtml}

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              class="btn btn-lg btn-primary flex-1" 
              onclick="app.showLeadForm(${JSON.stringify(result).replace(/"/g, '&quot;')})"
            >
              📝 Оформить заказ
            </button>
            <a 
              href="tel:+79162720932" 
              class="btn btn-lg btn-outline flex-1"
            >
              📞 Позвонить менеджеру
            </a>
            <a 
              href="https://wa.me/79162720932?text=${encodeURIComponent(`Здравствуйте! Рассчитал стоимость доставки: ${result.price.toLocaleString()} ₽ (${result.route.from.name} → ${result.route.to.name}, ${result.details.weight}кг). Хочу оформить заказ.`)}" 
              class="btn btn-lg btn-success flex-1"
              target="_blank"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }

     /**
    * Render error result
    */
   private renderErrorResult(result: CalculationResponse): string {
     if (result.success) return '';

     // Type guard to ensure we're working with CalculationError
     const errorResult = result as CalculationError;

     const suggestionsHtml = errorResult.suggestions?.length ?
       `<div class="mt-4">
         <h4 class="font-semibold mb-2">💡 Варианты решения:</h4>
         <ul class="list-disc list-inside space-y-1 text-sm">
           ${errorResult.suggestions.map((s: string) => `<li>${s}</li>`).join('')}
         </ul>
       </div>` : '';

     const alternativePriceHtml = errorResult.alternativePrice ?
       `<div class="mt-4 p-4 bg-blue-50 rounded-lg">
         <h4 class="font-semibold text-blue-800 mb-2">💰 Альтернативный вариант:</h4>
         <div class="text-2xl font-bold text-blue-600">
           ${errorResult.alternativePrice.toLocaleString()} ₽
         </div>
         <div class="text-sm text-blue-700">Стоимость отдельной машины</div>
       </div>` : '';

     return `
       <div class="calculator-result">
         <div class="alert alert-error">
           <h3 class="text-xl font-semibold mb-2">❌ ${errorResult.error}</h3>
           ${suggestionsHtml}
           ${alternativePriceHtml}
           
           <div class="mt-6 flex flex-col sm:flex-row gap-4">
             <a 
               href="tel:+79162720932" 
               class="btn btn-primary"
             >
               📞 Обсудить с менеджером
             </a>
             <button 
               class="btn btn-outline" 
               onclick="document.getElementById('calculatorForm').reset(); document.getElementById('calculatorResult').classList.add('hidden');"
             >
               🔄 Рассчитать заново
             </button>
           </div>
         </div>
       </div>
     `;
   }

  /**
   * Display error message
   */
  private displayError(container: HTMLElement, message: string): void {
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="alert alert-error">
        <h3 class="text-xl font-semibold mb-2">❌ Ошибка</h3>
        <p>${message}</p>
        <div class="mt-4">
          <a href="tel:+79162720932" class="btn btn-primary">
            📞 Связаться с поддержкой
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Show/hide loading state
   */
  private showLoadingState(loading: boolean): void {
    const btn = document.getElementById('calculateBtn');
    const btnText = btn?.querySelector('.btn-text');
    const btnLoading = btn?.querySelector('.btn-loading');

    if (btn && btnText && btnLoading) {
      btn.setAttribute('disabled', loading.toString());
      btnText.classList.toggle('hidden', loading);
      btnLoading.classList.toggle('hidden', !loading);
    }
  }

  /**
   * Initialize city autocomplete
   */
  private initCityAutocomplete(): void {
    // Popular cities from analysis
    const cities = [
      'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
      'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
      'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград', 'Краснодар',
      'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Коледино', 'Тверь'
    ];

    this.setupAutocomplete('fromCity', cities);
    this.setupAutocomplete('toCity', cities);
  }

  /**
   * Setup autocomplete for input field
   */
  private setupAutocomplete(inputId: string, cities: string[]): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;

    const suggestionsContainer = document.getElementById(`${inputId}Suggestions`);
    if (!suggestionsContainer) return;

    input.addEventListener('input', () => {
      const value = input.value.toLowerCase().trim();
      
      if (value.length < 2) {
        suggestionsContainer.classList.add('hidden');
        return;
      }

      const matches = cities
        .filter(city => city.toLowerCase().includes(value))
        .slice(0, 5);

      if (matches.length > 0) {
        suggestionsContainer.innerHTML = matches
          .map(city => `
            <div class="p-3 hover:bg-gray-100 cursor-pointer suggestion-item" data-city="${city}">
              ${city}
            </div>
          `).join('');
        
        suggestionsContainer.classList.remove('hidden');

        // Add click handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            input.value = item.getAttribute('data-city') || '';
            suggestionsContainer.classList.add('hidden');
          });
        });
      } else {
        suggestionsContainer.classList.add('hidden');
      }
    });

    // Hide suggestions on blur
    input.addEventListener('blur', () => {
      setTimeout(() => suggestionsContainer.classList.add('hidden'), 200);
    });
  }

  /**
   * Initialize smooth scrolling
   */
  private initSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  /**
   * Initialize exit intent popup
   */
  private initExitIntent(): void {
    let hasShownExitIntent = false;

    if (sessionStorage.getItem('exitIntentShown')) {
      return;
    }

    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !hasShownExitIntent) {
        hasShownExitIntent = true;
        this.showExitIntentPopup();
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    });
  }

  /**
   * Show exit intent popup
   */
  private showExitIntentPopup(): void {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 relative">
        <button 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onclick="this.closest('.fixed').remove()"
        >
          ✕
        </button>
        
        <div class="text-center">
          <div class="text-4xl mb-4">🎁</div>
          <h3 class="text-2xl font-bold mb-4">Подождите!</h3>
          <p class="text-gray-600 mb-6">
            Получите <strong>скидку 10%</strong> на первую перевозку!
          </p>
          
          <div class="space-y-4">
            <input 
              type="tel" 
              placeholder="Ваш телефон"
              class="form-input"
              id="exitIntentPhone"
            >
            <button 
              class="btn btn-primary w-full"
              onclick="app.handleExitIntentSubmit()"
            >
              Получить скидку
            </button>
          </div>
          
          <div class="text-xs text-gray-500 mt-4">
            Промокод: <strong>WELCOME10</strong>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Track event
    this.trackEvent('exit_intent_shown');
  }

  /**
   * Handle exit intent form submission
   */
  public handleExitIntentSubmit(): void {
    const phone = (document.getElementById('exitIntentPhone') as HTMLInputElement)?.value;
    
    if (!phone || phone.length < 10) {
      alert('Введите корректный номер телефона');
      return;
    }

    // Send to Telegram (simplified)
    const message = `🎁 Exit-intent лид:\n📞 ${phone}\n🎫 Промокод: WELCOME10`;
    
    // Track conversion
    this.trackEvent('exit_intent_conversion', { phone });

    // Show success
    const popup = document.querySelector('.fixed');
    if (popup) {
      popup.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
          <div class="text-4xl mb-4">✅</div>
          <h3 class="text-2xl font-bold mb-4">Спасибо!</h3>
          <p class="text-gray-600 mb-6">
            Менеджер свяжется с вами в течение 15 минут
          </p>
          <button 
            class="btn btn-primary"
            onclick="this.closest('.fixed').remove()"
          >
            Закрыть
          </button>
        </div>
      `;
    }
  }

  /**
   * Show lead form (called from calculator result)
   */
  public showLeadForm(calculationResult?: any): void {
    // Implementation for lead form
    console.log('Show lead form', calculationResult);
    // This would open a modal with lead capture form
  }

  /**
   * Initialize analytics
   */
  private initAnalytics(): void {
    // Track page view
    this.trackEvent('page_view', {
      page: window.location.pathname,
      title: document.title
    });
  }

     /**
    * Track analytics event
    */
   private trackEvent(event: string, parameters: Record<string, any> = {}): void {
     // Google Analytics 4
     if (typeof (window as any).gtag !== 'undefined') {
       (window as any).gtag('event', event, parameters);
     }

     // Console log for development
     console.log('📊 Event:', event, parameters);
   }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  (window as any).app = new NextGenLogisticsApp();
});

// Export for global access
export { NextGenLogisticsApp };