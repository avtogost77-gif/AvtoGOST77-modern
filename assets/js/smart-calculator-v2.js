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
  async calculatePrice(fromCity, toCity, weight, volume, cargoType = 'general') {
    console.log('🔄 calculatePrice called with:', { fromCity, toCity, weight, volume, cargoType });
    
    try {
      // 1. Проверка на внутрирегиональную перевозку
      if (this.isSameRegion(fromCity, toCity)) {
        console.log('⚠️ Same region detected');
        return {
          error: true,
          message: 'ВНИМАНИЕ! Сборные грузы только между регионами. Внутри региона - только отдельная машина!',
          alternativePrice: await this.calculateFullTruckPrice(fromCity, toCity)
        };
      }

      // 2. Получаем РЕАЛЬНОЕ расстояние через API
      console.log('📍 Getting distance...');
      const distance = await this.getDistance(fromCity, toCity);
      console.log('📏 Distance received:', distance, 'km');
      
      // 3. НОВАЯ ЛОГИКА РАЗДЕЛЕНИЯ
      if (distance < 200) {
        console.log('🏠 Local price calculation (< 200km)');
        // ЛОКАЛЬНЫЕ И ПЕРЕХОДНАЯ ЗОНА (до 200км)
        return this.calculateLocalPrice(fromCity, toCity, weight, volume, distance, cargoType);
      } else {
        console.log('🌍 Interregional price calculation (200km+)');
        // МЕЖРЕГИОНАЛЬНЫЕ ПЕРЕВОЗКИ (200км+)
        return this.calculateInterregionalPrice(fromCity, toCity, weight, volume, distance, cargoType);
      }
    } catch (error) {
      console.error('❌ Error in calculatePrice:', error);
      throw error;
    }
  }

  // ЛОКАЛЬНЫЕ ПЕРЕВОЗКИ - минималки + повышающие коэффициенты
  calculateLocalPrice(fromCity, toCity, weight, volume, distance, cargoType) {
    // Подбираем оптимальный транспорт
    const optimalTransport = this.selectOptimalTransport(weight, volume);
    const transport = this.transportTypes[optimalTransport];

    // БАЗОВАЯ ЦЕНА = минималка транспорта
    let basePrice = transport.minPrice;
    
    // ПОВЫШАЮЩИЕ КОЭФФИЦИЕНТЫ ПО РАССТОЯНИЮ
    let distanceCoeff = 1.0;
    let priceCategory = '';
    
    if (distance <= 70) {
      distanceCoeff = 1.0;  // Без повышения
      priceCategory = 'Локальная доставка';
    } else if (distance <= 100) {
      distanceCoeff = 1.15; // +15%
      priceCategory = 'Ближняя зона (+15%)';
    } else if (distance <= 150) {
      distanceCoeff = 1.30; // +30%
      priceCategory = 'Средняя зона (+30%)';
    } else {
      distanceCoeff = 1.45; // +45%
      priceCategory = 'Дальняя зона (+45%)';
    }
    
    // Применяем коэффициент расстояния
    basePrice = basePrice * distanceCoeff;
    
    // Коэффициент загрузки (чем меньше груз, тем дороже)
    const loadFactor = this.calculateLoadFactor(weight, volume, transport);
    
    // КОЭФФИЦИЕНТ ТИПА ТС (от фуры вниз)
    const transportCoeff = transport.coefficient;
    
    // Финальная цена
    const finalPrice = Math.round(basePrice * loadFactor * transportCoeff);

    return {
      price: finalPrice,
      transport: transport.name,
      distance: distance,
      deliveryType: priceCategory,
      pricePerKm: Math.round(finalPrice / distance),
      deliveryTime: distance <= 100 ? '1 день' : '1-2 дня',
      details: {
        basePrice: transport.minPrice,
        distanceCoeff: distanceCoeff,
        loadFactor: loadFactor,
        transportCoeff: transportCoeff,
        weight: weight,
        volume: volume,
        loadPercent: Math.round((weight / transport.maxWeight) * 100),
        volumePercent: volume ? Math.round((volume / transport.maxVolume) * 100) : 0,
        density: volume ? Math.round(weight / volume) : 0,
        isLocal: true,
        noConsolidated: true // Сборные недоступны
      }
    };
  }

  // МЕЖРЕГИОНАЛЬНЫЕ ПЕРЕВОЗКИ - система плеч + сборные
  calculateInterregionalPrice(fromCity, toCity, weight, volume, distance, cargoType) {
    // СИСТЕМА ТАРИФИКАЦИИ ПО ПЛЕЧАМ (только для межрегиональных 200+км!)
    let pricePerKm;
    let distanceCategory;
    
    if (distance < 300) {
      // КОРОТКОЕ ПЛЕЧО - высокий тариф за км
      pricePerKm = 180;
      distanceCategory = 'Короткое плечо (200-300км)';
    } else if (distance < 800) {
      // СРЕДНЕЕ ПЛЕЧО - оптимальный тариф
      pricePerKm = 120;
      distanceCategory = 'Среднее плечо (300-800км)';
    } else {
      // ДЛИННОЕ ПЛЕЧО - экономный тариф
      pricePerKm = 85;
      distanceCategory = 'Длинное плечо (800+км)';
    }

    // Базовая цена = расстояние × тариф
    let basePrice = distance * pricePerKm;

    // Подбираем оптимальный транспорт
    const optimalTransport = this.selectOptimalTransport(weight, volume);
    const transport = this.transportTypes[optimalTransport];

    // Применяем минималку для выбранного транспорта
    const minPrice = transport.minPriceRegion;
    basePrice = Math.max(basePrice, minPrice);

    // СБОРНЫЕ ГРУЗЫ (только для межрегиональных!)
    const isConsolidated = cargoType === 'сборный' || cargoType === 'consolidated';
    if (isConsolidated) {
      basePrice = basePrice * 0.65; // Сборный груз дешевле на 35%!
    }

    // Коэффициенты нагрузки и маршрута
    const loadFactor = this.calculateLoadFactor(weight, volume, transport);
    const routeFactor = this.calculateRouteFactor(fromCity, toCity);
    const cargoFactor = this.getCargoFactor(cargoType);
    
    console.log('📊 Коэффициенты:', {
      loadFactor,
      routeFactor,
      cargoFactor,
      transportCoeff: transport.coefficient,
      basePrice,
      minPrice
    });

    // КОЭФФИЦИЕНТ ТИПА ТС (от фуры вниз)
    const transportCoeff = transport.coefficient;

    // Финальная цена
    const finalPrice = Math.round(basePrice * loadFactor * routeFactor * cargoFactor * transportCoeff);

    return {
      price: finalPrice,
      transport: transport.name,
      distance: distance,
      deliveryType: distanceCategory,
      pricePerKm: Math.round(finalPrice / distance),
      deliveryTime: this.calculateDeliveryTime(distance),
      details: {
        basePrice: basePrice,
        minPrice: minPrice,
        pricePerKm: pricePerKm,
        loadFactor: loadFactor,
        routeFactor: routeFactor,
        cargoFactor: cargoFactor,
        weight: weight,
        volume: volume,
        loadPercent: Math.round((weight / transport.maxWeight) * 100),
        volumePercent: volume ? Math.round((volume / transport.maxVolume) * 100) : 0,
        density: volume ? Math.round(weight / volume) : 0,
        isLocal: false,
        isConsolidated: isConsolidated
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

  // Подбор оптимального транспорта по весу и объему
  selectOptimalTransport(weight, volume) {
    // Сортируем транспорт по грузоподъемности (от меньшего к большему)
    const sortedTransports = Object.entries(this.transportTypes)
      .sort((a, b) => a[1].maxWeight - b[1].maxWeight);

    for (const [key, transport] of sortedTransports) {
      if (weight <= transport.maxWeight) {
        if (volume && volume > 0) {
          const density = weight / volume;
          if (volume <= transport.maxVolume && density <= transport.density * 1.2) {
            return key; // Возвращаем ключ транспорта
          }
        } else {
          // Если объем не указан, выбираем по весу
          return key;
        }
      }
    }
    
    // Если ничего не подошло - возвращаем фуру
    return 'truck';
  }

  // Коэффициент загрузки
  calculateLoadFactor(weight, volume, transport) {
    const weightUsage = weight / transport.maxWeight;
    
    // Если объем указан, учитываем его
    if (volume && volume > 0) {
      const volumeUsage = volume / transport.maxVolume;
      
      // ПРАВИЛЬНАЯ ЛОГИКА: берем тот параметр, который БОЛЬШЕ загружает машину
      // Это определяет какой параметр лимитирует (вес или объем)
      const limitingUsage = Math.max(weightUsage, volumeUsage);
      
      console.log('🔢 Load calculation:', {
        weight,
        volume,
        transport: transport.name,
        weightUsage: Math.round(weightUsage * 100) + '%',
        volumeUsage: Math.round(volumeUsage * 100) + '%',
        limitingUsage: Math.round(limitingUsage * 100) + '%'
      });
      
      // Если перегруз по любому параметру - доплата
      if (limitingUsage > 1.0) {
        return 1.0 + (limitingUsage - 1.0) * 0.3; // доплата за перегруз
      }
      
      // Чем ВЫШЕ загрузка, тем ДЕШЕВЛЕ (эффективнее)
      if (limitingUsage > 0.8) return 1.0;   // 80%+ - базовая цена
      if (limitingUsage > 0.6) return 1.1;   // 60-80% - небольшая доплата
      if (limitingUsage > 0.4) return 1.25;  // 40-60% - средняя доплата
      if (limitingUsage > 0.2) return 1.4;   // 20-40% - большая доплата
      return 1.6;  // менее 20% - максимальная доплата
    } else {
      // Если объем не указан, считаем только по весу
      if (weightUsage > 1.0) return 1.0 + (weightUsage - 1.0) * 0.3; // перегруз
      if (weightUsage > 0.8) return 1.0;   // 80%+ - базовая цена
      if (weightUsage > 0.6) return 1.1;   // 60-80%
      if (weightUsage > 0.4) return 1.2;   // 40-60%
      if (weightUsage > 0.2) return 1.35;  // 20-40%
      return 1.5;  // менее 20% - максимальная доплата
    }
  }

  // Коэффициент популярности маршрута
  calculateRouteFactor(from, to) {
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
  async calculateFullTruckPrice(from, to) {
    const distance = await this.getDistance(from, to) || 50;
    const basePrice = 20000;  // минимум для фуры
    const kmPrice = distance < 50 ? 500 : 200;
    return Math.max(basePrice, distance * kmPrice);
  }

  // Получение расстояния через API (реальные данные!)
  async getDistance(from, to) {
    try {
      // Сначала пробуем статическую базу для быстрого ответа
      const staticRoutes = {
        // ОСНОВНЫЕ МЕЖРЕГИОНАЛЬНЫЕ МАРШРУТЫ
        'Москва-Санкт-Петербург': 700,
        'Москва-Нижний Новгород': 400,
        'Москва-Екатеринбург': 1400,
        'Москва-Казань': 800,
        'Москва-Ростов-на-Дону': 1100,
        'Москва-Новосибирск': 3300,
        'Москва-Краснодар': 1200,
        'Москва-Тюмень': 2100,
        'Москва-Воронеж': 500,
        'Москва-Самара': 1000,
        'Москва-Уфа': 1200,
        'Москва-Челябинск': 1800,
        'Москва-Пермь': 1400,
        'Москва-Волгоград': 900,
        'СПб-Екатеринбург': 1800,
        'СПб-Казань': 1200,
        'СПб-Нижний Новгород': 1000,
        
        // WB СКЛАДЫ - МОСКОВСКИЙ РЕГИОН
        'Москва-Коледино': 25,
        'Москва-Подольск': 40,
        'Москва-Белые Столбы': 50,
        'Москва-Радумля': 60,
        'Москва-Пушкино': 35,
        'Москва-Вёшки': 30,
        'Москва-Чехов': 55,
        'Москва-Обухово': 45,
        'Москва-Сынково': 50,
        
        // РЕГИОНАЛЬНЫЕ МАРШРУТЫ
        'Москва-Тверь': 170,
        'Москва-Тула': 190,
        'Москва-Рязань': 180,
        'Москва-Калуга': 160,
        'Москва-Смоленск': 400,
        'Москва-Ярославль': 260,
        'Москва-Владимир': 190
      };

      const routeKey = `${from}-${to}`;
      const reverseKey = `${to}-${from}`;
      
      // Проверяем статическую базу
      const staticDistance = staticRoutes[routeKey] || staticRoutes[reverseKey];
      if (staticDistance) {
        return staticDistance;
      }

      // Если нет в статической базе - используем API
      console.log(`🔍 Запрашиваю расстояние через API: ${from} → ${to}`);
      
      // Используем бесплатный API автодиспетчер.ру
      const response = await fetch(`https://www.avtodispetcher.ru/distance/api/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&format=json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.distance && data.distance > 0) {
          console.log(`✅ Получено расстояние через API: ${data.distance} км`);
          return Math.round(data.distance);
        }
      }

      // Fallback - используем примерное расстояние
      console.log(`⚠️ API недоступен, используем примерное расстояние для ${from}-${to}`);
      return this.calculateApproximateDistance(from, to);

    } catch (error) {
      console.log(`❌ Ошибка API расстояний: ${error.message}`);
      return this.calculateApproximateDistance(from, to);
    }
  }

  // Примерное расстояние по регионам (fallback)
  calculateApproximateDistance(from, to) {
    // Примерные расстояния по федеральным округам
    const regionDistances = {
      'Москва': { 'СПб': 700, 'Екатеринбург': 1400, 'Казань': 800, 'Краснодар': 1200 },
      'СПб': { 'Москва': 700, 'Екатеринбург': 1800, 'Казань': 1200 },
      'Екатеринбург': { 'Москва': 1400, 'СПб': 1800, 'Новосибирск': 1800 },
      'Казань': { 'Москва': 800, 'СПб': 1200, 'Екатеринбург': 1000 },
      'Краснодар': { 'Москва': 1200, 'Ростов-на-Дону': 300 },
      'Новосибирск': { 'Москва': 3300, 'Екатеринбург': 1800 }
    };

    // Нормализуем названия городов
    const normalizeCity = (city) => {
      if (city.includes('Санкт-Петербург') || city.includes('СПб')) return 'СПб';
      if (city.includes('Москв')) return 'Москва';
      if (city.includes('Екатеринбург')) return 'Екатеринбург';
      if (city.includes('Казан')) return 'Казань';
      if (city.includes('Краснодар')) return 'Краснодар';
      if (city.includes('Новосибирск')) return 'Новосибирск';
      return city;
    };

    const fromNorm = normalizeCity(from);
    const toNorm = normalizeCity(to);

    if (regionDistances[fromNorm] && regionDistances[fromNorm][toNorm]) {
      return regionDistances[fromNorm][toNorm];
    }

    // Если ничего не найдено - возвращаем среднее расстояние
    return 500;
  }

  // ИНИЦИАЛИЗАЦИЯ UI
  init() {
    // Проверяем наличие элементов
    const form = document.getElementById('calculatorForm');
    if (!form) {
      return;
    }

    // Автозаполнение для демо
    this.setupAutocomplete();
  }

  // Обработка расчета
  handleCalculation() {
    console.log('🧮 Starting handleCalculation method...');
    
    // Собираем данные
    const fromCity = document.getElementById('fromCity')?.value || '';
    const toCity = document.getElementById('toCity')?.value || '';
    const weight = parseFloat(document.getElementById('weight')?.value || 0);
    const volume = parseFloat(document.getElementById('volume')?.value || 0);
    const transport = document.getElementById('transport')?.value || 'gazelle';

    console.log('📊 Form data:', {
      fromCity,
      toCity, 
      weight,
      volume,
      transport
    });

    // Валидация
    if (!fromCity || !toCity || !weight) {
      console.log('❌ Validation failed - missing required fields');
      alert('Заполните города и вес груза!');
      return;
    }
    
    // Объем не обязательный, но учитывается если заполнен
    if (volume && volume <= 0) {
      console.log('❌ Validation failed - invalid volume');
      alert('Объем должен быть больше 0!');
      return;
    }

    console.log('✅ Validation passed, starting calculation...');

    // Расчет
    this.calculatePrice(fromCity, toCity, weight, volume, 'general')
      .then(result => {
        console.log('✅ Calculation completed:', result);
        this.showResult(result);
      })
      .catch(error => {
        console.error('❌ Calculation error:', error);
        alert('Ошибка расчёта: ' + error.message);
      });
  }

  // Отображение результата
  showResult(result) {
    console.log('📋 showResult called with:', result);
    const resultDiv = document.getElementById('calculatorResult') || this.createResultDiv();
    console.log('📋 resultDiv found/created:', resultDiv);
    
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
              <p>📏 Расстояние: ${result.distance} км (${result.deliveryType})</p>
              <p>💰 Тариф: ${result.pricePerKm} ₽/км</p>
              <p>🚛 Транспорт: ${result.transport}</p>
              <p>⏱️ Срок доставки: ${result.deliveryTime}</p>
            </div>
          </div>

          <div class="cargo-details">
            <h4>Параметры груза:</h4>
            <ul>
              <li>Вес: ${result.details.weight} кг (${result.details.loadPercent}% загрузки)</li>
              ${result.details.volume ? 
                `<li>Объем: ${result.details.volume} м³ (${result.details.volumePercent}% загрузки)</li>
                 <li>Плотность: ${result.details.density} кг/м³</li>` : 
                '<li>Объем: не указан</li>'
              }
              ${result.details.isLocal ? 
                `<li><span class="badge badge-info">Локальная зона</span> - только отдельная машина</li>
                 ${result.details.distanceCoeff > 1 ? 
                   `<li><span class="badge badge-warning">Повышающий коэфф. ×${result.details.distanceCoeff}</span></li>` : 
                   '<li>Базовый тариф без повышения</li>'
                 }
                 <li><span class="badge badge-danger">Сборные грузы недоступны</span></li>` :
                `<li><span class="badge badge-success">Межрегиональная</span> доставка</li>
                 <li>Тариф: ${result.details.pricePerKm} ₽/км</li>
                 ${result.details.isConsolidated ? 
                   '<li><span class="badge badge-warning">Сборный груз</span> - экономия 35%!</li>' : 
                   '<li>Отдельная машина</li>'
                 }`
              }
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
    console.log('📋 Scrolling to result and making visible');
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    console.log('✅ Result displayed successfully');
  }

  // Создание div для результата
  createResultDiv() {
    console.log('🔧 Creating new result div...');
    const div = document.createElement('div');
    div.id = 'calculatorResult';
    div.className = 'calculator-result';
    
    const form = document.getElementById('calculatorForm');
    console.log('🔧 Calculator form found:', form);
    if (form) {
      form.parentNode.insertBefore(div, form.nextSibling);
      console.log('🔧 Result div inserted after form');
    } else {
      // Fallback - добавляем в конец калькулятора
      const calcSection = document.querySelector('.calculator-section, #calculator');
      if (calcSection) {
        calcSection.appendChild(div);
        console.log('🔧 Result div added to calculator section');
      }
    }
    
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
    
    // Интеграция с father_bot.py через Telegram
    const promoCode = document.getElementById('promoCode')?.textContent || 'GOST10';
    const message = `🎯 Новая заявка с калькулятора:\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}\n📧 Email: ${data.email}\n💬 Комментарий: ${data.comment}\n🎁 Промокод: ${promoCode}\n⏰ Источник: форма лидов`;
    
    // Отправляем в father_bot для обработки менеджером
    window.open(`https://t.me/father_bot?start=${encodeURIComponent(message)}`, '_blank');
    
    // Логируем только статус (без данных)
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
    // Используем новую базу городов из cities-simple.js
    if (typeof POPULAR_CITIES !== 'undefined') {
      // Добавляем datalist с полной базой
      const datalist = document.createElement('datalist');
      datalist.id = 'cities-list';
      POPULAR_CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
      });
      document.body.appendChild(datalist);

      // Привязываем к инпутам
      document.getElementById('fromCity')?.setAttribute('list', 'cities-list');
      document.getElementById('toCity')?.setAttribute('list', 'cities-list');
    } else {
      // Fallback на старую базу если cities-simple.js не загружен
      const cities = [
        'Москва', 'Санкт-Петербург', 'Нижний Новгород', 'Екатеринбург',
        'Новосибирск', 'Казань', 'Челябинск', 'Самара', 'Омск',
        'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь'
      ];

      const datalist = document.createElement('datalist');
      datalist.id = 'cities-list';
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
      });
      document.body.appendChild(datalist);

      document.getElementById('fromCity')?.setAttribute('list', 'cities-list');
      document.getElementById('toCity')?.setAttribute('list', 'cities-list');
    }
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  window.smartCalculatorV2 = new SmartCalculatorV2();
  
  // Инициализация Exit-Intent Pop-up
  initExitIntentPopup();
  
  // Инициализация Sticky Header
  initStickyHeader();
  
  // Инициализация промокода и таймера
  initPromoTimer();
  
  // Запускаем обновление таймера
  updatePromoTimer();
  
  // Инициализация валидации согласия на обработку ПД
  initPrivacyConsent();
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
  
  // Если telegram-sender.js не загружен, отправляем напрямую
  try {
    const botToken = '7999458907:AAGOAjQLmEZuT4SFx4Upl1GjuXO0yFuWok8';
    const chatId = '399711407';
    
    const message = `🎁 Новая заявка с exit-intent:\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}\n📧 Email: ${data.email}\n🎁 Промокод: ${data.promoCode}\n⏰ Источник: ${data.source}`;
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    
    if (response.ok) {
  
      return Promise.resolve();
    }
  } catch (error) {
    console.error('❌ Ошибка отправки exit-intent заявки');
  }
  
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

// Sticky Header логика
function initStickyHeader() {
  let lastScrollTop = 0;
  const stickyHeader = document.getElementById('stickyHeader');
  const header = document.getElementById('header');

  if (stickyHeader && header) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const headerHeight = header.offsetHeight;

      // Показываем sticky header после прокрутки за основной header
      if (scrollTop > headerHeight && scrollTop > lastScrollTop) {
        stickyHeader.classList.add('visible');
      } else if (scrollTop <= headerHeight || scrollTop < lastScrollTop) {
        stickyHeader.classList.remove('visible');
      }
    });
  }
}

// Промокод и таймер логика
function initPromoTimer() {
  let timeLeft = 15 * 60; // 15 минут в секундах
  const timerMinutes = document.getElementById('timerMinutes');
  const timerSeconds = document.getElementById('timerSeconds');
  const promoSection = document.querySelector('.promo-section');

  if (!timerMinutes || !timerSeconds) {

    return;
  }

  const timer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerMinutes.textContent = minutes.toString().padStart(2, '0');
    timerSeconds.textContent = seconds.toString().padStart(2, '0');

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      hidePromoTimer();
    }
  }, 1000);
}

// Скрыть таймер промокода
function hidePromoTimer() {
  const promoSection = document.querySelector('.promo-section');
  if (promoSection) {
    promoSection.style.display = 'none';
  }
}

// Обновить таймер промокода
function updatePromoTimer() {
  const timerMinutes = document.getElementById('timerMinutes');
  const timerSeconds = document.getElementById('timerSeconds');
  
  if (timerMinutes && timerSeconds) {
    // Проверяем сохраненное время в localStorage
    const savedTime = localStorage.getItem('promoTimerEnd');
    if (savedTime) {
      const endTime = parseInt(savedTime);
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      
      if (timeLeft > 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerMinutes.textContent = minutes.toString().padStart(2, '0');
        timerSeconds.textContent = seconds.toString().padStart(2, '0');
        
        // Запускаем таймер
        setTimeout(updatePromoTimer, 1000);
      } else {
        hidePromoTimer();
      }
    }
  }
}

// Валидация согласия на обработку персональных данных
function initPrivacyConsent() {
  const consentCheckbox = document.getElementById('privacyConsent');
  const submitBtn = document.getElementById('leadSubmitBtn') || document.getElementById('contactSubmitBtn');
  
  if (consentCheckbox && submitBtn) {
    // Проверяем состояние чекбокса при загрузке
    submitBtn.disabled = !consentCheckbox.checked;
    
    // Слушаем изменения чекбокса
    consentCheckbox.addEventListener('change', function() {
      submitBtn.disabled = !this.checked;
      
      if (this.checked) {
        submitBtn.classList.remove('btn-disabled');
        submitBtn.classList.add('btn-primary');
      } else {
        submitBtn.classList.add('btn-disabled');
        submitBtn.classList.remove('btn-primary');
      }
    });
  }
}
