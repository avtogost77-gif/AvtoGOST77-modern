// ===============================================
// АВТО ГОСТ - УМНЫЙ КАЛЬКУЛЯТОР ЛОГИСТИКИ v3.0
// Модульная архитектура с отключаемыми картами
// ===============================================

// 🔧 КОНФИГУРАЦИЯ API КАРТ
const MAP_CONFIG = {
  enabled: false, // Карты отключены - все API платные и дорогие
  provider: 'none', // Не используем внешние API
  fallbackMode: 'database' // Только база расстояний
};

// 🗺️ БАЗА РАССТОЯНИЙ МЕЖДУ ГОРОДАМИ РОССИИ
const DISTANCE_DATABASE = {
  // Москва как центральный узел
  'Москва': {
    'Санкт-Петербург': 635,
    'Нижний Новгород': 411,
    'Екатеринбург': 1416,
    'Новосибирск': 3303,
    'Казань': 815,
    'Челябинск': 1777,
    'Самара': 1049,
    'Омск': 2555,
    'Ростов-на-Дону': 1076,
    'Уфа': 1357,
    'Красноярск': 3353,
    'Воронеж': 515,
    'Пермь': 1396,
    'Волгоград': 912,
    'Краснодар': 1343,
    'Саратов': 858,
    'Тюмень': 2144,
    'Тольятти': 1010,
    'Ижевск': 1058,
    'Барнаул': 3419,
    'Ульяновск': 893,
    'Иркутск': 5042,
    'Хабаровск': 8533,
    'Ярославль': 282,
    'Владивосток': 9259,
    'Махачкала': 1592,
    'Томск': 3506,
    'Оренбург': 1478,
    'Кемерово': 3602,
    'Новокузнецк': 3708,
    'Рязань': 196,
    'Астрахань': 1411,
    'Тула': 193,
    'Калуга': 190,
    'Тверь': 178,
    'Владимир': 190,
    'Кострома': 344,
    'Смоленск': 378,
    'Брянск': 379,
    'Курск': 536,
    'Белгород': 695,
    'Липецк': 508,
    'Тамбов': 460,
    'Орел': 368,
    'Подольск': 43,
    'Мытищи': 19,
    'Химки': 18,
    'Балашиха': 25,
    'Королев': 23,
    'Люберцы': 20,
    'Красногорск': 22,
    'Электросталь': 58,
    'Коломна': 115,
    'Серпухов': 99,
    'Щелково': 35,
    'Одинцово': 24,
    'Домодедово': 37,
    'Орехово-Зуево': 89,
    'Сергиев Посад': 71,
    'Ногинск': 51,
    'Жуковский': 40,
    'Дубна': 125,
    'Пушкино': 29,
    'Клин': 85,
    'Воскресенск': 88,
    'Истра': 58
  },
  
  // Санкт-Петербург
  'Санкт-Петербург': {
    'Москва': 635,
    'Нижний Новгород': 1046,
    'Екатеринбург': 2051,
    'Новосибирск': 3938,
    'Казань': 1450,
    'Мурманск': 1030,
    'Архангельск': 1234,
    'Псков': 230,
    'Великий Новгород': 180,
    'Петрозаводск': 402,
    'Калининград': 739,
    'Выборг': 140,
    'Гатчина': 45,
    'Всеволожск': 24,
    'Колпино': 25,
    'Пушкин': 25,
    'Кронштадт': 48,
    'Сестрорецк': 34
  },
  
  // Дополнительные маршруты между крупными городами
  'Екатеринбург': {
    'Москва': 1416,
    'Санкт-Петербург': 2051,
    'Челябинск': 210,
    'Пермь': 387,
    'Тюмень': 350,
    'Новосибирск': 1777,
    'Омск': 1139,
    'Уфа': 368,
    'Нижний Тагил': 149,
    'Каменск-Уральский': 103,
    'Первоуральск': 39,
    'Ревда': 25,
    'Заречный': 46,
    'Новоуральск': 73
  },
  
  'Новосибирск': {
    'Москва': 3303,
    'Екатеринбург': 1777,
    'Омск': 622,
    'Красноярск': 354,
    'Барнаул': 250,
    'Кемерово': 238,
    'Томск': 264,
    'Иркутск': 1777,
    'Бердск': 38,
    'Искитим': 48,
    'Обь': 17
  },

  // Нижний Новгород
  'Нижний Новгород': {
    'Москва': 411,
    'Санкт-Петербург': 1046,
    'Казань': 341,
    'Самара': 638,
    'Саратов': 447,
    'Киров': 276,
    'Йошкар-Ола': 221,
    'Чебоксары': 159,
    'Владимир': 221,
    'Иваново': 214,
    'Кострома': 333,
    'Дзержинск': 35,
    'Бор': 21,
    'Арзамас': 112,
    'Саров': 180
  },

  // Краснодар
  'Краснодар': {
    'Москва': 1343,
    'Ростов-на-Дону': 267,
    'Волгоград': 579,
    'Астрахань': 677,
    'Сочи': 279,
    'Анапа': 170,
    'Геленджик': 178,
    'Новороссийск': 145,
    'Армавир': 202,
    'Майкоп': 146,
    'Ейск': 150,
    'Тимашевск': 45,
    'Славянск-на-Кубани': 82
  },

  // Казань
  'Казань': {
    'Москва': 815,
    'Санкт-Петербург': 1450,
    'Нижний Новгород': 341,
    'Самара': 297,
    'Уфа': 542,
    'Пермь': 729,
    'Екатеринбург': 1183,
    'Ульяновск': 552,
    'Саратов': 744,
    'Йошкар-Ола': 120,
    'Чебоксары': 152,
    'Киров': 405,
    'Набережные Челны': 225,
    'Зеленодольск': 36,
    'Елабуга': 196
  }
};

class SmartLogisticsCalculator {
  constructor() {
    this.initConfiguration();
    this.initZones();
    this.initCargoTypes();
    this.initVehicleTypes();
    this.initAnimations();
    this.init();
  }

  initConfiguration() {
    this.config = {
      ...MAP_CONFIG,
      animationsEnabled: true,
      responsiveBreakpoint: 768,
      calculateDelay: 300, // мс для debounce
      currencySymbol: '₽'
    };
  }

  initZones() {
    this.zones = {
      'moscow-center': { 
        name: 'Центр Москвы', 
        baseRate: 140, 
        coefficient: 1.3,
        rushHourMultiplier: 1.5
      },
      'moscow-region': { 
        name: 'Московская область', 
        baseRate: 110, 
        coefficient: 1.1,
        rushHourMultiplier: 1.2
      },
      'central': { 
        name: 'Центральный ФО', 
        baseRate: 95, 
        coefficient: 1.0,
        rushHourMultiplier: 1.0
      },
      'northwest': { 
        name: 'Северо-Западный ФО', 
        baseRate: 105, 
        coefficient: 1.05,
        rushHourMultiplier: 1.1
      },
      'south': { 
        name: 'Южный ФО', 
        baseRate: 85, 
        coefficient: 0.9,
        rushHourMultiplier: 1.0
      },
      'volga': { 
        name: 'Приволжский ФО', 
        baseRate: 90, 
        coefficient: 0.95,
        rushHourMultiplier: 1.0
      },
      'ural': { 
        name: 'Уральский ФО', 
        baseRate: 115, 
        coefficient: 1.15,
        rushHourMultiplier: 1.1
      },
      'siberia': { 
        name: 'Сибирский ФО', 
        baseRate: 125, 
        coefficient: 1.2,
        rushHourMultiplier: 1.0
      },
      'far-east': { 
        name: 'Дальневосточный ФО', 
        baseRate: 150, 
        coefficient: 1.4,
        rushHourMultiplier: 1.0
      }
    };
  }

  initCargoTypes() {
    this.cargoTypes = {
      'general': { 
        name: 'Обычный груз', 
        multiplier: 1.0, 
        description: 'Стандартные товары, мебель, оборудование',
        icon: '📦'
      },
      'fragile': { 
        name: 'Хрупкий груз', 
        multiplier: 1.3, 
        description: 'Стекло, керамика, электроника',
        icon: '⚠️'
      },
      'dangerous': { 
        name: 'Опасный груз', 
        multiplier: 1.8, 
        description: 'Химикаты, газы, требует сертификации',
        icon: '☢️'
      },
      'oversized': { 
        name: 'Негабаритный груз', 
        multiplier: 1.5, 
        description: 'Крупногабаритное оборудование, спецтранспорт',
        icon: '📏'
      },
      'food': { 
        name: 'Продукты питания', 
        multiplier: 1.25, 
        description: 'Требует соблюдения температурного режима',
        icon: '🥘'
      },
      'documents': { 
        name: 'Документы', 
        multiplier: 0.8, 
        description: 'Документооборот, небольшие посылки',
        icon: '📄'
      },
      'marketplace': { 
        name: 'Товары маркетплейсов', 
        multiplier: 1.1, 
        description: 'Доставка на Wildberries, Ozon, сортировочные центры',
        icon: '🛍️'
      }
    };
  }

  initVehicleTypes() {
    this.vehicleTypes = {
      'gazelle': { 
        name: 'Газель (до 1.5т)', 
        capacity: 1.5, 
        basePrice: 3000, 
        kmRate: 40,
        volumeLimit: 9, // м³
        icon: '🚐'
      },
      'small-truck': { 
        name: 'Малый грузовик (до 3т)', 
        capacity: 3, 
        basePrice: 4200, 
        kmRate: 50,
        volumeLimit: 18,
        icon: '🚚'
      },
      'medium-truck': { 
        name: 'Средний грузовик (до 5т)', 
        capacity: 5, 
        basePrice: 5500, 
        kmRate: 65,
        volumeLimit: 28,
        icon: '🚛'
      },
      'large-truck': { 
        name: 'Большой грузовик (до 10т)', 
        capacity: 10, 
        basePrice: 7500, 
        kmRate: 85,
        volumeLimit: 45,
        icon: '🚜'
      },
      'semi-truck': { 
        name: 'Фура (до 20т)', 
        capacity: 20, 
        basePrice: 12000, 
        kmRate: 110,
        volumeLimit: 82,
        icon: '🚛'
      }
    };
  }

  init() {
    try {
      this.createCalculatorUI();
      this.bindEvents();
      this.initRealTimeCalculation();
      if (this.config.animationsEnabled) {
        this.initMicroAnimations();
      }
    } catch (error) {
      console.warn('Ошибка инициализации калькулятора:', error);
      // Показываем простую форму в случае ошибки
      this.showFallbackForm();
    }
  }

  showFallbackForm() {
    const container = document.getElementById('calculator-container');
    if (container) {
      container.innerHTML = `
        <div class="calculator-error">
          <h3>📞 Свяжитесь с нами для расчета</h3>
          <p>Временные технические работы. Позвоните нам для точного расчета стоимости:</p>
          <a href="tel:+74957777777" class="btn btn-primary">📞 +7 (495) 777-77-77</a>
        </div>
      `;
    }
  }

  createCalculatorUI() {
    const calculatorHTML = `
      <div class="smart-calculator card-neumorphic" data-aos="fade-up">
        <div class="calculator-header">
          <div class="header-content">
            <h3><span class="gradient-text">🚛 Умный калькулятор логистики</span></h3>
            <p class="subtitle">Точный расчет стоимости доставки по России</p>
            <div class="calculator-badges">
              <span class="badge badge-success">⚡ Мгновенный расчет</span>
              <span class="badge badge-info">🔒 Без скрытых платежей</span>
              <span class="badge badge-warning">📱 Мобильная версия</span>
            </div>
          </div>
        </div>

        <form id="smart-calc-form" class="calculator-form">
          <!-- Маршрут -->
          <div class="form-section animate-on-focus">
            <label class="form-label">
              <span class="label-icon">📍</span>
              Маршрут доставки
            </label>
            <div class="route-inputs grid-2">
              <div class="input-group">
                <div class="input-wrapper">
                  <input type="text" id="from-city" placeholder="Откуда" required>
                  <div class="input-icon">🏠</div>
                </div>
                <div class="input-suggestions" id="from-suggestions"></div>
              </div>
              <div class="input-group">
                <div class="input-wrapper">
                  <input type="text" id="to-city" placeholder="Куда" required>
                  <div class="input-icon">🎯</div>
                </div>
                <div class="input-suggestions" id="to-suggestions"></div>
              </div>
            </div>
            <div class="distance-display">
              <div id="route-distance" class="distance-info">
                <span class="distance-placeholder">Введите города для расчета расстояния</span>
              </div>
            </div>
          </div>

          <!-- Тип груза -->
          <div class="form-section animate-on-focus">
            <label class="form-label">
              <span class="label-icon">📦</span>
              Тип груза
            </label>
            <div class="cargo-types grid-responsive">
              ${Object.entries(this.cargoTypes).map(([key, type]) => `
                <label class="cargo-type-card ${key === 'general' ? 'selected' : ''}" data-cargo="${key}">
                  <input type="radio" name="cargo-type" value="${key}" ${key === 'general' ? 'checked' : ''}>
                  <div class="card-content">
                    <div class="type-icon">${type.icon}</div>
                    <div class="type-name">${type.name}</div>
                    <div class="type-description">${type.description}</div>
                    <div class="type-multiplier">×${type.multiplier}</div>
                  </div>
                  <div class="card-overlay"></div>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Параметры груза -->
          <div class="form-section animate-on-focus">
            <label class="form-label">
              <span class="label-icon">⚖️</span>
              Параметры груза
            </label>
            <div class="cargo-params grid-2">
              <div class="param-group">
                <label for="weight" class="param-label">Вес (кг)</label>
                <div class="input-with-slider">
                  <input type="number" id="weight" min="1" max="20000" value="100" required>
                  <div class="slider-container">
                    <input type="range" id="weight-slider" min="1" max="2000" value="100" class="custom-slider">
                    <div class="slider-labels">
                      <span>1 кг</span>
                      <span>2т</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="param-group">
                <label for="volume" class="param-label">Объем (м³)</label>
                <div class="input-with-slider">
                  <input type="number" id="volume" min="0.1" max="100" step="0.1" value="5" required>
                  <div class="slider-container">
                    <input type="range" id="volume-slider" min="1" max="100" value="5" class="custom-slider">
                    <div class="slider-labels">
                      <span>0.1 м³</span>
                      <span>100 м³</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="vehicle-recommendation" class="vehicle-recommendation"></div>
          </div>

          <!-- Дополнительные услуги -->
          <div class="form-section animate-on-focus">
            <label class="form-label">
              <span class="label-icon">🛠️</span>
              Дополнительные услуги
            </label>
            <div class="additional-services">

              

              

              
              <label class="service-checkbox modern-checkbox">
                <input type="checkbox" name="services" value="express">
                <span class="checkmark">
                  <i class="check-icon">✓</i>
                </span>
                <div class="service-info">
                  <span class="service-name">Экспресс-доставка</span>
                  <span class="service-description">Срочная подача, индивидуальный расчет</span>
                  <span class="service-price">по договоренности</span>
                </div>
              </label>
            </div>
          </div>

          <div class="form-section" style="margin-top: 1.5rem;">
            <label class="service-checkbox modern-checkbox consent-checkbox" style="justify-content: center;">
              <input type="checkbox" name="consent" required checked>
              <span class="checkmark">
                <i class="check-icon">✓</i>
              </span>
              <div class="service-info">
                <span class="service-name">Я согласен(а) с <a href="privacy.html" target="_blank" style="color: var(--primary-600); text-decoration: underline;">обработкой персональных данных</a></span>
              </div>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-lg calculate-btn">
            <span class="btn-content">
              <i class="btn-icon">🧮</i>
              <span class="btn-text">Рассчитать стоимость</span>
            </span>
            <div class="btn-ripple"></div>
          </button>
        </form>

        <div id="calculation-result" class="calculation-result"></div>
        
        <!-- Индикатор загрузки -->
        <div id="calculation-loader" class="calculation-loader hidden">
          <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Рассчитываем оптимальный маршрут...</p>
          </div>
        </div>
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
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearTimeout(this.calculateTimeout);
        this.calculateTimeout = setTimeout(() => {
          this.calculateDistance();
          this.updateVehicleRecommendation();
        }, this.config.calculateDelay);
      });
    });

    // Обработка выбора типа груза
    const cargoCards = document.querySelectorAll('.cargo-type-card');
    cargoCards.forEach(card => {
      card.addEventListener('click', () => {
        cargoCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        this.updateVehicleRecommendation();
      });
    });
  }

  syncSliderWithInput(inputId, sliderId) {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);

    if (!input || !slider) return;

    input.addEventListener('input', () => {
      const value = Math.min(input.value, slider.max);
      slider.value = value;
      this.updateVehicleRecommendation();
    });

    slider.addEventListener('input', () => {
      input.value = slider.value;
      this.updateVehicleRecommendation();
    });
  }

  initCityAutocomplete() {
    // Собираем все города из базы данных расстояний
    const citySet = new Set();
    
    // Добавляем города из ключей базы данных
    Object.keys(DISTANCE_DATABASE).forEach(city => citySet.add(city));
    
    // Добавляем города из значений (маршрутов)
    Object.values(DISTANCE_DATABASE).forEach(routes => {
      Object.keys(routes).forEach(city => citySet.add(city));
    });

    // Преобразуем в отсортированный массив с приоритетом для крупных городов
    const priorityCities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Краснодар'];
    const cities = Array.from(citySet).sort((a, b) => {
      const aIndex = priorityCities.indexOf(a);
      const bIndex = priorityCities.indexOf(b);
      
      // Приоритетные города идут первыми
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // Остальные по алфавиту
      return a.localeCompare(b, 'ru');
    });

    this.setupAutocomplete('from-city', 'from-suggestions', cities);
    this.setupAutocomplete('to-city', 'to-suggestions', cities);
  }

  setupAutocomplete(inputId, suggestionsId, cities) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);

    if (!input || !suggestions) return;

    input.addEventListener('input', () => {
      const value = input.value.toLowerCase().trim();
      
      if (value.length < 2) {
        suggestions.style.display = 'none';
        return;
      }

      // Улучшенный поиск с приоритизацией
      const suggestions = [];
      
      // 1. Точное совпадение начала (высший приоритет)
      cities.forEach(city => {
        if (city.toLowerCase().startsWith(value)) {
          suggestions.push({ city, priority: 1 });
        }
      });

      // 2. Совпадение начала любого слова
      cities.forEach(city => {
        const words = city.toLowerCase().split(/[\s-]/);
        if (words.some(word => word.startsWith(value)) && 
            !suggestions.find(s => s.city === city)) {
          suggestions.push({ city, priority: 2 });
        }
      });

      // 3. Содержит подстроку где-то в названии
      cities.forEach(city => {
        if (city.toLowerCase().includes(value) && 
            !suggestions.find(s => s.city === city)) {
          suggestions.push({ city, priority: 3 });
        }
      });

      // Сортируем по приоритету и ограничиваем количество
      const filtered = suggestions
        .sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return a.city.length - b.city.length; // короткие названия выше
        })
        .slice(0, 8)
        .map(s => s.city);

      if (filtered.length > 0) {
        suggestions.innerHTML = filtered.map(city => 
          `<div class="suggestion" data-city="${city}">${city}</div>`
        ).join('');
        suggestions.style.display = 'block';
        
        // Подсветка совпадений
        suggestions.querySelectorAll('.suggestion').forEach(item => {
          const cityName = item.textContent;
          const highlightedName = cityName.replace(
            new RegExp(value, 'gi'), 
            match => `<mark>${match}</mark>`
          );
          item.innerHTML = highlightedName;
        });
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

    // Скрываем подсказки при клике вне поля
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.style.display = 'none';
      }
    });

    // Навигация клавишами
    input.addEventListener('keydown', (e) => {
      const activeSuggestion = suggestions.querySelector('.suggestion.active');
      const allSuggestions = suggestions.querySelectorAll('.suggestion');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = activeSuggestion 
          ? activeSuggestion.nextElementSibling 
          : allSuggestions[0];
        if (next) {
          allSuggestions.forEach(s => s.classList.remove('active'));
          next.classList.add('active');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = activeSuggestion 
          ? activeSuggestion.previousElementSibling 
          : allSuggestions[allSuggestions.length - 1];
        if (prev) {
          allSuggestions.forEach(s => s.classList.remove('active'));
          prev.classList.add('active');
        }
      } else if (e.key === 'Enter' && activeSuggestion) {
        e.preventDefault();
        input.value = activeSuggestion.dataset.city;
        suggestions.style.display = 'none';
        this.calculateDistance();
      } else if (e.key === 'Escape') {
        suggestions.style.display = 'none';
      }
    });
  }

  // 🗺️ СИСТЕМА РАСЧЕТА РАССТОЯНИЙ
  calculateDistance() {
    const fromCity = document.getElementById('from-city').value.trim();
    const toCity = document.getElementById('to-city').value.trim();
    
    if (!fromCity || !toCity) {
      document.getElementById('route-distance').innerHTML = 
        '<span class="distance-placeholder">Введите города для расчета расстояния</span>';
      return 0;
    }

    const distance = this.getDistanceBetweenCities(fromCity, toCity);
    
    if (distance > 0) {
      const estimatedTime = this.calculateDeliveryTime(distance);
      document.getElementById('route-distance').innerHTML = `
        <div class="distance-success">
          <span class="distance-value">📏 ${distance} км</span>
          <span class="time-estimate">⏱️ ${estimatedTime}</span>
          <span class="route-type">${distance < 300 ? '🚀 Региональная доставка' : '🌍 Межрегиональная доставка'}</span>
        </div>
      `;
      
      // Обновляем рекомендацию транспорта
      this.updateVehicleRecommendation();
      
      return distance;
    } else {
      document.getElementById('route-distance').innerHTML = 
        '<span class="distance-error">❌ Маршрут не найден в базе. Цена будет рассчитана индивидуально</span>';
      return 0;
    }
  }

  getDistanceBetweenCities(from, to) {
    // Расширенная нормализация названий городов
    const normalizeCity = (city) => {
      return city.trim()
        .replace(/г\.\s*/i, '') // убираем "г."
        .replace(/\s*\([^)]*\)/g, '') // убираем скобки с содержимым
        .split(',')[0] // берем только название до запятой
        .trim()
        .replace(/^(\w)/, (match) => match.toUpperCase()) // первая буква заглавная
        .replace(/(\s\w)/g, (match) => match.toUpperCase()); // каждое слово с заглавной
    };

    const fromNormalized = normalizeCity(from);
    const toNormalized = normalizeCity(to);

    // Одинаковые города
    if (fromNormalized === toNormalized) return 0;

    // Ищем прямое соответствие
    if (DISTANCE_DATABASE[fromNormalized] && DISTANCE_DATABASE[fromNormalized][toNormalized]) {
      return DISTANCE_DATABASE[fromNormalized][toNormalized];
    }

    // Ищем обратное направление
    if (DISTANCE_DATABASE[toNormalized] && DISTANCE_DATABASE[toNormalized][fromNormalized]) {
      return DISTANCE_DATABASE[toNormalized][fromNormalized];
    }

    // Fuzzy поиск для учета опечаток и вариантов написания
    const foundFrom = this.findCityFuzzy(fromNormalized);
    const foundTo = this.findCityFuzzy(toNormalized);

    if (foundFrom && foundTo) {
      if (DISTANCE_DATABASE[foundFrom] && DISTANCE_DATABASE[foundFrom][foundTo]) {
        return DISTANCE_DATABASE[foundFrom][foundTo];
      }
      if (DISTANCE_DATABASE[foundTo] && DISTANCE_DATABASE[foundTo][foundFrom]) {
        return DISTANCE_DATABASE[foundTo][foundFrom];
      }
    }

    // Поиск через Москву как транзитный узел
    const fromKey = foundFrom || fromNormalized;
    const toKey = foundTo || toNormalized;
    
    if (fromKey !== 'Москва' && toKey !== 'Москва') {
      const fromToMoscow = DISTANCE_DATABASE[fromKey]?.['Москва'] || 
                          DISTANCE_DATABASE['Москва']?.[fromKey];
      const moscowToTo = DISTANCE_DATABASE['Москва']?.[toKey] || 
                        DISTANCE_DATABASE[toKey]?.['Москва'];
      
      if (fromToMoscow && moscowToTo) {
        return Math.round(fromToMoscow + moscowToTo * 0.9); // небольшая скидка за транзит
      }
    }

    // Оценочный расчет для незнакомых городов
    return this.estimateDistanceByRegion(fromNormalized, toNormalized);
  }

  findCityFuzzy(searchCity) {
    const allCities = new Set();
    
    // Собираем все города из базы
    Object.keys(DISTANCE_DATABASE).forEach(city => allCities.add(city));
    Object.values(DISTANCE_DATABASE).forEach(routes => {
      Object.keys(routes).forEach(city => allCities.add(city));
    });

    const searchLower = searchCity.toLowerCase();
    
    // Точное совпадение (нечувствительно к регистру)
    for (const city of allCities) {
      if (city.toLowerCase() === searchLower) return city;
    }
    
    // Совпадение начала
    for (const city of allCities) {
      if (city.toLowerCase().startsWith(searchLower) || searchLower.startsWith(city.toLowerCase())) {
        return city;
      }
    }
    
    // Содержит подстроку
    for (const city of allCities) {
      if (city.toLowerCase().includes(searchLower) || searchLower.includes(city.toLowerCase())) {
        return city;
      }
    }
    
    return null;
  }

  estimateDistanceByRegion(from, to) {
    // Простая оценка расстояния по регионам для неизвестных городов
    const regionalDistances = {
      'Московская': 100,
      'Ленинградская': 150,
      'Центральная': 300,
      'Приволжская': 500,
      'Южная': 700,
      'Уральская': 1200,
      'Сибирская': 2000,
      'Дальневосточная': 5000
    };
    
    // Возвращаем среднее расстояние для межрегиональных перевозок
    return 800;
  }

  calculateDeliveryTime(distance) {
    if (distance < 50) return '2-4 часа';
    if (distance < 200) return '4-8 часов';
    if (distance < 500) return '1 день';
    if (distance < 1000) return '1-2 дня';
    if (distance < 2000) return '2-3 дня';
    if (distance < 4000) return '3-5 дней';
    return '5-7 дней';
  }

  handleCalculation(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const calculation = this.performCalculation(formData);
    
    if (calculation) {
      this.displayResult(calculation);
      this.sendLeadToTelegram(calculation);
    }
  }

  performCalculation(formData) {
    const distance = this.calculateDistance();
    const weight = parseFloat(formData.get('weight') || 0);
    const volume = parseFloat(formData.get('volume') || 0);
    const cargoType = formData.get('cargo-type') || 'general';
    const services = formData.getAll('services');
    const fromCity = document.getElementById('from-city').value.trim();
    const toCity = document.getElementById('to-city').value.trim();

    if (!fromCity || !toCity) {
      alert('Пожалуйста, укажите города отправления и назначения');
      return null;
    }

    if (weight <= 0 || volume <= 0) {
      alert('Пожалуйста, укажите корректные параметры груза');
      return null;
    }

    // Определяем тип транспорта по весу и объему
    const vehicleType = this.selectOptimalVehicle(weight, volume);
    const vehicle = this.vehicleTypes[vehicleType];

    if (!vehicle) {
      alert('Для данного груза требуется специальный транспорт. Обратитесь к нашим специалистам.');
      return null;
    }

    // Базовая стоимость
    let basePrice = distance > 0 ? 
      vehicle.basePrice + (distance * vehicle.kmRate) : 
      vehicle.basePrice * 2; // Если расстояние не найдено, используем увеличенную базовую ставку

    // Коэффициент типа груза
    const cargoMultiplier = this.cargoTypes[cargoType].multiplier;
    basePrice *= cargoMultiplier;

    // Региональные коэффициенты
    const regionMultiplier = this.getRegionMultiplier(fromCity, toCity);
    basePrice *= regionMultiplier;

    // Дополнительные услуги
    let additionalCost = 0;
    const serviceDetails = [];
    
    services.forEach(service => {
      switch(service) {



        case 'express': 
          // Экспресс-доставка рассчитывается индивидуально
          serviceDetails.push({ name: 'Экспресс-доставка', cost: 'по договоренности' });
          break;
      }
    });

    const totalPrice = Math.round(basePrice + additionalCost);

    return {
      fromCity,
      toCity,
      distance: distance || 'Расчет индивидуально',
      weight,
      volume,
      cargoType: this.cargoTypes[cargoType].name,
      vehicleType: vehicle.name,
      vehicleIcon: vehicle.icon,
      basePrice: Math.round(basePrice),
      additionalCost: Math.round(additionalCost),
      totalPrice,
      services: serviceDetails,
      deliveryTime: distance > 0 ? this.calculateDeliveryTime(distance) : '2-5 дней',
      regionMultiplier,
      breakdown: {
        transport: Math.round(basePrice),
        services: Math.round(additionalCost),
        total: totalPrice
      }
    };
  }

  selectOptimalVehicle(weight, volume) {
    // Сначала проверяем по весу
    for (const [vehicleKey, vehicle] of Object.entries(this.vehicleTypes)) {
      if (weight <= vehicle.capacity && volume <= vehicle.volumeLimit) {
        return vehicleKey;
      }
    }
    
    // Если ничего не подходит, возвращаем null
    return null;
  }

  getRegionMultiplier(fromCity, toCity) {
    // Упрощенная система региональных коэффициентов
    const moscowRegion = ['Москва', 'Подольск', 'Балашиха', 'Химки', 'Королёв', 'Мытищи'];
    const spbRegion = ['Санкт-Петербург', 'Гатчина', 'Выборг'];
    
    const isFromMoscow = moscowRegion.some(city => fromCity.includes(city));
    const isToMoscow = moscowRegion.some(city => toCity.includes(city));
    const isFromSpb = spbRegion.some(city => fromCity.includes(city));
    const isToSpb = spbRegion.some(city => toCity.includes(city));
    
    if ((isFromMoscow || isToMoscow) && (isFromSpb || isToSpb)) {
      return 1.1; // Москва-СПб коридор
    } else if (isFromMoscow || isToMoscow) {
      return 1.05; // Из/в Москву
    } else if (isFromSpb || isToSpb) {
      return 1.03; // Из/в СПб
    }
    
    return 1.0; // Стандартный коэффициент
  }

  displayResult(calculation) {
    const resultContainer = document.getElementById('calculation-result');
    
    const servicesHtml = calculation.services.length > 0 ? 
      `<div class="services-breakdown">
        <h6>Дополнительные услуги:</h6>
        ${calculation.services.map(service => 
          `<div class="service-item">
            <span>${service.name}</span>
            <span>+${service.cost.toLocaleString('ru-RU')} ₽</span>
          </div>`
        ).join('')}
      </div>` : '';
    
    const resultHTML = `
      <div class="result-card card animate-fade-in-up">
        <div class="result-header">
          <div class="result-title">
            <h4>💰 Результат расчета</h4>
            <div class="route-info">${calculation.fromCity} → ${calculation.toCity}</div>
          </div>
          <div class="total-price">
            <span class="price-value">${calculation.totalPrice.toLocaleString('ru-RU')}</span>
            <span class="price-currency">₽</span>
          </div>
        </div>
        
        <div class="result-details">
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-icon">📏</div>
              <div class="detail-content">
                <div class="detail-label">Расстояние</div>
                <div class="detail-value">${calculation.distance} ${typeof calculation.distance === 'number' ? 'км' : ''}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">⚖️</div>
              <div class="detail-content">
                <div class="detail-label">Параметры груза</div>
                <div class="detail-value">${calculation.weight} кг, ${calculation.volume} м³</div>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">${calculation.vehicleIcon}</div>
              <div class="detail-content">
                <div class="detail-label">Транспорт</div>
                <div class="detail-value">${calculation.vehicleType}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">⏱️</div>
              <div class="detail-content">
                <div class="detail-label">Время доставки</div>
                <div class="detail-value">${calculation.deliveryTime}</div>
              </div>
            </div>
          </div>
          
          <div class="cargo-type-display">
            <span class="cargo-label">Тип груза:</span>
            <span class="cargo-value">${calculation.cargoType}</span>
          </div>
        </div>

        ${servicesHtml}

        <div class="price-breakdown">
          <div class="breakdown-row">
            <span>Транспортировка:</span>
            <span>${calculation.breakdown.transport.toLocaleString('ru-RU')} ₽</span>
          </div>
          ${calculation.breakdown.services > 0 ? `
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
          <a href="https://t.me/father_bot" target="_blank" class="btn btn-telegram" style="background: #0088cc; color: white; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
            💬 Написать в Telegram
          </a>
          <button class="btn btn-secondary" onclick="this.saveCalculation()">
            💾 Сохранить расчет
          </button>
          <button class="btn btn-outline" onclick="window.print()">
            🖨️ Распечатать
          </button>
        </div>

        <div class="result-note">
          <div class="note-content">
            <div class="note-icon">ℹ️</div>
            <div class="note-text">
              <strong>Важно:</strong> Расчет носит ориентировочный характер. 
              Точная стоимость определяется после осмотра груза и подтверждения маршрута.
            </div>
          </div>
        </div>
      </div>
    `;

    resultContainer.innerHTML = resultHTML;
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Сохраняем последний расчет
    this.lastCalculation = calculation;
  }

  sendLeadToTelegram(calculation) {
    const message = `
🚛 НОВЫЙ РАСЧЕТ ЛОГИСТИКИ

📍 Маршрут: ${calculation.fromCity} → ${calculation.toCity}
📏 Расстояние: ${calculation.distance} ${typeof calculation.distance === 'number' ? 'км' : ''}
⚖️ Груз: ${calculation.weight} кг, ${calculation.volume} м³ (${calculation.cargoType})
🚚 Транспорт: ${calculation.vehicleType}
⏱️ Время доставки: ${calculation.deliveryTime}
💰 Стоимость: ${calculation.totalPrice.toLocaleString('ru-RU')} ₽

${calculation.services.length ? `🛠️ Услуги:\n${calculation.services.map(s => `• ${s.name}: +${s.cost.toLocaleString('ru-RU')} ₽`).join('\n')}` : ''}

💹 Детализация:
• Транспорт: ${calculation.breakdown.transport.toLocaleString('ru-RU')} ₽
${calculation.breakdown.services ? `• Услуги: ${calculation.breakdown.services.toLocaleString('ru-RU')} ₽` : ''}

#расчет #логистика #avtogost
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

  // Метод для обновления рекомендации транспорта
  updateVehicleRecommendation() {
    const weight = parseFloat(document.getElementById('weight').value);
    const volume = parseFloat(document.getElementById('volume').value);
    const cargoType = document.querySelector('input[name="cargo-type"]:checked').value;

    let recommendedVehicle = null;
    let maxCapacity = -1;

    for (const [vehicleKey, vehicle] of Object.entries(this.vehicleTypes)) {
      if (weight <= vehicle.capacity && volume <= vehicle.volumeLimit) {
        if (vehicle.capacity > maxCapacity) {
          maxCapacity = vehicle.capacity;
          recommendedVehicle = vehicle;
        }
      }
    }

    const recommendationContainer = document.getElementById('vehicle-recommendation');
    if (recommendedVehicle) {
      recommendationContainer.innerHTML = `
        <div class="recommendation-card">
          <h5>Рекомендуемый транспорт:</h5>
          <div class="recommendation-content">
            <div class="recommendation-icon">${recommendedVehicle.icon}</div>
            <div class="recommendation-details">
              <p>${recommendedVehicle.name}</p>
              <p>Грузоподъемность: ${recommendedVehicle.capacity} т</p>
              <p>Объем: ${recommendedVehicle.volumeLimit} м³</p>
            </div>
          </div>
        </div>
      `;
    } else {
      recommendationContainer.innerHTML = `
        <div class="recommendation-card">
          <h5>Необходимый транспорт:</h5>
          <div class="recommendation-content">
            <p>Ваш груз требует специального транспорта или не подходит для стандартных автомобилей.</p>
            <p>Пожалуйста, обратитесь к нашим специалистам для получения индивидуальной консультации.</p>
          </div>
        </div>
      `;
    }
  }

  initRealTimeCalculation() {
    let lastCalculationTime = 0;
    const form = document.getElementById('smart-calc-form');
    const loader = document.getElementById('calculation-loader');

    form.addEventListener('submit', (e) => {
      if (this.config.animationsEnabled) {
        e.preventDefault();
        loader.classList.remove('hidden');
        setTimeout(() => {
          this.handleCalculation(e);
          loader.classList.add('hidden');
        }, this.config.calculateDelay);
      }
    });
  }

  initMicroAnimations() {
    // Микроанимации для слайдеров и кнопок
    const sliders = document.querySelectorAll('.custom-slider');
    const checkboxes = document.querySelectorAll('.modern-checkbox input[type="checkbox"]');
    const calculateBtn = document.querySelector('.calculate-btn');

    sliders.forEach(slider => {
      const labels = slider.nextElementSibling?.querySelectorAll('.slider-labels span');
      if (!labels || labels.length < 2) return;
      
      const minValue = parseFloat(labels[0].textContent.replace(/ кг| м³/g, ''));
      const maxValue = parseFloat(labels[1].textContent.replace(/ кг| м³/g, ''));

      slider.addEventListener('input', () => {
        const value = Math.min(slider.value, slider.max);
        slider.value = value;
        this.updateSliderLabels(slider, labels, minValue, maxValue);
      });

      slider.addEventListener('change', () => {
        this.updateSliderLabels(slider, labels, minValue, maxValue);
      });
    });

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const checkmark = checkbox.nextElementSibling?.querySelector('.check-icon');
        if (checkmark) {
          if (checkbox.checked) {
            checkmark.parentElement.classList.add('checked');
          } else {
            checkmark.parentElement.classList.remove('checked');
          }
        }
      });
    });

    if (calculateBtn) {
      calculateBtn.addEventListener('click', (e) => {
        const ripple = calculateBtn.querySelector('.btn-ripple');
        if (ripple) {
          const rect = calculateBtn.getBoundingClientRect();
          ripple.style.left = `${e.clientX - rect.left}px`;
          ripple.style.top = `${e.clientY - rect.top}px`;
          ripple.classList.add('active');
          setTimeout(() => ripple.classList.remove('active'), 500);
        }
      });
    }
  }

  updateSliderLabels(slider, labels, minValue, maxValue) {
    const value = parseFloat(slider.value);
    let currentLabel = labels[0];
    if (value > minValue + (maxValue - minValue) / 2) {
      currentLabel = labels[1];
    }
    currentLabel.style.color = 'var(--primary-600)';
    currentLabel.style.fontWeight = 'bold';
    labels.forEach(label => {
      if (label !== currentLabel) {
        label.style.color = 'var(--text-color)';
        label.style.fontWeight = 'normal';
      }
    });
  }

  // Глобальные методы для кнопок результата
  openLeadModal() {
    // Открываем существующее модальное окно заявки
    const leadModal = document.getElementById('lead-modal');
    if (leadModal) {
      leadModal.style.display = 'flex';
      
      // Предзаполняем форму данными из расчета
      if (this.lastCalculation) {
        const form = leadModal.querySelector('form');
        if (form) {
          // Заполняем комментарий данными расчета
          const commentField = form.querySelector('textarea[name="comment"]');
          if (commentField) {
            commentField.value = `Расчет из калькулятора:
Маршрут: ${this.lastCalculation.fromCity} → ${this.lastCalculation.toCity}
Груз: ${this.lastCalculation.weight} кг, ${this.lastCalculation.volume} м³
Тип: ${this.lastCalculation.cargoType}
Транспорт: ${this.lastCalculation.vehicleType}
Стоимость: ${this.lastCalculation.totalPrice.toLocaleString('ru-RU')} ₽`;
          }
        }
      }
    } else {
      // Если модальное окно не найдено, показываем простой алерт
      alert('Для оформления заявки, пожалуйста, свяжитесь с нами по телефону +7 (999) 123-45-67');
    }
  }

  saveCalculation() {
    if (!this.lastCalculation) {
      alert('Нет данных для сохранения');
      return;
    }

    // Создаем текстовое представление расчета
    const calculationText = `
РАСЧЕТ ДОСТАВКИ АВТОГОСТ
========================

Маршрут: ${this.lastCalculation.fromCity} → ${this.lastCalculation.toCity}
Расстояние: ${this.lastCalculation.distance} ${typeof this.lastCalculation.distance === 'number' ? 'км' : ''}
Время доставки: ${this.lastCalculation.deliveryTime}

ПАРАМЕТРЫ ГРУЗА:
Вес: ${this.lastCalculation.weight} кг
Объем: ${this.lastCalculation.volume} м³
Тип: ${this.lastCalculation.cargoType}

ТРАНСПОРТ:
${this.lastCalculation.vehicleType}

СТОИМОСТЬ:
Транспортировка: ${this.lastCalculation.breakdown.transport.toLocaleString('ru-RU')} ₽
${this.lastCalculation.breakdown.services > 0 ? `Дополнительные услуги: ${this.lastCalculation.breakdown.services.toLocaleString('ru-RU')} ₽` : ''}
ИТОГО: ${this.lastCalculation.totalPrice.toLocaleString('ru-RU')} ₽

${this.lastCalculation.services.length > 0 ? `\nДОПОЛНИТЕЛЬНЫЕ УСЛУГИ:\n${this.lastCalculation.services.map(s => `• ${s.name}: +${s.cost.toLocaleString('ru-RU')} ₽`).join('\n')}` : ''}

ВАЖНО: Расчет носит ориентировочный характер.
Точная стоимость определяется после осмотра груза.

Контакты AvtoGOST:
Телефон: +7 (999) 123-45-67
Email: info@avtogost.ru
Сайт: https://avtogost.ru

Дата расчета: ${new Date().toLocaleString('ru-RU')}
`;

    // Попытка сохранить через File API (современные браузеры)
    if ('showSaveFilePicker' in window) {
      try {
        this.saveCalculationModern(calculationText);
      } catch (error) {
        this.saveCalculationFallback(calculationText);
      }
    } else {
      this.saveCalculationFallback(calculationText);
    }
  }

  async saveCalculationModern(text) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `avtogost_calculation_${Date.now()}.txt`,
        types: [{
          description: 'Текстовые файлы',
          accept: { 'text/plain': ['.txt'] }
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(text);
      await writable.close();
      
      this.showNotification('✅ Расчет сохранен!', 'success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.saveCalculationFallback(text);
      }
    }
  }

  saveCalculationFallback(text) {
    // Сохранение через создание ссылки для скачивания
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avtogost_calculation_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.showNotification('📥 Расчет загружен!', 'success');
  }

  showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease-out;
      font-weight: 600;
      max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Удаление через 3 секунды
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Глобальные функции для доступа из HTML
window.openLeadModal = function() {
  if (window.calculatorInstance && window.calculatorInstance.openLeadModal) {
    window.calculatorInstance.openLeadModal();
  }
};

window.saveCalculation = function() {
  if (window.calculatorInstance && window.calculatorInstance.saveCalculation) {
    window.calculatorInstance.saveCalculation();
  }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  window.calculatorInstance = new SmartLogisticsCalculator();
  console.log('✅ Умный калькулятор логистики v3.0 инициализирован');
});