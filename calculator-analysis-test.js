// Анализ калькулятора для Москва - СПб, 2000 кг

console.log("🧮 АНАЛИЗ КАЛЬКУЛЯТОРА AVTOGOST77");
console.log("==============================");
console.log("📍 Маршрут: Москва → Санкт-Петербург");
console.log("📦 Груз: 2000 кг");
console.log("📏 Расстояние: ~700 км (по данным калькулятора)");
console.log("");

// ТАРИФЫ ИЗ КАЛЬКУЛЯТОРА
const transportTypes = {
  gazelle: {
    name: 'Газель',
    maxWeight: 1500,    // кг
    maxVolume: 16,      // м³
    minPrice: 10000,    // минимальная цена Москва
    minPriceRegion: 7500, // минималка в регионах
    coefficient: 1.0,
    allowConsolidated: true
  },
  threeTon: {
    name: '3-тонник',
    maxWeight: 3000,
    maxVolume: 18,
    minPrice: 13000,
    minPriceRegion: 9750,
    coefficient: 1.0,
    allowConsolidated: true
  },
  fiveTon: {
    name: '5-тонник',
    maxWeight: 5000,
    maxVolume: 36,
    minPrice: 20000,
    minPriceRegion: 15000,
    coefficient: 1.05,
    allowConsolidated: true
  },
  tenTon: {
    name: '10-тонник',
    maxWeight: 10000,
    maxVolume: 50,
    minPrice: 24000,
    minPriceRegion: 18000,
    coefficient: 1.08,
    allowConsolidated: true
  },
  truck: {
    name: 'Фура 20т',
    maxWeight: 20000,
    maxVolume: 82,
    minPrice: 28000,
    minPriceRegion: 21000,
    coefficient: 0.95,
    allowConsolidated: false
  }
};

// ФУНКЦИЯ ВЫБОРА ТРАНСПОРТА
function selectOptimalTransport(weight, volume = 0) {
  // Сначала проверяем по весу
  for (const [key, transport] of Object.entries(transportTypes)) {
    if (weight <= transport.maxWeight) {
      // Если объем указан, проверяем и его
      if (volume > 0 && volume > transport.maxVolume) {
        continue; // этот транспорт не подходит по объему
      }
      return key;
    }
  }
  return 'truck'; // fallback
}

// ФУНКЦИЯ КОЭФФИЦИЕНТА ЗАГРУЗКИ
function calculateLoadFactor(weight, volume, transport) {
  const weightUsage = weight / transport.maxWeight;
  
  if (volume && volume > 0) {
    const volumeUsage = volume / transport.maxVolume;
    const limitingUsage = Math.max(weightUsage, volumeUsage);
    
    if (limitingUsage > 1.0) {
      return 1.0 + (limitingUsage - 1.0) * 0.3; // доплата за перегруз
    }
    
    if (limitingUsage > 0.8) return 1.0;   // 80%+ - базовая цена
    if (limitingUsage > 0.6) return 1.1;   // 60-80% - небольшая доплата
    if (limitingUsage > 0.4) return 1.25;  // 40-60% - средняя доплата
    if (limitingUsage > 0.2) return 1.4;   // 20-40% - большая доплата
    return 1.6;  // менее 20% - максимальная доплата
  } else {
    if (weightUsage > 1.0) return 1.0 + (weightUsage - 1.0) * 0.3;
    if (weightUsage > 0.8) return 1.0;
    if (weightUsage > 0.6) return 1.1;
    if (weightUsage > 0.4) return 1.25;
    if (weightUsage > 0.2) return 1.4;
    return 1.6;
  }
}

// МЕЖРЕГИОНАЛЬНАЯ ЛОГИКА ДЛЯ МОСКВА-СПБ
function calculateInterregionalPrice(fromCity, toCity, weight, volume, distance) {
  console.log("🚛 МЕЖРЕГИОНАЛЬНЫЙ РАСЧЕТ (>200км)");
  console.log("==================================");
  
  // Тариф по расстоянию
  let pricePerKm;
  let distanceCategory;
  
  if (distance < 200) {
    pricePerKm = 35;
    distanceCategory = 'Ближний (до 200км)';
  } else if (distance < 300) {
    pricePerKm = 28;
    distanceCategory = 'Близкий (200-300км)';
  } else if (distance < 500) {
    pricePerKm = 22;
    distanceCategory = 'Средний (300-500км)';
  } else if (distance < 800) {
    pricePerKm = 25;
    distanceCategory = 'Дальний (500-800км)';
  } else if (distance < 1000) {
    pricePerKm = 22;
    distanceCategory = 'Дальнобойный (800-1000км)';
  } else {
    pricePerKm = 25;
    distanceCategory = 'Сверхдальний (1000км+)';
  }
  
  console.log(`📏 Расстояние: ${distance} км → Категория: ${distanceCategory}`);
  console.log(`💰 Базовый тариф: ${pricePerKm} ₽/км`);
  
  // Подбираем транспорт
  const optimalTransport = selectOptimalTransport(weight, volume);
  const transport = transportTypes[optimalTransport];
  
  console.log(`🚛 Выбранный транспорт: ${transport.name}`);
  console.log(`📊 Максимум: ${transport.maxWeight} кг, ${transport.maxVolume} м³`);
  
  // Базовая цена
  let basePrice = distance * pricePerKm;
  console.log(`💵 Базовая цена (${distance} × ${pricePerKm}): ${basePrice} ₽`);
  
  // Минималка
  const transportMinPrices = {
    gazelle: distance < 200 ? 20000 : transport.minPriceRegion,
    threeTon: distance < 200 ? 25000 : transport.minPriceRegion,
    fiveTon: distance < 200 ? 30000 : transport.minPriceRegion,
    tenTon: distance < 200 ? 37000 : transport.minPriceRegion,
    truck: distance < 200 ? 42000 : transport.minPriceRegion
  };
  
  const minPrice = transportMinPrices[optimalTransport];
  console.log(`🔒 Минималка для ${transport.name}: ${minPrice} ₽`);
  
  basePrice = Math.max(basePrice, minPrice);
  console.log(`💰 После применения минималки: ${basePrice} ₽`);
  
  // Доплата по типу ТС
  const interregionalKmRates = {
    gazelle: 30,   // 30₽/км для газели
    threeTon: 40,  // 40₽/км для 3-тонника
    fiveTon: 50,   // 50₽/км для 5-тонника  
    tenTon: 62,    // 62₽/км для 10-тонника
    truck: 70      // 70₽/км для фуры
  };
  
  const kmRate = interregionalKmRates[optimalTransport] || 15;
  const kmSurcharge = distance * kmRate;
  
  console.log(`🚛 Доплата по типу ТС (${distance} × ${kmRate}): ${kmSurcharge} ₽`);
  
  // НЕ сборный груз, значит добавляем доплату
  basePrice += kmSurcharge;
  console.log(`💸 После доплаты за тип ТС: ${basePrice} ₽`);
  
  // Коэффициент загрузки
  const loadFactor = calculateLoadFactor(weight, volume, transport);
  const weightUsage = weight / transport.maxWeight;
  
  console.log(`📊 Загрузка по весу: ${(weightUsage * 100).toFixed(1)}%`);
  console.log(`⚖️ Коэффициент загрузки: ${loadFactor}`);
  
  // Финальная цена
  const finalPrice = Math.round(basePrice * loadFactor * transport.coefficient);
  
  console.log(`🎯 Коэффициент транспорта: ${transport.coefficient}`);
  console.log(`💯 ФИНАЛЬНАЯ ЦЕНА: ${finalPrice} ₽`);
  console.log(`📊 Цена за км: ${Math.round(finalPrice / distance)} ₽/км`);
  
  return {
    price: finalPrice,
    transport: transport.name,
    distance: distance,
    pricePerKm: Math.round(finalPrice / distance),
    details: {
      basePrice: basePrice,
      loadFactor: loadFactor,
      transportCoeff: transport.coefficient,
      weightUsage: Math.round(weightUsage * 100),
      category: distanceCategory
    }
  };
}

// ТЕСТ ДЛЯ МОСКВА-СПБ 2000 КГ
console.log("");
console.log("🧪 ТЕСТОВЫЙ РАСЧЕТ:");
console.log("===================");

const result = calculateInterregionalPrice('Москва', 'Санкт-Петербург', 2000, 0, 700);

console.log("");
console.log("📋 ИТОГОВЫЙ РЕЗУЛЬТАТ:");
console.log("======================");
console.log(`🚛 Транспорт: ${result.transport}`);
console.log(`💰 Цена: ${result.price} ₽`);
console.log(`📏 Расстояние: ${result.distance} км`);
console.log(`💵 Цена за км: ${result.pricePerKm} ₽/км`);
console.log(`📊 Загрузка: ${result.details.weightUsage}%`);
console.log(`⚖️ Коэффициент загрузки: ${result.details.loadFactor}`);
console.log(`🎯 Категория: ${result.details.category}`);


