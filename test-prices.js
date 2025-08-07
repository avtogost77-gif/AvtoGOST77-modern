// Тестовый скрипт для проверки цен калькулятора
// Запускать: node test-prices.js

// Моковые данные для тестирования без API
const testRoutes = [
    { from: 'Москва', to: 'Химки', distance: 30, zone: 'Городская' },
    { from: 'Москва', to: 'Тула', distance: 180, zone: 'Переходная' },
    { from: 'Москва', to: 'Ярославль', distance: 250, zone: 'Ближний межрегион' },
    { from: 'Москва', to: 'Воронеж', distance: 450, zone: 'Средний межрегион' },
    { from: 'Москва', to: 'Казань', distance: 700, zone: 'Дальний межрегион' },
    { from: 'Москва', to: 'Екатеринбург', distance: 1400, zone: 'Дальнобойный' }
];

// Параметры транспорта из калькулятора
const transportTypes = {
    gazelle: {
        name: 'Газель',
        minPrice: 10000,
        minPriceRegion: 7500,
        coefficient: 1.0
    },
    threeTon: {
        name: '3-тонник',
        minPrice: 13000,
        minPriceRegion: 9750,
        coefficient: 1.0
    },
    fiveTon: {
        name: '5-тонник',
        minPrice: 20000,
        minPriceRegion: 15000,
        coefficient: 1.05
    },
    tenTon: {
        name: '10-тонник',
        minPrice: 24000,
        minPriceRegion: 18000,
        coefficient: 1.08
    },
    truck: {
        name: 'Фура 20т',
        minPrice: 28000,
        minPriceRegion: 21000,
        coefficient: 0.95
    }
};

// Зональные коэффициенты из калькулятора
function getZoneCoeff(distance) {
    if (distance < 70) return 1.6;
    if (distance < 200) return 1.4;
    if (distance < 400) return 1.3;
    if (distance < 800) return 1.1;
    return 1.0;
}

// Тарифы за км для межрегиональных
function getPricePerKm(distance) {
    if (distance < 200) return 35;
    if (distance < 300) return 28;
    if (distance < 500) return 22;
    if (distance < 800) return 18;
    return 15;
}

// Расчет цены (упрощенный)
function calculatePrice(distance, transportType) {
    const transport = transportTypes[transportType];
    
    if (distance <= 70) {
        // Городская - просто минималка
        return transport.minPrice;
    } else if (distance < 200) {
        // Переходная зона
        const excessKm = distance - 70;
        const kmRates = {
            gazelle: 20,
            threeTon: 25,
            fiveTon: 35,
            tenTon: 45,
            truck: 60
        };
        const kmRate = kmRates[transportType];
        return transport.minPrice + (excessKm * kmRate);
    } else {
        // Межрегиональная
        const pricePerKm = getPricePerKm(distance);
        let basePrice = distance * pricePerKm;
        
        // Минималки для коротких плеч
        const minPrices = {
            gazelle: distance < 200 ? 20000 : transport.minPriceRegion,
            threeTon: distance < 200 ? 25000 : transport.minPriceRegion,
            fiveTon: distance < 200 ? 30000 : transport.minPriceRegion,
            tenTon: distance < 200 ? 37000 : transport.minPriceRegion,
            truck: distance < 200 ? 42000 : transport.minPriceRegion
        };
        
        basePrice = Math.max(basePrice, minPrices[transportType]);
        
        // Доплата за км по типу ТС
        const interregionalKmRates = {
            gazelle: 30,
            threeTon: 40,
            fiveTon: 50,
            tenTon: 62,
            truck: 70
        };
        
        basePrice += distance * interregionalKmRates[transportType];
        
        // Применяем зональный коэфф
        const zoneCoeff = getZoneCoeff(distance);
        
        return Math.round(basePrice * zoneCoeff);
    }
}

// Вывод результатов
console.log('\n=== ТЕСТОВЫЕ РАСЧЕТЫ КАЛЬКУЛЯТОРА ===');
console.log('Груз: 500 кг, 5 м³, обычный (не сборный)\n');

for (const route of testRoutes) {
    console.log(`\n${route.zone.toUpperCase()} (${route.distance} км)`);
    console.log(`${route.from} → ${route.to}`);
    console.log('-'.repeat(40));
    
    for (const [key, transport] of Object.entries(transportTypes)) {
        const price = calculatePrice(route.distance, key);
        const pricePerKm = Math.round(price / route.distance);
        console.log(`${transport.name.padEnd(10)} ${price.toLocaleString().padStart(8)} ₽ (${pricePerKm} ₽/км)`);
    }
}