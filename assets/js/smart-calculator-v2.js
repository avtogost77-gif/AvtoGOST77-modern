// ========================================================
// 🚛 УМНЫЙ КАЛЬКУЛЯТОР АВТОГОСТ V2.0 - ЛОГИКА ИЛЮШИ
// Основано на реальных данных из CALCULATOR-LOGIC.md
// ========================================================

class SmartCalculatorV2 {
  constructor() {
    // ТИПЫ ТРАНСПОРТА с реальными параметрами от Илюши
    this.transportTypes = {
      gazelle: {
        name: 'Газель',
        maxWeight: 1500,    // кг (исправлено!)
        maxVolume: 16,      // м³
        density: 94,        // кг/м³ (1500/16)
        minPrice: 10000,    // минимальная цена Москва
        minPriceRegion: 7500, // минималка в регионах
        coefficient: 0.36,  // от цены фуры
        icon: '🚐'
      },
      threeTon: {
        name: '3-тонник',
        maxWeight: 3000,
        maxVolume: 18,
        density: 167,
        minPrice: 13000,
        minPriceRegion: 9750,
        coefficient: 0.46,
        icon: '🚛'
      },
      fiveTon: {
        name: '5-тонник',
        maxWeight: 5000,
        maxVolume: 36,
        density: 139,
        minPrice: 20000,
        minPriceRegion: 15000,
        coefficient: 0.71,
        icon: '🚛'
      },
      tenTon: {
        name: '10-тонник',
        maxWeight: 10000,
        maxVolume: 50,
        density: 200,
        minPrice: 24000,
        minPriceRegion: 18000,
        coefficient: 0.86,
        icon: '🚚'
      },
      truck: {
        name: 'Фура 20т',
        maxWeight: 20000,
        maxVolume: 82,     // м³ (минимум из диапазона 82-92)
        density: 244,       // кг/м³ (20000/82)
        minPrice: 28000,
        minPriceRegion: 21000,
        coefficient: 1.0,
        icon: '🚚'
      }
    };

    // РЕАЛЬНЫЕ ПРИМЕРЫ ЦЕН от Илюши
    this.realPrices = {
      'Голицыно-Поварово': { distance: 40, price: 28000, pricePerKm: 700 },
      'Голицыно-Воскресенск': { distance: 100, price: 28000, pricePerKm: 280 },
      'Голицыно-Тверь': { distance: 170, price: 35000, pricePerKm: 206 },
      'Голицыно-Рязань': { distance: 180, price: 35000, pricePerKm: 194 },
      'Голицыно-Кострома': { distance: 340, price: 50000, pricePerKm: 147 },
      'Одинцово-СПб': { distance: 700, price: 70000, pricePerKm: 100 },
      'СПб-Одинцово': { distance: 700, price: 65000, pricePerKm: 93 }  // обратка дешевле!
    };

    // ВАЖНОЕ ПРАВИЛО: ВНУТРИ РЕГИОНА СБОРНЫХ НЕТ!
    this.regions = {
      'Московская область': [
        'Москва', 'Подольск', 'Химки', 'Балашиха', 'Мытищи', 'Королёв',
        'Люберцы', 'Красногорск', 'Одинцово', 'Голицыно', 'Поварово',
        'Воскресенск', 'Коломна', 'Серпухов', 'Щёлково', 'Домодедово'
      ],
      'Санкт-Петербург и область': [
        'Санкт-Петербург', 'Гатчина', 'Выборг', 'Всеволожск', 'Колпино',
        'Пушкин', 'Петергоф', 'Кронштадт'
      ],
      'Нижегородская область': [
        'Нижний Новгород', 'Дзержинск', 'Арзамас', 'Саров', 'Бор'
      ]
    };

    this.init();
  }

  // ГЛАВНАЯ ЛОГИКА РАСЧЕТА
  calculatePrice(fromCity, toCity, weight, volume, cargoType = 'general') {
    // 1. Проверка на внутрирегиональную перевозку
    if (this.isSameRegion(fromCity, toCity)) {
      return {
        error: true,
        message: 'ВНИМАНИЕ! Сборные грузы только между регионами. Внутри региона - только отдельная машина!',
        alternativePrice: this.calculateFullTruckPrice(fromCity, toCity)
      };
    }

    // 2. Определяем оптимальный транспорт
    const transport = this.selectOptimalTransport(weight, volume);
    if (!transport) {
      return {
        error: true,
        message: 'Груз не помещается даже в фуру! Требуется спецтранспорт.'
      };
    }

    // 3. Получаем расстояние
    const distance = this.getDistance(fromCity, toCity);

    // 4. Расчет базовой цены с учетом РЕАЛЬНЫХ коэффициентов
    let pricePerKm;
    if (distance < 50) {
      pricePerKm = 700;  // Очень короткие маршруты - дорого!
    } else if (distance < 100) {
      pricePerKm = 280;
    } else if (distance < 200) {
      pricePerKm = 200;
    } else if (distance < 500) {
      pricePerKm = 150;
    } else {
      pricePerKm = 100;  // Дальние маршруты - дешевле за км
    }

    let basePrice = distance * pricePerKm;

    // 5. Определяем минималку с учетом региона
    const isMoscow = fromCity.includes('Москв') || toCity.includes('Москв');
    const minPrice = isMoscow ? transport.minPrice : transport.minPriceRegion;
    
    // Если выбрана не фура, применяем коэффициент от цены фуры
    if (transport.name !== 'Фура 20т') {
      basePrice = basePrice * transport.coefficient;
    }
    
    // Применяем минимальную цену
    basePrice = Math.max(basePrice, minPrice);
    
    // 5.1 Если это сборный груз - делаем дешевле!
    if (cargoType === 'сборный' || cargoType === 'consolidated') {
      basePrice = basePrice * 0.65; // Сборный груз дешевле на 35%!
    }

    // 6. Коэффициент загрузки (чем меньше груз, тем дороже за единицу)
    const loadFactor = this.calculateLoadFactor(weight, volume, transport);
    basePrice *= loadFactor;

    // 7. Коэффициент популярности маршрута
    const routeFactor = this.getRouteFactor(fromCity, toCity);
    basePrice *= routeFactor;

    // 8. Тип груза
    const cargoFactor = this.getCargoFactor(cargoType);
    basePrice *= cargoFactor;

    // 9. Округляем до красивой цифры
    const finalPrice = Math.round(basePrice / 500) * 500;

    return {
      success: true,
      price: finalPrice,
      transport: transport.name,
      distance: distance,
      pricePerKm: Math.round(finalPrice / distance),
      deliveryTime: this.calculateDeliveryTime(distance),
      details: {
        weight,
        volume,
        density: Math.round(weight / volume),
        loadPercent: Math.round((weight / transport.maxWeight) * 100),
        volumePercent: Math.round((volume / transport.maxVolume) * 100)
      }
    };
  }

  // Проверка на один регион
  isSameRegion(city1, city2) {
    for (const [region, cities] of Object.entries(this.regions)) {
      const hasBoth = cities.includes(city1) && cities.includes(city2);
      if (hasBoth) return true;
    }
    return false;
  }

  // Выбор оптимального транспорта
  selectOptimalTransport(weight, volume) {
    // Считаем плотность груза
    const density = weight / volume;

    // Сортируем транспорт по вместимости для правильного выбора
    const sortedTransports = Object.values(this.transportTypes)
      .sort((a, b) => a.maxWeight - b.maxWeight);
    
    for (const transport of sortedTransports) {
      // Проверяем и по весу, и по объему
      if (weight <= transport.maxWeight && volume <= transport.maxVolume) {
        // Дополнительная проверка по плотности
        if (density <= transport.density * 1.2) {  // даем 20% запас
          return transport;
        }
      }
    }
    return null;
  }

  // Коэффициент загрузки
  calculateLoadFactor(weight, volume, transport) {
    const weightUsage = weight / transport.maxWeight;
    const volumeUsage = volume / transport.maxVolume;
    const maxUsage = Math.max(weightUsage, volumeUsage);

    // Чем меньше загрузка, тем дороже
    if (maxUsage < 0.3) return 1.5;   // менее 30% - дорого
    if (maxUsage < 0.5) return 1.3;   // менее 50%
    if (maxUsage < 0.7) return 1.1;   // менее 70%
    return 1.0;  // более 70% - базовая цена
  }

  // Коэффициент популярности маршрута
  getRouteFactor(from, to) {
    // Популярные направления
    const popularRoutes = [
      ['Москва', 'Санкт-Петербург'],
      ['Москва', 'Нижний Новгород'],
      ['Москва', 'Екатеринбург'],
      ['Москва', 'Казань']
    ];

    for (const route of popularRoutes) {
      if ((route.includes(from) && route.includes(to))) {
        return 0.9;  // скидка на популярные маршруты
      }
    }

    // Обратка дешевле
    if (to === 'Москва' || to === 'Санкт-Петербург') {
      return 0.95;
    }

    return 1.0;
  }

  // Коэффициент типа груза
  getCargoFactor(cargoType) {
    const factors = {
      'general': 1.0,      // обычный
      'fragile': 1.3,      // хрупкий
      'valuable': 1.5,     // ценный
      'dangerous': 1.8,    // опасный
      'perishable': 1.4,   // скоропортящийся
      'oversized': 1.6     // негабарит
    };
    return factors[cargoType] || 1.0;
  }

  // Расчет времени доставки
  calculateDeliveryTime(distance) {
    if (distance < 500) return '1-2 дня';
    if (distance < 1000) return '2-3 дня';
    if (distance < 2000) return '3-4 дня';
    if (distance < 3000) return '4-5 дней';
    return '5-7 дней';
  }

  // Расчет полной машины для внутрирегиональных
  calculateFullTruckPrice(from, to) {
    const distance = this.getDistance(from, to) || 50;
    const basePrice = 20000;  // минимум для фуры
    const kmPrice = distance < 50 ? 500 : 200;
    return Math.max(basePrice, distance * kmPrice);
  }

  // Получение расстояния (упрощенная версия)
  getDistance(from, to) {
    // Здесь должна быть интеграция с базой расстояний
    // Пока используем примерные значения
    const routes = {
      'Москва-Санкт-Петербург': 700,
      'Москва-Нижний Новгород': 400,
      'Москва-Екатеринбург': 1400,
      'Москва-Казань': 800,
      'Москва-Ростов-на-Дону': 1100,
      'Москва-Новосибирск': 3300
    };

    const routeKey = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    
    return routes[routeKey] || routes[reverseKey] || 500;
  }

  // ИНИЦИАЛИЗАЦИЯ UI
  init() {
    // Проверяем наличие элементов
    const form = document.getElementById('smart-calc-form');
    if (!form) {
      console.log('Калькулятор не найден на странице');
      return;
    }

    // Вешаем обработчики
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCalculation();
    });

    // Автозаполнение для демо
    this.setupAutocomplete();
    
    console.log('✅ Умный калькулятор v2.0 инициализирован!');
  }

  // Обработка расчета
  handleCalculation() {
    // Собираем данные
    const fromCity = document.getElementById('from-city')?.value || '';
    const toCity = document.getElementById('to-city')?.value || '';
    const weight = parseFloat(document.getElementById('weight')?.value || 0);
    const volume = parseFloat(document.getElementById('volume')?.value || 0);
    const cargoType = document.getElementById('cargo-type')?.value || 'general';

    // Валидация
    if (!fromCity || !toCity || !weight || !volume) {
      alert('Заполните все поля!');
      return;
    }

    // Расчет
    const result = this.calculatePrice(fromCity, toCity, weight, volume, cargoType);

    // Показываем результат
    this.showResult(result);
  }

  // Отображение результата
  showResult(result) {
    const resultDiv = document.getElementById('calc-result') || this.createResultDiv();
    
    if (result.error) {
      resultDiv.innerHTML = `
        <div class="alert alert-warning">
          <h4>⚠️ ${result.message}</h4>
          ${result.alternativePrice ? 
            `<p>Стоимость отдельной машины: <strong>${result.alternativePrice.toLocaleString()} ₽</strong></p>` : ''
          }
          <p>Позвоните нам для уточнения: <a href="tel:+79162720932">+7 (916) 272-09-32</a></p>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="calc-success">
          <h3>🎯 Расчет готов!</h3>
          
          <div class="price-block">
            <div class="price-main">
              <span class="price-label">Стоимость перевозки:</span>
              <span class="price-value">${result.price.toLocaleString()} ₽</span>
            </div>
            <div class="price-details">
              <p>📏 Расстояние: ${result.distance} км (${result.pricePerKm} ₽/км)</p>
              <p>🚛 Транспорт: ${result.transport}</p>
              <p>⏱️ Срок доставки: ${result.deliveryTime}</p>
            </div>
          </div>

          <div class="cargo-details">
            <h4>Параметры груза:</h4>
            <ul>
              <li>Вес: ${result.details.weight} кг (${result.details.loadPercent}% загрузки)</li>
              <li>Объем: ${result.details.volume} м³ (${result.details.volumePercent}% загрузки)</li>
              <li>Плотность: ${result.details.density} кг/м³</li>
            </ul>
          </div>

          <div class="cta-buttons">
            <button class="btn btn-primary" onclick="smartCalculatorV2.showLeadForm()">
              📝 Оставить заявку
            </button>
            <button class="btn btn-secondary" onclick="smartCalculatorV2.callManager()">
              📞 Позвонить менеджеру
            </button>
          </div>

          <div class="disclaimer">
            <p><small>* Это предварительный расчет. Окончательная стоимость может измениться в зависимости от дополнительных условий.</small></p>
          </div>
        </div>
      `;
    }

    // Скроллим к результату
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Создание div для результата
  createResultDiv() {
    const div = document.createElement('div');
    div.id = 'calc-result';
    div.className = 'calc-result-container';
    
    const form = document.getElementById('smart-calc-form');
    form.parentNode.insertBefore(div, form.nextSibling);
    
    return div;
  }

  // Показать форму сбора лидов
  showLeadForm() {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
      leadForm.style.display = 'block';
      leadForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Заполняем данные из калькулятора
      this.fillLeadFormData();
      
      // Добавляем обработчик отправки
      this.setupLeadFormHandler();
    }
  }

  // Заполнить форму данными из калькулятора
  fillLeadFormData() {
    const fromCity = document.getElementById('fromCity')?.value || '';
    const toCity = document.getElementById('toCity')?.value || '';
    const weight = document.getElementById('weight')?.value || '';
    const volume = document.getElementById('volume')?.value || '';
    const transport = document.getElementById('transport')?.value || '';
    
    const comment = document.getElementById('leadComment');
    if (comment) {
      comment.value = `Маршрут: ${fromCity} → ${toCity}\nВес: ${weight} кг\nОбъем: ${volume} м³\nТранспорт: ${transport}`;
    }
  }

  // Настройка обработчика формы лидов
  setupLeadFormHandler() {
    const form = document.getElementById('calculatorLeadForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLeadFormSubmit(e);
      });
    }
  }

  // Обработка отправки формы лидов
  handleLeadFormSubmit(e) {
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      comment: formData.get('comment'),
      timestamp: new Date().toISOString(),
      source: 'calculator'
    };

    // Показываем загрузку
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    // Отправляем данные (можно интегрировать с form-handler.js)
    this.sendLeadData(data)
      .then(() => {
        this.showLeadSuccess();
      })
      .catch((error) => {
        this.showLeadError(error);
      })
      .finally(() => {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      });
  }

  // Отправка данных лида
  async sendLeadData(data) {
    // Используем функцию из telegram-sender.js
    if (window.sendToTelegram) {
      return window.sendToTelegram(data, 'calculator');
    }
    
    // Если telegram-sender.js не загружен, логируем ошибку
    console.error('telegram-sender.js не загружен! Проверьте подключение скрипта.');
    
    return Promise.resolve();
  }

  // Показать успешную отправку
  showLeadSuccess() {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
      leadForm.innerHTML = `
        <div class="lead-success">
          <div class="success-icon">✅</div>
          <h3>Заявка отправлена!</h3>
          <p>Мы свяжемся с вами в течение 15 минут для уточнения деталей.</p>
          <button class="btn btn-primary" onclick="location.reload()">
            Рассчитать еще раз
          </button>
        </div>
      `;
    }
  }

  // Показать ошибку отправки
  showLeadError(error) {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
      leadForm.innerHTML = `
        <div class="lead-error">
          <div class="error-icon">❌</div>
          <h3>Ошибка отправки</h3>
          <p>Попробуйте позвонить нам напрямую: <a href="tel:+79162720932">+7 (916) 272-09-32</a></p>
          <button class="btn btn-primary" onclick="location.reload()">
            Попробовать снова
          </button>
        </div>
      `;
    }
  }

  // Кнопка оформить заказ (для совместимости)
  orderNow() {
    this.showLeadForm();
  }

  // Кнопка позвонить
  callManager() {
    window.location.href = 'tel:+79162720932';
  }

  // Автозаполнение городов
  setupAutocomplete() {
    // Список популярных городов
    const cities = [
      'Москва', 'Санкт-Петербург', 'Нижний Новгород', 'Екатеринбург',
      'Новосибирск', 'Казань', 'Челябинск', 'Самара', 'Омск',
      'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь'
    ];

    // Добавляем datalist
    const datalist = document.createElement('datalist');
    datalist.id = 'cities-list';
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      datalist.appendChild(option);
    });
    document.body.appendChild(datalist);

    // Привязываем к инпутам
    document.getElementById('from-city')?.setAttribute('list', 'cities-list');
    document.getElementById('to-city')?.setAttribute('list', 'cities-list');
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  window.smartCalculatorV2 = new SmartCalculatorV2();
  
  // Инициализация Exit-Intent Pop-up
  initExitIntentPopup();
});

// Exit-Intent Pop-up логика
function initExitIntentPopup() {
  let hasShownPopup = false;
  let mouseLeaveCount = 0;
  
  // Проверяем, показывали ли уже pop-up в этой сессии
  if (sessionStorage.getItem('exitPopupShown')) {
    return;
  }
  
  // Отслеживаем движение мыши
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !hasShownPopup && mouseLeaveCount === 0) {
      mouseLeaveCount++;
      setTimeout(() => {
        showExitPopup();
      }, 1000); // Задержка 1 секунда
    }
  });
  
  // Отслеживаем нажатие Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !hasShownPopup) {
      showExitPopup();
    }
  });
}

// Показать Exit-Intent Pop-up
function showExitPopup() {
  const popup = document.getElementById('exitIntentPopup');
  if (popup) {
    popup.classList.add('show');
    sessionStorage.setItem('exitPopupShown', 'true');
    
    // Настройка обработчика формы
    setupExitFormHandler();
  }
}

// Закрыть Exit-Intent Pop-up
function closeExitPopup() {
  const popup = document.getElementById('exitIntentPopup');
  if (popup) {
    popup.classList.remove('show');
  }
}

// Настройка обработчика формы Exit-Intent
function setupExitFormHandler() {
  const form = document.getElementById('exitLeadForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleExitFormSubmit(e);
    });
  }
}

// Обработка отправки формы Exit-Intent
function handleExitFormSubmit(e) {
  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    promoCode: 'WELCOME10',
    source: 'exit-intent-popup',
    timestamp: new Date().toISOString()
  };

  // Показываем загрузку
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Отправляем...';
  submitBtn.disabled = true;

  // Отправляем данные
  sendExitLeadData(data)
    .then(() => {
      showExitSuccess();
    })
    .catch((error) => {
      showExitError(error);
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
}

// Отправка данных Exit-Intent лида
async function sendExitLeadData(data) {
  // Добавляем промокод и источник к данным
  data.promoCode = 'WELCOME10';
  data.source = 'Exit-Intent Pop-up';
  
  // Используем функцию из telegram-sender.js
  if (window.sendToTelegram) {
    return window.sendToTelegram(data, 'exitIntent');
  }
  
  // Если telegram-sender.js не загружен, логируем ошибку
  console.error('telegram-sender.js не загружен! Проверьте подключение скрипта.');
  return Promise.resolve();
}

// Показать успешную отправку Exit-Intent
function showExitSuccess() {
  const popup = document.getElementById('exitIntentPopup');
  if (popup) {
    popup.innerHTML = `
      <div class="exit-popup-content">
        <div class="exit-popup-header">
          <h3>✅ Успешно!</h3>
          <button class="exit-popup-close" onclick="closeExitPopup()">×</button>
        </div>
        <div class="exit-popup-body">
          <div class="exit-popup-icon">🎉</div>
          <h4>Спасибо за заявку!</h4>
          <p>Мы свяжемся с вами в течение 15 минут и предоставим скидку 10% на первую перевозку.</p>
          <div class="exit-popup-footer">
            <small>Промокод: <strong>WELCOME10</strong></small>
          </div>
        </div>
      </div>
    `;
  }
}

// Показать ошибку отправки Exit-Intent
function showExitError(error) {
  const popup = document.getElementById('exitIntentPopup');
  if (popup) {
    popup.innerHTML = `
      <div class="exit-popup-content">
        <div class="exit-popup-header">
          <h3>❌ Ошибка</h3>
          <button class="exit-popup-close" onclick="closeExitPopup()">×</button>
        </div>
        <div class="exit-popup-body">
          <div class="exit-popup-icon">😔</div>
          <h4>Что-то пошло не так</h4>
          <p>Попробуйте позвонить нам напрямую: <a href="tel:+79162720932">+7 (916) 272-09-32</a></p>
          <p>Или напишите в WhatsApp: <a href="https://wa.me/79162720932">Написать</a></p>
        </div>
      </div>
    `;
  }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartCalculatorV2;
}