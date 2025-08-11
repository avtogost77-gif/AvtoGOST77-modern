// ========================================================
// 🚛 КАЛЬКУЛЯТОР АВТОГОСТ V2.0 ENHANCED - UX ОПТИМИЗАЦИЯ
// Основано на SmartCalculatorV2 + улучшения по плану GPT-5
// ========================================================

class CalculatorV2Enhanced {
  constructor() {
    // Состояние формы
    this.currentStep = 1;
    this.formData = {};
    
    // Элементы UI
    this.elements = {
      form: null,
      step1: null,
      step2: null,
      result: null,
      progress: null,
      backBtn: null,
      nextBtn: null,
      submitBtn: null
    };
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.showStep(1);
    this.setupWhatsAppIntegration();
  }

  setupElements() {
    // Находим элементы формы
    this.elements.form = document.getElementById('calculatorForm');
    if (!this.elements.form) return;

    // Создаем 2-шаговую структуру
    this.createTwoStepStructure();
    
    // Находим элементы
    this.elements.step1 = document.getElementById('calc-step-1');
    this.elements.step2 = document.getElementById('calc-step-2');
    this.elements.result = document.getElementById('calculatorResult');
    this.elements.progress = document.getElementById('calc-progress');
    this.elements.backBtn = document.getElementById('calc-back-btn');
    this.elements.nextBtn = document.getElementById('calc-next-btn');
    this.elements.submitBtn = document.getElementById('calc-submit-btn');
  }

  createTwoStepStructure() {
    const form = this.elements.form;
    
    // Создаем прогресс-бар
    const progress = document.createElement('div');
    progress.id = 'calc-progress';
    progress.className = 'calc-progress';
    progress.innerHTML = `
      <div class="progress-step active" data-step="1">
        <span class="step-number">1</span>
        <span class="step-label">Маршрут</span>
      </div>
      <div class="progress-step" data-step="2">
        <span class="step-number">2</span>
        <span class="step-label">Груз</span>
      </div>
    `;
    form.insertBefore(progress, form.firstChild);

    // Группируем поля по шагам
    const fields = form.querySelectorAll('.form-group');
    const step1Fields = [];
    const step2Fields = [];

    fields.forEach(field => {
      const input = field.querySelector('input, textarea');
      if (input) {
        const name = input.name || input.id;
        if (['from', 'to'].includes(name)) {
          step1Fields.push(field);
        } else {
          step2Fields.push(field);
        }
      }
    });

    // Создаем контейнеры для шагов
    const step1Container = document.createElement('div');
    step1Container.id = 'calc-step-1';
    step1Container.className = 'calc-step active';

    const step2Container = document.createElement('div');
    step2Container.id = 'calc-step-2';
    step2Container.className = 'calc-step';

    // Перемещаем поля в соответствующие шаги
    step1Fields.forEach(field => step1Container.appendChild(field));
    step2Fields.forEach(field => step2Container.appendChild(field));

    // Добавляем кнопки навигации
    const navigation = document.createElement('div');
    navigation.className = 'calc-navigation';
    navigation.innerHTML = `
      <button type="button" id="calc-back-btn" class="btn btn-secondary" style="display: none;">
        ← Назад
      </button>
      <button type="button" id="calc-next-btn" class="btn btn-primary">
        Далее →
      </button>
      <button type="submit" id="calc-submit-btn" class="btn btn-primary" style="display: none;">
        Рассчитать стоимость
      </button>
    `;

    // Вставляем в форму
    form.appendChild(step1Container);
    form.appendChild(step2Container);
    form.appendChild(navigation);

    // Скрываем оригинальную кнопку
    const originalBtn = form.querySelector('#calculateButton');
    if (originalBtn) originalBtn.style.display = 'none';
  }

  setupEventListeners() {
    // Кнопки навигации
    if (this.elements.backBtn) {
      this.elements.backBtn.addEventListener('click', () => this.previousStep());
    }
    
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', () => this.nextStep());
    }

    // Кнопка расчета
    if (this.elements.submitBtn) {
      this.elements.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCalculation();
      });
    }

    // Валидация в реальном времени
    this.setupRealTimeValidation();
    
    // Автодополнение (используем существующее)
    this.setupAutocomplete();
  }

  setupRealTimeValidation() {
    const inputs = this.elements.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const name = field.name || field.id;
    
    // Очищаем предыдущие ошибки
    this.clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';

    // Правила валидации
    switch (name) {
      case 'from':
      case 'to':
        if (!value) {
          isValid = false;
          errorMessage = 'Пожалуйста, укажите город';
        }
        break;
        
      case 'weight':
        const weight = parseFloat(value);
        if (!weight || weight <= 0) {
          isValid = false;
          errorMessage = 'Вес должен быть больше 0';
        } else if (weight > 20000) {
          isValid = false;
          errorMessage = 'Максимальный вес 20 тонн';
        }
        break;
        
      case 'volume':
        if (value) {
          const volume = parseFloat(value);
          if (volume < 0) {
            isValid = false;
            errorMessage = 'Объем не может быть отрицательным';
          }
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
  }

  clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    field.style.borderColor = '';
  }

  setupAutocomplete() {
    // Используем существующую систему автодополнения
    if (typeof setupAutocomplete === 'function') {
      setupAutocomplete();
    }
  }

  showStep(step) {
    this.currentStep = step;
    
    // Обновляем прогресс-бар
    const progressSteps = this.elements.progress.querySelectorAll('.progress-step');
    progressSteps.forEach((stepEl, index) => {
      if (index + 1 <= step) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
    });

    // Показываем/скрываем шаги
    if (this.elements.step1) {
      this.elements.step1.classList.toggle('active', step === 1);
    }
    if (this.elements.step2) {
      this.elements.step2.classList.toggle('active', step === 2);
    }

    // Обновляем кнопки
    if (this.elements.backBtn) {
      this.elements.backBtn.style.display = step > 1 ? 'inline-block' : 'none';
    }
    if (this.elements.nextBtn) {
      this.elements.nextBtn.style.display = step < 2 ? 'inline-block' : 'none';
    }
    if (this.elements.submitBtn) {
      this.elements.submitBtn.style.display = step === 2 ? 'inline-block' : 'none';
    }
  }

  nextStep() {
    // Валидируем текущий шаг
    const currentStepEl = this.currentStep === 1 ? this.elements.step1 : this.elements.step2;
    const fields = currentStepEl.querySelectorAll('input, textarea');
    
    let isValid = true;
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showStepError('Пожалуйста, исправьте ошибки перед продолжением');
      return;
    }

    // Сохраняем данные
    this.saveStepData();

    if (this.currentStep < 2) {
      this.showStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  saveStepData() {
    const formData = new FormData(this.elements.form);
    for (let [key, value] of formData.entries()) {
      this.formData[key] = value;
    }
  }

  showStepError(message) {
    // Показываем ошибку шага
    const errorDiv = document.createElement('div');
    errorDiv.className = 'step-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.marginTop = '1rem';
    errorDiv.style.padding = '0.5rem';
    errorDiv.style.backgroundColor = '#f8d7da';
    errorDiv.style.borderRadius = '4px';

    // Удаляем предыдущие ошибки
    const existingError = this.elements.form.querySelector('.step-error');
    if (existingError) {
      existingError.remove();
    }

    this.elements.form.appendChild(errorDiv);

    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 3000);
  }

  setupWhatsAppIntegration() {
    // Добавляем WhatsApp кнопку в результат
    this.createWhatsAppButton();
  }

  createWhatsAppButton() {
    // Создаем кнопку WhatsApp
    const whatsappBtn = document.createElement('a');
    whatsappBtn.id = 'whatsapp-calc-btn';
    whatsappBtn.className = 'btn btn-success whatsapp-btn';
    whatsappBtn.innerHTML = `
      <span class="whatsapp-icon">📱</span>
      Получить расчет в WhatsApp
    `;
    whatsappBtn.style.display = 'none';
    whatsappBtn.style.marginTop = '1rem';
    whatsappBtn.style.backgroundColor = '#25D366';
    whatsappBtn.style.borderColor = '#25D366';
    whatsappBtn.style.color = 'white';

    // Добавляем в результат
    if (this.elements.result) {
      this.elements.result.appendChild(whatsappBtn);
    }
  }

  updateWhatsAppButton(result) {
    const whatsappBtn = document.getElementById('whatsapp-calc-btn');
    if (!whatsappBtn) return;

    // Формируем сообщение для WhatsApp
    const message = this.formatWhatsAppMessage(result);
    const encodedMessage = encodeURIComponent(message);
    
    whatsappBtn.href = `https://wa.me/7999458907?text=${encodedMessage}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.style.display = 'inline-block';

    // Отслеживаем клик
    whatsappBtn.addEventListener('click', () => {
      if (typeof ym !== 'undefined') {
        ym(103413788, 'reachGoal', 'whatsapp_calc_click', {
          from: 'calculator_result',
          price: result.price
        });
      }
    });
  }

  formatWhatsAppMessage(result) {
    return `🚛 Здравствуйте! 

Хочу получить расчет стоимости доставки:

📍 Откуда: ${result.from}
📍 Куда: ${result.to}
📦 Вес: ${result.weight} кг
📏 Объем: ${result.volume || 'не указан'} м³
💰 Ориентировочная стоимость: ${result.price}

Пожалуйста, свяжитесь со мной для уточнения деталей.`;
  }

  // Переопределяем метод показа результата
  showEnhancedResult(result) {
    if (!this.elements.result) return;

    // Сохраняем результат для PDF
    this.lastResult = result;

    // Создаем улучшенный результат
    const resultHTML = `
      <div class="calc-result-enhanced">
        <div class="result-header">
          <h3>🎯 Результат расчета</h3>
          <div class="result-price">
            <span class="price-label">Стоимость доставки:</span>
            <span class="price-value">${result.price}</span>
          </div>
        </div>
        
        <div class="result-details">
          <div class="detail-row">
            <span class="detail-label">Маршрут:</span>
            <span class="detail-value">${result.from} → ${result.to}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Расстояние:</span>
            <span class="detail-value">${result.distance} км</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Транспорт:</span>
            <span class="detail-value">${result.transport}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Срок доставки:</span>
            <span class="detail-value">${result.deliveryTime}</span>
          </div>
        </div>

        ${this.createLoadFactorBlock(result)}
        
        <div class="result-actions">
          <button type="button" class="btn btn-primary" onclick="calculatorV2.orderNow()">
            🚀 Заказать доставку
          </button>
          <button type="button" class="btn btn-outline" onclick="calculatorV2.callManager()">
            📞 Позвонить менеджеру
          </button>
          <button type="button" class="btn btn-info" onclick="calculatorV2.downloadPDF()">
            📄 Скачать PDF расчет
          </button>
        </div>
        
        <div class="result-disclaimer">
          <small>* Цена является ориентировочной и может измениться после уточнения деталей</small>
        </div>
      </div>
    `;

    this.elements.result.innerHTML = resultHTML;
    this.elements.result.style.display = 'block';

    // Обновляем WhatsApp кнопку
    this.updateWhatsAppButton(result);

    // Прокручиваем к результату
    this.elements.result.scrollIntoView({ behavior: 'smooth' });
  }

  createLoadFactorBlock(result) {
    if (!result.loadFactor) return '';

    const loadPercentage = Math.round(result.loadFactor * 100);
    const loadClass = loadPercentage > 80 ? 'high' : loadPercentage > 50 ? 'medium' : 'low';
    
    return `
      <div class="load-factor-block">
        <div class="load-factor-header">
          <span class="load-icon">📦</span>
          <span class="load-label">Загрузка транспорта</span>
        </div>
        <div class="load-factor-bar">
          <div class="load-factor-fill ${loadClass}" style="width: ${loadPercentage}%"></div>
        </div>
        <div class="load-factor-text">
          Ваш груз занимает <strong>${loadPercentage}%</strong> объема ${result.transport}
        </div>
      </div>
    `;
  }

  // Методы для совместимости с существующим кодом
  orderNow() {
    // Показываем форму лида
    this.showLeadForm();
  }

  callManager() {
    // Звоним менеджеру
    window.location.href = 'tel:+7999458907';
  }

  showLeadForm() {
    // Используем существующую логику показа формы лида
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
      leadForm.style.display = 'block';
      leadForm.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Интеграция с существующим калькулятором
  async handleCalculation() {
    // Проверяем, что все поля заполнены
    const formData = new FormData(this.elements.form);
    const from = formData.get('from');
    const to = formData.get('to');
    const weight = parseFloat(formData.get('weight')) || 0;
    const volume = parseFloat(formData.get('volume')) || 0;
    const isConsolidated = formData.get('isConsolidated') === 'on';

    if (!from || !to || weight <= 0) {
      this.showStepError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Показываем индикатор загрузки
    const submitBtn = this.elements.submitBtn;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-loading">Рассчитываем...</span>';
    submitBtn.disabled = true;

    try {
      // Используем существующую логику расчета
      if (window.smartCalculator) {
        const result = await window.smartCalculator.calculate(from, to, weight, volume, isConsolidated);
        this.showEnhancedResult(result);
      } else {
        // Fallback - простой расчет
        const result = await this.simpleCalculation(from, to, weight, volume, isConsolidated);
        this.showEnhancedResult(result);
      }
    } catch (error) {
      console.error('Ошибка расчета:', error);
      this.showStepError('Произошла ошибка при расчете. Попробуйте еще раз.');
    } finally {
      // Восстанавливаем кнопку
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  // Простой расчет как fallback
  async simpleCalculation(from, to, weight, volume, isConsolidated) {
    // Получаем расстояние
    let distance = 0;
    if (window.distanceAPI) {
      distance = await window.distanceAPI.getDistance(from, to);
    } else {
      // Примерное расстояние
      distance = this.estimateDistance(from, to);
    }

    // Простой расчет цены
    let price = 0;
    if (isConsolidated) {
      // Сборный груз
      price = distance * weight * 6.5; // 6.5₽ за кг*км
    } else {
      // Полная загрузка
      const baseRate = weight <= 1500 ? 30 : weight <= 3000 ? 40 : weight <= 5000 ? 50 : 62;
      price = distance * baseRate;
    }

    // Минимальная цена
    price = Math.max(price, 10000);

    return {
      from,
      to,
      weight,
      volume,
      distance: Math.round(distance),
      price: price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }),
      transport: this.getTransportType(weight),
      deliveryTime: this.getDeliveryTime(distance, isConsolidated),
      loadFactor: this.calculateLoadFactor(weight, volume)
    };
  }

  estimateDistance(from, to) {
    // Простая оценка расстояния по городам
    const cityDistances = {
      'Москва-Санкт-Петербург': 700,
      'Москва-Казань': 800,
      'Москва-Воронеж': 500,
      'Москва-Самара': 1000,
      'Москва-Нижний Новгород': 400
    };

    const route = `${from}-${to}`;
    return cityDistances[route] || 300; // По умолчанию 300км
  }

  getTransportType(weight) {
    if (weight <= 1500) return 'Газель';
    if (weight <= 3000) return '3-тонник';
    if (weight <= 5000) return '5-тонник';
    if (weight <= 10000) return '10-тонник';
    return 'Фура 20т';
  }

  getDeliveryTime(distance, isConsolidated) {
    if (distance <= 100) return '1-2 дня';
    if (distance <= 500) return '2-3 дня';
    if (distance <= 1000) return '3-5 дней';
    return '5-7 дней';
  }

  calculateLoadFactor(weight, volume) {
    // Простой расчет загрузки
    const maxVolume = weight <= 1500 ? 16 : weight <= 3000 ? 18 : weight <= 5000 ? 36 : 50;
    return volume ? Math.min(volume / maxVolume, 1) : 0.5;
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Создаем экземпляр улучшенного калькулятора
  window.calculatorV2 = new CalculatorV2Enhanced();
});

// Добавляем CSS стили
const enhancedStyles = `
<style>
.calc-progress {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.progress-step.active {
  opacity: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.progress-step.active .step-number {
  background: #28a745;
}

.step-label {
  font-size: 0.875rem;
  color: #6c757d;
}

.progress-step.active .step-label {
  color: #28a745;
  font-weight: 500;
}

.calc-step {
  display: none;
}

.calc-step.active {
  display: block;
}

.calc-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
}

.calc-result-enhanced {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #dee2e6;
}

.result-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.price-value {
  font-size: 2rem;
  font-weight: bold;
  color: #28a745;
}

.result-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-label {
  font-weight: 500;
  color: #6c757d;
}

.load-factor-block {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #dee2e6;
}

.load-factor-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.load-factor-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.load-factor-fill {
  height: 100%;
  transition: width 0.3s;
}

.load-factor-fill.low {
  background: #28a745;
}

.load-factor-fill.medium {
  background: #ffc107;
}

.load-factor-fill.high {
  background: #dc3545;
}

.result-actions {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.result-disclaimer {
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;
}

.whatsapp-btn {
  transition: all 0.3s;
}

.whatsapp-btn:hover {
  background: #128C7E !important;
  border-color: #128C7E !important;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .calc-progress {
    gap: 1rem;
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
  
  .step-label {
    font-size: 0.75rem;
  }
  
  .calc-navigation {
    flex-direction: column;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
`;

// Добавляем стили в head
document.head.insertAdjacentHTML('beforeend', enhancedStyles);
