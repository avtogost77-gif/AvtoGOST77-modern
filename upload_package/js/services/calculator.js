// 🚛 NextGen Smart Logistics Calculator
// Основано на реальной бизнес-логике АвтоГОСТ с улучшениями
export class SmartLogisticsCalculator {
    constructor() {
        this.transportTypes = [
            {
                id: 'gazelle',
                name: 'Газель',
                maxWeight: 1500,
                maxVolume: 16,
                density: 94, // 1500/16
                minPrice: { moscow: 12000, regions: 8500 },
                coefficient: 0.36,
                icon: '🚐'
            },
            {
                id: 'threeTon',
                name: '3-тонник',
                maxWeight: 3000,
                maxVolume: 18,
                density: 167,
                minPrice: { moscow: 15000, regions: 11000 },
                coefficient: 0.46,
                icon: '🚛'
            },
            {
                id: 'fiveTon',
                name: '5-тонник',
                maxWeight: 5000,
                maxVolume: 36,
                density: 139,
                minPrice: { moscow: 22000, regions: 16500 },
                coefficient: 0.71,
                icon: '🚛'
            },
            {
                id: 'tenTon',
                name: '10-тонник',
                maxWeight: 10000,
                maxVolume: 50,
                density: 200,
                minPrice: { moscow: 28000, regions: 21000 },
                coefficient: 0.86,
                icon: '🚚'
            },
            {
                id: 'truck',
                name: 'Фура 20т',
                maxWeight: 20000,
                maxVolume: 82,
                density: 244,
                minPrice: { moscow: 35000, regions: 26000 },
                coefficient: 1.0,
                icon: '🚚'
            }
        ];
        this.regions = new Map([
            ['Московская область', [
                    'Москва', 'Подольск', 'Химки', 'Балашиха', 'Мытищи', 'Королёв',
                    'Люберцы', 'Красногорск', 'Одинцово', 'Голицыно', 'Поварово',
                    'Воскресенск', 'Коломна', 'Серпухов', 'Щёлково', 'Домодедово'
                ]],
            ['Санкт-Петербург и область', [
                    'Санкт-Петербург', 'Гатчина', 'Выборг', 'Всеволожск', 'Колпино',
                    'Пушкин', 'Петергоф', 'Кронштадт'
                ]],
            ['Нижегородская область', [
                    'Нижний Новгород', 'Дзержинск', 'Арзамас', 'Саров', 'Бор'
                ]]
        ]);
        // Коэффициенты типов груза (из анализа АвтоГОСТ)
        this.cargoFactors = new Map([
            ['general', 1.0],
            ['fragile', 1.3],
            ['valuable', 1.5],
            ['dangerous', 1.8],
            ['perishable', 1.4],
            ['oversized', 1.6]
        ]);
        this.urgencyFactors = new Map([
            ['standard', 1.0],
            ['urgent', 1.3], // +30% за срочность
            ['emergency', 1.8] // +80% за экстренность
        ]);
    }
    /**
     * Главный метод расчета стоимости
     */
    calculatePrice(data) {
        try {
            // 1. Валидация входных данных
            const validationError = this.validateInput(data);
            if (validationError) {
                return validationError;
            }
            // 2. Проверка на внутрирегиональную перевозку
            const regionCheck = this.checkRegionRestriction(data.fromCity, data.toCity);
            if (regionCheck) {
                return regionCheck;
            }
            // 3. Выбор оптимального транспорта
            const transport = this.selectOptimalTransport(data.weight, data.volume);
            if (!transport) {
                return this.createError('OVERWEIGHT', 'Груз превышает максимальную грузоподъемность. Требуется спецтранспорт.', ['Рассмотрите разделение груза на несколько отправлений', 'Свяжитесь с менеджером для подбора спецтранспорта']);
            }
            // 4. Расчет маршрута и базовой цены
            const route = this.calculateRoute(data.fromCity, data.toCity);
            const basePrice = this.calculateBasePrice(route.distance, transport);
            // 5. Применение всех коэффициентов
            const factors = this.calculatePriceFactors(data, transport, route);
            const finalPrice = this.applyFactors(basePrice, factors);
            // 6. Формирование результата
            return this.createSuccessResult(data, transport, route, finalPrice, factors);
        }
        catch (error) {
            console.error('Calculator error:', error);
            return this.createError('API_ERROR', 'Произошла ошибка при расчете. Попробуйте позже или свяжитесь с менеджером.', ['Обновите страницу и попробуйте снова', 'Позвоните нам: +7 916 272-09-32']);
        }
    }
    /**
     * Валидация входных данных
     */
    validateInput(data) {
        if (!data.fromCity || data.fromCity.trim().length < 2) {
            return this.createError('INVALID_ROUTE', 'Укажите город отправления');
        }
        if (!data.toCity || data.toCity.trim().length < 2) {
            return this.createError('INVALID_ROUTE', 'Укажите город назначения');
        }
        if (data.fromCity.toLowerCase() === data.toCity.toLowerCase()) {
            return this.createError('INVALID_ROUTE', 'Города отправления и назначения не могут совпадать');
        }
        if (data.weight <= 0 || data.weight > 25000) {
            return this.createError('OVERWEIGHT', 'Вес груза должен быть от 1 до 25000 кг');
        }
        if (data.volume !== undefined && (data.volume <= 0 || data.volume > 100)) {
            return this.createError('INVALID_ROUTE', 'Объем груза должен быть от 0.1 до 100 м³');
        }
        return null;
    }
    /**
     * ВАЖНОЕ ОГРАНИЧЕНИЕ: Сборные грузы только между регионами!
     */
    checkRegionRestriction(fromCity, toCity) {
        const fromRegion = this.getCityRegion(fromCity);
        const toRegion = this.getCityRegion(toCity);
        if (fromRegion && toRegion && fromRegion === toRegion) {
            const alternativePrice = this.calculateFullTruckPrice(fromCity, toCity);
            return {
                success: false,
                error: 'ВНИМАНИЕ! Сборные грузы только между регионами. Внутри региона - только отдельная машина!',
                code: 'SAME_REGION',
                alternativePrice,
                suggestions: [
                    'Заказать отдельную машину',
                    'Дождаться накопления груза для межрегиональной отправки',
                    'Связаться с менеджером для уточнения возможностей'
                ]
            };
        }
        return null;
    }
    /**
     * Выбор оптимального транспорта
     */
    selectOptimalTransport(weight, volume) {
        for (const transport of this.transportTypes) {
            // Проверяем по весу (обязательно)
            if (weight <= transport.maxWeight) {
                // Если объем указан, проверяем и его
                if (volume !== undefined) {
                    const density = weight / volume;
                    if (volume <= transport.maxVolume && density <= transport.density * 1.2) {
                        return transport;
                    }
                }
                else {
                    // Если объем не указан, выбираем по весу
                    return transport;
                }
            }
        }
        return null;
    }
    /**
     * Расчет базовой цены по километражу (из анализа АвтоГОСТ)
     */
    calculateBasePrice(distance, transport) {
        let pricePerKm;
        // Логика ценообразования по расстоянию (из реального анализа)
        if (distance < 50) {
            pricePerKm = 700; // Очень короткие маршруты - дорого!
        }
        else if (distance < 100) {
            pricePerKm = 280;
        }
        else if (distance < 200) {
            pricePerKm = 200;
        }
        else if (distance < 500) {
            pricePerKm = 150;
        }
        else {
            pricePerKm = 100; // Дальние маршруты - дешевле за км
        }
        let basePrice = distance * pricePerKm;
        // Если выбрана не фура, применяем коэффициент
        if (transport.coefficient < 1.0) {
            basePrice = basePrice * transport.coefficient;
        }
        return basePrice;
    }
    /**
     * Расчет всех ценовых факторов
     */
    calculatePriceFactors(data, transport, route) {
        const loadFactor = this.calculateLoadFactor(data.weight, data.volume, transport);
        const routeFactor = this.getRouteFactor(data.fromCity, data.toCity);
        const cargoFactor = this.cargoFactors.get(data.cargoType) ?? 1.0;
        const urgencyFactor = this.urgencyFactors.get(data.urgency) ?? 1.0;
        const seasonFactor = this.getSeasonFactor();
        const demandFactor = this.getDemandFactor(route);
        return {
            basePrice: this.calculateBasePrice(route.distance, transport),
            loadFactor,
            routeFactor,
            cargoFactor,
            urgencyFactor,
            seasonFactor,
            demandFactor
        };
    }
    /**
     * Коэффициент загрузки (чем меньше груз, тем дороже за единицу)
     */
    calculateLoadFactor(weight, volume, transport) {
        const weightUsage = weight / transport.maxWeight;
        if (volume !== undefined) {
            const volumeUsage = volume / transport.maxVolume;
            const maxUsage = Math.max(weightUsage, volumeUsage);
            if (maxUsage < 0.3)
                return 1.5; // менее 30% - дорого
            if (maxUsage < 0.5)
                return 1.3; // менее 50%
            if (maxUsage < 0.7)
                return 1.1; // менее 70%
            return 1.0; // более 70% - базовая цена
        }
        else {
            if (weightUsage < 0.3)
                return 1.4;
            if (weightUsage < 0.5)
                return 1.2;
            if (weightUsage < 0.7)
                return 1.05;
            return 1.0;
        }
    }
    /**
     * Коэффициент популярности маршрута
     */
    getRouteFactor(from, to) {
        const popularRoutes = [
            ['москва', 'санкт-петербург'],
            ['москва', 'нижний новгород'],
            ['москва', 'екатеринбург'],
            ['москва', 'казань']
        ];
        const fromLower = from.toLowerCase();
        const toLower = to.toLowerCase();
        for (const [city1, city2] of popularRoutes) {
            if ((city1 && city2 && fromLower.includes(city1) && toLower.includes(city2)) ||
                (city1 && city2 && fromLower.includes(city2) && toLower.includes(city1))) {
                return 0.9; // скидка на популярные маршруты
            }
        }
        // Обратка дешевле
        if (toLower.includes('москва') || toLower.includes('санкт-петербург')) {
            return 0.95;
        }
        return 1.0;
    }
    /**
     * Сезонный коэффициент
     */
    getSeasonFactor() {
        const month = new Date().getMonth();
        // Зимние месяцы дороже из-за сложных условий
        if (month === 11 || month === 0 || month === 1)
            return 1.1;
        // Весенне-летний период - базовые цены
        return 1.0;
    }
    /**
     * Коэффициент спроса (можно интегрировать с ML в будущем)
     */
    getDemandFactor(route) {
        // Пока простая логика, в будущем - ML модель
        switch (route.popularity) {
            case 'high': return 1.1;
            case 'medium': return 1.0;
            case 'low': return 0.95;
            default: return 1.0;
        }
    }
    /**
     * Применение всех факторов к базовой цене
     */
    applyFactors(basePrice, factors) {
        let finalPrice = basePrice;
        finalPrice *= factors.loadFactor;
        finalPrice *= factors.routeFactor;
        finalPrice *= factors.cargoFactor;
        finalPrice *= factors.urgencyFactor;
        finalPrice *= factors.seasonFactor;
        finalPrice *= factors.demandFactor;
        // Округляем до красивой цифры
        return Math.round(finalPrice / 500) * 500;
    }
    /**
     * Создание успешного результата
     */
    createSuccessResult(data, transport, route, price, factors) {
        const deliveryTime = this.calculateDeliveryTime(route.distance);
        return {
            success: true,
            price,
            pricePerKm: Math.round(price / route.distance),
            transport,
            route,
            deliveryTime,
            factors,
            details: {
                weight: data.weight,
                volume: data.volume || undefined,
                density: data.volume ? Math.round(data.weight / data.volume) : undefined,
                loadPercent: Math.round((data.weight / transport.maxWeight) * 100),
                volumePercent: data.volume ? Math.round((data.volume / transport.maxVolume) * 100) : undefined
            },
            restrictions: this.getRestrictions(data),
            recommendations: this.getRecommendations(data, factors)
        };
    }
    /**
     * Создание ошибки
     */
    createError(code, message, suggestions) {
        return {
            success: false,
            error: message,
            code,
            suggestions: suggestions || undefined
        };
    }
    // Вспомогательные методы...
    getCityRegion(cityName) {
        const city = cityName.toLowerCase();
        for (const [region, cities] of this.regions) {
            if (cities.some(c => c.toLowerCase().includes(city) || city.includes(c.toLowerCase()))) {
                return region;
            }
        }
        return null;
    }
    calculateRoute(fromCity, toCity) {
        // Упрощенная логика расчета маршрута
        // В production - интеграция с Google Maps/Yandex API
        const distance = this.getDistanceByRoute(fromCity, toCity);
        return {
            from: this.createCityData(fromCity),
            to: this.createCityData(toCity),
            distance,
            estimatedTime: Math.round(distance / 80), // примерно 80 км/ч средняя скорость
            popularity: this.getRoutePopularity(fromCity, toCity)
        };
    }
    createCityData(cityName) {
        const region = this.getCityRegion(cityName) ?? 'Другой регион';
        const isMarketplaceHub = this.isMarketplaceHub(cityName);
        return {
            name: cityName,
            region,
            coordinates: [0, 0], // В production - реальные координаты
            isMarketplaceHub,
            deliveryZone: this.getDeliveryZone(cityName),
            timezone: 'Europe/Moscow'
        };
    }
    getDistanceByRoute(from, to) {
        // Упрощенная база расстояний (из анализа АвтоГОСТ)
        const routes = new Map([
            ['москва-санкт-петербург', 700],
            ['москва-нижний новгород', 400],
            ['москва-екатеринбург', 1400],
            ['москва-казань', 800],
            ['москва-ростов-на-дону', 1100],
            ['москва-новосибирск', 3300]
        ]);
        const routeKey = `${from.toLowerCase()}-${to.toLowerCase()}`;
        const reverseKey = `${to.toLowerCase()}-${from.toLowerCase()}`;
        return routes.get(routeKey) ?? routes.get(reverseKey) ?? 500;
    }
    getRoutePopularity(from, to) {
        const popularCities = ['москва', 'санкт-петербург', 'екатеринбург', 'казань'];
        const fromLower = from.toLowerCase();
        const toLower = to.toLowerCase();
        if (popularCities.some(city => fromLower.includes(city)) &&
            popularCities.some(city => toLower.includes(city))) {
            return 'high';
        }
        return 'medium';
    }
    isMarketplaceHub(cityName) {
        const hubs = ['коледино', 'софьино', 'белые столбы', 'тверь'];
        return hubs.some(hub => cityName.toLowerCase().includes(hub));
    }
    getDeliveryZone(cityName) {
        const city = cityName.toLowerCase();
        if (city.includes('москва') || city.includes('московск'))
            return 'moscow';
        if (city.includes('санкт-петербург') || city.includes('спб'))
            return 'spb';
        return 'federal';
    }
    calculateDeliveryTime(distance) {
        if (distance < 500)
            return '1-2 дня';
        if (distance < 1000)
            return '2-3 дня';
        if (distance < 2000)
            return '3-4 дня';
        if (distance < 3000)
            return '4-5 дней';
        return '5-7 дней';
    }
    calculateFullTruckPrice(from, to) {
        const distance = this.getDistanceByRoute(from, to);
        const basePrice = 25000; // минимум для отдельной машины
        const kmPrice = distance < 50 ? 500 : 200;
        return Math.max(basePrice, distance * kmPrice);
    }
    getRestrictions(data) {
        const restrictions = [];
        if (data.cargoType === 'dangerous') {
            restrictions.push('Требуется специальное разрешение на перевозку опасных грузов');
        }
        if (data.cargoType === 'valuable') {
            restrictions.push('Требуется дополнительное страхование ценного груза');
        }
        if (data.weight > 10000) {
            restrictions.push('Возможны ограничения по маршруту для тяжелых грузов');
        }
        return restrictions;
    }
    getRecommendations(data, factors) {
        const recommendations = [];
        if (factors.loadFactor > 1.3) {
            recommendations.push('Рассмотрите консолидацию с другими грузами для снижения стоимости');
        }
        if (data.urgency === 'emergency') {
            recommendations.push('Экстренная доставка доступна только для ограниченных маршрутов');
        }
        if (factors.seasonFactor > 1.0) {
            recommendations.push('В зимний период возможны задержки из-за погодных условий');
        }
        return recommendations;
    }
}
//# sourceMappingURL=calculator.js.map