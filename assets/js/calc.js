// ===============================================
// УМНЫЙ КАЛЬКУЛЯТОР ЛОГИСТИКИ v2.0
// Современные алгоритмы ценообразования
// ===============================================

class SmartLogisticsCalculator {
  constructor() {
    this.zones = {
      'moscow-center': { name: 'Центр Москвы', baseRate: 120, coefficient: 1.2 },
      'moscow-region': { name: 'Московская область', baseRate: 95, coefficient: 1.0 },
      'central': { name: 'Центральный ФО', baseRate: 85, coefficient: 0.9 },
      'northwest': { name: 'Северо-Западный ФО', baseRate: 90, coefficient: 0.95 },
      'south': { name: 'Южный ФО', baseRate: 75, coefficient: 0.85 },
      'volga': { name: 'Приволжский ФО', baseRate: 80, coefficient: 0.88 },
      'ural': { name: 'Уральский ФО', baseRate: 100, coefficient: 1.1 },
      'siberia': { name: 'Сибирский ФО', baseRate: 110, coefficient: 1.15 },
      'far-east': { name: 'Дальневосточный ФО', baseRate: 130, coefficient: 1.3 }
    };

    this.cargoTypes = {
      'general': { name: 'Обычный груз', multiplier: 1.0, description: 'Стандартные товары, мебель, оборудование' },
      'fragile': { name: 'Хрупкий груз', multiplier: 1.3, description: 'Стекло, керамика, электроника' },
      'dangerous': { name: 'Опасный груз', multiplier: 1.8, description: 'Химикаты, газы, взрывчатые вещества' },
      'oversized': { name: 'Негабаритный груз', multiplier: 1.5, description: 'Крупногабаритное оборудование' },
      'food': { name: 'Продукты питания', multiplier: 1.2, description: 'Требует соблюдения температурного режима' },
      'medical': { name: 'Медицинские товары', multiplier: 1.4, description: 'Лекарства, медоборудование' }
    };

    this.vehicleTypes = {
      'gazelle': { name: 'Газель (до 1.5т)', capacity: 1.5, basePrice: 2500, kmRate: 35 },
      'small-truck': { name: 'Малый грузовик (до 3т)', capacity: 3, basePrice: 3500, kmRate: 45 },
      'medium-truck': { name: 'Средний грузовик (до 5т)', capacity: 5, basePrice: 4500, kmRate: 55 },
      'large-truck': { name: 'Большой грузовик (до 10т)', capacity: 10, basePrice: 6500, kmRate: 75 },
      'semi-truck': { name: 'Фура (до 20т)', capacity: 20, basePrice: 9500, kmRate: 95 }
    };

    this.init();
  }

  init() {
    this.createCalculatorUI();
    this.bindEvents();
    this.initAnimations();
  }

  createCalculatorUI() {
    const calculatorHTML = `
      <div class="smart-calculator card-neumorphic">
        <div class="calculator-header">
          <h3>🚛 Умный калькулятор логистики</h3>
          <p class="text-muted">Точный расчет стоимости доставки по России</p>
        </div>

        <form id="smart-calc-form" class="calculator-form">
          <!-- Маршрут -->
          <div class="form-section">
            <label class="form-label">📍 Маршрут доставки</label>
            <div class="route-inputs grid-2">
              <div class="input-group">
                <input type="text" id="from-city" placeholder="Откуда" required>
                <div class="input-suggestions" id="from-suggestions"></div>
              </div>
              <div class="input-group">
                <input type="text" id="to-city" placeholder="Куда" required>
                <div class="input-suggestions" id="to-suggestions"></div>
              </div>
            </div>
            <div class="distance-display">
              <span id="route-distance">Введите города для расчета расстояния</span>
            </div>
          </div>

          <!-- Тип груза -->
          <div class="form-section">
            <label class="form-label">📦 Тип груза</label>
            <div class="cargo-types grid-3">
              ${Object.entries(this.cargoTypes).map(([key, type]) => `
                <label class="cargo-type-card">
                  <input type="radio" name="cargo-type" value="${key}" ${key === 'general' ? 'checked' : ''}>
                  <div class="card-content">
                    <div class="type-name">${type.name}</div>
                    <div class="type-description">${type.description}</div>
                    <div class="type-multiplier">×${type.multiplier}</div>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Параметры груза -->
          <div class="form-section">
            <label class="form-label">⚖️ Параметры груза</label>
            <div class="cargo-params grid-2">
              <div class="input-group">
                <label for="weight">Вес (кг)</label>
                <input type="number" id="weight" min="1" max="20000" required>
                <div class="input-slider">
                  <input type="range" id="weight-slider" min="1" max="1000" value="100">
                </div>
              </div>
              <div class="input-group">
                <label for="volume">Объем (м³)</label>
                <input type="number" id="volume" min="0.1" max="100" step="0.1" required>
                <div class="input-slider">
                  <input type="range" id="volume-slider" min="1" max="50" value="5">
                </div>
              </div>
            </div>
          </div>

          <!-- Дополнительные услуги -->
          <div class="form-section">
            <label class="form-label">🛠️ Дополнительные услуги</label>
            <div class="additional-services">
              <label class="service-checkbox">
                <input type="checkbox" name="services" value="loading">
                <span class="checkmark"></span>
                <div class="service-info">
                  <span class="service-name">Погрузка/разгрузка</span>
                  <span class="service-price">+1500₽</span>
                </div>
              </label>
              <label class="service-checkbox">
                <input type="checkbox" name="services" value="packing">
                <span class="checkmark"></span>
                <div class="service-info">
                  <span class="service-name">Упаковка</span>
                  <span class="service-price">+800₽</span>
                </div>
              </label>
              <label class="service-checkbox">
                <input type="checkbox" name="services" value="insurance">
                <span class="checkmark"></span>
                <div class="service-info">
                  <span class="service-name">Страхование</span>
                  <span class="service-price">+3% от стоимости</span>
                </div>
              </label>
              <label class="service-checkbox">
                <input type="checkbox" name="services" value="express">
                <span class="checkmark"></span>
                <div class="service-info">
                  <span class="service-name">Экспресс-доставка</span>
                  <span class="service-price">+50% к тарифу</span>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg calculate-btn">
            <i class="bi bi-calculator"></i>
            Рассчитать стоимость
          </button>
        </form>

        <div id="calculation-result" class="calculation-result"></div>
      </div>
    `;

    // Найдем место для вставки калькулятора
    let calcContainer = document.getElementById('smart-calculator');
    if (!calcContainer) {
      calcContainer = document.createElement('div');
      calcContainer.id = 'smart-calculator';
      calcContainer.className = 'section';
      
      // Вставим после hero секции
      const hero = document.querySelector('.hero');
      if (hero && hero.nextElementSibling) {
        hero.parentNode.insertBefore(calcContainer, hero.nextElementSibling);
      } else {
        document.body.appendChild(calcContainer);
      }
    }

    calcContainer.innerHTML = `
      <div class="container">
        ${calculatorHTML}
      </div>
    `;
  }

  bindEvents() {
    const form = document.getElementById('smart-calc-form');
    if (!form) return;

    // Обработка формы
    form.addEventListener('submit', (e) => this.handleCalculation(e));

    // Синхронизация слайдеров с полями ввода
    this.syncSliderWithInput('weight', 'weight-slider');
    this.syncSliderWithInput('volume', 'volume-slider');

    // Автодополнение городов
    this.initCityAutocomplete();

    // Обновление расчета при изменении параметров
    form.addEventListener('input', () => this.updateCalculationPreview());
  }

  syncSliderWithInput(inputId, sliderId) {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);

    if (!input || !slider) return;

    input.addEventListener('input', () => {
      const value = Math.min(input.value, slider.max);
      slider.value = value;
    });

    slider.addEventListener('input', () => {
      input.value = slider.value;
    });
  }

  initCityAutocomplete() {
    const cities = [
      'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
      'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
      'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград', 'Краснодар',
      'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск',
      'Иркутск', 'Хабаровск', 'Ярославль', 'Владивосток', 'Махачкала',
      'Томск', 'Оренбург', 'Кемерово', 'Новокузнецк', 'Рязань', 'Астрахань'
    ];

    this.setupAutocomplete('from-city', 'from-suggestions', cities);
    this.setupAutocomplete('to-city', 'to-suggestions', cities);
  }

  setupAutocomplete(inputId, suggestionsId, cities) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);

    input.addEventListener('input', () => {
      const value = input.value.toLowerCase();
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(value)
      ).slice(0, 5);

      if (value && filtered.length) {
        suggestions.innerHTML = filtered.map(city => 
          `<div class="suggestion" data-city="${city}">${city}</div>`
        ).join('');
        suggestions.style.display = 'block';
      } else {
        suggestions.style.display = 'none';
      }
    });

    suggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion')) {
        input.value = e.target.dataset.city;
        suggestions.style.display = 'none';
        this.calculateDistance();
      }
    });
  }

  calculateDistance() {
    const fromCity = document.getElementById('from-city').value;
    const toCity = document.getElementById('to-city').value;
    
    if (fromCity && toCity) {
      // Упрощенный расчет расстояния (в реальности используйте API)
      const distance = this.getDistanceBetweenCities(fromCity, toCity);
      document.getElementById('route-distance').innerHTML = 
        `📏 Расстояние: <strong>${distance} км</strong>`;
      return distance;
    }
    return 0;
  }

  getDistanceBetweenCities(from, to) {
    // Упрощенная база расстояний (в реальности - API Яндекс.Карт или Google Maps)
    const distances = {
      'Москва-Санкт-Петербург': 635,
      'Москва-Екатеринбург': 1416,
      'Москва-Новосибирск': 3303,
      'Москва-Краснодар': 1200,
      'Москва-Казань': 815
    };

    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    
    return distances[key1] || distances[key2] || Math.floor(Math.random() * 2000) + 200;
  }

  handleCalculation(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const calculation = this.performCalculation(formData);
    this.displayResult(calculation);
    this.sendLeadToTelegram(calculation);
  }

  performCalculation(formData) {
    const distance = this.calculateDistance();
    const weight = parseFloat(formData.get('weight') || 0);
    const volume = parseFloat(formData.get('volume') || 0);
    const cargoType = formData.get('cargo-type') || 'general';
    const services = formData.getAll('services');

    // Определяем тип транспорта по весу
    const vehicleType = this.selectVehicleType(weight);
    const vehicle = this.vehicleTypes[vehicleType];

    // Базовая стоимость
    let basePrice = vehicle.basePrice + (distance * vehicle.kmRate);

    // Коэффициент типа груза
    const cargoMultiplier = this.cargoTypes[cargoType].multiplier;
    basePrice *= cargoMultiplier;

    // Дополнительные услуги
    let additionalCost = 0;
    services.forEach(service => {
      switch(service) {
        case 'loading': additionalCost += 1500; break;
        case 'packing': additionalCost += 800; break;
        case 'insurance': additionalCost += basePrice * 0.03; break;
        case 'express': basePrice *= 1.5; break;
      }
    });

    const totalPrice = Math.round(basePrice + additionalCost);

    return {
      distance,
      weight,
      volume,
      cargoType: this.cargoTypes[cargoType].name,
      vehicleType: vehicle.name,
      basePrice: Math.round(basePrice),
      additionalCost: Math.round(additionalCost),
      totalPrice,
      services: services.map(s => this.getServiceName(s)),
      breakdown: this.getPriceBreakdown(basePrice, additionalCost, services)
    };
  }

  selectVehicleType(weight) {
    if (weight <= 1.5) return 'gazelle';
    if (weight <= 3) return 'small-truck';
    if (weight <= 5) return 'medium-truck';
    if (weight <= 10) return 'large-truck';
    return 'semi-truck';
  }

  getServiceName(service) {
    const names = {
      'loading': 'Погрузка/разгрузка',
      'packing': 'Упаковка',
      'insurance': 'Страхование',
      'express': 'Экспресс-доставка'
    };
    return names[service] || service;
  }

  getPriceBreakdown(basePrice, additionalCost, services) {
    return {
      transport: Math.round(basePrice),
      services: Math.round(additionalCost),
      total: Math.round(basePrice + additionalCost)
    };
  }

  displayResult(calculation) {
    const resultContainer = document.getElementById('calculation-result');
    
    const resultHTML = `
      <div class="result-card card animate-fade-in-up">
        <div class="result-header">
          <h4>💰 Результат расчета</h4>
          <div class="total-price">${calculation.totalPrice.toLocaleString('ru-RU')} ₽</div>
        </div>
        
        <div class="result-details">
          <div class="detail-row">
            <span>Маршрут:</span>
            <span>${calculation.distance} км</span>
          </div>
          <div class="detail-row">
            <span>Груз:</span>
            <span>${calculation.weight} кг, ${calculation.cargoType}</span>
          </div>
          <div class="detail-row">
            <span>Транспорт:</span>
            <span>${calculation.vehicleType}</span>
          </div>
          ${calculation.services.length ? `
            <div class="detail-row">
              <span>Услуги:</span>
              <span>${calculation.services.join(', ')}</span>
            </div>
          ` : ''}
        </div>

        <div class="price-breakdown">
          <div class="breakdown-row">
            <span>Транспортировка:</span>
            <span>${calculation.breakdown.transport.toLocaleString('ru-RU')} ₽</span>
          </div>
          ${calculation.breakdown.services ? `
            <div class="breakdown-row">
              <span>Доп. услуги:</span>
              <span>${calculation.breakdown.services.toLocaleString('ru-RU')} ₽</span>
            </div>
          ` : ''}
          <div class="breakdown-total">
            <span>Итого:</span>
            <span>${calculation.totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" onclick="this.openLeadModal()">
            📞 Заказать доставку
          </button>
          <button class="btn btn-secondary" onclick="this.saveCalculation()">
            💾 Сохранить расчет
          </button>
        </div>

        <div class="result-note">
          <small>* Расчет носит ориентировочный характер. Точная стоимость определяется после осмотра груза.</small>
        </div>
      </div>
    `;

    resultContainer.innerHTML = resultHTML;
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  sendLeadToTelegram(calculation) {
    const message = `
🚛 НОВЫЙ РАСЧЕТ ЛОГИСТИКИ

📍 Маршрут: ${calculation.distance} км
⚖️ Груз: ${calculation.weight} кг (${calculation.cargoType})
🚚 Транспорт: ${calculation.vehicleType}
💰 Стоимость: ${calculation.totalPrice.toLocaleString('ru-RU')} ₽

${calculation.services.length ? `🛠️ Услуги: ${calculation.services.join(', ')}` : ''}

Детализация:
• Транспорт: ${calculation.breakdown.transport.toLocaleString('ru-RU')} ₽
${calculation.breakdown.services ? `• Услуги: ${calculation.breakdown.services.toLocaleString('ru-RU')} ₽` : ''}
`;

    fetch('https://api.telegram.org/bot7999458907:AAHAnyTyvfteW1WNKpns8w35jl14f0wn5es/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: 399711406,
        text: message
      })
    }).catch(() => {
      console.log('Ошибка отправки в Telegram');
    });
  }

  initAnimations() {
    // Intersection Observer для анимаций
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    });

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  updateCalculationPreview() {
    // Обновление превью расчета в реальном времени
    const distance = this.calculateDistance();
    if (distance > 0) {
      // Можно добавить превью стоимости
    }
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.smartCalculator = new SmartLogisticsCalculator();
});

// Дополнительные функции для интерактивности
function openLeadModal() {
  // Открытие модального окна для заявки
  const modal = document.getElementById('lead-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function saveCalculation() {
  // Сохранение расчета в localStorage
  const calculation = window.smartCalculator.lastCalculation;
  if (calculation) {
    localStorage.setItem('lastCalculation', JSON.stringify(calculation));
    alert('Расчет сохранен!');
  }
}