/* ===== CALCULATOR BUNDLE ДЛЯ AVTOGOST77 ===== */
/* Для страниц с калькулятором */

// === SMART CALCULATOR V2 ===
// ========================================================
// 🚛 УМНЫЙ КАЛЬКУЛЯТОР АВТОГОСТ V2.0 - ЛОГИКА ИЛЮШИ
// Основано на реальных данных из CALCULATOR-LOGIC.md
// ========================================================

class SmartCalculatorV2 {
  constructor() {
    // Инициализируем API для реальных расстояний
    this.distanceAPI = new DistanceAPI();
    
    // ТИПЫ ТРАНСПОРТА с реальными параметрами от Илюши
    this.transportTypes = {
      gazelle: {
        name: 'Газель',
        maxWeight: 1500,    // кг (исправлено!)
        maxVolume: 16,      // м³
        density: 94,        // кг/м³ (1500/16)
        minPrice: 10000,    // минимальная цена Москва
        minPriceRegion: 7500, // минималка в регионах
        coefficient: 1.0,   // ГАЗЕЛЬ базовая (было 0.8)
        allowConsolidated: true,
        icon: '🚐'
      },
      threeTon: {
        name: '3-тонник',
        maxWeight: 3000,
        maxVolume: 18,
        density: 167,
        minPrice: 13000,
        minPriceRegion: 9750,
        coefficient: 1.0,   // ТРЕШКА 25к (базовая цена 25₽/км)
        allowConsolidated: true,
        icon: '🚛'
      },
      fiveTon: {
        name: '5-тонник',
        maxWeight: 5000,
        maxVolume: 36,
        density: 139,
        minPrice: 20000,
        minPriceRegion: 15000,
        coefficient: 1.05,  // ПЯТАК ~50к (было 1.88)
        allowConsolidated: true,
        icon: '🚛'
      },
      tenTon: {
        name: '10-тонник',
        maxWeight: 10000,
        maxVolume: 50,
        density: 200,
        minPrice: 24000,
        minPriceRegion: 18000,
        coefficient: 1.08,  // ДЕСЯТКА ~63к (было 1.84)
        allowConsolidated: true,
        icon: '🚚'
      },
      truck: {
        name: 'Фура 20т',
        maxWeight: 20000,
        maxVolume: 82,     // м³ (минимум из диапазона 82-92)
        density: 244,       // кг/м³ (20000/82)
        minPrice: 28000,
        minPriceRegion: 21000,
        coefficient: 0.95,  // ФУРА экономия масштаба ~70к (было 1.68)
        allowConsolidated: false, // ФУРА НЕ СБОРНЫЙ!
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
    
    // ВАЖНО: Очищаем кеш результатов перед новым расчетом
    // Это предотвращает "залипание" результатов
    
    try {
      // 1. Проверка на внутрирегиональную перевозку
      if (this.isSameRegion(fromCity, toCity)) {
        return {
          error: true,
          message: 'ВНИМАНИЕ! Сборные грузы только между регионами. Внутри региона - только отдельная машина!',
          alternativePrice: await this.calculateFullTruckPrice(fromCity, toCity)
        };
      }

      // 2. Получаем РЕАЛЬНОЕ расстояние через API  
      const distance = await this.distanceAPI.getDistance(fromCity, toCity);
      
      // 3. НОВАЯ ЛОГИКА РАЗДЕЛЕНИЯ
      if (distance < 200) {
        // ЛОКАЛЬНЫЕ И ПЕРЕХОДНАЯ ЗОНА (до 200км)
        return this.calculateLocalPrice(fromCity, toCity, weight, volume, distance, cargoType);
      } else {
        // МЕЖРЕГИОНАЛЬНЫЕ ПЕРЕВОЗКИ (200км+)
        return this.calculateInterregionalPrice(fromCity, toCity, weight, volume, distance, cargoType);
      }
    } catch (error) {
      throw error;
    }
  }

  // ЛОКАЛЬНЫЕ ПЕРЕВОЗКИ - плавный переход от городских к региональным
  calculateLocalPrice(fromCity, toCity, weight, volume, distance, cargoType) {
    // Подбираем оптимальный транспорт
    const optimalTransport = this.selectOptimalTransport(weight, volume);
    const transport = this.transportTypes[optimalTransport];
    
    // Проверяем сборный груз для выбранного транспорта
    const isConsolidated = (cargoType === 'сборный' || cargoType === 'consolidated') && transport.allowConsolidated;

    let basePrice;
    let priceCategory = '';
    
    if (distance <= 70) {
      // ГОРОДСКАЯ БАЗА - минималки транспорта
      basePrice = transport.minPrice;
      priceCategory = 'Городская доставка (до 70км)';
    } else {
      // ПЕРЕХОДНАЯ ЗОНА - база + динамическая доплата за км по типу ТС
      const excessKm = distance - 70; // км свыше 70
      
      // ДИНАМИЧЕСКИЕ ТАРИФЫ ПО ТИПАМ ТС (чем больше машина, тем дороже км)
      const kmRates = {
        gazelle: 20,   // 20₽/км для газели
        threeTon: 25,  // 25₽/км для 3-тонника
        fiveTon: 35,   // 35₽/км для 5-тонника  
        tenTon: 45,    // 45₽/км для 10-тонника
        truck: 60      // 60₽/км для фуры
      };
      
      const kmRate = kmRates[optimalTransport] || 25; // fallback
      const extraCost = excessKm * kmRate;
      
      basePrice = transport.minPrice + extraCost;
      priceCategory = `Переходная зона (${distance}км, +${excessKm}км × ${kmRate}₽)`;
    }
    
    // Коэффициент загрузки (чем меньше груз, тем дороже)
    const loadFactor = this.calculateLoadFactor(weight, volume, transport);
    
    // ДЛЯ ЛОКАЛЬНЫХ - НЕТ коэффициента типа ТС (фиксированные цены)
    // Финальная цена
    const finalPrice = Math.round(basePrice * loadFactor);

    return {
      price: finalPrice,
      transport: transport.name,
      distance: distance,
      deliveryType: priceCategory,
      pricePerKm: Math.round(finalPrice / distance),
      deliveryTime: distance <= 100 ? '1 день' : '1-2 дня',
      details: {
        basePrice: transport.minPrice,
        distanceCoeff: loadFactor, // ИСПРАВЛЕНО: показываем реальный коэффициент загрузки
        loadFactor: loadFactor,
        transportCoeff: 1.0, // Для локальных доставок всегда 1.0
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

  // МЕЖРЕГИОНАЛЬНЫЕ ПЕРЕВОЗКИ - комбинированная система
  calculateInterregionalPrice(fromCity, toCity, weight, volume, distance, cargoType) {
    // НОВАЯ КОМБИНИРОВАННАЯ СИСТЕМА: База = расстояние × тариф, НО не менее минималки ТС
    let pricePerKm;
    let distanceCategory;
    
    if (distance < 200) {
      // БЛИЖНИЙ ПОДМОСКОВНЫЙ - самый высокий тариф
      pricePerKm = 35;
      distanceCategory = 'Ближний (до 200км)';
    } else if (distance < 300) {
      // БЛИЗКИЙ РЕГИОНАЛЬНЫЙ - высокий тариф (Ярославль, Тула)
      pricePerKm = 28;
      distanceCategory = 'Близкий (200-300км)';
    } else if (distance < 500) {
      // СРЕДНИЙ РЕГИОНАЛЬНЫЙ - средний тариф (Воронеж, Нижний)
      pricePerKm = 22;
      distanceCategory = 'Средний (300-500км)';
    } else if (distance < 800) {
      // ДАЛЬНИЙ МЕЖРЕГИОНАЛЬНЫЙ - экономичный (Саранск, Казань)
      pricePerKm = 18;
      distanceCategory = 'Дальний (500-800км)';
    } else if (distance < 1000) {
      // ДАЛЬНОБОЙНЫЙ - экономичный (СПб, Екатеринбург)
      pricePerKm = 15;
      distanceCategory = 'Дальнобойный (800-1000км)';
    } else {
      // СВЕРХДАЛЬНИЙ - специальный тариф для очень длинных маршрутов
      pricePerKm = 18; // Повышаем тариф для очень длинных маршрутов
      distanceCategory = 'Сверхдальний (1000км+)';
    }

    // Подбираем оптимальный транспорт
    const optimalTransport = this.selectOptimalTransport(weight, volume);
    const transport = this.transportTypes[optimalTransport];

    // КОМБИНИРОВАННАЯ ЛОГИКА: База = расстояние × тариф
    let basePrice = distance * pricePerKm;

    // ЖЕСТКИЕ МИНИМАЛКИ ПО ТИПАМ ТС только для коротких плеч (до 200км)
    const transportMinPrices = {
      gazelle: distance < 200 ? 20000 : transport.minPriceRegion,
      threeTon: distance < 200 ? 25000 : transport.minPriceRegion,
      fiveTon: distance < 200 ? 30000 : transport.minPriceRegion,
      tenTon: distance < 200 ? 37000 : transport.minPriceRegion,
      truck: distance < 200 ? 42000 : transport.minPriceRegion
    };

    // Применяем минималку для выбранного транспорта
    const minPrice = transportMinPrices[optimalTransport];
    basePrice = Math.max(basePrice, minPrice);

    // ДОБАВЛЯЕМ ₽/КМ ДОПЛАТЫ ПО ТИПУ ТС К МЕЖРЕГИОНАЛЬНЫМ
    const interregionalKmRates = {
      gazelle: 30,   // 30₽/км для газели
      threeTon: 40,  // 40₽/км для 3-тонника
      fiveTon: 50,   // 50₽/км для 5-тонника  
      tenTon: 62,    // 62₽/км для 10-тонника
      truck: 70      // 70₽/км для фуры
    };
    
    const kmRate = interregionalKmRates[optimalTransport] || 15;
    const kmSurcharge = distance * kmRate;

    // СБОРНЫЕ ГРУЗЫ (только для межрегиональных и НЕ для фур!)
    const isConsolidated = (cargoType === 'сборный' || cargoType === 'consolidated') && transport.allowConsolidated;

    // Для сборных: не добавляем доплату по типу ТС (kmSurcharge), только базовый тариф по расстоянию и минималка
    if (!isConsolidated) {
      basePrice += kmSurcharge;
    }
    
    if (isConsolidated) {
      // ИСПРАВЛЕНО: Сборный груз дешевле, но не менее разумной минималки
      const consolidatedPrice = basePrice * 0.65; // Скидка 35%
      const minConsolidatedPrice = transport.minPriceRegion * 0.8; // Минимум 80% от минималки ТС
      basePrice = Math.max(consolidatedPrice, minConsolidatedPrice);
    }

    // Коэффициенты нагрузки и маршрута
    const loadFactor = this.calculateLoadFactor(weight, volume, transport);
    const routeFactor = this.calculateRouteFactor(fromCity, toCity);
    const cargoFactor = this.getCargoFactor(cargoType);

    // КОЭФФИЦИЕНТ ЗОНЫ ДОСТАВКИ (вместо коэффициента ТС)
    let zoneCoeff;
    if (distance < 70) {
      zoneCoeff = 1.6;  // Городские - самый высокий коэфф
    } else if (distance < 200) {
      zoneCoeff = 1.4;  // Областные - высокий коэфф
    } else if (distance < 400) {
      zoneCoeff = 1.3;  // Межрегиональные - повышенный коэфф
    } else if (distance < 800) {
      zoneCoeff = 1.1;  // Среднее плечо - небольшая надбавка
    } else if (distance < 1000) {
      zoneCoeff = 1.0;  // Длинное плечо - базовый коэфф
    } else {
      zoneCoeff = 1.05; // Сверхдальние маршруты - небольшая надбавка
    }
    
    const transportCoeff = zoneCoeff; // Используем зональный коэффициент

    // Финальная цена
    const finalPrice = Math.round(basePrice * loadFactor * routeFactor * cargoFactor * transportCoeff);

    return {
      price: finalPrice,
      transport: transport.name,
      distance: distance,
      deliveryType: distanceCategory,
      pricePerKm: Math.round(finalPrice / distance),
      deliveryTime: this.calculateDeliveryTime(distance, isConsolidated),
      details: {
        basePrice: basePrice,
        minPrice: minPrice,
        pricePerKm: pricePerKm,
        distanceCoeff: loadFactor, // ИСПРАВЛЕНО: показываем реальный коэффициент загрузки как distanceCoeff
        loadFactor: loadFactor,
        routeFactor: routeFactor,
        cargoFactor: cargoFactor,
        transportCoeff: transportCoeff,
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
          // Проверяем только объем, плотность не критична
          if (volume <= transport.maxVolume) {
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
  calculateDeliveryTime(distance, isConsolidated = false) {
    let baseTime;
    if (distance < 500) baseTime = '1-2 дня';
    else if (distance < 1000) baseTime = '2-3 дня';
    else if (distance < 2000) baseTime = '3-4 дня';
    else if (distance < 3000) baseTime = '4-5 дней';
    else baseTime = '5-7 дней';
    
    // Сборный груз +30% к времени
    if (isConsolidated) {
      const timeMap = {
        '1-2 дня': '2-3 дня',
        '2-3 дня': '3-4 дня', 
        '3-4 дня': '4-5 дней',
        '4-5 дней': '5-7 дней',
        '5-7 дней': '7-9 дней'
      };
      return timeMap[baseTime] || baseTime;
    }
    
    return baseTime;
  }

  // Расчет полной машины для внутрирегиональных
  async calculateFullTruckPrice(from, to) {
    const distance = await this.distanceAPI.getDistance(from, to) || 50;
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
        'Москва-Рязань': 250,
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
          return Math.round(data.distance);
        }
      }

      // Fallback - используем примерное расстояние
      return this.calculateApproximateDistance(from, to);

    } catch (error) {
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
    // Собираем данные
    const fromCity = document.getElementById('fromCity')?.value || '';
    const toCity = document.getElementById('toCity')?.value || '';
    const weight = parseFloat(document.getElementById('weight')?.value || 0);
    const volume = parseFloat(document.getElementById('volume')?.value || 0);
    const isConsolidated = document.getElementById('isConsolidated')?.checked || false;

    // Валидация
    if (!fromCity || !toCity || !weight) {
      alert('Заполните города и вес груза!');
      return;
    }
    
    // Объем не обязательный, но учитывается если заполнен
    if (volume && volume <= 0) {
      alert('Объем должен быть больше 0!');
      return;
    }

    // Расчет
    const cargoType = isConsolidated ? 'consolidated' : 'general';
    this.calculatePrice(fromCity, toCity, weight, volume, cargoType)
      .then(result => {
        this.showResult(result);
      })
      .catch(error => {
        alert('Ошибка расчёта: ' + error.message);
      });
  }

  // Отображение результата
  showResult(result) {
    const resultDiv = document.getElementById('calculatorResult') || this.createResultDiv();
    
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
            <div class="price-info">
              <p>🚛 ${result.transport}</p>
              <p>📅 ${result.deliveryTime}</p>
            </div>
          </div>

          <div class="cta-buttons">
            <button class="btn btn-primary btn-lg" onclick="smartCalculatorV2.showLeadForm()">
              📝 Оставить заявку
            </button>
            <button class="btn btn-secondary" onclick="smartCalculatorV2.callManager()">
              📞 +7 (916) 272-09-32
            </button>
          </div>

          <div class="disclaimer">
            <p><small>* Окончательная стоимость подтверждается менеджером</small></p>
          </div>
        </div>
      `;
    }

    // Скроллим к результату
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Создание div для результата
  createResultDiv() {
    const div = document.createElement('div');
    div.id = 'calculatorResult';
    div.className = 'calculator-result';
    
    const form = document.getElementById('calculatorForm');
    if (form) {
      form.parentNode.insertBefore(div, form.nextSibling);
    } else {
      // Fallback - добавляем в конец калькулятора
      const calcSection = document.querySelector('.calculator-section, #calculator');
      if (calcSection) {
        calcSection.appendChild(div);
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

// === CALCULATOR UI ===
// ===============================================
// СОВРЕМЕННЫЙ ИНТЕРФЕЙС КАЛЬКУЛЯТОРА
// ===============================================

class CalculatorUI {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
    }

    bindEvents() {
        // Навигация по шагам
        document.getElementById('nextStep1')?.addEventListener('click', () => this.nextStep());
        document.getElementById('nextStep2')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prevStep2')?.addEventListener('click', () => this.prevStep());
        document.getElementById('prevStep3')?.addEventListener('click', () => this.prevStep());
        
        // Кнопка расчета
        document.getElementById('calculateButton')?.addEventListener('click', () => this.calculate());
        
        // Новый расчет
        document.getElementById('newCalculation')?.addEventListener('click', () => this.resetCalculator());
        
        // Валидация полей
        this.setupFieldValidation();
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
            this.updateUI();
        }
    }

    prevStep() {
        this.currentStep = Math.max(this.currentStep - 1, 1);
        this.updateUI();
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateRoute();
            case 2:
                return this.validateCargo();
            default:
                return true;
        }
    }

    validateRoute() {
        const fromCity = document.getElementById('fromCity').value.trim();
        const toCity = document.getElementById('toCity').value.trim();
        
        if (!fromCity) {
            this.showError('fromCity', 'Укажите город отправления');
            return false;
        }
        
        if (!toCity) {
            this.showError('toCity', 'Укажите город назначения');
            return false;
        }
        
        if (fromCity.toLowerCase() === toCity.toLowerCase()) {
            this.showError('toCity', 'Города отправления и назначения не могут совпадать');
            return false;
        }
        
        this.clearErrors();
        return true;
    }

    validateCargo() {
        const weight = document.getElementById('weight').value;
        
        if (!weight || weight <= 0) {
            this.showError('weight', 'Укажите вес груза');
            return false;
        }
        
        if (weight > 20000) {
            this.showError('weight', 'Максимальный вес: 20 тонн. Для больших грузов свяжитесь с менеджером');
            return false;
        }
        
        this.clearErrors();
        return true;
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem;';
        
        // Удаляем предыдущую ошибку
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc2626';
        
        // Анимация ошибки
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    clearErrors() {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.form-control').forEach(field => {
            field.style.borderColor = '#e5e7eb';
        });
    }

    updateUI() {
        // Обновляем шаги
        document.querySelectorAll('.calc-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });
        
        // Обновляем прогресс
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        this.updateProgress();
        
        // Обновляем кнопки
        this.updateButtons();
    }

    updateProgress() {
        const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    updateButtons() {
        // Обновляем текст кнопки расчета
        const calculateBtn = document.getElementById('calculateButton');
        if (calculateBtn) {
            const btnText = calculateBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = 'Рассчитать стоимость';
            }
        }
    }

    async calculate() {
        const calculateBtn = document.getElementById('calculateButton');
        const btnText = calculateBtn.querySelector('.btn-text');
        const btnLoading = calculateBtn.querySelector('.btn-loading');
        
        // Показываем загрузку
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        calculateBtn.disabled = true;
        
        try {
            // Получаем данные формы
            const formData = this.getFormData();
            
            // Вызываем существующий калькулятор
            if (window.calculator) {
                const result = await window.calculator.calculatePrice(formData);
                this.showResult(result);
            } else {
                throw new Error('Калькулятор не инициализирован');
            }
        } catch (error) {
            this.showError('calculateButton', 'Ошибка расчета. Попробуйте еще раз.');
        } finally {
            // Скрываем загрузку
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            calculateBtn.disabled = false;
        }
    }

    getFormData() {
        return {
            from: document.getElementById('fromCity').value.trim(),
            to: document.getElementById('toCity').value.trim(),
            weight: parseFloat(document.getElementById('weight').value) || 0,
            volume: parseFloat(document.getElementById('volume').value) || 0,
            isConsolidated: document.getElementById('isConsolidated').checked
        };
    }

    showResult(result) {
        const resultContainer = document.getElementById('calculatorResult');
        const resultPrice = document.getElementById('resultPrice');
        const resultSubtitle = document.getElementById('resultSubtitle');
        const resultDetails = document.getElementById('resultDetails');
        
        // Обновляем цену
        resultPrice.textContent = this.formatPrice(result.price);
        
        // Обновляем подзаголовок
        const route = `${result.from} → ${result.to}`;
        resultSubtitle.textContent = `${route} • ${result.weight} кг`;
        
        // Обновляем детали
        resultDetails.innerHTML = this.generateResultDetails(result);
        
        // Показываем результат
        resultContainer.classList.add('show');
        
        // Прокручиваем к результату
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Анимация появления
        resultContainer.style.animation = 'fadeInScale 0.4s ease-out';
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    generateResultDetails(result) {
        const details = [];
        
        if (result.transport) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Транспорт</div>
                    <div class="detail-value">${result.transport}</div>
                </div>
            `);
        }
        
        if (result.distance) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Расстояние</div>
                    <div class="detail-value">${result.distance} км</div>
                </div>
            `);
        }
        
        if (result.deliveryTime) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Срок доставки</div>
                    <div class="detail-value">${result.deliveryTime}</div>
                </div>
            `);
        }
        
        if (result.pricePerKm) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Тариф за км</div>
                    <div class="detail-value">${result.pricePerKm} ₽/км</div>
                </div>
            `);
        }
        
        return details.join('');
    }

    resetCalculator() {
        // Сбрасываем форму
        document.getElementById('calculatorForm').reset();
        
        // Скрываем результат
        document.getElementById('calculatorResult').classList.remove('show');
        
        // Возвращаемся к первому шагу
        this.currentStep = 1;
        this.updateUI();
        
        // Очищаем ошибки
        this.clearErrors();
        
        // Прокручиваем к началу калькулятора
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }

    setupFieldValidation() {
        // Автоматическая валидация при вводе
        const fields = ['fromCity', 'toCity', 'weight'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    const error = field.parentNode.querySelector('.field-error');
                    if (error) {
                        error.remove();
                        field.style.borderColor = '#e5e7eb';
                    }
                });
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Ждем инициализации основного калькулятора
    setTimeout(() => {
        window.calculatorUI = new CalculatorUI();
    }, 100);
});

// CSS анимация для ошибок
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// === DISTANCE API ===
// Система получения реальных расстояний через API
// Поддерживает несколько источников с fallback

class DistanceAPI {
  constructor() {
    // Приоритет источников данных
    this.providers = [
      'static',          // Статическая база - мгновенно
      'osrm',            // OSRM - бесплатный, часто стабильнее в мобильных сетях
      'openrouteservice',// OpenRouteService - 2000 запросов/день
      'haversine'        // Формула по координатам - fallback
    ];
    
    // Кэш для избежания повторных запросов
    this.cache = new Map();
    this.cacheKey = (from, to) => `${from}-${to}`;
    
    // Счетчики использования
    this.usage = {
      static: 0,
      openrouteservice: 0,
      osrm: 0,
      haversine: 0
    };
  }

  // Главная функция получения расстояния
  async getDistance(fromCity, toCity) {
    const cacheKey = this.cacheKey(fromCity, toCity);
    
    // Проверяем кэш
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let distance = null;
    let usedProvider = null;
    
    // Пробуем разные источники
    for (const provider of this.providers) {
      try {
        distance = await this.getFromProvider(provider, fromCity, toCity);
        if (distance) {
          usedProvider = provider;
          this.usage[provider]++;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    // Кэшируем результат
    if (distance) {
      this.cache.set(cacheKey, distance);
    } else {
    }
    
    return distance || 0;
  }

  // Получение от конкретного провайдера
  async getFromProvider(provider, fromCity, toCity) {
    switch (provider) {
      case 'static':
        return this.getFromStatic(fromCity, toCity);
      case 'openrouteservice':
        return await this.getFromOpenRouteService(fromCity, toCity);
      case 'osrm':
        return await this.getFromOSRM(fromCity, toCity);
      case 'haversine':
        return this.getFromHaversine(fromCity, toCity);
      default:
        return null;
    }
  }

  // Статическая таблица (приоритет)
  getFromStatic(fromCity, toCity) {
    // Импортируем функцию динамически для Node.js
    try {
      if (typeof getRealDistance !== 'undefined') {
        return getRealDistance(fromCity, toCity);
      }
      
      // Для Node.js окружения
      const { getRealDistance: getDistance } = require('./real-distances.js');
      return getDistance(fromCity, toCity);
    } catch (error) {
      return null;
    }
  }

  // OpenRouteService API (2000 запросов/день) - корректируем единицы измерения (метры → км)
  async getFromOpenRouteService(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    // Правильный endpoint для легковых автомобилей
    // Явно укажем единицы км через query, т.к. в POST body может игнорироваться
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car?units=km';
    
    // API ключ из переменной окружения или константы
    const API_KEY = '28d87edc85fa4551b58d331d8d24f8e3';
    
    // Правильный формат тела запроса
    const requestBody = {
      coordinates: [
        [coords.from.lng, coords.from.lat],
        [coords.to.lng, coords.to.lat]
      ],
      format: "json",
      units: "km"
    };

    try {
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'AvtoGOST77/1.0 (https://avtogost77.ru)'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Структура ответа OpenRouteService
      if (data && data.routes && data.routes[0] && data.routes[0].summary) {
        const rawDistance = data.routes[0].summary.distance;
        // ORS часто возвращает метры; если значение > 1000, считаем что это метры
        const distanceKm = rawDistance > 1000 ? (rawDistance / 1000) : rawDistance;
        return Math.round(distanceKm);
      }
      
      throw new Error('Неожиданный формат ответа от OpenRouteService');
      
    } catch (error) {
      return null;
    }
  }

  // Open Source Routing Machine (бесплатный)
  async getFromOSRM(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    const url = `https://router.project-osrm.org/route/v1/driving/` +
      `${coords.from.lng},${coords.from.lat};${coords.to.lng},${coords.to.lat}` +
      `?overview=false&alternatives=false&steps=false`;

    try {
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        return Math.round(data.routes[0].distance / 1000);
      }
      
      throw new Error(`OSRM error: ${data.message || 'Unknown error'}`);
      
    } catch (error) {
      return null;
    }
  }

  // Формула Haversine (математический расчет)
  getFromHaversine(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    const R = 6371; // Радиус Земли в км
    const dLat = (coords.to.lat - coords.from.lat) * Math.PI / 180;
    const dLon = (coords.to.lng - coords.from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords.from.lat * Math.PI / 180) * Math.cos(coords.to.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return Math.round(R * c);
  }

  // Получение координат городов (расширенная база)
  getCityCoords(fromCity, toCity) {
    // Нормализация названий городов
    const normalizeCity = (city) => {
      const raw = (city || '').toString().trim();
      // Нормализуем: в нижний регистр, заменяем ё→е, убираем лишние пробелы
      const lower = raw.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ');

      // Гибкие соответствия по ключевым фрагментам
      if (lower.includes('санкт') || lower.includes('спб') || lower.includes('питер')) return 'spb';
      if (lower.includes('моск')) return 'moskva';
      if (lower.includes('ниж') && lower.includes('новгор')) return 'nizhniy-novgorod';
      if (lower.includes('екатерин')) return 'ekaterinburg';
      if (lower.includes('казан')) return 'kazan';
      if (lower.includes('вороне')) return 'voronezh';
      if (lower.includes('самар')) return 'samara';
      if (lower.includes('ростов')) return 'rostov';
      if (lower.includes('челябин')) return 'chelyabinsk';
      if (lower.includes('уфа')) return 'ufa';
      if (lower.includes('ряза')) return 'ryazan';
      if (lower.includes('тула')) return 'tula';
      if (lower.includes('ярослав')) return 'yaroslavl';
      if (lower.includes('владимир')) return 'vladimir';
      if (lower.includes('калуг')) return 'kaluga';
      if (lower.includes('смолен')) return 'smolensk';
      if (lower.includes('брян')) return 'bryansk';
      if (lower.includes('орел') || lower.includes('орёл')) return 'orel';
      if (lower.includes('курск')) return 'kursk';
      if (lower.includes('белгор')) return 'belgorod';
      if (lower.includes('липец')) return 'lipetsk';
      if (lower.includes('тамбов')) return 'tambov';
      if (lower.includes('пенза')) return 'penza';
      if (lower.includes('саранск')) return 'saransk';
      if (lower.includes('чебоксар')) return 'cheboksary';
      if (lower.includes('киров')) return 'kirov';
      if (lower.includes('ижевск')) return 'izhevsk';
      if (lower.includes('перм')) return 'perm';
      if (lower.includes('оренбург')) return 'orenburg';
      if (lower.includes('саратов')) return 'saratov';
      if (lower.includes('волгоград')) return 'volgograd';
      if (lower.includes('астрахан')) return 'astrakhan';
      if (lower.includes('краснодар')) return 'krasnodar';
      if (lower.includes('сочи')) return 'sochi';
      if (lower.includes('ставроп')) return 'stavropol';
      if (lower.includes('махачкал')) return 'makhachkala';
      if (lower.includes('грозн')) return 'grozny';
      if (lower.includes('налчик')) return 'nalchik';
      if (lower.includes('костром')) return 'kostroma';
      if (lower.includes('твер')) return 'tver';
      if (lower.includes('псков')) return 'pskov';
      if (lower.includes('новгоро')) return 'novgorod';
      if (lower.includes('петрозавод')) return 'petrozavodsk';
      if (lower.includes('архангел')) return 'arkhangelsk';
      if (lower.includes('мурман')) return 'murmansk';
      if (lower.includes('сыктывкар')) return 'syktyvkar';
      if (lower.includes('вологд')) return 'vologda';
      if (lower.includes('иваново')) return 'ivanovo';
      if (lower.includes('новосибир')) return 'novosibirsk';
      if (lower.includes('омск')) return 'omsk';
      if (lower.includes('краснояр')) return 'krasnoyarsk';
      if (lower.includes('иркутск')) return 'irkutsk';
      if (lower.includes('хабаров')) return 'khabarovsk';
      if (lower.includes('владивосток')) return 'vladivostok';
      if (lower.includes('томск')) return 'tomsk';
      if (lower.includes('кемеров')) return 'kemerovo';
      if (lower.includes('новокузнец')) return 'novokuznetsk';
      if (lower.includes('барнаул')) return 'barnaul';
      if (lower.includes('чита')) return 'chita';
      if (lower.includes('якутск')) return 'yakutsk';
      if (lower.includes('магадан')) return 'magadan';
      if (lower.includes('камчат')) return 'petropavlovsk-kamchatsky';
      if (lower.includes('сахалин')) return 'yuzhno-sakhalinsk';
      if (lower.includes('тюм')) return 'tyumen';
      if (lower.includes('сургут')) return 'surgut';
      if (lower.includes('курган')) return 'kurgan';
      if (lower.includes('гагарин')) return 'gagarin';

      // Если не распознали — делаем слаг
      return lower.replace(/\s+/g, '-');
    };

    const CITY_COORDS = {
      // Основные города России
      "moskva": { lat: 55.7558, lng: 37.6176 },
      "spb": { lat: 59.9311, lng: 30.3609 },
      "kazan": { lat: 55.8304, lng: 49.0661 },
      "voronezh": { lat: 51.6754, lng: 39.2088 },
      "samara": { lat: 53.2001, lng: 50.1500 },
      "nizhniy-novgorod": { lat: 56.3287, lng: 44.0020 },
      "ekaterinburg": { lat: 56.8431, lng: 60.6454 },
      "rostov": { lat: 47.2357, lng: 39.7015 },
      "chelyabinsk": { lat: 55.1644, lng: 61.4368 },
      "ufa": { lat: 54.7388, lng: 55.9721 },
      "ryazan": { lat: 54.6269, lng: 39.6916 },
      "tula": { lat: 54.1961, lng: 37.6182 },
      "yaroslavl": { lat: 57.6261, lng: 39.8845 },
      "vladimir": { lat: 56.1366, lng: 40.3966 },
      "kaluga": { lat: 54.5293, lng: 36.2754 },
      "smolensk": { lat: 54.7818, lng: 32.0401 },
      "bryansk": { lat: 53.2434, lng: 34.3641 },
      "orel": { lat: 52.9691, lng: 36.0699 },
      "kursk": { lat: 51.7373, lng: 36.1873 },
      "belgorod": { lat: 50.5952, lng: 36.5804 },
      "lipetsk": { lat: 52.6031, lng: 39.5708 },
      "tambov": { lat: 52.7213, lng: 41.4633 },
      "penza": { lat: 53.2001, lng: 45.0000 },
      "saransk": { lat: 54.1838, lng: 45.1749 },
      "cheboksary": { lat: 56.1439, lng: 47.2489 },
      "kirov": { lat: 58.6035, lng: 49.6679 },
      "izhevsk": { lat: 56.8431, lng: 53.2045 },
      "perm": { lat: 58.0105, lng: 56.2502 },
      "orenburg": { lat: 51.7727, lng: 55.0988 },
      "saratov": { lat: 51.5924, lng: 46.0348 },
      "volgograd": { lat: 48.7080, lng: 44.5133 },
      "astrakhan": { lat: 46.3497, lng: 48.0408 },
      "krasnodar": { lat: 45.0328, lng: 38.9769 },
      "sochi": { lat: 43.6028, lng: 39.7342 },
      "stavropol": { lat: 45.0428, lng: 41.9734 },
      "makhachkala": { lat: 42.9849, lng: 47.5047 },
      "grozny": { lat: 43.3181, lng: 45.6986 },
      "nalchik": { lat: 43.4981, lng: 43.6189 },
      
      // Расширение для других городов
      "kostroma": { lat: 57.7665, lng: 40.9269 },
      "tver": { lat: 56.8596, lng: 35.9007 },
      "pskov": { lat: 57.8136, lng: 28.3496 },
      "novgorod": { lat: 58.5218, lng: 31.2756 },
      "petrozavodsk": { lat: 61.7849, lng: 34.3469 },
      "arkhangelsk": { lat: 64.5401, lng: 40.5433 },
      "murmansk": { lat: 68.9585, lng: 33.0827 },
      "syktyvkar": { lat: 61.6681, lng: 50.8372 },
      "vologda": { lat: 59.2239, lng: 39.8839 },
      "ivanovo": { lat: 56.9999, lng: 40.9739 },
      
      // Сибирь и Дальний Восток
      "novosibirsk": { lat: 55.0084, lng: 82.9357 },
      "omsk": { lat: 54.9893, lng: 73.3682 },
      "krasnoyarsk": { lat: 56.0184, lng: 92.8672 },
      "irkutsk": { lat: 52.2978, lng: 104.2964 },
      "khabarovsk": { lat: 48.4827, lng: 135.0839 },
      "vladivostok": { lat: 43.1056, lng: 131.8735 },
      "tomsk": { lat: 56.5017, lng: 84.9563 },
      "kemerovo": { lat: 55.3331, lng: 86.0844 },
      "novokuznetsk": { lat: 53.7596, lng: 87.1216 },
      "barnaul": { lat: 53.3606, lng: 83.7636 },
      "chita": { lat: 52.0349, lng: 113.4695 },
      "yakutsk": { lat: 62.0355, lng: 129.6755 },
      "magadan": { lat: 59.5684, lng: 150.8048 },
      "petropavlovsk-kamchatsky": { lat: 53.0445, lng: 158.6475 },
      "yuzhno-sakhalinsk": { lat: 46.9588, lng: 142.7386 },
      "tyumen": { lat: 57.1522, lng: 65.5272 },
      "surgut": { lat: 61.2500, lng: 73.4167 },
      "kurgan": { lat: 55.4500, lng: 65.3333 },
      "gagarin": { lat: 55.5539, lng: 34.9953 }
    };

    // Нормализуем названия городов
    const normalizedFrom = normalizeCity(fromCity);
    const normalizedTo = normalizeCity(toCity);
    
    const from = CITY_COORDS[normalizedFrom];
    const to = CITY_COORDS[normalizedTo];
    
    if (!from || !to) {
      return null;
    }
    
    return { from, to };
  }

  // Batch запрос для нескольких маршрутов
  async getDistancesBatch(routes) {
    const promises = routes.map(async (route) => {
      try {
        const distance = await this.getDistance(route.from, route.to);
        return { ...route, distance, status: 'success' };
      } catch (error) {
        return { ...route, distance: null, status: 'error', error: error.message };
      }
    });
    
    return await Promise.all(promises);
  }

  // Получение статистики использования
  getUsageStats() {
    const total = Object.values(this.usage).reduce((sum, count) => sum + count, 0);
    const stats = {};
    
    for (const [provider, count] of Object.entries(this.usage)) {
      stats[provider] = {
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      };
    }
    
    return {
      total,
      providers: stats,
      cacheSize: this.cache.size
    };
  }

  // Очистка кэша
  clearCache() {
    this.cache.clear();
  }

  // Проверка лимитов API
  checkApiLimits() {
    const stats = this.getUsageStats();
    
    if (stats.providers.openrouteservice?.count > 1800) {
    }
    
    if (stats.providers.osrm?.count > 500) {
    }
    
    return stats;
  }
}

// Глобальный экземпляр
const distanceAPI = new DistanceAPI();

// Удобная функция для прямого использования
async function getRouteDistance(fromCity, toCity) {
  return await distanceAPI.getDistance(fromCity, toCity);
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DistanceAPI, distanceAPI, getRouteDistance };
}

// Для браузера
if (typeof window !== 'undefined') {
  window.DistanceAPI = DistanceAPI;
  window.distanceAPI = distanceAPI;
  window.getRouteDistance = getRouteDistance;
}
// === CITIES SIMPLE ===
// Простой справочник городов вместо DaData
const POPULAR_CITIES = [
  // Топ-10 городов
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Омск',
  'Ростов-на-Дону',
  
  // Московская область (74 города)
  'Апрелевка', 'Балашиха', 'Бронницы', 'Верея', 'Видное', 'Волоколамск',
  'Воскресенск', 'Высоковск', 'Голицыно', 'Дедовск', 'Дзержинский', 'Дмитров',
  'Долгопрудный', 'Домодедово', 'Дрезна', 'Дубна', 'Егорьевск', 'Жуковский',
  'Зарайск', 'Звенигород', 'Ивантеевка', 'Истра', 'Кашира', 'Клин',
  'Коломна', 'Королёв', 'Котельники', 'Красноармейск', 'Красногорск',
  'Краснозаводск', 'Краснознаменск', 'Кубинка', 'Куровское', 'Ликино-Дулёво',
  'Лобня', 'Лосино-Петровский', 'Луховицы', 'Лыткарино', 'Люберцы',
  'Можайск', 'Мытищи', 'Наро-Фоминск', 'Ногинск', 'Одинцово', 'Озёры',
  'Орехово-Зуево', 'Павловский Посад', 'Пересвет', 'Подольск', 'Протвино',
  'Пушкино', 'Пущино', 'Раменское', 'Реутов', 'Рошаль', 'Руза',
  'Сергиев Посад', 'Серпухов', 'Солнечногорск', 'Старая Купавна', 'Ступино',
  'Талдом', 'Фрязино', 'Химки', 'Хотьково', 'Черноголовка', 'Чехов',
  'Шатура', 'Щёлково', 'Электрогорск', 'Электросталь', 'Электроугли', 'Яхрома',
  'Поваровка', // Добавил специально для тебя!
  
  // Ленинградская область (34 города)
  'Бокситогорск', 'Волосово', 'Волхов', 'Всеволожск', 'Выборг', 'Высоцк',
  'Гатчина', 'Ивангород', 'Каменногорск', 'Кингисепп', 'Кириши', 'Кировск',
  'Колтуши', 'Коммунар', 'Кудрово', 'Лодейное Поле', 'Луга', 'Любань',
  'Мурино', 'Никольское', 'Новая Ладога', 'Отрадное', 'Пикалёво', 'Подпорожье',
  'Приморск', 'Приозерск', 'Светогорск', 'Сертолово', 'Сланцы', 'Сосновый Бор',
  'Старая Ладога', 'Сясьстрой', 'Тихвин', 'Тосно', 'Шлиссельбург',
  
  // Другие крупные города
  'Уфа', 'Красноярск', 'Пермь', 'Воронеж', 'Волгоград', 'Краснодар',
  'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск',
  'Иркутск', 'Хабаровск', 'Владивосток', 'Ярославль', 'Махачкала',
  'Томск', 'Оренбург', 'Кемерово', 'Рязань', 'Астрахань', 'Пенза',
  'Липецк', 'Тула', 'Киров', 'Чебоксары', 'Калининград', 'Брянск',
  'Курск', 'Иваново', 'Ставрополь', 'Белгород', 'Сочи', 'Нижний Тагил',
  'Архангельск', 'Владимир', 'Калуга', 'Смоленск', 'Вологда', 'Орел',
  'Череповец', 'Мурманск', 'Саранск'
];

// Простой автокомплит
function setupCityAutocomplete() {
  const fromInput = document.getElementById('fromCity');
  const toInput = document.getElementById('toCity');
  
  [fromInput, toInput].forEach(input => {
    if (!input) return;
    
    const suggestionsDiv = document.querySelector(`.address-suggestions[data-for="${input.name}"]`);
    if (!suggestionsDiv) return;
    
    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      if (value.length < 2) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
        return;
      }
      
      const matches = POPULAR_CITIES.filter(city => 
        city.toLowerCase().includes(value)
      ).slice(0, 5);
      
      if (matches.length > 0) {
        suggestionsDiv.innerHTML = matches.map(city => 
          `<div class="suggestion-item" data-city="${city}">${city}</div>`
        ).join('');
        suggestionsDiv.style.display = 'block';
      } else {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
      }
    });
    
    // Клик по подсказке
    suggestionsDiv.addEventListener('click', function(e) {
      if (e.target.classList.contains('suggestion-item')) {
        input.value = e.target.dataset.city;
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
      }
    });
    
    // Скрыть подсказки при клике вне
    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
      }
    });
  });
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', setupCityAutocomplete);
